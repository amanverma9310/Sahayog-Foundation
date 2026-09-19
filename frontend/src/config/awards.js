import { z } from 'zod'

export const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  organization: z.string().trim().min(1, 'Organization is required'),
  year: z.coerce.number({ invalid_type_error: 'Year is required' }),
  description: z.string().trim().optional(),
  externalLink: z.string().trim().optional(),
})

export const fields = [
  { name: 'name', label: 'Award name', type: 'text', required: true },
  { name: 'organization', label: 'Organization', type: 'text', required: true },
  { name: 'year', label: 'Year', type: 'number', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'externalLink', label: 'External link', type: 'text' },
]

export const columns = [
  { key: 'name', label: 'Award' },
  { key: 'organization', label: 'Organization' },
  { key: 'year', label: 'Year' },
]
