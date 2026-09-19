import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Plus } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { TextField, SelectField, FileField } from '../components/ui/FormField'
import { galleryApi, listProjectsForPicker } from '../lib/api'

const CATEGORIES = ['Education', 'Food Relief', 'Healthcare', 'Women Empowerment', 'Winter Relief', 'Environment', 'Community Development', 'Disaster Relief']

export default function Gallery() {
  const [items, setItems] = useState(null)
  const [projects, setProjects] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = useCallback(() => {
    galleryApi.list({ limit: 60 }).then((res) => setItems(res.items)).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    load()
    listProjectsForPicker().then(setProjects).catch(() => {})
  }, [load])

  function openCreate() {
    setFile(null)
    reset({ caption: '', category: '', year: new Date().getFullYear(), project: '' })
    setModalOpen(true)
  }

  async function onSubmit(data) {
    if (!file) {
      setError('Please choose an image to upload.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await galleryApi.create({
        ...data,
        year: Number(data.year),
        image: file,
        project: data.project || undefined,
      })
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    try {
      await galleryApi.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!items) return <Spinner full />

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} images</p>
        <Button onClick={openCreate}>
          <Plus size={15} /> Upload image
        </Button>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <img src={item.image} alt={item.caption} className="h-32 w-full object-cover" />
            <div className="p-3">
              <p className="line-clamp-1 text-sm font-medium text-ink">{item.caption}</p>
              <p className="mt-0.5 text-xs text-gray-500">{item.category} · {item.year}</p>
              <button onClick={() => setDeleteTarget(item)} className="mt-2 text-xs font-medium text-alert hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload gallery image" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FileField label="Image" name="image" onChange={setFile} accept="image/*" required hint="JPEG, PNG or WebP." />
          <TextField label="Caption" name="caption" register={register} error={errors.caption} required />
          <SelectField label="Category" name="category" register={register} error={errors.category} options={CATEGORIES} required />
          <TextField label="Year" name="year" type="number" register={register} required />
          <SelectField
            label="Related project (optional)"
            name="project"
            register={register}
            options={projects.map((p) => ({ value: p.id, label: p.title }))}
          />
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Upload
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this image?"
        description="This can't be undone."
      />
    </div>
  )
}
