/**
 * «Del formato al significado» — el Hero de veliacorp.com como pieza social 4:5.
 *
 * NO RECREA LA ANIMACIÓN. Abre el hero REAL en Chromium, pausa sus 39 tracks de
 * CSS y los avanza fotograma a fotograma fijando `currentTime` por la API de
 * animaciones web. Cada PNG es la animación de producción detenida en un
 * instante exacto, no una grabación en tiempo real: sin fotogramas perdidos, sin
 * jitter y reproducible.
 *
 * POR QUÉ EL ESCENARIO Y NO EL VIEWPORT: en vertical el hero apila titular,
 * párrafo y botones ARRIBA, y el escenario queda por debajo del pliegue —
 * capturar el viewport daría un vídeo del titular. El escenario es `.mesa`, y
 * mide 4:5 EXACTO (medido: 478,75×598,43 y 549,70×687,13 → ratio 0,8000 en los
 * dos tamaños). Se captura entero: ni un recorte, ni una deformación.
 *
 * POR QUÉ ESTE VIEWPORT: el corte entre las dos composiciones está en 640 px.
 * Por debajo, el hero usa la composición VERTICAL —dos columnas de tres, con los
 * seis conceptos— que es la que corresponde a un 4:5. Se captura a ~1100×1375
 * físicos y se reduce a 1080×1350: esa reducción del 1,7 % actúa como
 * supersampling y el resultado sale MÁS nítido que capturar a 1080 directo.
 *
 * LOS CAPTIONS NO SON SUBTÍTULOS. Van en la banda inferior, que la composición
 * deja libre en los cuatro tiempos (medido: 16 % arriba, 18 % abajo, y las
 * piezas nunca entran ahí). Se dibujan con la tipografía del sitio, sin caja ni
 * fondo, y su opacidad la calcula este script fotograma a fotograma — no son
 * animaciones CSS, así que no entran en la lista de tracks del hero y no pueden
 * alterarlo.
 *
 * Y CALLAN EN EL DESENLACE: entre 9 y 10,9 s no hay texto. La ficha final ya
 * lleva siete líneas y una frase; competir con ella sería perder las dos.
 *
 * NO TOCA EL HERO. Solo lee la página publicada. El overlay se inyecta en el
 * DOM de la sesión de captura y muere con ella.
 *
 * Uso:  node scripts/render-hero-video.mjs [url]
 * Salida: .render-hero/{frames/, hero-master.mp4, hero-social.mp4}
 */
import { createRequire } from 'node:module'
import { mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const puppeteer = require('puppeteer-core')

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL_HERO = process.argv[2] || 'https://veliacorp.com/'

// ffmpeg y ffprobe vienen con Remotion: no se instala nada en la máquina.
const COMPOSITOR = 'C:/Users/JPR/Desktop/WORKS/VELIA AI/velia-motion/node_modules/@remotion/compositor-win32-x64-msvc'
const FFMPEG = join(COMPOSITOR, 'ffmpeg.exe')
const FFPROBE = join(COMPOSITOR, 'ffprobe.exe')

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '.render-hero')
const FRAMES = join(RAIZ, 'frames')

const FPS = 60
const SEGUNDOS = 12
const TOTAL = FPS * SEGUNDOS          // 720
const ANCHO = 1080
const ALTO = 1350

/** Secuencia B — «Del formato al significado». Tiempos en segundos. */
const CAPTIONS = [
  { desde: 0.6,  hasta: 2.6,  texto: 'Notificación. Contrato. Correo. Foto. Hoja de cálculo.' },
  { desde: 3.3,  hasta: 5.5,  texto: 'Plazo. Cláusulas. Cliente. Prueba. Importe.' },
  { desde: 6.4,  hasta: 8.4,  texto: 'Un expediente que se entiende solo.' },
  // 9 – 10,9 s: SIN CAPTION. La ficha final es la protagonista.
  { desde: 10.9, hasta: 11.8, texto: 'VELIA', marca: true },
]
const FUNDIDO = 0.4 // s

/** Opacidad de un caption en el instante t. Trapecio con fundido de 400 ms. */
function opacidadEn(cap, t) {
  if (t < cap.desde || t > cap.hasta) return 0
  const entrada = Math.min(1, (t - cap.desde) / FUNDIDO)
  const salida = Math.min(1, (cap.hasta - t) / FUNDIDO)
  return Math.max(0, Math.min(entrada, salida))
}

