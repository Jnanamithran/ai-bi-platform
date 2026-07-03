import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="pt-40 pb-32 px-6 text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
        Now in early access
      </div>

      <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-white mb-6">
        Ask your data.<br />
        <span className="text-zinc-500">Get answers instantly.</span>
      </h1>

      <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        Inquira connects to your existing database and lets anyone on your team
        query it in plain English — no SQL, no dashboards, no waiting.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
      </div>

      {/* UI Mockup */}
      <div className="mt-20 border border-zinc-800 rounded-2xl bg-zinc-950 p-6 text-left shadow-2xl">
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
          {['Product A — ₹2.4L', 'Product B — ₹1.9L', 'Product C — ₹1.2L'].map((item) => (
            <div key={item} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero