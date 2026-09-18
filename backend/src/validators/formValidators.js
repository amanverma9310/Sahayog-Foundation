import { z } from 'zod'

const email = z.string().trim().email('Enter a valid email address')
const phone = z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
const optionalUrl = z.string().url('Enter a valid URL').optional().or(z.literal(''))

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email,
  phone: z.string().trim().optional(),
  category: z.enum(['General enquiry', 'Donation enquiry', 'CSR enquiry', 'Volunteer enquiry', 'Media enquiry']),
  subject: z.string().trim().min(1, 'Subject is required'),
  message: z.string().trim().min(10, 'Message should be at least 10 characters'),
})

export const volunteerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  age: z.number().min(16).optional(),
  email,
  phone,
  city: z.string().trim().min(1, 'City is required'),
  areasOfInterest: z.array(z.string()).min(1, 'Choose at least one area'),
  availability: z.string().trim().min(1, 'Availability is required'),
  skills: z.string().optional(),
  message: z.string().optional(),
})

export const internshipSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email,
  phone,
  college: z.string().trim().min(1, 'College is required'),
  course: z.string().trim().min(1, 'Course is required'),
  year: z.string().trim().min(1, 'Year is required'),
  skills: z.string().optional(),
  motivation: z.string().trim().min(20, 'Please write at least a couple of sentences'),
  portfolio: optionalUrl,
  linkedin: optionalUrl,
})

export const csrSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required'),
  contactPerson: z.string().trim().min(1, 'Contact person is required'),
  designation: z.string().trim().min(1, 'Designation is required'),
  email,
  phone,
  website: optionalUrl,
  csrInterests: z.string().trim().min(1, 'CSR interests are required'),
  estimatedBudget: z.string().trim().min(1, 'Estimated budget is required'),
  preferredProject: z.string().optional(),
  message: z.string().optional(),
})

export const sponsorSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  organization: z.string().optional(),
  email,
  phone,
  preferredDrive: z.string().trim().min(1, 'Preferred drive is required'),
  budgetRange: z.string().trim().min(1, 'Budget range is required'),
  preferredLocation: z.string().optional(),
  expectedDate: z.string().optional(),
  message: z.string().optional(),
})

export const newsletterSchema = z.object({
  email,
  name: z.string().optional(),
})
