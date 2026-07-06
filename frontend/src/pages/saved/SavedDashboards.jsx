import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const MOCK_DASHBOARDS = [
  {
    id: 1,
    name: 'Sales Dashboard',
    desc: 'Monthly revenue, top products, and sales trends.',
    queries: 4,
    updatedAt: '2 hrs ago',
    pinned: true,
  },
  {
    id: 2,
    name: 'Finance Dashboard',
    desc: 'Expense tracking, revenue breakdowns, and forecasts.',
    queries: 3,
    updatedAt: 'Yesterday',
    pinned: false,
  },
  {
    id: 3,
    name: 'Inventory Dashboard',
    desc: 'Stock levels, reorder alerts, and warehouse status.',
    queries: 5,
    updatedAt: '2 days ago',
    pinned: false,
  },
  {
    id: 4,
    name: 'Customer Analytics',
    desc: 'Retention, acquisition, and top customers by value.',
    queries: 6,
    updatedAt: '3 days ago',
    pinned: true,
  },
]

function NewDashboardModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-white font-medium text-sm">New Dashboard</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Dashboard Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sales Dashboard"
              className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Description</label>
            <input
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="What does this dashboard track?"
              className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onCreate({ name, desc })}
            disabled={!name.trim()}
            className="bg-white text-black text-xs font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Create Dashboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SavedDashboards() {
  const navigate = useNavigate()
  const [dashboards, setDashboards] = useState(MOCK_DASHBOARDS)
  const [modal, setModal] = useState(false)

  function handleCreate({ name, desc }) {
    setDashboards(prev => [...prev, {
      id: Date.now(),
      name,
      desc,
      queries: 0,
      updatedAt: 'Just now',
      pinned: false,
    }])
    setModal(false)
  }

  function handleDelete(id) {
    setDashboards(prev => prev.filter(d => d.id !== id))
  }

  function handlePin(id) {
    setDashboards(prev => prev.map(d => d.id === id ? { ...d, pinned: !d.pinned } : d))
  }

  const pinned = dashboards.filter(d => d.pinned)
  const rest = dashboards.filter(d => !d.pinned)

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-5xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between mb-10"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Saved Dashboards</h1>
          <p className="text-zinc-500 text-sm mt-1">Organize and access your pinned query collections.</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors"
        >
          + New Dashboard
        </button>
      </motion.div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="mb-8">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Pinned</p>
          <div className="grid md:grid-cols-2 gap-4">
            {pinned.map((d, i) => (
              <DashboardCard key={d.id} d={d} index={i} onDelete={handleDelete} onPin={handlePin} navigate={navigate} />
            ))}
          </div>
        </div>
      )}

      {/* All */}
      {rest.length > 0 && (
        <div>
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">All Dashboards</p>
          <div className="grid md:grid-cols-2 gap-4">
            {rest.map((d, i) => (
              <DashboardCard key={d.id} d={d} index={i} onDelete={handleDelete} onPin={handlePin} navigate={navigate} />
            ))}
          </div>
        </div>
      )}

      {dashboards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-dashed border-zinc-800 rounded-2xl px-6 py-20 text-center"
        >
          <p className="text-zinc-600 text-sm mb-3">No dashboards yet.</p>
          <button
            onClick={() => setModal(true)}
            className="text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors"
          >
            + Create your first dashboard
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {modal && <NewDashboardModal onClose={() => setModal(false)} onCreate={handleCreate} />}
      </AnimatePresence>

    </div>
  )
}

function DashboardCard({ d, index, onDelete, onPin, navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-zinc-900 hover:border-zinc-700 rounded-2xl overflow-hidden transition-colors"
    >
      <div className="px-5 py-4 border-b border-zinc-900">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white font-medium">{d.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{d.desc}</p>
          </div>
          {d.pinned && (
            <span className="text-[10px] text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded ml-3 flex-shrink-0">pinned</span>
          )}
        </div>
      </div>

      <div className="px-5 py-3 flex items-center justify-between">
        <p className="text-xs text-zinc-600">{d.queries} queries · {d.updatedAt}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPin(d.id)}
            className="text-xs text-zinc-600 hover:text-white transition-colors"
          >
            {d.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            onClick={() => navigate('/query')}
            className="text-xs text-zinc-500 hover:text-white transition-colors"
          >
            Open →
          </button>
          <button
            onClick={() => onDelete(d.id)}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default SavedDashboards