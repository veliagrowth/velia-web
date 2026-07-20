'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

/**
 * next/link con un evento de analítica en el click. Existe para que las
 * páginas que son Server Components (page.tsx, /legal, /seguridad…) puedan
 * disparar eventos sin convertirse enteras en Client Component — el único
 * trozo interactivo se aísla aquí (regla de rendimiento del brief: "no
 * convertir toda la página en un Client Component").
 */
export default function TrackedLink({
  href,
  event,
  properties,
  className,
  children,
}: {
  href: string
  event: AnalyticsEvent
  properties?: Record<string, string | number | boolean>
  className?: string
  children: ReactNode
}) {
  return (
    <Link href={href} onClick={() => trackEvent(event, properties)} className={className}>
      {children}
    </Link>
  )
}
