import express from 'express'
import * as c from '../controllers/impactController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getImpactStats)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllImpactStatsAdmin)
router.put('/', c.upsertImpactStat)
router.delete('/:id', c.deleteImpactStat)

export default router
