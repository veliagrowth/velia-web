import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Política de cookies — VELIA',
  description: 'Esta web no usa cookies de publicidad ni de seguimiento. Analítica sin cookies con datos agregados.',
  alternates: { canonical: 'https://veliacorp.com/cookies' },
}

export default function CookiesPage() {
  return (
    <>
      <h1>Política de cookies</h1>
      <p className="legal-meta">Versión 1.0 · Última actualización: 16 de julio de 2026</p>

      <h2>1. Lo esencial, primero</h2>
      <p>
        Este sitio web (veliacorp.com) <strong>no utiliza cookies de publicidad, de
        seguimiento ni de perfilado</strong>. Por eso no verás un banner de cookies: no hay
        nada que aceptar.
      </p>

      <h2>2. Analítica sin cookies</h2>
      <p>
        Para saber qué páginas se visitan usamos una analítica que no emplea cookies ni
        identificadores persistentes (Vercel Analytics). Trabaja con datos agregados y
        anónimos — número de visitas, página y tipo de dispositivo — y no permite identificar
        a ninguna persona ni seguirla entre sitios web.
      </p>

      <h2>3. La aplicación (app.veliacorp.com)</h2>
      <p>
        Si inicias sesión en la aplicación de VELIA, esta utiliza las cookies técnicas
        estrictamente necesarias para mantener tu sesión abierta de forma segura. Son
        imprescindibles para el funcionamiento del servicio y no se usan con fines
        publicitarios; por su naturaleza técnica están exentas de consentimiento.
      </p>

      <h2>4. Cambios y contacto</h2>
      <p>
        Si en el futuro incorporamos alguna tecnología que requiera consentimiento, esta
        política se actualizará y te lo pediremos de forma expresa antes de activarla. Para
        cualquier duda: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Más
        información sobre el tratamiento de datos en la{' '}
        <Link href="/privacidad">Política de privacidad</Link>.
      </p>
    </>
  )
}
