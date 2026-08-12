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
 * LLEVA SONIDO desde el 11-ago-2026: tres acentos sintetizados aquí mismo,
 * anclados a los @keyframes del hero. Ver «DISEÑO SONORO» más abajo. El máster
 * pasa a .mov porque su audio es PCM y mp4 no lo transporta de forma estándar.
 *
 * Uso:  node scripts/render-hero-video.mjs [url]
 * Salida: .render-hero/{frames/, sfx.wav, hero-master.mov, hero-social.mp4}
 */
import { createRequire } from 'node:module'
import { mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync, spawnSync } from 'node:child_process'

const require = createRequire('C:/Users/JPR/Desktop/WORKS/VELIA AI/CRM/velia-portal/package.json')
const puppeteer = require('puppeteer-core')

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
// El primer argumento que NO sea una bandera. Antes era `argv[2]` a secas, así
// que `--solo-laminas` se tomaba como la URL y Chromium fallaba con «invalid URL».
const URL_HERO = process.argv.slice(2).find(a => !a.startsWith('--')) || 'https://veliacorp.com/'

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
  // 8,4 – 10,3 s: SIN CAPTION. La ficha final se lee sola, sin nada encima.
  //
  // EL CIERRE ES UNA LLAMADA, NO UNA FIRMA (11-ago-2026, revisión de Joaquín).
  // Antes cerraba con el logotipo «VELIA» a secas, que no pide nada. La marca ya
  // está DENTRO de la ficha —su cabecera la lleva—, así que repetirla era gastar
  // el último segundo en decir dos veces lo mismo. Ahora el cierre ofrece algo.
  // La oferta es la real del sitio (15 días), no una inventada para el vídeo.
  //
  // EL CIERRE TERMINA ANTES DE QUE EL CICLO SE REBOBINE (11-ago, 2ª revisión).
  // `mesaPieza` devuelve las seis tarjetas del 94 % al 100 %, o sea a partir de
  // 11,28 s: el principio del vídeo ya está entrando mientras el final sigue en
  // pantalla. Con el CTA hasta 11,75 s se veían las dos cosas encimadas —el
  // reclamo sobre las tarjetas que vuelven— y la pieza parecía atascada entre
  // dos estados. Ahora el CTA se ha ido a las 11,2 s y el último tramo lo ocupa
  // solo el rebobinado, que es lo que encadena con el fotograma 0.
  { desde: 9.6, hasta: 11.2, texto: 'Pruébalo gratis 15 días', cta: 'veliacorp.com' },
]

/** Cuándo empieza el ciclo a devolver las piezas: `mesaPieza` al 94 %. */
const REBOBINADO = 0.94 * 12
const FUNDIDO = 0.4 // s

/**
 * MARGEN — el encuadre necesita aire, y la caja del escenario no lo tiene.
 *
 * `.mesa` se captura por su caja EXACTA, así que la pieza salía a sangre por los
 * cuatro lados: la ficha final iba literalmente de borde a borde del 4:5 y las
 * seis tarjetas dejaban un 2 %. En un feed eso se lee como un recorte, no como
 * una composición.
 *
 * No se toca la composición para arreglarlo. `.mesa` es TRANSPARENTE y su
 * `overflow` es visible (comprobado en el DOM), y quien pinta el fondo es
 * `section.velia-dark-stage` con `rgb(13,16,23)` — el Night de la marca. Así
 * que basta con encoger el escenario y seguir capturando su caja original: el
 * anillo que queda lo pinta el fondo REAL de la sección. Sin color inventado y
 * sin costura, que es lo que habría dado rellenar con un `pad` de ffmpeg (que
 * además este build no tiene).
 *
 * Al encoger, el texto encogería con él: los cuerpos de la capa editorial se
 * compensan por 1/ESCALA para que se lea igual que antes.
 */
const ESCALA = 0.85
// El velo de las láminas atenúa el escenario. Con el tema claro es Pearl Cloud:
// un velo Night sobre fondo claro dejaría la lámina gris sucia.
const FONDO = '#F6F7FA'
/** Tinta de las láminas. Antes era `#F6F7FA` sobre velo oscuro; ahora al revés. */
const TINTA_LAMINA = '#0D1017'
/** Solo las dos láminas, sin los 12 s de vídeo: para iterar el diseño en segundos. */
const SOLO_LAMINAS = process.argv.includes('--solo-laminas')
/**
 * EL LOGOTIPO REAL, no una V dibujada a mano. Sale del mismo SVG que publica
 * veliacorp.com, asi que cualquier retoque de marca llega solo a la pieza.
 */
const LOGO_SVG = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'velia_logotipo.svg'), 'utf8')

