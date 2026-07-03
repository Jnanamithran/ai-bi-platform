function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Connect your database',
      desc: 'Securely connect PostgreSQL, MySQL, or any major relational database in under a minute.',
    },
    {
      step: '02',
      title: 'Ask in plain English',
      desc: 'Type your question naturally. Inquira understands your schema and generates precise SQL.',
    },
    {
      step: '03',
      title: 'Get instant insights',
      desc: 'Results appear as tables, charts, and AI-generated summaries — ready to share.',
    },
  ]

  return (
    <section id="how" className="py-24 px-6 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4 text-center">
          How it works
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 tracking-tight">
          Three steps to insights
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="border border-zinc-900 rounded-2xl p-6">
              <div className="text-xs font-mono text-zinc-600 mb-4">{step}</div>
              <h3 className="text-white font-medium mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks