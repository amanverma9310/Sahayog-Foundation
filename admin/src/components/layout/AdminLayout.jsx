import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const TITLES = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/drives': 'Drives',
  '/stories': 'Stories',
  '/gallery': 'Gallery',
  '/testimonials': 'Testimonials',
  '/team': 'Team',
  '/awards': 'Awards',
  '/press': 'Press',
  '/partners': 'Partners',
  '/faqs': 'FAQs',
  '/reports': 'Reports',
  '/campaigns': 'Campaigns',
  '/impact-stats': 'Impact Stats',
  '/donations': 'Donations',
  '/receipt-requests': '80G Requests',
  '/contact-messages': 'Contact Messages',
  '/volunteers': 'Volunteers',
  '/internships': 'Internships',
  '/csr-enquiries': 'CSR Enquiries',
  '/sponsor-requests': 'Sponsor Requests',
  '/newsletter': 'Newsletter',
  '/admins': 'Admin Users',
  '/settings': 'Site Settings',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const title =
    TITLES[pathname] ||
    (pathname.startsWith('/projects/') ? 'Project' : 'Admin')

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar title={title} />
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}