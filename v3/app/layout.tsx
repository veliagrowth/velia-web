import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://veliacorp.com'),
  title: 'VELIA — El software con el que tu despacho funciona solo',
  description:
    'La plataforma sobre la que un despacho español opera el 100% de su software: CRM, IA legal con fuentes oficiales, plazos, facturación Verifactu y web, en una suscripción.',
  openGraph: {
    title: 'VELIA — El software con el que tu despacho funciona solo',
    description:
      'CRM, IA legal, plazos procesales, facturación Verifactu y web. Todo tu despacho en una plataforma, 199€/mes.',
    url: 'https://veliacorp.com',
    siteName: 'VELIA',
    locale: 'es_ES',
    type: 'website',
  },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
