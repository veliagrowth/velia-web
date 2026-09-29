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
 * Fundadores sigue abierto» lleva `link` a `https://veliacorp.com/precios`.
 * Entonces el pie de TODAS las páginas llevaba a /novedades, así que desde
 * cualquier punto del sitio se llegaba a la página de precios de la etapa
 * anterior en dos clics — mientras `qa:home` certificaba, con razón, que la
 * Home no la enlazaba. La guarda miraba donde la apuntaron.
 *
 * ── LO QUE CAMBIÓ DESPUÉS, Y POR QUÉ LA CRIBA SE QUEDA (29-sep-2026) ───────
 * Ese camino de dos clics YA NO EXISTE, y este comentario afirmaba en presente
 * que sí: `504a1c4` sacó /novedades del pie a la vez que el tablón pasó a negar
 * por defecto. Hoy la ruta está aislada —`noindex, follow`, fuera del sitemap y
 * sin un solo enlace entrante—. Medido el 29-sep sobre el HTML servido, no
 * sobre el código: la Home no imprime ni una vez «/novedades».
 *
 * Eso NO deja a esta criba sin trabajo, y conviene decirlo para que nadie la
 * retire creyendo que sobra. El aislamiento de /novedades es una decisión de
 * producto REVERSIBLE —se revierte el día que exista una entrada pública— y la
 * criba es lo que impide que, al revertirla, vuelva con ella el enlace a la
 * oferta descontinuada. Es defensa en profundidad, no redundancia.
 *
 * Inventario y dependencias de cada ruta:
 * velia-core/docs/design/VELIA_WEB_LEGACY_INVENTORY_2026.md
 */

/** ⚠️ Esta lista tiene un gemelo en `scripts/lib/auditoria-pagina.mjs`
 *  (`const LEGACY`), y `lib/rutas-congeladas.test.ts` comprueba que las dos
 *  digan lo mismo. Dos listas de lo mismo en dos ficheros divergen: no se toca
 *  una sin la otra.
 *
 *  ⚠️ Los dos nombres de esta nota estaban equivocados hasta el 29-sep-2026:
 *  decía `scripts/qa-home.mjs` —de donde `LEGACY` se movió al módulo
 *  compartido— y `lib/updates.test.ts`, que no existe. Una nota que manda
 *  mantener dos ficheros sincronizados y nombra mal los dos manda a revisar el
 *  sitio equivocado. */
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
