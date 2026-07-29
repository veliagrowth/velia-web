import type { Metadata } from 'next'
import TrialButton from '@/components/TrialButton'
import { CONTACT_EMAIL, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Sobre VELIA — software jurídico desarrollado en España',
  description:
    'Por qué existe VELIA, cómo se ha construido junto a un despacho real y quién está detrás de la plataforma.',
  alternates: { canonical: `${SITE_URL}/sobre-velia` },
}

const TEAM = [
  {
    name: 'Joaquín Paiva',
    role: 'Producto y tecnología',
    body: 'Diseña y construye la plataforma: arquitectura, integraciones y el Cerebro VELIA.',
  },
  {
    name: 'Axel',
    role: 'Legal y comercial',
    body: 'Cierra despachos, gestiona contratos y es el enlace directo con cada cliente.',
  },
]

export default function SobreVeliaPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-16">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-6">
          Sobre VELIA
        </p>
        {/* El arranque ya no es «un despacho sin presencia digital» (29-jul): eso
            contaba el origen desde el marketing. El problema que resuelve VELIA es
            de software, y así se cuenta. */}
        <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[18ch]">
          Construida en España, junto a los despachos que la utilizan.
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          VELIA nació para resolver un problema concreto: los abogados trabajan con demasiadas
          herramientas separadas y demasiado trabajo manual. Por eso construimos una plataforma
          en la que la gestión y la inteligencia jurídica forman parte del mismo sistema.
        </p>
      </section>

      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/60 mb-3">
              Por qué existe
            </p>
            <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[22ch]">
              Un despacho no debería necesitar cinco programas para funcionar.
            </h2>
          </div>
          <p className="text-sm text-void/65 leading-[1.6] self-center">
            El software jurídico que existía era genérico, extranjero o los dos.{' '}
            <span className="inline-block">VELIA se construyó al revés:</span> partiendo del
            día a día real de un despacho español — sus plazos, su facturación, su forma de
            trabajar — y añadiendo inteligencia artificial donde de verdad ahorra tiempo, no
            donde queda bien en una demo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
          El equipo
        </p>
        {/* «Dos personas, sin oficina, sin ronda, sin plantilla» era cierto y
            transmitía fragilidad operativa en un producto que custodia expedientes.
            El hecho relevante no es cuántos somos: es que quien decide el producto
            está en contacto directo con quien lo usa. */}
        <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[20ch]">
          Fundadores cerca del producto.
        </h2>
        <p className="mt-4 text-sm text-void/60 max-w-prose leading-[1.6]">
          El equipo fundador participa directamente en el desarrollo, el soporte y la relación
          con los despachos. Las decisiones de producto nacen del uso real, no de capas alejadas
          del cliente.
        </p>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 max-w-2xl">
          {TEAM.map(person => (
            <div key={person.name}>
              <h3 className="text-lg font-700">{person.name}</h3>
              <p className="text-[11px] font-600 tracking-[0.18em] uppercase text-void/60 mt-1 mb-3">
                {person.role}
              </p>
              <p className="text-sm text-void/65 leading-[1.6]">{person.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/60 mb-3">
            Cómo trabajamos
          </p>
          <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[24ch]">
            VELIA es un producto de software, no un servicio a medida.
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3 max-w-4xl">
            <div>
              <h3 className="text-sm font-700 mb-2">Desarrollada en España</h3>
              <p className="text-[13px] text-void/60 leading-[1.6]">
                Diseñada y construida en España, para el marco jurídico español.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-700 mb-2">Validada con un despacho real</h3>
              <p className="text-[13px] text-void/60 leading-[1.6]">
                Cada función se prueba antes en producción con Cónsul Jurídico, no en una maqueta.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-700 mb-2">Suscripción, no facturación por horas</h3>
              <p className="text-[13px] text-void/60 leading-[1.6]">
                Un precio fijo por el sistema completo — sin proyectos, sin presupuestos a medida.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">
          ¿Quieres verlo con los casos de tu despacho?
        </h2>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <TrialButton event="final_trial_click" location="sobre_velia" />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </>
  )
}
