import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Restricts a route to specific admin roles. This is a UX convenience only
// — the backend independently enforces the same roles server-side on every
// write endpoint, so this never functions as the real access control.
export default function RoleRoute({ roles }) {
  const { admin } = useAuth()
  if (!admin || !roles.includes(admin.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
