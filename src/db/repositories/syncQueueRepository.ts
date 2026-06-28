// src/database/repositories/syncQueueRepository.ts
// ─────────────────────────────────────────────────────────────────────────────
// backend_handover.md 2.B: "Lists and appends mutations targeting
// high-throughput synchronization."
// AGENTS.md 4 Outbox Pattern.
// ─────────────────────────────────────────────────────────────────────────────

import { and, asc, eq, inArray, isNull, lte, or } from 'drizzle-orm';
import { db } from '../client';
import { syncQueue, type NewSyncQueueRow, type SyncQueueRow } from '../schema';

function nowMs(): number {
    return Date.now();
}

function newUUID(): string {
    return crypto.randomUUID();
}

export interface EnqueuePayload {
    table_name: string;
    record_id: string;
    operation: 'insert' | 'update' | 'delete' | 'approval_request';
    payload: Record<string, unknown>;
    requires_approval?: boolean;
}

export const syncQueueRepository = {
    // ── Append a pending mutation ─────────────────────────────────────────────
    async enqueue(entry: EnqueuePayload): Promise<SyncQueueRow> {
        const now = nowMs();

        const newRow: NewSyncQueueRow = {
            id: newUUID(),
            tableName: entry.table_name,
            recordId: entry.record_id,
            operation: entry.operation,
            payload: entry.payload,
            status: 'queued',
            attempts: 0,
            lastError: null,
            nextRetryAt: null,
            createdAt: now,
            updatedAt: now,
        };

        await db.insert(syncQueue).values(newRow);
        return newRow as SyncQueueRow; // Returning the row makes it easier to work with instantly
    },

    // ── List all pending entries (Optimized with filter, order, and limit) ─────
    async listPending(limit = 50): Promise<SyncQueueRow[]> {
        return db
            .select()
            .from(syncQueue)
            .where(eq(syncQueue.status, 'queued'))
            .orderBy(asc(syncQueue.createdAt))
            .limit(limit);
    },

    async listReady(limit = 50, now = nowMs()): Promise<SyncQueueRow[]> {
        return db
            .select()
            .from(syncQueue)
            .where(
                and(
                    inArray(syncQueue.status, ['queued', 'failed']),
                    or(isNull(syncQueue.nextRetryAt), lte(syncQueue.nextRetryAt, now))
                )
            )
            .orderBy(asc(syncQueue.createdAt))
            .limit(limit);
    },

    // ── List pending entries for a specific table ─────────────────────────────
    async listPendingForTable(tableName: string, limit = 50): Promise<SyncQueueRow[]> {
        return db
            .select()
            .from(syncQueue)
            .where(
                and(
                    eq(syncQueue.tableName, tableName),
                    eq(syncQueue.status, 'queued')
                )
            )
            .orderBy(asc(syncQueue.createdAt))
            .limit(limit);
    },

    async markProcessing(id: string): Promise<void> {
        await db
            .update(syncQueue)
            .set({
                status: 'processing',
                updatedAt: nowMs(),
            })
            .where(eq(syncQueue.id, id));
    },

    async markQueued(id: string): Promise<void> {
        await db
            .update(syncQueue)
            .set({
                status: 'queued',
                updatedAt: nowMs(),
            })
            .where(eq(syncQueue.id, id));
    },

    // ── Remove entry after successful sync ────────────────────────────────────
    async dequeue(id: string): Promise<void> {
        await db.delete(syncQueue).where(eq(syncQueue.id, id));
    },

    // ── Record a failed sync attempt for retry tracking ───────────────────────
    async recordFailure(id: string, errorMessage: string): Promise<void> {
        const rows = await db.select().from(syncQueue).where(eq(syncQueue.id, id)).limit(1);
        if (rows.length === 0) return;

        const attempts = rows[0].attempts + 1;
        const retryDelayMs = Math.min(60_000 * 2 ** Math.max(attempts - 1, 0), 30 * 60_000);

        await db
            .update(syncQueue)
            .set({
                status: 'failed',
                attempts,
                lastError: errorMessage,
                nextRetryAt: nowMs() + retryDelayMs,
                updatedAt: nowMs() // Always update the timestamp on change!
            })
            .where(eq(syncQueue.id, id));
    },
};
