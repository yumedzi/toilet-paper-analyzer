import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useT } from '../i18n'

/** Loader: a roll tumbles across the screen, unrolling a paper trail behind it. */
export function Splash({ onDone }: { onDone: () => void }) {
  const { t } = useT()
  const reduce = useReducedMotion()
  const dur = reduce ? 0.4 : 1.7
  useEffect(() => {
    const id = window.setTimeout(onDone, (dur + 0.55) * 1000)
    return () => window.clearTimeout(id)
  }, [dur, onDone])

  return (
    <motion.div className="splash" exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }} transition={{ duration: 0.45 }}>
      <div className="splash__stage">
        <motion.div
          className="splash__trail"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: dur, ease: [0.45, 0, 0.2, 1] }}
        >
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="splash__perf" style={{ left: `${(i + 1) * 12.5}%` }} />
          ))}
        </motion.div>
        <motion.svg
          className="splash__roll"
          viewBox="0 0 100 100"
          initial={{ x: '-8vw', rotate: 0, scale: 1 }}
          animate={{ x: 'min(72vw, 300px)', rotate: 720, scale: 0.72 }}
          transition={{ duration: dur, ease: [0.45, 0, 0.2, 1] }}
        >
          <defs>
            <radialGradient id="sp-roll" cx="0.4" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#fffdf7" />
              <stop offset="1" stopColor="#efd9b8" />
            </radialGradient>
            <linearGradient id="sp-core" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff6fae" />
              <stop offset="1" stopColor="#7c5cff" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#sp-roll)" />
          <path
            d="M50 50 m0 -10 a10 10 0 1 1 -0.1 0 m0 -8 a18 18 0 1 1 -0.1 0 m0 -8 a26 26 0 1 1 -0.1 0 m0 -8 a34 34 0 1 1 -0.1 0"
            fill="none"
            stroke="#e3c9a2"
            strokeWidth="1.4"
            opacity="0.8"
          />
          <circle cx="50" cy="50" r="13" fill="url(#sp-core)" />
          <circle cx="50" cy="50" r="7" fill="#1a1230" />
          <circle cx="50" cy="12" r="2.5" fill="#ff6fae" />
        </motion.svg>
      </div>
      <motion.h1
        className="splash__title"
        initial={{ opacity: 0, y: 16, letterSpacing: '0.3em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.02em' }}
        transition={{ delay: reduce ? 0 : 0.5, duration: 0.8, ease: 'easeOut' }}
      >
        Roll<span>Call</span>
      </motion.h1>
      <motion.p className="splash__tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 0.9 }}>
        {t.loading}
      </motion.p>
    </motion.div>
  )
}
