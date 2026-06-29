import { syncQueueRepository } from '@/src/db/repositories/syncQueueRepository';
import { sqlite } from '@/src/db/client';

type LocalMediaTable = 'users' | 'customers' | 'suppliers' | 'products' | 'invoices';
type MediaBackfillRow = Record<string, unknown> & {
    id: string;
    img?: string | null;
    business_logo?: string | null;
    sync_status?: string | null;
};

type MediaBackfillTableConfig = {
    tableName: LocalMediaTable;
    fields: ('img' | 'business_logo')[];
};

const MEDIA_BACKFILL_TABLES: MediaBackfillTableConfig[] = [
    { tableName: 'users', fields: ['img', 'business_logo'] },
    { tableName: 'customers', fields: ['img'] },
    { tableName: 'suppliers', fields: ['img'] },
    { tableName: 'products', fields: ['img'] },
    { tableName: 'invoices', fields: ['img'] },
];

function isUploadableLocalMediaUri(value: unknown): value is string {
    if (typeof value !== 'string') {
        return false;
    }

    const normalized = value.trim().toLowerCase();
    if (!normalized || normalized.startsWith('http://') || normalized.startsWith('https://')) {
        return false;
    }

    return normalized.startsWith('file://')
        || normalized.startsWith('content://')
        || normalized.startsWith('ph://')
        || normalized.startsWith('assets-library://')
        || normalized.startsWith('data:image/');
}

function hasUploadableMedia(row: MediaBackfillRow, fields: MediaBackfillTableConfig['fields']): boolean {
    return fields.some((field) => isUploadableLocalMediaUri(row[field]));
}

async function hasExistingQueueRow(tableName: LocalMediaTable, recordId: string): Promise<boolean> {
    const existing = await sqlite.getFirstAsync<{ id: string }>(
        `SELECT id FROM sync_queue WHERE table_name = ? AND record_id = ? LIMIT 1`,
        tableName,
        recordId
    );

    return !!existing;
}

async function markSyncedRecordPendingUpdate(tableName: LocalMediaTable, recordId: string): Promise<void> {
    await sqlite.runAsync(
        `UPDATE ${tableName} SET sync_status = ? WHERE id = ? AND sync_status = ?`,
        'pending_update',
        recordId,
        'synced'
    );
}

async function enqueueTableMediaBackfill(config: MediaBackfillTableConfig): Promise<number> {
    const rows = await sqlite.getAllAsync<MediaBackfillRow>(
        `SELECT * FROM ${config.tableName} WHERE sync_status != ?`,
        'pending_delete'
    );
    let enqueued = 0;

    for (const row of rows) {
        if (!row.id || !hasUploadableMedia(row, config.fields)) {
            continue;
        }

        if (await hasExistingQueueRow(config.tableName, row.id)) {
            continue;
        }

        await markSyncedRecordPendingUpdate(config.tableName, row.id);
        await syncQueueRepository.enqueue({
            table_name: config.tableName,
            record_id: row.id,
            operation: 'update',
            payload: row,
        });
        enqueued += 1;
    }

    return enqueued;
}

export async function enqueueExistingLocalMediaUploads(): Promise<number> {
    let enqueued = 0;

    for (const tableConfig of MEDIA_BACKFILL_TABLES) {
        enqueued += await enqueueTableMediaBackfill(tableConfig);
    }

    return enqueued;
}
