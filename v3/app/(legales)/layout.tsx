/**
 * Layout compartido de las páginas legales (aviso legal, privacidad, cookies,
 * términos). Prosa larga: contenedor estrecho, tipografía legible, flat.
 * Cada página aporta su <h1>, su fecha de versión y sus secciones.
 */
export default function LegalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-24 pb-24">
      <article className="legal-prose">{children}</article>
    </div>
  )
}
