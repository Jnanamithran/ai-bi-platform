import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { id: 1, title: 'Welcome to Inquira', desc: 'Let\'s get your workspace ready in 3 quick steps.' },
  { id: 2, title: 'Connect your database', desc: 'Inquira works with your existing database — no migration needed.' },
  { id: 3, title: 'Invite your team', desc: 'Add team members so they can query data too.' },
  { id: 4, title: 'Ask your first question', desc: 'You\'re all set. Try asking something about your data.' },
]

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [dbConnected, setDbConnected] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [invited, setInvited] = useState([])
  const [connecting, setConnecting] = useState(false)

  function handleConnectDb() {
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setDbConnected(true)
    }, 1500)
  }

  function handleInvite() {
    if (!inviteEmail.trim()) return
    setInvited(prev => [...prev, inviteEmail])
    setInviteEmail('')
  }

  function handleFinish() {
    navigate('/query')
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl font-semibold tracking-tight">Inquira</h1>
          <p className="text-zinc-600 text-xs font-mono mt-1">Ask Better. Know Faster.</p>
        </motion.div>

        {/* Progress bar */}
        <div className="h-px bg-zinc-900 rounded-full mb-10 overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 ${step === s.id ? 'text-white' : step > s.id ? 'text-zinc-500' : 'text-zinc-800'}`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition-colors ${
                step > s.id ? 'bg-white border-white text-black' :
                step === s.id ? 'border-white' :
                'border-zinc-800'
              }`}>
                {step > s.id ? '✓' : s.id}
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-zinc-900 rounded-2xl p-8 text-center"
            >
              <h2 className="text-xl font-semibold mb-2">Welcome to Inquira</h2>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                You've created your workspace. Let's set things up so you can start getting insights from your data.
              </p>

              <div className="space-y-3 text-left mb-8">
                {[
                  'Connect your database',
                  'Invite your team',
                  'Ask your first question',
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-zinc-500">
                    <div className="w-5 h-5 rounded border border-zinc-800 flex items-center justify-center text-xs text-zinc-700 flex-shrink-0">
                      {i + 1}
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
              >
                Get started →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-zinc-900 rounded-2xl p-8"
            >
              <h2 className="text-xl font-semibold mb-1">Connect your database</h2>
              <p className="text-zinc-500 text-sm mb-6">Inquira connects read-only — your data is never modified.</p>

              {!dbConnected ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Database Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server'].map(db => (
                        <button
                          key={db}
                          className="border border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors text-left"
                        >
                          {db}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Host</label>
                    <input type="text" placeholder="db.example.com" className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">Username</label>
                      <input type="text" placeholder="readonly_user" className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700" />
                    </div>
                  </div>

                  <button
                    onClick={handleConnectDb}
                    disabled={connecting}
                    className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {connecting ? 'Connecting...' : 'Connect Database'}
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
                  >
                    Skip for now
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mx-auto mb-4">
                    <span className="text-emerald-400 text-lg">✓</span>
                  </div>
                  <p className="text-white font-medium mb-1">Database connected</p>
                  <p className="text-zinc-500 text-sm mb-6">Ready to query your data.</p>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-white text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
                  >
                    Continue →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-zinc-900 rounded-2xl p-8"
            >
              <h2 className="text-xl font-semibold mb-1">Invite your team</h2>
              <p className="text-zinc-500 text-sm mb-6">Add team members so they can query data alongside you.</p>

              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="flex-1 bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                  />
                  <button
                    onClick={handleInvite}
                    className="text-xs bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
                  >
                    Invite
                  </button>
                </div>

                {invited.length > 0 && (
                  <div className="space-y-2">
                    {invited.map(email => (
                      <div key={email} className="flex items-center gap-3 border border-zinc-900 rounded-lg px-4 py-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                        <span className="text-xs text-zinc-400">{email}</span>
                        <span className="text-xs text-zinc-600 ml-auto">Invite sent</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
              >
                {invited.length > 0 ? 'Continue →' : 'Skip for now'}
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-zinc-900 rounded-2xl p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-lg">✓</span>
              </div>

              <h2 className="text-xl font-semibold mb-2">You're all set</h2>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                Your workspace is ready. Start by asking a question about your data.
              </p>

              <div className="border border-zinc-900 rounded-xl px-5 py-4 mb-6 text-left space-y-2">
                <p className="text-xs text-zinc-600 mb-3 uppercase tracking-widest">Try asking</p>
                {[
                  'What was our total revenue last month?',
                  'Show the top 5 customers by order value.',
                  'Which product had the highest sales?',
                ].map(q => (
                  <button
                    key={q}
                    onClick={handleFinish}
                    className="w-full text-left text-sm text-zinc-500 hover:text-white border border-zinc-900 hover:border-zinc-700 rounded-xl px-4 py-2.5 transition-all hover:bg-zinc-950"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
              >
                Go to Inquira →
              </button>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  )
}

export default Onboarding