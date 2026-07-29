import type { Metadata } from 'next'
import Link from 'next/link'
import PricingPlans from '@/components/PricingPlans'
import { PRICING, ANNUAL_FREE_MONTHS, eur } from '@/lib/pricing'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Precios — VELIA',
  description:
    `Un precio y todo VELIA: ${eur(PRICING.monthly)}/mes por despacho (o ${eur(PRICING.annualTotal)}/año, ${ANNUAL_FREE_MONTHS} meses gratis) con ${PRICING.usersIncluded} usuarios incluidos. Prueba ${PRICING.trialDays} días gratis, sin tarjeta.`,
  alternates: { canonical: `${SITE_URL}/precios` },
}

/* Única fuente de las FAQ: alimenta el render Y el JSON-LD FAQPage. */
/* a + closer: el cierre se pinta como unidad inseparable (inline-block) para
   que la última frase nunca quede partida a mitad. El JSON-LD une ambos. */
const FAQS: { q: string; a: string; closer?: string }[] = [
  {
    q: '¿Hay permanencia?',
    a: `El pago mensual tiene un compromiso inicial de ${PRICING.commitmentMonths} meses — el tiempo real para completar la puesta en marcha y adoptar el sistema. Después, cancelas con ${PRICING.cancellationNoticeDays} días de preaviso.`,
    closer: `El plan anual da 12 meses de acceso y un ahorro de ${ANNUAL_FREE_MONTHS} mensualidades.`,
  },
  {
    q: '¿Cuántos usuarios incluye?',
    a: `El plan incluye ${PRICING.usersIncluded} usuarios. Puedes añadir más según el tamaño del despacho: ${eur(PRICING.extraUserMonthly)}/mes (o ${eur(PRICING.extraUserAnnual)}/año) por usuario adicional.`,
  },
  {
    q: '¿Y la web del despacho?',
    a: 'La presencia digital premium está incluida para los despachos del Programa Fundadores que contratan en modalidad anual. Para el resto de planes, es un añadido opcional.',
  },
  {
    q: '¿Dónde se guardan mis expedientes y documentos?',
    a: 'En infraestructura de la Unión Europea, con aislamiento por despacho en el propio motor de base de datos y documentos en almacenamiento privado. Tu despacho es el titular de sus datos: VELIA solo los trata para prestarte el servicio, con acuerdo de encargo (DPA) disponible.',
    closer: 'La conexión con el Drive del propio despacho está en la hoja de ruta.',
  },
  {
    q: '¿Y mis datos si me voy?',
    a: 'Son tuyos: exportación completa de expedientes, contactos y documentos en cualquier momento.',
  },
  {
    q: '¿Cuánto tarda la puesta en marcha?',
    a: 'El despacho entra el primer día; los resultados medibles del primer caso (Cónsul Jurídico) llegaron en menos de 60 días.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.closer ? `${f.a} ${f.closer}` : f.a },
  })),
}

export default function PreciosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-16">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-6">Precios</p>
        <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[20ch]">
          <span className="inline-block">Un precio.</span>{' '}
          <span className="inline-block">Todo VELIA.</span>
        </h1>
        {/* «Se paga con un caso al mes» se retiró como mensaje de precio (29-jul):
            es un argumento comercial que necesita contexto, y de entrada obliga al
            visitante a hacer una cuenta antes de saber cuánto cuesta. */}
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          Sin módulos separados y sin costes ocultos. Elige pago mensual o anual.
        </p>
      </section>

      <PricingPlans />

      {/* FAQ corta */}
      <section className="bg-white border-t border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">Preguntas directas</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 max-w-4xl">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="text-sm font-700 mb-2">{f.q}</h3>
                <p className="text-sm text-void/60 leading-[1.6]">
                  {f.a}
                  {f.closer && (
                    <>
                      {' '}<span className="inline-block">{f.closer}</span>
                    </>
                  )}
                  {f.q === '¿Y mis datos si me voy?' && (
                    <>
                      {' '}Detalle en la página de{' '}
                      <Link href="/seguridad" className="underline decoration-void/25 hover:decoration-void">seguridad</Link>.
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
