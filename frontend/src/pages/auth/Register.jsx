import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', organizationName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!form.name || !form.email || !form.password || !form.organizationName) {
      setError('Please fill in all fields')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register(form.name, form.email, form.password, form.organizationName)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

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

          {error && (
            <div className="bg-red-950 border border-red-900 text-red-400 text-xs px-4 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Organization Name', key: 'organizationName', type: 'text', placeholder: 'Acme Corp' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@company.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', key: 'confirmPassword', type: 'password', placeholder: '••••••••' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
                />
              </div>
            ))}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
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

        <p className="text-center text-zinc-700 text-xs mt-6">© 2026 Inquira. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export default Register