import { GRID_SIZE, SEQUENCES_TO_WIN } from './constants.js';
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
 * Locked chips still count so crossing sequences can share one token.
 * @param {unknown[][]} chips
 * @param {number} row
 * @param {number} col
 * @param {string} team
 */
export function countsForTeam(chips, row, col, team) {
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return false;
  if (isWildCell(row, col)) return true;
  return chips[row][col]?.team === team;
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
  return [...cells]
    .map((p) => `${p.row},${p.col}`)
    .sort()
    .join('|');
}

/**
 * @param {{ row: number, col: number }[]} a
 * @param {{ row: number, col: number }[]} b
 */
export function sharedNonWildCount(a, b) {
  const setB = new Set(b.map((c) => `${c.row},${c.col}`));
  let n = 0;
  for (const c of a) {
    if (isWildCell(c.row, c.col)) continue;
    if (setB.has(`${c.row},${c.col}`)) n += 1;
  }
  return n;
}

/**
 * @param {{ row: number, col: number }[]} cells
 * @returns {{ dr: number, dc: number } | null}
 */
export function lineDirection(cells) {
  if (!cells || cells.length < 2) return null;
  const pts = [...cells].sort((a, b) => a.row - b.row || a.col - b.col);
  let dr = pts[1].row - pts[0].row;
  let dc = pts[1].col - pts[0].col;
  if (dr === 0 && dc === 0) return null;
  const step = Math.max(Math.abs(dr), Math.abs(dc));
  dr = Math.sign(dr) * (Math.abs(dr) / step);
  dc = Math.sign(dc) * (Math.abs(dc) / step);
  // Normalize so opposite directions match (→ same as ←)
  if (dr < 0 || (dr === 0 && dc < 0)) {
    dr = -dr;
    dc = -dc;
  }
  return { dr, dc };
}

function sameDirection(a, b) {
  const da = lineDirection(a);
  const db = lineDirection(b);
  if (!da || !db) return false;
  return da.dr === db.dr && da.dc === db.dc;
}

/**
 * True when both 5-sets lie on the same geometric line (row, column, or diagonal).
 * @param {{ row: number, col: number }[]} a
 * @param {{ row: number, col: number }[]} b
 */
export function onSameLine(a, b) {
  if (!sameDirection(a, b)) return false;
  const dir = lineDirection(a);
  if (!dir) return false;
  const origin = a[0];
  for (const cell of [...a, ...b]) {
    const dr = cell.row - origin.row;
    const dc = cell.col - origin.col;
    // Cell is on the line through origin with direction dir when cross product is 0
    if (dr * dir.dc - dc * dir.dr !== 0) return false;
  }
  return true;
}

/**
 * A new sequence may share at most one non-wild chip with an existing claim,
 * and only when the lines cross (different direction).
 * Same line: cannot share any non-wild chip (no sliding / overlapping 5s).
 * Wild corners may be shared freely.
 * @param {{ row: number, col: number }[]} cells
 * @param {{ team: string, cells: { row: number, col: number }[] }[]} existingClaims
 * @param {string} team
 */
export function isValidNewSequenceClaim(cells, existingClaims = [], team) {
  if (!isValidSequencePick(cells)) return false;
  const key = lineKey(cells);
  for (const claim of existingClaims) {
    if (claim.team !== team) continue;
    if (lineKey(claim.cells) === key) return false;

    const shared = sharedNonWildCount(cells, claim.cells);
    if (shared === 0) continue;

    // Same line — even one shared chip is illegal
    if (onSameLine(cells, claim.cells)) return false;

    // Crossing / perpendicular / other diagonal — at most one shared chip
    if (shared > 1) return false;
  }
  return true;
}

/**
 * Contiguous windows of `size` along a scanned line.
 * @param {{ row: number, col: number }[]} line
 * @param {number} [size]
 */
