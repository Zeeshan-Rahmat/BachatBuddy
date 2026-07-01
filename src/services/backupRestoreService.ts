import { db, initializeLocalDatabase } from '@/src/db/client';
import { backupMetadataRepository } from '@/src/db/repositories/backupMetadataRepository';
import {
    authSessions,
    backupMetadata,
    customers,
    invoiceCustomization,
    invoiceItems,
    invoices,
    products,
    suppliers,
    syncQueue,
    users,
    type AuthSessionRow,
    type BackupMetadataRow,
    type CustomerRow,
    type InvoiceCustomizationRow,
    type InvoiceItemRow,
    type InvoiceRow,
    type ProductRow,
    type SupplierRow,
    type SyncQueueRow,
    type UserRow,
} from '@/src/db/schema';
import { supabase } from '@/src/lib/supabase';

const BACKUP_BUCKET = 'bachatbuddy-backups';
const BACKUP_SCHEMA_VERSION = 1;
const BACKUP_SIGNED_URL_TTL_SECONDS = 60;

type BackupTableName =
    | 'users'
    | 'auth_sessions'
    | 'customers'
    | 'suppliers'
    | 'products'
    | 'invoices'
    | 'invoice_items'
    | 'invoice_customization'
    | 'sync_queue';

type BackupRecordCounts = Record<BackupTableName, number>;

type BackupSnapshot = {
    schemaVersion: number;
    backupId: string;
    businessId: string;
    createdByUserId: string;
    createdAt: number;
    tables: {
        users: UserRow[];
        authSessions: AuthSessionRow[];
        customers: CustomerRow[];
        suppliers: SupplierRow[];
        products: ProductRow[];
        invoices: InvoiceRow[];
        invoiceItems: InvoiceItemRow[];
        invoiceCustomization: InvoiceCustomizationRow[];
        syncQueue: SyncQueueRow[];
    };
};

export type BackupRestoreResult<T> = {
    success: boolean;
    data?: T;
    error?: string;
    upToDate?: boolean;
};

export type BackupSummary = {
    backupId: string;
    storagePath: string;
    createdAt: number;
    sizeBytes: number;
    recordCounts: BackupRecordCounts;
};

export type RestoreSummary = BackupSummary & {
    restoredAt: number;
};

function normalizeError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

function encodeJson(value: string): Uint8Array {
    return new TextEncoder().encode(value);
}

function toExactArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    return buffer;
}

function encodeJsonBytes(value: string): number {
    return encodeJson(value).byteLength;
}

function buildRecordCounts(snapshot: BackupSnapshot): BackupRecordCounts {
    return {
        users: snapshot.tables.users.length,
        auth_sessions: snapshot.tables.authSessions.length,
        customers: snapshot.tables.customers.length,
        suppliers: snapshot.tables.suppliers.length,
        products: snapshot.tables.products.length,
        invoices: snapshot.tables.invoices.length,
        invoice_items: snapshot.tables.invoiceItems.length,
        invoice_customization: snapshot.tables.invoiceCustomization.length,
        sync_queue: snapshot.tables.syncQueue.length,
    };
}

function getSnapshotLastChangedAt(snapshot: BackupSnapshot): number {
    const timestamps = [
        ...snapshot.tables.users.map((row) => row.updatedAt || row.createdAt),
        ...snapshot.tables.customers.map((row) => row.updatedAt || row.createdAt),
        ...snapshot.tables.suppliers.map((row) => row.updatedAt || row.createdAt),
        ...snapshot.tables.products.map((row) => row.updatedAt || row.createdAt),
        ...snapshot.tables.invoices.map((row) => row.updatedAt || row.createdAt),
        ...snapshot.tables.invoiceItems.map((row) => row.updatedAt || row.createdAt),
        ...snapshot.tables.invoiceCustomization.map((row) => row.updatedAt || row.createdAt),
    ];

    return timestamps.reduce((latest, timestamp) => Math.max(latest, timestamp || 0), 0);
}

function buildBackupStoragePath(businessId: string, backupId: string): string {
    return `${businessId}/${backupId}.json`;
}

function buildLatestStoragePath(businessId: string): string {
    return `${businessId}/latest.json`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

function readBlobWithFileReader(data: object): Promise<string> {
    return new Promise((resolve, reject) => {
        if (typeof FileReader === 'undefined') {
            reject(new Error('FileReader is not available for this backup download.'));
            return;
        }

        const reader = new FileReader();
        reader.onerror = () => {
            reject(new Error('Unable to read downloaded backup file with FileReader.'));
        };
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
                return;
            }

            if (reader.result instanceof ArrayBuffer) {
                resolve(new TextDecoder().decode(reader.result));
                return;
            }

            reject(new Error('Downloaded backup file had an unsupported FileReader result.'));
        };
        reader.readAsText(data as Blob);
    });
}

