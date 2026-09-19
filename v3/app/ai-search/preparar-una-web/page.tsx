import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import TrackedLink from '@/components/TrackedLink'
import { metadatosDePagina } from '@/lib/metadatos'
import { SITE_URL } from '@/lib/constants'
import { CTA_CONTACTO, CONTACTO_MICROCOPY } from '@/lib/cta'

/**
 * /ai-search/preparar-una-web — la primera pieza de conocimiento de VELIA.
 *
 * FASE 1 del contenido de Search + AI Search (19-sep-2026). La arquitectura
 * aprobada fija el principio que gobierna esta página:
 *
 *   VELIA no publica sobre lo que sabe hacer. Publica lo que ha tenido que
 *   decidir.
 *
 * Por eso cada sección tiene dos partes que NO se mezclan: la explicación
 * general, que sirve a cualquier empresa, y un bloque «En veliacorp.com» que
 * separa HECHO, DECISIÓN e INTERPRETACIÓN sobre lo que se hizo en esta misma
 * web. Una guía sobre preparar una web para buscadores y sistemas de IA,
 * servida desde una web preparada así, es su propia prueba.
 *
 * ── REGLAS DE ESTA PÁGINA ─────────────────────────────────────────────────
 * · Cada afirmación sobre un proveedor sale de su documentación oficial y está
 *   en «Fuentes». Lo que no está documentado se presenta como interpretación.
 * · No se promete aparecer, ser citado ni ser recomendado en ningún sistema.
 * · `llms.txt` aparece, con lo que es y lo que no, pero no es el centro: tiene
 *   su propia pieza pendiente.
 * · Ningún claim de `lib/verified-claims.ts` en estado `pending` aparece aquí.
 *   `check:claims` recorre esta ruta. Ojo al redactar sobre las políticas de
 *   los proveedores: la guarda vigila frases como «no entrena modelos», que
 *   son el claim `noModelTraining` de VELIA aunque se escriban hablando de otro.
 * · Sin `Reveal` ni animación alguna: nada de esta página existe sólo animado.
 *   Una animación de entrada depende de que un observer dispare, y el 18-sep
 *   se midió en /seguridad que con un recorrido a saltos puede no hacerlo.
 *
 * ── AUTORÍA ───────────────────────────────────────────────────────────────
 * Firmada por la organización, no por una persona. Atribuir a Joaquín o a
 * Axel un texto que no han firmado sería poner su nombre en algo que no han
 * revisado. Si uno de los dos lo revisa y lo asume, el cambio es de una línea
 * en el JSON-LD y otra en la firma visible: HUMAN_DECISION.
 *
 * ── FECHAS ────────────────────────────────────────────────────────────────
 * Son las reales. Si la pieza sale a producción mucho después, `PUBLICADA`
 * debe ser la fecha en que se publica, no la de escritura.
 */

const RUTA = '/ai-search/preparar-una-web'
const URL_PAGINA = `${SITE_URL}${RUTA}`
const PUBLICADA = '2026-09-19'
const REVISADA = '2026-09-19'
const TITULAR = 'Cómo preparar una web para buscadores y sistemas de IA'
const DESCRIPCION =
  'Qué necesita una web para que buscadores y sistemas de IA la rastreen, la entiendan y puedan citarla; qué se puede medir y qué no se puede garantizar.'

export const metadata: Metadata = metadatosDePagina({
  titulo: `${TITULAR} — VELIA`,
  tituloAlCompartir: TITULAR,
  descripcion: DESCRIPCION,
  ruta: RUTA,
  articulo: { publicado: PUBLICADA, modificado: REVISADA },
})

/** Fuentes oficiales consultadas. Son también `citation` en el JSON-LD: una
 *  sola lista, para que la visible y la declarada no puedan divergir. */
const FUENTES = [
  {
    href: 'https://developers.google.com/search/docs/appearance/ai-features',
    texto: 'Google Search Central: las funciones de IA y tu web',
  },
  {
    href: 'https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers',
    texto: 'Google Search Central: rastreadores comunes de Google, incluido Google-Extended',
  },
  {
    href: 'https://developers.openai.com/api/docs/bots',
    texto: 'OpenAI: rastreadores y agentes de usuario',
  },
  {
    href: 'https://docs.perplexity.ai/guides/bots',
    texto: 'Perplexity: rastreadores de Perplexity',
  },
  {
    href: 'https://llmstxt.org/',
    texto: 'llms.txt: la propuesta',
  },
] as const

/* ── JSON-LD DE LA PÁGINA ──────────────────────────────────────────────────
   `WebPage` + `Article`, ligados por `@id` al `Organization` y al `WebSite`
   que declara el layout. Nada se repite: autor y publisher son la misma
   organización, por referencia.
   Lo que NO se declara, y es deliberado: `FAQPage` (la Fase 0 acaba de retirar
   uno), `HowTo` (esto no es una receta de pasos), `Person` como autor (ver
   AUTORÍA arriba) y cualquier valoración. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${URL_PAGINA}#webpage`,
      url: URL_PAGINA,
      name: TITULAR,
      inLanguage: 'es-ES',
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
    {
      '@type': 'Article',
      '@id': `${URL_PAGINA}#article`,
      headline: TITULAR,
      description: DESCRIPCION,
      inLanguage: 'es-ES',
      datePublished: PUBLICADA,
      dateModified: REVISADA,
      author: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      mainEntityOfPage: { '@id': `${URL_PAGINA}#webpage` },
      citation: FUENTES.map(f => f.href),
    },
  ],
}

const fechaLarga = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

/* Las secciones numeradas, en un solo sitio: alimentan el índice y los `id`
   de las secciones, para que un enlace del índice no pueda apuntar a una
   sección renombrada. */
