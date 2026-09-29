/**
 * EL AGREGADO — corre TODAS las guardas y dice la verdad sobre cada una.
 *
 * ── QUÉ ESTABA MAL (29-sep-2026) ──────────────────────────────────────────
 * `npm run check` era una cadena de nueve `&&`:
 *
 *   test:claims && test:rutas && check:analytics && check:opacidades && …
 *
 * `check:analytics` es la TERCERA y lleva meses en rojo por una dependencia
 * que no vive en este repositorio. Con `&&`, un fallo corta la cadena: las
 * SEIS guardas siguientes —claims publicados, correo, y las tres de
 * navegador— **no se ejecutaban nunca**. Medido.
 *
 * Eso no es un agregado con un fallo: es un agregado que miente en las dos
 * direcciones. Quien lo corría veía un rojo y creía que las demás se habían
 * ejecutado; y el día que analytics se arregle, seis guardas que llevan meses
 * sin correr se estrenarían todas a la vez en el peor momento posible.
 *
 * ── LAS CUATRO REGLAS DE ESTE FICHERO ─────────────────────────────────────
 * 1. Se ejecutan TODAS. Ningún fallo impide correr las siguientes.
 * 2. Un fallo con causa FUERA de este repositorio se declara como tal, y para
 *    eso hace falta que la guarda lo diga con su código de salida: aquí no se
 *    parsea prosa. Hoy sólo `check:analytics` lo hace (salida 2).
 * 3. Una dependencia declarada **NO es un aprobado**. El agregado sale con un
 *    código propio (2), nunca con 0.
 * 4. Lo que no se pudo ejecutar se dice. `NO EJECUTADA` no es `VERDE` y
 *    tampoco es `ROJO`: es que no hay medida.
 *
 * ── Y LA QUINTA, QUE ES DE PROCEDENCIA ────────────────────────────────────
 * Cinco guardas miden el HTML SERVIDO. Medir el servidor equivocado ya pasó
 * en esta sesión: `TaskStop` mató el envoltorio de `next start` y dejó vivo el
 * `node` hijo, así que el puerto siguió ocupado por un build ANTERIOR y las
 * comprobaciones se ejecutaron contra él sin que nada fallara. Por eso aquí:
 *
 *   · si el puerto ya está ocupado, se PARA. No se reutiliza lo que haya:
 *     no se puede demostrar de quién es ese servidor.
 *   · si el código fuente es más nuevo que `.next`, se PARA. Servir un build
 *     viejo es medir el objeto equivocado con todo en verde.
 *   · al terminar se mata el ÁRBOL de procesos y se comprueba que el puerto
 *     ha quedado libre. Si no, se dice y se sale con error.
 *
 * ── MUTACIONES ────────────────────────────────────────────────────────────
 * Se toma `git status --porcelain` antes y después de cada guarda. Lo que
 * cambie se atribuye a la guarda que lo cambió, en vez de aparecer al final
 * como un árbol sucio de origen desconocido.
 *
 * Uso:  npm run check          (arranca y para su propio servidor)
 *       npm run check -- 3150  (otro puerto)
 */
import { spawnSync, spawn, execFileSync } from 'node:child_process'
import { createServer } from 'node:net'
import { statSync, readdirSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const PUERTO = Number(process.argv[2]) || 3150
const BASE = `http://localhost:${PUERTO}`
const WIN = process.platform === 'win32'
const NEXT_BIN = 'node_modules/next/dist/bin/next'

/** Los comandos reales, leídos de `package.json`: la lista de guardas de abajo
 *  nombra scripts, y quien sabe qué ejecuta cada uno es el propio manifiesto. */
const COMANDOS = JSON.parse(readFileSync('package.json', 'utf8')).scripts

const c = {
  verde: s => `\x1b[32m${s}\x1b[0m`,
  rojo: s => `\x1b[31m${s}\x1b[0m`,
  ambar: s => `\x1b[33m${s}\x1b[0m`,
  gris: s => `\x1b[90m${s}\x1b[0m`,
}

/**
 * El inventario. `servidor` dice si necesita el HTML servido; `dependencia`
 * declara —con su código de salida exacto— un fallo cuya causa está fuera de
 * este repositorio.
 *
 * ⚠️ Declarar una dependencia aquí NO la convierte en verde: la separa de un
 * fallo propio para que se pueda accionar, y nada más.
 */
const GUARDAS = [
  { id: 'test:claims', servidor: false },
  { id: 'test:rutas', servidor: false },
  { id: 'check:opacidades', servidor: false },
  {
    id: 'check:analytics',
    servidor: false,
    dependencia: {
      salida: 2,
      repo: 'velia-portal',
      que: 'el catálogo de eventos vive en app/api/public/web-analytics/route.ts del portal;'
        + ' los nombres que faltan existen en otra rama suya, no en la que hay en disco',
      cierra: 'mergear la rama de analytics del portal, o poner el portal en ella y volver a medir',
    },
  },
  { id: 'check:claims', servidor: true },
  { id: 'check:email', servidor: true },
  { id: 'qa:home', servidor: true },
  { id: 'qa:paginas', servidor: true },
  { id: 'qa:identidad', servidor: true },
]

// ── utilidades ─────────────────────────────────────────────────────────────

const puertoLibre = () =>
  new Promise(res => {
    const s = createServer()
    s.once('error', () => res(false))
    s.once('listening', () => s.close(() => res(true)))
    s.listen(PUERTO, '127.0.0.1')
  })

const esperar = ms => new Promise(r => setTimeout(r, ms))

async function responde() {
  try {
    const ctl = AbortSignal.timeout(3000)
    const r = await fetch(BASE, { signal: ctl })
    return r.ok
  } catch { return false }
}

const estadoGit = () => {
  try {
    return execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' })
      .split('\n').filter(Boolean).sort().join('\n')
  } catch { return '' }
}

/** El fichero fuente más reciente. Si es posterior al build, `.next` es viejo. */
function fuenteMasReciente() {
  let max = 0
  const mirar = dir => {
    if (!existsSync(dir)) return
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue
      const p = join(dir, e.name)
      if (e.isDirectory()) mirar(p)
      else max = Math.max(max, statSync(p).mtimeMs)
    }
  }
  for (const d of ['app', 'components', 'lib']) mirar(d)
  for (const f of ['package.json', 'next.config.mjs', 'next.config.js', 'tailwind.config.ts', 'tailwind.config.js']) {
    if (existsSync(f)) max = Math.max(max, statSync(f).mtimeMs)
  }
  return max
}

