# Sahayog Foundation — Frontend

> **This frontend is now connected to the live backend.** See the root
> `README.md` and `INTEGRATION.md` (one level up) for what changed to wire
> the two together. The section below is the original Phase 1 doc and is
> still accurate for local setup — just note that `src/lib/api.js` now
> calls the real API instead of mock data.

A complete, production-ready React + Vite + Tailwind frontend for a modern
NGO platform, now connected end-to-end to the Express + MongoDB backend
in `../backend`.

## Stack

React 18 · Vite 5 · Tailwind CSS · Framer Motion · React Router 6 ·
React Hook Form + Zod · Axios · React Helmet Async · Lucide icons

## What's included

- Fully responsive, accessible UI (keyboard nav, focus states, `aria-*`,
  `prefers-reduced-motion` support) from 320px phones to large desktops
- Original design system — see `tailwind.config.js` for the full color/type
  scale (Fraunces display serif + Public Sans body, pine/marigold palette)
- 25+ routed pages: home, about, projects (list + detail), drives, gallery,
  stories/blog (list + detail), donation flow, volunteer, internship,
  sponsor-a-drive, CSR partnership, contact, FAQ, transparency/reports,
  80G request, auth (login/register/forgot password), donor dashboard,
  legal pages, 404
- Every form (donation, contact, volunteer, internship, CSR, sponsor,
  80G request, auth) is wired to `react-hook-form` + `zod` validation and a
  real submit handler in `src/lib/api.js`
- Donation flow is fully live end-to-end (`src/pages/Donate.jsx`): creates
  a real order via the backend, opens actual Razorpay Checkout, and
  verifies payment server-side before showing success — no client-side
  "pretend it worked" fallback
- SEO: per-page `<title>`/meta via `react-helmet-async`, Open Graph/Twitter
  tags, JSON-LD structured data on project/story pages, `robots.txt`,
  static `sitemap.xml`
- Route-based code splitting (`React.lazy`) for every page
- Loading, empty, and error states throughout (skeletons, `EmptyState`,
  `ErrorBoundary`, custom 404)

## Getting started

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`.

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

### Environment variables

See `.env.example`. `VITE_API_BASE_URL` points at the live backend
(`http://localhost:5000/api` by default for local dev).

## Where the data comes from now

`src/lib/api.js` calls the real backend via axios — see the root
`INTEGRATION.md` for the full function-to-endpoint mapping, and its own
top-of-file comment for how response documents are normalized (`_id` →
`id`) so every component keeps working unchanged.

`src/data/content.js` still holds a handful of static constants (the
project-category enum, org boilerplate for the footer/contact map) — its
top comment explains exactly what's still used and why. Everything else in
that file is unused leftover mock data, kept only for reference.

## Project structure

```
src/
  components/
    layout/      Navbar, Footer, Layout, ErrorBoundary, CookieConsent
    ui/          Button, Container, SectionHeading, Counter, ProgressBar,
                 Accordion, Modal, Badge, EmptyState, Skeleton, Seo
    home/        Homepage-only sections (Hero, ImpactCounters, etc.)
    project/     ProjectCard, Timeline
    forms/       Reusable form field components
  pages/         One file per route
  data/          A few static constants + legal page copy (see above)
  lib/           api.js (live backend calls), schemas.js (Zod), format.js
  hooks/         useCountUp, useScrolled, useLockBodyScroll, useDocumentTitle
  routes/        ProtectedRoute
```

## Known limitations (by design)

- Auth uses a JWT stored in `localStorage` read by an axios interceptor —
  standard for an SPA talking to a stateless API, but if you want
  httpOnly-cookie-only auth instead, the backend already sets one
  (`protect` middleware in `backend/src/middleware/auth.js` checks the
  cookie as a fallback) — you'd just stop storing/sending the Bearer token.
- File uploads (internship resume, 80G proof) aren't wired into the UI yet
  — the backend routes already accept multipart uploads
  (`uploadResume.single('resume')`), so this is a frontend-only gap: add a
  `<input type="file">` and switch that one submit to `FormData`.
- `sitemap.xml` is static; dynamic project/story URLs should be generated
  server-side from the database for a real production deploy.
