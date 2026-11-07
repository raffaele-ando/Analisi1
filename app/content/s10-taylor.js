import { H } from '../engine/tex.js';

// ---------------------------------------------------------------------------
// s10 · Formula di Taylor
// Le skill sono aggiunte in fondo con SKILLS.push(...): l'oggetto esportato
// contiene lo stesso array, quindi le aggiunte successive vi compaiono.
// ---------------------------------------------------------------------------

const SKILLS = [];

export default {
  id: 's10',
  title: 'Formula di Taylor',
  subtitle: 'Polinomio di Taylor, resti, sviluppi notevoli, limiti',
  intro: String.raw`Il polinomio di Taylor è la migliore approssimazione polinomiale di una funzione vicino a un punto. All'esame serve in due modi: per calcolare limiti in forma indeterminata senza calcolatrice, e per stimare quanto sbaglia un'approssimazione. Qui impari a costruire il polinomio, a leggere il resto di Peano e quello di Lagrange, a usare gli sviluppi notevoli e a riconoscere l'ordine di infinitesimo.`,
  skills: SKILLS,
};

// ---------- helper per i generatori ----------

/** Coefficiente tra parentesi per math.js: -2 -> '(-2)', 3 -> '3' */
const mj = (c) => (c < 0 ? `(${c})` : `${c}`);

