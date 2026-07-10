import {
  connect,
  createRoom,
  onConnectionStatus,
  onMessage,
  startGame,
  subscribeTv,
} from './ws-client.js';
import { emptyBoardChips } from '/shared/cards.js';
import { renderBoard } from './board-render.js';
import { renderPlayQr } from './play-qr.js';
import { mountCorporateDemoBanner } from './demo-banner.js';
import { getActiveTestScenarioId } from './test-mode.js';

/**
 * @param {HTMLElement} root
 */
export function renderTvView(root) {
  let state = null;
  let roomCode = sessionStorage.getItem('take5_room_code') || '';

  root.innerHTML = `
    <div class="min-h-screen flex flex-col gap-2 p-4 lg:p-6">
      <div class="flex flex-1 flex-col lg:flex-row gap-4 min-h-0">
      <section class="flex-1 flex flex-col items-center justify-center">
        <div id="tv-board" class="w-full flex justify-center"></div>
        <p id="tv-status" class="mt-4 text-center text-slate-400 text-sm"></p>
      </section>
      <aside class="w-full lg:w-80 shrink-0 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col gap-5">
        <div>
          <p class="text-xs uppercase tracking-widest text-slate-500">Room code</p>
          <p id="tv-code" class="room-code text-4xl font-black text-amber-400 mt-1">----</p>
        </div>
        <div id="tv-qr" class="flex justify-center py-1"></div>
        <p class="text-xs text-slate-500 text-center leading-snug">
          Other TVs: open <code class="text-amber-300">/watch</code> and enter this code
        </p>
        <div>
          <p class="text-xs uppercase tracking-widest text-slate-500 mb-2">Turn</p>
          <p id="tv-turn" class="text-lg font-semibold">Waiting…</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-widest text-slate-500 mb-2">Players</p>
          <ul id="tv-players" class="space-y-2 text-sm"></ul>
        </div>
        <div id="tv-sequences" class="text-sm text-slate-400"></div>
        <div id="tv-offline" class="hidden rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm p-3 leading-snug">
          Connecting to game server…
        </div>
        <button id="tv-start" class="mt-auto hidden rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold py-3 px-4">
          Start game
        </button>
        <button id="tv-create" class="mt-auto rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4">
          Create new room
        </button>
      </aside>
      </div>
    </div>
  `;

  mountCorporateDemoBanner(root.querySelector('.min-h-screen'));

  const boardEl = root.querySelector('#tv-board');
  const codeEl = root.querySelector('#tv-code');
  const turnEl = root.querySelector('#tv-turn');
  const playersEl = root.querySelector('#tv-players');
  const seqEl = root.querySelector('#tv-sequences');
  const statusEl = root.querySelector('#tv-status');
  const startBtn = root.querySelector('#tv-start');
  const createBtn = root.querySelector('#tv-create');
  const offlineEl = root.querySelector('#tv-offline');
  const qrEl = root.querySelector('#tv-qr');

  function updateQr(code) {
    renderPlayQr(qrEl, code || roomCode).catch(() => {});
  }

  updateQr(roomCode);

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

  // Always show the board (Vercel has no WebSocket server until Supabase is wired).
  try {
    paintBoard(emptyBoardChips());
  } catch (err) {
    console.error('Board render failed:', err);
    boardEl.innerHTML = `<p class="text-red-400 text-sm p-4">Board failed to load. Try a hard refresh (Ctrl+Shift+R).</p>`;
  }

  function paint() {
    if (!state) return;

    codeEl.textContent = state.code || '----';
    roomCode = state.code;
    sessionStorage.setItem('take5_room_code', roomCode);
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

    const canStart =
      (state.phase === 'lobby' || state.phase === 'game_over')
      && (state.players?.length ?? 0) >= 2;
    startBtn.textContent = state.phase === 'game_over' ? 'Play again' : 'Start game';
    startBtn.classList.toggle('hidden', !canStart);
    statusEl.textContent = state.pendingSequenceClaim
      ? `${state.players?.find((p) => p.id === state.pendingSequenceClaim.playerId)?.name ?? 'Player'} — pick 5 for sequence`
      : state.pendingSelection
      ? 'A player is choosing where to play…'
      : state.phase === 'playing'
        ? `${state.deckRemaining ?? 0} cards left in deck`
        : state.phase === 'game_over'
          ? 'Game over — play again to clear the board'
          : '';
  }

  connect();
  onConnectionStatus((status) => {
    const offline = status === 'offline';
    offlineEl.classList.toggle('hidden', !offline);
    if (offline && !state) {
      turnEl.textContent = 'Offline';
      statusEl.textContent = 'Could not reach game server.';
    }
  });

  onMessage((msg) => {
    if (msg.type === 'room_created' || msg.type === 'subscribed') {
      roomCode = msg.payload.code;
      updateQr(roomCode);
    }
    if (msg.type === 'state') {
      state = msg.payload;
      paint();
    }
  });

  createBtn.addEventListener('click', () => createRoom());
  startBtn.addEventListener('click', () => startGame(getActiveTestScenarioId()));

  if (roomCode) {
    subscribeTv(roomCode);
  } else {
    createRoom();
  }
}
