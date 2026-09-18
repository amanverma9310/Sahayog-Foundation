import express from 'express'
import * as receiptController from '../controllers/receiptController.js'
import { protect, protectAdmin, restrictTo } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'
import { receiptRequestSchema } from '../validators/donationValidators.js'
import { z } from 'zod'

const router = express.Router()

router.post('/request', formLimiter, validateBody(receiptRequestSchema), receiptController.createReceiptRequest)
router.get('/my-requests', protect, receiptController.getMyReceiptRequests)

router.use(protectAdmin, restrictTo('Super Admin', 'Donation Manager'))
router.get('/admin/all', receiptController.getAllReceiptRequestsAdmin)
router.patch(
  '/admin/:id/status',
  validateBody(
    z.object({
      status: z.enum(['Pending', 'Under Review', 'Approved', 'Rejected', 'Certificate Generated', 'Sent']),
      adminNotes: z.string().optional(),
    })
  ),
  receiptController.updateReceiptRequestStatus
)
router.post('/admin/:id/generate-certificate', receiptController.generateCertificate)

export default router
