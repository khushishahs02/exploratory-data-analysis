import React, { useState } from 'react';
import PredictTab  from './tabs/PredictTab.jsx';
import ExplainTab  from './tabs/ExplainTab.jsx';
import ModelTab    from './tabs/ModelTab.jsx';
import AboutTab    from './tabs/AboutTab.jsx';
import AuthorTab   from './tabs/AuthorTab.jsx';

const TABS = [
  { id: 'predict', label: 'Predict' },
  { id: 'explain', label: 'Explain' },
  { id: 'model',   label: 'Model Registry' },
  { id: 'about',   label: 'Analytics' },
  { id: 'author',  label: 'Author' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('predict');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">

      {/* Top notice bar */}
      <div className="bg-stone-800 text-stone-300 text-xs font-medium px-6 py-2 text-center tracking-wide">
        Academic project · Not licensed for clinical or financial guidance
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-stone-800 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-stone-900">Veda Life</span>
              <span className="text-sm font-bold tracking-tight text-stone-400 ml-1">AI</span>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  activeTab === t.id
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 w-full">
        <div className="animate-fadeIn" key={activeTab}>
          {activeTab === 'predict' && <PredictTab />}
          {activeTab === 'explain' && (
            <div className="max-w-6xl mx-auto px-6 py-10"><ExplainTab /></div>
          )}
          {activeTab === 'model' && (
            <div className="max-w-6xl mx-auto px-6 py-10"><ModelTab /></div>
          )}
          {activeTab === 'about' && (
            <div className="max-w-6xl mx-auto px-6 py-10"><AboutTab /></div>
          )}
          {activeTab === 'author' && (
            <div className="max-w-6xl mx-auto px-6 py-10"><AuthorTab /></div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-stone-400">
          <span>© 2026 Veda Life AI · Academic portfolio</span>
          <div className="flex items-center gap-5">
            <a href="https://github.com/khushishahs02/insurance-charges-prediction" target="_blank" rel="noopener noreferrer"
               className="hover:text-stone-700 transition-colors font-medium">GitHub</a>
            <a href="https://www.linkedin.com/in/khushi-shah-009b38266/" target="_blank" rel="noopener noreferrer"
               className="hover:text-stone-700 transition-colors font-medium">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
