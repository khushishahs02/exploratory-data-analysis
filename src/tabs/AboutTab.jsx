import React, { useState } from 'react';

const keyPlots = [
  {
    src: '/plots/eda_07.png',
    title: 'Smoker vs Insurance Charges',
    insight: 'Smokers pay 3–4× more than non-smokers: median ~$35,000 vs ~$8,000. This single factor dominates every model\'s feature importance.',
  },
  {
    src: '/plots/eda_12.png',
    title: 'Correlation Heatmap',
    insight: 'Age (r = 0.30) and BMI (r = 0.20) are the strongest numeric predictors. Smoking is categorical and absent from this heatmap but is the true dominant driver.',
  },
  {
    src: '/plots/model_01.png',
    title: 'SHAP Waterfall — Patient #2',
    insight: 'Per-patient SHAP breakdown from base value (E[f(X)] = 9.092). Age contributes +0.37; non-smoker status subtracts -0.28 from the final prediction.',
  },
  {
    src: '/plots/model_02.png',
    title: 'SHAP Interaction: BMI × Smoking',
    insight: 'BMI only significantly increases charges for smokers. For non-smokers BMI has minimal effect — revealing the critical "smoker multiplier" interaction term.',
  },
];

const stats = [
  { v: '1,338', l: 'Records',         d: 'patient profiles' },
  { v: '8',     l: 'Models Trained',  d: 'supervised algorithms' },
  { v: '0.8686',l: 'Best R²',         d: 'Gradient Boosting' },
  { v: 'SHAP',  l: 'Explainer',       d: 'TreeExplainer' },
];

export default function AboutTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Analytics Overview</h1>
        <p className="text-stone-500 mt-2 max-w-2xl leading-relaxed">
          An end-to-end ML pipeline predicting US health insurance charges with full SHAP explainability. Trained on 1,338 patient records using Gradient Boosting.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.l} className="bg-white border border-stone-200 rounded-2xl p-5 text-center hover:border-stone-300 transition-colors">
            <p className="text-2xl font-bold text-stone-900 font-mono">{s.v}</p>
            <p className="text-sm font-semibold text-stone-700 mt-1">{s.l}</p>
            <p className="text-xs text-stone-400 mt-0.5">{s.d}</p>
          </div>
        ))}
      </div>

      {/* Example patient */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Example Patient Profile</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
            <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block mb-2">Subject</span>
            <span className="text-lg font-bold text-stone-900 block mb-3">Aarav Sharma</span>
            <div className="space-y-1.5 text-sm text-stone-600">
              <p>Age: <span className="text-stone-800 font-medium">45 years</span></p>
              <p>BMI: <span className="text-amber-700 font-medium">28.9 — Overweight</span></p>
              <p>Smoker: <span className="text-emerald-700 font-medium">No</span></p>
              <p>Region: <span className="text-stone-700 font-medium">US Southwest</span></p>
              <p>Dependents: <span className="text-stone-700 font-medium">2 children</span></p>
            </div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block mb-2">Predicted Charge</span>
              <span className="text-3xl font-bold text-stone-900 font-mono">$9,420.50</span>
            </div>
            <p className="text-sm text-stone-500 mt-4 leading-relaxed">
              Non-smoker status keeps charges well below average. Slightly elevated BMI adds a modest premium; southwestern region has minimal effect.
            </p>
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-4">Training data covers US-based records only — Northeast, Northwest, Southeast, Southwest.</p>
      </div>

      {/* Key Visualizations */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900">Key Visualizations</h2>
          <p className="text-sm text-stone-400 mt-1">Click any chart to expand. Selected plots from EDA, preprocessing and SHAP notebooks.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {keyPlots.map((plot, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-stone-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              {/* Image preview */}
              <div className="bg-stone-50 p-4 relative">
                <img
                  src={plot.src}
                  alt={plot.title}
                  className={`w-full rounded-lg object-contain transition-all duration-300 ${expanded === i ? 'max-h-none' : 'max-h-48'}`}
                  loading="lazy"
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
                {/* Fallback if image missing */}
                <div className="hidden w-full h-48 items-center justify-center text-stone-300 text-sm rounded-lg border-2 border-dashed border-stone-200 bg-stone-100">
                  <div className="text-center">
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M3.75 3A.75.75 0 003 3.75v16.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V3.75A.75.75 0 0020.25 3H3.75z" /></svg>
                    <span className="font-mono text-xs opacity-60">{plot.src}</span>
                  </div>
                </div>
                <div className="absolute top-5 right-5">
                  <div className="w-6 h-6 bg-white border border-stone-200 rounded-md flex items-center justify-center text-stone-400 shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {expanded === i
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      }
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-sm font-bold text-stone-800 mb-1.5">{plot.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{plot.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
