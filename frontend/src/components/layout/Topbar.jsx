import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from './NotificationBell'
import MobileSidebar from './MobileSidebar'

export default function Topbar({ title }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="text-gray-500 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-ink">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="hidden items-center gap-2 border-l border-gray-200 pl-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-medium text-ink">{admin?.name}</p>
              <p className="text-xs text-gray-500">{admin?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
              <span className="font-semibold text-ink">Sahayog Admin</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <MobileSidebar onNavigate={() => setMobileOpen(false)} />
            <div className="border-t border-gray-100 p-4">
              <button onClick={handleLogout} className="btn-outline w-full justify-center">
                <LogOut size={15} /> Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
