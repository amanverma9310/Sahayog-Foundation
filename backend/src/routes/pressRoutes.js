import express from 'express'
import * as c from '../controllers/pressController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getPublicPress)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllPressAdmin)
router.post('/', c.createPress)
router.patch('/:id', c.updatePress)
router.delete('/:id', c.deletePress)

export default router
