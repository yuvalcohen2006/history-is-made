import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ConnectInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import { FlowButton } from '../ui/flow-button'
import type { InteractionProps } from './InteractionRenderer'

/** Distinct tint per linked pair (left + its matched right share the color). */
const PAIR_COLORS = [
  'border-sky-400/70 bg-sky-500/20 text-sky-100',
  'border-violet-400/70 bg-violet-500/20 text-violet-100',
  'border-amber-400/70 bg-amber-500/20 text-amber-100',
  'border-emerald-400/70 bg-emerald-500/20 text-emerald-100',
]

function clientPoint(e: MouseEvent | TouchEvent | PointerEvent): { x: number; y: number } {
  const anyE = e as { clientX?: number; clientY?: number; changedTouches?: TouchList }
  if (typeof anyE.clientX === 'number') return { x: anyE.clientX, y: anyE.clientY ?? 0 }
  const t = anyE.changedTouches?.[0]
  return t ? { x: t.clientX, y: t.clientY } : { x: 0, y: 0 }
}

/**
 * Connect each left concept to its right match by DRAGGING a right card onto a
 * left card. Tied pairs share a color so the link is clear; columns are spaced
 * apart. Check verifies all links.
 */
export function ConnectPairs({
  data,
  onResolved,
}: { data: ConnectInteraction } & InteractionProps) {
  // left index -> right index
  const [links, setLinks] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState(false)
  const leftRefs = useRef<(HTMLDivElement | null)[]>([])

  const allLinked = Object.keys(links).length === data.left.length
  const correctCount = useMemo(
    () => Object.entries(links).filter(([l, r]) => data.pairs[Number(l)] === r).length,
    [links, data.pairs],
  )
  const state: FeedbackState = !checked
    ? 'idle'
    : correctCount === data.left.length
      ? 'correct'
      : 'wrong'

  /** left index currently linked to a given right index (for coloring) */
  const leftOfRight = (ri: number) =>
    Object.keys(links).find((l) => links[Number(l)] === ri) as string | undefined

  const dropRight = (rightIdx: number, e: MouseEvent | TouchEvent | PointerEvent) => {
    if (checked) return
    const { x, y } = clientPoint(e)
    const li = leftRefs.current.findIndex((el) => {
      if (!el) return false
      const r = el.getBoundingClientRect()
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    })
    if (li < 0) return
    setLinks((prev) => {
      const next = { ...prev }
      for (const k of Object.keys(next)) if (next[Number(k)] === rightIdx) delete next[Number(k)]
      next[li] = rightIdx
      return next
    })
  }

  return (
    <div>
      <p className="mb-1 font-display text-lg font-bold">{data.prompt}</p>
      <p className="mb-4 text-sm text-white/60">גררו כל מושג מימין אל ההסבר המתאים משמאל.</p>

      <div className="grid grid-cols-2 gap-x-10 gap-y-3">
        {/* RIGHT column (concepts) — appears first in RTL = right side; draggable */}
        <div className="flex flex-col gap-3">
          {data.right.map((label, ri) => {
            const li = leftOfRight(ri)
            const colorClass = li !== undefined ? PAIR_COLORS[Number(li) % PAIR_COLORS.length] : ''
            return (
              <motion.div
                key={ri}
                drag={!checked}
                dragSnapToOrigin
                whileDrag={{ scale: 1.06, zIndex: 50, cursor: 'grabbing' }}
                onDragEnd={(e) => dropRight(ri, e)}
                className={cn(
                  'opt-btn select-none text-center',
                  !checked && 'cursor-grab',
                  colorClass,
                )}
              >
                {label}
              </motion.div>
            )
          })}
        </div>

        {/* LEFT column (explanations) — drop targets */}
        <div className="flex flex-col gap-3">
          {data.left.map((label, li) => {
            const ri = links[li]
            const colorClass = ri !== undefined ? PAIR_COLORS[li % PAIR_COLORS.length] : ''
            const isCorrect = checked && data.pairs[li] === ri
            const isWrong = checked && ri !== undefined && !isCorrect
            return (
              <div
                key={li}
                ref={(el) => {
                  leftRefs.current[li] = el
                }}
                className={cn(
                  'flex min-h-[3rem] flex-col justify-center rounded-xl border px-4 py-2 text-sm transition-colors',
                  'border-white/15 bg-white/5',
                  !checked && colorClass,
                  isCorrect && 'border-emerald-400/70 bg-emerald-500/20',
                  isWrong && 'border-rose-400/70 bg-rose-500/20',
                )}
              >
                <span>{label}</span>
                {ri !== undefined && (
                  <span className="mt-1 text-xs text-white/70">↳ {data.right[ri]}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {!checked && (
        <div className="mt-5 flex justify-start">
          <FlowButton
            text="בדוק חיבורים"
            disabled={!allLinked}
            onClick={() => {
              setChecked(true)
              onResolved?.(correctCount === data.left.length)
            }}
          />
        </div>
      )}

      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
