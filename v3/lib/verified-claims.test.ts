import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CLAIMS, claim, claimsByStatus } from './verified-claims.ts'

/**
 * EL GATE DE PRODUCT TRUTH.
 *
 * POR QUÉ EXISTE ESTE FICHERO. El registro llevaba desde el 29-jul con una regla
 * escrita en su cabecera —«solo se renderiza lo que está en `verified`»— y sin
 * una sola prueba que la demostrara. Resultó ser falsa en producción: `claim()`
 * se quedó sin ningún consumidor al reescribir la Home, y **cinco** claims
 * `pending` estaban publicados mientras los cuatro `verified` no se pintaban en
 * ninguna parte. Justo al revés de lo que decía el comentario.
 *
 * Una regla sin prueba es una intención. Esto la convierte en una condición.
 *
 * ── LO QUE ESTO NO DEMUESTRA ────────────────────────────────────────────────
 * Que el gate devuelve `null` no significa que nadie escriba el texto a mano y
 * lo publique igual — que es exactamente como se coló. Eso lo mide
 * `npm run check:claims` sobre el HTML servido. Las dos capas hacen falta:
 * ésta prueba la FUNCIÓN, aquélla prueba el RESULTADO.
 */

test('un claim verified devuelve su texto — el gate deja pasar', () => {
  const verificados = claimsByStatus('verified')
  assert.ok(verificados.length > 0, 'sin un solo claim verified esta prueba no demuestra nada')
  for (const c of verificados) {
    const salida = claim(c.key as keyof typeof CLAIMS)
    assert.equal(salida, c.text, `«${c.key}» está verified y el gate no devuelve su texto`)
    assert.ok(salida && salida.length > 0)
  }
})

test('un claim pending devuelve null — el gate lo corta', () => {
  const pendientes = claimsByStatus('pending')
  assert.ok(pendientes.length > 0, 'sin un solo claim pending esta prueba no demuestra nada')
  for (const c of pendientes) {
    assert.equal(claim(c.key as keyof typeof CLAIMS), null, `«${c.key}» está pending y el gate lo deja pasar`)
  }
})

test('un claim disabled devuelve null — se retiró por algo', () => {
  for (const c of claimsByStatus('disabled')) {
    assert.equal(claim(c.key as keyof typeof CLAIMS), null)
  }
})

test('todo claim no verificado devuelve null, sea cual sea su estado', () => {
  /* La forma que aguanta el paso del tiempo: si mañana aparece un estado nuevo
     —`needs_review`, `expired`— nace CERRADO, no abierto. El gate pregunta por
     `verified`, no por la lista de los que hay que bloquear. */
  for (const [key, c] of Object.entries(CLAIMS)) {
    if (c.status === 'verified') continue
    assert.equal(claim(key as keyof typeof CLAIMS), null, `«${key}» (${c.status}) debería estar cortado`)
  }
})

test('un claim verified tiene fuente, fecha y dueño: si no, no está verificado', () => {
  /* Verificado quiere decir que alguien miró una prueba y firmó. Un claim en
     `verified` con `verifiedAt: null` sería la palabra sin el acto. */
  for (const c of claimsByStatus('verified')) {
    assert.ok(c.source && c.source.length > 20, `«${c.key}» está verified sin fuente`)
    assert.ok(c.verifiedAt, `«${c.key}» está verified sin fecha de comprobación`)
    assert.match(c.verifiedAt!, /^\d{4}-\d{2}-\d{2}$/, `«${c.key}» tiene una fecha con formato raro`)
    assert.ok(c.owner && c.owner.length > 1, `«${c.key}» está verified sin dueño`)
  }
})

test('un claim pending dice QUÉ FALTA, no solo que falta', () => {
  for (const c of claimsByStatus('pending')) {
    assert.match(
      c.source,
      /FALTA/,
      `«${c.key}» está pending sin decir qué prueba le falta: así nadie sabe cómo cerrarlo`,
    )
    assert.equal(c.verifiedAt, null, `«${c.key}» está pending y tiene fecha de verificación`)
  }
})

test('usedIn dice la verdad: cada ruta declarada tiene su atadura en el código', () => {
  /* Esto es lo que convierte a `usedIn` en un dato y no en un comentario. Se lee
     el código de cada página y se comprueba que exista `claim: '<clave>'`. Si el
     campo apunta a una página que ya no lo ata, manda a revisar al sitio
     equivocado — y un campo que dice dónde mirar y señala mal es peor que no
     tenerlo. */
  for (const [key, c] of Object.entries(CLAIMS)) {
    for (const ruta of c.usedIn) {
      assert.match(ruta, /^\/[a-z0-9-/]*$/, `«${key}» declara una ruta con forma rara: ${ruta}`)
      const fichero = join(process.cwd(), 'app', ruta.replace(/^\//, ''), 'page.tsx')
      assert.ok(existsSync(fichero), `«${key}» declara ${ruta} y no existe ${ruta}/page.tsx`)
      const codigo = readFileSync(fichero, 'utf8')
      assert.match(
        codigo,
        // `String.raw`: dentro de un template literal normal, `\s` se convierte
        // en `s` y la expresión buscaría `claim:s*'…'`, que no casa con nada. El
        // test pasaba a rojo por su propia escritura, no por el código medido.
        new RegExp(String.raw`claim:\s*'` + key + `'`),
        `«${key}» declara que está atado en ${ruta}, y ahí no hay ninguna atadura`,
      )
    }
  }
})

test('toda atadura del código está declarada en usedIn — y al revés', () => {
  /* El otro sentido, que es el que se olvida. Una página puede atar un claim y
     no aparecer en `usedIn`: entonces el día que ese claim se verifique cambia
     una página que nadie esperaba. Los dos relojes tienen que marcar lo mismo. */
  const paginas = ['/seguridad', '/legal', '/', '/contacto', '/sobre-velia', '/novedades', '/precios', '/demo', '/fundadores']
  for (const ruta of paginas) {
    const fichero = join(process.cwd(), 'app', ruta.replace(/^\//, ''), 'page.tsx')
    if (!existsSync(fichero)) continue
    const codigo = readFileSync(fichero, 'utf8')
    for (const m of codigo.matchAll(/claim:\s*'([a-zA-Z]+)'/g)) {
      const key = m[1] as keyof typeof CLAIMS
      assert.ok(CLAIMS[key], `${ruta} ata un claim «${key}» que no existe en el registro`)
      assert.ok(
        CLAIMS[key].usedIn.includes(ruta),
        `${ruta} ata «${key}» y el registro no lo declara en su usedIn`,
      )
    }
  }
})
