/* =============================================================================
   MAD SENSEI STUDIOS — SHOP PAGE LOGIC
   =============================================================================
   Sections in this file:
     1. Config
     2. Product data + price formatting
     3. Cart (add/remove/render) — CRUD on the cart itself, client-side only
     4. User account (signup/login/logout/profile/update/delete) — CRUD via
        the Apps Script backend, this is the real, persisted data
     5. Address modal + checkout flow
     6. Payment (Razorpay)

   SET THIS FIRST — your Node backend's base URL:
     local dev:   http://localhost:3000/api
     production:  https://your-deployed-app.onrender.com/api
   ============================================================================= */
// Automatically routes to relative /api when hosted on Vercel or same-origin,
// and falls back to http://localhost:3000/api when served from VS Code Live Server (port 5500) or static file preview.
const BACKEND_URL = (
  typeof window !== 'undefined' &&
  (window.location.protocol === 'file:' ||
   window.location.port === '5500' ||
   window.location.port === '8080' ||
   window.location.port === '5173')
) ? 'http://localhost:3000/api' : '/api';

const CURRENCY_SYMBOL = '₹';

/* =============================================================================
   2. PRODUCT DATA
   Prices shown as "XX" until you set real numbers here. Keep this list in
   sync with PRICE_LIST in Code.gs — the Code.gs copy is the one that
   actually determines what gets charged; this one is just for display.
   ============================================================================= */
const PRODUCTS = [
  { id: 'tee-noir-premium',  name: 'Noir Premium Tee',        image: 'images/products/tee-noir-premium.jpeg',  price: 1499 },
  { id: 'tee-noir-allover',  name: 'Noir All-Over Print Tee', image: 'images/products/tee-noir-allover.jpeg',   price: 1599 },
  { id: 'tee-ivory-blush',   name: 'Ivory Blush Tee',         image: 'images/products/tee-ivory-blush.jpeg',   price: 1499 },
  { id: 'denim-blush-wash',  name: 'Blush Wash Denim',        image: 'images/products/denim-blush-wash.jpeg',   price: 2499 },
  { id: 'denim-ivory-wash',  name: 'Ivory Wash Denim',        image: 'images/products/denim-ivory-wash.jpeg',   price: 2499 }
];

function getProduct(id){ return PRODUCTS.find(p => p.id === id); }

/* Extra display-only info for the quick-view modal (kept separate from
   PRODUCTS since it's not needed for pricing/cart, just presentation). */
const PRODUCT_INFO = {
  'tee-noir-premium': {
    category: 'Oversized Tee',
    desc: '240 GSM oversized tee with drop-shoulder fit and high-quality DTG front/back print.',
    sizeLabel: 'Size',
    sizes: ['S','M','L','XL','XXL'],
    details: [
      '100% premium cotton, 240 GSM',
      'Oversized fit, drop shoulder',
      'High quality DTG print — rich detail, long lasting',
      'Premium woven label + hang tag',
      'Limited edition run'
    ]
  },
  'tee-noir-allover': {
    category: 'Oversized Tee',
    desc: 'Bold graffiti-style front/back graphic with sleeve prints. Streetwear cut, made for layering.',
    sizeLabel: 'Size',
    sizes: ['S','M','L','XL','XXL'],
    details: [
      '100% premium cotton, oversized fit',
      'All-over front & back graphic print',
      'Ribbed crew neckline',
      'Limited edition run'
    ]
  },
  'tee-ivory-blush': {
    category: 'Oversized Tee',
    desc: 'Soft ivory colourway with delicate blush-pink DTG artwork. Fine embroidered accents.',
    sizeLabel: 'Size',
    sizes: ['S','M','L','XL','XXL'],
    details: [
      '100% premium cotton, soft & breathable',
      'Oversized fit, DTG print — soft, vibrant, long lasting',
      'Fine embroidery detailing',
      'Premium woven label',
      'Limited edition run'
    ]
  },
  'denim-blush-wash': {
    category: 'Wide-Leg Denim',
    desc: 'Premium soft-wash denim in a wide-leg, oversized cut. Exclusive leg print + embroidered back pocket.',
    sizeLabel: 'Waist Size',
    sizes: ['28','30','32','34','36'],
    details: [
      'Premium denim, soft & durable',
      'Oversized, wide-leg fit',
      'Exclusive original artwork print — unique to this drop',
      'Embroidered back pocket + premium leather patch',
      'Limited edition — exclusive drop'
    ]
  },
  'denim-ivory-wash': {
    category: 'Wide-Leg Denim',
    desc: 'Ivory wide-leg denim with a playful chibi print, cute embroidery and a premium leather patch.',
    sizeLabel: 'Waist Size',
    sizes: ['28','30','32','34','36'],
    details: [
      'Premium denim, soft & comfortable',
      'Oversized, wide-leg fit',
      'Exclusive original print, made with love',
      'Cute embroidery + premium leather patch',
      'Limited edition run'
    ]
  }
};

