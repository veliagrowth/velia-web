'use client'

import { useId, useMemo, useState } from 'react'
import MacWindowFrame, { StatusPill } from '@/components/os/MacWindowFrame'
import { ESPACIOS, MODULOS, ROTULO_ESTADO, type ModuloId } from '@/lib/os-demo'

/**
 * El especimen de VELIA OS del hero.
 *
 * ── QUE TIENE QUE PROVOCAR ────────────────────────────────────────────────
 * «Esto es el sistema con el que VELIA opera empresas», y no «esto es un
 * software que puedo comprar». La diferencia la marcan tres decisiones:
 *
 *   1. El espacio de trabajo es VELIA, y DENTRO estan los clientes. Un SaaS
 *      ensenaria un espacio y diria «el tuyo»; aqui se ve la consola del que
 *      opera, con cuatro negocios abiertos a la vez.
 *   2. No hay ni un control de producto: ni «crear», ni «invitar», ni ajustes,
 *      ni plan, ni precio, ni sesion. Nada que sugiera que esto se contrata.
 *   3. El vocabulario es el del portal real (§56), no el de una landing.
 *
 * ── ES INTERACTIVO Y NO LLAMA A NADIE ─────────────────────────────────────
 * Cambiar de cliente, de modulo o de proyecto es `useState` sobre un objeto
 * literal de `lib/os-demo.ts`. Cero `fetch`, cero endpoints —el §17 lo prohibe
 * expresamente—, cero datos reales. Lo unico que cruza la red de este
 * componente es su propio JavaScript.
 *
 * ── ACCESIBILIDAD (§64) ───────────────────────────────────────────────────
 * Un lector de pantalla tiene que enterarse de DOS cosas antes que de ninguna
 * cifra: que esto es una demostracion visual y que los datos son ficticios. Por
 * eso la pieza entera es un `figure` con su `figcaption`, y la frase esta en el
 * texto, no en un `title` ni en un `alt` que se pierde.
 *
 * Todo lo que se pulsa es un `button` de verdad: se llega con Tab, se activa
 * con Enter y Espacio y tiene foco visible. Los modulos son un `tablist` real
 * porque eso es exactamente lo que son —conmutan un panel—, y asi el lector
 * anuncia «2 de 5» sin que haya que explicarselo.
 *
 * Los puntos de color, las siglas y las barras de avance van `aria-hidden`: su
 * dato ya esta escrito al lado en palabras. Un lector que los lea todos
 * convierte una pantalla en una lista de ruido.
 *
 * ── RENDIMIENTO (§65) ─────────────────────────────────────────────────────
 * No hay listener global, ni observer, ni temporizador, ni animacion en curso:
 * este componente no hace NADA hasta que alguien pulsa. El panel lleva
 * `min-h` por breakpoint para que conmutar de modulo no mueva la pagina —un
 * salto de layout en el hero es lo que mas se nota de toda la web—.
 */
