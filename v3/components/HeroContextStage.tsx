'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * «La mesa del lunes» — el momento de marca del hero.
 *
 * QUÉ TIENE QUE ENTENDERSE EN 5 SEGUNDOS, SIN LEER NADA:
 * lo que hay suelto encima de una mesa un lunes por la mañana se ordena, cada
 * pieza deja de ser un FORMATO y pasa a ser lo que APORTA —Plazo, Cláusulas,
 * Importe— y todo acaba dentro de un expediente donde además se relaciona
 * entre sí. Esa última parte es la diferencia entre guardar y entender.
 *
 * ══ REV2 (9-ago-2026) ══════════════════════════════════════════════════════
 *
 * EL CENTRO ES EL SÍMBOLO, NO UNA ESFERA. La primera versión ponía en el
 * centro un círculo con un núcleo luminoso, y eso no dice VELIA: dice «IA».
 * Es la misma imagen que hay en la portada de cualquier SaaS de inteligencia
 * artificial, y la pieza tiene que ser reconocible aunque se le quite el
 * texto. Ahora el centro son las dos astas y el punto del símbolo, con la
 * geometría EXACTA de brand/assets/logo/velia-symbol-iris.svg — no redibujada
 * a mano, que es lo que el manual prohíbe.
 *
 * Y no es un logo pegado en medio: las astas se levantan durante la
 * convergencia como estructura, en crema apagado, y el punto SOLO se enciende
 * —en Soft Iris, plano— cuando las seis trazas han llegado. La marca se
 * completa en el instante en que aparece el significado. Esa es la diferencia
 * entre poner el logo y que el logo sea parte de lo que se cuenta.
 *
 * De paso corrige una infracción: el degradado radial de la esfera era un
 * acabado PROHIBIDO sobre el símbolo («gradientes, sombras, brillos, contornos
 * o 3D», sección 04 del manual).
 *
 * ══════════════════════════════════════════════════════════════════════════
 *
 * TERMINA TRABAJANDO, NO ESPERANDO. El estado final no dice «esperando tu
 * confirmación»: dice lo que VELIA YA ha hecho, y se sostiene 2,5 segundos
 * para que dé tiempo a leerlo. Sigue sin decidir nada —relaciona, encuentra,
 * prepara— porque decidir es del abogado.
 *
 * LO QUE NO SE VE Y ESTÁ A PROPÓSITO:
 *   · Ningún formato que el producto no lea. El Cerebro acepta PDF, DOCX, TXT,
 *     MD, CSV e imágenes; el correo entra por el buzón, no como .eml subido.
 *   · El desorden nace en gris. Si el desorden ya fuera bonito, ordenarlo no
 *     significaría nada.
 *
 * TÉCNICA: SVG + CSS. El ciclo entero de 12 s vive en globals.css como un
 * único track por elemento, en bucle. Este componente solo enciende, pausa y
 * para cuando la escena no se ve. Cero re-renders mientras corre, cero
 * imágenes, cero fuentes nuevas.
 *
 * ACCESIBILIDAD: el escenario es decorativo —todo lo que dice está en el
 * titular y el párrafo de al lado—, así que va `aria-hidden`. El botón de
 * pausa NO es un adorno: WCAG 2.2.2 lo exige en cuanto algo se mueve solo más
 * de cinco segundos. Con `prefers-reduced-motion` no hay bucle: se queda en el
 * fotograma final.
 */

/** Las seis piezas. `aporta` es el salto que da la pieza: de nombre de archivo
 *  a papel que juega dentro del asunto. Es lo que separa esto de una animación
 *  de «sube tus documentos». */
const PIEZAS = [
  { id: 'notificacion', nom: 'Notificación.pdf',     aporta: 'Plazo' },
  { id: 'contrato',     nom: 'Contrato.docx',        aporta: 'Cláusulas' },
  { id: 'correo',       nom: 'Correo de Martínez',   aporta: 'Cliente' },
  { id: 'nota',         nom: 'Nota de la vista.txt', aporta: 'Antecedente' },
  { id: 'acta',         nom: 'Foto del acta.jpg',    aporta: 'Prueba' },
  { id: 'costas',       nom: 'Honorarios.csv',           aporta: 'Importe' },
] as const

