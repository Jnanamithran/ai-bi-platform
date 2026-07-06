import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { testConnection, createConnection } from '../../services/database.service'

const DB_TYPES = [
  { id: 'POSTGRESQL', name: 'PostgreSQL', desc: 'Most popular open-source database', defaultPort: '5432' },
  { id: 'MYSQL', name: 'MySQL', desc: 'Widely used relational database', defaultPort: '3306' },
  { id: 'MARIADB', name: 'MariaDB', desc: 'MySQL-compatible open-source fork', defaultPort: '3306' },
  { id: 'SQLSERVER', name: 'SQL Server', desc: 'Microsoft enterprise database', defaultPort: '1433' },
]

function ConnectDatabase() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedDb, setSelectedDb] = useState(null)
  const [form, setForm] = useState({ name: '', host: '', port: '', dbname: '', username: '', password: '' })
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  function handleSelectDb(db) {
    setSelectedDb(db)
    setForm(prev => ({ ...prev, port: db.defaultPort }))
    setStep(2)
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    setError('')
    try {
      await testConnection({ ...form, type: selectedDb.id })
      setTestResult('success')
    } catch (err) {
      setError(err.response?.data?.error || 'Connection failed')
      setTestResult('failed')
    } finally {
      setTesting(false)
    }
  }

  async function handleConnect() {
    setConnecting(true)
    setError('')
    try {
      await createConnection({ ...form, type: selectedDb.id })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-2xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Connect Database</h1>
        <p className="text-zinc-500 text-sm mt-1">Add a database to start querying with Inquira.</p>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex items-center gap-2 mb-10"
      >
        {['Choose database', 'Enter credentials', 'Test & connect'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${step >= i + 1 ? 'text-white' : 'text-zinc-700'}`}>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                step > i + 1 ? 'bg-white border-white text-black' :
                step === i + 1 ? 'border-white text-white' :
                'border-zinc-800 text-zinc-700'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-xs hidden sm:block">{label}</span>
            </div>
            {i < 2 && <div className={`w-8 h-px ${step > i + 1 ? 'bg-white' : 'bg-zinc-800'}`} />}
          </div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-zinc-400 mb-4">Select your database type</p>
            <div className="space-y-3">
              {DB_TYPES.map((db, i) => (
                <motion.button
                  key={db.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  onClick={() => handleSelectDb(db)}
                  className="w-full flex items-center justify-between border border-zinc-900 hover:border-zinc-600 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-zinc-950"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{db.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{db.desc}</p>
                  </div>
                  <span className="text-zinc-600 text-sm">→</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(1)} className="text-xs text-zinc-500 hover:text-white transition-colors">← Back</button>
              <span className="text-sm text-zinc-400">Connecting to <span className="text-white">{selectedDb?.name}</span></span>
            </div>

            {error && (
              <div className="bg-red-950 border border-red-900 text-red-400 text-xs px-4 py-2.5 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="border border-zinc-900 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-900">
                <h2 className="text-sm font-medium text-white">Connection Details</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Inquira uses a read-only connection — your data is never modified.</p>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Connection Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. production-db"
                    className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Host</label>
                    <input
                      type="text"
                      value={form.host}
                      onChange={e => setForm({ ...form, host: e.target.value })}
                      placeholder="db.example.com"
                      className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Port</label>
                    <input
                      type="text"
                      value={form.port}
                      onChange={e => setForm({ ...form, port: e.target.value })}
                      className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Database Name</label>
                  <input
                    type="text"
                    value={form.dbname}
                    onChange={e => setForm({ ...form, dbname: e.target.value })}
                    placeholder="my_database"
                    className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    placeholder="readonly_user"
                    className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </button>

                  {testResult === 'success' && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-emerald-400 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      Connection successful
                    </motion.span>
                  )}

                  {testResult === 'failed' && (
                    <span className="text-xs text-red-400">Connection failed</span>
                  )}
                </div>

                {testResult === 'success' && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleConnect}
                    disabled={connecting}
                    className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {connecting ? 'Connecting...' : 'Connect Database →'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ConnectDatabase