import Link from 'next/link'
import DemoEmbed from '@/components/DemoEmbed'
import ProductShot from '@/components/ProductShot'
import HeroVideo from '@/components/HeroVideo'
import TestimonialVideo from '@/components/TestimonialVideo'
import TrialButton from '@/components/TrialButton'
import TrackedLink from '@/components/TrackedLink'
import SectionViewMarker from '@/components/SectionViewMarker'
import Reveal from '@/components/Reveal'
import IrisNode from '@/components/IrisNode'
import HeroContextStage from '@/components/HeroContextStage'
import ContextMap from '@/components/ContextMap'
import BrainStateTabs from '@/components/BrainStateTabs'
import DayWithVelia from '@/components/DayWithVelia'
import CaseStudyToggle from '@/components/CaseStudyToggle'
import SecurityArchitecture from '@/components/SecurityArchitecture'
import PricingSelector from '@/components/PricingSelector'
import { SITE_URL, CONTACT_EMAIL } from '@/lib/constants'
import { PRICING, ANNUAL_FREE_MONTHS, FOUNDERS_SEATS_LABEL, eur } from '@/lib/pricing'
import { CTA, DEMO_URL, TRIAL_MICROCOPY } from '@/lib/cta'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { claim } from '@/lib/verified-claims'

/**
 * Home — dirección «Quiet Intelligence in Motion» (1-ago-2026).
 *
 * LO QUE CAMBIA respecto a la versión anterior no es el mensaje: es que la
 * página lo DEMUESTRA en vez de afirmarlo. Antes, las diez secciones tenían la
 * misma forma (contenedor, titular, párrafo, rejilla) y la única capacidad
 * diferencial del producto —que VELIA trabaja con el contexto del asunto— se
 * contaba con una lista de tres frases dentro de una tarjeta estática.
 *
 * RITMO. El fondo cambia cuando cambia lo que se está contando, nunca por
 * alternar:
 *   oscuro   hero            · VELIA trabajando, de verdad, delante de ti
 *   claro    confianza       · una franja fina, no una sección
 *   claro    mapa            · lo que VELIA ve cuando abres un asunto
 *   OSCURO   Cerebro         · el corte: aquí se entra en la inteligencia
 *   claro    la jornada      · la vuelta al despacho y su día
 *   claro    producto/demo   · el software real, tocable
 *   blanco   caso            · el contraste editorial de la prueba
 *   OSCURO   seguridad       · el segundo corte: aquí se habla de secretos
 *   claro    precio          · la decisión, sin dramatismo
 *   OSCURO   cierre          · la firma
 *
 * DOS ACCIONES EN TODA LA PÁGINA: «Probar VELIA gratis» y «Ver demo
 * interactiva». Cualquier tercera compite con las dos que convierten.
 *
 * Cada pieza interactiva está tras su bandera y al apagarla queda su equivalente
 * estático — nunca un hueco.
 */

/** Cuatro señales. Solo se pinta lo que `verified-claims` autoriza. */
const CONFIANZA = [
  { k: 'Desarrollada en España', v: claim('developedInSpain') },
  { k: 'Fuentes oficiales', v: claim('officialSources') },
  { k: 'Información aislada', v: claim('tenantIsolation') },
  { k: 'Supervisión profesional', v: claim('humanSupervision') },
].filter((s): s is { k: string; v: string } => Boolean(s.v))

/** Los cinco módulos. Sustituyen a cualquier listado largo de funcionalidades:
 *  una frase de beneficio por módulo, nunca una enumeración de campos. */
