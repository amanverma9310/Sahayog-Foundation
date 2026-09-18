// ---------------------------------------------------------------------------
// LIVE API LAYER — connected to the Phase 2 Express/MongoDB backend.
// ---------------------------------------------------------------------------
// Every function here calls the real backend at VITE_API_BASE_URL. Response
// documents are normalized (_id -> id) so existing components that read
// `.id` keep working unchanged. See /INTEGRATION.md at the project root for
// the full frontend-function -> backend-endpoint mapping.
// ---------------------------------------------------------------------------

import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sahayog_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Surfaces a clean, human-readable message from the backend's standard
// error shape ({ success: false, message }) so forms can show it directly.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

// Recursively replaces Mongo's `_id` with `id` on plain objects/arrays so
// the rest of the app can keep using `.id` as it did against mock data.
function normalizeIds(value) {
  if (Array.isArray(value)) return value.map(normalizeIds)
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out = {}
    for (const [key, val] of Object.entries(value)) {
      if (key === '_id') {
        out.id = val
        out._id = val
      } else if (key === '__v') {
        continue
      } else {
        out[key] = normalizeIds(val)
      }
    }
    return out
  }
  return value
}

async function get(path, params) {
  const { data } = await apiClient.get(path, { params })
  return normalizeIds(data.data ?? data)
}

async function post(path, body, config) {
  const { data } = await apiClient.post(path, body, config)
  return normalizeIds(data.data ?? data)
}

// ---- Projects ---------------------------------------------------------
export async function getProjects({ category, status, search } = {}) {
  const params = {}
  if (category && category !== 'All') params.category = category
  if (status) params.status = status
  if (search) params.search = search
  const items = await get('/projects', params)
  return { items, total: items.length }
}

export async function getProjectBySlug(slug) {
  return get(`/projects/slug/${slug}`)
}

export async function getFeaturedProjects(limit = 3) {
  return get('/projects/featured', { limit })
}

// ---- Drives -------------------------------------------------------------
export async function getDrives({ projectId, location, year } = {}) {
  const params = {}
  if (projectId) params.project = projectId
  if (location) params.location = location
  if (year) params.year = year
  const items = await get('/drives', params)
  return { items, total: items.length }
}

// ---- Stories / blog -------------------------------------------------------
export async function getStories({ category, search, tag } = {}) {
  const params = {}
  if (category && category !== 'All') params.category = category
  if (search) params.search = search
  if (tag) params.tag = tag
  const items = await get('/stories', params)
  return { items, total: items.length }
}

export async function getStoryBySlug(slug) {
  return get(`/stories/slug/${slug}`)
}

export async function getFeaturedStories(limit = 3) {
  return get('/stories/featured', { limit })
}

// ---- Gallery --------------------------------------------------------------
export async function getGallery({ category, year } = {}) {
  const params = {}
  if (category && category !== 'All') params.category = category
  if (year) params.year = year
  const items = await get('/gallery', params)
  return { items, total: items.length }
}

// ---- Static content collections -------------------------------------------
export async function getTestimonials({ type, featured } = {}) {
  const params = {}
  if (type) params.type = type
  if (featured) params.featured = true
  return get('/testimonials', params)
}

export async function getTeam() {
  return get('/team')
}

export async function getAwards() {
  return get('/awards')
}

export async function getPress() {
  return get('/press')
}

export async function getPartners() {
  return get('/partners')
}

export async function getFaqs({ category } = {}) {
  const params = {}
  if (category && category !== 'All') params.category = category
  return get('/faqs', params)
}

export async function getImpactStats() {
  return get('/impact')
}

export async function getReports() {
  return get('/reports')
}

export async function getActiveCampaign() {
  try {
    return await get('/settings/active-campaign')
  } catch {
    return null
  }
}

export async function getOrgInfo() {
  const settings = await get('/settings')
  return {
    name: settings.orgName,
    email: settings.orgEmail,
    phone: settings.orgPhone,
    address: settings.orgAddress,
    registrationNumber: settings.registrationNumber,
    pan: settings.pan,
    social: settings.socialLinks || {},
  }
}

// ---- Forms ------------------------------------------------------------
export async function submitContactForm(payload) {
  return post('/contact', payload)
}

export async function submitVolunteerApplication(payload) {
  return post('/volunteers', payload)
}

export async function submitInternshipApplication(payload) {
  // Sent as JSON for now (no resume field in the UI yet). If/when a resume
  // <input type="file"> is added, switch this to a FormData body — the
  // backend route already accepts multipart via `uploadResume.single('resume')`.
  return post('/internships', payload)
}

export async function submitCsrEnquiry(payload) {
  return post('/csr', payload)
}

export async function submitSponsorRequest(payload) {
  return post('/sponsors', payload)
}

export async function submitNewsletterSignup(payload) {
  return post('/newsletter/subscribe', payload)
}

export async function submit80GRequest(payload) {
  return post('/80g/request', payload)
}

// ---- Donations / Razorpay ---------------------------------------------
// createDonationOrder takes the frontend's donation form field names and
// maps them onto the backend's expected shape.
export async function createDonationOrder(payload) {
  const body = {
    amount: payload.amount,
    frequency: payload.frequency,
    designation: payload.designation,
    projectId: payload.projectId,
    campaignId: payload.campaignId,
    donorName: payload.fullName,
    donorEmail: payload.email,
    donorPhone: payload.phone,
    anonymous: payload.anonymous,
    wants80G: payload.wants80G,
    pan: payload.pan,
  }
  const data = await post('/payments/create-order', body)
  return {
    orderId: data.orderId,
    amount: data.amount,
    currency: data.currency,
    keyId: data.keyId,
    donationId: data.donationId,
  }
}

// payload is the raw object Razorpay Checkout's handler callback gives us:
// { razorpay_order_id, razorpay_payment_id, razorpay_signature }
export async function verifyDonationPayment(payload) {
  return post('/payments/verify', {
    razorpay_order_id: payload.razorpay_order_id,
    razorpay_payment_id: payload.razorpay_payment_id,
    razorpay_signature: payload.razorpay_signature,
  })
}

export async function getMyDonations() {
  return get('/payments/my-donations')
}

export async function getMy80GRequests() {
  return get('/80g/my-requests')
}

// ---- Auth -----------------------------------------------------------------
export async function login(payload) {
  const { data } = await apiClient.post('/auth/login', payload)
  return { token: data.token, user: normalizeIds(data.data.user) }
}

export async function register(payload) {
  const { data } = await apiClient.post('/auth/register', payload)
  return { token: data.token, user: normalizeIds(data.data.user) }
}

export async function forgotPassword(payload) {
  return post('/auth/forgot-password', payload)
}

export async function getMe() {
  return get('/auth/me')
}
