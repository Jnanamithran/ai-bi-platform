import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function PricingCard({ name, price, period, desc, features, cta, highlight, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`rounded-2xl p-6 border flex flex-col ${
        highlight ? 'border-white bg-white text-black' : 'border-zinc-900 text-white hover:border-zinc-700 transition-colors'
      }`}
    >
      <div className="mb-6">
        <h3 className={`font-semibold mb-1 ${highlight ? 'text-black' : 'text-white'}`}>
          {name}
        </h3>
        <div className="flex items-end gap-1 mb-2">
          <span className={`text-3xl font-semibold ${highlight ? 'text-black' : 'text-white'}`}>
            {price}
          </span>
          <span className={`text-xs mb-1 ${highlight ? 'text-zinc-600' : 'text-zinc-500'}`}>
            / {period}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${highlight ? 'text-zinc-600' : 'text-zinc-500'}`}>
          {desc}
        </p>
      </div>

      <ul className="space-y-2 mb-8 flex-1">
        {features.map((f) => (
          <li
            key={f}
            className={`text-sm flex items-center gap-2 ${highlight ? 'text-zinc-700' : 'text-zinc-400'}`}
          >
            <span className={highlight ? 'text-black' : 'text-zinc-500'}>✓</span> {f}
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
          highlight
            ? 'bg-black text-white hover:bg-zinc-800'
            : 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800'
        }`}
      >
        {cta}
      </button>
    </motion.div>
  )
}

function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'For individuals exploring Inquira.',
      features: [
        '1 database connection',
        '50 queries / month',
        '2 team members',
        'Basic charts',
        'Community support',
      ],
      cta: 'Get started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '₹1,999',
      period: 'per month',
      desc: 'For growing teams that need more.',
      features: [
        '5 database connections',
        'Unlimited queries',
        '10 team members',
        'Advanced charts & dashboards',
        'AI summaries',
        'Email support',
      ],
      cta: 'Start free trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      desc: 'For large organizations with specific needs.',
      features: [
        'Unlimited connections',
        'Unlimited queries',
        'Unlimited members',
        'SSO & SAML',
        'Audit logs',
        'Dedicated support',
        'Custom SLA',
      ],
      cta: 'Contact sales',
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 px-6 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs text-zinc-500 uppercase tracking-widest mb-4 text-center"
        >
          Pricing
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-semibold text-center mb-4 tracking-tight"
        >
          Simple, transparent pricing
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-500 text-center text-sm mb-16"
        >
          Start free. Scale when you're ready.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} {...plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing