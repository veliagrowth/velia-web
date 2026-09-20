import Link from 'next/link'
import { CtaSobreOscuro } from '@/components/Conocimiento'
import Umbral from '@/components/Umbral'
import SectionViewMarker from '@/components/SectionViewMarker'
import ElCambio from '@/components/ElCambio'
import Distancia from '@/components/Distancia'
import Capacidades from '@/components/Capacidades'
import Casos from '@/components/Casos'
import ModeloOperativo from '@/components/ModeloOperativo'

/**
 * Home — VELIA WEB REWORK 2026.
 *
 * Sustituye a la home de VELIA Legal (SaaS jurídico, 99 €/mes, prueba gratuita,
 * demo embebida y programa Fundadores). Aquella vendía un producto; esta
 * presenta una compañía.
 *
 * Dirección completa: velia-core/docs/design/VELIA_WEB_DIRECTION_2026.md
 *
 * ── SIMPLIFICACIÓN DEL 20-sep-2026 ────────────────────────────────────────
 * La versión anterior tenía ocho momentos y dedicaba dos a explicar la
 * maquinaria: «VELIA OS» (producción / construcción / Control Plane) y las seis
 * fases. Para entender qué gana un cliente había que atravesar antes la
 * arquitectura interna de la casa.
 *
 * Ahora el orden es RESULTADO → CAPACIDAD → PRUEBA → ACCIÓN:
 *
 *   0  UMBRAL      blanco puro  · el logotipo · nada más
 *   1  AFIRMACIÓN  Pearl Cloud  · el ÚNICO h1
 *   2  RESULTADO   Pearl Cloud  · qué cambia: de siete herramientas sueltas a un sistema
 *   3  CAPACIDADES Pearl Cloud  · las cuatro
 *   4  TRABAJO     NIGHT        ← corte 1: cuatro proyectos con nombre y dominio
 *   5  CÓMO        blanco       · seis fases, y las dos últimas no terminan
 *   6  POR QUÉ     Pearl Cloud  · tres diferencias, sin adjetivos
 *   7  CIERRE      NIGHT        ← corte 2: una sola acción
 *
 * LO QUE SE FUE, Y DÓNDE ESTÁ: el detalle de infraestructura —qué está en
 * marcha y qué se está construyendo— vive ahora en `/sobre-velia`. No se ha
 * borrado ni suavizado: se ha movido al sitio donde lo busca quien quiere ese
 * nivel de detalle. La Home dice que existe y enlaza.
 *
 * UNA SOLA ACCIÓN EN TODA LA PÁGINA. La home anterior tenía dos que competían
 * («Probar gratis» y «Ver demo») porque había un producto que probar. Aquí no lo
 * hay: VELIA no vende una herramienta, así que lo único que se puede pedir es
 * una conversación. Un segundo CTA solo restaría.
 *
 * NINGUNA RUTA LEGACY SE ENLAZA desde aquí. `/precios`, `/demo`, `/fundadores` y
 * `/legal` siguen vivas y respondiendo 200 — ver el inventario en velia-core.
 *
 * EL UMBRAL NO ES UNA PUERTA: todo lo que sigue está en el HTML servido, y se
 * lee entero sin JavaScript. Es la condición que hace verdadero lo que la propia
 * página afirma sobre ser legible por máquinas.
 */

/* ⚠️ AQUÍ NO VA NINGÚN JSON-LD (12-sep-2026).
   Había un `Organization` en esta página Y otro en `app/layout.tsx`, con
   descripciones distintas: dos declaraciones de la misma entidad, con la misma
   `url`, diciendo cosas parecidas pero no iguales. Son dos relojes, y en cuanto
   se toca uno dejan de dar la misma hora — justo lo contrario de la claridad de
   entidad que esta web dice saber preparar.

   Queda el del layout, que además cubre TODAS las páginas y no sólo ésta. El
   `SoftwareApplication` que hubo aquí tampoco vuelve: declaraba a las máquinas
   una aplicación a la venta, con su precio, mientras la página decía otra cosa. */

