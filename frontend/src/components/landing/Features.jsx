import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function FeatureCard({ icon, title, desc, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, borderColor: 'rgb(161 161 170)' }}
      className="border border-zinc-900 rounded-2xl p-8 cursor-default transition-colors duration-300 group"
    >
      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 group-hover:border-zinc-600 transition-colors">
        <span className="text-zinc-300 text-sm font-mono font-medium">{icon}</span>
      </div>
      <h3 className="text-white font-medium mb-2 text-base">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: 'AI',
      title: 'Local AI — No Cloud',
      desc: 'Runs on Ollama with Llama 3.2 locally. Your questions and data never touch OpenAI, Google, or any external API.',
    },
    {
      icon: 'RO',
      title: 'Read-Only Queries',
      desc: 'Every generated SQL is validated before execution. Only SELECT statements run — your data can never be modified.',
    },
    {
      icon: 'NL',
      title: 'Plain English Queries',
      desc: 'No SQL knowledge needed. Anyone on your team can ask questions and get accurate answers instantly.',
    },
    {
      icon: 'DB',
      title: 'Multi-Database Support',
      desc: 'Connect PostgreSQL, MySQL, MariaDB, or SQL Server. Works with your existing database — no migration needed.',
    },
    {
      icon: 'AU',
      title: 'Full Audit Trail',
      desc: 'Every query, every user action is logged. Know exactly who asked what and when — essential for compliance.',
    },
    {
      icon: 'OS',
      title: 'Open Source',
      desc: 'Fully open source and self-hostable. Inspect every line of code. No black boxes, no vendor lock-in.',
    },
  ]

  return (
    <section id="features" className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs text-zinc-500 uppercase tracking-widest mb-4 text-center"
        >
          Features
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-semibold text-center mb-4 tracking-tight"
        >
          Built for privacy-first organizations
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-500 text-center text-base mb-20 max-w-xl mx-auto leading-relaxed"
        >
          Every feature is designed with one principle — your data stays yours.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }, i) => (
            <FeatureCard key={title} icon={icon} title={title} desc={desc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features