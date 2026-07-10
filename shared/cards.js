/**
 * Fictional brand dictionary + canonical Sequence-style 10×10 board.
 * Each cell holds a card id (or "FREE" for corner wild spaces).
 * Jacks are deck-only — not printed on the board.
 */

export const SUITS = /** @type {const} */ (['hearts', 'diamonds', 'clubs', 'spades']);
export const RANKS = /** @type {const} */ (['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']);

/** @typedef {{ id: string, rank: string, suit: string, brandId: string, label: string, jackType?: 'two_eyed' | 'one_eyed' }} CardDef */

/** Original abstract icons only — no third-party trademarks */
export const BRANDS = {
  logo_a: { id: 'logo_a', name: 'Beacon', logo: 'logo-a.svg', accent: '#d97706' },
  logo_2: { id: 'logo_2', name: 'Spark', logo: 'logo-2.svg', accent: '#ef4444' },
  logo_3: { id: 'logo_3', name: 'Nova', logo: 'logo-3.svg', accent: '#8b5cf6' },
  logo_4: { id: 'logo_4', name: 'Prism', logo: 'logo-4.svg', accent: '#06b6d4' },
  logo_5: { id: 'logo_5', name: 'Orbit', logo: 'logo-5.svg', accent: '#3b82f6' },
  logo_6: { id: 'logo_6', name: 'Pulse', logo: 'logo-6.svg', accent: '#10b981' },
  logo_7: { id: 'logo_7', name: 'Ridge', logo: 'logo-7.svg', accent: '#64748b' },
  logo_8: { id: 'logo_8', name: 'Glyph', logo: 'logo-8.svg', accent: '#f97316' },
  logo_9: { id: 'logo_9', name: 'Apex', logo: 'logo-9.svg', accent: '#0ea5e9' },
  logo_10: { id: 'logo_10', name: 'Flux', logo: 'logo-10.svg', accent: '#ec4899' },
  logo_j: { id: 'logo_j', name: 'Jack', logo: 'logo-j.svg', accent: '#7c3aed' },
  logo_q: { id: 'logo_q', name: 'Crown', logo: 'logo-q.svg', accent: '#eab308' },
  logo_k: { id: 'logo_k', name: 'Shield', logo: 'logo-k.svg', accent: '#059669' },
  yourlogo: { id: 'yourlogo', name: 'YOUR LOGO', logo: 'your-logo.svg', accent: '#dc2626' },
};

/** Wild corner sponsor tile (generic production). */
export const WILD_CORNER_BRAND_ID = 'yourlogo';
export const FALLBACK_BRAND_ID = 'logo_2';

/**
 * One brand per rank — same logo on all four suit colours.
 * Each card id appears twice on the board → 4 suits × 2 = 8 cells per logo
 * (2 purple, 2 orange, 2 yellow, 2 teal).
 */
const RANK_BRAND = {
  2: 'logo_2',
  3: 'logo_3',
  4: 'logo_4',
  5: 'logo_5',
  6: 'logo_6',
  7: 'logo_7',
  8: 'logo_8',
  9: 'logo_9',
  10: 'logo_10',
  Q: 'logo_q',
  K: 'logo_k',
  A: 'logo_a',
};

/** Suit → traditional symbol + red/black ink (plain mode). bg used only by ?logo demo. */
export const SUIT_META = {
  hearts: { name: 'Hearts', colorName: 'Purple', bg: '#9333ea', symbol: '♥', ink: '#dc2626', css: 'hearts' },
  diamonds: { name: 'Diamonds', colorName: 'Orange', bg: '#f97316', symbol: '♦', ink: '#dc2626', css: 'diamonds' },
  clubs: { name: 'Clubs', colorName: 'Yellow', bg: '#eab308', symbol: '♣', ink: '#0f172a', css: 'clubs' },
  spades: { name: 'Spades', colorName: 'Teal', bg: '#0d9488', symbol: '♠', ink: '#0f172a', css: 'spades' },
};

/**
 * Compact face label: "A♥", "10♠"
 * @param {string} rank
 * @param {string} suit
 */
export function cardFaceLabel(rank, suit) {
  const meta = SUIT_META[suit];
  return meta ? `${rank}${meta.symbol}` : String(rank);
}

/**
 * @deprecated Prefer cardFaceLabel for plain mode.
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
  return RANK_BRAND[rank] ?? 'logo_2';
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
    const brandId = 'logo_j';
    const face = cardFaceLabel(rank, suit);
    return {
      id,
      rank,
      suit,
      brandId,
      label: twoEyed ? `${face} Place` : `${face} Remove`,
      jackType: twoEyed ? 'two_eyed' : 'one_eyed',
    };
  }
  const brandId = brandForRankSuit(rank, suit);
  return {
    id,
    rank,
    suit,
    brandId,
    label: cardFaceLabel(rank, suit),
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
  if (cellCardId === 'FREE') return BRANDS.yourlogo;
  const card = getCard(cellCardId);
  if (!card) return BRANDS.logo_2;
  return BRANDS[card.brandId] ?? BRANDS.logo_2;
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
        colorName: suitMeta?.colorName ?? suitMeta?.name ?? '',
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
