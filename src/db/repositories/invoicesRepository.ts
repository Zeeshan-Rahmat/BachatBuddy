import { and, desc, eq, inArray, ne } from 'drizzle-orm';
import { requestSyncQueueProcessing } from '@/src/services/syncQueueNotifier';
import { db } from '../client';
import {
    customers,
    invoiceItems,
    invoices,
    products,
    syncQueue,
    type CustomerRow,
    type InvoiceItemRow,
    type InvoiceRow,
    type NewInvoiceItemRow,
    type NewInvoiceRow,
    type NewSyncQueueRow,
    type ProductRow,
} from '../schema';

export type CreateInvoiceItemInput = {
    productId: string;
    quantity: number;
    sellingPrice: number;
};

export type CreateInvoiceInput = {
    createdById?: string | null;
    customerId?: string | null;
    dueDate?: number | null;
    paidAmount?: number;
    discount?: number;
    discountAmount?: number;
    img?: string | null;
    items: CreateInvoiceItemInput[];
    requiresApproval?: boolean;
};

export type UpdateInvoiceTotalsInput = {
    lastUpdatedById?: string | null;
    paidAmount: number;
    discount: number;
    discountAmount: number;
    requiresApproval?: boolean;
};

export type UpdateInvoiceDetailInput = {
    lastUpdatedById?: string | null;
    customerId?: string | null;
    dueDate?: number | null;
    img?: string | null;
    requiresApproval?: boolean;
};

export type CreateInvoiceResult = {
    invoiceId: string;
    invoiceNumber: string;
};

const getStockStatus = (quantity: number, minimumQuantity: number): ProductRow['status'] => {
    if (quantity <= 0) {
        return 'Out of Stock';
    }

    if (quantity <= minimumQuantity) {
        return 'Low Stock';
    }

    return 'In Stock';
};

const getInvoiceStatus = (paidAmount: number, totalAmount: number): InvoiceRow['status'] => {
    if (totalAmount <= 0 || paidAmount >= totalAmount) {
        return 'Paid';
    }

    if (paidAmount > 0) {
        return 'Pending';
    }

    return 'Unpaid';
};

const buildInvoiceNumber = (now: number): string => {
    const date = new Date(now);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const suffix = String(now).slice(-6);

    return `INV-${year}${month}${day}-${suffix}`;
};

