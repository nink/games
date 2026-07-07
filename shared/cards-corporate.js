/**
 * Corporate rebrand dictionary + canonical Sequence-style 10×10 board.
 * Each cell holds a card id (or "FREE" for corner wild spaces).
 * Jacks are deck-only — not printed on the board.
 */

export const SUITS = /** @type {const} */ (['hearts', 'diamonds', 'clubs', 'spades']);
export const RANKS = /** @type {const} */ (['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']);

/** @typedef {{ id: string, rank: string, suit: string, brandId: string, label: string, jackType?: 'two_eyed' | 'one_eyed' }} CardDef */

/** Brand metadata — globally recognized logos only */
export const BRANDS = {
  mcdonalds: { id: 'mcdonalds', name: "McDonald's", logo: 'mcdonalds-logo.svg', accent: '#DA291C' },
  kfc: { id: 'kfc', name: 'KFC', logo: 'kfc-logo.svg', accent: '#E4002B' },
  burgerking: { id: 'burgerking', name: 'Burger King', logo: 'burgerking-logo.svg', accent: '#D62300' },
  coke: { id: 'coke', name: 'Coke', logo: 'coke-logo.svg', accent: '#F40009' },
  pepsi: { id: 'pepsi', name: 'Pepsi', logo: 'pepsi-logo.svg', accent: '#004B93' },
  apple: { id: 'apple', name: 'Apple', logo: 'apple-logo.svg', accent: '#555555' },
  google: { id: 'google', name: 'Google', logo: 'google-logo.svg', accent: '#4285F4' },
  facebook: { id: 'facebook', name: 'Facebook', logo: 'facebook-logo.svg', accent: '#0866FF' },
  x: { id: 'x', name: 'X', logo: 'x-logo.svg', accent: '#000000' },
  linkedin: { id: 'linkedin', name: 'LinkedIn', logo: 'linkedin-logo.svg', accent: '#0A66C2' },
  microsoft: { id: 'microsoft', name: 'Microsoft', logo: 'microsoft-logo.svg', accent: '#00A4EF' },
  ikea: { id: 'ikea', name: 'IKEA', logo: 'ikea-logo.svg', accent: '#0058A3' },
  samsung: { id: 'samsung', name: 'Samsung', logo: 'samsung-logo.svg', accent: '#1428A0' },
  meta: { id: 'meta', name: 'Meta', logo: 'meta-logo.svg', accent: '#0467DF' },
  netflix: { id: 'netflix', name: 'Netflix', logo: 'netflix-logo.svg', accent: '#E50914' },
  disney: { id: 'disney', name: 'Disney', logo: 'disney-logo.svg', accent: '#113CCF' },
  spotify: { id: 'spotify', name: 'Spotify', logo: 'spotify-logo.svg', accent: '#1DB954' },
  youtube: { id: 'youtube', name: 'YouTube', logo: 'youtube-logo.svg', accent: '#FF0000' },
  instagram: { id: 'instagram', name: 'Instagram', logo: 'instagram-logo.svg', accent: '#E4405F' },
  tiktok: { id: 'tiktok', name: 'TikTok', logo: 'tiktok-logo.svg', accent: '#000000' },
  uber: { id: 'uber', name: 'Uber', logo: 'uber-logo.svg', accent: '#000000' },
  airbnb: { id: 'airbnb', name: 'Airbnb', logo: 'airbnb-logo.svg', accent: '#FF5A5F' },
  paypal: { id: 'paypal', name: 'PayPal', logo: 'paypal-logo.svg', accent: '#003087' },
  visa: { id: 'visa', name: 'Visa', logo: 'visa-logo.svg', accent: '#1A1F71' },
  mastercard: { id: 'mastercard', name: 'Mastercard', logo: 'mastercard-logo.svg', accent: '#EB001B' },
  starbucks: { id: 'starbucks', name: 'Starbucks', logo: 'starbucks-logo.svg', accent: '#00704A' },
  dominos: { id: 'dominos', name: "Domino's", logo: 'dominos-logo.svg', accent: '#006491' },
  pizzahut: { id: 'pizzahut', name: 'Pizza Hut', logo: 'pizzahut-logo.svg', accent: '#EE3A23' },
  tacobell: { id: 'tacobell', name: 'Taco Bell', logo: 'tacobell-logo.svg', accent: '#702082' },
  tesla: { id: 'tesla', name: 'Tesla', logo: 'tesla-logo.svg', accent: '#CC0000' },
  toyota: { id: 'toyota', name: 'Toyota', logo: 'toyota-logo.svg', accent: '#EB0A1E' },
  bmw: { id: 'bmw', name: 'BMW', logo: 'bmw-logo.svg', accent: '#0066B1' },
  ford: { id: 'ford', name: 'Ford', logo: 'ford-logo.svg', accent: '#003478' },
  nike: { id: 'nike', name: 'Nike', logo: 'nike-logo.svg', accent: '#111111' },
  adidas: { id: 'adidas', name: 'Adidas', logo: 'adidas-logo.svg', accent: '#000000' },
  puma: { id: 'puma', name: 'Puma', logo: 'puma-logo.svg', accent: '#000000' },
  underarmour: { id: 'underarmour', name: 'Under Armour', logo: 'underarmour-logo.svg', accent: '#1D1D1D' },
  free: { id: 'free', name: 'Wild Space', logo: 'wild-space.svg', accent: '#F59E0B' },
};

