/**
 * GUARDA — la identidad que el dominio proyecta a una máquina.
 *
 * ── POR QUÉ EXISTE (19-sep-2026 · Fase 0) ──────────────────────────────────
 * La auditoría de AI Search midió que el 51% del texto indexable de
 * veliacorp.com describía a VELIA como un SaaS jurídico: cuatro rutas legacy
 * plenamente indexables, y una de ellas publicando además un JSON-LD `FAQPage`
 * con el precio de un producto descontinuado.
 *
 * Nada de eso daba error. No lo veía ninguna guarda, no rompía el build y sólo
 * se notaba leyendo el HTML servido ruta por ruta, a mano. Esto es ese «a mano»
 * convertido en algo que se repite solo y falla el push.
 *
 * ── QUÉ COMPRUEBA ──────────────────────────────────────────────────────────
 * 1. Las superficies de la web nueva son indexables.
 * 2. Las cuatro legacy están aisladas (`noindex`) Y SIGUEN VIVAS (200). Las dos
 *    cosas: un 404 también «deja de indexarse», y sería un fallo, no un éxito.
 * 3. Los documentos legales obligatorios siguen indexables. Aislarlos por
 *    estética o por arrastre sería un error con consecuencias legales.
 * 4. NINGUNA ruta publica un `FAQPage`. Es la señal que se retiró y la que más
 *    fácilmente volvería, porque es la que todo tutorial de SEO recomienda.
 * 5. El grafo de entidad está entero y sus referencias resuelven.
 * 6. Ninguna ruta INDEXABLE publica «VELIA Legal», que es el nombre que la
 *    marca pública ya no usa.
 * 7. El `llms.txt` (19-sep): responde, tiene su H1, no publica «VELIA Legal»,
 *    sólo enlaza superficies vivas y no congeladas, y no se queda atrás del
 *    sitemap. Los claims que publica los vigila `check:claims`.
 *
 * ── LO QUE NO COMPRUEBA, Y SE DICE ─────────────────────────────────────────
 * El vocabulario de las páginas legales. `/terminos` y `/privacidad` siguen
 * hablando de «despachos» y de «prueba gratuita», y eso es texto jurídico: su
 * corrección es una decisión humana con efectos legales, no un fallo técnico.
 * Una guarda no es el sitio donde se toma. Está declarado como HUMAN_DECISION.
 */
import { createRequire } from 'node:module'

const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const puppeteer = require('puppeteer-core')

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.argv[2] || 'http://localhost:3150'

/** La clasificación de la Fase 0. Cambiar una fila de columna es una decisión,
 *  no un ajuste: por eso está aquí arriba y no repartida por el código. */
const SUPERFICIES = [
  // La web nueva: tiene que ser indexable.
  { ruta: '/', clase: 'NUEVA' },
  { ruta: '/sobre-velia', clase: 'NUEVA' },
  { ruta: '/novedades', clase: 'NUEVA' },
  { ruta: '/contacto', clase: 'NUEVA' },
  /* `/seguridad` es NUEVA y es indexable, pero está FUERA del sitemap porque
     publica claims `pending`. Salir del sitemap no es `noindex`: son dos cosas
     distintas y aquí se comprueba la segunda. */
  { ruta: '/seguridad', clase: 'NUEVA' },
  // Fase 1: la primera pieza de conocimiento.
  { ruta: '/ai-search/preparar-una-web', clase: 'NUEVA' },

  // Legacy: aislada, y viva.
  { ruta: '/precios', clase: 'LEGACY_AISLADA' },
  { ruta: '/demo', clase: 'LEGACY_AISLADA' },
  { ruta: '/fundadores', clase: 'LEGACY_AISLADA' },
  { ruta: '/legal', clase: 'LEGACY_AISLADA' },

  // Obligación legal: se quedan indexables.
  { ruta: '/aviso-legal', clase: 'LEGAL_KEEP' },
  { ruta: '/privacidad', clase: 'LEGAL_KEEP' },
  { ruta: '/cookies', clase: 'LEGAL_KEEP' },
  { ruta: '/terminos', clase: 'LEGAL_KEEP' },
  { ruta: '/ia-responsable', clase: 'LEGAL_KEEP' },
]

const rojo = t => `\x1b[31m${t}\x1b[0m`
const verde = t => `\x1b[32m${t}\x1b[0m`
const gris = t => `\x1b[90m${t}\x1b[0m`

