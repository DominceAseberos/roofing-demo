import { Asterisk } from './Primitives'

const ITEMS = [
  'Roof inspection',
  'Architectural shingle',
  'Standing seam metal',
  'Storm response',
  '0% APR financing',
  'Central Texas',
]

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((group) => (
          <div className="marquee__group" key={group}>
            {ITEMS.map((item) => (
              <span className="marquee__item" key={`${group}-${item}`}>
                {item}
                <Asterisk />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
