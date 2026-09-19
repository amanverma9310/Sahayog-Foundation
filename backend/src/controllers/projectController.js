import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import ApiFeatures from '../utils/apiFeatures.js'
import Project from '../models/Project.js'
import Drive from '../models/Drive.js'
import Story from '../models/Story.js'
import Testimonial from '../models/Testimonial.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getProjects = catchAsync(async (req, res) => {
  const baseQuery = Project.find({ published: true })
  const features = new ApiFeatures(baseQuery, req.query)
    .filter()
    .search(['title', 'shortDescription'])
    .sort()
    .limitFields()
    .paginate()

  const [items, total] = await Promise.all([features.query, Project.countDocuments({ published: true })])
  sendSuccess(res, 200, items, { total, page: features.pagination.page, limit: features.pagination.limit })
})

export const getFeaturedProjects = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 3
  const projects = await Project.find({ published: true }).sort('-createdAt').limit(limit)
  sendSuccess(res, 200, projects)
})

export const getProjectBySlug = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ slug: req.params.slug, published: true }).populate('testimonialIds')
  if (!project) return next(new AppError('Project not found.', 404))

  const [drives, stories] = await Promise.all([
    Drive.find({ project: project._id, published: true }).sort('-date'),
    Story.find({ relatedProject: project._id, status: 'published' }),
  ])

  sendSuccess(res, 200, { ...project.toObject(), relatedDrives: drives, relatedStories: stories })
})

// ---- Admin ----

export const getAllProjectsAdmin = catchAsync(async (req, res) => {
  const baseQuery = Project.find()
  const features = new ApiFeatures(baseQuery, req.query)
    .filter()
    .search(['title', 'shortDescription'])
    .sort()
    .limitFields()
    .paginate()

  const [items, total] = await Promise.all([features.query, Project.countDocuments()])
  sendSuccess(res, 200, items, { total, page: features.pagination.page, limit: features.pagination.limit })
})

export const getProjectByIdAdmin = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
  if (!project) return next(new AppError('Project not found.', 404))
  sendSuccess(res, 200, project)
})

export const createProject = catchAsync(async (req, res) => {
  const project = await Project.create(req.body)
  sendSuccess(res, 201, project)
})

export const updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!project) return next(new AppError('Project not found.', 404))
  sendSuccess(res, 200, project)
})

export const deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) return next(new AppError('Project not found.', 404))
  res.status(204).json({ success: true, data: null })
})

export const addTimelineEvent = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
  if (!project) return next(new AppError('Project not found.', 404))
  project.timeline.push(req.body)
  await project.save()
  sendSuccess(res, 201, project.timeline)
})

export const updateTimelineEvent = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
  if (!project) return next(new AppError('Project not found.', 404))
  const event = project.timeline.id(req.params.eventId)
  if (!event) return next(new AppError('Timeline event not found.', 404))
  Object.assign(event, req.body)
  await project.save()
  sendSuccess(res, 200, project.timeline)
})

export const deleteTimelineEvent = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
  if (!project) return next(new AppError('Project not found.', 404))
  project.timeline.id(req.params.eventId)?.deleteOne()
  await project.save()
  sendSuccess(res, 200, project.timeline)
})
