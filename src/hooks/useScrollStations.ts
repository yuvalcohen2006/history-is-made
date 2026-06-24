import { useEffect, useState } from 'react'

interface ScrollState {
  /** Continuous fractional station position, e.g. 4.3 = between stations 4 and 5. */
  frac: number
  /** Nearest whole station index (for rail + audio). */
  active: number
}

/**
 * Tracks a CONTINUOUS fractional position across the station sections, so the
 * background can cross-fade smoothly the moment you scroll off an era's center —
 * rather than snapping at a threshold. Sections expose `data-station-index`.
 */
export function useScrollStations(count: number): ScrollState {
  const [stateValue, setStateValue] = useState<ScrollState>({ frac: 0, active: 0 })

  useEffect(() => {
    let raf = 0

    const measure = () => {
      raf = 0
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-station-index]'),
      )
      if (sections.length === 0) return

      const viewCenter = window.innerHeight / 2
      // signed distance of each section center from the viewport center
      const dists = sections.map((s) => {
        const r = s.getBoundingClientRect()
        return r.top + r.height / 2 - viewCenter
      })

      // nearest section to center
      let a = 0
      let aAbs = Infinity
      dists.forEach((d, i) => {
        const abs = Math.abs(d)
        if (abs < aAbs) {
          aAbs = abs
          a = i
        }
      })

      // neighbor on the far side of center, to interpolate toward
      const b = dists[a] > 0 ? a - 1 : a + 1
      let frac = a
      if (b >= 0 && b < dists.length) {
        const bAbs = Math.abs(dists[b])
        const w = aAbs / (aAbs + bAbs || 1)
        frac = a + (b - a) * w
      }
      frac = Math.max(0, Math.min(count - 1, frac))

      setStateValue((prev) =>
        prev.frac === frac && prev.active === a ? prev : { frac, active: a },
      )
    }

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [count])

  return stateValue
}
