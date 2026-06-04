import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { label: 'About',   to: '/about'   },
  { label: 'Predict', to: '/predict' },
  { label: 'Model',   to: '/model'   },
  { label: 'Explain', to: '/explain' },
  { label: 'Author',  to: '/author'  },
]

const activeClass = 'text-[#1A1A1A] font-medium border-b border-[#1A1A1A]'
const baseClass   = 'text-[#777] hover:text-[#1A1A1A] transition-colors'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#F5F4F0]/95 backdrop-blur-sm border-b border-[#E0DED6]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-[#F5F4F0] font-display text-xs font-bold">H</span>
          </div>
          <span className="font-display font-semibold text-[#1A1A1A] text-base tracking-tight">
            HealthWealth
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-body pb-0.5 tracking-wide ${isActive ? activeClass : baseClass}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#555]"
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
        <div className="md:hidden border-t border-[#E0DED6] bg-[#F5F4F0] px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-body tracking-wide ${isActive ? 'text-[#1A1A1A] font-medium' : 'text-[#666]'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
