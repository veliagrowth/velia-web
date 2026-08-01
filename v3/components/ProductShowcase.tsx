'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { trackEvent } from '@/lib/analytics'

/**
 * Los cinco módulos del producto, cada uno con SU visual.
 *
 * QUÉ CAMBIÓ EL 1-AGO (feedback de Joaquín: «la captura que hay está
 * obsoleta»): antes había UNA captura fija al lado de una lista de cinco
 * módulos. Además de estar vieja, era estructuralmente pobre — la imagen no
 * tenía nada que ver con el módulo que estuvieras leyendo.
 *
 * Ahora cada módulo trae su propio visual y cambia al elegirlo. Las capturas se
 * han vuelto a tomar del despacho de demostración REAL, no del archivo.
 *
 * PREPARADO PARA VÍDEO: cada módulo admite `video`. Cuando existan las capturas
 * animadas de VELIA Legal, basta con añadir la ruta y este componente pinta el
 * vídeo en vez de la imagen —con la imagen de poster, `muted`, `playsInline` y
 * `loop`—. No hay que tocar nada más.
 *
 * REGLA QUE NO SE ROMPE: no se publica una captura del producto VACÍO. El
 * módulo de facturación de la demo enseña un pipeline a cero, y un visual que
 * dice «0 €, sin prospectos» convence de lo contrario de lo que se quiere
 * contar. Mientras no haya una captura con datos, ese módulo reutiliza la del
 * expediente —que sí enseña su bloque económico— en vez de enseñar el vacío.
 */

type Modulo = {
  id: string
  titulo: string
  cuerpo: string
  imagen: string
  alt: string
  /** Ruta a un .mp4 cuando exista la captura animada. Tiene prioridad. */
  video?: string
}

/* Las cinco capturas son de la demo REAL y se tomaron el 1-ago-2026, cada una
   de la pantalla que ese módulo describe. Ninguna es de archivo y ninguna
   enseña el producto vacío. Si se vuelven a tomar, que sea a 1440×900 @2x con
   el menú desplegado, que es como están todas. */
const MODULOS: Modulo[] = [
  {
    id: 'expedientes',
    titulo: 'Expedientes',
    cuerpo: 'Cada asunto con sus partes, su estado, su documentación y su economía en el mismo sitio.',
    imagen: '/screenshots/mod-expedientes.webp',
    alt: 'Listado de expedientes de un despacho en VELIA: cinco asuntos con su número, área, prioridad, cliente y fecha, y el resumen de abiertos, en proceso y vencidos arriba',
  },
  {
    id: 'documentos',
    titulo: 'Documentos',
    cuerpo: 'Plantillas del despacho, tus propios escritos y revisión de contratos: el material con el que VELIA trabaja.',
    imagen: '/screenshots/mod-documentos.webp',
    alt: 'Recursos legales en VELIA: plantillas de burofax, cartas al cliente, contratos, demandas, hojas de encargo y poderes, cada una con su área y su número de usos',
  },
  {
    id: 'plazos',
    titulo: 'Plazos y agenda',
    cuerpo: 'VELIA propone el cómputo con su cita textual; el vencimiento entra en la agenda cuando lo apruebas.',
    imagen: '/screenshots/mod-agenda.webp',
    alt: 'La agenda de un despacho en VELIA: tres plazos próximos con su expediente y su cliente, junto al calendario del mes con los vencimientos marcados',
  },
  {
    id: 'clientes',
    titulo: 'Clientes y portal',
    cuerpo: 'Cada cliente con sus asuntos, sus comunicaciones y su acceso al portal donde ve el estado y aporta lo que falta.',
    imagen: '/screenshots/mod-clientes.webp',
    alt: 'La ficha de contactos de un despacho en VELIA: cuatro clientes con su email, su teléfono y su estado, con buscador y filtros por columna',
  },
  {
    id: 'facturacion',
    titulo: 'Facturación',
    cuerpo: 'Honorarios, cobros y facturas enlazados al asunto que los ha generado.',
    imagen: '/screenshots/mod-facturacion.webp',
    alt: 'La facturación de un despacho en VELIA: total facturado, cobrado y pendiente de cobro, con cinco facturas y su estado de cobro y de emisión',
  },
]

export default function ProductShowcase() {
  const [activo, setActivo] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const elegir = (i: number) => {
    setActivo(i)
    trackEvent('product_tab_select', { selected_module: MODULOS[i].id })
  }

  // Patrón ARIA de tabs: flechas para moverse y solo la activa es tabulable.
  const enTeclado = (e: React.KeyboardEvent) => {
    const ultimo = MODULOS.length - 1
    let destino: number | null = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') destino = activo === ultimo ? 0 : activo + 1
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') destino = activo === 0 ? ultimo : activo - 1
    if (e.key === 'Home') destino = 0
    if (e.key === 'End') destino = ultimo
    if (destino === null) return
    e.preventDefault()
    elegir(destino)
    refs.current[destino]?.focus()
  }

  const m = MODULOS[activo]

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:items-center">
      {/* Visual. El contenedor reserva la proporción para que cambiar de módulo
          no mueva la página: sin esto cada cambio sería un salto de layout. */}
      <div className="order-2 lg:order-1">
        <div className="relative rounded-2xl overflow-hidden border border-mist bg-white shadow-sm aspect-[16/10]">
          {m.video ? (
            <video
              key={m.video}
              className="w-full h-full object-cover object-left-top"
              src={m.video}
              poster={m.imagen}
              autoPlay
              muted
              loop
              playsInline
              aria-label={m.alt}
            />
          ) : (
            <Image
              key={m.imagen}
              src={m.imagen}
              alt={m.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="ctx-in object-cover object-left-top"
            />
          )}
        </div>
        <p className="mt-3 text-[12px] text-void/55">Despacho de demostración con datos ficticios.</p>
      </div>

      {/* Módulos. En móvil van encima del visual (order-1) porque el texto es lo
          que se lee primero; en escritorio, a la derecha. */}
      <div className="order-1 lg:order-2">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Módulos de VELIA"
          onKeyDown={enTeclado}
          className="divide-y divide-mist border-y border-mist"
        >
          {MODULOS.map((mod, i) => {
            const abierto = activo === i
            return (
              <button
                key={mod.id}
                ref={el => { refs.current[i] = el }}
                role="tab"
                id={`mod-tab-${mod.id}`}
                aria-selected={abierto}
                aria-controls="mod-panel"
                tabIndex={abierto ? 0 : -1}
                onClick={() => elegir(i)}
                className="w-full text-left py-4 group"
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`w-1 h-1 rounded-full shrink-0 transition-colors duration-control ${
                      abierto ? 'bg-iris-focus' : 'bg-slate/50'
                    }`}
                  />
                  <span
                    className={`text-[15px] font-600 transition-colors duration-control ${
                      abierto ? 'text-void' : 'text-void/55 group-hover:text-void/80'
                    }`}
                  >
                    {mod.titulo}
                  </span>
                </span>
                {/* El cuerpo solo del módulo abierto: una lista de cinco
                    párrafos a la vez no es una lista, es un muro. */}
                {abierto && (
                  <span className="ctx-in block mt-2 pl-4 text-[13px] text-void/65 leading-[1.6] max-w-[46ch]">
                    {mod.cuerpo}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <div id="mod-panel" role="tabpanel" aria-labelledby={`mod-tab-${m.id}`} className="sr-only">
          {m.alt}
        </div>
      </div>
    </div>
  )
}
