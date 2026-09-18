import { useEffect, useState } from 'react'
import { Users, MapPin, Calendar, HeartHandshake } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonGrid } from '../components/ui/Skeleton'
import { getDrives, getProjects } from '../lib/api'
import { formatDate } from '../lib/format'

export default function Drives() {
  const [drives, setDrives] = useState(null)
  const [projects, setProjects] = useState([])
  const [projectFilter, setProjectFilter] = useState('All')

  useEffect(() => {
    getProjects().then((res) => setProjects(res.items)).catch(() => setProjects([]))
  }, [])

  useEffect(() => {
    setDrives(null)
    getDrives({ projectId: projectFilter === 'All' ? undefined : projectFilter }).then((res) => setDrives(res.items))
  }, [projectFilter])

  return (
    <>
      <Seo
        title="Drives"
        description="Completed and upcoming relief drives run by Sahayog Foundation, filterable by project, location and year."
        path="/drives"
      />
      <PageHero
        eyebrow="On the ground"
        title="Every drive we run, published"
        description="A drive is a single, dated field activity within a project — a distribution day, a clinic day, an assessment day. Here's the record."
        image="https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setProjectFilter('All')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                projectFilter === 'All' ? 'bg-pine-700 text-white' : 'bg-paper-dim text-moss hover:bg-pine-50'
              }`}
            >
              All projects
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setProjectFilter(p.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  projectFilter === p.id ? 'bg-pine-700 text-white' : 'bg-paper-dim text-moss hover:bg-pine-50'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="mt-10">
            {!drives && <SkeletonGrid count={4} />}
            {drives && drives.length === 0 && (
              <EmptyState icon={HeartHandshake} title="No drives found" description="Try a different project filter." />
            )}
            {drives && drives.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {drives.map((drive) => (
                  <div key={drive.id} className="flex gap-5 rounded-sm border border-pine-100 p-5">
                    <img src={drive.images?.[0]} alt="" className="h-28 w-28 shrink-0 rounded-sm object-cover" loading="lazy" />
                    <div className="min-w-0">
                      <Badge tone={drive.status === 'Completed' ? 'pine' : 'marigold'}>{drive.status}</Badge>
                      <h3 className="mt-2 font-display text-lg text-pine-700">{drive.name}</h3>
                      <p className="mt-1.5 text-sm text-moss leading-relaxed">{drive.description}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-moss">
                        <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(drive.date)}</span>
                        <span className="flex items-center gap-1"><MapPin size={13} /> {drive.location}</span>
                        <span className="flex items-center gap-1"><Users size={13} /> {drive.beneficiaries.toLocaleString('en-IN')} reached</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
