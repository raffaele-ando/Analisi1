import { H } from '../engine/tex.js';

// Sezione s04 · Successioni.
// Le skill sono aggiunte in fondo con S.push(...): l'array viene riempito durante il caricamento del modulo.
const S = [];

export default {
  id: 's04',
  title: 'Successioni',
  subtitle: 'Definizione, limiti, monotonia, numero di Nepero',
  intro: String.raw`Una successione è una lista infinita di numeri indicizzata da $n$. Studiare il **limite** per $n\to+\infty$ significa chiedersi se i termini si avvicinano a un valore fissato. È il linguaggio comune a successioni, serie (sezione s13) e limiti di funzioni (sezione s05). All'esame compaiono limiti di successioni nella Parte B e definizioni, teoremi e dimostrazioni (unicità del limite, successioni monotone) nella Parte A.`,
  skills: S,
};

// ---------------------------------------------------------------------------
// s04.def
// ---------------------------------------------------------------------------
S.push({
  id: 's04.def',
  title: 'Successioni: definizione, limitatezza, monotonia, estremi',
  summary: String.raw`Saprai calcolare i termini di una successione, capire quando una proprietà vale definitivamente, dire se una successione è limitata o monotona e trovarne massimo, minimo, sup e inf.`,
  prereq: ['s01.supinf', 's03.base'],
  examRefs: ['Itinere 11/11/2025 · B6'],
  lessons: [
    {
      id: 's04.def.L1',
      title: 'Che cos\'è una successione',
      cards: [
        {
          type: 'learn',
          title: 'L\'idea',
          body: String.raw`Una **successione** è una lista infinita di numeri, uno dopo l'altro: $a_1, a_2, a_3, \dots$ Il numero $n$ è l'**indice** e $a_n$ è il **termine n-esimo**.

Una successione si definisce con una formula che, dato $n$, restituisce $a_n$. Esempi:

- $a_n=\dfrac1n$: $1,\ \dfrac12,\ \dfrac13,\ \dfrac14,\dots$
- $a_n=(-1)^n$: $-1,\ 1,\ -1,\ 1,\dots$
- $a_n=n^2$: $1,\ 4,\ 9,\ 16,\dots$

Di solito $n$ parte da $1$ (a volte da $0$). Attenzione: la successione è la lista **ordinata** dei termini, non l'insieme dei suoi valori. Per $a_n=(-1)^n$ l'insieme dei valori è $\{-1,1\}$, ma la successione ha infiniti termini.`,
          plot: { fns: ['1/x'], x: [0.5, 6], y: [-0.5, 1.5], points: [[1, 1], [2, 0.5], [3, 0.3333], [4, 0.25], [5, 0.2]] },
        },
        {
          type: 'example',
          title: 'Calcolare i primi termini',
          problem: String.raw`Sia $a_n=\dfrac{n-1}{n+1}$. Calcola $a_1$, $a_2$, $a_3$ e $a_4$.`,
          steps: [
            String.raw`Con $n=1$: $a_1=\dfrac{1-1}{1+1}=\dfrac{0}{2}=0$.`,
            String.raw`Con $n=2$: $a_2=\dfrac{2-1}{2+1}=\dfrac13$.`,
            String.raw`Con $n=3$: $a_3=\dfrac{3-1}{3+1}=\dfrac24=\dfrac12$.`,
            { text: String.raw`Con $n=4$: $a_4=\dfrac{4-1}{4+1}=\dfrac35$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $a_4$ per $a_n=\dfrac{n-1}{n+1}$?`, answer: '3/5', explain: String.raw`Con $n=4$ si ha $\dfrac{4-1}{4+1}=\dfrac35$.` } },
          ],
          result: String.raw`$a_1=0,\quad a_2=\dfrac13,\quad a_3=\dfrac12,\quad a_4=\dfrac35$.`,
        },
        {
          id: 's04.def.L1.e1',
          type: 'mcq', level: 1,
          prompt: String.raw`Per $a_n=\dfrac{(-1)^n}{n}$, quanto vale $a_2$?`,
          options: [String.raw`$\dfrac12$`, String.raw`$-\dfrac12$`, String.raw`$2$`, String.raw`$\dfrac14$`],
          answer: 0,
          explain: String.raw`$(-1)^2=+1$, quindi $a_2=\dfrac12$. Il distrattore $-\dfrac12$ dimentica che $(-1)^2=+1$: il segno dipende dalla parità di $n$. Il valore $2$ scambia numeratore e denominatore. Il valore $\dfrac14$ eleva al quadrato l'indice invece di usarlo al denominatore.`,
        },
        {
          id: 's04.def.L1.e2',
          type: 'num', level: 1,
          prompt: String.raw`Sia $a_n=\dfrac{2n}{n+3}$. Calcola $a_{10}$.`,
          answer: '20/13',
          explain: String.raw`Sostituisco $n=10$: al numeratore $2\cdot10=20$, al denominatore $10+3=13$. Quindi $a_{10}=\dfrac{20}{13}$.`,
        },
        {
          id: 's04.def.L1.e3',
          type: 'tf', level: 1,
          prompt: String.raw`La successione $a_n=\dfrac1n$ soddisfa $a_n<\dfrac1{100}$ **definitivamente**.`,
          answer: true,
          explain: String.raw`Vale $a_n<\dfrac1{100}$ per $n>100$, cioè da $n=101$ in poi. "Definitivamente" significa "da un certo indice in poi": non serve che valga per i primi termini.`,
        },
        {
          type: 'learn',
          title: 'Definitivamente',
          body: String.raw`Una proprietà vale **definitivamente** se vale da un certo indice $N$ in poi, cioè per ogni $n\ge N$. Quello che succede per i primi termini non conta.

>* $P(n)$ vale definitivamente se esiste $N$ tale che $P(n)$ è vera per ogni $n\ge N$.

Esempio: $a_n=n^2-10n=n(n-10)$ è **positiva definitivamente**, perché è positiva per ogni $n>10$. Per $n\le10$ non è positiva: non importa.`,
        },
        {
          id: 's04.def.L1.e4',
          type: 'num', level: 2,
          prompt: String.raw`Qual è il più piccolo $N$ tale che $n^2\ge1000$ per ogni $n\ge N$?`,
          answer: '32',
          explain: String.raw`$31^2=961<1000$ e $32^2=1024\ge1000$. Da $n=32$ in poi la disuguaglianza vale sempre, perché $n^2$ cresce. Errore tipico: arrotondare $\sqrt{1000}\approx31{,}6$ e rispondere $31$, ma $31^2<1000$.`,
        },
        {
          type: 'learn',
          title: 'Limitatezza',
          body: String.raw`Una successione è **limitata superiormente** se esiste $M$ con $a_n\le M$ per ogni $n$; è **limitata inferiormente** se esiste $m$ con $a_n\ge m$ per ogni $n$; è **limitata** se lo è sia sopra sia sotto. Equivalentemente: esiste $M>0$ con $|a_n|\le M$ per ogni $n$.

>! Attenzione: "per ogni $n$" significa **tutti** i termini, non solo quelli da un certo punto in poi. Una successione i cui termini diventano grandi non è limitata, anche se i primi termini sono piccoli.`,
        },
        {
          id: 's04.def.L1.e5',
          type: 'mcq', level: 1,
          prompt: String.raw`Quale successione **non** è limitata?`,
          options: [String.raw`$a_n=\dfrac1n$`, String.raw`$a_n=(-1)^n$`, String.raw`$a_n=\dfrac{n}{n+1}$`, String.raw`$a_n=\sqrt n$`],
          answer: 3,
          explain: String.raw`$\sqrt n$ supera ogni soglia $M$ da un certo punto in poi, quindi non è limitata superiormente. Le altre sono limitate: $\dfrac1n\in(0,1]$, $(-1)^n\in\{-1,1\}$, $\dfrac{n}{n+1}\in[\tfrac12,1)$.`,
        },
        {
          id: 's04.def.L1.e6',
          type: 'tf', level: 2,
          prompt: String.raw`Ogni successione limitata è convergente.`,
          answer: false,
          explain: String.raw`Falso. $a_n=(-1)^n$ è limitata ($|a_n|\le1$) ma non converge: i termini oscillano tra $-1$ e $1$ senza avvicinarsi a un valore. La limitatezza è una condizione **necessaria** per la convergenza, non sufficiente.`,
        },
        {
          id: 's04.def.L1.e7',
          type: 'match', level: 1,
          prompt: 'Abbina ogni successione alla sua proprietà.',
          pairs: [
            [String.raw`$a_n=\dfrac1n$`, 'limitata e decrescente'],
            [String.raw`$a_n=n^2$`, 'illimitata e crescente'],
            [String.raw`$a_n=(-1)^n$`, 'limitata ma non monotona'],
          ],
          explain: String.raw`$\dfrac1n$ decresce e sta in $(0,1]$. $n^2$ cresce senza limiti. $(-1)^n$ è limitata, ma alterna $-1$ e $1$: non è né crescente né decrescente.`,
        },
      ],
    },
    {
      id: 's04.def.L2',
      title: 'Monotonia, massimo, minimo, sup e inf',
      cards: [
        {
          type: 'learn',
          title: 'Crescente o decrescente',
          body: String.raw`Una successione è
- **crescente** se $a_{n+1}\ge a_n$ per ogni $n$; **strettamente crescente** se $a_{n+1}>a_n$;
- **decrescente** se $a_{n+1}\le a_n$; **strettamente decrescente** se $a_{n+1}<a_n$.

Per stabilire la monotonia si studia il segno di $a_{n+1}-a_n$. Se tutti i termini sono positivi si può anche confrontare il rapporto $\dfrac{a_{n+1}}{a_n}$ con $1$.

Una successione **monotona** è crescente oppure decrescente.`,
        },
        {
          type: 'example',
          title: 'Monotonia per differenza',
          problem: String.raw`Dimostra che $a_n=\dfrac{n}{n+1}$ è strettamente crescente.`,
          steps: [
            String.raw`Calcolo la differenza: $a_{n+1}-a_n=\dfrac{n+1}{n+2}-\dfrac{n}{n+1}$.`,
            { text: String.raw`Porto allo stesso denominatore: $a_{n+1}-a_n=\dfrac{(n+1)^2-n(n+2)}{(n+1)(n+2)}$.`,
              ask: { type: 'expr', vars: ['n'], prompt: String.raw`Quanto vale il numeratore $(n+1)^2-n(n+2)$?`, answer: '1', explain: String.raw`$(n+1)^2-n(n+2)=n^2+2n+1-n^2-2n=1$.` } },
            String.raw`Quindi $a_{n+1}-a_n=\dfrac{1}{(n+1)(n+2)}>0$ per ogni $n\ge1$.`,
          ],
          result: String.raw`La differenza è sempre positiva: $a_n$ è strettamente crescente.`,
        },
        {
          id: 's04.def.L2.e1',
          type: 'tf', level: 1,
          prompt: String.raw`La successione $a_n=3-\dfrac1n$ è strettamente crescente.`,
          answer: true,
          explain: String.raw`$a_{n+1}-a_n=-\dfrac{1}{n+1}+\dfrac1n=\dfrac{1}{n(n+1)}>0$. Il segno meno davanti a $\dfrac1n$ non cambia il verso della disuguaglianza: $-\dfrac1n$ cresce.`,
        },
        {
          id: 's04.def.L2.e2',
          type: 'mcq', level: 2,
          prompt: String.raw`Quale affermazione su $a_n=(-1)^n$ è vera?`,
          options: ['È crescente.', 'È decrescente.', 'È monotona, perché è limitata.', 'Non è monotona: i termini alternano segno.'],
          answer: 3,
          explain: String.raw`$a_1=-1$ e $a_2=1$ salgono, ma $a_3=-1<a_2$ scende: non è né crescente né decrescente. Errore tipico: pensare che limitata implichi monotona. Non è così.`,
        },
        {
          type: 'learn',
          title: 'Massimo, minimo, sup e inf',
          body: String.raw`Per una successione ci sono quattro valori utili:

- **massimo** $\max a_n$: un termine $a_N$ che è $\ge$ di tutti gli altri. Se esiste, è unico.
- **minimo** $\min a_n$: un termine $\le$ di tutti gli altri.
- **estremo superiore** $\sup a_n$: il più piccolo dei maggioranti. Non è necessariamente un termine.
- **estremo inferiore** $\inf a_n$: il più grande dei minoranti.

Se esiste il massimo, allora $\max=\sup$; se esiste il minimo, allora $\min=\inf$. Se la successione non è limitata superiormente, $\sup=+\infty$; se non è limitata inferiormente, $\inf=-\infty$.

>! Il sup può non essere raggiunto. Per $a_n=\dfrac{n}{n+1}$ si ha $\sup=1$, ma nessun termine vale $1$: quindi non esiste il massimo.`,
        },
        {
          type: 'example',
          title: 'Massimo, minimo, sup e inf',
          problem: String.raw`Sia $a_n=(-1)^n\left(1+\dfrac1n\right)$. Determina, se esistono, massimo, minimo, sup e inf.`,
          steps: [
            String.raw`Primi termini: $a_1=-2$, $a_2=\dfrac32$, $a_3=-\dfrac43$, $a_4=\dfrac54$, $\dots$`,
            { text: String.raw`I termini con $n$ pari sono $1+\dfrac1n$: decrescono verso $1$, quindi il loro massimo è $a_2$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale il massimo dei termini con $n$ pari?`, answer: '3/2', explain: String.raw`Il termine $a_2=\dfrac32$ è il più grande tra quelli pari.` } },
            String.raw`I termini con $n$ dispari sono $-\left(1+\dfrac1n\right)$: crescono verso $-1$, quindi il loro minimo è $a_1=-2$.`,
          ],
          result: String.raw`$\max a_n=\sup a_n=\dfrac32$ (raggiunto in $n=2$), $\min a_n=\inf a_n=-2$ (raggiunto in $n=1$).`,
        },
        {
          id: 's04.def.L2.e3',
          type: 'num', level: 2,
          prompt: String.raw`Sia $a_n=\dfrac{n}{n+1}$. Quanto vale $\sup a_n$?`,
          answer: '1',
          explain: String.raw`Tutti i termini sono minori di $1$ e si avvicinano a $1$: quindi $1$ è il più piccolo maggiorante. Non c'è massimo, perché nessun $a_n$ vale $1$.`,
        },
        {
          id: 's04.def.L2.e4',
          type: 'mcq', level: 2,
          prompt: String.raw`Sia $a_n=\dfrac{n}{n+1}$. Quale affermazione è vera?`,
          options: [String.raw`Ha massimo, uguale a $1$.`, String.raw`Non ha massimo: $\sup=1$, ma nessun termine vale $1$.`, String.raw`Ha massimo, uguale a $\dfrac12$.`, String.raw`Non è limitata.`],
          answer: 1,
          explain: String.raw`La successione è limitata ($\dfrac12\le a_n<1$), il suo sup è $1$ e non viene raggiunto. Il massimo $\dfrac12$ è il primo termine, ma è un **minimo** perché la successione cresce: confondere le due cose è un errore tipico.`,
        },
        {
          id: 's04.def.L2.e5',
          type: 'num', level: 2,
          prompt: String.raw`Sia $a_n=\dfrac{n+2}{n+1}$. Quanto vale $\sup a_n$?`,
          answer: '3/2',
          explain: String.raw`Si ha $a_n=1+\dfrac{1}{n+1}$, che decresce. Il primo termine $a_1=\dfrac32$ è il massimo, quindi anche il sup.`,
        },
        {
          id: 's04.def.L2.e6',
          type: 'open', level: 2,
          prompt: String.raw`Dimostra che $a_n=\dfrac{n+2}{n+1}$ è decrescente e limitata. Determina sup e inf, dicendo quale di essi è raggiunto.`,
          answer: String.raw`$a_{n+1}-a_n=\dfrac{n+3}{n+2}-\dfrac{n+2}{n+1}=\dfrac{(n+3)(n+1)-(n+2)^2}{(n+1)(n+2)}=\dfrac{-1}{(n+1)(n+2)}<0$: la successione è strettamente decrescente. Quindi $1<a_n\le\dfrac32$, con $a_1=\dfrac32$. Il sup è $\dfrac32=\max$ (raggiunto in $n=1$). L'inf è $1$, non raggiunto, perché $a_n=1+\dfrac1{n+1}>1$ e $a_n\to1$.`,
          rubric: ['Calcolo corretto di $a_{n+1}-a_n$ con segno negativo', 'Limitatezza: $1<a_n\le\\dfrac32$', 'Sup = max = 3/2 raggiunto in n=1; inf = 1 non raggiunto'],
        },
        {
          id: 's04.def.L2.e7',
          type: 'num', level: 2,
          prompt: String.raw`Sia $a_n=\dfrac{n+2}{n+1}$. Quanto vale $\inf a_n$?`,
          answer: '1',
          explain: String.raw`Il limite $a_n\to1$ dall'alto, e tutti i termini sono maggiori di $1$. Quindi $1$ è il più grande minorante. Non è raggiunto da nessun termine.`,
        },
        {
          id: 's04.def.L2.e8',
          type: 'problem', level: 3,
          prompt: String.raw`Sia $a_n=\dfrac{(-1)^n\,n}{n+1}$. Stabilisci se è limitata e determina, se esistono, massimo, minimo, sup e inf.`,
          parts: [
            { type: 'tf', prompt: 'La successione è limitata?', answer: true, explain: String.raw`Vale $|a_n|=\dfrac{n}{n+1}<1$ per ogni $n$.` },
            { type: 'num', prompt: 'Sup di $a_n$.', answer: '1', explain: String.raw`I termini pari $\dfrac{n}{n+1}$ crescono verso $1$ senza raggiungerlo.` },
            { type: 'num', prompt: 'Inf di $a_n$.', answer: '-1', explain: String.raw`I termini dispari $-\dfrac{n}{n+1}$ decrescono verso $-1$ senza raggiungerlo.` },
            { type: 'tf', prompt: 'La successione ha massimo?', answer: false, explain: String.raw`Il sup $1$ non è raggiunto da nessun termine, quindi non esiste il massimo. Analogamente non esiste il minimo.` },
          ],
          solution: String.raw`$a_1=-\dfrac12$, $a_2=\dfrac23$, $a_3=-\dfrac34$, $\dots$ I termini pari $\dfrac{n}{n+1}\in(0,1)$ tendono a $1$ crescendo; i dispari $-\dfrac{n}{n+1}\in(-1,0)$ tendono a $-1$ decrescendo. Quindi la successione è limitata ($|a_n|<1$), $\sup=1$ e $\inf=-1$, entrambi non raggiunti: non esistono massimo né minimo.`,
        },
      ],
    },
  ],
  practice: [
    { id: 's04.def.p-termine', type: 'gen', level: 1,
      gen: (R) => {
        const p = R.nz(-3, 4), q = R.nz(-4, 5), r = R.int(1, 3), s = R.int(1, 5), k = R.int(2, 9);
        const numV = p * k + q, denV = r * k + s;
        return {
          type: 'num',
          prompt: String.raw`Sia $a_n=\dfrac{${H.coef(p)}n${H.signed(q)}}{${H.coef(r)}n${H.signed(s)}}$. Calcola $a_{${k}}$.`,
          answer: `(${p}*${k}+${q})/(${r}*${k}+${s})`,
          explain: String.raw`Sostituisco $n=${k}$: numeratore $\dfrac{${numV}}{${denV}}$. Quindi $a_{${k}}=\dfrac{${numV}}{${denV}}$.`,
        };
      } },
    { id: 's04.def.p-maxmin', type: 'gen', level: 2,
      gen: (R) => {
        const c = R.int(1, 6);
        const askMax = R.chance(0.5);
        return {
          type: 'num',
          prompt: String.raw`Sia $a_n=(-1)^n\left(1+\dfrac{${c}}{n}\right)$. Quanto vale ${askMax ? 'il massimo' : 'il minimo'} di $a_n$, se esiste?`,
          answer: askMax ? `(2+${c})/2` : `-(1+${c})`,
          explain: askMax
            ? String.raw`I termini pari $1+\dfrac{${c}}{n}$ decrescono: il massimo è $a_2=1+\dfrac{${c}}{2}=\dfrac{2+${c}}{2}$.`
            : String.raw`I termini dispari $-\left(1+\dfrac{${c}}{n}\right)$ crescono verso $-1$: il minimo è $a_1=-(1+${c})$.`,
        };
      } },
    { id: 's04.def.p-monotona', type: 'gen', level: 2,
      gen: (R) => {
        const q = R.int(0, 4);
        let p = R.int(0, 6);
        if (p === q) p = q + 2;
        return {
          type: 'mcq',
          prompt: String.raw`Sia $a_n=\dfrac{n+${p}}{n+${q}}$. Quale affermazione è vera?`,
          options: ['Strettamente crescente', 'Strettamente decrescente', 'Costante', 'Non monotona'],
          answer: p < q ? 0 : 1,
          explain: String.raw`Si scrive $a_n=1+\dfrac{${p - q}}{n+${q}}$. Il numeratore $${p - q}$ è ${p < q ? 'negativo, quindi i termini crescono' : 'positivo, quindi i termini decrescono'}.`,
        };
      } },
    { id: 's04.def.p-somma-limitate', type: 'gen', level: 1,
      gen: (R) => {
        const m = R.int(2, 9);
        return {
          type: 'tf',
          prompt: String.raw`Se $|a_n|\le ${m}$ e $|b_n|\le ${m - 1}$ per ogni $n$, allora $|a_n+b_n|\le ${2 * m - 1}$ per ogni $n$.`,
          answer: true,
          explain: String.raw`Per la disuguaglianza triangolare $|a_n+b_n|\le|a_n|+|b_n|\le ${m}+${m - 1}=${2 * m - 1}$.`,
        };
      } },
    { id: 's04.def.q1', type: 'tf', level: 1,
      prompt: String.raw`Ogni successione decrescente è limitata superiormente.`,
      answer: true,
      explain: String.raw`Se $a_n$ è decrescente, $a_n\le a_1$ per ogni $n$: il primo termine è un maggiorante. Non è vero il viceversa: una successione limitata superiormente può non essere decrescente.` },
    { id: 's04.def.q2', type: 'tf', level: 2,
      prompt: String.raw`Ogni successione monotona è limitata.`,
      answer: false,
      explain: String.raw`Falso. $a_n=n^2$ è crescente ma non limitata superiormente. Una monotona è limitata solo se lo è anche dal lato che la monotonia non garantisce.` },
    { id: 's04.def.q3', type: 'num', level: 1,
      prompt: String.raw`Sia $a_n=\dfrac{1}{n}$. Quanto vale $\sup a_n$?`,
      answer: '1',
      explain: String.raw`Il primo termine $a_1=1$ è il massimo, quindi $\sup a_n=1$.` },
    { id: 's04.def.q4', type: 'num', level: 2,
      prompt: String.raw`Sia $a_n=1-\dfrac{1}{n}$. Quanto vale $\inf a_n$?`,
      answer: '0',
      explain: String.raw`La successione è crescente: il primo termine $a_1=0$ è il minimo, e quindi l'inf.` },
    { id: 's04.def.q5', type: 'cloze', level: 1,
      text: String.raw`La successione $a_n=\dfrac1n$ è [[0]] e [[1]].`,
      blanks: [
        { options: ['limitata', 'illimitata'], answer: 0 },
        { options: ['crescente', 'decrescente'], answer: 1 },
      ],
      explain: String.raw`Tutti i termini stanno in $(0,1]$ e diminuiscono al crescere di $n$.` },
    { id: 's04.def.q6', type: 'open', level: 1,
      prompt: String.raw`Definisci successione limitata superiormente e limitata.`,
      answer: String.raw`Una successione $a_n$ è limitata superiormente se esiste $M\in\R$ con $a_n\le M$ per ogni $n$. È limitata se esiste $M>0$ con $|a_n|\le M$ per ogni $n$, cioè se è limitata sia sopra sia sotto.`,
      rubric: ['Esistenza di M valida per ogni n', 'Distinzione tra limitata superiormente e limitata', 'Versione con il valore assoluto'] },
    { id: 's04.def.q7', type: 'mcq', level: 2,
      prompt: String.raw`Quale successione ha $\sup=+\infty$?`,
      options: [String.raw`$a_n=\dfrac1n$`, String.raw`$a_n=(-1)^n$`, String.raw`$a_n=n^2$`, String.raw`$a_n=2-\dfrac1n$`],
      answer: 2,
      explain: String.raw`$n^2$ non è limitata superiormente: il suo sup vale $+\infty$. $\dfrac1n$ e $(-1)^n$ sono limitate, e $2-\dfrac1n<2$ è limitata superiormente.` },
  ],
  flashcards: [
    { id: 's04.def.fc1', kind: 'def', front: String.raw`Successione reale`, back: String.raw`Una funzione $n\mapsto a_n$ definita sugli interi $n\ge n_0$ a valori in $\R$. Il numero $a_n$ è il termine n-esimo.` },
    { id: 's04.def.fc2', kind: 'def', front: String.raw`Proprietà definitivamente`, back: String.raw`Vale **definitivamente** se esiste $N$ tale che vale per ogni $n\ge N$. I termini iniziali non contano.` },
    { id: 's04.def.fc3', kind: 'def', front: String.raw`Successione limitata`, back: String.raw`È limitata se esiste $M>0$ con $|a_n|\le M$ per ogni $n$. Si dice limitata superiormente se esiste $M$ con $a_n\le M$ per ogni $n$.` },
    { id: 's04.def.fc4', kind: 'def', front: String.raw`Successione crescente e strettamente crescente`, back: String.raw`Crescente: $a_{n+1}\ge a_n$ per ogni $n$. Strettamente crescente: $a_{n+1}>a_n$ per ogni $n$. Decrescenti: stesse definizioni con il verso invertito.` },
    { id: 's04.def.fc5', kind: 'def', front: String.raw`Massimo e minimo di una successione`, back: String.raw`$\max a_n=M$ se $M=a_N$ per qualche $N$ e $a_n\le M$ per ogni $n$. Analogamente per il minimo con $\ge$. Se esistono, sono unici.` },
    { id: 's04.def.fc6', kind: 'def', front: String.raw`Sup e inf di una successione`, back: String.raw`$\sup a_n$ è il più piccolo maggiorante; $\inf a_n$ è il più grande minorante. Non sono necessariamente termini della successione.` },
    { id: 's04.def.fc7', kind: 'metodo', front: String.raw`Come si studia la monotonia?`, back: String.raw`Si studia il segno di $a_{n+1}-a_n$. Se i termini sono positivi, si confronta anche $\dfrac{a_{n+1}}{a_n}$ con $1$.` },
    { id: 's04.def.fc8', kind: 'errore', front: String.raw`Errori tipici sulle successioni`, back: String.raw`Limitata non implica convergente: $(-1)^n$. Monotona non implica limitata: $n^2$. Il sup non è sempre un termine: $\dfrac{n}{n+1}$ non raggiunge $1$.` },
  ],
});

