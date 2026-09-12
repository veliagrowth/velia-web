/**
 * GUARDA — un claim `pending` no puede estar publicado.
 *
 * POR QUÉ EXISTE (12-sep-2026). `lib/verified-claims.ts` se abre diciendo:
 *
 *     «REGLA DURA: solo se renderiza lo que está en `verified`. `claim()`
 *      devuelve null para todo lo demás, así que un claim sin verificar no se
 *      cuela por descuido: desaparece de la página.»
 *
 * Eso es cierto **donde se llama a `claim()`**. Y resulta que `claim()` tiene
 * UN SOLO consumidor en toda la web (`components/SecurityArchitecture.tsx`).
 * Las páginas que publican «conforme a Verifactu» escriben el texto a mano y no
 * le preguntan nada a nadie.
 *
 * O sea: la guarda existía, era correcta, y lo que tenía que proteger no la
 * consultaba. Un detector al que nadie pregunta no es una salvaguarda activa.
 *
 * ── QUÉ MIDE, Y POR QUÉ ESA MEDICIÓN ────────────────────────────────────────
 * CLAIM: ningún término de un claim `pending` o `disabled` llega al visitante.
 * MEDICIÓN: el **texto visible del HTML servido** por un build de producción,
 *   ruta por ruta.
 * POR QUÉ: buscar en el código fuente contaría los COMENTARIOS. Hay tres
 *   ficheros que mencionan «Verifactu» y «260 %» precisamente para explicar que
 *   se retiraron; marcarlos sería acusar al que documentó la retirada. Lo único
 *   que importa es lo que sale por el cable.
 *
 * ── DEUDA DECLARADA ─────────────────────────────────────────────────────────
 * Las infracciones que ya existían quedan en `deuda-claims-publicados.json`,
 * con su motivo y su dueño. No para darlas por buenas: para que esta guarda
 * proteja contra la siguiente. Y una entrada de la deuda que ya no casa con
 * nada es una entrada MUERTA y también falla — o se arregló y hay que quitarla,
 * o la guarda dejó de mirar donde debía.
 *
 *   npm run check:claims                 (contra localhost:3150)
 *   npm run check:claims -- https://...  (contra lo que sea)
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = (process.argv[2] || 'http://localhost:3150').replace(/\/$/, '')
const RAIZ = process.cwd()

const rojo = t => `\x1b[31m${t}\x1b[0m`
const verde = t => `\x1b[32m${t}\x1b[0m`
const gris = t => `\x1b[90m${t}\x1b[0m`

/**
 * Qué buscar por cada claim. Va aquí y no se deriva del texto del claim porque
 * derivarlo automáticamente es frágil: «Infraestructura europea.» no comparte
 * ni una palabra distintiva con «datos alojados en la Unión Europea», que es
 * como acaba escrito en una página.
 *
 * El candado está abajo: si aparece un claim `pending` sin entrada aquí, la
 * guarda FALLA. Así nadie puede añadir un claim sin declarar qué vigilar.
 */
const TERMINOS = {
  verifactu: /verifactu/i,
  lecDeadlines: /\bLEC\b|Ley de Enjuiciamiento Civil/,
  euInfrastructure:
    /infraestructura europea|alojad[oa]s? en la (UE|Uni[óo]n Europea)|datos.{0,15}en la UE|servidores.{0,15}(UE|Europa)/i,
  noModelTraining: /sin entrenamiento de modelos|no se usan para entrenar|no entrenamos/i,
  pilotMetrics: /\+\s*260\s*%|12\s*h\s*\/\s*semana|12 horas a la semana/i,
}

/* Las rutas públicas que se comprueban. Las legacy entran a propósito: estar
   congeladas no las hace invisibles — siguen respondiendo 200 a quien tenga el
   enlace. */
const RUTAS = [
  '/', '/contacto', '/seguridad', '/sobre-velia', '/novedades',
  '/precios', '/demo', '/fundadores', '/legal',
  '/aviso-legal', '/privacidad', '/cookies', '/terminos', '/ia-responsable',
]

