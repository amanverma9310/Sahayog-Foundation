import express from 'express'
import * as c from '../controllers/formController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'
import { volunteerSchema } from '../validators/formValidators.js'

const router = express.Router()
router.post('/', formLimiter, validateBody(volunteerSchema), c.submitVolunteerApplication)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllVolunteersAdmin)
router.patch('/admin/:id/status', c.updateVolunteerStatus)

export default router
