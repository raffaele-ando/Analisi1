// Sezione s07 · Continuità
// Skill: s07.def, s07.teoremi, s07.inversa
import { H } from '../engine/tex.js';

// ---------- helper locali per i generatori ----------
/** "x - 3", "x + 2", "x" */
const xm = (a) => (a === 0 ? 'x' : `x ${a > 0 ? '-' : '+'} ${Math.abs(a)}`);
/** stringa math.js di (x - a) */
const xmS = (a) => `(x-(${a}))`;
/** funzione a tratti in LaTeX: righe [espressione, condizione] */
/** "a+b", "-a+b", "2a+b", "b" (per t = 0) */
const ab = (t) => (t === 0 ? 'b' : `${H.coef(t)}a+b`);
const cases = (rows) => String.raw`\begin{cases} ${rows.map(([e, c]) => `${e} & ${c}`).join(String.raw` \\ `)} \end{cases}`;

const TIPI = [
  'Discontinuità eliminabile',
  'Discontinuità di salto (prima specie)',
  'Discontinuità di seconda specie',
  '$f$ è continua in $x_0$',
];

const sDef = {
  id: 's07.def',
  title: 'Funzioni continue e discontinuità',
  summary: String.raw`Riconosci se una funzione è continua, classifichi le discontinuità e scegli i parametri che rendono continua una funzione a tratti.`,
  prereq: ['s05.def', 's05.notevoli', 's05.calcolo'],
  examRefs: ['Appello 15/01/2026 · Es. 1', 'Appello 03/09/2026 · Es. 1'],
  lessons: [
    {
      id: 's07.def.L1',
      title: 'Che cosa vuol dire "continua"',
      cards: [
        {
          type: 'learn',
          title: 'Idea: niente strappi',
          body: String.raw`Intuitivamente una funzione è **continua** se il suo grafico si disegna "senza staccare la penna". Matematicamente: avvicinandosi a $x_0$, i valori $f(x)$ si avvicinano proprio a $f(x_0)$.

>* **Definizione.** Sia $f: A\to\R$ e $x_0\in A$ punto di accumulazione di $A$. $f$ è **continua in $x_0$** se
$$\lim_{x\to x_0} f(x) = f(x_0).$$

Dentro questa uguaglianza ci sono **tre** richieste:
1. $f$ è definita in $x_0$ (esiste $f(x_0)$);
2. il limite per $x\to x_0$ esiste ed è **finito**;
3. il limite è **uguale** a $f(x_0)$.

Nel grafico a destra: $f$ è continua in $x_0=1$; $g$ ha uno "strappo" in $0$.`,
          plot: { fns: [{ f: 'x^2/2', label: 'f' }, { f: 'x<0 ? x-1 : x+1', label: 'g' }], x: [-3, 3], y: [-3, 4], points: [[1, 0.5], [0, 1]], open: [[0, -1]] },
        },
        {
          id: 's07.def.L1.q1',
          type: 'mcq',
          prompt: String.raw`Sia $f(x)=\begin{cases} x+1 & x<0\\ 2 & x=0 \\ x^2+1 & x>0\end{cases}$. Perché $f$ **non** è continua in $0$?`,
          options: [
            String.raw`Perché il limite esiste ($=1$) ma è diverso da $f(0)=2$`,
            String.raw`Perché il limite per $x\to0$ non esiste`,
            String.raw`Perché $f$ non è definita in $0$`,
            String.raw`Perché $f$ è definita "a pezzi", e le funzioni a tratti non sono mai continue`,
          ],
          answer: 0,
          explain: String.raw`Da sinistra $x+1\to1$, da destra $x^2+1\to1$: il limite esiste e vale $1$. Però $f(0)=2\neq1$: cade la terza condizione. Il limite esiste, quindi la seconda opzione è falsa; $f(0)=2$ è definito, quindi la terza è falsa. Le funzioni a tratti possono benissimo essere continue: basta che i pezzi "si attacchino".`,
          level: 1,
        },
        {
          type: 'learn',
          title: 'La versione con ε e δ',
          body: String.raw`Scrivendo la definizione di limite si ottiene la forma "$\varepsilon$–$\delta$":

>* $f$ è continua in $x_0$ se per ogni $\varepsilon>0$ esiste $\delta>0$ tale che
$$x\in A,\ |x-x_0|<\delta \ \Longrightarrow\ |f(x)-f(x_0)|<\varepsilon.$$

Rispetto alla definizione di limite **non** serve escludere $x=x_0$: per $x=x_0$ si ha $|f(x)-f(x_0)|=0<\varepsilon$.

Se $f$ è continua in **ogni** punto di $A$ si dice continua in $A$ e si scrive $f\in C^0(A)$.`,
        },
        {
          id: 's07.def.L1.q2',
          type: 'cloze',
          text: String.raw`$f$ è continua in $x_0\in A$ se per ogni [[0]] esiste [[1]] tale che per ogni $x\in A$ con $|x-x_0|<\delta$ si ha [[2]].`,
          blanks: [
            { options: [String.raw`$\varepsilon>0$`, String.raw`$\delta>0$`, String.raw`$x\in A$`], answer: 0 },
            { options: [String.raw`$\delta>0$`, String.raw`$\varepsilon>0$`, String.raw`$M>0$`], answer: 0 },
            { options: [String.raw`$|f(x)-f(x_0)|<\varepsilon$`, String.raw`$|f(x)-f(x_0)|<\delta$`, String.raw`$|x-x_0|<\varepsilon$`], answer: 0 },
          ],
          explain: String.raw`L'ordine dei quantificatori conta: **prima** si fissa la tolleranza $\varepsilon$ sui valori, **poi** si trova $\delta$ (che dipende da $\varepsilon$) sulle $x$. La conclusione riguarda la distanza dei valori $f(x)$ da $f(x_0)$, quindi va confrontata con $\varepsilon$.`,
          level: 1,
        },
        {
          type: 'learn',
          title: 'Chi è continuo "gratis"',
          body: String.raw`>* Polinomi, razionali fratte, $e^x$, $a^x$, $\log x$, radici, $\sin x$, $\cos x$, $\tan x$, $\arctan x$, $|x|$ sono **continue nel loro dominio**.

>* **Algebra delle funzioni continue.** Se $f,g$ sono continue in $x_0$, lo sono $f\pm g$, $f\cdot g$ e $f/g$ (se $g(x_0)\neq0$).

>* **Composizione.** Se $g$ è continua in $x_0$ e $f$ è continua in $g(x_0)$, allora $f\circ g$ è continua in $x_0$.

Quindi i problemi di continuità nascono solo nei **punti di raccordo** delle funzioni a tratti e nei punti in cui una formula "non ha senso".

> Attenzione: $\frac1x$ è continua **nel suo dominio** $\R\setminus\{0\}$. In $0$ non è definita, quindi non ha senso chiedersi se è continua lì. Molti testi però classificano anche questi punti (vedi la prossima lezione).`,
        },
        {
          id: 's07.def.L1.q3',
          type: 'tf',
          prompt: String.raw`La funzione $f(x)=\frac1x$ è continua in tutto il suo dominio.`,
          answer: true,
          explain: String.raw`Il dominio è $\R\setminus\{0\}$ e in ogni $x_0\neq0$ vale $\lim_{x\to x_0}\frac1x=\frac1{x_0}$. Il "salto infinito" in $0$ non contraddice la continuità, perché $0$ non sta nel dominio. Errore tipico: dire "non è continua perché ha un asintoto".`,
          level: 1,
        },
        {
          id: 's07.def.L1.q4',
          type: 'mcq',
          prompt: String.raw`Quale funzione è continua su **tutto** $\R$?`,
          options: [
            String.raw`$f(x)=e^{\sin x}+|x-3|$`,
            String.raw`$f(x)=\log(x^2)$`,
            String.raw`$f(x)=\tan x$`,
            String.raw`$f(x)=\frac{x}{x^2-1}$`,
          ],
          answer: 0,
          explain: String.raw`$e^{\sin x}$ è composta di continue, $|x-3|$ è continua: la somma è continua su $\R$. Le altre sono continue nel loro dominio, che però non è $\R$: $\log(x^2)$ esclude $0$, $\tan x$ esclude $\frac\pi2+k\pi$, $\frac{x}{x^2-1}$ esclude $\pm1$.`,
          level: 1,
        },
        {
          id: 's07.def.L1.q5',
          type: 'num',
          prompt: String.raw`Quale valore deve avere $f(0)$ perché $f(x)=\frac{\sin(5x)}{x}$ (per $x\neq0$) sia continua in $0$?`,
          answer: '5',
          explain: String.raw`Serve $f(0)=\lim_{x\to0}\frac{\sin 5x}{x}=\lim_{x\to0}5\cdot\frac{\sin5x}{5x}=5\cdot1=5$ (limite notevole). Questo si chiama **prolungamento per continuità**. Errore tipico: rispondere $1$ dimenticando il fattore $5$.`,
          level: 1,
        },
        {
          id: 's07.def.L1.q6',
          type: 'tf',
          prompt: String.raw`Se $f$ e $g$ sono continue su $\R$, allora $\frac{f}{g}$ è continua in ogni punto in cui $g(x)\neq0$.`,
          answer: true,
          explain: String.raw`È l'algebra delle funzioni continue: il quoziente di continue è continuo dove il denominatore non si annulla (che è proprio il dominio di $f/g$).`,
          level: 1,
        },
        {
          id: 's07.def.L1.q7',
          type: 'mcq',
          prompt: String.raw`$f(x)=\begin{cases} x\log x & 0<x<1\\ \frac{x-1}{2x-3} & x\ge1,\ x\neq\frac32\end{cases}$ è continua in $x_0=1$?`,
          options: [
            String.raw`Sì: $\lim_{x\to1^-}x\log x=0=f(1)$`,
            String.raw`No: da sinistra il limite è $1$`,
            String.raw`No: da destra il limite è $-1$`,
            String.raw`Non si può dire perché $f$ ha un asintoto in $\frac32$`,
          ],
          answer: 0,
          explain: String.raw`Da sinistra $x\log x\to1\cdot\log1=0$; $f(1)=\frac{0}{-1}=0$ e da destra la formula è continua in $1$. Quindi $f$ è continua in $1$. ($-1$ e $1$ sono le **derivate** laterali in $1$, non i limiti: lì c'è un punto angoloso, ma la continuità c'è.) L'asintoto in $\frac32$ non c'entra con il punto $1$.`,
          level: 2,
          source: 'Appello 15/01/2026 · Es. 1',
        },
      ],
    },
    {
      id: 's07.def.L2',
      title: 'Classificare le discontinuità',
      cards: [
        {
          type: 'learn',
          title: 'Tre tipi di discontinuità',
          body: String.raw`Sia $x_0$ un punto in cui $f$ non è continua. Si guardano i limiti destro e sinistro.

- **Eliminabile**: il limite $\lim_{x\to x_0}f(x)=\ell$ esiste finito ma $f(x_0)\neq\ell$ (oppure $f$ non è definita in $x_0$). Ridefinendo $f(x_0)=\ell$ la funzione diventa continua.
- **Di salto (prima specie)**: i limiti destro e sinistro esistono **finiti ma diversi**. Il **salto** è $f(x_0^+)-f(x_0^-)$.
- **Di seconda specie**: almeno uno dei due limiti laterali è **infinito** oppure **non esiste**.

Grafico: $\arctan\frac1x$ ha un salto di ampiezza $\pi$ in $0$.`,
          plot: { fns: [{ f: 'atan(1/x)', label: 'arctan(1/x)' }], x: [-4, 4], y: [-2, 2], open: [[0, 1.5708], [0, -1.5708]] },
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Classifica le discontinuità di $f(x)=\frac{x^2-4}{x-2}$ e di $g(x)=e^{1/x}$.`,
          steps: [
            String.raw`$f$ non è definita in $2$. Per $x\neq2$: $\frac{x^2-4}{x-2}=\frac{(x-2)(x+2)}{x-2}=x+2\to4$.`,
            String.raw`Il limite esiste finito: discontinuità **eliminabile**. Il prolungamento continuo vale $4$ in $x=2$.`,
            String.raw`Per $g$ in $0$: se $x\to0^-$, $\frac1x\to-\infty$ e $e^{1/x}\to0$; se $x\to0^+$, $\frac1x\to+\infty$ e $e^{1/x}\to+\infty$.`,
            String.raw`Un limite laterale è infinito: discontinuità **di seconda specie**.`,
          ],
          result: String.raw`$f$: eliminabile in $2$; $g$: seconda specie in $0$.`,
          plot: { fns: [{ f: 'exp(1/x)', label: 'e^(1/x)' }], x: [-3, 3], y: [-1, 6], open: [[0, 0]] },
        },
        {
          id: 's07.def.L2.q1',
          type: 'mcq',
          prompt: String.raw`Che discontinuità ha $f(x)=\frac{|x|}{x}$ in $0$?`,
          options: [TIPI[1], TIPI[0], TIPI[2], String.raw`Nessuna: $|x|$ è continua`],
          answer: 0,
          explain: String.raw`Per $x>0$ vale $\frac{x}{x}=1$, per $x<0$ vale $\frac{-x}{x}=-1$: limiti laterali finiti e diversi, salto $1-(-1)=2$. Non è eliminabile perché il limite (bilatero) non esiste. Che $|x|$ sia continua non basta: il quoziente per $x$ crea il problema in $0$.`,
          level: 1,
        },
        {
          id: 's07.def.L2.q2',
          type: 'match',
          prompt: 'Abbina ogni funzione al tipo di discontinuità in $x_0=0$.',
          pairs: [
            [String.raw`$\frac{\sin x}{x}$`, 'eliminabile'],
            [String.raw`$\arctan\frac1x$`, 'salto'],
            [String.raw`$\sin\frac1x$`, 'seconda specie (il limite non esiste)'],
            [String.raw`$\frac{1}{x^2}$`, 'seconda specie (limite infinito)'],
          ],
          explain: String.raw`$\frac{\sin x}x\to1$: eliminabile. $\arctan\frac1x\to\pm\frac\pi2$ dai due lati: salto $\pi$. $\sin\frac1x$ oscilla tra $-1$ e $1$ sempre più velocemente: nessun limite. $\frac1{x^2}\to+\infty$: seconda specie.`,
          level: 2,
        },
        {
          type: 'example',
          title: 'Esempio da completare',
          problem: String.raw`Studia la continuità in $x_0=1$ di $f(x)=\begin{cases} e^{\frac{x+1}{x-1}} & x<1\\ x^2+\log x & x\ge1\end{cases}$.`,
          steps: [
            {
              text: String.raw`Per $x\to1^-$: $x+1\to2$ e $x-1\to0^-$, quindi $\frac{x+1}{x-1}\to-\infty$ ed $e^{\frac{x+1}{x-1}}\to0$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $\lim_{x\to1^-}e^{\frac{x+1}{x-1}}$?`, answer: '0', explain: String.raw`L'esponente tende a $\frac{2}{0^-}=-\infty$ ed $e^{-\infty}=0$.` },
            },
            {
              text: String.raw`$f(1)=1+\log1=1$, e da destra la formula $x^2+\log x$ è continua: $f(1^+)=1$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $f(1)$?`, answer: '1', explain: String.raw`$1^2+\log 1=1+0=1$.` },
            },
            String.raw`Limiti laterali finiti e diversi ($0$ e $1$): discontinuità **di salto**, ampiezza $1$.`,
          ],
          result: String.raw`Salto in $x_0=1$: $f(1^-)=0$, $f(1^+)=f(1)=1$.`,
          plot: { fns: [{ f: 'x<1 ? exp((x+1)/(x-1)) : x^2+log(x)', label: 'f' }], x: [-4, 2.5], y: [-0.5, 4], points: [[1, 1]], open: [[1, 0]], hlines: [2.718] },
        },
        {
          id: 's07.def.L2.q3',
          type: 'num',
          prompt: String.raw`Calcola il salto $f(0^+)-f(0^-)$ di $f(x)=\begin{cases} 3x-2 & x<0\\ x^2+5 & x\ge0\end{cases}$.`,
          answer: '7',
          explain: String.raw`$f(0^-)=\lim_{x\to0^-}(3x-2)=-2$, $f(0^+)=0+5=5$. Salto $=5-(-2)=7$. Errore tipico: fare $5-2=3$ dimenticando il segno di $-2$.`,
          level: 1,
        },
        {
          id: 's07.def.L2.q4',
          type: 'mcq',
          prompt: String.raw`$f(x)=\frac{x^2-1}{x^2-3x+2}$: che tipo di punti sono $x=1$ e $x=2$?`,
          options: [
            String.raw`$x=1$ eliminabile, $x=2$ seconda specie`,
            String.raw`Entrambi seconda specie: il denominatore si annulla`,
            String.raw`$x=1$ salto, $x=2$ seconda specie`,
            String.raw`$x=1$ seconda specie, $x=2$ eliminabile`,
          ],
          answer: 0,
          explain: String.raw`$x^2-3x+2=(x-1)(x-2)$ e $x^2-1=(x-1)(x+1)$. Per $x\neq1$: $f(x)=\frac{x+1}{x-2}$. In $1$: limite $\frac{2}{-1}=-2$ finito → eliminabile. In $2$: $\frac{3}{0^\pm}\to\pm\infty$ → seconda specie. Un denominatore nullo **non** basta per dire "seconda specie": prima semplifica.`,
          level: 2,
        },
        {
          id: 's07.def.L2.q5',
          type: 'tf',
          prompt: String.raw`Se $\lim_{x\to x_0^-}f(x)=\lim_{x\to x_0^+}f(x)=+\infty$, la discontinuità in $x_0$ è eliminabile perché i due limiti laterali coincidono.`,
          answer: false,
          explain: String.raw`Per l'eliminabile il limite deve essere **finito**: non si può ridefinire $f(x_0)=+\infty$. Con un limite infinito la discontinuità è di seconda specie (es. $\frac1{x^2}$ in $0$).`,
          level: 2,
        },
        {
          id: 's07.def.L2.q6',
          type: 'num',
          prompt: String.raw`Ampiezza del salto $f(0^+)-f(0^-)$ di $f(x)=\arctan\frac1x$ in $0$ (scrivi pure "pi").`,
          answer: 'pi',
          explain: String.raw`$x\to0^+$: $\frac1x\to+\infty$, $\arctan\to\frac\pi2$. $x\to0^-$: $\arctan\to-\frac\pi2$. Salto $\frac\pi2-\left(-\frac\pi2\right)=\pi$.`,
          level: 2,
        },
        {
          id: 's07.def.L2.q7',
          type: 'open',
          prompt: String.raw`Dai la definizione di funzione continua in un punto e descrivi i tre tipi di discontinuità, con un esempio per ciascuno.`,
          answer: String.raw`$f:A\to\R$ è continua in $x_0\in A$ (di accumulazione) se $\lim_{x\to x_0}f(x)=f(x_0)$, cioè $\forall\varepsilon>0\ \exists\delta>0$: $x\in A$, $|x-x_0|<\delta\Rightarrow|f(x)-f(x_0)|<\varepsilon$.

- **Eliminabile**: esiste finito $\lim_{x\to x_0}f(x)=\ell\neq f(x_0)$ (o $f$ non definita in $x_0$). Es.: $\frac{\sin x}{x}$ in $0$.
- **Salto (prima specie)**: limiti laterali finiti e diversi. Es.: $\frac{|x|}{x}$ in $0$ (salto $2$).
- **Seconda specie**: almeno un limite laterale infinito o inesistente. Es.: $e^{1/x}$ o $\sin\frac1x$ in $0$.`,
          rubric: [
            'Definizione corretta con il limite (o con ε–δ) e x₀ nel dominio',
            'Eliminabile: limite finito diverso da f(x₀) o f non definita',
            'Salto: limiti laterali finiti e diversi',
            'Seconda specie: un limite laterale infinito o inesistente',
            'Un esempio corretto per ciascun tipo',
          ],
          level: 2,
        },
      ],
    },
    {
      id: 's07.def.L3',
      title: 'Funzioni a tratti con parametro',
      cards: [
        {
          type: 'learn',
          title: 'Il metodo',
          body: String.raw`Una funzione a tratti con pezzi continui può essere discontinua solo nei **punti di raccordo**. In un raccordo $x_0$ imponi
$$\lim_{x\to x_0^-}f(x)=\lim_{x\to x_0^+}f(x)=f(x_0).$$
Ogni raccordo dà **un'equazione** nei parametri. Se il pezzo è una formula "indeterminata" (es. $\frac{\sin x}{x}$), il limite si calcola con i limiti notevoli.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Trova $a$ tale che $f(x)=\begin{cases} ax+1 & x<1\\ x^2+3 & x\ge1\end{cases}$ sia continua su $\R$.`,
          steps: [
            String.raw`I due pezzi sono polinomi: continui. Resta il raccordo $x_0=1$.`,
            String.raw`Da sinistra: $\lim_{x\to1^-}(ax+1)=a+1$. Da destra e in $1$: $f(1)=1+3=4$.`,
            String.raw`Impongo $a+1=4$, quindi $a=3$.`,
          ],
          result: String.raw`$a=3$`,
          plot: { fns: [{ f: 'x<1 ? 3x+1 : x^2+3', label: 'a = 3' }], x: [-2, 3], y: [-4, 12], points: [[1, 4]] },
        },
        {
          type: 'example',
          title: 'Esempio da completare',
          problem: String.raw`Trova $a$ tale che $f(x)=\begin{cases} \frac{\log(1+2x)}{x} & x>0\\ e^x+a & x\le0\end{cases}$ sia continua in $0$.`,
          steps: [
            {
              text: String.raw`Da destra: $\frac{\log(1+2x)}{x}=2\cdot\frac{\log(1+2x)}{2x}\to2$.`,
              ask: { type: 'num', prompt: String.raw`$\lim_{x\to0^+}\frac{\log(1+2x)}{x}=$`, answer: '2', explain: String.raw`Limite notevole $\frac{\log(1+t)}{t}\to1$ con $t=2x$: resta il fattore $2$.` },
            },
            String.raw`Da sinistra e in $0$: $f(0)=e^0+a=1+a$.`,
            {
              text: String.raw`Impongo $1+a=2$: $a=1$.`,
              ask: { type: 'num', prompt: 'Valore di $a$', answer: '1', explain: String.raw`$1+a=2\Rightarrow a=1$.` },
            },
          ],
          result: String.raw`$a=1$`,
        },
        {
          id: 's07.def.L3.q1',
          type: 'num',
          prompt: String.raw`Per quale $k$ la funzione $f(x)=\begin{cases} \frac{1-\cos x}{x^2} & x\neq0\\ k & x=0\end{cases}$ è continua in $0$?`,
          answer: '1/2',
          explain: String.raw`Limite notevole: $\frac{1-\cos x}{x^2}\to\frac12$. Serve $k=\frac12$. Errore tipico: $k=0$ (confondendo con $\frac{1-\cos x}{x}\to0$).`,
          level: 1,
        },
        {
          id: 's07.def.L3.q2',
          type: 'num',
          prompt: String.raw`Trova $a$ tale che $f(x)=\begin{cases} \frac{e^{ax}-1}{x} & x<0\\ x+3 & x\ge0\end{cases}$ sia continua su $\R$.`,
          answer: '3',
          explain: String.raw`Da sinistra $\frac{e^{ax}-1}{x}=a\cdot\frac{e^{ax}-1}{ax}\to a$ (per $a\neq0$; se $a=0$ il pezzo vale $0$). Da destra e in $0$: $f(0)=3$. Quindi $a=3$.`,
          level: 2,
        },
        {
          id: 's07.def.L3.q3',
          type: 'tuple',
          prompt: String.raw`Trova $a,b$ tali che $f(x)=\begin{cases} x^2 & x<1\\ ax+b & 1\le x\le2\\ 6 & x>2\end{cases}$ sia continua su $\R$.`,
          labels: ['a', 'b'],
          answer: ['5', '-4'],
          explain: String.raw`Due raccordi, due equazioni. In $1$: $1=a+b$. In $2$: $2a+b=6$. Sottraendo: $a=5$, poi $b=1-5=-4$.`,
          level: 2,
        },
        {
          id: 's07.def.L3.q4',
          type: 'set',
          prompt: String.raw`Trova **tutti** i valori di $a$ per cui $f(x)=\begin{cases} a^2+x & x\le0\\ \frac{\sin 4x}{x} & x>0\end{cases}$ è continua in $0$ (separa con ";").`,
          answer: ['2', '-2'],
          explain: String.raw`Da destra $\frac{\sin4x}{x}\to4$; $f(0)=a^2$. Serve $a^2=4$, cioè $a=\pm2$. Errore tipico: dimenticare $a=-2$.`,
          level: 2,
        },
        {
          id: 's07.def.L3.q5',
          type: 'mcq',
          prompt: String.raw`$f(x)=\begin{cases} \frac{x^2-9}{x-3} & x\neq3\\ a & x=3\end{cases}$. Per $a=5$ che cosa succede in $x=3$?`,
          options: [
            'Discontinuità eliminabile: il limite è 6',
            'Continua: basta che $f(3)$ sia definito',
            'Salto di ampiezza 1',
            'Seconda specie: il denominatore si annulla',
          ],
          answer: 0,
          explain: String.raw`Per $x\neq3$, $\frac{x^2-9}{x-3}=x+3\to6$. Il limite esiste ed è finito ma $f(3)=5\neq6$: eliminabile (diventa continua con $a=6$). Non è un salto: i due limiti laterali coincidono.`,
          level: 1,
        },
        {
          id: 's07.def.L3.q6',
          type: 'tuple',
          prompt: String.raw`Trova $a,b$ tali che $f(x)=\begin{cases} \frac{\sin(ax)}{x} & x<0\\ b & x=0\\ \frac{\log(1+x)}{2x}+1 & x>0\end{cases}$ sia continua in $0$.`,
          labels: ['a', 'b'],
          answer: ['3/2', '3/2'],
          explain: String.raw`Da destra: $\frac{\log(1+x)}{2x}+1\to\frac12+1=\frac32$. Quindi $b=f(0)=\frac32$. Da sinistra $\frac{\sin ax}{x}\to a$, quindi $a=\frac32$.`,
          level: 3,
        },
        {
          id: 's07.def.L3.q7',
          type: 'num',
          prompt: String.raw`Trova $a$ tale che $f(x)=\begin{cases} (1+x)^{1/x} & x>0\\ a+x & x\le0\end{cases}$ sia continua in $0$ (scrivi "e" per il numero di Nepero).`,
          answer: 'e',
          explain: String.raw`$\lim_{x\to0^+}(1+x)^{1/x}=e$ (limite notevole, versione con $t=\frac1x\to+\infty$). $f(0)=a$, quindi $a=e$.`,
          level: 2,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's07.def.gen-raccordo',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const x0 = R.int(-2, 3), p = R.int(-4, 4), q = R.nz(-4, 4), r = R.int(-5, 5);
        const k = q * x0 + r - x0 * x0 - p * x0;
        const left = `${H.poly([1, p, 0])} + k`;
        return {
          type: 'num',
          prompt: String.raw`Trova $k$ tale che $f(x)=${cases([[left, `x<${x0}`], [H.lin(q, r), String.raw`x\ge ${x0}`]])}$ sia continua su $\R$.`,
          answer: String(k),
          explain: String.raw`I pezzi sono polinomi, resta il raccordo $x_0=${x0}$. Da sinistra il limite è $${x0 * x0 + p * x0 === 0 ? 'k' : `${x0 * x0 + p * x0}+k`}$. In $x_0$: $f(${x0})=${q * x0 + r}$. Imponendo l'uguaglianza: $k=${k}$.`,
        };
      },
    },
    {
      id: 's07.def.gen-notevole',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const b = R.pick([2, 3, 4, 5, -2, -3]), c = R.int(1, 4);
        const kind = R.int(0, 3);
        let tex, L, Ltex, why;
        if (kind === 0) {
          tex = String.raw`\frac{\sin(${b}x)}{${H.coef(c)}x}`;
          L = H.fracStr(b, c); Ltex = H.frac(b, c);
          why = String.raw`$\frac{\sin(${b}x)}{${H.coef(c)}x}=\frac{${b}}{${c}}\cdot\frac{\sin(${b}x)}{${b}x}\to${Ltex}$`;
        } else if (kind === 1) {
          tex = String.raw`\frac{e^{${b}x}-1}{${H.coef(c)}x}`;
          L = H.fracStr(b, c); Ltex = H.frac(b, c);
          why = String.raw`$\frac{e^{${b}x}-1}{${H.coef(c)}x}=\frac{${b}}{${c}}\cdot\frac{e^{${b}x}-1}{${b}x}\to${Ltex}$`;
        } else if (kind === 2) {
          const bb = Math.abs(b);
          tex = String.raw`\frac{\log(1+${bb}x)}{${H.coef(c)}x}`;
          L = H.fracStr(bb, c); Ltex = H.frac(bb, c);
          why = String.raw`$\frac{\log(1+${bb}x)}{${H.coef(c)}x}=\frac{${bb}}{${c}}\cdot\frac{\log(1+${bb}x)}{${bb}x}\to${Ltex}$`;
        } else {
          const bb = Math.abs(b);
          tex = String.raw`\frac{1-\cos(${bb}x)}{${H.coef(c)}x^2}`;
          L = H.fracStr(bb * bb, 2 * c); Ltex = H.frac(bb * bb, 2 * c);
          why = String.raw`$\frac{1-\cos(${bb}x)}{${H.coef(c)}x^2}=\frac{${bb * bb}}{${c}}\cdot\frac{1-\cos(${bb}x)}{(${bb}x)^2}\to\frac{${bb * bb}}{${c}}\cdot\frac12=${Ltex}$`;
        }
        return {
          type: 'num',
          prompt: String.raw`Trova $k$ tale che $f(x)=${cases([[tex, 'x<0'], ['x^2+k', String.raw`x\ge0`]])}$ sia continua in $0$.`,
          answer: L,
          explain: String.raw`Da destra e in $0$: $f(0)=k$. Da sinistra, con un limite notevole: ${why}. Quindi $k=${Ltex}$.`,
        };
      },
    },
    {
      id: 's07.def.gen-classifica',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.nz(-3, 4);
        const kind = R.int(0, 6);
        let fx, f0, ans, why;
        if (kind === 0) {
          const c = 2 * a + R.nz(-3, 3);
          fx = String.raw`\frac{x^2-${a * a}}{${xm(a)}}`; f0 = c; ans = 0;
          why = String.raw`Per $x\neq${a}$: $\frac{(${xm(a)})(${xm(-a)})}{${xm(a)}}=${xm(-a)}\to${2 * a}$. Limite finito ma $f(${a})=${c}\neq${2 * a}$: eliminabile.`;
        } else if (kind === 1) {
          fx = String.raw`\frac{x^2-${a * a}}{${xm(a)}}`; f0 = 2 * a; ans = 3;
          why = String.raw`Per $x\neq${a}$ la funzione vale $${xm(-a)}\to${2 * a}=f(${a})$: è continua.`;
        } else if (kind === 2) {
          fx = String.raw`\frac{|${xm(a)}|}{${xm(a)}}`; f0 = 1; ans = 1;
          why = String.raw`Vale $1$ per $x>${a}$ e $-1$ per $x<${a}$: limiti laterali finiti e diversi, salto $2$.`;
        } else if (kind === 3) {
          fx = String.raw`e^{\frac{1}{${xm(a)}}}`; f0 = 0; ans = 2;
          why = String.raw`Per $x\to${a}^+$ l'esponente tende a $+\infty$ e $f\to+\infty$: un limite laterale infinito, seconda specie.`;
        } else if (kind === 4) {
          fx = String.raw`\arctan\frac{1}{${xm(a)}}`; f0 = 0; ans = 1;
          why = String.raw`I limiti laterali sono $\pm\frac\pi2$: finiti e diversi, salto di ampiezza $\pi$.`;
        } else if (kind === 5) {
          fx = String.raw`\sin\frac{1}{${xm(a)}}`; f0 = 0; ans = 2;
          why = String.raw`$\sin\frac{1}{${xm(a)}}$ oscilla tra $-1$ e $1$: i limiti laterali non esistono, seconda specie.`;
        } else {
          const b = R.pick([2, 3, 5]);
          const c = R.chance(0.5) ? b : b + R.nz(-2, 2);
          fx = String.raw`\frac{\sin(${b}(${xm(a)}))}{${xm(a)}}`; f0 = c; ans = c === b ? 3 : 0;
          why = String.raw`Con $t=${xm(a)}\to0$: $\frac{\sin(${b}t)}{t}\to${b}$. ` + (c === b ? String.raw`Coincide con $f(${a})=${b}$: continua.` : String.raw`Ma $f(${a})=${c}\neq${b}$: eliminabile.`);
        }
        return {
          type: 'mcq',
          prompt: String.raw`$f(x)=${cases([[fx, String.raw`x\neq ${a}`], [String(f0), `x=${a}`]])}$. Che cosa succede in $x_0=${a}$?`,
          options: TIPI,
          noShuffle: true,
          answer: ans,
          explain: why,
        };
      },
    },
    {
      id: 's07.def.gen-salto',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const c = R.int(-2, 2), a = R.nz(-4, 4), b = R.int(-5, 5), d = R.nz(-3, 3);
        let e = R.int(-5, 5);
        if (d * c + e === a * c + b) e += R.pick([1, 2, -3]);
        const L = a * c + b, Rr = d * c + e;
        return {
          type: 'num',
          prompt: String.raw`Calcola il salto $f(x_0^+)-f(x_0^-)$ in $x_0=${c}$ di $f(x)=${cases([[H.lin(a, b), `x<${c}`], [H.lin(d, e), String.raw`x\ge ${c}`]])}$.`,
          answer: String(Rr - L),
          explain: String.raw`$f(x_0^-)=${L}$ (pezzo di sinistra calcolato in $${c}$), $f(x_0^+)=${Rr}$ (pezzo di destra). Salto $=${Rr}-(${L})=${Rr - L}$.`,
        };
      },
    },
    {
      id: 's07.def.gen-due-param',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const u = R.int(-1, 1), v = u + R.int(1, 2);
        const a = R.nz(-3, 3), b = R.int(-4, 4), p = R.int(-2, 2), c1 = R.nz(-3, 3);
        const c0 = a * u + b - u * u - p * u, c2 = a * v + b - c1 * v;
        return {
          type: 'tuple',
          prompt: String.raw`Trova $a,b$ tali che $f(x)=${cases([[H.poly([1, p, c0]), `x<${u}`], ['ax+b', String.raw`${u}\le x\le ${v}`], [H.lin(c1, c2), `x>${v}`]])}$ sia continua su $\R$.`,
          labels: ['a', 'b'],
          answer: [String(a), String(b)],
          explain: String.raw`Raccordo in $${u}$: $${u * u + p * u + c0}=${ab(u)}$. Raccordo in $${v}$: $${ab(v)}=${a * v + b}$. Sottraendo le due equazioni ricavi $a=${a}$, poi $b=${b}$.`,
        };
      },
    },
    {
      id: 's07.def.p1',
      type: 'open',
      prompt: String.raw`Che cosa significa che una discontinuità è **eliminabile**? Spiega che cos'è il prolungamento per continuità e fai un esempio.`,
      answer: String.raw`$x_0$ è una discontinuità eliminabile di $f$ se esiste finito $\ell=\lim_{x\to x_0}f(x)$ ma $f(x_0)\neq\ell$ oppure $f$ non è definita in $x_0$. La funzione $\tilde f$ uguale a $f$ per $x\neq x_0$ e con $\tilde f(x_0)=\ell$ è continua in $x_0$: è il **prolungamento per continuità**. Esempio: $\frac{\sin x}{x}$ si prolunga con il valore $1$ in $0$.`,
      rubric: ['Limite finito che esiste', 'Diverso da f(x₀) o f non definita in x₀', 'Definizione del prolungamento con valore ℓ', 'Esempio corretto'],
      level: 2,
    },
    {
      id: 's07.def.p2',
      type: 'tf',
      prompt: String.raw`La composizione di due funzioni continue (dove ha senso) è continua.`,
      answer: true,
      explain: String.raw`Se $g$ è continua in $x_0$ e $f$ è continua in $g(x_0)$, allora $f(g(x))\to f(g(x_0))$. Per esempio $e^{\sin x}$ e $\log(1+x^2)$ sono continue su $\R$.`,
      level: 1,
    },
    {
      id: 's07.def.p3',
      type: 'tf',
      prompt: String.raw`Se $|f|$ è continua in $x_0$ allora anche $f$ è continua in $x_0$.`,
      answer: false,
      explain: String.raw`Controesempio: $f(x)=1$ per $x\ge0$, $f(x)=-1$ per $x<0$. $|f|\equiv1$ è continua, ma $f$ ha un salto in $0$. Il viceversa invece è vero: se $f$ è continua lo è anche $|f|$ (composta con $|\cdot|$).`,
      level: 2,
    },
    {
      id: 's07.def.p4',
      type: 'mcq',
      prompt: String.raw`$f(x)=x\sin\frac1x$ per $x\neq0$ e $f(0)=0$. In $0$ la funzione è:`,
      options: ['Continua', 'Discontinua di seconda specie: $\\sin\\frac1x$ non ha limite', 'Discontinua di salto', 'Discontinua eliminabile'],
      answer: 0,
      explain: String.raw`$|x\sin\frac1x|\le|x|\to0$: per il teorema del confronto il limite è $0=f(0)$. Che $\sin\frac1x$ non abbia limite non conta: è moltiplicato per $x\to0$ e resta limitato.`,
      level: 2,
    },
    {
      id: 's07.def.p5',
      type: 'num',
      prompt: String.raw`Trova $a$ tale che $f(x)=\begin{cases}\frac{\sqrt{1+x}-1}{x} & x>0\\ a\cos x & x\le0\end{cases}$ sia continua in $0$.`,
      answer: '1/2',
      explain: String.raw`$\frac{\sqrt{1+x}-1}{x}\to\frac12$ (limite notevole $\frac{(1+x)^\alpha-1}{x}\to\alpha$ con $\alpha=\frac12$). $f(0)=a\cos0=a$. Quindi $a=\frac12$.`,
      level: 2,
    },
    {
      id: 's07.def.p6',
      type: 'cloze',
      text: String.raw`Una discontinuità in cui i limiti laterali sono finiti e diversi si dice [[0]]; se almeno un limite laterale è infinito o non esiste si dice [[1]].`,
      blanks: [
        { options: ['di salto (prima specie)', 'eliminabile', 'di seconda specie'], answer: 0 },
        { options: ['di seconda specie', 'di salto (prima specie)', 'eliminabile'], answer: 0 },
      ],
      explain: 'Sono le definizioni: salto = limiti laterali finiti diversi; seconda specie = almeno uno infinito o inesistente.',
      level: 1,
    },
  ],
  flashcards: [
    { id: 's07.def.fc1', kind: 'def', front: String.raw`Funzione continua in $x_0$`, back: String.raw`$f:A\to\R$, $x_0\in A$: $f$ è continua in $x_0$ se $\lim_{x\to x_0}f(x)=f(x_0)$, cioè $\forall\varepsilon>0\ \exists\delta>0$: $x\in A,\ |x-x_0|<\delta\Rightarrow|f(x)-f(x_0)|<\varepsilon$.` },
    { id: 's07.def.fc2', kind: 'def', front: String.raw`$C^0(A)$`, back: String.raw`L'insieme delle funzioni continue in ogni punto di $A$.` },
    { id: 's07.def.fc3', kind: 'thm', front: 'Algebra e composizione di funzioni continue', back: String.raw`Somma, differenza, prodotto e quoziente (con denominatore $\neq0$) di continue sono continue. Se $g$ è continua in $x_0$ e $f$ in $g(x_0)$, $f\circ g$ è continua in $x_0$.` },
    { id: 's07.def.fc4', kind: 'def', front: 'Discontinuità eliminabile', back: String.raw`Esiste finito $\lim_{x\to x_0}f(x)=\ell$ ma $f(x_0)\neq\ell$ (o $f$ non definita in $x_0$). Ponendo $f(x_0)=\ell$ si ottiene il **prolungamento per continuità**.` },
    { id: 's07.def.fc5', kind: 'def', front: 'Discontinuità di salto (prima specie)', back: String.raw`Limiti laterali finiti e diversi. Salto: $f(x_0^+)-f(x_0^-)$.` },
    { id: 's07.def.fc6', kind: 'def', front: 'Discontinuità di seconda specie', back: String.raw`Almeno uno dei limiti laterali è infinito o non esiste (es. $e^{1/x}$, $\sin\frac1x$ in $0$).` },
    { id: 's07.def.fc7', kind: 'metodo', front: 'Continuità di una funzione a tratti con parametro', back: String.raw`In ogni punto di raccordo $x_0$ imponi $f(x_0^-)=f(x_0^+)=f(x_0)$; i limiti dei pezzi "indeterminati" si fanno con i limiti notevoli. Un raccordo = un'equazione.` },
    { id: 's07.def.fc8', kind: 'errore', front: 'Denominatore nullo ⇒ seconda specie?', back: String.raw`No: prima semplifica. $\frac{x^2-1}{x-1}=x+1$ ha in $1$ una discontinuità **eliminabile**.` },
  ],
};

export default {
  id: 's07',
  title: 'Continuità',
  subtitle: 'Discontinuità, teoremi sulle funzioni continue, inversa',
  intro: String.raw`La continuità è la porta d'ingresso dei grandi teoremi: permanenza del segno, zeri, Weierstrass, valori intermedi. All'esame compaiono come domande di teoria (enunciati, dimostrazioni, controesempi) e dentro gli studi di funzione (punti di raccordo, salti).`,
  skills: [
    sDef,
    // @@SKILLS
  ],
};
