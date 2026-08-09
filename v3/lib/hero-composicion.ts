/**
 * LA COMPOSICIÓN DEL HERO — un único sistema de coordenadas, calculado.
 *
 * POR QUÉ EXISTE ESTE FICHERO (9-ago-2026). Las coordenadas vivían repartidas
 * entre el markup, estilos en línea y tres media queries, y cada breakpoint
 * heredaba trozos del otro. De ahí salieron cuatro fallos seguidos que el build
 * no ve: `display:flex` ganándole a `hidden`, coordenadas en línea imposibles de
 * sobrescribir, `.mesa-win .dato` ganándole a `.mesa-solo-sm`, y móvil quedándose
 * con dos piezas de seis. Aquí cada composición se declara ENTERA y por
 * separado: ninguna hereda nada de la otra.
 *
 * ══ EL HUB ═════════════════════════════════════════════════════════════════
 *
 * Hay UN solo origen: `hub`, que es el centro geométrico exacto del viewBox y
 * el sitio donde se coloca el PUNTO del símbolo. De él derivan, por cálculo:
 *   · la traslación del símbolo (para que su punto caiga exactamente ahí)
 *   · el final de las seis trazas
 *   · el origen del que nace la ventana del expediente
 * No hay ningún `50 % + algo`. Si el hub se mueve, se mueve todo con él.
 *
 * ══ EL SÍMBOLO CUELGA HACIA ARRIBA, Y NO ES UN FALLO ════════════════════════
 *
 * En el logotipo de VELIA el punto es el VÉRTICE INFERIOR de la V, no su
 * centro. Medido sobre el asset oficial: el centro del dibujo está
 * DIST_PUNTO_A_CENTRO = 135,8 unidades por encima del punto. Así que poner el
 * punto en el centro de la escena deja el dibujo por encima — 36,8 px con el
 * tamaño que tenía. Es geometría de marca, no un descuadre.
 *
 * Se corrige por donde se puede corregir sin tocar el logo:
 *   1. el símbolo baja de escala (0,17 → 0,125), con lo que su desvío cae de
 *      36,8 a ~27 px sin perder legibilidad — y además deja de competir con el
 *      producto, que es el protagonista;
 *   2. el bloque de piezas se desplaza `compensacion` unidades hacia arriba,
 *      calculado para que el baricentro de TODO —las seis piezas más el
 *      dibujo del símbolo, cada uno por su área— caiga sobre el hub.
 * El ajuste es un número que sale de una cuenta, no de mirar la pantalla.
 */

/** Geometría del asset oficial: brand/assets/logo/velia-symbol-iris.svg */
export const SIMBOLO = {
  vb: { w: 313.82071, h: 327.82469 },
  punto: { x: 156.91035, y: 301.22323, r: 26.60145 },
  trazo: 5.79047,
  /** Distancia del punto al centro del DIBUJO (astas + punto, con su trazo). */
  distPuntoACentro: 135.8,
  /** Alto del dibujo completo, en unidades del viewBox del símbolo. */
  altoDibujo: 325.0,
}

export type Pieza = {
  /** Concepto: lo que el archivo APORTA. Los seis existen en todos los tamaños. */
  aporta: string
  nom: string
}

/** Los seis conceptos. No se recortan por breakpoint: se recomponen. */
export const PIEZAS: Pieza[] = [
  { aporta: 'Plazo',       nom: 'Notificación.pdf' },
  { aporta: 'Cláusulas',   nom: 'Contrato.docx' },
  { aporta: 'Cliente',     nom: 'Correo de Martínez' },
  { aporta: 'Antecedente', nom: 'Nota de la vista.txt' },
  { aporta: 'Prueba',      nom: 'Foto del acta.jpg' },
  { aporta: 'Importe',     nom: 'Honorarios.csv' },
]

type Rejilla = {
  /** Proporción de la escena. El viewBox del SVG usa la MISMA, para que las
   *  coordenadas del dibujo y los porcentajes del layout hablen el mismo
   *  idioma: con proporciones distintas el navegador encaja el SVG con bandas
   *  y las trazas dejan de tocar las piezas. */
  vb: { w: number; h: number }
  /** Ancho de cada pieza, en % de la escena. */
  ancho: number
  /** Alto estimado de una pieza, en unidades del viewBox. Sale de medir. */
  alto: number
  /** Centros de columna y de fila, en % de la escena, y en el orden en que se
   *  reparten las seis piezas. */
  columnas: number[]
  filas: number[]
  /** Escala del símbolo. */
  escala: number
}

const REJILLAS: Record<'escritorio' | 'movil', Rejilla> = {
  /** ESCRITORIO — dos filas de tres. La composición aprobada. */
  escritorio: {
    vb: { w: 320, h: 240 },
    ancho: 29,
    alto: 44,
    columnas: [15.5, 50, 84.5],
    filas: [21.5, 78.5],
    escala: 0.125,
  },
  /** MÓVIL — dos COLUMNAS de tres, no la de escritorio aplastada. La escena se
   *  hace vertical (16:20) y el hueco central que dejan las dos columnas es
   *  donde vive el símbolo. Los seis conceptos siguen ahí. */
  movil: {
    vb: { w: 320, h: 400 },
    ancho: 38,
    alto: 56,
    columnas: [21, 79],
    filas: [20, 50, 80],
    escala: 0.115,
  },
}

