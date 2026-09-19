import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { C, CtaSobreOscuro, Fuentes, cuerpo, enlace } from '@/components/Conocimiento'
import { metadatosDePagina } from '@/lib/metadatos'
import { jsonLdDeIndice } from '@/lib/conocimiento'

/**
 * /ai-search — la entrada al grupo de piezas sobre AI Search.
 *
 * ── QUÉ RESPONDE, Y QUÉ NO ────────────────────────────────────────────────
 * Responde QUÉ es AI Search y POR QUÉ le importa a una empresa. El CÓMO tiene
 * su pieza (/ai-search/preparar-una-web) y llms.txt tiene la suya
 * (/ai-search/llms-txt). Si esta página explicara el cómo, competiría con sus
 * propias hijas por la misma pregunta y las tres dirían lo mismo peor.
 *
 * ── POR QUÉ NO ES UN «Article» ────────────────────────────────────────────
 * Un hub no es un texto fechado que alguien firma: es la entrada a un tema y se
 * actualiza cuando cambia el tema. Declara `WebPage` con `hasPart` hacia las
 * dos piezas, y no declara fechas, porque no habría un hecho detrás. Las
 * fuentes sí llevan la fecha en que se consultaron, que sí lo es.
 *
 * ── COMPOSICIÓN ───────────────────────────────────────────────────────────
 * Distinta de las hijas a propósito: ellas numeran sus secciones (01, 02…)
 * porque son un recorrido; aquí manda una etiqueta a la izquierda, porque es
 * un mapa. Mismo sistema tipográfico, mismos colores, ni un tamaño nuevo.
 *
 * ── REGLAS ────────────────────────────────────────────────────────────────
 * · Cada afirmación sobre un proveedor sale de su documentación, y está en
 *   «Fuentes» con la fecha en que se consultó.
 * · No se promete aparecer, ser citado ni ser recomendado en ningún sistema.
 * · Ningún claim `pending` de `lib/verified-claims.ts`: `check:claims` recorre
 *   esta ruta.
 * · Sin `Reveal`: nada de esta página existe sólo animado.
 */

const RUTA = '/ai-search'
const CONSULTADAS = '2026-09-20'
const TITULAR = 'Qué es AI Search y qué significa para una empresa'
const DESCRIPCION =
  'Qué es AI Search, en qué se diferencia de la búsqueda tradicional, qué tiene que entender una máquina sobre una empresa y qué puede hacer una empresa hoy.'

const PIEZAS = [
  {
    ruta: '/ai-search/preparar-una-web',
    titulo: 'Cómo preparar una web para buscadores y sistemas de IA',
    resumen:
      'Las seis condiciones, una por una: rastreo, contenido en el documento, entidad, datos estructurados, páginas que responden y autoridad. Qué se puede medir y qué no se puede garantizar.',
  },
  {
    ruta: '/ai-search/llms-txt',
    titulo: '¿Qué es llms.txt y sirve realmente para algo?',
    resumen:
      'Qué es ese fichero, qué está documentado y qué no, en qué se diferencia de robots.txt y qué conviene resolver antes de crear uno.',
  },
] as const

export const metadata: Metadata = metadatosDePagina({
  titulo: `${TITULAR} — VELIA`,
  tituloAlCompartir: TITULAR,
  descripcion: DESCRIPCION,
  ruta: RUTA,
})

const FUENTES = [
  {
    href: 'https://developers.google.com/search/docs/appearance/ai-features',
    texto: 'Google Search Central: las funciones de IA y tu web',
  },
  {
    href: 'https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers',
    texto: 'Google Search Central: rastreadores comunes de Google, incluido Google-Extended',
  },
  { href: 'https://developers.openai.com/api/docs/bots', texto: 'OpenAI: rastreadores y agentes de usuario' },
  {
    href: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
    texto: 'Anthropic: sus rastreadores y cómo bloquearlos',
  },
  { href: 'https://docs.perplexity.ai/guides/bots', texto: 'Perplexity: rastreadores de Perplexity' },
] as const

