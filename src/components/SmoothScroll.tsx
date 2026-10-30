import { useEffect, useState, type ReactNode } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

interface SmoothScrollProps {
  children: ReactNode
}

const scrollEase = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

function LenisBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    window.__lenis = lenis
    return () => {
      if (window.__lenis === lenis) delete window.__lenis
    }
  }, [lenis])

  return null
}

/**
 * Root Lenis surface. Disabled entirely for visitors who ask for reduced motion.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  if (reducedMotion) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        duration: 1.15,
        easing: scrollEase,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.35,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  )
}
