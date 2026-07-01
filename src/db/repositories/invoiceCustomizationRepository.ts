import { eq } from 'drizzle-orm';
import { db } from '../client';
import { invoiceCustomization, type NewInvoiceCustomizationRow } from '../schema';
import {
    DEFAULT_CUSTOMIZATION,
    type FontFamily,
    type FontSize,
    type InvoiceCustomization,
    type InvoiceTemplateId,
} from '@/src/types/invoice';

const DEFAULT_ROW_ID = 'default';

const templateIds: readonly InvoiceTemplateId[] = ['classic', 'modern', 'minimal', 'bold'];
const fontFamilies: readonly FontFamily[] = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia'];
const fontSizes: readonly FontSize[] = ['small', 'medium', 'large'];

const isTemplateId = (value: string): value is InvoiceTemplateId => templateIds.includes(value as InvoiceTemplateId);
const isFontFamily = (value: string): value is FontFamily => fontFamilies.includes(value as FontFamily);
const isFontSize = (value: string): value is FontSize => fontSizes.includes(value as FontSize);

export const getInvoiceCustomization = async (): Promise<InvoiceCustomization> => {
    const row = await db.query.invoiceCustomization.findFirst({
        where: eq(invoiceCustomization.id, DEFAULT_ROW_ID),
    });

    if (!row) {
        return DEFAULT_CUSTOMIZATION;
    }

    return {
        templateId: isTemplateId(row.templateId) ? row.templateId : DEFAULT_CUSTOMIZATION.templateId,
        primaryColor: row.primaryColor || DEFAULT_CUSTOMIZATION.primaryColor,
        fontFamily: isFontFamily(row.fontFamily) ? row.fontFamily : DEFAULT_CUSTOMIZATION.fontFamily,
        fontSize: isFontSize(row.fontSize) ? row.fontSize : DEFAULT_CUSTOMIZATION.fontSize,
        signature: row.signatureLabel && row.signatureImageUri
            ? {
                label: row.signatureLabel,
                imageUri: row.signatureImageUri,
            }
            : null,
    };
};

export const saveInvoiceCustomization = async (customization: InvoiceCustomization): Promise<void> => {
    const now = Date.now();
    const existing = await db.query.invoiceCustomization.findFirst({
        where: eq(invoiceCustomization.id, DEFAULT_ROW_ID),
    });
    const row: NewInvoiceCustomizationRow = {
        id: DEFAULT_ROW_ID,
        templateId: customization.templateId,
        primaryColor: customization.primaryColor,
        fontFamily: customization.fontFamily,
        fontSize: customization.fontSize,
        signatureLabel: customization.signature?.label ?? null,
        signatureImageUri: customization.signature?.imageUri ?? null,
        updatedAt: now,
        createdAt: existing?.createdAt ?? now,
    };

    if (existing) {
        await db.update(invoiceCustomization)
            .set(row)
            .where(eq(invoiceCustomization.id, DEFAULT_ROW_ID));
        return;
    }

    await db.insert(invoiceCustomization).values(row);
};

