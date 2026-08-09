'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * «La mesa del lunes» — el momento de marca del hero.
 *
 * QUÉ TIENE QUE ENTENDERSE EN 5 SEGUNDOS, SIN LEER NADA:
 * lo que hay suelto encima de una mesa un lunes por la mañana se ordena, cada
 * pieza deja de ser un FORMATO y pasa a ser lo que APORTA —Plazo, Cliente,
 * Importe— y todo acaba dentro de un expediente donde además se relaciona
 * entre sí. Esa última parte es la diferencia entre guardar y entender.
 *
 * POR QUÉ CAMBIÓ LA VERSIÓN ANTERIOR (9-ago-2026). La anterior tenía la idea
 * correcta y tres problemas de reloj y composición:
 *   · empezaba «en reposo» con las cuatro piezas ya colocadas y nombradas, así
 *     que el desorden —que es el problema que vive el abogado— no se veía nunca;
 *   · su clímax caía en el segundo 10,4 (5 fases × 2,6 s), o sea después del
 *     único momento que decide si alguien se queda;
 *   · cuatro tarjetas idénticas en rejilla 2×2 tienen la forma de un widget de
 *     dashboard: competía con un CRM en vez de diferenciarse de uno.
 *
 * Y TERMINA TRABAJANDO, NO ESPERANDO (decisión de Joaquín). El estado final no
 * dice «esperando tu confirmación»: dice lo que VELIA YA ha hecho. Sigue sin
 * decidir nada —«todo está preparado para que continúes» es del manual de voz—
 * pero el último fotograma es trabajo entregado, no un sistema en pausa. Ese
 * fotograma se queda fijo y hace de puente con el resto de la página: es la
 * primera imagen del producto, no una animación que se apaga.
 *
 * LO QUE NO SE VE AQUÍ Y ESTÁ A PROPÓSITO:
 *   · Ningún formato que el producto no lea. El Cerebro acepta PDF, DOCX, TXT,
 *     MD, CSV e imágenes; el correo entra por el buzón, no como .eml subido. No
 *     hay MP3 ni XLSX: anunciarlos sería prometer lo que el subidor rechaza.
 *   · El desorden nace en gris, sin color de marca. Si el desorden ya fuera
 *     bonito, ordenarlo no significaría nada.
 *
 * TÉCNICA: SVG + CSS. El reloj entero vive en globals.css; este componente solo
 * enciende `data-play` cuando la escena entra en pantalla y ofrece repetirla.
 * No hay Remotion, ni imágenes, ni fuentes nuevas, ni un solo re-render durante
 * los 9 segundos. El texto vive en el DOM: lo indexa un buscador y lo lee un
 * lector de pantalla, cosa que un vídeo con el mismo contenido no permite.
 *
 * ACCESIBILIDAD: el escenario es decorativo —todo lo que dice está en el titular
 * y el párrafo de al lado—, así que va `aria-hidden`. Con
 * `prefers-reduced-motion` arranca directamente en su fotograma final.
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
  { id: 'costas',       nom: 'Costas.csv',           aporta: 'Importe' },
] as const

/**
 * Geometría. `x/y` es el desorden de partida y `dx/dy` el destino ordenado, en
 * cqw (1 % del ancho de la escena) para que el movimiento sea el mismo a
 * cualquier tamaño. `ax/ay` es hacia dónde se va la pieza cuando el expediente
 * se la queda: hacia el centro, nunca hacia fuera — se la absorbe, no se tira.
 *
 * En móvil solo se pintan las TRES primeras (`mv`), con su propia composición:
 * escalar seis piezas a 358 px las deja ilegibles, y el relato aguanta con tres.
 */
const GEO = [
  { x: '1%',  y: '6%',  r: '-6deg', dx: '0cqw',  dy: '-1.5cqw',  ax: '17cqw',  ay: '11cqw',  mv: { x: '2%',  y: '4%'  } },
  { x: '35%', y: '0%',  r: '5deg',  dx: '0cqw',  dy: '3.4cqw',   ax: '4cqw',   ay: '11cqw',  mv: null },
  { x: '69%', y: '8%',  r: '-4deg', dx: '0cqw',  dy: '-1.1cqw',  ax: '-17cqw', ay: '11cqw',  mv: { x: '52%', y: '4%'  } },
  { x: '2%',  y: '57%', r: '4deg',  dx: '0cqw',  dy: '1.5cqw',   ax: '17cqw',  ay: '-11cqw', mv: null },
  { x: '34%', y: '65%', r: '-5deg', dx: '1cqw',  dy: '-4.5cqw',  ax: '4cqw',   ay: '-11cqw', mv: { x: '27%', y: '74%' } },
  { x: '69%', y: '56%', r: '3deg',  dx: '0cqw',  dy: '2.2cqw',   ax: '-17cqw', ay: '-11cqw', mv: null },
] as const

/** Trazas: del centro de cada pieza ya ordenada al borde de la órbita. La
 *  tarjeta se pinta ENCIMA del SVG, así que la línea parece salir de su borde. */
