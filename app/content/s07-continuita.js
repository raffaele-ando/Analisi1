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
          why = String.raw`$\frac{\sin(${b}x)}{${H.coef(c)}x}=${H.frac(b, c)}\cdot\frac{\sin(${b}x)}{${b}x}\to${Ltex}$`;
        } else if (kind === 1) {
          tex = String.raw`\frac{e^{${b}x}-1}{${H.coef(c)}x}`;
          L = H.fracStr(b, c); Ltex = H.frac(b, c);
          why = String.raw`$\frac{e^{${b}x}-1}{${H.coef(c)}x}=${H.frac(b, c)}\cdot\frac{e^{${b}x}-1}{${b}x}\to${Ltex}$`;
        } else if (kind === 2) {
          const bb = Math.abs(b);
          tex = String.raw`\frac{\log(1+${bb}x)}{${H.coef(c)}x}`;
          L = H.fracStr(bb, c); Ltex = H.frac(bb, c);
          why = String.raw`$\frac{\log(1+${bb}x)}{${H.coef(c)}x}=${H.frac(bb, c)}\cdot\frac{\log(1+${bb}x)}{${bb}x}\to${Ltex}$`;
        } else {
          const bb = Math.abs(b);
          tex = String.raw`\frac{1-\cos(${bb}x)}{${H.coef(c)}x^2}`;
          L = H.fracStr(bb * bb, 2 * c); Ltex = H.frac(bb * bb, 2 * c);
          why = String.raw`$\frac{1-\cos(${bb}x)}{${H.coef(c)}x^2}=${H.frac(bb * bb, c)}\cdot\frac{1-\cos(${bb}x)}{(${bb}x)^2}\to${H.frac(bb * bb, c)}\cdot\frac12=${Ltex}$`;
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

const sTeo = {
  id: 's07.teoremi',
  title: 'Teoremi sulle funzioni continue',
  summary: String.raw`Enunci e dimostri permanenza del segno e valori intermedi, usi il teorema degli zeri e Weierstrass e costruisci controesempi quando cade un'ipotesi.`,
  prereq: ['s07.def', 's04.limiti', 's01.supinf'],
  examRefs: ['Itinere 11/11/2025 · A', 'Appello 10/02/2026 · A', 'Appello 06/07/2026 · A', 'Appello 03/09/2026 · A'],
  lessons: [
    {
      id: 's07.teoremi.L1',
      title: 'Permanenza del segno',
      cards: [
        {
          type: 'learn',
          title: 'Idea',
          body: String.raw`Se una funzione continua è **positiva** in un punto $c$, non può diventare negativa "di colpo": resta positiva anche **vicino** a $c$.

>* **Teorema (permanenza del segno).** Sia $f:A\to\R$ continua in $c\in A$ con $f(c)>0$. Allora esiste $\delta>0$ tale che
$$f(x)>0\quad\text{per ogni } x\in A\cap(c-\delta,\,c+\delta).$$

Vale lo stesso con $f(c)<0$ (si applica il teorema a $-f$).`,
          plot: { fns: [{ f: '1+sin(2x)/2+x/3', label: 'f' }], x: [-1, 4], y: [-0.5, 3], points: [[1.5, 1.5706, 'f(c) > 0']], vlines: [1, 2], hlines: [0.7853] },
        },
        {
          type: 'example',
          title: 'Dimostrazione',
          problem: String.raw`Dimostra la permanenza del segno.`,
          steps: [
            String.raw`Poiché $f(c)>0$, posso scegliere $\varepsilon=\frac{f(c)}{2}>0$ nella definizione di continuità.`,
            String.raw`Esiste quindi $\delta>0$ tale che per $x\in A$, $|x-c|<\delta$: $\ |f(x)-f(c)|<\frac{f(c)}{2}$.`,
            String.raw`Sciolgo il modulo: $f(c)-\frac{f(c)}{2}<f(x)<f(c)+\frac{f(c)}{2}$.`,
            String.raw`La disuguaglianza di sinistra dà $f(x)>\frac{f(c)}{2}>0$ per ogni $x\in A\cap(c-\delta,c+\delta)$. $\square$`,
          ],
          result: String.raw`La scelta chiave è $\varepsilon=\frac{f(c)}2$ (va bene qualunque $0<\varepsilon\le f(c)$).`,
        },
        {
          id: 's07.teoremi.L1.q1',
          type: 'mcq',
          prompt: String.raw`Nella dimostrazione, quale scelta di $\varepsilon$ **non** funziona?`,
          options: [String.raw`$\varepsilon=2f(c)$`, String.raw`$\varepsilon=\frac{f(c)}{2}$`, String.raw`$\varepsilon=\frac{f(c)}{3}$`, String.raw`$\varepsilon=f(c)$`],
          answer: 0,
          explain: String.raw`Da $|f(x)-f(c)|<\varepsilon$ si ricava $f(x)>f(c)-\varepsilon$. Serve $f(c)-\varepsilon\ge0$, cioè $\varepsilon\le f(c)$. Con $\varepsilon=2f(c)$ si ottiene solo $f(x)>-f(c)$, che non dice nulla sul segno.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L1.q2',
          type: 'order',
          prompt: 'Riordina i passi della dimostrazione della permanenza del segno (scarta il passo sbagliato).',
          steps: [
            String.raw`Ipotesi: $f$ continua in $c$ e $f(c)>0$. Scelgo $\varepsilon=\frac{f(c)}2>0$.`,
            String.raw`Per la continuità esiste $\delta>0$ tale che $x\in A$, $|x-c|<\delta\Rightarrow|f(x)-f(c)|<\frac{f(c)}2$.`,
            String.raw`Quindi $-\frac{f(c)}2<f(x)-f(c)<\frac{f(c)}2$.`,
            String.raw`Dalla prima disuguaglianza: $f(x)>\frac{f(c)}2>0$ in $A\cap(c-\delta,c+\delta)$.`,
          ],
          distractors: [String.raw`Per la continuità esiste $\varepsilon>0$ tale che per ogni $\delta>0$ si ha $|f(x)-f(c)|<\varepsilon$.`],
          explain: String.raw`L'ordine dei quantificatori è "per ogni $\varepsilon$ esiste $\delta$": si **sceglie** $\varepsilon$ e la continuità **fornisce** $\delta$. Il distrattore inverte i quantificatori.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L1.q3',
          type: 'tf',
          prompt: String.raw`Se $f$ è continua in $c$ e $f(c)\ge0$, allora $f(x)\ge0$ in un intorno di $c$.`,
          answer: false,
          explain: String.raw`Con $f(c)=0$ il teorema non dice nulla. Controesempio: $f(x)=x$ in $c=0$: $f(0)=0$ ma $f$ è negativa per ogni $x<0$ vicino a $0$. La permanenza richiede la disuguaglianza **stretta**.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L1.q4',
          type: 'tf',
          prompt: String.raw`Se $f$ **non** è continua in $c$, può accadere che $f(c)>0$ ma che in ogni intorno di $c$ ci siano punti con $f<0$.`,
          answer: true,
          explain: String.raw`Esempio: $f(x)=-1$ per $x\neq0$ e $f(0)=1$. In $0$ è positiva, ovunque intorno è negativa. Senza continuità il teorema cade.`,
          level: 1,
        },
        {
          id: 's07.teoremi.L1.q5',
          type: 'cloze',
          text: String.raw`**Permanenza del segno.** Sia $f:A\to\R$ [[0]] in $c\in A$ con $f(c)>0$. Allora esiste [[1]] tale che $f(x)>0$ per ogni $x\in$ [[2]].`,
          blanks: [
            { options: ['continua', 'derivabile', 'limitata'], answer: 0 },
            { options: [String.raw`$\delta>0$`, String.raw`$\varepsilon>0$`, String.raw`$c'\neq c$`], answer: 0 },
            { options: [String.raw`$A\cap(c-\delta,c+\delta)$`, String.raw`$A$`, String.raw`$(c,c+\delta)$ soltanto`], answer: 0 },
          ],
          explain: String.raw`Basta la continuità (non la derivabilità). La tesi è **locale**: vale in un intorno di $c$ (intersecato con il dominio), non in tutto $A$.`,
          level: 1,
        },
        {
          id: 's07.teoremi.L1.q6',
          type: 'num',
          prompt: String.raw`$f$ è continua in $c$ con $f(c)=6$. Con la scelta $\varepsilon=\frac{f(c)}{2}$, quale limitazione dal basso si ottiene per $f(x)$ vicino a $c$?`,
          answer: '3',
          explain: String.raw`$\varepsilon=3$: $|f(x)-6|<3\Rightarrow 3<f(x)<9$. Quindi $f(x)>3>0$.`,
          level: 1,
        },
        {
          id: 's07.teoremi.L1.q7',
          type: 'mcq',
          prompt: String.raw`Quale fatto si dimostra con la permanenza del segno (in versione per le funzioni)?`,
          options: [
            String.raw`Se $f$ è continua e $\{x: f(x)>0\}$ contiene $c$, allora contiene un intorno di $c$`,
            String.raw`Una funzione continua su $[a,b]$ ha massimo`,
            String.raw`Una funzione continua su $[a,b]$ con $f(a)<0<f(b)$ si annulla`,
            String.raw`Una funzione derivabile è continua`,
          ],
          answer: 0,
          explain: String.raw`È esattamente l'enunciato: l'insieme dove $f>0$ contiene un intorno di ogni suo punto. Le altre sono Weierstrass, il teorema degli zeri (che nella dimostrazione per bisezione usa proprio la permanenza del segno) e "derivabile ⇒ continua".`,
          level: 2,
        },
        {
          id: 's07.teoremi.L1.q8',
          type: 'open',
          prompt: String.raw`Enunciare e dimostrare il teorema della permanenza del segno.`,
          source: 'Appello 03/09/2026 · A',
          points: 2,
          answer: String.raw`**Enunciato.** Sia $f:A\to\R$ continua in $c\in A$ con $f(c)>0$. Allora esiste $\delta>0$ tale che $f(x)>0$ per ogni $x\in A\cap(c-\delta,c+\delta)$.

**Dimostrazione.** Scelgo $\varepsilon=\frac{f(c)}2>0$. Per la continuità in $c$ esiste $\delta>0$ tale che per ogni $x\in A$ con $|x-c|<\delta$ si ha $|f(x)-f(c)|<\frac{f(c)}2$, cioè $f(c)-\frac{f(c)}2<f(x)<f(c)+\frac{f(c)}2$. In particolare $f(x)>\frac{f(c)}2>0$ per ogni $x\in A\cap(c-\delta,c+\delta)$. $\square$`,
          rubric: ['Ipotesi: continuità in c e f(c) > 0 (stretta)', 'Tesi locale: esiste δ, intorno intersecato con il dominio', 'Scelta di ε = f(c)/2 (o 0 < ε ≤ f(c))', 'Uso corretto della definizione ε–δ', 'Conclusione f(x) > f(c)/2 > 0'],
          level: 3,
        },
      ],
    },
    {
      id: 's07.teoremi.L2',
      title: 'Il teorema degli zeri',
      cards: [
        {
          type: 'learn',
          title: 'Se cambia segno, si annulla',
          body: String.raw`>* **Teorema degli zeri (Bolzano).** Sia $f$ continua sull'intervallo **chiuso e limitato** $[a,b]$ con $f(a)\cdot f(b)<0$. Allora esiste $c\in(a,b)$ tale che $f(c)=0$.

Graficamente: per passare da sotto l'asse $x$ a sopra senza staccare la penna bisogna attraversarlo.

**Come si usa per un'equazione** $f(x)=0$:
1. porta tutto a primo membro e chiama $f$ la funzione;
2. controlla che $f$ sia **continua** su $[a,b]$;
3. calcola $f(a)$ e $f(b)$ e verifica che abbiano **segni opposti**.

> Il teorema garantisce **almeno** uno zero. Per l'**unicità** serve altro, per esempio che $f$ sia strettamente monotona.`,
          plot: { fns: [{ f: 'x^3+x-1', label: 'x³+x−1' }], x: [-0.5, 1.5], y: [-2, 2], points: [[0, -1], [1, 1], [0.6823, 0, 'c']] },
        },
        {
          type: 'example',
          title: 'Esempio da esame',
          problem: String.raw`L'equazione $\log(2+x)+x=0$ ha soluzioni in $(-1,1)$?`,
          steps: [
            String.raw`Pongo $f(x)=\log(2+x)+x$. È continua dove $2+x>0$, cioè per $x>-2$: in particolare su $[-1,1]$.`,
            {
              text: String.raw`$f(-1)=\log1-1=-1<0$.`,
              ask: { type: 'num', prompt: String.raw`Calcola $f(-1)$.`, answer: '-1', explain: String.raw`$\log(2-1)+(-1)=\log1-1=0-1=-1$.` },
            },
            {
              text: String.raw`$f(1)=\log3+1>0$.`,
              ask: { type: 'num', prompt: String.raw`Calcola $f(1)$ (scrivi pure log(3)+1).`, answer: 'log(3)+1', explain: String.raw`$\log(2+1)+1=\log3+1$, positivo perché $\log3>0$.` },
            },
            String.raw`Segni opposti: per il teorema degli zeri esiste $c\in(-1,1)$ con $f(c)=0$.`,
            String.raw`Inoltre $f$ è somma di funzioni strettamente crescenti, quindi strettamente crescente: la soluzione è **unica**.`,
          ],
          result: String.raw`Sì, e la soluzione in $(-1,1)$ è unica.`,
          plot: { fns: [{ f: 'log(2+x)+x', label: 'f' }], x: [-1.5, 1.5], y: [-2, 2.5], points: [[-1, -1], [1, 2.0986]] },
        },
        {
          id: 's07.teoremi.L2.q1',
          type: 'mcq',
          prompt: String.raw`In quale intervallo il teorema degli zeri garantisce una soluzione di $x^3-3x+1=0$?`,
          options: [String.raw`$(0,1)$`, String.raw`$(1,\tfrac32)$`, String.raw`$(-1,0)$`, String.raw`$(2,3)$`],
          answer: 0,
          explain: String.raw`$f(x)=x^3-3x+1$: $f(0)=1>0$, $f(1)=-1<0$: cambio di segno in $(0,1)$. Invece $f(1)=-1$ e $f(\frac32)=-\frac{1}{8}$ hanno lo stesso segno; $f(-1)=3$ e $f(0)=1$ pure; $f(2)=3$, $f(3)=19$ pure. Attenzione: stesso segno agli estremi **non** vuol dire che non ci sono zeri, solo che il teorema non si applica.`,
          level: 1,
        },
        {
          id: 's07.teoremi.L2.q2',
          type: 'mcq',
          prompt: String.raw`Per mostrare che $e^x=3-x$ ha una soluzione, quale $f$ e quale intervallo funzionano?`,
          options: [
            String.raw`$f(x)=e^x+x-3$ su $[0,1]$`,
            String.raw`$f(x)=e^x+x-3$ su $[1,2]$`,
            String.raw`$f(x)=e^x-x-3$ su $[0,1]$`,
            String.raw`$f(x)=e^x\cdot(3-x)$ su $[0,1]$`,
          ],
          answer: 0,
          explain: String.raw`Porto tutto a sinistra: $f(x)=e^x+x-3$, continua. $f(0)=-2<0$, $f(1)=e-2>0$. Su $[1,2]$: $f(1)>0$ e $f(2)=e^2-1>0$, niente cambio di segno. $e^x-x-3$ ha un segno sbagliato; il prodotto non c'entra con l'equazione.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L2.q3',
          type: 'tf',
          prompt: String.raw`$f(x)=\frac1x$ su $[-1,1]$ (con $f(0)=0$) ha $f(-1)<0<f(1)$, quindi per il teorema degli zeri si annulla in $(-1,1)$.`,
          answer: false,
          explain: String.raw`La conclusione "si annulla" è vera per caso ($f(0)=0$ per definizione), ma il ragionamento è sbagliato: $f$ non è continua in $0$, quindi il teorema **non** si può usare. Senza la definizione artificiale in $0$, $\frac1x$ non si annulla mai pur cambiando segno.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L2.q4',
          type: 'tf',
          prompt: String.raw`Sia $f:[a,b]\to\R$ con $f(a)<0$, $f(b)>0$, ed esista $c\in(a,b)$ con $f(c)=0$. Allora $f$ è necessariamente continua.`,
          answer: false,
          source: 'Appello 10/02/2026 · A',
          explain: String.raw`Il teorema degli zeri è una condizione **sufficiente**, non necessaria. Controesempio su $[0,2]$: $f(x)=-1$ per $x<1$, $f(1)=0$, $f(x)=2$ per $x>1$. Ha uno zero ma ha un salto in $1$.`,
          level: 3,
        },
        {
          id: 's07.teoremi.L2.q5',
          type: 'num',
          prompt: String.raw`$f$ è continua su $[0,5]$ con $f(0)=2$, $f(2)=-1$, $f(5)=3$. Quanti zeri, **come minimo**, ha $f$ in $(0,5)$?`,
          answer: '2',
          explain: String.raw`Cambio di segno su $[0,2]$ (da $2$ a $-1$) e su $[2,5]$ (da $-1$ a $3$): il teorema degli zeri dà uno zero in $(0,2)$ e uno in $(2,5)$, distinti. Potrebbero essercene di più, ma due sono garantiti.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L2.q6',
          type: 'tuple',
          prompt: String.raw`**Bisezione.** Per $f(x)=x^2-2$ su $[1,2]$ calcoli $f(1{,}5)$. In quale metà sta sicuramente uno zero? Scrivi gli estremi.`,
          labels: ['a', 'b'],
          answer: ['1', '1.5'],
          explain: String.raw`$f(1)=-1<0$, $f(1{,}5)=2{,}25-2=0{,}25>0$: il cambio di segno è in $[1;\,1{,}5]$. Ripetendo si approssima $\sqrt2\approx1{,}414$. È anche l'idea della dimostrazione del teorema degli zeri.`,
          level: 1,
        },
        {
          id: 's07.teoremi.L2.q7',
          type: 'problem',
          prompt: String.raw`Si stabilisca se l'equazione $\log(2+x)+x=0$ ha soluzioni nell'intervallo $(-1,1)$, motivando la risposta.`,
          source: 'Itinere 11/11/2025 · A',
          points: 3,
          level: 3,
          parts: [
            { type: 'num', prompt: String.raw`$f(x)=\log(2+x)+x$: quanto vale $f(-1)$?`, answer: '-1', explain: String.raw`$\log1-1=-1$.` },
            { type: 'num', prompt: String.raw`Quanto vale $f(1)$?`, answer: 'log(3)+1', explain: String.raw`$\log3+1>0$.` },
            {
              type: 'mcq',
              prompt: 'Conclusione:',
              options: [
                String.raw`Esiste una soluzione in $(-1,1)$ per il teorema degli zeri, ed è unica perché $f$ è strettamente crescente`,
                String.raw`Esiste almeno una soluzione, ma non si può sapere quante`,
                String.raw`Non ci sono soluzioni perché $\log(2+x)>0$ in $(-1,1)$`,
                String.raw`Non si può dire nulla senza risolvere l'equazione`,
              ],
              answer: 0,
              explain: String.raw`Zeri: $f$ continua su $[-1,1]$, $f(-1)<0<f(1)$. Unicità: $\log(2+x)$ e $x$ sono strettamente crescenti, la somma pure. La terza è falsa: $\log(2+x)+x$ è negativo vicino a $-1$.`,
            },
          ],
          solution: String.raw`Sia $f(x)=\log(2+x)+x$, definita e continua per $x>-2$, quindi continua su $[-1,1]$.

$f(-1)=\log 1-1=-1<0$, $\quad f(1)=\log3+1>0$.

Per il **teorema degli zeri** esiste $c\in(-1,1)$ con $f(c)=0$: l'equazione ha soluzione in $(-1,1)$.

Inoltre $f$ è somma di due funzioni strettamente crescenti, quindi è strettamente crescente e la soluzione è unica (si può anche osservare $f'(x)=\frac1{2+x}+1>0$).`,
        },
        {
          id: 's07.teoremi.L2.q8',
          type: 'order',
          prompt: String.raw`Dimostra che ogni $f:[0,1]\to[0,1]$ continua ha un **punto fisso** ($f(c)=c$). Riordina.`,
          steps: [
            String.raw`Considero $g(x)=f(x)-x$, continua su $[0,1]$.`,
            String.raw`$g(0)=f(0)\ge0$ e $g(1)=f(1)-1\le0$, perché $0\le f\le1$.`,
            String.raw`Se $g(0)=0$ o $g(1)=0$ ho finito; altrimenti $g(0)>0>g(1)$.`,
            String.raw`Per il teorema degli zeri esiste $c\in(0,1)$ con $g(c)=0$, cioè $f(c)=c$.`,
          ],
          distractors: [String.raw`Per il teorema di Weierstrass $g$ ha un massimo, quindi $g(c)=0$.`],
          explain: String.raw`Il trucco è sempre lo stesso: trasformare "$f(x)=$ qualcosa" in "$g(x)=0$" e usare il teorema degli zeri. Weierstrass garantisce max e min, non uno zero.`,
          level: 3,
        },
      ],
    },
    {
      id: 's07.teoremi.L3',
      title: 'Weierstrass, valori intermedi e controesempi',
      cards: [
        {
          type: 'learn',
          title: 'Weierstrass',
          body: String.raw`>* **Teorema di Weierstrass.** Se $f$ è continua sull'intervallo **chiuso e limitato** $[a,b]$, allora $f$ ha **massimo** e **minimo** assoluti in $[a,b]$: esistono $x_m,x_M\in[a,b]$ con
$$f(x_m)\le f(x)\le f(x_M)\quad\forall x\in[a,b].$$

Le ipotesi sono tre: **continuità**, intervallo **chiuso**, intervallo **limitato**. Se ne togli una, il teorema può fallire:
- $(0,1)$ non chiuso: $f(x)=x$ non ha né max né min (sup $1$ e inf $0$ non sono assunti);
- $[0,+\infty)$ non limitato: $\arctan x$ non ha massimo ($\sup=\frac\pi2$);
- $f$ discontinua: $f(x)=x$ su $[0,1)$, $f(1)=0$ non ha massimo.`,
          plot: { fns: [{ f: 'atan(x)', label: 'arctan x' }], x: [0, 10], y: [-0.2, 1.8], hlines: [1.5708] },
        },
        {
          id: 's07.teoremi.L3.q1',
          type: 'match',
          prompt: 'Abbina ogni funzione all\'ipotesi di Weierstrass che manca (e che la fa fallire).',
          pairs: [
            [String.raw`$\frac1x$ su $(0,1]$`, 'intervallo non chiuso'],
            [String.raw`$e^{-x}$ su $[0,+\infty)$`, 'intervallo non limitato'],
            [String.raw`$f(x)=x$ su $[0,1)$, $f(1)=0$`, 'funzione non continua'],
          ],
          explain: String.raw`$\frac1x$ su $(0,1]$ non è limitata superiormente (manca $0$). $e^{-x}$ su $[0,+\infty)$ ha $\inf=0$ non assunto. La terza ha $\sup=1$ non assunto per colpa del salto in $1$.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L3.q2',
          type: 'tf',
          prompt: String.raw`Se $f$ non è continua su $[a,b]$, allora $f$ non ha massimo su $[a,b]$.`,
          answer: false,
          explain: String.raw`Weierstrass dà una condizione **sufficiente**. Esempio: $f(x)=1$ per $x\in\Q$, $0$ altrimenti, su $[0,1]$: è discontinua ovunque ma ha max $1$ e min $0$.`,
          level: 2,
        },
        {
          type: 'learn',
          title: 'Valori intermedi',
          body: String.raw`>* **Teorema dei valori intermedi.** Sia $f$ continua su $[a,b]$. Allora $f$ assume **tutti** i valori compresi tra il minimo $m$ e il massimo $M$: per ogni $\lambda\in[m,M]$ esiste $c\in[a,b]$ con $f(c)=\lambda$.

In particolare assume tutti i valori tra $f(a)$ e $f(b)$, e
$$f([a,b])=[m,M].$$

Più in generale: una funzione continua manda intervalli in intervalli.

**Dimostrazione (idea).** Si riduce al teorema degli zeri applicato a $g(x)=f(x)-\lambda$.`,
        },
        {
          type: 'example',
          title: 'Dimostrazione dei valori intermedi',
          problem: String.raw`Dimostra il teorema dei valori intermedi.`,
          steps: [
            String.raw`Per Weierstrass esistono $x_m,x_M\in[a,b]$ con $f(x_m)=m$ e $f(x_M)=M$.`,
            String.raw`Sia $\lambda\in(m,M)$ (se $\lambda=m$ o $\lambda=M$ basta prendere $x_m$ o $x_M$).`,
            String.raw`Considero $g(x)=f(x)-\lambda$, continua sull'intervallo chiuso $I$ di estremi $x_m$ e $x_M$.`,
            {
              text: String.raw`$g(x_m)=m-\lambda<0$ e $g(x_M)=M-\lambda>0$.`,
              ask: { type: 'mcq', prompt: String.raw`Che segno ha $g(x_m)=m-\lambda$?`, options: ['negativo', 'positivo', 'nullo'], answer: 0, explain: String.raw`$\lambda>m$, quindi $m-\lambda<0$.` },
            },
            String.raw`Per il teorema degli zeri esiste $c$ in $I\subseteq[a,b]$ con $g(c)=0$, cioè $f(c)=\lambda$. $\square$`,
          ],
          result: String.raw`$f([a,b])=[m,M]$.`,
        },
        {
          id: 's07.teoremi.L3.q3',
          type: 'order',
          prompt: 'Riordina la dimostrazione del teorema dei valori intermedi (scarta i passi sbagliati).',
          steps: [
            String.raw`Per Weierstrass $f$ ha minimo $m=f(x_m)$ e massimo $M=f(x_M)$ su $[a,b]$.`,
            String.raw`Fisso $\lambda\in(m,M)$ (i casi $\lambda=m$, $\lambda=M$ sono ovvi).`,
            String.raw`Definisco $g(x)=f(x)-\lambda$, continua sull'intervallo chiuso di estremi $x_m$ e $x_M$.`,
            String.raw`$g(x_m)=m-\lambda<0$ e $g(x_M)=M-\lambda>0$.`,
            String.raw`Per il teorema degli zeri esiste $c$ tra $x_m$ e $x_M$ con $g(c)=0$, cioè $f(c)=\lambda$.`,
          ],
          distractors: [
            String.raw`Definisco $g(x)=\lambda\, f(x)$, continua su $[a,b]$.`,
            String.raw`Per il teorema di Rolle esiste $c$ con $g'(c)=0$, cioè $f(c)=\lambda$.`,
          ],
          explain: String.raw`La funzione ausiliaria giusta è la **differenza** $f-\lambda$: si annulla esattamente dove $f=\lambda$. Rolle riguarda la derivata e richiede derivabilità: qui non c'entra.`,
          level: 3,
        },
        {
          id: 's07.teoremi.L3.q4',
          type: 'interval',
          prompt: String.raw`Qual è l'immagine $f([-1,2])$ di $f(x)=x^2$?`,
          answer: '[0,4]',
          explain: String.raw`$f$ è continua su $[-1,2]$: per Weierstrass e valori intermedi l'immagine è $[m,M]$. Minimo $0$ in $x=0$, massimo $4$ in $x=2$. Errore tipico: rispondere $[f(-1),f(2)]=[1,4]$, dimenticando che il minimo è nel punto interno $0$.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L3.q5',
          type: 'mcq',
          prompt: String.raw`$f$ è continua su $[0,3]$ con $f(0)=5$ e $f(3)=-1$. Quale affermazione è **sicuramente** vera?`,
          options: [
            String.raw`Esiste $c\in(0,3)$ con $f(c)=\pi$`,
            String.raw`Esiste $c\in(0,3)$ con $f(c)=6$`,
            String.raw`Il massimo di $f$ è $5$`,
            String.raw`$f$ è decrescente`,
          ],
          answer: 0,
          explain: String.raw`$\pi\approx3{,}14$ sta tra $-1$ e $5$: valori intermedi. Il valore $6$ potrebbe non essere assunto; il massimo potrebbe essere maggiore di $5$ (la funzione può salire e poi scendere); nulla dice che $f$ sia monotona.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L3.q6',
          type: 'tf',
          prompt: String.raw`Se $f$ è continua su $\R$ e assume i valori $-2$ e $7$, allora assume anche il valore $0$.`,
          answer: true,
          explain: String.raw`Se $f(x_1)=-2$ e $f(x_2)=7$, applico i valori intermedi sull'intervallo chiuso di estremi $x_1,x_2$: ogni valore tra $-2$ e $7$, compreso $0$, è assunto.`,
          level: 2,
        },
        {
          id: 's07.teoremi.L3.q7',
          type: 'open',
          prompt: String.raw`Enunciare e dimostrare il teorema dei valori intermedi.`,
          source: 'Appello 06/07/2026 · A',
          points: 3,
          answer: String.raw`**Enunciato.** Sia $f:[a,b]\to\R$ continua, e siano $m=\min f$, $M=\max f$ (esistono per Weierstrass). Allora per ogni $\lambda\in[m,M]$ esiste $c\in[a,b]$ con $f(c)=\lambda$; cioè $f([a,b])=[m,M]$.

**Dimostrazione.** Siano $x_m,x_M$ con $f(x_m)=m$, $f(x_M)=M$. Se $\lambda=m$ o $\lambda=M$ la tesi è ovvia. Sia $m<\lambda<M$ e $g(x)=f(x)-\lambda$: è continua sull'intervallo chiuso di estremi $x_m$ e $x_M$, con $g(x_m)=m-\lambda<0$ e $g(x_M)=M-\lambda>0$. Per il teorema degli zeri esiste $c$ tra $x_m$ e $x_M$ con $g(c)=0$, cioè $f(c)=\lambda$. $\square$`,
          rubric: ['Ipotesi: f continua su intervallo chiuso e limitato', 'Tesi: assume ogni valore tra min e max (o tra f(a) e f(b))', 'Uso di Weierstrass per min e max', 'Funzione ausiliaria g = f − λ e segni agli estremi', 'Applicazione corretta del teorema degli zeri'],
          level: 3,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's07.teoremi.gen-zeri',
      type: 'gen',
      level: 2,
      gen: (R) => {
        for (let t = 0; t < 200; t++) {
          const p = R.int(-5, 3), q = R.int(-4, 4);
          const f = (x) => x * x * x + p * x + q;
          const ks = [-3, -2, -1, 0, 1, 2];
          if (ks.some((k) => f(k) === 0) || f(3) === 0) continue;
          const good = ks.filter((k) => f(k) * f(k + 1) < 0);
          const badK = ks.filter((k) => f(k) * f(k + 1) > 0);
          if (!good.length || badK.length < 3) continue;
          const g = R.pick(good);
          const opts = [g, ...R.sample(badK, 3)];
          const ftex = H.poly([1, 0, p, q]);
          return {
            type: 'mcq',
            prompt: String.raw`In quale intervallo il teorema degli zeri garantisce una soluzione di $${ftex}=0$?`,
            options: opts.map((k) => `$(${k},${k + 1})$`),
            answer: 0,
            explain: String.raw`$f(x)=${ftex}$ è un polinomio, quindi continua. $f(${g})=${f(g)}$ e $f(${g + 1})=${f(g + 1)}$ hanno segni opposti: c'è uno zero in $(${g},${g + 1})$. Negli altri intervalli proposti $f$ ha lo stesso segno agli estremi (${opts.slice(1).map((k) => `$f(${k})=${f(k)}$, $f(${k + 1})=${f(k + 1)}$`).join('; ')}), quindi il teorema non si applica.`,
          };
        }
        throw new Error('nessun polinomio adatto');
      },
    },
    {
      id: 's07.teoremi.gen-immagine',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const h = R.int(-2, 2), k = R.int(-4, 4);
        const a = h - R.int(0, 3), b = h + R.int(1, 3);
        const s = R.sign();
        const f = (x) => s * (x - h) * (x - h) + k;
        const vals = [f(a), f(b), f(h)];
        const m = Math.min(...vals), M = Math.max(...vals);
        const ftex = s > 0 ? H.poly([1, -2 * h, h * h + k]) : H.poly([-1, 2 * h, -h * h + k]);
        return {
          type: 'interval',
          prompt: String.raw`Determina l'immagine $f([${a},${b}])$ di $f(x)=${ftex}$.`,
          answer: `[${m},${M}]`,
          explain: String.raw`$f$ è continua su un intervallo chiuso e limitato: per Weierstrass ha min e max, per i valori intermedi l'immagine è $[m,M]$. Il vertice della parabola è in $x=${h}$ (${a === h ? 'estremo' : 'interno'}): $f(${h})=${f(h)}$; agli estremi $f(${a})=${f(a)}$, $f(${b})=${f(b)}$. Quindi $m=${m}$, $M=${M}$.`,
        };
      },
    },
    {
      id: 's07.teoremi.gen-bisezione',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const n = R.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24]);
        const a = Math.floor(Math.sqrt(n)), b = a + 1;
        const m = a + 0.5, fm = m * m - n;
        const ans = fm > 0 ? [String(a), String(m)] : [String(m), String(b)];
        return {
          type: 'tuple',
          prompt: String.raw`Bisezione per $f(x)=x^2-${n}$ su $[${a},${b}]$: dopo aver calcolato $f$ nel punto medio, in quale metà sta sicuramente uno zero? (scrivi gli estremi, es. 2.5)`,
          labels: ['da', 'a'],
          answer: ans,
          explain: String.raw`$f(${a})=${a * a - n}<0$, $f(${b})=${b * b - n}>0$. Punto medio $${String(m).replace('.', '{,}')}$: $f=${String(m * m).replace('.', '{,}')}-${n}=${String(fm).replace('.', '{,}')}$, ${fm > 0 ? 'positivo: il cambio di segno è nella metà di sinistra' : 'negativo: il cambio di segno è nella metà di destra'}.`,
        };
      },
    },
    {
      id: 's07.teoremi.gen-intermedi',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const A = R.int(-6, 2), B = A + R.int(3, 8);
        const swap = R.chance(0.5);
        const fa = swap ? B : A, fb = swap ? A : B;
        const inside = R.int(A + 1, B - 1);
        const out1 = B + R.int(1, 4), out2 = A - R.int(1, 4);
        return {
          type: 'mcq',
          prompt: String.raw`$f$ è continua su $[0,4]$ con $f(0)=${fa}$ e $f(4)=${fb}$. Quale valore è **sicuramente** assunto da $f$ in $[0,4]$?`,
          options: [String(inside), String(out1), String(out2), 'Nessuno: senza la formula di $f$ non si può dire'],
          answer: 0,
          explain: String.raw`Per i valori intermedi $f$ assume tutti i valori tra $${Math.min(fa, fb)}$ e $${Math.max(fa, fb)}$, in particolare $${inside}$. I valori $${out1}$ e $${out2}$ sono fuori: potrebbero essere assunti oppure no, non è garantito.`,
        };
      },
    },
    {
      id: 's07.teoremi.p1',
      type: 'open',
      prompt: String.raw`Enunciare il teorema di Weierstrass e mostrare con tre controesempi che nessuna ipotesi può essere tolta.`,
      answer: String.raw`**Weierstrass.** Se $f:[a,b]\to\R$ è continua sull'intervallo chiuso e limitato $[a,b]$, allora esistono $x_m,x_M\in[a,b]$ con $f(x_m)\le f(x)\le f(x_M)$ per ogni $x\in[a,b]$.

Controesempi: (1) intervallo non chiuso: $f(x)=x$ su $(0,1)$ non ha max né min; (2) non limitato: $\arctan x$ su $[0,+\infty)$ non ha max; (3) non continua: $f(x)=x$ su $[0,1)$, $f(1)=0$, non ha max.`,
      rubric: ['Ipotesi: continuità su intervallo chiuso e limitato', 'Tesi: esistenza di max e min assoluti', 'Controesempio con intervallo non chiuso', 'Controesempio con intervallo illimitato', 'Controesempio con f discontinua'],
      level: 2,
    },
    {
      id: 's07.teoremi.p2',
      type: 'cloze',
      text: String.raw`**Teorema degli zeri.** Sia $f$ [[0]] su $[a,b]$ con [[1]]. Allora esiste $c\in(a,b)$ tale che [[2]].`,
      blanks: [
        { options: ['continua', 'derivabile', 'monotona'], answer: 0 },
        { options: [String.raw`$f(a)\cdot f(b)<0$`, String.raw`$f(a)\cdot f(b)>0$`, String.raw`$f(a)=f(b)$`], answer: 0 },
        { options: [String.raw`$f(c)=0$`, String.raw`$f'(c)=0$`, String.raw`$f(c)=\frac{f(a)+f(b)}2$`], answer: 0 },
      ],
      explain: String.raw`Ipotesi: continuità e segni opposti agli estremi. $f(a)=f(b)$ e $f'(c)=0$ sono di Rolle, che è un altro teorema.`,
      level: 1,
    },
    {
      id: 's07.teoremi.p3',
      type: 'tf',
      prompt: String.raw`Ogni polinomio di grado dispari ha almeno uno zero reale.`,
      answer: true,
      explain: String.raw`Se il coefficiente direttivo è positivo, $p(x)\to-\infty$ per $x\to-\infty$ e $p(x)\to+\infty$ per $x\to+\infty$: esistono $a<b$ con $p(a)<0<p(b)$ e si applica il teorema degli zeri su $[a,b]$.`,
      level: 2,
    },
    {
      id: 's07.teoremi.p4',
      type: 'order',
      prompt: 'Riordina la dimostrazione della permanenza del segno.',
      steps: [
        String.raw`Sia $f(c)>0$; scelgo $\varepsilon=\frac{f(c)}2$.`,
        String.raw`Per la continuità in $c$ trovo $\delta>0$ con $|f(x)-f(c)|<\frac{f(c)}2$ per $x\in A$, $|x-c|<\delta$.`,
        String.raw`Ne segue $f(x)>f(c)-\frac{f(c)}2=\frac{f(c)}2$.`,
        String.raw`Quindi $f>0$ in $A\cap(c-\delta,c+\delta)$.`,
      ],
      distractors: [String.raw`Scelgo $\varepsilon=2f(c)$, così $f(x)>-f(c)$.`],
      explain: String.raw`Con $\varepsilon=2f(c)$ si ottiene $f(x)>-f(c)$, che non garantisce il segno: serve $\varepsilon\le f(c)$.`,
      level: 2,
    },
    {
      id: 's07.teoremi.p5',
      type: 'mcq',
      prompt: String.raw`Quale funzione assume sicuramente massimo e minimo sull'intervallo indicato?`,
      options: [
        String.raw`$x^3-\sin x$ su $[-2,5]$`,
        String.raw`$\frac{1}{x-1}$ su $[0,2]$`,
        String.raw`$\log x$ su $(0,1]$`,
        String.raw`$x^2$ su $[0,+\infty)$`,
      ],
      answer: 0,
      explain: String.raw`Solo la prima soddisfa Weierstrass: continua su intervallo chiuso e limitato. $\frac1{x-1}$ non è definita (né continua) in $1\in[0,2]$; $\log x$ su $(0,1]$ è illimitata inferiormente; $x^2$ su $[0,+\infty)$ non ha massimo.`,
      level: 1,
    },
    {
      id: 's07.teoremi.p6',
      type: 'tf',
      prompt: String.raw`L'equazione $\cos x=x$ ha almeno una soluzione in $\left(0,\frac\pi2\right)$.`,
      answer: true,
      explain: String.raw`$f(x)=\cos x-x$ è continua, $f(0)=1>0$, $f(\frac\pi2)=-\frac\pi2<0$: teorema degli zeri.`,
      level: 1,
    },
    {
      id: 's07.teoremi.p7',
      type: 'open',
      prompt: String.raw`Siano $f(a)<0$, $f(b)>0$ e supponiamo che esista $c\in(a,b)$ con $f(c)=0$. Si può concludere che $f$ è continua in $[a,b]$? Motivare.`,
      source: 'Appello 10/02/2026 · A',
      points: 2,
      answer: String.raw`No. Il teorema degli zeri afferma che continuità e cambio di segno **implicano** l'esistenza di uno zero, ma non vale il viceversa. Controesempio su $[0,2]$: $f(x)=-1$ per $0\le x<1$, $f(1)=0$, $f(x)=1$ per $1<x\le2$. Si ha $f(0)<0<f(2)$ e $f(1)=0$, ma $f$ ha un salto in $1$.`,
      rubric: ['Risposta corretta: no', 'Distinzione tra condizione sufficiente e necessaria', 'Controesempio esplicito e corretto', 'Verifica che il controesempio soddisfa le ipotesi'],
      level: 3,
    },
  ],
  flashcards: [
    { id: 's07.teoremi.fc1', kind: 'thm', front: 'Permanenza del segno (funzioni)', back: String.raw`$f$ continua in $c\in A$, $f(c)>0$ $\Rightarrow$ $\exists\delta>0$: $f(x)>0$ $\forall x\in A\cap(c-\delta,c+\delta)$.` },
    { id: 's07.teoremi.fc2', kind: 'dim', front: 'Dimostrazione della permanenza del segno', back: String.raw`Scelgo $\varepsilon=\frac{f(c)}2>0$. Per continuità $\exists\delta$: $|x-c|<\delta\Rightarrow|f(x)-f(c)|<\frac{f(c)}2$, quindi $f(x)>f(c)-\frac{f(c)}2=\frac{f(c)}2>0$.` },
    { id: 's07.teoremi.fc3', kind: 'thm', front: 'Teorema degli zeri', back: String.raw`$f$ continua su $[a,b]$, $f(a)f(b)<0$ $\Rightarrow$ $\exists c\in(a,b)$: $f(c)=0$.` },
    { id: 's07.teoremi.fc4', kind: 'dim', front: 'Teorema degli zeri: idea (bisezione)', back: String.raw`Si dimezza $[a,b]$ e si tiene la metà dove $f$ cambia segno. Si ottengono $a_n\uparrow$, $b_n\downarrow$ con $b_n-a_n=\frac{b-a}{2^n}$ e $f(a_n)<0<f(b_n)$; convergono allo stesso $c$ e per continuità $f(c)\le0\le f(c)$, quindi $f(c)=0$.` },
    { id: 's07.teoremi.fc5', kind: 'thm', front: 'Teorema di Weierstrass', back: String.raw`$f$ continua sull'intervallo chiuso e limitato $[a,b]$ $\Rightarrow$ $f$ ha massimo e minimo assoluti in $[a,b]$.` },
    { id: 's07.teoremi.fc6', kind: 'thm', front: 'Teorema dei valori intermedi', back: String.raw`$f$ continua su $[a,b]$ $\Rightarrow$ $f$ assume tutti i valori tra $m=\min f$ e $M=\max f$: $f([a,b])=[m,M]$.` },
    { id: 's07.teoremi.fc7', kind: 'dim', front: 'Dimostrazione dei valori intermedi', back: String.raw`Weierstrass: $f(x_m)=m$, $f(x_M)=M$. Per $m<\lambda<M$ pongo $g=f-\lambda$: $g(x_m)<0<g(x_M)$. Teorema degli zeri sull'intervallo di estremi $x_m,x_M$: $\exists c$ con $g(c)=0$, cioè $f(c)=\lambda$.` },
    { id: 's07.teoremi.fc8', kind: 'metodo', front: 'Mostrare che $f(x)=g(x)$ ha soluzione in $(a,b)$', back: String.raw`Pongo $h=f-g$, verifico che è continua su $[a,b]$ e che $h(a)h(b)<0$: teorema degli zeri. Per l'unicità mostro che $h$ è strettamente monotona.` },
    { id: 's07.teoremi.fc9', kind: 'errore', front: 'Zero + cambio di segno ⇒ continua?', back: String.raw`No: il teorema degli zeri è sufficiente, non necessario. Una funzione a gradini $-1,0,1$ si annulla senza essere continua.` },
  ],
};

export default {
  id: 's07',
  title: 'Continuità',
  subtitle: 'Discontinuità, teoremi sulle funzioni continue, inversa',
  intro: String.raw`La continuità è la porta d'ingresso dei grandi teoremi: permanenza del segno, zeri, Weierstrass, valori intermedi. All'esame compaiono come domande di teoria (enunciati, dimostrazioni, controesempi) e dentro gli studi di funzione (punti di raccordo, salti).`,
  skills: [
    sDef,
    sTeo,
    // @@SKILLS
  ],
};
