import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Precios — VELIA',
  description:
    'VELIA Legal: 199€/mes por despacho con un abogado incluido, +49€ por abogado adicional. Programa Fundadores: 149€/mes de por vida. Web a medida gratis de por vida.',
}

const INCLUDED = [
  'VELIA, tu asistente: escritos, informes y consultas con fuentes oficiales (BOE)',
  'Puesta al día automática cada mañana (plazos, citas, mensajes, documentos)',
  'Cómputo de plazos procesales según la LEC con avisos',
  'CRM completo: contactos, expedientes, pipeline, agenda y control horario',
  'Portal del cliente: su caso en lenguaje llano, subida de documentos, pagos y citas',
  'Persecución automática de documentación al cliente',
  'Facturación conforme a Verifactu',
  'Web del despacho a medida — gratis de por vida',
  'Inbox unificado: email, WhatsApp y mensajes del portal',
  'Datos alojados en la UE · aislamiento por despacho (RLS)',
]

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

      <section className="mx-auto max-w-6xl px-6 pb-20 grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
        {/* Plan principal */}
        <div className="rounded-3xl border border-void/10 bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-5xl font-800 tracking-[-0.03em]">199€<span className="text-lg font-600 text-void/45">/mes</span></p>
            <p className="text-sm text-void/50">por despacho · 1 abogado incluido · +49€/mes por abogado adicional</p>
          </div>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {INCLUDED.map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-void/70 leading-snug">
                <span className="text-gold-dark mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            className="btn inline-block mt-9 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
          >
            Empezar — agenda una demo
          </Link>
        </div>

        <div className="space-y-6">
          {/* Fundadores */}
          <div id="fundadores" className="rounded-3xl border border-gold/40 bg-gold/10 p-8 scroll-mt-24">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">
              Programa Fundadores
            </p>
            <p className="text-4xl font-800 tracking-[-0.03em]">149€<span className="text-base font-600 text-void/45">/mes</span></p>
            <p className="mt-3 text-sm text-void/65 leading-[1.6]">
              Congelado <strong className="font-700">de por vida</strong> para los 5 primeros
              despachos. Mismo producto completo, acceso directo al equipo que lo construye
              y voz en la hoja de ruta.
            </p>
            <p className="mt-4 text-[12px] font-700 tracking-[0.08em] uppercase text-gold-dark">
              Quedan 4 de 5 plazas
            </p>
            <Link
              href="/contacto"
              className="btn inline-block mt-5 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-6 py-3 hover:opacity-85"
            >
              Solicitar plaza
            </Link>
          </div>

          {/* Bufetes grandes */}
          <div className="rounded-3xl border border-void/10 bg-white p-8">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/40 mb-3">
              Bufetes grandes
            </p>
            <p className="text-sm text-void/65 leading-[1.6]">
              Sin tarifa de catálogo: onboarding y estudio de integración a medida según
              la infraestructura que haya que manejar.
            </p>
            <Link href="/contacto" className="inline-block mt-4 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-dark hover:text-void transition-colors">
              Hablar con el equipo →
            </Link>
          </div>
        </div>
      </section>

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
