#!/usr/bin/env node
// Validatore dei contenuti: schema, LaTeX (KaTeX), risposte valutabili, generatori.
// Uso: node tools/validate.mjs [file1.js file2.js ...]   (default: tutti app/content/s*.js e exams*.js)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import katex from 'katex';
import * as math from 'mathjs';
import { initMath, checkAnswer, evaluate, parses, parseIntervals } from '../app/engine/check.js';
import { makeRng } from '../app/engine/rng.js';

initMath(math);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const quiet = process.argv.includes('--quiet');
const allFilesMode = files.length === 0;
if (allFilesMode) {
  const dir = path.join(root, 'app/content');
  files = fs.readdirSync(dir).filter((f) => /^(s\d+.*|exams.*)\.js$/.test(f)).sort().map((f) => path.join(dir, f));
}

const errors = [];
const warnings = [];
const ids = new Map();
const stats = { sections: 0, skills: 0, lessons: 0, cards: 0, exercises: 0, generators: 0, flashcards: 0, problems: 0, exams: 0 };
let where = '';

function err(msg) {
  errors.push(`${where}: ${msg}`);
}
function warn(msg) {
  warnings.push(`${where}: ${msg}`);
}
function regId(id, kind) {
  if (!id || typeof id !== 'string') return err(`${kind} senza id`);
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(id)) err(`id non valido "${id}"`);
  if (ids.has(id)) err(`id duplicato "${id}" (già in ${ids.get(id)})`);
  ids.set(id, where);
}

export const MACROS = { '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\Z': '\\mathbb{Z}', '\\Q': '\\mathbb{Q}', '\\C': '\\mathbb{C}' };

/** Controlla il markdown: delimitatori $ bilanciati e LaTeX valido. */
function md(text, label) {
  if (text == null) return;
  if (typeof text !== 'string') return err(`${label}: atteso testo, trovato ${typeof text}`);
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let m;
  while ((m = re.exec(text))) {
    const tex = m[1] ?? m[2];
    try {
      katex.renderToString(tex, { throwOnError: true, displayMode: !!m[1], macros: { ...MACROS }, strict: false });
    } catch (e) {
      err(`${label}: LaTeX non valido «${tex.slice(0, 80)}» → ${e.message.split('\n')[0]}`);
    }
    if (/NaN|undefined|Infinity/.test(tex)) err(`${label}: LaTeX contiene NaN/undefined/Infinity «${tex.slice(0, 60)}»`);
  }
  const rest = text.replace(re, '');
  if (rest.includes('$')) err(`${label}: "$" non bilanciato in «${text.slice(0, 100)}»`);
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(rest)) err(`${label}: contiene undefined/NaN/[object Object] «${text.slice(0, 80)}»`);
}

function plot(p, label) {
  if (!p) return;
  if (!Array.isArray(p.fns) && !p.points) return err(`${label}.plot: servono fns o points`);
  for (const f of p.fns || []) {
    const src = typeof f === 'string' ? f : f.f;
    if (!parses(src)) err(`${label}.plot: funzione non valida "${src}"`);
  }
  if (p.x && !(Array.isArray(p.x) && p.x.length === 2 && p.x[0] < p.x[1])) err(`${label}.plot: x deve essere [min, max]`);
  if (p.y && !(Array.isArray(p.y) && p.y.length === 2 && p.y[0] < p.y[1])) err(`${label}.plot: y deve essere [min, max]`);
}

const EX_TYPES = ['mcq', 'tf', 'num', 'expr', 'interval', 'tuple', 'set', 'order', 'cloze', 'match', 'open', 'problem', 'gen'];

