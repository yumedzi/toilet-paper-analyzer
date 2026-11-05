import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useT, fmt, fmtEur } from '../i18n'
import { evaluate, type Pack } from '../model/score'
import { advise } from '../model/advice'
import { Stars } from './Stars'
import { AdviceList } from './ResultCard'
import { haptic } from '../haptic'

interface Props {
  packs: Pack[]
  onEdit: (p: Pack) => void
  onDuplicate: (p: Pack) => void
  onRemove: (p: Pack) => void
  onClear: () => void
}

export function CompareList({ packs, onEdit, onDuplicate, onRemove, onClear }: Props) {
  const { t } = useT()
  const [openId, setOpenId] = useState<string | null>(null)
  const ranked = packs
    .map((p) => ({ p, m: evaluate(p) }))
    .sort((a, b) => b.m.wipesPerEur - a.m.wipesPerEur)
  const best = ranked[0]?.m.wipesPerEur || 1

  if (!ranked.length)
    return (
      <motion.div className="card empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="empty__rolls" aria-hidden>
          <span>🧻</span>
          <span>🧻</span>
          <span>🧻</span>
        </div>
        <p>{t.compareEmpty}</p>
      </motion.div>
    )

  return (
    <div className="compare">
      <ol className="rank">
        <AnimatePresence initial={false}>
          {ranked.map(({ p, m }, i) => {
            const open = openId === p.id
            return (
              <motion.li
                layout
                key={p.id}
                className={`card rank__item ${i === 0 && ranked.length > 1 ? 'rank__item--win' : ''}`}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -300, transition: { duration: 0.25 } }}
                transition={{ type: 'spring', stiffness: 360, damping: 32, delay: i * 0.03 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0.6, right: 0.1 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -110) {
                    haptic([10, 30, 10])
                    onRemove(p)
                  }
                }}
              >
                <button type="button" className="rank__head" onClick={() => setOpenId(open ? null : p.id)} aria-expanded={open}>
                  <span className="rank__pos">{i === 0 && ranked.length > 1 ? '👑' : i + 1}</span>
                  <span className="rank__main">
                    <span className="rank__name">{p.name}</span>
                    <span className="rank__sub">
                      {fmtEur(t, p.price)} · {p.rolls}×{p.sheetsPerRoll} · {t.plyN({ n: p.ply })}
                    </span>
                    <span className="bar">
                      <motion.span className="bar__fill" initial={{ width: 0 }} animate={{ width: `${(m.wipesPerEur / best) * 100}%` }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }} />
                    </span>
                  </span>
                  <span className="rank__score">
                    <b className="tabular">{fmt(t, m.wipesPerEur, 0)}</b>
                    <small>{t.headline}</small>
                    <Stars value={m.stars} size={13} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div className="rank__more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="rank__moreInner">
                        <AdviceList items={advise(p, packs, m, 3)} />
                        <div className="actions">
                          <button type="button" className="btn btn--ghost" onClick={() => onEdit(p)}>✎ {t.edit}</button>
                          <button type="button" className="btn btn--ghost" onClick={() => onDuplicate(p)}>⧉ {t.duplicate}</button>
                          <button type="button" className="btn btn--danger" onClick={() => onRemove(p)}>✕ {t.remove}</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ol>
      <button type="button" className="btn btn--link" onClick={() => confirm(t.confirmClear) && onClear()}>
        {t.clearAll}
      </button>
    </div>
  )
}
