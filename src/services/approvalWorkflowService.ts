import { sqlite } from '@/src/db/client';
import { supabase } from '@/src/lib/supabase';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type ApprovalOperation = 'insert' | 'update' | 'delete';
type BusinessMutationSourceTable = 'users' | 'employees' | 'customers' | 'suppliers' | 'products' | 'invoices' | 'invoice_items';
type ApprovalSourceTable = BusinessMutationSourceTable | 'business_data_downloads';
type RemotePayload = Record<string, unknown>;

type StagingReviewRow = {
    id: string;
    source_table: string | null;
    source_record_id: string | null;
    operation: string;
    payload: RemotePayload;
    submitted_by: string | null;
    business_id: string | null;
    status: ApprovalStatus;
    reviewed_at: number | null;
    reviewed_by: string | null;
    updated_at: number;
    created_at: number;
};

type ProfileRow = {
    id: string;
    name: string | null;
    img: string | null;
};

export type ApprovalRequest = {
    id: string;
    sourceTable: ApprovalSourceTable;
    sourceRecordId: string;
    operation: ApprovalOperation;
    title: string;
    subtitle: string;
    submittedById: string | null;
    submittedByName: string;
    submittedByImage: string | null;
    createdAt: number;
};

type ApprovalResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

const supportedTables = new Set<ApprovalSourceTable>([
    'users',
    'employees',
    'customers',
    'suppliers',
    'products',
    'invoices',
    'invoice_items',
    'business_data_downloads',
]);

const localTableBySource: Record<BusinessMutationSourceTable, string> = {
    users: 'users',
    employees: 'users',
    customers: 'customers',
    suppliers: 'suppliers',
    products: 'products',
    invoices: 'invoices',
    invoice_items: 'invoice_items',
};

const remoteTableBySource: Record<BusinessMutationSourceTable, BusinessMutationSourceTable> = {
    users: 'users',
    employees: 'employees',
    customers: 'customers',
    suppliers: 'suppliers',
    products: 'products',
    invoices: 'invoices',
    invoice_items: 'invoice_items',
};

function isBusinessMutationSourceTable(value: ApprovalSourceTable): value is BusinessMutationSourceTable {
    return value !== 'business_data_downloads';
}

function getRemoteTableName(sourceTable: BusinessMutationSourceTable, payload: RemotePayload): BusinessMutationSourceTable {
    if (sourceTable === 'users' && payload.role === 'employee') {
        return 'employees';
    }

    return remoteTableBySource[sourceTable];
}

function normalizeError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

