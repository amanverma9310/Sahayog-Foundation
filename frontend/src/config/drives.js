import { z } from 'zod'
import { listProjectsForPicker } from '../lib/api'

export const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  project: z.string().trim().min(1, 'Project is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().trim().min(1, 'Location is required'),
  description: z.string().trim().min(1, 'Description is required'),
  beneficiaries: z.coerce.number().optional(),
  volunteers: z.coerce.number().optional(),
  status: z.enum(['Scheduled', 'Ongoing', 'Completed', 'Cancelled']),
  published: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  partners: z.array(z.string()).optional(),
})

export const fields = [
  { name: 'name', label: 'Drive name', type: 'text', required: true },
  {
    name: 'project',
    label: 'Project',
    type: 'select',
    required: true,
    optionsLoader: async () => (await listProjectsForPicker()).map((p) => ({ value: p.id, label: p.title })),
  },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'location', label: 'Location', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 3 },
  { name: 'beneficiaries', label: 'Beneficiaries', type: 'number' },
  { name: 'volunteers', label: 'Volunteers', type: 'number' },
  { name: 'status', label: 'Status', type: 'select', required: true, options: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'] },
  { name: 'images', label: 'Image URLs', type: 'list', hint: 'Comma-separated image URLs. First one is used as the thumbnail.' },
  { name: 'partners', label: 'Partner names', type: 'list' },
  { name: 'published', label: 'Published (visible on the public site)', type: 'checkbox' },
]

export const columns = [
  { key: 'name', label: 'Drive' },
  { key: 'project', label: 'Project', render: (r) => r.project?.title || '—' },
  { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString('en-IN') },
  { key: 'status', label: 'Status' },
  { key: 'published', label: 'Published', render: (r) => (r.published ? 'Yes' : 'No') },
]
