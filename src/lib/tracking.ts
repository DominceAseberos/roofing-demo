import { useState, useEffect } from 'react'

export interface FiredPixelEvent {
  id: string
  name: string
  timestamp: string
  properties?: Record<string, unknown>
}

// Global subscribers for real-time UI inspection
type Subscriber = (events: FiredPixelEvent[]) => void
const subscribers = new Set<Subscriber>()
let eventHistory: FiredPixelEvent[] = []

export function subscribeToEvents(callback: Subscriber): () => void {
  subscribers.add(callback)
  callback([...eventHistory])
  return () => {
    subscribers.delete(callback)
  }
}

function notifySubscribers() {
  const current = [...eventHistory]
  subscribers.forEach((sub) => sub(current))
}

/**
 * Fires a Whop pixel tracking event.
 * If running in a browser with the Whop pixel injected, calls window.whop.track.
 * Also logs to console and to our in-page Event HUD for easy verification & video recording.
 */
export function trackWhopEvent(name: string, properties?: Record<string, unknown>): FiredPixelEvent {
  const event: FiredPixelEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    timestamp: new Date().toLocaleTimeString(),
    properties,
  }

  eventHistory = [event, ...eventHistory].slice(0, 50)
  notifySubscribers()

  if (typeof window !== 'undefined') {
    const win = window as any
    // Whop Pixel standard tracking interface
    if (typeof win.whop?.track === 'function') {
      try {
        win.whop.track(name, properties)
      } catch (err) {
        console.warn('[whop.track call failed]', err)
      }
    } else if (Array.isArray(win.whop)) {
      win.whop.push(['track', name, properties])
    }
    console.info(`%c[whop.track] %c${name}`, 'color:#FA4616;font-weight:bold', 'color:#0F172A', properties)
  }

  return event
}

/**
 * Required Pixel Event 1: estimate_requested
 * Fires when a homeowner submits the "Request an Estimate" form.
 */
export function trackEstimateRequested(data: {
  customerName: string
  email: string
  serviceType: string
  propertyZip: string
  estimatedValue?: number
}) {
  return trackWhopEvent('estimate_requested', {
    ...data,
    currency: 'USD',
    action_source: 'website_form',
  })
}

/**
 * Required Pixel Event 2: service_viewed
 * Fires when a visitor views or opens the detailed specifications for any roofing service.
 */
export function trackServiceViewed(serviceId: string, serviceTitle: string, startingAt?: string) {
  return trackWhopEvent('service_viewed', {
    service_id: serviceId,
    service_title: serviceTitle,
    starting_price: startingAt,
    viewed_at: new Date().toISOString(),
  })
}

/**
 * Required Pixel Event 3: deposit_started
 * Fires when a customer clicks to begin checkout for a deposit, inspection, or flat-rate service.
 */
export function trackDepositStarted(planId: string, planTitle: string, amount: number) {
  return trackWhopEvent('deposit_started', {
    plan_id: planId,
    plan_title: planTitle,
    amount,
    currency: 'USD',
    checkout_mode: 'whop_elements',
  })
}

/**
 * React hook to observe fired events in real-time.
 */
export function useTrackingHistory() {
  const [events, setEvents] = useState<FiredPixelEvent[]>(eventHistory)

  useEffect(() => {
    return subscribeToEvents(setEvents)
  }, [])

  return events
}