/** Wild corner tile for corporate demo (?logo). */
export const WILD_CORNER_BRAND_ID = 'spotify';
export const FALLBACK_BRAND_ID = 'apple';

/**
 * One brand per rank — same logo on all four suit colours.
 * Each card id appears twice on the board → 4 suits × 2 = 8 cells per logo
 * (2 purple, 2 orange, 2 yellow, 2 teal).
 */
const RANK_BRAND = {
  2: 'apple',
  3: 'google',
  4: 'facebook',
  5: 'netflix',
  6: 'x',
  7: 'starbucks',
  8: 'bmw',
  9: 'nike',
  10: 'burgerking',
  Q: 'linkedin',
  K: 'kfc',
  A: 'mcdonalds',
};

/** Suit → card/board background (distinct from team chip colours: red, blue, green). */
export const SUIT_META = {
  hearts: { name: 'Hearts', colorName: 'Purple', bg: '#9333ea', css: 'hearts' },
  diamonds: { name: 'Diamonds', colorName: 'Orange', bg: '#f97316', css: 'diamonds' },
  clubs: { name: 'Clubs', colorName: 'Yellow', bg: '#eab308', css: 'clubs' },
  spades: { name: 'Spades', colorName: 'Teal', bg: '#0d9488', css: 'spades' },
};

/**
 * Display label: "McDonald's · Red"
 * @param {string} brandName
 * @param {string} suit
 */
export function brandSuitLabel(brandName, suit) {
  const meta = SUIT_META[suit];
  return meta ? `${brandName} · ${meta.colorName}` : brandName;
}

/**
 * @param {string} rank
 * @param {string} suit
 * @returns {string}
 */
export function brandForRankSuit(rank, suit) {
  if (rank === 'J') return null;
  return RANK_BRAND[rank] ?? 'apple';
}

/**
 * @param {string} rank
 * @param {string} suit
 * @returns {CardDef}
 */
export function makeCard(rank, suit) {
  const id = `${rank}_${suit}`;
  if (rank === 'J') {
    const twoEyed = suit === 'clubs' || suit === 'diamonds';
    const brandId = twoEyed ? 'coke' : 'pepsi';
    const brand = BRANDS[brandId];
    const base = twoEyed ? 'Coke (Wild)' : 'Pepsi (Remove)';
    return {
      id,
      rank,
      suit,
      brandId,
      label: brandSuitLabel(base, suit),
      jackType: twoEyed ? 'two_eyed' : 'one_eyed',
    };
  }
  const brandId = brandForRankSuit(rank, suit);
  const brand = BRANDS[brandId];
  return {
    id,
    rank,
    suit,
    brandId,
    label: brandSuitLabel(brand?.name ?? brandId, suit),
  };
}

/** @type {Record<string, CardDef>} */
export const CARD_CATALOG = {};

