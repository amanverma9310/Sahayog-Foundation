import { useEffect, useState, useCallback } from 'react'
import { Eye } from 'lucide-react'
import Spinner from '../ui/Spinner'
import SearchInput from '../ui/SearchInput'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import { formatDateTime } from '../../lib/format'

// Generic list for the "public submits a form, admin reviews and updates a
// status" resources: contact messages, volunteer/internship applications,
// CSR enquiries, sponsor requests. Each row's status is an inline <select>
// that saves immediately on change. A "view" action opens the full record
// in a read-only modal, since the table can't show every field.
export default function StatusListPage({
  title,
  api, // { list(params), updateStatus(id, payload) }
  columns, // table columns, same shape as DataTable
  detailFields, // [{ label, key, render? }] shown in the view modal
  statusOptions,
  searchable = true,
}) {
  const [rows, setRows] = useState(null)
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState(null)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(() => {
    api
      .list({ limit: 200, search: search || undefined })
      .then((res) => setRows(res.items))
      .catch((err) => setError(err.message))
  }, [api, search])

  useEffect(() => {
    setRows(null)
    const t = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  async function handleStatusChange(row, status) {
    setSavingId(row.id)
    try {
      await api.updateStatus(row.id, { status })
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)))
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        {searchable ? <SearchInput value={search} onChange={setSearch} /> : <span />}
        <p className="text-sm text-gray-500">{rows?.length ?? '…'} records</p>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 card">
        {!rows ? (
          <div className="py-16">
            <Spinner full />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-400">No {title.toLowerCase()} yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  {columns.map((col) => (
                    <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 text-right font-medium">​</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    {columns.map((col) => (
                      <td key={col.key} className="max-w-[220px] truncate px-4 py-3 align-top text-ink">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <select
                        value={row.status}
                        disabled={savingId === row.id}
                        onChange={(e) => handleStatusChange(row, e.target.value)}
                        className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">{formatDateTime(row.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setViewing(row)}
                        aria-label="View details"
                        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-pine-700"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={title} size="sm">
        {viewing && (
          <dl className="space-y-3">
            {detailFields.map((f) => (
              <div key={f.key}>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{f.label}</dt>
                <dd className="mt-0.5 text-sm text-ink">{f.render ? f.render(viewing) : viewing[f.key] || '—'}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Status</dt>
              <dd className="mt-0.5">
                <Badge>{viewing.status}</Badge>
              </dd>
            </div>
          </dl>
        )}
      </Modal>
    </div>
  )
}
