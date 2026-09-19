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
}: {
  ruta: string
  titular: string
  descripcion: string
  publicada: string | null
  revisada: string
  fuentes: readonly Fuente[]
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
        isPartOf: { '@id': `${SITE_URL}/#website` },
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
