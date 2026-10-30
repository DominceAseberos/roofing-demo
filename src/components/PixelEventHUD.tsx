import { useEffect, useState } from 'react'
import {
  useTrackingHistory,
  trackDepositStarted,
  trackServiceViewed,
  trackEstimateRequested,
} from '../lib/tracking'

export function PixelEventHUD() {
  const events = useTrackingHistory()
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => setVisible(window.scrollY > 180)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  const testEvent = (type: 'estimate' | 'service' | 'deposit') => {
    if (type === 'estimate') {
      trackEstimateRequested({
        customerName: 'Marcus Sterling',
        email: 'marcus@example.com',
        serviceType: 'Complete Roof Replacement',
        propertyZip: '78759',
        estimatedValue: 14500,
      })
      return
    }

    if (type === 'service') {
      trackServiceViewed('roof-replacement', 'Complete Roof Replacement', 'From $8,500')
      return
    }

    trackDepositStarted('plan_n0z7fGWZKkC5B', 'Project Deposit & Schedule Lock', 500)
  }

  return (
    <aside
      className={`pixel-hud${expanded ? ' is-open' : ''}${visible ? ' is-visible' : ''}`}
      aria-label="Whop pixel event monitor"
    >
      <button
        type="button"
        className="pixel-hud__bar"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls="pixel-event-panel"
      >
        <span className="pixel-hud__live">
          <span className="status-dot" aria-hidden="true" />
          Whop events
        </span>
        <span className="pixel-hud__count">
          {String(events.length).padStart(2, '0')}
          <span>{expanded ? '−' : '+'}</span>
        </span>
      </button>

      <div
        id="pixel-event-panel"
        className="pixel-hud__panel"
        aria-hidden={!expanded}
        data-lenis-prevent
      >
        <div className="pixel-hud__intro">
          <span className="mono-label">Custom pixel / live audit</span>
          <p>
            Estimates, service views, and checkout starts are sent through{' '}
            <code>whop.track</code>. This monitor is for demo verification.
          </p>
          <div className="pixel-hud__tests">
            <button type="button" onClick={() => testEvent('estimate')}>
              estimate_requested
            </button>
            <button type="button" onClick={() => testEvent('service')}>
              service_viewed
            </button>
            <button type="button" onClick={() => testEvent('deposit')}>
              deposit_started
            </button>
          </div>
        </div>

        <div className="pixel-hud__events">
          {events.length === 0 ? (
            <p className="pixel-hud__empty">
              No events yet. Open a service, submit the estimate form, or begin a
              checkout.
            </p>
          ) : (
            events.map((event) => {
              const selected = selectedEventId === event.id
              return (
                <button
                  type="button"
                  key={event.id}
                  className={`pixel-event${selected ? ' is-selected' : ''}`}
                  onClick={() => setSelectedEventId(selected ? null : event.id)}
                >
                  <span className="pixel-event__top">
                    <span className="pixel-event__name">whop.track("{event.name}")</span>
                    <span className="pixel-event__time">{event.timestamp}</span>
                  </span>
                  <span className="pixel-event__data">
                    {event.properties ? JSON.stringify(event.properties) : 'No properties'}
                  </span>
                  {selected && event.properties ? (
                    <pre>{JSON.stringify(event.properties, null, 2)}</pre>
                  ) : null}
                </button>
              )
            })
          )}
        </div>
      </div>
    </aside>
  )
}
