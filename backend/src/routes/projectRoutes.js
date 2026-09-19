import express from 'express'
import * as projectController from '../controllers/projectController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()

// Public
router.get('/', projectController.getProjects)
router.get('/featured', projectController.getFeaturedProjects)
router.get('/slug/:slug', projectController.getProjectBySlug)

// Admin
router.use(protectAdmin, restrictTo('Super Admin', 'Project Manager'))
router.get('/admin/all', projectController.getAllProjectsAdmin)
router.get('/admin/:id', projectController.getProjectByIdAdmin)
router.post('/', projectController.createProject)
router.patch('/:id', projectController.updateProject)
router.delete('/:id', projectController.deleteProject)
router.post('/:id/timeline', projectController.addTimelineEvent)
router.patch('/:id/timeline/:eventId', projectController.updateTimelineEvent)
router.delete('/:id/timeline/:eventId', projectController.deleteTimelineEvent)

export default router
