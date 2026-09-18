import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Counter from '../components/ui/Counter'
import ProgressBar from '../components/ui/ProgressBar'
import { getImpactStats, getProjects } from '../lib/api'
import { formatINR } from '../lib/format'

export default function Impact() {
  const [stats, setStats] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getImpactStats().then(setStats)
    getProjects().then((res) => setProjects(res.items))
  }, [])

  return (
    <>
      <Seo title="Impact" description="Detailed programme-level impact data for every Sahayog Foundation project." path="/impact" />
      <PageHero
        eyebrow="The numbers"
        title="Impact, broken down by programme"
        description="Headline figures are useful, but they hide where the work actually happens. Here's the per-project view."
        image="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Cumulative" title="Across every programme" />
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <Counter key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-dim py-20">
        <Container>
          <SectionHeading eyebrow="Programme by programme" title="Funding progress" />
          <div className="mt-12 space-y-8">
            {projects.map((project) => {
              const percent = Math.round((project.amountRaised / project.fundingTarget) * 100)
              return (
                <div key={project.id} className="rounded-sm border border-pine-100 bg-white p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Link to={`/projects/${project.slug}`} className="font-display text-lg text-pine-700 hover:text-marigold-600">
                        {project.title}
                      </Link>
                      <p className="text-sm text-moss">{project.category} · {project.beneficiaries.toLocaleString('en-IN')} beneficiaries</p>
                    </div>
                    <p className="text-sm text-moss">
                      {formatINR(project.amountRaised, { compact: true })} of {formatINR(project.fundingTarget, { compact: true })}
                    </p>
                  </div>
                  <div className="mt-4">
                    <ProgressBar percent={percent} />
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>
    </>
  )
}
