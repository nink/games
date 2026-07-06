import { CARD_CATALOG } from '/shared/cards.js';
import { renderBoard, renderHand } from './board-render.js';
import {
  clearSelection,
  connect,
  getPlayerId,
  joinRoom,
  onMessage,
  playPlace,
  playRemove,
  selectCard,
  startGame,
} from './ws-client.js';

/**
 * @param {HTMLElement} root
 */
export function renderPlayView(root) {
  let state = null;
  let selectedCardId = null;
  let joined = false;

  const savedName = localStorage.getItem('take5_name') || '';
  const savedTeam = localStorage.getItem('take5_team') || 'red';
  const urlCode = new URLSearchParams(location.search).get('code')?.toUpperCase().slice(0, 4) || '';

  root.innerHTML = `
    <div id="play-join" class="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <div class="text-center">
        <h1 class="text-3xl font-black text-amber-400">Join Take 5</h1>
        <p class="text-slate-400 mt-1">Enter the code from the TV screen</p>
      </div>
      <form id="join-form" class="w-full max-w-sm space-y-4">
        <label class="block">
          <span class="text-xs uppercase text-slate-500">Your name</span>
          <input name="name" required maxlength="24" value="${savedName}"
            class="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3" placeholder="Alex" />
        </label>
        <label class="block">
          <span class="text-xs uppercase text-slate-500">Team</span>
          <select name="team" class="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3">
            <option value="red" ${savedTeam === 'red' ? 'selected' : ''}>Red</option>
            <option value="blue" ${savedTeam === 'blue' ? 'selected' : ''}>Blue</option>
            <option value="green" ${savedTeam === 'green' ? 'selected' : ''}>Green</option>
          </select>
        </label>
        <label class="block">
          <span class="text-xs uppercase text-slate-500">Room code</span>
          <input name="code" required maxlength="4" pattern="[A-Za-z0-9]{4}"
            class="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 uppercase room-code text-center text-2xl font-bold tracking-widest"
            placeholder="ABCD" value="${urlCode}" />
        </label>
        <button type="submit" class="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3">
          Join room
        </button>
      </form>
      <p id="join-error" class="text-red-400 text-sm hidden"></p>
    </div>

    <div id="play-game" class="hidden min-h-screen flex flex-col p-4 gap-4 max-w-lg mx-auto">
      <header class="flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-500">Room <span id="play-code" class="text-amber-400 font-bold"></span></p>
          <p id="play-turn" class="text-sm font-semibold"></p>
        </div>
        <span id="play-team-badge" class="rounded-full px-3 py-1 text-xs font-bold uppercase"></span>
      </header>
      <div id="play-mini-board" class="rounded-xl overflow-hidden border border-slate-800 opacity-90"></div>
      <p id="play-hint" class="text-center text-sm text-amber-300/80"></p>
      <section>
        <h2 class="text-xs uppercase tracking-widest text-slate-500 mb-2">Your hand</h2>
        <div id="play-hand"></div>
      </section>
      <button id="play-start" class="hidden rounded-xl bg-emerald-600 font-bold py-3">Start game (host)</button>
      <p id="play-error" class="text-red-400 text-sm text-center hidden"></p>
    </div>
  `;

  const joinEl = root.querySelector('#play-join');
  const gameEl = root.querySelector('#play-game');
  const joinForm = root.querySelector('#join-form');
  const joinError = root.querySelector('#join-error');
  const handEl = root.querySelector('#play-hand');
  const miniBoardEl = root.querySelector('#play-mini-board');
  const hintEl = root.querySelector('#play-hint');
  const turnEl = root.querySelector('#play-turn');
  const codeEl = root.querySelector('#play-code');
  const teamBadge = root.querySelector('#play-team-badge');
  const startBtn = root.querySelector('#play-start');
  const playError = root.querySelector('#play-error');

  function showError(el, text) {
    if (!text) {
      el.classList.add('hidden');
      el.textContent = '';
      return;
    }
    el.textContent = text;
    el.classList.remove('hidden');
  }

  function paint() {
    if (!state?.you) return;

    codeEl.textContent = state.code;
    teamBadge.textContent = state.you.team;
    teamBadge.className = `rounded-full px-3 py-1 text-xs font-bold uppercase bg-${state.you.team}-500/20 text-${state.you.team}-400 border border-${state.you.team}-500/40`;

    if (state.phase === 'game_over') {
      turnEl.textContent = state.winnerTeam ? `${state.winnerTeam} team wins!` : 'Game over';
    } else if (state.you.isYourTurn) {
      turnEl.textContent = 'Your turn — pick a card';
    } else {
      turnEl.textContent = `Waiting for ${state.currentPlayerName ?? '…'}`;
    }

    const targets = selectedCardId && state.you.isYourTurn
      ? (state.pendingSelection?.cardId === selectedCardId ? state.pendingSelection.targets : [])
      : [];

    if (state.chips) {
      renderBoard(miniBoardEl, {
        chips: state.chips,
        highlights: targets,
        interactive: Boolean(selectedCardId && state.you.isYourTurn),
        onCellClick: (row, col) => handleBoardTap(row, col),
        playerTeam: state.you.team,
      });
    }

    renderHand(handEl, state.you.hand, selectedCardId, (cardId) => {
      if (!state.you.isYourTurn) return;
      selectedCardId = cardId;
      selectCard(cardId);
      paint();
    });

    const card = selectedCardId ? CARD_CATALOG[selectedCardId] : null;
    if (!state.you.isYourTurn) {
      hintEl.textContent = '';
    } else if (!selectedCardId) {
      hintEl.textContent = 'Tap a card in your hand';
    } else if (card?.jackType === 'one_eyed') {
      hintEl.textContent = 'Pepsi — tap an opponent chip on the board to remove';
    } else if (card?.jackType === 'two_eyed') {
      hintEl.textContent = 'Coke — tap any open space';
    } else {
      hintEl.textContent = 'Tap a highlighted space on the board';
    }

    startBtn.classList.toggle('hidden', state.phase !== 'lobby');
  }

  function handleBoardTap(row, col) {
    if (!selectedCardId || !state?.you?.isYourTurn) return;
    const card = CARD_CATALOG[selectedCardId];
    if (card?.jackType === 'one_eyed') {
      playRemove(selectedCardId, row, col);
    } else {
      playPlace(selectedCardId, row, col);
    }
    selectedCardId = null;
    clearSelection();
  }

  connect();

  onMessage((msg) => {
    if (msg.type === 'error') {
      if (!joined) showError(joinError, msg.payload.reason);
      else showError(playError, msg.payload.reason);
      return;
    }
    if (msg.type === 'joined') {
      joined = true;
      joinEl.classList.add('hidden');
      gameEl.classList.remove('hidden');
    }
    if (msg.type === 'state') {
      state = msg.payload;
      if (!state.pendingSelection) selectedCardId = null;
      paint();
    }
  });

  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(joinForm);
    const name = String(fd.get('name') || '').trim();
    const team = String(fd.get('team') || 'red');
    const code = String(fd.get('code') || '').trim().toUpperCase();
    localStorage.setItem('take5_name', name);
    localStorage.setItem('take5_team', team);
    showError(joinError, '');
    joinRoom({ code, name, team });
  });

  startBtn.addEventListener('click', () => startGame());
}
