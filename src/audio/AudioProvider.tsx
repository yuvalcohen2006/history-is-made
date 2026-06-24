import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { EraKey } from '../types'
import { ambientByEra } from '../data/eraThemes'

const STORAGE_KEY = 'prehistory-audio-muted'
const TARGET_VOL = 0.35
const FADE_OUT_MS = 1300
const GAP_MS = 900
const FADE_IN_MS = 2200
const DEBOUNCE_MS = 450

type UiSound = 'correct' | 'wrong' | 'click'

interface AudioContextValue {
  muted: boolean
  toggleMute: () => void
  setEra: (era: EraKey) => void
  playUi: (sound: UiSound) => void
}

const AudioCtx = createContext<AudioContextValue | null>(null)

/**
 * Single source of truth for sound: a shared mute (persisted), the per-era
 * ambient loop, and short UI sound effects. Era changes are debounced and the
 * ambient track cross-fades gracefully — slow fade-out, a short silent gap, then
 * the new loop fades in (no hard cut). Muted by default; unmuting is the user
 * gesture that enables playback. Missing files fail silently.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    // default ON (auto-start); respect a saved preference if the user set one
    return stored === null ? false : stored === 'true'
  })
  const mutedRef = useRef(muted)
  mutedRef.current = muted

  const elRef = useRef<HTMLAudioElement | null>(null)
  const playingEra = useRef<EraKey | null>(null)
  const desiredEra = useRef<EraKey>('intro')

  const fadeTimer = useRef<number | null>(null)
  const gapTimer = useRef<number | null>(null)
  const debounceTimer = useRef<number | null>(null)

  // create the ambient element once and PRELOAD the opening track so it can
  // start the instant the user first interacts (no download wait)
  useEffect(() => {
    const el = new Audio()
    el.loop = true
    el.volume = 0
    el.preload = 'auto'
    el.src = `/assets/audio/${ambientByEra['intro']}`
    el.load()
    elRef.current = el
    return () => {
      el.pause()
      elRef.current = null
    }
  }, [])

  const clearTimers = () => {
    if (fadeTimer.current) window.clearInterval(fadeTimer.current)
    if (gapTimer.current) window.clearTimeout(gapTimer.current)
    fadeTimer.current = null
    gapTimer.current = null
  }

  /** Ramp the element volume to `target` over `ms`, then run `done`. */
  const fade = useCallback((target: number, ms: number, done?: () => void) => {
    const el = elRef.current
    if (!el) return
    if (fadeTimer.current) window.clearInterval(fadeTimer.current)
    const stepMs = 50
    const steps = Math.max(1, Math.round(ms / stepMs))
    const delta = (target - el.volume) / steps
    let n = 0
    fadeTimer.current = window.setInterval(() => {
      n += 1
      el.volume = Math.min(1, Math.max(0, el.volume + delta))
      if (n >= steps) {
        el.volume = Math.max(0, Math.min(1, target))
        if (fadeTimer.current) window.clearInterval(fadeTimer.current)
        fadeTimer.current = null
        done?.()
      }
    }, stepMs)
  }, [])

  /** Fade out the current loop, pause, wait a beat, then fade the new one in. */
  const crossfadeTo = useCallback(
    (era: EraKey) => {
      const el = elRef.current
      if (!el || mutedRef.current) return
      clearTimers()

      const startNew = () => {
        if (mutedRef.current) return
        playingEra.current = era
        el.src = `/assets/audio/${ambientByEra[era]}`
        el.volume = 0
        el.play().catch(() => {})
        fade(TARGET_VOL, FADE_IN_MS)
      }

      if (!playingEra.current || el.paused) {
        // nothing playing yet — just bring the new loop in
        startNew()
        return
      }

      fade(0, FADE_OUT_MS, () => {
        el.pause()
        gapTimer.current = window.setTimeout(startNew, GAP_MS)
      })
    },
    [fade],
  )

  const setEra = useCallback(
    (era: EraKey) => {
      desiredEra.current = era
      if (mutedRef.current) return
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current)
      debounceTimer.current = window.setTimeout(() => {
        if (desiredEra.current !== playingEra.current) crossfadeTo(desiredEra.current)
      }, DEBOUNCE_MS)
    },
    [crossfadeTo],
  )

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      // update the ref synchronously so crossfadeTo (called below) sees it now
      mutedRef.current = next
      localStorage.setItem(STORAGE_KEY, String(next))
      const el = elRef.current
      if (el) {
        if (next) {
          clearTimers()
          fade(0, 400, () => el.pause())
        } else {
          // unmuting is the user gesture that starts playback
          crossfadeTo(desiredEra.current)
        }
      }
      return next
    })
  }, [crossfadeTo, fade])

  const playUi = useCallback((sound: UiSound) => {
    if (mutedRef.current) return
    const audio = new Audio(`/assets/audio/ui/${sound}.mp3`)
    audio.volume = 0.5
    audio.play().catch(() => {})
  }, [])

  useEffect(() => () => clearTimers(), [])

  // Auto-start: browsers block audio until a user gesture, so start the ambient
  // loop on the first interaction (scroll / click / key) if not muted.
  useEffect(() => {
    const start = () => {
      const el = elRef.current
      if (!mutedRef.current && el && el.paused) {
        crossfadeTo(desiredEra.current)
      }
      remove()
    }
    const remove = () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
      window.removeEventListener('wheel', start)
      window.removeEventListener('touchstart', start)
    }
    window.addEventListener('pointerdown', start, { once: true })
    window.addEventListener('keydown', start, { once: true })
    window.addEventListener('wheel', start, { once: true })
    window.addEventListener('touchstart', start, { once: true })
    return remove
  }, [crossfadeTo])

  const value = useMemo(
    () => ({ muted, toggleMute, setEra, playUi }),
    [muted, toggleMute, setEra, playUi],
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider')
  return ctx
}