async function readStorageDownloadText(data: unknown): Promise<string> {
    if (typeof data === 'string') {
        return data;
    }

    if (data instanceof ArrayBuffer) {
        return new TextDecoder().decode(data);
    }

    if (ArrayBuffer.isView(data)) {
        return new TextDecoder().decode(data);
    }

    if (data && typeof data === 'object' && 'text' in data && typeof data.text === 'function') {
        return data.text() as Promise<string>;
    }

    if (data && typeof data === 'object' && 'arrayBuffer' in data && typeof data.arrayBuffer === 'function') {
        const buffer = await data.arrayBuffer() as ArrayBuffer;
        return new TextDecoder().decode(buffer);
    }

    if (data && typeof data === 'object') {
        return readBlobWithFileReader(data);
    }

    throw new Error('Unable to read downloaded backup file.');
}

function parseSnapshot(value: unknown): BackupSnapshot {
    if (!isRecord(value)) {
        throw new Error('Backup file is not a valid object.');
    }

    if (value.schemaVersion !== BACKUP_SCHEMA_VERSION) {
        throw new Error('Backup file was created with an unsupported schema version.');
    }

    if (
        typeof value.backupId !== 'string'
        || typeof value.businessId !== 'string'
        || typeof value.createdByUserId !== 'string'
        || typeof value.createdAt !== 'number'
        || !isRecord(value.tables)
    ) {
        throw new Error('Backup file is missing required metadata.');
    }

    const tables = value.tables;

    if (
        !isArray(tables.users)
        || !isArray(tables.authSessions)
        || !isArray(tables.customers)
        || !isArray(tables.suppliers)
        || !isArray(tables.products)
        || !isArray(tables.invoices)
        || !isArray(tables.invoiceItems)
        || !isArray(tables.syncQueue)
    ) {
        throw new Error('Backup file is missing one or more local tables.');
    }

    if (!isArray(tables.invoiceCustomization)) {
        tables.invoiceCustomization = [];
    }

    return value as BackupSnapshot;
}

async function createSnapshot(userId: string, businessId: string): Promise<BackupSnapshot> {
    const backupId = crypto.randomUUID();
    const createdAt = Date.now();

    const [
        userRows,
        sessionRows,
        customerRows,
        supplierRows,
        productRows,
        invoiceRows,
        invoiceItemRows,
        invoiceCustomizationRows,
        queueRows,
    ] = await Promise.all([
        db.select().from(users),
        db.select().from(authSessions),
        db.select().from(customers),
        db.select().from(suppliers),
        db.select().from(products),
        db.select().from(invoices),
        db.select().from(invoiceItems),
        db.select().from(invoiceCustomization),
        db.select().from(syncQueue),
    ]);

    return {
        schemaVersion: BACKUP_SCHEMA_VERSION,
        backupId,
        businessId,
        createdByUserId: userId,
        createdAt,
        tables: {
            users: userRows,
            authSessions: sessionRows,
            customers: customerRows,
            suppliers: supplierRows,
            products: productRows,
            invoices: invoiceRows,
            invoiceItems: invoiceItemRows,
            invoiceCustomization: invoiceCustomizationRows,
            syncQueue: queueRows,
        },
    };
}

async function uploadSnapshot(snapshot: BackupSnapshot, json: string): Promise<string> {
    const versionedPath = buildBackupStoragePath(snapshot.businessId, snapshot.backupId);
    const latestPath = buildLatestStoragePath(snapshot.businessId);
    const backupBytes = encodeJson(json);
    const body = toExactArrayBuffer(backupBytes);

    const versionedUpload = await supabase.storage
        .from(BACKUP_BUCKET)
        .upload(versionedPath, body, {
            contentType: 'application/json',
            upsert: true,
        });

    if (versionedUpload.error) {
        throw new Error(versionedUpload.error.message);
    }

    const latestUpload = await supabase.storage
        .from(BACKUP_BUCKET)
        .upload(latestPath, toExactArrayBuffer(backupBytes), {
            contentType: 'application/json',
            upsert: true,
        });

    if (latestUpload.error) {
        throw new Error(latestUpload.error.message);
    }

    return versionedPath;
}

async function upsertRemoteManifest(summary: BackupSummary, businessId: string, userId: string): Promise<void> {
    const { error } = await supabase
        .from('backup_manifests')
        .upsert({
            id: summary.backupId,
            business_id: businessId,
            created_by_user_id: userId,
            storage_path: summary.storagePath,
            size_bytes: summary.sizeBytes,
            record_counts: summary.recordCounts,
            status: 'completed',
            updated_at: summary.createdAt,
            created_at: summary.createdAt,
        }, { onConflict: 'id' });

    if (error) {
        throw new Error(error.message);
    }
}

async function saveLocalMetadata(summary: BackupSummary, businessId: string, userId: string): Promise<BackupMetadataRow> {
    return backupMetadataRepository.upsertCompleted({
        id: summary.backupId,
        businessId,
        userId,
        backupId: summary.backupId,
        storagePath: summary.storagePath,
        status: 'completed',
        sizeBytes: summary.sizeBytes,
        recordCounts: summary.recordCounts,
        lastError: null,
        restoredAt: null,
        updatedAt: summary.createdAt,
        createdAt: summary.createdAt,
    });
}

