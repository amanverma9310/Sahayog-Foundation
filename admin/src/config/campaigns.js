import { z } from 'zod'

export const schema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  image: z.string().trim().min(1, 'Image URL is required'),
  fundingTarget: z.coerce.number({ invalid_type_error: 'Funding target is required' }),
  active: z.boolean().optional(),
  endDate: z.string().optional(),
})

export const fields = [
  { name: 'title', label: 'Campaign title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 3 },
  { name: 'image', label: 'Image URL', type: 'text', required: true },
  { name: 'fundingTarget', label: 'Funding target (₹)', type: 'number', required: true },
  { name: 'endDate', label: 'End date', type: 'date' },
  { name: 'active', label: 'Active (shown as the site-wide campaign)', type: 'checkbox' },
]

export const columns = [
  { key: 'title', label: 'Title' },
  { key: 'fundingTarget', label: 'Target', render: (r) => `₹${r.fundingTarget?.toLocaleString('en-IN')}` },
  { key: 'amountRaised', label: 'Raised', render: (r) => `₹${(r.amountRaised || 0).toLocaleString('en-IN')}` },
  { key: 'active', label: 'Active' },
]
