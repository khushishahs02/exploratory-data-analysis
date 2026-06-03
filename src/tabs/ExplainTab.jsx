import React from 'react';

export default function ExplainTab() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Explainability</h1>
        <p className="text-stone-500 mt-2">Why XGBoost was deployed instead of SVR, and how SHAP makes every prediction transparent.</p>
      </div>

      {/* What is SHAP */}
      <section className="bg-white border border-stone-200 rounded-2xl p-7">
        <h2 className="text-lg font-bold text-stone-900 mb-4">What is SHAP?</h2>
        <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
          <p>SHAP (SHapley Additive exPlanations) is a game-theoretic method for explaining machine learning model outputs. It draws on Shapley values from cooperative game theory to allocate credit for a prediction across every input feature.</p>
          <p>For each prediction, SHAP produces a signed contribution score per feature — showing exactly how much each input pushed the estimate higher or lower from the population average. This converts an opaque model into a fully auditable system.</p>
          <p>Critically, SHAP has two distinct explainer backends. The choice of backend is constrained by model architecture — and this constraint drove the core engineering trade-off in this project.</p>
        </div>
      </section>

      {/* SVR vs XGBoost */}
      <section className="bg-white border border-stone-200 rounded-2xl p-7">
        <h2 className="text-lg font-bold text-stone-900 mb-5">The SVR vs XGBoost Trade-Off</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* SVR */}
          <div className="border border-stone-200 rounded-xl p-5 bg-stone-50">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-sm font-bold text-stone-800">SVR  ·  R² = 0.8730  ·  Rank #0</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Highest mathematical accuracy. But SVR operates in a high-dimensional kernel space with no tree structure. SHAP requires <span className="font-semibold text-stone-700">KernelExplainer</span>, which brute-forces feature importance through repeated sampling — hundreds of forward passes per patient, creating exponential overhead and RAM crash risk in production.
            </p>
          </div>
          {/* XGBoost */}
          <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-bold text-stone-800">XGBoost  ·  R² = 0.8686  ·  Deployed</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Tree-based ensemble that unlocks SHAP's <span className="font-semibold text-stone-700">TreeExplainer</span>. Computes exact Shapley values in polynomial time by recursively traversing decision nodes. Minimal memory usage, mathematically exact (not approximated), enabling instant per-patient explanations at scale.
            </p>
          </div>
        </div>
      </section>

      {/* Accuracy sacrifice */}
      <section className="bg-white border border-stone-200 rounded-2xl p-7">
        <h2 className="text-lg font-bold text-stone-900 mb-5">The Accuracy Sacrifice</h2>
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0 bg-stone-900 text-white rounded-2xl px-6 py-5 text-center min-w-[110px]">
            <p className="text-2xl font-bold font-mono">0.44%</p>
            <p className="text-xs text-stone-400 mt-1">R² difference</p>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            By selecting XGBoost over SVR, we sacrifice only 0.44% in R² (0.8730 vs 0.8686). In exchange we gain instant, exact SHAP explanations for every prediction with no memory risk — a deliberate engineering trade-off: near-identical accuracy, full transparency, stable deployment.
          </p>
        </div>
      </section>

      {/* Summary callout */}
      <div className="flex items-start gap-4 bg-stone-100 border-l-4 border-stone-800 rounded-r-xl py-4 px-5 text-sm text-stone-600 leading-relaxed">
        <svg className="w-5 h-5 text-stone-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Gradient Boosting creates an optimised balance: minimal inference latency, structural clarity, and a deployment architecture capable of computing instant readable cost breakdowns without resource strain.
      </div>
    </div>
  );
}
