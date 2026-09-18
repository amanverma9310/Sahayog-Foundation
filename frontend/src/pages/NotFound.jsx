import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you're looking for doesn't exist." path="/404" />
      <Container className="flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-7xl text-pine-200">404</p>
        <h1 className="mt-4 font-display text-2xl text-pine-700">This page has moved or doesn't exist</h1>
        <p className="mt-2 max-w-sm text-moss">
          Check the address, or head back to explore our projects and stories.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/" className="btn-primary">
            <Home size={16} /> Go home
          </Link>
          <Link to="/projects" className="btn-outline">
            <Search size={16} /> Browse projects
          </Link>
        </div>
      </Container>
    </>
  )
}
