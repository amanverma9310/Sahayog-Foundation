import jwt from 'jsonwebtoken'

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export function sendTokenResponse(user, statusCode, res, extra = {}) {
  const token = signToken({ id: user._id, role: user.role })

  const cookieExpiresDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 7)
  res.cookie('token', token, {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  user.password = undefined

  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
    ...extra,
  })
}
