/**
 * GUARDA — el catálogo de eventos no puede divergir entre la web y el buzón.
 *
 * POR QUÉ EXISTE (10-ago-2026). La web declara sus eventos en `lib/analytics.ts`
 * y el endpoint del portal los valida contra una lista CERRADA. El 1-ago la web
 * renombró los suyos y nadie tocó el endpoint: de 34 nombres, **solo 10 estaban
 * en la lista**. Los otros 24 se descartaban con un 200 — entre ellos todos los
 * de conversión y el envío del formulario de contacto. Nueve días midiendo un
 * embudo que era mentira, sin un solo error en ninguna parte.
 *
 * La lista cerrada es la defensa correcta para un endpoint público: sin ella,
 * cualquiera llena la tabla. Lo que faltaba no era la lista, era que alguien la
 * mirase. Esto es ese alguien.
 *
 * Se ejecuta contra el fichero del portal en disco. Si el portal no está al
 * lado, la guarda lo DICE y falla — no pasa de largo: una guarda que se salta
 * a sí misma cuando no encuentra lo que vigila es peor que no tenerla, porque
 * da vía libre creyendo que ha comprobado algo.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const WEB = resolve(process.cwd(), 'lib/analytics.ts')
const PORTAL = resolve(process.cwd(), '../../CRM/velia-portal/app/api/public/web-analytics/route.ts')

const rojo = t => `\x1b[31m${t}\x1b[0m`
const verde = t => `\x1b[32m${t}\x1b[0m`

if (!existsSync(PORTAL)) {
  console.error(rojo('✖ No encuentro el endpoint del portal en:'))
  console.error(`  ${PORTAL}`)
  console.error('  Sin él no se puede comprobar nada, así que esto NO pasa por bueno.')
  process.exit(1)
}

const declarados = [...readFileSync(WEB, 'utf8').matchAll(/^\s*\|\s*'([a-z_0-9]+)'/gm)].map(m => m[1])
const aceptados = (() => {
  const src = readFileSync(PORTAL, 'utf8')
  const ini = src.indexOf('const EVENTOS = new Set([')
  const fin = src.indexOf('])', ini)
  if (ini < 0 || fin < 0) return null
  return [...src.slice(ini, fin).matchAll(/'([a-z_0-9]+)'/g)].map(m => m[1])
})()

if (!aceptados) {
  console.error(rojo('✖ No encuentro la lista EVENTOS en el endpoint. ¿Se ha renombrado?'))
  process.exit(1)
}

const A = new Set(aceptados)
const D = new Set(declarados)
const seDescartan = declarados.filter(e => !A.has(e))
const yaNoSeEmiten = aceptados.filter(e => !D.has(e))

if (seDescartan.length === 0 && yaNoSeEmiten.length === 0) {
  console.log(verde(`✅ Catálogo de eventos sincronizado: ${declarados.length} nombres a ambos lados.`))
  process.exit(0)
}

if (seDescartan.length) {
  console.error(rojo(`\n✖ ${seDescartan.length} eventos que la web EMITE y el buzón TIRA (200 y a la basura):`))
  for (const e of seDescartan) console.error(`    ${e}`)
  console.error('  → añádelos a EVENTOS en app/api/public/web-analytics/route.ts')
}
if (yaNoSeEmiten.length) {
  console.error(rojo(`\n✖ ${yaNoSeEmiten.length} eventos que el buzón acepta y la web YA NO emite:`))
  for (const e of yaNoSeEmiten) console.error(`    ${e}`)
  console.error('  → bórralos del endpoint, o vuelve a emitirlos si hacen falta')
}
console.error('')
process.exit(1)
