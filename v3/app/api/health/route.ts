import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'

/**
 * SALUD DE LA WEB — qué commit y qué rama está sirviendo ESTE proceso.
 *
 * POR QUÉ EXISTE (13-sep-2026). Hasta hoy la web pública no tenía forma de decir
 * qué versión servía: `veliacorp.com/api/health` daba 404. Eso tenía dos
 * consecuencias, las dos silenciosas:
 *
 *   · Tras un despliegue no había cómo anclar la verificación por COMMIT, que es
 *     la única ancla que no engaña. Mirar la página «a ver si ha cambiado» no
 *     distingue un despliegue nuevo de uno viejo que se parece.
 *   · Una preview de la Home nueva —cuando exista— no podría demostrar que sirve
 *     la rama correcta. Abrir una preview equivocada y darla por buena es
 *     exactamente el fallo de «evidencia correcta sobre el objeto equivocado».
 *
 * Es el mismo patrón que `velia-portal/app/api/health/route.ts`, y a propósito:
 * el Developer Hub del portal lee las dos con el mismo código.
 *
 * ── LO QUE NO HACE ──────────────────────────────────────────────────────────
 * No llama a nadie ni lee nada fuera del propio proceso: si esta ruta dependiera
 * de un tercero, su parpadeo se vería como la web caída. Y no expone ni una
 * variable de entorno salvo los identificadores de versión, que no son secretos.
 *
 * `commit: null` significa «este build no recibió el dato», NUNCA «no hay
 * commit». El campo `*_fuente` lo dice: desconocido no es un valor, y quien lo lea
 * tiene que poder distinguirlo de una coincidencia.
 */

const ARRANQUE = Date.now()

/* Cada plataforma inyecta el suyo y no está escrito en ningún sitio cuál usa este
   build: se prueban todos, en el mismo orden que el portal. */
const CANDIDATOS_COMMIT = [
  'SOURCE_COMMIT',
  'COOLIFY_GIT_COMMIT_SHA',
  'GIT_COMMIT_SHA',
  'GIT_SHA',
  'COMMIT_SHA',
  'VERCEL_GIT_COMMIT_SHA',
  'NEXT_PUBLIC_COMMIT_SHA',
] as const

const CANDIDATOS_RAMA = ['COOLIFY_BRANCH', 'SOURCE_BRANCH', 'GIT_BRANCH', 'VERCEL_GIT_COMMIT_REF'] as const

function leer(candidatos: readonly string[], limite: number): { valor: string | null; fuente: string } {
  for (const nombre of candidatos) {
    const v = process.env[nombre]?.trim()
    /* `HEAD` no es un commit ni una rama: es lo que queda cuando el build no sabe
       de dónde viene. Tratarlo como valor sería pintar verde un desconocido. */
    if (v && v !== 'HEAD') return { valor: v.slice(0, limite), fuente: nombre }
  }
  return { valor: null, fuente: 'DESCONOCIDO' }
}

export async function GET() {
  const commit = leer(CANDIDATOS_COMMIT, 40)
  const rama = leer(CANDIDATOS_RAMA, 120)

  return NextResponse.json(
    {
      ok: true,
      servicio: 'velia-web',
      uptime_s: Math.round((Date.now() - ARRANQUE) / 1000),
      hora: new Date().toISOString(),
      commit: commit.valor,
      commit_fuente: commit.fuente,
      rama: rama.valor,
      rama_fuente: rama.fuente,
    },
    {
      headers: {
        'cache-control': 'no-store',
        // Un endpoint de estado no tiene nada que indexar.
        'x-robots-tag': 'noindex, nofollow',
      },
    },
  )
}
