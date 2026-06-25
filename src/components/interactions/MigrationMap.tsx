import { useRef, useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import type { MapInteraction } from '../../types'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/**
 * Stylized continent geometry on a 1000×560 plane. `d` is a rough landmass
 * silhouette (not an ellipse); cx/cy is the center used for routes + labels.
 */
const GEO: Record<string, { cx: number; cy: number; d: string }> = {
  americas: {
    cx: 245,
    cy: 295,
    d: 'M250 100 L286 140 L255 182 L286 226 L256 262 L276 322 L250 458 L224 406 L240 346 L210 286 L240 236 L210 186 L242 140 Z',
  },
  europe: {
    cx: 528,
    cy: 152,
    d: 'M480 118 L560 112 L590 150 L562 192 L505 196 L472 162 Z',
  },
  africa: {
    cx: 548,
    cy: 345,
    d: 'M505 235 L600 245 L626 315 L590 392 L548 472 L520 420 L500 360 L470 305 L488 255 Z',
  },
  asia: {
    cx: 745,
    cy: 200,
    d: 'M610 176 L705 120 L820 120 L896 176 L856 246 L760 282 L665 258 L620 218 Z',
  },
  oceania: {
    cx: 838,
    cy: 442,
    d: 'M788 410 L858 402 L902 442 L862 478 L806 472 L778 444 Z',
  },
}

const ORIGIN = { x: 545, y: 330 }

/**
 * Interactive pseudo-3D migration map. The plane is gently tilted; the learner
 * taps the continent humans migrated OUT of (Africa); on success the glowing
 * migration routes animate outward.
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
  const revealed = answered
  const state: FeedbackState = !answered ? 'idle' : correct ? 'correct' : 'wrong'

  const pick = (id: string) => {
    if (answered) return
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

            {/* continents — landmass silhouettes, extruded, with a hover glow */}
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
                  <path d={g.d} transform="translate(0,13)" fill="#0c1114" opacity={0.75} />
                  <motion.path
                    d={g.d}
                    className="continent"
                    fill={isOrigin && revealed ? 'url(#landGold)' : 'url(#land)'}
                    stroke={isWrong ? '#fb7185' : 'rgba(255,255,255,0.3)'}
                    strokeWidth={isWrong ? 4 : 2}
                    strokeLinejoin="round"
                    animate={isWrong ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      filter: isOrigin && revealed ? 'drop-shadow(0 0 18px rgba(233,194,102,0.85))' : 'none',
                    }}
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
                  <rect x={g.cx - w / 2} y={g.cy - 20} width={w} height={40} rx={20} fill="rgba(0,0,0,0.55)" />
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

      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
