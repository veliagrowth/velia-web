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
 *
 * ── PROCEDENCIA (17-sep-2026) ───────────────────────────────────────────────
 * «El fichero del portal en disco» no es un objeto fijo: es lo que tenga la
 * rama en la que esté ese repositorio, y esa rama no forma parte de este
 * cambio. Medido hoy, el mismo catálogo daba tres respuestas distintas según
 * dónde estuviera el portal — `feat/web-rework-2026-analytics` acepta los 42
 * nombres y no falta ninguno; `main` y `feat/hub-nueva-web` aceptan 35 y
 * tiran los 7 del rework.
 *
 * Un rojo que no distingue «el catálogo diverge» de «estás mirando otra rama»
 * no se puede accionar, y un verde sobre la rama equivocada engaña igual. Así
 * que la guarda dice SIEMPRE contra qué objeto está midiendo —ruta, rama y
 * commit corto— y compara además contra `main` del portal, que es la única
 * rama que se parece a lo que hay desplegado.
 *
 * El veredicto NO se relaja: sigue fallando cuando el catálogo diverge del
 * fichero en disco. Lo que se añade es de quién es la evidencia.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'

const WEB = resolve(process.cwd(), 'lib/analytics.ts')
const PORTAL = resolve(process.cwd(), '../../CRM/velia-portal/app/api/public/web-analytics/route.ts')
const RUTA_EN_EL_PORTAL = 'app/api/public/web-analytics/route.ts'

const rojo = t => `\x1b[31m${t}\x1b[0m`
const verde = t => `\x1b[32m${t}\x1b[0m`
const gris = t => `\x1b[90m${t}\x1b[0m`
const ambar = t => `\x1b[33m${t}\x1b[0m`

/** Un `git` que no revienta la guarda si no hay repositorio o no hay git. */
const git = (repo, ...args) => {
  try {
    return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

/** Extrae la lista cerrada `EVENTOS` de un contenido del endpoint. */
const listaEventos = src => {
  const ini = src.indexOf('const EVENTOS = new Set([')
  const fin = src.indexOf('])', ini)
  if (ini < 0 || fin < 0) return null
  return [...src.slice(ini, fin).matchAll(/'([a-z_0-9]+)'/g)].map(m => m[1])
}

if (!existsSync(PORTAL)) {
  console.error(rojo('✖ No encuentro el endpoint del portal en:'))
  console.error(`  ${PORTAL}`)
  console.error('  Sin él no se puede comprobar nada, así que esto NO pasa por bueno.')
  process.exit(1)
}

const declarados = [...readFileSync(WEB, 'utf8').matchAll(/^\s*\|\s*'([a-z_0-9]+)'/gm)].map(m => m[1])
const aceptados = listaEventos(readFileSync(PORTAL, 'utf8'))

if (!aceptados) {
  console.error(rojo('✖ No encuentro la lista EVENTOS en el endpoint. ¿Se ha renombrado?'))
  process.exit(1)
}

// ── De quién es la evidencia ────────────────────────────────────────────────
// Se imprime antes del veredicto, y tanto si sale verde como si sale rojo.
const repoPortal = resolve(dirname(PORTAL), '../../../..')
const rama = git(repoPortal, 'rev-parse', '--abbrev-ref', 'HEAD')
const commit = git(repoPortal, 'rev-parse', '--short', 'HEAD')
console.log(gris(`Buzón leído: ${RUTA_EN_EL_PORTAL}`))
console.log(gris(`  repositorio velia-portal · rama ${rama ?? 'DESCONOCIDA'} · commit ${commit ?? 'DESCONOCIDO'}`))
console.log(gris(`  ${aceptados.length} nombres aceptados · ${declarados.length} declarados por la web`))

const A = new Set(aceptados)
const D = new Set(declarados)
const seDescartan = declarados.filter(e => !A.has(e))
const yaNoSeEmiten = aceptados.filter(e => !D.has(e))

if (seDescartan.length === 0 && yaNoSeEmiten.length === 0) {
  console.log(verde(`✅ Catálogo de eventos sincronizado: ${declarados.length} nombres a ambos lados.`))

  /* Cuadrar con el disco no es cuadrar con lo desplegado. Si el portal está en
     una rama que no es `main`, este verde dice «coincide con lo que tú tienes
     abierto», que no es lo mismo que «el buzón que va a recibir estos eventos
     los acepta». Se avisa; no se falla: cuál es el estado desplegado no lo
     decide esta guarda, y un aviso que se convierte en error acaba silenciado. */
  if (rama && rama !== 'main') {
    const enMain = listaEventos(git(repoPortal, 'show', `main:${RUTA_EN_EL_PORTAL}`) ?? '')
    if (enMain) {
      const faltanEnMain = declarados.filter(e => !new Set(enMain).has(e))
      if (faltanEnMain.length) {
        console.log(ambar(`\n⚠ Pero el portal NO está en main, y main tiraría ${faltanEnMain.length} de estos eventos:`))
        for (const e of faltanEnMain) console.log(ambar(`    ${e}`))
        console.log(gris('  Cuadra con la rama que tienes abierta, no con lo que hay desplegado.'))
        console.log(gris('  Los dos lados del cambio se publican juntos o el embudo mide en el vacío.'))
      }
    }
  }
  process.exit(0)
}

if (seDescartan.length) {
  console.error(rojo(`\n✖ ${seDescartan.length} eventos que la web EMITE y el buzón TIRA (200 y a la basura):`))
  for (const e of seDescartan) console.error(`    ${e}`)
  console.error(`  → añádelos a EVENTOS en ${RUTA_EN_EL_PORTAL}`)

  /* ¿Divergencia de verdad, o estás mirando la rama equivocada? Es la primera
     pregunta que hay que responder, y hasta hoy había que responderla a mano.
     Se buscan otras ramas del portal donde estos mismos nombres SÍ estén: si
     aparecen, el catálogo no diverge, es que el repositorio de al lado está en
     otro sitio. El fallo se mantiene igual — sigue sin cuadrar con el disco. */
  const ramas = (git(repoPortal, 'for-each-ref', '--format=%(refname:short)', 'refs/heads') ?? '')
    .split('\n').filter(Boolean).filter(r => r !== rama)
  const cubren = ramas.filter(r => {
    const lista = listaEventos(git(repoPortal, 'show', `${r}:${RUTA_EN_EL_PORTAL}`) ?? '')
    return lista && seDescartan.every(e => lista.includes(e))
  })
  if (cubren.length) {
    console.error(ambar(`\n⚠ Estos ${seDescartan.length} nombres SÍ están en otra rama del portal:`))
    for (const r of cubren) console.error(ambar(`    ${r}`))
    console.error(gris(`  El portal en disco está en «${rama}». Puede que el catálogo no diverja`))
    console.error(gris('  y que solo estés midiendo contra el objeto equivocado. Compruébalo'))
    console.error(gris('  antes de tocar el endpoint: un evento añadido dos veces no molesta,'))
    console.error(gris('  pero el rato buscando un fallo que no existe no vuelve.'))
  }
}
if (yaNoSeEmiten.length) {
  console.error(rojo(`\n✖ ${yaNoSeEmiten.length} eventos que el buzón acepta y la web YA NO emite:`))
  for (const e of yaNoSeEmiten) console.error(`    ${e}`)
  console.error('  → bórralos del endpoint, o vuelve a emitirlos si hacen falta')
}
console.error('')
process.exit(1)
