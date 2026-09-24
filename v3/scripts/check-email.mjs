/**
 * El correo del titular sólo vive donde tiene una función legal.
 *
 * ── QUÉ CLAIM DEMUESTRA ───────────────────────────────────────────────────
 * Dos, y los dos hacen falta:
 *
 *   1. `admin@veliacorp.com` NO aparece en ninguna superficie pública que no
 *      sea legal. Cero.
 *   2. SÍ aparece en las que lo tienen por obligación. Un «cero en todas
 *      partes» no sería un éxito: sería haber roto el aviso legal y la política
 *      de privacidad para pasar la comprobación.
 *
 * La segunda mitad es la que convierte esto en una guarda y no en un `grep`.
 * Sin ella, borrar la constante entera daría verde.
 *
 * ── POR QUÉ MIDE EL HTML SERVIDO ──────────────────────────────────────────
 * Un `grep` del código dice dónde está escrito; esto dice qué se PUBLICA. El
 * correo puede llegar al HTML sin estar escrito en una página: por una
 * constante compartida, por el JSON-LD del layout —que se sirve en todas las
 * rutas— o por un `mailto:` de un componente común. De hecho así es como había
 * acabado: en el pie de todas las páginas y en el `email` del JSON-LD.
 *
 * Busca también las variantes que un `grep` ingenuo se dejaría: mayúsculas,
 * `mailto:`, la arroba escapada como entidad HTML y el ofuscado de correos de
 * Cloudflare, que reescribe la dirección en la respuesta.
 *
 * ── CÓMO SE CORRE ─────────────────────────────────────────────────────────
 *   npm run build && npm run start -- -p 3150   (en otra terminal)
 *   node scripts/check-email.mjs
 */
const BASE = process.env.QA_URL || 'http://localhost:3150'
const CORREO = 'admin@veliacorp.com'

/* La allowlist son RUTAS REALES del repositorio, no una familia de nombres.
   Cada una con el motivo por el que el dato se queda: si mañana alguien quiere
   quitarlo de aquí, que sepa con qué se está peleando. */
const LEGALES = [
  ['/aviso-legal', 'LSSI-CE art. 10: el titular publica un medio de contacto directo'],
  ['/privacidad', 'RGPD art. 13: contacto del responsable del tratamiento'],
  ['/cookies', 'deriva del aviso de privacidad y remite al mismo responsable'],
  ['/terminos', 'contacto contractual del prestador del servicio'],
  ['/ia-responsable', 'canal declarado para ejercer supervisión humana'],
]

/* Todo lo demás que se sirve y que una persona o una máquina puede abrir.
   `/llms.txt` entra a propósito: es una superficie pública aunque no sea HTML. */
const NO_LEGALES = [
  '/',
  '/contacto',
  '/sobre-velia',
  '/digital-foundation',
  '/growth-automation',
  '/digital-operations',
  '/ai-search',
  '/ai-search/preparar-una-web',
  '/ai-search/llms-txt',
  '/novedades',
  '/seguridad',
  '/precios',
  '/demo',
  '/fundadores',
  '/legal',
  '/llms.txt',
]

const rojo = t => `\x1b[31m${t}\x1b[0m`
const verde = t => `\x1b[32m${t}\x1b[0m`
const gris = t => `\x1b[90m${t}\x1b[0m`

/** Todas las formas en que el correo puede llegar al HTML sin escribirse igual. */
function apariciones(html) {
  const formas = [
    CORREO,
    CORREO.toUpperCase(),
    `mailto:${CORREO}`,
    CORREO.replace('@', '&#64;'),
    CORREO.replace('@', '&commat;'),
    CORREO.replace('@', '%40'),
  ]
  const bajo = html.toLowerCase()
  const halladas = formas.filter(f => bajo.includes(f.toLowerCase()))
  /* Cloudflare reescribe los `mailto:` en `/cdn-cgi/l/email-protection` y deja
     el correo cifrado en `data-cfemail`. Sin esto, un correo protegido por
     Cloudflare pasaría la comprobación estando publicado igualmente. */
  if (/data-cfemail=|\/cdn-cgi\/l\/email-protection/.test(html)) halladas.push('ofuscado de Cloudflare')
  return halladas
}

let fallos = 0
const comprobar = (nombre, ok, detalle) => {
  if (!ok) fallos++
  console.log(`${ok ? verde('OK   ') : rojo('FALLA')} ${nombre}${detalle ? gris(' — ' + detalle) : ''}`)
}

const traer = async ruta => {
  const r = await fetch(BASE + ruta, { cache: 'no-store' })
  if (!r.ok && r.status !== 404) throw new Error(`${ruta}: HTTP ${r.status}`)
  return { status: r.status, html: await r.text() }
}

console.log(`\nSUPERFICIES PÚBLICAS NO LEGALES — «${CORREO}» no puede aparecer\n`)
for (const ruta of NO_LEGALES) {
  try {
    const { status, html } = await traer(ruta)
    const h = apariciones(html)
    comprobar(`${ruta} sin el correo`, h.length === 0, h.length ? h.join(' · ') : `HTTP ${status}`)
  } catch (e) {
    comprobar(`${ruta} sin el correo`, false, `no se pudo leer: ${e.message}`)
  }
}

console.log(`\nSUPERFICIES LEGALES — el correo TIENE que seguir ahí\n`)
for (const [ruta, motivo] of LEGALES) {
  try {
    const { html } = await traer(ruta)
    const h = apariciones(html)
    comprobar(`${ruta} conserva el correo`, h.length > 0, motivo)
  } catch (e) {
    comprobar(`${ruta} conserva el correo`, false, `no se pudo leer: ${e.message}`)
  }
}

console.log(
  fallos === 0
    ? verde(`\n✅ ${NO_LEGALES.length} superficies públicas sin el correo · ${LEGALES.length} legales que lo conservan\n`)
    : rojo(`\n❌ ${fallos} comprobación(es) han fallado\n`),
)
process.exit(fallos === 0 ? 0 : 1)
