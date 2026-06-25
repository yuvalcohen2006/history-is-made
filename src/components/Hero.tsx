import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ui } from '../data/ui'
import { FlowButton } from './ui/flow-button'

interface HeroProps {
  onStart: () => void
}

/** Cinematic opening screen — the campfire video is the backdrop, and the text
 *  sits in the upper-center so the fire (bottom ~half of the clip) stays clear. */
export function Hero({ onStart }: HeroProps) {
  const [hasVideo, setHasVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Only decode/play the video while the hero is on screen, and resume on
  // return — fixes stutter from background decoding and "stuck after scroll".
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const tryPlay = () => el.play().catch(() => {})
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay()
        else el.pause()
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-6 pt-[18vh] text-center"
      aria-label="מסך פתיחה"
    >
      {/* dark fallback base (shown until / unless the video loads) */}
      <div className="absolute inset-0 -z-10 bg-charcoal" />

      {/* campfire video backdrop */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setHasVideo(true)}
        onEnded={(e) => {
          // manual loop fallback if the loop attribute is dropped/throttled
          e.currentTarget.currentTime = 0
          e.currentTarget.play().catch(() => {})
        }}
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000"
        style={{ opacity: hasVideo ? 1 : 0 }}
      >
        <source src="/assets/video/hero.mp4" type="video/mp4" />
      </video>

      {/* soft top-down darkening so the raised text stays crisp over the flames */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0) 60%)',
        }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="relative z-10 whitespace-nowrap font-display text-4xl font-black leading-tight text-sand sm:text-5xl md:text-6xl lg:text-7xl"
        style={{ textShadow: '0 6px 40px rgba(0,0,0,0.85)' }}
      >
        {ui.hero.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="relative z-10 mt-3 font-display text-xl font-semibold text-white/85 md:text-2xl"
        style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}
      >
        {ui.hero.subtitle}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="relative z-10 mt-7 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
        style={{ textShadow: '0 2px 16px rgba(0,0,0,0.85)' }}
      >
        {ui.hero.intro}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="relative z-10 mt-9"
      >
        <FlowButton text={ui.hero.start} onClick={onStart} />
      </motion.div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 2 }}
        className="absolute bottom-8 z-10 text-2xl text-white/60"
      >
        ↓
      </motion.div>
    </section>
  )
}
