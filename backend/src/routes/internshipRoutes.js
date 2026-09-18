import express from 'express'
import * as c from '../controllers/formController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'
import { internshipSchema } from '../validators/formValidators.js'
import { uploadResume } from '../middleware/upload.js'

const router = express.Router()
router.post(
  '/',
  formLimiter,
  uploadResume.single('resume'),
  validateBody(internshipSchema),
  c.submitInternshipApplication
)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllInternshipsAdmin)
router.patch('/admin/:id/status', c.updateInternshipStatus)

export default router