/** Mata el ÁRBOL, no sólo al padre. Es la deuda que dejó `TaskStop`. */
function matarArbol(pid) {
  if (!pid) return
  try {
    if (WIN) spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' })
    else process.kill(-pid, 'SIGKILL')
  } catch { /* ya estaba muerto */ }
}

// ── 1 · procedencia: ¿podemos medir algo que signifique lo que decimos? ────

console.log(c.gris(`\nAgregado de guardas · puerto ${PUERTO} · ${new Date().toISOString()}`))

const necesitaServidor = GUARDAS.some(g => g.servidor)
let servidor = null
let servidorOk = false
let motivoSinServidor = null

if (necesitaServidor) {
  if (!(await puertoLibre())) {
    console.error(c.rojo(`\n✖ El puerto ${PUERTO} ya está ocupado.`))
    console.error('  No se reutiliza: no se puede demostrar qué build sirve ese proceso, y')
    console.error('  medir contra un servidor ajeno da verdes que no significan nada.')
    console.error(WIN
      ? `  Quién lo tiene:  Get-NetTCPConnection -LocalPort ${PUERTO} -State Listen`
      : `  Quién lo tiene:  lsof -i :${PUERTO}`)
    process.exit(1)
  }

  if (!existsSync('.next/BUILD_ID')) {
    console.error(c.rojo('\n✖ No hay build. Corre `npm run build` antes.'))
    process.exit(1)
  }
  const build = statSync('.next/BUILD_ID').mtimeMs
  const fuente = fuenteMasReciente()
  if (fuente > build) {
    console.error(c.rojo('\n✖ El código es MÁS NUEVO que el build.'))
    console.error(`  build:  ${new Date(build).toISOString()}`)
    console.error(`  fuente: ${new Date(fuente).toISOString()}`)
    console.error('  Servir `.next` ahora mediría una versión que ya no existe. Recompila.')
    process.exit(1)
  }

  console.log(c.gris(`  build de ${new Date(build).toISOString()} · levantando servidor…`))
  /* El binario de Next con ESTE node, no `npx`. Dos motivos, y el segundo es
     el que importa: `npx.cmd` necesita `shell: true` en Windows —que además
     avisa por DEP0190— y sobre todo mete un PROCESO ENVOLTORIO en medio, así
     que el pid que recibimos no es el del servidor. Matar ese pid deja vivo al
     hijo: exactamente el huérfano que ocupó el 3150 en esta sesión. Invocando
     el bin directamente, el pid que guardamos ES el servidor. */
  servidor = spawn(process.execPath, [NEXT_BIN, 'start', '-p', String(PUERTO)], {
    stdio: 'ignore',
    detached: !WIN, // POSIX: grupo propio, para poder matar el árbol con -pid
  })
  for (let i = 0; i < 60 && !servidorOk; i++) {
    await esperar(1000)
    servidorOk = await responde()
  }
  if (!servidorOk) {
    motivoSinServidor = `el servidor no respondió en ${BASE} tras 60 s`
    console.error(c.rojo(`\n✖ ${motivoSinServidor}`))
    matarArbol(servidor.pid)
  } else {
    console.log(c.gris(`  servidor listo · pid ${servidor.pid}`))
  }
}

// ── 2 · ejecutar TODAS ─────────────────────────────────────────────────────

const resultados = []
let antes = estadoGit()

