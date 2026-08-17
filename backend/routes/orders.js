const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const pool = require('../db/pool');
const { calculateCartTotal } = require('../db/priceList');
const { streamInvoice, buildInvoiceBuffer } = require('../db/invoice');
const { sendOrderConfirmationSms } = require('../db/sms');
const { sendOrderConfirmationEmail, sendShippingUpdateEmail } = require('../db/mailer');
const { shipOrder } = require('../db/shiprocket');

// Simple shared-secret check for the one admin-only route below. Not a full
// auth system — fine for a solo operator, but treat ADMIN_SECRET like a
// password: long, random, never committed, never shared.
function requireAdmin(req, res, next){
  const provided = req.get('x-admin-secret') || '';
  const expected = process.env.ADMIN_SECRET || '';
  const isValid =
    expected.length > 0 &&
    provided.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  if (!isValid) {
    return res.status(401).json({ result: 'error', message: 'Unauthorized.' });
  }
  next();
}

const router = express.Router();

let razorpayClient = null;
function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpayClient;
}

// ---- CREATE ORDER ----
// Price is calculated here, from PRICE_LIST, never trusted from the client.
router.post('/create_order', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys missing in environment.');
      return res.status(500).json({
        result: 'error',
        message: 'Payment gateway is not configured on the server. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      });
    }

    const { cart, address, email } = req.body;

    const totalRupees = calculateCartTotal(cart);
    if (totalRupees <= 0) {
      return res.json({ result: 'error', message: 'Your cart is empty or invalid.' });
    }
    const amountPaise = Math.round(totalRupees * 100);

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(500).json({
        result: 'error',
        message: 'Payment gateway client could not be initialized. Please check API keys.'
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`
    });

    await pool.query(
      `INSERT INTO orders (user_email, cart, amount, status, razorpay_order_id, address)
       VALUES ($1, $2, $3, 'created', $4, $5)`,
      [email || null, JSON.stringify(cart), amountPaise, razorpayOrder.id, JSON.stringify(address || null)]
    );

    res.json({
      result: 'success',
      orderId: razorpayOrder.id,
      amount: amountPaise,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('create_order error:', err);
    res.json({ result: 'error', message: 'Could not start checkout. Please try again.' });
  }
});

// ---- VERIFY PAYMENT ----
// Signature check is the whole point of this route — never mark an order
// paid just because the client said so.
router.post('/verify_payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ result: 'error', message: 'Missing payment verification parameters.' });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not configured.');
      return res.status(500).json({ result: 'error', message: 'Payment gateway secret not configured.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid =
      typeof razorpay_signature === 'string' &&
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

    if (!isValid) {
      await pool.query(
        `UPDATE orders SET status = 'failed', razorpay_payment_id = $2 WHERE razorpay_order_id = $1`,
        [razorpay_order_id, razorpay_payment_id]
      );
      return res.json({ result: 'error', message: 'Payment verification failed.' });
    }

    // invoice number + tracking ID: both derived from the order id so
    // they're stable and easy to look up later.
    // Fetch the payment method (upi/card/netbanking/wallet) from Razorpay —
    // it's not something the client can be trusted to report.
    let paymentMethod = null;
    const razorpay = getRazorpayClient();
    if (razorpay) {
      try {
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        paymentMethod = paymentDetails.method || null;
      } catch (fetchErr) {
        console.warn('Could not fetch payment method:', fetchErr.message);
      }
    }

    const orderRow = await pool.query(
      `UPDATE orders SET
         status = 'paid',
         razorpay_payment_id = $2,
         invoice_number = 'INV-' || id || '-' || to_char(now(), 'YYMMDD'),
         tracking_id = 'MS-' || LPAD(id::text, 6, '0'),
         payment_method = $3,
         paid_at = now()
       WHERE razorpay_order_id = $1
       RETURNING id, invoice_number, tracking_id, address, amount, cart, status,
                 payment_method, created_at, user_email`,
      [razorpay_order_id, razorpay_payment_id, paymentMethod]
    );

    const orderInfo = orderRow.rows[0];
    const invoiceNumber = orderInfo?.invoice_number;
    const trackingId = orderInfo?.tracking_id;
    const orderId = orderInfo?.id;

    // Fire-and-log the confirmation SMS — never let this block or fail the
    // payment response itself, the payment already succeeded regardless.
    if (orderInfo) {
      const phone = orderInfo.address?.phone;
      sendOrderConfirmationSms({
        phone,
        trackingId,
        amount: orderInfo.amount
      }).catch(err => console.error('SMS dispatch error:', err));

      // Same fire-and-forget approach for the confirmation email — build
      // the PDF once and attach it, but never let a failure here affect
      // the payment response the customer already received.
      const emailTo = orderInfo.address?.email || orderInfo.user_email;
      buildInvoiceBuffer(orderInfo)
        .then(pdfBuffer => sendOrderConfirmationEmail({ to: emailTo, order: orderInfo, pdfBuffer }))
        .catch(err => console.error('Email dispatch error:', err));
    }

    res.json({
      result: 'success',
      message: 'Payment verified.',
      invoiceNumber,
      trackingId,
      invoiceUrl: `/api/invoice/${orderId}`
    });
  } catch (err) {
    console.error('verify_payment error:', err);
    res.json({ result: 'error', message: 'Something went wrong verifying payment.' });
  }
});

// ---- GET INVOICE ----
router.get('/invoice/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ result: 'error', message: 'Order not found.' });
    }
    const order = result.rows[0];
    if (order.status !== 'paid' || !order.invoice_number) {
      return res.status(400).json({ result: 'error', message: 'Invoice not available for this order.' });
    }

    streamInvoice(res, order);
  } catch (err) {
    console.error('invoice error:', err);
    res.status(500).json({ result: 'error', message: 'Could not generate invoice.' });
  }
});

// ---- ADMIN: MARK AS SHIPPED (books the real courier shipment) ----
// Call this once you've packed the order and are ready to dispatch it.
// Protected by ADMIN_SECRET — send it as the 'x-admin-secret' header.
router.post('/admin/orders/:orderId/ship', requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ result: 'error', message: 'Order not found.' });
    }
    const order = result.rows[0];
    if (order.status !== 'paid') {
      return res.status(400).json({ result: 'error', message: `Order status is '${order.status}', expected 'paid'.` });
    }

    const shipment = await shipOrder(order);

    const updated = await pool.query(
      `UPDATE orders SET
         status = 'shipped',
         shiprocket_order_id = $2,
         shiprocket_shipment_id = $3,
         awb_code = $4,
         courier_name = $5,
         shipped_at = now()
       WHERE id = $1
       RETURNING *`,
      [orderId, shipment.shiprocketOrderId, shipment.shipmentId, shipment.awbCode, shipment.courierName]
    );

    const updatedOrder = updated.rows[0];
    const emailTo = updatedOrder.address?.email || updatedOrder.user_email;

    sendShippingUpdateEmail({
      to: emailTo,
      order: updatedOrder,
      awbCode: shipment.awbCode,
      courierName: shipment.courierName
    }).catch(err => console.error('Shipping email dispatch error:', err));

    res.json({
      result: 'success',
      message: 'Order shipped.',
      awbCode: shipment.awbCode,
      courierName: shipment.courierName
    });
  } catch (err) {
    console.error('ship order error:', err);
    res.status(500).json({ result: 'error', message: err.message || 'Could not ship order.' });
  }
});

module.exports = router;