const buildQueueRow = (
    tableName: string,
    recordId: string,
    operation: NewSyncQueueRow['operation'],
    payload: Record<string, unknown>,
    now: number,
    approvalOperation?: 'insert' | 'update' | 'delete',
): NewSyncQueueRow => ({
    id: crypto.randomUUID(),
    tableName,
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

const normalizeItems = (items: CreateInvoiceItemInput[]): CreateInvoiceItemInput[] => {
    const itemMap = new Map<string, CreateInvoiceItemInput>();

    items.forEach((item) => {
        if (item.quantity <= 0) {
            return;
        }

        const existing = itemMap.get(item.productId);
        if (existing) {
            itemMap.set(item.productId, {
                productId: item.productId,
                quantity: existing.quantity + item.quantity,
                sellingPrice: item.sellingPrice,
            });
            return;
        }

        itemMap.set(item.productId, item);
    });

    return Array.from(itemMap.values());
};

const calculateTotals = (
    items: (CreateInvoiceItemInput & { purchasePrice: number })[],
    paidAmount = 0,
    discount = 0,
    discountAmount?: number,
) => {
    const subtotal = items.reduce((total, item) => total + item.quantity * item.sellingPrice, 0);
    const normalizedDiscountAmount = discountAmount ?? (discount / 100) * subtotal;
    const totalAmount = Math.max(0, subtotal - normalizedDiscountAmount);
    const remainingAmount = Math.max(0, totalAmount - paidAmount);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return {
        subtotal,
        discount,
        discountAmount: normalizedDiscountAmount,
        totalAmount,
        paidAmount,
        remainingAmount,
        totalItems,
        status: getInvoiceStatus(paidAmount, totalAmount),
    };
};

export const listInvoicesWithRelations = async () => {
    return db.query.invoices.findMany({
        where: ne(invoices.syncStatus, 'pending_delete'),
        with: {
            customer: true,
            createdBy: true,
            lastUpdatedBy: true,
            invoiceItems: {
                with: {
                    product: {
                        with: {
                            supplier: true,
                            createdBy: true,
                            lastUpdatedBy: true,
                        },
                    },
                },
            },
        },
        orderBy: desc(invoices.updatedAt),
    });
};

export const getInvoiceByIdWithRelations = async (id: string) => {
    return db.query.invoices.findFirst({
        where: eq(invoices.id, id),
        with: {
            customer: true,
            createdBy: true,
            lastUpdatedBy: true,
            invoiceItems: {
                with: {
                    product: {
                        with: {
                            supplier: true,
                            createdBy: true,
                            lastUpdatedBy: true,
                        },
                    },
                },
            },
        },
    });
};

export const createInvoice = async (input: CreateInvoiceInput): Promise<CreateInvoiceResult> => {
    const normalizedItems = normalizeItems(input.items);

    if (normalizedItems.length === 0) {
        throw new Error('Select at least one product.');
    }

    const productIds = normalizedItems.map((item) => item.productId);
    const productRows = await db.select().from(products).where(inArray(products.id, productIds));
    const productMap = new Map(productRows.map((product) => [product.id, product]));

    const invoiceItemsWithPrices = normalizedItems.map((item) => {
        const product = productMap.get(item.productId);

        if (!product || product.syncStatus === 'pending_delete') {
            throw new Error('One or more selected products are no longer available.');
        }

        if (item.quantity > product.quantity) {
            throw new Error(`${product.name} has only ${product.quantity} in stock.`);
        }

        return {
            ...item,
            purchasePrice: product.purchasePrice,
        };
    });

    const now = Date.now();
    const invoiceId = crypto.randomUUID();
    const invoiceNumber = buildInvoiceNumber(now);
    const queueOperation: NewSyncQueueRow['operation'] = input.requiresApproval ? 'approval_request' : 'insert';
    const updateQueueOperation: NewSyncQueueRow['operation'] = input.requiresApproval ? 'approval_request' : 'update';
    const syncStatus = input.requiresApproval ? 'pending_approval' : 'pending_insert';
    const totals = calculateTotals(
        invoiceItemsWithPrices,
        input.paidAmount ?? 0,
        input.discount ?? 0,
        input.discountAmount,
    );

    const invoiceRow: NewInvoiceRow = {
        id: invoiceId,
        createdById: input.createdById ?? null,
        lastUpdatedById: input.createdById ?? null,
        customerId: input.customerId ?? null,
        invoiceNumber,
        subtotal: totals.subtotal,
        discount: totals.discount,
        discountAmount: totals.discountAmount,
        totalAmount: totals.totalAmount,
        paidAmount: totals.paidAmount,
        remainingAmount: totals.remainingAmount,
        totalItems: totals.totalItems,
        status: totals.status,
        dueDate: input.dueDate ?? null,
        img: input.img ?? null,
        syncStatus,
        updatedAt: now,
        createdAt: now,
    };

    const invoiceItemRows: NewInvoiceItemRow[] = invoiceItemsWithPrices.map((item) => ({
        id: crypto.randomUUID(),
        invoiceId,
        productId: item.productId,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        sellingPrice: item.sellingPrice,
        subtotal: item.quantity * item.sellingPrice,
        profit: item.quantity * (item.sellingPrice - item.purchasePrice),
        syncStatus,
        updatedAt: now,
        createdAt: now,
    }));

    db.transaction((tx) => {
        tx.insert(invoices).values(invoiceRow).run();
        invoiceItemRows.forEach((itemRow) => {
            tx.insert(invoiceItems).values(itemRow).run();
        });

        tx.insert(syncQueue).values(buildQueueRow('invoices', invoiceId, queueOperation, invoiceRow, now, input.requiresApproval ? 'insert' : undefined)).run();
        invoiceItemRows.forEach((itemRow) => {
            tx.insert(syncQueue).values(buildQueueRow('invoice_items', itemRow.id, queueOperation, itemRow, now, input.requiresApproval ? 'insert' : undefined)).run();
        });

        invoiceItemsWithPrices.forEach((item) => {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error('Product disappeared during invoice creation.');
            }

            const quantity = product.quantity - item.quantity;
            const soldStock = product.soldStock + item.quantity;
            const updatedProduct: ProductRow = {
                ...product,
                quantity,
                soldStock,
                status: getStockStatus(quantity, product.minimumQuantity),
                syncStatus: input.requiresApproval
                    ? 'pending_approval'
                    : product.syncStatus === 'pending_insert'
                        ? 'pending_insert'
                        : 'pending_update',
                updatedAt: now,
            };

            tx.update(products).set(updatedProduct).where(eq(products.id, product.id)).run();
            tx.insert(syncQueue).values(buildQueueRow('products', product.id, updateQueueOperation, updatedProduct, now, input.requiresApproval ? 'update' : undefined)).run();
        });

        if (input.customerId) {
            const customerRows = tx.select().from(customers).where(eq(customers.id, input.customerId)).limit(1).all();
            const customer = customerRows[0];

            if (customer) {
                const updatedCustomer: CustomerRow = {
                    ...customer,
                    totalPurchases: customer.totalPurchases + totals.totalAmount,
                    pendingDues: customer.pendingDues + totals.remainingAmount,
                    totalOrders: customer.totalOrders + 1,
                    lastPurchaseDate: now,
                    syncStatus: input.requiresApproval
                        ? 'pending_approval'
                        : customer.syncStatus === 'pending_insert'
                            ? 'pending_insert'
                            : 'pending_update',
                    updatedAt: now,
                };

                tx.update(customers).set(updatedCustomer).where(eq(customers.id, customer.id)).run();
                tx.insert(syncQueue).values(buildQueueRow('customers', customer.id, updateQueueOperation, updatedCustomer, now, input.requiresApproval ? 'update' : undefined)).run();
            }
        }
    });
    requestSyncQueueProcessing();

    return {
        invoiceId,
        invoiceNumber,
    };
};

export const updateInvoiceTotals = async (id: string, input: UpdateInvoiceTotalsInput): Promise<InvoiceRow> => {
    const existing = await db.query.invoices.findFirst({
        where: eq(invoices.id, id),
    });

    if (!existing) {
        throw new Error('Invoice not found.');
    }

    const totals = calculateTotals(
        [{ productId: 'invoice-subtotal', quantity: 1, sellingPrice: existing.subtotal, purchasePrice: existing.subtotal }],
        input.paidAmount,
        input.discount,
        input.discountAmount,
    );
    const now = Date.now();
    const updatedInvoice: InvoiceRow = {
        ...existing,
        lastUpdatedById: input.lastUpdatedById ?? existing.lastUpdatedById,
        discount: totals.discount,
        discountAmount: totals.discountAmount,
        totalAmount: totals.totalAmount,
        paidAmount: totals.paidAmount,
        remainingAmount: totals.remainingAmount,
        status: totals.status,
        syncStatus: input.requiresApproval
            ? 'pending_approval'
            : existing.syncStatus === 'pending_insert'
                ? 'pending_insert'
                : 'pending_update',
        updatedAt: now,
    };
    const operation: NewSyncQueueRow['operation'] = input.requiresApproval ? 'approval_request' : 'update';

    db.transaction((tx) => {
        tx.update(invoices).set(updatedInvoice).where(eq(invoices.id, id)).run();
        tx.insert(syncQueue).values(buildQueueRow('invoices', id, operation, updatedInvoice, now, input.requiresApproval ? 'update' : undefined)).run();
    });
    requestSyncQueueProcessing();

    return updatedInvoice;
};

export const updateInvoiceDetail = async (id: string, input: UpdateInvoiceDetailInput): Promise<InvoiceRow> => {
    const existing = await db.query.invoices.findFirst({
        where: eq(invoices.id, id),
    });

    if (!existing) {
        throw new Error('Invoice not found.');
    }

    const now = Date.now();
    const nextCustomerId = Object.prototype.hasOwnProperty.call(input, 'customerId')
        ? input.customerId ?? null
        : existing.customerId;
    const updatedInvoice: InvoiceRow = {
        ...existing,
        lastUpdatedById: input.lastUpdatedById ?? existing.lastUpdatedById,
        customerId: nextCustomerId,
        dueDate: input.dueDate ?? existing.dueDate,
        img: input.img ?? existing.img,
        syncStatus: input.requiresApproval
            ? 'pending_approval'
            : existing.syncStatus === 'pending_insert'
                ? 'pending_insert'
                : 'pending_update',
        updatedAt: now,
    };
    const operation: NewSyncQueueRow['operation'] = input.requiresApproval ? 'approval_request' : 'update';
    const customerChanged = existing.customerId !== nextCustomerId;
    const customerOperation: NewSyncQueueRow['operation'] = input.requiresApproval ? 'approval_request' : 'update';
    const nextCustomerSyncStatus: CustomerRow['syncStatus'] = input.requiresApproval ? 'pending_approval' : 'pending_update';

    db.transaction((tx) => {
        if (customerChanged && nextCustomerId) {
            const nextCustomerRows = tx.select().from(customers).where(eq(customers.id, nextCustomerId)).limit(1).all();

            if (!nextCustomerRows[0] || nextCustomerRows[0].syncStatus === 'pending_delete') {
                throw new Error('Selected customer is no longer available.');
            }
        }

        tx.update(invoices).set(updatedInvoice).where(eq(invoices.id, id)).run();
        tx.insert(syncQueue).values(buildQueueRow('invoices', id, operation, updatedInvoice, now, input.requiresApproval ? 'update' : undefined)).run();

        if (customerChanged && existing.customerId) {
            const oldCustomerRows = tx.select().from(customers).where(eq(customers.id, existing.customerId)).limit(1).all();
            const oldCustomer = oldCustomerRows[0];

            if (oldCustomer) {
                const latestRemainingInvoice = tx
                    .select()
                    .from(invoices)
                    .where(and(
                        eq(invoices.customerId, oldCustomer.id),
                        ne(invoices.id, id),
                        ne(invoices.syncStatus, 'pending_delete'),
                    ))
                    .orderBy(desc(invoices.createdAt))
                    .limit(1)
                    .all()[0];
                const updatedOldCustomer: CustomerRow = {
                    ...oldCustomer,
                    totalPurchases: Math.max(0, oldCustomer.totalPurchases - existing.totalAmount),
                    pendingDues: Math.max(0, oldCustomer.pendingDues - existing.remainingAmount),
                    totalOrders: Math.max(0, oldCustomer.totalOrders - 1),
                    lastPurchaseDate: latestRemainingInvoice?.createdAt ?? null,
                    syncStatus: oldCustomer.syncStatus === 'pending_insert'
                        ? 'pending_insert'
                        : nextCustomerSyncStatus,
                    updatedAt: now,
                };

                tx.update(customers).set(updatedOldCustomer).where(eq(customers.id, oldCustomer.id)).run();
                tx.insert(syncQueue).values(buildQueueRow('customers', oldCustomer.id, customerOperation, updatedOldCustomer, now, input.requiresApproval ? 'update' : undefined)).run();
            }
        }

        if (customerChanged && nextCustomerId) {
            const newCustomerRows = tx.select().from(customers).where(eq(customers.id, nextCustomerId)).limit(1).all();
            const newCustomer = newCustomerRows[0];

            if (newCustomer) {
                const updatedNewCustomer: CustomerRow = {
                    ...newCustomer,
                    totalPurchases: newCustomer.totalPurchases + existing.totalAmount,
                    pendingDues: newCustomer.pendingDues + existing.remainingAmount,
                    totalOrders: newCustomer.totalOrders + 1,
                    lastPurchaseDate: Math.max(newCustomer.lastPurchaseDate ?? 0, existing.createdAt),
                    syncStatus: newCustomer.syncStatus === 'pending_insert'
                        ? 'pending_insert'
                        : nextCustomerSyncStatus,
                    updatedAt: now,
                };

                tx.update(customers).set(updatedNewCustomer).where(eq(customers.id, newCustomer.id)).run();
                tx.insert(syncQueue).values(buildQueueRow('customers', newCustomer.id, customerOperation, updatedNewCustomer, now, input.requiresApproval ? 'update' : undefined)).run();
            }
        }
    });
    requestSyncQueueProcessing();

    return updatedInvoice;
};

export const markInvoicePendingDelete = async (id: string, requiresApproval = false): Promise<boolean> => {
    const existing = await getInvoiceByIdWithRelations(id);

    if (!existing) {
        return false;
    }

    const now = Date.now();
    const operation: NewSyncQueueRow['operation'] = requiresApproval ? 'approval_request' : 'delete';
    const updateOperation: NewSyncQueueRow['operation'] = requiresApproval ? 'approval_request' : 'update';
    const deletedInvoice: InvoiceRow = {
        ...existing,
        syncStatus: requiresApproval ? 'pending_approval' : 'pending_delete',
        updatedAt: now,
    };

    db.transaction((tx) => {
        tx.update(invoices).set(deletedInvoice).where(eq(invoices.id, id)).run();
        tx.insert(syncQueue).values(buildQueueRow('invoices', id, operation, deletedInvoice, now, requiresApproval ? 'delete' : undefined)).run();

        existing.invoiceItems.forEach((item) => {
            const deletedItem: InvoiceItemRow = {
                ...item,
                syncStatus: requiresApproval ? 'pending_approval' : 'pending_delete',
                updatedAt: now,
            };
            tx.update(invoiceItems).set(deletedItem).where(eq(invoiceItems.id, item.id)).run();
            tx.insert(syncQueue).values(buildQueueRow('invoice_items', item.id, operation, deletedItem, now, requiresApproval ? 'delete' : undefined)).run();

            if (!item.product) {
                return;
            }

            const quantity = item.product.quantity + item.quantity;
            const soldStock = Math.max(0, item.product.soldStock - item.quantity);
            const updatedProduct: ProductRow = {
                ...item.product,
                quantity,
                soldStock,
                status: getStockStatus(quantity, item.product.minimumQuantity),
                syncStatus: requiresApproval
                    ? 'pending_approval'
                    : item.product.syncStatus === 'pending_insert'
                        ? 'pending_insert'
                        : 'pending_update',
                updatedAt: now,
            };

            tx.update(products).set(updatedProduct).where(eq(products.id, item.product.id)).run();
            tx.insert(syncQueue).values(buildQueueRow('products', item.product.id, updateOperation, updatedProduct, now, requiresApproval ? 'update' : undefined)).run();
        });
    });
    requestSyncQueueProcessing();

    return true;
};
