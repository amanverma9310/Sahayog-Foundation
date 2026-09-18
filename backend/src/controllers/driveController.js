import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import ApiFeatures from '../utils/apiFeatures.js'
import Drive from '../models/Drive.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getDrives = catchAsync(async (req, res) => {
  const { project, location, year } = req.query
  const filter = { published: true }
  if (project) filter.project = project
  if (location) filter.location = { $regex: location, $options: 'i' }
  if (year) {
    filter.date = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
  }

  const baseQuery = Drive.find(filter).populate('project', 'title slug category')
  const features = new ApiFeatures(baseQuery, req.query).sort().limitFields().paginate()
  const [items, total] = await Promise.all([features.query, Drive.countDocuments(filter)])
  sendSuccess(res, 200, items, { total, page: features.pagination.page, limit: features.pagination.limit })
})

export const getDriveById = catchAsync(async (req, res, next) => {
  const drive = await Drive.findById(req.params.id).populate('project', 'title slug')
  if (!drive) return next(new AppError('Drive not found.', 404))
  sendSuccess(res, 200, drive)
})

// ---- Admin ----

export const getAllDrivesAdmin = catchAsync(async (req, res) => {
  const baseQuery = Drive.find().populate('project', 'title slug')
  const features = new ApiFeatures(baseQuery, req.query).filter().sort().limitFields().paginate()
  const [items, total] = await Promise.all([features.query, Drive.countDocuments()])
  sendSuccess(res, 200, items, { total, page: features.pagination.page, limit: features.pagination.limit })
})

export const createDrive = catchAsync(async (req, res) => {
  const drive = await Drive.create(req.body)
  sendSuccess(res, 201, drive)
})

export const updateDrive = catchAsync(async (req, res, next) => {
  const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!drive) return next(new AppError('Drive not found.', 404))
  sendSuccess(res, 200, drive)
})

export const deleteDrive = catchAsync(async (req, res, next) => {
  const drive = await Drive.findByIdAndDelete(req.params.id)
  if (!drive) return next(new AppError('Drive not found.', 404))
  res.status(204).json({ success: true, data: null })
})
