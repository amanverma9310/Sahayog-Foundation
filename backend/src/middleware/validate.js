import AppError from '../utils/AppError.js'

// Validates req.body against a Zod schema. Keeps controllers free of
// validation boilerplate and guarantees bad input never reaches Mongoose.
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      return next(new AppError(message, 400))
    }
    req.body = result.data
    next()
  }
}