export function contiguousWindows(line, size = 5) {
  if (line.length < size) return [];
  const windows = [];
  for (let i = 0; i <= line.length - size; i += 1) {
    windows.push(line.slice(i, i + size));
  }
  return windows;
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
 * Valid new 5-chip sequences through this cell (exact or windows on longer runs).
 * @param {unknown[][]} chips
 * @param {string} team
 * @param {number} row
 * @param {number} col
 * @param {{ team: string, cells: { row: number, col: number }[] }[]} [existingClaims]
 */
export function validSequenceWindowsThrough(chips, team, row, col, existingClaims = []) {
  const windows = [];
  const seen = new Set();
  for (const line of teamLinesThrough(chips, team, row, col)) {
    for (const window of contiguousWindows(line, 5)) {
      if (!isValidNewSequenceClaim(window, existingClaims, team)) continue;
      const key = lineKey(window);
      if (seen.has(key)) continue;
      seen.add(key);
      windows.push(window);
    }
  }
  return windows;
}

/**
 * @param {{ team: string, cells: { row: number, col: number }[] }[]} claims
 * @param {string} team
 */
export function teamSequenceCount(claims = [], team) {
  return claims.filter((claim) => claim.team === team).length;
}

/**
 * When one more sequence wins the game, auto-pick a valid 5 (prefer through the placed cell).
 * @param {unknown[][]} chips
 * @param {string} team
 * @param {number} row
 * @param {number} col
 * @param {{ team: string, cells: { row: number, col: number }[] }[]} [existingClaims]
 * @returns {{ row: number, col: number }[] | null}
 */
export function pickAutoWinningSequence(chips, team, row, col, existingClaims = []) {
  if (teamSequenceCount(existingClaims, team) + 1 < SEQUENCES_TO_WIN) return null;

  const windows = validSequenceWindowsThrough(chips, team, row, col, existingClaims);
  if (!windows.length) return null;

  const throughPlace = windows.find((window) =>
    window.some((cell) => cell.row === row && cell.col === col)
  );
  return throughPlace ?? windows[0];
}

/**
 * @param {unknown[][]} chips
 * @param {string} team
 * @param {number} row
 * @param {number} col
 * @param {{ team: string, cells: { row: number, col: number }[] }[]} [existingClaims]
 */
export function detectSequenceClaimRequired(chips, team, row, col, existingClaims = []) {
  // Winning second sequence is auto-claimed — no manual pick needed.
  if (pickAutoWinningSequence(chips, team, row, col, existingClaims)) return null;

  const windows = validSequenceWindowsThrough(chips, team, row, col, existingClaims);
  // Exact-length 5s are auto-locked; only prompt when the player must choose among options
  // (longer run with multiple valid windows, or a single window that is not the whole line).
  const lines = teamLinesThrough(chips, team, row, col);
  const longLines = lines.filter((line) => line.length >= 6);
  if (!longLines.length) return null;

  const validOnLong = windows.filter((window) =>
    longLines.some((line) => window.every((cell) =>
      line.some((p) => p.row === cell.row && p.col === cell.col)
    ))
  );
  if (!validOnLong.length) return null;

  const eligible = new Map();
  for (const window of validOnLong) {
    for (const cell of window) {
      eligible.set(`${cell.row},${cell.col}`, cell);
    }
  }
  return {
    eligibleCells: [...eligible.values()],
    lines: longLines,
    windows: validOnLong,
  };
}

/**
 * @param {unknown[][]} chips
 * @param {string} team
 * @param {number} row
 * @param {number} col
 * @param {{ team: string, cells: { row: number, col: number }[] }[]} [existingClaims]
 */
export function autoLockExactFives(chips, team, row, col, existingClaims = []) {
  const locked = [];
  const seen = new Set();
  for (const line of teamLinesThrough(chips, team, row, col)) {
    if (line.length !== 5) continue;
    if (!isValidNewSequenceClaim(line, existingClaims, team)) continue;
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
