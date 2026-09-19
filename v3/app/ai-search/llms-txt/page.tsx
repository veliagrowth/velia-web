import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  C,
  CtaSobreOscuro,
  EnNuestraWeb,
  Firma,
  Fuentes,
  SeccionNumerada,
  Terminos,
  cuerpo,
  enlace,
} from '@/components/Conocimiento'
import { metadatosDePagina } from '@/lib/metadatos'
import { jsonLdDeArticulo } from '@/lib/conocimiento'

/**
 * /ai-search/llms-txt — la segunda pieza de conocimiento de VELIA.
 *
 * Responde UNA pregunta: qué es llms.txt y si sirve para algo. La primera
 * pieza (/ai-search/preparar-una-web) ya lo trata en tres párrafos; esta no
 * los repite: va a lo que allí no cabía —la especificación, qué está
 * documentado y qué no, la diferencia con robots.txt y lo que nos pasó con el
 * nuestro— y enlaza a la guía para todo lo demás.
 *
 * ── REGLAS DE ESTA PÁGINA ─────────────────────────────────────────────────
 * · Cada afirmación lleva su clase: HECHO, DOCUMENTACIÓN DEL PROVEEDOR,
 *   OBSERVACIÓN, INFERENCIA o HIPÓTESIS. «No conocemos evidencia» nunca se
 *   escribe como «sabemos que no existe».
 * · Sólo fuentes primarias, en «Fuentes». Las observaciones enlazan el
 *   fichero observado.
 * · No se promete aparecer, ser citado ni ser recomendado en ningún sistema.
 * · Ningún claim `pending` de `lib/verified-claims.ts`. `check:claims` recorre
 *   esta ruta. Por eso la evidencia propia dice «cuatro afirmaciones
 *   pendientes de verificar» y no las nombra: nombrarlas sería publicarlas.
 * · Un solo CTA, en el cierre.
 *
 * ── AUTORÍA Y FECHAS ──────────────────────────────────────────────────────
 * Firmada por la organización: nadie ha firmado este texto (HUMAN_DECISION).
 * `PUBLICADA` es `null` hasta el día en que la pieza llegue a producción; se
 * fija en el release, no antes. `REVISADA` es el día en que se revisaron el
 * contenido y las fuentes.
 */

const RUTA = '/ai-search/llms-txt'
const PUBLICADA: string | null = null
const REVISADA = '2026-09-19'
const TITULAR = '¿Qué es llms.txt y sirve realmente para algo?'
const DESCRIPCION =
  'Qué es llms.txt, qué problema intenta resolver, qué documentan buscadores y sistemas de IA sobre él y qué conviene resolver antes de crear uno.'

export const metadata: Metadata = metadatosDePagina({
  titulo: `${TITULAR} — VELIA`,
  tituloAlCompartir: TITULAR,
  descripcion: DESCRIPCION,
  ruta: RUTA,
  articulo: { publicado: PUBLICADA, modificado: REVISADA },
})

const FUENTES = [
  { href: 'https://llmstxt.org/', texto: 'llms.txt: la propuesta (versión 2, agosto de 2026)' },
  {
    href: 'https://github.com/AnswerDotAI/llms-txt/blob/main/nbs/changes.qmd',
    texto: 'llms.txt: qué cambió en la versión 2',
  },
  { href: 'https://www.rfc-editor.org/rfc/rfc9309.html', texto: 'IETF, RFC 9309: Robots Exclusion Protocol' },
  {
    href: 'https://developers.google.com/search/docs/appearance/ai-features',
    texto: 'Google Search Central: las funciones de IA y tu web',
  },
  {
    href: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro',
    texto: 'Google Search Central: introducción a robots.txt',
  },
  {
    href: 'https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt',
    texto: 'Chrome Lighthouse: la comprobación de llms.txt',
  },
  { href: 'https://developers.openai.com/api/docs/bots', texto: 'OpenAI: rastreadores y agentes de usuario' },
  {
    href: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
    texto: 'Anthropic: sus rastreadores y cómo bloquearlos',
  },
  { href: 'https://docs.perplexity.ai/guides/bots', texto: 'Perplexity: rastreadores de Perplexity' },
] as const

const jsonLd = jsonLdDeArticulo({
  ruta: RUTA,
  titular: TITULAR,
  descripcion: DESCRIPCION,
  publicada: PUBLICADA,
  revisada: REVISADA,
  fuentes: FUENTES,
  dentroDe: '/ai-search',
})

