/**
 * QA del hero — lo que el MCP no me deja hacer: forzar prefers-reduced-motion
 * y barrer varios viewports en la misma sesión.
 *
 * Comprueba, por viewport:
 *   · desbordamiento horizontal del documento
 *   · solapes entre piezas visibles
 *   · centro geométrico y CENTRO ÓPTICO (baricentro de la tinta) del conjunto
 *   · procedencia ↔ documento de origen visible  ← la regla de Joaquín
 *   · la ventana cabe dentro de la escena
 * Y aparte, con prefers-reduced-motion: reduce, que NO haya ni una animación.
 */
import { createRequire } from 'node:module'
const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const puppeteer = require('puppeteer-core')

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:3141/'

const VIEWPORTS = [
  { nombre: 'móvil estrecho', width: 320, height: 720, mobile: true },
  { nombre: 'móvil',          width: 390, height: 844, mobile: true },
  { nombre: 'tablet',         width: 768, height: 1024, mobile: false },
  { nombre: 'portátil',       width: 1280, height: 900, mobile: false },
  { nombre: 'ancho',          width: 1920, height: 1080, mobile: false },
]

/** Los datos del expediente y de qué pieza vienen. Si la pieza no está en
 *  pantalla, su procedencia no debe estar tampoco. */
const PROCEDENCIAS = {
  'de Correo de Martínez': 'Correo de Martínez',
  'de Notificación.pdf': 'Notificación.pdf',
  'de Honorarios.csv': 'Honorarios.csv',
}

const medir = (procedencias) => {
  const m = document.querySelector('.mesa')
  if (!m) return { error: 'no hay .mesa' }

  const anims = m.getAnimations({ subtree: true })
  anims.forEach(a => a.pause())
  anims.forEach(a => { try { a.currentTime = 10500 } catch (e) {} })

  const visible = el => el.getClientRects().length > 0 && +getComputedStyle(el).opacity > 0.01
  const win = m.querySelector('.mesa-win').getBoundingClientRect()
  const esc = m.getBoundingClientRect()

  // Procedencia ↔ documento de origen
  const piezasEnPantalla = [...m.querySelectorAll('.mesa-pz')]
    .filter(el => getComputedStyle(el).display !== 'none')
    .map(el => el.querySelector('.nom').textContent.trim())
  const huerfanas = [...m.querySelectorAll('.mesa-win .de')]
    .filter(visible)
    .map(d => d.textContent.trim())
    .filter(t => !piezasEnPantalla.includes(procedencias[t]))

  // Ahora al momento de la convergencia, para medir la composición
  anims.forEach(a => { try { a.currentTime = 6000 } catch (e) {} })
  const pz = [...m.querySelectorAll('.mesa-pz')].filter(el => getComputedStyle(el).display !== 'none')
  const rects = pz.map(el => el.getBoundingClientRect())
  const solapes = []
  for (let i = 0; i < rects.length; i++)
    for (let j = i + 1; j < rects.length; j++) {
      const A = rects[i], B = rects[j]
      if (A.left < B.right && B.left < A.right && A.top < B.bottom && B.top < A.bottom) solapes.push(`${i}-${j}`)
    }

  // Centro óptico: baricentro ponderado por ÁREA de cada pieza (la tinta que
  // pesa), frente al centro geométrico de la caja. Si difieren, la composición
  // se siente descolgada aunque las coordenadas sean simétricas.
  const areaTotal = rects.reduce((a, r) => a + r.width * r.height, 0)
  const optico = {
    x: rects.reduce((a, r) => a + (r.left + r.width / 2) * r.width * r.height, 0) / areaTotal,
    y: rects.reduce((a, r) => a + (r.top + r.height / 2) * r.width * r.height, 0) / areaTotal,
  }
  const punto = m.querySelector('.mesa-punto').getBoundingClientRect()
  const cPunto = { x: punto.left + punto.width / 2, y: punto.top + punto.height / 2 }

  return {
    piezasVisibles: pz.length,
    solapes,
    procedenciasHuerfanas: huerfanas,
    ventanaCabe: win.height <= esc.height + 1,
    ventanaAlto: Math.round(win.height),
    escenaAlto: Math.round(esc.height),
    puntoVsCentroEscena: {
      x: +(cPunto.x - (esc.left + esc.width / 2)).toFixed(1),
      y: +(cPunto.y - (esc.top + esc.height / 2)).toFixed(1),
    },
    centroOpticoVsPunto: { x: +(optico.x - cPunto.x).toFixed(1), y: +(optico.y - cPunto.y).toFixed(1) },
    scrollHorizontal: document.documentElement.scrollWidth > window.innerWidth,
  }
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] })

