import type { CSSProperties, ReactNode } from 'react'

interface HolographicCardProps {
  children: ReactNode
  /** Era accent color used for the inset stroke + static glow. */
  accent?: string
  className?: string
}

/**
 * Static glassy card with an inset accent stroke and a faint always-on glow.
 * No hover interactivity (no tilt, no cursor sheen) — completely still.
 */
export function HolographicCard({ children, accent = '#c9a24b', className }: HolographicCardProps) {
  return (
    <div
      className={`holo-card ${className ?? ''}`}
      style={{ ['--holo-accent' as keyof CSSProperties]: accent } as CSSProperties}
    >
      <div className="holo-content">{children}</div>
    </div>
  )
}

export default HolographicCard