const SECCIONES = [
  { id: 'que-es', titulo: 'Qué es exactamente' },
  { id: 'problema', titulo: 'Qué problema intenta resolver' },
  { id: 'evidencia', titulo: 'Qué está documentado y qué no' },
  { id: 'buscadores', titulo: '¿Lo usan los buscadores y los sistemas de IA?' },
  { id: 'robots-txt', titulo: 'llms.txt no es robots.txt' },
  { id: 'velia', titulo: 'Por qué VELIA mantiene uno' },
  { id: 'antes', titulo: 'Qué resolver antes de crear uno' },
] as const

type IdSeccion = (typeof SECCIONES)[number]['id']

function Seccion({ id, respuesta, children }: { id: IdSeccion; respuesta: ReactNode; children: ReactNode }) {
  const i = SECCIONES.findIndex(s => s.id === id)
  return (
    <SeccionNumerada id={id} numero={String(i + 1).padStart(2, '0')} titulo={SECCIONES[i].titulo} respuesta={respuesta}>
      {children}
    </SeccionNumerada>
  )
}

/** Enlace a una fuente externa observada: se abre aparte, como las Fuentes. */
const Externo = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={enlace}>
    {children}
  </a>
)

/* La tesis de la página, dicha una vez y citada tal cual en dos sitios. */
const TESIS =
  'llms.txt es una capa complementaria: no sustituye la rastreabilidad, el HTML semántico, el contenido útil, una entidad clara, la autoridad ni el trabajo de Search.'

const EJEMPLO = `# Nombre del sitio

> Qué es, en una o dos frases.

Contexto que ayuda a interpretar el resto.

## Páginas

- [Servicios](https://ejemplo.com/servicios): qué ofrece y a quién

## Optional

- [Historia](https://ejemplo.com/historia)`

