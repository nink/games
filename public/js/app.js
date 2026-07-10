import { renderTvView } from './tv-view.js';
import { renderPlayView } from './play-view.js';
import { isCorporateLogoDemo } from './logo-mode.js';

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

  const logoQs = isCorporateLogoDemo() ? '?logo=1' : '';

  root.innerHTML = `
    <main class="min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-center">
      <div>
        <h1 class="text-5xl font-black tracking-tight text-amber-400">Take 5</h1>
        <p class="mt-2 text-slate-400 text-lg">Sequence-style board game — TV + phone controllers</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <a href="/tv${logoQs}" class="flex-1 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 px-6 transition">
          Open TV Board
        </a>
        <a href="/play${logoQs}" class="flex-1 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold py-4 px-6 transition">
          Join on Phone
        </a>
      </div>
      <p class="text-sm text-slate-500 max-w-sm">Point the big screen at <code class="text-amber-300">/tv</code>. Players join at <code class="text-amber-300">/play</code> with the room code.</p>
      <div class="text-xs text-slate-600 max-w-md border-t border-slate-800 pt-4 mt-2 space-y-2">
        <p>Private sponsor demo (do not share publicly):</p>
        <p>
          <a href="/tv?logo=1" class="text-amber-400/80 underline">TV with corporate logos</a>
          ·
          <a href="/play?logo=1" class="text-amber-400/80 underline">Phone with corporate logos</a>
          ·
          <a href="/assets/cards-corporate/" class="text-amber-400/80 underline">Logo gallery backup</a>
        </p>
      </div>
    </main>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  mountApp(document.getElementById('app'));
});
