import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import ProjectCard from '../project/ProjectCard'

export default function FeaturedProjects({ projects }) {
  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Active programmes"
            title="Three ways we're working right now"
            description="Each project below runs on repeat visits and public reporting, not one-time distribution events."
          />
          <Link to="/projects" className="link-underline hidden shrink-0 items-center gap-1.5 font-medium text-pine-700 sm:flex">
            View all projects <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} featured={i === 0} />
          ))}
        </div>

        <Link to="/projects" className="link-underline mt-10 flex items-center gap-1.5 font-medium text-pine-700 sm:hidden">
          View all projects <ArrowRight size={16} />
        </Link>
      </Container>
    </section>
  )
}
