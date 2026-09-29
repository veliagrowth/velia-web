import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import {
  fetchUpdates,
  splitUpdates,
  CATEGORY_STYLE,
  formatUpdateDate,
  type ProductUpdate,
} from '@/lib/updates'
import { enlacePublicable } from '@/lib/rutas-congeladas'
import { metadatosDePagina } from '@/lib/metadatos'

/**
 * /novedades — REESCRITA EN EL REWORK 2026, etapa 2.
 *
 * Cuando se reescribió era la única ruta que la web nueva enlazaba desde el pie
 * de TODAS sus páginas y que seguía hablando como la etapa anterior: un clic
 * desde cualquier punto del sitio.
 *
 * ⚠️ YA NO SE ENLAZA (medido el 29-sep-2026 sobre el HTML servido: la Home no
 * imprime ni una vez «/novedades»). El mismo cambio que hizo que el tablón
 * negara por defecto la sacó del pie, así que hoy está aislada de las tres
 * formas a la vez —sin enlace entrante, `noindex, follow` y fuera del
 * sitemap—. No es un descuido: es la política que se describe abajo, y se
 * revierte entera el día que exista una entrada pública.
 *
 * QUÉ DECÍA, y por qué no podía quedarse:
 *
 *   description  «…todo lo que incorporamos al software de los despachos…»
 *   entradilla   «cada mejora que llega al software»
 *   carril 2     «El software» · «Actualizaciones de VELIA Legal»
 *   vacío        «Ahora mismo no podemos cargar las novedades del software»
 *
 * «VELIA Legal» es un nombre que la marca pública ya no usa (§83-86 de la
 * dirección), y «el software» convierte en producto lo que la Home presenta
 * como infraestructura construida y operada.
 *
 * TRES COSAS QUE NO ERAN DE COPY:
 *
 * 1. EL VACÍO SE CONTABA COMO AVERÍA. `fetchUpdates()` devolvía `[]` tanto si
 *    la red fallaba como si el feed contestaba sin nada que contar, y la página
 *    pintaba «no podemos cargar las novedades» en los dos casos. El día que el
 *    tablón esté legítimamente vacío, la web declara una avería que no existe.
 *    Ahora la fuente devuelve estado y aquí se pintan distinto.
 *
 * 2. EL FEED SE SALTABA EL AISLAMIENTO DE LAS RUTAS LEGACY. La política del
 *    rework se aplicó donde los enlaces se escriben a mano —Home, navegación,
 *    sitemap—; los que trae el feed entraban sin pasar por ninguna criba.
 *    Medido: la entrada «El Programa Fundadores sigue abierto» lleva `link` a
 *    veliacorp.com/precios. Se publica la entrada; no se publica el enlace.
 *    Quien criba es `enlacePublicable()`, en `lib/rutas-congeladas.ts`, con su
 *    prueba en los dos sentidos al lado.
 *
 * 3. JERARQUÍA VISUAL SIN JERARQUÍA REAL. Los rótulos de carril eran `h2` de
 *    11 px en mayúsculas —encabezados de documento usados como etiquetas—, y el
 *    primer anuncio se pintaba a ancho completo y `text-3xl` sólo por ser el
 *    primero del array. El orden lo decide el feed, así que era un destacado
 *    que no controla nadie. Los anuncios pasan a una secuencia con hairline,
 *    como las capacidades de la Home.
 *
 * LO QUE NO SE TOCA: el contenido. Los textos, las fechas y las categorías son
 * del portal (`/admin/novedades`) y su SSoT vive allí. Desde aquí no se filtra
 * ni se reescribe ni una entrada.
 *
 * ⚠️ CERRADO EL 20-sep-2026, POR LA VÍA CORRECTA. Ese anuncio promocionaba el
 * Programa Fundadores —la oferta del modelo descontinuado— y seguía publicado
 * porque esta web pintaba lo que trajera el feed. Ya no: `fetchUpdates()` niega
 * por defecto y sólo publica lo que venga marcado como público (ver
 * `AUDIENCIA_PUBLICA` en `lib/updates.ts`). No se ha borrado ninguna entrada ni
 * se ha tocado el portal: lo que cambia es que publicar en la web pública pasa
 * a ser un acto explícito, que es la decisión de producto.
 *
 * CONSECUENCIA DE HOY: ninguna de las 13 entradas del feed está marcada así, de
 * modo que el tablón sale vacío y lo dice con el estado `ok` —ausencia
 * legítima—, no con el de avería. Por eso la página es `noindex` mientras tanto.
 */