function exercise(ex, label, { inGen = false, inProblem = false } = {}) {
  if (!ex || typeof ex !== 'object') return err(`${label}: esercizio non valido`);
  if (!EX_TYPES.includes(ex.type)) return err(`${label}: tipo sconosciuto "${ex.type}"`);
  if (!inGen && !inProblem) regId(ex.id, label);
  const L = `${label}[${ex.id || ex.type}]`;
  if (ex.type === 'gen') {
    stats.generators++;
    if (typeof ex.gen !== 'function') return err(`${L}: gen deve essere una funzione (R) => esercizio`);
    for (let s = 1; s <= 40; s++) {
      let out;
      try {
        out = ex.gen(makeRng(s * 7919 + 13));
      } catch (e) {
        err(`${L}: il generatore lancia con seme ${s}: ${e.message}`);
        break;
      }
      const before = errors.length;
      exercise(out, `${L}#seed${s}`, { inGen: true });
      if (errors.length > before) break;
    }
    return;
  }
  if (ex.type !== 'problem') stats.exercises++;
  md(ex.prompt, `${L}.prompt`);
  md(ex.explain, `${L}.explain`);
  md(ex.hint, `${L}.hint`);
  plot(ex.plot, L);
  if (!ex.prompt && ex.type !== 'cloze') err(`${L}: manca prompt`);
  if (!ex.explain && !['open', 'problem'].includes(ex.type)) warn(`${L}: manca explain (spiegazione dopo la risposta)`);
  const selfCheck = (resp) => {
    const r = checkAnswer(ex, resp);
    if (!r.ok) err(`${L}: la risposta attesa non supera la correzione automatica (${JSON.stringify(resp).slice(0, 120)})`);
  };
  switch (ex.type) {
    case 'mcq':
      if (!Array.isArray(ex.options) || ex.options.length < 2) return err(`${L}: servono almeno 2 opzioni`);
      ex.options.forEach((o, i) => md(o, `${L}.options[${i}]`));
      if (Array.isArray(ex.answer)) {
        if (!ex.answer.length || !ex.answer.every((a) => Number.isInteger(a) && a >= 0 && a < ex.options.length)) err(`${L}: answer fuori range`);
      } else if (!Number.isInteger(ex.answer) || ex.answer < 0 || ex.answer >= ex.options.length) err(`${L}: answer deve essere un indice valido`);
      if (new Set(ex.options).size !== ex.options.length) err(`${L}: opzioni duplicate`);
      break;
    case 'tf':
      if (typeof ex.answer !== 'boolean') err(`${L}: answer deve essere true/false`);
      break;
    case 'num': {
      const v = evaluate(ex.answer);
      if (typeof v === 'number' && Number.isNaN(v)) err(`${L}: answer non valutabile "${ex.answer}"`);
      else selfCheck(String(ex.answer));
      break;
    }
    case 'expr':
      if (!parses(ex.answer)) err(`${L}: answer non valida "${ex.answer}"`);
      else selfCheck(String(ex.answer));
      break;
    case 'interval':
      if (!parseIntervals(ex.answer)) err(`${L}: answer intervallo non valida "${ex.answer}"`);
      else selfCheck(ex.answer);
      break;
    case 'tuple':
      if (!Array.isArray(ex.answer)) err(`${L}: answer deve essere un array`);
      else selfCheck(ex.answer.map(String));
      if (ex.labels && ex.labels.length !== ex.answer?.length) err(`${L}: labels e answer di lunghezza diversa`);
      break;
    case 'set':
      if (!Array.isArray(ex.answer) || !ex.answer.length) err(`${L}: answer deve essere un array non vuoto`);
      else selfCheck(ex.answer.map(String));
      break;
    case 'order':
      if (!Array.isArray(ex.steps) || ex.steps.length < 3) err(`${L}: servono almeno 3 passi`);
      (ex.steps || []).forEach((s, i) => md(s, `${L}.steps[${i}]`));
      (ex.distractors || []).forEach((s, i) => md(s, `${L}.distractors[${i}]`));
      break;
    case 'cloze':
      md(ex.text, `${L}.text`);
      if (!ex.text) err(`${L}: manca text`);
      if (!Array.isArray(ex.blanks) || !ex.blanks.length) err(`${L}: servono blanks`);
      (ex.blanks || []).forEach((b, i) => {
        if (!(ex.text || '').includes(`[[${i}]]`)) err(`${L}: manca il segnaposto [[${i}]] nel testo`);
        if (!Array.isArray(b.options) || b.options.length < 2) err(`${L}.blanks[${i}]: servono opzioni`);
        (b.options || []).forEach((o, j) => md(o, `${L}.blanks[${i}].options[${j}]`));
        if (!Number.isInteger(b.answer) || b.answer < 0 || b.answer >= (b.options || []).length) err(`${L}.blanks[${i}]: answer non valido`);
      });
      break;
    case 'match':
      if (!Array.isArray(ex.pairs) || ex.pairs.length < 2) err(`${L}: servono almeno 2 coppie`);
      (ex.pairs || []).forEach((p, i) => {
        if (!Array.isArray(p) || p.length !== 2) err(`${L}.pairs[${i}]: coppia non valida`);
        else {
          md(p[0], `${L}.pairs[${i}][0]`);
          md(p[1], `${L}.pairs[${i}][1]`);
        }
      });
      if (ex.pairs && new Set(ex.pairs.map((p) => p[1])).size !== ex.pairs.length) err(`${L}: lati destri duplicati`);
      break;
    case 'open':
      md(ex.answer, `${L}.answer`);
      if (!ex.answer) err(`${L}: manca la risposta modello (answer)`);
      if (!Array.isArray(ex.rubric) || !ex.rubric.length) err(`${L}: manca rubric (criteri di correzione)`);
      (ex.rubric || []).forEach((r, i) => md(r, `${L}.rubric[${i}]`));
      break;
    case 'problem':
      stats.problems++;
      md(ex.solution, `${L}.solution`);
      if (!ex.solution) err(`${L}: manca solution`);
      if (!Array.isArray(ex.parts) || !ex.parts.length) err(`${L}: servono parts`);
      (ex.parts || []).forEach((p, i) => exercise(p, `${L}.parts[${i}]`, { inProblem: true }));
      break;
  }
}

