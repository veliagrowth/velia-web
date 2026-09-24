/**
 * Los proyectos que la Home enseña como trabajo real.
 *
 * ── LA REGLA DE ESTA LISTA ────────────────────────────────────────────────
 * Cada línea publicada tiene que poder demostrarse. Lo que se publica de cada
 * proyecto es: qué es (comprobable abriendo su web), qué hizo VELIA (respaldado
 * por evidencia interna) y dónde mirarlo. Nada más.
 *
 * NI UNA CIFRA. La web de la etapa agencia publicaba de estos mismos proyectos
 * «16.100 seguidores», «133K visualizaciones», «4,9★ con 153 reseñas», «de 12 a
 * 25 artistas en 4 meses» y «el 60 % del trabajo operativo corre solo». Las
 * capturas de las tres primeras siguen en el repositorio (`img/cases/`), así que
 * existieron; pero son cifras de plataformas de terceros, de julio de 2026, que
 * hoy nadie puede comprobar desde fuera, y las dos últimas no tienen detrás
 * ninguna evidencia localizable. Un número que no se puede comprobar no es una
 * prueba: es una afirmación. Aquí no hay ninguno.
 *
 * ── `evidencia`: PARA TRABAJO INTERNO, NO SE PINTA ────────────────────────
 * Dice cuánta evidencia respalda lo que se publica de cada proyecto, para que
 * la próxima revisión sepa dónde mirar primero:
 *
 *   'documentado' la relación con VELIA está respaldada por evidencia interna
 *                 localizable (repositorio, infraestructura, cliente activo).
 *   'parcial'     hay evidencia de un trabajo, pero acotada en el tiempo o en
 *                 su alcance. Se publica la versión mínima y en pasado.
 *
 * Si algún día un proyecto no llegara ni a 'parcial', no se publica: un caso
 * simple y honesto es mejor que una historia completa inventada.
 *
 * ── QUÉ CAMBIÓ EL 24-sep-2026 (tarde) ────────────────────────────────────
 * Sale el campo `entorno` entero, con su booleano y su punto. Contaba, proyecto
 * a proyecto, qué NO tenía cada uno —«sin entorno», «sin portal»— y después, ya
 * en positivo, qué sí. Las dos versiones compartían el mismo defecto: hablaban
 * del alcance del encargo, que es una conversación interna, delante de alguien
 * que ha venido a ver trabajo. Un proyecto se presenta por lo que es, no por lo
 * que no incluyó.
 *
 * Lo que se pierde —la idea de que se construye sólo el escalón que hace falta—
 * no se pierde: es la sección `#entorno` de la Home entera, sostenida por el
 * claim `modularEnvironment`. Aquí sobraba.
 *
 * Y KREA HOGAR deja de describirse por su tienda. El valor no es que VELIA le
 * haya hecho un comercio: es que su infraestructura está VIVA y operada, y por
 * eso el negocio no paga por mantener algo que sólo existe. La palabra Shopify
 * sale del texto público: nombra una herramienta, y lo que se vende no es la
 * herramienta.
 */

export type Caso = {
  nombre: string
  /** Sin protocolo: es a la vez el texto visible del enlace y su destino. */
  dominio: string
  /** Qué es, comprobable abriendo esa web. */
  que: string
  /** Qué hizo o hace VELIA. Respaldado por evidencia interna. */
  velia: string
  /** Rótulo corto del tipo de trabajo. */
  tipo: string
  /**
   * El caso que MANDA en la composición. Sólo uno. Ocupa la fila entera y se
   * pinta más grande; los otros tres son contrapunto.
   *
   * No es un capricho de maquetación: cuatro celdas iguales piden comparar
   * cuatro proyectos que no son comparables —uno es un cliente con
   * infraestructura operada y otro un trabajo creativo puntual—, y la web lo
   * dice desde hace meses en un comentario mientras los pintaba iguales.
   */
  principal?: true
  evidencia: 'documentado' | 'parcial'
}

export const CASOS: readonly Caso[] = [
  {
    nombre: 'Cónsul Jurídico',
    dominio: 'consuljuridico.com',
    que: 'Despacho y gestoría en Fraga (Huesca): extranjería y nacionalidad, mercantil, laboral y familia.',
    velia:
      'Cliente. VELIA construyó su infraestructura —captación, expedientes, documentos, agenda y un portal para sus propios clientes— y la sigue operando.',
    tipo: 'Infraestructura construida y operada',
    principal: true,
    evidencia: 'documentado',
  },
  {
    nombre: 'KREA HOGAR',
    dominio: 'kreahogar.com',
    que: 'Sofás y colchones fabricados en España. Tienda en Lleida y venta online.',
    velia:
      'Su infraestructura digital no es algo entregado y terminado: está viva. VELIA la mantiene, la mejora y la opera —catálogo, ofertas, contenido y la relación con sus clientes— para que el negocio no pague por sostener algo que simplemente existe.',
    tipo: 'Presencia digital y comercio',
    evidencia: 'parcial',
  },
  {
    nombre: 'METHOD NUMBERS',
    dominio: 'method9989.com',
    que: 'Marca y lanzamientos. Hoy su web es el teaser del próximo.',
    velia: 'VELIA construye y mantiene la web, y despliega cada cambio.',
    tipo: 'Web construida y mantenida',
    evidencia: 'documentado',
  },
  {
    nombre: 'THE DROP AGENCY',
    dominio: 'thedrop.agency',
    que: 'Agencia creativa y de management de artistas.',
    velia: 'VELIA acompaña su producción creativa: piezas, campañas y el material con el que trabajan sus artistas.',
    tipo: 'Trabajo creativo',
    evidencia: 'parcial',
  },
]
