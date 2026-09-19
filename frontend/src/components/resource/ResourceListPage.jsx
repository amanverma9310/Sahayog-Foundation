import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import SearchInput from '../ui/SearchInput'
import DataTable from './DataTable'
import Pagination from './Pagination'
import ResourceFormModal from './ResourceFormModal'
import ConfirmDialog from '../ui/ConfirmDialog'

// Generic list+create+edit+delete page for any resource whose backend API
// matches the standard { list, create, update, remove } shape (see
// src/lib/api.js's crudResource()). Complex resources (Projects, Drives,
// Stories, Gallery, Reports) use their own bespoke pages instead — this
// covers everything else (testimonials, team, awards, press, partners,
// FAQs, campaigns).
export default function ResourceListPage({
  title,
  api,
  columns,
  fields,
  schema,
  searchable = true,
  createLabel = 'New',
  extraToolbar,
}) {
  const [rows, setRows] = useState(null)
  const [total, setTotal] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setRows(null)
    api
      .list({ page, limit: 20, search: search || undefined })
      .then((res) => {
        setRows(res.items)
        setTotal(res.total)
      })
      .catch((err) => setError(err.message))
  }, [api, page, search])

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }
  function openEdit(row) {
    setEditing(row)
    setModalOpen(true)
  }

  async function handleSubmit(payload) {
    setSubmitting(true)
    setError('')
    try {
      if (editing) await api.update(editing.id, payload)
      else await api.create(payload)
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {searchable && <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} />}
          {extraToolbar}
        </div>
        <Button onClick={openCreate}>
          <Plus size={15} /> {createLabel}
        </Button>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 card">
        {!rows ? (
          <div className="py-16">
            <Spinner full />
          </div>
        ) : (
          <>
            <DataTable columns={columns} rows={rows} onEdit={openEdit} onDelete={setDeleteTarget} />
            <Pagination page={page} limit={20} total={total} onPageChange={setPage} />
          </>
        )}
      </div>

      <ResourceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={editing ? `Edit ${title}` : `New ${title}`}
        fields={fields}
        record={editing}
        schema={schema}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete this ${title.toLowerCase()}?`}
        description="This can't be undone."
        loading={deleting}
      />
    </div>
  )
}
