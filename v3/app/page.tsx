import Link from 'next/link'
import VeliaBrain from '@/components/VeliaBrain'
import DemoEmbed from '@/components/DemoEmbed'
import ProductShot from '@/components/ProductShot'
import HeroVideo from '@/components/HeroVideo'
import TestimonialVideo from '@/components/TestimonialVideo'
import TrialButton from '@/components/TrialButton'
import TrackedLink from '@/components/TrackedLink'
import SectionViewMarker from '@/components/SectionViewMarker'
import { SITE_URL, CONTACT_EMAIL } from '@/lib/constants'
import { PRICING, ANNUAL_FREE_MONTHS, FOUNDERS, FOUNDERS_SEATS_LABEL, eur } from '@/lib/pricing'
import { CTA, DEMO_URL, TRIAL_MICROCOPY } from '@/lib/cta'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { claim } from '@/lib/verified-claims'

/**
 * Home.
 *
 * Arquitectura: hero → confianza → demo → Cerebro → operativa → caso → seguridad
 * → precio → fundadores → cierre. Una idea por sección y como mucho dos acciones.
 *
 * Lo que salió de aquí el 29-jul y por qué:
 * - La comparación CRM ocupaba una sección entera para decir una frase. Ahora es
 *   el titular del Cerebro VELIA.
 * - La sección de app móvil competía con el Cerebro y el precio. Va a /legal.
 * - Las cuatro cifras del caso piloto eran de captación de clientes, no de uso
 *   del software: el residuo exacto del modelo de agencia.
 */

/** Cuatro señales, no cinco. Solo se pinta lo que `verified-claims` autoriza. */
const CONFIANZA = [
  { k: 'Desarrollada en España', v: claim('developedInSpain') },
  { k: 'Fuentes oficiales', v: claim('officialSources') },
  { k: 'Información aislada', v: claim('tenantIsolation') },
  { k: 'Supervisión profesional', v: claim('humanSupervision') },
].filter((s): s is { k: string; v: string } => Boolean(s.v))

/** Tres capacidades. «Organiza» se retiró: lo cuenta la sección siguiente. */
const CEREBRO = [
  {
    title: 'Entiende',
    body: 'Utiliza la información disponible en el expediente para que no tengas que empezar de cero en cada consulta.',
  },
  {
    title: 'Analiza',
    body: 'Resume documentación, identifica información relevante y enlaza las fuentes oficiales cuando corresponde.',
  },
  {
    title: 'Prepara',
    body: 'Ayuda a estructurar escritos, informes, tareas y próximos pasos para que el profesional pueda revisar y decidir.',
  },
]

const MODULOS = [
  {
    title: 'Expedientes',
    body: 'Toda la información del asunto, desde los documentos y los plazos hasta el control económico.',
  },
  {
    title: 'Documentos e IA',
    body: 'Sube documentación, trabaja sobre ella con VELIA y conserva el resultado dentro del expediente.',
  },
  {
    title: 'Agenda y tareas',
    body: 'Organiza compromisos, propuestas de plazos, citas y trabajo pendiente.',
  },
  {
    title: 'Clientes y facturación',
    body: 'Mantén cada cliente conectado con sus asuntos, comunicaciones, cobros y facturas.',
  },
]

