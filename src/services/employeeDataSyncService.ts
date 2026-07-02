import { sqlite } from '@/src/db/client';
import { usersRepository } from '@/src/db/repositories/usersRepository';
import { supabase } from '@/src/lib/supabase';
import type { SQLiteBindValue } from 'expo-sqlite';
import type {
    InvoiceRow,
    ProductRow,
    UserRow,
} from '@/src/db/schema';

type ServiceResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

type DownloadRequestStatus = 'pending' | 'approved' | 'rejected' | 'missing';

type RemoteSyncStatus = UserRow['syncStatus'];
type RemotePartyStatus = UserRow['status'];
type RemoteStockStatus = ProductRow['status'];
type RemoteInvoiceStatus = InvoiceRow['status'];

type RemoteEmployeeRow = {
    id: string;
    business_id: string | null;
    business_name: string | null;
    name: string;
    phone: string | null;
    business_phone: string | null;
    email: string;
    business_email: string | null;
    role: 'employee';
    username: string;
    password_hash: string | null;
    status: RemotePartyStatus;
    biometric_enabled: boolean | null;
    address: string | null;
    business_address: string | null;
    business_logo: string | null;
    img: string | null;
    sync_status: RemoteSyncStatus;
    updated_at: number;
    created_at: number;
};

type RemoteOwnerRow = {
    id: string;
    business_id: string | null;
    business_name: string | null;
    name: string;
    phone: string | null;
    business_phone: string | null;
    email: string;
    business_email: string | null;
    role: 'owner';
    username: string;
    password_hash: string | null;
    status: RemotePartyStatus;
    biometric_enabled: boolean | null;
    address: string | null;
    business_address: string | null;
    business_logo: string | null;
    img: string | null;
    sync_status: RemoteSyncStatus;
    updated_at: number;
    created_at: number;
};

type RemoteCustomerRow = {
    id: string;
    created_by_id: string | null;
    last_updated_by_id: string | null;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    status: RemotePartyStatus;
    total_purchases: number;
    pending_dues: number;
    total_orders: number;
    img: string | null;
    last_purchase_date: number | null;
    sync_status: RemoteSyncStatus;
    updated_at: number;
    created_at: number;
};

type RemoteSupplierRow = {
    id: string;
    created_by_id: string | null;
    last_updated_by_id: string | null;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    status: RemotePartyStatus;
    supplied_products: number;
    total_supply_value: number;
    img: string | null;
    last_supplied_date: number | null;
    sync_status: RemoteSyncStatus;
    updated_at: number;
    created_at: number;
};

type RemoteProductRow = {
    id: string;
    created_by_id: string | null;
    last_updated_by_id: string | null;
    supplier_id: string | null;
    name: string;
    purchase_price: number;
    min_selling_price: number;
    max_selling_price: number;
    quantity: number;
    minimum_quantity: number;
    status: RemoteStockStatus;
    added_stock: number;
    sold_stock: number;
    img: string | null;
    sync_status: RemoteSyncStatus;
    updated_at: number;
    created_at: number;
};

type RemoteInvoiceRow = {
    id: string;
    created_by_id: string | null;
    last_updated_by_id: string | null;
    customer_id: string | null;
    invoice_number: string;
    subtotal: number;
    discount: number;
    discount_amount: number;
    total_amount: number;
    paid_amount: number;
    remaining_amount: number;
    total_items: number;
    status: RemoteInvoiceStatus;
    due_date: number | null;
    img: string | null;
    sync_status: RemoteSyncStatus;
    updated_at: number;
    created_at: number;
};

type RemoteInvoiceItemRow = {
    id: string;
    invoice_id: string;
    product_id: string | null;
    quantity: number;
    purchase_price: number;
    selling_price: number;
    subtotal: number;
    profit: number;
    sync_status: RemoteSyncStatus;
    updated_at: number;
    created_at: number;
};

type DownloadRequestPayload = {
    requestId: string;
    status: Exclude<DownloadRequestStatus, 'missing'>;
    employee: RemoteEmployeeRow;
};

type ApprovedBusinessDataPayload = {
    requestId: string;
    status: 'approved';
    owner: RemoteOwnerRow | null;
    employees: RemoteEmployeeRow[];
    customers: RemoteCustomerRow[];
    suppliers: RemoteSupplierRow[];
    products: RemoteProductRow[];
    invoices: RemoteInvoiceRow[];
    invoiceItems: RemoteInvoiceItemRow[];
};

