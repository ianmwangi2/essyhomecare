import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import CHAPBadge from '../CHAPBadge'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Coverage', href: '/coverage' },
    { label: 'Referrals', href: '/referrals' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-primary text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-2">
              <Phone size={14} />
              Tyngsboro: (978) 735-2745
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CHAPBadge size="sm" />
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-heading font-bold text-xl">
            <img
              src="/essy-logo.svg"
              alt="Essy Homecare logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 rounded-lg hover:bg-teal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button & Mobile menu */}
          <div className="flex items-center gap-4">
            <a href="/referrals" className="btn-primary hidden md:inline-block">
              Make a Referral
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-teal rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-primary border-t border-teal py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 hover:bg-teal transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a href="/referrals" className="block px-4 py-3 bg-green text-white font-semibold rounded-lg m-2 text-center">
              Make a Referral
            </a>
          </div>
        )}
      </nav>
    </>
  )
}