/**
 * Geometría. Las columnas van a 1 / 35,5 / 70 % con 29 % de ancho, así que sus
 * centros caen en 15,5 / 50 / 84,5 %: simétricos respecto al eje vertical.
 * Las filas arrancan en 8 % y 73 %, simétricas respecto al 50 % — la versión
 * anterior las tenía en 6 % y 57 %, con lo que el bloque de piezas quedaba
 * centrado en el 40 % mientras el punto estaba en el 50 %. Se notaba y no se
 * sabía por qué.
 *
 * `dx/dy` (destino ordenado) y `ax/ay` (hacia dónde se va al absorberla) van en
 * cqw, 1 % del ancho de la escena, para que el movimiento sea el mismo a
 * cualquier tamaño.
 *
 * En móvil solo se pintan las TRES primeras (`mv`), con su propia composición
 * —dos arriba y una abajo, también simétricas—: escalar seis piezas a 358 px
 * las deja ilegibles, y el relato aguanta con tres.
 */
/* Los `dy` NO son a ojo: 1 cqw es el 1 % del ancho y la escena es 16:12, así
   que 1 cqw = 0,75 % del alto. Cada pieza lleva el desplazamiento exacto que
   la lleva de su posición desordenada a su fila —arriba 8 %, abajo 72,5 %—,
   que es lo que hace que las dos filas queden simétricas respecto al punto.
   La versión anterior dejaba las filas escalonadas y las seis distancias al
   centro salían distintas: 217 / 127 / 217 contra 214 / 121 / 214. */
const GEO = [
  { x: '1%',    y: '9.3%',  r: '-6deg', dx: '0cqw', dy: '0cqw',     ax: '17cqw',  ay: '13cqw',  mv: { x: '28%', y: '7%'  } },
  { x: '35.5%', y: '3.3%',  r: '5deg',  dx: '0cqw', dy: '4.5cqw',   ax: '0cqw',   ay: '13cqw',  mv: null },
  { x: '70%',   y: '10.3%', r: '-4deg', dx: '0cqw', dy: '-0.75cqw', ax: '-17cqw', ay: '13cqw',  mv: { x: '28%', y: '70%' } },
  { x: '1%',    y: '73.3%', r: '4deg',  dx: '0cqw', dy: '0cqw',     ax: '17cqw',  ay: '-13cqw', mv: null },
  { x: '35.5%', y: '79.3%', r: '-5deg', dx: '0cqw', dy: '-4.5cqw',  ax: '0cqw',   ay: '-13cqw', mv: null },
  { x: '70%',   y: '72.3%', r: '3deg',  dx: '0cqw', dy: '0.75cqw',  ax: '-17cqw', ay: '-13cqw', mv: null },
] as const

/**
 * Las seis Intelligence Traces. Salen del centro de cada pieza ya ordenada
 * —la tarjeta se pinta ENCIMA, así que la línea parece nacer de su borde— y
 * mueren a 7 unidades del punto del símbolo, que está en el centro geométrico
 * exacto de la escena (160 · 120). Los seis finales son simétricos dos a dos.
 */
const TRAZAS = [
  { d: 'M49.6 39.6 L154.3 115.9',  len: 130, movil: false },
  { d: 'M160 39.6 L160 113',       len: 74,  movil: true },
  { d: 'M270.4 39.6 L165.7 115.9', len: 130, movil: false },
  { d: 'M49.6 198 L154.3 124',     len: 129, movil: false },
  { d: 'M160 198 L160 127',        len: 72,  movil: true },
  { d: 'M270.4 198 L165.7 124',    len: 129, movil: false },
] as const

/**
 * El símbolo, colocado por cálculo y no a ojo: la escala es 0,156 y la
 * traslación es la que lleva el punto del logotipo —que en el fichero de marca
 * está en (156,91 · 301,22)— justo al centro (160 · 120). Ni se gira, ni se
 * inclina, ni se le cambian las proporciones: el manual lo prohíbe y además es
 * lo que hace que se reconozca.
 */
