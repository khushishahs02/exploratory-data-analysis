// Explain page — SHAP explainability + the SVR vs XGBoost trade-off decision

const shapConcepts = [
  {
    term: 'Shapley Value',
    definition: 'A concept from cooperative game theory (1953). It asks: if each feature is a "player" contributing to the final prediction, what is each player\'s fair share of the outcome?'
  },
  {
    term: 'TreeExplainer',
    definition: 'A SHAP algorithm specifically designed for tree-based models (Decision Trees, Random Forests, Gradient Boosting). It runs in polynomial time so extremely fast compared to the KernelExplainer.'
  },
  {
    term: 'Base Value',
    definition: 'The average prediction the model would make if it knew nothing about a specific patient i.e. the global mean of all training predictions. Each feature\'s SHAP value is an additive adjustment from this baseline.'
  },
  {
    term: 'Waterfall Plot',
    definition: 'A per-patient visualisation showing which features pushed the prediction above or below the base value. Red bars increase the charge and green bars decrease it.'
  },
  {
    term: 'Beeswarm Plot',
    definition: 'A global summary showing every patient\'s SHAP value for every feature, stacked into a swarm. Width = how often that feature matters. Colour = feature value (high/low).'
  },
]

const tradeoffRows = [
  { criterion: 'R² Score', svr: '0.8489', gb: '0.8682', winner: 'gb' },
  { criterion: 'SHAP Explainer type', svr: 'KernelExplainer', gb: 'TreeExplainer', winner: 'gb' },
  { criterion: 'SHAP compute time', svr: '~20+ min (RAM risk)', gb: '<2 seconds', winner: 'gb' },
  { criterion: 'RAM requirement', svr: 'Very high (kernel matrix)', gb: 'Low', winner: 'gb' },
  { criterion: 'Interpretability', svr: 'Black box', gb: 'Native feature importance', winner: 'gb' },
  { criterion: 'Accuracy delta', svr: 'Baseline', gb: '+0.02% R²', winner: 'gb' },
]

