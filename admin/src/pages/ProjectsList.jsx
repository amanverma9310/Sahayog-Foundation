import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import SearchInput from '../components/ui/SearchInput'
import DataTable from '../components/resource/DataTable'
import Pagination from '../components/resource/Pagination'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { projectsApi } from '../lib/api'
import { formatINR } from '../lib/format'

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
  { key: 'published', label: 'Published', render: (r) => (r.published ? <Badge tone="green">Yes</Badge> : <Badge>Draft</Badge>) },
  {
    key: 'funding',
    label: 'Funding',
    render: (r) => `${formatINR(r.amountRaised)} / ${formatINR(r.fundingTarget)}`,
  },
]

export default function ProjectsList() {
  const navigate = useNavigate()
  const [rows, setRows] = useState(null)
  const [total, setTotal] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setRows(null)
    projectsApi
      .list({ page, limit: 20, search: search || undefined })
      .then((res) => {
        setRows(res.items)
        setTotal(res.total)
      })
      .catch((err) => setError(err.message))
  }, [page, search])

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search])

  async function handleDelete() {
    setDeleting(true)
    try {
      await projectsApi.remove(deleteTarget.id)
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
      <div className="flex items-center justify-between">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
        <Button onClick={() => navigate('/projects/new')}>
          <Plus size={15} /> New project
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
            <DataTable
              columns={columns}
              rows={rows}
              onEdit={(row) => navigate(`/projects/${row.id}/edit`)}
              onDelete={setDeleteTarget}
            />
            <Pagination page={page} limit={20} total={total} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this project?"
        description="This removes it from the public site immediately and can't be undone."
        loading={deleting}
      />
    </div>
  )
}
