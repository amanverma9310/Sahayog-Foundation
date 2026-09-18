import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import Admin from '../models/Admin.js'
import { signToken } from '../utils/generateToken.js'

export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  const admin = await Admin.findOne({ email }).select('+password')
  if (!admin || !(await admin.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401))
  }
  if (!admin.active) {
    return next(new AppError('This admin account has been deactivated.', 401))
  }

  admin.lastLoginAt = new Date()
  await admin.save({ validateBeforeSave: false })

  const token = signToken({ id: admin._id, role: admin.role })

  const cookieExpiresDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 7)
  res.cookie('adminToken', token, {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  admin.password = undefined
  res.status(200).json({ success: true, token, data: { admin } })
})

export const adminLogout = catchAsync(async (req, res) => {
  res.cookie('adminToken', 'logged_out', { expires: new Date(Date.now() + 5000), httpOnly: true })
  res.status(200).json({ success: true, data: null })
})

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, data: { admin: req.admin } })
})

// Only a Super Admin can create other admin accounts.
export const createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body
  const existing = await Admin.findOne({ email })
  if (existing) return next(new AppError('An admin with this email already exists.', 400))

  const admin = await Admin.create({ name, email, password, role })
  admin.password = undefined
  res.status(201).json({ success: true, data: { admin } })
})

export const listAdmins = catchAsync(async (req, res) => {
  const admins = await Admin.find().select('-password')
  res.status(200).json({ success: true, data: admins })
})

export const updateAdminStatus = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndUpdate(req.params.id, { active: req.body.active }, { new: true }).select('-password')
  if (!admin) return next(new AppError('Admin not found.', 404))
  res.status(200).json({ success: true, data: admin })
})
