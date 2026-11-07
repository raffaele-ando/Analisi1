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
// ---------------------------------------------------------------------------
// s12.criteri · Confronto, confronto asintotico, condizione necessaria, campioni
// ---------------------------------------------------------------------------

// [p, q, beta]: alpha = p/q nel campione int_2^inf dx / (x^alpha log^beta x)
const LOG_TAB = [
  [1, 1, 1],
  [1, 1, 2],
  [1, 1, 3],
  [3, 2, 1],
  [1, 2, 2],
  [2, 1, 1],
  [3, 4, 2],
  [5, 4, 1],
];

const critL1 = {
  id: 's12.criteri.L1',
  title: 'Il confronto',
  cards: [
    {
      type: 'learn',
      title: 'Funzioni positive: l\'area non scende',
      body: String.raw`Se $f\ge0$ su $[a,+\infty)$, la funzione $F(t)=\int_a^t f(x)\,dx$ è **non decrescente**: allungando l'intervallo si aggiunge area positiva. Quindi $F$ ha limite per $t\to+\infty$ se e solo se è limitata.

Per una funzione positiva la domanda è quindi una sola: l'area **resta sotto un limite**, oppure cresce senza fine? Per rispondere non serve la primitiva: basta confrontare con una funzione di cui conosciamo già la risposta.

>! Questo ragionamento vale solo se $f\ge0$. Con $f$ che cambia segno l'area può salire e scendere, e la monotonia non c'è più.`,
    },
    {
      type: 'learn',
      title: 'Criterio del confronto',
      body: String.raw`Siano $0\le f(x)\le g(x)$ per $x\ge a$. Allora:

>* se $\int_a^{+\infty}g$ **converge**, anche $\int_a^{+\infty}f$ converge;
>* se $\int_a^{+\infty}f$ **diverge**, anche $\int_a^{+\infty}g$ diverge.

Il verso conta. Se $\int f$ converge, nulla si può dire su $\int g$, che è più grande. Se $\int g$ diverge, nulla si può dire su $\int f$, che è più piccola.

Il criterio è una **maggiorazione**: serve un maggiorante integrabile, e il minorante eredita la convergenza.`,
      plot: { fns: [{ f: '1/x^2', label: 'g(x)=1/x^2' }, { f: '1/(x^2+x)', label: 'f(x)=1/(x^2+x)' }], x: [1, 5], y: [0, 1.1] },
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_1^{+\\infty}\\frac{dx}{x^2+x}$',
      problem: String.raw`Dimostra che $\displaystyle\int_1^{+\infty}\frac{dx}{x^2+x}$ converge, senza calcolare la primitiva.`,
      steps: [
        String.raw`Per $x\ge1$ la funzione è positiva: $0<\dfrac{1}{x^2+x}$.`,
        String.raw`Poiché $x^2+x\ge x^2$ per $x\ge0$, si ha $\dfrac{1}{x^2+x}\le\dfrac{1}{x^2}$. Il maggiorante è $g(x)=\dfrac{1}{x^2}$.`,
        {
          text: String.raw`Quindi $0\le\displaystyle\int_1^{+\infty}\frac{dx}{x^2+x}\le\int_1^{+\infty}\frac{dx}{x^2}=1$. L'integrale è limitato e crescente nel suo estremo: converge.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\int_1^{+\infty}\frac{dx}{x^2}$?`,
            answer: '1',
            explain: String.raw`È un integrale campione con esponente $2>1$. Primitiva $-\frac1x$: il valore è $0-(-1)=1$.`,
          },
        },
      ],
      result: String.raw`$\displaystyle\int_1^{+\infty}\frac{dx}{x^2+x}$ converge (e vale al più $1$)`,
    },
    {
      id: 's12.criteri.L1.e1', type: 'mcq', level: 1,
      prompt: String.raw`Sai che $\displaystyle\int_1^{+\infty}g(x)\,dx$ converge e che $0\le f\le g$ su $[1,+\infty)$. Cosa segue?`,
      options: [
        String.raw`$\int_1^{+\infty}f$ converge`,
        String.raw`$\int_1^{+\infty}f$ diverge a $+\infty$`,
        String.raw`$\int_1^{+\infty}f$ vale esattamente $0$`,
        String.raw`Non si può concludere nulla su $\int_1^{+\infty}f$`,
      ],
      answer: 0,
      explain: String.raw`Il confronto dice che se il maggiorante converge, anche la funzione più piccola converge. Il criterio non dà il valore: $f$ potrebbe valere molto meno di $g$, quindi "vale $0$" non segue.`,
    },
    {
      id: 's12.criteri.L1.e2', type: 'mcq', level: 1,
      prompt: String.raw`Sai che $\displaystyle\int_1^{+\infty}f(x)\,dx$ diverge e che $0\le f\le g$ su $[1,+\infty)$. Cosa segue per $\int_1^{+\infty}g$?`,
      options: [
        String.raw`Converge`,
        String.raw`Diverge a $+\infty$`,
        String.raw`Non si può concludere`,
        String.raw`Vale $\int_1^{+\infty}f$`,
      ],
      answer: 1,
      explain: String.raw`Se il minorante $f$ ha area infinita, la funzione $g\ge f$ ha area ancora più grande: diverge. Il criterio funziona nel verso dell'area maggiore.`,
    },
    {
      id: 's12.criteri.L1.e3', type: 'tf', level: 1,
      prompt: String.raw`Se $0\le f\le g$ e $\displaystyle\int_1^{+\infty}g$ diverge, allora anche $\displaystyle\int_1^{+\infty}f$ diverge.`,
      answer: false,
      explain: String.raw`Falso. Un minorante di una funzione divergente può convergere. Per esempio $f=\frac{1}{x^2}\le g=\frac1x$ su $[1,+\infty)$: $\int g$ diverge, mentre $\int f$ converge.`,
    },
    {
      id: 's12.criteri.L1.e4', type: 'mcq', level: 2,
      prompt: String.raw`Quale maggiorante permette di concludere con il confronto che $\displaystyle\int_1^{+\infty}\frac{dx}{\sqrt{x^3+1}}$ converge?`,
      options: [
        String.raw`$\dfrac{1}{x^{3/2}}$`,
        String.raw`$\dfrac{1}{x}$`,
        String.raw`$\dfrac{1}{\sqrt{x}}$`,
        String.raw`$\dfrac{1}{x^2}$`,
      ],
      answer: 0,
      explain: String.raw`Si ha $\sqrt{x^3+1}\ge\sqrt{x^3}=x^{3/2}$, quindi $0<\dfrac{1}{\sqrt{x^3+1}}\le\dfrac{1}{x^{3/2}}$, che è integrabile perché $\frac32>1$. $\frac1x$ e $\frac1{\sqrt x}$ divergono, quindi non servono. $\frac1{x^2}$ è più piccolo della funzione e non la maggiora.`,
    },
    {
      id: 's12.criteri.L1.e5', type: 'interval', level: 1,
      prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_1^{+\infty}\frac{dx}{x^\alpha}$?`,
      answer: '(1,+inf)',
      explain: String.raw`È il campione all'infinito: converge se e solo se $\alpha>1$. Per $\alpha=1$ si ottiene $\log t\to+\infty$; per $\alpha<1$, $\frac{t^{1-\alpha}}{1-\alpha}\to+\infty$.`,
    },
  ],
};

