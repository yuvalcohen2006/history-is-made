import { useState } from 'react'
import { motion } from 'framer-motion'
import type { FillBlankInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/**
 * Fill-the-blank with a word bank: a sentence with a gap and a row of word chips.
 * Tap the chip you think completes the sentence and it drops into the blank.
 */
export function FillBlank({
  data,
  onResolved,
}: { data: FillBlankInteraction } & InteractionProps) {
  const [placed, setPlaced] = useState<number | null>(null)
  const answered = placed !== null
  const correct = placed === data.correctIndex
  const state: FeedbackState = !answered ? 'idle' : correct ? 'correct' : 'wrong'

  const place = (i: number) => {
    if (answered) return // no retry — locks on first choice
    setPlaced(i)
    onResolved?.(i === data.correctIndex)
  }

  return (
    <div>
      <p className="mb-4 font-display text-lg font-bold">{data.prompt}</p>

      {/* the sentence with the blank */}
      <div className="glass-panel flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 p-5 text-center text-lg leading-loose">
        <span>{data.before}</span>
        <motion.span
          animate={answered && !correct ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            'mx-1 inline-flex min-w-[90px] items-center justify-center rounded-lg border-2 border-dashed px-3 py-1 font-bold',
            placed === null && 'border-white/30 text-white/40',
            answered && correct && 'border-emerald-400/70 bg-emerald-500/20 text-emerald-50',
            answered && !correct && 'border-rose-400/70 bg-rose-500/20 text-rose-50',
          )}
        >
          {placed === null ? '    ' : data.options[placed]}
        </motion.span>
        <span>{data.after}</span>
      </div>

      {/* word bank */}
      <div className="mt-4 flex flex-wrap justify-center gap-2.5">
        {data.options.map((opt, i) => {
          const used = placed === i
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.95 }}
              disabled={answered}
              onClick={() => place(i)}
              className={cn(
                'opt-btn px-4 py-2 text-base',
                // reveal the correct chip in green even if the user missed
                answered && i === data.correctIndex && 'border-emerald-400/60 bg-emerald-500/20',
                used && !correct && 'border-rose-400/60 bg-rose-500/20',
              )}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>

      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
