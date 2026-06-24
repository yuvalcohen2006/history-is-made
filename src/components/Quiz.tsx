import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { quizQuestions } from '../data/quizData'
import { ui } from '../data/ui'
import { cn } from '../utils/cn'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { EtherealShadow } from './ui/etheral-shadow'

interface QuizProps {
  onClose: () => void
  onBackToTimeline: () => void
}

/** Closing quiz overlay — 8 questions, immediate feedback, final score. */
export function Quiz({ onClose, onBackToTimeline }: QuizProps) {
  const reduced = useReducedMotion()
  const [current, setCurrent] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = quizQuestions[current]
  const answered = picked !== null
  const isLast = current === quizQuestions.length - 1

  const pick = (i: number) => {
    if (answered) return
    setPicked(i)
    if (i === q.correctIndex) setScore((s) => s + 1)
  }

  const next = () => {
    if (isLast) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setPicked(null)
    }
  }

  const restart = () => {
    setCurrent(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
  }

  const total = quizQuestions.length
  const scoreMessage =
    score === total ? ui.quiz.perfect : score >= total - 2 ? ui.quiz.good : ui.quiz.keepGoing

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={ui.quiz.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center px-5 py-10"
      style={{ ['--accent' as never]: '#5ec5d6' } as never}
    >
      {/* modern, brighter breathing background (not the dark cave look) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, #2c3f6e 0%, #213253 55%, #161f38 100%)',
        }}
      />
      <div className="absolute inset-0 -z-10" style={{ mixBlendMode: 'screen', opacity: 0.6 }}>
        <EtherealShadow
          color="rgba(94,197,214,0.85)"
          sizing="fill"
          animation={reduced ? undefined : { scale: 92, speed: 60 }}
          noise={{ opacity: 0.15, scale: 1.2 }}
        />
      </div>
      <div className="absolute inset-0 -z-10" style={{ mixBlendMode: 'screen', opacity: 0.5 }}>
        <EtherealShadow
          color="rgba(150,120,225,0.7)"
          sizing="fill"
          animation={reduced ? undefined : { scale: 80, speed: 38 }}
          noise={{ opacity: 0, scale: 1 }}
        />
      </div>
      <div className="absolute inset-0 -z-10 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl">
        {!finished ? (
          <div className="glass-card p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between text-sm text-white/60">
              <span>{ui.quiz.title}</span>
              <span>
                {current + 1} / {total}
              </span>
            </div>

            {/* progress bar */}
            <div className="mb-6 h-1.5 w-full overflow-hidden rounded bg-white/10">
              <motion.div
                className="h-full bg-[var(--accent)]"
                animate={{ width: `${((current + (answered ? 1 : 0)) / total) * 100}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-5 font-display text-xl font-bold text-sand">{q.question}</h3>
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correctIndex
                    const isPicked = i === picked
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={answered}
                        onClick={() => pick(i)}
                        className={cn(
                          'opt-btn',
                          answered && isCorrect && 'border-emerald-400/60 bg-emerald-500/20',
                          answered && isPicked && !isCorrect && 'border-rose-400/60 bg-rose-500/20',
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {answered && picked !== q.correctIndex && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
                  >
                    <span className="font-bold">{ui.quiz.explanationLabel} </span>
                    {q.explanation}
                  </motion.div>
                )}

                {answered && (
                  <button type="button" onClick={next} className="btn-primary mt-5">
                    {isLast ? ui.buttons.finish : ui.buttons.next}
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <p className="text-lg text-white/70">{ui.quiz.scorePrefix}</p>

            {/* animated score ring */}
            {(() => {
              const pct = score / total
              const R = 54
              const C = 2 * Math.PI * R
              const ringColor = pct === 1 ? '#34d399' : pct >= 0.75 ? '#c9a24b' : '#fbbf24'
              return (
                <div className="relative mx-auto mt-4 h-40 w-40">
                  <svg viewBox="0 0 130 130" className="h-full w-full -rotate-90">
                    <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="11" />
                    <motion.circle
                      cx="65"
                      cy="65"
                      r={R}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="11"
                      strokeLinecap="round"
                      strokeDasharray={C}
                      initial={{ strokeDashoffset: C }}
                      animate={{ strokeDashoffset: C * (1 - pct) }}
                      transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                      style={{ filter: `drop-shadow(0 0 8px ${ringColor})` }}
                    />
                  </svg>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 16 }}
                    className="absolute inset-0 grid place-content-center"
                  >
                    <span className="font-display text-4xl font-black text-sand">
                      {score}
                      <span className="text-2xl text-white/50">/{total}</span>
                    </span>
                  </motion.div>
                </div>
              )
            })()}

            <p className="mt-4 text-lg text-white/85">{scoreMessage}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button type="button" onClick={restart} className="btn-primary">
                {ui.buttons.again}
              </button>
              <button type="button" onClick={onBackToTimeline} className="btn-ghost">
                {ui.buttons.backToTimeline}
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-white/50 underline-offset-4 hover:underline"
          >
            סגור
          </button>
        </div>
      </div>
    </motion.div>
  )
}
