import { Link } from 'react-router-dom'

const stats = [
  { value: '0.868', label: 'R² Score' },
  { value: '8', label: 'Models Evaluated' },
  { value: '11', label: 'Features Analysed' },
  { value: '1,337', label: 'Patient Records' },
]

export default function HomePage() {
  return (
    <section>
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-14 items-center">

        <div className="fade-up">
          <p className="eyebrow mb-4">Insurance Prediction Model · Academic Project</p>
          <h1 className="font-display text-5xl md:text-6xl text-[#1A1A1A] leading-[1.08] mb-6">
            Understand what<br />
            drives your<br />
            <span className="text-[#C9A84C]">insurance costs.</span>
          </h1>
          <p className="font-body text-[#555] text-base leading-relaxed mb-8 max-w-md">
            HealthWealth uses Gradient Boosting and SHAP explainability to give you a transparent, itemised breakdown of every charge estimate not just a number, but a reason.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/predict" className="btn-primary">Try the Predictor →</Link>
            <Link to="/model" className="btn-ghost">View Model Results</Link>
          </div>
        </div>

        {/* SHAP mockup card */}
        <div className="fade-up-d1 hidden md:block">
          <div className="card p-0 overflow-hidden">
            <div className="bg-[#1A1A1A] px-5 py-3">
              <span className="font-mono text-[10px] text-[#AAA] tracking-[0.2em] uppercase">
                SHAP Explanation — Sample Patient
              </span>
            </div>
            <div className="p-6 space-y-3">
              {[
                { feature: 'is_smoker', val: '+0.812', pct: 88, pos: true },
                { feature: 'age', val: '+0.234', pct: 42, pos: true },
                { feature: 'bmi', val: '+0.118', pct: 24, pos: true },
                { feature: 'bmi_category_Obese', val: '+0.091', pct: 18, pos: true },
                { feature: 'children', val: '−0.043', pct: 12, pos: false },
                { feature: 'region_southwest', val: '−0.021', pct: 6, pos: false },
              ].map(r => (
                <div key={r.feature} className="grid grid-cols-[144px_1fr_56px] items-center gap-3">
                  <span className="font-mono text-xs text-[#777] truncate">{r.feature}</span>
                  <div className="h-4 bg-[#EDECEA] overflow-hidden">
                    <div className="h-full" style={{ width: `${r.pct}%`, background: r.pos ? '#8B2635' : '#2D6A4F' }} />
                  </div>
                  <span className="font-mono text-xs text-right" style={{ color: r.pos ? '#8B2635' : '#2D6A4F' }}>
                    {r.val}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#EDECEA] px-6 py-3 flex justify-between items-center">
              <span className="font-mono text-xs text-[#999]">Base: $13,270</span>
              <span className="font-mono text-xs font-semibold text-[#1A1A1A]">Estimate: $28,450</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t border-[#E0DED6] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E8E6DE]">
          {stats.map(s => (
            <div key={s.label} className="px-6 first:pl-0">
              <p className="font-display text-2xl font-semibold text-[#1A1A1A]">{s.value}</p>
              <p className="eyebrow mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
