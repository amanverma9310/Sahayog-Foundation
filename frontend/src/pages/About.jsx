import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Linkedin } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Timeline from '../components/project/Timeline'
import { getTeam, getAwards, getPartners } from '../lib/api'
import { orgInfo } from '../data/content'

const orgTimeline = [
  { year: '2011', title: 'Sahayog Foundation registered', description: 'Founded by Dr. Kavita Rao after a decade in public health research.' },
  { year: '2015', title: 'First mobile health clinic', description: 'Began weekly primary care visits to two underserved colonies.' },
  { year: '2019', title: 'Winter relief programme launched', description: 'Structured night rounds replacing one-off blanket drives.' },
  { year: '2021', title: 'First Bench learning centres open', description: 'After-school reading support in resettlement colonies.' },
  { year: '2024', title: 'North Bihar flood response', description: 'Largest single emergency response to date, reaching 18,400 people.' },
  { year: '2026', title: '184,000+ lives impacted cumulatively', description: 'Six active programme areas across 38 cities.' },
]

const values = [
  { title: 'Direct delivery', description: 'We run programmes ourselves rather than only granting funds onward, so we can stand behind the results.' },
  { title: 'Public reporting', description: 'Every project publishes its funding target, amount raised, and quarterly progress — not just an annual summary.' },
  { title: 'Repeat, not one-off', description: 'Our programmes are built around consistent, repeat contact with the same communities.' },
]

export default function About() {
  const [team, setTeam] = useState([])
  const [awards, setAwards] = useState([])
  const [partners, setPartners] = useState([])

  useEffect(() => {
    getTeam().then(setTeam)
    getAwards().then(setAwards)
    getPartners().then(setPartners)
  }, [])

  return (
    <>
      <Seo title="About" description="Sahayog Foundation's story, mission, leadership and transparency commitments." path="/about" />
      <PageHero
        eyebrow="Who we are"
        title="Fifteen years of relief that had to hold up to scrutiny"
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
            <div>
              <p className="label-eyebrow">Our story</p>
              <p className="mt-3 text-lg leading-relaxed text-moss">
                Sahayog began in 2011 when our founder, then a public health researcher, kept
                encountering the same gap in her fieldwork: relief that looked good in a report but
                didn't survive contact with the next monsoon, the next school term, or the next
                cold wave. We built Sahayog around a different bet — that consistency, not scale,
                is what actually changes outcomes.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-moss">
                Fifteen years on, that bet still shapes how we choose projects: every programme
                area runs on a repeat-visit model, with public reporting built in from day one
                rather than added for donor reassurance.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-sm bg-pine-50 p-6">
                <p className="label-eyebrow">Mission</p>
                <p className="mt-2 text-pine-700 leading-relaxed">
                  Deliver direct, accountable relief and long-term programmes to underserved communities across India.
                </p>
              </div>
              <div className="rounded-sm bg-marigold-50 p-6">
                <p className="label-eyebrow">Vision</p>
                <p className="mt-2 text-pine-700 leading-relaxed">
                  A model of giving where every donor can trace their contribution to a specific, verifiable outcome.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper-dim py-20">
        <Container>
          <SectionHeading eyebrow="What guides us" title="Core values" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-sm border border-pine-100 bg-white p-6">
                <h3 className="font-display text-lg text-pine-700">{v.title}</h3>
                <p className="mt-2 text-sm text-moss leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Our journey" title="How Sahayog grew" />
          <div className="mt-12 max-w-2xl">
            <Timeline events={orgTimeline} />
          </div>
        </Container>
      </section>

      <section className="bg-paper-dim py-20">
        <Container>
          <SectionHeading eyebrow="Leadership" title="The team behind the work" />
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.id}>
                <img src={member.photo} alt={member.name} className="aspect-[4/5] w-full rounded-sm object-cover" loading="lazy" />
                <p className="mt-4 font-display text-lg text-pine-700">{member.name}</p>
                <p className="text-sm text-marigold-600">{member.position}</p>
                <p className="mt-2 text-sm text-moss leading-relaxed">{member.bio}</p>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="mt-2 inline-flex text-moss hover:text-marigold-600">
                  <Linkedin size={16} />
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Recognition" title="Awards & registrations" />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {awards.map((award) => (
              <div key={award.id} className="rounded-sm border border-pine-100 p-6">
                <p className="text-sm text-marigold-600">{award.year}</p>
                <h3 className="mt-1.5 font-display text-lg text-pine-700">{award.name}</h3>
                <p className="mt-1 text-sm text-moss">{award.organization}</p>
                <p className="mt-2 text-sm text-moss leading-relaxed">{award.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-sm bg-pine-50 p-6 text-sm text-pine-700">
            {orgInfo.registrationNumber} · PAN: {orgInfo.pan} · Registered under Section 80G for tax-deductible donations.
          </div>
        </Container>
      </section>

      <section className="bg-paper-dim py-20">
        <Container>
          <SectionHeading eyebrow="Partners" title="Organisations we work alongside" />
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {partners.map((p) => (
              <div key={p.id} className="flex h-20 items-center justify-center rounded-sm border border-pine-100 bg-white px-4">
                <span className="text-center text-sm font-medium text-pine-600">{p.name}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="rounded-sm bg-pine-700 p-10 text-center text-white sm:p-16">
            <h2 className="font-display text-display-md">See exactly where your donation goes</h2>
            <p className="mx-auto mt-3 max-w-md text-pine-100/85">
              Our financial and impact reports are public. Read them before you give, not after.
            </p>
            <Link to="/transparency" className="btn-primary mt-7 inline-flex">
              View our reports
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
