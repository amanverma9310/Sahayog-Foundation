import express from 'express'
import * as c from '../controllers/formController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'
import { contactSchema } from '../validators/formValidators.js'
import { z } from 'zod'

const router = express.Router()
router.post('/', formLimiter, validateBody(contactSchema), c.submitContactForm)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllContactMessagesAdmin)
router.patch(
  '/admin/:id/status',
  validateBody(z.object({ status: z.enum(['New', 'Read', 'Replied', 'Resolved']) })),
  c.updateContactMessageStatus
)

export default router