/* =============================================================================
   WISHLIST — same localStorage pattern as the cart. Purely client-side.
   ============================================================================= */
const WISHLIST_STORAGE_KEY = 'madsensei_wishlist';
let wishlist = loadWishlist();

function loadWishlist(){
  try{ return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || []; }
  catch(err){ return []; }
}
function saveWishlist(){
  try{ localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist)); }
  catch(err){ console.warn('Could not save wishlist:', err); }
}
function toggleWishlist(){
  const productId = pmState.productId;
  if(!productId) return;
  const idx = wishlist.indexOf(productId);
  const btn = document.getElementById('pm-wishlist-btn');
  if(idx === -1){
    wishlist.push(productId);
    btn.classList.add('active');
    btn.textContent = '♥';
    showToast('Saved to wishlist');
  }else{
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.textContent = '♡';
    showToast('Removed from wishlist');
  }
  saveWishlist();
}
function refreshWishlistButton(productId){
  const btn = document.getElementById('pm-wishlist-btn');
  const saved = wishlist.includes(productId);
  btn.classList.toggle('active', saved);
  btn.textContent = saved ? '♥' : '♡';
}

/* =============================================================================
   IMAGE LIGHTBOX — click the product photo in the quick-view modal to see
   it bigger; click again to zoom in further and scroll/drag to pan.
   ============================================================================= */
function openLightbox(){
  const src = document.getElementById('pm-image').src;
  const lbImg = document.getElementById('lightbox-img');
  lbImg.src = src;
  lbImg.classList.remove('zoomed');
  document.getElementById('image-lightbox').classList.add('open');
}
function closeLightbox(){
  document.getElementById('image-lightbox').classList.remove('open');
  document.getElementById('lightbox-img').classList.remove('zoomed');
}
function toggleZoom(){
  document.getElementById('lightbox-img').classList.toggle('zoomed');
}

/* =============================================================================
   PRODUCT QUICK-VIEW MODAL — Amazon-style "click a product to see its full
   detail view" popup. Reuses the same add-to-cart logic as the grid cards.
   ============================================================================= */
let pmState = { productId: null, size: null, qty: 1 };

function openProductModal(productId){
  const product = getProduct(productId);
  const info = PRODUCT_INFO[productId];
  if(!product || !info) return;

  pmState = { productId, size: null, qty: 1 };

  document.getElementById('pm-image').src = product.image;
  document.getElementById('pm-image').alt = product.name;
  document.getElementById('pm-cat').textContent = info.category;
  document.getElementById('pm-name').textContent = product.name;
  document.getElementById('pm-desc').textContent = info.desc;
  document.getElementById('pm-price').textContent = formatPrice(product.price);
  document.getElementById('pm-size-label').textContent = info.sizeLabel;
  document.getElementById('pm-qty-value').textContent = '1';

  const sizeRow = document.getElementById('pm-size-row');
  sizeRow.innerHTML = '';
  info.sizes.forEach(size => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'size-btn';
    btn.textContent = size;
    btn.addEventListener('click', () => {
      sizeRow.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pmState.size = size;
    });
    sizeRow.appendChild(btn);
  });

  const detailsList = document.getElementById('pm-details-list');
  detailsList.innerHTML = info.details.map(d => `<li>${d}</li>`).join('');

  document.getElementById('product-overlay').classList.add('open');
  refreshWishlistButton(productId);
}

