import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ScenarioInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/**
 * Scenario ("what would happen"): a short situation on a distinct story card,
 * then the learner predicts the consequence from the choices. Tests cause→effect
 * understanding rather than recall.
 */
export function Scenario({
  data,
  onResolved,
}: { data: ScenarioInteraction } & InteractionProps) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const state: FeedbackState = !answered
    ? 'idle'
    : picked === data.correctIndex
      ? 'correct'
      : 'wrong'

  const pick = (i: number) => {
    setPicked(i)
    onResolved?.(i === data.correctIndex)
  }

  return (
    <div>
      {/* story card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-2xl border-r-4 bg-black/35 p-5 backdrop-blur"
        style={{ borderRightColor: 'var(--accent)' }}
      >
        <span className="font-display text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          תרחיש
        </span>
        <p className="mt-1 text-base leading-relaxed text-white/90">{data.scenario}</p>
      </motion.div>

      <p className="mb-3 font-display text-lg font-bold">{data.prompt}</p>
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
              onClick={() => pick(i)}
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
