import express from 'express'
import * as c from '../controllers/dashboardController.js'
import { protectAdmin } from '../middleware/auth.js'

const router = express.Router()
router.use(protectAdmin)
router.get('/stats', c.getDashboardStats)
router.get('/donation-trends', c.getDonationTrends)

export default router
