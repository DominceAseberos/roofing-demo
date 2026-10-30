import { useEffect, useRef } from 'react'
import { Reveal } from './Reveal'
import { ArrowUpRight, SectionLabel } from './Primitives'

interface ProjectStoryProps {
  onOpenEstimate: () => void
}

export function ProjectStory({ onOpenEstimate }: ProjectStoryProps) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const frame = mediaRef.current
    const image = imageRef.current
    if (!frame || !image) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = frame.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport
      const clamped = Math.max(-1, Math.min(1, progress))
      image.style.transform = `translate3d(0, ${clamped * -30}px, 0) scale(1.08)`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="project section">
      <div className="shell">
        <div className="project__top">
          <SectionLabel index="03">Field note / Lakeway</SectionLabel>
          <span className="mono-label">Completed October 2026</span>
        </div>

        <div className="project__grid">
          <Reveal className="project__media" variant="image">
            <div ref={mediaRef} className="project__media-frame">
              <img
                ref={imageRef}
                src="/images/editorial/house-exterior.webp"
                alt="A modern Central Texas home at dusk with a newly finished dark roof"
                loading="lazy"
              />
            </div>
            <span className="project__stamp">34 SQ</span>
            <span className="project__caption mono-label">Hill Country residence / private commission</span>
          </Reveal>

          <div className="project__copy">
            <Reveal>
              <h2 className="display display--lg">
                After the hail,
                <br />
                <em>a quieter house.</em>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="lead">
                A full tear-off, new synthetic underlayment, ice-and-water shield, and a
                Class 4 architectural shingle system — completed while the family stayed
                home.
              </p>
              <p>
                The brief was simple: make it disappear. No visible seams, no debris in
                the lawn, no surprises on the final invoice. Five working days, one crew,
                and a photographic record of every layer.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <dl className="project__specs">
                <div>
                  <dt className="mono-label">Scope</dt>
                  <dd>Full replacement</dd>
                </div>
                <div>
                  <dt className="mono-label">System</dt>
                  <dd>Class 4 architectural</dd>
                </div>
                <div>
                  <dt className="mono-label">Duration</dt>
                  <dd>5 working days</dd>
                </div>
                <div>
                  <dt className="mono-label">Warranty</dt>
                  <dd>50 years / 10 years labor</dd>
                </div>
              </dl>

              <button className="text-link" onClick={onOpenEstimate}>
                <span>Plan a project like this</span>
                <ArrowUpRight />
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
