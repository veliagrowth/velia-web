import type { Metadata } from 'next'
import Link from 'next/link'
import PricingPlans from '@/components/PricingPlans'

export const metadata: Metadata = {
  title: 'Precios — VELIA',
  description:
    'VELIA Legal: 199€/mes por despacho (o 1.990€/año — 2 meses gratis) con un abogado incluido, +49€ por abogado adicional. Programa Fundadores: 149€/mes de por vida. Web a medida gratis de por vida.',
  alternates: { canonical: 'https://veliacorp.com/precios' },
}

/* Única fuente de las FAQ: alimenta el render Y el JSON-LD FAQPage.
   La respuesta de permanencia está pendiente de ratificar con Axel (decisión
   2026-07-16) — si cambia, se edita aquí y queda coherente en ambos sitios. */
const FAQS = [
  {
    q: '¿Hay permanencia?',
    a: '6 meses iniciales — el tiempo real que tarda un despacho en operar entero sobre la plataforma. Después, mes a mes.',
  },
  {
    q: '¿La web es de verdad gratis?',
    a: 'Sí: diseño a medida para tu despacho, incluida mientras seas cliente, sin coste de mantenimiento aparte.',
  },
  {
    q: '¿Dónde se guardan mis expedientes y documentos?',
    a: 'En infraestructura de la Unión Europea, con aislamiento por despacho en el propio motor de base de datos y documentos en almacenamiento privado. Tu despacho es el titular de sus datos: VELIA solo los trata para prestarte el servicio, con acuerdo de encargo (DPA) disponible. La conexión con el Drive del propio despacho está en la hoja de ruta.',
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
    acceptedAnswer: { '@type': 'Answer', text: f.a },
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
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-6">Precios</p>
        <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[20ch]">
          Un precio. Todo dentro.
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          Sin módulos, sin sorpresas y sin permanencias escondidas: 6 meses iniciales y
          después mes a mes. Se paga con un caso al mes.
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
