'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import IrisNode from './IrisNode'
import { trackEvent } from '@/lib/analytics'

/**
 * VELIA Context Stage — el momento de marca del hero.
 *
 * QUÉ TIENE QUE DEMOSTRAR, en 12 segundos y sin que nadie lea nada:
 * entra un documento → VELIA lo relaciona con el expediente, el cliente y la
 * agenda → detecta algo → lo prepara → y SE PARA a pedir confirmación.
 *
 * La última fase es la que importa y es la que casi ningún producto de IA
 * enseña: el sistema termina su trabajo y espera. «VELIA prepara. Tú decides»
 * deja de ser una frase del copy y pasa a ser algo que se ve pasar.
 *
 * POR QUÉ NO ES UN VÍDEO:
 *  · un vídeo no se puede explorar, y aquí se puede enfocar cada tarjeta de
 *    contexto para ver qué aporta;
 *  · pesa. Esto es SVG y estado de React, y entra en el HTML inicial;
 *  · el texto vive en el DOM, así que lo lee un lector de pantalla y lo indexa
 *    un buscador. Un canvas con el mismo contenido sería invisible para ambos.
 *
 * ACCESIBILIDAD: la secuencia es decorativa —el mensaje completo está en el
 * texto estático de al lado—, se puede pausar, y con `prefers-reduced-motion`
 * arranca ya en su fotograma final (el estado que más dice) sin avanzar sola.
 */

type Fase = 0 | 1 | 2 | 3 | 4

/** Las cuatro piezas de contexto que orbitan un asunto. El `aporta` es lo que
 *  se muestra al enfocarlas: no es adorno, es la explicación de por qué VELIA
 *  no responde desde una pestaña en blanco. */
const CONTEXTO = [
  { id: 'documento', etiqueta: 'Documento', detalle: 'Notificación · 4 páginas', aporta: 'Fechas, partes y referencias jurídicas.' },
  { id: 'expediente', etiqueta: 'Expediente', detalle: '2026/184 · Reclamación', aporta: 'El asunto al que pertenece y su estado.' },
  { id: 'cliente', etiqueta: 'Cliente', detalle: 'Martínez Ferrer, S.L.', aporta: 'Antecedentes y comunicaciones previas.' },
  { id: 'agenda', etiqueta: 'Agenda', detalle: 'Plazos del despacho', aporta: 'Dónde encaja el vencimiento propuesto.' },
] as const

/** Qué dice el Iris Node en cada fase. El estado 'esperando' es terminal. */
const FASES: { rotulo: string; estado: 'reposo' | 'analizando' | 'esperando' }[] = [
  { rotulo: 'En reposo', estado: 'reposo' },
  { rotulo: 'Leyendo el documento', estado: 'analizando' },
  { rotulo: 'Relacionando con el asunto', estado: 'analizando' },
  { rotulo: 'Preparando la propuesta', estado: 'analizando' },
  { rotulo: 'Esperando tu confirmación', estado: 'esperando' },
]

const MS_POR_FASE = 2600