const MODULOS = [
  { title: 'Expedientes', body: 'Cada asunto con sus partes, su estado, su documentación y su economía en el mismo sitio.' },
  { title: 'Documentos', body: 'Sube la documentación, trabaja sobre ella con VELIA y conserva el resultado dentro del expediente.' },
  { title: 'Plazos y agenda', body: 'VELIA propone el cómputo con su cita textual; el vencimiento entra en la agenda cuando lo apruebas.' },
  { title: 'Clientes y portal', body: 'El cliente entra en su portal, ve el estado de su asunto y aporta lo que falta sin llamar por teléfono.' },
  { title: 'Facturación', body: 'Honorarios, cobros y facturas enlazados al asunto que los ha generado.' },
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

      {/* ════════════════════════════════════════════════════════════════════
          1 · HERO — oscuro, cinematográfico
          `data-hero="dark"` es lo que lee el header para saber que arranca
          sobre tinta oscura. No una lista de rutas: el DOM ya lo sabe.
          `-mt-16` mete el hero DEBAJO del header sticky, que es transparente
          hasta el primer scroll: sin esto quedaría una banda clara arriba.
         ════════════════════════════════════════════════════════════════════ */}
      <section
        data-hero="dark"
        className="velia-dark-stage relative -mt-16 pt-16 bg-void text-cream overflow-hidden"
      >
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28 md:min-h-[92vh] flex items-center">
          <div className="grid gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:items-center w-full">
            <div className="rise">
              {/* El «· Desarrollado en España» solo desde sm: a 390 px la línea
                  entera parte en dos y un eyebrow de dos líneas deja de leerse
                  como etiqueta y empieza a competir con el titular. El dato no
                  se pierde — está en la franja de confianza, justo debajo. */}
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85 mb-6">
                Software jurídico con IA
                <span className="hidden sm:inline"> · Desarrollado en España</span>
              </p>
              {/* Una sola intervención editorial, no dos: Instrument Serif en
                  «dentro». Poner además el Iris en «VELIA» sería competir con
                  el propio recurso y ninguna de las dos se leería como decisión. */}
              <h1 className="text-[2.6rem] leading-[1.06] sm:text-5xl md:text-[4rem] md:leading-[1.04] font-500 tracking-[-0.04em]">
                <span className="inline-block">Todo tu despacho.</span>{' '}
                <span className="inline-block">
                  Con VELIA <em className="font-serif not-italic font-400">dentro</em>.
                </span>
              </h1>
              <p className="mt-7 text-[17px] md:text-[19px] text-cream/70 leading-[1.6] max-w-[46ch]">
                Clientes, expedientes, documentos, plazos y facturación en una sola plataforma.
                VELIA entiende el contexto de cada asunto y prepara el trabajo para que tú decidas.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <TrialButton event="hero_trial_click" location="hero" variant="onDark" />
                <TrackedLink
                  href="/demo"
                  event="hero_demo_click"
                  className="btn border border-white/25 text-cream text-[12px] font-600 tracking-[0.04em] rounded-full px-7 py-3.5 hover:border-white/50 transition-colors duration-control"
                >
                  {CTA.secondary.label}
                </TrackedLink>
              </div>
              <p className="mt-5 text-[13px] text-cream/55">{TRIAL_MICROCOPY}</p>
            </div>

            <div className="rise">
              {FEATURE_FLAGS.ENABLE_INTERACTIVE_HERO ? (
                <HeroContextStage />
              ) : FEATURE_FLAGS.ENABLE_HERO_VIDEO ? (
                <HeroVideo
                  src="/api/hero-video"
                  poster="/videos/hero-bufete-poster.jpg"
                  ariaLabel="El día a día de un despacho de abogados"
                />
              ) : (
                <ProductShot
                  src="/screenshots/expedientes.webp"
                  alt="Los expedientes de un despacho dentro de VELIA, con su área, prioridad, cliente y fecha"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════ 2 · Franja de confianza — una línea, no una sección ═══════════ */}
      <section className="bg-white border-b border-mist">
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {CONFIANZA.map(s => (
              <li key={s.k} className="flex items-start gap-2.5">
                <span className="mt-[7px] w-1 h-1 rounded-full bg-iris-focus shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[13px] font-600 leading-snug">{s.k}</p>
                  <p className="mt-1 text-[12px] text-void/60 leading-[1.5]">{s.v}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/seguridad"
            className="inline-block mt-7 text-[12px] font-600 tracking-[0.02em] text-gold-ink hover:text-void transition-colors duration-control"
          >
            Ver seguridad y privacidad →
          </Link>
        </div>
      </section>

      {/* ════ 3 · Mapa de contexto — claro ══════════════════════════════════ */}
      {FEATURE_FLAGS.ENABLE_CONTEXT_MAP && (
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <ContextMap />
          </Reveal>
        </section>
      )}

      {/* ════ 4 · Cerebro VELIA — OSCURO. Aquí entra la inteligencia ════════ */}
      <section id="cerebro" className="velia-dark-stage bg-void text-cream scroll-mt-16">
        <SectionViewMarker event="brain_section_view" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85 mb-4">
              El Cerebro VELIA
            </p>
            <h2 className="text-3xl md:text-[2.75rem] md:leading-[1.1] font-500 tracking-[-0.03em]">
              No es un chatbot dentro de un CRM.
            </h2>
            <p className="mt-4 text-xl md:text-2xl font-serif text-cream/60 leading-[1.35]">
              Es la inteligencia que vive dentro del despacho.
            </p>
          </Reveal>

          <Reveal className="mt-12 md:mt-14">
            <BrainStateTabs />
          </Reveal>

          {/* La frase de marca. Mucho espacio y mucha jerarquía a propósito:
              es la promesa entera del producto en cuatro palabras. */}
          <Reveal className="mt-20 md:mt-28 text-center">
            <IrisNode state="esperando" className="w-12 h-12 text-cream mx-auto mb-7" />
            <p className="text-3xl md:text-5xl font-serif tracking-[-0.02em] text-cream">
              VELIA prepara. Tú decides.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ 5 · Un día con VELIA — claro ══════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionViewMarker event="product_section_view" />
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-3">
            Un día con VELIA
          </p>
          <h2 className="text-3xl md:text-4xl font-600 tracking-[-0.03em]">
            Así se nota en la jornada.
          </h2>
          <p className="mt-4 text-[15px] text-void/70 leading-[1.6] max-w-[48ch]">
            No una lista de funciones: cinco momentos de un día cualquiera en el despacho.
          </p>
        </Reveal>

        <div className="mt-12 md:mt-16">
          {FEATURE_FLAGS.ENABLE_DAY_TIMELINE ? (
            <DayWithVelia />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {MODULOS.map(m => (
                <div key={m.title}>
                  <h3 className="text-sm font-600 mb-1.5">{m.title}</h3>
                  <p className="text-[13px] text-void/65 leading-[1.6]">{m.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ 6 · Producto real y demo — Pearl Cloud ════════════════════════ */}
      {FEATURE_FLAGS.ENABLE_INTERACTIVE_DEMO && (
        <section className="bg-cream border-y border-mist">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <Reveal className="max-w-2xl">
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-3">
                VELIA por dentro
              </p>
              <h2 className="text-3xl md:text-4xl font-600 tracking-[-0.03em]">
                No te la contamos. Puedes entrar.
              </h2>
              <p className="mt-4 text-[15px] text-void/70 leading-[1.6] max-w-[48ch]">
                Explora un despacho ficticio en la última versión de VELIA, sin registro y en modo
                de solo lectura.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <DemoEmbed />
            </Reveal>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-void/60">Datos ficticios · Solo lectura · Sin registro</p>
              <TrackedLink
                href={DEMO_URL}
                event="demo_fullscreen_open"
                className="text-[12px] font-600 tracking-[0.02em] text-gold-ink hover:text-void transition-colors duration-control whitespace-nowrap"
              >
                Abrir demo interactiva →
              </TrackedLink>
            </div>

            {/* Los cinco módulos, con la captura del expediente al lado. */}
            <div className="mt-16 md:mt-20 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <Reveal>
                <ProductShot
                  src="/screenshots/expediente-detalle.webp"
                  alt="Un expediente abierto en VELIA con sus documentos, plazos, tareas pendientes y el control económico del asunto en la misma pantalla"
                />
              </Reveal>
              <Reveal className="grid gap-6">
                {MODULOS.map(m => (
                  <div key={m.title} className="border-t border-mist pt-5">
                    <h3 className="text-sm font-600 mb-1.5">{m.title}</h3>
                    <p className="text-[13px] text-void/65 leading-[1.6] max-w-[46ch]">{m.body}</p>
                  </div>
                ))}
                <TrackedLink
                  href="/legal"
                  event="product_detail_click"
                  className="text-[12px] font-600 tracking-[0.02em] text-gold-ink hover:text-void transition-colors duration-control"
                >
                  Ver todas las funciones →
                </TrackedLink>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ════ 7 · Caso real — blanco, contraste editorial ═══════════════════ */}
      {FEATURE_FLAGS.ENABLE_CUSTOMER_CASE && (
        <section className="bg-white">
          <SectionViewMarker event="case_study_view" />
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <Reveal className="max-w-3xl">
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-3">
                Probada en un despacho real
              </p>
              <h2 className="text-3xl md:text-4xl font-600 tracking-[-0.03em]">
                Construida trabajando, no imaginando.
              </h2>
              <p className="mt-5 text-[15px] text-void/70 leading-[1.6] max-w-[52ch]">
                Cónsul Jurídico utiliza VELIA para centralizar expedientes, documentación,
                comunicaciones y trabajo pendiente.
              </p>
            </Reveal>

            <Reveal className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-start">
              <figure>
                <blockquote className="text-xl md:text-2xl font-serif leading-[1.4] text-void/85">
                  «Ahora puedo entrar en un asunto y encontrar la información, los documentos y las
                  tareas en un mismo lugar. VELIA ha pasado a formar parte del trabajo diario del
                  despacho.»
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-[13px] text-void/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-iris-focus shrink-0" />
                  <span>
                    <strong className="font-600 text-void/85">Iván Cónsul</strong> · Cónsul Jurídico,
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

              {FEATURE_FLAGS.ENABLE_BEFORE_AFTER && <CaseStudyToggle />}
            </Reveal>
          </div>
        </section>
      )}

      <TestimonialVideo />

      {/* ════ 8 · Seguridad — OSCURO ════════════════════════════════════════ */}
      <section className="velia-dark-stage bg-void text-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <SecurityArchitecture />
          </Reveal>
          <Reveal className="mt-12">
            <TrackedLink
              href="/seguridad"
              event="security_click"
              className="btn inline-block bg-gold-dark text-white text-[12px] font-600 tracking-[0.04em] rounded-full px-7 py-3.5 hover:opacity-90"
            >
              Ver seguridad al detalle
            </TrackedLink>
          </Reveal>
        </div>
      </section>

      {/* ════ 9 · Precio — claro ════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionViewMarker event="pricing_section_view" />
        <Reveal>
          {FEATURE_FLAGS.ENABLE_PRICING_SELECTOR ? (
            <PricingSelector />
          ) : (
            <div className="rounded-3xl border border-mist bg-white px-6 py-10 sm:px-10">
              <h2 className="text-3xl md:text-4xl font-600 tracking-[-0.03em]">Un precio. Todo VELIA.</h2>
              <p className="tabular mt-6 text-5xl font-600 tracking-[-0.04em]">
                {eur(PRICING.monthly)}
                <span className="text-xl font-500 text-void/50">/mes</span>
              </p>
              <div className="mt-7">
                <TrialButton event="pricing_trial_click" location="home_pricing" />
              </div>
            </div>
          )}
        </Reveal>

        <Reveal className="mt-6 text-center">
          <Link
            href="/precios"
            className="text-[12px] font-600 tracking-[0.02em] text-void/60 hover:text-void transition-colors duration-control"
          >
            Ver condiciones y preguntas frecuentes →
          </Link>
        </Reveal>
      </section>

      {/* ════ 10 · Programa Fundadores — banda editorial, nunca compitiendo ══ */}
      {FEATURE_FLAGS.ENABLE_FOUNDERS_PROGRAM && (
        <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-24">
          <SectionViewMarker event="founders_view" />
          <Reveal className="rounded-2xl border border-iris-focus/25 bg-iris-focus/[0.06] px-7 py-8 md:px-10 md:py-9">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-2.5">
                  Programa Fundadores · {FOUNDERS_SEATS_LABEL}
                </p>
                <h2 className="text-xl md:text-2xl font-600 tracking-[-0.02em] max-w-[30ch]">
                  Entra en la primera generación de despachos VELIA.
                </h2>
                <p className="mt-3 text-[13px] text-void/70 leading-[1.6] max-w-[62ch]">
                  Los primeros despachos que contraten la modalidad anual mantienen el precio de
                  lanzamiento mientras su suscripción siga activa, y acceden a una web premium y a
                  onboarding prioritario.
                </p>
              </div>
              <TrackedLink
                href="/fundadores"
                event="founders_terms_click"
                className="text-[12px] font-600 tracking-[0.02em] text-gold-ink hover:text-void transition-colors duration-control whitespace-nowrap"
              >
                Ver condiciones →
              </TrackedLink>
            </div>
          </Reveal>
        </section>
      )}

      {/* ════ 11 · Cierre — OSCURO. La firma ════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="velia-dark-stage rounded-3xl bg-void text-cream px-8 py-16 md:py-24 text-center overflow-hidden">
          <IrisNode state="reposo" className="w-12 h-12 text-cream mx-auto mb-8" />
          <p className="text-[15px] font-serif text-cream/60 mb-6">
            Cuando estés preparado, empezamos.
          </p>
          <h2 className="text-3xl md:text-[2.75rem] md:leading-[1.1] font-500 tracking-[-0.03em] max-w-[22ch] mx-auto">
            Descubre cómo trabaja VELIA con tu despacho.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <TrialButton event="final_trial_click" location="final" variant="onDark" />
            <TrackedLink
              href="/demo"
              event="final_demo_click"
              className="btn border border-white/25 text-cream text-[12px] font-600 tracking-[0.04em] rounded-full px-7 py-3.5 hover:border-white/50 transition-colors duration-control"
            >
              {CTA.secondary.label}
            </TrackedLink>
          </div>
          <p className="mt-5 text-[12px] text-cream/55">
            {PRICING.trialDays} días · Sin tarjeta · Sin compromiso durante la prueba
          </p>
        </div>
      </section>

      {/* Bufetes grandes: presente, nunca al mismo nivel visual que el plan. */}
      {FEATURE_FLAGS.ENABLE_ENTERPRISE_CONTACT && (
        <section className="mx-auto max-w-6xl px-6 pt-10">
          <p className="text-[13px] text-void/60 text-center">
            ¿Tu despacho necesita migraciones, integraciones o una implantación personalizada?{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-600 text-gold-ink hover:text-void transition-colors underline decoration-gold-ink/30"
            >
              {CTA.tertiary.label}
            </a>
          </p>
        </section>
      )}
    </>
  )
}
