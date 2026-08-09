/**
 * QA DEL HERO — lo que el build no ve.
 *
 * Corre un Chrome de verdad y comprueba, en siete viewports, lo que ninguna
 * compilación detecta: composición, centrado medido, paridad de contenido entre
 * tamaños, y `prefers-reduced-motion` FORZADO de verdad (no solo escrito).
 *
 * Existe porque en cuatro iteraciones aparecieron cuatro fallos de la misma
 * familia —una regla correcta ganándole a otra regla correcta— y ninguno daba
 * error. Ya ha mordido cinco veces.
 *
 *   npm run qa:hero                 (contra localhost:3150)
 *   npm run qa:hero -- https://...  (contra lo que sea)
 */
import { createRequire } from 'node:module'
const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const puppeteer = require('puppeteer-core')

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:3150/'

const VIEWPORTS = [
  { n: '375×812',   w: 375,  h: 812,  m: true },
  { n: '390×844',   w: 390,  h: 844,  m: true },
  { n: '430×932',   w: 430,  h: 932,  m: true },
  { n: '768×1024',  w: 768,  h: 1024, m: false },
  { n: '1280×800',  w: 1280, h: 800,  m: false },
  { n: '1440×900',  w: 1440, h: 900,  m: false },
  { n: '1920×1080', w: 1920, h: 1080, m: false },
]

/** Cada dato del expediente y el documento del que dice venir. */
const ORIGEN = {
  'de Notificación.pdf': 'Notificación.pdf',
  'de Correo de Martínez': 'Correo de Martínez',
  'de Honorarios.csv': 'Honorarios.csv',
}

/** Primeros caracteres de los dos paths del asset oficial del símbolo. Si el
 *  logo se redibujara a mano, esto dejaría de casar. */
const PATHS_OFICIALES = ['M156.91035,311.86381c-3.32518', 'M156.91035,311.86381c-1.33008']