const critL2 = {
  id: 's12.criteri.L2',
  title: 'Confronto asintotico e integrali campione',
  cards: [
    {
      type: 'learn',
      title: 'Gli integrali campione',
      body: String.raw`Alcuni integrali **campione** si decidono subito. Con $a>0$, $b>0$ e $\alpha,\beta$ reali:

>* $\displaystyle\int_a^{+\infty}\frac{dx}{x^\alpha}$ converge $\iff\alpha>1$;
>* $\displaystyle\int_0^{b}\frac{dx}{x^\alpha}$ converge $\iff\alpha<1$;
>* $\displaystyle\int_2^{+\infty}\frac{dx}{x^\alpha\log^\beta x}$ converge $\iff\alpha>1$, oppure $\alpha=1$ e $\beta>1$.

Il logaritmo "aiuta" solo quando $\alpha=1$. Con $\alpha\ne1$ decide l'esponente da solo.`,
    },
    {
      type: 'learn',
      title: 'Confronto asintotico',
      body: String.raw`Il confronto diretto richiede $f\le g$, che spesso non si vede subito. Serve il **confronto asintotico**.

Siano $f,g\ge0$ vicino a $+\infty$ (o vicino a un punto critico), con

$$\lim\frac{f(x)}{g(x)}=\ell\qquad\text{con }0<\ell<+\infty.$$

>* In tal caso $\int f$ e $\int g$ hanno **la stessa natura**: convergono entrambi o divergono entrambi. Si scrive $f\sim\ell\,g$.

Nella pratica si sostituisce ogni funzione con la sua **parte principale** per $x\to+\infty$ (o per $x\to a$).

>! Se $\ell=0$ o $\ell=+\infty$ si ottiene solo un'implicazione: serve il confronto diretto.`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_1^{+\\infty}\\frac{x+1}{x^3+2}\\,dx$',
      problem: String.raw`Studia la convergenza di $\displaystyle\int_1^{+\infty}\frac{x+1}{x^3+2}\,dx$.`,
      steps: [
        String.raw`La funzione è positiva per $x\ge1$. Per $x\to+\infty$ il numeratore è $\sim x$ e il denominatore è $\sim x^3$, quindi $f\sim\dfrac{x}{x^3}=\dfrac{1}{x^2}$.`,
        String.raw`Scelgo $g(x)=\dfrac{1}{x^2}$ e calcolo il rapporto $\dfrac{f}{g}=\dfrac{x^2(x+1)}{x^3+2}$.`,
        {
          text: String.raw`Quindi $f\sim g$ con $\ell=1$, e $\int_1^{+\infty}\frac{dx}{x^2}$ converge (esponente $2>1$). Anche $\int_1^{+\infty}f$ converge.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to+\infty}\frac{x^2(x+1)}{x^3+2}$?`,
            answer: '1',
            explain: String.raw`Divido numeratore e denominatore per $x^3$: $\dfrac{1+\frac1x}{1+\frac{2}{x^3}}\to1$.`,
          },
        },
      ],
      result: String.raw`$\displaystyle\int_1^{+\infty}\frac{x+1}{x^3+2}\,dx$ converge`,
    },
    {
      id: 's12.criteri.L2.e1', type: 'mcq', level: 2,
      prompt: String.raw`Quale comportamento ha $\displaystyle\int_1^{+\infty}\frac{\sqrt x+1}{x^2+x}\,dx$?`,
      options: [
        String.raw`Converge: $f\sim x^{-3/2}$ e $\frac32>1$`,
        String.raw`Diverge: $f\sim x^{-1}$`,
        String.raw`Diverge: il denominatore ha grado $2$`,
        String.raw`Non si può decidere senza calcolare la primitiva`,
      ],
      answer: 0,
      explain: String.raw`Per $x\to+\infty$: $\sqrt x+1\sim\sqrt x$ e $x^2+x\sim x^2$. Quindi $f\sim\dfrac{\sqrt x}{x^2}=x^{-3/2}$, integrabile a $+\infty$. L'errore $x^{-1}$ nasce da un esponente sbagliato di $\sqrt x$. Il solo grado del denominatore non decide.`,
    },
    {
      id: 's12.criteri.L2.e2', type: 'mcq', level: 2,
      prompt: String.raw`Quale affermazione su $\displaystyle\int_1^{+\infty}\frac{\sin^2x}{x^2}\,dx$ è corretta?`,
      options: [
        String.raw`Converge: $0\le\dfrac{\sin^2x}{x^2}\le\dfrac{1}{x^2}$`,
        String.raw`Diverge, perché $\sin^2x$ oscilla`,
        String.raw`Non converge, perché $\sin^2x$ non ha limite`,
        String.raw`Converge a $0$, perché $\sin^2x\to0$`,
      ],
      answer: 0,
      explain: String.raw`Il seno oscilla, ma il numeratore è limitato da $1$: $0\le\frac{\sin^2x}{x^2}\le\frac1{x^2}$, e $\int_1^{+\infty}\frac{dx}{x^2}$ converge. Il seno non tende a $0$, quindi "$\sin^2x\to0$" è falso. Inoltre la funzione è positiva: il valore dell'integrale non può essere $0$.`,
    },
    {
      id: 's12.criteri.L2.e3', type: 'tf', level: 2,
      prompt: String.raw`Se $f(x)\sim\dfrac{1}{x^2}$ per $x\to+\infty$ e $f$ è continua su $[1,+\infty)$, allora $\displaystyle\int_1^{+\infty}f(x)\,dx$ converge.`,
      answer: true,
      explain: String.raw`Vero. Da $f\sim\frac1{x^2}$ segue che $f$ è positiva e vicina a $\frac{1}{x^2}$ da un certo punto in poi. Il confronto asintotico, sulla semiretta, dà convergenza. Il tratto iniziale è un integrale di una funzione continua su un intervallo chiuso e limitato, quindi finito.`,
    },
    {
      id: 's12.criteri.L2.e4', type: 'interval', level: 2,
      prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_0^{1}\frac{dx}{x^\alpha}$?`,
      answer: '(-inf,1)',
      explain: String.raw`È il campione in $0$: converge se e solo se $\alpha<1$. Per $\alpha=1$ si ottiene $-\log t\to+\infty$; per $\alpha>1$, $\frac{t^{1-\alpha}-1}{\alpha-1}\to+\infty$.`,
    },
    {
      id: 's12.criteri.L2.e5', type: 'mcq', level: 2,
      prompt: String.raw`Quale comportamento ha $\displaystyle\int_0^1\frac{dx}{\sin x}$?`,
      options: [
        String.raw`Converge, perché $\frac{1}{\sin x}\le1$`,
        String.raw`Diverge: $\frac{1}{\sin x}\sim\frac1x$ per $x\to0^+$ e $\int_0^1\frac{dx}{x}=+\infty$`,
        String.raw`Converge: $\frac{1}{\sin x}\sim\frac1x$ e $\int_0^1\frac{dx}{x}$ è finito`,
        String.raw`Non si può decidere senza calcolare la primitiva`,
      ],
      answer: 1,
      explain: String.raw`Per $x\to0^+$ si ha $\sin x\sim x$, quindi $\frac{1}{\sin x}\sim\frac1x$. Il campione in $0$ con $\alpha=1$ diverge. La disuguaglianza $\frac1{\sin x}\le1$ è falsa vicino a $0$, dove la funzione cresce senza limiti.`,
    },
  ],
};

const critL3 = {
  id: 's12.criteri.L3',
  title: 'Perché funziona, e condizione necessaria',
  cards: [
    {
      type: 'learn',
      title: 'Dimostrazione del criterio del confronto',
      body: String.raw`Per $0\le f\le g$ poniamo

$$F(t)=\int_a^t f(x)\,dx,\qquad G(t)=\int_a^t g(x)\,dx\qquad(t\ge a).$$

Entrambe sono non decrescenti, perché le funzioni sono positive, e $F(t)\le G(t)$ per ogni $t$. Se $\int g$ converge, $G$ ha limite finito, quindi è limitata. Allora anche $F$ è limitata. Una funzione crescente e limitata ha limite finito: l'integrale di $f$ converge.

>* Monotonia più limitatezza dà l'esistenza del limite finito.`,
    },
    {
      id: 's12.criteri.L3.e1', type: 'order', level: 3,
      prompt: String.raw`Metti in ordine i passi della dimostrazione del criterio del confronto, con $0\le f\le g$ e $\int g$ convergente.`,
      steps: [
        String.raw`Pongo $F(t)=\int_a^t f$ e $G(t)=\int_a^t g$: sono non decrescenti perché $f,g\ge0$.`,
        String.raw`Dal confronto $f\le g$ segue $F(t)\le G(t)$ per ogni $t\ge a$.`,
        String.raw`Se $\int_a^{+\infty}g$ converge, $G$ ha limite finito, quindi è limitata superiormente.`,
        String.raw`Quindi $F$, non decrescente e limitata, ha limite finito: $\int_a^{+\infty}f$ converge.`,
      ],
      distractors: [
        String.raw`Se $\int_a^{+\infty}f$ converge, allora $\int_a^{+\infty}g$ converge.`,
        String.raw`Quindi $F=G$ per ogni $t$, perché $f\le g$.`,
      ],
      explain: String.raw`La catena è: monotonia, confronto dei due integrali, limitatezza del maggiorante, conclusione. Il maggiorante limita l'integrale del minorante, non il contrario.`,
    },
    {
      id: 's12.criteri.L3.e2', type: 'open', level: 3,
      prompt: String.raw`Dimostra che se $0\le f\le g$ e $\int_a^{+\infty}g$ converge, allora $\int_a^{+\infty}f$ converge. Puoi usare il fatto che una funzione crescente e limitata ha limite finito.`,
      answer: String.raw`Siano $F(t)=\int_a^tf$ e $G(t)=\int_a^tg$. Poiché $f\ge0$, $F$ è non decrescente; poiché $f\le g$, $F(t)\le G(t)$. Essendo $\int g$ convergente, $G$ ha limite finito, quindi è limitata. Allora $F$ è crescente e limitata e ha limite finito: l'integrale di $f$ converge.`,
      rubric: [
        String.raw`Monotonia di $F$ dal fatto che $f\ge0$`,
        String.raw`Disuguaglianza $F(t)\le G(t)$ dal confronto $f\le g$`,
        String.raw`Limitatezza di $G$ dalla convergenza di $\int g$`,
        String.raw`Conclusione: $F$ crescente e limitata converge`,
      ],
      explain: String.raw`Serve la catena completa: monotonia, confronto, limitatezza, conclusione. Basta "per confronto converge" senza dimostrarlo non vale il punteggio pieno.`,
      points: 3,
    },
    {
      type: 'learn',
      title: 'Condizione necessaria',
      body: String.raw`Se un integrale converge, la funzione non può restare lontana da zero. Più precisamente:

>* Se $\int_a^{+\infty}f$ converge e $\lim_{x\to+\infty}f(x)$ esiste, allora $\displaystyle\lim_{x\to+\infty}f(x)=0$.

Idea della dimostrazione: se il limite fosse $L\ne0$, da un certo punto in poi $f$ avrebbe lo stesso segno di $L$ e $|f|\ge\frac{|L|}{2}$. Allora l'integrale su $[M,+\infty)$ divergerebbe per confronto con $\int\frac{|L|}{2}\,dx$.

>! È una condizione **necessaria**, non sufficiente. Con $f\to0$ l'integrale può comunque divergere: per $f=\frac1x$ il limite è $0$ e $\int_1^{+\infty}\frac{dx}{x}=+\infty$.`,
    },
    {
      type: 'tf', id: 's12.criteri.L3.e3', level: 3,
      prompt: String.raw`Se $\displaystyle\int_1^{+\infty}f$ converge e $\displaystyle\lim_{x\to+\infty}f(x)$ esiste, allora tale limite è $0$.`,
      answer: true,
      explain: String.raw`Vero. È la condizione necessaria della sezione precedente: se il limite fosse diverso da $0$, $f$ resterebbe da un certo punto in poi lontana da $0$ con segno costante, e l'integrale divergerebbe.`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_1^{+\\infty}\\frac{\\cos^2x+x}{x+1}\\,dx$',
      problem: String.raw`Studia la convergenza di $\displaystyle\int_1^{+\infty}\frac{\cos^2x+x}{x+1}\,dx$.`,
      steps: [
        String.raw`Il numeratore è positivo e $0\le\cos^2x\le1$. Calcolo il limite della funzione per $x\to+\infty$, senza integrare.`,
        {
          text: String.raw`Il termine $\dfrac{\cos^2x}{x+1}$ tende a $0$, perché il numeratore è limitato. Quindi l'integranda non tende a $0$: la condizione necessaria fallisce.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to+\infty}\frac{\cos^2x+x}{x+1}$?`,
            answer: '1',
            explain: String.raw`$\dfrac{\cos^2x}{x+1}\to0$ e $\dfrac{x}{x+1}\to1$. Il limite totale è $1$.`,
          },
        },
        String.raw`Poiché la funzione tende a $1\ne0$, l'integrale diverge a $+\infty$.`,
      ],
      result: String.raw`$\displaystyle\int_1^{+\infty}\frac{\cos^2x+x}{x+1}\,dx=+\infty$ (diverge)`,
    },
    {
      id: 's12.criteri.L3.e4', type: 'mcq', level: 3,
      prompt: String.raw`Quale affermazione su $\displaystyle\int_1^{+\infty}\frac{x^2}{x^3+1}\,dx$ è corretta?`,
      options: [
        String.raw`Converge, perché $f\to0$`,
        String.raw`Converge per confronto con $\dfrac{1}{x^2}$`,
        String.raw`Diverge: $f\sim\dfrac1x$ e $\int_1^{+\infty}\dfrac{dx}{x}=+\infty$`,
        String.raw`Non si può decidere, perché il numeratore ha grado $2$`,
      ],
      answer: 2,
      explain: String.raw`Per $x\to+\infty$: $\dfrac{x^2}{x^3+1}\sim\dfrac{x^2}{x^3}=\dfrac1x$, che diverge. "$f\to0$" è vero ma non basta, perché la condizione necessaria è solo necessaria. Il confronto con $\frac1{x^2}$ non vale, perché $\frac{x^2}{x^3+1}$ è più grande di $\frac1{x^2}$ per $x$ grande.`,
    },
    {
      type: 'problem',
      id: 's12.criteri.L3.p1', level: 3,
      prompt: String.raw`Studia la convergenza di tre integrali: (a) $\displaystyle\int_0^{1}\frac{x^2}{\sqrt x\,(e^x-1)}\,dx$; (b) $\displaystyle\int_2^{+\infty}\frac{dx}{x\log x}$; (c) $\displaystyle\int_2^{+\infty}\frac{dx}{x\log^2x}$.`,
      parts: [
        {
          type: 'mcq',
          prompt: String.raw`(a) Comportamento di $\dfrac{x^2}{\sqrt x\,(e^x-1)}$ per $x\to0^+$.`,
          options: [
            String.raw`Converge: $f\sim x^{1/2}$ per $x\to0^+$`,
            String.raw`Diverge: $f\sim\dfrac1x$ per $x\to0^+$`,
            String.raw`Diverge: $\sqrt x$ al denominatore non è integrabile`,
            String.raw`Converge: $f\sim x^{3/2}$ per $x\to0^+$`,
          ],
          answer: 0,
          explain: String.raw`Con $e^x-1\sim x$: $f\sim\dfrac{x^2}{x^{1/2}\cdot x}=x^{1/2}$, limitata e quindi integrabile. L'opzione $x^{3/2}$ dimentica il denominatore $e^x-1\sim x$.`,
        },
        {
          type: 'mcq',
          prompt: String.raw`(b) Comportamento di $\displaystyle\int_2^{+\infty}\frac{dx}{x\log x}$.`,
          options: [
            String.raw`Converge: $\dfrac{1}{x\log x}\le\dfrac{1}{x^2}$`,
            String.raw`Diverge: $\alpha=1$ e $\beta=1$`,
            String.raw`Converge: il logaritmo cresce`,
            String.raw`Diverge: $\alpha<1$`,
          ],
          answer: 1,
          explain: String.raw`Campione con $\alpha=1$ e $\beta=1$: nel caso $\alpha=1$ serve $\beta>1$. Primitiva $\log\log x\to+\infty$: diverge.`,
        },
        {
          type: 'mcq',
          prompt: String.raw`(c) Comportamento di $\displaystyle\int_2^{+\infty}\frac{dx}{x\log^2x}$.`,
          options: [
            String.raw`Diverge: $\alpha=1$`,
            String.raw`Converge: $\alpha=1$ e $\beta=2>1$`,
            String.raw`Diverge: $\log^2x\to+\infty$`,
            String.raw`Converge: $\dfrac{1}{x\log^2x}\to0$`,
          ],
          answer: 1,
          explain: String.raw`Primitiva $-\dfrac{1}{\log x}$ (la derivata di $-\frac1{\log x}$ è $\frac{1}{x\log^2x}$). Per $x\to+\infty$ tende a $0$: converge. Il fatto che $\log^2x\to+\infty$ non basta da solo.`,
        },
      ],
      solution: String.raw`(a) Vicino a $0$ si ha $e^x-1\sim x$, quindi l'integranda è $\sim x^{1/2}$: converge. (b) Campione con $\alpha=\beta=1$: diverge, perché $\log\log x\to+\infty$. (c) Campione con $\alpha=1$ e $\beta=2>1$: converge, con primitiva $-\frac{1}{\log x}$.`,
      points: 4,
    },
  ],
};

