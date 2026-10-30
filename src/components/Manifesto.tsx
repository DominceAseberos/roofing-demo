import { ROOFING_CONFIG } from '../config/roofingConfig'
import { Reveal } from './Reveal'
import { SectionLabel } from './Primitives'

const STANDARDS = [
  {
    index: '01',
    title: 'One accountable crew',
    body: 'The people who inspect your roof are the people who stand behind the repair. No rotating subcontractors, no handoffs.',
  },
  {
    index: '02',
    title: 'Evidence, not adjectives',
    body: 'Every layer is photographed and every measurement is documented, from decking moisture to ridge ventilation.',
  },
  {
    index: '03',
    title: 'A warranty with a signature',
    body: 'Manufacturer coverage plus a ten-year workmanship guarantee. Written plainly, honored locally.',
  },
]

export function Manifesto() {
  const { company } = ROOFING_CONFIG

  return (
    <section id="approach" className="manifesto section">
      <div className="shell">
        <SectionLabel index="01" light={false}>
          Point of view
        </SectionLabel>

        <div className="manifesto__head">
          <Reveal>
            <h2 className="display display--xl">
              We don’t sell roofs.
              <br />
              <em>We remove worry.</em>
            </h2>
          </Reveal>

          <Reveal className="manifesto__intro" delay={120}>
            <p className="lead">
              The best roofing work is the kind you never think about again. That is the
              standard we build to.
            </p>
            <p>
              Apex Ridge exists for homeowners who want the truth about their roof before
              a storm makes the decision for them. We inspect closely, explain clearly,
              and install to a specification — not to a sales quota.
            </p>
            <p>
              From a two-hour emergency tarp to a full architectural replacement, the
              process is calm, documented, and built around the life happening underneath.
            </p>
            <div className="signature">
              <span className="signature__mark">A/R</span>
              <span>
                <strong>Daniel Seberos</strong>
                <span>Founder, {company.legalName}</span>
              </span>
            </div>
          </Reveal>
        </div>

        <div className="manifesto__lower">
          <Reveal className="manifesto__figure" variant="image">
            <figure>
              <img
                src="/images/editorial/dormer.webp"
                alt="Close study of a timber dormer and weathered shingle detail"
                loading="lazy"
              />
              <figcaption>
                <span className="mono-label">Detail study / 04</span>
                <span>Flashing. Ventilation. Edge metal. The parts nobody photographs.</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="manifesto__quote" delay={100}>
            <p>
              “A roof is the only part of a house you ask to be boring.
              <em> Ours are exceptionally boring.</em>”
            </p>
            <span className="mono-label">The Apex Ridge standard</span>
          </Reveal>
        </div>

        <div className="standards">
          {STANDARDS.map((standard, index) => (
            <Reveal className="standard" key={standard.index} delay={index * 80}>
              <div className="standard__top">
                <span className="mono-label">{standard.index}</span>
                <span className="standard__rule" aria-hidden="true" />
              </div>
              <h3>{standard.title}</h3>
              <p>{standard.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
