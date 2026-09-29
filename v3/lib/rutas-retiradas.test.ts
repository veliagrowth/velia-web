import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { enlacePublicable, RUTAS_RETIRADAS } from './rutas-retiradas.ts'

/**
 * La criba de enlaces del feed, probada en los DOS sentidos.
 *
 * Existe porque el 18-sep se midió que el feed de producción trae una entrada
 * —«El Programa Fundadores sigue abierto»— cuyo `link` apunta a
 * `https://veliacorp.com/precios`. La política del rework dice que las rutas de
 * la etapa SaaS siguen vivas y dejan de anunciarse; se había aplicado a la
 * Home, a la navegación y al sitemap —donde los enlaces se escriben a mano— y
 * el feed se la saltaba entera porque los suyos vienen de fuera.
 *
 * 🧭 Un test que sólo comprobara «el enlace a /precios no se pinta» pasaría
 * también con una función que no publicara NINGÚN enlace jamás. Por eso la
 * mitad positiva no es decorativa: es la que impide que la criba se convierta
 * en un tapón, y es la que de verdad distingue las dos implementaciones.
 *
 * `splitUpdates` y `fetchUpdates` no se prueban aquí: viven en `updates.ts`,
 * que importa `@/lib/constants`, y `node --test` no conoce los `paths` de
 * tsconfig. `splitUpdates` además no se ha tocado en esta etapa.
 */

test('un enlace a una ruta congelada NO se publica, absoluto o relativo', () => {
  for (const ruta of RUTAS_RETIRADAS) {
    assert.equal(enlacePublicable(`https://veliacorp.com${ruta}`), false, `absoluto ${ruta}`)
    assert.equal(enlacePublicable(`https://www.veliacorp.com${ruta}`), false, `www ${ruta}`)
    assert.equal(enlacePublicable(ruta), false, `relativo ${ruta}`)
  }
})

test('una subruta de una ruta congelada tampoco se publica', () => {
  assert.equal(enlacePublicable('https://veliacorp.com/precios/anual'), false)
  assert.equal(enlacePublicable('/demo/bufete'), false)
})

test('el caso exacto medido en el feed de produccion', () => {
  // El `link` literal de la entrada «El Programa Fundadores sigue abierto».
  assert.equal(enlacePublicable('https://veliacorp.com/precios'), false)
})

test('LA MITAD QUE IMPIDE QUE ESTO SEA UN TAPON: los enlaces normales SI salen', () => {
  assert.equal(enlacePublicable('https://veliacorp.com/contacto'), true)
  assert.equal(enlacePublicable('https://veliacorp.com/sobre-velia'), true)
  assert.equal(enlacePublicable('/novedades'), true)
  // Un dominio ajeno no es asunto de esta criba.
  assert.equal(enlacePublicable('https://consuljuridico.com'), true)
  assert.equal(enlacePublicable('https://www.boe.es/algo'), true)
})

test('una ruta que solo EMPIEZA como una congelada si se publica', () => {
  // `/legales` no es `/legal`. Un `startsWith` a secas se la habria comido.
  assert.equal(enlacePublicable('/legales'), true)
  assert.equal(enlacePublicable('/demostraciones'), true)
  assert.equal(enlacePublicable('/preciosos'), true)
})

test('sin enlace, o con uno que no se deja analizar, no se pinta nada', () => {
  assert.equal(enlacePublicable(null), false)
  assert.equal(enlacePublicable(undefined), false)
  assert.equal(enlacePublicable(''), false)
  assert.equal(enlacePublicable('http://'), false)
})

test('la lista de rutas congeladas es la MISMA que vigilan las guardas', () => {
  /* Dos listas de lo mismo en dos ficheros divergen — pasó este mismo mes con
     el catalogo de eventos de analitica. Se compara contra el fuente en vez de
     confiar en que quien toque una se acuerde de la otra.

     🧭 Y no es teórico: este test falló el 18-sep en cuanto la lista se movió
     de `scripts/qa-home.mjs` al módulo compartido. Detectó su propio cambio de
     terreno, que es justo para lo que está. Si vuelve a mudarse, se actualiza
     ESTA ruta — no se relaja la comparación. */
  const modulo = readFileSync(new URL('../scripts/lib/auditoria-pagina.mjs', import.meta.url), 'utf8')
  const linea = modulo.match(/export const LEGACY = \[([^\]]+)\]/)
  assert.ok(linea, 'no encuentro la lista LEGACY en scripts/lib/auditoria-pagina.mjs')
  const enLaGuarda = [...linea[1].matchAll(/'([^']+)'/g)].map(m => m[1]).sort()
  assert.deepEqual(enLaGuarda, [...RUTAS_RETIRADAS].sort())
})
