/**
 * Las comprobaciones que valen para CUALQUIER página de la web nueva.
 *
 * ── POR QUÉ EXISTE (18-sep-2026) ───────────────────────────────────────────
 * `qa:home` medía cinco cosas que no tienen nada de específico de la Home —un
 * solo h1, jerarquía sin saltos, contraste AA, cero desborde horizontal y cero
 * enlaces a rutas congeladas— y las medía SOLO en `/`.
 *
 * Mientras la web nueva era una página, eso bastaba. La etapa 2 la dejó en
 * cuatro (`/`, `/sobre-velia`, `/novedades`, `/seguridad`) y las otras tres se
 * comprobaron a mano en el navegador. Una medición a mano no es una guarda: no
 * se repite sola, no falla el push y nadie la vuelve a correr.
 *
 * Y es exactamente la clase de fallo que mordió dos veces en un solo día:
 * el feed de /novedades enlazaba /precios mientras `qa:home` certificaba —con
 * razón— que la Home no la enlazaba; y el algoritmo de contraste aprobaba texto
 * de 1,04:1 porque nadie le había apuntado a un fondo translúcido. **Una guarda
 * sólo mira donde la apuntas.**
 *
 * ── POR QUÉ UN MÓDULO Y NO UN SEGUNDO SCRIPT ───────────────────────────────
 * Copiar estas funciones a un `qa-paginas.mjs` habría creado dos motores de
 * auditoría que miden lo mismo, y dos cosas que miden lo mismo divergen: hoy
 * mismo pasó con la lista de rutas congeladas y con el catálogo de eventos.
 * Así que viven una sola vez aquí y las consumen los dos scripts.
 *
 * Cada función recibe la `page` de puppeteer y devuelve DATOS. No imprime, no
 * decide y no sale con un código: quien llama es quien juzga. Así el mismo
 * medidor sirve para una guarda que falla el push y para una exploración.
 */

/**
 * Las rutas de la etapa SaaS, congeladas por el rework.
 *
 * ⚠️ Tiene un gemelo en `lib/rutas-congeladas.ts` (el que usa la aplicación), y
 * `lib/rutas-congeladas.test.ts` comprueba que las dos digan lo mismo. Son dos
 * porque una vive en TypeScript y otra en un script de Node, y no se importan
 * entre sí; lo que no puede pasar es que nadie las compare.
 */
export const LEGACY = ['/precios', '/demo', '/fundadores', '/legal']

/** Los tres anchos de referencia. 390 es el objetivo real de móvil. */
export const ANCHOS = [[1440, 900], [768, 1024], [390, 844]]

/** Un solo h1, y ningún salto de nivel en los encabezados. */
export async function medirJerarquia(page) {
  const j = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    // Un h3 antes del primer h2 sería un salto de nivel.
    orden: [...document.querySelectorAll('h1,h2,h3')].map(h => Number(h.tagName[1])),
  }))
  let saltos = 0
  for (let i = 1; i < j.orden.length; i++) {
    if (j.orden[i] - j.orden[i - 1] > 1) saltos++
  }
  return { h1: j.h1, saltos, orden: j.orden }
}

/** Enlaces a rutas congeladas, contados por ruta. */
export async function medirEnlacesLegacy(page, legacy = LEGACY) {
  return page.evaluate(
    rutas =>
      rutas.map(ruta => ({
        ruta,
        n: [...document.querySelectorAll('a[href]')].filter(a => {
          const h = a.getAttribute('href')
          return h === ruta || h?.startsWith(ruta + '?') || h?.startsWith(ruta + '#')
        }).length,
      })),
    legacy,
  )
}

/**
 * CONTRASTE MEDIDO sobre los pares reales del DOM.
 *
 * No estimado a partir de la paleta: leído del DOM, componiendo el fondo y
 * mezclando el alfa del texto. La paleta dice qué color es cada token; sólo el
 * DOM dice sobre qué acaba pintándose.
 *
 * ⚠️ El fondo se COMPONE, no se coge el primero que aparezca. Hasta el 17-sep
 * esto subía por el árbol hasta el primer ancestro con alfa > 0 y lo trataba
 * como opaco, así que un `bg-void/5` sobre blanco se medía como Night y texto
 * `cream` encima daba ~17:1 y PASABA — cuando en pantalla es ilegible. Con la
 * trampa inyectada en la Home, la versión anterior daba 25/25 en verde sobre
 * texto de 1,04:1.
 */
export async function medirContraste(page) {
  return page.evaluate(() => {
    const lum = c => {
      const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map(v => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const fondoReal = el => {
      const capas = []
      let n = el
      while (n) {
        const p = getComputedStyle(n).backgroundColor.match(/[\d.]+/g)
        if (p) {
          const a = p.length === 4 ? Number(p[3]) : 1
          if (a > 0) {
            capas.push({ rgb: p.slice(0, 3).map(Number), a })
            if (a === 1) break
          }
        }
        n = n.parentElement
      }
      // Sin capa opaca al final, el lienzo del navegador es blanco.
      if (!capas.length || capas[capas.length - 1].a !== 1) capas.push({ rgb: [255, 255, 255], a: 1 })
      let out = capas[capas.length - 1].rgb
      for (let i = capas.length - 2; i >= 0; i--) {
        const c = capas[i]
        out = out.map((v, j) => c.rgb[j] * c.a + v * (1 - c.a))
      }
      return `rgb(${out.join(',')})`
    }
    const malos = []
    for (const el of document.querySelectorAll('p, h1, h2, h3, li, span, a, time')) {
      const t = el.textContent?.trim()
      if (!t || t.length < 3) continue
      // Solo hojas de texto: un contenedor mide el color heredado, no el suyo.
      if ([...el.children].some(c => c.textContent?.trim())) continue
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      const px = parseFloat(cs.fontSize)
      const peso = Number(cs.fontWeight) || 400
      // WCAG «texto grande»: >=24px, o >=18.66px si es negrita.
      const grande = px >= 24 || (px >= 18.66 && peso >= 700)
      const minimo = grande ? 3 : 4.5
      const bg = fondoReal(el)
      const f = cs.color.match(/[\d.]+/g).map(Number)
      const a = f.length === 4 ? f[3] : 1
      const b = bg.match(/[\d.]+/g).map(Number)
      const mez = `rgb(${f.slice(0, 3).map((v, i) => v * a + b[i] * (1 - a)).join(',')})`
      const [hi, lo] = [lum(mez), lum(bg)].sort((x, y) => y - x)
      const ratio = (hi + 0.05) / (lo + 0.05)
      if (ratio < minimo) {
        malos.push({ texto: t.slice(0, 34), ratio: Math.round(ratio * 100) / 100, px, minimo })
      }
    }
    return malos
  })
}

/** Desborde horizontal en los tres anchos. Devuelve px sobrantes por ancho. */
export async function medirDesborde(page, anchos = ANCHOS) {
  const out = []
  for (const [w, h] of anchos) {
    await page.setViewport({ width: w, height: h })
    await new Promise(r => setTimeout(r, 350))
    const desborde = await page.evaluate(ancho => document.documentElement.scrollWidth - ancho, w)
    out.push({ ancho: w, desborde })
  }
  return out
}

/**
 * Bloques revelados al hacer scroll que se quedan invisibles.
 *
 * `.reveal` esconde con JavaScript y vuelve a enseñar cuando el observer
 * dispara. Si algo lo impide, media página desaparece SIN un solo error —
 * pasó el 1-ago y estuvo así hasta el 12-sep. `qa:home` cubre el caso «sin
 * JS»; esto cubre el caso «con JS», que es el que ve casi todo el mundo.
 *
 * Se recorre la página a un ritmo parecido al humano. No es una prueba de que
 * NUNCA queden invisibles —un salto brusco puede dejar alguno atrás, y así se
 * midió el 18-sep— sino de que en un recorrido normal se revelan todos.
 */
export async function medirReveals(page) {
  return page.evaluate(async () => {
    const alto = document.documentElement.scrollHeight
    for (let y = 0; y < alto; y += 300) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 200))
    }
    window.scrollTo(0, alto)
    await new Promise(r => setTimeout(r, 900))
    const todos = [...document.querySelectorAll('.reveal')]
    return {
      total: todos.length,
      invisibles: todos
        .filter(e => Number(getComputedStyle(e).opacity) < 0.9)
        .map(e => (e.textContent || '').trim().slice(0, 40)),
    }
  })
}
