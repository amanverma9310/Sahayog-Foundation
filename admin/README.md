# Sahayog Foundation — Admin Panel

A separate React + Vite app for managing every part of the Sahayog
Foundation platform: content (projects, drives, stories, gallery,
testimonials, team, awards, press, partners, FAQs, reports, campaigns,
impact stats), donations (read-only ledger + 80G certificate workflow),
public form submissions (contact, volunteer, internship, CSR, sponsor —
each with a status workflow), the newsletter list, admin user management,
and site settings. It talks to the same backend as the main website — no
new backend needed except the two small files below.

## Before you install: two backend files need a small patch

I added one missing endpoint while building this — every other content
type already had an admin "list all" endpoint (so admins can see drafts,
not just published items), but **Projects** never got one. Replace these
two files in your existing `backend/` with the versions included alongside
this folder:

- `backend/src/controllers/projectController.js` — adds `getAllProjectsAdmin`
- `backend/src/routes/projectRoutes.js` — adds the `GET /api/projects/admin/all` route (registered before `/admin/:id` — route order matters here, since Express would otherwise try to match `all` as an `:id`)

Everything else in this admin panel calls endpoints that already exist in
your backend from the earlier build — nothing else needs to change there.

## Getting started

```bash
cd admin
npm install
cp .env.example .env      # defaults to http://localhost:5000/api
npm run dev                # http://localhost:5174
```

Log in with the admin account you created via `npm run seed:admin` in the
backend.

### Build for production

```bash
npm run build       # outputs to dist/
npm run preview      # preview the production build locally
```

## What's included

- **Auth**: login page, JWT stored in `localStorage`, auto-redirect to
  login on a 401 from any request (session expiry, wrong role, etc.)
- **Role-aware navigation**: the sidebar only shows sections a given
  admin's role can actually use, and routes are wrapped in a `RoleRoute`
  guard that matches the backend's `restrictTo(...)` on every endpoint —
  see the role table below. **This is a UX convenience only** — the real
  access control is the backend's own role check on every write route,
  same as before.
- **Dashboard**: total/monthly donations, donor count, active
  projects/drives, pending 80G requests, new enquiry counts, a 12-month
  donation trend bar chart (built with plain CSS, no charting library —
  one less dependency to break), and a recent-transactions table
- **Generic CRUD system** (`components/resource/`) powers most of the
  simple content types — a resource just needs a field-config file
  (`src/config/*.js`) describing its form fields and table columns; list,
  create, edit, and delete all come from `ResourceListPage` +
  `ResourceFormModal`. Used for: testimonials, team, awards, press,
  partners, FAQs, campaigns, drives, stories.
- **Bespoke pages** for the resources that didn't fit the generic pattern:
  - **Projects** — full-page form (not a modal — too many fields), with
    an embedded repeatable editor for the interactive timeline and impact
    stats. These save as part of the same project update, not separate API
    calls, even though the backend also exposes atomic
    add/update/delete-timeline-event endpoints if you want them later.
  - **Gallery** and **Reports** — real file upload (image/PDF) via
    `multipart/form-data` to the backend's Cloudinary-backed endpoints.
  - **Impact Stats** — upsert-by-key, not standard CRUD (matches the
    backend's `PUT /api/impact` behavior).
  - **Donations** — read-only ledger with a status filter. Donations are
    created by the payment flow, not by an admin, so there's no create
    form here — only visibility.
  - **80G Requests** — status workflow plus a "Generate certificate"
    action that calls the backend's PDF-generation-and-email endpoint.
  - **Contact/Volunteer/Internship/CSR/Sponsor** — a shared
    `StatusListPage` component: searchable list, inline status dropdown
    that saves on change, and a "view details" modal for fields too long
    for a table column.
  - **Newsletter** — subscriber list with a CSV export button (fetched as
    an authenticated blob and downloaded client-side — a plain link with
    a token in the query string wouldn't have authenticated against the
    backend's `Authorization`-header-only auth check).
  - **Admin Users** (Super Admin only) — create sub-admins, activate/
    deactivate existing ones. Can't deactivate yourself.
  - **Site Settings** (Super Admin only) — the homepage hero text/media,
    org contact details, and social links, all backed by the same
    `SiteSetting` singleton the public frontend reads from.

## Role reference

| Role | Can access |
|---|---|
| **Super Admin** | Everything |
| **Project Manager** | Projects, Drives |
| **Content Manager** | Stories, Gallery, Testimonials, Team, Awards, Press, Partners, FAQs, Impact Stats, Contact Messages, Volunteers, Internships, Newsletter |
| **Donation Manager** | Reports, Campaigns, Donations, 80G Requests, CSR Enquiries, Sponsor Requests |

This matches the backend's `restrictTo(...)` calls exactly — I cross-checked
every route.

## A known limitation, honestly stated

Several of the admin-list endpoints on the backend (contact messages,
volunteers, internships, CSR enquiries, sponsor requests) don't return a
`total` count alongside their paginated results — only the page of items
itself. Real pagination controls need that count to compute page numbers,
so rather than build pagination UI that would silently be wrong, these
lists request a high limit (200) and show everything at once. Fine for
where an NGO's submission volume realistically is; if you outgrow it, the
fix is a one-line addition to each of those backend controllers
(`sendSuccess(res, 200, items, { total })`), which the `Donations` and
project/story/etc. list pages already do correctly.

## The honest caveat, same as every previous piece of this project

I built this in a sandboxed environment with no network access, so I
could not run `npm install` or click through this UI against a live
backend. I checked every import resolves, every file is brace-balanced,
and cross-referenced every API call this app makes against the backend
route it's calling (path, method, expected payload shape, and required
role) by hand. I have not seen it render. Please run it and tell me what
breaks — role-permission edges and the file-upload forms (Gallery,
Reports) are the parts I'd most want a real click-through on.

## Project structure

```
src/
  components/
    layout/     Sidebar, Topbar, MobileSidebar, NotificationBell, AdminLayout
    ui/         Button, Badge, Modal, ConfirmDialog, Spinner, EmptyState,
                SearchInput, StatCard, FormField (Text/Number/Date/
                TextArea/Select/Checkbox/List/File)
    resource/   DataTable, Pagination, ResourceListPage, ResourceFormModal,
                StatusListPage — the generic systems described above
  config/       Field/column config per simple resource
  context/      AuthContext (admin session state)
  routes/       ProtectedRoute, RoleRoute
  lib/          api.js (every backend call), format.js
  pages/        One file per screen
```

## Deployment

Same pattern as the main frontend: Vercel, with `Root Directory` set to
`admin`, and `VITE_API_BASE_URL` pointing at your deployed backend. Put it
on its own subdomain (e.g. `admin.yourdomain.org`) rather than a path on
the main site, and keep it out of search engines (already set via
`<meta name="robots" content="noindex, nofollow">` in `index.html`).
