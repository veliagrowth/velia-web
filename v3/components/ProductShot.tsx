import Image from 'next/image'

/**
 * Captura real del producto en un marco de navegador sobrio (flat, borde deep).
 * Las capturas viven en /public/screenshots (SOLO datos del tenant demo ficticio
 * "Bufete Nelson & Murdock" — jamás datos de clientes reales). Refresco trimestral.
 */
export default function ProductShot({
  src,
  alt,
  caption,
}: {
  src: string
  alt: string
  caption?: string
}) {
  return (
    <figure className="w-full">
      <div className="rounded-2xl border border-void/15 bg-deep overflow-hidden">
        {/* Barra de navegador */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
          <span className="ml-3 rounded-md bg-white/5 px-3 py-1 text-[10px] tracking-[0.06em] text-cream/60">
            app.veliacorp.com
          </span>
        </div>
        <Image
          src={src}
          alt={alt}
          width={2200}
          height={1375}
          sizes="(max-width: 768px) 100vw, 1120px"
          quality={90}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[12px] text-void/60 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
