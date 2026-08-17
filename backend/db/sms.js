// Sends a transactional SMS via MSG91 after a payment is verified.
// IMPORTANT (India-specific): transactional SMS requires DLT registration
// of your sender ID and message template with your telecom operator before
// MSG91 will actually deliver anything — this is a government compliance
// requirement, not an MSG91 quirk. Until that's approved, this call will
// fail silently (caught) and just get logged.
//
// MSG91_TEMPLATE_ID must match a DLT-approved template whose placeholders
// (##var1##, ##var2## etc.) line up with the "variables" object below —
// adjust the keys to match whatever your approved template actually uses.

async function sendOrderConfirmationSms({ phone, trackingId, amount }){
  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SENDER_ID;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !senderId || !templateId) {
    console.warn('SMS skipped: MSG91 env vars not configured.');
    return { sent: false, reason: 'not_configured' };
  }
  if (!phone) {
    console.warn('SMS skipped: no phone number on this order.');
    return { sent: false, reason: 'no_phone' };
  }

  // MSG91 expects a country-code-prefixed number, no "+", e.g. 91XXXXXXXXXX
  const digits = phone.replace(/\D/g, '');
  const mobile = digits.length === 10 ? `91${digits}` : digits;

  try {
    const res = await fetch('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': authKey
      },
      body: JSON.stringify({
        template_id: templateId,
        sender: senderId,
        recipients: [
          {
            mobiles: mobile,
            // Keys here must match your DLT-approved template's variables.
            tracking_id: trackingId,
            amount: `Rs. ${(amount / 100).toFixed(2)}`
          }
        ]
      })
    });

    const data = await res.json();
    if (res.ok && data.type !== 'error') {
      return { sent: true, response: data };
    }
    console.error('MSG91 error:', data);
    return { sent: false, reason: 'provider_error', detail: data };
  } catch (err) {
    console.error('SMS send failed:', err);
    return { sent: false, reason: 'network_error' };
  }
}

module.exports = { sendOrderConfirmationSms };