const jsonLd = jsonLdDeIndice({
  ruta: RUTA,
  titular: TITULAR,
  descripcion: DESCRIPCION,
  piezas: PIEZAS.map(p => p.ruta),
})

/** Una sección del mapa: etiqueta a la izquierda, respuesta arriba del todo. */
function Bloque({
  id,
  etiqueta,
  titulo,
  respuesta,
  children,
}: {
  id: string
  etiqueta: string
  titulo: string
  respuesta: ReactNode
  children?: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`t-${id}`} className="mx-auto max-w-6xl px-6 md:px-10 scroll-mt-24">
      <div className="hairline py-14 md:py-20 grid gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,11rem)_1fr]">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink lg:pt-3">{etiqueta}</p>
        <div className="max-w-3xl">
          <h2 id={`t-${id}`} className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-600 tracking-[-0.03em] leading-[1.12] text-void">
            {titulo}
          </h2>
          <p className="mt-5 max-w-prose text-lg md:text-xl leading-[1.55] text-void/85">{respuesta}</p>
          {children && <div className="mt-6 space-y-5">{children}</div>}
        </div>
      </div>
    </section>
  )
}

export default function AiSearchPage() {
  return (
    <>
      {/* Fuera del <article>: dentro, un extractor que lea el texto con
          `textContent` se llevaría también el JSON. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>

      {/* ═══ CABECERA ════════════════════════════════════════════════════ */}
      <header className="mx-auto max-w-6xl px-6 md:px-10 pt-20 pb-14 md:pt-28 md:pb-20">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">AI Search</p>
        <h1 className="mt-6 text-[clamp(2.15rem,5.6vw,4.5rem)] font-600 tracking-[-0.035em] leading-[1.04] text-void max-w-[17ch]">
          {TITULAR}
        </h1>
        <p className="mt-8 text-lg md:text-xl leading-[1.6] text-void/70 max-w-prose">
          AI Search es la búsqueda en la que un sistema redacta la respuesta a partir de varias
          fuentes, en lugar de devolver sólo una lista de enlaces. Cambia cómo llega alguien hasta
          un negocio. No cambia lo que hace falta para que su web pueda ser encontrada, entendida y
          usada como fuente.
        </p>
        <p className={`mt-5 ${cuerpo}`}>
          Esta página explica qué es, por qué le importa a una empresa y qué significa en la
          práctica. Lo que hay que hacer, condición por condición, está en las dos piezas que
          cuelgan de aquí.
        </p>
      </header>

      {/* ═══ LO QUE ESTÁ CAMBIANDO ═══════════════════════════════════════
          El único bloque sobre fondo blanco: es el planteamiento, y conviene
          que se lea de una vez antes del mapa. */}
      <section id="cambio" aria-labelledby="t-cambio" className="bg-white border-y border-mist scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-20 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <h2 id="t-cambio" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void">
              Lo que está cambiando
            </h2>
          </div>
          <div className="space-y-5">
            <p className={cuerpo}>
              Durante veinte años, buscar fue escribir unas palabras y elegir entre una lista de
              enlaces. Ahora, además, la respuesta puede redactarla un sistema: Google la genera
              sobre sus resultados y enlaza las páginas en las que se apoya; ChatGPT y Perplexity
              responden citando fuentes; un agente lee una web en nombre de alguien que quizá no la
              abra nunca.
            </p>
            <p className={cuerpo}>
              Para un negocio eso cambia una cosa concreta: entre su web y su cliente puede haber
              una máquina que lee, resume y decide qué merece citarse. Esa máquina no navega como
              una persona ni interpreta lo que quisiste decir. Lee lo que hay.
            </p>
            <p className="max-w-prose text-[15px] md:text-base leading-[1.6] text-void/85">
              Lo importante no es la novedad, sino la consecuencia: lo que una empresa no deja claro
              en su web, otro lo dirá por ella.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ QUÉ ES ══════════════════════════════════════════════════════ */}
      <Bloque
        id="que-es"
        etiqueta="Definición"
        titulo="Qué es AI Search"
        respuesta="AI Search es la búsqueda cuya respuesta redacta un sistema a partir de varias fuentes: las respuestas generadas por IA de Google, la búsqueda de ChatGPT, Perplexity y cualquier asistente que consulte la web para responder."
      >
        <p className={cuerpo}>
          Cambia la forma de la respuesta; no cambia que el sistema necesite encontrar, leer y
          entender las fuentes con las que la escribe. Los proveedores lo documentan como lo que es:
          Google exige que una página esté indexada y pueda mostrarse con un fragmento para aparecer
          como enlace de apoyo en sus funciones de IA; OpenAI usa <C>OAI-SearchBot</C> para
          «mostrar sitios en los resultados de búsqueda de ChatGPT»; Perplexity usa{' '}
          <C>PerplexityBot</C> para mostrar y enlazar webs en sus resultados; Anthropic usa{' '}
          <C>Claude-SearchBot</C> para mejorar la calidad de esos resultados.
        </p>
        <p className={cuerpo}>
          Conviene no confundirlo con que un modelo «sepa» algo de ti porque lo aprendió al
          entrenarse. Son dos cosas distintas, y los proveedores las gobiernan por separado: el
          rastreador de búsqueda de OpenAI no es el de entrenamiento, y Google documenta que{' '}
          <C>Google-Extended</C> —que controla el uso de contenido para entrenar Gemini— no afecta
          a la inclusión de un sitio en Google Search ni se usa como señal de posicionamiento.
        </p>
        <p className={cuerpo}>
          A esto se le llama de muchas maneras: GEO, SEO para IA, optimización para respuestas. Los
          nombres se multiplican más rápido que la documentación. Lo que puede comprobarse es lo que
          cada proveedor publica sobre cómo accede a las webs y qué pide para mostrarlas.
        </p>
      </Bloque>

      {/* ═══ QUÉ TIENE QUE ENTENDER UNA MÁQUINA ══════════════════════════ */}
      <Bloque
        id="entender"
        etiqueta="El problema"
        titulo="Qué tiene que entender una máquina sobre una empresa"
        respuesta="Para usar a una empresa como fuente, una máquina tiene que entender tres cosas: quién es, qué dice y para qué preguntas es pertinente. Las tres se leen de la web, no se suponen."
      >
        <dl className="space-y-5">
          {(
            [
              [
                'Quién es',
                <>
                  Una sola descripción coherente —qué empresa, qué hace, dónde y quién responde— en
                  todas las superficies que una máquina lee: títulos, descripciones, encabezados,
                  datos estructurados y cualquier fichero pensado para ellas. Si dos páginas
                  describen a dos empresas distintas, las dos cuentan. Aquí entra también lo que
                  haces con los datos de tus clientes, que es una pregunta que alguien acabará
                  haciendo: nosotros lo publicamos en{' '}
                  <Link href="/seguridad" className={enlace}>
                    la página de seguridad
                  </Link>
                  , con lo que hay y lo que todavía no.
                </>,
              ],
              [
                'Qué dice',
                <>
                  El texto tiene que estar en el documento que entrega el servidor, con su jerarquía
                  y sus enlaces, sin depender de que se ejecute JavaScript ni de que alguien pulse
                  algo. Lo que sólo aparece después de una interacción puede no llegar a leerse
                  nunca.
                </>,
              ],
              [
                'Para qué preguntas sirve',
                <>
                  Que exista una página que responda una pregunta concreta, de forma autosuficiente
                  y con evidencia comprobable. Una web que sólo se describe a sí misma es difícil de
                  citar, porque no responde nada.
                </>,
              ],
            ] as [string, ReactNode][]
          ).map(([termino, texto]) => (
            <div key={termino} className="lg:grid lg:grid-cols-[11rem_1fr] lg:gap-8">
              <dt className="text-[15px] md:text-base font-600 text-void">{termino}</dt>
              <dd className={`mt-1.5 lg:mt-0 ${cuerpo}`}>{texto}</dd>
            </div>
          ))}
        </dl>
      </Bloque>

      {/* ═══ QUÉ PUEDE HACER UNA EMPRESA ═════════════════════════════════
          Cuatro condiciones, una línea cada una. El desarrollo es de la guía:
          si se explicara aquí, las dos páginas responderían lo mismo. */}
      <Bloque
        id="hacer"
        etiqueta="Lo que depende de ti"
        titulo="Qué puede hacer una empresa hoy"
        respuesta="Hoy una empresa puede asegurarse de que su web se pueda rastrear, de que su contenido esté en el HTML, de que describa a una sola empresa, de que responda preguntas con evidencia y de que su autoridad exista fuera de su dominio. Eso está bajo su control; lo demás, no."
      >
        <ul className={`list-disc pl-5 space-y-2 ${cuerpo}`}>
          <li>
            <strong className="font-600 text-void">Rastreabilidad</strong>: que el{' '}
            <C>robots.txt</C>, los códigos de respuesta, las direcciones canónicas y el sitemap
            digan lo mismo, y que nada importante quede detrás de un inicio de sesión.
          </li>
          <li>
            <strong className="font-600 text-void">Legibilidad por máquinas</strong>: contenido en
            el documento, encabezados con jerarquía, listas que son listas, fechas que son fechas y
            datos estructurados que dicen lo mismo que el texto.
          </li>
          <li>
            <strong className="font-600 text-void">Contenido útil</strong>: páginas que responden
            preguntas concretas con criterio propio y evidencia que se puede comprobar.
          </li>
          <li>
            <strong className="font-600 text-void">Autoridad fuera del dominio</strong>: perfiles,
            menciones y referencias que otros pueden verificar. No se declara: se gana.
          </li>
        </ul>
        <p className={cuerpo}>
          Cada una, con lo que hay que revisar y lo que decidimos en esta misma web, está en{' '}
          <Link href="/ai-search/preparar-una-web" className={enlace}>
            la guía
          </Link>
          .
        </p>
      </Bloque>

      {/* ═══ QUÉ CAMBIA Y QUÉ NO ═════════════════════════════════════════
          Dos listas enfrentadas: es una comparación, y leerla en paralelo es
          justamente el argumento. */}
      <Bloque
        id="cambia"
        etiqueta="La confusión"
        titulo="Qué cambia y qué no"
        respuesta="AI Search no es un SEO nuevo que sustituya al anterior. Cambia la forma de la respuesta y quién la lee; no cambian los requisitos que los proveedores documentan para poder mostrar una página."
      >
        <div className="!mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Cambia</h3>
            <ul className={`mt-4 list-disc pl-5 space-y-2 ${cuerpo}`}>
              <li>La forma de la respuesta: un texto redactado con algunas fuentes, en lugar de una lista.</li>
              <li>Quién lee: además de personas, rastreadores y agentes que resumen y deciden qué citar.</li>
              <li>Que una duda pueda resolverse sin que nadie abra la web.</li>
              <li>La medición: ser citado o mencionado no aparece en ningún informe general de los proveedores.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">No cambia</h3>
            <ul className={`mt-4 list-disc pl-5 space-y-2 ${cuerpo}`}>
              <li>Que la página tenga que poder rastrearse e indexarse: Google lo exige también para sus funciones de IA.</li>
              <li>Que el contenido tenga que estar en el HTML que entrega el servidor.</li>
              <li>Que la empresa tenga que ser una sola en todas sus superficies.</li>
              <li>Que la autoridad venga de fuera del propio dominio.</li>
              <li>
                Que no haga falta ningún fichero especial: Google escribe que no hace falta crear
                «nuevos archivos legibles por máquina, archivos de texto para IA ni marcado» para
                aparecer en sus funciones de IA.
              </li>
            </ul>
          </div>
        </div>
      </Bloque>

      {/* ═══ QUÉ PUEDE MEDIRSE ═══════════════════════════════════════════ */}
      <Bloque
        id="medir"
        etiqueta="La medición"
        titulo="Qué puede medirse, y qué sólo puede observarse"
        respuesta="Seis capas, de la más técnica a la de negocio: indexación, aparición, citación, referencia, visitas y conversión. La regla más útil es no mezclarlas."
      >
        <ol className={`list-decimal pl-5 space-y-2 ${cuerpo}`}>
          <li><strong className="font-600 text-void">Indexación</strong>: si la página está en el índice de un buscador.</li>
          <li><strong className="font-600 text-void">Aparición</strong>: para qué consultas se muestra y cuántas veces. Google incluye la actividad de sus funciones de IA en los totales de Search Console.</li>
          <li><strong className="font-600 text-void">Citación</strong>: si una respuesta generada usa la página como fuente. Se observa repitiendo preguntas; no hay un informe general.</li>
          <li><strong className="font-600 text-void">Referencia</strong>: si el sistema menciona a la empresa sin enlazarla. Sólo se observa a mano.</li>
          <li><strong className="font-600 text-void">Visitas</strong>: cuántas llegan desde buscadores y desde sistemas de IA.</li>
          <li><strong className="font-600 text-void">Conversión</strong>: qué hacen esas visitas. Depende por completo de tu propia medición.</li>
        </ol>
        <p className={cuerpo}>
          Estar indexado no es aparecer, aparecer no es ser citado y ser citado no es que alguien
          llegue. Una única puntuación que mezcle las seis está estimando, no midiendo. El detalle
          de cada capa, con las herramientas que las informan, está en{' '}
          <Link href="/ai-search/preparar-una-web#medir" className={enlace}>
            la guía
          </Link>
          .
        </p>
      </Bloque>

      {/* ═══ POR DÓNDE EMPEZAR ═══════════════════════════════════════════
          Las dos piezas, con la pregunta que responde cada una. No son
          tarjetas: son dos filas de un índice. */}
      <section id="empezar" aria-labelledby="t-empezar" className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-20 scroll-mt-24">
        <h2 id="t-empezar" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
          Por dónde empezar
        </h2>
        <p className={`mt-5 ${cuerpo}`}>
          Dos piezas, dos preguntas distintas. La primera es el trabajo; la segunda, la duda que más
          se repite al empezarlo.
        </p>
        <ul className="mt-10">
          {PIEZAS.map(p => (
            <li key={p.ruta} className="hairline py-7 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10">
              <h3 className="text-lg md:text-xl font-600 tracking-[-0.015em]">
                <Link href={p.ruta} className="text-void hover:text-gold-ink transition-colors">
                  {p.titulo}
                </Link>
              </h3>
              <p className={`mt-2 lg:mt-1 ${cuerpo}`}>{p.resumen}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══ CIERRE ══════════════════════════════════════════════════════ */}
      <section aria-labelledby="t-cierre" className="velia-dark-stage bg-void text-cream mt-6">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 id="t-cierre" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1]">
              De esto no sale una lista de trucos
            </h2>
            <div className="mt-6 max-w-prose space-y-5 text-[15px] md:text-base leading-[1.6] text-cream/70">
              <p>
                Sale criterio: saber qué depende de ti, qué depende de un proveedor que cambia sus
                reglas y qué no depende de nadie. Con eso se decide dónde invertir el esfuerzo y
                dónde no, y se reconoce una promesa que no se puede cumplir.
              </p>
              <p>
                Publicamos esto porque es el trabajo que hacemos. En VELIA es la capacidad que
                llamamos{' '}
                <Link
                  href="/#capacidades"
                  className="font-600 text-gold/85 underline decoration-gold/30 underline-offset-4 hover:decoration-gold/85 transition-colors"
                >
                  AI Search &amp; Digital Visibility
                </Link>
                , y se aplica igual a esta web que a la de un cliente: ninguna afirmación sin una
                fuente detrás, que es{' '}
                <Link
                  href="/sobre-velia"
                  className="font-600 text-gold/85 underline decoration-gold/30 underline-offset-4 hover:decoration-gold/85 transition-colors"
                >
                  una de las cuatro reglas con las que decidimos
                </Link>
                .
              </p>
              <p className="text-cream/85">
                Lo que sí se puede prometer: mejorar las condiciones para ser descubierto, entendido,
                puesto en contexto y tenido en cuenta. Ni posiciones, ni apariciones, ni citas.
              </p>
            </div>
            <CtaSobreOscuro ubicacion="hub_ai_search" />
          </div>
        </div>
      </section>

      <Fuentes fuentes={FUENTES} consultadas={CONSULTADAS} />
      </article>
    </>
  )
}
