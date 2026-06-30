import type { SQLiteDatabase } from 'expo-sqlite';

const createTablesSql = `
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    business_id TEXT,
    business_name TEXT,
    name TEXT NOT NULL,
    phone TEXT,
    business_phone TEXT,
    email TEXT NOT NULL,
    business_email TEXT,
    role TEXT NOT NULL CHECK (role IN ('owner', 'employee')),
    username TEXT NOT NULL,
    password_hash TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    biometric_enabled INTEGER NOT NULL DEFAULT 0,
    address TEXT,
    business_address TEXT,
    business_logo TEXT,
    img TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending_insert',
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY NOT NULL,
    created_by_id TEXT REFERENCES users(id),
    last_updated_by_id TEXT REFERENCES users(id),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    total_purchases REAL NOT NULL DEFAULT 0,
    pending_dues REAL NOT NULL DEFAULT 0,
    total_orders INTEGER NOT NULL DEFAULT 0,
    img TEXT,
    last_purchase_date INTEGER,
    sync_status TEXT NOT NULL DEFAULT 'pending_insert',
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY NOT NULL,
    created_by_id TEXT REFERENCES users(id),
    last_updated_by_id TEXT REFERENCES users(id),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    supplied_products INTEGER NOT NULL DEFAULT 0,
    total_supply_value REAL NOT NULL DEFAULT 0,
    img TEXT,
    last_supplied_date INTEGER,
    sync_status TEXT NOT NULL DEFAULT 'pending_insert',
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY NOT NULL,
    created_by_id TEXT REFERENCES users(id),
    last_updated_by_id TEXT REFERENCES users(id),
    supplier_id TEXT REFERENCES suppliers(id),
    name TEXT NOT NULL,
    purchase_price REAL NOT NULL DEFAULT 0,
    min_selling_price REAL NOT NULL DEFAULT 0,
    max_selling_price REAL NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    minimum_quantity INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Out of Stock' CHECK (status IN ('In Stock', 'Low Stock', 'Out of Stock')),
    added_stock INTEGER NOT NULL DEFAULT 0,
    sold_stock INTEGER NOT NULL DEFAULT 0,
    img TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending_insert',
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY NOT NULL,
    created_by_id TEXT REFERENCES users(id),
    last_updated_by_id TEXT REFERENCES users(id),
    customer_id TEXT REFERENCES customers(id),
    invoice_number TEXT NOT NULL,
    subtotal REAL NOT NULL DEFAULT 0,
    discount REAL NOT NULL DEFAULT 0,
    discount_amount REAL NOT NULL DEFAULT 0,
    total_amount REAL NOT NULL DEFAULT 0,
    paid_amount REAL NOT NULL DEFAULT 0,
    remaining_amount REAL NOT NULL DEFAULT 0,
    total_items INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Pending', 'Unpaid')),
    due_date INTEGER,
    img TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending_insert',
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id TEXT PRIMARY KEY NOT NULL,
    invoice_id TEXT NOT NULL REFERENCES invoices(id),
    product_id TEXT REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    purchase_price REAL NOT NULL DEFAULT 0,
    selling_price REAL NOT NULL DEFAULT 0,
    subtotal REAL NOT NULL DEFAULT 0,
    profit REAL NOT NULL DEFAULT 0,
    sync_status TEXT NOT NULL DEFAULT 'pending_insert',
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        updated_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('insert', 'update', 'delete', 'approval_request')),
    payload TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'failed')),
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    next_retry_at INTEGER,
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS backup_metadata (
    id TEXT PRIMARY KEY NOT NULL,
    business_id TEXT NOT NULL,
    user_id TEXT REFERENCES users(id),
    backup_id TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'restored', 'failed')),
    size_bytes INTEGER NOT NULL DEFAULT 0,
    record_counts TEXT NOT NULL,
    last_error TEXT,
    restored_at INTEGER,
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_sync_status ON users(sync_status);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_sync_status ON customers(sync_status);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_sync_status ON suppliers(sync_status);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_sync_status ON products(sync_status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_sync_status ON invoices(sync_status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product_id ON invoice_items(product_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_sync_status ON invoice_items(sync_status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_record ON sync_queue(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_next_retry_at ON sync_queue(next_retry_at);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_business_id ON backup_metadata(business_id);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_created_at ON backup_metadata(created_at);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_active ON auth_sessions(is_active);
`;

const usersColumns: Record<string, string> = {
    business_id: 'ALTER TABLE users ADD COLUMN business_id TEXT;',
    business_name: 'ALTER TABLE users ADD COLUMN business_name TEXT;',
    name: "ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT '';",
    phone: 'ALTER TABLE users ADD COLUMN phone TEXT;',
    business_phone: 'ALTER TABLE users ADD COLUMN business_phone TEXT;',
    email: "ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT '';",
    business_email: 'ALTER TABLE users ADD COLUMN business_email TEXT;',
    role: "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'owner';",
    username: "ALTER TABLE users ADD COLUMN username TEXT NOT NULL DEFAULT '';",
    password_hash: 'ALTER TABLE users ADD COLUMN password_hash TEXT;',
    status: "ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'Active';",
    biometric_enabled: 'ALTER TABLE users ADD COLUMN biometric_enabled INTEGER NOT NULL DEFAULT 0;',
    address: 'ALTER TABLE users ADD COLUMN address TEXT;',
    business_address: 'ALTER TABLE users ADD COLUMN business_address TEXT;',
    business_logo: 'ALTER TABLE users ADD COLUMN business_logo TEXT;',
    img: 'ALTER TABLE users ADD COLUMN img TEXT;',
    sync_status: "ALTER TABLE users ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'pending_insert';",
    updated_at: 'ALTER TABLE users ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0;',
    created_at: 'ALTER TABLE users ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0;',
};

type TableInfoRow = {
    name: string;
};

async function addMissingColumns(
    sqlite: SQLiteDatabase,
    tableName: string,
    columns: Record<string, string>
): Promise<void> {
    const tableInfo = await sqlite.getAllAsync<TableInfoRow>(`PRAGMA table_info(${tableName});`);
    const existingColumns = new Set(tableInfo.map((column) => column.name));

    for (const [columnName, alterSql] of Object.entries(columns)) {
        if (!existingColumns.has(columnName)) {
            await sqlite.execAsync(alterSql);
        }
    }
}

export const migrateLocalDatabase = async (sqlite: SQLiteDatabase): Promise<void> => {
    await sqlite.execAsync(createTablesSql);
    await addMissingColumns(sqlite, 'users', usersColumns);
};
