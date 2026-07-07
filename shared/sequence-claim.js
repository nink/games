import { GRID_SIZE } from './constants.js';
import { BOARD, cellAt } from './cards.js';

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

function isWildCell(row, col) {
  return cellAt(row, col).isCorner || BOARD[row][col] === 'FREE';
}

/**
 * Wild corners count toward any team's sequence but never hold a chip.
 * @param {unknown[][]} chips
 * @param {number} row
 * @param {number} col
 * @param {string} team
 */
export function countsForTeam(chips, row, col, team) {
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return false;
  if (isWildCell(row, col)) return true;
  return chips[row][col].team === team;
}

/**
 * @param {unknown[][]} chips
 * @param {number} row
 * @param {number} col
 * @param {number} dr
 * @param {number} dc
 * @param {string} team
 */
export function scanTeamLine(chips, row, col, dr, dc, team) {
  if (!countsForTeam(chips, row, col, team)) return [];

  let sr = row;
  let sc = col;
  while (countsForTeam(chips, sr - dr, sc - dc, team)) {
    sr -= dr;
    sc -= dc;
  }

  const cells = [];
  let r = sr;
  let c = sc;
  while (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && countsForTeam(chips, r, c, team)) {
    cells.push({ row: r, col: c });
    r += dr;
    c += dc;
  }
  return cells;
}

function lineKey(cells) {
  return cells.map((p) => `${p.row},${p.col}`).join('|');
}

/**
 * @param {unknown[][]} chips
 * @param {string} team
 * @param {number} row
 * @param {number} col
 */
export function teamLinesThrough(chips, team, row, col) {
  const lines = [];
  const seen = new Set();
  for (const [dr, dc] of DIRECTIONS) {
    const line = scanTeamLine(chips, row, col, dr, dc, team);
    if (line.length < 5) continue;
    const key = lineKey(line);
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(line);
  }
  return lines;
}

/**
 * @param {unknown[][]} chips
 * @param {string} team
 * @param {number} row
 * @param {number} col
 */
export function detectSequenceClaimRequired(chips, team, row, col) {
  const lines = teamLinesThrough(chips, team, row, col);
  const longLines = lines.filter((line) => line.length >= 6);
  if (!longLines.length) return null;

  const eligible = new Map();
  for (const line of longLines) {
    for (const cell of line) {
      eligible.set(`${cell.row},${cell.col}`, cell);
    }
  }
  return {
    eligibleCells: [...eligible.values()],
    lines: longLines,
  };
}

/**
 * @param {unknown[][]} chips
 * @param {string} team
 * @param {number} row
 * @param {number} col
 */
export function autoLockExactFives(chips, team, row, col) {
  const locked = [];
  const seen = new Set();
  for (const line of teamLinesThrough(chips, team, row, col)) {
    if (line.length !== 5) continue;
    const key = lineKey(line);
    if (seen.has(key)) continue;
    seen.add(key);
    for (const { row: r, col: c } of line) {
      if (!isWildCell(r, c)) {
        chips[r][c].locked = true;
      }
    }
    locked.push(line);
  }
  return locked;
}

/**
 * @param {{ row: number, col: number }[]} cells
 */
export function areColinear(cells) {
  if (cells.length < 2) return true;
  const pts = [...cells].sort((a, b) => a.row - b.row || a.col - b.col);
  const dr = pts[1].row - pts[0].row;
  const dc = pts[1].col - pts[0].col;
  for (let i = 2; i < pts.length; i++) {
    if (pts[i].row - pts[i - 1].row !== dr || pts[i].col - pts[i - 1].col !== dc) {
      return false;
    }
  }
  return true;
}

/**
 * @param {{ row: number, col: number }[]} picked
 */
export function isValidSequencePick(picked) {
  return picked.length === 5 && areColinear(picked);
}

/**
 * @param {{ team: string, cells: { row: number, col: number }[] }[]} claims
 */
export function sequenceCountByClaims(_chips, claims = []) {
  const counts = {};
  for (const claim of claims) {
    counts[claim.team] = (counts[claim.team] ?? 0) + 1;
  }
  return counts;
}

/**
 * @param {unknown[][]} chips
 * @param {{ row: number, col: number }[]} cells
 */
export function lockClaimedCells(chips, cells) {
  for (const { row, col } of cells) {
    if (!isWildCell(row, col)) {
      chips[row][col].locked = true;
    }
  }
}
