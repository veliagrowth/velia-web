/**
 * Las rutas de la etapa SaaS, y la criba que impide volver a anunciarlas.
 *
 * ── POR QUÉ ESTÁ EN SU PROPIO FICHERO ──────────────────────────────────────
 * Esto es política del rework, no lógica del tablón de novedades, que es donde
 * vivía. Separarlo tiene además una consecuencia práctica: sin ninguna
 * dependencia, `node --test` puede cargarlo y probar la criba sin levantar la
 * web ni conocer los `paths` de tsconfig.
 *
 * ── LO QUE SON HOY: RETIRADAS, NO CONGELADAS (29-sep-2026) ─────────────────
 * `/precios`, `/demo`, `/fundadores` y `/legal` **ya no existen**. Sus páginas
 * se han borrado del repositorio, así que el App Router no tiene nada que
 * servir y Next responde 404. Lo comprueba `qa:identidad`, en su bloque
 * RETIRADAS: un 200 ahí es un fallo.
 *
 * Este fichero se llamaba `rutas-congeladas.ts` y la política era la
 * contraria: seguían vivas a 200 con `noindex`, «dejan de anunciarse, no se
 * rompen». Se revirtió porque `noindex` es una petición a un buscador, no un
 * control de acceso: escribiendo la URL se llegaba igual a 99 €/mes, a la
 * prueba de 15 días, al Programa Fundadores y a «un día de tu despacho», que
 * es la oferta de un producto descontinuado.
 *
 * ── ENTONCES, ¿POR QUÉ SIGUE HABIENDO UNA CRIBA? ───────────────────────────
 * Porque el 404 protege la ruta, no los enlaces que apuntan a ella. El feed de
 * /novedades lo escribe el portal y sigue trayendo `link` a
 * `https://veliacorp.com/precios` en la entrada del Programa Fundadores.
 * Sin esta criba, la web pintaría un enlace que lleva a un 404 — peor que no
 * pintarlo: una página rota es una promesa incumplida, no una ausencia.
 *
 * Así que la función no cambia ni una línea; cambia lo que evita. Antes
 * impedía anunciar una página viva que ya no representaba a VELIA. Ahora
 * impide anunciar una página que no está.
 *
 * ── DE DÓNDE VENÍA (18-sep-2026) ───────────────────────────────────────────
 * La política de no anunciarlas se aplicó a la Home, a la navegación y al sitemap — los tres
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
 * Ese camino de dos clics ya no existe: `504a1c4` sacó /novedades del pie a la
 * vez que el tablón pasó a negar por defecto. Hoy la ruta está aislada
 * —`noindex, follow`, fuera del sitemap y sin un solo enlace entrante—. Medido
 * el 29-sep sobre el HTML servido, no sobre el código: la Home no imprime ni
 * una vez «/novedades».
 *
 * Y ese aislamiento es REVERSIBLE —se revierte el día que exista una entrada
 * pública—, que es la otra razón por la que la criba se queda.
 *
 * Inventario y dependencias de cada ruta:
 * velia-core/docs/design/VELIA_WEB_LEGACY_INVENTORY_2026.md
 */

/** ⚠️ Esta lista tiene un gemelo en `scripts/lib/auditoria-pagina.mjs`
 *  (`const LEGACY`), y `lib/rutas-retiradas.test.ts` comprueba que las dos
 *  digan lo mismo. Dos listas de lo mismo en dos ficheros divergen: no se toca
 *  una sin la otra.
 *
 *  ⚠️ Los dos nombres de esta nota estaban equivocados hasta el 29-sep-2026:
 *  decía `scripts/qa-home.mjs` —de donde `LEGACY` se movió al módulo
 *  compartido— y `lib/updates.test.ts`, que no existe. Una nota que manda
 *  mantener dos ficheros sincronizados y nombra mal los dos manda a revisar el
 *  sitio equivocado. */
export const RUTAS_RETIRADAS = ['/precios', '/demo', '/fundadores', '/legal'] as const

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
    return !RUTAS_RETIRADAS.some(r => pathname === r || pathname.startsWith(`${r}/`))
  } catch {
    // Un enlace que ni siquiera se deja analizar no se publica.
    return false
  }
}
