import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const BITS = ['🧻', '💖', '✨', '⭐', '💜', '🧻', '✨', '💖', '⭐', '🧻', '💜', '✨']

/** A little burst of love (and paper) whenever a new best deal is saved. */
export function Confetti({ trigger }: { trigger: number }) {
  const reduce = useReducedMotion()
  const [shot, setShot] = useState(0)
  useEffect(() => {
    if (!trigger || reduce) return
    setShot(trigger)
    const id = window.setTimeout(() => setShot(0), 1300)
    return () => window.clearTimeout(id)
  }, [trigger, reduce])
  return (
    <span className="confetti" aria-hidden>
      <AnimatePresence>
        {shot > 0 &&
          BITS.map((b, i) => {
            const a = (i / BITS.length) * Math.PI * 2 + shot
            const r = 90 + (i % 3) * 40
            return (
              <motion.span
                key={`${shot}-${i}`}
                className="confetti__bit"
                initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
                animate={{ x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7 - 70, scale: 1, opacity: 0, rotate: (i % 2 ? 1 : -1) * 240 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.1, 0.7, 0.3, 1] }}
              >
                {b}
              </motion.span>
            )
          })}
      </AnimatePresence>
    </span>
  )
}
