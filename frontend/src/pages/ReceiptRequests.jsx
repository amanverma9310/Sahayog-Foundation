import { useEffect, useState } from 'react'
import { FileCheck2, Loader2 } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { listReceiptRequests, updateReceiptRequestStatus, generateReceiptCertificate } from '../lib/api'
import { formatINR, formatDateTime } from '../lib/format'

const STATUS_OPTIONS = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Certificate Generated', 'Sent']

export default function ReceiptRequests() {
  const [requests, setRequests] = useState(null)
  const [error, setError] = useState('')
  const [viewing, setViewing] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [generatingId, setGeneratingId] = useState(null)

  function load() {
    listReceiptRequests({ limit: 200 })
      .then((res) => setRequests(res.items))
      .catch((err) => setError(err.message))
  }
  useEffect(load, [])

  async function handleStatusChange(row, status) {
    setSavingId(row.id)
    try {
      await updateReceiptRequestStatus(row.id, { status })
      setRequests((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)))
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  async function handleGenerateCertificate(row) {
    setGeneratingId(row.id)
    try {
      const updated = await generateReceiptCertificate(row.id)
      setRequests((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...updated } : r)))
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingId(null)
    }
  }

  if (!requests) return <Spinner full />

  return (
    <div>
      <p className="text-sm text-gray-500">{requests.length} requests</p>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 card">
        {requests.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-400">No 80G requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Donor</th>
                  <th className="px-4 py-3 font-medium">PAN</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Donation ID</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Requested</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <button onClick={() => setViewing(r)} className="font-medium text-pine-700 hover:underline">
                        {r.fullName}
                      </button>
                      <p className="text-xs text-gray-500">{r.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.pan}</td>
                    <td className="px-4 py-3 font-medium">{formatINR(r.donationAmount)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.donationId}</td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        disabled={savingId === r.id}
                        onChange={(e) => handleStatusChange(r, e.target.value)}
                        className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">{formatDateTime(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {r.certificateUrl ? (
                        <a
                          href={r.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-pine-700 hover:underline"
                        >
                          <FileCheck2 size={13} /> View PDF
                        </a>
                      ) : (
                        <Button
                          variant="outline"
                          className="!px-2.5 !py-1 !text-xs"
                          onClick={() => handleGenerateCertificate(r)}
                          disabled={r.status === 'Rejected' || generatingId === r.id}
                        >
                          {generatingId === r.id ? <Loader2 size={13} className="animate-spin" /> : 'Generate certificate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="80G request details" size="sm">
        {viewing && (
          <dl className="space-y-3">
            <div><dt className="text-xs font-medium uppercase text-gray-400">Full name</dt><dd className="text-sm">{viewing.fullName}</dd></div>
            <div><dt className="text-xs font-medium uppercase text-gray-400">Email</dt><dd className="text-sm">{viewing.email}</dd></div>
            <div><dt className="text-xs font-medium uppercase text-gray-400">Phone</dt><dd className="text-sm">{viewing.phone}</dd></div>
            <div><dt className="text-xs font-medium uppercase text-gray-400">PAN</dt><dd className="text-sm">{viewing.pan}</dd></div>
            <div><dt className="text-xs font-medium uppercase text-gray-400">Address</dt><dd className="text-sm">{viewing.address}</dd></div>
            <div><dt className="text-xs font-medium uppercase text-gray-400">Donation ID</dt><dd className="text-sm">{viewing.donationId}</dd></div>
            <div><dt className="text-xs font-medium uppercase text-gray-400">Amount</dt><dd className="text-sm">{formatINR(viewing.donationAmount)}</dd></div>
            <div><dt className="text-xs font-medium uppercase text-gray-400">Message</dt><dd className="text-sm">{viewing.message || '—'}</dd></div>
            <div><dt className="text-xs font-medium uppercase text-gray-400">Status</dt><dd><Badge>{viewing.status}</Badge></dd></div>
          </dl>
        )}
      </Modal>
    </div>
  )
}
