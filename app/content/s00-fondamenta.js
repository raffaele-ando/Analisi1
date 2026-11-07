import { H } from '../engine/tex.js';

// =====================================================================
// s00 · Fondamenta (da zero)
// Il file è organizzato come: helper per i generatori → export → una skill per blocco (S.push).
// =====================================================================

// ---------- Helper locali per i generatori ----------
const EPS = 1e-9;
const sg = (v) => (Number.isNaN(v) ? NaN : Math.abs(v) < EPS ? 0 : Math.sign(v));
/** confronto con tolleranza: op in '>', '>=', '<', '<=' */
const cmp = (v, op) => {
  const s = sg(v);
  if (Number.isNaN(s)) return false;
  return op === '>' ? s > 0 : op === '>=' ? s >= 0 : op === '<' ? s < 0 : s <= 0;
};
const OPTEX = { '>': '>', '>=': '\\ge', '<': '<', '<=': '\\le' };
const FLIP = { '>': '<', '>=': '<=', '<': '>', '<=': '>=' };
/** punto razionale p/q */
const pt = (p, q = 1) => ({ v: p / q, s: H.fracStr(p, q), t: H.frac(p, q) });
/** punto sqrt(n) (anche negativo: sgn) */
const sqPt = (n, s = 1) => ({ v: s * Math.sqrt(n), s: (s < 0 ? '-' : '') + `sqrt(${n})`, t: (s < 0 ? '-' : '') + H.sqrtTex(n) });
/** multiplo razionale di pi: p*pi/q */
const piStr = (p, q = 1) => {
  const [a, b] = H.reduce(p, q);
  if (a === 0) return '0';
  return b === 1 ? `${a}*pi` : `${a}*pi/${b}`;
};
const piTex = (p, q = 1) => {
  const [a, b] = H.reduce(p, q);
  if (a === 0) return '0';
  const s = a < 0 ? '-' : '';
  const n = Math.abs(a) === 1 ? '\\pi' : `${Math.abs(a)}\\pi`;
  return b === 1 ? s + n : `${s}\\frac{${n}}{${b}}`;
};
const piPt = (p, q = 1) => ({ v: (p * Math.PI) / q, s: piStr(p, q), t: piTex(p, q) });

/**
 * Risolve "per punti di rottura": pts = punti dove il predicato può cambiare valore,
 * lo/hi = estremi (null = ±∞). Ritorna { s: stringa per il correttore, t: LaTeX }.
 */
function solveSet(pred, pts, lo = null, hi = null) {
  const P = pts.filter((p) => (lo ? p.v > lo.v + EPS : true) && (hi ? p.v < hi.v - EPS : true)).sort((a, b) => a.v - b.v);
  const nodes = [];
  for (const p of P) if (!nodes.length || Math.abs(nodes[nodes.length - 1].v - p.v) > EPS) nodes.push(p);
  const all = [lo, ...nodes, hi];
  const pieces = [];
  let cur = null;
  const end = (node, cb) => {
    cur.b = node;
    cur.cb = cb;
    pieces.push(cur);
    cur = null;
  };
  for (let i = 0; i < all.length; i++) {
    const node = all[i];
    if (node) {
      if (pred(node.v)) {
        if (!cur) cur = { a: node, ca: true };
      } else if (cur) end(node, false);
    }
    if (i < all.length - 1) {
      const L = all[i];
      const Rn = all[i + 1];
      const mid = L && Rn ? (L.v + Rn.v) / 2 : L ? L.v + 1 : Rn ? Rn.v - 1 : 0;
      if (pred(mid)) {
        if (!cur) cur = { a: L, ca: false };
      } else if (cur) end(L, true);
    }
  }
  if (cur) end(hi, !!hi);
  if (!pieces.length) return { s: 'vuoto', t: '\\emptyset', pieces };
  if (pieces.length === 1 && !pieces[0].a && !pieces[0].b) return { s: 'R', t: '\\R', pieces };
  const S = [];
  const T = [];
  for (const p of pieces) {
    if (p.a && p.b && p.a === p.b) {
      S.push(`{${p.a.s}}`);
      T.push(`\\{${p.a.t}\\}`);
      continue;
    }
    S.push(`${p.ca ? '[' : '('}${p.a ? p.a.s : '-inf'},${p.b ? p.b.s : 'inf'}${p.cb ? ']' : ')'}`);
    T.push(`${p.ca ? '\\left[' : '\\left('}${p.a ? p.a.t : '-\\infty'},\\, ${p.b ? p.b.t : '+\\infty'}${p.cb ? '\\right]' : '\\right)'}`);
  }
  return { s: S.join('U'), t: T.join(' \\cup '), pieces };
}

/** "x - 3", "x + 2", "x" */
const xm = (a) => (a === 0 ? 'x' : a > 0 ? `x - ${a}` : `x + ${-a}`);
/** fattore (x - a) con parentesi, oppure x */
const fx = (a) => (a === 0 ? 'x' : `(${xm(a)})`);
/** due interi distinti in ordine crescente */
const two = (R, lo, hi) => {
  const a = R.int(lo, hi);
  let b = R.int(lo, hi);
  while (b === a) b = R.int(lo, hi);
  return a < b ? [a, b] : [b, a];
};
/** coefficiente razionale davanti a un termine: 1 -> '', -1 -> '-', 3/2 -> '\frac{3}{2}' */
const cf = (p, q = 1) => {
  const [a, b] = H.reduce(p, q);
  if (b === 1) return H.coef(a);
  return H.frac(a, b);
};
/** frazione NON ridotta in LaTeX con il segno davanti: -\frac{27}{45} */
const fq = (n, m) => (m === 1 ? String(n) : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${m}}`);
/** testo per una lista di soluzioni in LaTeX */
const listTex = (arr) => arr.join(',\\ ');

// ---------- Sezione ----------
const S = [];

export default {
  id: 's00',
  title: 'Fondamenta',
  subtitle: 'Il ripasso da zero: numeri, algebra, equazioni, disequazioni, esponenziali, logaritmi, trigonometria, logica, insiemi',
  intro: String.raw`Se hai dimenticato quasi tutta la matematica delle superiori, **parti da qui**. Ogni esercizio d'esame (domini, segno della derivata, punti stazionari, limiti) si appoggia su queste abilità: una disequazione sbagliata o un logaritmo mal gestito costano punti anche quando il ragionamento di Analisi è giusto. Qui trovi spiegazioni dall'inizio e **pratica infinita** con numeri sempre nuovi.`,
  skills: S,
};

// =====================================================================
// s00.numeri
// =====================================================================
S.push({
  id: 's00.numeri',
  title: 'Frazioni, potenze, radicali',
  summary: String.raw`Saprai calcolare senza calcolatrice con frazioni, potenze (anche con esponente negativo o fratto) e radicali, e razionalizzare un denominatore.`,
  prereq: [],
  examRefs: ['Itinere 11/11/2025 · Parte B (successioni)'],
  lessons: [
    {
      id: 's00.numeri.L1',
      title: 'Le frazioni',
      cards: [
        {
          type: 'learn',
          title: 'Che cos\'è una frazione',
          body: String.raw`La frazione $\frac{a}{b}$ (con $b \neq 0$) è il numero che moltiplicato per $b$ dà $a$: dividi l'intero in $b$ parti uguali e ne prendi $a$. In alto c'è il **numeratore**, in basso il **denominatore**.

>* **Frazioni equivalenti.** Moltiplicando o dividendo numeratore e denominatore per lo **stesso** numero non nullo, il valore non cambia: $\frac{a}{b} = \frac{a\cdot k}{b\cdot k}$.

Per esempio $\frac{1}{2} = \frac{2}{4} = \frac{50}{100}$. Per **semplificare** (ridurre ai minimi termini) dividi sopra e sotto per il massimo comun divisore: $\frac{18}{24} = \frac{18:6}{24:6} = \frac{3}{4}$.

>! Il denominatore non può mai essere $0$: $\frac{5}{0}$ non ha senso (nessun numero moltiplicato per $0$ dà $5$).`,
        },
        {
          id: 's00.numeri.L1.e1', type: 'mcq', level: 1,
          prompt: String.raw`Quale frazione è equivalente a $\frac{6}{8}$?`,
          options: [String.raw`$\frac{3}{4}$`, String.raw`$\frac{7}{9}$`, String.raw`$\frac{6}{4}$`, String.raw`$\frac{12}{14}$`],
          answer: 0,
          explain: String.raw`Divido sopra e sotto per $2$: $\frac{6}{8} = \frac{3}{4}$.

- $\frac{7}{9}$: aggiungere $1$ sopra e sotto **non** dà una frazione equivalente ($\frac{7}{9} \approx 0{,}78 \neq 0{,}75$).
- $\frac{12}{14}$: ho moltiplicato il numeratore per $2$ ma al denominatore ho aggiunto $6$: serve la **stessa** operazione (moltiplicazione) sopra e sotto.
- $\frac{6}{4}$ cambia solo il denominatore: vale $1{,}5$.`,
        },
        {
          type: 'learn',
          title: 'Le quattro operazioni',
          body: String.raw`- **Somma e differenza**: porta le frazioni allo **stesso denominatore** (il minimo comune multiplo, mcm) e somma i numeratori:
$$\frac{a}{b} + \frac{c}{d} = \frac{a\,d + c\,b}{b\,d}.$$
- **Prodotto**: numeratore per numeratore, denominatore per denominatore: $\frac{a}{b}\cdot\frac{c}{d} = \frac{ac}{bd}$.
- **Divisione**: si moltiplica per il **reciproco**: $\frac{a}{b} : \frac{c}{d} = \frac{a}{b}\cdot\frac{d}{c}$.

