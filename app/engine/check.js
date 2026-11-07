// Correzione automatica delle risposte. Isomorfo: funziona nel browser (math.js globale)
// e in Node (validatore dei contenuti), purché si chiami initMath(math) prima dell'uso.

let M = null;
export function initMath(mathInstance) {
  M = mathInstance;
}
export function getMath() {
  return M;
}

const FUNCS = ['sqrt', 'sin', 'cos', 'tan', 'cot', 'log', 'exp', 'atan', 'asin', 'acos', 'sinh', 'cosh', 'tanh', 'abs', 'log10', 'log2', 'sign', 'nthRoot', 'cbrt'];
const FN_RE = FUNCS.join('|');

/**
 * Converte ciò che scrive lo studente (notazione "da quaderno") in una stringa math.js.
 * Esempi: "e^x(x^2+5x+6)" -> "e^x*(x^2+5x+6)", "ln(1+x)" -> "log(1+x)", "sen2x" -> "sin(2x)",
 * "√3/2" -> "sqrt(3)/2", "1,5" -> "1.5", "|x|" -> "abs(x)", "∞" -> "Infinity".
 */
export function normalize(input) {
  if (input == null) return '';
  let s = String(input).trim();
  if (!s) return '';
  s = s
    .replace(/[−–—]/g, '-')
    .replace(/[·×⋅]/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/∞/g, 'inf')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/\*\*/g, '^')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/√\s*\(/g, 'sqrt(')
    .replace(/√\s*([a-z0-9.]+)/gi, 'sqrt($1)')
    .replace(/∛\s*\(/g, 'cbrt(')
    .replace(/\barc\s*tan\b|\barctg\b|\barctan\b/gi, 'atan')
    .replace(/\barcsin\b|\barcsen\b/gi, 'asin')
    .replace(/\barccos\b/gi, 'acos')
    .replace(/\bsenh\b|\bsh\b/gi, 'sinh')
    .replace(/\bcosh\b|\bch\b/gi, 'cosh')
    .replace(/(?<![a-z])ln(?![a-z])/gi, 'log')
    .replace(/(?<![a-z])tg(?![a-z])/gi, 'tan')
    .replace(/(?<![a-z])sen(?![a-z])/gi, 'sin')
    .replace(/\binfinito\b/gi, 'inf')
    .replace(/\bInfinity\b/g, 'inf');
  // ln, sen, tg attaccati all'argomento: "lnx", "senx"
  s = s.replace(/(?<![a-z])ln(?=[a-z0-9(])/gi, 'log').replace(/(?<![a-z])sen(?=[a-z0-9(])/gi, 'sin').replace(/(?<![a-z])tg(?=[a-z0-9(])/gi, 'tan');
  // valore assoluto |...| (non annidato)
  for (let i = 0; i < 3 && /\|[^|]+\|/.test(s); i++) s = s.replace(/\|([^|]+)\|/g, 'abs($1)');
  // funzione seguita da argomento senza parentesi: "sin x", "sin2x", "log x"
  s = s.replace(new RegExp(`(?<![a-z])(${FN_RE})\\s*([a-z0-9.]+(?:\\^[a-z0-9.]+)?)(?![\\w(])`, 'gi'), (m, f, a) => `${f}(${a})`);
  // moltiplicazione implicita prima di "(" per variabili/costanti (non per funzioni)
  s = s.replace(/\b([a-z]|pi)\s*\(/gi, (m, v) => (FUNCS.includes(v.toLowerCase()) ? m : `${v}*(`));
  s = s.replace(/\)\s*\(/g, ')*(');
  // infinito
  s = s.replace(/\binf\b/gi, 'Infinity');
  return s;
}

function isComplexObj(v) {
  return v && typeof v === 'object' && typeof v.re === 'number' && typeof v.im === 'number';
}

/** Valuta un'espressione (stringa studente o risposta attesa). Ritorna numero, Complex o NaN. */
export function evaluate(expr, scope = {}) {
  if (typeof expr === 'number') return expr;
  const s = normalize(expr);
  if (!s) return NaN;
  try {
    const v = M.evaluate(s, { ...scope });
    if (typeof v === 'number') return v;
    if (isComplexObj(v)) return Math.abs(v.im) < 1e-12 ? v.re : v;
    if (v && typeof v.valueOf === 'function' && typeof v.valueOf() === 'number') return v.valueOf();
    return NaN;
  } catch (e) {
    return NaN;
  }
}

export function compile(expr) {
  const s = normalize(expr);
  const node = M.compile(s);
  return (scope) => {
    try {
      const v = node.evaluate({ ...scope });
      if (typeof v === 'number') return v;
      if (isComplexObj(v)) return Math.abs(v.im) < 1e-9 ? v.re : NaN;
      return NaN;
    } catch (e) {
      return NaN;
    }
  };
}

/** L'espressione è sintatticamente valida? */
export function parses(expr) {
  try {
    M.parse(normalize(expr));
    return true;
  } catch (e) {
    return false;
  }
}

export function toTex(expr) {
  try {
    return M.parse(normalize(expr)).toTex({ parenthesis: 'auto', implicit: 'hide' });
  } catch (e) {
    return null;
  }
}

function close(a, b, tol = 1e-6) {
  if (a === b) return true;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
}

function closeC(a, b, tol = 1e-6) {
  const ar = typeof a === 'number' ? a : a.re;
  const ai = typeof a === 'number' ? 0 : a.im;
  const br = typeof b === 'number' ? b : b.re;
  const bi = typeof b === 'number' ? 0 : b.im;
  if (![ar, ai, br, bi].every(Number.isFinite)) return ar === br && ai === bi;
  return Math.hypot(ar - br, ai - bi) <= tol * Math.max(1, Math.hypot(ar, ai), Math.hypot(br, bi));
}

/** Equivalenza numerica di espressioni in una o più variabili, campionando punti. */
export function exprEquivalent(user, expected, opts = {}) {
  const vars = opts.vars || ['x'];
  const domain = opts.domain || [0.3, 2.7];
  const domains = opts.domains || {};
  let fu, fe;
  try {
    fu = compile(user);
    fe = compile(expected);
  } catch (e) {
    return { ok: false, feedback: 'Espressione non valida: controlla parentesi e simboli.' };
  }
  let valid = 0;
  let offset = null;
  const N = 16;
  for (let k = 0; k < N; k++) {
    const scope = {};
    vars.forEach((v, j) => {
      const [a, b] = domains[v] || domain;
      // punti pseudo-casuali ma deterministici, evitando valori "tondi"
      const t = ((k * 0.61803398875 + j * 0.41421356) % 1) * 0.9 + 0.05;
      scope[v] = a + (b - a) * t;
    });
    const e = fe(scope);
    if (!Number.isFinite(e)) continue;
    const u = fu(scope);
    if (!Number.isFinite(u)) return { ok: false };
    valid++;
    if (opts.upToConstant) {
      const d = u - e;
      if (offset === null) offset = d;
      else if (!close(d, offset, 1e-5)) return { ok: false };
    } else if (!close(u, e, opts.tol || 1e-6)) {
      return { ok: false };
    }
  }
  if (valid < 4) return { ok: false, feedback: 'Non riesco a verificare questa espressione.' };
  return { ok: true };
}

// ---------- Intervalli ----------

/**
 * Parsing di unioni di intervalli: "(-inf,3/2)U(3/2,+inf)", "[1,5)", "R", "vuoto", "{2}".
 * Ritorna un array di {a, b, ca, cb} (ca/cb = estremo chiuso) ordinato e fuso, oppure null.
 */
export function parseIntervals(str) {
  if (str == null) return null;
  const s = String(str).trim().replace(/\s+/g, '').replace(/∪/g, 'U').replace(/−/g, '-').replace(/∞/g, 'inf');
  if (/^(R|ℝ|\(-inf,\+?inf\))$/i.test(s)) return [{ a: -Infinity, b: Infinity, ca: false, cb: false }];
  if (/^(vuoto|∅|\{\}|nessuno)$/i.test(s)) return [];
  const parts = s.split(/U|u(?![a-z])/);
  const out = [];
  for (const p of parts) {
    let m = p.match(/^([\[(\]])(.+),(.+)([\])\[])$/);
    if (m) {
      const a = evaluate(m[2].replace(/^\+/, ''));
      const b = evaluate(m[3].replace(/^\+/, ''));
      if (typeof a !== 'number' || typeof b !== 'number' || Number.isNaN(a) || Number.isNaN(b)) return null;
      out.push({ a, b, ca: m[1] === '[' && Number.isFinite(a), cb: m[4] === ']' && Number.isFinite(b) });
      continue;
    }
    m = p.match(/^\{(.+)\}$/);
    if (m) {
      for (const q of m[1].split(';')) {
        const v = evaluate(q);
        if (typeof v !== 'number' || !Number.isFinite(v)) return null;
        out.push({ a: v, b: v, ca: true, cb: true });
      }
      continue;
    }
    return null;
  }
  out.sort((x, y) => x.a - y.a || (x.ca === y.ca ? 0 : x.ca ? -1 : 1));
  const merged = [];
  for (const it of out) {
    const last = merged[merged.length - 1];
    if (last && (it.a < last.b || (close(it.a, last.b) && (it.ca || last.cb)))) {
      if (it.b > last.b || (close(it.b, last.b) && it.cb)) {
        last.b = it.b;
        last.cb = it.cb;
      }
    } else merged.push({ ...it });
  }
  return merged;
}

function intervalsEqual(A, B) {
  if (!A || !B || A.length !== B.length) return false;
  return A.every((x, i) => close(x.a, B[i].a) && close(x.b, B[i].b) && x.ca === B[i].ca && x.cb === B[i].cb);
}

// ---------- Correzione per tipo ----------

/**
 * Corregge una risposta. Ritorna { ok, score (0..1), feedback? }.
 * I formati di `response` per tipo sono documentati in docs/CONTENT_SCHEMA.md.
 */
export function checkAnswer(ex, response) {
  switch (ex.type) {
    case 'mcq': {
      if (Array.isArray(ex.answer)) {
        const want = [...ex.answer].sort().join(',');
        const got = [...(response || [])].sort().join(',');
        return { ok: want === got, score: want === got ? 1 : 0 };
      }
      return { ok: response === ex.answer, score: response === ex.answer ? 1 : 0 };
    }
    case 'tf':
      return { ok: response === ex.answer, score: response === ex.answer ? 1 : 0 };
    case 'num': {
      const answers = [ex.answer, ...(ex.alt || [])];
      const u = evaluate(response);
      if (typeof u === 'number' && Number.isNaN(u)) return { ok: false, score: 0, feedback: "Scrivi un numero o un'espressione numerica valida (es. 3/4, sqrt(2)/2, 2*log(2))." };
      for (const a of answers) {
        const e = evaluate(a);
        if (closeC(u, e, ex.tol || 1e-6)) return { ok: true, score: 1 };
      }
      return { ok: false, score: 0 };
    }
    case 'expr': {
      if (!parses(response)) return { ok: false, score: 0, feedback: 'Espressione non valida: controlla parentesi e simboli.' };
      const answers = [ex.answer, ...(ex.alt || [])];
      for (const a of answers) {
        const r = exprEquivalent(response, a, { vars: ex.vars, domain: ex.domain, domains: ex.domains, upToConstant: ex.upToConstant });
        if (r.ok) return { ok: true, score: 1 };
      }
      return { ok: false, score: 0 };
    }
    case 'interval': {
      const u = parseIntervals(response);
      if (!u) return { ok: false, score: 0, feedback: "Formato: (a,b), [a,b], unioni con U, es. (-inf,1)U[2,+inf). Usa R per tutto ℝ e vuoto per l'insieme vuoto." };
      const e = parseIntervals(ex.answer);
      const ok = intervalsEqual(u, e);
      return { ok, score: ok ? 1 : 0 };
    }
    case 'tuple': {
      const resp = response || [];
      const vals = resp.map((r) => evaluate(r));
      const want = ex.answer.map((a) => evaluate(a));
      if (vals.length !== want.length || vals.some((v) => typeof v !== 'number' || Number.isNaN(v))) return { ok: false, score: 0, feedback: 'Compila tutte le componenti con numeri o espressioni numeriche.' };
      if (ex.proportional) {
        const k = want.findIndex((w) => Math.abs(w) > 1e-12);
        if (Math.abs(vals[k]) < 1e-12) return { ok: false, score: 0 };
        const ratio = vals[k] / want[k];
        const ok = want.every((w, i) => close(vals[i], w * ratio));
        return { ok, score: ok ? 1 : 0 };
      }
      const okEach = want.map((w, i) => close(vals[i], w));
      const ok = okEach.every(Boolean);
      return { ok, score: okEach.filter(Boolean).length / want.length };
    }
    case 'set': {
      const raw = Array.isArray(response) ? response : String(response || '').split(';');
      const items = raw.map((x) => String(x).trim()).filter(Boolean).map((x) => evaluate(x));
      const want = ex.answer.map((a) => evaluate(a));
      if (items.some((v) => typeof v === 'number' && Number.isNaN(v))) return { ok: false, score: 0, feedback: "Separa le soluzioni con \";\" e usa i per l'unità immaginaria (es. 1+2i; -i)." };
      const used = new Array(items.length).fill(false);
      let hit = 0;
      for (const w of want) {
        const j = items.findIndex((v, idx) => !used[idx] && closeC(v, w, 1e-6));
        if (j >= 0) {
          used[j] = true;
          hit++;
        }
      }
      const ok = hit === want.length && items.length === want.length;
      return {
        ok,
        score: ok ? 1 : hit / Math.max(want.length, items.length, 1),
        feedback: ok ? undefined : items.length !== want.length ? `Le soluzioni attese sono ${want.length}, ne hai scritte ${items.length}.` : undefined,
      };
    }
    case 'order': {
      const resp = response || [];
      const n = ex.steps.length;
      const ok = resp.length === n && resp.every((v, i) => v === i);
      let correctPos = 0;
      resp.forEach((v, i) => {
        if (v === i) correctPos++;
      });
      return { ok, score: ok ? 1 : correctPos / n };
    }
    case 'cloze': {
      const resp = response || [];
      const okEach = ex.blanks.map((b, i) => resp[i] === b.answer);
      const ok = okEach.every(Boolean);
      return { ok, score: okEach.filter(Boolean).length / ex.blanks.length };
    }
    case 'match': {
      const resp = response || [];
      const okEach = ex.pairs.map((p, i) => resp[i] === i);
      const ok = okEach.every(Boolean);
      return { ok, score: okEach.filter(Boolean).length / ex.pairs.length };
    }
    case 'open': {
      const score = typeof response?.score === 'number' ? response.score : 0;
      return { ok: score >= 0.7, score };
    }
    default:
      return { ok: false, score: 0 };
  }
}

/** Mostra la risposta attesa in forma leggibile (LaTeX quando possibile) */
export function answerTex(ex) {
  const t = (s) => toTex(String(s)) || String(s);
  switch (ex.type) {
    case 'num':
    case 'expr':
      return ex.answerTex || t(ex.answer);
    case 'tuple':
      return ex.answerTex || '(' + ex.answer.map(t).join(',\\;') + ')';
    case 'set':
      return ex.answerTex || ex.answer.map(t).join(';\\quad ');
    case 'interval':
      return ex.answerTex || String(ex.answer).replace(/\+?inf/g, (m) => (m[0] === '+' ? '+\\infty' : '\\infty')).replace(/U/g, '\\cup ');
    default:
      return ex.answerTex || '';
  }
}
