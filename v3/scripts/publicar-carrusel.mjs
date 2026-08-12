/**
 * Sube el carrusel «La mesa del lunes» a la Biblioteca del Content OS.
 *
 * Las tres piezas YA existen en `media_assets` (portada · vídeo · cierre). Esto
 * no crea entradas nuevas: ACTUALIZA esas tres, para que la Biblioteca siga
 * teniendo una sola publicación y no dos versiones compitiendo.
 *
 * NOMBRE CON HASH, SIEMPRE. Es la lección de `velia-motion/scripts/
 * publicar-en-biblioteca.mjs`: `upsert` devuelve 200 y el CDN sigue sirviendo el
 * fichero VIEJO durante horas — se ve la pieza anterior, nada falla y uno jura
 * que ha publicado. Con el contenido en el nombre, un fichero distinto es una
 * URL distinta y no hay caché que valga.
 *
 * VERIFICA POR EL EFECTO: relee la fila y descarga el fichero por su URL
 * pública comparando el tamaño. Un update que RLS bloquea afecta a cero filas y
 * devuelve `error: null`; un objeto que no subió da 404 solo cuando alguien abre
 * la biblioteca.
 *
 * Uso:  node scripts/publicar-carrusel.mjs
 */
import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const { createClient } = require('@supabase/supabase-js')

const AQUI = dirname(fileURLToPath(import.meta.url))
const RENDER = join(AQUI, '..', '.render-hero')
const BUCKET = 'velia-media'

/** El .env.local del portal: es donde vive la clave de servicio. */
function cargarEnv(ruta) {
  const out = {}
  let texto
  try { texto = readFileSync(ruta, 'utf8') } catch { return out }
  for (const linea of texto.split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
  return out
}
const env = cargarEnv('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/.env.local')
const URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) { console.error('Faltan credenciales de Supabase'); process.exit(1) }
const db = createClient(URL, KEY, { auth: { persistSession: false } })

/** Las tres filas que ya existen. Se actualizan; no se duplican. */
const PIEZAS = [
  {
    id: 'd6f0590f-988f-4956-a394-ab0e697d0699',
    fichero: 'carrusel-1-1080.png', mime: 'image/png', kind: 'image',
    titulo: 'VELIA Carrusel «La mesa del lunes» · 1/3 portada',
  },
  {
    id: '5977aebb-938a-4998-8c32-2d71ad779d07',
    fichero: 'hero-social.mp4', mime: 'video/mp4', kind: 'video',
    titulo: 'VELIA Carrusel «La mesa del lunes» · 2/3 vídeo · bucle limpio',
  },
  {
    id: '6a52df9a-8fb1-4e9f-8126-70804663a55c',
    fichero: 'carrusel-3-1080.png', mime: 'image/png', kind: 'image',
    titulo: 'VELIA Carrusel «La mesa del lunes» · 3/3 cierre + CTA',
  },
]

let fallos = 0

for (const p of PIEZAS) {
  const ruta = join(RENDER, p.fichero)
  process.stdout.write(`\n${p.fichero}\n  `)
  if (!existsSync(ruta)) {
    console.error(`✗ no existe: ${ruta}`)
    fallos++
    continue
  }
  const buf = readFileSync(ruta)
  const hash = createHash('sha1').update(buf).digest('hex').slice(0, 8)
  const destino = `motion/renders/${p.id}-claro-${hash}${p.fichero.endsWith('.mp4') ? '.mp4' : '.png'}`

  const { error: upErr } = await db.storage
    .from(BUCKET).upload(destino, buf, { contentType: p.mime, upsert: true })
  if (upErr) { console.error(`✗ subida: ${upErr.message}`); fallos++; continue }
  process.stdout.write(`subido (${Math.round(buf.length / 1024)} kB) · `)

  const { data: filas, error: dbErr } = await db
    .from('media_assets')
    .update({ storage_path: destino, bytes: buf.length, mime: p.mime, kind: p.kind, status: 'ready' })
    .eq('id', p.id)
    .select('id, storage_path')

  if (dbErr) { console.error(`✗ media_assets: ${dbErr.message}`); fallos++; continue }
  if (!filas?.length) { console.error('✗ cero filas actualizadas y sin error (RLS)'); fallos++; continue }

  // Verificación por el efecto: la URL pública tiene que devolver ESTE fichero.
  const publica = db.storage.from(BUCKET).getPublicUrl(destino).data.publicUrl
  const res = await fetch(publica)
  const bytes = res.ok ? (await res.arrayBuffer()).byteLength : 0
  if (!res.ok || bytes !== buf.length) {
    console.error(`✗ la URL pública devolvió ${res.status} y ${bytes} B (esperaba ${buf.length})`)
    fallos++
    continue
  }
  console.log(`✅ publicado y comprobado`)
}

console.log('')
if (fallos) { console.error(`❌ ${fallos} pieza(s) sin publicar`); process.exit(1) }
console.log('✅ El carrusel «La mesa del lunes» está actualizado en la Biblioteca.')
