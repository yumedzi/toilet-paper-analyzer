import { BENCHMARKS } from '../data/benchmarks'

export interface Pack {
  id: string
  name: string
  rolls: number
  sheetsPerRoll: number
  ply: number
  /** sheet width across the roll, cm */
  sheetW: number
  /** sheet length along the roll, cm */
  sheetH: number
  price: number
  /** 1 (sandpaper) … 5 (cloud) */
  softness: number
  recycled: boolean
  createdAt: number
}

/** Typical EU sheet when the pack doesn't say (shops rarely print it). */
export const STD_SHEET = { w: 9.8, h: 12 }

/**
 * How much "wiping power" one sheet of N plies delivers relative to 1-ply.
 * Sub-linear: thicker sheets mean fewer sheets per visit, but not proportionally fewer
 * (consumer tests find comfort plateaus around 3–4 ply).
 */
export const PLY_FACTOR = [0, 1, 1.8, 2.5, 3.0, 3.4, 3.7]
export const plyFactor = (ply: number) => PLY_FACTOR[Math.max(1, Math.min(6, Math.round(ply)))]

/** One standard wipe = 4 sheets of standard 2-ply (~8 sheets/visit ≈ 2 wipes). */
const WIPE_UNIT = 4 * STD_SHEET.w * STD_SHEET.h * PLY_FACTOR[2]

export interface Metrics {
  totalSheets: number
  totalMeters: number
  areaM2: number
  wipes: number
  /** headline metric */
  wipesPerEur: number
  eurPer100Sheets: number
  eurPerRoll: number
  eurPerMeter: number
  metersPerEur: number
  quality: number // 0..1
  valueStars: number // unrounded 0..5+
  stars: number // 0.5..5 in 0.5 steps
  vsTypical: number // ratio of wipesPerEur to benchmark median
}

type PackLike = Pick<Pack, 'rolls' | 'sheetsPerRoll' | 'ply' | 'sheetW' | 'sheetH' | 'price'> &
  Partial<Pick<Pack, 'softness' | 'recycled'>>

export function rawWipesPerEur(p: PackLike): number {
  const sheets = p.rolls * p.sheetsPerRoll
  const wipes = (sheets * p.sheetW * p.sheetH * plyFactor(p.ply)) / WIPE_UNIT
  return p.price > 0 ? wipes / p.price : 0
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export const BENCH_WPE = BENCHMARKS.map((b) =>
  rawWipesPerEur({ ...b, sheetW: STD_SHEET.w, sheetH: STD_SHEET.h, price: b.priceEur }),
)
export const MEDIAN_WPE = median(BENCH_WPE)

const PLY_QUALITY = [0, 0.1, 0.45, 0.75, 0.92, 1, 1]
const clamp = (x: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x))

export function quality(p: PackLike): number {
  const plyQ = PLY_QUALITY[Math.max(1, Math.min(6, Math.round(p.ply)))]
  const sizeQ = clamp((p.sheetW * p.sheetH - 90) / (135 - 90))
  const softQ = clamp(((p.softness ?? 3) - 1) / 4)
  const q = 0.55 * plyQ + 0.15 * sizeQ + 0.3 * softQ - (p.recycled ? 0.08 : 0)
  return clamp(q)
}

export const roundHalf = (x: number) => clamp(Math.round(x * 2) / 2, 0.5, 5)

export function evaluate(p: PackLike): Metrics {
  const totalSheets = p.rolls * p.sheetsPerRoll
  const totalMeters = (totalSheets * p.sheetH) / 100
  const areaM2 = (totalSheets * p.sheetW * p.sheetH) / 10_000
  const wipesPerEur = rawWipesPerEur(p)
  const wipes = wipesPerEur * p.price
  const q = quality(p)
  const vsTypical = MEDIAN_WPE ? wipesPerEur / MEDIAN_WPE : 1
  // value: median → 3★, ~1.5× median → 5★, ~⅔ median → 1★ (EU shelves are tightly bunched)
  const valueStars = wipesPerEur > 0 ? clamp(3 + 3.5 * Math.log2(vsTypical), 0, 5.5) : 0
  const qualityStars = 1 + 4 * q
  const blended = 0.7 * valueStars + 0.3 * qualityStars
  const safe = (n: number) => (Number.isFinite(n) ? n : 0)
  return {
    totalSheets,
    totalMeters,
    areaM2,
    wipes,
    wipesPerEur,
    eurPer100Sheets: totalSheets ? safe((p.price / totalSheets) * 100) : 0,
    eurPerRoll: p.rolls ? p.price / p.rolls : 0,
    eurPerMeter: totalMeters ? p.price / totalMeters : 0,
    metersPerEur: p.price ? totalMeters / p.price : 0,
    quality: q,
    valueStars,
    stars: wipesPerEur > 0 ? roundHalf(blended) : 0,
    vsTypical,
  }
}