const critPractice = [
  {
    id: 's12.criteri.gen-razionale', type: 'gen', level: 2,
    gen: (R) => {
      const p = R.pick([2, 3, 4]);
      const a = R.int(1, 3);
      const b = R.int(1, 5);
      const conv = p > 2;
      return {
        type: 'mcq',
        prompt: String.raw`Studia la convergenza di $\displaystyle\int_1^{+\infty}\frac{x+${a}}{x^{${p}}+${b}}\,dx$.`,
        options: ['Converge', 'Diverge a $+\\infty$'],
        answer: conv ? 0 : 1,
        explain: String.raw`Per $x\to+\infty$ la funzione è $\sim\dfrac{x}{x^{${p}}}=x^{${1 - p}}$. Il campione $\int_1^{+\infty}\frac{dx}{x^\alpha}$ con $\alpha=${p - 1}$ converge sse $\alpha>1$: qui ${conv ? 'converge' : 'diverge'}.`,
      };
    },
  },
  {
    id: 's12.criteri.gen-log', type: 'gen', level: 3,
    gen: (R) => {
      const [p, q, b] = R.pick(LOG_TAB);
      const conv = p > q || (p === q && b > 1);
      const alphaTex = p === q ? '' : `^{${H.frac(p, q)}}`;
      const logTex = b === 1 ? '\\log x' : `\\log^{${b}}x`;
      return {
        type: 'mcq',
        prompt: String.raw`Studia la convergenza di $\displaystyle\int_2^{+\infty}\frac{dx}{x${alphaTex}\,${logTex}}$.`,
        options: ['Converge', 'Diverge'],
        answer: conv ? 0 : 1,
        explain: String.raw`Campione: $\int_2^{+\infty}\frac{dx}{x^\alpha\log^\beta x}$ converge sse $\alpha>1$, oppure $\alpha=1$ e $\beta>1$. Qui $\alpha=${H.frac(p, q)}$ e $\beta=${b}$: ${conv ? 'converge' : 'diverge'}.`,
      };
    },
  },
  {
    id: 's12.criteri.gen-radice', type: 'gen', level: 3,
    gen: (R) => {
      const n = R.pick([3, 4, 5, 6]);
      const c = R.int(1, 3);
      const d = R.int(1, 3);
      const conv = n > 4;
      return {
        type: 'mcq',
        prompt: String.raw`Studia la convergenza di $\displaystyle\int_1^{+\infty}\frac{x+${c}}{\sqrt{x^{${n}}+${d}}}\,dx$.`,
        options: ['Converge', 'Diverge'],
        answer: conv ? 0 : 1,
        explain: String.raw`Per $x\to+\infty$: $\dfrac{x+${c}}{\sqrt{x^{${n}}+${d}}}\sim\dfrac{x}{x^{${n}/2}}=x^{${H.frac(2 - n, 2)}}$. Converge sse $\frac n2-1>1$, cioè $n>4$. Qui $n=${n}$: ${conv ? 'converge' : 'diverge'}.`,
      };
    },
  },
  {
    id: 's12.criteri.gen-coseno', type: 'gen', level: 2,
    gen: (R) => {
      const p = R.pick([1, 2, 3]);
      const conv = p > 1;
      const pot = p === 1 ? 'x' : `x^{${p}}`;
      return {
        type: 'mcq',
        prompt: String.raw`Studia la convergenza di $\displaystyle\int_1^{+\infty}\frac{\cos^2x}{${pot}}\,dx$.`,
        options: ['Converge', 'Diverge'],
        answer: conv ? 0 : 1,
        explain: conv
          ? String.raw`$0\le\dfrac{\cos^2x}{x^{${p}}}\le\dfrac{1}{x^{${p}}}$ e l'esponente è $${p}>1$: converge per confronto.`
          : String.raw`Qui $\dfrac{\cos^2x}{x}$ non è integrabile: $\cos^2x=\dfrac{1+\cos2x}{2}$, il termine $\dfrac12$ dà $\int\dfrac{dx}{2x}=+\infty$, mentre $\int\dfrac{\cos2x}{2x}\,dx$ converge. Diverge.`,
      };
    },
  },
  {
    id: 's12.criteri.p5', type: 'mcq', level: 1,
    prompt: String.raw`Quale affermazione su $\displaystyle\int_1^{+\infty}\frac{2+\sin x}{x^2}\,dx$ è corretta?`,
    options: [
      String.raw`Converge: $0<\dfrac{2+\sin x}{x^2}\le\dfrac{3}{x^2}$`,
      String.raw`Diverge, perché $\sin x$ oscilla`,
      String.raw`Converge a $0$, perché $\sin x\to0$`,
      String.raw`Diverge, perché il numeratore tende a $2$`,
    ],
    answer: 0,
    explain: String.raw`Il numeratore è compreso fra $1$ e $3$, quindi $\frac{2+\sin x}{x^2}\le\frac{3}{x^2}$. Il maggiorante converge. Il seno non tende a $0$, e l'oscillazione non impedisce la convergenza; l'integrale è positivo, quindi non può valere $0$.`,
  },
  {
    id: 's12.criteri.p6', type: 'tf', level: 1,
    prompt: String.raw`Se $0\le f\le g$ e $\displaystyle\int_a^{+\infty}g$ converge, allora $\displaystyle\int_a^{+\infty}f$ converge.`,
    answer: true,
    explain: String.raw`Vero: è il criterio del confronto, nel verso in cui il maggiorante converge.`,
  },
  {
    id: 's12.criteri.p7', type: 'tf', level: 1,
    prompt: String.raw`Se $0\le f\le g$ e $\displaystyle\int_a^{+\infty}f$ converge, allora $\displaystyle\int_a^{+\infty}g$ converge.`,
    answer: false,
    explain: String.raw`Falso. Il minorante converge, ma il maggiorante può essere più grande e divergere: per esempio $f=\frac1{x^2}\le g=\frac1x$ su $[1,+\infty)$.`,
  },
  {
    id: 's12.criteri.p8', type: 'interval', level: 2,
    prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_2^{+\infty}\frac{dx}{x^{\alpha}\log x}$?`,
    answer: '(1,+inf)',
    explain: String.raw`Con $\alpha>1$ l'esponente decide: converge. Con $\alpha=1$ si ha $\int\frac{dx}{x\log x}=\log\log x\to+\infty$: diverge. Con $\alpha<1$ diverge per il campione.`,
  },
  {
    id: 's12.criteri.p9', type: 'num', level: 2,
    prompt: String.raw`Calcola $\displaystyle\int_1^{+\infty}\frac{dx}{x^2+x}$ (il valore esatto, in forma chiusa).`,
    answer: 'log(2)',
    explain: String.raw`Decomposizione $\frac{1}{x(x+1)}=\frac1x-\frac1{x+1}$. Primitiva $\log\frac{x}{x+1}$. Per $x\to+\infty$ tende a $0$; in $x=1$ vale $\log\frac12$. Risultato $0-\log\frac12=\log2$.`,
  },
  {
    id: 's12.criteri.p10', type: 'mcq', level: 2,
    prompt: String.raw`Quale comportamento ha $\displaystyle\int_1^{+\infty}\frac{x^2+1}{x^4-x}\,dx$?`,
    options: [
      String.raw`Diverge: $f\sim\dfrac1x$`,
      String.raw`Converge: $f\sim\dfrac{1}{x^2}$`,
      String.raw`Converge: $f\to0$`,
      String.raw`Diverge: il numeratore ha grado $2$`,
    ],
    answer: 1,
    explain: String.raw`Per $x\to+\infty$: $\dfrac{x^2+1}{x^4-x}\sim\dfrac{x^2}{x^4}=\dfrac1{x^2}$, che è integrabile. "$f\to0$" è vero ma non basta da solo.`,
  },
  {
    id: 's12.criteri.p11', type: 'open', level: 3,
    prompt: String.raw`Perché il confronto con $\dfrac{1}{x}$ non decide la convergenza di $\displaystyle\int_1^{+\infty}\frac{\sin x}{x}\,dx$? Spiega perché l'integrale converge comunque.`,
    answer: String.raw`$\left|\dfrac{\sin x}{x}\right|\le\dfrac1x$, ma $\int_1^{+\infty}\frac{dx}{x}=+\infty$: il maggiorante non è integrabile e il confronto non decide. Per parti: $\displaystyle\int_1^t\frac{\sin x}{x}\,dx=\cos1-\frac{\cos t}{t}-\int_1^t\frac{\cos x}{x^2}\,dx$. Il termine $\frac{\cos t}{t}$ tende a $0$ e l'ultimo integrale converge per confronto con $\frac1{x^2}$. Quindi l'integrale converge, ma non assolutamente.`,
    rubric: [
      String.raw`Il maggiorante $\frac1x$ diverge, quindi il confronto non decide`,
      String.raw`Integrazione per parti sul tratto $[1,t]$`,
      String.raw`Il termine $\frac{\cos t}{t}$ tende a $0$, e l'ultimo integrale converge per confronto con $\frac1{x^2}$`,
      String.raw`Conclusione: converge, ma non assolutamente`,
    ],
    explain: String.raw`Il punto chiave è che la convergenza assoluta è più forte: qui manca. L'integrale converge grazie alle oscillazioni del seno, che la stima con $\frac1x$ non vede.`,
    points: 3,
  },
  {
    id: 's12.criteri.p12', type: 'tf', level: 3,
    prompt: String.raw`Se $f\ge0$ e $\displaystyle\int_1^{+\infty}f$ converge, allora $\displaystyle\lim_{x\to+\infty}f(x)=0$.`,
    answer: false,
    explain: String.raw`Falso: serve che il limite esista. Esempio: sopra ogni punto $x=n$ ($n\ge2$) si metta un picco triangolare, continuo, di altezza $n$ e base $\frac{2}{n^3}$. Ogni picco ha area $\frac{1}{n^2}$, e la somma converge. Però $f$ non tende a $0$, perché ha picchi di altezza $n$.`,
  },
];

