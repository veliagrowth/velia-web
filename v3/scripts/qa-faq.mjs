/**
 * QA de la FAQ — comportamiento, no existencia de cadenas.
 *
 * CLAIM: el acordeón de la Home abre y cierra, lo anuncia, se maneja con
 *   teclado, no desborda en 375/768/1024/1440 ni cerrado ni ABIERTO, su texto
 *   cumple AA y no se mueve con `prefers-reduced-motion`.
 * MEDICIÓN: se pulsa de verdad, se navega con Tab y Enter, y se mide el DOM
 *   renderizado en los cuatro anchos con todos los paneles abiertos.
 * POR QUÉ DEMUESTRA EL CLAIM: las guardas del repo miden la página en reposo.
 *   Un acordeón en reposo está cerrado, así que su contenido —el que más
 *   puede desbordar— no lo ha visto ninguna.
 */
import { createRequire } from 'node:module'
const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const puppeteer = require('puppeteer-core')

const BASE = 'http://localhost:3150'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--no-sandbox'],
})

const r = []
const ok = (t, cond, det) => r.push({ t, cond: !!cond, det })

// ── 1 · Estructura, estado y teclado ──────────────────────────────────────
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })

  const base = await page.evaluate(() => {
    const bs = [...document.querySelectorAll('[id^="faq-b-"]')]
    return {
      n: bs.length,
      sonBoton: bs.every(b => b.tagName === 'BUTTON'),
      enH3: bs.every(b => b.parentElement?.tagName === 'H3'),
      cerrados: bs.every(b => b.getAttribute('aria-expanded') === 'false'),
      controlaExistente: bs.every(b => !!document.getElementById(b.getAttribute('aria-controls') || '')),
      panelesOcultos: [...document.querySelectorAll('[id^="faq-p-"]')].every(p => p.hidden),
      etiquetados: [...document.querySelectorAll('[id^="faq-p-"]')].every(
        p => document.getElementById(p.getAttribute('aria-labelledby') || '')),
    }
  })
  ok('hay 11 preguntas', base.n === 11, `${base.n}`)
  ok('cada control es un <button> real', base.sonBoton)
  ok('cada pregunta es un titular (h3)', base.enH3)
  ok('arrancan todas cerradas', base.cerrados)
  ok('aria-controls apunta a un panel existente', base.controlaExistente)
  ok('los paneles cerrados están hidden (fuera del árbol a11y)', base.panelesOcultos)
  ok('cada panel declara aria-labelledby a su botón', base.etiquetados)

  /* ── POR QUE HAY QUE DESPLAZAR A MANO, Y CON `instant` ──────────────────
     `page.click()` falla aqui, y no por el componente: `globals.css:41` pone
     `scroll-behavior: smooth`, asi que el desplazamiento de ~5.750 px hasta la
     FAQ se ANIMA. Puppeteer desplaza, pincha enseguida y para entonces el
     boton sigue fuera del viewport: medido, `getBoundingClientRect().top` =
     5750 y `elementFromPoint` del centro devuelve nada.
     Con `behavior: 'instant'` el salto es inmediato, y despues se pincha con
     `page.mouse.click()` en las coordenadas medidas: sigue siendo un clic de
     raton de verdad, que es lo que se quiere demostrar. */
  const pinchar = async id => {
    await page.evaluate(sel => {
      const el = document.getElementById(sel)
      const y = el.getBoundingClientRect().top + window.scrollY - 250
      window.scrollTo({ top: y, behavior: 'instant' })
    }, id)
    /* 500 ms y no 150: tras el salto, los revelados de scroll de las secciones
       de arriba siguen entrando y el layout se mueve unos pixeles mas. Medir
       la caja y pinchar antes de que asiente hace que el raton caiga al lado.
       Medido: con 150 ms el clic no llegaba; con 400+ ms si, y el evento
       llega al boton con `isTrusted: true`. */
    await new Promise(x => setTimeout(x, 500))
    const caja = await page.evaluate(sel => {
      const r = document.getElementById(sel).getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, visible: r.top > 60 && r.bottom < 900 }
    }, id)
    if (!caja.visible) throw new Error(`${id} no quedo visible tras desplazar`)
    await page.mouse.click(caja.x, caja.y)
    await new Promise(x => setTimeout(x, 120))
  }

  // Clic de raton real sobre la primera
  await pinchar('faq-b-precio')
  const trasClic = await page.evaluate(() => ({
    exp: document.getElementById('faq-b-precio').getAttribute('aria-expanded'),
    visible: !document.getElementById('faq-p-precio').hidden,
    texto: (document.getElementById('faq-p-precio').textContent || '').trim().length,
    otraCerrada: document.getElementById('faq-p-modelo').hidden,
  }))
  ok('al pulsar, aria-expanded pasa a true', trasClic.exp === 'true', trasClic.exp)
  ok('al pulsar, el panel deja de estar hidden', trasClic.visible)
  ok('el panel abierto tiene texto', trasClic.texto > 120, `${trasClic.texto} car.`)
  ok('abrir una NO cierra otra', trasClic.otraCerrada)

  await pinchar('faq-b-precio')
  const trasSegundo = await page.evaluate(() => ({
    exp: document.getElementById('faq-b-precio').getAttribute('aria-expanded'),
    oculto: document.getElementById('faq-p-precio').hidden,
  }))
  ok('al volver a pulsar, cierra', trasSegundo.exp === 'false' && trasSegundo.oculto)

  // Teclado: foco + Enter, y anillo visible
  await page.focus('#faq-b-modelo')
  await page.keyboard.press('Enter')
  const teclado = await page.evaluate(() => {
    const b = document.getElementById('faq-b-modelo')
    const cs = getComputedStyle(b)
    return {
      exp: b.getAttribute('aria-expanded'),
      enfocado: document.activeElement === b,
      outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
    }
  })
  ok('Enter abre la pregunta enfocada', teclado.exp === 'true')
  ok('el foco se queda en el botón', teclado.enfocado)
  ok('el botón enfocado tiene anillo visible', !/none/.test(teclado.outline) && parseFloat(teclado.outline.split(' ')[1]) > 0, teclado.outline)

  // Espacio también (comportamiento nativo de <button>)
  await page.keyboard.press('Space')
  ok('Espacio cierra la pregunta enfocada',
    (await page.evaluate(() => document.getElementById('faq-b-modelo').getAttribute('aria-expanded'))) === 'false')

  await page.close()
}

