'use client'

import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Un día con VELIA — cinco momentos, que aparecen en orden.
 *
 * QUÉ CAMBIÓ EL 1-AGO (feedback de Joaquín): la primera versión llevaba una
 * línea de tiempo `sticky` y las tarjetas se iban marcando según el scroll. La
 * intención era acompañar la lectura; el efecto real era obligar a hacer scroll
 * dentro de una sección para poder verla entera, y eso rompe la experiencia en
 * vez de mejorarla. La sección pedía trabajo al visitante a cambio de nada.
 *
 * QUÉ CAMBIÓ EL 2-AGO (encargo de Joaquín): «que no sea una sección de solo
 * scroll». Ahora las cinco tarjetas son una BARAJA: cada una se posa sobre la
 * anterior dejando su borde asomando, y la que queda debajo se encoge y se
 * apaga. Se lee en el mismo orden de siempre, pero el día se va acumulando
 * delante de ti en lugar de desfilar.
 *
 * Esto no reabre el error del 1-ago. Aquello obligaba a hacer scroll DENTRO de
 * una sección anclada para poder verla: la página se quedaba quieta y el
 * visitante trabajaba a cambio de nada. Aquí el scroll es el de la página, cada
 * tarjeta se lee entera en su sitio y nada queda escondido detrás de un gesto.
 *
 * El apilado es CSS puro (`sticky`, ver `.dia-stack` en globals.css) y la
 * profundidad va con animación ligada al scroll: cero listeners, cero trabajo
 * en el hilo principal. El fade escalonado de entrada se conserva —dice el
 * orden temporal— y sigue disparándose UNA vez desde el contenedor: con cinco
 * observadores independientes las de abajo entraban antes que las de arriba al
 * llegar con scroll rápido, y se rompía lo único que había que respetar.
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

/** Separación entre tarjeta y tarjeta. 110 ms encadena sin hacerse esperar:
 *  las cinco están dentro a los 440 ms del disparo. */
const ESCALON_MS = 110

export default function DayWithVelia() {
  const [entrado, setEntrado] = useState(false)
  const contenedor = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = contenedor.current
    // Sin observador (o sin JS) las tarjetas se ven sin más: la animación nunca
    // puede ser la razón por la que falta contenido.
    if (!el || typeof IntersectionObserver === 'undefined') {
      setEntrado(true)
      return
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setEntrado(true)
        trackEvent('day_timeline_step', { interaction_type: 'section_view' })
        obs.disconnect()
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.05 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <ol ref={contenedor} className="dia-stack space-y-4 md:space-y-0 max-w-3xl mx-auto">
      {MOMENTOS.map((m, i) => (
        <li
          key={m.hora}
          className="dia-card"
          style={
            {
              // Cada tarjeta se posa un pelín más abajo que la anterior: ese
              // escalón es el borde que queda asomando de las ya apiladas.
              ['--dia-i' as string]: i,
              // La que llega va DELANTE de las que ya están posadas.
              zIndex: i + 1,
            } as React.CSSProperties
          }
        >
          <div
            className="dia-card-face reveal rounded-2xl border border-mist bg-white p-6 sm:p-8"
            data-visible={entrado ? 'true' : undefined}
            style={entrado ? { transitionDelay: `${i * ESCALON_MS}ms` } : undefined}
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
          </div>
        </li>
      ))}
    </ol>
  )
}
