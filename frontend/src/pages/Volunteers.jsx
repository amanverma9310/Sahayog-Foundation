import StatusListPage from '../components/resource/StatusListPage'
import { listVolunteers, updateVolunteerStatus } from '../lib/api'

const api = { list: listVolunteers, updateStatus: updateVolunteerStatus }

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'city', label: 'City' },
  { key: 'availability', label: 'Availability' },
]

const detailFields = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'City', key: 'city' },
  { label: 'Areas of interest', key: 'areasOfInterest', render: (r) => (r.areasOfInterest || []).join(', ') || '—' },
  { label: 'Availability', key: 'availability' },
  { label: 'Skills', key: 'skills' },
  { label: 'Message', key: 'message' },
]

export default function Volunteers() {
  return (
    <StatusListPage
      title="Volunteer application"
      api={api}
      columns={columns}
      detailFields={detailFields}
      statusOptions={['New', 'Reviewing', 'Approved', 'Onboarded', 'Inactive', 'Rejected']}
    />
  )
}