// ---------------------------------------------------------------------------
// s04.limiti
// ---------------------------------------------------------------------------
S.push({
  id: 's04.limiti',
  title: 'Limiti di successioni: convergenza, algebra, confronto, unicità',
  summary: String.raw`Saprai verificare un limite con la definizione (con $\varepsilon$ e $N$), calcolare limiti di rapporti di polinomi, riconoscere le forme indeterminate, usare il confronto e dimostrare l'unicità del limite.`,
  prereq: ['s04.def', 's00.esplog'],
  examRefs: ['Itinere 11/11/2025 · B4', 'Appello 15/01/2026 · A1'],
  lessons: [
    {
      id: 's04.limiti.L1',
      title: 'Convergenza e divergenza',
      cards: [
        {
          type: 'learn',
          title: 'L\'idea di limite',
          body: String.raw`Scriviamo $\displaystyle\lim_{n\to+\infty}a_n=L$, o $a_n\to L$, se i termini si avvicinano a $L$ **quanto si vuole**, da un certo punto in poi. Con $\varepsilon>0$ come "precisione":

$$a_n\to L\iff \forall\,\varepsilon>0\ \exists\,N\in\N:\ |a_n-L|<\varepsilon\ \text{ per ogni } n\ge N.$$

Si legge: per ogni precisione $\varepsilon$ esiste un indice $N$ da cui in poi tutti i termini distano da $L$ meno di $\varepsilon$. Se un tale $L$ esiste, la successione **converge** a $L$.

Esempio: $a_n=\dfrac1n\to0$. Dato $\varepsilon$, basta $N>\dfrac1\varepsilon$.`,
          plot: { fns: [{ f: '1', label: 'limite 1' }], x: [0.5, 7], y: [0.5, 2.5], points: [[1, 2], [2, 1.5], [3, 1.3333], [4, 1.25], [5, 1.2], [6, 1.1667]] },
        },
        {
          type: 'example',
          title: 'Verificare un limite con ε',
          problem: String.raw`Sia $a_n=\dfrac{2n+1}{n+1}$. Dimostra con la definizione che $a_n\to2$, trovando $N$ per $\varepsilon=\dfrac1{10}$.`,
          steps: [
            String.raw`Calcolo la distanza dal limite: $a_n-2=\dfrac{2n+1-2(n+1)}{n+1}=\dfrac{-1}{n+1}$.`,
            { text: String.raw`Quindi $|a_n-2|=\dfrac{1}{n+1}$.`,
              ask: { type: 'expr', vars: ['n'], prompt: String.raw`Scrivi $|a_n-2|$ come espressione in $n$, con $n\ge1$.`, answer: '1/(n+1)', explain: String.raw`Il numeratore $-1$ diventa $1$ con il valore assoluto: $|a_n-2|=\dfrac{1}{n+1}$.` } },
            String.raw`Voglio $\dfrac{1}{n+1}<\dfrac{1}{10}$, cioè $n+1>10$, cioè $n>9$.`,
            { text: String.raw`Quindi per ogni $n\ge10$ vale $|a_n-2|<\dfrac1{10}$: $N=10$ va bene.`,
              ask: { type: 'num', prompt: String.raw`Qual è il più piccolo $N$ che va bene per $\varepsilon=\dfrac1{10}$?`, answer: '10', explain: String.raw`Per $n=9$ si ha $|a_9-2|=\dfrac1{10}$, che non è strettamente minore. Da $n=10$ in poi vale.` } },
          ],
          result: String.raw`Per ogni $\varepsilon>0$ si trova $N$ con $\dfrac{1}{n+1}<\varepsilon$ per $n\ge N$: quindi $a_n\to2$.`,
        },
        {
          type: 'learn',
          title: 'Divergenza e irregolarità',
          body: String.raw`Una successione **diverge a $+\infty$** se per ogni $M>0$ esiste $N$ tale che $a_n>M$ per ogni $n\ge N$: i termini superano definitivamente ogni soglia. Si scrive $a_n\to+\infty$. Analogamente $a_n\to-\infty$ se $a_n<-M$ definitivamente.

Una successione che non converge e non diverge a $\pm\infty$ è **irregolare** (o oscillante): non ha limite.

Esempi: $a_n=n^2\to+\infty$. La successione $a_n=(-1)^n$ è irregolare. Anche $a_n=(-1)^n\,n$ è irregolare: i termini pari crescono verso $+\infty$ e quelli dispari verso $-\infty$.`,
        },
        {
          type: 'mcq', level: 1,
          prompt: String.raw`Quale comportamento ha $a_n=(-1)^n\,n$?`,
          options: [String.raw`Converge a $0$`, String.raw`Diverge a $+\infty$`, String.raw`Diverge a $-\infty$`, String.raw`È irregolare: non ha limite`],
          answer: 3,
          explain: String.raw`I termini pari tendono a $+\infty$ e quelli dispari a $-\infty$: non si avvicinano a nessun valore e non restano definitivamente sopra una soglia positiva. Errore tipico: "converge a $0$", pensando a $\dfrac1n$. Il segno alterno rende il limite inesistente.`,
          id: 's04.limiti.L1.e1',
        },
        {
          type: 'num', level: 1,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{n\to+\infty}\dfrac{1}{\sqrt n}$?`,
          answer: '0',
          explain: String.raw`Il denominatore $\sqrt n$ cresce senza limite, quindi la frazione tende a $0$.`,
          id: 's04.limiti.L1.e2',
        },
        {
          type: 'tf', level: 1,
          prompt: String.raw`Se $a_n\to L$, allora $L$ è uguale ad almeno un termine $a_n$.`,
          answer: false,
          explain: String.raw`Falso. Per $a_n=\dfrac1n\to0$ nessun termine vale $0$. Il limite può non essere un termine della successione.`,
          id: 's04.limiti.L1.e3',
        },
        {
          type: 'learn',
          title: 'Il limite dipende dalla coda',
          body: String.raw`Il limite dipende solo dalla **coda** della successione, cioè da quello che succede per $n$ grande. Se due successioni coincidono definitivamente, hanno lo stesso limite (o nessuno dei due). Cambiare i primi $100$ termini non cambia il limite.`,
        },
        {
          type: 'tf', level: 1,
          prompt: String.raw`Cambiando i primi $100$ termini di una successione convergente, il limite non cambia.`,
          answer: true,
          explain: String.raw`Vero: la definizione chiede $|a_n-L|<\varepsilon$ solo da un $N$ in poi. I primi termini possono essere qualsiasi.`,
          id: 's04.limiti.L1.e4',
        },
        {
          type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\left(n^2-3n\right)$ (scrivi inf se diverge a più infinito).`,
          answer: 'inf',
          explain: String.raw`Il termine $n^2$ domina su $3n$ e cresce senza limite: il limite è $+\infty$.`,
          id: 's04.limiti.L1.e5',
        },
        {
          type: 'mcq', level: 2,
          prompt: String.raw`Per $a_n=\dfrac1n$ e $\varepsilon=\dfrac1{100}$, qual è il più piccolo $N$ tale che $|a_n|<\varepsilon$ per ogni $n\ge N$?`,
          options: [String.raw`$N=101$`, String.raw`$N=100$`, String.raw`$N=10$`, String.raw`$N=1000$`],
          answer: 0,
          explain: String.raw`$|a_n|<\dfrac1{100}$ equivale a $n>100$. Per $n=100$ la distanza vale esattamente $\dfrac1{100}$, e la disuguaglianza è stretta: $N=100$ non basta. $N=10$ è troppo piccolo. $N=1000$ funziona, ma non è il più piccolo.`,
          id: 's04.limiti.L1.e6',
        },
        {
          type: 'open', level: 1,
          prompt: String.raw`Scrivi la definizione di limite finito $a_n\to L$ per una successione, usando $\varepsilon$ e $N$.`,
          answer: String.raw`$a_n\to L$ se per ogni $\varepsilon>0$ esiste $N\in\N$ tale che $|a_n-L|<\varepsilon$ per ogni $n\ge N$.`,
          rubric: ["Quantificatori nell'ordine corretto: per ogni ε esiste N", String.raw`Disuguaglianza stretta $|a_n-L|<\varepsilon$`, String.raw`Vale per ogni $n\ge N$`],
          id: 's04.limiti.L1.e7',
        },
      ],
    },
    {
      id: 's04.limiti.L2',
      title: 'Algebra dei limiti, confronto e unicità',
      cards: [
        {
          type: 'learn',
          title: 'Algebra dei limiti',
          body: String.raw`Se $a_n\to L$ e $b_n\to M$ con $L,M\in\R$, allora:

- $a_n+b_n\to L+M$, $\;a_nb_n\to LM$, $\;\lambda a_n\to\lambda L$ per ogni $\lambda\in\R$;
- se $M\ne0$, $\;\dfrac{a_n}{b_n}\to\dfrac{L}{M}$;
- $|a_n|\to|L|$ e, se $a_n\ge0$, $\sqrt{a_n}\to\sqrt L$.

Con i limiti infiniti valgono regole come $+\infty+c=+\infty$ e $c\cdot(+\infty)=+\infty$ per $c>0$, oppure $\dfrac{c}{\pm\infty}=0$.

Restano le **forme indeterminate**: $\infty-\infty$, $0\cdot\infty$, $\dfrac00$, $\dfrac{\infty}{\infty}$, $1^\infty$, $0^0$, $\infty^0$. Per queste il risultato non si può prevedere: bisogna trasformare l'espressione.`,
        },
        {
          type: 'learn',
          title: 'Termine dominante',
          body: String.raw`Per un rapporto di polinomi in $n$ basta guardare i termini di grado più alto. Si divide numeratore e denominatore per la potenza più alta di $n$ che compare.

Siano $a_kn^k$ e $b_hn^h$ i termini di grado massimo di numeratore e denominatore:
- se $k=h$, il limite è $\dfrac{a_k}{b_h}$;
- se $k<h$, il limite è $0$;
- se $k>h$, il limite è $+\infty$ o $-\infty$, secondo il segno di $\dfrac{a_k}{b_h}$.`,
        },
        {
          type: 'example',
          title: 'Limite razionale',
          problem: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\frac{3n^2+n}{n^2+5}$.`,
          steps: [
            String.raw`Divido numeratore e denominatore per $n^2$, la potenza più alta: $\dfrac{3+\dfrac1n}{1+\dfrac{5}{n^2}}$.`,
            { text: String.raw`Per $n\to+\infty$ i termini $\dfrac1n$ e $\dfrac{5}{n^2}$ tendono a $0$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale il limite del numeratore $3+\dfrac1n$?`, answer: '3', explain: String.raw`Il termine $\dfrac1n$ tende a $0$, quindi il numeratore tende a $3$.` } },
            String.raw`Il denominatore tende a $1+0=1$. Per l'algebra dei limiti il quoziente tende a $\dfrac{3}{1}$.`,
          ],
          result: String.raw`$\displaystyle\lim_{n\to+\infty}\frac{3n^2+n}{n^2+5}=3$.`,
        },
        {
          type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{2n^3-n}{4n^3+7}$.`,
          answer: '1/2',
          explain: String.raw`Grado $3$ sia sopra sia sotto: il limite è il rapporto dei coefficienti di grado massimo, $\dfrac{2}{4}=\dfrac12$.`,
          id: 's04.limiti.L2.e1',
        },
        {
          type: 'mcq', level: 1,
          prompt: String.raw`Quale tra queste espressioni è una forma indeterminata?`,
          options: [String.raw`$\dfrac{1}{\infty}$`, String.raw`$\dfrac{\infty}{\infty}$`, String.raw`$\infty+5$`, String.raw`$2\cdot\infty$`],
          answer: 1,
          explain: String.raw`$\dfrac{\infty}{\infty}$ non si può decidere senza studiare i termini. Le altre danno un risultato certo: $\dfrac{1}{\infty}=0$, $\infty+5=\infty$, $2\cdot\infty=\infty$.`,
          id: 's04.limiti.L2.e2',
        },
        {
          type: 'tf', level: 2,
          prompt: String.raw`Se $a_n\to+\infty$ e $b_n\to-\infty$, allora $a_n+b_n\to0$.`,
          answer: false,
          explain: String.raw`Falso: è la forma $\infty-\infty$. Con $a_n=n^2$, $b_n=-n$ la somma tende a $+\infty$; con $a_n=n$, $b_n=-n$ tende a $0$; con $a_n=n$, $b_n=-n-1$ tende a $-1$.`,
          id: 's04.limiti.L2.e3',
        },
        {
          type: 'learn',
          title: 'Teorema del confronto',
          body: String.raw`Il confronto permette di calcolare limiti "a sandwich".

>* **Teorema del confronto.** Se $a_n\le c_n\le b_n$ definitivamente e $a_n\to L$, $b_n\to L$, allora $c_n\to L$.

Caso utile: se $|c_n|\le b_n$ e $b_n\to0$, allora $c_n\to0$. Ad esempio $\left|\dfrac{\sin n}{n}\right|\le\dfrac1n\to0$.

>! Il confronto richiede la disuguaglianza valida definitivamente, non solo per qualche $n$.`,
        },
        {
          type: 'example',
          title: 'Confronto con il seno',
          problem: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{\sin n}{n}$.`,
          steps: [
            String.raw`Il seno è limitato: $-1\le\sin n\le1$ per ogni $n$.`,
            { text: String.raw`Dividendo per $n>0$: $-\dfrac1n\le\dfrac{\sin n}{n}\le\dfrac1n$.`,
              ask: { type: 'mcq', prompt: String.raw`Quanto vale il limite di $-\dfrac1n$ per $n\to+\infty$?`, options: [String.raw`$0$`, String.raw`$-1$`, String.raw`$-\infty$`, 'non esiste'], answer: 0, explain: String.raw`Il numeratore è costante e il denominatore cresce senza limite: la frazione tende a $0$.` } },
            String.raw`Entrambi i bordi tendono a $0$: per il teorema del confronto $\dfrac{\sin n}{n}\to0$.`,
          ],
          result: String.raw`$\displaystyle\lim_{n\to+\infty}\frac{\sin n}{n}=0$.`,
        },
        {
          type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{\cos n}{n^2+1}$.`,
          answer: '0',
          explain: String.raw`Poiché $|\cos n|\le1$, si ha $\left|\dfrac{\cos n}{n^2+1}\right|\le\dfrac{1}{n^2+1}\to0$: per il confronto il limite è $0$.`,
          id: 's04.limiti.L2.e4',
        },
        {
          type: 'order', level: 2,
          prompt: String.raw`Riordina i passi della dimostrazione: se $a_n\to L_1$ e $a_n\to L_2$, allora $L_1=L_2$.`,
          steps: [
            String.raw`Sia $\varepsilon>0$ arbitrario.`,
            String.raw`Per la definizione di limite esistono $N_1$ e $N_2$ tali che $|a_n-L_1|<\varepsilon$ per $n\ge N_1$ e $|a_n-L_2|<\varepsilon$ per $n\ge N_2$.`,
            String.raw`Per $n\ge\max(N_1,N_2)$ vale $|L_1-L_2|\le|L_1-a_n|+|a_n-L_2|<2\varepsilon$.`,
            String.raw`Poiché $\varepsilon$ è arbitrario, $|L_1-L_2|=0$, cioè $L_1=L_2$.`,
          ],
          distractors: [
            String.raw`Per $n\ge\max(N_1,N_2)$ vale $|L_1-L_2|\ge|a_n-L_1|+|a_n-L_2|$, quindi $|L_1-L_2|$ è grande.`,
            String.raw`Si ha $L_1-L_2=(a_n-L_2)-(a_n-L_1)$, quindi $L_1-L_2=0$ già per $n=1$.`,
          ],
          explain: String.raw`La disuguaglianza triangolare e la scelta di un $\varepsilon$ arbitrario sono i passi chiave. Il primo distrattore inverte la disuguaglianza triangolare. Il secondo ricava $L_1=L_2$ da un'identità valida per ogni $n$, ma l'identità non basta: serve che le distanze siano piccole da un certo $N$ in poi.`,
          id: 's04.limiti.L2.e5',
        },
        {
          type: 'open', level: 3,
          prompt: String.raw`Enuncia e dimostra il teorema di unicità del limite per le successioni.`,
          answer: String.raw`Se $a_n\to L_1$ e $a_n\to L_2$, allora $L_1=L_2$. Dimostrazione: fissato $\varepsilon>0$, per $n\ge\max(N_1,N_2)$ si ha $|L_1-L_2|\le|L_1-a_n|+|a_n-L_2|<2\varepsilon$. Poiché $\varepsilon$ è arbitrario, $|L_1-L_2|=0$.`,
          rubric: ['Enunciato corretto: se il limite esiste, è unico', String.raw`Uso della disuguaglianza triangolare con $2\varepsilon$`, String.raw`Conclusione $L_1=L_2$ dall'arbitrarietà di $\varepsilon$`],
          source: 'Appello 15/01/2026 · A1',
          id: 's04.limiti.L2.e6',
        },
        {
          type: 'tf', level: 2,
          prompt: String.raw`Se $a_n\to L$ con $L>0$, allora $a_n>0$ definitivamente.`,
          answer: true,
          explain: String.raw`Vero. Con $\varepsilon=\dfrac L2$ si ha $|a_n-L|<\dfrac L2$ da un certo $N$ in poi, quindi $a_n>L-\dfrac L2=\dfrac L2>0$. Se invece $L=0$, il confronto con il segno non dà informazioni.`,
          id: 's04.limiti.L2.e7',
        },
        {
          type: 'problem', level: 3,
          prompt: String.raw`Calcola i limiti delle successioni $a_n=\dfrac{\log(n^2+1)}{\sqrt n}$, $b_n=\left(1+\dfrac3n\right)^{n/2}$ e $c_n=n\left(\sqrt{1+\dfrac2n}-1\right)$.`,
          parts: [
            { type: 'num', prompt: 'Limite di $a_n$.', answer: '0', explain: String.raw`Il logaritmo cresce più lentamente di ogni potenza positiva di $n$: il rapporto con $\sqrt n$ tende a $0$.` },
            { type: 'num', prompt: 'Limite di $b_n$.', answer: 'e^(3/2)', explain: String.raw`Scrivo $b_n=\left[\left(1+\dfrac3n\right)^n\right]^{1/2}$. Dentro la parentesi il limite notevole dà $e^3$, quindi $b_n\to\left(e^3\right)^{1/2}=e^{3/2}$.` },
            { type: 'num', prompt: 'Limite di $c_n$.', answer: '1', explain: String.raw`Razionalizzando: $c_n=\dfrac{2}{\sqrt{1+\frac2n}+1}\to\dfrac22=1$.` },
          ],
          solution: String.raw`$a_n\to0$; $b_n\to e^{3/2}$; $c_n\to1$. Per $c_n$ si moltiplica e si divide per il coniugato: $c_n=n\cdot\dfrac{2/n}{\sqrt{1+2/n}+1}=\dfrac{2}{\sqrt{1+2/n}+1}$.`,
          id: 's04.limiti.L2.e8',
        },
      ],
    },
  ],
  practice: [
    { id: 's04.limiti.p-razionale', type: 'gen', level: 2,
      gen: (R) => {
        const p = R.nz(-6, 6), s = R.nz(-6, 6), q = R.int(-5, 5), r = R.int(-5, 5), t = R.nz(-5, 5);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{${H.poly([p, q, r], 'n')}}{${H.poly([s, t], 'n')}}$.`,
          answer: `(${p})/(${s})`,
          explain: String.raw`Il termine di grado massimo domina: numeratore $${p}n^{2}$, denominatore $${s}n^{2}$. Il limite è $\dfrac{${p}}{${s}}$.`,
        };
      } },
    { id: 's04.limiti.p-grado', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-5, 5), b = R.nz(-5, 5), c = R.nz(-4, 4);
        const k = R.pick([1, 2, 3]);
        const h = R.pick([1, 2, 3].filter((x) => x !== k));
        const pw = (e) => (e === 1 ? 'n' : `n^{${e}}`);
        const ans = k < h ? '0' : (a / b > 0 ? 'inf' : '-inf');
        const verso = a / b > 0 ? '+\\infty' : '-\\infty';
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{${H.coef(a)}${pw(k)}${H.signed(c)}}{${H.coef(b)}${pw(h)}+1}$ (scrivi inf o -inf se diverge).`,
          answer: ans,
          explain: k < h
            ? String.raw`Il denominatore ha grado $${h}$, superiore a quello del numeratore ($${k}$): il limite è $0$.`
            : String.raw`Il numeratore ha grado $${k}$, superiore a quello del denominatore ($${h}$): il rapporto tende a $${verso}$.`,
        };
      } },
    { id: 's04.limiti.p-eps', type: 'gen', level: 1,
      gen: (R) => {
        const k = R.int(2, 20);
        return {
          type: 'num',
          prompt: String.raw`Per $a_n=\dfrac1n$ e $\varepsilon=\dfrac{1}{${k}}$, qual è il più piccolo $N$ tale che $|a_n|<\varepsilon$ per ogni $n\ge N$?`,
          answer: String(k + 1),
          explain: String.raw`$|a_n|<\dfrac{1}{${k}}$ equivale a $n>${k}$. Per $n=${k}$ la distanza vale esattamente $\dfrac{1}{${k}}$, non è strettamente minore. Il primo $N$ che va bene è $${k + 1}$.`,
        };
      } },
    { id: 's04.limiti.p1', type: 'mcq', level: 2,
      prompt: String.raw`Quanto vale $\displaystyle\lim_{n\to+\infty}\dfrac{n^2+n}{n+1}$?`,
      options: [String.raw`$1$`, String.raw`$+\infty$`, String.raw`$0$`, 'non esiste'],
      answer: 1,
      explain: String.raw`$\dfrac{n^2+n}{n+1}=\dfrac{n(n+1)}{n+1}=n\to+\infty$. Errore tipico: rispondere $1$ confrontando solo i termini $\dfrac{n^2}{n^2}$, ma il denominatore ha grado $1$, non $2$.` },
    { id: 's04.limiti.p2', type: 'num', level: 1,
      prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{3n-1}{n+4}$.`,
      answer: '3',
      explain: String.raw`Grado $1$ sopra e sotto: il limite è $\dfrac31=3$.` },
    { id: 's04.limiti.p3', type: 'tf', level: 1,
      prompt: String.raw`Ogni successione divergente a $+\infty$ è illimitata superiormente.`,
      answer: true,
      explain: String.raw`Se $a_n\to+\infty$, da un certo punto in poi $a_n$ supera qualunque $M$. Quindi non può essere limitata superiormente.` },
    { id: 's04.limiti.p4', type: 'tf', level: 2,
      prompt: String.raw`Se $a_n\to0$ e $b_n$ è limitata, allora $a_nb_n\to0$.`,
      answer: true,
      explain: String.raw`Se $|b_n|\le M$, allora $|a_nb_n|\le M|a_n|\to0$. Per il confronto $a_nb_n\to0$.` },
    { id: 's04.limiti.p5', type: 'match', level: 1,
      prompt: 'Abbina ogni successione al suo limite.',
      pairs: [
        [String.raw`$a_n=\dfrac{n+1}{n}$`, String.raw`$1$`],
        [String.raw`$a_n=\sqrt n$`, String.raw`$+\infty$`],
        [String.raw`$a_n=\dfrac{(-1)^n}{n}$`, String.raw`$0$`],
      ],
      explain: String.raw`$\dfrac{n+1}{n}=1+\dfrac1n\to1$. $\sqrt n$ cresce senza limite. $\dfrac{(-1)^n}{n}$ tende a $0$ per il confronto con $\dfrac1n$.` },
    { id: 's04.limiti.p6', type: 'cloze', level: 1,
      text: String.raw`La successione $a_n=\dfrac{(-1)^n}{n}$ è [[0]] a $0$, mentre $a_n=(-1)^n$ è [[1]].`,
      blanks: [
        { options: ['convergente', 'irregolare'], answer: 0 },
        { options: ['convergente', 'irregolare'], answer: 1 },
      ],
      explain: String.raw`Il valore assoluto $\dfrac1n$ tende a $0$, quindi la successione converge a $0$. La successione $(-1)^n$ oscilla tra $-1$ e $1$: è irregolare.` },
    { id: 's04.limiti.p7', type: 'open', level: 2,
      prompt: String.raw`Dimostra con la definizione che $\dfrac1n\to0$.`,
      answer: String.raw`Fissato $\varepsilon>0$, scelgo $N>\dfrac1\varepsilon$ (esiste per la proprietà archimedea). Per $n\ge N$ si ha $\left|\dfrac1n-0\right|=\dfrac1n\le\dfrac1N<\varepsilon$.`,
      rubric: ['Scelta esplicita di N in funzione di ε', 'Uso della proprietà archimedea', String.raw`Stima $\dfrac1n<\varepsilon$ per ogni $n\ge N$`] },
    { id: 's04.limiti.p8', type: 'mcq', level: 1,
      prompt: 'Quale successione è irregolare?',
      options: [String.raw`$\dfrac1n$`, String.raw`$\dfrac{n}{n+1}$`, String.raw`$(-1)^n$`, String.raw`$\sqrt n$`],
      answer: 2,
      explain: String.raw`$\dfrac1n\to0$, $\dfrac{n}{n+1}\to1$, $\sqrt n\to+\infty$: sono tutte regolari. $(-1)^n$ oscilla tra $-1$ e $1$ senza limite.` },
    { id: 's04.limiti.p9', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{\log n}{n}$.`,
      answer: '0',
      explain: String.raw`Il logaritmo cresce più lentamente di ogni potenza positiva di $n$: il rapporto tende a $0$.` },
    { id: 's04.limiti.p10', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\left(\sqrt{n+1}-\sqrt n\right)$.`,
      answer: '0',
      explain: String.raw`Razionalizzando: $\sqrt{n+1}-\sqrt n=\dfrac{1}{\sqrt{n+1}+\sqrt n}\to0$.` },
  ],
  flashcards: [
    { id: 's04.limiti.fc1', kind: 'def', front: String.raw`Successione convergente (definizione con ε)`, back: String.raw`$a_n\to L$ se per ogni $\varepsilon>0$ esiste $N$ tale che $|a_n-L|<\varepsilon$ per ogni $n\ge N$.` },
    { id: 's04.limiti.fc2', kind: 'def', front: String.raw`Divergenza a $+\infty$`, back: String.raw`$a_n\to+\infty$ se per ogni $M>0$ esiste $N$ tale che $a_n>M$ per ogni $n\ge N$. Analogamente per $-\infty$.` },
    { id: 's04.limiti.fc3', kind: 'def', front: String.raw`Successione irregolare`, back: String.raw`Una successione che non converge e non diverge a $\pm\infty$. Non ha limite. Esempio: $(-1)^n$.` },
    { id: 's04.limiti.fc4', kind: 'thm', front: String.raw`Teorema di unicità del limite`, back: String.raw`Se $a_n\to L_1$ e $a_n\to L_2$, allora $L_1=L_2$. Il limite di una successione, se esiste, è unico.` },
    { id: 's04.limiti.fc5', kind: 'dim', front: String.raw`Idea della dimostrazione dell'unicità`, back: String.raw`Fisso $\varepsilon>0$. Da un certo $N$ in poi, $a_n$ dista meno di $\varepsilon$ sia da $L_1$ sia da $L_2$. Per la disuguaglianza triangolare $|L_1-L_2|<2\varepsilon$. Poiché $\varepsilon$ è arbitrario, $L_1=L_2$.` },
    { id: 's04.limiti.fc6', kind: 'thm', front: String.raw`Permanenza del segno`, back: String.raw`Se $a_n\to L$ con $L>0$, allora $a_n>0$ definitivamente. Analogamente per $L<0$. Se $L=0$ non si conclude nulla sul segno.` },
    { id: 's04.limiti.fc7', kind: 'thm', front: String.raw`Teorema del confronto`, back: String.raw`Se $a_n\le c_n\le b_n$ definitivamente e $a_n\to L$, $b_n\to L$, allora $c_n\to L$.` },
    { id: 's04.limiti.fc8', kind: 'thm', front: String.raw`Successioni convergenti sono limitate`, back: String.raw`Se $a_n\to L$ finito, esiste $M$ con $|a_n|\le M$ per ogni $n$: i termini definitivamente stanno in $(L-1,L+1)$, e i finitamente molti restanti sono limitati. Il viceversa è falso: $(-1)^n$.` },
    { id: 's04.limiti.fc9', kind: 'metodo', front: String.raw`Limite di un rapporto di polinomi`, back: String.raw`Si divide per la potenza più alta di $n$. Il limite dipende solo dai termini di grado massimo: stesso grado, rapporto dei coefficienti; grado maggiore sopra, $\pm\infty$; grado maggiore sotto, $0$.` },
    { id: 's04.limiti.fc10', kind: 'errore', front: String.raw`Forme indeterminate`, back: String.raw`$\infty-\infty$, $0\cdot\infty$, $\dfrac00$, $\dfrac\infty\infty$, $1^\infty$, $0^0$, $\infty^0$. Non si può concludere subito: bisogna trasformare l'espressione.` },
  ],
});

