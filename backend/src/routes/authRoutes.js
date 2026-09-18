import express from 'express'
import * as authController from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidators.js'
import { z } from 'zod'

const router = express.Router()

router.post('/register', authLimiter, validateBody(registerSchema), authController.register)
router.post('/login', authLimiter, validateBody(loginSchema), authController.login)
router.post('/logout', authController.logout)
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword)
router.patch('/reset-password/:token', validateBody(resetPasswordSchema), authController.resetPassword)
router.get('/verify-email/:token', authController.verifyEmail)

router.use(protect)
router.get('/me', authController.getMe)
router.patch('/update-me', authController.updateMe)
router.patch(
  '/update-password',
  validateBody(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(6) })),
  authController.updatePassword
)

export default router
