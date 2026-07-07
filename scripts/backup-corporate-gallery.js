/**
 * Snapshot corporate card gallery from git (pre-generic logos) into public/assets/cards-corporate/.
 * Run: node scripts/backup-corporate-gallery.js
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const commit = '5da6f88^';
const outDir = path.join(root, 'public/assets/cards-corporate');

function gitLs(dir) {
  const out = execSync(`git ls-tree -r --name-only ${commit} -- ${dir}`, {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  return out ? out.split('\n').filter(Boolean) : [];
}

fs.mkdirSync(outDir, { recursive: true });

const files = gitLs('public/assets/cards');
for (const rel of files) {
  const content = execSync(`git show ${commit}:${rel}`, { cwd: root });
  const dest = path.join(root, rel.replace('public/assets/cards/', 'public/assets/cards-corporate/'));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}

let indexHtml = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
indexHtml = indexHtml.replace(
  '<title>Take 5 — Cards & mapping</title>',
  '<title>Take 5 — Corporate logo gallery (private demo backup)</title>'
);
indexHtml = indexHtml.replace(
  '<h1>Take 5 cards</h1>',
  '<h1>Take 5 corporate logo gallery</h1>\n  <p class="muted">Private demo backup — not for public distribution. Live board: <code>/tv?logo</code></p>'
);
fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml);

console.log(`Restored ${files.length} files → public/assets/cards-corporate/`);
