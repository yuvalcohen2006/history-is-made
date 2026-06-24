import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MultipleChoiceInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/** Classic single-answer question with an animated reveal of the result. */
export function MultipleChoice({
  data,
  onResolved,
}: { data: MultipleChoiceInteraction } & InteractionProps) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const state: FeedbackState = !answered
    ? 'idle'
    : picked === data.correctIndex
      ? 'correct'
      : 'wrong'

  const handlePick = (i: number) => {
    setPicked(i)
    onResolved?.(i === data.correctIndex)
  }

  return (
    <div>
      <p className="mb-4 font-display text-lg font-bold">{data.prompt}</p>
      <div className="flex flex-col gap-3">
        {data.options.map((opt, i) => {
          const isCorrect = i === data.correctIndex
          const isPicked = i === picked
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.98 }}
              disabled={answered}
              onClick={() => handlePick(i)}
              className={cn(
                'opt-btn',
                answered && isCorrect && 'border-emerald-400/60 bg-emerald-500/20',
                answered && isPicked && !isCorrect && 'border-rose-400/60 bg-rose-500/20',
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
