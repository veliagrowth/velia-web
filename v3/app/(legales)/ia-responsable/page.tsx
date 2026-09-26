import type { Metadata } from 'next'
import Link from 'next/link'
import { EMAIL_TITULAR_LEGAL } from '@/lib/constants'
import { metadatosDePagina } from '@/lib/metadatos'

/* Por `metadatosDePagina`: hasta el 18-sep esta pagina heredaba el openGraph
   entero del layout, asi que compartir su enlace ensenaba el titulo de la
   portada y su `og:url` apuntaba a la raiz del sitio. Esto es metadata, no
   el texto del documento: el contenido legal no se toca desde aqui. */
export const metadata: Metadata = metadatosDePagina({
  titulo: 'IA responsable — VELIA',
  descripcion:
    'Cómo usa VELIA la inteligencia artificial: transparencia conforme al Reglamento europeo de IA, supervisión humana, fuentes verificables y sin entrenamiento con datos de clientes.',
  ruta: '/ia-responsable',
})

/* ── v1.1, 26-sep-2026 ───────────────────────────────────────────────────────
   El documento hablaba de «asistente del abogado», «consultas jurídicas»,
   «el trabajo del despacho» y «la aprobación del abogado»: describía la IA de
   un producto para bufetes, no la de VELIA. Se generaliza el SUJETO.

   La SUSTANCIA no se toca —y es lo que tiene efectos—: Reglamento (UE)
   2024/1689 y su art. 50, AESIA, identificación de la IA, etiquetado de
   documentos, fuentes verificables, supervisión humana y no entrenamiento con
   datos de cliente. Lo único que cambia es a quién se dirige.

   El caso regulado sigue contemplado EXPRESAMENTE en el §1: cuando el entorno
   se configura para un sector colegiado, ningún resultado sustituye al criterio
   ni a la firma del profesional. Eso es más fuerte que antes, no más débil:
   antes lo decía sólo para abogados y ahora lo dice para cualquier sector
   regulado. ⚠️ Revisión de Axel pendiente antes de publicar. */

export default function IaResponsablePage() {
  return (
    <>
      <h1>Transparencia e IA responsable</h1>
      <p className="legal-meta">Versión 1.1 · Última actualización: 26 de septiembre de 2026</p>

      <h2>1. Qué hace la IA en VELIA</h2>
      <p>
        VELIA integra inteligencia artificial como <strong>asistente de quien trabaja</strong>:
        responde consultas citando sus fuentes, prepara borradores de textos e informes, resume
        documentación y ayuda a organizar el trabajo del negocio. Es una herramienta de
        asistencia: <strong>no toma decisiones con efectos jurídicos ni económicos por sí
        sola</strong> — la revisión y la decisión final corresponden siempre a la persona
        responsable.
      </p>
      <p>
        Cuando el entorno está configurado para un sector regulado —por ejemplo el jurídico—,
        eso significa expresamente que ningún resultado de la IA sustituye al criterio ni a la
        firma del profesional colegiado.
      </p>

      <h2>2. Marco normativo</h2>
      <p>
        El Reglamento (UE) 2024/1689 de Inteligencia Artificial es de aplicación directa en
        España, con sus obligaciones de transparencia (artículo 50) plenamente aplicables desde
        el <strong>2 de agosto de 2026</strong>. España tramita además su Ley Orgánica para el
        buen uso y la gobernanza de la IA, que designa a la AESIA como autoridad de supervisión.
        VELIA sigue ambas evoluciones normativas y adapta el producto de forma continua.
      </p>

      <h2>3. Cómo cumplimos la transparencia</h2>
      <p>Medidas activas en el producto:</p>
      <ul>
        <li>
          <strong>Sabes que hablas con una IA</strong>: el asistente de VELIA se identifica como
          inteligencia artificial y recuerda de forma permanente que puede cometer errores.
        </li>
        <li>
          <strong>Documentos etiquetados</strong>: los informes y borradores generados con
          asistencia de IA lo indican expresamente en el propio documento, junto a la mención de
          la revisión bajo responsabilidad del cliente.
        </li>
        <li>
          <strong>Fuentes oficiales verificables</strong>: cuando VELIA cita legislación, el texto
          procede del BOE o de EUR-Lex y se enlaza a la fuente. Si no encuentra la fuente
          oficial, lo dice — no la inventa.
        </li>
        <li>
          <strong>Supervisión humana</strong>: ningún borrador se envía automáticamente a un
          tercero; todo pasa por la aprobación de la persona responsable.
        </li>
      </ul>

      <h2>4. Modelos y datos</h2>
      <p>
        VELIA utiliza modelos de lenguaje de proveedores líderes (entre ellos Claude, de
        Anthropic) bajo acuerdos de uso empresarial. <strong>Los datos de los clientes no se
        utilizan para entrenar modelos de IA</strong>, ni por VELIA ni por sus proveedores según
        las condiciones contratadas. El detalle del tratamiento de datos, el alojamiento en la
        Unión Europea y el aislamiento por cliente está en la página de{' '}
        <Link href="/seguridad">Seguridad</Link> y en la{' '}
        <Link href="/privacidad">Política de privacidad</Link>.
      </p>

      <h2>5. Alfabetización en IA</h2>
      <p>
        Acompañamos a cada cliente en el uso competente de la IA: la puesta en marcha explica
        qué hace cada función, qué límites tiene y cuándo revisar con especial atención. Nuestro
        objetivo es que quien la usa entienda la herramienta — no que confíe a ciegas en ella.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para cualquier consulta sobre el uso de IA en VELIA:{' '}
        <a href={`mailto:${EMAIL_TITULAR_LEGAL}`}>{EMAIL_TITULAR_LEGAL}</a>.
      </p>
    </>
  )
}
