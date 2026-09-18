import express from 'express'
import * as c from '../controllers/testimonialController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getPublicTestimonials)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllTestimonialsAdmin)
router.post('/', c.createTestimonial)
router.patch('/:id', c.updateTestimonial)
router.delete('/:id', c.deleteTestimonial)

export default router
