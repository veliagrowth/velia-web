import Link from 'next/link'
import Image from 'next/image'
import { APP_URL, CONTACT_EMAIL } from '@/lib/constants'
import { FOOTER_NAV, FOOTER_CLAIM } from '@/lib/navigation'

/**
 * Footer.
 *
 * Dos cambios de fondo respecto a la versión anterior:
 *
 * 1. El claim era «La plataforma sobre la que los despachos españoles operan el
 *    100 % de su software». Un absoluto que no se puede sostener y que además
 *    sonaba a folleto.
 * 2. La línea legal decía «© 2026 VELIA Marketing SL». La razón social no se
 *    oculta —es obligatoria— pero «Marketing» no puede ser la palabra dominante
 *    de una empresa que ya no es una agencia. Marca arriba, sociedad debajo.
 */
export default function Footer() {
  return (
    <footer className="bg-void text-cream/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-[1.4fr_auto_auto_auto]">
        <div>
          <Image src="/VELIA_logotipo_claro.svg" alt="VELIA" width={120} height={30} className="h-[22px] w-auto mb-4" />
          <p className="text-xs leading-relaxed max-w-[34ch]">{FOOTER_CLAIM}</p>
        </div>

        {Object.entries(FOOTER_NAV).map(([key, grupo]) => (
          <div key={key} className="text-xs space-y-2.5">
            <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-cream/55 mb-3">
              {grupo.title}
            </p>
            {grupo.links.map(l => (
              <Link key={l.href + l.label} href={l.href} className="block hover:text-cream transition-colors">
                {l.label}
              </Link>
            ))}
            {key === 'empresa' && (
              <>
                <a href={`mailto:${CONTACT_EMAIL}`} className="block hover:text-cream transition-colors">
                  {CONTACT_EMAIL}
                </a>
                <a href={APP_URL} className="block hover:text-cream transition-colors">
                  Acceso clientes
                </a>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <div>
            <p className="text-[11px] text-cream/60">© {new Date().getFullYear()} VELIA</p>
            <p className="text-[11px] text-cream/55 mt-0.5">
              VELIA es una marca operada por VELIA Marketing SL.
            </p>
          </div>
          <p className="text-[11px] text-cream/55">veliacorp.com</p>
        </div>
      </div>
    </footer>
  )
}
