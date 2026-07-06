import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { runQuery, saveQueryToDashboard, getQueryHistory } from '../../services/query.service'
import { getConnections } from '../../services/database.service'

const suggestions = [
  'What was our total revenue last month?',
  'Show the top 5 customers by order value.',
  'Which product had the highest sales this quarter?',
  'How many new users signed up this week?',
  'What is the current inventory status?',
  'Show monthly revenue trend for this year.',
]

function QueryPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [saved, setSaved] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    fetchConnections()
    fetchHistory()
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function fetchConnections() {
    try {
      const data = await getConnections()
      setConnections(data.connections)
      if (data.connections.length > 0) {
        setSelectedConnection(data.connections[0].id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchHistory() {
    try {
      const data = await getQueryHistory()
      setHistory(data.queries)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSubmit() {
    if (!query.trim()) return
    if (!selectedConnection) {
      setError('Please connect a database first')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    setSaved(false)
    try {
      const data = await runQuery({ question: query, connectionId: selectedConnection })
      setResult(data.query)
      fetchHistory()
    } catch (err) {
      setError(err.response?.data?.error || 'Query failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!result) return
    try {
      await saveQueryToDashboard(result.id)
      setSaved(true)
    } catch (err) {
      console.error(err)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleNewQuery() {
    setQuery('')
    setResult(null)
    setError('')
    setSaved(false)
    setSidebarOpen(false)
  }

  function handleHistoryClick(q) {
    setQuery(q)
    setResult(null)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden">

      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-[57px] left-0 z-50 w-8 h-8 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border-r border-b border-zinc-800 rounded-br-lg text-zinc-500 hover:text-white transition-colors"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
            />
            <motion.aside
              ref={sidebarRef}
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed left-0 top-14 bottom-0 z-40 w-60 bg-black border-r border-zinc-900 flex flex-col"
            >
              <div className="p-3 border-b border-zinc-900">
                <button
                  onClick={handleNewQuery}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  <span className="text-base leading-none">+</span>
                  <span>New query</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
                {history.map((item, i) => (
                  <div key={item.id}>
                    {i === 3 && <div className="border-t border-zinc-900 my-2" />}
                    <button
                      onClick={() => handleHistoryClick(item.question)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors truncate"
                    >
                      {item.question}
                    </button>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 max-w-3xl mx-auto w-full px-6 pt-16 pb-10">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-2xl font-semibold text-white tracking-tight">What do you want to know?</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Ask anything about your data in plain English.</p>
          </motion.div>

          {/* Connection selector */}
          {connections.length > 1 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-zinc-600">Database:</span>
              {connections.map(conn => (
                <button
                  key={conn.id}
                  onClick={() => setSelectedConnection(conn.id)}
                  className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                    selectedConnection === conn.id
                      ? 'bg-white text-black border-white'
                      : 'text-zinc-500 border-zinc-800 hover:text-white'
                  }`}
                >
                  {conn.name}
                </button>
              ))}
            </div>
          )}

          {connections.length === 0 && (
            <div className="border border-dashed border-zinc-800 rounded-xl px-5 py-4 mb-6 text-center">
              <p className="text-zinc-600 text-sm mb-2">No database connected.</p>
              <a href="/connect" className="text-xs text-zinc-400 hover:text-white transition-colors">Connect a database →</a>
            </div>
          )}

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-zinc-600 transition-colors"
          >
            <textarea
              rows={3}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Show me total revenue by product for last month..."
              className="w-full bg-zinc-950 text-white px-5 py-4 text-sm focus:outline-none placeholder:text-zinc-700 resize-none font-mono leading-relaxed"
            />
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-t border-zinc-800">
              <span className="text-xs text-zinc-600">Enter to run · Shift+Enter for new line</span>
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || loading || connections.length === 0}
                className="bg-white text-black text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? 'Running...' : 'Run →'}
              </button>
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="bg-red-950 border border-red-900 text-red-400 text-xs px-4 py-2.5 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Suggestions */}
          <AnimatePresence>
            {!result && !loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xs text-zinc-600 mb-3 uppercase tracking-widest">Try asking</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() => setQuery(s)}
                      className="text-left text-sm text-zinc-500 hover:text-white border border-zinc-900 hover:border-zinc-700 rounded-xl px-4 py-3 transition-all hover:bg-zinc-950"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 space-y-3"
              >
                {['Reading schema...', 'Generating SQL...', 'Executing query...'].map((msg, i) => (
                  <motion.div
                    key={msg}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.4 }}
                    className="flex items-center gap-3 text-sm text-zinc-500"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse inline-block"></span>
                    {msg}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 space-y-6"
              >
                <div className="text-sm text-zinc-500 font-mono border-l-2 border-zinc-800 pl-4">
                  "{result.question}"
                </div>

                {/* SQL */}
                <div className="border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-950">
                    <span className="text-xs text-zinc-500 font-mono">Generated SQL</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(result.sql)}
                      className="text-xs text-zinc-600 hover:text-white transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="px-5 py-4 font-mono text-xs text-zinc-400 leading-relaxed bg-black overflow-x-auto whitespace-pre-wrap break-words">
                    {result.sql}
                  </div>
                </div>

                {/* AI Summary */}
                {result.summary && (
                  <div className="border border-zinc-800 rounded-2xl px-5 py-4 bg-zinc-950">
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">AI Summary</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{result.summary}</p>
                  </div>
                )}

                {/* Results Table */}
                {result.result && result.result.length > 0 && (
                  <div className="border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-950">
                      <span className="text-xs text-zinc-500 font-mono">Results — {result.rowCount} rows · {result.executionTime}ms</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-950">
                            {result.fields?.map(f => (
                              <th key={f.name} className="text-left px-4 py-2.5 text-xs text-zinc-500 font-medium whitespace-nowrap">{f.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.result.map((row, i) => (
                            <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-950 transition-colors">
                              {result.fields?.map(f => (
                                <td key={f.name} className="px-4 py-3 text-zinc-300 text-xs font-mono whitespace-nowrap">
                                  {row[f.name]?.toString() ?? '—'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saved ? 'Saved ✓' : 'Save to Dashboard'}
                  </button>
                  <button
                    onClick={handleNewQuery}
                    className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    New Query
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}

export default QueryPage