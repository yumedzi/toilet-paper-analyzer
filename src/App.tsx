import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { DICTS, LangCtx, type Lang } from './i18n'
import { evaluate, STD_SHEET, type Pack } from './model/score'
import { advise } from './model/advice'
import { load, store, haptic } from './haptic'
import { Logo } from './components/Logo'
import { Splash } from './components/Splash'
import { EntryForm } from './components/EntryForm'
import { ResultCard, MiniResult } from './components/ResultCard'
import { CompareList } from './components/CompareList'
import { Confetti } from './components/Confetti'

const uid = () => Math.random().toString(36).slice(2, 10)
const freshDraft = (prev?: Partial<Pack>): Pack => ({
  id: uid(),
  name: '',
  rolls: 8,
  sheetsPerRoll: 150,
  ply: 3,
  sheetW: STD_SHEET.w,
  sheetH: STD_SHEET.h,
  price: 0,
  softness: 3,
  recycled: false,
  ...prev,
  createdAt: Date.now(),
})

type Tab = 'check' | 'compare'

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => load<Lang>('rc.lang', 'en'))
  const t = DICTS[lang]
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    store('rc.lang', l)
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState<Tab>('check')
  const [packs, setPacks] = useState<Pack[]>(() => load<Pack[]>('rc.packs', []))
  const [draft, setDraft] = useState<Pack>(() => load<Pack>('rc.draft', freshDraft()))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; undo?: () => void } | null>(null)
  const [burst, setBurst] = useState(0)
  const [showMini, setShowMini] = useState(false)
  const priceRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => store('rc.packs', packs), [packs])
  useEffect(() => store('rc.draft', draft), [draft])
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), toast.undo ? 4500 : 2600)
    return () => window.clearTimeout(id)
  }, [toast])

  const focusPrice = useCallback(() => {
    window.setTimeout(() => priceRef.current?.focus({ preventScroll: true }), 60)
  }, [])
  const endSplash = useCallback(() => {
    setSplash(false)
    focusPrice()
  }, [focusPrice])

  // mini sticky score once the big card leaves the viewport
  useEffect(() => {
    const el = cardRef.current
    if (!el || splash) return
    const io = new IntersectionObserver(([e]) => setShowMini(!e.isIntersecting), { threshold: 0, rootMargin: '-40px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [splash, tab])

  const set = useCallback((patch: Partial<Pack>) => setDraft((d) => ({ ...d, ...patch })), [])
  const metrics = useMemo(() => evaluate(draft), [draft])
  const others = useMemo(() => packs.filter((p) => p.id !== editingId), [packs, editingId])
  const advice = useMemo(() => advise(draft, others, metrics), [draft, others, metrics])
  const hasPrice = draft.price > 0

  const save = () => {
    if (!hasPrice) {
      priceRef.current?.focus()
      haptic([20, 40, 20])
      return
    }
    const name = draft.name.trim() || t.packN({ n: packs.length + 1 })
    const saved = { ...draft, name }
    const prevBest = Math.max(0, ...others.map((p) => evaluate(p).wipesPerEur))
    if (editingId) {
      setPacks((ps) => ps.map((p) => (p.id === editingId ? saved : p)))
      setEditingId(null)
    } else {
      setPacks((ps) => [...ps, saved])
    }
    if (metrics.wipesPerEur > prevBest || metrics.stars >= 4.5) setBurst((b) => b + 1)
    haptic([12, 40, 18])
    setToast({ msg: t.saved({ name }) })
    // smart defaults: keep the shape of the last pack, clear name, re-focus price
    const { id: _id, name: _name, createdAt: _c, ...keep } = saved
    setDraft(freshDraft({ ...keep, price: 0 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    focusPrice()
  }

  const edit = (p: Pack) => {
    setDraft({ ...p })
    setEditingId(p.id)
    setTab('check')
    focusPrice()
  }
  const remove = (p: Pack) => {
    const before = packs
    setPacks((ps) => ps.filter((x) => x.id !== p.id))
    if (editingId === p.id) setEditingId(null)
    setToast({ msg: t.removed, undo: () => setPacks(before) })
  }
  const duplicate = (p: Pack) => {
    setDraft({ ...p, id: uid(), name: `${p.name} ²`, createdAt: Date.now() })
    setEditingId(null)
    setTab('check')
    focusPrice()
  }

  return (
    <LangCtx.Provider value={{ t, lang, setLang }}>
      <div className="aurora" aria-hidden>
        <i /> <i /> <i />
      </div>
      <AnimatePresence>{splash && <Splash onDone={endSplash} />}</AnimatePresence>

      <div className="app">
        <header className="header">
          <div className="brand">
            <Logo size={42} />
            <div>
              <div className="brand__name">
                Roll<span>Call</span>
              </div>
              <div className="brand__tag">{t.tagline}</div>
            </div>
          </div>
          <div className="lang" role="group" aria-label="Language">
            {(['en', 'uk'] as Lang[]).map((l) => (
              <button key={l} type="button" className={`lang__opt ${lang === l ? 'lang__opt--on' : ''}`} onClick={() => setLang(l)}>
                {lang === l && <motion.span layoutId="lang-pill" className="lang__pill" />}
                <span>{l === 'en' ? 'EN' : 'UA'}</span>
              </button>
            ))}
          </div>
        </header>

        {tab === 'check' && <MiniResult m={metrics} show={showMini && hasPrice} />}

        <AnimatePresence mode="wait" initial={false}>
          {tab === 'check' ? (
            <motion.main key="check" className="main" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <div ref={cardRef}>
                <ResultCard m={metrics} advice={advice} hasPrice={hasPrice} />
              </div>
              <section className="card">
                <EntryForm draft={draft} set={set} priceRef={priceRef} />
              </section>
              <details className="card method">
                <summary>{t.method}</summary>
                <p>{t.methodBody}</p>
              </details>
              <footer className="footer">{t.footer}</footer>
            </motion.main>
          ) : (
            <motion.main key="compare" className="main" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.22 }}>
              <CompareList packs={packs} onEdit={edit} onDuplicate={duplicate} onRemove={remove} onClear={() => setPacks([])} />
            </motion.main>
          )}
        </AnimatePresence>

        <div className="dock">
          <AnimatePresence>
            {tab === 'check' && (
              <motion.div className="dock__cta" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      setEditingId(null)
                      setDraft(freshDraft())
                    }}
                  >
                    {t.cancelEdit}
                  </button>
                )}
                <motion.button type="button" className={`btn btn--primary ${hasPrice ? '' : 'btn--idle'}`} whileTap={{ scale: 0.96 }} onClick={save}>
                  <span className="btn__shine" aria-hidden />
                  {editingId ? t.update : t.save}
                  <Confetti trigger={burst} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <nav className="tabs">
            {(['check', 'compare'] as Tab[]).map((k) => (
              <button key={k} type="button" className={`tabs__opt ${tab === k ? 'tabs__opt--on' : ''}`} onClick={() => setTab(k)}>
                {tab === k && <motion.span layoutId="tab-pill" className="tabs__pill" transition={{ type: 'spring', stiffness: 480, damping: 36 }} />}
                <span className="tabs__label">
                  {k === 'check' ? '✦ ' + t.tabCheck : '⚖ ' + t.tabCompare}
                  {k === 'compare' && packs.length > 0 && (
                    <motion.b key={packs.length} className="tabs__badge" initial={{ scale: 0.3 }} animate={{ scale: 1 }}>
                      {packs.length}
                    </motion.b>
                  )}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div className="toast" role="status" initial={{ y: 40, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }}>
              {toast.msg}
              {toast.undo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.undo?.()
                    setToast(null)
                  }}
                >
                  {t.undo}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LangCtx.Provider>
  )
}
