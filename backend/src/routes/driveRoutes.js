import express from 'express'
import * as driveController from '../controllers/driveController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()

router.get('/', driveController.getDrives)
router.get('/:id', driveController.getDriveById)

router.use(protectAdmin, restrictTo('Super Admin', 'Project Manager'))
router.get('/admin/all', driveController.getAllDrivesAdmin)
router.post('/', driveController.createDrive)
router.patch('/:id', driveController.updateDrive)
router.delete('/:id', driveController.deleteDrive)

export default router
