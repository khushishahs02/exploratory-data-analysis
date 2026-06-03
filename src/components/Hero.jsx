const stats = [
  { value: '0.868', label: 'R² Score'          },
  { value: '8',     label: 'Models Evaluated'  },
  { value: '11',    label: 'Features Analysed' },
  { value: '1,337', label: 'Patient Records'   },
]

export default function Hero() {
  return (
    <section className="border-b border-stone-200">
      {/* Main hero */}
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

        {/* Left — copy */}
        <div className="fade-up">
          <p className="eyebrow mb-4">Insurance Intelligence Platform</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-[1.1] mb-6">
            Understand what drives<br />
            <em className="not-italic text-gold-500">your</em> insurance costs.
          </h1>
          <p className="font-body text-ink-600 text-base md:text-lg leading-relaxed mb-8 max-w-md">
            Veda Life AI uses Gradient Boosting and SHAP explainability to give you
            a transparent, itemised breakdown of every insurance charge estimate —
            not just a number, but a reason.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="#predict" className="btn-primary">
              Try the Predictor →
            </a>
            <a href="#model" className="btn-ghost">
              View Model Results
            </a>
          </div>
        </div>

        {/* Right — decorative SHAP waterfall mockup */}
        <div className="fade-up-d1 hidden md:block">
          <div className="card p-0 overflow-hidden">
            {/* Header bar */}
            <div className="bg-ink-900 px-5 py-3 flex items-center gap-2">
              <span className="font-mono text-xs text-stone-300 tracking-widest2 uppercase">
                SHAP Explanation — Patient #042
              </span>
            </div>
            {/* Mock bars */}
            <div className="p-6 space-y-3">
              {[
                { feature: 'is_smoker',          val: '+0.812', pct: 88, pos: true  },
                { feature: 'age',                val: '+0.234', pct: 42, pos: true  },
                { feature: 'bmi',                val: '+0.118', pct: 24, pos: true  },
                { feature: 'bmi_category_Obese', val: '+0.091', pct: 18, pos: true  },
                { feature: 'children',           val: '−0.043', pct: 12, pos: false },
                { feature: 'region_southwest',   val: '−0.021', pct:  6, pos: false },
              ].map(r => (
                <div key={r.feature} className="grid grid-cols-[140px_1fr_56px] items-center gap-3">
                  <span className="font-mono text-xs text-ink-600 truncate">{r.feature}</span>
                  <div className="h-5 bg-stone-100 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${r.pct}%`,
                        background: r.pos ? '#8B2635' : '#2D6A4F',
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-xs text-right"
                    style={{ color: r.pos ? '#8B2635' : '#2D6A4F' }}
                  >
                    {r.val}
                  </span>
                </div>
              ))}
            </div>
            {/* Baseline note */}
            <div className="border-t border-stone-100 px-6 py-3 flex justify-between items-center">
              <span className="font-mono text-xs text-ink-500">Base value: $13,270</span>
              <span className="font-mono text-xs font-medium text-ink-900">Estimate: $28,450</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-200">
          {stats.map(s => (
            <div key={s.label} className="px-6 first:pl-0">
              <p className="font-display text-2xl font-semibold text-ink-900">{s.value}</p>
              <p className="eyebrow mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