const medir = (origen, pathsOficiales) => {
  const m = document.querySelector('.mesa')
  if (!m) return { error: 'no hay .mesa' }
  const enCaja = el => el.getClientRects().length > 0

  const anims = m.getAnimations({ subtree: true })
  anims.forEach(a => a.pause())

  const esc = m.getBoundingClientRect()
  const centro = { x: esc.left + esc.width / 2, y: esc.top + esc.height / 2 }

  // ── Estado final: expediente completo y procedencias ─────────────────────
  anims.forEach(a => { try { a.currentTime = 10500 } catch (e) {} })
  const win = m.querySelector('.mesa-win')
  const winCaja = win.getBoundingClientRect()
  const datos = [...m.querySelectorAll('.mesa-win .dato')].filter(enCaja)
  const procedencias = [...m.querySelectorAll('.mesa-win .de')].filter(enCaja).map(d => d.textContent.trim())

  // ── Convergencia: piezas, símbolo y hub ──────────────────────────────────
  anims.forEach(a => { try { a.currentTime = 6200 } catch (e) {} })
  const svg = [...m.querySelectorAll('.mesa-svg')].find(enCaja)
  const marca = svg.querySelector('.mesa-marca').getBoundingClientRect()
  const punto = svg.querySelector('.mesa-punto').getBoundingClientRect()
  const dibujo = {
    left: Math.min(marca.left, punto.left), right: Math.max(marca.right, punto.right),
    top: Math.min(marca.top, punto.top), bottom: Math.max(marca.bottom, punto.bottom),
  }
  const cDibujo = { x: (dibujo.left + dibujo.right) / 2, y: (dibujo.top + dibujo.bottom) / 2 }
  const hub = { x: punto.left + punto.width / 2, y: punto.top + punto.height / 2 }

  // ¿Mueren TODAS las trazas en el hub?
  const caja = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal
  const aPx = (x, y) => ({ x: caja.left + (x / vb.width) * caja.width, y: caja.top + (y / vb.height) * caja.height })
  const trazas = [...svg.querySelectorAll('.mesa-tz')].filter(enCaja)
  const distFinales = trazas.map(t => {
    const p = t.getPointAtLength(t.getTotalLength())
    const q = aPx(p.x, p.y)
    return Math.hypot(q.x - hub.x, q.y - hub.y)
  })

  const pz = [...m.querySelectorAll('.mesa-pz')].filter(enCaja)
  const rects = pz.map(el => el.getBoundingClientRect())
  const solapes = []
  for (let i = 0; i < rects.length; i++)
    for (let j = i + 1; j < rects.length; j++) {
      const A = rects[i], B = rects[j]
      if (A.left < B.right && B.left < A.right && A.top < B.bottom && B.top < A.bottom) solapes.push(`${i}-${j}`)
    }

  // Centro óptico: baricentro de la tinta —las seis piezas y el dibujo del
  // símbolo, cada uno por su área— frente al hub.
  const piezasArea = rects.reduce((a, r) => a + r.width * r.height, 0)
  const simArea = (dibujo.right - dibujo.left) * (dibujo.bottom - dibujo.top) * 0.4
  const optico = {
    x: (rects.reduce((a, r) => a + (r.left + r.width / 2) * r.width * r.height, 0) + cDibujo.x * simArea) / (piezasArea + simArea),
    y: (rects.reduce((a, r) => a + (r.top + r.height / 2) * r.width * r.height, 0) + cDibujo.y * simArea) / (piezasArea + simArea),
  }

  const dPaths = [...svg.querySelectorAll('.mesa-marca path')].map(p => p.getAttribute('d'))

  return {
    hubX: +(hub.x - centro.x).toFixed(1),
    hubY: +(hub.y - centro.y).toFixed(1),
    dibujoVsHub: { x: +(cDibujo.x - hub.x).toFixed(1), y: +(cDibujo.y - hub.y).toFixed(1) },
    opticoVsHub: { x: +(optico.x - hub.x).toFixed(1), y: +(optico.y - hub.y).toFixed(1) },
    assetOficial: pathsOficiales.every((p, i) => (dPaths[i] || '').startsWith(p)),
    piezas: pz.length,
    conceptos: pz.map(p => p.querySelector('.apo').textContent),
    trazas: trazas.length,
    trazasAlHub: distFinales.length > 0 && Math.max(...distFinales) - Math.min(...distFinales) < 1.5,
    solapes: solapes.length,
    datos: datos.length,
    etiquetas: datos.map(d => d.querySelector('.k').textContent),
    cabecera: enCaja(m.querySelector('.marcaprod')) && enCaja(m.querySelector('.mesa-win .est')),
    cierre: enCaja(m.querySelector('.mesa-cierre')),
    copyCompleto: (m.querySelector('.dice')?.textContent || '').includes('Todo está preparado para que continúes'),
    procedenciasHuerfanas: procedencias.filter(t => !pz.map(p => p.querySelector('.nom').textContent.trim()).includes(origen[t])),
    ventanaCabe: winCaja.height <= esc.height + 1,
    overflow: document.documentElement.scrollWidth > window.innerWidth,
  }
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] })
const filas = []

for (const v of VIEWPORTS) {
  const page = await browser.newPage()
  await page.setViewport({ width: v.w, height: v.h, isMobile: v.m, hasTouch: v.m, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.querySelector('.mesa')?.scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 400))
  filas.push({ v: v.n, ...(await page.evaluate(medir, ORIGEN, PATHS_OFICIALES)) })
  await page.close()
}