const resultados = []
const comprobar = (titulo, ok, detalle) => {
  resultados.push({ titulo, ok, detalle })
  if (!ok) console.log(`  ${rojo('❌')} ${titulo}${detalle ? gris(` — ${detalle}`) : ''}`)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

/** El registro reproducible que la Fase 0 pedía: una fila por superficie. */
const registro = []

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  for (const { ruta, clase } of SUPERFICIES) {
    const respuesta = await page.goto(`${BASE}${ruta}`, { waitUntil: 'domcontentloaded' })
    const status = respuesta?.status() ?? 0

    const datos = await page.evaluate(() => {
      const meta = n => document.querySelector(`meta[name="${n}"]`)?.getAttribute('content') ?? null
      const bloques = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map(s => { try { return JSON.parse(s.textContent) } catch { return null } })
      const tipos = []
      for (const b of bloques) {
        if (!b) { tipos.push('JSON_INVALIDO'); continue }
        for (const n of b['@graph'] ?? [b]) tipos.push(n['@type'])
      }
      const grafo = bloques.find(b => b?.['@graph'])?.['@graph'] ?? []
      const org = grafo.find(n => n['@type'] === 'Organization')
      const site = grafo.find(n => n['@type'] === 'WebSite')
      return {
        title: document.title,
        h1: (document.querySelector('h1')?.textContent || '').replace(/\s+/g, ' ').trim(),
        description: (meta('description') || '').slice(0, 70),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
        robots: meta('robots'),
        tipos,
        // «VELIA Legal» en el texto visible, no en comentarios del marcado.
        diceVeliaLegal: /VELIA\s+Legal/i.test(document.body.innerText || ''),
        orgId: org?.['@id'] ?? null,
        publisherId: site?.publisher?.['@id'] ?? null,
      }
    })

    const noindex = /noindex/i.test(datos.robots || '')
    registro.push({ ruta, clase, status, robots: datos.robots ?? '—', tipos: datos.tipos.join('+'), title: datos.title })

    // ── 1 · Todas siguen vivas. Un 404 no es «aislar»: es romper.
    comprobar(`${ruta} responde 200`, status === 200, `HTTP ${status}`)

    // ── 2 · Indexabilidad según la clase declarada arriba.
    if (clase === 'NUEVA') {
      comprobar(`${ruta} (NUEVA) es indexable`, !noindex, datos.robots ?? undefined)
    } else if (clase === 'LEGACY_AISLADA') {
      comprobar(`${ruta} (LEGACY) está aislada con noindex`, noindex, datos.robots ?? 'sin meta robots')
    } else {
      comprobar(`${ruta} (LEGAL) sigue indexable`, !noindex, datos.robots ?? undefined)
    }

    // ── 3 · Canonical presente y auto-referenciado.
    comprobar(`${ruta} tiene canonical propio`, !!datos.canonical && datos.canonical.endsWith(ruta === '/' ? '.com' : ruta), datos.canonical ?? 'NINGUNO')

    // ── 4 · Ningún FAQPage, en ninguna parte. Es LA señal que se retiró.
    comprobar(`${ruta} no publica FAQPage`, !datos.tipos.includes('FAQPage'), datos.tipos.join('+'))

    // ── 5 · Nada de JSON-LD ilegible.
    comprobar(`${ruta} tiene JSON-LD válido`, !datos.tipos.includes('JSON_INVALIDO'))

    // ── 6 · El nombre retirado no se publica donde se indexa.
    if (!noindex) {
      comprobar(`${ruta} (indexable) no publica «VELIA Legal»`, !datos.diceVeliaLegal)
    }

    // ── 7 · El grafo de entidad, entero y con sus referencias resueltas.
    comprobar(`${ruta} declara Organization y WebSite`, datos.tipos.includes('Organization') && datos.tipos.includes('WebSite'), datos.tipos.join('+'))
    comprobar(`${ruta} · publisher de WebSite resuelve al Organization`, !!datos.orgId && datos.publisherId === datos.orgId, `${datos.publisherId} → ${datos.orgId}`)
  }

  await page.close()
} finally {
  await browser.close()
}