function closeProductModal(){
  document.getElementById('product-overlay').classList.remove('open');
}

function initProductModal(){
  document.getElementById('pm-qty-minus').addEventListener('click', () => {
    pmState.qty = Math.max(1, pmState.qty - 1);
    document.getElementById('pm-qty-value').textContent = pmState.qty;
  });
  document.getElementById('pm-qty-plus').addEventListener('click', () => {
    pmState.qty = Math.min(10, pmState.qty + 1);
    document.getElementById('pm-qty-value').textContent = pmState.qty;
  });
  document.getElementById('pm-add-to-cart').addEventListener('click', () => {
    if(!pmState.size){ showToast('Please select a size first'); return; }
    addToCart(pmState.productId, pmState.size, pmState.qty);
    showToast('Added to cart');
    closeProductModal();
  });
}

function formatPrice(price){
  if(!price || price <= 0) return `${CURRENCY_SYMBOL} XX`;
  return `${CURRENCY_SYMBOL} ${price.toFixed(2).replace(/\.00$/, '')}`;
}

function renderProductPrices(){
  document.querySelectorAll('.product-card').forEach(card => {
    const product = getProduct(card.dataset.productId);
    if(!product) return;
    const priceEl = card.querySelector('[data-price-el]');
    if(priceEl) priceEl.textContent = formatPrice(product.price);
  });
}

/* =============================================================================
   3. CART — kept in localStorage, this part has no server involvement
   ============================================================================= */
const CART_STORAGE_KEY = 'madsensei_cart';
let cart = loadCart();

function loadCart(){
  try{ return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []; }
  catch(err){ return []; }
}
function saveCart(){
  try{ localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); }
  catch(err){ console.warn('Could not save cart:', err); }
}

function initProductCards(){
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = card.dataset.productId;
    const sizeButtons = card.querySelectorAll('[data-size-group] .size-btn');
    const qtyValueEl = card.querySelector('[data-qty-value]');
    const addBtn = card.querySelector('[data-add-to-cart]');
    let selectedSize = null;
    let qty = 1;

    sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
      });
    });

    card.querySelector('[data-qty-minus]').addEventListener('click', () => {
      qty = Math.max(1, qty - 1); qtyValueEl.textContent = qty;
    });
    card.querySelector('[data-qty-plus]').addEventListener('click', () => {
      qty = Math.min(10, qty + 1); qtyValueEl.textContent = qty;
    });

    addBtn.addEventListener('click', () => {
      if(!selectedSize){ showToast('Please select a size first'); return; }
      addToCart(productId, selectedSize, qty);
      showToast('Added to cart');
      qty = 1; qtyValueEl.textContent = qty;
    });
  });
}

function addToCart(productId, size, qty){
  const existing = cart.find(i => i.productId === productId && i.size === size);
  if(existing){ existing.qty += qty; } else { cart.push({ productId, size, qty }); }
  saveCart(); renderCart();
}
function removeFromCart(index){
  cart.splice(index, 1); saveCart(); renderCart();
}

