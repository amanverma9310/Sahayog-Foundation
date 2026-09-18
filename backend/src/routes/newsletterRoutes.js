import express from 'express'
import * as c from '../controllers/formController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'
import { newsletterSchema } from '../validators/formValidators.js'
import { z } from 'zod'

const router = express.Router()
router.post('/subscribe', formLimiter, validateBody(newsletterSchema), c.subscribeNewsletter)
router.post('/unsubscribe', validateBody(z.object({ email: z.string().email() })), c.unsubscribeNewsletter)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllSubscribersAdmin)
router.get('/admin/export', c.exportSubscribersCSV)

export default router
