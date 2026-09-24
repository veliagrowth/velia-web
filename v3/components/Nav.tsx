'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { APP_URL } from '@/lib/constants'
import { HEADER_LINKS } from '@/lib/navigation'
import { CTA_CONTACTO } from '@/lib/cta'
import { trackEvent } from '@/lib/analytics'
import BotonAccion from '@/components/BotonAccion'

/**
 * Header — una superficie de control compacta.
 *
 * ── QUÉ CAMBIA EL 22-sep, Y DE DÓNDE SALE ─────────────────────────────────
 * Estudiado en obsidianui.dev MIDIENDO su cabecera, no mirándola: 52 px de
 * alto, sin blur, sin sombra, sin radio, y los enlaces en cajas de 32 px donde
 * el activo RELLENA el fondo. El indicador es el relleno; no hay subrayado que
 * viaje ni pastilla que deslice.
 *
 * Aquí la barra baja de 64 a 56 px y los cuatro enlaces entran en un CARRIL
 * hundido. Ese carril es la única licencia sobre la referencia, y es
 * deliberada: convierte cuatro enlaces sueltos en UN control —una pieza de
 * hardware, no una lista— y da la sensación de superficie física sin
 * desprender la barra de la página.
 *
 * ⚠️ NO se hizo flotante. Se consideró: una barra despegada con sombra y radio
 * es el cliché que el propio encargo pide evitar, y además tapa contenido en
 * cuanto la ventana es baja. La referencia tampoco flota — eso era una
 * suposición del encargo, y al medirla resultó ser una barra `sticky` normal.
 *
 * ── EL ESTADO ACTIVO ES REAL ──────────────────────────────────────────────
 * Lo decide un `IntersectionObserver` sobre las secciones que los enlaces
 * apuntan, con una franja estrecha a la altura de lectura. Arriba del todo no
 * hay ninguno activo, y eso es correcto: el hero no es ninguna de las cuatro
 * secciones, y fingir que sí lo es sería un indicador que miente.
 *
 * El relleno y el `aria-current` son EL MISMO atributo: quien ve el relleno y
 * quien usa un lector de pantalla reciben la misma información, y no pueden
 * divergir porque no son dos cosas.
 *
 * ── LO QUE SE RETIRÓ, Y POR QUÉ ───────────────────────────────────────────
 * Toda la rama de «tinta clara sobre hero oscuro». El comentario que había aquí
 * decía «hoy sólo la home lo tiene», y era FALSO desde que el rework puso el
 * hero en Pearl Cloud: medido con un grep, NINGUNA página declara
 * `[data-hero="dark"]`. Era una rama inalcanzable y, por tanto, nunca probada —
 * código que existe no es funcionalidad que existe. Si algún día vuelve un hero
 * oscuro, vuelve con ella, probada.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activo, setActivo] = useState<string | null>(null)
  const pathname = usePathname()
  const menuBtn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  // Fondo sólido al bajar; casi transparente sobre el arranque de la página.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Qué sección se está leyendo. La franja `-42% / -53%` es una banda de un 5 %
     a la altura donde de verdad se lee: con el criterio habitual —«la sección
     que ocupa más pantalla»— dos secciones consecutivas se turnan el indicador
     a cada rueda del ratón, y un indicador que parpadea es peor que ninguno.

     Sólo corre en la Home, que es donde los enlaces son anclas. En el resto de
     páginas no hay nada que observar y el estado se limpia: un indicador
     heredado de otra página señalaría a un sitio donde no estás. */
  useEffect(() => {
    setActivo(null)
    if (pathname !== '/') return
    const ids = HEADER_LINKS.filter(l => l.href.startsWith('/#')).map(l => l.href.slice(2))
    const secciones = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!secciones.length || typeof IntersectionObserver === 'undefined') return

    const dentro = new Set<string>()
    const io = new IntersectionObserver(
      entradas => {
        for (const e of entradas) {
          if (e.isIntersecting) dentro.add(e.target.id)
          else dentro.delete(e.target.id)
        }
        setActivo(ids.find(id => dentro.has(id)) ?? null)
      },
      { rootMargin: '-42% 0px -53% 0px', threshold: 0 },
    )
    for (const s of secciones) io.observe(s)
    return () => io.disconnect()
  }, [pathname])

  // Menú móvil: bloquea el scroll de fondo, cierra con Escape y DEVUELVE EL FOCO
  // al botón que lo abrió. Sin lo último, al cerrar el foco se va al principio del
  // documento y quien navega con teclado tiene que recorrerlo entero otra vez.
  useEffect(() => {
    if (!open) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab' || !panel.current) return
      const focusables = panel.current.querySelectorAll<HTMLElement>('a[href], button')
      if (!focusables.length) return
      const primero = focusables[0]
      const ultimo = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
      menuBtn.current?.focus()
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-panel ease-velia ${
        scrolled ? 'bg-cream/90 backdrop-blur-md border-mist' : 'bg-cream/70 backdrop-blur-sm border-transparent'
      }`}
    >
      {/* REJILLA de tres columnas con posición EXPLÍCITA, no `justify-between`
          (22-sep): el carril queda centrado en la barra pase lo que pase, y un
          elemento oculto (`hidden`) no descoloca a los demás porque no compite
          por una columna — la tiene asignada.

          ⚠️ Se probó esperando que además quitara el desplazamiento horizontal
          de la barra al cargar la fuente. NO LO QUITA, medido antes y después:
          0,0046 las dos veces, y la barra sigue apareciendo como fuente del
          desplazamiento. La columna central se dimensiona por su contenido, y
          ese contenido es texto que cambia de ancho cuando llega Geist. Se
          queda por lo estructural, no por lo que no arregla. */}
      <nav className="mx-auto max-w-6xl px-6 h-14 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link href="/" aria-label="VELIA — inicio" className="col-start-1 justify-self-start shrink-0">
          <Image src="/velia_logotipo.svg" alt="VELIA" width={120} height={30} priority className="h-[22px] w-auto" />
        </Link>

        {/* `lg` y no `md` (19-sep-2026): cuatro secciones, «Iniciar sesión» y el
            CTA necesitan ~835 px, y `md` las activaba a 768. Entre esos dos
            anchos el botón quedaba medio fuera de la pantalla, sin scroll con
            que alcanzarlo. Por debajo manda la variante con menú. */}
        <div className="seg col-start-2 hidden lg:flex lg:items-center">
          {HEADER_LINKS.map(l => {
            const esActivo = l.href.startsWith('/#') && l.href.slice(2) === activo
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={esActivo ? 'true' : undefined}
                className="seg__enlace"
              >
                {l.label}
              </Link>
            )
          })}
        </div>

        <div className="col-start-3 justify-self-end hidden lg:flex items-center gap-5">
          <a
            href={APP_URL}
            onClick={() => trackEvent('login_click')}
            className="nav-enlace text-[11px] font-600 tracking-[0.06em] uppercase text-void/65 hover:text-void transition-colors duration-control whitespace-nowrap"
          >
            Iniciar sesión
          </a>
          {/* El mismo botón de la Home a la talla de la barra: la acción se
              reconoce de una sección a otra porque es literalmente la misma. */}
          <BotonAccion
            href={CTA_CONTACTO.href}
            evento="nav_contacto_click"
            propiedades={{ cta_location: 'header' }}
            compacto
          >
            {CTA_CONTACTO.label}
          </BotonAccion>
        </div>

        {/* Móvil: el CTA principal NO se esconde detrás del menú. */}
        <div className="col-start-3 justify-self-end flex lg:hidden items-center gap-2">
          <BotonAccion
            href={CTA_CONTACTO.href}
            evento="nav_contacto_click"
            propiedades={{ cta_location: 'header_mobile' }}
            compacto
          >
            {CTA_CONTACTO.label}
          </BotonAccion>
          <button
            ref={menuBtn}
            type="button"
            className="w-11 h-11 flex items-center justify-center text-void/70 transition-colors duration-control"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="menu-movil"
          >
            <span className="text-xl leading-none" aria-hidden="true">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* El panel móvil usa `menu-in`, la entrada que ya existía en el sistema
          (fundido con 3 px de desplazamiento y escalonado del contenido): no se
          inventa una animación nueva para una superficie nueva. */}
      {open && (
        <div ref={panel} id="menu-movil" className="menu-in lg:hidden border-t border-mist bg-cream px-6 pt-2 pb-6">
          {HEADER_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="enlace-flecha flex items-baseline justify-between gap-4 py-3.5 text-lg font-600 tracking-[-0.01em] text-void border-b border-mist"
            >
              {l.label}
              <span className="enlace-flecha__flecha text-[13px] text-void/65" aria-hidden="true">→</span>
            </Link>
          ))}
          <a
            href={APP_URL}
            onClick={() => { setOpen(false); trackEvent('login_click') }}
            className="block py-4 text-[13px] font-600 tracking-[0.06em] uppercase text-void/65"
          >
            Iniciar sesión
          </a>
        </div>
      )}
    </header>
  )
}
