import express from 'express'
import * as c from '../controllers/campaignController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getPublicCampaigns)
router.get('/slug/:slug', c.getCampaignBySlug)

router.use(protectAdmin, restrictTo('Super Admin', 'Donation Manager'))
router.get('/admin/all', c.getAllCampaignsAdmin)
router.post('/', c.createCampaign)
router.patch('/:id', c.updateCampaign)
router.delete('/:id', c.deleteCampaign)

export default router
