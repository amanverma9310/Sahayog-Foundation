import express from 'express'
import * as c from '../controllers/awardController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getPublicAwards)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllAwardsAdmin)
router.post('/', c.createAward)
router.patch('/:id', c.updateAward)
router.delete('/:id', c.deleteAward)

export default router