function renderCart(){
  const itemsEl = document.getElementById('cart-items');
  const countBadge = document.getElementById('cart-count-badge');
  const subtotalEl = document.getElementById('cart-subtotal');
  const checkoutBtn = document.getElementById('checkout-btn');

  countBadge.textContent = cart.reduce((s, i) => s + i.qty, 0);

  if(cart.length === 0){
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    subtotalEl.textContent = formatPrice(0);
    checkoutBtn.disabled = true;
    return;
  }
  checkoutBtn.disabled = false;

  let subtotal = 0;
  itemsEl.innerHTML = cart.map((item, index) => {
    const product = getProduct(item.productId);
    if(!product) return '';
    const lineTotal = (product.price || 0) * item.qty;
    subtotal += lineTotal;
    return `
      <div class="cart-line">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-line-info">
          <div class="cart-line-name">${product.name}</div>
          <div class="cart-line-meta">Size: ${item.size} &nbsp;·&nbsp; Qty: ${item.qty}</div>
          <div class="cart-line-price">${formatPrice(lineTotal)}</div>
          <button type="button" class="cart-line-remove" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>`;
  }).join('');
  subtotalEl.textContent = formatPrice(subtotal);
}

function openCart(){ document.getElementById('cart-drawer').classList.add('open'); document.getElementById('cart-overlay').classList.add('open'); }
function closeCart(){ document.getElementById('cart-drawer').classList.remove('open'); document.getElementById('cart-overlay').classList.remove('open'); }

let toastTimer = null;
function showToast(message){
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}





/* =============================================================================
   4. USER ACCOUNT — Create (signup), Read (login/profile), Update, Delete
   All against the Apps Script backend. `currentUser` mirrors what's on the
   server; we also cache it in localStorage purely so the UI can show
   "logged in" instantly on page load without waiting on a network call.

   NOTE ON SECURITY: storing the logged-in email in localStorage is a simple
   "remember me" convenience, NOT a secure session token. There's no
   expiry, and anyone with access to this browser profile is "logged in"
   as this user. That's an acceptable tradeoff for a small store's saved
   address feature — it is not meant to protect sensitive data.
   ============================================================================= */
const USER_STORAGE_KEY = 'madsensei_user';
let currentUser = loadUser();

function loadUser(){
  try{ return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || null; }
  catch(err){ return null; }
}
function saveUser(user){
  currentUser = user;
  if(user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_STORAGE_KEY);
  renderAccountUI();
}