export type EmployeeDataDownloadState = {
    requestId: string | null;
    status: DownloadRequestStatus;
    pulledCounts: {
        employees: number;
        customers: number;
        suppliers: number;
        products: number;
        invoices: number;
        invoiceItems: number;
    };
};

function emptyDownloadState(status: DownloadRequestStatus = 'missing'): EmployeeDataDownloadState {
    return {
        requestId: null,
        status,
        pulledCounts: {
            employees: 0,
            customers: 0,
            suppliers: 0,
            products: 0,
            invoices: 0,
            invoiceItems: 0,
        },
    };
}

function normalizeError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function toNumber(value: unknown, fallback = 0): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function toNullableNumber(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toNullableString(value: unknown): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
}

function toSyncStatus(value: unknown): RemoteSyncStatus {
    return value === 'pending_insert' ||
        value === 'pending_update' ||
        value === 'pending_delete' ||
        value === 'pending_approval' ||
        value === 'rejected'
        ? value
        : 'synced';
}

function toPartyStatus(value: unknown): RemotePartyStatus {
    return value === 'Inactive' ? 'Inactive' : 'Active';
}

function toStockStatus(value: unknown): RemoteStockStatus {
    return value === 'In Stock' || value === 'Low Stock' ? value : 'Out of Stock';
}

function toInvoiceStatus(value: unknown): RemoteInvoiceStatus {
    return value === 'Paid' || value === 'Pending' ? value : 'Unpaid';
}

function mapRemoteEmployee(value: unknown): RemoteEmployeeRow | null {
    if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.email !== 'string' || typeof value.username !== 'string') {
        return null;
    }

    return {
        id: value.id,
        business_id: toNullableString(value.business_id),
        business_name: toNullableString(value.business_name),
        name: value.name,
        phone: toNullableString(value.phone),
        business_phone: toNullableString(value.business_phone),
        email: value.email,
        business_email: toNullableString(value.business_email),
        role: 'employee',
        username: value.username,
        password_hash: toNullableString(value.password_hash),
        status: toPartyStatus(value.status),
        biometric_enabled: value.biometric_enabled === true,
        address: toNullableString(value.address),
        business_address: toNullableString(value.business_address),
        business_logo: toNullableString(value.business_logo),
        img: toNullableString(value.img),
        sync_status: toSyncStatus(value.sync_status),
        updated_at: toNumber(value.updated_at, Date.now()),
        created_at: toNumber(value.created_at, Date.now()),
    };
}

function mapRemoteOwner(value: unknown): RemoteOwnerRow | null {
    if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.email !== 'string' || typeof value.username !== 'string') {
        return null;
    }

    return {
        id: value.id,
        business_id: toNullableString(value.business_id),
        business_name: toNullableString(value.business_name),
        name: value.name,
        phone: toNullableString(value.phone),
        business_phone: toNullableString(value.business_phone),
        email: value.email,
        business_email: toNullableString(value.business_email),
        role: 'owner',
        username: value.username,
        password_hash: toNullableString(value.password_hash),
        status: toPartyStatus(value.status),
        biometric_enabled: value.biometric_enabled === true,
        address: toNullableString(value.address),
        business_address: toNullableString(value.business_address),
        business_logo: toNullableString(value.business_logo),
        img: toNullableString(value.img),
        sync_status: toSyncStatus(value.sync_status),
        updated_at: toNumber(value.updated_at, Date.now()),
        created_at: toNumber(value.created_at, Date.now()),
    };
}

function mapRemoteCustomer(value: unknown): RemoteCustomerRow | null {
    if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') {
        return null;
    }

    return {
        id: value.id,
        created_by_id: toNullableString(value.created_by_id),
        last_updated_by_id: toNullableString(value.last_updated_by_id),
        name: value.name,
        phone: toNullableString(value.phone),
        email: toNullableString(value.email),
        address: toNullableString(value.address),
        status: toPartyStatus(value.status),
        total_purchases: toNumber(value.total_purchases),
        pending_dues: toNumber(value.pending_dues),
        total_orders: toNumber(value.total_orders),
        img: toNullableString(value.img),
        last_purchase_date: toNullableNumber(value.last_purchase_date),
        sync_status: toSyncStatus(value.sync_status),
        updated_at: toNumber(value.updated_at, Date.now()),
        created_at: toNumber(value.created_at, Date.now()),
    };
}

