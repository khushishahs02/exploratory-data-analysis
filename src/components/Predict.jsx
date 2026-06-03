import { useState } from 'react'
import SingleForm  from './SingleForm.jsx'
import BatchUpload from './BatchUpload.jsx'

const tabs = ['Single Patient', 'Batch Upload (CSV)']

export default function Predict() {
  const [active, setActive] = useState(0)

  return (
    <section id="predict" className="border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">

        {/* Section header */}
        <div className="mb-10">
          <p className="eyebrow mb-3">Prediction Engine</p>
          <h2 className="section-title mb-3">Estimate Insurance Charges</h2>
          <p className="font-body text-ink-500 text-sm max-w-lg">
            Enter a single patient's profile for an instant estimate with a full SHAP explanation,
            or upload a CSV to batch-score multiple patients at once.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 mb-8">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={`px-6 py-3 text-sm font-body transition-colors border-b-2 -mb-px
                ${active === i
                  ? 'border-ink-900 text-ink-900 font-medium'
                  : 'border-transparent text-ink-500 hover:text-ink-700'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {active === 0 ? <SingleForm /> : <BatchUpload />}
      </div>
    </section>
  )
}
