# 🚀 Production Deployment Guide for Vercel — Mad Sensei Studios

This repository is fully configured and ready for **1-click / Git deployment on Vercel** with zero configuration required.

---

## 🏗️ Architecture Overview

- **Frontend**: Static website (HTML5 / CSS3 / JS) automatically served via Vercel’s global Edge Network / CDN from `public/`.
- **Backend**: Node.js & Express API running as serverless functions on Vercel via `api/index.js`.
- **Database**: PostgreSQL on Supabase (using connection pooling).
- **Payment Gateway**: Razorpay (INR checkout with HMAC-SHA256 signature verification).
- **Invoice & Email**: PDFKit invoice generator + Resend transactional email confirmations.
- **SMS & Shipping**: MSG91 SMS + Shiprocket courier integrations.

---

## 📋 Prerequisites Checklist

Before deploying, ensure you have:
1. A **[Vercel account](https://vercel.com)** (Free / Pro).
2. A **[GitHub account](https://github.com)** with this repository pushed.
3. A **[Supabase account](https://supabase.com)** (PostgreSQL database).
4. A **[Razorpay account](https://razorpay.com)** with API Key ID & Secret.
5. (Optional) A **[Resend account](https://resend.com)** for email confirmations.

---

## 🛠️ Step 1: Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create or select your project.
2. Go to **SQL Editor** -> Click **New Query**.
3. Copy and paste the contents of `backend/db/schema.sql` and click **Run**.
4. Get your connection string:
   - Go to **Project Settings** -> **Database**.
   - Look for **Connection string** -> Choose the **"Session pooler"** tab (Port 5432 or 6543 with pooler URL `aws-0-[region].pooler.supabase.com`).
   - Replace `[YOUR-PASSWORD]` with your database password.
   - Example: `postgresql://postgres.yourprojectref:yourpassword@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`

---

## 🚀 Step 2: Deploying on Vercel

### Option A: Via Vercel Web Dashboard (Recommended)

1. Push your project to a GitHub repository:
   ```bash
   git add .
   git commit -m "Configure production setup for Vercel"
   git push origin main
   ```
2. Open **[Vercel Dashboard](https://vercel.com/new)**.
3. Click **"Add New..."** -> **"Project"** -> Import your GitHub repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: *Other* (detected automatically).
   - **Root Directory**: `./` (leave as default).
   - **Build Command**: `npm run build` (leave default).
   - **Output Directory**: `public` (leave default).
5. Expand **Environment Variables** and add the following keys (see table below).
6. Click **Deploy**.

---

### Option B: Via Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Log in and deploy:
   ```bash
   vercel login
   vercel --prod
   ```

---

## 🔐 Step 3: Environment Variables on Vercel

In your **Vercel Project Dashboard** -> **Settings** -> **Environment Variables**, add the following:

| Variable Name | Required? | Example / Value | Description |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://postgres.ref:pass@aws-0-pooler.supabase.com:5432/postgres` | Supabase Postgres Session Pooler URL |
| `RAZORPAY_KEY_ID` | **Yes** | `rzp_test_... / rzp_live_...` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | **Yes** | `your_razorpay_secret` | Razorpay API Secret |
| `NODE_ENV` | No | `production` | Environment mode |
| `ALLOWED_ORIGINS` | No | `https://your-domain.vercel.app,https://yourcustomdomain.com` | Allowed origins for CORS (defaults to same-origin) |
| `RESEND_API_KEY` | No | `re_123456789...` | Resend API key for order confirmation emails |
| `RESEND_FROM_EMAIL` | No | `orders@yourdomain.com` | Verified domain email for sender |
| `ADMIN_SECRET` | No | `your-random-secret-key` | Secret for `x-admin-secret` header on admin routes |
| `SHIPROCKET_EMAIL` | No | `you@yourdomain.com` | Shiprocket account email |
| `SHIPROCKET_PASSWORD` | No | `your-shiprocket-password` | Shiprocket account password |
| `SHIPROCKET_PICKUP_LOCATION` | No | `Primary` | Nickname of pickup location in Shiprocket |
| `MSG91_AUTH_KEY` | No | `your-msg91-key` | MSG91 SMS gateway auth key |
| `MSG91_SENDER_ID` | No | `MADSEN` | DLT approved sender ID |
| `MSG91_TEMPLATE_ID` | No | `your-template-id` | DLT approved template ID |

---

## 🧪 Step 4: Verification & Smoke Testing

Once deployment completes:
1. **Health Check**: Visit `https://<your-vercel-domain>.vercel.app/api/health`
   - You should see: `{"result":"ok","message":"Mad Sensei backend is live."}`
2. **Landing Page**: Visit `https://<your-vercel-domain>.vercel.app/`
3. **Shop Page**: Visit `https://<your-vercel-domain>.vercel.app/shop`
4. **Test Checkout Flow**:
   - Add an item to the cart.
   - Open Cart -> Proceed to Checkout -> Enter shipping details.
   - Click "Continue to Payment" to test the Razorpay modal.

---

## 🔄 Local Development

To run the whole stack locally with hot reloading / single command:

```bash
# 1. Install dependencies
npm install

# 2. Build / sync static assets
npm run build

# 3. Start local development server
npm run dev
```

The app will be live at `http://localhost:3000` (with frontend and `/api` running together). 
