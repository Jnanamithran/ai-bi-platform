import { useState } from 'react'
import { motion } from 'framer-motion'

const MOCK_REPORTS = [
  { id: 1, name: 'Revenue Report — June 2025', type: 'PDF', size: '1.2 MB', generatedAt: '2 hrs ago', query: 'Total revenue by product for June 2025' },
  { id: 2, name: 'Top Customers — Q2 2025', type: 'XLSX', size: '840 KB', generatedAt: 'Yesterday', query: 'Top 10 customers by order value Q2' },
  { id: 3, name: 'Inventory Status', type: 'CSV', size: '320 KB', generatedAt: '2 days ago', query: 'Current inventory levels by warehouse' },
  { id: 4, name: 'Sales Summary — May 2025', type: 'PDF', size: '2.1 MB', generatedAt: '5 days ago', query: 'Monthly sales summary with trends' },
  { id: 5, name: 'New Users — June 2025', type: 'CSV', size: '180 KB', generatedAt: '1 week ago', query: 'New user signups by week for June' },
]

const TYPE_COLORS = {
  PDF: 'text-red-400 border-red-900',
  XLSX: 'text-emerald-400 border-emerald-900',
  CSV: 'text-blue-400 border-blue-900',
}

function Reports() {
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [search, setSearch] = useState('')

  const filtered = reports.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.query.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id) {
    setReports(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-zinc-500 text-sm mt-1">Download and manage your generated reports.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: 'Total Reports', value: reports.length },
          { label: 'This Week', value: 2 },
          { label: 'Storage Used', value: '4.6 MB' },
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
            placeholder="Search reports..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-600"
          />
          {search && <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-white text-xs transition-colors">✕</button>}
        </div>
      </motion.div>

      {/* Reports List */}
      <div className="space-y-3">
        {filtered.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="border border-zinc-900 hover:border-zinc-700 rounded-2xl px-5 py-4 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${TYPE_COLORS[report.type]}`}>
                    {report.type}
                  </span>
                  <p className="text-sm text-white font-medium truncate">{report.name}</p>
                </div>
                <p className="text-xs text-zinc-600 truncate">{report.query}</p>
                <p className="text-xs text-zinc-700 mt-1">{report.size} · {report.generatedAt}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button className="text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-colors">
                  Download
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-600 text-sm">
            No reports found.
          </div>
        )}
      </div>

    </div>
  )
}

export default Reports