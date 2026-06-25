import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { FeedbackContent } from '../../types'

export type FeedbackState = 'idle' | 'correct' | 'wrong'

interface FeedbackProps {
  state: FeedbackState
  fb: FeedbackContent
}

/** Small lightbulb glyph for the fun-fact chip (no emoji). */
function Bulb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
    </svg>
  )
}

/**
 * Answer feedback. On both correct and wrong we reveal the full explanation
 * (the question itself highlights the correct answer), framed by tone. The
 * "הידעת?" fun fact stays tucked behind a clean click-to-expand card so the
 * panel never overwhelms.
 */
export function Feedback({ state, fb }: FeedbackProps) {
  const [factOpen, setFactOpen] = useState(false)
  if (state === 'idle') return null

  const correct = state === 'correct'

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={
        'mt-4 overflow-hidden rounded-2xl border ' +
        (correct
          ? 'border-emerald-400/35 bg-emerald-500/10'
          : 'border-amber-400/35 bg-amber-500/10')
      }
    >
      {/* header + takeaway */}
      <div className="flex items-start gap-3 px-4 pt-4">
        <span
          aria-hidden
          className={
            'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm font-bold text-charcoal ' +
            (correct ? 'bg-emerald-400/90' : 'bg-amber-400/90')
          }
        >
          {correct ? '✓' : '!'}
        </span>
        <div>
          <span
            className={
              'block text-xs font-display font-bold uppercase tracking-widest ' +
              (correct ? 'text-emerald-300/90' : 'text-amber-300/90')
            }
          >
            {correct ? 'כל הכבוד' : 'לא נורא — הנה ההסבר'}
          </span>
          <p className="mt-0.5 font-display text-base font-bold text-white">{fb.takeaway}</p>
        </div>
      </div>

      {/* detailed why */}
      <p className="px-4 pb-1 pt-2 text-sm leading-relaxed text-white/85">{fb.explanation}</p>

      {/* one expanding box — the "הידעת?" header and its content live together */}
      {fb.funFact && (
        <div className="px-4 pb-4 pt-2">
          <div className="overflow-hidden rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10">
            <button
              type="button"
              onClick={() => setFactOpen((o) => !o)}
              aria-expanded={factOpen}
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-right font-display text-sm font-bold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
            >
              <Bulb className="h-4 w-4 shrink-0" />
              <span className="flex-1">הידעת?</span>
              <motion.span aria-hidden animate={{ rotate: factOpen ? 180 : 0 }} className="text-lg leading-none">
                ▾
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {factOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  <p className="px-3.5 pb-3.5 text-sm leading-relaxed text-white/85">{fb.funFact}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  )
}
