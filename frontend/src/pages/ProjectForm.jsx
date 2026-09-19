import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { TextField, NumberField, DateField, TextAreaField, SelectField, CheckboxField, ListField } from '../components/ui/FormField'
import { projectsApi } from '../lib/api'

const CATEGORIES = ['Education', 'Food Relief', 'Healthcare', 'Women Empowerment', 'Winter Relief', 'Environment', 'Community Development', 'Disaster Relief']
const STATUSES = ['Ongoing', 'Completed', 'Upcoming', 'Seasonal']

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  category: z.enum(CATEGORIES),
  location: z.string().trim().min(1, 'Location is required'),
  status: z.enum(STATUSES),
  startDate: z.string().min(1, 'Start date is required'),
  shortDescription: z.string().trim().min(1, 'Short description is required').max(280, 'Keep this under 280 characters'),
  fullDescription: z.string().trim().min(1, 'Full description is required'),
  problem: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  heroImage: z.string().trim().min(1, 'Hero image URL is required'),
  gallery: z.string().optional(),
  fundingTarget: z.coerce.number({ invalid_type_error: 'Funding target is required' }).min(0),
  amountRaised: z.coerce.number().optional(),
  donorCount: z.coerce.number().optional(),
  beneficiaries: z.coerce.number().optional(),
  objectives: z.string().optional(),
  whatWeProvide: z.string().optional(),
  published: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

const baseFields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: CATEGORIES },
  { name: 'location', label: 'Location', type: 'text', required: true },
  { name: 'status', label: 'Status', type: 'select', required: true, options: STATUSES },
  { name: 'startDate', label: 'Start date', type: 'date', required: true },
]

const descriptionFields = [
  { name: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2, required: true, hint: 'Shown on project cards — keep it under 280 characters.' },
  { name: 'fullDescription', label: 'Full description', type: 'textarea', rows: 5, required: true },
  { name: 'problem', label: 'The problem', type: 'textarea', rows: 3 },
  { name: 'solution', label: 'Our approach', type: 'textarea', rows: 3 },
]

const mediaFields = [
  { name: 'heroImage', label: 'Hero image URL', type: 'text', required: true },
  { name: 'gallery', label: 'Gallery image URLs', type: 'list', hint: 'Comma-separated image URLs.' },
]

const fundingFields = [
  { name: 'fundingTarget', label: 'Funding target (₹)', type: 'number', required: true },
  { name: 'amountRaised', label: 'Amount raised (₹)', type: 'number' },
  { name: 'donorCount', label: 'Donor count', type: 'number' },
  { name: 'beneficiaries', label: 'Beneficiaries', type: 'number' },
]

const listFields = [
  { name: 'objectives', label: 'Objectives', type: 'list' },
  { name: 'whatWeProvide', label: 'What we provide', type: 'list' },
]

const seoFields = [
  { name: 'seoTitle', label: 'SEO title', type: 'text' },
  { name: 'seoDescription', label: 'SEO description', type: 'textarea', rows: 2 },
]

function renderField(f, register, errors) {
  const common = { key: f.name, label: f.label, name: f.name, register, error: errors[f.name], required: f.required, hint: f.hint }
  if (f.type === 'textarea') return <TextAreaField {...common} rows={f.rows} />
  if (f.type === 'number') return <NumberField {...common} />
  if (f.type === 'date') return <DateField {...common} />
  if (f.type === 'select') return <SelectField {...common} options={f.options} />
  if (f.type === 'list') return <ListField {...common} />
  return <TextField {...common} />
}

function Section({ title, children }) {
  return (
    <div className="card space-y-4 p-5">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {children}
    </div>
  )
}

