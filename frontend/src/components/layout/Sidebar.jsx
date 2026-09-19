import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, Truck, BookOpen, Image, Quote, Users, Award,
  Newspaper, Handshake, HelpCircle, FileText, Megaphone, BarChart3, Wallet,
  Receipt, Mail, HeartHandshake, Briefcase, Building2, UserCog, Settings, Send,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const sections = [
  {
    title: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: 'any' }],
  },
  {
    title: 'Content',
    items: [
      { to: '/projects', label: 'Projects', icon: FolderKanban, roles: ['Super Admin', 'Project Manager'] },
      { to: '/drives', label: 'Drives', icon: Truck, roles: ['Super Admin', 'Project Manager'] },
      { to: '/stories', label: 'Stories', icon: BookOpen, roles: ['Super Admin', 'Content Manager'] },
      { to: '/gallery', label: 'Gallery', icon: Image, roles: ['Super Admin', 'Content Manager'] },
      { to: '/testimonials', label: 'Testimonials', icon: Quote, roles: ['Super Admin', 'Content Manager'] },
      { to: '/team', label: 'Team', icon: Users, roles: ['Super Admin', 'Content Manager'] },
      { to: '/awards', label: 'Awards', icon: Award, roles: ['Super Admin', 'Content Manager'] },
      { to: '/press', label: 'Press', icon: Newspaper, roles: ['Super Admin', 'Content Manager'] },
      { to: '/partners', label: 'Partners', icon: Handshake, roles: ['Super Admin', 'Content Manager'] },
      { to: '/faqs', label: 'FAQs', icon: HelpCircle, roles: ['Super Admin', 'Content Manager'] },
      { to: '/reports', label: 'Reports', icon: FileText, roles: ['Super Admin', 'Donation Manager'] },
      { to: '/campaigns', label: 'Campaigns', icon: Megaphone, roles: ['Super Admin', 'Donation Manager'] },
      { to: '/impact-stats', label: 'Impact Stats', icon: BarChart3, roles: ['Super Admin', 'Content Manager'] },
    ],
  },
  {
    title: 'Donations',
    items: [
      { to: '/donations', label: 'Donations', icon: Wallet, roles: ['Super Admin', 'Donation Manager'] },
      { to: '/receipt-requests', label: '80G Requests', icon: Receipt, roles: ['Super Admin', 'Donation Manager'] },
    ],
  },
  {
    title: 'Enquiries',
    items: [
      { to: '/contact-messages', label: 'Contact Messages', icon: Mail, roles: ['Super Admin', 'Content Manager'] },
      { to: '/volunteers', label: 'Volunteers', icon: HeartHandshake, roles: ['Super Admin', 'Content Manager'] },
      { to: '/internships', label: 'Internships', icon: Briefcase, roles: ['Super Admin', 'Content Manager'] },
      { to: '/csr-enquiries', label: 'CSR Enquiries', icon: Building2, roles: ['Super Admin', 'Donation Manager'] },
      { to: '/sponsor-requests', label: 'Sponsor Requests', icon: HeartHandshake, roles: ['Super Admin', 'Donation Manager'] },
      { to: '/newsletter', label: 'Newsletter', icon: Send, roles: ['Super Admin', 'Content Manager'] },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/admins', label: 'Admin Users', icon: UserCog, roles: ['Super Admin'] },
      { to: '/settings', label: 'Site Settings', icon: Settings, roles: ['Super Admin'] },
    ],
  },
]

export function SidebarNav({ onNavigate }) {
  const { admin } = useAuth()

  return (
    <nav className="flex-1 px-3 py-4">
      {sections.map((section) => {
        const visibleItems = section.items.filter(
          (item) => item.roles === 'any' || item.roles.includes(admin?.role)
        )
        if (visibleItems.length === 0) return null
        return (
          <div key={section.title} className="mb-5">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{section.title}</p>
            <div className="mt-1.5 space-y-0.5">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-pine-50 text-pine-700' : 'text-gray-600 hover:bg-gray-50 hover:text-ink'
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white lg:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-pine-600 text-sm font-semibold text-white">
          S
        </span>
        <span className="font-semibold text-ink">Sahayog Admin</span>
      </div>
      <SidebarNav />
    </aside>
  )
}
