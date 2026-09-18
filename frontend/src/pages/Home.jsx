import { useEffect, useState } from 'react'
import Seo from '../components/ui/Seo'
import Hero from '../components/home/Hero'
import ImpactCounters from '../components/home/ImpactCounters'
import StorytellingFlow from '../components/home/StorytellingFlow'
import FeaturedProjects from '../components/home/FeaturedProjects'
import TestimonialsSection from '../components/home/TestimonialsSection'
import FeaturedStories from '../components/home/FeaturedStories'
import CTASection from '../components/home/CTASection'
import {
  getImpactStats,
  getFeaturedProjects,
  getTestimonials,
  getFeaturedStories,
  getActiveCampaign,
} from '../lib/api'

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let mounted = true
    Promise.all([
      getImpactStats(),
      getFeaturedProjects(3),
      getTestimonials({ featured: true }),
      getFeaturedStories(3),
      getActiveCampaign(),
    ]).then(([stats, projects, testimonials, stories, campaign]) => {
      if (mounted) setData({ stats, projects, testimonials, stories, campaign })
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <Seo
        title="Home"
        description="Sahayog Foundation runs education, food relief, healthcare and disaster-response programmes across India, reported openly every quarter."
        path="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'NGO',
          name: 'Sahayog Foundation',
          url: 'https://www.sahayogfoundation.org',
        }}
      />
      <Hero campaign={data?.campaign} />
      {data && (
        <>
          <ImpactCounters stats={data.stats} />
          <StorytellingFlow />
          <FeaturedProjects projects={data.projects} />
          <TestimonialsSection testimonials={data.testimonials} />
          <FeaturedStories stories={data.stories} />
          <CTASection />
        </>
      )}
    </>
  )
}
