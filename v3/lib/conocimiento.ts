import { SITE_URL } from '@/lib/constants'

/**
 * Lo que comparten las piezas de conocimiento (guías y artículos de /ai-search).
 *
 * Extraído el 19-sep-2026, al escribir la segunda: cada pieza declaraba a mano
 * su JSON-LD, y dos declaraciones de la misma estructura divergen. Aquí se
 * decide UNA vez cómo se liga una pieza a la entidad de VELIA.
 */

export type Fuente = { href: string; texto: string }

export const fechaLarga = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

/**
 * El índice de un grupo de piezas: un `WebPage`, no un `Article`.
 *
 * Un hub no es un texto fechado que alguien firma: es la entrada a un tema, y
 * se actualiza cuando cambia el tema. Por eso no declara `datePublished` ni
 * `dateModified` —no tendría un hecho detrás— y sí `hasPart`, que dice qué
 * piezas cuelgan de él. Con eso, el grupo entero se lee como lo que es.
 */
export function jsonLdDeIndice({
  ruta,
  titular,
  descripcion,
  piezas,
}: {
  ruta: string
  titular: string
  descripcion: string
  /** Rutas de las piezas hijas, con su `#article` ya declarado por cada una. */
  piezas: readonly string[]
}) {
  const url = `${SITE_URL}${ruta}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: titular,
        description: descripcion,
        inLanguage: 'es-ES',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        hasPart: piezas.map(p => ({ '@id': `${SITE_URL}${p}#article` })),
      },
    ],
  }
}

/**
 * `WebPage` + `Article`, ligados por `@id` al `Organization` y al `WebSite`
 * que declara el layout. Nada se repite: autor y publisher son la misma
 * organización, por referencia.
 *
 * Lo que NO se declara, y es deliberado: `FAQPage` (la Fase 0 retiró uno),
 * `HowTo`, `Person` como autor —nadie ha firmado estos textos: HUMAN_DECISION—
 * y cualquier valoración.
 *
 * `publicada: null` = todavía no publicada: no se declara `datePublished`.
 * Ver `metadatosDePagina` y la comprobación de fechas de `qa:paginas`.
 */
export function jsonLdDeArticulo({
  ruta,
  titular,
  descripcion,
  publicada,
  revisada,
  fuentes,
  dentroDe,
}: {
  ruta: string
  titular: string
  descripcion: string
  publicada: string | null
  revisada: string
  fuentes: readonly Fuente[]
  /** Ruta del hub que agrupa la pieza, si lo hay. El hub declara `hasPart`
   *  hacia ella y ella `isPartOf` hacia él: la relación queda dicha por los
   *  dos lados, que es como se lee un grupo y no dos páginas sueltas. */
  dentroDe?: string
}) {
  const url = `${SITE_URL}${ruta}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: titular,
        inLanguage: 'es-ES',
        isPartOf: dentroDe
          ? [{ '@id': `${SITE_URL}/#website` }, { '@id': `${SITE_URL}${dentroDe}#webpage` }]
          : { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: titular,
        description: descripcion,
        inLanguage: 'es-ES',
        ...(publicada ? { datePublished: publicada } : {}),
        dateModified: revisada,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: { '@id': `${url}#webpage` },
        citation: fuentes.map(f => f.href),
      },
    ],
  }
}
