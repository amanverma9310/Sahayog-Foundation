import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero({ campaign }) {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-pine-800">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900/90 via-pine-900/40 to-pine-900/20" />
      </div>

      <div className="container-edit relative z-10 w-full pb-20 pt-40">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            {campaign && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-marigold-400" />
                {campaign.title}
              </motion.div>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-display-lg font-display font-medium text-white sm:text-display-xl"
            >
              Relief that reaches. Reporting that holds up.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-lg text-lg text-pine-50/90 leading-relaxed"
            >
              We run education, healthcare, food relief and disaster-response programmes across
              India — and publish exactly where every rupee goes, every quarter.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link to="/donate" className="btn-primary">
                Donate Now
                <ArrowRight size={17} />
              </Link>
              <Link to="/projects" className="btn text-white border border-white/30 hover:bg-white/10">
                Explore Our Work
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-10 border-t border-white/20 pt-6 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0"
          >
            <div>
              <p className="font-display text-3xl text-white">184,320+</p>
              <p className="mt-1 text-sm text-pine-100/70">Lives impacted</p>
            </div>
            <div>
              <p className="font-display text-3xl text-white">38</p>
              <p className="mt-1 text-sm text-pine-100/70">Cities reached</p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70"
        aria-hidden="true"
      >
        <ChevronDown size={20} className="animate-bounce" style={{ animationDuration: '2s' }} />
      </motion.div>
    </section>
  )
}