function card(c, label) {
  if (c.type === 'learn') {
    md(c.title, `${label}.title`);
    md(c.body, `${label}.body`);
    plot(c.plot, label);
    if (!c.body) err(`${label}: learn senza body`);
    return;
  }
  if (c.type === 'example') {
    md(c.title, `${label}.title`);
    md(c.problem, `${label}.problem`);
    plot(c.plot, label);
    if (!Array.isArray(c.steps) || !c.steps.length) err(`${label}: example senza steps`);
    (c.steps || []).forEach((s, i) => {
      if (typeof s === 'string') md(s, `${label}.steps[${i}]`);
      else {
        md(s.text, `${label}.steps[${i}].text`);
        if (s.ask) exercise(s.ask, `${label}.steps[${i}].ask`, { inProblem: true });
      }
    });
    md(c.result, `${label}.result`);
    return;
  }
  exercise(c, label);
}

function section(sec, file) {
  where = path.basename(file);
  stats.sections++;
  regId(sec.id, 'sezione');
  md(sec.title, 'title');
  md(sec.intro, 'intro');
  if (!Array.isArray(sec.skills) || !sec.skills.length) return err('sezione senza skills');
  for (const sk of sec.skills) {
    where = `${path.basename(file)} › ${sk.id}`;
    stats.skills++;
    regId(sk.id, 'skill');
    if (!sk.title) err('skill senza title');
    md(sk.summary, 'summary');
    if (!Array.isArray(sk.lessons) || !sk.lessons.length) err('skill senza lessons');
    for (const le of sk.lessons || []) {
      stats.lessons++;
      regId(le.id, 'lezione');
      const cards = le.cards || [];
      if (cards.length < 6) warn(`lezione ${le.id}: poche card (${cards.length})`);
      const nEx = cards.filter((c) => !['learn', 'example'].includes(c.type)).length;
      if (nEx < 3) warn(`lezione ${le.id}: meno di 3 esercizi`);
      cards.forEach((c, i) => {
        stats.cards++;
        card(c, `${le.id}.cards[${i}]`);
      });
    }
    const prac = sk.practice || [];
    if (prac.length < 6) warn(`practice con soli ${prac.length} elementi`);
    prac.forEach((ex, i) => exercise(ex, `${sk.id}.practice[${i}]`));
    for (const fc of sk.flashcards || []) {
      stats.flashcards++;
      regId(fc.id, 'flashcard');
      md(fc.front, `${fc.id}.front`);
      md(fc.back, `${fc.id}.back`);
      if (!fc.front || !fc.back) err(`flashcard ${fc.id}: servono front e back`);
    }
  }
}

function exams(mod, file) {
  where = path.basename(file);
  for (const ex of mod.exams || []) {
    stats.exams++;
    where = `${path.basename(file)} › ${ex.id}`;
    regId(ex.id, 'esame');
    if (!ex.title) err('esame senza title');
    for (const part of ['A', 'B']) {
      if (!Array.isArray(ex[part]) || !ex[part].length) err(`parte ${part} vuota`);
      (ex[part] || []).forEach((q, i) => {
        exercise(q, `${ex.id}.${part}[${i}]`);
        if (typeof q.points !== 'number') warn(`${ex.id}.${part}[${i}]: manca points`);
      });
    }
  }
}

const prereqRefs = [];
const skillRefs = [];
for (const f of files) {
  where = path.basename(f);
  let mod;
  try {
    mod = (await import(pathToFileURL(path.resolve(f)).href)).default;
  } catch (e) {
    err(`import fallito: ${e.message}`);
    continue;
  }
  if (!mod) {
    err('manca export default');
    continue;
  }
  if (mod.exams) {
    exams(mod, f);
    for (const ex of mod.exams) for (const part of ['A', 'B']) for (const q of ex[part] || []) for (const s of q.skills || []) skillRefs.push([q.id, s, path.basename(f)]);
  } else {
    section(mod, f);
    for (const sk of mod.skills || []) for (const p of sk.prereq || []) prereqRefs.push([sk.id, p, path.basename(f)]);
  }
}
if (allFilesMode) {
  for (const [sk, p, f] of prereqRefs) if (!ids.has(p)) warnings.push(`${f} › ${sk}: prereq sconosciuto "${p}"`);
  for (const [q, s, f] of skillRefs) if (!ids.has(s)) warnings.push(`${f} › ${q}: skill sconosciuta "${s}"`);
}

console.log('Statistiche:', JSON.stringify(stats));
if (warnings.length && !quiet) {
  console.log(`\n${warnings.length} avvisi:`);
  warnings.slice(0, 80).forEach((w) => console.log('  ⚠ ' + w));
  if (warnings.length > 80) console.log(`  … altri ${warnings.length - 80}`);
}
if (errors.length) {
  console.log(`\n${errors.length} ERRORI:`);
  errors.slice(0, 150).forEach((e) => console.log('  ✗ ' + e));
  if (errors.length > 150) console.log(`  … altri ${errors.length - 150}`);
  process.exit(1);
}
console.log('\n✓ Contenuti validi');
