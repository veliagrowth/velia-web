import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Seguridad — VELIA',
  description:
    'Cómo protege VELIA los datos de los despachos: aislamiento multi-tenant con Row Level Security, datos alojados en la UE, política de no entrenamiento de IA y cumplimiento RGPD.',
}

const PILLARS = [
  {
    title: 'Aislamiento por despacho',
    body: 'Cada despacho es un inquilino aislado dentro de VELIA. Las políticas de Row Level Security (RLS) actúan en el propio motor de la base de datos y garantizan que los datos de un despacho jamás se cruzan con los de otro.',
  },
  {
    title: 'Tu información no entrena ninguna IA',
    body: 'VELIA trabaja con la API de Claude (Anthropic). Los datos enviados a través de la API no se utilizan para entrenar modelos — es la política contractual del proveedor, no una promesa nuestra.',
  },
  {
    title: 'Diseñada para la abogacía',
    body: 'VELIA no es un software genérico adaptado al sector legal. Está diseñada para el ejercicio de la abogacía, y el deber de secreto profesional guía cada decisión de arquitectura.',
  },
]

const MEASURES = [
  {
    title: 'Datos alojados en la Unión Europea',
    body: 'La base de datos y las funciones de la aplicación se ejecutan en infraestructura de región europea. El tratamiento se realiza dentro del marco RGPD.',
  },
  {
    title: 'Cifrado en tránsito',
    body: 'Todas las comunicaciones entre tu navegador, la plataforma y los servicios que la componen viajan cifradas por HTTPS/TLS. Sin excepciones.',
  },
  {
    title: 'Documentos en almacenamiento privado',
    body: 'Los documentos del despacho se guardan en almacenamiento privado. Solo son accesibles mediante enlaces firmados temporales — nunca de forma pública.',
  },
  {
    title: 'Control de acceso',
    body: 'Autenticación por sesión, acceso por roles dentro del despacho y registro de auditoría en las acciones sensibles. Cada acción relevante deja rastro.',
  },
  {
    title: 'RGPD y tus derechos',
    body: 'El despacho mantiene la titularidad de sus datos y puede ejercer sus derechos: acceso, rectificación, supresión y portabilidad. Acuerdo de tratamiento de datos disponible.',
  },
  {
    title: 'Facturación conforme a Verifactu',
    body: 'La facturación emitida desde VELIA cumple la normativa española vigente en materia de facturación electrónica y registro (Verifactu).',
  },
]

export default function SeguridadPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-16">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-6">
          Seguridad y confianza
        </p>
        <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[18ch]">
          Construida para guardar secretos.
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          El día a día de un despacho está hecho de información que no puede salir de él.
          VELIA parte de esa premisa: cada despacho aislado del resto, datos alojados en
          la Unión Europea y una regla simple — tus datos son de tu despacho.
        </p>
      </section>

      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/40 mb-3">Los tres pilares</p>
          <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[24ch]">
            Tres decisiones de arquitectura que no dependen de la buena voluntad de nadie.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.title} className={i > 0 ? 'md:border-l md:border-void/10 md:pl-10' : 'md:pr-4'}>
                <h3 className="text-lg font-700 mb-3">{p.title}</h3>
                <p className="text-sm text-void/60 leading-[1.6]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">Medidas concretas</p>
        <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">El detalle técnico.</h2>
        <p className="mt-4 text-sm text-void/60 max-w-prose leading-[1.6]">
          Lo que un despacho — o su responsable de protección de datos — querrá saber antes
          de confiar sus expedientes a una plataforma.
        </p>
        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 max-w-4xl">
          {MEASURES.map(m => (
            <div key={m.title}>
              <h3 className="text-sm font-700 mb-2">{m.title}</h3>
              <p className="text-sm text-void/60 leading-[1.6]">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/40 mb-3">Mejora continua</p>
          <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">Lo que viene después.</h2>
          <div className="mt-6 space-y-4 max-w-prose">
            <p className="text-sm text-void/60 leading-[1.6]">
              Trabajamos hacia certificaciones formales de seguridad de la información —
              entre ellas ISO 27001 — como parte de nuestro compromiso de mejora continua.
            </p>
            <p className="text-sm text-void/60 leading-[1.6]">
              Y preferimos decirlo con claridad: hoy no contamos todavía con esa
              certificación. Cuando una certificación aparezca en esta página como
              obtenida, será porque lo está.
            </p>
          </div>
          <div className="mt-10">
            <p className="text-sm text-void/70 leading-[1.6] max-w-prose">
              Si tu despacho necesita detalle adicional sobre arquitectura, tratamiento de
              datos o el acuerdo de tratamiento (DPA), escríbenos y te lo explicamos sin
              rodeos — hablas directamente con el equipo que lo ha construido.
            </p>
            <Link
              href="/contacto"
              className="btn inline-block mt-6 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
            >
              Hablemos de seguridad
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