export default function VeliaOSDemo() {
  const [espacioId, setEspacioId] = useState(ESPACIOS[0].id)
  const [moduloId, setModuloId] = useState<ModuloId>('resumen')
  const [proyectoSel, setProyectoSel] = useState(0)
  const idPanel = useId()

  const espacio = useMemo(
    () => ESPACIOS.find(e => e.id === espacioId) ?? ESPACIOS[0],
    [espacioId],
  )

  /* Un proyecto pertenece a varios modulos, asi que la lista visible depende de
     los dos. `resumen` los ve todos: es el unico modulo que no filtra. */
  const proyectos = useMemo(
    () =>
      moduloId === 'resumen'
        ? espacio.proyectos
        : espacio.proyectos.filter(p => p.modulos.includes(moduloId)),
    [espacio, moduloId],
  )

  const actividad = useMemo(
    () =>
      moduloId === 'resumen'
        ? espacio.actividad
        : espacio.actividad.filter(a => a.modulos.includes(moduloId)),
    [espacio, moduloId],
  )

  /* El indice guardado puede quedarse fuera de rango al cambiar de filtro. Se
     ACOTA al leer en vez de corregirse con un efecto: un `useEffect` que
     reajusta estado provoca un segundo render y un parpadeo del detalle. */
  const iSel = Math.min(proyectoSel, Math.max(proyectos.length - 1, 0))
  const seleccionado = proyectos[iSel]

  const metricas = espacio.metricas[moduloId]

  function elegirEspacio(id: string) {
    setEspacioId(id)
    setModuloId('resumen')
    setProyectoSel(0)
  }

  function elegirModulo(id: ModuloId) {
    setModuloId(id)
    setProyectoSel(0)
  }

  return (
    <figure className="os-demo m-0">
      <MacWindowFrame
        titulo="VELIA OS"
        subtitulo={espacio.rotulo}
        estado={<StatusPill texto="En marcha" />}
      >
        <div className="flex flex-col md:flex-row">
          {/* ── Conmutador de espacios ────────────────────────────────────
              En escritorio es una columna, como en el portal. Por debajo de
              `md` es una fila que se desliza: una barra lateral de 130 px en
              una pantalla de 390 se come un tercio del ancho. */}
          <div className="flex-none border-b border-white/10 md:w-[178px] md:border-b-0 md:border-r">
            <p className="px-3.5 pt-3 text-[10px] font-600 uppercase tracking-[0.06em] text-cream/70">
              Espacio
            </p>
            <div
              className="os-espacios flex gap-1 overflow-x-auto px-2.5 pb-2.5 pt-2 md:flex-col md:overflow-visible"
              role="group"
              aria-label="Clientes del espacio de trabajo de VELIA"
            >
              {ESPACIOS.map(e => {
                const activo = e.id === espacio.id
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => elegirEspacio(e.id)}
                    aria-pressed={activo}
                    className={`os-chip flex flex-none items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-control ease-velia ${
                      activo ? 'bg-white/[0.09] text-cream' : 'text-cream/70 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-6 w-6 flex-none place-items-center rounded text-[10px] font-700 ${
                        activo ? 'bg-gold/90 text-void' : 'bg-white/10 text-cream/70'
                      }`}
                    >
                      {e.sigla}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-600 leading-tight">
                        {e.nombre}
                      </span>
                      <span className="block truncate text-[10px] leading-tight text-cream/70">
                        {e.capacidad}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Contenido ─────────────────────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            <div
              role="tablist"
              aria-label="Módulos del entorno"
              className="os-modulos flex gap-1 overflow-x-auto border-b border-white/10 px-2.5 py-2"
            >
              {MODULOS.map(m => {
                const activo = m.id === moduloId
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={activo}
                    aria-controls={activo ? idPanel : undefined}
                    tabIndex={activo ? 0 : -1}
                    onClick={() => elegirModulo(m.id)}
                    className={`flex-none rounded-md px-2.5 py-1 text-[11px] font-600 transition-colors duration-control ease-velia ${
                      activo
                        ? 'bg-white/[0.09] text-cream'
                        : 'text-cream/70 hover:bg-white/[0.05] hover:text-cream/80'
                    }`}
                  >
                    {m.nombre}
                  </button>
                )
              })}
            </div>

            {/* `min-h` por breakpoint: sin esto, pasar de un modulo con tres
                proyectos a otro con uno encoge la ventana y empuja la pagina. */}
            <div
              id={idPanel}
              role="tabpanel"
              aria-label={`${MODULOS.find(m => m.id === moduloId)?.nombre} · ${espacio.nombre}`}
              tabIndex={-1}
              className="min-h-[392px] px-3.5 py-3.5 sm:min-h-[356px] md:min-h-[330px]"
            >
              {/* Fichas de metrica */}
              <div className="grid grid-cols-3 gap-2">
                {metricas.map(m => (
                  <div
                    key={m.etiqueta}
                    className="os-tarjeta rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 transition-colors duration-control ease-velia hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <p className="text-[10px] leading-tight text-cream/70">{m.etiqueta}</p>
                    <p className="mt-1 text-[17px] font-600 leading-none tracking-[-0.02em] text-cream">
                      {m.valor}
                    </p>
                    <p className="mt-1 text-[10px] leading-tight text-cream/70">{m.nota}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_1fr]">
                {/* Proyectos */}
                <div>
                  <p className="text-[10px] font-600 uppercase tracking-[0.06em] text-cream/70">
                    Proyectos
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {proyectos.map((p, i) => {
                      const activo = i === iSel
                      return (
                        <button
                          key={p.nombre}
                          type="button"
                          onClick={() => setProyectoSel(i)}
                          aria-pressed={activo}
                          className={`os-tarjeta block w-full rounded-lg border px-2.5 py-2 text-left transition-colors duration-control ease-velia ${
                            activo
                              ? 'border-gold/40 bg-white/[0.07]'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-[11.5px] font-600 text-cream">
                              {p.nombre}
                            </span>
                            <span className="flex-none text-[9.5px] font-600 uppercase tracking-[0.04em] text-cream/70">
                              {ROTULO_ESTADO[p.estado]}
                            </span>
                          </span>
                          {/* La barra solo existe para lo que aun no esta
                              operando: lo operado no tiene «avance», y pintarle
                              una barra al 100 % sugiere que le falta algo. */}
                          {p.estado !== 'operando' ? (
                            <span
                              aria-hidden="true"
                              className="mt-1.5 block h-[3px] w-full overflow-hidden rounded-full bg-white/10"
                            >
                              <span
                                className="block h-full rounded-full bg-gold/70"
                                style={{ width: `${p.avance}%` }}
                              />
                            </span>
                          ) : null}
                        </button>
                      )
                    })}
                  </div>

                  {/* El detalle del seleccionado. `aria-live` NO: quien pulsa ya
                      sabe que ha pulsado, y un anuncio por cada clic marea. */}
                  {seleccionado ? (
                    <p className="mt-2 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2 text-[11px] leading-[1.5] text-cream/85">
                      {seleccionado.detalle}
                    </p>
                  ) : null}
                </div>

                {/* Actividad */}
                <div>
                  <p className="text-[10px] font-600 uppercase tracking-[0.06em] text-cream/70">
                    Actividad
                  </p>
                  <ul className="mt-1.5 space-y-1.5">
                    {actividad.map(a => (
                      <li key={a.texto} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-[0.45em] h-1 w-1 flex-none rounded-full bg-gold/70"
                        />
                        <span className="min-w-0">
                          <span className="block text-[11px] leading-[1.45] text-cream/85">
                            {a.texto}
                          </span>
                          <span className="block text-[10px] leading-tight text-cream/70">
                            {a.cuando}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Zona de estado. NO es una barra de acciones: no hay nada que
                accionar en una demostracion, y un boton que no hace nada es
                peor que no tenerlo. */}
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3.5 py-2">
              <p className="truncate text-[10px] text-cream/70">
                {espacio.nombre} · {MODULOS.find(m => m.id === moduloId)?.nombre}
              </p>
              <StatusPill texto="Operado por VELIA" tono="neutro" />
            </div>
          </div>
        </div>
      </MacWindowFrame>

      <figcaption className="mt-3 text-[12px] leading-[1.5] text-void/70">
        Así se ve el trabajo cuando la infraestructura está operada.{' '}
        <span className="text-void/70">
          Demostración con datos ficticios: no hay información de ningún cliente dentro.
        </span>
      </figcaption>
    </figure>
  )
}
