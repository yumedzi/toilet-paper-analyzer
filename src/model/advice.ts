import { evaluate, plyFactor, type Metrics, type Pack } from './score'

export type Tone = 'win' | 'good' | 'info' | 'warn'
export type AdviceKey =
  | 'bestSoFar'
  | 'behindBest'
  | 'pricierButBetter'
  | 'cheaperButWorse'
  | 'comfierSameValue'
  | 'greatDeal'
  | 'aboveAvg'
  | 'average'
  | 'belowAvg'
  | 'thinPly'
  | 'luxPly'
  | 'smallSheets'
  | 'longRoll'
  | 'recycled'
  | 'bulk'

export interface Advice {
  key: AdviceKey
  tone: Tone
  params: Record<string, string | number>
}

const pct = (r: number) => Math.round(Math.abs(r - 1) * 100)

/**
 * Rule-based shopping advice for `pack`, compared to the EU shelf median and to `others`
 * (the packs already saved in this shopping trip). Returned most-important first.
 */
export function advise(pack: Pack, others: Pack[], m: Metrics = evaluate(pack), limit = 4): Advice[] {
  const out: (Advice & { prio: number })[] = []
  const add = (prio: number, key: AdviceKey, tone: Tone, params: Advice['params'] = {}) =>
    out.push({ prio, key, tone, params })
  const rest = others.filter((o) => o.id !== pack.id && o.price > 0)
  const scored = rest.map((o) => ({ o, m: evaluate(o) }))

  if (scored.length) {
    const best = scored.reduce((a, b) => (b.m.wipesPerEur > a.m.wipesPerEur ? b : a))
    const vsBest = m.wipesPerEur / best.m.wipesPerEur
    const priceVsBest = pack.price / best.o.price
    // if the price-vs-value story against the leader is telling, it replaces the plain "best/behind" line
    const pairTold = (priceVsBest > 1.001 && vsBest > 1.05) || (priceVsBest < 0.999 && vsBest < 0.95)
    if (vsBest >= 1) {
      if (!pairTold) add(100, 'bestSoFar', 'win', { name: best.o.name, pct: pct(vsBest) })
    } else if (!pairTold) {
      add(90, 'behindBest', 'warn', { name: best.o.name, pct: pct(1 / vsBest) })
    }
    // the classic till dilemma: price on the tag vs. paper you actually get
    for (const { o, m: om } of scored) {
      const priceR = pack.price / o.price
      const valueR = m.wipesPerEur / om.wipesPerEur
      if (priceR > 1.001 && valueR > 1.05) {
        add(85 + Math.min(10, (valueR - 1) * 20) + (o === best.o ? 20 : 0), 'pricierButBetter', o === best.o ? 'win' : 'good', { name: o.name, dp: pct(priceR), dv: pct(valueR) })
      } else if (priceR < 0.999 && valueR < 0.95) {
        add(80 + Math.min(10, (1 - valueR) * 20) + (o === best.o ? 15 : 0), 'cheaperButWorse', 'warn', { name: o.name, dp: pct(priceR), dv: pct(valueR) })
      }
      if (o.ply > pack.ply && valueR < 1.1 && valueR > 0.9) {
        add(70, 'comfierSameValue', 'info', { name: o.name, ply: o.ply })
      }
    }
  }

  const r = m.vsTypical
  if (r >= 1.2) add(60, 'greatDeal', 'win', { pct: pct(r) })
  else if (r >= 1.05) add(50, 'aboveAvg', 'good', { pct: pct(r) })
  else if (r <= 0.85) add(65, 'belowAvg', 'warn', { pct: pct(r) })
  else add(30, 'average', 'info')

  if (pack.ply <= 2) add(75, 'thinPly', 'warn', { ply: pack.ply, pct: Math.round((plyFactor(3) / plyFactor(pack.ply) - 1) * 100) })
  if (pack.ply >= 4) add(40, 'luxPly', 'good', { ply: pack.ply })
  if (pack.sheetW * pack.sheetH < 105) add(55, 'smallSheets', 'warn', { w: pack.sheetW, h: pack.sheetH })
  if (pack.sheetsPerRoll >= 280) add(35, 'longRoll', 'good')
  if (pack.recycled) add(25, 'recycled', 'good')
  if (pack.rolls >= 20) add(20, 'bulk', 'info', { rolls: pack.rolls })

  // keep one pairwise line per tone family, then fill
  const seen = new Set<AdviceKey>()
  return out
    .sort((a, b) => b.prio - a.prio)
    .filter((a) => (seen.has(a.key) ? false : (seen.add(a.key), true)))
    .slice(0, limit)
    .map(({ prio: _p, ...a }) => a)
}
