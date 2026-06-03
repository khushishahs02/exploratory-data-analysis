// ── Update these with your actual notebook output ──
const leaderboard = [
  { model: 'Gradient Boosting',    r2: 0.8682, mae: 0.2341, rmse: 0.3112, winner: true  },
  { model: 'Random Forest',        r2: 0.8541, mae: 0.2489, rmse: 0.3298, winner: false },
  { model: 'Decision Tree (tuned)',r2: 0.8401, mae: 0.2601, rmse: 0.3450, winner: false },
  { model: 'SVR',                  r2: 0.8312, mae: 0.2710, rmse: 0.3540, winner: false },
  { model: 'KNN',                  r2: 0.8100, mae: 0.2890, rmse: 0.3760, winner: false },
  { model: 'ElasticNet',           r2: 0.7820, mae: 0.3120, rmse: 0.4010, winner: false },
  { model: 'Lasso',                r2: 0.7818, mae: 0.3122, rmse: 0.4012, winner: false },
  { model: 'Linear Regression',    r2: 0.7815, mae: 0.3130, rmse: 0.4020, winner: false },
]

const fairness = [
  { group: 'Smokers',     n: 64,  r2: 0.832, mae: 0.281 },
  { group: 'Non-Smokers', n: 203, r2: 0.891, mae: 0.198 },
]

const importance = [
  { feature: 'is_smoker',           pct: 58.4 },
  { feature: 'age',                 pct: 19.2 },
  { feature: 'bmi',                 pct: 8.6  },
  { feature: 'bmi_category_Obese',  pct: 6.1  },
  { feature: 'children',            pct: 3.2  },
  { feature: 'region_southwest',    pct: 1.8  },
  { feature: 'is_female',           pct: 1.4  },
  { feature: 'region_southeast',    pct: 1.3  },
]

export default function ModelPerf() {
  return (
    <section id="model" className="border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-14">

        {/* Header */}
        <div>
          <p className="eyebrow mb-3">Evaluation</p>
          <h2 className="section-title">Model Performance</h2>
        </div>

        {/* Leaderboard + feature importance */}
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">

          {/* Leaderboard table */}
          <div>
            <p className="eyebrow mb-4">8-Model Leaderboard</p>
            <div className="overflow-x-auto border border-stone-200">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>R² Score</th>
                    <th>MAE</th>
                    <th>RMSE</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map(row => (
                    <tr key={row.model} className={row.winner ? 'winner' : ''}>
                      <td className="flex items-center gap-2">
                        {row.winner && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 inline-block" />
                        )}
                        {row.model}
                        {row.winner && (
                          <span className="font-mono text-xs text-gold-600 ml-1">(selected)</span>
                        )}
                      </td>
                      <td className="font-mono">{row.r2.toFixed(4)}</td>
                      <td className="font-mono">{row.mae.toFixed(4)}</td>
                      <td className="font-mono">{row.rmse.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs font-mono text-ink-400 mt-2">
              * Metrics reported on log-transformed target. MAE/RMSE are in log-charge units.
            </p>
          </div>

          {/* Feature importance */}
          <div className="card">
            <p className="eyebrow mb-5">Feature Importance</p>
            <div className="space-y-3">
              {importance.map(f => (
                <div key={f.feature}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs text-ink-600">{f.feature}</span>
                    <span className="font-mono text-xs text-ink-500">{f.pct}%</span>
                  </div>
                  <div className="h-2 bg-stone-100">
                    <div
                      className="h-full bg-ink-800"
                      style={{ width: `${f.pct}%`, transition: 'width 0.6s ease' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fairness audit */}
        <div className="border border-stone-200 p-8 bg-white grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="eyebrow mb-3">Subgroup Fairness Audit</p>
            <h3 className="font-display text-xl text-ink-900 mb-3">
              Consistent performance across risk tiers
            </h3>
            <p className="font-body text-sm text-ink-600 leading-relaxed">
              The model was independently evaluated on smoker and non-smoker subgroups to audit for
              performance disparity. Both subgroups maintain strong R² scores, confirming the model
              does not disproportionately mis-estimate costs for high-risk patients.
            </p>
          </div>
          <div className="space-y-4">
            {fairness.map(f => (
              <div key={f.group} className="flex items-center justify-between border border-stone-100 p-4">
                <div>
                  <p className="font-body text-sm font-medium text-ink-900">{f.group}</p>
                  <p className="font-mono text-xs text-ink-400 mt-0.5">n = {f.n} patients</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl text-ink-900">{f.r2.toFixed(3)}</p>
                  <p className="font-mono text-xs text-ink-400">R² Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
