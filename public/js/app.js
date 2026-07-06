import { renderTvView } from './tv-view.js';
import { renderPlayView } from './play-view.js';

/**
 * Simple path-based view routing: /tv | /play | default splash.
 */
export function getView() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path.endsWith('/tv')) return 'tv';
  if (path.endsWith('/play')) return 'play';
  return 'splash';
}

export function mountApp(root) {
  const view = getView();
  root.innerHTML = '';

  if (view === 'tv') {
    renderTvView(root);
    return;
  }
  if (view === 'play') {
    renderPlayView(root);
    return;
  }

  root.innerHTML = `
    <main class="min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-center">
      <div>
        <h1 class="text-5xl font-black tracking-tight text-amber-400">Take 5</h1>
        <p class="mt-2 text-slate-400 text-lg">Corporate Sequence — TV + phone controllers</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <a href="/tv" class="flex-1 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 px-6 transition">
          Open TV Board
        </a>
        <a href="/play" class="flex-1 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold py-4 px-6 transition">
          Join on Phone
        </a>
      </div>
      <p class="text-sm text-slate-500 max-w-sm">Point the big screen at <code class="text-amber-300">/tv</code>. Players join at <code class="text-amber-300">/play</code> with the room code.</p>
    </main>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  mountApp(document.getElementById('app'));
});