for (const suit of SUITS) {
  for (const rank of RANKS) {
    const card = makeCard(rank, suit);
    CARD_CATALOG[card.id] = card;
  }
}

/**
 * Official Hasbro Sequence board (dzirbel/sequence standard_board).
 * Each non-jack card id appears exactly twice; corners are FREE.
 */
export const BOARD = [
  ['FREE', '2_spades', '3_spades', '4_spades', '5_spades', '6_spades', '7_spades', '8_spades', '9_spades', 'FREE'],
  ['6_clubs', '5_clubs', '4_clubs', '3_clubs', '2_clubs', 'A_hearts', 'K_hearts', 'Q_hearts', '10_hearts', '10_spades'],
  ['7_clubs', 'A_spades', '2_diamonds', '3_diamonds', '4_diamonds', '5_diamonds', '6_diamonds', '7_diamonds', '9_hearts', 'Q_spades'],
  ['8_clubs', 'K_spades', '6_clubs', '5_clubs', '4_clubs', '3_clubs', '2_clubs', '8_diamonds', '8_hearts', 'K_spades'],
  ['9_clubs', 'Q_spades', '7_clubs', '6_hearts', '5_hearts', '4_hearts', 'A_hearts', '9_diamonds', '7_hearts', 'A_spades'],
  ['10_clubs', '10_spades', '8_clubs', '7_hearts', '2_hearts', '3_hearts', 'K_hearts', '10_diamonds', '6_hearts', '2_diamonds'],
  ['Q_clubs', '9_spades', '9_clubs', '8_hearts', '9_hearts', '10_hearts', 'Q_hearts', 'Q_diamonds', '5_hearts', '3_diamonds'],
  ['K_clubs', '8_spades', '10_clubs', 'Q_clubs', 'K_clubs', 'A_clubs', 'A_diamonds', 'K_diamonds', '4_hearts', '4_diamonds'],
  ['A_clubs', '7_spades', '6_spades', '5_spades', '4_spades', '3_spades', '2_spades', '2_hearts', '3_hearts', '5_diamonds'],
  ['FREE', 'A_diamonds', 'K_diamonds', 'Q_diamonds', '10_diamonds', '9_diamonds', '8_diamonds', '7_diamonds', '6_diamonds', 'FREE'],
];

/**
 * Empty chip matrix for board preview (matches server serializeChips shape).
 */
export function emptyBoardChips() {
  return BOARD.map((row, r) =>
    row.map((cardId, c) => ({
      row: r,
      col: c,
      team: null,
      locked: false,
      cardId,
    }))
  );
}

/**
 * @param {number} row
 * @param {number} col
 * @returns {{ row: number, col: number, cardId: string, isCorner: boolean }}
 */
export function cellAt(row, col) {
  const cardId = BOARD[row][col];
  const isCorner =
    (row === 0 && col === 0) ||
    (row === 0 && col === 9) ||
    (row === 9 && col === 0) ||
    (row === 9 && col === 9);
  return { row, col, cardId, isCorner };
}

/**
 * All board coordinates that match a card id (for highlighting / validation).
 * @param {string} cardId
 * @returns {{ row: number, col: number }[]}
 */
export function boardCellsForCard(cardId) {
  const cells = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if (BOARD[r][c] === cardId) cells.push({ row: r, col: c });
    }
  }
  return cells;
}

/**
 * Build double-deck (104 cards, Sequence rules — jacks in deck only).
 * @returns {string[]}
 */
export function buildDeck() {
  const deck = [];
  for (let d = 0; d < 2; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push(`${rank}_${suit}`);
      }
    }
  }
  return shuffle(deck);
}

/**
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * @param {string} cardId
 * @returns {CardDef | null}
 */
export function getCard(cardId) {
  return CARD_CATALOG[cardId] ?? null;
}

/**
 * @param {string} cardId
 * @returns {import('./constants.js').JACK_TYPE[keyof typeof import('./constants.js').JACK_TYPE] | null}
 */
export function jackTypeOf(cardId) {
  const card = getCard(cardId);
  return card?.jackType ?? null;
}

