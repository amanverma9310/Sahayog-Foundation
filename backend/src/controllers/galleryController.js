import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import ApiFeatures from '../utils/apiFeatures.js'
import GalleryItem from '../models/GalleryItem.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getGallery = catchAsync(async (req, res) => {
  const filter = {}
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category
  if (req.query.year) filter.year = Number(req.query.year)
  if (req.query.project) filter.project = req.query.project

  const baseQuery = GalleryItem.find(filter).populate('project', 'title slug')
  const features = new ApiFeatures(baseQuery, req.query).sort().paginate()
  const [items, total] = await Promise.all([features.query, GalleryItem.countDocuments(filter)])
  sendSuccess(res, 200, items, { total })
})

export const createGalleryItem = catchAsync(async (req, res) => {
  const data = { ...req.body }
  if (req.file) data.image = req.file.path
  const item = await GalleryItem.create(data)
  sendSuccess(res, 201, item)
})

export const updateGalleryItem = catchAsync(async (req, res, next) => {
  const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!item) return next(new AppError('Gallery item not found.', 404))
  sendSuccess(res, 200, item)
})

export const deleteGalleryItem = catchAsync(async (req, res, next) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id)
  if (!item) return next(new AppError('Gallery item not found.', 404))
  res.status(204).json({ success: true, data: null })
})
