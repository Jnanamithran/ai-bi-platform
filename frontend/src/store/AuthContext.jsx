import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    const savedOrg = localStorage.getItem('organization')

    if (token && savedUser && savedOrg) {
      setUser(JSON.parse(savedUser))
      setOrganization(JSON.parse(savedOrg))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await authService.login({ email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('organization', JSON.stringify(data.organization))
    setUser(data.user)
    setOrganization(data.organization)
    navigate('/dashboard')
  }

  const register = async (name, email, password, organizationName) => {
    const data = await authService.register({ name, email, password, organizationName })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('organization', JSON.stringify(data.organization))
    setUser(data.user)
    setOrganization(data.organization)
    navigate('/onboarding')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('organization')
    setUser(null)
    setOrganization(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, organization, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}