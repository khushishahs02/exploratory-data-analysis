import { useState } from 'react'

const links = [
  { label: 'Predict',      href: '#predict'   },
  { label: 'How It Works', href: '#how'        },
  { label: 'Model',        href: '#model'      },
  { label: 'About',        href: '#about'      },
  { label: 'Author',       href: '#author'     },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-7 h-7 bg-ink-900 flex items-center justify-center">
            <span className="text-stone-50 font-display text-xs font-bold tracking-tight">V</span>
          </div>
          <span className="font-display font-semibold text-ink-900 text-lg tracking-tight">
            Veda Life <span className="text-gold-500">AI</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-body text-ink-600 hover:text-ink-900 transition-colors tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <a href="#predict" className="btn-primary text-xs py-2 px-5">
            Try Predictor →
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-ink-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-body text-ink-700 hover:text-ink-900 tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <a href="#predict" onClick={() => setOpen(false)} className="btn-primary text-xs py-2 self-start">
            Try Predictor →
          </a>
        </div>
      )}
    </header>
  )
}
