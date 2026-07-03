import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/landing/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import QueryPage from './pages/query/QueryPage'
import Settings from './pages/settings/Settings'
import DashboardLayout from './layouts/DashboardLayout'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* App — query first */}
      <Route element={<DashboardLayout />}>
        <Route path="/query" element={<QueryPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App