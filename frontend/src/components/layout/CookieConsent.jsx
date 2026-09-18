import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('sahayog_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  function respond(value) {
    localStorage.setItem('sahayog_cookie_consent', value)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-sm border border-pine-100 bg-paper p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-moss">
            We use minimal cookies for analytics and to keep the site working well. See our{' '}
            <a href="/legal/privacy-policy" className="text-pine-700 underline">
              Privacy Policy
            </a>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <button onClick={() => respond('declined')} className="btn-outline px-4 py-2 text-sm">
              Decline
            </button>
            <button onClick={() => respond('accepted')} className="btn-primary px-4 py-2 text-sm">
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