/* ── EL llms.txt ES OTRA COPIA DE LA IDENTIDAD ───────────────────────────────
   Añadido el 19-sep-2026. Ese día el `llms.txt` que servía veliacorp.com
   (la web anterior) seguía describiendo el producto descontinuado —con su
   nombre, su precio y su prueba gratuita— y ninguna guarda lo leía: todas
   miraban páginas HTML. Es la superficie que se escribe pensando en las
   máquinas, y era la única que no comprobaba nadie.

   Se le exige lo mismo que a una página indexable, más lo que sólo tiene
   él: que enlace únicamente superficies vivas y no congeladas, y que no se
   quede atrás del sitemap. */
{
  const res = await fetch(`${BASE}/llms.txt`, { cache: 'no-store' })
  const texto = res.ok ? await res.text() : ''
  const tipo = res.headers.get('content-type') ?? ''
  comprobar('/llms.txt responde 200 como texto', res.ok && /^text\/(plain|markdown)/.test(tipo), `HTTP ${res.status} · ${tipo}`)
  // La propuesta sólo exige una sección: un H1 con el nombre del sitio.
  comprobar('/llms.txt empieza por un H1', /^﻿?#\s+\S/.test(texto.trimStart()))
  comprobar('/llms.txt no publica «VELIA Legal»', !/VELIA\s+Legal/i.test(texto))

  const ORIGEN = 'https://veliacorp.com'
  const aRuta = u => { const p = new URL(u).pathname.replace(/\/$/, ''); return p === '' ? '/' : p }
  const enlazadas = [...texto.matchAll(/\]\((https:\/\/veliacorp\.com[^)\s]*)\)/g)].map(m => aRuta(m[1]))
  const clase = new Map(SUPERFICIES.map(s => [s.ruta, s.clase]))
  const malas = enlazadas.filter(r => !['NUEVA', 'LEGAL_KEEP'].includes(clase.get(r)))
  comprobar('/llms.txt sólo enlaza superficies vivas y no congeladas', enlazadas.length > 0 && malas.length === 0, malas.length ? malas.join(' · ') : `${enlazadas.length} enlaces`)

  const sitemap = await (await fetch(`${BASE}/sitemap.xml`, { cache: 'no-store' })).text()
  const delSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => aRuta(m[1].replace(/^https?:\/\/[^/]+/, ORIGEN)))
  const faltan = delSitemap.filter(r => !enlazadas.includes(r))
  comprobar('/llms.txt cubre todas las rutas del sitemap', delSitemap.length > 0 && faltan.length === 0, faltan.length ? `faltan: ${faltan.join(' · ')}` : `${delSitemap.length} rutas`)
}

// ── EL REGISTRO ─────────────────────────────────────────────────────────────
console.log(`\n${gris('IDENTIDAD PROYECTADA POR CADA SUPERFICIE')}`)
console.log(gris('─'.repeat(104)))
console.log(gris('RUTA'.padEnd(17) + 'CLASE'.padEnd(17) + 'HTTP'.padEnd(6) + 'ROBOTS'.padEnd(18) + 'SCHEMA'.padEnd(26) + 'TITLE'))
for (const r of registro) {
  console.log(
    r.ruta.padEnd(17) + r.clase.padEnd(17) + String(r.status).padEnd(6) +
    (r.robots === '—' ? gris('indexable') : r.robots).padEnd(18) +
    r.tipos.padEnd(26) + gris(r.title.slice(0, 40)),
  )
}
console.log(gris('─'.repeat(104)))

/* `process.exitCode` y no `process.exit()`: el bloque del llms.txt usa `fetch`,
   que deja sockets keep-alive abiertos, y cortar el proceso con ellos vivos
   hace saltar en Windows una aserción de libuv que sale con 127 — con el
   veredicto en verde ya impreso. Una guarda que aprueba y sale con error
   rompe la cadena de `npm run check` igual que una que falla. */
const fallos = resultados.filter(r => !r.ok)
console.log('')
if (fallos.length === 0) {
  console.log(verde(`✅ ${resultados.length} comprobaciones sobre ${SUPERFICIES.length} superficies, todas en verde.`))
  process.exitCode = 0
} else {
  console.log(rojo(`❌ ${fallos.length} de ${resultados.length} comprobaciones han fallado:`))
  for (const f of fallos) console.log(rojo(`   · ${f.titulo}${f.detalle ? ` (${f.detalle})` : ''}`))
  console.log('')
  process.exitCode = 1
}
