import catchAsync from '../utils/catchAsync.js'
import PressCoverage from '../models/PressCoverage.js'
import * as factory from './handlerFactory.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getPublicPress = catchAsync(async (req, res) => {
  const press = await PressCoverage.find().sort('-date')
  sendSuccess(res, 200, press)
})

export const getAllPressAdmin = factory.getAll(PressCoverage)
export const createPress = factory.createOne(PressCoverage)
export const updatePress = factory.updateOne(PressCoverage)
export const deletePress = factory.deleteOne(PressCoverage)
