import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MOCK_SCHEMA = [
  {
    name: 'sales',
    rows: '124,832',
    columns: [
      { name: 'id', type: 'INT', pk: true },
      { name: 'product_id', type: 'INT', fk: true },
      { name: 'customer_id', type: 'INT', fk: true },
      { name: 'quantity', type: 'INT' },
      { name: 'revenue', type: 'DECIMAL' },
      { name: 'sale_date', type: 'DATE' },
      { name: 'created_at', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'products',
    rows: '1,240',
    columns: [
      { name: 'id', type: 'INT', pk: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'category', type: 'VARCHAR' },
      { name: 'price', type: 'DECIMAL' },
      { name: 'stock', type: 'INT' },
      { name: 'created_at', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'customers',
    rows: '8,412',
    columns: [
      { name: 'id', type: 'INT', pk: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'phone', type: 'VARCHAR' },
      { name: 'region', type: 'VARCHAR' },
      { name: 'created_at', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'orders',
    rows: '42,100',
    columns: [
      { name: 'id', type: 'INT', pk: true },
      { name: 'customer_id', type: 'INT', fk: true },
      { name: 'status', type: 'VARCHAR' },
      { name: 'total', type: 'DECIMAL' },
      { name: 'order_date', type: 'DATE' },
      { name: 'updated_at', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'inventory',
    rows: '3,200',
    columns: [
      { name: 'id', type: 'INT', pk: true },
      { name: 'product_id', type: 'INT', fk: true },
      { name: 'quantity', type: 'INT' },
      { name: 'warehouse', type: 'VARCHAR' },
      { name: 'updated_at', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'users',
    rows: '18',
    columns: [
      { name: 'id', type: 'INT', pk: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'role', type: 'VARCHAR' },
      { name: 'created_at', type: 'TIMESTAMP' },
    ],
  },
]

function TypeBadge({ type }) {
  const colors = {
    INT: 'text-blue-400 border-blue-900',
    VARCHAR: 'text-emerald-400 border-emerald-900',
    DECIMAL: 'text-amber-400 border-amber-900',
    DATE: 'text-violet-400 border-violet-900',
    TIMESTAMP: 'text-zinc-400 border-zinc-800',
  }
  return (
    <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${colors[type] || 'text-zinc-400 border-zinc-800'}`}>
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
          <span className="text-xs text-zinc-700">{table.rows} rows</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-700 text-xs">{open ? '▲' : '▼'}</span>
        </div>
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
                  {table.columns.map((col, i) => (
                    <tr key={col.name} className="border-b border-zinc-900 last:border-0 hover:bg-zinc-950 transition-colors">
                      <td className="px-5 py-2.5 text-xs text-zinc-300 font-mono">{col.name}</td>
                      <td className="px-5 py-2.5">
                        <TypeBadge type={col.type} />
                      </td>
                      <td className="px-5 py-2.5">
                        {col.pk && <span className="text-[10px] text-amber-400 border border-amber-900 px-1.5 py-0.5 rounded font-mono">PK</span>}
                        {col.fk && <span className="text-[10px] text-blue-400 border border-blue-900 px-1.5 py-0.5 rounded font-mono">FK</span>}
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
  const [search, setSearch] = useState('')

  const filtered = MOCK_SCHEMA.filter(t =>
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

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: 'Tables', value: MOCK_SCHEMA.length },
          { label: 'Total Columns', value: MOCK_SCHEMA.reduce((a, t) => a + t.columns.length, 0) },
          { label: 'Database', value: 'PostgreSQL' },
        ].map(({ label, value }) => (
          <div key={label} className="border border-zinc-900 rounded-2xl px-5 py-4">
            <p className="text-xs text-zinc-600 mb-1">{label}</p>
            <p className="text-lg font-semibold text-white font-mono">{value}</p>
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
            placeholder="Search tables or columns..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-600"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-white transition-colors text-xs">✕</button>
          )}
        </div>
      </motion.div>

      {/* Tables */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((table, i) => (
            <TableRow key={table.name} table={table} index={i} />
          ))
        ) : (
          <div className="text-center py-16 text-zinc-600 text-sm">
            No tables or columns match "{search}"
          </div>
        )}
      </div>

    </div>
  )
}

export default SchemaExplorer