# Mad Sensei Studios — Node backend

Replaces the old Google Apps Script backend. Handles auth (signup/login/
profile/delete) and Razorpay payments (create order + verify signature),
backed by Postgres (Supabase).

---

## File structure

```
backend/
├── db/
│   ├── pool.js          — Postgres connection (via Supabase, using pg)
│   ├── priceList.js      — SERVER-SIDE source of truth for what gets charged
│   ├── invoice.js         — streams a PDF invoice on the fly (pdfkit)
│   ├── sms.js             — sends payment-confirmation SMS via MSG91
│   └── schema.sql         — run this once in Supabase's SQL Editor
├── routes/
│   ├── auth.js             — signup / login / update_profile / delete_account
│   └── orders.js           — create_order / verify_payment / invoice
├── .env                     — real secrets, NEVER commit (already gitignored)
├── .gitignore
├── package.json
├── README.md                 — this file
└── server.js                 — Express app entry point, mounts the routes above
```

If you ever see files named `*.TEST-ONLY.js` or `*.TEST-STUB.js` sitting
alongside the real ones, they're leftover in-memory stand-ins used to test
the Razorpay flow before a real database was connected. Safe to delete once
the real `pool.js`, `invoice.js`, and `sms.js` are working — don't `require()`
them from anywhere.

---

## Setup

### 1. Database (Supabase)

1. Create a Supabase project at supabase.com.
2. Open **SQL Editor** → paste the entire contents of `db/schema.sql` → **Run**.
   This creates the `orders` table with every column `orders.js` needs
   (`user_email`, `cart`, `address`, `amount`, `status`, `razorpay_order_id`,
   `razorpay_payment_id`, `payment_method`, `invoice_number`, `tracking_id`,
   `paid_at`, `created_at`).
3. Get your connection string: click **Connect** near the top of the
   dashboard → look for the **Connection string** section (not "App
   Frameworks" — that gives you a different kind of key for their JS SDK,
   not what this backend uses).
4. **Use the "Session pooler" connection string, not "Direct connection".**
   The direct connection (`db.<ref>.supabase.co:5432`) frequently fails to
   resolve at all (`ENOTFOUND`) depending on your network's IPv6 support.
   The pooler string looks like:
   ```
   postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
   Note the username format — it's `postgres.<project-ref>`, not just
   `postgres`, when using the pooler.
5. Paste that full string into `DATABASE_URL` in your `.env`, with your
   real password substituted in for `[YOUR-PASSWORD]`.

### 2. Razorpay

1. dashboard.razorpay.com → confirm the toggle near the top says **Test
   Mode** (not Live) while developing.
2. Settings → API Keys → copy your **Key ID** and **Key Secret**.
   Razorpay only shows the Key Secret once, at generation time — save it
   somewhere safe immediately.
3. If checkout ever fails with `401 Authentication failed` even though the
   keys look right, the key was likely regenerated or revoked on Razorpay's
   side — go back and generate a fresh pair, don't assume the `.env` is
   the problem.
4. **Never switch to Live Mode keys until KYC is approved on the Razorpay
   account AND the full flow has been tested end-to-end in Test Mode.**

### 3. MSG91 (optional — SMS on successful payment)

Not required for checkout to work. `db/sms.js` degrades gracefully:
if these aren't set, it just logs a warning instead of sending an SMS,
and does **not** block or fail the payment.

1. Requires **DLT registration** — a mandatory Indian telecom regulatory
   step for transactional SMS. This can take several days to get approved;
   it isn't something you configure in five minutes.
2. Once approved, you'll have a DLT-approved sender ID and message
   template. The template's placeholder variables must match what
   `db/sms.js` actually sends — check that file's payload against your
   approved template before relying on it.
3. Fill in `MSG91_AUTH_KEY`, `MSG91_SENDER_ID`, `MSG91_TEMPLATE_ID` in `.env`.

### 4. Resend (optional — order confirmation email with PDF invoice)

Not required for checkout to work. `db/mailer.js` degrades gracefully:
if these aren't set, it just logs a warning instead of sending an email,
and does **not** block or fail the payment.

1. Sign up at [resend.com](https://resend.com) — free tier is 3,000
   emails/month (100/day), plenty for order confirmations.
2. Dashboard → **API Keys** → create one → copy it into `RESEND_API_KEY`.
3. Dashboard → **Domains** → add and verify a domain you own (follow the
   DNS records they give you — this can take a few minutes to propagate).
   **Until a domain is verified, Resend only lets you send test emails to
   the address you signed up with** — sends to real customers will fail
   with a 403 until you verify a domain.
4. Set `RESEND_FROM_EMAIL` to an address on that verified domain, e.g.
   `orders@yourdomain.com`.
5. Run `npm install` again (adds the `resend` package).

The email is sent automatically right after payment verification, with
the same PDF invoice `db/invoice.js` generates for the download link —
just attached instead of streamed.

### 5. Environment variables

Copy `.env.example` to `.env` and fill in real values. Full reference:

| Variable | Required? | What it's for | Where to get it |
|---|---|---|---|
| `PORT` | No (defaults to 3000) | Port the Express server listens on | — |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of exact origins allowed to call this API (CORS) | Wherever you serve the frontend from |
| `DATABASE_URL` | Yes | Postgres connection string | Supabase → Connect → Connection string → **Session pooler** |
| `RAZORPAY_KEY_ID` | Yes | Public Razorpay identifier, also sent to the frontend | Razorpay dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Yes | Secret used to create orders and verify payment signatures — never sent to the frontend | Razorpay dashboard → Settings → API Keys |
| `MSG91_AUTH_KEY` | No | MSG91 authentication | msg91.com dashboard, after DLT approval |
| `MSG91_SENDER_ID` | No | Your approved SMS sender ID | Same, DLT-approved |
| `MSG91_TEMPLATE_ID` | No | Your approved SMS template | Same, DLT-approved |
| `RESEND_API_KEY` | No | Resend authentication | resend.com dashboard → API Keys |
| `RESEND_FROM_EMAIL` | No | "From" address for confirmation emails — must be on a verified domain | resend.com dashboard → Domains |

**On `ALLOWED_ORIGINS` specifically** — this trips people up constantly:
- Must include the exact scheme (`http://`), exact host, and exact port.
  `localhost:5500` and `http://127.0.0.1:5500` are treated as **completely
  different origins** by browsers, even on the same machine — include
  both if you might use either while testing locally:
  ```
  ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
  ```
