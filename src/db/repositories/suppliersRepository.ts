import { desc, ne } from 'drizzle-orm';
import { db } from '../client';
import { suppliers, type SupplierRow } from '../schema';

export const listSuppliers = async (): Promise<SupplierRow[]> => {
    return db
        .select()
        .from(suppliers)
        .where(ne(suppliers.syncStatus, 'pending_delete'))
        .orderBy(desc(suppliers.updatedAt));
};
