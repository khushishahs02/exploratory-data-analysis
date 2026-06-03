import React, { useState, useRef } from 'react';
import { predictBatch } from '../api.js';

const SAMPLE_CSV = `age,sex,bmi,children,smoker,region
34,male,27.5,2,no,northeast
52,female,31.2,0,yes,southwest
28,male,22.1,1,no,northwest
45,female,29.8,3,no,southeast`;

function riskBadge(tier) {
  if (tier === 'Low')  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-50 text-success-600 border border-success-200">Low</span>;
  if (tier === 'High') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-danger-50 text-danger-600 border border-danger-200">High</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent-50 text-accent-600 border border-accent-200">Medium</span>;
}

function downloadCSV(rows) {
  if (!rows?.length) return;
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const lines  = rows.map(r => keys.map(k => r[k]).join(','));
  const blob   = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  a.href       = url;
  a.download   = 'veda_predictions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function BatchUpload() {
  const [dragging, setDragging] = useState(false);
  const [file,     setFile]     = useState(null);
  const [results,  setResults]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const inputRef = useRef();

  const handleFile = async (f) => {
    if (!f || !f.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }
    setFile(f);
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      const data = await predictBatch(f);
      setResults(data.batch_results);
    } catch (e) {
      setError('Batch prediction failed. Check if the backend is running.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'sample_patients.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl transition-all p-12 flex flex-col items-center gap-4 text-center
          ${dragging ? 'border-accent-500 bg-accent-50/50' : 'border-surface-300 bg-white hover:border-accent-400 hover:bg-surface-100'}`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? 'bg-accent-100 text-accent-600' : 'bg-surface-150 text-txt-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-txt-100 font-semibold mb-1">
            {file ? file.name : 'Drop your CSV here or click to browse'}
          </p>
          <p className="text-xs text-txt-400">
            Expected columns: age, sex, bmi, children, smoker, region
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

      <div className="flex items-center justify-between">
        <button onClick={downloadSample} className="text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors flex items-center gap-1.5 bg-accent-50 px-3 py-1.5 rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Sample CSV
        </button>
        {file && !loading && (
          <p className="text-xs font-mono text-txt-400 bg-surface-150 px-2.5 py-1 rounded-md">{file.name} selected</p>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 text-sm font-semibold text-txt-200 py-8 bg-white border border-surface-200 rounded-xl">
          <div className="w-5 h-5 border-2 border-accent-600 border-t-transparent rounded-full animate-spin" />
          Processing batch predictions...
        </div>
      )}

      {error && (
        <div className="p-4 bg-danger-50 border border-danger-400/30 rounded-lg text-sm text-danger-600">
          {error}
        </div>
      )}

      {results?.length > 0 && (
        <div className="animate-fadeIn space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-txt-100">{results.length} patients processed</p>
            <button onClick={() => downloadCSV(results)} className="text-xs font-semibold text-white bg-txt-100 hover:bg-txt-50 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export Results
            </button>
          </div>

          <div className="overflow-x-auto bg-white border border-surface-200 rounded-xl shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-100 text-txt-400 uppercase text-xs font-semibold tracking-wider border-b border-surface-200">
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">Age</th>
                  <th className="p-3.5">Sex</th>
                  <th className="p-3.5">BMI</th>
                  <th className="p-3.5">Smoker</th>
                  <th className="p-3.5">Region</th>
                  <th className="p-3.5 font-mono text-right">Predicted Charge</th>
                  <th className="p-3.5">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-50 transition-colors">
                    <td className="p-3.5 font-mono text-txt-300 text-xs">{i + 1}</td>
                    <td className="p-3.5 text-txt-200">{r.age}</td>
                    <td className="p-3.5 text-txt-200 capitalize">{r.sex}</td>
                    <td className="p-3.5 text-txt-200 font-mono">{parseFloat(r.bmi).toFixed(1)}</td>
                    <td className="p-3.5 text-txt-200 capitalize">{r.smoker}</td>
                    <td className="p-3.5 text-txt-200 capitalize">{r.region}</td>
                    <td className="p-3.5 font-mono font-bold text-accent-600 text-right">
                      ${parseFloat(r['Predicted Charge']).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5">{riskBadge(r['Risk Category'])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