>! L'errore più comune: $\frac{1}{2}+\frac{1}{3} \neq \frac{2}{5}$. Non si sommano i denominatori!`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: una somma',
          problem: String.raw`Calcola $\frac{2}{3} + \frac{5}{4}$.`,
          steps: [
            String.raw`Il mcm tra $3$ e $4$ è $12$.`,
            { text: String.raw`Riscrivo: $\frac{2}{3} = \frac{8}{12}$ e $\frac{5}{4} = \frac{15}{12}$.`,
              ask: { type: 'num', prompt: String.raw`Quale numeratore serve per scrivere $\frac{5}{4} = \frac{?}{12}$?`, answer: '15', explain: String.raw`Da $4$ a $12$ ho moltiplicato per $3$: anche il numeratore va moltiplicato per $3$, $5\cdot 3 = 15$.` } },
            String.raw`Sommo i numeratori: $\frac{8+15}{12} = \frac{23}{12}$.`,
          ],
          result: String.raw`$\frac{2}{3} + \frac{5}{4} = \frac{23}{12}$`,
        },
        {
          id: 's00.numeri.L1.e2', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $\frac{1}{2} + \frac{1}{3}$?`,
          options: [String.raw`$\frac{5}{6}$`, String.raw`$\frac{2}{5}$`, String.raw`$\frac{1}{5}$`, String.raw`$\frac{2}{6}$`],
          answer: 0,
          explain: String.raw`$\frac{1}{2}+\frac{1}{3} = \frac{3}{6}+\frac{2}{6} = \frac{5}{6}$. La risposta $\frac{2}{5}$ nasce dal sommare numeratori e denominatori separatamente: è sbagliato (basta notare che $\frac{2}{5}$ è minore di $\frac12$, uno degli addendi!).`,
        },
        {
          id: 's00.numeri.L1.e3', type: 'num', level: 1,
          prompt: String.raw`Calcola $\frac{3}{4} - \frac{5}{6}$.`,
          answer: '-1/12',
          explain: String.raw`mcm$(4,6) = 12$: $\frac{9}{12} - \frac{10}{12} = -\frac{1}{12}$.`,
        },
        {
          id: 's00.numeri.L1.e4', type: 'num', level: 1,
          prompt: String.raw`Calcola $\frac{2}{3}\cdot\frac{9}{4}$.`,
          answer: '3/2',
          explain: String.raw`$\frac{2\cdot 9}{3\cdot 4} = \frac{18}{12} = \frac{3}{2}$. Più veloce: semplifico "in croce" $2$ con $4$ e $9$ con $3$ prima di moltiplicare: $\frac{1\cdot 3}{1\cdot 2}$.`,
        },
        {
          id: 's00.numeri.L1.e5', type: 'num', level: 1,
          prompt: String.raw`Calcola $\frac{3}{5} : \frac{9}{10}$.`,
          answer: '2/3',
          explain: String.raw`Dividere è moltiplicare per il reciproco: $\frac{3}{5}\cdot\frac{10}{9} = \frac{30}{45} = \frac{2}{3}$.`,
        },
        {
          id: 's00.numeri.L1.e6', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $a, b, c$ (con denominatori non nulli) vale $\frac{a}{b+c} = \frac{a}{b} + \frac{a}{c}$.`,
          answer: false,
          explain: String.raw`Falso. Controesempio: $a=b=c=1$ dà $\frac{1}{2}$ a sinistra e $1+1 = 2$ a destra. Si può spezzare il **numeratore** ($\frac{b+c}{a} = \frac{b}{a}+\frac{c}{a}$), mai il denominatore.`,
        },
        {
          id: 's00.numeri.L1.e7', type: 'num', level: 2,
          prompt: String.raw`Calcola la frazione di frazioni $\dfrac{1 + \frac{1}{2}}{1 - \frac{1}{4}}$.`,
          answer: '2',
          explain: String.raw`Numeratore: $\frac{3}{2}$. Denominatore: $\frac{3}{4}$. Quindi $\frac{3}{2}:\frac{3}{4} = \frac{3}{2}\cdot\frac{4}{3} = 2$.`,
        },
        {
          id: 's00.numeri.L1.e8', type: 'num', level: 2,
          prompt: String.raw`Calcola $\left(\frac{1}{2} - \frac{1}{3}\right) : \frac{1}{6}$.`,
          answer: '1',
          explain: String.raw`$\frac12-\frac13 = \frac{3-2}{6} = \frac16$, e $\frac16 : \frac16 = 1$.`,
        },
      ],
    },
    {
      id: 's00.numeri.L2',
      title: 'Le potenze',
      cards: [
        {
          type: 'learn',
          title: 'Potenze con esponente naturale',
          body: String.raw`$a^n$ (si legge "$a$ alla $n$") è il prodotto di $n$ fattori uguali ad $a$: $2^3 = 2\cdot2\cdot2 = 8$. $a$ è la **base**, $n$ l'**esponente**.

>* **Proprietà** (stessa base o stesso esponente):
- $a^m\cdot a^n = a^{m+n}$
- $\dfrac{a^m}{a^n} = a^{m-n}$
- $(a^m)^n = a^{m\cdot n}$
- $(a\,b)^n = a^n\,b^n$, $\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}$

>! Non esiste una regola per la somma: $2^3 + 2^4 \neq 2^7$, e $(a+b)^2 \neq a^2+b^2$.`,
        },
        {
          type: 'learn',
          title: String.raw`Perché $a^0 = 1$ e $a^{-n} = \frac{1}{a^n}$`,
          body: String.raw`Guarda la sequenza: $2^3 = 8$, $2^2 = 4$, $2^1 = 2$. Ogni volta che l'esponente scende di $1$, **dividi per $2$**. Continuando: $2^0 = 1$, $2^{-1} = \frac12$, $2^{-2} = \frac14$.

Lo stesso con le proprietà: per $a \neq 0$,
$$1 = \frac{a^n}{a^n} = a^{n-n} = a^0, \qquad \frac{1}{a^n} = \frac{a^0}{a^n} = a^{0-n} = a^{-n}.$$

>* Per $a \neq 0$: $\;a^0 = 1$, $\;a^{-n} = \dfrac{1}{a^n}$, $\;\left(\dfrac{a}{b}\right)^{-n} = \left(\dfrac{b}{a}\right)^{n}$.`,
        },
        {
          id: 's00.numeri.L2.e1', type: 'mcq', level: 1,
          prompt: String.raw`$2^3\cdot 2^4 = $`,
          options: ['$2^7$', '$2^{12}$', '$4^7$', '$4^{12}$'],
          answer: 0,
          explain: String.raw`Stessa base: si **sommano** gli esponenti, la base resta $2$. $2^{12}$ moltiplica gli esponenti (regola della potenza di potenza, qui non c'entra); $4^7$ e $4^{12}$ moltiplicano anche le basi.`,
        },
        {
          id: 's00.numeri.L2.e2', type: 'num', level: 1,
          prompt: String.raw`Calcola $2^{-3}$.`,
          answer: '1/8',
          explain: String.raw`$2^{-3} = \frac{1}{2^3} = \frac{1}{8}$. Esponente negativo **non** vuol dire risultato negativo: $-8$ è un errore tipico.`,
        },
        {
          id: 's00.numeri.L2.e3', type: 'num', level: 1,
          prompt: String.raw`Calcola $\dfrac{(3^2)^3}{3^5}$.`,
          answer: '3',
          explain: String.raw`$(3^2)^3 = 3^6$, poi $\frac{3^6}{3^5} = 3^{6-5} = 3$.`,
        },
        {
          id: 's00.numeri.L2.e4', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $-2^4$?`,
          options: ['$-16$', '$16$', '$-8$', '$8$'],
          answer: 0,
          explain: String.raw`La potenza ha precedenza sul segno: $-2^4 = -(2^4) = -16$. Invece $(-2)^4 = 16$. $\pm 8$ nasce dal confondere $2^4$ con $2\cdot 4$.`,
        },
        {
          type: 'learn',
          title: 'Esponenti fratti',
          body: String.raw`Per $a > 0$ e $n \ge 1$ intero, $a^{1/n} = \sqrt[n]{a}$ è il numero positivo che elevato alla $n$ dà $a$. Più in generale
$$a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}.$$
Le proprietà delle potenze restano valide. Esempio: $8^{2/3} = (\sqrt[3]{8})^2 = 2^2 = 4$.

> Conviene fare **prima la radice** (numeri piccoli), poi la potenza.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $16^{3/4}$.`,
          steps: [
            { text: String.raw`Radice quarta: $\sqrt[4]{16} = 2$ perché $2^4 = 16$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $\sqrt[4]{16}$?`, answer: '2', explain: String.raw`$2^4 = 16$.` } },
            String.raw`Elevo alla terza: $2^3 = 8$.`,
          ],
          result: String.raw`$16^{3/4} = 8$`,
        },
        {
          id: 's00.numeri.L2.e5', type: 'num', level: 2,
          prompt: String.raw`Calcola $27^{2/3}$.`,
          answer: '9',
          explain: String.raw`$\sqrt[3]{27} = 3$, poi $3^2 = 9$.`,
        },
        {
          id: 's00.numeri.L2.e6', type: 'num', level: 2,
          prompt: String.raw`Calcola $\left(\frac{1}{4}\right)^{-1/2}$.`,
          answer: '2',
          explain: String.raw`Il segno meno capovolge la base: $\left(\frac14\right)^{-1/2} = 4^{1/2} = \sqrt4 = 2$.`,
        },
        {
          id: 's00.numeri.L2.e7', type: 'expr', level: 2, vars: ['x'], domain: [0.5, 3],
          prompt: String.raw`Per $x > 0$ scrivi come un'unica potenza di $x$: $\dfrac{x^3\cdot x^{-1}}{\sqrt{x}}$.`,
          answer: 'x^(3/2)',
          explain: String.raw`$\sqrt{x} = x^{1/2}$. Esponente finale: $3 - 1 - \frac12 = \frac32$, quindi $x^{3/2} = x\sqrt{x}$.`,
        },
        {
          id: 's00.numeri.L2.e8', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $a, b$ reali vale $(a+b)^2 = a^2 + b^2$.`,
          answer: false,
          explain: String.raw`Falso: $(a+b)^2 = a^2 + 2ab + b^2$. Controesempio: $(1+1)^2 = 4 \neq 1 + 1$.`,
        },
      ],
    },
    {
      id: 's00.numeri.L3',
      title: 'Radicali e razionalizzazione',
      cards: [
        {
          type: 'learn',
          title: 'La radice quadrata',
          body: String.raw`Per $a \ge 0$, $\sqrt{a}$ è il numero **non negativo** il cui quadrato è $a$: $\sqrt{9} = 3$ (non $\pm 3$). Se $a < 0$, $\sqrt{a}$ non esiste in $\R$. Le radici di indice dispari esistono anche per i negativi: $\sqrt[3]{-8} = -2$.

>* Per $a, b \ge 0$: $\sqrt{ab} = \sqrt a\,\sqrt b$ e $\sqrt{\frac ab} = \frac{\sqrt a}{\sqrt b}$ ($b>0$). E per ogni $x$ reale: $\sqrt{x^2} = |x|$.

**Portare fuori dalla radice**: $\sqrt{12} = \sqrt{4\cdot 3} = 2\sqrt3$.

>! $\sqrt{a+b} \neq \sqrt a + \sqrt b$: $\sqrt{9+16} = 5$, mentre $\sqrt9+\sqrt{16} = 7$.`,
        },
        {
          id: 's00.numeri.L3.e1', type: 'mcq', level: 1,
          prompt: String.raw`Per $x \in \R$, $\sqrt{x^2} = $`,
          options: ['$|x|$', '$x$', '$\\pm x$', '$x^2$'],
          answer: 0,
          explain: String.raw`La radice è sempre $\ge 0$. Se $x = -3$: $\sqrt{(-3)^2} = \sqrt 9 = 3 = |-3|$, non $-3$. Quindi "$x$" è giusto solo per $x \ge 0$, e "$\pm x$" non è un numero ma due.`,
        },
        {
          id: 's00.numeri.L3.e2', type: 'num', level: 1,
          prompt: String.raw`Calcola $\sqrt{50} - \sqrt{8}$.`,
          answer: '3*sqrt(2)',
          explain: String.raw`$\sqrt{50} = \sqrt{25\cdot2} = 5\sqrt2$, $\sqrt 8 = 2\sqrt2$. Quindi $5\sqrt2 - 2\sqrt2 = 3\sqrt2$ (si sommano come monomi simili). Attenzione: $\sqrt{50-8} = \sqrt{42}$ è sbagliato.`,
        },
        {
          id: 's00.numeri.L3.e3', type: 'tf', level: 1,
          prompt: String.raw`$\sqrt{9 + 16} = \sqrt 9 + \sqrt{16}$.`,
          answer: false,
          explain: String.raw`$\sqrt{25} = 5$, mentre $3 + 4 = 7$. La radice **non** si distribuisce sulla somma.`,
        },
        {
          type: 'learn',
          title: 'Razionalizzare',
          body: String.raw`Razionalizzare significa togliere le radici dal **denominatore**, moltiplicando sopra e sotto per lo stesso fattore (frazione equivalente!).

- $\dfrac{1}{\sqrt a} = \dfrac{\sqrt a}{a}$ (moltiplico per $\sqrt a$).
- $\dfrac{1}{\sqrt a - \sqrt b}$: moltiplico per il **coniugato** $\sqrt a + \sqrt b$ e uso $(A-B)(A+B) = A^2 - B^2$:
$$\frac{1}{\sqrt a - \sqrt b} = \frac{\sqrt a + \sqrt b}{a - b}.$$

> Lo stesso trucco serve nei limiti: $\sqrt{n+1} - \sqrt n = \frac{1}{\sqrt{n+1}+\sqrt n}$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Razionalizza $\dfrac{2}{\sqrt3 - 1}$.`,
          steps: [
            String.raw`Moltiplico sopra e sotto per il coniugato $\sqrt3+1$.`,
            { text: String.raw`Denominatore: $(\sqrt3-1)(\sqrt3+1) = 3 - 1 = 2$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $(\sqrt3-1)(\sqrt3+1)$?`, answer: '2', explain: String.raw`Differenza di quadrati: $(\sqrt3)^2 - 1^2 = 2$.` } },
            String.raw`Quindi $\frac{2(\sqrt3+1)}{2} = \sqrt3+1$.`,
          ],
          result: String.raw`$\dfrac{2}{\sqrt3-1} = \sqrt3+1$`,
        },
        {
          id: 's00.numeri.L3.e4', type: 'num', level: 2,
          prompt: String.raw`Razionalizza e semplifica $\dfrac{6}{\sqrt3}$.`,
          answer: '2*sqrt(3)',
          explain: String.raw`$\frac{6}{\sqrt3}\cdot\frac{\sqrt3}{\sqrt3} = \frac{6\sqrt3}{3} = 2\sqrt3$.`,
        },
        {
          id: 's00.numeri.L3.e5', type: 'mcq', level: 2,
          prompt: String.raw`Razionalizzando $\dfrac{1}{2+\sqrt3}$ si ottiene`,
          options: [String.raw`$2-\sqrt3$`, String.raw`$\frac{2-\sqrt3}{7}$`, String.raw`$2+\sqrt3$`, String.raw`$\frac{2+\sqrt3}{7}$`],
          answer: 0,
          explain: String.raw`Moltiplico per $2-\sqrt3$: denominatore $4 - 3 = 1$, quindi il risultato è $2-\sqrt3$. Il $7$ viene da $4+3$: errore di segno nella differenza di quadrati. $2+\sqrt3$ moltiplica per il fattore sbagliato.`,
        },
        {
          id: 's00.numeri.L3.e6', type: 'num', level: 2,
          prompt: String.raw`Razionalizza $\dfrac{1}{\sqrt5+\sqrt3}$.`,
          answer: '(sqrt(5)-sqrt(3))/2',
          explain: String.raw`Moltiplico per $\sqrt5-\sqrt3$: $\frac{\sqrt5-\sqrt3}{5-3} = \frac{\sqrt5-\sqrt3}{2}$.`,
        },
        {
          id: 's00.numeri.L3.e7', type: 'expr', level: 2, vars: ['x'], domain: [0.5, 3],
          prompt: String.raw`Per $x>0$ porta fuori dalla radice: $\sqrt{x^3} = $`,
          answer: 'x*sqrt(x)',
          explain: String.raw`$\sqrt{x^3} = \sqrt{x^2\cdot x} = |x|\sqrt x = x\sqrt x$ perché $x>0$.`,
        },
        {
          id: 's00.numeri.L3.e8', type: 'expr', level: 3, vars: ['n'], domain: [1, 10],
          source: 'Itinere 11/11/2025 · Parte B (successioni)',
          prompt: String.raw`All'esame serve $\lim_{n\to\infty} n\left(\sqrt{1+\frac1n} - 1\right)$. Primo passo: moltiplica e dividi per il coniugato. Scrivi $n\left(\sqrt{1+\frac1n} - 1\right)$ senza differenze di radici.`,
          answer: '1/(sqrt(1+1/n)+1)',
          explain: String.raw`$n\left(\sqrt{1+\frac1n}-1\right)\cdot\frac{\sqrt{1+\frac1n}+1}{\sqrt{1+\frac1n}+1} = \frac{n\left(1+\frac1n-1\right)}{\sqrt{1+\frac1n}+1} = \frac{1}{\sqrt{1+\frac1n}+1}$. Per $n\to\infty$ il denominatore tende a $2$: il limite è $\frac12$.`,
        },
      ],
    },
  ],
  practice: [
    { id: 's00.numeri.gen-somma', type: 'gen', level: 1,
      gen: (R) => {
        const dens = [2, 3, 4, 5, 6, 8, 9, 10, 12];
        const b = R.pick(dens);
        let d = R.pick(dens);
        while (d === b) d = R.pick(dens);
        let a = R.nz(-7, 7);
        while (H.gcd(a, b) !== 1) a = R.nz(-7, 7);
        let c = R.int(1, 9);
        while (H.gcd(c, d) !== 1) c = R.int(1, 9);
        const s = R.sign();
        const m = H.lcm(b, d);
        const num = a * (m / b) + s * c * (m / d);
        return {
          type: 'num',
          prompt: String.raw`Calcola $${H.frac(a, b)} ${s > 0 ? '+' : '-'} ${H.frac(c, d)}$.`,
          answer: H.fracStr(num, m),
          explain: String.raw`mcm$(${b}, ${d}) = ${m}$: $${fq(a * (m / b), m)} ${s > 0 ? '+' : '-'} ${fq(c * (m / d), m)} = ${fq(num, m)}${H.gcd(num, m) > 1 ? ` = ${H.frac(num, m)}` : ''}$.`,
        };
      } },
    { id: 's00.numeri.gen-prodotto', type: 'gen', level: 1,
      gen: (R) => {
        let a = R.nz(-9, 9), c = R.int(1, 9);
        const b = R.int(2, 9), d = R.int(2, 9);
        while (H.gcd(a, b) !== 1) a = R.nz(-9, 9);
        while (H.gcd(c, d) !== 1) c = R.int(1, 9);
        const div = R.chance(0.5);
        const [p, q] = div ? [a * d, b * c] : [a * c, b * d];
        return {
          type: 'num',
          prompt: String.raw`Calcola $${H.frac(a, b)} ${div ? ':' : '\\cdot'} ${H.frac(c, d)}$.`,
          answer: H.fracStr(p, q),
          explain: div
            ? String.raw`Dividere è moltiplicare per il reciproco: $${H.frac(a, b)}\cdot${H.frac(d, c)} = ${fq(p, q)}${H.gcd(p, q) > 1 ? ` = ${H.frac(p, q)}` : ''}$.`
            : String.raw`Numeratore per numeratore, denominatore per denominatore: $${fq(p, q)}${H.gcd(p, q) > 1 ? ` = ${H.frac(p, q)}` : ''}$ (conviene semplificare in croce prima di moltiplicare).`,
        };
      } },
    { id: 's00.numeri.gen-potenze', type: 'gen', level: 1,
      gen: (R) => {
        const base = R.pick([2, 2, 3, 5]);
        const lim = { 2: [-3, 5], 3: [-2, 3], 5: [-2, 2] }[base];
        const e = R.int(lim[0], lim[1]);
        const m = R.int(-4, 6), n = R.int(-3, 5);
        const k = m + n - e;
        const val = e >= 0 ? String(base ** e) : `1/${base ** -e}`;
        return {
          type: 'num',
          prompt: String.raw`Calcola $\dfrac{${base}^{${m}}\cdot ${base}^{${n}}}{${base}^{${k}}}$.`,
          answer: val,
          explain: String.raw`Stessa base: esponente $${m} ${H.signed(n)} - (${k}) = ${e}$. Quindi $${base}^{${e}} = ${e >= 0 ? base ** e : `\\frac{1}{${base ** -e}}`}$.`,
        };
      } },
    { id: 's00.numeri.gen-negativo', type: 'gen', level: 2,
      gen: (R) => {
        let p = R.int(1, 5), q = R.int(2, 5);
        while (H.gcd(p, q) !== 1) p = R.int(1, 5);
        const n = R.int(1, 3);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\left(\frac{${p}}{${q}}\right)^{-${n}}$.`,
          answer: H.fracStr(q ** n, p ** n),
          explain: String.raw`L'esponente negativo capovolge la frazione: $\left(\frac{${q}}{${p}}\right)^{${n}} = ${H.frac(q ** n, p ** n)}$.`,
        };
      } },
    { id: 's00.numeri.gen-fratti', type: 'gen', level: 2,
      gen: (R) => {
        const k = R.pick([2, 3, 4, 5]);
        const n = k === 2 ? R.pick([2, 3, 4, 5]) : k === 3 ? R.pick([2, 3, 4]) : R.pick([2, 3]);
        let m = R.pick([1, 2, 3, -1, -2]);
        while (H.gcd(Math.abs(m), n) !== 1 || k ** Math.abs(m) > 125) m = R.pick([1, 2, -1]);
        const base = k ** n;
        const val = m > 0 ? String(k ** m) : `1/${k ** -m}`;
        return {
          type: 'num',
          prompt: String.raw`Calcola $${base}^{${H.frac(m, n)}}$.`,
          answer: val,
          explain: String.raw`$${base} = ${k}^{${n}}$, quindi $${n === 2 ? '\\sqrt' : `\\sqrt[${n}]`}{${base}} = ${k}$ e $${base}^{${H.frac(m, n)}} = ${k}^{${m}} = ${m > 0 ? k ** m : `\\frac{1}{${k ** -m}}`}$.`,
        };
      } },
    { id: 's00.numeri.gen-radicali', type: 'gen', level: 2,
      gen: (R) => {
        const b = R.pick([2, 3, 5, 6, 7]);
        const [a, c] = two(R, 1, 5);
        const s = R.sign();
        const [x, y] = R.chance(0.5) ? [c, a] : [a, c];
        const r = x + s * y;
        return {
          type: 'num',
          prompt: String.raw`Calcola $\sqrt{${x * x * b}} ${s > 0 ? '+' : '-'} \sqrt{${y * y * b}}$.`,
          answer: `${r}*sqrt(${b})`,
          explain: String.raw`Porto fuori i quadrati: $\sqrt{${x * x * b}} = ${H.coef(x)}\sqrt{${b}}$ e $\sqrt{${y * y * b}} = ${H.coef(y)}\sqrt{${b}}$. Risultato: $(${x} ${s > 0 ? '+' : '-'} ${y})\sqrt{${b}} = ${H.coef(r)}\sqrt{${b}}$.`,
        };
      } },
    { id: 's00.numeri.gen-razionalizza', type: 'gen', level: 2,
      gen: (R) => {
        if (R.chance(0.35)) {
          const a = R.pick([2, 3, 5, 6, 7]);
          const p = R.pick([1, 2, 3, 4, 6, a, 2 * a, 3 * a]);
          return {
            type: 'num',
            prompt: String.raw`Razionalizza e semplifica $\dfrac{${p}}{\sqrt{${a}}}$.`,
            answer: `${H.fracStr(p, a)}*sqrt(${a})`,
            explain: String.raw`Moltiplico sopra e sotto per $\sqrt{${a}}$: $\frac{${p}\sqrt{${a}}}{${a}} = ${cf(p, a)}\sqrt{${a}}$.`,
          };
        }
        const [b, a] = R.sample([2, 3, 5, 6, 7, 8, 10, 11], 2).sort((u, v) => u - v);
        const p = R.int(1, 6);
        const s = R.sign();
        const d = a - b;
        const conj = s > 0 ? '-' : '+';
        return {
          type: 'num',
          prompt: String.raw`Razionalizza $\dfrac{${p}}{\sqrt{${a}} ${s > 0 ? '+' : '-'} \sqrt{${b}}}$.`,
          answer: `${p}*(sqrt(${a}) ${conj} sqrt(${b}))/${d}`,
          explain: String.raw`Moltiplico per il coniugato $\sqrt{${a}} ${conj} \sqrt{${b}}$: al denominatore $(\sqrt{${a}})^2 - (\sqrt{${b}})^2 = ${a} - ${b} = ${d}$. Risultato: $${cf(p, d)}\left(\sqrt{${a}} ${conj} \sqrt{${b}}\right)$.`,
        };
      } },
    {
      id: 's00.numeri.p1', type: 'mcq', level: 1,
      prompt: String.raw`Quale scrittura è uguale a $\frac{1}{x^3}$ (per $x\neq0$)?`,
      options: ['$x^{-3}$', '$-x^3$', '$x^{1/3}$', '$-3x$'],
      answer: 0,
      explain: String.raw`$a^{-n} = \frac1{a^n}$. $-x^3$ confonde "esponente negativo" con "numero negativo"; $x^{1/3}$ è la radice cubica.`,
    },
    {
      id: 's00.numeri.p2', type: 'num', level: 2,
      prompt: String.raw`Calcola $\dfrac{2^{10}\cdot 4^{-3}}{8}$.`,
      answer: '2',
      explain: String.raw`Tutto in base $2$: $4^{-3} = 2^{-6}$, $8 = 2^3$. Esponente: $10 - 6 - 3 = 1$, quindi $2$.`,
    },
    {
      id: 's00.numeri.p3', type: 'tf', level: 2,
      prompt: String.raw`$\sqrt{(-5)^2} = -5$.`,
      answer: false,
      explain: String.raw`$\sqrt{(-5)^2} = \sqrt{25} = 5 = |-5|$. La radice quadrata è sempre non negativa.`,
    },
    {
      id: 's00.numeri.p4', type: 'num', level: 2,
      prompt: String.raw`Calcola $\left(\frac{8}{27}\right)^{-2/3}$.`,
      answer: '9/4',
      explain: String.raw`Capovolgo: $\left(\frac{27}{8}\right)^{2/3}$. Radice cubica: $\frac32$. Al quadrato: $\frac94$.`,
    },
    {
      id: 's00.numeri.p5', type: 'match', level: 1,
      prompt: 'Abbina ogni espressione al suo valore.',
      pairs: [['$2^{-2}$', '$\\frac14$'], ['$4^{1/2}$', '$2$'], ['$8^{-1/3}$', '$\\frac12$'], ['$(-1)^{7}$', '$-1$'], ['$5^0$', '$1$']],
      explain: String.raw`$2^{-2} = \frac1{4}$; $4^{1/2} = \sqrt4 = 2$; $8^{-1/3} = \frac{1}{\sqrt[3]8} = \frac12$; $(-1)^{\text{dispari}} = -1$; $a^0 = 1$.`,
    },
  ],
  flashcards: [
    { id: 's00.numeri.fc1', kind: 'def', front: 'Frazioni equivalenti', back: String.raw`$\frac{a}{b} = \frac{ak}{bk}$ per ogni $k \neq 0$. Per semplificare divido sopra e sotto per il MCD.` },
    { id: 's00.numeri.fc2', kind: 'formula', front: 'Somma, prodotto e quoziente di frazioni', back: String.raw`$\frac ab + \frac cd = \frac{ad+bc}{bd}$; $\frac ab\cdot\frac cd = \frac{ac}{bd}$; $\frac ab : \frac cd = \frac ab\cdot\frac dc$.` },
    { id: 's00.numeri.fc3', kind: 'formula', front: 'Proprietà delle potenze', back: String.raw`$a^ma^n = a^{m+n}$, $\frac{a^m}{a^n} = a^{m-n}$, $(a^m)^n = a^{mn}$, $(ab)^n = a^nb^n$.` },
    { id: 's00.numeri.fc4', kind: 'def', front: String.raw`$a^0$ e $a^{-n}$ (con $a\neq0$)`, back: String.raw`$a^0 = 1$ (perché $\frac{a^n}{a^n} = a^{n-n}$) e $a^{-n} = \frac{1}{a^n}$.` },
    { id: 's00.numeri.fc5', kind: 'def', front: String.raw`Potenza con esponente fratto $a^{m/n}$ ($a>0$)`, back: String.raw`$a^{m/n} = \sqrt[n]{a^m} = (\sqrt[n]{a})^m$. Esempio: $8^{2/3} = 4$.` },
    { id: 's00.numeri.fc6', kind: 'formula', front: String.raw`$\sqrt{x^2}$ per $x\in\R$`, back: String.raw`$\sqrt{x^2} = |x|$ (non $x$!).` },
    { id: 's00.numeri.fc7', kind: 'metodo', front: 'Razionalizzare un denominatore', back: String.raw`$\frac{1}{\sqrt a} = \frac{\sqrt a}{a}$; $\frac{1}{\sqrt a\pm\sqrt b} = \frac{\sqrt a\mp\sqrt b}{a-b}$ (moltiplico per il coniugato e uso $(A-B)(A+B) = A^2-B^2$).` },
    { id: 's00.numeri.fc8', kind: 'errore', front: 'Errori tipici con frazioni, potenze, radici', back: String.raw`$\frac12+\frac13\neq\frac25$; $\frac{a}{b+c}\neq\frac ab+\frac ac$; $(a+b)^2\neq a^2+b^2$; $\sqrt{a+b}\neq\sqrt a+\sqrt b$; $-2^4 = -16$ ma $(-2)^4 = 16$.` },
  ],
});