function ff(bin, args) {
  return execFileSync(bin, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
}

console.log(`\n  Hero → pieza social 4:5\n  ${URL_HERO}\n`)

if (existsSync(RAIZ)) rmSync(RAIZ, { recursive: true, force: true })
mkdirSync(FRAMES, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 613, height: 900, deviceScaleFactor: 2 })
  await page.goto(URL_HERO, { waitUntil: 'networkidle0', timeout: 90_000 })

  // El banner de cookies tapa la escena y no forma parte de la pieza.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /rechazar/i.test(x.textContent || ''))
    if (b) b.click()
  })
  await page.evaluate(() => document.fonts.ready)
  await new Promise(r => setTimeout(r, 1200))

  const geometria = await page.evaluate(() => {
    const mesa = document.querySelector('.mesa')
    if (!mesa) throw new Error('no se encuentra .mesa: ¿ha cambiado el hero?')
    mesa.scrollIntoView({ block: 'center' })
    window.scrollBy(0, 0)
    const r = mesa.getBoundingClientRect()
    return { w: r.width, h: r.height, ratio: r.width / r.height }
  })

  // Si el escenario dejara de ser 4:5, cualquier encuadre mentiría: se para.
  if (Math.abs(geometria.ratio - 0.8) > 0.005) {
    throw new Error(`el escenario ya no es 4:5 (ratio ${geometria.ratio.toFixed(4)}): revisar el hero antes de renderizar`)
  }
  console.log(`  escenario ${geometria.w.toFixed(1)}×${geometria.h.toFixed(1)} · ratio ${geometria.ratio.toFixed(4)} ✓`)

  // Pausar los tracks del hero y montar la capa editorial.
  const tracks = await page.evaluate(() => {
    const mesa = document.querySelector('.mesa')
    const anims = mesa.getAnimations({ subtree: true })
    anims.forEach(a => a.pause())
    window.__A = anims

    const capa = document.createElement('div')
    capa.id = '__capa-editorial'
    capa.style.cssText = [
      'position:absolute', 'left:0', 'right:0', 'bottom:0',
      'height:18%',                       // la banda que la composición deja libre
      'display:flex', 'align-items:center', 'justify-content:center',
      'padding:0 8%', 'pointer-events:none', 'z-index:40',
      'text-align:center',
    ].join(';')

    const linea = document.createElement('p')
    // Geist es la familia del sitio; se hereda para no introducir otra.
    linea.style.cssText = [
      'margin:0', 'color:#F6F7FA', 'opacity:0',
      'font-size:15px', 'line-height:1.5', 'font-weight:500',
      'letter-spacing:0.01em', 'text-wrap:balance',
    ].join(';')
    capa.appendChild(linea)
    mesa.appendChild(capa)

    window.__linea = linea
    window.__pintar = (texto, opacidad, marca) => {
      const l = window.__linea
      l.textContent = texto
      l.style.opacity = String(opacidad)
      if (marca) {
        l.style.fontSize = '19px'
        l.style.fontWeight = '600'
        l.style.letterSpacing = '0.38em'
        l.style.textIndent = '0.38em'   // compensa el tracking del último carácter
      } else {
        l.style.fontSize = '15px'
        l.style.fontWeight = '500'
        l.style.letterSpacing = '0.01em'
        l.style.textIndent = '0'
      }
    }
    return anims.length
  })
  console.log(`  ${tracks} tracks del hero pausados · capa editorial montada\n`)

  const mesa = await page.$('.mesa')

  for (let f = 0; f < TOTAL; f++) {
    const t = (f / FPS)
    const ms = t * 1000

    await page.evaluate((ms, caps, fund) => {
      window.__A.forEach(a => { try { a.currentTime = ms } catch { /* track sin tiempo */ } })
      const t = ms / 1000
      let activo = null, op = 0
      for (const c of caps) {
        if (t >= c.desde && t <= c.hasta) {
          const e = Math.min(1, (t - c.desde) / fund)
          const s = Math.min(1, (c.hasta - t) / fund)
          const o = Math.max(0, Math.min(e, s))
          if (o > op) { op = o; activo = c }
        }
      }
      window.__pintar(activo ? activo.texto : '', op, !!(activo && activo.marca))
    }, ms, CAPTIONS, FUNDIDO)

    await mesa.screenshot({ path: join(FRAMES, `f${String(f).padStart(4, '0')}.png`), captureBeyondViewport: false })

    if (f % 120 === 0) console.log(`  fotograma ${f}/${TOTAL} (${t.toFixed(1)}s)`)
  }
  console.log(`  fotograma ${TOTAL}/${TOTAL} ✓\n`)
} finally {
  await browser.close()
}

const entrada = join(FRAMES, 'f%04d.png')
const escala = `scale=${ANCHO}:${ALTO}:flags=lanczos`

console.log('  codificando MASTER…')
ff(FFMPEG, ['-y', '-framerate', String(FPS), '-i', entrada,
  '-vf', escala, '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '10',
  '-pix_fmt', 'yuv444p', '-an', join(RAIZ, 'hero-master.mp4')])

console.log('  codificando SOCIAL…')
ff(FFMPEG, ['-y', '-framerate', String(FPS), '-i', entrada,
  '-vf', escala, '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
  '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', '-an', join(RAIZ, 'hero-social.mp4')])

for (const nombre of ['hero-master.mp4', 'hero-social.mp4']) {
  const j = JSON.parse(ff(FFPROBE, ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,nb_frames,pix_fmt:format=duration,size',
    '-of', 'json', join(RAIZ, nombre)]))
  const s = j.streams[0]
  console.log(`  ${nombre}: ${s.width}×${s.height} · ${s.r_frame_rate} · ${s.nb_frames} fotogramas · ${s.pix_fmt} · ${(+j.format.duration).toFixed(3)}s · ${(j.format.size / 1e6).toFixed(1)} MB`)
}

console.log('\n  listo:', RAIZ, '\n')
