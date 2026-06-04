import { useState } from 'react'
import SingleForm from '../components/SingleForm.jsx'
import BatchUpload from '../components/BatchUpload.jsx'

const tabs = ['Single Patient', 'Batch Upload (CSV)']

export default function PredictPage() {
  const [active, setActive] = useState(0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">

      <div className="fade-up mb-10">
        <p className="eyebrow mb-3">Prediction Engine</p>
        <h1 className="section-title mb-3">Estimate Insurance Charges</h1>
        <p className="font-body text-[#555] text-sm max-w-lg leading-relaxed">
          Enter a single patient profile for an instant estimate with full SHAP explanation,
          or upload a CSV to score multiple patients at once. No login required.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E4E2DA] mb-8">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={`px-6 py-3 text-sm font-body transition-colors border-b-2 -mb-px
              ${active === i
                ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium'
                : 'border-transparent text-[#888] hover:text-[#444]'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {active === 0 ? <SingleForm /> : <BatchUpload />}
    </div>
  )
}
