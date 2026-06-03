/**
 * ShapChart
 * Props:
 *   shapValues: [{feature: string, value: number}]  — sorted by abs(value) desc
 *   baseValue:  number   — model baseline (in actual $, post exp())
 *   prediction: number   — final estimate (in actual $)
 */
export default function ShapChart({ shapValues, baseValue, prediction }) {
  if (!shapValues?.length) return null

  const maxAbs = Math.max(...shapValues.map(s => Math.abs(s.value)))

  return (
    <div className="space-y-3">
      {shapValues.map((s, i) => {
        const pct = (Math.abs(s.value) / maxAbs) * 100
        const pos = s.value >= 0
        return (
          <div key={i} className="grid grid-cols-[160px_1fr_64px] items-center gap-3">
            <span className="font-mono text-xs text-ink-600 truncate" title={s.feature}>
              {s.feature}
            </span>
            <div className="h-5 bg-stone-100 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${pct}%`,
                  background: pos ? '#8B2635' : '#2D6A4F',
                  transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
            <span
              className="font-mono text-xs text-right tabular-nums"
              style={{ color: pos ? '#8B2635' : '#2D6A4F' }}
            >
              {pos ? '+' : ''}{s.value.toFixed(3)}
            </span>
          </div>
        )
      })}

      {/* Base → Prediction bridge */}
      <div className="border-t border-stone-200 pt-3 mt-4 flex justify-between items-center">
        <span className="font-mono text-xs text-ink-500">
          Base value: ${baseValue?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </span>
        <span className="font-display text-base font-semibold text-ink-900">
          Estimate: ${prediction?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  )
}
