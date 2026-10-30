import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type RevealVariant = 'up' | 'line' | 'image' | 'fade'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
}

/**
 * Small, dependency-free scroll reveal. Content is revealed once and then
 * left alone, so it never fights Lenis or costs frames after it has entered.
 */
export function Reveal({ children, className = '', delay = 0, variant = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.visible = 'true'
      return
    }

    if (!('IntersectionObserver' in window)) {
      el.dataset.visible = 'true'
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          el.dataset.visible = 'true'
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-reveal
      data-variant={variant}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
