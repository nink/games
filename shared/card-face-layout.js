/**
 * Shared card-face geometry — matches public/css/styles.css board cells.
 * Board cells are square (aspect-ratio 1:1).
 */
export const BOARD_TILE_SIZE = 200;

/** Ratios from .card-face / .card-face-logo (5px inset on ~100px cell). */
export const BOARD_FACE_LAYOUT = {
  outerRadius: 12,
  logoInset: 10,
  logoRadius: 8,
  logoPadding: 6,
  stroke: 'rgba(15, 23, 42, 0.15)',
};

export const WILD_FACE_LAYOUT = {
  outerRadius: 12,
  logoInsetTop: 8,
  logoInsetSide: 6,
  logoInsetBottom: 32,
  logoRadius: 8,
  logoPaddingX: 8,
  logoPaddingY: 4,
  wildLabelBottom: 4,
  wildLabelSize: 14,
  gradientStart: '#fbbf24',
  gradientEnd: '#f59e0b',
  wildLabelColor: '#78350f',
};

/** Deck/hand order for mapping printouts. */
export const MAPPING_RANK_ORDER = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const MAPPING_SUIT_ORDER = ['hearts', 'spades', 'diamonds', 'clubs'];

export const RANK_DISPLAY = {
  A: 'Ace',
  K: 'King',
  Q: 'Queen',
  J: 'Jack',
};
