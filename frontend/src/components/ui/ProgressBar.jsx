import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ProgressBar({ percent, height = 8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div ref={ref} className="w-full rounded-full bg-pine-50" style={{ height }}>
      <motion.div
        className="h-full rounded-full bg-marigold-500"
        initial={{ width: 0 }}
        animate={inView ? { width: `${clamped}%` } : { width: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
