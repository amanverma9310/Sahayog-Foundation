import catchAsync from '../utils/catchAsync.js'
import Faq from '../models/Faq.js'
import * as factory from './handlerFactory.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getPublicFaqs = catchAsync(async (req, res) => {
  const filter = { published: true }
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category
  const faqs = await Faq.find(filter).sort('order')
  sendSuccess(res, 200, faqs)
})

export const getAllFaqsAdmin = factory.getAll(Faq)
export const createFaq = factory.createOne(Faq)
export const updateFaq = factory.updateOne(Faq)
export const deleteFaq = factory.deleteOne(Faq)
