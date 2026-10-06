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
 * ── UNA SOLA ABIERTA · CAMBIADO EL 2-oct-2026 ─────────────────────────────
 * Antes podían quedarse varias abiertas, y estaba razonado: cerrar la que
 * alguien está leyendo porque abre otra es decidir por él. Lo cambia una
 * petición explícita de producto, y el motivo que la sostiene es de forma, no
 * de función: con once preguntas y varias abiertas el bloque de cierre crece
 * hasta tres pantallas y deja de ser un cierre.
 *
 * Así que ahora se cierra la anterior — pero **animada**, que es la mitad que
 * importa. Abrir una y ver desaparecer otra de golpe es peor que no cerrarla.
 * El cómo está en `app/globals.css` (`.faq-panel`), y ahí está escrito por qué
 * este acordeón sí anima su altura cuando el sistema de movimiento lo prohíbe
 * en general.
 *
 * ── SOBRE NIGHT, Y CENTRADA ───────────────────────────────────────────────
 * El bloque pasó de blanco a `bg-void` para formar un solo cierre con el pie.
 * La columna va centrada en la página; el texto de cada pregunta y su
 * respuesta, NO: una respuesta de cuatro líneas centrada se lee peor, y aquí
 * la jerarquía la da el aire, no la simetría del párrafo.
 */
export default function Faq() {
  /* `null` y no un `Set`: una sola abierta. Guardar el id —y no el índice—
     porque el orden de `FAQ` puede cambiar y un índice recordaría la posición
     de otra pregunta. */
  const [abierta, setAbierta] = useState<string | null>(null)

  const alternar = (id: string) => setAbierta(prev => (prev === id ? null : id))

  return (
    <ul className="mt-12 md:mt-16 mx-auto max-w-[68ch] text-left">
      {FAQ.map(p => {
        const esta = abierta === p.id
        return (
          <li key={p.id} className="border-t border-white/10 last:border-b">
            {/* El encabezado lleva el botón dentro, y no al revés: así la
                pregunta es un titular de nivel 3 dentro de la sección y quien
                navega por titulares recorre las once. */}
            <h3>
              <button
                type="button"
                id={`faq-b-${p.id}`}
                aria-expanded={esta}
                aria-controls={`faq-p-${p.id}`}
                onClick={() => alternar(p.id)}
                className="group w-full flex items-start justify-between gap-5 py-5 md:py-6 text-left rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iris-focus focus-visible:ring-offset-2 focus-visible:ring-offset-void"
              >
                <span
                  className={`text-base md:text-lg font-600 tracking-[-0.01em] transition-colors duration-control ${
                    esta ? 'text-cream' : 'text-cream/85 group-hover:text-cream'
                  }`}
                >
                  {p.q}
                </span>
                {/* El signo, no un icono: dos trazos que pasan de «+» a «−»
                    girando. `aria-hidden` porque `aria-expanded` ya lo dice, y
                    decirlo dos veces obliga a oírlo dos veces. */}
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 h-4 w-4 shrink-0 text-cream/55 group-hover:text-cream transition-colors duration-control"
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current motion-safe:transition-transform motion-safe:duration-panel motion-safe:ease-velia ${
                      esta ? 'rotate-0' : 'rotate-90'
                    }`}
                  />
                </span>
              </button>
            </h3>

            {/* El panel se queda SIEMPRE en el DOM —si no, no hay nada que
                animar al cerrar— y se colapsa con `grid-template-rows`. Cerrado
                queda en `visibility: hidden`, que lo saca del árbol de
                accesibilidad y del tabulador igual que `hidden`, y además se
                puede transicionar. Ver `.faq-panel` en `globals.css`. */}
            <div
              id={`faq-p-${p.id}`}
              role="region"
              aria-labelledby={`faq-b-${p.id}`}
              className="faq-panel"
              data-abierta={esta ? 'true' : 'false'}
            >
              <div className="faq-panel__in">
                <div className="pb-6 md:pb-7 pr-9">
                  {p.a.map((parrafo, i) => (
                    <p key={i} className={`${i === 0 ? '' : 'mt-3'} text-[15px] leading-[1.6] text-cream/70`}>
                      {parrafo}
                    </p>
                  ))}
                  {/* Donde la respuesta resume algo que otra superficie
                      desarrolla —hoy, los términos del servicio—, se enlaza. Una
                      FAQ que explica una condición y no dice dónde está escrita
                      obliga a creérsela. Mismo gesto de flecha que el resto de la
                      web: «→» lleva a otro sitio de este dominio.
                      Sobre Night el acento es `gold` = Iris 400 (6,80:1); el
                      `gold-ink` de antes es Iris 700 y es para fondo claro. */}
                  {p.enlace && (
                    <p className="mt-4">
                      <Link
                        href={p.enlace.href}
                        /* `inline-block py-1` — este enlace es el ÚNICO hijo de su
                           párrafo, así que NO es «un enlace dentro de una frase» y
                           no le vale la exención de WCAG 2.2 AA 2.5.8. Medido en
                           producción a 168×19 px en móvil, por debajo del mínimo de
                           24; con el padding, 27. Mismo patrón que `Dominio` en
                           `Casos.tsx`, que ya lo documentaba. */
                        className="enlace-flecha inline-block py-1 text-[15px] font-600 text-gold underline decoration-gold/30 underline-offset-4 hover:decoration-gold transition-colors"
                      >
                        {p.enlace.texto}
                        <span className="enlace-flecha__flecha ml-1 no-underline" aria-hidden="true">→</span>
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
