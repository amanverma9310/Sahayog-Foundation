import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function StorytellingFlow() {
  return (
    <section className="bg-paper">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[520px]"
        >
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1400&auto=format&fit=crop"
            alt="Meena reading her first storybook at the Govindpuri learning centre"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="label-eyebrow"
          >
            The problem
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-display text-2xl text-pine-700 sm:text-3xl leading-snug"
          >
            61% of children in our partner colonies couldn't read a grade 2-level paragraph —
            despite regular school attendance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 border-t border-pine-100 pt-10"
          >
            <p className="label-eyebrow">What we did</p>
            <p className="mt-3 text-lg text-moss leading-relaxed">
              Small reading groups of eight to ten, run close to home, with a termly assessment
              shared openly with every parent — not just an annual report.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex items-end justify-between gap-6 border-t border-pine-100 pt-10"
          >
            <div>
              <p className="font-display text-4xl text-marigold-600">1.8</p>
              <p className="mt-1 text-sm text-moss">Average grade levels of reading improvement</p>
            </div>
            <Link to="/projects/first-bench-learning-centres" className="link-underline flex items-center gap-1.5 text-pine-700 font-medium whitespace-nowrap">
              Read Meena's story <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
