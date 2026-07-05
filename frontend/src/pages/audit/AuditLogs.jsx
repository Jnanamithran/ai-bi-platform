import { useState } from 'react'
import { motion } from 'framer-motion'

const MOCK_LOGS = [
  { id: 1, user: 'Jnanamithran', action: 'Ran query', detail: 'What was our total revenue last month?', time: '11:02 AM', date: 'Today', status: 'Success' },
  { id: 2, user: 'Jnanamithran', action: 'Saved to dashboard', detail: 'Revenue Dashboard', time: '10:55 AM', date: 'Today', status: 'Success' },
  { id: 3, user: 'John Doe', action: 'Ran query', detail: 'Show top 5 customers by order value', time: '10:30 AM', date: 'Today', status: 'Success' },
  { id: 4, user: 'Jnanamithran', action: 'Connected database', detail: 'production-db (PostgreSQL)', time: '09:30 AM', date: 'Today', status: 'Success' },
  { id: 5, user: 'Jnanamithran', action: 'Invited member', detail: 'john@acme.com as Analyst', time: '09:15 AM', date: 'Today', status: 'Success' },
  { id: 6, user: 'John Doe', action: 'Ran query', detail: 'Monthly revenue trend for this year', time: '04:12 PM', date: 'Yesterday', status: 'Success' },
  { id: 7, user: 'Jnanamithran', action: 'Ran query', detail: 'Current inventory status', time: '03:45 PM', date: 'Yesterday', status: 'Failed' },
  { id: 8, user: 'Jnanamithran', action: 'Exported report', detail: 'Revenue Report — June 2025.pdf', time: '02:10 PM', date: 'Yesterday', status: 'Success' },
  { id: 9, user: 'John Doe', action: 'Ran query', detail: 'How many new users signed up this week?', time: '01:00 PM', date: 'Yesterday', status: 'Success' },
  { id: 10, user: 'Jnanamithran', action: 'Created role', detail: 'Data Lead', time: '11:30 AM', date: 'Yesterday', status: 'Success' },
]

const ACTION_COLORS = {
  'Ran query': 'text-violet-400 border-violet-900',
  'Saved to dashboard': 'text-blue-400 border-blue-900',
  'Connected database': 'text-emerald-400 border-emerald-900',
  'Invited member': 'text-amber-400 border-amber-900',
  'Exported report': 'text-zinc-400 border-zinc-800',
  'Created role': 'text-pink-400 border-pink-900',
}

function AuditLogs() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filters = ['All', 'Ran query', 'Saved to dashboard', 'Connected database', 'Invited member', 'Exported report']

  const filtered = MOCK_LOGS.filter(log => {
    const matchesFilter = filter === 'All' || log.action === filter
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const today = filtered.filter(l => l.date === 'Today')
  const yesterday = filtered.filter(l => l.date === 'Yesterday')

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-zinc-500 text-sm mt-1">Track all queries, actions, and team activity.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: 'Total Events', value: MOCK_LOGS.length },
          { label: 'Today', value: MOCK_LOGS.filter(l => l.date === 'Today').length },
          { label: 'Failed', value: MOCK_LOGS.filter(l => l.status === 'Failed').length },
        ].map(({ label, value }) => (
          <div key={label} className="border border-zinc-900 rounded-2xl px-5 py-4">
            <p className="text-xs text-zinc-600 mb-1">{label}</p>
            <p className="text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </motion.div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-3 mb-6"
      >
        <div className="border border-zinc-800 rounded-xl overflow-hidden focus-within:border-zinc-600 transition-colors">
          <div className="flex items-center px-4 py-3 gap-3">
            <svg className="text-zinc-600 flex-shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by user, action, or detail..."
              className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-600"
            />
            {search && <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-white text-xs transition-colors">✕</button>}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-white text-black border-white'
                  : 'text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logs */}
      <div className="space-y-6">
        {today.length > 0 && (
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Today</p>
            <div className="space-y-2">
              {today.map((log, i) => <LogRow key={log.id} log={log} index={i} />)}
            </div>
          </div>
        )}

        {yesterday.length > 0 && (
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Yesterday</p>
            <div className="space-y-2">
              {yesterday.map((log, i) => <LogRow key={log.id} log={log} index={i} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-600 text-sm">No logs match your search.</div>
        )}
      </div>

    </div>
  )
}

function LogRow({ log, index }) {
  const actionColor = ACTION_COLORS[log.action] || 'text-zinc-400 border-zinc-800'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="border border-zinc-900 hover:border-zinc-700 rounded-xl px-5 py-3.5 flex items-center gap-4 transition-colors"
    >
      <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
        {log.user[0].toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-xs text-zinc-300 font-medium">{log.user}</span>
          <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${actionColor}`}>{log.action}</span>
        </div>
        <p className="text-xs text-zinc-600 truncate">{log.detail}</p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {log.status === 'Failed' && (
          <span className="text-[10px] text-red-400 border border-red-900 px-1.5 py-0.5 rounded font-mono">Failed</span>
        )}
        <span className="text-xs text-zinc-700 font-mono">{log.time}</span>
      </div>
    </motion.div>
  )
}

export default AuditLogs