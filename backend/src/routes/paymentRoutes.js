import express from 'express'
import * as paymentController from '../controllers/paymentController.js'
import { protect, protectAdmin, restrictTo } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { createOrderSchema, verifyPaymentSchema } from '../validators/donationValidators.js'

const router = express.Router()

// NOTE: the /webhook route is mounted separately in app.js with
// express.raw() BEFORE the JSON body parser, since webhook signature
// verification needs the exact raw request bytes. It is intentionally not
// redefined here to avoid double-mounting.

router.post('/create-order', validateBody(createOrderSchema), paymentController.createOrder)
router.post('/verify', validateBody(verifyPaymentSchema), paymentController.verifyPayment)

router.get('/my-donations', protect, paymentController.getMyDonations)

router.get(
  '/admin/all',
  protectAdmin,
  restrictTo('Super Admin', 'Donation Manager'),
  paymentController.getAllDonationsAdmin
)

export default router
