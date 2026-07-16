import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Aviso legal — VELIA',
  description: 'Aviso legal de veliacorp.com: titularidad, condiciones de uso y legislación aplicable.',
  alternates: { canonical: 'https://veliacorp.com/aviso-legal' },
}

/* TODO (Axel): completar CIF, domicilio social y datos de inscripción registral
   en cuanto la SL esté inscrita. Revisión legal en paralelo — v1.0. */

export default function AvisoLegalPage() {
  return (
    <>
      <h1>Aviso legal</h1>
      <p className="legal-meta">Versión 1.0 · Última actualización: 16 de julio de 2026</p>

      <h2>1. Titular del sitio web</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de que el titular de
        este sitio web (veliacorp.com y sus subdominios) es <strong>VELIA Marketing SL</strong>{' '}
        (en adelante, «VELIA»). Contacto: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene por objeto dar a conocer VELIA, la plataforma de software para
        despachos profesionales, sus características, precios y vías de contacto, así como
        permitir la solicitud de demostraciones y el alta en el periodo de prueba del servicio.
        El uso del servicio contratado se rige por los{' '}
        <Link href="/terminos">Términos del servicio</Link>.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso a este sitio web es gratuito y atribuye a quien lo realiza la condición de
        usuario. El usuario se compromete a hacer un uso adecuado de los contenidos y a no
        emplearlos para actividades ilícitas o contrarias a la buena fe, ni a introducir o
        difundir virus informáticos o realizar actuaciones susceptibles de alterar, estropear
        o impedir el funcionamiento del sitio.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        La marca VELIA, su logotipo, el diseño de este sitio, sus textos, imágenes y el
        software que lo sustenta son titularidad de VELIA o de sus licenciantes, y están
        protegidos por la normativa de propiedad intelectual e industrial. No se cede ningún
        derecho de explotación sobre ellos más allá de lo estrictamente necesario para el uso
        del sitio. Queda prohibida su reproducción, distribución o transformación sin
        autorización expresa.
      </p>

      <h2>5. Enlaces</h2>
      <p>
        Este sitio puede contener enlaces a sitios de terceros. VELIA no asume responsabilidad
        alguna sobre sus contenidos ni sobre sus políticas de privacidad. La existencia de un
        enlace no implica relación, recomendación o supervisión por parte de VELIA.
      </p>

      <h2>6. Responsabilidad</h2>
      <p>
        VELIA trabaja para que la información de este sitio esté actualizada y sea exacta,
        pero no garantiza la ausencia de errores ni la disponibilidad ininterrumpida del
        sitio. En la medida permitida por la ley, VELIA no responderá de los daños derivados
        del uso de la información publicada en este sitio web informativo.
      </p>

      <h2>7. Protección de datos</h2>
      <p>
        El tratamiento de los datos personales recogidos a través de este sitio se describe
        en la <Link href="/privacidad">Política de privacidad</Link>. El uso de cookies y
        tecnologías similares se describe en la{' '}
        <Link href="/cookies">Política de cookies</Link>.
      </p>

      <h2>8. Legislación aplicable</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia
        relativa a este sitio web serán competentes los juzgados y tribunales españoles que
        correspondan conforme a la normativa aplicable.
      </p>
    </>
  )
}
