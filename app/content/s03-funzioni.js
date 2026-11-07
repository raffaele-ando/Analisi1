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
  ],
};
