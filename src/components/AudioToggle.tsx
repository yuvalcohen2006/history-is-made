import { useAudio } from '../audio/AudioProvider'
import { cn } from '../utils/cn'

/** Mute / unmute control for the ambient + UI sounds. */
export function AudioToggle() {
  const { muted, toggleMute } = useAudio()

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={!muted}
      aria-label={muted ? 'הפעל צלילים' : 'השתק צלילים'}
      className={cn(
        'fixed left-3 top-3 z-50 grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition-colors',
        muted
          ? 'border-white/15 bg-black/35 text-white/70 hover:bg-black/55'
          : 'border-[var(--accent)]/60 bg-black/45 text-sand hover:bg-black/60',
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" stroke="none" />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" />
        ) : (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 6a9 9 0 0 1 0 12" />
          </>
        )}
      </svg>
    </button>
  )
}
