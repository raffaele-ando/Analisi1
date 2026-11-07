import { H } from '../engine/tex.js';

// ---------------------------------------------------------------------------
// Helper locali per i generatori (vettori e rette con interi piccoli)
// ---------------------------------------------------------------------------
const add = (u, v) => u.map((x, i) => x + v[i]);
const sub = (u, v) => u.map((x, i) => x - v[i]);
const mul = (k, u) => u.map((x) => k * x);
const n2 = (u) => H.dot(u, u);
const isZero = (u) => u.every((x) => x === 0);
const vec = (u) => H.vec(u);

/** Vettore intero ridotto (MCD = 1) con la prima componente non nulla positiva */
function prim(u) {
  let g = 0;
  for (const x of u) if (x !== 0) g = g ? H.gcd(g, x) : Math.abs(x);
  if (!g) return u.slice();
  const s = u.find((x) => x !== 0) < 0 ? -1 : 1;
  return u.map((x) => (s * x) / g);
}

/** Coordinata parametrica: p + v t in LaTeX ("1 + 3t", "-2t", "5") */
function comp(p, v, t = 't') {
  if (v === 0) return String(p);
  const vt = (Math.abs(v) === 1 ? '' : String(Math.abs(v))) + t;
  if (p === 0) return (v < 0 ? '-' : '') + vt;
  return `${p} ${v < 0 ? '-' : '+'} ${vt}`;
}

/** Retta in forma parametrica compatta: (x, y, z) = (1 + 3t, 3 - t, 1 - 2t) */
function lineTex(P, v, t = 't') {
  return `(x,y,z) = (${comp(P[0], v[0], t)},\\ ${comp(P[1], v[1], t)},\\ ${comp(P[2], v[2], t)})`;
}

/** (x - 1), (y + 2), z */
function shift(name, p) {
  if (p === 0) return name;
  return `(${name} ${p > 0 ? '-' : '+'} ${Math.abs(p)})`;
}

/** Combinazione a(x-x0)+b(y-y0)+c(z-z0) in LaTeX */
function pointNormalTex(n, P) {
  const names = ['x', 'y', 'z'];
  const parts = [];
  n.forEach((c, i) => {
    if (c === 0) return;
    const abs = Math.abs(c);
    const body = (abs === 1 ? '' : String(abs)) + shift(names[i], P[i]);
    parts.push(parts.length === 0 ? (c < 0 ? '-' : '') + body : (c < 0 ? ' - ' : ' + ') + body);
  });
  return parts.join('') + ' = 0';
}

/** LaTeX di |num| / sqrt(den2) semplificato */
function divSqrtTex(num, den2) {
  const [a, b] = H.sqrtParts(den2);
  if (b === 1) return H.frac(num, a);
  const [p, q] = H.reduce(num, a);
  const sign = p < 0 ? '-' : '';
  const top = Math.abs(p);
  const bot = (q === 1 ? '' : String(q)) + `\\sqrt{${b}}`;
  return `${sign}\\frac{${top}}{${bot}}`;
}

/** Stringa math.js di num / sqrt(den2) */
const divSqrtStr = (num, den2) => `${num}/sqrt(${den2})`;

/** Permuta e cambia segno alle coordinate (trasformazione ortogonale: conserva angoli e distanze) */
function orthoMap(R) {
  const perm = R.shuffle([0, 1, 2]);
  const sg = [R.sign(), R.sign(), R.sign()];
  return (u) => perm.map((j, i) => sg[i] * u[j]);
}

/** Vettore casuale non nullo con componenti in [-m, m] */
function rvec(R, m = 3) {
  let v;
  do v = [R.int(-m, m), R.int(-m, m), R.int(-m, m)];
  while (isZero(v));
  return v;
}

const PYTH = [
  [1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11],
  [6, 6, 7, 11], [3, 4, 12, 13], [2, 5, 14, 15], [3, 4, 0, 5], [0, 5, 12, 13],
];

// ===========================================================================

