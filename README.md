# 🧻 RollCall: toilet paper value per euro

A mobile-first web app for the supermarket aisle. Enter a pack's price, rolls, sheets per roll and ply, and you get:

- **Wipes per €**, the headline value metric
- a **5-star rating** in half steps
- **honest advice**, e.g. *"42% pricier than Pack #1 at the till, BUT 126% more paper per €. Worth it."*
- a **compare** view that ranks every pack you've checked and crowns the winner

It is available in English and Ukrainian (EN / UA) and keeps saved packs in your browser (localStorage).

## The model

Every pack is converted into standard **wipes**:

```
wipes = rolls × sheets/roll × sheet area × plyFactor(ply) / wipeUnit
wipeUnit = 4 sheets of standard 2-ply (9.8 × 12 cm)
plyFactor = 1.0 · 1.8 · 2.5 · 3.0 · 3.4   (1–5 ply)
```

Ply factors are **sub-linear**. Thicker sheets mean fewer sheets per visit, but not proportionally fewer. Stiftung Warentest found comfort levels off around 3–4 ply. A UK survey puts usage at about 8 sheets per visit.

**Stars** = 70% value + 30% comfort, rounded to the nearest half star.

- **Value**: wipes/€ compared with the median of ~30 regular packs. That includes 11 packs from **dm Bulgaria**, with prices and sheet counts read from dm-drogeriemarkt.bg in Nov 2026; these come first in the quick-pick templates. The rest are from Lidl, ALDI, Norma, EDEKA, Rossmann, Albert Heijn, Carrefour, Mercadona, Tesco IE and Biedronka (2025–26). The median scores 3★, about 1.5× the median scores 5★, and about ⅔ of the median scores 1★.
- **Comfort**: ply, sheet size (VKI documented shrinkflation in sheet sizes), softness, and whether the paper is recycled.

Benchmark data and sources are in [`src/data/benchmarks.ts`](src/data/benchmarks.ts). Rows marked `est` are typical or promo prices, not live shelf prices.

## Dev

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # model + advice tests
npm run build
```

Stack: Vite, React 19, TypeScript and Motion. Hand-written CSS (glassmorphism, aurora background). No backend.