// =====================================================================
// s00.algebra
// =====================================================================
S.push({
  id: 's00.algebra',
  title: 'Polinomi, scomposizioni, frazioni algebriche',
  summary: String.raw`Saprai sviluppare prodotti, scomporre polinomi (anche con Ruffini) e semplificare frazioni algebriche: è il "motore" di derivate, limiti e studi del segno.`,
  prereq: ['s00.numeri'],
  examRefs: ['Itinere 11/11/2025 · Parte B (studio di funzione)', 'Appello 15/01/2026 · Parte B (studio di funzione)'],
  lessons: [
    {
      id: 's00.algebra.L1',
      title: 'Polinomi e prodotti notevoli',
      cards: [
        {
          type: 'learn',
          title: 'Monomi e polinomi',
          body: String.raw`Un **monomio** è un numero per una potenza della variabile: $3x^2$, $-x$, $5$. Un **polinomio** è una somma di monomi: $2x^3 - x + 7$. Il **grado** è l'esponente più alto ($3$ nell'esempio).

- **Sommare**: si sommano solo i termini **simili** (stessa potenza): $3x^2 + 5x^2 = 8x^2$, ma $x^2 + x$ resta così.
- **Moltiplicare**: proprietà distributiva, "ogni termine per ogni termine", poi si sommano i simili.

$$(x+2)(x-3) = x^2 - 3x + 2x - 6 = x^2 - x - 6.$$`,
        },
        {
          id: 's00.algebra.L1.e1', type: 'expr', level: 1,
          prompt: String.raw`Sviluppa $(2x-1)(x+3)$.`,
          answer: '2x^2+5x-3',
          explain: String.raw`$2x\cdot x + 2x\cdot 3 - 1\cdot x - 1\cdot 3 = 2x^2 + 6x - x - 3 = 2x^2 + 5x - 3$.`,
        },
        {
          type: 'learn',
          title: 'Prodotti notevoli',
          body: String.raw`Alcuni prodotti tornano così spesso che conviene saperli a memoria:

>* $(a+b)^2 = a^2 + 2ab + b^2$
$(a-b)^2 = a^2 - 2ab + b^2$
$(a+b)(a-b) = a^2 - b^2$
$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$
$a^3 - b^3 = (a-b)(a^2+ab+b^2)$

Letti da destra a sinistra servono a **scomporre**: $x^2 - 9 = (x-3)(x+3)$.`,
        },
        {
          id: 's00.algebra.L1.e2', type: 'mcq', level: 1,
          prompt: String.raw`$(x-3)^2 = $`,
          options: ['$x^2 - 6x + 9$', '$x^2 - 9$', '$x^2 + 9$', '$x^2 - 3x + 9$'],
          answer: 0,
          explain: String.raw`$(a-b)^2 = a^2 - 2ab + b^2$ con $a = x$, $b = 3$: $x^2 - 6x + 9$. $x^2-9$ e $x^2+9$ dimenticano il doppio prodotto; $-3x$ dimentica il fattore $2$.`,
        },
        {
          id: 's00.algebra.L1.e3', type: 'expr', level: 2,
          prompt: String.raw`Sviluppa $(x+2)^3$.`,
          answer: 'x^3+6x^2+12x+8',
          explain: String.raw`$(a+b)^3$ con $a=x$, $b=2$: $x^3 + 3\cdot x^2\cdot 2 + 3\cdot x\cdot 4 + 8 = x^3+6x^2+12x+8$.`,
        },
        {
          id: 's00.algebra.L1.e4', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $a, b$: $(a-b)(a+b) = a^2 - b^2$.`,
          answer: true,
          explain: String.raw`Vero: $a^2 + ab - ab - b^2 = a^2 - b^2$ (i doppi prodotti si cancellano).`,
        },
        {
          id: 's00.algebra.L1.e5', type: 'match', level: 1,
          prompt: 'Abbina ogni prodotto al suo sviluppo.',
          pairs: [
            ['$(a+b)^2$', '$a^2+2ab+b^2$'],
            ['$(a-b)^2$', '$a^2-2ab+b^2$'],
            ['$(a+b)(a-b)$', '$a^2-b^2$'],
            ['$(a+b)^3$', '$a^3+3a^2b+3ab^2+b^3$'],
            ['$(a-b)(a^2+ab+b^2)$', '$a^3-b^3$'],
          ],
          explain: 'Sono i prodotti notevoli: vanno riconosciuti al volo in entrambe le direzioni.',
        },
        {
          id: 's00.algebra.L1.e6', type: 'expr', level: 2,
          prompt: String.raw`Semplifica $(x+1)^2 - (x-1)^2$.`,
          answer: '4x',
          explain: String.raw`$(x^2+2x+1) - (x^2-2x+1) = 4x$. Oppure differenza di quadrati: $\big[(x+1)-(x-1)\big]\big[(x+1)+(x-1)\big] = 2\cdot 2x$.`,
        },
        {
          id: 's00.algebra.L1.e7', type: 'num', level: 2,
          prompt: String.raw`Calcola a mente $101^2 - 99^2$.`,
          answer: '400',
          explain: String.raw`$a^2 - b^2 = (a-b)(a+b) = 2\cdot 200 = 400$. I prodotti notevoli servono anche per i conti.`,
        },
        {
          id: 's00.algebra.L1.e8', type: 'mcq', level: 2,
          prompt: String.raw`Quale fra queste è una scomposizione corretta di $4x^2 - 25$?`,
          options: ['$(2x-5)(2x+5)$', '$(2x-5)^2$', '$(4x-5)(x+5)$', '$(2x-25)(2x+1)$'],
          answer: 0,
          explain: String.raw`$4x^2 - 25 = (2x)^2 - 5^2$: differenza di quadrati. $(2x-5)^2$ produrrebbe anche il termine $-20x$.`,
        },
      ],
    },
    {
      id: 's00.algebra.L2',
      title: 'Scomporre: trinomi e Ruffini',
      cards: [
        {
          type: 'learn',
          title: 'Perché scomporre',
          body: String.raw`**Scomporre** significa scrivere un polinomio come **prodotto**. Serve perché un prodotto è zero se e solo se lo è un fattore, e il suo **segno** si legge fattore per fattore: è il cuore dello studio del segno della derivata.

Strategie, in ordine:
1. **Raccoglimento**: $x^3 - 4x = x(x^2-4)$.
2. **Prodotti notevoli**: $x^2 - 4 = (x-2)(x+2)$.
3. **Trinomio** $x^2 + sx + p$: cerco due numeri con **somma** $s$ e **prodotto** $p$; se sono $m, n$ allora $x^2+sx+p = (x+m)(x+n)$.
4. **Ruffini** per i gradi più alti.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto (dal primo itinere)',
          problem: String.raw`Scomponi $x^2 + 5x + 6$.`,
          steps: [
            String.raw`Cerco due numeri con somma $5$ e prodotto $6$.`,
            { text: String.raw`Sono $2$ e $3$: $2+3 = 5$, $2\cdot 3 = 6$.`,
              ask: { type: 'tuple', prompt: String.raw`Due numeri $m < n$ con $m+n = 5$ e $m\cdot n = 6$:`, labels: ['m', 'n'], answer: ['2', '3'], explain: String.raw`Le coppie con prodotto $6$ sono $(1,6)$ e $(2,3)$: solo la seconda ha somma $5$.` } },
            String.raw`Quindi $x^2+5x+6 = (x+2)(x+3)$, che si annulla in $x = -2$ e $x = -3$.`,
          ],
          result: String.raw`$x^2+5x+6 = (x+2)(x+3)$`,
        },
        {
          id: 's00.algebra.L2.e1', type: 'mcq', level: 1,
          prompt: String.raw`Scomponi $x^2 - x - 6$.`,
          options: ['$(x-3)(x+2)$', '$(x+3)(x-2)$', '$(x-6)(x+1)$', '$(x-3)(x-2)$'],
          answer: 0,
          explain: String.raw`Servono somma $-1$ e prodotto $-6$: i numeri sono $-3$ e $2$. $(x+3)(x-2) = x^2 + x - 6$ ha il segno di $x$ sbagliato; $(x-3)(x-2) = x^2-5x+6$.`,
        },
        {
          id: 's00.algebra.L2.e2', type: 'tuple', level: 1,
          prompt: String.raw`Scrivi $x^2 - 7x + 12 = (x-a)(x-b)$ con $a < b$.`,
          labels: ['a', 'b'],
          answer: ['3', '4'],
          explain: String.raw`$(x-a)(x-b) = x^2 - (a+b)x + ab$: servono $a+b = 7$ e $ab = 12$, cioè $3$ e $4$.`,
        },
        {
          type: 'learn',
          title: 'Il teorema di Ruffini',
          body: String.raw`>* **Ruffini.** Se $P(a) = 0$, allora $P(x)$ è divisibile per $(x-a)$: $P(x) = (x-a)\,Q(x)$ con $Q$ di grado più basso di uno.

**Dove cercare $a$**: se i coefficienti sono interi e il primo è $1$, le radici intere vanno cercate tra i **divisori del termine noto**.

**La tabella**: per dividere $x^3 - 2x^2 - 5x + 6$ per $(x-1)$ scrivo i coefficienti $1, -2, -5, 6$; abbasso il primo, poi "moltiplico per $1$ e sommo":
$$1 \;\to\; -2+1 = -1 \;\to\; -5-1 = -6 \;\to\; 6-6 = 0.$$
Il resto è $0$ e il quoziente è $x^2 - x - 6$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: Ruffini',
          problem: String.raw`Scomponi $P(x) = x^3 - 2x^2 - 5x + 6$.`,
          steps: [
            String.raw`Divisori di $6$: $\pm1, \pm2, \pm3, \pm6$. Provo $x = 1$: $P(1) = 1 - 2 - 5 + 6 = 0$. ✓`,
            String.raw`Ruffini: $P(x) = (x-1)(x^2 - x - 6)$.`,
            { text: String.raw`Scompongo il trinomio: $x^2-x-6 = (x-3)(x+2)$.`,
              ask: { type: 'set', prompt: String.raw`Quali sono le radici di $x^2 - x - 6$? (separale con ;)`, answer: ['3', '-2'], explain: String.raw`Somma $1$, prodotto $-6$: $3$ e $-2$.` } },
          ],
          result: String.raw`$x^3 - 2x^2 - 5x + 6 = (x-1)(x-3)(x+2)$`,
        },
        {
          id: 's00.algebra.L2.e3', type: 'num', level: 1,
          prompt: String.raw`Sia $P(x) = x^3 - 3x + 2$. Calcola $P(1)$.`,
          answer: '0',
          explain: String.raw`$1 - 3 + 2 = 0$: quindi $(x-1)$ divide $P(x)$.`,
        },
        {
          id: 's00.algebra.L2.e4', type: 'tuple', level: 2,
          prompt: String.raw`Dividi $x^3 - 3x + 2$ per $(x-1)$ con Ruffini: il quoziente è $ax^2+bx+c$. Trova $a, b, c$.`,
          labels: ['a', 'b', 'c'],
          answer: ['1', '1', '-2'],
          explain: String.raw`Coefficienti $1, 0, -3, 2$ (**attento allo $0$** per il termine $x^2$ mancante). Ruffini con $1$: $1 \to 0+1 = 1 \to -3+1 = -2 \to 2-2 = 0$. Quoziente $x^2 + x - 2 = (x+2)(x-1)$, quindi $x^3-3x+2 = (x-1)^2(x+2)$.`,
        },
        {
          id: 's00.algebra.L2.e5', type: 'set', level: 2,
          prompt: String.raw`Trova tutte le radici di $x^3 - 6x^2 + 11x - 6$ (separale con ;).`,
          answer: ['1', '2', '3'],
          explain: String.raw`$P(1) = 1-6+11-6 = 0$. Ruffini: $(x-1)(x^2-5x+6) = (x-1)(x-2)(x-3)$.`,
        },
        {
          id: 's00.algebra.L2.e6', type: 'tf', level: 1,
          prompt: String.raw`$x^2 + 1$ si scompone nel prodotto di due fattori di primo grado a coefficienti reali.`,
          answer: false,
          explain: String.raw`Falso: $x^2+1 \ge 1 > 0$ per ogni $x$ reale, quindi non ha radici reali e non può avere un fattore $(x-a)$ reale. È **irriducibile** in $\R$ (in $\C$ invece $x^2+1 = (x-i)(x+i)$).`,
        },
        {
          id: 's00.algebra.L2.e7', type: 'mcq', level: 2,
          prompt: String.raw`Scomponi completamente $x^3 - 4x$.`,
          options: ['$x(x-2)(x+2)$', '$x(x^2-4)$', '$(x-2)(x+2)$', '$x(x-2)^2$'],
          answer: 0,
          explain: String.raw`Raccolgo $x$, poi differenza di quadrati: $x(x-2)(x+2)$. $x(x^2-4)$ è giusto ma **non completo**; $(x-2)(x+2)$ ha perso il fattore $x$.`,
        },
      ],
    },
    {
      id: 's00.algebra.L3',
      title: 'Frazioni algebriche',
      cards: [
        {
          type: 'learn',
          title: 'Come le frazioni numeriche',
          body: String.raw`Una frazione algebrica è un rapporto di polinomi, come $\frac{x+1}{x^2-4}$. Le regole sono quelle delle frazioni, più una:

>! **Condizioni di esistenza (C.E.)**: il denominatore deve essere $\neq 0$. Qui $x \neq \pm 2$.

**Semplificare** si può solo con **fattori** comuni (prodotti), mai con addendi: prima si scompone, poi si semplifica.
$$\frac{x^2+3x}{x} = \frac{x(x+3)}{x} = x+3 \quad (x\neq0), \qquad\text{ma}\qquad \frac{x+3}{3} \neq x.$$`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Semplifica $\dfrac{x^2-4}{x^2+x-2}$.`,
          steps: [
            String.raw`Numeratore: $(x-2)(x+2)$.`,
            { text: String.raw`Denominatore: $x^2 + x - 2 = (x+2)(x-1)$.`,
              ask: { type: 'set', prompt: String.raw`Per quali $x$ si annulla $x^2+x-2$? (separa con ;)`, answer: ['-2', '1'], explain: String.raw`Somma $1$, prodotto $-2$: i numeri sono $2$ e $-1$, cioè $(x+2)(x-1)$, nulla in $-2$ e $1$.` } },
            String.raw`C.E.: $x\neq -2$, $x \neq 1$. Semplifico $(x+2)$: $\frac{x-2}{x-1}$.`,
          ],
          result: String.raw`$\dfrac{x^2-4}{x^2+x-2} = \dfrac{x-2}{x-1}$ per $x \neq -2, 1$`,
        },
        {
          id: 's00.algebra.L3.e1', type: 'mcq', level: 1,
          prompt: String.raw`Quale semplificazione è corretta?`,
          options: [String.raw`$\frac{x^2+3x}{x} = x+3$ per $x\neq0$`, String.raw`$\frac{x+3}{3} = x$`, String.raw`$\frac{x^2+1}{x} = x+1$`, String.raw`$\frac{x+2}{x+5} = \frac25$`],
          answer: 0,
          explain: String.raw`Solo nella prima $x$ è un **fattore** di tutto il numeratore. Nelle altre si "semplificano" addendi: per esempio con $x = 1$, $\frac{1+3}{3} = \frac43 \neq 1$.`,
        },
        {
          id: 's00.algebra.L3.e2', type: 'expr', level: 2, domain: [1.5, 3],
          prompt: String.raw`Calcola $\dfrac{1}{x-1} - \dfrac{1}{x+1}$ come un'unica frazione.`,
          answer: '2/(x^2-1)',
          explain: String.raw`Denominatore comune $(x-1)(x+1) = x^2-1$: $\frac{(x+1)-(x-1)}{x^2-1} = \frac{2}{x^2-1}$. Attento al segno: $-(x-1) = -x+1$.`,
        },
        {
          id: 's00.algebra.L3.e3', type: 'expr', level: 2,
          prompt: String.raw`Calcola $\dfrac1x + \dfrac{1}{x+1}$ come un'unica frazione.`,
          answer: '(2x+1)/(x*(x+1))',
          explain: String.raw`$\frac{(x+1) + x}{x(x+1)} = \frac{2x+1}{x(x+1)}$.`,
        },
        {
          id: 's00.algebra.L3.e4', type: 'set', level: 1,
          prompt: String.raw`Quali valori di $x$ vanno esclusi in $\dfrac{x+1}{x^2-5x+6}$? (separa con ;)`,
          answer: ['2', '3'],
          explain: String.raw`$x^2-5x+6 = (x-2)(x-3)$ si annulla in $2$ e $3$. Il numeratore non conta: $x=-1$ rende la frazione $0$, che va benissimo.`,
        },
        {
          id: 's00.algebra.L3.e5', type: 'expr', level: 2, domain: [1.5, 3],
          prompt: String.raw`Semplifica $\dfrac{x^2-2x+1}{x^2-1}$.`,
          answer: '(x-1)/(x+1)',
          explain: String.raw`$\frac{(x-1)^2}{(x-1)(x+1)} = \frac{x-1}{x+1}$, con C.E. $x\neq\pm1$.`,
        },
        {
          id: 's00.algebra.L3.e6', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $a, b, c$ (con $a+c\neq0$, $c\neq0$): $\dfrac{a+b}{a+c} = \dfrac{b}{c}$.`,
          answer: false,
          explain: String.raw`Falso: si è "semplificato" l'addendo $a$. Con $a = b = 1$, $c = 2$: $\frac23 \neq \frac12$.`,
        },
        {
          type: 'example',
          title: 'Dal primo itinere: raccogliere',
          problem: String.raw`La derivata di $f(x) = e^x(x^2+3x+3)$ è $e^x(x^2+3x+3) + e^x(2x+3)$. Scrivila come prodotto per studiarne il segno.`,
          steps: [
            String.raw`Raccolgo il fattore comune $e^x$: $e^x\big[(x^2+3x+3) + (2x+3)\big]$.`,
            { text: String.raw`Sommo: $e^x(x^2+5x+6)$.`,
              ask: { type: 'expr', prompt: String.raw`Quanto vale $(x^2+3x+3)+(2x+3)$?`, answer: 'x^2+5x+6', explain: String.raw`$x^2 + (3+2)x + (3+3)$.` } },
            String.raw`Scompongo: $f'(x) = e^x(x+2)(x+3)$, nulla in $x=-3$ e $x=-2$ (i punti stazionari dell'esercizio).`,
          ],
          result: String.raw`$f'(x) = e^x(x+2)(x+3)$`,
        },
        {
          id: 's00.algebra.L3.e7', type: 'expr', level: 3, domain: [2, 4],
          source: 'Appello 15/01/2026 · Parte B (asintoto orizzontale)',
          prompt: String.raw`Per capire come $f(x) = \frac{x-1}{2x-3}$ si avvicina all'asintoto $y = \frac12$ serve la differenza $\dfrac{x-1}{2x-3} - \dfrac12$. Scrivila come un'unica frazione.`,
          answer: '1/(2*(2x-3))',
          explain: String.raw`$\frac{2(x-1) - (2x-3)}{2(2x-3)} = \frac{2x - 2 - 2x + 3}{2(2x-3)} = \frac{1}{2(2x-3)}$. Per $x\to+\infty$ è positiva: il grafico sta **sopra** l'asintoto.`,
        },
      ],
    },
  ],
  practice: [
    { id: 's00.algebra.gen-sviluppo', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.pick([1, 1, 2, 3, -1]), c = R.pick([1, 1, 2, -1]);
        const b = R.nz(-6, 6), d = R.nz(-6, 6);
        const co = [a * c, a * d + b * c, b * d];
        return {
          type: 'expr',
          prompt: String.raw`Sviluppa $(${H.lin(a, b)})(${H.lin(c, d)})$.`,
          answer: `(${co[0]})*x^2+(${co[1]})*x+(${co[2]})`,
          explain: String.raw`Ogni termine per ogni termine: $${H.coef(a * c)}x^2 ${H.signed(a * d, 'x')} ${H.signed(b * c, 'x')} ${H.signed(b * d)} = ${H.poly(co)}$.`,
        };
      } },
    { id: 's00.algebra.gen-notevoli', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.pick([1, 2, 3]), b = R.nz(-5, 5);
        const kind = R.pick(['q', 'q', 'd']);
        if (kind === 'q') {
          const co = [a * a, 2 * a * b, b * b];
          return {
            type: 'expr',
            prompt: String.raw`Sviluppa $(${H.lin(a, b)})^2$.`,
            answer: `(${co[0]})*x^2+(${co[1]})*x+(${co[2]})`,
            explain: String.raw`Quadrato di binomio: quadrato del primo, **doppio prodotto**, quadrato del secondo: $${H.poly(co)}$.`,
          };
        }
        const B = Math.abs(b);
        return {
          type: 'expr',
          prompt: String.raw`Sviluppa $(${H.lin(a, B)})(${H.lin(a, -B)})$.`,
          answer: `${a * a}*x^2-${B * B}`,
          explain: String.raw`Somma per differenza: $${a === 1 ? 'x' : `(${a}x)`}^2 -${B}^2 = ${H.poly([a * a, 0, -B * B])}$.`,
        };
      } },
    { id: 's00.algebra.gen-trinomio', type: 'gen', level: 1,
      gen: (R) => {
        const [r1, r2] = two(R, -7, 7);
        const s = -(r1 + r2), p = r1 * r2;
        return {
          type: 'tuple',
          prompt: String.raw`Scrivi $${H.poly([1, s, p])} = (x-a)(x-b)$ con $a < b$.`,
          labels: ['a', 'b'],
          answer: [String(r1), String(r2)],
          explain: String.raw`$(x-a)(x-b) = x^2-(a+b)x+ab$: servono $a+b = ${r1 + r2}$ e $ab = ${p}$. I numeri sono $${r1}$ e $${r2}$: $${H.poly([1, s, p])} = ${fx(r1)}${fx(r2)}$.`,
        };
      } },
    { id: 's00.algebra.gen-ruffini', type: 'gen', level: 2,
      gen: (R) => {
        const rs = R.sample([-3, -2, -1, 1, 2, 3, 4], 3).sort((u, v) => u - v);
        const [a, b, c] = rs;
        const co = [1, -(a + b + c), a * b + a * c + b * c, -a * b * c];
        const k = R.pick(rs);
        const others = rs.filter((r) => r !== k);
        const q = [1, -(others[0] + others[1]), others[0] * others[1]];
        return {
          type: 'set',
          prompt: String.raw`Trova tutte le radici di $P(x) = ${H.poly(co)}$ (separale con ;).`,
          answer: rs.map(String),
          explain: String.raw`Cerco tra i divisori del termine noto $${co[3]}$: $P(${k}) = 0$. Ruffini: $P(x) = ${fx(k)}(${H.poly(q)})$, e il fattore di secondo grado ha radici $${others[0]}$ e $${others[1]}$. Radici: $${listTex(rs)}$.`,
        };
      } },
    { id: 's00.algebra.gen-valore', type: 'gen', level: 1,
      gen: (R) => {
        const co = [R.nz(-3, 3), R.int(-5, 5), R.int(-6, 6), R.int(-9, 9)];
        const x = R.nz(-3, 3);
        const v = co[0] * x ** 3 + co[1] * x ** 2 + co[2] * x + co[3];
        return {
          type: 'num',
          prompt: String.raw`Sia $P(x) = ${H.poly(co)}$. Calcola $P(${x})$.`,
          answer: String(v),
          explain: String.raw`Sostituisco con le parentesi: $${co[0]}\cdot(${x})^3 + (${co[1]})\cdot(${x})^2 + (${co[2]})\cdot(${x}) + (${co[3]}) = ${co[0] * x ** 3} + ${co[1] * x ** 2} + ${co[2] * x} + ${co[3]} = ${v}$.`.replace(/\+ -/g, '- '),
        };
      } },
    { id: 's00.algebra.gen-semplifica', type: 'gen', level: 2,
      gen: (R) => {
        const [a, b, c] = R.sample([-4, -3, -2, -1, 1, 2, 3, 4, 5], 3);
        const N = [1, -(a + b), a * b], D = [1, -(a + c), a * c];
        return {
          type: 'expr', domain: [5.5, 8],
          prompt: String.raw`Semplifica $\dfrac{${H.poly(N)}}{${H.poly(D)}}$.`,
          answer: `(${xm(b)})/(${xm(c)})`,
          explain: String.raw`Scompongo: $\frac{${fx(a)}${fx(b)}}{${fx(a)}${fx(c)}}$. Semplifico il fattore comune ${'$'}${fx(a)}${'$'}: $\frac{${xm(b)}}{${xm(c)}}$, con C.E. $x\neq ${Math.min(a, c)}$, $x \neq ${Math.max(a, c)}$.`,
        };
      } },
    {
      id: 's00.algebra.p1', type: 'mcq', level: 2,
      prompt: String.raw`Per quale valore di $k$ il polinomio $x^3 + kx - 6$ è divisibile per $(x-2)$?`,
      options: ['$k = -1$', '$k = 1$', '$k = 3$', '$k = -3$'],
      answer: 0,
      explain: String.raw`Ruffini: serve $P(2) = 0$, cioè $8 + 2k - 6 = 0$, $k = -1$.`,
    },
    {
      id: 's00.algebra.p2', type: 'expr', level: 2,
      prompt: String.raw`Sviluppa $(x^2 - 1)(x^2+1)$.`,
      answer: 'x^4-1',
      explain: String.raw`Somma per differenza con $a = x^2$, $b = 1$: $x^4 - 1$.`,
    },
    {
      id: 's00.algebra.p3', type: 'tf', level: 2,
      prompt: String.raw`$\dfrac{x^2-9}{x-3} = x+3$ per ogni $x\in\R$.`,
      answer: false,
      explain: String.raw`Vale solo per $x\neq 3$: in $x = 3$ la frazione di sinistra non esiste. Semplificare non cancella le condizioni di esistenza.`,
    },
    {
      id: 's00.algebra.p4', type: 'set', level: 2,
      prompt: String.raw`Trova le radici reali di $x^3 - x^2 - x + 1$ (separale con ;, ogni radice una volta).`,
      answer: ['1', '-1'],
      explain: String.raw`Raccoglimento parziale: $x^2(x-1) - (x-1) = (x-1)(x^2-1) = (x-1)^2(x+1)$. Radici $1$ (doppia) e $-1$.`,
    },
    {
      id: 's00.algebra.p5', type: 'mcq', level: 3,
      source: 'Appello 10/02/2026 · Parte B (studio di funzione)',
      prompt: String.raw`Per $x>2$, la derivata di $(x^2-3)e^{2-x}$ è $e^{2-x}(-x^2+2x+3)$. Quale scomposizione è corretta?`,
      options: ['$-e^{2-x}(x-3)(x+1)$', '$e^{2-x}(x-3)(x+1)$', '$-e^{2-x}(x+3)(x-1)$', '$e^{2-x}(x+3)(x-1)$'],
      answer: 0,
      explain: String.raw`$-x^2+2x+3 = -(x^2-2x-3) = -(x-3)(x+1)$. Le altre o perdono il segno meno o scompongono $x^2+2x-3$, che è il trinomio del ramo $x<2$.`,
    },
  ],
  flashcards: [
    { id: 's00.algebra.fc1', kind: 'formula', front: 'Prodotti notevoli', back: String.raw`$(a\pm b)^2 = a^2\pm2ab+b^2$; $(a+b)(a-b) = a^2-b^2$; $(a+b)^3 = a^3+3a^2b+3ab^2+b^3$; $a^3\mp b^3 = (a\mp b)(a^2\pm ab+b^2)$.` },
    { id: 's00.algebra.fc2', kind: 'metodo', front: String.raw`Scomporre $x^2+sx+p$`, back: String.raw`Cerco $m, n$ con $m+n = s$ e $mn = p$: allora $x^2+sx+p = (x+m)(x+n)$. Se non li trovo uso la formula delle equazioni di 2° grado.` },
    { id: 's00.algebra.fc3', kind: 'thm', front: 'Teorema di Ruffini', back: String.raw`$P(a) = 0 \iff (x-a)$ divide $P(x)$. Le radici intere (con primo coefficiente $1$) vanno cercate fra i divisori del termine noto.` },
    { id: 's00.algebra.fc4', kind: 'metodo', front: 'Ordine delle strategie di scomposizione', back: 'Raccoglimento totale → prodotti notevoli → trinomio somma/prodotto → raccoglimento parziale → Ruffini.' },
    { id: 's00.algebra.fc5', kind: 'errore', front: 'Semplificare una frazione algebrica', back: String.raw`Si semplificano solo **fattori**, dopo aver scomposto: $\frac{x(x+3)}{x} = x+3$, ma $\frac{x+3}{3}\neq x$. Le C.E. (denominatore $\neq0$) restano anche dopo la semplificazione.` },
    { id: 's00.algebra.fc6', kind: 'def', front: 'Grado di un polinomio', back: String.raw`L'esponente massimo della variabile con coefficiente non nullo. $\deg(PQ) = \deg P + \deg Q$.` },
  ],
});

