import express from 'express'
import * as galleryController from '../controllers/galleryController.js'
import { protectAdmin, restrictTo } from '../middleware/auth.js'
import { uploadImage } from '../middleware/upload.js'

const router = express.Router()

router.get('/', galleryController.getGallery)

router.use(protectAdmin, restrictTo('Super Admin', 'Content Manager'))
router.post('/', uploadImage.single('image'), galleryController.createGalleryItem)
router.patch('/:id', galleryController.updateGalleryItem)
router.delete('/:id', galleryController.deleteGalleryItem)

export default router
