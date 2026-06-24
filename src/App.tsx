import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { AudioToggle } from './components/AudioToggle'
import { EraBackground } from './components/EraBackground'
import { Hero } from './components/Hero'
import { ProgressRail } from './components/ProgressRail'
import { Quiz } from './components/Quiz'
import { Summary } from './components/Summary'
import { Timeline } from './components/Timeline'
import { eraThemes } from './data/eraThemes'
import { stations } from './data/timelineData'
import { useAudio } from './audio/AudioProvider'
import { useProgress } from './progress/ProgressProvider'
import { useScrollStations } from './hooks/useScrollStations'

export default function App() {
  const { frac, active } = useScrollStations(stations.length)
  const activeEra = stations[active]?.eraKey ?? 'intro'
  const accent = eraThemes[activeEra].accent

  const { setEra } = useAudio()
  const { allDone } = useProgress()
  const [quizOpen, setQuizOpen] = useState(false)

  // keep the ambient audio in sync with the active era
  useEffect(() => {
    setEra(activeEra)
  }, [activeEra, setEra])

  const scrollToStation = useCallback((id: number) => {
    document.getElementById(`station-${id}`)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleJump = useCallback(
    (index: number) => scrollToStation(stations[index].id),
    [scrollToStation],
  )

  const handleStart = useCallback(() => scrollToStation(stations[0].id), [scrollToStation])

  const handleBackToTimeline = useCallback(() => {
    setQuizOpen(false)
    scrollToStation(stations[0].id)
  }, [scrollToStation])

  return (
    <div style={{ ['--accent' as keyof CSSProperties]: accent } as CSSProperties}>
      <EraBackground frac={frac} />
      <AudioToggle />
      <ProgressRail activeIndex={active} onJump={handleJump} />

      <main>
        <Hero onStart={handleStart} />
        <Timeline />
        {allDone && (
          <Summary onBackToTimeline={handleBackToTimeline} onStartQuiz={() => setQuizOpen(true)} />
        )}
      </main>

      <AnimatePresence>
        {quizOpen && (
          <Quiz onClose={() => setQuizOpen(false)} onBackToTimeline={handleBackToTimeline} />
        )}
      </AnimatePresence>
    </div>
  )
}
