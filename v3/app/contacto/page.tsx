import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { CONTACT_EMAIL, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Hablemos — VELIA',
  description:
    'Cuéntanos cómo trabajáis hoy y te decimos por dónde empezaríamos. La primera conversación no es una demostración de producto ni una propuesta comercial.',
  alternates: { canonical: `${SITE_URL}/contacto` },
}

/**
 * /contacto — REESCRITA EN EL REWORK 2026.
 *
 * La versión anterior tenía TRES puertas —prueba gratuita de 15 días, demo
 * interactiva y formulario— porque había un producto que probar. La VELIA nueva
 * no vende una herramienta: construye y opera infraestructura, y eso no se
 * prueba en dos minutos. Queda una sola puerta.
 *
 * Y es el destino del ÚNICO CTA de la Home. Si esta página siguiera hablando de
 * despachos, plazos procesales y pruebas gratuitas, toda la identidad nueva se
 * caería en un clic — que es peor que no haberla cambiado.
 *
 * `TrialButton` y el enlace a `/demo` desaparecen de aquí. Ninguno de los dos se
 * borra del repositorio: las páginas legacy los siguen usando.
 *
 * ⚠️ PENDIENTE, Y NO ES DE ESTA PÁGINA: al enviar este formulario, el portal
 * responde al visitante con un correo automático que le ofrece «recorrer un
 * despacho de demostración» (`velia-portal/app/api/velia-lead/route.ts`). Ese
 * correo sigue siendo de la etapa anterior y lo dispara el CTA de la VELIA
 * nueva. Está anotado como acción pendiente del informe de sesión: se arregla en
 * el portal, coordinado, no desde aquí.
 */
export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 md:px-10 pt-20 md:pt-28 pb-24">
      <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-6">
        Hablemos
      </p>
      <h1 className="text-[clamp(2.15rem,5vw,3.5rem)] font-600 leading-[1.08] tracking-[-0.03em] max-w-[18ch] text-void">
        Cuéntanos cómo trabajáis hoy. Te decimos qué haríamos.
      </h1>
      <p className="mt-7 text-lg leading-[1.6] text-void/70 max-w-prose">
        La primera conversación no es una demostración de producto ni una propuesta
        comercial. Es entender cómo entra el trabajo en tu negocio, cómo se hace y dónde se
        pierde — y decirte por dónde empezaríamos si fuéramos nosotros.
      </p>

      <div className="mt-12">
        <ContactForm origen="contacto" />
      </div>

      {/* Una sola alternativa, y en voz baja: quien prefiere el correo no debería
          tener que rellenar un formulario para encontrarlo. */}
      <p className="mt-10 text-[14px] leading-[1.6] text-void/65">
        ¿Prefieres escribir directamente?{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </section>
  )
}
