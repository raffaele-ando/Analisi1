import { H } from '../engine/tex.js';

// Sezione s12 · Integrali impropri.
// Due tipi: di prima specie (intervallo illimitato) e di seconda specie (funzione illimitata).
// Ogni integrale improprio si calcola come limite di integrali ordinari.
// ---------------------------------------------------------------------------
// s12.def · Definizione e calcolo con il limite
// ---------------------------------------------------------------------------

// [p, q, b, valore]: con alpha = p/q, vale  int_0^b x^(-alpha) dx = b^(1-alpha) / (1-alpha)
const ALPHA_TAB = [
  [1, 2, 1, 2],
  [1, 2, 4, 4],
  [1, 2, 9, 6],
  [1, 3, 8, 6],
  [2, 3, 8, 6],
  [3, 4, 16, 8],
];

const defL1 = {
  id: 's12.def.L1',
  title: "Un'area che non finisce",
  cards: [
    {
      type: 'learn',
      title: 'Area fino all\'infinito',
      body: String.raw`Considera la regione sotto il grafico di $f(x)=\frac{1}{x^2}$, a destra di $x=1$ e sopra l'asse $x$. Il grafico si avvicina all'asse, ma la regione **non ha una fine**.

Un integrale ordinario richiede un intervallo chiuso e limitato $[a,b]$. Qui l'intervallo è $[1,+\infty)$. Non possiamo usare la definizione direttamente, ma possiamo calcolare l'area fino a un punto $t$ qualsiasi e poi far crescere $t$ senza limiti:

$$\int_1^t \frac{dx}{x^2}\qquad\text{per } t>1,\qquad\text{poi}\qquad t\to+\infty.$$`,
      plot: { fns: [{ f: '1/x^2', label: 'f(x)=1/x^2' }], x: [0.3, 5], y: [-0.2, 2] },
    },
    {
      type: 'learn',
      title: 'Definizione: integrale improprio di prima specie',
      body: String.raw`Sia $f$ continua su $[a,+\infty)$. Si pone

$$\int_a^{+\infty}f(x)\,dx=\lim_{t\to+\infty}\int_a^t f(x)\,dx.$$

>* L'integrale **converge** se il limite esiste ed è finito. **Diverge** se il limite vale $+\infty$ o $-\infty$. **Non esiste** se il limite non esiste, per esempio se oscilla.

Il metodo in due passi:

1. calcolo $\int_a^t f(x)\,dx$ come un integrale normale, con una primitiva $F$: il risultato è $F(t)-F(a)$;
2. calcolo $\lim_{t\to+\infty}\bigl(F(t)-F(a)\bigr)$.

>! Errore tipico: sostituire $+\infty$ dentro la primitiva come se fosse un numero. Va sempre scritto il limite.`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_1^{+\\infty}\\frac{dx}{x^2}$',
      problem: String.raw`Calcola $\displaystyle\int_1^{+\infty}\frac{dx}{x^2}$.`,
      steps: [
        String.raw`Calcolo prima su $[1,t]$ con $t>1$: $\displaystyle\int_1^t x^{-2}\,dx=\left[-\frac1x\right]_1^t=1-\frac1t$.`,
        {
          text: String.raw`Ora faccio tendere $t$ a $+\infty$ nell'espressione $1-\frac1t$. Il termine $\frac1t$ sparisce, quindi $\displaystyle\lim_{t\to+\infty}\left(1-\frac1t\right)=1$.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\lim_{t\to+\infty}\frac1t$?`,
            answer: '0',
            explain: String.raw`Il reciproco di una quantità che cresce senza limiti tende a $0$. Quindi $1-\frac1t\to1$.`,
          },
        },
        String.raw`Il limite esiste ed è finito: l'integrale **converge** e vale $1$. Una regione infinita può avere area finita.`,
      ],
      result: String.raw`$\displaystyle\int_1^{+\infty}\frac{dx}{x^2}=1$ (converge)`,
    },
    {
      id: 's12.def.L1.e1', type: 'num', level: 1,
      prompt: String.raw`Calcola $\displaystyle\int_1^{+\infty}\frac{dx}{x^3}$.`,
      answer: '1/2',
      explain: String.raw`Primitiva $-\frac{1}{2x^2}$. Quindi $\displaystyle\int_1^t x^{-3}\,dx=\frac12-\frac{1}{2t^2}$, che tende a $\frac12$ per $t\to+\infty$.`,
    },
    {
      id: 's12.def.L1.e2', type: 'mcq', level: 1,
      prompt: String.raw`Quanto vale $\displaystyle\int_1^{+\infty}\frac{dx}{x}$?`,
      options: [
        String.raw`$1$`,
        String.raw`$\log 2$`,
        String.raw`È $+\infty$: l'integrale diverge positivamente`,
        String.raw`È $0$, perché $\frac1x\to0$`,
      ],
      answer: 2,
      explain: String.raw`$\displaystyle\int_1^t\frac{dx}{x}=\log t$, e $\log t\to+\infty$: l'integrale **diverge**. Il fatto che $\frac1x\to0$ non basta: serve che l'integrale abbia limite finito. $1$ e $\log 2$ sono valori finiti che non derivano da nessun calcolo. $0$ confonde il limite della funzione con quello dell'integrale.`,
    },
    {
      id: 's12.def.L1.e3', type: 'mcq', level: 1,
      prompt: String.raw`Quale di questi integrali è **improprio**?`,
      options: [
        String.raw`$\displaystyle\int_0^2\sin x\,dx$`,
        String.raw`$\displaystyle\int_0^2x^2\,dx$`,
        String.raw`$\displaystyle\int_1^2\frac{dx}{x-1}$`,
        String.raw`$\displaystyle\int_0^{1}\frac{x\,dx}{x+1}$`,
      ],
      answer: 2,
      explain: String.raw`Un integrale è improprio se l'intervallo è illimitato o se la funzione non è limitata. In $\int_1^2\frac{dx}{x-1}$ la funzione diverge in $x=1$, estremo dell'intervallo. Le altre sono integrali di funzioni continue su intervalli chiusi e limitati: sono integrali ordinari.`,
    },
    {
      id: 's12.def.L1.e4', type: 'num', level: 1,
      prompt: String.raw`Calcola $\displaystyle\int_0^{+\infty}e^{-x}\,dx$.`,
      answer: '1',
      explain: String.raw`Primitiva $-e^{-x}$. Quindi $\displaystyle\int_0^t e^{-x}\,dx=1-e^{-t}$, che tende a $1$.`,
    },
    {
      id: 's12.def.L1.e5', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\int_2^{+\infty}\frac{dx}{x^2-1}$. Risultato in forma chiusa con $\log$.`,
      answer: '1/2*log(3)',
      explain: String.raw`Decomposizione: $\frac{1}{x^2-1}=\frac12\left(\frac{1}{x-1}-\frac{1}{x+1}\right)$. Primitiva $F(x)=\frac12\log\frac{x-1}{x+1}$. Per $t\to+\infty$, $F(t)\to\frac12\log1=0$. In $x=2$: $F(2)=\frac12\log\frac13$. Quindi l'integrale vale $0-\frac12\log\frac13=\frac12\log3$.`,
    },
    {
      id: 's12.def.L1.e6', type: 'tf', level: 2,
      prompt: String.raw`$\displaystyle\int_{-1}^{1}\frac{dx}{x}$ è un integrale improprio **convergente**, che vale $0$ per simmetria.`,
      answer: false,
      explain: String.raw`Falso. L'integranda è illimitata in $x=0$, dentro l'intervallo. Per definizione si spezza in $\int_{-1}^{0}+\int_0^1$ e ciascun pezzo deve convergere. Ma $\int_0^1\frac{dx}{x}=+\infty$: l'integrale non converge. La simmetria dà $0$ solo per il *valore principale* $\lim_{\varepsilon\to0^+}\left(\int_{-1}^{-\varepsilon}+\int_\varepsilon^1\right)$, che non è la definizione.`,
    },
    {
      id: 's12.def.L1.e7', type: 'order', level: 2,
      prompt: String.raw`Metti in ordine i passi per calcolare $\displaystyle\int_1^{+\infty}\frac{\log x}{x^2}\,dx$.`,
      steps: [
        String.raw`Scrivo l'integrale come limite: $\displaystyle\int_1^{+\infty}\frac{\log x}{x^2}\,dx=\lim_{t\to+\infty}\int_1^t\frac{\log x}{x^2}\,dx$.`,
        String.raw`Calcolo una primitiva per parti: $F(x)=-\dfrac{\log x+1}{x}$ (derivando si controlla).`,
        String.raw`Calcolo l'integrale su $[1,t]$: $F(t)-F(1)=-\dfrac{\log t+1}{t}+1$.`,
        String.raw`Passo al limite: $-\dfrac{\log t+1}{t}\to0$, quindi l'integrale vale $1$.`,
      ],
      distractors: [
        String.raw`Calcolo $\displaystyle\lim_{x\to+\infty}\frac{\log x}{x^2}=0$ e concludo che l'integrale vale $0$.`,
        String.raw`Divido in $\int_1^{t}+\int_t^{+\infty}$ e tengo solo il primo termine.`,
      ],
      explain: String.raw`Prima si scrive il limite, poi si calcola la primitiva e il valore sul tratto $[1,t]$, infine si passa al limite. Il limite della funzione integranda non dà il valore dell'integrale: va integrata la funzione prima di tendere a $+\infty$.`,
    },
  ],
};

