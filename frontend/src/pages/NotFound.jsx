import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[120px] font-semibold text-zinc-900 leading-none mb-6 select-none"
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-xl font-semibold text-white mb-2 tracking-tight"
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-zinc-500 text-sm mb-8 leading-relaxed"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors"
          >
            ← Go back
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xs bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Home
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-zinc-800 text-xs font-mono mt-16"
        >
          inquira · ask better. know faster.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default NotFound