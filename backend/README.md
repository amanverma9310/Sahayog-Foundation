# Sahayog Foundation — Backend

> **This backend is now connected to the live frontend.** See the root
> `README.md` and `INTEGRATION.md` (one level up) for what the connection
> work involved. The rest of this doc — setup, service configuration,
> deployment — is unchanged and still the source of truth for running this
> API on its own.

A complete Node.js + Express + MongoDB REST API for the Sahayog Foundation
NGO platform, matching the frontend in `../frontend` exactly — same field
names, same response shapes, same validation rules.

## Stack

Node.js · Express · MongoDB + Mongoose · JWT + bcrypt · Zod validation ·
Razorpay · Cloudinary · Nodemailer · PDFKit · Helmet/CORS/rate-limiting

## Honesty note on testing

This backend was written in a sandboxed environment with no network
access, so — same as the frontend — **I could not run `npm install` or
start the server to test it live.** I checked every relative import
resolves and every file is brace/paren-balanced, but you should treat the
first `npm install && npm run dev` as the real first test. If anything
throws, send me the error and I'll fix it immediately.

## Getting started

### 1. Prerequisites

- Node.js 18+
- A MongoDB database (Atlas free tier is fine — see below)
- Razorpay account (test mode is fine to start)
- Cloudinary account (free tier is fine)
- An SMTP-capable email account (Gmail with an App Password, SendGrid,
  Resend SMTP, etc.)

### 2. Install & configure

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` — see the service-by-service instructions below for where
each value comes from.

### 3. Seed the database

```bash
npm run seed:admin      # creates your first Super Admin login
npm run seed:content    # optional — populates realistic demo content
```

### 4. Run

```bash
npm run dev      # nodemon, auto-restarts on changes
npm start        # production mode
```

The API runs at `http://localhost:5000` by default. Health check:
`GET http://localhost:5000/api/health`.

## Setting up each service

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Database Access → add a user with a strong password.
3. Network Access → add your IP (or `0.0.0.0/0` for development only).
4. Connect → "Drivers" → copy the connection string into `MONGO_URI`,
   replacing `<user>`/`<password>` and adding a database name, e.g.
   `.../sahayog?retryWrites=true&w=majority`.

### Razorpay

