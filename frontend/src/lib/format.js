export function formatINR(amount, { compact = false } = {}) {
  if (amount === null || amount === undefined) return '—'
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n) {
  return new Intl.NumberFormat('en-IN').format(n)
}

export function formatDate(dateStr, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return new Intl.DateTimeFormat('en-IN', opts).format(d)
}

export function readingTime(text = '') {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
