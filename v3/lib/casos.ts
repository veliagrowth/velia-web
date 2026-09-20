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
    evidencia: 'documentado',
  },
  {
    nombre: 'KREA HOGAR',
    dominio: 'kreahogar.com',
    que: 'Sofás y colchones fabricados en España, con tienda en Lleida y venta online.',
    velia: 'Trabajo de VELIA en su presencia digital: web, contenido y campañas.',
    tipo: 'Presencia digital',
    evidencia: 'parcial',
  },
  {
    nombre: 'Method 9989',
    dominio: 'method9989.com',
    que: 'Proyecto de marca y lanzamientos. Hoy su web es el teaser del próximo.',
    velia: 'VELIA construye y mantiene la web, y despliega cada cambio.',
    tipo: 'Web construida y mantenida',
    evidencia: 'documentado',
  },
  {
    nombre: 'The Drop Agency',
    dominio: 'thedrop.agency',
    que: 'Agencia creativa y de management de artistas. Su web está en construcción.',
    velia:
      'Apoyo de VELIA en producción creativa. La transformación de sus procesos está prevista, no hecha.',
    tipo: 'Trabajo creativo',
    evidencia: 'parcial',
  },
]
