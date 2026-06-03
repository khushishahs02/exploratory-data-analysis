// ─── Change this to your deployed Render URL before going live ───
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Predict for a single patient.
 * @param {object} formData  Raw form values from the single-patient form
 * @returns {{ prediction: number, shap_values: {feature:string, value:number}[], plain_english: string[] }}
 */
export async function predictSingle(formData) {
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

/**
 * Predict for a CSV batch.
 * @param {File} file  CSV file from the file input
 * @returns {{ batch_results: object[] }}  Array of rows with appended Predicted Charge + Risk Category
 */
export async function predictBatch(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/predict_batch`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