1. Sign up at [razorpay.com](https://razorpay.com), stay in **Test Mode**
   while developing.
2. Settings → API Keys → generate a key pair → `RAZORPAY_KEY_ID` /
   `RAZORPAY_KEY_SECRET`.
3. Settings → Webhooks → add an endpoint pointing to
   `https://<your-api-domain>/api/payments/webhook`, subscribe to
   `payment.captured`, and copy the webhook secret into
   `RAZORPAY_WEBHOOK_SECRET`.
4. `RAZORPAY_KEY_ID` is also used by the frontend (`VITE_RAZORPAY_KEY_ID`)
   — the key ID is public/safe to expose; the key **secret** never leaves
   this backend.

### Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com).
2. Dashboard shows `Cloud name`, `API Key`, `API Secret` directly — copy
   them into `CLOUDINARY_*`.

### Email (SMTP)

Any SMTP provider works. For Gmail: enable 2FA, then generate an
[App Password](https://myaccount.google.com/apppasswords) and use that as
`EMAIL_PASSWORD` (not your normal Gmail password). For SendGrid/Resend,
use their SMTP relay credentials instead.

### Admin account

`npm run seed:admin` reads `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` /
`SEED_ADMIN_NAME` from `.env` and creates a Super Admin. **Log in and
change the password immediately** — this seed is meant only to get you
into the system once.

## API overview

All routes are prefixed `/api`. Public routes need no auth; `/admin/*`
sub-routes require an admin JWT (`protectAdmin` + `restrictTo(...)`,
role-checked server-side — never trust a role claimed by the frontend).

| Area | Base path | Notes |
|---|---|---|
| Donor auth | `/api/auth` | register, login, forgot/reset password, email verify |
| Admin auth | `/api/admin/auth` | login, Super-Admin-only admin creation |
| Projects | `/api/projects` | public list/detail + slug lookup, admin CRUD + timeline |
| Drives | `/api/drives` | public list, admin CRUD |
| Payments | `/api/payments` | `create-order`, `verify` (server-side signature check), `webhook` |
| 80G receipts | `/api/80g` | request, admin review + certificate generation |
| Stories | `/api/stories` | public list/detail, admin CRUD |
| Gallery | `/api/gallery` | public filtered list, admin CRUD w/ Cloudinary upload |
| Testimonials, team, awards, press, partners, FAQs, reports | see routes | public read, admin CRUD |
| Forms | `/api/contact`, `/api/volunteers`, `/api/internships`, `/api/csr`, `/api/sponsors` | public submit, admin review + status |
| Newsletter | `/api/newsletter` | subscribe/unsubscribe, admin export CSV |
| Impact stats | `/api/impact` | public read, admin upsert |
| Settings | `/api/settings` | homepage content singleton |
| Search | `/api/search?q=` | projects, stories, campaigns, reports |
| Admin dashboard | `/api/admin/dashboard` | stats + donation trends |

## Payment flow (what actually happens)

1. Frontend calls `POST /api/payments/create-order` → backend creates a
   Razorpay order **and** a `Donation` record with `status: 'created'`.
2. Frontend opens Razorpay Checkout with that order ID.
3. On success, frontend calls `POST /api/payments/verify` with Razorpay's
   response. The backend recomputes the HMAC-SHA256 signature from the
   order ID + payment ID using `RAZORPAY_KEY_SECRET` and compares it —
   **this is the only thing that marks a donation successful.** The
   frontend's "success" callback alone is never trusted.
4. On verified success: donation marked `successful`, project/campaign
   totals incremented, a PDF receipt generated and uploaded to Cloudinary,
   a confirmation email sent, and an admin notification created.
5. `POST /api/payments/webhook` is a second, independent confirmation path
   (Razorpay calls this directly) for cases where the browser-side verify
   call never completes — it's signature-verified against the raw request
   body the same way.

## Security implemented

- `helmet`, configured CORS (allow-list via `CORS_ALLOWED_ORIGINS`), `hpp`,
  `express-mongo-sanitize`, `xss-clean`
- Global + auth-specific + form-specific rate limiting
  (`express-rate-limit`)
- JWT auth with `httpOnly` cookies (plus Bearer token support for
  API/mobile clients), bcrypt password hashing (cost factor 12)
- Every admin write route is role-checked server-side
  (`restrictTo('Super Admin', ...)`) — the frontend hiding a button is not
  access control
- Zod validation on every public write endpoint before it touches Mongoose
- File upload validation (MIME allow-list, size limits) via Multer +
  Cloudinary storage
- Centralized error handler that never leaks stack traces or raw driver
  errors to clients in production
- Razorpay payment and webhook signatures verified server-side (see above)

## Project structure

```
src/
  config/       db.js, cloudinary.js, razorpay.js
  models/       one Mongoose schema per collection (25 collections)
  controllers/  business logic per resource
  routes/       Express routers, wiring middleware + controllers
  middleware/   auth, error handling, rate limiting, upload, validation
  services/     email.service.js, pdf.service.js, notification.service.js
  validators/   Zod schemas for every public write endpoint
  utils/        AppError, catchAsync, ApiFeatures (pagination/filter/search)
  seed/         createAdmin.js, seedContent.js
```

One deliberate deviation from the brief's suggested collection list:
`projectTimelines` is embedded as a sub-document array on `Project` rather
than a separate collection, since timeline events are always fetched and
edited in the context of their parent project — this is the standard
Mongoose pattern for tightly-coupled one-to-many data and avoids an extra
round trip on every project page.

## Deployment

- **Backend**: Render or Railway — set the same environment variables from
  `.env`, build command `npm install`, start command `npm start`.
- **Database**: MongoDB Atlas (already cloud-hosted).
- **Media**: Cloudinary (already cloud-hosted).
- Set `CORS_ALLOWED_ORIGINS` to your deployed frontend URL(s) — no
  hardcoded `localhost` in production.
- Set `NODE_ENV=production` so the error handler stops returning stack
  traces.

## Connecting the already-built frontend

See the frontend's own README ("Connecting to the real backend"). In
short: set `VITE_API_BASE_URL` to this API's URL, and swap each mock
function body in the frontend's `src/lib/api.js` for the matching
`apiClient` call listed in the table above — the request/response shapes
already match.
