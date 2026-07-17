import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto — VELIA',
  description: 'Agenda una demo de VELIA Legal o pregúntanos lo que necesites. Respondemos en el día.',
  alternates: { canonical: 'https://veliacorp.com/contacto' },
}

export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-20 grid gap-14 md:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-6">Contacto</p>
        <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[14ch]">
          Hablemos de tu despacho.
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          Cuéntanos cómo trabajáis hoy y te enseñamos VELIA con tus propios tipos de
          asuntos. <span className="inline-block">30 minutos, sin compromiso.</span>
        </p>
        <ul className="mt-8 space-y-2.5 text-sm text-void/60">
          <li className="flex items-start gap-2.5"><span className="text-gold-dark shrink-0">✓</span> Respondemos en el día laborable</li>
          <li className="flex items-start gap-2.5"><span className="text-gold-dark shrink-0">✓</span> Hablas con el equipo que construye la plataforma</li>
          <li className="flex items-start gap-2.5"><span className="text-gold-dark shrink-0">✓</span> Si VELIA no encaja con tu despacho, te lo decimos</li>
        </ul>
      </div>
      <ContactForm />
    </section>
  )
}
