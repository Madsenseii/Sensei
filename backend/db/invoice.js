const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { PRICE_LIST } = require('./priceList');

function getLogoPath() {
  const candidates = [
    path.join(__dirname, 'assets', 'logo.png'),
    path.join(__dirname, '..', '..', 'public', 'images', 'logo.png'),
    path.join(process.cwd(), 'public', 'images', 'logo.png')
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {}
  }
  return null;
}

// EDIT THIS with your real registered business details — shown on every
// invoice's "Sold By" block. Leave any line blank ('') to omit it.
const COMPANY = {
  name: 'Mad Sensei Studios',
  line1: '[Your business address line 1]',
  line2: '[City, State, PIN]',
  country: 'IN',
  pan: '',   // e.g. 'AACFV3325K'
  gstin: ''  // e.g. '29AACFV3325K1ZY'
};

const PAGE_LEFT = 40;
const PAGE_RIGHT = 555;
const PAGE_WIDTH = PAGE_RIGHT - PAGE_LEFT;

// ---- helpers ----

// Converts a rupee amount (integer) into words, Indian numbering style.
function numberToWordsIndian(num){
  if (num === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function twoDigits(n){
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  }
  function threeDigits(n){
    if (n >= 100) {
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : '');
    }
    return twoDigits(n);
  }

  let n = Math.floor(num);
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = n;

  const parts = [];
  if (crore) parts.push(threeDigits(crore) + ' Crore');
  if (lakh) parts.push(threeDigits(lakh) + ' Lakh');
  if (thousand) parts.push(threeDigits(thousand) + ' Thousand');
  if (hundred) parts.push(threeDigits(hundred));

  return parts.join(' ') || 'Zero';
}

function amountInWords(rupees){
  const whole = Math.floor(rupees);
  const paise = Math.round((rupees - whole) * 100);
  let words = numberToWordsIndian(whole) + ' Rupees';
  if (paise > 0) words += ' and ' + numberToWordsIndian(paise) + ' Paise';
  return words + ' only';
}

function labelValue(doc, x, y, label, value, width){
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#555').text(label, x, y, { width });
  doc.font('Helvetica').fontSize(9.5).fillColor('#000').text(value || '-', x, doc.y, { width });
}

