import { useEffect, useState } from 'react'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import { scrollToSection, lockPageScroll, unlockPageScroll } from '../lib/scroll'
import { ArrowUpRight, RoofMark } from './Primitives'

interface HeaderProps {
  onOpenEstimate: () => void
}

const NAV_ITEMS = [
  { id: 'services', label: 'Roofing' },
  { id: 'financing', label: 'Financing' },
  { id: 'plans', label: 'Plans' },
  { id: 'workflow', label: 'Process' },
  { id: 'service-area', label: 'Coverage' },
  { id: 'reviews', label: 'Reviews' },
]

export function Header({ onOpenEstimate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { company } = ROOFING_CONFIG

  const nameParts = company.name.split(' ')
  const primaryName = nameParts.slice(0, 2).join(' ')
  const secondaryName = nameParts.slice(2).join(' ')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    lockPageScroll()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      unlockPageScroll()
    }
  }, [menuOpen])

  const goTo = (id: string) => {
    setMenuOpen(false)
    unlockPageScroll()
    window.setTimeout(() => scrollToSection(id), 40)
  }

  const openEstimate = () => {
    setMenuOpen(false)
    unlockPageScroll()
    window.setTimeout(onOpenEstimate, 40)
  }

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="topline">
        <div className="shell topline__inner">
          <span className="topline__place">
            Austin, Texas <span className="topline__muted">30.2672° N / 97.7431° W</span>
          </span>
          <span className="topline__statement">Roofing, restoration & storm response</span>
          <a className="topline__phone" href={`tel:${company.emergencyPhone.replace(/\D/g, '')}`}>
            <span className="status-dot" aria-hidden="true" />
            24/7 storm line <span>{company.emergencyPhone}</span>
          </a>
        </div>
      </div>

      <div className="navbar">
        <div className="shell navbar__inner">
          <button className="brand" onClick={() => goTo('hero')} aria-label={`${company.name} — back to top`}>
            <RoofMark className="brand__mark" />
            <span className="brand__type">
              <span className="brand__name">{primaryName}</span>
              <span className="brand__sub">{secondaryName}</span>
            </span>
          </button>

          <nav className="desktop-nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} className="desktop-nav__link" onClick={() => goTo(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            <a className="nav-phone" href={`tel:${company.phone.replace(/\D/g, '')}`}>
              {company.phone}
            </a>
            <button className="btn btn--ink btn--small" onClick={openEstimate}>
              Request an estimate
              <ArrowUpRight />
            </button>
          </div>

          <button
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      </header>

      <div
        id="mobile-navigation"
        className={`mobile-menu${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        data-lenis-prevent
      >
        <div className="mobile-menu__top shell">
          <span className="mono-label">Menu / {new Date().getFullYear()}</span>
          <button className="mobile-menu__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            Close <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="mobile-menu__nav shell" aria-label="Mobile">
          {NAV_ITEMS.map((item, index) => (
            <button key={item.id} className="mobile-menu__link" onClick={() => goTo(item.id)}>
              <span className="mono-label">{String(index + 1).padStart(2, '0')}</span>
              <span>{item.label}</span>
              <ArrowUpRight />
            </button>
          ))}
        </nav>

        <div className="mobile-menu__foot shell">
          <div>
            <span className="mono-label">Start here</span>
            <button className="btn btn--ink" onClick={openEstimate}>
              Request an estimate
              <ArrowUpRight />
            </button>
          </div>
          <div className="mobile-menu__contact">
            <a href={`tel:${company.emergencyPhone.replace(/\D/g, '')}`}>{company.emergencyPhone}</a>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </div>
        </div>
      </div>
    </>
  )
}
