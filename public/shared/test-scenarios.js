/**
 * Dev/test board seeds — activate with ?test01 (and future ?test02…).
 * Applied after a normal startGame deal so players/hands stay real.
 */

/**
 * @typedef {{ row: number, col: number }} Cell
 * @typedef {{
 *   id: string,
 *   label: string,
 *   chips: { row: number, col: number, team: string, locked?: boolean }[],
 *   sequenceClaims: { team: string, cells: Cell[] }[],
 * }} TestScenario
 */

/** Mid-board horizontal claimed sequence (no wild corners). */
const RED_SEQ_1 = [
  { row: 5, col: 2 },
  { row: 5, col: 3 },
  { row: 5, col: 4 },
  { row: 5, col: 5 },
  { row: 5, col: 6 },
];

/** Four unlocked red chips in a line — one more completes a second sequence. */
const RED_FOUR_LINE = [
  { row: 7, col: 3 },
  { row: 7, col: 4 },
  { row: 7, col: 5 },
  { row: 7, col: 6 },
];

/** @type {Record<string, TestScenario>} */
export const TEST_SCENARIOS = {
  test01: {
    id: 'test01',
    label: 'Red has 1 sequence + 4-in-a-row (one chip from second sequence)',
    chips: [
      ...RED_SEQ_1.map((c) => ({ ...c, team: 'red', locked: true })),
      ...RED_FOUR_LINE.map((c) => ({ ...c, team: 'red', locked: false })),
    ],
    sequenceClaims: [{ team: 'red', cells: [...RED_SEQ_1] }],
  },
};

/**
 * @param {string | null | undefined} id
 * @returns {TestScenario | null}
 */
export function getTestScenario(id) {
  if (!id) return null;
  const key = String(id).trim().toLowerCase();
  return TEST_SCENARIOS[key] ?? null;
}

/**
 * Apply a scenario onto an already-started room (chips + claims).
 * @param {{ chips: { team: string | null, locked: boolean }[][], sequenceClaims: { team: string, cells: Cell[] }[] }} room
 * @param {TestScenario} scenario
 */
export function applyTestScenario(room, scenario) {
  for (const chip of scenario.chips) {
    const cell = room.chips[chip.row]?.[chip.col];
    if (!cell) continue;
    cell.team = chip.team;
    cell.locked = Boolean(chip.locked);
  }
  room.sequenceClaims = scenario.sequenceClaims.map((claim) => ({
    team: claim.team,
    cells: claim.cells.map((c) => ({ row: c.row, col: c.col })),
  }));
}