function mapRemoteSupplier(value: unknown): RemoteSupplierRow | null {
    if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') {
        return null;
    }

    return {
        id: value.id,
        created_by_id: toNullableString(value.created_by_id),
        last_updated_by_id: toNullableString(value.last_updated_by_id),
        name: value.name,
        phone: toNullableString(value.phone),
        email: toNullableString(value.email),
        address: toNullableString(value.address),
        status: toPartyStatus(value.status),
        supplied_products: toNumber(value.supplied_products),
        total_supply_value: toNumber(value.total_supply_value),
        img: toNullableString(value.img),
        last_supplied_date: toNullableNumber(value.last_supplied_date),
        sync_status: toSyncStatus(value.sync_status),
        updated_at: toNumber(value.updated_at, Date.now()),
        created_at: toNumber(value.created_at, Date.now()),
    };
}

function mapRemoteProduct(value: unknown): RemoteProductRow | null {
    if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') {
        return null;
    }

    return {
        id: value.id,
        created_by_id: toNullableString(value.created_by_id),
        last_updated_by_id: toNullableString(value.last_updated_by_id),
        supplier_id: toNullableString(value.supplier_id),
        name: value.name,
        purchase_price: toNumber(value.purchase_price),
        min_selling_price: toNumber(value.min_selling_price),
        max_selling_price: toNumber(value.max_selling_price),
        quantity: toNumber(value.quantity),
        minimum_quantity: toNumber(value.minimum_quantity),
        status: toStockStatus(value.status),
        added_stock: toNumber(value.added_stock),
        sold_stock: toNumber(value.sold_stock),
        img: toNullableString(value.img),
        sync_status: toSyncStatus(value.sync_status),
        updated_at: toNumber(value.updated_at, Date.now()),
        created_at: toNumber(value.created_at, Date.now()),
    };
}

function mapRemoteInvoice(value: unknown): RemoteInvoiceRow | null {
    if (!isRecord(value) || typeof value.id !== 'string' || typeof value.invoice_number !== 'string') {
        return null;
    }

    return {
        id: value.id,
        created_by_id: toNullableString(value.created_by_id),
        last_updated_by_id: toNullableString(value.last_updated_by_id),
        customer_id: toNullableString(value.customer_id),
        invoice_number: value.invoice_number,
        subtotal: toNumber(value.subtotal),
        discount: toNumber(value.discount),
        discount_amount: toNumber(value.discount_amount),
        total_amount: toNumber(value.total_amount),
        paid_amount: toNumber(value.paid_amount),
        remaining_amount: toNumber(value.remaining_amount),
        total_items: toNumber(value.total_items),
        status: toInvoiceStatus(value.status),
        due_date: toNullableNumber(value.due_date),
        img: toNullableString(value.img),
        sync_status: toSyncStatus(value.sync_status),
        updated_at: toNumber(value.updated_at, Date.now()),
        created_at: toNumber(value.created_at, Date.now()),
    };
}

function mapRemoteInvoiceItem(value: unknown): RemoteInvoiceItemRow | null {
    if (!isRecord(value) || typeof value.id !== 'string' || typeof value.invoice_id !== 'string') {
        return null;
    }

    return {
        id: value.id,
        invoice_id: value.invoice_id,
        product_id: toNullableString(value.product_id),
        quantity: toNumber(value.quantity),
        purchase_price: toNumber(value.purchase_price),
        selling_price: toNumber(value.selling_price),
        subtotal: toNumber(value.subtotal),
        profit: toNumber(value.profit),
        sync_status: toSyncStatus(value.sync_status),
        updated_at: toNumber(value.updated_at, Date.now()),
        created_at: toNumber(value.created_at, Date.now()),
    };
}

function mapDownloadRequestPayload(value: unknown): DownloadRequestPayload | null {
    if (!isRecord(value) || typeof value.request_id !== 'string') {
        return null;
    }

    const status = value.status === 'approved' || value.status === 'rejected' ? value.status : 'pending';
    const employee = mapRemoteEmployee(value.employee);

    if (!employee) {
        return null;
    }

    return {
        requestId: value.request_id,
        status,
        employee,
    };
}

