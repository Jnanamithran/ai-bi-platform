import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getConnections, getConnectionSchema } from '../../services/database.service'

function TypeBadge({ type }) {
  const colors = {
    INT: 'text-blue-400 border-blue-900',
    INTEGER: 'text-blue-400 border-blue-900',
    VARCHAR: 'text-emerald-400 border-emerald-900',
    CHARACTER: 'text-emerald-400 border-emerald-900',
    TEXT: 'text-emerald-400 border-emerald-900',
    DECIMAL: 'text-amber-400 border-amber-900',
    NUMERIC: 'text-amber-400 border-amber-900',
    DATE: 'text-violet-400 border-violet-900',
    TIMESTAMP: 'text-zinc-400 border-zinc-800',
    BOOLEAN: 'text-pink-400 border-pink-900',
    BIGINT: 'text-blue-400 border-blue-900',
  }
  const key = Object.keys(colors).find(k => type?.toUpperCase().includes(k))
  return (
    <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${colors[key] || 'text-zinc-400 border-zinc-800'}`}>
      {type}
    </span>
  )
}

function TableRow({ table, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="border border-zinc-900 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-950 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-white font-mono">{table.name}</span>
          <span className="text-xs text-zinc-600">{table.columns.length} columns</span>
          <span className="text-xs text-zinc-700">{table.rowCount?.toLocaleString()} rows</span>
        </div>
        <span className="text-zinc-700 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-900">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950">
                    <th className="text-left px-5 py-2.5 text-xs text-zinc-600 font-medium">Column</th>
                    <th className="text-left px-5 py-2.5 text-xs text-zinc-600 font-medium">Type</th>
                    <th className="text-left px-5 py-2.5 text-xs text-zinc-600 font-medium">Key</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col) => (
                    <tr key={col.name} className="border-b border-zinc-900 last:border-0 hover:bg-zinc-950 transition-colors">
                      <td className="px-5 py-2.5 text-xs text-zinc-300 font-mono">{col.name}</td>
                      <td className="px-5 py-2.5"><TypeBadge type={col.type} /></td>
                      <td className="px-5 py-2.5 flex items-center gap-1">
                        {col.isPrimaryKey && <span className="text-[10px] text-amber-400 border border-amber-900 px-1.5 py-0.5 rounded font-mono">PK</span>}
                        {col.isForeignKey && <span className="text-[10px] text-blue-400 border border-blue-900 px-1.5 py-0.5 rounded font-mono">FK</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SchemaExplorer() {
  const [connections, setConnections] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [schema, setSchema] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchConnections()
  }, [])

  async function fetchConnections() {
    try {
      const data = await getConnections()
      setConnections(data.connections)
      if (data.connections.length > 0) {
        selectConnection(data.connections[0].id)
      }
    } catch (err) {
      setError('Failed to load connections')
    }
  }

  async function selectConnection(id) {
    setSelectedConnection(id)
    setLoading(true)
    setError('')
    try {
      const data = await getConnectionSchema(id)
      setSchema(data.schema)
    } catch (err) {
      setError('Failed to load schema')
    } finally {
      setLoading(false)
    }
  }

  const filtered = schema.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.columns.some(c => c.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Schema Explorer</h1>
        <p className="text-zinc-500 text-sm mt-1">Browse tables and columns in your connected database.</p>
      </motion.div>

      {/* Connection selector */}
      {connections.length > 1 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {connections.map(conn => (
            <button
              key={conn.id}
              onClick={() => selectConnection(conn.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                selectedConnection === conn.id
                  ? 'bg-white text-black border-white'
                  : 'text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-600'
              }`}
            >
              {conn.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      {schema.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: 'Tables', value: schema.length },
            { label: 'Total Columns', value: schema.reduce((a, t) => a + t.columns.length, 0) },
            { label: 'Total Rows', value: schema.reduce((a, t) => a + (t.rowCount || 0), 0).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="border border-zinc-900 rounded-2xl px-5 py-4">
              <p className="text-xs text-zinc-600 mb-1">{label}</p>
              <p className="text-lg font-semibold text-white font-mono">{value}</p>
            </div>
          ))}
        </motion.div>
      )}

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
            placeholder="Search tables or columns..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-600"
          />
          {search && <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-white text-xs transition-colors">✕</button>}
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="bg-red-950 border border-red-900 text-red-400 text-xs px-4 py-2.5 rounded-lg mb-4">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-zinc-600 text-sm">Loading schema...</div>
      )}

      {/* No connections */}
      {!loading && connections.length === 0 && (
        <div className="border border-dashed border-zinc-800 rounded-2xl px-6 py-16 text-center">
          <p className="text-zinc-600 text-sm mb-3">No database connected yet.</p>
          <a href="/connect" className="text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors">
            Connect a database →
          </a>
        </div>
      )}

      {/* Tables */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((table, i) => (
            <TableRow key={table.name} table={table} index={i} />
          ))}
        </div>
      )}

      {!loading && schema.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-zinc-600 text-sm">No tables match "{search}"</div>
      )}
    </div>
  )
}

export default SchemaExplorer