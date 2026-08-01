import { claim } from '@/lib/verified-claims'
import IrisNode from './IrisNode'

/**
 * Seguridad — «Construida para guardar secretos».
 *
 * Sin candados gigantes. Lo que hay que enseñar es la ARQUITECTURA: dos
 * despachos que no se ven entre sí, y qué sale y qué vuelve cuando se consulta
 * a un modelo. Un candado no dice nada de eso; un diagrama, sí.
 *
 * Los tres pilares salen de `verified-claims`. Si una afirmación no está en
 * estado `verified`, `claim()` devuelve null y el pilar NO SE PINTA — no se
 * queda un hueco ni un texto genérico. La regla es del encargo (§16) y ya
 * existía en el repo antes: aquí solo se respeta.
 *
 * Componente de servidor: no hay estado ni interacción, así que no hay razón
 * para mandar JavaScript al navegador por esto.
 */

const PILARES = [
  {
    titulo: 'Aislamiento por despacho',
    id: 'tenantIsolation' as const,
  },
  {
    titulo: 'Fuentes oficiales verificables',
    id: 'officialSources' as const,
  },
  {
    titulo: 'Supervisión profesional',
    id: 'humanSupervision' as const,
  },
]

export default function SecurityArchitecture() {
  const pilares = PILARES.map(p => ({ ...p, texto: claim(p.id) })).filter(
    (p): p is { titulo: string; id: typeof PILARES[number]['id']; texto: string } => Boolean(p.texto),
  )

  return (
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      {/* Diagrama: dos despachos separados, y la consulta al modelo saliendo y
          volviendo sin llevarse el expediente puesto. */}
      {/* El viewBox creció de 260 a 300 de alto: la frase del pie estaba a y=238
          y las cajas de despacho terminan en y=240, así que se pintaba ENCIMA de
          la caja de «Despacho B». Se le da su propia banda por debajo del
          diagrama en vez de recolocarla a ojo dentro. */}
      <div aria-hidden="true" className="hidden lg:block">
        <svg viewBox="0 0 360 300" className="w-full h-auto text-cream">
          {/* Despacho A y B: cajas que NO se tocan. Que no haya ni una línea
              entre ellas es literalmente el mensaje de la sección. */}
          {[
            { y: 20, etiqueta: 'Despacho A' },
            { y: 150, etiqueta: 'Despacho B' },
          ].map(d => (
            <g key={d.etiqueta}>
              <rect x="8" y={d.y} width="140" height="90" rx="12" fill="currentColor" opacity="0.05" stroke="currentColor" strokeOpacity="0.18" />
              <text x="26" y={d.y + 28} fill="currentColor" opacity="0.85" style={{ fontSize: 12, fontWeight: 600 }}>
                {d.etiqueta}
              </text>
              {['Expedientes', 'Documentos', 'Clientes'].map((t, i) => (
                <text key={t} x="26" y={d.y + 48 + i * 15} fill="currentColor" opacity="0.45" style={{ fontSize: 10 }}>
                  {t}
                </text>
              ))}
            </g>
          ))}

          {/* Solo el despacho activo consulta. La flecha de vuelta es la
              respuesta; no vuelve con nada más. */}
          <line x1="148" y1="65" x2="248" y2="112" stroke="#7479F2" strokeWidth="1.4" opacity="0.8" />
          <line x1="248" y1="132" x2="148" y2="176" stroke="#B5DFFF" strokeWidth="1.4" opacity="0.55" strokeDasharray="3 4" />

          <g>
            <rect x="228" y="92" width="120" height="60" rx="12" fill="currentColor" opacity="0.05" stroke="#7479F2" strokeOpacity="0.35" />
            <foreignObject x="240" y="104" width="36" height="36">
              <IrisNode state="analizando" className="w-full h-full text-cream" />
            </foreignObject>
            <text x="284" y="118" fill="currentColor" opacity="0.85" style={{ fontSize: 11, fontWeight: 600 }}>
              Consulta
            </text>
            <text x="284" y="133" fill="currentColor" opacity="0.45" style={{ fontSize: 10 }}>
              al modelo
            </text>
          </g>

          {/* Banda propia, por debajo de todo el diagrama (las cajas acaban en
              y=240). Una línea fina la separa para que se lea como pie y no
              como una etiqueta suelta flotando. */}
          <line x1="8" y1="266" x2="352" y2="266" stroke="currentColor" strokeOpacity="0.10" strokeWidth="1" />
          <text x="180" y="286" textAnchor="middle" fill="currentColor" opacity="0.45" style={{ fontSize: 11 }}>
            Ningún despacho ve la información de otro.
          </text>
        </svg>
      </div>

      <div>
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85 mb-3">
          Seguridad y control
        </p>
        <h2 className="text-3xl md:text-4xl font-600 tracking-[-0.03em] text-cream max-w-[20ch]">
          Construida para guardar secretos.
        </h2>
        <p className="mt-5 text-[15px] text-cream/70 leading-[1.6] max-w-[46ch]">
          La arquitectura parte de una premisa: los datos pertenecen al despacho y el criterio
          pertenece al abogado.
        </p>

        <dl className="mt-9 space-y-6">
          {pilares.map(p => (
            <div key={p.id} className="border-t border-white/10 pt-5">
              <dt className="text-[14px] font-600 text-cream">{p.titulo}</dt>
              <dd className="mt-1.5 text-[13px] text-cream/60 leading-[1.6] max-w-[52ch]">{p.texto}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
