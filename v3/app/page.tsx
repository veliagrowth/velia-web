import TrackedLink from '@/components/TrackedLink'
import Umbral from '@/components/Umbral'
import Reveal from '@/components/Reveal'
import SectionViewMarker from '@/components/SectionViewMarker'
import ElCambio from '@/components/ElCambio'
import Distancia from '@/components/Distancia'
import Capacidades from '@/components/Capacidades'
import VeliaOS from '@/components/VeliaOS'
import ModeloOperativo from '@/components/ModeloOperativo'
import { CTA_CONTACTO, CONTACTO_MICROCOPY } from '@/lib/cta'

/**
 * Home — VELIA WEB REWORK 2026.
 *
 * Sustituye a la home de VELIA Legal (SaaS jurídico, 99 €/mes, prueba gratuita,
 * demo embebida y programa Fundadores). Aquella vendía un producto; esta
 * presenta una compañía.
 *
 * Dirección completa: velia-core/docs/design/VELIA_WEB_DIRECTION_2026.md
 *
 * OCHO MOMENTOS, no diez secciones con la misma forma. Ninguna sección tiene la
 * composición de la anterior, y el fondo solo cambia cuando cambia lo que se
 * está contando:
 *
 *   0  UMBRAL        blanco puro  · el logotipo · nada más
 *   1  AFIRMACIÓN    Pearl Cloud  · el ÚNICO h1 de la página
 *   2  EL CAMBIO     Pearl Cloud  · 1.0 → 4.0, y dónde está tu empresa
 *   3  LA DISTANCIA  blanco       · fragmentos sueltos → una sola infraestructura
 *   4  CAPACIDADES   Pearl Cloud  · las cuatro, en composición editorial
 *   5  VELIA OS      NIGHT        ← corte 1: aquí se entra en la infraestructura
 *   6  CÓMO OPERAMOS blanco       · seis fases, y las dos últimas no terminan
 *   7  PRUEBA        Pearl Cloud  · Cónsul Jurídico, sin una cifra inventada
 *   8  CIERRE        NIGHT        ← corte 2: una sola acción
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
          El único h1 de la página. Una sola frase sostiene la home, como en
          Block: dice quién hace qué, para qué, y no se podría copiar a la web
          de otro sin que quedara mal. */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 pt-20 pb-16 md:pt-32 md:pb-24">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">
          Transformación y operación digital
        </p>
        <h1 className="mt-6 text-[clamp(2.15rem,5.6vw,4.5rem)] font-600 tracking-[-0.035em] leading-[1.04] text-void max-w-[17ch]">
          Construimos y operamos la infraestructura digital con la que una empresa compite en
          la nueva era.
        </h1>
        <p className="mt-8 text-lg md:text-xl leading-[1.6] text-void/70 max-w-prose">
          No vendemos una herramienta ni entregamos un proyecto y desaparecemos. Diseñamos el
          sistema digital de un negocio, lo construimos, lo integramos, lo automatizamos y nos
          quedamos operándolo.
        </p>
      </section>

      {/* ═══ 2 · EL CAMBIO ════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 pb-20 md:pb-28">
        <SectionViewMarker event="shift_section_view" />
        <div className="hairline pt-12 md:pt-16">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">El cambio</p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
            La infraestructura de una empresa envejece más despacio que su entorno.
          </h2>
        </div>
        <ElCambio />
      </section>

      {/* ═══ 3 · LA DISTANCIA ═════════════════════════════════════════════
          Blanco, no Pearl Cloud: es el momento más concreto de la página y
          conviene que respire distinto al resto. */}
      <section className="bg-white border-y border-mist">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">La distancia</p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[22ch]">
            El problema casi nunca es que falte una herramienta.
          </h2>
          <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-void/65 max-w-prose">
            Es que hay siete, no se hablan entre ellas, y nadie responde del conjunto.
          </p>
          <Distancia />
        </div>
      </section>

      {/* ═══ 4 · CAPACIDADES ══════════════════════════════════════════════ */}
      <section id="capacidades" className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28 scroll-mt-20">
        <SectionViewMarker event="capabilities_section_view" />
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Qué hacemos</p>
        <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
          Cuatro capacidades, no un catálogo de servicios.
        </h2>
        <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-void/65 max-w-prose">
          Un proyecto casi nunca necesita las cuatro a la vez. Necesita empezar por la que
          está bloqueando a las demás.
        </p>
        <Capacidades />
      </section>

      {/* ═══ 5 · VELIA OS · CORTE OSCURO 1 ════════════════════════════════ */}
      <section id="velia-os" className="velia-dark-stage bg-void text-cream scroll-mt-20">
        <SectionViewMarker event="velia_os_view" />
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85">VELIA OS</p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] max-w-[20ch]">
            Detrás de cada cliente hay infraestructura nuestra.
          </h2>
          <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-cream/70 max-w-prose">
            No es un producto que se venda por separado: es con lo que VELIA trabaja. Y como
            aquí es fácil prometer de más, esto es lo que funciona hoy y lo que todavía no.
          </p>
          <VeliaOS />
        </div>
      </section>

      {/* ═══ 6 · CÓMO OPERAMOS ════════════════════════════════════════════ */}
      <section id="operamos" className="bg-white border-b border-mist scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <SectionViewMarker event="operating_model_view" />
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Cómo trabajamos</p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
            Seis fases. Las dos últimas no tienen fecha de fin.
          </h2>
          <ModeloOperativo />
        </div>
      </section>

      {/* ═══ 7 · PRUEBA ═══════════════════════════════════════════════════
          Sin una sola cifra. Las que había —+260 % de consultas, menos de 5 min
          de respuesta, 12 h/semana— se retiraron el 29-jul: eran métricas de
          captación, no de producto, y su fuente no era verificable. Queda lo que
          sí se puede comprobar: un cliente con nombre, un enlace que funciona, y
          un proceso. */}
      <section id="caso" className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28 scroll-mt-20">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Un caso real</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
              Cónsul Jurídico no necesitaba un programa. Necesitaba un sistema.
            </h2>
            <p className="mt-6 text-[15px] md:text-base leading-[1.6] text-void/70 max-w-prose">
              Un despacho en Fraga que arrancaba de cero. Empezó con herramientas de terceros
              enganchadas entre sí, porque era lo que había. Lo que necesitaba de verdad
              —captación, expedientes, documentos, agenda, un portal para sus propios
              clientes— acabó construyéndose a medida.
            </p>
            <p className="mt-4 text-[15px] md:text-base leading-[1.6] text-void/70 max-w-prose">
              Sigue siendo cliente, y VELIA sigue operando su infraestructura. Lo que se
              aprendió construyéndola es hoy parte de lo que se le ofrece a cualquier otro
              negocio: ese es el modelo entero, en un caso.
            </p>
            <p className="mt-8">
              <a
                href="https://consuljuridico.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
              >
                consuljuridico.com
              </a>
            </p>
          </div>

          <Reveal delay={80}>
            <div className="rounded-lg border border-mist bg-white p-7 md:p-9">
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65 mb-6">
                El proceso, que es lo que se repite
              </p>
              <ol className="space-y-4">
                {[
                  'Una necesidad real, no un catálogo',
                  'Se diseña la solución',
                  'Se construye la infraestructura',
                  'Se opera',
                  'Se aprende',
                  'El aprendizaje se convierte en infraestructura reutilizable',
                ].map((paso, i) => (
                  <li key={paso} className="flex gap-4">
                    <span className="text-[12px] font-600 text-void/65 tabular-nums pt-0.5 w-5 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[15px] leading-[1.5] text-void/80">{paso}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-7 pt-6 border-t border-mist text-[13px] leading-[1.6] text-void/65">
                VELIA no es una empresa jurídica: es la compañía que construyó y opera la
                infraestructura de este despacho.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 8 · CIERRE · CORTE OSCURO 2 ══════════════════════════════════
          Una acción. Sin formulario embebido, sin segundo botón, sin «o si
          prefieres…». Quien ha llegado hasta aquí ya ha decidido si quiere
          hablar; lo único que hace falta es no ponérselo difícil. */}
      <section className="velia-dark-stage bg-void text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
          {/* Es un h2, no un <p>: es el encabezado de esta sección, y sin él
              la última sección de la página no existe en el esquema de
              encabezados — quien navega por titulares se salta el cierre.
              La serif es la ÚNICA vez que aparece en toda la web. */}
          <h2 className="font-serif font-400 text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] tracking-[-0.02em] max-w-[19ch]">
            La infraestructura digital de tu empresa ya está decidiendo si compites.
          </h2>
          <p className="mt-8 text-[15px] md:text-base leading-[1.6] text-cream/70 max-w-prose">
            La primera conversación no es una demostración de producto ni una propuesta
            comercial. Es entender cómo trabajáis hoy y decir con qué empezaríamos.
          </p>
          {/* `TrackedLink` y no `Link` pelado: este es el ÚNICO CTA de toda la
              Home, y su evento —`final_contacto_click`— llevaba declarado en
              `lib/analytics.ts` y aceptado por el buzón del portal desde que se
              escribió la Home nueva, sin que lo emitiera nadie.

              No daba ningún error, y ésa es justo la forma del fallo: el embudo
              habría enseñado los `nav_contacto_click` del header y CERO
              conversiones desde el cierre, que se lee como «el cierre no
              convierte» cuando lo que pasa es que no se mide. Un evento
              declarado sin emisor no es una métrica pendiente: es una métrica
              que miente con un cero. */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <TrackedLink
              href={CTA_CONTACTO.href}
              event="final_contacto_click"
              properties={{ cta_location: 'home_cierre' }}
              className="btn inline-flex items-center justify-center rounded-full bg-cream text-void px-8 py-4 text-[13px] font-600 tracking-[0.02em] hover:opacity-90"
            >
              {CTA_CONTACTO.label}
            </TrackedLink>
            <p className="text-[13px] text-cream/60">{CONTACTO_MICROCOPY}</p>
          </div>
        </div>
      </section>
    </>
  )
}
