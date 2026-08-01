'use client'

import { useId, useState } from 'react'
import IrisNode from './IrisNode'
import { trackEvent } from '@/lib/analytics'

/**
 * El mapa de contexto — «VELIA no responde desde una pestaña vacía».
 *
 * Esta sección tiene un solo trabajo: explicar la diferencia entre guardar
 * información y trabajar con ella, que es la idea que separa a VELIA de un CRM.
 * En texto ya se intentó y ocupaba una sección entera para decir una frase.
 *
 * CÓMO FUNCIONA: un asunto en el centro, seis piezas de contexto alrededor.
 * Al elegir una, se dibuja su traza hacia el centro y el panel dice qué aporta
 * ESA pieza y en qué cambia lo que VELIA puede responder.
 *
 * DECISIONES DE ACCESIBILIDAD (las tres importan):
 *  1. Los botones son botones de verdad, en el DOM, con el texto dentro. El SVG
 *     es la capa bonita; si no cargara, la sección sigue siendo usable.
 *  2. Nada esencial detrás de `hover`: se activa con clic/Enter, no al pasar por
 *     encima. En táctil no existe el hover y en teclado tampoco.
 *  3. El panel de resultado es `aria-live="polite"`: quien no ve el dibujo se
 *     entera igual de que la respuesta ha cambiado.
 *
 * En móvil el SVG se oculta y quedan las mismas piezas como lista tocable — no
 * se pierde contenido, se pierde el diagrama, que es lo decorativo.
 */

type Pieza = {
  id: string
  etiqueta: string
  /** Posición en el SVG (viewBox 0 0 400 320). */
  x: number
  y: number
  aporta: string
}

const PIEZAS: Pieza[] = [
  { id: 'cliente',    etiqueta: 'Cliente',    x: 62,  y: 66,  aporta: 'Recupera antecedentes, comunicaciones y otros asuntos del mismo cliente.' },
  { id: 'demanda',    etiqueta: 'Demanda',    x: 200, y: 38,  aporta: 'Identifica las partes, el objeto del procedimiento y las fechas clave.' },
  { id: 'contrato',   etiqueta: 'Contrato',   x: 338, y: 66,  aporta: 'Localiza las cláusulas aplicables y las referencias que sostienen la posición.' },
  { id: 'email',      etiqueta: 'Email',      x: 62,  y: 254, aporta: 'Enlaza la correspondencia con el expediente al que pertenece.' },
  { id: 'tarea',      etiqueta: 'Tarea',      x: 200, y: 282, aporta: 'Sabe qué queda pendiente y quién lo tiene asignado dentro del despacho.' },
  { id: 'plazo',      etiqueta: 'Plazo',      x: 338, y: 254, aporta: 'Relaciona el vencimiento con el asunto y con la agenda del despacho.' },
]

const CENTRO = { x: 200, y: 160 }

