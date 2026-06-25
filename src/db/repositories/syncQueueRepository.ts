import { desc, eq } from 'drizzle-orm';
import { db } from '../client';
import { syncQueue, type NewSyncQueueRow, type SyncQueueRow } from '../schema';

type QueueOperation = NewSyncQueueRow['operation'];

type QueueMutationInput = {
    tableName: string;
    recordId: string;
    operation: QueueOperation;
    payload: Record<string, unknown>;
};

export const enqueueSyncMutation = async ({
    tableName,
    recordId,
    operation,
    payload,
}: QueueMutationInput): Promise<SyncQueueRow> => {
    const now = Date.now();
    const queueRow: NewSyncQueueRow = {
        id: crypto.randomUUID(),
        tableName,
        recordId,
        operation,
        payload,
        status: 'queued',
        attempts: 0,
        updatedAt: now,
        createdAt: now,
    };

    await db.insert(syncQueue).values(queueRow);

    return queueRow as SyncQueueRow;
};

export const listQueuedSyncMutations = async (limit = 50): Promise<SyncQueueRow[]> => {
    return db
        .select()
        .from(syncQueue)
        .where(eq(syncQueue.status, 'queued'))
        .orderBy(desc(syncQueue.createdAt))
        .limit(limit);
};
