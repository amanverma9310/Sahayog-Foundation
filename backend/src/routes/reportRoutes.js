import express from 'express'
import * as c from '../controllers/reportController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'
import { uploadDocument } from '../middleware/upload.js'

const router = express.Router()
router.get('/', c.getPublicReports)

router.use(protectAdmin, restrictTo('Super Admin', 'Donation Manager'))
router.get('/admin/all', c.getAllReportsAdmin)
router.post('/', uploadDocument.single('file'), c.createReport)
router.patch('/:id', c.updateReport)
router.delete('/:id', c.deleteReport)

export default router
