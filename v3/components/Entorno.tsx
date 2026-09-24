import Reveal from '@/components/Reveal'
import RevealRect from '@/components/motion/RevealRect'
import EscaleraPixel from '@/components/os/EscaleraPixel'
import { ESCALONES, REGLA_ENTORNO_LINEAS } from '@/lib/entorno'

/**
 * El entorno VELIA del cliente — momento 5 de la Home.
 *
 * Va DESPUÉS de los cuatro proyectos y no antes, y eso no es orden de lectura:
 * es el argumento. Quien acaba de ver cuatro trabajos que no se parecen en nada
 * ya tiene la pregunta hecha —«¿y esto qué forma tiene para mí?»—, y esta
 * sección la contesta. Puesta antes, sería la presentación de un producto.
 *
 * ── LOS ESTRATOS (22-sep-2026) ────────────────────────────────────────────
 * En escritorio, a la izquierda, un diagrama que se construye de abajo arriba
 * mientras se leen los escalones: cuatro plantas, cada una más estrecha que la
 * de debajo, que se encienden al llegar su escalón y se quedan encendidas. Es
 * la palabra «escalón» dibujada, y es la sección entendiéndose antes de
 * leerla.
 *
 * Lo que NO es: una captura del portal, un mockup ni un panel con datos. No
 * enseña pantallas que no existen en esa forma; enseña la estructura del propio
 * argumento. Cada planta se llama como su escalón.
 *
 * SIN JAVASCRIPT NUEVO. Cada escalón ya es un `Reveal` que marca data-visible
 * al entrar; el CSS enciende su estrato con `.entorno:has(.escalon-N[…])`
 * (`globals.css`, bloque 4). Sin JS, los cuatro están encendidos: el entorno
 * entero, que es el estado seguro.
 *
 * ── EL PERSONAJE (24-sep-2026) ────────────────────────────────────────────
 * Sobre esos mismos estratos sube un personaje pixel, `components/os/`. No es
 * una animación aparte: su posición es una función del scroll de la lista, así
 * que va por el escalón que se está leyendo y baja si se sube la página.
 *
 * Cuelga DENTRO del contenedor `aria-hidden` y no toca el contenido: si no hay
 * JS, si el usuario pidió menos movimiento o si la columna está oculta por
 * ancho, la sección se lee exactamente igual. Es adorno, y tiene que poder
 * desaparecer sin que se note en la información.
 *
 * El diagrama es `aria-hidden`: repite en dibujo lo que la lista dice con
 * palabras, y un lector de pantalla no necesita oírlo dos veces. En móvil y en
 * tableta no está —no hay columna para él— y cada fila conserva su escala de
 * puntos, que dice lo mismo en pequeño.
 *
 * ── LA FRASE QUE SOSTIENE LA SECCIÓN VIENE DE FUERA ───────────────────────
 * `regla` llega desde `app/page.tsx` pasada por el gate de Product Truth. Si el
 * claim `modularEnvironment` dejara de estar verificado, llega `null` y el
 * cierre entero no se pinta. La regla en grande se revela con barra: es un
 * enunciado corto de dos líneas, exactamente para lo que existe esa técnica.
 */
export default function Entorno({ regla }: { regla: string | null }) {
  return (
    <div className="entorno mt-10 md:mt-14 lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-x-16">
      {/* ── Estratos · sólo escritorio ─────────────────────────────────── */}
      <div className="hidden lg:block" aria-hidden="true">
        {/* `sticky` YA es un ancestro posicionado, así que el personaje se
            coloca contra esta caja y mide los estratos en el mismo sistema de
            coordenadas. No añadir `relative` aquí: emitiría dos `position` y
            cuál gana lo decide el orden del CSS generado, no el del markup. */}
        <div className="sticky top-28 flex flex-col-reverse gap-2 pt-9">
          <EscaleraPixel />
          {ESCALONES.map((e, i) => (
            <div
              key={e.n}
              className={`estrato estrato-${i + 1} flex h-14 items-center gap-4 border px-5 text-[13px] font-600 tracking-[0.02em]`}
              style={{ width: `${100 - i * 9}%` }}
            >
              {/* Sin `opacity-*`: multiplica el color y la guarda de contraste
                  no lo ve, porque mide el alfa del color y no la opacidad del
                  elemento. El número se distingue por peso, no por desvaído. */}
              <span className="tabular-nums font-500">{e.n}</span>
              <span>{e.corto}</span>
            </div>
          ))}
        </div>
      </div>

      <ul>
        {ESCALONES.map((e, i) => (
          <Reveal as="li" key={e.n} delay={i === 0 ? 0 : 60} className={`hairline escalon-${i + 1}`}>
            <div className="grid gap-x-10 gap-y-3 py-7 md:py-8 md:grid-cols-[auto_1fr]">
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2.5">
                <span className="indice text-slate" aria-hidden="true">
                  {e.n}
                </span>
                {/* La escala de puntos: en escritorio la sustituye el diagrama. */}
                <span className="flex gap-1.5 lg:hidden" aria-hidden="true">
                  {ESCALONES.map((_, j) => (
                    <span
                      key={j}
                      className={
                        j <= i
                          ? 'h-1.5 w-1.5 rounded-full bg-gold-ink'
                          : 'h-1.5 w-1.5 rounded-full ring-1 ring-inset ring-slate/50'
                      }
                    />
                  ))}
                </span>
              </div>

              <div>
                {e.encadena && (
                  <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65 mb-2">
                    {e.encadena}
                  </p>
                )}
                <h3 className="text-xl md:text-2xl font-600 tracking-[-0.02em] text-void max-w-[22ch]">
                  {e.titulo}
                </h3>
              </div>

              {/* En tableta el cuerpo baja bajo el índice (dos columnas, tercer
                  hijo: sin el span estrujaba el titular). En escritorio vuelve
                  a la columna del texto, porque la del índice ya es estrecha. */}
              <div className="md:col-span-2 lg:col-span-1 lg:col-start-2">
                <p className="text-[15px] leading-[1.6] text-void/65 max-w-prose">{e.cuerpo}</p>
                <p className="mt-3 text-[13px] leading-[1.7] text-void/65">{e.piezas.join(' · ')}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>

      {regla && (
        <div className="mt-10 md:mt-12 lg:col-span-2">
          <RevealRect
            al="entrar"
            como="p"
            lineas={REGLA_ENTORNO_LINEAS}
            className="text-[clamp(1.55rem,2.9vw,2.5rem)] font-600 tracking-[-0.025em] leading-[1.18] text-void"
          />
          <Reveal delay={200}>
            <p className="mt-4 text-[15px] leading-[1.6] text-void/65 max-w-prose">
              {regla} No es una política: es cómo está construido el sistema.
            </p>
          </Reveal>
        </div>
      )}
    </div>
  )
}
