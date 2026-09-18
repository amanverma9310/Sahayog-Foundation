import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import { formatINR } from '../../lib/format'

export default function ProjectCard({ project, featured = false }) {
  const percent = Math.round((project.amountRaised / project.fundingTarget) * 100)
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group block overflow-hidden rounded-sm border border-pine-100 bg-white transition-shadow duration-300 hover:shadow-soft ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-72' : 'h-56'}`}>
        <img
          src={project.heroImage}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <Badge tone="marigold">{project.category}</Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1.5 text-sm text-moss">
          <MapPin size={14} />
          {project.location}
        </div>
        <h3 className="mt-2 font-display text-xl text-pine-700 group-hover:text-marigold-600 transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-moss leading-relaxed line-clamp-2">{project.shortDescription}</p>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-pine-700">{formatINR(project.amountRaised, { compact: true })} raised</span>
            <span className="text-moss">{percent}%</span>
          </div>
          <div className="mt-2">
            <ProgressBar percent={percent} height={6} />
          </div>
        </div>

        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-pine-700 group-hover:text-marigold-600">
          View project <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  )
}
