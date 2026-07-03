import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-black flex">

      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-black border-r border-zinc-800 flex flex-col transition-all duration-300`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-zinc-800">
          {!collapsed && (
            <h1 className="text-white font-bold text-lg">AI <span className="text-blue-500">BI</span></h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-zinc-400 hover:text-white text-xl"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`
            }
          >
            <span>📊</span>
            {!collapsed && 'Dashboard'}
          </NavLink>

          <NavLink
            to="/query"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`
            }
          >
            <span>💬</span>
            {!collapsed && 'Ask a Question'}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`
            }
          >
            <span>⚙️</span>
            {!collapsed && 'Settings'}
          </NavLink>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              J
            </div>
            {!collapsed && (
              <div>
                <p className="text-white text-sm font-medium">Jnanamithran</p>
                <p className="text-zinc-500 text-xs">Owner</p>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="h-16 border-b border-zinc-800 flex items-center px-6">
          <h2 className="text-white font-medium">Dashboard</h2>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-zinc-400 text-sm">Acme Corp</span>
            <button className="text-zinc-400 hover:text-white text-sm">Logout</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default DashboardLayout