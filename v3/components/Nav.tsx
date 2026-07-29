'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
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
  const menuBtn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  // Fondo sólido al bajar; translúcido sobre el hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md border-void/10' : 'bg-cream/70 backdrop-blur-sm border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" aria-label="VELIA — inicio" className="shrink-0">
          <Image src="/velia_logotipo.svg" alt="VELIA" width={120} height={30} priority className="h-[24px] w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {HEADER_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => { if (l.href === '/demo') trackEvent('nav_demo_click') }}
              className="text-[11px] font-600 tracking-[0.18em] uppercase text-void/60 hover:text-void transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={APP_URL}
            onClick={() => trackEvent('login_click')}
            className="text-[11px] font-600 tracking-[0.18em] uppercase text-void/60 hover:text-void transition-colors whitespace-nowrap"
          >
            Iniciar sesión
          </a>
          <a
            href={TRIAL_URL}
            onClick={irAPrueba('header')}
            className="btn text-[11px] font-700 tracking-[0.1em] uppercase bg-void text-cream rounded-full px-5 py-2.5 hover:opacity-85 whitespace-nowrap"
          >
            {CTA.primary.label}
          </a>
        </div>

        {/* Móvil: el CTA principal NO se esconde detrás del menú. */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={TRIAL_URL}
            onClick={irAPrueba('header_mobile')}
            className="btn inline-flex items-center min-h-[44px] text-[11px] font-700 tracking-[0.06em] uppercase bg-void text-cream rounded-full px-4 whitespace-nowrap"
          >
            Probar gratis
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="w-11 h-11 flex items-center justify-center text-void/70"
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