const critFlashcards = [
  { id: 's12.criteri.fc1', kind: 'thm', front: String.raw`Criterio del confronto per integrali impropri`, back: String.raw`Se $0\le f\le g$ su $[a,+\infty)$: se $\int g$ converge allora $\int f$ converge; se $\int f$ diverge allora $\int g$ diverge.` },
  { id: 's12.criteri.fc2', kind: 'dim', front: String.raw`Idea della dimostrazione del confronto`, back: String.raw`$F(t)=\int_a^tf$ e $G(t)=\int_a^tg$ sono non decrescenti e $F\le G$. Se $G$ è limitata (converge), anche $F$ è limitata e crescente, quindi ha limite finito.` },
  { id: 's12.criteri.fc3', kind: 'thm', front: String.raw`Confronto asintotico`, back: String.raw`Se $f,g\ge0$ e $\lim\frac{f}{g}=\ell$ con $0<\ell<+\infty$, allora $\int f$ e $\int g$ hanno la stessa natura. Per $\ell=0$ o $+\infty$ si ottiene solo un'implicazione.` },
  { id: 's12.criteri.fc4', kind: 'formula', front: String.raw`Campione in $+\infty$`, back: String.raw`$\displaystyle\int_a^{+\infty}\frac{dx}{x^\alpha}$ converge $\iff\alpha>1$ ($a>0$).` },
  { id: 's12.criteri.fc5', kind: 'formula', front: String.raw`Campione in $0^+$`, back: String.raw`$\displaystyle\int_0^{b}\frac{dx}{x^\alpha}$ converge $\iff\alpha<1$ ($b>0$).` },
  { id: 's12.criteri.fc6', kind: 'formula', front: String.raw`Campione con logaritmo`, back: String.raw`$\displaystyle\int_2^{+\infty}\frac{dx}{x^\alpha\log^\beta x}$ converge $\iff\alpha>1$, oppure $\alpha=1$ e $\beta>1$.` },
  { id: 's12.criteri.fc7', kind: 'thm', front: String.raw`Condizione necessaria di convergenza`, back: String.raw`Se $\int_a^{+\infty}f$ converge e $\lim_{x\to+\infty}f(x)$ esiste, allora il limite è $0$. È necessaria, non sufficiente.` },
  { id: 's12.criteri.fc8', kind: 'errore', front: String.raw`Errore tipico: il verso del confronto`, back: String.raw`Se $f\le g$ e $\int f$ converge, non si conclude nulla su $\int g$. Se $\int g$ diverge, non si conclude nulla su $\int f$.` },
  { id: 's12.criteri.fc9', kind: 'errore', front: String.raw`Errore tipico: "$f\to0$ quindi converge"`, back: String.raw`$f\to0$ è necessario ma non basta: $f=\frac1x$ tende a $0$ e $\int_1^{+\infty}\frac{dx}{x}=+\infty$.` },
  { id: 's12.criteri.fc10', kind: 'metodo', front: String.raw`Come decidere la natura di un integrale positivo`, back: String.raw`1) Trova i punti critici. 2) Sostituisci $f$ con un'equivalente $\sim c\,x^{-\alpha}$ (o $\sim c\,x^{-\alpha}\log^{-\beta}x$). 3) Applica il campione. Se serve, usa il confronto diretto.` },
];

