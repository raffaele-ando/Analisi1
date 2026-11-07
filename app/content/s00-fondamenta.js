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
