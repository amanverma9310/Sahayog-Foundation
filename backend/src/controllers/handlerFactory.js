import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import ApiFeatures from '../utils/apiFeatures.js'
import { sendSuccess } from '../utils/sendResponse.js'

// A small, honest CRUD factory — used for resources whose admin management
// really is just "create/read/update/delete/list with filters" (team
// members, awards, press coverage, partners, FAQs, gallery items, reports,
// testimonials). Resources with real business logic (auth, donations,
// projects w/ slugs, forms with emails) get their own hand-written
// controllers instead of being forced through this.

export function getAll(Model, { searchFields = [], populate } = {}) {
  return catchAsync(async (req, res) => {
    let query = Model.find()
    if (populate) query = query.populate(populate)

    const features = new ApiFeatures(query, req.query).filter().search(searchFields).sort().limitFields().paginate()
    const [items, total] = await Promise.all([features.query, Model.countDocuments()])

    sendSuccess(res, 200, items, { total, page: features.pagination.page, limit: features.pagination.limit })
  })
}

export function getOne(Model, { populate } = {}) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (populate) query = query.populate(populate)
    const doc = await query
    if (!doc) return next(new AppError('No document found with that ID.', 404))
    sendSuccess(res, 200, doc)
  })
}

export function createOne(Model) {
  return catchAsync(async (req, res) => {
    const doc = await Model.create(req.body)
    sendSuccess(res, 201, doc)
  })
}

export function updateOne(Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return next(new AppError('No document found with that ID.', 404))
    sendSuccess(res, 200, doc)
  })
}

export function deleteOne(Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return next(new AppError('No document found with that ID.', 404))
    res.status(204).json({ success: true, data: null })
  })
}
