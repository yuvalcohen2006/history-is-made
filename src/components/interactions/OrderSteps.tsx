import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { OrderInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/** Returns a shuffled copy of indices that is guaranteed not to be sorted. */
function shuffledOrder(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  const sorted = arr.every((v, i) => v === i)
  if (sorted && n > 1) [arr[0], arr[1]] = [arr[1], arr[0]]
  return arr
}

/**
 * Ordering interaction: steps start shuffled; the learner moves them up/down
 * into the correct sequence, then checks. Up/down buttons keep it keyboard- and
 * touch-friendly (no drag dependency).
 */
export function OrderSteps({
  data,
  onResolved,
}: { data: OrderInteraction } & InteractionProps) {
  const [order, setOrder] = useState<number[]>(() => shuffledOrder(data.steps.length))
  const [checked, setChecked] = useState(false)

  const isCorrect = useMemo(() => order.every((v, i) => v === i), [order])
  const state: FeedbackState = !checked ? 'idle' : isCorrect ? 'correct' : 'wrong'

  const move = (pos: number, dir: -1 | 1) => {
    const target = pos + dir
    if (target < 0 || target >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[pos], next[target]] = [next[target], next[pos]]
      return next
    })
  }

  return (
    <div>
      <p className="mb-4 font-display text-lg font-bold">{data.prompt}</p>
      <ol className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {order.map((stepIdx, pos) => {
            const slotCorrect = checked && stepIdx === pos
            return (
              <motion.li
                key={stepIdx}
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-3 py-3',
                  'border-white/15 bg-white/5',
                  checked && (slotCorrect ? 'border-emerald-400/60 bg-emerald-500/15' : 'border-rose-400/60 bg-rose-500/15'),
                )}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-sm font-bold text-charcoal">
                  {pos + 1}
                </span>
                <span className="flex-1 text-sm">{data.steps[stepIdx]}</span>
                {!checked && (
                  <span className="flex shrink-0 flex-col">
                    <button
                      type="button"
                      aria-label="הזז למעלה"
                      onClick={() => move(pos, -1)}
                      disabled={pos === 0}
                      className="px-1 text-white/70 disabled:opacity-30 hover:text-white"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      aria-label="הזז למטה"
                      onClick={() => move(pos, 1)}
                      disabled={pos === order.length - 1}
                      className="px-1 text-white/70 disabled:opacity-30 hover:text-white"
                    >
                      ▼
                    </button>
                  </span>
                )}
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ol>

      {!checked && (
        <button
          type="button"
          onClick={() => {
            setChecked(true)
            onResolved?.(isCorrect)
          }}
          className="mt-4 btn-primary"
        >
          בדוק סדר
        </button>
      )}
      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
