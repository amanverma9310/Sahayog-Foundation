import { z } from 'zod'

const requiredString = (label) => z.string().trim().min(1, `${label} is required`)
const email = z.string().trim().email('Enter a valid email address')
const phone = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')

export const donationSchema = z
  .object({
    amount: z.number({ invalid_type_error: 'Enter an amount' }).min(100, 'Minimum donation is ₹100'),
    frequency: z.enum(['one-time', 'recurring']),
    designation: z.enum(['general', 'project', 'campaign']),
    projectId: z.string().optional(),
    fullName: requiredString('Full name'),
    email,
    phone,
    wants80G: z.boolean(),
    pan: z.string().optional(),
    anonymous: z.boolean(),
    consent: z.literal(true, { errorMap: () => ({ message: 'Please accept to continue' }) }),
  })
  .refine((data) => !data.wants80G || (data.pan && /^[A-Z]{5}\d{4}[A-Z]$/.test(data.pan)), {
    message: 'A valid PAN is required for an 80G receipt',
    path: ['pan'],
  })

export const contactSchema = z.object({
  name: requiredString('Name'),
  email,
  phone: z.string().trim().optional(),
  category: requiredString('Category'),
  subject: requiredString('Subject'),
  message: requiredString('Message').min(10, 'Tell us a little more (10+ characters)'),
})

export const volunteerSchema = z.object({
  name: requiredString('Name'),
  email,
  phone,
  city: requiredString('City'),
  areasOfInterest: z.array(z.string()).min(1, 'Choose at least one area'),
  availability: requiredString('Availability'),
  skills: z.string().optional(),
  message: z.string().optional(),
})

export const internshipSchema = z.object({
  name: requiredString('Name'),
  email,
  phone,
  college: requiredString('College'),
  course: requiredString('Course'),
  year: requiredString('Year'),
  skills: z.string().optional(),
  motivation: requiredString('This field').min(20, 'Please write at least a couple of sentences'),
  portfolio: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

export const csrSchema = z.object({
  companyName: requiredString('Company name'),
  contactPerson: requiredString('Contact person'),
  designation: requiredString('Designation'),
  email,
  phone,
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  csrInterests: requiredString('CSR interests'),
  estimatedBudget: requiredString('Estimated budget'),
  preferredProject: z.string().optional(),
  message: z.string().optional(),
})

export const sponsorSchema = z.object({
  name: requiredString('Name'),
  organization: z.string().optional(),
  email,
  phone,
  preferredDrive: requiredString('Preferred drive'),
  budgetRange: requiredString('Budget range'),
  preferredLocation: z.string().optional(),
  expectedDate: z.string().optional(),
  message: z.string().optional(),
})

export const receiptRequestSchema = z.object({
  fullName: requiredString('Full name'),
  email,
  phone,
  pan: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, 'Enter a valid PAN (e.g. AAAAA1234A)'),
  address: requiredString('Address'),
  donationId: requiredString('Donation ID / transaction reference'),
  donationAmount: z.number({ invalid_type_error: 'Enter the donation amount' }).min(1),
  message: z.string().optional(),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z
  .object({
    name: requiredString('Name'),
    email,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
