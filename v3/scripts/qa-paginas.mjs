/**
 * GUARDA — lo que vale para la Home vale para TODAS las páginas vivas.
 *
 * ── POR QUÉ EXISTE (18-sep-2026) ───────────────────────────────────────────
 * `qa:home` mide un solo h1, jerarquía sin saltos, contraste AA, cero desborde
 * horizontal y cero enlaces a rutas congeladas. Ninguna de esas cinco cosas
 * tiene nada de específico de la Home, y sin embargo sólo se medían en `/`.
 *
 * Mientras la web nueva era una página eso bastaba. La etapa 2 la dejó en
 * cuatro, y las otras tres se comprobaron a mano en el navegador. **Una
 * medición a mano no es una guarda**: no se repite sola, no falla el push y
 * nadie la vuelve a correr. Esto la convierte en una.
 *
 * Es la misma clase de fallo que mordió dos veces en un solo día: el feed de
 * /novedades enlazaba /precios mientras `qa:home` certificaba —con razón— que
 * la Home no la enlazaba, y el contraste aprobaba texto de 1,04:1 porque nadie
 * le había apuntado a un fondo translúcido. Una guarda sólo mira donde la
 * apuntas, así que hay que apuntarla a todo.
 *
 * ── QUÉ NO HACE ────────────────────────────────────────────────────────────
 * No mide el umbral, ni la segunda visita, ni el comportamiento sin JavaScript,
 * ni el header sobre las secciones oscuras: eso es de la Home y se queda en
 * `qa:home`. Las dos comparten medidor (`scripts/lib/auditoria-pagina.mjs`) y
 * no duplican ni una línea de medición: dos cosas que miden lo mismo divergen.
 *
 * Tampoco mide vocabulario. Que una página legal siga hablando de «despachos»
 * es una decisión con efectos jurídicos, no un fallo técnico, y una guarda no
 * es el sitio donde se toma.
 */
import { createRequire } from 'node:module'
import {
  LEGACY,
  ANCHOS,
  medirJerarquia,
  medirEnlacesLegacy,
  medirContraste,
  medirDesborde,
  medirReveals,
} from './lib/auditoria-pagina.mjs'

const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const puppeteer = require('puppeteer-core')

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.argv[2] || 'http://localhost:3150'

/**
 * Las superficies VIVAS de la web nueva. No están las congeladas: siguen
 * respondiendo 200 y no se auditan porque no son la web nueva — auditarlas
 * sería pedirles que cumplan un sistema de diseño que ya no es el suyo.
 *
 * `/seguridad` SÍ está aunque no aparezca en el sitemap: sale de él porque
 * publica claims `pending`, no porque nadie llegue. La enlazan `/privacidad` e
 * `/ia-responsable`, que están en el pie de todas las páginas.
 */
const RUTAS = [
  '/',
  '/sobre-velia',
  '/novedades',
  '/contacto',
  '/seguridad',
  '/aviso-legal',
  '/privacidad',
  '/cookies',
  '/terminos',
  '/ia-responsable',
]

const rojo = t => `\x1b[31m${t}\x1b[0m`
const verde = t => `\x1b[32m${t}\x1b[0m`
const gris = t => `\x1b[90m${t}\x1b[0m`

const resultados = []
const comprobar = (ruta, titulo, ok, detalle) => {
  resultados.push({ ruta, titulo, ok, detalle })
  console.log(`  ${ok ? verde('✅') : rojo('❌')} ${titulo}${detalle ? gris(` — ${detalle}`) : ''}`)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

try {
  for (const ruta of RUTAS) {
    const url = `${BASE}${ruta}`
    console.log(`\n${gris(url)}`)
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })

    const respuesta = await page.goto(url, { waitUntil: 'networkidle0' })

    /* PRECONDICIÓN DE PROCEDENCIA. Si la página no responde 200, todo lo que
       se mida debajo es sobre una página de error: cero enlaces legacy y cero
       fallos de contraste, todo en verde, midiendo un 404. Un verde así es
       peor que un rojo. Se corta aquí. */
    if (!respuesta || respuesta.status() !== 200) {
      comprobar(ruta, `${ruta} responde 200`, false, `HTTP ${respuesta?.status() ?? 'sin respuesta'}`)
      await page.close()
      continue
    }

    const jerarquia = await medirJerarquia(page)
    comprobar(ruta, `${ruta} · un solo h1`, jerarquia.h1 === 1, `h1=${jerarquia.h1}`)
    comprobar(
      ruta,
      `${ruta} · sin saltos de nivel en los encabezados`,
      jerarquia.saltos === 0,
      jerarquia.saltos ? `${jerarquia.saltos} saltos` : undefined,
    )

    const enlaces = await medirEnlacesLegacy(page, LEGACY)
    const conFuga = enlaces.filter(e => e.n > 0)
    comprobar(
      ruta,
      `${ruta} · no enlaza ninguna ruta congelada`,
      conFuga.length === 0,
      conFuga.length ? conFuga.map(e => `${e.ruta} (${e.n})`).join(' · ') : undefined,
    )

    const reveals = await medirReveals(page)
    comprobar(
      ruta,
      `${ruta} · ningún bloque queda invisible al recorrerla`,
      reveals.invisibles.length === 0,
      reveals.invisibles.length ? reveals.invisibles.join(' · ') : `${reveals.total} reveals`,
    )

    // El contraste, después del recorrido: lo que no se ha revelado todavía
    // está a opacidad 0 y no se puede medir su tinta.
    const fallos = await medirContraste(page)
    comprobar(
      ruta,
      `${ruta} · todo el texto cumple el contraste AA`,
      fallos.length === 0,
      fallos.length ? fallos.map(f => `"${f.texto}" ${f.ratio}:1 (min ${f.minimo})`).join(' · ') : undefined,
    )

    for (const { ancho, desborde } of await medirDesborde(page, ANCHOS)) {
      comprobar(ruta, `${ruta} · sin scroll horizontal a ${ancho}px`, desborde <= 0, `desborde=${desborde}px`)
    }

    await page.close()
  }
} finally {
  await browser.close()
}

const fallos = resultados.filter(r => !r.ok)
console.log('')
if (fallos.length === 0) {
  console.log(verde(`✅ ${resultados.length} comprobaciones sobre ${RUTAS.length} páginas, todas en verde.`))
  process.exit(0)
}
console.log(rojo(`❌ ${fallos.length} de ${resultados.length} comprobaciones han fallado:`))
for (const f of fallos) console.log(rojo(`   · ${f.titulo}${f.detalle ? ` (${f.detalle})` : ''}`))
console.log('')
process.exit(1)
