import { createContext, useContext } from 'react'
import type { AdviceKey } from './model/advice'

export type Lang = 'en' | 'uk'
type P = Record<string, string | number>
type Fn = (p: P) => string

const ukPlural = (n: number, one: string, few: string, many: string) => {
  const r = new Intl.PluralRules('uk').select(n)
  return r === 'one' ? one : r === 'few' ? few : many
}

const en = {
  locale: 'en-IE',
  tagline: 'Wipe smarter. Pay less.',
  loading: 'Unrolling the deals…',
  tabCheck: 'Check',
  tabCompare: 'Compare',
  price: 'Pack price',
  rolls: 'Rolls',
  sheets: 'Sheets / roll',
  length: 'Length / roll',
  ply: 'Ply',
  plyN: (p: P) => `${p.n}-ply`,
  name: 'Name',
  namePh: 'e.g. Kokett 3-ply',
  details: 'Sheet size & feel',
  sheetSize: 'Sheet size',
  width: 'Width',
  heightL: 'Length',
  softness: 'Softness',
  softLabels: ['Sandpaper', 'Rough', 'Fine', 'Soft', 'Cloud'],
  recycled: 'Recycled paper',
  modeSheets: 'Sheets',
  modeMeters: 'Metres',
  templates: 'Start from a shelf classic',
  headline: 'wipes per €',
  headlineHint: '1 wipe ≈ 4 standard 2-ply sheets',
  perSheet: '€ / 100 sheets',
  perRoll: '€ / roll',
  perMeter: '€ / m',
  totalLen: 'total',
  rollWord: 'roll',
  vsTypical: (p: P) => `${p.sign}${p.pct}% vs typical EU shelf`,
  save: 'Save & add another',
  update: 'Update pack',
  cancelEdit: 'Cancel',
  saved: (p: P) => `Saved “${p.name}”. Next roll, please!`,
  enterPrice: 'Enter the price to get a score',
  compareEmpty: 'No packs yet. Check one and tap “Save” — then the next one, and we will crown a winner.',
  clearAll: 'Clear all',
  confirmClear: 'Remove all saved packs?',
  edit: 'Edit',
  duplicate: 'Duplicate',
  remove: 'Remove',
  undo: 'Undo',
  removed: 'Pack removed',
  winner: 'Best value',
  packN: (p: P) => `Pack #${p.n}`,
  footer: 'Made with love for everyone who has ever stared at a wall of toilet paper. Prices: EU shops 2025–26.',
  method: 'How the score works',
  methodBody:
    'We turn every pack into standard “wipes”: total sheet area × a ply factor (1-ply 1.0 · 2-ply 1.8 · 3-ply 2.5 · 4-ply 3.0 · 5-ply 3.4). More plies help, but you also use fewer sheets, so the bonus shrinks. Wipes ÷ price gives the headline number. Stars mix 70% value (compared with ~20 regular packs from Lidl, ALDI, Albert Heijn, Mercadona, Biedronka…) and 30% comfort (ply, sheet size, softness).',
  verdicts: ['Not worth it', 'Overpriced', 'Meh', 'Fair deal', 'Great buy', 'Legendary roll'],
  advice: {
    bestSoFar: (p) => (p.pct ? `Best deal so far — ${p.pct}% more paper per € than “${p.name}”. 🏆` : `Ties with “${p.name}” for best deal. 🤝`),
    behindBest: (p) => `“${p.name}” still wins: ${p.pct}% more paper per €.`,
    pricierButBetter: (p) => `${p.dp}% pricier than “${p.name}” at the till — BUT ${p.dv}% more paper per €. Worth it.`,
    cheaperButWorse: (p) => `Cheaper than “${p.name}” on the tag, but you get ${p.dv}% less paper per €. A false bargain.`,
    comfierSameValue: (p) => `“${p.name}” is ${p.ply}-ply for almost the same value — a comfier upgrade.`,
    greatDeal: (p) => `${p.pct}% more paper per € than a typical EU shelf. Stock up!`,
    aboveAvg: (p) => `Better than typical: +${p.pct}% paper per €.`,
    average: () => 'Right on the European average. Fine, not fancy.',
    belowAvg: (p) => `${p.pct}% less paper per € than typical. Look around the shelf.`,
    thinPly: (p) => `Only ${p.ply}-ply: you'll use about ${p.pct}% more sheets than with 3-ply.`,
    luxPly: (p) => `${p.ply}-ply luxury. Your bottom says thank you.`,
    smallSheets: (p) => `Small sheets (${p.w}×${p.h} cm): watch out for shrinkflation.`,
    longRoll: () => 'Long rolls: fewer roll changes and less cardboard.',
    recycled: () => 'Recycled fibre. Kind to the planet, and tests say it can still be soft.',
    bulk: (p) => `${p.rolls} rolls: great unit price, but make sure you have the storage. 📦`,
  } satisfies Record<AdviceKey, Fn>,
}

export type Dict = typeof en

