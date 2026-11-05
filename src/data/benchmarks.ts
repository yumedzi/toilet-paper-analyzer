/**
 * Shelf benchmarks — regular packs seen in main EU supermarkets (2025–2026).
 * `est: true` = typical / derived / promo price, not a live-verified shelf tag.
 * Sheet size is almost never printed by shops, so the model's standard sheet is assumed.
 * PLN converted at 1 EUR ≈ 4.25 PLN.
 */
export interface Benchmark {
  name: string
  brand: string
  shop: string
  country: string
  rolls: number
  sheetsPerRoll: number
  ply: number
  priceEur: number
  est: boolean
  url: string
}

export const BENCHMARKS: Benchmark[] = [
  // dm — prices (EUR) and sheets/roll read from the dm online shop on 2026-11-05
  { name: 'Sanft&Sicher Classic 3-ply 20×220', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 20, sheetsPerRoll: 220, ply: 3, priceEur: 8.65, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/1892806' },
  { name: 'Sanft&Sicher Classic 3-ply 10×220', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 10, sheetsPerRoll: 220, ply: 3, priceEur: 5.15, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/1892805' },
  { name: 'Sanft&Sicher Recycling 3-ply 8×220', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 8, sheetsPerRoll: 220, ply: 3, priceEur: 3.2, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/2477883' },
  { name: 'Sanft&Sicher Limited 3-ply 8×180', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 8, sheetsPerRoll: 180, ply: 3, priceEur: 3.55, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/1587820' },
  { name: 'Sanft&Sicher Premium 4-ply 20×200', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 20, sheetsPerRoll: 200, ply: 4, priceEur: 9.7, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/3156124' },
  { name: 'Sanft&Sicher Premium 4-ply 10×200', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 10, sheetsPerRoll: 200, ply: 4, priceEur: 5.6, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/3156125' },
  { name: 'Sanft&Sicher 4-ply 10×180', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 10, sheetsPerRoll: 180, ply: 4, priceEur: 5.6, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/1700999' },
  { name: 'Sanft&Sicher Balsam 4-ply 8×150', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 8, sheetsPerRoll: 150, ply: 4, priceEur: 3.9, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/3120647' },
  { name: 'Sanft&Sicher Deluxe 5-ply 8×130', brand: 'Sanft&Sicher', shop: 'dm', country: 'BG', rolls: 8, sheetsPerRoll: 130, ply: 5, priceEur: 5.95, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/1319294' },
  { name: 'Zewa Ultra Smart 4-ply 4×300', brand: 'Zewa', shop: 'dm', country: 'BG', rolls: 4, sheetsPerRoll: 300, ply: 4, priceEur: 5.95, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/3156432' },
  { name: 'Zewa Ultra Smart 4-ply 8×300', brand: 'Zewa', shop: 'dm', country: 'BG', rolls: 8, sheetsPerRoll: 300, ply: 4, priceEur: 10.95, est: false, url: 'https://www.dm-drogeriemarkt.bg/p/d/3156358' },

  // rest of EU
  { name: 'Kokett 4-ply 10×200', brand: 'Kokett', shop: 'ALDI Süd', country: 'DE', rolls: 10, sheetsPerRoll: 200, ply: 4, priceEur: 4.95, est: false, url: 'https://www.aldi-sued.de/newsroom/alle-pressemitteilungen/marke-und-produkte/2025/das-produkt-brauchen-alle-bei-aldi-rollen-die-preise-fuer-toilettenpapier-nach-unten' },
  { name: 'Kokett 3-ply 10×220', brand: 'Kokett', shop: 'ALDI Süd', country: 'DE', rolls: 10, sheetsPerRoll: 220, ply: 3, priceEur: 3.95, est: false, url: 'https://www.aldi-sued.de/newsroom/alle-pressemitteilungen/marke-und-produkte/2025/das-produkt-brauchen-alle-bei-aldi-rollen-die-preise-fuer-toilettenpapier-nach-unten' },
  { name: 'Kokett XXL 4-ply 20×200', brand: 'Kokett', shop: 'ALDI Süd', country: 'DE', rolls: 20, sheetsPerRoll: 200, ply: 4, priceEur: 7.49, est: false, url: 'https://www.aldi-sued.de/produkt/kokett-toilettenpapier-xxl-4-lagig-20-rollen-je-200-blatt-000000000000721316' },
  { name: 'Kokett 4-ply 15×200', brand: 'Kokett', shop: 'ALDI Süd', country: 'DE', rolls: 15, sheetsPerRoll: 200, ply: 4, priceEur: 7.99, est: false, url: 'https://www.aldi-sued.de/produkt/kokett-toilettenpapier-4-lagig-000000000000746361' },
  { name: 'Floralys Supersoft 4-ply 10×180', brand: 'Floralys', shop: 'Lidl', country: 'DE', rolls: 10, sheetsPerRoll: 180, ply: 4, priceEur: 4.36, est: true, url: 'https://www.supermarktcheck.de/wc/produkte/' },
  { name: 'Floralys Recycling 3-ply 8×220', brand: 'Floralys', shop: 'Lidl', country: 'DE', rolls: 8, sheetsPerRoll: 220, ply: 3, priceEur: 2.55, est: true, url: 'https://www.supermarktcheck.de/wc/produkte/' },
  { name: 'Floralys Extrasoft 3-ply 10×200', brand: 'Floralys', shop: 'Lidl', country: 'DE', rolls: 10, sheetsPerRoll: 200, ply: 3, priceEur: 3.59, est: true, url: 'https://www.supermarktcheck.de/product/28626-floralys-toilettenpapier-' },
  { name: 'Floralys XXL 3-ply 32×200', brand: 'Floralys', shop: 'Lidl', country: 'DE', rolls: 32, sheetsPerRoll: 200, ply: 3, priceEur: 9.99, est: true, url: 'https://www.mydealz.de/deals/toilettenpapier-floralys-2829685' },
  { name: 'Hakle 3-ply 16×150', brand: 'Hakle', shop: 'Lidl', country: 'DE', rolls: 16, sheetsPerRoll: 150, ply: 3, priceEur: 3.99, est: true, url: 'https://www.marktguru.de/rc/lidl/toilettenpapier' },
  { name: 'Daunasoft 3-ply 10×220', brand: 'Daunasoft', shop: 'Norma', country: 'DE', rolls: 10, sheetsPerRoll: 220, ply: 3, priceEur: 3.74, est: true, url: 'https://www.supermarktcheck.de/wc/produkte/' },
  { name: 'Daunasoft 4-ply 10×200', brand: 'Daunasoft', shop: 'Norma', country: 'DE', rolls: 10, sheetsPerRoll: 200, ply: 4, priceEur: 6.06, est: true, url: 'https://www.supermarktcheck.de/wc/produkte/' },
  { name: 'Favora Premium 4-ply 10×200', brand: 'Favora', shop: 'DE discounters', country: 'DE', rolls: 10, sheetsPerRoll: 200, ply: 4, priceEur: 4.86, est: true, url: 'https://www.supermarktcheck.de/wc/produkte/' },
  { name: 'Gut & Günstig 3-ply 10×200', brand: 'Gut & Günstig', shop: 'EDEKA', country: 'DE', rolls: 10, sheetsPerRoll: 200, ply: 3, priceEur: 3.75, est: true, url: 'https://www.supermarktcheck.de/wc/produkte/' },
  { name: 'Zewa bewährt 3-ply 8×150', brand: 'Zewa', shop: 'Rossmann / dm', country: 'DE', rolls: 8, sheetsPerRoll: 150, ply: 3, priceEur: 3.84, est: true, url: 'https://www.rossmann.de/haushalt-zewa-bewaehrt-zarte-frische-toilettenpapier-3-lagig/p/7322542037232' },
  { name: 'AH 3-ply 8=12 rolls (8×300)', brand: 'AH', shop: 'Albert Heijn', country: 'NL', rolls: 8, sheetsPerRoll: 300, ply: 3, priceEur: 3.95, est: true, url: 'https://www.ah.nl/producten/product/wi571275/ah-toiletpapier-3-laags-8-12-rollen' },
  { name: 'Carrefour Essential 3-ply 12×140', brand: 'Carrefour', shop: 'Carrefour', country: 'FR', rolls: 12, sheetsPerRoll: 140, ply: 3, priceEur: 4.75, est: true, url: 'https://www.promocatalogues.fr/magasins/carrefour/offres/carrefour-essential-papier-hygienique-ultra-confort-offre-64852307/' },
  { name: 'Bosque Verde Doble Rollo 2-ply 12×326', brand: 'Bosque Verde', shop: 'Mercadona', country: 'ES', rolls: 12, sheetsPerRoll: 326, ply: 2, priceEur: 4.8, est: true, url: 'https://okdiario.com/economia/brutal-cambio-este-producto-provoca-mercadona-avalancha-compras-10768966' },
  { name: 'Kittensoft 3-ply 9×160', brand: 'Kittensoft', shop: 'Tesco', country: 'IE', rolls: 9, sheetsPerRoll: 160, ply: 3, priceEur: 7.5, est: true, url: 'https://www.tesco.ie/shop/en-IE/products/308104781' },
  { name: 'Queen Komfort 3-ply 10×200', brand: 'Queen', shop: 'Biedronka', country: 'PL', rolls: 10, sheetsPerRoll: 200, ply: 3, priceEur: 3.06, est: true, url: 'https://www.pepper.pl/promocje/papier-toaletowy-queen-komfort-10-rolek-3-warstwowy-200-listkow-przy-zakupie-2-opak-biedronka-2707-0108-bez-appki-karty-mb-1322486' },
  { name: 'Velvet Soft White 3-ply 16×150', brand: 'Velvet', shop: 'Biedronka', country: 'PL', rolls: 16, sheetsPerRoll: 150, ply: 3, priceEur: 3.29, est: true, url: 'https://www.pepper.pl/promocje/papier-toaletowy-velvet-soft-white-z-aloesem-16-rolek-w-promocji-11-gratis-1399-zl-za-paczke-087-zl-za-rolke-biedronka-1320669' },
  { name: 'Kokett 3-ply 8×150', brand: 'Kokett', shop: 'Biedronka', country: 'PL', rolls: 8, sheetsPerRoll: 150, ply: 3, priceEur: 2.7, est: true, url: 'https://www.pepper.pl/promocje/papier-toaletowy-3-warstwowy-opak-8-rolek-kokett-11-gratis-cena-za-opak-przy-zakupie-2-opakowan-1357058' },
]
