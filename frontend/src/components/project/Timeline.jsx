import { motion } from 'framer-motion'

export default function Timeline({ events }) {
  return (
    <div className="relative border-l border-pine-100 pl-8 sm:pl-10">
      {events.map((event, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="relative pb-12 last:pb-0"
        >
          <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-marigold-500 sm:-left-[calc(2.5rem+5px)]" />
          <p className="font-display text-lg text-marigold-600">{event.year}</p>
          <p className="mt-1 font-medium text-pine-700">{event.title}</p>
          <p className="mt-1.5 text-moss leading-relaxed">{event.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
