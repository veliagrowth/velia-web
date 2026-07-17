'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/* Mega-menú "Producto": cada item ancla a su momento del día en /legal
   (patrón "enseña el producto en el nav" — referencia analizada: lexroom.ai). */
const PRODUCT = [
  {
    href: '/legal#puesta-al-dia',
    title: 'Cerebro VELIA',
    desc: 'Tu puesta al día de cada mañana: plazos, citas y pendientes, sin escribir nada.',
  },
  {
    href: '/legal#plazos',
    title: 'Plazos procesales',
    desc: 'Cómputo según la LEC — días inhábiles y agosto incluidos — con aviso a tiempo.',
  },
  {
    href: '/legal#escritos',
    title: 'Escritos con IA',
    desc: 'Borradores citando el texto oficial del BOE, artículo por artículo.',
  },
  {
    href: '/legal#documentacion',
    title: 'Portal del cliente',
    desc: 'Checklist de documentación que VELIA persigue sola hasta completarla.',
  },
  {
    href: '/legal#facturacion',
    title: 'Facturación Verifactu',
    desc: 'Minutas y facturas conformes a la normativa, desde el propio expediente.',
  },
]

const LINKS = [
  { href: '/demo', label: 'Demo' },
  { href: '/precios', label: 'Precios' },
  { href: '/seguridad', label: 'Seguridad' },
  { href: '/contacto', label: 'Contacto' },
]

const TRIAL_URL = 'https://app.veliacorp.com/prueba-velia'

export default function Nav() {
  const [open, setOpen] = useState(false) // menú móvil
  const [productOpen, setProductOpen] = useState(false) // mega-menú desktop
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openedAt = useRef(0) // cuándo abrió el hover — evita que el click inmediato lo cierre
  const headerRef = useRef<HTMLElement>(null)

  // Hover-intent: pequeño delay al salir para poder cruzar del trigger al panel.
  const openProduct = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    openedAt.current = Date.now()
    setProductOpen(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setProductOpen(false), 120)
  }
  // Toggle por click/teclado/touch. Si el hover acaba de abrirlo (<500ms), el click
  // del mismo gesto NO lo cierra (hover abre → click inmediato cerraría: mala UX).
  const toggleProduct = () => {
    if (productOpen && Date.now() - openedAt.current < 500) return
    setProductOpen(o => !o)
  }

  // Escape + clic fuera cierran el mega-menú (para el toggle por clic/teclado).
  useEffect(() => {
    if (!productOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProductOpen(false)
    }
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setProductOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [productOpen])

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-void/10">
      <nav className="relative mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="VELIA — inicio" className="shrink-0">
          <Image src="/velia_logotipo.svg" alt="VELIA" width={104} height={26} priority className="h-[22px] w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {/* Trigger del mega-menú */}
          <button
            type="button"
            onMouseEnter={openProduct}
            onMouseLeave={scheduleClose}
            onClick={toggleProduct}
            aria-expanded={productOpen}
            aria-haspopup="true"
            className={`flex items-center gap-1.5 text-[11px] font-600 tracking-[0.18em] uppercase transition-colors ${
              productOpen ? 'text-void' : 'text-void/55 hover:text-void'
            }`}
          >
            Producto
            <svg
              width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true"
              className={`transition-transform duration-200 ease-out ${productOpen ? 'rotate-180' : ''}`}
            >
              <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-600 tracking-[0.18em] uppercase text-void/55 hover:text-void transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={TRIAL_URL}
            className="btn text-[11px] font-700 tracking-[0.1em] uppercase bg-void text-cream rounded-full px-5 py-2.5 hover:opacity-85 whitespace-nowrap"
          >
            Prueba gratis — 15 días
          </a>
        </div>

        {/* Móvil */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-void/70"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <span className="text-xl leading-none">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* ── Mega-menú Producto (desktop) ─────────────────────────────────── */}
      {productOpen && (
        <div
          onMouseEnter={openProduct}
          onMouseLeave={scheduleClose}
          className="menu-in hidden md:block absolute inset-x-0 top-full bg-cream border-b border-void/10 shadow-[0_24px_48px_-24px_rgba(10,10,15,0.18)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-10 grid gap-10 lg:grid-cols-[1fr_1.15fr_1fr] md:grid-cols-[1fr_1.3fr]">
            {/* Editorial */}
            <div>
              <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-4">
                VELIA Legal
              </p>
              <p className="text-2xl font-800 leading-[1.15] tracking-[-0.02em] max-w-[16ch]">
                El sistema operativo del despacho.
              </p>
              <p className="mt-3 text-sm text-void/55 leading-[1.6] max-w-[34ch]">
                CRM, IA con fuentes oficiales, plazos, facturación y web —{' '}
                <span className="inline-block">en una sola suscripción.</span>
              </p>
              <Link
                href="/legal"
                onClick={() => setProductOpen(false)}
                className="inline-block mt-5 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-dark hover:text-void transition-colors"
              >
                Ver un día con VELIA →
              </Link>
            </div>

            {/* Piezas del producto */}
            <ul className="space-y-1">
              {PRODUCT.map(p => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    onClick={() => setProductOpen(false)}
                    className="block rounded-xl px-4 py-3 -mx-4 md:mx-0 hover:bg-void/[0.04] transition-colors"
                  >
                    <span className="block text-sm font-700">{p.title}</span>
                    <span className="block mt-0.5 text-[13px] text-void/55 leading-[1.5]">{p.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mock real del producto (el cerebro), no ilustración */}
            <div className="hidden lg:block">
              <div className="rounded-2xl bg-deep p-4">
                <p className="text-[9px] font-700 tracking-[0.22em] uppercase text-gold/60 mb-3">
                  VELIA · Tu puesta al día
                </p>
                <div className="space-y-2.5">
                  <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                    <p className="text-cream/85 text-[11px] leading-relaxed">
                      Buenos días. Tienes <span className="text-gold">un plazo que vence el jueves</span> y
                      un cliente ha subido documentación. ¿Preparo el borrador?
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-lg bg-gold/15 px-3 py-2">
                      <p className="text-cream text-[11px]">Sí, prepáralo.</p>
                    </div>
                  </div>
                  <div className="h-8 rounded-full border border-white/10 flex items-center px-3">
                    <span className="text-cream/30 text-[10px]">Pregunta a VELIA…</span>
                  </div>
                </div>
              </div>
              <a
                href={TRIAL_URL}
                className="block mt-3 text-center text-[11px] font-700 tracking-[0.1em] uppercase text-void/55 hover:text-void transition-colors"
              >
                Pruébalo gratis 15 días →
              </a>
            </div>
          </div>

          {/* Franja de confianza */}
          <div className="border-t border-void/10">
            <div className="mx-auto max-w-6xl px-6 py-3.5">
              <p className="text-[10px] font-600 tracking-[0.18em] uppercase text-void/40">
                Texto oficial del BOE · Plazos según la LEC · Verifactu · Datos alojados en la UE
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Menú móvil ───────────────────────────────────────────────────── */}
      {open && (
        <div className="md:hidden border-t border-void/10 bg-cream px-6 py-4 space-y-1">
          {[{ href: '/legal', label: 'Producto' }, ...LINKS].map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-600 text-void/70"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2">
            <a
              href={TRIAL_URL}
              onClick={() => setOpen(false)}
              className="btn inline-block text-[11px] font-700 tracking-[0.1em] uppercase bg-void text-cream rounded-full px-5 py-2.5"
            >
              Prueba gratis — 15 días
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