export default function ContextMap() {
  const [activa, setActiva] = useState<string | null>(null)
  const gradId = useId()

  const elegir = (id: string) => {
    const siguiente = activa === id ? null : id
    setActiva(siguiente)
    if (siguiente) trackEvent('context_node_select', { selected_module: siguiente })
  }

  const piezaActiva = PIEZAS.find(p => p.id === activa) ?? null

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      {/* ── Diagrama (solo lg+: en móvil el dibujo estorba más de lo que explica) */}
      <div className="hidden lg:block">
        <svg viewBox="0 0 400 320" className="w-full h-auto" role="presentation" aria-hidden="true">
          <defs>
            <linearGradient id={`traza-${gradId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7479F2" />
              <stop offset="100%" stopColor="#B5DFFF" />
            </linearGradient>
          </defs>

          {/* Trazas. Todas presentes en reposo, muy tenues: el mapa ya existe
              antes de tocarlo — esa es justamente la idea que se quiere dar. */}
          {PIEZAS.map(p => {
            const viva = activa === p.id
            const largo = Math.hypot(CENTRO.x - p.x, CENTRO.y - p.y)
            return (
              <line
                /* La clave lleva el estado a propósito: una animación CSS NO se
                   reinicia si el elemento sigue siendo el mismo y solo le cambia
                   una clase. Al cambiar la clave, React monta un nodo nuevo y el
                   trazo se dibuja siempre desde cero — también al volver a
                   pulsar la pieza que ya estaba activa. */
                key={`${p.id}-${viva ? 'on' : 'off'}`}
                x1={p.x}
                y1={p.y}
                x2={CENTRO.x}
                y2={CENTRO.y}
                stroke={viva ? `url(#traza-${gradId})` : 'currentColor'}
                strokeWidth={viva ? 1.75 : 1}
                opacity={viva ? 1 : 0.16}
                className={viva ? 'trace' : undefined}
                data-drawn={viva ? 'true' : undefined}
                style={viva ? ({ ['--trace-len' as string]: largo } as React.CSSProperties) : undefined}
              />
            )
          })}

          {PIEZAS.map(p => {
            const viva = activa === p.id
            // La etiqueta se aparta del centro, nunca hacia él.
            //
            // Antes iba siempre 13 px por ENCIMA del nodo. Para las piezas que
            // están debajo del expediente —«Tarea»— eso la metía justo entre el
            // nodo y el centro, o sea encima de su propia línea: se leía cortada
            // por el trazo. Ahora el desplazamiento sigue el signo: los de
            // arriba suben, los de abajo bajan, y ninguno pisa la traza.
            const abajo = p.y > CENTRO.y
            return (
              <g key={p.id} className="transition-opacity duration-panel" opacity={activa && !viva ? 0.4 : 1}>
                <circle cx={p.x} cy={p.y} r="5" fill={viva ? '#7479F2' : 'currentColor'} opacity={viva ? 1 : 0.35} />
                <text
                  x={p.x}
                  y={abajo ? p.y + 20 : p.y - 13}
                  textAnchor="middle"
                  fill="currentColor"
                  opacity={viva ? 0.95 : 0.55}
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {p.etiqueta}
                </text>
              </g>
            )
          })}

          <foreignObject x={CENTRO.x - 26} y={CENTRO.y - 26} width="52" height="52">
            <IrisNode state={activa ? 'analizando' : 'reposo'} className="w-full h-full text-slate" />
          </foreignObject>
          <text x={CENTRO.x} y={CENTRO.y + 44} textAnchor="middle" fill="currentColor" opacity="0.75" style={{ fontSize: 11, fontWeight: 600 }}>
            Expediente 2026/184
          </text>
        </svg>
      </div>

      {/* ── Controles + resultado. Esta columna es la que lleva el contenido.
          `min-w-0` NO es cosmético: sin él, en móvil esta columna medía 492 px
          dentro de una pantalla de 391 y el lado derecho se quedaba cortado.
          Un hijo de grid arranca con `min-width: auto`, así que se niega a
          encoger por debajo del contenido más ancho que tenga dentro — y aquí
          dentro está el carril de seis chips que NO envuelve en móvil. El
          carril quiere desbordar para poder scrollear; la columna no debe
          acompañarlo. Medido con el navegador, no deducido. */}
      <div className="min-w-0">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-3">Todo está conectado</p>
        <h2 className="text-3xl md:text-4xl font-600 tracking-[-0.03em] max-w-[18ch]">
          VELIA no responde desde una pestaña vacía.
        </h2>
        <p className="mt-5 text-[15px] text-void/70 leading-[1.6] max-w-[46ch]">
          Trabaja con el contexto disponible en cada asunto. Elige una pieza para ver qué aporta.
        </p>

        <div className="mt-7 rail flex lg:flex-wrap gap-2 pb-1">
          {PIEZAS.map(p => {
            const viva = activa === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => elegir(p.id)}
                aria-pressed={viva}
                className={`shrink-0 rounded-full border px-4 min-h-[44px] text-[12px] font-600 tracking-[0.02em] transition-colors duration-control ease-velia ${
                  viva
                    ? 'border-iris-focus bg-iris-focus/10 text-gold-ink'
                    : 'border-[#838CA1] text-void/65 hover:border-void/50 hover:text-void'
                }`}
              >
                {p.etiqueta}
              </button>
            )
          })}
        </div>

        {/* Resultado. Altura reservada: sin esto el bloque de abajo salta cada
            vez que cambia el texto, y eso es CLS que se ve a simple vista. */}
        <div
          aria-live="polite"
          className="mt-6 rounded-2xl border border-mist bg-white px-5 py-5 min-h-[164px] flex flex-col justify-center"
        >
          {piezaActiva ? (
            <div className="ctx-in">
              <p className="text-[10px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-2">
                {piezaActiva.etiqueta}
              </p>
              <p className="text-[14px] text-void/85 leading-[1.6]">{piezaActiva.aporta}</p>
              <p className="mt-4 pt-4 border-t border-mist text-[13px] text-void/65 leading-[1.6]">
                Con esta pieza dentro, VELIA puede preparar un resumen del asunto y señalar lo que
                necesita revisión.
              </p>
            </div>
          ) : (
            <p className="text-[14px] text-void/60 leading-[1.6]">
              Un CRM guardaría estas seis piezas en seis sitios distintos. VELIA las lee como un
              único asunto.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