const INCLUIDO = [
  'Cerebro VELIA con fuentes oficiales',
  'Expedientes, clientes y contactos',
  'Documentos y redacción asistida',
  'Agenda, tareas y propuestas de plazos',
  'Portal del cliente',
  'Facturación y control económico',
  `${PRICING.usersIncluded} usuarios incluidos`,
  'Onboarding y soporte',
]

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VELIA',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    'Software jurídico con IA desarrollado en España: expedientes, clientes, documentos, plazos y facturación en una sola plataforma, con una asistente que trabaja con el contexto de cada asunto.',
  offers: [
    {
      '@type': 'Offer',
      price: String(PRICING.monthly),
      priceCurrency: PRICING.currency,
      description: `${eur(PRICING.monthly)}/mes por despacho con ${PRICING.usersIncluded} usuarios incluidos. Prueba gratis de ${PRICING.trialDays} días.`,
    },
    {
      '@type': 'Offer',
      price: String(PRICING.annualTotal),
      priceCurrency: PRICING.currency,
      description: `${eur(PRICING.annualTotal)}/año por despacho (${ANNUAL_FREE_MONTHS} meses gratis) con ${PRICING.usersIncluded} usuarios incluidos. Prueba gratis de ${PRICING.trialDays} días.`,
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

      {/* ── 1 · Hero ─────────────────────────────────────────────────────────
          El visual es el PRODUCTO, no material de archivo: la puesta al día real
          del Cerebro VELIA. Decisión del 29-jul, reversible con
          FEATURE_FLAGS.ENABLE_HERO_VIDEO. */}
      <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-20 pb-16 md:pb-20">
        <div className="max-w-3xl rise">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-6">
            Software jurídico con IA · Desarrollado en España
          </p>
          <h1 className="text-4xl md:text-[3.6rem] font-800 leading-[1.04] tracking-[-0.03em]">
            <span className="inline-block">Todo tu despacho.</span>{' '}
            <span className="inline-block">Con VELIA dentro.</span>
          </h1>
          <p className="mt-7 text-lg text-void/60 leading-relaxed max-w-[54ch]">
            Gestiona clientes, expedientes, documentos, plazos y facturación desde un solo
            lugar. VELIA trabaja con el contexto de cada asunto para ayudarte a analizar,
            redactar y mantener el despacho bajo control.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <TrialButton event="hero_trial_click" location="hero" />
            <TrackedLink
              href="/demo"
              event="hero_demo_click"
              className="btn border border-void/20 text-void text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:border-void/50 transition-colors"
            >
              {CTA.secondary.label}
            </TrackedLink>
          </div>
          <p className="mt-5 text-[13px] text-void/60">{TRIAL_MICROCOPY}</p>
        </div>

        <div className="mt-12 md:mt-16 rise">
          {FEATURE_FLAGS.ENABLE_HERO_VIDEO ? (
            <HeroVideo
              src="/api/hero-video"
              poster="/videos/hero-bufete-poster.jpg"
              ariaLabel="El día a día de un despacho de abogados: trabajo en equipo, revisión de documentos y firma de contratos"
            />
          ) : (
            <>
              {/* Se usa la lista de expedientes y no la puesta al día del Cerebro,
                  que sería la captura ideal: la del tenant de demostración dice
                  «sin vencimientos, nada pendiente, sin citas» y un hero que enseña
                  el producto vacío convence de lo contrario. Pendiente recapturarla
                  con datos; hasta entonces, esta enseña un despacho real trabajando
                  y la interacción con VELIA se cuenta en su propia sección. */}
              <ProductShot
                src="/screenshots/expedientes.webp"
                alt="Los expedientes de un despacho dentro de VELIA: cinco asuntos abiertos y en proceso con su área, su prioridad, el cliente y la fecha, y el resumen de abiertos, en proceso y vencidos arriba"
              />
              <p className="mt-3 text-[12px] text-void/60">
                Despacho de demostración con datos ficticios.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── 2 · Franja de confianza ──────────────────────────────────────── */}
      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
          <div className="grid gap-8 md:grid-cols-4">
            {CONFIANZA.map(s => (
              <div key={s.k}>
                <p className="text-sm font-700 leading-snug">{s.k}</p>
                <p className="mt-2 text-[13px] text-void/60 leading-[1.55]">{s.v}</p>
              </div>
            ))}
          </div>
          <Link
            href="/seguridad"
            className="inline-block mt-8 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
          >
            Ver seguridad y privacidad →
          </Link>
        </div>
      </section>

      {/* ── 3 · Demo real ────────────────────────────────────────────────── */}
      {FEATURE_FLAGS.ENABLE_INTERACTIVE_DEMO && (
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
              VELIA por dentro
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em]">
              <span className="inline-block">No te la contamos.</span>{' '}
              <span className="inline-block">Puedes entrar.</span>
            </h2>
            <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
              Explora un despacho ficticio dentro de la última versión de VELIA. Recorre
              expedientes, documentos, agenda, plazos y facturación sin registrarte y sin
              riesgo de modificar nada.
            </p>
          </div>
          <div className="mt-8">
            <DemoEmbed />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-void/60">Datos ficticios · Solo lectura · Sin registro</p>
            <TrackedLink
              href={DEMO_URL}
              event="demo_fullscreen_open"
              className="text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors whitespace-nowrap"
            >
              Abrir demo interactiva →
            </TrackedLink>
          </div>
        </section>
      )}

      {/* ── 4 · Cerebro VELIA ────────────────────────────────────────────── */}
      <section id="cerebro" className="bg-void text-cream scroll-mt-16">
        <SectionViewMarker event="brain_section_view" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold/85 mb-4">
                El Cerebro VELIA
              </p>
              <h2 className="text-3xl md:text-4xl font-800 tracking-[-0.02em] max-w-[20ch]">
                <span className="inline-block">Un CRM guarda información.</span>{' '}
                <span className="inline-block text-cream/60">VELIA te ayuda a trabajar con ella.</span>
              </h2>
              <p className="mt-6 text-sm text-cream/60 leading-[1.6] max-w-prose">
                VELIA entiende el contexto disponible en cada asunto. Relaciona clientes,
                expedientes, documentos, tareas y plazos para ayudarte a encontrar información,
                preparar trabajo y decidir qué necesita tu atención.
              </p>
              <p className="mt-7 text-lg md:text-xl font-700 tracking-[-0.01em] text-cream/90">
                <span className="inline-block">VELIA prepara.</span>{' '}
                <span className="inline-block">Tú decides.</span>
              </p>
            </div>

            {/* La secuencia real: entra un documento → VELIA lo analiza → detecta →
                propone → pide confirmación → decide el abogado. */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3 mb-5">
                <VeliaBrain state="active" className="w-9 h-9 text-gold shrink-0" />
                <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-gold/85">
                  VELIA · trabajando
                </p>
              </div>
              <ol className="space-y-3">
                {[
                  'Entra un documento en el expediente.',
                  'VELIA lo lee y lo relaciona con el asunto.',
                  'Detecta una fecha que podría ser un vencimiento.',
                ].map((paso, i) => (
                  <li key={paso} className="flex gap-3 text-[13px] text-cream/55 leading-[1.5]">
                    <span className="text-gold/85 font-700 shrink-0">{i + 1}</span>
                    {paso}
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-xl bg-white/5 border border-white/10 px-4 py-3.5">
                <p className="text-cream/85 text-[13px] leading-relaxed">
                  He encontrado un posible vencimiento en este documento. ¿Quieres revisar el
                  cálculo antes de añadirlo a la agenda?
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="rounded-full bg-gold text-void px-4 py-1.5 text-[11px] font-700 tracking-[0.06em] uppercase">
                  Revisar
                </span>
                <span className="rounded-full border border-white/15 text-cream/60 px-4 py-1.5 text-[11px] font-700 tracking-[0.06em] uppercase">
                  Descartar
                </span>
              </div>
              <p className="mt-4 text-[12px] text-cream/55">
                La decisión es siempre del abogado.
              </p>
            </div>
          </div>

          <div className="mt-14 md:mt-20 border-t border-white/10 pt-10 md:pt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {CEREBRO.map(c => (
              <div key={c.title}>
                <h3 className="text-sm font-700 text-gold-light mb-2.5">{c.title}</h3>
                <p className="text-[13px] text-cream/55 leading-[1.6]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 · Operativa centralizada ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionViewMarker event="product_section_view" />
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em]">
            <span className="inline-block">Todo el despacho.</span>{' '}
            <span className="inline-block">Un único lugar.</span>
          </h2>
          <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
            Clientes, asuntos, documentación, agenda, facturación y comunicación trabajan
            dentro del mismo sistema.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <ProductShot
            src="/screenshots/expediente-detalle.webp"
            alt="Un expediente abierto en VELIA con sus documentos, los plazos asociados, las tareas pendientes y el control económico del asunto en la misma pantalla"
          />
          <div className="grid gap-7">
            {MODULOS.map(m => (
              <div key={m.title}>
                <h3 className="text-sm font-700 mb-1.5">{m.title}</h3>
                <p className="text-[13px] text-void/60 leading-[1.6]">{m.body}</p>
              </div>
            ))}
            <TrackedLink
              href="/legal"
              event="product_detail_click"
              className="text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
            >
              Ver todas las funciones →
            </TrackedLink>
          </div>
        </div>
      </section>

      {/* ── 6 · Validación con un despacho real ──────────────────────────── */}
      {FEATURE_FLAGS.ENABLE_CUSTOMER_CASE && (
        <section className="bg-white border-y border-void/10">
          <SectionViewMarker event="case_study_view" />
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="max-w-3xl">
              <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
                Probada en un despacho real
              </p>
              <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em]">
                <span className="inline-block">VELIA no se diseñó en una presentación.</span>{' '}
                <span className="inline-block text-void/60">Se construyó trabajando con abogados.</span>
              </h2>
              <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
                Cónsul Jurídico utiliza VELIA en su operativa diaria para centralizar
                expedientes, documentación, comunicaciones y trabajo pendiente.
              </p>
            </div>

            {/* Testimonio cualitativo mientras no existan métricas de USO del
                producto auditables. Las cifras anteriores eran de captación de
                clientes: ver CLAIMS.pilotMetrics. */}
            <figure className="mt-10 max-w-3xl">
              <blockquote className="text-xl md:text-2xl font-600 leading-[1.45] tracking-[-0.01em] text-void/85">
                «Ahora puedo entrar en un asunto y encontrar la información, los documentos y
                las tareas en un mismo lugar. VELIA ha pasado a formar parte del trabajo diario
                del despacho.»
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-[13px] text-void/60">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                <span>
                  <strong className="font-700 text-void/80">Iván Cónsul</strong> · Cónsul Jurídico,
                  Fraga (Huesca) ·{' '}
                  <a
                    href="https://consuljuridico.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-void/25 hover:decoration-void"
                  >
                    consuljuridico.com
                  </a>
                </span>
              </figcaption>
            </figure>

            <TrackedLink
              href="/legal"
              event="product_detail_click"
              properties={{ cta_location: 'case_study' }}
              className="inline-block mt-8 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
            >
              Ver cómo trabaja un despacho con VELIA →
            </TrackedLink>
          </div>
        </section>
      )}

      {/* Testimonio en vídeo del piloto. Se pinta solo cuando exista el máster
          (TESTIMONIAL_VIDEO.enabled en lib/constants.ts); hasta entonces vale la
          cita de arriba. */}
      <TestimonialVideo />

      {/* ── 7 · Seguridad y confianza ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/60 mb-3">
            Seguridad y control
          </p>
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em]">
            Construida para trabajar con información confidencial.
          </h2>
          <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
            La arquitectura de VELIA parte de una premisa: los datos pertenecen al despacho y
            el criterio pertenece al abogado.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-700 mb-2">Información separada por despacho</h3>
            <p className="text-[13px] text-void/60 leading-[1.6]">{claim('tenantIsolation')}</p>
          </div>
          <div>
            <h3 className="text-sm font-700 mb-2">Fuentes oficiales verificables</h3>
            <p className="text-[13px] text-void/60 leading-[1.6]">{claim('officialSources')}</p>
          </div>
          <div>
            <h3 className="text-sm font-700 mb-2">Supervisión profesional</h3>
            <p className="text-[13px] text-void/60 leading-[1.6]">{claim('humanSupervision')}</p>
          </div>
        </div>
        <TrackedLink
          href="/seguridad"
          event="security_click"
          className="btn inline-block mt-10 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
        >
          Ver seguridad al detalle
        </TrackedLink>
      </section>

      {/* ── 8 · Precio ───────────────────────────────────────────────────── */}
      <section className="bg-void text-cream">
        <SectionViewMarker event="pricing_section_view" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em]">
                Un precio. Todo VELIA.
              </h2>
              <p className="mt-5 text-sm text-cream/55 leading-[1.6] max-w-prose">
                CRM, inteligencia jurídica, portal del cliente, facturación y soporte dentro de
                una única suscripción.
              </p>
              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 max-w-2xl">
                {INCLUIDO.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-cream/70 leading-[1.5]">
                    <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:text-right">
              <p className="text-5xl md:text-6xl font-800 tracking-[-0.03em] whitespace-nowrap">
                {eur(PRICING.monthly)}
                <span className="text-xl font-600 text-cream/55">/mes</span>
              </p>
              <p className="mt-2 text-[13px] text-cream/55">
                + IVA · por despacho · {PRICING.usersIncluded} usuarios incluidos
              </p>
              <p className="mt-1 text-[13px] text-gold-light">
                En anual, {ANNUAL_FREE_MONTHS} meses gratis
              </p>
              <div className="mt-7 flex flex-wrap gap-3 md:justify-end">
                <TrialButton event="pricing_trial_click" location="home_pricing" variant="onDark" />
              </div>
              <p className="mt-4 text-[12px] text-cream/55">
                {PRICING.trialDays} días gratis · Sin tarjeta
              </p>
              <Link
                href="/precios"
                className="inline-block mt-5 text-[12px] font-700 tracking-[0.1em] uppercase text-cream/60 hover:text-cream transition-colors"
              >
                Ver condiciones y preguntas →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9 · Programa Fundadores ──────────────────────────────────────── */}
      {FEATURE_FLAGS.ENABLE_FOUNDERS_PROGRAM && (
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <SectionViewMarker event="founders_view" />
          <div className="rounded-3xl border border-gold/40 bg-gold/[0.07] px-8 py-10 md:px-12 md:py-14">
            <div className="grid gap-8 md:grid-cols-[1.2fr_auto] md:items-end">
              <div>
                <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
                  Programa Fundadores
                </p>
                <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[24ch]">
                  Entra en la primera generación de despachos VELIA.
                </h2>
                <p className="mt-4 text-sm text-void/65 leading-[1.6] max-w-prose">
                  Los primeros despachos que contraten la modalidad anual mantienen el precio
                  de lanzamiento mientras su suscripción permanezca activa y acceden a una web
                  premium de lanzamiento.
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2 max-w-2xl">
                  {[
                    'Precio de lanzamiento protegido',
                    'Web premium incluida con la modalidad anual',
                    'Onboarding prioritario',
                    'Canal directo de feedback',
                  ].map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-[13px] text-void/70 leading-[1.5]">
                      <span className="text-gold-ink mt-0.5 shrink-0" aria-hidden="true">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:text-right">
                <p className="text-[12px] font-700 tracking-[0.08em] uppercase text-gold-ink whitespace-nowrap">
                  {FOUNDERS_SEATS_LABEL} disponibles
                </p>
                <div className="mt-4">
                  <TrialButton event="founders_trial_click" location="home_founders" />
                </div>
                <TrackedLink
                  href="/fundadores"
                  event="founders_terms_click"
                  className="inline-block mt-4 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
                >
                  Ver condiciones →
                </TrackedLink>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 10 · CTA final ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-3xl bg-void text-cream px-8 py-14 md:py-20 text-center">
          <p className="text-[13px] text-gold-light mb-6">Cuando estés preparado, empezamos.</p>
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[24ch] mx-auto">
            Descubre cómo trabaja VELIA con tu despacho.
          </h2>
          <p className="mt-5 text-sm text-cream/60 max-w-[52ch] mx-auto leading-relaxed">
            Configura tu espacio, añade el contexto de tu actividad y prueba la plataforma
            durante {PRICING.trialDays} días.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <TrialButton event="final_trial_click" location="final" variant="onDark" />
            <TrackedLink
              href="/demo"
              event="final_demo_click"
              className="btn border border-white/25 text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:border-white/50 transition-colors"
            >
              {CTA.secondary.label}
            </TrackedLink>
          </div>
          <p className="mt-5 text-[12px] text-cream/55">Sin tarjeta · Sin compromiso durante la prueba</p>
        </div>
      </section>

      {/* Bufetes grandes: presente, pero nunca al mismo nivel visual que el plan. */}
      {FEATURE_FLAGS.ENABLE_ENTERPRISE_CONTACT && (
        <section className="mx-auto max-w-6xl px-6 pt-10">
          <p className="text-[13px] text-void/60 text-center">
            ¿Tu despacho necesita migraciones, integraciones o una implantación personalizada?{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-700 text-gold-ink hover:text-void transition-colors underline decoration-gold-ink/30"
            >
              {CTA.tertiary.label}
            </a>
          </p>
        </section>
      )}

      {/* La sección propia de app móvil salió de la home el 29-jul: competía en
          peso visual con el Cerebro VELIA y con el precio. La capacidad se cuenta
          en /legal, y el enlace de instalación sigue en el footer. */}
    </>
  )
}
