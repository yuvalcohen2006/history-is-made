import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TwoTruthsLieInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/**
 * Two truths and a lie — find the false statement. Spotting the lie is the WIN:
 * the lie you correctly pick is framed as success (green) and clearly tagged
 * "השקר", so it never reads as "you were wrong". A miss reveals the real lie.
 */
export function TwoTruthsLie({
  data,
  onResolved,
}: { data: TwoTruthsLieInteraction } & InteractionProps) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = picked === data.lieIndex
  const state: FeedbackState = !answered ? 'idle' : correct ? 'correct' : 'wrong'

  const handlePick = (i: number) => {
    if (answered) return // no retry
    setPicked(i)
    onResolved?.(i === data.lieIndex)
  }

  return (
    <div>
      <p className="mb-1 font-display text-lg font-bold">שתי אמיתות ושקר אחד</p>
      <p className="mb-4 text-sm text-white/75">{data.prompt}</p>
      <div className="flex flex-col gap-3">
        {data.statements.map((s, i) => {
          const isLie = i === data.lieIndex
          const isPicked = i === picked
          // the lie is the answer: green if the user found it, amber if revealed
          const lieFound = answered && isLie && correct
          const lieRevealed = answered && isLie && !correct
          const wrongPick = answered && !isLie && isPicked
          return (
            <motion.button
              key={i}
              type="button"
              whileHover={!answered ? { x: -4 } : undefined}
              whileTap={{ scale: 0.98 }}
              disabled={answered}
              onClick={() => handlePick(i)}
              animate={lieFound ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                'opt-btn flex items-center gap-3',
                answered && !isLie && !isPicked && 'opacity-60',
                lieFound && 'border-emerald-400/70 bg-emerald-500/20',
                lieRevealed && 'border-amber-400/70 bg-amber-500/15',
                wrongPick && 'border-rose-400/60 bg-rose-500/15',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm font-bold',
                  lieFound
                    ? 'border-emerald-300 text-emerald-200'
                    : 'border-white/30 text-white/60',
                )}
              >
                {answered ? (isLie ? '✓' : '') : i + 1}
              </span>
              <span className="flex-1 text-right">{s}</span>
              {answered && (
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-xs font-bold',
                    isLie
                      ? correct
                        ? 'bg-emerald-400/20 text-emerald-200'
                        : 'bg-amber-400/20 text-amber-200'
                      : 'bg-white/10 text-white/55',
                  )}
                >
                  {isLie ? 'השקר' : 'אמת'}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