const criteri = {
  id: 's12.criteri',
  title: 'Confronto, confronto asintotico e integrali campione',
  summary: String.raw`Decidere se un integrale improprio converge senza calcolarlo: confronto con una funzione nota, equivalenti asintotici, integrali campione e condizione necessaria.`,
  prereq: ['s12.def', 's06.gerarchia', 's06.o'],
  examRefs: ['Itinere 15/01/2026 · B1 (a)', 'Appello 10/02/2026 · B5', 'Appello 15/01/2026 · B3 (a)'],
  lessons: [critL1, critL2, critL3],
  practice: critPractice,
  flashcards: critFlashcards,
};
// ---------------------------------------------------------------------------
// s12.parametri · Convergenza al variare di parametri (livello esame)
// ---------------------------------------------------------------------------

const parL1 = {
  id: 's12.parametri.L1',
  title: 'Il parametro come esponente',
  cards: [
    {
      type: 'learn',
      title: 'Un parametro è un esponente',
      body: String.raw`Un **parametro** (per esempio $\alpha$ o $\beta$) è un numero che non conosciamo, e l'integrale dipende da lui. La domanda d'esame è: **per quali valori del parametro l'integrale converge?**

Il parametro di solito compare come **esponente**. Per esempio $\displaystyle\int_1^{+\infty}\frac{dx}{x^{\alpha}}$ converge se $\alpha>1$ e diverge altrimenti.

La risposta non è un numero, ma un **insieme**: un intervallo, o una condizione fra più parametri.`,
      plot: { fns: [{ f: 'x^(-1/2)', label: 'x^(-1/2)' }, { f: 'x^(-2)', label: 'x^(-2)' }], x: [0.4, 4], y: [0, 2.5] },
    },
    {
      type: 'learn',
      title: 'Spezzare nei punti critici',
      body: String.raw`Un integrale con parametri si studia **un punto critico alla volta**. I punti critici sono gli estremi illimitati (come $+\infty$), gli estremi dove $f$ diverge e gli eventuali punti interni dove $f$ diverge.

Si spezza l'intervallo in pezzi, ciascuno con un solo punto critico:

$$\int_a^{b}f=\int_a^{c}f+\int_c^{b}f.$$

>* L'integrale converge **se e solo se converge ogni pezzo**. Quindi le condizioni trovate per i vari punti vanno **intersecate**, non unite.`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_0^{+\\infty}\\frac{dx}{x^{\\alpha}(1+x)}$',
      problem: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_0^{+\infty}\frac{dx}{x^{\alpha}(1+x)}$?`,
      steps: [
        String.raw`Punti critici: $x=0$ (dove $x^{-\alpha}$ può divergere) e $x=+\infty$. Spezzo in $\int_0^1+\int_1^{+\infty}$.`,
        String.raw`In $0^+$ il fattore $1+x\to1$, quindi $f\sim\dfrac{1}{x^{\alpha}}$. Il campione in $0$ converge sse $\alpha<1$.`,
        {
          text: String.raw`In $+\infty$ invece $1+x\sim x$, quindi $f\sim\dfrac{1}{x^{\alpha+1}}$. Il campione all'infinito converge sse $\alpha+1>1$, cioè $\alpha>0$.`,
          ask: {
            type: 'num',
            prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to+\infty}\frac{x^{\alpha+1}}{x^{\alpha}(1+x)}$? (scrivi il numero)`,
            answer: '1',
            explain: String.raw`Semplifico $x^{\alpha}$: resta $\dfrac{x}{1+x}\to1$. Quindi $f$ e $x^{-\alpha-1}$ hanno la stessa natura.`,
          },
        },
        String.raw`Intersezione delle due condizioni: $\alpha<1$ **e** $\alpha>0$.`,
      ],
      result: String.raw`$\displaystyle\int_0^{+\infty}\frac{dx}{x^{\alpha}(1+x)}$ converge sse $0<\alpha<1$`,
    },
    {
      id: 's12.parametri.L1.e1', type: 'interval', level: 1,
      prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_0^{1}x^{\alpha}\,dx$?`,
      answer: '(-1,+inf)',
      explain: String.raw`Il punto critico è $0$, con esponente $\alpha$ positivo o negativo. Il campione in $0$ converge sse $-\alpha<1$, cioè $\alpha>-1$. Per $\alpha=-1$ si ottiene $\log t\to-\infty$: diverge.`,
    },
    {
      id: 's12.parametri.L1.e2', type: 'interval', level: 1,
      prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_1^{+\infty}x^{\alpha}\,dx$?`,
      answer: '(-inf,-1)',
      explain: String.raw`Il punto critico è $+\infty$. Converge sse $-\alpha>1$, cioè $\alpha<-1$. Con $\alpha=-1$ si ottiene $\log t\to+\infty$, quindi diverge.`,
    },
    {
      id: 's12.parametri.L1.e3', type: 'mcq', level: 2,
      prompt: String.raw`Quale condizione su $\alpha$ rende convergente $\displaystyle\int_0^1\frac{x^{\alpha}}{\sqrt x}\,dx$?`,
      options: [
        String.raw`$\alpha>-\frac12$`,
        String.raw`$\alpha<\frac12$`,
        String.raw`$\alpha>\frac12$`,
        String.raw`$\alpha>-1$`,
      ],
      answer: 0,
      explain: String.raw`L'integranda è $x^{\alpha-\frac12}$. Il campione in $0$ converge sse $\alpha-\frac12>-1$, cioè $\alpha>-\frac12$. Scrivere $\alpha>-1$ dimentica la radice al denominatore.`,
    },
    {
      id: 's12.parametri.L1.e4', type: 'tf', level: 2,
      prompt: String.raw`Se un integrale richiede $\alpha>1$ in $+\infty$ e $\alpha<1$ in un punto critico, allora non converge per nessun valore di $\alpha$.`,
      answer: true,
      explain: String.raw`Vero: l'intersezione di $(1,+\infty)$ e $(-\infty,1)$ è vuota. In questo caso la risposta finale è l'insieme vuoto.`,
    },
    {
      id: 's12.parametri.L1.e5', type: 'order', level: 2,
      prompt: String.raw`Metti in ordine il metodo per discutere la convergenza di un integrale con parametro.`,
      steps: [
        String.raw`Individuo i punti critici: estremi illimitati e punti dove l'integranda diverge.`,
        String.raw`Spezzo l'intervallo in pezzi con un solo punto critico ciascuno.`,
        String.raw`Per ogni pezzo trovo la parte principale dell'integranda, con il parametro.`,
        String.raw`Applico il campione a ogni pezzo e ottengo una condizione sul parametro.`,
        String.raw`Interseco le condizioni: l'insieme trovato è l'insieme di convergenza.`,
      ],
      distractors: [
        String.raw`Calcolo la primitiva con il parametro e controllo solo il limite in un punto.`,
        String.raw`Concludo "converge" appena un pezzo converge.`,
      ],
      explain: String.raw`Il metodo chiude con un'intersezione: l'integrale converge solo se convergono tutti i pezzi. Scegliere un valore del parametro a caso non dimostra nulla per gli altri valori.`,
    },
  ],
};

