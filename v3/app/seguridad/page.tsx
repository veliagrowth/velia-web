import type { Metadata } from 'next'
import Link from 'next/link'
import { claim, type ClaimKey } from '@/lib/verified-claims'

/**
 * ⚠️ ESTA PÁGINA PASA POR EL GATE DE PRODUCT TRUTH (12-sep-2026).
 *
 * Publicaba TRES afirmaciones que `verified-claims.ts` marca `pending`:
 * facturación conforme a Verifactu, alojamiento en la UE y la política de no
 * entrenamiento. Las escribía a mano, así que el gate —que existe y es
 * correcto— nunca se enteraba.
 *
 * Ahora cada bloque que sostiene un claim declara CUÁL, y se filtra con
 * `claim()`. Si el claim no está `verified`, el bloque no existe. No hace falta
 * que nadie se acuerde: es la ausencia de la verificación la que lo borra.
 *
 * Los claims NO se han tocado: siguen `pending` y siguen esperando su prueba
 * documental. Lo que cambia es que dejan de publicarse mientras tanto.
 *
 * La página NO se ha reescrito: es `REWRITE` para la etapa 2 y sigue hablando
 * como la etapa anterior. Aquí sólo se ha cerrado la fuga.
 */

export const metadata: Metadata = {
  title: 'Seguridad — VELIA',
  /* La descripción publicaba «datos alojados en la UE» y «política de no
     entrenamiento de IA»: los dos son claims `pending`. Un metadato es tan
     público como un titular —sale en el resultado de búsqueda— y encima el
     gate no llega hasta aquí, porque esto es un objeto estático que se evalúa
     al construir. Por eso lo vigila `check:claims`, que mira también el <head>. */
  description:
    'Cómo protege VELIA los datos de los despachos: aislamiento por despacho con Row Level Security en el propio motor de la base de datos, cifrado en tránsito, documentos en almacenamiento privado y cumplimiento RGPD.',
  alternates: { canonical: 'https://veliacorp.com/seguridad' },
}

const PILLARS: { title: string; body: string; claim?: ClaimKey }[] = [
  {
    title: 'Aislamiento por despacho',
    body: 'Cada despacho es un inquilino aislado dentro de VELIA. Las políticas de Row Level Security (RLS) actúan en el propio motor de la base de datos y impiden el acceso a los datos de un despacho desde otro.',
  },
  {
    title: 'Tu información no entrena ninguna IA',
    body: 'VELIA trabaja con la API de Claude (Anthropic). Los datos enviados a través de la API no se utilizan para entrenar modelos — es la política contractual del proveedor, no una promesa nuestra.',
    claim: 'noModelTraining',
  },
  {
    title: 'Diseñada para la abogacía',
    body: 'VELIA no es un software genérico adaptado al sector legal. Está diseñada para el ejercicio de la abogacía, y el deber de secreto profesional guía cada decisión de arquitectura.',
  },
]

/* body + closer: el cierre se pinta como unidad inseparable (inline-block)
   para que la última frase nunca quede partida a mitad — regla de wrapping. */
const MEASURES: { title: string; body: string; closer?: string; claim?: ClaimKey }[] = [
  {
    title: 'Datos alojados en la Unión Europea',
    body: 'La base de datos y las funciones de la aplicación se ejecutan en infraestructura de región europea.',
    closer: 'El tratamiento se realiza dentro del marco RGPD.',
    claim: 'euInfrastructure',
  },
  {
    title: 'Cifrado en tránsito',
    body: 'Todas las comunicaciones entre tu navegador, la plataforma y los servicios que la componen viajan cifradas por HTTPS/TLS.',
    closer: 'Sin excepciones.',
  },
  {
    title: 'Documentos en almacenamiento privado',
    body: 'Los documentos del despacho se guardan en almacenamiento privado. Solo son accesibles mediante enlaces firmados temporales —',
    closer: 'nunca de forma pública.',
  },
  {
    title: 'Control de acceso',
    body: 'Autenticación por sesión, acceso por roles dentro del despacho y registro de auditoría en las acciones sensibles.',
    closer: 'Cada acción relevante deja rastro.',
  },
  {
    title: 'RGPD y tus derechos',
    body: 'El despacho mantiene la titularidad de sus datos y puede ejercer sus derechos: acceso, rectificación, supresión y portabilidad.',
    closer: 'Acuerdo de tratamiento de datos disponible.',
  },
  {
    title: 'Facturación conforme a Verifactu',
    body: 'La facturación emitida desde VELIA cumple la normativa española vigente en materia de facturación electrónica y registro (Verifactu).',
    claim: 'verifactu',
  },
]

