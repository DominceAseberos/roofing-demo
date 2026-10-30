import { useEffect, useState } from 'react'
import {
  BrandingElement,
  Checkout,
  CheckoutElement,
  ExpressCheckoutElement,
  PaymentElement,
  Payments,
  WhopElements,
} from '@whop/elements-react'
import { loadWhop } from '@whop/elements'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import type { PlanConfig } from '../config/roofingConfig'
import { trackDepositStarted, trackWhopEvent } from '../lib/tracking'
import { ErrorBoundary } from './ErrorBoundary'
import { Reveal } from './Reveal'
import { ArrowUpRight, SectionLabel } from './Primitives'

interface PaymentElementsSectionProps {
  selectedPlanId: string
  onPlanChange: (planId: string) => void
  onCheckoutCompleted?: (completionData: any) => void
}

const PLAN_LABELS: Record<string, { short: string; detail: string }> = {
  plan_nMILcy1Wzx33K: { short: 'Inspection', detail: '21-point condition report' },
  plan_n0z7fGWZKkC5B: { short: 'Project deposit', detail: 'Schedule lock + card on file' },
  plan_fU1oo9o697d1g: { short: 'Emergency tarp', detail: '24/7 rapid response' },
}

export function PaymentElementsSection({
  selectedPlanId,
  onPlanChange,
  onCheckoutCompleted,
}: PaymentElementsSectionProps) {
  const { plans, company } = ROOFING_CONFIG
  const [isClient, setIsClient] = useState(false)
  const [elementsLoader, setElementsLoader] = useState<any>(null)
  const [checkoutMode, setCheckoutMode] = useState<'payments' | 'checkout' | 'express'>('payments')
  const [checkoutCompleteData, setCheckoutCompleteData] = useState<any>(null)
  const [demoSandboxSimulated, setDemoSandboxSimulated] = useState(false)

  const planList: PlanConfig[] = [plans.inspection, plans.deposit, plans.emergencyTarp]
  const currentPlan = planList.find((plan) => plan.id === selectedPlanId) || plans.deposit

  useEffect(() => {
    setIsClient(true)
    try {
      if (typeof window !== 'undefined') {
        setElementsLoader(loadWhop())
      }
    } catch (error) {
      console.warn('[Whop Elements load deferred]', error)
    }
  }, [])

  const selectPlan = (plan: PlanConfig) => {
    onPlanChange(plan.id)
    setCheckoutCompleteData(null)
    setDemoSandboxSimulated(false)
    trackDepositStarted(plan.id, plan.title, plan.price)
  }

  const completeCheckout = (payload: any) => {
    setCheckoutCompleteData(payload)
    trackWhopEvent('checkout_completed', {
      plan_id: currentPlan.id,
      plan_title: currentPlan.title,
      price: currentPlan.price,
      payload,
    })
    onCheckoutCompleted?.(payload)
  }

  const simulateSandboxCheckout = () => {
    const isDeposit = currentPlan.id === plans.deposit.id
    const completion = {
      sessionId: `chs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      result: isDeposit ? 'setup' : 'payment',
      paymentId: isDeposit ? undefined : `pay_${Date.now().toString(36)}`,
      setupIntentId: isDeposit ? `sint_card_saved_${Date.now().toString(36)}` : undefined,
      planId: currentPlan.id,
      amount: currentPlan.price,
      customerEmail: 'homeowner@example.com',
      cardLast4: '4242',
      timestamp: new Date().toISOString(),
    }
    setDemoSandboxSimulated(true)
    completeCheckout(completion)
  }

  return (
    <section id="plans" className="plans section">
      <div className="shell">
        <div className="plans__top">
          <SectionLabel index="05">Whop checkout</SectionLabel>
          <span className="mono-label">PCI-DSS Level 1 / Whop merchant of record</span>
        </div>

        <div className="plans__head">
          <Reveal>
            <h2 className="display display--lg">
              Three doors in.
              <br />
              <em>One calm process.</em>
            </h2>
          </Reveal>
          <Reveal className="plans__head-copy" delay={100}>
            <p>
              Start with a documented inspection, lock a project date with a deposit, or
              dispatch an emergency crew. Every payment runs through Whop — no custom card
              forms, no side-door processors.
            </p>
            <span className="mono-label">Financing appears automatically where approved</span>
          </Reveal>
        </div>

        <div className="plan-selector" role="tablist" aria-label="Roofing plans">
          {planList.map((plan, index) => {
            const selected = plan.id === currentPlan.id
            const label = PLAN_LABELS[plan.id] ?? {
              short: plan.title,
              detail: plan.billingType,
            }

            return (
              <button
                key={plan.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="checkout-surface"
                className={`plan-option${selected ? ' is-selected' : ''}`}
                onClick={() => selectPlan(plan)}
              >
                <span className="plan-option__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="plan-option__name">
                  <strong>{label.short}</strong>
                  <small>{label.detail}</small>
                </span>
                <span className="plan-option__price">
                  {plan.priceDisplay}
                  <small>{plan.billingType}</small>
                </span>
                <span className="plan-option__arrow">
                  <ArrowUpRight />
                </span>
              </button>
            )
          })}
        </div>

        <div className="checkout-layout">
          <Reveal className="checkout-ledger">
            <div className="checkout-ledger__top">
              <span className="mono-label">Selected / 0{planList.indexOf(currentPlan) + 1}</span>
              <span className="mono-label">Plan {currentPlan.id}</span>
            </div>

            <h3>{currentPlan.title}</h3>
            <p className="checkout-ledger__description">{currentPlan.description}</p>

            <ul className="checkout-ledger__features">
              {currentPlan.features.map((feature, index) => (
                <li key={feature}>
                  <span className="mono-label">{String(index + 1).padStart(2, '0')}</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="checkout-ledger__total">
              <span>Due today</span>
              <strong>{currentPlan.priceDisplay}</strong>
            </div>

            {currentPlan.id === plans.deposit.id ? (
              <div className="checkout-ledger__note">
                <span className="mono-label">Card on file / setup intent</span>
                <p>
                  The deposit securely saves a payment method through Whop. After the work
                  is signed off, the remaining balance can be auto-charged or sent as a
                  payable invoice.
                </p>
              </div>
            ) : (
              <div className="checkout-ledger__note">
                <span className="mono-label">Checkout note</span>
                <p>{currentPlan.checkoutNote}</p>
              </div>
            )}
          </Reveal>

          <Reveal className="checkout-panel" delay={90}>
            <div className="checkout-panel__head">
              <div>
                <span className="mono-label">Secure checkout / {company.whopAccountId}</span>
                <h3>Pay with Whop</h3>
                <p className="checkout-panel__selected">
                  <span>{currentPlan.title}</span>
                  <strong>{currentPlan.priceDisplay}</strong>
                </p>
              </div>

              <div className="mode-switch" role="tablist" aria-label="Checkout mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={checkoutMode === 'payments'}
                  className={checkoutMode === 'payments' ? 'is-active' : ''}
                  onClick={() => setCheckoutMode('payments')}
                >
                  Payment element
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={checkoutMode === 'checkout'}
                  className={checkoutMode === 'checkout' ? 'is-active' : ''}
                  onClick={() => setCheckoutMode('checkout')}
                >
                  Hosted checkout
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={checkoutMode === 'express'}
                  className={checkoutMode === 'express' ? 'is-active' : ''}
                  onClick={() => setCheckoutMode('express')}
                >
                  Express wallets
                </button>
              </div>
            </div>

            <div
              id="checkout-surface"
              className="checkout-mount"
              role="tabpanel"
              data-lenis-prevent
            >
              {checkoutCompleteData ? (
                <div className="checkout-success">
                  <span className="checkout-success__mark" aria-hidden="true">✓</span>
                  <span className="mono-label">
                    {demoSandboxSimulated ? 'Sandbox simulation / complete' : 'Whop checkout / complete'}
                  </span>
                  <h4>Payment received.</h4>
                  <p>
                    {currentPlan.title} · {currentPlan.priceDisplay} USD. The next crew
                    availability is being confirmed.
                  </p>
                  <dl>
                    <div>
                      <dt>Result</dt>
                      <dd>{checkoutCompleteData.result || 'payment'}</dd>
                    </div>
                    {checkoutCompleteData.sessionId ? (
                      <div>
                        <dt>Session</dt>
                        <dd>{checkoutCompleteData.sessionId}</dd>
                      </div>
                    ) : null}
                    {checkoutCompleteData.paymentId ? (
                      <div>
                        <dt>Payment</dt>
                        <dd>{checkoutCompleteData.paymentId}</dd>
                      </div>
                    ) : null}
                    {checkoutCompleteData.setupIntentId ? (
                      <div>
                        <dt>Setup intent</dt>
                        <dd>{checkoutCompleteData.setupIntentId}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <button className="text-link" onClick={() => setCheckoutCompleteData(null)}>
                    <span>Return to checkout</span>
                    <ArrowUpRight />
                  </button>
                </div>
              ) : (
                <ErrorBoundary
                  fallback={
                    <div className="checkout-fallback">
                      <span className="mono-label">Whop surface / ready</span>
                      <p>
                        The live Whop element is loading for plan{' '}
                        <strong>{currentPlan.id}</strong>. If the CDN is unavailable in this
                        preview, use the sandbox control below to verify the flow.
                      </p>
                      <button className="text-link" onClick={simulateSandboxCheckout}>
                        <span>Simulate a completed checkout</span>
                        <ArrowUpRight />
                      </button>
                    </div>
                  }
                >
                  {isClient && elementsLoader ? (
                    <WhopElements
                      elements={elementsLoader}
                      locale="en"
                      onLoadError={(error) => {
                        console.warn('[Whop Elements load error]', error)
                      }}
                      appearance={{
                        theme: {
                          appearance: 'light',
                          accentColor: 'orange',
                          grayColor: 'slate',
                        },
                      }}
                    >
                      {checkoutMode === 'payments' ? (
                        <Payments
                          key={`payments-${currentPlan.id}`}
                          accountId={company.whopAccountId}
                          plan={currentPlan.id}
                          setupFutureUsage={
                            currentPlan.id === plans.deposit.id ? 'off_session' : undefined
                          }
                          fallback={<CheckoutLoading label="Preparing secure payment fields" />}
                        >
                          <PaymentElement
                            wallets={{ payPal: 'never' }}
                            defaultValues={{
                              billingDetails: {
                                address: { country: 'US' },
                              },
                            }}
                          />
                          <div className="branding-shell">
                            <BrandingElement />
                          </div>
                        </Payments>
                      ) : checkoutMode === 'checkout' ? (
                        <Checkout
                          key={`checkout-${currentPlan.id}`}
                          plan={currentPlan.id}
                          onComplete={(payload) => completeCheckout(payload)}
                          fallback={<CheckoutLoading label="Opening hosted Whop checkout" />}
                        >
                          <CheckoutElement
                            defaultValues={{
                              billingDetails: {
                                address: { country: 'US' },
                              },
                            }}
                          />
                        </Checkout>
                      ) : (
                        <>
                          <Checkout
                            key={`express-${currentPlan.id}`}
                            plan={currentPlan.id}
                            onComplete={(payload) => completeCheckout(payload)}
                            fallback={<CheckoutLoading label="Opening express wallet checkout" />}
                          >
                            <ExpressCheckoutElement wallets={{ payPal: 'never' }} />
                          </Checkout>
                          <p className="checkout-mode-note">
                            Apple Pay and Google Pay appear when the device, merchant account,
                            and verified payment domain all support them.
                          </p>
                        </>
                      )}
                    </WhopElements>
                  ) : (
                    <CheckoutLoading label="Connecting to Whop Elements" />
                  )}
                </ErrorBoundary>
              )}
            </div>

            <div className="checkout-panel__foot">
              <span className="mono-label">Apple Pay / Google Pay / Klarna / Splitit / Afterpay / Affirm</span>
              <span className="mono-label">Secured by Whop</span>
            </div>

            <details className="demo-controls">
              <summary className="mono-label">Demo controls</summary>
              <div>
                <p>
                  For screen recording only. This simulates a completed Whop checkout when
                  a live test payment is not available.
                </p>
                <button className="text-link" onClick={simulateSandboxCheckout}>
                  <span>Simulate checkout complete</span>
                  <ArrowUpRight />
                </button>
              </div>
            </details>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CheckoutLoading({ label }: { label: string }) {
  return (
    <div className="checkout-loading" aria-busy="true">
      <div className="checkout-loading__head">
        <span className="mono-label">Whop secure surface</span>
        <span className="mono-label">PCI-DSS / encrypted</span>
      </div>

      <div className="checkout-skeleton" aria-hidden="true">
        <span className="checkout-skeleton__bar" />
        <span className="checkout-skeleton__field" />
        <span className="checkout-skeleton__field" />
        <span className="checkout-skeleton__row">
          <span />
          <span />
        </span>
        <span className="checkout-skeleton__button" />
      </div>

      <span className="checkout-loading__label">
        <span className="checkout-loading__line" aria-hidden="true" />
        {label}
      </span>
    </div>
  )
}
