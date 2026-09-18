import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import User from '../models/User.js'
import Admin from '../models/Admin.js'

// Verifies the JWT and attaches the authenticated principal (donor user or
// admin) to req.user / req.admin. Never trusts a role or identity claimed
// only by the frontend — everything here is re-derived from the verified
// token and a fresh database lookup.
export const protect = catchAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to continue.', 401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401))
  }
  if (currentUser.changedPasswordAfter?.(decoded.iat)) {
    return next(new AppError('Password was recently changed. Please log in again.', 401))
  }

  req.user = currentUser
  next()
})

// Separate guard for the admin panel — admins and donor users are distinct
// collections so a compromised donor token can never touch admin routes.
export const protectAdmin = catchAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.adminToken) {
    token = req.cookies.adminToken
  }

  if (!token) {
    return next(new AppError('Admin authentication required.', 401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const admin = await Admin.findById(decoded.id)
  if (!admin || !admin.active) {
    return next(new AppError('Admin account not found or deactivated.', 401))
  }

  req.admin = admin
  next()
})

// Usage: restrictTo('Super Admin', 'Content Manager')
export function restrictTo(...roles) {
  return (req, res, next) => {
    const role = req.admin?.role
    if (!role || !roles.includes(role)) {
      return next(new AppError('You do not have permission to perform this action.', 403))
    }
    next()
  }
}
