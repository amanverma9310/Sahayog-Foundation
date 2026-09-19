import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { adminLogin, adminLogout, getAdminMe } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sahayog_admin_token')
    if (!token) {
      setLoading(false)
      return
    }
    getAdminMe()
      .then((data) => setAdmin(data))
      .catch(() => {
        localStorage.removeItem('sahayog_admin_token')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials) => {
    const { token, admin: adminData } = await adminLogin(credentials)
    localStorage.setItem('sahayog_admin_token', token)
    setAdmin(adminData)
    return adminData
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminLogout()
    } catch {
      // ignore — we're clearing local state regardless
    }
    localStorage.removeItem('sahayog_admin_token')
    setAdmin(null)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