// Builds the actual PDF content onto a given PDFDocument. Shared by both
// streamInvoice (HTTP download) and buildInvoiceBuffer (email attachment)
// so the two never drift out of sync.
function drawInvoice(doc, order){
  const cart = Array.isArray(order.cart) ? order.cart : [];
  const addr = order.address || {};

  // ---- Header: logo left, invoice title right ----
  const headerTop = doc.y;
  const logoPath = getLogoPath();
  if (logoPath) {
    try {
      doc.image(logoPath, PAGE_LEFT, headerTop, { width: 90 });
    } catch (err) {
      doc.font('Helvetica-Bold').fontSize(18).fillColor('#000')
        .text(COMPANY.name, PAGE_LEFT, headerTop, { width: 250 });
    }
  } else {
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#000')
      .text(COMPANY.name, PAGE_LEFT, headerTop, { width: 250 });
  }

  doc.font('Helvetica-Bold').fontSize(12).fillColor('#000')
    .text('Tax Invoice/Bill of Supply/Cash Memo', PAGE_LEFT, headerTop, { width: PAGE_WIDTH, align: 'right' });
  doc.font('Helvetica').fontSize(8.5).fillColor('#666')
    .text('(Original for Recipient)', PAGE_LEFT, doc.y, { width: PAGE_WIDTH, align: 'right' });

  doc.y = Math.max(doc.y, headerTop + 55);
  doc.moveDown(0.8);
  doc.moveTo(PAGE_LEFT, doc.y).lineTo(PAGE_RIGHT, doc.y).strokeColor('#ccc').stroke();
  doc.moveDown(0.8);

  // ---- Sold By / Billing / Shipping (three columns) ----
  const colTop = doc.y;
  const colWidth = PAGE_WIDTH / 2 - 10;

  // Sold By (left column)
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#000').text('Sold By:', PAGE_LEFT, colTop, { width: colWidth });
  doc.font('Helvetica-Bold').fontSize(9.5).text(COMPANY.name, PAGE_LEFT, doc.y, { width: colWidth });
  doc.font('Helvetica').fontSize(9);
  if (COMPANY.line1) doc.text(COMPANY.line1, PAGE_LEFT, doc.y, { width: colWidth });
  if (COMPANY.line2) doc.text(COMPANY.line2, PAGE_LEFT, doc.y, { width: colWidth });
  if (COMPANY.country) doc.text(COMPANY.country, PAGE_LEFT, doc.y, { width: colWidth });
  doc.moveDown(0.4);
  if (COMPANY.pan) doc.font('Helvetica-Bold').text(`PAN No: ${COMPANY.pan}`, PAGE_LEFT, doc.y, { width: colWidth });
  if (COMPANY.gstin) doc.font('Helvetica-Bold').text(`GST Registration No: ${COMPANY.gstin}`, PAGE_LEFT, doc.y, { width: colWidth });

  const leftColBottom = doc.y;

  // Billing Address (right column, top half)
  const rightX = PAGE_LEFT + colWidth + 20;
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#000').text('Billing Address:', rightX, colTop, { width: colWidth });
  doc.font('Helvetica').fontSize(9);
  doc.text(addr.name || order.user_email || 'Guest', rightX, doc.y, { width: colWidth });
  if (addr.line1) doc.text(addr.line1, rightX, doc.y, { width: colWidth });
  if (addr.line2) doc.text(addr.line2, rightX, doc.y, { width: colWidth });
  if (addr.city || addr.state || addr.pincode) {
    doc.text([addr.city, addr.state, addr.pincode].filter(Boolean).join(', '), rightX, doc.y, { width: colWidth });
  }
  if (addr.phone) doc.text(`Phone: ${addr.phone}`, rightX, doc.y, { width: colWidth });

  const billingBottom = doc.y;
  doc.moveDown(0.5);

  // Shipping Address (right column, below billing)
  const shipTop = doc.y;
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#000').text('Shipping Address:', rightX, shipTop, { width: colWidth });
  doc.font('Helvetica').fontSize(9);
  doc.text(addr.name || order.user_email || 'Guest', rightX, doc.y, { width: colWidth });
  if (addr.line1) doc.text(addr.line1, rightX, doc.y, { width: colWidth });
  if (addr.line2) doc.text(addr.line2, rightX, doc.y, { width: colWidth });
  if (addr.city || addr.state || addr.pincode) {
    doc.text([addr.city, addr.state, addr.pincode].filter(Boolean).join(', '), rightX, doc.y, { width: colWidth });
  }
  if (addr.email || order.user_email) doc.text(`Email: ${addr.email || order.user_email}`, rightX, doc.y, { width: colWidth });

  const rightColBottom = doc.y;
  doc.y = Math.max(leftColBottom, rightColBottom) + 12;

  doc.moveTo(PAGE_LEFT, doc.y).lineTo(PAGE_RIGHT, doc.y).strokeColor('#ccc').stroke();
  doc.moveDown(0.8);

  // ---- Order / Invoice details row ----
  const detailsTop = doc.y;
  const detailColWidth = colWidth;
  labelValue(doc, PAGE_LEFT, detailsTop, 'Order Number:', order.id ? String(order.id) : '-', detailColWidth);
  const orderDateY = doc.y + 4;
  labelValue(doc, PAGE_LEFT, orderDateY, 'Order Date:',
    order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : '-', detailColWidth);

  labelValue(doc, rightX, detailsTop, 'Invoice Number:', order.invoice_number, detailColWidth);
  const invDetailsY = doc.y + 4;
  labelValue(doc, rightX, invDetailsY, 'Tracking ID:', order.tracking_id, detailColWidth);
  const invDateY = doc.y + 4;
  labelValue(doc, rightX, invDateY, 'Invoice Date:',
    order.paid_at ? new Date(order.paid_at).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
    detailColWidth);

  doc.y = Math.max(doc.y, orderDateY + 30) + 8;
  doc.moveTo(PAGE_LEFT, doc.y).lineTo(PAGE_RIGHT, doc.y).strokeColor('#ccc').stroke();
  doc.moveDown(0.8);

  // ---- Item table ----
  const colSl = PAGE_LEFT;
  const colDesc = PAGE_LEFT + 25;
  const colUnitPrice = 300;
  const colQty = 355;
  const colTotal = 400;
  const colTotalWidth = PAGE_RIGHT - colTotal;

  function drawTableHeader(){
    const y = doc.y;
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#333');
    doc.text('Sl.\nNo', colSl, y, { width: 22 });
    doc.text('Description', colDesc, y, { width: colUnitPrice - colDesc - 8 });
    doc.text('Unit\nPrice', colUnitPrice, y, { width: colQty - colUnitPrice - 8, align: 'right' });
    doc.text('Qty', colQty, y, { width: colTotal - colQty - 8, align: 'right' });
    doc.text('Total\nAmount', colTotal, y, { width: colTotalWidth, align: 'right' });
    doc.moveDown(1.4);
    doc.moveTo(PAGE_LEFT, doc.y).lineTo(PAGE_RIGHT, doc.y).strokeColor('#999').stroke();
    doc.moveDown(0.4);
  }

  drawTableHeader();

  doc.font('Helvetica').fontSize(9).fillColor('#000');
  let runningTotal = 0;

  cart.forEach((item, idx) => {
    const unitPrice = PRICE_LIST[item.productId] || 0;
    const qty = item.qty || 0;
    const lineTotal = unitPrice * qty;
    runningTotal += lineTotal;

    const rowTop = doc.y;
    const descText = item.size ? `${item.productId} (Size: ${item.size})` : item.productId;

    doc.text(String(idx + 1), colSl, rowTop, { width: 22 });
    doc.text(descText, colDesc, rowTop, { width: colUnitPrice - colDesc - 8 });
    const descBottom = doc.y;

    doc.text(`Rs. ${unitPrice.toFixed(2)}`, colUnitPrice, rowTop, { width: colQty - colUnitPrice - 8, align: 'right' });
    doc.text(String(qty), colQty, rowTop, { width: colTotal - colQty - 8, align: 'right' });
    doc.text(`Rs. ${lineTotal.toFixed(2)}`, colTotal, rowTop, { width: colTotalWidth, align: 'right' });

    doc.y = Math.max(descBottom, doc.y);
    doc.moveDown(0.5);

    // Page-break safety for long carts
    if (doc.y > 700) {
      doc.addPage();
      drawTableHeader();
    }
  });

  doc.moveTo(PAGE_LEFT, doc.y).lineTo(PAGE_RIGHT, doc.y).strokeColor('#999').stroke();
  doc.moveDown(0.6);

  // ---- Total ----
  const totalRupees = order.amount / 100;
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#000')
    .text(`TOTAL: Rs. ${totalRupees.toFixed(2)}`, PAGE_LEFT, doc.y, { width: PAGE_WIDTH, align: 'right' });
  doc.moveDown(0.6);

  doc.font('Helvetica-Bold').fontSize(9).text('Amount in Words:', PAGE_LEFT, doc.y, { continued: false });
  doc.font('Helvetica').fontSize(9).text(amountInWords(totalRupees), PAGE_LEFT, doc.y, { width: PAGE_WIDTH });
  doc.moveDown(1.2);

  // ---- Payment / status line ----
  doc.font('Helvetica').fontSize(9).fillColor('#555');
  doc.text(`Payment Method: ${(order.payment_method || '-').toUpperCase()}    |    Order Status: ${order.status.toUpperCase()}`,
    PAGE_LEFT, doc.y, { width: PAGE_WIDTH });
  doc.moveDown(2);

  // ---- Signatory box (bottom right) ----
  const sigY = doc.y;
  doc.font('Helvetica').fontSize(9).fillColor('#000')
    .text(`For ${COMPANY.name}:`, PAGE_LEFT, sigY, { width: PAGE_WIDTH, align: 'right' });
  doc.moveDown(2);
  doc.font('Helvetica').fontSize(9)
    .text('Authorized Signatory', PAGE_LEFT, doc.y, { width: PAGE_WIDTH, align: 'right' });

  doc.moveDown(2);
  doc.font('Helvetica').fontSize(8).fillColor('#999').text(
    'This is a computer-generated invoice and does not require a signature.',
    PAGE_LEFT, doc.y, { width: PAGE_WIDTH, align: 'center' }
  );
}

// Streams a PDF invoice straight into an HTTP response. Called from the
// invoice route in routes/orders.js (the "Download Invoice" button).
function streamInvoice(res, order){
  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${order.invoice_number}.pdf"`);
  doc.pipe(res);
  drawInvoice(doc, order);
  doc.end();
}

// Builds the same PDF as an in-memory Buffer instead of streaming it to an
// HTTP response — used to attach the invoice to the confirmation email.
function buildInvoiceBuffer(order){
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      drawInvoice(doc, order);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { streamInvoice, buildInvoiceBuffer };