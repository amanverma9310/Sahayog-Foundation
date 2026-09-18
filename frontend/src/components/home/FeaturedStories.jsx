import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { formatDate, readingTime } from '../../lib/format'

export default function FeaturedStories({ stories }) {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow="From the field" title="Recent stories" />
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to={`/stories/${story.slug}`} className="group block">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    loading="lazy"
                    className="h-56 w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-sm text-marigold-600 font-medium">{story.category}</p>
                <h3 className="mt-1.5 font-display text-xl leading-snug text-pine-700 group-hover:text-marigold-600 transition-colors">
                  {story.title}
                </h3>
                <p className="mt-2 text-sm text-moss">
                  {formatDate(story.publishDate)} · {readingTime(story.content)} min read
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
        <Link to="/stories" className="link-underline mt-10 flex items-center gap-1.5 font-medium text-pine-700">
          Read more stories <ArrowRight size={16} />
        </Link>
      </Container>
    </section>
  )
}
