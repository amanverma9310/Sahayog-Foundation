import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

export default function TestimonialsSection({ testimonials }) {
  const [index, setIndex] = useState(0)
  if (!testimonials.length) return null
  const current = testimonials[index]

  const go = (dir) => {
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length)
  }

  return (
    <section className="bg-pine-700 py-24 text-white">
      <Container>
        <SectionHeading
          eyebrow="In their words"
          title="What the work looks like up close"
          align="center"
        />
        <div className="relative mx-auto mt-14 max-w-2xl text-center">
          <Quote className="mx-auto mb-6 text-marigold-300" size={32} strokeWidth={1.5} />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display text-2xl leading-snug sm:text-3xl">"{current.quote}"</p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <img
                  src={current.photo}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="text-left">
                  <p className="font-medium">{current.name}</p>
                  <p className="text-sm text-pine-100/70">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-marigold-400' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
