import express from 'express'
import * as c from '../controllers/settingsController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getSiteSettings)
router.get('/active-campaign', c.getActiveCampaign)

router.patch('/', protectAdmin, restrictTo('Super Admin'), c.updateSiteSettings)

export default router
