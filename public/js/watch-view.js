import {
  connect,
  onConnectionStatus,
  onMessage,
  subscribeTv,
} from './ws-client.js';
import { emptyBoardChips } from '/shared/cards.js';
import { renderBoard } from './board-render.js';
import { renderPlayQr } from './play-qr.js';
import { mountCorporateDemoBanner } from './demo-banner.js';

const ROOM_CODE_LEN = 4;
const KEYS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.split('');

/**
 * Second (or nth) TV — enter host room code with on-screen keyboard, then watch the board.
 * @param {HTMLElement} root
 */
export function renderWatchView(root) {
  let state = null;
  let roomCode = '';
  let draft = '';
  let watching = false;

  const urlCode = new URLSearchParams(location.search).get('code')?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, ROOM_CODE_LEN) || '';

  root.innerHTML = `
    <div class="min-h-screen flex flex-col gap-2 p-4 lg:p-6">
      <div id="watch-entry" class="flex-1 flex flex-col items-center justify-center gap-6 max-w-xl mx-auto w-full">
        <div class="text-center">
          <h1 class="text-4xl font-black text-amber-400">Watch board</h1>
          <p class="mt-2 text-slate-400 text-lg">Enter the room code from the host TV</p>
        </div>
        <div id="watch-draft" class="room-code text-5xl font-black text-amber-400 tracking-[0.35em] min-h-[1.2em]">----</div>
        <p id="watch-entry-error" class="text-red-400 text-sm hidden"></p>
        <div id="watch-keyboard" class="watch-keyboard w-full"></div>
        <div class="flex gap-3 w-full max-w-md">
          <button type="button" id="watch-backspace" class="flex-1 rounded-2xl bg-slate-800 border border-slate-600 font-bold py-4 text-lg">
            Delete
          </button>
          <button type="button" id="watch-clear" class="rounded-2xl bg-slate-800 border border-slate-600 font-bold py-4 px-5 text-lg">
            Clear
          </button>
        </div>
        <p class="text-sm text-slate-500 text-center max-w-sm">
          Host opens <code class="text-amber-300">/tv</code>. This screen only watches — it does not create a new room.
        </p>
      </div>

      <div id="watch-game" class="hidden flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        <section class="flex-1 flex flex-col items-center justify-center min-h-0">
          <div id="watch-board" class="w-full flex justify-center"></div>
          <p id="watch-status" class="mt-4 text-center text-slate-400 text-sm"></p>
        </section>
        <aside class="w-full lg:w-80 shrink-0 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col gap-5">
          <div>
            <p class="text-xs uppercase tracking-widest text-slate-500">Watching room</p>
            <p id="watch-code" class="room-code text-4xl font-black text-amber-400 mt-1">----</p>
          </div>
          <div id="watch-qr" class="flex justify-center py-1"></div>
          <p class="text-xs text-slate-500 text-center leading-snug">
            Players nearby can scan this QR or use the code above on <code class="text-amber-300">/play</code>
          </p>
          <div>
            <p class="text-xs uppercase tracking-widest text-slate-500 mb-2">Turn</p>
            <p id="watch-turn" class="text-lg font-semibold">Waiting…</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-widest text-slate-500 mb-2">Players</p>
            <ul id="watch-players" class="space-y-2 text-sm"></ul>
          </div>
          <div id="watch-sequences" class="text-sm text-slate-400"></div>
          <div id="watch-offline" class="hidden rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm p-3 leading-snug">
            Connecting to game server…
          </div>
          <button type="button" id="watch-change" class="mt-auto rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold py-3 px-4">
            Watch a different room
          </button>
        </aside>
      </div>
    </div>
  `;

  mountCorporateDemoBanner(root.querySelector('.min-h-screen'));

  const entryEl = root.querySelector('#watch-entry');
  const gameEl = root.querySelector('#watch-game');
  const draftEl = root.querySelector('#watch-draft');
  const keyboardEl = root.querySelector('#watch-keyboard');
  const entryError = root.querySelector('#watch-entry-error');
  const boardEl = root.querySelector('#watch-board');
  const codeEl = root.querySelector('#watch-code');
  const turnEl = root.querySelector('#watch-turn');
  const playersEl = root.querySelector('#watch-players');
  const seqEl = root.querySelector('#watch-sequences');
  const statusEl = root.querySelector('#watch-status');
  const offlineEl = root.querySelector('#watch-offline');
  const qrEl = root.querySelector('#watch-qr');
  const backspaceBtn = root.querySelector('#watch-backspace');
  const clearBtn = root.querySelector('#watch-clear');
  const changeBtn = root.querySelector('#watch-change');

  function showError(msg) {
    if (!msg) {
      entryError.classList.add('hidden');
      entryError.textContent = '';
      return;
    }
    entryError.textContent = msg;
    entryError.classList.remove('hidden');
  }

  function paintDraft() {
    const padded = (draft + '----').slice(0, ROOM_CODE_LEN);
    draftEl.textContent = padded;
  }

  function buildKeyboard() {
    keyboardEl.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'watch-keyboard-grid';
    for (const ch of KEYS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'watch-key';
      btn.textContent = ch;
      btn.addEventListener('click', () => appendKey(ch));
      grid.appendChild(btn);
    }
    keyboardEl.appendChild(grid);
  }

  function appendKey(ch) {
    if (draft.length >= ROOM_CODE_LEN) return;
    showError('');
    draft += ch;
    paintDraft();
    if (draft.length === ROOM_CODE_LEN) {
      beginWatch(draft);
    }
  }

  function paintBoard(chips) {
    const claim = state?.pendingSequenceClaim;
    const team =
      claim?.team ||
      (state?.pendingSelection
        ? state.players?.find((p) => p.id === state.pendingSelection.playerId)?.team
        : null) ||
      state?.currentTeam;
    renderBoard(boardEl, {
      chips,
      highlights: [],
      showTargetPreviews: false,
      interactive: false,
      playerTeam: team,
      highlightMode: 'token',
      sequenceEligible: claim?.eligibleCells ?? [],
      sequencePicked: claim?.pickedCells ?? [],
      sequenceTeam: claim?.team,
      winnerTeam: state?.phase === 'game_over' ? state.winnerTeam : null,
    });
  }

  function updateQr(code) {
    renderPlayQr(qrEl, code || roomCode).catch(() => {});
  }

  function paint() {
    if (!state || !watching) return;

    codeEl.textContent = state.code || '----';
    roomCode = state.code || roomCode;
    updateQr(roomCode);

    if (state.chips) {
      paintBoard(state.chips);
    }

    if (state.phase === 'game_over' && state.winnerTeam) {
      turnEl.innerHTML = `<span class="text-${state.winnerTeam}-400 uppercase font-black tracking-wide">${state.winnerTeam} TEAM WINS</span>`;
    } else if (state.currentPlayerName) {
      turnEl.innerHTML = `<span class="capitalize text-${state.currentTeam}-400">${state.currentPlayerName}</span> <span class="text-slate-500">(${state.currentTeam})</span>`;
    } else {
      turnEl.textContent = 'Lobby — waiting for players';
    }

    const byTeam = { red: [], blue: [], green: [] };
    for (const p of state.players ?? []) {
      (byTeam[p.team] ??= []).push(p);
    }

    playersEl.innerHTML = Object.entries(byTeam)
      .filter(([, list]) => list.length)
      .map(
        ([team, list]) => `
        <li>
          <span class="capitalize font-semibold text-${team}-400">${team}</span>
          <ul class="ml-3 mt-1 text-slate-400">
            ${list.map((p) => `<li>${p.name}${p.connected ? '' : ' (away)'}</li>`).join('')}
          </ul>
        </li>`
      )
      .join('');

    const counts = state.sequenceCounts ?? {};
    seqEl.innerHTML = Object.entries(counts)
      .map(([team, n]) => `<div><span class="capitalize text-${team}-400">${team}</span>: ${n} sequence${n === 1 ? '' : 's'}</div>`)
      .join('');

    statusEl.textContent = state.pendingSequenceClaim
      ? `${state.players?.find((p) => p.id === state.pendingSequenceClaim.playerId)?.name ?? 'Player'} — pick 5 for sequence`
      : state.pendingSelection
        ? 'A player is choosing where to play…'
        : state.phase === 'playing'
          ? `${state.deckRemaining ?? 0} cards left in deck`
          : state.phase === 'game_over'
            ? 'Game over'
            : 'Watching — board updates live';
  }

  function showEntry() {
    watching = false;
    state = null;
    entryEl.classList.remove('hidden');
    gameEl.classList.add('hidden');
    paintDraft();
  }

  function showGame() {
    watching = true;
    entryEl.classList.add('hidden');
    gameEl.classList.remove('hidden');
    try {
      paintBoard(state?.chips ?? emptyBoardChips());
    } catch (err) {
      console.error('Watch board render failed:', err);
      boardEl.innerHTML = `<p class="text-red-400 text-sm p-4">Board failed to load.</p>`;
    }
    updateQr(roomCode);
    if (state) paint();
  }

  async function beginWatch(code) {
    const normalized = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, ROOM_CODE_LEN);
    if (normalized.length !== ROOM_CODE_LEN) {
      showError('Enter the 4-character room code');
      return;
    }
    showError('');
    roomCode = normalized;
    draft = normalized;
    paintDraft();

    const url = new URL(location.href);
    url.searchParams.set('code', roomCode);
    history.replaceState({}, '', `${url.pathname}${url.search}`);

    const ok = await subscribeTv(roomCode);
    if (!ok) {
      showError('Room not found — check the code on the host TV');
      showEntry();
      return;
    }
    showGame();
  }

  buildKeyboard();
  paintDraft();

  backspaceBtn.addEventListener('click', () => {
    draft = draft.slice(0, -1);
    showError('');
    paintDraft();
  });
  clearBtn.addEventListener('click', () => {
    draft = '';
    showError('');
    paintDraft();
  });
  changeBtn.addEventListener('click', () => {
    draft = '';
    const url = new URL(location.href);
    url.searchParams.delete('code');
    history.replaceState({}, '', `${url.pathname}${url.search}`);
    showEntry();
  });

  connect();
  onConnectionStatus((status) => {
    const offline = status === 'offline';
    offlineEl.classList.toggle('hidden', !offline);
    if (offline && watching && !state) {
      turnEl.textContent = 'Offline';
      statusEl.textContent = 'Could not reach game server.';
    }
  });

  onMessage((msg) => {
    if (msg.type === 'error') {
      const reason = msg.payload?.reason || 'Could not join room';
      showError(reason);
      if (!watching || !state) {
        entryEl.classList.remove('hidden');
        gameEl.classList.add('hidden');
        watching = false;
      }
      return;
    }
    if (msg.type === 'subscribed') {
      roomCode = msg.payload.code;
      showError('');
      showGame();
      updateQr(roomCode);
    }
    if (msg.type === 'state') {
      state = msg.payload;
      if (!watching) showGame();
      paint();
    }
  });

  if (urlCode.length === ROOM_CODE_LEN) {
    beginWatch(urlCode);
  } else {
    showEntry();
  }
}
