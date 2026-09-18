import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import ApiFeatures from '../utils/apiFeatures.js'
import Story from '../models/Story.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getStories = catchAsync(async (req, res) => {
  const baseQuery = Story.find({ status: 'published' })
  const features = new ApiFeatures(baseQuery, req.query)
    .filter()
    .search(['title', 'excerpt', 'content'])
    .sort()
    .limitFields()
    .paginate()

  const [items, total] = await Promise.all([features.query, Story.countDocuments({ status: 'published' })])
  sendSuccess(res, 200, items, { total, page: features.pagination.page, limit: features.pagination.limit })
})

export const getFeaturedStories = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 3
  const stories = await Story.find({ status: 'published', featured: true }).sort('-publishDate').limit(limit)
  sendSuccess(res, 200, stories)
})

export const getStoryBySlug = catchAsync(async (req, res, next) => {
  const story = await Story.findOne({ slug: req.params.slug, status: 'published' }).populate('relatedProject', 'title slug')
  if (!story) return next(new AppError('Story not found.', 404))
  sendSuccess(res, 200, story)
})

// ---- Admin ----

export const getAllStoriesAdmin = catchAsync(async (req, res) => {
  const baseQuery = Story.find()
  const features = new ApiFeatures(baseQuery, req.query).filter().sort().limitFields().paginate()
  const [items, total] = await Promise.all([features.query, Story.countDocuments()])
  sendSuccess(res, 200, items, { total, page: features.pagination.page, limit: features.pagination.limit })
})

export const createStory = catchAsync(async (req, res) => {
  const story = await Story.create(req.body)
  sendSuccess(res, 201, story)
})

export const updateStory = catchAsync(async (req, res, next) => {
  const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!story) return next(new AppError('Story not found.', 404))
  sendSuccess(res, 200, story)
})

export const deleteStory = catchAsync(async (req, res, next) => {
  const story = await Story.findByIdAndDelete(req.params.id)
  if (!story) return next(new AppError('Story not found.', 404))
  res.status(204).json({ success: true, data: null })
})
