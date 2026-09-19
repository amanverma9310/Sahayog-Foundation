const toneMap = {
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-blue-50 text-blue-700',
  pine: 'bg-pine-50 text-pine-700',
}

// Maps common status strings across the app to a sensible color without
// every call site having to know the mapping.
const STATUS_TONE = {
  New: 'blue', Pending: 'amber', 'Under Review': 'amber', Reviewing: 'amber',
  Contacted: 'blue', Discussion: 'blue', Interview: 'blue', Shortlisted: 'blue',
  Approved: 'green', Scheduled: 'green', Active: 'green', Selected: 'green',
  Completed: 'green', Resolved: 'green', Read: 'gray', Replied: 'green',
  'Certificate Generated': 'green', Sent: 'green', Onboarded: 'green',
  Rejected: 'red', Cancelled: 'red', Inactive: 'gray', Failed: 'red',
  Ongoing: 'blue', Draft: 'gray', Published: 'green', Successful: 'green', Refunded: 'amber',
}

export default function Badge({ children, tone }) {
  const resolvedTone = tone || STATUS_TONE[children] || 'gray'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneMap[resolvedTone]}`}>
      {children}
    </span>
  )
}
