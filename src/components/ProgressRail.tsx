import { motion } from 'framer-motion'
import { stations } from '../data/timelineData'
import { eraThemes } from '../data/eraThemes'
import { useProgress } from '../progress/ProgressProvider'

interface ProgressRailProps {
  activeIndex: number
  onJump: (index: number) => void
}

const VB_W = 170
const VB_H = 940
const PAD = 54

/** Node centers along a winding sine path (shared by the path AND the dots). */
const points = stations.map((_, i) => {
  const step = (VB_H - PAD * 2) / (stations.length - 1)
  return {
    x: 116 + 33 * Math.sin(i * 0.9),
    y: PAD + i * step,
  }
})

/**
 * Smooth Catmull-Rom spline that passes EXACTLY through every node center
 * (converted to cubic Béziers), so the dotted trail runs through the middle of
 * each circle — not merely near it.
 */
function buildPath() {
  const p = points
  const n = p.length
  if (n < 2) return ''
  let d = `M ${p[0].x} ${p[0].y}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}
const pathD = buildPath()

/**
 * Always-visible timeline as a static winding "journey path" pinned to the right.
 * The active era's node swells and pulses; every node is a jump link. No labels.
 */
export function ProgressRail({ activeIndex, onJump }: ProgressRailProps) {
  const { isUnlocked } = useProgress()
  const progress = activeIndex / (stations.length - 1)

  return (
    <nav
      aria-label="ציר הזמן"
      className="fixed right-12 top-1/2 z-40 hidden h-[92vh] -translate-y-1/2 lg:block"
      style={{ width: 120 }}
    >
      <div className="relative h-full w-full">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute right-0 top-0 h-full"
          style={{ width: 120, overflow: 'visible' }}
        >
          {/* faint full trail */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="2 18"
          />
          {/* traveled portion */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={7}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ type: 'spring', stiffness: 90, damping: 22 }}
            style={{ filter: 'drop-shadow(0 0 7px var(--accent))' }}
          />

          {/* nodes — drawn on the exact path points */}
          {stations.map((s, i) => {
            const p = points[i]
            const active = i === activeIndex
            const unlocked = isUnlocked(i)
            const accent = eraThemes[s.eraKey].accent
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-label={`${s.id}. ${s.title}${unlocked ? '' : ' (נעול)'}`}
                aria-current={active ? 'step' : undefined}
                className="cursor-pointer focus:outline-none"
                onClick={() => unlocked && onJump(i)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && unlocked) onJump(i)
                }}
              >
                {/* generous transparent hit area */}
                <circle cx={p.x} cy={p.y} r={28} fill="transparent" />

                {active && (
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    fill="none"
                    stroke={accent}
                    strokeWidth={2.5}
                    initial={{ r: 14, opacity: 0.85 }}
                    animate={{ r: 34, opacity: 0 }}
                    transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}

                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  stroke={active ? accent : 'rgba(255,255,255,0.55)'}
                  strokeWidth={2.5}
                  animate={{
                    r: active ? 18 : unlocked ? 12 : 9,
                    fill: active ? accent : unlocked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                  }}
                  transition={{
                    r: { type: 'spring', stiffness: 300, damping: 20 },
                    fill: { duration: 0.4 },
                  }}
                  style={{ filter: active ? `drop-shadow(0 0 10px ${accent})` : 'none' }}
                />
              </g>
            )
          })}
        </svg>
      </div>
    </nav>
  )
}
