import { useEffect, useState } from 'react'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import { trackDepositStarted, trackEstimateRequested } from '../lib/tracking'
import { submitRoofingLead } from '../server/whopService'
import type { LeadSubmissionResult } from '../server/whopService'
import { ArrowRight, ArrowUpRight, SectionLabel } from './Primitives'
import { Reveal } from './Reveal'

interface EstimateFormSectionProps {
  preselectedService?: string
  onOpenCheckout: (planId: string) => void
}

const SERVICE_OPTIONS = [
  'Complete Roof Replacement',
  'Storm Damage / Leak Repair',
  '21-Point Roof Inspection ($149)',
  'Emergency Tarp Service ($750)',
  'Commercial TPO / Flat Roof',
  'Gutters & Ventilation',
]

const ROOF_AGES = [
  'Under 5 years',
  '5 - 10 years',
  '10 - 15 years',
  '15 - 20 years',
  '20+ years',
  'Unsure',
]

function serviceToOption(serviceTitle?: string) {
  if (!serviceTitle) return 'Complete Roof Replacement'
  if (serviceTitle.includes('Repair')) return 'Storm Damage / Leak Repair'
  if (serviceTitle.includes('Replacement')) return 'Complete Roof Replacement'
  if (serviceTitle.includes('Inspection')) return '21-Point Roof Inspection ($149)'
  if (serviceTitle.includes('Tarp')) return 'Emergency Tarp Service ($750)'
  if (serviceTitle.includes('Commercial')) return 'Commercial TPO / Flat Roof'
  if (serviceTitle.includes('Gutter')) return 'Gutters & Ventilation'
  return 'Complete Roof Replacement'
}

function estimateValue(serviceType: string) {
  if (serviceType.includes('Replacement')) return 14500
  if (serviceType.includes('Commercial')) return 22000
  if (serviceType.includes('Tarp')) return 750
  if (serviceType.includes('Inspection')) return 149
  if (serviceType.includes('Gutters')) return 1800
  return 1200
}