const defL2 = {
  id: 's12.def.L2',
  title: 'Calcolo con le primitive',
  cards: [
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_0^{+\\infty}x\\,e^{-x}\\,dx$',
      problem: String.raw`Calcola $\displaystyle\int_0^{+\infty}x\,e^{-x}\,dx$ con una primitiva e un limite.`,
      steps: [
        String.raw`Primitiva per parti ($f=x$, $g'=e^{-x}$): $F(x)=-(x+1)e^{-x}$. Controllo: $F'(x)=-e^{-x}+(x+1)e^{-x}=xe^{-x}$.`,
        {
          text: String.raw`Quindi $\displaystyle\lim_{t\to+\infty}F(t)=0$, perché l'esponenziale vince sul polinomio.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\lim_{t\to+\infty}(t+1)e^{-t}$?`,
            answer: '0',
            explain: String.raw`L'esponenziale $e^{-t}$ tende a $0$ più in fretta di quanto $t+1$ cresca.`,
          },
        },
        String.raw`In $x=0$: $F(0)=-(0+1)e^{0}=-1$.`,
        String.raw`Quindi $\displaystyle\int_0^{+\infty}xe^{-x}\,dx=F(+\infty)-F(0)=0-(-1)=1$: l'integrale converge.`,
      ],
      result: String.raw`$\displaystyle\int_0^{+\infty}xe^{-x}\,dx=1$`,
    },
    {
      type: 'learn',
      title: 'Seconda specie: funzione illimitata',
      body: String.raw`Ora l'intervallo è limitato, ma la funzione diventa **illimitata** vicino a un estremo. Esempio: $f(x)=\frac{1}{\sqrt x}$ su $(0,1]$ cresce senza limiti quando $x\to0^+$. In $0$ non è definita, quindi $\int_0^1 f$ non si può calcolare direttamente.

Se $f$ è continua su $(a,b]$ e illimitata vicino ad $a$:

$$\int_a^b f(x)\,dx=\lim_{t\to a^+}\int_t^b f(x)\,dx.$$

>* Converge se il limite è finito; diverge se vale $\pm\infty$. Per una funzione illimitata in $b^-$ si usa $\lim_{t\to b^-}\int_a^t f$.

Questo è un integrale **improprio di seconda specie**. La difficoltà sta nell'estremo di integrazione, non nell'infinito.`,
      plot: { fns: [{ f: 'x^(-1/2)', label: 'f(x)=1/√x' }], x: [0.02, 1.5], y: [0, 4] },
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_0^1\\log x\\,dx$',
      problem: String.raw`Calcola $\displaystyle\int_0^1\log x\,dx$. La funzione va a $-\infty$ in $0^+$.`,
      steps: [
        String.raw`Primitiva per parti: $\int\log x\,dx=x\log x-x+c$. Controllo: $\frac{d}{dx}(x\log x-x)=\log x+1-1=\log x$.`,
        String.raw`Sull'intervallo $[t,1]$ con $0<t<1$: $\displaystyle\int_t^1\log x\,dx=\bigl[x\log x-x\bigr]_t^1=-1-\bigl(t\log t-t\bigr)$.`,
        {
          text: String.raw`Quindi $\displaystyle\int_0^1\log x\,dx=-1-0+0=-1$: l'integrale **converge** e vale $-1$.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\lim_{t\to0^+}t\log t$?`,
            answer: '0',
            explain: String.raw`È un limite notevole: per $t\to0^+$ la potenza $t$ vince sul logaritmo, quindi $t\log t\to0$.`,
          },
        },
      ],
      result: String.raw`$\displaystyle\int_0^1\log x\,dx=-1$`,
    },
    {
      id: 's12.def.L2.e1', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\int_0^1 x\log x\,dx$.`,
      answer: '-1/4',
      explain: String.raw`Per parti ($f=\log x$, $g'=x$): primitiva $\frac{x^2}{2}\log x-\frac{x^2}{4}$. Controllo: $x\log x+\frac x2-\frac x2=x\log x$. Su $[t,1]$ il valore in $1$ è $-\frac14$, e il termine $\frac{t^2}{2}\log t\to0$ per $t\to0^+$. Risultato $-\frac14$.`,
    },
    {
      id: 's12.def.L2.e2', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\int_1^{+\infty}\frac{\log x}{x^3}\,dx$.`,
      answer: '1/4',
      explain: String.raw`Per parti: $\displaystyle\int\frac{\log x}{x^3}\,dx=-\frac{\log x}{2x^2}-\frac{1}{4x^2}+c$ (controllo derivando). Quindi $F(t)-F(1)=-\frac{\log t}{2t^2}-\frac{1}{4t^2}+\frac14\to\frac14$, perché $\frac{\log t}{t^2}\to0$.`,
    },
    {
      id: 's12.def.L2.e3', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\int_0^{1}\frac{dx}{x^{2/3}}$.`,
      answer: '3',
      explain: String.raw`Primitiva $3x^{1/3}$. In $0^+$ vale $0$, in $1$ vale $3$. Risultato $3$. L'integrale converge perché l'esponente $\frac23$ è minore di $1$.`,
    },
    {
      type: 'learn',
      title: "Integrali su tutta la retta",
      body: String.raw`Per $\displaystyle\int_{-\infty}^{+\infty}f(x)\,dx$ si sceglie un punto qualsiasi $c$ e si spezza:

$$\int_{-\infty}^{+\infty}f=\int_{-\infty}^{c}f+\int_c^{+\infty}f.$$

>* L'integrale su $\R$ converge **solo se convergono entrambi i pezzi**. Il valore non dipende da $c$.

Per $\int_{-\infty}^{c}$ si usa il limite per $t\to-\infty$ dell'estremo sinistro.

>! Attenzione: il limite simmetrico $\lim_{t\to+\infty}\int_{-t}^{t}f$ **non** è la definizione. Per $f(x)=x$ vale $0$, ma $\int_{-\infty}^{+\infty}x\,dx$ diverge, perché ciascun pezzo diverge.`,
    },
    {
      id: 's12.def.L2.e4', type: 'tf', level: 2,
      prompt: String.raw`$\displaystyle\int_{-\infty}^{+\infty}x\,dx$ converge e vale $0$.`,
      answer: false,
      explain: String.raw`Falso. Il limite simmetrico $\lim_{t\to+\infty}\int_{-t}^{t}x\,dx=0$ esiste, ma non è la definizione. Spezzando in $c=0$, $\int_0^{+\infty}x\,dx=+\infty$: l'integrale su $\R$ non converge.`,
    },
    {
      id: 's12.def.L2.e5', type: 'mcq', level: 2,
      prompt: String.raw`Quanto vale $\displaystyle\int_{-\infty}^{+\infty}\frac{dx}{1+x^2}$?`,
      options: [
        String.raw`$\frac{\pi}{2}$`,
        String.raw`$\pi$`,
        String.raw`$2$`,
        String.raw`$+\infty$`,
      ],
      answer: 1,
      explain: String.raw`Spezzo in $c=0$. Su $[0,+\infty)$: $\lim_{t\to+\infty}\arctan t=\frac\pi2$. Su $(-\infty,0]$ vale ancora $\frac\pi2$ per simmetria. Somma $\pi$. Dimenticare uno dei due pezzi dà $\frac\pi2$: è l'errore tipico. $2$ e $+\infty$ non derivano dal calcolo.`,
    },
    {
      id: 's12.def.L2.e6', type: 'num', level: 1,
      prompt: String.raw`Calcola $\displaystyle\int_{-\infty}^{0}e^{3x}\,dx$.`,
      answer: '1/3',
      explain: String.raw`Primitiva $\frac13e^{3x}$. Per $t\to-\infty$, $e^{3t}\to0$. Quindi l'integrale vale $\frac13-0=\frac13$.`,
    },
  ],
};

