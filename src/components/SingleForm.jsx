import { useState } from 'react'
import { predictSingle } from '../api.js'
import ShapChart from './ShapChart.jsx'

const REGIONS = ['northeast', 'northwest', 'southeast', 'southwest']

const LOADING_MESSAGES = [
  'Analysing patient profile…',
  'Running Gradient Boosting model…',
  'Calculating SHAP values…',
  'Preparing explanation…',
]

const bmiCategory = (bmi) => {
  const b = parseFloat(bmi)
  if (isNaN(b)) return ''
  if (b < 18.5) return '— Underweight'
  if (b < 25)   return '— Normal weight'
  if (b < 30)   return '— Overweight'
  return '— Obese'
}

export default function SingleForm() {
  const [form, setForm] = useState({
    age: '', sex: 'male', bmi: '', children: 0, smoker: 'no', region: 'northeast',
  })
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [msgIdx,  setMsgIdx]  = useState(0)
  const [error,   setError]   = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    setMsgIdx(0)

    // Cycle loading messages
    const interval = setInterval(() => {
      setMsgIdx(i => (i + 1 < LOADING_MESSAGES.length ? i + 1 : i))
    }, 700)

    try {
      const data = await predictSingle({
        age:      parseInt(form.age),
        sex:      form.sex,
        bmi:      parseFloat(form.bmi),
        children: parseInt(form.children),
        smoker:   form.smoker,
        region:   form.region,
      })
      setResult(data)
    } catch (e) {
      setError('Prediction failed. Is the backend running? Check the console for details.')
      console.error(e)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const valid = form.age && form.bmi && !isNaN(form.age) && !isNaN(form.bmi)

  return (
    <div className="grid md:grid-cols-2 gap-8">

      {/* ── Left: Form ── */}
      <div className="space-y-5">

        {/* Age */}
        <div>
          <label className="eyebrow block mb-2">Age</label>
          <input
            type="number" min={18} max={100}
            placeholder="e.g. 34"
            value={form.age}
            onChange={e => set('age', e.target.value)}
            className="field"
          />
        </div>

        {/* Sex */}
        <div>
          <label className="eyebrow block mb-2">Sex</label>
          <div className="flex gap-0">
            {['male', 'female'].map(s => (
              <button
                key={s}
                onClick={() => set('sex', s)}
                className={`flex-1 py-3 text-sm font-body border transition-colors capitalize
                  ${form.sex === s
                    ? 'bg-ink-900 text-stone-50 border-ink-900'
                    : 'bg-white text-ink-700 border-stone-200 hover:border-ink-500'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* BMI */}
        <div>
          <label className="eyebrow block mb-2">
            BMI
            {form.bmi && (
              <span className="ml-2 normal-case text-ink-500 font-body">
                {bmiCategory(form.bmi)}
              </span>
            )}
          </label>
          <input
            type="number" min={10} max={60} step={0.1}
            placeholder="e.g. 27.5"
            value={form.bmi}
            onChange={e => set('bmi', e.target.value)}
            className="field"
          />
        </div>

        {/* Children */}
        <div>
          <label className="eyebrow block mb-2">Dependents — {form.children}</label>
          <div className="flex items-center gap-4">
            <input
              type="range" min={0} max={5} step={1}
              value={form.children}
              onChange={e => set('children', e.target.value)}
              className="flex-1 accent-ink-900"
            />
            <div className="flex gap-1">
              {[0,1,2,3,4,5].map(n => (
                <button
                  key={n}
                  onClick={() => set('children', n)}
                  className={`w-7 h-7 text-xs font-mono border transition-colors
                    ${form.children == n
                      ? 'bg-ink-900 text-stone-50 border-ink-900'
                      : 'bg-white text-ink-600 border-stone-200 hover:border-ink-500'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Smoker — prominent */}
        <div>
          <label className="eyebrow block mb-2">Smoker Status</label>
          <div className="flex gap-0">
            {['no', 'yes'].map(s => (
              <button
                key={s}
                onClick={() => set('smoker', s)}
                className={`flex-1 py-3 text-sm font-body border transition-colors
                  ${form.smoker === s && s === 'yes'
                    ? 'bg-risk-high text-stone-50 border-risk-high'
                    : form.smoker === s && s === 'no'
                    ? 'bg-risk-low  text-stone-50 border-risk-low'
                    : 'bg-white text-ink-700 border-stone-200 hover:border-ink-500'
                  }`}
              >
                {s === 'yes' ? 'Smoker' : 'Non-Smoker'}
              </button>
            ))}
          </div>
          {form.smoker === 'yes' && (
            <p className="mt-2 text-xs font-body text-risk-high">
              ⚠ Smoking is the single strongest cost driver in this model.
            </p>
          )}
        </div>

        {/* Region */}
        <div>
          <label className="eyebrow block mb-2">Region</label>
          <select value={form.region} onChange={e => set('region', e.target.value)} className="field">
            {REGIONS.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!valid || loading}
          className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? LOADING_MESSAGES[msgIdx] : 'Estimate My Charges →'}
        </button>
      </div>

      {/* ── Right: Result ── */}
      <div>
        {!result && !loading && !error && (
          <div className="h-full border border-dashed border-stone-300 flex flex-col items-center justify-center text-center p-10 gap-3">
            <div className="w-10 h-10 bg-stone-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-ink-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
            </div>
            <p className="eyebrow">Your estimate will appear here</p>
            <p className="text-xs font-body text-ink-500 max-w-xs">
              Fill in the patient details and click Estimate to see the prediction with a full SHAP explanation.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full border border-stone-200 flex flex-col items-center justify-center text-center p-10 gap-4">
            <div className="w-6 h-6 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
            <p className="eyebrow">{LOADING_MESSAGES[msgIdx]}</p>
          </div>
        )}

        {error && (
          <div className="card border-red-200 bg-red-50 text-risk-high text-sm font-body">
            {error}
          </div>
        )}

        {result && (
          <div className="card space-y-6 fade-up">
            {/* Estimate headline */}
            <div className="border-b border-stone-100 pb-4">
              <p className="eyebrow mb-1">Estimated Annual Charge</p>
              <p className="font-display text-4xl text-ink-900">
                ${result.prediction?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs font-mono text-ink-500 mt-1">
                ± ${Math.round(result.prediction * 0.08).toLocaleString()} (approx. 1 RMSE)
              </p>
            </div>

            {/* SHAP chart */}
            <div>
              <p className="eyebrow mb-3">Why this estimate</p>
              <ShapChart
                shapValues={result.shap_values}
                baseValue={result.base_value}
                prediction={result.prediction}
              />
            </div>

            {/* Plain-English summary */}
            {result.plain_english?.length > 0 && (
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <p className="eyebrow mb-2">Plain-English Summary</p>
                {result.plain_english.map((line, i) => (
                  <p key={i} className="text-sm font-body text-ink-700 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            )}

            {/* Methodology footnote */}
            <p className="text-xs font-body text-ink-400 italic border-t border-stone-100 pt-3">
              Prediction made using Gradient Boosting (R² = 0.868). SHAP values calculated via TreeExplainer.
              Model trained on US insurance data — estimates are illustrative only.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
