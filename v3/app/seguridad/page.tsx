import type { Metadata } from 'next'
import Link from 'next/link'
import TrackedLink from '@/components/TrackedLink'
import { claim, type ClaimKey } from '@/lib/verified-claims'
import { SITE_URL } from '@/lib/constants'
import { CTA_CONTACTO } from '@/lib/cta'

/**
 * /seguridad — REESCRITA EN EL REWORK 2026, etapa 2.
 *
 * NO ESTÁ EN LA NAVEGACIÓN, y aun así es de las páginas más alcanzables del
 * sitio: la enlazan `/privacidad` e `/ia-responsable`, que están en el pie de
 * TODAS las páginas. Dos clics desde cualquier punto. Y ese camino no se puede
 * romper, porque las dos que lo abren son obligación legal.
 *
 * QUÉ DECÍA: seguridad de un SaaS jurídico. «Aislamiento por despacho», «cada
 * despacho es un inquilino», «Diseñada para la abogacía», «el deber de secreto
 * profesional guía cada decisión de arquitectura», «antes de confiar sus
 * expedientes a una plataforma». 25 menciones a «despacho» en una página que
 * responde de la seguridad de la compañía, no de un vertical.
 *
 * QUÉ ES AHORA: seguridad de INFRAESTRUCTURA Y OPERACIÓN. Es lo que pesa cuando
 * lo que se compra no es una herramienta sino un sistema del que responde
 * alguien — y la pregunta deja de ser «¿es seguro el programa?» para ser «¿quién
 * entra, qué puede tocar y qué rastro deja?».
 *
 * ── LO QUE SE CONSERVA INTACTO, Y POR QUÉ ──────────────────────────────────
 *
 * 1. EL GATE DE PRODUCT TRUTH. `publicable()` filtra cada bloque por su claim:
 *    sin `verified`, el bloque no existe. Los tres `pending` de esta página
 *    —noModelTraining, euInfrastructure, verifactu— siguen atados y siguen sin
 *    publicarse. No se ha tocado ni uno.
 * 2. EL CONTADOR DERIVADO. El rótulo dice cuántos pilares hay, no un número
 *    escrito a mano: al caerse uno por falta de verificación, la página decía
 *    «tres» y enseñaba dos.
 * 3. LA REJILLA CALCULADA desde cuántos quedan, para que un bloque filtrado no
 *    deje un hueco donde estaba el texto.
 * 4. «LO QUE VIENE DESPUÉS». Dice, con todas las letras, que hoy NO hay ISO
 *    27001. Es la pieza más valiosa de la página y es exactamente la honestidad
 *    que la dirección pide como estética: quitarla para que la página «venda
 *    mejor» sería empeorarla.
 *
 * ── LO QUE SE AÑADE ────────────────────────────────────────────────────────
 *
 * `tenantIsolation` estaba `verified` desde el 29-jul con `usedIn: []`: un hecho
 * comprobado que no se publicaba en ninguna parte — el desperdicio inverso al de
 * publicar sin verificar. Ahora sostiene el primer pilar, a través del gate.
 *
 * ⚠️ Esta página SIGUE FUERA DEL SITEMAP, y debe seguir. No por legacy —no lo
 * es— sino porque su contenido depende de claims `pending`. Proponérsela a un
 * buscador es pedir que se indexe lo que todavía no se ha verificado. Vuelve al
 * sitemap cuando los claims se cierren, no cuando la página se lea bonita.
 */

export const metadata: Metadata = {
  title: 'Seguridad — VELIA',
  /* La descripción no publica ni un claim. Cuidado aquí: un metadato es tan
     público como un titular —sale en el resultado de búsqueda— y el gate no
     llega, porque esto es un objeto estático que se evalúa al construir. Por eso
     lo vigila `check:claims`, que mira también el <head>. La versión anterior
     publicaba en este mismo campo el alojamiento en la UE y la política de no
     entrenamiento: los dos, `pending`. */
  description:
    'Cómo protege VELIA la infraestructura que construye y opera: aislamiento entre clientes en el propio motor de la base de datos, cifrado en tránsito, control de acceso por roles y registro de auditoría en las acciones sensibles.',
  alternates: { canonical: `${SITE_URL}/seguridad` },
}

