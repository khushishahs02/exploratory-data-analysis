import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import BatchUpload from '../components/BatchUpload.jsx';

export default function PredictTab() {
  const [inputMode, setInputMode]   = useState('single');
  const [formData, setFormData]     = useState({ age: 30, sex: 'female', bmi: 24.2, children: 0, smoker: false, region: 'northeast' });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const getBmiCategory = (val) => {
    const b = parseFloat(val);
    if (isNaN(b) || b <= 0) return '';
    if (b < 18.5) return 'Underweight';
    if (b < 25)   return 'Normal';
    if (b < 30)   return 'Overweight';
    return 'Obese';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res  = await fetch(`${BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age), sex: formData.sex, bmi: parseFloat(formData.bmi),
          children: parseInt(formData.children), smoker: formData.smoker, region: formData.region
        })
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setPrediction(await res.json());
    } catch (err) {
      setError('Prediction failed. Make sure the backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full bg-stone-50 border border-stone-200 px-3.5 py-2.5 text-stone-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400 transition-all placeholder-stone-400';

  return (
    <div>
      {/* ── LANDING HERO ── */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-500 text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Inference · Gradient Boosting
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight mb-6">
            Insurance Cost
            <br />
            <span className="text-stone-400">Prediction Engine</span>
          </h1>

          <p className="text-stone-500 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Enter patient parameters to get an instant charge estimate with transparent SHAP feature attribution.
          </p>

          {/* Key stats */}
          <div className="inline-flex items-center gap-8 md:gap-12 bg-stone-50 border border-stone-200 rounded-2xl px-8 py-5 mt-2">
            {[
              { v: '1,338', l: 'Training Records' },
              { v: '8',     l: 'Models Evaluated' },
              { v: '0.8686',l: 'Best R² Score' },
              { v: 'SHAP',  l: 'Explainability' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-xl font-bold text-stone-800 font-mono">{s.v}</div>
                <div className="text-xs text-stone-400 mt-0.5 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PREDICTION AREA ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Mode toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-white border border-stone-200 p-1 rounded-xl inline-flex shadow-sm">
            {[
              { id: 'single', label: 'Single Patient' },
              { id: 'batch',  label: 'Batch CSV Upload' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setInputMode(m.id)}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
                  inputMode === m.id ? 'bg-stone-900 text-white shadow' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {inputMode === 'batch' ? (
          <BatchUpload />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-5">
              <div>
                <h2 className="text-base font-bold text-stone-900 mb-1">Patient Parameters</h2>
                <p className="text-xs text-stone-400">Fill in the fields below to generate a prediction.</p>
              </div>

              <div className="space-y-4">
                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} min="1" max="120" className={inputBase} />
                </div>

                {/* Sex */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Biological Sex</label>
                  <div className="flex gap-3">
                    {['female','male'].map(g => (
                      <label key={g} className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium capitalize ${
                        formData.sex === g ? 'border-stone-800 bg-stone-900 text-white' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                      }`}>
                        <input type="radio" name="sex" value={g} checked={formData.sex === g} onChange={handleChange} className="hidden" />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                {/* BMI */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    BMI
                    {getBmiCategory(formData.bmi) && (
                      <span className="ml-2 normal-case text-stone-400 font-normal">— {getBmiCategory(formData.bmi)}</span>
                    )}
                  </label>
                  <input type="number" name="bmi" value={formData.bmi} onChange={handleChange} step="0.1" className={inputBase} />
                </div>

                {/* Children */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Dependents</label>
                  <input type="number" name="children" value={formData.children} onChange={handleChange} min="0" max="10" className={inputBase} />
                </div>

                {/* Smoker */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Smoker Status</label>
                  <div className="flex gap-3">
                    {[{ v: false, l: 'Non-Smoker' }, { v: true, l: 'Smoker' }].map(s => (
                      <button
                        key={String(s.v)}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, smoker: s.v }))}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                          formData.smoker === s.v ? 'border-stone-800 bg-stone-900 text-white' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                        }`}
                      >
                        {s.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">US Region</label>
                  <select name="region" value={formData.region} onChange={handleChange} className={inputBase}>
                    <option value="northeast">Northeast</option>
                    <option value="northwest">Northwest</option>
                    <option value="southeast">Southeast</option>
                    <option value="southwest">Southwest</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-stone-900 text-white font-semibold py-3.5 text-sm rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed mt-2">
                {loading ? 'Computing...' : 'Run Prediction →'}
              </button>
            </form>

            {/* ── RESULTS ── */}
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-8 shadow-sm flex flex-col min-h-[520px]">

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-6">
                  {error}
                </div>
              )}

              {!prediction && !error && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-5">
                    <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-stone-600 uppercase tracking-widest">System Ready</h3>
                  <p className="text-sm text-stone-400 mt-2 max-w-sm leading-relaxed">
                    Configure patient parameters and click "Run Prediction" to see the estimated annual insurance charge with SHAP attribution.
                  </p>
                </div>
              )}

              {prediction && (
                <div className="space-y-7 animate-fadeUp flex flex-col h-full">
                  {/* Cost display */}
                  <div className="pb-6 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">Estimated Annual Charge</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-bold text-stone-900 font-mono tracking-tight">
                        ${prediction.estimated_charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-2 font-mono">
                      Range: ${prediction.range_min.toLocaleString()} – ${prediction.range_max.toLocaleString()}
                    </p>
                  </div>

                  {/* SHAP chart */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">SHAP Feature Attribution</p>
                    <div className="flex-1 min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prediction.shap_data} layout="vertical" margin={{ top: 0, right: 24, left: 24, bottom: 0 }}>
                          <XAxis type="number" stroke="#d6d3d1" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="feature" stroke="#d6d3d1" width={100} tick={{ fontSize: 11, fill: '#78716c', fontWeight: 500 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: '#f5f5f4' }}
                            contentStyle={{ backgroundColor: '#fff', borderColor: '#e7e5e4', color: '#1c1917', fontSize: 12, borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '10px 14px' }}
                          />
                          <ReferenceLine x={0} stroke="#d6d3d1" strokeWidth={1.5} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {prediction.shap_data.map((entry, i) => (
                              <Cell key={i} fill={entry.value > 0 ? '#ef4444' : '#6366f1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span> Increases cost</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span> Decreases cost</span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                    <p className="text-sm text-stone-600 leading-relaxed">{prediction.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
