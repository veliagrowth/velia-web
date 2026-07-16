import Link from 'next/link'
import Image from 'next/image'
import { APP_URL, CONTACT_EMAIL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-void text-cream/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-[1fr_auto_auto_auto]">
        <div>
          <Image src="/VELIA_logotipo_claro.svg" alt="VELIA" width={104} height={26} className="h-[20px] w-auto mb-4" />
          <p className="text-xs leading-relaxed max-w-[36ch]">
            La plataforma sobre la que los despachos españoles operan el 100% de su software.
          </p>
        </div>
        <div className="text-xs space-y-2.5">
          <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-cream/35 mb-3">Plataforma</p>
          <Link href="/legal" className="block hover:text-cream transition-colors">VELIA Legal</Link>
          <Link href="/demo" className="block hover:text-cream transition-colors">Demo interactiva</Link>
          <Link href="/precios" className="block hover:text-cream transition-colors">Precios</Link>
          <Link href="/seguridad" className="block hover:text-cream transition-colors">Seguridad</Link>
          <Link href="/novedades" className="block hover:text-cream transition-colors">Novedades</Link>
        </div>
        <div className="text-xs space-y-2.5">
          <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-cream/35 mb-3">Contacto</p>
          <Link href="/contacto" className="block hover:text-cream transition-colors">Agenda una demo</Link>
          <a href={APP_URL} className="block hover:text-cream transition-colors">Acceso clientes</a>
          <a href={`${APP_URL}/instalar`} className="block hover:text-cream transition-colors">Instalar la app</a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="block hover:text-cream transition-colors">{CONTACT_EMAIL}</a>
        </div>
        <div className="text-xs space-y-2.5">
          <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-cream/35 mb-3">Legal</p>
          <Link href="/aviso-legal" className="block hover:text-cream transition-colors">Aviso legal</Link>
          <Link href="/privacidad" className="block hover:text-cream transition-colors">Privacidad</Link>
          <Link href="/cookies" className="block hover:text-cream transition-colors">Cookies</Link>
          <Link href="/terminos" className="block hover:text-cream transition-colors">Términos del servicio</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-cream/35">© {new Date().getFullYear()} VELIA Marketing SL · Datos alojados en la UE</p>
          <p className="text-[11px] text-cream/35">veliacorp.com</p>
        </div>
      </div>
    </footer>
  )
}
