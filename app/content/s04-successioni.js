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
