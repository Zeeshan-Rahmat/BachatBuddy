import { desc, eq, ne } from 'drizzle-orm';
import { db } from '../client';
import { products, syncQueue, type NewProductRow, type NewSyncQueueRow, type ProductRow } from '../schema';

export type CreateProductInput = {
    createdById?: string | null;
    supplierId?: string | null;
    name: string;
    purchasePrice: number;
    minSellingPrice: number;
    maxSellingPrice: number;
    quantity: number;
    minimumQuantity: number;
    img?: string | null;
    requiresApproval?: boolean;
};

export type UpdateProductInput = Partial<Omit<CreateProductInput, 'createdById'>> & {
    lastUpdatedById?: string | null;
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

const buildQueueRow = (
    tableName: string,
    recordId: string,
    operation: NewSyncQueueRow['operation'],
    payload: Record<string, unknown>,
    now: number,
): NewSyncQueueRow => ({
    id: crypto.randomUUID(),
    tableName,
    recordId,
    operation,
    payload,
    status: 'queued',
    attempts: 0,
    updatedAt: now,
    createdAt: now,
});

export const listProducts = async (): Promise<ProductRow[]> => {
    return db
        .select()
        .from(products)
        .where(ne(products.syncStatus, 'pending_delete'))
        .orderBy(desc(products.updatedAt));
};

export const listProductsWithRelations = async () => {
    return db.query.products.findMany({
        where: ne(products.syncStatus, 'pending_delete'),
        with: {
            supplier: true,
            createdBy: true,
            lastUpdatedBy: true,
        },
        orderBy: desc(products.updatedAt),
    });
};

export const getProductById = async (id: string): Promise<ProductRow | undefined> => {
    return db.query.products.findFirst({
        where: eq(products.id, id),
    });
};

export const createProduct = async (input: CreateProductInput): Promise<ProductRow> => {
    const now = Date.now();
    const product: NewProductRow = {
        id: crypto.randomUUID(),
        createdById: input.createdById ?? null,
        lastUpdatedById: input.createdById ?? null,
        supplierId: input.supplierId ?? null,
        name: input.name,
        purchasePrice: input.purchasePrice,
        minSellingPrice: input.minSellingPrice,
        maxSellingPrice: input.maxSellingPrice,
        quantity: input.quantity,
        minimumQuantity: input.minimumQuantity,
        status: getStockStatus(input.quantity, input.minimumQuantity),
        addedStock: input.quantity,
        soldStock: 0,
        img: input.img ?? null,
        syncStatus: input.requiresApproval ? 'pending_approval' : 'pending_insert',
        updatedAt: now,
        createdAt: now,
    };

    const queueRow = buildQueueRow(
        'products',
        product.id,
        input.requiresApproval ? 'approval_request' : 'insert',
        product,
        now,
    );

    db.transaction((tx) => {
        tx.insert(products).values(product).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return product as ProductRow;
};

export const updateProduct = async (id: string, input: UpdateProductInput): Promise<ProductRow | undefined> => {
    const existing = await getProductById(id);

    if (!existing) {
        return undefined;
    }

    const now = Date.now();
    const quantity = input.quantity ?? existing.quantity;
    const minimumQuantity = input.minimumQuantity ?? existing.minimumQuantity;
    const updatedProduct: ProductRow = {
        ...existing,
        supplierId: input.supplierId ?? existing.supplierId,
        lastUpdatedById: input.lastUpdatedById ?? existing.lastUpdatedById,
        name: input.name ?? existing.name,
        purchasePrice: input.purchasePrice ?? existing.purchasePrice,
        minSellingPrice: input.minSellingPrice ?? existing.minSellingPrice,
        maxSellingPrice: input.maxSellingPrice ?? existing.maxSellingPrice,
        quantity,
        minimumQuantity,
        status: getStockStatus(quantity, minimumQuantity),
        img: input.img ?? existing.img,
        syncStatus: input.requiresApproval
            ? 'pending_approval'
            : existing.syncStatus === 'pending_insert'
                ? 'pending_insert'
                : 'pending_update',
        updatedAt: now,
    };
    const queueRow = buildQueueRow(
        'products',
        id,
        input.requiresApproval ? 'approval_request' : 'update',
        updatedProduct,
        now,
    );

    db.transaction((tx) => {
        tx.update(products).set(updatedProduct).where(eq(products.id, id)).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return updatedProduct;
};

export const markProductPendingDelete = async (id: string, requiresApproval = false): Promise<boolean> => {
    const existing = await getProductById(id);

    if (!existing) {
        return false;
    }

    const now = Date.now();
    const deletedProduct: ProductRow = {
        ...existing,
        syncStatus: requiresApproval ? 'pending_approval' : 'pending_delete',
        updatedAt: now,
    };
    const queueRow = buildQueueRow(
        'products',
        id,
        requiresApproval ? 'approval_request' : 'delete',
        deletedProduct,
        now,
    );

    db.transaction((tx) => {
        tx.update(products).set(deletedProduct).where(eq(products.id, id)).run();
        tx.insert(syncQueue).values(queueRow).run();
    });

    return true;
};
