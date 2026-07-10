import type { Metadata } from 'next'
import Link from 'next/link'
import PricingPlans from '@/components/PricingPlans'

export const metadata: Metadata = {
  title: 'Precios — VELIA',
  description:
    'VELIA Legal: 199€/mes por despacho (o 1.990€/año — 2 meses gratis) con un abogado incluido, +49€ por abogado adicional. Programa Fundadores: 149€/mes de por vida. Web a medida gratis de por vida.',
}

export default function PreciosPage() {
  return (
    <>
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
            <div>
              <h3 className="text-sm font-700 mb-2">¿Hay permanencia?</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                6 meses iniciales — el tiempo real que tarda un despacho en operar entero
                sobre la plataforma. Después, mes a mes.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-700 mb-2">¿La web es de verdad gratis?</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                Sí: diseño a medida para tu despacho, incluida mientras seas cliente, sin
                coste de mantenimiento aparte.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-700 mb-2">¿Y mis datos si me voy?</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                Son tuyos: exportación completa de expedientes, contactos y documentos.
                Detalle en la página de <Link href="/seguridad" className="underline decoration-void/25 hover:decoration-void">seguridad</Link>.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-700 mb-2">¿Cuánto tarda la puesta en marcha?</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                El despacho entra el primer día; los resultados medibles del primer caso
                (Cónsul Jurídico) llegaron en menos de 60 días.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
