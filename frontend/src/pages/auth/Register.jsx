import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-semibold text-white tracking-tight cursor-pointer"
            onClick={() => navigate('/')}
          >
            Inquira
          </h1>
          <p className="text-zinc-600 mt-1 text-xs font-mono">Ask Better. Know Faster.</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-1">Create your account</h2>
          <p className="text-zinc-500 text-sm mb-6">Set up your organization workspace in seconds.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Organization Name</label>
              <input
                type="text"
                placeholder="Acme Corp"
                className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            <button
              onClick={() => navigate('/onboarding')}
              className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors mt-2"
            >
              Create Account
            </button>
          </div>

          <p className="text-center text-zinc-600 text-xs mt-6">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-zinc-300 hover:text-white cursor-pointer transition-colors"
            >
              Sign in
            </span>
          </p>
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6">© 2025 Inquira. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export default Register