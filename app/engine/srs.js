// Ripetizione dilazionata con FSRS-4.5 (Free Spaced Repetition Scheduler, J. Ye 2022-2024).
// Modello DSR: Difficoltà D, Stabilità S (giorni), Recuperabilità R(t) = (1 + F·t/S)^(-1/2).
// Ref: Ye, Su, Cao (2022) "A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition
// Scheduling", KDD '22; parametri di default di FSRS-4.5 (open-spaced-repetition/fsrs4anki).

const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const DECAY = -0.5;
const FACTOR = 19 / 81; // così che R(S) = 0.9
export const TARGET_RETENTION = 0.9;
const DAY = 86400000;

export const GRADE = { AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 };

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const round = (x) => Math.round(x * 1000) / 1000;

export function retrievability(elapsedDays, S) {
  if (!S) return 0;
  return Math.pow(1 + (FACTOR * elapsedDays) / S, DECAY);
}

export function intervalFor(S, r = TARGET_RETENTION) {
  const I = (S / FACTOR) * (Math.pow(r, 1 / DECAY) - 1);
  return clamp(Math.round(I), 1, 365);
}

const initD = (g) => clamp(W[4] - (g - 3) * W[5], 1, 10);
const initS = (g) => Math.max(0.1, W[g - 1]);

function nextD(D, g) {
  const d = D - W[6] * (g - 3);
  return clamp(W[7] * initD(4) + (1 - W[7]) * d, 1, 10);
}

function recallS(D, S, R, g) {
  const hard = g === 2 ? W[15] : 1;
  const easy = g === 4 ? W[16] : 1;
  return S * (1 + Math.exp(W[8]) * (11 - D) * Math.pow(S, -W[9]) * (Math.exp(W[10] * (1 - R)) - 1) * hard * easy);
}

function forgetS(D, S, R) {
  return Math.min(S, W[11] * Math.pow(D, -W[12]) * (Math.pow(S + 1, W[13]) - 1) * Math.exp(W[14] * (1 - R)));
}

/**
 * Aggiorna lo stato di un elemento dopo una risposta.
 * card = { d: difficoltà, s: stabilità (giorni), due: ms, last: ms, n: ripetizioni, l: lapsus } oppure null.
 */
export function review(card, grade, now = Date.now()) {
  if (!card || !card.last) {
    const s = initS(grade);
    const d = initD(grade);
    const days = grade === 1 ? 0.007 : intervalFor(s); // ~10 minuti se sbagliato
    return { d: round(d), s: round(s), due: now + days * DAY, last: now, n: 1, l: grade === 1 ? 1 : 0 };
  }
  const elapsed = Math.max(0, (now - card.last) / DAY);
  const R = retrievability(elapsed, card.s);
  const d = nextD(card.d, grade);
  let s;
  if (grade === 1) s = forgetS(card.d, card.s, R);
  else if (elapsed < 0.5) s = card.s * (grade >= 3 ? 1.1 : 1); // stesso giorno: guadagno minimo
  else s = recallS(card.d, card.s, R, grade);
  s = Math.max(0.1, s);
  const days = grade === 1 ? 0.007 : intervalFor(s);
  return { d: round(d), s: round(s), due: now + days * DAY, last: now, n: (card.n || 0) + 1, l: (card.l || 0) + (grade === 1 ? 1 : 0) };
}

/** Voto automatico da correttezza, tempo e aiuti (per esercizi auto-corretti). */
export function autoGrade({ ok, score = ok ? 1 : 0, ms = 0, hinted = false, expectedMs = 30000 }) {
  if (!ok) return score >= 0.5 ? GRADE.HARD : GRADE.AGAIN;
  if (hinted) return GRADE.HARD;
  if (ms && ms < expectedMs * 0.4) return GRADE.EASY;
  if (ms && ms > expectedMs * 3) return GRADE.HARD;
  return GRADE.GOOD;
}

export function isDue(card, now = Date.now()) {
  return !!card && card.due <= now;
}

export function currentR(card, now = Date.now()) {
  if (!card || !card.last) return 0;
  return retrievability((now - card.last) / DAY, card.s);
}
