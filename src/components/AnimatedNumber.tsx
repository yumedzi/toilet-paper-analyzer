import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/** Counts smoothly from the previous value to the new one. */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) {
      setShown(value)
      from.current = value
      return
    }
    const c = animate(from.current, value, {
      duration: 0.7,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => {
        from.current = v
        setShown(v)
      },
    })
    return () => c.stop()
  }, [value, reduce])
  return <span className="tabular">{format(shown)}</span>
}
