import catchAsync from '../utils/catchAsync.js'
import Award from '../models/Award.js'
import * as factory from './handlerFactory.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getPublicAwards = catchAsync(async (req, res) => {
  const awards = await Award.find().sort('-year')
  sendSuccess(res, 200, awards)
})

export const getAllAwardsAdmin = factory.getAll(Award)
export const createAward = factory.createOne(Award)
export const updateAward = factory.updateOne(Award)
export const deleteAward = factory.deleteOne(Award)
