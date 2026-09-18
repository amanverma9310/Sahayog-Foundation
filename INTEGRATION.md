# Integration guide — connecting the two zips

This maps every function in the frontend's `src/lib/api.js` (Phase 1) to
its real endpoint in the backend (Phase 2). This is the "integration test"
for this build: I verified every mock function has a matching, correctly
authenticated backend route with a matching response shape — I could not
run a live end-to-end request in this sandbox (no network access), so
please do a real smoke test after deploying both (steps at the bottom).

| Frontend function (`src/lib/api.js`) | Backend endpoint | Auth |
|---|---|---|
| `getProjects(params)` | `GET /api/projects` | Public |
| `getProjectBySlug(slug)` | `GET /api/projects/slug/:slug` | Public |
| `getFeaturedProjects(limit)` | `GET /api/projects/featured?limit=` | Public |
| `getDrives(params)` | `GET /api/drives` | Public |
| `getStories(params)` | `GET /api/stories` | Public |
| `getStoryBySlug(slug)` | `GET /api/stories/slug/:slug` | Public |
| `getFeaturedStories(limit)` | `GET /api/stories/featured?limit=` | Public |
| `getGallery(params)` | `GET /api/gallery` | Public |
| `getTestimonials(params)` | `GET /api/testimonials` | Public |
| `getTeam()` | `GET /api/team` | Public |
| `getAwards()` | `GET /api/awards` | Public |
| `getPress()` | `GET /api/press` | Public |
| `getPartners()` | `GET /api/partners` | Public |
| `getFaqs(params)` | `GET /api/faqs` | Public |
| `getImpactStats()` | `GET /api/impact` | Public |
| `getActiveCampaign()` | `GET /api/settings/active-campaign` | Public |
| `getOrgInfo()` | `GET /api/settings` (returns `orgName`/`orgEmail`/etc.) | Public |
| `submitContactForm(data)` | `POST /api/contact` | Public, rate-limited |
| `submitVolunteerApplication(data)` | `POST /api/volunteers` | Public, rate-limited |
| `submitInternshipApplication(data)` | `POST /api/internships` (multipart, field `resume`) | Public, rate-limited |
| `submitCsrEnquiry(data)` | `POST /api/csr` | Public, rate-limited |
| `submitSponsorRequest(data)` | `POST /api/sponsors` | Public, rate-limited |
| `submitNewsletterSignup(data)` | `POST /api/newsletter/subscribe` | Public, rate-limited |
| `submit80GRequest(data)` | `POST /api/80g/request` | Public, rate-limited |
| `createDonationOrder(data)` | `POST /api/payments/create-order` | Public |
| `verifyDonationPayment(data)` | `POST /api/payments/verify` | Public (signature-verified server-side) |
| `login(data)` | `POST /api/auth/login` | Public |
| `register(data)` | `POST /api/auth/register` | Public |
| *(new)* donor dashboard data | `GET /api/payments/my-donations`, `GET /api/80g/my-requests` | Donor JWT — wire these into `Dashboard.jsx` in place of its current hard-coded demo rows |

Every admin-only variant (`/admin/...` sub-paths under most of the above)
requires an admin JWT and a role check server-side — these power an admin
panel that wasn't part of either phase's brief but all the CRUD endpoints
are ready for one if you build it later.

## Field-name compatibility

The backend's Mongoose schemas and the frontend's mock data
(`src/data/content.js`) use the same field names throughout (`title`,
`slug`, `shortDescription`, `heroImage`, `fundingTarget`, `amountRaised`,
`beneficiaries`, `timeline[].year/title/description`, etc.), so once
`src/lib/api.js` calls the real endpoints, the existing React components
should render the real data without prop changes.

One shape difference to know about: Mongoose returns `_id` (not `id`).
The frontend currently reads `.id` in a few places (`project.id`,
`story.id`). When you wire this up, either add `id: doc._id` in the
backend's `toJSON` transform (cleanest — one change in `Project.js`,
`Story.js` etc.) or adjust the ~6 frontend call sites. I'd recommend the
former.

## Doing a real smoke test once both are deployed

1. Deploy the backend (Render/Railway) and confirm
   `GET https://<api-url>/api/health` returns `{"success":true,...}`.
2. Run `npm run seed:admin` and `npm run seed:content` against the deployed
   database (or locally against the same `MONGO_URI`).
3. Set the frontend's `VITE_API_BASE_URL` to the deployed API URL, update
   `src/lib/api.js` per the table above, and deploy the frontend (Vercel).
4. Walk through: homepage loads real impact stats → project detail page
   loads a seeded project → submit the contact form and confirm the
   message appears in MongoDB and the acknowledgement email arrives →
   make a ₹100 test donation in Razorpay test mode and confirm the
   donation is marked `successful` only after `/api/payments/verify`
   succeeds, a receipt PDF lands in Cloudinary, and the confirmation email
   arrives.

That last step is the one I'd most want a human to actually click through
— it's the one place a silent mismatch (wrong field name, wrong content
type on the multipart resume upload, etc.) would only show up at runtime.
