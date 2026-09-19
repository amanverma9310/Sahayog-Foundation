import { Outlet, useMatches } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AdminLayout() {
  const matches = useMatches()
  const current = [...matches].reverse().find((m) => m.handle?.title)
  const title = current?.handle?.title || 'Dashboard'

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar title={title} />
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
