import { Fragment } from 'react'
import Reveal from '@/components/Reveal'

/**
 * Revelado rectangular — una barra tapa cada línea y se retira.
 *
 * Técnica estudiada en «Rectangular Text Reveal» de ObsidianUI (MIT, ver
 * THIRD_PARTY_NOTICES.md) y REESCRITA: allí la parte GSAP + SplitText en
 * líneas, las oculta con `opacity: 0` y crea las barras en el DOM desde un
 * efecto. Aquí no hace falta nada de eso, y quitarlo arregla dos cosas:
 *
 *   1. Las líneas las decide quien escribe (`lineas`), no un algoritmo que
 *      mide el texto después de pintarlo. Son enunciados cortos: sus cortes se
 *      eligen, igual que los de un titular.
 *   2. Es un componente de SERVIDOR. Las barras salen en el HTML y el tiempo lo
 *      lleva el CSS (`globals.css`, bloque 1). Si React no hidratara nunca, la
 *      barra se retiraría igual: no hay ninguna ruta en la que tape el texto
 *      para siempre, que es el fallo que el umbral de esta web existe para
 *      impedir.
 *
 * `cargar`  — el hero. La barra está desde el primer pintado y se retira
 *             sincronizada con el umbral. El texto NUNCA pasa por opacity 0.
 * `entrar`  — un enunciado bajo el pliegue. Lo dispara un `Reveal` usado sólo
 *             como detector (`reveal--disparador`: sin su fundido propio). Ese
 *             `Reveal` es un `div`, así que va POR FUERA de la etiqueta del
 *             texto: un `div` dentro de un `<p>` es HTML inválido y el
 *             navegador lo repara partiendo el párrafo.
 *
 * Accesibilidad: las barras son `aria-hidden` y no reciben eventos. Entre las
 * líneas va un espacio real en el DOM, así que un lector de pantalla —y
 * cualquier extractor— lee la frase entera y no «Construimosy operamos».
 */
export default function RevealRect({
  lineas,
  al,
  como: Etiqueta = 'span',
  className = '',
  lineaClassName = '',
  color,
}: {
  lineas: readonly string[]
  al: 'cargar' | 'entrar'
  /** La etiqueta semántica del texto. `span` dentro de un titular; `p` suelto. */
  como?: 'span' | 'p'
  className?: string
  lineaClassName?: string
  /** Color de la barra. Por defecto Iris 700; en oscuro, Iris 400. */
  color?: string
}) {
  const texto = (
    <Etiqueta
      className={`rr block ${className}`}
      data-rr={al}
      style={color ? ({ '--rr-color': color } as React.CSSProperties) : undefined}
    >
      {lineas.map((linea, i) => (
        <Fragment key={linea}>
          <span className={`rr-linea ${lineaClassName}`} style={{ '--rr-i': i } as React.CSSProperties}>
            <span className="rr-texto">{linea}</span>
            <span className="rr-barra" aria-hidden="true" />
          </span>
          {/* El espacio vive FUERA del bloque: se colapsa en pantalla y queda en
              el texto. Sin él, `textContent` pega las dos líneas. */}
          {i < lineas.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Etiqueta>
  )

  if (al === 'cargar') return texto
  return <Reveal className="reveal--disparador">{texto}</Reveal>
}
