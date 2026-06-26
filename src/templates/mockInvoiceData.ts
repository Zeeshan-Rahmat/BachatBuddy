// src/templates/mockInvoiceData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Sample data matching your "Zeeshan Electronics" PDF exactly.
// Use this to test the template before wiring real data from your database.
// ─────────────────────────────────────────────────────────────────────────────

import type { InvoiceData } from '../types/invoice';

export const MOCK_INVOICE_DATA: InvoiceData = {
  invoiceNo: 'INV2026-2401203015',
  invoiceDate: '01 May, 2026',
  dueDate: '10 May, 2026',

  business: {
    name: 'Zeeshan Electronics',
    address: 'Tall Main Road, Togh Sarai, Hangu, KPK',
    mobile: '+92 0123 1234567',
    email: 'zeeshanelectronics@email.com',
    logoUrl: null,   // add base64 logo here when available
  },

  customer: {
    name: 'Junaid Rehman',
    address: 'Kohat, KPK',
    mobile: '+92 0123 1234567',
  },

  items: [
    {
      id: '1',
      name: 'Smart Watch Series 5',
      qty: 2,
      rate: 49999,
      amount: 99998,
    },
    {
      id: '2',
      name: 'USB Type C',
      qty: 5,
      rate: 1500,
      amount: 7500,
    },
  ],

  termsAndConditions: [
    'Payment is due at the time of purchase; no credit offered.',
    'Goods cannot be returned or exchanged unless defective.',
    'All products are subject to availability, and prices may change without prior notice.',
    'The customer is responsible for checking product quality before purchase.',
  ],

  discountPercent: 5,
  receivedAmount: 0,

  // Computed values
  subtotal: 99998,
  discountAmount: 4998,        // 5% of 99,998 ≈ 4,998 (rounded as in original)
  totalAmount: 95000,           // 99998 - 4998 ≈ 95,000 (rounded as in original)
  balanceAmount: 95000,         // totalAmount - receivedAmount
};

// ─── Helper to compute totals from items + discount (use this in real app) ──
export function computeInvoiceTotals(
  items: { qty: number; rate: number }[],
  discountPercent: number,
  receivedAmount: number
) {
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = subtotal - discountAmount;
  const balanceAmount = totalAmount - receivedAmount;

  return { subtotal, discountAmount, totalAmount, balanceAmount };
}
