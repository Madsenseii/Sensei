// SERVER-SIDE price list. This — not the cart sent by the browser — decides
// what actually gets charged. Keep ids in sync with PRODUCTS in shop.js.
// Prices here are in rupees; they get converted to paise when creating the
// Razorpay order.
const PRICE_LIST = {
  'tee-noir-premium':  1499,
  'tee-noir-allover':  1599,
  'tee-ivory-blush':   1499,
  'denim-blush-wash':  2499,
  'denim-ivory-wash':  2499
};

function calculateCartTotal(cart){
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => {
    const price = PRICE_LIST[item.productId];
    if (!price) return sum; // unknown product id is ignored, not trusted
    const qty = Math.max(1, Math.min(10, parseInt(item.qty, 10) || 1));
    return sum + price * qty;
  }, 0);
}

module.exports = { PRICE_LIST, calculateCartTotal };