const parL2 = {
  id: 's12.parametri.L2',
  title: 'Parti principali e casi d\'esame',
  cards: [
    {
      type: 'learn',
      title: 'Le equivalenze da ricordare',
      body: String.raw`Per discutere un integrale con parametri servono le **parti principali** vicino a ogni punto critico. Le più frequenti:

>* $1-\cos x\sim\dfrac{x^2}{2}$ e $e^x-1-x\sim\dfrac{x^2}{2}$ per $x\to0$;
>* $e^x-1-x\sim e^x$ per $x\to+\infty$;
>* $\sin x\sim x$ e $\log(1+x)\sim x$ per $x\to0$;
>* $\arctan x\to\dfrac\pi2$ per $x\to+\infty$: la parte principale è la **costante** $\dfrac\pi2$, non $x$.

Le potenze di un equivalente si trattano così: $\left(\dfrac{x^2}{2}\right)^{\alpha}=2^{-\alpha}x^{2\alpha}$. Gli equivalenti si usano sui **fattori** di prodotti e quozienti, non sugli addendi di una somma.`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_0^1\\frac{(1-\\cos x)^{\\alpha}}{e^x-1-x}\\,dx$',
      problem: String.raw`Per quali $\alpha$ converge $\displaystyle\int_0^1\frac{(1-\cos x)^{\alpha}}{e^x-1-x}\,dx$? L'unico punto critico è $x=0$.`,
      steps: [
        String.raw`In $0^+$ numeratore e denominatore sono infinitesimi: $1-\cos x\sim\dfrac{x^2}{2}$ ed $e^x-1-x\sim\dfrac{x^2}{2}$.`,
        {
          text: String.raw`Quindi $f\sim\dfrac{(x^2/2)^{\alpha}}{x^2/2}=2^{1-\alpha}\,x^{2\alpha-2}$. Il pezzo in $0$ si studia con l'esponente $e=2\alpha-2$.`,
          ask: {
            type: 'interval',
            prompt: String.raw`Per quali $\alpha$ converge $\displaystyle\int_0^1x^{2\alpha-2}\,dx$?`,
            answer: '(1/2,+inf)',
            explain: String.raw`Il campione in $0$ con $x^{e}$ converge sse $e>-1$. Qui $e=2\alpha-2$: $2\alpha-2>-1$, cioè $\alpha>\frac12$.`,
          },
        },
        String.raw`Su $(0,1]$ la funzione $e^x-1-x$ si annulla solo in $0$, quindi non ci sono altri punti critici. La condizione è $\alpha>\frac12$.`,
      ],
      result: String.raw`$\displaystyle\int_0^1\frac{(1-\cos x)^{\alpha}}{e^x-1-x}\,dx$ converge sse $\alpha>\frac12$`,
    },
    {
      type: 'learn',
      title: 'Punti critici interni',
      body: String.raw`Un punto critico può trovarsi **dentro** l'intervallo. Succede quando numeratore o denominatore si annullano in un punto interno. Per esempio $1-\cos x=0$ in $x=2k\pi$. Se l'esponente $\gamma$ è negativo, $(1-\cos x)^{\gamma}$ diverge proprio in quei punti, e vanno studiati come punti critici.

>! Non basta guardare gli estremi: prima di concludere "converge per ogni parametro" controlla **tutti** gli zeri nell'intervallo di integrazione.`,
    },
    {
      id: 's12.parametri.L2.e1', type: 'mcq', level: 2,
      prompt: String.raw`Quale condizione su $\alpha$ serve per la convergenza di $\displaystyle\int_0^1\frac{(1-\cos x)^{\alpha}}{e^x-1-x}\,dx$ in $x=0$?`,
      options: [
        String.raw`$\alpha>\frac12$`,
        String.raw`$\alpha>1$`,
        String.raw`$\alpha>0$`,
        String.raw`$\alpha<\frac12$`,
      ],
      answer: 0,
      explain: String.raw`Vicino a $0$ l'integranda è $\sim 2^{1-\alpha}x^{2\alpha-2}$, integrabile sse $2\alpha-2>-1$, cioè $\alpha>\frac12$. "$\alpha>1$" nasce da un esponente sbagliato. "$\alpha>0$" confonde la condizione con la positività di $\alpha$.`,
    },
    {
      id: 's12.parametri.L2.e2', type: 'tf', level: 2,
      prompt: String.raw`Nell'integrale $\displaystyle\int_0^1\frac{(1-\cos x)^{\alpha}}{(e^x-1-x)(1-x)^{\beta}}\,dx$ la condizione in $x=1$ è $\beta<1$.`,
      answer: true,
      explain: String.raw`Vero. In $x=1$ il numeratore e il primo fattore del denominatore sono positivi e finiti ($1-\cos1>0$, $e-2>0$). L'unico responsabile è $(1-x)^{-\beta}$, integrabile sse $\beta<1$.`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_1^{+\\infty}\\frac{\\arctan x}{x^{\\beta+\\frac12}}\\,dx$',
      problem: String.raw`Per quali $\beta$ converge $\displaystyle\int_1^{+\infty}\frac{\arctan x}{x^{\beta+\frac12}}\,dx$?`,
      steps: [
        String.raw`Unico punto critico: $+\infty$. Per $x\to+\infty$ l'arcotangente **non** tende a $0$: tende a $\dfrac\pi2$.`,
        String.raw`Quindi $\arctan x\sim\dfrac\pi2$ e $f\sim\dfrac\pi2\cdot x^{-(\beta+\frac12)}$.`,
        {
          text: String.raw`Con $\gamma=\beta+\frac12$ il campione all'infinito converge sse $\gamma>1$, cioè $\beta+\frac12>1$, ossia $\beta>\frac12$.`,
          ask: {
            type: 'interval',
            prompt: String.raw`Per quali $\gamma$ converge $\displaystyle\int_1^{+\infty}\frac{dx}{x^{\gamma}}$?`,
            answer: '(1,+inf)',
            explain: String.raw`Campione all'infinito: converge sse $\gamma>1$.`,
          },
        },
      ],
      result: String.raw`$\displaystyle\int_1^{+\infty}\frac{\arctan x}{x^{\beta+\frac12}}\,dx$ converge sse $\beta>\frac12$`,
    },
    {
      id: 's12.parametri.L2.e3', type: 'mcq', level: 2,
      prompt: String.raw`Quale parte principale usare per $\arctan x$ quando $x\to+\infty$?`,
      options: [
        String.raw`La costante $\frac\pi2$`,
        String.raw`$x$`,
        String.raw`$0$`,
        String.raw`$\frac1x$`,
      ],
      answer: 0,
      explain: String.raw`$\arctan x$ è limitata e tende a $\frac\pi2\neq0$: la parte principale è la costante. "$x$" è falso: $\arctan x$ non cresce come $x$. Anche $\arctan x\sim x$ vale solo per $x\to0$, e non per $x\to+\infty$.`,
    },
    {
      id: 's12.parametri.L2.e4', type: 'interval', level: 2,
      prompt: String.raw`Per quali $\gamma$ converge $\displaystyle\int_1^{+\infty}\frac{\arctan x}{x^{\gamma}}\,dx$?`,
      answer: '(1,+inf)',
      explain: String.raw`Come nell'esempio: $\arctan x\sim\frac\pi2$, quindi l'integrale converge sse $\gamma>1$.`,
    },
    {
      id: 's12.parametri.L2.e5', type: 'num', level: 3,
      source: 'Appello 11/06/2026 · B4',
      prompt: String.raw`Per $\beta=\frac32$ calcola $\displaystyle\int_1^{+\infty}\frac{\arctan x}{x^{2}}\,dx$ (valore esatto).`,
      answer: 'pi/4+log(2)/2',
      explain: String.raw`Per parti con $u=\arctan x$ e $v=-\frac1x$: $\left[-\frac{\arctan x}{x}\right]_1^{+\infty}+\int_1^{+\infty}\frac{dx}{x(1+x^2)}$. Il primo termine vale $0+\frac\pi4$. Poi $\frac{1}{x(1+x^2)}=\frac1x-\frac{x}{1+x^2}$, con primitiva $\log\frac{x}{\sqrt{1+x^2}}$, che da $1$ a $+\infty$ dà $0-\log\frac{1}{\sqrt2}=\frac12\log2$. Totale $\frac\pi4+\frac12\log2\approx1{,}132$.`,
    },
    {
      id: 's12.parametri.L2.e6', type: 'mcq', level: 2,
      prompt: String.raw`Quale condizione su $\delta$ serve per $\displaystyle\int_1^{+\infty}\frac{(1-\cos x)^{\gamma}}{(e^x-1-x)(x-1)^{\delta}}\,dx$ in $x=1^+$?`,
      options: [
        String.raw`$\delta<1$`,
        String.raw`$\delta>1$`,
        String.raw`$\gamma>\frac12$`,
        String.raw`Nessuna condizione`,
      ],
      answer: 0,
      explain: String.raw`In $x=1$ si ha $1-\cos1>0$ e $e-2>0$: nessuno dei due fattori si annulla. Quindi l'unico responsabile è $(x-1)^{-\delta}$, integrabile sse $\delta<1$. Il parametro $\gamma$ non c'entra in $x=1$.`,
    },
  ],
};

