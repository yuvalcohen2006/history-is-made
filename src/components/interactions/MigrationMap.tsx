import { useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { MapInteraction } from '../../types'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/** Stylized continent geometry on a 1000×560 plane (cx, cy, rx, ry). */
const GEO: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  americas: { cx: 215, cy: 300, rx: 95, ry: 150 },
  europe: { cx: 525, cy: 150, rx: 70, ry: 55 },
  africa: { cx: 545, cy: 345, rx: 105, ry: 130 },
  asia: { cx: 745, cy: 200, rx: 150, ry: 100 },
  oceania: { cx: 830, cy: 445, rx: 75, ry: 55 },
}

const ORIGIN = { x: 545, y: 320 }

/**
 * Interactive pseudo-3D migration map. The plane is gently tilted in CSS
 * perspective and the continents are "extruded" (a darker offset copy) for a
 * raised relief look. The learner taps the continent humans migrated OUT of
 * (Africa); on success the glowing migration routes animate outward.
 */
export function MigrationMap({
  data,
  onResolved,
}: { data: MapInteraction } & InteractionProps) {
  const [chosen, setChosen] = useState<string | null>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const answered = chosen !== null
  const correct = answered && (data.regions.find((r) => r.id === chosen)?.correct ?? false)
  // once answered, always reveal the correct origin + routes (no retry)
  const revealed = answered
  const state: FeedbackState = !answered ? 'idle' : correct ? 'correct' : 'wrong'

  const pick = (id: string) => {
    if (answered) return // locks on first choice
    setChosen(id)
    onResolved?.(data.regions.find((r) => r.id === id)?.correct ?? false)
  }

  const onMove = (e: MouseEvent) => {
    const el = planeRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: py * -6, y: px * 6 })
  }

  const destinations = data.regions.filter((r) => !r.correct && GEO[r.id])

  return (
    <div>
      <p className="mb-4 font-display text-lg font-bold">{data.prompt}</p>

      <div
        className="relative mx-auto w-full max-w-2xl select-none"
        style={{ perspective: '1200px' }}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <motion.div
          ref={planeRef}
          className="relative"
          animate={{ rotateX: 26 + tilt.x, rotateY: tilt.y }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <svg viewBox="0 0 1000 560" className="w-full overflow-visible">
            <defs>
              <radialGradient id="ocean" cx="50%" cy="38%" r="80%">
                <stop offset="0%" stopColor="#274b56" />
                <stop offset="60%" stopColor="#1a2e36" />
                <stop offset="100%" stopColor="#0e171c" />
              </radialGradient>
              <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a6f48" />
                <stop offset="100%" stopColor="#5d4a2e" />
              </linearGradient>
              <linearGradient id="landGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e9c266" />
                <stop offset="100%" stopColor="#b5852f" />
              </linearGradient>
              <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ocean plane + grid */}
            <rect x="0" y="0" width="1000" height="560" rx="28" fill="url(#ocean)" />
            <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 70} x2="1000" y2={i * 70} />
              ))}
              {Array.from({ length: 13 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="560" />
              ))}
            </g>

            {/* continents (extruded + relief highlight) */}
            {data.regions.map((r) => {
              const g = GEO[r.id]
              if (!g) return null
              const isWrong = answered && chosen === r.id && !r.correct
              const isOrigin = r.correct
              const dimmed = revealed && !isOrigin
              return (
                <g
                  key={r.id}
                  className={answered ? '' : 'cursor-pointer'}
                  onClick={() => pick(r.id)}
                  style={{ opacity: dimmed ? 0.45 : 1, transition: 'opacity 0.6s' }}
                >
                  {/* extrusion depth */}
                  <ellipse cx={g.cx} cy={g.cy + 14} rx={g.rx} ry={g.ry} fill="#0c1114" opacity={0.75} />
                  <motion.ellipse
                    cx={g.cx}
                    cy={g.cy}
                    rx={g.rx}
                    ry={g.ry}
                    fill={isOrigin && revealed ? 'url(#landGold)' : 'url(#land)'}
                    stroke={isWrong ? '#fb7185' : 'rgba(255,255,255,0.28)'}
                    strokeWidth={isWrong ? 4 : 2}
                    animate={isWrong ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="hover:brightness-110"
                    style={{
                      filter: isOrigin && revealed ? 'drop-shadow(0 0 18px rgba(233,194,102,0.8))' : 'none',
                    }}
                  />
                  {/* top relief highlight */}
                  <ellipse
                    cx={g.cx}
                    cy={g.cy - g.ry * 0.35}
                    rx={g.rx * 0.7}
                    ry={g.ry * 0.32}
                    fill="rgba(255,255,255,0.12)"
                  />
                </g>
              )
            })}

            {/* glowing migration routes (revealed after answering) */}
            {revealed &&
              destinations.map((r, i) => {
                const g = GEO[r.id]
                const mx = (ORIGIN.x + g.cx) / 2
                const my = Math.min(ORIGIN.y, g.cy) - 70
                const d = `M ${ORIGIN.x} ${ORIGIN.y} Q ${mx} ${my} ${g.cx} ${g.cy}`
                return (
                  <g key={`route-${r.id}`} filter="url(#routeGlow)">
                    <motion.path
                      d={d}
                      fill="none"
                      stroke="#ffcf6b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="6 12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.25, ease: 'easeOut' }}
                    />
                  </g>
                )
              })}

            {revealed && (
              <motion.circle
                cx={ORIGIN.x}
                cy={ORIGIN.y}
                r="10"
                fill="#ffcf6b"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.9, 0.4, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* labels with readable pills */}
            {data.regions.map((r) => {
              const g = GEO[r.id]
              if (!g) return null
              const w = r.label.length * 16 + 28
              const dimmed = revealed && !r.correct
              return (
                <g key={`lbl-${r.id}`} className="pointer-events-none" style={{ opacity: dimmed ? 0.5 : 1 }}>
                  <rect
                    x={g.cx - w / 2}
                    y={g.cy - 20}
                    width={w}
                    height={40}
                    rx={20}
                    fill="rgba(0,0,0,0.55)"
                  />
                  <text
                    x={g.cx}
                    y={g.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-display"
                    style={{ fontSize: 24, fontWeight: 700 }}
                  >
                    {r.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {!answered && (
          <motion.p exit={{ opacity: 0 }} className="mt-3 text-center text-sm text-white/60">
            רמז: כל בני האדם כיום מקורם ביבשת אחת.
          </motion.p>
        )}
      </AnimatePresence>

      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
