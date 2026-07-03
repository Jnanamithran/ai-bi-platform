function Features() {
  const features = [
    {
      icon: '⌘',
      title: 'Natural Language Queries',
      desc: 'Ask questions the way you think — in plain English. No SQL knowledge required.',
    },
    {
      icon: '🔒',
      title: 'Read-Only & Secure',
      desc: 'Inquira never writes to your database. Every query is validated before execution.',
    },
    {
      icon: '🏢',
      title: 'Multi-Tenant Workspaces',
      desc: 'Each organization gets a fully isolated workspace with its own users and data.',
    },
    {
      icon: '📊',
      title: 'Charts & Dashboards',
      desc: 'Auto-generated visualizations from query results. Save and revisit anytime.',
    },
    {
      icon: '🤖',
      title: 'AI-Generated Summaries',
      desc: 'Every result comes with a plain-English explanation of what the data means.',
    },
    {
      icon: '🔌',
      title: 'Multi-Database Support',
      desc: 'Connect PostgreSQL, MySQL, MariaDB, or SQL Server — all from one platform.',
    },
  ]

  return (
    <section id="features" className="py-24 px-6 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4 text-center">
          Features
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 tracking-tight">
          Everything your team needs
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="border border-zinc-900 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="text-2xl mb-4">{icon}</div>
              <h3 className="text-white font-medium mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features