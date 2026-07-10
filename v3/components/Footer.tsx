import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-void text-cream/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-[1fr_auto_auto]">
        <div>
          <Image src="/VELIA_logotipo_claro.svg" alt="VELIA" width={104} height={26} className="h-[20px] w-auto mb-4" />
          <p className="text-xs leading-relaxed max-w-[36ch]">
            La plataforma sobre la que los despachos españoles operan el 100% de su software.
          </p>
        </div>
        <div className="text-xs space-y-2.5">
          <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-cream/35 mb-3">Plataforma</p>
          <Link href="/legal" className="block hover:text-cream transition-colors">VELIA Legal</Link>
          <Link href="/precios" className="block hover:text-cream transition-colors">Precios</Link>
          <Link href="/seguridad" className="block hover:text-cream transition-colors">Seguridad</Link>
        </div>
        <div className="text-xs space-y-2.5">
          <p className="text-[10px] font-700 tracking-[0.22em] uppercase text-cream/35 mb-3">Contacto</p>
          <Link href="/contacto" className="block hover:text-cream transition-colors">Agenda una demo</Link>
          <a href="https://app.veliacorp.com" className="block hover:text-cream transition-colors">Acceso clientes</a>
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
