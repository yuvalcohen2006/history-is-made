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

/** Smooth path string through the node centers (midpoint quadratics). */
function buildPath() {
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const cur = points[i]
    const mx = (prev.x + cur.x) / 2
    const my = (prev.y + cur.y) / 2
    d += ` Q ${prev.x} ${prev.y} ${mx} ${my}`
  }
  const last = points[points.length - 1]
  d += ` T ${last.x} ${last.y}`
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