export default {
  id: 's15',
  title: 'Geometria analitica',
  subtitle: 'Vettori, prodotto scalare e vettoriale, rette, piani, distanze',
  intro: String.raw`La geometria nello spazio vale **3–8 punti in ogni appello**, più 1–3 punti di teoria (definizione di prodotto scalare e vettoriale, rette sghembe). Gli esercizi sono sempre dello stesso tipo: rette, piani, intersezioni e distanze con numeri piccoli. Con un metodo sicuro sono punti garantiti.`,
  skills: [
    // -----------------------------------------------------------------------
    // s15.vettori
    // -----------------------------------------------------------------------
    {
      id: 's15.vettori',
      title: 'Vettori e prodotto scalare',
      summary: String.raw`Saprai lavorare con i vettori in componenti, calcolare modulo, versore, prodotto scalare e angolo, e riconoscere vettori ortogonali.`,
      prereq: ['s00.equazioni', 's00.trig', 's01.reali'],
      examRefs: ['Itinere 15/01/2026 · Parte A', 'Appello 15/01/2026 · Parte A'],
      lessons: [
        {
          id: 's15.vettori.L1',
          title: 'Frecce nello spazio',
          cards: [
            { type: 'learn', title: "Che cos'è un vettore",
              body: String.raw`Un **vettore** è una "freccia": serve a descrivere uno spostamento. Ha tre caratteristiche:

- **modulo** (o norma): la lunghezza della freccia, si scrive $|v|$;
- **direzione**: la retta su cui giace la freccia (o una qualunque parallela);
- **verso**: da che parte punta, lungo quella direzione.

Due frecce con stesso modulo, direzione e verso rappresentano **lo stesso vettore**, anche se partono da punti diversi. Il vettore con modulo $0$ è il **vettore nullo** $\mathbf 0$: non ha direzione né verso.

>* Un vettore è individuato da **modulo, direzione e verso**.` },
            { id: 's15.vettori.L1.q1', type: 'mcq', level: 1,
              prompt: String.raw`Due vettori $v$ e $w$ hanno la stessa direzione e lo stesso modulo, ma versi opposti. Che relazione c'è tra loro?`,
              options: [String.raw`$w = -v$`, String.raw`$w = v$`, String.raw`$w$ è ortogonale a $v$`, String.raw`Non si può dire nulla`],
              answer: 0,
              explain: String.raw`Stessa direzione e stesso modulo ma verso opposto: è la freccia "girata", cioè $-v$. Non sono uguali (il verso cambia) e non sono ortogonali (la direzione è la stessa).` },
            { type: 'learn', title: 'Componenti',
              body: String.raw`Fissiamo un sistema di riferimento cartesiano $Oxyz$ con i **versori fondamentali** $\mathbf i=(1,0,0)$, $\mathbf j=(0,1,0)$, $\mathbf k=(0,0,1)$. Ogni vettore si scrive in modo unico come
$$v = v_1\mathbf i + v_2\mathbf j + v_3\mathbf k = (v_1, v_2, v_3).$$
I numeri $v_1,v_2,v_3$ sono le **componenti** di $v$.

Il vettore che va dal punto $A$ al punto $B$ si ottiene **sottraendo le coordinate**: "punta meno coda".
$$\overrightarrow{AB} = B - A = (b_1-a_1,\ b_2-a_2,\ b_3-a_3).$$
Somma e prodotto per un numero si fanno **componente per componente**: $(1,2,0)+(3,-1,4)=(4,1,4)$, $\ 2\cdot(1,-1,3)=(2,-2,6)$.` },
            { id: 's15.vettori.L1.q2', type: 'tuple', level: 1,
              prompt: String.raw`Siano $A=(1,-2,3)$ e $B=(4,0,-1)$. Calcola le componenti di $\overrightarrow{AB}$.`,
              answer: ['3', '2', '-4'], labels: ['x', 'y', 'z'],
              explain: String.raw`$\overrightarrow{AB} = B-A = (4-1,\ 0-(-2),\ -1-3) = (3, 2, -4)$. Errore tipico: fare $A-B$, che dà il vettore opposto $\overrightarrow{BA}$.` },
            { id: 's15.vettori.L1.q3', type: 'tuple', level: 1,
              prompt: String.raw`Siano $v=(2,-1,0)$ e $w=(1,3,-2)$. Calcola $3v - 2w$.`,
              answer: ['4', '-9', '4'], labels: ['x', 'y', 'z'],
              explain: String.raw`$3v=(6,-3,0)$, $2w=(2,6,-4)$, quindi $3v-2w=(6-2,\ -3-6,\ 0+4)=(4,-9,4)$. Attenzione al segno: $0-(-4)=+4$.` },
            { type: 'learn', title: 'Modulo e versore',
              body: String.raw`Il **modulo** si calcola con Pitagora (due volte, nello spazio):
$$|v| = \sqrt{v_1^2+v_2^2+v_3^2}.$$
La **distanza** tra due punti è il modulo del vettore che li unisce: $d(A,B)=|B-A|$.

Un **versore** è un vettore di modulo $1$. Il versore di $v\neq\mathbf 0$ ha stessa direzione e verso di $v$:
$$\hat v = \frac{v}{|v|}.$$` },
            { type: 'example', title: 'Esempio svolto: modulo e versore',
              problem: String.raw`Trova modulo e versore di $v=(2,-3,6)$.`,
              steps: [
                String.raw`Quadrati delle componenti: $4+9+36=49$.`,
                String.raw`Modulo: $|v|=\sqrt{49}=7$.`,
                String.raw`Divido ogni componente per $7$: $\hat v=\left(\frac27,-\frac37,\frac67\right)$.`,
                String.raw`Controllo: $\frac{4+9+36}{49}=1$. ✓`,
              ],
              result: String.raw`$|v|=7$, $\ \hat v=\left(\frac27,-\frac37,\frac67\right)$` },
            { id: 's15.vettori.L1.q4', type: 'num', level: 1,
              prompt: String.raw`Calcola il modulo di $v=(1,-4,8)$.`,
              answer: '9',
              explain: String.raw`$|v|=\sqrt{1+16+64}=\sqrt{81}=9$. I segni non contano: le componenti vanno al quadrato.` },
            { id: 's15.vettori.L1.q5', type: 'tuple', level: 2,
              prompt: String.raw`Trova il versore di $v=(-4,0,3)$.`,
              answer: ['-4/5', '0', '3/5'], labels: ['x', 'y', 'z'],
              explain: String.raw`$|v|=\sqrt{16+0+9}=5$, quindi $\hat v=\left(-\frac45,0,\frac35\right)$. Il versore conserva il verso: il segno meno resta.` },
            { id: 's15.vettori.L1.q6', type: 'num', level: 2,
              prompt: String.raw`Calcola la distanza tra $A=(1,2,-1)$ e $B=(3,-1,5)$.`,
              answer: '7',
              explain: String.raw`$B-A=(2,-3,6)$, quindi $d(A,B)=\sqrt{4+9+36}=\sqrt{49}=7$.` },
            { id: 's15.vettori.L1.q7', type: 'tf', level: 1,
              prompt: String.raw`Vero o falso: $|v+w| = |v|+|w|$ per ogni coppia di vettori.`,
              answer: false,
              explain: String.raw`Falso. Vale solo la **disuguaglianza triangolare** $|v+w|\le|v|+|w|$. Esempio: $v=(1,0,0)$, $w=(-1,0,0)$: $|v+w|=0$ ma $|v|+|w|=2$.` },
            { id: 's15.vettori.L1.q8', type: 'match', level: 1,
              prompt: 'Abbina ogni concetto alla sua descrizione.',
              pairs: [
                ['Modulo', 'Lunghezza della freccia'],
                ['Direzione', 'Retta su cui giace (a meno di parallele)'],
                ['Verso', 'Da che parte punta la freccia'],
                ['Versore', 'Vettore di modulo 1'],
              ],
              explain: String.raw`Modulo, direzione e verso individuano un vettore. Il versore $v/|v|$ tiene direzione e verso di $v$ ma ha lunghezza $1$.` },
          ],
        },
        {
          id: 's15.vettori.L2',
          title: 'Il prodotto scalare',
          cards: [
            { type: 'learn', title: 'Definizione (da sapere a memoria)',
              body: String.raw`>* **Prodotto scalare.** Dati due vettori $v,w$ non nulli, detto $\alpha\in[0,\pi]$ l'angolo tra loro,
$$\langle v,w\rangle = |v|\,|w|\cos\alpha.$$
Se $v=\mathbf 0$ o $w=\mathbf 0$ si pone $\langle v,w\rangle=0$.

Il risultato è un **numero** (uno scalare), non un vettore.

Intuizione: $|w|\cos\alpha$ è la (lunghezza con segno della) **proiezione** di $w$ sulla direzione di $v$. Il prodotto scalare misura "quanto $w$ va nella direzione di $v$".

- $\alpha$ acuto $\Rightarrow \cos\alpha>0 \Rightarrow \langle v,w\rangle>0$;
- $\alpha=\frac\pi2 \Rightarrow \langle v,w\rangle=0$;
- $\alpha$ ottuso $\Rightarrow \langle v,w\rangle<0$.` },
            { type: 'learn', title: 'Formula in coordinate',
              body: String.raw`>* Se $v=(v_1,v_2,v_3)$ e $w=(w_1,w_2,w_3)$:
$$\langle v,w\rangle = v_1w_1+v_2w_2+v_3w_3.$$

Si moltiplicano le componenti corrispondenti e si somma. Conseguenze:

- $\langle v,v\rangle=|v|^2$;
- $\langle v,w\rangle=\langle w,v\rangle$ (simmetria), ed è lineare in ciascun argomento;
- **ortogonalità**: $v\perp w \iff \langle v,w\rangle=0$;
- **angolo**: $\cos\alpha=\dfrac{\langle v,w\rangle}{|v|\,|w|}$.` },
            { type: 'example', title: 'Esempio svolto: angolo tra due vettori',
              problem: String.raw`Trova l'angolo tra $v=(1,1,0)$ e $w=(0,1,1)$.`,
              steps: [
                String.raw`Prodotto scalare: $\langle v,w\rangle=1\cdot0+1\cdot1+0\cdot1=1$.`,
                String.raw`Moduli: $|v|=\sqrt2$, $|w|=\sqrt2$.`,
                String.raw`$\cos\alpha=\dfrac{1}{\sqrt2\cdot\sqrt2}=\dfrac12$.`,
                String.raw`$\alpha\in[0,\pi]$ con coseno $\frac12$: $\alpha=\frac\pi3$.`,
              ],
              result: String.raw`$\alpha=\frac\pi3$` },
            { type: 'example', title: 'Ora tocca a te (in parte)',
              problem: String.raw`Trova l'angolo tra $v=(1,0,1)$ e $w=(-1,1,0)$.`,
              steps: [
                { text: String.raw`$\langle v,w\rangle=-1+0+0=-1$.`,
                  ask: { type: 'num', prompt: String.raw`Quanto vale $\langle v,w\rangle$?`, answer: '-1', explain: String.raw`$1\cdot(-1)+0\cdot1+1\cdot0=-1$.` } },
                String.raw`$|v|=|w|=\sqrt2$, quindi $\cos\alpha=\frac{-1}{2}$.`,
                { text: String.raw`L'angolo in $[0,\pi]$ con coseno $-\frac12$ è $\alpha=\frac{2\pi}3$.`,
                  ask: { type: 'num', prompt: String.raw`Quanto vale $\alpha$ (in radianti)?`, answer: '2*pi/3', explain: String.raw`$\cos\alpha=-\frac12$ con $\alpha\in[0,\pi]$: $\alpha=\frac{2\pi}{3}$ (non $-\frac\pi3$, che non è in $[0,\pi]$).` } },
              ],
              result: String.raw`$\alpha=\frac{2\pi}3$: angolo ottuso, coerente col prodotto scalare negativo.` },
            { id: 's15.vettori.L2.q1', type: 'num', level: 1,
              prompt: String.raw`Calcola $\langle v,w\rangle$ con $v=(2,-1,3)$ e $w=(4,5,-1)$.`,
              answer: '0',
              explain: String.raw`$2\cdot4+(-1)\cdot5+3\cdot(-1)=8-5-3=0$. I due vettori sono **ortogonali**.` },
            { id: 's15.vettori.L2.q2', type: 'mcq', level: 1,
              prompt: String.raw`Sai che $\langle v,w\rangle=-6$ con $v,w$ non nulli. Che angolo formano?`,
              options: ['Un angolo ottuso', 'Un angolo acuto', 'Un angolo retto', 'Dipende dai moduli'],
              answer: 0,
              explain: String.raw`I moduli sono positivi, quindi il segno di $\langle v,w\rangle$ è il segno di $\cos\alpha$. Negativo $\Rightarrow\alpha\in(\frac\pi2,\pi]$: ottuso. I moduli cambiano il valore, non il segno.` },
            { id: 's15.vettori.L2.q3', type: 'num', level: 2,
              prompt: String.raw`Per quale $k$ i vettori $v=(1,k,2)$ e $w=(3,-1,1)$ sono ortogonali?`,
              answer: '5',
              explain: String.raw`Impongo $\langle v,w\rangle=0$: $3-k+2=0\Rightarrow k=5$.` },
            { id: 's15.vettori.L2.q4', type: 'num', level: 2,
              prompt: String.raw`Calcola l'angolo (in radianti) tra $v=(1,0,0)$ e $w=(1,1,0)$.`,
              answer: 'pi/4',
              explain: String.raw`$\langle v,w\rangle=1$, $|v|=1$, $|w|=\sqrt2$: $\cos\alpha=\frac1{\sqrt2}=\frac{\sqrt2}2\Rightarrow\alpha=\frac\pi4$.` },
            { id: 's15.vettori.L2.q5', type: 'num', level: 2,
              prompt: String.raw`Due vettori hanno moduli $|v|=4$ e $|w|=3$ e formano un angolo di $\frac\pi3$. Quanto vale $\langle v,w\rangle$?`,
              answer: '6',
              explain: String.raw`Dalla definizione: $\langle v,w\rangle=4\cdot3\cdot\cos\frac\pi3=12\cdot\frac12=6$.` },
            { id: 's15.vettori.L2.q6', type: 'cloze', level: 1,
              prompt: 'Completa.',
              text: String.raw`Il prodotto scalare di due vettori è un [[0]]. Vale $\langle v,v\rangle=$ [[1]]. Due vettori non nulli sono ortogonali se e solo se il loro prodotto scalare è [[2]].`,
              blanks: [
                { options: ['numero', 'vettore', 'versore'], answer: 0 },
                { options: [String.raw`$|v|^2$`, String.raw`$|v|$`, String.raw`$0$`], answer: 0 },
                { options: ['nullo', 'uguale a 1', 'negativo'], answer: 0 },
              ],
              explain: String.raw`$\langle v,v\rangle=|v||v|\cos0=|v|^2$. L'ortogonalità corrisponde a $\cos\alpha=0$.` },
            { id: 's15.vettori.L2.q7', type: 'mcq', level: 2,
              prompt: String.raw`Quale scrittura **non** ha senso?`,
              options: [String.raw`$\langle\langle u,v\rangle,w\rangle$`, String.raw`$\langle u,v\rangle\,w$`, String.raw`$\langle u,v+w\rangle$`, String.raw`$|\langle u,v\rangle|$`],
              answer: 0,
              explain: String.raw`$\langle u,v\rangle$ è un numero, e non si fa il prodotto scalare tra un numero e un vettore. Invece $\langle u,v\rangle\,w$ è un numero per un vettore (ok), $\langle u,v+w\rangle$ è un prodotto scalare tra vettori (ok) e $|\langle u,v\rangle|$ è il valore assoluto di un numero (ok).` },
          ],
        },
        {
          id: 's15.vettori.L3',
          title: "Livello d'esame: teoria e calcolo",
          cards: [
            { type: 'learn', title: 'Perché la formula in coordinate funziona',
              body: String.raw`La domanda "definizione di prodotto scalare e formula in coordinate" esce spesso in Parte A (2 punti). Ecco la dimostrazione più breve, con il **teorema di Carnot** (del coseno).

Nel triangolo formato da $v$, $w$ e $v-w$:
$$|v-w|^2=|v|^2+|w|^2-2|v||w|\cos\alpha = |v|^2+|w|^2-2\langle v,w\rangle.$$
In coordinate: $|v-w|^2=\sum_i(v_i-w_i)^2=\sum_i v_i^2+\sum_i w_i^2-2\sum_i v_iw_i$.

Confrontando: $\langle v,w\rangle=v_1w_1+v_2w_2+v_3w_3$.

> Altra strada: la bilinearità e $\langle\mathbf i,\mathbf i\rangle=1$, $\langle\mathbf i,\mathbf j\rangle=0$ ecc. (base ortonormale).` },
            { id: 's15.vettori.L3.q1', type: 'order', level: 3,
              prompt: 'Riordina i passi della dimostrazione della formula in coordinate del prodotto scalare.',
              steps: [
                String.raw`Considero il triangolo di lati $v$, $w$ e $v-w$, con $\alpha$ angolo tra $v$ e $w$.`,
                String.raw`Per il teorema di Carnot: $|v-w|^2=|v|^2+|w|^2-2|v||w|\cos\alpha$.`,
                String.raw`Per definizione $|v||w|\cos\alpha=\langle v,w\rangle$, quindi $|v-w|^2=|v|^2+|w|^2-2\langle v,w\rangle$.`,
                String.raw`In coordinate $|v-w|^2=\sum(v_i-w_i)^2=\sum v_i^2+\sum w_i^2-2\sum v_iw_i$.`,
                String.raw`Confrontando le due espressioni: $\langle v,w\rangle=v_1w_1+v_2w_2+v_3w_3$.`,
              ],
              distractors: [
                String.raw`Per il teorema di Pitagora: $|v-w|^2=|v|^2+|w|^2$.`,
                String.raw`In coordinate $|v-w|^2=\sum v_i^2-\sum w_i^2$.`,
              ],
              explain: String.raw`Pitagora vale solo se $\alpha=\frac\pi2$: serve Carnot. E $(v_i-w_i)^2=v_i^2-2v_iw_i+w_i^2$, non $v_i^2-w_i^2$.` },
            { id: 's15.vettori.L3.q2', type: 'open', level: 3, points: 2,
              source: 'Itinere 15/01/2026 · Parte A',
              prompt: String.raw`Si dia la definizione di prodotto scalare tra due vettori dello spazio e se ne fornisca l'espressione in coordinate.`,
              answer: String.raw`Dati due vettori $v,w$ non nulli, detto $\alpha\in[0,\pi]$ l'angolo tra essi, il prodotto scalare è il numero reale
$$\langle v,w\rangle=|v|\,|w|\cos\alpha;$$
se uno dei due è nullo si pone $\langle v,w\rangle=0$.

In coordinate, se $v=(v_1,v_2,v_3)$, $w=(w_1,w_2,w_3)$ rispetto a una base ortonormale $\mathbf i,\mathbf j,\mathbf k$:
$$\langle v,w\rangle=v_1w_1+v_2w_2+v_3w_3.$$
(Si ottiene dal teorema di Carnot applicato al triangolo di lati $v,w,v-w$, oppure dalla bilinearità usando $\langle\mathbf i,\mathbf i\rangle=1$, $\langle\mathbf i,\mathbf j\rangle=0$, ecc.)

Conseguenze: $\langle v,v\rangle=|v|^2$; $v\perp w\iff\langle v,w\rangle=0$; $\cos\alpha=\frac{\langle v,w\rangle}{|v||w|}$.`,
              rubric: [
                String.raw`Definizione $|v||w|\cos\alpha$ con $\alpha$ angolo tra i vettori ($\alpha\in[0,\pi]$)`,
                'Specifica che il risultato è un numero (e il caso del vettore nullo)',
                String.raw`Formula in coordinate $v_1w_1+v_2w_2+v_3w_3$ corretta`,
                'Almeno una conseguenza (ortogonalità o modulo) o la giustificazione della formula',
              ] },
            { id: 's15.vettori.L3.q3', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: se $\langle v,w\rangle=0$ allora $v=\mathbf 0$ oppure $w=\mathbf 0$.`,
              answer: false,
              explain: String.raw`Falso: basta che siano ortogonali. Esempio $\langle(1,0,0),(0,1,0)\rangle=0$ con entrambi non nulli. Il prodotto scalare **non** ha la legge di annullamento del prodotto.` },
            { id: 's15.vettori.L3.q4', type: 'num', level: 2,
              prompt: String.raw`Sapendo che $|v|=3$, $|w|=2$ e $\langle v,w\rangle=-1$, calcola $|v+w|^2$.`,
              answer: '11',
              explain: String.raw`Per bilinearità $|v+w|^2=\langle v+w,v+w\rangle=|v|^2+2\langle v,w\rangle+|w|^2=9-2+4=11$. Errore tipico: dimenticare il termine doppio $2\langle v,w\rangle$.` },
            { id: 's15.vettori.L3.q5', type: 'num', level: 3,
              prompt: String.raw`Nel triangolo di vertici $A=(1,0,1)$, $B=(2,1,1)$, $C=(1,1,2)$ calcola l'angolo in $A$ (in radianti).`,
              answer: 'pi/3',
              explain: String.raw`$\overrightarrow{AB}=(1,1,0)$, $\overrightarrow{AC}=(0,1,1)$. Prodotto scalare $1$, moduli $\sqrt2$ e $\sqrt2$: $\cos\alpha=\frac12$, $\alpha=\frac\pi3$. L'angolo in $A$ si calcola con i vettori che **partono** da $A$.` },
            { id: 's15.vettori.L3.q6', type: 'mcq', level: 3,
              prompt: String.raw`Il triangolo di vertici $A=(0,1,2)$, $B=(2,2,0)$, $C=(1,3,4)$ è:`,
              options: [String.raw`rettangolo in $A$`, String.raw`rettangolo in $B$`, String.raw`rettangolo in $C$`, 'non rettangolo'],
              answer: 0,
              explain: String.raw`Controllo il prodotto scalare dei due lati uscenti da ogni vertice. In $A$: $\overrightarrow{AB}=(2,1,-2)$, $\overrightarrow{AC}=(1,2,2)$, prodotto $2+2-4=0$: angolo retto. (In $B$: $\overrightarrow{BA}=(-2,-1,2)$, $\overrightarrow{BC}=(-1,1,4)$, prodotto $9$; in $C$: prodotto $9$.) Errore tipico: usare $\overrightarrow{AB}$ e $\overrightarrow{BC}$, che non partono dallo stesso vertice.`,
            },
            { id: 's15.vettori.L3.q7', type: 'tuple', level: 3,
              prompt: String.raw`Scomponi $w=(3,1,2)$ come $w=w_\parallel+w_\perp$, con $w_\parallel$ parallelo a $v=(1,1,0)$ e $w_\perp$ ortogonale a $v$. Scrivi $w_\parallel$.`,
              answer: ['2', '2', '0'], labels: ['x', 'y', 'z'],
              explain: String.raw`$w_\parallel=\dfrac{\langle w,v\rangle}{|v|^2}\,v=\dfrac{4}{2}(1,1,0)=(2,2,0)$. Infatti $w_\perp=w-w_\parallel=(1,-1,2)$ e $\langle w_\perp,v\rangle=1-1=0$. ✓` },
            { id: 's15.vettori.L3.q8', type: 'num', level: 2,
              prompt: String.raw`Per quale $k$ il vettore $v=(k,2,-1)$ ha modulo $3$ e prima componente positiva?`,
              answer: '2',
              explain: String.raw`$k^2+4+1=9\Rightarrow k^2=4\Rightarrow k=\pm2$; con $k>0$: $k=2$.` },
          ],
        },
      ],
      practice: [
        { id: 's15.vettori.gen-modulo', type: 'gen', level: 1,
          gen: (R) => {
            const [a, b, c, m] = R.pick(PYTH);
            const v = orthoMap(R)([a, b, c]);
            return { type: 'num',
              prompt: String.raw`Calcola il modulo di $v=${vec(v)}$.`,
              answer: String(m),
              explain: String.raw`$|v|=\sqrt{${v.map((x) => (x < 0 ? `(${x})^2` : `${x}^2`)).join('+')}}=\sqrt{${m * m}}=${m}$.` };
          } },
        { id: 's15.vettori.gen-versore', type: 'gen', level: 2,
          gen: (R) => {
            const [a, b, c, m] = R.pick(PYTH);
            const v = orthoMap(R)([a, b, c]);
            return { type: 'tuple', labels: ['x', 'y', 'z'],
              prompt: String.raw`Trova il versore di $v=${vec(v)}$.`,
              answer: v.map((x) => H.fracStr(x, m)),
              explain: String.raw`$|v|=\sqrt{${m * m}}=${m}$, quindi $\hat v=\frac{v}{|v|}=\left(${v.map((x) => H.frac(x, m)).join(',\\ ')}\right)$.` };
          } },
        { id: 's15.vettori.gen-AB', type: 'gen', level: 1,
          gen: (R) => {
            const A = rvec(R, 4);
            const [a, b, c] = R.pick(PYTH.slice(0, 6));
            const d = orthoMap(R)([a, b, c]);
            const B = add(A, d);
            const m = Math.sqrt(n2(d));
            return { type: 'num',
              prompt: String.raw`Calcola la distanza tra $A=${vec(A)}$ e $B=${vec(B)}$.`,
              answer: String(m),
              explain: String.raw`$\overrightarrow{AB}=B-A=${vec(d)}$, quindi $d(A,B)=\sqrt{${n2(d)}}=${m}$.` };
          } },
        { id: 's15.vettori.gen-scalare', type: 'gen', level: 1,
          gen: (R) => {
            const v = rvec(R, 4), w = rvec(R, 4);
            const d = H.dot(v, w);
            return { type: 'num',
              prompt: String.raw`Calcola $\langle v,w\rangle$ con $v=${vec(v)}$ e $w=${vec(w)}$.`,
              answer: String(d),
              explain: String.raw`Moltiplico le componenti corrispondenti e sommo: $${v.map((x, i) => `(${x})(${w[i]})`).join('+')}=${d}$.${d === 0 ? ' I vettori sono ortogonali.' : ''}` };
          } },
        { id: 's15.vettori.gen-ortogonale', type: 'gen', level: 2,
          gen: (R) => {
            // v = (a, b, k), w = (c, d, e): k = -(ac+bd)/e intero
            let a, b, c, d, e, s;
            do {
              a = R.nz(-3, 3); b = R.nz(-3, 3); c = R.nz(-3, 3); d = R.nz(-3, 3); e = R.pick([-2, -1, 1, 2]);
              s = a * c + b * d;
            } while (s % e !== 0);
            const k = -s / e;
            return { type: 'num',
              prompt: String.raw`Per quale $k$ i vettori $v=(${a}, ${b}, k)$ e $w=${vec([c, d, e])}$ sono ortogonali?`,
              answer: String(k),
              explain: String.raw`Impongo $\langle v,w\rangle=0$: $${a * c}${H.signed(b * d)}${H.signed(e, 'k')}=0$, cioè $${s}${H.signed(e, 'k')}=0$, da cui $k=${k}$.` };
          } },
        { id: 's15.vettori.gen-angolo', type: 'gen', level: 2,
          gen: (R) => {
            const T = R.pick([
              [[1, 1, 0], [1, 0, 1], 'pi/3', String.raw`\frac12`, String.raw`\frac\pi3`],
              [[1, 0, 0], [1, 1, 0], 'pi/4', String.raw`\frac{\sqrt2}2`, String.raw`\frac\pi4`],
              [[1, 0, 1], [-1, 1, 0], '2*pi/3', String.raw`-\frac12`, String.raw`\frac{2\pi}3`],
              [[1, 0, 0], [-1, 1, 0], '3*pi/4', String.raw`-\frac{\sqrt2}2`, String.raw`\frac{3\pi}4`],
              [[1, 1, 1], [1, -1, 0], 'pi/2', '0', String.raw`\frac\pi2`],
              [[2, 1, -2], [1, 2, 2], 'pi/2', '0', String.raw`\frac\pi2`],
              [[1, -1, 0], [0, 1, -1], '2*pi/3', String.raw`-\frac12`, String.raw`\frac{2\pi}3`],
              [[0, 1, 1], [0, 0, 1], 'pi/4', String.raw`\frac{\sqrt2}2`, String.raw`\frac\pi4`],
            ]);
            const f = orthoMap(R);
            const k1 = R.pick([1, 1, 2, 3]), k2 = R.pick([1, 1, 2]);
            const v = mul(k1, f(T[0])), w = mul(k2, f(T[1]));
            const d = H.dot(v, w);
            return { type: 'num',
              prompt: String.raw`Calcola l'angolo (in radianti) tra $v=${vec(v)}$ e $w=${vec(w)}$.`,
              answer: T[2],
              explain: String.raw`$\langle v,w\rangle=${d}$, $|v|=${H.sqrtTex(n2(v))}$, $|w|=${H.sqrtTex(n2(w))}$. Quindi $\cos\alpha=\frac{\langle v,w\rangle}{|v||w|}=${T[3]}$ e, con $\alpha\in[0,\pi]$, $\alpha=${T[4]}$.` };
          } },
        { id: 's15.vettori.gen-combinazione', type: 'gen', level: 1,
          gen: (R) => {
            const v = rvec(R, 3), w = rvec(R, 3);
            const a = R.pick([2, 3, -2, -1]), b = R.pick([2, -3, 3, -1]);
            const res = add(mul(a, v), mul(b, w));
            return { type: 'tuple', labels: ['x', 'y', 'z'],
              prompt: String.raw`Con $v=${vec(v)}$ e $w=${vec(w)}$, calcola $${H.coef(a)}v${H.signed(b, 'w')}$.`,
              answer: res.map(String),
              explain: String.raw`Componente per componente: $${a}\cdot${vec(v)}=${vec(mul(a, v))}$ e $${b}\cdot${vec(w)}=${vec(mul(b, w))}$; sommando: $${vec(res)}$.` };
          } },
        { id: 's15.vettori.p1', type: 'open', level: 3, points: 2,
          source: 'Appello 15/01/2026 · Parte A',
          prompt: String.raw`Definire il prodotto scalare $\langle v,w\rangle$ e scriverne la formula in coordinate. Come si riconoscono due vettori ortogonali?`,
          answer: String.raw`$\langle v,w\rangle=|v||w|\cos\alpha$, con $\alpha\in[0,\pi]$ angolo tra $v$ e $w$ (e $0$ se uno dei due è nullo). In coordinate: $\langle v,w\rangle=v_1w_1+v_2w_2+v_3w_3$. Due vettori non nulli sono ortogonali se e solo se $\cos\alpha=0$, cioè $\langle v,w\rangle=0$.`,
          rubric: ['Definizione con modulo, modulo e coseno', 'Angolo in [0, π] e caso del vettore nullo', 'Formula in coordinate', 'Criterio di ortogonalità'] },
        { id: 's15.vettori.p2', type: 'cloze', level: 2,
          prompt: 'Completa la formula per l\'angolo tra due vettori.',
          text: String.raw`Se $v,w\neq\mathbf 0$, l'angolo $\alpha$ tra loro soddisfa $\cos\alpha=$ [[0]], con $\alpha\in$ [[1]].`,
          blanks: [
            { options: [String.raw`$\frac{\langle v,w\rangle}{|v||w|}$`, String.raw`$\langle v,w\rangle\,|v||w|$`, String.raw`$\frac{|v||w|}{\langle v,w\rangle}$`], answer: 0 },
            { options: [String.raw`$[0,\pi]$`, String.raw`$[0,2\pi)$`, String.raw`$[-\frac\pi2,\frac\pi2]$`], answer: 0 },
          ],
          explain: String.raw`Si ricava dalla definizione $\langle v,w\rangle=|v||w|\cos\alpha$. L'angolo tra due vettori sta in $[0,\pi]$, dove il coseno è invertibile.` },
        { id: 's15.vettori.p3', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: per ogni $v,w$ vale $|\langle v,w\rangle|\le|v|\,|w|$.`,
          answer: true,
          explain: String.raw`Vero (disuguaglianza di Cauchy–Schwarz): $|\langle v,w\rangle|=|v||w||\cos\alpha|\le|v||w|$ perché $|\cos\alpha|\le1$. Vale l'uguaglianza se e solo se $v,w$ sono paralleli.` },
        { id: 's15.vettori.p4', type: 'mcq', level: 2,
          prompt: String.raw`Quale vettore è ortogonale sia a $(1,0,0)$ sia a $(0,1,1)$?`,
          options: [String.raw`$(0,1,-1)$`, String.raw`$(0,1,1)$`, String.raw`$(1,1,-1)$`, String.raw`$(0,0,1)$`],
          answer: 0,
          explain: String.raw`Serve prima componente $0$ (ortogonale a $\mathbf i$) e $y+z=0$. Solo $(0,1,-1)$. $(0,1,1)$ è parallelo al secondo, $(1,1,-1)$ ha prima componente $1$, $(0,0,1)$ dà prodotto $1$ col secondo.` },
      ],
      flashcards: [
        { id: 's15.vettori.fc1', kind: 'def', front: 'Vettore: da cosa è individuato?',
          back: String.raw`Da **modulo** (lunghezza), **direzione** (retta, a meno di parallele) e **verso**. In componenti $v=(v_1,v_2,v_3)=v_1\mathbf i+v_2\mathbf j+v_3\mathbf k$.` },
        { id: 's15.vettori.fc2', kind: 'formula', front: String.raw`Modulo di $v$ e distanza tra due punti`,
          back: String.raw`$|v|=\sqrt{v_1^2+v_2^2+v_3^2}$; $\ d(A,B)=|B-A|$.` },
        { id: 's15.vettori.fc3', kind: 'def', front: 'Versore di un vettore non nullo',
          back: String.raw`$\hat v=\frac{v}{|v|}$: modulo $1$, stessa direzione e verso di $v$.` },
        { id: 's15.vettori.fc4', kind: 'def', front: 'Definizione di prodotto scalare',
          back: String.raw`$\langle v,w\rangle=|v||w|\cos\alpha$, $\alpha\in[0,\pi]$ angolo tra $v$ e $w$; vale $0$ se un vettore è nullo. Il risultato è un **numero**.` },
        { id: 's15.vettori.fc5', kind: 'thm', front: 'Prodotto scalare in coordinate',
          back: String.raw`In una base ortonormale: $\langle v,w\rangle=v_1w_1+v_2w_2+v_3w_3$.` },
        { id: 's15.vettori.fc6', kind: 'dim', front: 'Idea della dimostrazione della formula in coordinate del prodotto scalare',
          back: String.raw`Teorema di Carnot nel triangolo di lati $v,w,v-w$: $|v-w|^2=|v|^2+|w|^2-2\langle v,w\rangle$. In coordinate $|v-w|^2=\sum v_i^2+\sum w_i^2-2\sum v_iw_i$. Confrontando, $\langle v,w\rangle=\sum v_iw_i$.` },
        { id: 's15.vettori.fc7', kind: 'formula', front: 'Angolo tra due vettori e ortogonalità',
          back: String.raw`$\cos\alpha=\frac{\langle v,w\rangle}{|v||w|}$, $\alpha\in[0,\pi]$. $\ v\perp w\iff\langle v,w\rangle=0$.` },
        { id: 's15.vettori.fc8', kind: 'formula', front: 'Proprietà del prodotto scalare',
          back: String.raw`Simmetrico, bilineare, $\langle v,v\rangle=|v|^2\ge0$; $|\langle v,w\rangle|\le|v||w|$ (Cauchy–Schwarz); $|v+w|^2=|v|^2+2\langle v,w\rangle+|w|^2$.` },
        { id: 's15.vettori.fc9', kind: 'errore', front: 'Errori tipici con i vettori',
          back: String.raw`$\overrightarrow{AB}=B-A$ (non $A-B$). $\langle v,w\rangle=0$ non implica $v=\mathbf 0$ o $w=\mathbf 0$. L'angolo sta in $[0,\pi]$: con $\cos\alpha=-\frac12$ è $\frac{2\pi}3$.` },
      ],
    },
    // -----------------------------------------------------------------------
    // s15.vettoriale
    // -----------------------------------------------------------------------
    {
      id: 's15.vettoriale',
      title: 'Prodotto vettoriale',
      summary: String.raw`Saprai definire il prodotto vettoriale (modulo, direzione, verso), calcolarlo in componenti e usarlo per aree, parallelismo e vettori normali.`,
      prereq: ['s15.vettori', 's00.trig'],
      examRefs: ['Appello 10/02/2026 · Parte A', 'Appello 11/06/2026 · Parte A', 'Appello 03/09/2026 · Parte A'],
      lessons: [
        {
          id: 's15.vettoriale.L1',
          title: 'Un vettore ortogonale a due vettori',
          cards: [
            { type: 'learn', title: 'Definizione (da sapere a memoria)',
              body: String.raw`Il prodotto scalare dà un numero. Il **prodotto vettoriale** $v\wedge w$ dà invece un **vettore**, definito da modulo, direzione e verso.

>* **Prodotto vettoriale.** Siano $v,w$ non nulli e non paralleli, $\alpha\in[0,\pi]$ l'angolo tra loro. $v\wedge w$ è il vettore con:
- **modulo** $|v\wedge w|=|v|\,|w|\sin\alpha$;
- **direzione** ortogonale sia a $v$ sia a $w$ (cioè al piano che li contiene);
- **verso** dato dalla **regola della mano destra**: $v$, $w$, $v\wedge w$ come pollice, indice e medio della mano destra (terna destrorsa).

Se $v$ e $w$ sono paralleli (o uno è nullo) si pone $v\wedge w=\mathbf 0$.

Esempio fondamentale: $\mathbf i\wedge\mathbf j=\mathbf k$, $\ \mathbf j\wedge\mathbf k=\mathbf i$, $\ \mathbf k\wedge\mathbf i=\mathbf j$.` },
            { id: 's15.vettoriale.L1.q1', type: 'mcq', level: 1,
              prompt: String.raw`Quanto vale $\mathbf j\wedge\mathbf i$?`,
              options: [String.raw`$-\mathbf k$`, String.raw`$\mathbf k$`, String.raw`$\mathbf 0$`, String.raw`$1$`],
              answer: 0,
              explain: String.raw`Il prodotto vettoriale è **anticommutativo**: $w\wedge v=-(v\wedge w)$. Da $\mathbf i\wedge\mathbf j=\mathbf k$ segue $\mathbf j\wedge\mathbf i=-\mathbf k$. Non è $\mathbf 0$ (i vettori non sono paralleli) e non è un numero.` },
            { id: 's15.vettoriale.L1.q2', type: 'num', level: 1,
              prompt: String.raw`Due vettori hanno $|v|=2$, $|w|=5$ e formano un angolo di $\frac\pi6$. Quanto vale $|v\wedge w|$?`,
              answer: '5',
              explain: String.raw`$|v\wedge w|=|v||w|\sin\alpha=2\cdot5\cdot\frac12=5$. Errore tipico: usare il coseno (quello è il prodotto scalare).` },
            { type: 'learn', title: 'Formula in componenti',
              body: String.raw`>* Se $v=(v_1,v_2,v_3)$ e $w=(w_1,w_2,w_3)$:
$$v\wedge w=\det\begin{pmatrix}\mathbf i&\mathbf j&\mathbf k\\ v_1&v_2&v_3\\ w_1&w_2&w_3\end{pmatrix}=(v_2w_3-v_3w_2,\ \ v_3w_1-v_1w_3,\ \ v_1w_2-v_2w_1).$$

Trucco per ricordarla: per la prima componente **copri la prima colonna** e fai il determinante $2\times2$ che resta; per la seconda copri la seconda colonna e **cambia segno**; per la terza copri la terza.

>! Il segno meno della componente centrale è l'errore più frequente.` },
            { type: 'example', title: 'Esempio svolto',
              problem: String.raw`Calcola $v\wedge w$ con $v=(1,2,3)$ e $w=(4,5,6)$.`,
              steps: [
                String.raw`Prima componente: $v_2w_3-v_3w_2=2\cdot6-3\cdot5=-3$.`,
                String.raw`Seconda: $v_3w_1-v_1w_3=3\cdot4-1\cdot6=6$.`,
                String.raw`Terza: $v_1w_2-v_2w_1=1\cdot5-2\cdot4=-3$.`,
                String.raw`Controllo l'ortogonalità: $\langle(-3,6,-3),(1,2,3)\rangle=-3+12-9=0$ ✓ e $\langle(-3,6,-3),(4,5,6)\rangle=-12+30-18=0$ ✓.`,
              ],
              result: String.raw`$v\wedge w=(-3,6,-3)$` },
            { type: 'example', title: 'Completa tu',
              problem: String.raw`Calcola $v\wedge w$ con $v=(3,-1,-2)$ e $w=(-1,1,1)$.`,
              steps: [
                String.raw`Prima componente: $(-1)\cdot1-(-2)\cdot1=-1+2=1$.`,
                { text: String.raw`Seconda: $v_3w_1-v_1w_3=(-2)(-1)-3\cdot1=-1$.`,
                  ask: { type: 'num', prompt: String.raw`Quanto vale la seconda componente $v_3w_1-v_1w_3$?`, answer: '-1', explain: String.raw`$(-2)\cdot(-1)-3\cdot1=2-3=-1$.` } },
                { text: String.raw`Terza: $v_1w_2-v_2w_1=3\cdot1-(-1)(-1)=2$.`,
                  ask: { type: 'num', prompt: String.raw`Quanto vale la terza componente?`, answer: '2', explain: String.raw`$3\cdot1-(-1)\cdot(-1)=3-1=2$.` } },
              ],
              result: String.raw`$v\wedge w=(1,-1,2)$ (è la normale del piano dell'Appello 11/06/2026).` },
            { id: 's15.vettoriale.L1.q3', type: 'tuple', level: 1,
              prompt: String.raw`Calcola $v\wedge w$ con $v=(1,0,2)$ e $w=(0,1,2)$.`,
              answer: ['-2', '-2', '1'], labels: ['x', 'y', 'z'],
              explain: String.raw`$(0\cdot2-2\cdot1,\ 2\cdot0-1\cdot2,\ 1\cdot1-0\cdot0)=(-2,-2,1)$. Controllo: $\langle(-2,-2,1),v\rangle=-2+2=0$ ✓.` },
            { id: 's15.vettoriale.L1.q4', type: 'tuple', level: 2,
              prompt: String.raw`Calcola $v\wedge w$ con $v=(1,-1,2)$ e $w=(2,1,-1)$.`,
              answer: ['-1', '5', '3'], labels: ['x', 'y', 'z'],
              explain: String.raw`$((-1)(-1)-2\cdot1,\ 2\cdot2-1\cdot(-1),\ 1\cdot1-(-1)\cdot2)=(1-2,\ 4+1,\ 1+2)=(-1,5,3)$. È la direzione della retta perpendicolare a due rette dell'Appello 06/07/2026.` },
            { id: 's15.vettoriale.L1.q5', type: 'tf', level: 1,
              prompt: String.raw`Vero o falso: $v\wedge w$ è ortogonale sia a $v$ sia a $w$.`,
              answer: true,
              explain: String.raw`Vero, per definizione (direzione ortogonale al piano di $v$ e $w$). In coordinate si verifica che $\langle v\wedge w,v\rangle=\langle v\wedge w,w\rangle=0$.` },
            { id: 's15.vettoriale.L1.q6', type: 'mcq', level: 2,
              prompt: String.raw`Quale proprietà **non** vale per il prodotto vettoriale?`,
              options: ['Proprietà commutativa', 'Bilinearità', String.raw`$v\wedge v=\mathbf 0$`, String.raw`$(\lambda v)\wedge w=\lambda(v\wedge w)$`],
              answer: 0,
              explain: String.raw`Vale l'**anti**commutatività: $w\wedge v=-(v\wedge w)$. Le altre valgono: è bilineare (quindi anche $(\lambda v)\wedge w=\lambda(v\wedge w)$) e $v\wedge v=\mathbf 0$ perché $\sin0=0$. Non è nemmeno associativo.` },
            { id: 's15.vettoriale.L1.q7', type: 'tuple', level: 2,
              prompt: String.raw`Sapendo che $v\wedge w=(2,-1,3)$, calcola $w\wedge(2v)$.`,
              answer: ['-4', '2', '-6'], labels: ['x', 'y', 'z'],
              explain: String.raw`Bilinearità e anticommutatività: $w\wedge(2v)=2(w\wedge v)=-2(v\wedge w)=(-4,2,-6)$.` },
          ],
        },
        {
          id: 's15.vettoriale.L2',
          title: 'Aree e parallelismo',
          cards: [
            { type: 'learn', title: 'Il modulo è un\'area',
              body: String.raw`Il parallelogramma di lati $v$ e $w$ ha base $|v|$ e altezza $|w|\sin\alpha$. Quindi:

>* $|v\wedge w|$ = **area del parallelogramma** di lati $v,w$. L'area del **triangolo** è la metà: $\ \mathcal A_{ABC}=\frac12|\overrightarrow{AB}\wedge\overrightarrow{AC}|$.

E siccome $\sin\alpha=0$ solo per $\alpha=0,\pi$:

>* $v\wedge w=\mathbf 0\iff v$ e $w$ sono **paralleli** (o uno è nullo).

Utile anche l'identità di Lagrange: $|v\wedge w|^2=|v|^2|w|^2-\langle v,w\rangle^2$ (da $\sin^2+\cos^2=1$).` },
            { type: 'example', title: 'Esempio svolto: area di un triangolo',
              problem: String.raw`Calcola l'area del triangolo $A=(1,0,0)$, $B=(0,2,0)$, $C=(0,0,2)$.`,
              steps: [
                String.raw`Lati uscenti da $A$: $\overrightarrow{AB}=(-1,2,0)$, $\overrightarrow{AC}=(-1,0,2)$.`,
                String.raw`$\overrightarrow{AB}\wedge\overrightarrow{AC}=(2\cdot2-0\cdot0,\ 0\cdot(-1)-(-1)\cdot2,\ (-1)\cdot0-2\cdot(-1))=(4,2,2)$.`,
                { text: String.raw`$|(4,2,2)|=\sqrt{24}=2\sqrt6$.`,
                  ask: { type: 'num', prompt: String.raw`Quanto vale $|(4,2,2)|$?`, answer: 'sqrt(24)', explain: String.raw`$\sqrt{16+4+4}=\sqrt{24}=2\sqrt6$.` } },
                { text: String.raw`Area $=\frac12\cdot2\sqrt6=\sqrt6$.`,
                  ask: { type: 'num', prompt: 'Area del triangolo?', answer: 'sqrt(6)', explain: String.raw`Metà dell'area del parallelogramma: $\frac{2\sqrt6}{2}=\sqrt6$.` } },
              ],
              result: String.raw`$\mathcal A=\sqrt6$` },
            { id: 's15.vettoriale.L2.q1', type: 'num', level: 1,
              prompt: String.raw`Calcola l'area del parallelogramma di lati $v=(1,0,2)$ e $w=(0,1,2)$.`,
              answer: '3',
              explain: String.raw`$v\wedge w=(-2,-2,1)$, quindi area $=\sqrt{4+4+1}=3$.` },
            { id: 's15.vettoriale.L2.q2', type: 'num', level: 2,
              prompt: String.raw`Calcola l'area del triangolo di vertici $A=(1,1,1)$, $B=(2,1,1)$, $C=(1,3,1)$.`,
              answer: '1',
              explain: String.raw`$\overrightarrow{AB}=(1,0,0)$, $\overrightarrow{AC}=(0,2,0)$, prodotto vettoriale $(0,0,2)$ di modulo $2$; area $=\frac12\cdot2=1$. (È un triangolo rettangolo di cateti $1$ e $2$.) Errore tipico: dimenticare il $\frac12$.` },
            { id: 's15.vettoriale.L2.q3', type: 'num', level: 2,
              prompt: String.raw`Per quale $k$ i vettori $v=(2,-1,k)$ e $w=(-4,2,6)$ sono paralleli?`,
              answer: '-3',
              explain: String.raw`Paralleli $\iff w=\lambda v$. Dalle prime componenti $\lambda=-2$ (e $2=-2\cdot(-1)$ ✓), quindi $6=-2k\Rightarrow k=-3$. Equivalente: $v\wedge w=\mathbf 0$.` },
            { id: 's15.vettoriale.L2.q4', type: 'num', level: 2,
              prompt: String.raw`Sai che $|v|=3$, $|w|=4$, $\langle v,w\rangle=6$. Quanto vale $|v\wedge w|$?`,
              answer: '6*sqrt(3)',
              explain: String.raw`Lagrange: $|v\wedge w|^2=9\cdot16-36=108$, quindi $|v\wedge w|=\sqrt{108}=6\sqrt3$. (Oppure: $\cos\alpha=\frac12$, $\sin\alpha=\frac{\sqrt3}2$, $12\cdot\frac{\sqrt3}2=6\sqrt3$.)` },
            { id: 's15.vettoriale.L2.q5', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: se $v\wedge w=\mathbf 0$ e $\langle v,w\rangle=0$, allora almeno uno tra $v$ e $w$ è nullo.`,
              answer: true,
              explain: String.raw`Vero. Se fossero entrambi non nulli, $v\wedge w=\mathbf 0$ darebbe $\sin\alpha=0$ e $\langle v,w\rangle=0$ darebbe $\cos\alpha=0$: impossibile insieme. (Oppure Lagrange: $|v|^2|w|^2=0$.)` },
            { id: 's15.vettoriale.L2.q6', type: 'tuple', level: 2, proportional: true,
              prompt: String.raw`Trova un vettore non nullo ortogonale sia a $v=(1,1,0)$ sia a $w=(0,1,-1)$.`,
              answer: ['-1', '1', '1'], labels: ['x', 'y', 'z'],
              explain: String.raw`Basta $v\wedge w=(1\cdot(-1)-0\cdot1,\ 0\cdot0-1\cdot(-1),\ 1\cdot1-1\cdot0)=(-1,1,1)$. Va bene qualunque multiplo non nullo, ad esempio $(1,-1,-1)$.` },
            { id: 's15.vettoriale.L2.q7', type: 'mcq', level: 2,
              prompt: String.raw`$|v\wedge w|=|v|\,|w|$ (con $v,w$ non nulli) se e solo se:`,
              options: [String.raw`$v\perp w$`, String.raw`$v\parallel w$`, String.raw`$|v|=|w|$`, 'sempre'],
              answer: 0,
              explain: String.raw`$|v\wedge w|=|v||w|\sin\alpha$ e $\sin\alpha=1\iff\alpha=\frac\pi2$. Con vettori paralleli invece il prodotto vettoriale è nullo.` },
            { id: 's15.vettoriale.L2.q8', type: 'match', level: 1,
              prompt: 'Abbina.',
              pairs: [
                [String.raw`$\langle v,w\rangle$`, 'Un numero: $|v||w|\\cos\\alpha$'],
                [String.raw`$v\wedge w$`, 'Un vettore ortogonale a $v$ e $w$'],
                [String.raw`$|v\wedge w|$`, 'Area del parallelogramma'],
                [String.raw`$\frac12|\overrightarrow{AB}\wedge\overrightarrow{AC}|$`, 'Area del triangolo $ABC$'],
              ],
              explain: String.raw`Scalare $\to$ numero (con il coseno); vettoriale $\to$ vettore (modulo con il seno = area).` },
          ],
        },
        {
          id: 's15.vettoriale.L3',
          title: "Livello d'esame: teoria",
          cards: [
            { type: 'learn', title: 'Dalla definizione alla formula',
              body: String.raw`La formula in componenti si ricava da tre proprietà: **bilinearità**, **anticommutatività** e i prodotti dei versori fondamentali
$$\mathbf i\wedge\mathbf i=\mathbf j\wedge\mathbf j=\mathbf k\wedge\mathbf k=\mathbf 0,\quad \mathbf i\wedge\mathbf j=\mathbf k,\ \ \mathbf j\wedge\mathbf k=\mathbf i,\ \ \mathbf k\wedge\mathbf i=\mathbf j.$$
Sviluppando $(v_1\mathbf i+v_2\mathbf j+v_3\mathbf k)\wedge(w_1\mathbf i+w_2\mathbf j+w_3\mathbf k)$ restano solo i 6 termini misti:
$$v_1w_2\,\mathbf k-v_1w_3\,\mathbf j-v_2w_1\,\mathbf k+v_2w_3\,\mathbf i+v_3w_1\,\mathbf j-v_3w_2\,\mathbf i.$$
Raccogliendo: $(v_2w_3-v_3w_2)\mathbf i+(v_3w_1-v_1w_3)\mathbf j+(v_1w_2-v_2w_1)\mathbf k$.

**Proprietà chiave per gli esercizi:** se $P,Q$ stanno su un piano **per l'origine** con normale $n$, allora $\overrightarrow{OP},\overrightarrow{OQ}$ sono ortogonali a $n$, e quindi $\overrightarrow{OP}\wedge\overrightarrow{OQ}$ (ortogonale al piano) è **parallelo a $n$** (o nullo).` },
            { id: 's15.vettoriale.L3.q1', type: 'open', level: 3, points: 2,
              source: 'Appello 10/02/2026 · Parte A',
              prompt: String.raw`Si dia la definizione di prodotto vettoriale tra due vettori dello spazio (modulo, direzione e verso).`,
              answer: String.raw`Siano $v,w$ vettori non nulli e non paralleli e sia $\alpha\in[0,\pi]$ l'angolo tra essi. Il prodotto vettoriale $v\wedge w$ è il vettore che ha:
- **modulo** $|v\wedge w|=|v||w|\sin\alpha$ (l'area del parallelogramma di lati $v,w$);
- **direzione** ortogonale al piano individuato da $v$ e $w$ (cioè ortogonale a entrambi);
- **verso** tale che $(v,w,v\wedge w)$ sia una terna destrorsa (regola della mano destra).

Se $v$ e $w$ sono paralleli o uno dei due è nullo, $v\wedge w=\mathbf 0$.`,
              rubric: [
                String.raw`Modulo $|v||w|\sin\alpha$ con $\alpha$ angolo tra i vettori`,
                'Direzione ortogonale a entrambi i vettori',
                'Verso con la regola della mano destra / terna destrorsa',
                'Caso dei vettori paralleli o nulli (prodotto nullo)',
              ] },
            { id: 's15.vettoriale.L3.q2', type: 'cloze', level: 3,
              source: 'Appello 11/06/2026 · Parte A',
              prompt: 'Espressione del prodotto vettoriale in componenti.',
              text: String.raw`Se $v=(v_1,v_2,v_3)$ e $w=(w_1,w_2,w_3)$, allora $v\wedge w=($ [[0]] $,$ [[1]] $,$ [[2]] $)$.`,
              blanks: [
                { options: [String.raw`$v_2w_3-v_3w_2$`, String.raw`$v_2w_3+v_3w_2$`, String.raw`$v_1w_1$`], answer: 0 },
                { options: [String.raw`$v_3w_1-v_1w_3$`, String.raw`$v_1w_3-v_3w_1$`, String.raw`$v_2w_2$`], answer: 0 },
                { options: [String.raw`$v_1w_2-v_2w_1$`, String.raw`$v_2w_1-v_1w_2$`, String.raw`$v_3w_3$`], answer: 0 },
              ],
              explain: String.raw`È lo sviluppo del determinante con $\mathbf i,\mathbf j,\mathbf k$ in prima riga: la componente centrale ha il segno cambiato, $-(v_1w_3-v_3w_1)=v_3w_1-v_1w_3$.` },
            { id: 's15.vettoriale.L3.q3', type: 'order', level: 3,
              prompt: 'Riordina la deduzione della formula in componenti del prodotto vettoriale.',
              steps: [
                String.raw`Scrivo $v=v_1\mathbf i+v_2\mathbf j+v_3\mathbf k$ e $w=w_1\mathbf i+w_2\mathbf j+w_3\mathbf k$.`,
                String.raw`Per bilinearità $v\wedge w=\sum_{h,k}v_hw_k\,(\mathbf e_h\wedge\mathbf e_k)$: nove termini.`,
                String.raw`I tre termini con $\mathbf e_h\wedge\mathbf e_h$ sono nulli (vettori paralleli).`,
                String.raw`Uso $\mathbf i\wedge\mathbf j=\mathbf k$, $\mathbf j\wedge\mathbf k=\mathbf i$, $\mathbf k\wedge\mathbf i=\mathbf j$ e l'anticommutatività per gli altri sei.`,
                String.raw`Raccolgo: $v\wedge w=(v_2w_3-v_3w_2)\mathbf i+(v_3w_1-v_1w_3)\mathbf j+(v_1w_2-v_2w_1)\mathbf k$.`,
              ],
              distractors: [
                String.raw`Uso la commutatività: $\mathbf j\wedge\mathbf i=\mathbf i\wedge\mathbf j=\mathbf k$.`,
                String.raw`I termini $\mathbf e_h\wedge\mathbf e_h$ valgono $1$ perché i versori hanno modulo $1$.`,
              ],
              explain: String.raw`Il prodotto vettoriale è anticommutativo ($\mathbf j\wedge\mathbf i=-\mathbf k$) e $\mathbf e\wedge\mathbf e=\mathbf 0$ (angolo nullo, seno nullo): $1$ è il prodotto **scalare** $\langle\mathbf e,\mathbf e\rangle$.` },
            { id: 's15.vettoriale.L3.q4', type: 'open', level: 3, points: 3,
              source: 'Appello 03/09/2026 · Parte A',
              prompt: String.raw`Esistono due punti $P,Q$ del piano $\pi: x-y+z=0$ tali che $\overrightarrow{OP}\wedge\overrightarrow{OQ}=(1,-1,3)$? Motivare la risposta.`,
              answer: String.raw`**No.** Il piano $\pi$ passa per l'origine $O$ (infatti $0-0+0=0$), quindi per ogni $P,Q\in\pi$ i vettori $\overrightarrow{OP}$, $\overrightarrow{OQ}$ giacciono in $\pi$ e sono ortogonali alla normale $n=(1,-1,1)$.

Il prodotto vettoriale $\overrightarrow{OP}\wedge\overrightarrow{OQ}$ è ortogonale a entrambi, cioè ortogonale al piano $\pi$: dunque è **parallelo a $n$** (oppure nullo).

Ma $(1,-1,3)$ non è multiplo di $(1,-1,1)$ (dalle prime componenti il fattore sarebbe $1$, ma $3\neq1$). Equivalentemente $\langle(1,-1,3),\overrightarrow{OP}\rangle$ dovrebbe essere $0$ per ogni $P\in\pi$, mentre ad esempio $P=(1,1,0)\in\pi$ dà $1-1+0=0$ ma $P=(0,1,1)\in\pi$ dà $0-1+3=2\neq0$. Quindi tali $P,Q$ non esistono.`,
              rubric: [
                String.raw`Osserva che il piano passa per l'origine, quindi $\overrightarrow{OP},\overrightarrow{OQ}\perp n=(1,-1,1)$`,
                String.raw`Usa che $\overrightarrow{OP}\wedge\overrightarrow{OQ}$ è ortogonale a entrambi, quindi parallelo a $n$ (o nullo)`,
                String.raw`Verifica che $(1,-1,3)$ non è parallelo a $(1,-1,1)$`,
                'Conclusione corretta: tali punti non esistono',
              ] },
            { id: 's15.vettoriale.L3.q5', type: 'mcq', level: 3,
              prompt: String.raw`Per quale vettore $u$ **esistono** $P,Q$ sul piano $2x+y-z=0$ con $\overrightarrow{OP}\wedge\overrightarrow{OQ}=u$?`,
              options: [String.raw`$u=(-4,-2,2)$`, String.raw`$u=(2,1,1)$`, String.raw`$u=(1,-2,0)$`, String.raw`$u=(2,-1,-1)$`],
              answer: 0,
              explain: String.raw`Serve $u$ parallelo alla normale $n=(2,1,-1)$: $(-4,-2,2)=-2n$ ✓. Gli altri non sono multipli di $n$: $(1,-2,0)$ è addirittura **ortogonale** a $n$ (giace nel piano), errore tipico di chi confonde "nel piano" con "normale al piano".` },
            { id: 's15.vettoriale.L3.q6', type: 'learn', title: 'Bonus: prodotto misto',
              body: String.raw`Il numero $\langle u,v\wedge w\rangle$ (**prodotto misto**) vale, in valore assoluto, il **volume** del parallelepipedo di spigoli $u,v,w$. Quindi:

>* $u,v,w$ sono **complanari** $\iff\langle u,v\wedge w\rangle=0$.

Lo useremo per riconoscere le rette sghembe e per la distanza tra rette.` },
            { id: 's15.vettoriale.L3.q7', type: 'num', level: 2,
              prompt: String.raw`Calcola il volume del parallelepipedo di spigoli $u=(1,2,0)$, $v=(0,1,1)$, $w=(1,0,1)$.`,
              answer: '3',
              explain: String.raw`$v\wedge w=(1\cdot1-1\cdot0,\ 1\cdot1-0\cdot1,\ 0\cdot0-1\cdot1)=(1,1,-1)$; $\langle u,v\wedge w\rangle=1+2+0=3$. Volume $=|3|=3$.` },
            { id: 's15.vettoriale.L3.q8', type: 'tf', level: 3,
              prompt: String.raw`Vero o falso: i vettori $(1,2,3)$, $(4,5,6)$, $(7,8,9)$ sono complanari.`,
              answer: true,
              explain: String.raw`$(4,5,6)\wedge(7,8,9)=(45-48,\ 42-36,\ 32-35)=(-3,6,-3)$ e $\langle(1,2,3),(-3,6,-3)\rangle=-3+12-9=0$. Prodotto misto nullo: complanari (infatti $(7,8,9)=2(4,5,6)-(1,2,3)$).` },
          ],
        },
      ],
      practice: [
        { id: 's15.vettoriale.gen-cross', type: 'gen', level: 1,
          gen: (R) => {
            let v, w, c;
            do { v = rvec(R, 3); w = rvec(R, 3); c = H.cross(v, w); } while (isZero(c));
            return { type: 'tuple', labels: ['x', 'y', 'z'],
              prompt: String.raw`Calcola $v\wedge w$ con $v=${vec(v)}$ e $w=${vec(w)}$.`,
              answer: c.map(String),
              explain: String.raw`$v\wedge w=(v_2w_3-v_3w_2,\ v_3w_1-v_1w_3,\ v_1w_2-v_2w_1)=((${v[1]})(${w[2]})-(${v[2]})(${w[1]}),\ (${v[2]})(${w[0]})-(${v[0]})(${w[2]}),\ (${v[0]})(${w[1]})-(${v[1]})(${w[0]}))=${vec(c)}$. Controllo: $\langle v\wedge w,v\rangle=${H.dot(c, v)}$.` };
          } },
        { id: 's15.vettoriale.gen-area-par', type: 'gen', level: 2,
          gen: (R) => {
            let v, w, c;
            do { v = rvec(R, 2); w = rvec(R, 2); c = H.cross(v, w); } while (isZero(c));
            const N = n2(c);
            return { type: 'num',
              prompt: String.raw`Calcola l'area del parallelogramma di lati $v=${vec(v)}$ e $w=${vec(w)}$.`,
              answer: `sqrt(${N})`,
              explain: String.raw`L'area è $|v\wedge w|$. $v\wedge w=${vec(c)}$, quindi area $=\sqrt{${N}}${H.sqrtTex(N) === `\\sqrt{${N}}` ? '' : `=${H.sqrtTex(N)}`}$.` };
          } },
        { id: 's15.vettoriale.gen-area-tri', type: 'gen', level: 2,
          gen: (R) => {
            let A, B, C, c;
            do {
              A = [R.int(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              B = add(A, rvec(R, 2)); C = add(A, rvec(R, 2));
              c = H.cross(sub(B, A), sub(C, A));
            } while (isZero(c));
            const N = n2(c);
            const [a, b] = H.sqrtParts(N);
            const areaTex = b === 1 ? H.frac(a, 2) : (a % 2 === 0 ? `${H.coef(a / 2)}\\sqrt{${b}}` : `\\frac{${a === 1 ? '' : a}\\sqrt{${b}}}{2}`);
            return { type: 'num',
              prompt: String.raw`Calcola l'area del triangolo di vertici $A=${vec(A)}$, $B=${vec(B)}$, $C=${vec(C)}$.`,
              answer: `sqrt(${N})/2`,
              explain: String.raw`$\overrightarrow{AB}=${vec(sub(B, A))}$, $\overrightarrow{AC}=${vec(sub(C, A))}$, $\overrightarrow{AB}\wedge\overrightarrow{AC}=${vec(c)}$ di modulo $\sqrt{${N}}$. L'area è la metà: $\frac{\sqrt{${N}}}{2}=${areaTex}$.` };
          } },
        { id: 's15.vettoriale.gen-parallelo', type: 'gen', level: 2,
          gen: (R) => {
            const a = R.nz(-3, 3), b = R.nz(-3, 3), c = R.nz(-3, 3);
            const m = R.pick([-3, -2, 2, 3]);
            return { type: 'num',
              prompt: String.raw`Per quale $k$ i vettori $v=(${a}, ${b}, k)$ e $w=${vec([m * a, m * b, m * c])}$ sono paralleli?`,
              answer: String(c),
              explain: String.raw`Paralleli $\iff w=\lambda v$ (cioè $v\wedge w=\mathbf 0$). Dalle prime due componenti $\lambda=${m}$, quindi $${m * c}=${m}k\Rightarrow k=${c}$.` };
          } },
        { id: 's15.vettoriale.gen-anti', type: 'gen', level: 2,
          gen: (R) => {
            const c = rvec(R, 4);
            const k = R.pick([2, 3, -2, -3]);
            const kind = R.int(0, 2);
            const res = kind === 0 ? mul(-k, c) : kind === 1 ? mul(-1, c) : mul(k, c);
            const q = kind === 0 ? String.raw`w\wedge(${k}v)` : kind === 1 ? String.raw`w\wedge(v+w)` : String.raw`(${k}v+w)\wedge w`;
            const why = kind === 0 ? String.raw`w\wedge(${k}v)=${k}(w\wedge v)=${-k}(v\wedge w)`
              : kind === 1 ? String.raw`w\wedge(v+w)=w\wedge v+w\wedge w=-(v\wedge w)+\mathbf 0`
                : String.raw`(${k}v+w)\wedge w=${k}(v\wedge w)+w\wedge w=${k}(v\wedge w)`;
            return { type: 'tuple', labels: ['x', 'y', 'z'],
              prompt: String.raw`Sapendo che $v\wedge w=${vec(c)}$, calcola $${q}$.`,
              answer: res.map(String),
              explain: String.raw`Bilinearità, anticommutatività e $w\wedge w=\mathbf 0$: $${why}=${vec(res)}$.` };
          } },
        { id: 's15.vettoriale.gen-piano-origine', type: 'gen', level: 3,
          gen: (R) => {
            const n = prim(rvec(R, 3));
            const yes = R.chance(0.5);
            let u = mul(R.pick([-2, -1, 2, 3]), n);
            if (!yes) {
              const i = R.int(0, 2);
              u = u.slice(); u[i] += R.pick([-2, -1, 1, 2]);
            }
            const ok = isZero(H.cross(u, n));
            return { type: 'tf',
              prompt: String.raw`Vero o falso: esistono $P,Q$ sul piano $${H.planeTex(n[0], n[1], n[2], 0)}$ tali che $\overrightarrow{OP}\wedge\overrightarrow{OQ}=${vec(u)}$.`,
              answer: ok,
              explain: String.raw`Il piano passa per $O$, quindi $\overrightarrow{OP},\overrightarrow{OQ}$ sono ortogonali alla normale $n=${vec(n)}$ e il loro prodotto vettoriale è parallelo a $n$. ${ok ? String.raw`$${vec(u)}$ è multiplo di $n$: **vero**: presi due vettori $a,b$ non paralleli nel piano, $a\wedge b=\lambda n$ con $\lambda\neq0$; se $u=\mu n$, basta prendere $\overrightarrow{OP}=\frac{\mu}{\lambda}a$ e $\overrightarrow{OQ}=b$.` : String.raw`$${vec(u)}$ non è multiplo di $n$ (il prodotto vettoriale con $n$ vale $${vec(H.cross(u, n))}\neq\mathbf 0$): **falso**.`}` };
          } },
        { id: 's15.vettoriale.gen-misto', type: 'gen', level: 2,
          gen: (R) => {
            const u = rvec(R, 2), v = rvec(R, 2), w = rvec(R, 2);
            const c = H.cross(v, w), m = H.dot(u, c);
            return { type: 'num',
              prompt: String.raw`Calcola il prodotto misto $\langle u,v\wedge w\rangle$ con $u=${vec(u)}$, $v=${vec(v)}$, $w=${vec(w)}$.`,
              answer: String(m),
              explain: String.raw`$v\wedge w=${vec(c)}$, quindi $\langle u,v\wedge w\rangle=${m}$.${m === 0 ? ' È nullo: i tre vettori sono complanari.' : ` Il volume del parallelepipedo è $${Math.abs(m)}$.`}` };
          } },
        { id: 's15.vettoriale.p1', type: 'open', level: 3, points: 1,
          source: 'Appello 11/06/2026 · Parte A',
          prompt: String.raw`Scrivere l'espressione in componenti del prodotto vettoriale $v\wedge w$.`,
          answer: String.raw`$$v\wedge w=\det\begin{pmatrix}\mathbf i&\mathbf j&\mathbf k\\ v_1&v_2&v_3\\ w_1&w_2&w_3\end{pmatrix}=(v_2w_3-v_3w_2)\mathbf i+(v_3w_1-v_1w_3)\mathbf j+(v_1w_2-v_2w_1)\mathbf k.$$`,
          rubric: ['Prima e terza componente corrette', 'Segno corretto della seconda componente', 'Scrittura come determinante simbolico o equivalente'] },
        { id: 's15.vettoriale.p2', type: 'mcq', level: 2,
          prompt: String.raw`Se $v\wedge w=\mathbf 0$ con $v,w\neq\mathbf 0$, allora:`,
          options: [String.raw`$v$ e $w$ sono paralleli`, String.raw`$v$ e $w$ sono ortogonali`, String.raw`$|v|=|w|$`, String.raw`$\langle v,w\rangle=0$`],
          answer: 0,
          explain: String.raw`$|v\wedge w|=|v||w|\sin\alpha=0$ con moduli non nulli impone $\sin\alpha=0$: $\alpha=0$ o $\pi$, cioè paralleli. L'ortogonalità annulla invece il prodotto **scalare**.` },
        { id: 's15.vettoriale.p3', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $(\mathbf i\wedge\mathbf i)\wedge\mathbf j=\mathbf i\wedge(\mathbf i\wedge\mathbf j)$.`,
          answer: false,
          explain: String.raw`A sinistra $\mathbf 0\wedge\mathbf j=\mathbf 0$; a destra $\mathbf i\wedge\mathbf k=-\mathbf j$. Il prodotto vettoriale **non è associativo**.` },
      ],
      flashcards: [
        { id: 's15.vettoriale.fc1', kind: 'def', front: 'Definizione di prodotto vettoriale (modulo, direzione, verso)',
          back: String.raw`Modulo $|v||w|\sin\alpha$; direzione ortogonale a $v$ e $w$; verso dato dalla regola della mano destra ($v,w,v\wedge w$ terna destrorsa). Nullo se $v\parallel w$ o un vettore è nullo.` },
        { id: 's15.vettoriale.fc2', kind: 'thm', front: 'Prodotto vettoriale in componenti',
          back: String.raw`$v\wedge w=(v_2w_3-v_3w_2,\ v_3w_1-v_1w_3,\ v_1w_2-v_2w_1)$ = determinante con $\mathbf i,\mathbf j,\mathbf k$ in prima riga.` },
        { id: 's15.vettoriale.fc3', kind: 'dim', front: 'Idea della deduzione della formula in componenti',
          back: String.raw`Bilinearità: $v\wedge w=\sum v_hw_k\,\mathbf e_h\wedge\mathbf e_k$. I termini $\mathbf e_h\wedge\mathbf e_h$ sono nulli; $\mathbf i\wedge\mathbf j=\mathbf k$, $\mathbf j\wedge\mathbf k=\mathbf i$, $\mathbf k\wedge\mathbf i=\mathbf j$ e l'anticommutatività danno gli altri sei. Raccogliere.` },
        { id: 's15.vettoriale.fc4', kind: 'formula', front: 'Proprietà del prodotto vettoriale',
          back: String.raw`Anticommutativo $w\wedge v=-v\wedge w$; bilineare; $v\wedge v=\mathbf 0$; non associativo; $v\wedge w=\mathbf 0\iff v\parallel w$; $|v\wedge w|^2=|v|^2|w|^2-\langle v,w\rangle^2$.` },
        { id: 's15.vettoriale.fc5', kind: 'formula', front: 'Area di parallelogramma e triangolo',
          back: String.raw`Parallelogramma di lati $v,w$: $|v\wedge w|$. Triangolo $ABC$: $\frac12|\overrightarrow{AB}\wedge\overrightarrow{AC}|$.` },
        { id: 's15.vettoriale.fc6', kind: 'metodo', front: String.raw`$P,Q$ su un piano per l'origine con normale $n$: cosa sai di $\overrightarrow{OP}\wedge\overrightarrow{OQ}$?`,
          back: String.raw`È parallelo a $n$ (o nullo), perché $\overrightarrow{OP},\overrightarrow{OQ}$ giacciono nel piano. Quindi un vettore non multiplo di $n$ non si può ottenere così.` },
        { id: 's15.vettoriale.fc7', kind: 'formula', front: 'Prodotto misto e complanarità',
          back: String.raw`$|\langle u,v\wedge w\rangle|$ = volume del parallelepipedo. $u,v,w$ complanari $\iff\langle u,v\wedge w\rangle=0$.` },
        { id: 's15.vettoriale.fc8', kind: 'errore', front: 'Errori tipici nel prodotto vettoriale',
          back: String.raw`Dimenticare il segno meno della componente centrale; scambiare l'ordine ($w\wedge v=-v\wedge w$); usare il coseno nel modulo; dimenticare il $\frac12$ nell'area del triangolo.` },
      ],
    },
    // -----------------------------------------------------------------------
    // s15.rette
    // -----------------------------------------------------------------------
    {
      id: 's15.rette',
      title: 'Rette nello spazio',
      summary: String.raw`Saprai scrivere una retta in forma parametrica e cartesiana, passare dall'una all'altra e riconoscere rette parallele, ortogonali, incidenti e sghembe.`,
      prereq: ['s15.vettoriale', 's00.equazioni'],
      examRefs: ['Itinere 15/01/2026 · Parte B', 'Appello 11/06/2026 · Parte B', 'Appello 06/07/2026 · Parte A e B'],
      lessons: [
        {
          id: 's15.rette.L1',
          title: 'Punto + direzione',
          cards: [
            { type: 'learn', title: 'Equazioni parametriche',
              body: String.raw`Una retta nello spazio è individuata da **un punto** $P_0=(x_0,y_0,z_0)$ e da **un vettore direzione** $v=(l,m,n)\neq\mathbf 0$. I suoi punti sono $P_0+t\,v$ al variare di $t\in\R$:
$$r:\ \begin{cases}x=x_0+l\,t\\ y=y_0+m\,t\\ z=z_0+n\,t\end{cases}\qquad t\in\R.$$
Lo scriveremo anche in breve $r:\ (x,y,z)=(x_0+lt,\ y_0+mt,\ z_0+nt)$.

- i **termini noti** danno un punto (quello con $t=0$);
- i **coefficienti di $t$** danno la direzione.

La stessa retta ha infinite parametrizzazioni: si può cambiare punto e usare qualunque multiplo non nullo di $v$.` },
            { id: 's15.rette.L1.q1', type: 'mcq', level: 1,
              prompt: String.raw`Quale vettore è una direzione della retta $r:\ (x,y,z)=(1+2t,\ -t,\ 3)$?`,
              options: [String.raw`$(2,-1,0)$`, String.raw`$(1,0,3)$`, String.raw`$(2,-1,3)$`, String.raw`$(3,-1,3)$`],
              answer: 0,
              explain: String.raw`La direzione è data dai coefficienti di $t$: $2$, $-1$ e $0$ (la $z$ non dipende da $t$). $(1,0,3)$ è il punto per $t=0$; $(2,-1,3)$ mescola coefficienti e termini noti.` },
            { id: 's15.rette.L1.q2', type: 'tuple', level: 1,
              prompt: String.raw`Trova il punto della retta $r:\ (x,y,z)=(1+2t,\ 3-t,\ -1+4t)$ corrispondente a $t=2$.`,
              answer: ['5', '1', '7'], labels: ['x', 'y', 'z'],
              explain: String.raw`Sostituisco $t=2$: $(1+4,\ 3-2,\ -1+8)=(5,1,7)$.` },
            { type: 'learn', title: 'Retta per due punti',
              body: String.raw`Per due punti distinti $A$, $B$ passa una sola retta: come direzione si prende $v=B-A$ e come punto $A$:
$$r:\ A+t\,(B-A).$$
Per $t=0$ si ottiene $A$, per $t=1$ si ottiene $B$.

Per sapere se un punto $Q$ sta su $r$: si cerca un **unico** $t$ che soddisfi **tutte e tre** le equazioni.` },
            { type: 'example', title: 'Esempio svolto',
              problem: String.raw`Scrivi la retta per $A=(1,0,2)$ e $B=(3,1,-1)$ e stabilisci se $Q=(7,3,-7)$ le appartiene.`,
              steps: [
                String.raw`Direzione: $v=B-A=(2,1,-3)$.`,
                String.raw`$r:\ (x,y,z)=(1+2t,\ t,\ 2-3t)$.`,
                String.raw`Prima equazione: $1+2t=7\Rightarrow t=3$.`,
                String.raw`Controllo le altre con $t=3$: $y=3$ ✓, $z=2-9=-7$ ✓.`,
              ],
              result: String.raw`$Q\in r$ (per $t=3$).` },
            { id: 's15.rette.L1.q3', type: 'tuple', level: 1, proportional: true,
              prompt: String.raw`Trova un vettore direzione della retta per $A=(2,-1,0)$ e $B=(0,1,3)$.`,
              answer: ['-2', '2', '3'], labels: ['l', 'm', 'n'],
              explain: String.raw`$v=B-A=(0-2,\ 1+1,\ 3-0)=(-2,2,3)$. Va bene anche ogni multiplo, ad esempio $(2,-2,-3)=A-B$.` },
            { id: 's15.rette.L1.q4', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: $Q=(3,2,-1)$ appartiene a $r:\ (x,y,z)=(1+2t,\ t,\ 2-3t)$.`,
              answer: false,
              explain: String.raw`Dalla $x$: $1+2t=3\Rightarrow t=1$. Ma allora $y=1\neq2$. Non esiste un unico $t$ che soddisfi tutte le equazioni: $Q\notin r$. Errore tipico: controllare una sola coordinata.` },
            { id: 's15.rette.L1.q5', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: $r:\ (1+2t,\ t,\ 2-3t)$ e $s:\ (3-4u,\ 1-2u,\ -1+6u)$ sono la stessa retta.`,
              answer: true,
              explain: String.raw`Le direzioni $(2,1,-3)$ e $(-4,-2,6)=-2(2,1,-3)$ sono parallele, e il punto $(3,1,-1)$ di $s$ ($u=0$) sta su $r$ per $t=1$. Rette parallele con un punto in comune coincidono.` },
            { type: 'learn', title: 'Equazioni cartesiane',
              body: String.raw`Eliminando il parametro $t$ si ottengono **due equazioni lineari** in $x,y,z$: una retta è l'**intersezione di due piani** non paralleli,
$$r:\ \begin{cases}a_1x+b_1y+c_1z+d_1=0\\ a_2x+b_2y+c_2z+d_2=0.\end{cases}$$
Se $l,m,n\neq0$ si può scrivere anche $\dfrac{x-x_0}{l}=\dfrac{y-y_0}{m}=\dfrac{z-z_0}{n}$ (sono due equazioni).

**Da parametriche a cartesiane:** ricavo $t$ da un'equazione e lo sostituisco nelle altre due.
**Da cartesiane a parametriche:** pongo una variabile uguale a $t$ e risolvo il sistema nelle altre due.` },
            { type: 'example', title: 'Completa tu',
              problem: String.raw`Scrivi in forma cartesiana $r:\ (x,y,z)=(1+2t,\ -1+t,\ 3-t)$.`,
              steps: [
                String.raw`Dalla seconda: $t=y+1$.`,
                { text: String.raw`Sostituisco nella prima: $x=1+2(y+1)$, cioè $x-2y-3=0$.`,
                  ask: { type: 'mcq', prompt: String.raw`Che equazione si ottiene sostituendo $t=y+1$ in $x=1+2t$?`, options: [String.raw`$x-2y-3=0$`, String.raw`$x-2y+1=0$`, String.raw`$x+2y-3=0$`], answer: 0, explain: String.raw`$x=1+2y+2=2y+3$, quindi $x-2y-3=0$.` } },
                String.raw`Sostituisco nella terza: $z=3-(y+1)=2-y$, cioè $y+z-2=0$.`,
              ],
              result: String.raw`$r:\ \begin{cases}x-2y-3=0\\ y+z-2=0\end{cases}$` },
            { id: 's15.rette.L1.q6', type: 'tuple', level: 2, proportional: true,
              prompt: String.raw`Trova un vettore direzione della retta $r:\ \begin{cases}x-y=1\\ z=2\end{cases}$.`,
              answer: ['1', '1', '0'], labels: ['l', 'm', 'n'],
              explain: String.raw`Pongo $y=t$: $x=1+t$, $z=2$. Quindi $r:\ (1+t,\ t,\ 2)$ e la direzione è $(1,1,0)$. Errore tipico: prendere la normale $(1,-1,0)$ del primo piano, che è **ortogonale** alla retta.` },
            { id: 's15.rette.L1.q7', type: 'tuple', level: 2, proportional: true,
              prompt: String.raw`Trova un vettore direzione della retta $\dfrac{x-1}{2}=\dfrac{y+3}{-1}=\dfrac{z}{4}$.`,
              answer: ['2', '-1', '4'], labels: ['l', 'm', 'n'],
              explain: String.raw`Ponendo i tre rapporti uguali a $t$: $x=1+2t$, $y=-3-t$, $z=4t$. La direzione è data dai denominatori: $(2,-1,4)$; un punto è $(1,-3,0)$ (attenzione ai segni: $y+3$ dà $y_0=-3$).` },
          ],
        },
        {
          id: 's15.rette.L2',
          title: 'Intersezione di piani, parallelismo, angoli',
          cards: [
            { type: 'learn', title: 'Direzione di una retta data da due piani',
              body: String.raw`Se $r=\pi_1\cap\pi_2$ con normali $n_1=(a_1,b_1,c_1)$ e $n_2=(a_2,b_2,c_2)$, la retta giace in entrambi i piani, quindi la sua direzione è **ortogonale a entrambe le normali**:
$$v=n_1\wedge n_2.$$
Per un **punto** fisso un valore comodo di una coordinata (ad esempio $z=0$) e risolvo il sistema $2\times2$ che resta.

In alternativa si parametrizza direttamente: pongo $z=t$ e risolvo in $x,y$.` },
            { type: 'example', title: 'Esempio (Itinere 15/01/2026)',
              problem: String.raw`Scrivi in forma parametrica $r=\pi_1\cap\pi_2$ con $\pi_1:\ 4x+y-z-6=0$ e $\pi_2:\ 2x-y-z=0$.`,
              steps: [
                String.raw`Pongo $z=t$: $\ 4x+y=6+t$ e $2x-y=t$.`,
                { text: String.raw`Sommo: $6x=6+2t$, quindi $x=1+\frac t3$.`,
                  ask: { type: 'expr', vars: ['t'], prompt: String.raw`Sommando le due equazioni, quanto vale $x$ in funzione di $t$?`, answer: '1+t/3', explain: String.raw`$6x=6+2t\Rightarrow x=1+\frac t3$.` } },
                { text: String.raw`Dalla seconda: $y=2x-t=2+\frac{2t}3-t=2-\frac t3$.`,
                  ask: { type: 'expr', vars: ['t'], prompt: String.raw`Quanto vale $y$ in funzione di $t$?`, answer: '2-t/3', explain: String.raw`$y=2x-t=2+\frac{2}{3}t-t=2-\frac t3$.` } },
                String.raw`$r:\ (x,y,z)=\left(1+\frac t3,\ 2-\frac t3,\ t\right)$, direzione $\left(\frac13,-\frac13,1\right)\parallel(1,-1,3)$.`,
                String.raw`Controllo: $n_1\wedge n_2=(4,1,-1)\wedge(2,-1,-1)=(-2,2,-6)=-2(1,-1,3)$ ✓.`,
              ],
              result: String.raw`$r:\ \left(1+\frac t3,\ 2-\frac t3,\ t\right)$, direzione $(1,-1,3)$, passa per $(1,2,0)$.` },
            { id: 's15.rette.L2.q1', type: 'tuple', level: 2, proportional: true,
              prompt: String.raw`Trova la direzione di $r:\ \begin{cases}x+y-z=1\\ 2x-y+z=2\end{cases}$.`,
              answer: ['0', '1', '1'], labels: ['l', 'm', 'n'],
              explain: String.raw`$n_1\wedge n_2=(1,1,-1)\wedge(2,-1,1)=(1\cdot1-(-1)(-1),\ (-1)\cdot2-1\cdot1,\ 1\cdot(-1)-1\cdot2)=(0,-3,-3)\parallel(0,1,1)$.` },
            { id: 's15.rette.L2.q2', type: 'tuple', level: 2,
              prompt: String.raw`Trova il punto della stessa retta $r:\ \begin{cases}x+y-z=1\\ 2x-y+z=2\end{cases}$ con $z=0$.`,
              answer: ['1', '0', '0'], labels: ['x', 'y', 'z'],
              explain: String.raw`Con $z=0$: $x+y=1$, $2x-y=2$. Sommando $3x=3$: $x=1$, $y=0$. Punto $(1,0,0)$.` },
            { type: 'learn', title: 'Parallelismo, ortogonalità, angolo',
              body: String.raw`Siano $r$, $s$ rette di direzioni $v_r$, $v_s$.

- $r\parallel s\iff v_r\parallel v_s$ (cioè $v_r\wedge v_s=\mathbf 0$, o componenti proporzionali);
- $r\perp s$ (ortogonali) $\iff\langle v_r,v_s\rangle=0$;
- **angolo tra due rette**: è l'angolo **acuto** (o retto) tra le direzioni,
$$\cos\theta=\frac{|\langle v_r,v_s\rangle|}{|v_r|\,|v_s|},\qquad\theta\in\left[0,\tfrac\pi2\right].$$

>! Nello spazio due rette ortogonali **non** si intersecano necessariamente: "perpendicolari" di solito vuol dire ortogonali e incidenti.` },
            { id: 's15.rette.L2.q3', type: 'mcq', level: 2,
              prompt: String.raw`Le rette $r:\ (1+2t,\ -t,\ 3+t)$ e $s:\ (4u,\ 1-2u,\ 2u)$ sono:`,
              options: ['parallele distinte', 'coincidenti', 'ortogonali', 'incidenti'],
              answer: 0,
              explain: String.raw`Direzioni $(2,-1,1)$ e $(4,-2,2)=2(2,-1,1)$: parallele. Il punto $(0,1,0)$ di $s$ sta su $r$? $1+2t=0\Rightarrow t=-\frac12$, ma allora $y=\frac12\neq1$. Quindi sono parallele **distinte**.` },
            { id: 's15.rette.L2.q4', type: 'num', level: 2,
              prompt: String.raw`Per quale $k$ le rette di direzioni $v_r=(1,k,2)$ e $v_s=(k,-3,1)$ sono ortogonali?`,
              answer: '1',
              explain: String.raw`$\langle v_r,v_s\rangle=k-3k+2=2-2k=0\Rightarrow k=1$.` },
            { id: 's15.rette.L2.q5', type: 'num', level: 2,
              prompt: String.raw`Calcola l'angolo (in radianti) tra le rette di direzioni $v_r=(1,1,0)$ e $v_s=(-1,0,1)$.`,
              answer: 'pi/3',
              explain: String.raw`$\langle v_r,v_s\rangle=-1$, $|v_r|=|v_s|=\sqrt2$. Tra i **vettori** l'angolo è $\frac{2\pi}3$, ma tra le **rette** si prende l'acuto: $\cos\theta=\frac{|-1|}{2}=\frac12$, $\theta=\frac\pi3$.` },
            { id: 's15.rette.L2.q6', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: due rette ortogonali nello spazio hanno sempre un punto in comune.`,
              answer: false,
              explain: String.raw`Falso. Esempio: l'asse $x$, cioè $(t,0,0)$, e la retta $(0,u,1)$: direzioni $(1,0,0)\perp(0,1,0)$, ma la prima ha sempre $z=0$ e la seconda $z=1$. Sono ortogonali e sghembe.` },
            { id: 's15.rette.L2.q7', type: 'tuple', level: 2, proportional: true,
              prompt: String.raw`Trova la direzione di $r:\ \begin{cases}x=2y\\ z=3\end{cases}$.`,
              answer: ['2', '1', '0'], labels: ['l', 'm', 'n'],
              explain: String.raw`Pongo $y=t$: $r:\ (2t,\ t,\ 3)$, direzione $(2,1,0)$. Oppure $(1,-2,0)\wedge(0,0,1)=(-2,-1,0)\parallel(2,1,0)$.` },
            { id: 's15.rette.L2.q8', type: 'tuple', level: 3, proportional: true,
              prompt: String.raw`Trova la direzione della retta per $P=(1,0,-2)$ parallela a $r:\ \begin{cases}x+y=1\\ y-z=0\end{cases}$.`,
              answer: ['-1', '1', '1'], labels: ['l', 'm', 'n'],
              explain: String.raw`Rette parallele hanno la stessa direzione: $(1,1,0)\wedge(0,1,-1)=(1\cdot(-1)-0,\ 0-1\cdot(-1),\ 1\cdot1-0)=(-1,1,1)$. La retta cercata è $(1-t,\ t,\ -2+t)$.` },
          ],
        },
        {
          id: 's15.rette.L3',
          title: 'Incidenti, parallele o sghembe',
          cards: [
            { type: 'learn', title: 'Le quattro posizioni',
              body: String.raw`Due rette nello spazio possono essere:

1. **coincidenti**;
2. **parallele distinte** (stessa direzione, nessun punto comune);
3. **incidenti** (esattamente un punto comune);
4. **sghembe**: né parallele né incidenti.

>* **Definizione.** Due rette sono **sghembe** se **non sono complanari**, cioè non esiste un piano che le contenga entrambe.

Rette parallele o incidenti stanno sempre in un piano; le sghembe no. Nel piano le rette sghembe non esistono.` },
            { type: 'learn', title: 'Come si riconoscono',
              body: String.raw`Siano $r:\ P_1+t\,v_1$ e $s:\ P_2+u\,v_2$.

- Se $v_1\parallel v_2$: **coincidenti** se $P_2\in r$, altrimenti **parallele distinte**.
- Se $v_1\not\parallel v_2$: risolvo il sistema $P_1+t\,v_1=P_2+u\,v_2$ (3 equazioni, 2 incognite). Se ha soluzione sono **incidenti**, altrimenti **sghembe**.

Scorciatoia con il prodotto misto: $r,s$ sono complanari $\iff\langle P_2-P_1,\ v_1\wedge v_2\rangle=0$. Quindi, se $v_1\not\parallel v_2$:
$$\langle P_2-P_1,\ v_1\wedge v_2\rangle\neq0\iff\text{sghembe}.$$

>! Per il sistema usa **parametri diversi** ($t$ e $u$): con lo stesso parametro imponi che i punti si trovino nello stesso "istante", che è una condizione in più (e sbagliata).` },
            { type: 'example', title: 'Esempio svolto (Appello 11/06/2026)',
              problem: String.raw`Per quale $\gamma$ le rette $r:\ (1+3t,\ 3-t,\ 1-2t)$ e $s:\ (3-u,\ \gamma+u,\ 1+u)$ sono incidenti? In quale punto?`,
              steps: [
                String.raw`Uguaglio le coordinate: $1+3t=3-u$, $\ 3-t=\gamma+u$, $\ 1-2t=1+u$.`,
                { text: String.raw`Dalla terza $u=-2t$; nella prima $1+3t=3+2t$, quindi $t=2$, $u=-4$.`,
                  ask: { type: 'tuple', labels: ['t', 'u'], prompt: String.raw`Risolvi la prima e la terza equazione: quanto valgono $t$ e $u$?`, answer: ['2', '-4'], explain: String.raw`$u=-2t$ e $1+3t=3+2t\Rightarrow t=2$, $u=-4$.` } },
                { text: String.raw`Seconda equazione: $3-2=\gamma-4\Rightarrow\gamma=5$.`,
                  ask: { type: 'num', prompt: String.raw`Quanto vale $\gamma$?`, answer: '5', explain: String.raw`$1=\gamma-4\Rightarrow\gamma=5$.` } },
                String.raw`Punto: $t=2$ in $r$ dà $P=(7,1,-3)$; controllo con $u=-4$ in $s$: $(7,\ 5-4,\ -3)$ ✓.`,
              ],
              result: String.raw`$\gamma=5$, $P=(7,1,-3)$. Per $\gamma\neq5$ le rette sono sghembe (le direzioni $(3,-1,-2)$ e $(-1,1,1)$ non sono parallele).` },
            { id: 's15.rette.L3.q1', type: 'tuple', level: 2,
              prompt: String.raw`Trova il punto d'intersezione di $r:\ (1+t,\ 2-t,\ 3+2t)$ e $s:\ (2+u,\ 1,\ 5+u)$.`,
              answer: ['2', '1', '5'], labels: ['x', 'y', 'z'],
              explain: String.raw`Dalla $y$: $2-t=1\Rightarrow t=1$. Dalla $x$: $2=2+u\Rightarrow u=0$. Controllo la $z$: $3+2=5=5+0$ ✓. Punto $(2,1,5)$.` },
            { id: 's15.rette.L3.q2', type: 'mcq', level: 2,
              prompt: String.raw`Le rette $r:\ (1+t,\ 2t,\ -1)$ e $s:\ (2,\ 1+u,\ u)$ sono:`,
              options: ['sghembe', 'incidenti', 'parallele distinte', 'coincidenti'],
              answer: 0,
              explain: String.raw`Direzioni $(1,2,0)$ e $(0,1,1)$: non parallele. Sistema: $1+t=2\Rightarrow t=1$; $2t=1+u\Rightarrow u=1$; $-1=u=1$: assurdo. Nessun punto comune e non parallele: sghembe. (Prodotto misto: $\langle(1,1,1),(2,-1,1)\rangle=2\neq0$.)` },
            { id: 's15.rette.L3.q3', type: 'num', level: 2,
              prompt: String.raw`Per quale $\gamma$ le rette $r:\ (t,\ 1+t,\ 2t)$ e $s:\ (1+u,\ \gamma-u,\ 3+u)$ sono incidenti?`,
              answer: '4',
              explain: String.raw`Dalla $x$ e dalla $z$: $t=1+u$, $2t=3+u$, quindi $2+2u=3+u$: $u=1$, $t=2$. Dalla $y$: $1+2=\gamma-1\Rightarrow\gamma=4$. Il punto comune è $(2,3,4)$.` },
            { id: 's15.rette.L3.q4', type: 'open', level: 3, points: 1,
              source: 'Appello 06/07/2026 · Parte A',
              prompt: 'Si dia la definizione di rette sghembe.',
              answer: String.raw`Due rette dello spazio si dicono **sghembe** se non sono complanari, cioè se non esiste alcun piano che le contenga entrambe. Equivalentemente: non sono parallele e non hanno punti in comune. In coordinate, con $r:P_1+tv_1$, $s:P_2+uv_2$: sono sghembe se e solo se $\langle P_2-P_1,v_1\wedge v_2\rangle\neq0$.`,
              rubric: ['Non complanari (nessun piano le contiene entrambe)', 'Equivalentemente: né parallele né incidenti', 'Eventuale criterio con il prodotto misto'] },
            { id: 's15.rette.L3.q5', type: 'tf', level: 1,
              prompt: String.raw`Vero o falso: due rette dello spazio che non hanno punti in comune sono parallele.`,
              answer: false,
              explain: String.raw`Falso: possono essere **sghembe**. "Nessun punto comune $\Rightarrow$ parallele" vale solo nel piano.` },
            { id: 's15.rette.L3.q6', type: 'cloze', level: 2,
              prompt: 'Completa.',
              text: String.raw`Se $v_1\wedge v_2\neq\mathbf 0$ e $\langle P_2-P_1,v_1\wedge v_2\rangle=0$ le rette sono [[0]]; se invece $\langle P_2-P_1,v_1\wedge v_2\rangle\neq0$ sono [[1]]. Se $v_1\wedge v_2=\mathbf 0$ sono [[2]].`,
              blanks: [
                { options: ['incidenti', 'sghembe', 'parallele'], answer: 0 },
                { options: ['sghembe', 'incidenti', 'coincidenti'], answer: 0 },
                { options: ['parallele o coincidenti', 'sghembe', 'incidenti'], answer: 0 },
              ],
              explain: String.raw`Prodotto misto nullo = complanari. Complanari e non parallele = incidenti; non complanari = sghembe; $v_1\wedge v_2=\mathbf 0$ = stessa direzione.` },
            { id: 's15.rette.L3.q7', type: 'mcq', level: 2,
              prompt: String.raw`Risolvendo il sistema per l'intersezione di $r:\ (1+t,\ t,\ 0)$ e $s:\ (u,\ 1-u,\ 0)$ uno studente pone $u=t$ e conclude "nessuna soluzione, sghembe". Cosa c'è di sbagliato?`,
              options: [
                'Doveva usare due parametri distinti: le rette sono incidenti',
                'Niente: le rette sono sghembe',
                'Le rette sono parallele',
                'Doveva usare il prodotto scalare delle direzioni',
              ],
              answer: 0,
              explain: String.raw`Con parametri distinti: $1+t=u$, $t=1-u$, $0=0$. Sommando le prime due: $1+2t=1\Rightarrow t=0$, $u=1$: punto $(1,0,0)$. Sono incidenti (e stanno entrambe nel piano $z=0$, quindi non potevano essere sghembe).` },
          ],
        },
        {
          id: 's15.rette.L4',
          title: "Livello d'esame",
          cards: [
            { id: 's15.rette.L4.q1', type: 'problem', level: 3, points: 4,
              source: 'Appello 11/06/2026 · Parte B',
              prompt: String.raw`Date le rette $r:\ (x,y,z)=(1+3t,\ 3-t,\ 1-2t)$ e $s:\ (x,y,z)=(3-u,\ \gamma+u,\ 1+u)$, determinare $\gamma$ in modo che siano incidenti, il loro punto d'intersezione e il piano che le contiene.`,
              parts: [
                { type: 'num', prompt: String.raw`Valore di $\gamma$`, answer: '5', explain: String.raw`Prima e terza equazione danno $t=2$, $u=-4$; la seconda $1=\gamma-4$.` },
                { type: 'tuple', labels: ['x', 'y', 'z'], prompt: "Punto d'intersezione", answer: ['7', '1', '-3'], explain: String.raw`$t=2$ in $r$.` },
                { type: 'tuple', labels: ['a', 'b', 'c', 'd'], proportional: true, prompt: String.raw`Piano $ax+by+cz+d=0$ che contiene $r$ e $s$`, answer: ['1', '-1', '2', '0'], explain: String.raw`Normale $(3,-1,-2)\wedge(-1,1,1)=(1,-1,2)$, per $P=(7,1,-3)$: $x-y+2z=0$.` },
              ],
              solution: String.raw`Uguaglio le coordinate: $1+3t=3-u$, $3-t=\gamma+u$, $1-2t=1+u$. Dalla terza $u=-2t$; nella prima $1+3t=3+2t\Rightarrow t=2$, $u=-4$. La seconda dà $1=\gamma-4$, quindi $\gamma=5$.

Punto comune: $P=r(2)=(7,1,-3)$ (e $s(-4)=(7,1,-3)$ ✓).

Il piano contiene entrambe le direzioni $v_r=(3,-1,-2)$ e $v_s=(-1,1,1)$, quindi ha normale
$$n=v_r\wedge v_s=((-1)(1)-(-2)(1),\ (-2)(-1)-3\cdot1,\ 3\cdot1-(-1)(-1))=(1,-1,2).$$
Passa per $P$: $(x-7)-(y-1)+2(z+3)=0$, cioè $x-y+2z=0$ (passa per l'origine).` },
            { id: 's15.rette.L4.q2', type: 'problem', level: 3, points: 3,
              source: 'Appello 06/07/2026 · Parte B',
              prompt: String.raw`Date le rette $r_1:\ (x,y,z)=(2+t,\ 1-t,\ 3+2t)$ e $r_2:\ (x,y,z)=(1+2s,\ -1+s,\ 4-s)$, determinare la retta $s$ passante per $P=(1,2,-1)$ e perpendicolare a entrambe. Stabilire la posizione reciproca di $r_1$ e $s$.`,
              parts: [
                { type: 'tuple', labels: ['l', 'm', 'n'], proportional: true, prompt: String.raw`Direzione di $s$`, answer: ['-1', '5', '3'], explain: String.raw`$v_1\wedge v_2=(1,-1,2)\wedge(2,1,-1)=(-1,5,3)$.` },
                { type: 'mcq', prompt: String.raw`Posizione reciproca di $r_1$ e $s$`, options: ['sghembe', 'incidenti', 'parallele distinte', 'coincidenti'], answer: 0,
                  explain: String.raw`Direzioni non parallele e prodotto misto $\langle P-P_1,\ v_1\wedge v_s\rangle=\langle(-1,1,-4),(-13,-5,4)\rangle=-8\neq0$.` },
              ],
              solution: String.raw`Le direzioni sono $v_1=(1,-1,2)$ e $v_2=(2,1,-1)$. Una retta perpendicolare a entrambe ha direzione ortogonale a $v_1$ e $v_2$:
$$v_s=v_1\wedge v_2=((-1)(-1)-2\cdot1,\ 2\cdot2-1\cdot(-1),\ 1\cdot1-(-1)\cdot2)=(-1,5,3).$$
Quindi $s:\ (x,y,z)=(1-t,\ 2+5t,\ -1+3t)$.

Posizione di $r_1$ e $s$: le direzioni $(1,-1,2)$ e $(-1,5,3)$ non sono proporzionali. Cerco punti comuni: $2+t=1-k$, $1-t=2+5k$, $3+2t=-1+3k$. Sommando le prime due: $3=3+4k\Rightarrow k=0$, $t=-1$; la terza dà $1=-1$: assurdo. Le rette sono **sghembe**. (Controllo: $v_1\wedge v_s=(-13,-5,4)$, $P-P_1=(-1,1,-4)$, prodotto misto $13-5-16=-8\neq0$.) La loro distanza, $\frac{8}{\sqrt{210}}$, si calcola nella skill sulle distanze.` },
            { id: 's15.rette.L4.q3', type: 'problem', level: 3, points: 2,
              source: 'Itinere 15/01/2026 · Parte B',
              prompt: String.raw`Scrivere in forma parametrica la retta $r=\pi_1\cap\pi_2$, con $\pi_1:\ 4x+y-z-6=0$ e $\pi_2:\ 2x-y-z=0$.`,
              parts: [
                { type: 'tuple', labels: ['l', 'm', 'n'], proportional: true, prompt: String.raw`Direzione di $r$`, answer: ['1', '-1', '3'], explain: String.raw`$n_1\wedge n_2=(-2,2,-6)\parallel(1,-1,3)$.` },
                { type: 'tuple', labels: ['x', 'y', 'z'], prompt: String.raw`Punto di $r$ con $z=0$`, answer: ['1', '2', '0'], explain: String.raw`$4x+y=6$, $2x-y=0$: $x=1$, $y=2$.` },
              ],
              solution: String.raw`Pongo $z=t$: $4x+y=6+t$, $2x-y=t$. Sommando $6x=6+2t$, quindi $x=1+\frac t3$ e $y=2x-t=2-\frac t3$:
$$r:\ (x,y,z)=\left(1+\tfrac t3,\ 2-\tfrac t3,\ t\right),$$
con direzione $\left(\frac13,-\frac13,1\right)\parallel(1,-1,3)$ e punto $(1,2,0)$ per $t=0$. Controllo: $n_1\wedge n_2=(4,1,-1)\wedge(2,-1,-1)=(-2,2,-6)$ ✓.` },
            { id: 's15.rette.L4.q4', type: 'order', level: 3,
              prompt: String.raw`Riordina il procedimento per stabilire la posizione reciproca di $r:\ P_1+tv_1$ e $s:\ P_2+uv_2$.`,
              steps: [
                String.raw`Leggo i punti $P_1,P_2$ e le direzioni $v_1,v_2$.`,
                String.raw`Controllo se $v_1$ e $v_2$ sono proporzionali.`,
                String.raw`Se lo sono, verifico se $P_2\in r$: coincidenti se sì, parallele distinte se no.`,
                String.raw`Se non lo sono, risolvo $P_1+tv_1=P_2+uv_2$ con due parametri distinti.`,
                String.raw`Sistema compatibile: incidenti (trovo il punto); incompatibile: sghembe.`,
              ],
              distractors: [String.raw`Se $\langle v_1,v_2\rangle=0$ le rette sono incidenti.`],
              explain: String.raw`L'ortogonalità delle direzioni non dice nulla sull'esistenza di un punto comune: due rette ortogonali possono essere sghembe.` },
            { id: 's15.rette.L4.q5', type: 'tuple', level: 3, proportional: true,
              prompt: String.raw`Trova la direzione della retta per $P=(0,1,1)$ ortogonale sia a $r:\ (x,y,z)=(1+t,\ 2,\ -t)$ sia a $s:\ \begin{cases}x+y=0\\ z=1\end{cases}$.`,
              answer: ['1', '1', '1'], labels: ['l', 'm', 'n'],
              explain: String.raw`$v_r=(1,0,-1)$. Per $s$ pongo $x=u$: allora $y=-u$, $z=1$, quindi $v_s=(1,-1,0)$. La direzione cercata è $v_r\wedge v_s=(0\cdot0-(-1)(-1),\ (-1)\cdot1-1\cdot0,\ 1\cdot(-1)-0\cdot1)=(-1,-1,-1)\parallel(1,1,1)$.` },
            { type: 'learn', title: "Come riconoscere la domanda d'esame",
              body: String.raw`Nelle domande di rette i passi sono quasi sempre tre:

1. trovo un **punto** e una **direzione** di ogni retta (dalle equazioni parametriche, o con $v=n_1\wedge n_2$ se la retta è data da due piani);
2. verifico la **posizione reciproca** con le direzioni e, se serve, con il **prodotto misto** $\langle P_2-P_1,\ v_1\wedge v_2\rangle$;
3. rispondo nella forma richiesta: parametrica o cartesiana, punto d'intersezione, piano che le contiene.

Il prodotto misto è il controllo più veloce: se è zero le rette sono complanari, altrimenti sono sghembe.` },
            { type: 'example', title: 'Esempio svolto: sghembe?',
              problem: String.raw`Stabilisci la posizione reciproca di $r:\ (1+t,\ t,\ 2)$ e $s:\ (0,\ 1+u,\ 1+2u)$.`,
              steps: [
                String.raw`Direzioni $v_1=(1,1,0)$ e $v_2=(0,1,2)$: non proporzionali, quindi le rette non sono parallele.`,
                String.raw`Prodotto vettoriale: $v_1\wedge v_2=(1\cdot2-0\cdot1,\ 0\cdot0-1\cdot2,\ 1\cdot1-1\cdot0)=(2,-2,1)$.`,
                { text: String.raw`Punti $P_1=(1,0,2)$ e $P_2=(0,1,1)$: $P_2-P_1=(-1,1,-1)$. Prodotto misto: $\langle(-1,1,-1),(2,-2,1)\rangle=-2-2-1=-5$.`,
                  ask: { type: 'num', prompt: String.raw`Quanto vale il prodotto misto $\langle(-1,1,-1),\ (2,-2,1)\rangle$?`, answer: '-5', explain: String.raw`$(-1)\cdot2+1\cdot(-2)+(-1)\cdot1=-5$.` } },
                String.raw`Il prodotto misto è diverso da zero: le rette non sono complanari.`,
              ],
              result: String.raw`$r$ e $s$ sono **sghembe**.` },
            { id: 's15.rette.L4.q6', type: 'tf', level: 3,
              prompt: String.raw`Vero o falso: se $v_1\not\parallel v_2$ e $\langle P_2-P_1,\ v_1\wedge v_2\rangle=0$, allora le rette $r$ e $s$ sono incidenti.`,
              answer: true,
              explain: String.raw`Vero. Il prodotto misto nullo significa che le rette sono complanari; non essendo parallele, si intersecano in un punto unico. Attenzione: senza la condizione $v_1\not\parallel v_2$ l'affermazione non vale, perché due rette parallele distinte sono complanari ma non si intersecano.` },
            { id: 's15.rette.L4.q7', type: 'num', level: 3,
              prompt: String.raw`Per quale valore di $a$ le rette $r:\ (1+t,\ t,\ 2)$ e $s:\ (0,\ 1+u,\ a+2u)$ sono complanari?`,
              answer: '6',
              explain: String.raw`Con $v_1=(1,1,0)$, $v_2=(0,1,2)$ si ha $v_1\wedge v_2=(2,-2,1)$ e $P_2-P_1=(-1,1,a-2)$. Il prodotto misto è $-2-2+(a-2)=a-6$: è nullo per $a=6$.` },
          ],
        },
      ],
      practice: [
        { id: 's15.rette.p1', type: 'tuple', level: 1, proportional: true,
          prompt: String.raw`Trova una direzione della retta per $A=(1,2,0)$ e $B=(3,-1,4)$.`,
          answer: ['2', '-3', '4'], labels: ['l', 'm', 'n'],
          explain: String.raw`$v=B-A=(3-1,\ -1-2,\ 4-0)=(2,-3,4)$.` },
        { id: 's15.rette.p2', type: 'mcq', level: 1,
          prompt: String.raw`Il punto $(3,-1,4)$ appartiene a $r:\ (x,y,z)=(1+2t,\ -t,\ 3+t)$?`,
          options: [String.raw`Sì, per $t=1$`, String.raw`No: la $y$ non torna`, String.raw`No: la $z$ non torna`],
          answer: 0,
          explain: String.raw`Dalla $x$: $1+2t=3$, quindi $t=1$. Con $t=1$ si ha $y=-1$ e $z=4$: tutte e tre le coordinate tornano, quindi il punto è su $r$. Le altre due risposte nascondono un errore di calcolo.` },
        { id: 's15.rette.p3', type: 'num', level: 1,
          prompt: String.raw`Il punto $Q=(5,0,8)$ sta sulla retta $r:\ (x,y,z)=(1+2t,\ 2-t,\ 4t)$. Quale valore di $t$ gli corrisponde?`,
          answer: '2',
          explain: String.raw`Dalla $x$: $1+2t=5\Rightarrow t=2$. Verifico: $y=2-2=0$ ✓, $z=4\cdot2=8$ ✓.` },
        { id: 's15.rette.p4', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $r:\ (t,\ 2t,\ 1)$ e $s:\ (3+2u,\ 4+4u,\ 1)$ sono rette parallele distinte.`,
          answer: true,
          explain: String.raw`Le direzioni $(1,2,0)$ e $(2,4,0)=2(1,2,0)$ sono proporzionali. Il punto $(3,4,1)$ di $s$ non sta su $r$: per $x=3$ si ha $t=3$ e $y=6\neq4$. Quindi sono parallele e distinte.` },
        { id: 's15.rette.p5', type: 'mcq', level: 2,
          prompt: String.raw`Quale sistema cartesiano descrive la retta $(x,y,z)=(2t,\ 1+t,\ -t)$?`,
          options: [
            String.raw`$\begin{cases}x-2y+2=0\\ y+z-1=0\end{cases}$`,
            String.raw`$\begin{cases}x+2y-2=0\\ y+z-1=0\end{cases}$`,
            String.raw`$\begin{cases}x-2y+2=0\\ y-z-1=0\end{cases}$`,
          ],
          answer: 0,
          explain: String.raw`Dalla $y=1+t$ ricavo $t=y-1$. Sostituendo: $x=2(y-1)$, cioè $x-2y+2=0$; e $z=-(y-1)$, cioè $y+z-1=0$. Errore tipico: sbagliare il segno quando si isola $t$.` },
        { id: 's15.rette.p6', type: 'num', level: 2,
          prompt: String.raw`Calcola il coseno dell'angolo acuto tra le rette di direzioni $(1,2,2)$ e $(2,-1,2)$.`,
          answer: '4/9',
          explain: String.raw`$\langle(1,2,2),(2,-1,2)\rangle=2-2+4=4$, $|(1,2,2)|=|(2,-1,2)|=3$. Quindi $\cos\theta=\dfrac{|4|}{3\cdot3}=\dfrac49$.` },
        { id: 's15.rette.p7', type: 'open', level: 2, points: 1,
          prompt: String.raw`Spiega come si scrive la retta per due punti distinti $A$ e $B$ in forma parametrica, e come si verifica che un punto $Q$ vi appartenga.`,
          answer: String.raw`Direzione $v=B-A$ e punto $A$: $r:\ A+t(B-A)$. Per $t=0$ si ottiene $A$, per $t=1$ si ottiene $B$. Per verificare che $Q\in r$ si cerca un unico $t$ che soddisfi tutte e tre le equazioni, e si controlla che valga anche per le altre coordinate.`,
          rubric: ['Direzione $B-A$ e punto $A$ (o $B$)', 'Forma parametrica corretta', 'Verifica con un unico $t$ su tutte e tre le coordinate'] },
        { id: 's15.rette.p8', type: 'cloze', level: 2,
          prompt: 'Completa.',
          text: String.raw`Le equazioni cartesiane di una retta sono due equazioni lineari indipendenti: una retta è l'[[0]] di [[1]] piani non paralleli. Una direzione della retta è il [[2]] delle due normali.`,
          blanks: [
            { options: ['intersezione', 'unione', 'somma'], answer: 0 },
            { options: ['due', 'tre', 'uno'], answer: 0 },
            { options: ['prodotto scalare', 'prodotto vettoriale', 'somma'], answer: 1 },
          ],
          explain: String.raw`La retta è l'intersezione di due piani non paralleli. Una direzione è ortogonale a entrambe le normali, quindi è il loro prodotto vettoriale $n_1\wedge n_2$.` },
        { id: 's15.rette.p9', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: se due rette hanno le stesse direzioni proporzionali, sono sempre coincidenti.`,
          answer: false,
          explain: String.raw`Falso: possono essere parallele **distinte**. Coincidono solo se il punto di una sta sull'altra.` },
        { id: 's15.rette.p10', type: 'expr', level: 2, vars: ['t'],
          prompt: String.raw`Qual è la seconda coordinata $y(t)$ del punto di parametro $t$ sulla retta $r:\ (x,y,z)=(1-2t,\ 3+t,\ 2t)$?`,
          answer: '3+t',
          explain: String.raw`La seconda coordinata è $y=3+t$: il termine noto $3$ dà il punto per $t=0$, il coefficiente $1$ di $t$ dà la direzione.` },
        { id: 's15.rette.g1', type: 'gen', level: 1,
          gen: (R) => {
            const A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
            let v;
            do { v = [R.int(-4, 4), R.int(-4, 4), R.nz(-4, 4)]; } while (v.every((x) => x === 0));
            const B = A.map((x, i) => x + v[i]);
            return {
              type: 'tuple', labels: ['l', 'm', 'n'], proportional: true,
              prompt: String.raw`Trova una direzione della retta per $A=(${A.join(', ')})$ e $B=(${B.join(', ')})$.`,
              answer: v.map(String),
              explain: String.raw`La direzione è $B-A=(${v.join(', ')})$. Ogni multiplo non nullo, ad esempio $-(B-A)$, va altrettanto bene.`,
            };
          } },
        { id: 's15.rette.g2', type: 'gen', level: 2,
          gen: (R) => {
            const P = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
            const v = [R.nz(-3, 3), R.int(-2, 2), R.nz(-3, 3)];
            const t0 = R.nz(-3, 3);
            const Q = P.map((x, i) => x + t0 * v[i]);
            return {
              type: 'num',
              prompt: String.raw`Il punto $Q=(${Q.join(', ')})$ sta sulla retta $r:\ (x,y,z)=(${comp(P[0], v[0])},\ ${comp(P[1], v[1])},\ ${comp(P[2], v[2])})$. Quale valore di $t$ corrisponde a $Q$?`,
              answer: String(t0),
              explain: String.raw`Ogni coordinata di $Q$ deve tornare con lo stesso $t$. Dalla prima coordinata, con $v_1=${v[0]}$, si ricava $t=${t0}$; le altre due coordinate danno lo stesso valore.`,
            };
          } },
        { id: 's15.rette.g3', type: 'gen', level: 2,
          gen: (R) => {
            let c, m, n, k;
            do { c = R.nz(-3, 3); m = R.int(-3, 3); n = R.int(-3, 3); k = m + c * n; } while (k === 0);
            return {
              type: 'num',
              prompt: String.raw`Per quale $k$ le rette di direzioni $(1,\ k,\ ${c})$ e $(${m},\ -1,\ ${n})$ sono ortogonali?`,
              answer: String(k),
              explain: String.raw`Ortogonali significa prodotto scalare nullo: $${m}-k+(${c * n})=0$, quindi $k=${k}$.`,
            };
          } },
        { id: 's15.rette.g4', type: 'gen', level: 2,
          gen: (R) => {
            let v1, v2, c;
            do {
              v1 = [R.nz(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              v2 = [R.int(-2, 2), R.nz(-2, 2), R.int(-2, 2)];
              c = H.cross(v1, v2);
            } while (c.every((x) => x === 0));
            const P1 = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
            const P2 = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
            const d = P2.map((x, i) => x - P1[i]);
            const mixed = H.dot(d, c) + 0;
            return {
              type: 'num',
              prompt: String.raw`Siano $r:\ P_1+t\,v_1$ e $s:\ P_2+u\,v_2$ con $P_1=(${P1.join(', ')})$, $v_1=(${v1.join(', ')})$, $P_2=(${P2.join(', ')})$, $v_2=(${v2.join(', ')})$. Calcola il prodotto misto $\langle P_2-P_1,\ v_1\wedge v_2\rangle$.`,
              answer: String(mixed),
              explain: String.raw`$P_2-P_1=(${d.join(', ')})$ e $v_1\wedge v_2=(${c.join(', ')})$. Il prodotto misto vale $${mixed}$. ${mixed === 0 ? 'È zero: le rette sono complanari.' : 'È diverso da zero: le rette sono sghembe.'}`,
            };
          } },
        { id: 's15.rette.g5', type: 'gen', level: 3,
          gen: (R) => {
            let n1, n2, c;
            do {
              n1 = [R.int(-2, 2), R.int(-2, 2), R.nz(-2, 2)];
              n2 = [R.nz(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              c = H.cross(n1, n2);
            } while (c.every((x) => x === 0));
            return {
              type: 'tuple', labels: ['l', 'm', 'n'], proportional: true,
              prompt: String.raw`Trova una direzione della retta $r$ intersezione dei piani $\pi_1:\ ${H.planeTex(n1[0], n1[1], n1[2], 0)}$ e $\pi_2:\ ${H.planeTex(n2[0], n2[1], n2[2], 0)}$.`,
              answer: c.map(String),
              explain: String.raw`La direzione è ortogonale a entrambe le normali $(${n1.join(', ')})$ e $(${n2.join(', ')})$: quindi è il loro prodotto vettoriale $(${c.join(', ')})$.`,
            };
          } },
      ],
      flashcards: [
        { id: 's15.rette.fc1', kind: 'def', front: String.raw`Forma parametrica di una retta`,
          back: String.raw`$r:\ P_0+t\,v$, con $P_0$ punto della retta, $v\neq\mathbf 0$ direzione e $t\in\R$.` },
        { id: 's15.rette.fc2', kind: 'def', front: String.raw`Vettore direzione di una retta`,
          back: String.raw`Un vettore non nullo parallelo alla retta. Si legge dai coefficienti di $t$ nelle equazioni parametriche. Ogni suo multiplo non nullo è ancora una direzione.` },
        { id: 's15.rette.fc3', kind: 'formula', front: String.raw`Direzione di una retta data da due piani $\pi_1,\pi_2$`,
          back: String.raw`$v=n_1\wedge n_2$, dove $n_1,n_2$ sono le normali dei due piani (devono essere non proporzionali).` },
        { id: 's15.rette.fc4', kind: 'def', front: String.raw`Rette parallele`,
          back: String.raw`Due rette sono parallele se hanno direzioni proporzionali, cioè $v_1\wedge v_2=\mathbf 0$. Sono coincidenti se hanno anche un punto in comune, altrimenti parallele distinte.` },
        { id: 's15.rette.fc5', kind: 'def', front: String.raw`Rette sghembe`,
          back: String.raw`Due rette sono **sghembe** se non sono complanari, cioè non esiste un piano che le contenga entrambe. Nello spazio sono né parallele né incidenti.` },
        { id: 's15.rette.fc6', kind: 'formula', front: String.raw`Criterio del prodotto misto per due rette`,
          back: String.raw`Per $r:P_1+tv_1$ e $s:P_2+uv_2$ con $v_1\not\parallel v_2$: $\langle P_2-P_1,\ v_1\wedge v_2\rangle=0\iff$ complanari (incidenti); $\neq0\iff$ sghembe.` },
        { id: 's15.rette.fc7', kind: 'formula', front: String.raw`Angolo tra due rette`,
          back: String.raw`$\cos\theta=\dfrac{|\langle v_r,v_s\rangle|}{|v_r|\,|v_s|}$ con $\theta\in[0,\tfrac\pi2]$: si prende l'angolo acuto tra le direzioni.` },
        { id: 's15.rette.fc8', kind: 'metodo', front: String.raw`Metodo per le posizioni reciproche di due rette`,
          back: String.raw`1) Se le direzioni sono proporzionali: coincidenti o parallele distinte (un punto di una sta sull'altra?). 2) Altrimenti risolvo $P_1+tv_1=P_2+uv_2$ con parametri **diversi**: soluzione unica $\Rightarrow$ incidenti; nessuna $\Rightarrow$ sghembe.` },
        { id: 's15.rette.fc9', kind: 'errore', front: String.raw`Errori tipici sulle rette`,
          back: String.raw`Usare la normale $(a,b,c)$ di un piano come direzione (è ortogonale alla retta). Confondere "ortogonali" con "incidenti": due rette ortogonali possono essere sghembe. Controllare una sola coordinata quando si verifica un punto. Usare lo stesso parametro $t$ per due rette.` },
      ],
    },
    // -----------------------------------------------------------------------
    // s15.piani
    // -----------------------------------------------------------------------
    {
      id: 's15.piani',
      title: 'Piani nello spazio',
      summary: String.raw`Saprai scrivere l'equazione di un piano dalla normale, da tre punti o da una retta e un punto, usare il fascio di piani e stabilire la posizione reciproca di piani e rette.`,
      prereq: ['s15.vettoriale', 's15.rette'],
      examRefs: ['Itinere 15/01/2026 · Parte B', 'Appello 15/01/2026 · Parte B', 'Appello 10/02/2026 · Parte B'],
      lessons: [
        {
          id: 's15.piani.L1',
          title: "Equazione del piano",
          cards: [
            { type: 'learn', title: 'Il piano e la sua normale',
              body: String.raw`Un **piano** nello spazio è individuato da un suo punto $P_0$ e da un vettore **normale** $n=(a,b,c)\neq\mathbf 0$, cioè un vettore ortogonale a tutto il piano. Un punto $X$ sta sul piano se e solo se il vettore $X-P_0$ è ortogonale a $n$:
$$\langle n,\ X-P_0\rangle=0\quad\iff\quad a(x-x_0)+b(y-y_0)+c(z-z_0)=0.$$
Sviluppando si ottiene l'**equazione cartesiana** $ax+by+cz+d=0$, con $d=-(ax_0+by_0+cz_0)$. I coefficienti $(a,b,c)$ sono la normale.

>* Il piano $ax+by+cz+d=0$ ha normale $(a,b,c)$. Il termine $d$ non influisce sulla direzione del piano, solo su dove si trova.` },
            { id: 's15.piani.L1.q1', type: 'mcq', level: 1,
              prompt: String.raw`Qual è una normale del piano $2x-3y+z=5$?`,
              options: [String.raw`$(2,-3,1)$`, String.raw`$(2,-3,-5)$`, String.raw`$(2,3,1)$`, String.raw`$(2,-3,0)$`],
              answer: 0,
              explain: String.raw`I coefficienti di $x,y,z$ danno la normale: $(2,-3,1)$. Il termine noto $-5$ non fa parte della normale (è $d$, con il segno opposto a quello del secondo membro). $(2,3,1)$ cambia il segno di $y$; $(2,-3,0)$ dimentica la $z$.` },
            { id: 's15.piani.L1.q2', type: 'num', level: 1,
              prompt: String.raw`Il piano $2x+y-3z+d=0$ passa per $P=(1,0,-1)$. Quanto vale $d$?`,
              answer: '-5',
              explain: String.raw`Sostituisco $P$: $2\cdot1+0-3\cdot(-1)+d=0$, cioè $5+d=0$, quindi $d=-5$.` },
            { id: 's15.piani.L1.q3', type: 'tf', level: 1,
              prompt: String.raw`Vero o falso: il punto $(1,1,1)$ appartiene al piano $x+2y-z=2$.`,
              answer: true,
              explain: String.raw`Sostituisco: $1+2\cdot1-1=2$. L'uguaglianza è verificata, quindi il punto sta sul piano.` },
            { type: 'example', title: 'Esempio svolto',
              problem: String.raw`Scrivi l'equazione del piano per $P=(1,2,0)$ con normale $n=(2,-1,3)$.`,
              steps: [
                String.raw`Uso la forma $n\cdot(X-P)=0$: $\;2(x-1)-1\cdot(y-2)+3(z-0)=0$.`,
                { text: String.raw`Sviluppo le parentesi: $2x-2-y+2+3z=0$.`,
                  ask: { type: 'num', prompt: String.raw`Sommo i termini costanti $-2+2$: quale costante resta?`, answer: '0', explain: String.raw`$-2+2=0$: il piano passa per l'origine.` } },
                String.raw`Riordino: $2x-y+3z=0$.`,
              ],
              result: String.raw`$\pi:\ 2x-y+3z=0$` },
            { type: 'learn', title: 'Piano per tre punti',
              body: String.raw`Tre punti $A,B,C$ **non allineati** determinano un piano. Il piano contiene i vettori $B-A$ e $C-A$, quindi la normale è il loro prodotto vettoriale:
$$n=(B-A)\wedge(C-A).$$
Poi si usa un qualunque punto (ad esempio $A$) per trovare $d$. Se $A,B,C$ sono allineati, il prodotto vettoriale è $\mathbf 0$ e **non** definisce nessun piano.` },
            { id: 's15.piani.L1.q4', type: 'tuple', level: 2, proportional: true,
              prompt: String.raw`Trova una normale del piano per $A=(1,0,0)$, $B=(0,2,0)$, $C=(0,0,3)$.`,
              answer: ['6', '3', '2'], labels: ['a', 'b', 'c'],
              explain: String.raw`$B-A=(-1,2,0)$, $C-A=(-1,0,3)$. Il prodotto vettoriale è $(2\cdot3-0\cdot0,\ 0\cdot(-1)-(-1)\cdot3,\ (-1)\cdot0-2\cdot(-1))=(6,3,2)$. Errore tipico: sottrarre le componenti nell'ordine sbagliato, che cambia solo il verso della normale.` },
            { id: 's15.piani.L1.q5', type: 'num', level: 2,
              prompt: String.raw`Il piano per $A,B,C$ dell'esercizio precedente ha equazione $6x+3y+2z+d=0$. Quanto vale $d$?`,
              answer: '-6',
              explain: String.raw`Il punto $A=(1,0,0)$ sta sul piano: $6\cdot1+d=0$, quindi $d=-6$. Verifica con $C$: $6\cdot0+0+2\cdot3-6=0$ ✓.` },
            { id: 's15.piani.L1.q6', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: se $A,B,C$ sono allineati, esiste un unico piano che li contiene.`,
              answer: false,
              explain: String.raw`Falso. Per tre punti allineati passano infiniti piani (tutti quelli che contengono quella retta). Il prodotto vettoriale $(B-A)\wedge(C-A)$ è nullo e non dà una normale unica.` },
            { type: 'learn', title: 'Piani coordinati e casi particolari',
              body: String.raw`I piani $x=0$, $y=0$, $z=0$ sono i **piani coordinati**: hanno normale $(1,0,0)$, $(0,1,0)$, $(0,0,1)$. Un piano del tipo $y=3$ ha normale $(0,1,0)$ ed è parallelo al piano $y=0$.

>! Errore tipico: quando una variabile **non compare** nell'equazione, il suo coefficiente è $0$. Il piano $x+y=1$ non dipende da $z$: è parallelo all'asse $z$ e la sua normale è $(1,1,0)$.` },
            { id: 's15.piani.L1.q7', type: 'mcq', level: 2,
              prompt: String.raw`Quale piano è parallelo all'asse $z$ e passa per $(1,1,0)$?`,
              options: [String.raw`$x+y=2$`, String.raw`$x+y+z=2$`, String.raw`$z=1$`, String.raw`$x+y=0$`],
              answer: 0,
              explain: String.raw`Un piano parallelo all'asse $z$ non contiene la $z$ nell'equazione: $x+y=d$. Per $(1,1,0)$ si ha $d=2$. $x+y+z=2$ dipende da $z$; $z=1$ è parallelo al piano $xy$ e non passa per $(1,1,0)$; $x+y=0$ non passa per il punto.` },
          ],
        },
        {
          id: 's15.piani.L2',
          title: 'Piani che contengono una retta',
          cards: [
            { type: 'learn', title: 'Piano per una retta e un punto',
              body: String.raw`Sia $r:\ P_0+t\,v$ una retta e $P\notin r$ un punto. Il piano $\pi$ che contiene $r$ e $P$ contiene:

- il vettore $v$ (direzione di $r$);
- il vettore $P-P_0$ (dal punto $P_0\in r$ al punto $P$).

Quindi la normale è ortogonale a entrambi:
$$n=v\wedge(P-P_0).$$
Poi si scrive $\langle n,\ X-P_0\rangle=0$.` },
            { type: 'example', title: 'Esempio svolto',
              problem: String.raw`Scrivi il piano che contiene $r:\ (x,y,z)=(1+t,\ t,\ 2t)$ e il punto $P=(0,1,2)$.`,
              steps: [
                String.raw`Un punto di $r$ è $P_0=(1,0,0)$ (per $t=0$), la direzione è $v=(1,1,2)$.`,
                String.raw`$P-P_0=(-1,1,2)$.`,
                { text: String.raw`Normale: $n=v\wedge(P-P_0)=(1,1,2)\wedge(-1,1,2)=(1\cdot2-2\cdot1,\ 2\cdot(-1)-1\cdot2,\ 1\cdot1-1\cdot(-1))=(0,-4,2)$.`,
                  ask: { type: 'tuple', labels: ['a', 'b', 'c'], prompt: String.raw`Calcola $(1,1,2)\wedge(-1,1,2)$.`, answer: ['0', '-4', '2'], explain: String.raw`$(1\cdot2-2\cdot1,\ 2\cdot(-1)-1\cdot2,\ 1\cdot1-1\cdot(-1))=(0,-4,2)$.` } },
                String.raw`Semplifico la normale dividendo per $2$: $(0,-2,1)$. Piano: $-2(y-0)+1\cdot(z-0)=0$.`,
              ],
              result: String.raw`$\pi:\ 2y-z=0$ (normale $(0,2,-1)$).` },
            { id: 's15.piani.L2.q1', type: 'mcq', level: 2,
              prompt: String.raw`Quale piano contiene la retta $(x,y,z)=(t,\,t,\,0)$ e il punto $(0,0,1)$?`,
              options: [String.raw`$x-y=0$`, String.raw`$x+y=0$`, String.raw`$z=0$`, String.raw`$x-y=1$`],
              answer: 0,
              explain: String.raw`Direzione $(1,1,0)$, $P-P_0=(0,0,1)$: normale $(1,1,0)\wedge(0,0,1)=(1,-1,0)$, piano $x-y=0$. Controllo: $(t,t,0)$ e $(0,0,1)$ soddisfano $x-y=0$. $x+y=0$ contiene il punto ma non la retta; $z=0$ contiene la retta ma non il punto.` },
            { id: 's15.piani.L2.q2', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: il piano contenente due rette incidenti ha normale $v_1\wedge v_2$, dove $v_1,v_2$ sono le direzioni delle rette.`,
              answer: true,
              explain: String.raw`Vero. Due rette incidenti hanno direzioni non parallele, quindi $v_1\wedge v_2\neq\mathbf 0$: questo vettore è ortogonale a entrambe le direzioni e quindi è la normale del piano che le contiene. Per rette parallele, invece, $v_1\wedge v_2=\mathbf 0$ e serve il vettore $P_2-P_1$.` },
            { type: 'learn', title: 'Fascio di piani',
              body: String.raw`Se $r=\pi_1\cap\pi_2$, tutti i piani che contengono $r$ si scrivono come
$$\pi_1+\lambda\,\pi_2=0\qquad(\lambda\in\R),$$
dove $\pi_1$ e $\pi_2$ indicano le equazioni dei due piani (il membro sinistro di $ax+by+cz+d=0$). Questa famiglia si chiama **fascio di piani** di asse $r$. Con $\lambda=0$ si ottiene $\pi_1$; il piano $\pi_2$ non è nella forma (si ottiene con $\lambda\to\infty$).

Il fascio è utile per trovare il piano di $r$ che passa per un punto $Q$: basta imporre che $\pi_1(Q)+\lambda\pi_2(Q)=0$ e ricavare $\lambda$.` },
            { id: 's15.piani.L2.q3', type: 'num', level: 2,
              prompt: String.raw`Nel fascio $\pi_1+\lambda\pi_2=0$ con $\pi_1:\ x+y-3=0$ e $\pi_2:\ x-y+3z+3=0$, quale $\lambda$ dà il piano che passa per l'origine?`,
              answer: '1',
              explain: String.raw`Per $O=(0,0,0)$: $\pi_1(O)=-3$ e $\pi_2(O)=3$, quindi $-3+3\lambda=0$, cioè $\lambda=1$. Il piano è $(x+y-3)+(x-y+3z+3)=0$, cioè $2x+3z=0$.` },
            { id: 's15.piani.L2.q4', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: due piani distinti che contengono la stessa retta $r$ sono paralleli.`,
              answer: false,
              explain: String.raw`Falso: si intersecano proprio lungo $r$. Due piani sono paralleli quando hanno normali proporzionali, e in quel caso non hanno punti in comune (se distinti).` },
            { id: 's15.piani.L2.q5', type: 'mcq', level: 2,
              prompt: String.raw`Quanti piani contengono una retta $r$ assegnata?`,
              options: [String.raw`Infiniti: quelli del fascio di asse $r$`, String.raw`Uno solo`, String.raw`Tre`, String.raw`Nessuno`],
              answer: 0,
              explain: String.raw`Infiniti: per ogni retta passano infiniti piani, tutti quelli del fascio. Errore tipico: pensare che basti un punto per determinare un piano (ne servono tre, o una retta e un punto fuori da essa).` },
            { id: 's15.piani.L2.q6', type: 'tuple', level: 2, proportional: true,
              prompt: String.raw`Trova una normale del piano che contiene le rette parallele $r:\ (t,\,0,\,0)$ e $s:\ (t,\,1,\,1)$.`,
              answer: ['0', '1', '-1'], labels: ['a', 'b', 'c'],
              explain: String.raw`Le rette sono parallele (direzione $(1,0,0)$), quindi $v_1\wedge v_2=\mathbf 0$ e non basta. Uso un punto di ciascuna: $P_1=(0,0,0)$, $P_2=(0,1,1)$, $P_2-P_1=(0,1,1)$. Normale $(1,0,0)\wedge(0,1,1)=(0\cdot1-0\cdot1,\ 0\cdot0-1\cdot1,\ 1\cdot1-0\cdot0)=(0,-1,1)$.` },
          ],
        },
        {
          id: 's15.piani.L3',
          title: 'Posizioni reciproche e intersezioni',
          cards: [
            { type: 'learn', title: 'Due piani: parallelismo e intersezione',
              body: String.raw`Due piani $\pi_1:\ n_1\cdot X+d_1=0$ e $\pi_2:\ n_2\cdot X+d_2=0$ sono:

1. **paralleli** se $n_1\wedge n_2=\mathbf 0$ (normali proporzionali). Se inoltre le equazioni sono proporzionali, sono **coincidenti**; altrimenti sono **paralleli distinti**;
2. **incidenti** altrimenti, e si intersecano secondo una **retta** di direzione $n_1\wedge n_2$.

Per controllare la coincidenza basta verificare se $\pi_2$ è un multiplo di $\pi_1$.` },
            { id: 's15.piani.L3.q1', type: 'mcq', level: 2,
              prompt: String.raw`Posizione reciproca dei piani $x+2y-z=1$ e $2x+4y-2z=5$:`,
              options: [String.raw`Paralleli distinti`, String.raw`Coincidenti`, String.raw`Incidenti, secondo una retta`, String.raw`Perpendicolari`],
              answer: 0,
              explain: String.raw`Le normali $(1,2,-1)$ e $(2,4,-2)=2(1,2,-1)$ sono proporzionali: i piani sono paralleli. Non coincidono: moltiplicando il primo per $2$ si ottiene $2x+4y-2z=2\neq5$.` },
            { id: 's15.piani.L3.q2', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: i piani $2x+4y-2z=6$ e $x+2y-z=3$ coincidono.`,
              answer: true,
              explain: String.raw`Dividendo la prima equazione per $2$ si ottiene $x+2y-z=3$, cioè la seconda. Sono lo stesso piano.` },
            { id: 's15.piani.L3.q3', type: 'tuple', level: 2, proportional: true,
              prompt: String.raw`Trova una direzione della retta $r=\pi_1\cap\pi_2$, con $\pi_1:\ x-y+z=0$ e $\pi_2:\ x+y=2$.`,
              answer: ['-1', '1', '2'], labels: ['l', 'm', 'n'],
              explain: String.raw`Le normali sono $n_1=(1,-1,1)$ e $n_2=(1,1,0)$. La direzione è $n_1\wedge n_2=((-1)\cdot0-1\cdot1,\ 1\cdot1-1\cdot0,\ 1\cdot1-(-1)\cdot1)=(-1,1,2)$.` },
            { type: 'learn', title: 'Retta e piano',
              body: String.raw`Per trovare l'intersezione di una retta $r:\ P_0+t\,v$ con un piano $\pi:\ n\cdot X+d=0$, si sostituisce $X=P_0+tv$ nell'equazione del piano:
$$n\cdot(P_0+tv)+d=0.$$
Questa è un'equazione in $t$:
- **una soluzione** $t_0$: la retta **incide** il piano nel punto $P_0+t_0v$;
- **nessuna soluzione** (si arriva a $0=k\neq0$): la retta è **parallela** al piano e non lo tocca;
- **identità** ($0=0$): la retta **giace** nel piano.` },
            { type: 'example', title: 'Esempio svolto',
              problem: String.raw`Trova il punto in cui la retta $(x,y,z)=(1+t,\ 2t,\ 3-t)$ incontra il piano $x+y+z=0$.`,
              steps: [
                String.raw`Sostituisco: $(1+t)+2t+(3-t)=0$.`,
                { text: String.raw`Semplifico: $4+2t=0$.`,
                  ask: { type: 'num', prompt: String.raw`Quale valore di $t$ risolve $4+2t=0$?`, answer: '-2', explain: String.raw`$2t=-4$, quindi $t=-2$.` } },
                String.raw`Per $t=-2$: $(1-2,\ -4,\ 3+2)=(-1,-4,5)$.`,
                String.raw`Verifica: $-1-4+5=0$ ✓.`,
              ],
              result: String.raw`Il punto è $(-1,-4,5)$.` },
            { id: 's15.piani.L3.q4', type: 'mcq', level: 2,
              prompt: String.raw`Intersezione della retta $(t,0,0)$ con il piano $y=1$:`,
              options: [String.raw`Vuota`, String.raw`Un punto`, String.raw`L'intera retta`, String.raw`Il punto $(1,0,0)$`],
              answer: 0,
              explain: String.raw`Sostituendo: $0=1$, impossibile. La retta è parallela al piano (la sua direzione $(1,0,0)$ è ortogonale alla normale $(0,1,0)$) e non lo incontra.` },
            { type: 'learn', title: 'Tre piani',
              body: String.raw`Tre piani con equazioni $n_i\cdot X+d_i=0$ formano un sistema $3\times3$. Se le tre normali sono **linearmente indipendenti**, cioè il determinante della matrice dei coefficienti è diverso da zero, i tre piani hanno **un unico punto** in comune.

Se il determinante è nullo bisogna studiare il sistema: può non avere soluzioni (es. tre piani a "prisma"), oppure avere una retta o un piano di soluzioni.` },
            { id: 's15.piani.L3.q5', type: 'num', level: 2,
              prompt: String.raw`Per quale $k$ le normali dei piani $x+y=1$, $y+z=2$, $x+kz=0$ sono linearmente dipendenti?`,
              answer: '-1',
              explain: String.raw`Il determinante della matrice dei coefficienti $\begin{pmatrix}1&1&0\\0&1&1\\1&0&k\end{pmatrix}$ vale $1\cdot(k-0)-1\cdot(0-1)+0=k+1$. È nullo per $k=-1$, perché allora $(1,0,-1)=(1,1,0)-(0,1,1)$.` },
            { id: 's15.piani.L3.q6', type: 'tf', level: 2,
              prompt: String.raw`Vero o falso: tre piani le cui normali sono linearmente indipendenti hanno sempre un unico punto in comune.`,
              answer: true,
              explain: String.raw`Vero. Il sistema ha matrice dei coefficienti invertibile, quindi ha una e una sola soluzione.` },
          ],
        },
        {
          id: 's15.piani.L4',
          title: "Livello d'esame",
          cards: [
            { type: 'learn', title: "Schema per i problemi d'esame sui piani",
              body: String.raw`Nei problemi d'esame sui piani le domande si ripetono. Lo schema è sempre lo stesso:

1. individuo i dati: punti, direzioni di rette, normali di piani;
2. scrivo la normale del piano richiesto: $n=(a,b,c)$ con $n\cdot(X-P_0)=0$, usando $\wedge$ quando servono due vettori del piano;
3. ricavo $d$ imponendo un punto;
4. per il punto d'intersezione risolvo il sistema tra la retta (in parametriche) e il piano (o i due piani).

>! Attenzione: il piano per una retta $r$ e un punto $P$ **non** ha normale $v$ (quella sarebbe il piano *ortogonale* a $r$), ma $v\wedge(P-P_0)$.` },
            { id: 's15.piani.L4.q1', type: 'problem', level: 3, points: 4,
              source: 'Itinere 15/01/2026 · Parte B',
              prompt: String.raw`Sia $r=\pi_1\cap\pi_2$, con $\pi_1:\ 4x+y-z-6=0$ e $\pi_2:\ 2x-y-z=0$. Determinare: il piano $\alpha$ che contiene $r$ e $P=(0,3,0)$; il piano $\beta$ per $P$ ortogonale a $r$; il punto $H=\alpha\cap\beta$.`,
              parts: [
                { type: 'tuple', labels: ['a', 'b', 'c', 'd'], proportional: true, prompt: String.raw`Piano $\alpha$ (equazione $ax+by+cz+d=0$)`,
                  answer: ['1', '1', '0', '-3'],
                  explain: String.raw`La direzione di $r$ è $(1,-1,3)$ e un punto è $(1,2,0)$. Il vettore $P-(1,2,0)=(-1,1,0)$ è nel piano: la normale è $(1,-1,3)\wedge(-1,1,0)=(-3,-3,0)\parallel(1,1,0)$. Passa per $P$: $x+y-3=0$.` },
                { type: 'tuple', labels: ['a', 'b', 'c', 'd'], proportional: true, prompt: String.raw`Piano $\beta$ (equazione $ax+by+cz+d=0$)`,
                  answer: ['1', '-1', '3', '3'],
                  explain: String.raw`La normale di $\beta$ è la direzione di $r$: $(1,-1,3)$. Passa per $P=(0,3,0)$: $0-3+0+d=0$, quindi $d=3$.` },
                { type: 'tuple', labels: ['x', 'y', 'z'], prompt: String.raw`Punto $H=\alpha\cap\beta$`,
                  answer: ['9/11', '24/11', '-6/11'],
                  explain: String.raw`Da $x+y=3$ e $x-y+3z=-3$ sommando si ottiene $2x+3z=0$. Poiché $H\in r$, vale $z=3(x-1)$ (dalle parametriche $x=1+\frac t3$, $z=t$). Quindi $2x+9(x-1)=0$, cioè $x=\frac9{11}$, $y=\frac{24}{11}$, $z=-\frac6{11}$.` },
              ],
              solution: String.raw`Il piano $\alpha$ contiene $r$ e $P$: la sua normale è ortogonale alla direzione $(1,-1,3)$ di $r$ e al vettore $P-(1,2,0)=(-1,1,0)$, quindi $n_\alpha=(1,-1,3)\wedge(-1,1,0)=(-3,-3,0)\parallel(1,1,0)$. Con $P$: $\alpha:\ x+y-3=0$.

Il piano $\beta$ è ortogonale a $r$, quindi ha normale $(1,-1,3)$ e passa per $P$: $\beta:\ x-y+3z+3=0$.

Il punto $H$ sta su $\alpha$ e su $\beta$ e, essendo intersezione dei due piani, è il piede della perpendicolare da $P$ alla retta $r$. Risolvo il sistema con l'equazione di $r$: $H=(9/11,\ 24/11,\ -6/11)$. Controllo: $H\in\alpha$ ($\frac{9+24}{11}=3$ ✓), $H\in\beta$ ($\frac{9-24-18}{11}=-3$ ✓).` },
            { id: 's15.piani.L4.q2', type: 'problem', level: 3, points: 3,
              source: 'Appello 10/02/2026 · Parte B',
              prompt: String.raw`Sia $A=(1,1,-1)$ e $r:\ (x,y,z)=(2-t,\ 1+t,\ -1)$. Determinare: il piano $\alpha$ per $A$ ortogonale a $r$; il punto $H=\alpha\cap r$; il piano $\gamma$ per $O$ e $A$ parallelo a $r$.`,
              parts: [
                { type: 'tuple', labels: ['a', 'b', 'c', 'd'], proportional: true, prompt: String.raw`Piano $\alpha$`,
                  answer: ['1', '-1', '0', '0'],
                  explain: String.raw`La normale è la direzione di $r$: $(-1,1,0)\parallel(1,-1,0)$. Per $A$: $1-1+0+d=0$, quindi $d=0$: $x-y=0$.` },
                { type: 'tuple', labels: ['x', 'y', 'z'], prompt: String.raw`Punto $H$`,
                  answer: ['3/2', '3/2', '-1'],
                  explain: String.raw`Sostituisco $x=2-t$, $y=1+t$ in $x-y=0$: $(2-t)-(1+t)=0$, quindi $t=\frac12$ e $H=(\frac32,\frac32,-1)$. Distanza $d(A,r)=|AH|=\frac{1}{\sqrt2}$.` },
                { type: 'tuple', labels: ['a', 'b', 'c', 'd'], proportional: true, prompt: String.raw`Piano $\gamma$ per $O$ e $A$ parallelo a $r$`,
                  answer: ['1', '1', '2', '0'],
                  explain: String.raw`Il piano contiene $A-O=(1,1,-1)$ e la direzione $(-1,1,0)$ di $r$: normale $(1,1,-1)\wedge(-1,1,0)=(1,1,2)$. Passa per $O$, quindi $d=0$: $x+y+2z=0$.` },
              ],
              solution: String.raw`Il piano per $A$ ortogonale a $r$ ha normale $(-1,1,0)$: $x-y=0$. Sostituendo le parametriche di $r$ si trova $t=\frac12$ e $H=(\frac32,\frac32,-1)$, quindi $d(A,r)=|AH|=\frac{1}{\sqrt2}$.

Il piano per $O$ e $A$ parallelo a $r$ contiene $A-O=(1,1,-1)$ e $(-1,1,0)$: la normale è $(1,1,2)$ e il piano è $x+y+2z=0$. La distanza di $r$ da questo piano (che è parallelo a $r$) è $\frac{|2+1-2|}{\sqrt6}=\frac{1}{\sqrt6}$, usando il punto $(2,1,-1)$ di $r$.` },
            { id: 's15.piani.L4.q3', type: 'mcq', level: 3,
              prompt: String.raw`Per trovare il piano che contiene una retta $r$ e un punto $P\notin r$, la normale corretta è:`,
              options: [String.raw`$v\wedge(P-P_0)$`, String.raw`$v$`, String.raw`$v\cdot(P-P_0)$`, String.raw`$P-P_0$`],
              answer: 0,
              explain: String.raw`Il piano contiene $v$ e $P-P_0$: la normale è ortogonale a entrambi, cioè $v\wedge(P-P_0)$. $v$ sarebbe la normale del piano *ortogonale* a $r$, che non contiene $r$. $v\cdot(P-P_0)$ è un numero, non un vettore.` },
            { id: 's15.piani.L4.q4', type: 'order', level: 3,
              prompt: String.raw`Riordina i passi per scrivere il piano che contiene la retta $r:\ P_0+tv$ e il punto $P\notin r$.`,
              steps: [
                String.raw`Scelgo un punto $P_0$ e una direzione $v$ di $r$.`,
                String.raw`Calcolo il vettore $P-P_0$ che va dalla retta a $P$.`,
                String.raw`Calcolo la normale $n=v\wedge(P-P_0)$.`,
                String.raw`Scrivo $\langle n,\ X-P_0\rangle=0$ e la sviluppo in $ax+by+cz+d=0$.`,
              ],
              distractors: [String.raw`Uso $v$ come normale del piano per $P$.`],
              explain: String.raw`La normale deve essere ortogonale sia a $v$ sia a $P-P_0$. Usare $v$ come normale dà il piano ortogonale a $r$ per $P$, che in generale non contiene $r$.` },
            { id: 's15.piani.L4.q5', type: 'num', level: 3,
              prompt: String.raw`Per quale $k$ il piano $x+ky+z+3=0$ contiene la retta $(x,y,z)=(t,\ 1+t,\ 2t)$?`,
              answer: '-3',
              explain: String.raw`Sostituisco la retta: $t+k(1+t)+2t+3=(k+3)t+(k+3)=(k+3)(t+1)$. Deve essere nullo per ogni $t$, quindi $k=-3$.` },
            { id: 's15.piani.L4.q6', type: 'tf', level: 3,
              prompt: String.raw`Vero o falso: il piano per $A$ ortogonale a una retta $r$ contiene $r$.`,
              answer: false,
              explain: String.raw`Falso: il piano è ortogonale a $r$, quindi la sua normale è la direzione di $r$. Un piano che contiene $r$ ha invece normale ortogonale a $v$. Errore tipico: confondere "ortogonale a $r$" con "contenente $r$".` },
            { id: 's15.piani.L4.q7', type: 'open', level: 3, points: 1,
              source: 'Appello 10/02/2026 · Parte A',
              prompt: String.raw`Quando due piani sono paralleli? Quando sono coincidenti?`,
              answer: String.raw`Due piani sono paralleli se hanno normali proporzionali, cioè $n_1\wedge n_2=\mathbf 0$. Sono coincidenti se, oltre a essere paralleli, le loro equazioni sono proporzionali (equivalentemente hanno un punto in comune). Se le normali non sono proporzionali i piani sono incidenti, lungo una retta.`,
              rubric: ['Normali proporzionali (o prodotto vettoriale nullo)', 'Coincidenti: equazioni proporzionali o un punto in comune', 'Non proporzionali: incidenti lungo una retta'] },
          ],
        },
      ],
      practice: [
        { id: 's15.piani.p1', type: 'tuple', level: 1, proportional: true,
          prompt: String.raw`Trova una normale del piano $3x-y+2z=7$.`,
          answer: ['3', '-1', '2'], labels: ['a', 'b', 'c'],
          explain: String.raw`I coefficienti di $x,y,z$ danno la normale: $(3,-1,2)$.` },
        { id: 's15.piani.p2', type: 'num', level: 1,
          prompt: String.raw`Il piano con normale $(1,-1,2)$ passa per $A=(2,0,1)$. Quanto vale $d$ nell'equazione $x-y+2z+d=0$?`,
          answer: '-4',
          explain: String.raw`$2-0+2+d=0$, quindi $d=-4$.` },
        { id: 's15.piani.p3', type: 'mcq', level: 1,
          prompt: String.raw`Quale punto appartiene al piano $x-2y+z=3$?`,
          options: [String.raw`$(1,-1,0)$`, String.raw`$(2,0,0)$`, String.raw`$(1,1,0)$`, String.raw`$(0,0,0)$`],
          answer: 0,
          explain: String.raw`$(1,-1,0)$: $1+2+0=3$ ✓. $(2,0,0)$ dà $2\neq3$; $(1,1,0)$ dà $-1$; l'origine dà $0$.` },
        { id: 's15.piani.p4', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: i piani $x+y=1$ e $x+y+z=1$ si intersecano lungo una retta.`,
          answer: true,
          explain: String.raw`Le normali $(1,1,0)$ e $(1,1,1)$ non sono proporzionali: i piani sono incidenti e l'intersezione è la retta $\{x+y=1,\ z=0\}$.` },
        { id: 's15.piani.p5', type: 'mcq', level: 2,
          prompt: String.raw`Quale piano passa per $O$, $A=(1,0,0)$ e $B=(0,1,0)$?`,
          options: [String.raw`$z=0$`, String.raw`$x+y=1$`, String.raw`$x+y+z=0$`, String.raw`$x=y$`],
          answer: 0,
          explain: String.raw`Il piano per tre punti del piano $xy$ è $z=0$. $x+y=1$ non passa per $O$; $x+y+z=0$ non passa per $A$; $x=y$ non passa per $A$.` },
        { id: 's15.piani.p6', type: 'tuple', level: 2, proportional: true,
          prompt: String.raw`Trova una direzione della retta $r=\pi_1\cap\pi_2$ con $\pi_1:\ x+y+z=1$ e $\pi_2:\ x-y=0$.`,
          answer: ['1', '1', '-2'], labels: ['l', 'm', 'n'],
          explain: String.raw`$n_1\wedge n_2=(1,1,1)\wedge(1,-1,0)=(1\cdot0-1\cdot(-1),\ 1\cdot1-1\cdot0,\ 1\cdot(-1)-1\cdot1)=(1,1,-2)$.` },
        { id: 's15.piani.p7', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: il piano $z=5$ è parallelo al piano $z=0$.`,
          answer: true,
          explain: String.raw`Hanno la stessa normale $(0,0,1)$ e sono distinti (uno ha $z=5$, l'altro $z=0$): sono paralleli distinti.` },
        { id: 's15.piani.p8', type: 'cloze', level: 2,
          prompt: 'Completa.',
          text: String.raw`Due piani sono paralleli se le loro normali sono [[0]]. Sono coincidenti se, inoltre, le loro equazioni sono [[1]].`,
          blanks: [
            { options: ['proporzionali', 'ortogonali', 'uguali'], answer: 0 },
            { options: ['proporzionali', 'diverse', 'opposte'], answer: 0 },
          ],
          explain: String.raw`Parallelismo: normali proporzionali. Coincidenza: equazioni proporzionali (il termine noto deve seguire lo stesso fattore).` },
        { id: 's15.piani.p9', type: 'expr', level: 2, vars: ['x', 'y', 'z'],
          prompt: String.raw`Scrivi l'equazione del piano per $P=(1,0,1)$ con normale $(1,2,0)$ nella forma $ax+by+cz+d=0$ (scrivi il membro sinistro).`,
          answer: 'x+2y-1',
          explain: String.raw`$1\cdot(x-1)+2(y-0)+0(z-1)=0$, cioè $x+2y-1=0$.` },
        { id: 's15.piani.p10', type: 'num', level: 2,
          prompt: String.raw`Il piano $x+2y+3z=6$ e la retta $(t,\ 0,\ 0)$: quale valore di $t$ dà il punto d'intersezione?`,
          answer: '6',
          explain: String.raw`Sostituisco: $t+0+0=6$, quindi $t=6$. Il punto è $(6,0,0)$.` },
        { id: 's15.piani.g1', type: 'gen', level: 2,
          gen: (R) => {
            let A, B, C, n;
            do {
              A = [R.int(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              B = [R.int(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              C = [R.int(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              n = H.cross(B.map((x, i) => x - A[i]), C.map((x, i) => x - A[i]));
            } while (n.every((x) => x === 0));
            return {
              type: 'tuple', labels: ['a', 'b', 'c'], proportional: true,
              prompt: String.raw`Trova una normale del piano per $A=(${A.join(', ')})$, $B=(${B.join(', ')})$ e $C=(${C.join(', ')})$.`,
              answer: n.map(String),
              explain: String.raw`Il piano contiene $B-A$ e $C-A$, quindi la normale è il loro prodotto vettoriale $(${n.join(', ')})$. Ogni multiplo non nullo va bene.`,
            };
          } },
        { id: 's15.piani.g2', type: 'gen', level: 1,
          gen: (R) => {
            const n = [R.nz(-3, 3), R.nz(-3, 3), R.nz(-3, 3)];
            const P = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
            const d = -H.dot(n, P) + 0;
            return {
              type: 'num',
              prompt: String.raw`Il piano ha normale $(${n.join(', ')})$ e passa per $P=(${P.join(', ')})$. Scrivi l'equazione nella forma $ax+by+cz+d=0$: quanto vale $d$?`,
              answer: String(d),
              explain: String.raw`$d=-(a x_0+b y_0+c z_0)=-(${H.dot(n, P)})=${d}$.`,
            };
          } },
        { id: 's15.piani.g3', type: 'gen', level: 2,
          gen: (R) => {
            let n, v, P, t0, Q;
            do {
              n = [R.nz(-3, 3), R.int(-3, 3), R.nz(-3, 3)];
              v = [R.int(-2, 2), R.nz(-2, 2), R.int(-2, 2)];
              P = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
              t0 = R.nz(-3, 3);
              Q = P.map((x, i) => x + t0 * v[i]);
            } while (H.dot(n, v) === 0);
            const d = -H.dot(n, Q) + 0;
            return {
              type: 'num',
              prompt: String.raw`Il piano $${H.planeTex(n[0], n[1], n[2], d)}$ incontra la retta $(x,y,z)=(${P.join(', ')})+t\,(${v.join(', ')})$. Quale valore di $t$ dà il punto d'intersezione?`,
              answer: String(t0),
              explain: String.raw`Sostituisco la retta nel piano: $\langle(${n.join(', ')}),\ (${P.join(', ')})+t(${v.join(', ')})\rangle+(${d})=0$. Il valore $t=${t0}$ dà il punto $(${Q.join(', ')})$.`,
            };
          } },
        { id: 's15.piani.g4', type: 'gen', level: 2,
          gen: (R) => {
            const type = R.int(0, 2);
            const n1 = [R.nz(-2, 2), R.int(-2, 2), R.nz(-2, 2)];
            const d1 = R.int(-3, 3);
            let n2, rhs2;
            if (type === 2) {
              do {
                n2 = [R.nz(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              } while (H.cross(n1, n2).every((x) => x === 0));
              rhs2 = R.int(-3, 3);
            } else {
              const k = R.pick([2, -2, 3]);
              n2 = n1.map((x) => k * x);
              rhs2 = k * d1 + (type === 0 ? R.nz(-3, 3) : 0);
            }
            const eq1 = H.planeTex(n1[0], n1[1], n1[2], -d1);
            const eq2 = H.planeTex(n2[0], n2[1], n2[2], -rhs2);
            return {
              type: 'mcq',
              prompt: String.raw`Posizione reciproca dei piani $\pi_1:\ ${eq1}$ e $\pi_2:\ ${eq2}$.`,
              options: [String.raw`Paralleli distinti`, String.raw`Coincidenti`, String.raw`Incidenti, lungo una retta`],
              answer: type,
              explain: String.raw`${type === 2 ? 'Le normali non sono proporzionali: i piani si intersecano lungo una retta.' : type === 1 ? 'Le normali sono proporzionali e le equazioni sono proporzionali: i piani coincidono.' : 'Le normali sono proporzionali, ma i termini noti non seguono lo stesso fattore: i piani sono paralleli e distinti.'}`,
            };
          } },
        { id: 's15.piani.g5', type: 'gen', level: 3,
          gen: (R) => {
            let Q, n2, d2, s;
            do {
              Q = [R.int(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              n2 = [R.nz(-2, 2), R.int(-2, 2), R.int(-2, 2)];
              d2 = R.int(-3, 3);
              s = H.dot(n2, Q) + d2;
            } while (s === 0);
            const lam = R.nz(-3, 3);
            const n1 = [R.nz(-2, 2), R.int(-2, 2), R.int(-2, 2)];
            const d1 = -H.dot(n1, Q) - lam * s;
            return {
              type: 'num',
              prompt: String.raw`Siano $\pi_1:\ ${H.planeTex(n1[0], n1[1], n1[2], d1)}$ e $\pi_2:\ ${H.planeTex(n2[0], n2[1], n2[2], d2)}$. Quale $\lambda$ rende il piano $\pi_1+\lambda\pi_2=0$ passante per $Q=(${Q.join(', ')})$?`,
              answer: String(lam),
              explain: String.raw`$\pi_1(Q)=${-lam * s}$ e $\pi_2(Q)=${s}$. Imponendo $\pi_1(Q)+\lambda\pi_2(Q)=0$ si ottiene $\lambda=${lam}$.`,
            };
          } },
      ],
      flashcards: [
        { id: 's15.piani.fc1', kind: 'def', front: String.raw`Equazione cartesiana di un piano`,
          back: String.raw`$ax+by+cz+d=0$ con $(a,b,c)\neq\mathbf 0$. Il vettore $(a,b,c)$ è una normale al piano.` },
        { id: 's15.piani.fc2', kind: 'formula', front: String.raw`Normale del piano per tre punti $A,B,C$`,
          back: String.raw`$n=(B-A)\wedge(C-A)$. Se $A,B,C$ sono allineati, $n=\mathbf 0$ e non c'è un piano unico.` },
        { id: 's15.piani.fc3', kind: 'formula', front: String.raw`Normale del piano per una retta $r:\ P_0+tv$ e un punto $P\notin r$`,
          back: String.raw`$n=v\wedge(P-P_0)$. Il piano è $\langle n,\ X-P_0\rangle=0$.` },
        { id: 's15.piani.fc4', kind: 'def', front: String.raw`Fascio di piani di asse $r$`,
          back: String.raw`È la famiglia dei piani $\pi_1+\lambda\pi_2=0$, con $r=\pi_1\cap\pi_2$ e $\lambda\in\R$. Contiene tutti i piani che passano per $r$, tranne $\pi_2$.` },
        { id: 's15.piani.fc5', kind: 'metodo', front: String.raw`Posizione reciproca di due piani`,
          back: String.raw`Normali proporzionali: paralleli (coincidenti se anche le equazioni sono proporzionali). Altrimenti: incidenti lungo una retta di direzione $n_1\wedge n_2$.` },
        { id: 's15.piani.fc6', kind: 'metodo', front: String.raw`Intersezione di una retta con un piano`,
          back: String.raw`Sostituisco $X=P_0+tv$ in $n\cdot X+d=0$ e risolvo in $t$. Una soluzione: punto; nessuna: retta parallela al piano; identità: retta contenuta nel piano.` },
        { id: 's15.piani.fc7', kind: 'thm', front: String.raw`Tre piani con normali linearmente indipendenti`,
          back: String.raw`Il determinante della matrice dei coefficienti è diverso da zero, quindi i tre piani hanno un unico punto in comune.` },
        { id: 's15.piani.fc8', kind: 'errore', front: String.raw`Errori tipici sui piani`,
          back: String.raw`Usare la direzione della retta come normale del piano che la contiene (è la normale del piano ortogonale). Dimenticare $d$ quando si verifica un punto. Dire che due piani con normali proporzionali sono sempre coincidenti (possono essere paralleli distinti).` },
        { id: 's15.piani.fc9', kind: 'def', front: String.raw`Piani paralleli e coincidenti`,
          back: String.raw`Paralleli: normali proporzionali. Coincidenti: paralleli con le stesse equazioni a meno di un fattore (in particolare hanno un punto in comune).` },
      ],
    },
    // __NEXT_SKILL__
  ],
};