// ===========================================================================
// s10.formula · Polinomio di Taylor, resto di Peano e di Lagrange, x0 != 0
// ===========================================================================
SKILLS.push({
  id: 's10.formula',
  title: 'Polinomio di Taylor e resti',
  summary: String.raw`Costruire $T_n(x)$ in un punto $x_0$ qualsiasi, leggere il resto di Peano $o\big((x-x_0)^n\big)$ e quello di Lagrange per stimare l'errore.`,
  prereq: ['s08.regole', 's08.convessita'],
  examRefs: ['Appello 06/07/2026 · Es. B'],
  lessons: [
    {
      id: 's10.formula.L1',
      title: 'Dalla tangente al polinomio di Taylor',
      cards: [
        {
          type: 'learn',
          title: 'Una retta non basta',
          body: String.raw`Vicino a un punto $x_0$ una funzione derivabile si comporta quasi come la sua **retta tangente**:
$$y=f(x_0)+f'(x_0)\,(x-x_0).$$
È un polinomio di grado $1$ che passa per il punto $(x_0,f(x_0))$ e ha la stessa pendenza di $f$ in $x_0$.

Per $f(x)=e^x$ in $x_0=0$ la tangente è $y=1+x$. Per $x=0{,}1$ dà $1{,}1$, mentre $e^{0{,}1}\approx 1{,}105$. L'errore è piccolo, ma per approssimare meglio serve un polinomio che imiti anche la **curvatura**, cioè i termini di grado $2$, $3$ e così via. È l'idea della formula di Taylor.`,
          plot: { fns: ['e^x', '1+x'], x: [-2, 2], y: [-1, 4] },
        },
        {
          type: 'learn',
          title: 'Derivate successive e definizione',
          body: String.raw`Il polinomio di Taylor usa le **derivate successive** di $f$ in $x_0$: $f^{(0)}=f$, $f^{(1)}=f'$, $f^{(2)}=f''$, $f^{(3)}=f'''$, e così via. $f^{(k)}(x_0)$ è un numero, il valore della derivata $k$-esima in $x_0$. Serve anche il fattoriale: $0!=1$, $1!=1$, $2!=2$, $3!=6$, $4!=24$.

>* Sia $f$ derivabile $n$ volte in $x_0$. Il **polinomio di Taylor di grado $n$** di $f$ in $x_0$ è
$$T_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}\,(x-x_0)^k=f(x_0)+f'(x_0)(x-x_0)+\frac{f''(x_0)}{2!}(x-x_0)^2+\dots+\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n.$$

Il polinomio ha in $x_0$ le stesse derivate di $f$ fino all'ordine $n$. Per $n=1$ si ritrova la tangente.

> Le potenze sono di $(x-x_0)$, non di $x$. Il simbolo $f^{(k)}$ è la derivata $k$-esima, non la potenza $f^k$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: Taylor di $e^x$',
          problem: String.raw`Scrivi il polinomio di Taylor di grado $3$ di $f(x)=e^x$ in $x_0=0$.`,
          steps: [
            String.raw`Tutte le derivate di $e^x$ sono $e^x$, quindi $f^{(k)}(0)=e^0=1$ per ogni $k$.`,
            String.raw`I coefficienti sono $\dfrac{f^{(k)}(0)}{k!}=\dfrac{1}{k!}$: valgono $1,\ 1,\ \dfrac12,\ \dfrac16$ per $k=0,1,2,3$.`,
            String.raw`Quindi $T_3(x)=1+x+\dfrac{x^2}{2}+\dfrac{x^3}{6}$.`,
          ],
          result: String.raw`$T_3(x)=1+x+\dfrac{x^2}{2}+\dfrac{x^3}{6}$`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: Taylor di $\cos x$',
          problem: String.raw`Scrivi il polinomio di Taylor di grado $2$ di $f(x)=\cos x$ in $x_0=0$.`,
          steps: [
            String.raw`$f(0)=\cos 0=1$ e $f'(x)=-\sin x$, quindi $f'(0)=0$.`,
            {
              text: String.raw`$f''(x)=-\cos x$, quindi $f''(0)=-1$ e il coefficiente di $x^2$ è $\dfrac{-1}{2!}=-\dfrac12$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $f''(0)$ per $f(x)=\cos x$?`,
                answer: '-1',
                explain: String.raw`$f''(x)=-\cos x$ e $\cos 0=1$, quindi $f''(0)=-1$.`,
              },
            },
          ],
          result: String.raw`$T_2(x)=1-\dfrac{x^2}{2}$`,
        },
        {
          type: 'mcq',
          id: 's10.formula.L1.q1',
          level: 1,
          prompt: String.raw`Qual è il polinomio di Taylor di grado $1$ di $f$ in $x_0$?`,
          options: [
            String.raw`$f(x_0)+f'(x_0)\,(x-x_0)$`,
            String.raw`$f(x_0)+f'(x_0)\,x$`,
            String.raw`$f'(x_0)+f(x_0)\,(x-x_0)$`,
            String.raw`$f(x)+f'(x)\,(x-x_0)$`,
          ],
          answer: 0,
          explain: String.raw`Si parte da $f(x_0)$ e si aggiunge la pendenza $f'(x_0)$ moltiplicata per la distanza $(x-x_0)$. Il secondo distrattore dimentica la traslazione: la retta non passa per $(x_0,f(x_0))$. Il terzo scambia $f$ e $f'$. Il quarto valuta le derivate in $x$ invece che in $x_0$: non si ottiene più un polinomio.`,
        },
        {
          type: 'mcq',
          id: 's10.formula.L1.q2',
          level: 1,
          prompt: String.raw`Qual è il polinomio di Taylor di grado $1$ di $f(x)=x\,e^x$ in $x_0=0$?`,
          options: [
            String.raw`$x$`,
            String.raw`$1+x$`,
            String.raw`$x+x^2$`,
            String.raw`$1$`,
          ],
          answer: 0,
          explain: String.raw`$f(0)=0$ e $f'(x)=e^x+xe^x$, quindi $f'(0)=1$. Il polinomio è $0+1\cdot x=x$. Il distrattore $1+x$ scambia $f(0)$ con $f'(0)$. Il distrattore $x+x^2$ aggiunge un termine di grado $2$, che la formula di grado $1$ non contiene. Il distrattore $1$ è solo $f(0)$, e dimentica il termine della derivata.`,
        },
        {
          type: 'tf',
          id: 's10.formula.L1.q3',
          level: 1,
          prompt: String.raw`Se $P$ è un polinomio di grado al più $n$, il polinomio di Taylor di grado $n$ di $P$ in un punto $x_0$ coincide con $P$.`,
          answer: true,
          explain: String.raw`Dopo $n$ derivate un polinomio di grado al più $n$ dà valori costanti, e la formula restituisce proprio $P$. Esempio: $P(x)=x^2+1$ in $x_0=3$ ha $f(3)=10$, $f'(3)=6$, $\frac{f''(3)}{2}=1$, quindi $T_2(x)=10+6(x-3)+(x-3)^2=x^2+1$.`,
        },
        {
          type: 'num',
          id: 's10.formula.L1.q4',
          level: 1,
          prompt: String.raw`Nel polinomio di Taylor di grado $3$ di $f(x)=\sin x$ in $x_0=0$, qual è il coefficiente di $x^3$?`,
          answer: '-1/6',
          explain: String.raw`Il coefficiente di $x^3$ è $\dfrac{f'''(0)}{3!}$. Per $\sin x$ si ha $f'''(x)=-\cos x$, quindi $f'''(0)=-1$ e il coefficiente è $-\dfrac16$. Errore tipico: dimenticare il fattoriale e scrivere $-1$.`,
        },
        {
          type: 'expr',
          id: 's10.formula.L1.q5',
          level: 2,
          prompt: String.raw`Scrivi il polinomio di Taylor di grado $2$ di $f(x)=\log(1+x)$ in $x_0=0$ (senza resto).`,
          answer: 'x-x^2/2',
          vars: ['x'],
          explain: String.raw`$f(0)=\log 1=0$, $f'(x)=\dfrac{1}{1+x}$ quindi $f'(0)=1$, $f''(x)=-\dfrac{1}{(1+x)^2}$ quindi $f''(0)=-1$. Allora $T_2(x)=0+x-\dfrac{x^2}{2}$.`,
        },
        {
          type: 'expr',
          id: 's10.formula.L1.q6',
          level: 2,
          prompt: String.raw`Scrivi il polinomio di Taylor di grado $3$ di $f(x)=e^{2x}$ in $x_0=0$ (senza resto).`,
          answer: '1+2*x+2*x^2+(4/3)*x^3',
          vars: ['x'],
          explain: String.raw`Le derivate di $e^{2x}$ in $0$ valgono $f^{(k)}(0)=2^k$. I coefficienti sono $\dfrac{2^k}{k!}$: $1,\ 2,\ \dfrac{4}{2}=2,\ \dfrac{8}{6}=\dfrac43$.`,
        },
        {
          type: 'num',
          id: 's10.formula.L1.q7',
          level: 2,
          prompt: String.raw`Quanto vale $f''(0)$ per $f(x)=\cos(2x)$?`,
          answer: '-4',
          explain: String.raw`$f'(x)=-2\sin(2x)$, $f''(x)=-4\cos(2x)$, quindi $f''(0)=-4$. Ricorda la derivata interna: il $2$ compare due volte.`,
        },
      ],
    },
    {
      id: 's10.formula.L2',
      title: "Quanto sbaglia il polinomio: il resto di Peano",
      cards: [
        {
          type: 'learn',
          title: "L'errore è trascurabile",
          body: String.raw`Chiamiamo $R_n(x)=f(x)-T_n(x)$ il **resto**: è quanto sbaglia il polinomio. Il resto è una funzione, non un numero. Perché l'approssimazione sia buona, deve diventare piccolo *più in fretta* di $(x-x_0)^n$.

Il simbolo $o$ esprime questo fatto. Scrivere $R(x)=o\big((x-x_0)^n\big)$ per $x\to x_0$ significa
$$\lim_{x\to x_0}\frac{R(x)}{(x-x_0)^n}=0.$$
Si legge "$R$ è o-piccolo di $(x-x_0)^n$": vicino a $x_0$ è trascurabile rispetto a $(x-x_0)^n$.

Esempi per $x\to0$: $x^3=o(x^2)$, perché $\dfrac{x^3}{x^2}=x\to0$. Invece $x^2\neq o(x^2)$, perché il rapporto vale sempre $1$.`,
        },
        {
          type: 'learn',
          title: 'Il teorema di Peano',
          body: String.raw`>* **Formula di Taylor con resto di Peano.** Sia $f$ derivabile $n$ volte in $x_0$. Allora
$$f(x)=T_n(x)+o\big((x-x_0)^n\big)\qquad\text{per } x\to x_0.$$

Il teorema dice che l'errore è trascurabile vicino a $x_0$. **Non** dice quanto è grande: per questo serve il resto di Lagrange (lezione 3).

> Il resto di Peano è locale: vale vicino a $x_0$. Lontano da $x_0$ l'approssimazione può essere pessima.`,
          plot: { fns: ['sin(x)', 'x-x^3/6'], x: [-3, 3], y: [-2, 2] },
        },
        {
          type: 'example',
          title: 'Esempio svolto: Taylor di $\sin x$ con resto',
          problem: String.raw`Scrivi $\sin x$ con la formula di Taylor di grado $3$ in $x_0=0$, con resto di Peano.`,
          steps: [
            String.raw`Derivate di $\sin x$ in $0$: $f(0)=0$, $f'(0)=\cos 0=1$, $f''(0)=-\sin 0=0$, $f'''(0)=-\cos 0=-1$.`,
            String.raw`I coefficienti sono $\dfrac{0}{0!}=0$, $\dfrac{1}{1!}=1$, $\dfrac{0}{2!}=0$, $\dfrac{-1}{3!}=-\dfrac16$.`,
            String.raw`Quindi $T_3(x)=x-\dfrac{x^3}{6}$ e vale $\sin x=x-\dfrac{x^3}{6}+o(x^3)$.`,
          ],
          result: String.raw`$\sin x=x-\dfrac{x^3}{6}+o(x^3)$ per $x\to0$`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: ordine di $x-\sin x$',
          problem: String.raw`Di che ordine è l'infinitesimo $x-\sin x$ per $x\to0$? Trova anche la sua parte principale.`,
          steps: [
            String.raw`Dall'esempio precedente: $\sin x=x-\dfrac{x^3}{6}+o(x^3)$.`,
            {
              text: String.raw`Quindi $x-\sin x=\dfrac{x^3}{6}+o(x^3)$: il primo termine non nullo è in $x^3$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Di che ordine è $x-\sin x$ per $x\to0$?`,
                answer: '3',
                explain: String.raw`Il primo termine non nullo dello sviluppo è $\dfrac{x^3}{6}$, di grado $3$: l'ordine è $3$.`,
              },
            },
            String.raw`La parte principale è $\dfrac{x^3}{6}$, cioè $x-\sin x\sim\dfrac{x^3}{6}$.`,
          ],
          result: String.raw`$x-\sin x=\dfrac{x^3}{6}+o(x^3)$: ordine $3$, parte principale $\dfrac{x^3}{6}$`,
        },
        {
          type: 'mcq',
          id: 's10.formula.L2.q1',
          level: 1,
          prompt: String.raw`Quale affermazione è vera per $x\to0$?`,
          options: [
            String.raw`$x^3=o(x^2)$`,
            String.raw`$x^2=o(x^3)$`,
            String.raw`$x=o(x)$`,
            String.raw`$\sin x=o(x)$`,
          ],
          answer: 0,
          explain: String.raw`$\dfrac{x^3}{x^2}=x\to0$, quindi $x^3=o(x^2)$. Il secondo è falso: $\dfrac{x^2}{x^3}=\dfrac1x\to\infty$. Il terzo è falso: $\dfrac{x}{x}=1$ non tende a $0$. Il quarto è falso: $\dfrac{\sin x}{x}\to1$, quindi $\sin x$ non è trascurabile rispetto a $x$.`,
        },
        {
          type: 'tf',
          id: 's10.formula.L2.q2',
          level: 1,
          prompt: String.raw`Per $x\to0$ vale $o(x^2)+o(x^2)=o(x^2)$.`,
          answer: true,
          explain: String.raw`Se $\dfrac{f}{x^2}\to0$ e $\dfrac{g}{x^2}\to0$, allora $\dfrac{f+g}{x^2}\to0$. La somma di due quantità trascurabili rispetto a $x^2$ è trascurabile rispetto a $x^2$.`,
        },
        {
          type: 'num',
          id: 's10.formula.L2.q3',
          level: 2,
          prompt: String.raw`Sia $f$ derivabile tre volte in $0$ e $f(x)=3x^2+x^3+o(x^3)$ per $x\to0$. Quanto vale $f'''(0)$?`,
          answer: '6',
          explain: String.raw`Per l'unicità dello sviluppo di Peano, i coefficienti del polinomio sono quelli di Taylor. Il termine in $x^2$ vale $\dfrac{f''(0)}{2}=3$, quindi $f''(0)=6$. Il termine in $x^3$ vale $\dfrac{f'''(0)}{6}=1$, quindi $f'''(0)=6$.`,
        },
        {
          type: 'order',
          id: 's10.formula.L2.q4',
          level: 2,
          prompt: String.raw`Ordina i passi per ottenere $f(x)=T_n(x)+o\big((x-x_0)^n\big)$.`,
          steps: [
            String.raw`Calcola $f(x_0),\,f'(x_0),\dots,f^{(n)}(x_0)$.`,
            String.raw`Divide ogni valore per $k!$, dove $k$ è l'ordine della derivata.`,
            String.raw`Moltiplica ogni termine per $(x-x_0)^k$ e somma: ottieni $T_n(x)$.`,
            String.raw`Scrivi $f(x)=T_n(x)+o\big((x-x_0)^n\big)$.`,
          ],
          distractors: [
            String.raw`Sostituisci $x$ con $x_0$ nel polinomio per trovarne il resto.`,
            String.raw`Divide ogni valore per $k$ invece che per $k!$.`,
          ],
          explain: String.raw`Prima servono le derivate, poi i coefficienti $\dfrac{f^{(k)}(x_0)}{k!}$, poi la somma, infine il resto. Il resto di Peano non si ricava sostituendo $x_0$: è un o-piccolo per definizione.`,
        },
        {
          type: 'cloze',
          id: 's10.formula.L2.q5',
          level: 2,
          text: String.raw`Nella formula $f(x)=T_n(x)+o\big((x-x_0)^n\big)$ il resto è un infinitesimo di ordine [[0]] rispetto a $(x-x_0)^n$, e il polinomio $T_n$ ha grado [[1]] $n$.`,
          blanks: [
            { options: [String.raw`superiore a $n$`, String.raw`uguale a $n$`, String.raw`inferiore a $n$`], answer: 0 },
            { options: [String.raw`al più`, String.raw`esattamente`, String.raw`almeno`], answer: 0 },
          ],
          explain: String.raw`Un o-piccolo di $(x-x_0)^n$ è trascurabile rispetto a $(x-x_0)^n$, quindi il suo ordine è maggiore di $n$. Il polinomio $T_n$ ha grado al più $n$: il coefficiente di $x^n$ può anche essere nullo.`,
        },
        {
          type: 'open',
          id: 's10.formula.L2.q6',
          level: 2,
          points: 2,
          prompt: String.raw`Perché il resto di Peano non dà una stima numerica dell'errore, ma è comunque utile per calcolare i limiti?`,
          answer: String.raw`Il resto di Peano dice solo che $R_n(x)/(x-x_0)^n\to0$ per $x\to x_0$: l'errore è trascurabile vicino a $x_0$, ma non c'è una maggiorazione numerica. Per i limiti basta questo: si possono sostituire le funzioni con i loro polinomi e trascurare i termini di ordine superiore.`,
          rubric: [
            String.raw`Definizione: $R_n(x)/(x-x_0)^n\to0$`,
            'Il resto è trascurabile rispetto al termine di grado n',
            'Nessuna stima numerica: per quella serve il resto di Lagrange',
            'Uso nei limiti: sostituire la funzione con il suo polinomio',
          ],
        },
        {
          type: 'num',
          id: 's10.formula.L2.q7',
          level: 2,
          prompt: String.raw`Di che ordine è l'infinitesimo $x^2-x^2\cos x$ per $x\to0$?`,
          answer: '4',
          explain: String.raw`Da $\cos x=1-\dfrac{x^2}{2}+o(x^2)$ segue $1-\cos x=\dfrac{x^2}{2}+o(x^2)$. Quindi $x^2-x^2\cos x=x^2(1-\cos x)=\dfrac{x^4}{2}+o(x^4)$: ordine $4$.`,
        },
      ],
    },
    {
      id: 's10.formula.L3',
      title: 'Il resto di Lagrange e Taylor in un punto qualsiasi',
      cards: [
        {
          type: 'learn',
          title: 'Il resto di Lagrange',
          body: String.raw`>* **Formula di Taylor con resto di Lagrange.** Sia $f$ derivabile $n+1$ volte su un intervallo $I$ che contiene $x_0$ e $x$. Allora esiste $c$ compreso tra $x_0$ e $x$ tale che
$$f(x)=T_n(x)+\frac{f^{(n+1)}(c)}{(n+1)!}\,(x-x_0)^{n+1}.$$

Il termine $R_n(x)=\dfrac{f^{(n+1)}(c)}{(n+1)!}(x-x_0)^{n+1}$ è il **resto di Lagrange**. Il punto $c$ dipende da $x$ e in generale non si conosce: il resto serve per **maggiorare** l'errore. Se $|f^{(n+1)}|\le M$ su $I$, allora
$$|R_n(x)|\le \frac{M}{(n+1)!}\,|x-x_0|^{n+1}.$$`,
        },
        {
          type: 'learn',
          title: 'Taylor in un punto qualsiasi',
          body: String.raw`Il polinomio di Taylor in $x_0$ è una somma di potenze di $(x-x_0)$, **non** di $x$. Se $x_0=1$ il termine di grado $1$ è $f'(1)(x-1)$, non $f'(1)\,x$.

Per $f(x)=\log x$ in $x_0=1$ si ha $f(1)=0$, $f'(1)=1$, $f''(1)=-1$. Il polinomio è
$$T_2(x)=(x-1)-\frac{(x-1)^2}{2}.$$
Si può sviluppare in potenze di $x$, ma solo se serve davvero: spesso la forma con $(x-x_0)$ è più chiara.`,
          plot: { fns: ['log(x)', 'x-1-(x-1)^2/2'], x: [0.2, 3], y: [-2, 1.5] },
        },
        {
          type: 'example',
          title: "Esempio svolto: stima di $e^{1/2}$",
          problem: String.raw`Approssima $e^{1/2}$ con il polinomio di Taylor di grado $2$ di $e^x$ in $x_0=0$, e stima l'errore con il resto di Lagrange.`,
          steps: [
            String.raw`Dallo sviluppo di $e^x$ in $0$: $T_2(x)=1+x+\dfrac{x^2}{2}$.`,
            {
              text: String.raw`Quindi $T_2\!\left(\tfrac12\right)=1+\tfrac12+\tfrac18=\dfrac{13}{8}$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $T_2\!\left(\tfrac12\right)$ con $T_2(x)=1+x+\dfrac{x^2}{2}$?`,
                answer: '13/8',
                explain: String.raw`$1+\dfrac12+\dfrac18=\dfrac{8+4+1}{8}=\dfrac{13}{8}$.`,
              },
            },
            String.raw`Il resto è $R_2(x)=\dfrac{e^{c}}{3!}x^3$ con $c$ tra $0$ e $x$. Per $x=\tfrac12$ e $0\le c\le\tfrac12$ si ha $e^c\le e^{1/2}$, quindi $|R_2|\le\dfrac{e^{1/2}}{6}\cdot\dfrac18=\dfrac{e^{1/2}}{48}$.`,
            String.raw`Poiché $e^{1/2}<2$, si ha $|R_2|<\dfrac{2}{48}=\dfrac1{24}$.`,
          ],
          result: String.raw`$\dfrac{13}{8}-\dfrac1{24}<e^{1/2}<\dfrac{13}{8}+\dfrac1{24}$`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: Taylor di $\log x$ in $1$',
          problem: String.raw`Scrivi il polinomio di Taylor di grado $2$ di $f(x)=\log x$ in $x_0=1$.`,
          steps: [
            String.raw`$f(1)=\log 1=0$ e $f'(x)=\dfrac1x$, quindi $f'(1)=1$.`,
            {
              text: String.raw`$f''(x)=-\dfrac{1}{x^2}$, quindi il coefficiente di $(x-1)^2$ è $\dfrac{-1}{2}$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $f''(1)$ per $f(x)=\log x$?`,
                answer: '-1',
                explain: String.raw`$f''(x)=-\dfrac{1}{x^2}$ e $f''(1)=-1$.`,
              },
            },
            String.raw`Quindi $T_2(x)=0+1\cdot(x-1)-\dfrac12(x-1)^2$.`,
          ],
          result: String.raw`$T_2(x)=(x-1)-\dfrac{(x-1)^2}{2}$`,
        },
        {
          type: 'expr',
          id: 's10.formula.L3.q1',
          level: 2,
          prompt: String.raw`Scrivi il polinomio di Taylor di grado $1$ di $f(x)=\sqrt{x}$ in $x_0=4$ (senza resto).`,
          answer: '2+(x-4)/4',
          vars: ['x'],
          domain: [3, 5],
          explain: String.raw`$f(4)=2$, $f'(x)=\dfrac{1}{2\sqrt x}$ quindi $f'(4)=\dfrac14$. Allora $T_1(x)=2+\dfrac14(x-4)$. Errore tipico: scrivere $\dfrac14x$ dimenticando la traslazione $(x-4)$.`,
        },
        {
          type: 'expr',
          id: 's10.formula.L3.q2',
          level: 3,
          source: 'Appello 06/07/2026 · Es. B',
          prompt: String.raw`Scrivi il polinomio di Taylor di ordine $2$ di $f(x)=x\cos x+\sin x$ in $x_0=\pi$ (senza resto).`,
          answer: '-pi-2*(x-pi)+(pi/2)*(x-pi)^2',
          vars: ['x'],
          explain: String.raw`$f'(x)=\cos x-x\sin x+\cos x=2\cos x-x\sin x$ e $f''(x)=-2\sin x-\sin x-x\cos x=-3\sin x-x\cos x$. In $x_0=\pi$: $f(\pi)=-\pi$, $f'(\pi)=-2$, $f''(\pi)=\pi$. Quindi $T_2(x)=-\pi-2(x-\pi)+\dfrac{\pi}{2}(x-\pi)^2$.`,
        },
        {
          type: 'tf',
          id: 's10.formula.L3.q3',
          level: 2,
          prompt: String.raw`Nel resto di Lagrange il punto $c$ sta tra $x_0$ e $x$ e, in generale, il suo valore non è noto.`,
          answer: true,
          explain: String.raw`Il teorema garantisce l'esistenza di $c$ senza dire quale sia: per questo il resto di Lagrange serve a maggiorare l'errore, non a calcolarlo esattamente.`,
        },
        {
          type: 'mcq',
          id: 's10.formula.L3.q4',
          level: 3,
          prompt: String.raw`Per $f(x)=\sin x$ in $x_0=0$ e $n=2$, quale maggiorazione del resto di Lagrange vale per ogni $x$?`,
          options: [
            String.raw`$|R_2(x)|\le \dfrac{|x|^3}{6}$`,
            String.raw`$|R_2(x)|\le \dfrac{x^2}{2}$`,
            String.raw`$|R_2(x)|\le |x|^3$`,
            String.raw`$R_2(x)=0$`,
          ],
          answer: 0,
          explain: String.raw`$R_2(x)=\dfrac{f'''(c)}{3!}x^3=-\dfrac{\cos c}{6}x^3$ e $|\cos c|\le1$. Il secondo distrattore usa l'ordine sbagliato ($x^2$ invece di $x^3$). Il terzo dimentica il fattoriale $3!$. Il quarto è falso: $\sin x\neq x$, quindi $R_2\neq0$.`,
        },
        {
          type: 'num',
          id: 's10.formula.L3.q5',
          level: 3,
          prompt: String.raw`Sia $f(x)=\cos x$ e $n=3$ in $x_0=0$. Con il resto di Lagrange, qual è la stima $|R_3(x)|\le M$ valida per $|x|\le\tfrac12$? Scrivi $M$.`,
          answer: '1/384',
          explain: String.raw`$T_3(x)=1-\dfrac{x^2}{2}$ perché il coefficiente di $x^3$ è nullo. Il resto è $R_3(x)=\dfrac{f^{(4)}(c)}{4!}x^4=\dfrac{\cos c}{24}x^4$, e $|\cos c|\le1$. Quindi $|R_3(x)|\le\dfrac{x^4}{24}\le\dfrac{1}{16\cdot24}=\dfrac{1}{384}$.`,
        },
        {
          type: 'problem',
          id: 's10.formula.L3.q6',
          level: 3,
          source: 'Esercizio di tipo esame',
          points: 4,
          prompt: String.raw`Sia $f(x)=\log(1+x)$. (a) Scrivi $T_2$ in $x_0=0$. (b) Stima $|R_2(x)|$ per $x\in\left[0,\tfrac12\right]$ con il resto di Lagrange.`,
          parts: [
            {
              type: 'expr',
              prompt: String.raw`Polinomio $T_2(x)$ (senza resto).`,
              answer: 'x-x^2/2',
              vars: ['x'],
              explain: String.raw`$f(0)=0$, $f'(x)=\dfrac{1}{1+x}$, $f''(x)=-\dfrac{1}{(1+x)^2}$: $T_2(x)=x-\dfrac{x^2}{2}$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Valore di $f'''(0)$.`,
              answer: '2',
              explain: String.raw`$f'''(x)=\dfrac{2}{(1+x)^3}$, quindi $f'''(0)=2$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Il numero $M$ tale che $|R_2(x)|\le M$ per $x\in\left[0,\tfrac12\right]$, con il resto di Lagrange.`,
              answer: '1/24',
              explain: String.raw`Per $c\ge0$ si ha $|f'''(c)|=\dfrac{2}{(1+c)^3}\le2$. Quindi $|R_2(x)|\le\dfrac{2}{3!}x^3\le\dfrac13\cdot\dfrac18=\dfrac1{24}$.`,
            },
          ],
          solution: String.raw`$T_2(x)=x-\dfrac{x^2}{2}$. La derivata terza $f'''(x)=\dfrac{2}{(1+x)^3}$ è decrescente, quindi il suo massimo modulo su $\left[0,\tfrac12\right]$ è $f'''(0)=2$. Con Lagrange, $R_2(x)=\dfrac{f'''(c)}{3!}x^3$ e $|R_2(x)|\le\dfrac{2}{6}\cdot\dfrac18=\dfrac{1}{24}$.`,
        },
        {
          type: 'open',
          id: 's10.formula.L3.q7',
          level: 3,
          points: 3,
          prompt: String.raw`Enuncia la formula di Taylor con resto di Lagrange e spiega cosa aggiunge rispetto al resto di Peano.`,
          answer: String.raw`Se $f$ è derivabile $n+1$ volte su un intervallo che contiene $x_0$ e $x$, esiste $c$ tra $x_0$ e $x$ con $f(x)=T_n(x)+\dfrac{f^{(n+1)}(c)}{(n+1)!}(x-x_0)^{n+1}$. Rispetto a Peano, Lagrange dà una stima quantitativa: se $|f^{(n+1)}|\le M$ allora $|R_n(x)|\le\dfrac{M}{(n+1)!}|x-x_0|^{n+1}$. Peano dice solo che l'errore è un o-piccolo di $(x-x_0)^n$, cioè un risultato locale.`,
          rubric: [
            'Ipotesi: f derivabile n+1 volte su un intervallo che contiene x0 e x',
            'Tesi: esiste c tra x0 e x con il termine di grado n+1 valutato in c',
            'Stima: se |f^(n+1)| ≤ M allora |R_n| ≤ M/(n+1)! · |x-x0|^(n+1)',
            'Confronto con Peano: stima quantitativa contro risultato solo locale',
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: 's10.formula.g1', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'expr',
          prompt: String.raw`Scrivi il polinomio di Taylor di grado $2$ di $f(x)=e^{${H.coef(a)}x}$ in $x_0=0$ (senza resto).`,
          answer: `1+(${a})*x+(${a * a}/2)*x^2`,
          vars: ['x'],
          explain: String.raw`Le derivate in $0$ valgono $f^{(k)}(0)=(${a})^k$. I coefficienti sono $\dfrac{(${a})^k}{k!}$: quindi $T_2(x)=1+(${a})x+\dfrac{${a * a}}{2}x^2$.`,
        };
      },
    },
    {
      id: 's10.formula.g2', type: 'gen', level: 2,
      gen: (R) => {
        const A = R.nz(-3, 3), B = R.int(-3, 3), C = R.int(-4, 4), D = R.int(-3, 3), x0 = R.int(-2, 2);
        const c0 = A * x0 ** 3 + B * x0 ** 2 + C * x0 + D;
        const c1 = 3 * A * x0 ** 2 + 2 * B * x0 + C;
        const c2 = 3 * A * x0 + B;
        return {
          type: 'expr',
          prompt: String.raw`Scrivi il polinomio di Taylor di grado $2$ di $f(x)=${H.poly([A, B, C, D])}$ in $x_0=${x0}$ (senza resto).`,
          answer: `${c0}+(${c1})*(x-(${x0}))+(${c2})*(x-(${x0}))^2`,
          vars: ['x'],
          explain: String.raw`$f(${x0})=${c0}$, $f'(${x0})=${c1}$, $\dfrac{f''(${x0})}{2}=${c2}$. Quindi $T_2(x)=${c0}+(${c1})(x-(${x0}))+(${c2})(x-(${x0}))^2$.`,
        };
      },
    },
    {
      id: 's10.formula.g3', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        const c = -(a ** 3);
        return {
          type: 'num',
          prompt: String.raw`Nel polinomio di Taylor di grado $3$ di $f(x)=\sin(${H.coef(a)}x)$ in $x_0=0$, qual è il coefficiente di $x^3$?`,
          answer: `${c}/6`,
          explain: String.raw`Con $u=${H.coef(a)}x$ si ha $\sin u=u-\dfrac{u^3}{6}+\dots$, e $u^3=(${a})^3x^3$. Il coefficiente è $\dfrac{${c}}{6}$.`,
        };
      },
    },
    {
      id: 's10.formula.g4', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(2, 5);
        return {
          type: 'expr',
          prompt: String.raw`Scrivi il polinomio di Taylor di grado $1$ di $f(x)=\log(x+${a})$ in $x_0=0$ (senza resto).`,
          answer: `log(${a})+x/${a}`,
          vars: ['x'],
          explain: String.raw`$f(0)=\log ${a}$ e $f'(x)=\dfrac{1}{x+${a}}$, quindi $f'(0)=\dfrac{1}{${a}}$. Allora $T_1(x)=\log ${a}+\dfrac{x}{${a}}$.`,
        };
      },
    },
    {
      id: 's10.formula.p1', type: 'num', level: 1,
      prompt: String.raw`Quanto vale $f'''(0)$ per $f(x)=\sin x$?`,
      answer: '-1',
      explain: String.raw`$f'(x)=\cos x$, $f''(x)=-\sin x$, $f'''(x)=-\cos x$. In $0$: $f'''(0)=-1$.`,
    },
    {
      id: 's10.formula.p2', type: 'expr', level: 2,
      prompt: String.raw`Scrivi il polinomio di Taylor di grado $2$ di $f(x)=\dfrac{1}{1-x}$ in $x_0=0$ (senza resto).`,
      answer: '1+x+x^2',
      vars: ['x'],
      explain: String.raw`$f(0)=1$, $f'(x)=\dfrac{1}{(1-x)^2}$ quindi $f'(0)=1$, $f''(x)=\dfrac{2}{(1-x)^3}$ quindi $\dfrac{f''(0)}{2}=1$. Allora $T_2(x)=1+x+x^2$.`,
    },
    {
      id: 's10.formula.p3', type: 'mcq', level: 2,
      prompt: String.raw`Qual è il polinomio di Taylor di grado $2$ di $\cos x$ in $x_0=0$?`,
      options: [
        String.raw`$1-\dfrac{x^2}{2}$`,
        String.raw`$1+\dfrac{x^2}{2}$`,
        String.raw`$1-x^2$`,
        String.raw`$x-\dfrac{x^3}{6}$`,
      ],
      answer: 0,
      explain: String.raw`$f(0)=1$, $f'(0)=0$, $f''(0)=-1$: il coefficiente di $x^2$ è $-\dfrac12$. Il secondo distrattore sbaglia il segno di $f''(0)$. Il terzo dimentica il fattoriale $2!$. Il quarto è lo sviluppo di $\sin x$.`,
    },
    {
      id: 's10.formula.p4', type: 'tf', level: 1,
      prompt: String.raw`Il polinomio di Taylor di grado $n$ di $f$ in $x_0$ dipende solo dai valori di $f$ e delle sue derivate in $x_0$.`,
      answer: true,
      explain: String.raw`Ogni coefficiente è costruito con le derivate in $x_0$. Ciò non garantisce però che il polinomio sia buono lontano da $x_0$: di questo si occupa il resto.`,
    },
    {
      id: 's10.formula.p5', type: 'cloze', level: 2,
      text: String.raw`Il resto di [[0]] richiede che $f$ sia derivabile $n+1$ volte su un intervallo, mentre il resto di [[1]] richiede solo $n$ derivate in $x_0$.`,
      blanks: [
        { options: [String.raw`Lagrange`, String.raw`Peano`], answer: 0 },
        { options: [String.raw`Peano`, String.raw`Lagrange`], answer: 0 },
      ],
      explain: String.raw`Il resto di Lagrange dà una stima quantitativa e chiede una derivata in più. Il resto di Peano è più debole: serve solo che $f$ sia derivabile $n$ volte in $x_0$.`,
    },
    {
      id: 's10.formula.p6', type: 'match', level: 1,
      prompt: String.raw`Abbina ogni termine del polinomio di Taylor al suo grado.`,
      pairs: [
        [String.raw`$f(x_0)$`, String.raw`termine di grado $0$`],
        [String.raw`$f'(x_0)\,(x-x_0)$`, String.raw`termine di grado $1$`],
        [String.raw`$\dfrac{f''(x_0)}{2}\,(x-x_0)^2$`, String.raw`termine di grado $2$`],
      ],
      explain: String.raw`Il grado è l'esponente di $(x-x_0)$: il termine di grado $k$ è $\dfrac{f^{(k)}(x_0)}{k!}(x-x_0)^k$.`,
    },
    {
      id: 's10.formula.p7', type: 'num', level: 2,
      prompt: String.raw`Quanto vale il coefficiente di $(x-2)^2$ nel polinomio di Taylor di grado $2$ di $f(x)=x^3$ in $x_0=2$?`,
      answer: '6',
      explain: String.raw`$f''(x)=6x$, quindi $f''(2)=12$ e il coefficiente è $\dfrac{f''(2)}{2!}=6$.`,
    },
    {
      id: 's10.formula.p8', type: 'order', level: 1,
      prompt: String.raw`Ordina i passi per trovare $T_2$ di $f$ in $x_0$.`,
      steps: [
        String.raw`Calcola $f(x_0)$, $f'(x_0)$ e $f''(x_0)$.`,
        String.raw`Costruisci i coefficienti $\dfrac{f^{(k)}(x_0)}{k!}$ per $k=0,1,2$.`,
        String.raw`Scrivi $T_2(x)=f(x_0)+f'(x_0)(x-x_0)+\dfrac{f''(x_0)}{2}(x-x_0)^2$.`,
      ],
      explain: String.raw`Prima le derivate nel punto, poi i coefficienti, poi la somma con le potenze di $(x-x_0)$.`,
    },
    {
      id: 's10.formula.p9', type: 'expr', level: 3,
      prompt: String.raw`Scrivi il polinomio di Taylor di grado $3$ di $f(x)=x\sin x$ in $x_0=0$ (senza resto).`,
      answer: 'x^2',
      vars: ['x'],
      explain: String.raw`$f(0)=0$, $f'(x)=\sin x+x\cos x$ quindi $f'(0)=0$, $f''(x)=2\cos x-x\sin x$ quindi $\dfrac{f''(0)}{2}=1$, $f'''(x)=-3\sin x-x\cos x$ quindi $f'''(0)=0$. Il polinomio è $x^2$.`,
    },
    {
      id: 's10.formula.p10', type: 'num', level: 2,
      prompt: String.raw`Qual è il coefficiente di $x^4$ nel polinomio di Taylor di grado $4$ di $f(x)=e^{-x}$ in $x_0=0$?`,
      answer: '1/24',
      explain: String.raw`Le derivate di $e^{-x}$ in $0$ valgono $(-1)^k$. Il coefficiente di $x^4$ è $\dfrac{(-1)^4}{4!}=\dfrac{1}{24}$.`,
    },
    {
      id: 's10.formula.p11', type: 'open', level: 2, points: 2,
      prompt: String.raw`Spiega in due righe perché i coefficienti di $T_n$ sono $\dfrac{f^{(k)}(x_0)}{k!}$.`,
      answer: String.raw`$T_n$ deve avere in $x_0$ le stesse derivate di $f$ fino all'ordine $n$. Derivando $k$ volte $\dfrac{f^{(k)}(x_0)}{k!}(x-x_0)^k$ si ottiene $f^{(k)}(x_0)$ in $x_0$, perché le derivate di ordine minore di $k$ si annullano e quella di ordine $k$ vale $k!\cdot\dfrac{f^{(k)}(x_0)}{k!}$.`,
      rubric: [
        'Il polinomio deve avere le stesse derivate di f in x0 fino all\'ordine n',
        'Derivando k volte il termine di grado k si ottiene k! per il coefficiente',
        'Il fattore k! compensa la derivazione',
      ],
    },
  ],
  flashcards: [
    { id: 's10.formula.fc1', kind: 'def', front: String.raw`Polinomio di Taylor di grado $n$ di $f$ in $x_0$`, back: String.raw`$T_n(x)=\displaystyle\sum_{k=0}^{n}\dfrac{f^{(k)}(x_0)}{k!}(x-x_0)^k$, con $f$ derivabile $n$ volte in $x_0$.` },
    { id: 's10.formula.fc2', kind: 'def', front: String.raw`Cosa vuol dire $f(x)=o\big(g(x)\big)$ per $x\to x_0$?`, back: String.raw`Che $\dfrac{f(x)}{g(x)}\to0$: vicino a $x_0$, $f$ è trascurabile rispetto a $g$. Esempio: $x^3=o(x^2)$ per $x\to0$.` },
    { id: 's10.formula.fc3', kind: 'thm', front: String.raw`Formula di Taylor con resto di Peano`, back: String.raw`Se $f$ è derivabile $n$ volte in $x_0$, allora $f(x)=T_n(x)+o\big((x-x_0)^n\big)$ per $x\to x_0$.` },
    { id: 's10.formula.fc4', kind: 'thm', front: String.raw`Formula di Taylor con resto di Lagrange`, back: String.raw`Se $f$ è derivabile $n+1$ volte su un intervallo che contiene $x_0$ e $x$, esiste $c$ tra $x_0$ e $x$ con $f(x)=T_n(x)+\dfrac{f^{(n+1)}(c)}{(n+1)!}(x-x_0)^{n+1}$.` },
    { id: 's10.formula.fc5', kind: 'formula', front: String.raw`Coefficiente di $(x-x_0)^k$ in $T_n$`, back: String.raw`$\dfrac{f^{(k)}(x_0)}{k!}$. Per $k=0$ vale $f(x_0)$.` },
    { id: 's10.formula.fc6', kind: 'metodo', front: String.raw`Come costruire $T_n$ in $x_0$`, back: String.raw`1) Calcola $f^{(k)}(x_0)$ per $k\le n$. 2) Dividi ciascun valore per $k!$. 3) Moltiplica per $(x-x_0)^k$ e somma.` },
    { id: 's10.formula.fc7', kind: 'errore', front: String.raw`Errore tipico nel polinomio di Taylor`, back: String.raw`Dimenticare la traslazione $(x-x_0)$ o il fattoriale $k!$, e valutare le derivate in $x$ invece che in $x_0$.` },
    { id: 's10.formula.fc8', kind: 'thm', front: String.raw`Unicità del polinomio di Taylor`, back: String.raw`Se $f(x)=Q(x)+o\big((x-x_0)^n\big)$ con $Q$ di grado al più $n$, allora $Q=T_n$. Quindi i coefficienti di Peano sono quelli di Taylor.` },
  ],
});

