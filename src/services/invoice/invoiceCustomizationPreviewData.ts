import { MOCK_INVOICE_DATA } from '@/src/templates/mockInvoiceData';
import type { User } from '@/src/types/auth';
import type { InvoiceData } from '@/src/types/invoice';

export const buildInvoiceCustomizationPreviewData = (user: User | null): InvoiceData => ({
    ...MOCK_INVOICE_DATA,
    business: {
        ...MOCK_INVOICE_DATA.business,
        name: user?.businessName || MOCK_INVOICE_DATA.business.name,
        address: user?.businessAddress || user?.address || MOCK_INVOICE_DATA.business.address,
        mobile: user?.businessPhone || user?.phone || MOCK_INVOICE_DATA.business.mobile,
        email: user?.businessEmail || user?.email || MOCK_INVOICE_DATA.business.email,
        logoUrl: user?.businessLogo || MOCK_INVOICE_DATA.business.logoUrl,
    },
});

