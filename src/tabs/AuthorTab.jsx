import React from 'react';

export default function AuthorTab() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">About the Author</h1>
        <p className="text-stone-500 mt-2">The creator behind Veda Life AI — passionate about data science, machine learning, and transparent AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Profile Card */}
        <div className="md:col-span-8 bg-white border border-stone-200 rounded-2xl p-8">
          {/* Avatar row */}
          <div className="flex items-center gap-5 mb-7 pb-7 border-b border-stone-100">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white tracking-tight">KS</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Khushi Shah</h2>
              <p className="text-sm text-stone-500 font-medium mt-0.5">Data Science & Machine Learning Enthusiast</p>
              <p className="text-xs text-stone-400 mt-1">Building transparent AI systems · Summer 2026</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
            <p>
              My journey into data science started with the raw basics: wrestling with NumPy and Pandas, and building visual dashboards in Microsoft Power BI. I became passionate about data analytics and eventually followed tutorials from Sheryians AI School (huge shoutout to my mentor, Akarsh Vyas) to build an insurance pricing model — but I refused to just copy-paste code. I have a personal rule: if I start learning something, I do it in exhaustive detail the first time.
            </p>
            <p>
              So I dove deep. Days mastering EDA, leakage-safe scaling, outlier treatment, correlation mapping, and BMI category feature engineering. In the ML phase I systematically trained every major supervised algorithm using Gemini as a learning companion, so I wouldn't miss a single concept.
            </p>
            <p>
              Here is where it got interesting. My best model mathematically was SVR — but SVR requires SHAP's KernelExplainer, which threatened to crash my RAM. So I made a conscious engineering trade-off: deployed second-best XGBoost, which unlocks the lightning-fast TreeExplainer. Discovering that you can force a "black box" to explain its math in plain English was a game-changer.
            </p>
            <p>
              This is my first major end-to-end project, and I genuinely loved every part of it. Next I'm planning classification algorithms and messier datasets. Thank you for reading my story — now give the Predictor a try!
            </p>
          </div>
        </div>

        {/* Social links */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <a
            href="https://github.com/khushishahs02/insurance-charges-prediction"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-white border border-stone-200 rounded-2xl p-6 hover:border-stone-800 hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center text-center"
          >
            <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-stone-900">GitHub</h3>
            <p className="text-xs text-stone-400 mt-1">View Source Code</p>
          </a>

          <a
            href="https://www.linkedin.com/in/khushi-shah-009b38266/"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-white border border-stone-200 rounded-2xl p-6 hover:border-[#0A66C2] hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center text-center"
          >
            <div className="w-14 h-14 bg-[#0A66C2] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-stone-900">LinkedIn</h3>
            <p className="text-xs text-stone-400 mt-1">Connect with Me</p>
          </a>
        </div>
      </div>
    </div>
  );
}