const uk: Dict = {
  locale: 'uk-UA',
  tagline: 'Витирай розумніше. Плати менше.',
  loading: 'Розмотуємо знижки…',
  tabCheck: 'Оцінка',
  tabCompare: 'Порівняння',
  price: 'Ціна пачки',
  rolls: 'Рулони',
  sheets: 'Аркуші / рулон',
  length: 'Довжина / рулон',
  ply: 'Шари',
  plyN: (p) => `${p.n}-шар.`,
  name: 'Назва',
  namePh: 'напр. Kokett 3 шари',
  details: 'Розмір аркуша і відчуття',
  sheetSize: 'Розмір аркуша',
  width: 'Ширина',
  heightL: 'Довжина',
  softness: "М'якість",
  softLabels: ['Наждак', 'Грубий', 'Норм', "М'який", 'Хмаринка'],
  recycled: 'Перероблений папір',
  modeSheets: 'Аркуші',
  modeMeters: 'Метри',
  templates: 'Почати з популярної пачки',
  headline: 'витирань за €',
  headlineHint: '1 витирання ≈ 4 стандартні 2-шарові аркуші',
  perSheet: '€ / 100 арк.',
  perRoll: '€ / рулон',
  perMeter: '€ / м',
  totalLen: 'разом',
  rollWord: 'рулон',
  vsTypical: (p) => `${p.sign}${p.pct}% від типової полиці ЄС`,
  save: 'Зберегти і додати ще',
  update: 'Оновити пачку',
  cancelEdit: 'Скасувати',
  saved: (p) => `«${p.name}» збережено. Давай наступний рулон!`,
  enterPrice: 'Введи ціну, щоб отримати оцінку',
  compareEmpty: 'Поки порожньо. Оціни пачку і натисни «Зберегти», потім наступну, і ми коронуємо переможця.',
  clearAll: 'Очистити все',
  confirmClear: 'Видалити всі збережені пачки?',
  edit: 'Змінити',
  duplicate: 'Дублювати',
  remove: 'Видалити',
  undo: 'Повернути',
  removed: 'Пачку видалено',
  winner: 'Найвигідніше',
  packN: (p) => `Пачка №${p.n}`,
  footer: 'Зроблено з любовʼю для всіх, хто колись завис перед стіною туалетного паперу. Ціни: магазини ЄС 2025–26.',
  method: 'Як рахується оцінка',
  methodBody:
    'Кожну пачку переводимо у стандартні «витирання»: загальна площа аркушів × коефіцієнт шарів (1 шар 1.0 · 2 — 1.8 · 3 — 2.5 · 4 — 3.0 · 5 — 3.4). Більше шарів — краще, але й аркушів іде менше, тож бонус спадає. Витирання ÷ ціна = головна цифра. Зірки: 70% вигода (порівняно з ~20 звичайними пачками з Lidl, ALDI, Albert Heijn, Mercadona, Biedronka…) і 30% комфорт (шари, розмір аркуша, мʼякість).',
  verdicts: ['Не варто', 'Задорого', 'Так собі', 'Чесна ціна', 'Чудова покупка', 'Легендарний рулон'],
  advice: {
    bestSoFar: (p) => (p.pct ? `Найкраща угода! На ${p.pct}% більше паперу за €, ніж «${p.name}». 🏆` : `Нарівні з «${p.name}» за вигідністю. 🤝`),
    behindBest: (p) => `«${p.name}» поки виграє: на ${p.pct}% більше паперу за €.`,
    pricierButBetter: (p) => `На ${p.dp}% дорожче за «${p.name}» на касі, АЛЕ на ${p.dv}% більше паперу за €. Варто того.`,
    cheaperButWorse: (p) => `Дешевше за «${p.name}» на цінику, але паперу за € на ${p.dv}% менше. Удавана економія.`,
    comfierSameValue: (p) => `«${p.name}» має ${p.ply} ${ukPlural(Number(p.ply), 'шар', 'шари', 'шарів')} майже за ту саму вигоду. Комфортніший апгрейд.`,
    greatDeal: (p) => `На ${p.pct}% більше паперу за €, ніж на типовій полиці ЄС. Бери із запасом!`,
    aboveAvg: (p) => `Краще за типове: +${p.pct}% паперу за €.`,
    average: () => 'Рівно середньоєвропейський рівень. Нормально, без вау.',
    belowAvg: (p) => `На ${p.pct}% менше паперу за €, ніж зазвичай. Поглянь на сусідні полиці.`,
    thinPly: (p) => `Лише ${p.ply} ${ukPlural(Number(p.ply), 'шар', 'шари', 'шарів')}: аркушів піде приблизно на ${p.pct}% більше, ніж із 3-шаровим.`,
    luxPly: (p) => `${p.ply} ${ukPlural(Number(p.ply), 'шар', 'шари', 'шарів')} розкоші. Ваша дупа дякує.`,
    smallSheets: (p) => `Маленькі аркуші (${p.w}×${p.h} см): обережно, шринкфляція.`,
    longRoll: () => 'Довгі рулони: рідше міняти, менше картону.',
    recycled: () => 'Перероблене волокно. Добре для планети, і тести кажуть, що він теж буває мʼяким.',
    bulk: (p) => `${p.rolls} ${ukPlural(Number(p.rolls), 'рулон', 'рулони', 'рулонів')}: вигідно за штуку, але чи є де зберігати? 📦`,
  },
}

export const DICTS: Record<Lang, Dict> = { en, uk }

export const LangCtx = createContext<{ t: Dict; lang: Lang; setLang: (l: Lang) => void }>({
  t: en,
  lang: 'en',
  setLang: () => {},
})
export const useT = () => useContext(LangCtx)

export const fmt = (t: Dict, n: number, digits = 2) =>
  new Intl.NumberFormat(t.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n)
export const fmtEur = (t: Dict, n: number) =>
  new Intl.NumberFormat(t.locale, { style: 'currency', currency: 'EUR', currencyDisplay: 'narrowSymbol' }).format(n)
