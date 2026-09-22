/**
 * El entorno VELIA de un cliente — SSoT de lo que la web publica sobre él.
 *
 * ── POR QUÉ ESTA SECCIÓN EXISTE (22-sep-2026) ─────────────────────────────
 * Hasta hoy la web contaba que VELIA construye y opera infraestructura, y no
 * decía en ningún sitio DÓNDE ve el cliente eso que se construye y se opera. La
 * única mención del portal vivía enterrada en una lista de `/sobre-velia`. Es el
 * diferenciador más fuerte del modelo y no estaba dicho.
 *
 * ── LA TRAMPA QUE HAY QUE ESQUIVAR ────────────────────────────────────────
 * Una escala acumulativa se lee como una tabla de planes si no se tiene cuidado:
 * cuatro filas de menos a más son exactamente la forma de un pricing de SaaS. Y
 * convertir a VELIA en un SaaS con niveles es lo contrario de lo que el modelo
 * es. Tres decisiones lo evitan:
 *
 *   1. Los escalones NO tienen nombre de producto («Básico», «Pro»). Tienen el
 *      nombre de lo que el negocio mete dentro: ver, publicar, operar, el
 *      negocio entero.
 *   2. No hay precio, ni «desde», ni comparativa de columnas, ni check-marks.
 *      Una tabla de palomitas es la firma visual de lo que no somos.
 *   3. La escala no se recorre de abajo arriba por defecto. La regla publicada
 *      es la contraria: se construye el escalón que hace falta, y sólo ése.
 *
 * ── QUÉ SE PUEDE AFIRMAR, Y CON QUÉ DETRÁS ────────────────────────────────
 * La afirmación que sostiene toda la sección —que cada cliente tiene activado
 * sólo lo que usa— NO es una promesa comercial: es la columna
 * `tenants.active_modules`, validada por un trigger de Postgres antes de cada
 * escritura. Está registrada como `modularEnvironment` en `verified-claims.ts`,
 * con su medición del 22-sep y su fuente. Si algún día dejara de ser cierta, el
 * claim cae y la frase desaparece de la página sola.
 *
 * ── LO QUE DELIBERADAMENTE NO ENTRA AQUÍ ──────────────────────────────────
 * · Capturas del portal. Las que existen llevan datos de un cliente real
 *   dentro. Un mockup inventado sería peor: sería enseñar un producto que en esa
 *   forma no existe, que es justo el reproche que esta web le hace a otros.
 * · Accesos de colaboradores externos (productoras, agencias, filmmakers). El
 *   portal tiene roles, pero hay un defecto abierto en el cierre de puerta de
 *   `ownerOnly` — cinco de siete pantallas marcadas no cierran. Publicar hoy
 *   «acceso acotado para terceros» sería vender una garantía que está rota. Va
 *   en el registro de lo que se está construyendo, no en el de lo que hay.
 * · Números de módulos por cliente. El contraste es público; el inventario de
 *   la configuración de un cliente, no.
 */

export type Escalon = {
  n: string
  /** Lo que el negocio mete dentro en este escalón. Un verbo, no un plan. */
  titulo: string
  /** La frase que encadena con el anterior. El primero no la lleva. */
  encadena?: string
  cuerpo: string
  /** Las piezas reconocibles. Texto corrido separado por puntos medios. */
  piezas: readonly string[]
}

export const ESCALONES: readonly Escalon[] = [
  {
    n: '01',
    titulo: 'Ver lo que está pasando',
    cuerpo:
      'El escalón mínimo, y para muchos negocios el único que hace falta. Un sitio donde está lo que VELIA tiene en marcha, lo entregado, lo que se decidió y lo que se ha medido. Deja de haber una carpeta compartida, un hilo de correo y tres conversaciones sueltas.',
    piezas: ['Entregables', 'Decisiones', 'Lo medido', 'Comunicación'],
  },
  {
    n: '02',
    titulo: 'Lo que el negocio dice hacia fuera',
    encadena: 'Y además',
    cuerpo:
      'La web y el contenido dejan de ser un encargo puntual y pasan a ser algo que se gobierna desde dentro: qué se publica, cuándo, y qué pasó después de publicarlo.',
    piezas: ['Web', 'Contenido', 'Publicaciones', 'Formularios'],
  },
  {
    n: '03',
    titulo: 'El trabajo que entra todos los días',
    encadena: 'Y además',
    cuerpo:
      'Quién ha preguntado, en qué punto está, qué hay que hacer y cuándo. Es el escalón donde la automatización empieza a notarse, porque ya hay un sitio al que llega el trabajo y del que sale.',
    piezas: ['Contactos', 'Oportunidades', 'Citas', 'Seguimiento'],
  },
  {
    n: '04',
    titulo: 'El negocio por dentro',
    encadena: 'Y además',
    cuerpo:
      'Lo propio de cada actividad, que no se parece a la de al lado: expedientes en un despacho, pedidos en una tienda. Y, cuando tiene sentido, un espacio para los clientes de tu cliente.',
    piezas: ['Lo propio del sector', 'Operación diaria', 'Un espacio para sus clientes'],
  },
]

/**
 * La regla que impide leer la escala como una tabla de planes. Va debajo, en
 * grande, y es la frase que más trabajo hace de toda la sección.
 */
export const REGLA_ENTORNO = 'Se construye el escalón que hace falta. No el siguiente.'
