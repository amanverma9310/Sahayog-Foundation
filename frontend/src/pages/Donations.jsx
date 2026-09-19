import { useEffect, useState } from 'react'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import { listDonations } from '../lib/api'
import { formatINR, formatDateTime } from '../lib/format'

const STATUS_FILTERS = ['All', 'created', 'successful', 'failed', 'refunded']

export default function Donations() {
  const [donations, setDonations] = useState(null)
  const [status, setStatus] = useState('All')
  const [error, setError] = useState('')

  useEffect(() => {
    setDonations(null)
    listDonations({ status: status === 'All' ? undefined : status })
      .then((res) => setDonations(res.items))
      .catch((err) => setError(err.message))
  }, [status])

  const totalShown = donations?.reduce((sum, d) => sum + (d.status === 'successful' ? d.amount : 0), 0)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
                status === s ? 'bg-pine-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {donations && (
          <p className="text-sm text-gray-500">
            {donations.length} records · {formatINR(totalShown)} successful shown
          </p>
        )}
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 card">
        {!donations ? (
          <div className="py-16">
            <Spinner full />
          </div>
        ) : donations.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-400">No donations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Donor</th>
                  <th className="px-4 py-3 font-medium">Project / Fund</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Frequency</th>
                  <th className="px-4 py-3 font-medium">Payment ID</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{d.anonymous ? 'Anonymous' : d.donorName}</p>
                      <p className="text-xs text-gray-500">{d.donorEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.project?.title || 'General Fund'}</td>
                    <td className="px-4 py-3 font-medium">{formatINR(d.amount)}</td>
                    <td className="px-4 py-3 text-gray-600">{d.frequency}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{d.razorpayPaymentId || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge>{d.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">{formatDateTime(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
