import catchAsync from '../utils/catchAsync.js'
import Report from '../models/Report.js'
import * as factory from './handlerFactory.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getPublicReports = catchAsync(async (req, res) => {
  const reports = await Report.find({ published: true }).sort('-createdAt')
  sendSuccess(res, 200, reports)
})

export const getAllReportsAdmin = factory.getAll(Report)

export const createReport = catchAsync(async (req, res) => {
  const data = { ...req.body }
  if (req.file) data.fileUrl = req.file.path
  const report = await Report.create(data)
  sendSuccess(res, 201, report)
})

export const updateReport = factory.updateOne(Report)
export const deleteReport = factory.deleteOne(Report)
