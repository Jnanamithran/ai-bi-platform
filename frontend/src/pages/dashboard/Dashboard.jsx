import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const RECENT_QUERIES = [
  { id: 1, question: 'What was our total revenue last month?', status: 'Success', time: '2 min ago' },
  { id: 2, question: 'Show the top 5 customers by order value.', status: 'Success', time: '10 min ago' },
  { id: 3, question: 'Which product had the highest sales this quarter?', status: 'Success', time: 'Yesterday' },
  { id: 4, question: 'How many new users signed up this week?', status: 'Success', time: 'Yesterday' },
]

const SAVED_QUERIES = [
  { id: 1, label: 'Monthly Revenue' },
  { id: 2, label: 'Top Customers' },
  { id: 3, label: 'Pending Orders' },
  { id: 4, label: 'Stock Levels' },
]

const RECENT_ACTIVITY = [
  { time: '09:30', event: 'Jnanamithran connected PostgreSQL' },
  { time: '09:42', event: 'Dashboard updated' },
  { time: '10:11', event: 'Admin invited John Doe' },
  { time: '11:02', event: 'AI executed 25 queries' },
]

const KPI_CARDS = [
  { label: 'Connected Databases', value: '1' },
  { label: 'Tables', value: '84' },
  { label: 'Rows Available', value: '2.8M' },
  { label: 'Saved Queries', value: '4' },
  { label: 'Team Members', value: '2' },
  { label: "Today's Queries", value: '12' },
  { label: 'Avg Response Time', value: '0.8s' },
  { label: 'Workspace Plan', value: 'Free' },
]

const AI_INSIGHTS = [
  'Revenue increased by 12% compared to last month.',
  'Product A generated 28% of total sales.',
  'Inventory for Product B is below the reorder threshold.',
  'Customer retention improved by 5%.',
]

const SYSTEM_HEALTH = [
  { label: 'Frontend', status: 'Healthy' },
  { label: 'Backend', status: 'Healthy' },
  { label: 'AI Service', status: 'Healthy' },
  { label: 'Database', status: 'Connected' },
]

const QUICK_ACTIONS = [
  { label: 'Ask AI', path: '/query' },
  { label: 'Connect Database', path: '/connect' },
  { label: 'Invite Member', path: '/settings' },
  { label: 'View Schema', path: '/schema' },
  { label: 'Saved Dashboards', path: '/saved' },
  { label: 'Audit Logs', path: '/audit' },
]

