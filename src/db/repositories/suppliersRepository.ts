import { desc, eq, ne } from 'drizzle-orm';
import { requestSyncQueueProcessing } from '@/src/services/syncQueueNotifier';
import { db } from '../client';
import { suppliers, syncQueue, type NewSupplierRow, type NewSyncQueueRow, type SupplierRow } from '../schema';

export type CreateSupplierInput = {
    createdById?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    status?: SupplierRow['status'];
    suppliedProducts?: number;
    totalSupplyValue?: number;
    img?: string | null;
    lastSuppliedDate?: number | null;
    requiresApproval?: boolean;
};

export type UpdateSupplierInput = Partial<Omit<CreateSupplierInput, 'createdById'>> & {
    lastUpdatedById?: string | null;
};

const buildQueueRow = (
    recordId: string,
    operation: NewSyncQueueRow['operation'],
    payload: Record<string, unknown>,
    now: number,
    approvalOperation?: 'insert' | 'update' | 'delete',
): NewSyncQueueRow => ({
    id: crypto.randomUUID(),
    tableName: 'suppliers',
    recordId,
    operation,
    payload: approvalOperation ? { ...payload, approvalOperation } : payload,
    status: 'queued',
    attempts: 0,
    lastError: null,
    nextRetryAt: null,
    updatedAt: now,
    createdAt: now,
});

export const listSuppliers = async (): Promise<SupplierRow[]> => {
    return db
        .select()
        .from(suppliers)
        .where(ne(suppliers.syncStatus, 'pending_delete'))
        .orderBy(desc(suppliers.updatedAt));
};

export const listSuppliersWithRelations = async () => {
    return db.query.suppliers.findMany({
        where: ne(suppliers.syncStatus, 'pending_delete'),
        with: {
            createdBy: true,
            lastUpdatedBy: true,
        },
        orderBy: desc(suppliers.updatedAt),
    });
};

export const getSupplierById = async (id: string): Promise<SupplierRow | undefined> => {
    return db.query.suppliers.findFirst({
        where: eq(suppliers.id, id),
    });
};

export const createSupplier = async (input: CreateSupplierInput): Promise<SupplierRow> => {
    const now = Date.now();
    const supplier: NewSupplierRow = {
        id: crypto.randomUUID(),
        createdById: input.createdById ?? null,
        lastUpdatedById: input.createdById ?? null,
        name: input.name,
        phone: input.phone ?? null,
        email: input.email ?? null,
        address: input.address ?? null,
        status: input.status ?? 'Active',
        suppliedProducts: input.suppliedProducts ?? 0,
        totalSupplyValue: input.totalSupplyValue ?? 0,
        img: input.img ?? null,
        lastSuppliedDate: input.lastSuppliedDate ?? null,
        syncStatus: input.requiresApproval ? 'pending_approval' : 'pending_insert',
        updatedAt: now,
        createdAt: now,
    };
    const queueRow = buildQueueRow(
        supplier.id,
        input.requiresApproval ? 'approval_request' : 'insert',
        supplier,
        now,
        input.requiresApproval ? 'insert' : undefined,
    );

    db.transaction((tx) => {
        tx.insert(suppliers).values(supplier).run();
        tx.insert(syncQueue).values(queueRow).run();
    });
    requestSyncQueueProcessing();

    return supplier as SupplierRow;
};

export const updateSupplier = async (id: string, input: UpdateSupplierInput): Promise<SupplierRow | undefined> => {
    const existing = await getSupplierById(id);

    if (!existing) {
        return undefined;
    }

    const now = Date.now();
    const updatedSupplier: SupplierRow = {
        ...existing,
        lastUpdatedById: input.lastUpdatedById ?? existing.lastUpdatedById,
        name: input.name ?? existing.name,
        phone: input.phone ?? existing.phone,
        email: input.email ?? existing.email,
        address: input.address ?? existing.address,
        status: input.status ?? existing.status,
        suppliedProducts: input.suppliedProducts ?? existing.suppliedProducts,
        totalSupplyValue: input.totalSupplyValue ?? existing.totalSupplyValue,
        img: input.img ?? existing.img,
        lastSuppliedDate: input.lastSuppliedDate ?? existing.lastSuppliedDate,
        syncStatus: input.requiresApproval
            ? 'pending_approval'
            : existing.syncStatus === 'pending_insert'
                ? 'pending_insert'
                : 'pending_update',
        updatedAt: now,
    };
    const queueRow = buildQueueRow(
        id,
        input.requiresApproval ? 'approval_request' : 'update',
        updatedSupplier,
        now,
        input.requiresApproval ? 'update' : undefined,
    );

    db.transaction((tx) => {
        tx.update(suppliers).set(updatedSupplier).where(eq(suppliers.id, id)).run();
        tx.insert(syncQueue).values(queueRow).run();
    });
    requestSyncQueueProcessing();

    return updatedSupplier;
};

export const markSupplierPendingDelete = async (id: string, requiresApproval = false): Promise<boolean> => {
    const existing = await getSupplierById(id);

    if (!existing) {
        return false;
    }

    const now = Date.now();
    const deletedSupplier: SupplierRow = {
        ...existing,
        syncStatus: requiresApproval ? 'pending_approval' : 'pending_delete',
        updatedAt: now,
    };
    const queueRow = buildQueueRow(
        id,
        requiresApproval ? 'approval_request' : 'delete',
        deletedSupplier,
        now,
        requiresApproval ? 'delete' : undefined,
    );

    db.transaction((tx) => {
        tx.update(suppliers).set(deletedSupplier).where(eq(suppliers.id, id)).run();
        tx.insert(syncQueue).values(queueRow).run();
    });
    requestSyncQueueProcessing();

    return true;
};

export const suppliersRepository = {
    listSuppliers,
    listSuppliersWithRelations,
    getSupplierById,
    createSupplier,
    updateSupplier,
    markSupplierPendingDelete,
};
