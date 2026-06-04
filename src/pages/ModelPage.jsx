const leaderboard = [
  {
    model: 'SVR ',
    r2: 0.881284, mae: 0.161910, rmse: 0.331948,
    notes: 'Highest R² but KernelExplainer is too slow so was ruled out for SHAP',
    winner: false, svr: true,
  },
  {
    model: 'Gradient Boosting',
    r2: 0.881033, mae: 0.183035, rmse: 0.332299,
    notes: 'Selected as TreeExplainer compatible, 0.03% R² below SVR',
    winner: true, svr: false,
  },
  {
    model: 'Decision Tree (tuned)',
    r2: 0.870924, mae: 0.194050, rmse: 0.346130,
    notes: 'Good standalone interpretability; overfits without tuning',
    winner: false, svr: false,
  },
  {
    model: 'Random Forest (tuned)',
    r2: 0.841971, mae: 0.200789, rmse: 0.382987,
    notes: 'Bagging ensemble; stable but lower R² than boosting',
    winner: false, svr: false,
  },
  {
    model: 'ElasticNet',
    r2: 0.825423, mae: 0.270492, rmse: 0.402541,
    notes: 'L1 + L2 regularisation; limited by linear assumption',
    winner: false, svr: false,
  },
  {
    model: 'Lasso',
    r2: 0.825121, mae: 0.270713, rmse: 0.402889,
    notes: 'Automatic feature selection; nearly identical to ElasticNet',
    winner: false, svr: false,
  },
  {
    model: 'Linear Regression',
    r2: 0.824752, mae: 0.271340, rmse: 0.403313,
    notes: 'Baseline model; assumes linear charge relationships',
    winner: false, svr: false,
  },
  {
    model: 'KNN',
    r2: 0.720246, mae: 0.339250, rmse: 0.509570,
    notes: 'Sensitive to scale; no native feature importance',
    winner: false, svr: false,
  },
]

const shapImportance = [
  { feature: 'is_smoker', val: 0.50, pct: 100 },
  { feature: 'age', val: 0.43, pct: 86 },
  { feature: 'children', val: 0.10, pct: 20 },
  { feature: 'bmi', val: 0.08, pct: 16 },
  { feature: 'is_female', val: 0.03, pct: 6 },
  { feature: 'region_southwest', val: 0.03, pct: 6 },
  { feature: 'region_southeast', val: 0.02, pct: 4 },
  { feature: 'bmi_category_Overweight', val: 0.01, pct: 2 },
  { feature: 'bmi_category_Normal', val: 0.00, pct: 0.5 },
  { feature: 'region_northwest', val: 0.00, pct: 0.5 },
  { feature: 'bmi_category_Obese', val: 0.00, pct: 0.5 },
]

const corrData = [
  { pair: 'age ↔ charges', r: 0.300, strength: 'Moderate' },
  { pair: 'bmi ↔ charges', r: 0.200, strength: 'Weak–Moderate' },
  { pair: 'children ↔ charges', r: 0.068, strength: 'Very weak' },
  { pair: 'age ↔ bmi', r: 0.110, strength: 'Very weak' },
  { pair: 'age ↔ children', r: 0.042, strength: 'Negligible' },
  { pair: 'bmi ↔ children', r: 0.013, strength: 'Negligible' },
]

const plots = [
  {
    id: 'waterfall',
    file: '/plots/waterfall.png',
    title: 'SHAP Waterfall for a Sample Patient',
    insight: [
      'This waterfall shows a female non-smoker, age 24, BMI overweight, 2 children in the southwest. Because she is a non-smoker, is_smoker contributes −0.26 (pulling cost down). Her young age also reduces cost (−0.38). Unusually, children contributes +0.42 here, more dependents slightly increase premiums in this case.',
      'The base value 9.092 is the model\'s average log-prediction across all training patients, equivalent to roughly $8,900.',
    ],
  },
  {
    id: 'beeswarm',
    file: '/plots/beeswarm.png',
    title: 'SHAP Beeswarm for Global Impact',
    insight: [
      'is_smoker has the widest spread by far. The red dots (smokers) cluster at +1.5 SHAP and above, while the blue dots (non-smokers) cluster near 0. This single binary feature can shift a prediction by over $15,000.',
      'Age shows a gradual gradient: older patients (red) have higher SHAP values, younger patients (blue) have lower. BMI and children show more compressed distributions- important but not dominant.',
    ],
  },
  {
    id: 'global_importance',
    file: '/plots/global_importance.png',
    title: 'Global Feature Importance ',
    insight: [
      'is_smoker and age together account for the vast majority of the model\'s predictive signal. Children and BMI contribute meaningfully but at a fraction of the impact.',
      'The BMI category bins (Obese, Overweight, Normal) show near-zero importance here, this is because raw BMI itself captures most of that information. The binning adds minor incremental signal.',
    ],
  },
  {
    id: 'correlation',
    file: '/plots/correlation.png',
    title: 'Pearson Correlation Heatmap',
    insight: [
      'Age has the strongest linear correlation with charges, followed by BMI. These are moderate correlations that are significant enough to matter but not dominant on their own, which is why a non-linear model like Gradient Boosting outperforms linear regression.',
      'The near-zero correlations between features confirm there is no multicollinearity issue. Each feature brings genuinely independent information to the model.',
    ],
  },
]

