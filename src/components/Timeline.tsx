import { stations } from '../data/timelineData'
import { useProgress } from '../progress/ProgressProvider'
import { TimelineStation } from './TimelineStation'

/** The scrollable sequence of stations. When locking is on, only the unlocked
 *  stations plus the single next (locked) one are rendered — so the user can't
 *  scroll past the gate, and each further station appears as they progress. */
export function Timeline() {
  const { unlockedIndex, lockEnabled } = useProgress()
  const last = stations.length - 1
  const limit = lockEnabled ? Math.min(last, unlockedIndex + 1) : last

  return (
    <div id="timeline">
      {stations.slice(0, limit + 1).map((station, i) => (
        <TimelineStation key={station.id} station={station} index={i} />
      ))}
    </div>
  )
}
