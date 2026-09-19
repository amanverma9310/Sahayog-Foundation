import { z } from 'zod'
import { listProjectsForPicker } from '../lib/api'

const CATEGORIES = ['Impact Stories', 'Field Reports', 'Research', 'Announcements', 'Volunteer Stories', 'Drive Reports', 'NGO Updates']

export const schema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  coverImage: z.string().trim().min(1, 'Cover image URL is required'),
  excerpt: z.string().trim().min(1, 'Excerpt is required').max(300, 'Keep the excerpt under 300 characters'),
  content: z.string().trim().min(1, 'Content is required'),
  author: z.string().trim().min(1, 'Author is required'),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()).optional(),
  publishDate: z.string().optional(),
  relatedProject: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'published']),
})

export const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: CATEGORIES },
  { name: 'coverImage', label: 'Cover image URL', type: 'text', required: true },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true, rows: 2 },
  { name: 'content', label: 'Content', type: 'textarea', required: true, rows: 8 },
  { name: 'author', label: 'Author', type: 'text', required: true },
  { name: 'tags', label: 'Tags', type: 'list' },
  { name: 'publishDate', label: 'Publish date', type: 'date' },
  {
    name: 'relatedProject',
    label: 'Related project (optional)',
    type: 'select',
    optionsLoader: async () => (await listProjectsForPicker()).map((p) => ({ value: p.id, label: p.title })),
  },
  { name: 'status', label: 'Status', type: 'select', required: true, options: ['draft', 'published'] },
  { name: 'featured', label: 'Featured on homepage', type: 'checkbox' },
]

export const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'featured', label: 'Featured', render: (r) => (r.featured ? 'Yes' : 'No') },
]
