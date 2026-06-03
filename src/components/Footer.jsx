export default function Footer() {
  return (
    <footer className="bg-ink-900 text-stone-300">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-stone-50 flex items-center justify-center">
            <span className="text-ink-900 font-display text-xs font-bold">V</span>
          </div>
          <span className="font-display text-stone-50 font-semibold">
            Veda Life <span className="text-gold-400">AI</span>
          </span>
        </div>

        <p className="font-body text-xs text-stone-500 text-center">
          A portfolio ML project — not a real insurance product.
          Built with Gradient Boosting, SHAP, React, FastAPI.
        </p>

        <div className="flex gap-6">
          {['Predict', 'Model', 'Author'].map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="font-body text-xs text-stone-400 hover:text-stone-100 transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