- This must be your *frontend's* port (wherever `shop.html` is served
  from — e.g. VS Code Live Server's default of 5500), **not** this
  backend's own port (3000). Mixing those up is a common mistake.
- Changes to `.env` only take effect after restarting the server —
  `dotenv` reads it once at startup, never while running.

**Security notes:**
- `.env` is already in `.gitignore` — never commit it, never paste a real
  `.env` (with real passwords/secrets) into chat, Slack, or anywhere else
  it might be logged or retained.
- If a real secret (DB password, live API key) is ever exposed — pasted
  somewhere it shouldn't be, committed by accident, etc. — rotate it
  immediately rather than assuming it's fine. Supabase: Project Settings →
  Database → Reset database password. Razorpay: Settings → API Keys →
  Regenerate.
- Razorpay **test mode** keys (`rzp_test_...`) can't move real money, so
  exposure risk is low while developing — but **live mode** keys
  (`rzp_live_...`) should be treated with the same care as a database
  password.

### 6. Install & run

```
cd backend
npm install
npm start
```

- **You must run these from inside the `backend/` folder specifically**,
  not the project root — that's where this `package.json` (with the
  `start` script) lives. Running `npm start` from the wrong directory
  produces `Missing script: "start"`.
- On success, the terminal shows `Mad Sensei backend running on port 3000`
  and then sits there — that's correct, it's supposed to keep running.
  Leave that terminal window open; closing it or pressing Ctrl+C stops
  the server.
- Confirm it's actually up by visiting `http://localhost:3000/api/health`
  in a browser — should return `{"result":"ok","message":"Mad Sensei
  backend is live."}`.

### 7. Frontend

`shop.js`'s `BACKEND_URL` should point at wherever this server is running:
- Local testing: `http://localhost:3000/api`
- Once deployed: update to the deployed backend's URL (see Deploying,
  below)

Serve `shop.html` separately from this backend (e.g. VS Code's **Live
Server** extension) — this backend only serves `/api/*` routes, it does
not serve the frontend's static files.

---

## Routes

| Route | Purpose |
|---|---|
| `POST /api/signup` | create account |
| `POST /api/login` | authenticate |
| `POST /api/update_profile` | save name/phone/address |
| `POST /api/delete_account` | delete account |
| `POST /api/create_order` | server prices the cart from `db/priceList.js`, opens a Razorpay order |
| `POST /api/verify_payment` | verifies the Razorpay signature, marks the order paid, generates invoice number + tracking ID |
| `GET /api/invoice/:orderId` | streams a PDF invoice for a paid order |
| `GET /api/health` | liveness check, no auth required |

### `POST /api/create_order`

**Request body:** `{ cart: [{ productId, size, qty }], address, email }`

