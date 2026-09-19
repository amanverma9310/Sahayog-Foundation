import { z } from 'zod'

const CATEGORIES = ['Donations', '80G', 'Projects', 'Volunteering', 'Internships', 'CSR', 'Payments', 'Refunds']

export const schema = z.object({
  category: z.enum(CATEGORIES),
  question: z.string().trim().min(1, 'Question is required'),
  answer: z.string().trim().min(1, 'Answer is required'),
  order: z.coerce.number().optional(),
})

export const fields = [
  { name: 'category', label: 'Category', type: 'select', required: true, options: CATEGORIES },
  { name: 'question', label: 'Question', type: 'text', required: true },
  { name: 'answer', label: 'Answer', type: 'textarea', required: true, rows: 4 },
  { name: 'order', label: 'Display order', type: 'number', default: 0 },
]

export const columns = [
  { key: 'category', label: 'Category' },
  { key: 'question', label: 'Question' },
  { key: 'order', label: 'Order' },
]
