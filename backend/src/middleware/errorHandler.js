import AppError from '../utils/AppError.js'

function handleCastErrorDB(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400)
}

function handleDuplicateFieldsDB(err) {
  const field = Object.keys(err.keyValue || {})[0]
  return new AppError(`Duplicate value for field "${field}". Please use another value.`, 400)
}

function handleValidationErrorDB(err) {
  const messages = Object.values(err.errors).map((el) => el.message)
  return new AppError(`Invalid input: ${messages.join('. ')}`, 400)
}

function handleJWTError() {
  return new AppError('Invalid session. Please log in again.', 401)
}

function handleJWTExpiredError() {
  return new AppError('Your session has expired. Please log in again.', 401)
}

// Centralized error handler. Never leaks stack traces, internal messages,
// or raw driver errors to the client in production.
export default function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    })
  }

  let error = { ...err, message: err.message, name: err.name }

  if (error.name === 'CastError') error = handleCastErrorDB(error)
  if (error.code === 11000) error = handleDuplicateFieldsDB(error)
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
  if (error.name === 'JsonWebTokenError') error = handleJWTError()
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

  if (error.isOperational) {
    return res.status(error.statusCode).json({ success: false, status: error.status, message: error.message })
  }

  // Unknown / programming error — log internally, return a generic message
  // eslint-disable-next-line no-console
  console.error('UNEXPECTED ERROR:', err)
  return res.status(500).json({ success: false, status: 'error', message: 'Something went wrong. Please try again later.' })
}

export function notFoundHandler(req, res, next) {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404))
}
