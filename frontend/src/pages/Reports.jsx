import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, FileText } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { TextField, SelectField, FileField, NumberField } from '../components/ui/FormField'
import { reportsApi } from '../lib/api'

const TYPES = ['Annual Report', 'Financial Report', 'Audit Report', 'Impact Report', 'CSR Document', 'Legal Registration']

export default function Reports() {
  const [reports, setReports] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = useCallback(() => {
    reportsApi.list().then((res) => setReports(res.items)).catch((err) => setError(err.message))
  }, [])
  useEffect(load, [load])

  function openCreate() {
    setFile(null)
    reset({ title: '', type: '', publishedYear: new Date().getFullYear() })
    setModalOpen(true)
  }

  async function onSubmit(data) {
    if (!file) {
      setError('Please choose a PDF to upload.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await reportsApi.create({ ...data, publishedYear: Number(data.publishedYear), file })
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
      await reportsApi.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!reports) return <Spinner full />

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{reports.length} documents</p>
        <Button onClick={openCreate}>
          <Plus size={15} /> Upload document
        </Button>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 card divide-y divide-gray-100">
        {reports.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-400">No documents uploaded yet.</p>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-pine-50 text-pine-600">
                  <FileText size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.type}{r.publishedYear ? ` · ${r.publishedYear}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-pine-600 hover:underline">
                  View
                </a>
                <button onClick={() => setDeleteTarget(r)} className="text-xs font-medium text-alert hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload document" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField label="Title" name="title" register={register} error={errors.title} required />
          <SelectField label="Type" name="type" register={register} error={errors.type} options={TYPES} required />
          <NumberField label="Year" name="publishedYear" register={register} />
          <FileField label="PDF file" name="file" onChange={setFile} accept="application/pdf" required />
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
        title="Delete this document?"
        description="This can't be undone."
      />
    </div>
  )
}
