'use client'

import { useSectionView } from '@/lib/useSectionView'
import type { AnalyticsEvent } from '@/lib/analytics'

/** Sentinela invisible: dispara `event` una vez cuando la sección que lo contiene entra en viewport. */
export default function SectionViewMarker({ event }: { event: AnalyticsEvent }) {
  const ref = useSectionView<HTMLDivElement>(event)
  return <div ref={ref} aria-hidden className="h-px" />
}
