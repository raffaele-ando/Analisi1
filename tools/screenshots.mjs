#!/usr/bin/env node
// Fotografa ogni schermata e ogni tipo di esercizio dell'app, a 390 px (telefono), in chiaro e in scuro,
// e a 1280 px (desktop). Richiede dist/ costruito (node tools/build.mjs) e un server statico in dist/.
// Uso: node tools/screenshots.mjs <url-base> <cartella-output>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.argv[2] || 'http://localhost:8765';
const out = process.argv[3] || 'screenshots';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
fs.mkdirSync(out, { recursive: true });
fs.copyFileSync(path.join(root, 'tools/gallery.html'), path.join(root, 'dist/gallery.html'));
fs.copyFileSync(path.join(root, 'tools/gallery.js'), path.join(root, 'dist/gallery.js'));

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] });
const index = [];
const errors = [];

async function shot(page, name, desc) {
  await page.waitForTimeout(350);
  const file = path.join(out, name + '.png');
  await page.screenshot({ path: file, fullPage: false });
  index.push({ name, desc, file });
}
async function newPage({ w = 390, h = 844, dark = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, colorScheme: dark ? 'dark' : 'light' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(4000);
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errors.push(m.text()); });
  return page;
}
const btn = (page, re) => page.getByRole('button', { name: re }).first();
const tab = (page, t) => page.locator('.tabbar .tab', { hasText: t }).first();
const tryClick = async (loc) => { if (await loc.count()) { await loc.click(); return true; } return false; };

// ---------- 1. primo avvio, Percorso ----------
{
  const page = await newPage();
  await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await shot(page, '01-onboarding', 'Primo avvio: una sola schermata di benvenuto');
  await btn(page, /Inizia la prima lezione/).click();
  await page.waitForTimeout(400);
  await shot(page, '02-percorso-inizio', 'Percorso: in cima (prossima lezione, sezione 0)');
  await page.evaluate(() => window.scrollTo(0, 900));
  await shot(page, '03-percorso-scorrimento', 'Percorso scorso: nodi e sezione successiva');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('.node button.disc').nth(1).click().catch(() => {});
  await shot(page, '04-scheda-bloccata', 'Scheda abilità di un nodo bloccato');
  await page.keyboard.press('Escape');
  await page.locator('.x-btn[aria-label="Chiudi"]').first().click().catch(() => {});
  await page.locator('.node button.disc').nth(0).click().catch(() => {});
  await shot(page, '05-scheda-sbloccata', 'Scheda abilità sbloccata: lezioni e azioni');
  await page.locator('.x-btn[aria-label="Chiudi"]').first().click().catch(() => {});
  // lezione: prima card
  await tryClick(btn(page, /^Continua/));
  await shot(page, '06-lezione-teoria', 'Lezione: prima card di teoria');
  await page.close();
}

// ---------- 2. Ripasso e Teoria ----------
{
  const page = await newPage();
  await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await btn(page, /Inizia la prima lezione/).click(); await page.waitForTimeout(300);
  await tab(page, 'Ripasso').click(); await page.waitForTimeout(300);
  await shot(page, '07-ripasso-vuoto', 'Ripasso senza elementi: stato vuoto');
  await page.getByRole('tab', { name: /Teoria/ }).click(); await page.waitForTimeout(300);
  await shot(page, '08-teoria-elenco', 'Ripasso, vista Teoria: elenco delle sezioni');
  await page.locator('.section-row').first().click(); await page.waitForTimeout(300);
  await shot(page, '09-scheda-fronte', 'Scheda di teoria: fronte');
  await btn(page, /Mostra la risposta/).click().catch(() => {}); await page.waitForTimeout(200);
  await shot(page, '10-scheda-retro', 'Scheda di teoria: retro con i quattro voti');
  await page.close();
}

