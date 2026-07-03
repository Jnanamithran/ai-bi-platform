import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="pt-40 pb-32 px-6 text-center max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
        Now in early access
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-white mb-4"
      >
        Ask your data.<br />
        <span className="text-zinc-500">Get answers instantly.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-zinc-600 text-sm tracking-widest uppercase mb-6 font-mono"
      >
        Ask Better. Know Faster.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Inquira connects to your existing database and lets anyone on your team
        query it in plain English — no SQL, no dashboards, no waiting.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-black font-medium px-8 py-3 rounded-lg hover:bg-zinc-200 transition-colors text-sm w-full sm:w-auto"
        >
          Start for free
        </button>
        <a
          href="#how"
          className="text-zinc-400 hover:text-white text-sm transition-colors w-full sm:w-auto text-center"
        >
          See how it works →
        </a>
      </motion.div>

      {/* UI Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-20 border border-zinc-800 rounded-2xl bg-zinc-950 p-6 text-left shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 text-sm font-mono mb-4">
          "Show me the top 5 products by revenue this month"
        </div>

        <div className="space-y-2">
          <div className="text-xs text-zinc-500 mb-3">Generated SQL</div>
          <div className="bg-black border border-zinc-800 rounded-lg px-4 py-3 font-mono text-xs text-zinc-400 leading-relaxed">
            <span className="text-violet-400">SELECT</span> product_name, <span className="text-violet-400">SUM</span>(revenue) <span className="text-violet-400">AS</span> total<br />
            <span className="text-violet-400">FROM</span> sales<br />
            <span className="text-violet-400">WHERE</span> sale_date &gt;= <span className="text-emerald-400">DATE_TRUNC</span>('month', NOW())<br />
            <span className="text-violet-400">GROUP BY</span> product_name<br />
            <span className="text-violet-400">ORDER BY</span> total <span className="text-violet-400">DESC</span><br />
            <span className="text-violet-400">LIMIT</span> <span className="text-amber-400">5</span>;
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {['Product A — ₹2.4L', 'Product B — ₹1.9L', 'Product C — ₹1.2L'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Hero