const SECCIONES = [
  { id: 'entidad', titulo: 'Una máquina tiene que entender qué es tu empresa' },
  { id: 'documento', titulo: 'El contenido tiene que estar en el documento' },
  { id: 'rastreo', titulo: 'Search y AI Search necesitan una web rastreable' },
  { id: 'datos-estructurados', titulo: 'Los datos estructurados tienen que decir lo mismo que la web' },
  { id: 'preguntas', titulo: 'Las páginas tienen que responder preguntas' },
  { id: 'autoridad', titulo: 'La autoridad no nace dentro de una sola web' },
  { id: 'medir', titulo: 'Qué se puede medir' },
  { id: 'garantias', titulo: 'Qué no se puede garantizar' },
] as const

type IdSeccion = (typeof SECCIONES)[number]['id']
const tituloDe = (id: IdSeccion) => SECCIONES.find(s => s.id === id)!.titulo
const numeroDe = (id: IdSeccion) => String(SECCIONES.findIndex(s => s.id === id) + 1).padStart(2, '0')

/* ── PIEZAS DE COMPOSICIÓN ─────────────────────────────────────────────────
   Tipografía, color y espaciado del sistema existente; ni un tamaño nuevo. */

/* La medida de lectura (`max-w-prose`) va en el ELEMENTO de texto, nunca en un
   contenedor que envuelva también un titular o un panel: se expresa en `em` y
   se resuelve con el tamaño del propio elemento. Ver `tailwind.config.ts`. */
const cuerpo = 'max-w-prose text-[15px] md:text-base leading-[1.6] text-void/70'
const enlace =
  'font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors'

/** Una sección numerada de la guía. El índice lleva el número; el `h2`, la
 *  pregunta; el primer párrafo, la respuesta. */
function Seccion({ id, respuesta, children }: { id: IdSeccion; respuesta: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`t-${id}`} className="mx-auto max-w-6xl px-6 md:px-10 scroll-mt-24">
      <div className="hairline py-14 md:py-20 grid gap-x-10 gap-y-5 md:grid-cols-[auto_1fr]">
        <span className="indice text-slate" aria-hidden="true">
          {numeroDe(id)}
        </span>
        {/* `max-w-3xl` es un ancho de MAQUETACIÓN: da sitio al titular y al panel
            de evidencia. La medida de lectura la lleva cada texto dentro. Hasta
            el 19-sep este contenedor era `max-w-prose`, y al recalibrar el token
            habría estrechado también el titular y el panel. */}
        <div className="max-w-3xl">
          <h2
            id={`t-${id}`}
            className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void"
          >
            {tituloDe(id)}
          </h2>
          {/* La respuesta va primero y separada del desarrollo: es lo que se
              extrae si sólo se lee una frase de la sección. */}
          <p className="mt-6 max-w-prose text-lg md:text-xl leading-[1.55] text-void/85">{respuesta}</p>
          <div className="mt-6 space-y-5">{children}</div>
        </div>
      </div>
    </section>
  )
}

/**
 * Lo que se hizo en esta misma web, con las tres naturalezas separadas.
 *
 * `<dl>` y no tres párrafos: la relación término → descripción es exactamente
 * lo que es, y un extractor la conserva. No es `<aside>` a propósito: algunos
 * extractores descartan los `aside` como contenido secundario, y esto es la
 * evidencia de la página, no un adorno.
 *
 * «Decisión» es el único rótulo en Iris: la dirección reserva ese color para
 * VELIA actuando o pensando, y una decisión es exactamente eso.
 */
