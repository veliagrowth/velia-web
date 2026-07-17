import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieNotice from '@/components/CookieNotice'
import { SITE_URL, CONTACT_EMAIL } from '@/lib/constants'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://veliacorp.com'),
  title: 'VELIA — Software para despachos de abogados con IA',
  description:
    'Software de gestión para despachos de abogados en España: expedientes, plazos LEC, escritos con IA citando el BOE y facturación Verifactu. Prueba gratis 15 días.',
  alternates: { canonical: 'https://veliacorp.com' },
  openGraph: {
    title: 'VELIA — Software para despachos de abogados con IA',
    description:
      'CRM jurídico, IA legal con fuentes oficiales, plazos procesales, facturación Verifactu y web del despacho. Todo en una plataforma desde 199€/mes.',
    url: 'https://veliacorp.com',
    siteName: 'VELIA',
    locale: 'es_ES',
    type: 'website',
  },
}

/* JSON-LD de marca: VELIA es la PLATAFORMA (posicionamiento sutil, decisión
   2026-07-16); el vertical legal es el contenido comercial de la web. */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VELIA',
  legalName: 'VELIA Marketing SL',
  url: SITE_URL,
  logo: `${SITE_URL}/velia_logotipo.svg`,
  email: CONTACT_EMAIL,
  description:
    'Plataforma de software con IA para despachos profesionales. Su primer vertical, VELIA Legal, es el software sobre el que los despachos de abogados españoles operan el 100% de su trabajo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  )
}
