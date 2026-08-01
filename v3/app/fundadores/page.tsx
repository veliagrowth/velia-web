import type { Metadata } from 'next'
import Link from 'next/link'
import TrialButton from '@/components/TrialButton'
import { PRICING, FOUNDERS, FOUNDERS_SEATS_LABEL, eur } from '@/lib/pricing'
import { CONTACT_EMAIL, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Programa Fundadores — VELIA',
  description:
    'Condiciones del Programa Fundadores de VELIA: precio de lanzamiento protegido y web premium incluida con la modalidad anual. Alcance completo y límites.',
  alternates: { canonical: `${SITE_URL}/fundadores` },
}

/**
 * Condiciones del Programa Fundadores.
 *
 * Existe porque el programa se anunciaba en tres sitios con la frase «web premium
 * incluida» y en ninguno se decía qué incluye exactamente esa web. Un incentivo
 * comercial sin alcance escrito es una discusión futura con un cliente.
 *
 * ⚠️ PENDIENTE: revisar con asesoría jurídica antes de considerarlo definitivo.
 */

const INCLUYE = [
  'Hasta cinco secciones',
  'Un idioma',
  'Una propuesta visual',
  'Una ronda agrupada de cambios',
  'Formulario de contacto',
  'Diseño adaptado a móvil',
  'Configuración SEO técnica básica',
]

const NO_INCLUYE = [
  'Comercio electrónico',
  'Zona privada de clientes',
  'Integraciones a medida',
  'Campañas de publicidad',
  'Posicionamiento garantizado',
  'Cambios ilimitados',
  'Redacción de los textos ni banco de imágenes',
]

export default function FundadoresPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-20 md:pt-28 pb-12">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-6">
          Programa Fundadores
        </p>
        <h1 className="text-4xl md:text-5xl font-600 leading-[1.08] tracking-[-0.03em] max-w-[18ch]">
          Entra en la primera generación de despachos VELIA.
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          Los primeros despachos que contraten la modalidad anual mantienen el precio de
          lanzamiento mientras su suscripción permanezca activa y acceden a una web premium de
          lanzamiento.
        </p>
        <p className="mt-6 text-[12px] font-700 tracking-[0.06em] uppercase text-gold-ink">
          {FOUNDERS_SEATS_LABEL} disponibles
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="rounded-3xl border border-void/10 bg-white p-8 md:p-10">
          <h2 className="text-2xl font-700 tracking-[-0.02em]">Qué incluye el programa</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              'Precio de lanzamiento protegido mientras la suscripción siga activa',
              'Web premium de lanzamiento incluida (solo modalidad anual)',
              'Onboarding prioritario',
              'Canal directo de feedback con el equipo',
              'Participación en la evolución del producto',
            ].map(b => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-void/70 leading-snug">
                <span className="text-gold-ink mt-0.5 shrink-0" aria-hidden="true">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">
            Alcance de la web premium
          </h2>
          <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
            Escrito con detalle a propósito. Un incentivo sin alcance definido acaba siendo una
            conversación incómoda seis meses después.
          </p>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-700 tracking-[0.06em] uppercase text-gold-ink mb-4">
                Incluye
              </p>
              <ul className="space-y-2.5">
                {INCLUYE.map(i => (
                  <li key={i} className="text-sm text-void/70 leading-[1.6]">{i}</li>
                ))}
              </ul>
            </div>
            <div className="md:border-l md:border-void/10 md:pl-10">
              <p className="text-[11px] font-700 tracking-[0.06em] uppercase text-void/60 mb-4">
                No incluye
              </p>
              <ul className="space-y-2.5">
                {NO_INCLUYE.map(i => (
                  <li key={i} className="text-sm text-void/60 leading-[1.6]">{i}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-void/10 pt-10">
            <h3 className="text-lg font-700 mb-4">Condiciones</h3>
            <ul className="space-y-3 text-sm text-void/65 leading-[1.6] max-w-prose">
              <li>Disponible únicamente para miembros del Programa Fundadores, limitado a {FOUNDERS.seatsTotal} plazas.</li>
              <li>Requiere modalidad anual activa: la web permanece incluida mientras se mantenga activa la suscripción que da acceso al programa.</li>
              <li>El despacho proporciona los textos, las imágenes, el logotipo y los datos legales. Los plazos empiezan a contar al recibir ese material.</li>
              <li>El dominio y el alojamiento durante la vigencia del programa corren por cuenta de VELIA; el dominio puede registrarse a nombre del despacho si así lo solicita.</li>
              <li>Los contenidos aportados por el despacho siguen siendo suyos. El diseño y el código quedan a su disposición si finaliza la relación.</li>
              <li>No es canjeable por dinero ni por descuento sobre la suscripción.</li>
            </ul>
            <p className="mt-8 text-[13px] text-void/45 leading-[1.6] max-w-prose">
              Estas condiciones están pendientes de revisión por asesoría jurídica. Para
              cualquier duda sobre el alcance antes de contratar, escríbenos a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-void/25 hover:decoration-void">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">
          Pruébala antes de decidir.
        </h2>
        <p className="mt-4 text-sm text-void/60 max-w-[50ch] mx-auto leading-relaxed">
          El programa se activa al contratar la modalidad anual, no antes. Empieza por la
          prueba de {PRICING.trialDays} días y decide después.
        </p>
        <div className="mt-8">
          <TrialButton event="founders_trial_click" location="founders_page" />
        </div>
        <p className="mt-4 text-[12px] text-void/60">
          {PRICING.trialDays} días gratis · Sin tarjeta
        </p>
        <Link
          href="/precios"
          className="inline-block mt-8 text-[12px] font-700 tracking-[0.04em] uppercase text-gold-ink hover:text-void transition-colors"
        >
          Ver precios y condiciones →
        </Link>
      </section>
    </>
  )
}
