import { useParams, Navigate } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'
import { legalPages } from '../data/legal'
import { formatDate } from '../lib/format'

export default function LegalPage() {
  const { slug } = useParams()
  const page = legalPages[slug]

  if (!page) return <Navigate to="/404" replace />

  return (
    <>
      <Seo title={page.title} description={`${page.title} for Sahayog Foundation.`} path={`/legal/${slug}`} />
      <Container className="pt-32 pb-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-display-md text-pine-700">{page.title}</h1>
          <p className="mt-2 text-sm text-moss">Last updated {formatDate(page.updated)}</p>

          <div className="mt-10 space-y-8">
            {page.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-xl text-pine-700">{section.heading}</h2>
                <p className="mt-2 leading-relaxed text-moss">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  )
}
