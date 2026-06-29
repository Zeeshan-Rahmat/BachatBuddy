import { syncQueueRepository } from '@/src/db/repositories/syncQueueRepository';
import { sqlite } from '@/src/db/client';
import { supabase } from '@/src/lib/supabase';
import type { SyncQueueRow } from '@/src/db/schema';
import { prepareRemotePayloadMedia } from './mediaStorageService';
import { setSyncQueueRequestHandler } from './syncQueueNotifier';

const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_INTERVAL_MS = 60_000;

const syncableTableNames = [
    'users',
    'employees',
    'customers',
    'suppliers',
    'products',
    'invoices',
    'invoice_items',
] as const;

type SyncableTableName = typeof syncableTableNames[number];
type RemotePayload = Record<string, unknown>;

type ProcessQueueOptions = {
    limit?: number;
};

export type SyncQueueProcessorResult = {
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
    errors: string[];
};

const syncableTableSet = new Set<string>(syncableTableNames);
let intervalId: ReturnType<typeof setInterval> | null = null;
let isProcessing = false;

function isSyncableTableName(tableName: string): tableName is SyncableTableName {
    return syncableTableSet.has(tableName);
}

function camelToSnake(value: string): string {
    return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toRemotePayload(payload: unknown): RemotePayload {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return {};
    }

    return Object.entries(payload).reduce<RemotePayload>((remotePayload, [key, value]) => {
        remotePayload[camelToSnake(key)] = value;
        return remotePayload;
    }, {});
}

function normalizeError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

function getPayloadUpdatedAt(payload: unknown): number | null {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return null;
    }

    const values = payload as Record<string, unknown>;
    const updatedAt = values.updatedAt ?? values.updated_at;

    return typeof updatedAt === 'number' ? updatedAt : null;
}

function isEmployeePayload(payload: unknown): boolean {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return false;
    }

    const values = payload as Record<string, unknown>;
    return values.role === 'employee';
}

function getRemoteTableName(entry: SyncQueueRow): SyncableTableName {
    if (entry.tableName === 'users' && isEmployeePayload(entry.payload)) {
        return 'employees';
    }

    return entry.tableName as SyncableTableName;
}

function getLocalTableName(tableName: SyncableTableName): string {
    return tableName === 'employees' ? 'users' : tableName;
}

async function pushApprovalRequest(entry: SyncQueueRow): Promise<void> {
    const remotePayload = await prepareRemotePayloadMedia(
        entry.tableName,
        entry.recordId,
        toRemotePayload(entry.payload)
    );
    const now = Date.now();

    const { error } = await supabase
        .from('staging_review_queue')
        .insert({
            id: crypto.randomUUID(),
            source_table: entry.tableName,
            source_record_id: entry.recordId,
            operation: entry.operation,
            payload: remotePayload,
            status: 'pending',
            updated_at: now,
            created_at: now,
        });

    if (error) {
        throw new Error(error.message);
    }
}

async function pushRemoteMutation(entry: SyncQueueRow): Promise<void> {
    if (!isSyncableTableName(entry.tableName)) {
        throw new Error(`Unsupported sync table: ${entry.tableName}`);
    }

    const remoteTableName = getRemoteTableName(entry);

    if (entry.operation === 'approval_request') {
        await pushApprovalRequest(entry);
        return;
    }

    if (entry.operation === 'delete') {
        const { error } = await supabase
            .from(remoteTableName)
            .delete()
            .eq('id', entry.recordId);

        if (error) {
            throw new Error(error.message);
        }

        return;
    }

    const remotePayload = {
        ...await prepareRemotePayloadMedia(
            remoteTableName,
            entry.recordId,
            toRemotePayload(entry.payload)
        ),
        sync_status: 'synced',
    };

    const { error } = await supabase
        .from(remoteTableName)
        .upsert(remotePayload, { onConflict: 'id' });

    if (error) {
        throw new Error(error.message);
    }
}

async function markLocalRecordSynced(entry: SyncQueueRow): Promise<void> {
    if (!isSyncableTableName(entry.tableName) || entry.operation === 'approval_request') {
        return;
    }

    const payloadUpdatedAt = getPayloadUpdatedAt(entry.payload);
    const localTableName = getLocalTableName(entry.tableName);

    if (entry.operation === 'delete') {
        if (payloadUpdatedAt) {
            await sqlite.runAsync(
                `DELETE FROM ${localTableName} WHERE id = ? AND updated_at = ?`,
                entry.recordId,
                payloadUpdatedAt
            );
            return;
        }

        await sqlite.runAsync(`DELETE FROM ${localTableName} WHERE id = ?`, entry.recordId);
        return;
    }

    if (payloadUpdatedAt) {
        await sqlite.runAsync(
            `UPDATE ${localTableName} SET sync_status = ? WHERE id = ? AND updated_at = ?`,
            'synced',
            entry.recordId,
            payloadUpdatedAt
        );
        return;
    }

    await sqlite.runAsync(
        `UPDATE ${localTableName} SET sync_status = ? WHERE id = ?`,
        'synced',
        entry.recordId
    );
}

async function processQueueEntry(entry: SyncQueueRow): Promise<void> {
    await syncQueueRepository.markProcessing(entry.id);
    await pushRemoteMutation(entry);
    await markLocalRecordSynced(entry);
    await syncQueueRepository.dequeue(entry.id);
}

export async function processSyncQueue(
    options: ProcessQueueOptions = {}
): Promise<SyncQueueProcessorResult> {
    if (isProcessing) {
        return {
            processed: 0,
            succeeded: 0,
            failed: 0,
            skipped: 0,
            errors: [],
        };
    }

    isProcessing = true;

    const result: SyncQueueProcessorResult = {
        processed: 0,
        succeeded: 0,
        failed: 0,
        skipped: 0,
        errors: [],
    };

    try {
        const entries = await syncQueueRepository.listReady(options.limit ?? DEFAULT_BATCH_SIZE);

        for (const entry of entries) {
            result.processed += 1;

            try {
                await processQueueEntry(entry);
                result.succeeded += 1;
            } catch (error) {
                const message = normalizeError(error);
                await syncQueueRepository.recordFailure(entry.id, message);
                result.failed += 1;
                result.errors.push(message);
            }
        }
    } finally {
        isProcessing = false;
    }

    return result;
}

export function startSyncQueueProcessor(intervalMs = DEFAULT_INTERVAL_MS): void {
    setSyncQueueRequestHandler(() => {
        void processSyncQueue();
    });

    if (intervalId) {
        return;
    }

    void processSyncQueue();
    intervalId = setInterval(() => {
        void processSyncQueue();
    }, intervalMs);
}

export function stopSyncQueueProcessor(): void {
    setSyncQueueRequestHandler(null);

    if (!intervalId) {
        return;
    }

    clearInterval(intervalId);
    intervalId = null;
}
