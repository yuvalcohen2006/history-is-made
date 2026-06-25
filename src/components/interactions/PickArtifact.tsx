import { useState } from 'react'
import { motion } from 'framer-motion'
import type { PickArtifactInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/**
 * Pick-the-artifact: options shown as little museum vitrine tiles; the learner
 * chooses the one that fits the prompt.
 */
export function PickArtifact({
  data,
  onResolved,
}: { data: PickArtifactInteraction } & InteractionProps) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const state: FeedbackState = !answered
    ? 'idle'
    : data.options[picked].correct
      ? 'correct'
      : 'wrong'

  const handlePick = (i: number) => {
    setPicked(i)
    onResolved?.(data.options[i].correct)
  }

  return (
    <div>
      <p className="mb-4 font-display text-lg font-bold">{data.prompt}</p>
      <div className="grid grid-cols-2 gap-3">
        {data.options.map((opt, i) => {
          const isPicked = i === picked
          const showCorrect = answered && opt.correct
          const showWrong = answered && isPicked && !opt.correct
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={answered}
              onClick={() => handlePick(i)}
              className={cn(
                'opt-btn flex min-h-[3.75rem] items-center justify-center text-center',
                showCorrect && 'border-emerald-400/60 bg-emerald-500/20',
                showWrong && 'border-rose-400/60 bg-rose-500/20',
              )}
            >
              {opt.label}
            </motion.button>
          )
        })}
      </div>
      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
