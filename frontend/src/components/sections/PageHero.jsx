import { motion } from 'framer-motion'

export default function PageHero({ eyebrow, title, description, image }) {
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-pine-800 pt-24">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-900/90 via-pine-900/50 to-pine-900/30" />
        </div>
      )}
      <div className="container-edit relative z-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {eyebrow && <p className="mb-3 text-sm font-medium text-marigold-300">{eyebrow}</p>}
          <h1 className="text-display-md font-display font-medium text-white sm:text-display-lg max-w-3xl">{title}</h1>
          {description && <p className="mt-4 max-w-xl text-lg text-pine-50/85">{description}</p>}
        </motion.div>
      </div>
    </section>
  )
}