const TRAZAS = [
  { d: 'M54.4 34.8 L141.3 104.9', len: 112, movil: true },
  { d: 'M160 34.8 L160 96',       len: 62,  movil: false },
  { d: 'M265.6 34.8 L178.7 104.9',len: 112, movil: true },
  { d: 'M54.4 159.6 L137.5 128.4',len: 89,  movil: false },
  { d: 'M160 159.6 L160 144',     len: 16,  movil: true },
  { d: 'M265.6 159.6 L182.5 128.4',len: 89, movil: false },
] as const

const DURACION_MS = 9000

export default function HeroContextStage() {
  const [reducido, setReducido] = useState(false)
  const escena = useRef<HTMLDivElement>(null)
  const arrancado = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aplicar = () => setReducido(mq.matches)
    aplicar()
    mq.addEventListener('change', aplicar)
    return () => mq.removeEventListener('change', aplicar)
  }, [])

  // Arranca una sola vez, cuando de verdad se está viendo. No se gasta hilo
  // principal animando algo fuera de pantalla, y no se le roba el primer
  // pintado al titular, que es el elemento LCP.
  useEffect(() => {
    const el = escena.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !arrancado.current) {
          arrancado.current = true
          el.dataset.play = 'true'
          obs.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const repetir = useCallback(() => {
    const el = escena.current
    if (!el) return
    delete el.dataset.play
    // Un reflow forzado entre quitar y poner: sin esto el navegador agrupa las
    // dos mutaciones y las animaciones no se reinician.
    void el.offsetWidth
    el.dataset.play = 'true'
    trackEvent('hero_context_interaction', { interaction_type: 'restart' })
  }, [])

  return (
    <div>
      <div ref={escena} className="mesa" aria-hidden="true">
        {/* Intelligence Traces: la línea que hace visible «relaciona», que en
            texto no se ve. `preserveAspectRatio="none"` NO: deformaría el
            grosor; la caja ya es 16:12 y el viewBox también. */}
        <svg className="mesa-svg" viewBox="0 0 320 240" fill="none">
          <g stroke="#8D90FA" strokeWidth="1" strokeLinecap="round">
            {TRAZAS.map((t, i) => (
              <path
                key={i}
                className={`mesa-tz ${t.movil ? '' : 'mesa-solo-sm'}`}
                d={t.d}
                style={{ ['--len' as string]: t.len, ['--t2' as string]: `${3.5 + i * 0.11}s` }}
              />
            ))}
          </g>
        </svg>

        <div className="mesa-orb" />
        <div className="mesa-nodo">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <radialGradient id="mesa-core" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#B5DFFF" />
                <stop offset="55%" stopColor="#949AF8" />
                <stop offset="100%" stopColor="#7479F2" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="20" fill="url(#mesa-core)" />
          </svg>
        </div>

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
                ['--t1' as string]: `${2.2 + i * 0.1}s`,
                ['--t2' as string]: `${4.1 + i * 0.11}s`,
              }}
            >
              <span className="l" />
              <span className="l c" />
              <span className="apo" style={{ ['--t2' as string]: `${4.1 + i * 0.11}s` }}>
                {p.aporta}
              </span>
              <span className="nom">{p.nom}</span>
            </div>
          )
        })}

        {/* El fotograma final. Es la primera imagen del producto y se queda:
            de aquí sale el resto de la página. */}
        <div className="mesa-win">
          <div className="cab">
            <span className="exp">Expediente 2026/184</span>
            <span className="est">Reclamación</span>
          </div>

          <div className="cuerpo">
            {/* Las relaciones entre filas. Van en su canalón: dibujarlas por
                detrás de la ventana sería pintarlas donde nadie las ve. */}
            <svg className="rel" viewBox="0 0 12 100" preserveAspectRatio="none" fill="none">
              <g stroke="#7479F2" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <path className="mesa-rel" d="M12 12 H6 Q2 12 2 22 V52 Q2 62 6 62 H12" opacity="0.85" style={{ ['--len' as string]: 90, ['--t3' as string]: '6.4s' }} />
                <path className="mesa-rel" d="M12 37 H8 Q6 37 6 46 V78 Q6 87 8 87 H12" opacity="0.5" style={{ ['--len' as string]: 90, ['--t3' as string]: '6.8s' }} />
              </g>
            </svg>
            <div className="fila"><b>Notificación</b><span>4 páginas</span></div>
            <div className="fila"><b>Martínez Ferrer, S.L.</b><span>cliente</span></div>
            <div className="fila"><b>Vencimiento</b><span>20 días hábiles</span></div>
            <div className="fila"><b>Costas</b><span>1.240,00 €</span></div>
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

      {/* Fuera del aria-hidden: son controles de verdad. */}
      <div className="mt-3 flex items-center gap-4">
        {!reducido && (
          <button
            type="button"
            onClick={repetir}
            className="text-[11px] font-600 tracking-[0.04em] text-cream/50 hover:text-cream/85 transition-colors duration-control"
          >
            Ver desde el principio
          </button>
        )}
        <span className="ml-auto text-[11px] text-cream/35">Datos ficticios</span>
      </div>
    </div>
  )
}
