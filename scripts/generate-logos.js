/**
 * Write abstract Take 5 logos (no third-party marks).
 * Run: node scripts/generate-logos.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BRANDS } from '../shared/cards.js';
import { GENERIC_LOGO_SVG } from './generic-logos.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/assets/logos');

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  let ok = 0;
  const failed = [];

  for (const [brandId, brand] of Object.entries(BRANDS)) {
    try {
      const svg = GENERIC_LOGO_SVG[brandId];
      if (!svg) throw new Error(`Missing generic logo for ${brandId}`);
      fs.writeFileSync(path.join(outDir, brand.logo), svg.trim());
      ok++;
      process.stdout.write(`✓ ${brandId}\n`);
    } catch (err) {
      failed.push({ brandId, error: err.message });
      process.stderr.write(`✗ ${brandId}: ${err.message}\n`);
    }
  }

  console.log(`\nWrote ${ok}/${Object.keys(BRANDS).length} logos to public/assets/logos/`);
  if (failed.length) {
    console.error('Failed:', failed.map((f) => f.brandId).join(', '));
    process.exitCode = 1;
  }
}

main();
