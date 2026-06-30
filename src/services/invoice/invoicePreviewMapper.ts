import type { User } from '@/src/types/auth';
import type { InvoiceData } from '@/src/types/invoice';
import type { InvoiceType } from '@/src/types/appTypes';

const TERMS_AND_CONDITIONS = [
    'Payment is due at the time of purchase; no credit offered.',
    'Goods cannot be returned or exchanged unless defective.',
    'All products are subject to availability, and prices may change without prior notice.',
    'The customer is responsible for checking product quality before purchase.',
];

const formatInvoiceDate = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    return dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const mapInvoiceToPreviewData = (invoice: InvoiceType, user: User | null): InvoiceData => {
    const businessName = user?.businessName || 'BachatBuddy';

    return {
        invoiceNo: invoice.invoice_number,
        invoiceDate: formatInvoiceDate(invoice.created_at),
        dueDate: formatInvoiceDate(invoice.due_date),
        business: {
            name: businessName,
            address: user?.businessAddress || user?.address || '',
            mobile: user?.businessPhone || user?.phone || '',
            email: user?.businessEmail || user?.email || '',
            logoUrl: user?.businessLogo || null,
        },
        customer: {
            name: invoice.customer.name,
            address: invoice.customer.address,
            mobile: invoice.customer.phone,
        },
        items: invoice.invoice_items.map((item) => ({
            id: item.invoice_item_id,
            name: item.product.name,
            qty: item.quantity,
            rate: item.selling_price,
            amount: item.subtotal,
        })),
        termsAndConditions: TERMS_AND_CONDITIONS,
        discountPercent: invoice.discount,
        receivedAmount: invoice.paid_amount,
        subtotal: invoice.subtotal,
        discountAmount: invoice.discount_amount,
        totalAmount: invoice.total_amount,
        balanceAmount: invoice.remaining_amount,
    };
};
