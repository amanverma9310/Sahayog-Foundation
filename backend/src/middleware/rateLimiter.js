import rateLimit from 'express-rate-limit'

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15)

export const globalLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 200),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

// Tighter limit on auth endpoints to slow down brute-force login attempts.
export const authLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
})

// Protects public-facing forms (contact, volunteer, CSR, etc.) from spam
// submission floods without blocking normal browsing.
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions from this device. Please try again later.' },
})
