import { motion } from 'motion/react'
import { useId } from 'react'

const STAR = 'M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z'

/** Five stars, filled in half steps, popping in one after another. */
export function Stars({ value, size = 22 }: { value: number; size?: number }) {
  const uid = useId()
  return (
    <div className="stars" role="img" aria-label={`${value} / 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <motion.svg
            key={`${i}-${fill}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 420, damping: 16 }}
          >
            <defs>
              <linearGradient id={`${uid}-${i}`}>
                <stop offset={fill} stopColor="var(--star)" />
                <stop offset={fill} stopColor="var(--star-off)" />
              </linearGradient>
            </defs>
            <path d={STAR} fill={`url(#${uid}-${i})`} stroke="var(--star-edge)" strokeWidth="0.8" strokeLinejoin="round" />
          </motion.svg>
        )
      })}
    </div>
  )
}
