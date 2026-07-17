import Link from 'next/link'
import LiveUpdates from '@/components/LiveUpdates'
import ProductShot from '@/components/ProductShot'
import TestimonialVideo from '@/components/TestimonialVideo'
import { FOUNDERS_SEATS_LABEL, APP_URL, SITE_URL } from '@/lib/constants'

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VELIA',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    'Software de gestión para despachos de abogados en España: expedientes, plazos LEC, escritos con IA citando el BOE y facturación Verifactu.',
  offers: {
    '@type': 'Offer',
    price: '199',
    priceCurrency: 'EUR',
    description: '199€/mes por despacho con un abogado incluido. Prueba gratis de 15 días.',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      {/* ── Hero — texto+CTAs a la izquierda, vídeo en loop a la derecha ──── */}
      <section className="mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-20">
        <div className="grid gap-12 md:grid-cols-[1.05fr_1fr] md:items-center">
          <div className="rise">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-6">
              Plataforma de software legal
            </p>
            <h1 className="text-4xl md:text-[3.4rem] font-800 leading-[1.05] tracking-[-0.03em]">
              Todo tu despacho.
              <br />
              Un solo software.
            </h1>
            <p className="mt-7 text-lg text-void/60 leading-relaxed max-w-prose">
              VELIA es la plataforma sobre la que los despachos españoles operan el 100% de
              su software: clientes, expedientes, plazos, escritos con IA,{' '}
              <span className="whitespace-nowrap">facturación Verifactu</span> y web — en una
              suscripción, sin piezas sueltas.{' '}
              <span className="inline-block">Del abogado independiente al gran bufete.</span>
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contacto"
                className="btn bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
              >
                Agenda una demo
              </Link>
              <Link
                href="/precios#fundadores"
                className="btn border border-void/20 text-void text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:border-void/50 transition-colors"
              >
                Hazte Fundador — 149€/mes
              </Link>
            </div>
          </div>

          {/* Vídeo en loop (Mixkit, licencia libre) — la abogacía de siempre,
              el software de ahora. Muted+playsInline para autoplay en móvil. */}
          <div className="rise">
            <video
              className="w-full rounded-2xl border border-void/10 object-cover aspect-[4/3] md:aspect-[5/4]"
              src="/videos/hero-abogacia.mp4"
              poster="/videos/hero-abogacia-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Un letrado firmando una resolución"
            />
          </div>
        </div>

        {/* Demo interactiva — tócala sin registro (escaparate solo lectura) */}
        <div className="mt-16 md:mt-20 rounded-2xl border border-void/10 bg-deep px-8 py-8 md:px-10 md:py-9 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-gold/60 mb-2">
              Demo interactiva
            </p>
            <p className="text-xl md:text-2xl font-700 tracking-[-0.01em] text-cream max-w-[30ch]">
              No te lo contamos: tócalo.
            </p>
            <p className="mt-2 text-sm text-cream/55 leading-[1.6] max-w-[52ch]">
              Entra en un despacho de demostración real y recorre VELIA por dentro —
              expedientes, plazos, agenda y facturación. Sin registro y sin tocar nada:
              es un escaparate de solo lectura.
            </p>
          </div>
          <Link
            href="/demo"
            className="btn justify-self-start md:justify-self-end bg-gold text-void text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85 whitespace-nowrap"
          >
            Abrir la demo
          </Link>
        </div>
      </section>

      {/* ── Tres bloques de valor ────────────────────────────────────────── */}
      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">
            Qué hace por ti
          </p>
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[24ch]">
            No es otra herramienta. Es el sistema operativo del despacho.
          </h2>

          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            <div className="md:pr-4">
              <h3 className="text-lg font-700 mb-3">Todo dentro</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                Clientes, expedientes, agenda, plazos, documentos, facturación y tu web.
                Deja de pagar y pegar cinco programas: VELIA es uno solo, y las piezas
                se hablan entre sí.
              </p>
            </div>
            <div className="md:border-l md:border-void/10 md:pl-10">
              <h3 className="text-lg font-700 mb-3">Agentes que ejecutan</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                VELIA no es un chatbot que opina: redacta escritos con tu estilo, calcula
                plazos procesales, prepara informes citando la fuente oficial y persigue
                la documentación del cliente por ti.
              </p>
            </div>
            <div className="md:border-l md:border-void/10 md:pl-10">
              <h3 className="text-lg font-700 mb-3">Hecho para España</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                Texto oficial del BOE, cómputo de plazos según la LEC, facturación conforme
                a Verifactu y datos alojados en la Unión Europea. No es un software genérico
                traducido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Producto real (captura del tenant demo) ─────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">
          Así se ve por dentro
        </p>
        <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[24ch]">
          Tus expedientes, con todo lo que importa a la vista.
        </h2>
        <p className="mt-5 mb-10 text-sm text-void/60 leading-[1.6] max-w-prose">
          Estado, área, prioridad, cliente y vencimientos de cada asunto — y un control
          de conflicto de intereses antes de aceptar nada. Esto no es un mockup: es la
          pantalla real del producto.
        </p>
        <ProductShot
          src="/screenshots/expedientes.webp"
          alt="Vista real de Expedientes en VELIA: asuntos con estado, área, prioridad y cliente"
        />
      </section>

      {/* ── Caso real ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">
              Caso real
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
              Un despacho de Fraga. Cero presencia digital. 60 días después:
            </h2>
            <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
              Cónsul Jurídico empezó sin web, sin sistema y sin captación. Hoy opera
              entero sobre VELIA: los clientes llegan, la documentación se persigue sola
              y cada consulta queda registrada en su expediente.
            </p>
            <Link
              href="/legal"
              className="inline-block mt-7 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-dark hover:text-void transition-colors"
            >
              Ver cómo funciona →
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-px bg-void/10 border border-void/10 rounded-2xl overflow-hidden">
            {[
              { n: '+260%', d: 'consultas captadas al mes' },
              { n: '+85%', d: 'nuevos clientes' },
              { n: '−70%', d: 'tiempo en gestión' },
              { n: '<60', d: 'días hasta resultados' },
            ].map(s => (
              <div key={s.d} className="bg-white px-6 py-8">
                <dt className="sr-only">{s.d}</dt>
                <dd>
                  <span className="block text-3xl font-800 tracking-[-0.02em]">{s.n}</span>
                  <span className="block text-[12px] text-void/50 mt-1.5">{s.d}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Testimonio en vídeo (oculto tras flag hasta tener el máster) ── */}
      <TestimonialVideo />

      {/* ── Pricing resumido ─────────────────────────────────────────────── */}
      <section className="bg-void text-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold/70 mb-3">
                Precio claro
              </p>
              <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[20ch]">
                Se paga con un caso al mes.
              </h2>
              <p className="mt-5 text-sm text-cream/55 leading-[1.6] max-w-prose">
                199€ al mes por despacho, con un abogado incluido y +49€ por abogado
                adicional. Web a medida gratis de por vida. Sin módulos ocultos: todo lo
                que ves está dentro.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4">
                <p className="text-sm text-cream/85">
                  <strong className="font-700 text-gold-light">Programa Fundadores:</strong> 149€/mes
                  congelado de por vida · quedan <strong className="font-700">{FOUNDERS_SEATS_LABEL}</strong>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <p className="text-5xl md:text-6xl font-800 tracking-[-0.03em]">
                199€<span className="text-xl font-600 text-cream/50">/mes</span>
              </p>
              <Link
                href="/precios"
                className="btn bg-gold text-void text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
              >
                Ver qué incluye
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Producto vivo (novedades) — fallo seguro: null si el feed no responde */}
      <LiveUpdates />

      {/* ── Descarga la app ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">
              VELIA en tu móvil
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[18ch]">
              El despacho, en tu bolsillo.
            </h2>
            <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
              VELIA se instala como una app: icono en tu pantalla de inicio, pantalla
              completa y tu asistente a un toque. Entra desde el móvil y VELIA te guía
              en la instalación — son 10 segundos.
            </p>
            <a
              href={`${APP_URL}/instalar`}
              className="btn inline-block mt-7 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
            >
              Instalar la app
            </a>
          </div>
          {/* Mock móvil sobrio */}
          <div className="justify-self-center w-[240px] rounded-[2rem] border border-void/15 bg-deep p-3">
            <div className="rounded-[1.6rem] bg-void px-4 py-6 space-y-3">
              <p className="text-[9px] font-700 tracking-[0.22em] uppercase text-gold/60">VELIA</p>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                <p className="text-cream/80 text-[11px] leading-relaxed">
                  Mañana a las 10:00 tienes la vista del expediente MER-2026-008. Te he
                  dejado el resumen preparado.
                </p>
              </div>
              <div className="flex justify-end">
                <div className="rounded-lg bg-gold/15 px-3 py-2">
                  <p className="text-cream text-[11px]">Perfecto, imprímelo.</p>
                </div>
              </div>
              <div className="h-8 rounded-full border border-white/10 flex items-center px-3">
                <span className="text-cream/30 text-[10px]">Pregunta a VELIA…</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-3xl border border-void/10 bg-white px-8 py-14 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em]">
            Ve VELIA con tus propios casos.
          </h2>
          <p className="mt-4 text-sm text-void/55 max-w-[46ch] mx-auto leading-relaxed">
            Una demo de 30 minutos con tu tipo de asuntos. Sin compromiso y sin
            preparación por tu parte.
          </p>
          <Link
            href="/contacto"
            className="btn inline-block mt-8 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-8 py-4 hover:opacity-85"
          >
            Agenda una demo
          </Link>
        </div>
      </section>
    </>
  )
}
