import catchAsync from '../utils/catchAsync.js'
import Testimonial from '../models/Testimonial.js'
import * as factory from './handlerFactory.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getPublicTestimonials = catchAsync(async (req, res) => {
  const filter = { published: true }
  if (req.query.type) filter.type = req.query.type
  if (req.query.featured) filter.featured = true
  const testimonials = await Testimonial.find(filter).populate('relatedProject', 'title slug').sort('-createdAt')
  sendSuccess(res, 200, testimonials)
})

export const getAllTestimonialsAdmin = factory.getAll(Testimonial)
export const createTestimonial = factory.createOne(Testimonial)
export const updateTestimonial = factory.updateOne(Testimonial)
export const deleteTestimonial = factory.deleteOne(Testimonial)