/* Por `metadatosDePagina`, para que `og:title` y `og:url` se deriven de la
   MISMA declaración que el <title> y el canonical. Hasta el 18-sep esta página
   heredaba el openGraph entero del layout: compartirla enseñaba el título de la
   portada y su `og:url` apuntaba a la raíz del sitio. */
export const metadata: Metadata = {
  ...metadatosDePagina({
    titulo: 'Novedades — VELIA',
    tituloAlCompartir: 'Novedades de VELIA — lo que hace, contado con fechas',
    descripcion:
      'El tablón de VELIA: los anuncios de la compañía que se publican aquí, con su fecha.',
    ruta: '/novedades',
  }),
  /* `noindex, follow` desde el 20-sep-2026, y no es un castigo a la página: es
     que mientras el portal no tenga la acción «publicar en la web», el tablón
     está vacío por contrato, y ofrecer a un buscador una página sin contenido
     es pedirle que indexe un hueco. La página sigue viva y respondiendo 200 a
     quien tenga el enlace.

     Se revierte el día que exista una entrada pública: quitar estas líneas y
     devolver la ruta al sitemap y al llms.txt. */
  robots: { index: false, follow: true },
}

/** Una entrada del tablón. Misma pieza en los dos carriles: lo que cambia entre
 *  ellos es la composición que las contiene, no la entrada. */
