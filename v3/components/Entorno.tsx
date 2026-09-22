import Reveal from '@/components/Reveal'
import { ESCALONES, REGLA_ENTORNO } from '@/lib/entorno'

/**
 * El entorno VELIA del cliente — momento nuevo de la Home (22-sep-2026).
 *
 * Va DESPUÉS de los cuatro proyectos y no antes, y eso no es orden de lectura:
 * es el argumento. Quien acaba de ver cuatro trabajos que no se parecen en nada
 * ya tiene la pregunta hecha —«¿y esto qué forma tiene para mí?»—, y esta
 * sección la contesta. Puesta antes, sería la presentación de un producto.
 *
 * ── POR QUÉ NO SON TARJETAS, OTRA VEZ ─────────────────────────────────────
 * Cuatro cajas iguales de menos a más es literalmente la forma de una tabla de
 * precios, y aquí no hay planes que comparar. La composición es la editorial que
 * ya usan `Capacidades` y los principios de `/sobre-velia`: índice a la
 * izquierda, hairline, el ojo lee una secuencia.
 *
 * ── EL ÚNICO GESTO GRÁFICO, Y DE DÓNDE SALE ───────────────────────────────
 * Los puntos del índice —llenos los alcanzados, huecos los que faltan— no son un
 * adorno nuevo: son el mismo lenguaje de `.estado` («en marcha» lleno / «en
 * construcción» hueco) que la web ya usa en `/sobre-velia`. Reutilizar el gesto
 * en vez de inventar otro es lo que hace que el sitio parezca uno solo. Van
 * `aria-hidden`: lo que dicen ya lo dice el número, y un lector de pantalla no
 * necesita oír cuatro círculos.
 *
 * ── LA FRASE QUE SOSTIENE LA SECCIÓN VIENE DE FUERA ───────────────────────
 * `regla` llega desde `app/page.tsx` pasada por el gate de Product Truth. Si el
 * claim `modularEnvironment` dejara de estar verificado, llega `null` y el
 * bloque entero no se pinta — no queda un hueco ni una frase suelta afirmando
 * algo sin respaldo. Es el mismo patrón de `/seguridad`.
 */
export default function Entorno({ regla }: { regla: string | null }) {
  return (
    <div className="mt-14 md:mt-20">
      <ul>
        {ESCALONES.map((e, i) => (
          <Reveal as="li" key={e.n} delay={i === 0 ? 0 : 60} className="hairline">
            <div className="grid gap-x-10 gap-y-4 py-10 md:py-14 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1.1fr_0.9fr]">
              {/* El índice y, debajo, la escala. `items-start` para que el
                  número no se centre respecto a una fila alta. */}
              <div className="flex flex-col gap-3">
                <span className="indice text-slate" aria-hidden="true">
                  {e.n}
                </span>
                <span className="flex gap-1.5" aria-hidden="true">
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
                {/* «Y además» encadena con el escalón anterior: es lo que
                    convierte cuatro filas en una acumulación y no en un menú de
                    cuatro opciones excluyentes. El primero no lo lleva. */}
                {e.encadena && (
                  <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65 mb-2">
                    {e.encadena}
                  </p>
                )}
                <h3 className="text-xl md:text-2xl font-600 tracking-[-0.02em] text-void max-w-[22ch]">
                  {e.titulo}
                </h3>
              </div>

              {/* `md:col-span-2` por lo mismo que en `Capacidades`: en tablet la
                  rejilla tiene dos columnas y éste es el TERCER hijo, así que sin
                  el span cae bajo la columna `auto` del índice y la ensancha
                  hasta estrujar el titular. Se rompía a 768 y se veía bien a 390
                  y a 1440, que es la forma en que este bug pasa desapercibido. */}
              <div className="md:col-span-2 lg:col-span-1 lg:pt-1">
                <p className="text-[15px] leading-[1.6] text-void/65 max-w-prose">{e.cuerpo}</p>
                {/* Texto corrido con puntos medios, nunca píldoras: una fila de
                    chips convierte un entorno en un catálogo de funciones. */}
                <p className="mt-4 text-[13px] leading-[1.7] text-void/65">{e.piezas.join(' · ')}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>

      {regla && (
        <Reveal delay={100}>
          <p className="mt-10 md:mt-12 text-lg md:text-xl font-500 tracking-[-0.01em] leading-[1.4] text-void max-w-[42ch]">
            {REGLA_ENTORNO}
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] text-void/65 max-w-prose">
            {regla} No es una política que prometamos cumplir: es cómo está construido el
            sistema, y por eso hay clientes con casi todo encendido y clientes con tres
            piezas.
          </p>
        </Reveal>
      )}
    </div>
  )
}
