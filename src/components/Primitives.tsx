import type { ReactNode } from 'react'

export function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`arrow-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 18 18 6M8 6h10v10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`arrow-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function ArrowLeft({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`arrow-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function RoofMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`roof-mark ${className}`.trim()}
      viewBox="0 0 46 32"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 29 23 3l21 26" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11.5 29 23 14l11.5 15" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18 29v-5h10v5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function Asterisk({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`asterisk ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function SectionLabel({
  index,
  children,
  light = false,
}: {
  index: string
  children: ReactNode
  light?: boolean
}) {
  return (
    <div className={`section-label${light ? ' section-label--light' : ''}`}>
      <span className="section-label__index">{index}</span>
      <span className="section-label__rule" aria-hidden="true" />
      <span className="section-label__text">{children}</span>
    </div>
  )
}
