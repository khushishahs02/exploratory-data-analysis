import { useState, useRef } from 'react'
import { predictBatch } from '../api.js'

const SAMPLE_CSV = `age,sex,bmi,children,smoker,region
34,male,27.5,2,no,northeast
52,female,31.2,0,yes,southwest
28,male,22.1,1,no,northwest
45,female,29.8,3,no,southeast`

function riskBadge(tier) {
  if (tier === 'Low') return <span className="badge-low">Low</span>
  if (tier === 'High') return <span className="badge-high">High</span>
  return <span className="badge-mid">Medium</span>
}

function downloadCSV(rows) {
  if (!rows?.length) return
  const keys = Object.keys(rows[0])
  const header = keys.join(',')
  const lines = rows.map(r => keys.map(k => r[k]).join(','))
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'veda_predictions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function BatchUpload() {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const handleFile = async (f) => {
    if (!f || !f.name.endsWith('.csv')) {
      setError('Please upload a CSV file.')
      return
    }
    setFile(f)
    setError(null)
    setResults(null)
    setLoading(true)
    try {
      const data = await predictBatch(f)
      setResults(data.results)
    } catch (e) {
      setError('Batch prediction failed.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_patients.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed transition-colors p-12 flex flex-col items-center gap-3 text-center
          ${dragging ? 'border-ink-700 bg-stone-100' : 'border-stone-300 bg-white hover:border-ink-500'}`}
      >
        <svg className="w-8 h-8 text-ink-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <div>
          <p className="font-body text-sm text-ink-700 font-medium">
            {file ? file.name : 'Drop your CSV here or click to browse'}
          </p>
          <p className="text-xs text-ink-400 mt-1">
            Columns: age, sex, bmi, children, smoker, region
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={downloadSample} className="btn-ghost text-xs py-2">
          ↓ Download Sample CSV
        </button>
        {file && !loading && (
          <p className="text-xs font-mono text-ink-500">{file.name} selected</p>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-sm font-body text-ink-600">
          <div className="w-4 h-4 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
          Processing batch predictions…
        </div>
      )}

      {error && (
        <div className="card border-red-200 bg-red-50 text-risk-high text-sm font-body">
          {error}
        </div>
      )}

      {results?.length > 0 && (
        <div className="fade-up space-y-4">
          <div className="flex items-center justify-between">
            <p className="eyebrow">{results.length} patients processed</p>
            <button onClick={() => downloadCSV(results)} className="btn-primary text-xs py-2">
              ↓ Download Results CSV
            </button>
          </div>

          <div className="overflow-x-auto border border-stone-200">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>BMI</th>
                  <th>Smoker</th>
                  <th>Region</th>
                  <th>Predicted Charge</th>
                  <th>Risk Tier</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td className="font-mono text-ink-400">{i + 1}</td>
                    <td>{r.age}</td>
                    <td className="capitalize">{r.sex}</td>
                    <td>{parseFloat(r.bmi).toFixed(1)}</td>
                    <td className="capitalize">{r.smoker}</td>
                    <td className="capitalize">{r.region}</td>
                    <td className="font-mono font-medium">
                      ${parseInt(r.predicted_charge).toLocaleString()}
                    </td>
                    <td>{riskBadge(r.risk_tier)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
