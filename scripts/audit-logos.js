/**
 * Report logos used on board/deck that render outside their viewBox.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BRANDS, CARD_CATALOG } from '../shared/cards.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, '../public/assets/logos');

const used = new Set(Object.values(CARD_CATALOG).map((c) => c.brandId));
used.add('amazon');

for (const id of [...used].sort()) {
  const file = path.join(logosDir, BRANDS[id]?.logo ?? '');
  if (!fs.existsSync(file)) {
    console.log(`${id}: MISSING ${file}`);
    continue;
  }
  const raw = fs.readFileSync(file, 'utf8');
  const nested = raw.match(/<svg[^>]*width="104"[^>]*viewBox="([^"]+)"/i);
  const vb = nested?.[1] ?? raw.match(/viewBox="([^"]+)"/i)?.[1] ?? '?';
  const coords = [...raw.matchAll(/\b([0-9]{2,}(?:\.[0-9]+)?)\b/g)].map((m) => parseFloat(m[1]));
  const [,, vw, vh] = vb.split(/\s+/).map(Number);
  const max = Math.max(...coords, 0);
  const ok = !vw || max <= vw * 1.05;
  console.log(`${ok ? 'OK  ' : 'BAD '} ${id.padEnd(12)} viewBox=${vb} maxCoord≈${max.toFixed(0)}`);
}
