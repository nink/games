/**
 * @typedef {import('./state-machine.js').GameRoom} GameRoom
 */

/**
 * @param {GameRoom} room
 */
export function serializeRoomState(room) {
  return {
    phase: room.phase,
    players: room.players,
    deck: room.deck,
    chips: room.chips,
    currentPlayerIndex: room.currentPlayerIndex,
    winnerTeam: room.winnerTeam,
    pendingSelection: room.pendingSelection,
    pendingSequenceClaim: room.pendingSequenceClaim,
    sequenceClaims: room.sequenceClaims ?? [],
    activeTeams: [...room.activeTeams],
  };
}

/**
 * @param {string} code
 * @param {object} state
 * @returns {GameRoom}
 */
export function deserializeRoom(code, state) {
  return {
    code,
    phase: state.phase,
    players: state.players ?? [],
    deck: state.deck ?? [],
    chips: state.chips,
    currentPlayerIndex: state.currentPlayerIndex ?? 0,
    winnerTeam: state.winnerTeam ?? null,
    pendingSelection: state.pendingSelection ?? null,
    pendingSequenceClaim: state.pendingSequenceClaim ?? null,
    sequenceClaims: state.sequenceClaims ?? [],
    activeTeams: new Set(state.activeTeams ?? []),
  };
}
