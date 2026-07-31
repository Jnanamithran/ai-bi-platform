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
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
        100% on-premise — your data never leaves your network
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-white mb-4"
      >
        Query your data.<br />
        <span className="text-zinc-500">Without the risk.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-zinc-600 text-sm tracking-widest uppercase mb-6 font-mono"
      >
        Ask Better. Know Faster. Stay Private.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Inquira lets your team ask questions about your database in plain English —
        with no SQL, no developers, and no data ever sent to the cloud.
        Runs entirely on your own infrastructure.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
      >
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-black font-medium px-8 py-3 rounded-lg hover:bg-zinc-200 transition-colors text-sm w-full sm:w-auto"
        >
          Deploy for free
        </button>
        
         <a href="#how"
          className="text-zinc-400 hover:text-white text-sm transition-colors w-full sm:w-auto text-center"
        >
          See how it works →
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center justify-center gap-6 text-xs text-zinc-600"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-600 inline-block"></span>
          HIPAA friendly
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-600 inline-block"></span>
          GDPR compliant
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-600 inline-block"></span>
          Open source
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-600 inline-block"></span>
          No data leaves your server
        </span>
      </motion.div>

      /* UI Mockup */
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-20 border border-zinc-800 rounded-2xl bg-zinc-950 p-6 text-left shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <span className="text-xs text-zinc-600 ml-2 font-mono">inquira — running on your server</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 text-sm font-mono mb-4">
          "How many patients were admitted this month and what were the top diagnoses?"
        </div>

        <div className="space-y-2">
          <div className="text-xs text-zinc-500 mb-3">Generated SQL — executed locally</div>
          <div className="bg-black border border-zinc-800 rounded-lg px-4 py-3 font-mono text-xs text-zinc-400 leading-relaxed">
            <span className="text-violet-400">SELECT</span> diagnosis, <span className="text-violet-400">COUNT</span>(*) <span className="text-violet-400">AS</span> total<br />
            <span className="text-violet-400">FROM</span> admissions<br />
            <span className="text-violet-400">WHERE</span> admitted_at &gt;= <span className="text-emerald-400">DATE_TRUNC</span>('month', NOW())<br />
            <span className="text-violet-400">GROUP BY</span> diagnosis<br />
            <span className="text-violet-400">ORDER BY</span> total <span className="text-violet-400">DESC</span><br />
            <span className="text-violet-400">LIMIT</span> <span className="text-amber-400">10</span>;
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
          <span className="text-xs text-zinc-500 font-mono">Query executed on your server · 0 bytes sent to cloud</span>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero