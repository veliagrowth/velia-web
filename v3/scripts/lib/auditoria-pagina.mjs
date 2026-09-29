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

/**
 * Los anchos de referencia. 390 es el objetivo real de móvil.
 *
 * ── DE TRES A SEIS (22-sep-2026) ──────────────────────────────────────────
 * Eran tres —1440, 768, 390— y los demás anchos de la revisión (375, 1024,
 * 1280, 1920) se medían A MANO en la sesión que tocara. Una medición a mano no
 * es una guarda: no se repite sola, no falla el push y nadie la vuelve a correr.
 * Es el mismo razonamiento por el que este módulo existe, aplicado a sí mismo.
 *
 * Entran los tres que más cubren de lo que faltaba:
 *   375   el móvil pequeño que sigue vivo (iPhone SE / mini). Es el ancho donde
 *         primero se rompe un titular largo o una rejilla de dos columnas.
 *   1024  el punto exacto donde Tailwind cambia a `lg:`, o sea donde más
 *         rejillas cambian de forma a la vez: el ancho con más superficie de
 *         fallo de todo el sitio.
 *   1280  el portátil más común, y hasta hoy no lo miraba nada automático.
 *
 * NO entra 1920: por encima de 1440 el contenido ya está limitado por
 * `max-w-6xl` y lo único que crece es el margen. Medirlo repite 1440 y cuesta
 * tiempo de ejecución. Si algún día algo se sale a pantalla completa, entra.
 *
 * Coste: dobla el número de comprobaciones de desborde y recorte. Vale la pena
 * — las tres roturas que esta familia de guardas ha cazado se vieron todas en un
 * ancho intermedio y en ninguno de los tres que había.
 */
export const ANCHOS = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844], [375, 812]]

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
    /* ── POR QUÉ LA LISTA CRECE (29-sep-2026) ───────────────────────────────
       Eran ocho etiquetas: `p, h1, h2, h3, li, span, a, time`. Ninguna de las
       que faltaban es exótica, y una de ellas escondía un fallo de nivel AA en
       producción: el botón «Cookies» de `/cookies` —el control que el RGPD
       art. 7.3 exige para RETIRAR el consentimiento— se pintaba con
       `text-cream/55`, que es el token de superficie OSCURA, dentro de un
       párrafo sobre Pearl Cloud. Medido: **1,00:1**. Pearl sobre Pearl. Un
       botón invisible en la frase que dice «puedes retirarlo desde aquí».

       Se coló porque `<button>` no estaba en esta lista, no porque el
       algoritmo fallara: el algoritmo nunca lo miró. Es, otra vez, que una
       guarda sólo mira donde la apuntas — y aquí se la apuntó a las etiquetas
       de prosa, no a los controles.

       Las que entran ahora y por qué: `button` (controles), `td`/`th`
       (la tabla de cookies), `label` (formulario de /contacto), `code`,
       `dt`/`dd` (las preguntas de /ai-search), `strong`, `em`, `summary`,
       `figcaption`, `blockquote`. Todas son hojas de texto visible; el filtro
       de «solo hojas» de abajo sigue descartando contenedores. */
    const ETIQUETAS_CON_TEXTO =
      'p, h1, h2, h3, li, span, a, time, button, td, th, label, code, dt, dd, strong, em, summary, figcaption, blockquote'
    for (const el of document.querySelectorAll(ETIQUETAS_CON_TEXTO)) {
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

/**
 * Desborde horizontal en los tres anchos: px sobrantes Y controles recortados.
 *
 * ⚠️ `scrollWidth` sólo ve el desborde que llega al documento. Si un ancestro
 * recorta (`overflow-x: hidden/clip`), lo que se sale no crea scroll: SE CORTA,
 * y `scrollWidth` sigue diciendo cero. Así estuvo el botón «Hablemos» de la
 * cabecera entre 768 y ~835 px, medio fuera de la pantalla, mientras esta
 * función certificaba «sin scroll horizontal» a 768 en todas las páginas
 * (cazado el 19-sep revisando capturas, no por ninguna guarda).
 *
 * Por eso se mide también la otra propiedad: ningún enlace o botón visible
 * puede quedar fuera del viewport. Se excluyen los que viven dentro de una
 * franja con scroll horizontal propio (pestañas, tablas): ahí salirse del
 * borde es el diseño, y se alcanzan desplazando.
 */
export async function medirDesborde(page, anchos = ANCHOS) {
  const out = []
  for (const [w, h] of anchos) {
    await page.setViewport({ width: w, height: h })
    await new Promise(r => setTimeout(r, 350))
    const r = await page.evaluate(ancho => {
      const enFranjaConScroll = el => {
        for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
          const ox = getComputedStyle(n).overflowX
          if ((ox === 'auto' || ox === 'scroll') && n.scrollWidth > n.clientWidth) return true
        }
        return false
      }
      const recortados = [...document.querySelectorAll('a[href], button')]
        .filter(el => {
          const cs = getComputedStyle(el)
          if (cs.visibility === 'hidden') return false
          const b = el.getBoundingClientRect()
          if (b.width < 2 || b.height < 2) return false // oculto o sr-only
          return (b.right > ancho + 1 || b.left < -1) && !enFranjaConScroll(el)
        })
        .map(el => (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30))

      /* ── CONTENIDO CORTADO, NO SÓLO CONTROLES (22-sep-2026) ──────────────
         El comentario de arriba ya sabía que `scrollWidth` es ciego con
         `overflow-x: clip`, y la respuesta fue mirar los CONTROLES recortados.
         Cubre el caso que mordió —el botón «Hablemos» medio fuera—, y deja
         fuera todo lo demás: un párrafo, una rejilla, una tarjeta o una imagen
         que se salgan del viewport se cortan en silencio y ninguna de las dos
         mediciones lo ve.

         Medido hoy, y no supuesto: se metió un `<div>` de 420 px en la Home,
         se construyó y se sirvió. A 375 px la guarda entera se quedó EN VERDE
         —`desborde=0px` y cero controles recortados— mientras el elemento
         estaba a `right: 420`. Con el build íntegro al lado como control, 0.
         `BASE → PASS · ROMPER → FAIL · RESTAURAR → PASS`.

         Misma exclusión que arriba: dentro de una franja con scroll propio
         salirse del borde es el diseño. Y se ignora lo que no ocupa sitio. */
      const cortado = []
      for (const el of document.querySelectorAll('body *')) {
        const b = el.getBoundingClientRect()
        if (b.width < 2 || b.height < 2) continue
        if (getComputedStyle(el).visibility === 'hidden') continue
        if (b.right <= ancho + 1 && b.left >= -1) continue
        if (enFranjaConScroll(el)) continue
        cortado.push(
          el.tagName.toLowerCase() +
            (el.className ? '.' + String(el.className).trim().split(/\s+/)[0] : '') +
            '@' + Math.round(b.right),
        )
      }

      return { desborde: document.documentElement.scrollWidth - ancho, recortados, cortado }
    }, w)
    out.push({ ancho: w, ...r })
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
