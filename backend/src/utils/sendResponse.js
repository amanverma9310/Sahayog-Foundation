export function sendSuccess(res, statusCode, data, meta = {}) {
  res.status(statusCode).json({ success: true, data, ...meta })
}