async function downloadLatestSnapshot(businessId: string): Promise<BackupSnapshot> {
    const storagePath = buildLatestStoragePath(businessId);
    const { data, error } = await supabase.storage
        .from(BACKUP_BUCKET)
        .download(storagePath);

    if (error) {
        throw new Error(error.message);
    }

    let text: string;

    try {
        text = await readStorageDownloadText(data);
    } catch {
        const signedUrlResult = await supabase.storage
            .from(BACKUP_BUCKET)
            .createSignedUrl(storagePath, BACKUP_SIGNED_URL_TTL_SECONDS);

        if (signedUrlResult.error) {
            throw new Error(signedUrlResult.error.message);
        }

        const response = await fetch(signedUrlResult.data.signedUrl);

        if (!response.ok) {
            throw new Error('Unable to download the latest backup file.');
        }

        text = await response.text();
    }

    return parseSnapshot(JSON.parse(text) as unknown);
}

async function restoreSnapshot(snapshot: BackupSnapshot): Promise<void> {
    await db.transaction((tx) => {
        tx.delete(backupMetadata).run();
        tx.delete(syncQueue).run();
        tx.delete(invoiceCustomization).run();
        tx.delete(invoiceItems).run();
        tx.delete(invoices).run();
        tx.delete(products).run();
        tx.delete(suppliers).run();
        tx.delete(customers).run();
        tx.delete(authSessions).run();
        tx.delete(users).run();

        if (snapshot.tables.users.length > 0) tx.insert(users).values(snapshot.tables.users).run();
        if (snapshot.tables.authSessions.length > 0) tx.insert(authSessions).values(snapshot.tables.authSessions).run();
        if (snapshot.tables.customers.length > 0) tx.insert(customers).values(snapshot.tables.customers).run();
        if (snapshot.tables.suppliers.length > 0) tx.insert(suppliers).values(snapshot.tables.suppliers).run();
        if (snapshot.tables.products.length > 0) tx.insert(products).values(snapshot.tables.products).run();
        if (snapshot.tables.invoices.length > 0) tx.insert(invoices).values(snapshot.tables.invoices).run();
        if (snapshot.tables.invoiceItems.length > 0) tx.insert(invoiceItems).values(snapshot.tables.invoiceItems).run();
        if (snapshot.tables.invoiceCustomization.length > 0) tx.insert(invoiceCustomization).values(snapshot.tables.invoiceCustomization).run();
        if (snapshot.tables.syncQueue.length > 0) tx.insert(syncQueue).values(snapshot.tables.syncQueue).run();
    });
}

export const backupRestoreService = {
    async getLastBackup(businessId: string): Promise<BackupMetadataRow | null> {
        await initializeLocalDatabase();
        return backupMetadataRepository.getLatestForBusiness(businessId);
    },

    async backupCurrentData(userId: string, businessId: string): Promise<BackupRestoreResult<BackupSummary>> {
        try {
            await initializeLocalDatabase();
            const snapshot = await createSnapshot(userId, businessId);
            const latestBackup = await backupMetadataRepository.getLatestForBusiness(businessId);
            const lastChangedAt = getSnapshotLastChangedAt(snapshot);

            if (latestBackup && lastChangedAt <= latestBackup.createdAt) {
                return {
                    success: true,
                    upToDate: true,
                    data: {
                        backupId: latestBackup.backupId,
                        storagePath: latestBackup.storagePath,
                        createdAt: latestBackup.createdAt,
                        sizeBytes: latestBackup.sizeBytes,
                        recordCounts: latestBackup.recordCounts as BackupRecordCounts,
                    },
                };
            }

            const json = JSON.stringify(snapshot);
            const storagePath = await uploadSnapshot(snapshot, json);
            const summary: BackupSummary = {
                backupId: snapshot.backupId,
                storagePath,
                createdAt: snapshot.createdAt,
                sizeBytes: encodeJsonBytes(json),
                recordCounts: buildRecordCounts(snapshot),
            };

            await upsertRemoteManifest(summary, businessId, userId);
            await saveLocalMetadata(summary, businessId, userId);

            return { success: true, data: summary };
        } catch (error) {
            return { success: false, error: normalizeError(error) };
        }
    },

    async restoreLatestBackup(userId: string, businessId: string): Promise<BackupRestoreResult<RestoreSummary>> {
        try {
            await initializeLocalDatabase();
            const snapshot = await downloadLatestSnapshot(businessId);

            if (snapshot.businessId !== businessId) {
                throw new Error('Backup belongs to a different business.');
            }

            await restoreSnapshot(snapshot);

            const summary: RestoreSummary = {
                backupId: snapshot.backupId,
                storagePath: buildBackupStoragePath(snapshot.businessId, snapshot.backupId),
                createdAt: snapshot.createdAt,
                sizeBytes: encodeJsonBytes(JSON.stringify(snapshot)),
                recordCounts: buildRecordCounts(snapshot),
                restoredAt: Date.now(),
            };

            await saveLocalMetadata(summary, businessId, userId);
            await backupMetadataRepository.markRestored(summary.backupId);

            return { success: true, data: summary };
        } catch (error) {
            return { success: false, error: normalizeError(error) };
        }
    },
};
