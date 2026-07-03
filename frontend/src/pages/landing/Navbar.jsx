import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-white font-semibold text-xl tracking-tight">Inquira</span>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
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

      {menuOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-black px-6 py-4 space-y-4 text-sm text-zinc-400">
          <a href="#how" className="block hover:text-white">How it works</a>
          <a href="#features" className="block hover:text-white">Features</a>
          <a href="#pricing" className="block hover:text-white">Pricing</a>
          <button onClick={() => navigate('/login')} className="block hover:text-white">Log in</button>
          <button onClick={() => navigate('/register')} className="block text-white font-medium">Get Started</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar