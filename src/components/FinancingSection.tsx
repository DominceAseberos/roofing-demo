import { useState } from 'react'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import { Reveal } from './Reveal'
import { ArrowUpRight, SectionLabel } from './Primitives'

interface FinancingSectionProps {
  onOpenEstimate: () => void
  onOpenCheckout: (planId: string) => void
}

const TERMS = [12, 24, 36, 60, 84]

export function FinancingSection({ onOpenEstimate, onOpenCheckout }: FinancingSectionProps) {
  const [projectTotal, setProjectTotal] = useState(14500)
  const [termMonths, setTermMonths] = useState(60)
  const { financing, plans } = ROOFING_CONFIG

  const estimatedMonthly = Math.round(projectTotal / termMonths)

  return (
    <section id="financing" className="financing section section--sand">
      <div className="shell">
        <div className="financing__top">
          <SectionLabel index="04">Financing</SectionLabel>
          <span className="mono-label">Subject to approval / terms vary</span>
        </div>

        <div className="financing__grid">
          <div className="financing__copy">
            <Reveal>
              <h2 className="display display--lg">
                A big roof.
                <br />
                <em>A smaller number.</em>
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <p className="lead">{financing.subheadline}</p>
              <p>
                Whop Payments surfaces the financing rails your homeowners already trust
                — Klarna, Splitit, Afterpay, Affirm, Apple Pay and Google Pay — directly
                inside the same checkout as the deposit.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="financing__rails">
                <span className="mono-label">Available rails</span>
                <ul>
                  {financing.supportedRails.map((rail, index) => (
                    <li key={rail}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {rail}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <ul className="financing__perks">
                {financing.perks.slice(0, 3).map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>

              <div className="financing__actions">
                <button className="btn btn--ink" onClick={onOpenEstimate}>
                  Prequalify with an estimate
                  <ArrowUpRight />
                </button>
                <button className="text-link" onClick={() => onOpenCheckout(plans.deposit.id)}>
                  <span>Lock the $500 deposit</span>
                  <ArrowUpRight />
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal className="calculator" delay={100}>
            <div className="calculator__head">
              <span className="mono-label">Monthly estimator / illustrative</span>
              <span className="calculator__apr">{financing.aprRate}</span>
            </div>

            <div className="calculator__amount">
              <span className="mono-label">Project total</span>
              <strong>${projectTotal.toLocaleString()}</strong>
            </div>

            <div className="calculator__range">
              <input
                type="range"
                min={4000}
                max={30000}
                step={500}
                value={projectTotal}
                onChange={(event) => setProjectTotal(Number(event.target.value))}
                aria-label="Estimated project total"
              />
              <div className="calculator__range-labels">
                <span>$4,000 / repair</span>
                <span>$15,000 / shingle</span>
                <span>$30,000 / metal</span>
              </div>
            </div>

            <div className="calculator__terms">
              <span className="mono-label">Term</span>
              <div className="calculator__term-grid">
                {TERMS.map((months) => (
                  <button
                    key={months}
                    type="button"
                    className={termMonths === months ? 'is-active' : ''}
                    onClick={() => setTermMonths(months)}
                    aria-pressed={termMonths === months}
                  >
                    {months}
                    <span>mo</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="calculator__result">
              <span className="mono-label">Estimated monthly</span>
              <strong>
                ${estimatedMonthly.toLocaleString()}
                <sup>/mo</sup>
              </strong>
              <p>
                Illustrative at {termMonths} months with promotional 0% APR for qualified
                applicants. Final terms are presented inside Whop checkout.
              </p>
            </div>

            <div className="calculator__foot">
              <span className="mono-label">Powered by Whop Payments</span>
              <span className="mono-label">No prepayment penalty</span>
            </div>
          </Reveal>
        </div>

        <p className="financing__fineprint">
          † 0% APR financing is available to qualified applicants and is subject to
          merchant and lender terms. A soft credit inquiry may be used for prequalification.
          Apex Ridge does not control lender approval or final terms.
        </p>
      </div>
    </section>
  )
}
