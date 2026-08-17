// Sends the order confirmation email (with the PDF invoice attached) via
// Resend (https://resend.com). Free tier: 3,000 emails/month, 100/day —
// plenty for a small store's order confirmations.
//
// Like sms.js, this degrades gracefully: if RESEND_API_KEY isn't set, it
// just logs a warning and returns instead of throwing — a missing email
// integration should never fail or block the payment response.
//
// SETUP:
// 1. npm install resend
// 2. Sign up at resend.com, create an API key.
// 3. Add to .env:
//      RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
//      RESEND_FROM_EMAIL=orders@yourdomain.com
//    IMPORTANT: on Resend's free tier, you can only send FROM an address on
//    a domain you've verified in their dashboard (Domains > Add Domain +
//    the DNS records they give you). Until you verify a domain, you can
//    only send test emails to the address you signed up with — Resend will
//    reject sends to other recipients with a 403 in that case.

const { Resend } = require('resend');

let resendClient = null;
function getClient(){
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

async function sendOrderConfirmationEmail({ to, order, pdfBuffer }){
  const client = getClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!client || !fromEmail) {
    console.warn('Email skipped: RESEND_API_KEY or RESEND_FROM_EMAIL not configured.');
    return { sent: false, reason: 'not_configured' };
  }
  if (!to) {
    console.warn('Email skipped: no email address on this order.');
    return { sent: false, reason: 'no_email' };
  }

  const amountRupees = (order.amount / 100).toFixed(2);

  try {
    const result = await client.emails.send({
      from: `Mad Sensei Studios <${fromEmail}>`,
      to: [to],
      subject: `Order Confirmed — ${order.invoice_number}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#111;max-width:480px;margin:0 auto;">
          <h2 style="margin-bottom:4px;">Mad Sensei Studios</h2>
          <p style="color:#666;margin-top:0;">Payment received — your order is confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
            <tr><td style="padding:4px 0;color:#666;">Invoice #</td><td style="padding:4px 0;text-align:right;">${order.invoice_number}</td></tr>
            <tr><td style="padding:4px 0;color:#666;">Tracking ID</td><td style="padding:4px 0;text-align:right;">${order.tracking_id || '-'}</td></tr>
            <tr><td style="padding:4px 0;color:#666;">Amount Paid</td><td style="padding:4px 0;text-align:right;">Rs. ${amountRupees}</td></tr>
          </table>
          <p style="font-size:13px;color:#666;">Your invoice is attached as a PDF. We'll notify you again once your order ships with real courier tracking details.</p>
          <p style="font-size:12px;color:#999;margin-top:24px;">This is an automated confirmation — no reply needed.</p>
        </div>
      `,
      attachments: [
        {
          filename: `${order.invoice_number}.pdf`,
          content: pdfBuffer.toString('base64')
        }
      ]
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return { sent: false, reason: 'provider_error', detail: result.error };
    }
    return { sent: true, id: result.data && result.data.id };
  } catch (err) {
    console.error('Email send failed:', err);
    return { sent: false, reason: 'network_error' };
  }
}

// Sent once an order actually ships — separate from the payment
// confirmation email. Carries the REAL courier tracking number (AWB),
// not the internal tracking_id.
async function sendShippingUpdateEmail({ to, order, awbCode, courierName }){
  const client = getClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!client || !fromEmail) {
    console.warn('Shipping email skipped: RESEND_API_KEY or RESEND_FROM_EMAIL not configured.');
    return { sent: false, reason: 'not_configured' };
  }
  if (!to) {
    console.warn('Shipping email skipped: no email address on this order.');
    return { sent: false, reason: 'no_email' };
  }

  try {
    const result = await client.emails.send({
      from: `Mad Sensei Studios <${fromEmail}>`,
      to: [to],
      subject: `Your order has shipped — ${order.invoice_number}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#111;max-width:480px;margin:0 auto;">
          <h2 style="margin-bottom:4px;">Mad Sensei Studios</h2>
          <p style="color:#666;margin-top:0;">Your order is on its way!</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
            <tr><td style="padding:4px 0;color:#666;">Courier</td><td style="padding:4px 0;text-align:right;">${courierName || '-'}</td></tr>
            <tr><td style="padding:4px 0;color:#666;">Tracking (AWB) Number</td><td style="padding:4px 0;text-align:right;">${awbCode || '-'}</td></tr>
          </table>
          <p style="font-size:13px;color:#666;">Track this number directly on ${courierName || 'the courier'}'s website, or via Shiprocket's tracking page using the AWB number above.</p>
          <p style="font-size:12px;color:#999;margin-top:24px;">This is an automated update — no reply needed.</p>
        </div>
      `
    });

    if (result.error) {
      console.error('Resend error (shipping email):', result.error);
      return { sent: false, reason: 'provider_error', detail: result.error };
    }
    return { sent: true, id: result.data && result.data.id };
  } catch (err) {
    console.error('Shipping email send failed:', err);
    return { sent: false, reason: 'network_error' };
  }
}

module.exports = { sendOrderConfirmationEmail, sendShippingUpdateEmail };