import React from 'react';

const leaderboardData = [
  { rank: 0, model: 'Support Vector Regression (SVR)',  r2: '0.8730', mae: '0.1564', rmse: '0.3265', deployed: false },
  { rank: 1, model: 'XGBoost (Gradient Boosting)',      r2: '0.8686', mae: '0.1811', rmse: '0.3321', deployed: true  },
  { rank: 2, model: 'Decision Tree',                    r2: '0.8596', mae: '0.1847', rmse: '0.3433', deployed: false },
  { rank: 3, model: 'Random Forest (Tuned)',             r2: '0.8272', mae: '0.1927', rmse: '0.3808', deployed: false },
  { rank: 4, model: 'ElasticNet',                       r2: '0.8055', mae: '0.2708', rmse: '0.4040', deployed: false },
  { rank: 5, model: 'Lasso',                            r2: '0.8050', mae: '0.2714', rmse: '0.4046', deployed: false },
  { rank: 6, model: 'Linear Regression',                r2: '0.8046', mae: '0.2721', rmse: '0.4050', deployed: false },
  { rank: 7, model: 'K-Nearest Neighbors (KNN)',        r2: '0.7142', mae: '0.3258', rmse: '0.4898', deployed: false },
];

const importance = [
  { feature: 'is_smoker',          pct: 58.4 },
  { feature: 'age',                pct: 19.2 },
  { feature: 'bmi',                pct: 8.6  },
  { feature: 'bmi_category_Obese', pct: 6.1  },
  { feature: 'children',           pct: 3.2  },
  { feature: 'region_southwest',   pct: 1.8  },
  { feature: 'is_female',          pct: 1.4  },
  { feature: 'region_southeast',   pct: 1.3  },
];

export default function ModelTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Model Registry</h1>
        <p className="text-stone-500 mt-2">All 8 supervised regression models evaluated and ranked by test R² score.</p>
      </div>

      {/* Leaderboard */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-700">Evaluation Leaderboard</h2>
          <span className="text-xs text-stone-400 font-mono">Metrics on log-transformed target</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-semibold text-stone-400 uppercase tracking-wider bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-3.5 text-left w-14">Rank</th>
                <th className="px-6 py-3.5 text-left">Algorithm</th>
                <th className="px-6 py-3.5 text-right font-mono">R²</th>
                <th className="px-6 py-3.5 text-right font-mono">MAE</th>
                <th className="px-6 py-3.5 text-right font-mono">RMSE</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {leaderboardData.map(row => (
                <tr key={row.rank} className={`transition-colors ${row.deployed ? 'bg-stone-50' : 'hover:bg-stone-50/50'}`}>
                  <td className="px-6 py-4 font-mono text-stone-400 text-xs">{String(row.rank).padStart(2,'0')}</td>
                  <td className={`px-6 py-4 font-semibold ${row.deployed ? 'text-stone-900' : 'text-stone-600'}`}>{row.model}</td>
                  <td className={`px-6 py-4 text-right font-mono ${row.deployed ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>{row.r2}</td>
                  <td className="px-6 py-4 text-right font-mono text-stone-400">{row.mae}</td>
                  <td className="px-6 py-4 text-right font-mono text-stone-400">{row.rmse}</td>
                  <td className="px-6 py-4 text-center">
                    {row.deployed && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Deployed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance + Fairness */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-stone-700 mb-5">Feature Importance</h3>
          <div className="space-y-3.5">
            {importance.map(f => (
              <div key={f.feature}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono text-xs text-stone-600">{f.feature}</span>
                  <span className="font-mono text-xs text-stone-400">{f.pct}%</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-800 rounded-full transition-all duration-700"
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fairness audit */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-stone-700 mb-2">Subgroup Fairness Audit</h3>
          <p className="text-xs text-stone-400 leading-relaxed mb-5">
            Model evaluated independently on smoker and non-smoker cohorts to detect performance disparity.
          </p>
          <div className="space-y-3">
            {[
              { group: 'Non-Smokers', n: 203, r2: 0.892 },
              { group: 'Smokers',     n: 64,  r2: 0.784 },
            ].map(f => (
              <div key={f.group} className="flex items-center justify-between border border-stone-200 p-4 rounded-xl hover:bg-stone-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-stone-800">{f.group}</p>
                  <p className="font-mono text-xs text-stone-400 mt-0.5">n = {f.n} patients</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-stone-900 font-mono">{f.r2.toFixed(3)}</p>
                  <p className="text-xs text-stone-400">R² Score</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-4 leading-relaxed">
            Both subgroups maintain strong R², confirming the model does not disproportionately mis-estimate costs for high-risk patients.
          </p>
        </div>
      </div>
    </div>
  );
}
