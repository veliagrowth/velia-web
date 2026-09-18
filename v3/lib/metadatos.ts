import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'

/**
 * Los metadatos de una página, derivados de una sola declaración.
 *
 * ── QUÉ PROBLEMA RESUELVE (18-sep-2026) ────────────────────────────────────
 * Cada página definía su `title`, su `description` y su `canonical`, y NINGUNA
 * definía `openGraph`. Next no fusiona campo a campo: si una página no declara
 * `openGraph`, hereda entero el del layout. Medido sobre el HTML servido:
 *
 *   ruta            <title>                                    og:title
 *   /sobre-velia    Sobre VELIA | Compañía de transformación…   VELIA | Infraestructura digital…
 *   /novedades      Novedades — VELIA                           VELIA | Infraestructura digital…
 *   /seguridad      Seguridad — VELIA                           VELIA | Infraestructura digital…
 *   /contacto       Hablemos — VELIA                            VELIA | Infraestructura digital…
 *
 * Y las cuatro declaraban `og:url` = `https://veliacorp.com`. Compartir
 * /seguridad en WhatsApp, LinkedIn o Slack enseñaba el título de la portada, y
 * el `og:url` le decía a la red social que la página compartida era la Home —
 * que es peor que el título equivocado: es apuntar a otro sitio.
 *
 * Nada de esto da error, no lo ve ninguna guarda de build y sólo se nota al
 * pegar un enlace en un chat.
 *
 * ── POR QUÉ UN HELPER Y NO CUATRO BLOQUES A MANO ───────────────────────────
 * Porque `title` y `og:title` son dos declaraciones de lo mismo, y dos cosas
 * que dicen lo mismo en dos sitios divergen. Hoy mismo pasó tres veces: el
 * catálogo de eventos, la lista de rutas congeladas y el número de pilares
 * escrito a mano. Aquí se declara UNA vez y se derivan los tres.
 *
 * `qa:paginas` comprueba el resultado sobre el HTML servido: que `og:title`
 * coincide con el `<title>` y que `og:url` coincide con el canonical. El helper
 * hace que sea difícil equivocarse; la guarda comprueba que no se ha hecho.
 */
export function metadatosDePagina({
  titulo,
  descripcion,
  ruta,
  /** Para el <title> de la pestaña cuando conviene que sea más corto que el de
   *  compartir. Si no se pasa, los dos son `titulo`. */
  tituloAlCompartir,
}: {
  titulo: string
  descripcion: string
  /** Con barra inicial, sin barra final. La Home es ''. */
  ruta: string
  tituloAlCompartir?: string
}): Metadata {
  const url = `${SITE_URL}${ruta}`
  const compartir = tituloAlCompartir ?? titulo
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      title: compartir,
      description: descripcion,
      url,
      siteName: 'VELIA',
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: compartir,
      description: descripcion,
    },
  }
}