export default function ModelPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-20">

      {/* Header */}
      <div className="fade-up max-w-2xl">
        <p className="eyebrow mb-3">Evaluation</p>
        <h1 className="section-title mb-4">Model Performance</h1>
        <p className="font-body text-[#555] text-base leading-relaxed">
          Eight algorithms were trained on the same 80/20 train-test split.
          Metrics are on the log-transformed target (R², MAE, RMSE in log-charge units).
          SVR scored marginally higher but Gradient Boosting was selected not for raw accuracy,  but because it supports SHAP's fast TreeExplainer.
        </p>
      </div>

      {/* Leaderboard */}
      <div className="fade-up-d1 space-y-4">
        <p className="eyebrow">8-Model Leaderboard</p>
        <div className="overflow-x-auto border border-[#E4E2DA]">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Model</th>
                <th>R² Score</th>
                <th>MAE</th>
                <th>RMSE</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, i) => (
                <tr key={row.model} className={row.winner ? 'winner' : ''}>
                  <td className="font-mono text-[#AAA]">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-2 flex-wrap">
                      {row.winner && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] inline-block shrink-0" />
                      )}
                      <span className={row.winner ? 'font-medium' : ''}>{row.model}</span>
                      {row.winner && (
                        <span className="font-mono text-[10px] text-[#9A6320] bg-[#FDF3E3] px-1.5 py-0.5 border border-[#F0D6A8]">
                          SELECTED
                        </span>
                      )}
                      {row.svr && (
                        <span className="font-mono text-[10px] text-[#555] bg-[#F0EEE8] px-1.5 py-0.5 border border-[#D8D6CE]">
                          SHAP INCOMPATIBLE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="font-mono">{row.r2.toFixed(6)}</td>
                  <td className="font-mono">{row.mae.toFixed(6)}</td>
                  <td className="font-mono">{row.rmse.toFixed(6)}</td>
                  <td className="text-xs text-[#666] max-w-xs">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-6 flex-wrap">
          <p className="text-xs font-mono text-[#AAA]">
            * All metrics on log-transformed target. MAE and RMSE are in log-charge units, not USD.
          </p>
          <p className="text-xs font-mono text-[#AAA]">
            * SVR scored highest (0.8813) but was ruled out because KernelExplainer is too slow for production SHAP.
          </p>
        </div>
      </div>

      {/* SHAP Feature Importance bars — from actual notebook values */}
      <div className="fade-up-d2 space-y-5">
        <div className="max-w-2xl">
          <p className="eyebrow mb-2">SHAP Feature Importance</p>
          <p className="font-body text-sm text-[#555] leading-relaxed">
            Mean absolute SHAP value per feature across all test patients. SHAP importance reflects the actual impact on predictions, not just split frequency in the trees.
          </p>
        </div>
        <div className="max-w-xl space-y-3">
          {shapImportance.map(f => (
            <div key={f.feature}>
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs text-[#555]">{f.feature}</span>
                <span className="font-mono text-xs text-[#AAA]">+{f.val.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-[#EDECEA]">
                <div
                  className="h-full bg-[#1A1A1A] transition-all"
                  style={{ width: `${Math.max(f.pct, 0.5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Correlation summary table */}
      <div className="fade-up-d3 space-y-5">
        <div className="max-w-2xl">
          <p className="eyebrow mb-2">Pearson Correlation</p>
          <p className="font-body text-sm text-[#555] leading-relaxed">
            Linear correlation between numeric features and the target.
            Low correlations between features confirm no multicollinearity.
          </p>
        </div>
        <div className="max-w-lg border border-[#E4E2DA] overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature Pair</th>
                <th>Pearson r</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {corrData.map(c => (
                <tr key={c.pair}>
                  <td className="font-mono text-xs">{c.pair}</td>
                  <td className="font-mono">{c.r.toFixed(3)}</td>
                  <td className="text-xs text-[#666]">{c.strength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Analytics / Plots section ── */}
      <div className="space-y-6">
        <div className="max-w-2xl">
          <p className="eyebrow mb-2">Analytics & Visualisations</p>
          <h2 className="font-display text-2xl text-[#1A1A1A] mb-3">Plots from the Notebook</h2>
          <p className="font-body text-sm text-[#555] leading-relaxed">
            These are the actual plots generated during model analysis. Each is annotated with an insight explaining what the visual reveals and why it matters.
          </p>
        </div>

        <div className="space-y-12">
          {plots.map((plot, i) => (
            <div
              key={plot.id}
              className={`grid md:grid-cols-2 gap-8 items-start ${i % 2 === 1 ? 'md:[direction:rtl]' : ''
                }`}
            >
              {/* Plot image */}
              <div className={`card p-0 overflow-hidden ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                <div className="bg-[#1A1A1A] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#AAA] tracking-[0.18em] uppercase">
                    {plot.title}
                  </span>
                </div>
                <div className="bg-white p-3">
                  <img
                    src={plot.file}
                    alt={plot.title}
                    className="w-full object-contain"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  {/* Fallback placeholder shown if image not found */}
                  <div
                    className="hidden w-full h-48 bg-[#F5F4F0] border border-dashed border-[#C8C6BE] items-center justify-center"
                  >
                    <p className="font-mono text-xs text-[#AAA] text-center px-4">
                      Add <span className="text-[#666]">{plot.file}</span> to your public/ folder
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight text */}
              <div className={`space-y-4 ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                <p className="eyebrow">{`Plot ${i + 1} of ${plots.length}`}</p>
                <h3 className="font-display text-xl text-[#1A1A1A] leading-snug">{plot.title}</h3>
                {plot.insight.map((line, j) => (
                  <p key={j} className="font-body text-sm text-[#555] leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
