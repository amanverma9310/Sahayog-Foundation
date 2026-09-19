import { useEffect, useState } from 'react'
import {
  Wallet, TrendingUp, Users, FolderKanban, Truck, HeartHandshake, Receipt, Mail,
  Building2, Briefcase, UserPlus,
} from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import { getDashboardStats, getDonationTrends } from '../lib/api'
import { formatINR, formatDateTime } from '../lib/format'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getDashboardStats(), getDonationTrends()])
      .then(([s, t]) => {
        setStats(s)
        setTrends(t)
      })
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-alert">{error}</p>
  if (!stats) return <Spinner full />

  const maxTrend = Math.max(...trends.map((t) => t.total), 1)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total donations" value={formatINR(stats.totalDonations)} icon={Wallet} />
        <StatCard
          label="This month"
          value={`${formatINR(stats.donationsThisMonth)} · ${stats.donationsThisMonthCount}`}
          icon={TrendingUp}
        />
        <StatCard label="Total donors" value={stats.totalDonors} icon={Users} />
        <StatCard label="Beneficiaries" value={stats.beneficiaries.toLocaleString('en-IN')} icon={UserPlus} />
        <StatCard label="Active projects" value={stats.activeProjects} icon={FolderKanban} />
        <StatCard label="Completed drives" value={stats.completedDrives} icon={Truck} />
        <StatCard label="Pending 80G requests" value={stats.pending80GRequests} icon={Receipt} tone="marigold" />
        <StatCard label="New contact enquiries" value={stats.newContactEnquiries} icon={Mail} tone="marigold" />
        <StatCard label="New CSR enquiries" value={stats.newSponsorRequests} icon={Building2} tone="marigold" />
        <StatCard label="New internship applications" value={stats.newInternshipApplications} icon={Briefcase} tone="marigold" />
        <StatCard label="New volunteer applications" value={stats.newVolunteerApplications} icon={HeartHandshake} tone="marigold" />
      </div>

      {trends?.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-medium text-ink">Donations — last 12 months</p>
          <div className="mt-5 flex items-end gap-2" style={{ height: 140 }}>
            {trends.map((t) => (
              <div key={`${t._id.year}-${t._id.month}`} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t bg-pine-500"
                  style={{ height: `${Math.max((t.total / maxTrend) * 110, 3)}px` }}
                  title={formatINR(t.total)}
                />
                <p className="text-[10px] text-gray-400">{t._id.month}/{String(t._id.year).slice(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <p className="border-b border-gray-100 px-5 py-4 text-sm font-medium text-ink">Recent transactions</p>
        {stats.recentTransactions.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">No donations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-5 py-2.5 font-medium">Donor</th>
                  <th className="px-5 py-2.5 font-medium">Project</th>
                  <th className="px-5 py-2.5 font-medium">Amount</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50">
                    <td className="px-5 py-3">{tx.anonymous ? 'Anonymous' : tx.donorName}</td>
                    <td className="px-5 py-3 text-gray-500">{tx.project?.title || 'General Fund'}</td>
                    <td className="px-5 py-3 font-medium">{formatINR(tx.amount)}</td>
                    <td className="px-5 py-3">
                      <Badge>{tx.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{formatDateTime(tx.createdAt)}</td>
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
