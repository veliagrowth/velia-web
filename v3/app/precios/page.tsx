import type { Metadata } from 'next'
import Link from 'next/link'
import PricingPlans from '@/components/PricingPlans'

export const metadata: Metadata = {
  title: 'Precios — VELIA',
  description:
    'VELIA Despacho: 99€/mes por despacho (o 990€/año — 2 meses gratis) con 2 usuarios incluidos, +29€ por usuario adicional. Programa Fundadores: web premium incluida con el plan anual.',
  alternates: { canonical: 'https://veliacorp.com/precios' },
}

/* Única fuente de las FAQ: alimenta el render Y el JSON-LD FAQPage. */
/* a + closer: el cierre se pinta como unidad inseparable (inline-block) para
   que la última frase nunca quede partida a mitad. El JSON-LD une ambos. */
const FAQS: { q: string; a: string; closer?: string }[] = [
  {
    q: '¿Hay permanencia?',
    a: 'El pago mensual tiene un compromiso inicial de 3 meses — el tiempo real para completar la puesta en marcha y adoptar el sistema. Después, cancelas con 30 días de preaviso.',
    closer: 'El plan anual da 12 meses de acceso y un ahorro de 2 mensualidades.',
  },
  {
    q: '¿Cuántos usuarios incluye?',
    a: 'El plan incluye 2 usuarios. Puedes añadir más según el tamaño del despacho: 29€/mes (o 290€/año) por usuario adicional.',
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
          Un precio. Todo dentro.
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          Sin módulos, sin sorpresas y sin permanencias escondidas: 3 meses iniciales en
          el pago mensual y después, mes a mes.{' '}
          <span className="inline-block">Se paga con un caso al mes.</span>
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
