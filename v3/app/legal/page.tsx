import type { Metadata } from 'next'
import ProductShot from '@/components/ProductShot'
import PhoneShot from '@/components/PhoneShot'
import TrialButton from '@/components/TrialButton'
import { APP_URL, SITE_URL } from '@/lib/constants'
import { PRICING } from '@/lib/pricing'

/* La ruta sigue siendo /legal y no se renombra a /producto: está indexada, tiene
   enlaces entrantes y el beneficio de cambiarla no compensa el riesgo. El título
   visible sí dice «Producto» en la navegación. */
export const metadata: Metadata = {
  title: 'Producto — un día de tu despacho, con VELIA dentro',
  description:
    'Cómo trabaja un abogado con VELIA: puesta al día cada mañana, expedientes, documentos con IA, propuestas de plazos, portal del cliente y facturación.',
  alternates: { canonical: `${SITE_URL}/legal` },
}

/* body + closer: el cierre se pinta como unidad inseparable (inline-block)
   para que la última frase nunca quede partida a mitad — regla de wrapping. */
const DAY = [
  {
    time: '08:30',
    slug: 'puesta-al-dia',
    title: 'Entras y VELIA ya te ha puesto al día',
    body: 'Nada de repasar cinco pantallas: plazos que vencen, citas del día, mensajes pendientes y documentos recién llegados, en un parte de un vistazo.',
    closer: 'Lo primero que ves cada mañana.',
  },
  {
    time: '09:10',
    slug: 'plazos',
    title: 'Un plazo, calculado según la LEC',
    body: 'VELIA computa los plazos procesales con las reglas reales — días inhábiles, agosto, prórroga del 133.4 — y te avisa con margen.',
    closer: 'Los vencimientos registrados y propuestos quedan organizados dentro de cada asunto.',
  },
  {
    time: '11:00',
    slug: 'escritos',
    title: 'Un escrito, redactado con fuentes',
    body: 'Pides una contestación o un informe y VELIA lo prepara citando el texto oficial del BOE artículo por artículo, con tus escritos anteriores como estilo.',
    closer: 'Tú revisas y firmas: el criterio siempre es tuyo.',
  },
  {
    time: '13:30',
    slug: 'documentacion',
    title: 'La documentación no se queda a medias',
    body: 'El cliente recibe su checklist en su portal y sube los documentos desde el móvil. VELIA envía recordatorios configurados hasta que la documentación se completa.',
    closer: 'Se acabó el "te lo mando mañana".',
  },
  {
    time: '17:00',
    slug: 'facturacion',
    title: 'La factura, conforme a Verifactu',
    body: 'Minutas y facturas emitidas desde el propio expediente, cumpliendo la normativa española de facturación.',
    closer: 'Sin exportar a otro programa.',
  },
]

export default function LegalPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-16">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-6">
          VELIA Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[20ch]">
          Un día de tu despacho, con VELIA dentro.
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          No te contamos funcionalidades: te contamos tu jornada.{' '}
          <span className="inline-block">Esto es lo que cambia desde la primera semana.</span>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <ol className="relative border-l border-void/15 ml-3 space-y-12 md:space-y-14">
          {DAY.map(item => (
            <li key={item.time} id={item.slug} className="pl-8 md:pl-12 relative scroll-mt-24">
              <span className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-gold" />
              <p className="text-[11px] font-700 tracking-[0.18em] text-void/60 mb-1.5">{item.time}</p>
              <h2 className="text-xl md:text-2xl font-700 tracking-[-0.01em]">{item.title}</h2>
              <p className="mt-2.5 text-sm text-void/60 leading-[1.6] max-w-prose">
                {item.body} <span className="inline-block">{item.closer}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Captura real: el expediente por dentro (tenant demo, datos ficticios) */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
          El expediente, por dentro
        </p>
        <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[24ch]">
          Documentos, plazos, apuntes, auditoría y la economía del asunto — en una ficha.
        </h2>
        <p className="mt-4 mb-10 text-sm text-void/60 leading-[1.6] max-w-prose">
          Cada expediente reúne al cliente, el abogado a cargo, la documentación, los
          vencimientos y lo cobrado y por cobrar.{' '}
          <span className="inline-block">Y desde ahí mismo se factura.</span>
        </p>
        <ProductShot
          src="/screenshots/expediente-detalle.webp"
          alt="Ficha real de expediente en VELIA: cliente, abogado a cargo, documentos, plazos y economía del expediente"
        />
      </section>

      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[22ch]">
              Y debajo de todo, un CRM completo del despacho.
            </h2>
            <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
              Contactos, expedientes, pipeline de asuntos, agenda con recordatorios,
              control horario, informes y el portal donde tus clientes ven su caso en
              lenguaje llano.{' '}
              <span className="inline-block">Cada pieza conectada con las demás.</span>
            </p>
          </div>
          <div className="justify-self-start md:justify-self-end">
            <TrialButton event="pricing_trial_click" location="producto_crm" />
          </div>
        </div>
      </section>

      {/* Acceso móvil. Vivía en una sección propia de la home, donde competía con
          el Cerebro VELIA y con el precio. Aquí es lo que es: una capacidad más. */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[22ch]">
              El despacho, también desde el móvil.
            </h2>
            <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
              Instala VELIA como aplicación y accede a tu despacho desde cualquier
              dispositivo: icono en la pantalla de inicio, pantalla completa y tu asistente
              a un toque.
            </p>
            <a
              href={`${APP_URL}/instalar`}
              className="inline-block mt-6 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
            >
              Cómo instalarla →
            </a>
          </div>
          <div className="justify-self-center md:justify-self-end">
            <PhoneShot
              src="/screenshots/movil-menu.webp"
              alt="La app de VELIA en el móvil con el menú abierto: Mensajes, Expedientes, Agenda, Panel, Recursos, Negocio, Contactos, Importar datos, Control horario, Web y Blog, Novedades, Soporte y Configuración"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-void text-cream px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">
            Descubre cómo trabaja VELIA con tu despacho.
          </h2>
          <p className="mt-4 text-sm text-cream/60 max-w-[48ch] mx-auto leading-relaxed">
            {PRICING.trialDays} días gratis, sin tarjeta y sin compromiso durante la prueba.
          </p>
          <div className="mt-8">
            <TrialButton event="final_trial_click" location="producto_final" variant="onDark" />
          </div>
        </div>
      </section>
    </>
  )
}
