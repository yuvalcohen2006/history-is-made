import { useCallback, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { Station } from '../types'
import { eraThemes } from '../data/eraThemes'
import { interactions } from '../data/interactionsData'
import { stations } from '../data/timelineData'
import { ui } from '../data/ui'
import { cn } from '../utils/cn'
import { useProgress } from '../progress/ProgressProvider'
import { useAudio } from '../audio/AudioProvider'
import { MuseumFrame } from './MuseumFrame'
import { HolographicCard } from './ui/holographic-card'
import { Lock } from './icons/Lock'
import { InteractionRenderer } from './interactions/InteractionRenderer'

interface TimelineStationProps {
  station: Station
  index: number
}

/** Staggered "fly-up + fade" reveal for the station's blocks as it enters view. */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 42 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}

/** One full timeline station: narrative + artifact vitrine + gated challenge. */
export function TimelineStation({ station, index }: TimelineStationProps) {
  const theme = eraThemes[station.eraKey]
  const questions = interactions[station.id] ?? []

  const { isUnlocked, markPassed } = useProgress()
  const { playUi } = useAudio()
  const unlocked = isUnlocked(index)
  const nextStation = stations[index + 1]

  const [qIndex, setQIndex] = useState(0)
  const [currentResolved, setCurrentResolved] = useState(false)
  const [allPassed, setAllPassed] = useState(false)
  const isLastQuestion = qIndex >= questions.length - 1

  const handleQuestionResolved = useCallback(
    (didPass: boolean) => {
      // No retries: any answer reveals the result + explanation and lets the user
      // continue. Sound reflects whether they were right.
      playUi(didPass ? 'correct' : 'wrong')
      setCurrentResolved(true)
      if (isLastQuestion) {
        markPassed(index) // unlock the next station
        setAllPassed(true)
      }
    },
    [index, isLastQuestion, markPassed, playUi],
  )

  const nextQuestion = useCallback(() => {
    setQIndex((i) => i + 1)
    setCurrentResolved(false)
  }, [])

  const goNext = useCallback(() => {
    if (nextStation) {
      document.getElementById(`station-${nextStation.id}`)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [nextStation])

  return (
    <section
      data-station-index={index}
      id={`station-${station.id}`}
      aria-label={`תחנה ${station.id}: ${station.title}`}
      className="relative flex min-h-[122svh] items-start px-5 pb-28 pt-[15vh] md:px-10"
      style={{ ['--accent' as keyof CSSProperties]: theme.accent } as CSSProperties}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className={cn(
          // centered on small screens; on large screens nudged toward the right
          // with clearance reserved for the way-map rail
          'mx-auto w-full max-w-5xl transition-[filter,opacity] duration-500',
          'lg:ml-auto lg:mr-[180px] xl:mr-[204px]',
          !unlocked && 'pointer-events-none select-none blur-md',
        )}
      >
        {/* station meta — rounded-square number + plain time-range */}
        <motion.div variants={item} className="mb-5 flex items-center gap-3">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-xl font-black leading-none backdrop-blur"
            style={{
              backgroundImage: `linear-gradient(160deg, ${theme.accent}59, ${theme.accent}1a)`,
              border: `1px solid ${theme.accent}`,
              color: theme.accent,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
            }}
          >
            <span className="block translate-y-[2px]">{station.id}</span>
          </span>
          <span
            className="font-display text-base text-white/80"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            {station.timeRange}
          </span>
        </motion.div>

        {/* title — plain, no card */}
        <motion.h2
          variants={item}
          className="text-4xl font-black leading-tight md:text-5xl"
          style={{ color: '#f3ead9', textShadow: '0 4px 28px rgba(0,0,0,0.9)' }}
        >
          {station.title}
        </motion.h2>

        {/* opener — plain, no card */}
        <motion.p
          variants={item}
          className="mt-4 max-w-2xl text-lg font-bold leading-relaxed md:text-xl"
          style={{ color: theme.accent, textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}
        >
          {station.opener}
        </motion.p>

        {/* main grid: narrative card + concept | artifact — columns equal height */}
        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {/* narrative column */}
          <motion.div variants={item} className="flex flex-col">
            <HolographicCard accent={theme.accent}>
              <p className="text-base leading-relaxed text-white/90">{station.mainText}</p>
              <div className="my-4 border-t border-white/10" />
              <h3
                className="mb-1 font-display text-lg font-bold md:text-xl"
                style={{ color: '#f3ead9' }}
              >
                {ui.station.whatChanged}
              </h3>
              <p className="text-base leading-relaxed text-white/90">{station.whatChanged}</p>
            </HolographicCard>

            {/* key concept — framed by two corner brackets (top-left + bottom-right),
                top gap equal to the column gap; icon sits to the right of the text */}
            <div
              className="relative mt-7 flex flex-1 items-center justify-start px-6"
              style={{ textShadow: '0 2px 14px rgba(0,0,0,0.85)' }}
            >
              {/* corner brackets — match the card's stroke: white, 1.5px, rounded, soft glow */}
              <span
                className="pointer-events-none absolute left-0 top-0 h-1/3 w-1/3 rounded-tl-2xl border-l-[1.5px] border-t-[1.5px] border-white/80"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}
              />
              <span
                className="pointer-events-none absolute bottom-0 right-0 h-1/3 w-1/3 rounded-br-2xl border-b-[1.5px] border-r-[1.5px] border-white/80"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}
              />

              <div className="flex items-center gap-4">
                {/* glowing one-line lightbulb, to the right of the text (RTL) */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-16 w-16 shrink-0"
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 0 8px ${theme.accent})` }}
                  aria-hidden
                >
                  <path d="M9 18h6M10 21h4" />
                  <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
                </svg>
                <div className="text-right">
                  <h4 className="font-display text-3xl font-black" style={{ color: theme.accent }}>
                    {station.concept.term}
                  </h4>
                  <p className="mt-1 max-w-xs text-lg font-light italic leading-relaxed text-white/85">
                    {station.concept.definition}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* artifact — the single photo card (cursor sheen + hover accordion) */}
          <motion.div variants={item} className="flex">
            <MuseumFrame
              image={station.artifact.image}
              caption={station.artifact.name}
              description={station.artifact.teaches}
              className="h-full w-full"
            />
          </motion.div>
        </div>

        {/* interactive challenge — centered, contained width, sequential questions */}
        {questions.length > 0 && (
          <motion.div variants={item} className="glass-card mx-auto mt-8 max-w-3xl p-6 text-white">
            <h3 className="mb-4 text-center font-display text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
              {ui.station.challenge}
            </h3>

            {/* question counter for multi-question stations (no circles) */}
            {questions.length > 1 && (
              <p className="mb-5 text-center text-xs text-white/55">
                שאלה {qIndex + 1} מתוך {questions.length}
              </p>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={qIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <InteractionRenderer
                  interaction={questions[qIndex]}
                  onResolved={handleQuestionResolved}
                />
              </motion.div>
            </AnimatePresence>

            {/* advance within the station */}
            {currentResolved && !isLastQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-center"
              >
                <button type="button" onClick={nextQuestion} className="btn-primary">
                  לשאלה הבאה
                </button>
              </motion.div>
            )}

            {/* continue to the next subject */}
            {allPassed && nextStation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 flex flex-col items-center gap-2"
              >
                <button type="button" onClick={goNext} className="btn-primary">
                  {ui.buttons.next}
                </button>
                <span className="text-xs text-white/55">או המשיכו בגלילה</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* lock gate overlay */}
      {!unlocked && (
        <div className="absolute inset-0 z-20 grid place-items-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-sm rounded-3xl border border-white/15 bg-black/60 p-8 text-center backdrop-blur-md"
          >
            <Lock className="mx-auto h-12 w-12 text-[var(--accent)]" title="תחנה נעולה" />
            <h3 className="mt-4 font-display text-2xl font-black text-sand">התחנה נעולה</h3>
            <p className="mt-2 text-white/75">
              כדי להמשיך, ענו נכון על האתגר של התחנה הקודמת. כל תקופה נפתחת אחרי שמבינים את שלפניה.
            </p>
          </motion.div>
        </div>
      )}
    </section>
  )
}
