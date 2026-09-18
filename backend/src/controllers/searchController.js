import catchAsync from '../utils/catchAsync.js'
import Project from '../models/Project.js'
import Story from '../models/Story.js'
import Campaign from '../models/Campaign.js'
import Report from '../models/Report.js'
import { sendSuccess } from '../utils/sendResponse.js'

// Global search across the content types a visitor might reasonably look
// for. Kept simple ($regex on indexed text fields) rather than requiring
// a search service — adequate at this content scale, and swappable for
// Atlas Search later without changing the response shape.
export const globalSearch = catchAsync(async (req, res) => {
  const q = (req.query.q || '').trim()
  if (!q) {
    return sendSuccess(res, 200, { projects: [], stories: [], campaigns: [], reports: [] })
  }
  const regex = new RegExp(q, 'i')

  const [projects, stories, campaigns, reports] = await Promise.all([
    Project.find({ published: true, $or: [{ title: regex }, { shortDescription: regex }] }).limit(6),
    Story.find({ status: 'published', $or: [{ title: regex }, { excerpt: regex }] }).limit(6),
    Campaign.find({ active: true, title: regex }).limit(4),
    Report.find({ published: true, title: regex }).limit(4),
  ])

  sendSuccess(res, 200, { projects, stories, campaigns, reports })
})
