import { z } from 'zod'

export const schema = z.object({
  publication: z.string().trim().min(1, 'Publication is required'),
  headline: z.string().trim().min(1, 'Headline is required'),
  date: z.string().min(1, 'Date is required'),
  articleLink: z.string().trim().min(1, 'Article link is required'),
  coverImage: z.string().trim().optional(),
  description: z.string().trim().optional(),
})

export const fields = [
  { name: 'publication', label: 'Publication', type: 'text', required: true },
  { name: 'headline', label: 'Headline', type: 'text', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'articleLink', label: 'Article link', type: 'text', required: true },
  { name: 'coverImage', label: 'Cover image URL', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
]

export const columns = [
  { key: 'publication', label: 'Publication' },
  { key: 'headline', label: 'Headline' },
  { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString('en-IN') },
]
