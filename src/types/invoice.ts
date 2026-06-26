// src/types/invoice.ts
// ─────────────────────────────────────────────────────────────────────────────
// Types for invoice data + customization settings (template, color, font, signature)
// ─────────────────────────────────────────────────────────────────────────────

export interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  rate: number;       // price per unit
  amount: number;      // qty * rate
}

export interface InvoiceBusiness {
  name: string;
  address: string;
  mobile: string;
  email: string;
  logoUrl: string | null;   // base64 or remote url
}

export interface InvoiceCustomer {
  name: string;
  address: string;
  mobile: string;
}

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;       // e.g. "01 May, 2026"
  dueDate: string;
  business: InvoiceBusiness;
  customer: InvoiceCustomer;
  items: InvoiceItem[];
  termsAndConditions: string[];
  discountPercent: number;       // e.g. 5 for 5%
  receivedAmount: number;
  // Computed fields (or pre-computed and passed in)
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  balanceAmount: number;
}

// ─── Customization Settings ──────────────────────────────────────────────────

export type InvoiceTemplateId = 'classic' | 'modern' | 'minimal' | 'bold';

export type FontFamily = 'Arial' | 'Helvetica' | 'Times New Roman' | 'Courier New' | 'Georgia';

export type FontSize = 'small' | 'medium' | 'large';

export interface InvoiceSignature {
  label: string;          // e.g. "Authorized Sign"
  imageUri: string | null; // drawn or uploaded signature image (base64)
}

export interface InvoiceCustomization {
  templateId: InvoiceTemplateId;
  primaryColor: string;       // hex, e.g. "#7C3AED" (purple from design)
  fontFamily: FontFamily;
  fontSize: FontSize;
  signature: InvoiceSignature | null;
}

// ─── Default values ──────────────────────────────────────────────────────────

export const DEFAULT_CUSTOMIZATION: InvoiceCustomization = {
  templateId: 'classic',
  primaryColor: '#7C3AED',     // purple, matches your design
  fontFamily: 'Arial',
  fontSize: 'medium',
  signature: null,
};

export const PRESET_COLORS: string[] = [
  '#7C3AED', // purple (default/check)
  '#F97316', // orange
  '#06B6D4', // cyan
  '#F43F5E', // pink/red
  '#14B8A6', // teal
  '#22C55E', // green
  '#FACC15', // yellow
  '#6366F1', // indigo
  '#A8765D', // brown
];

export const FONT_SIZE_MAP: Record<FontSize, { base: number; small: number; large: number; title: number }> = {
  small:  { base: 9,  small: 8,  large: 11, title: 16 },
  medium: { base: 10, small: 9,  large: 13, title: 18 },
  large:  { base: 11, small: 10, large: 15, title: 20 },
};
