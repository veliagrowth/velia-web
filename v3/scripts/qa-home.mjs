/**
 * GUARDA DE LA HOME — el umbral no puede tapar la web.
 *
 * POR QUÉ EXISTE. La Home nueva arranca con un overlay blanco a pantalla
 * completa. Si ese overlay dejara de retirarse, o se montara cuando no debe, el
 * resultado sería una página en blanco — y **no daría ningún error**: el build
 * pasaría, el servidor devolvería 200, el HTML llegaría entero y la consola
 * estaría limpia. Es exactamente la familia de fallo que en este repositorio ya
 * ha mordido: lo que no falla no está necesariamente funcionando.
 *
 * Y hay una razón de negocio además de la técnica: VELIA vende que la
 * infraestructura digital de una empresa sea legible por buscadores y agentes.
 * Una portada que tape su propio contenido sería el contraejemplo de lo que la
 * página de al lado afirma.
 *
 * QUÉ DEMUESTRA CADA COMPROBACIÓN
 *
 *   claim:    el umbral se retira solo
 *   medición: tras 3 s, `[data-umbral]` no está en el DOM y el h1 es visible
 *
 *   claim:    el umbral no existe con prefers-reduced-motion
 *   medición: con la media feature FORZADA en el navegador (no simulada con un
 *             mock de matchMedia), `[data-umbral]` nunca aparece
 *
 *   claim:    el umbral aparece una vez por sesión
 *   medición: segunda navegación en la misma pestaña → no aparece
 *
 *   claim:    el contenido no depende del umbral
 *   medición: el h1 y los seis h2 están en el DOM MIENTRAS el umbral se ve
 *
 *   claim:    la Home no enlaza rutas legacy
 *   medición: cero href a /precios, /demo, /fundadores, /legal en el documento
 *
 *   claim:    un solo h1
 *   medición: document.querySelectorAll('h1').length === 1
 *
 *   npm run qa:home                 (contra localhost:3150)
 *   npm run qa:home -- https://...  (contra lo que sea)
 */
import { createRequire } from 'node:module'
const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const puppeteer = require('puppeteer-core')
/* Las comprobaciones que no son especificas de la Home viven en un solo
   sitio y las comparte con `qa:paginas`. Ver el porque en el modulo. */
import { LEGACY, ANCHOS, medirJerarquia, medirEnlacesLegacy, medirContraste, medirDesborde } from './lib/auditoria-pagina.mjs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:3150/'

const rojo = t => `\x1b[31m${t}\x1b[0m`
const verde = t => `\x1b[32m${t}\x1b[0m`
const gris = t => `\x1b[90m${t}\x1b[0m`

const resultados = []
const comprobar = (titulo, ok, detalle) => {
  resultados.push({ titulo, ok, detalle })
  console.log(`${ok ? verde('✅') : rojo('❌')} ${titulo}${detalle ? gris(` — ${detalle}`) : ''}`)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars'],
})

// ── 0 · PROCEDENCIA: ¿estoy mirando lo mío? ──────────────────────────────────
// Antes de medir nada, comprobar que la URL responde 200 y que lo que hay al
// otro lado ES la Home. Sin esto, una pantalla de error de 500 se mide como si
// fuera la pagina: `h1=0`, `umbral invisible`, `fondo transparente` — tres
// fallos que parecen del producto y son de la sonda.
//
// Paso de verdad el 12-sep: correr `npm run build` con `next dev` levantado le
// pisa `.next/`, el servidor empieza a devolver 500, y esta guarda acuso a tres
// piezas que estaban perfectamente bien. Una evidencia correcta sobre el objeto
// equivocado sigue siendo una evidencia invalida.
{
  const page = await browser.newPage()
  const respuesta = await page.goto(URL, { waitUntil: 'domcontentloaded' })
  const estado = respuesta?.status()
  const esLaHome = await page.evaluate(() => Boolean(document.querySelector('.umbral')))
  await page.close()

  if (estado !== 200 || !esLaHome) {
    await browser.close()
    console.log('')
    console.log(rojo('✖ NO SE HA MEDIDO NADA.'))
    console.log(`  URL:    ${URL}`)
    console.log(`  Estado: HTTP ${estado ?? 'sin respuesta'}`)
    console.log(`  ¿Es la Home?: ${esLaHome ? 'sí' : 'NO — no encuentro el marcado del umbral'}`)
    console.log('')
    console.log('  Esto NO dice que la Home esté rota: dice que la sonda no la ha encontrado.')
    console.log('  Causa habitual: `npm run build` corriendo a la vez que `next dev` — el')
    console.log('  build pisa .next/ y el servidor de desarrollo empieza a devolver 500.')
    console.log('  Reinicia el servidor de desarrollo y vuelve a ejecutar.')
    console.log('')
    process.exit(1)
  }
}