for (const g of GUARDAS) {
  if (g.servidor && !servidorOk) {
    resultados.push({ ...g, estado: 'NO EJECUTADA', detalle: motivoSinServidor ?? 'sin servidor' })
    continue
  }
  /* Se ejecuta el comando de la guarda con ESTE node, sin pasar por `npm run`.
     Evita el envoltorio de npm, el `shell: true` que Windows exige para un
     `.cmd` —y su aviso DEP0190— y deja el código de salida de la guarda tal
     cual, sin que npm lo reescriba. Las nueve son `node …`; si alguna dejara
     de serlo, se para en vez de adivinar. */
  const cmd = COMANDOS[g.id]
  if (!cmd || !cmd.startsWith('node ')) {
    resultados.push({ ...g, estado: 'NO EJECUTADA', detalle: `el script «${g.id}» no es un comando de node: ${cmd ?? 'no existe'}` })
    continue
  }
  const r = spawnSync(process.execPath, cmd.split(' ').slice(1), {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  })
  const codigo = r.status ?? 1
  const salida = `${r.stdout ?? ''}${r.stderr ?? ''}`

  const despues = estadoGit()
  const mutacion = despues !== antes
    ? despues.split('\n').filter(l => !antes.includes(l)).join(' · ')
    : null
  antes = despues

  let estado
  if (codigo === 0) estado = 'VERDE'
  else if (g.dependencia && codigo === g.dependencia.salida) estado = 'DEPENDENCIA'
  else estado = 'ROJO'

  resultados.push({ ...g, estado, codigo, salida, mutacion })
  const pinta = { VERDE: c.verde, ROJO: c.rojo, DEPENDENCIA: c.ambar }[estado]
  console.log(`  ${pinta(estado.padEnd(12))} ${g.id}${mutacion ? c.ambar('  · MUTÓ el árbol') : ''}`)
}

// ── 3 · parar el servidor y DEMOSTRAR que el puerto queda libre ────────────

if (servidor) {
  matarArbol(servidor.pid)
  let libre = false
  for (let i = 0; i < 10 && !libre; i++) { await esperar(500); libre = await puertoLibre() }
  if (!libre) {
    console.error(c.rojo(`\n✖ El puerto ${PUERTO} SIGUE ocupado tras parar el servidor.`))
    console.error('  Queda un proceso huérfano: la próxima medición mediría su build, no el tuyo.')
    resultados.push({ id: 'puerto liberado', estado: 'ROJO', codigo: 1, salida: '' })
  } else {
    console.log(c.gris(`  servidor parado · puerto ${PUERTO} libre`))
  }
}

// ── 4 · el veredicto ───────────────────────────────────────────────────────

const de = e => resultados.filter(r => r.estado === e)
const rojos = de('ROJO'), deps = de('DEPENDENCIA'), noEjec = de('NO EJECUTADA'), verdes = de('VERDE')

console.log(`\n${'═'.repeat(78)}`)
for (const r of resultados) {
  const pinta = { VERDE: c.verde, ROJO: c.rojo, DEPENDENCIA: c.ambar, 'NO EJECUTADA': c.gris }[r.estado]
  console.log(`  ${pinta(r.estado.padEnd(13))} ${r.id.padEnd(20)} ${r.codigo !== undefined ? c.gris(`salida ${r.codigo}`) : ''}`)
}
console.log('═'.repeat(78))

for (const r of [...rojos, ...noEjec]) {
  if (!r.salida) continue
  console.log(c.rojo(`\n───── ${r.id} ─────`))
  console.log(r.salida.trimEnd())
}

for (const r of deps) {
  console.log(c.ambar(`\n───── ${r.id} · DEPENDENCIA DECLARADA ─────`))
  console.log(`  fuera de este repositorio: ${r.dependencia.repo}`)
  console.log(`  ${r.dependencia.que}`)
  console.log(c.gris(`  cierra el gate: ${r.dependencia.cierra}`))
  console.log(c.gris('  ⚠️ esto NO es un aprobado — el agregado no sale con 0 mientras siga así'))
}

const mutaron = resultados.filter(r => r.mutacion)
if (mutaron.length) {
  console.log(c.ambar('\n⚠ Guardas que modificaron el árbol de trabajo:'))
  for (const r of mutaron) console.log(c.ambar(`   · ${r.id} → ${r.mutacion}`))
  console.log(c.gris('   Clasifícalo antes de commitear: puede ser salida reproducible o un cambio accidental.'))
} else {
  console.log(c.gris('\n  Ninguna guarda modificó el árbol de trabajo.'))
}

console.log('')
if (rojos.length || noEjec.length) {
  console.log(c.rojo(`❌ ${rojos.length} en rojo · ${noEjec.length} sin ejecutar · ${deps.length} por dependencia · ${verdes.length} en verde`))
  process.exit(1)
}
if (deps.length) {
  console.log(c.ambar(`⚠️  ${verdes.length} en verde, y ${deps.length} bloqueada(s) por una dependencia declarada FUERA de este repositorio.`))
  console.log(c.ambar('   NO es verde. Salida 2.'))
  process.exit(2)
}
console.log(c.verde(`✅ ${verdes.length} guardas, todas en verde.`))
process.exit(0)
