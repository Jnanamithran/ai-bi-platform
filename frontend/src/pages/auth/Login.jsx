import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-semibold text-white tracking-tight cursor-pointer"
            onClick={() => navigate('/')}
          >
            Inquira
          </h1>
          <p className="text-zinc-600 mt-1 text-xs font-mono">Ask Better. Know Faster.</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-zinc-500 text-sm mb-6">Sign in to your organization workspace.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-zinc-400">Password</label>
                <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            <button className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors mt-2">
              Sign In
            </button>
          </div>

          <p className="text-center text-zinc-600 text-xs mt-6">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-zinc-300 hover:text-white cursor-pointer transition-colors"
            >
              Create one
            </span>
          </p>
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6">
          © 2025 Inquira. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}

export default Login