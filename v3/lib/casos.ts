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
  /**
   * Qué entorno VELIA tiene este proyecto — o por qué no tiene ninguno.
   *
   * ── AÑADIDO EL 22-sep-2026, Y ES LA COLUMNA QUE MÁS TRABAJO HACE ────────
   * Sin ella, los cuatro proyectos se leen como cuatro encargos equivalentes, y
   * la idea de que VELIA construye lo que hace falta y nada más se queda en una
   * frase. Con ella, la lista misma es la prueba: dos de los cuatro no tienen
   * entorno de gestión, y uno lo tiene entero.
   *
   * ⚠️ NO SE ESCRIBE DE MEMORIA. Cada línea se contrasta contra
   * `tenants.active_modules` en la base de producción (medido el 22-sep):
   * Cónsul Jurídico nueve módulos con `portal` y `legal` dentro; METHOD NUMBERS
   * tres, sin `portal`; KREA HOGAR y The Drop Agency no son tenants. Decir «no
   * tiene entorno» de quien sí lo tiene sería tan falso como lo contrario, y es
   * más fácil de cometer: el impulso es rellenar las cuatro filas por simetría.
   *
   * Y se dice en positivo. «No necesitó un entorno de gestión» es un hecho sobre
   * el encargo, no una carencia del cliente.
   */
  entorno: string
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
    entorno:
      'Entorno completo: el trabajo del despacho vive dentro, y sus propios clientes tienen un espacio donde seguir sus asuntos, sus citas y sus mensajes.',
    evidencia: 'documentado',
  },
  {
    nombre: 'KREA HOGAR',
    dominio: 'kreahogar.com',
    que: 'Sofás y colchones fabricados en España, con tienda en Lleida y venta online.',
    velia: 'Trabajo de VELIA en su presencia digital: web, contenido y campañas.',
    tipo: 'Presencia digital',
    entorno: 'Sin entorno de gestión: el encargo era la presencia digital, y no hacía falta más.',
    evidencia: 'parcial',
  },
  {
    nombre: 'Method 9989',
    dominio: 'method9989.com',
    que: 'Proyecto de marca y lanzamientos. Hoy su web es el teaser del próximo.',
    velia: 'VELIA construye y mantiene la web, y despliega cada cambio.',
    tipo: 'Web construida y mantenida',
    entorno:
      'Sin portal: lo que necesita hoy es que la web esté en pie y se despliegue sola. El entorno crecerá cuando lo haga el proyecto.',
    evidencia: 'documentado',
  },
  {
    nombre: 'The Drop Agency',
    dominio: 'thedrop.agency',
    que: 'Agencia creativa y de management de artistas. Su web está en construcción.',
    velia:
      'Apoyo de VELIA en producción creativa. La transformación de sus procesos está prevista, no hecha.',
    tipo: 'Trabajo creativo',
    entorno: 'Sin entorno todavía: el trabajo hecho es creativo, y la transformación está prevista.',
    evidencia: 'parcial',
  },
]