// ── 2 · Desbordamiento con TODO abierto, en los cuatro anchos ─────────────
for (const w of [375, 768, 1024, 1440]) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: 900 })
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => {
    for (const b of document.querySelectorAll('[id^="faq-b-"]')) b.click()
  })
  await new Promise(x => setTimeout(x, 400))
  const m = await page.evaluate(() => {
    const abiertos = [...document.querySelectorAll('[id^="faq-p-"]')].filter(p => !p.hidden).length
    const doc = document.documentElement
    const seccion = document.getElementById('preguntas')
    const cajas = [...seccion.querySelectorAll('*')].filter(e => {
      const r = e.getBoundingClientRect()
      return r.width > 1 && (r.right > doc.clientWidth + 1 || r.left < -1)
    }).map(e => e.tagName.toLowerCase() + '.' + (e.getAttribute('class') || '').split(' ')[0])
    return {
      abiertos,
      desbordePagina: doc.scrollWidth - doc.clientWidth,
      fuera: cajas.slice(0, 3),
    }
  })
  ok(`${w}px · las 11 quedan abiertas`, m.abiertos === 11, `${m.abiertos}`)
  ok(`${w}px · la página no desborda en horizontal`, m.desbordePagina <= 0, `${m.desbordePagina}px`)
  ok(`${w}px · ningún elemento de la FAQ se sale del viewport`, m.fuera.length === 0, m.fuera.join(' · '))
  await page.close()
}

// ── 3 · Contraste del texto de la FAQ, abierta ────────────────────────────
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => { for (const b of document.querySelectorAll('[id^="faq-b-"]')) b.click() })
  const malos = await page.evaluate(() => {
    const lum = c => {
      const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const rgb = c => c.match(/[\d.]+/g).slice(0, 3).map(Number)
    const alfa = c => { const m = c.match(/[\d.]+/g); return m.length > 3 ? Number(m[3]) : 1 }
    const fondo = el => {
      let n = el
      while (n) {
        const bg = getComputedStyle(n).backgroundColor
        if (alfa(bg) === 1) return rgb(bg)
        n = n.parentElement
      }
      return [255, 255, 255]
    }
    const fuera = []
    for (const el of document.querySelectorAll('#preguntas p, #preguntas span, #preguntas h2, #preguntas h3')) {
      const t = (el.textContent || '').trim()
      if (!t || [...el.children].some(c => c.textContent?.trim())) continue
      const cs = getComputedStyle(el)
      const bg = fondo(el)
      const f = rgb(cs.color), a = alfa(cs.color)
      const ef = f.map((v, i) => v * a + bg[i] * (1 - a))
      const L1 = lum(`rgb(${ef.join(',')})`), L2 = lum(`rgb(${bg.join(',')})`)
      const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1]
      const ratio = (hi + 0.05) / (lo + 0.05)
      const px = parseFloat(cs.fontSize), peso = Number(cs.fontWeight) || 400
      const min = (px >= 24 || (px >= 18.66 && peso >= 700)) ? 3 : 4.5
      if (ratio < min) fuera.push(`${t.slice(0, 30)} ${ratio.toFixed(2)}:1 (min ${min})`)
    }
    return fuera
  })
  ok('todo el texto de la FAQ cumple AA', malos.length === 0, malos.join(' · '))
  await page.close()
}

// ── 4 · Movimiento reducido: sin animación, y sigue funcionando ───────────
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
  await page.click('#faq-b-ia')
  const rm = await page.evaluate(() => {
    const p = document.getElementById('faq-p-ia')
    const signo = document.querySelector('#faq-b-ia span[aria-hidden] span:last-child')
    return {
      abre: !p.hidden,
      animacion: getComputedStyle(p).animationName,
      transicionSigno: getComputedStyle(signo).transitionProperty,
      opacidad: getComputedStyle(p).opacity,
    }
  })
  ok('con motion reducido la pregunta abre igual', rm.abre)
  ok('con motion reducido no hay animación de entrada', rm.animacion === 'none', rm.animacion)
  ok('con motion reducido el signo no transiciona', !/transform/.test(rm.transicionSigno), rm.transicionSigno)
  ok('el panel abierto es totalmente opaco', Number(rm.opacidad) === 1, rm.opacidad)
  await page.close()
}

await browser.close()

const fallos = r.filter(x => !x.cond)
for (const x of r) console.log(`  ${x.cond ? '\x1b[32m✅\x1b[0m' : '\x1b[31m❌\x1b[0m'} ${x.t}${x.det ? `\x1b[90m — ${x.det}\x1b[0m` : ''}`)
console.log('')
if (fallos.length) { console.log(`\x1b[31m❌ ${fallos.length} de ${r.length} han fallado\x1b[0m`); process.exitCode = 1 }
else console.log(`\x1b[32m✅ ${r.length} comprobaciones de la FAQ, todas en verde.\x1b[0m`)