/**
 * NO HAY FUNDIDO A NEGRO, Y QUITARLO FUE EL ARREGLO (11-ago, 2ª revisión).
 *
 * Lo puse para «cerrar limpio el bucle» y hacía justo lo contrario. El ciclo
 * del hero YA cierra solo: entre el 94 % y el 100 % las piezas vuelven a
 * aparecer mientras la ficha se va — un cruce, no un corte— y el fotograma
 * 100 % es idéntico al 0 %.
 *
 * Encima de ese cruce, oscurecer añadía un TERCER suceso y el final pasaba a
 * leerse como «va a empezar… no, se apaga… ah, ahora sí empieza». Medido: la
 * costura ya daba 0,03 de diferencia media sobre 255 CON el fundido, o sea que
 * el problema nunca fue un salto entre fotogramas —eso estaba bien— sino que el
 * último segundo parecía un final. Un número correcto puede estar contestando a
 * la pregunta que no era.
 *
 * El velo sigue existiendo: lo usan las láminas del carrusel para atenuar el
 * escenario. Lo que se quitó es su uso fotograma a fotograma en el vídeo.
 */

/**
 * EL GRADIENTE, DISTINTO EN CADA PIEZA.
 *
 * Pedido el 12-ago: «muy sutil y distribuido en diferentes partes en cada
 * pieza». Un mismo degradado repetido tres veces se lee como una plantilla; que
 * la luz venga de un sitio distinto en cada lámina es lo que hace que la
 * publicación parezca compuesta y no clonada.
 *
 * Se mantiene por debajo del umbral en el que deja de ser atmósfera y pasa a
 * ser un fondo de color: iris al 0,10-0,16 y Pale Ice al 0,16-0,24. Por encima
 * de eso el «baño violeta» se come la marca, que es justo lo que la referencia
 * NO hace.
 */
const GRADIENTES = {
  // Portada: la luz entra por arriba a la izquierda y cae hacia el pie derecho.
  portada:
    'radial-gradient(95% 70% at 6% -6%, rgba(181,223,255,0.24), rgba(181,223,255,0) 62%),' +
    'radial-gradient(85% 65% at 96% 104%, rgba(116,121,242,0.13), rgba(116,121,242,0) 60%)',
  // Vídeo: halo alto y centrado, donde convergen las trazas. Nada en las esquinas.
  video:
    'radial-gradient(70% 46% at 50% 4%, rgba(116,121,242,0.14), rgba(116,121,242,0) 66%),' +
    'radial-gradient(90% 60% at 88% 96%, rgba(181,223,255,0.18), rgba(181,223,255,0) 64%)',
  // Cierre: peso abajo a la izquierda, para que la ficha respire contra un lado
  // limpio y el CTA no compita con la luz.
  cierre:
    'radial-gradient(90% 62% at 2% 96%, rgba(116,121,242,0.14), rgba(116,121,242,0) 58%),' +
    'radial-gradient(75% 55% at 100% 12%, rgba(181,223,255,0.20), rgba(181,223,255,0) 60%)',
}

/**
 * ══ CARRUSEL ════════════════════════════════════════════════════════════════
 *
 * La publicación es lámina → vídeo → lámina. Las dos láminas salen del MISMO
 * escenario y en la misma sesión de captura, no de un diseño paralelo: así la
 * coherencia con el vídeo no es un parecido, es el mismo píxel — mismo fondo,
 * misma tipografía del sitio, mismos componentes, mismo margen.
 *
 * Cada una congela un instante del ciclo que ya cuenta algo por sí solo:
 *   · la 1 en 1,4 s — los seis archivos sueltos, antes de ordenarse
 *   · la 3 en 10,2 s — el expediente resuelto, con su contexto
 *
 * El velo atenúa el escenario para que el texto mande. En la primera puede ser
 * fuerte (el desorden es fondo); en la tercera apenas se toca, porque ahí la
 * prueba ES la ficha y taparla sería enseñar menos.
 */
const LAMINAS = [
  {
    // 0,62 y no 0,80: sobre claro, un velo alto no atenúa las tarjetas, las
    // BORRA —quedaban seis fantasmas ilegibles— y el desorden es el argumento
    // de esta lámina. En oscuro el mismo número funcionaba; el velo claro tapa
    // mucho más porque las tarjetas ya son blancas.
    archivo: 'carrusel-1.png', t: 1.4, velo: 0.62, reparto: 'center', grad: GRADIENTES.portada,
    encima: 'LA MESA DEL LUNES',
    titular: 'Olvídate de los\narchivos sueltos.',
    pie: 'Desliza  →',
  },
  {
    archivo: 'carrusel-3.png', t: 10.2, velo: 0.12, reparto: 'space-between', grad: GRADIENTES.cierre,
    encima: 'TODO EN UNO CON VELIA',
    titular: 'Todo tu despacho,\nen un mismo sitio.',
    pie: 'Pruébalo gratis 15 días\nveliacorp.com',
  },
]

/**
 * ══ TEMA CLARO ══════════════════════════════════════════════════════════════
 *
 * La publicación se pasa a claro (encargo del 12-ago: «tonos claros y el
 * gradiente sutil de color azul», con la creatividad de Axel como referencia).
 *
 * NO se toca veliacorp.com: el hero de producción sigue siendo oscuro. Esto se
 * inyecta en la página SOLO durante la captura, así que la web no cambia y la
 * pieza sí. Si algún día el hero se pasa a claro de verdad, esto sobra y se
 * quita — no al revés.
 *
 * QUÉ HAY QUE INVERTIR, y qué no: se midió el hero antes de escribir una línea.
 * La ficha del expediente (`.mesa-win`) YA es blanca con tinta Night e iris 700
 * —está diseñada en claro desde el principio—, así que no se toca: invertirla
 * habría estropeado lo único que ya estaba bien. Lo oscuro es el fondo de la
 * sección y las seis piezas sueltas.
 *
 * El rótulo de cada pieza pasa de iris 400 a iris **700**: el 400 está pensado
 * para fondo oscuro y sobre Pearl Cloud no llega al contraste mínimo.
 */


