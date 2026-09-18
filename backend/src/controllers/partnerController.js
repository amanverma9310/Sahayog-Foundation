import catchAsync from '../utils/catchAsync.js'
import Partner from '../models/Partner.js'
import * as factory from './handlerFactory.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getPublicPartners = catchAsync(async (req, res) => {
  const partners = await Partner.find({ active: true }).sort('-startYear')
  sendSuccess(res, 200, partners)
})

export const getAllPartnersAdmin = factory.getAll(Partner)
export const createPartner = factory.createOne(Partner)
export const updatePartner = factory.updateOne(Partner)
export const deletePartner = factory.deleteOne(Partner)
