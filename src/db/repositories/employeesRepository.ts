import { and, desc, eq, ne } from 'drizzle-orm';
import { db } from '../client';
import { syncQueue, users, type NewSyncQueueRow, type NewUserRow, type UserRow } from '../schema';

export type CreateEmployeeInput = {
    businessId: string;
    businessName?: string | null;
    name: string;
    phone?: string | null;
    email: string;
    username: string;
    passwordHash?: string | null;
    status?: UserRow['status'];
    address?: string | null;
    img?: string | null;
    requiresApproval?: boolean;
};

export type UpdateEmployeeInput = Partial<Omit<CreateEmployeeInput, 'businessId'>> & {
    businessId?: string | null;
};

const buildQueueRow = (
    recordId: string,
    operation: NewSyncQueueRow['operation'],
    payload: Record<string, unknown>,
    now: number,
): NewSyncQueueRow => ({
    id: crypto.randomUUID(),
    tableName: 'employees',
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

export const listEmployees = async (businessId?: string): Promise<UserRow[]> => {
    const baseWhere = and(
        eq(users.role, 'employee'),
        ne(users.syncStatus, 'pending_delete'),
    );

    return db
        .select()
        .from(users)
        .where(businessId ? and(baseWhere, eq(users.businessId, businessId)) : baseWhere)
        .orderBy(desc(users.updatedAt));
};

export const getEmployeeById = async (id: string): Promise<UserRow | undefined> => {
    return db.query.users.findFirst({
        where: and(eq(users.id, id), eq(users.role, 'employee')),
    });
};

export const createEmployee = async (input: CreateEmployeeInput): Promise<UserRow> => {
    const now = Date.now();
    const employee: NewUserRow = {
        id: crypto.randomUUID(),
        businessId: input.businessId,
        businessName: input.businessName ?? null,
        name: input.name,
        phone: input.phone ?? null,
        businessPhone: null,
        email: input.email.trim().toLowerCase(),
        businessEmail: null,
        role: 'employee',
        username: input.username.trim().toLowerCase(),
        passwordHash: input.passwordHash ?? null,
        status: input.status ?? 'Active',
        biometricEnabled: false,
        address: input.address ?? null,
        businessAddress: null,
        businessLogo: null,
        img: input.img ?? null,
        syncStatus: input.requiresApproval ? 'pending_approval' : 'pending_insert',
        updatedAt: now,
        createdAt: now,
    };
    const queueRow = buildQueueRow(
        employee.id,
        input.requiresApproval ? 'approval_request' : 'insert',
        employee,
        now,
    );

    db.transaction((tx) => {
        tx.insert(users).values(employee).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return employee as UserRow;
};

export const updateEmployee = async (id: string, input: UpdateEmployeeInput): Promise<UserRow | undefined> => {
    const existing = await getEmployeeById(id);

    if (!existing) {
        return undefined;
    }

    const now = Date.now();
    const updatedEmployee: UserRow = {
        ...existing,
        businessId: input.businessId ?? existing.businessId,
        businessName: input.businessName ?? existing.businessName,
        name: input.name ?? existing.name,
        phone: input.phone ?? existing.phone,
        email: input.email ? input.email.trim().toLowerCase() : existing.email,
        username: input.username ? input.username.trim().toLowerCase() : existing.username,
        passwordHash: input.passwordHash ?? existing.passwordHash,
        status: input.status ?? existing.status,
        address: input.address ?? existing.address,
        img: input.img ?? existing.img,
        role: 'employee',
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
        updatedEmployee,
        now,
    );

    db.transaction((tx) => {
        tx.update(users).set(updatedEmployee).where(eq(users.id, id)).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return updatedEmployee;
};

export const markEmployeePendingDelete = async (id: string, requiresApproval = false): Promise<boolean> => {
    const existing = await getEmployeeById(id);

    if (!existing) {
        return false;
    }

    const now = Date.now();
    const deletedEmployee: UserRow = {
        ...existing,
        syncStatus: requiresApproval ? 'pending_approval' : 'pending_delete',
        updatedAt: now,
    };
    const queueRow = buildQueueRow(
        id,
        requiresApproval ? 'approval_request' : 'delete',
        deletedEmployee,
        now,
    );

    db.transaction((tx) => {
        tx.update(users).set(deletedEmployee).where(eq(users.id, id)).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return true;
};

export const employeesRepository = {
    listEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    markEmployeePendingDelete,
};