function Entrada({ u, destacarFecha = false }: { u: ProductUpdate; destacarFecha?: boolean }) {
  const cat = CATEGORY_STYLE[u.category] ?? CATEGORY_STYLE.novedad
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-600 tracking-[0.06em] uppercase ${cat.cls}`}>
          {cat.label}
        </span>
        <time
          dateTime={u.published_at}
          className={`tabular-nums text-void/65 ${destacarFecha ? 'text-[12px]' : 'text-[11px]'}`}
        >
          {formatUpdateDate(u.published_at)}
        </time>
      </div>
      <h3 className="mt-3 text-lg font-600 leading-snug tracking-[-0.01em] text-void">{u.title}</h3>
      <p className="mt-2 text-[15px] leading-[1.6] text-void/65 max-w-prose">{u.body}</p>
      {/* El enlace del feed pasa por la criba de rutas congeladas. Si no la pasa,
          la entrada se publica igual y el enlace no: dejar de anunciar una ruta
          no es romperla. */}
      {enlacePublicable(u.link) && (
        <a
          href={u.link as string}
          className="mt-4 inline-block text-[13px] font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
        >
          Leer más
        </a>
      )}
    </>
  )
}

/** Qué significa que un carril esté vacío. Nunca «no se pudo» por defecto. */
function Silencio({ estado, que }: { estado: 'ok' | 'sin_fuente'; que: string }) {
  return (
    <div className="mt-10 rounded-lg border border-mist bg-white px-7 py-9">
      {estado === 'sin_fuente' ? (
        <p className="text-[15px] leading-[1.6] text-void/70 max-w-prose">
          No hemos podido leer el tablón en este momento. No quiere decir que no haya
          novedades: quiere decir que ahora mismo no lo sabemos. Vuelve en un rato o{' '}
          <Link
            href="/contacto"
            className="font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
          >
            escríbenos
          </Link>{' '}
          y te contamos en qué estamos trabajando.
        </p>
      ) : (
        <p className="text-[15px] leading-[1.6] text-void/70 max-w-prose">
          Todavía no hay {que} publicadas. El tablón se lee bien; simplemente no hay nada
          que contar aquí por ahora.
        </p>
      )}
    </div>
  )
}

export default async function NovedadesPage() {
  const resultado = await fetchUpdates()
  const { company, product } = splitUpdates(resultado.updates)

  return (
    <>
      {/* ═══ CABECERA ═════════════════════════════════════════════════════ */}
      <section aria-labelledby="t-nv-titulo" className="mx-auto max-w-6xl px-6 md:px-10 pt-20 pb-12 md:pt-28 md:pb-16">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">
          Novedades
        </p>
        <h1 id="t-nv-titulo" className="mt-6 text-[clamp(2.15rem,5.6vw,4.5rem)] font-600 tracking-[-0.035em] leading-[1.04] text-void max-w-[16ch]">
          Lo que hace VELIA, contado con fechas.
        </h1>
        <p className="mt-8 text-lg md:text-xl leading-[1.6] text-void/70 max-w-prose">
          Los anuncios de la compañía y lo que se va incorporando a los sistemas que
          construimos y operamos. Cada entrada lleva su fecha, y ninguna describe algo que
          todavía no funcione.
        </p>
      </section>

      {/* ═══ CARRIL 1 · LA COMPAÑÍA ═══════════════════════════════════════
          Secuencia con hairline, no rejilla de tarjetas: ninguna entrada se
          destaca por haber caído la primera en el array. */}
      <section aria-labelledby="t-nv-compania" className="mx-auto max-w-6xl px-6 md:px-10 pb-16 md:pb-20">
        <div className="hairline pt-12 md:pt-16">
          <h2 id="t-nv-compania" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
            La compañía
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-void/65 max-w-prose">
            Anuncios, hitos y cambios de rumbo.
          </p>
        </div>

        {company.length === 0 ? (
          <Silencio estado={resultado.estado} que="novedades de la compañía" />
        ) : (
          <ul className="mt-12 md:mt-16">
            {company.map((u, i) => (
              <Reveal as="li" key={u.id} delay={i === 0 ? 0 : 60} className="hairline">
                <div className="py-9 md:py-11 max-w-3xl">
                  <Entrada u={u} destacarFecha />
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      {/* ═══ CARRIL 2 · LO QUE CONSTRUIMOS ════════════════════════════════
          Blanco sobre Pearl Cloud, como «La distancia» en la Home: cambia lo
          que se está contando, así que cambia la superficie.

          El rótulo ya no dice «Actualizaciones de VELIA Legal». Lo que hay
          debajo es el mismo contenido de siempre, y sigue siendo cierto: son
          mejoras que se incorporaron a sistemas que VELIA opera. Lo que se
          retira es el nombre de un producto que la marca pública ya no usa. */}
      {/* `max-w-6xl` como el carril de arriba, y el ancho de lectura se limita
          DENTRO. Con `max-w-3xl` en el contenedor, el `mx-auto` centraba la
          columna entera y el eje izquierdo saltaba entre una sección y la
          siguiente — se ve a simple vista en cuanto se mira la página de
          arriba abajo. Es el mismo patrón que «La distancia» en la Home. */}
      <section aria-labelledby="t-nv-producto" className="bg-white border-t border-mist">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
          <h2 id="t-nv-producto" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
            Lo que construimos
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-void/65 max-w-prose">
            Mejoras incorporadas a los sistemas que operamos, según fueron entrando en
            producción.
          </p>

          {product.length === 0 ? (
            <Silencio estado={resultado.estado} que="mejoras" />
          ) : (
            <ol className="mt-12 md:mt-16 relative border-l border-mist ml-1.5 max-w-3xl">
              {product.map(u => (
                <li key={u.id} className="relative pl-8 pb-10 last:pb-0">
                  <span
                    className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-gold-ink"
                    aria-hidden="true"
                  />
                  <Entrada u={u} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  )
}
