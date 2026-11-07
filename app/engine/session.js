// Costruzione delle sessioni: lezione, ripasso interfogliato, pratica di una skill, teoria, test di salto.
import { makeRng } from './rng.js';
import { getItem, getSkill } from './state.js';
import { isUnlocked, lessonsDone } from './course.js';

const THEORY = new Set(['learn', 'example']);

/** Istanzia un esercizio: i generatori producono una variante nuova con un seme. */
export function instantiate(ex, seed = Math.floor(Math.random() * 2 ** 31)) {
  if (ex.type !== 'gen') return ex;
  try {
    const out = ex.gen(makeRng(seed));
    return { level: ex.level, source: ex.source, ...out, id: ex.id, _seed: seed };
  } catch (e) {
    console.warn('generatore fallito', ex.id, e);
    return null;
  }
}

/** Card di una lezione, con le istanze dei generatori. */
export function lessonCards(lesson) {
  return (lesson.cards || []).map((c) => (THEORY.has(c.type) ? c : instantiate(c))).filter(Boolean);
}

/** Interfoglia per skill (round-robin): evita blocchi dello stesso argomento (Rohrer & Taylor 2007). */
function interleave(list) {
  const by = new Map();
  for (const it of list) {
    if (!by.has(it.skillId)) by.set(it.skillId, []);
    by.get(it.skillId).push(it);
  }
  const queues = [...by.values()];
  const out = [];
  while (queues.some((q) => q.length)) for (const q of queues) if (q.length) out.push(q.shift());
  return out;
}

/**
 * Ripasso: prima gli item scaduti (FSRS), ordinati per scadenza, interfogliati tra skill;
 * poi, se c'è spazio, item nuovi dalla pratica delle skill già iniziate (padronanza più bassa prima).
 */
export function reviewQueue(course, state, n = 12, now = Date.now()) {
  const due = [];
  for (const [id, it] of course.items) {
    if (it.kind === 'flash' || it.kind === 'exam') continue;
    const c = getItem(state, id);
    if (c && c.due <= now) due.push({ id, skillId: it.skillId, due: c.due, ex: it.ex });
  }
  due.sort((a, b) => a.due - b.due);
  let picked = interleave(due.slice(0, n * 2)).slice(0, n);
  if (picked.length < n) {
    const started = [...course.skills.keys()].filter((id) => lessonsDone(state, id) > 0);
    started.sort((a, b) => (getSkill(state, a)?.p || 0) - (getSkill(state, b)?.p || 0));
    const fresh = [];
    for (const sid of started) {
      const sk = course.skills.get(sid);
      for (const ex of sk.practice || []) if (!getItem(state, ex.id)) fresh.push({ id: ex.id, skillId: sid, ex });
    }
    picked = picked.concat(interleave(fresh).slice(0, n - picked.length));
  }
  if (picked.length < Math.min(n, 6)) {
    // nessun ripasso urgente: pratica sulle skill più deboli tra quelle iniziate (anche già viste)
    const started = [...course.skills.keys()].filter((id) => lessonsDone(state, id) > 0);
    started.sort((a, b) => (getSkill(state, a)?.p || 0) - (getSkill(state, b)?.p || 0));
    const have = new Set(picked.map((p) => p.id));
    for (const sid of started.slice(0, 4)) {
      const sk = course.skills.get(sid);
      for (const ex of shuffle(sk.practice || []).slice(0, 3)) if (!have.has(ex.id)) picked.push({ id: ex.id, skillId: sid, ex });
    }
    picked = interleave(picked).slice(0, n);
  }
  return picked.map((p) => ({ ...instantiate(p.ex), _skill: p.skillId })).filter((x) => x && x.type);
}

/** Pratica mirata su una skill: scaduti, poi mai visti, poi i più fragili. */
export function skillPracticeQueue(course, state, skillId, n = 10, now = Date.now()) {
  const sk = course.skills.get(skillId);
  const pool = [...(sk.practice || [])];
  for (const le of sk.lessons || []) for (const c of le.cards || []) if (!THEORY.has(c.type) && c.id) pool.push(c);
  const scored = pool.map((ex) => {
    const c = getItem(state, ex.id);
    const pri = !c ? 1 : c.due <= now ? 0 : 2 + c.s;
    return { ex, pri: pri + Math.random() * 0.5 };
  });
  scored.sort((a, b) => a.pri - b.pri);
  return scored.slice(0, n).map((s) => ({ ...instantiate(s.ex), _skill: skillId })).filter((x) => x && x.type);
}

/** Flashcard di teoria: scadute prima, poi nuove (delle skill sbloccate), filtrabili per tipo. */
export function flashQueue(course, state, { n = 20, kinds = null, sectionId = null, onlyDue = false } = {}, now = Date.now()) {
  const due = [];
  const fresh = [];
  for (const [id, it] of course.items) {
    if (it.kind !== 'flash') continue;
    if (kinds && !kinds.includes(it.ex.kind)) continue;
    if (sectionId && course.sectionOf.get(it.skillId)?.id !== sectionId) continue;
    const c = getItem(state, id);
    if (c) {
      if (c.due <= now) due.push({ ...it.ex, _skill: it.skillId, _due: c.due });
    } else if (!onlyDue && (sectionId || isUnlocked(course, state, it.skillId))) fresh.push({ ...it.ex, _skill: it.skillId });
  }
  due.sort((a, b) => a._due - b._due);
  return due.concat(fresh).slice(0, n);
}

/** Test per saltare una sezione: domande di livello medio-alto dalla sezione e dalle precedenti. */
export function testOutQueue(course, sectionId, n = 12) {
  const secIdx = course.sections.findIndex((s) => s.id === sectionId);
  const pool = [];
  course.sections.forEach((sec, i) => {
    if (i > secIdx || i < secIdx - 1) return;
    for (const sk of sec.skills || []) {
      for (const ex of sk.practice || []) if (ex.type !== 'open' && (ex.level || 2) >= 2) pool.push({ ex, skillId: sk.id, w: i === secIdx ? 3 : 1 });
    }
  });
  const weighted = pool.flatMap((p) => Array(p.w).fill(p));
  const chosen = [];
  const seen = new Set();
  for (const p of shuffle(weighted)) {
    if (seen.has(p.ex.id)) continue;
    seen.add(p.ex.id);
    chosen.push(p);
    if (chosen.length >= n) break;
  }
  return interleave(chosen.map((c) => ({ ...c, id: c.ex.id }))).map((c) => ({ ...instantiate(c.ex), _skill: c.skillId })).filter((x) => x && x.type);
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