export default function HeroContextStage() {
  const [fase, setFase] = useState<Fase>(0)
  const [enPausa, setEnPausa] = useState(false)
  const [enfocada, setEnfocada] = useState<string | null>(null)
  const [reducido, setReducido] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)
  const visible = useRef(true)

  // Reduced motion: se salta a la fase final. Es la que más comunica —VELIA ha
  // preparado algo y espera— así que quien pidió menos movimiento no se queda
  // con la versión pobre, se queda con la conclusión.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aplicar = () => {
      setReducido(mq.matches)
      if (mq.matches) setFase(4)
    }
    aplicar()
    mq.addEventListener('change', aplicar)
    return () => mq.removeEventListener('change', aplicar)
  }, [])

  // No gastar hilo principal animando algo que no se está viendo (§27).
  useEffect(() => {
    const el = contenedor.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (reducido || enPausa) return
    const t = setInterval(() => {
      if (!visible.current) return
      setFase(f => ((f + 1) % 5) as Fase)
    }, MS_POR_FASE)
    return () => clearInterval(t)
  }, [reducido, enPausa])

  const reiniciar = useCallback(() => {
    setFase(0)
    trackEvent('hero_context_interaction', { interaction_type: 'restart' })
  }, [])

  const alEnfocar = useCallback((id: string) => {
    setEnfocada(id)
    trackEvent('hero_context_interaction', { interaction_type: 'focus_card', selected_module: id })
  }, [])

  const faseActual = FASES[fase]
  // Una tarjeta se considera "conectada" cuando la fase ya la ha alcanzado.
  const conectadas = fase === 0 ? 0 : Math.min(fase + 1, CONTEXTO.length)

  return (
    <div ref={contenedor} className="relative">
      {/* Escenario. `aria-hidden` porque todo lo que dice está también en el
          texto de la izquierda del hero: para un lector de pantalla esto sería
          una repetición sin aportar nada. */}
      <div
        aria-hidden="true"
        className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7 backdrop-blur-[2px]"
      >
        {/* Cabecera: el estado de VELIA, siempre visible. */}
        <div className="flex items-center gap-3 pb-5 border-b border-white/10">
          <IrisNode state={faseActual.estado} className="w-10 h-10 text-cream shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-600 tracking-[0.06em] uppercase text-cream/50">VELIA</p>
            <p className="text-[13px] text-cream/85 truncate transition-opacity duration-control">
              {faseActual.rotulo}
            </p>
          </div>
        </div>

        {/* Las cuatro piezas de contexto. Se iluminan en cadena conforme VELIA
            las relaciona; enfocarlas con teclado o ratón dice qué aportan. */}
        <ul className="mt-5 grid grid-cols-2 gap-2.5">
          {CONTEXTO.map((c, i) => {
            const activa = i < conectadas
            return (
              <li key={c.id}>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => alEnfocar(c.id)}
                  onMouseLeave={() => setEnfocada(null)}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all duration-panel ease-velia ${
                    activa
                      ? 'border-iris-focus/45 bg-iris-focus/[0.10]'
                      : 'border-white/10 bg-white/[0.02]'
                  }`}
                >
                  <p className={`text-[10px] font-600 tracking-[0.06em] uppercase transition-colors duration-panel ${activa ? 'text-gold-light' : 'text-cream/40'}`}>
                    {c.etiqueta}
                  </p>
                  <p className="mt-0.5 text-[12px] text-cream/70 leading-snug">
                    {enfocada === c.id ? c.aporta : c.detalle}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>

        {/* La propuesta. Aparece solo cuando VELIA ha terminado — antes no hay
            nada que enseñar, y fingir que sí lo hay sería exactamente el tipo de
            demo que promete cosas que el producto no hace. */}
        <div className="mt-5 min-h-[132px]">
          {fase >= 3 ? (
            <div className="ctx-in rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3.5">
              <p className="text-[13px] text-cream/85 leading-relaxed">
                He encontrado un posible vencimiento en este documento.
                <span className="text-cream/55"> Plazo de 20 días hábiles desde la notificación.</span>
              </p>
              {fase === 4 && (
                <div className="ctx-in mt-3.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gold-dark text-white px-4 py-1.5 text-[11px] font-600 tracking-[0.04em]">
                    Revisar cálculo
                  </span>
                  <span className="rounded-full border border-white/20 text-cream/70 px-4 py-1.5 text-[11px] font-600 tracking-[0.04em]">
                    Añadir después
                  </span>
                  <span className="text-[11px] text-cream/45 ml-auto">Nada se guarda sin tu visto bueno.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-end">
              <p className="text-[12px] text-cream/35">VELIA no propone nada hasta tener el contexto completo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Controles. Fuera del aria-hidden: son funcionales de verdad. */}
      <div className="mt-3 flex items-center gap-4">
        {!reducido && (
          <button
            type="button"
            onClick={() => setEnPausa(p => !p)}
            className="text-[11px] font-600 tracking-[0.04em] text-cream/50 hover:text-cream/85 transition-colors duration-control"
          >
            {enPausa ? 'Reanudar' : 'Pausar'} <span aria-hidden="true">·</span>{' '}
            <span className="sr-only">la secuencia de demostración</span>
          </button>
        )}
        <button
          type="button"
          onClick={reiniciar}
          className="text-[11px] font-600 tracking-[0.04em] text-cream/50 hover:text-cream/85 transition-colors duration-control"
        >
          Ver desde el principio
        </button>
        <span className="ml-auto text-[11px] text-cream/35">Datos ficticios</span>
      </div>
    </div>
  )
}
