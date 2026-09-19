import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { TextField, SelectField } from '../components/ui/FormField'
import { listAdmins, createAdminUser, setAdminActive } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../lib/format'

const ROLES = ['Super Admin', 'Content Manager', 'Donation Manager', 'Project Manager']

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(ROLES),
})

export default function Admins() {
  const { admin: currentAdmin } = useAuth()
  const [admins, setAdmins] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  function load() {
    listAdmins().then(setAdmins).catch((err) => setError(err.message))
  }
  useEffect(load, [])

  function openCreate() {
    reset({ name: '', email: '', password: '', role: 'Content Manager' })
    setModalOpen(true)
  }

  async function onSubmit(data) {
    try {
      await createAdminUser(data)
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleActive(a) {
    try {
      await setAdminActive(a.id, !a.active)
      setAdmins((prev) => prev.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)))
    } catch (err) {
      setError(err.message)
    }
  }

  if (!admins) return <Spinner full />

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Admin accounts with access to this panel.</p>
        <Button onClick={openCreate}>
          <Plus size={15} /> New admin
        </Button>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last login</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-ink">{a.name}</td>
                <td className="px-4 py-3 text-gray-600">{a.email}</td>
                <td className="px-4 py-3 text-gray-600">{a.role}</td>
                <td className="px-4 py-3">
                  <Badge tone={a.active ? 'green' : 'gray'}>{a.active ? 'Active' : 'Deactivated'}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{a.lastLoginAt ? formatDate(a.lastLoginAt) : 'Never'}</td>
                <td className="px-4 py-3 text-right">
                  {a.id !== currentAdmin?.id && (
                    <button
                      onClick={() => toggleActive(a)}
                      className={`text-xs font-medium hover:underline ${a.active ? 'text-alert' : 'text-pine-600'}`}
                    >
                      {a.active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New admin" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField label="Name" name="name" register={register} error={errors.name} required />
          <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
          <TextField label="Temporary password" name="password" type="password" register={register} error={errors.password} required />
          <SelectField label="Role" name="role" register={register} error={errors.role} options={ROLES} required />
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create admin
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
