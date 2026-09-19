import StatusListPage from '../components/resource/StatusListPage'
import { listContactMessages, updateContactMessageStatus } from '../lib/api'

const api = {
  list: listContactMessages,
  updateStatus: (id, payload) => updateContactMessageStatus(id, payload.status),
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'subject', label: 'Subject' },
]

const detailFields = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'Category', key: 'category' },
  { label: 'Subject', key: 'subject' },
  { label: 'Message', key: 'message' },
]

export default function ContactMessages() {
  return (
    <StatusListPage
      title="Contact message"
      api={api}
      columns={columns}
      detailFields={detailFields}
      statusOptions={['New', 'Read', 'Replied', 'Resolved']}
    />
  )
}
