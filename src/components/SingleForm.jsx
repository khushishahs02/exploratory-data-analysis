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
  if (b < 18.5) return '- Underweight'
  if (b < 25) return '- Normal weight'
  if (b < 30) return '- Overweight'
  return '- Obese'
}

export default function SingleForm() {
  const [form, setForm] = useState({
    age: '', sex: 'male', bmi: '', children: 0, smoker: 'no', region: 'northeast',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    setMsgIdx(0)

    const interval = setInterval(() => {
      setMsgIdx(i => (i + 1 < LOADING_MESSAGES.length ? i + 1 : i))
    }, 700)

    try {
      const data = await predictSingle({
        age: parseInt(form.age),
        sex: form.sex,
        bmi: parseFloat(form.bmi),
        children: parseInt(form.children),
        smoker: form.smoker,
        region: form.region,
      })

      let prediction = data.prediction
      if (prediction < 50) {
        prediction = Math.exp(prediction)
      }
      setResult({ ...data, prediction })
    } catch (e) {
      setError(
        `Could not reach the prediction backend.`
      )
      console.error(e)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const valid = form.age && form.bmi && !isNaN(parseFloat(form.age)) && !isNaN(parseFloat(form.bmi))
    && parseFloat(form.age) >= 18 && parseFloat(form.bmi) > 10

  return (
    <div className="grid md:grid-cols-2 gap-10">

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
          <label className="eyebrow block mb-2">Biological Sex</label>
          <div className="flex">
            {['male', 'female'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => set('sex', s)}
                className={`flex-1 py-3 text-sm font-body border transition-colors capitalize
                  ${form.sex === s
                    ? 'bg-[#1A1A1A] text-[#F5F4F0] border-[#1A1A1A]'
                    : 'bg-white text-[#555] border-[#D8D6CE] hover:border-[#1A1A1A]'
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
              <span className="ml-2 normal-case text-[#888] font-body font-normal">
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
          <p className="mt-1 text-[10px] font-mono text-[#AAA]">
            BMI = weight(kg) ÷ height(m)²
          </p>
        </div>

        {/* Children */}
        <div>
          <label className="eyebrow block mb-2">Dependents = {form.children}</label>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => set('children', n)}
                className={`flex-1 py-2.5 text-xs font-mono border transition-colors
                  ${form.children == n
                    ? 'bg-[#1A1A1A] text-[#F5F4F0] border-[#1A1A1A]'
                    : 'bg-white text-[#666] border-[#D8D6CE] hover:border-[#1A1A1A]'
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Smoker */}
        <div>
          <label className="eyebrow block mb-2">Smoker Status</label>
          <div className="flex">
            {[
              { val: 'no', label: 'Non-Smoker' },
              { val: 'yes', label: 'Smoker' },
            ].map(s => (
              <button
                key={s.val}
                type="button"
                onClick={() => set('smoker', s.val)}
                className={`flex-1 py-3 text-sm font-body border transition-colors
                  ${form.smoker === s.val && s.val === 'yes'
                    ? 'bg-[#8B2635] text-white border-[#8B2635]'
                    : form.smoker === s.val && s.val === 'no'
                      ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                      : 'bg-white text-[#555] border-[#D8D6CE] hover:border-[#1A1A1A]'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {form.smoker === 'yes' && (
            <p className="mt-1.5 text-[11px] font-body text-[#8B2635]">
              ⚠ Smoking is the single strongest cost driver ,can add ~$15,000–$20,000 annually.
            </p>
          )}
        </div>

        {/* Region */}
        <div>
          <label className="eyebrow block mb-2">US Region</label>
          <select value={form.region} onChange={e => set('region', e.target.value)} className="field">
            {REGIONS.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <p className="mt-1 text-[10px] font-mono text-[#AAA]">
            US geographic regions only , see About for details
          </p>
        </div>

        <button
          type="button"
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
          <div className="h-full min-h-[320px] border border-dashed border-[#C8C6BE] flex flex-col items-center justify-center text-center p-10 gap-3">
            <svg className="w-8 h-8 text-[#CCC]" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
            </svg>
            <p className="eyebrow">Your estimate will appear here</p>
            <p className="text-xs font-body text-[#999] max-w-xs leading-relaxed">
              Fill in the patient details on the left and click Estimate to see the prediction with a full SHAP breakdown.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full min-h-[320px] border border-[#E4E2DA] flex flex-col items-center justify-center text-center p-10 gap-4">
            <div className="w-5 h-5 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
            <p className="eyebrow">{LOADING_MESSAGES[msgIdx]}</p>
          </div>
        )}

        {error && (
          <div className="border border-[#E8B4BB] bg-[#FAEAEC] p-5 space-y-2">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#8B2635]">Connection Error</p>
            <p className="text-sm font-body text-[#8B2635] leading-relaxed">{error}</p>
          </div>
        )}

        {result && (
          <div className="card space-y-6 fade-up">
            {/* Estimate */}
            <div className="border-b border-[#EDECEA] pb-4">
              <p className="eyebrow mb-1">Estimated Annual Charge (USD)</p>
              <p className="font-display text-4xl text-[#1A1A1A]">
                ${Math.round(result.prediction).toLocaleString('en-US')}
              </p>
              <p className="text-[11px] font-mono text-[#AAA] mt-1.5">
                ± ${Math.round(result.prediction * 0.08).toLocaleString('en-US')} · approx. 1 RMSE band
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

            {/* Plain English */}
            {result.plain_english?.length > 0 && (
              <div className="border-t border-[#EDECEA] pt-4 space-y-2">
                <p className="eyebrow mb-2">In Plain English</p>
                {result.plain_english.map((line, i) => (
                  <p key={i} className="text-sm font-body text-[#444] leading-relaxed">{line}</p>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-[#FDF3E3] border border-[#F0D6A8] p-4 space-y-1">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9A6320]">
                ⚠ Actual charges may vary significantly
              </p>
              <p className="text-xs font-body text-[#7A4F10] leading-relaxed">
                This model does not account for pre-existing conditions, cardiovascular risk,
                mental health history, prescription drug use, family medical history, or
                insurer-specific pricing policies. Actual insurance charges depend on many
                factors not captured in this dataset. This estimate is for academic
                demonstration purposes only.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