const defL3 = {
  id: 's12.def.L3',
  title: "Dal metodo all'esame",
  cards: [
    {
      type: 'learn',
      title: 'Il metodo in quattro passi',
      body: String.raw`Davanti a un integrale improprio ragiona in quest'ordine:

1. **Punti critici**: gli estremi illimitati (come $+\infty$) e i punti dove $f$ non è definita o diverge, dentro o agli estremi dell'intervallo.
2. **Primitiva**: trova una $F$ con i metodi di s11 (parti, sostituzione, fratti semplici).
3. **Limiti**: calcola i limiti di $F$ verso ogni punto critico, sempre da dentro l'intervallo.
4. **Esito**: se i limiti sono finiti, l'integrale converge e vale la differenza. Se una $F$ è definita su tutto $(a,b)$, il valore è $\lim_{x\to b^-}F(x)-\lim_{x\to a^+}F(x)$.`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_0^{+\\infty}\\frac{dx}{(x+1)(x+2)}$',
      problem: String.raw`Calcola $\displaystyle\int_0^{+\infty}\frac{dx}{(x+1)(x+2)}$. Il punto critico è solo $+\infty$.`,
      steps: [
        String.raw`Fratti semplici: $\dfrac{1}{(x+1)(x+2)}=\dfrac{1}{x+1}-\dfrac{1}{x+2}$. Verifica: $\dfrac{(x+2)-(x+1)}{(x+1)(x+2)}=\dfrac{1}{(x+1)(x+2)}$.`,
        String.raw`Primitiva: $F(x)=\log\dfrac{x+1}{x+2}$. Controllo: $F'(x)=\dfrac{1}{x+1}-\dfrac{1}{x+2}$.`,
        {
          text: String.raw`Quindi $\displaystyle\int_0^{+\infty}\frac{dx}{(x+1)(x+2)}=\lim_{t\to+\infty}F(t)-F(0)=0-\log\frac12=\log2$: l'integrale converge.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\lim_{t\to+\infty}\log\frac{t+1}{t+2}$?`,
            answer: '0',
            explain: String.raw`Il rapporto $\frac{t+1}{t+2}$ tende a $1$, e $\log1=0$.`,
          },
        },
      ],
      result: String.raw`$\displaystyle\int_0^{+\infty}\frac{dx}{(x+1)(x+2)}=\log2$ (converge)`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: due punti critici, $\\displaystyle\\int_0^{+\\infty}\\frac{dx}{\\sqrt x\\,(1+x)}$',
      problem: String.raw`Calcola $\displaystyle\int_0^{+\infty}\frac{dx}{\sqrt x\,(1+x)}$. I punti critici sono $x=0$ (dove $\frac1{\sqrt x}\to+\infty$) e $x=+\infty$.`,
      steps: [
        String.raw`Serve una primitiva unica su $(0,+\infty)$. Si pone $x=t^2$, con $t>0$ e $dx=2t\,dt$: $\displaystyle\int\frac{2t\,dt}{t(1+t^2)}=\int\frac{2\,dt}{1+t^2}$.`,
        String.raw`Quindi $F(x)=2\arctan\sqrt x$ è una primitiva su $(0,+\infty)$. Controllo: $F'(x)=\dfrac{2}{1+x}\cdot\dfrac{1}{2\sqrt x}=\dfrac{1}{\sqrt x\,(1+x)}$.`,
        {
          text: String.raw`Il limite di $F$ per $x\to0^+$ è $2\arctan0=0$. Il limite per $x\to+\infty$ è $\pi$. Quindi l'integrale vale $\pi-0=\pi$: converge.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to+\infty}2\arctan\sqrt x$?`,
            answer: 'pi',
            explain: String.raw`$\arctan y\to\frac\pi2$ per $y\to+\infty$. Quindi $2\cdot\frac\pi2=\pi$.`,
          },
        },
      ],
      result: String.raw`$\displaystyle\int_0^{+\infty}\frac{dx}{\sqrt x\,(1+x)}=\pi$ (converge)`,
    },
    {
      id: 's12.def.L3.p1', type: 'problem', level: 3,
      source: 'Itinere 15/01/2026 · B1 (b)',
      prompt: String.raw`Calcolare $\displaystyle\int_1^{+\infty}\frac{\log(1+t)}{t^2}\,dt$.`,
      parts: [
        {
          type: 'expr',
          prompt: String.raw`Una primitiva di $\dfrac{\log(1+t)}{t^2}$, senza costante additiva, è $F(t)=$`,
          answer: '-log(1+t)/t+log(t)-log(1+t)',
          vars: ['t'],
          domain: [1.2, 4],
          upToConstant: true,
          explain: String.raw`Per parti con $g'=t^{-2}$, $g=-\frac1t$: $F=-\frac{\log(1+t)}{t}+\int\frac{dt}{t(1+t)}$. Poi $\frac{1}{t(1+t)}=\frac1t-\frac1{1+t}$, con primitiva $\log t-\log(1+t)$.`,
        },
        {
          type: 'num',
          prompt: String.raw`Quanto vale $\displaystyle\lim_{t\to+\infty}F(t)$?`,
          answer: '0',
          explain: String.raw`$-\frac{\log(1+t)}{t}\to0$ e $\log t-\log(1+t)=-\log\left(1+\frac1t\right)\to0$.`,
        },
        {
          type: 'num',
          prompt: String.raw`Valore dell'integrale: $F(+\infty)-F(1)$. Scrivilo con $\log2$.`,
          answer: '2*log(2)',
          explain: String.raw`$F(1)=-\log2+\log1-\log2=-2\log2$. Quindi l'integrale vale $0-(-2\log2)=2\log2$.`,
        },
      ],
      solution: String.raw`Per parti: $F(t)=-\frac{\log(1+t)}{t}+\log t-\log(1+t)$; derivando si controlla. Per $t\to+\infty$ i due termini tendono a $0$, quindi $F(+\infty)=0$. In $t=1$: $F(1)=-\log2-\log2=-2\log2$. Quindi $\displaystyle\int_1^{+\infty}\frac{\log(1+t)}{t^2}\,dt=2\log2\approx1{,}386$, e l'integrale converge.`,
      points: 4,
    },
    {
      id: 's12.def.L3.p2', type: 'problem', level: 3,
      source: 'Appello 03/09/2026 · B4',
      prompt: String.raw`Sia $f_{-1}(x)=\dfrac{x^{-1}+1}{x^{-1}+x^2}$ su $[1,+\infty)$. Calcolare $\displaystyle\int_1^{+\infty}f_{-1}(x)\,dx$.`,
      parts: [
        {
          type: 'expr',
          prompt: String.raw`Semplifica $f_{-1}(x)$ (moltiplica numeratore e denominatore per $x$).`,
          answer: '1/(x^2-x+1)',
          explain: String.raw`Moltiplicando per $x$ si ottiene $\frac{1+x}{1+x^3}$. Poi $1+x^3=(1+x)(x^2-x+1)$, quindi resta $\frac{1}{x^2-x+1}$.`,
        },
        {
          type: 'expr',
          prompt: String.raw`Una primitiva di $\dfrac{1}{x^2-x+1}$, senza costante additiva, è $F(x)=$`,
          answer: '2/sqrt(3)*atan((2*x-1)/sqrt(3))',
          vars: ['x'],
          upToConstant: true,
          explain: String.raw`Completo il quadrato: $x^2-x+1=\left(x-\frac12\right)^2+\frac34$. Quindi $F(x)=\frac{2}{\sqrt3}\arctan\frac{2x-1}{\sqrt3}$.`,
        },
        {
          type: 'num',
          prompt: String.raw`Valore dell'integrale, scritto con $\pi$ e $\sqrt3$.`,
          answer: '2*pi/(3*sqrt(3))',
          explain: String.raw`In $+\infty$: $\frac{2}{\sqrt3}\cdot\frac\pi2$. In $x=1$: $\frac{2}{\sqrt3}\arctan\frac{1}{\sqrt3}=\frac{2}{\sqrt3}\cdot\frac\pi6$. Differenza: $\frac{2}{\sqrt3}\cdot\frac\pi3=\frac{2\pi}{3\sqrt3}$.`,
        },
      ],
      solution: String.raw`$f_{-1}(x)=\frac{1}{x^2-x+1}$. Primitiva $\frac{2}{\sqrt3}\arctan\frac{2x-1}{\sqrt3}$. Limite in $+\infty$: $\frac{2}{\sqrt3}\cdot\frac\pi2$. Valore in $1$: $\frac{2}{\sqrt3}\cdot\frac\pi6$. Integrale: $\frac{2\pi}{3\sqrt3}\approx1{,}209$, convergente.

>! Nota: nella soluzione ufficiale compaiono estremi di integrazione errati ($0$ invece di $1$). Il valore corretto è quello riportato qui.`,
      points: 4,
    },
    {
      id: 's12.def.L3.e1', type: 'open', level: 3,
      prompt: String.raw`Dai la definizione di integrale improprio di **seconda specie** convergente, con $f$ continua su $(a,b]$ e illimitata in $a^+$.`,
      answer: String.raw`Si pone $\displaystyle\int_a^b f(x)\,dx=\lim_{t\to a^+}\int_t^b f(x)\,dx$. L'integrale converge se il limite esiste ed è finito; diverge se il limite vale $\pm\infty$; non esiste se il limite non esiste.`,
      rubric: [
        String.raw`Usa il limite per $t\to a^+$ dell'integrale su $[t,b]$, non su $[a,b]$`,
        String.raw`Ipotesi: $f$ continua su $(a,b]$, illimitata in $a^+$`,
        String.raw`Condizione di convergenza: limite finito`,
        String.raw`Casi di divergenza e di limite inesistente`,
      ],
      explain: String.raw`La risposta deve dire che il limite è sull'estremo che è punto critico, e che la convergenza richiede un valore finito del limite.`,
      points: 2,
    },
    {
      id: 's12.def.L3.e2', type: 'tf', level: 2,
      prompt: String.raw`Se $\displaystyle\lim_{x\to+\infty}f(x)=0$, allora $\displaystyle\int_1^{+\infty}f(x)\,dx$ converge.`,
      answer: false,
      explain: String.raw`Falso. Se l'integrale converge e $f$ ha limite, il limite deve essere $0$: è condizione **necessaria**, non sufficiente. Esempio: $f(x)=\frac1x$ tende a $0$, ma $\int_1^{+\infty}\frac{dx}{x}=+\infty$.`,
    },
    {
      id: 's12.def.L3.e3', type: 'mcq', level: 2,
      prompt: String.raw`Quanto vale $\displaystyle\int_{-\infty}^{+\infty}x\,e^{-x^2}\,dx$?`,
      options: [
        String.raw`$0$: i due pezzi valgono $\frac12$ e $-\frac12$`,
        String.raw`$+\infty$, perché l'integranda è positiva`,
        String.raw`$\frac12$, perché conta solo $\int_0^{+\infty}$`,
        String.raw`Non esiste: su $\R$ nessuna funzione dispari converge`,
      ],
      answer: 0,
      explain: String.raw`Spezzo in $c=0$: $\int_0^{+\infty}xe^{-x^2}\,dx=\frac12$ e $\int_{-\infty}^{0}xe^{-x^2}\,dx=-\frac12$. Entrambi convergono, quindi la somma è $0$. "È positiva" è falso: l'integranda cambia segno. Dimenticare il pezzo negativo dà $\frac12$. La regola "dispari fa $0$" vale solo se l'integrale converge.`,
    },
    {
      id: 's12.def.L3.e4', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\int_0^{+\infty}\frac{dx}{x^2+4}$.`,
      answer: 'pi/4',
      explain: String.raw`Primitiva $\frac12\arctan\frac x2$. In $+\infty$ vale $\frac12\cdot\frac\pi2=\frac\pi4$; in $0$ vale $0$. Risultato $\frac\pi4$.`,
    },
    {
      id: 's12.def.L3.e5', type: 'num', level: 3,
      prompt: String.raw`Calcola $\displaystyle\int_0^{1}\frac{\log x}{\sqrt x}\,dx$.`,
      answer: '-4',
      explain: String.raw`Per parti: primitiva $2\sqrt x\log x-4\sqrt x$. Controllo: $\frac{\log x}{\sqrt x}+\frac{2}{\sqrt x}-\frac{2}{\sqrt x}=\frac{\log x}{\sqrt x}$. In $1$ vale $-4$. In $0^+$ entrambi i termini tendono a $0$. Risultato $-4$.`,
    },
  ],
};

const defPractice = [
  {
    id: 's12.def.gen-lineare', type: 'gen', level: 1,
    gen: (R) => {
      const a = R.int(0, 3);
      const c = R.int(1, 4);
      return {
        type: 'num',
        prompt: String.raw`Calcola $\displaystyle\int_{${a}}^{+\infty}\frac{dx}{(x+${c})^2}$.`,
        answer: H.fracStr(1, a + c),
        explain: String.raw`Primitiva $-\frac{1}{x+${c}}$. Per $t\to+\infty$ il termine tende a $0$; in $x=${a}$ vale $-\frac{1}{${a + c}}$. Quindi l'integrale vale $0-\left(-\frac{1}{${a + c}}\right)=${H.frac(1, a + c)}$.`,
      };
    },
  },
  {
    id: 's12.def.gen-potenza', type: 'gen', level: 2,
    gen: (R) => {
      const [p, q, b, v] = R.pick(ALPHA_TAB);
      return {
        type: 'num',
        prompt: String.raw`Calcola $\displaystyle\int_0^{${b}}\frac{dx}{x^{${H.frac(p, q)}}}$.`,
        answer: String(v),
        explain: String.raw`Con $\alpha=${H.frac(p, q)}<1$ l'integrale converge. Primitiva $\frac{x^{1-\alpha}}{1-\alpha}$, che in $0^+$ tende a $0$. Quindi il valore è $\frac{${b}^{${H.frac(q - p, q)}}}{${H.frac(q - p, q)}}=${v}$.`,
      };
    },
  },
  {
    id: 's12.def.gen-neg', type: 'gen', level: 1,
    gen: (R) => {
      const k = R.int(1, 4);
      return {
        type: 'num',
        prompt: String.raw`Calcola $\displaystyle\int_{-\infty}^{0}e^{${H.coef(k)}x}\,dx$.`,
        answer: H.fracStr(1, k),
        explain: String.raw`Primitiva $\frac{1}{${k}}e^{${H.coef(k)}x}$. Per $t\to-\infty$ l'esponenziale tende a $0$. Quindi l'integrale vale $\frac{1}{${k}}=${H.frac(1, k)}$.`,
      };
    },
  },
  {
    id: 's12.def.gen-exp', type: 'gen', level: 2,
    gen: (R) => {
      const k = R.int(1, 3);
      const c = R.int(0, 3);
      return {
        type: 'num',
        prompt: String.raw`Calcola $\displaystyle\int_{${c}}^{+\infty}e^{-${H.coef(k)}x}\,dx$.`,
        answer: `e^(-${k * c})/${k}`,
        explain: String.raw`Primitiva $-\frac{1}{${k}}e^{-${H.coef(k)}x}$. Per $t\to+\infty$ il termine tende a $0$. In $x=${c}$ vale $-\frac{1}{${k}}e^{-${k * c}}$. Quindi il risultato è $\frac{e^{-${k * c}}}{${k}}$.`,
      };
    },
  },
  {
    id: 's12.def.p5', type: 'num', level: 1,
    prompt: String.raw`Calcola $\displaystyle\int_1^{+\infty}\frac{dx}{x^4}$.`,
    answer: '1/3',
    explain: String.raw`Primitiva $-\frac{1}{3x^3}$. Il valore è $\frac13-0=\frac13$.`,
  },
  {
    id: 's12.def.p6', type: 'num', level: 1,
    prompt: String.raw`Calcola $\displaystyle\int_1^{+\infty}\frac{dx}{x\sqrt x}$.`,
    answer: '2',
    explain: String.raw`$x\sqrt x=x^{3/2}$. Primitiva $-2x^{-1/2}$. Il valore è $2-0=2$.`,
  },
  {
    id: 's12.def.p7', type: 'mcq', level: 2,
    prompt: String.raw`Quanto vale $\displaystyle\lim_{t\to+\infty}\int_0^{t}\cos x\,dx$?`,
    options: [
      String.raw`$1$`,
      String.raw`$0$`,
      String.raw`Non esiste: $\int_0^t\cos x\,dx=\sin t$ oscilla`,
      String.raw`$+\infty$`,
    ],
    answer: 2,
    explain: String.raw`$\int_0^t\cos x\,dx=\sin t$. Il seno oscilla fra $-1$ e $1$ e non ha limite per $t\to+\infty$. L'integrale non converge e non diverge.`,
  },
  {
    id: 's12.def.p8', type: 'tf', level: 1,
    prompt: String.raw`$\displaystyle\int_0^{+\infty}\frac{dx}{1+x}$ converge.`,
    answer: false,
    explain: String.raw`Falso. Primitiva $\log(1+x)$, che per $x\to+\infty$ tende a $+\infty$. L'integrale diverge a $+\infty$.`,
  },
  {
    id: 's12.def.p9', type: 'order', level: 2,
    prompt: String.raw`Metti in ordine i passi per calcolare $\displaystyle\int_0^{+\infty}x\,e^{-2x}\,dx$.`,
    steps: [
      String.raw`Scrivo l'integrale come limite: $\displaystyle\lim_{t\to+\infty}\int_0^t x\,e^{-2x}\,dx$.`,
      String.raw`Primitiva per parti: $F(x)=-\left(\dfrac{x}{2}+\dfrac14\right)e^{-2x}$. Controllo derivando.`,
      String.raw`Valuto sul tratto: $F(t)-F(0)=-\left(\dfrac t2+\dfrac14\right)e^{-2t}+\dfrac14$.`,
      String.raw`Passo al limite: il primo termine tende a $0$, quindi il valore è $\dfrac14$.`,
    ],
    distractors: [
      String.raw`Calcolo $\displaystyle\lim_{x\to+\infty}x\,e^{-2x}=0$ e concludo che l'integrale vale $0$.`,
      String.raw`Passo al limite prima di calcolare la primitiva: scrivo $F(+\infty)-F(0)$ senza il limite.`,
    ],
    explain: String.raw`L'ordine è: limite, primitiva, valore sul tratto, limite finale. Il limite dell'integranda non dà il valore dell'integrale.`,
  },
  {
    id: 's12.def.p10', type: 'num', level: 2,
    prompt: String.raw`Calcola $\displaystyle\int_0^{1}\frac{dx}{\sqrt[3]{x}}$.`,
    answer: '3/2',
    explain: String.raw`$\frac{1}{\sqrt[3]{x}}=x^{-1/3}$. Primitiva $\frac32x^{2/3}$, che in $0^+$ vale $0$. Il valore è $\frac32$.`,
  },
  {
    id: 's12.def.p11', type: 'num', level: 2,
    prompt: String.raw`Calcola $\displaystyle\int_0^{+\infty}\frac{dx}{(x+1)^3}$.`,
    answer: '1/2',
    explain: String.raw`Primitiva $-\frac{1}{2(x+1)^2}$. In $+\infty$ vale $0$; in $0$ vale $-\frac12$. Risultato $0-\left(-\frac12\right)=\frac12$.`,
  },
  {
    id: 's12.def.p12', type: 'expr', level: 2,
    prompt: String.raw`Una primitiva di $\dfrac{1}{x^2+4}$, senza costante additiva, è $F(x)=$`,
    answer: 'atan(x/2)/2',
    vars: ['x'],
    upToConstant: true,
    explain: String.raw`Derivata di $\frac12\arctan\frac x2$: $\frac12\cdot\frac{1/2}{1+x^2/4}=\frac{1}{x^2+4}$.`,
  },
  {
    id: 's12.def.p13', type: 'open', level: 2,
    prompt: String.raw`Spiega perché $\displaystyle\int_1^{+\infty}\sin x\,dx$ non converge e non diverge a $+\infty$.`,
    answer: String.raw`$\displaystyle\int_1^t\sin x\,dx=\cos1-\cos t$. Il termine $\cos t$ oscilla fra $-1$ e $1$ e non ha limite per $t\to+\infty$. Quindi il limite non esiste: l'integrale non converge e non diverge.`,
    rubric: [
      String.raw`Calcolo della primitiva $-\cos x$ sul tratto $[1,t]$`,
      String.raw`Osservazione che $\cos t$ non ha limite per $t\to+\infty$`,
      String.raw`Conclusione: il limite non esiste, quindi né convergenza né divergenza a $+\infty$`,
    ],
    explain: String.raw`Il caso "non esiste" è diverso da "diverge": qui il limite non è né finito né infinito.`,
    points: 2,
  },
];

