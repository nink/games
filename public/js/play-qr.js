/**
 * Render a QR code that opens the phone /play page (optionally with room code).
 * @param {HTMLElement} container
 * @param {string} [roomCode]
 */
import { playJoinQuery } from './logo-mode.js';

export async function renderPlayQr(container, roomCode = '') {
  const code = roomCode?.toUpperCase() || '';
  const url = `${location.origin}/play${playJoinQuery(code ? { code } : {})}`;

  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'flex flex-col items-center gap-2';

  const canvas = document.createElement('canvas');
  canvas.className = 'rounded-lg bg-white p-2 shadow-inner';
  canvas.setAttribute('aria-label', 'QR code to join on phone');

  const label = document.createElement('p');
  label.className = 'text-xs uppercase tracking-widest text-slate-500';
  label.textContent = 'Join on phone';

  const hint = document.createElement('p');
  hint.className = 'text-[11px] text-slate-400 text-center leading-snug';
  hint.textContent = code ? 'Scan — room code fills in automatically' : 'Scan to open join page';

  wrap.appendChild(label);
  wrap.appendChild(canvas);
  wrap.appendChild(hint);
  container.appendChild(wrap);

  try {
    const { default: QRCode } = await import(
      'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm'
    );
    await QRCode.toCanvas(canvas, url, {
      width: 168,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    });
  } catch (err) {
    console.error('QR render failed:', err);
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.className = 'text-amber-400 text-sm underline break-all text-center';
    fallback.textContent = url;
    wrap.replaceChildren(label, fallback, hint);
  }
}
