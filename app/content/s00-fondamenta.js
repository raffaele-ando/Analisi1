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
