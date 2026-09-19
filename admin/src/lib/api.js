import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sahayog_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sahayog_admin_token')
      localStorage.removeItem('sahayog_admin')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    const message = error.response?.data?.message || 'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

function normalizeIds(value) {
  if (Array.isArray(value)) return value.map(normalizeIds)
  if (value && typeof value === 'object') {
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
  return { items: normalizeIds(data.data ?? data), total: data.total, page: data.page, limit: data.limit }
}

async function getRaw(path, params) {
  const { data } = await apiClient.get(path, { params })
  return normalizeIds(data.data ?? data)
}

async function post(path, body, config) {
  const { data } = await apiClient.post(path, body, config)
  return normalizeIds(data.data ?? data)
}

async function patch(path, body) {
  const { data } = await apiClient.patch(path, body)
  return normalizeIds(data.data ?? data)
}

async function del(path) {
  await apiClient.delete(path)
}

// ---- Auth ----
export async function adminLogin(payload) {
  const { data } = await apiClient.post('/admin/auth/login', payload)
  return { token: data.token, admin: normalizeIds(data.data.admin) }
}
export async function adminLogout() {
  await apiClient.post('/admin/auth/logout')
}
export async function getAdminMe() {
  const data = await getRaw('/admin/auth/me')
  return data.admin
}

// ---- Admin user management (Super Admin only) ----
export async function listAdmins() {
  return getRaw('/admin/auth/list')
}
export async function createAdminUser(payload) {
  return post('/admin/auth/create', payload)
}
export async function setAdminActive(id, active) {
  return patch(`/admin/auth/${id}/status`, { active })
}

// ---- Dashboard ----
export async function getDashboardStats() {
  return getRaw('/admin/dashboard/stats')
}
export async function getDonationTrends() {
  return getRaw('/admin/dashboard/donation-trends')
}

// ---- Notifications ----
export async function getNotifications() {
  return getRaw('/admin/notifications')
}
export async function markNotificationRead(id) {
  return patch(`/admin/notifications/${id}/read`)
}
export async function markAllNotificationsRead() {
  return patch('/admin/notifications/read-all')
}

// ---- Generic CRUD-resource factory ----
// Builds the standard { list, create, update, remove } set for a resource
// that follows the backend's common admin pattern: GET <base>/admin/all,
// POST <base>, PATCH <base>/:id, DELETE <base>/:id.
function crudResource(base, { listPath = `${base}/admin/all` } = {}) {
  return {
    list: (params) => get(listPath, params),
    create: (payload) => post(base, payload),
    update: (id, payload) => patch(`${base}/${id}`, payload),
    remove: (id) => del(`${base}/${id}`),
  }
}

// Upload variant — sends multipart/form-data (used for gallery images and
// report PDFs, where the backend expects a file field via Multer).
function crudResourceWithUpload(base, fileFieldName, { listPath = `${base}/admin/all` } = {}) {
  return {
    list: (params) => get(listPath, params),
    create: (payload) => {
      const formData = new FormData()
      Object.entries(payload).forEach(([key, value]) => {
        if (key === fileFieldName && value instanceof File) formData.append(fileFieldName, value)
        else if (value !== undefined && value !== null) formData.append(key, value)
      })
      return post(base, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    update: (id, payload) => patch(`${base}/${id}`, payload),
    remove: (id) => del(`${base}/${id}`),
  }
}

export const projectsApi = {
  ...crudResource('/projects'),
  getById: (id) => getRaw(`/projects/admin/${id}`),
  addTimelineEvent: (id, payload) => post(`/projects/${id}/timeline`, payload),
  updateTimelineEvent: (id, eventId, payload) => patch(`/projects/${id}/timeline/${eventId}`, payload),
  removeTimelineEvent: (id, eventId) => del(`/projects/${id}/timeline/${eventId}`),
}
export const drivesApi = crudResource('/drives')
export const storiesApi = crudResource('/stories')
export const galleryApi = crudResourceWithUpload('/gallery', 'image', { listPath: '/gallery' })
export const testimonialsApi = crudResource('/testimonials')
export const teamApi = crudResource('/team')
export const awardsApi = crudResource('/awards')
export const pressApi = crudResource('/press')
export const partnersApi = crudResource('/partners')
export const faqsApi = crudResource('/faqs')
export const reportsApi = crudResourceWithUpload('/reports', 'file')
export const campaignsApi = crudResource('/campaigns')
export const impactStatsApi = {
  list: () => get('/impact/admin/all'),
  upsert: (payload) => apiClient.put('/impact', payload).then((r) => normalizeIds(r.data.data)),
  remove: (id) => del(`/impact/${id}`),
}

// ---- Donations (read-only) ----
export async function listDonations(params) {
  return get('/payments/admin/all', params)
}

// ---- 80G receipt requests ----
export async function listReceiptRequests(params) {
  return get('/80g/admin/all', params)
}
export async function updateReceiptRequestStatus(id, payload) {
  return patch(`/80g/admin/${id}/status`, payload)
}
export async function generateReceiptCertificate(id) {
  return post(`/80g/admin/${id}/generate-certificate`)
}

// ---- Public form submissions ----
export async function listContactMessages(params) {
  return get('/contact/admin/all', params)
}
export async function updateContactMessageStatus(id, status) {
  return patch(`/contact/admin/${id}/status`, { status })
}

export async function listVolunteers(params) {
  return get('/volunteers/admin/all', params)
}
export async function updateVolunteerStatus(id, payload) {
  return patch(`/volunteers/admin/${id}/status`, payload)
}

export async function listInternships(params) {
  return get('/internships/admin/all', params)
}
export async function updateInternshipStatus(id, payload) {
  return patch(`/internships/admin/${id}/status`, payload)
}

export async function listCsrEnquiries(params) {
  return get('/csr/admin/all', params)
}
export async function updateCsrStatus(id, payload) {
  return patch(`/csr/admin/${id}/status`, payload)
}

export async function listSponsorRequests(params) {
  return get('/sponsors/admin/all', params)
}
export async function updateSponsorStatus(id, payload) {
  return patch(`/sponsors/admin/${id}/status`, payload)
}

// ---- Newsletter ----
export async function listSubscribers() {
  return getRaw('/newsletter/admin/all')
}
export async function downloadSubscribersCSV() {
  const response = await apiClient.get('/newsletter/admin/export', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'newsletter-subscribers.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// ---- Site settings ----
export async function getSiteSettings() {
  return getRaw('/settings')
}
export async function updateSiteSettings(payload) {
  return patch('/settings', payload)
}

// ---- Lookups used across forms (project pickers, etc.) ----
export async function listProjectsForPicker() {
  const { items } = await get('/projects/admin/all', { limit: 100, fields: 'title,slug,category' })
  return items
}