// =====================================================================
// s00.equazioni
// =====================================================================
/** "ax + by = c" in LaTeX */
const eq2 = (a, b, c) => {
  const t = [];
  const add = (k, v) => {
    if (k === 0) return;
    const abs = Math.abs(k) === 1 ? '' : String(Math.abs(k));
    t.push(t.length === 0 ? (k < 0 ? '-' : '') + abs + v : (k < 0 ? ' - ' : ' + ') + abs + v);
  };
  add(a, 'x');
  add(b, 'y');
  return `${t.join('') || '0'} = ${c}`;
};

S.push({
  id: 's00.equazioni',
  title: 'Equazioni e sistemi',
  summary: String.raw`Saprai risolvere equazioni di primo e secondo grado, biquadratiche, fratte, con modulo e irrazionali semplici, e sistemi lineari 2×2: è ciò che serve per trovare zeri e punti stazionari.`,
  prereq: ['s00.algebra'],
  examRefs: ['Appello 10/02/2026 · Parte B (punti stazionari)', 'Appello 06/07/2026 · Parte B (numeri complessi)'],
  lessons: [
    {
      id: 's00.equazioni.L1',
      title: 'Che cosa vuol dire risolvere',
      cards: [
        {
          type: 'learn',
          title: 'Un\'equazione è una domanda',
          body: String.raw`$3x - 5 = 7$ chiede: **per quali numeri $x$ l'uguaglianza è vera?** Quei numeri sono le **soluzioni**. Qui $x = 4$, perché $3\cdot4 - 5 = 7$.

Per trovarle trasformo l'equazione in una **equivalente** (stesse soluzioni) e più semplice:

>* **Principi di equivalenza.** Posso (1) sommare o sottrarre la stessa quantità a entrambi i membri; (2) moltiplicare o dividere entrambi i membri per lo stesso numero **diverso da zero**.

"Portare dall'altra parte cambiando segno" è solo il principio (1) abbreviato. Alla fine **verifico** sostituendo.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Risolvi $3x - 5 = 7$.`,
          steps: [
            String.raw`Sommo $5$ a entrambi i membri: $3x = 12$.`,
            { text: String.raw`Divido per $3$: $x = 4$.`,
              ask: { type: 'num', prompt: String.raw`Da $3x = 12$, quanto vale $x$?`, answer: '4', explain: String.raw`Divido entrambi i membri per $3 \neq 0$.` } },
            String.raw`Verifica: $3\cdot 4 - 5 = 7$. ✓`,
          ],
          result: String.raw`$x = 4$`,
        },
        {
          id: 's00.equazioni.L1.e1', type: 'num', level: 1,
          prompt: String.raw`Risolvi $2x + 3 = 11$.`,
          answer: '4',
          explain: String.raw`$2x = 8$, quindi $x = 4$. Verifica: $8 + 3 = 11$.`,
        },
        {
          id: 's00.equazioni.L1.e2', type: 'num', level: 1,
          prompt: String.raw`Risolvi $5 - 2x = 3x + 20$.`,
          answer: '-3',
          explain: String.raw`Porto le $x$ a destra e i numeri a sinistra: $5 - 20 = 3x + 2x$, cioè $-15 = 5x$, $x = -3$.`,
        },
        {
          id: 's00.equazioni.L1.e3', type: 'num', level: 1,
          prompt: String.raw`Risolvi $\dfrac{x}{2} + \dfrac{x}{3} = 5$.`,
          answer: '6',
          explain: String.raw`Moltiplico tutto per $6$ (mcm): $3x + 2x = 30$, $x = 6$.`,
        },
        {
          id: 's00.equazioni.L1.e4', type: 'mcq', level: 1,
          prompt: String.raw`L'equazione $2(x+1) = 2x + 2$ ha:`,
          options: ['infinite soluzioni (è un\'identità)', 'nessuna soluzione', 'la sola soluzione $x = 0$', 'la sola soluzione $x = 1$'],
          answer: 0,
          explain: String.raw`Sviluppando: $2x + 2 = 2x + 2$, cioè $0\cdot x = 0$: vera per **ogni** $x$. Se fosse venuto $0\cdot x = 5$ non ci sarebbero soluzioni (equazione impossibile).`,
        },
        {
          id: 's00.equazioni.L1.e5', type: 'tf', level: 2,
          prompt: String.raw`Moltiplicando entrambi i membri di un'equazione per $x$ si ottiene sempre un'equazione con le stesse soluzioni.`,
          answer: false,
          explain: String.raw`Falso: $x$ potrebbe valere $0$, e il principio vale solo per fattori non nulli. Per esempio $x - 1 = 0$ ha solo $x=1$, ma $x(x-1) = 0$ ha anche $x = 0$.`,
        },
        {
          type: 'learn',
          title: 'Sistemi lineari 2×2',
          body: String.raw`Un sistema chiede una coppia $(x, y)$ che soddisfi **entrambe** le equazioni.

- **Sostituzione**: ricavo una variabile da un'equazione e la sostituisco nell'altra.
- **Riduzione**: sommo o sottraggo le equazioni (moltiplicate per numeri opportuni) per eliminare una variabile.

Geometricamente sono due rette: una soluzione = rette incidenti; nessuna = parallele; infinite = coincidenti.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: riduzione',
          problem: String.raw`Risolvi $\begin{cases} x + y = 5\\ x - y = 1\end{cases}$`,
          steps: [
            String.raw`Sommo le due equazioni: $2x = 6$, quindi $x = 3$.`,
            { text: String.raw`Sostituisco nella prima: $3 + y = 5$, $y = 2$.`,
              ask: { type: 'num', prompt: String.raw`Con $x = 3$ nella prima equazione, quanto vale $y$?`, answer: '2', explain: String.raw`$3 + y = 5 \Rightarrow y = 2$.` } },
            String.raw`Verifica nella seconda: $3 - 2 = 1$. ✓`,
          ],
          result: String.raw`$(x, y) = (3, 2)$`,
        },
        {
          id: 's00.equazioni.L1.e6', type: 'tuple', level: 1,
          prompt: String.raw`Risolvi $\begin{cases} 2x + y = 7\\ x - y = -1\end{cases}$`,
          labels: ['x', 'y'],
          answer: ['2', '3'],
          explain: String.raw`Sommo: $3x = 6$, $x = 2$. Dalla seconda $y = x + 1 = 3$. Verifica: $4 + 3 = 7$.`,
        },
        {
          id: 's00.equazioni.L1.e7', type: 'tuple', level: 2,
          prompt: String.raw`Risolvi $\begin{cases} 3x - 2y = 4\\ x + 2y = 4\end{cases}$`,
          labels: ['x', 'y'],
          answer: ['2', '1'],
          explain: String.raw`Sommo: $4x = 8$, $x = 2$. Poi $2 + 2y = 4$, $y = 1$.`,
        },
      ],
    },
    {
      id: 's00.equazioni.L2',
      title: 'Equazioni di secondo grado',
      cards: [
        {
          type: 'learn',
          title: 'La formula risolutiva',
          body: String.raw`$ax^2 + bx + c = 0$ con $a\neq 0$. Prima i casi facili:

- **spuria** ($c = 0$): $x(ax+b) = 0$, quindi $x = 0$ oppure $x = -\frac ba$ (**legge di annullamento del prodotto**: un prodotto è $0$ se e solo se un fattore è $0$);
- **pura** ($b = 0$): $x^2 = -\frac ca$, con soluzioni $\pm\sqrt{-c/a}$ se $-c/a \ge 0$.

In generale si calcola il **discriminante** $\Delta = b^2 - 4ac$:

>* $\Delta > 0$: due soluzioni $x_{1,2} = \dfrac{-b \pm \sqrt\Delta}{2a}$; $\;\Delta = 0$: una soluzione doppia $x = -\frac{b}{2a}$; $\;\Delta < 0$: nessuna soluzione reale.`,
        },
        {
          type: 'learn',
          title: 'Da dove viene (completare il quadrato)',
          body: String.raw`Divido per $a$ e aggiungo e tolgo $\left(\frac{b}{2a}\right)^2$:
$$x^2 + \frac bax + \frac ca = \left(x + \frac{b}{2a}\right)^2 - \frac{b^2 - 4ac}{4a^2}.$$
Quindi l'equazione diventa $\left(x + \frac{b}{2a}\right)^2 = \frac{\Delta}{4a^2}$: se $\Delta<0$ un quadrato dovrebbe essere negativo (impossibile), altrimenti $x + \frac{b}{2a} = \pm\frac{\sqrt\Delta}{2a}$.

> Questo trucco serve anche negli integrali: $x^2 - x + 1 = \left(x - \frac12\right)^2 + \frac34$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Risolvi $x^2 - 5x + 6 = 0$.`,
          steps: [
            String.raw`$a = 1$, $b = -5$, $c = 6$.`,
            { text: String.raw`$\Delta = 25 - 24 = 1$.`,
              ask: { type: 'num', prompt: String.raw`Calcola $\Delta = b^2 - 4ac$.`, answer: '1', explain: String.raw`$(-5)^2 - 4\cdot1\cdot6 = 25 - 24 = 1$. Attento: $(-5)^2 = +25$.` } },
            String.raw`$x = \frac{5 \pm 1}{2}$, cioè $x = 2$ e $x = 3$.`,
          ],
          result: String.raw`$x = 2$, $x = 3$`,
        },
        {
          id: 's00.equazioni.L2.e1', type: 'set', level: 1,
          prompt: String.raw`Risolvi $x^2 - 9 = 0$ (soluzioni separate da ;).`,
          answer: ['3', '-3'],
          explain: String.raw`$x^2 = 9$ ha **due** soluzioni: $\pm3$. Scrivere solo $x = 3$ è l'errore più comune.`,
        },
        {
          id: 's00.equazioni.L2.e2', type: 'mcq', level: 1,
          prompt: String.raw`Uno studente risolve $x^2 = 4x$ dividendo per $x$ e trova $x = 4$. Cosa ha sbagliato?`,
          options: ['Ha perso la soluzione $x = 0$', 'Niente, $x = 4$ è l\'unica soluzione', 'Doveva trovare $x = \\pm 4$', 'Doveva trovare $x = 2$'],
          answer: 0,
          explain: String.raw`Dividere per $x$ è lecito solo se $x\neq0$. Corretto: $x^2 - 4x = 0 \Rightarrow x(x-4) = 0 \Rightarrow x = 0$ o $x = 4$.`,
        },
        {
          id: 's00.equazioni.L2.e3', type: 'set', level: 1,
          prompt: String.raw`Risolvi $x^2 + x - 6 = 0$.`,
          answer: ['2', '-3'],
          explain: String.raw`$\Delta = 1 + 24 = 25$, $x = \frac{-1\pm5}{2}$: $2$ e $-3$. (Oppure: somma $-1$, prodotto $-6$.)`,
        },
        {
          id: 's00.equazioni.L2.e4', type: 'mcq', level: 1,
          prompt: String.raw`Quante soluzioni reali ha $x^2 + 2x + 5 = 0$?`,
          options: ['Nessuna', 'Una', 'Due', 'Infinite'],
          answer: 0, noShuffle: true,
          explain: String.raw`$\Delta = 4 - 20 = -16 < 0$. Infatti $x^2+2x+5 = (x+1)^2 + 4 \ge 4$.`,
        },
        {
          id: 's00.equazioni.L2.e5', type: 'set', level: 2,
          prompt: String.raw`Risolvi $4x^2 - 4x + 1 = 0$.`,
          answer: ['1/2'],
          explain: String.raw`$\Delta = 16 - 16 = 0$: soluzione doppia $x = \frac{4}{8} = \frac12$. Infatti $4x^2 - 4x + 1 = (2x-1)^2$.`,
        },
        {
          type: 'learn',
          title: 'Biquadratiche',
          body: String.raw`$ax^4 + bx^2 + c = 0$ si risolve con la **sostituzione** $t = x^2$: diventa $at^2 + bt + c = 0$. Per ogni soluzione $t \ge 0$ ottengo $x = \pm\sqrt t$; le $t < 0$ non danno soluzioni reali.

Esempio: $x^4 - 5x^2 + 4 = 0 \Rightarrow t^2 - 5t + 4 = 0 \Rightarrow t = 1, 4 \Rightarrow x = \pm1, \pm2$.`,
        },
        {
          id: 's00.equazioni.L2.e6', type: 'set', level: 2,
          prompt: String.raw`Risolvi $x^4 - 10x^2 + 9 = 0$.`,
          answer: ['1', '-1', '3', '-3'],
          explain: String.raw`$t = x^2$: $t^2 - 10t + 9 = 0$, $t = 1$ o $t = 9$. Quindi $x = \pm1$, $x = \pm3$.`,
        },
        {
          id: 's00.equazioni.L2.e7', type: 'mcq', level: 3,
          source: 'Appello 06/07/2026 · Parte B (numeri complessi)',
          prompt: String.raw`Quante soluzioni **reali** ha $x^4 - 4x^2 + 13 = 0$?`,
          options: ['Nessuna', 'Due', 'Quattro', 'Una'],
          answer: 0,
          explain: String.raw`Con $t = x^2$: $t^2 - 4t + 13 = 0$, $\Delta = 16 - 52 = -36 < 0$, nessuna $t$ reale, quindi nessuna $x$ reale. All'esame l'equazione era in $\C$: lì $t = 2 \pm 3i$ e ci sono 4 soluzioni complesse (le vedrai nella sezione sui complessi).`,
        },
      ],
    },
    {
      id: 's00.equazioni.L3',
      title: 'Fratte, con modulo, irrazionali',
      cards: [
        {
          type: 'learn',
          title: 'Equazioni fratte',
          body: String.raw`Se la $x$ compare al denominatore:

1. scrivo le **condizioni di esistenza** (denominatori $\neq0$);
2. porto tutto a denominatore comune e lo elimino (lecito: è $\neq0$ per le C.E.);
3. risolvo e **scarto** le soluzioni che violano le C.E.

>! Saltare il passo 3 è l'errore classico: si "trova" una soluzione che rende nullo un denominatore.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: la soluzione da scartare',
          problem: String.raw`Risolvi $\dfrac{x+1}{x-2} = \dfrac{3}{x-2}$.`,
          steps: [
            String.raw`C.E.: $x \neq 2$.`,
            { text: String.raw`Moltiplico per $x-2$: $x + 1 = 3$, quindi $x = 2$.`,
              ask: { type: 'num', prompt: String.raw`Quale valore si ottiene da $x + 1 = 3$?`, answer: '2', explain: String.raw`$x = 3 - 1 = 2$.` } },
            String.raw`Ma $x = 2$ viola le C.E.: va scartato.`,
          ],
          result: 'L\'equazione è impossibile (nessuna soluzione).',
        },
        {
          id: 's00.equazioni.L3.e1', type: 'num', level: 1,
          prompt: String.raw`Risolvi $\dfrac1x + \dfrac{1}{2x} = 3$.`,
          answer: '1/2',
          explain: String.raw`C.E. $x\neq0$. Denominatore comune $2x$: $\frac{2+1}{2x} = 3 \Rightarrow 3 = 6x \Rightarrow x = \frac12$, accettabile.`,
        },
        {
          id: 's00.equazioni.L3.e2', type: 'num', level: 2,
          prompt: String.raw`Risolvi $\dfrac{x}{x-1} - \dfrac{2}{x+1} = 1$.`,
          answer: '3',
          explain: String.raw`C.E. $x\neq\pm1$. Moltiplico per $(x-1)(x+1)$: $x(x+1) - 2(x-1) = x^2 - 1$, cioè $x^2 - x + 2 = x^2 - 1$, quindi $x = 3$, accettabile. Verifica: $\frac32 - \frac24 = 1$.`,
        },
        {
          id: 's00.equazioni.L3.e3', type: 'set', level: 2,
          prompt: String.raw`Risolvi $\dfrac{x^2-4}{x-2} = 0$.`,
          answer: ['-2'],
          explain: String.raw`C.E. $x\neq 2$. Una frazione è nulla se e solo se è nullo il numeratore (e il denominatore no): $x^2 = 4$, cioè $x = \pm 2$, ma $x = 2$ è escluso. Resta $x = -2$.`,
        },
        {
          type: 'learn',
          title: 'Modulo e radici',
          body: String.raw`**Valore assoluto**: $|A| = A$ se $A\ge0$, $|A| = -A$ se $A<0$. È la distanza da $0$, quindi:

>* Per $k > 0$: $|A| = k \iff A = k$ oppure $A = -k$. Se $k < 0$ non ci sono soluzioni.

**Equazioni irrazionali** $\sqrt{A} = B$: elevo al quadrato, ma l'elevamento può **aggiungere** soluzioni false. Quindi impongo $B \ge 0$ (la radice è non negativa) oppure verifico alla fine.`,
        },
        {
          id: 's00.equazioni.L3.e4', type: 'set', level: 1,
          prompt: String.raw`Risolvi $|2x - 1| = 3$.`,
          answer: ['2', '-1'],
          explain: String.raw`$2x - 1 = 3 \Rightarrow x = 2$; $2x - 1 = -3 \Rightarrow x = -1$.`,
        },
        {
          id: 's00.equazioni.L3.e5', type: 'num', level: 2,
          prompt: String.raw`Risolvi $\sqrt{x+3} = x + 1$.`,
          answer: '1',
          explain: String.raw`Serve $x + 1 \ge 0$. Al quadrato: $x + 3 = x^2 + 2x + 1 \Rightarrow x^2 + x - 2 = 0 \Rightarrow x = 1$ o $x = -2$. Ma $x = -2$ dà $\sqrt1 = 1$ contro $-1$: falsa (viola $x+1\ge0$). Unica soluzione $x = 1$.`,
        },
        {
          id: 's00.equazioni.L3.e6', type: 'tf', level: 1,
          prompt: String.raw`Un'equazione di secondo grado con $\Delta = 0$ non ha soluzioni.`,
          answer: false,
          explain: String.raw`Con $\Delta = 0$ c'è **una** soluzione (doppia), $x = -\frac b{2a}$. Nessuna soluzione reale quando $\Delta < 0$.`,
        },
        {
          id: 's00.equazioni.L3.e7', type: 'problem', level: 3,
          source: 'Appello 10/02/2026 · Parte B (studio di funzione)',
          prompt: String.raw`Per $f(x) = (x^2-3)e^{-|2-x|}$ si trova
$$f'(x) = \begin{cases} e^{x-2}(x^2+2x-3) & x < 2\\ -e^{2-x}(x^2-2x-3) & x > 2\end{cases}$$
Trova i punti stazionari (dove $f'(x) = 0$), ricordando che ogni formula vale solo nel suo intervallo.`,
          parts: [
            { type: 'set', prompt: String.raw`Soluzioni di $f'(x) = 0$ con $x < 2$:`, answer: ['-3', '1'], explain: String.raw`$e^{x-2} > 0$, quindi $x^2 + 2x - 3 = 0$: $(x+3)(x-1) = 0$. Entrambe sono $< 2$.` },
            { type: 'set', prompt: String.raw`Soluzioni di $f'(x) = 0$ con $x > 2$:`, answer: ['3'], explain: String.raw`$x^2 - 2x - 3 = (x-3)(x+1) = 0$: $x = 3$ va bene, $x = -1$ **no** perché non è $> 2$.` },
          ],
          solution: String.raw`L'esponenziale non si annulla mai, quindi conta solo il polinomio. Per $x<2$: $x^2+2x-3 = (x+3)(x-1) = 0$ dà $x=-3$ e $x=1$ (entrambi accettabili). Per $x>2$: $x^2-2x-3 = (x-3)(x+1) = 0$ dà $x = 3$ (accettabile) e $x = -1$ (da scartare, fuori dal ramo). Punti stazionari: $-3, 1, 3$.`,
        },
      ],
    },
  ],
  practice: [
    { id: 's00.equazioni.gen-lineare', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.nz(-6, 6);
        let c = R.int(-6, 6);
        while (c === a) c = R.int(-6, 6);
        const b = R.int(-9, 9), p = R.nz(-9, 9);
        const d = b + p;
        return {
          type: 'num',
          prompt: String.raw`Risolvi $${H.lin(a, b)} = ${H.lin(c, d)}$.`,
          answer: H.fracStr(p, a - c),
          explain: String.raw`Porto le $x$ a sinistra e i numeri a destra: $${H.coef(a - c)}x = ${d} ${H.signed(-b)}$, cioè $${H.coef(a - c)}x = ${p}$${a - c === 1 ? '' : `, quindi $x = ${H.frac(p, a - c)}$`}.`,
        };
      } },
    { id: 's00.equazioni.gen-secondo', type: 'gen', level: 2,
      gen: (R) => {
        const m = R.pick([1, 1, 1, 2, 3]);
        let p = R.int(-6, 6);
        const r = R.int(-5, 5);
        while (p === m * r || (m > 1 && H.gcd(p, m) !== 1)) p = R.int(-6, 6);
        const sg0 = R.pick([1, 1, -1]);
        const co = [sg0 * m, -sg0 * (p + m * r), sg0 * p * r];
        const D = co[1] ** 2 - 4 * co[0] * co[2];
        const sq = Math.round(Math.sqrt(D));
        return {
          type: 'set',
          prompt: String.raw`Risolvi $${H.poly(co)} = 0$ (soluzioni separate da ;).`,
          answer: [H.fracStr(p, m), String(r)],
          explain: String.raw`$\Delta = (${co[1]})^2 - 4\cdot(${co[0]})\cdot(${co[2]}) = ${D}$, $\sqrt\Delta = ${sq}$. Quindi $x = \frac{${-co[1]} \pm ${sq}}{${2 * co[0]}}$: $x = ${H.frac(p, m)}$ e $x = ${r}$.`,
        };
      } },
    { id: 's00.equazioni.gen-delta', type: 'gen', level: 1,
      gen: (R) => {
        const kind = R.pick([0, 1, 2]);
        let co;
        if (kind === 0) {
          const a = R.pick([1, 2, -1]), h = R.int(-4, 4), k = R.int(1, 6);
          co = [a, -2 * a * h, a * h * h + a * k]; // a[(x-h)^2 + k]
        } else if (kind === 1) {
          const a = R.pick([1, 4, 9, -1]), h = R.nz(-4, 4);
          const s = Math.sqrt(Math.abs(a));
          co = [a, -2 * Math.sign(a) * s * h, Math.sign(a) * h * h]; // ±(s x - h)^2
        } else {
          const [r1, r2] = two(R, -5, 5);
          const a = R.pick([1, 2, -1]);
          co = [a, -a * (r1 + r2), a * r1 * r2];
        }
        const D = co[1] ** 2 - 4 * co[0] * co[2];
        const ans = D < 0 ? 0 : D === 0 ? 1 : 2;
        return {
          type: 'mcq', noShuffle: true,
          prompt: String.raw`Quante soluzioni reali ha $${H.poly(co)} = 0$?`,
          options: ['Nessuna', 'Una (doppia)', 'Due distinte'],
          answer: ans,
          explain: String.raw`$\Delta = b^2 - 4ac = (${co[1]})^2 - 4\cdot(${co[0]})\cdot(${co[2]}) = ${D}$${D < 0 ? ' < 0: nessuna soluzione reale' : D === 0 ? ': una soluzione doppia' : ' > 0: due soluzioni distinte'}.`.replace('$ < 0', ' < 0$').replace('$ > 0', ' > 0$'),
        };
      } },
    { id: 's00.equazioni.gen-biquadratica', type: 'gen', level: 2,
      gen: (R) => {
        const [p, q] = two(R, 1, 4);
        const neg = R.chance(0.3);
        const P2 = p * p, Q2 = q * q;
        if (neg) {
          const co = [1, 0, Q2 - P2, 0, -P2 * Q2];
          return {
            type: 'set',
            prompt: String.raw`Trova le soluzioni reali di $${H.poly(co)} = 0$.`,
            answer: [String(p), String(-p)],
            explain: String.raw`Con $t = x^2$: $t^2 ${H.signed(Q2 - P2, 't')} - ${P2 * Q2} = 0$, cioè $(t - ${P2})(t + ${Q2}) = 0$. $t = ${P2}$ dà $x = \pm${p}$; $t = -${Q2} < 0$ non dà soluzioni reali.`,
          };
        }
        const co = [1, 0, -(P2 + Q2), 0, P2 * Q2];
        return {
          type: 'set',
          prompt: String.raw`Risolvi $${H.poly(co)} = 0$.`,
          answer: [String(p), String(-p), String(q), String(-q)],
          explain: String.raw`Con $t = x^2$: $t^2 - ${P2 + Q2}t + ${P2 * Q2} = 0$, cioè $t = ${P2}$ o $t = ${Q2}$. Quindi $x = \pm${p}$ e $x = \pm${q}$.`,
        };
      } },
    { id: 's00.equazioni.gen-sistema', type: 'gen', level: 2,
      gen: (R) => {
        const x = R.int(-5, 5), y = R.int(-5, 5);
        let a1, b1, a2, b2;
        do {
          a1 = R.nz(-4, 4); b1 = R.nz(-4, 4); a2 = R.nz(-4, 4); b2 = R.nz(-4, 4);
        } while (a1 * b2 - a2 * b1 === 0);
        const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
        const det = a1 * b2 - a2 * b1;
        return {
          type: 'tuple',
          prompt: String.raw`Risolvi $\begin{cases} ${eq2(a1, b1, c1)}\\ ${eq2(a2, b2, c2)}\end{cases}$`,
          labels: ['x', 'y'],
          answer: [String(x), String(y)],
          explain: String.raw`Per riduzione: moltiplico la prima per $${b2}$ e la seconda per $${b1}$ e sottraggo: $${det}x = ${c1 * b2 - c2 * b1}$, quindi $x = ${x}$. Sostituendo nella prima: $y = ${y}$. Verifica: $${a1}\cdot(${x}) + (${b1})\cdot(${y}) = ${c1}$.`,
        };
      } },
    { id: 's00.equazioni.gen-modulo', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.pick([1, 1, 2, 3]), b = R.nz(-6, 6), c = R.int(1, 7);
        if (R.chance(0.15)) {
          return {
            type: 'tf',
            prompt: String.raw`L'equazione $|${H.lin(a, b)}| = -${c}$ ha almeno una soluzione reale.`,
            answer: false,
            explain: String.raw`Un valore assoluto è sempre $\ge 0$: non può valere $-${c}$. Equazione impossibile.`,
          };
        }
        return {
          type: 'set',
          prompt: String.raw`Risolvi $|${H.lin(a, b)}| = ${c}$.`,
          answer: [H.fracStr(c - b, a), H.fracStr(-c - b, a)],
          explain: String.raw`$${H.lin(a, b)} = ${c} \Rightarrow x = ${H.frac(c - b, a)}$; $\;${H.lin(a, b)} = -${c} \Rightarrow x = ${H.frac(-c - b, a)}$.`,
        };
      } },
    { id: 's00.equazioni.gen-fratta', type: 'gen', level: 2,
      gen: (R) => {
        const b = R.nz(-5, 5);
        let a = R.int(-6, 6);
        while (a === -b) a = R.int(-6, 6);
        let k = R.nz(-4, 4);
        while (k === 1) k = R.nz(-4, 4);
        return {
          type: 'num',
          prompt: String.raw`Risolvi $\dfrac{${H.lin(1, a)}}{${xm(b)}} = ${k}$.`,
          answer: H.fracStr(k * b + a, k - 1),
          explain: String.raw`C.E. $x \neq ${b}$. Moltiplico per $${xm(b)}$: $${H.lin(1, a)} = ${k}(${xm(b)})$, cioè $${H.lin(1 - k, 0)} = ${-k * b - a}$, quindi $x = ${H.frac(k * b + a, k - 1)}$, diverso da $${b}$: accettabile.`,
        };
      } },
    {
      id: 's00.equazioni.p1', type: 'mcq', level: 2,
      prompt: String.raw`Per quali $k$ l'equazione $x^2 + 2x + k = 0$ ha due soluzioni reali distinte?`,
      options: ['$k < 1$', '$k > 1$', '$k \\le 1$', '$k < -1$'],
      answer: 0,
      explain: String.raw`Serve $\Delta = 4 - 4k > 0$, cioè $k < 1$. Con $k = 1$ la soluzione è doppia ($\Delta = 0$), quindi $k\le1$ è sbagliato.`,
    },
    {
      id: 's00.equazioni.p2', type: 'set', level: 2,
      prompt: String.raw`Risolvi $x^3 = 4x$.`,
      answer: ['0', '2', '-2'],
      explain: String.raw`$x^3 - 4x = x(x-2)(x+2) = 0$: tre soluzioni. Dividere per $x$ farebbe perdere $x = 0$.`,
    },
    {
      id: 's00.equazioni.p3', type: 'num', level: 2,
      prompt: String.raw`Risolvi $\sqrt{2x+1} = x - 1$.`,
      answer: '4',
      explain: String.raw`Serve $x \ge 1$. Al quadrato: $2x + 1 = x^2 - 2x + 1 \Rightarrow x^2 - 4x = 0 \Rightarrow x = 0$ o $x = 4$. $x = 0$ viola $x\ge1$ (darebbe $1 = -1$). Soluzione: $x = 4$ ($\sqrt9 = 3$ ✓).`,
    },
    {
      id: 's00.equazioni.p4', type: 'open', level: 2,
      prompt: String.raw`Spiega perché, risolvendo $\sqrt{A(x)} = B(x)$ elevando al quadrato, bisogna controllare le soluzioni trovate. Fai un esempio.`,
      answer: String.raw`Elevare al quadrato non è un'operazione equivalente: da $A = B^2$ seguono sia $\sqrt A = B$ sia $\sqrt A = -B$. Si possono quindi ottenere soluzioni "estranee" per cui $B < 0$. Esempio: $\sqrt{x+3} = x+1$ porta a $x^2+x-2 = 0$, cioè $x = 1$ o $x = -2$; ma per $x = -2$ si ha $\sqrt1 = 1 \neq -1$. Si risolve imponendo $B(x)\ge0$ oppure verificando le soluzioni.`,
      rubric: ['Dice che il quadrato non è un passaggio equivalente', 'Spiega che entrano le soluzioni di $\\sqrt A = -B$', 'Indica il rimedio: $B\\ge0$ o verifica', 'Esempio corretto'],
    },
  ],
  flashcards: [
    { id: 's00.equazioni.fc1', kind: 'thm', front: 'Principi di equivalenza delle equazioni', back: String.raw`Si può sommare la stessa quantità a entrambi i membri e moltiplicarli per lo stesso numero **non nullo**. Moltiplicare per un'espressione che può annullarsi può aggiungere soluzioni.` },
    { id: 's00.equazioni.fc2', kind: 'formula', front: String.raw`Formula risolutiva di $ax^2+bx+c = 0$`, back: String.raw`$\Delta = b^2-4ac$; se $\Delta\ge0$: $x = \frac{-b\pm\sqrt\Delta}{2a}$. $\Delta<0$: nessuna soluzione reale; $\Delta = 0$: una doppia.` },
    { id: 's00.equazioni.fc3', kind: 'thm', front: 'Legge di annullamento del prodotto', back: String.raw`$A\cdot B = 0 \iff A = 0$ oppure $B = 0$. Per questo si scompone prima di risolvere.` },
    { id: 's00.equazioni.fc4', kind: 'metodo', front: 'Biquadratiche', back: String.raw`$ax^4+bx^2+c = 0$: pongo $t = x^2$, risolvo in $t$, tengo solo $t\ge0$ e prendo $x = \pm\sqrt t$.` },
    { id: 's00.equazioni.fc5', kind: 'metodo', front: 'Equazioni fratte', back: 'C.E. (denominatori ≠ 0) → denominatore comune → risolvo il numeratore → scarto le soluzioni fuori dalle C.E.' },
    { id: 's00.equazioni.fc6', kind: 'formula', front: String.raw`$|A| = k$`, back: String.raw`Se $k>0$: $A = k$ oppure $A = -k$. Se $k = 0$: $A = 0$. Se $k<0$: impossibile.` },
    { id: 's00.equazioni.fc7', kind: 'metodo', front: String.raw`Equazione irrazionale $\sqrt A = B$`, back: String.raw`Equivale a $\begin{cases}B\ge0\\A = B^2\end{cases}$ (la condizione $A\ge0$ è automatica).` },
    { id: 's00.equazioni.fc8', kind: 'metodo', front: 'Sistemi lineari 2×2', back: 'Sostituzione (ricavo una variabile e la sostituisco) o riduzione (combino le equazioni per eliminarne una). Verifico sempre in entrambe.' },
  ],
});

