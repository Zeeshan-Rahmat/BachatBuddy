import { defaultCustomer, defaultProduct, defaultUser } from '@/src/constants/defaultData';
import type {
    CustomerRow,
    InvoiceItemRow,
    InvoiceRow,
    ProductRow,
    SupplierRow,
    UserRow,
} from '@/src/db/schema';
import { mapProductRowToAppProduct, mapUserRowToAppUser } from '@/src/services/inventory/productUiMapper';
import type { CustomerType, InvoiceItemType, InvoiceType } from '@/src/types/appTypes';

type ProductRelationRow = ProductRow & {
    supplier: SupplierRow | null;
    createdBy: UserRow | null;
    lastUpdatedBy: UserRow | null;
};

type InvoiceItemRelationRow = InvoiceItemRow & {
    product: ProductRelationRow | null;
};

export type InvoiceRelationRow = InvoiceRow & {
    customer: CustomerRow | null;
    createdBy: UserRow | null;
    lastUpdatedBy: UserRow | null;
    invoiceItems: InvoiceItemRelationRow[];
};

const toIsoString = (timestamp: number | null | undefined): string => {
    return timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
};

export const mapCustomerRowToAppCustomer = (customer: CustomerRow | null | undefined): CustomerType => {
    if (!customer) {
        return defaultCustomer;
    }

    return {
        customer_id: customer.id,
        created_by: defaultUser,
        last_updated_by: defaultUser,
        name: customer.name,
        phone: customer.phone ?? '',
        email: customer.email ?? '',
        address: customer.address ?? '',
        status: customer.status,
        total_purchases: customer.totalPurchases,
        pending_dues: customer.pendingDues,
        total_orders: customer.totalOrders,
        img: customer.img ?? undefined,
        last_purchase_date: toIsoString(customer.lastPurchaseDate),
        created_at: toIsoString(customer.createdAt),
        last_updated_at: toIsoString(customer.updatedAt),
    };
};

export const mapInvoiceItemRowToAppInvoiceItem = (item: InvoiceItemRelationRow): InvoiceItemType => {
    return {
        invoice_item_id: item.id,
        product: item.product ? mapProductRowToAppProduct(item.product) : defaultProduct,
        quantity: item.quantity,
        purchase_price: item.purchasePrice,
        selling_price: item.sellingPrice,
        subtotal: item.subtotal,
        profit: item.profit,
    };
};

export const mapInvoiceRowToAppInvoice = (invoice: InvoiceRelationRow): InvoiceType => {
    return {
        invoice_id: invoice.id,
        created_by: mapUserRowToAppUser(invoice.createdBy),
        last_updated_by: mapUserRowToAppUser(invoice.lastUpdatedBy),
        customer: mapCustomerRowToAppCustomer(invoice.customer),
        invoice_number: invoice.invoiceNumber,
        invoice_items: invoice.invoiceItems.map(mapInvoiceItemRowToAppInvoiceItem),
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        discount_amount: invoice.discountAmount,
        total_amount: invoice.totalAmount,
        paid_amount: invoice.paidAmount,
        remaining_amount: invoice.remainingAmount,
        total_items: invoice.totalItems,
        status: invoice.status,
        due_date: toIsoString(invoice.dueDate),
        img: invoice.img ?? undefined,
        created_at: toIsoString(invoice.createdAt),
        last_updated_at: toIsoString(invoice.updatedAt),
    };
};