// ── 1 · Recorrido normal: el umbral aparece y se va ──────────────────────────
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(URL, { waitUntil: 'domcontentloaded' })

  // Mientras el umbral se ve, el contenido tiene que estar YA en el DOM. Es la
  // diferencia entre un overlay y una puerta, y es toda la tesis de la pieza.
  // OJO CON QUÉ SE MIDE. El marcado del umbral SIEMPRE está en el DOM (se sirve
  // desde el servidor y vive en `display:none`), así que preguntar si el nodo
  // existe no dice nada. Lo que decide si se ve es el atributo del <html> que
  // pone el script en línea, y lo que decide si tapa es su geometría real.
  const durante = await page.evaluate(() => {
    const capa = document.querySelector('.umbral')
    const cs = capa ? getComputedStyle(capa) : null
    return {
      activo: document.documentElement.getAttribute('data-umbral'),
      pintado: cs ? cs.display !== 'none' && cs.visibility !== 'hidden' : false,
      fondo: cs?.backgroundColor,
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      focusables: capa ? capa.querySelectorAll('a,button,input,select,textarea,[tabindex]').length : -1,
    }
  })

  comprobar('El umbral se activa en la primera visita', durante.activo === '1', `data-umbral="${durante.activo}"`)
  comprobar('El umbral se pinta, y en blanco puro', durante.pintado && durante.fondo === 'rgb(255, 255, 255)', durante.fondo)
  comprobar(
    'El contenido ya está en el DOM mientras el umbral se ve',
    durante.h1 === 1 && durante.h2 >= 6,
    `h1=${durante.h1} h2=${durante.h2}`,
  )
  comprobar('El umbral no tiene nada enfocable dentro', durante.focusables === 0)

  await new Promise(r => setTimeout(r, 3000))

  const despues = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    const r = h1?.getBoundingClientRect()
    const capa = document.querySelector('.umbral')
    const cs = capa ? getComputedStyle(capa) : null
    // La prueba que de verdad importa: ¿quién está bajo el punto central de la
    // pantalla? Si sigue siendo la capa, la página está tapada aunque el CSS
    // diga opacity 0.
    const enElCentro = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
    return {
      activo: document.documentElement.getAttribute('data-umbral'),
      visible: cs ? cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' : false,
      tapando: Boolean(capa && enElCentro && capa.contains(enElCentro)),
      h1Visible: Boolean(r && r.width > 0 && r.height > 0),
    }
  })

  comprobar('El umbral se retira solo', !despues.activo && !despues.visible, `data-umbral="${despues.activo}"`)
  comprobar('El umbral ya no intercepta el clic en el centro', !despues.tapando)
  comprobar('El h1 es visible después', despues.h1Visible)

  // ── 2 · Una vez por sesión ────────────────────────────────────────────────
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  const segunda = await page.evaluate(() => document.documentElement.getAttribute('data-umbral') === '1')
  comprobar('Segunda visita de la misma sesión: no vuelve a aparecer', !segunda)

  await page.close()
}

// ── 3 · prefers-reduced-motion: NO se monta ──────────────────────────────────
// Emulación REAL de la media feature en el navegador. Sustituir matchMedia por
// un mock probaría que el mock funciona, no que el navegador lo respeta.
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'domcontentloaded' })

  const inmediato = await page.evaluate(() => {
    const capa = document.querySelector('.umbral')
    const cs = capa ? getComputedStyle(capa) : null
    return {
      activo: document.documentElement.getAttribute('data-umbral'),
      pintado: cs ? cs.display !== 'none' : false,
      consulta: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    }
  })

  // Control del instrumento: si el navegador no estuviera aplicando la media
  // feature, el resto de esta comprobación no demostraría nada.
  comprobar('El navegador aplica de verdad prefers-reduced-motion', inmediato.consulta)
  comprobar('Con reduced-motion el umbral NO se activa', inmediato.activo === null, `data-umbral="${inmediato.activo}"`)
  comprobar('Con reduced-motion el umbral NO se pinta', !inmediato.pintado)

  await page.close()
}

// ── 3b · SIN JAVASCRIPT: no basta con que el texto esté ──────────────────────
// La primera version de esta guarda comprobaba que el texto de los ocho momentos
// estuviera en el HTML servido. Estaba en el HTML, y aun asi media pagina se veia
// EN BLANCO: los bloques envueltos en <Reveal> salian con `opacity: 0` esperando
// a un IntersectionObserver que sin JavaScript no llega nunca.
//
// El texto en el HTML sirve a un rastreador que lee el marcado. No sirve a una
// persona con el JavaScript caido. Son dos claims distintos y hacen falta dos
// mediciones: el DOM para el primero, la OPACIDAD CALCULADA para el segundo.
{
  const page = await browser.newPage()
  await page.setJavaScriptEnabled(false)
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(URL, { waitUntil: 'domcontentloaded' })

  const sinJs = await page.evaluate(() => {
    const invisibles = [...document.querySelectorAll('.reveal')].filter(el => {
      const cs = getComputedStyle(el)
      return cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none'
    })
    const capa = document.querySelector('.umbral')
    const cs = capa ? getComputedStyle(capa) : null
    return {
      reveals: document.querySelectorAll('.reveal').length,
      invisibles: invisibles.length,
      umbralPintado: cs ? cs.display !== 'none' : false,
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
    }
  })

  comprobar(
    'Sin JS: ningún bloque de la Home queda invisible',
    sinJs.reveals > 0 && sinJs.invisibles === 0,
    `${sinJs.invisibles} invisibles de ${sinJs.reveals} bloques`,
  )
  comprobar('Sin JS: el umbral no se pinta (no hay pantalla blanca)', !sinJs.umbralPintado)
  comprobar('Sin JS: la jerarquía está completa', sinJs.h1 === 1 && sinJs.h2 >= 6, `h1=${sinJs.h1} h2=${sinJs.h2}`)

  await page.close()
}

