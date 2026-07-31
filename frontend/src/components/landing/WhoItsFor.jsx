import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function WhoItsFor() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const navigate = useNavigate()

  const industries = [
    {
      name: 'Hospitals & Clinics',
      desc: 'Query patient records, admissions, diagnoses, and billing data without exposing PHI to any cloud service.',
      examples: ['How many patients were admitted this week?', 'What are the top 5 diagnoses this month?'],
    },
    {
      name: 'Law Firms',
      desc: 'Query case files, billing records, and client data with full confidentiality. Attorney-client privilege stays intact.',
      examples: ['Show all open cases by practice area', 'Which clients have unpaid invoices?'],
    },
    {
      name: 'Banks & Finance',
      desc: 'Query transaction data, account records, and financial reports without violating data residency requirements.',
      examples: ['Show transactions above ₹1L this week', 'Which accounts have been inactive for 6 months?'],
    },
    {
      name: 'Government Departments',
      desc: 'Query citizen data, records, and reports fully on-premise. Meets government data sovereignty requirements.',
      examples: ['How many applications were processed today?', 'Show pending approvals by department'],
    },
    {
      name: 'Schools & Universities',
      desc: 'Query student records, attendance, grades, and fee data without sending student information to third parties.',
      examples: ['Show students with attendance below 75%', 'Which courses have the most failures?'],
    },
    {
      name: 'Manufacturing',
      desc: 'Query inventory, production, and supply chain data on your own infrastructure — no industrial espionage risk.',
      examples: ['Show inventory below reorder level', 'What was production output last week?'],
    },
  ]

  return (
    <section id="who" className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs text-zinc-500 uppercase tracking-widest mb-4 text-center"
        >
          Who it's for
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-semibold text-center mb-4 tracking-tight"
        >
          For organizations that can't afford data leaks
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-500 text-center text-base mb-20 max-w-xl mx-auto leading-relaxed"
        >
          If your data is sensitive, regulated, or confidential — Inquira is built for you.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map(({ name, desc, examples }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.02, borderColor: 'rgb(161 161 170)' }}
              className="border border-zinc-900 rounded-2xl p-6 cursor-default transition-colors duration-300"
            >
              <h3 className="text-white font-medium mb-2">{name}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">{desc}</p>
              <div className="space-y-1.5">
                {examples.map(ex => (
                  <div key={ex} className="text-xs text-zinc-600 font-mono border border-zinc-900 rounded-lg px-3 py-1.5">
                    "{ex}"
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 border border-zinc-800 rounded-2xl p-8 text-center"
        >
          <p className="text-white font-medium mb-2">Ready to deploy?</p>
          <p className="text-zinc-500 text-sm mb-6">
            Inquira is free and open source. Deploy it on your own server in minutes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-black font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors text-sm"
            >
              Get started
            </button>
            
             <a href="https://github.com/Jnanamithran/inquira"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhoItsFor