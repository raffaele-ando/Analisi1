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
    // __NEXT_SKILL__
  ],
};
