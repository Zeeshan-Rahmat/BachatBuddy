import { desc, ne } from 'drizzle-orm';
import { db } from '../client';
import { customers, type CustomerRow } from '../schema';

export const listCustomers = async (): Promise<CustomerRow[]> => {
    return db
        .select()
        .from(customers)
        .where(ne(customers.syncStatus, 'pending_delete'))
        .orderBy(desc(customers.updatedAt));
};
