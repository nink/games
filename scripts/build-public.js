/**
 * Vercel/static build: sync shared modules into public/ for browser imports.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sharedSrc = path.join(root, 'shared');
const sharedDest = path.join(root, 'public', 'shared');

fs.mkdirSync(sharedDest, { recursive: true });

for (const name of fs.readdirSync(sharedSrc)) {
  if (!name.endsWith('.js')) continue;
  fs.copyFileSync(path.join(sharedSrc, name), path.join(sharedDest, name));
}

console.log('Copied shared/*.js → public/shared/');