// ===========================================================================
// s10.sviluppi · Sviluppi di Mac Laurin notevoli e di funzioni composte
// ===========================================================================
SKILLS.push({
  id: 's10.sviluppi',
  title: 'Sviluppi notevoli e funzioni composte',
  summary: String.raw`Ricordare gli sviluppi di Mac Laurin notevoli e costruire lo sviluppo di $f(u(x))$, di prodotti e di quozienti fino all'ordine richiesto.`,
  prereq: ['s10.formula'],
  examRefs: ['Appello 11/06/2026 · Es. B', 'Appello 06/07/2026 · Es. B'],
  lessons: [
    {
      id: 's10.sviluppi.L1',
      title: 'La tabella degli sviluppi da ricordare',
      cards: [
        {
          type: 'learn',
          title: 'Gli sviluppi di Mac Laurin',
          body: String.raw`Gli sviluppi in $x_0=0$ si chiamano di **Mac Laurin**: sono le formule di Taylor con $x_0=0$. Si ricavano una volta sola e poi si usano sempre. All'esame si scrivono senza dimostrazione, ma vanno ricordati: quasi ogni limite con gli infinitesimi si risolve riportando le funzioni a questi sviluppi.

Quando scrivi $o(x^n)$, l'esponente $n$ dice fino a dove arriva lo sviluppo: il termine $x^n$ è incluso e il resto è trascurabile rispetto a $x^n$.`,
          plot: { fns: ['log(1+x)', 'x-x^2/2+x^3/3'], x: [-0.9, 2], y: [-2, 1.5] },
        },
        {
          type: 'learn',
          title: 'La tabella',
          body: String.raw`Per $x\to0$:
- $e^x=1+x+\dfrac{x^2}{2}+\dfrac{x^3}{6}+o(x^3)$
- $\sin x=x-\dfrac{x^3}{6}+o(x^3)$ (solo potenze dispari)
- $\cos x=1-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^4)$ (solo potenze pari)
- $\log(1+x)=x-\dfrac{x^2}{2}+\dfrac{x^3}{3}+o(x^3)$
- $\dfrac{1}{1-x}=1+x+x^2+x^3+o(x^3)$
- $(1+x)^\alpha=1+\alpha x+\dfrac{\alpha(\alpha-1)}{2}x^2+o(x^2)$
- $\arctan x=x-\dfrac{x^3}{3}+o(x^3)$
- $\tan x=x+\dfrac{x^3}{3}+o(x^3)$

> Il logaritmo è sempre quello naturale: $\log=\ln$. Lo sviluppo di $\dfrac{1}{1+x}$ si ottiene da $\dfrac{1}{1-x}$ cambiando $x$ in $-x$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\sqrt{1+x}$',
          problem: String.raw`Scrivi $\sqrt{1+x}$ fino a $o(x^2)$.`,
          steps: [
            String.raw`Uso lo sviluppo di $(1+x)^\alpha$ con $\alpha=\dfrac12$, perché $\sqrt{1+x}=(1+x)^{1/2}$.`,
            String.raw`Il coefficiente di $x$ è $\alpha=\dfrac12$.`,
            String.raw`Il coefficiente di $x^2$ è $\dfrac{\alpha(\alpha-1)}{2}=\dfrac{\frac12\cdot\left(-\frac12\right)}{2}=-\dfrac18$.`,
          ],
          result: String.raw`$\sqrt{1+x}=1+\dfrac x2-\dfrac{x^2}{8}+o(x^2)$`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: $\\cos x$ fino a $o(x^5)$',
          problem: String.raw`Scrivi $\cos x$ fino a $o(x^5)$.`,
          steps: [
            String.raw`Lo sviluppo di $\cos x$ contiene solo potenze pari: $1$, $x^2$, $x^4$, \dots`,
            {
              text: String.raw`Il termine in $x^4$ è $\dfrac{x^4}{24}$: il denominatore viene da $4!=24$ e il segno è $+$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale il coefficiente di $x^4$ in $\cos x$?`,
                answer: '1/24',
                explain: String.raw`Il coefficiente di $x^4$ è $\dfrac{f^{(4)}(0)}{4!}$. Per $\cos x$ si ha $f^{(4)}(0)=\cos 0=1$, quindi $\dfrac{1}{24}$.`,
              },
            },
          ],
          result: String.raw`$\cos x=1-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^5)$`,
        },
        {
          type: 'mcq',
          id: 's10.sviluppi.L1.q1',
          level: 1,
          prompt: String.raw`Qual è lo sviluppo di $\arctan x$ fino a $o(x^3)$?`,
          options: [
            String.raw`$x-\dfrac{x^3}{3}+o(x^3)$`,
            String.raw`$x+\dfrac{x^3}{3}+o(x^3)$`,
            String.raw`$x-\dfrac{x^2}{2}+o(x^3)$`,
            String.raw`$x-\dfrac{x^3}{6}+o(x^3)$`,
          ],
          answer: 0,
          explain: String.raw`$\dfrac{d}{dx}\arctan x=\dfrac{1}{1+x^2}=1-x^2+o(x^2)$. Integrando si ottiene $x-\dfrac{x^3}{3}$. Il secondo distrattore sbaglia il segno. Il terzo è lo sviluppo di $\log(1+x)$ fermato al grado sbagliato. Il quarto è lo sviluppo di $\sin x$.`,
        },
        {
          type: 'tf',
          id: 's10.sviluppi.L1.q2',
          level: 1,
          prompt: String.raw`Lo sviluppo di Mac Laurin di $\cos x$ contiene solo potenze pari di $x$.`,
          answer: true,
          explain: String.raw`$\cos$ è una funzione pari, quindi nel suo sviluppo in $0$ compaiono solo potenze pari: $1$, $x^2$, $x^4$, e così via.`,
        },
        {
          type: 'expr',
          id: 's10.sviluppi.L1.q3',
          level: 1,
          prompt: String.raw`Scrivi lo sviluppo di $\log(1+x)$ fino a $o(x^2)$ (senza resto).`,
          answer: 'x-x^2/2',
          vars: ['x'],
          explain: String.raw`Dalla tabella: $\log(1+x)=x-\dfrac{x^2}{2}+o(x^2)$. Il termine di grado $1$ è $x$, quello di grado $2$ è $-\dfrac{x^2}{2}$.`,
        },
        {
          type: 'num',
          id: 's10.sviluppi.L1.q4',
          level: 2,
          prompt: String.raw`Qual è il coefficiente di $x^3$ nello sviluppo di $\arctan x$?`,
          answer: '-1/3',
          explain: String.raw`Dalla tabella $\arctan x=x-\dfrac{x^3}{3}+o(x^3)$: il coefficiente è $-\dfrac13$. Il segno negativo viene dall'integrazione di $1-x^2$.`,
        },
        {
          type: 'expr',
          id: 's10.sviluppi.L1.q5',
          level: 2,
          prompt: String.raw`Scrivi lo sviluppo di $\dfrac{1}{1-x}$ fino a $o(x^3)$ (senza resto).`,
          answer: '1+x+x^2+x^3',
          vars: ['x'],
          explain: String.raw`La serie geometrica dà $\dfrac{1}{1-x}=1+x+x^2+x^3+o(x^3)$: ogni coefficiente vale $1$.`,
        },
        {
          type: 'mcq',
          id: 's10.sviluppi.L1.q6',
          level: 2,
          prompt: String.raw`Qual è lo sviluppo di $\dfrac{1}{1+x}$ fino a $o(x^2)$?`,
          options: [
            String.raw`$1-x+x^2+o(x^2)$`,
            String.raw`$1+x+x^2+o(x^2)$`,
            String.raw`$1-x+o(x^2)$`,
            String.raw`$1+x+o(x^2)$`,
          ],
          answer: 0,
          explain: String.raw`Con $\alpha=-1$ nello sviluppo di $(1+x)^\alpha$: il coefficiente di $x$ è $\alpha=-1$, quello di $x^2$ è $\dfrac{\alpha(\alpha-1)}{2}=1$. Il secondo distrattore ignora il segno. Il terzo dimentica il termine $x^2$. Il quarto ha il segno sbagliato.`,
        },
        {
          type: 'tf',
          id: 's10.sviluppi.L1.q7',
          level: 1,
          prompt: String.raw`Lo sviluppo di Mac Laurin di $\sin x$ contiene solo potenze dispari di $x$.`,
          answer: true,
          explain: String.raw`$\sin$ è dispari: nel suo sviluppo compaiono solo $x$, $x^3$, $x^5$, con coefficienti alternati in segno.`,
        },
      ],
    },
    {
      id: 's10.sviluppi.L2',
      title: 'Funzioni composte, prodotti, quozienti',
      cards: [
        {
          type: 'learn',
          title: 'Sostituire $u$ nello sviluppo',
          body: String.raw`Lo sviluppo di $f(u)$ vale anche quando $u$ è una funzione di $x$ che tende a $0$. Basta scrivere lo sviluppo con $u$ al posto di $x$ e poi sostituire $u=u(x)$.

Attenzione all'**o-piccolo**. Se $u\sim x^k$, cioè $u$ si comporta come $x^k$, allora $o(u^n)=o(x^{kn})$. Per esempio, con $u=x^2$:
$$o(u^3)=o(x^6),\qquad o(u^2)=o(x^4).$$
Sostituendo cambia il grado dei termini e anche quello del resto: bisogna riscriverlo.`,
        },
        {
          type: 'learn',
          title: 'Prodotti e quozienti',
          body: String.raw`Per moltiplicare due sviluppi si moltiplicano i polinomi e si tengono solo i termini fino all'ordine richiesto. Ogni fattore va sviluppato abbastanza da coprire l'ordine finale.

Esempio: $x\sin x=x\left(x-\dfrac{x^3}{6}+o(x^3)\right)=x^2-\dfrac{x^4}{6}+o(x^4)$.

Per un quoziente si sviluppano $\dfrac{1}{1\pm u}$ e poi si moltiplica per il numeratore.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\sin(x^2)$',
          problem: String.raw`Scrivi lo sviluppo di $\sin(x^2)$ fino a $o(x^6)$.`,
          steps: [
            String.raw`Lo sviluppo di $\sin u$ è $u-\dfrac{u^3}{6}+o(u^3)$. Pongo $u=x^2$.`,
            String.raw`$u^3=x^6$, e $o(u^3)=o(x^6)$ perché $u=x^2$.`,
          ],
          result: String.raw`$\sin(x^2)=x^2-\dfrac{x^6}{6}+o(x^6)$`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: prodotto $e^x\sin x$',
          problem: String.raw`Scrivi $e^x\sin x$ fino a $o(x^3)$.`,
          steps: [
            String.raw`Fattori fino a $x^3$: $e^x=1+x+\dfrac{x^2}{2}+\dfrac{x^3}{6}+o(x^3)$ e $\sin x=x-\dfrac{x^3}{6}+o(x^3)$.`,
            String.raw`Moltiplico e tengo i termini fino a $x^3$: $x$ viene da $1\cdot x$; $x^2$ viene da $x\cdot x$; $x^3$ viene da $\dfrac{x^2}{2}\cdot x$ e da $1\cdot\left(-\dfrac{x^3}{6}\right)$.`,
            String.raw`Il coefficiente di $x^3$ è $\dfrac12-\dfrac16=\dfrac13$.`,
          ],
          result: String.raw`$e^x\sin x=x+x^2+\dfrac{x^3}{3}+o(x^3)$`,
        },
        {
          type: 'mcq',
          id: 's10.sviluppi.L2.q1',
          level: 2,
          prompt: String.raw`Qual è lo sviluppo di $e^x\cos x$ fino a $o(x^2)$?`,
          options: [
            String.raw`$1+x+o(x^2)$`,
            String.raw`$1+x+x^2+o(x^2)$`,
            String.raw`$1+x+\dfrac{x^2}{2}+o(x^2)$`,
            String.raw`$1+x-x^2+o(x^2)$`,
          ],
          answer: 0,
          explain: String.raw`$(1+x+\dfrac{x^2}{2})\left(1-\dfrac{x^2}{2}\right)=1+x+0\cdot x^2+o(x^2)$: il termine $x^2$ si annulla. Il secondo distrattore dimentica $-\dfrac{x^2}{2}$ di $\cos x$. Il terzo dimentica $\cos x$. Il quarto ha un errore di segno.`,
        },
        {
          type: 'num',
          id: 's10.sviluppi.L2.q2',
          level: 2,
          prompt: String.raw`Qual è il coefficiente di $x^2$ nello sviluppo di $e^x\sin x$?`,
          answer: '1',
          explain: String.raw`$x^2$ viene dal prodotto $x\cdot x$, con $x$ da $e^x$ e $x$ da $\sin x$. Il coefficiente è $1$.`,
        },
        {
          type: 'expr',
          id: 's10.sviluppi.L2.q3',
          level: 2,
          prompt: String.raw`Scrivi lo sviluppo di $x\sin x$ fino a $o(x^4)$ (senza resto).`,
          answer: 'x^2-x^4/6',
          vars: ['x'],
          explain: String.raw`$x\sin x=x\left(x-\dfrac{x^3}{6}+o(x^3)\right)=x^2-\dfrac{x^4}{6}+o(x^4)$.`,
        },
        {
          type: 'num',
          id: 's10.sviluppi.L2.q4',
          level: 2,
          prompt: String.raw`Qual è il coefficiente di $x^4$ nello sviluppo di $\log(1+x^2)$?`,
          answer: '-1/2',
          explain: String.raw`Con $u=x^2$: $\log(1+u)=u-\dfrac{u^2}{2}+o(u^2)$. Il termine $-\dfrac{u^2}{2}=-\dfrac{x^4}{2}$ dà il coefficiente $-\dfrac12$.`,
        },
        {
          type: 'tf',
          id: 's10.sviluppi.L2.q5',
          level: 2,
          prompt: String.raw`Se $u\sim x^2$ per $x\to0$, allora $o(u^3)=o(x^6)$.`,
          answer: true,
          explain: String.raw`$u\sim x^2$ significa $u/x^2\to1$, quindi $u^3/x^6\to1$. Un infinitesimo rispetto a $u^3$ è quindi trascurabile anche rispetto a $x^6$.`,
        },
        {
          type: 'order',
          id: 's10.sviluppi.L2.q6',
          level: 2,
          prompt: String.raw`Ordina i passi per sviluppare $\sin(x^2)$ fino a $o(x^6)$.`,
          steps: [
            String.raw`Scrivo lo sviluppo di $\sin u$ con $u$ al posto di $x$: $\sin u=u-\dfrac{u^3}{6}+o(u^3)$.`,
            String.raw`Pongo $u=x^2$: $u^3=x^6$ e $o(u^3)=o(x^6)$.`,
            String.raw`Semplifico: $\sin(x^2)=x^2-\dfrac{x^6}{6}+o(x^6)$.`,
          ],
          distractors: [
            String.raw`Moltiplico lo sviluppo di $\sin x$ per se stesso.`,
            String.raw`Tengo $-\dfrac{x^3}{6}$, perché il grado di $x^3$ non cambia con la sostituzione.`,
          ],
          explain: String.raw`Prima si scrive lo sviluppo nella variabile $u$, poi si sostituisce, poi si riscrive il resto. Il grado dei termini cambia con la sostituzione.`,
        },
        {
          type: 'cloze',
          id: 's10.sviluppi.L2.q7',
          level: 2,
          text: String.raw`Per sviluppare $e^{-x^2}$ si pone [[0]] nello sviluppo di $e^u$. Poiché $u^2=x^4$, il resto $o(u^2)$ diventa [[1]].`,
          blanks: [
            { options: [String.raw`$u=-x^2$`, String.raw`$u=x^2$`, String.raw`$u=-x$`], answer: 0 },
            { options: [String.raw`$o(x^4)$`, String.raw`$o(x^2)$`, String.raw`$o(x^3)$`], answer: 0 },
          ],
          explain: String.raw`Con $u=-x^2$ si ha $u^2=x^4$ e il resto diventa $o(x^4)$. Lo sviluppo è $e^{-x^2}=1-x^2+\dfrac{x^4}{2}+o(x^4)$.`,
        },
        {
          type: 'open',
          id: 's10.sviluppi.L2.q8',
          level: 2,
          points: 2,
          prompt: String.raw`Spiega perché in $\sin(x^2)$ il termine $-\dfrac{u^3}{6}$ diventa $-\dfrac{x^6}{6}$, e non $-\dfrac{x^3}{6}$.`,
          answer: String.raw`Perché $u=x^2$, quindi $u^3=(x^2)^3=x^6$: l'esponente di $u$ si moltiplica per quello di $x$. Il termine di grado $3$ in $u$ diventa un termine di grado $6$ in $x$, e il resto $o(u^3)$ diventa $o(x^6)$.`,
          rubric: [
            'Sostituzione u = x^2 nel termine u^3',
            'Potenze: (x^2)^3 = x^6',
            'Il resto cambia: o(u^3) diventa o(x^6)',
          ],
        },
      ],
    },
    {
      id: 's10.sviluppi.L3',
      title: 'Quozienti, ordine necessario e caso d\'esame',
      cards: [
        {
          type: 'learn',
          title: "Quante cifre servono nello sviluppo",
          body: String.raw`Per un quoziente $\dfrac{f(x)}{x^k}$ il denominatore è di ordine $k$. Per calcolare il limite il numeratore va sviluppato **fino a $o(x^k)$**, e il termine di grado $k$ deve comparire. Se lo sviluppo si ferma prima, il termine $x^k$ finisce nel resto e il limite non si vede.

Esempio: $\dfrac{x-\sin x}{x^3}$. Con $\sin x=x-\dfrac{x^3}{6}+o(x^3)$ il numeratore è $\dfrac{x^3}{6}+o(x^3)$, quindi il limite è $\dfrac16$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $1-\\cos(\\log(1+\\sqrt x))$',
          problem: String.raw`Dimostra che $1-\cos\big(\log(1+\sqrt x)\big)=\dfrac x2+o(x)$ per $x\to0^+$.`,
          steps: [
            String.raw`Pongo $t=\sqrt x\to0$. Dallo sviluppo di $\log(1+t)$: $\log(1+t)=t-\dfrac{t^2}{2}+o(t^2)$. Con $t^2=x$: $u:=\log(1+\sqrt x)=\sqrt x-\dfrac x2+o(x)$.`,
            String.raw`Dallo sviluppo di $\cos u$: $1-\cos u=\dfrac{u^2}{2}+o(u^2)$, e $o(u^2)=o(x)$ perché $u^2\sim x$.`,
            String.raw`Calcolo $u^2=\left(\sqrt x-\dfrac x2+o(x)\right)^2=x-x^{3/2}+o(x^{3/2})$.`,
            String.raw`Quindi $1-\cos u=\dfrac{x-x^{3/2}}{2}+o(x)=\dfrac x2+o(x)$, perché $x^{3/2}=o(x)$.`,
          ],
          result: String.raw`$1-\cos\big(\log(1+\sqrt x)\big)=\dfrac x2+o(x)$`,
        },
        {
          type: 'num',
          id: 's10.sviluppi.L3.q1',
          level: 3,
          source: 'Appello 11/06/2026 · Es. B',
          prompt: String.raw`Nello sviluppo $1-\cos\big(\log(1+\sqrt x)\big)=c\,x+o(x)$, quanto vale $c$?`,
          answer: '1/2',
          explain: String.raw`Dallo sviluppo appena visto il termine principale è $\dfrac x2$, quindi $c=\dfrac12$. Il termine $-\dfrac{x^{3/2}}{2}$ è già nel resto $o(x)$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: $\\dfrac{1}{1+x^2}$ fino a $o(x^4)$',
          problem: String.raw`Scrivi $\dfrac{1}{1+x^2}$ fino a $o(x^4)$.`,
          steps: [
            String.raw`Uso $\dfrac{1}{1-t}=1+t+t^2+o(t^2)$ con $t=-x^2$.`,
            {
              text: String.raw`Quindi $\dfrac{1}{1+x^2}=1-x^2+x^4+o(x^4)$: il termine in $x^4$ viene da $t^2=x^4$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale il coefficiente di $x^4$ in $\dfrac{1}{1+x^2}$?`,
                answer: '1',
                explain: String.raw`$t^2=(-x^2)^2=x^4$ ha coefficiente $1$.`,
              },
            },
          ],
          result: String.raw`$\dfrac{1}{1+x^2}=1-x^2+x^4+o(x^4)$`,
        },
        {
          type: 'mcq',
          id: 's10.sviluppi.L3.q2',
          level: 2,
          prompt: String.raw`Per calcolare $\displaystyle\lim_{x\to0}\dfrac{x-\sin x}{x^3}$, fino a quale ordine va sviluppato $\sin x$?`,
          options: [
            String.raw`fino a $o(x^2)$`,
            String.raw`fino a $o(x^3)$`,
            String.raw`fino a $o(x)$, perché $\sin x\sim x$`,
            String.raw`non serve sviluppare $\sin x$`,
          ],
          answer: 1,
          explain: String.raw`Il numeratore è di ordine $3$. Con $o(x^2)$ non si vede il termine $x^3$. Con $o(x)$ si ottiene solo $x-x=0$. Serve lo sviluppo fino a $o(x^3)$, che contiene $-\dfrac{x^3}{6}$.`,
        },
        {
          type: 'expr',
          id: 's10.sviluppi.L3.q3',
          level: 2,
          prompt: String.raw`Scrivi $\dfrac{e^x-1}{x}$ fino a $o(x^2)$ (senza resto).`,
          answer: '1+x/2+x^2/6',
          vars: ['x'],
          explain: String.raw`$e^x-1=x+\dfrac{x^2}{2}+\dfrac{x^3}{6}+o(x^3)$. Dividendo per $x$: $1+\dfrac x2+\dfrac{x^2}{6}+o(x^2)$.`,
        },
        {
          type: 'expr',
          id: 's10.sviluppi.L3.q4',
          level: 3,
          prompt: String.raw`Scrivi $\dfrac{\sin x}{1+x}$ fino a $o(x^3)$ (senza resto).`,
          answer: 'x-x^2+(5/6)*x^3',
          vars: ['x'],
          explain: String.raw`$\sin x=x-\dfrac{x^3}{6}+o(x^3)$ e $\dfrac{1}{1+x}=1-x+x^2+o(x^2)$. Il prodotto fino a $x^3$: $x\cdot(1-x+x^2)-\dfrac{x^3}{6}=x-x^2+\dfrac56x^3$. Gli altri termini sono $o(x^3)$.`,
        },
        {
          type: 'tf',
          id: 's10.sviluppi.L3.q5',
          level: 2,
          prompt: String.raw`Lo sviluppo di $\sqrt{1+x}$ fino a $o(x^2)$ è $1+\dfrac x2-\dfrac{x^2}{8}+o(x^2)$.`,
          answer: true,
          explain: String.raw`Con $\alpha=\dfrac12$ si ottengono i coefficienti $\dfrac12$ e $\dfrac{\frac12\cdot(-\frac12)}{2}=-\dfrac18$.`,
        },
        {
          type: 'mcq',
          id: 's10.sviluppi.L3.q6',
          level: 2,
          prompt: String.raw`Se $f(x)=x+o(x^2)$ e $g(x)=2+o(x)$ per $x\to0$, quale è lo sviluppo di $f\cdot g$?`,
          options: [
            String.raw`$2x+o(x^2)$`,
            String.raw`$2+o(x)$`,
            String.raw`$x+o(x^2)$`,
            String.raw`$2x^2+o(x^2)$`,
          ],
          answer: 0,
          explain: String.raw`$(x+o(x^2))(2+o(x))=2x+x\cdot o(x)+2\,o(x^2)+o(x^2)\,o(x)=2x+o(x^2)$. Il secondo distrattore perde il termine $x$. Il terzo ignora il fattore $2$. Il quarto moltiplica male.`,
        },
        {
          type: 'open',
          id: 's10.sviluppi.L3.q7',
          level: 2,
          points: 2,
          prompt: String.raw`Spiega perché nel quoziente $\dfrac{f(x)}{x^k}$ il numeratore va sviluppato fino a $o(x^k)$ e non di meno.`,
          answer: String.raw`Il limite dipende dai termini di grado al più $k$. Se lo sviluppo del numeratore si ferma prima di $x^k$, il termine di grado $k$ resta nel resto e non si può dire quanto valga il limite. Il termine di grado $k$ è la parte principale del numeratore, e determina il limite.`,
          rubric: [
            'Il limite dipende dai termini di grado al più k',
            'Uno sviluppo fermato prima di x^k non determina il limite',
            'Il termine di grado k è la parte principale del numeratore',
          ],
        },
        {
          type: 'problem',
          id: 's10.sviluppi.L3.q8',
          level: 3,
          source: 'Esercizio di tipo esame',
          points: 3,
          prompt: String.raw`Sia $f(x)=\sqrt{1+\sin x}$. (a) Scrivi $\sin x$ fino a $o(x^2)$. (b) Scrivi $f$ fino a $o(x^2)$ (senza resto).`,
          parts: [
            {
              type: 'expr',
              prompt: String.raw`$\sin x$ fino a $o(x^2)$ (senza resto).`,
              answer: 'x',
              vars: ['x'],
              explain: String.raw`$\sin x=x-\dfrac{x^3}{6}+o(x^3)=x+o(x^2)$, perché $x^3=o(x^2)$.`,
            },
            {
              type: 'expr',
              prompt: String.raw`$f(x)$ fino a $o(x^2)$ (senza resto).`,
              answer: '1+x/2-x^2/8',
              vars: ['x'],
              explain: String.raw`Con $u=\sin x=x+o(x^2)$: $\sqrt{1+u}=1+\dfrac u2-\dfrac{u^2}{8}+o(u^2)$. Qui $\dfrac u2=\dfrac x2+o(x^2)$ e $u^2=x^2+o(x^2)$, quindi $f(x)=1+\dfrac x2-\dfrac{x^2}{8}+o(x^2)$.`,
            },
          ],
          solution: String.raw`(a) $\sin x=x+o(x^2)$. (b) Lo sviluppo di $\sqrt{1+u}$ è $1+\dfrac u2-\dfrac{u^2}{8}+o(u^2)$. Sostituendo $u=x+o(x^2)$ si ottiene $f(x)=1+\dfrac x2-\dfrac{x^2}{8}+o(x^2)$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's10.sviluppi.g1', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'expr',
          prompt: String.raw`Scrivi lo sviluppo di $e^{${H.coef(a)}x^2}$ fino a $o(x^4)$ (senza resto).`,
          answer: `1+(${a})*x^2+(${a * a}/2)*x^4`,
          vars: ['x'],
          explain: String.raw`Con $u=(${a})x^2$: $e^u=1+u+\dfrac{u^2}{2}+o(u^2)$. Il resto $o(u^2)$ è $o(x^4)$. Quindi $1+(${a})x^2+\dfrac{${a * a}}{2}x^4$.`,
        };
      },
    },
    {
      id: 's10.sviluppi.g2', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'expr',
          prompt: String.raw`Scrivi lo sviluppo di $\sin(${H.coef(a)}x)$ fino a $o(x^3)$ (senza resto).`,
          answer: `(${a})*x-(${a ** 3})/6*x^3`,
          vars: ['x'],
          explain: String.raw`Con $u=${H.coef(a)}x$: $\sin u=u-\dfrac{u^3}{6}+o(u^3)$. Si ottiene $u=(${a})x$ e $u^3=(${a ** 3})x^3$, quindi $\sin(${H.coef(a)}x)=(${a})x-\dfrac{(${a ** 3})}{6}x^3+o(x^3)$.`,
        };
      },
    },
    {
      id: 's10.sviluppi.g3', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'expr',
          prompt: String.raw`Scrivi lo sviluppo di $x\cos(${H.coef(a)}x)$ fino a $o(x^3)$ (senza resto).`,
          answer: `x-(${a * a}/2)*x^3`,
          vars: ['x'],
          explain: String.raw`$\cos(${H.coef(a)}x)=1-\dfrac{(${a})^2x^2}{2}+o(x^2)$. Moltiplicando per $x$: $x-\dfrac{${a * a}}{2}x^3+o(x^3)$.`,
        };
      },
    },
    {
      id: 's10.sviluppi.g4', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        const s = a < 0 ? '' : '+';
        return {
          type: 'expr',
          prompt: String.raw`Scrivi lo sviluppo di $\dfrac{1}{1${s}${H.coef(a)}x}$ fino a $o(x^2)$ (senza resto).`,
          answer: `1-(${a})*x+(${a * a})*x^2`,
          vars: ['x'],
          explain: String.raw`Dallo sviluppo di $\dfrac{1}{1+t}=1-t+t^2+o(t^2)$ con $t=(${a})x$: $1-(${a})x+(${a * a})x^2+o(x^2)$.`,
        };
      },
    },
    {
      id: 's10.sviluppi.p1', type: 'num', level: 1,
      prompt: String.raw`Qual è il coefficiente di $x^4$ nello sviluppo di $\cos x$?`,
      answer: '1/24',
      explain: String.raw`Dalla tabella $\cos x=1-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^4)$.`,
    },
    {
      id: 's10.sviluppi.p2', type: 'expr', level: 2,
      prompt: String.raw`Scrivi lo sviluppo di $\sqrt{1+x}$ fino a $o(x^2)$ (senza resto).`,
      answer: '1+x/2-x^2/8',
      vars: ['x'],
      explain: String.raw`Con $\alpha=\dfrac12$: $1+\dfrac12x+\dfrac{\frac12(\frac12-1)}{2}x^2=1+\dfrac x2-\dfrac{x^2}{8}$.`,
    },
    {
      id: 's10.sviluppi.p3', type: 'mcq', level: 2,
      prompt: String.raw`Qual è lo sviluppo di $\cos(x^2)$ fino a $o(x^4)$?`,
      options: [
        String.raw`$1-\dfrac{x^4}{2}+o(x^4)$`,
        String.raw`$1-\dfrac{x^2}{2}+o(x^4)$`,
        String.raw`$1-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^4)$`,
        String.raw`$1-x^4+o(x^4)$`,
      ],
      answer: 0,
      explain: String.raw`Con $u=x^2$: $\cos u=1-\dfrac{u^2}{2}+o(u^2)$, e $u^2=x^4$. Il secondo distrattore dimentica la composizione. Il terzo copia lo sviluppo di $\cos x$ senza sostituire. Il quarto sbaglia il coefficiente.`,
    },
    {
      id: 's10.sviluppi.p4', type: 'expr', level: 2,
      prompt: String.raw`Scrivi lo sviluppo di $e^x\cos x$ fino a $o(x^2)$ (senza resto).`,
      answer: '1+x',
      vars: ['x'],
      explain: String.raw`Il termine $x^2$ si annulla: $\dfrac{x^2}{2}-\dfrac{x^2}{2}=0$.`,
    },
    {
      id: 's10.sviluppi.p5', type: 'num', level: 2,
      prompt: String.raw`Qual è il coefficiente di $x^3$ nello sviluppo di $x\log(1+x)$?`,
      answer: '-1/2',
      explain: String.raw`$x\log(1+x)=x\left(x-\dfrac{x^2}{2}+\dfrac{x^3}{3}\right)=x^2-\dfrac{x^3}{2}+\dfrac{x^4}{3}$: il coefficiente di $x^3$ è $-\dfrac12$.`,
    },
    {
      id: 's10.sviluppi.p6', type: 'order', level: 2,
      prompt: String.raw`Ordina i passi per sviluppare $\log(1+x^2)$ fino a $o(x^4)$.`,
      steps: [
        String.raw`Scrivo $\log(1+u)=u-\dfrac{u^2}{2}+o(u^2)$.`,
        String.raw`Pongo $u=x^2$ e noto che $o(u^2)=o(x^4)$.`,
        String.raw`Ottengo $\log(1+x^2)=x^2-\dfrac{x^4}{2}+o(x^4)$.`,
      ],
      explain: String.raw`Prima lo sviluppo nella variabile $u$, poi la sostituzione, poi il resto riscritto nella variabile $x$.`,
    },
    {
      id: 's10.sviluppi.p7', type: 'tf', level: 1,
      prompt: String.raw`Lo sviluppo di Mac Laurin di $\sin x$ contiene solo potenze dispari di $x$.`,
      answer: true,
      explain: String.raw`$\sin$ è una funzione dispari: il suo sviluppo in $0$ contiene solo potenze dispari.`,
    },
    {
      id: 's10.sviluppi.p8', type: 'match', level: 1,
      prompt: String.raw`Abbina ogni funzione al suo sviluppo fino a $o(x^3)$.`,
      pairs: [
        [String.raw`$\cos x$`, String.raw`$1-\dfrac{x^2}{2}+o(x^3)$`],
        [String.raw`$\log(1+x)$`, String.raw`$x-\dfrac{x^2}{2}+\dfrac{x^3}{3}+o(x^3)$`],
        [String.raw`$\dfrac{1}{1-x}$`, String.raw`$1+x+x^2+x^3+o(x^3)$`],
      ],
      explain: String.raw`Il coseno ha solo potenze pari, il logaritmo ha coefficienti $1,-\dfrac12,\dfrac13$, la serie geometrica ha tutti i coefficienti uguali a $1$.`,
    },
    {
      id: 's10.sviluppi.p9', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{e^x-1-x}{x^2}$.`,
      answer: '1/2',
      explain: String.raw`$e^x-1-x=\dfrac{x^2}{2}+o(x^2)$, quindi il limite è $\dfrac12$.`,
    },
    {
      id: 's10.sviluppi.p10', type: 'open', level: 2, points: 2,
      prompt: String.raw`Perché per $\cos(x^2)$ il resto $o(u^2)$ diventa $o(x^4)$ e non resta $o(x^2)$?`,
      answer: String.raw`Perché $u=x^2$ e $u^2=x^4$. Un infinitesimo rispetto a $u^2$ è trascurabile rispetto a $x^4$, perché il suo ordine si moltiplica per quello della sostituzione.`,
      rubric: [
        'Il resto è o(u^2) con u = x^2',
        'u^2 = x^4, quindi o(u^2) = o(x^4)',
        'Il grado del resto cambia con la sostituzione',
      ],
    },
    {
      id: 's10.sviluppi.p11', type: 'expr', level: 3,
      prompt: String.raw`Scrivi $\dfrac{\sin x}{1+x}$ fino a $o(x^3)$ (senza resto).`,
      answer: 'x-x^2+(5/6)*x^3',
      vars: ['x'],
      explain: String.raw`Dalla tabella e dalla serie geometrica con $t=-x$: $\dfrac{\sin x}{1+x}=\left(x-\dfrac{x^3}{6}\right)(1-x+x^2)+o(x^3)=x-x^2+\dfrac56x^3+o(x^3)$.`,
    },
  ],
  flashcards: [
    { id: 's10.sviluppi.fc1', kind: 'formula', front: String.raw`Sviluppo di Mac Laurin di $e^x$`, back: String.raw`$1+x+\dfrac{x^2}{2}+\dots+\dfrac{x^n}{n!}+o(x^n)$` },
    { id: 's10.sviluppi.fc2', kind: 'formula', front: String.raw`Sviluppo di $\sin x$`, back: String.raw`$x-\dfrac{x^3}{6}+o(x^3)$: solo potenze dispari.` },
    { id: 's10.sviluppi.fc3', kind: 'formula', front: String.raw`Sviluppo di $\cos x$`, back: String.raw`$1-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^4)$: solo potenze pari.` },
    { id: 's10.sviluppi.fc4', kind: 'formula', front: String.raw`Sviluppo di $\log(1+x)$`, back: String.raw`$x-\dfrac{x^2}{2}+\dfrac{x^3}{3}+o(x^3)$. In generale il termine di grado $k$ è $\dfrac{(-1)^{k+1}}{k}x^k$.` },
    { id: 's10.sviluppi.fc5', kind: 'formula', front: String.raw`Sviluppo di $(1+x)^\alpha$`, back: String.raw`$1+\alpha x+\dfrac{\alpha(\alpha-1)}{2}x^2+o(x^2)$` },
    { id: 's10.sviluppi.fc6', kind: 'formula', front: String.raw`Sviluppo di $\dfrac{1}{1-x}$ e di $\dfrac{1}{1+x}$`, back: String.raw`$\dfrac{1}{1-x}=1+x+\dots+x^n+o(x^n)$. Cambiando $x$ in $-x$: $\dfrac{1}{1+x}=1-x+x^2-\dots+(-1)^nx^n+o(x^n)$.` },
    { id: 's10.sviluppi.fc7', kind: 'formula', front: String.raw`Sviluppi di $\arctan x$ e $\tan x$`, back: String.raw`$\arctan x=x-\dfrac{x^3}{3}+o(x^3)$; $\tan x=x+\dfrac{x^3}{3}+o(x^3)$.` },
    { id: 's10.sviluppi.fc8', kind: 'metodo', front: String.raw`Come sviluppare $f(u(x))$ con $u\to0$`, back: String.raw`Sviluppa $f(u)$ con la tabella, sostituisci $u=u(x)$, e riscrivi $o(u^n)$ come $o(x^{kn})$ se $u\sim x^k$.` },
    { id: 's10.sviluppi.fc9', kind: 'metodo', front: String.raw`Come sviluppare prodotti e quozienti`, back: String.raw`Prodotto: moltiplica gli sviluppi e tieni i termini fino all'ordine richiesto. Quoziente: sviluppa $\dfrac{1}{1\pm u}$, moltiplica per il numeratore, e sviluppa il numeratore fino a $o(x^k)$ se il denominatore è $x^k$.` },
    { id: 's10.sviluppi.fc10', kind: 'errore', front: String.raw`Errore tipico con le composizioni`, back: String.raw`Scrivere $o(u^3)=o(x^3)$ quando $u=x^2$. Corretto: $o(u^3)=o(x^6)$.` },
    { id: 's10.sviluppi.fc11', kind: 'errore', front: String.raw`Errore tipico nei quozienti`, back: String.raw`Fermarsi a $o(x)$ per $\dfrac{x-\sin x}{x^3}$: così il termine $x^3$ non compare e il limite resta nascosto.` },
  ],
});

