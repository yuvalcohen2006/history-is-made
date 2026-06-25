import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ClassifyInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { useAudio } from '../../audio/AudioProvider'
import { Feedback, type FeedbackState } from './Feedback'
import type { InteractionProps } from './InteractionRenderer'

/** Shuffled order of item indices (so the cards aren't always in the same order). */
function shuffledIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Card-sorting: one shuffled card at a time, sent to one of two buckets. Each
 * placement gives INSTANT feedback — the chosen bucket flashes green/red with a
 * sound — then advances. At the end it keeps a short tally of right/wrong.
 */
export function ClassifySwipe({
  data,
  onResolved,
}: { data: ClassifyInteraction } & InteractionProps) {
  const { playUi } = useAudio()
  const [order] = useState(() => shuffledIndices(data.items.length))
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, 0 | 1>>({})
  const [flash, setFlash] = useState<{ bucket: 0 | 1; correct: boolean } | null>(null)

  const done = step >= order.length
  const correctCount = useMemo(
    () =>
      Object.entries(answers).filter(([i, b]) => data.items[Number(i)].bucket === b).length,
    [answers, data.items],
  )
  const state: FeedbackState = !done
    ? 'idle'
    : correctCount === data.items.length
      ? 'correct'
      : 'wrong'

  const choose = (bucket: 0 | 1) => {
    if (flash) return // mid-feedback; ignore
    const origIdx = order[step]
    const correct = bucket === data.items[origIdx].bucket
    const next = { ...answers, [origIdx]: bucket }
    const isLast = step + 1 >= order.length

    setAnswers(next)
    setFlash({ bucket, correct })
    // instant per-item sound; the final overall sound is played by the parent on resolve
    if (!isLast) playUi(correct ? 'correct' : 'wrong')

    window.setTimeout(() => {
      setFlash(null)
      setStep((s) => s + 1)
      if (isLast) {
        const allRight = order.every((i) => next[i] === data.items[i].bucket)
        onResolved?.(allRight)
      }
    }, 650)
  }

  const current = !done ? data.items[order[step]] : null

  return (
    <div>
      <p className="mb-4 font-display text-lg font-bold">{data.prompt}</p>

      <div className="relative min-h-[150px]">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid place-items-center rounded-2xl border border-white/12 bg-black/35 px-6 py-8 text-center backdrop-blur-sm"
            >
              <span className="text-xs text-white/50">
                {step + 1} / {data.items.length}
              </span>
              <span className="mt-2 text-xl font-bold">{current?.label}</span>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-white/12 bg-black/35 px-5 py-5 backdrop-blur-sm"
            >
              <p className="mb-3 text-center font-display text-lg font-bold">
                סיווגת נכון {correctCount} מתוך {data.items.length}
              </p>
              <ul className="flex flex-col gap-2">
                {data.items.map((item, i) => {
                  const chosen = answers[i]
                  const right = chosen === item.bucket
                  return (
                    <li
                      key={i}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm',
                        right
                          ? 'border-emerald-400/40 bg-emerald-500/10'
                          : 'border-rose-400/40 bg-rose-500/10',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden className={right ? 'text-emerald-300' : 'text-rose-300'}>
                          {right ? '✓' : '✗'}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      <span className="shrink-0 text-xs text-white/70">
                        {right ? (
                          data.buckets[item.bucket]
                        ) : (
                          <>
                            בחרת: {data.buckets[chosen]} · נכון:{' '}
                            <span className="font-bold text-emerald-200">
                              {data.buckets[item.bucket]}
                            </span>
                          </>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {data.buckets.map((bucket, b) => {
            const isFlash = flash?.bucket === b
            return (
              <button
                key={b}
                type="button"
                disabled={!!flash}
                onClick={() => choose(b as 0 | 1)}
                className={cn(
                  'opt-btn flex items-center justify-center px-4 py-4 font-display font-bold transition-colors',
                  isFlash && flash?.correct && 'border-emerald-400/70 bg-emerald-500/30',
                  isFlash && !flash?.correct && 'border-rose-400/70 bg-rose-500/30',
                )}
              >
                {bucket}
              </button>
            )
          })}
        </div>
      )}

      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