// ── 4 · Rutas legacy y jerarquía ─────────────────────────────────────────────
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(URL, { waitUntil: 'networkidle0' })

  const enlaces = await medirEnlacesLegacy(page)

  for (const e of enlaces) {
    comprobar(`La Home no enlaza ${e.ruta}`, e.n === 0, e.n ? `${e.n} enlaces` : undefined)
  }

  const jerarquia = await medirJerarquia(page)
  comprobar('Un solo h1 en toda la página', jerarquia.h1 === 1, `h1=${jerarquia.h1}`)
  comprobar('Sin saltos de nivel en los encabezados', jerarquia.saltos === 0, jerarquia.saltos ? `${jerarquia.saltos} saltos` : undefined)

  // ── El header pegajoso sobre las secciones OSCURAS ──────────────────────
  // `check:opacidades` vigila que la clase exista. Esto vigila el EFECTO, que es
  // lo que de verdad importa: sobre las dos secciones oscuras de la Home, el
  // header tiene que tener fondo propio. Si no lo tiene, su tinta oscura queda
  // sobre un fondo oscuro y el menú desaparece — que es exactamente lo que
  // pasaba con `bg-cream/92`, una clase que no existe y no pintaba nada.
  //
  // Una guarda mira el nombre de la clase; la otra mira el píxel. Hacen falta
  // las dos: la primera lo caza antes de desplegar, la segunda lo caza aunque el
  // fallo llegue por otro camino (un z-index, un `mix-blend-mode`, un orden de
  // reglas distinto).
  {
    const oscura = await page.evaluate(() => {
      /* Por CLASE y no por id (20-sep): el primer corte oscuro de la Home
         era `#velia-os` y ahora es `#casos`. Un id que deja de existir no rompe
         esta comprobación: la salta en silencio, que es peor. La clase la lleva
         cualquier sección oscura, hoy y la que venga. */
      const s = document.querySelector('.velia-dark-stage')
      return s ? s.getBoundingClientRect().top + window.scrollY + 400 : null
    })
    if (oscura) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), oscura)
      await new Promise(r => setTimeout(r, 400))
      const header = await page.evaluate(() => {
        const h = document.querySelector('header')
        const fondo = getComputedStyle(h).backgroundColor
        const m = fondo.match(/[\d.]+/g) || []
        const alfa = m.length === 4 ? Number(m[3]) : 1
        return { fondo, alfa, transparente: fondo === 'rgba(0, 0, 0, 0)' || alfa === 0 }
      })
      comprobar(
        'El header tiene fondo propio sobre la sección oscura',
        !header.transparente && header.alfa >= 0.6,
        header.fondo,
      )
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    }
  }

  // ── CONTRASTE MEDIDO sobre los pares reales ────────────────────────────
  // No estimado a partir de la paleta: leído del DOM, resolviendo el fondo
  // heredado y mezclando el alfa del texto. La paleta dice qué color es cada
  // token; solo el DOM dice sobre qué acaba pintándose.
  //
  // Lo encontró aquí el 12-sep: `text-slate` (#707A92) da **4,01:1** sobre Pearl
  // Cloud. La documentación de marca lo llama «texto terciario» y no decía que a
  // tamaño pequeño no llega al 4,5 de la AA. Las etiquetas de sección eran de
  // 11 px, o sea muy lejos del umbral de «texto grande».
  {
    const fallos = await medirContraste(page)
    comprobar(
      'Todo el texto cumple el contraste mínimo de la AA',
      fallos.length === 0,
      fallos.length ? fallos.map(f => `"${f.texto}" ${f.ratio}:1 (min ${f.minimo})`).join(' · ') : undefined,
    )
  }

  // Scroll horizontal: cero, en los tres anchos de referencia.
  for (const { ancho, desborde, recortados } of await medirDesborde(page, ANCHOS)) {
    comprobar(`Sin scroll horizontal a ${ancho}px`, desborde <= 0, `desborde=${desborde}px`)
    comprobar(`Ningún control recortado a ${ancho}px`, recortados.length === 0, recortados.join(' · '))
  }

  await page.close()
}

await browser.close()

const fallos = resultados.filter(r => !r.ok)
console.log('')
if (fallos.length === 0) {
  console.log(verde(`✅ ${resultados.length} comprobaciones, todas en verde.`))
  process.exit(0)
}
console.log(rojo(`❌ ${fallos.length} de ${resultados.length} comprobaciones han fallado:`))
for (const f of fallos) console.log(rojo(`   · ${f.titulo}${f.detalle ? ` (${f.detalle})` : ''}`))
console.log('')
process.exit(1)
