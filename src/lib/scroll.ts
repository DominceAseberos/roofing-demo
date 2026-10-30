import type Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Scroll to an in-page section using Lenis when it is mounted.
 * Native scrolling is kept as the no-JS / reduced-motion fallback.
 */
export function scrollToSection(id: string, offset = -88) {
  if (typeof window === 'undefined') return
  const lenis = window.__lenis

  if (lenis) {
    lenis.scrollTo(`#${id}`, {
      offset,
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    return
  }

  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: 'smooth' })
}

/** Stop Lenis and lock the document while a full-screen surface is open. */
export function lockPageScroll() {
  if (typeof window === 'undefined') return
  window.__lenis?.stop()
  document.documentElement.classList.add('scroll-locked')
}

export function unlockPageScroll() {
  if (typeof window === 'undefined') return
  window.__lenis?.start()
  document.documentElement.classList.remove('scroll-locked')
}
