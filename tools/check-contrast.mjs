#!/usr/bin/env node
// Verifica il contrasto WCAG 2.2 delle coppie colore/sfondo, leggendo i token reali da app/app.css.
// Tema chiaro: blocco :root. Tema scuro: blocco :root:not([data-theme='light']) e :root[data-theme='dark'].
// Soglie: testo normale 4.5:1 (WCAG 1.4.3), componenti grafici e bordi 3:1 (WCAG 1.4.11).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(root, 'app/app.css'), 'utf8');

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[m[1]] = m[2];
  return out;
}
function blockAfter(marker) {
  const i = css.indexOf(marker);
  if (i < 0) throw new Error('blocco non trovato: ' + marker);
  const open = css.indexOf('{', i);
  let depth = 0;
  for (let j = open; j < css.length; j++) {
    if (css[j] === '{') depth++;
    if (css[j] === '}') { depth--; if (depth === 0) return css.slice(open, j + 1); }
  }
  throw new Error('blocco non chiuso: ' + marker);
}

const light = tokens(blockAfter(':root {'));
const dark = { ...light, ...tokens(blockAfter(":root:not([data-theme='light'])")) };

const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(h.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [testo/primo colore, sfondo/secondo colore, soglia, descrizione]
const TEXT = 4.5;
const UI = 3;
const PAIRS = [
  ['ink', 'bg', TEXT, 'testo principale su sfondo'],
  ['ink', 'surface', TEXT, 'testo principale su scheda'],
  ['ink-2', 'bg', TEXT, 'testo secondario su sfondo'],
  ['ink-2', 'surface', TEXT, 'testo secondario su scheda'],
  ['ink-3', 'bg', TEXT, 'testo tenue su sfondo'],
  ['ink-3', 'surface', TEXT, 'testo tenue su scheda'],
  ['ink-3', 'surface-2', TEXT, 'testo tenue su superficie 2 (stati bloccati)'],
  ['accent-ink', 'accent-soft', TEXT, 'testo accento su accento tenue'],
  ['accent', 'surface', TEXT, 'testo accento su scheda'],
  ['on-accent', 'accent', TEXT, 'testo su pulsante primario'],
  ['success-ink', 'success-soft', TEXT, 'testo successo su fondo successo'],
  ['success', 'surface', TEXT, 'testo successo su scheda'],
  ['danger-ink', 'danger-soft', TEXT, 'testo errore su fondo errore'],
  ['danger', 'surface', TEXT, 'testo errore su scheda'],
  ['streak', 'surface', TEXT, 'contatore serie su scheda'],
  ['line-strong', 'surface', UI, 'bordo dei controlli su scheda'],
  ['accent', 'surface-2', UI, 'stato attivo su superficie 2'],
];

let failed = 0;
for (const [name, tokensSet] of [['tema chiaro', light], ['tema scuro', dark]]) {
  console.log(`\n${name}`);
  for (const [a, b, min, desc] of PAIRS) {
    if (!tokensSet[a] || !tokensSet[b]) {
      console.log(`  ✗ token mancante: ${a} / ${b}`);
      failed++;
      continue;
    }
    const r = ratio(tokensSet[a], tokensSet[b]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`  ${ok ? '✓' : '✗'} ${r.toFixed(2).padStart(5)}:1  ${a} su ${b}  (min ${min})  — ${desc}`);
  }
}
console.log(failed ? `\n${failed} coppie sotto soglia` : '\n✓ tutti i contrasti rispettano WCAG 2.2 AA');
process.exit(failed ? 1 : 0);
