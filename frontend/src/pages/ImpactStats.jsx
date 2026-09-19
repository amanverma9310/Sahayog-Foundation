import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { TextField, NumberField } from '../components/ui/FormField'
import { impactStatsApi } from '../lib/api'

export default function ImpactStats() {
  const [stats, setStats] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  function load() {
    impactStatsApi.list().then((res) => setStats(res.items)).catch((err) => setError(err.message))
  }
  useEffect(load, [])

  function openCreate() {
    setEditing(null)
    reset({ key: '', label: '', value: 0, suffix: '', order: 0 })
    setModalOpen(true)
  }
  function openEdit(stat) {
    setEditing(stat)
    reset(stat)
    setModalOpen(true)
  }

  async function onSubmit(data) {
    try {
      await impactStatsApi.upsert({ ...data, value: Number(data.value), order: Number(data.order) })
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete() {
    try {
      await impactStatsApi.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!stats) return <Spinner full />

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Homepage impact counters — the frontend reads these live.</p>
        <Button onClick={openCreate}>
          <Plus size={15} /> New stat
        </Button>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-semibold text-ink">
                  {stat.value.toLocaleString('en-IN')}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-xs text-gray-400">key: {stat.key} · order: {stat.order}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
              <button onClick={() => openEdit(stat)} className="text-xs font-medium text-pine-600 hover:underline">
                Edit
              </button>
              <button onClick={() => setDeleteTarget(stat)} className="text-xs font-medium text-alert hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit stat' : 'New stat'} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            label="Key"
            name="key"
            register={register}
            required
            hint="Stable identifier, e.g. 'lives', 'meals'. Editing an existing key updates that stat."
            disabled={!!editing}
          />
          <TextField label="Label" name="label" register={register} required placeholder="e.g. Lives impacted" />
          <NumberField label="Value" name="value" register={register} required />
          <TextField label="Suffix" name="suffix" register={register} placeholder="e.g. +" />
          <NumberField label="Display order" name="order" register={register} />
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this stat?"
        description="This can't be undone."
      />
    </div>
  )
}
