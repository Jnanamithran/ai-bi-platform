import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAuditLogs } from '../../services/query.service'

const ACTION_COLORS = {
  'Ran query': 'text-violet-400 border-violet-900',
  'Saved to dashboard': 'text-blue-400 border-blue-900',
  'Connected database': 'text-emerald-400 border-emerald-900',
  'Invited member': 'text-amber-400 border-amber-900',
  'Exported report': 'text-zinc-400 border-zinc-800',
  'Created role': 'text-pink-400 border-pink-900',
  'Logged in': 'text-zinc-400 border-zinc-800',
  'Registered': 'text-emerald-400 border-emerald-900',
}

function LogRow({ log, index }) {
  const actionColor = ACTION_COLORS[log.action] || 'text-zinc-400 border-zinc-800'
  const timeStr = new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="border border-zinc-900 hover:border-zinc-700 rounded-xl px-5 py-3.5 flex items-center gap-4 transition-colors"
    >
      <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
        {log.user?.name?.[0]?.toUpperCase() || 'U'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-xs text-zinc-300 font-medium">{log.user?.name}</span>
          <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${actionColor}`}>{log.action}</span>
        </div>
        <p className="text-xs text-zinc-600 truncate">{log.detail}</p>
      </div>
      <span className="text-xs text-zinc-700 font-mono flex-shrink-0">{timeStr}</span>
    </motion.div>
  )
}

function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      const data = await getAuditLogs()
      setLogs(data.logs)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = logs.filter(log =>
    log.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.detail?.toLowerCase().includes(search.toLowerCase())
  )

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
          { label: 'Total Events', value: total },
          { label: 'Today', value: logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length },
          { label: 'This Session', value: logs.length },
        ].map(({ label, value }) => (
          <div key={label} className="border border-zinc-900 rounded-2xl px-5 py-4">
            <p className="text-xs text-zinc-600 mb-1">{label}</p>
            <p className="text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-zinc-600 transition-colors"
      >
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
      </motion.div>

      {loading && <div className="text-center py-16 text-zinc-600 text-sm">Loading logs...</div>}

      {!loading && (
        <div className="space-y-2">
          {filtered.map((log, i) => <LogRow key={log.id} log={log} index={i} />)}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-600 text-sm">No logs found.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default AuditLogs