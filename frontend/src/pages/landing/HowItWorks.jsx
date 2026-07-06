import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function Step({ step, title, desc, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ scale: 1.03, borderColor: 'rgb(161 161 170)' }}
      className="border border-zinc-800 rounded-2xl p-10 cursor-default transition-colors duration-300"
    >
      <div className="text-xs font-mono text-zinc-600 mb-6 tracking-widest">{step}</div>
      <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
      <p className="text-zinc-500 text-base leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const steps = [
    {
      step: '01',
      title: 'Connect your database',
      desc: 'Securely connect PostgreSQL, MySQL, or any major relational database in under a minute. No migration needed — Inquira works with your existing setup.',
    },
    {
      step: '02',
      title: 'Ask in plain English',
      desc: 'Type your question naturally. Inquira reads your schema, understands the relationships between your tables, and generates precise, safe SQL automatically.',
    },
    {
      step: '03',
      title: 'Get instant insights',
      desc: 'Results appear as interactive tables, charts, and AI-generated summaries in seconds. Save them to dashboards or export them — ready to share with your team.',
    },
  ]

  return (
    <section id="how" className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs text-zinc-500 uppercase tracking-widest mb-4 text-center"
        >
          How it works
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-semibold text-center mb-4 tracking-tight"
        >
          Three steps to insights
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-500 text-center text-base mb-20 max-w-xl mx-auto leading-relaxed"
        >
          No technical setup. No SQL training. Just connect, ask, and know.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ step, title, desc }, i) => (
            <Step key={step} step={step} title={title} desc={desc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks