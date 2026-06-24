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
              whileHover={!answered ? { y: -4 } : undefined}
              whileTap={{ scale: 0.97 }}
              disabled={answered}
              onClick={() => handlePick(i)}
              className={cn(
                'group relative overflow-hidden rounded-xl border px-3 pb-3 pt-6 text-center transition-colors',
                'border-white/15 bg-gradient-to-b from-white/10 to-black/20 hover:from-white/15',
                showCorrect && 'border-emerald-400/70 from-emerald-500/25',
                showWrong && 'border-rose-400/70 from-rose-500/25',
              )}
            >
              {/* simple vitrine glyph */}
              <span aria-hidden className="mx-auto mb-2 block h-8 w-8 rounded-full border border-current opacity-50" />
              <span className="text-sm font-medium">{opt.label}</span>
            </motion.button>
          )
        })}
      </div>
      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
