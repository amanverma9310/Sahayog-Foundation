import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Newspaper } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonGrid } from '../components/ui/Skeleton'
import { getStories } from '../lib/api'
import { formatDate, readingTime } from '../lib/format'

const storyCategories = [
  'Impact Stories',
  'Field Reports',
  'Research',
  'Announcements',
  'Volunteer Stories',
  'Drive Reports',
  'NGO Updates',
]

export default function Stories() {
  const [stories, setStories] = useState(null)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setStories(null)
    const timer = setTimeout(() => {
      getStories({ category, search }).then((res) => setStories(res.items))
    }, 250)
    return () => clearTimeout(timer)
  }, [category, search])

  return (
    <>
      <Seo
        title="Stories"
        description="Impact stories, field reports and research from Sahayog Foundation's programmes."
        path="/stories"
      />
      <PageHero
        eyebrow="Field notes"
        title="Stories from where the work happens"
        image="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-16">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {['All', ...storyCategories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    category === cat ? 'bg-pine-700 text-white' : 'bg-paper-dim text-moss hover:bg-pine-50'
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
                placeholder="Search stories"
                aria-label="Search stories"
                className="w-full rounded-[3px] border border-pine-100 py-2.5 pl-9 pr-3 text-sm focus-visible:outline-marigold-500"
              />
            </div>
          </div>

          <div className="mt-10">
            {!stories && <SkeletonGrid count={6} />}
            {stories && stories.length === 0 && (
              <EmptyState icon={Newspaper} title="No stories found" description="Try a different category or search term." />
            )}
            {stories && stories.length > 0 && (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => (
                  <Link key={story.id} to={`/stories/${story.slug}`} className="group block">
                    <div className="overflow-hidden rounded-sm">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        loading="lazy"
                        className="h-52 w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-4 text-sm font-medium text-marigold-600">{story.category}</p>
                    <h3 className="mt-1.5 font-display text-xl leading-snug text-pine-700 group-hover:text-marigold-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="mt-2 text-sm text-moss line-clamp-2">{story.excerpt}</p>
                    <p className="mt-3 text-xs text-moss">
                      {formatDate(story.publishDate)} · {readingTime(story.content)} min read
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
