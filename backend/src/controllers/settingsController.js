import catchAsync from '../utils/catchAsync.js'
import SiteSetting from '../models/SiteSetting.js'
import Campaign from '../models/Campaign.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getSiteSettings = catchAsync(async (req, res) => {
  let settings = await SiteSetting.findOne({ key: 'global' })
    .populate('featuredProjectIds')
    .populate('featuredStoryIds')
    .populate('activeCampaignId')
  if (!settings) {
    settings = await SiteSetting.create({ key: 'global' })
  }
  sendSuccess(res, 200, settings)
})

export const updateSiteSettings = catchAsync(async (req, res) => {
  const settings = await SiteSetting.findOneAndUpdate({ key: 'global' }, req.body, {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  })
  sendSuccess(res, 200, settings)
})

export const getActiveCampaign = catchAsync(async (req, res) => {
  const campaign = await Campaign.findOne({ active: true }).sort('-createdAt')
  sendSuccess(res, 200, campaign)
})
