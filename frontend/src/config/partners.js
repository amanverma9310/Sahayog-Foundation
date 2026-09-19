import { z } from 'zod'

export const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  logo: z.string().trim().optional(),
  website: z.string().trim().optional(),
  partnershipType: z.string().trim().min(1, 'Partnership type is required'),
  description: z.string().trim().optional(),
  startYear: z.coerce.number().optional(),
  active: z.boolean().optional(),
})

export const fields = [
  { name: 'name', label: 'Company / organization name', type: 'text', required: true },
  { name: 'partnershipType', label: 'Partnership type', type: 'text', required: true, placeholder: 'e.g. CSR Partner' },
  { name: 'logo', label: 'Logo URL', type: 'text' },
  { name: 'website', label: 'Website', type: 'text' },
  { name: 'startYear', label: 'Start year', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'active', label: 'Active partner', type: 'checkbox', default: true },
]

export const columns = [
  { key: 'name', label: 'Name' },
  { key: 'partnershipType', label: 'Type' },
  { key: 'startYear', label: 'Since' },
]
