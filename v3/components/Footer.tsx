import ConsentLink from '@/components/ConsentLink'
import BotonAccion from '@/components/BotonAccion'
import Link from 'next/link'
import Image from 'next/image'
import { APP_URL } from '@/lib/constants'
import { FOOTER_NAV } from '@/lib/navigation'

/**
 * Footer.
 *
 * ── EL HUECO BLANCO ANTES DEL PIE (22-sep-2026) ────────────────────────────
 * Este pie llevaba `mt-24`: 96 px exactos entre el final de la última sección y
 * su borde, en todas las páginas. En una página que termina en claro es aire
 * razonable; la Home termina en un cierre `bg-void` y el pie también es
 * `bg-void`, así que el margen metía una franja Pearl Cloud de 96 px ENTRE DOS
 * BLOQUES OSCUROS. La reparación no fue «subir el pie»: fue que ese margen no
 * pertenecía al pie. Un componente que no sabe qué hay encima no puede decidir
 * cuánto aire deja.
 *
 * ── REESCRITO EL 24-sep-2026 ──────────────────────────────────────────────
 * Era una fila de enlaces al final de la página. Ahora es un CIERRE, con tres
 * pisos y una jerarquía que se lee antes de leerse:
 *
 *   1. LLAMADA    la marca grande, la frase que la separa de una agencia y las
 *                 dos acciones. Va primero porque es lo único que alguien puede
 *                 hacer al llegar hasta aquí.
 *   2. MAPA       cuatro columnas cortas CON NOMBRE. Un pie sin cabeceras es
 *                 una lista; con ellas es un índice.
 *   3. PIE LEGAL  lo obligatorio, en su sitio y sin competir.
 *
 * El peso lo dan el aire y la escala del logotipo, no una tipografía nueva: ni
 * un tamaño, ni un color, ni una familia que no estuvieran ya en la web.
 *
 * ── LAS DOS ACCIONES SON LAS DEL HERO, LITERALMENTE ───────────────────────
 * Mismo componente y mismos destinos: «Empieza» al acceso real del portal y
 * «Hablemos» a `/contacto`. Si el pie tuviera sus propios botones, en dos
 * cambios dejarían de parecerse a los de arriba — que es exactamente lo que
 * acaba de corregirse en el resto de la web.
 *
 * La línea legal: la razón social no se oculta —es obligatoria— pero no puede
 * ser la palabra dominante. Marca arriba, sociedad debajo.
 */
export default function Footer() {
  return (
    <footer className="bg-void text-cream/70">
      {/* ── 1 · LLAMADA ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="md:flex md:items-end md:justify-between md:gap-12">
          <div>
            <Image
              src="/VELIA_logotipo_claro.svg"
              alt="VELIA"
              width={200}
              height={50}
              className="h-[30px] md:h-[38px] w-auto"
            />
          </div>
          <div className="mt-8 md:mt-0 flex flex-wrap items-center gap-3">
            <BotonAccion href={APP_URL} variante="oscura" evento="login_click" externo>
              Empieza
            </BotonAccion>
            <BotonAccion
              href="/contacto"
              variante="secundaria"
              evento="final_contacto_click"
              propiedades={{ cta_location: 'footer' }}
            >
              Hablemos
            </BotonAccion>
          </div>
        </div>
      </div>

      {/* ── 2 · MAPA ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-12 md:py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* `space-y-0.5` en vez de `2.5`: cada enlace gana 8 px de `py-1` (abajo),
              así que el hueco entre ellos ya no lo pone el hermano sino el propio
              destino táctil. Mantener `2.5` separaría la lista hasta casi el doble. */}
          {Object.entries(FOOTER_NAV).map(([key, grupo]) => (
            <div key={key} className="text-[13px] space-y-0.5">
              {/* 11 px y peso 600, como TODOS los demás rótulos de la web. */}
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-cream/70 mb-3">
                {grupo.title}
              </p>
              {grupo.links.map(l => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="block py-1 hover:text-cream transition-colors duration-control"
                >
                  {l.label}
                </Link>
              ))}
              {key === 'contacto' && (
                <>
                  {/* El correo del titular NO va aquí: el pie está en todas
                      las páginas, así que publicarlo aquí es publicarlo en
                      todas. «Hablemos» lleva al formulario, y las páginas
                      legales siguen dando el dato donde es obligatorio. */}
                  <a
                    href={APP_URL}
                    className="block py-1 hover:text-cream transition-colors duration-control"
                  >
                    Acceso clientes
                  </a>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 3 · PIE LEGAL ───────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <div>
            <p className="text-[11px] text-cream/70">© {new Date().getFullYear()} VELIA</p>
            <p className="text-[11px] text-cream/70 mt-0.5">
              VELIA es una marca operada por VELIA Solutions SL.
            </p>
          </div>
          {/* Retirar el consentimiento tiene que ser tan fácil como darlo, y
              estar SIEMPRE a mano: si solo se pudiera desde el banner, quien ya
              decidió no podría cambiar de idea nunca. RGPD art. 7.3. */}
          <div className="flex items-center gap-4">
            <ConsentLink variante="pie" />
            <p className="text-[11px] text-cream/70">veliacorp.com</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