function Card({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`border border-zinc-900 rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}

function CardHeader({ title, action }) {
  return (
    <div className="px-5 py-3.5 border-b border-zinc-900 flex items-center justify-between">
      <p className="text-xs text-zinc-500 uppercase tracking-widest">{title}</p>
      {action}
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearch(e) {
    if (e.key === 'Enter' && query.trim()) navigate('/query')
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-6xl mx-auto space-y-6">

      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, Jnanamithran</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Acme Corp · Production Workspace · <span className="text-zinc-400">Owner</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {SYSTEM_HEALTH.map(({ label }) => (
            <div key={label} className="flex items-center gap-1.5 border border-zinc-900 rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span className="text-xs text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-zinc-600 transition-colors"
      >
        <div className="flex items-center px-5 py-4 gap-3">
          <svg className="text-zinc-600 flex-shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Ask your business anything... e.g. What was our revenue last month?"
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-600"
          />
          <button
            onClick={() => query.trim() && navigate('/query')}
            className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            Ask →
          </button>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 border-t border-zinc-900 overflow-x-auto scrollbar-none">
          <span className="text-xs text-zinc-700 flex-shrink-0">Try:</span>
          {['Revenue last month', 'Top 5 customers', "Today's orders", 'Inactive customers'].map(s => (
            <button
              key={s}
              onClick={() => { setQuery(s); navigate('/query') }}
              className="text-xs text-zinc-600 hover:text-white border border-zinc-900 hover:border-zinc-700 px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KPI_CARDS.map(({ label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="border border-zinc-900 rounded-2xl px-5 py-4 cursor-default hover:border-zinc-700 transition-colors"
          >
            <p className="text-xs text-zinc-600 mb-2">{label}</p>
            <p className="text-xl font-semibold text-white tracking-tight">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-4">

        <Card delay={0.15}>
          <CardHeader
            title="Recent Queries"
            action={
              <button onClick={() => navigate('/query')} className="text-xs text-zinc-600 hover:text-white transition-colors">
                View all →
              </button>
            }
          />
          <div className="divide-y divide-zinc-900">
            {RECENT_QUERIES.map(({ id, question, status, time }) => (
              <div
                key={id}
                className="px-5 py-3 flex items-center justify-between hover:bg-zinc-950 transition-colors cursor-pointer"
                onClick={() => navigate('/query')}
              >
                <div className="min-w-0 flex-1 mr-4">
                  <p className="text-sm text-zinc-300 truncate">{question}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{time}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span className="text-xs text-zinc-500">{status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={0.2}>
          <CardHeader title="AI Insights" />
          <div className="px-5 py-4 space-y-3">
            {AI_INSIGHTS.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="w-1 h-1 rounded-full bg-zinc-600 mt-2 flex-shrink-0 inline-block"></span>
                <p className="text-sm text-zinc-400 leading-relaxed">{insight}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card delay={0.25}>
          <CardHeader
            title="Database Status"
            action={
              <button onClick={() => navigate('/connect')} className="text-xs text-zinc-600 hover:text-white transition-colors">
                Manage →
              </button>
            }
          />
          <div className="px-5 py-4 space-y-3">
            {[
              { label: 'Database', value: 'PostgreSQL' },
              { label: 'Status', value: 'Connected', highlight: true },
              { label: 'Last Sync', value: '5 minutes ago' },
              { label: 'Schema', value: 'Updated' },
              { label: 'Mode', value: 'Read-only' },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">{label}</span>
                <span className={`text-xs font-mono ${highlight ? 'text-emerald-400' : 'text-zinc-400'}`}>{value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-zinc-900">
              <button
                onClick={() => navigate('/connect')}
                className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                + Connect another database
              </button>
            </div>
          </div>
        </Card>

        <Card delay={0.3}>
          <CardHeader
            title="Recent Activity"
            action={
              <button onClick={() => navigate('/audit')} className="text-xs text-zinc-600 hover:text-white transition-colors">
                View all →
              </button>
            }
          />
          <div className="px-5 py-4 space-y-4">
            {RECENT_ACTIVITY.map(({ time, event }, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-xs text-zinc-700 font-mono flex-shrink-0 mt-0.5">{time}</span>
                <div className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-zinc-700 mt-1.5 flex-shrink-0 inline-block"></span>
                  <p className="text-xs text-zinc-500">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Bottom Grid */}
      <div className="grid md:grid-cols-3 gap-4">

        <Card delay={0.35}>
          <CardHeader
            title="Favorite Queries"
            action={
              <button onClick={() => navigate('/saved')} className="text-xs text-zinc-600 hover:text-white transition-colors">
                View all →
              </button>
            }
          />
          <div className="px-5 py-4 space-y-2">
            {SAVED_QUERIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => navigate('/query')}
                className="w-full text-left text-sm text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-700 rounded-xl px-4 py-2.5 transition-all hover:bg-zinc-950"
              >
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card delay={0.4}>
          <CardHeader title="Quick Actions" />
          <div className="px-5 py-4 grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="text-xs text-zinc-500 hover:text-white border border-zinc-900 hover:border-zinc-700 rounded-xl px-3 py-2.5 transition-all hover:bg-zinc-950 text-left"
              >
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card delay={0.45}>
          <CardHeader
            title="Team"
            action={
              <button onClick={() => navigate('/settings')} className="text-xs text-zinc-600 hover:text-white transition-colors">
                Manage →
              </button>
            }
          />
          <div className="px-5 py-4 space-y-3">
            {[
              { role: 'Owner', count: 1 },
              { role: 'Admin', count: 0 },
              { role: 'Analyst', count: 1 },
              { role: 'Viewer', count: 0 },
            ].map(({ role, count }) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">{role}</span>
                <span className="text-xs text-zinc-400 font-mono">{count}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-zinc-900">
              <button
                onClick={() => navigate('/settings')}
                className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                + Invite member
              </button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}

export default Dashboard