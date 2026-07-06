import { GRID_SIZE, SEQUENCES_TO_WIN } from '../shared/constants.js';
import { BOARD, cellAt } from '../shared/cards.js';

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

/**
 * @typedef {{ row: number, col: number, team: string | null, locked: boolean }} ChipCell
 * @typedef {ChipCell[][]} ChipMatrix
 */

/**
 * Create empty chip matrix.
 * @returns {ChipMatrix}
 */
export function createChipMatrix() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ team: null, locked: false }))
  );
}

/**
 * Scan board for completed sequences per team after a move.
 * @param {ChipMatrix} chips
 * @returns {{ team: string, cells: { row: number, col: number }[] }[]}
 */
export function findCompletedSequences(chips) {
  const found = [];
  const seen = new Set();

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const team = chips[r][c].team;
      if (!team) continue;

      for (const [dr, dc] of DIRECTIONS) {
        const line = [{ row: r, col: c }];
        for (let step = 1; step < 5; step++) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) break;
          if (chips[nr][nc].team !== team) break;
          line.push({ row: nr, col: nc });
        }
        if (line.length < 5) continue;

        const key = line.map((p) => `${p.row},${p.col}`).sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        found.push({ team, cells: line });
      }
    }
  }
  return found;
}

/**
 * Lock chips that belong to any completed sequence.
 * @param {ChipMatrix} chips
 */
export function lockSequenceChips(chips) {
  const sequences = findCompletedSequences(chips);
  for (const seq of sequences) {
    for (const { row, col } of seq.cells) {
      chips[row][col].locked = true;
    }
  }
  return sequences;
}

/**
 * Count distinct completed sequences per team (line keys deduped).
 * @param {ChipMatrix} chips
 * @returns {Record<string, number>}
 */
export function sequenceCountByTeam(chips) {
  const sequences = findCompletedSequences(chips);
  const counts = {};
  for (const seq of sequences) {
    counts[seq.team] = (counts[seq.team] ?? 0) + 1;
  }
  return counts;
}

/**
 * @param {ChipMatrix} chips
 * @returns {string | null}
 */
export function winningTeam(chips) {
  const counts = sequenceCountByTeam(chips);
  for (const [team, count] of Object.entries(counts)) {
    if (count >= SEQUENCES_TO_WIN) return team;
  }
  return null;
}

/**
 * Corners count for any team when checking placement validity for normal cards.
 * @param {number} row
 * @param {number} col
 */
export function isCorner(row, col) {
  return cellAt(row, col).isCorner;
}

/**
 * Serialize chip matrix for clients.
 * @param {ChipMatrix} chips
 */
export function serializeChips(chips) {
  return chips.map((row, r) =>
    row.map((cell, c) => ({
      row: r,
      col: c,
      team: cell.team,
      locked: cell.locked,
      cardId: BOARD[r][c],
    }))
  );
}
