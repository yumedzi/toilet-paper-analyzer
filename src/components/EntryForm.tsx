import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useT } from '../i18n'
import { haptic } from '../haptic'
import { BENCHMARKS } from '../data/benchmarks'
import type { Pack } from '../model/score'
import { Stepper } from './Stepper'

const SIZES: { w: number; h: number; tag: string }[] = [
  { w: 9.8, h: 12, tag: 'std' },
  { w: 9.8, h: 12.5, tag: 'classic' },
  { w: 9.5, h: 11, tag: 'compact' },
  { w: 10, h: 10, tag: '□' },
  { w: 10, h: 13.5, tag: 'XL' },
]
// dm packs first, then a few EU shelf classics
const PICK = [
  'Sanft&Sicher Classic 3-ply 10×220',
  'Sanft&Sicher Recycling 3-ply 8×220',
  'Sanft&Sicher Limited 3-ply 8×180',
  'Sanft&Sicher Premium 4-ply 10×200',
  'Sanft&Sicher Balsam 4-ply 8×150',
  'Sanft&Sicher Deluxe 5-ply 8×130',
  'Zewa Ultra Smart 4-ply 4×300',
  'Kokett 3-ply 10×220',
  'Floralys Extrasoft 3-ply 10×200',
  'Zewa bewährt 3-ply 8×150',
]
const TEMPLATES = PICK.map((n) => BENCHMARKS.find((b) => b.name === n)!).filter(Boolean)

interface Props {
  draft: Pack
  set: (patch: Partial<Pack>) => void
  priceRef: React.Ref<HTMLInputElement>
}