export default function ProjectForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [timeline, setTimeline] = useState([])
  const [impactStats, setImpactStats] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!isEdit) return
    projectsApi
      .getById(id)
      .then((data) => {
        reset({
          ...data,
          startDate: data.startDate ? String(data.startDate).slice(0, 10) : '',
        })
        setTimeline(data.timeline || [])
        setImpactStats(data.impactStats || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit, reset])

  function addTimelineRow() {
    setTimeline((prev) => [...prev, { year: '', title: '', description: '' }])
  }
  function updateTimelineRow(i, key, value) {
    setTimeline((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)))
  }
  function removeTimelineRow(i) {
    setTimeline((prev) => prev.filter((_, idx) => idx !== i))
  }

  function addStatRow() {
    setImpactStats((prev) => [...prev, { label: '', value: '' }])
  }
  function updateStatRow(i, key, value) {
    setImpactStats((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)))
  }
  function removeStatRow(i) {
    setImpactStats((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function onSubmit(data) {
    setSaving(true)
    setError('')
    const toArray = (str) => (str || '').split(',').map((s) => s.trim()).filter(Boolean)
    const payload = {
      ...data,
      gallery: toArray(data.gallery),
      objectives: toArray(data.objectives),
      whatWeProvide: toArray(data.whatWeProvide),
      timeline,
      impactStats,
    }
    try {
      if (isEdit) await projectsApi.update(id, payload)
      else await projectsApi.create(payload)
      navigate('/projects')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner full />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6 pb-16">
      {error && <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <Section title="Basics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {baseFields.map((f) => renderField(f, register, errors))}
        </div>
        <CheckboxField label="Published (visible on the public site)" name="published" register={register} />
      </Section>

      <Section title="Description">
        {descriptionFields.map((f) => renderField(f, register, errors))}
      </Section>

      <Section title="Media">
        {mediaFields.map((f) => renderField(f, register, errors))}
      </Section>

      <Section title="Funding">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fundingFields.map((f) => renderField(f, register, errors))}
        </div>
      </Section>

      <Section title="Objectives & what we provide">
        {listFields.map((f) => renderField(f, register, errors))}
      </Section>

      <Section title="Impact stats">
        <p className="text-xs text-gray-500">Short stat + label pairs shown on the project page (e.g. "1.8 grade levels" / "Reading improvement").</p>
        {impactStats.map((row, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500">Value</label>
              <input
                className="input mt-1"
                value={row.value}
                onChange={(e) => updateStatRow(i, 'value', e.target.value)}
                placeholder="e.g. 89%"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500">Label</label>
              <input
                className="input mt-1"
                value={row.label}
                onChange={(e) => updateStatRow(i, 'label', e.target.value)}
                placeholder="e.g. Attendance rate"
              />
            </div>
            <button type="button" onClick={() => removeStatRow(i)} className="mb-1 rounded p-2 text-gray-400 hover:bg-red-50 hover:text-alert">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addStatRow}>
          <Plus size={14} /> Add stat
        </Button>
      </Section>

      <Section title="Timeline">
        <p className="text-xs text-gray-500">The interactive timeline shown on the project page.</p>
        {timeline.map((row, i) => (
          <div key={i} className="rounded-md border border-gray-200 p-3">
            <div className="flex items-start gap-2">
              <div className="w-24">
                <label className="text-xs font-medium text-gray-500">Year</label>
                <input
                  className="input mt-1"
                  value={row.year}
                  onChange={(e) => updateTimelineRow(i, 'year', e.target.value)}
                  placeholder="2024"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500">Event title</label>
                <input
                  className="input mt-1"
                  value={row.title}
                  onChange={(e) => updateTimelineRow(i, 'title', e.target.value)}
                  placeholder="e.g. First centre opened"
                />
              </div>
              <button type="button" onClick={() => removeTimelineRow(i)} className="mt-5 rounded p-2 text-gray-400 hover:bg-red-50 hover:text-alert">
                <Trash2 size={15} />
              </button>
            </div>
            <div className="mt-2">
              <label className="text-xs font-medium text-gray-500">Description</label>
              <textarea
                className="input mt-1"
                rows={2}
                value={row.description}
                onChange={(e) => updateTimelineRow(i, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addTimelineRow}>
          <Plus size={14} /> Add timeline event
        </Button>
      </Section>

      <Section title="SEO">
        {seoFields.map((f) => renderField(f, register, errors))}
      </Section>

      <div className="flex gap-2">
        <Button type="submit" loading={saving}>
          {isEdit ? 'Save changes' : 'Create project'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
