'use client'

import { useRef, useState } from 'react'
import IrisNode, { type IrisState } from './IrisNode'
import { trackEvent } from '@/lib/analytics'

/**
 * Las cuatro fases del Cerebro VELIA: entiende · analiza · prepara · confirma.
 *
 * Antes esto era un `<ol>` de tres frases dentro de una tarjeta. El problema no
 * era el texto —era correcto— sino que la sección que explica la única capacidad
 * diferencial del producto no dejaba hacer nada. Ahora cada fase cambia el
 * estado del Iris Node, y la cuarta lo PARA: es la traducción visual de que la
 * decisión sigue siendo del abogado.
 *
 * Patrón ARIA de tabs completo, porque aquí sí hace falta: flechas para moverse,
 * Home/End, y `tabIndex` gestionado (solo la pestaña activa es tabulable, que es
 * lo que espera quien navega con teclado — si no, se recorren las cuatro).
 */

const FASES: {
  id: string
  titulo: string
  cuerpo: string
  estado: IrisState
  detalle: string
}[] = [
  {
    id: 'entiende',
    titulo: 'Entiende',
    estado: 'analizando',
    cuerpo: 'Reúne el contexto disponible sin obligarte a explicarlo todo de nuevo en cada consulta.',
    detalle: 'Lee el expediente, quién es el cliente y qué se ha hablado antes.',
  },
  {
    id: 'analiza',
    titulo: 'Analiza',
    estado: 'analizando',
    cuerpo: 'Ordena la documentación y señala la información relevante para el asunto.',
    detalle: 'Localiza fechas, partes y referencias, y enlaza la fuente oficial cuando corresponde.',
  },
  {
    id: 'prepara',
    titulo: 'Prepara',
    estado: 'analizando',
    cuerpo: 'Genera una estructura inicial o un borrador para que lo revises.',
    detalle: 'Un punto de partida con sus fuentes, no un texto para firmar sin leer.',
  },
  {
    id: 'confirma',
    titulo: 'Confirma',
    estado: 'esperando',
    cuerpo: 'Las acciones que importan quedan esperando el visto bueno del profesional.',
    detalle: 'Nada entra en la agenda, sale del despacho ni se da por bueno sin que tú lo apruebes.',
  },
]

export default function BrainStateTabs() {
  const [activa, setActiva] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const seleccionar = (i: number) => {
    setActiva(i)
    trackEvent('brain_state_select', { selected_brain_state: FASES[i].id })
  }

  const enTeclado = (e: React.KeyboardEvent) => {
    const ultimo = FASES.length - 1
    let destino: number | null = null
    if (e.key === 'ArrowRight') destino = activa === ultimo ? 0 : activa + 1
    if (e.key === 'ArrowLeft') destino = activa === 0 ? ultimo : activa - 1
    if (e.key === 'Home') destino = 0
    if (e.key === 'End') destino = ultimo
    if (destino === null) return
    e.preventDefault()
    seleccionar(destino)
    refs.current[destino]?.focus()
  }

  const fase = FASES[activa]

  return (
    <div>
      <div
        role="tablist"
        aria-label="Cómo trabaja el Cerebro VELIA"
        onKeyDown={enTeclado}
        className="rail flex gap-2 pb-1"
      >
        {FASES.map((f, i) => (
          <button
            key={f.id}
            ref={el => { refs.current[i] = el }}
            role="tab"
            id={`brain-tab-${f.id}`}
            aria-selected={activa === i}
            aria-controls={`brain-panel-${f.id}`}
            tabIndex={activa === i ? 0 : -1}
            onClick={() => seleccionar(i)}
            className={`shrink-0 rounded-full border px-5 min-h-[44px] text-[12px] font-600 tracking-[0.02em] transition-colors duration-control ease-velia ${
              activa === i
                ? 'border-iris-focus bg-iris-focus/15 text-cream'
                : 'border-white/15 text-cream/55 hover:border-white/35 hover:text-cream/85'
            }`}
          >
            {f.titulo}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`brain-panel-${fase.id}`}
        aria-labelledby={`brain-tab-${fase.id}`}
        tabIndex={0}
        /* Altura mínima reservada para el texto más largo: cambiar de pestaña
           no puede mover la página bajo el dedo de quien la está pulsando. */
        className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 min-h-[228px]"
      >
        <div key={fase.id} className="ctx-in flex flex-col sm:flex-row sm:items-start gap-5">
          <IrisNode state={fase.estado} className="w-14 h-14 text-cream shrink-0" />
          <div>
            <p className="text-[10px] font-600 tracking-[0.06em] uppercase text-gold-light">
              {fase.titulo}
            </p>
            <p className="mt-2.5 text-[15px] sm:text-base text-cream/85 leading-[1.6]">{fase.cuerpo}</p>
            <p className="mt-4 pt-4 border-t border-white/10 text-[13px] text-cream/55 leading-[1.6]">
              {fase.detalle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
