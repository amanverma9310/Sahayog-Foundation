import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import EmptyState from '../components/ui/EmptyState'
import { getGallery } from '../lib/api'
import { categories } from '../data/content'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'

export default function Gallery() {
  const [items, setItems] = useState(null)
  const [category, setCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    setItems(null)
    getGallery({ category: category === 'All' ? undefined : category }).then((res) => setItems(res.items))
  }, [category])

  useLockBodyScroll(lightboxIndex !== null)

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % items.length)
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, items])

  const current = items && lightboxIndex !== null ? items[lightboxIndex] : null
  const currentProject = current?.project || null

  return (
    <>
      <Seo
        title="Gallery"
        description="A visual record of Sahayog Foundation's programmes — filterable by project, category and year."
        path="/gallery"
      />
      <PageHero
        eyebrow="In pictures"
        title="The proof wall"
        description="Every image here is tied to a real project or drive, not stock photography of the work."
        image="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            {['All', ...categories.filter((c) => ['Education', 'Winter Relief', 'Healthcare', 'Women Empowerment', 'Disaster Relief', 'Environment'].includes(c))].map((cat) => (
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

          <div className="mt-10">
            {items && items.length === 0 && (
              <EmptyState icon={ImageOff} title="No photos in this category yet" description="Check back soon or choose a different filter." />
            )}
            {items && items.length > 0 && (
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
                {items.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setLightboxIndex(i)}
                    className="block w-full overflow-hidden rounded-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.caption}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
              className="absolute right-5 top-5 text-white/80 hover:text-white"
            >
              <X size={28} />
            </button>
            <button
              onClick={() => setLightboxIndex((i) => (i - 1 + items.length) % items.length)}
              aria-label="Previous image"
              className="absolute left-4 text-white/70 hover:text-white"
            >
              <ChevronLeft size={32} />
            </button>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-h-[80vh] max-w-3xl"
            >
              <img src={current.image} alt={current.caption} className="max-h-[70vh] w-full rounded-sm object-contain" />
              <div className="mt-4 text-center text-white">
                <p>{current.caption}</p>
                {currentProject && <p className="mt-1 text-sm text-white/60">{currentProject.title}</p>}
              </div>
            </motion.div>
            <button
              onClick={() => setLightboxIndex((i) => (i + 1) % items.length)}
              aria-label="Next image"
              className="absolute right-4 text-white/70 hover:text-white"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
