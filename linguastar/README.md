# =============================================
# LinguaStar — Secure eBook Platform
# =============================================

## Project Structure

```
linguastar/
├── frontend/           ← Next.js App Router (React UI)
│   ├── app/            ← Pages, layouts, API route stubs
│   │   ├── admin/      ← Admin panel UI
│   │   ├── api/        ← API route stubs (re-export from backend/)
│   │   ├── auth/       ← Auth callback
│   │   ├── dashboard/  ← User dashboard
│   │   ├── login/      ← Login page (OTP)
│   │   ├── reader/     ← PDF reader with watermark
│   │   └── store/      ← Book store with Razorpay
│   ├── lib/            ← Supabase client (browser-side)
│   ├── public/         ← Static assets
│   ├── middleware.js   ← Auth/admin route protection
│   └── next.config.ts  ← Next.js config
│
├── backend/            ← Server-side logic (API handlers)
│   ├── api/            ← Route handlers (imported by frontend stubs)
│   │   ├── createOrder/
│   │   ├── createPurchase/
│   │   ├── getBookAccess/   ← Signed URL + expiry check
│   │   ├── savePurchase/    ← Razorpay verify + save to DB
│   │   ├── uploadbooks/     ← Admin book upload to Supabase Storage
│   │   ├── verifyPayment/
│   │   └── webhook/         ← Razorpay webhook handler
│   ├── middleware/     ← Auth middleware logic
│   └── services/       ← Supabase admin client
│
├── database/           ← SQL, policies, migrations
│   ├── migrations/     ← 001_initial.sql (run in Supabase)
│   ├── schema/         ← Table definitions
│   ├── policies/       ← RLS policies
│   └── seeds/          ← Initial data
│
├── .env.local          ← Environment variables (root)
├── package.json        ← Root package.json
└── README.md
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.local` and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

### 3. Set up database
Run `database/migrations/001_initial.sql` in Supabase SQL Editor.
Then run `database/seeds/01_seed.sql` with your user ID to make yourself an admin.

### 4. Create Supabase Storage bucket
Create a private bucket named `books` in Supabase → Storage.

### 5. Run development server
```bash
npm run dev
```

App runs at: http://localhost:3000

## Key Features
- OTP email login via Supabase Auth
- Razorpay payment integration
- Secure book access with signed URLs (60-min expiry)
- PDF reader with watermark protection
- Admin panel for book uploads
- Middleware-based route protection

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/createOrder` | POST | Create Razorpay order |
| `/api/savePurchase` | POST | Verify payment + save purchase |
| `/api/getBookAccess` | POST | Get signed PDF URL |
| `/api/uploadbooks` | POST | Upload book PDF (admin) |
| `/api/webhook` | POST | Razorpay webhook handler |