// ===========================================================================
// s10.limiti · Limiti e ordini di infinitesimo con Taylor
// ===========================================================================
SKILLS.push({
  id: 's10.limiti',
  title: 'Limiti e ordini di infinitesimo con Taylor',
  summary: String.raw`Calcolare limiti $\frac00$ sviluppando numeratore e denominatore, leggere l'ordine di infinitesimo e la parte principale, evitare la sostituzione sbagliata negli addendi.`,
  prereq: ['s10.sviluppi', 's06.o'],
  examRefs: ['Itinere 11/11/2025 · Es. B', 'Appello 10/02/2026 · Es. B', 'Itinere 15/01/2026 · Es. B', 'Appello 11/06/2026 · Es. B'],
  lessons: [
    {
      id: 's10.limiti.L1',
      title: 'Il limite con lo sviluppo',
      cards: [
        {
          type: 'learn',
          title: 'Il metodo in tre passi',
          body: String.raw`Se il limite di una frazione dà $\dfrac00$, il risultato sta nei **termini principali** di numeratore e denominatore. Il metodo è:

1. trova l'ordine $k$ del denominatore, cioè il grado del suo primo termine non nullo;
2. sviluppa il numeratore **fino a $o(x^k)$**, cioè includi il grado $k$;
3. il limite è il rapporto tra i coefficienti di $x^k$.

Se il numeratore ha ordine maggiore di $k$, il limite è $0$. Se ha ordine minore di $k$, il limite è infinito.`,
        },
        {
          type: 'learn',
          title: 'Equivalenti sì, ma non nelle somme',
          body: String.raw`Nei **prodotti** e nei **quozienti** si possono sostituire le funzioni con i loro equivalenti (per esempio $\sin x\sim x$). Nelle **somme** e nelle **differenze** questo non vale in generale: se i termini principali si annullano, la sostituzione cancella proprio ciò che serve.

Esempio: $\dfrac{\sin x-x}{x^3}$. Sostituendo $\sin x\sim x$ al numeratore si ottiene $\dfrac{0}{x^3}$, cioè $0$: sbagliato! Il limite è $-\dfrac16$, come si vede dallo sviluppo $\sin x-x=-\dfrac{x^3}{6}+o(x^3)$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\dfrac{\\sin x-x}{x^3}$',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{\sin x-x}{x^3}$.`,
          steps: [
            String.raw`Il denominatore è $x^3$, quindi $k=3$: il numeratore va sviluppato fino a $o(x^3)$.`,
            String.raw`Dallo sviluppo di $\sin x$: $\sin x-x=-\dfrac{x^3}{6}+o(x^3)$.`,
            String.raw`Quindi $\dfrac{\sin x-x}{x^3}=-\dfrac16+\dfrac{o(x^3)}{x^3}\to-\dfrac16$.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to0}\dfrac{\sin x-x}{x^3}=-\dfrac16$`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: $\\dfrac{1-\\cos x}{x^2}$',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{1-\cos x}{x^2}$.`,
          steps: [
            String.raw`Il denominatore è $x^2$, quindi $k=2$: il numeratore va sviluppato fino a $o(x^2)$.`,
            {
              text: String.raw`Dallo sviluppo di $\cos x$: $1-\cos x=\dfrac{x^2}{2}+o(x^2)$. Il coefficiente di $x^2$ è quindi $\dfrac12$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale il coefficiente di $x^2$ in $1-\cos x$?`,
                answer: '1/2',
                explain: String.raw`$\cos x=1-\dfrac{x^2}{2}+o(x^2)$, quindi $1-\cos x=\dfrac{x^2}{2}+o(x^2)$: coefficiente $\dfrac12$.`,
              },
            },
            String.raw`Il rapporto dei coefficienti di $x^2$ dà il limite.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to0}\dfrac{1-\cos x}{x^2}=\dfrac12$`,
        },
        {
          type: 'mcq',
          id: 's10.limiti.L1.q1',
          level: 1,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to0}\dfrac{x-\sin x}{x^2}$?`,
          options: [
            String.raw`$0$`,
            String.raw`$\dfrac16$`,
            String.raw`$+\infty$`,
            String.raw`$1$`,
          ],
          answer: 0,
          explain: String.raw`$x-\sin x=\dfrac{x^3}{6}+o(x^3)$: il numeratore è di ordine $3$ e il denominatore di ordine $2$, quindi il rapporto tende a $0$. Il secondo distrattore prende il coefficiente del numeratore e dimentica il grado. Il terzo immagina un numeratore di ordine più basso. Il quarto nasce dalla sostituzione $\sin x\sim x$, che qui non dà nulla di utile.`,
        },
        {
          type: 'num',
          id: 's10.limiti.L1.q2',
          level: 2,
          source: 'Itinere 11/11/2025 · Es. B',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{\tan x+\log(1+x^2)}{2x}$.`,
          answer: '1/2',
          explain: String.raw`$\tan x=x+o(x)$ e $\log(1+x^2)=x^2+o(x^2)=o(x)$. Il numeratore è $x+o(x)$, quindi il rapporto con $2x$ tende a $\dfrac12$.`,
        },
        {
          type: 'num',
          id: 's10.limiti.L1.q3',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{\sin x-x\cos x}{x^3}$.`,
          answer: '1/3',
          explain: String.raw`$\sin x-x\cos x=\left(x-\dfrac{x^3}{6}\right)-x\left(1-\dfrac{x^2}{2}\right)+o(x^3)=\dfrac{x^3}{3}+o(x^3)$. Il limite è $\dfrac13$.`,
        },
        {
          type: 'tf',
          id: 's10.limiti.L1.q4',
          level: 2,
          prompt: String.raw`Per calcolare $\displaystyle\lim_{x\to0}\dfrac{\sin x-x}{x^3}$ si può sostituire $\sin x$ con $x$ al numeratore.`,
          answer: false,
          explain: String.raw`Sostituendo si ottiene $\dfrac{x-x}{x^3}=0$, che non è il limite. Il limite è $-\dfrac16$: la sostituzione annulla proprio il termine $-\dfrac{x^3}{6}$ che lo determina.`,
        },
        {
          type: 'num',
          id: 's10.limiti.L1.q5',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{e^x-1-x-\frac{x^2}{2}}{x^3}$.`,
          answer: '1/6',
          explain: String.raw`$e^x-1-x-\dfrac{x^2}{2}=\dfrac{x^3}{6}+o(x^3)$: il limite è $\dfrac16$.`,
        },
        {
          type: 'problem',
          id: 's10.limiti.L1.q6',
          level: 2,
          source: 'Esercizio di tipo esame',
          points: 3,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{\cos x-e^{-x^2/2}}{x^4}$.`,
          parts: [
            {
              type: 'expr',
              prompt: String.raw`Sviluppo di $\cos x$ fino a $o(x^4)$ (senza resto).`,
              answer: '1-x^2/2+x^4/24',
              vars: ['x'],
              explain: String.raw`$\cos x=1-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^4)$.`,
            },
            {
              type: 'expr',
              prompt: String.raw`Sviluppo di $e^{-x^2/2}$ fino a $o(x^4)$ (senza resto).`,
              answer: '1-x^2/2+x^4/8',
              vars: ['x'],
              explain: String.raw`Con $u=-\dfrac{x^2}{2}$: $e^u=1+u+\dfrac{u^2}{2}+o(u^2)$. Qui $u^2=\dfrac{x^4}{4}$, quindi $1-\dfrac{x^2}{2}+\dfrac{x^4}{8}$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Il limite $\displaystyle\lim_{x\to0}\dfrac{\cos x-e^{-x^2/2}}{x^4}$.`,
              answer: '-1/12',
              explain: String.raw`Il numeratore è $\left(\dfrac{x^4}{24}\right)-\left(\dfrac{x^4}{8}\right)+o(x^4)=-\dfrac{x^4}{12}+o(x^4)$, perché i termini in $x^2$ si cancellano. Il limite è $-\dfrac{1}{12}$.`,
            },
          ],
          solution: String.raw`Il numeratore ha sviluppo $\left(1-\dfrac{x^2}{2}+\dfrac{x^4}{24}\right)-\left(1-\dfrac{x^2}{2}+\dfrac{x^4}{8}\right)+o(x^4)=-\dfrac{x^4}{12}+o(x^4)$. Dividendo per $x^4$ si ottiene $-\dfrac{1}{12}$.`,
        },
        {
          type: 'num',
          id: 's10.limiti.L1.q7',
          level: 2,
          source: 'Itinere 11/11/2025 · Es. B',
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to+\infty}n\left(\sqrt{1+\dfrac1n}-1\right)$.`,
          answer: '1/2',
          explain: String.raw`Con $t=\dfrac1n\to0$: $\sqrt{1+t}=1+\dfrac t2+o(t)$. Quindi $n\left(\dfrac{1}{2n}+o\left(\dfrac1n\right)\right)\to\dfrac12$.`,
        },
      ],
    },
    {
      id: 's10.limiti.L2',
      title: 'Ordine di infinitesimo e parte principale',
      cards: [
        {
          type: 'learn',
          title: 'Ordine e parte principale',
          body: String.raw`Un infinitesimo $f$ per $x\to0$ ha **ordine** $k$ se $f(x)=c\,x^k+o(x^k)$ con $c\neq0$. Il termine $c\,x^k$ è la **parte principale**. Per trovarlo basta lo sviluppo: l'ordine è il grado del primo termine non nullo.

Esempi: $1-\cos x=\dfrac{x^2}{2}+o(x^2)$ ha ordine $2$ e parte principale $\dfrac{x^2}{2}$. Il $\sin x-x=-\dfrac{x^3}{6}+o(x^3)$ ha ordine $3$ e parte principale $-\dfrac{x^3}{6}$.`,
        },
        {
          type: 'learn',
          title: 'Cancellazioni e ordini',
          body: String.raw`Gli ordini si combinano così:
- **somma**: se gli ordini sono diversi vince quello più basso: $x^2+x^3$ ha ordine $2$;
- **prodotto**: gli ordini si sommano: $x^2\cdot x^3=x^5$ ha ordine $5$;
- **differenza con la stessa parte principale**: i primi termini si cancellano e l'ordine può salire. Per esempio $\sin^2x-x^2$ ha ordine $4$, non $2$.

Per questo, quando la parte principale si annulla, bisogna sviluppare più a fondo.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: ordine di $\\sin^2x-x^2$',
          problem: String.raw`Di che ordine è l'infinitesimo $\sin^2x-x^2$ per $x\to0$?`,
          steps: [
            String.raw`Dallo sviluppo $\sin x=x-\dfrac{x^3}{6}+o(x^3)$ si ottiene $\sin^2x=\left(x-\dfrac{x^3}{6}\right)^2+o(x^4)=x^2-\dfrac{x^4}{3}+o(x^4)$.`,
            String.raw`Quindi $\sin^2x-x^2=-\dfrac{x^4}{3}+o(x^4)$: i termini in $x^2$ si cancellano.`,
            String.raw`Il primo termine non nullo è in $x^4$: l'ordine è $4$ e la parte principale è $-\dfrac{x^4}{3}$.`,
          ],
          result: String.raw`$\sin^2x-x^2=-\dfrac{x^4}{3}+o(x^4)$: ordine $4$`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: ordine di $e^x-1-x$',
          problem: String.raw`Di che ordine è l'infinitesimo $e^x-1-x$ per $x\to0$? Trova anche la parte principale.`,
          steps: [
            String.raw`Dallo sviluppo di $e^x$: $e^x=1+x+\dfrac{x^2}{2}+o(x^2)$.`,
            {
              text: String.raw`Quindi $e^x-1-x=\dfrac{x^2}{2}+o(x^2)$: il primo termine non nullo ha grado $2$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Di che ordine è $e^x-1-x$ per $x\to0$?`,
                answer: '2',
                explain: String.raw`Costante e termine in $x$ si cancellano, il primo termine non nullo è $\dfrac{x^2}{2}$: ordine $2$.`,
              },
            },
            String.raw`La parte principale è $\dfrac{x^2}{2}$.`,
          ],
          result: String.raw`$e^x-1-x=\dfrac{x^2}{2}+o(x^2)$: ordine $2$, parte principale $\dfrac{x^2}{2}$`,
        },
        {
          type: 'mcq',
          id: 's10.limiti.L2.q1',
          level: 1,
          prompt: String.raw`Di che ordine è l'infinitesimo $\tan x-x$ per $x\to0$?`,
          options: [
            String.raw`$1$`,
            String.raw`$2$`,
            String.raw`$3$`,
            String.raw`$4$`,
          ],
          answer: 2,
          explain: String.raw`$\tan x=x+\dfrac{x^3}{3}+o(x^3)$, quindi $\tan x-x=\dfrac{x^3}{3}+o(x^3)$: ordine $3$. Il grado $1$ è sbagliato: il termine $x$ si cancella. Il grado $2$ è sbagliato perché non c'è un termine $x^2$ nello sviluppo di $\tan x$.`,
        },
        {
          type: 'num',
          id: 's10.limiti.L2.q2',
          level: 2,
          prompt: String.raw`Di che ordine è l'infinitesimo $1-\cos x-\dfrac{x^2}{2}$ per $x\to0$?`,
          answer: '4',
          explain: String.raw`$\cos x=1-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^4)$, quindi $1-\cos x-\dfrac{x^2}{2}=-\dfrac{x^4}{24}+o(x^4)$: ordine $4$.`,
        },
        {
          type: 'expr',
          id: 's10.limiti.L2.q3',
          level: 2,
          prompt: String.raw`Scrivi la parte principale di $\sqrt{1+x}-1-\dfrac x2$ per $x\to0$.`,
          answer: '-x^2/8',
          vars: ['x'],
          explain: String.raw`$\sqrt{1+x}=1+\dfrac x2-\dfrac{x^2}{8}+o(x^2)$, quindi $\sqrt{1+x}-1-\dfrac x2=-\dfrac{x^2}{8}+o(x^2)$. La parte principale è $-\dfrac{x^2}{8}$.`,
        },
        {
          type: 'tf',
          id: 's10.limiti.L2.q4',
          level: 2,
          prompt: String.raw`Se $f$ ha ordine $2$ e $g$ ha ordine $3$ per $x\to0$, allora $f+g$ ha ordine $2$ con la stessa parte principale di $f$.`,
          answer: true,
          explain: String.raw`Nella somma vince il termine di ordine più basso. Il termine di grado $3$ è trascurabile rispetto a $x^2$, quindi la parte principale resta quella di $f$.`,
        },
        {
          type: 'order',
          id: 's10.limiti.L2.q5',
          level: 2,
          prompt: String.raw`Ordina i passi per trovare l'ordine di $1-\cos x-\dfrac{x^2}{2}$.`,
          steps: [
            String.raw`Scrivo lo sviluppo di $\cos x$ fino a $o(x^4)$: $\cos x=1-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^4)$.`,
            String.raw`Sottraggo: $1-\cos x-\dfrac{x^2}{2}=-\dfrac{x^4}{24}+o(x^4)$.`,
            String.raw`Il primo termine non nullo è in $x^4$: ordine $4$, parte principale $-\dfrac{x^4}{24}$.`,
          ],
          distractors: [
            String.raw`Dichiaro ordine $2$ perché compare un termine $x^2$.`,
            String.raw`Sostituisco $\cos x\sim1$ e concludo che la differenza è $0$.`,
          ],
          explain: String.raw`Si sviluppa fino al grado in cui compare un termine non nullo dopo le cancellazioni. Il termine $x^2$ non appare perché si cancella con $\dfrac{x^2}{2}$.`,
        },
        {
          type: 'cloze',
          id: 's10.limiti.L2.q6',
          level: 2,
          text: String.raw`Se $f(x)=c\,x^k+o(x^k)$ con $c\neq0$, allora $f$ è infinitesima di ordine [[0]] e la sua parte principale è [[1]].`,
          blanks: [
            { options: [String.raw`$k$`, String.raw`$k+1$`, String.raw`$c$`], answer: 0 },
            { options: [String.raw`$c\,x^k$`, String.raw`$c$`, String.raw`$x^k$`], answer: 0 },
          ],
          explain: String.raw`L'ordine è l'esponente $k$ del primo termine non nullo. La parte principale è il termine completo $c\,x^k$, non solo il coefficiente.`,
        },
        {
          type: 'open',
          id: 's10.limiti.L2.q7',
          level: 2,
          points: 2,
          prompt: String.raw`Spiega perché $\cos x-1+\dfrac{x^2}{2}$ ha ordine maggiore di $2$, nonostante $\cos x-1$ abbia ordine $2$.`,
          answer: String.raw`Perché il termine di grado $2$ si cancella: $\cos x-1=-\dfrac{x^2}{2}+o(x^2)$, quindi $\cos x-1+\dfrac{x^2}{2}=o(x^2)$. Il primo termine non nullo compare a un grado più alto, $\dfrac{x^4}{24}$. La cancellazione aumenta l'ordine.`,
          rubric: [
            'Il termine di grado 2 si cancella con x^2/2',
            'Il resto è o(x^2), quindi l ordine sale',
            'Il primo termine non nullo è di grado 4',
          ],
        },
      ],
    },
    {
      id: 's10.limiti.L3',
      title: 'Limiti d\'esame con Taylor',
      cards: [
        {
          type: 'learn',
          title: 'Quanti termini servono quando si cancellano',
          body: String.raw`Nei limiti d'esame il denominatore ha spesso ordine alto, perché il numeratore è una differenza con la stessa parte principale. Quando la parte principale si cancella, bisogna sviluppare ciascun addendo fino al primo grado in cui restano diversi.

Se il denominatore è $x^m$, il numeratore va sviluppato fino a $o(x^m)$. Se il denominatore è $x^2$ moltiplicato per una parentesi $P(x)$, basta sviluppare $P(x)$ fino a $o(x^{m-2})$. Non fermarti al primo termine che appare: spesso è uguale nei due addendi e si cancella.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: limite d\'esame con $\\log(1+\\sqrt x)$',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to0^+}\dfrac{x\,\big(1-\cos(\log(1+\sqrt x))\big)}{x-\sin(x+x^2)}$.`,
          steps: [
            String.raw`Numeratore: $1-\cos\big(\log(1+\sqrt x)\big)=\dfrac x2+o(x)$, come visto nella lezione sugli sviluppi composti. Quindi $x\cdot\big(\dots\big)=\dfrac{x^2}{2}+o(x^2)$.`,
            String.raw`Denominatore: $\sin(x+x^2)=(x+x^2)+o(x^2)$, perché $o\big((x+x^2)^2\big)=o(x^2)$. Quindi $x-\sin(x+x^2)=-x^2+o(x^2)$.`,
            String.raw`Rapporto: dividendo numeratore e denominatore per $x^2$ si ottiene $\dfrac{\frac12+o(1)}{-1+o(1)}\to-\dfrac12$.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to0^+}\dfrac{x\,\big(1-\cos(\log(1+\sqrt x))\big)}{x-\sin(x+x^2)}=-\dfrac12$`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: $\\dfrac{f(x)}{\\log(1-x^2)}$',
          problem: String.raw`Sia $f$ derivabile due volte in $0$, con $f(0)=f'(0)=0$ e $f''(0)=1$. Calcola $\displaystyle\lim_{x\to0}\dfrac{f(x)}{\log(1-x^2)}$.`,
          steps: [
            String.raw`Per Taylor con resto di Peano di grado $2$: $f(x)=\dfrac{f''(0)}{2}x^2+o(x^2)=\dfrac{x^2}{2}+o(x^2)$.`,
            {
              text: String.raw`Il denominatore: $\log(1-x^2)=-x^2+o(x^2)$, dallo sviluppo $\log(1+t)=t+o(t)$ con $t=-x^2$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`Scrivi $\log(1-x^2)$ fino a $o(x^2)$ (senza resto).`,
                answer: '-x^2',
                vars: ['x'],
                explain: String.raw`$\log(1+t)=t+o(t)$ con $t=-x^2$: $\log(1-x^2)=-x^2+o(x^2)$.`,
              },
            },
            String.raw`Il rapporto: $\dfrac{\frac{x^2}{2}+o(x^2)}{-x^2+o(x^2)}\to-\dfrac12$.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to0}\dfrac{f(x)}{\log(1-x^2)}=-\dfrac12$`,
        },
        {
          type: 'mcq',
          id: 's10.limiti.L3.q1',
          level: 3,
          source: 'Itinere 15/01/2026 · Es. B',
          prompt: String.raw`Per $x\to0$, qual è l'ordine di $1+x\sin 2x-\cos x$ e la sua parte principale?`,
          options: [
            String.raw`ordine $1$`,
            String.raw`ordine $2$, parte principale $\dfrac{x^2}{2}$`,
            String.raw`ordine $3$`,
            String.raw`ordine $2$, parte principale $\dfrac52x^2$`,
          ],
          answer: 3,
          explain: String.raw`$x\sin 2x=2x^2+o(x^2)$ e $1-\cos x=\dfrac{x^2}{2}+o(x^2)$. La somma è $\dfrac52x^2+o(x^2)$: ordine $2$. Il secondo distrattore dimentica $x\sin 2x$. Il primo e il terzo sbagliano il grado.`,
        },
        {
          type: 'num',
          id: 's10.limiti.L3.q2',
          level: 3,
          source: 'Itinere 15/01/2026 · Es. B',
          prompt: String.raw`Per $x\to0^+$, di che ordine è l'infinitesimo $1+\sqrt{x}\,\sin 2x-\cos x$?`,
          answer: '3/2',
          explain: String.raw`$\sqrt x\,\sin 2x\sim2x^{3/2}$, mentre $1-\cos x\sim\dfrac{x^2}{2}$ è di ordine $2$. Poiché $\dfrac32<2$, domina il primo termine: ordine $\dfrac32$, parte principale $2x^{3/2}$.`,
        },
        {
          type: 'expr',
          id: 's10.limiti.L3.q3',
          level: 3,
          prompt: String.raw`Scrivi la parte principale di $1+\sqrt{x}\,\sin 2x-\cos x$ per $x\to0^+$.`,
          answer: '2*x^(3/2)',
          vars: ['x'],
          explain: String.raw`$\sqrt x\,\sin 2x=\sqrt x\,(2x+o(x))=2x^{3/2}+o(x^{3/2})$. Il termine $1-\cos x$ è di ordine $2$, quindi trascurabile. La parte principale è $2x^{3/2}$.`,
        },
        {
          type: 'tf',
          id: 's10.limiti.L3.q4',
          level: 2,
          prompt: String.raw`Se $f(x)=x^2+o(x^3)$ e $g(x)=x^2+x^3$, allora $\displaystyle\lim_{x\to0}\dfrac{f(x)}{g(x)}=1$.`,
          answer: true,
          explain: String.raw`$\dfrac{f}{g}=\dfrac{x^2+o(x^3)}{x^2(1+x)}=\dfrac{1+o(x)}{1+x}\to1$: il resto $o(x^3)$ diventa $o(x)$ dopo la divisione per $x^2$.`,
        },
        {
          type: 'num',
          id: 's10.limiti.L3.q5',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{\cos x-e^{x^2}}{x^2}$.`,
          answer: '-3/2',
          explain: String.raw`$\cos x=1-\dfrac{x^2}{2}+o(x^2)$ e $e^{x^2}=1+x^2+o(x^2)$. Il numeratore è $-\dfrac{3}{2}x^2+o(x^2)$, quindi il limite è $-\dfrac32$.`,
        },
        {
          type: 'problem',
          id: 's10.limiti.L3.q6',
          level: 3,
          source: 'Appello 10/02/2026 · Es. B',
          points: 4,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0^+}\dfrac{x^4e^x-x^3\log(1+x)-\frac32x^5}{x^2\left(\frac12\sin x^2-1+\cos x\right)}$.`,
          parts: [
            {
              type: 'num',
              prompt: String.raw`Coefficiente di $x^5$ in $x^4e^x-x^3\log(1+x)$.`,
              answer: '3/2',
              explain: String.raw`$x^4e^x=x^4+x^5+\dfrac{x^6}{2}+o(x^6)$ e $x^3\log(1+x)=x^4-\dfrac{x^5}{2}+\dfrac{x^6}{3}+o(x^6)$. Il coefficiente di $x^5$ è $1+\dfrac12=\dfrac32$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Coefficiente di $x^6$ in $x^4e^x-x^3\log(1+x)-\frac32x^5$.`,
              answer: '1/6',
              explain: String.raw`Il termine $x^5$ si cancella con $-\dfrac32x^5$. Restano $x^6$ con coefficiente $\dfrac12-\dfrac13=\dfrac16$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Coefficiente di $x^4$ in $\frac12\sin x^2-1+\cos x$.`,
              answer: '1/24',
              explain: String.raw`$\dfrac12\sin x^2=\dfrac{x^2}{2}+o(x^4)$ non ha termine in $x^4$. $\cos x-1=-\dfrac{x^2}{2}+\dfrac{x^4}{24}+o(x^4)$. I termini in $x^2$ si cancellano e resta $\dfrac{x^4}{24}$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Il valore del limite.`,
              answer: '4',
              explain: String.raw`Numeratore: $\dfrac{x^6}{6}+o(x^6)$. Denominatore: $x^2\left(\dfrac{x^4}{24}+o(x^4)\right)=\dfrac{x^6}{24}+o(x^6)$. Il rapporto è $\dfrac{1/6}{1/24}=4$.`,
            },
          ],
          solution: String.raw`Il numeratore ha sviluppo $\dfrac{x^6}{6}+o(x^6)$, perché i termini in $x^4$ e in $x^5$ si cancellano. Il denominatore è $x^2\left(\dfrac{x^4}{24}+o(x^4)\right)=\dfrac{x^6}{24}+o(x^6)$, perché la parte in $x^2$ dentro la parentesi si annulla. Il limite è $\dfrac{1/6}{1/24}=4$.`,
        },
        {
          type: 'open',
          id: 's10.limiti.L3.q7',
          level: 3,
          points: 2,
          prompt: String.raw`Spiega perché nel numeratore $\sin x-x$ non si può sostituire $\sin x$ con $x$, anche se $\sin x\sim x$.`,
          answer: String.raw`$\sin x\sim x$ dice che la differenza $\sin x-x$ è trascurabile rispetto a $x$: i due addendi hanno la stessa parte principale, che si cancella. Sostituendo, la differenza diventa $0$ e si perde il termine $-\dfrac{x^3}{6}$ che determina il limite. Serve lo sviluppo fino a $o(x^3)$, cioè fino al grado del denominatore.`,
          rubric: [
            'Sin x ~ x non descrive la differenza sin x - x',
            'La parte principale dei due addendi si cancella',
            'Serve lo sviluppo fino al grado del denominatore',
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: 's10.limiti.g1', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{\sin(${H.coef(a)}x)-(${H.coef(a)}x)}{x^3}$.`,
          answer: `${-(a ** 3)}/6`,
          explain: String.raw`Con $u=${H.coef(a)}x$: $\sin u-u=-\dfrac{u^3}{6}+o(u^3)$ e $u^3=(${a})^3x^3$. Il limite è $-\dfrac{(${a})^3}{6}=\dfrac{${-(a ** 3)}}{6}$.`,
        };
      },
    },
    {
      id: 's10.limiti.g2', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{1-\cos(${H.coef(a)}x)}{x^2}$.`,
          answer: `${a * a}/2`,
          explain: String.raw`$1-\cos(${H.coef(a)}x)=\dfrac{(${a})^2x^2}{2}+o(x^2)$. Il limite è $\dfrac{${a * a}}{2}$.`,
        };
      },
    },
    {
      id: 's10.limiti.g3', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{e^{${H.coef(a)}x}-1-(${H.coef(a)}x)}{x^2}$.`,
          answer: `${a * a}/2`,
          explain: String.raw`Con $u=(${a})x$: $e^u-1-u=\dfrac{u^2}{2}+o(u^2)$, e $u^2=(${a * a})x^2$. Il limite è $\dfrac{${a * a}}{2}$.`,
        };
      },
    },
    {
      id: 's10.limiti.g4', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{\tan(${H.coef(a)}x)-(${H.coef(a)}x)}{x^3}$.`,
          answer: `${a ** 3}/3`,
          explain: String.raw`Con $u=${H.coef(a)}x$: $\tan u-u=\dfrac{u^3}{3}+o(u^3)$ e $u^3=(${a})^3x^3$. Il limite è $\dfrac{(${a})^3}{3}=\dfrac{${a ** 3}}{3}$.`,
        };
      },
    },
    {
      id: 's10.limiti.p1', type: 'num', level: 1,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{x^2}{1-\cos x}$.`,
      answer: '2',
      explain: String.raw`$1-\cos x=\dfrac{x^2}{2}+o(x^2)$, quindi il rapporto tende a $2$.`,
    },
    {
      id: 's10.limiti.p2', type: 'mcq', level: 2,
      prompt: String.raw`Di che ordine è l'infinitesimo $\log(1+x^2)-\sin^2x$ per $x\to0$?`,
      options: [
        String.raw`$2$`,
        String.raw`$3$`,
        String.raw`$4$`,
        String.raw`$6$`,
      ],
      answer: 2,
      explain: String.raw`$\log(1+x^2)=x^2-\dfrac{x^4}{2}+o(x^4)$ e $\sin^2x=x^2-\dfrac{x^4}{3}+o(x^4)$. La differenza è $-\dfrac{x^4}{6}+o(x^4)$: ordine $4$. Il grado $2$ dimentica la cancellazione.`,
    },
    {
      id: 's10.limiti.p3', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{e^{x^2}-\cos x}{x^2}$.`,
      answer: '3/2',
      explain: String.raw`$e^{x^2}=1+x^2+o(x^2)$ e $\cos x=1-\dfrac{x^2}{2}+o(x^2)$. Il numeratore è $\dfrac32x^2+o(x^2)$, quindi il limite è $\dfrac32$.`,
    },
    {
      id: 's10.limiti.p4', type: 'expr', level: 2,
      prompt: String.raw`Scrivi la parte principale di $\sqrt{1+2x}-1-x$ per $x\to0$.`,
      answer: '-x^2/2',
      vars: ['x'],
      explain: String.raw`$\sqrt{1+t}=1+\dfrac t2-\dfrac{t^2}{8}+o(t^2)$ con $t=2x$: $\sqrt{1+2x}=1+x-\dfrac{x^2}{2}+o(x^2)$. La parte principale è $-\dfrac{x^2}{2}$.`,
    },
    {
      id: 's10.limiti.p5', type: 'tf', level: 1,
      prompt: String.raw`Se $f\sim g$ per $x\to0$, allora $f-g=o(f)$.`,
      answer: true,
      explain: String.raw`$f\sim g$ significa $f=g(1+o(1))$. Quindi $f-g=g\cdot o(1)$, che è $o(g)$ e dunque $o(f)$.`,
    },
    {
      id: 's10.limiti.p6', type: 'order', level: 2,
      prompt: String.raw`Ordina i passi per calcolare $\displaystyle\lim_{x\to0}\dfrac{\cos x-1}{x^2}$.`,
      steps: [
        String.raw`Sviluppo il numeratore: $\cos x-1=-\dfrac{x^2}{2}+o(x^2)$.`,
        String.raw`Divido per $x^2$: $\dfrac{\cos x-1}{x^2}=-\dfrac12+o(1)$.`,
        String.raw`Passo al limite: il valore è $-\dfrac12$.`,
      ],
      distractors: [
        String.raw`Sostituisco $\cos x\sim1$ al numeratore, ottenendo $0$.`,
        String.raw`Prendo il coefficiente di $x$ nel numeratore come limite.`,
      ],
      explain: String.raw`Il numeratore va sviluppato fino al grado del denominatore. Sostituire $\cos x$ con $1$ annulla il numeratore e fa perdere il limite.`,
    },
    {
      id: 's10.limiti.p7', type: 'num', level: 2,
      prompt: String.raw`Di che ordine è l'infinitesimo $\tan x-\sin x$ per $x\to0$?`,
      answer: '3',
      explain: String.raw`$\tan x=x+\dfrac{x^3}{3}+o(x^3)$ e $\sin x=x-\dfrac{x^3}{6}+o(x^3)$. La differenza è $\dfrac{x^3}{2}+o(x^3)$: ordine $3$.`,
    },
    {
      id: 's10.limiti.p8', type: 'match', level: 1,
      prompt: String.raw`Abbina ogni infinitesimo al suo ordine per $x\to0$.`,
      pairs: [
        [String.raw`$1-\cos x$`, String.raw`ordine $2$`],
        [String.raw`$x-\sin x$`, String.raw`ordine $3$`],
        [String.raw`$e^x-1$`, String.raw`ordine $1$`],
      ],
      explain: String.raw`L'ordine è il grado del primo termine non nullo dello sviluppo: $\dfrac{x^2}{2}$, $\dfrac{x^3}{6}$, $x$.`,
    },
    {
      id: 's10.limiti.p9', type: 'cloze', level: 2,
      text: String.raw`Il limite $\displaystyle\lim_{x\to0}\dfrac{\cos x-1}{x^2}$ vale [[0]], perché il numeratore è di ordine [[1]], come il denominatore.`,
      blanks: [
        { options: [String.raw`$-\dfrac12$`, String.raw`$\dfrac12$`, String.raw`$0$`], answer: 0 },
        { options: [String.raw`$2$`, String.raw`$1$`, String.raw`$3$`], answer: 0 },
      ],
      explain: String.raw`Il numeratore è $-\dfrac{x^2}{2}+o(x^2)$: ordine $2$ e coefficiente $-\dfrac12$. Il denominatore è $x^2$, quindi il limite è $-\dfrac12$.`,
    },
    {
      id: 's10.limiti.p10', type: 'open', level: 2, points: 2,
      prompt: String.raw`Perché per $\dfrac{\sin x-x}{x^3}$ non si può scrivere $\sin x\sim x$ nel numeratore?`,
      answer: String.raw`Perché i due addendi hanno la stessa parte principale $x$, che si cancella. Sostituendo, il numeratore diventa $0$ e si perde il termine $-\dfrac{x^3}{6}$ che determina il limite.`,
      rubric: [
        'La parte principale x si cancella',
        'Sostituendo si perde il termine -x^3/6',
      ],
    },
    {
      id: 's10.limiti.p11', type: 'num', level: 3,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\dfrac{x^2-\sin^2x}{x^4}$.`,
      answer: '1/3',
      explain: String.raw`$\sin^2x=x^2-\dfrac{x^4}{3}+o(x^4)$, quindi $x^2-\sin^2x=\dfrac{x^4}{3}+o(x^4)$. Il limite è $\dfrac13$.`,
    },
  ],
  flashcards: [
    { id: 's10.limiti.fc1', kind: 'metodo', front: String.raw`Limite $\dfrac00$ con Taylor: i passi`, back: String.raw`1) Trova l'ordine $k$ del denominatore. 2) Sviluppa il numeratore fino a $o(x^k)$. 3) Il limite è il rapporto dei coefficienti di $x^k$.` },
    { id: 's10.limiti.fc2', kind: 'errore', front: String.raw`Sostituire un equivalente in una somma`, back: String.raw`Non si può se gli addendi hanno la stessa parte principale: la sostituzione cancella il termine che determina il limite. Esempio: $\sin x-x$ non è $0$ ma $-\dfrac{x^3}{6}+o(x^3)$.` },
    { id: 's10.limiti.fc3', kind: 'formula', front: String.raw`Infinitesimi notevoli come differenze`, back: String.raw`$1-\cos x\sim\dfrac{x^2}{2}$; $\sin x-x\sim-\dfrac{x^3}{6}$; $\tan x-x\sim\dfrac{x^3}{3}$; $e^x-1-x\sim\dfrac{x^2}{2}$.` },
    { id: 's10.limiti.fc4', kind: 'def', front: String.raw`Ordine di un infinitesimo e parte principale`, back: String.raw`$f$ ha ordine $k$ se $f(x)=c\,x^k+o(x^k)$ con $c\neq0$. Il termine $c\,x^k$ è la parte principale.` },
    { id: 's10.limiti.fc5', kind: 'thm', front: String.raw`Limite del rapporto con Taylor`, back: String.raw`Se $f=c\,x^k+o(x^k)$ e $g=d\,x^k+o(x^k)$ con $d\neq0$, allora $\dfrac fg\to\dfrac cd$.` },
    { id: 's10.limiti.fc6', kind: 'metodo', front: String.raw`Ordine di una somma o di una differenza`, back: String.raw`Nella somma vince l'ordine più basso. Se le parti principali si cancellano, l'ordine sale: bisogna sviluppare di più.` },
    { id: 's10.limiti.fc7', kind: 'errore', front: String.raw`Numeratore sviluppato troppo poco`, back: String.raw`Se lo sviluppo si ferma prima di $x^k$, il termine decisivo finisce nel resto $o(x^k)$ e il limite non si vede.` },
    { id: 's10.limiti.fc8', kind: 'metodo', front: String.raw`Ordine di un prodotto`, back: String.raw`Gli ordini si sommano: se $f\sim a\,x^m$ e $g\sim b\,x^n$, allora $fg\sim ab\,x^{m+n}$.` },
  ],
});

// @@END
