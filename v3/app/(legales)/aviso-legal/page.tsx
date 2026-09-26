import type { Metadata } from 'next'
import Link from 'next/link'
import { EMAIL_TITULAR_LEGAL } from '@/lib/constants'
import { metadatosDePagina } from '@/lib/metadatos'

/* Por `metadatosDePagina`: hasta el 18-sep esta pagina heredaba el openGraph
   entero del layout, asi que compartir su enlace ensenaba el titulo de la
   portada y su `og:url` apuntaba a la raiz del sitio. Esto es metadata, no
   el texto del documento: el contenido legal no se toca desde aqui. */
export const metadata: Metadata = metadatosDePagina({
  titulo: 'Aviso legal — VELIA',
  descripcion:
    'Aviso legal de veliacorp.com: titularidad, condiciones de uso y legislación aplicable.',
  ruta: '/aviso-legal',
})

/* ── v1.1, 26-sep-2026 ───────────────────────────────────────────────────────
   El §2 decía que este sitio da a conocer «la plataforma de software para
   despachos profesionales, sus características, PRECIOS y vías de contacto» y
   «el alta en el periodo de prueba del servicio». Describía un producto
   descontinuado y dos flujos que ya no existen. Reescrito al objeto real.
   El resto del documento —titularidad, uso, propiedad intelectual, enlaces,
   responsabilidad, protección de datos y ley aplicable— NO se toca.

   ⚠️ WAITING_FOR_HUMAN_LEGAL_DATA — CIF, domicilio social y datos de
   inscripción registral. La LSSI-CE (art. 10) los EXIGE en esta página y hoy
   NO están: el §1 sólo da denominación y correo. No se inventan. Es de Axel, y
   es un incumplimiento vivo mientras el sitio esté publicado. */

export default function AvisoLegalPage() {
  return (
    <>
      <h1>Aviso legal</h1>
      <p className="legal-meta">Versión 1.1 · Última actualización: 26 de septiembre de 2026</p>

      <h2>1. Titular del sitio web</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de que el titular de
        este sitio web (veliacorp.com y sus subdominios) es <strong>VELIA Solutions SL</strong>{' '}
        (en adelante, «VELIA»). Contacto: <a href={`mailto:${EMAIL_TITULAR_LEGAL}`}>{EMAIL_TITULAR_LEGAL}</a>.
      </p>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene por objeto dar a conocer VELIA —compañía de transformación y
        operación digital: diseña, construye, integra, automatiza y opera la infraestructura
        digital de empresas y profesionales—, sus capacidades y sus vías de contacto. Es un
        sitio informativo: no permite contratar en línea ni constituye por sí mismo una oferta.
        La contratación de cualquier servicio se rige por los{' '}
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
