import StatusListPage from '../components/resource/StatusListPage'
import { listInternships, updateInternshipStatus } from '../lib/api'

const api = { list: listInternships, updateStatus: updateInternshipStatus }

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'college', label: 'College' },
  { key: 'course', label: 'Course' },
]

const detailFields = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'College', key: 'college' },
  { label: 'Course', key: 'course' },
  { label: 'Year', key: 'year' },
  { label: 'Skills', key: 'skills' },
  { label: 'Motivation', key: 'motivation' },
  { label: 'Portfolio', key: 'portfolio' },
  { label: 'LinkedIn', key: 'linkedin' },
  { label: 'Resume', key: 'resumeUrl', render: (r) => (r.resumeUrl ? <a href={r.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-pine-600 underline">Download</a> : '—') },
]

export default function Internships() {
  return (
    <StatusListPage
      title="Internship application"
      api={api}
      columns={columns}
      detailFields={detailFields}
      statusOptions={['New', 'Reviewing', 'Shortlisted', 'Interview', 'Selected', 'Rejected']}
    />
  )
}