const TEMA_CLARO = `
  section:has(.mesa), section.velia-dark-stage:has(.mesa) {
    background: ${GRADIENTES.video}, #F6F7FA !important;
  }
  .mesa { color:#0D1017 !important; }
  /*
   * LA V DE VELIA. En el hero es \`.mesa-marca\`, con fill y stroke en Pearl
   * Cloud porque nace sobre Night: al pasar el fondo a claro se volvió
   * invisible —el logotipo seguía animándose, pero blanco sobre blanco—.
   * Pasa a tinta Night, igual que el logotipo de las láminas.
   */
  .mesa-marca, .mesa-marca path { fill:#0D1017 !important; stroke:#0D1017 !important; }
  .mesa-pz {
    background:#FFFFFF !important;
    color:#0D1017 !important;
    border-color: rgba(13,16,23,0.10) !important;
    box-shadow: 0 8px 24px rgba(13,16,23,0.08) !important;
  }
  .mesa-pz .apo { color:#4C51B9 !important; }
  .mesa-pz .nom { color: rgba(13,16,23,0.60) !important; }
  .mesa-pz .l, .mesa-pz .c { background: rgba(13,16,23,0.13) !important; }
  .mesa-win { box-shadow: 0 24px 64px rgba(13,16,23,0.12) !important; }
`

/**
 * ══ DISEÑO SONORO ═══════════════════════════════════════════════════════════
 *
 * TRES ACENTOS, NO UNO POR TARJETA. El hero tiene seis apariciones más la
 * convergencia y la ficha final; sonorizar las ocho satura una pieza cuya
 * virtud es la sobriedad. Se marcan los tres cambios de ESTADO de la narración
 * —dispersión → convergencia → resolución— y nada más.
 *
 * LOS TIEMPOS NO SE ELIGEN A OJO: salen de los @keyframes del hero en
 * app/globals.css. El ciclo dura 12 s, así que 1 % = 0,12 s. El escalonado
 * `--t0` es i×0,09 s sobre seis elementos (0,45 s de reparto).
 *
 *   · 2,00 s  `mesaPieza` 16,7 % → las piezas arrancan del desorden
 *   · 6,95 s  `mesaTraza` 54,2 % completa + `mesaPunto` 58,3 % enciende
 *   · 8,00 s  `mesaVent`  66,7 % → el expediente llega a scale(1)
 *
 * Y CALLA EN EL DESENLACE, igual que los captions: el último acento decae
 * entero antes de 9 s, así que la banda 9 – 10,9 s queda en silencio absoluto
 * también en audio. La ficha final se lee sin nada encima.
 *
 * SOLO TONOS. El ffmpeg que trae Remotion es un build reducido: no tiene
 * `anoisesrc`, `afade` ni filtros de EQ (comprobado con -filters). Las
 * envolventes se hacen con `volume` y una expresión por fotograma, y el timbre
 * con parciales de `sine`. No es una limitación que se sufre: una paleta de
 * tonos puros con caída exponencial suena a instrumento de precisión, que es
 * exactamente el registro de la pieza. Cero dependencias nuevas.
 */
const ACENTOS = [
  /**
   * Algo se posa en la mesa: golpe sordo y corto. Se redondeó al bajar el
   * timbre del punto: con la mezcla más suave, la normalización a −18 LUFS sube
   * todo lo demás, y este golpe pasaba a ser el pico de la pieza. Caídas más
   * largas y menos nivel = misma intención, sin filo.
   */
  { nombre: 'entrada', tipo: 'golpe', t: 2.00, dur: 0.7, nivel: 0.70,
    parciales: [[210, 1.00, 0.075], [420, 0.26, 0.045], [92, 0.45, 0.095]] },

  /**
   * LAS SEIS TRAZAS VIAJANDO AL CENTRO — lo que faltaba (revisión de Joaquín).
   *
   * `mesaTraza` se dibuja del 41,7 % al 54,2 %, o sea de 5,0 a 6,5 s, y ese
   * tramo estaba MUDO: el acento que llamé «convergencia» caía en 6,95 s, que
   * es `mesaPunto` encendiéndose — el final del gesto, no el gesto.
   *
   * No es un golpe: un golpe marcaría un instante y lo que pasa aquí dura un
   * segundo y medio. Es una onda que sube y baja (seno al cuadrado, sin bordes)
   * y que se apaga justo cuando entra el timbre del punto. Los dos se leen como
   * UNA sola frase —el viaje y su llegada—, no como dos avisos seguidos.
   */
  { nombre: 'trazas', tipo: 'onda', t: 5.00, dur: 2.00, nivel: 0.30,
    parciales: [[220, 1.00], [330, 0.50]] },

  /**
   * EL PUNTO SE ENCIENDE. Antes era 880+1320+1760 a nivel 0,80 y sonaba
   * ESTRIDENTE sobre el portal blanco: el parcial de 1760 es un transitorio
   * agudo y el ataque instantáneo de un oscilador es, literalmente, un clic.
   * Ahora: se va el 1760, baja una octava (523/784, do-sol), el nivel cae a
   * 0,50 y el ataque deja de ser instantáneo. Suena a confirmación, no a timbre.
   */
  { nombre: 'punto', tipo: 'golpe', t: 6.95, dur: 1.6, nivel: 0.50,
    parciales: [[523.25, 1.00, 0.420], [784, 0.30, 0.320]] },

  /** El expediente se asienta: peso grave que cierra el arco. Sin agudos. */
  { nombre: 'asentamiento', tipo: 'golpe', t: 8.00, dur: 0.9, nivel: 0.80,
    parciales: [[165, 1.00, 0.150], [110, 0.55, 0.190]] },
]