/**
 * Los pilares: decisiones de arquitectura, no promesas de comportamiento. La
 * diferencia importa — una promesa depende de que alguien se acuerde; una
 * decisión de arquitectura sigue en pie cuando nadie mira.
 */
const PILARES: { title: string; body: string; claim?: ClaimKey }[] = [
  {
    title: 'Aislamiento entre clientes',
    body: 'Cada cliente es un inquilino separado. Las políticas de Row Level Security actúan en el propio motor de la base de datos, no en el código que lo consulta: aunque una consulta se escriba mal, los datos de un cliente no se alcanzan desde otro.',
    claim: 'tenantIsolation',
  },
  {
    title: 'Tu información no entrena ninguna IA',
    body: 'VELIA trabaja con la API de Claude (Anthropic). Los datos enviados a través de la API no se utilizan para entrenar modelos — es la política contractual del proveedor, no una promesa nuestra.',
    claim: 'noModelTraining',
  },
  {
    title: 'La automatización opera con permisos acotados',
    body: 'Un proceso automático no recibe acceso ilimitado por el hecho de necesitar hacer su trabajo. Cada uno actúa con permisos explícitos sobre lo que le corresponde, y lo que hace queda registrado.',
  },
]

/* body + closer: el cierre se pinta como unidad inseparable (inline-block) para
   que la última frase nunca quede partida a mitad — regla de wrapping. */
