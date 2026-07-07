import { CARD_CATALOG, boardCellsForCard } from '/shared/cards.js';

function isWildCornerCell(chips, row, col) {
  return chips[row]?.[col]?.cardId === 'FREE';
}

/**
 * Client-side legal targets (mirrors server) for instant highlight before WS round-trip.
 * @param {unknown[][]} chips
 * @param {string} cardId
 * @param {'red' | 'blue' | 'green'} playerTeam
 */
export function legalTargetsClient(chips, cardId, playerTeam) {
  const card = CARD_CATALOG[cardId];
  if (!card || !chips) return [];

  if (card.jackType === 'two_eyed') {
    const targets = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!chips[r][c].team && !isWildCornerCell(chips, r, c)) {
          targets.push({ row: r, col: c, kind: 'place' });
        }
      }
    }
    return targets;
  }

  if (card.jackType === 'one_eyed') {
    const targets = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const cell = chips[r][c];
        if (cell.team && cell.team !== playerTeam && !cell.locked) {
          targets.push({ row: r, col: c, kind: 'remove' });
        }
      }
    }
    return targets;
  }

  const matches = boardCellsForCard(cardId);
  const targets = [];
  for (const { row, col } of matches) {
    if (!chips[row][col].team && !isWildCornerCell(chips, row, col)) {
      targets.push({ row, col, kind: 'place' });
    }
  }
  return targets;
}

/**
 * @param {number} clientX
 * @param {number} clientY
 * @param {HTMLElement} gridEl
 * @param {{ row: number, col: number }[]} targets
 */
export function snapTargetFromPointer(clientX, clientY, gridEl, targets) {
  if (!targets.length) return null;
  const rect = gridEl.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const cellW = rect.width / 10;
  const cellH = rect.height / 10;
  const threshold = Math.max(cellW, cellH) * 1.35;

  let best = null;
  let bestD = Infinity;
  for (const t of targets) {
    const cx = (t.col + 0.5) * cellW;
    const cy = (t.row + 0.5) * cellH;
    const d = Math.hypot(x - cx, y - cy);
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return best && bestD <= threshold ? best : null;
}