/**
 * Ataque de los golpes. Cero es un CLIC: un oscilador que arranca de golpe
 * introduce un salto de amplitud que el oído lee como chasquido, y era parte de
 * lo que hacía áspero el timbre anterior. 6 ms redondean el arranque sin
 * quitarle percusión.
 */
const ATAQUE = 0.006

/** La banda que la pieza deja muda a propósito: la ficha final se lee sola. */
const SILENCIO = { desde: 9.0, hasta: 10.9 }

/** Sonoridad integrada objetivo (EBU R128). Discreto, nunca protagonista. */
const LUFS_OBJETIVO = -18

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

/**
 * ffmpeg escribe sus medidas por stderr, no por stdout.
 *
 * Con execFileSync esto NO se puede leer: devuelve stdout, así que un
 * `-f null -` que termina en 0 devolvía `null` y la medida se perdía sin que
 * nada fallase hasta dos líneas después. spawnSync sí entrega los dos flujos.
 */
function ffErr(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  return String(r.stderr ?? '')
}

/** Sonoridad integrada (EBU R128) y pico real de un archivo, MEDIDOS. */
function medirSonoridad(archivo) {
  // `-vn` NO es cosmético: al medir un archivo que ya lleva vídeo, este ffmpeg
  // reducido intenta abrir un encoder de vídeo para la salida nula, no tiene
  // `wrapped_avframe` y aborta antes de imprimir la medida.
  const salida = ffErr(FFMPEG, ['-hide_banner', '-i', archivo, '-vn',
    '-af', `loudnorm=I=${LUFS_OBJETIVO}:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'])
  const json = salida.slice(salida.lastIndexOf('{'), salida.lastIndexOf('}') + 1)
  const m = JSON.parse(json)
  return { lufs: parseFloat(m.input_i), pico: parseFloat(m.input_tp) }
}

/**
 * Construye la pista de efectos y la deja EN EL OBJETIVO, medida.
 *
 * La ganancia no se escribe a mano: se mide la mezcla cruda y se calcula el
 * desfase hasta LUFS_OBJETIVO. Se aplica como ganancia ESTÁTICA, nunca con la
 * normalización dinámica de `loudnorm` — esa recomprime, y lo que recomprime
 * unas envolventes exponenciales diseñadas una a una es que deja de sonar a lo
 * que se diseñó. Después se vuelve a medir para comprobarlo por efecto.
 */
function construirPistaSfx() {
  const bruto = join(RAIZ, 'sfx-bruto.wav')
  const final = join(RAIZ, 'sfx.wav')

  // La regla del desenlace es una GUARDA, no un comentario: si alguien alarga
  // un acento y su cola invade la banda muda, esto para el render.
  for (const a of ACENTOS) {
    const fin = a.t + a.dur
    if (fin > SILENCIO.desde) {
      throw new Error(
        `el acento «${a.nombre}» termina en ${fin.toFixed(2)}s e invade el silencio ` +
        `del desenlace (${SILENCIO.desde}–${SILENCIO.hasta}s): la ficha final va sin nada encima`)
    }
  }
  // Tres golpes marcan instantes; la onda cubre un tramo. Más de cuatro piezas
  // dejaría de ser sobriedad y pasaría a ser una banda sonora.
  const golpes = ACENTOS.filter(a => a.tipo === 'golpe').length
  if (golpes > 3) throw new Error(`${golpes} golpes: el diseño admite 3 como máximo`)

  const entradas = []
  const cadenas = []
  const etiquetas = []
  let i = 0

  for (const a of ACENTOS) {
    const partes = []
    for (const [frec, amp, tau] of a.parciales) {
      entradas.push('-f', 'lavfi', '-i', `sine=frequency=${frec}:duration=${a.dur}:sample_rate=48000`)
      // `golpe`: ataque redondeado + caída exponencial → percusión sin clic.
      // `onda`:  seno al cuadrado sobre toda su duración → entra y sale de la
      //          nada, sin bordes que marquen un instante.
      const env = a.tipo === 'onda'
        ? `${amp}*pow(sin(PI*t/${a.dur}),2)`
        : `${amp}*(1-exp(-t/${ATAQUE}))*exp(-t/${tau})`
      cadenas.push(`[${i}:a]volume=volume='${env}':eval=frame[p${i}]`)
      partes.push(`[p${i}]`)
      i++
    }
    const mezcla = partes.length > 1
      ? `${partes.join('')}amix=inputs=${partes.length}:normalize=0,`
      : `${partes[0]}`
    cadenas.push(`${mezcla}volume=${a.nivel},adelay=${Math.round(a.t * 1000)}[${a.nombre}]`)
    etiquetas.push(`[${a.nombre}]`)
  }

  // Base muda que fija la duración exacta de la pieza.
  entradas.push('-f', 'lavfi', '-i', `anullsrc=r=48000:cl=mono:duration=${SEGUNDOS}`)
  cadenas.push(`[${i}:a]${etiquetas.join('')}amix=inputs=${etiquetas.length + 1}:duration=first:normalize=0[mix]`)

  ff(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', ...entradas,
    '-filter_complex', cadenas.join(';'), '-map', '[mix]',
    '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s24le', bruto])

  const antes = medirSonoridad(bruto)
  const ganancia = LUFS_OBJETIVO - antes.lufs
  ff(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-i', bruto,
    '-af', `volume=${ganancia.toFixed(2)}dB`, '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s24le', final])

  const despues = medirSonoridad(final)
  console.log(`  audio: ${ACENTOS.length} acentos en ${ACENTOS.map(a => a.t + 's').join(', ')}`)
  console.log(`  audio: ${antes.lufs} LUFS → ganancia ${ganancia > 0 ? '+' : ''}${ganancia.toFixed(2)} dB → ${despues.lufs} LUFS · pico ${despues.pico} dBTP`)

  if (Math.abs(despues.lufs - LUFS_OBJETIVO) > 0.5) {
    throw new Error(`la pista quedó en ${despues.lufs} LUFS, fuera de ±0,5 del objetivo ${LUFS_OBJETIVO}`)
  }
  if (despues.pico > -1.0) {
    throw new Error(`pico real ${despues.pico} dBTP: demasiado cerca de 0, riesgo de recorte`)
  }
  return final
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
  // El tema claro entra ANTES de medir la geometría y de pausar las tracks: si
  // se inyectara después, el layout ya estaría congelado con los valores del
  // tema oscuro.
  await page.evaluate((css) => {
    const s = document.createElement('style')
    s.id = '__tema-claro'
    s.textContent = css
    document.head.appendChild(s)
  }, TEMA_CLARO)

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

  // El scroll tiene que haber ASENTADO antes de fijar el recorte: si el sitio
  // usara `scroll-behavior: smooth`, medir a media animación daría un encuadre
  // desplazado en los 720 fotogramas y no fallaría en ninguna parte.
  await new Promise(r => setTimeout(r, 500))


  // Pausar los tracks del hero y montar la capa editorial.
  const tracks = await page.evaluate((S, FONDO_C, TINTA, LOGO_SVG) => {
    const mesa = document.querySelector('.mesa')

    /**
     * SE ENCOGE UN LIENZO INTERNO, NO `.mesa`.
     *
     * Escalar `.mesa` directamente parecía lo natural, pero cambia su caja: a
     * partir de ahí `mesa.screenshot()` captura un 85 % y hay que recortar a
     * mano con coordenadas, que es donde se torció dos veces seguidas (una por
     * medir la caja YA encogida, otra porque `clip` + `captureBeyondViewport`
     * no interpretan el origen igual). Ninguna de las dos dio error: salieron
     * 720 fotogramas mal encuadrados, con su vídeo perfecto.
     *
     * Metiendo el contenido en un lienzo absoluto que ocupa toda la caja y
     * escalando ESE, la caja de `.mesa` no se entera: se sigue capturando el
     * elemento como siempre y el anillo que queda lo pinta la sección de
     * detrás, que es Night. El lienzo hereda el papel de bloque contenedor de
     * los hijos absolutos porque lleva `transform`, y como mide exactamente lo
     * mismo que `.mesa`, la composición no se mueve ni un píxel.
     */
    const lienzo = document.createElement('div')
    lienzo.id = '__lienzo'
    lienzo.style.cssText = [
      'position:absolute', 'inset:0',
      'transform-origin:center center', `transform:scale(${S})`,
    ].join(';')
    while (mesa.firstChild) lienzo.appendChild(mesa.firstChild)
    mesa.appendChild(lienzo)

    /**
     * LOS TRACKS SE COGEN DESPUÉS DE MOVERLOS, Y EL ORDEN NO ES OPINABLE.
     *
     * Re-parentar un elemento CANCELA sus animaciones CSS y el navegador crea
     * unas nuevas. Cogiéndolos antes, `__A` se queda con objetos muertos: fijar
     * su `currentTime` no pinta nada y las animaciones vivas siguen corriendo
     * en tiempo real. El render sale entero, sin un error, con los 720
     * fotogramas cogidos en instantes arbitrarios del ciclo. Pasó: a los 10 s
     * se veía el reinicio en vez de la ficha.
     */
    const anims = mesa.getAnimations({ subtree: true })
    anims.forEach(a => a.pause())
    window.__A = anims

    // Los cuerpos se compensan para que el texto se lea igual tras el encogido.
    const px = n => `${(n / S).toFixed(2)}px`

    const capa = document.createElement('div')
    capa.id = '__capa-editorial'
    capa.style.cssText = [
      'position:absolute', 'left:0', 'right:0', 'bottom:0',
      'height:18%',                       // la banda que la composición deja libre
      'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
      'gap:' + px(7), 'padding:0 8%', 'pointer-events:none', 'z-index:40',
      'text-align:center',
    ].join(';')

    const linea = document.createElement('p')
    // Geist es la familia del sitio; se hereda para no introducir otra.
    linea.style.cssText = [
      'margin:0', `color:${TINTA}`, 'opacity:0',
      `font-size:${px(15)}`, 'line-height:1.5', 'font-weight:500',
      'letter-spacing:0.01em', 'text-wrap:balance',
    ].join(';')
    // Segunda línea, solo para el cierre: el destino al que se va.
    const sub = document.createElement('p')
    sub.style.cssText = [
      'margin:0', `color:${TINTA}`, 'opacity:0',
      `font-size:${px(17)}`, 'line-height:1.4', 'font-weight:600',
      'letter-spacing:0.16em', 'text-indent:0.16em',
    ].join(';')
    capa.appendChild(linea)
    capa.appendChild(sub)
    lienzo.appendChild(capa)   // dentro del lienzo: el texto vive en el área segura

    // Velo del bucle: hermano del lienzo, NO hijo — así no lo encoge el
    // transform y tapa también el anillo de margen.
    const velo = document.createElement('div')
    velo.id = '__velo'
    velo.style.cssText = [
      'position:absolute', 'inset:0', `background:${FONDO_C}`,
      'opacity:0', 'pointer-events:none', 'z-index:60',
    ].join(';')
    mesa.appendChild(velo)
    window.__velo = velo

    /**
     * Capa de las láminas del carrusel. Vive dentro del lienzo —hereda margen
     * y compensación de cuerpo— y sale de en medio en el vídeo (display:none).
     * El color del rótulo NO se elige: se lee del propio hero, del mismo
     * elemento que rotula las piezas, para que sea el iris de la marca y no un
     * hex parecido escrito a mano.
     */
    const rotuloColor = getComputedStyle(document.querySelector('.mesa-pz .apo')).color

    /**
     * LA LÁMINA VA FUERA DEL LIENZO, y no es una preferencia de orden.
     *
     * El lienzo lleva `transform`, así que ABRE UN CONTEXTO DE APILAMIENTO: el
     * `z-index:70` de la lámina compite ahí dentro, no con el velo, que es
     * hermano del lienzo. Resultado: el velo pintaba por encima del titular y
     * el texto salía gris lavado en vez de blanco. La primera prueba salió así,
     * sin ningún error — es la cascada otra vez, una regla correcta ganándole a
     * otra correcta.
     *
     * Colgando de `.mesa` sí compite con el velo y queda por encima. Como no la
     * escala nadie, su padding tiene que absorber a mano el margen del lienzo.
     */
    const lamina = document.createElement('div')
    lamina.id = '__lamina'
    lamina.style.cssText = [
      'position:absolute', 'inset:0', 'display:none', 'flex-direction:column',
      'padding:16% 13%', 'pointer-events:none', 'z-index:70', 'text-align:center',
      'align-items:center',
    ].join(';')

    const lEncima = document.createElement('p')
    lEncima.style.cssText = ['margin:0', `color:${rotuloColor}`, `font-size:${px(13)}`,
      'font-weight:600', 'letter-spacing:0.06em', 'text-indent:0.06em', 'text-transform:uppercase'].join(';')
    const lTitular = document.createElement('p')
    lTitular.style.cssText = ['margin:0', `color:${TINTA}`, `font-size:${px(34)}`,
      'font-weight:600', 'letter-spacing:-0.02em', 'line-height:1.18', 'white-space:pre-line'].join(';')
    const lPie = document.createElement('p')
    lPie.style.cssText = ['margin:0', `color:${TINTA}`, `font-size:${px(16)}`,
      'font-weight:500', 'letter-spacing:0.02em', 'line-height:1.55', 'white-space:pre-line'].join(';')

    /**
     * El logotipo, arriba y FUERA DEL FLUJO (posicion absoluta): la lamina 1
     * centra su contenido y la 3 lo reparte, asi que si el logo fuera un hijo
     * mas se colocaria distinto en cada una. Absoluto queda en el mismo sitio
     * en las dos, que es lo que hace que se lean como una campania.
     */
    const lLogo = document.createElement('div')
    lLogo.style.cssText = [
      'position:absolute', 'left:0', 'right:0', `top:${px(38)}`,
      'display:flex', 'justify-content:center', 'pointer-events:none',
    ].join(';')
    lLogo.innerHTML = LOGO_SVG
    const svgLogo = lLogo.querySelector('svg')
    if (svgLogo) {
      svgLogo.style.height = px(19)
      svgLogo.style.width = 'auto'
      svgLogo.removeAttribute('width'); svgLogo.removeAttribute('height')
    }
    lamina.appendChild(lLogo)

    const bloque = document.createElement('div')
    bloque.style.cssText = ['display:flex', 'flex-direction:column', 'align-items:center', `gap:${px(14)}`].join(';')
    bloque.appendChild(lEncima); bloque.appendChild(lTitular)
    lamina.appendChild(bloque); lamina.appendChild(lPie)
    mesa.appendChild(lamina)   // hermana del velo, NO hija del lienzo — ver arriba

    window.__lamina = { caja: lamina, encima: lEncima, titular: lTitular, pie: lPie }
    window.__pintarLamina = (d) => {
      lamina.style.display = 'flex'
      lamina.style.justifyContent = d.reparto
      lEncima.textContent = d.encima
      lTitular.textContent = d.titular
      lPie.textContent = d.pie
      capa.style.display = 'none'          // el caption del vídeo no pinta aquí
      window.__velo.style.opacity = String(d.velo)
      // Cada lámina trae su propia luz: ver GRADIENTES.
      if (d.grad) {
        const sec = document.querySelector('.mesa').closest('section')
        if (sec) sec.style.setProperty('background', d.grad + ', #F6F7FA', 'important')
      }
    }

    window.__linea = linea
    window.__sub = sub
    window.__pintar = (texto, opacidad, marca, cta) => {
      const l = window.__linea
      window.__sub.textContent = cta || ''
      window.__sub.style.opacity = cta ? String(opacidad) : '0'
      l.textContent = texto
      l.style.opacity = String(opacidad)
      if (marca) {
        l.style.fontSize = px(19)
        l.style.fontWeight = '600'
        l.style.letterSpacing = '0.38em'
        l.style.textIndent = '0.38em'   // compensa el tracking del último carácter
      } else {
        l.style.fontSize = px(15)
        l.style.fontWeight = '500'
        l.style.letterSpacing = '0.01em'
        l.style.textIndent = '0'
      }
    }
    return anims.length
  }, ESCALA, FONDO, TINTA_LAMINA, LOGO_SVG)
  console.log(`  ${tracks} tracks del hero pausados · capa editorial montada\n`)

  if (!tracks) throw new Error('cero tracks capturados: el hero no expone animaciones que pausar')

  /**
   * GUARDA DEL CIERRE. A partir del 94 % el ciclo devuelve las piezas: eso ya
   * es el principio del vídeo entrando. Cualquier caption que siga vivo ahí se
   * superpone al rebobinado y la pieza parece atascada entre dos estados — que
   * es exactamente lo que se vio publicado. Se comprueba aquí para que sea un
   * error de render y no un hallazgo de alguien mirando el vídeo en el móvil.
   */
  for (const c of CAPTIONS) {
    if (c.hasta > REBOBINADO) {
      throw new Error(
        `el caption «${(c.cta ?? c.texto).slice(0, 30)}» dura hasta ${c.hasta}s y el ciclo ` +
        `empieza a rebobinar en ${REBOBINADO.toFixed(2)}s: se encimaría con las piezas que vuelven`)
    }
  }

  /**
   * GUARDA DEL MANDO DEL TIEMPO — se comprueba por EFECTO, no por fe.
   *
   * Que `__A` tenga 39 objetos no significa que sirvan: si están cancelados
   * —basta re-parentar— fijarles `currentTime` no hace nada y el render sale
   * con 720 fotogramas de instantes arbitrarios, sin error. Aquí se mueve el
   * reloj a dos momentos que TIENEN que verse distintos (el expediente está
   * invisible a los 3 s y opaco a los 8 s) y se exige que la pantalla cambie.
   */
  const mando = await page.evaluate(() => {
    const win = document.querySelector('.mesa-win')
    if (!win) return { ok: false, motivo: 'no se encuentra .mesa-win' }
    const leer = ms => {
      window.__A.forEach(a => { try { a.currentTime = ms } catch { /* track sin tiempo */ } })
      return Number(getComputedStyle(win).opacity)
    }
    const a3 = leer(3000), a8 = leer(8000)
    return { ok: a8 - a3 > 0.5, a3, a8 }
  })
  if (!mando.ok) {
    throw new Error(`el reloj de la animación no responde (opacidad del expediente 3s=${mando.a3} 8s=${mando.a8}): ` +
      'los tracks están cancelados — ¿se han cogido antes de mover el contenido al lienzo?')
  }
  console.log(`  mando del tiempo ✓ (expediente ${mando.a3} → ${mando.a8})`)

  const mesa = await page.$('.mesa')

  /**
   * Guarda del encuadre: la caja capturada tiene que seguir siendo la de antes.
   * Si el lienzo hubiera alterado la caja de `.mesa`, la pieza saldría recortada
   * o deformada y ningún paso posterior se quejaría.
   */
  const caja = await mesa.boundingBox()
  if (Math.abs(caja.width / caja.height - 0.8) > 0.005) {
    throw new Error(`la caja capturada ya no es 4:5 (${(caja.width / caja.height).toFixed(4)})`)
  }
  if (Math.abs(caja.width - geometria.w) > 1) {
    throw new Error(`el lienzo cambió la caja de .mesa: ${caja.width.toFixed(1)} vs ${geometria.w.toFixed(1)}`)
  }
  console.log(`  captura ${caja.width.toFixed(0)}×${caja.height.toFixed(0)} · escala ${ESCALA} · margen ${((1 - ESCALA) / 2 * 100).toFixed(1)} %\n`)

  for (let f = 0; SOLO_LAMINAS ? false : f < TOTAL; f++) {
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
      window.__pintar(activo ? activo.texto : '', op, !!(activo && activo.marca), activo && activo.cta)
      // Sin velo en el vídeo: el ciclo cierra con su propio cruce. Ver arriba.
      window.__velo.style.opacity = '0'
    }, ms, CAPTIONS, FUNDIDO)

    await mesa.screenshot({ path: join(FRAMES, `f${String(f).padStart(4, '0')}.png`), captureBeyondViewport: false })

    if (f % 120 === 0) console.log(`  fotograma ${f}/${TOTAL} (${t.toFixed(1)}s)`)
  }
  console.log(`  fotograma ${TOTAL}/${TOTAL} ✓\n`)

  // ── Las dos láminas del carrusel, del mismo escenario y la misma sesión ──
  for (const d of LAMINAS) {
    await page.evaluate((d) => {
      window.__A.forEach(a => { try { a.currentTime = d.t * 1000 } catch { /* track sin tiempo */ } })
      window.__pintarLamina(d)
    }, d)
    await mesa.screenshot({ path: join(RAIZ, d.archivo), captureBeyondViewport: false })
    console.log(`  lámina ${d.archivo} (t=${d.t}s) ✓`)
  }
} finally {
  await browser.close()
}

// Las láminas se capturan a la resolución física del escenario (×2) y bajan a
// 1080×1350 igual que el vídeo: misma reducción, misma nitidez, mismo encuadre.
console.log('  ajustando las láminas del carrusel…')
for (const d of LAMINAS) {
  const origen = join(RAIZ, d.archivo)
  const destino = join(RAIZ, d.archivo.replace('.png', '-1080.png'))
  ff(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-i', origen,
    '-vf', `scale=${ANCHO}:${ALTO}:flags=lanczos`, destino])
  const j = JSON.parse(ff(FFPROBE, ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height:format=size', '-of', 'json', destino]))
  const s = j.streams[0]
  if (s.width !== ANCHO || s.height !== ALTO) {
    throw new Error(`${destino} salió ${s.width}×${s.height} y debía ser ${ANCHO}×${ALTO}`)
  }
  console.log(`  ${d.archivo.replace('.png', '-1080.png')}: ${s.width}×${s.height} · ${(j.format.size / 1e3).toFixed(0)} KB`)
}

if (SOLO_LAMINAS) {
  // Iterar el DISEÑO no necesita rehacer 720 fotogramas ni la codificación
  // `veryslow`. El vídeo se genera cuando las láminas ya están aprobadas.
  console.log('\n--solo-laminas: vídeo y audio omitidos. Láminas en .render-hero/\n')
  process.exit(0)
}

console.log('  construyendo la pista de efectos…')
const SFX = construirPistaSfx()

const entrada = join(FRAMES, 'f%04d.png')
const escala = `scale=${ANCHO}:${ALTO}:flags=lanczos`

console.log('  codificando MASTER…')
ff(FFMPEG, ['-y', '-framerate', String(FPS), '-i', entrada, '-i', SFX,
  '-vf', escala, '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '10',
  '-pix_fmt', 'yuv444p', '-c:a', 'pcm_s16le', '-shortest', join(RAIZ, 'hero-master.mov')])

console.log('  codificando SOCIAL…')
ff(FFMPEG, ['-y', '-framerate', String(FPS), '-i', entrada, '-i', SFX,
  '-vf', escala, '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
  '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
  '-movflags', '+faststart', '-shortest', join(RAIZ, 'hero-social.mp4')])

for (const nombre of ['hero-master.mov', 'hero-social.mp4']) {
  const ruta = join(RAIZ, nombre)
  const j = JSON.parse(ff(FFPROBE, ['-v', 'error',
    '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,pix_fmt,channels,sample_rate:format=duration,size',
    '-of', 'json', ruta]))
  const v = j.streams.find(s => s.codec_type === 'video')
  const a = j.streams.find(s => s.codec_type === 'audio')
  console.log(`  ${nombre}: ${v.width}×${v.height} · ${v.r_frame_rate} · ${v.nb_frames} fotogramas · ${v.pix_fmt} · ${(+j.format.duration).toFixed(3)}s · ${(j.format.size / 1e6).toFixed(1)} MB`)
  // Un vídeo mudo que se creía sonoro es exactamente el fallo que este render
  // venía a corregir: se comprueba que la pista EXISTE, no que se pidió.
  if (!a) throw new Error(`${nombre} salió SIN pista de audio`)
  console.log(`  ${nombre}: audio ${a.codec_name} · ${a.channels} canal(es) · ${a.sample_rate} Hz · ${medirSonoridad(ruta).lufs} LUFS`)
}

console.log('\n  listo:', RAIZ, '\n')
