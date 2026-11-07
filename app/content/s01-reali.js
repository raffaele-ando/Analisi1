import { H } from '../engine/tex.js';

// Sezione s01 · Insiemi numerici e numeri reali.
// Le skill sono aggiunte in fondo con S.push(...): l'array viene riempito durante il caricamento del modulo.
const S = [];

export default {
  id: 's01',
  title: 'Insiemi numerici e numeri reali',
  subtitle: 'ℕ, ℤ, ℚ, ℝ: induzione, irrazionali, relazioni, sup e inf',
  intro: String.raw`Qui costruisci le fondamenta di tutto il corso: dai numeri naturali ai reali. All'esame servono direttamente in **Parte A** (definizioni, $\sqrt2\notin\Q$, sup e inf con la caratterizzazione con $\varepsilon$) e in **Parte B** (max, min, sup, inf di insiemi definiti da successioni, come $(-1)^n\left(1+\frac1n\right)$ nell'itinere dell'11/11/2025).`,
  skills: S,
};

// ---------------------------------------------------------------------------
// s01.naturali
// ---------------------------------------------------------------------------
S.push({
  id: 's01.naturali',
  title: 'ℕ, ℤ, ℚ, fattoriale, binomio di Newton, induzione',
  summary: String.raw`Saprai usare fattoriale e coefficienti binomiali, sviluppare $(a+b)^n$ e dimostrare formule per induzione.`,
  prereq: ['s00.logica', 's00.algebra'],
  examRefs: [],
  lessons: [
    {
      id: 's01.naturali.L1',
      title: 'Da ℕ a ℚ, e il fattoriale',
      cards: [
        { type: 'learn', title: 'Perché tanti insiemi numerici?',
          body: String.raw`Ogni insieme nasce per risolvere equazioni che il precedente non sa risolvere.

- $\N=\{0,1,2,3,\dots\}$: i **naturali** (alcuni testi partono da $1$; non cambia nulla di sostanziale). $x+3=1$ non ha soluzione in $\N$.
- $\Z=\{\dots,-2,-1,0,1,2,\dots\}$: gli **interi relativi**. $2x=1$ non ha soluzione in $\Z$.
- $\Q=\left\{\frac pq:\ p\in\Z,\ q\in\N,\ q\neq0\right\}$: i **razionali**. $x^2=2$ non ha soluzione in $\Q$ (lo dimostrerai nella prossima skill).

Vale $\N\subset\Z\subset\Q\subset\R$. Si dice che un insieme è **chiuso** rispetto a un'operazione se il risultato resta nell'insieme: $\N$ è chiuso per $+$ e $\cdot$, non per $-$.` },
        { id: 's01.naturali.L1.e1', type: 'mcq', level: 1,
          prompt: String.raw`Qual è il più piccolo insieme numerico in cui l'equazione $3x=-2$ ha soluzione?`,
          options: [String.raw`$\Q$`, String.raw`$\Z$`, String.raw`$\N$`, String.raw`$\R\setminus\Q$`],
          answer: 0,
          explain: String.raw`La soluzione è $x=-\frac23$: è una frazione, quindi sta in $\Q$ ma non in $\Z$ (non è intera) né in $\N$. Non è irrazionale: $\R\setminus\Q$ è sbagliato perché $-\frac23$ è il quoziente di due interi.` },
        { id: 's01.naturali.L1.e2', type: 'tf', level: 1,
          prompt: String.raw`$\N$ è chiuso rispetto alla sottrazione.`,
          answer: false,
          explain: String.raw`Basta un controesempio: $2-5=-3\notin\N$. Per chiudere la sottrazione serve $\Z$.` },
        { id: 's01.naturali.L1.e3', type: 'mcq', level: 1,
          prompt: String.raw`Quali di questi numeri sono razionali? (più risposte)`,
          options: [String.raw`$-3$`, String.raw`$0{,}75$`, String.raw`$\sqrt4$`, String.raw`$\sqrt2$`, String.raw`$\pi$`],
          answer: [0, 1, 2],
          explain: String.raw`$-3=\frac{-3}{1}$, $0{,}75=\frac34$, $\sqrt4=2=\frac21$: tutti quozienti di interi. $\sqrt2$ e $\pi$ sono **irrazionali**: attenzione, $\sqrt4$ "ha la radice" ma vale $2$.` },
        { type: 'learn', title: 'Il fattoriale',
          body: String.raw`>* Per $n\in\N$, $n\geq1$: $\;n! = 1\cdot2\cdot3\cdots n$. Per convenzione $0!=1$.

Esempi: $3!=6$, $4!=24$, $5!=120$.

La proprietà chiave è **ricorsiva**: $(n+1)! = (n+1)\cdot n!$. Serve per semplificare i quozienti: $\frac{7!}{5!}=\frac{7\cdot6\cdot5!}{5!}=42$.

> Significato: $n!$ conta i modi di mettere in fila $n$ oggetti distinti.` },
        { id: 's01.naturali.L1.e4', type: 'num', level: 1,
          prompt: String.raw`Calcola $5!$.`,
          answer: '120',
          explain: String.raw`$5!=1\cdot2\cdot3\cdot4\cdot5=120$.` },
        { type: 'example', title: 'Semplificare un quoziente di fattoriali',
          problem: String.raw`Semplifica $\dfrac{(n+1)!}{(n-1)!}$ per $n\geq1$.`,
          steps: [
            String.raw`Scrivo il fattoriale più grande "srotolandolo" finché compare quello più piccolo: $(n+1)!=(n+1)\cdot n\cdot(n-1)!$.`,
            { text: String.raw`Semplifico $(n-1)!$: resta $n(n+1)$.`,
              ask: { type: 'expr', prompt: String.raw`A cosa si riduce $\dfrac{(n+1)\,n\,(n-1)!}{(n-1)!}$?`, answer: 'n*(n+1)', vars: ['n'], domain: [1, 6],
                explain: String.raw`Il fattore $(n-1)!$ compare sopra e sotto: resta $(n+1)n=n^2+n$.` } },
          ],
          result: String.raw`$\dfrac{(n+1)!}{(n-1)!}=n(n+1)$` },
        { id: 's01.naturali.L1.e5', type: 'num', level: 1,
          prompt: String.raw`Calcola $\dfrac{8!}{6!}$ senza calcolare i fattoriali.`,
          answer: '56',
          explain: String.raw`$8!=8\cdot7\cdot6!$, quindi $\frac{8!}{6!}=8\cdot7=56$. Calcolare $8!=40320$ e $6!=720$ funziona ma è lento: all'esame non hai la calcolatrice.` },
        { id: 's01.naturali.L1.e6', type: 'expr', level: 2,
          prompt: String.raw`Semplifica $\dfrac{(n+2)!}{n!}$ (scrivi un'espressione in $n$).`,
          answer: '(n+1)*(n+2)', vars: ['n'], domain: [1, 6],
          explain: String.raw`$(n+2)!=(n+2)(n+1)\,n!$, quindi il quoziente è $(n+1)(n+2)=n^2+3n+2$. Errore tipico: scrivere $2$ ("$\frac{n+2}{n}$ semplificato"): i fattoriali non si semplificano come frazioni normali.` },
        { id: 's01.naturali.L1.e7', type: 'mcq', level: 2,
          prompt: String.raw`Perché si pone $0!=1$?`,
          options: [
            String.raw`Perché così la regola $(n+1)!=(n+1)\cdot n!$ vale anche per $n=0$: $1!=1\cdot0!$.`,
            String.raw`Perché $0!=0\cdot1=0$, ma si arrotonda a $1$.`,
            String.raw`Perché $0!$ è il prodotto dei numeri da $1$ a $0$, che è $0$.`,
            String.raw`È un errore: $0!$ non è definito.`,
          ],
          answer: 0,
          explain: String.raw`La convenzione $0!=1$ è l'unica coerente con la regola ricorsiva ($1!=1\cdot0!$ impone $0!=1$) e con il conteggio: c'è esattamente un modo di ordinare zero oggetti. Le altre risposte confondono il prodotto vuoto (che vale $1$) con lo zero.` },
        { id: 's01.naturali.L1.e8', type: 'num', level: 2,
          prompt: String.raw`Calcola $\dfrac{10!}{8!\,2!}$.`,
          answer: '45',
          explain: String.raw`$\frac{10!}{8!}=10\cdot9=90$, poi divido per $2!=2$: $45$. È il coefficiente binomiale $\binom{10}{2}$, che vedrai nella prossima lezione.` },
      ],
    },
    {
      id: 's01.naturali.L2',
      title: 'Coefficiente binomiale e triangolo di Tartaglia',
      cards: [
        { type: 'learn', title: 'Il coefficiente binomiale',
          body: String.raw`>* Per $n\in\N$ e $0\le k\le n$: $\displaystyle\binom nk=\frac{n!}{k!\,(n-k)!}$ (si legge "$n$ su $k$").

Significato: $\binom nk$ conta i **sottoinsiemi di $k$ elementi** di un insieme con $n$ elementi (in quanti modi scelgo $k$ oggetti fra $n$, senza badare all'ordine).

Valori da ricordare: $\binom n0=\binom nn=1$, $\binom n1=n$, $\binom n2=\frac{n(n-1)}2$.

**Simmetria**: $\binom nk=\binom n{n-k}$ (scegliere i $k$ che prendo equivale a scegliere gli $n-k$ che lascio).` },
        { type: 'example', title: 'Calcolo rapido',
          problem: String.raw`Calcola $\binom52$.`,
          steps: [
            String.raw`$\binom52=\frac{5!}{2!\,3!}$. Semplifico $3!$: $\frac{5\cdot4\cdot3!}{2\cdot3!}=\frac{5\cdot4}{2}$.`,
            { text: String.raw`$\frac{20}{2}=10$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $\frac{5\cdot4}{2}$?`, answer: '10', explain: String.raw`$20/2=10$.` } },
          ],
          result: String.raw`$\binom52=10$. Trucco: in alto $k$ fattori decrescenti da $n$, in basso $k!$.` },
        { id: 's01.naturali.L2.e1', type: 'num', level: 1,
          prompt: String.raw`Calcola $\binom63$.`,
          answer: '20',
          explain: String.raw`$\binom63=\frac{6\cdot5\cdot4}{3!}=\frac{120}{6}=20$.` },
        { id: 's01.naturali.L2.e2', type: 'num', level: 1,
          prompt: String.raw`Calcola $\binom{10}{8}$ (usa la simmetria).`,
          answer: '45',
          explain: String.raw`$\binom{10}8=\binom{10}2=\frac{10\cdot9}{2}=45$. Calcolarlo con $8$ fattori sopra e $8!$ sotto è corretto ma inutilmente lungo.` },
        { id: 's01.naturali.L2.e3', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $0\le k\le n$ vale $\binom nk=\binom n{n-k}$.`,
          answer: true,
          explain: String.raw`Scambiando $k$ con $n-k$ la formula $\frac{n!}{k!(n-k)!}$ non cambia: i due fattoriali al denominatore si scambiano di posto.` },
        { type: 'learn', title: 'Triangolo di Tartaglia',
          body: String.raw`Disponi i $\binom nk$ in righe ($n=0,1,2,\dots$): ogni numero è la somma dei due sopra di lui.

$$\begin{array}{c} 1\\ 1\quad1\\ 1\quad2\quad1\\ 1\quad3\quad3\quad1\\ 1\quad4\quad6\quad4\quad1 \end{array}$$

>* **Formula di Stifel**: $\binom nk=\binom{n-1}{k-1}+\binom{n-1}{k}$ per $1\le k\le n-1$.

Si dimostra mettendo allo stesso denominatore: $\frac{(n-1)!}{(k-1)!(n-k)!}+\frac{(n-1)!}{k!(n-1-k)!}=\frac{(n-1)!\,(k+n-k)}{k!(n-k)!}=\binom nk$.` },
        { id: 's01.naturali.L2.e4', type: 'tuple', level: 1,
          prompt: String.raw`Scrivi la riga $n=5$ del triangolo di Tartaglia, cioè $\binom5k$ per $k=0,\dots,5$.`,
          labels: ['k=0', 'k=1', 'k=2', 'k=3', 'k=4', 'k=5'],
          answer: ['1', '5', '10', '10', '5', '1'],
          explain: String.raw`Dalla riga $1\;4\;6\;4\;1$ sommo i vicini: $1,\ 1+4,\ 4+6,\ 6+4,\ 4+1,\ 1$, cioè $1\;5\;10\;10\;5\;1$. La riga è simmetrica, come previsto.` },
        { id: 's01.naturali.L2.e5', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $\binom n1$ per $n\geq1$?`,
          options: [String.raw`$n$`, String.raw`$1$`, String.raw`$n-1$`, String.raw`$n!$`],
          answer: 0,
          explain: String.raw`$\binom n1=\frac{n!}{1!\,(n-1)!}=n$: ci sono $n$ modi di scegliere un solo elemento. $1$ è $\binom n0$; $n!$ conta gli ordinamenti, non le scelte.` },
        { id: 's01.naturali.L2.e6', type: 'num', level: 2,
          prompt: String.raw`In quanti modi si possono scegliere $3$ studenti (senza ordine) da un gruppo di $8$?`,
          answer: '56',
          explain: String.raw`Sono i sottoinsiemi di $3$ elementi: $\binom83=\frac{8\cdot7\cdot6}{6}=56$. Se l'ordine contasse sarebbero $8\cdot7\cdot6=336$: dividere per $3!$ elimina gli ordinamenti.` },
        { id: 's01.naturali.L2.e7', type: 'cloze', level: 2,
          prompt: 'Completa la formula di Stifel.',
          text: String.raw`Per $1\le k\le n-1$ vale $\binom nk = $ [[0]] $+$ [[1]].`,
          blanks: [
            { options: [String.raw`$\binom{n-1}{k-1}$`, String.raw`$\binom{n}{k-1}$`, String.raw`$\binom{n-1}{k+1}$`], answer: 0 },
            { options: [String.raw`$\binom{n-1}{k}$`, String.raw`$\binom{n+1}{k}$`, String.raw`$\binom{n}{k+1}$`], answer: 0 },
          ],
          explain: String.raw`Nel triangolo, $\binom nk$ è la somma dei due numeri della riga precedente ($n-1$) nelle posizioni $k-1$ e $k$.` },
        { id: 's01.naturali.L2.e8', type: 'match', level: 2,
          prompt: 'Abbina ogni coefficiente binomiale al suo valore.',
          pairs: [[String.raw`$\binom42$`, '6'], [String.raw`$\binom51$`, '5'], [String.raw`$\binom62$`, '15'], [String.raw`$\binom53$`, '10']],
          explain: String.raw`$\binom42=\frac{4\cdot3}2=6$, $\binom51=5$, $\binom62=\frac{6\cdot5}2=15$, $\binom53=\binom52=10$.` },
      ],
    },
    {
      id: 's01.naturali.L3',
      title: 'Il binomio di Newton',
      cards: [
        { type: 'learn', title: 'La formula',
          body: String.raw`>* **Binomio di Newton**: per ogni $a,b\in\R$ e $n\in\N$
$$(a+b)^n=\sum_{k=0}^{n}\binom nk a^{n-k}b^k.$$

I coefficienti sono la riga $n$ del triangolo di Tartaglia. Esempi:
- $(a+b)^2=a^2+2ab+b^2$ (riga $1\;2\;1$);
- $(a+b)^3=a^3+3a^2b+3ab^2+b^3$ (riga $1\;3\;3\;1$).

>! Errore classico: $(a+b)^n\neq a^n+b^n$. Mancano tutti i termini "misti".

Con $a=b=1$: $\sum_k\binom nk=2^n$ (numero di sottoinsiemi di un insieme con $n$ elementi).` },
        { type: 'example', title: 'Sviluppare $(x+2)^3$',
          problem: String.raw`Sviluppa $(x+2)^3$.`,
          steps: [
            String.raw`Coefficienti della riga $3$: $1,3,3,1$. Con $a=x$, $b=2$: $x^3+3\cdot x^2\cdot2+3\cdot x\cdot2^2+2^3$.`,
            { text: String.raw`Il termine in $x$ è $3\cdot x\cdot4=12x$.`,
              ask: { type: 'num', prompt: String.raw`Qual è il coefficiente di $x$ in $(x+2)^3$?`, answer: '12', explain: String.raw`$\binom31\cdot x\cdot2^2=3\cdot4\,x=12x$.` } },
          ],
          result: String.raw`$(x+2)^3=x^3+6x^2+12x+8$` },
        { id: 's01.naturali.L3.e1', type: 'num', level: 1,
          prompt: String.raw`Qual è il coefficiente di $x^2$ nello sviluppo di $(x-1)^4$?`,
          answer: '6',
          explain: String.raw`Il termine con $x^2$ ha $k=2$: $\binom42x^2(-1)^2=6x^2$. Il segno è $+$ perché $(-1)^2=1$.` },
        { id: 's01.naturali.L3.e2', type: 'num', level: 2,
          prompt: String.raw`Qual è il coefficiente di $x^2$ nello sviluppo di $(1+2x)^5$?`,
          answer: '40',
          explain: String.raw`Il termine generale è $\binom5k(2x)^k$. Per $k=2$: $\binom52\cdot2^2x^2=10\cdot4\,x^2=40x^2$. Errore tipico: dimenticare di elevare il $2$ e rispondere $10$.` },
        { id: 's01.naturali.L3.e3', type: 'num', level: 2,
          prompt: String.raw`Qual è il coefficiente di $x^4$ nello sviluppo di $(x-2)^6$?`,
          answer: '60',
          explain: String.raw`Termine generale $\binom6kx^{6-k}(-2)^k$. Serve $6-k=4$, cioè $k=2$: $\binom62(-2)^2=15\cdot4=60$.` },
        { id: 's01.naturali.L3.e4', type: 'mcq', level: 2,
          prompt: String.raw`Qual è il termine indipendente da $x$ nello sviluppo di $\left(x+\frac1x\right)^6$?`,
          options: ['$20$', '$15$', '$1$', '$6$'],
          answer: 0,
          explain: String.raw`Termine generale $\binom6kx^{6-k}x^{-k}=\binom6kx^{6-2k}$. È costante se $6-2k=0$, cioè $k=3$: $\binom63=20$. $15=\binom62$ viene da un $k$ sbagliato; $1$ sarebbe giusto solo se si confondesse "termine indipendente" con il primo termine.` },
        { id: 's01.naturali.L3.e5', type: 'num', level: 1,
          prompt: String.raw`Quanto vale $\displaystyle\sum_{k=0}^{7}\binom7k$?`,
          answer: '128',
          explain: String.raw`È $(1+1)^7=2^7=128$ per il binomio di Newton con $a=b=1$.` },
        { id: 's01.naturali.L3.e6', type: 'tf', level: 2,
          prompt: String.raw`Per ogni $n\geq1$ vale $\displaystyle\sum_{k=0}^{n}(-1)^k\binom nk=0$.`,
          answer: true,
          explain: String.raw`Con $a=1$, $b=-1$ il binomio di Newton dà $(1-1)^n=0^n=0$ per $n\geq1$. (Per $n=0$ la somma vale $1$.)` },
        { id: 's01.naturali.L3.e7', type: 'mcq', level: 1,
          prompt: String.raw`Quali sono i coefficienti dello sviluppo di $(a+b)^4$?`,
          options: [String.raw`$1,\ 4,\ 6,\ 4,\ 1$`, String.raw`$1,\ 4,\ 4,\ 1$`, String.raw`$1,\ 1$`, String.raw`$1,\ 3,\ 3,\ 1$`],
          answer: 0,
          explain: String.raw`È la riga $n=4$ di Tartaglia: $\binom4k$ per $k=0,\dots,4$. Sono $n+1=5$ termini; $1,3,3,1$ è la riga di $(a+b)^3$; $1,1$ corrisponde all'errore $(a+b)^4=a^4+b^4$.` },
        { id: 's01.naturali.L3.e8', type: 'num', level: 2,
          prompt: String.raw`Qual è il coefficiente di $x^3$ nello sviluppo di $(1+x)^{10}$?`,
          answer: '120',
          explain: String.raw`$\binom{10}3=\frac{10\cdot9\cdot8}{6}=120$.` },
      ],
    },
    {
      id: 's01.naturali.L4',
      title: 'Il principio di induzione',
      cards: [
        { type: 'learn', title: "L'effetto domino",
          body: String.raw`Vuoi dimostrare una proprietà $P(n)$ per **tutti** gli $n\geq n_0$. Non puoi verificarli uno per uno. Ti bastano due cose:

>* **Principio di induzione.** Se (1) **base**: $P(n_0)$ è vera, e (2) **passo induttivo**: per ogni $n\geq n_0$, $P(n)\Rightarrow P(n+1)$, allora $P(n)$ è vera per ogni $n\geq n_0$.

Come i domino: il primo cade, e ognuno che cade fa cadere il successivo.

Nel passo induttivo **supponi** vera $P(n)$ (ipotesi induttiva) e la **usi** per ottenere $P(n+1)$.

>! Verificare qualche caso ($n=1,2,3$) non è una dimostrazione.` },
        { type: 'example', title: 'La somma di Gauss',
          problem: String.raw`Dimostra che $1+2+\dots+n=\dfrac{n(n+1)}2$ per ogni $n\geq1$.`,
          steps: [
            String.raw`**Base** ($n=1$): a sinistra $1$, a destra $\frac{1\cdot2}2=1$. Vera.`,
            String.raw`**Ipotesi induttiva**: suppongo $1+\dots+n=\frac{n(n+1)}2$.`,
            String.raw`**Passo**: $1+\dots+n+(n+1)=\frac{n(n+1)}2+(n+1)$ (ho usato l'ipotesi).`,
            { text: String.raw`Raccolgo $(n+1)$: $(n+1)\left(\frac n2+1\right)=\frac{(n+1)(n+2)}2$, che è proprio $P(n+1)$.`,
              ask: { type: 'expr', prompt: String.raw`Scrivi $\frac{n(n+1)}2+(n+1)$ in forma fattorizzata.`, answer: '(n+1)*(n+2)/2', vars: ['n'], domain: [1, 8],
                explain: String.raw`$\frac{n(n+1)+2(n+1)}2=\frac{(n+1)(n+2)}2$: è la formula con $n+1$ al posto di $n$.` } },
          ],
          result: String.raw`Per induzione la formula vale per ogni $n\geq1$.` },
        { id: 's01.naturali.L4.e1', type: 'num', level: 1,
          prompt: String.raw`Calcola $1+2+3+\dots+100$.`,
          answer: '5050',
          explain: String.raw`Con la formula di Gauss: $\frac{100\cdot101}2=5050$.` },
        { id: 's01.naturali.L4.e2', type: 'order', level: 2,
          prompt: String.raw`Riordina la dimostrazione per induzione di $1+3+5+\dots+(2n-1)=n^2$ per $n\geq1$. Scarta i passi sbagliati.`,
          steps: [
            String.raw`Base: per $n=1$ si ha $1=1^2$.`,
            String.raw`Ipotesi induttiva: suppongo $1+3+\dots+(2n-1)=n^2$.`,
            String.raw`Aggiungo il termine successivo: $1+3+\dots+(2n-1)+(2n+1)=n^2+2n+1$, usando l'ipotesi.`,
            String.raw`Poiché $n^2+2n+1=(n+1)^2$, ho ottenuto la formula per $n+1$.`,
            String.raw`Per il principio di induzione la formula vale per ogni $n\geq1$.`,
          ],
          distractors: [
            String.raw`Verifico che vale per $n=1,2,3$: quindi vale per ogni $n$.`,
            String.raw`Suppongo vera la formula per $n+1$ e ne deduco quella per $n$.`,
          ],
          explain: String.raw`Struttura: base → ipotesi → passo (dove si **usa** l'ipotesi) → conclusione. Controllare qualche caso non basta; e il passo va da $n$ a $n+1$, non al contrario.` },
        { id: 's01.naturali.L4.e3', type: 'mcq', level: 1,
          prompt: 'Nel passo induttivo di una dimostrazione per induzione, che cosa si fa?',
          options: [
            String.raw`Si suppone vera $P(n)$ e si dimostra $P(n+1)$.`,
            String.raw`Si suppone vera $P(n+1)$ e si dimostra $P(n)$.`,
            String.raw`Si dimostra $P(n)$ per un $n$ grande.`,
            String.raw`Si suppone vera $P(n)$ per ogni $n$ e si conclude.`,
          ],
          answer: 0,
          explain: String.raw`Il passo è l'implicazione $P(n)\Rightarrow P(n+1)$. Supporre $P(n)$ "per ogni $n$" significherebbe supporre la tesi (ragionamento circolare).` },
        { id: 's01.naturali.L4.e4', type: 'tf', level: 2,
          prompt: String.raw`Se $P(n)\Rightarrow P(n+1)$ per ogni $n\in\N$ ma $P(0)$ è falsa, allora $P(n)$ è falsa per ogni $n$.`,
          answer: false,
          explain: String.raw`Controesempio: $P(n)$: "$n\geq1$". Il passo $n\geq1\Rightarrow n+1\geq1$ è vero, $P(0)$ è falsa, ma $P(1),P(2),\dots$ sono vere. Senza base non si conclude nulla, né in positivo né in negativo.` },
        { type: 'example', title: 'Disuguaglianza di Bernoulli',
          problem: String.raw`Dimostra che $(1+x)^n\geq1+nx$ per ogni $x\geq-1$ e $n\in\N$.`,
          steps: [
            String.raw`**Base** ($n=0$): $1\geq1$. Vera.`,
            String.raw`**Passo**: $(1+x)^{n+1}=(1+x)^n(1+x)$.`,
            { text: String.raw`Per ipotesi $(1+x)^n\geq1+nx$, e moltiplico entrambi i membri per $1+x$ **che è $\geq0$**: $(1+x)^{n+1}\geq(1+nx)(1+x)$.`,
              ask: { type: 'mcq', prompt: String.raw`Perché posso moltiplicare la disuguaglianza per $1+x$ senza cambiarne il verso?`,
                options: [String.raw`Perché $x\geq-1$, quindi $1+x\geq0$.`, String.raw`Perché $n\geq0$.`, String.raw`Perché si può sempre.`],
                answer: 0, explain: String.raw`Moltiplicare per un numero negativo invertirebbe il verso: serve $1+x\geq0$, cioè l'ipotesi $x\geq-1$.` } },
            String.raw`Sviluppo: $(1+nx)(1+x)=1+(n+1)x+nx^2\geq1+(n+1)x$ perché $nx^2\geq0$.`,
          ],
          result: String.raw`$(1+x)^{n+1}\geq1+(n+1)x$: per induzione la disuguaglianza vale per ogni $n$.` },
        { id: 's01.naturali.L4.e5', type: 'num', level: 2,
          prompt: String.raw`Sapendo (si dimostra per induzione) che $\displaystyle\sum_{k=1}^n k^2=\frac{n(n+1)(2n+1)}6$, calcola $1^2+2^2+\dots+10^2$.`,
          answer: '385',
          explain: String.raw`$\frac{10\cdot11\cdot21}{6}=\frac{2310}6=385$.` },
        { id: 's01.naturali.L4.e6', type: 'mcq', level: 2,
          prompt: String.raw`Da quale $n_0$ in poi vale **sempre** $2^n>n^2$?`,
          options: ['$n_0=5$', '$n_0=1$', '$n_0=3$', '$n_0=4$'],
          answer: 0,
          explain: String.raw`Tabella: $n=2$: $4=4$; $n=3$: $8<9$; $n=4$: $16=16$; $n=5$: $32>25$. Vale per $n=0,1$, poi fallisce per $2,3,4$ e da $5$ in poi vale sempre (passo induttivo: $2^{n+1}=2\cdot2^n>2n^2\geq(n+1)^2$ per $n\geq3$).` },
        { id: 's01.naturali.L4.e7', type: 'open', level: 3,
          prompt: String.raw`Dimostra per induzione che $2^n\geq n+1$ per ogni $n\in\N$.`,
          answer: String.raw`**Base** ($n=0$): $2^0=1\geq0+1=1$. Vera.

**Ipotesi induttiva**: per un certo $n$ vale $2^n\geq n+1$.

**Passo**: $2^{n+1}=2\cdot2^n\geq2(n+1)=2n+2\geq n+2$, perché $n\geq0$. Quindi $2^{n+1}\geq(n+1)+1$, cioè vale $P(n+1)$.

**Conclusione**: per il principio di induzione $2^n\geq n+1$ per ogni $n\in\N$.`,
          rubric: ['Verifica corretta del caso base', "Enuncia chiaramente l'ipotesi induttiva", "Nel passo usa l'ipotesi: $2^{n+1}=2\\cdot2^n\\geq2(n+1)$", 'Conclude $2n+2\\geq n+2$ e cita il principio di induzione'] },
      ],
    },
  ],
  practice: [
    { id: 's01.naturali.p.gen-fatt', type: 'gen', level: 1,
      gen: (R) => {
        const n = R.int(5, 10), k = R.int(2, 3);
        let v = 1;
        const f = [];
        for (let j = 0; j < k; j++) { v *= n - j; f.push(n - j); }
        return { type: 'num',
          prompt: String.raw`Calcola $\dfrac{${n}!}{${n - k}!}$.`,
          answer: String(v),
          explain: String.raw`$${n}!=${f.join('\\cdot')}\cdot${n - k}!$, quindi il quoziente è $${f.join('\\cdot')}=${v}$.` };
      } },
    { id: 's01.naturali.p.gen-binom', type: 'gen', level: 1,
      gen: (R) => {
        const n = R.int(5, 10), k = R.int(2, n - 2);
        const kk = Math.min(k, n - k);
        let num = 1, den = 1;
        const f = [];
        for (let j = 0; j < kk; j++) { num *= n - j; den *= j + 1; f.push(n - j); }
        const v = num / den;
        const sym = kk !== k ? String.raw`Per simmetria $\binom{${n}}{${k}}=\binom{${n}}{${kk}}$. ` : '';
        return { type: 'num',
          prompt: String.raw`Calcola $\dbinom{${n}}{${k}}$.`,
          answer: String(v),
          explain: sym + String.raw`$\binom{${n}}{${kk}}=\frac{${f.join('\\cdot')}}{${kk}!}=\frac{${num}}{${den}}=${v}$.` };
      } },
    { id: 's01.naturali.p.gen-coeff', type: 'gen', level: 2,
      gen: (R) => {
        const n = R.int(3, 5), a = R.pick([1, 2, -1, -2, 3]), b = R.pick([1, -1, 2, -2, 3]);
        const k = R.int(1, n - 1);
        const C = [1, 1, 2, 6, 24, 120];
        const bin = C[n] / (C[k] * C[n - k]);
        const v = bin * a ** k * b ** (n - k);
        const pw = (base, e) => (e === 1 ? (base < 0 ? `(${base})` : String(base)) : base < 0 ? `(${base})^{${e}}` : `${base}^{${e}}`);
        const par = (x) => (x < 0 ? `(${x})` : String(x));
        return { type: 'num',
          prompt: String.raw`Qual è il coefficiente di $${k === 1 ? 'x' : `x^{${k}}`}$ nello sviluppo di $(${H.lin(a, b)})^{${n}}$?`,
          answer: String(v),
          explain: String.raw`Termine generale: $\binom{${n}}{j}\,${a === 1 ? 'x^{j}' : `(${H.coef(a)}x)^{j}`}\,${pw(b, 'n-j').replace('n-j', `${n}-j`)}$. Per avere $${k === 1 ? 'x' : `x^{${k}}`}$ serve $j=${k}$: $\binom{${n}}{${k}}\cdot${pw(a, k)}\cdot${pw(b, n - k)}=${bin}\cdot${par(a ** k)}\cdot${par(b ** (n - k))}=${v}$.`,
          hint: String.raw`Scrivi il termine generale $\binom nj(ax)^jb^{n-j}$ e scegli $j$.` };
      } },
    { id: 's01.naturali.p.gen-gauss', type: 'gen', level: 2,
      gen: (R) => {
        const m = R.int(2, 20), N = R.pick([30, 40, 50, 60, 80, 100]);
        const v = (N * (N + 1)) / 2 - ((m - 1) * m) / 2;
        return { type: 'num',
          prompt: String.raw`Calcola $${m}+${m + 1}+\dots+${N}$.`,
          answer: String(v),
          explain: String.raw`È la somma da $1$ a $${N}$ meno la somma da $1$ a $${m - 1}$: $\frac{${N}\cdot${N + 1}}2-\frac{${m - 1}\cdot${m}}2=${(N * (N + 1)) / 2}-${((m - 1) * m) / 2}=${v}$.` };
      } },
    { id: 's01.naturali.p.gen-fattexpr', type: 'gen', level: 2,
      gen: (R) => {
        const k = R.int(1, 3), s = R.int(0, 1);
        // (n+k+s)!/(n+s)!
        const facs = [];
        for (let j = 1; j <= k; j++) facs.push(`(n+${s + j})`);
        const top = `(n+${k + s})!`, bot = s === 0 ? 'n!' : `(n+${s})!`;
        return { type: 'expr',
          prompt: String.raw`Semplifica $\dfrac{${top}}{${bot}}$.`,
          answer: facs.join('*'), vars: ['n'], domain: [1, 6],
          explain: String.raw`Srotolo il fattoriale più grande: $${top}=${facs.slice().reverse().join('')}\cdot ${bot}$, quindi il quoziente è $${facs.join('')}$.` };
      } },
    { id: 's01.naturali.p.1', type: 'tf', level: 1,
      prompt: String.raw`$(a+b)^3=a^3+b^3$ per ogni $a,b\in\R$.`,
      answer: false,
      explain: String.raw`Falso: $(a+b)^3=a^3+3a^2b+3ab^2+b^3$. Controesempio: $a=b=1$ dà $8\neq2$.` },
    { id: 's01.naturali.p.2', type: 'mcq', level: 2,
      prompt: String.raw`Quanti sottoinsiemi ha un insieme con $5$ elementi?`,
      options: ['$32$', '$25$', '$120$', '$10$'],
      answer: 0,
      explain: String.raw`$\sum_{k=0}^5\binom5k=2^5=32$ (ogni elemento può esserci o no: $2$ scelte per $5$ elementi). $120=5!$ conta gli ordinamenti; $10=\binom52$ solo i sottoinsiemi con $2$ elementi.` },
    { id: 's01.naturali.p.3', type: 'order', level: 2,
      prompt: String.raw`Riordina la dimostrazione per induzione di $n!\geq2^{n-1}$ per ogni $n\geq1$.`,
      steps: [
        String.raw`Base: $n=1$, $1!=1\geq2^0=1$.`,
        String.raw`Ipotesi induttiva: $n!\geq2^{n-1}$.`,
        String.raw`$(n+1)!=(n+1)\cdot n!\geq(n+1)\cdot2^{n-1}$ per l'ipotesi.`,
        String.raw`Poiché $n+1\geq2$, si ha $(n+1)2^{n-1}\geq2\cdot2^{n-1}=2^n$.`,
        String.raw`Quindi $(n+1)!\geq2^n$ e per induzione la tesi vale per ogni $n\geq1$.`,
      ],
      distractors: [String.raw`Poiché $n+1\leq2$, si ha $(n+1)2^{n-1}\leq2^n$.`],
      explain: String.raw`Il punto chiave è $n+1\geq2$ per $n\geq1$, che permette di passare da $2^{n-1}$ a $2^n$.` },
    { id: 's01.naturali.p.4', type: 'cloze', level: 1,
      prompt: 'Completa il binomio di Newton.',
      text: String.raw`$(a+b)^n=\displaystyle\sum_{k=0}^{n}$ [[0]] $a^{n-k}$ [[1]].`,
      blanks: [
        { options: [String.raw`$\binom nk$`, String.raw`$n!$`, String.raw`$k!$`], answer: 0 },
        { options: [String.raw`$b^k$`, String.raw`$b^n$`, String.raw`$b^{n-k}$`], answer: 0 },
      ],
      explain: String.raw`Gli esponenti di $a$ e $b$ sommano sempre a $n$; il coefficiente è $\binom nk$.` },
    { id: 's01.naturali.p.5', type: 'open', level: 3,
      prompt: String.raw`Enuncia il principio di induzione e usalo per dimostrare che $\displaystyle\sum_{k=1}^{n}k=\frac{n(n+1)}2$.`,
      answer: String.raw`**Principio**: se $P(n_0)$ è vera e per ogni $n\geq n_0$ vale $P(n)\Rightarrow P(n+1)$, allora $P(n)$ è vera per ogni $n\geq n_0$.

**Base** $n=1$: $1=\frac{1\cdot2}2$.

**Passo**: supposto $\sum_{k=1}^nk=\frac{n(n+1)}2$, si ha $\sum_{k=1}^{n+1}k=\frac{n(n+1)}2+(n+1)=\frac{(n+1)(n+2)}2$, che è la formula per $n+1$. Per induzione vale per ogni $n\geq1$.`,
      rubric: ['Enunciato corretto (base + passo induttivo)', 'Caso base verificato', "Uso esplicito dell'ipotesi induttiva", 'Calcolo algebrico corretto fino a $\\frac{(n+1)(n+2)}2$'] },
    { id: 's01.naturali.p.6', type: 'num', level: 2,
      prompt: String.raw`Qual è il coefficiente di $x^3$ nello sviluppo di $(2x-1)^5$?`,
      answer: '80',
      explain: String.raw`Termine generale $\binom5k(2x)^k(-1)^{5-k}$. Per $k=3$: $\binom53\cdot8\cdot(-1)^2=10\cdot8=80$.` },
  ],
  flashcards: [
    { id: 's01.naturali.fc1', kind: 'def', front: 'Fattoriale di $n$', back: String.raw`$n!=1\cdot2\cdots n$ per $n\geq1$, $0!=1$. Vale $(n+1)!=(n+1)\,n!$. Conta gli ordinamenti di $n$ oggetti.` },
    { id: 's01.naturali.fc2', kind: 'def', front: 'Coefficiente binomiale', back: String.raw`$\binom nk=\frac{n!}{k!(n-k)!}$, $0\le k\le n$: numero di sottoinsiemi con $k$ elementi di un insieme con $n$ elementi.` },
    { id: 's01.naturali.fc3', kind: 'formula', front: 'Simmetria e formula di Stifel', back: String.raw`$\binom nk=\binom n{n-k}$; $\;\binom nk=\binom{n-1}{k-1}+\binom{n-1}k$ (triangolo di Tartaglia).` },
    { id: 's01.naturali.fc4', kind: 'thm', front: 'Binomio di Newton', back: String.raw`$(a+b)^n=\sum_{k=0}^n\binom nk a^{n-k}b^k$. Con $a=b=1$: $\sum_k\binom nk=2^n$.` },
    { id: 's01.naturali.fc5', kind: 'thm', front: 'Principio di induzione', back: String.raw`Se $P(n_0)$ è vera e $P(n)\Rightarrow P(n+1)$ per ogni $n\geq n_0$, allora $P(n)$ è vera per ogni $n\geq n_0$.` },
    { id: 's01.naturali.fc6', kind: 'metodo', front: 'Schema di una dimostrazione per induzione', back: String.raw`1. Base: verifico $P(n_0)$. 2. Ipotesi: suppongo $P(n)$. 3. Passo: scrivo $P(n+1)$ e **uso** $P(n)$ per ottenerla. 4. Concludo citando il principio.` },
    { id: 's01.naturali.fc7', kind: 'formula', front: 'Somme notevoli', back: String.raw`$\sum_{k=1}^nk=\frac{n(n+1)}2$, $\;\sum_{k=1}^n(2k-1)=n^2$, $\;\sum_{k=1}^nk^2=\frac{n(n+1)(2n+1)}6$.` },
    { id: 's01.naturali.fc8', kind: 'thm', front: 'Disuguaglianza di Bernoulli', back: String.raw`Per $x\geq-1$ e $n\in\N$: $(1+x)^n\geq1+nx$ (per induzione, usando $1+x\geq0$).` },
    { id: 's01.naturali.fc9', kind: 'errore', front: 'Errore tipico con le potenze di un binomio', back: String.raw`$(a+b)^n\neq a^n+b^n$: mancano i termini misti $\binom nk a^{n-k}b^k$. E nei coefficienti di $(cx+d)^n$ vanno elevati anche $c$ e $d$.` },
    { id: 's01.naturali.fc10', kind: 'def', front: 'Gli insiemi $\\N,\\Z,\\Q$', back: String.raw`$\N=\{0,1,2,\dots\}$, $\Z$ interi relativi, $\Q=\{p/q: p\in\Z, q\in\N, q\neq0\}$. $\N\subset\Z\subset\Q\subset\R$. Ogni ampliamento risolve equazioni nuove ($x+3=1$, $2x=1$, $x^2=2$).` },
  ],
});