// ---------------------------------------------------------------------------
// s04.monotone
// ---------------------------------------------------------------------------
S.push({
  id: 's04.monotone',
  title: 'Successioni monotone e limitate, numero e, gerarchia degli infiniti',
  summary: String.raw`Saprai applicare il teorema di convergenza monotona, calcolare limiti con il numero di Nepero e confrontare la velocità di crescita di potenze, esponenziali e fattoriali.`,
  prereq: ['s04.limiti', 's01.supinf'],
  examRefs: ['Itinere 11/11/2025 · B4'],
  lessons: [
    {
      id: 's04.monotone.L1',
      title: 'Monotone e limitate convergono',
      cards: [
        {
          type: 'learn',
          title: 'L\'idea',
          body: String.raw`Una successione **crescente** e **limitata superiormente** non può crescere all'infinito: i termini salgono ma restano sotto un maggiorante. Allora si fermano vicino a un valore fisso, che è il loro limite. Per esempio $a_n=1-\dfrac1n$ dà $0,\ \dfrac12,\ \dfrac23,\ \dfrac34,\dots$: i termini si avvicinano a $1$, che è il suo sup.

Per le successioni **decrescenti** e limitate inferiormente il ragionamento è identico: il limite è l'inf.`,
          plot: { fns: [{ f: '1', label: 'sup = 1' }], x: [0.5, 7], y: [-0.2, 1.3], hlines: [1], points: [[1, 0], [2, 0.5], [3, 0.6667], [4, 0.75], [5, 0.8], [6, 0.8333]] },
        },
        {
          type: 'learn',
          title: 'Teorema di convergenza monotona',
          body: String.raw`Il teorema garantisce che il limite esiste, anche senza calcolarlo.

>* **Teorema (convergenza monotona).** Ogni successione monotona e limitata è convergente. Se $a_n$ è crescente e limitata superiormente, allora $\lim a_n=\sup a_n$. Se è decrescente e limitata inferiormente, allora $\lim a_n=\inf a_n$.

Entrambe le ipotesi servono. $a_n=n$ è monotona ma non limitata. $a_n=(-1)^n$ è limitata ma non monotona: in entrambi i casi il teorema non si applica.`,
        },
        {
          type: 'order', level: 2,
          prompt: String.raw`Riordina i passi della dimostrazione: se $a_n$ è crescente e limitata superiormente, allora $a_n\to\sup a_n$.`,
          steps: [
            String.raw`Sia $S=\sup a_n$, che esiste per la limitatezza superiore e la completezza di $\R$.`,
            String.raw`Fisso $\varepsilon>0$. Poiché $S-\varepsilon$ non è un maggiorante, esiste $N$ con $a_N>S-\varepsilon$.`,
            String.raw`Per $n\ge N$, la monotonia dà $a_n\ge a_N>S-\varepsilon$; inoltre $a_n\le S$ perché $S$ è un maggiorante.`,
            String.raw`Quindi $|a_n-S|<\varepsilon$ per ogni $n\ge N$: cioè $a_n\to S$.`,
          ],
          distractors: [
            String.raw`Per $n\ge N$ vale $a_n\ge S+\varepsilon$, quindi $a_n$ supera il sup.`,
            String.raw`Poiché $a_n$ è crescente, il suo limite è $\inf a_n$ per ogni $\varepsilon$.`,
          ],
          explain: String.raw`Il punto chiave è il passo 2: il sup può non essere raggiunto, ma per ogni $\varepsilon$ c'è un termine oltre $S-\varepsilon$. Il primo distrattore contraddice il fatto che $S$ è un maggiorante. Il secondo confonde sup e inf: per una successione crescente l'inf è il primo termine.`,
          id: 's04.monotone.L1.e1',
        },
        {
          type: 'example',
          title: 'Successione ricorsiva',
          problem: String.raw`Sia $a_1=1$ e $a_{n+1}=\sqrt{2+a_n}$. Dimostra che $a_n$ converge e calcolane il limite.`,
          steps: [
            String.raw`**Limitatezza.** Vale $0<a_n<2$ per ogni $n$. Infatti $a_1=1$; se $0<a_n<2$, allora $a_{n+1}=\sqrt{2+a_n}>0$ e $a_{n+1}<\sqrt4=2$.`,
            { text: String.raw`**Monotonia.** $a_{n+1}>a_n$ equivale a $\sqrt{2+a_n}>a_n$, cioè a $2+a_n>a_n^2$, cioè a $(a_n-2)(a_n+1)<0$.`,
              ask: { type: 'mcq', prompt: String.raw`Per $0<a_n<2$, il segno di $(a_n-2)(a_n+1)$ è:`, options: ['positivo', 'negativo', 'nullo', 'dipende da $n$'], answer: 1, explain: String.raw`$a_n-2<0$ e $a_n+1>0$, quindi il prodotto è negativo: la successione è crescente.` } },
            String.raw`La successione è crescente e limitata: per il teorema di convergenza monotona converge a un limite $L$.`,
            { text: String.raw`Passando al limite in $a_{n+1}=\sqrt{2+a_n}$ si ottiene $L=\sqrt{2+L}$, cioè $L^2-L-2=0$.`,
              ask: { type: 'num', prompt: String.raw`Quale valore **positivo** di $L$ verifica $L^2-L-2=0$?`, answer: '2', explain: String.raw`$L^2-L-2=(L-2)(L+1)=0$ dà $L=2$ oppure $L=-1$. Poiché $a_n>0$, si ha $L\ge0$: quindi $L=2$.` } },
          ],
          result: String.raw`$a_n$ converge e $\displaystyle\lim_{n\to+\infty}a_n=2$.`,
        },
        {
          type: 'mcq', level: 2,
          prompt: String.raw`La successione $a_n=n^2$ è monotona. Cosa si può dire del suo limite?`,
          options: [String.raw`Converge a $0$.`, String.raw`Diverge a $+\infty$.`, String.raw`Converge a $1$.`, String.raw`Il teorema dice che converge a $\sup a_n$.`],
          answer: 1,
          explain: String.raw`$a_n=n^2$ è crescente ma non limitata superiormente: il teorema non si applica, e la successione diverge a $+\infty$. L'ultima opzione è sbagliata: il teorema richiede la limitatezza.`,
          id: 's04.monotone.L1.e2',
        },
        {
          type: 'tf', level: 1,
          prompt: String.raw`Ogni successione monotona è convergente.`,
          answer: false,
          explain: String.raw`Falso. $a_n=n$ è crescente ma diverge a $+\infty$. Il teorema richiede anche la limitatezza.`,
          id: 's04.monotone.L1.e3',
        },
        {
          type: 'num', level: 1,
          prompt: String.raw`Sia $a_n=\dfrac{n}{n+1}$, crescente e limitata. Quanto vale $\displaystyle\lim_{n\to+\infty}a_n$?`,
          answer: '1',
          explain: String.raw`Per il teorema il limite è $\sup a_n=1$, che non viene raggiunto da nessun termine.`,
          id: 's04.monotone.L1.e4',
        },
        {
          type: 'tf', level: 2,
          prompt: String.raw`Se $a_n$ è decrescente e limitata inferiormente, allora $a_n$ converge a $\inf a_n$.`,
          answer: true,
          explain: String.raw`È la versione del teorema per le successioni decrescenti: il limite è l'estremo inferiore.`,
          id: 's04.monotone.L1.e5',
        },
        {
          type: 'open', level: 3,
          prompt: String.raw`Enuncia e dimostra il teorema di convergenza monotona nel caso delle successioni crescenti e limitate superiormente.`,
          answer: String.raw`Sia $a_n$ crescente e limitata superiormente, e $S=\sup a_n$. Fissato $\varepsilon>0$, $S-\varepsilon$ non è un maggiorante, quindi esiste $N$ con $a_N>S-\varepsilon$. Per $n\ge N$ si ha $S-\varepsilon<a_N\le a_n\le S$, dunque $|a_n-S|<\varepsilon$: quindi $a_n\to S$.`,
          rubric: ['Ipotesi: crescente e limitata superiormente', String.raw`Uso di $S=\sup a_n$ e della caratterizzazione del sup con $\varepsilon$`, String.raw`Monotonia per $n\ge N$ e conclusione $|a_n-S|<\varepsilon$`],
          id: 's04.monotone.L1.e6',
        },
      ],
    },
    {
      id: 's04.monotone.L2',
      title: 'Il numero di Nepero',
      cards: [
        {
          type: 'learn',
          title: 'Il numero e',
          body: String.raw`La successione $a_n=\left(1+\dfrac1n\right)^n$ è crescente e limitata (per esempio da $3$ sopra): converge per il teorema di convergenza monotona. Il suo limite si indica con $e$:

$$e=\lim_{n\to+\infty}\left(1+\frac1n\right)^n\approx2{,}718\ldots$$

Il numero $e$ è irrazionale. Qualche valore: $a_1=2$, $a_2=\dfrac94=2{,}25$, $a_{10}\approx2{,}594$.`,
        },
        {
          type: 'learn',
          title: 'Limiti notevoli di successioni',
          body: String.raw`Con $k$ e $m$ reali fissati:

$$\left(1+\frac{k}{n}\right)^{n}\to e^{k},\qquad \left(1+\frac{k}{n}\right)^{mn}\to e^{km},\qquad n\log\left(1+\frac1n\right)\to1.$$

Metodo per le forme $1^\infty$: si scrive $f_n^{\,g_n}=e^{\,g_n\log f_n}$ e si calcola il limite dell'esponente $g_n\log f_n$. Se l'esponente tende a $L$, il limite è $e^L$.

>! Errore tipico: $\left(1+\dfrac kn\right)^{n^2}$ **non** tende a $e^k$. Qui l'esponente cresce troppo: il limite è $+\infty$ se $k>0$.`,
        },
        {
          type: 'example',
          title: 'Limite con esponente',
          problem: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\left(1-\dfrac2n\right)^{3n}$.`,
          steps: [
            String.raw`La base tende a $1$ e l'esponente a $+\infty$: è la forma $1^\infty$. Riscrivo l'esponente come $n\cdot3$.`,
            { text: String.raw`$\left(1-\dfrac2n\right)^{3n}=\left[\left(1-\dfrac2n\right)^{n}\right]^{3}$, e la parentesi tende, per il limite notevole, a $e^{-2}$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $\displaystyle\lim_{n\to+\infty}\left(1-\dfrac2n\right)^n$?`, answer: 'e^(-2)', explain: String.raw`È il limite notevole $\left(1+\dfrac kn\right)^n\to e^k$ con $k=-2$.` } },
            String.raw`Elevando a $3$: $\left(e^{-2}\right)^3=e^{-6}$.`,
          ],
          result: String.raw`$\displaystyle\lim_{n\to+\infty}\left(1-\dfrac2n\right)^{3n}=e^{-6}$.`,
        },
        {
          type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{n\to+\infty}\left(1+\dfrac1n\right)^{2n}$?`,
          options: [String.raw`$e$`, String.raw`$e^2$`, String.raw`$2e$`, String.raw`$1$`],
          answer: 1,
          explain: String.raw`$\left(1+\dfrac1n\right)^{2n}=\left[\left(1+\dfrac1n\right)^n\right]^2\to e^2$. Errore: $e$ dimentica l'esponente $2$; $2e$ moltiplica invece di elevare; $1$ pensa che la base tenda a $1$ e basti.`,
          id: 's04.monotone.L2.e1',
        },
        {
          type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\left(1-\dfrac1n\right)^{n}$.`,
          answer: 'e^(-1)',
          explain: String.raw`Limite notevole con $k=-1$: il risultato è $e^{-1}=\dfrac1e$.`,
          id: 's04.monotone.L2.e2',
        },
        {
          type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}n\log\left(1+\dfrac1n\right)$.`,
          answer: '1',
          explain: String.raw`$n\log\left(1+\dfrac1n\right)=\log\left[\left(1+\dfrac1n\right)^n\right]\to\log e=1$, per la continuità del logaritmo.`,
          id: 's04.monotone.L2.e3',
        },
        {
          type: 'tf', level: 1,
          prompt: String.raw`La successione $\left(1+\dfrac1n\right)^n$ è decrescente.`,
          answer: false,
          explain: String.raw`È crescente: parte da $2$ e converge a $e\approx2{,}718$ senza superarlo.`,
          id: 's04.monotone.L2.e4',
        },
        {
          type: 'mcq', level: 2,
          prompt: String.raw`Quale successione converge a $e^2$?`,
          options: [String.raw`$\left(1+\dfrac1n\right)^{n}$`, String.raw`$\left(1+\dfrac2n\right)^{n}$`, String.raw`$\left(1+\dfrac1n\right)^{n^2}$`, String.raw`$\left(1-\dfrac1n\right)^{n}$`],
          answer: 1,
          explain: String.raw`$\left(1+\dfrac2n\right)^{n}\to e^2$ con $k=2$. Il primo tende a $e$; il terzo a $+\infty$, perché l'esponente $n^2$ è troppo grande; il quarto a $e^{-1}$.`,
          id: 's04.monotone.L2.e5',
        },
        {
          type: 'problem', level: 3,
          prompt: String.raw`Calcola i limiti delle successioni $a_n=\left(1+\dfrac3n\right)^{2n}$, $b_n=n\log\left(1+\dfrac1n\right)$, $c_n=\left(1-\dfrac2n\right)^{n}$ e $d_n=\left(\dfrac{n+2}{n}\right)^{n}$.`,
          parts: [
            { type: 'num', prompt: 'Limite di $a_n$.', answer: 'e^6', explain: String.raw`Con $k=3$ e esponente $2n$: $a_n\to e^{3\cdot2}=e^6$.` },
            { type: 'num', prompt: 'Limite di $b_n$.', answer: '1', explain: String.raw`$b_n=\log\left[\left(1+\dfrac1n\right)^n\right]\to\log e=1$.` },
            { type: 'num', prompt: 'Limite di $c_n$.', answer: 'e^(-2)', explain: String.raw`Limite notevole con $k=-2$: $c_n\to e^{-2}$.` },
            { type: 'num', prompt: 'Limite di $d_n$.', answer: 'e^2', explain: String.raw`$d_n=\left(1+\dfrac2n\right)^n\to e^2$, con $k=2$.` },
          ],
          solution: String.raw`$a_n\to e^6$; $b_n\to1$; $c_n\to e^{-2}$; $d_n\to e^2$. Nei casi con base $1+\frac kn$ si riconosce il limite notevole, con esponente $n$ o un multiplo di $n$.`,
          id: 's04.monotone.L2.e6',
        },
        {
          type: 'open', level: 2,
          prompt: String.raw`Spiega perché la successione $\left(1+\dfrac1n\right)^n$ converge, enunciando i teoremi usati.`,
          answer: String.raw`La successione è crescente (lo si verifica con il binomio di Newton) e limitata superiormente, per esempio da $3$. Per il teorema di convergenza monotona converge; il suo limite si chiama $e$.`,
          rubric: ['Monotonia crescente', 'Limitatezza superiore, per esempio da 3', 'Applicazione del teorema di convergenza monotona'],
          id: 's04.monotone.L2.e7',
        },
      ],
    },
    {
      id: 's04.monotone.L3',
      title: 'Gerarchia degli infiniti e b^n/n!',
      cards: [
        {
          type: 'learn',
          title: 'Chi cresce più in fretta',
          body: String.raw`Per $n\to+\infty$ alcune successioni crescono più in fretta di altre. Ecco la gerarchia, in cui ogni termine è trascurabile rispetto a quello successivo:

$$\log n\ \ll\ n^{\alpha}\ \ll\ b^{n}\ \ll\ n!\ \ll\ n^{n}\qquad(\alpha>0,\ b>1).$$

Quindi un logaritmo è trascurabile rispetto a una potenza di $n$; una potenza è trascurabile rispetto a un'esponenziale; un'esponenziale è trascurabile rispetto al fattoriale. Il simbolo $\ll$ significa: il rapporto tende a $0$.`,
        },
        {
          type: 'learn',
          title: 'Regola pratica',
          body: String.raw`Nel limite di un rapporto domina il termine più "veloce" della gerarchia:
- se il numeratore è trascurabile, il limite è $0$;
- se il denominatore è trascurabile, il limite è $\pm\infty$, secondo il segno.

Esempio: $\dfrac{n^{10}}{1.1^n}\to0$, perché l'esponenziale vince su ogni potenza.

>! Attenzione: "vince" vale **definitivamente**. Per $n$ piccolo una potenza grande può sembrare più grande: $n^{100}$ supera $2^n$ per molti valori di $n$, ma da un certo punto in poi $2^n$ lo supera per sempre.`,
        },
        {
          type: 'example',
          title: 'Confronto tra esponenziali',
          problem: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{3^n+n^4}{2^n+n^3}$.`,
          steps: [
            String.raw`Al numeratore domina $3^n$: un'esponenziale vince su ogni potenza. Al denominatore domina $2^n$.`,
            { text: String.raw`Divido per $2^n$: $\dfrac{3^n+n^4}{2^n+n^3}=\dfrac{\left(\frac32\right)^n+\frac{n^4}{2^n}}{1+\frac{n^3}{2^n}}$.`,
              ask: { type: 'mcq', prompt: String.raw`Per $n\to+\infty$, $\dfrac{n^4}{2^n}$ tende a:`, options: [String.raw`$0$`, String.raw`$+\infty$`, String.raw`$1$`, String.raw`$\frac12$`], answer: 0, explain: String.raw`La potenza è trascurabile rispetto all'esponenziale $2^n$: il rapporto tende a $0$.` } },
            String.raw`Il numeratore tende a $+\infty$ perché $\left(\frac32\right)^n\to+\infty$; il denominatore tende a $1$.`,
          ],
          result: String.raw`$\displaystyle\lim_{n\to+\infty}\dfrac{3^n+n^4}{2^n+n^3}=+\infty$.`,
        },
        {
          type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{n^{10}}{1.1^{n}}$.`,
          answer: '0',
          explain: String.raw`L'esponenziale $1.1^n$ vince su ogni potenza di $n$, anche su $n^{10}$. Il rapporto tende a $0$.`,
          id: 's04.monotone.L3.e1',
        },
        {
          type: 'mcq', level: 1,
          prompt: String.raw`Quale successione cresce più in fretta per $n\to+\infty$?`,
          options: [String.raw`$n^{100}$`, String.raw`$2^n$`, String.raw`$n!$`, String.raw`$\log n$`],
          answer: 2,
          explain: String.raw`$n!$ supera $2^n$ definitivamente, che a sua volta supera ogni potenza di $n$. Il logaritmo cresce più lentamente di tutte. Errore tipico: scegliere $n^{100}$ perché l'esponente è grande; questo vale solo per $n$ piccoli.`,
          id: 's04.monotone.L3.e2',
        },
        {
          type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{n^2+\log n}{n^2+2^n}$.`,
          answer: '0',
          explain: String.raw`Il denominatore è dominato da $2^n$, mentre il numeratore cresce come $n^2$: il rapporto tende a $0$.`,
          id: 's04.monotone.L3.e3',
        },
        {
          type: 'learn',
          title: 'Il limite di b^n/n!',
          body: String.raw`Per ogni $b>0$ vale
$$\frac{b^n}{n!}\to0.$$

Idea: il rapporto tra due termini consecutivi è
$$\frac{b^{n+1}/(n+1)!}{b^n/n!}=\frac{b}{n+1}.$$
Questo è $<\dfrac12$ definitivamente (basta $n+1>2b$). Quindi da un certo $N$ in poi ogni termine è meno della metà del precedente, e la successione è al più $C\,2^{-n}$, che tende a $0$.`,
        },
        {
          type: 'mcq', level: 2,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{n\to+\infty}\dfrac{5^n}{n!}$?`,
          options: [String.raw`$0$`, String.raw`$+\infty$`, String.raw`$5$`, String.raw`$1$`],
          answer: 0,
          explain: String.raw`Il fattoriale vince su ogni esponenziale: $\dfrac{5^n}{n!}\to0$. Errore tipico: $+\infty$, perché $5^n$ sembra grande; ma $n!$ cresce più in fretta.`,
          id: 's04.monotone.L3.e4',
        },
        {
          type: 'tf', level: 2,
          prompt: String.raw`La successione $\dfrac{n!}{n^n}$ tende a $0$.`,
          answer: true,
          explain: String.raw`Vero: $\dfrac{n!}{n^n}=\dfrac1n\cdot\dfrac2n\cdots\dfrac nn$. Ogni fattore è al più $1$ e il primo è $\dfrac1n$: quindi $0<\dfrac{n!}{n^n}\le\dfrac1n\to0$.`,
          id: 's04.monotone.L3.e5',
        },
        {
          type: 'open', level: 2,
          prompt: String.raw`Dimostra che $\dfrac{2^n}{n!}\to0$, scrivendo $\dfrac{2^n}{n!}$ come prodotto di fattori.`,
          answer: String.raw`$\dfrac{2^n}{n!}=\dfrac21\cdot\dfrac22\cdot\dfrac23\cdots\dfrac2n$. Il primo fattore è $2$, il secondo è $1$, il terzo è $\dfrac23<1$, e tutti i fattori $\dfrac2k$ con $k\ge4$ sono al più $\dfrac12$. Quindi per $n\ge3$ si ha $0<\dfrac{2^n}{n!}\le2\left(\dfrac12\right)^{n-3}\to0$.`,
          rubric: ['Scrittura come prodotto di fattori 2/k', 'Fattori con k ≥ 4 al più 1/2', 'Maggiorazione con una successione geometrica che tende a 0'],
          id: 's04.monotone.L3.e6',
        },
        {
          type: 'problem', level: 3,
          prompt: String.raw`Calcola i limiti delle successioni $a_n=\dfrac{n!+3^n}{n^2+2^n}$, $b_n=\dfrac{n!}{n^n}$ e $c_n=\dfrac{\log n}{\sqrt n}$.`,
          parts: [
            { type: 'num', prompt: 'Limite di $a_n$.', answer: 'inf', explain: String.raw`Il fattoriale $n!$ supera ogni esponenziale: il numeratore cresce più di $2^n$, quindi $a_n\to+\infty$.` },
            { type: 'num', prompt: 'Limite di $b_n$.', answer: '0', explain: String.raw`$\dfrac{n!}{n^n}\le\dfrac1n\to0$, perché il primo fattore è $\dfrac1n$ e gli altri sono al più $1$.` },
            { type: 'num', prompt: 'Limite di $c_n$.', answer: '0', explain: String.raw`Il logaritmo è trascurabile rispetto a $\sqrt n$: il rapporto tende a $0$.` },
          ],
          solution: String.raw`$a_n\to+\infty$ perché $n!$ domina su $3^n$ e su $2^n$. $b_n\to0$ perché $\dfrac{n!}{n^n}=\dfrac1n\cdot\dfrac2n\cdots\dfrac nn\le\dfrac1n$. $c_n\to0$ perché il logaritmo è trascurabile rispetto alla radice di $n$.`,
          id: 's04.monotone.L3.e7',
        },
      ],
    },
  ],
  practice: [
    { id: 's04.monotone.p-nepero', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-4, 4), b = R.int(1, 3);
        const sg = a < 0 ? '-' : '+';
        const ab = Math.abs(a);
        const bn = b === 1 ? 'n' : `${b}n`;
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\left(1${sg}\dfrac{${ab}}{n}\right)^{${bn}}$.`,
          answer: `e^(${a * b})`,
          explain: String.raw`Con $k=${a}$ e esponente $${bn}$: $\left(1+\dfrac{k}{n}\right)^{mn}\to e^{km}=e^{${a * b}}$.`,
        };
      } },
    { id: 's04.monotone.p-esp', type: 'gen', level: 2,
      gen: (R) => {
        const b = R.int(2, 4);
        let c = R.int(2, 4);
        if (c === b) c = b + 1;
        const k = R.int(2, 5);
        const ans = b > c ? 'inf' : '0';
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{${b}^n+n^{${k}}}{${c}^n+n}$ (scrivi inf se diverge).`,
          answer: ans,
          explain: b > c
            ? String.raw`La base $${b}$ è maggiore di $${c}$: il rapporto $\left(\dfrac{${b}}{${c}}\right)^n$ cresce senza limite, e le potenze di $n$ sono trascurabili.`
            : String.raw`La base $${c}$ domina al denominatore: il rapporto $\left(\dfrac{${b}}{${c}}\right)^n$ tende a $0$.`,
        };
      } },
    { id: 's04.monotone.p-fatt', type: 'gen', level: 2,
      gen: (R) => {
        const b = R.int(2, 6);
        const up = R.chance(0.5);
        return {
          type: 'num',
          prompt: up
            ? String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{n!}{${b}^n}$ (scrivi inf se diverge).`
            : String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{${b}^n}{n!}$.`,
          answer: up ? 'inf' : '0',
          explain: up
            ? String.raw`Il fattoriale supera ogni esponenziale: $\dfrac{n!}{${b}^n}\to+\infty$.`
            : String.raw`L'esponenziale è trascurabile rispetto al fattoriale: $\dfrac{${b}^n}{n!}\to0$.`,
        };
      } },
    { id: 's04.monotone.p1', type: 'mcq', level: 2,
      prompt: String.raw`Quale successione converge a $e$?`,
      options: [String.raw`$\left(1+\dfrac1n\right)^{n}$`, String.raw`$\left(1+\dfrac2n\right)^{n}$`, String.raw`$\left(1+\dfrac1n\right)^{n^2}$`, String.raw`$\left(1-\dfrac1n\right)^{n}$`],
      answer: 0,
      explain: String.raw`$\left(1+\dfrac2n\right)^n\to e^2$; $\left(1+\dfrac1n\right)^{n^2}\to+\infty$; $\left(1-\dfrac1n\right)^n\to e^{-1}$.` },
    { id: 's04.monotone.p2', type: 'tf', level: 1,
      prompt: String.raw`Per ogni $b>0$ si ha $\dfrac{b^n}{n!}\to0$.`,
      answer: true,
      explain: String.raw`È il risultato della lezione: il fattoriale supera ogni esponenziale.` },
    { id: 's04.monotone.p3', type: 'tf', level: 1,
      prompt: String.raw`$\dfrac{n^3}{e^n}\to0$.`,
      answer: true,
      explain: String.raw`L'esponenziale $e^n$ vince su ogni potenza di $n$.` },
    { id: 's04.monotone.p4', type: 'cloze', level: 2,
      text: String.raw`Per $n\to+\infty$: $\dfrac{n^{3}}{e^{n}}\to[[0]]$ e $\dfrac{n^{3}}{\log n}\to[[1]]$.`,
      blanks: [
        { options: [String.raw`$0$`, String.raw`$+\infty$`, String.raw`$1$`], answer: 0 },
        { options: [String.raw`$0$`, String.raw`$+\infty$`, String.raw`$1$`], answer: 1 },
      ],
      explain: String.raw`L'esponenziale domina la potenza, quindi il primo limite è $0$. Il logaritmo è trascurabile rispetto a ogni potenza di $n$, quindi il secondo rapporto cresce senza limite.` },
    { id: 's04.monotone.p5', type: 'match', level: 1,
      prompt: 'Abbina ogni successione alla relazione di ordine che la descrive.',
      pairs: [
        [String.raw`$\log n$`, String.raw`trascurabile rispetto a $\sqrt n$`],
        [String.raw`$n^{5}$`, String.raw`trascurabile rispetto a $2^n$`],
        [String.raw`$n!$`, String.raw`trascurabile rispetto a $n^n$`],
      ],
      explain: String.raw`Un logaritmo è trascurabile rispetto a ogni potenza positiva. Una potenza è trascurabile rispetto a un'esponenziale. Il fattoriale è trascurabile rispetto a $n^n$.` },
    { id: 's04.monotone.p6', type: 'open', level: 2,
      prompt: String.raw`Dimostra che $\dfrac{n}{2^n}\to0$, usando il binomio di Newton.`,
      answer: String.raw`Per il binomio di Newton $2^n=(1+1)^n\ge\binom n2=\dfrac{n(n-1)}{2}$ per $n\ge2$. Quindi $0<\dfrac{n}{2^n}\le\dfrac{n}{n(n-1)/2}=\dfrac{2}{n-1}\to0$.`,
      rubric: ['Uso del binomio di Newton o di una stima equivalente', String.raw`Maggiorazione di $\dfrac{n}{2^n}$`, 'Conclusione per confronto'] },
    { id: 's04.monotone.p7', type: 'num', level: 1,
      prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{n^2+3}{2^n}$.`,
      answer: '0',
      explain: String.raw`L'esponenziale $2^n$ domina il numeratore $n^2+3$: il rapporto tende a $0$.` },
    { id: 's04.monotone.p8', type: 'num', level: 1,
      prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}\dfrac{\log(n^3)}{\sqrt n}$.`,
      answer: '0',
      explain: String.raw`$\log(n^3)=3\log n$, e il logaritmo è trascurabile rispetto a $\sqrt n$: il limite è $0$.` },
  ],
  flashcards: [
    { id: 's04.monotone.fc1', kind: 'thm', front: String.raw`Teorema di convergenza monotona`, back: String.raw`Ogni successione monotona e limitata converge. Se è crescente, il limite è $\sup a_n$; se è decrescente, è $\inf a_n$.` },
    { id: 's04.monotone.fc2', kind: 'dim', front: String.raw`Idea della dimostrazione della convergenza monotona`, back: String.raw`Sia $S=\sup a_n$ per $a_n$ crescente e limitata. Fissato $\varepsilon>0$, $S-\varepsilon$ non è un maggiorante: esiste $a_N>S-\varepsilon$. Per monotonia $a_n\ge a_N$ per $n\ge N$, e $a_n\le S$. Quindi $|a_n-S|<\varepsilon$ da $N$ in poi.` },
    { id: 's04.monotone.fc3', kind: 'def', front: String.raw`Il numero di Nepero $e$`, back: String.raw`$e=\lim_{n\to+\infty}\left(1+\dfrac1n\right)^n\approx2{,}718$. La successione è crescente e limitata, quindi converge.` },
    { id: 's04.monotone.fc4', kind: 'formula', front: String.raw`Limiti notevoli con il numero e`, back: String.raw`$\left(1+\dfrac kn\right)^n\to e^k$ e $\left(1+\dfrac kn\right)^{mn}\to e^{km}$. Inoltre $n\log\left(1+\dfrac1n\right)\to1$.` },
    { id: 's04.monotone.fc5', kind: 'metodo', front: String.raw`Forma $1^\infty$`, back: String.raw`Si scrive $f_n^{g_n}=e^{g_n\log f_n}$ e si calcola il limite dell'esponente $g_n\log f_n$. Se tende a $L$, il limite è $e^L$.` },
    { id: 's04.monotone.fc6', kind: 'formula', front: String.raw`Gerarchia degli infiniti`, back: String.raw`$\log n\ll n^{\alpha}\ll b^n\ll n!\ll n^n$ per $\alpha>0$ e $b>1$. Il simbolo $\ll$ significa che il rapporto tende a $0$.` },
    { id: 's04.monotone.fc7', kind: 'thm', front: String.raw`Limite di $b^n/n!$`, back: String.raw`Per ogni $b>0$, $\dfrac{b^n}{n!}\to0$. Il rapporto tra termini consecutivi è $\dfrac{b}{n+1}$, che da un certo punto in poi è minore di $\dfrac12$.` },
    { id: 's04.monotone.fc8', kind: 'errore', front: String.raw`Errore con il numero e`, back: String.raw`$\left(1+\dfrac kn\right)^{n^2}$ non tende a $e^k$: l'esponente $n^2$ è troppo grande. Per $k>0$ il limite è $+\infty$.` },
  ],
});
