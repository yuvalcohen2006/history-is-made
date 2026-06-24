import { useEffect, useState } from 'react'
import type { EraKey } from '../types'
import { stations } from '../data/timelineData'

interface EraBackgroundProps {
  /** Continuous fractional station position from useScrollStations. */
  frac: number
}

/**
 * Real era photo — completely still (no Ken-Burns). Stable keyed layers (one per
 * era in the render window) let opacity change with scroll WITHOUT remounting, so
 * the visible image never reloads/flashes at the handoff.
 */
function PhotoLayer({ eraKey, opacity }: { eraKey: EraKey; opacity: number }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.src = `/assets/era/${eraKey}.jpg`
  }, [eraKey])

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(/assets/era/${eraKey}.jpg)`, opacity: loaded ? opacity : 0 }}
    />
  )
}

/** Compress the cross-fade into the boundary band between two stations. */
function crossfade(t: number) {
  const x = Math.min(1, Math.max(0, (t - 0.4) / 0.25))
  return x * x * (3 - 2 * x) // smoothstep
}

/**
 * Fixed full-viewport background — just the era photos (cross-fading with scroll)
 * over a charcoal fallback, plus a right-edge black scrim so the content on the
 * right stays readable. No decorative cloud/particles/vignette.
 */
export function EraBackground({ frac }: EraBackgroundProps) {
  const count = stations.length
  const i0 = Math.max(0, Math.min(count - 1, Math.floor(frac)))
  const i1 = Math.min(count - 1, i0 + 1)
  const t = crossfade(frac - i0)

  const windowIdx: number[] = []
  for (let j = i0 - 1; j <= i1 + 1; j++) {
    if (j >= 0 && j < count && !windowIdx.includes(j)) windowIdx.push(j)
  }
  const photoOpacity = (j: number) => (j === i0 ? 1 : j === i1 && i1 !== i0 ? t : 0)

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* charcoal fallback (only seen if a photo is missing) */}
      <div className="absolute inset-0 bg-charcoal" />

      {/* era photos */}
      <div className="absolute inset-0">
        {windowIdx.map((j) => (
          <PhotoLayer key={stations[j].eraKey} eraKey={stations[j].eraKey} opacity={photoOpacity(j)} />
        ))}
      </div>

      {/* right-edge black scrim → transparent by 70% across, for readability */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)' }}
      />
    </div>
  )
}
