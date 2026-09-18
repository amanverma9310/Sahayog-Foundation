import { useEffect, useState } from 'react'
import { Search, FolderSearch } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import ProjectCard from '../components/project/ProjectCard'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonGrid } from '../components/ui/Skeleton'
import { getProjects } from '../lib/api'
import { categories } from '../data/content'

export default function Projects() {
  const [projects, setProjects] = useState(null)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setProjects(null)
    const timer = setTimeout(() => {
      getProjects({ category, search }).then((res) => setProjects(res.items))
    }, 250)
    return () => clearTimeout(timer)
  }, [category, search])

  return (
    <>
      <Seo
        title="Our Projects"
        description="Explore Sahayog Foundation's active programmes across education, healthcare, food relief, disaster response and more."
        path="/projects"
      />
      <PageHero
        eyebrow="Our work"
        title="Projects built to run for years, not one campaign"
        description="Every project here has a funding target, a published objective, and a public progress bar — not just a photo gallery."
        image="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-16">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-pine-700 text-white'
                      : 'bg-paper-dim text-moss hover:bg-pine-50 hover:text-pine-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full max-w-xs">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-moss" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects"
                aria-label="Search projects"
                className="w-full rounded-[3px] border border-pine-100 py-2.5 pl-9 pr-3 text-sm focus-visible:outline-marigold-500"
              />
            </div>
          </div>

          <div className="mt-10">
            {!projects && <SkeletonGrid count={6} />}
            {projects && projects.length === 0 && (
              <EmptyState
                icon={FolderSearch}
                title="No projects match that search"
                description="Try a different category or clear your search term."
              />
            )}
            {projects && projects.length > 0 && (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
