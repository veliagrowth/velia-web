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
