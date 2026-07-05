'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const LINKS = [
  { href: '/legal', label: 'Producto' },
  { href: '/precios', label: 'Precios' },
  { href: '/seguridad', label: 'Seguridad' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-void/10">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="VELIA — inicio" className="shrink-0">
          <Image src="/velia_logotipo.svg" alt="VELIA" width={104} height={26} priority className="h-[22px] w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-600 tracking-[0.18em] uppercase text-void/55 hover:text-void transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="btn text-[11px] font-700 tracking-[0.1em] uppercase bg-void text-cream rounded-full px-5 py-2.5 hover:opacity-85"
          >
            Agenda una demo
          </Link>
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

      {open && (
        <div className="md:hidden border-t border-void/10 bg-cream px-6 py-4 space-y-1">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-600 text-void/70"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setOpen(false)}
            className="btn inline-block mt-2 text-[11px] font-700 tracking-[0.1em] uppercase bg-void text-cream rounded-full px-5 py-2.5"
          >
            Agenda una demo
          </Link>
        </div>
      )}
    </header>
  )
}
