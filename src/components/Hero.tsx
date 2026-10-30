import { useEffect, useState } from 'react'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import { trackDepositStarted } from '../lib/tracking'
import { ArrowRight, ArrowUpRight, Asterisk } from './Primitives'

interface HeroProps {
  onOpenCheckout: (planId: string) => void
  onOpenEstimate: () => void
}

export function Hero({ onOpenCheckout, onOpenEstimate }: HeroProps) {
  const { company, plans } = ROOFING_CONFIG
  const [showFilm, setShowFilm] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compactQuery = window.matchMedia('(max-width: 767px)')

    const sync = () => {
      const connection = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string }
        }
      ).connection
      const slowConnection =
        connection?.saveData ||
        ['slow-2g', '2g', '3g'].includes(connection?.effectiveType || '')

      setShowFilm(!motionQuery.matches && !compactQuery.matches && !slowConnection)
    }

    sync()
    motionQuery.addEventListener('change', sync)
    compactQuery.addEventListener('change', sync)

    return () => {
      motionQuery.removeEventListener('change', sync)
      compactQuery.removeEventListener('change', sync)
    }
  }, [])

  const bookInspection = () => {
    trackDepositStarted(plans.inspection.id, plans.inspection.title, plans.inspection.price)
    onOpenCheckout(plans.inspection.id)
  }

  return (
    <section id="hero" className="hero">
      <div className="hero__film">
        <div className="hero__film-media" aria-hidden="true">
          {showFilm ? (
            <video
              className="hero__film-media-el"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/hero-video-poster.webp"
              disablePictureInPicture
              onCanPlay={(event) => {
                void event.currentTarget.play().catch(() => undefined)
              }}
              onError={() => setShowFilm(false)}
            >
              <source src="/videos/hero-loop.webm" type="video/webm" />
              <source src="/videos/hero-loop.mp4" type="video/mp4" />
            </video>
          ) : (
            <img
              className="hero__film-media-el"
              src="/images/hero-video-poster.webp"
              alt=""
              loading="eager"
              fetchPriority="high"
            />
          )}
        </div>
        <div className="hero__scrim" aria-hidden="true" />

        <div className="hero__film-content shell">
          <div className="hero__masthead">
            <span className="mono-label">Austin, Texas / Est. 2008</span>
            <span className="hero__issue">
              <Asterisk />
              The storm issue — Vol. 01
            </span>
            <span className="mono-label hero__masthead-right">Residential & commercial</span>
          </div>

          <div className="hero__center">
            <h1 className="hero__title">
              <span className="hero__line">
                <span>The roof over</span>
              </span>
              <span className="hero__line">
                <span>
                  <em>everything</em>
                </span>
              </span>
              <span className="hero__line">
                <span>
                  you love.<sup>®</sup>
                </span>
              </span>
            </h1>

            <p className="hero__lede">
              Considered roofing and storm restoration for Central Texas. Built by one
              accountable crew, documented at every layer, and backed by warranties we
              put in writing.
            </p>

            <div className="hero__actions">
              <button className="btn btn--paper" onClick={onOpenEstimate}>
                Request an estimate
                <ArrowUpRight />
              </button>
              <button className="text-link text-link--light" onClick={bookInspection}>
                <span>Book a $149 inspection</span>
                <ArrowRight />
              </button>
            </div>

            <div className="hero__credentials">
              <span>
                <strong>{company.rating.toFixed(2)}</strong> / {company.reviewsCount} reviews
              </span>
              <span>
                <strong>2 hr</strong> storm response
              </span>
              <span>
                <strong>GAF</strong> Master Elite
              </span>
            </div>
          </div>

          <div className="hero__film-caption">
            <span className="mono-label">Film study 01 / Lakeway, TX</span>
            <span className="hero__film-title">Lakeway, after the hail.</span>
            <span className="hero__film-meta">
              Silent loop · architectural shingle · 34 squares · 5 days
            </span>
            <button className="text-link text-link--light" onClick={onOpenEstimate}>
              <span>Plan a project like this</span>
              <ArrowUpRight />
            </button>
          </div>
        </div>
      </div>

      <div className="hero__stats shell">
        <div className="hero__stat">
          <strong>18</strong>
          <span>Years above the Texas weather</span>
        </div>
        <div className="hero__stat">
          <strong>384</strong>
          <span>Roofs documented and warrantied</span>
        </div>
        <div className="hero__stat">
          <strong>50<span>yr</span></strong>
          <span>Manufacturer material warranty</span>
        </div>
        <div className="hero__stat">
          <strong>$0</strong>
          <span>Down financing available<sup>†</sup></span>
        </div>
      </div>
    </section>
  )
}