function mapApprovedPayload(value: unknown): ApprovedBusinessDataPayload | null {
    if (!isRecord(value) || value.status !== 'approved' || typeof value.request_id !== 'string') {
        return null;
    }

    const mapArray = <T>(source: unknown, mapper: (item: unknown) => T | null): T[] => (
        Array.isArray(source)
            ? source.map(mapper).filter((item): item is T => !!item)
            : []
    );

    return {
        requestId: value.request_id,
        status: 'approved',
        owner: mapRemoteOwner(value.owner),
        employees: mapArray(value.employees, mapRemoteEmployee),
        customers: mapArray(value.customers, mapRemoteCustomer),
        suppliers: mapArray(value.suppliers, mapRemoteSupplier),
        products: mapArray(value.products, mapRemoteProduct),
        invoices: mapArray(value.invoices, mapRemoteInvoice),
        invoiceItems: mapArray(value.invoice_items, mapRemoteInvoiceItem),
    };
}

function toLocalEmployee(row: RemoteEmployeeRow): UserRow {
    return {
        id: row.id,
        businessId: row.business_id,
        businessName: row.business_name,
        name: row.name,
        phone: row.phone,
        businessPhone: row.business_phone,
        email: row.email,
        businessEmail: row.business_email,
        role: 'employee',
        username: row.username,
        passwordHash: row.password_hash,
        status: row.status,
        biometricEnabled: false,
        address: row.address,
        businessAddress: row.business_address,
        businessLogo: row.business_logo,
        img: row.img,
        syncStatus: 'synced',
        updatedAt: row.updated_at,
        createdAt: row.created_at,
    };
}

function toLocalOwner(row: RemoteOwnerRow): UserRow {
    return {
        id: row.id,
        businessId: row.business_id ?? row.id,
        businessName: row.business_name,
        name: row.name,
        phone: row.phone,
        businessPhone: row.business_phone,
        email: row.email,
        businessEmail: row.business_email,
        role: 'owner',
        username: row.username,
        passwordHash: row.password_hash,
        status: row.status,
        biometricEnabled: false,
        address: row.address,
        businessAddress: row.business_address,
        businessLogo: row.business_logo,
        img: row.img,
        syncStatus: 'synced',
        updatedAt: row.updated_at,
        createdAt: row.created_at,
    };
}

function buildPlaceholderOwner(id: string, businessName: string | null): UserRow {
    const suffix = id.replace(/[^a-zA-Z0-9]/g, '') || 'business';

    return {
        id,
        businessId: id,
        businessName,
        name: businessName ?? 'Business Owner',
        phone: null,
        businessPhone: null,
        email: `owner-${suffix}@local.bachatbuddy`,
        businessEmail: null,
        role: 'owner',
        username: `owner-${suffix}`,
        passwordHash: null,
        status: 'Active',
        biometricEnabled: false,
        address: null,
        businessAddress: null,
        businessLogo: null,
        img: null,
        syncStatus: 'synced',
        updatedAt: 0,
        createdAt: 0,
    };
}

function collectReferencedUserIds(payload: ApprovedBusinessDataPayload): Set<string> {
    const ids = new Set<string>();
    const add = (value: string | null) => {
        if (value) {
            ids.add(value);
        }
    };

    add(payload.owner?.id ?? null);

    payload.employees.forEach((employee) => {
        add(employee.id);
        add(employee.business_id);
    });
    payload.customers.forEach((customer) => {
        add(customer.created_by_id);
        add(customer.last_updated_by_id);
    });
    payload.suppliers.forEach((supplier) => {
        add(supplier.created_by_id);
        add(supplier.last_updated_by_id);
    });
    payload.products.forEach((product) => {
        add(product.created_by_id);
        add(product.last_updated_by_id);
    });
    payload.invoices.forEach((invoice) => {
        add(invoice.created_by_id);
        add(invoice.last_updated_by_id);
    });

    return ids;
}

async function upsertRemoteEmployeeLocally(row: RemoteEmployeeRow): Promise<UserRow> {
    return usersRepository.upsertUser(toLocalEmployee(row));
}

