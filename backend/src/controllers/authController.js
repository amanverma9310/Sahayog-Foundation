import crypto from 'crypto'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import User from '../models/User.js'
import { sendTokenResponse } from '../utils/generateToken.js'
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/email.service.js'

export const register = catchAsync(async (req, res, next) => {
  const { name, email, phone, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) return next(new AppError('An account with this email already exists.', 400))

  const user = await User.create({ name, email, phone, password })

  const verifyToken = crypto.randomBytes(32).toString('hex')
  user.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex')
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000
  await user.save({ validateBeforeSave: false })

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`
  try {
    await sendVerificationEmail(user, verifyUrl)
  } catch (err) {
    console.error('Failed to send verification email:', err.message)
  }

  sendTokenResponse(user, 201, res)
})

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password +active')
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401))
  }
  if (!user.active) {
    return next(new AppError('This account has been deactivated. Contact support.', 401))
  }

  sendTokenResponse(user, 200, res)
})

export const logout = catchAsync(async (req, res) => {
  res.cookie('token', 'logged_out', { expires: new Date(Date.now() + 5000), httpOnly: true })
  res.status(200).json({ success: true, data: null })
})

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } })
})

export const updateMe = catchAsync(async (req, res, next) => {
  const { password } = req.body
  if (password) return next(new AppError('This endpoint is not for password updates. Use /update-password.', 400))

  const allowedFields = ['name', 'phone', 'address', 'pan']
  const updates = {}
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field]
  })

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
  res.status(200).json({ success: true, data: { user } })
})

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new AppError('Your current password is incorrect.', 401))
  }
  user.password = req.body.newPassword
  await user.save()
  sendTokenResponse(user, 200, res)
})

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  // Always respond success even if no account exists, to avoid leaking
  // which emails are registered.
  if (!user) {
    return res.status(200).json({ success: true, message: 'If an account exists, a reset link has been sent.' })
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
  try {
    await sendPasswordResetEmail(user, resetUrl)
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })
    return next(new AppError('There was an error sending the email. Please try again later.', 500))
  }

  res.status(200).json({ success: true, message: 'If an account exists, a reset link has been sent.' })
})

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!user) return next(new AppError('Token is invalid or has expired.', 400))

  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  sendTokenResponse(user, 200, res)
})

export const verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  })

  if (!user) return next(new AppError('Verification link is invalid or has expired.', 400))

  user.emailVerified = true
  user.emailVerificationToken = undefined
  user.emailVerificationExpires = undefined
  await user.save({ validateBeforeSave: false })

  res.status(200).json({ success: true, message: 'Email verified successfully.' })
})
