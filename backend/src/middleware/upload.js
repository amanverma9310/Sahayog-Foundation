import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'
import AppError from '../utils/AppError.js'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf']

function makeStorage(folder, resourceType = 'image') {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `sahayog/${folder}`,
      resource_type: resourceType,
      // Automatic format + quality optimisation; Cloudinary serves
      // WebP/AVIF to supporting browsers without us managing variants.
      transformation: resourceType === 'image' ? [{ quality: 'auto', fetch_format: 'auto' }] : undefined,
    },
  })
}

function fileFilter(allowedTypes, maxSizeLabel) {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new AppError(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`, 400), false)
    }
    cb(null, true)
  }
}

// Images (gallery, project photos, team photos, awards, press logos)
export const uploadImage = multer({
  storage: makeStorage('images'),
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

// PDF documents (reports, certificates, resumes)
export const uploadDocument = multer({
  storage: makeStorage('documents', 'raw'),
  fileFilter: fileFilter(ALLOWED_DOCUMENT_TYPES),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

// Resumes specifically — PDF only, smaller cap
export const uploadResume = multer({
  storage: makeStorage('resumes', 'raw'),
  fileFilter: fileFilter(ALLOWED_DOCUMENT_TYPES),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
})
