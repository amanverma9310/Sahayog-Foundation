import catchAsync from '../utils/catchAsync.js'
import TeamMember from '../models/TeamMember.js'
import * as factory from './handlerFactory.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getPublicTeam = catchAsync(async (req, res) => {
  const team = await TeamMember.find({ active: true }).sort('order')
  sendSuccess(res, 200, team)
})

export const getAllTeamAdmin = factory.getAll(TeamMember)
export const createTeamMember = factory.createOne(TeamMember)
export const updateTeamMember = factory.updateOne(TeamMember)
export const deleteTeamMember = factory.deleteOne(TeamMember)