// =====================================================================
// s00.disequazioni
// =====================================================================
S.push({
  id: 's00.disequazioni',
  title: 'Disequazioni',
  summary: String.raw`Saprai risolvere disequazioni lineari, di secondo grado, fratte, con valore assoluto e sistemi, e calcolare il dominio di una funzione. Lo studio del segno serve per il dominio e per gli intervalli di crescenza.`,
  prereq: ['s00.equazioni'],
  examRefs: ['Itinere 11/11/2025 · Parte B (dominio di una radice)', 'Appello 15/01/2026 · Parte B (dominio di una funzione)', 'Appello 10/02/2026 · Parte B (segno della derivata)'],
  lessons: [
    {
      id: 's00.disequazioni.L1',
      title: 'Il segno di una disequazione lineare',
      cards: [
        { type: 'learn', title: 'Una disequazione chiede un segno', body: String.raw`Una **disequazione** confronta due espressioni con $<$, $\le$, $>$ o $\ge$. Per esempio $2x - 3 > 0$ chiede: **per quali $x$ il numero $2x-3$ è positivo?**

Le soluzioni non sono di solito un solo numero, ma un **intervallo** (o un'unione di intervalli). Notazione:

- $(a,b)$: gli estremi $a$ e $b$ **non** sono inclusi (tondo, come $<$ e $>$);
- $[a,b]$: gli estremi **sono** inclusi (quadra, come $\le$ e $\ge$);
- $(a,+\infty)$ e $(-\infty,a)$: l'infinito non è mai incluso, quindi la parentesi è sempre tonda;
- $\R$ indica tutti i reali; $\emptyset$ indica nessuna soluzione.` },
        { type: 'learn', title: 'Il segno di $x - 3$', body: String.raw`Il segno di $x - 3$ cambia **una sola volta**, nel punto che lo annulla, $x = 3$:

- per $x < 3$ è **negativo** (esempio: $x = 0$ dà $0 - 3 = -3$);
- per $x = 3$ vale **zero**;
- per $x > 3$ è **positivo** (esempio: $x = 5$ dà $5 - 3 = 2$).

>* **Regola pratica.** Per $ax + b > 0$ trovo lo zero $x_0 = -\dfrac{b}{a}$ e decido da che parte sta la soluzione. Se $a$ è **negativo**, dividendo per $a$ il verso della disuguaglianza **si inverte**.` },
        { type: 'example', title: 'Esempio svolto', problem: String.raw`Risolvi $2x - 3 > 0$.`,
          steps: [
            String.raw`Sposto il termine noto a destra: $2x > 3$.`,
            { text: String.raw`Divido per $2$, che è positivo: il verso resta. Quindi $x > \frac{3}{2}$.`,
              ask: { type: 'mcq', prompt: String.raw`Divido $2x > 3$ per $-2$ invece che per $2$. Che verso ha la disuguaglianza finale?`, options: [String.raw`$x > -\frac{3}{2}$`, String.raw`$x < -\frac{3}{2}$`], answer: 1, explain: String.raw`Dividendo per un numero **negativo** il verso si inverte: $x < -\frac{3}{2}$.` } },
          ],
          result: String.raw`$2x - 3 > 0 \iff x > \frac{3}{2}$, cioè $\left(\frac{3}{2},+\infty\right)$.` },
        { id: 's00.disequazioni.L1.e1', type: 'mcq', level: 1,
          prompt: String.raw`Qual è la soluzione di $-x + 2 > 0$?`,
          options: [String.raw`$x > 2$`, String.raw`$x < 2$`, String.raw`$x \ge 2$`, String.raw`$x \le -2$`],
          answer: 1,
          explain: String.raw`Porto $2$ a destra: $-x > -2$. Divido per $-1 < 0$, quindi il verso si inverte: $x < 2$. L'errore tipico è $x > 2$: si dimentica il cambio di verso. $x \ge 2$ e $x \le -2$ sbagliano anche il verso del tipo di estremo: qui la disuguaglianza è stretta e il $2$ non è incluso.` },
        { id: 's00.disequazioni.L1.e2', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $3x - 6 \le 0$.`,
          answer: '(-inf,2]',
          explain: String.raw`Aggiungo $6$: $3x \le 6$. Divido per $3 > 0$: $x \le 2$. Il $2$ è incluso, quindi $(-\infty,2]$.` },
        { id: 's00.disequazioni.L1.e3', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $-2x + 5 > 0$.`,
          answer: '(-inf,5/2)',
          explain: String.raw`Sposto $5$: $-2x > -5$. Divido per $-2 < 0$: il verso si inverte, $x < \frac{5}{2}$.` },
        { id: 's00.disequazioni.L1.e4', type: 'tf', level: 1,
          prompt: String.raw`Se $a < 0$, la disequazione $ax > b$ ha soluzioni $x > \dfrac{b}{a}$.`,
          answer: false,
          explain: String.raw`Falso. Dividendo per $a < 0$ il verso si inverte: $x < \frac{b}{a}$. Esempio: $-x > 2$ dà $x < -2$. Verifica con $x = -3$: $3 > 2$ è vero, e $-3 < -2$.` },
        { id: 's00.disequazioni.L1.e5', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $\dfrac{x}{2} - 1 < \dfrac{x}{3}$.`,
          answer: '(-inf,6)',
          explain: String.raw`Moltiplico per $6 > 0$ (il verso resta): $3x - 6 < 2x$, cioè $x < 6$.` },
        { type: 'learn', title: 'Il segno di un prodotto', body: String.raw`Un prodotto è **positivo** se i fattori hanno lo stesso segno, **negativo** se hanno segni opposti, **nullo** se un fattore è nullo. Per $(x-1)(x-3)$ i punti $x = 1$ e $x = 3$ dividono la retta in tre parti, e in ciascuna il segno è costante:

- per $x < 1$ entrambi i fattori sono negativi: il prodotto è **positivo**;
- per $1 < x < 3$ il primo è positivo e il secondo negativo: il prodotto è **negativo**;
- per $x > 3$ entrambi sono positivi: il prodotto è **positivo**.` },
        { type: 'example', title: 'Esempio svolto', problem: String.raw`Risolvi $(x-1)(x-3) < 0$.`,
          steps: [
            String.raw`Gli zeri dei fattori sono $x = 1$ e $x = 3$: sono i punti in cui il prodotto può cambiare segno.`,
            { text: String.raw`Scelgo un punto di prova nell'intervallo centrale, $x = 2$: $(2-1)(2-3) = -1 < 0$. Quindi il segno è negativo in $(1,3)$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $(x-1)(x-3)$ per $x = 0$?`, answer: '3', explain: String.raw`$(0-1)(0-3) = (-1)(-3) = 3 > 0$: fuori da $[1,3]$ il prodotto è positivo.` } },
            String.raw`Gli estremi $1$ e $3$ non sono inclusi, perché la disuguaglianza è stretta. Soluzione: $(1,3)$.`,
          ],
          result: String.raw`$(x-1)(x-3) < 0 \iff 1 < x < 3$.` },
        { id: 's00.disequazioni.L1.e6', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $(x+2)(x-4) > 0$.`,
          answer: '(-inf,-2)U(4,inf)',
          explain: String.raw`Zeri: $-2$ e $4$. Il prodotto è positivo fuori dalle radici (fattori dello stesso segno): $x < -2$ oppure $x > 4$. Gli estremi sono esclusi perché la disuguaglianza è stretta.` },
        { id: 's00.disequazioni.L1.e7', type: 'mcq', level: 2,
          prompt: String.raw`Qual è l'insieme delle soluzioni di $(x-2)(x+5) \ge 0$?`,
          options: [String.raw`$(-5,2)$`, String.raw`$(-\infty,-5]\cup[2,+\infty)$`, String.raw`$(-\infty,-5)\cup(2,+\infty)$`, String.raw`$[-5,2]$`],
          answer: 1,
          explain: String.raw`Il prodotto è $\ge 0$ fuori dalle radici **e** sulle radici: $x \le -5$ oppure $x \ge 2$. $(-5,2)$ è dove il prodotto è negativo. $[-5,2]$ è il suo opposto. $(-\infty,-5)\cup(2,+\infty)$ dimentica che la disuguaglianza è larga, quindi le radici sono soluzioni.` },
        { id: 's00.disequazioni.L1.e8', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $(3-x)(x+1) < 0$.`,
          answer: '(-inf,-1)U(3,inf)',
          explain: String.raw`Zeri: $3$ e $-1$. Il prodotto è negativo tra le radici se il coefficiente di $x^2$ è positivo, ma qui è $-1$: il segno è invertito. Quindi è negativo **fuori** dalle radici, $x < -1$ oppure $x > 3$.` },
        { id: 's00.disequazioni.L1.e9', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $2x - 1 > 3x + 4$.`,
          answer: '(-inf,-5)',
          explain: String.raw`Porto le $x$ a sinistra: $-5 > x$, cioè $x < -5$. Il segno di $x$ non cambia in nessun passaggio, quindi il verso resta.` },
      ],
    },
    {
      id: 's00.disequazioni.L2',
      title: 'Secondo grado e fratte',
      cards: [
        { type: 'learn', title: 'Il segno del trinomio', body: String.raw`Il trinomio $ax^2 + bx + c$ con $a > 0$ ha il segno della parabola con concavità verso l'alto:

- se $\Delta > 0$ ci sono due radici $x_1 < x_2$: il trinomio è **negativo tra le radici** e **positivo fuori**;
- se $\Delta = 0$ c'è una radice doppia: il trinomio è sempre $\ge 0$ e vale zero solo in $x_1$;
- se $\Delta < 0$ non ci sono radici: il trinomio è **sempre positivo**.

Se $a < 0$ il segno si inverte: conviene moltiplicare per $-1$ e cambiare il verso.

>* **Formula delle radici.** $x_{1,2} = \dfrac{-b \pm \sqrt{\Delta}}{2a}$, con $\Delta = b^2 - 4ac$.` },
        { type: 'example', title: 'Esempio svolto', problem: String.raw`Risolvi $x^2 - 5x + 6 > 0$.`,
          steps: [
            String.raw`Scompongo: $x^2 - 5x + 6 = (x-2)(x-3)$, perché $2 + 3 = 5$ e $2\cdot 3 = 6$. Controllo con $\Delta = 25 - 24 = 1$: $x = \frac{5 \pm 1}{2}$, cioè $2$ e $3$.`,
            { text: String.raw`Il coefficiente di $x^2$ è $1 > 0$: il trinomio è positivo **fuori** dalle radici.`,
              ask: { type: 'num', prompt: String.raw`Qual è la radice più grande di $(x-2)(x-3)$?`, answer: '3', explain: String.raw`Le radici sono $2$ e $3$: la maggiore è $3$.` } },
            String.raw`Le radici non sono soluzioni, perché la disuguaglianza è stretta. Soluzione: $x < 2$ oppure $x > 3$.`,
          ],
          result: String.raw`$x^2 - 5x + 6 > 0 \iff x \in(-\infty,2)\cup(3,+\infty)$.` },
        { id: 's00.disequazioni.L2.e1', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $x^2 - 3x - 4 < 0$.`,
          answer: '(-1,4)',
          explain: String.raw`$x^2 - 3x - 4 = (x-4)(x+1)$, con radici $-1$ e $4$. Il coefficiente di $x^2$ è positivo: il trinomio è negativo **tra** le radici.` },
        { id: 's00.disequazioni.L2.e2', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $x^2 + 4x + 4 \ge 0$.`,
          answer: 'R',
          explain: String.raw`$x^2 + 4x + 4 = (x+2)^2$ è un quadrato, quindi è sempre $\ge 0$. Il $\Delta$ è zero: la radice doppia $-2$ è soluzione, e per gli altri $x$ il valore è positivo.` },
        { id: 's00.disequazioni.L2.e3', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $x^2 - 2x + 3 < 0$.`,
          answer: 'vuoto',
          explain: String.raw`$\Delta = 4 - 12 = -8 < 0$: il trinomio è sempre positivo, quindi non è mai negativo. Nessuna soluzione.` },
        { id: 's00.disequazioni.L2.e4', type: 'mcq', level: 2,
          prompt: String.raw`Qual è l'insieme delle soluzioni di $x^2 - 4x + 4 > 0$?`,
          options: [String.raw`$\R$`, String.raw`$\R\setminus\{2\}$`, String.raw`$(2,+\infty)$`, String.raw`$\emptyset$`],
          answer: 1,
          explain: String.raw`$x^2 - 4x + 4 = (x-2)^2$ vale zero solo in $x = 2$ ed è positivo altrove, anche per $x < 2$. $(2,+\infty)$ dimentica i valori $x < 2$. $\R$ dimentica che in $x = 2$ il trinomio vale zero. $\emptyset$ confonde questo caso con una disuguaglianza impossibile.` },
        { type: 'learn', title: 'Disequazioni fratte: il metodo', body: String.raw`Per risolvere $\dfrac{N(x)}{D(x)} \ge 0$:

1. trovo gli zeri di **numeratore** e **denominatore**;
2. studio il segno di $N$ e di $D$ su ciascun intervallo;
3. il quoziente ha il segno del prodotto: stessi segni danno positivo, segni opposti danno negativo;
4. gli zeri del **denominatore sono sempre esclusi**, anche con $\le$ o $\ge$. Gli zeri del numeratore sono inclusi solo se la disuguaglianza è larga.

>! **Errore tipico.** Moltiplicare per $D(x)$ senza sapere se è positivo. Il segno di $D$ dipende da $x$: il verso cambia solo se $D < 0$.` },
        { type: 'example', title: 'Esempio svolto', problem: String.raw`Risolvi $\dfrac{x-1}{x+2} \le 0$.`,
          steps: [
            String.raw`Il numeratore si annulla in $x = 1$, incluso perché la disuguaglianza è larga. Il denominatore si annulla in $x = -2$, sempre escluso.`,
            { text: String.raw`Per $x > 1$ numeratore e denominatore sono positivi: il quoziente è positivo, quindi non va bene. Per $-2 < x < 1$ il numeratore è negativo e il denominatore positivo: il quoziente è negativo, va bene.`,
              ask: { type: 'mcq', prompt: String.raw`Per $x = 0$ il quoziente $\dfrac{x-1}{x+2}$ è:`, options: ['positivo', 'negativo', 'nullo'], answer: 1, explain: String.raw`$\dfrac{0-1}{0+2} = -\dfrac{1}{2} < 0$.` } },
            String.raw`Per $x < -2$ numeratore e denominatore sono negativi, quindi il quoziente è positivo: non va bene. Soluzione: $(-2,1]$.`,
          ],
          result: String.raw`$\dfrac{x-1}{x+2} \le 0 \iff -2 < x \le 1$.` },
        { id: 's00.disequazioni.L2.e5', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $\dfrac{2x-4}{x+3} > 0$.`,
          answer: '(-inf,-3)U(2,inf)',
          explain: String.raw`Zeri: $x = 2$ (numeratore, escluso perché stretta) e $x = -3$ (denominatore, escluso). Il quoziente è positivo quando numeratore e denominatore hanno lo stesso segno: $x < -3$ (entrambi negativi) oppure $x > 2$ (entrambi positivi).` },
        { id: 's00.disequazioni.L2.e6', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $\dfrac{x+1}{x-3} \ge 0$.`,
          answer: '(-inf,-1]U(3,inf)',
          explain: String.raw`Il numeratore si annulla in $-1$, incluso perché la disuguaglianza è larga. Il denominatore si annulla in $3$, sempre escluso. Per $x = 0$ il quoziente vale $-\frac{1}{3} < 0$: quindi $(-1,3)$ non è soluzione.` },
        { id: 's00.disequazioni.L2.e7', type: 'mcq', level: 2,
          prompt: String.raw`Qual è l'insieme delle soluzioni di $\dfrac{x-1}{x+2} \ge 0$?`,
          options: [String.raw`$(-\infty,-2)\cup[1,+\infty)$`, String.raw`$(-\infty,-2]\cup[1,+\infty)$`, String.raw`$[-2,1]$`, String.raw`$(-2,1]$`],
          answer: 0,
          explain: String.raw`$-2$ annulla il denominatore, quindi è escluso; $1$ annulla il numeratore e la disuguaglianza è larga, quindi è incluso: $x < -2$ oppure $x \ge 1$. Il secondo distrattore include $-2$, che non è ammesso. $[-2,1]$ e $(-2,1]$ sono i valori in cui il quoziente è negativo: hanno il segno sbagliato.` },
        { id: 's00.disequazioni.L2.e8', type: 'tf', level: 1,
          prompt: String.raw`La disequazione $\dfrac{1}{x} > 0$ ha come soluzione $x > 0$.`,
          answer: true,
          explain: String.raw`Vero: il numeratore $1$ è sempre positivo, quindi il quoziente ha il segno di $x$.` },
        { id: 's00.disequazioni.L2.e9', type: 'interval', level: 3,
          prompt: String.raw`Risolvi $\dfrac{x^2-4}{x} \le 0$.`,
          answer: '(-inf,-2]U(0,2]',
          explain: String.raw`Scompongo $x^2 - 4 = (x-2)(x+2)$. Il numeratore si annulla in $\pm 2$ (inclusi); il denominatore in $0$ (escluso). Il quoziente è negativo per $x < -2$ e per $0 < x < 2$, e vale zero in $\pm 2$.` },
        { id: 's00.disequazioni.L2.e10', type: 'interval', level: 3,
          prompt: String.raw`Risolvi $\dfrac{1}{x-2} < 1$.`,
          answer: '(-inf,2)U(3,inf)',
          explain: String.raw`Non posso moltiplicare per $x-2$ senza conoscerne il segno. Porto tutto a sinistra: $\dfrac{1}{x-2} - 1 = \dfrac{3-x}{x-2} < 0$. Il quoziente è negativo per $x < 2$ e per $x > 3$. Verifica: per $x = 2{,}5$ si ha $\frac{1}{0{,}5} = 2$, che non è minore di $1$.` },
      ],
    },
    {
      id: 's00.disequazioni.L3',
      title: 'Sistemi, valore assoluto, domini',
      cards: [
        { type: 'learn', title: 'Sistemi: si intersecano le soluzioni', body: String.raw`Un **sistema di disequazioni** richiede che tutte le disuguaglianze siano vere insieme. Quindi risolvo ciascuna e prendo l'**intersezione**, cioè ciò che hanno in comune.

Esempio: $x > 1$ e $x < 3$ danno $(1,3)$, perché $x$ deve stare a destra di $1$ e a sinistra di $3$. Si scrive $\begin{cases} x > 1 \\ x < 3 \end{cases}$.` },
        { id: 's00.disequazioni.L3.e1', type: 'interval', level: 1,
          prompt: String.raw`Risolvi il sistema $\begin{cases} x - 1 > 0 \\ 2x - 6 < 0 \end{cases}$`,
          answer: '(1,3)',
          explain: String.raw`Prima disequazione: $x > 1$. Seconda: $2x < 6$, cioè $x < 3$. Intersezione: $(1,3)$.` },
        { id: 's00.disequazioni.L3.e2', type: 'interval', level: 2,
          prompt: String.raw`Risolvi il sistema $\begin{cases} x^2 - 4 \ge 0 \\ x < 5 \end{cases}$`,
          answer: '(-inf,-2]U[2,5)',
          explain: String.raw`Prima: $x^2 - 4 \ge 0$ vale per $x \le -2$ oppure $x \ge 2$. Seconda: $x < 5$. Intersezione: $(-\infty,-2]\cup[2,5)$.` },
        { type: 'learn', title: 'Valore assoluto: la distanza dallo zero', body: String.raw`$|A|$ è la distanza di $A$ dallo $0$, quindi è sempre $\ge 0$. Per risolvere:

- $|A| < k$ con $k > 0$ equivale a $-k < A < k$: soluzioni **in mezzo**;
- $|A| > k$ con $k > 0$ equivale a $A < -k$ oppure $A > k$: soluzioni **fuori**;
- $|A| < k$ con $k \le 0$ non ha soluzioni; $|A| > k$ con $k < 0$ vale sempre.

>* **Distanza.** $|x - a| < r$ significa $x \in (a-r,\, a+r)$: i punti a distanza minore di $r$ da $a$.` },
        { type: 'example', title: 'Esempio svolto', problem: String.raw`Risolvi $|2x - 1| < 3$.`,
          steps: [
            String.raw`Scrivo la doppia disuguaglianza: $-3 < 2x - 1 < 3$.`,
            { text: String.raw`Aggiungo $1$ a tutte e tre le parti: $-2 < 2x < 4$.`,
              ask: { type: 'num', prompt: String.raw`Divido $-2 < 2x < 4$ per $2$: quanto vale l'estremo sinistro $-2 : 2$?`, answer: '-1', explain: String.raw`$-2 : 2 = -1$. Si divide per $2 > 0$, quindi il verso non cambia.` } },
            String.raw`Soluzione: $-1 < x < 2$, cioè $(-1,2)$.`,
          ],
          result: String.raw`$|2x-1| < 3 \iff -1 < x < 2$.` },
        { id: 's00.disequazioni.L3.e3', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $|x + 1| \ge 2$.`,
          answer: '(-inf,-3]U[1,inf)',
          explain: String.raw`Due casi: $x + 1 \ge 2$ dà $x \ge 1$; $x + 1 \le -2$ dà $x \le -3$. Gli estremi sono inclusi perché la disuguaglianza è larga.` },
        { id: 's00.disequazioni.L3.e4', type: 'mcq', level: 2,
          prompt: String.raw`Qual è l'insieme delle soluzioni di $|x - 3| > 1$?`,
          options: [String.raw`$(2,4)$`, String.raw`$(-\infty,2)\cup(4,+\infty)$`, String.raw`$[2,4]$`, String.raw`$(-\infty,2]\cup[4,+\infty)$`],
          answer: 1,
          explain: String.raw`La distanza da $3$ deve essere maggiore di $1$: sono i punti **fuori** da $(2,4)$. Gli estremi $2$ e $4$ sono esclusi, perché la disuguaglianza è stretta. $(2,4)$ è la soluzione di $<1$ con il segno sbagliato; $[2,4]$ è la soluzione di $\le 1$; l'ultimo distrattore include gli estremi che la disuguaglianza stretta esclude.` },
        { type: 'learn', title: 'Dominio: le regole', body: String.raw`Il **dominio** di una funzione è l'insieme delle $x$ per cui la formula ha senso. Tre controlli bastano quasi sempre:

- **radice con indice pari**: il radicando deve essere $\ge 0$. Per $\sqrt{A}$ serve $A \ge 0$;
- **denominatore**: deve essere diverso da zero;
- **logaritmo** $\log(A)$: serve $A > 0$, perché $\log 0$ non esiste.

Se ci sono più condizioni, il dominio è l'**intersezione** delle soluzioni.` },
        { id: 's00.disequazioni.L3.e5', type: 'interval', level: 2, source: 'Itinere 11/11/2025 · Parte B (dominio)',
          prompt: String.raw`Determina il dominio di $f(x) = \dfrac{\sqrt{x-1}}{\sqrt{5-x}}$.`,
          answer: '[1,5)',
          explain: String.raw`Serve $x - 1 \ge 0$, cioè $x \ge 1$, e $5 - x > 0$, cioè $x < 5$: il denominatore non può essere zero, quindi $5$ è escluso. Dominio $[1,5)$.` },
        { id: 's00.disequazioni.L3.e6', type: 'interval', level: 2,
          prompt: String.raw`Determina il dominio di $\sqrt{x^2 - 3x}$.`,
          answer: '(-inf,0]U[3,inf)',
          explain: String.raw`$x^2 - 3x = x(x-3) \ge 0$: il segno è positivo fuori dalle radici $0$ e $3$, e vale zero in entrambe.` },
        { id: 's00.disequazioni.L3.e7', type: 'interval', level: 2,
          prompt: String.raw`Determina il dominio di $\log(x^2 - 4)$.`,
          answer: '(-inf,-2)U(2,inf)',
          explain: String.raw`Serve $x^2 - 4 > 0$, con argomento del logaritmo strettamente positivo: $(x-2)(x+2) > 0$. Soluzione: $x < -2$ oppure $x > 2$.` },
        { id: 's00.disequazioni.L3.e8', type: 'mcq', level: 2,
          prompt: String.raw`Qual è il dominio di $\dfrac{1}{\sqrt{x} - 1}$?`,
          options: [String.raw`$[0,+\infty)$`, String.raw`$(0,1)\cup(1,+\infty)$`, String.raw`$[0,1)\cup(1,+\infty)$`, String.raw`$\R\setminus\{1\}$`],
          answer: 2,
          explain: String.raw`Serve $x \ge 0$ per la radice, e $\sqrt{x} \ne 1$, cioè $x \ne 1$. Dominio: $[0,1)\cup(1,+\infty)$. Lo zero è ammesso, perché $\sqrt{0} - 1 = -1 \ne 0$. $[0,+\infty)$ dimentica il denominatore; $\R\setminus\{1\}$ dimentica la radice.` },
        { id: 's00.disequazioni.L3.e9', type: 'interval', level: 2,
          prompt: String.raw`Determina il dominio di $\dfrac{x-1}{2x-3}$.`,
          answer: '(-inf,3/2)U(3/2,inf)',
          explain: String.raw`Il denominatore si annulla per $x = \frac{3}{2}$, che è l'unico punto escluso. Dominio: $\R\setminus\{\frac{3}{2}\}$.` },
        { id: 's00.disequazioni.L3.e10', type: 'interval', level: 3, source: 'Appello 10/02/2026 · Parte B (studio di funzione)',
          prompt: String.raw`Per $x > 2$, per quali $x$ è $-x^2 + 2x + 3 > 0$? Questo dice dove cresce $(x^2-3)e^{2-x}$ nel tratto $x > 2$.`,
          answer: '(2,3)',
          explain: String.raw`$-x^2 + 2x + 3 = -(x-3)(x+1)$. Il segno è positivo tra le radici $-1$ e $3$. Con la condizione $x > 2$ resta $(2,3)$. Dunque la funzione cresce su $(2,3)$ e decresce per $x > 3$.` },
      ],
    },
  ],
  practice: [
    { id: 's00.disequazioni.gen-lineare', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.nz(-4, 4), b = R.int(-9, 9), op = R.pick(['>', '>=', '<', '<=']);
        const r = pt(-b * Math.sign(a), Math.abs(a));
        const sol = solveSet((v) => cmp(a * v + b, op), [r]);
        const flip = a < 0;
        const rel = flip ? FLIP[op] : op;
        const lhs = `${cf(a)}x${b === 0 ? '' : ` ${b > 0 ? '+' : '-'} ${Math.abs(b)}`}`;
        return {
          type: 'interval',
          prompt: String.raw`Risolvi $${lhs} ${OPTEX[op]} 0$.`,
          answer: sol.s,
          explain: String.raw`Sposto il termine noto: $${cf(a)}x ${OPTEX[op]} ${-b}$. ${flip ? `Divido per $${a} < 0$: il verso si inverte.` : `Divido per $${a} > 0$: il verso resta.`} Quindi $x ${OPTEX[rel]} ${r.t}$, cioè $${sol.t}$.`,
        };
      } },
    { id: 's00.disequazioni.gen-quadratica', type: 'gen', level: 2,
      gen: (R) => {
        const [r1, r2] = two(R, -4, 4);
        const op = R.pick(['>', '>=', '<', '<=']);
        const sol = solveSet((v) => cmp((v - r1) * (v - r2), op), [pt(r1), pt(r2)]);
        const b = -(r1 + r2), c = r1 * r2;
        const quad = `x^2${b === 0 ? '' : ` ${b > 0 ? '+' : '-'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`}${c === 0 ? '' : ` ${c > 0 ? '+' : '-'} ${Math.abs(c)}`}`;
        const larga = op.includes('=') ? 'Nelle radici il trinomio vale zero, quindi sono soluzioni della disuguaglianza larga. ' : '';
        return {
          type: 'interval',
          prompt: String.raw`Risolvi $${quad} ${OPTEX[op]} 0$.`,
          answer: sol.s,
          explain: String.raw`Scompongo: $${quad} = (${xm(r1)})(${xm(r2)})$, con radici $${r1}$ e $${r2}$. Il coefficiente di $x^2$ è positivo: il trinomio è negativo tra le radici e positivo fuori. ${larga}Soluzione: $${sol.t}$.`,
        };
      } },
    { id: 's00.disequazioni.gen-fratta', type: 'gen', level: 2,
      gen: (R) => {
        const p = R.int(-5, 5);
        let q = R.int(-5, 5);
        while (q === p) q = R.int(-5, 5);
        const op = R.pick(['>', '>=', '<', '<=']);
        const sol = solveSet((v) => v !== q && cmp((v - p) / (v - q), op), [pt(p), pt(q)]);
        return {
          type: 'interval',
          prompt: String.raw`Risolvi $\dfrac{${xm(p)}}{${xm(q)}} ${OPTEX[op]} 0$.`,
          answer: sol.s,
          explain: String.raw`Il quoziente cambia segno in $x = ${p}$ (numeratore) e in $x = ${q}$ (denominatore). Quest'ultimo punto è **sempre escluso**; $x = ${p}$ è soluzione solo se la disuguaglianza è larga. Soluzione: $${sol.t}$.`,
        };
      } },
    { id: 's00.disequazioni.gen-modulo', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.pick([1, 2, 3]), b = R.int(-5, 5), c = R.int(1, 7), op = R.pick(['<', '<=', '>', '>=']);
        const pts = [pt(c - b, a), pt(-c - b, a)];
        const sol = solveSet((v) => cmp(Math.abs(a * v + b) - c, op), pts);
        const lin = H.lin(a, b);
        const txt = op[0] === '<'
          ? `Il valore assoluto è minore di $${c}$: la quantità sta **tra** $-${c}$ e $${c}$. Scrivo $-${c} ${OPTEX[op]} ${lin} ${OPTEX[op]} ${c}$ e isolo $x$.`
          : `Il valore assoluto è maggiore di $${c}$: la quantità sta **fuori** da $[-${c},${c}]$. Due casi: $${lin} ${OPTEX[op]} ${c}$, oppure $${lin} ${OPTEX[op === '>' ? '<' : '<=']} -${c}$.`;
        return {
          type: 'interval',
          prompt: String.raw`Risolvi $|${lin}| ${OPTEX[op]} ${c}$.`,
          answer: sol.s,
          explain: `${txt} Soluzione: $${sol.t}$.`,
        };
      } },
    { id: 's00.disequazioni.p1', type: 'problem', level: 3, source: 'Appello 15/01/2026 · Parte B (dominio di una funzione)', points: 2,
      prompt: String.raw`Determina il dominio di $f(x) = x\log x$ per $x < 1$ e $f(x) = \dfrac{x-1}{2x-3}$ per $x \ge 1$.`,
      parts: [
        { type: 'interval', prompt: String.raw`Dominio del primo ramo ($x < 1$).`, answer: '(0,1)', explain: String.raw`Serve $\log x$ definito, quindi $x > 0$. Con $x < 1$ resta $(0,1)$.` },
        { type: 'interval', prompt: String.raw`Dominio del secondo ramo ($x \ge 1$).`, answer: '[1,3/2)U(3/2,inf)', explain: String.raw`Il denominatore $2x - 3$ si annulla in $x = \frac{3}{2}$, che è escluso.` },
      ],
      solution: String.raw`Primo ramo: $x > 0$ e $x < 1$, quindi $(0,1)$. Secondo ramo: $x \ge 1$ e $x \ne \frac{3}{2}$, quindi $[1,\frac{3}{2})\cup(\frac{3}{2},+\infty)$. Unione: $\operatorname{Dom} f = (0,\tfrac{3}{2})\cup(\tfrac{3}{2},+\infty)$.` },
    { id: 's00.disequazioni.p2', type: 'interval', level: 1,
      prompt: String.raw`Risolvi $3 - 2x \ge 1$.`, answer: '(-inf,1]',
      explain: String.raw`Sposto $3$: $-2x \ge -2$. Divido per $-2 < 0$: il verso si inverte, $x \le 1$.` },
    { id: 's00.disequazioni.p3', type: 'interval', level: 2,
      prompt: String.raw`Risolvi $x^2 - 6x + 8 \le 0$.`, answer: '[2,4]',
      explain: String.raw`$x^2 - 6x + 8 = (x-2)(x-4)$: il trinomio è negativo tra le radici. La disuguaglianza è larga, quindi $2$ e $4$ sono inclusi.` },
    { id: 's00.disequazioni.p4', type: 'tf', level: 1,
      prompt: String.raw`Se $x^2 > 4$, allora $x > 2$.`, answer: false,
      explain: String.raw`Falso: $x = -3$ dà $x^2 = 9 > 4$, ma non è $x > 2$. Le soluzioni sono $x < -2$ oppure $x > 2$.` },
    { id: 's00.disequazioni.p5', type: 'mcq', level: 2,
      prompt: String.raw`Qual è il dominio di $\sqrt{4 - x^2}$?`,
      options: [String.raw`$[-2,2]$`, String.raw`$(-\infty,-2]\cup[2,+\infty)$`, String.raw`$(-2,2)$`, String.raw`$\R$`],
      answer: 0,
      explain: String.raw`Serve $4 - x^2 \ge 0$, cioè $x^2 \le 4$: $-2 \le x \le 2$. Il secondo distrattore è il dominio di $\sqrt{x^2-4}$, che ha il segno invertito.` },
    { id: 's00.disequazioni.p6', type: 'match', level: 1,
      prompt: String.raw`Abbina ogni disequazione al suo insieme di soluzioni.`,
      pairs: [
        [String.raw`$x^2 - 1 > 0$`, String.raw`$(-\infty,-1)\cup(1,+\infty)$`],
        [String.raw`$x^2 + 1 > 0$`, String.raw`$\R$`],
        [String.raw`$x^2 + 1 < 0$`, String.raw`$\emptyset$`],
        [String.raw`$|x| < 1$`, String.raw`$(-1,1)$`],
      ],
      explain: String.raw`$x^2 - 1 > 0$ è il prodotto $(x-1)(x+1)$, positivo fuori da $\pm 1$. $x^2 + 1$ è sempre positivo, quindi la disuguaglianza $<0$ è impossibile. $|x| < 1$ significa $-1 < x < 1$.` },
    { id: 's00.disequazioni.p7', type: 'mcq', level: 1,
      prompt: String.raw`La disequazione $(x-1)(x+2) < 0$ è soddisfatta da:`,
      options: [String.raw`$x = 0$`, String.raw`$x = 2$`, String.raw`$x = -3$`, String.raw`$x = 1$`],
      answer: 0,
      explain: String.raw`Per $x = 0$: $(0-1)(0+2) = -2 < 0$. Per $x = 2$ il prodotto è $(1)(4) = 4 > 0$, per $x = -3$ è $(-4)(-1) = 4 > 0$, e per $x = 1$ vale zero, quindi la disuguaglianza stretta non è soddisfatta.` },
  ],
  flashcards: [
    { id: 's00.disequazioni.fc1', kind: 'def', front: 'Notazione degli intervalli', back: String.raw`$(a,b)$: estremi esclusi; $[a,b]$: estremi inclusi. L'infinito ha sempre la parentesi tonda: $(-\infty,a]$, $(a,+\infty)$.` },
    { id: 's00.disequazioni.fc2', kind: 'metodo', front: 'Disequazione di secondo grado', back: String.raw`Scompongo $ax^2+bx+c = a(x-x_1)(x-x_2)$ (se $\Delta \ge 0$). Per $a>0$: negativo tra le radici, positivo fuori. Se $\Delta<0$ il segno è sempre quello di $a$.` },
    { id: 's00.disequazioni.fc3', kind: 'metodo', front: 'Disequazione fratta', back: String.raw`Trovo gli zeri di $N$ e $D$, studio il segno su ciascun intervallo. Gli zeri di $D$ sono sempre esclusi; gli zeri di $N$ sono inclusi solo se la disuguaglianza è larga.` },
    { id: 's00.disequazioni.fc4', kind: 'formula', front: String.raw`$|A| < k$ e $|A| > k$ (con $k > 0$)`, back: String.raw`$|A| < k \iff -k < A < k$. $|A| > k \iff A < -k$ oppure $A > k$.` },
    { id: 's00.disequazioni.fc5', kind: 'metodo', front: 'Dominio: le condizioni', back: String.raw`Radice pari: radicando $\ge 0$. Denominatore: $\ne 0$. Logaritmo: argomento $> 0$. Il dominio è l'intersezione delle condizioni.` },
    { id: 's00.disequazioni.fc6', kind: 'errore', front: 'Moltiplicare per un termine di segno incerto', back: String.raw`Moltiplicare o dividere per $x$ o per $x-2$ può cambiare il verso. Per evitarlo porto tutto da una parte e studio il segno del quoziente.` },
    { id: 's00.disequazioni.fc7', kind: 'errore', front: 'Il denominatore nelle disuguaglianze larghe', back: String.raw`Con $\le$ o $\ge$ gli zeri del numeratore sono soluzioni, ma gli zeri del denominatore **no**: la frazione lì non esiste.` },
  ],
});

