import { useState } from 'react'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import { Reveal } from './Reveal'
import { ArrowUpRight, SectionLabel } from './Primitives'

export function ServiceAreaSection() {
  const { serviceAreas, company } = ROOFING_CONFIG
  const [zipInput, setZipInput] = useState('')
  const [zipResult, setZipResult] = useState<{
    checked: boolean
    covered: boolean
    message: string
  } | null>(null)

  const checkZip = (event: React.FormEvent) => {
    event.preventDefault()
    const cleanZip = zipInput.trim()
    if (!cleanZip) return

    const inCentralTexas =
      cleanZip.startsWith('786') ||
      cleanZip.startsWith('787') ||
      cleanZip.startsWith('765') ||
      cleanZip.startsWith('789')

    setZipResult({
      checked: true,
      covered: inCentralTexas,
      message: inCentralTexas
        ? `Zip ${cleanZip} is inside our primary two-hour storm response radius.`
        : `Zip ${cleanZip} sits outside the primary radius, but we regularly take custom replacement projects across Central Texas. Call to confirm.`,
    })
  }

  return (
    <section id="service-area" className="area section">
      <div className="shell">
        <div className="area__top">
          <SectionLabel index="08">Coverage</SectionLabel>
          <span className="mono-label">Based in Austin / working across Central Texas</span>
        </div>

        <div className="area__head">
          <Reveal>
            <h2 className="display display--lg">
              Austin is home.
              <br />
              <em>This is the radius.</em>
            </h2>
          </Reveal>
          <Reveal className="area__head-copy" delay={100}>
            <p>
              Trucks are staged across Travis, Williamson, and Hays counties. During an
              active storm, the closest crew is dispatched — not the next available
              appointment.
            </p>
            <div className="area__response">
              <strong>120</strong>
              <span className="mono-label">Minutes / emergency response target</span>
            </div>
          </Reveal>
        </div>

        <div className="area__grid">
          <Reveal className="area__map" delay={60}>
            <div className="radar" aria-hidden="true">
              <span className="radar__ring radar__ring--one" />
              <span className="radar__ring radar__ring--two" />
              <span className="radar__ring radar__ring--three" />
              <span className="radar__axis radar__axis--x" />
              <span className="radar__axis radar__axis--y" />
              <span className="radar__tick radar__tick--n">N</span>
              <span className="radar__tick radar__tick--e">E</span>
              <span className="radar__tick radar__tick--s">S</span>
              <span className="radar__tick radar__tick--w">W</span>
              <span className="radar__city radar__city--round-rock">Round Rock</span>
              <span className="radar__city radar__city--georgetown">Georgetown</span>
              <span className="radar__city radar__city--cedar-park">Cedar Park</span>
              <span className="radar__city radar__city--pflugerville">Pflugerville</span>
              <span className="radar__city radar__city--buda">Buda</span>
              <span className="radar__city radar__city--kyle">Kyle</span>
              <span className="radar__center">
                <span className="radar__dot" />
                ATX
              </span>
            </div>
            <div className="area__map-foot">
              <span className="mono-label">Response map / not to scale</span>
              <span className="mono-label">{serviceAreas.emergencyResponseTime}</span>
            </div>
          </Reveal>

          <div className="area__info">
            <Reveal className="area__cities" delay={100}>
              <div className="area__info-head">
                <span className="mono-label">Municipalities served</span>
                <span className="mono-label">{String(serviceAreas.cities.length).padStart(2, '0')}</span>
              </div>
              <ul>
                {serviceAreas.cities.map((city, index) => (
                  <li key={city}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {city}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="area__counties" delay={140}>
              <span className="mono-label">Counties</span>
              <p>{serviceAreas.counties.join(' · ')}</p>
            </Reveal>

            <Reveal className="zip-check" delay={180}>
              <span className="mono-label">Check the address</span>
              <h3>Is the roof in the radius?</h3>
              <form onSubmit={checkZip}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="Enter a 5-digit zip"
                  value={zipInput}
                  onChange={(event) => setZipInput(event.target.value)}
                  aria-label="Zip code"
                />
                <button type="submit" className="zip-check__button" aria-label="Check zip code">
                  <ArrowUpRight />
                </button>
              </form>

              {zipResult ? (
                <p className={`zip-check__result${zipResult.covered ? ' is-covered' : ''}`}>
                  <span className="mono-label">{zipResult.covered ? 'In radius' : 'Extended area'}</span>
                  {zipResult.message}
                </p>
              ) : (
                <p className="zip-check__hint">
                  Or call the direct line — a human answers, even at 2 a.m.
                </p>
              )}

              <a className="text-link" href={`tel:${company.phone.replace(/\D/g, '')}`}>
                <span>{company.phone}</span>
                <ArrowUpRight />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
