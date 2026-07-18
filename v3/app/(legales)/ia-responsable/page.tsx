import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'IA responsable — VELIA',
  description:
    'Cómo usa VELIA la inteligencia artificial: transparencia conforme al Reglamento europeo de IA, supervisión humana del abogado, fuentes oficiales verificables y sin entrenamiento con datos de clientes.',
  alternates: { canonical: 'https://veliacorp.com/ia-responsable' },
}

export default function IaResponsablePage() {
  return (
    <>
      <h1>Transparencia e IA responsable</h1>
      <p className="legal-meta">Versión 1.0 · Última actualización: 18 de julio de 2026</p>

      <h2>1. Qué hace la IA en VELIA</h2>
      <p>
        VELIA integra inteligencia artificial como <strong>asistente del abogado</strong>: responde
        consultas jurídicas con fuentes, prepara borradores de escritos e informes, resume
        documentación y ayuda a organizar el trabajo del despacho. La IA de VELIA es una
        herramienta de asistencia profesional: <strong>no toma decisiones con efectos jurídicos
        por sí sola</strong> — la revisión y la decisión final corresponden siempre al abogado.
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
          la revisión bajo responsabilidad del despacho.
        </li>
        <li>
          <strong>Fuentes oficiales verificables</strong>: cuando VELIA cita legislación, el texto
          procede del BOE o de EUR-Lex y se enlaza a la fuente. Si no encuentra la fuente
          oficial, lo dice — no la inventa.
        </li>
        <li>
          <strong>Supervisión humana</strong>: ningún borrador se envía automáticamente a un
          cliente; todo pasa por la aprobación del abogado.
        </li>
      </ul>

      <h2>4. Modelos y datos</h2>
      <p>
        VELIA utiliza modelos de lenguaje de proveedores líderes (entre ellos Claude, de
        Anthropic) bajo acuerdos de uso empresarial. <strong>Los datos de los despachos no se
        utilizan para entrenar modelos de IA</strong>, ni por VELIA ni por sus proveedores según
        las condiciones contratadas. El detalle del tratamiento de datos, el alojamiento en la
        Unión Europea y el aislamiento por despacho está en la página de{' '}
        <Link href="/seguridad">Seguridad</Link> y en la{' '}
        <Link href="/privacidad">Política de privacidad</Link>.
      </p>

      <h2>5. Alfabetización en IA</h2>
      <p>
        Acompañamos a cada despacho en el uso competente de la IA: el onboarding explica qué hace
        cada función, qué límites tiene y cuándo revisar con especial atención. Nuestro objetivo
        es que el abogado entienda la herramienta que usa — no que confíe a ciegas en ella.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para cualquier consulta sobre el uso de IA en VELIA:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </>
  )
}
