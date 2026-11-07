// Stima della padronanza per skill con Bayesian Knowledge Tracing
// (Corbett & Anderson, 1995, "Knowledge tracing: Modeling the acquisition of procedural knowledge").
// p = P(la skill è padroneggiata). Dopo ogni risposta si aggiorna con Bayes, poi si applica
// la probabilità di apprendimento T. La probabilità di indovinare dipende dal tipo di esercizio.

const P_INIT = 0.1;
const P_LEARN = 0.12;
const P_SLIP = 0.1;

const GUESS = {
  tf: 0.5,
  mcq: 0.25,
  match: 0.1,
  cloze: 0.2,
  order: 0.05,
  num: 0.03,
  expr: 0.03,
  interval: 0.05,
  tuple: 0.03,
  set: 0.03,
  open: 0.1,
  flash: 0.2,
};

export const MASTERY_THRESHOLD = 0.85;

export function initialMastery() {
  return P_INIT;
}

export function updateMastery(p = P_INIT, correct, type = 'mcq', level = 2) {
  const g = GUESS[type] ?? 0.2;
  const s = level >= 3 ? P_SLIP * 0.7 : P_SLIP;
  const post = correct ? (p * (1 - s)) / (p * (1 - s) + (1 - p) * g) : (p * s) / (p * s + (1 - p) * (1 - g));
  const learnRate = level >= 3 ? P_LEARN * 1.3 : P_LEARN;
  const next = post + (1 - post) * learnRate * (correct ? 1 : 0.5);
  return Math.round(Math.min(0.999, Math.max(0.001, next)) * 1000) / 1000;
}

/** Corone (livelli 0–5) in stile Duolingo, derivate da padronanza e lezioni completate. */
export function crownLevel(p, lessonsDone, lessonsTotal) {
  if (!lessonsDone) return 0;
  const frac = lessonsTotal ? lessonsDone / lessonsTotal : 0;
  if (frac < 1) return 1;
  if (p < 0.6) return 2;
  if (p < 0.75) return 3;
  if (p < MASTERY_THRESHOLD) return 4;
  return 5;
}
