# 📘 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product Name: LinguaStar (E-Book Marketplace)

---

## 1. 🎯 Product Overview

LinguaStar is a secure, full-stack web platform for selling and consuming e-books with strict access control, time-limited ownership, and protected in-browser reading.

### Core Principles:
- No raw file access
- Time-bound ownership (60 days)
- Secure streaming-based reading
- Admin-controlled publishing

---

## 2. 👥 User Roles

### 2.1 Admin (Max 3 Users)
- Shared secure credential system
- Upload & manage books
- Monitor revenue & users
- Access analytics dashboard

### 2.2 End User
- Register/login via OTP/social login
- Purchase books
- Access books for 60 days
- Read via secure browser reader

---

## 3. 🔐 Authentication & Authorization

### Requirements:
- OTP login (Email + Mobile)
- Social login (Google, Apple)
- Forgot password (OTP/email)
- JWT-based session system
- Max 3 admins constraint

### Rules:
- JWT stored in HTTP-only cookies
- Refresh token rotation
- Session tracking enabled

---

## 4. 💰 Payments

### Gateway:
- Razorpay

### Flow:
1. User selects book
2. Payment initiated
3. Razorpay webhook verifies payment
4. Purchase stored
5. Access granted (60 days)

---

## 5. 📚 Core Features

### 5.1 User Dashboard
- Purchased books list
- Expiry countdown timer
- Status: Active / Expired

---

### 5.2 Book Access Rules

| Condition | Access |
|----------|--------|
| < 60 days | Allowed |
| Day 61+ | Blocked |
| Repurchase | Restored |

---

### 5.3 Book Reader

- In-browser only (no download)
- Uses PDF.js (protected rendering)
- Page-by-page rendering
- Watermark with user info

### Restrictions:
- Disable right-click
- Disable copy
- Block dev shortcuts (F12, Ctrl+U)

> Note: These are deterrents only. Backend security is primary.

---

### 5.4 Offline Access

- Available after purchase
- Encrypted local storage (IndexedDB)
- Device/session-bound
- Auto-expiry after 60 days
- Not exportable

---

### 5.5 Live Session Tracking

- Track active users
- Track active readers
- Realtime updates

---

## 6. 🛠️ Admin Panel

### Features:
- Upload/delete/update books
- Manage catalog
- View:
  - Revenue
  - Sales
  - Users
- Live user tracking

---

## 7. 🔐 Security Architecture

### Frontend Protection (Basic)
- Disable right-click
- Block dev tools
- Prevent copy

### Backend Protection (Critical)
- Private storage buckets
- Signed URLs (short expiry)
- API-based file access
- JWT validation
- Purchase validation
- Expiry validation

### Content Protection Strategy:
- No direct file URLs
- Stream content via backend
- DRM-like controlled access

---

## 8. 🗄️ Database Design

### Tables:

#### Users
- id (UUID)
- email
- phone
- created_at

#### Admins
- id
- user_id
- max 3 constraint

#### Books
- id
- title
- description
- price
- file_path
- created_at

#### Purchases
- id
- user_id
- book_id
- purchase_date
- expiry_date

#### Sessions
- id
- user_id
- device_info
- active
- last_seen

---

## 9. ⚙️ Tech Stack

### Frontend:
- Next.js (App Router)
- Tailwind CSS
- React Query / Zustand

### Backend:
- Supabase (Auth + DB + Storage)
- Edge Functions

### Realtime:
- Supabase Realtime

---

## 10. 🌐 SEO & Performance

- SSR + ISR
- Meta tags per page
- Sitemap
- Lazy loading
- CDN caching

---

## 11. ♿ Accessibility

- Keyboard navigation (Enter key support)
- ARIA labels
- Focus states
- Responsive design

---

## 12. ⚖️ Legal

### Terms & Conditions:
- No redistribution
- 60-day license
- Unauthorized use prohibited

### Privacy Policy:
- Data collected: Email, Phone, Payment info
- Secure storage

---

## 13. 🚀 API Routes

### Auth
- POST /auth/otp-login
- POST /auth/social-login
- POST /auth/logout

### Books
- GET /books
- GET /books/:id

### Purchase
- POST /purchase
- POST /verify-payment

### Reader
- GET /read/:bookId

---

## 14. 🚀 Deployment

### Frontend:
- Vercel

### Backend:
- Supabase

### Steps:
1. Setup Supabase
2. Create DB schema
3. Configure auth
4. Setup storage (private)
5. Deploy frontend
6. Add env variables
7. Configure Razorpay webhook

---

## 15. ⚠️ Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| PDF leaks | Streaming + encryption |
| Screen recording | Watermark |
| Token theft | HTTP-only cookies |
| Admin misuse | Role checks |

---

## 16. 📦 Deliverables

- Full codebase
- Database schema
- API routes
- Deployment guide
- Secure reader system

---

## 17. 🔥 Final Notes

- Frontend restrictions ≠ real security
- Backend validation is critical
- Treat PDFs like streaming content (Netflix model)

---