export function EstimateFormSection({ preselectedService, onOpenCheckout }: EstimateFormSectionProps) {
  const { company, plans } = ROOFING_CONFIG

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Austin',
    state: 'TX',
    zip: '78759',
    roofAge: '10 - 15 years',
    serviceType: 'Complete Roof Replacement',
    insuranceClaim: false,
    notes: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<LeadSubmissionResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!preselectedService) return
    setFormData((current) => ({
      ...current,
      serviceType: serviceToOption(preselectedService),
    }))
  }, [preselectedService])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target
    if (type === 'checkbox') {
      const checked = (event.target as HTMLInputElement).checked
      setFormData((current) => ({ ...current, [name]: checked }))
      return
    }
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    const value = estimateValue(formData.serviceType)

    try {
      trackEstimateRequested({
        customerName: formData.name,
        email: formData.email,
        serviceType: formData.serviceType,
        propertyZip: formData.zip,
        estimatedValue: value,
      })

      const result = await submitRoofingLead({
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          roofAge: formData.roofAge,
          serviceType: formData.serviceType,
          insuranceClaim: formData.insuranceClaim,
          notes: formData.notes,
          estimatedValue: value,
        },
      })

      setSubmissionResult(result)
    } catch (error: any) {
      setErrorMsg(error?.message || 'We could not send that request. Please call us instead.')
    } finally {
      setSubmitting(false)
    }
  }

  const startInspection = () => {
    trackDepositStarted(plans.inspection.id, plans.inspection.title, plans.inspection.price)
    onOpenCheckout(plans.inspection.id)
  }

  return (
    <section id="estimate" className="estimate section">
      <div className="shell">
        <div className="estimate__top">
          <SectionLabel index="06">Start here</SectionLabel>
          <span className="mono-label">Response within one business day</span>
        </div>

        <div className="estimate__grid">
          <div className="estimate__intro">
            <Reveal>
              <h2 className="display display--lg">
                Tell us what
                <br />
                <em>the sky did.</em>
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <p className="lead">
                Send the address, the symptom, and the story. A senior inspector will read
                it — not a call-center script.
              </p>
              <p>
                We will confirm what we can from the desk, then schedule a physical
                inspection if the roof needs eyes on it. No pressure, no door-knocking.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="estimate__contact">
                <span className="mono-label">Direct line</span>
                <a href={`tel:${company.phone.replace(/\D/g, '')}`}>{company.phone}</a>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <ol className="estimate__steps">
                <li>
                  <span className="mono-label">01</span>
                  <span>We read the request and check the address against recent storm data.</span>
                </li>
                <li>
                  <span className="mono-label">02</span>
                  <span>You receive a call to confirm access, timing, and the right inspection.</span>
                </li>
                <li>
                  <span className="mono-label">03</span>
                  <span>You get a photo-documented scope and a fixed price — not a range.</span>
                </li>
              </ol>
            </Reveal>
          </div>

          <Reveal className="estimate__form-wrap" delay={100}>
            {submissionResult ? (
              <div className="estimate-success">
                <span className="mono-label">
                  {submissionResult.live ? 'Whop lead / received' : 'Lead captured / preview'}
                </span>
                <h3 className="display display--md">Logged.</h3>
                <p>
                  Thank you, {formData.name || 'neighbor'}. Your request is on our desk.
                  We will contact you at {formData.phone || 'the number provided'} within
                  one business day.
                </p>

                <dl className="estimate-success__receipt">
                  <div>
                    <dt>Lead reference</dt>
                    <dd>{submissionResult.leadId}</dd>
                  </div>
                  <div>
                    <dt>Service</dt>
                    <dd>{formData.serviceType}</dd>
                  </div>
                  <div>
                    <dt>Property</dt>
                    <dd>
                      {formData.address}, {formData.city}, {formData.state} {formData.zip}
                    </dd>
                  </div>
                  <div>
                    <dt>Event</dt>
                    <dd>lead / estimate_requested</dd>
                  </div>
                  <div>
                    <dt>Delivery</dt>
                    <dd>{submissionResult.live ? 'Whop Events API' : 'Preview receipt'}</dd>
                  </div>
                </dl>

                <div className="estimate-success__actions">
                  <button className="btn btn--ink" onClick={startInspection}>
                    Fast-track with a $149 inspection
                    <ArrowUpRight />
                  </button>
                  <button className="text-link" onClick={() => setSubmissionResult(null)}>
                    <span>Send another request</span>
                    <ArrowRight />
                  </button>
                </div>
              </div>
            ) : (
              <form className="estimate-form" onSubmit={handleSubmit}>
                <div className="estimate-form__head">
                  <span className="mono-label">Project information</span>
                  <span className="mono-label">* Required</span>
                </div>

                {errorMsg ? <div className="form-error">{errorMsg}</div> : null}

                <div className="form-row">
                  <label className="field">
                    <span className="field__label">Full name *</span>
                    <input
                      className="field__input"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="John Miller"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">Email *</span>
                    <input
                      className="field__input"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label className="field">
                    <span className="field__label">Phone *</span>
                    <input
                      className="field__input"
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="(512) 555-0199"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">Property address *</span>
                    <input
                      className="field__input"
                      type="text"
                      name="address"
                      required
                      autoComplete="street-address"
                      placeholder="1234 Highland Ridge Dr"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="form-row form-row--three">
                  <label className="field">
                    <span className="field__label">City</span>
                    <input
                      className="field__input"
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">State</span>
                    <input
                      className="field__input"
                      type="text"
                      name="state"
                      autoComplete="address-level1"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">Zip *</span>
                    <input
                      className="field__input"
                      type="text"
                      name="zip"
                      required
                      autoComplete="postal-code"
                      inputMode="numeric"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label className="field">
                    <span className="field__label">Service needed</span>
                    <span className="select-wrap">
                      <select
                        className="field__input field__select"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                      >
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span className="select-wrap__arrow" aria-hidden="true">↓</span>
                    </span>
                  </label>

                  <label className="field">
                    <span className="field__label">Approximate roof age</span>
                    <span className="select-wrap">
                      <select
                        className="field__input field__select"
                        name="roofAge"
                        value={formData.roofAge}
                        onChange={handleChange}
                      >
                        {ROOF_AGES.map((age) => (
                          <option key={age} value={age}>
                            {age}
                          </option>
                        ))}
                      </select>
                      <span className="select-wrap__arrow" aria-hidden="true">↓</span>
                    </span>
                  </label>
                </div>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="insuranceClaim"
                    checked={formData.insuranceClaim}
                    onChange={handleChange}
                  />
                  <span className="checkbox__box" aria-hidden="true" />
                  <span>
                    There is an active insurance claim, or I need storm documentation for
                    an adjuster.
                  </span>
                </label>

                <label className="field">
                  <span className="field__label">What are you seeing?</span>
                  <textarea
                    className="field__input field__textarea"
                    name="notes"
                    rows={3}
                    placeholder="A stain on the ceiling after last week’s storm, missing shingles on the west slope..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </label>

                <button className="btn btn--ink estimate-form__submit" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="submit-spinner" aria-hidden="true" />
                      Sending to the Whop lead desk
                    </>
                  ) : (
                    <>
                      Send the estimate request
                      <ArrowUpRight />
                    </>
                  )}
                </button>

                <p className="estimate-form__legal">
                  Your details are written directly to our Whop account as a lead. No spam,
                  no list rental, no third-party calls. By submitting you agree to be
                  contacted about this property.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
