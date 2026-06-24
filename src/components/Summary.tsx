import { motion } from 'framer-motion'
import { summaryInsights } from '../data/timelineData'
import { ui } from '../data/ui'
import { useProgress } from '../progress/ProgressProvider'

interface SummaryProps {
  onBackToTimeline: () => void
  onStartQuiz: () => void
}

/** Closing recap: the five key insights, then routes to quiz or back to timeline. */
export function Summary({ onBackToTimeline, onStartQuiz }: SummaryProps) {
  const { allDone } = useProgress()
  return (
    <section
      id="summary"
      aria-label="סיכום המסע"
      className="relative flex min-h-[100svh] items-center px-5 py-24 text-charcoal md:px-10"
      style={{ ['--accent' as never]: '#f0469b' } as never}
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-black md:text-5xl"
        >
          {ui.summary.title}
        </motion.h2>

        <ol className="mt-10 flex flex-col gap-4 text-right">
          {summaryInsights.map((insight, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white/50 p-4 backdrop-blur"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-display text-lg font-black text-sand">
                {i + 1}
              </span>
              <span className="text-lg font-medium">{insight}</span>
            </motion.li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={onStartQuiz}
            disabled={!allDone}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {ui.buttons.startQuiz}
          </button>
          <button
            type="button"
            onClick={onBackToTimeline}
            className="btn-ghost text-charcoal"
          >
            {ui.buttons.backToTimeline}
          </button>
        </div>
        {!allDone && (
          <p className="mt-4 text-sm text-charcoal/70">
            כדי לפתוח את החידון, יש להשלים נכון את האתגר בכל התחנות.
          </p>
        )}
      </div>
    </section>
  )
}
