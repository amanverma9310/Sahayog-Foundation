import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import ImpactStat from '../models/ImpactStat.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getImpactStats = catchAsync(async (req, res) => {
  const stats = await ImpactStat.find().sort('order')
  sendSuccess(res, 200, stats)
})

export const getAllImpactStatsAdmin = getImpactStats

export const upsertImpactStat = catchAsync(async (req, res) => {
  const { key, label, value, suffix, order } = req.body
  const stat = await ImpactStat.findOneAndUpdate(
    { key },
    { key, label, value, suffix, order },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  )
  sendSuccess(res, 200, stat)
})

export const deleteImpactStat = catchAsync(async (req, res, next) => {
  const stat = await ImpactStat.findByIdAndDelete(req.params.id)
  if (!stat) return next(new AppError('Impact stat not found.', 404))
  res.status(204).json({ success: true, data: null })
})