/** Para que el titular no diga «tres» cuando quedan dos. */
const CARDINAL: Record<number, string> = { 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco' }

/** Solo sobrevive lo que no sostiene ningún claim, o cuyo claim está verificado. */
const publicable = <T extends { claim?: ClaimKey }>(x: T) => !x.claim || claim(x.claim) !== null

const PILARES_VISIBLES = PILLARS.filter(publicable)
const MEDIDAS_VISIBLES = MEASURES.filter(publicable)

/* La rejilla se calcula desde cuántos quedan. Con `md:grid-cols-3` fijo, al
   caerse un pilar quedaba un hueco a la derecha: el texto desaparecía y el
   agujero se quedaba, que es peor que cualquiera de las dos cosas. */
const COLUMNAS_PILARES = PILARES_VISIBLES.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'

export default function SeguridadPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-16">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-6">
          Seguridad y confianza
        </p>
        <h1 className="text-4xl md:text-5xl font-600 leading-[1.08] tracking-[-0.03em] max-w-[18ch]">
          Construida para guardar secretos.
        </h1>
        {/* La entrada también publicaba el alojamiento en la UE, en prosa y no en
            una lista — por eso no la cazó el primer barrido, que sólo miró los
            bloques. Un claim escrito a mano en un párrafo es tan público como
            uno dentro de una tarjeta. Queda el aislamiento por despacho, que sí
            está `verified`. */}
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          El día a día de un despacho está hecho de información que no puede salir de él.
          VELIA parte de esa premisa: cada despacho aislado del resto y una regla simple —{' '}
          <span className="inline-block">tus datos son de tu despacho.</span>
        </p>
      </section>

      <section className="bg-white border-y border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          {/* El rótulo y el titular decían «tres» con un número escrito a mano.
              Al caerse un pilar por falta de verificación, la página se quedaba
              prometiendo tres y enseñando dos. Ahora el número sale de cuántos
              hay: un texto que cuenta algo no puede contarlo de memoria. */}
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/60 mb-3">
            {PILARES_VISIBLES.length === 1 ? 'El pilar' : `Los ${CARDINAL[PILARES_VISIBLES.length] ?? PILARES_VISIBLES.length} pilares`}
          </p>
          <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em] max-w-[24ch]">
            {PILARES_VISIBLES.length === 1 ? 'Una decisión' : `${(CARDINAL[PILARES_VISIBLES.length] ?? PILARES_VISIBLES.length).toString().replace(/^\w/, c => c.toUpperCase())} decisiones`}
            {' '}de arquitectura que no dependen de la buena voluntad de nadie.
          </h2>
          <div className={`mt-12 grid gap-10 ${COLUMNAS_PILARES}`}>
            {PILARES_VISIBLES.map((p, i) => (
              <div key={p.title} className={i > 0 ? 'md:border-l md:border-void/10 md:pl-10' : 'md:pr-4'}>
                <h3 className="text-lg font-700 mb-3">{p.title}</h3>
                <p className="text-sm text-void/60 leading-[1.6]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-3">Medidas concretas</p>
        <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">El detalle técnico.</h2>
        <p className="mt-4 text-sm text-void/60 max-w-prose leading-[1.6]">
          Lo que un despacho — o su responsable de protección de datos — querrá saber antes
          de confiar sus expedientes a una plataforma.
        </p>
        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 max-w-4xl">
          {MEDIDAS_VISIBLES.map(m => (
            <div key={m.title}>
              <h3 className="text-sm font-700 mb-2">{m.title}</h3>
              <p className="text-sm text-void/60 leading-[1.6]">
                {m.body}
                {m.closer && <> <span className="inline-block">{m.closer}</span></>}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-void/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/60 mb-3">Mejora continua</p>
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
              className="btn inline-block mt-6 bg-void text-cream text-[12px] font-700 tracking-[0.04em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
            >
              Hablemos de seguridad
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