export default function ExplainPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-20">

      {/* Header */}
      <div className="fade-up max-w-2xl">
        <p className="eyebrow mb-3">Explainability</p>
        <h1 className="section-title mb-4">How SHAP Works</h1>
        <p className="font-body text-[#555] text-base leading-relaxed">
          Most ML models are black boxes because they output a number with no explanation. SHAP (SHapley Additive exPlanations) forces the model to show its work for every prediction, it assigns each feature a precise dollar contribution.
        </p>
      </div>

      {/* SHAP concept glossary */}
      <div className="fade-up-d1 space-y-6">
        <p className="eyebrow">Core Concepts</p>
        <div className="grid md:grid-cols-2 gap-4">
          {shapConcepts.map(c => (
            <div key={c.term} className="card space-y-2">
              <p className="font-body font-semibold text-[#1A1A1A] text-sm">{c.term}</p>
              <p className="font-body text-xs text-[#555] leading-relaxed">{c.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How a waterfall is built — visual walkthrough */}
      <div className="fade-up-d2 space-y-6">
        <p className="eyebrow">Reading a Waterfall Plot</p>
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Static waterfall mockup */}
          <div className="card p-0 overflow-hidden">
            <div className="bg-[#1A1A1A] px-5 py-3">
              <span className="font-mono text-[10px] text-[#AAA] tracking-[0.2em] uppercase">
                Waterfall - Keith Shadis , Age 48, Smoker
              </span>
            </div>
            <div className="p-6 space-y-3">
              {[
                { feature: 'is_smoker', label: 'Smoker: Yes', val: '+0.81', pct: 90, pos: true },
                { feature: 'age = 48', label: 'Age: 48', val: '+0.29', pct: 45, pos: true },
                { feature: 'bmi = 31.2', label: 'BMI: 31.2 (Obese)', val: '+0.14', pct: 28, pos: true },
                { feature: 'bmi_category_Obese', label: 'BMI Cat: Obese', val: '+0.09', pct: 18, pos: true },
                { feature: 'children = 1', label: 'Children: 1', val: '−0.03', pct: 8, pos: false },
                { feature: 'region_southeast', label: 'Region: SE', val: '−0.01', pct: 4, pos: false },
              ].map(r => (
                <div key={r.feature} className="grid grid-cols-[148px_1fr_52px] items-center gap-3">
                  <span className="font-mono text-xs text-[#777] truncate">{r.label}</span>
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
              <span className="font-mono text-xs font-semibold text-[#1A1A1A]">Estimate: $38,910</span>
            </div>
          </div>

          {/* Explanation text */}
          <div className="space-y-5 font-body text-sm text-[#555] leading-relaxed">
            <p>
              <span className="font-semibold text-[#1A1A1A]">Start at the base value ($13,270).</span>{' '} This is the model's average prediction across all training patients.
            </p>
            <p>
              <span className="font-semibold text-[#1A1A1A]">Each red bar pushes the estimate higher.</span>{' '}
              For Keith, his smoking status alone contributes +0.81 in log-space equivalent to
              adding roughly $19,000 to the base charge. This is why SHAP is powerful: it doesn't
              just say "smoking matters", it says exactly how much it matters for this specific patient.
            </p>
            <p>
              <span className="font-semibold text-[#1A1A1A]">Green bars push it lower.</span>{' '}
              Having only one child and being in the Southeast region both slightly reduce the estimate
              relative to the baseline.
            </p>
            <p>
              <span className="font-semibold text-[#1A1A1A]">Sum everything up.</span>{' '}
              Base + all SHAP values = the final log-prediction, which we then exp() to get the
              dollar estimate.
            </p>
          </div>
        </div>
      </div>

      {/* SVR vs XGBoost trade-off */}
      <div className="fade-up-d3 space-y-6">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">The Engineering Trade-off</p>
          <h2 className="font-display text-2xl text-[#1A1A1A] mb-3">
            Why Gradient Boosting over SVR?
          </h2>
          <p className="font-body text-sm text-[#555] leading-relaxed">
            My most mathematically precise model was Support Vector Regression (SVR). However, SVR uses a kernel trick that makes it fundamentally incompatible with SHAP's fast TreeExplainer. The only option would be KernelExplainer, a SHAP method that approximates Shapley values by sampling, which on 1,337 rows would take 20+ minutes and threatened to crash my RAM entirely.
          </p>
          <p className="font-body text-sm text-[#555] leading-relaxed mt-3">
            I made a deliberate engineering trade-off: sacrifice 0.02% in R² to gain full, fast, exact SHAP explainability. A model that can explain itself clearly is more  valuable to a real product than one that's marginally more accurate but opaque.
          </p>
        </div>

        <div className="overflow-x-auto border border-[#E4E2DA]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>SVR </th>
                <th>Gradient Boosting</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {tradeoffRows.map(r => (
                <tr key={r.criterion}>
                  <td className="font-medium">{r.criterion}</td>
                  <td className={`font-mono text-sm ${r.winner === 'svr' ? 'text-[#2D6A4F]' : 'text-[#888]'}`}>
                    {r.svr}
                  </td>
                  <td className={`font-mono text-sm ${r.winner === 'gb' ? 'text-[#1A1A1A] font-semibold' : 'text-[#888]'}`}>
                    {r.gb}
                  </td>
                  <td>
                    {r.winner === 'gb'
                      ? <span className="badge-low">GB</span>
                      : <span className="badge-mid">SVR</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card bg-[#F9F8F5] max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#888] mb-2">Key insight</p>
          <p className="font-body text-sm text-[#444] leading-relaxed">
            Explainability isn't a trade-off against quality, it's a feature in itself. In real insurance contexts, regulations often require that a model can justify its decisions per patient. SHAP makes that legally and practically possible. SVR, for all its kernel elegance, cannot.
          </p>
        </div>
      </div>

    </div>
  )
}