async function apiCall(action, payload = {}){
  const res = await fetch(`${BACKEND_URL}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {}

  if(!res.ok){
    const msg = (data && data.message) ? data.message : `Backend error (${res.status})`;
    throw new Error(msg);
  }

  return data || {};
}

// ---- CREATE ----
async function handleSignup(){
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const errorEl = document.getElementById('signup-error');
  errorEl.textContent = '';

  if(!email || !password){ errorEl.textContent = 'Email and password are required.'; return; }

  const res = await apiCall('signup', { name, email, password });
  if(res.result !== 'success'){ errorEl.textContent = res.message; return; }

  saveUser(res.user);
  closeAuthModal();
  showToast(`Welcome, ${res.user.name || res.user.email}`);
}

// ---- READ (login) ----
async function handleLogin(){
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  const res = await apiCall('login', { email, password });
  if(res.result !== 'success'){ errorEl.textContent = res.message; return; }

  saveUser(res.user);
  closeAuthModal();
  showToast(`Welcome back, ${res.user.name || res.user.email}`);
}

// ---- UPDATE (called after a successful order, to save the address used) ----
async function updateUserAddress(addressData){
  if(!currentUser) return; // only saves for logged-in users
  await apiCall('update_profile', {
    email: currentUser.email,
    name: addressData.name,
    phone: addressData.phone,
    address: addressData
  });
  currentUser.address = addressData;
  currentUser.name = addressData.name;
  currentUser.phone = addressData.phone;
  saveUser(currentUser);
}

// ---- DELETE ----
async function handleDeleteAccount(){
  if(!currentUser) return;
  if(!confirm('This will permanently delete your account. Continue?')) return;

  const res = await apiCall('delete_account', { email: currentUser.email });
  if(res.result === 'success'){
    saveUser(null);
    closeAuthModal();
    showToast('Account deleted');
  }else{
    alert(res.message);
  }
}

function handleLogout(){
  saveUser(null);
  closeAuthModal();
  showToast('Logged out');
}

/* ---- Account UI wiring ---- */
function renderAccountUI(){
  const btn = document.getElementById('account-toggle-btn');
  const guestView = document.getElementById('auth-guest-view');
  const accountView = document.getElementById('auth-account-view');

  if(currentUser){
    btn.textContent = currentUser.name ? `Hi, ${currentUser.name.split(' ')[0]}` : 'Account';
    guestView.style.display = 'none';
    accountView.style.display = 'block';
    document.getElementById('account-name-display').textContent = currentUser.name || '—';
    document.getElementById('account-email-display').textContent = currentUser.email || '—';
    document.getElementById('account-phone-display').textContent = currentUser.phone || '—';
    const addr = currentUser.address;
    document.getElementById('account-address-display').textContent =
      addr && addr.line1 ? `${addr.line1}, ${addr.city}` : 'Not saved yet';
  }else{
    btn.textContent = 'Login';
    guestView.style.display = 'block';
    accountView.style.display = 'none';
  }
}

function openAuthModal(){
  document.getElementById('auth-overlay').classList.add('open');
}
function closeAuthModal(){
  document.getElementById('auth-overlay').classList.remove('open');
}
function switchAuthTab(tab){
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.authTab === tab));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.toggle('active', p.dataset.authPanel === tab));
}

/* =============================================================================
   5. ADDRESS MODAL + CHECKOUT FLOW
   Clicking "Proceed to Checkout" in the cart always opens the address form
   first (pre-filled if the user is logged in and has a saved address).
   Works identically for guests — address is just attached to the order,
   not saved anywhere unless they're logged in.
   ============================================================================= */
function openAddressModal(){
  if(currentUser){
    document.getElementById('addr-name').value  = currentUser.name || '';
    document.getElementById('addr-email').value = currentUser.email || '';
    document.getElementById('addr-phone').value = currentUser.phone || '';
    const a = currentUser.address || {};
    document.getElementById('addr-line1').value   = a.line1 || '';
    document.getElementById('addr-line2').value   = a.line2 || '';
    document.getElementById('addr-city').value    = a.city || '';
    document.getElementById('addr-state').value   = a.state || '';
    document.getElementById('addr-pincode').value = a.pincode || '';
  }
  document.getElementById('address-overlay').classList.add('open');
}
function closeAddressModal(){
  document.getElementById('address-overlay').classList.remove('open');
}

// Uses browser geolocation + OpenStreetMap's free reverse-geocoding API
// (no API key needed) to prefill city/state/pincode. Never blocks checkout
// if it fails or is denied — it's just a convenience.
function useMyLocation(){
  const statusEl = document.getElementById('location-status');
  if(!navigator.geolocation){
    statusEl.textContent = 'Location is not supported in this browser.';
    return;
  }

  statusEl.textContent = 'Detecting your location…';
  navigator.geolocation.getCurrentPosition(async (position) => {
    try{
      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();
      const a = data.address || {};

      document.getElementById('addr-city').value = a.city || a.town || a.village || a.suburb || '';
      document.getElementById('addr-state').value = a.state || '';
      document.getElementById('addr-pincode').value = a.postcode || '';
      if(!document.getElementById('addr-line1').value){
        document.getElementById('addr-line1').value = [a.road, a.neighbourhood].filter(Boolean).join(', ');
      }

      statusEl.textContent = 'Location detected — please double check before continuing.';
    }catch(err){
      console.error(err);
      statusEl.textContent = 'Could not detect address from location. Please fill in manually.';
    }
  }, (err) => {
    console.warn(err);
    statusEl.textContent = 'Location access denied or unavailable. Please fill in manually.';
  });
}

/* =============================================================================
   PAYMENT RESULT MODAL — replaces plain alert() popups
   ============================================================================= */
function showPaymentResult({ success, title, message, invoiceUrl }){
  document.getElementById('payment-result-icon').textContent = success ? '✅' : '❌';
  document.getElementById('payment-result-title').textContent = title;
  document.getElementById('payment-result-message').textContent = message;

  const invoiceLink = document.getElementById('payment-invoice-link');
  if(success && invoiceUrl){
    // BACKEND_URL already ends in "/api", and invoiceUrl starts with "/api/...",
    // so strip BACKEND_URL's trailing "/api" before joining.
    const origin = BACKEND_URL.replace(/\/api\/?$/, '');
    invoiceLink.href = `${origin}${invoiceUrl}`;
    invoiceLink.style.display = 'inline-block';
  }else{
    invoiceLink.style.display = 'none';
  }

  document.getElementById('payment-result-overlay').classList.add('open');
}
function closePaymentResultModal(){
  document.getElementById('payment-result-overlay').classList.remove('open');
}

// This is what the cart drawer's "Proceed to Checkout" button calls.
function goToCheckout(){
  if(cart.length === 0) return;
  closeCart();
  openAddressModal();
}

// Called by the address form's "Continue to Payment" button.
async function submitAddressAndPay(){
  const address = {
    name: document.getElementById('addr-name').value.trim(),
    email: document.getElementById('addr-email').value.trim(),
    phone: document.getElementById('addr-phone').value.trim(),
    line1: document.getElementById('addr-line1').value.trim(),
    line2: document.getElementById('addr-line2').value.trim(),
    city: document.getElementById('addr-city').value.trim(),
    state: document.getElementById('addr-state').value.trim(),
    pincode: document.getElementById('addr-pincode').value.trim()
  };
  const errorEl = document.getElementById('address-error');
  errorEl.textContent = '';

  if(!address.name || !address.email || !address.phone || !address.line1 || !address.city || !address.pincode){
    errorEl.textContent = 'Please fill in all required fields.';
    return;
  }

  if(currentUser) await updateUserAddress(address);

  closeAddressModal();
  startPayment(address);
}

/* =============================================================================
   6. PAYMENT — Razorpay
   See the large comment in Code.gs for how order creation + verification
   works server-side. This function just drives the popup.
   ============================================================================= */
async function startPayment(address){
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.disabled = true;

  try{
    const order = await apiCall('create_order', { cart, address, email: address.email });
    if(order.result !== 'success'){ alert(order.message || 'Could not start checkout.'); return; }

    const rzp = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: 'INR',
      name: 'Mad Sensei Studios',
      prefill: { name: address.name, email: address.email, contact: address.phone },
      theme: { color: '#c8a84b' },

      handler: async function(response){
        const verify = await apiCall('verify_payment', {
          cart, amount: order.amount,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });

        if(verify.result === 'success'){
          cart = []; saveCart(); renderCart();
          showPaymentResult({
            success: true,
            title: 'Payment Successful',
            message: `Order placed. Tracking ID: ${verify.trackingId || '—'} · Invoice: ${verify.invoiceNumber || '—'}. A confirmation SMS has been sent to your phone.`,
            invoiceUrl: verify.invoiceUrl
          });
        }else{
          showPaymentResult({
            success: false,
            title: 'Payment Verification Failed',
            message: 'We could not verify your payment. Please contact support before retrying — do not pay again.'
          });
        }
      },

      modal: { ondismiss: function(){ checkoutBtn.disabled = false; } }
    });

    rzp.on('payment.failed', function(response){
      showPaymentResult({
        success: false,
        title: 'Payment Failed',
        message: response.error && response.error.description
          ? response.error.description
          : 'Your payment could not be completed. Please try again.'
      });
    });

    rzp.open();
  }catch(err){
    console.error('Payment checkout error:', err);
    showPaymentResult({
      success: false,
      title: 'Checkout Error',
      message: err.message || 'Something went wrong starting checkout. Please try again.'
    });
  }finally{
    checkoutBtn.disabled = false;
  }
}

/* =============================================================================
   INIT
   ============================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  renderProductPrices();
  initProductCards();
  initProductModal();
  renderCart();
  renderAccountUI();
});