const si = b => (b ? '✅' : '❌')
const px = n => `${n > 0 ? '+' : ''}${n} px`
console.log('\n══════════════════ QA DEL HERO ══════════════════\n')
console.log('| Test                      | ' + filas.map(f => f.v.padEnd(9)).join('| ') + '|')
console.log('|---------------------------|' + filas.map(() => '-----------|').join(''))
const linea = (t, f) => console.log('| ' + t.padEnd(25) + ' | ' + filas.map(x => String(f(x)).padEnd(9)).join('| ') + '|')
linea('Hub X centrado', f => px(f.hubX))
linea('Hub Y centrado', f => px(f.hubY))
linea('Símbolo asset oficial', f => si(f.assetOficial))
linea('6 piezas presentes', f => si(f.piezas === 6) + ' ' + f.piezas)
linea('6 trazas al hub', f => si(f.trazas === 6 && f.trazasAlHub))
linea('3 datos finales', f => si(f.datos === 3) + ' ' + f.datos)
linea('Cabecera VELIA + exp.', f => si(f.cabecera))
linea('Cierre + copy completo', f => si(f.cierre && f.copyCompleto))
linea('Procedencia correcta', f => si(f.procedenciasHuerfanas.length === 0))
linea('Sin overflow', f => si(!f.overflow))
linea('Sin solapes', f => si(f.solapes === 0))
linea('Ventana cabe', f => si(f.ventanaCabe))
linea('Centro óptico vs hub', f => px(f.opticoVsHub.y))
linea('Dibujo símbolo vs hub', f => px(f.dibujoVsHub.y))

console.log('\nConceptos por viewport:')
for (const f of filas) console.log(`  ${f.v.padEnd(10)} ${f.conceptos.join(' · ')}`)

console.log('\n═══ prefers-reduced-motion: reduce ═══')
for (const v of [VIEWPORTS[1], VIEWPORTS[4]]) {
  const page = await browser.newPage()
  await page.setViewport({ width: v.w, height: v.h, isMobile: v.m, hasTouch: v.m, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.querySelector('.mesa')?.scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 1200))
  const r = await page.evaluate(() => {
    const m = document.querySelector('.mesa')
    const enCaja = el => el.getClientRects().length > 0
    const vis = el => enCaja(el) && +getComputedStyle(el).opacity > 0.01
    return {
      confirmado: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      animaciones: m.getAnimations({ subtree: true }).length,
      ventana: vis(m.querySelector('.mesa-win')),
      datos: [...m.querySelectorAll('.mesa-win .dato')].filter(vis).length,
      cierre: vis(m.querySelector('.mesa-cierre')),
      piezas: [...m.querySelectorAll('.mesa-pz')].filter(vis).length,
      simbolo: [...m.querySelectorAll('.mesa-marca')].filter(vis).length,
      pausaOculta: !document.body.textContent.includes('Pausar'),
    }
  })
  const ok = r.confirmado && r.animaciones === 0 && r.ventana && r.datos === 3 && r.cierre &&
             r.piezas === 0 && r.simbolo === 0 && r.pausaOculta
  console.log(`${si(ok)} ${v.n} → animaciones ${r.animaciones} · expediente ${r.datos}/3 datos + cierre ${si(r.cierre)} · sin piezas ${si(r.piezas === 0)} · sin símbolo ${si(r.simbolo === 0)} · pausa oculta ${si(r.pausaOculta)}`)
  await page.close()
}

console.log('\n═══ BUCLE: tres vueltas ═══')
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.querySelector('.mesa')?.scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 300))
  const muestras = await page.evaluate(() => {
    const m = document.querySelector('.mesa')
    const anims = m.getAnimations({ subtree: true })
    anims.forEach(a => a.pause())
    const leer = () => [
      +(+getComputedStyle(m.querySelector('.mesa-pz')).opacity > 0.01),
      +(+getComputedStyle(m.querySelector('.mesa-win')).opacity > 0.01),
      +(+getComputedStyle(m.querySelector('.mesa-svg--sm .mesa-marca')).opacity > 0.01),
    ].join('')
    const out = []
    for (let c = 0; c < 3; c++) for (const t of [1000, 4500, 6200, 10500]) {
      anims.forEach(a => { try { a.currentTime = c * 12000 + t } catch (e) {} })
      out.push({ t, firma: leer() })
    }
    return out
  })
  let estable = true
  for (const t of [1000, 4500, 6200, 10500]) {
    const f = muestras.filter(x => x.t === t).map(x => x.firma)
    const igual = f.every(x => x === f[0])
    if (!igual) estable = false
    console.log(`  t=${(t / 1000).toFixed(1)}s → ${f.join(' | ')} ${si(igual)}`)
  }
  console.log(`\n${si(estable)} El bucle repite exactamente lo mismo cada vuelta.`)
  await page.close()
}

await browser.close()
