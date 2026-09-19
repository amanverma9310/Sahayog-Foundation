import StatusListPage from '../components/resource/StatusListPage'
import { listCsrEnquiries, updateCsrStatus } from '../lib/api'

const api = { list: listCsrEnquiries, updateStatus: updateCsrStatus }

const columns = [
  { key: 'companyName', label: 'Company' },
  { key: 'contactPerson', label: 'Contact' },
  { key: 'estimatedBudget', label: 'Budget' },
]

const detailFields = [
  { label: 'Company', key: 'companyName' },
  { label: 'Contact person', key: 'contactPerson' },
  { label: 'Designation', key: 'designation' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'Website', key: 'website' },
  { label: 'CSR interests', key: 'csrInterests' },
  { label: 'Estimated budget', key: 'estimatedBudget' },
  { label: 'Message', key: 'message' },
]

export default function CsrEnquiries() {
  return (
    <StatusListPage
      title="CSR enquiry"
      api={api}
      columns={columns}
      detailFields={detailFields}
      statusOptions={['New', 'Contacted', 'Discussion', 'Approved', 'Active', 'Completed', 'Rejected']}
    />
  )
}
