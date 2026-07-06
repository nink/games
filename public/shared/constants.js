/** @typedef {'red' | 'blue' | 'green'} TeamColor */

export const TEAMS = /** @type {const} */ (['red', 'blue', 'green']);

export const GRID_SIZE = 10;

/** First team to this many sequences wins */
export const SEQUENCES_TO_WIN = 2;

/** Cards dealt per player at start / after draw */
export const HAND_SIZE = 6;

/** Room join code length */
export const ROOM_CODE_LENGTH = 4;

export const GAME_PHASE = /** @type {const} */ ({
  LOBBY: 'lobby',
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
});

export const JACK_TYPE = /** @type {const} */ ({
  TWO_EYED: 'two_eyed',
  ONE_EYED: 'one_eyed',
});
