import ConsentLink from '@/components/ConsentLink'
import Link from 'next/link'
import Image from 'next/image'
import { APP_URL, CONTACT_EMAIL } from '@/lib/constants'
import { FOOTER_NAV, FOOTER_CLAIM } from '@/lib/navigation'

/**
 * Footer.
 *
 * ── EL HUECO BLANCO ANTES DEL PIE (22-sep-2026) ────────────────────────────
 * Este pie llevaba `mt-24`. Medido: **96 px exactos** entre el final de la
 * ultima seccion y el borde del pie, en TODAS las paginas.
 *
 * En una pagina que termina en claro eso es aire razonable. El problema es que
 * la Home termina en el cierre oscuro (`bg-void`) y el pie tambien es
 * `bg-void`: el margen no separaba dos bloques, metia una FRANJA PEARL CLOUD DE
 * 96 px ENTRE DOS BLOQUES OSCUROS. De ahi la banda vacia; no era padding del
 * cierre ni un `min-h-screen` ni un spacer escondido.
 *
 * La reparacion no es «subir el pie»: es que el margen no pertenecia al pie.
 * Un componente que no sabe que hay encima no puede decidir cuanto aire deja.
 * Ahora el pie va a hueso y cada pagina es duena de su propio cierre:
 *   · Home  -> el cierre oscuro y el pie se funden en un solo bloque, que es
 *              exactamente lo que se le pide a un final;
 *   · resto -> el canto limpio de claro a oscuro, que es un corte, no un error.
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
    <footer className="bg-void text-cream/60">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-[1.4fr_auto_auto_auto]">
        <div>
          <Image src="/VELIA_logotipo_claro.svg" alt="VELIA" width={120} height={30} className="h-[22px] w-auto mb-4" />
          <p className="text-xs leading-relaxed max-w-[34ch]">{FOOTER_CLAIM}</p>
        </div>

        {Object.entries(FOOTER_NAV).map(([key, grupo]) => (
          <div key={key} className="text-xs space-y-2.5">
            {/* 11 px y peso 600, como TODOS los demás rótulos de la web
                (20-sep). Estos eran los únicos a 10 px y en 700: dos valores
                que sólo existían aquí, y 10 px queda por debajo del mínimo que
                cualquier revisión de tipografía pide para una etiqueta. */}
            <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-cream/55 mb-3">
              {grupo.title}
            </p>
            {grupo.links.map(l => (
              <Link key={l.href + l.label} href={l.href} className="block hover:text-cream transition-colors">
                {l.label}
              </Link>
            ))}
            {key === 'contacto' && (
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
          {/* Retirar el consentimiento tiene que ser tan fácil como darlo, y
              estar SIEMPRE a mano: si solo se pudiera desde el banner, quien ya
              decidió no podría cambiar de idea nunca. RGPD art. 7.3. */}
          <div className="flex items-center gap-4">
            <ConsentLink />
            <p className="text-[11px] text-cream/55">veliacorp.com</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
