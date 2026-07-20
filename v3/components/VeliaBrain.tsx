/**
 * Identidad visual del Cerebro VELIA: una red de nodos abstracta, no un
 * cerebro anatómico ni un robot. SVG + CSS puro (sin WebGL, sin canvas,
 * sin dependencias) para que cargue instantáneo y funcione igual en móvil.
 *
 * Dos estados: `resting` (por defecto — respiración lenta, casi estática) y
 * `active` (pulso algo más vivo, para el momento en que la sección entra en
 * viewport). Las animaciones viven en globals.css bajo la misma media query
 * `prefers-reduced-motion: no-preference` que ya usa el resto de la web —
 * con reduced-motion activo, el cerebro se queda fijo en su frame de reposo.
 */
const NODES = [
  { x: 110, y: 42 },
  { x: 172, y: 78 },
  { x: 168, y: 148 },
  { x: 110, y: 182 },
  { x: 50, y: 148 },
  { x: 46, y: 78 },
]

export default function VeliaBrain({
  state = 'resting',
  className = '',
}: {
  state?: 'resting' | 'active'
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={`velia-brain ${state === 'active' ? 'velia-brain--active' : ''} ${className}`}
      role="img"
      aria-label="Representación del Cerebro VELIA: una red de nodos conectados alrededor de un núcleo central"
    >
      {/* Contención — anillo exterior, casi invisible */}
      <circle cx="110" cy="110" r="98" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

      {/* Líneas del núcleo a cada nodo */}
      <g strokeWidth="1">
        {NODES.map((n, i) => (
          <line
            key={`l-${i}`}
            x1="110" y1="110" x2={n.x} y2={n.y}
            stroke="currentColor" strokeOpacity="0.18"
          />
        ))}
      </g>

      {/* Líneas entre nodos vecinos — el "tejido" de la red */}
      <g strokeWidth="1">
        {NODES.map((n, i) => {
          const next = NODES[(i + 1) % NODES.length]
          return (
            <line
              key={`p-${i}`}
              x1={n.x} y1={n.y} x2={next.x} y2={next.y}
              stroke="currentColor" strokeOpacity="0.1"
            />
          )
        })}
      </g>

      {/* Dos líneas con luz viajando — profundidad, no decoración gratuita */}
      <line x1="110" y1="110" x2={NODES[0].x} y2={NODES[0].y} className="velia-brain-beam" stroke="#C9A96E" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="110" y1="110" x2={NODES[3].x} y2={NODES[3].y} className="velia-brain-beam velia-brain-beam--delay" stroke="#C9A96E" strokeWidth="1.4" strokeLinecap="round" />

      {/* Nodos satélite */}
      {NODES.map((n, i) => (
        <circle key={`n-${i}`} cx={n.x} cy={n.y} r="3.5" fill="currentColor" fillOpacity="0.55" />
      ))}

      {/* Núcleo — respira */}
      <circle cx="110" cy="110" r="10" fill="#C9A96E" className="velia-brain-core" />
      <circle cx="110" cy="110" r="10" fill="none" stroke="#C9A96E" strokeOpacity="0.35" className="velia-brain-core-ring" />
    </svg>
  )
}
