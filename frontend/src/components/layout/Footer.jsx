import { Link } from 'react-router-dom'
import { Instagram, Facebook, Linkedin, Twitter, Youtube, Heart, ArrowRight } from 'lucide-react'
import { orgInfo } from '../../data/content'
import { useState } from 'react'
import { submitNewsletterSignup } from '../../lib/api'

const columns = [
  {
    title: 'Our Work',
    links: [
      { label: 'Projects', to: '/projects' },
      { label: 'Drives', to: '/drives' },
      { label: 'Impact', to: '/impact' },
      { label: 'Stories', to: '/stories' },
      { label: 'Transparency', to: '/transparency' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Donate', to: '/donate' },
      { label: 'Volunteer', to: '/get-involved/volunteer' },
      { label: 'Internship', to: '/get-involved/internship' },
      { label: 'Sponsor a Drive', to: '/get-involved/sponsor-a-drive' },
      { label: 'CSR Partnership', to: '/get-involved/csr-partnership' },
    ],
  },
  {
    title: 'Organisation',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/get-involved/internship' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/legal/privacy-policy' },
      { label: 'Terms & Conditions', to: '/legal/terms' },
      { label: 'Donation Policy', to: '/legal/donation-policy' },
      { label: 'Refund Policy', to: '/legal/refund-policy' },
    ],
  },
]

const socialLinks = [
  { icon: Instagram, href: orgInfo.social.instagram, label: 'Instagram' },
  { icon: Facebook, href: orgInfo.social.facebook, label: 'Facebook' },
  { icon: Linkedin, href: orgInfo.social.linkedin, label: 'LinkedIn' },
  { icon: Twitter, href: orgInfo.social.x, label: 'X' },
  { icon: Youtube, href: orgInfo.social.youtube, label: 'YouTube' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await submitNewsletterSignup({ email })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="bg-pine-700 text-pine-50">
      <div className="container-edit py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Heart size={17} className="text-marigold-300" fill="currentColor" strokeWidth={0} />
              </span>
              <span className="font-display text-xl text-white">Sahayog</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-pine-100/80">
              {orgInfo.tagline} Education, food relief, healthcare and disaster response — reported openly, every quarter.
            </p>
            <form onSubmit={handleSubscribe} className="mt-6 max-w-xs">
              <label htmlFor="footer-email" className="text-sm font-medium text-white">
                Get programme updates
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[3px] border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-pine-100/50 focus-visible:outline-marigold-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] bg-marigold-500 text-pine-800 transition-colors hover:bg-marigold-400"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
              {status === 'success' && <p className="mt-2 text-sm text-marigold-300">Subscribed — thank you.</p>}
              {status === 'error' && <p className="mt-2 text-sm text-marigold-300">Something went wrong. Try again.</p>}
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-medium text-white">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-sm text-pine-100/75 hover:text-marigold-300">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-pine-100/60">
            <p>{orgInfo.name} · {orgInfo.registrationNumber}</p>
            <p className="mt-1">
              {orgInfo.address} · <a href={`mailto:${orgInfo.email}`} className="hover:text-marigold-300">{orgInfo.email}</a> · {orgInfo.phone}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-pine-100/70 hover:text-marigold-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <p className="mt-6 text-xs text-pine-100/40">© {new Date().getFullYear()} {orgInfo.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
