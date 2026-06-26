// src/services/invoice/pdfService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Converts the HTML invoice template into an actual PDF file using expo-print,
// then lets the user share/save it using expo-sharing.
//
// NOTE: expo-file-system v18+ (SDK 52+) replaced the old `FileSystem.documentDirectory`
// string constant with the new `Paths` + `File` / `Directory` class API.
// If you're on an older SDK (<52), use the /legacy import instead:
//   import * as FileSystem from 'expo-file-system/legacy';
// and keep using FileSystem.documentDirectory as before.
// ─────────────────────────────────────────────────────────────────────────────

import { Directory, File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateInvoiceHtml } from '../../templates/invoiceTemplate';
import type { InvoiceCustomization, InvoiceData } from '../../types/invoice';

// ─── Generate PDF file (returns local file uri) ──────────────────────────────
export async function generateInvoicePdf(
    data: InvoiceData,
    customization: InvoiceCustomization
): Promise<string> {
    const html = generateInvoiceHtml(data, customization);

    const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        width: 612,    // US Letter width in points
        height: 792,
    });

    return uri;
}

// ─── Generate + Share immediately ────────────────────────────────────────────
export async function generateAndShareInvoice(
    data: InvoiceData,
    customization: InvoiceCustomization
): Promise<void> {
    const uri = await generateInvoicePdf(data, customization);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: `Invoice ${data.invoiceNo}`,
            UTI: 'com.adobe.pdf',
        });
    }
}

// ─── Save PDF to a permanent location with custom filename ──────────────────
// Uses the new expo-file-system v18+ class-based API:
//   Paths.document        → app's document directory (Directory instance)
//   new Directory(...)    → represents a folder
//   new File(...)         → represents a file
//   .create()             → creates dir/file if missing
//   .copy() / .move()     → file operations
export async function saveInvoicePdf(
    data: InvoiceData,
    customization: InvoiceCustomization
): Promise<string> {
    const tempUri = await generateInvoicePdf(data, customization);

    const fileName = `Invoice_${data.invoiceNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    // Ensure the "invoices" subfolder exists inside the document directory
    const invoicesDir = new Directory(Paths.document, 'invoices');
    if (!invoicesDir.exists) {
        invoicesDir.create({ intermediates: true });
    }

    // Wrap the temp PDF as a File instance and copy it into the invoices folder
    const sourceFile = new File(tempUri);
    const destFile = new File(invoicesDir, fileName);

    // If a file with the same name already exists, delete it first
    if (destFile.exists) {
        destFile.delete();
    }

    sourceFile.copy(destFile);

    return destFile.uri;
}

// ─── Direct print (opens native print dialog) ────────────────────────────────
export async function printInvoice(
    data: InvoiceData,
    customization: InvoiceCustomization
): Promise<void> {
    const html = generateInvoiceHtml(data, customization);
    await Print.printAsync({ html });
}