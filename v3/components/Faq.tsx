'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FAQ } from '@/lib/faq'

/**
 * La FAQ de la Home. Contenido en `lib/faq.ts`; aquí sólo la composición.
 *
 * ── POR QUÉ UN `<button>` Y NO `<details>` ────────────────────────────────
 * `<details>/<summary>` sale gratis y funciona sin JS, que es mucho a favor.
 * Se descarta por dos motivos concretos: el estado no se expone como
 * `aria-expanded` —los lectores de pantalla lo anuncian, pero de formas que
 * no coinciden entre navegador y lector— y `<summary>` no acepta un
 * encabezado dentro sin romper su semántica, así que once preguntas quedarían
 * fuera del esquema de titulares de la página. Con `<h3><button>` cada
 * pregunta es un titular navegable y el estado es explícito.
 *
 * ── LO QUE SE ANIMA, Y LO QUE NO ──────────────────────────────────────────
 * El panel NO anima su altura. Animar `height` o `grid-template-rows` obliga
 * al navegador a recalcular el layout en cada fotograma, y es justo lo que el
 * sistema de esta web prohíbe: sólo `transform` y `opacity`.
 *
 * Así que al abrir, el panel aparece y su contenido entra con un fundido
 * corto; el signo gira. Nada más. La altura cambia de golpe, que es lo que
 * hace un acordeón, y no arrastra a nada de arriba porque cada pregunta está
 * en su propia fila con su hairline.
 *
 * Con `prefers-reduced-motion` no se mueve ni el fundido ni el signo. Abrir y
 * cerrar sigue funcionando igual: el movimiento nunca es el que informa.
 *
 * ── VARIAS ABIERTAS A LA VEZ ──────────────────────────────────────────────
 * A propósito. Cerrar la que el visitante estaba leyendo porque abre otra es
 * una decisión del componente sobre algo que no es asunto suyo, y obliga a
 * volver atrás para comparar dos respuestas. Un `Set` y cada una a lo suyo.
 */
export default function Faq() {
  const [abiertas, setAbiertas] = useState<ReadonlySet<string>>(new Set())

  const alternar = (id: string) =>
    setAbiertas(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })

  return (
    <ul className="mt-12 md:mt-16 max-w-[68ch]">
      {FAQ.map(p => {
        const abierta = abiertas.has(p.id)
        return (
          <li key={p.id} className="border-t border-mist last:border-b">
            {/* El encabezado lleva el botón dentro, y no al revés: así la
                pregunta es un titular de nivel 3 dentro de la sección y quien
                navega por titulares recorre las once. */}
            <h3>
              <button
                type="button"
                id={`faq-b-${p.id}`}
                aria-expanded={abierta}
                aria-controls={`faq-p-${p.id}`}
                onClick={() => alternar(p.id)}
                className="group w-full flex items-start justify-between gap-5 py-5 md:py-6 text-left"
              >
                <span className="text-base md:text-lg font-600 tracking-[-0.01em] text-void">
                  {p.q}
                </span>
                {/* El signo, no un icono: dos trazos que pasan de «+» a «−»
                    girando. `aria-hidden` porque `aria-expanded` ya lo dice, y
                    decirlo dos veces obliga a oírlo dos veces. */}
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 h-4 w-4 shrink-0 text-void/65 group-hover:text-void transition-colors duration-control"
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current motion-safe:transition-transform motion-safe:duration-panel motion-safe:ease-velia ${
                      abierta ? 'rotate-0' : 'rotate-90'
                    }`}
                  />
                </span>
              </button>
            </h3>

            {/* `hidden` y no una clase: el contenido cerrado no debe estar en
                el árbol de accesibilidad ni ser alcanzable con el tabulador.
                Un panel «oculto» con opacidad sigue ahí para un lector de
                pantalla y para la búsqueda del navegador. */}
            <div
              id={`faq-p-${p.id}`}
              role="region"
              aria-labelledby={`faq-b-${p.id}`}
              hidden={!abierta}
              className="motion-safe:animate-[faq-entra_220ms_cubic-bezier(0.22,1,0.36,1)_both] pb-6 md:pb-7 pr-9"
            >
              {p.a.map((parrafo, i) => (
                <p key={i} className={`${i === 0 ? '' : 'mt-3'} text-[15px] leading-[1.6] text-void/70`}>
                  {parrafo}
                </p>
              ))}
              {/* Donde la respuesta resume algo que otra superficie desarrolla
                  —hoy, los términos del servicio—, se enlaza. Una FAQ que
                  explica una condición y no dice dónde está escrita obliga a
                  creérsela. Mismo gesto de flecha que el resto de la web: «→»
                  lleva a otro sitio de este dominio. */}
              {p.enlace && (
                <p className="mt-4">
                  <Link
                    href={p.enlace.href}
                    className="enlace-flecha text-[15px] font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
                  >
                    {p.enlace.texto}
                    <span className="enlace-flecha__flecha ml-1 no-underline" aria-hidden="true">→</span>
                  </Link>
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
