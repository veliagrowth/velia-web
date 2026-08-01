'use client'

import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Un día con VELIA — sustituye a la lista de funcionalidades.
 *
 * POR QUÉ ASÍ: una lista de módulos («Expedientes», «Documentos», «Agenda»…)
 * dice qué hay dentro pero no qué se siente al usarlo. Cinco momentos de una
 * jornada real cuentan lo mismo y además se entienden sin conocer el producto.
 *
 * SCROLL: la línea de tiempo es `sticky`, que es CSS y no cuesta nada. Lo que
 * NO se hace es secuestrar el scroll — está prohibido en el encargo y con razón:
 * un scroll que no responde como el del resto de la web se siente roto, no
 * sofisticado. La rueda del ratón sigue haciendo exactamente lo de siempre.
 *
 * MÓVIL: sin sticky. Las cinco tarjetas se apilan y ya está. Un sticky de dos
 * columnas en 390 px no es una versión reducida, es una pantalla peleada consigo
 * misma.
 */

const MOMENTOS = [
  {
    hora: '08:30',
    titulo: 'Puesta al día',
    frase: 'VELIA ya ha ordenado lo que necesita tu atención.',
    piezas: ['3 plazos esta semana', '5 tareas pendientes', '2 documentos nuevos', 'Agenda del día'],
  },
  {
    hora: '09:10',
    titulo: 'Plazo propuesto',
    frase: 'He encontrado un posible vencimiento. Revísalo antes de añadirlo.',
    piezas: ['Notificación · 4 páginas', 'Cómputo: 20 días hábiles', 'Cita textual del documento', 'Pendiente de tu visto bueno'],
  },
  {
    hora: '11:00',
    titulo: 'Primer borrador',
    frase: 'He preparado una estructura con las fuentes utilizadas.',
    piezas: ['Escrito estructurado', 'Fuentes citadas y enlazadas', 'Editable dentro del expediente', 'La versión final la firmas tú'],
  },
  {
    hora: '13:30',
    titulo: 'Documentación pendiente',
    frase: 'El cliente todavía debe aportar dos documentos.',
    piezas: ['Portal del cliente', 'Checklist de lo que falta', 'Recordatorio configurado', 'Sin perseguir a nadie por teléfono'],
  },
  {
    hora: '17:00',
    titulo: 'Control económico',
    frase: 'El asunto, su facturación y sus movimientos siguen conectados.',
    piezas: ['Honorarios del asunto', 'Cobrado y por cobrar', 'Factura enlazada al expediente', 'Sin hoja de cálculo aparte'],
  },
]

export default function DayWithVelia() {
  const [activo, setActivo] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const yaContado = useRef(new Set<number>())

  // Qué momento se está leyendo. Un solo observer para los cinco y un umbral
  // generoso: la barra lateral acompaña la lectura, no persigue cada píxel.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      entradas => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          const i = refs.current.findIndex(el => el === e.target)
          if (i < 0) continue
          setActivo(i)
          if (!yaContado.current.has(i)) {
            yaContado.current.add(i)
            trackEvent('day_timeline_step', { selected_module: MOMENTOS[i].titulo, interaction_type: 'scroll' })
          }
        }
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0 },
    )
    for (const el of refs.current) if (el) obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="grid gap-10 md:grid-cols-[210px_1fr] md:gap-14">
      {/* Línea de tiempo. Solo md+: en móvil no aporta y roba altura. */}
      <div className="hidden md:block">
        <div className="sticky top-28">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/50 mb-5">Un día cualquiera</p>
          <ol className="space-y-1">
            {MOMENTOS.map((m, i) => (
              <li key={m.hora}>
                <button
                  type="button"
                  onClick={() => {
                    refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    trackEvent('day_timeline_step', { selected_module: m.titulo, interaction_type: 'click' })
                  }}
                  className={`w-full text-left flex items-baseline gap-3 py-2 border-l-2 pl-4 -ml-px transition-colors duration-control ease-velia ${
                    activo === i ? 'border-iris-focus' : 'border-mist hover:border-slate/50'
                  }`}
                >
                  <span className={`tabular text-[12px] font-600 transition-colors duration-control ${activo === i ? 'text-gold-ink' : 'text-void/40'}`}>
                    {m.hora}
                  </span>
                  <span className={`text-[13px] transition-colors duration-control ${activo === i ? 'text-void font-600' : 'text-void/50'}`}>
                    {m.titulo}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ol className="space-y-5 md:space-y-8">
        {MOMENTOS.map((m, i) => (
          <li
            key={m.hora}
            ref={el => { refs.current[i] = el }}
            className="rounded-2xl border border-mist bg-white p-6 sm:p-8 transition-shadow duration-panel"
          >
            <div className="flex items-baseline gap-3">
              <span className="tabular text-[12px] font-600 text-gold-ink">{m.hora}</span>
              <h3 className="text-lg sm:text-xl font-600 tracking-[-0.02em]">{m.titulo}</h3>
            </div>
            <p className="mt-3 text-[15px] sm:text-base text-void/75 leading-[1.6] max-w-[48ch]">
              {m.frase}
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {m.piezas.map(p => (
                <li key={p} className="flex items-start gap-2.5 text-[13px] text-void/60 leading-[1.55]">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-iris-focus shrink-0" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
