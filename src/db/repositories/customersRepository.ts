import { desc, eq, ne } from 'drizzle-orm';
import { db } from '../client';
import { customers, syncQueue, type CustomerRow, type NewCustomerRow, type NewSyncQueueRow } from '../schema';

export type CreateCustomerInput = {
    createdById?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    status?: CustomerRow['status'];
    totalPurchases?: number;
    pendingDues?: number;
    totalOrders?: number;
    img?: string | null;
    lastPurchaseDate?: number | null;
    requiresApproval?: boolean;
};

export type UpdateCustomerInput = Partial<Omit<CreateCustomerInput, 'createdById'>> & {
    lastUpdatedById?: string | null;
};

const buildQueueRow = (
    recordId: string,
    operation: NewSyncQueueRow['operation'],
    payload: Record<string, unknown>,
    now: number,
): NewSyncQueueRow => ({
    id: crypto.randomUUID(),
    tableName: 'customers',
    recordId,
    operation,
    payload,
    status: 'queued',
    attempts: 0,
    lastError: null,
    nextRetryAt: null,
    updatedAt: now,
    createdAt: now,
});

export const listCustomers = async (): Promise<CustomerRow[]> => {
    return db
        .select()
        .from(customers)
        .where(ne(customers.syncStatus, 'pending_delete'))
        .orderBy(desc(customers.updatedAt));
};

export const listCustomersWithRelations = async () => {
    return db.query.customers.findMany({
        where: ne(customers.syncStatus, 'pending_delete'),
        with: {
            createdBy: true,
            lastUpdatedBy: true,
        },
        orderBy: desc(customers.updatedAt),
    });
};

export const getCustomerById = async (id: string): Promise<CustomerRow | undefined> => {
    return db.query.customers.findFirst({
        where: eq(customers.id, id),
    });
};

export const createCustomer = async (input: CreateCustomerInput): Promise<CustomerRow> => {
    const now = Date.now();
    const customer: NewCustomerRow = {
        id: crypto.randomUUID(),
        createdById: input.createdById ?? null,
        lastUpdatedById: input.createdById ?? null,
        name: input.name,
        phone: input.phone ?? null,
        email: input.email ?? null,
        address: input.address ?? null,
        status: input.status ?? 'Active',
        totalPurchases: input.totalPurchases ?? 0,
        pendingDues: input.pendingDues ?? 0,
        totalOrders: input.totalOrders ?? 0,
        img: input.img ?? null,
        lastPurchaseDate: input.lastPurchaseDate ?? null,
        syncStatus: input.requiresApproval ? 'pending_approval' : 'pending_insert',
        updatedAt: now,
        createdAt: now,
    };
    const queueRow = buildQueueRow(
        customer.id,
        input.requiresApproval ? 'approval_request' : 'insert',
        customer,
        now,
    );

    db.transaction((tx) => {
        tx.insert(customers).values(customer).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return customer as CustomerRow;
};

export const updateCustomer = async (id: string, input: UpdateCustomerInput): Promise<CustomerRow | undefined> => {
    const existing = await getCustomerById(id);

    if (!existing) {
        return undefined;
    }

    const now = Date.now();
    const updatedCustomer: CustomerRow = {
        ...existing,
        lastUpdatedById: input.lastUpdatedById ?? existing.lastUpdatedById,
        name: input.name ?? existing.name,
        phone: input.phone ?? existing.phone,
        email: input.email ?? existing.email,
        address: input.address ?? existing.address,
        status: input.status ?? existing.status,
        totalPurchases: input.totalPurchases ?? existing.totalPurchases,
        pendingDues: input.pendingDues ?? existing.pendingDues,
        totalOrders: input.totalOrders ?? existing.totalOrders,
        img: input.img ?? existing.img,
        lastPurchaseDate: input.lastPurchaseDate ?? existing.lastPurchaseDate,
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
        updatedCustomer,
        now,
    );

    db.transaction((tx) => {
        tx.update(customers).set(updatedCustomer).where(eq(customers.id, id)).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return updatedCustomer;
};

export const markCustomerPendingDelete = async (id: string, requiresApproval = false): Promise<boolean> => {
    const existing = await getCustomerById(id);

    if (!existing) {
        return false;
    }

    const now = Date.now();
    const deletedCustomer: CustomerRow = {
        ...existing,
        syncStatus: requiresApproval ? 'pending_approval' : 'pending_delete',
        updatedAt: now,
    };
    const queueRow = buildQueueRow(
        id,
        requiresApproval ? 'approval_request' : 'delete',
        deletedCustomer,
        now,
    );

    db.transaction((tx) => {
        tx.update(customers).set(deletedCustomer).where(eq(customers.id, id)).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return true;
};

export const customersRepository = {
    listCustomers,
    listCustomersWithRelations,
    getCustomerById,
    createCustomer,
    updateCustomer,
    markCustomerPendingDelete,
};
