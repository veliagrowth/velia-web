import Link from 'next/link'
import TestimonialVideo from '@/components/TestimonialVideo'
import VeliaBrain from '@/components/VeliaBrain'
import HeroVideo from '@/components/HeroVideo'
import DemoEmbed from '@/components/DemoEmbed'
import PhoneShot from '@/components/PhoneShot'
import TrackedLink from '@/components/TrackedLink'
import SectionViewMarker from '@/components/SectionViewMarker'
import { FOUNDERS_SEATS_LABEL, APP_URL, SITE_URL } from '@/lib/constants'
import { PRICING, ANNUAL_FREE_MONTHS, eur } from '@/lib/pricing'

// Señales de confianza que un abogado escanea en segundos (strip bajo el hero).
const TRUST = [
  { k: 'Cita el BOE, con enlace', v: 'Texto oficial artículo por artículo. Si no lo encuentra, lo dice — nunca se lo inventa.' },
  { k: 'Tus datos no entrenan ninguna IA', v: 'Por contrato con el proveedor de la IA, no es una promesa nuestra.' },
  { k: 'Alojado en la Unión Europea', v: 'Cifrado y aislado por despacho (RLS). El secreto profesional guía la arquitectura.' },
  { k: 'Facturación Verifactu', v: 'Minutas y facturas conforme a la normativa española, desde el expediente.' },
  { k: 'Hecho en España', v: 'Entiende el BOE, la LEC y Verifactu porque nació para ellos. No es software traducido.' },
]

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
              Clientes, expedientes, plazos, escritos con IA y{' '}
              <span className="whitespace-nowrap">facturación Verifactu</span> — en un solo
              sitio, en una sola suscripción.{' '}
              <span className="inline-block">Del abogado independiente al gran bufete.</span>
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <TrackedLink
                href={`${APP_URL}/prueba-velia`}
                event="hero_trial_click"
                className="btn bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
              >
                Prueba VELIA gratis
              </TrackedLink>
              <Link
                href="/demo"
                className="btn border border-void/20 text-void text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:border-void/50 transition-colors"
              >
                Ver VELIA en acción
              </Link>
            </div>
          </div>

          {/* Vídeo en bucle del DÍA A DÍA DE UN BUFETE (decisión Joaquín
              24-jul): abogados trabajando → firma de contratos → trabajo con
              portátil. Clips Mixkit (licencia libre), recorte central 4:3 y
              fundidos a negro. NO usar capturas del producto aquí: quedan mal
              en el hero y el producto ya se enseña más abajo y en /demo.
              Bucle permanente sin controles. h264 Main + yuv420p (compat iOS). */}
          <div className="rise">
            {/* -v2: el objeto anterior quedó cacheado en Cloudflare comprimido con gzip
                y SIN soporte de rangos (por eso iOS no lo reproducía). El origen ya lo
                sirve bien, pero el edge seguía entregando su copia vieja al revalidar
                con 304 → nombre nuevo = entrada de caché nueva. */}
            <HeroVideo
              src="/videos/hero-bufete-v2.mp4"
              poster="/videos/hero-bufete-poster.jpg"
              ariaLabel="El día a día de un despacho de abogados: trabajo en equipo, revisión de documentos y firma de contratos"
            />
          </div>
        </div>

        {/* Strip de confianza — lo que un abogado necesita ver en 3 segundos.
            Móvil: carrusel deslizable (pan-x, sin scrollbar). Escritorio: fila. */}
        <div className="mt-12 md:mt-16 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [touch-action:pan-x] md:grid md:grid-cols-5 md:overflow-visible">
            {TRUST.map(t => (
              <div key={t.k} className="snap-start shrink-0 w-[78%] sm:w-[46%] md:w-auto rounded-2xl border border-void/10 bg-white px-5 py-5">
                <p className="text-sm font-700 leading-snug">{t.k}</p>
                <p className="mt-2 text-[13px] text-void/55 leading-[1.55]">{t.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo EN VIVO — el producto real, aquí mismo ─────────────────────
          "No es otra herramienta: es el sistema operativo del despacho." Se ve
          en la home, no escondida en /demo. El iframe se carga al llegar. */}
      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
              VELIA por dentro, sin registro
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
              <span className="inline-block">No es otra herramienta.</span>{' '}
              <span className="inline-block">Es el sistema operativo del despacho.</span>
            </h2>
            <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
              Esto no es un vídeo ni son capturas: es VELIA de verdad, con un despacho de
              demostración dentro. Toca donde quieras — expedientes, plazos, agenda,
              facturación. No puedes romper nada.
            </p>
          </div>
          <div className="mt-8">
            <DemoEmbed />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-void/50">Despacho ficticio · datos inventados · solo lectura.</p>
            <a
              href="https://demo.app.veliacorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors whitespace-nowrap"
            >
              Abrir a pantalla completa →
            </a>
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

          <div className="mt-14 md:mt-20 border-t border-white/10 pt-10 md:pt-12 -mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [touch-action:pan-x] md:grid md:grid-cols-4 md:gap-x-10 md:overflow-visible">
              {BRAIN_CAPABILITIES.map(c => (
                <div key={c.title} className="snap-start shrink-0 w-[74%] sm:w-[44%] md:w-auto">
                  <h3 className="text-sm font-700 text-gold-light mb-2.5">{c.title}</h3>
                  <p className="text-[13px] text-cream/55 leading-[1.6]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-12 text-lg md:text-xl font-700 tracking-[-0.01em] text-cream/90 max-w-[26ch] text-balance">
            <span className="inline-block">VELIA prepara.</span>{' '}
            <span className="inline-block">Tú supervisas y decides.</span>
          </p>
        </div>
      </section>

      {/* ── Caso real ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
              Un despacho real, no un caso de laboratorio
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
              Sin web, sin sistema, sin captación. 60 días después:
            </h2>
            <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
              Cónsul Jurídico opera hoy entero sobre VELIA: los clientes llegan, la
              documentación se persigue sola y cada consulta queda en su expediente.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
              <p className="text-[13px] text-void/70">
                <strong className="font-700">Cónsul Jurídico</strong> · Fraga, Huesca ·{' '}
                <a href="https://consuljuridico.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-void">consuljuridico.com</a>
              </p>
            </div>
            <Link
              href="/legal"
              className="inline-block mt-7 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
            >
              Ver un día completo con VELIA →
            </Link>
          </div>
          {/* Solo cifras REALES y documentadas de Cónsul Jurídico (velia-chat es
             la fuente): +260% consultas, <5 min de respuesta, 12 h/semana
             recuperadas, <60 días. Se retiraron "+85% nuevos clientes" y
             "−70% tiempo en gestión" (sin respaldo en ningún sitio) — el brief
             de Axel §29 prohíbe métricas no verificadas. */}
          <dl className="grid grid-cols-2 gap-px bg-void/10 border border-void/10 rounded-2xl overflow-hidden">
            {[
              { n: '+260%', d: 'consultas captadas al mes' },
              { n: '<5 min', d: 'en responder cada consulta' },
              { n: '12 h', d: 'recuperadas cada semana' },
              { n: '<60', d: 'días hasta los primeros resultados' },
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
          {/* Cada frase entera o baja entera (regla de frases inseparables): con solo
              text-wrap:balance el titular partía "Los CRM guardan / información." */}
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
            <span className="inline-block">Los CRM guardan información.</span>{' '}
            <span className="inline-block text-void/60">VELIA te ayuda a trabajar con ella.</span>
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

      {/* ── Confianza y seguridad — puente a /seguridad, solo claims verificados ── */}
      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/60 mb-3">
                Confianza
              </p>
              <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
                <span className="inline-block">Tus expedientes exigen algo más que innovación.</span>{' '}
                <span className="inline-block text-void/60">Exigen confianza.</span>
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
          <div className="mt-12 border-t border-void/10 pt-10 -mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [touch-action:pan-x] md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
              {[
                { title: 'Aislamiento por despacho', body: 'Cada despacho es un inquilino aislado — Row Level Security en el propio motor de base de datos.' },
                { title: 'Tu información no entrena ninguna IA', body: 'Política contractual del proveedor de la API que usamos, no una promesa nuestra.' },
                { title: 'Diseñada para la abogacía', body: 'El deber de secreto profesional guía cada decisión de arquitectura, desde el primer día.' },
              ].map(p => (
                <div key={p.title} className="snap-start shrink-0 w-[78%] sm:w-[46%] md:w-auto">
                  <h3 className="text-sm font-700 mb-2">{p.title}</h3>
                  <p className="text-[13px] text-void/60 leading-[1.6]">{p.body}</p>
                </div>
              ))}
            </div>
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
                {/* Misma frase y mismo tratamiento que en /precios: entera o baja entera. */}
                <span className="inline-block">Se paga con un caso al mes.</span>
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

      {/* Las novedades ya NO viven en la home (Joaquín, 25-jul): el tablón completo
          está en /novedades — producto + compañía (lanzamientos, notas de prensa). */}

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
          {/* Captura REAL de la app en móvil (no un mock). Enseña el MENÚ de la app
              abierto, no el chat: en un vistazo se ve TODO lo que incluye VELIA
              (expedientes, agenda, negocio, contactos, control horario…). El chat
              solo mostraba una función y vendía corto. Feedback Joaquín 25-jul. */}
          <div className="justify-self-center">
            <PhoneShot
              src="/screenshots/movil-menu.webp"
              alt="La app de VELIA en el móvil con el menú abierto: Mensajes, Expedientes, Agenda, Panel, Recursos, Negocio, Contactos, Importar datos, Control horario, Web y Blog, Novedades, Soporte y Configuración"
            />
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
            Monta tu VELIA en 2 minutos con el contexto de tu despacho.{' '}
            <span className="inline-block">15 días gratis, sin tarjeta y sin compromiso.</span>
          </p>
          <TrackedLink
            href={`${APP_URL}/prueba-velia`}
            event="footer_cta_trial_click"
            className="btn inline-block mt-8 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-8 py-4 hover:opacity-85"
          >
            Prueba VELIA gratis
          </TrackedLink>
        </div>
      </section>
    </>
  )
}
