// Helper per scrivere LaTeX e stringhe math.js nei generatori di esercizi.
// Convenzione: frac/poly/... producono LaTeX da mettere tra $...$;
// quelle che finiscono per "Str" producono espressioni per math.js (usate come risposta attesa).

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

/** Riduce p/q ai minimi termini con denominatore positivo: [p, q] */
export function reduce(p, q) {
  if (q === 0) throw new Error('denominatore nullo');
  const g = gcd(p, q);
  p /= g;
  q /= g;
  if (q < 0) {
    p = -p;
    q = -q;
  }
  return [p, q];
}

/** LaTeX di p/q ridotta: "3", "-\\frac{1}{2}" */
export function frac(p, q = 1) {
  const [a, b] = reduce(p, q);
  if (b === 1) return String(a);
  return (a < 0 ? '-' : '') + `\\frac{${Math.abs(a)}}{${b}}`;
}

/** Stringa math.js di p/q ridotta: "3", "-1/2" */
export function fracStr(p, q = 1) {
  const [a, b] = reduce(p, q);
  return b === 1 ? String(a) : `${a}/${b}`;
}

/** Coefficiente davanti a una variabile: 1 -> "", -1 -> "-", 3 -> "3" */
export function coef(c) {
  if (c === 1) return '';
  if (c === -1) return '-';
  return String(c);
}

/** Termine con segno per concatenare: 3 -> "+ 3", -2 -> "- 2" (varTex opzionale) */
export function signed(c, varTex = '') {
  if (varTex) {
    const abs = Math.abs(c) === 1 ? '' : String(Math.abs(c));
    return (c < 0 ? '- ' : '+ ') + abs + varTex;
  }
  return (c < 0 ? '- ' : '+ ') + Math.abs(c);
}

/**
 * Polinomio in LaTeX da coefficienti in ordine decrescente di grado.
 * poly([1, -3, 0, 2]) -> "x^{3} - 3x^{2} + 2"
 */
export function poly(coeffs, v = 'x') {
  const n = coeffs.length - 1;
  const parts = [];
  coeffs.forEach((c, i) => {
    if (c === 0) return;
    const e = n - i;
    const vv = e === 0 ? '' : e === 1 ? v : `${v}^{${e}}`;
    const abs = Math.abs(c);
    const body = e === 0 ? String(abs) : (abs === 1 ? '' : String(abs)) + vv;
    if (parts.length === 0) parts.push((c < 0 ? '-' : '') + body);
    else parts.push((c < 0 ? ' - ' : ' + ') + body);
  });
  return parts.length ? parts.join('') : '0';
}

/** Polinomio come stringa math.js */
export function polyStr(coeffs, v = 'x') {
  const n = coeffs.length - 1;
  return coeffs.map((c, i) => `(${c})*${v}^${n - i}`).join('+');
}

/** Derivata dei coefficienti di un polinomio (ordine decrescente) */
export function polyDeriv(coeffs) {
  const n = coeffs.length - 1;
  return coeffs.slice(0, -1).map((c, i) => c * (n - i));
}

/** a*x + b in LaTeX */
export function lin(a, b, v = 'x') {
  return poly([a, b], v);
}

/** Semplifica sqrt(n) = a*sqrt(b): ritorna [a, b] */
export function sqrtParts(n) {
  let a = 1;
  let b = n;
  for (let k = 2; k * k <= b; k++) {
    while (b % (k * k) === 0) {
      a *= k;
      b /= k * k;
    }
  }
  return [a, b];
}

/** LaTeX di sqrt(n) semplificata: 12 -> "2\\sqrt{3}", 9 -> "3" */
export function sqrtTex(n) {
  const [a, b] = sqrtParts(n);
  if (b === 1) return String(a);
  return (a === 1 ? '' : String(a)) + `\\sqrt{${b}}`;
}

/** Numero complesso a + bi in LaTeX (interi) */
export function cplx(a, b) {
  if (b === 0) return String(a);
  const bAbs = Math.abs(b) === 1 ? '' : String(Math.abs(b));
  if (a === 0) return (b < 0 ? '-' : '') + bAbs + 'i';
  return `${a} ${b < 0 ? '-' : '+'} ${bAbs}i`;
}

/** Stringa math.js per a + b i */
export function cplxStr(a, b) {
  return `(${a})+(${b})*i`;
}

/** Vettore/punto in LaTeX: (1, -2, 3) */
export function vec(arr) {
  return '(' + arr.join(', ') + ')';
}

/** Prodotto vettoriale di interi */
export function cross(u, v) {
  return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
}

export function dot(u, v) {
  return u.reduce((s, x, i) => s + x * v[i], 0);
}

/** Equazione del piano ax+by+cz+d=0 in LaTeX */
export function planeTex(a, b, c, d) {
  const s = [];
  const add = (k, t) => {
    if (k === 0) return;
    const abs = Math.abs(k);
    const body = t ? (abs === 1 ? '' : abs) + t : String(abs);
    s.push(s.length === 0 ? (k < 0 ? '-' : '') + body : (k < 0 ? ' - ' : ' + ') + body);
  };
  add(a, 'x');
  add(b, 'y');
  add(c, 'z');
  add(d, '');
  return (s.join('') || '0') + ' = 0';
}

export const H = {
  gcd, lcm, reduce, frac, fracStr, coef, signed, poly, polyStr, polyDeriv, lin,
  sqrtParts, sqrtTex, cplx, cplxStr, vec, cross, dot, planeTex,
};

export default H;