export default function LlmsTxtPage() {
  return (
    <>
      {/* JSON-LD fuera del <article>: dentro, un extractor que lea el texto
          del artículo con `textContent` se llevaría también el JSON. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>

      {/* ═══ CABECERA ════════════════════════════════════════════════════ */}
      <header className="mx-auto max-w-6xl px-6 md:px-10 pt-20 pb-14 md:pt-28 md:pb-20">
        {/* La etiqueta es el camino de vuelta al hub. `inline-block py-1`:
            a 11 px, la altura de línea sola deja el destino en ~17 px, por
            debajo de los 24 que pide WCAG 2.2 (2.5.8). */}
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">
          <Link href="/ai-search" className="inline-block py-1 hover:text-void transition-colors">
            AI Search
          </Link>
          <span className="text-void/65"> · Guía</span>
        </p>
        <h1 className="mt-6 text-[clamp(2.15rem,5.6vw,4.5rem)] font-600 tracking-[-0.035em] leading-[1.04] text-void max-w-[16ch]">
          {TITULAR}
        </h1>
        <p className="mt-8 text-lg md:text-xl leading-[1.6] text-void/70 max-w-prose">
          llms.txt sirve para algo concreto y más pequeño de lo que se suele contar: es un mapa en
          texto plano que un agente puede leer cuando busca información en una web. No da ni quita
          acceso, no indexa nada y ningún gran buscador ni sistema de IA lo documenta como
          requisito para aparecer.
        </p>
        <p className={`mt-5 ${cuerpo}`}>
          Esta página responde sólo a esa pregunta, y separa lo que es un hecho, lo que documentan
          los proveedores, lo que hemos observado, lo que inferimos y lo que es una hipótesis. Cómo
          se prepara una web entera para buscadores y sistemas de IA está en{' '}
          <Link href="/ai-search/preparar-una-web" className={enlace}>
            nuestra guía sobre ese tema
          </Link>
          .
        </p>
        <Firma publicada={PUBLICADA} revisada={REVISADA} />
      </header>

      {/* ═══ LA RESPUESTA CORTA ══════════════════════════════════════════
          Pregunta → respuesta, en un <dl>: la relación es exactamente esa y
          un extractor la conserva. Quien sólo lea esto se lleva la respuesta
          entera, incluido lo que NO hace. */}
      <section id="respuesta" aria-labelledby="t-respuesta" className="bg-white border-y border-mist scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="t-respuesta" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void">
              La respuesta corta
            </h2>
            <p className={`mt-5 ${cuerpo}`}>
              Cuatro preguntas y sus respuestas. El resto de la página las desarrolla y dice de dónde
              sale cada una.
            </p>
          </div>
          <div>
            <dl className="space-y-6">
              {(
                [
                  [
                    '¿Qué es?',
                    'llms.txt es una propuesta de 2024, revisada en agosto de 2026, para publicar en una web un fichero en Markdown con su nombre, un resumen y enlaces a las páginas que un agente debería leer.',
                  ],
                  [
                    '¿Qué hace?',
                    'Ofrece un mapa corto a quien decida leerlo. llms.txt no bloquea ni autoriza a ningún rastreador, no hace que una página se indexe y no vuelve legible un contenido que no lo es.',
                  ],
                  [
                    '¿Hace falta para aparecer en buscadores o sistemas de IA?',
                    'No. Google documenta que para aparecer en sus funciones de IA no hace falta ningún archivo de texto para IA, y ninguna de las documentaciones de rastreadores que revisamos —Google, OpenAI, Anthropic y Perplexity— dice que lean el de otras webs para elegir fuentes.',
                  ],
                  [
                    '¿Qué conviene resolver antes?',
                    'Antes de crear un llms.txt, una empresa debería asegurarse de que su web se pueda rastrear, de que su contenido esté en el HTML, de que describa a una sola empresa, de que tenga páginas útiles y de que tenga autoridad fuera de su dominio.',
                  ],
                ] as const
              ).map(([pregunta, respuesta]) => (
                <div key={pregunta}>
                  <dt className="text-[15px] md:text-base font-600 text-void">{pregunta}</dt>
                  <dd className="mt-1.5 max-w-prose text-[15px] md:text-base leading-[1.6] text-void/70">{respuesta}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 pt-6 border-t border-mist max-w-prose text-[15px] md:text-base leading-[1.6] text-void/85">
              {TESIS}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 01 · QUÉ ES ═════════════════════════════════════════════════ */}
      <Seccion
        id="que-es"
        respuesta="llms.txt es un fichero de texto en Markdown, en la raíz de una web o en cualquier ruta dentro de ella, con el nombre del sitio, un resumen y listas de enlaces a las páginas que un agente debería leer. Lo propuso Jeremy Howard, de Answer.AI, en septiembre de 2024."
      >
        <p className={cuerpo}>
          La especificación es corta. Lo único obligatorio es un encabezado de primer nivel con el
          nombre del sitio. Después, en este orden y todo opcional: un resumen en forma de cita,
          algunos párrafos de contexto y secciones con listas de enlaces, cada uno con una nota
          breve. Una sección llamada <C>Optional</C> agrupa lo que un agente puede saltarse si
          tiene poco espacio.
        </p>
        {/* `whitespace-pre-wrap`: en móvil las líneas largas se parten en vez
            de obligar a desplazar el bloque en horizontal. */}
        <pre
          aria-label="Ejemplo de llms.txt"
          className="max-w-prose rounded-lg border border-mist bg-white px-5 py-4 text-[14px] leading-[1.6] text-void/80 whitespace-pre-wrap break-words"
        >
          <code>{EJEMPLO}</code>
        </pre>
        <p className={cuerpo}>
          La versión 2, de agosto de 2026, añadió tres cosas: un fichero en una subruta, como{' '}
          <C>/docs/llms.txt</C>, cubre las páginas que cuelgan de ella; cada página puede ofrecer
          una versión en Markdown en su misma dirección terminada en <C>.md</C>; y dos relaciones
          de enlace estándar, <C>rel=&quot;alternate&quot;</C> y <C>rel=&quot;describedby&quot;</C>,
          permiten a un agente encontrar esas versiones y el fichero sin adivinar dónde están.
        </p>
      </Seccion>

      {/* ═══ 02 · PROBLEMA ═══════════════════════════════════════════════ */}
      <Seccion
        id="problema"
        respuesta="llms.txt intenta resolver que las páginas web están hechas para personas: un agente que busca información mientras ayuda a alguien tiene que atravesar navegación, anuncios y código para llegar al texto, y cada palabra de más le cuesta tiempo y espacio."
      >
        <p className={cuerpo}>
          Convertir una página HTML en texto limpio es difícil e impreciso, y la mayoría de las
          webs no caben enteras en lo que un modelo puede leer de una vez. La propuesta ofrece un
          atajo: un sitio conocido donde el propio autor de la web explica qué hay y qué leer
          primero.
        </p>
        <p className={cuerpo}>
          Su autor esperaba que sirviera sobre todo en el momento de responder —cuando un agente
          necesita información mientras atiende a una persona— más que para entrenar modelos, y
          escribe que así se ha usado. También escribe que donde más se usa es en la documentación
          de software, que los agentes de programación recorren para acertar con una llamada a
          una API.
        </p>
      </Seccion>

      {/* ═══ 03 · EVIDENCIA ══════════════════════════════════════════════
          Las cinco clases de afirmación, cada una en su fila. Es el centro
          de la página: mezclarlas es como una propuesta acaba contada como
          una promesa. */}
      <Seccion
        id="evidencia"
        respuesta="De llms.txt está documentado qué es y cómo se escribe, y se puede comprobar que lo publican hasta los propios laboratorios de IA. No está documentado que ningún buscador ni sistema de IA lea el de otras webs para decidir qué mostrar o qué citar."
      >
        <p className={cuerpo}>
          Cinco clases de afirmación, separadas. Mezclarlas es la forma más habitual de convertir
          una propuesta en una promesa.
        </p>
        <Terminos
          className="!mt-8"
          filas={[
            [
              'Hecho',
              <>
                Su propia página la presenta como una propuesta abierta a la comunidad, no como un
                estándar aprobado. Se publicó en septiembre de 2024 y se revisó en agosto de 2026.
                robots.txt, en cambio, es un estándar del IETF, el RFC 9309, desde septiembre de
                2022.
              </>,
            ],
            [
              'Documentación del proveedor',
              <>
                Google escribe que no hace falta crear «nuevos archivos legibles por máquina,
                archivos de texto para IA ni marcado» para aparecer en sus funciones de IA: basta
                con que la página esté indexada y pueda mostrarse con un fragmento. OpenAI,
                Anthropic y Perplexity documentan sus rastreadores y cómo controlarlos con
                robots.txt; ninguna de esas páginas dice que lean el llms.txt de otras webs.
                Lighthouse, la herramienta de auditoría de Chrome, lo revisa de forma informativa:
                sólo avisa si el fichero da un error de servidor y, si no existe, lo marca como no
                aplicable, porque publicarlo es «opcional por ahora».
              </>,
            ],
            [
              'Observación',
              <>
                <Externo href="https://developers.openai.com/api/llms.txt">OpenAI</Externo>,{' '}
                <Externo href="https://platform.claude.com/docs/llms.txt">Anthropic</Externo>,{' '}
                <Externo href="https://ai.google.dev/gemini-api/docs/llms.txt">Google</Externo> —en
                la documentación de la API de Gemini— y{' '}
                <Externo href="https://docs.perplexity.ai/llms.txt">Perplexity</Externo> publican un
                llms.txt para su propia documentación de desarrolladores. Lo comprobamos el 19 de
                septiembre de 2026.
              </>,
            ],
            [
              'Inferencia',
              <>
                Que una empresa publique un llms.txt para su documentación no dice nada de si su
                buscador lee el de los demás: son dos productos distintos. Lo que sí sugiere es que
                espera que agentes y asistentes consulten así su documentación, que es el uso que
                la propuesta describe como principal.
              </>,
            ],
            [
              'Hipótesis',
              <>
                Que algún sistema de búsqueda generativa lo use, o llegue a usarlo, como señal para
                elegir fuentes. No conocemos ninguna evidencia pública de que ocurra. Eso no
                demuestra que no ocurra: demuestra que no se puede contar con ello.
              </>,
            ],
          ]}
        />
      </Seccion>

      {/* ═══ 04 · BUSCADORES ═════════════════════════════════════════════ */}
      <Seccion
        id="buscadores"
        respuesta="Ningún gran buscador ni sistema de IA documenta que use llms.txt para encontrar, elegir o citar fuentes, y Google dice expresamente que no hace falta. Lo que todos documentan es otra cosa: sus rastreadores y robots.txt."
      >
        <p className={cuerpo}>
          Lo que Google pide para que una página pueda aparecer como enlace en sus respuestas
          generadas con IA es lo mismo que para la búsqueda normal: que esté indexada y pueda
          mostrarse con un fragmento. OpenAI, Anthropic y Perplexity distinguen el rastreador que
          alimenta su búsqueda del que visita una página cuando un usuario lo pide, y documentan
          cuáles se gobiernan con robots.txt. OpenAI y Perplexity advierten, además, que el que
          visita una página a petición de un usuario puede no aplicarlo.
        </p>
        <p className={cuerpo}>
          Conviene no llevar la conclusión más lejos de lo que da la evidencia. «No está
          documentado» no significa «sabemos que no lo usan». Significa que nadie puede prometerte
          que lo usen, y que no tiene sentido dedicarle esfuerzo antes que a lo que sí está
          documentado.
        </p>
      </Seccion>

      {/* ═══ 05 · ROBOTS.TXT ═════════════════════════════════════════════
          Una tabla porque es una comparación, fila a fila: `<th scope>` en las
          dos direcciones para que un lector de pantalla —y un extractor—
          sepa qué celda responde a qué. `max-w-2xl` y no `max-w-prose`: una
          tabla no es prosa, y a la medida de lectura cada celda se partía en
          tres o cuatro líneas. */}
      <Seccion
        id="robots-txt"
        respuesta="robots.txt pide a los rastreadores que no accedan a determinadas partes de una web; llms.txt sugiere qué leer. Uno es un estándar que los grandes rastreadores documentan que respetan. El otro, una propuesta que nadie está obligado a leer."
      >
        <table className="!mt-8 w-full max-w-2xl table-fixed border-collapse text-left text-[14px] md:text-[15px] leading-[1.5]">
          <caption className="sr-only">robots.txt y llms.txt, lado a lado</caption>
          <thead>
            <tr className="border-b border-mist">
              <th scope="col" className="w-[30%] py-3 pr-4 align-bottom font-600 text-void/65 text-[11px] tracking-[0.06em] uppercase">
                <span className="sr-only">Aspecto</span>
              </th>
              <th scope="col" className="py-3 pr-4 align-bottom font-600 text-void">
                <C>robots.txt</C>
              </th>
              <th scope="col" className="py-3 align-bottom font-600 text-void">
                <C>llms.txt</C>
              </th>
            </tr>
          </thead>
          <tbody className="text-void/70">
            {(
              [
                ['Para qué sirve', 'Pedir a los rastreadores que no accedan a determinadas rutas', 'Dar a un agente un resumen del sitio y un camino de lectura'],
                ['Estado', 'Estándar del IETF (RFC 9309, 2022)', 'Propuesta abierta (2024; versión 2 en 2026)'],
                ['Quién documenta que lo usa', 'Google, OpenAI, Anthropic y Perplexity, para sus rastreadores', 'Ninguno de ellos, para su búsqueda o sus respuestas'],
                ['¿Controla el acceso?', 'Lo pide. El propio estándar dice que no es un mecanismo de autorización', 'No: no bloquea ni permite nada'],
                ['Si no existe', 'Un rastreador puede acceder a todo', 'No ocurre nada; Lighthouse lo marca como no aplicable'],
              ] as const
            ).map(([aspecto, robots, llms]) => (
              <tr key={aspecto} className="border-b border-mist align-top">
                <th scope="row" className="py-3 pr-4 font-600 text-void/85">
                  {aspecto}
                </th>
                <td className="py-3 pr-4">{robots}</td>
                <td className="py-3">{llms}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={`!mt-8 ${cuerpo}`}>
          La consecuencia práctica: si robots.txt impide el paso a un rastreador, poner esa página
          en llms.txt no lo abre. Y ninguno de los dos sustituye al sitemap, que lista las
          direcciones que quieres que un buscador conozca e indexe.
        </p>
      </Seccion>

      {/* ═══ 06 · VELIA ══════════════════════════════════════════════════ */}
      <Seccion
        id="velia"
        respuesta="VELIA mantiene un llms.txt porque cuesta poco, porque es la descripción de la empresa escrita una vez y en texto plano, y porque un agente que consulte su web puede leerlo. No porque espere que la haga aparecer en ninguna parte."
      >
        <p className={cuerpo}>
          Nuestro <a href="/llms.txt" className={enlace}>llms.txt</a> dice qué es VELIA, qué no es,
          qué capacidades tiene, qué está en producción y qué está en construcción, y enlaza las
          páginas de esta web. Lo tratamos como una superficie más de la empresa, con{' '}
          <Link href="/sobre-velia" className={enlace}>
            la misma regla que el resto de lo que publicamos
          </Link>
          : ninguna afirmación sin una fuente detrás.
        </p>
        <EnNuestraWeb
          hecho="Hasta esta versión de la web, el llms.txt de veliacorp.com describía el producto de software que habíamos descontinuado, con su precio y su prueba gratuita, y recogía cuatro afirmaciones que nuestro propio registro tiene como pendientes de verificar. Lo medimos el 19 de septiembre de 2026. Ninguna comprobación automática lo leía: todas miraban páginas HTML."
          decision={
            <>
              El fichero de esta web describe la empresa actual y pasa las mismas comprobaciones
              automáticas que una página: no puede nombrar el producto retirado, no puede enlazar
              páginas congeladas, no puede quedarse atrás del sitemap y no puede publicar una
              afirmación que no hayamos verificado. No publicamos versiones <C>.md</C> de las
              páginas: el HTML ya entrega el texto completo sin ejecutar JavaScript, y cada copia
              más es otra que mantener.
            </>
          }
          interpretacion="Un llms.txt es otra copia de la identidad de una empresa, escrita para máquinas y que casi nadie de dentro vuelve a leer. Por eso es el sitio donde una descripción antigua sobrevive más tiempo sin que nadie lo note. No tenemos datos de qué sistemas leen el nuestro."
        />
      </Seccion>

      {/* ═══ 07 · ANTES ══════════════════════════════════════════════════
          El orden de prioridad, sin repetir la guía: una línea por punto y
          el enlace a donde cada uno está desarrollado. */}
      <Seccion
        id="antes"
        respuesta="Antes de crear un llms.txt hay que resolver todo lo que hace que una web se pueda encontrar y entender sin él. Si eso no está resuelto, el fichero resume una web que las máquinas no pueden leer bien."
      >
        <ol className={`list-decimal pl-5 space-y-2 ${cuerpo}`}>
          <li>Que se pueda rastrear: robots.txt, códigos de respuesta, direcciones canónicas y sitemap dicen lo mismo.</li>
          <li>Que el contenido esté en el HTML que entrega el servidor, sin depender de JavaScript.</li>
          <li>Que describa a una sola empresa en todas sus superficies, también en las antiguas.</li>
          <li>Que tenga páginas que respondan preguntas concretas con evidencia.</li>
          <li>Que sus datos estructurados digan lo mismo que el texto visible.</li>
          <li>Que tenga autoridad fuera de su propio dominio.</li>
        </ol>
        <p className={cuerpo}>
          Cada punto está desarrollado en{' '}
          <Link href="/ai-search/preparar-una-web" className={enlace}>
            cómo preparar una web para buscadores y sistemas de IA
          </Link>
          .
        </p>
        <p className={cuerpo}>
          Después, si mantenerlo cuesta poco, un llms.txt tiene sentido, sobre todo si publicas
          documentación que consultan agentes: una API, un producto técnico, un manual. Si lo
          creas, trátalo como una página más: que diga lo mismo que la web y que algo compruebe que
          lo sigue diciendo.
        </p>
      </Seccion>

      {/* ═══ CIERRE ══════════════════════════════════════════════════════ */}
      <section aria-labelledby="t-resumen" className="velia-dark-stage bg-void text-cream mt-6">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 id="t-resumen" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1]">
              En resumen
            </h2>
            <div className="mt-6 max-w-prose space-y-5 text-[15px] md:text-base leading-[1.6] text-cream/70">
              <p>
                llms.txt es una idea útil y pequeña. Ayuda a un agente que ya ha llegado a tu web a
                leerla mejor; no hace que llegue, no decide si te cita y no arregla una web que no
                se deja leer.
              </p>
              <p className="text-cream/85">{TESIS}</p>
              <p>
                En VELIA esto forma parte de{' '}
                <Link
                  href="/#capacidades"
                  className="font-600 text-gold/85 underline decoration-gold/30 underline-offset-4 hover:decoration-gold/85 transition-colors"
                >
                  AI Search &amp; Digital Visibility
                </Link>
                : preparar la infraestructura digital de un negocio para que pueda ser encontrada y
                entendida, sin prometer lo que nadie controla.
              </p>
            </div>
            <CtaSobreOscuro ubicacion="guia_llms_txt" />
          </div>
        </div>
      </section>

      <Fuentes fuentes={FUENTES} consultadas={REVISADA} />
      </article>
    </>
  )
}
