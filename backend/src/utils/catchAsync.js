// Wraps async route handlers so rejected promises are forwarded to the
// centralized error handler instead of crashing the process.
export default function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
