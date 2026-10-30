import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'Apex Ridge Roofing & Restoration | Considered Roofing for Central Texas',
      },
      {
        name: 'description',
        content:
          'Editorial-grade roofing and storm restoration in Austin, Texas. $149 inspections, $500 project deposits, emergency tarp response, and Whop-powered financing and final invoicing.',
      },
      { name: 'theme-color', content: '#f4f1ea' },
      {
        property: 'og:title',
        content: 'Apex Ridge Roofing & Restoration | Considered Roofing for Central Texas',
      },
      {
        property: 'og:description',
        content:
          'A quiet, considered roofing studio for Central Texas. Inspections, replacements, storm response, and a fully digital deposit-to-invoice workflow on Whop.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Apex Ridge Roofing & Restoration' },
      { property: 'og:url', content: 'https://doms-roofing-demo.whop.site/' },
      {
        property: 'og:image',
        content: 'https://doms-roofing-demo.whop.site/images/hero-video-poster.webp',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:image',
        content: 'https://doms-roofing-demo.whop.site/images/hero-video-poster.webp',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: 'https://doms-roofing-demo.whop.site/' },
      { rel: 'preload', as: 'image', href: '/images/hero-video-poster.webp' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap',
      },
      { rel: 'preconnect', href: 'https://cdn.whop.com' },
      { rel: 'preconnect', href: 'https://api.whop.com' },
    ],
  }),
  errorComponent: ({ error, reset }: { error: any; reset: () => void }) => {
    return (
      <div className="app-error">
        <span className="mono-label">Apex Ridge / application notice</span>
        <h1>The page hit a snag.</h1>
        <p>{error?.message || 'An unexpected rendering error occurred.'}</p>
        <button className="btn btn--ink" onClick={() => reset()}>
          Reload the page
        </button>
      </div>
    )
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