const parL3 = {
  id: 's12.parametri.L3',
  title: "Discussione d'esame completa",
  cards: [
    {
      type: 'learn',
      title: 'Attenzione: il parametro $\\gamma$ negativo',
      body: String.raw`Il secondo integrale dell'appello del 10/02/2026 (B5) è $\displaystyle\int_1^{+\infty}\frac{(1-\cos x)^{\gamma}}{(e^x-1-x)(x-1)^{\delta}}\,dx$. La soluzione ufficiale dice che converge sse $\delta<1$, per ogni $\gamma$. Questa affermazione non è corretta per $\gamma$ negativi.

>! Nota: in $[1,+\infty)$ la funzione $1-\cos x$ si annulla in $x=2k\pi$. Vicino a quei punti $1-\cos x\sim\dfrac{(x-2k\pi)^2}{2}$, quindi $(1-\cos x)^{\gamma}\sim c\,|x-2k\pi|^{2\gamma}$, integrabile sse $2\gamma>-1$. La condizione corretta è $\delta<1$ **e** $\gamma>-\dfrac12$. All'infinito, con $e^x$ al denominatore, non ci sono altre condizioni.`,
    },
    {
      id: 's12.parametri.L3.e1', type: 'order', level: 3,
      prompt: String.raw`Metti in ordine la discussione completa di un integrale con parametri, come all'esame.`,
      steps: [
        String.raw`Elenco i punti critici: estremi illimitati, estremi dove l'integranda diverge, zeri interni del denominatore o esponenti negativi.`,
        String.raw`Spezzo l'intervallo in pezzi con un solo punto critico ciascuno.`,
        String.raw`Per ogni pezzo trovo la parte principale dell'integranda, con il parametro.`,
        String.raw`Applico il campione a ogni pezzo e ottengo una condizione per ciascun punto critico.`,
        String.raw`Interseco le condizioni: scrivo l'insieme dei parametri che rende convergenti tutti i pezzi.`,
      ],
      distractors: [
        String.raw`Calcolo la primitiva con il parametro e controllo solo il limite in un punto.`,
        String.raw`Concludo "converge" appena un pezzo converge.`,
      ],
      explain: String.raw`La discussione chiude sempre con un'intersezione. Un pezzo che converge non garantisce la convergenza del resto.`,
    },
    {
      type: 'example',
      title: 'Esempio svolto: $\\displaystyle\\int_1^{+\\infty}\\frac{\\log^{1-\\beta}x}{(x-1)^{\\alpha}}\\,dx$',
      problem: String.raw`Per quali $\alpha,\beta$ converge $\displaystyle\int_1^{+\infty}\frac{\log^{1-\beta}x}{(x-1)^{\alpha}}\,dx$?`,
      steps: [
        String.raw`Punti critici: $x=1$ (dove $\log x\to0$ e $(x-1)^{-\alpha}$ può divergere) e $x=+\infty$. Spezzo in $\int_1^2+\int_2^{+\infty}$.`,
        String.raw`In $1^+$ si ha $\log x\sim x-1$, quindi $\log^{1-\beta}x\sim(x-1)^{1-\beta}$ e l'integranda è $\sim(x-1)^{1-\alpha-\beta}$.`,
        {
          text: String.raw`Con $s=1-\alpha-\beta$ il campione in $1^+$ converge sse $s>-1$, cioè $\alpha+\beta<2$.`,
          ask: {
            type: 'interval',
            prompt: String.raw`Per quali $s$ converge $\displaystyle\int_1^{2}(x-1)^{s}\,dx$?`,
            answer: '(-1,+inf)',
            explain: String.raw`Campione in $1^+$ con esponente $s$: converge sse $s>-1$.`,
          },
        },
        String.raw`In $+\infty$: se $\alpha\le1$ non c'è convergenza compatibile con $\alpha+\beta<2$. Per $\alpha=1$ servirebbe $\beta>2$, che contraddice $\beta<1$. Per $\alpha>1$ la potenza $x^{-\alpha}$ domina il logaritmo e converge.`,
        String.raw`Quindi l'integrale converge sse $\alpha>1$ **e** $\alpha+\beta<2$.`,
      ],
      result: String.raw`$\displaystyle\int_1^{+\infty}\frac{\log^{1-\beta}x}{(x-1)^{\alpha}}\,dx$ converge sse $\alpha>1$ e $\alpha+\beta<2$`,
    },
    {
      id: 's12.parametri.L3.e2', type: 'mcq', level: 3,
      source: 'Itinere 15/01/2026 · B1 (a)',
      prompt: String.raw`Per $\displaystyle\int_1^{+\infty}\frac{\log^{1-\beta}x}{(x-1)^{\alpha}}\,dx$, quale insieme di parametri rende convergente l'integrale?`,
      options: [
        String.raw`$\alpha>1$ e $\alpha+\beta<2$`,
        String.raw`$\alpha<1$ e $\beta>2$`,
        String.raw`Per ogni $\alpha,\beta$`,
        String.raw`$\alpha>1$ e $\alpha+\beta>2$`,
      ],
      answer: 0,
      explain: String.raw`In $1^+$ serve $\alpha+\beta<2$; all'infinito serve $\alpha>1$. Il caso $\alpha<1$ e $\beta>2$ fallisce all'infinito. Il caso $\alpha>1$ e $\alpha+\beta>2$ fallisce in $1^+$.`,
    },
    {
      id: 's12.parametri.L3.e3', type: 'problem', level: 3,
      source: 'Appello 10/02/2026 · B5',
      prompt: String.raw`Discutere la convergenza di $\displaystyle\int_0^1\frac{(1-\cos x)^{\alpha}}{(e^x-1-x)(1-x)^{\beta}}\,dx$ e di $\displaystyle\int_1^{+\infty}\frac{(1-\cos x)^{\gamma}}{(e^x-1-x)(x-1)^{\delta}}\,dx$.`,
      parts: [
        {
          type: 'interval',
          prompt: String.raw`(a) Condizione su $\alpha$ in $0$ per il primo integrale.`,
          answer: '(1/2,+inf)',
          explain: String.raw`Vicino a $0$: $f\sim2^{1-\alpha}x^{2\alpha-2}$, integrabile sse $\alpha>\frac12$.`,
        },
        {
          type: 'interval',
          prompt: String.raw`(b) Condizione su $\beta$ in $1$ per il primo integrale.`,
          answer: '(-inf,1)',
          explain: String.raw`In $1$ si ha $(1-x)^{-\beta}$ e il resto è positivo e finito: integrabile sse $\beta<1$.`,
        },
        {
          type: 'interval',
          prompt: String.raw`(c) Condizione su $\delta$ in $1^+$ per il secondo integrale.`,
          answer: '(-inf,1)',
          explain: String.raw`In $1^+$ resta $(x-1)^{-\delta}$: integrabile sse $\delta<1$.`,
        },
        {
          type: 'interval',
          prompt: String.raw`(d) Condizione su $\gamma$ per il secondo integrale, tenendo conto dei punti $x=2k\pi$.`,
          answer: '(-1/2,+inf)',
          explain: String.raw`Vicino a $2k\pi$ l'integranda è $\sim c\,|x-2k\pi|^{2\gamma}$, integrabile sse $\gamma>-\frac12$. All'infinito non ci sono altre condizioni.`,
        },
      ],
      solution: String.raw`Primo integrale: in $0$ serve $\alpha>\frac12$, in $1$ serve $\beta<1$; converge sse $\alpha>\frac12$ e $\beta<1$. Secondo integrale: in $1^+$ serve $\delta<1$; i punti $x=2k\pi$ richiedono $\gamma>-\frac12$; all'infinito la presenza di $e^x$ rende integrabile ogni termine. Converge sse $\delta<1$ e $\gamma>-\frac12$.

>! Nota: la soluzione ufficiale riporta "per ogni $\gamma$", che vale solo per $\gamma>-\frac12$ (vedi la card sul parametro $\gamma$ negativo).`,
      points: 4,
    },
    {
      id: 's12.parametri.L3.e4', type: 'problem', level: 3,
      source: 'Appello 03/09/2026 · B4',
      prompt: String.raw`Sia $f_a(x)=\dfrac{x^a+1}{x^a+x^2}$ su $[1,+\infty)$. Per quali $a\in\R$ è integrabile su $[1,+\infty)$?`,
      parts: [
        {
          type: 'mcq',
          prompt: String.raw`(a) Per $0<a<2$, quale parte principale ha $f_a$ per $x\to+\infty$?`,
          options: [
            String.raw`$x^{a-2}$`,
            String.raw`$x^{-2}$`,
            String.raw`$1$`,
            String.raw`$x^{a}$`,
          ],
          answer: 0,
          explain: String.raw`Per $0<a<2$ il numeratore è $\sim x^a$ e il denominatore è $\sim x^2$: $f_a\sim x^{a-2}$.`,
        },
        {
          type: 'interval',
          prompt: String.raw`(b) Per quali $a\in\R$ l'integrale converge? Considera tutti i valori di $a$.`,
          answer: '(-inf,1)',
          explain: String.raw`Per $0<a<2$: serve $a-2<-1$, cioè $a<1$. Per $a\le0$: $f_a\sim\dfrac{c}{x^2}$, sempre integrabile. Per $a\ge2$: $f_a$ non tende a $0$ (tende a $1$ se $a>2$, a $\frac12$ se $a=2$): diverge.`,
        },
      ],
      solution: String.raw`Per $0<a<2$ si ha $f_a\sim x^{a-2}$, integrabile sse $a<1$. Per $a\le0$ si ha $f_a\sim\dfrac{c}{x^2}$, sempre integrabile. Per $a\ge2$ la funzione non tende a $0$, quindi diverge. Insieme di convergenza: $a<1$.`,
      points: 3,
    },
    {
      id: 's12.parametri.L3.e5', type: 'tf', level: 2,
      prompt: String.raw`In un integrale con un solo parametro, la risposta alla domanda "per quali valori converge?" è sempre un intervallo.`,
      answer: false,
      explain: String.raw`Falso. Con più parametri la condizione può essere una disuguaglianza fra di essi (per esempio $\alpha+\beta<2$), e può essere l'insieme vuoto. Con un solo parametro l'insieme è spesso un intervallo, ma non è una regola: va controllato caso per caso.`,
    },
    {
      id: 's12.parametri.L3.e6', type: 'mcq', level: 2,
      prompt: String.raw`Per quali $\alpha$ converge $\displaystyle\int_0^{+\infty}\frac{x^{\alpha}}{1+x^3}\,dx$?`,
      options: [
        String.raw`$(-1,2)$`,
        String.raw`$(-1,3)$`,
        String.raw`$(0,2)$`,
        String.raw`$(-\infty,2)$`,
      ],
      answer: 0,
      explain: String.raw`In $0$: $x^{\alpha}$ è integrabile sse $\alpha>-1$. In $+\infty$: $f\sim x^{\alpha-3}$, integrabile sse $\alpha-3<-1$, cioè $\alpha<2$. Intersezione $(-1,2)$.`,
    },
  ],
};