// =====================================================================
// s00.esplog
// =====================================================================
S.push({
  id: 's00.esplog',
  title: 'Esponenziali e logaritmi',
  summary: String.raw`Saprai usare esponenziali e logaritmi: proprietà, grafici, equazioni e disequazioni. Sono le funzioni dell'esame: $e^x$ e $\log x$ compaiono in quasi ogni studio di funzione, limite e dominio.`,
  prereq: ['s00.numeri', 's00.disequazioni'],
  examRefs: ['Itinere 11/11/2025 · Parte A (teorema degli zeri)', 'Appello 15/01/2026 · Parte B (studio di funzione con esponenziali)', 'Appello 06/07/2026 · Parte B (studio di funzione con esponenziali)'],
  lessons: [
    {
      id: 's00.esplog.L1',
      title: 'Esponenziali',
      cards: [
        { type: 'learn', title: 'Potenze con esponente variabile', body: String.raw`Nell'esponenziale $a^x$ la base $a > 0$ è fissa e l'esponente $x$ è la variabile. Esempi: $2^x$, $\left(\frac{1}{2}\right)^x$, $e^x$.

- se $a > 1$ la funzione è **crescente**: più cresce $x$, più cresce $a^x$;
- se $0 < a < 1$ la funzione è **decrescente**;
- $a^x > 0$ per ogni $x$: l'esponenziale **non è mai negativo né nullo**.

La base $e \approx 2{,}718$ è il numero di Nepero: $e^x$ è la funzione esponenziale del corso.` , plot: { fns: ['2^x', '(1/2)^x'], x: [-3, 3], y: [-1, 5] } },
        { type: 'example', title: 'Esempio svolto', problem: String.raw`Risolvi $4^x = 8$.`,
          steps: [
            String.raw`Scrivo entrambi i membri come potenze di $2$: $4 = 2^2$ e $8 = 2^3$. Quindi $(2^2)^x = 2^3$, cioè $2^{2x} = 2^3$.`,
            { text: String.raw`Con la stessa base, gli esponenti devono essere uguali: $2x = 3$, quindi $x = \frac{3}{2}$.`,
              ask: { type: 'num', prompt: String.raw`Quale esponente ha $4$ in base $2$, cioè $4 = 2^{?}$?`, answer: '2', explain: String.raw`$4 = 2^2$.` } },
            String.raw`Verifica: $4^{3/2} = (2^2)^{3/2} = 2^3 = 8$.`,
          ],
          result: String.raw`$4^x = 8 \iff x = \frac{3}{2}$.` },
        { id: 's00.esplog.L1.e1', type: 'mcq', level: 1,
          prompt: String.raw`Quale espressione è uguale a $2^{x+3}$?`,
          options: [String.raw`$2^x + 8$`, String.raw`$8\cdot 2^x$`, String.raw`$2^{3x}$`, String.raw`$6\cdot 2^x$`],
          answer: 1,
          explain: String.raw`Con l'esponente che si somma, le potenze si moltiplicano: $2^{x+3} = 2^x\cdot 2^3 = 8\cdot 2^x$. L'errore più comune è $2^x + 8$: la somma va nell'esponente, non fuori.` },
        { id: 's00.esplog.L1.e2', type: 'num', level: 1,
          prompt: String.raw`Per $x = 2$, quanto vale $3^{x-1}$?`,
          answer: '3',
          explain: String.raw`$x - 1 = 2 - 1 = 1$, quindi $3^1 = 3$.` },
        { id: 's00.esplog.L1.e3', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $x \in \R$ vale $(e^x)^2 = e^{x^2}$.`,
          answer: false,
          explain: String.raw`Falso: $(e^x)^2 = e^{2x}$, perché si moltiplicano gli esponenti. $e^{x^2}$ è un'altra funzione: per $x = 1$ si ha $e^2$ a sinistra e $e^1 = e$ a destra.` },
        { id: 's00.esplog.L1.e4', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $x \in \R$ vale $e^x > 0$.`,
          answer: true,
          explain: String.raw`Vero: un esponenziale con base positiva non è mai zero né negativo, qualunque sia l'esponente.` },
        { id: 's00.esplog.L1.e5', type: 'mcq', level: 1,
          prompt: String.raw`Quante soluzioni reali ha $e^x = -1$?`,
          options: [String.raw`$x = 0$`, String.raw`$x = -1$`, String.raw`Nessuna`, String.raw`Infinite`],
          answer: 2,
          explain: String.raw`Un esponenziale è sempre positivo, quindi non può valere $-1$. $x = 0$ dà $e^0 = 1$, non $-1$. L'equazione è impossibile.` },
        { id: 's00.esplog.L1.e6', type: 'num', level: 2,
          prompt: String.raw`Risolvi $4^{x} = 8$. Scrivi $x$ come frazione.`,
          answer: '3/2',
          explain: String.raw`Con base $2$: $2^{2x} = 2^3$, quindi $2x = 3$ e $x = \frac{3}{2}$.` },
        { id: 's00.esplog.L1.e7', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $2^x > 8$.`,
          answer: '(3,inf)',
          explain: String.raw`$8 = 2^3$ e la base è $2 > 1$: la funzione è crescente, il verso resta. Quindi $x > 3$.` },
        { id: 's00.esplog.L1.e8', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $\left(\frac{1}{2}\right)^x > 4$.`,
          answer: '(-inf,-2)',
          explain: String.raw`$4 = \left(\frac{1}{2}\right)^{-2}$. La base è $\frac{1}{2} < 1$: la funzione è decrescente, quindi il verso si inverte. Da $x < -2$.` },
        { id: 's00.esplog.L1.e9', type: 'interval', level: 1,
          prompt: String.raw`Risolvi $3^x \ge 1$.`,
          answer: '[0,inf)',
          explain: String.raw`$1 = 3^0$, e la base $3 > 1$ conserva il verso: $x \ge 0$.` },
        { type: 'learn', title: 'Disequazioni esponenziali: il verso', body: String.raw`Per confrontare due esponenziali con la stessa base $a > 0$:

- se $a > 1$ il verso **resta**: $a^{f(x)} > a^{g(x)} \iff f(x) > g(x)$;
- se $0 < a < 1$ il verso **si inverte**: $a^{f(x)} > a^{g(x)} \iff f(x) < g(x)$.

Il caso $0 < a < 1$ è quello in cui si sbaglia più spesso: $\left(\frac{1}{2}\right)^x$ è decrescente.` },
        { id: 's00.esplog.L1.e10', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $e^{2x-1} < e$.`,
          answer: '(-inf,1)',
          explain: String.raw`$e = e^1$ e la base $e > 1$: $2x - 1 < 1$, cioè $x < 1$.` },
        { id: 's00.esplog.L1.e11', type: 'num', level: 2,
          prompt: String.raw`Risolvi $e^{2x-1} = e^3$.`,
          answer: '2',
          explain: String.raw`Con la stessa base $e$: $2x - 1 = 3$, quindi $2x = 4$ e $x = 2$.` },
      ],
    },
    {
      id: 's00.esplog.L2',
      title: 'Logaritmi',
      cards: [
        { type: 'learn', title: 'Il logaritmo è un esponente', body: String.raw`Il logaritmo risponde a una domanda: **a quale esponente devo elevare la base per ottenere il numero?**

>* **Definizione.** Con $a > 0$, $a \ne 1$ e $b > 0$:
$$\log_a b = c \iff a^c = b.$$

Esempi: $\log_2 8 = 3$ perché $2^3 = 8$; $\log_3 \frac{1}{9} = -2$ perché $3^{-2} = \frac{1}{9}$.

Nel corso **$\log$ senza base è il logaritmo naturale**, cioè in base $e$: $\log e = 1$, $\log 1 = 0$.

>! Il logaritmo è definito **solo per argomento strettamente positivo**: $\log 0$ e $\log(-1)$ non esistono.` },
        { id: 's00.esplog.L2.e1', type: 'num', level: 1,
          prompt: String.raw`Quanto vale $\log_2 32$?`,
          answer: '5',
          explain: String.raw`$2^5 = 32$, quindi $\log_2 32 = 5$.` },
        { id: 's00.esplog.L2.e2', type: 'num', level: 1,
          prompt: String.raw`Quanto vale $\log_3 \dfrac{1}{9}$?`,
          answer: '-2',
          explain: String.raw`$3^{-2} = \frac{1}{9}$. Il segno meno nell'esponente non rende negativo il risultato in modo errato: qui il risultato è davvero negativo.` },
        { id: 's00.esplog.L2.e3', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $\log 1$?`,
          options: [String.raw`$0$`, String.raw`$1$`, String.raw`$e$`, String.raw`Non esiste`],
          answer: 0,
          explain: String.raw`$e^0 = 1$, quindi $\log 1 = 0$. Errore comune: $\log 1 = 1$, cioè confondere l'argomento con il risultato.` },
        { type: 'learn', title: 'Le proprietà dei logaritmi', body: String.raw`Per $A, B > 0$ e $k$ reale valgono:

- $\log(AB) = \log A + \log B$;
- $\log\dfrac{A}{B} = \log A - \log B$;
- $\log A^k = k \log A$.

>! **Attenzione.** $\log(A+B) \ne \log A + \log B$ e $\log(A-B) \ne \log A - \log B$. Il logaritmo **non** si distribuisce su somme e differenze: il prodotto e il quoziente sì.` },
        { type: 'example', title: 'Esempio svolto', problem: String.raw`Semplifica $\log\left(x^2\sqrt{x}\right)$ per $x > 0$.`,
          steps: [
            String.raw`Scrivo $\sqrt{x} = x^{1/2}$ e uso il logaritmo del prodotto: $\log(x^2\cdot x^{1/2}) = \log x^2 + \log x^{1/2}$.`,
            { text: String.raw`Porto fuori gli esponenti: $2\log x + \frac{1}{2}\log x = \left(2 + \frac{1}{2}\right)\log x$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $2 + \frac{1}{2}$?`, answer: '5/2', explain: String.raw`$2 + \frac{1}{2} = \frac{5}{2}$.` } },
            String.raw`Risultato: $\log\left(x^2\sqrt{x}\right) = \frac{5}{2}\log x$.`,
          ],
          result: String.raw`$\log\left(x^2\sqrt{x}\right) = \frac{5}{2}\log x$ per $x > 0$.` },
        { id: 's00.esplog.L2.e4', type: 'mcq', level: 2,
          prompt: String.raw`Scritto come unico logaritmo, $2\log 3 - \log 2$ diventa:`,
          options: [String.raw`$\log\dfrac{9}{2}$`, String.raw`$\log 7$`, String.raw`$\log\dfrac{3}{2}$`, String.raw`$\log 18$`],
          answer: 0,
          explain: String.raw`$2\log 3 = \log 3^2 = \log 9$, poi $\log 9 - \log 2 = \log\frac{9}{2}$. $\log 7$ sbaglia la somma; $\log\frac{3}{2}$ dimentica il quadrato; $\log 18$ trasforma la differenza in prodotto.` },
        { id: 's00.esplog.L2.e5', type: 'num', level: 2,
          prompt: String.raw`Quale numero $k$ rende vera l'uguaglianza $\log 8 = k\log 2$?`,
          answer: '3',
          explain: String.raw`$\log 8 = \log 2^3 = 3\log 2$, quindi $k = 3$.` },
        { id: 's00.esplog.L2.e6', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $a, b > 0$ vale $\log(a+b) = \log a + \log b$.`,
          answer: false,
          explain: String.raw`Falso. Con $a = b = 1$: a sinistra $\log 2 \approx 0{,}69$, a destra $\log 1 + \log 1 = 0$. La regola vale per il **prodotto** $\log(ab)$, non per la somma.` },
        { id: 's00.esplog.L2.e7', type: 'interval', level: 1,
          prompt: String.raw`Determina il dominio di $\log(x - 3)$.`,
          answer: '(3,inf)',
          explain: String.raw`Serve $x - 3 > 0$, cioè $x > 3$. L'argomento deve essere strettamente positivo.` },
        { id: 's00.esplog.L2.e8', type: 'num', level: 1,
          prompt: String.raw`Quanto vale $e^{\log 5}$?`,
          answer: '5',
          explain: String.raw`L'esponenziale e il logaritmo naturale sono l'uno l'inverso dell'altro: $e^{\log A} = A$ per $A > 0$.` },
        { id: 's00.esplog.L2.e9', type: 'mcq', level: 2,
          prompt: String.raw`Le funzioni $\log(x^2)$ e $2\log x$ sono uguali?`,
          options: [String.raw`Sì, per ogni $x \ne 0$`, String.raw`Sì, per ogni $x$`, String.raw`No, mai`, String.raw`Sì, solo per $x > 0$`],
          answer: 3,
          explain: String.raw`Il dominio di $\log(x^2)$ è $x \ne 0$, ma $2\log x$ è definito solo per $x > 0$. Sono uguali solo dove sono entrambe definite e coincidono, cioè per $x > 0$. Per $x<0$ la prima esiste e la seconda no.` },
        { id: 's00.esplog.L2.e10', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $\log(2x - 1) > 0$.`,
          answer: '(1,inf)',
          explain: String.raw`Serve prima $2x - 1 > 0$, cioè $x > \frac{1}{2}$. Poi $\log(2x-1) > \log 1$ con base $e > 1$: $2x - 1 > 1$, cioè $x > 1$. La condizione $x > 1$ implica quella del dominio.` },
        { type: 'learn', title: 'Grafico del logaritmo', body: String.raw`$\log x$ è la funzione inversa di $e^x$: il suo grafico è quello di $e^x$ specchiato rispetto alla bisettrice $y = x$.

- il dominio è $x > 0$: l'asse $y$ è un asintoto verticale;
- è crescente, con $\log 1 = 0$;
- cresce **lentamente**: $\log x \to +\infty$ per $x \to +\infty$, ma molto più piano di $x$.` , plot: { fns: ['log(x)'], x: [-1, 4], y: [-3, 2], vlines: [0] } },
        { id: 's00.esplog.L2.e11', type: 'num', level: 1,
          prompt: String.raw`Quanto vale $\log_2 16 - \log_2 4$?`,
          answer: '2',
          explain: String.raw`Per la differenza di logaritmi con la stessa base si divide: $\log_2\frac{16}{4} = \log_2 4 = 2$. Oppure: $4 - 2 = 2$ perché $\log_2 16 = 4$ e $\log_2 4 = 2$.` },
      ],
    },
    {
      id: 's00.esplog.L3',
      title: 'Equazioni e disequazioni con esponenziali e logaritmi',
      cards: [
        { type: 'learn', title: 'Equazioni esponenziali', body: String.raw`Ci sono due strategie:

1. **stessa base**: se posso scrivere entrambi i membri come potenze della stessa base $a$, confronto gli esponenti;
2. **sostituzione**: se compare $e^{2x}$ (o $4^x$) e $e^x$ (o $2^x$), pongo $t = e^x$ (o $t = 2^x$). Risolvo l'equazione in $t$ e torno a $x$, scartando i $t \le 0$.

Per tornare a $x$ da $e^x = c$ con $c > 0$ si usa il logaritmo: $x = \log c$.` },
        { type: 'example', title: 'Esempio svolto', problem: String.raw`Risolvi $e^{2x} - 3e^x + 2 = 0$.`,
          steps: [
            String.raw`Noto che $e^{2x} = (e^x)^2$. Pongo $t = e^x$ con $t > 0$: l'equazione diventa $t^2 - 3t + 2 = 0$.`,
            { text: String.raw`Il $\Delta$ è $9 - 8 = 1$: le radici sono $t = 1$ e $t = 2$, entrambe positive.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $t^2 - 3t + 2$ per $t = 1$?`, answer: '0', explain: String.raw`$1 - 3 + 2 = 0$: $t = 1$ è radice.` } },
            String.raw`Torno a $x$: $e^x = 1$ dà $x = 0$; $e^x = 2$ dà $x = \log 2$.`,
          ],
          result: String.raw`Soluzioni: $x = 0$ e $x = \log 2$.` },
        { id: 's00.esplog.L3.e1', type: 'set', level: 2,
          prompt: String.raw`Risolvi $4^{x} - 6\cdot 2^{x} + 8 = 0$. Scrivi le soluzioni separate da ;`,
          answer: ['1', '2'],
          explain: String.raw`Con $t = 2^x$ e $4^x = (2^x)^2$: $t^2 - 6t + 8 = 0$, cioè $(t-2)(t-4) = 0$. Quindi $2^x = 2$, $x = 1$; oppure $2^x = 4$, $x = 2$.` },
        { type: 'learn', title: 'Equazioni logaritmiche: prima il dominio', body: String.raw`Per risolvere $\log(A) = \log(B)$ con $A, B$ contenenti $x$:

1. imposto le **condizioni di esistenza**: $A > 0$ e $B > 0$;
2. risolvo $A = B$;
3. tengo solo le soluzioni che rispettano le condizioni.

>! Le soluzioni trovate senza controllare il dominio spesso sono **false**: il passaggio da $\log A + \log B$ a $\log(AB)$ allarga il dominio se non si controlla.` },
        { id: 's00.esplog.L3.e2', type: 'num', level: 1,
          prompt: String.raw`Risolvi $\log(x - 1) = \log 4$.`,
          answer: '5',
          explain: String.raw`Serve $x - 1 > 0$. Poi $x - 1 = 4$, quindi $x = 5$, che rispetta la condizione.` },
        { id: 's00.esplog.L3.e3', type: 'mcq', level: 2,
          prompt: String.raw`Quali soluzioni ha $\log x + \log(x-3) = \log 4$?`,
          options: [String.raw`$x = 4$`, String.raw`$x = -1$`, String.raw`$x = 4$ e $x = -1$`, String.raw`Nessuna`],
          answer: 0,
          explain: String.raw`Serve $x > 0$ e $x - 3 > 0$, cioè $x > 3$. Da $x(x-3) = 4$ si ha $x^2 - 3x - 4 = 0$, con radici $x = 4$ e $x = -1$. Solo $x = 4$ rispetta $x > 3$: $x = -1$ è scartata. Accettare entrambe è l'errore tipico.` },
        { id: 's00.esplog.L3.e4', type: 'mcq', level: 3, source: 'Itinere 11/11/2025 · Parte A (teorema degli zeri)',
          prompt: String.raw`L'equazione $\log(2+x) + x = 0$ ha una soluzione in $(-1,1)$?`,
          options: [String.raw`Sì, per il teorema degli zeri`, String.raw`No: la funzione è crescente, quindi non ha zeri`, String.raw`No: $\log(2+x)$ non è definito in $(-1,1)$`, String.raw`Sì, perché $x = 0$ è soluzione`],
          answer: 0,
          explain: String.raw`Sia $f(x) = \log(2+x) + x$, continua su $(-2,+\infty)$. Si ha $f(-1) = \log 1 - 1 = -1 < 0$ e $f(1) = \log 3 + 1 > 0$. Per il teorema degli zeri esiste $c \in (-1,1)$ con $f(c) = 0$. Il secondo distrattore è falso: $f$ è crescente e quindi ha **al più** uno zero, ma questo non esclude che ce ne sia uno. $x = 0$ non è soluzione, perché $f(0) = \log 2 \ne 0$.` },
        { id: 's00.esplog.L3.e5', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $e^{2x-1} \ge e^{x}$.`,
          answer: '[1,inf)',
          explain: String.raw`Base $e > 1$: il verso resta, $2x - 1 \ge x$, cioè $x \ge 1$.` },
        { id: 's00.esplog.L3.e6', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $\log_2(x - 1) \le 3$.`,
          answer: '(1,9]',
          explain: String.raw`Serve $x - 1 > 0$. Base $2 > 1$: $x - 1 \le 2^3 = 8$, quindi $x \le 9$. Soluzione: $1 < x \le 9$.` },
        { id: 's00.esplog.L3.e7', type: 'interval', level: 3, source: 'Appello 15/01/2026 · Parte B (studio di funzione)',
          prompt: String.raw`Risolvi $\log(x+1) < 2$.`,
          answer: '(-1,e^2-1)',
          explain: String.raw`Serve $x + 1 > 0$, cioè $x > -1$. Base $e > 1$: $x + 1 < e^2$, quindi $x < e^2 - 1$.` },
        { type: 'learn', title: 'Esponenziale e logaritmo sono inversi', body: String.raw`Per $A > 0$ vale $e^{\log A} = A$. Per ogni $x$ vale $\log(e^x) = x$.

Quindi per risolvere $e^{g(x)} = c$ con $c > 0$ basta applicare il logaritmo: $g(x) = \log c$. Se $c \le 0$ l'equazione è impossibile.` },
      ],
    },
  ],
  practice: [
    { id: 's00.esplog.gen-esp-eq', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.pick([2, 3, 5]), m = R.pick([1, 2, 3]), n = R.int(-3, 3), k = R.int(-4, 6);
        const lhs = `${m === 1 ? '' : m}x${n === 0 ? '' : ` ${n > 0 ? '+' : '-'} ${Math.abs(n)}`}`;
        const p = pt(k - n, m);
        return {
          type: 'num',
          prompt: String.raw`Risolvi $${a}^{${lhs}} = ${a}^{${k}}$. Scrivi $x$ come frazione.`,
          answer: p.s,
          explain: String.raw`Stessa base $${a}$: gli esponenti sono uguali, $${lhs} = ${k}$. Quindi $${m === 1 ? '' : m}x = ${k - n}$ e $x = ${p.t}$.`,
        };
      } },
    { id: 's00.esplog.gen-esp-disug', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.pick([2, 3]), m = R.nz(-3, 3), n = R.int(-3, 3), k = R.int(-2, 6);
        const op = R.pick(['>', '>=', '<', '<=']);
        const p = pt((k - n) * Math.sign(m), Math.abs(m));
        const sol = solveSet((v) => cmp(m * v + n - k, op), [p]);
        const lhs = `${m === 1 ? '' : m === -1 ? '-' : m}x${n === 0 ? '' : ` ${n > 0 ? '+' : '-'} ${Math.abs(n)}`}`;
        const verso = m < 0 ? 'Divido per un coefficiente negativo: il verso si inverte.' : 'Il coefficiente di $x$ è positivo: il verso resta.';
        return {
          type: 'interval',
          prompt: String.raw`Risolvi $${a}^{${lhs}} ${OPTEX[op]} ${a}^{${k}}$.`,
          answer: sol.s,
          explain: String.raw`La base $${a} > 1$: la funzione è crescente, quindi basta confrontare gli esponenti: $${lhs} ${OPTEX[op]} ${k}$. ${verso} Soluzione: $${sol.t}$.`,
        };
      } },
    { id: 's00.esplog.gen-log-eq', type: 'gen', level: 2,
      gen: (R) => {
        const k = R.int(1, 4), c = R.int(-3, 5);
        const arg = c === 0 ? 'x' : `x ${c > 0 ? '+' : '-'} ${Math.abs(c)}`;
        const sol = 2 ** k - c;
        return {
          type: 'num',
          prompt: String.raw`Risolvi $\log_2(${arg}) = ${k}$.`,
          answer: String(sol),
          explain: String.raw`Per definizione di logaritmo: $${arg} = 2^{${k}} = ${2 ** k}$. ${c === 0 ? `Quindi $x = ${sol}$.` : `Quindi $x = ${2 ** k} ${c > 0 ? '-' : '+'} ${Math.abs(c)} = ${sol}$.`} Controllo: l'argomento $${arg}$ vale $${2 ** k}$, che è positivo.`,
        };
      } },
    { id: 's00.esplog.gen-log-somma', type: 'gen', level: 3,
      gen: (R) => {
        const d = R.int(1, 4), r = d + R.int(1, 5);
        const m = r * (r - d);
        return {
          type: 'num',
          prompt: String.raw`Risolvi $\log x + \log(x - ${d}) = \log(${m})$.`,
          answer: String(r),
          explain: String.raw`Condizioni: $x > 0$ e $x > ${d}$, cioè $x > ${d}$. Per la proprietà del prodotto: $x(x-${d}) = ${m}$, cioè $x^2 - ${d === 1 ? '' : d}x - ${m} = 0$. Le radici sono $x = ${r}$ e $x = ${d - r}$. Solo $x = ${r}$ rispetta $x > ${d}$: $x = ${d - r}$ è scartata.`,
        };
      } },
    { id: 's00.esplog.gen-exp-quad', type: 'gen', level: 3,
      gen: (R) => {
        const i = R.int(0, 3);
        let j = R.int(0, 3);
        while (j === i) j = R.int(0, 3);
        const a = 2 ** i, b = 2 ** j;
        const lo = Math.min(i, j), hi = Math.max(i, j);
        return {
          type: 'set',
          prompt: String.raw`Risolvi $4^{x} - ${a + b}\cdot 2^{x} + ${a * b} = 0$. Scrivi le soluzioni separate da ;`,
          answer: [String(lo), String(hi)],
          explain: String.raw`$4^x = (2^x)^2$. Con $t = 2^x > 0$: $t^2 - ${a + b}t + ${a * b} = 0$, cioè $(t-${a})(t-${b}) = 0$. Quindi $2^x = ${a}$, da cui $x = ${i}$, oppure $2^x = ${b}$, da cui $x = ${j}$.`,
        };
      } },
    { id: 's00.esplog.p1', type: 'problem', level: 3, source: 'Appello 06/07/2026 · Parte B (studio di funzione)', points: 2,
      prompt: String.raw`Sia $f(x) = \log(x+1) - 1$. Determina il dominio di $f$ e lo zero di $f$.`,
      parts: [
        { type: 'interval', prompt: String.raw`Dominio di $f$.`, answer: '(-1,inf)', explain: String.raw`Serve $x + 1 > 0$, cioè $x > -1$.` },
        { type: 'num', prompt: String.raw`Zero di $f$: il valore di $x$ con $f(x) = 0$.`, answer: 'e-1', explain: String.raw`$\log(x+1) = 1$ dà $x + 1 = e$, quindi $x = e - 1$, che è maggiore di $-1$.` },
      ],
      solution: String.raw`Dominio: $x + 1 > 0$, cioè $(-1,+\infty)$. Zero: $\log(x+1) = 1$, quindi $x + 1 = e^1$ e $x = e - 1$. Il punto $e - 1 \approx 1{,}72$ appartiene al dominio.` },
    { id: 's00.esplog.p2', type: 'tf', level: 2,
      prompt: String.raw`Per ogni $x \ne 0$ vale $\log(x^2) = 2\log x$.`,
      answer: false,
      explain: String.raw`Falso: per $x < 0$ il membro di destra non è definito, mentre $\log(x^2)$ lo è. Per $x > 0$ l'uguaglianza vale. La formula $\log A^k = k\log A$ richiede $A > 0$.` },
    { id: 's00.esplog.p3', type: 'match', level: 2,
      prompt: String.raw`Abbina ogni espressione alla sua forma equivalente, con $a, b > 0$.`,
      pairs: [
        [String.raw`$\log(ab)$`, String.raw`$\log a + \log b$`],
        [String.raw`$\log\dfrac{a}{b}$`, String.raw`$\log a - \log b$`],
        [String.raw`$\log a^k$`, String.raw`$k\log a$`],
        [String.raw`$e^{\log a}$`, String.raw`$a$`],
      ],
      explain: String.raw`Il logaritmo trasforma prodotti in somme, quozienti in differenze e potenze in moltiplicazioni. L'esponenziale è l'inverso del logaritmo naturale: $e^{\log a} = a$.` },
    { id: 's00.esplog.p4', type: 'mcq', level: 1,
      prompt: String.raw`Quanto vale $\log_3 \sqrt{27}$?`,
      options: [String.raw`$\dfrac{3}{2}$`, String.raw`$\dfrac{27}{2}$`, String.raw`$\dfrac{1}{2}$`, String.raw`$3$`],
      answer: 0,
      explain: String.raw`$\sqrt{27} = 27^{1/2} = 3^{3/2}$, quindi $\log_3 3^{3/2} = \frac{3}{2}$. $3$ dimentica la radice; $\frac{27}{2}$ divide invece di esponenziare.` },
    { id: 's00.esplog.p5', type: 'interval', level: 1,
      prompt: String.raw`Risolvi $e^x > 1$.`, answer: '(0,inf)',
      explain: String.raw`$1 = e^0$ e la base $e > 1$: $x > 0$.` },
    { id: 's00.esplog.p6', type: 'mcq', level: 2,
      prompt: String.raw`Qual è la funzione inversa di $f(x) = e^x$?`,
      options: [String.raw`$\log x$`, String.raw`$\log(-x)$`, String.raw`$\dfrac{1}{e^x}$`, String.raw`$e^{-x}$`],
      answer: 0,
      explain: String.raw`L'inversa di $e^x$ è $\log x$: $y = e^x \iff x = \log y$. $\frac{1}{e^x}$ e $e^{-x}$ sono $e^{-x}$ con segni diversi: non invertono l'esponenziale. $\log(-x)$ ha dominio $x<0$.` },
  ],
  flashcards: [
    { id: 's00.esplog.fc1', kind: 'def', front: String.raw`Esponenziale $a^x$ con $a>0$, $a\ne1$`, back: String.raw`Crescente se $a>1$, decrescente se $0<a<1$. Sempre strettamente positivo, con asintoto orizzontale $y = 0$.` },
    { id: 's00.esplog.fc2', kind: 'def', front: String.raw`Definizione di logaritmo`, back: String.raw`$\log_a b = c \iff a^c = b$, con $a>0$, $a\ne1$, $b>0$. $\log$ senza base è il logaritmo naturale (in base $e$).` },
    { id: 's00.esplog.fc3', kind: 'formula', front: 'Proprietà dei logaritmi', back: String.raw`$\log(AB) = \log A + \log B$; $\log\frac{A}{B} = \log A - \log B$; $\log A^k = k\log A$. Con $A, B > 0$.` },
    { id: 's00.esplog.fc4', kind: 'errore', front: String.raw`Il logaritmo della somma`, back: String.raw`$\log(A+B) \ne \log A + \log B$. Il logaritmo si distribuisce sul prodotto, non sulla somma.` },
    { id: 's00.esplog.fc5', kind: 'metodo', front: 'Disequazione esponenziale', back: String.raw`Confronto gli esponenti. Se la base è maggiore di $1$ il verso resta; se è compresa tra $0$ e $1$ il verso si inverte.` },
    { id: 's00.esplog.fc6', kind: 'metodo', front: 'Equazione logaritmica', back: String.raw`Imposto le condizioni di esistenza (argomenti $>0$), risolvo, poi scarto le soluzioni che non le rispettano.` },
    { id: 's00.esplog.fc7', kind: 'formula', front: String.raw`Inverse: $e^{\log A}$ e $\log(e^x)$`, back: String.raw`$e^{\log A} = A$ per $A>0$; $\log(e^x) = x$ per ogni $x$. Il logaritmo è l'inversa dell'esponenziale.` },
    { id: 's00.esplog.fc8', kind: 'metodo', front: 'Equazione con $e^{2x}$ e $e^x$', back: String.raw`Pongo $t = e^x$ con $t>0$, risolvo l'equazione in $t$ (di solito di secondo grado) e torno a $x = \log t$ per ogni $t>0$.` },
  ],
});
