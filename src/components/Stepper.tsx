import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAnimate } from 'motion/react'
import { useT, fmt } from '../i18n'
import { haptic } from '../haptic'

interface Props {
  label: ReactNode
  value: number
  onChange: (v: number) => void
  step: number
  min?: number
  max?: number
  digits?: number
  unit?: string
  presets?: number[]
  presetLabel?: (v: number) => string
  big?: boolean
  inputRef?: React.Ref<HTMLInputElement>
  id: string
}

const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d

/** Number field with +/− (long-press accelerates), tap-to-type and preset chips. */
export function Stepper({ label, value, onChange, step, min = 0, max = 1e6, digits = 0, unit, presets, presetLabel, big, inputRef, id }: Props) {
  const { t } = useT()
  const [text, setText] = useState<string | null>(null)
  const valueRef = useRef(value)
  valueRef.current = value
  const timer = useRef<number | undefined>(undefined)
  const started = useRef(0)
  const typed = useRef(false)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const first = useRef(true)

  // external change (buttons, presets, templates) → drop any half-typed text and pop the value
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (typed.current) {
      typed.current = false
      return
    }
    setText(null)
    if (scope.current) animate(scope.current, { scale: [1.07, 1] }, { type: 'spring', stiffness: 500, damping: 22 })
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const clamp = (v: number) => Math.min(max, Math.max(min, round(v, digits)))
  const bump = (dir: 1 | -1, mult = 1) => {
    const next = clamp(valueRef.current + dir * step * mult)
    if (next !== valueRef.current) {
      valueRef.current = next
      onChange(next)
      haptic(6)
    }
  }
  const stop = () => {
    window.clearTimeout(timer.current)
    timer.current = undefined
  }
  const start = (dir: 1 | -1) => (e: React.PointerEvent) => {
    e.preventDefault()
    bump(dir)
    started.current = Date.now()
    const loop = (delay: number) => {
      timer.current = window.setTimeout(() => {
        const held = Date.now() - started.current
        bump(dir, held > 2000 ? 10 : held > 1100 ? 5 : 1)
        loop(Math.max(45, delay * 0.82))
      }, delay)
    }
    loop(380)
  }
  useEffect(() => stop, [])

  const parse = (raw: string) => {
    const m = raw.match(/\d+(?:[.,]\d*)?/)
    return m ? parseFloat(m[0].replace(',', '.')) : NaN
  }
  const onType = (raw: string) => {
    setText(raw)
    const n = parse(raw)
    if (Number.isFinite(n) && clamp(n) !== valueRef.current) {
      typed.current = true
      onChange(clamp(n)) // live result while typing
    }
  }

  const shown = text ?? (value === 0 && min === 0 ? '' : digits ? fmt(t, value, digits) : String(value))

  return (
    <div className={`field ${big ? 'field--big' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__btn"
          aria-label="−"
          disabled={value <= min}
          onPointerDown={start(-1)}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onContextMenu={(e) => e.preventDefault()}
        >
          <svg viewBox="0 0 24 24"><path d="M5 12h14" /></svg>
        </button>
        <div className="stepper__value" ref={scope}>
          <input
            ref={inputRef}
            id={id}
            className="stepper__input"
            inputMode={digits ? 'decimal' : 'numeric'}
            enterKeyHint="done"
            autoComplete="off"
            value={shown}
            placeholder={digits ? fmt(t, 0, digits) : '0'}
            onFocus={(e) => {
              const el = e.currentTarget
              requestAnimationFrame(() => el.select())
            }}
            onChange={(e) => onType(e.target.value)}
            onBlur={() => setText(null)}
            onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
          />
          {unit && <span className="stepper__unit">{unit}</span>}
        </div>
        <button
          type="button"
          className="stepper__btn"
          aria-label="+"
          disabled={value >= max}
          onPointerDown={start(1)}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onContextMenu={(e) => e.preventDefault()}
        >
          <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5v14" /></svg>
        </button>
      </div>
      {presets && (
        <div className="chips" role="group">
          {presets.map((p) => (
            <button
              type="button"
              key={p}
              className={`chip ${round(p, digits) === round(value, digits) ? 'chip--on' : ''}`}
              onClick={() => {
                onChange(p)
                haptic(8)
              }}
            >
              {presetLabel ? presetLabel(p) : p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
