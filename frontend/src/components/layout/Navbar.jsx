import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Heart } from 'lucide-react'
import { useScrolled } from '../../hooks/useScrolled'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Work', to: '/projects' },
  { label: 'Drives', to: '/drives' },
  { label: 'Impact', to: '/impact' },
  { label: 'Stories', to: '/stories' },
  { label: 'Gallery', to: '/gallery' },
]

const getInvolvedLinks = [
  { label: 'Volunteer', to: '/get-involved/volunteer', description: 'Give your time in the field' },
  { label: 'Internship', to: '/get-involved/internship', description: 'Structured roles for students' },
  { label: 'Sponsor a Drive', to: '/get-involved/sponsor-a-drive', description: 'Fund a specific relief drive' },
  { label: 'Corporate / CSR', to: '/get-involved/csr-partnership', description: 'Partner at an organisational level' },
]

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const scrolled = useScrolled(40)
  const transparent = isHome && !scrolled
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileGetInvolvedOpen, setMobileGetInvolvedOpen] = useState(false)
  const dropdownRef = useRef(null)

  useLockBodyScroll(mobileOpen)

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const textTone = transparent ? 'text-white' : 'text-pine-700'
  const hoverTone = transparent ? 'hover:text-marigold-200' : 'hover:text-marigold-600'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-paper/95 backdrop-blur-sm shadow-card'
      }`}
    >
      <div className="container-edit flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Sahayog Foundation home">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              transparent ? 'bg-white/15' : 'bg-pine-500'
            }`}
          >
            <Heart size={17} className={transparent ? 'text-white' : 'text-marigold-300'} fill="currentColor" strokeWidth={0} />
          </span>
          <span className={`font-display text-xl ${textTone}`}>Sahayog</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `link-underline text-[0.95rem] font-medium ${textTone} ${hoverTone} ${
                  isActive ? (transparent ? 'after:w-full' : 'after:w-full text-marigold-600') : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 text-[0.95rem] font-medium ${textTone} ${hoverTone}`}
            >
              Get Involved
              <ChevronDown size={15} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-3 w-72 rounded-sm border border-pine-100 bg-paper p-2 shadow-soft"
                >
                  {getInvolvedLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block rounded-sm px-4 py-3 hover:bg-pine-50"
                    >
                      <p className="font-medium text-pine-700">{item.label}</p>
                      <p className="mt-0.5 text-sm text-moss">{item.description}</p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink
            to="/contact"
            className={`link-underline text-[0.95rem] font-medium ${textTone} ${hoverTone}`}
          >
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/donate" className="btn-primary hidden sm:inline-flex">
            Donate Now
          </Link>
          <button
            className={`p-2 lg:hidden ${textTone}`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-paper border-t border-pine-100 lg:hidden"
          >
            <nav className="container-edit flex flex-col gap-1 py-4" aria-label="Mobile primary">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-sm px-2 py-3 text-base font-medium ${isActive ? 'text-marigold-600' : 'text-pine-700'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                className="flex items-center justify-between rounded-sm px-2 py-3 text-base font-medium text-pine-700"
                aria-expanded={mobileGetInvolvedOpen}
                onClick={() => setMobileGetInvolvedOpen((v) => !v)}
              >
                Get Involved
                <ChevronDown size={18} className={`transition-transform ${mobileGetInvolvedOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {mobileGetInvolvedOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-4"
                  >
                    {getInvolvedLinks.map((item) => (
                      <Link key={item.to} to={item.to} className="block py-2.5 text-moss">
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <NavLink to="/contact" className="rounded-sm px-2 py-3 text-base font-medium text-pine-700">
                Contact
              </NavLink>
              <Link to="/donate" className="btn-primary mt-3 justify-center">
                Donate Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
