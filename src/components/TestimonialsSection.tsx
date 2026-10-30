import { useState } from 'react'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import { Reveal } from './Reveal'
import { ArrowLeft, ArrowRight, SectionLabel } from './Primitives'

export function TestimonialsSection() {
  const { testimonials, guarantees, company } = ROOFING_CONFIG
  const [activeIndex, setActiveIndex] = useState(0)
  const review = testimonials[activeIndex]

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + testimonials.length) % testimonials.length)
  }

  return (
    <section id="reviews" className="reviews section">
      <div className="shell">
        <div className="reviews__top">
          <SectionLabel index="09">Proof</SectionLabel>
          <span className="mono-label">
            {company.rating.toFixed(2)} average / {company.reviewsCount} verified reviews
          </span>
        </div>

        <div className="reviews__head">
          <Reveal>
            <h2 className="display display--lg">
              The work speaks.
              <br />
              <em>So do the neighbors.</em>
            </h2>
          </Reveal>
          <Reveal className="reviews__head-copy" delay={80}>
            <p>
              These are the parts of the job homeowners remember: the crew arriving when
              they said, the cleanup, and the invoice matching the number on the contract.
            </p>
          </Reveal>
        </div>

        <Reveal className="quote" delay={80}>
          <div className="quote__meta">
            <span className="quote__number">
              {String(activeIndex + 1).padStart(2, '0')}
              <span>/ {String(testimonials.length).padStart(2, '0')}</span>
            </span>
            <span className="quote__stars" aria-label={`${review.rating} out of 5 stars`}>
              {'★★★★★'.slice(0, review.rating)}
            </span>
            <span className="mono-label">{review.date} / {review.location}</span>
          </div>

          <div className="quote__body" key={activeIndex} aria-live="polite">
            <span className="quote__mark" aria-hidden="true">“</span>
            <blockquote>{review.text}</blockquote>
            <div className="quote__attribution">
              <span className="quote__name">{review.name}</span>
              <span className="mono-label">{review.projectType}</span>
              {review.verified ? <span className="quote__verified">Verified project</span> : null}
            </div>
          </div>

          <div className="quote__controls">
            <div className="quote__dots">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  className={index === activeIndex ? 'is-active' : ''}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Read review from ${item.name}`}
                  aria-current={index === activeIndex}
                >
                  {String(index + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
            <div className="quote__arrows">
              <button onClick={() => move(-1)} aria-label="Previous review">
                <ArrowLeft />
              </button>
              <button onClick={() => move(1)} aria-label="Next review">
                <ArrowRight />
              </button>
            </div>
          </div>
        </Reveal>

        <div className="guarantees">
          <div className="guarantees__head">
            <span className="mono-label">The written guarantees</span>
            <span className="mono-label">Every project / every roof</span>
          </div>
          <div className="guarantees__grid">
            {guarantees.map((guarantee, index) => (
              <Reveal className="guarantee" key={guarantee.title} delay={index * 70}>
                <span className="mono-label">{String(index + 1).padStart(2, '0')}</span>
                <h3>{guarantee.title}</h3>
                <p>{guarantee.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
