import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-white font-semibold text-xl tracking-tight">Inquira</span>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#why" className="hover:text-white transition-colors">Why Inquira</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#who" className="hover:text-white transition-colors">Who it's for</a>
          <a href="#deploy" className="hover:text-white transition-colors">Self-host</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-sm bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Get Started
          </button>
        </div>

        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-900 bg-black px-6 py-4 space-y-4 text-sm text-zinc-400 overflow-hidden"
          >
            <a href="#why" className="block hover:text-white">Why Inquira</a>
            <a href="#how" className="block hover:text-white">How it works</a>
            <a href="#who" className="block hover:text-white">Who it's for</a>
            <a href="#deploy" className="block hover:text-white">Self-host</a>
            <button onClick={() => navigate('/login')} className="block hover:text-white">Log in</button>
            <button onClick={() => navigate('/register')} className="block text-white font-medium">Get Started</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar