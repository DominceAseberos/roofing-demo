import { useState } from 'react'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import { createFinalRoofingInvoice } from '../server/whopService'
import type { CreateInvoiceResult } from '../server/whopService'
import { trackWhopEvent } from '../lib/tracking'
import { Reveal } from './Reveal'
import { ArrowLeft, ArrowUpRight, SectionLabel } from './Primitives'

interface WorkflowSimulatorProps {
  onOpenCheckout: (planId: string) => void
}

const BUILD_STEPS = [
  { title: 'Permit and HOA approval', date: 'Day 01', status: 'Cleared' },
  { title: 'Material delivery and dry-in', date: 'Day 02', status: 'Verified' },
  { title: 'Tear-off and decking repair', date: 'Day 03', status: 'Complete' },
  { title: 'Underlayment and ice shield', date: 'Day 03', status: 'Passed' },
  { title: 'Architectural shingle install', date: 'Day 04', status: 'Complete' },
  { title: 'Municipal inspection sign-off', date: 'Day 05', status: 'Approved' },
]

export function WorkflowSimulator({ onOpenCheckout }: WorkflowSimulatorProps) {
  const { plans, company } = ROOFING_CONFIG
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
  const [useStoredCard, setUseStoredCard] = useState(false)
  const [generatingInvoice, setGeneratingInvoice] = useState(false)
  const [invoiceResult, setInvoiceResult] = useState<CreateInvoiceResult | null>(null)

  const createInvoice = async () => {
    setGeneratingInvoice(true)
    try {
      const result = await createFinalRoofingInvoice({
        data: {
          customerName: 'Marcus Sterling',
          email: 'marcus.sterling@example.com',
          planId: plans.deposit.id,
          planTitle: 'Full Architectural Roof Replacement — Final Contract Balance',
          amount: 14500,
          depositCredited: 500,
          paymentMethodId: useStoredCard ? 'payt_whop_setup_card_4242' : undefined,
          jobAddress: '2408 Lakeway Blvd, Lakeway, TX',
          jobSummary:
            'Completed 34-square GAF Timberline HDZ tear-off and replacement. Passed municipal building inspection.',
          dueInDays: 7,
          billingAddress: {
            name: 'Marcus Sterling',
            line1: '2408 Lakeway Blvd',
            city: 'Lakeway',
            state: 'TX',
            postalCode: '78734',
            country: 'US',
          },
        },
      })

      setInvoiceResult(result)
      setActiveStep(3)

      trackWhopEvent('final_invoice_generated', {
        invoice_id: result.invoiceId,
        amount_due: result.amountDue,
        charge_strategy: result.chargeStrategy,
        customer_email: result.email,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setGeneratingInvoice(false)
    }
  }

  const reset = () => {
    setActiveStep(1)
    setInvoiceResult(null)
    setUseStoredCard(true)
  }

  return (
    <section id="workflow" className="workflow section section--ink">
      <div className="shell">
        <div className="workflow__top">
          <SectionLabel index="07" light>
            The Whop handoff
          </SectionLabel>
          <span className="mono-label workflow__top-right">Deposit / build / balance</span>
        </div>

        <div className="workflow__head">
          <Reveal>
            <h2 className="display display--lg">
              A $500 deposit.
              <br />
              A finished roof.
              <br />
              <em>A $14,000 balance.</em>
            </h2>
          </Reveal>
          <Reveal className="workflow__head-copy" delay={100}>
            <p>
              The high-ticket workflow that legacy roofing software never solved. Whop
              takes the deposit, saves the payment method, and makes the final balance a
              single, documented action.
            </p>
            <span className="mono-label">Click through the three acts below</span>
          </Reveal>
        </div>

        <div className="workflow-steps" role="tablist" aria-label="Whop project workflow">
          {[
            { step: 1, label: 'The deposit', detail: 'Setup intent' },
            { step: 2, label: 'The build', detail: 'Job milestones' },
            { step: 3, label: 'The balance', detail: 'Invoices API' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              role="tab"
              aria-selected={activeStep === item.step}
              className={`workflow-step${activeStep === item.step ? ' is-active' : ''}`}
              onClick={() => setActiveStep(item.step as 1 | 2 | 3)}
            >
              <span className="workflow-step__index">0{item.step}</span>
              <span className="workflow-step__name">
                {item.label}
                <small>{item.detail}</small>
              </span>
              <span className="workflow-step__dot" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="workflow-panel" role="tabpanel">
          {activeStep === 1 ? (
            <div className="workflow-act">
              <div className="workflow-act__copy">
                <span className="mono-label">Act I / The commitment</span>
                <h3 className="display display--md">Lock the date, not the whole invoice.</h3>
                <p>
                  The homeowner pays a $500 project deposit through Whop Payment Elements.
                  The same checkout creates a setup intent, storing a payment method for
                  the final balance without ever touching raw card data.
                </p>
                <div className="workflow-act__actions">
                  <button className="btn btn--ink" onClick={() => onOpenCheckout(plans.deposit.id)}>
                    Open the $500 deposit
                    <ArrowUpRight />
                  </button>
                  <button className="text-link" onClick={() => setActiveStep(2)}>
                    <span>Continue to the build</span>
                    <ArrowUpRight />
                  </button>
                </div>
              </div>

              <div className="workflow-ledger">
                <div className="workflow-ledger__head">
                  <span className="mono-label">Project ledger / 2408 Lakeway Blvd</span>
                  <span className="ledger-status">Deposit due</span>
                </div>
                <div className="workflow-ledger__row">
                  <span>Contract total</span>
                  <strong>$14,500.00</strong>
                </div>
                <div className="workflow-ledger__row">
                  <span>Deposit today</span>
                  <strong>$500.00</strong>
                </div>
                <div className="workflow-ledger__row workflow-ledger__row--accent">
                  <span>Balance on completion</span>
                  <strong>$14,000.00</strong>
                </div>
                <div className="workflow-ledger__note">
                  <span className="mono-label">Payment method</span>
                  <span>Visa ···· 4242, saved via Whop setup intent</span>
                </div>
                <div className="workflow-ledger__foot">
                  <span className="mono-label">No card data stored by Apex Ridge</span>
                  <span className="mono-label">PCI-DSS L1</span>
                </div>
              </div>
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className="workflow-act">
              <div className="workflow-act__copy">
                <span className="mono-label">Act II / The work</span>
                <h3 className="display display--md">Every layer, documented before it disappears.</h3>
                <p>
                  The build is logged as a sequence of completed milestones. Photos,
                  inspection sign-off, and material records are attached before the final
                  balance is ever requested.
                </p>
                <div className="workflow-act__actions">
                  <button className="text-link" onClick={() => setActiveStep(1)}>
                    <ArrowLeft />
                    <span>Back to the deposit</span>
                  </button>
                  <button className="btn btn--ink" onClick={() => setActiveStep(3)}>
                    Continue to billing
                    <ArrowUpRight />
                  </button>
                </div>
              </div>

              <div className="build-list">
                <div className="build-list__head">
                  <span className="mono-label">Job record / 34 squares</span>
                  <span className="ledger-status ledger-status--green">Ready to bill</span>
                </div>
                {BUILD_STEPS.map((item) => (
                  <div className="build-list__row" key={item.title}>
                    <span className="build-list__check" aria-hidden="true">✓</span>
                    <span className="build-list__title">{item.title}</span>
                    <span className="mono-label">{item.date}</span>
                    <span className="build-list__status">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className="workflow-act workflow-act--billing">
              <div className="workflow-act__copy">
                <span className="mono-label">Act III / The balance</span>
                <h3 className="display display--md">One balance. Two clean ways to collect it.</h3>
                <p>
                  The Whop Invoices API opens a final invoice for the remaining $14,000.
                  Charge the stored method automatically, or send a payable link where the
                  homeowner can choose financing.
                </p>

                <div className="charge-options">
                  <button
                    type="button"
                    className={`charge-option${useStoredCard ? ' is-selected' : ''}`}
                    onClick={() => setUseStoredCard(true)}
                    aria-pressed={useStoredCard}
                  >
                    <span className="mono-label">Option 01</span>
                    <strong>Auto-charge card on file</strong>
                    <span>Charge the saved Visa ···· 4242 when the job is signed off.</span>
                  </button>
                  <button
                    type="button"
                    className={`charge-option${!useStoredCard ? ' is-selected' : ''}`}
                    onClick={() => setUseStoredCard(false)}
                    aria-pressed={!useStoredCard}
                  >
                    <span className="mono-label">Option 02</span>
                    <strong>Send a payable invoice</strong>
                    <span>Email a Whop invoice link with financing options enabled.</span>
                  </button>
                </div>

                <button
                  className="btn btn--ink workflow-create"
                  onClick={createInvoice}
                  disabled={generatingInvoice}
                >
                  {generatingInvoice ? (
                    <>
                      <span className="submit-spinner" aria-hidden="true" />
                      Creating the Whop invoice
                    </>
                  ) : (
                    <>
                      {useStoredCard ? 'Create invoice & charge $14,000' : 'Create & send $14,000 invoice'}
                      <ArrowUpRight />
                    </>
                  )}
                </button>
              </div>

              <div className="invoice-ledger">
                <div className="invoice-ledger__head">
                  <span className="mono-label">Final invoice / preview</span>
                  <span className="mono-label">{company.whopAccountId}</span>
                </div>

                {invoiceResult ? (
                  <>
                    <span className="invoice-ledger__status">{invoiceResult.status}</span>
                    <h4>{invoiceResult.invoiceId}</h4>
                    <div className="invoice-ledger__amount">
                      <span className="mono-label">Amount due</span>
                      <strong>${invoiceResult.amountDue.toLocaleString()}.00</strong>
                    </div>
                    <dl className="invoice-ledger__meta">
                      <div>
                        <dt>Customer</dt>
                        <dd>{invoiceResult.customerName}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{invoiceResult.email}</dd>
                      </div>
                      <div>
                        <dt>Strategy</dt>
                        <dd>{useStoredCard ? 'Auto-charge stored card' : 'Payable invoice link'}</dd>
                      </div>
                      <div>
                        <dt>Property</dt>
                        <dd>2408 Lakeway Blvd, Lakeway, TX</dd>
                      </div>
                    </dl>
                    <p className="invoice-ledger__receipt">{invoiceResult.receiptNote}</p>
                    <button className="text-link" onClick={reset}>
                      <span>Reset the workflow</span>
                      <ArrowUpRight />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="invoice-ledger__status invoice-ledger__status--draft">Draft</span>
                    <h4>Final balance</h4>
                    <div className="invoice-ledger__amount">
                      <span className="mono-label">Amount due</span>
                      <strong>$14,000.00</strong>
                    </div>
                    <dl className="invoice-ledger__meta">
                      <div>
                        <dt>Contract</dt>
                        <dd>$14,500.00</dd>
                      </div>
                      <div>
                        <dt>Deposit credited</dt>
                        <dd>−$500.00</dd>
                      </div>
                      <div>
                        <dt>Due</dt>
                        <dd>7 days after sign-off</dd>
                      </div>
                      <div>
                        <dt>Strategy</dt>
                        <dd>{useStoredCard ? 'Auto-charge stored card' : 'Payable invoice link'}</dd>
                      </div>
                    </dl>
                    <div className="invoice-ledger__seal">
                      <span className="roof-seal">A/R</span>
                      <span className="mono-label">Whop Invoices / ready to create</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="workflow__foot">
          <span className="mono-label">Deposit → job → final invoice</span>
          <span className="mono-label">One platform / zero card forms</span>
        </div>
      </div>
    </section>
  )
}
