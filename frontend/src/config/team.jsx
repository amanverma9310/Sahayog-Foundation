import { z } from 'zod'

export const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  position: z.string().trim().min(1, 'Position is required'),
  photo: z.string().trim().min(1, 'Photo URL is required'),
  bio: z.string().trim().min(1, 'Bio is required'),
  linkedin: z.string().trim().optional(),
  email: z.string().trim().optional(),
  order: z.coerce.number().optional(),
})

export const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'position', label: 'Position', type: 'text', required: true },
  { name: 'photo', label: 'Photo URL', type: 'text', required: true, placeholder: 'https://…' },
  { name: 'bio', label: 'Bio', type: 'textarea', required: true, rows: 3 },
  { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
  { name: 'email', label: 'Public email (optional)', type: 'text' },
  { name: 'order', label: 'Display order', type: 'number', default: 0 },
]

export const columns = [
  { key: 'photo', label: '', render: (r) => <img src={r.photo} alt="" className="h-9 w-9 rounded-full object-cover" /> },
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'order', label: 'Order' },
]
