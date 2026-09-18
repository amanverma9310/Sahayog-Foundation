import catchAsync from '../utils/catchAsync.js'
import Campaign from '../models/Campaign.js'
import * as factory from './handlerFactory.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getPublicCampaigns = catchAsync(async (req, res) => {
  const campaigns = await Campaign.find({ active: true }).sort('-createdAt')
  sendSuccess(res, 200, campaigns)
})

export const getCampaignBySlug = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findOne({ slug: req.params.slug })
  sendSuccess(res, 200, campaign)
})

export const getAllCampaignsAdmin = factory.getAll(Campaign)
export const createCampaign = factory.createOne(Campaign)
export const updateCampaign = factory.updateOne(Campaign)
export const deleteCampaign = factory.deleteOne(Campaign)