// ── Los claims que NO pueden publicarse, leídos del registro ─────────────────
const fuente = readFileSync(join(RAIZ, 'lib/verified-claims.ts'), 'utf8')
const noPublicables = []
for (const m of fuente.matchAll(/^\s{2}([a-zA-Z]+):\s*\{/gm)) {
  const clave = m[1]
  const bloque = fuente.slice(m.index, fuente.indexOf('},', m.index))
  const estado = bloque.match(/status:\s*'(\w+)'/)?.[1]
  if (estado === 'pending' || estado === 'disabled') noPublicables.push({ clave, estado })
}

if (noPublicables.length === 0) {
  console.error(rojo('✖ No he encontrado ningún claim pending/disabled en verified-claims.ts.'))
  console.error('  O el registro cambió de forma, o esta guarda dejó de saber leerlo.')
  console.error('  En cualquiera de los dos casos NO está comprobando nada.')
  process.exit(1)
}

// Candado: un claim sin término declarado no se puede vigilar.
const sinTermino = noPublicables.filter(c => !TERMINOS[c.clave])
if (sinTermino.length) {
  console.error(rojo(`✖ ${sinTermino.length} claim(s) sin término que vigilar en esta guarda:`))
  for (const c of sinTermino) console.error(`    ${c.clave} (${c.estado})`)
  console.error('\n  Añádelo a TERMINOS. Sin eso, esta guarda no lo protege y no lo dice.')
  process.exit(1)
}

// ── Deuda declarada ─────────────────────────────────────────────────────────
const deuda = JSON.parse(readFileSync(join(RAIZ, 'scripts/deuda-claims-publicados.json'), 'utf8'))
const DECLARADAS = new Set(deuda.publicados.map(d => `${d.ruta}|${d.claim}`))
const vistas = new Set()

// ── Medición ────────────────────────────────────────────────────────────────
const nuevas = []
let comprobadas = 0

for (const ruta of RUTAS) {
  let html
  try {
    const res = await fetch(BASE + ruta)
    if (!res.ok) {
      console.error(rojo(`✖ ${ruta} devolvió HTTP ${res.status}. No se ha medido nada.`))
      process.exit(1)
    }
    html = await res.text()
  } catch (e) {
    console.error(rojo(`✖ No se puede alcanzar ${BASE}${ruta}: ${e.message}`))
    console.error('  Levanta un build de producción: npm run build && npm run start -- -p 3150')
    process.exit(1)
  }
  comprobadas++

  // Solo el texto VISIBLE: fuera scripts (el JSON-LD y el payload de Next van
  // ahí dentro y no los lee una persona) y fuera las etiquetas.
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')

  for (const { clave } of noPublicables) {
    if (!TERMINOS[clave].test(visible)) continue
    const id = `${ruta}|${clave}`
    if (DECLARADAS.has(id)) vistas.add(id)
    else nuevas.push({ ruta, clave })
  }
}

// ── Veredicto ───────────────────────────────────────────────────────────────
const muertas = [...DECLARADAS].filter(d => !vistas.has(d))
const fallos = []

for (const n of nuevas) {
  fallos.push(`${n.ruta} publica el claim «${n.clave}», que NO está verificado y no está declarado`)
}
for (const m of muertas) {
  const [ruta, clave] = m.split('|')
  fallos.push(`la deuda declara «${clave}» en ${ruta} y ya no aparece: quítalo de la lista`)
}

console.log(gris(`${comprobadas} rutas · ${noPublicables.length} claims no publicables · ${DECLARADAS.size} infracciones declaradas`))

if (fallos.length === 0) {
  console.log(verde(`✅ Ningún claim sin verificar se publica fuera de la deuda declarada.`))
  if (DECLARADAS.size > 0) {
    console.log(gris(`   ⚠️ Siguen vivas ${DECLARADAS.size} infracciones declaradas. Eso NO es verde:`))
    for (const d of DECLARADAS) console.log(gris(`      ${d.replace('|', ' → ')}`))
  }
  process.exit(0)
}

console.error(rojo(`\n✖ ${fallos.length} problema(s):`))
for (const f of fallos) console.error(`    ${f}`)
console.error('')
process.exit(1)
