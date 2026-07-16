import { TESTIMONIAL_VIDEO } from '@/lib/constants'

/**
 * Testimonio en vídeo de Iván Cónsul (Cónsul Jurídico) — decisión fundador 2026-07-16.
 * OCULTA hasta tener el máster grabado: activar en lib/constants.ts (TESTIMONIAL_VIDEO).
 * Brief de grabación: docs/business/brief-video-testimonio-ivan.md (velia-core).
 * Player sin descarga/velocidad/PiP (patrón web CJ, commit 39d6ae8).
 */
export default function TestimonialVideo() {
  if (!TESTIMONIAL_VIDEO.enabled) return null

  return (
    <section className="bg-void text-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold/70 mb-3">
            En sus palabras
          </p>
          <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[18ch]">
            El primer despacho que opera entero sobre VELIA.
          </h2>
          <p className="mt-5 text-sm text-cream/55 leading-[1.6] max-w-prose">
            Iván Cónsul Gómez, abogado colegiado, cuenta cómo pasó de cero presencia
            digital a operar todo su despacho — captación, expedientes, plazos y
            facturación — sobre la plataforma.
          </p>
        </div>
        <video
          className="w-full rounded-2xl border border-white/10"
          src={TESTIMONIAL_VIDEO.src}
          poster={TESTIMONIAL_VIDEO.poster}
          controls
          preload="none"
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
        />
      </div>
    </section>
  )
}
