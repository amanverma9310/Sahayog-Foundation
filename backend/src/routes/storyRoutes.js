import express from 'express'
import * as storyController from '../controllers/storyController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'

const router = express.Router()

router.get('/', storyController.getStories)
router.get('/featured', storyController.getFeaturedStories)
router.get('/slug/:slug', storyController.getStoryBySlug)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.get('/admin/all', storyController.getAllStoriesAdmin)
router.post('/', storyController.createStory)
router.patch('/:id', storyController.updateStory)
router.delete('/:id', storyController.deleteStory)

export default router
