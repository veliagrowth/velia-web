import Link from 'next/link'
import LiveUpdates from '@/components/LiveUpdates'
import ProductShot from '@/components/ProductShot'
import TestimonialVideo from '@/components/TestimonialVideo'
import VeliaBrain from '@/components/VeliaBrain'
import HeroVideo from '@/components/HeroVideo'
import TrackedLink from '@/components/TrackedLink'
import SectionViewMarker from '@/components/SectionViewMarker'
import { FOUNDERS_SEATS_LABEL, APP_URL, SITE_URL } from '@/lib/constants'
import { PRICING, ANNUAL_FREE_MONTHS, eur } from '@/lib/pricing'

const BRAIN_CAPABILITIES = [
  {
    title: 'Entiende el contexto',
    body: 'No empiezas de cero en cada consulta. VELIA trabaja sobre la información ya disponible en el expediente: quién es el cliente, qué se ha hablado, qué documentos hay.',
  },
  {
    title: 'Analiza',
    body: 'Resume la documentación incorporada y ayuda a ordenar expedientes complejos, citando la fuente oficial cuando corresponde.',
  },
  {
    title: 'Prepara',
    body: 'Genera primeros borradores de escritos e informes citando el texto oficial del BOE artículo por artículo.',
  },
  {
    title: 'Organiza',
    body: 'Relaciona plazos, tareas, documentos y clientes para que cada expediente esté al día sin repasarlo pieza por pieza.',
  },
]

