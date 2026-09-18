import express from 'express'
import * as c from '../controllers/partnerController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getPublicPartners)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllPartnersAdmin)
router.post('/', c.createPartner)
router.patch('/:id', c.updatePartner)
router.delete('/:id', c.deletePartner)

export default router
