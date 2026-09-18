import { z } from 'zod'

const email = z.string().trim().email('Enter a valid email address')
const phone = z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')

export const createOrderSchema = z.object({
  amount: z.number().min(100, 'Minimum donation is ₹100'),
  frequency: z.enum(['one-time', 'recurring']).default('one-time'),
  designation: z.enum(['general', 'project', 'campaign']).default('general'),
  projectId: z.string().optional(),
  campaignId: z.string().optional(),
  donorName: z.string().trim().min(1, 'Name is required'),
  donorEmail: email,
  donorPhone: phone,
  anonymous: z.boolean().default(false),
  wants80G: z.boolean().default(false),
  pan: z.string().trim().optional(),
})

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

export const receiptRequestSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email,
  phone,
  pan: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, 'Enter a valid PAN'),
  address: z.string().trim().min(1, 'Address is required'),
  donationId: z.string().trim().min(1, 'Donation ID is required'),
  donationAmount: z.number().min(1),
  message: z.string().optional(),
})
