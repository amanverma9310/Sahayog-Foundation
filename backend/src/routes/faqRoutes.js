import express from 'express'
import * as c from '../controllers/faqController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getPublicFaqs)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllFaqsAdmin)
router.post('/', c.createFaq)
router.patch('/:id', c.updateFaq)
router.delete('/:id', c.deleteFaq)

export default router
