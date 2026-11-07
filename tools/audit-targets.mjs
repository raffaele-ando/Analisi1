#!/usr/bin/env node
// Controllo nel browser: elenca gli elementi interattivi più piccoli della soglia (default 48 px).
// Uso: node tools/audit-targets.mjs [url] [soglia]
// Richiede Playwright: imposta PLAYWRIGHT_MODULE al percorso del modulo, e CHROME_PATH al binario di Chromium.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const url = process.argv[2] || 'http://localhost:8000/index.html';
const min = Number(process.argv[3] || 48);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await page.goto(url, { waitUntil: 'networkidle' });
const small = await page.evaluate((min) => [...document.querySelectorAll('button, a, input, select, textarea, [role=radio]')]
  .map((e) => {
    const r = e.getBoundingClientRect();
    return { label: (e.innerText || e.getAttribute('aria-label') || e.className || '').toString().trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) };
  })
  .filter((x) => x.w && x.h && (x.w < min || x.h < min)), min);
await browser.close();
if (small.length) {
  console.log(`✗ ${small.length} elementi sotto ${min} px:`);
  for (const s of small) console.log(`  ${s.w}×${s.h}  ${s.label}`);
  process.exit(1);
}
console.log(`✓ tutti gli elementi interattivi della schermata iniziale sono almeno ${min} px`);