async function upsertPulledRow(tableName: string, columns: string[], values: SQLiteBindValue[]): Promise<void> {
    const placeholders = columns.map(() => '?').join(', ');
    const updateSet = columns
        .filter((column) => column !== 'id' && column !== 'created_at')
        .map((column) => `${column} = excluded.${column}`)
        .join(', ');

    await sqlite.runAsync(
        `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})
         ON CONFLICT(id) DO UPDATE SET ${updateSet}
         WHERE ${tableName}.sync_status IN ('synced', 'rejected')
            OR excluded.updated_at >= ${tableName}.updated_at`,
        ...values,
    );
}

async function persistApprovedBusinessData(payload: ApprovedBusinessDataPayload): Promise<EmployeeDataDownloadState['pulledCounts']> {
    await sqlite.withTransactionAsync(async () => {
        const referencedUserIds = collectReferencedUserIds(payload);

        for (const userId of referencedUserIds) {
            const placeholder = payload.owner?.id === userId
                ? toLocalOwner(payload.owner)
                : buildPlaceholderOwner(userId, payload.owner?.business_name ?? payload.employees[0]?.business_name ?? null);

            await upsertPulledRow(
                'users',
                ['id', 'business_id', 'business_name', 'name', 'phone', 'business_phone', 'email', 'business_email', 'role', 'username', 'password_hash', 'status', 'biometric_enabled', 'address', 'business_address', 'business_logo', 'img', 'sync_status', 'updated_at', 'created_at'],
                [placeholder.id, placeholder.businessId, placeholder.businessName, placeholder.name, placeholder.phone, placeholder.businessPhone, placeholder.email, placeholder.businessEmail, placeholder.role, placeholder.username, placeholder.passwordHash, placeholder.status, placeholder.biometricEnabled ? 1 : 0, placeholder.address, placeholder.businessAddress, placeholder.businessLogo, placeholder.img, placeholder.syncStatus, placeholder.updatedAt, placeholder.createdAt],
            );
        }

        for (const employee of payload.employees) {
            const row = toLocalEmployee(employee);
            await upsertPulledRow(
                'users',
                ['id', 'business_id', 'business_name', 'name', 'phone', 'business_phone', 'email', 'business_email', 'role', 'username', 'password_hash', 'status', 'biometric_enabled', 'address', 'business_address', 'business_logo', 'img', 'sync_status', 'updated_at', 'created_at'],
                [row.id, row.businessId, row.businessName, row.name, row.phone, row.businessPhone, row.email, row.businessEmail, row.role, row.username, row.passwordHash, row.status, row.biometricEnabled ? 1 : 0, row.address, row.businessAddress, row.businessLogo, row.img, row.syncStatus, row.updatedAt, row.createdAt],
            );
        }

        for (const customer of payload.customers) {
            await upsertPulledRow(
                'customers',
                ['id', 'created_by_id', 'last_updated_by_id', 'name', 'phone', 'email', 'address', 'status', 'total_purchases', 'pending_dues', 'total_orders', 'img', 'last_purchase_date', 'sync_status', 'updated_at', 'created_at'],
                [customer.id, customer.created_by_id, customer.last_updated_by_id, customer.name, customer.phone, customer.email, customer.address, customer.status, customer.total_purchases, customer.pending_dues, customer.total_orders, customer.img, customer.last_purchase_date, 'synced', customer.updated_at, customer.created_at],
            );
        }

        for (const supplier of payload.suppliers) {
            await upsertPulledRow(
                'suppliers',
                ['id', 'created_by_id', 'last_updated_by_id', 'name', 'phone', 'email', 'address', 'status', 'supplied_products', 'total_supply_value', 'img', 'last_supplied_date', 'sync_status', 'updated_at', 'created_at'],
                [supplier.id, supplier.created_by_id, supplier.last_updated_by_id, supplier.name, supplier.phone, supplier.email, supplier.address, supplier.status, supplier.supplied_products, supplier.total_supply_value, supplier.img, supplier.last_supplied_date, 'synced', supplier.updated_at, supplier.created_at],
            );
        }

        for (const product of payload.products) {
            await upsertPulledRow(
                'products',
                ['id', 'created_by_id', 'last_updated_by_id', 'supplier_id', 'name', 'purchase_price', 'min_selling_price', 'max_selling_price', 'quantity', 'minimum_quantity', 'status', 'added_stock', 'sold_stock', 'img', 'sync_status', 'updated_at', 'created_at'],
                [product.id, product.created_by_id, product.last_updated_by_id, product.supplier_id, product.name, product.purchase_price, product.min_selling_price, product.max_selling_price, product.quantity, product.minimum_quantity, product.status, product.added_stock, product.sold_stock, product.img, 'synced', product.updated_at, product.created_at],
            );
        }

        for (const invoice of payload.invoices) {
            await upsertPulledRow(
                'invoices',
                ['id', 'created_by_id', 'last_updated_by_id', 'customer_id', 'invoice_number', 'subtotal', 'discount', 'discount_amount', 'total_amount', 'paid_amount', 'remaining_amount', 'total_items', 'status', 'due_date', 'img', 'sync_status', 'updated_at', 'created_at'],
                [invoice.id, invoice.created_by_id, invoice.last_updated_by_id, invoice.customer_id, invoice.invoice_number, invoice.subtotal, invoice.discount, invoice.discount_amount, invoice.total_amount, invoice.paid_amount, invoice.remaining_amount, invoice.total_items, invoice.status, invoice.due_date, invoice.img, 'synced', invoice.updated_at, invoice.created_at],
            );
        }

        for (const item of payload.invoiceItems) {
            await upsertPulledRow(
                'invoice_items',
                ['id', 'invoice_id', 'product_id', 'quantity', 'purchase_price', 'selling_price', 'subtotal', 'profit', 'sync_status', 'updated_at', 'created_at'],
                [item.id, item.invoice_id, item.product_id, item.quantity, item.purchase_price, item.selling_price, item.subtotal, item.profit, 'synced', item.updated_at, item.created_at],
            );
        }
    });

    return {
        employees: payload.employees.length,
        customers: payload.customers.length,
        suppliers: payload.suppliers.length,
        products: payload.products.length,
        invoices: payload.invoices.length,
        invoiceItems: payload.invoiceItems.length,
    };
}