export function EntryForm({ draft, set, priceRef }: Props) {
  const { t } = useT()
  const [mode, setMode] = useState<'sheets' | 'meters'>('sheets')
  const [open, setOpen] = useState(false)
  const meters = Math.round(((draft.sheetsPerRoll * draft.sheetH) / 100) * 10) / 10

  return (
    <div className="form">
      <div className="templates">
        <span className="templates__label">{t.templates}</span>
        <div className="chips chips--scroll">
          {TEMPLATES.map((b) => (
            <button
              key={b.name}
              type="button"
              className="chip chip--tpl"
              onClick={() => {
                haptic(10)
                set({ name: b.name, rolls: b.rolls, sheetsPerRoll: b.sheetsPerRoll, ply: b.ply, price: b.priceEur })
              }}
            >
              <b>{b.brand}</b> {b.ply}× · {b.rolls}×{b.sheetsPerRoll}
              <small>{b.shop}</small>
            </button>
          ))}
        </div>
      </div>

      <Stepper
        id="price"
        big
        label={t.price}
        value={draft.price}
        onChange={(price) => set({ price })}
        step={0.1}
        digits={2}
        max={200}
        unit="€"
        inputRef={priceRef}
      />

      <div className="field">
        <span className="field__label">{t.ply}</span>
        <div className="seg seg--ply" role="radiogroup" aria-label={t.ply}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={draft.ply === n}
              className={`seg__opt ${draft.ply === n ? 'seg__opt--on' : ''}`}
              onClick={() => {
                set({ ply: n })
                haptic(8)
              }}
            >
              {draft.ply === n && <motion.span layoutId="ply-pill" className="seg__pill" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
              <span className="ply-icon" aria-hidden>
                {Array.from({ length: n }, (_, i) => (
                  <i key={i} />
                ))}
              </span>
              <span className="seg__txt">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <Stepper
        id="rolls"
        label={t.rolls}
        value={draft.rolls}
        onChange={(rolls) => set({ rolls })}
        step={1}
        min={1}
        max={96}
        presets={[4, 6, 8, 9, 10, 12, 16, 20, 24, 32]}
      />

      <div className="field">
        <div className="field__row">
          <span className="field__label">{mode === 'sheets' ? t.sheets : t.length}</span>
          <div className="seg seg--mini">
            {(['sheets', 'meters'] as const).map((m) => (
              <button key={m} type="button" className={`seg__opt ${mode === m ? 'seg__opt--on' : ''}`} onClick={() => setMode(m)}>
                {mode === m && <motion.span layoutId="mode-pill" className="seg__pill" />}
                <span className="seg__txt">{m === 'sheets' ? t.modeSheets : t.modeMeters}</span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} initial={{ opacity: 0, x: mode === 'sheets' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {mode === 'sheets' ? (
              <Stepper
                id="sheets"
                label={<span className="sr-only">{t.sheets}</span>}
                value={draft.sheetsPerRoll}
                onChange={(sheetsPerRoll) => set({ sheetsPerRoll })}
                step={10}
                min={10}
                max={2000}
                presets={[130, 150, 160, 180, 200, 220, 250, 300]}
              />
            ) : (
              <Stepper
                id="meters"
                label={<span className="sr-only">{t.length}</span>}
                value={meters}
                onChange={(m) => set({ sheetsPerRoll: Math.max(1, Math.round((m * 100) / draft.sheetH)) })}
                step={1}
                digits={1}
                min={1}
                max={300}
                unit="m"
                presets={[15, 18, 20, 25, 30, 40]}
                presetLabel={(v) => `${v} m`}
              />
            )}
          </motion.div>
        </AnimatePresence>
        <p className="field__hint">
          ≈ {mode === 'sheets' ? `${meters} m` : `${draft.sheetsPerRoll} ${t.modeSheets.toLowerCase()}`} / {t.rollWord} · {Math.round((draft.rolls * draft.sheetsPerRoll * draft.sheetH) / 100)} m {t.totalLen}
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="name">
          {t.name}
        </label>
        <input id="name" className="text" value={draft.name} placeholder={t.namePh} onChange={(e) => set({ name: e.target.value })} autoComplete="off" enterKeyHint="done" />
      </div>

      <button type="button" className={`disclosure ${open ? 'disclosure--open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open}>
        {t.details}
        <span className="disclosure__meta">
          {draft.sheetW}×{draft.sheetH} cm · {t.softLabels[draft.softness - 1]}
          {draft.recycled ? ' · ♻' : ''}
        </span>
        <svg viewBox="0 0 24 24" className="disclosure__chev"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}>
            <div className="details__inner">
              <div className="field">
                <span className="field__label">{t.sheetSize}</span>
                <div className="chips">
                  {SIZES.map((s) => (
                    <button
                      type="button"
                      key={s.tag}
                      className={`chip ${s.w === draft.sheetW && s.h === draft.sheetH ? 'chip--on' : ''}`}
                      onClick={() => set({ sheetW: s.w, sheetH: s.h })}
                    >
                      <span className="sheet-icon" style={{ width: s.w * 1.6, height: s.h * 1.6 }} />
                      {s.w}×{s.h}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid2">
                <Stepper id="w" label={t.width} value={draft.sheetW} onChange={(sheetW) => set({ sheetW })} step={0.1} digits={1} min={5} max={20} unit="cm" />
                <Stepper id="h" label={t.heightL} value={draft.sheetH} onChange={(sheetH) => set({ sheetH })} step={0.1} digits={1} min={5} max={20} unit="cm" />
              </div>
              <div className="field">
                <span className="field__label">
                  {t.softness}: <b>{t.softLabels[draft.softness - 1]}</b>
                </span>
                <div className="seg">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" className={`seg__opt ${draft.softness === n ? 'seg__opt--on' : ''}`} onClick={() => set({ softness: n })} aria-label={t.softLabels[n - 1]}>
                      {draft.softness === n && <motion.span layoutId="soft-pill" className="seg__pill" />}
                      <span className="seg__txt">{['🪨', '🧱', '🧻', '🪶', '☁️'][n - 1]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={draft.recycled} onChange={(e) => set({ recycled: e.target.checked })} />
                <span className="switch__track"><span className="switch__thumb" /></span>
                ♻ {t.recycled}
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
