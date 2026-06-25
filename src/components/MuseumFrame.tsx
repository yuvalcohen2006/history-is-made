import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../utils/cn'

interface MuseumFrameProps {
  /** Image file name under /assets (e.g. "stone-tool.jpg"). */
  image: string
  /** Artifact name shown under the photo. */
  caption: string
  /** Explanation revealed in the hover accordion (right-aligned). */
  description?: string
  className?: string
}

/**
 * The single artifact card: the photo, a name caption, the explanation shown
 * statically, and a cursor-follow sheen. Clicking the photo opens a fullscreen
 * lightbox.
 */
export function MuseumFrame({ image, caption, description, className }: MuseumFrameProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const canZoom = loaded && !failed

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        onMouseMove={onMove}
        className={cn(
          'sheen-host group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-sm',
          className,
        )}
      >
        {/* cursor-follow glow */}
        <div className="sheen" aria-hidden />

        <div
          className={cn(
            'relative z-0 aspect-[4/3] w-full overflow-hidden rounded-xl',
            canZoom && 'cursor-zoom-in',
          )}
          onClick={() => canZoom && setOpen(true)}
        >
          {(!loaded || failed) && (
            <div className="grain absolute inset-0 grid place-items-center bg-gradient-to-br from-stone/30 via-black/40 to-charcoal">
              <div className="text-center text-white/55">
                <svg viewBox="0 0 48 48" className="mx-auto h-10 w-10 text-white/45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18 24 7l18 11" />
                  <path d="M9 18v18M17 18v18M31 18v18M39 18v18" />
                  <path d="M5 40h38" />
                </svg>
                <p className="mt-2 px-4 text-sm font-display font-bold">{caption}</p>
                <p className="mt-1 text-[11px] text-white/35" dir="ltr">
                  {image}
                </p>
              </div>
            </div>
          )}

          {!failed && (
            <img
              src={`/assets/${image}`}
              alt={caption}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={cn(
                'h-full w-full object-cover transition-opacity duration-700',
                loaded ? 'opacity-100' : 'opacity-0',
              )}
            />
          )}

          {/* glass reflection sheen on the image */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15" />
        </div>

        {/* name caption */}
        <p className="relative z-0 mt-3 text-center font-display text-base font-bold text-white/85">
          {caption}
        </p>

        {/* explanation — shown statically inside the container */}
        {description && (
          <p className="relative z-0 mt-3 text-right text-base leading-relaxed text-white/85">
            {description}
          </p>
        )}
      </motion.div>

      {/* fullscreen lightbox (portaled to body to escape transformed ancestors) */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] grid cursor-zoom-out place-items-center bg-black/90 p-6 backdrop-blur-sm"
            >
              <motion.img
                src={`/assets/${image}`}
                alt={caption}
                initial={{ scale: 0.92 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.92 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
