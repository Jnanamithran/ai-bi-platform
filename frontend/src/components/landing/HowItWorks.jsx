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
      title: 'Deploy on your infrastructure',
      desc: 'Install Inquira on your own server or private cloud. Your database credentials, your data, and your AI model all stay within your network. Nothing touches the internet.',
    },
    {
      step: '02',
      title: 'Connect your database',
      desc: 'Connect your PostgreSQL, MySQL, or SQL Server database. Inquira reads your schema and understands your tables — no data is copied or stored externally.',
    },
    {
      step: '03',
      title: 'Your team asks questions',
      desc: 'Anyone on your team — doctors, lawyers, analysts, managers — can ask questions in plain English and get instant answers. No SQL. No training required.',
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
          Private by design
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-500 text-center text-base mb-20 max-w-xl mx-auto leading-relaxed"
        >
          Every part of Inquira runs on your infrastructure. The AI, the database, the queries — all local.
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