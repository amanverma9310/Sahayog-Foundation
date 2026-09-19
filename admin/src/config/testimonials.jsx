import { z } from 'zod'
import Badge from '../components/ui/Badge'

export const schema = z.object({
  type: z.enum(['Beneficiary', 'Volunteer', 'Donor', 'Corporate partner', 'Intern']),
  name: z.string().trim().min(1, 'Name is required'),
  role: z.string().trim().min(1, 'Role is required'),
  photo: z.string().trim().optional(),
  quote: z.string().trim().min(1, 'Quote is required'),
  featured: z.boolean().optional(),
})

export const fields = [
  { name: 'type', label: 'Type', type: 'select', required: true, options: ['Beneficiary', 'Volunteer', 'Donor', 'Corporate partner', 'Intern'] },
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'e.g. Parent, Govindpuri' },
  { name: 'photo', label: 'Photo URL', type: 'text', placeholder: 'https://…' },
  { name: 'quote', label: 'Quote', type: 'textarea', required: true, rows: 3 },
  { name: 'featured', label: 'Featured on homepage', type: 'checkbox' },
]

export const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'quote', label: 'Quote', render: (r) => <span className="line-clamp-1 max-w-xs">{r.quote}</span> },
  { key: 'featured', label: 'Featured', render: (r) => (r.featured ? <Badge tone="green">Yes</Badge> : <Badge>No</Badge>) },
]
