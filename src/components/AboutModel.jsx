const specs = [
  { label: 'Algorithm',        value: 'Gradient Boosting Regressor'      },
  { label: 'Library',          value: 'scikit-learn 1.x'                 },
  { label: 'Training rows',    value: '1,070 (80% split)'                },
  { label: 'Test rows',        value: '267 (20% split)'                  },
  { label: 'Target variable',  value: 'log(charges) → exp() at output'   },
  { label: 'Features',         value: '11 (post-encoding)'               },
  { label: 'Explainability',   value: 'SHAP TreeExplainer'               },
  { label: 'Optimal trees',    value: '100 (early stopping validated)'   },
]

const limitations = [
  'Trained on a US-only dataset — predictions may not generalise to other healthcare systems.',
  'Dataset contains 1,337 rows, which is small by production ML standards.',
  'No comorbidity, medical history, or prescription data is used.',
  'Charges are predicted at the individual level; group / family plan dynamics are not modelled.',
  'The model is intended as a portfolio demonstration, not a real actuarial tool.',
]

export default function AboutModel() {
  return (
    <section id="about" className="border-b border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">

        <div className="mb-12">
          <p className="eyebrow mb-3">Model Card</p>
          <h2 className="section-title">About the Model</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Left — specs + limitations */}
          <div className="space-y-8">

            {/* Spec table */}
            <div>
              <p className="eyebrow mb-4">Technical Specifications</p>
              <div className="divide-y divide-stone-100 border border-stone-200">
                {specs.map(s => (
                  <div key={s.label} className="grid grid-cols-[160px_1fr] text-sm">
                    <span className="px-4 py-3 font-mono text-xs text-ink-500 bg-stone-50 border-r border-stone-100">
                      {s.label}
                    </span>
                    <span className="px-4 py-3 font-body text-ink-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div>
              <p className="eyebrow mb-4">Known Limitations</p>
              <ul className="space-y-2">
                {limitations.map((l, i) => (
                  <li key={i} className="flex gap-3 text-sm font-body text-ink-600">
                    <span className="font-mono text-ink-300 shrink-0 mt-0.5">—</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — beeswarm mockup + intended use */}
          <div className="space-y-8">

            {/* Beeswarm static mockup */}
            <div className="card p-0 overflow-hidden">
              <div className="bg-ink-900 px-5 py-3">
                <span className="font-mono text-xs text-stone-300 tracking-widest2 uppercase">
                  SHAP Beeswarm — Global Feature Impact
                </span>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { f: 'is_smoker',           dots: [8,9,9,9,9,8,7,6,5] },
                  { f: 'age',                 dots: [3,4,5,6,7,7,8,8,7] },
                  { f: 'bmi',                 dots: [4,5,5,6,6,6,6,5,4] },
                  { f: 'bmi_category_Obese',  dots: [3,4,5,5,5,5,4,3,2] },
                  { f: 'children',            dots: [4,4,4,4,4,4,4,4,4] },
                  { f: 'region_southwest',    dots: [3,3,4,4,4,4,3,3,3] },
                ].map(row => (
                  <div key={row.f} className="grid grid-cols-[140px_1fr] items-center gap-3">
                    <span className="font-mono text-xs text-ink-500 truncate">{row.f}</span>
                    <div className="flex gap-1 flex-wrap">
                      {row.dots.map((size, i) => (
                        <span
                          key={i}
                          className="rounded-full inline-block"
                          style={{
                            width:  `${size * 3}px`,
                            height: `${size * 3}px`,
                            background: i < 4 ? '#8B2635' : '#2D6A4F',
                            opacity: 0.6 + i * 0.04,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <p className="font-mono text-xs text-ink-400 pt-2 border-t border-stone-100">
                  Red = increases cost · Green = decreases cost · Size = magnitude
                </p>
              </div>
            </div>

            {/* Intended use */}
            <div className="space-y-3">
              <p className="eyebrow">Intended Use</p>
              <p className="font-body text-sm text-ink-600 leading-relaxed">
                This model is built as a portfolio demonstration of an end-to-end supervised
                regression pipeline — from EDA through preprocessing, model selection, hyperparameter
                tuning, and SHAP-based explainability. It is not intended for real actuarial or
                underwriting decisions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
