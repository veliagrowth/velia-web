import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieNotice from '@/components/CookieNotice'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import { SITE_URL, CONTACT_EMAIL } from '@/lib/constants'
import { PRICING, eur } from '@/lib/pricing'
import './globals.css'

/* La descripción ya no menciona Verifactu ni el cómputo de plazos según la LEC:
   los dos están en `verified-claims` como `pending` y no se publican hasta tener
   la verificación documental. Un metadato es tan público como un titular. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'VELIA | Software jurídico con IA para despachos',
  description: `Gestiona expedientes, clientes, documentos, plazos y facturación con VELIA, el software jurídico con IA desarrollado en España. Desde ${eur(PRICING.monthly)}/mes, ${PRICING.usersIncluded} usuarios incluidos. Prueba ${PRICING.trialDays} días gratis, sin tarjeta.`,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'VELIA | Software jurídico con IA para despachos',
    description: `Todo tu despacho. Con VELIA dentro. Expedientes, clientes, documentos, plazos y facturación en una sola plataforma, desde ${eur(PRICING.monthly)}/mes.`,
    url: SITE_URL,
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
    'Plataforma de software con IA para despachos profesionales, desarrollada en España. Su primer vertical, VELIA Legal, reúne la gestión del despacho y una asistente jurídica contextual en una sola plataforma.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Calienta la conexión al portal de la demo ANTES de que el iframe se
            monte (bug "la demo carga lenta"): ahorra DNS + TLS + handshake del
            túnel Cloudflare en el momento del scroll. */}
        {/* Geist sustituye a Montserrat con el sistema 2.0 (30-jul). Va como <link> y
            no por next/font porque Next 14.2.30 no la tiene en su catálogo tipado.
            PENDIENTE: autoalojar el .woff2 (Geist es SIL OFL) — anotado en brand/README.md. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap"
        />
        <link rel="preconnect" href="https://demo.app.veliacorp.com" />
        <link rel="dns-prefetch" href="https://demo.app.veliacorp.com" />
        <link rel="preconnect" href="https://app.veliacorp.com" />
      </head>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieNotice />
        <ScrollDepthTracker />
      </body>
    </html>
  )
}
