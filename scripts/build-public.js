/**
 * Vercel/static build: sync shared modules + inject cache-bust version into index.html.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sharedSrc = path.join(root, 'shared');
const sharedDest = path.join(root, 'public', 'shared');
const indexPath = path.join(root, 'public', 'index.html');

function assetVersion() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return String(Date.now());
  }
}

fs.mkdirSync(sharedDest, { recursive: true });

for (const name of fs.readdirSync(sharedSrc)) {
  if (!name.endsWith('.js')) continue;
  fs.copyFileSync(path.join(sharedSrc, name), path.join(sharedDest, name));
}

const version = assetVersion();
let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('__ASSET_VERSION__')) {
  console.warn('index.html missing __ASSET_VERSION__ placeholders');
} else {
  html = html.replaceAll('__ASSET_VERSION__', version);
  fs.writeFileSync(indexPath, html);
}

console.log(`Copied shared/*.js → public/shared/ (asset v=${version})`);
