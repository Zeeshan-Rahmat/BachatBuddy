import { relations } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const syncStatusValues = [
    'synced',
    'pending_insert',
    'pending_update',
    'pending_delete',
    'pending_approval',
    'rejected',
] as const;

export const userRoleValues = ['owner', 'employee'] as const;

export const stockStatusValues = ['In Stock', 'Low Stock', 'Out of Stock'] as const;
export const partyStatusValues = ['Active', 'Inactive'] as const;
export const invoiceStatusValues = ['Paid', 'Pending', 'Unpaid'] as const;
export const syncOperationValues = ['insert', 'update', 'delete', 'approval_request'] as const;
export const syncQueueStatusValues = ['queued', 'processing', 'failed'] as const;

export const authSessions = sqliteTable(
    'auth_sessions',
    {
        id: text('id').primaryKey(),
        userId: text('user_id').notNull().references(() => users.id),
        accessToken: text('access_token').notNull(),
        refreshToken: text('refresh_token').notNull(),
        expiresAt: integer('expires_at').notNull(),
        isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        index('idx_auth_sessions_user_id').on(table.userId),
        index('idx_auth_sessions_active').on(table.isActive),
    ],
);

export const users = sqliteTable(
    'users',
    {
        id: text('id').primaryKey(),
        businessId: text('business_id'),
        businessName: text('business_name'),
        name: text('name').notNull(),
        phone: text('phone'),
        businessPhone: text('business_phone'),
        email: text('email').notNull(),
        businessEmail: text('business_email'),
        role: text('role', { enum: userRoleValues }).notNull(),
        username: text('username').notNull(),
        passwordHash: text('password_hash'),
        status: text('status', { enum: partyStatusValues }).notNull().default('Active'),
        biometricEnabled: integer('biometric_enabled', { mode: 'boolean' }).notNull().default(false),
        address: text('address'),
        businessAddress: text('business_address'),
        businessLogo: text('business_logo'),
        img: text('img'),
        syncStatus: text('sync_status', { enum: syncStatusValues }).notNull().default('pending_insert'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        uniqueIndex('idx_users_username').on(table.username),
        index('idx_users_role').on(table.role),
        index('idx_users_sync_status').on(table.syncStatus),
    ],
);

export const customers = sqliteTable(
    'customers',
    {
        id: text('id').primaryKey(),
        createdById: text('created_by_id').references(() => users.id),
        lastUpdatedById: text('last_updated_by_id').references(() => users.id),
        name: text('name').notNull(),
        phone: text('phone'),
        email: text('email'),
        address: text('address'),
        status: text('status', { enum: partyStatusValues }).notNull().default('Active'),
        totalPurchases: real('total_purchases').notNull().default(0),
        pendingDues: real('pending_dues').notNull().default(0),
        totalOrders: integer('total_orders').notNull().default(0),
        img: text('img'),
        lastPurchaseDate: integer('last_purchase_date'),
        syncStatus: text('sync_status', { enum: syncStatusValues }).notNull().default('pending_insert'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        index('idx_customers_name').on(table.name),
        index('idx_customers_status').on(table.status),
        index('idx_customers_sync_status').on(table.syncStatus),
    ],
);

export const suppliers = sqliteTable(
    'suppliers',
    {
        id: text('id').primaryKey(),
        createdById: text('created_by_id').references(() => users.id),
        lastUpdatedById: text('last_updated_by_id').references(() => users.id),
        name: text('name').notNull(),
        phone: text('phone'),
        email: text('email'),
        address: text('address'),
        status: text('status', { enum: partyStatusValues }).notNull().default('Active'),
        suppliedProducts: integer('supplied_products').notNull().default(0),
        totalSupplyValue: real('total_supply_value').notNull().default(0),
        img: text('img'),
        lastSuppliedDate: integer('last_supplied_date'),
        syncStatus: text('sync_status', { enum: syncStatusValues }).notNull().default('pending_insert'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        index('idx_suppliers_name').on(table.name),
        index('idx_suppliers_status').on(table.status),
        index('idx_suppliers_sync_status').on(table.syncStatus),
    ],
);

export const products = sqliteTable(
    'products',
    {
        id: text('id').primaryKey(),
        createdById: text('created_by_id').references(() => users.id),
        lastUpdatedById: text('last_updated_by_id').references(() => users.id),
        supplierId: text('supplier_id').references(() => suppliers.id),
        name: text('name').notNull(),
        purchasePrice: real('purchase_price').notNull().default(0),
        minSellingPrice: real('min_selling_price').notNull().default(0),
        maxSellingPrice: real('max_selling_price').notNull().default(0),
        quantity: integer('quantity').notNull().default(0),
        minimumQuantity: integer('minimum_quantity').notNull().default(0),
        status: text('status', { enum: stockStatusValues }).notNull().default('Out of Stock'),
        addedStock: integer('added_stock').notNull().default(0),
        soldStock: integer('sold_stock').notNull().default(0),
        img: text('img'),
        syncStatus: text('sync_status', { enum: syncStatusValues }).notNull().default('pending_insert'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        index('idx_products_name').on(table.name),
        index('idx_products_supplier_id').on(table.supplierId),
        index('idx_products_status').on(table.status),
        index('idx_products_sync_status').on(table.syncStatus),
    ],
);

export const invoices = sqliteTable(
    'invoices',
    {
        id: text('id').primaryKey(),
        createdById: text('created_by_id').references(() => users.id),
        lastUpdatedById: text('last_updated_by_id').references(() => users.id),
        customerId: text('customer_id').references(() => customers.id),
        invoiceNumber: text('invoice_number').notNull(),
        subtotal: real('subtotal').notNull().default(0),
        discount: real('discount').notNull().default(0),
        discountAmount: real('discount_amount').notNull().default(0),
        totalAmount: real('total_amount').notNull().default(0),
        paidAmount: real('paid_amount').notNull().default(0),
        remainingAmount: real('remaining_amount').notNull().default(0),
        totalItems: integer('total_items').notNull().default(0),
        status: text('status', { enum: invoiceStatusValues }).notNull().default('Unpaid'),
        dueDate: integer('due_date'),
        img: text('img'),
        syncStatus: text('sync_status', { enum: syncStatusValues }).notNull().default('pending_insert'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        index('idx_invoices_customer_id').on(table.customerId),
        index('idx_invoices_invoice_number').on(table.invoiceNumber),
        index('idx_invoices_status').on(table.status),
        index('idx_invoices_sync_status').on(table.syncStatus),
    ],
);

export const invoiceItems = sqliteTable(
    'invoice_items',
    {
        id: text('id').primaryKey(),
        invoiceId: text('invoice_id').notNull().references(() => invoices.id),
        productId: text('product_id').references(() => products.id),
        quantity: integer('quantity').notNull().default(0),
        purchasePrice: real('purchase_price').notNull().default(0),
        sellingPrice: real('selling_price').notNull().default(0),
        subtotal: real('subtotal').notNull().default(0),
        profit: real('profit').notNull().default(0),
        syncStatus: text('sync_status', { enum: syncStatusValues }).notNull().default('pending_insert'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        index('idx_invoice_items_invoice_id').on(table.invoiceId),
        index('idx_invoice_items_product_id').on(table.productId),
        index('idx_invoice_items_sync_status').on(table.syncStatus),
    ],
);

export const syncQueue = sqliteTable(
    'sync_queue',
    {
        id: text('id').primaryKey(),
        tableName: text('table_name').notNull(),
        recordId: text('record_id').notNull(),
        operation: text('operation', { enum: syncOperationValues }).notNull(),
        payload: text('payload', { mode: 'json' }).notNull(),
        status: text('status', { enum: syncQueueStatusValues }).notNull().default('queued'),
        attempts: integer('attempts').notNull().default(0),
        lastError: text('last_error'),
        nextRetryAt: integer('next_retry_at'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        index('idx_sync_queue_status').on(table.status),
        index('idx_sync_queue_record').on(table.tableName, table.recordId),
        index('idx_sync_queue_next_retry_at').on(table.nextRetryAt),
    ],
);

export const backupMetadata = sqliteTable(
    'backup_metadata',
    {
        id: text('id').primaryKey(),
        businessId: text('business_id').notNull(),
        userId: text('user_id').references(() => users.id),
        backupId: text('backup_id').notNull(),
        storagePath: text('storage_path').notNull(),
        status: text('status', { enum: ['completed', 'restored', 'failed'] }).notNull(),
        sizeBytes: integer('size_bytes').notNull().default(0),
        recordCounts: text('record_counts', { mode: 'json' }).notNull(),
        lastError: text('last_error'),
        restoredAt: integer('restored_at'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
    (table) => [
        index('idx_backup_metadata_business_id').on(table.businessId),
        index('idx_backup_metadata_created_at').on(table.createdAt),
    ],
);

export const invoiceCustomization = sqliteTable(
    'invoice_customization',
    {
        id: text('id').primaryKey(),
        templateId: text('template_id').notNull(),
        primaryColor: text('primary_color').notNull(),
        fontFamily: text('font_family').notNull(),
        fontSize: text('font_size').notNull(),
        signatureLabel: text('signature_label'),
        signatureImageUri: text('signature_image_uri'),
        updatedAt: integer('updated_at').notNull(),
        createdAt: integer('created_at').notNull(),
    },
);

export const userRelations = relations(users, ({ many }) => ({
    createdCustomers: many(customers, { relationName: 'createdCustomers' }),
    updatedCustomers: many(customers, { relationName: 'updatedCustomers' }),
    createdSuppliers: many(suppliers, { relationName: 'createdSuppliers' }),
    updatedSuppliers: many(suppliers, { relationName: 'updatedSuppliers' }),
    createdProducts: many(products, { relationName: 'createdProducts' }),
    updatedProducts: many(products, { relationName: 'updatedProducts' }),
    createdInvoices: many(invoices, { relationName: 'createdInvoices' }),
    updatedInvoices: many(invoices, { relationName: 'updatedInvoices' }),
}));

export const customerRelations = relations(customers, ({ one }) => ({
    createdBy: one(users, {
        fields: [customers.createdById],
        references: [users.id],
        relationName: 'createdCustomers',
    }),
    lastUpdatedBy: one(users, {
        fields: [customers.lastUpdatedById],
        references: [users.id],
        relationName: 'updatedCustomers',
    }),
}));

export const supplierRelations = relations(suppliers, ({ one, many }) => ({
    createdBy: one(users, {
        fields: [suppliers.createdById],
        references: [users.id],
        relationName: 'createdSuppliers',
    }),
    lastUpdatedBy: one(users, {
        fields: [suppliers.lastUpdatedById],
        references: [users.id],
        relationName: 'updatedSuppliers',
    }),
    products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
    supplier: one(suppliers, {
        fields: [products.supplierId],
        references: [suppliers.id],
    }),
    createdBy: one(users, {
        fields: [products.createdById],
        references: [users.id],
        relationName: 'createdProducts',
    }),
    lastUpdatedBy: one(users, {
        fields: [products.lastUpdatedById],
        references: [users.id],
        relationName: 'updatedProducts',
    }),
    invoiceItems: many(invoiceItems),
}));

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
    customer: one(customers, {
        fields: [invoices.customerId],
        references: [customers.id],
    }),
    createdBy: one(users, {
        fields: [invoices.createdById],
        references: [users.id],
        relationName: 'createdInvoices',
    }),
    lastUpdatedBy: one(users, {
        fields: [invoices.lastUpdatedById],
        references: [users.id],
        relationName: 'updatedInvoices',
    }),
    invoiceItems: many(invoiceItems),
}));

export const invoiceItemRelations = relations(invoiceItems, ({ one }) => ({
    invoice: one(invoices, {
        fields: [invoiceItems.invoiceId],
        references: [invoices.id],
    }),
    product: one(products, {
        fields: [invoiceItems.productId],
        references: [products.id],
    }),
}));

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type AuthSessionRow = typeof authSessions.$inferSelect;
export type NewAuthSessionRow = typeof authSessions.$inferInsert;
export type CustomerRow = typeof customers.$inferSelect;
export type NewCustomerRow = typeof customers.$inferInsert;
export type SupplierRow = typeof suppliers.$inferSelect;
export type NewSupplierRow = typeof suppliers.$inferInsert;
export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
export type InvoiceRow = typeof invoices.$inferSelect;
export type NewInvoiceRow = typeof invoices.$inferInsert;
export type InvoiceItemRow = typeof invoiceItems.$inferSelect;
export type NewInvoiceItemRow = typeof invoiceItems.$inferInsert;
export type SyncQueueRow = typeof syncQueue.$inferSelect;
export type NewSyncQueueRow = typeof syncQueue.$inferInsert;
export type BackupMetadataRow = typeof backupMetadata.$inferSelect;
export type NewBackupMetadataRow = typeof backupMetadata.$inferInsert;
export type InvoiceCustomizationRow = typeof invoiceCustomization.$inferSelect;
export type NewInvoiceCustomizationRow = typeof invoiceCustomization.$inferInsert;
