import { motion, useReducedMotion } from 'motion/react'

const WAVE_A = 'M14 38 H46 V56 Q38 60 30 56.5 Q22 53 14 56.5 Z'
const WAVE_B = 'M14 38 H46 V57 Q38 53.5 30 57 Q22 60.5 14 56 Z'

/** Animated mark: a roll in 3/4 view whose sheet gently waves. */
export function Logo({ size = 40, animate = true }: { size?: number; animate?: boolean }) {
  const reduce = useReducedMotion()
  const live = animate && !reduce
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 60 64" aria-hidden>
      <defs>
        <linearGradient id="lg-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#f3e3c8" />
        </linearGradient>
        <linearGradient id="lg-sheet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3dc" />
          <stop offset="1" stopColor="#ffd9e6" />
        </linearGradient>
        <linearGradient id="lg-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6fae" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
      </defs>
      {/* body */}
      <path d="M14 12 H46 A6 14 0 0 1 46 40 H14 Z" fill="url(#lg-paper)" />
      {/* hanging sheet */}
      <motion.g
        style={{ originX: '30px', originY: '38px' }}
        animate={live ? { rotate: [0, 2.5, -1.5, 0] } : undefined}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.path
          d={WAVE_A}
          fill="url(#lg-sheet)"
          animate={live ? { d: [WAVE_A, WAVE_B, WAVE_A] } : undefined}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path d="M15.5 47.5 H44.5" stroke="#d9a7bd" strokeWidth="1.2" strokeDasharray="1.6 2.2" strokeLinecap="round" />
      </motion.g>
      {/* front face + core */}
      <ellipse cx="14" cy="26" rx="6" ry="14" fill="#fff" stroke="url(#lg-glow)" strokeWidth="1.6" />
      <motion.ellipse
        cx="14"
        cy="26"
        rx="2.6"
        ry="6"
        fill="url(#lg-glow)"
        animate={live ? { ry: [6, 6.6, 6] } : undefined}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      {/* heart sparkle */}
      <motion.path
        d="M52 6.5c-1-1.8-3.6-1.2-3.6.8 0 1.6 2.2 2.9 3.6 4 1.4-1.1 3.6-2.4 3.6-4 0-2-2.6-2.6-3.6-.8z"
        fill="#ff6fae"
        animate={live ? { scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] } : undefined}
        style={{ originX: '52px', originY: '8px' }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </svg>
  )
}