async function pullApprovedBusinessData(
    employeeId: string,
    businessId: string,
    requestId: string | null,
): Promise<ServiceResult<EmployeeDataDownloadState>> {
    const { data, error } = await supabase.rpc('employee_pull_approved_business_data', {
        p_employee_id: employeeId,
        p_business_id: businessId,
        p_request_id: requestId,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    const payload = mapApprovedPayload(data);

    if (!payload) {
        return {
            success: true,
            data: emptyDownloadState(),
        };
    }

    const pulledCounts = await persistApprovedBusinessData(payload);

    return {
        success: true,
        data: {
            requestId: payload.requestId,
            status: 'approved',
            pulledCounts,
        },
    };
}

export const employeeDataSyncService = {
    async submitDownloadRequest(
        identifier: string,
        password: string,
        deviceName = 'Employee device',
    ): Promise<ServiceResult<{ employee: UserRow; request: EmployeeDataDownloadState }>> {
        try {
            const { data, error } = await supabase.rpc('employee_submit_business_data_download_request', {
                p_identifier: identifier.trim().toLowerCase(),
                p_password: password,
                p_device_name: deviceName,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            const payload = mapDownloadRequestPayload(data);

            if (!payload) {
                return { success: false, error: 'Employee download request response was invalid.' };
            }

            const employee = await upsertRemoteEmployeeLocally(payload.employee);
            let request: EmployeeDataDownloadState = {
                requestId: payload.requestId,
                status: payload.status,
                pulledCounts: emptyDownloadState().pulledCounts,
            };

            if (payload.status === 'approved' && employee.businessId) {
                const pullResult = await pullApprovedBusinessData(employee.id, employee.businessId, payload.requestId);

                if (pullResult.success) {
                    request = pullResult.data;
                }
            }

            return { success: true, data: { employee, request } };
        } catch (error) {
            return { success: false, error: normalizeError(error) };
        }
    },

    async reconcileApprovedPull(user: UserRow): Promise<ServiceResult<EmployeeDataDownloadState>> {
        try {
            if (user.role !== 'employee' || !user.businessId) {
                return { success: false, error: 'Only employee profiles can pull approved business data.' };
            }

            return pullApprovedBusinessData(user.id, user.businessId, null);
        } catch (error) {
            return { success: false, error: normalizeError(error) };
        }
    },
};
