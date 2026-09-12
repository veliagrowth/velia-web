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
 * MEDICIÓN: el HTML servido por un build de producción, ruta por ruta, en TRES
 *   zonas — el `<title>`, los `<meta>` de descripción y el texto visible.
 * POR QUÉ EL FUENTE NO: buscar en el código contaría los COMENTARIOS. Hay tres
 *   ficheros que mencionan «Verifactu» y «260 %» precisamente para explicar que
 *   se retiraron; marcarlos sería acusar al que documentó la retirada.
 * POR QUÉ TRES ZONAS: la primera versión miraba sólo el texto visible, y el
 *   `<meta name="description">` de /seguridad publicaba DOS claims `pending` que
 *   no vio nadie. Un metadato es tan público como un titular — sale en el
 *   resultado de búsqueda — y encima el gate de React no llega hasta ahí, porque
 *   la metadata es un objeto estático.
 *
 * ── DEUDA DECLARADA ─────────────────────────────────────────────────────────
 * `deuda-claims-publicados.json` está HOY VACÍO: los cinco claims que había
 * dejaron de publicarse al hacer pasar /seguridad y /legal por el gate. El
 * fichero se queda porque el día que alguien tenga que declarar una excepción
 * debe encontrar aquí el formato y el precedente — y porque una entrada de la
 * deuda que ya no casa con nada es una entrada MUERTA y también falla: o se
 * arregló y hay que quitarla, o la guarda dejó de mirar donde debía.
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
  lecDeadlines: /\bLEC\b|Ley de Enjuiciamiento Civil|133\.4/i,
  euInfrastructure:
    /infraestructura europea|alojad[oa]s? en la (UE|Uni[óo]n Europea)|datos.{0,20}en la UE|servidores.{0,20}(UE|Europa)|regi[óo]n europea/i,
  /* ⚠️ Esta expresión decía sólo «no se USAN para entrenar», y la página escribía
     «no se UTILIZAN para entrenar». Una palabra, y el claim pasó por delante de
     la guarda sin que sonara nada. Una guarda sólo mira donde la apuntas: si el
     término se escribe de otra manera no lo ve, y devuelve verde. */
  noModelTraining:
    /sin entrenamiento|no se (usan|utilizan|emplean) para entrenar|no entrena(n|mos)?\s+(ninguna|modelos)|no entrenamiento/i,
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
const sinTipo = deuda.publicados.filter(d => d.tipo !== 'CLAIM_PUBLICADO' && d.tipo !== 'DIVULGACION_LEGAL')
if (sinTipo.length) {
  console.error(rojo(`✖ ${sinTipo.length} entrada(s) de la deuda sin clasificar.`))
  for (const d of sinTipo) console.error(`    ${d.ruta} → ${d.claim} (tipo: ${d.tipo ?? 'ninguno'})`)
  console.error('')
  console.error('  Toda entrada declara si es CLAIM_PUBLICADO o DIVULGACION_LEGAL. Sin eso,')
  console.error('  la lista mezcla «hay que quitarlo» con «tiene que estar», y deja de decir nada.')
  process.exit(1)
}

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

  /* TRES ZONAS, no una.
     La primera versión de esta guarda sólo miraba el texto visible, y el
     `<meta name="description">` de /seguridad publicaba DOS claims `pending`
     que no vio nadie. Un metadato es tan público como un titular: es lo que
     sale en el resultado de búsqueda y lo que se lee al compartir el enlace.
     Quitar las etiquetas con una expresión regular borra justamente el sitio
     donde vive el texto de un meta — el atributo se va con la etiqueta. */
  const sinScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')

  const zonas = {
    'el <title>': (sinScripts.match(/<title[^>]*>([^<]*)</i) || [])[1] || '',
    'un <meta> de descripción': [
      ...sinScripts.matchAll(
        /<meta[^>]+(?:name|property)="(?:description|og:description|twitter:description)"[^>]+content="([^"]*)"/gi,
      ),
    ]
      .map(m => m[1])
      .join(' '),
    'el texto visible': sinScripts
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ')
      .replace(/\s+/g, ' '),
  }

  for (const { clave } of noPublicables) {
    const donde = Object.entries(zonas)
      .filter(([, texto]) => TERMINOS[clave].test(texto))
      .map(([zona]) => zona)
    if (donde.length === 0) continue
    const id = `${ruta}|${clave}`
    if (DECLARADAS.has(id)) vistas.add(id)
    else nuevas.push({ ruta, clave, donde })
  }
}

// ── Veredicto ───────────────────────────────────────────────────────────────
const muertas = [...DECLARADAS].filter(d => !vistas.has(d))
const fallos = []

for (const n of nuevas) {
  fallos.push(
    `${n.ruta} publica el claim «${n.clave}» en ${n.donde.join(' y ')} — no está verificado y no está declarado`,
  )
}
for (const m of muertas) {
  const [ruta, clave] = m.split('|')
  fallos.push(`la deuda declara «${clave}» en ${ruta} y ya no aparece: quítalo de la lista`)
}

const porTipo = t => deuda.publicados.filter(d => d.tipo === t)
const publicados = porTipo('CLAIM_PUBLICADO')
const divulgacion = porTipo('DIVULGACION_LEGAL')

console.log(gris(`${comprobadas} rutas · ${noPublicables.length} claims no publicables · ${DECLARADAS.size} apariciones clasificadas`))

if (fallos.length === 0) {
  console.log(verde(`✅ Ningún claim sin verificar se publica como afirmación de VELIA.`))

  /* La distinción que hace honesta a esta guarda. Una página legal que dice «por
     política contractual del proveedor, los datos no se utilizan para entrenar»
     NO está afirmando una capacidad de VELIA: está informando del tratamiento,
     que es lo que el RGPD obliga. Borrarlo para poner esto en verde dejaría al
     interesado sin saber qué pasa con sus datos — cambiar el contrato para que
     el resultado pase es exactamente lo que no se hace. */
  if (divulgacion.length > 0) {
    console.log(gris(`   ${divulgacion.length} aparición(es) clasificadas como DIVULGACIÓN LEGAL, que se quedan:`))
    for (const d of divulgacion) console.log(gris(`      ${d.ruta} → ${d.claim}`))
    console.log(gris('   No son claims de venta. Pero el claim que las sostiene sigue `pending`:'))
    console.log(gris('   lo que hay que cerrar es la verificación, no el párrafo.'))
  }

  if (publicados.length > 0) {
    console.log(gris(`   ⚠️ ${publicados.length} claim(s) SÍ publicados como afirmación. Eso NO es verde:`))
    for (const d of publicados) console.log(gris(`      ${d.ruta} → ${d.claim}`))
  }
  process.exit(0)
}

console.error(rojo(`\n✖ ${fallos.length} problema(s):`))
for (const f of fallos) console.error(`    ${f}`)
console.error('')
process.exit(1)
