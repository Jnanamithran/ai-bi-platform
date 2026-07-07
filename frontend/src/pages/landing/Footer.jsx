import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <footer className="border-t border-zinc-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-4 gap-10 mb-12"
        >
          <div>
            <span className="text-white font-semibold text-lg tracking-tight">Inquira</span>
            <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
              Natural language business intelligence for modern teams.
            </p>
            <p className="text-zinc-600 text-xs mt-2 font-mono italic">
              Ask Better. Know Faster.
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-400 font-medium mb-4">Product</p>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#how" className="hover:text-white transition-colors">How it works</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs text-zinc-400 font-medium mb-4">Company</p>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs text-zinc-400 font-medium mb-4">Legal</p>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-zinc-600 text-xs">© 2026 Inquira. All rights reserved.</p>
          <p className="text-zinc-600 text-xs">Built with ♥ in Kerala, India</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer