import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Share2, ArrowRight } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import Timeline from '../components/project/Timeline'
import { getProjectBySlug, getDrives, getStories } from '../lib/api'
import { formatINR, formatDate } from '../lib/format'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [relatedDrives, setRelatedDrives] = useState([])
  const [relatedStories, setRelatedStories] = useState([])

  useEffect(() => {
    setProject(null)
    setNotFound(false)
    getProjectBySlug(slug)
      .then((data) => {
        setProject(data)
        getDrives({ projectId: data.id }).then((res) => setRelatedDrives(res.items))
        getStories().then((res) => setRelatedStories(res.items.filter((s) => s.relatedProject === data.id)))
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) return <Navigate to="/404" replace />
  if (!project) return <div className="min-h-[60vh]" />

  const percent = Math.round((project.amountRaised / project.fundingTarget) * 100)
  const testimonials = project.testimonialIds || []

  return (
    <>
      <Seo
        title={project.seoTitle || project.title}
        description={project.seoDescription || project.shortDescription}
        path={`/projects/${project.slug}`}
        image={project.heroImage}
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: project.title,
          image: project.heroImage,
          description: project.seoDescription || project.shortDescription,
        }}
      />

      <section className="relative flex min-h-[56vh] items-end overflow-hidden bg-pine-800 pt-24">
        <div className="absolute inset-0">
          <img src={project.heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-900/90 via-pine-900/40 to-pine-900/10" />
        </div>
        <div className="container-edit relative z-10 pb-14">
          <Badge tone="marigold">{project.category}</Badge>
          <h1 className="mt-4 max-w-3xl text-display-md font-display font-medium text-white sm:text-display-lg">
            {project.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-pine-50/85">
            <span className="flex items-center gap-1.5 text-sm"><MapPin size={15} /> {project.location}</span>
            <span className="flex items-center gap-1.5 text-sm"><Calendar size={15} /> Since {formatDate(project.startDate, { year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5 text-sm"><Users size={15} /> {project.beneficiaries.toLocaleString('en-IN')} beneficiaries</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-lg leading-relaxed text-moss">{project.fullDescription}</p>

              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="rounded-sm border border-pine-100 p-6">
                  <p className="label-eyebrow">The problem</p>
                  <p className="mt-2 text-moss leading-relaxed">{project.problem}</p>
                </div>
                <div className="rounded-sm border border-pine-100 p-6">
                  <p className="label-eyebrow">Our approach</p>
                  <p className="mt-2 text-moss leading-relaxed">{project.solution}</p>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="font-display text-2xl text-pine-700">What we provide</h2>
                <ul className="mt-5 space-y-3">
                  {project.whatWeProvide.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-moss">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12">
                <h2 className="font-display text-2xl text-pine-700">Objectives</h2>
                <ul className="mt-5 space-y-3">
                  {project.objectives.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-moss">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pine-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {project.gallery.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl text-pine-700">Gallery</h2>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {project.gallery.map((img, i) => (
                      <motion.img
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        src={img}
                        alt={`${project.title} — photo ${i + 1}`}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-sm object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-14">
                <h2 className="font-display text-2xl text-pine-700">Timeline</h2>
                <div className="mt-8">
                  <Timeline events={project.timeline} />
                </div>
              </div>

              {relatedDrives.length > 0 && (
                <div className="mt-14">
                  <h2 className="font-display text-2xl text-pine-700">Related drives</h2>
                  <div className="mt-6 space-y-4">
                    {relatedDrives.map((drive) => (
                      <Link
                        key={drive.id}
                        to="/drives"
                        className="flex items-center gap-4 rounded-sm border border-pine-100 p-4 hover:shadow-card"
                      >
                        <img src={drive.images?.[0]} alt="" className="h-16 w-16 shrink-0 rounded-sm object-cover" />
                        <div className="min-w-0">
                          <p className="font-medium text-pine-700">{drive.name}</p>
                          <p className="text-sm text-moss">{formatDate(drive.date)} · {drive.location}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {testimonials.length > 0 && (
                <div className="mt-14 space-y-6">
                  {testimonials.map((t) => (
                    <blockquote key={t.id} className="border-l-2 border-marigold-400 pl-6">
                      <p className="font-display text-xl text-pine-700 leading-snug">"{t.quote}"</p>
                      <footer className="mt-3 text-sm text-moss">{t.name} — {t.role}</footer>
                    </blockquote>
                  ))}
                </div>
              )}

              {relatedStories.length > 0 && (
                <div className="mt-14">
                  <h2 className="font-display text-2xl text-pine-700">Related stories</h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {relatedStories.map((story) => (
                      <Link key={story.id} to={`/stories/${story.slug}`} className="group">
                        <img src={story.coverImage} alt="" className="h-40 w-full rounded-sm object-cover" loading="lazy" />
                        <p className="mt-3 font-medium text-pine-700 group-hover:text-marigold-600">{story.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky donate sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-sm border border-pine-100 bg-white p-6 shadow-soft">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-2xl text-pine-700">{formatINR(project.amountRaised, { compact: true })}</p>
                  <p className="text-sm text-moss">of {formatINR(project.fundingTarget, { compact: true })}</p>
                </div>
                <div className="mt-3">
                  <ProgressBar percent={percent} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-moss">
                  <span>{percent}% funded</span>
                  <span>{project.donorCount.toLocaleString('en-IN')} donors</span>
                </div>
                <Link
                  to={`/donate?project=${project.slug}`}
                  className="btn-primary mt-6 w-full justify-center"
                >
                  Donate to this project <ArrowRight size={16} />
                </Link>
                <button className="btn-outline mt-3 w-full justify-center">
                  <Share2 size={15} /> Share
                </button>

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-pine-100 pt-6 text-center">
                  {project.impactStats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-lg text-pine-700">{stat.value}</p>
                      <p className="mt-1 text-xs text-moss leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
