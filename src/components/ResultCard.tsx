import { AnimatePresence, motion } from 'motion/react'
import { useT, fmt, fmtEur } from '../i18n'
import type { Metrics } from '../model/score'
import type { Advice } from '../model/advice'
import { AnimatedNumber } from './AnimatedNumber'
import { Stars } from './Stars'

export const verdictIndex = (stars: number) => Math.max(0, Math.min(5, Math.floor(stars)))

export function AdviceList({ items }: { items: Advice[] }) {
  const { t } = useT()
  return (
    <ul className="advice">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((a, i) => (
          <motion.li
            layout
            key={a.key}
            className={`advice__item advice__item--${a.tone}`}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 380, damping: 30 }}
          >
            <span className="advice__dot" aria-hidden />
            {t.advice[a.key](a.params)}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

export function ResultCard({ m, advice, hasPrice }: { m: Metrics; advice: Advice[]; hasPrice: boolean }) {
  const { t } = useT()
  const up = m.vsTypical >= 1
  return (
    <section className={`card result result--s${Math.floor(m.stars)}`}>
      <div className="result__glow" aria-hidden />
      {hasPrice ? (
        <>
          <div className="result__top">
            <div>
              <div className="result__big">
                <AnimatedNumber value={m.wipesPerEur} format={(n) => fmt(t, n, 0)} />
              </div>
              <div className="result__unit" title={t.headlineHint}>
                {t.headline}
              </div>
            </div>
            <div className="result__rating">
              <Stars value={m.stars} />
              <motion.div key={verdictIndex(m.stars)} className="result__verdict" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {t.verdicts[verdictIndex(m.stars)]} · {fmt(t, m.stars, 1)}
              </motion.div>
            </div>
          </div>
          <div className={`pill-vs ${up ? 'pill-vs--up' : 'pill-vs--down'}`}>
            {t.vsTypical({ sign: up ? '+' : '−', pct: Math.round(Math.abs(m.vsTypical - 1) * 100) })}
          </div>
          <div className="metrics">
            <div><b>{fmtEur(t, m.eurPer100Sheets)}</b><span>{t.perSheet}</span></div>
            <div><b>{fmtEur(t, m.eurPerRoll)}</b><span>{t.perRoll}</span></div>
            <div><b>{fmt(t, m.eurPerMeter * 100, 1)}¢</b><span>{t.perMeter}</span></div>
          </div>
          <AdviceList items={advice} />
        </>
      ) : (
        <p className="result__empty">{t.enterPrice}</p>
      )}
    </section>
  )
}

/** Slim bar that sticks to the top once the big card scrolls away. */
export function MiniResult({ m, show }: { m: Metrics; show: boolean }) {
  const { t } = useT()
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="mini" initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -70, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 34 }}>
          <b className="mini__num tabular">{fmt(t, m.wipesPerEur, 0)}</b>
          <span className="mini__unit">{t.headline}</span>
          <Stars value={m.stars} size={16} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
