import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../ui/Container'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-marigold-500 py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_auto]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display-md font-display font-medium text-pine-800">
              Three ways to be part of this
            </h2>
            <p className="mt-3 max-w-lg text-pine-800/80 text-lg">
              Give directly, give your time, or bring your company in as a partner.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/donate" className="btn bg-pine-800 text-white hover:bg-pine-700">
              Donate
            </Link>
            <Link to="/get-involved/volunteer" className="btn border border-pine-800/30 text-pine-800 hover:bg-pine-800/10">
              Volunteer
            </Link>
            <Link to="/get-involved/csr-partnership" className="btn border border-pine-800/30 text-pine-800 hover:bg-pine-800/10">
              Partner with us
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
