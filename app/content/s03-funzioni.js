import { H } from '../engine/tex.js';

// Helper locali per i generatori
const ivl = (x) => (x === Infinity ? 'inf' : x === -Infinity ? '-inf' : String(x));
const two = (R, lo, hi) => {
  // due interi distinti ordinati
  const a = R.int(lo, hi);
  let b = R.int(lo, hi);
  while (b === a) b = R.int(lo, hi);
  return a < b ? [a, b] : [b, a];
};
const xm = (a) => (a === 0 ? 'x' : a > 0 ? `x - ${a}` : `x + ${-a}`);
const pf = (a) => (a === 0 ? 'x' : `(${xm(a)})`);

export default {
  id: 's03',
  title: 'Funzioni reali',
  subtitle: 'Dominio, immagine, proprietà, simmetrie, grafici elementari',
  intro: String.raw`Ogni esercizio della Parte B comincia da qui: **trovare il dominio**, riconoscere simmetrie e monotonia, disegnare a mano i grafici elementari e le loro trasformazioni. Sono 2–3 punti "sicuri" in ogni studio di funzione, e sono anche le domande in cui si perdono più punti per distrazione.`,
  skills: [
    // =====================================================================
    {
      id: 's03.base',
      title: 'Funzione, dominio, immagine',
      summary: String.raw`Saprai trovare il campo di esistenza di qualunque funzione dei temi d'esame e l'immagine delle funzioni più semplici.`,
      prereq: ['s00.disequazioni', 's00.esplog', 's00.trig', 's01.reali'],
      examRefs: ['Itinere 11/11/2025 · Parte B', 'Appello 15/01/2026 · Parte B', 'Appello 11/06/2026 · Parte B'],
      lessons: [
        {
          id: 's03.base.L1',
          title: 'Che cos\'è una funzione',
          cards: [
            {
              type: 'learn',
              title: 'L\'idea',
              body: String.raw`Una **funzione** $f: A \to B$ è una regola che a **ogni** $x \in A$ associa **uno e un solo** $y = f(x) \in B$.

- $A$ è il **dominio** (gli input ammessi), $B$ il **codominio** (dove "cadono" gli output).
- $x$ si chiama variabile indipendente, $y = f(x)$ è l'**immagine** di $x$.

Esempio: $f(x) = x^2$ manda $3 \mapsto 9$ e $-3 \mapsto 9$. Due input diversi possono avere lo stesso output; **un input non può avere due output**.

Il **grafico** di $f$ è l'insieme dei punti $(x, f(x))$ del piano.`,
              plot: { fns: [{ f: 'x^2', label: 'f(x)=x^2' }], x: [-3, 3], y: [-1, 9], points: [[3, 9, '(3,9)'], [-3, 9, '(-3,9)']] },
            },
            {
              id: 's03.base.L1.e1', type: 'mcq', level: 1,
              prompt: String.raw`Quale di queste regole **non** definisce una funzione da $\R$ a $\R$?`,
              options: [
                String.raw`a ogni $x$ associa i numeri $y$ tali che $y^2 = x$`,
                String.raw`$f(x) = x^2$`,
                String.raw`$f(x) = |x|$`,
                String.raw`$f(x) = 3$ per ogni $x$`,
              ],
              answer: 0,
              explain: String.raw`Con $y^2 = x$, a $x = 4$ corrispondono **due** valori ($y = \pm 2$) e a $x = -1$ **nessuno**: non è una funzione. Le altre vanno bene: anche la costante $f(x) = 3$ è una funzione (a ogni $x$ un solo valore, sempre lo stesso).`,
            },
            {
              id: 's03.base.L1.e2', type: 'num', level: 1,
              prompt: String.raw`Sia $f(x) = x^2 - 3x + 1$. Calcola $f(-2)$.`,
              answer: '11',
              explain: String.raw`Sostituisco $x = -2$ **con le parentesi**: $(-2)^2 - 3(-2) + 1 = 4 + 6 + 1 = 11$. Errore tipico: scrivere $-2^2 = -4$.`,
            },
            {
              id: 's03.base.L1.e3', type: 'tf', level: 1,
              prompt: String.raw`Una retta verticale $x = c$ può incontrare il grafico di una funzione in due punti distinti.`,
              answer: false,
              explain: String.raw`Se la retta $x = c$ incontrasse il grafico in $(c, y_1)$ e $(c, y_2)$ con $y_1 \ne y_2$, l'input $c$ avrebbe due output. **Test della retta verticale**: ogni retta verticale incontra il grafico al più una volta.`,
            },
            {
              type: 'learn',
              title: 'Dominio naturale e immagine',
              body: String.raw`Quando la funzione è data solo con una formula, il **dominio naturale** (o **campo di esistenza**) è il più grande insieme di numeri reali per cui la formula ha senso.

Esempio: $f(x) = \frac{1}{x}$ ha dominio $\R \setminus \{0\}$.

L'**immagine** di $f$ è l'insieme dei valori effettivamente raggiunti:
$$f(A) = \{\, f(x) : x \in A \,\}.$$
Per $f(x) = x^2$ su $\R$ l'immagine è $[0, +\infty)$: i negativi non sono mai raggiunti.

>! Il codominio è dove *possono* cadere i valori; l'immagine è dove cadono *davvero*.`,
            },
            {
              id: 's03.base.L1.e4', type: 'mcq', level: 1,
              prompt: String.raw`Qual è il dominio naturale di $f(x) = \dfrac{1}{x - 2}$?`,
              options: [String.raw`$\R \setminus \{2\}$`, String.raw`$\R \setminus \{-2\}$`, String.raw`$(2, +\infty)$`, String.raw`$\R$`],
              answer: 0,
              explain: String.raw`Serve solo il denominatore diverso da zero: $x - 2 \ne 0 \iff x \ne 2$. $(2,+\infty)$ è sbagliato: per $x < 2$ la frazione esiste (è negativa, ma esiste). $-2$ è un errore di segno.`,
            },
            {
              id: 's03.base.L1.e5', type: 'expr', level: 1, vars: ['x'],
              prompt: String.raw`Sia $f(x) = 2x + 1$. Scrivi $f(x + 1)$.`,
              answer: '2x+3',
              explain: String.raw`Al posto di $x$ metto $(x+1)$: $f(x+1) = 2(x+1) + 1 = 2x + 3$. Errore tipico: $f(x) + 1 = 2x + 2$, che è un'altra cosa.`,
            },
            {
              id: 's03.base.L1.e6', type: 'mcq', level: 1,
              prompt: String.raw`Quale punto appartiene al grafico di $f(x) = x^2 - 1$?`,
              options: [String.raw`$(2, 3)$`, String.raw`$(3, 2)$`, String.raw`$(-1, 1)$`, String.raw`$(0, 1)$`],
              answer: 0,
              explain: String.raw`$(a, b)$ sta sul grafico se $b = f(a)$. $f(2) = 4 - 1 = 3$: sì. $(3,2)$ scambia le coordinate ($f(3) = 8$). $f(-1) = 0 \ne 1$, $f(0) = -1 \ne 1$.`,
              plot: { fns: ['x^2-1'], x: [-3, 3], y: [-2, 6], points: [[2, 3, '(2,3)']] },
            },
            {
              id: 's03.base.L1.e7', type: 'tf', level: 2,
              prompt: String.raw`$f(x) = \dfrac{x^2}{x}$ e $g(x) = x$ sono la stessa funzione.`,
              answer: false,
              explain: String.raw`Due funzioni sono uguali se hanno **stesso dominio** e stessi valori. $f$ non è definita in $0$ (dominio $\R\setminus\{0\}$), $g$ sì. Fuori da $0$ coincidono: il grafico di $f$ è la retta $y = x$ "bucata" nell'origine.`,
              plot: { fns: ['x'], x: [-3, 3], y: [-3, 3], open: [[0, 0]] },
            },
            {
              id: 's03.base.L1.e8', type: 'num', level: 2,
              prompt: String.raw`Sia $f(x) = \dfrac{x + 1}{x - 1}$. Per quale $x$ vale $f(x) = 3$?`,
              answer: '2',
              explain: String.raw`$\frac{x+1}{x-1} = 3 \Rightarrow x + 1 = 3x - 3 \Rightarrow x = 2$, che sta nel dominio ($x \ne 1$). Controllo: $f(2) = 3/1 = 3$.`,
            },
            {
              id: 's03.base.L1.e9', type: 'num', level: 1,
              prompt: String.raw`Sia $f(x) = \sqrt{x + 5}$. Calcola $f(4)$.`,
              answer: '3',
              explain: String.raw`$f(4) = \sqrt{9} = 3$. La radice quadrata di un numero positivo è il valore **positivo**: non $\pm 3$.`,
            },
          ],
        },
        {
          id: 's03.base.L2',
          title: 'Il campo di esistenza',
          cards: [
            {
              type: 'learn',
              title: 'Le condizioni di esistenza',
              body: String.raw`Per trovare il dominio scrivi **una condizione per ogni "pezzo pericoloso"** e mettile tutte a sistema:

- frazione $\frac{N}{D}$: $D \ne 0$;
- radice di indice **pari** $\sqrt[2k]{A}$: $A \ge 0$ (indice dispari: nessuna condizione);
- logaritmo $\log A$: $A > 0$;
- potenza con esponente variabile $A^{B}$ (cioè $e^{B \log A}$): $A > 0$;
- $\tan A$: $A \ne \frac{\pi}{2} + k\pi$;
- $\arcsin A$, $\arccos A$: $-1 \le A \le 1$.

Esponenziale $e^A$, $\sin$, $\cos$, $\arctan$, polinomi, $|\cdot|$, radici dispari: definiti ovunque esista $A$.

>! Una radice **al denominatore** richiede radicando $> 0$ (strettamente): deve esistere *e* essere $\ne 0$.

> Notazione: scrivi le risposte come intervalli, es. (-inf,1)U[2,inf); usa R per tutto $\R$.`,
            },
            {
              type: 'example',
              title: 'Esempio svolto (Itinere 11/11/2025)',
              problem: String.raw`Trova il dominio di $f(x) = \dfrac{\sqrt{x-1}}{\sqrt{5-x}}$.`,
              steps: [
                String.raw`Numeratore: radice quadrata, serve $x - 1 \ge 0$, cioè $x \ge 1$.`,
                String.raw`Denominatore: radice quadrata **e** denominatore, serve $5 - x > 0$, cioè $x < 5$.`,
                String.raw`Metto a sistema: $1 \le x < 5$.`,
              ],
              result: String.raw`$\text{dom} f = [1, 5)$: $1$ è incluso (numeratore $0$, va bene), $5$ è escluso.`,
            },
            {
              type: 'example',
              title: 'Ora completa tu',
              problem: String.raw`Trova il dominio di $f(x) = \log\dfrac{x-1}{x+2}$.`,
              steps: [
                String.raw`Il logaritmo vuole l'argomento positivo: $\frac{x-1}{x+2} > 0$ (il denominatore $\ne 0$ è già incluso).`,
                String.raw`Studio del segno: $N > 0 \iff x > 1$; $D > 0 \iff x > -2$.`,
                {
                  text: String.raw`La frazione è positiva dove $N$ e $D$ hanno lo stesso segno: $x < -2$ oppure $x > 1$.`,
                  ask: {
                    type: 'interval',
                    prompt: String.raw`Dove è positiva $\frac{x-1}{x+2}$?`,
                    answer: '(-inf,-2)U(1,inf)',
                    explain: String.raw`Tabella dei segni: per $x<-2$ entrambi negativi ($+$), per $-2<x<1$ segni opposti ($-$), per $x>1$ entrambi positivi ($+$). Gli estremi sono esclusi: in $1$ vale $0$, in $-2$ non esiste.`,
                  },
                },
              ],
              result: String.raw`$\text{dom} f = (-\infty, -2) \cup (1, +\infty)$.`,
            },
            {
              id: 's03.base.L2.e1', type: 'interval', level: 1,
              prompt: String.raw`Dominio di $f(x) = \dfrac{1}{x^2 - 4}$.`,
              answer: '(-inf,-2)U(-2,2)U(2,inf)',
              explain: String.raw`$x^2 - 4 \ne 0 \iff x \ne \pm 2$. Si tolgono **due** punti: dimenticare $-2$ è l'errore più comune.`,
            },
            {
              id: 's03.base.L2.e2', type: 'interval', level: 1,
              prompt: String.raw`Dominio di $f(x) = \sqrt{x^2 - 5x + 6}$.`,
              answer: '(-inf,2]U[3,inf)',
              explain: String.raw`$x^2 - 5x + 6 = (x-2)(x-3) \ge 0$: parabola con concavità verso l'alto, positiva **fuori** dalle radici. Gli estremi $2$ e $3$ sono inclusi (radicando $= 0$ va bene).`,
            },
            {
              id: 's03.base.L2.e3', type: 'interval', level: 1,
              prompt: String.raw`Dominio di $f(x) = \log(4 - x^2)$.`,
              answer: '(-2,2)',
              explain: String.raw`$4 - x^2 > 0 \iff x^2 < 4 \iff -2 < x < 2$. Estremi esclusi: $\log 0$ non esiste.`,
            },
            {
              id: 's03.base.L2.e4', type: 'mcq', level: 2,
              prompt: String.raw`Qual è il dominio di $f(x) = \sqrt{x}\cdot\sqrt{x-2}$?`,
              options: [String.raw`$[2, +\infty)$`, String.raw`$(-\infty, 0] \cup [2, +\infty)$`, String.raw`$[0, +\infty)$`, String.raw`$(2, +\infty)$`],
              answer: 0,
              explain: String.raw`Ogni radice deve esistere **da sola**: $x \ge 0$ e $x \ge 2$, quindi $x \ge 2$. La risposta $(-\infty,0]\cup[2,+\infty)$ è il dominio di $\sqrt{x(x-2)}$: lì basta che il **prodotto** sia $\ge 0$, e per $x \le 0$ lo è. Le due funzioni hanno domini diversi!`,
            },
            {
              id: 's03.base.L2.e5', type: 'interval', level: 2,
              prompt: String.raw`Dominio di $f(x) = \sqrt{\log x}$.`,
              answer: '[1,inf)',
              explain: String.raw`Due condizioni: $x > 0$ (logaritmo) e $\log x \ge 0 \iff x \ge 1$ (radice). Il sistema dà $x \ge 1$.`,
            },
            {
              id: 's03.base.L2.e6', type: 'interval', level: 2,
              prompt: String.raw`Dominio di $f(x) = \dfrac{1}{\log x}$.`,
              answer: '(0,1)U(1,inf)',
              explain: String.raw`$x > 0$ per il logaritmo e $\log x \ne 0 \iff x \ne 1$ per il denominatore.`,
            },
            {
              id: 's03.base.L2.e7', type: 'interval', level: 2,
              prompt: String.raw`Dominio di $f(x) = \arcsin(2x - 1)$.`,
              answer: '[0,1]',
              explain: String.raw`$-1 \le 2x - 1 \le 1 \iff 0 \le 2x \le 2 \iff 0 \le x \le 1$. Estremi inclusi: $\arcsin(\pm 1)$ esiste.`,
            },
            {
              id: 's03.base.L2.e8', type: 'interval', level: 2,
              prompt: String.raw`Dominio di $f(x) = (x - 1)^{x}$ (esponente variabile).`,
              answer: '(1,inf)',
              explain: String.raw`Con l'esponente variabile si scrive $(x-1)^x = e^{x\log(x-1)}$: serve la base **strettamente** positiva, $x - 1 > 0$.`,
            },
            {
              id: 's03.base.L2.e9', type: 'interval', level: 3, source: 'Appello 11/06/2026 · Parte B',
              prompt: String.raw`Dominio di $f(x) = e^{\frac{1}{4 - x^2}}$.`,
              answer: '(-inf,-2)U(-2,2)U(2,inf)',
              explain: String.raw`L'esponenziale è sempre definito: l'unica condizione viene dalla frazione all'esponente, $4 - x^2 \ne 0 \iff x \ne \pm 2$.`,
            },
            {
              id: 's03.base.L2.e10', type: 'interval', level: 3, source: 'Appello 15/01/2026 · Parte B',
              prompt: String.raw`Dominio di $f(x) = \begin{cases} x\log x & x < 1 \\[2pt] \dfrac{x-1}{2x-3} & x \ge 1 \end{cases}$`,
              answer: '(0,3/2)U(3/2,inf)',
              explain: String.raw`Con le funzioni a tratti si studia **ogni tratto nel suo intervallo**. Per $x < 1$: serve $x > 0$, quindi $(0, 1)$. Per $x \ge 1$: serve $2x - 3 \ne 0$, cioè $x \ne \frac32$, quindi $[1, \frac32) \cup (\frac32, +\infty)$. Unendo: $(0, \frac32) \cup (\frac32, +\infty)$.`,
              plot: { fns: [{ f: 'x<1 ? x*log(x) : (x-1)/(2x-3)', label: 'f' }], x: [-0.5, 4], y: [-2, 3], vlines: [1.5], hlines: [0.5] },
            },
          ],
        },
        {
          id: 's03.base.L3',
          title: 'Immagine e operazioni tra funzioni',
          cards: [
            {
              type: 'learn',
              title: 'Come si trova l\'immagine',
              body: String.raw`$y_0$ sta nell'immagine di $f$ se l'equazione $f(x) = y_0$ ha **almeno una soluzione** nel dominio.

Due strade:
1. **Grafici noti**: $e^x$ ha immagine $(0,+\infty)$, quindi $e^x + 1$ ha immagine $(1, +\infty)$; $\sin x$ ha immagine $[-1,1]$.
2. **Risolvere in $x$**: $y = f(x) \Rightarrow x = \dots$ e vedere per quali $y$ la soluzione esiste.

>! Con un dominio ristretto l'immagine cambia: $x^2$ su $[-1,2]$ ha immagine $[0,4]$, non $[1,4]$.`,
            },
            {
              type: 'example',
              title: 'Immagine risolvendo in x',
              problem: String.raw`Trova l'immagine di $f(x) = \dfrac{x+1}{x-1}$.`,
              steps: [
                String.raw`Pongo $y = \frac{x+1}{x-1}$ con $x \ne 1$: $y(x - 1) = x + 1 \Rightarrow x(y - 1) = y + 1$.`,
                {
                  text: String.raw`Se $y \ne 1$: $x = \frac{y+1}{y-1}$, che è $\ne 1$ (altrimenti $y + 1 = y - 1$, assurdo). Se $y = 1$: $0 = 2$, impossibile.`,
                  ask: {
                    type: 'interval',
                    prompt: String.raw`Quindi l'immagine di $f$ è…`,
                    answer: '(-inf,1)U(1,inf)',
                    explain: String.raw`Ogni $y \ne 1$ è raggiunto, $y = 1$ no: è l'asintoto orizzontale.`,
                  },
                },
              ],
              result: String.raw`$f(\R\setminus\{1\}) = \R \setminus \{1\}$.`,
              plot: { fns: ['(x+1)/(x-1)'], x: [-4, 6], y: [-5, 7], vlines: [1], hlines: [1] },
            },
            {
              id: 's03.base.L3.e1', type: 'interval', level: 1,
              prompt: String.raw`Immagine di $f(x) = x^2$ ristretta all'intervallo $[-1, 2]$.`,
              answer: '[0,4]',
              explain: String.raw`Su $[-1, 0]$ i valori vanno da $1$ a $0$, su $[0, 2]$ da $0$ a $4$. Il minimo è $0$ (in $x=0$), il massimo $4$. Errore tipico: calcolare solo $f(-1) = 1$ e $f(2) = 4$ e dire $[1,4]$, dimenticando il vertice.`,
              plot: { fns: ['x^2'], x: [-1, 2], y: [-0.5, 4.5], points: [[0, 0, 'min'], [2, 4, 'max']] },
            },
            {
              id: 's03.base.L3.e2', type: 'interval', level: 1,
              prompt: String.raw`Immagine di $f(x) = 3 + 2\sin x$.`,
              answer: '[1,5]',
              explain: String.raw`$-1 \le \sin x \le 1 \Rightarrow -2 \le 2\sin x \le 2 \Rightarrow 1 \le 3 + 2\sin x \le 5$. Gli estremi sono raggiunti (in $x = -\frac\pi2$ e $x = \frac\pi2$).`,
            },
            {
              id: 's03.base.L3.e3', type: 'interval', level: 2,
              prompt: String.raw`Immagine di $f(x) = \sqrt{4 - x^2}$.`,
              answer: '[0,2]',
              explain: String.raw`Dominio $[-2,2]$. Il radicando $4 - x^2$ varia tra $0$ (in $\pm 2$) e $4$ (in $0$), quindi la radice tra $0$ e $2$. Il grafico è la semicirconferenza superiore di raggio $2$.`,
              plot: { fns: ['sqrt(4-x^2)'], x: [-3, 3], y: [-0.5, 3] },
            },
            {
              id: 's03.base.L3.e4', type: 'interval', level: 2,
              prompt: String.raw`Immagine di $f(x) = e^{-x} - 3$.`,
              answer: '(-3,inf)',
              explain: String.raw`$e^{-x}$ assume tutti i valori di $(0, +\infty)$; sottraendo $3$ si ottiene $(-3, +\infty)$. $-3$ è escluso: $e^{-x}$ non vale mai $0$ (è l'asintoto orizzontale per $x\to+\infty$).`,
            },
            {
              type: 'learn',
              title: 'Operazioni tra funzioni',
              body: String.raw`Date $f$ e $g$, si definiscono $(f \pm g)(x) = f(x) \pm g(x)$, $(fg)(x) = f(x)g(x)$, $\left(\frac fg\right)(x) = \frac{f(x)}{g(x)}$.

- dominio di $f \pm g$ e di $fg$: $\text{dom} f \cap \text{dom} g$;
- dominio di $\frac fg$: $\text{dom} f \cap \text{dom} g$ **meno gli zeri di $g$**.`,
            },
            {
              id: 's03.base.L3.e5', type: 'interval', level: 2,
              prompt: String.raw`Siano $f(x) = \sqrt{x}$ e $g(x) = x - 3$. Dominio di $\dfrac{f}{g}$.`,
              answer: '[0,3)U(3,inf)',
              explain: String.raw`$\text{dom} f = [0, +\infty)$, $\text{dom} g = \R$, intersezione $[0, +\infty)$; tolgo lo zero di $g$, cioè $x = 3$.`,
            },
            {
              id: 's03.base.L3.e6', type: 'interval', level: 2,
              prompt: String.raw`Siano $f(x) = \log(x + 1)$ e $g(x) = \sqrt{2 - x}$. Dominio di $f + g$.`,
              answer: '(-1,2]',
              explain: String.raw`$\text{dom} f = (-1, +\infty)$, $\text{dom} g = (-\infty, 2]$. L'intersezione è $(-1, 2]$.`,
            },
            {
              id: 's03.base.L3.e7', type: 'tf', level: 2,
              prompt: String.raw`Se $f$ e $g$ sono definite su tutto $\R$, anche $\frac{f}{g}$ è definita su tutto $\R$.`,
              answer: false,
              explain: String.raw`Bisogna togliere gli zeri di $g$. Controesempio: $f(x) = 1$, $g(x) = x$: il quoziente $\frac1x$ non è definito in $0$.`,
            },
            {
              id: 's03.base.L3.p1', type: 'problem', level: 3, source: 'Itinere 11/11/2025 · Parte B',
              prompt: String.raw`Sia $f(x) = \dfrac{\sqrt{x-1}}{\sqrt{5-x}}$. Rispondi alle domande.`,
              parts: [
                { type: 'interval', prompt: String.raw`Dominio di $f$.`, answer: '[1,5)', explain: String.raw`$x - 1 \ge 0$ e $5 - x > 0$.` },
                { type: 'num', prompt: String.raw`Valore di $f(1)$.`, answer: '0', explain: String.raw`$f(1) = \frac{0}{2} = 0$.` },
                { type: 'num', prompt: String.raw`Valore di $f(3)$.`, answer: '1', explain: String.raw`$f(3) = \frac{\sqrt2}{\sqrt2} = 1$.` },
                {
                  type: 'mcq', prompt: String.raw`$f$ è limitata superiormente?`,
                  options: ['No: per $x \\to 5^-$ tende a $+\\infty$', 'Sì, perché il dominio è limitato', 'Sì, il massimo è $f(1)$'],
                  answer: 0,
                  explain: String.raw`Per $x \to 5^-$ il numeratore tende a $2$ e il denominatore a $0^+$: $f \to +\infty$. Un dominio limitato **non** garantisce una funzione limitata.`,
                },
                { type: 'interval', prompt: String.raw`Immagine di $f$.`, answer: '[0,inf)', explain: String.raw`$f$ è strettamente crescente (numeratore crescente, denominatore positivo decrescente), parte da $0$ e tende a $+\infty$: assume tutti i valori $\ge 0$.` },
              ],
              solution: String.raw`**Dominio**: $x - 1 \ge 0$ e $5 - x > 0$, quindi $[1, 5)$.

**Segno**: $f(x) \ge 0$ ovunque e $f(1) = 0$: quindi $0$ è il **minimo assoluto**, assunto in $x = 1$.

**Monotonia**: se $1 \le x_1 < x_2 < 5$, il numeratore cresce e il denominatore (positivo) decresce, quindi $f(x_1) < f(x_2)$: $f$ è strettamente crescente.

**Comportamento in $5^-$**: $\sqrt{x-1} \to 2$, $\sqrt{5-x} \to 0^+$, quindi $f \to +\infty$: $f$ **non è limitata superiormente** (anche se il dominio è limitato).

**Immagine**: $[0, +\infty)$.`,
              plot: { fns: ['sqrt(x-1)/sqrt(5-x)'], x: [0, 6], y: [-1, 6], vlines: [5], points: [[1, 0, 'min']] },
            },
          ],
        },
      ],
      practice: [
        {
          id: 's03.base.gen-dom-fratta', type: 'gen', level: 1,
          gen: (R) => {
            const [a, b] = two(R, -5, 6);
            return {
              type: 'interval',
              prompt: String.raw`Dominio di $f(x) = \dfrac{1}{${H.poly([1, -(a + b), a * b])}}$.`,
              answer: `(-inf,${a})U(${a},${b})U(${b},inf)`,
              explain: String.raw`Il denominatore si annulla per $x = ${a}$ e $x = ${b}$ (somma $${a + b}$, prodotto $${a * b}$): $${H.poly([1, -(a + b), a * b])} = ${pf(a)}${pf(b)}$. Si tolgono questi due punti.`,
            };
          },
        },
        {
          id: 's03.base.gen-dom-radice', type: 'gen', level: 2,
          gen: (R) => {
            const [a, b] = two(R, -5, 6);
            const inside = R.chance(0.5);
            const p = inside ? H.poly([-1, a + b, -a * b]) : H.poly([1, -(a + b), a * b]);
            return {
              type: 'interval',
              prompt: String.raw`Dominio di $f(x) = \sqrt{${p}}$.`,
              answer: inside ? `[${a},${b}]` : `(-inf,${a}]U[${b},inf)`,
              explain: inside
                ? String.raw`$${p} = -${pf(a)}${pf(b)} \ge 0 \iff ${pf(a)}${pf(b)} \le 0$: valori **interni** alle radici, estremi inclusi. Risultato $[${a}, ${b}]$.`
                : String.raw`$${p} = ${pf(a)}${pf(b)} \ge 0$: parabola verso l'alto, valori **esterni** alle radici, estremi inclusi.`,
            };
          },
        },
        {
          id: 's03.base.gen-dom-log', type: 'gen', level: 2,
          gen: (R) => {
            const [a, b] = two(R, -6, 6);
            return {
              type: 'interval',
              prompt: String.raw`Dominio di $f(x) = \log\dfrac{${xm(a)}}{${b} - x}$.`.replace(/\{0 - x\}/, '{-x}'),
              answer: `(${a},${b})`,
              explain: String.raw`Serve $\frac{${xm(a)}}{${b} - x} > 0$. Il numeratore è positivo per $x > ${a}$, il denominatore per $x < ${b}$. Stesso segno (entrambi positivi) per $${a} < x < ${b}$; fuori dall'intervallo hanno segni opposti. Estremi esclusi.`.replace(/\{0 - x\}/g, '{-x}'),
            };
          },
        },
        {
          id: 's03.base.gen-dom-quoziente-radici', type: 'gen', level: 2,
          gen: (R) => {
            const [a, b] = two(R, -4, 8);
            const num = a === 0 ? 'x' : `x ${a > 0 ? '-' : '+'} ${Math.abs(a)}`;
            const den = b === 0 ? '-x' : `${b} - x`;
            return {
              type: 'interval',
              prompt: String.raw`Dominio di $f(x) = \dfrac{\sqrt{${num}}}{\sqrt{${den}}}$.`,
              answer: `[${a},${b})`,
              explain: String.raw`Numeratore: $${num} \ge 0 \iff x \ge ${a}$ (estremo incluso). Denominatore: radice **al denominatore**, serve $${den} > 0 \iff x < ${b}$ (estremo escluso).`,
            };
          },
        },
        {
          id: 's03.base.gen-imm-seno', type: 'gen', level: 1,
          gen: (R) => {
            const c = R.int(-4, 5);
            const k = R.nz(-4, 4);
            const trig = R.pick(['\\sin x', '\\cos x', '\\sin(2x)', '\\cos(3x)']);
            const lo = c - Math.abs(k);
            const hi = c + Math.abs(k);
            const f = c === 0 ? `${H.coef(k)}${trig}` : `${c} ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${trig}`;
            return {
              type: 'interval',
              prompt: String.raw`Immagine di $f(x) = ${f}$.`,
              answer: `[${lo},${hi}]`,
              explain: String.raw`La funzione trigonometrica varia in $[-1, 1]$; moltiplicata per $${k}$ varia in $[-${Math.abs(k)}, ${Math.abs(k)}]$ (se il coefficiente è negativo gli estremi si scambiano, l'intervallo è lo stesso). Aggiungendo $${c}$: $[${lo}, ${hi}]$.`,
            };
          },
        },
        {
          id: 's03.base.P1', type: 'interval', level: 2,
          prompt: String.raw`Dominio di $f(x) = \log(x^2 - 1)$.`,
          answer: '(-inf,-1)U(1,inf)',
          explain: String.raw`$x^2 - 1 > 0 \iff |x| > 1$. Estremi esclusi.`,
        },
        {
          id: 's03.base.P2', type: 'interval', level: 2,
          prompt: String.raw`Dominio di $f(x) = \sqrt{\dfrac{x+3}{x-1}}$.`,
          answer: '(-inf,-3]U(1,inf)',
          explain: String.raw`$\frac{x+3}{x-1} \ge 0$: segno positivo per $x < -3$ o $x > 1$; vale $0$ in $x = -3$ (incluso); in $x = 1$ il denominatore si annulla (escluso).`,
        },
        {
          id: 's03.base.P3', type: 'interval', level: 2,
          prompt: String.raw`Dominio di $f(x) = \dfrac{1}{e^x - 1}$.`,
          answer: '(-inf,0)U(0,inf)',
          explain: String.raw`$e^x - 1 = 0 \iff e^x = 1 \iff x = 0$.`,
        },
        {
          id: 's03.base.P4', type: 'interval', level: 2,
          prompt: String.raw`Dominio di $f(x) = \sqrt{9 - x^2} + \log x$.`,
          answer: '(0,3]',
          explain: String.raw`$9 - x^2 \ge 0 \iff -3 \le x \le 3$; $x > 0$ per il logaritmo. Intersezione: $(0, 3]$.`,
        },
        {
          id: 's03.base.P5', type: 'interval', level: 3, source: 'Appello 10/02/2026 · Parte B',
          prompt: String.raw`Dominio di $f(x) = (x^2 - 3)e^{-|2-x|}$.`,
          answer: 'R',
          explain: String.raw`Polinomio, valore assoluto ed esponenziale sono definiti per ogni $x$: il dominio è $\R$. Non serve "cercare condizioni" che non ci sono.`,
        },
        {
          id: 's03.base.P6', type: 'interval', level: 2,
          prompt: String.raw`Dominio di $f(x) = \arccos\dfrac{x}{2}$.`,
          answer: '[-2,2]',
          explain: String.raw`$-1 \le \frac x2 \le 1 \iff -2 \le x \le 2$.`,
        },
        {
          id: 's03.base.P7', type: 'mcq', level: 2,
          prompt: String.raw`Dominio di $f(x) = \sqrt[3]{x - 4}$.`,
          options: [String.raw`$\R$`, String.raw`$[4, +\infty)$`, String.raw`$(4, +\infty)$`, String.raw`$\R \setminus \{4\}$`],
          answer: 0,
          explain: String.raw`La radice **cubica** (indice dispari) esiste per ogni numero reale: $\sqrt[3]{-8} = -2$. La condizione radicando $\ge 0$ vale solo per gli indici pari.`,
        },
        {
          id: 's03.base.P8', type: 'interval', level: 3,
          prompt: String.raw`Dominio di $f(x) = \dfrac{\sqrt{x+2}}{\log(3 - x)}$.`,
          answer: '[-2,2)U(2,3)',
          explain: String.raw`$x + 2 \ge 0 \iff x \ge -2$; $3 - x > 0 \iff x < 3$; $\log(3-x) \ne 0 \iff 3 - x \ne 1 \iff x \ne 2$. Risultato $[-2, 2) \cup (2, 3)$.`,
        },
      ],
      flashcards: [
        { id: 's03.base.fc1', kind: 'def', front: 'Definizione di funzione', back: String.raw`Una funzione $f: A \to B$ associa a **ogni** elemento $x \in A$ **uno e un solo** elemento $f(x) \in B$. $A$ è il dominio, $B$ il codominio.` },
        { id: 's03.base.fc2', kind: 'def', front: 'Immagine di una funzione', back: String.raw`$f(A) = \{f(x) : x \in A\}$: i valori effettivamente assunti. $y_0 \in f(A)$ se e solo se $f(x) = y_0$ ha almeno una soluzione in $A$.` },
        { id: 's03.base.fc3', kind: 'def', front: 'Grafico di una funzione', back: String.raw`$G_f = \{(x, f(x)) : x \in A\} \subseteq \R^2$. Ogni retta verticale lo incontra al più una volta.` },
        { id: 's03.base.fc4', kind: 'metodo', front: 'Condizioni di esistenza (campo di esistenza)', back: String.raw`Denominatore $\ne 0$; radice pari: radicando $\ge 0$ ($> 0$ se al denominatore); $\log A$: $A > 0$; $A^B$ con $B$ variabile: $A > 0$; $\tan A$: $A \ne \frac\pi2 + k\pi$; $\arcsin A, \arccos A$: $-1 \le A \le 1$. Tutte a sistema.` },
        { id: 's03.base.fc5', kind: 'formula', front: 'Dominio di somma, prodotto, quoziente', back: String.raw`$\text{dom}(f \pm g) = \text{dom}(fg) = \text{dom} f \cap \text{dom} g$; $\text{dom}\frac fg = \text{dom} f \cap \text{dom} g \setminus \{x : g(x) = 0\}$.` },
        { id: 's03.base.fc6', kind: 'errore', front: String.raw`$\sqrt{x}\sqrt{x-2}$ e $\sqrt{x(x-2)}$ hanno lo stesso dominio?`, back: String.raw`No. $\sqrt x\sqrt{x-2}$: $[2, +\infty)$. $\sqrt{x(x-2)}$: $(-\infty, 0] \cup [2, +\infty)$. Le proprietà delle radici valgono solo dove tutto esiste.` },
        { id: 's03.base.fc7', kind: 'metodo', front: 'Come trovare l\'immagine', back: String.raw`Risolvi $y = f(x)$ rispetto a $x$ e vedi per quali $y$ c'è una soluzione nel dominio; oppure parti dai grafici elementari ($e^x$: $(0,+\infty)$; $\sin x$: $[-1,1]$; $x^2$: $[0,+\infty)$) e applica le trasformazioni.` },
      ],
    },
    // =====================================================================
    {
      id: 's03.proprieta',
      title: 'Iniettive, suriettive, composte, inverse',
      summary: String.raw`Saprai riconoscere funzioni iniettive, suriettive e biiettive, comporre funzioni e calcolare l'inversa.`,
      prereq: ['s03.base', 's00.logica', 's00.esplog'],
      examRefs: ['Itinere 11/11/2025 · Parte A', 'Appello 03/09/2026 · Parte A'],
      lessons: [
        {
          id: 's03.proprieta.L1',
          title: 'Iniettive, suriettive, biiettive',
          cards: [
            {
              type: 'learn',
              title: 'Tre proprietà',
              body: String.raw`Sia $f: A \to B$.

- **Iniettiva**: input diversi danno output diversi. $x_1 \ne x_2 \Rightarrow f(x_1) \ne f(x_2)$, o equivalentemente $f(x_1) = f(x_2) \Rightarrow x_1 = x_2$.
- **Suriettiva**: ogni $y \in B$ è raggiunto, cioè $f(A) = B$.
- **Biiettiva**: iniettiva e suriettiva. Ogni $y \in B$ è raggiunto da **esattamente un** $x$.

Test delle rette orizzontali: $f$ è iniettiva se ogni retta $y = b$ incontra il grafico **al più** una volta; suriettiva se ogni $y = b$ con $b \in B$ lo incontra **almeno** una volta.

Nel grafico: $x^3$ è iniettiva, $x^2$ no (la retta $y = 1$ la incontra in $\pm 1$).`,
              plot: { fns: [{ f: 'x^3', label: 'x^3' }, { f: 'x^2', label: 'x^2' }], x: [-2, 2], y: [-3, 4], hlines: [1] },
            },
            {
              id: 's03.proprieta.L1.e1', type: 'tf', level: 1,
              prompt: String.raw`$f: \R \to \R$, $f(x) = x^2$ è iniettiva.`,
              answer: false,
              explain: String.raw`$f(-1) = f(1) = 1$ con $-1 \ne 1$: due input diversi, stesso output. Per smentire l'iniettività basta **un** controesempio.`,
            },
            {
              id: 's03.proprieta.L1.e2', type: 'mcq', level: 1,
              prompt: String.raw`La funzione $f: \R \to \R$, $f(x) = e^x$ è…`,
              options: ['iniettiva ma non suriettiva', 'suriettiva ma non iniettiva', 'biiettiva', 'né iniettiva né suriettiva'],
              answer: 0,
              explain: String.raw`$e^x$ è strettamente crescente, quindi iniettiva. La sua immagine è $(0, +\infty) \ne \R$: i valori $\le 0$ non sono mai raggiunti, quindi non è suriettiva su $\R$. Diventa biiettiva se si sceglie come codominio $(0, +\infty)$.`,
            },
            {
              id: 's03.proprieta.L1.e3', type: 'mcq', level: 2,
              prompt: String.raw`Quale scelta rende $f(x) = x^2$ **biiettiva**?`,
              options: [
                String.raw`$f: [0, +\infty) \to [0, +\infty)$`,
                String.raw`$f: \R \to [0, +\infty)$`,
                String.raw`$f: [0, +\infty) \to \R$`,
                String.raw`$f: [-1, +\infty) \to [0, +\infty)$`,
              ],
              answer: 0,
              explain: String.raw`Su $[0,+\infty)$ la funzione è strettamente crescente (iniettiva) e raggiunge ogni $y \ge 0$ (con $x = \sqrt y$). Con dominio $\R$ o $[-1, +\infty)$ non è iniettiva ($f(-1) = f(1)$); con codominio $\R$ non è suriettiva (i negativi mancano).`,
            },
            {
              type: 'example',
              title: 'Dimostrare l\'iniettività',
              problem: String.raw`Mostra che $f: \R \to \R$, $f(x) = 3x - 2$ è biiettiva.`,
              steps: [
                String.raw`**Iniettiva**: suppongo $f(x_1) = f(x_2)$, cioè $3x_1 - 2 = 3x_2 - 2$. Allora $3x_1 = 3x_2$ e $x_1 = x_2$.`,
                String.raw`**Suriettiva**: dato $y \in \R$ cerco $x$ con $3x - 2 = y$: $x = \frac{y+2}{3}$, che è un numero reale.`,
                {
                  text: String.raw`Per esempio $y = 7$ è raggiunto da $x = \frac{7+2}{3} = 3$.`,
                  ask: { type: 'num', prompt: String.raw`Quale $x$ ha $f(x) = 7$?`, answer: '3', explain: String.raw`$3x - 2 = 7 \Rightarrow x = 3$.` },
                },
              ],
              result: String.raw`$f$ è biiettiva: ogni $y$ ha esattamente una controimmagine $x = \frac{y+2}{3}$.`,
            },
            {
              id: 's03.proprieta.L1.e4', type: 'num', level: 2,
              prompt: String.raw`Sia $f(x) = x^2 - 4x$. Trova $a \ne 1$ tale che $f(a) = f(1)$ (questo mostra che $f$ non è iniettiva).`,
              answer: '3',
              explain: String.raw`$f(1) = -3$. Risolvo $x^2 - 4x = -3 \iff x^2 - 4x + 3 = 0 \iff (x-1)(x-3) = 0$. L'altra soluzione è $a = 3$: simmetrica di $1$ rispetto al vertice $x = 2$.`,
            },
            {
              id: 's03.proprieta.L1.e5', type: 'mcq', level: 2,
              prompt: String.raw`Su quale intervallo $f(x) = x^2 - 4x$ è iniettiva?`,
              options: [String.raw`$[2, +\infty)$`, String.raw`$[0, +\infty)$`, String.raw`$[1, 5]$`, String.raw`$\R$`],
              answer: 0,
              explain: String.raw`La parabola ha vertice in $x = 2$: a destra del vertice è strettamente crescente, quindi iniettiva. Gli altri intervalli contengono punti simmetrici rispetto a $x = 2$ (es. $1$ e $3$), dove $f$ assume lo stesso valore.`,
              plot: { fns: ['x^2-4x'], x: [-1, 5], y: [-5, 5], points: [[1, -3, ''], [3, -3, '']], hlines: [-3] },
            },
            {
              id: 's03.proprieta.L1.e6', type: 'match', level: 2,
              prompt: String.raw`Abbina ogni funzione $\R \to \R$ alla sua proprietà.`,
              pairs: [
                [String.raw`$x^3$`, 'biiettiva'],
                [String.raw`$x^2$`, 'né iniettiva né suriettiva'],
                [String.raw`$e^x$`, 'iniettiva, non suriettiva'],
                [String.raw`$x^3 - x$`, 'suriettiva, non iniettiva'],
              ],
              explain: String.raw`$x^3$: strettamente crescente con immagine $\R$. $x^2$: $f(-1)=f(1)$ e i negativi mancano. $e^x$: crescente, immagine $(0,+\infty)$. $x^3 - x$: si annulla in $-1, 0, 1$ (non iniettiva) ma, essendo continua e andando da $-\infty$ a $+\infty$, assume ogni valore reale.`,
            },
            {
              id: 's03.proprieta.L1.e7', type: 'tf', level: 1,
              prompt: String.raw`$\sin: \R \to [-1, 1]$ è suriettiva.`,
              answer: true,
              explain: String.raw`Ogni $y \in [-1,1]$ è il seno di qualche angolo. Non è però iniettiva: $\sin 0 = \sin \pi = 0$.`,
            },
            {
              id: 's03.proprieta.L1.e8', type: 'tf', level: 2,
              prompt: String.raw`Una funzione strettamente crescente è iniettiva.`,
              answer: true,
              explain: String.raw`Se $x_1 \ne x_2$, per esempio $x_1 < x_2$, allora $f(x_1) < f(x_2)$, quindi $f(x_1) \ne f(x_2)$. Il viceversa è falso: $\frac1x$ è iniettiva su $\R \setminus\{0\}$ ma non è monotona.`,
            },
          ],
        },
        {
          id: 's03.proprieta.L2',
          title: 'Funzioni composte',
          cards: [
            {
              type: 'learn',
              title: 'Prima f, poi g',
              body: String.raw`La **composta** $g \circ f$ si legge "$g$ composto $f$" ed è
$$(g \circ f)(x) = g(f(x)):$$
prima si applica $f$, poi $g$ al risultato.

Esempio: $f(x) = x^2$, $g(x) = x + 1$. Allora $(g\circ f)(x) = x^2 + 1$, mentre $(f \circ g)(x) = (x+1)^2$. In generale $g \circ f \ne f \circ g$.

**Dominio** di $g \circ f$: gli $x \in \text{dom} f$ tali che $f(x) \in \text{dom}\, g$.`,
            },
            {
              id: 's03.proprieta.L2.e1', type: 'expr', level: 1, vars: ['x'],
              prompt: String.raw`$f(x) = x^2$, $g(x) = x + 1$. Scrivi $(f \circ g)(x)$.`,
              answer: '(x+1)^2',
              explain: String.raw`$(f\circ g)(x) = f(g(x)) = f(x+1) = (x+1)^2$. Attenzione all'ordine: si applica **prima** la funzione a destra del simbolo $\circ$.`,
            },
            {
              id: 's03.proprieta.L2.e2', type: 'mcq', level: 1,
              prompt: String.raw`$f(x) = \sqrt{x}$, $g(x) = x - 4$. Quanto vale $(f \circ g)(x)$?`,
              options: [String.raw`$\sqrt{x - 4}$`, String.raw`$\sqrt{x} - 4$`, String.raw`$\sqrt{x}\,(x - 4)$`, String.raw`$x - 4$`],
              answer: 0,
              explain: String.raw`$f(g(x)) = \sqrt{g(x)} = \sqrt{x - 4}$. $\sqrt{x} - 4$ è $g \circ f$ (ordine scambiato). Il prodotto $\sqrt x\,(x-4)$ non è una composizione.`,
            },
            {
              type: 'example',
              title: 'Dominio di una composta',
              problem: String.raw`$f(x) = \log x$, $g(x) = \sqrt{x}$. Trova il dominio di $g \circ f$.`,
              steps: [
                String.raw`$(g\circ f)(x) = \sqrt{\log x}$.`,
                String.raw`Serve $x \in \text{dom} f$: $x > 0$.`,
                {
                  text: String.raw`Serve $f(x) \in \text{dom}\, g$: $\log x \ge 0 \iff x \ge 1$.`,
                  ask: { type: 'interval', prompt: String.raw`Dominio di $g \circ f$:`, answer: '[1,inf)', explain: String.raw`Sistema di $x > 0$ e $x \ge 1$: $[1, +\infty)$.` },
                },
              ],
              result: String.raw`$\text{dom}(g\circ f) = [1, +\infty)$.`,
            },
            {
              id: 's03.proprieta.L2.e3', type: 'interval', level: 2,
              prompt: String.raw`$f(x) = x^2 - 1$, $g(x) = \log x$. Dominio di $g \circ f$.`,
              answer: '(-inf,-1)U(1,inf)',
              explain: String.raw`$(g\circ f)(x) = \log(x^2 - 1)$: serve $x^2 - 1 > 0 \iff x < -1$ o $x > 1$.`,
            },
            {
              id: 's03.proprieta.L2.e4', type: 'expr', level: 1, vars: ['x'],
              prompt: String.raw`$f(x) = 2x - 3$. Scrivi $(f \circ f)(x)$.`,
              answer: '4x-9',
              explain: String.raw`$f(f(x)) = 2(2x - 3) - 3 = 4x - 9$. Errore tipico: $(f(x))^2$, che è il quadrato, non la composta.`,
            },
            {
              id: 's03.proprieta.L2.e5', type: 'num', level: 1,
              prompt: String.raw`$f(x) = x^2 + 1$, $g(x) = \dfrac{1}{x}$. Calcola $(g \circ f)(2)$.`,
              answer: '1/5',
              explain: String.raw`Prima $f(2) = 5$, poi $g(5) = \frac15$. (Nell'altro ordine: $(f\circ g)(2) = f(\frac12) = \frac54$.)`,
            },
            {
              id: 's03.proprieta.L2.e6', type: 'mcq', level: 2,
              prompt: String.raw`Scrivi $h(x) = \sin^2(3x)$ come $h = f \circ g \circ k$. Quale scelta è corretta?`,
              options: [
                String.raw`$k(x) = 3x$, $g(t) = \sin t$, $f(t) = t^2$`,
                String.raw`$k(x) = 3x$, $g(t) = t^2$, $f(t) = \sin t$`,
                String.raw`$k(x) = \sin x$, $g(t) = 3t$, $f(t) = t^2$`,
                String.raw`$k(x) = x^2$, $g(t) = \sin t$, $f(t) = 3t$`,
              ],
              answer: 0,
              explain: String.raw`Leggi $h$ "dall'interno": prima $3x$, poi il seno, poi il quadrato. $f(g(k(x))) = (\sin 3x)^2$. La seconda scelta dà $\sin(9x^2)$, la terza $(3\sin x)^2$, la quarta $3\sin(x^2)$.`,
            },
            {
              id: 's03.proprieta.L2.e7', type: 'tf', level: 2,
              prompt: String.raw`La composta di due funzioni iniettive è iniettiva.`,
              answer: true,
              explain: String.raw`Se $g(f(x_1)) = g(f(x_2))$, per l'iniettività di $g$ si ha $f(x_1) = f(x_2)$, e per quella di $f$ si ha $x_1 = x_2$.`,
            },
            {
              id: 's03.proprieta.L2.e8', type: 'expr', level: 3, vars: ['x'],
              prompt: String.raw`Sia $f(x) = \dfrac{x-1}{x+1}$. Calcola e semplifica $(f \circ f)(x)$.`,
              answer: '-1/x',
              explain: String.raw`$f(f(x)) = \dfrac{\frac{x-1}{x+1} - 1}{\frac{x-1}{x+1} + 1} = \dfrac{\frac{x - 1 - x - 1}{x+1}}{\frac{x - 1 + x + 1}{x+1}} = \dfrac{-2}{2x} = -\dfrac1x$, per $x \ne -1$ e $x \ne 0$.`,
            },
            {
              id: 's03.proprieta.L2.e9', type: 'interval', level: 3,
              prompt: String.raw`$f(x) = \dfrac{1}{x}$, $g(x) = \sqrt{1 - x}$. Dominio di $g \circ f$.`,
              answer: '(-inf,0)U[1,inf)',
              explain: String.raw`$(g\circ f)(x) = \sqrt{1 - \frac1x}$. Serve $x \ne 0$ e $1 - \frac1x = \frac{x - 1}{x} \ge 0$: positivo per $x < 0$ o $x > 1$, nullo in $x = 1$ (incluso).`,
            },
          ],
        },
        {
          id: 's03.proprieta.L3',
          title: 'La funzione inversa',
          cards: [
            {
              type: 'learn',
              title: 'Tornare indietro',
              body: String.raw`Se $f: A \to B$ è **biiettiva**, la sua **inversa** $f^{-1}: B \to A$ manda ogni $y$ nell'unico $x$ con $f(x) = y$:
$$f^{-1}(y) = x \iff f(x) = y.$$
Vale $f^{-1}(f(x)) = x$ e $f(f^{-1}(y)) = y$.

Se $f$ è solo iniettiva, la si inverte sulla sua immagine: $\text{dom} f^{-1} = \text{im} f$.

**Metodo**: scrivi $y = f(x)$, risolvi rispetto a $x$, poi rinomina $y \to x$.

Il grafico di $f^{-1}$ è il simmetrico di quello di $f$ rispetto alla bisettrice $y = x$. Coppie da sapere: $e^x \leftrightarrow \log x$, $x^2$ su $[0,+\infty) \leftrightarrow \sqrt x$, $\tan$ su $(-\frac\pi2,\frac\pi2) \leftrightarrow \arctan$.

>! $f^{-1}(x)$ **non** è $\frac{1}{f(x)}$.`,
              plot: { fns: [{ f: 'exp(x)', label: 'e^x' }, { f: 'log(x)', label: 'log x' }, { f: 'x', label: 'y=x' }], x: [-3, 4], y: [-3, 4] },
            },
            {
              type: 'example',
              title: 'Inversa di una funzione razionale',
              problem: String.raw`Trova l'inversa di $f(x) = \dfrac{2x+1}{x-3}$.`,
              steps: [
                String.raw`$y = \frac{2x + 1}{x - 3} \Rightarrow y(x - 3) = 2x + 1 \Rightarrow xy - 2x = 3y + 1$.`,
                String.raw`Raccolgo $x$: $x(y - 2) = 3y + 1 \Rightarrow x = \frac{3y + 1}{y - 2}$, per $y \ne 2$.`,
                {
                  text: String.raw`Rinomino la variabile: $f^{-1}(x) = \frac{3x+1}{x-2}$.`,
                  ask: { type: 'expr', vars: ['x'], prompt: String.raw`Scrivi $f^{-1}(x)$.`, answer: '(3x+1)/(x-2)', explain: String.raw`Basta sostituire $y$ con $x$ nella formula trovata.` },
                },
              ],
              result: String.raw`$f^{-1}(x) = \frac{3x+1}{x-2}$, con dominio $\R\setminus\{2\}$ = immagine di $f$.`,
            },
            {
              id: 's03.proprieta.L3.e1', type: 'expr', level: 1, vars: ['x'],
              prompt: String.raw`Inversa di $f(x) = 3x - 5$. Scrivi $f^{-1}(x)$.`,
              answer: '(x+5)/3',
              explain: String.raw`$y = 3x - 5 \Rightarrow x = \frac{y+5}{3}$. Verifica: $f\!\left(\frac{x+5}{3}\right) = x + 5 - 5 = x$.`,
            },
            {
              id: 's03.proprieta.L3.e2', type: 'expr', level: 2, vars: ['x'], domain: [1.5, 4],
              prompt: String.raw`Inversa di $f(x) = e^{2x} + 1$. Scrivi $f^{-1}(x)$.`,
              answer: 'log(x-1)/2',
              explain: String.raw`$y = e^{2x} + 1 \Rightarrow e^{2x} = y - 1 \Rightarrow 2x = \log(y - 1) \Rightarrow x = \frac{\log(y-1)}{2}$, definita per $y > 1$ (l'immagine di $f$ è $(1,+\infty)$).`,
            },
            {
              id: 's03.proprieta.L3.e3', type: 'expr', level: 1, vars: ['x'],
              prompt: String.raw`Inversa di $f(x) = \log(x - 2)$. Scrivi $f^{-1}(x)$.`,
              answer: 'e^x+2',
              explain: String.raw`$y = \log(x - 2) \Rightarrow x - 2 = e^y \Rightarrow x = e^y + 2$. Dominio dell'inversa: $\R$, che è l'immagine del logaritmo.`,
            },
            {
              id: 's03.proprieta.L3.e4', type: 'mcq', level: 2,
              prompt: String.raw`Sia $f: (-\infty, 0] \to [0, +\infty)$, $f(x) = x^2$. Qual è $f^{-1}(x)$?`,
              options: [String.raw`$-\sqrt{x}$`, String.raw`$\sqrt{x}$`, String.raw`$\pm\sqrt{x}$`, String.raw`$\dfrac{1}{x^2}$`],
              answer: 0,
              explain: String.raw`L'inversa deve restituire valori nel dominio di $f$, cioè numeri $\le 0$: da $y = x^2$ con $x \le 0$ si ottiene $x = -\sqrt y$. $\sqrt x$ è l'inversa della restrizione a $[0, +\infty)$; $\pm\sqrt x$ non è una funzione; $\frac{1}{x^2}$ confonde inversa e reciproco.`,
            },
            {
              id: 's03.proprieta.L3.e5', type: 'tf', level: 1,
              prompt: String.raw`Per ogni funzione invertibile vale $f^{-1}(x) = \dfrac{1}{f(x)}$.`,
              answer: false,
              explain: String.raw`L'esponente $-1$ in $f^{-1}$ indica l'inversa rispetto alla **composizione**, non il reciproco. Esempio: $f(x) = 2x$ ha inversa $\frac x2$, mentre $\frac{1}{f(x)} = \frac{1}{2x}$.`,
            },
            {
              id: 's03.proprieta.L3.e6', type: 'interval', level: 2,
              prompt: String.raw`Sia $f(x) = e^x + 3$. Qual è il dominio di $f^{-1}$?`,
              answer: '(3,inf)',
              explain: String.raw`Il dominio dell'inversa è l'**immagine** di $f$: $e^x$ assume $(0, +\infty)$, quindi $e^x + 3$ assume $(3, +\infty)$. Infatti $f^{-1}(x) = \log(x - 3)$.`,
            },
            {
              id: 's03.proprieta.L3.e7', type: 'mcq', level: 1,
              prompt: String.raw`Il grafico di $f^{-1}$ si ottiene da quello di $f$ con una simmetria rispetto a…`,
              options: [String.raw`la retta $y = x$`, String.raw`l'asse $x$`, String.raw`l'asse $y$`, String.raw`l'origine`],
              answer: 0,
              explain: String.raw`$(a, b)$ sta sul grafico di $f$ se e solo se $(b, a)$ sta su quello di $f^{-1}$: scambiare le coordinate è la simmetria rispetto alla bisettrice $y = x$.`,
            },
            {
              id: 's03.proprieta.L3.e8', type: 'num', level: 2,
              prompt: String.raw`$f(x) = x^3 + x + 1$ è strettamente crescente. Calcola $f^{-1}(3)$.`,
              answer: '1',
              explain: String.raw`Non serve la formula dell'inversa: cerco $x$ con $f(x) = 3$. Provando, $f(1) = 1 + 1 + 1 = 3$. Siccome $f$ è iniettiva, è l'unico: $f^{-1}(3) = 1$.`,
            },
            {
              id: 's03.proprieta.L3.e9', type: 'expr', level: 3, vars: ['x'], source: 'Itinere 11/11/2025 · Parte A',
              prompt: String.raw`Sia $f(x) = \log(x + 1)$, definita su $(-1, +\infty)$. Scrivi l'inversa $f^{-1}(x)$ (serve per derivare $\log(x+1)$ con il teorema della funzione inversa).`,
              answer: 'e^x-1',
              explain: String.raw`$y = \log(x + 1) \iff x + 1 = e^y \iff x = e^y - 1$. Quindi $f^{-1}(x) = e^x - 1$, definita su $\R$. All'esame si usa poi $(f^{-1})'(y) = e^y$ per ottenere $f'(x) = \frac{1}{e^y} = \frac{1}{x + 1}$.`,
            },
            {
              id: 's03.proprieta.L3.e10', type: 'expr', level: 3, vars: ['x'], domain: [2.2, 5],
              prompt: String.raw`Sia $f: [1, +\infty) \to [2, +\infty)$, $f(x) = \sqrt{x - 1} + 2$. Scrivi $f^{-1}(x)$ per $x \ge 2$.`,
              answer: '(x-2)^2+1',
              explain: String.raw`$y = \sqrt{x-1} + 2 \Rightarrow \sqrt{x - 1} = y - 2$ (con $y \ge 2$, quindi elevare al quadrato non introduce soluzioni estranee) $\Rightarrow x - 1 = (y-2)^2 \Rightarrow x = (y-2)^2 + 1$.`,
            },
          ],
        },
      ],
      practice: [
        {
          id: 's03.proprieta.gen-composta', type: 'gen', level: 1,
          gen: (R) => {
            const a = R.nz(-4, 4), b = R.nz(-5, 5), c = R.nz(-5, 5);
            const fT = H.lin(a, b), gT = H.poly([1, 0, c]);
            const gof = R.chance(0.5);
            return {
              type: 'expr', vars: ['x'],
              prompt: String.raw`$f(x) = ${fT}$, $g(x) = ${gT}$. Scrivi $(${gof ? 'g \\circ f' : 'f \\circ g'})(x)$.`,
              answer: gof ? `(${a}*x+(${b}))^2+(${c})` : `(${a})*(x^2+(${c}))+(${b})`,
              explain: gof
                ? String.raw`$g(f(x)) = (f(x))^2 ${H.signed(c)} = (${fT})^2 ${H.signed(c)}$: prima $f$, poi $g$.`
                : String.raw`$f(g(x)) = ${H.coef(a)}g(x) ${H.signed(b)} = ${H.coef(a)}(${gT}) ${H.signed(b)} = ${H.poly([a, 0, a * c + b])}$: prima $g$, poi $f$.`,
            };
          },
        },
        {
          id: 's03.proprieta.gen-inv-lineare', type: 'gen', level: 1,
          gen: (R) => {
            const a = R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), b = R.nz(-7, 7);
            return {
              type: 'expr', vars: ['x'],
              prompt: String.raw`Inversa di $f(x) = ${H.lin(a, b)}$. Scrivi $f^{-1}(x)$.`,
              answer: `(x-(${b}))/(${a})`,
              explain: a > 0
                ? String.raw`$y = ${H.lin(a, b)} \Rightarrow ${a}x = y ${H.signed(-b)} \Rightarrow x = \frac{y ${H.signed(-b)}}{${a}}$. Rinomino: $f^{-1}(x) = \frac{x ${H.signed(-b)}}{${a}}$.`
                : String.raw`$y = ${H.lin(a, b)} \Rightarrow ${-a}x = ${H.lin(-1, b, 'y')} \Rightarrow x = \frac{${H.lin(-1, b, 'y')}}{${-a}}$. Rinomino: $f^{-1}(x) = \frac{${H.lin(-1, b)}}{${-a}}$.`,
            };
          },
        },
        {
          id: 's03.proprieta.gen-inv-omografica', type: 'gen', level: 2,
          gen: (R) => {
            let a, b, c, d;
            do {
              a = R.nz(-4, 4); b = R.int(-5, 5); c = R.pick([1, 2, -1]); d = R.int(-5, 5);
            } while (a * d - b * c === 0);
            return {
              type: 'expr', vars: ['x'],
              prompt: String.raw`Inversa di $f(x) = \dfrac{${H.lin(a, b)}}{${H.lin(c, d)}}$. Scrivi $f^{-1}(x)$.`,
              answer: `(${b}-(${d})*x)/((${c})*x-(${a}))`,
              explain: String.raw`$y(${H.lin(c, d)}) = ${H.lin(a, b)} \Rightarrow x(${H.lin(c, -a, 'y')}) = ${H.lin(-d, b, 'y')}$, quindi $f^{-1}(x) = \dfrac{${H.lin(-d, b)}}{${H.lin(c, -a)}}$ (definita per $x \ne ${H.frac(a, c)}$, che è l'asintoto orizzontale di $f$).`,
            };
          },
        },
        {
          id: 's03.proprieta.gen-inv-exp', type: 'gen', level: 2,
          gen: (R) => {
            const a = R.int(1, 3), b = R.int(-3, 4);
            const ex = `e^{${a === 1 ? '' : a}x}${b === 0 ? '' : ' ' + H.signed(b)}`;
            const lg = `\\log(${xm(b)})`;
            return {
              type: 'expr', vars: ['x'], domain: [b + 0.5, b + 4],
              prompt: String.raw`Inversa di $f(x) = ${ex}$. Scrivi $f^{-1}(x)$.`,
              answer: `log(x-(${b}))/${a}`,
              explain: String.raw`$y = ${ex} \Rightarrow e^{${a === 1 ? '' : a}x} = ${xm(b).replace('x', 'y')} \Rightarrow x = ${a === 1 ? lg.replace('x', 'y') : `\\frac{${lg.replace('x', 'y')}}{${a}}`}$, per $y > ${b}$. Quindi $f^{-1}(x) = ${a === 1 ? lg : `\\frac{${lg}}{${a}}`}$.`,
            };
          },
        },
        {
          id: 's03.proprieta.gen-inv-valore', type: 'gen', level: 2,
          gen: (R) => {
            const k = R.int(1, 4), c = R.int(-5, 5), x0 = R.int(-2, 2);
            const y0 = x0 ** 3 + k * x0 + c;
            return {
              type: 'num',
              prompt: String.raw`$f(x) = ${H.poly([1, 0, k, c])}$ è strettamente crescente. Calcola $f^{-1}(${y0})$.`,
              answer: String(x0),
              explain: String.raw`Cerco $x$ con $f(x) = ${y0}$ provando interi piccoli: $f(${x0}) = ${y0}$. Poiché $f$ è strettamente crescente (somma di $x^3$ e di $${k === 1 ? '' : k}x$, entrambe crescenti), è iniettiva: la soluzione è unica, $f^{-1}(${y0}) = ${x0}$.`,
            };
          },
        },
        {
          id: 's03.proprieta.P1', type: 'tf', level: 2,
          prompt: String.raw`$f: \R\setminus\{0\} \to \R$, $f(x) = \dfrac1x$ è iniettiva.`,
          answer: true,
          explain: String.raw`$\frac{1}{x_1} = \frac{1}{x_2} \Rightarrow x_1 = x_2$. Non è suriettiva su $\R$: il valore $0$ non è mai assunto.`,
        },
        {
          id: 's03.proprieta.P2', type: 'mcq', level: 2,
          prompt: String.raw`$f: \R \to \R$, $f(x) = |x| + x$. Che proprietà ha?`,
          options: ['né iniettiva né suriettiva', 'iniettiva, non suriettiva', 'suriettiva, non iniettiva', 'biiettiva'],
          answer: 0,
          explain: String.raw`Per $x \le 0$ vale $0$, per $x > 0$ vale $2x$. Non è iniettiva ($f(-1) = f(-2) = 0$), non è suriettiva (non assume valori negativi).`,
        },
        {
          id: 's03.proprieta.P3', type: 'interval', level: 2,
          prompt: String.raw`$f(x) = \sqrt{x}$, $g(x) = 4 - x^2$. Dominio di $f \circ g$.`,
          answer: '[-2,2]',
          explain: String.raw`$(f\circ g)(x) = \sqrt{4 - x^2}$: serve $4 - x^2 \ge 0 \iff -2 \le x \le 2$.`,
        },
        {
          id: 's03.proprieta.P4', type: 'expr', level: 2, vars: ['x'], domain: [0.2, 0.9],
          prompt: String.raw`Inversa di $f(x) = \dfrac{x}{1 - x}$ (per $x < 1$). Scrivi $f^{-1}(x)$.`,
          answer: 'x/(1+x)',
          explain: String.raw`$y(1 - x) = x \Rightarrow y = x + xy = x(1 + y) \Rightarrow x = \frac{y}{1+y}$.`,
        },
        {
          id: 's03.proprieta.P5', type: 'order', level: 2,
          prompt: String.raw`Metti in ordine i passi per calcolare l'inversa di $f(x) = 2 + \log(x - 1)$.`,
          steps: [
            String.raw`Scrivo $y = 2 + \log(x-1)$.`,
            String.raw`Isolo il logaritmo: $\log(x-1) = y - 2$.`,
            String.raw`Applico l'esponenziale: $x - 1 = e^{y-2}$.`,
            String.raw`Ricavo $x = e^{y-2} + 1$ e rinomino: $f^{-1}(x) = e^{x-2} + 1$.`,
          ],
          distractors: [String.raw`Faccio il reciproco: $f^{-1}(x) = \frac{1}{2 + \log(x-1)}$.`],
          explain: String.raw`Si "disfano" le operazioni in ordine inverso: prima si toglie il $+2$, poi il logaritmo (con l'esponenziale), infine il $-1$. Il reciproco non c'entra con l'inversa.`,
        },
        {
          id: 's03.proprieta.P6', type: 'open', level: 3,
          prompt: String.raw`Dimostra che la composta di due funzioni suriettive $f: A \to B$ e $g: B \to C$ è suriettiva.`,
          answer: String.raw`Sia $c \in C$. Poiché $g$ è suriettiva esiste $b \in B$ con $g(b) = c$. Poiché $f$ è suriettiva esiste $a \in A$ con $f(a) = b$. Allora $(g\circ f)(a) = g(f(a)) = g(b) = c$. Quindi ogni $c \in C$ è immagine di qualche $a \in A$: $g \circ f$ è suriettiva.`,
          rubric: ['Parte da un generico $c \\in C$', 'Usa la suriettività di $g$ per trovare $b$', 'Usa la suriettività di $f$ per trovare $a$', 'Verifica $(g \\circ f)(a) = c$ e conclude'],
        },
      ],
      flashcards: [
        { id: 's03.proprieta.fc1', kind: 'def', front: 'Funzione iniettiva', back: String.raw`$f$ è iniettiva se $f(x_1) = f(x_2) \Rightarrow x_1 = x_2$ (input diversi, output diversi). Grafico: ogni retta orizzontale lo incontra al più una volta.` },
        { id: 's03.proprieta.fc2', kind: 'def', front: 'Funzione suriettiva', back: String.raw`$f: A \to B$ è suriettiva se $f(A) = B$: per ogni $y \in B$ esiste $x \in A$ con $f(x) = y$.` },
        { id: 's03.proprieta.fc3', kind: 'def', front: 'Funzione biiettiva', back: String.raw`Iniettiva e suriettiva: ogni $y \in B$ ha **esattamente una** controimmagine. È la condizione per avere l'inversa $f^{-1}: B \to A$.` },
        { id: 's03.proprieta.fc4', kind: 'def', front: 'Funzione composta e suo dominio', back: String.raw`$(g \circ f)(x) = g(f(x))$: prima $f$, poi $g$. Dominio: $\{x \in \text{dom} f : f(x) \in \text{dom}\, g\}$. In generale $g \circ f \ne f \circ g$.` },
        { id: 's03.proprieta.fc5', kind: 'def', front: 'Funzione inversa', back: String.raw`Se $f: A \to B$ è biiettiva, $f^{-1}: B \to A$ è definita da $f^{-1}(y) = x \iff f(x) = y$. $f^{-1}\circ f = \text{id}_A$, $f \circ f^{-1} = \text{id}_B$. Il grafico è simmetrico rispetto a $y = x$.` },
        { id: 's03.proprieta.fc6', kind: 'metodo', front: 'Come si calcola l\'inversa', back: String.raw`Scrivi $y = f(x)$, risolvi rispetto a $x$ (controllando per quali $y$ la soluzione esiste), poi rinomina $y \to x$. $\text{dom} f^{-1} = \text{im} f$.` },
        { id: 's03.proprieta.fc7', kind: 'thm', front: 'Monotonia e iniettività', back: String.raw`Una funzione **strettamente** monotona è iniettiva, quindi invertibile sulla sua immagine. Il viceversa è falso ($\frac1x$ è iniettiva ma non monotona su $\R\setminus\{0\}$).` },
        { id: 's03.proprieta.fc8', kind: 'errore', front: String.raw`$f^{-1}(x)$ e $\frac{1}{f(x)}$`, back: String.raw`Sono cose diverse: $f^{-1}$ è l'inversa rispetto alla composizione, $\frac{1}{f(x)} = (f(x))^{-1}$ è il reciproco. Es. $f(x) = 2x$: $f^{-1}(x) = \frac x2$, $\frac1{f(x)} = \frac{1}{2x}$.` },
      ],
    },
  ],
};
