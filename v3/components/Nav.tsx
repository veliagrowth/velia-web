'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { APP_URL } from '@/lib/constants'
import { HEADER_LINKS } from '@/lib/navigation'
import { CTA, TRIAL_URL, withUtm } from '@/lib/cta'
import { PRICING } from '@/lib/pricing'
import { trackEvent } from '@/lib/analytics'

/**
 * Header.
 *
 * Cuatro secciones y dos acciones. Antes eran ocho elementos, y había un
 * comentario en este mismo archivo explicando que se había apretado el `gap`
 * porque no cabían y el bloque se montaba sobre el logotipo.
 *
 * También se retiró el mega-menú de «Producto». Enseñaba bien el producto, pero
 * era un panel a pantalla completa con hover-intent, gestión de foco y cierre por
 * clic fuera para llegar a una página que está a un clic. «Producto» es ahora un
 * enlace.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sobreOscuro, setSobreOscuro] = useState(false)
  const pathname = usePathname()
  const menuBtn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  // Fondo sólido al bajar; translúcido sobre el hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ¿Arranca la página con un hero OSCURO debajo?
  //
  // Se pregunta al DOM (`[data-hero="dark"]`) en vez de mirar la ruta: hoy solo
  // la home lo tiene, pero si mañana lo tiene /precios este header ya lo sabe y
  // nadie tiene que acordarse de venir a añadir una ruta a una lista.
  //
  // DEPENDE DE `pathname` Y NO DE NADA (bug cazado 1-ago): el header vive en el
  // layout, así que al navegar de la home a /precios el componente NO se vuelve
  // a montar. Con las dependencias vacías, el efecto corría una única vez —en la
  // home, donde sí hay hero oscuro— y el estado se quedaba pegado: en el resto
  // de páginas el logotipo seguía invertido a blanco sobre fondo Pearl Cloud, o
  // sea invisible. Solo se veía navegando; recargando la página directamente
  // salía bien, que es por lo que no apareció al revisar la home.
  useEffect(() => {
    setSobreOscuro(Boolean(document.querySelector('[data-hero="dark"]')))
  }, [pathname])

  // Sobre el hero oscuro el header va en tinta clara; en cuanto se hace sólido
  // (Pearl Cloud) vuelve a tinta oscura. El estado intermedio no existe: o una
  // cosa o la otra, porque a mitad de transición el contraste no cumple.
  const claro = sobreOscuro && !scrolled

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
      // Ciclo de foco dentro del panel mientras está abierto.
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

  const irAPrueba = (ubicacion: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent('header_trial_click', { cta_location: ubicacion })
    e.currentTarget.href = withUtm(TRIAL_URL)
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-panel ease-velia ${
        scrolled
          ? 'bg-cream/92 backdrop-blur-md border-mist'
          : claro
            ? 'bg-transparent border-transparent'
            : 'bg-cream/70 backdrop-blur-sm border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" aria-label="VELIA — inicio" className="shrink-0">
          <Image
            src="/velia_logotipo.svg"
            alt="VELIA"
            width={120}
            height={30}
            priority
            /* El logotipo es tinta oscura. Sobre el hero Night se invierte con
               un filtro en vez de servir un segundo SVG: es un archivo menos
               que mantener y no hay parpadeo al conmutar. */
            className={`h-[24px] w-auto transition-[filter] duration-panel ease-velia ${claro ? 'invert brightness-0 contrast-200' : ''}`}
          />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {HEADER_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => { if (l.href === '/demo') trackEvent('nav_demo_click') }}
              className={`text-[11px] font-600 tracking-[0.06em] uppercase transition-colors duration-control whitespace-nowrap ${
                claro ? 'text-cream/75 hover:text-cream' : 'text-void/60 hover:text-void'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={APP_URL}
            onClick={() => trackEvent('login_click')}
            className={`text-[11px] font-600 tracking-[0.06em] uppercase transition-colors duration-control whitespace-nowrap ${
              claro ? 'text-cream/75 hover:text-cream' : 'text-void/60 hover:text-void'
            }`}
          >
            Iniciar sesión
          </a>
          {/* Iris 600 y no Night: sobre el hero oscuro un botón Night desaparece,
              y el acento es justo lo que debe destacar. Blanco sobre Iris 600
              cumple; sobre Iris 500 daría 3,65:1 y no llegaría. */}
          <a
            href={TRIAL_URL}
            onClick={irAPrueba('header')}
            className={`btn text-[11px] font-600 tracking-[0.04em] rounded-full px-5 py-2.5 hover:opacity-90 whitespace-nowrap ${
              claro ? 'bg-gold-dark text-white' : 'bg-void text-cream'
            }`}
          >
            {CTA.primary.label}
          </a>
        </div>

        {/* Móvil: el CTA principal NO se esconde detrás del menú. */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={TRIAL_URL}
            onClick={irAPrueba('header_mobile')}
            className={`btn inline-flex items-center min-h-[44px] text-[11px] font-600 tracking-[0.04em] rounded-full px-4 whitespace-nowrap ${
              claro ? 'bg-gold-dark text-white' : 'bg-void text-cream'
            }`}
          >
            Probar gratis
          </a>
          <button
            ref={menuBtn}
            type="button"
            className={`w-11 h-11 flex items-center justify-center transition-colors duration-control ${claro ? 'text-cream/80' : 'text-void/70'}`}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="menu-movil"
          >
            <span className="text-xl leading-none" aria-hidden="true">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={panel}
          id="menu-movil"
          className="md:hidden border-t border-void/10 bg-cream px-6 py-4"
        >
          {HEADER_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => { setOpen(false); if (l.href === '/demo') trackEvent('nav_demo_click') }}
              className="block py-3 text-sm font-600 text-void/75"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={APP_URL}
            onClick={() => { setOpen(false); trackEvent('login_click') }}
            className="block py-3 text-sm font-600 text-void/75"
          >
            Iniciar sesión
          </a>
          <p className="pt-3 text-[12px] text-void/60">
            {PRICING.trialDays} días gratis · Sin tarjeta
          </p>
        </div>
      )}
    </header>
  )
}
