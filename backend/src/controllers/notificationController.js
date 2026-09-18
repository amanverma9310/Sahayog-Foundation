import catchAsync from '../utils/catchAsync.js'
import Notification from '../models/Notification.js'
import { sendSuccess } from '../utils/sendResponse.js'

export const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find().sort('-createdAt').limit(50)
  sendSuccess(res, 200, notifications)
})

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
  sendSuccess(res, 200, notification)
})

export const markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany({ read: false }, { read: true })
  sendSuccess(res, 200, null)
})
