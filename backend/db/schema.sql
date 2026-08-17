-- Run this once in Supabase: Project > SQL Editor > New query > paste > Run

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  phone         TEXT,
  address       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id                  SERIAL PRIMARY KEY,
  user_email          TEXT,                 -- nullable: guests can order too
  cart                JSONB NOT NULL,
  amount              INTEGER NOT NULL,     -- amount in paise (₹1 = 100)
  status              TEXT NOT NULL DEFAULT 'created', -- created | paid | failed
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  address             JSONB,
  invoice_number      TEXT,
  tracking_id         TEXT,
  payment_method      TEXT,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);

-- Runned already.
-- If you already ran this schema before invoice_number existed, run this
-- once instead of the whole file again:
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
