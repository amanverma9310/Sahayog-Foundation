import { Routes, Route } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProjectsList from './pages/ProjectsList'
import ProjectForm from './pages/ProjectForm'
import Drives from './pages/Drives'
import Stories from './pages/Stories'
import Gallery from './pages/Gallery'
import Testimonials from './pages/Testimonials'
import Team from './pages/Team'
import Awards from './pages/Awards'
import Press from './pages/Press'
import Partners from './pages/Partners'
import Faqs from './pages/Faqs'
import Reports from './pages/Reports'
import Campaigns from './pages/Campaigns'
import ImpactStats from './pages/ImpactStats'
import Donations from './pages/Donations'
import ReceiptRequests from './pages/ReceiptRequests'
import ContactMessages from './pages/ContactMessages'
import Volunteers from './pages/Volunteers'
import Internships from './pages/Internships'
import CsrEnquiries from './pages/CsrEnquiries'
import SponsorRequests from './pages/SponsorRequests'
import Newsletter from './pages/Newsletter'
import Admins from './pages/Admins'
import SiteSettings from './pages/SiteSettings'
import NotFound from './pages/NotFound'

// `handle.title` is read by AdminLayout/Topbar to show a page title without
// every page needing to manage that itself.
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} handle={{ title: 'Dashboard' }} />

          <Route element={<RoleRoute roles={['Super Admin', 'Project Manager']} />}>
            <Route path="projects" element={<ProjectsList />} handle={{ title: 'Projects' }} />
            <Route path="projects/new" element={<ProjectForm />} handle={{ title: 'New project' }} />
            <Route path="projects/:id/edit" element={<ProjectForm />} handle={{ title: 'Edit project' }} />
            <Route path="drives" element={<Drives />} handle={{ title: 'Drives' }} />
          </Route>

          <Route element={<RoleRoute roles={['Super Admin', 'Content Manager']} />}>
            <Route path="stories" element={<Stories />} handle={{ title: 'Stories' }} />
            <Route path="gallery" element={<Gallery />} handle={{ title: 'Gallery' }} />
            <Route path="testimonials" element={<Testimonials />} handle={{ title: 'Testimonials' }} />
            <Route path="team" element={<Team />} handle={{ title: 'Team' }} />
            <Route path="awards" element={<Awards />} handle={{ title: 'Awards' }} />
            <Route path="press" element={<Press />} handle={{ title: 'Press' }} />
            <Route path="partners" element={<Partners />} handle={{ title: 'Partners' }} />
            <Route path="faqs" element={<Faqs />} handle={{ title: 'FAQs' }} />
            <Route path="impact-stats" element={<ImpactStats />} handle={{ title: 'Impact Stats' }} />
            <Route path="contact-messages" element={<ContactMessages />} handle={{ title: 'Contact Messages' }} />
            <Route path="volunteers" element={<Volunteers />} handle={{ title: 'Volunteers' }} />
            <Route path="internships" element={<Internships />} handle={{ title: 'Internships' }} />
            <Route path="newsletter" element={<Newsletter />} handle={{ title: 'Newsletter' }} />
          </Route>

          <Route element={<RoleRoute roles={['Super Admin', 'Donation Manager']} />}>
            <Route path="reports" element={<Reports />} handle={{ title: 'Reports' }} />
            <Route path="campaigns" element={<Campaigns />} handle={{ title: 'Campaigns' }} />
            <Route path="donations" element={<Donations />} handle={{ title: 'Donations' }} />
            <Route path="receipt-requests" element={<ReceiptRequests />} handle={{ title: '80G Requests' }} />
            <Route path="csr-enquiries" element={<CsrEnquiries />} handle={{ title: 'CSR Enquiries' }} />
            <Route path="sponsor-requests" element={<SponsorRequests />} handle={{ title: 'Sponsor Requests' }} />
          </Route>

          <Route element={<RoleRoute roles={['Super Admin']} />}>
            <Route path="admins" element={<Admins />} handle={{ title: 'Admin Users' }} />
            <Route path="settings" element={<SiteSettings />} handle={{ title: 'Site Settings' }} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
