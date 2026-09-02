#!/usr/bin/env node
/**
 * Rasterizes tools/og-image.html into the two static PNG assets the site needs.
 * Requires a Chromium/Chrome binary; set CHROME_BIN to override auto-detection.
 *
 *   node tools/generate-images.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'tools', 'og-image.html'), 'utf8');

const candidates = [
  process.env.CHROME_BIN,
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
].filter(Boolean);

const chrome = candidates.find((p) => { try { execFileSync(p, ['--version']); return true; } catch { return false; } });
if (!chrome) {
  console.error('No Chromium binary found. Set CHROME_BIN to a Chrome/Chromium executable.');
  process.exit(1);
}

const targets = [
  { name: 'og-image.png',        hide: '#icon', width: 1200, height: 630 },
  { name: 'apple-touch-icon.png', hide: '#og',   width: 180,  height: 180 },
];

const work = mkdtempSync(join(tmpdir(), 'bseg-img-'));
try {
  for (const t of targets) {
    const html = source.replace('</style>', `${t.hide} { display: none !important; }\n</style>`);
    const page = join(work, `${t.name}.html`);
    const out = join(work, t.name);
    writeFileSync(page, html);
    execFileSync(chrome, [
      '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${t.width},${t.height}`,
      `--screenshot=${out}`,
      `file://${page}`,
    ], { stdio: 'pipe' });
    copyFileSync(out, join(root, 'public', t.name));
    console.log(`public/${t.name}  (${t.width}x${t.height})`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
