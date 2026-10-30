import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import type { PlanConfig, ServiceItem } from '../config/roofingConfig'
import { trackDepositStarted, trackServiceViewed } from '../lib/tracking'
import { lockPageScroll, unlockPageScroll } from '../lib/scroll'
import { Reveal } from './Reveal'
import { ArrowUpRight, SectionLabel } from './Primitives'

interface ServicesSectionProps {
  onSelectPlan: (planId: string) => void
  onOpenEstimate: (serviceTitle?: string) => void
}

const SERVICE_IMAGES: Record<string, string> = {
  'roof-repair': '/images/editorial/roof-detail.webp',
  'roof-replacement': '/images/roofing-hero.webp',
  'roof-inspection': '/images/editorial/house-exterior.webp',
  'emergency-tarp': '/images/editorial/storm-house.webp',
  'commercial-roofing': '/images/editorial/roof-work.webp',
  'gutters-ventilation': '/images/editorial/shingle-detail.webp',
}

export function ServicesSection({ onSelectPlan, onOpenEstimate }: ServicesSectionProps) {
  const { services, plans } = ROOFING_CONFIG
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const listHoveredRef = useRef(false)

  const planList: PlanConfig[] = [plans.inspection, plans.deposit, plans.emergencyTarp]
  const activePreview = services.find((service) => service.id === previewId)
  const selectedIndex = selectedService
    ? services.findIndex((service) => service.id === selectedService.id)
    : -1

  useEffect(() => {
    // Warm the preview images so the first hover does not show an empty frame.
    for (const src of Object.values(SERVICE_IMAGES)) {
      const image = new Image()
      image.decoding = 'async'
      image.src = src
    }
  }, [])

  useEffect(() => {
    const clearPreview = () => {
      if (listHoveredRef.current) return
      setPreviewId(null)
    }
    window.addEventListener('scroll', clearPreview, { passive: true })
    return () => window.removeEventListener('scroll', clearPreview)
  }, [])

  useEffect(() => {
    if (!selectedService) return

    previousFocusRef.current = document.activeElement as HTMLElement | null
    lockPageScroll()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedService(null)
    }
    window.addEventListener('keydown', onKeyDown)
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 60)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focusTimer)
      unlockPageScroll()
      previousFocusRef.current?.focus?.()
    }
  }, [selectedService])

  const openService = (service: ServiceItem) => {
    trackServiceViewed(service.id, service.title, service.startingAt)
    setPreviewId(null)
    setSelectedService(service)
  }

  const proceedWithService = (service: ServiceItem) => {
    const linkedPlan = planList.find((plan) => plan.id === service.linkedPlanId)
    setSelectedService(null)

    window.setTimeout(() => {
      if (linkedPlan) {
        trackDepositStarted(linkedPlan.id, linkedPlan.title, linkedPlan.price)
        onSelectPlan(linkedPlan.id)
      } else {
        onOpenEstimate(service.title)
      }
    }, 80)
  }

  const positionPreview = (clientX: number, clientY: number) => {
    const node = previewRef.current
    if (!node) return

    const width = 320
    const height = 240
    const gap = 28
    const margin = 16

    let x = clientX + gap
    let y = clientY - height / 2

    if (x + width > window.innerWidth - margin) x = clientX - width - gap
    if (x < margin) x = margin
    if (y < margin) y = margin
    if (y + height > window.innerHeight - margin) {
      y = window.innerHeight - height - margin
    }

    node.style.setProperty('--mx', `${x}px`)
    node.style.setProperty('--my', `${y}px`)
  }

  const trackPreview = (event: MouseEvent<HTMLDivElement>) => {
    positionPreview(event.clientX, event.clientY)
  }

  const bookInspection = () => {
    trackDepositStarted(plans.inspection.id, plans.inspection.title, plans.inspection.price)
    onSelectPlan(plans.inspection.id)
  }

  return (
    <section id="services" className="services section">
      <div className="shell">
        <div className="services__head">
          <SectionLabel index="02">Capabilities</SectionLabel>
          <div className="services__head-grid">
            <Reveal>
              <h2 className="display display--lg">
                Six ways we keep
                <br />
                <em>the weather out.</em>
              </h2>
            </Reveal>
            <Reveal className="services__head-copy" delay={100}>
              <p>
                From a single pipe boot to a complete standing-seam roof, every scope is
                handled by the same in-house crew and documented to the same standard.
              </p>
              <span className="mono-label">
                <span className="hover-hint">Hover</span>
                <span className="tap-hint">Tap</span> to inspect / select to read the detail
              </span>
            </Reveal>
          </div>
        </div>

        <div
          className="service-list"
          onMouseEnter={() => {
            listHoveredRef.current = true
          }}
          onMouseMove={trackPreview}
          onMouseLeave={() => {
            listHoveredRef.current = false
            setPreviewId(null)
          }}
        >
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 45} variant="line">
              <button
                type="button"
                className="service-row"
                onMouseEnter={(event) => {
                  positionPreview(event.clientX, event.clientY)
                  setPreviewId(service.id)
                }}
                onMouseMove={(event) => positionPreview(event.clientX, event.clientY)}
                onClick={() => openService(service)}
                aria-label={`Open details for ${service.title}`}
              >
                <span className="service-row__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="service-row__thumb" aria-hidden="true">
                  <img src={SERVICE_IMAGES[service.id]} alt="" loading="lazy" />
                </span>
                <span className="service-row__body">
                  <span className="service-row__title">{service.title}</span>
                  <span className="service-row__subtitle">{service.subtitle}</span>
                </span>
                <span className="service-row__meta">{service.highlights[0]}</span>
                <span className="service-row__price">{service.startingAt ?? 'Custom bid'}</span>
                <span className="service-row__arrow">
                  <ArrowUpRight />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="services__foot" delay={60}>
          <p>
            <span className="mono-label">Not sure where to start?</span>
            <strong>Begin with a 21-point inspection.</strong> The $149 fee is credited
            against any repair or replacement.
          </p>
          <button className="btn btn--ink" onClick={bookInspection}>
            Book the inspection
            <ArrowUpRight />
          </button>
        </Reveal>
      </div>

      <div
        ref={previewRef}
        className="service-preview"
        data-visible={Boolean(activePreview)}
        aria-hidden="true"
      >
        {activePreview ? (
          <>
            <img src={SERVICE_IMAGES[activePreview.id]} alt="" />
            <span className="service-preview__caption">
              <span>{String(services.indexOf(activePreview) + 1).padStart(2, '0')}</span>
              <span>{activePreview.title}</span>
              <ArrowUpRight />
            </span>
          </>
        ) : null}
      </div>

      {selectedService ? (
        <div
          className="service-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-overlay-title"
          data-lenis-prevent
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedService(null)
          }}
        >
          <div className="service-overlay__top shell">
            <span className="mono-label">
              Capability {String(selectedIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
            </span>
            <span className="mono-label service-overlay__event">Event / service_viewed</span>
            <button
              ref={closeButtonRef}
              className="service-overlay__close"
              onClick={() => setSelectedService(null)}
              aria-label="Close service detail"
            >
              Close <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="service-overlay__body shell">
            <figure className="service-overlay__media">
              <img src={SERVICE_IMAGES[selectedService.id]} alt={selectedService.title} />
              <figcaption>
                <span className="mono-label">Fig. {String(selectedIndex + 1).padStart(2, '0')}</span>
                <span>{selectedService.subtitle}</span>
              </figcaption>
            </figure>

            <div className="service-overlay__content">
              <span className="mono-label">{selectedService.badge ?? 'Apex Ridge service'}</span>
              <h2 id="service-overlay-title" className="display display--md">
                {selectedService.title}
              </h2>
              <p className="lead">{selectedService.description}</p>

              <ul className="service-overlay__list">
                {selectedService.highlights.map((highlight, index) => (
                  <li key={highlight}>
                    <span className="mono-label">{String(index + 1).padStart(2, '0')}</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="service-overlay__foot">
                <div className="service-overlay__price">
                  <span className="mono-label">Starting at</span>
                  <strong>{selectedService.startingAt ?? 'Custom bid'}</strong>
                </div>
                <button className="btn btn--ink" onClick={() => proceedWithService(selectedService)}>
                  {selectedService.linkedPlanId ? 'Book this service' : 'Request an estimate'}
                  <ArrowUpRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
