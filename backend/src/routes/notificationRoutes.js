import express from 'express'
import * as c from '../controllers/notificationController.js'
import { protectAdmin } from '../middleware/auth.js'

const router = express.Router()
router.use(protectAdmin)
router.get('/', c.getNotifications)
router.patch('/:id/read', c.markAsRead)
router.patch('/read-all', c.markAllAsRead)

export default router