console.log('\n═══ BARRIDO DE VIEWPORTS ═══')
for (const v of VIEWPORTS) {
  const page = await browser.newPage()
  await page.setViewport({ width: v.width, height: v.height, isMobile: v.mobile, hasTouch: v.mobile, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.querySelector('.mesa')?.scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 400))
  const r = await page.evaluate(medir, PROCEDENCIAS)
  const ok = !r.error && !r.scrollHorizontal && r.solapes.length === 0 && r.procedenciasHuerfanas.length === 0 && r.ventanaCabe
  console.log(`\n${ok ? '✅' : '❌'} ${v.nombre} (${v.width}×${v.height})`)
  console.log(`   piezas ${r.piezasVisibles} · solapes ${r.solapes.length} · scroll-x ${r.scrollHorizontal}`)
  console.log(`   ventana ${r.ventanaAlto}px en escena ${r.escenaAlto}px → cabe: ${r.ventanaCabe}`)
  console.log(`   punto vs centro escena: ${r.puntoVsCentroEscena.x} / ${r.puntoVsCentroEscena.y} px`)
  console.log(`   CENTRO ÓPTICO vs punto: ${r.centroOpticoVsPunto.x} / ${r.centroOpticoVsPunto.y} px`)
  if (r.procedenciasHuerfanas.length) console.log(`   🔴 procedencia sin su documento: ${r.procedenciasHuerfanas.join(', ')}`)
  await page.close()
}

console.log('\n═══ prefers-reduced-motion: reduce ═══')
for (const v of [VIEWPORTS[1], VIEWPORTS[3]]) {
  const page = await browser.newPage()
  await page.setViewport({ width: v.width, height: v.height, isMobile: v.mobile, hasTouch: v.mobile, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.querySelector('.mesa')?.scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 1200))
  const r = await page.evaluate(() => {
    const m = document.querySelector('.mesa')
    const anims = m.getAnimations({ subtree: true })
    const vis = el => +getComputedStyle(el).opacity > 0.01
    return {
      loQueDiceElNavegador: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      animacionesCorriendo: anims.length,
      dataPlay: m.dataset.play ?? '(sin poner)',
      ventanaVisible: vis(m.querySelector('.mesa-win')),
      cierreVisible: vis(m.querySelector('.mesa-cierre')),
      filasVisibles: [...m.querySelectorAll('.mesa-fila')].filter(el => getComputedStyle(el).display !== 'none').filter(vis).length,
      piezasVisibles: [...m.querySelectorAll('.mesa-pz')].filter(el => el.getClientRects().length > 0).filter(vis).length,
      simboloVisible: vis(m.querySelector('.mesa-marca')),
      botonPausaOculto: !document.body.textContent.includes('Pausar'),
    }
  })
  const ok = r.loQueDiceElNavegador && r.animacionesCorriendo === 0 && r.ventanaVisible && r.cierreVisible &&
             r.piezasVisibles === 0 && !r.simboloVisible && r.botonPausaOculto
  console.log(`\n${ok ? '✅' : '❌'} ${v.nombre}`)
  console.log(`   el navegador lo confirma: ${r.loQueDiceElNavegador}`)
  console.log(`   animaciones activas: ${r.animacionesCorriendo}  (tiene que ser 0)`)
  console.log(`   data-play: ${r.dataPlay}`)
  console.log(`   se ve: ventana ${r.ventanaVisible} · cierre ${r.cierreVisible} · ${r.filasVisibles} filas`)
  console.log(`   NO se ve: piezas ${r.piezasVisibles} · símbolo ${r.simboloVisible}`)
  console.log(`   botón de pausa oculto (no hay nada que pausar): ${r.botonPausaOculto}`)
  await page.close()
}

console.log('\n═══ BUCLE: tres vueltas seguidas ═══')
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.querySelector('.mesa')?.scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 300))
  const muestras = await page.evaluate(async () => {
    const m = document.querySelector('.mesa')
    const anims = m.getAnimations({ subtree: true })
    anims.forEach(a => a.pause())
    const leer = () => ({
      piezas: +getComputedStyle(m.querySelector('.mesa-pz')).opacity > 0.01,
      ventana: +getComputedStyle(m.querySelector('.mesa-win')).opacity > 0.01,
      simbolo: +getComputedStyle(m.querySelector('.mesa-marca')).opacity > 0.01,
    })
    const out = []
    // Tres ciclos completos, muestreando los mismos cuatro instantes
    for (let ciclo = 0; ciclo < 3; ciclo++) {
      for (const t of [1000, 4500, 6200, 10500]) {
        anims.forEach(a => { try { a.currentTime = ciclo * 12000 + t } catch (e) {} })
        out.push({ ciclo: ciclo + 1, t, ...leer() })
      }
    }
    return out
  })
  const firma = t => muestras.filter(m => m.t === t).map(m => `${+m.piezas}${+m.ventana}${+m.simbolo}`)
  let estable = true
  for (const t of [1000, 4500, 6200, 10500]) {
    const f = firma(t)
    const igual = f.every(x => x === f[0])
    if (!igual) estable = false
    console.log(`   t=${(t / 1000).toFixed(1)}s → ${f.join(' | ')} ${igual ? '✅ idéntico en las tres vueltas' : '❌ el ciclo deriva'}`)
  }
  console.log(`\n${estable ? '✅' : '❌'} El bucle repite exactamente lo mismo cada vuelta.`)
  await page.close()
}

await browser.close()
