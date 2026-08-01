/**
 * El Iris Node — cómo se representa VELIA pensando.
 *
 * Es UN objeto con tres estados, no tres dibujos. Lo que comunica no es la
 * forma sino el estado, y por eso va en un `data-state` legible en el DOM:
 *
 *   reposo      · está ahí, no está haciendo nada. Respiración muy lenta.
 *   analizando  · está trabajando ahora. Respira el doble de rápido + halo.
 *   esperando   · ha terminado y espera al profesional. Quieto y brillante.
 *
 * El tercero es el importante: es la traducción visual de «VELIA prepara, tú
 * decides». Un sistema que sigue animándose mientras espera una decisión humana
 * está diciendo que sigue trabajando, y no es verdad.
 *
 * SVG + CSS, sin canvas ni WebGL ni dependencias: pesa lo que pesa el markup y
 * funciona igual en un iPhone que en un portátil. Toda la animación vive en
 * globals.css bajo `prefers-reduced-motion: no-preference`; en reposo reducido
 * queda un dibujo fijo perfectamente legible.
 */

export type IrisState = 'reposo' | 'analizando' | 'esperando'

export default function IrisNode({
  state = 'reposo',
  className = '',
  title,
}: {
  state?: IrisState
  className?: string
  /** Si se pasa, el SVG deja de ser decorativo y se anuncia. */
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`iris-node ${className}`}
      data-state={state}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <radialGradient id="iris-core" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#B5DFFF" />
          <stop offset="55%" stopColor="#949AF8" />
          <stop offset="100%" stopColor="#7479F2" />
        </radialGradient>
      </defs>

      {/* Halo: solo existe visualmente mientras analiza. */}
      <circle className="iris-node-halo" cx="32" cy="32" r="13" fill="none" stroke="#7479F2" strokeWidth="1" opacity="0" />

      {/* Órbita de contexto: la envoltura estable, no se anima nunca. Es lo que
          hace que el núcleo se lea como «dentro de algo», que es la idea. */}
      <circle cx="32" cy="32" r="21" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.28" />
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.14" />

      {/* Cuatro anclas: las piezas de contexto que orbitan el asunto. */}
      {[
        [32, 11],
        [53, 32],
        [32, 53],
        [11, 32],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.9" fill="currentColor" opacity="0.42" />
      ))}

      <circle className="iris-node-core" cx="32" cy="32" r="9" fill="url(#iris-core)" />
    </svg>
  )
}
