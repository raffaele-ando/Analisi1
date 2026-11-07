// Indice del corso: percorso, skill, item SRS, sblocchi e stima di preparazione.
import { getItem, getSkill } from './state.js';
import { currentR } from './srs.js';
import { crownLevel, MASTERY_THRESHOLD } from './mastery.js';

// Peso di ogni sezione all'esame (frequenza × punti nei temi 2025/26, vedi docs/ESERCIZI_ESAME.md).
export const EXAM_WEIGHT = {
  s00: 0.6, s01: 1, s02: 3, s03: 1.2, s04: 2, s05: 2, s06: 2.2, s07: 2, s08: 4,
  s09: 5.5, s10: 3, s11: 3, s12: 3.2, s13: 3.8, s14: 1.2, s15: 4.5,
};

const THEORY = new Set(['learn', 'example']);

export function buildCourse({ sections, exams }) {
  const skills = new Map();
  const items = new Map(); // id -> { ex, skillId, kind: 'lesson'|'practice'|'flash'|'exam' }
  const path = [];
  const sectionOf = new Map();
  for (const sec of sections) {
    for (const sk of sec.skills || []) {
      skills.set(sk.id, sk);
      sectionOf.set(sk.id, sec);
      path.push(sk.id);
      for (const le of sk.lessons || []) {
        for (const c of le.cards || []) if (!THEORY.has(c.type) && c.id) items.set(c.id, { ex: c, skillId: sk.id, kind: 'lesson' });
      }
      for (const ex of sk.practice || []) if (ex.id) items.set(ex.id, { ex, skillId: sk.id, kind: 'practice' });
      for (const fc of sk.flashcards || []) items.set(fc.id, { ex: { ...fc, type: 'flash' }, skillId: sk.id, kind: 'flash' });
    }
  }
  for (const exam of exams) {
    for (const part of ['A', 'B']) {
      for (const q of exam[part] || []) items.set(q.id, { ex: q, skillId: (q.skills || [])[0] || null, kind: 'exam', exam, part });
    }
  }
  return { sections, exams, skills, items, path, sectionOf };
}

export function lessonsDone(state, skillId) {
  return (getSkill(state, skillId)?.done || []).length;
}

export function skillComplete(course, state, skillId) {
  const sk = course.skills.get(skillId);
  if (!sk) return false;
  const done = new Set(getSkill(state, skillId)?.done || []);
  return (sk.lessons || []).every((l) => done.has(l.id));
}

export function isUnlocked(course, state, skillId) {
  if (state.profile?.freeMode) return true;
  const idx = course.path.indexOf(skillId);
  if (idx <= 0) return true;
  // un test superato sulla sezione S dichiara noto tutto fino a S (e apre S+1)
  const secIdx = course.sections.findIndex((s) => s.id === course.sectionOf.get(skillId).id);
  const maxTested = Math.max(-1, ...Object.keys(state.tested || {}).map((id) => course.sections.findIndex((s) => s.id === id)));
  if (secIdx <= maxTested + 1) return true;
  if (lessonsDone(state, skillId) > 0) return true;
  return skillComplete(course, state, course.path[idx - 1]);
}

/** Prima skill sbloccata e non completata: il "INIZIA" del percorso */
export function currentSkill(course, state) {
  for (const id of course.path) {
    if (!isUnlocked(course, state, id)) return id;
    if (!skillComplete(course, state, id)) return id;
  }
  return course.path[course.path.length - 1];
}

/** Prossima lezione non fatta di una skill (o null) */
export function nextLesson(course, state, skillId) {
  const sk = course.skills.get(skillId);
  const done = new Set(getSkill(state, skillId)?.done || []);
  return (sk?.lessons || []).find((l) => !done.has(l.id)) || null;
}

/** Padronanza effettiva: BKT moderata dall'oblio (recuperabilità media degli item visti). */
export function effectiveMastery(course, state, skillId, now = Date.now()) {
  const s = getSkill(state, skillId);
  if (!s) return 0;
  let sum = 0;
  let n = 0;
  for (const [id, it] of course.items) {
    if (it.skillId !== skillId || it.kind === 'exam') continue;
    const c = getItem(state, id);
    if (!c) continue;
    sum += currentR(c, now);
    n++;
  }
  const r = n ? sum / n : 1;
  return Math.max(0, Math.min(1, s.p * (0.55 + 0.45 * r)));
}

export function crowns(course, state, skillId) {
  const sk = course.skills.get(skillId);
  const s = getSkill(state, skillId);
  return crownLevel(s?.p || 0, (s?.done || []).length, (sk?.lessons || []).length);
}

/** Preparazione all'esame 0..1 e voto stimato in trentesimi. */
export function readiness(course, state) {
  let num = 0;
  let den = 0;
  const bySection = {};
  for (const sec of course.sections) {
    const ids = (sec.skills || []).map((s) => s.id);
    const m = ids.length ? ids.reduce((a, id) => a + effectiveMastery(course, state, id), 0) / ids.length : 0;
    bySection[sec.id] = m;
    const w = EXAM_WEIGHT[sec.id] ?? 1;
    num += w * m;
    den += w;
  }
  const r = den ? num / den : 0;
  // simulazioni d'esame recenti pesano sulla stima
  const sims = Object.values(state.exams || {}).filter((e) => e.done).sort((a, b) => b.t - a.t).slice(0, 3);
  let est = r * 32;
  if (sims.length) {
    const avg = sims.reduce((a, e) => a + (e.score / e.max) * 32, 0) / sims.length;
    est = 0.5 * est + 0.5 * avg;
  }
  return { r, bySection, grade: Math.round(est * 10) / 10 };
}

export function gradeLabel(g) {
  if (g >= 31) return '30 e lode';
  if (g >= 18) return String(Math.min(30, Math.round(g)));
  return 'insufficiente';
}

export function dueCount(course, state, now = Date.now()) {
  let n = 0;
  for (const [id, it] of course.items) {
    if (it.kind === 'flash' || it.kind === 'exam') continue;
    const c = getItem(state, id);
    if (c && c.due <= now) n++;
  }
  return n;
}

export function flashDueCount(course, state, now = Date.now()) {
  let n = 0;
  for (const [id, it] of course.items) {
    if (it.kind !== 'flash') continue;
    const c = getItem(state, id);
    if (c && c.due <= now) n++;
  }
  return n;
}

export { MASTERY_THRESHOLD };
