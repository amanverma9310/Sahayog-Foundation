import express from 'express'
import * as c from '../controllers/teamController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()
router.get('/', c.getPublicTeam)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', c.getAllTeamAdmin)
router.post('/', c.createTeamMember)
router.patch('/:id', c.updateTeamMember)
router.delete('/:id', c.deleteTeamMember)

export default router