const MARCA = { s: 0.17, tx: 133.33, ty: 68.79 }

export default function HeroContextStage() {
  const [reducido, setReducido] = useState(false)
  const [pausa, setPausa] = useState(false)
  const escena = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aplicar = () => setReducido(mq.matches)
    aplicar()
    mq.addEventListener('change', aplicar)
    return () => mq.removeEventListener('change', aplicar)
  }, [])

  // Arranca al entrar en pantalla y se PARA al salir: un bucle infinito que
  // sigue corriendo tres pantallas más abajo es hilo principal tirado a la
  // basura, y en un móvil eso es batería.
  useEffect(() => {
    const el = escena.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.dataset.play = 'true'
    const obs = new IntersectionObserver(
      ([e]) => { el.dataset.fuera = e.isIntersecting ? 'false' : 'true' },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const alternarPausa = useCallback(() => {
    setPausa(p => {
      trackEvent('hero_context_interaction', { interaction_type: p ? 'resume' : 'pause' })
      return !p
    })
  }, [])

  return (
    <div>
      <div ref={escena} className="mesa" aria-hidden="true" data-pausa={pausa ? 'true' : 'false'}>
        <svg className="mesa-svg" viewBox="0 0 320 240" fill="none">
          {/* Las trazas van DEBAJO del símbolo: mueren detrás de él, no encima. */}
          <g stroke="#8D90FA" strokeWidth="1" strokeLinecap="round">
            {TRAZAS.map((t, i) => (
              <path
                key={i}
                className={`mesa-tz ${t.movil ? '' : 'mesa-solo-sm'}`}
                d={t.d}
                style={{ ['--len' as string]: t.len, ['--t0' as string]: `${i * 0.09}s` }}
              />
            ))}
          </g>

          {/* El símbolo de VELIA. Geometría exacta del fichero de marca. */}
          <g transform={`translate(${MARCA.tx} ${MARCA.ty}) scale(${MARCA.s})`}>
            <g
              className="mesa-marca"
              fill="#F6F7FA"
              stroke="#F6F7FA"
              strokeWidth="5.79047"
              strokeMiterlimit="10"
            >
              <path d="M156.91035,311.86381c-3.32518,0-7.3154-2.66016-7.98044-4.65526L3.952,17.25273C1.29186,12.59748,3.952,6.61215,8.60726,3.952s10.64058,0,12.63569,4.65525L166.22086,297.89805c2.66014,4.65526,0,10.64057-4.65526,12.6357-1.9951,0-3.32517,1.33005-4.65525,1.33005Z" />
              <path d="M156.91035,311.86381c-1.33008,0-2.66014,0-4.65526-1.33008-4.65526-2.66016-6.65036-7.98044-4.65526-12.6357L292.57776,8.60726c2.66016-4.65525,7.98044-7.3154,12.6357-4.65525s7.31539,7.98043,4.65526,12.63569L165.55583,305.87849c-1.33008,3.32518-4.65526,5.98531-8.64548,5.98531Z" />
            </g>
            {/* El punto. Color plano: ni degradado, ni halo, ni sombra. */}
            <circle className="mesa-punto" cx="156.91035" cy="301.22323" r="26.60145" fill="#7479F2" />
          </g>
        </svg>

        {PIEZAS.map((p, i) => {
          const g = GEO[i]
          return (
            <div
              key={p.id}
              className={`mesa-pz ${g.mv ? '' : 'mesa-solo-sm'}`}
              style={{
                // Dos juegos de coordenadas, no uno elegido en JS: un estilo en
                // línea NO se puede sobrescribir con una media query, así que si
                // aquí se decidiera el breakpoint, la composición de móvil se
                // colaría en escritorio. Quien elige es el CSS.
                ['--x-sm' as string]: g.x,
                ['--y-sm' as string]: g.y,
                ['--x-mv' as string]: g.mv?.x ?? g.x,
                ['--y-mv' as string]: g.mv?.y ?? g.y,
                ['--r' as string]: g.r,
                ['--dx' as string]: g.dx,
                ['--dy' as string]: g.dy,
                ['--ax' as string]: g.ax,
                ['--ay' as string]: g.ay,
                ['--t0' as string]: `${i * 0.09}s`,
              }}
            >
              <span className="l" />
              <span className="l c" />
              <span className="apo">{p.aporta}</span>
              <span className="nom">{p.nom}</span>
            </div>
          )
        })}

        {/* EL ACTO DE PRODUCTO. Nace del punto y responde la tercera pregunta
            —¿dónde acaba todo esto?— con la única respuesta que vale: dentro
            del expediente, en VELIA, listo para trabajar.

            Cada dato lleva DE QUÉ ARCHIVO SALE. Ahí está el remate del relato:
            el espectador ve que «Notificación.pdf» ha dejado de ser un archivo
            y ahora es un vencimiento de 20 días hábiles dentro del asunto. Eso
            es lo que un abogado entiende sin leer una palabra de copy, y lo que
            separa esto de una animación de «IA que conecta cosas». */}
        <div className="mesa-win">
          <div className="cab">
            <span className="marcaprod">
              <svg viewBox="0 0 313.82071 327.82469" aria-hidden="true">
                <g fill="#0D1017" stroke="#0D1017" strokeWidth="5.79047" strokeMiterlimit="10">
                  <path d="M156.91035,311.86381c-3.32518,0-7.3154-2.66016-7.98044-4.65526L3.952,17.25273C1.29186,12.59748,3.952,6.61215,8.60726,3.952s10.64058,0,12.63569,4.65525L166.22086,297.89805c2.66014,4.65526,0,10.64057-4.65526,12.6357-1.9951,0-3.32517,1.33005-4.65525,1.33005Z" />
                  <path d="M156.91035,311.86381c-1.33008,0-2.66014,0-4.65526-1.33008-4.65526-2.66016-6.65036-7.98044-4.65526-12.6357L292.57776,8.60726c2.66016-4.65525,7.98044-7.3154,12.6357-4.65525s7.31539,7.98043,4.65526,12.63569L165.55583,305.87849c-1.33008,3.32518-4.65526,5.98531-8.64548,5.98531Z" />
                </g>
                <circle cx="156.91035" cy="301.22323" r="26.60145" fill="#7479F2" />
              </svg>
              <b>VELIA</b>
            </span>
            <span className="est">Expediente 2026/184</span>
          </div>

          <div className="cuerpo">
            <div className="dato mesa-fila mesa-solo-360" style={{ ['--t0' as string]: '0s' }}>
              <span className="linea"><span className="k">Cliente</span><span className="v">Martínez Ferrer, S.L.</span></span>
              <span className="de">de Correo de Martínez</span>
            </div>
            <div className="dato mesa-fila" style={{ ['--t0' as string]: '0.3s' }}>
              <span className="linea"><span className="k">Vencimiento</span><span className="v">20 días hábiles</span></span>
              <span className="de">de Notificación.pdf</span>
            </div>
            <div className="dato mesa-fila mesa-solo-sm" style={{ ['--t0' as string]: '0.6s' }}>
              <span className="linea"><span className="k">Honorarios</span><span className="v">1.240,00 €</span></span>
              <span className="de">de Honorarios.csv</span>
            </div>
          </div>

          <div className="cierre mesa-cierre">
            <span className="marca-est"><i />Contexto actualizado</span>
            <p className="dice">
              He relacionado los seis documentos con el asunto y he encontrado un vencimiento.
              Todo está preparado para que continúes.
            </p>
          </div>
        </div>
      </div>

      {/* Fuera del aria-hidden: es un control de verdad, y obligatorio. */}
      <div className="mt-3 flex items-center gap-4">
        {!reducido && (
          <button
            type="button"
            onClick={alternarPausa}
            className="text-[11px] font-600 tracking-[0.04em] text-cream/50 hover:text-cream/85 transition-colors duration-control"
          >
            {pausa ? 'Reanudar' : 'Pausar'}
            <span className="sr-only"> la secuencia de demostración</span>
          </button>
        )}
        <span className="ml-auto text-[11px] text-cream/35">Datos ficticios</span>
      </div>
    </div>
  )
}
