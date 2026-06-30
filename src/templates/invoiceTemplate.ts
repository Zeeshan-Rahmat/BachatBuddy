// src/templates/invoiceTemplate.ts
// ─────────────────────────────────────────────────────────────────────────────
// Generates the HTML string for the invoice, used by expo-print's
// Print.printToFileAsync({ html }) to produce the final PDF.
//
// This template matches the "Zeeshan Electronics" design exactly:
//   - Diagonal striped header/footer bar in the theme color
//   - Logo + Business name + address + contact
//   - BILL TO / Invoice meta two-column section
//   - Items table
//   - Subtotal / Terms & Conditions / Discount / Total / Received / Balance
//   - Signature line
//
// All visual aspects (color, font family, font size) are driven by
// InvoiceCustomization so the Customize Invoice screen can live-update this.
// ─────────────────────────────────────────────────────────────────────────────

import type { InvoiceCustomization, InvoiceData } from '../types/invoice';
import { FONT_SIZE_MAP } from '../types/invoice';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPKR(value: number): string {
  return `${value.toLocaleString('en-PK')} PKR`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Generates the diagonal striped bar (black + white stripes + color line)
// Matches the top/bottom bars in the design exactly
function stripedBar(color: string, flip = false): string {
  return `
    <div class="striped-bar ${flip ? 'flip' : ''}">
      <div class="stripes"></div>
      <div class="color-line" style="background:${color}"></div>
    </div>
  `;
}

// ─── Main Template Function ──────────────────────────────────────────────────

export function generateInvoiceHtml(
  data: InvoiceData,
  customization: InvoiceCustomization
): string {
  const { primaryColor, fontFamily, fontSize, signature, templateId } = customization;
  const sizes = FONT_SIZE_MAP[fontSize];

  const itemsRows = data.items
    .map(
      (item, index) => `
      <tr>
        <td class="cell-center">${index + 1}</td>
        <td>${escapeHtml(item.name)}</td>
        <td class="cell-center">${item.qty}</td>
        <td class="cell-right">${formatPKR(item.rate)}</td>
        <td class="cell-right">${formatPKR(item.amount)}</td>
      </tr>`
    )
    .join('');

  // Pad with empty rows so table has consistent height (matches design's whitespace)
  const minRows = 6;
  const emptyRowsNeeded = Math.max(0, minRows - data.items.length);
  const emptyRows = Array.from({ length: emptyRowsNeeded })
    .map(
      () => `
      <tr class="empty-row">
        <td>&nbsp;</td><td></td><td></td><td></td><td></td>
      </tr>`
    )
    .join('');

  const termsHtml = data.termsAndConditions
    .map((term, i) => `<li>${escapeHtml(term)}</li>`)
    .join('');

  const signatureBlock = signature?.imageUri
    ? `<img src="${signature.imageUri}" class="signature-img" />`
    : '';

  const signatureLabel = signature?.label
    ? escapeHtml(signature.label)
    : 'Authorized Sign';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page {
      margin: 14px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: '${fontFamily}', Helvetica, Arial, sans-serif;
      font-size: ${sizes.base}px;
      color: #1a1a1a;
      background: #ffffff;
      padding: 14px;
    }

    .invoice-wrapper {
      width: 100%;
      max-width: 560px;
      margin: 0 auto;
      background: #fff;
    }

    /* ── Striped Bar (top & bottom) ─────────────────────────────────────── */
    .striped-bar {
      position: relative;
      width: 100%;
      height: 22px;
      overflow: hidden;
    }
    .striped-bar .stripes {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 14px;
      background: repeating-linear-gradient(
        135deg,
        #000 0px, #000 8px,
        #fff 8px, #fff 16px
      );
    }
    .striped-bar .color-line {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 8px;
    }
    .striped-bar.flip .stripes {
      top: auto;
      bottom: 0;
    }
    .striped-bar.flip .color-line {
      bottom: auto;
      top: 0;
    }

    /* ── Header: Logo + Business Info ───────────────────────────────────── */
    .header {
      display: flex;
      align-items: flex-start;
      padding: 20px 32px 14px 32px;
      gap: 16px;
      border-bottom: 2px solid ${primaryColor};
    }
    .logo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
    .logo-placeholder {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${primaryColor}22;
      border: 2px solid ${primaryColor};
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${sizes.title}px;
      color: ${primaryColor};
    }
    .business-info {
      flex: 1;
    }
    .business-name {
      font-size: ${sizes.title}px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 4px;
    }
    .business-address {
      font-size: ${sizes.small}px;
      color: #333;
      margin-bottom: 2px;
    }
    .business-contact {
      font-size: ${sizes.small}px;
      color: #333;
    }
    .business-contact b {
      font-weight: 700;
    }

    /* ── Bill To / Invoice Meta ─────────────────────────────────────────── */
    .meta-section {
      display: flex;
      padding: 16px 32px;
      gap: 24px;
    }
    .meta-col {
      flex: 1;
    }
    .meta-col:first-child {
      border-right: 1px solid #ccc;
      padding-right: 24px;
    }
    .meta-label {
      font-size: ${sizes.small}px;
      font-weight: 700;
      color: #555;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .meta-name {
      font-size: ${sizes.base}px;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .meta-line {
      font-size: ${sizes.small}px;
      color: #333;
      margin-bottom: 2px;
    }
    .meta-line b {
      font-weight: 700;
    }

    #invoice-no{
      padding-top: 15px;
    }

    /* ── Items Table ───────────────────────────────────────────────────── */

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      table-layout: fixed; /* Forces columns to obey width declarations */
    }
    .items-table thead tr {
      border-top: 2px solid ${primaryColor};
      border-bottom: 2px solid ${primaryColor};
    }
    .items-table th {
      text-align: left;
      font-size: ${sizes.small}px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 8px 32px;
      color: #333;
    }
    .items-table th:first-child,
    .items-table td:first-child { padding-left: 32px; }
    .items-table th:last-child,
    .items-table td:last-child { padding-right: 32px; }

    .items-table td {
      font-size: ${sizes.base}px;
      padding: 10px 16px;
      color: #1a1a1a;
    }

    .items-table .empty-row td {
      padding: 10px 16px;
      border: none;
    }

    .cell-center{
      text-align: center;
    }

    .cell-right{
      text-align: right;
    }


    /* Define exact column footprints */
    .items-table th:nth-child(1) { width: 10%; text-align: center; }  /* S.NO */
    .items-table th:nth-child(2) { width: 40%; text-align: left; } /* ITEMS */
    .items-table th:nth-child(3) { width: 10%; text-align: center; } /* QTY */
    .items-table th:nth-child(4) { width: 20%; text-align: right; } /* RATE */
    .items-table th:nth-child(5) { width: 20%; text-align: right; } /* AMOUNT */

    /* ── Subtotal Row ──────────────────────────────────────────────────── */
    .subtotal-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid ${primaryColor};
      border-bottom: 2px solid ${primaryColor};
      padding: 10px 32px;
      margin-top: 4px;
      font-weight: 700;
      font-size: ${sizes.base}px;
    }
    .subtotal-row .label { flex: 0 0 40%; }
    .subtotal-row .qty   { flex: 0 0 20%; text-align: center; }
    .subtotal-row .amt   { flex: 0 0 40%; text-align: right; }

    /* ── Terms & Totals Section ────────────────────────────────────────── */
    .bottom-section {
      display: flex;
      padding: 20px 32px;
      gap: 24px;
    }
    .terms-col {
      flex: 1.3;
    }
    .terms-title {
      font-size: ${sizes.base}px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .terms-col ol {
      padding-left: 18px;
      font-size: ${sizes.small}px;
      color: #333;
      line-height: 1.5;
    }
    .terms-col li { margin-bottom: 4px; }

    .totals-col {
      flex: 1;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: ${sizes.base}px;
      border-bottom: 1px solid #ddd;
    }
    .totals-row.total-amount {
      border-top: 2px solid #333;
      border-bottom: 2px solid #333;
      font-weight: 700;
      font-size: ${sizes.large}px;
      padding: 10px 0;
    }
    .totals-row .t-label { color: #333; }
    .totals-row .t-value { font-weight: 600; }

    /* ── Signature ─────────────────────────────────────────────────────── */
    .signature-section {
      display: flex;
      justify-content: flex-end;
      padding: 24px 32px 12px 32px;
    }
    .signature-block {
      text-align: center;
      min-width: 220px;
    }
    .signature-img {
      max-height: 50px;
      max-width: 200px;
      margin-bottom: 4px;
    }
    .signature-line {
      border-top: 1.5px solid #333;
      margin-bottom: 6px;
    }
    .signature-label {
      font-size: ${sizes.small}px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .footer-spacer { height: 12px; }
  </style>
</head>
<body>
  <div class="invoice-wrapper">

    ${stripedBar(primaryColor)}

    <!-- Header -->
    <div class="header">
      ${data.business.logoUrl
      ? `<img src="${data.business.logoUrl}" class="logo" />`
      : `<div class="logo-placeholder">${escapeHtml(data.business.name.charAt(0))}</div>`
    }
      <div class="business-info">
        <div class="business-name">${escapeHtml(data.business.name)}</div>
        <div class="business-address">${escapeHtml(data.business.address)}</div>
        <div class="business-contact">
          <b>Mobile No.:</b> ${escapeHtml(data.business.mobile)} &nbsp;|&nbsp;
          <b>Email:</b> ${escapeHtml(data.business.email)}
        </div>
      </div>
    </div>

    <!-- Bill To / Invoice Meta -->
    <div class="meta-section">
      <div class="meta-col">
        <div class="meta-label">Bill To</div>
        <div class="meta-name">${escapeHtml(data.customer.name)}</div>
        <div class="meta-line">${escapeHtml(data.customer.address)}</div>
        <div class="meta-line">Mobile No.: ${escapeHtml(data.customer.mobile)}</div>
      </div>
      <div class="meta-col">
        <div id="invoice-no" class="meta-line"><b>Invoice No.:</b> ${escapeHtml(data.invoiceNo)}</div>
        <div class="meta-line"><b>Invoice Date:</b> ${escapeHtml(data.invoiceDate)}</div>
        <div class="meta-line"><b>Due Date:</b> ${escapeHtml(data.dueDate)}</div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th>S.NO.</th>
          <th>ITEMS</th>
          <th class="cell-center">QTY</th>
          <th class="cell-right">RATE</th>
          <th class="cell-right">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
        ${emptyRows}
      </tbody>
    </table>

    <!-- Subtotal -->
    <div class="subtotal-row">
      <div class="label">SUBTOTAL</div>
      <div class="qty">${data.items.reduce((sum, i) => sum + i.qty, 0)}</div>
      <div class="amt">${formatPKR(data.subtotal)}</div>
    </div>

    <!-- Terms & Totals -->
    <div class="bottom-section">
      <div class="terms-col">
        <div class="terms-title">Terms and Condition:</div>
        <ol>${termsHtml}</ol>
      </div>
      <div class="totals-col">
        <div class="totals-row">
          <span class="t-label">DISCOUNT (${data.discountPercent}%)</span>
          <span class="t-value">${formatPKR(data.discountAmount)}</span>
        </div>
        <div class="totals-row total-amount">
          <span class="t-label">TOTAL AMOUNT</span>
          <span class="t-value">${formatPKR(data.totalAmount)}</span>
        </div>
        <div class="totals-row">
          <span class="t-label">Received Amount</span>
          <span class="t-value">${formatPKR(data.receivedAmount)}</span>
        </div>
        <div class="totals-row">
          <span class="t-label">Balance Amount</span>
          <span class="t-value">${formatPKR(data.balanceAmount)}</span>
        </div>
      </div>
    </div>

    <!-- Signature -->
    <div class="signature-section">
      <div class="signature-block">
        ${signatureBlock}
        <div class="signature-line"></div>
        <div class="signature-label">${signatureLabel}</div>
      </div>
    </div>

    <div class="footer-spacer"></div>

    ${stripedBar(primaryColor, true)}

  </div>
</body>
</html>
  `;
}
