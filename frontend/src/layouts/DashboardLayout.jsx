import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../store/AuthContext'

function DashboardLayout() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, organization, logout } = useAuth()

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">

      <header className="h-14 border-b border-zinc-900 flex items-center px-4 justify-between fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">

        <span
          className="text-white font-semibold text-lg tracking-tight cursor-pointer"
          onClick={() => navigate('/query')}
        >
          Inquira
        </span>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: '/query', label: 'Ask' },
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/schema', label: 'Schema' },
            { to: '/saved', label: 'Saved' },
            { to: '/reports', label: 'Reports' },
            { to: '/audit', label: 'Audit' },
            { to: '/settings', label: 'Settings' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors text-sm"
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-zinc-300 hidden sm:block">{organization?.name || 'Organization'}</span>
            <span className="text-zinc-600 text-xs">{dropdownOpen ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-zinc-500 text-xs">{user?.email}</p>
                  <p className="text-zinc-600 text-xs mt-0.5">{user?.role}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { navigate('/settings'); setDropdownOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => { navigate('/connect'); setDropdownOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    Connect database
                  </button>
                </div>
                <div className="border-t border-zinc-800 py-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-900 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="flex-1 pt-14 overflow-auto">
        <Outlet />
      </main>

    </div>
  )
}

export default DashboardLayout