/**
 * Brand display for a board cell.
 * @param {string} cellCardId
 */
export function brandForCell(cellCardId) {
  if (cellCardId === 'FREE') return BRANDS.spotify;
  const card = getCard(cellCardId);
  if (!card) return BRANDS.apple;
  return BRANDS[card.brandId] ?? BRANDS.apple;
}

const MAPPING_RANK_ORDER = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const MAPPING_SUIT_ORDER = ['hearts', 'spades', 'diamonds', 'clubs'];
const RANK_DISPLAY = { A: 'Ace', K: 'King', Q: 'Queen', J: 'Jack' };

/** @typedef {{ cardId: string, rank: string, suit: string, rankLabel: string, suitLabel: string, colorName: string, brandId: string, brandName: string, label: string, onBoard: boolean, boardCells: { row: number, col: number }[] }} CardMappingRow */

/**
 * Every card id → logo + colour (+ board positions when on board).
 * @returns {CardMappingRow[]}
 */
export function buildCardMapping() {
  const rows = [];
  for (const rank of MAPPING_RANK_ORDER) {
    for (const suit of MAPPING_SUIT_ORDER) {
      const cardId = `${rank}_${suit}`;
      const card = CARD_CATALOG[cardId];
      if (!card) continue;
      const brand = BRANDS[card.brandId];
      const suitMeta = SUIT_META[suit];
      const boardCells = boardCellsForCard(cardId);
      rows.push({
        cardId,
        rank,
        suit,
        rankLabel: RANK_DISPLAY[rank] ?? rank,
        suitLabel: suitMeta?.name ?? suit,
        colorName: suitMeta?.colorName ?? '',
        brandId: card.brandId,
        brandName: brand?.name ?? card.brandId,
        label: card.label,
        onBoard: boardCells.length > 0,
        boardCells,
      });
    }
  }
  return rows;
}

/**
 * Logo → all four suit variants (+ board cell count).
 * @returns {Record<string, { brandId: string, brandName: string, cards: CardMappingRow[], boardCellCount: number }>}
 */
export function buildLogoMapping() {
  /** @type {Record<string, CardMappingRow[]>} */
  const groups = {};
  for (const row of buildCardMapping()) {
    if (row.rank === 'J') continue;
    if (!groups[row.brandId]) groups[row.brandId] = [];
    groups[row.brandId].push(row);
  }
  /** @type {Record<string, { brandId: string, brandName: string, cards: CardMappingRow[], boardCellCount: number }>} */
  const out = {};
  for (const [brandId, cards] of Object.entries(groups)) {
    out[brandId] = {
      brandId,
      brandName: cards[0]?.brandName ?? brandId,
      cards,
      boardCellCount: cards.reduce((n, c) => n + c.boardCells.length, 0),
    };
  }
  return out;
}

/**
 * Logos that appear on the board (48 card types, 12 brands). Excludes jacks and wild corners.
 * @returns {{ brandId: string, brandName: string, rank: string, cardIds: string[], boardCells: number }[]}
 */
export function buildBoardLogoList() {
  /** @type {Map<string, { brandId: string, brandName: string, rank: string, cardIds: Set<string>, boardCells: number }>} */
  const byBrand = new Map();
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cardId = BOARD[r][c];
      if (cardId === 'FREE') continue;
      const card = CARD_CATALOG[cardId];
      if (!card) continue;
      const brand = BRANDS[card.brandId];
      if (!byBrand.has(card.brandId)) {
        byBrand.set(card.brandId, {
          brandId: card.brandId,
          brandName: brand?.name ?? card.brandId,
          rank: card.rank,
          cardIds: new Set(),
          boardCells: 0,
        });
      }
      const entry = byBrand.get(card.brandId);
      entry.cardIds.add(cardId);
      entry.boardCells += 1;
    }
  }
  return [...byBrand.values()]
    .map((e) => ({ ...e, cardIds: [...e.cardIds].sort() }))
    .sort((a, b) => MAPPING_RANK_ORDER.indexOf(a.rank) - MAPPING_RANK_ORDER.indexOf(b.rank));
}