const defFlashcards = [
  { id: 's12.def.fc1', kind: 'def', front: String.raw`Integrale improprio di **prima specie**`, back: String.raw`$\displaystyle\int_a^{+\infty}f=\lim_{t\to+\infty}\int_a^t f$ (analogo per $-\infty$). Converge se il limite è finito, diverge se è $\pm\infty$, non esiste altrimenti.` },
  { id: 's12.def.fc2', kind: 'def', front: String.raw`Integrale improprio di **seconda specie**`, back: String.raw`$f$ illimitata vicino a un estremo: $\displaystyle\int_a^b f=\lim_{t\to a^+}\int_t^b f$ (oppure $\lim_{t\to b^-}\int_a^t f$). Con punto interno $c$ si spezza in $\int_a^c+\int_c^b$.` },
  { id: 's12.def.fc3', kind: 'def', front: String.raw`Tre esiti per un integrale improprio`, back: String.raw`**Converge** (limite finito, dà un valore), **diverge** (limite $\pm\infty$), **non esiste** (il limite oscilla, come per $\int_1^{+\infty}\sin x\,dx$).` },
  { id: 's12.def.fc4', kind: 'formula', front: String.raw`Integrale su $\R$`, back: String.raw`$\displaystyle\int_{-\infty}^{+\infty}f=\int_{-\infty}^{c}f+\int_c^{+\infty}f$, con $c$ qualsiasi. Converge solo se convergono entrambi i pezzi.` },
  { id: 's12.def.fc5', kind: 'metodo', front: String.raw`Come si calcola un integrale improprio`, back: String.raw`Si trova una primitiva $F$ (metodi di s11); poi si calcolano i limiti di $F$ verso i punti critici, da dentro l'intervallo. Se sono finiti, l'integrale vale la differenza.` },
  { id: 's12.def.fc6', kind: 'errore', front: String.raw`Errore tipico: il limite simmetrico`, back: String.raw`$\displaystyle\lim_{t\to+\infty}\int_{-t}^{t}f$ non è la definizione di $\int_{-\infty}^{+\infty}f$. Per $f(x)=x$ il limite simmetrico vale $0$, ma l'integrale su $\R$ diverge.` },
  { id: 's12.def.fc7', kind: 'formula', front: String.raw`Esponenziali su semirette ($k>0$)`, back: String.raw`$\displaystyle\int_c^{+\infty}e^{-kx}\,dx=\frac{e^{-kc}}{k}$ e $\displaystyle\int_{-\infty}^{0}e^{kx}\,dx=\frac1k$.` },
  { id: 's12.def.fc8', kind: 'errore', front: String.raw`Errore tipico: $+\infty$ trattato come un numero`, back: String.raw`Scrivere $F(+\infty)$ è una scorciatoia: va sempre letto come $\lim_{t\to+\infty}F(t)$, e il limite va calcolato.` },
];

const def = {
  id: 's12.def',
  title: 'Definizione e calcolo con il limite',
  summary: String.raw`Calcolare un integrale su un intervallo illimitato o con funzione illimitata come limite di integrali ordinari, e decidere se converge.`,
  prereq: ['s05.asintoti', 's11.riemann', 's11.immediati', 's11.parti'],
  examRefs: ['Itinere 15/01/2026 · B1 (b)', 'Appello 10/02/2026 · B5', 'Appello 03/09/2026 · B4'],
  lessons: [defL1, defL2, defL3],
  practice: defPractice,
  flashcards: defFlashcards,
};

export default {
  id: 's12',
  title: 'Integrali impropri',
  subtitle: 'Prima e seconda specie, criteri di convergenza, parametri',
  intro: String.raw`All'esame compare quasi ogni anno un integrale improprio: un'area che va all'infinito, una funzione illimitata vicino a un estremo, oppure un parametro da discutere. Qui impari a calcolarli come limiti e a decidere se convergono.`,
  skills: [def],
};