function EnNuestraWeb({ hecho, decision, interpretacion }: { hecho: ReactNode; decision: ReactNode; interpretacion: ReactNode }) {
  const filas: { termino: string; texto: ReactNode; iris?: boolean }[] = [
    { termino: 'Hecho', texto: hecho },
    { termino: 'Decisión', texto: decision, iris: true },
    { termino: 'Interpretación', texto: interpretacion },
  ]
  return (
    <div className="!mt-10 rounded-lg border border-mist bg-white px-6 py-7 md:px-8">
      <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">En veliacorp.com</p>
      <dl className="mt-5 space-y-5">
        {filas.map(f => (
          <div key={f.termino} className="md:grid md:grid-cols-[8.5rem_1fr] md:gap-6">
            <dt className={`text-[11px] font-600 tracking-[0.06em] uppercase pt-1 ${f.iris ? 'text-gold-ink' : 'text-void/65'}`}>
              {f.termino}
            </dt>
            <dd className="mt-1.5 md:mt-0 max-w-prose text-[15px] leading-[1.6] text-void/75">{f.texto}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Código en línea, sin inventar un estilo nuevo. */
const C = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-mist px-1.5 py-0.5 text-[0.9em] text-void">{children}</code>
)

export default function PrepararUnaWebPage() {
  return (
    <>
      {/* El JSON-LD va FUERA del <article>, a propósito. Dentro, un extractor
          que lea el texto del artículo con `textContent` se lleva también el
          JSON: medido el 19-sep en esta misma página, y es el mismo artefacto
          que en la Fase 0 infló en ~200 palabras la medición de /precios. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>

      {/* ═══ CABECERA ════════════════════════════════════════════════════ */}
      <header className="mx-auto max-w-6xl px-6 md:px-10 pt-20 pb-14 md:pt-28 md:pb-20">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">AI Search · Guía</p>
        <h1 className="mt-6 text-[clamp(2.15rem,5.6vw,4.5rem)] font-600 tracking-[-0.035em] leading-[1.04] text-void max-w-[18ch]">
          {TITULAR}
        </h1>
        <p className="mt-8 text-lg md:text-xl leading-[1.6] text-void/70 max-w-prose">
          No consiste en añadir un truco a una web normal. Consiste en que una máquina pueda
          rastrearla, leer su contenido sin ejecutar nada, entender qué empresa hay detrás y
          encontrar en ella respuestas que merezca la pena citar.
        </p>
        <p className={`mt-5 max-w-prose ${cuerpo}`}>
          Esta guía explica cada pieza, qué se puede medir y qué no se puede garantizar. Cada
          sección cierra con lo que hicimos en nuestra propia web, separando lo que es un hecho,
          lo que decidimos y lo que interpretamos. No es un caso de éxito: es un registro de
          decisiones.
        </p>
        <p className="mt-8 text-[13px] text-void/65">
          Por el equipo de VELIA · <time dateTime={PUBLICADA}>{fechaLarga(PUBLICADA)}</time>
          {REVISADA !== PUBLICADA && (
            <>
              {' '}· revisada el <time dateTime={REVISADA}>{fechaLarga(REVISADA)}</time>
            </>
          )}
        </p>
      </header>

      {/* ═══ LA RESPUESTA CORTA ══════════════════════════════════════════
          La pregunta del titular respondida entera antes de cualquier
          desarrollo. Si alguien —persona o sistema— sólo lee esto, se lleva
          la respuesta completa, incluido lo que NO garantiza. */}
      <section id="respuesta" aria-labelledby="t-respuesta" className="bg-white border-y border-mist scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="t-respuesta" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void">
              La respuesta corta
            </h2>
            <p className={`mt-5 max-w-prose ${cuerpo}`}>
              Una web está preparada para buscadores y sistemas de IA cuando cumple seis
              condiciones. Ninguna es exclusiva de la IA: son las mismas que hacen que una web se
              entienda bien.
            </p>
          </div>
          <div>
            <ol className="space-y-5">
              {[
                ['Se puede rastrear.', 'El robots.txt, los códigos de respuesta, las URL canónicas y el sitemap dicen lo mismo, y nada importante queda detrás de un inicio de sesión.'],
                ['El contenido está en el documento.', 'El HTML que entrega el servidor ya contiene el texto, los encabezados y los enlaces, sin depender de que se ejecute JavaScript ni de que alguien pulse algo.'],
                ['La empresa es una sola.', 'El título, la descripción, los encabezados, los datos estructurados y cualquier otra declaración describen la misma empresa, y ninguna página antigua cuenta otra.'],
                ['Los datos estructurados describen lo que la página dice.', 'Ni más, ni otra cosa.'],
                ['Hay páginas que responden preguntas.', 'De forma autosuficiente, con criterio propio y con evidencia que se pueda comprobar.'],
                ['La autoridad también viene de fuera.', 'Perfiles, menciones y referencias que otros pueden verificar.'],
              ].map(([lema, texto], i) => (
                <li key={lema} className="flex gap-5">
                  <span className="text-[12px] font-600 tracking-[0.06em] text-void/65 tabular-nums pt-1 w-5 shrink-0" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="max-w-prose text-[15px] md:text-base leading-[1.6] text-void/70">
                    <strong className="font-600 text-void">{lema}</strong> {texto}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-8 pt-6 border-t border-mist max-w-prose text-[15px] md:text-base leading-[1.6] text-void/85">
              Y dos cosas que conviene saber antes de empezar: estar preparado no garantiza
              aparecer ni ser citado en ningún sistema, y un fichero <C>llms.txt</C> no sustituye a
              ninguna de las seis.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ÍNDICE ══════════════════════════════════════════════════════
          `block py-1.5` en cada enlace: con la altura de línea sola, un
          enlace de esta lista mediría ~20 px de alto, por debajo de los 24
          que pide WCAG 2.2 AA (2.5.8). La auditoría de diseño del 18-sep
          encontró exactamente eso en el pie de todas las páginas. */}
      <nav aria-label="En esta guía" className="mx-auto max-w-6xl px-6 md:px-10 py-14 md:py-16">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">En esta guía</p>
        <ol className="mt-5 grid gap-x-10 md:grid-cols-2 max-w-4xl">
          <li>
            <a href="#terminos" className="block py-1.5 text-[15px] text-void/80 hover:text-gold-ink transition-colors">
              Cinco términos que se suelen confundir
            </a>
          </li>
          {SECCIONES.map(s => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="block py-1.5 text-[15px] text-void/80 hover:text-gold-ink transition-colors">
                <span className="tabular-nums text-void/65 mr-3" aria-hidden="true">{numeroDe(s.id)}</span>
                {s.titulo}
              </a>
            </li>
          ))}
          <li>
            <a href="#fuentes" className="block py-1.5 text-[15px] text-void/80 hover:text-gold-ink transition-colors">
              Fuentes
            </a>
          </li>
        </ol>
      </nav>

      {/* ═══ CINCO TÉRMINOS ══════════════════════════════════════════════
          La guía pide diferenciar SEO, AI Search, descubribilidad por LLM,
          claridad de entidad y citabilidad sin inventar categorías nuevas.
          Un `<dl>`: es literalmente una lista de términos con su definición. */}
      <section id="terminos" aria-labelledby="t-terminos" className="mx-auto max-w-6xl px-6 md:px-10 scroll-mt-24">
        <div className="hairline py-14 md:py-20">
          <h2 id="t-terminos" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[22ch]">
            Cinco términos que se suelen confundir
          </h2>
          <p className={`mt-5 max-w-prose ${cuerpo}`}>
            Se usan como si fueran sinónimos o como si fueran disciplinas separadas. No son ninguna
            de las dos cosas: son capas del mismo problema, y cada una depende de la anterior.
          </p>
          <dl className="mt-12 md:mt-14">
            {[
              [
                'SEO',
                <>
                  Hacer que una web sea rastreable, indexable y relevante para las consultas de un
                  buscador. Sigue siendo la base de todo lo demás: Google documenta que, para
                  aparecer en sus funciones de IA, una página tiene que estar indexada y poder
                  mostrarse en la búsqueda con un fragmento.
                </>,
              ],
              [
                'AI Search',
                <>
                  Búsquedas cuya respuesta redacta un sistema a partir de varias fuentes, en lugar
                  de devolver sólo una lista de enlaces: las respuestas generativas de Google o de
                  Bing y Copilot, la búsqueda de ChatGPT, Perplexity. Cambia la forma de la
                  respuesta; no cambia que el sistema necesite encontrar y entender las fuentes.
                </>,
              ],
              [
                'Descubribilidad por LLM',
                <>
                  Que un modelo de lenguaje pueda llegar a tu contenido cuando busca información en
                  el momento de responder, y no sólo contar con lo que aprendió al entrenarse.
                  Depende de que sus rastreadores de búsqueda puedan acceder, y es distinto de que
                  tu contenido se use para entrenar: los proveedores documentan esas dos cosas por
                  separado.
                </>,
              ],
              [
                'Claridad de entidad',
                <>
                  Que exista una única descripción coherente de quién eres —qué empresa, qué hace,
                  dónde y quién está detrás— en todas las superficies que una máquina lee. Es la
                  condición previa: sin ella, lo demás describe a alguien que no se sabe quién es.
                </>,
              ],
              [
                'Citabilidad',
                <>
                  Que una página pueda usarse como fuente de una respuesta: que responda a una
                  pregunta concreta, que se entienda sin el resto de la web y que su afirmación
                  central se pueda extraer y comprobar. Es lo más parecido a un objetivo que tiene
                  todo esto, y lo que más depende del contenido.
                </>,
              ],
            ].map(([termino, definicion]) => (
              <div key={termino as string} className="hairline py-7 md:grid md:grid-cols-[15rem_1fr] md:gap-10">
                <dt className="text-lg md:text-xl font-600 tracking-[-0.015em] text-void">{termino}</dt>
                <dd className={`mt-2 md:mt-0.5 max-w-prose ${cuerpo}`}>{definicion}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ 01 · ENTIDAD ════════════════════════════════════════════════ */}
      <Seccion
        id="entidad"
        respuesta="Antes de poder usar tu web como fuente, un sistema tiene que poder decir qué empresa eres. Eso sólo ocurre si todas las superficies que lee dicen lo mismo."
      >
        <p className={cuerpo}>
          Una máquina no lee tu web como una persona, de arriba abajo y en el orden que diseñaste.
          Lee declaraciones sueltas: el título de cada página, su descripción, sus encabezados, sus
          datos estructurados, los textos de los enlaces que apuntan a ella. Si esas declaraciones
          coinciden, forman una entidad. Si se contradicen, forman ruido.
        </p>
        <p className={cuerpo}>
          El problema más común no es que falte información: es que sobra información antigua. Una
          empresa cambia de posicionamiento, reescribe la portada y deja vivas las páginas de la
          etapa anterior, que siguen indexadas y siguen describiendo a otra empresa.
        </p>
        <p className={cuerpo}>Qué revisar:</p>
        <ul className={`list-disc pl-5 space-y-2 ${cuerpo}`}>
          <li>que el título y la descripción de cada página describan a la misma empresa;</li>
          <li>que los encabezados principales sean coherentes con esa descripción;</li>
          <li>que las páginas de etapas anteriores no sigan siendo indexables si describen algo que ya no eres;</li>
          <li>que los datos estructurados de la organización coincidan con el texto visible.</li>
        </ul>
        <EnNuestraWeb
          hecho="En septiembre de 2026 auditamos veliacorp.com y encontramos dos empresas en el mismo dominio. Las páginas reescritas describían una compañía de transformación y operación digital; cuatro páginas de una etapa anterior —precios, una demostración, un programa comercial y una página de producto— seguían siendo indexables y describían un producto de software con precio."
          decision={
            <>
              No las borramos: hay enlaces y correos ya enviados que dependen de ellas. Las marcamos
              con <C>noindex, follow</C>. Siguen respondiendo a quien tenga el enlace y dejan de
              competir por representar a la empresa en un buscador.
            </>
          }
          interpretacion="No hay ninguna señal fiable con la que un sistema externo pueda decidir cuál de dos descripciones de la misma empresa es la vigente. Si las dos están indexadas, las dos cuentan."
        />
      </Seccion>

      {/* ═══ 02 · DOCUMENTO ══════════════════════════════════════════════ */}
      <Seccion
        id="documento"
        respuesta="Lo que una máquina puede leer con seguridad es lo que el servidor entrega en el HTML. Lo que sólo aparece después de ejecutar código o de una interacción puede no llegar a leerse nunca."
      >
        <p className={cuerpo}>
          Muchas webs modernas entregan un documento casi vacío y construyen el contenido en el
          navegador. Para una persona el resultado es el mismo. Para un rastreador depende de si
          ejecuta ese código, cuándo y hasta dónde, y eso no lo decides tú.
        </p>
        <p className={cuerpo}>
          La comprobación es sencilla: pide la página sin ejecutar JavaScript y mira qué queda.
          Tienen que estar el texto completo, la jerarquía de encabezados —un solo <C>h1</C> y
          secciones con <C>h2</C>— y los enlaces. Las listas tienen que ser listas y las fechas,
          fechas (<C>{'<time>'}</C>), no párrafos que lo parecen.
        </p>
        <p className={cuerpo}>
          Cuidado también con lo que se esconde por diseño: pestañas, acordeones y animaciones de
          entrada. Si el contenido está en el documento aunque esté plegado, se puede leer. Si sólo
          se crea al pulsar, no existe hasta que alguien pulsa.
        </p>
        <EnNuestraWeb
          hecho="Durante semanas, un efecto de aparición al hacer scroll dejaba invisible media portada de veliacorp.com cuando el JavaScript no se ejecutaba. El comentario del código decía que sin JavaScript todo se veía igual; la regla que se aplicaba hacía lo contrario. Nadie lo vio hasta revisar una captura de la página completa."
          decision="El estado de reposo pasó a ser el visible: un bloque sólo se oculta para animarse cuando consta que hay JavaScript para volver a mostrarlo. Una comprobación automática carga la portada sin JavaScript y falla si algún bloque queda invisible."
          interpretacion="No podemos saber qué rastreador ejecuta JavaScript y cuál no. La única versión de la página que funciona para todos es la que no lo necesita."
        />

        <h3 className="!mt-12 text-lg md:text-xl font-600 tracking-[-0.015em] text-void">¿Y llms.txt?</h3>
        <p className={cuerpo}>
          <C>llms.txt</C> es una propuesta, publicada en 2024, para colocar en la raíz de un sitio
          un fichero en Markdown que resuma su contenido y enlace sus páginas principales, pensado
          para que un modelo lo consulte cuando busca información. Es una propuesta, no un estándar
          adoptado.
        </p>
        <p className={cuerpo}>
          Ninguna de las documentaciones de rastreadores que citamos en esta guía —Google, OpenAI y
          Perplexity— dice que sus sistemas lean ese fichero en otros sitios. OpenAI y Perplexity
          publican uno para su propia documentación, lo que no es lo mismo. Google, además, dice
          expresamente que no hace falta crear archivos de texto para IA ni datos estructurados
          especiales para aparecer en sus funciones de IA.
        </p>
        <p className={cuerpo}>
          Nosotros mantenemos uno, y por un motivo concreto: es el sitio donde está escrita, en un
          solo texto y sin diseño, la descripción exacta de la empresa, y nos sirvió de referencia
          para comprobar que el resto de superficies dijeran lo mismo. Lo que no hace es sustituir
          al documento: si el contenido no está en el HTML, un resumen aparte no lo arregla.
        </p>
      </Seccion>

      {/* ═══ 03 · RASTREO ════════════════════════════════════════════════ */}
      <Seccion
        id="rastreo"
        respuesta="Si un rastreador no puede acceder a una página, esa página no existe para el sistema que depende de él. Y hoy conviene saber que un mismo proveedor puede usar rastreadores distintos para cosas distintas."
      >
        <p className={cuerpo}>
          Lo básico no ha cambiado: un robots.txt que no bloquee lo que quieres que se encuentre,
          páginas que respondan con el código correcto, una URL canónica por página y un sitemap
          que liste sólo las páginas que representan a la empresa hoy.
        </p>
        <p className={cuerpo}>
          Lo que sí ha cambiado es que los proveedores separan el rastreo para buscar del rastreo
          para entrenar modelos, y lo documentan con nombres distintos que se controlan por
          separado en robots.txt:
        </p>
        <ul className={`list-disc pl-5 space-y-3 ${cuerpo}`}>
          <li>
            <strong className="font-600 text-void">OpenAI</strong> documenta <C>OAI-SearchBot</C>{' '}
            para mostrar webs en los resultados de búsqueda de ChatGPT, <C>GPTBot</C> para rastrear
            contenido que puede usarse en el entrenamiento de sus modelos, y <C>ChatGPT-User</C>{' '}
            para acciones que inicia un usuario.
          </li>
          <li>
            <strong className="font-600 text-void">Perplexity</strong> documenta{' '}
            <C>PerplexityBot</C> para mostrar y enlazar webs en sus resultados, y{' '}
            <C>Perplexity-User</C> para las consultas de los usuarios, del que advierte que por lo
            general no sigue las reglas de robots.txt.
          </li>
          <li>
            <strong className="font-600 text-void">Google</strong> documenta <C>Google-Extended</C>
            , que controla si el contenido se usa para entrenar Gemini y para fundamentar sus
            respuestas, y especifica que no afecta a la inclusión ni a la posición en Google Search.
          </li>
        </ul>
        <p className={cuerpo}>
          La consecuencia práctica es que bloquear «la IA» en bloque tiene efectos que no siempre se
          buscan: puede cerrar la puerta a los sistemas que citarían tu web como fuente. Permitir
          que te encuentren y decidir sobre el entrenamiento son dos decisiones distintas.
        </p>
        <EnNuestraWeb
          hecho={
            <>
              El robots.txt de veliacorp.com permite el acceso a todos los rastreadores y declara el
              sitemap; no tiene reglas por proveedor. Cualquier dominio que no sea el de producción
              —una versión de prueba, por ejemplo— responde con la cabecera{' '}
              <C>X-Robots-Tag: noindex, nofollow</C>.
            </>
          }
          decision="El noindex fuera de producción se decide por el nombre del dominio y no por una variable de configuración: una variable se puede olvidar, y el olvido no da error en ninguna de las dos direcciones. Sobre el entrenamiento, a la fecha de esta guía, no hemos escrito ninguna regla: es una decisión de negocio, y la tenemos separada de la de ser encontrados."
          interpretacion="Una versión de prueba indexable compite con la de producción con el mismo contenido. No hay ninguna ventaja en que eso ocurra por descuido."
        />
      </Seccion>

      {/* ═══ 04 · DATOS ESTRUCTURADOS ═══════════════════════════════════ */}
      <Seccion
        id="datos-estructurados"
        respuesta="Los datos estructurados no añaden información que la página no tenga: sirven para declararla de forma inequívoca. Si contradicen a la página, lo que añaden es una contradicción."
      >
        <p className={cuerpo}>
          Es el punto donde más fácil es equivocarse con buena intención. Casi todas las guías
          recomiendan añadir más tipos de marcado de schema.org, y cada tipo que se añade es una
          afirmación más que tiene que ser verdad.
        </p>
        <p className={cuerpo}>
          Lo que conviene declarar suele ser poco: quién es la organización (<C>Organization</C>),
          qué sitio es el suyo (<C>WebSite</C>) y, en las páginas de contenido, qué es cada una y
          quién la firma (<C>Article</C>, con autor y fechas reales). Todo relacionado mediante
          identificadores (<C>@id</C>), para que no haya dos copias de la misma empresa que puedan
          divergir.
        </p>
        <p className={cuerpo}>
          Y conviene no declarar lo que no se puede sostener: valoraciones sin fuente, preguntas
          frecuentes de un producto que ya no se vende, perfiles externos que no existen. Google
          recuerda que no hay ningún marcado especial necesario para aparecer en sus funciones de
          IA.
        </p>
        <EnNuestraWeb
          hecho={
            <>
              Una página de la etapa anterior de veliacorp.com publicaba un marcado{' '}
              <C>FAQPage</C> con el precio, la permanencia y los usuarios incluidos de un producto
              que ya no existe, en el mismo documento que el marcado <C>Organization</C> que
              describía a la compañía actual.
            </>
          }
          decision={
            <>
              Retiramos el bloque de marcado, no el texto de la página, y no lo sustituimos por
              otro. El sitio declara ahora una organización y un sitio web relacionados entre sí,
              con sus fundadores. No declaramos perfiles externos (<C>sameAs</C>) porque, a la fecha
              de esta guía, no hemos publicado ninguno que enlazar: uno inventado sería peor que
              ninguno.
            </>
          }
          interpretacion="El marcado se lee como una declaración explícita, no como un texto que haya que interpretar. Una contradicción ahí no se diluye entre el resto: queda declarada."
        />
      </Seccion>

      {/* ═══ 05 · PREGUNTAS ══════════════════════════════════════════════ */}
      <Seccion
        id="preguntas"
        respuesta="Un sistema que redacta una respuesta busca fuentes que respondan a lo que se le ha preguntado. Una web que sólo explica quién es la empresa responde a una única pregunta, y es la que sólo hace quien ya la conoce."
      >
        <p className={cuerpo}>Una página que puede servir de fuente tiende a cumplir cinco condiciones:</p>
        <ul className={`list-disc pl-5 space-y-2 ${cuerpo}`}>
          <li><strong className="font-600 text-void">Responde a una pregunta concreta</strong>, y lo dice al principio, no al final.</li>
          <li><strong className="font-600 text-void">Se entiende sola</strong>, sin necesitar el resto de la web ni un contexto que sólo tiene quien la escribió.</li>
          <li><strong className="font-600 text-void">Distingue los hechos de las opiniones</strong>, y dice cuál es cuál.</li>
          <li><strong className="font-600 text-void">Aporta algo comprobable</strong>: un dato, una decisión, una fuente, un ejemplo real.</li>
          <li><strong className="font-600 text-void">Se puede extraer</strong>: encabezados que nombran lo que viene debajo y párrafos que no mezclan tres ideas.</li>
        </ul>
        <p className={cuerpo}>
          Esta guía está escrita así a propósito: cada sección empieza con su respuesta en una o dos
          frases, y lo que hicimos nosotros está separado de la explicación general.
        </p>
        <p className={cuerpo}>
          Lo contrario es más común: páginas que existen para ocupar una búsqueda, con mucho texto y
          ninguna afirmación que se pueda comprobar. Se pueden encontrar; es más difícil que alguien
          —persona o sistema— las use para afirmar algo.
        </p>
        <EnNuestraWeb
          hecho={
            <>
              Cuando auditamos veliacorp.com, ninguna de sus páginas respondía a una pregunta que
              alguien haría a un buscador: todas explicaban quién es VELIA. La{' '}
              <Link href="/seguridad" className={enlace}>página de seguridad</Link> publicaba, y
              publica, esta frase: «Hoy no tenemos certificación ISO 27001».
            </>
          }
          decision={
            <>
              Mantener un registro de afirmaciones: lo que no tiene fuente, fecha y responsable no se
              publica aunque sea cierto, y una comprobación automática lo vigila en el título, la
              descripción y el texto visible de cada página —es una de las{' '}
              <Link href="/sobre-velia" className={enlace}>reglas con las que decidimos</Link>—. Y
              empezar el contenido por esta guía.
            </>
          }
          interpretacion="Una afirmación concreta, que se puede comprobar y que se entiende sin contexto es más útil como fuente que un párrafo de promesas. La que más se parecía a eso en todo el sitio era la que reconocía una carencia."
        />
      </Seccion>

      {/* ═══ 06 · AUTORIDAD ══════════════════════════════════════════════ */}
      <Seccion
        id="autoridad"
        respuesta="Una web puede declarar quién es; no puede declarar que es una fuente fiable. Eso depende también de lo que dicen de ella otros sitios."
      >
        <p className={cuerpo}>
          Los perfiles oficiales de la empresa enlazados entre sí, los datos societarios públicos,
          los clientes que se pueden comprobar, las menciones en publicaciones y los enlaces de
          sitios que tratan el mismo tema son señales que están fuera de tu web. Ninguna se puede
          fabricar dentro de ella.
        </p>
        <p className={cuerpo}>
          Es la parte más lenta y la que menos depende de la técnica. También es la más fácil de
          falsear: enlaces comprados, directorios sin lectores, contenido publicado en volumen para
          aparentar actividad. Además del riesgo, tiene un problema de coherencia: una web que
          presume de rigor y compra señales de autoridad se contradice de una forma que cualquiera
          puede comprobar.
        </p>
        <EnNuestraWeb
          hecho={
            <>
              A la fecha de esta guía, VELIA tiene un cliente que se puede citar y comprobar —
              <Link href="/#caso" className={enlace}>Cónsul Jurídico</Link>, cuya infraestructura
              construimos y seguimos operando— y ningún perfil externo declarado en su web.
            </>
          }
          decision="No añadir perfiles que no existen, no comprar enlaces y empezar por lo que depende de nosotros: publicar conocimiento que se pueda comprobar."
          interpretacion="La autoridad externa es la capa que más tarda en moverse. Por eso tiene sentido empezar por las demás: no hay nada que referenciar si antes no hay nada que merezca serlo."
        />
      </Seccion>

      {/* ═══ 07 · MEDIR ══════════════════════════════════════════════════ */}
      <Seccion
        id="medir"
        respuesta="Se puede medir si una página está indexada, si aparece, si trae visitas y si esas visitas hacen algo. Si un sistema de IA la usa como fuente se puede observar, pero no medir con la misma fiabilidad."
      >
        <p className={cuerpo}>Son seis capas, y conviene no mezclarlas:</p>
        <dl className="space-y-4">
          {[
            ['Indexación', 'Si la página está en el índice de un buscador. Google Search Console y Bing Webmaster Tools lo informan para sus buscadores.'],
            ['Aparición', 'Para qué consultas se muestra y cuántas veces. Las mismas herramientas. Google indica que la actividad de sus funciones de IA —AI Overviews y AI Mode— se incluye en el informe de rendimiento de Search Console, dentro de los totales de búsqueda web.'],
            ['Citación', 'Si una respuesta generativa usa la página como fuente. A la fecha de esta guía no conocemos un informe general de los proveedores que lo mida; se puede observar repitiendo un conjunto fijo de preguntas y anotando las fuentes que aparecen.'],
            ['Referencia', 'Si el sistema menciona a la empresa aunque no la enlace. Sólo se puede observar a mano, y con cautela: la misma pregunta no produce siempre la misma respuesta.'],
            ['Visitas', 'Cuántas llegan desde buscadores y desde sistemas de IA, identificables por el sitio de procedencia en la analítica.'],
            ['Conversión', 'Qué hacen esas visitas. Es la única capa que depende por completo de tu propia medición.'],
          ].map(([capa, texto]) => (
            <div key={capa} className="md:grid md:grid-cols-[8.5rem_1fr] md:gap-6">
              <dt className="text-[15px] md:text-base font-600 text-void">{capa}</dt>
              <dd className={`mt-1 md:mt-0 ${cuerpo}`}>{texto}</dd>
            </div>
          ))}
        </dl>
        <p className={cuerpo}>
          La regla más útil es no mezclarlas. Estar indexado no es aparecer, aparecer no es ser
          citado y ser citado no es que alguien llegue. Una cifra que combine las seis en una sola
          puntuación está estimando, no midiendo.
        </p>
        <EnNuestraWeb
          hecho="veliacorp.com mide en un sistema propio las acciones que importan, como el envío del formulario de contacto. Al auditarlo encontramos que el evento del único botón de contacto de la portada estaba declarado y no lo enviaba nadie."
          decision="Conectarlo, y dejar escrito junto a cada evento declarado quién lo emite o, si no lo emite nadie a propósito, por qué."
          interpretacion="Un cero en una medición puede significar que no ocurre nada o que no se está midiendo. Hasta saber cuál de las dos es, el cero no dice nada."
        />
      </Seccion>

      {/* ═══ 08 · GARANTÍAS + CIERRE · EL ÚNICO CORTE OSCURO ═════════════
          Mismo lenguaje que «Lo que todavía no» en /seguridad: decir qué no
          se puede prometer es la parte más difícil de escribir y la que hace
          creíble al resto, así que se lleva el corte. */}
      <section
        id="garantias"
        aria-labelledby="t-garantias"
        className="velia-dark-stage bg-void text-cream scroll-mt-24 mt-6"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28 grid gap-x-10 gap-y-5 md:grid-cols-[auto_1fr]">
          <span className="indice text-cream/60" aria-hidden="true">
            {numeroDe('garantias')}
          </span>
          <div className="max-w-3xl">
            <h2 id="t-garantias" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1]">
              {tituloDe('garantias')}
            </h2>
            <p className="mt-6 max-w-prose text-lg md:text-xl leading-[1.55] text-cream/85">
              Ninguna preparación garantiza aparecer en los resultados de un buscador, en la
              respuesta de un sistema de IA ni ser recomendado por él. Quien lo garantiza está
              prometiendo algo que no controla.
            </p>
            <div className="mt-6 max-w-prose space-y-5 text-[15px] md:text-base leading-[1.6] text-cream/70">
              <p>
                Los proveedores documentan cómo acceden a las webs y qué requisitos técnicos piden.
                No documentan con qué criterios eligen las fuentes de una respuesta generativa, y
                esos criterios cambian. Tampoco controlas qué preguntan las personas ni cómo
                reformula el sistema sus preguntas.
              </p>
              <p>Lo que sí está bajo tu control es lo que describe esta guía:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>que la web se pueda rastrear;</li>
                <li>que su contenido esté en el documento;</li>
                <li>que describa a una sola empresa;</li>
                <li>que su marcado diga la verdad;</li>
                <li>que tenga páginas que respondan preguntas con evidencia;</li>
                <li>y medir, sin mezclar capas, lo que pasa después.</li>
              </ul>
              <p>
                Mejorar esas condiciones aumenta la probabilidad de que una web sea descubierta,
                entendida, puesta en contexto y tenida en cuenta. No la convierte en una certeza.
              </p>
            </div>

            <h2 id="t-resumen" className="mt-16 md:mt-20 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1]">
              En resumen
            </h2>
            <div className="mt-6 max-w-prose space-y-5 text-[15px] md:text-base leading-[1.6] text-cream/70">
              <p>
                Una web preparada para buscadores y sistemas de IA no es una web normal con un
                añadido. Es una web técnicamente accesible, semánticamente clara, útil para quien
                pregunta, verificable en lo que afirma y conectada con una autoridad que no depende
                sólo de ella.
              </p>
              <p>
                Suele ser también una web mejor para las personas. Las dos audiencias piden lo
                mismo: saber quién eres, encontrar la respuesta y poder comprobarla.
              </p>
              <p>
                En VELIA esto es lo que llamamos{' '}
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
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <TrackedLink
                href={CTA_CONTACTO.href}
                event="final_contacto_click"
                properties={{ cta_location: 'guia_ai_search' }}
                className="btn inline-flex items-center justify-center rounded-full bg-cream text-void px-8 py-4 text-[13px] font-600 tracking-[0.02em] hover:opacity-90"
              >
                {CTA_CONTACTO.label}
              </TrackedLink>
              <p className="text-[13px] text-cream/70">{CONTACTO_MICROCOPY}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FUENTES ═════════════════════════════════════════════════════
          Las mismas URL que declara el JSON-LD como `citation`: una lista. */}
      <section id="fuentes" aria-labelledby="t-fuentes" className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-20 scroll-mt-24">
        <h2 id="t-fuentes" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void">
          Fuentes
        </h2>
        <p className={`mt-5 max-w-prose ${cuerpo}`}>
          Documentación oficial consultada el <time dateTime={REVISADA}>{fechaLarga(REVISADA)}</time>.
          Los proveedores la actualizan; conviene comprobarla antes de tomar una decisión que
          dependa de ella.
        </p>
        <ol className="mt-6 space-y-1 max-w-prose">
          {FUENTES.map(f => (
            <li key={f.href}>
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-1.5 text-[15px] font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
              >
                {f.texto}
              </a>
            </li>
          ))}
        </ol>
      </section>
      </article>
    </>
  )
}