The amount charged is calculated **entirely server-side** from
`db/priceList.js` — the client's cart is never trusted for pricing, only
for which `productId`s and quantities were selected.

**Response (success):** `{ result: 'success', orderId, amount, keyId }`

### `POST /api/verify_payment`

**Request body:** `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`

Signature is checked via `HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)`,
compared using `crypto.timingSafeEqual` (not `===`) to avoid timing attacks.
An order is only ever marked `'paid'` if this check passes — the client
saying "it worked" is never sufficient on its own.

**Response (success):** `{ result: 'success', message, invoiceNumber, trackingId, invoiceUrl }`

---

## New in this update

**Location autofill** — "Use My Location" button in the address modal uses
the browser's Geolocation API + OpenStreetMap's free reverse-geocoding
(no API key) to prefill city/state/pincode. It never blocks checkout if
denied or unavailable — the customer can always type manually.

**Payment success/failure UI** — replaced `alert()` popups with a proper
modal (`#payment-result-overlay` in `shop.html`). Handles three cases:
Razorpay's own `payment.failed` event, a failed signature verification,
and a network/checkout error — each with a clear message.

**Invoices** — on successful `verify_payment`, the order gets an
`invoice_number` (`INV-<id>-<date>`) and the response includes an
`invoiceUrl`. The success modal shows a "Download Invoice" button that
hits `GET /api/invoice/:orderId`, which generates a PDF on the fly with
`pdfkit` (line items, address, total) — nothing is pre-generated or
stored as a file, it's built fresh from the `orders` row each time.

**Tracking ID + payment method** — also assigned on successful
verification: `tracking_id` (`MS-000123`, based on the order's DB id) and
`payment_method` (fetched from Razorpay itself via
`razorpay.payments.fetch`, e.g. `upi`/`card`/`netbanking` — never trusted
from the client). Both are shown to the customer and saved on the order
row, and both appear on the invoice PDF.

**SMS confirmation** — after a payment is verified, `db/sms.js` sends a
transactional SMS via MSG91 with the tracking ID and amount. See the
MSG91 setup section above for what's required before this actually sends
anything.

**Email confirmation** — after a payment is verified, `db/mailer.js` sends
an order confirmation email via Resend with the same PDF invoice
attached (built in-memory by `db/invoice.js`, no temp files written).
Sent to the address on the order's shipping address, falling back to the
account email. See the Resend setup section above for what's required.

---

## Keeping prices in sync

`db/priceList.js` is the **only** place that decides what gets charged.
`PRODUCTS` in `shop.js` is just for display — if you add or change a
product's price, update **both**, or checkout will price it wrong.

---

## Troubleshooting

Real errors hit while setting this up, and what they actually meant:

| Error | Cause | Fix |
|---|---|---|
| `Missing script: "start"` | Ran `npm start` from the project root instead of `backend/` | `cd backend` first |
| `Cannot find module 'bcrypt'` (or any other module) | `package.json` doesn't list a dependency the code actually requires | Add it to `package.json`, run `npm install` again |
| `Access to fetch ... blocked by CORS policy` | Browser's origin isn't in `ALLOWED_ORIGINS`, or `.env` was edited without restarting the server | Fix `ALLOWED_ORIGINS` (exact scheme+host+port), restart with `npm start` |
| `net::ERR_CONNECTION_REFUSED` | Backend isn't running, or was stopped (e.g. accidental Ctrl+C) | `npm start` again, leave the terminal open |
| `getaddrinfo ENOTFOUND db.<ref>.supabase.co` | Using the "Direct connection" string, which often fails to resolve | Use the **Session pooler** connection string instead (see Setup, step 1) |
| `statusCode: 401, error: 'Authentication failed'` (from Razorpay) | Key ID/Secret don't match, or were regenerated on Razorpay's dashboard | Regenerate a fresh Test Mode key pair, update `.env`, restart |

General debugging approach that works for almost anything here: open the
browser's DevTools → **Console** tab (not Sources) and retry the action —
the actual error is almost always shown there in red, and it's far more
specific than "checkout error" on the page itself.

---

## Deploying

Render or Railway both work well for a small Express app:
- Push this folder to a GitHub repo (double-check `.env` is NOT included —
  `git status` before committing, `.env` should never appear staged)
- Connect the repo on Render/Railway, set the same env vars there in their
  dashboard's environment variables section (not in a committed `.env`)
- Once live, update `BACKEND_URL` in `shop.js` to the deployed URL
- Update `ALLOWED_ORIGINS` in your env vars to your real shop domain
- Only switch Razorpay keys from test to live once KYC is approved and
  you've tested the full flow end-to-end in test mode