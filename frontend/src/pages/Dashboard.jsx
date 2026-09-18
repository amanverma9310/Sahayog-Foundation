import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, FileCheck2, LogOut, User, Receipt, Inbox } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonGrid } from '../components/ui/Skeleton'
import { formatINR, formatDate } from '../lib/format'
import { getMyDonations, getMy80GRequests, getMe } from '../lib/api'

const tabs = ['My Donations', 'Profile', '80G Requests']

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('My Donations')
  const [donations, setDonations] = useState(null)
  const [receiptRequests, setReceiptRequests] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getMyDonations(), getMy80GRequests(), getMe()])
      .then(([donationData, receiptData, meData]) => {
        setDonations(donationData)
        setReceiptRequests(receiptData)
        setProfile(meData.user || meData)
      })
      .catch(() => setLoadError(true))
  }, [])

  function logout() {
    localStorage.removeItem('sahayog_token')
    navigate('/')
  }

  return (
    <>
      <Seo title="Dashboard" description="Your donation history, receipts and 80G requests." path="/dashboard" />
      <Container className="pt-32 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-pine-700">Your dashboard</h1>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm font-medium text-moss hover:text-alert">
            <LogOut size={16} /> Log out
          </button>
        </div>

        <div className="mt-8 flex gap-2 border-b border-pine-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                activeTab === tab ? 'border-marigold-500 text-pine-700' : 'border-transparent text-moss hover:text-pine-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loadError && (
          <div className="mt-8">
            <EmptyState
              icon={Inbox}
              title="Couldn't load your dashboard"
              description="Your session may have expired. Try logging in again."
            />
          </div>
        )}

        {!loadError && activeTab === 'My Donations' && (
          <div className="mt-8">
            {!donations && <SkeletonGrid count={3} />}
            {donations && donations.length === 0 && (
              <EmptyState
                icon={Inbox}
                title="No donations yet"
                description="Once you make a donation, it'll show up here with a downloadable receipt."
              />
            )}
            {donations && donations.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-pine-100 text-left text-moss">
                      <th className="py-3 pr-4 font-medium">Date</th>
                      <th className="py-3 pr-4 font-medium">Project</th>
                      <th className="py-3 pr-4 font-medium">Amount</th>
                      <th className="py-3 pr-4 font-medium">Transaction ID</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 font-medium">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d.id} className="border-b border-pine-50">
                        <td className="py-4 pr-4 text-pine-700">{formatDate(d.createdAt)}</td>
                        <td className="py-4 pr-4 text-pine-700">{d.project?.title || 'General Fund'}</td>
                        <td className="py-4 pr-4 font-medium text-pine-700">{formatINR(d.amount)}</td>
                        <td className="py-4 pr-4 text-moss">{d.razorpayPaymentId || '—'}</td>
                        <td className="py-4 pr-4"><Badge tone="pine">{d.status}</Badge></td>
                        <td className="py-4">
                          {d.receiptUrl ? (
                            <a
                              href={d.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-pine-700 hover:text-marigold-600"
                            >
                              <Download size={14} /> Download
                            </a>
                          ) : (
                            <span className="text-moss">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!loadError && activeTab === 'Profile' && (
          <div className="mt-8 max-w-md rounded-sm border border-pine-100 p-6">
            {!profile ? (
              <SkeletonGrid count={1} />
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pine-50 text-pine-600">
                    <User size={20} />
                  </span>
                  <div>
                    <p className="font-medium text-pine-700">{profile.name}</p>
                    <p className="text-sm text-moss">{profile.email}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-moss">
                  Full profile editing (phone, address, saved payment preferences) uses
                  <code className="mx-1 rounded bg-paper-dim px-1.5 py-0.5 text-xs">PATCH /api/auth/update-me</code>
                  — not yet wired into this screen.
                </p>
              </>
            )}
          </div>
        )}

        {!loadError && activeTab === '80G Requests' && (
          <div className="mt-8">
            {!receiptRequests && <SkeletonGrid count={2} />}
            {receiptRequests && receiptRequests.length === 0 && (
              <EmptyState
                icon={Receipt}
                title="No 80G requests yet"
                description="Request a certificate from the donation confirmation screen or the 80G request page."
              />
            )}
            {receiptRequests && receiptRequests.length > 0 && (
              <div className="space-y-4">
                {receiptRequests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-sm border border-pine-100 p-5">
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-pine-50 text-pine-600">
                        {r.status === 'Certificate Generated' || r.status === 'Sent' ? <FileCheck2 size={18} /> : <Receipt size={18} />}
                      </span>
                      <div>
                        <p className="font-medium text-pine-700">{formatINR(r.donationAmount)} — {r.donationId}</p>
                        <p className="text-sm text-moss">{formatDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <Badge tone={r.status === 'Pending' ? 'marigold' : 'pine'}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  )
}
