/**
 * TEST-ONLY stub for db/sms.js.
 * ------------------------------
 * No SMS provider (Twilio/MSG91/etc.) is wired up yet. This just logs what
 * would have been sent, so verify_payment's SMS call doesn't throw while
 * you're testing checkout. Swap for a real provider call later — the
 * function signature orders.js expects won't need to change.
 */
async function sendOrderConfirmationSms({ phone, trackingId, amount }) {
  console.log(
    `[test sms] Would send SMS to ${phone || '(no phone on file)'}: ` +
    `"Your Mad Sensei order (${trackingId}) for ₹${(amount / 100).toFixed(2)} is confirmed!"`
  );
  return { simulated: true };
}

module.exports = { sendOrderConfirmationSms };