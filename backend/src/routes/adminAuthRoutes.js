import express from 'express'
import * as adminAuthController from '../controllers/adminAuthController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { adminLoginSchema } from '../validators/authValidators.js'
import { z } from 'zod'

const router = express.Router()

router.post('/login', authLimiter, validateBody(adminLoginSchema), adminAuthController.adminLogin)
router.post('/logout', adminAuthController.adminLogout)

router.use(protectAdmin)
router.get('/me', adminAuthController.getMe)

router.post(
  '/create',
  restrictTo('Super Admin'),
  validateBody(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(['Super Admin', 'Content Manager', 'Donation Manager', 'Project Manager']),
    })
  ),
  adminAuthController.createAdmin
)
router.get('/list', restrictTo('Super Admin'), adminAuthController.listAdmins)
router.patch('/:id/status', restrictTo('Super Admin'), adminAuthController.updateAdminStatus)

export default router
