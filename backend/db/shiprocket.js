// db/shiprocket.js — Shiprocket courier integration.
// -----------------------------------------------------------------------
// Handles: authenticating with Shiprocket, creating a shipment for a paid
// order, and assigning a courier + AWB (the real, trackable number a
// customer can actually follow — separate from our own internal
// `tracking_id` like MS-000009).
//
// SETUP:
// 1. Sign up at shiprocket.in, add at least one Pickup Address under
//    Settings > Pickup Addresses — note its exact "Nickname", you'll need
//    it below.
// 2. Add to .env:
//      SHIPROCKET_EMAIL=you@yourdomain.com
//      SHIPROCKET_PASSWORD=your-shiprocket-password
//      SHIPROCKET_PICKUP_LOCATION=Primary   <- exact nickname from step 1
//
// IMPORTANT — parcel weight/dimensions: Shiprocket needs these to quote
// courier rates, but your `orders` table doesn't track per-product weight
// yet. DEFAULT_PARCEL below is a rough placeholder for a folded t-shirt/
// denim piece — tune it (and multiply weight by cart quantity) once you
// know your real packed weights, or courier rate quotes will be off.

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
const DEFAULT_PARCEL = { weightKg: 0.3, lengthCm: 30, breadthCm: 25, heightCm: 5 };

let cachedToken = null;
let cachedTokenAt = 0;
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000; // Shiprocket tokens last 10 days; refresh a day early

async function getToken(){
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) {
    throw new Error('SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD not set in .env');
  }

  const isStale = !cachedToken || (Date.now() - cachedTokenAt) > TOKEN_TTL_MS;
  if (!isStale) return cachedToken;

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error(`Shiprocket login failed: ${JSON.stringify(data)}`);
  }
  cachedToken = data.token;
  cachedTokenAt = Date.now();
  return cachedToken;
}

async function shiprocketRequest(path, { method = 'GET', body } = {}){
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Shiprocket ${method} ${path} failed: ${JSON.stringify(data)}`);
  }
  return data;
}

// Splits a full name into first/last since Shiprocket requires them
// separately — falls back to putting everything in the first name.
function splitName(fullName){
  const parts = (fullName || 'Customer').trim().split(/\s+/);
  return { first: parts[0], last: parts.slice(1).join(' ') || parts[0] };
}

// Creates the Shiprocket order + shipment for a paid order, then assigns
// a courier and generates the real AWB tracking number — the whole
// "mark as shipped" flow in one call.
async function shipOrder(order){
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION;
  if (!pickupLocation) throw new Error('SHIPROCKET_PICKUP_LOCATION not set in .env');

  const addr = order.address || {};
  const { first, last } = splitName(addr.name || order.user_email);
  const cart = Array.isArray(order.cart) ? order.cart : [];
  const totalQty = cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0) || 1;

  const orderPayload = {
    order_id: `MS-${order.id}`,          // your reference id — must be unique per Shiprocket account
    order_date: new Date(order.created_at).toISOString().slice(0, 16).replace('T', ' '),
    pickup_location: pickupLocation,
    channel_id: '',
    billing_customer_name: first,
    billing_last_name: last,
    billing_address: addr.line1 || 'N/A',
    billing_address_2: addr.line2 || '',
    billing_city: addr.city || 'N/A',
    billing_pincode: addr.pincode || '000000',
    billing_state: addr.state || 'N/A',
    billing_country: 'India',
    billing_email: addr.email || order.user_email || 'no-email@example.com',
    billing_phone: (addr.phone || '9999999999').toString().slice(-10),
    shipping_is_billing: true,
    order_items: cart.map(item => ({
      name: item.productId,
      sku: item.productId,
      units: parseInt(item.qty, 10) || 1,
      selling_price: 0 // informational only for Shiprocket; real payment already happened via Razorpay
    })),
    payment_method: 'Prepaid', // always true here — COD isn't wired up in this checkout flow
    sub_total: order.amount / 100,
    length: DEFAULT_PARCEL.lengthCm,
    breadth: DEFAULT_PARCEL.breadthCm,
    height: DEFAULT_PARCEL.heightCm,
    weight: DEFAULT_PARCEL.weightKg * totalQty
  };

  const created = await shiprocketRequest('/orders/create/adhoc', { method: 'POST', body: orderPayload });
  const shipmentId = created.shipment_id;
  const shiprocketOrderId = created.order_id;
  if (!shipmentId) throw new Error(`Shiprocket did not return a shipment_id: ${JSON.stringify(created)}`);

  // Omitting courier_id lets Shiprocket auto-assign its recommended
  // courier for this route — simplest default for a small operation.
  const awbResult = await shiprocketRequest('/courier/assign/awb', {
    method: 'POST',
    body: { shipment_id: shipmentId }
  });

  const awbData = awbResult.response?.data || {};
  return {
    shiprocketOrderId,
    shipmentId,
    awbCode: awbData.awb_code || null,
    courierName: awbData.courier_name || null
  };
}

module.exports = { shipOrder };