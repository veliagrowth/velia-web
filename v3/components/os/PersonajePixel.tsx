/**
 * El personaje que sube la escalera del entorno.
 *
 * ── ES UN DISENO ORIGINAL, Y ESO NO ES UNA FORMALIDAD ─────────────────────
 * No hay ni un pixel copiado. No es un sprite extraido de ningun juego, no
 * imita a ningun personaje con dueno y no se parece a ninguno: es un operario
 * con casco, mochila y botas, que es lo que tiene que ser —alguien que sube a
 * trabajar— y ademas es lo que evita el unico problema serio que esta pieza
 * podia tener. El §22 del encargo lo pide expresamente y hay que mantenerlo:
 * el dia que alguien «mejore» esto acercandolo a un personaje conocido, deja de
 * ser un adorno y pasa a ser un asunto legal.
 *
 * La referencia es la ERA, no un titulo: pixel grande, paleta corta, silueta
 * legible a 40 px. Estetica de plataformas de los noventa.
 *
 * ── POR QUE SVG Y NO UNA IMAGEN (§67) ─────────────────────────────────────
 * · No anade una peticion de red ni un fichero al repositorio. Son ~1 kB de
 *   marcado que viaja dentro del HTML ya servido.
 * · Se pinta con los tokens de marca. Un PNG con el Iris quemado dentro se
 *   queda desactualizado el dia que cambie la paleta, y nadie lo sabra.
 * · `crispEdges` mantiene el pixel duro a cualquier escala. Un PNG pequeno
 *   ampliado se interpola y se vuelve una mancha; uno grande pesa.
 * · No depende de nada externo, que es la condicion del §67.
 *
 * ── LA REJILLA ───────────────────────────────────────────────────────────
 * 12 x 16. Se lee tal cual en el codigo: cada letra es un color de `PALETA` y
 * el punto es transparente. Editarlo es mover letras, no tocar coordenadas.
 * Sube hacia la IZQUIERDA: los estratos se estrechan hacia arriba, asi que el
 * recorrido va en esa direccion.
 */

/** Cada letra, su color. Todos salen de la paleta de marca. */
const PALETA: Record<string, string> = {
  H: '#6065DC', // Iris 600 — casco
  V: '#0D1017', // Night — visor
  F: '#F6F7FA', // Pearl Cloud — el brillo del visor, y SOLO ahí
  M: '#8D90FA', // Iris 400 — mochila
  T: '#1B1F2A', // Deep Graphite — torso
  S: '#0D1017', // Night — piernas y botas
}

/**
 * ⚠️ LLEVA CASCO CON VISOR, Y NO ES UNA ELECCION ESTETICA ──────────────────
 * La primera version tenia cara: piel en Pearl Cloud (#F6F7FA) con un ojo
 * oscuro. Sobre el papel se leia perfecta... y en pantalla no se veia, porque
 * Pearl Cloud es EXACTAMENTE el color de fondo de esta seccion. La cara no
 * estaba mal dibujada: estaba dibujada del color del fondo, asi que el
 * personaje aparecia con un agujero en la cabeza. Nada falla, nada avisa —el
 * pixel esta ahi, con su color correcto— y solo se ve mirandolo.
 *
 * El visor lo resuelve por construccion: Night sobre Iris contrasta caiga donde
 * caiga, y ademas es lo que llevaria alguien que sube a trabajar. El unico
 * pixel Pearl que queda es el brillo del visor, y ese va RODEADO de Night.
 *
 * La regla, para quien edite esta rejilla: ningun pixel claro puede tocar el
 * borde de la silueta. Si hace falta uno, va rodeado de un tono oscuro.
 */
const REJILLA = [
  '....HHHH....',
  '..HHHHHHHH..',
  '.HHHHHHHHHH.',
  '.HVVVVVVVHH.',
  '.HVFVVVVVHH.',
  '.HHVVVVVHHH.',
  '..HHHHHHHH..',
  '..TTTTTTTTM.',
  '.TTTTTTTTTM.',
  '.TTTTTTTTTM.',
  '..TTTTTTTT..',
  '..TTTTTTTT..',
  '...SS..SS...',
  '...SS..SS...',
  '..SSS..SSS..',
  '.SSSS..SSSS.',
] as const

export const REJILLA_ANCHO = 12
export const REJILLA_ALTO = 16

export default function PersonajePixel({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${REJILLA_ANCHO} ${REJILLA_ALTO}`}
      shapeRendering="crispEdges"
      className={className}
      focusable="false"
      aria-hidden="true"
    >
      {REJILLA.map((fila, y) =>
        fila.split('').map((c, x) =>
          c === '.' ? null : (
            /* `+0.02` de solape: a ciertos zooms el navegador redondea cada
               rect por su cuenta y aparecen costuras de fondo entre píxeles
               que deberían tocarse. */
            <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PALETA[c]} />
          ),
        ),
      )}
    </svg>
  )
}
