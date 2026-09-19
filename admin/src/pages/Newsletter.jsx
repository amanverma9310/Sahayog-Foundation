import { useEffect, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { listSubscribers, downloadSubscribersCSV } from '../lib/api'
import { formatDate } from '../lib/format'

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState(null)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    listSubscribers().then(setSubscribers).catch((err) => setError(err.message))
  }, [])

  async function handleExport() {
    setExporting(true)
    try {
      await downloadSubscribersCSV()
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  if (!subscribers) return <Spinner full />

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{subscribers.length} active subscribers</p>
        <Button variant="outline" onClick={handleExport} loading={exporting}>
          {!exporting && <Download size={15} />} Export CSV
        </Button>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}

      <div className="mt-4 card">
        {subscribers.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-400">No subscribers yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">{s.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
