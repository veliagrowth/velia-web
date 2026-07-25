import { createReadStream, statSync } from 'node:fs'
import { join } from 'node:path'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Vídeo del hero servido por nosotros, con soporte REAL de peticiones por rango.
 *
 * POR QUÉ EXISTE (bug "en iPhone el vídeo no se reproduce", 25-jul):
 * iOS Safari solo reproduce media si recibe **206 Partial Content** ante un
 * `Range`. Sirviéndolo como estático de `public/` la cadena
 * Next → cloudflared → Cloudflare acababa entregando la respuesta troceada, sin
 * `Content-Length` ni `Accept-Ranges`, y devolvía 200 a los `Range`. Se probaron
 * `compress:false` y `generateEtags:false`: el origen pasó a hacerlo bien, pero el
 * túnel/edge seguía normalizando la respuesta y el 206 no llegaba al navegador.
 *
 * Aquí el 206 lo genera la aplicación, así que el edge solo tiene que
 * transportarlo. Es la única capa que no depende de cómo se comporten Next-static,
 * cloudflared o Cloudflare.
 *
 * `no-store` a propósito: son 1,25 MB, el navegador ya lo cachea por sesión y así
 * ninguna caché intermedia puede volver a romper los rangos.
 */

const FILE = join(process.cwd(), 'public', 'videos', 'hero-bufete-v2.mp4')

export async function GET(req: NextRequest) {
  let size: number
  try {
    size = statSync(FILE).size
  } catch {
    return new Response('vídeo no disponible', { status: 404 })
  }

  const base = {
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
  }

  const range = req.headers.get('range')
  if (!range) {
    return new Response(toWebStream(createReadStream(FILE)), {
      status: 200,
      headers: { ...base, 'Content-Length': String(size) },
    })
  }

  // `bytes=inicio-fin` — el fin es opcional (iOS suele pedir `bytes=0-`).
  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim())
  if (!m || (!m[1] && !m[2])) {
    return new Response(null, { status: 416, headers: { ...base, 'Content-Range': `bytes */${size}` } })
  }

  let start: number
  let end: number
  if (m[1]) {
    start = parseInt(m[1], 10)
    end = m[2] ? parseInt(m[2], 10) : size - 1
  } else {
    // Sufijo (`bytes=-500`): los últimos N bytes.
    const suffix = parseInt(m[2], 10)
    start = Math.max(0, size - suffix)
    end = size - 1
  }

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
    return new Response(null, { status: 416, headers: { ...base, 'Content-Range': `bytes */${size}` } })
  }
  end = Math.min(end, size - 1)

  return new Response(toWebStream(createReadStream(FILE, { start, end })), {
    status: 206,
    headers: {
      ...base,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
    },
  })
}

/** ReadStream de Node → ReadableStream web (lo que espera la Response de Next). */
function toWebStream(nodeStream: NodeJS.ReadableStream): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', chunk => controller.enqueue(new Uint8Array(chunk as Buffer)))
      nodeStream.on('end', () => controller.close())
      nodeStream.on('error', err => controller.error(err))
    },
    cancel() {
      ;(nodeStream as unknown as { destroy?: () => void }).destroy?.()
    },
  })
}
