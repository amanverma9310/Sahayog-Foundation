import { z } from 'zod'

const email = z.string().trim().email('Enter a valid email address')
const phone = z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number').optional()

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email,
  phone,
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const adminLoginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})
