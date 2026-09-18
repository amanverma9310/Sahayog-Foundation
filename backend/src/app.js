import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'

import { globalLimiter } from './middleware/rateLimiter.js'
import globalErrorHandler, { notFoundHandler } from './middleware/errorHandler.js'
import { razorpayWebhook } from './controllers/paymentController.js'

import authRoutes from './routes/authRoutes.js'
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import driveRoutes from './routes/driveRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import receiptRoutes from './routes/receiptRoutes.js'
import storyRoutes from './routes/storyRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import testimonialRoutes from './routes/testimonialRoutes.js'
import teamRoutes from './routes/teamRoutes.js'
import awardRoutes from './routes/awardRoutes.js'
import pressRoutes from './routes/pressRoutes.js'
import partnerRoutes from './routes/partnerRoutes.js'
import faqRoutes from './routes/faqRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import volunteerRoutes from './routes/volunteerRoutes.js'
import internshipRoutes from './routes/internshipRoutes.js'
import csrRoutes from './routes/csrRoutes.js'
import sponsorRoutes from './routes/sponsorRoutes.js'
import newsletterRoutes from './routes/newsletterRoutes.js'
import impactRoutes from './routes/impactRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import campaignRoutes from './routes/campaignRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

const app = express()

app.set('trust proxy', 1)

// ---- Security & core middleware ----
app.use(helmet())

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser tools (curl, mobile apps) with no Origin header
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(compression())
app.use(globalLimiter)

// The Razorpay webhook needs the raw request body to verify its HMAC
// signature, so it's mounted BEFORE the JSON body parser and given its own
// raw parser. Every other route uses the normal JSON parser below.
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    req.rawBody = req.body
    try {
      req.body = JSON.parse(req.body.toString('utf8'))
    } catch {
      req.body = {}
    }
    next()
  },
  razorpayWebhook
)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

// ---- Health check ----
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() })
})

// ---- Routes ----
app.use('/api/auth', authRoutes)
app.use('/api/admin/auth', adminAuthRoutes)
app.use('/api/admin/dashboard', dashboardRoutes)
app.use('/api/admin/notifications', notificationRoutes)

app.use('/api/projects', projectRoutes)
app.use('/api/drives', driveRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/80g', receiptRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/awards', awardRoutes)
app.use('/api/press', pressRoutes)
app.use('/api/partners', partnerRoutes)
app.use('/api/faqs', faqRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/internships', internshipRoutes)
app.use('/api/csr', csrRoutes)
app.use('/api/sponsors', sponsorRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/impact', impactRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/campaigns', campaignRoutes)

app.all('*', notFoundHandler)
app.use(globalErrorHandler)

export default app