const MEDIDAS: { title: string; body: string; closer?: string; claim?: ClaimKey }[] = [
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
    body: 'Los documentos se guardan en almacenamiento privado. Solo son accesibles mediante enlaces firmados temporales —',
    closer: 'nunca de forma pública.',
  },
  {
    title: 'Control de acceso',
    body: 'Autenticación por sesión, acceso por roles dentro de cada organización y registro de auditoría en las acciones sensibles.',
    closer: 'Cada acción relevante deja rastro.',
  },
  {
    title: 'RGPD y tus derechos',
    body: 'Cada cliente mantiene la titularidad de sus datos y puede ejercer sus derechos: acceso, rectificación, supresión y portabilidad.',
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

const PILARES_VISIBLES = PILARES.filter(publicable)
const MEDIDAS_VISIBLES = MEDIDAS.filter(publicable)

/* La rejilla se calcula desde cuántos quedan. Con `md:grid-cols-3` fijo, al
   caerse un pilar quedaba un hueco a la derecha: el texto desaparecía y el
   agujero se quedaba, que es peor que cualquiera de las dos cosas. */
const COLUMNAS_PILARES = PILARES_VISIBLES.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'

const enMayuscula = (s: string) => s.replace(/^\w/, c => c.toUpperCase())

export default function SeguridadPage() {
  const cuantos = PILARES_VISIBLES.length
  const cardinal = CARDINAL[cuantos] ?? String(cuantos)

  return (
    <>
      {/* ═══ AFIRMACIÓN ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 pt-20 pb-16 md:pt-28 md:pb-24">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">
          Seguridad
        </p>
        <h1 className="mt-6 text-[clamp(2.15rem,5.6vw,4.5rem)] font-600 tracking-[-0.035em] leading-[1.04] text-void max-w-[17ch]">
          Operar la infraestructura de otro obliga a más que a construirla.
        </h1>
        {/* La entrada anterior publicaba el alojamiento en la UE en prosa, no en
            una lista — por eso no la cazó el primer barrido, que sólo miró los
            bloques. Un claim escrito a mano en un párrafo es tan público como
            uno dentro de una tarjeta. Aquí no hay ninguno: lo que se afirma es
            el aislamiento, y ese va por el gate, más abajo. */}
        <p className="mt-8 text-lg md:text-xl leading-[1.6] text-void/70 max-w-prose">
          Cuando VELIA construye un sistema y se queda operándolo, entra en el negocio de
          alguien todos los días. Eso cambia la pregunta: no es si el software es seguro,
          sino quién entra, qué puede tocar y qué rastro deja.
        </p>
      </section>

      {/* ═══ LOS PILARES ══════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-mist">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          {/* El rótulo y el titular decían «tres» con un número escrito a mano.
              Al caerse un pilar por falta de verificación, la página se quedaba
              prometiendo tres y enseñando dos. Ahora el número sale de cuántos
              hay: un texto que cuenta algo no puede contarlo de memoria. */}
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
            {cuantos === 1 ? 'El pilar' : `Los ${cardinal} pilares`}
          </p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[24ch]">
            {cuantos === 1 ? 'Una decisión' : `${enMayuscula(cardinal)} decisiones`} de
            arquitectura que no dependen de que nadie se acuerde.
          </h2>
          <div className={`mt-14 md:mt-20 grid gap-10 md:gap-0 ${COLUMNAS_PILARES}`}>
            {PILARES_VISIBLES.map((p, i) => (
              <div
                key={p.title}
                className={i > 0 ? 'md:border-l md:border-mist md:pl-10' : 'md:pr-10'}
              >
                <h3 className="text-lg md:text-xl font-600 tracking-[-0.015em] text-void">
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-void/65 max-w-prose">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EL DETALLE ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
          Medidas concretas
        </p>
        <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
          El detalle técnico.
        </h2>
        <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-void/65 max-w-prose">
          Lo que un responsable de protección de datos querrá saber antes de que sus sistemas
          pasen a manos de otro.
        </p>
        <div className="mt-14 md:mt-20 grid gap-x-12 gap-y-10 md:grid-cols-2 max-w-4xl">
          {MEDIDAS_VISIBLES.map(m => (
            <div key={m.title}>
              <h3 className="text-[15px] font-600 tracking-[-0.01em] text-void">{m.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-void/65">
                {m.body}
                {m.closer && <> <span className="inline-block">{m.closer}</span></>}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LO QUE NO TENEMOS · CORTE OSCURO ═════════════════════════════
          Esta sección es la razón de ser de la página, y por eso se lleva el
          único corte oscuro: decir qué falta es más difícil de escribir que
          cualquier lista de medidas, y es lo único que hace creíble al resto. */}
      <section className="velia-dark-stage bg-void text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85">
            Lo que todavía no
          </p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] max-w-[22ch]">
            Hoy no tenemos certificación ISO 27001.
          </h2>
          {/* SIN `Reveal`, y es deliberado (18-sep-2026).
              Este bloque es la única parte de la web donde VELIA dice qué NO
              tiene. Envolverlo en una animación de entrada lo hace depender de
              que un IntersectionObserver dispare, y medido aquí mismo: con un
              recorrido a saltos el observer puede no llegar a emitir, y el
              bloque se queda a opacidad 0 con la página entera ya pasada.
              En la práctica un humano hace scroll continuo y se revela — pero
              «en la práctica se revela» no es el listón para el párrafo que
              admite que no hay certificación. La dirección ya lo dice: nada
              existe sólo animado. */}
          <div className="mt-8 space-y-4">
            <p className="text-[15px] md:text-base leading-[1.6] text-cream/70 max-w-prose">
              Trabajamos hacia certificaciones formales de seguridad de la información —
              entre ellas ISO 27001— como parte del compromiso de mejora continua. Todavía
              no está, y preferimos decirlo aquí antes de que lo pregunte nadie.
            </p>
            <p className="text-[15px] md:text-base leading-[1.6] text-cream/70 max-w-prose">
              El día que una certificación aparezca en esta página como obtenida, será
              porque lo está. Es la misma regla que gobierna el resto del sitio: lo que no
              se puede demostrar no se publica.
            </p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <TrackedLink
              href={CTA_CONTACTO.href}
              event="final_contacto_click"
              properties={{ cta_location: 'seguridad' }}
              className="btn inline-flex items-center justify-center rounded-full bg-cream text-void px-8 py-4 text-[13px] font-600 tracking-[0.02em] hover:opacity-90"
            >
              Hablemos de seguridad
            </TrackedLink>
            <p className="text-[13px] leading-[1.6] text-cream/70 max-w-[42ch]">
              Si necesitas detalle sobre arquitectura, tratamiento de datos o el acuerdo de
              tratamiento (DPA), hablas directamente con quien lo ha construido.
            </p>
          </div>
          <p className="mt-10 text-[13px] leading-[1.6] text-cream/70 max-w-prose">
            Las condiciones de tratamiento están en{' '}
            <Link
              href="/privacidad"
              className="text-gold/85 underline decoration-gold/30 underline-offset-4 hover:decoration-gold/85 transition-colors"
            >
              Privacidad
            </Link>{' '}
            y en{' '}
            <Link
              href="/ia-responsable"
              className="text-gold/85 underline decoration-gold/30 underline-offset-4 hover:decoration-gold/85 transition-colors"
            >
              IA responsable
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
