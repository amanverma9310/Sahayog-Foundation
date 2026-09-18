import { motion } from 'framer-motion'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  size = 'md',
}) {
  const sizeClass = size === 'lg' ? 'text-display-lg' : 'text-display-md'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}
    >
      {eyebrow && <p className="label-eyebrow mb-3">{eyebrow}</p>}
      <h2 className={`${sizeClass} font-display font-medium text-pine-700`}>{title}</h2>
      {description && <p className="mt-4 text-lg text-moss leading-relaxed">{description}</p>}
    </motion.div>
  )
}
