import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/layout/ErrorBoundary'
import PageLoader from './components/layout/PageLoader'
import ProtectedRoute from './routes/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Drives = lazy(() => import('./pages/Drives'))
const Impact = lazy(() => import('./pages/Impact'))
const Stories = lazy(() => import('./pages/Stories'))
const StoryDetail = lazy(() => import('./pages/StoryDetail'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Donate = lazy(() => import('./pages/Donate'))
const Volunteer = lazy(() => import('./pages/Volunteer'))
const Internship = lazy(() => import('./pages/Internship'))
const SponsorDrive = lazy(() => import('./pages/SponsorDrive'))
const CSRPartnership = lazy(() => import('./pages/CSRPartnership'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Transparency = lazy(() => import('./pages/Transparency'))
const Receipt80GRequest = lazy(() => import('./pages/Receipt80GRequest'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/drives" element={<Drives />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:slug" element={<StoryDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/get-involved/volunteer" element={<Volunteer />} />
            <Route path="/get-involved/internship" element={<Internship />} />
            <Route path="/get-involved/sponsor-a-drive" element={<SponsorDrive />} />
            <Route path="/get-involved/csr-partnership" element={<CSRPartnership />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/request-80g" element={<Receipt80GRequest />} />
            <Route path="/legal/:slug" element={<LegalPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth pages render without the standard Navbar/Footer chrome */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
