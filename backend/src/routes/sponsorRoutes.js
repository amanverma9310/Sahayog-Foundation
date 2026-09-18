import express from 'express'
import * as c from '../controllers/formController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'
import { sponsorSchema } from '../validators/formValidators.js'

const router = express.Router()
router.post('/', formLimiter, validateBody(sponsorSchema), c.submitSponsorRequest)

router.use(protectAdmin, restrictTo('Super Admin', 'Donation Manager'))
router.get('/admin/all', c.getAllSponsorRequestsAdmin)
router.patch('/admin/:id/status', c.updateSponsorStatus)

export default router
