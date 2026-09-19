# Sahayog Foundation — Full MERN Stack

A complete, connected MERN application: React/Vite frontend + Express/
MongoDB backend, wired together — not two separate builds anymore.

```
sahayog-mern/
├── frontend/     React + Vite + Tailwind (Phase 1)
├── backend/      Express + MongoDB (Phase 2)
├── admin/        React + Vite admin panel (content, donations, forms, settings)
└── README.md     you are here
```

Each folder still has its own detailed README (env vars, service setup,
deployment). This file covers what changed to connect them and how to run
the whole thing together.

## What "connected" means here, concretely

`frontend/src/lib/api.js` — previously a mock layer returning demo data —
now calls the real backend via axios, using `VITE_API_BASE_URL`. Beyond
just swapping the function bodies, connecting the two surfaced and fixed
several real mismatches between what the mock data assumed and what the
backend actually returns:

- **`_id` vs `id`** — MongoDB documents come back with `_id`; the UI was
  built expecting `.id`. `api.js` now normalizes every response
  (`_id` → `id`) recursively, so no component had to change.
- **Donation field names** — the donation form collects `fullName` /
  `email` / `phone`; the backend's `Donation` model (correctly, to match
  Razorpay's own donor-record conventions) expects `donorName` /
  `donorEmail` / `donorPhone`. `createDonationOrder()` now maps one to the
  other.
- **A real bug in the donation flow**: the original handler only sent
  `{ amount }` to `create-order`, silently dropping the donor's name,
  email, phone, and project/campaign choice. Fixed to send the full
  payload — and the fake "pretend the payment succeeded" fallback (only
  there because Phase 1 had no backend to verify against) is gone,
  replaced with a real error state.
- **Populated references** — `Project.testimonialIds`, `Story.relatedProject`,
  `GalleryItem.project`, and drive images (`images[]`, not a single
  `image`) all needed small fixes in the pages that render them, since the
  real backend returns populated sub-documents / arrays where the mock
  data had flat strings.
- **Dropdowns that submit real ids** — `SelectField` now accepts either
  plain strings or `{ value, label }` pairs, so "preferred project"
  selects (CSR, donation) submit a real Mongo `_id` instead of a title
  string that would fail an ObjectId cast on the backend.
- **Dashboard, Transparency, Contact** now fetch real donation history,
  80G requests, published reports, and org contact details instead of
  showing hard-coded demo rows.

`INTEGRATION.md` (in this same delivery) has the full endpoint-by-endpoint
mapping if you want the complete picture.

### What's still intentionally static

A handful of page furniture — the project-category enum used for filter
buttons, the footer's social links, the Contact page's map coordinates —
stays as local constants in `frontend/src/data/content.js`. These aren't
bugs: they're either fixed enums that match the backend's own schema enum,
or content with no matching backend field yet (lat/lng isn't in the
`SiteSetting` model). The file's top comment explains exactly what's still
used and why.

## Running all three together

### 1. Backend first

```bash
cd backend
npm install
cp .env.example .env   # fill in MongoDB/Razorpay/Cloudinary/email — see backend/README.md
npm run seed:admin
npm run seed:content    # recommended — the frontend has nothing to show without this
npm run dev              # http://localhost:5000
```

### 2. Frontend (the public site)

```bash
cd frontend
npm install
cp .env.example .env    # defaults already point at http://localhost:5000/api
npm run dev              # http://localhost:5173
```

### 3. Admin panel

```bash
cd admin
npm install
cp .env.example .env    # defaults already point at http://localhost:5000/api
npm run dev              # http://localhost:5174
```

Log in with the admin account `npm run seed:admin` created in step 1. See
`admin/README.md` for the two backend files that needed a small patch to
support it (already applied in this copy — see the note there for details
if you're merging into an older copy of the backend).

### Or, from this root folder

A convenience root `package.json` is included so you can run all three with
one command once each side's own `npm install` is done:

```bash
npm install              # installs `concurrently` at the root only
npm run dev               # runs backend + frontend + admin together
```

## The one thing I couldn't actually test

Same caveat as both phases individually: this was built in a sandboxed
environment with no network access, so I could not run `npm install` or
start either server to watch a real request round-trip happen. I traced
every function call across the two codebases by hand (matching field
names, response shapes, and route paths) and fixed every mismatch I found,
but I have not seen a browser load real data from this real API. Please
treat the first `npm run dev` (both sides) plus a click through the
donation flow as the actual test — and if anything breaks, the error
message plus which page you were on is all I need to fix it fast.

## Suggested first smoke test, in order

1. `GET http://localhost:5000/api/health` → `{"success":true,...}`
2. Frontend homepage loads and shows impact stats + featured projects (confirms `getImpactStats`/`getFeaturedProjects` are reaching MongoDB)
3. Open a project detail page from the homepage (confirms the slug-based route and populated testimonials/drives/stories)
4. Submit the Contact form → check the message lands in MongoDB (`ContactMessage` collection) and the acknowledgement email arrives
5. Register a donor account → log in → dashboard loads (even if empty, confirms JWT auth end-to-end)
6. Make a ₹100 test donation in Razorpay test mode → confirm the donation only shows `status: successful` after `/api/payments/verify` returns 200, a receipt PDF lands in Cloudinary, and the confirmation email arrives

Step 6 is the one I'd most want a human to actually click through.