const parPractice = [
  {
    id: 's12.parametri.gen-zero', type: 'gen', level: 2,
    gen: (R) => {
      const k = R.int(0, 2);
      const sh = k > 0 ? `+${k}` : '';
      return {
        type: 'interval',
        prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_0^{1}\frac{dx}{x^{\alpha${sh}}}$?`,
        answer: `(-inf,${1 - k})`,
        explain: String.raw`Il punto critico è $0$. Con esponente $e=\alpha${sh}$ l'integrale converge sse $e<1$, cioè $\alpha<${1 - k}$.`,
      };
    },
  },
  {
    id: 's12.parametri.gen-inf', type: 'gen', level: 2,
    gen: (R) => {
      const k = R.int(0, 2);
      const sh = k > 0 ? `+${k}` : '';
      return {
        type: 'interval',
        prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_1^{+\infty}\frac{dx}{x^{\alpha${sh}}}$?`,
        answer: `(${1 - k},+inf)`,
        explain: String.raw`Il punto critico è $+\infty$. Con esponente $e=\alpha${sh}$ l'integrale converge sse $e>1$, cioè $\alpha>${1 - k}$.`,
      };
    },
  },
  {
    id: 's12.parametri.gen-due-punti', type: 'gen', level: 3,
    gen: (R) => {
      const k = R.pick([1, 2, 3]);
      return {
        type: 'interval',
        prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_0^{+\infty}\frac{dx}{x^{\alpha}\,(1+x^{${k}})}$?`,
        answer: `(${1 - k},1)`,
        explain: String.raw`In $0$ l'integranda è $\sim x^{-\alpha}$: serve $\alpha<1$. In $+\infty$ è $\sim x^{-\alpha-${k}}$: serve $\alpha+${k}>1$, cioè $\alpha>${1 - k}$. Intersezione $(${1 - k},1)$.`,
      };
    },
  },
  {
    id: 's12.parametri.gen-rapporto', type: 'gen', level: 3,
    gen: (R) => {
      const m = R.int(0, 2);
      const num = m === 0 ? '1' : `x^{${m}}`;
      return {
        type: 'interval',
        prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\int_1^{+\infty}\frac{${num}}{x^{\alpha}+1}\,dx$?`,
        answer: `(${m + 1},+inf)`,
        explain: String.raw`Per $x\to+\infty$ e $\alpha>0$ la funzione è $\sim x^{${m}-\alpha}$. Converge sse $\alpha-${m}>1$, cioè $\alpha>${m + 1}$.`,
      };
    },
  },
  {
    id: 's12.parametri.p5', type: 'interval', level: 2,
    prompt: String.raw`Per quali $\alpha$ converge $\displaystyle\int_0^{1}\frac{\sin x}{x^{\alpha}}\,dx$?`,
    answer: '(-inf,2)',
    explain: String.raw`In $0$: $\frac{\sin x}{x^{\alpha}}\sim x^{1-\alpha}$, integrabile sse $1-\alpha>-1$, cioè $\alpha<2$.`,
  },
  {
    id: 's12.parametri.p6', type: 'interval', level: 2,
    prompt: String.raw`Per quali $\alpha$ converge $\displaystyle\int_1^{+\infty}\frac{\log x}{x^{\alpha}}\,dx$?`,
    answer: '(1,+inf)',
    explain: String.raw`Il logaritmo cresce più lentamente di ogni potenza: $\dfrac{\log x}{x^{\alpha}}\sim\dfrac{1}{x^{\alpha-\varepsilon}}$ per ogni $\varepsilon>0$. Converge sse $\alpha>1$.`,
  },
  {
    id: 's12.parametri.p7', type: 'interval', level: 2,
    prompt: String.raw`Per quali $\alpha$ converge $\displaystyle\int_0^{1}\frac{dx}{x^{2\alpha}}$?`,
    answer: '(-inf,1/2)',
    explain: String.raw`Campione in $0$ con esponente $2\alpha$: converge sse $2\alpha<1$, cioè $\alpha<\frac12$.`,
  },
  {
    id: 's12.parametri.p8', type: 'tf', level: 2,
    prompt: String.raw`Se $\int_1^{+\infty}f_\alpha$ converge sse $\alpha>1$ e $\int_0^1f_\alpha$ converge sse $\alpha<0$, allora $\int_0^{+\infty}f_\alpha$ non converge per nessun $\alpha$.`,
    answer: true,
    explain: String.raw`Vero: l'integrale su $[0,+\infty)$ converge sse convergono entrambi i pezzi, cioè sse $\alpha>1$ e $\alpha<0$ insieme. Le due condizioni sono incompatibili.`,
  },
  {
    id: 's12.parametri.p9', type: 'num', level: 1,
    prompt: String.raw`Per $\alpha=\frac32$ calcola $\displaystyle\int_1^{+\infty}\frac{dx}{x^{\alpha}}$.`,
    answer: '2',
    explain: String.raw`Primitiva $-2x^{-1/2}$. Il valore è $0-(-2)=2$.`,
  },
  {
    id: 's12.parametri.p10', type: 'open', level: 3,
    prompt: String.raw`Spiega perché $\displaystyle\int_0^{+\infty}\frac{dx}{x^{\alpha}}$ non converge per nessun $\alpha\in\R$.`,
    answer: String.raw`Spezzo in $\int_0^1+\int_1^{+\infty}$. Il pezzo in $0$ richiede $\alpha<1$; il pezzo in $+\infty$ richiede $\alpha>1$. Le due condizioni sono incompatibili: nessun $\alpha$ rende convergenti entrambi i pezzi.`,
    rubric: [
      String.raw`Spezzare in $\int_0^1+\int_1^{+\infty}$`,
      String.raw`Condizione in $0$: $\alpha<1$`,
      String.raw`Condizione in $+\infty$: $\alpha>1$`,
      String.raw`Incompatibilità delle condizioni, quindi insieme vuoto`,
    ],
    explain: String.raw`La risposta corretta spezza l'integrale: senza spezzarlo non si vede che servono entrambe le condizioni.`,
    points: 3,
  },
  {
    id: 's12.parametri.p11', type: 'interval', level: 2,
    prompt: String.raw`Per quali $\alpha$ converge $\displaystyle\int_0^{+\infty}\frac{x^{\alpha}}{(1+x)^2}\,dx$?`,
    answer: '(-1,1)',
    explain: String.raw`In $0$ serve $\alpha>-1$. In $+\infty$ la funzione è $\sim x^{\alpha-2}$, integrabile sse $\alpha<1$. Intersezione $(-1,1)$.`,
  },
];

const parFlashcards = [
  { id: 's12.parametri.fc1', kind: 'metodo', front: String.raw`Discutere un integrale con parametro`, back: String.raw`Individuo i punti critici; spezzo; per ogni pezzo trovo la parte principale con il parametro e applico il campione; interseco le condizioni.` },
  { id: 's12.parametri.fc2', kind: 'errore', front: String.raw`Errore tipico: unione invece di intersezione`, back: String.raw`L'integrale converge sse convergono **tutti** i pezzi. Le condizioni si intersecano, non si uniscono.` },
  { id: 's12.parametri.fc3', kind: 'formula', front: String.raw`Equivalenti utili con parametro`, back: String.raw`$\left(1-\cos x\right)^{\alpha}\sim\left(\dfrac{x^2}{2}\right)^{\alpha}$ e $e^x-1-x\sim\dfrac{x^2}{2}$ per $x\to0$; $e^x-1-x\sim e^x$ per $x\to+\infty$.` },
  { id: 's12.parametri.fc4', kind: 'formula', front: String.raw`Arcotangente all'infinito`, back: String.raw`$\arctan x\to\dfrac\pi2$ per $x\to+\infty$: la parte principale è la costante $\dfrac\pi2$, non $x$.` },
  { id: 's12.parametri.fc5', kind: 'errore', front: String.raw`Errore tipico: punti critici interni`, back: String.raw`Gli zeri di $1-\cos x$ in $x=2k\pi$ sono punti critici se l'esponente è negativo: l'integranda vi diverge con $|x-2k\pi|^{2\gamma}$, integrabile sse $\gamma>-\frac12$.` },
  { id: 's12.parametri.fc6', kind: 'formula', front: String.raw`Campione con esponente spostato`, back: String.raw`$\displaystyle\int_1^{+\infty}\frac{dx}{x^{\alpha+k}}$ converge sse $\alpha>1-k$; $\displaystyle\int_0^{1}\frac{dx}{x^{\alpha+k}}$ converge sse $\alpha<1-k$.` },
  { id: 's12.parametri.fc7', kind: 'metodo', front: String.raw`Estremi dell'insieme di convergenza`, back: String.raw`Il valore critico che annulla l'esponente di un campione (per esempio $\alpha=1$) di solito **non** è incluso: lì il campione diverge.` },
];

const parametri = {
  id: 's12.parametri',
  title: 'Convergenza al variare di parametri',
  summary: String.raw`Discutere per quali valori di $\alpha,\beta,\gamma$ un integrale improprio converge: si spezza nei punti critici, si trova la parte principale di ciascun pezzo e si intersecano le condizioni.`,
  prereq: ['s12.criteri', 's06.ordine', 's06.o', 's10.sviluppi'],
  examRefs: ['Itinere 15/01/2026 · B1 (a)', 'Appello 15/01/2026 · B3 (a)', 'Appello 10/02/2026 · B5', 'Appello 11/06/2026 · B4', 'Appello 03/09/2026 · B4'],
  lessons: [parL1, parL2, parL3],
  practice: parPractice,
  flashcards: parFlashcards,
};

export default {
  id: 's12',
  title: 'Integrali impropri',
  subtitle: 'Prima e seconda specie, criteri di convergenza, parametri',
  intro: String.raw`All'esame compare quasi ogni anno un integrale improprio: un'area che va all'infinito, una funzione illimitata vicino a un estremo, oppure un parametro da discutere. Qui impari a calcolarli come limiti e a decidere se convergono.`,
  skills: [def, criteri, parametri],
};
