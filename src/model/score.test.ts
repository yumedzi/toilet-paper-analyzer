import { describe, expect, test } from 'vitest'
import { BENCHMARKS } from '../data/benchmarks'
import { evaluate, roundHalf, STD_SHEET, MEDIAN_WPE } from './score'

const base = { rolls: 8, sheetsPerRoll: 150, ply: 3, sheetW: STD_SHEET.w, sheetH: STD_SHEET.h, price: 3, softness: 3, recycled: false }

describe('value model', () => {
  test('stars are half steps within 0.5..5', () => {
    for (const x of [-3, 0, 0.74, 0.76, 2.24, 2.26, 9]) {
      const r = roundHalf(x)
      expect(r * 2).toBe(Math.round(r * 2))
      expect(r).toBeGreaterThanOrEqual(0.5)
      expect(r).toBeLessThanOrEqual(5)
    }
  })
  test('cheaper never rates lower', () => {
    let prev = 0
    for (const price of [9, 7, 5, 4, 3, 2.5, 2, 1.5, 1]) {
      const m = evaluate({ ...base, price })
      expect(m.stars).toBeGreaterThanOrEqual(prev)
      prev = m.stars
    }
  })
  test('more sheets ⇒ more wipes per euro', () => {
    expect(evaluate({ ...base, sheetsPerRoll: 200 }).wipesPerEur).toBeGreaterThan(evaluate(base).wipesPerEur)
  })
  test('ply adds value but sub-linearly', () => {
    const two = evaluate({ ...base, ply: 2 }).wipesPerEur
    const four = evaluate({ ...base, ply: 4 }).wipesPerEur
    expect(four).toBeGreaterThan(two)
    expect(four).toBeLessThan(two * 2)
  })
  test('typical shelf pack is about 3 stars', () => {
    const typical = evaluate({ ...base, sheetsPerRoll: 200, rolls: 10, price: 3.75 })
    expect(typical.vsTypical).toBeGreaterThan(0.85)
    expect(typical.stars).toBeGreaterThanOrEqual(2.5)
    expect(typical.stars).toBeLessThanOrEqual(3.5)
    expect(MEDIAN_WPE).toBeGreaterThan(0)
  })
  test('benchmarks span the scale', () => {
    const stars = BENCHMARKS.map((b) => evaluate({ ...b, sheetW: STD_SHEET.w, sheetH: STD_SHEET.h, price: b.priceEur, softness: 3 }).stars)
    expect(Math.min(...stars)).toBeLessThanOrEqual(1.5)
    expect(Math.max(...stars)).toBeGreaterThanOrEqual(4)
  })
  test('zero price is safe', () => {
    const m = evaluate({ ...base, price: 0 })
    expect(m.stars).toBe(0)
    expect(Number.isFinite(m.eurPerMeter)).toBe(true)
  })
})

import { advise } from './advice'
describe('advice', () => {
  const mk = (id: string, patch: Partial<typeof base> = {}) => ({ id, name: id, createdAt: 0, ...base, ...patch })
  test('pricier but better is called out against the leader', () => {
    const cheap = mk('cheap', { price: 3.49 })
    const big = mk('big', { price: 4.95, rolls: 16, sheetsPerRoll: 200, ply: 4 })
    const keys = advise(big, [cheap]).map((a) => a.key)
    expect(keys[0]).toBe('pricierButBetter')
    expect(keys).not.toContain('bestSoFar')
  })
  test('thin ply is flagged', () => {
    expect(advise(mk('x', { ply: 2 }), []).map((a) => a.key)).toContain('thinPly')
  })
})