function isRemotePayload(value: unknown): value is RemotePayload {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeSourceTable(value: string | null): ApprovalSourceTable | null {
    if (!value || !supportedTables.has(value as ApprovalSourceTable)) {
        return null;
    }

    return value as ApprovalSourceTable;
}

function normalizeOperation(row: StagingReviewRow): ApprovalOperation {
    const payloadOperation = row.payload.approval_operation;

    if (payloadOperation === 'insert' || payloadOperation === 'update' || payloadOperation === 'delete') {
        return payloadOperation;
    }

    if (row.operation === 'insert' || row.operation === 'update' || row.operation === 'delete') {
        return row.operation;
    }

    return 'update';
}

function cleanRemotePayload(payload: RemotePayload): RemotePayload {
    const {
        approval_operation: _approvalOperation,
        ...remotePayload
    } = payload;

    return {
        ...remotePayload,
        sync_status: 'synced',
    };
}

function getRequestTitle(tableName: ApprovalSourceTable, operation: ApprovalOperation, payload: RemotePayload): string {
    if (tableName === 'business_data_downloads') {
        return 'Business Data Download Request';
    }

    const recordName = typeof payload.name === 'string'
        ? payload.name
        : typeof payload.invoice_number === 'string'
            ? payload.invoice_number
            : 'Record';
    const action = operation === 'insert' ? 'Add' : operation === 'delete' ? 'Delete' : 'Update';
    const label = tableName === 'invoice_items'
        ? 'Invoice Item'
        : tableName.slice(0, -1).replace('_', ' ');

    return `${action} ${label}: ${recordName}`;
}

function getRequestSubtitle(row: StagingReviewRow): string {
    const date = new Date(row.created_at);
    const formattedDate = Number.isNaN(date.getTime())
        ? 'Pending review'
        : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    if (row.source_table === 'business_data_downloads') {
        const deviceName = isRemotePayload(row.payload) && typeof row.payload.device_name === 'string'
            ? row.payload.device_name
            : 'Employee device';

        return `${formattedDate} | ${deviceName}`;
    }

    return `${formattedDate} | ${row.source_record_id ?? 'Unknown record'}`;
}

function mapRequest(row: StagingReviewRow, profileMap: Map<string, ProfileRow>): ApprovalRequest | null {
    const sourceTable = normalizeSourceTable(row.source_table);

    if (!sourceTable || !row.source_record_id || !isRemotePayload(row.payload)) {
        return null;
    }

    const profile = row.submitted_by ? profileMap.get(row.submitted_by) : undefined;
    const payloadEmployeeName = typeof row.payload.employee_name === 'string' ? row.payload.employee_name : null;
    const payloadEmployeeImage = typeof row.payload.employee_img === 'string' ? row.payload.employee_img : null;
    const operation = normalizeOperation(row);

    return {
        id: row.id,
        sourceTable,
        sourceRecordId: row.source_record_id,
        operation,
        title: getRequestTitle(sourceTable, operation, row.payload),
        subtitle: getRequestSubtitle(row),
        submittedById: row.submitted_by,
        submittedByName: profile?.name ?? payloadEmployeeName ?? 'Employee',
        submittedByImage: profile?.img ?? payloadEmployeeImage,
        createdAt: row.created_at,
    };
}

async function loadSubmitterProfiles(rows: StagingReviewRow[]): Promise<Map<string, ProfileRow>> {
    const ids = Array.from(new Set(rows.map((row) => row.submitted_by).filter((id): id is string => !!id)));

    if (ids.length === 0) {
        return new Map();
    }

    const { data, error } = await supabase
        .from('users')
        .select('id,name,img')
        .in('id', ids);

    if (error || !data) {
        return new Map();
    }

    return new Map((data as ProfileRow[]).map((profile) => [profile.id, profile]));
}

async function getReviewRow(id: string): Promise<StagingReviewRow> {
    const { data, error } = await supabase
        .from('staging_review_queue')
        .select('id,source_table,source_record_id,operation,payload,submitted_by,business_id,status,reviewed_at,reviewed_by,updated_at,created_at')
        .eq('id', id)
        .single();

    if (error || !data) {
        throw new Error(error?.message ?? 'Approval request was not found.');
    }

    return data as StagingReviewRow;
}

async function applyApprovedMutation(row: StagingReviewRow): Promise<void> {
    const sourceTable = normalizeSourceTable(row.source_table);

    if (!sourceTable || !row.source_record_id || !isRemotePayload(row.payload)) {
        throw new Error('Approval request has an unsupported target.');
    }

    if (!isBusinessMutationSourceTable(sourceTable)) {
        return;
    }

    const operation = normalizeOperation(row);
    const remoteTable = getRemoteTableName(sourceTable, row.payload);

    if (operation === 'delete') {
        const { error } = await supabase
            .from(remoteTable)
            .delete()
            .eq('id', row.source_record_id);

        if (error) {
            throw new Error(error.message);
        }

        return;
    }

    const { error } = await supabase
        .from(remoteTable)
        .upsert(cleanRemotePayload(row.payload), { onConflict: 'id' });

    if (error) {
        throw new Error(error.message);
    }
}

async function updateReviewStatus(
    id: string,
    status: Exclude<ApprovalStatus, 'pending'>,
    reviewerId: string
): Promise<void> {
    const now = Date.now();
    const { error } = await supabase
        .from('staging_review_queue')
        .update({
            status,
            reviewed_at: now,
            reviewed_by: reviewerId,
            updated_at: now,
        })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }
}

async function markLocalReviewResult(row: StagingReviewRow, status: 'synced' | 'rejected'): Promise<void> {
    const sourceTable = normalizeSourceTable(row.source_table);

    if (!sourceTable || !row.source_record_id) {
        return;
    }

    if (!isBusinessMutationSourceTable(sourceTable)) {
        return;
    }

    const localTableName = localTableBySource[sourceTable];
    const operation = normalizeOperation(row);

    if (status === 'synced' && operation === 'delete') {
        await sqlite.runAsync(`DELETE FROM ${localTableName} WHERE id = ?`, row.source_record_id);
        return;
    }

    await sqlite.runAsync(
        `UPDATE ${localTableName} SET sync_status = ?, updated_at = ? WHERE id = ? AND sync_status = ?`,
        status,
        Date.now(),
        row.source_record_id,
        'pending_approval'
    );
}

export const approvalWorkflowService = {
    async listPendingRequests(): Promise<ApprovalResult<ApprovalRequest[]>> {
        try {
            const { data, error } = await supabase
                .from('staging_review_queue')
                .select('id,source_table,source_record_id,operation,payload,submitted_by,business_id,status,reviewed_at,reviewed_by,updated_at,created_at')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) {
                return { success: false, error: error.message };
            }

            const rows = (data ?? []) as StagingReviewRow[];
            const profileMap = await loadSubmitterProfiles(rows);
            const requests = rows
                .map((row) => mapRequest(row, profileMap))
                .filter((request): request is ApprovalRequest => !!request);

            return { success: true, data: requests };
        } catch (error) {
            return { success: false, error: normalizeError(error) };
        }
    },

    async approveRequest(id: string, reviewerId: string): Promise<ApprovalResult<null>> {
        try {
            const row = await getReviewRow(id);
            await applyApprovedMutation(row);
            await updateReviewStatus(id, 'approved', reviewerId);
            await markLocalReviewResult(row, 'synced');

            return { success: true, data: null };
        } catch (error) {
            return { success: false, error: normalizeError(error) };
        }
    },

    async rejectRequest(id: string, reviewerId: string): Promise<ApprovalResult<null>> {
        try {
            const row = await getReviewRow(id);
            await updateReviewStatus(id, 'rejected', reviewerId);
            await markLocalReviewResult(row, 'rejected');

            return { success: true, data: null };
        } catch (error) {
            return { success: false, error: normalizeError(error) };
        }
    },
};
