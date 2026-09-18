/**
 * Las rutas de la etapa SaaS, y la criba que impide volver a anunciarlas.
 *
 * ── POR QUÉ ESTÁ EN SU PROPIO FICHERO ──────────────────────────────────────
 * Esto es política del rework, no lógica del tablón de novedades, que es donde
 * vivía. Separarlo tiene además una consecuencia práctica: sin ninguna
 * dependencia, `node --test` puede cargarlo y probar la criba sin levantar la
 * web ni conocer los `paths` de tsconfig.
 *
 * ── QUÉ PROBLEMA RESUELVE (18-sep-2026) ────────────────────────────────────
 * `/precios`, `/demo`, `/fundadores` y `/legal` siguen vivas y respondiendo
 * 200: no se ha roto ningún enlace, ningún favorito ni ningún correo ya
 * enviado. Lo que dejan de hacer es anunciarse.
 *
 * Esa política se aplicó a la Home, a la navegación y al sitemap — los tres
 * sitios donde los enlaces se escriben a mano. Los enlaces que llegan de FUERA
 * no pasaban por ninguna criba, y el tablón de /novedades los pinta tal cual.
 *
 * Medido sobre el feed en producción: de sus 13 entradas, «El Programa
 * Fundadores sigue abierto» lleva `link` a `https://veliacorp.com/precios`. El
 * pie de TODAS las páginas de la web nueva lleva a /novedades, así que desde
 * cualquier punto del sitio se llegaba a la página de precios de la etapa
 * anterior en dos clics — mientras `qa:home` certificaba, con razón, que la
 * Home no la enlazaba. La guarda miraba donde la apuntaron.
 *
 * Inventario y dependencias de cada ruta:
 * velia-core/docs/design/VELIA_WEB_LEGACY_INVENTORY_2026.md
 */

/** ⚠️ Esta lista tiene un gemelo en `scripts/qa-home.mjs` (`const LEGACY`), y
 *  `lib/updates.test.ts` comprueba que las dos digan lo mismo. Dos listas de lo
 *  mismo en dos ficheros divergen: no se toca una sin la otra. */
export const RUTAS_CONGELADAS = ['/precios', '/demo', '/fundadores', '/legal'] as const

/**
 * ¿Se puede pintar este enlace?
 *
 * NO BORRA NADA. La entrada que lo traía se sigue publicando entera —título,
 * fecha y texto—: el contenido es del portal y no se toca desde la web. Lo
 * único que no se pinta es el enlace. Dejar de anunciar una ruta no es
 * romperla, y es exactamente lo que el rework lleva haciendo desde la etapa 1.
 */
export function enlacePublicable(link: string | null | undefined): boolean {
  if (!link) return false
  try {
    // Absoluta o relativa: las dos pasan por la misma criba, y sin una base no
    // se puede analizar una ruta relativa.
    const { hostname, pathname } = new URL(link, 'https://veliacorp.com')
    const esNuestro = hostname === 'veliacorp.com' || hostname === 'www.veliacorp.com'
    // Un dominio ajeno no es asunto de esta criba: sólo se dejan de anunciar
    // las rutas propias que el rework congeló.
    if (!esNuestro) return true
    // `pathname === r` y no `startsWith(r)` a secas: `/legales` no es `/legal`,
    // y una criba que se come rutas vecinas es un tapón, no una política.
    return !RUTAS_CONGELADAS.some(r => pathname === r || pathname.startsWith(`${r}/`))
  } catch {
    // Un enlace que ni siquiera se deja analizar no se publica.
    return false
  }
}