export default function Home() {
  return (
    <>
      {/* ═══ 0 · UMBRAL ═══════════════════════════════════════════════════
          Overlay sobre todo lo de abajo, que ya está renderizado. No se monta
          con prefers-reduced-motion ni en la segunda visita de la sesión. */}
      <Umbral />

      {/* ═══ 1 · AFIRMACIÓN ═══════════════════════════════════════════════
          El único h1 de la página. Una sola frase sostiene la home: dice quién
          hace qué, para qué, y no se podría copiar a la web de otro sin que
          quedara mal. */}
      <section aria-labelledby="t-afirmacion" className="mx-auto max-w-6xl px-6 md:px-10 pt-20 pb-16 md:pt-32 md:pb-24">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">
          Transformación y operación digital
        </p>
        <h1 id="t-afirmacion" className="mt-6 text-[clamp(2.15rem,5.6vw,4.5rem)] font-600 tracking-[-0.035em] leading-[1.04] text-void max-w-[17ch]">
          Construimos y operamos la infraestructura digital con la que una empresa compite en
          la nueva era.
        </h1>
        <p className="mt-8 text-lg md:text-xl leading-[1.6] text-void/70 max-w-prose">
          Estrategia, presencia digital, sistemas, automatización e IA para empresas y
          autónomos. No vendemos una herramienta ni entregamos un proyecto y desaparecemos:
          construimos el sistema digital de un negocio y nos quedamos operándolo.
        </p>
      </section>

      {/* ═══ 2 · RESULTADO ════════════════════════════════════════════════
          Antes eran dos secciones: la Revolución 4.0 y «la distancia». La
          primera contaba historia durante media pantalla antes de llegar a lo
          único que le importa a quien lee: qué cambia en su negocio. Ahora el
          contexto ocupa tres líneas y la sección entera va de eso. */}
      <section id="resultado" aria-labelledby="t-resultado" className="mx-auto max-w-6xl px-6 md:px-10 pb-20 md:pb-28 scroll-mt-20">
        <SectionViewMarker event="shift_section_view" />
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Qué cambia</p>
        <h2 id="t-resultado" className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[22ch]">
          El problema casi nunca es que falte una herramienta.
        </h2>
        <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-void/65 max-w-prose">
          Es que hay siete, no se hablan entre ellas, y nadie responde del conjunto.
        </p>
        <ElCambio />
        <Distancia />
      </section>

      {/* ═══ 3 · CAPACIDADES ══════════════════════════════════════════════ */}
      <section id="capacidades" aria-labelledby="t-capacidades" className="bg-white border-y border-mist scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <SectionViewMarker event="capabilities_section_view" />
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Qué hacemos</p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]" id="t-capacidades">
            Cuatro capacidades, no un catálogo de servicios.
          </h2>
          <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-void/65 max-w-prose">
            Un proyecto casi nunca necesita las cuatro a la vez. Necesita empezar por la que
            está bloqueando a las demás.
          </p>
          <Capacidades />
        </div>
      </section>

      {/* ═══ 4 · TRABAJO · CORTE OSCURO 1 ═════════════════════════════════
          Sustituye al antiguo corte oscuro, que era la sección de
          infraestructura. La prueba de que una compañía sabe hacer algo no es
          su arquitectura: son los proyectos donde se ve. */}
      <section id="casos" aria-labelledby="t-casos" className="velia-dark-stage bg-void text-cream scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85">Trabajo</p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] max-w-[20ch]" id="t-casos">
            Cuatro proyectos con nombre y dominio.
          </h2>
          <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-cream/70 max-w-prose">
            Sin cifras: qué es cada proyecto, qué hizo VELIA y dónde comprobarlo.
          </p>
          <Casos />
        </div>
      </section>

      {/* ═══ 5 · CÓMO TRABAJAMOS ══════════════════════════════════════════ */}
      <section id="operamos" aria-labelledby="t-operamos" className="bg-white border-b border-mist scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <SectionViewMarker event="operating_model_view" />
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Cómo trabajamos</p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]" id="t-operamos">
            Seis fases. Las dos últimas no tienen fecha de fin.
          </h2>
          <ModeloOperativo />
        </div>
      </section>

      {/* ═══ 6 · POR QUÉ VELIA ════════════════════════════════════════════
          Tres frases, sin adjetivos y sin una capacidad nueva: cada una es algo
          que ya se afirma en otra parte de esta web y que se puede comprobar.
          El detalle de qué hay montado y qué se está construyendo está en
          /sobre-velia — aquí sólo se dice que existe y se enlaza. */}
      <section id="por-que" aria-labelledby="t-por-que" className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28 scroll-mt-20">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Por qué VELIA</p>
        <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]" id="t-por-que">
          Lo que casi nadie hace: quedarse.
        </h2>
        <ul className="mt-12 md:mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
          {[
            {
              t: 'Construimos, no sólo recomendamos.',
              d: 'Una consultora entrega un informe y una agencia entrega un entregable. Aquí se diseña, se construye y se integra con lo que ya hay.',
            },
            {
              t: 'Operamos lo que construimos.',
              d: 'El sistema funciona todos los días y alguien responde de que funcione. Sin eso, un sistema digital no se queda como estaba: se degrada.',
            },
            {
              t: 'Decimos lo que todavía no está.',
              d: 'Ninguna afirmación llega a esta web sin una fuente detrás, y lo que está a medio construir se publica como lo que es.',
            },
          ].map(x => (
            <li key={x.t}>
              <h3 className="text-base md:text-lg font-600 tracking-[-0.01em] text-void">{x.t}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-void/70">{x.d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[15px] leading-[1.6] text-void/70 max-w-prose">
          Cómo decidimos qué construir, qué infraestructura hay montada hoy y qué estamos
          construyendo:{' '}
          <Link
            href="/sobre-velia"
            className="font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
          >
            sobre VELIA
          </Link>
          .
        </p>
      </section>

      {/* ═══ 7 · CIERRE · CORTE OSCURO 2 ══════════════════════════════════
          Una acción. Sin formulario embebido, sin segundo botón, sin «o si
          prefieres…». Quien ha llegado hasta aquí ya ha decidido si quiere
          hablar; lo único que hace falta es no ponérselo difícil. */}
      <section aria-labelledby="t-cierre" className="velia-dark-stage bg-void text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
          {/* Es un h2, no un <p>: es el encabezado de esta sección, y sin él
              la última sección de la página no existe en el esquema de
              encabezados — quien navega por titulares se salta el cierre.
              La serif es la ÚNICA vez que aparece en toda la web. */}
          <h2 id="t-cierre" className="font-serif font-400 text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] tracking-[-0.02em] max-w-[19ch]">
            La infraestructura digital de tu empresa ya está decidiendo si compites.
          </h2>
          <p className="mt-8 text-[15px] md:text-base leading-[1.6] text-cream/70 max-w-prose">
            La primera conversación no es una demostración de producto ni una propuesta
            comercial. Es entender cómo trabajáis hoy y decir con qué empezaríamos.
          </p>
          {/* El MISMO componente que usan las piezas de conocimiento, y no una
              copia (20-sep). Era el mismo botón con el mismo evento y el mismo
              microcopy escrito dos veces, y ya habían divergido en un detalle:
              aquí el microcopy iba en `cream/60` y en el componente en
              `cream/70`. Dos versiones de lo mismo dejan de parecerse en el
              tercer cambio.

              El evento `final_contacto_click` sigue siendo el de siempre, con
              `cta_location: 'home_cierre'`: llevaba declarado en
              `lib/analytics.ts` y aceptado por el buzón del portal desde que se
              escribió la Home nueva, sin que lo emitiera nadie. Un evento
              declarado sin emisor no es una métrica pendiente: es una métrica
              que miente con un cero. */}
          <CtaSobreOscuro ubicacion="home_cierre" />
        </div>
      </section>
    </>
  )
}
