import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'prehistory-progress'

interface ProgressValue {
  /** Highest accessible station index. Stations 0..unlockedIndex are unlocked. */
  unlockedIndex: number
  isUnlocked: (index: number) => boolean
  /** Mark a station's mini-quiz as passed; advances the gate sequentially. */
  markPassed: (index: number) => void
  /** True once every gated station has been passed (final quiz may open). */
  allDone: boolean
  /** Whether sequential locking is in effect (false = everything open, dev). */
  lockEnabled: boolean
  reset: () => void
}

const ProgressCtx = createContext<ProgressValue | null>(null)

/** Number of gated stations (those with a mini-quiz): stations 1..15 → indices 0..14. */
const GATED_COUNT = 15

/**
 * DEV: set to true to open every station (no locking) while building.
 * Production: false — stations unlock sequentially as each is answered.
 */
const UNLOCK_ALL = true

/**
 * Sequential lock-gate. A station is unlocked only after every previous station's
 * mini-quiz was answered correctly. Progress persists across reloads.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [unlockedIndex, setUnlockedIndex] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const n = stored ? Number(stored) : 0
    return Number.isFinite(n) && n >= 0 ? n : 0
  })

  const markPassed = useCallback((index: number) => {
    setUnlockedIndex((prev) => {
      // Only advances when the just-passed station is the current frontier.
      if (index === prev) {
        const next = prev + 1
        localStorage.setItem(STORAGE_KEY, String(next))
        return next
      }
      return prev
    })
  }, [])

  const isUnlocked = useCallback(
    (index: number) => UNLOCK_ALL || index <= unlockedIndex,
    [unlockedIndex],
  )

  const reset = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '0')
    setUnlockedIndex(0)
  }, [])

  const value = useMemo(
    () => ({
      unlockedIndex,
      isUnlocked,
      markPassed,
      allDone: UNLOCK_ALL || unlockedIndex >= GATED_COUNT,
      lockEnabled: !UNLOCK_ALL,
      reset,
    }),
    [unlockedIndex, isUnlocked, markPassed, reset],
  )

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressCtx)
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider')
  return ctx
}
