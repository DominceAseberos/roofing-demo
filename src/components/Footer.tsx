import { ROOFING_CONFIG } from '../config/roofingConfig'
import { scrollToSection } from '../lib/scroll'
import { ArrowUpRight, RoofMark } from './Primitives'

export function Footer() {
  const { company, services } = ROOFING_CONFIG
  const nameParts = company.name.split(' ')
  const primaryName = nameParts.slice(0, 2).join(' ')

  const goToTop = () => scrollToSection('hero', 0)

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__brand">
            <RoofMark />
            <span className="mono-label">{company.tagline}</span>
          </div>
          <button className="footer__top-link" onClick={goToTop}>
            <span>Back to top</span>
            <span className="footer__top-arrow" aria-hidden="true">↑</span>
          </button>
        </div>

        <div className="footer__wordmark" aria-label={company.name}>
          {primaryName}
          <span>®</span>
        </div>

        <div className="footer__columns">
          <div className="footer__column footer__column--contact">
            <span className="mono-label">Office</span>
            <p>{company.address}</p>
            <a href={`tel:${company.phone.replace(/\D/g, '')}`}>{company.phone}</a>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <span className="footer__license">{company.license}</span>
          </div>

          <div className="footer__column">
            <span className="mono-label">Roofing</span>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <button onClick={() => scrollToSection('services')}>{service.title}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <span className="mono-label">Whop platform</span>
            <ul>
              <li>
                <button onClick={() => scrollToSection('plans')}>Payment elements</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('financing')}>0% APR financing</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('workflow')}>Setup intent / card on file</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('workflow')}>Invoices API</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('estimate')}>Leads & events</button>
              </li>
            </ul>
          </div>

          <div className="footer__column">
            <span className="mono-label">Visit</span>
            <ul>
              <li>
                <button onClick={() => scrollToSection('approach')}>Our approach</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('service-area')}>Service area</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('reviews')}>Reviews</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('estimate')}>Request an estimate</button>
              </li>
            </ul>
            <a
              className="footer__emergency"
              href={`tel:${company.emergencyPhone.replace(/\D/g, '')}`}
            >
              <span className="status-dot" aria-hidden="true" />
              24/7 emergency line
              <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </span>
          <span className="footer__template-note">
            A reusable Whop Websites template. Rebrand in{' '}
            <code>src/config/roofingConfig.ts</code>.
          </span>
          <span>
            Built on <strong>Whop</strong> / Merchant of record
          </span>
        </div>
      </div>
    </footer>
  )
}