const COMPARISON = {
  before: [
    'Registra expedientes.',
    'Almacena documentos.',
    'Muestra tareas pendientes.',
    'La IA vive en otra pestaña, aparte.',
    'El contexto queda repartido entre herramientas.',
  ],
  velia: [
    'Conecta expedientes, documentos y agenda entre sí.',
    'La IA trabaja dentro del flujo, no al lado.',
    'Usa el contexto de cada expediente para ayudar.',
    'Prepara borradores citando fuentes oficiales.',
    'Todo en una sola suscripción, sin piezas sueltas.',
  ],
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VELIA',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    'Software de gestión para despachos de abogados en España: expedientes, plazos LEC, escritos con IA citando el BOE y facturación Verifactu.',
  offers: [
    {
      '@type': 'Offer',
      price: String(PRICING.monthly),
      priceCurrency: 'EUR',
      description: `${eur(PRICING.monthly)}/mes por despacho con ${PRICING.usersIncluded} usuarios incluidos. Prueba gratis de 15 días.`,
    },
    {
      '@type': 'Offer',
      price: String(PRICING.annualTotal),
      priceCurrency: 'EUR',
      description: `${eur(PRICING.annualTotal)}/año por despacho (${ANNUAL_FREE_MONTHS} meses gratis) con ${PRICING.usersIncluded} usuarios incluidos. Prueba gratis de 15 días.`,
    },
  ],
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
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-6">
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
              <TrackedLink
                href="/contacto"
                event="hero_demo_click"
                className="btn bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
              >
                Agenda una demo
              </TrackedLink>
              <Link
                href="/demo"
                className="btn border border-void/20 text-void text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:border-void/50 transition-colors"
              >
                Ver VELIA en acción
              </Link>
            </div>
          </div>

          {/* Vídeo en loop (Mixkit, licencia libre) — la abogacía de siempre,
              el software de ahora. Muted+playsInline para autoplay en móvil.
              Control de pausa accesible: WCAG 2.2.2 (HeroVideo.tsx). */}
          <div className="rise">
            <HeroVideo
              src="/videos/hero-abogacia.mp4"
              poster="/videos/hero-abogacia-poster.jpg"
              ariaLabel="Un letrado firmando una resolución"
            />
          </div>
        </div>

        {/* Demo interactiva — tócala sin registro (escaparate solo lectura) */}
        <div className="mt-16 md:mt-20 rounded-2xl border border-void/10 bg-deep px-8 py-8 md:px-10 md:py-9 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            {/* gold/80 no gold/70: este bloque va sobre bg-deep (más claro que
                bg-void), donde /70 da 4.37:1 (falla AA 4.5) — cazado por Lighthouse. */}
            <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-gold/80 mb-2">
              Demo interactiva
            </p>
            <p className="text-xl md:text-2xl font-700 tracking-[-0.01em] text-cream max-w-[30ch]">
              No te lo contamos: tócalo.
            </p>
            <p className="mt-2 text-sm text-cream/55 leading-[1.6] max-w-[52ch]">
              Entra en un despacho de demostración real y recorre VELIA por dentro —
              expedientes, plazos, agenda y facturación.{' '}
              <span className="inline-block">Sin registro y sin tocar nada:</span>{' '}
              <span className="inline-block">es un escaparate de solo lectura.</span>
            </p>
          </div>
          <TrackedLink
            href="/demo"
            event="product_demo_click"
            className="btn justify-self-start md:justify-self-end bg-gold text-void text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85 whitespace-nowrap"
          >
            Abrir la demo
          </TrackedLink>
        </div>
      </section>

      {/* ── Tres bloques de valor ────────────────────────────────────────── */}
      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
            Qué hace por ti
          </p>
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[24ch]">
            No es otra herramienta. Es el sistema operativo del despacho.
          </h2>

          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            <div className="md:pr-4">
              <h3 className="text-lg font-700 mb-3">Todo dentro</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                Clientes, expedientes, agenda, plazos, documentos, facturación y tu web.{' '}
                <span className="inline-block">Deja de pagar y pegar cinco programas:</span>{' '}
                <span className="inline-block">VELIA es uno solo, y las piezas se hablan entre sí.</span>
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
                a Verifactu y datos alojados en la Unión Europea.{' '}
                <span className="inline-block">No es un software genérico traducido.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── El Cerebro VELIA ─────────────────────────────────────────────── */}
      <section id="cerebro" className="bg-void text-cream scroll-mt-16">
        <SectionViewMarker event="brain_section_view" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="justify-self-center md:justify-self-start order-2 md:order-1">
              <VeliaBrain state="active" className="w-full max-w-[280px] text-cream" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold/70 mb-4">
                El Cerebro VELIA
              </p>
              <h2 className="text-3xl md:text-4xl font-800 tracking-[-0.02em] max-w-[18ch]">
                No es un chatbot dentro de un CRM.
              </h2>
              <p className="mt-5 text-sm text-cream/60 leading-[1.6] max-w-prose">
                Es la inteligencia que vive dentro del despacho. Trabaja con el contexto de
                cada expediente para ayudarte a encontrar lo que necesitas, entender la
                documentación y preparar los siguientes pasos —{' '}
                <span className="inline-block">sin que tengas que explicárselo todo de nuevo cada vez.</span>
              </p>
              <Link
                href="/legal"
                className="inline-block mt-6 text-[12px] font-700 tracking-[0.1em] uppercase text-gold hover:text-gold-light transition-colors"
              >
                Ver un día completo con VELIA →
              </Link>
            </div>
          </div>

          <div className="mt-16 md:mt-20 grid gap-x-10 gap-y-10 md:grid-cols-4 border-t border-white/10 pt-12">
            {BRAIN_CAPABILITIES.map(c => (
              <div key={c.title}>
                <h3 className="text-sm font-700 text-gold-light mb-2.5">{c.title}</h3>
                <p className="text-[13px] text-cream/55 leading-[1.6]">{c.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-14 text-lg md:text-xl font-700 tracking-[-0.01em] text-cream/90 max-w-[26ch]">
            VELIA prepara. Tú supervisas y decides.
          </p>
        </div>
      </section>

      {/* ── Producto real (captura del tenant demo) ─────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
          Así se ve por dentro
        </p>
        <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[24ch]">
          Tus expedientes, con todo lo que importa a la vista.
        </h2>
        <p className="mt-5 mb-10 text-sm text-void/60 leading-[1.6] max-w-prose">
          Estado, área, prioridad, cliente y vencimientos de cada asunto — y un control
          de conflicto de intereses antes de aceptar nada.{' '}
          <span className="inline-block">Esto no es un mockup: es la pantalla real del producto.</span>
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
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
              Caso real
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
              Un despacho de Fraga. Cero presencia digital. 60 días después:
            </h2>
            <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
              Cónsul Jurídico empezó sin web, sin sistema y sin captación.{' '}
              <span className="inline-block">Hoy opera entero sobre VELIA:</span> los
              clientes llegan, la documentación se persigue sola y cada consulta queda
              registrada en su expediente.
            </p>
            <Link
              href="/legal"
              className="inline-block mt-7 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
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
                  <span className="block text-[12px] text-void/60 mt-1.5">{s.d}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Comparación editorial — sin tabla agresiva, sin competidores ── */}
      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/60 mb-3">
            La diferencia real
          </p>
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
            Los CRM guardan información.{' '}
            <span className="text-void/60">VELIA te ayuda a trabajar con ella.</span>
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-2 max-w-4xl">
            <div>
              <p className="text-[11px] font-700 tracking-[0.18em] uppercase text-void/60 mb-5">
                Un CRM tradicional
              </p>
              <ul className="space-y-3.5">
                {COMPARISON.before.map(item => (
                  <li key={item} className="text-sm text-void/60 leading-[1.6]">{item}</li>
                ))}
              </ul>
            </div>
            <div className="md:border-l md:border-void/10 md:pl-10">
              <p className="text-[11px] font-700 tracking-[0.18em] uppercase text-gold-ink mb-5">
                VELIA
              </p>
              <ul className="space-y-3.5">
                {COMPARISON.velia.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-void/75 leading-[1.6]">
                    <span className="text-gold-ink mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonio en vídeo (oculto tras flag hasta tener el máster) ── */}
      <TestimonialVideo />

      {/* ── Desarrollada en España ───────────────────────────────────────── */}
      <section id="espana" className="mx-auto max-w-6xl px-6 py-20 md:py-28 scroll-mt-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-start">
          <div>
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
              Tecnología desarrollada en España
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[20ch]">
              Hecha aquí. Pensada para cómo trabajan los despachos de aquí.
            </h2>
            <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
              VELIA se ha diseñado y desarrollado en España, junto al primer despacho que
              la usa cada día.{' '}
              <span className="inline-block">No es un software genérico traducido:</span>{' '}
              entiende el BOE, la LEC y Verifactu porque nació para ellos.
            </p>
          </div>
          <ul className="grid gap-4 content-start">
            {[
              'Desarrollada en España',
              'Validada junto a un despacho real',
              'Pensada para el marco jurídico español',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 rounded-2xl border border-void/10 bg-white px-5 py-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                <span className="text-sm font-600 text-void/75">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Confianza y seguridad — puente a /seguridad, solo claims verificados ── */}
      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/60 mb-3">
                Confianza
              </p>
              <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
                Tus expedientes exigen algo más que innovación.{' '}
                <span className="text-void/60">Exigen confianza.</span>
              </h2>
              <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
                VELIA asiste al profesional.{' '}
                <span className="inline-block">El criterio y la decisión jurídica permanecen siempre bajo su control.</span>
              </p>
            </div>
            <Link
              href="/seguridad"
              className="btn justify-self-start md:justify-self-end bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85 whitespace-nowrap"
            >
              Ver seguridad al detalle
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3 border-t border-void/10 pt-10">
            {[
              { title: 'Aislamiento por despacho', body: 'Cada despacho es un inquilino aislado — Row Level Security en el propio motor de base de datos.' },
              { title: 'Tu información no entrena ninguna IA', body: 'Política contractual del proveedor de la API que usamos, no una promesa nuestra.' },
              { title: 'Diseñada para la abogacía', body: 'El deber de secreto profesional guía cada decisión de arquitectura, desde el primer día.' },
            ].map(p => (
              <div key={p.title}>
                <h3 className="text-sm font-700 mb-2">{p.title}</h3>
                <p className="text-[13px] text-void/60 leading-[1.6]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing resumido ─────────────────────────────────────────────── */}
      <section className="bg-void text-cream">
        <SectionViewMarker event="pricing_section_view" />
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
                {eur(PRICING.monthly)} al mes por despacho, con {PRICING.usersIncluded} usuarios
                incluidos y +{eur(PRICING.extraUserMonthly)} por usuario adicional.{' '}
                <span className="inline-block">En anual, {ANNUAL_FREE_MONTHS} meses gratis.</span>{' '}
                <span className="inline-block">Sin módulos ocultos: todo lo que ves está dentro.</span>
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4">
                <p className="text-sm text-cream/85">
                  <strong className="font-700 text-gold-light">Programa Fundadores:</strong> web
                  premium incluida con el plan anual ·{' '}
                  <span className="inline-block">quedan <strong className="font-700">{FOUNDERS_SEATS_LABEL}</strong></span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <p className="text-5xl md:text-6xl font-800 tracking-[-0.03em]">
                {eur(PRICING.monthly)}<span className="text-xl font-600 text-cream/50">/mes</span>
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
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
              VELIA en tu móvil
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[18ch]">
              El despacho, en tu bolsillo.
            </h2>
            <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
              VELIA se instala como una app: icono en tu pantalla de inicio, pantalla
              completa y tu asistente a un toque.{' '}
              <span className="inline-block">Entra desde el móvil y VELIA te guía en la
              instalación — son 10 segundos.</span>
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
              <p className="text-[9px] font-700 tracking-[0.22em] uppercase text-gold/70">VELIA</p>
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
                <span className="text-cream/55 text-[10px]">Pregunta a VELIA…</span>
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
          <p className="mt-4 text-sm text-void/60 max-w-[46ch] mx-auto leading-relaxed">
            Una demo de 30 minutos con tu tipo de asuntos.{' '}
            <span className="inline-block">Sin compromiso y sin preparación por tu parte.</span>
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
