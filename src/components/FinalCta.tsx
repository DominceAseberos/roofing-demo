import { ROOFING_CONFIG } from '../config/roofingConfig'
import { Reveal } from './Reveal'
import { ArrowUpRight, Asterisk } from './Primitives'

interface FinalCtaProps {
  onOpenEstimate: () => void
}

export function FinalCta({ onOpenEstimate }: FinalCtaProps) {
  const { company } = ROOFING_CONFIG

  return (
    <section className="final-cta section">
      <div className="shell">
        <Reveal>
          <div className="final-cta__kicker">
            <Asterisk />
            <span className="mono-label">Ready when the weather is not</span>
            <Asterisk />
          </div>
          <h2 className="display final-cta__title">
            Let’s put a better roof
            <br />
            <em>over it all.</em>
          </h2>
        </Reveal>

        <Reveal className="final-cta__foot" delay={100}>
          <button className="btn btn--ink btn--large" onClick={onOpenEstimate}>
            Request an estimate
            <ArrowUpRight />
          </button>
          <div className="final-cta__contact">
            <span className="mono-label">Or call the direct line</span>
            <a href={`tel:${company.phone.replace(/\D/g, '')}`}>{company.phone}</a>
            <span>{company.address}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
