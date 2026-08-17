/**
 * TEST-ONLY stub for db/invoice.js.
 * ---------------------------------
 * Real invoice generation (PDF, branded, line items, etc.) isn't built yet.
 * This just returns a plain-text placeholder so GET /api/invoice/:orderId
 * doesn't 500 while you're testing checkout — swap this for real PDF
 * generation (e.g. pdfkit) later.
 */
function streamInvoice(res, order) {
  res.setHeader('Content-Type', 'text/plain');
  res.send(
    `MAD SENSEI STUDIOS — Invoice\n` +
    `Invoice #: ${order.invoice_number}\n` +
    `Tracking ID: ${order.tracking_id}\n` +
    `Amount: ₹${(order.amount / 100).toFixed(2)}\n` +
    `Status: ${order.status}\n\n` +
    `(This is a placeholder invoice — real PDF generation not implemented yet.)`
  );
}

module.exports = { streamInvoice };