/**
 * El desorden de partida: el mismo en los dos tamaños, Y ESO NO ES PEREZA.
 *
 * Si estos valores cambiaran con el breakpoint, cambiaria un valor que los
 * @keyframes consumen via var(), y Chrome RECREA la animacion cuando eso
 * ocurre: medido, la pieza saltaba de t=3650 ms a t=1460 al pasar de
 * escritorio a movil. Es decir, la animacion se truncaba y volvia a empezar
 * cada vez que alguien giraba el telefono o redimensionaba la ventana.
 *
 * Como son desplazamientos en cqw —1 % del ancho de la ESCENA— el desorden se
 * ve proporcionalmente igual en los dos tamaños sin necesidad de dos juegos.
 * Lo unico que cambia por breakpoint es , que no vive en ningun
 * keyframe y por tanto reposiciona sin reiniciar nada.
 */
export const DESORDEN = [
  { dx: '1.2cqw',  dy: '-1.05cqw', r: '-6deg' },
  { dx: '-0.8cqw', dy: '1.65cqw',  r: '5deg' },
  { dx: '-1.2cqw', dy: '-0.75cqw', r: '-4deg' },
  { dx: '1.0cqw',  dy: '1.05cqw',  r: '4deg' },
  { dx: '-0.6cqw', dy: '-1.5cqw',  r: '-5deg' },
  { dx: '-1.4cqw', dy: '0.75cqw',  r: '3deg' },
] as const

export type Composicion = {
  vb: { w: number; h: number }
  hub: { x: number; y: number }
  simbolo: { escala: number; tx: number; ty: number }
  /** Posición final (ordenada) de cada pieza, en % de la escena. */
  destinos: { x: number; y: number }[]
  trazas: { d: string; len: number }[]
  /** Cuánto se subió el bloque de piezas para equilibrar la masa del símbolo. */
  compensacion: number
}

function construir(r: Rejilla): Composicion {
  const hub = { x: r.vb.w / 2, y: r.vb.h / 2 }

  // El símbolo, colocado para que su PUNTO caiga exactamente en el hub.
  const simbolo = {
    escala: r.escala,
    tx: hub.x - SIMBOLO.punto.x * r.escala,
    ty: hub.y - SIMBOLO.punto.y * r.escala,
  }

  // Cuánto queda el dibujo por encima del hub, en unidades del viewBox.
  const desvioSimbolo = SIMBOLO.distPuntoACentro * r.escala

  // Reparto de las seis piezas por la rejilla. Dos filas de tres en
  // escritorio; tres filas de dos en móvil. El orden recorre primero las
  // columnas para que los conceptos queden repartidos, no apilados.
  const celdas: { x: number; y: number }[] = []
  for (const fy of r.filas) for (const fx of r.columnas) celdas.push({ x: fx, y: fy })

  // COMPENSACIÓN ÓPTICA, calculada: el baricentro del conjunto —seis piezas
  // más el dibujo del símbolo, cada uno pesando su área— debe caer en el hub.
  // El símbolo está por encima, así que las piezas bajan lo justo.
  const areaPieza = (r.ancho / 100) * r.vb.w * r.alto
  const anchoSimbolo = SIMBOLO.vb.w * r.escala
  const areaSimbolo = anchoSimbolo * SIMBOLO.altoDibujo * r.escala * 0.4 // 0.4 = su opacidad
  const masaPiezas = areaPieza * celdas.length
  const yPiezas = celdas.reduce((a, c) => a + (c.y / 100) * r.vb.h, 0) / celdas.length
  const ySimbolo = hub.y - desvioSimbolo
  // baricentro = (masaPiezas·(yPiezas+c) + areaSimbolo·ySimbolo) / total = hub.y
  const compensacion =
    ((hub.y * (masaPiezas + areaSimbolo)) - masaPiezas * yPiezas - areaSimbolo * ySimbolo) / masaPiezas

  const destinos = celdas.map(c => ({
    x: c.x - r.ancho / 2,
    y: (c.y / 100) * r.vb.h + compensacion - r.alto / 2,
  })).map(d => ({ x: d.x, y: (d.y / r.vb.h) * 100 }))

  // Las trazas salen del centro de cada pieza ya ordenada y mueren en el borde
  // del punto. La tarjeta se pinta ENCIMA, así que la línea parece nacer de su
  // borde. El radio de parada sale del propio punto, no de un número a ojo.
  const radioParada = SIMBOLO.punto.r * r.escala + 2.5
  const trazas = celdas.map(c => {
    const px = (c.x / 100) * r.vb.w
    const py = (c.y / 100) * r.vb.h + compensacion
    const dx = hub.x - px, dy = hub.y - py
    const len = Math.hypot(dx, dy) || 1
    const fx = hub.x - (dx / len) * radioParada
    const fy = hub.y - (dy / len) * radioParada
    return {
      d: `M${px.toFixed(1)} ${py.toFixed(1)} L${fx.toFixed(1)} ${fy.toFixed(1)}`,
      len: Math.ceil(len),
    }
  })

  return { vb: r.vb, hub, simbolo, destinos, trazas, compensacion: +compensacion.toFixed(2) }
}

export const COMPOSICION = {
  escritorio: construir(REJILLAS.escritorio),
  movil: construir(REJILLAS.movil),
}
