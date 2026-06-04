import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#888]">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2.5">
          <span className="font-display text-[#F5F4F0] font-semibold text-sm">HealthWealth</span>
        </div>

        <p className="font-body text-xs text-[#555] text-center">
          Built with Gradient Boosting · SHAP · React · FastAPI.
        </p>

        <div className="flex gap-6">
          {[
            { label: 'About', to: '/about' },
            { label: 'Predict', to: '/predict' },
            { label: 'Author', to: '/author' },
          ].map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="font-body text-xs text-[#555] hover:text-[#F5F4F0] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
