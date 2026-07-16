import type { Metadata } from 'next'
import Link from 'next/link'
import ProductShot from '@/components/ProductShot'

export const metadata: Metadata = {
  title: 'VELIA Legal — el día a día del despacho, resuelto',
  description:
    'Cómo trabaja un abogado con VELIA: puesta al día automática, plazos LEC, escritos con IA citando el BOE, persecución de documentación y facturación Verifactu.',
  alternates: { canonical: 'https://veliacorp.com/legal' },
}

const DAY = [
  {
    time: '08:30',
    slug: 'puesta-al-dia',
    title: 'Entras y VELIA ya te ha puesto al día',
    body: 'Nada de repasar cinco pantallas: plazos que vencen, citas del día, mensajes pendientes y documentos recién llegados, en un parte de un vistazo. Lo primero que ves cada mañana.',
  },
  {
    time: '09:10',
    slug: 'plazos',
    title: 'Un plazo, calculado según la LEC',
    body: 'VELIA computa los plazos procesales con las reglas reales — días inhábiles, agosto, prórroga del 133.4 — y te avisa con margen. Los vencimientos dejan de vivir en tu cabeza.',
  },
  {
    time: '11:00',
    slug: 'escritos',
    title: 'Un escrito, redactado con fuentes',
    body: 'Pides una contestación o un informe y VELIA lo prepara citando el texto oficial del BOE artículo por artículo, con tus escritos anteriores como estilo. Tú revisas y firmas: el criterio siempre es tuyo.',
  },
  {
    time: '13:30',
    slug: 'documentacion',
    title: 'La documentación llega sola',
    body: 'El cliente recibe su checklist en su portal, sube los documentos desde el móvil y VELIA los persigue por email hasta completarla. Se acabó el "te lo mando mañana".',
  },
  {
    time: '17:00',
    slug: 'facturacion',
    title: 'La factura, conforme a Verifactu',
    body: 'Minutas y facturas emitidas desde el propio expediente, cumpliendo la normativa española de facturación. Sin exportar a otro programa.',
  },
]

export default function LegalPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-16">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-6">
          VELIA Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[20ch]">
          Un día de tu despacho, con VELIA dentro.
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          No te contamos funcionalidades: te contamos tu jornada. Esto es lo que cambia
          desde la primera semana.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <ol className="relative border-l border-void/15 ml-3 space-y-12 md:space-y-14">
          {DAY.map(item => (
            <li key={item.time} id={item.slug} className="pl-8 md:pl-12 relative scroll-mt-24">
              <span className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-gold" />
              <p className="text-[11px] font-700 tracking-[0.18em] text-void/40 mb-1.5">{item.time}</p>
              <h2 className="text-xl md:text-2xl font-700 tracking-[-0.01em]">{item.title}</h2>
              <p className="mt-2.5 text-sm text-void/60 leading-[1.6] max-w-prose">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Captura real: el expediente por dentro (tenant demo, datos ficticios) */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">
          El expediente, por dentro
        </p>
        <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[24ch]">
          Documentos, plazos, apuntes, auditoría y la economía del asunto — en una ficha.
        </h2>
        <p className="mt-4 mb-10 text-sm text-void/60 leading-[1.6] max-w-prose">
          Cada expediente reúne al cliente, el abogado a cargo, la documentación, los
          vencimientos y lo cobrado y por cobrar. Y desde ahí mismo se factura.
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
              lenguaje llano. Cada pieza conectada con las demás.
            </p>
          </div>
          <div className="justify-self-start md:justify-self-end">
            <Link
              href="/contacto"
              className="btn inline-block bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
            >
              Verlo con tus casos
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
