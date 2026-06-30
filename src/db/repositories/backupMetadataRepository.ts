import { desc, eq } from 'drizzle-orm';
import { db } from '../client';
import { backupMetadata, type BackupMetadataRow, type NewBackupMetadataRow } from '../schema';

function nowMs(): number {
    return Date.now();
}

export const backupMetadataRepository = {
    async getLatestForBusiness(businessId: string): Promise<BackupMetadataRow | null> {
        const rows = await db
            .select()
            .from(backupMetadata)
            .where(eq(backupMetadata.businessId, businessId))
            .orderBy(desc(backupMetadata.createdAt))
            .limit(1);

        return rows[0] ?? null;
    },

    async upsertCompleted(row: NewBackupMetadataRow): Promise<BackupMetadataRow> {
        await db
            .insert(backupMetadata)
            .values(row)
            .onConflictDoUpdate({
                target: backupMetadata.id,
                set: {
                    backupId: row.backupId,
                    storagePath: row.storagePath,
                    status: row.status,
                    sizeBytes: row.sizeBytes,
                    recordCounts: row.recordCounts,
                    lastError: row.lastError ?? null,
                    restoredAt: row.restoredAt ?? null,
                    updatedAt: row.updatedAt,
                },
            });

        const saved = await db
            .select()
            .from(backupMetadata)
            .where(eq(backupMetadata.id, row.id))
            .limit(1);

        if (!saved[0]) {
            throw new Error('Unable to load saved backup metadata.');
        }

        return saved[0];
    },

    async markRestored(id: string): Promise<void> {
        const now = nowMs();
        await db
            .update(backupMetadata)
            .set({
                status: 'restored',
                restoredAt: now,
                updatedAt: now,
            })
            .where(eq(backupMetadata.id, id));
    },
};
