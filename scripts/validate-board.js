/**
 * Assert official Sequence board invariants + 8 cells per brand (2 per suit colour).
 */
import { BOARD, brandForRankSuit, SUITS, SUIT_META } from '../shared/cards.js';

const cardCounts = {};
const brandBySuit = {};

for (let r = 0; r < 10; r++) {
  for (let c = 0; c < 10; c++) {
    const id = BOARD[r][c];
    if (id === 'FREE') continue;
    cardCounts[id] = (cardCounts[id] || 0) + 1;

    const [rank, suit] = id.split('_');
    const brand = brandForRankSuit(rank, suit);
    if (!brandBySuit[brand]) brandBySuit[brand] = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
    brandBySuit[brand][suit]++;
  }
}

let failed = false;

for (const [id, n] of Object.entries(cardCounts)) {
  if (n !== 2) {
    console.error(`Card ${id}: expected 2 board cells, got ${n}`);
    failed = true;
  }
}

const expectedCards = 48 * 2;
const actualCards = Object.values(cardCounts).reduce((a, b) => a + b, 0);
if (actualCards !== expectedCards) {
  console.error(`Board cells: expected ${expectedCards}, got ${actualCards}`);
  failed = true;
}

for (const [brand, suits] of Object.entries(brandBySuit)) {
  const total = SUITS.reduce((n, s) => n + suits[s], 0);
  if (total !== 8) {
    console.error(`Brand ${brand}: expected 8 cells, got ${total}`, suits);
    failed = true;
    continue;
  }
  for (const suit of SUITS) {
    if (suits[suit] !== 2) {
      console.error(
        `Brand ${brand} · ${SUIT_META[suit].colorName}: expected 2, got ${suits[suit]}`
      );
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log(`OK — ${Object.keys(cardCounts).length} card types × 2, ${Object.keys(brandBySuit).length} brands × 8 (2 per colour).`);
