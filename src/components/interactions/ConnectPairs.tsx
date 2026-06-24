import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ConnectInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

const PAIR_COLORS = [
  'border-sky-400/70 bg-sky-500/20',
  'border-violet-400/70 bg-violet-500/20',
  'border-amber-400/70 bg-amber-500/20',
  'border-emerald-400/70 bg-emerald-500/20',
]

/**
 * Tap-to-connect: select a term on the right column, then its match on the left.
 * Each formed pair gets a color. When every term is connected, answers are checked.
 */
export function ConnectPairs({
  data,
  onResolved,
}: { data: ConnectInteraction } & InteractionProps) {
  // map: left index -> right index
  const [links, setLinks] = useState<Record<number, number>>({})
  const [activeLeft, setActiveLeft] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  const usedRight = useMemo(() => new Set(Object.values(links)), [links])
  const allLinked = Object.keys(links).length === data.left.length

  const correctCount = useMemo(
    () =>
      Object.entries(links).filter(
        ([l, r]) => data.pairs[Number(l)] === r,
      ).length,
    [links, data.pairs],
  )

  const state: FeedbackState = !checked
    ? 'idle'
    : correctCount === data.left.length
      ? 'correct'
      : 'wrong'

  const pickRight = (r: number) => {
    if (checked) return
    if (activeLeft === null) return
    setLinks((prev) => {
      const next = { ...prev }
      // remove any existing use of this right side
      for (const k of Object.keys(next)) {
        if (next[Number(k)] === r) delete next[Number(k)]
      }
      next[activeLeft] = r
      return next
    })
    setActiveLeft(null)
  }

  const colorFor = (leftIdx: number) => {
    const r = links[leftIdx]
    if (r === undefined) return ''
    return PAIR_COLORS[leftIdx % PAIR_COLORS.length]
  }

  return (
    <div>
      <p className="mb-4 font-display text-lg font-bold">{data.prompt}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {data.left.map((label, i) => {
            const linkedRight = links[i]
            const isCorrect = checked && data.pairs[i] === linkedRight
            const isWrong = checked && linkedRight !== undefined && !isCorrect
            return (
              <motion.button
                key={i}
                type="button"
                whileTap={{ scale: 0.98 }}
                disabled={checked}
                onClick={() => setActiveLeft(i)}
                className={cn(
                  'opt-btn py-3 text-sm',
                  activeLeft === i && 'ring-2 ring-[var(--accent)]',
                  !checked && colorFor(i),
                  isCorrect && 'border-emerald-400/70 bg-emerald-500/20',
                  isWrong && 'border-rose-400/70 bg-rose-500/20',
                )}
              >
                {label}
              </motion.button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3">
          {data.right.map((label, r) => {
            const used = usedRight.has(r)
            return (
              <motion.button
                key={r}
                type="button"
                whileTap={{ scale: 0.98 }}
                disabled={checked || activeLeft === null}
                onClick={() => pickRight(r)}
                className={cn(
                  'opt-btn py-3 text-sm',
                  used && 'opacity-60',
                  activeLeft !== null && !checked && 'hover:border-[var(--accent)]',
                )}
              >
                {label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {!checked && (
        <button
          type="button"
          disabled={!allLinked}
          onClick={() => {
            setChecked(true)
            onResolved?.(correctCount === data.left.length)
          }}
          className={cn(
            'mt-4 btn-primary disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          בדוק חיבורים
        </button>
      )}

      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
