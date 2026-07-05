import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/landing/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import QueryPage from './pages/query/QueryPage'
import Settings from './pages/settings/Settings'
import DashboardLayout from './layouts/DashboardLayout'
import NotFound from './pages/NotFound'
import SchemaExplorer from './pages/schema/SchemaExplorer'
import SavedDashboards from './pages/saved/SavedDashboards'
import Reports from './pages/reports/Reports'
import AuditLogs from './pages/audit/AuditLogs'
import ConnectDatabase from './pages/connect/ConnectDatabase'
import Onboarding from './pages/onboarding/Onboarding'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* App */}
      <Route element={<DashboardLayout />}>
        <Route path="/query" element={<QueryPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/schema" element={<SchemaExplorer />} />
        <Route path="/saved" element={<SavedDashboards />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/connect" element={<ConnectDatabase />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App