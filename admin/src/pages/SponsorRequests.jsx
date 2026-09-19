import StatusListPage from '../components/resource/StatusListPage'
import { listSponsorRequests, updateSponsorStatus } from '../lib/api'

const api = { list: listSponsorRequests, updateStatus: updateSponsorStatus }

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'preferredDrive', label: 'Preferred drive' },
  { key: 'budgetRange', label: 'Budget' },
]

const detailFields = [
  { label: 'Name', key: 'name' },
  { label: 'Organization', key: 'organization' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'Preferred drive', key: 'preferredDrive' },
  { label: 'Budget range', key: 'budgetRange' },
  { label: 'Preferred location', key: 'preferredLocation' },
  { label: 'Expected date', key: 'expectedDate' },
  { label: 'Message', key: 'message' },
]

export default function SponsorRequests() {
  return (
    <StatusListPage
      title="Sponsor request"
      api={api}
      columns={columns}
      detailFields={detailFields}
      statusOptions={['New', 'Contacted', 'Discussion', 'Approved', 'Scheduled', 'Completed', 'Rejected']}
    />
  )
}