// ---------- 3. Esami ----------
{
  const page = await newPage();
  await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await btn(page, /Inizia la prima lezione/).click(); await page.waitForTimeout(300);
  await tab(page, 'Esami').click(); await page.waitForTimeout(300);
  await shot(page, '11-esami-hub', 'Esami: tema generato e temi reali');
  await btn(page, /Inizia \(2 ore\)/).click(); await page.waitForTimeout(400);
  await shot(page, '12-esame-parte-a', 'Esame: parte A, prima domanda');
  await page.getByRole('button', { name: /Parte B/ }).first().click().catch(() => {}); await page.waitForTimeout(300);
  await shot(page, '13-esame-parte-b', 'Esame: parte B, esercizi');
  await page.locator('.x-btn[aria-label="Esci"]').first().click().catch(() => {}); await page.waitForTimeout(300);
  await shot(page, '14-esame-uscita', 'Esame: conferma prima di uscire');
  await page.close();
}

// ---------- 4. Profilo e cronologia ----------
{
  const page = await newPage();
  await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await btn(page, /Inizia la prima lezione/).click(); await page.waitForTimeout(300);
  await tab(page, 'Profilo').click(); await page.waitForTimeout(300);
  await shot(page, '15-profilo', 'Profilo: progressi, salvataggio, preferenze');
  await page.evaluate(() => window.scrollTo(0, 900));
  await shot(page, '16-profilo-fondo', 'Profilo: preferenze e azzeramento');
  await page.evaluate(() => window.scrollTo(0, 0));
  await btn(page, /Cronologia/).click().catch(() => {}); await page.waitForTimeout(400);
  await shot(page, '17-cronologia', 'Cronologia: istantanee e copia di sicurezza');
  await page.close();
}

// ---------- 5. Tipi di esercizio (galleria) ----------
const cases = ['mcq', 'mcq-multi', 'tf', 'num', 'expr', 'interval', 'set', 'tuple', 'order', 'cloze', 'match', 'open', 'problem', 'learn', 'example'];
for (const c of cases) {
  const page = await newPage();
  await page.goto(base + '/gallery.html?case=' + c, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await shot(page, 'ex-' + c, 'Esercizio di tipo ' + c + ': stato iniziale');
  await page.close();
}

// ---------- 6. Risposte: giusta e sbagliata (feedback) ----------
{
  const page = await newPage();
  await page.goto(base + '/gallery.html?case=mcq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.locator('.options button.opt').nth(0).click(); await page.waitForTimeout(150);
  await btn(page, /^Verifica$/).click(); await page.waitForTimeout(300);
  await shot(page, 'fb-sbagliata', 'Feedback di una risposta sbagliata (footer rosso)');
  await page.close();
}
{
  const page = await newPage();
  await page.goto(base + '/gallery.html?case=mcq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const opts = page.locator('.options button.opt');
  const n = await opts.count();
  for (let i = 0; i < n; i++) {
    if ((await opts.nth(i).innerText()).includes('frac{3}{4}') || (await opts.nth(i).innerHTML()).includes('mathrm') || true) {}
  }
  await opts.nth(1).click(); await page.waitForTimeout(150);
  await btn(page, /^Verifica$/).click(); await page.waitForTimeout(300);
  await shot(page, 'fb-giusta', 'Feedback di una risposta giusta (footer verde)');
  await page.close();
}

// ---------- 7. Modalità scura e desktop ----------
{
  const page = await newPage({ dark: true });
  await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await shot(page, '18-onboarding-scuro', 'Onboarding in modalità scura');
  await btn(page, /Inizia la prima lezione/).click(); await page.waitForTimeout(300);
  await shot(page, '19-percorso-scuro', 'Percorso in modalità scura');
  await page.close();
}
{
  const page = await newPage({ w: 1280, h: 800 });
  await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await btn(page, /Inizia la prima lezione/).click(); await page.waitForTimeout(300);
  await shot(page, '20-percorso-desktop', 'Percorso a 1280 px: barra laterale');
  await page.close();
}

fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify({ base, shots: index, errors }, null, 2));
await browser.close();
console.log(`screenshot: ${index.length} · errori JS: ${errors.length}`);
if (errors.length) console.log(errors.slice(0, 10).join('\n'));
