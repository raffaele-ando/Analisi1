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

// ---------------------------------------------------------------------------
// s01.irrazionali
// ---------------------------------------------------------------------------
S.push({
  id: 's01.irrazionali',
  title: 'Irrazionalità di √2, numerabilità, cardinalità',
  summary: String.raw`Saprai dimostrare che $\sqrt2\notin\Q$ e spiegare perché $\Z$ e $\Q$ sono numerabili mentre $\R$ non lo è.`,
  prereq: ['s01.naturali', 's00.logica'],
  examRefs: [],
  lessons: [
    {
      id: 's01.irrazionali.L1',
      title: 'Decimali periodici e numeri irrazionali',
      cards: [
        { type: 'learn', title: 'Razionali = decimali finiti o periodici',
          body: String.raw`Ogni razionale ha una scrittura decimale **finita** ($\frac34=0{,}75$) o **periodica** ($\frac13=0{,}\overline3$), e viceversa ogni decimale finito o periodico è una frazione.

Un numero con infinite cifre decimali **non periodiche** si dice **irrazionale**: per esempio $\sqrt2=1{,}41421356\dots$, $\pi$, $e$.

>* $\R$ è formato dai razionali e dagli irrazionali: $\R=\Q\cup(\R\setminus\Q)$.

Il problema storico: la diagonale di un quadrato di lato $1$ misura $\sqrt2$ (Pitagora), ma nessuna frazione al quadrato fa $2$.` },
        { type: 'example', title: 'Da periodico a frazione',
          problem: String.raw`Scrivi $x=0{,}\overline{36}$ come frazione.`,
          steps: [
            String.raw`Il periodo ha $2$ cifre: moltiplico per $100$. $100x=36{,}\overline{36}$.`,
            String.raw`Sottraggo: $100x-x=36$, perché le code periodiche si cancellano. Quindi $99x=36$.`,
            { text: String.raw`$x=\frac{36}{99}=\frac4{11}$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $x=\frac{36}{99}$ ridotta? (scrivi una frazione)`, answer: '4/11', explain: String.raw`$36$ e $99$ hanno MCD $9$: $\frac{36}{99}=\frac4{11}$.` } },
          ],
          result: String.raw`$0{,}\overline{36}=\frac4{11}$. Regola: periodo semplice di $k$ cifre $=\frac{\text{periodo}}{\underbrace{9\cdots9}_{k}}$.` },
        { id: 's01.irrazionali.L1.e1', type: 'num', level: 1,
          prompt: String.raw`Scrivi $0{,}\overline{3}$ come frazione.`,
          answer: '1/3',
          explain: String.raw`$10x-x=3$, quindi $x=\frac39=\frac13$.` },
        { id: 's01.irrazionali.L1.e2', type: 'num', level: 2,
          prompt: String.raw`Scrivi $1{,}2\overline{3}$ come frazione.`,
          answer: '37/30',
          explain: String.raw`$x=1{,}2333\dots$: $100x=123{,}\overline3$ e $10x=12{,}\overline3$. Sottraendo $90x=111$, quindi $x=\frac{111}{90}=\frac{37}{30}$. Errore tipico: usare $\frac{123}{99}$, che vale per $1{,}\overline{23}$ (periodo diverso).` },
        { id: 's01.irrazionali.L1.e3', type: 'tf', level: 2,
          prompt: String.raw`La somma di un numero razionale e di un numero irrazionale è sempre irrazionale.`,
          answer: true,
          explain: String.raw`Per assurdo: se $q+r=s$ con $q,s\in\Q$ e $r$ irrazionale, allora $r=s-q\in\Q$ (differenza di razionali), contraddizione.` },
        { id: 's01.irrazionali.L1.e4', type: 'tf', level: 2,
          prompt: String.raw`Il prodotto di due numeri irrazionali è sempre irrazionale.`,
          answer: false,
          explain: String.raw`Controesempio: $\sqrt2\cdot\sqrt2=2\in\Q$. Per gli irrazionali non vale alcuna "chiusura": somme e prodotti possono essere razionali.` },
        { id: 's01.irrazionali.L1.e5', type: 'mcq', level: 1,
          prompt: 'Quale di questi numeri è irrazionale?',
          options: [String.raw`$\sqrt2+1$`, String.raw`$\sqrt9$`, String.raw`$0{,}\overline{12}$`, String.raw`$\frac{22}7$`],
          answer: 0,
          explain: String.raw`$\sqrt2+1$ è razionale + irrazionale, quindi irrazionale. $\sqrt9=3$; $0{,}\overline{12}=\frac{12}{99}$ è periodico; $\frac{22}7$ è un'approssimazione di $\pi$ ma è una frazione.` },
        { type: 'learn', title: 'Il lemma che serve',
          body: String.raw`>* **Lemma.** Se $n\in\Z$ e $n^2$ è pari, allora $n$ è pari.

Si dimostra per **contronominale** ($A\Rightarrow B$ equivale a $\lnot B\Rightarrow\lnot A$): se $n$ è dispari, $n=2k+1$, allora
$$n^2=4k^2+4k+1=2(2k^2+2k)+1$$
è dispari.` },
        { id: 's01.irrazionali.L1.e6', type: 'mcq', level: 1,
          prompt: String.raw`Qual è la contronominale di "se $n^2$ è pari allora $n$ è pari"?`,
          options: [
            String.raw`Se $n$ è dispari allora $n^2$ è dispari.`,
            String.raw`Se $n$ è pari allora $n^2$ è pari.`,
            String.raw`Se $n^2$ è dispari allora $n$ è dispari.`,
            String.raw`Se $n^2$ è pari allora $n$ è dispari.`,
          ],
          answer: 0,
          explain: String.raw`La contronominale di $A\Rightarrow B$ è $\lnot B\Rightarrow\lnot A$: si negano **e** si scambiano. "Se $n$ pari allora $n^2$ pari" è l'inversa (vera, ma non equivalente); la terza è la contraria.` },
        { id: 's01.irrazionali.L1.e7', type: 'expr', level: 1,
          prompt: String.raw`Scrivi $(2k+1)^2$ nella forma $2m+1$: quanto vale $m$ in funzione di $k$?`,
          answer: '2k^2+2k', vars: ['k'],
          explain: String.raw`$(2k+1)^2=4k^2+4k+1=2(2k^2+2k)+1$, quindi $m=2k^2+2k$: il quadrato di un dispari è dispari.` },
      ],
    },
    {
      id: 's01.irrazionali.L2',
      title: 'La dimostrazione: √2 non è razionale',
      cards: [
        { type: 'learn', title: "L'idea",
          body: String.raw`>* **Teorema.** Non esiste alcun $x\in\Q$ tale che $x^2=2$; cioè $\sqrt2\notin\Q$.

Si procede **per assurdo**: si suppone che $\sqrt2=\frac pq$ con la frazione **ridotta ai minimi termini** (cioè $p,q$ senza fattori comuni) e si scopre che $p$ e $q$ sono entrambi pari. Contraddizione.

Ogni frazione si può ridurre ai minimi termini dividendo per il MCD: quindi l'ipotesi "ridotta" non toglie generalità.` },
        { type: 'example', title: 'Dimostrazione completa',
          problem: String.raw`Dimostra che $\sqrt2\notin\Q$.`,
          steps: [
            String.raw`Per assurdo, sia $\sqrt2=\frac pq$ con $p,q\in\N$, $q\neq0$, **primi tra loro**.`,
            String.raw`Elevo al quadrato: $2=\frac{p^2}{q^2}$, cioè $p^2=2q^2$. Quindi $p^2$ è pari.`,
            String.raw`Per il lemma, $p$ è pari: $p=2m$.`,
            String.raw`Sostituisco: $4m^2=2q^2$, cioè $q^2=2m^2$. Quindi $q^2$ è pari e, per il lemma, $q$ è pari.`,
            String.raw`$p$ e $q$ sono entrambi pari: hanno il fattore comune $2$, contro l'ipotesi.`,
          ],
          result: String.raw`L'ipotesi $\sqrt2\in\Q$ è assurda: $\sqrt2$ è irrazionale.` },
        { id: 's01.irrazionali.L2.e1', type: 'order', level: 2,
          prompt: String.raw`Riordina la dimostrazione di $\sqrt2\notin\Q$. Scarta i passi sbagliati.`,
          steps: [
            String.raw`Per assurdo, $\sqrt2=\frac pq$ con $p,q$ interi positivi primi tra loro.`,
            String.raw`Allora $p^2=2q^2$, quindi $p^2$ è pari e dunque $p$ è pari.`,
            String.raw`Scrivo $p=2m$: da $4m^2=2q^2$ segue $q^2=2m^2$.`,
            String.raw`Quindi $q^2$ è pari e anche $q$ è pari.`,
            String.raw`$p$ e $q$ sono entrambi pari: contraddizione con l'ipotesi che siano primi tra loro.`,
          ],
          distractors: [
            String.raw`Poiché $p^2=2q^2$, $p$ è dispari.`,
            String.raw`Calcolo $\sqrt2\approx1{,}414$, che non è una frazione: quindi $\sqrt2\notin\Q$.`,
          ],
          explain: String.raw`La catena è: ipotesi di riduzione → $p$ pari → $q$ pari → contraddizione. Un'approssimazione decimale non dimostra nulla: anche $\frac17=0{,}142857\dots$ "sembra" non periodico se guardi poche cifre.` },
        { id: 's01.irrazionali.L2.e2', type: 'mcq', level: 1,
          prompt: 'In che cosa consiste la contraddizione finale?',
          options: [
            String.raw`$p$ e $q$ risultano entrambi pari, mentre la frazione era ridotta ai minimi termini.`,
            String.raw`$p^2$ risulta negativo.`,
            String.raw`$q$ risulta uguale a $0$.`,
            String.raw`$\sqrt2$ risulta maggiore di $2$.`,
          ],
          answer: 0,
          explain: String.raw`Tutto il ragionamento serve a mostrare che $2$ divide sia $p$ sia $q$. Senza l'ipotesi "primi tra loro" non ci sarebbe contraddizione.` },
        { id: 's01.irrazionali.L2.e3', type: 'cloze', level: 2,
          prompt: 'Completa i passaggi chiave.',
          text: String.raw`Da $\sqrt2=\frac pq$ segue $p^2=$ [[0]]. Allora $p$ è [[1]], $p=2m$, e quindi $q^2=$ [[2]].`,
          blanks: [
            { options: [String.raw`$2q^2$`, String.raw`$2q$`, String.raw`$4q^2$`], answer: 0 },
            { options: ['pari', 'dispari', 'primo'], answer: 0 },
            { options: [String.raw`$2m^2$`, String.raw`$4m^2$`, String.raw`$m^2$`], answer: 0 },
          ],
          explain: String.raw`$p^2=2q^2$; con $p=2m$: $4m^2=2q^2\Rightarrow q^2=2m^2$.` },
        { id: 's01.irrazionali.L2.e4', type: 'mcq', level: 2,
          prompt: String.raw`Perché si può supporre che $\frac pq$ sia ridotta ai minimi termini?`,
          options: [
            String.raw`Perché ogni frazione si riduce dividendo numeratore e denominatore per il loro MCD, senza cambiarne il valore.`,
            String.raw`Perché $\sqrt2$ è un numero primo.`,
            String.raw`Perché $p$ e $q$ sono per forza dispari.`,
            String.raw`Non si può: è un'ipotesi in più che indebolisce la dimostrazione.`,
          ],
          answer: 0,
          explain: String.raw`Se $\sqrt2$ fosse una frazione, lo sarebbe anche in forma ridotta: la riduzione non perde generalità. $\sqrt2$ non è un intero, tanto meno primo.` },
        { id: 's01.irrazionali.L2.e5', type: 'tf', level: 2,
          prompt: String.raw`Ripetendo la stessa dimostrazione con $4$ al posto di $2$ si prova che $\sqrt4\notin\Q$.`,
          answer: false,
          explain: String.raw`$\sqrt4=2\in\Q$. Infatti la dimostrazione si blocca: da $p^2=4q^2$ con $p=2m$ si ottiene $m^2=q^2$, che non dice nulla sulla parità di $q$. Il passo cruciale usa che $2$ divide $p^2$ ma $4$ non divide $2q^2$ in generale.` },
        { type: 'example', title: 'Lo stesso schema per $\\sqrt3$',
          problem: String.raw`Dimostra che $\sqrt3\notin\Q$.`,
          steps: [
            String.raw`Per assurdo $\sqrt3=\frac pq$ ridotta: $p^2=3q^2$, quindi $3\mid p^2$ e, essendo $3$ primo, $3\mid p$.`,
            { text: String.raw`Scrivo $p=3m$: $9m^2=3q^2$, cioè $q^2=3m^2$.`,
              ask: { type: 'expr', prompt: String.raw`Da $9m^2=3q^2$, quanto vale $q^2$ in funzione di $m$?`, answer: '3m^2', vars: ['m'], explain: String.raw`Divido per $3$: $q^2=3m^2$.` } },
            String.raw`Quindi $3\mid q^2$ e $3\mid q$: $p,q$ hanno il fattore comune $3$. Assurdo.`,
          ],
          result: String.raw`$\sqrt3\notin\Q$. In generale $\sqrt n\in\Q$ solo se $n$ è un quadrato perfetto.` },
        { id: 's01.irrazionali.L2.e6', type: 'mcq', level: 2,
          prompt: String.raw`Che cosa implica il teorema su $\sqrt2$ per l'insieme $\Q$?`,
          options: [
            String.raw`$\Q$ "ha dei buchi": l'equazione $x^2=2$ non ha soluzioni razionali, anche se ci sono razionali con quadrato vicino quanto si vuole a $2$.`,
            String.raw`$\Q$ è finito.`,
            String.raw`$\Q$ non è chiuso rispetto alla somma.`,
            String.raw`$\Q$ non contiene numeri maggiori di $\sqrt2$.`,
          ],
          answer: 0,
          explain: String.raw`È la motivazione per introdurre $\R$ con l'assioma di completezza (Dedekind). $\Q$ è infinito, chiuso per $+$ e contiene numeri maggiori di $\sqrt2$ (per esempio $2$).` },
        { id: 's01.irrazionali.L2.e7', type: 'open', level: 3,
          prompt: String.raw`Si dimostri che $\sqrt2$ non è un numero razionale.`,
          answer: String.raw`Supponiamo per assurdo $\sqrt2=\frac pq$ con $p,q\in\N$, $q\neq0$, primi tra loro (ogni frazione si può ridurre ai minimi termini).

Elevando al quadrato: $p^2=2q^2$, quindi $p^2$ è pari. Allora $p$ è pari (se $p$ fosse dispari, $p=2k+1$, sarebbe $p^2=2(2k^2+2k)+1$ dispari). Scriviamo $p=2m$.

Sostituendo: $4m^2=2q^2$, cioè $q^2=2m^2$: anche $q^2$ è pari, e quindi $q$ è pari.

Allora $2$ divide sia $p$ sia $q$, contro l'ipotesi che fossero primi tra loro. L'assurdo prova che $\sqrt2\notin\Q$.`,
          rubric: ['Impostazione per assurdo con frazione ridotta ai minimi termini', 'Da $p^2=2q^2$ deduce che $p$ è pari (giustificando il lemma)', 'Sostituisce $p=2m$ e ottiene $q^2=2m^2$, quindi $q$ pari', 'Individua esplicitamente la contraddizione e conclude'] },
      ],
    },
    {
      id: 's01.irrazionali.L3',
      title: 'Contare gli infiniti: numerabilità',
      cards: [
        { type: 'learn', title: 'Stessa cardinalità',
          body: String.raw`>* Due insiemi $A$ e $B$ sono **equipotenti** (hanno la stessa cardinalità) se esiste una funzione **biiettiva** $f:A\to B$. Un insieme è **numerabile** se è equipotente a $\N$.

Per gli insiemi finiti vuol dire "stesso numero di elementi". Per gli infiniti succedono cose sorprendenti: i numeri pari sono numerabili tramite $n\mapsto2n$, anche se sono "la metà" di $\N$.

Essere numerabile significa poter **elencare** gli elementi in una successione $a_0,a_1,a_2,\dots$ senza dimenticarne nessuno.` },
        { id: 's01.irrazionali.L3.e1', type: 'mcq', level: 1,
          prompt: String.raw`Quale funzione è una biiezione da $\N$ all'insieme $P$ dei numeri naturali pari?`,
          options: [String.raw`$n\mapsto2n$`, String.raw`$n\mapsto n^2$`, String.raw`$n\mapsto n+2$`, String.raw`$n\mapsto2n+1$`],
          answer: 0,
          explain: String.raw`$2n$ è iniettiva e ogni pari $2k$ è immagine di $k$: è biiettiva. $n^2$ non è suriettiva sui pari (manca $2$); $n+2$ produce anche dispari; $2n+1$ dà i dispari.` },
        { type: 'learn', title: '$\\Z$ è numerabile',
          body: String.raw`Elenca gli interi alternando i segni: $0,\,-1,\,1,\,-2,\,2,\,-3,\,3,\dots$ In formula, $f:\N\to\Z$
$$f(n)=\begin{cases}\dfrac n2 & n\text{ pari}\\[4pt] -\dfrac{n+1}2 & n\text{ dispari}\end{cases}$$
è biiettiva: $f(0)=0$, $f(1)=-1$, $f(2)=1$, $f(3)=-2$, …` },
        { id: 's01.irrazionali.L3.e2', type: 'num', level: 1,
          prompt: String.raw`Con la funzione $f$ appena vista, quanto vale $f(7)$?`,
          answer: '-4',
          explain: String.raw`$7$ è dispari: $f(7)=-\frac{7+1}2=-4$.` },
        { id: 's01.irrazionali.L3.e3', type: 'num', level: 2,
          prompt: String.raw`Quale $n\in\N$ ha immagine $f(n)=5$?`,
          answer: '10',
          explain: String.raw`$5>0$ viene dal ramo pari: $\frac n2=5\Rightarrow n=10$. Il ramo dispari produce solo interi negativi.` },
        { type: 'learn', title: '$\\Q$ è numerabile, $\\R$ no',
          body: String.raw`Disponi le frazioni $\frac pq$ ($p,q\geq1$) in una tabella infinita: riga $p$, colonna $q$. Percorrila **a zig-zag lungo le diagonali** ($p+q=2,3,4,\dots$), saltando le frazioni non ridotte: ottieni un elenco di tutti i razionali positivi. Aggiungendo $0$ e i negativi (come per $\Z$):

>* $\Q$ è numerabile (Cantor).

Invece:

>* $\R$ **non** è numerabile (argomento diagonale di Cantor): dato un qualunque elenco di numeri in $(0,1)$, si costruisce un numero che differisce dall'$n$-esimo nella $n$-esima cifra decimale, quindi non è nell'elenco.

Conseguenza: gli irrazionali non sono numerabili; sono "molti di più" dei razionali.` },
        { id: 's01.irrazionali.L3.e4', type: 'tf', level: 1,
          prompt: String.raw`Poiché $\N\subsetneq\Q$, l'insieme $\Q$ ha cardinalità maggiore di $\N$.`,
          answer: false,
          explain: String.raw`Per gli insiemi infiniti l'inclusione stretta non basta: $\Q$ e $\N$ sono equipotenti (il percorso a zig-zag di Cantor è una biiezione). Lo stesso accade per i pari in $\N$.` },
        { id: 's01.irrazionali.L3.e5', type: 'mcq', level: 1,
          prompt: 'Quale di questi insiemi NON è numerabile?',
          options: [String.raw`$\R$`, String.raw`$\Z$`, String.raw`$\Q$`, String.raw`$\N\times\N$`],
          answer: 0,
          explain: String.raw`$\Z$ e $\Q$ sono numerabili; $\N\times\N$ si elenca con lo stesso zig-zag della tabella di Cantor. $\R$ non è numerabile (diagonale di Cantor).` },
        { id: 's01.irrazionali.L3.e6', type: 'tf', level: 2,
          prompt: String.raw`L'insieme $\R\setminus\Q$ degli irrazionali è numerabile.`,
          answer: false,
          explain: String.raw`Se lo fosse, $\R=\Q\cup(\R\setminus\Q)$ sarebbe unione di due numerabili, quindi numerabile (alterno gli elenchi). Ma $\R$ non è numerabile.` },
        { id: 's01.irrazionali.L3.e7', type: 'match', level: 2,
          prompt: 'Abbina ogni insieme al modo di "contarlo".',
          pairs: [
            [String.raw`Numeri pari`, String.raw`$n\mapsto2n$`],
            [String.raw`$\Z$`, String.raw`elenco $0,-1,1,-2,2,\dots$`],
            [String.raw`$\Q$`, 'zig-zag sulla tabella delle frazioni'],
            [String.raw`$\R$`, 'non numerabile: diagonale di Cantor'],
          ],
          explain: String.raw`I primi tre sono numerabili con una biiezione esplicita; per $\R$ l'argomento diagonale mostra che ogni elenco dimentica qualche numero.` },
        { id: 's01.irrazionali.L3.e8', type: 'open', level: 2,
          prompt: String.raw`Che cosa significa che un insieme è numerabile? Dimostra che $\Z$ è numerabile.`,
          answer: String.raw`Un insieme $A$ è numerabile se esiste una biiezione $f:\N\to A$.

Per $\Z$: $f(n)=\frac n2$ se $n$ è pari, $f(n)=-\frac{n+1}2$ se $n$ è dispari. È iniettiva (i pari vanno in $\{0,1,2,\dots\}$ in modo iniettivo, i dispari in $\{-1,-2,\dots\}$ in modo iniettivo, e i due insiemi immagine sono disgiunti) ed è suriettiva ($k\geq0$ è immagine di $2k$, $k<0$ di $-2k-1$).`,
          rubric: ['Definizione corretta (biiezione con $\\N$)', 'Biiezione esplicita $\\N\\to\\Z$', 'Verifica iniettività', 'Verifica suriettività'] },
      ],
    },
  ],
  practice: [
    { id: 's01.irrazionali.p.gen-periodico', type: 'gen', level: 2,
      gen: (R) => {
        if (R.chance(0.5)) {
          let d1 = R.int(0, 9), d2 = R.int(0, 9);
          while (d1 === d2) d2 = R.int(0, 9);
          const P = 10 * d1 + d2;
          return { type: 'num',
            prompt: String.raw`Scrivi $0{,}\overline{${d1}${d2}}$ come frazione ridotta.`,
            answer: H.fracStr(P, 99),
            explain: String.raw`Periodo di $2$ cifre: $100x-x=${P}$, quindi $x=\frac{${P}}{99}${H.gcd(P, 99) > 1 ? '=' + H.frac(P, 99) : ''}$${H.gcd(P, 99) > 1 ? ` (semplifico per $${H.gcd(P, 99)}$)` : ' (già ridotta)'}.` };
        }
        const I = R.int(0, 3), a = R.int(1, 8);
        let c = R.int(1, 8);
        while (c === a) c = R.int(1, 8);
        const num = 9 * a + c; // (10a+c) - a
        return { type: 'num',
          prompt: String.raw`Scrivi $${I}{,}${a}\overline{${c}}$ come frazione ridotta.`,
          answer: H.fracStr(90 * I + num, 90),
          explain: String.raw`$x=${I}{,}${a}${c}${c}${c}\dots$: $100x=${100 * I + 10 * a + c}{,}\overline{${c}}$ e $10x=${10 * I + a}{,}\overline{${c}}$. Sottraendo, la coda periodica si cancella: $90x=${100 * I + 10 * a + c}-${10 * I + a}=${90 * I + num}$, quindi $x=${H.frac(90 * I + num, 90)}$.` };
      } },
    { id: 's01.irrazionali.p.gen-radq', type: 'gen', level: 1,
      gen: (R) => {
        const n = R.int(2, 60);
        const r = Math.round(Math.sqrt(n));
        const sq = r * r === n;
        return { type: 'mcq',
          prompt: String.raw`Il numero $\sqrt{${n}}$ è razionale?`,
          options: [String.raw`Sì, $\sqrt{${n}}\in\Q$`, String.raw`No, $\sqrt{${n}}\notin\Q$`],
          noShuffle: true,
          answer: sq ? 0 : 1,
          explain: sq
            ? String.raw`$${n}=${r}^2$ è un quadrato perfetto: $\sqrt{${n}}=${r}\in\Q$.`
            : String.raw`$${n}$ non è un quadrato perfetto ($${r * r > n ? (r - 1) ** 2 : r * r}<${n}<${r * r > n ? r * r : (r + 1) ** 2}$), e per $n\in\N$ si ha $\sqrt n\in\Q$ solo se $n$ è un quadrato perfetto (stessa dimostrazione di $\sqrt2$, usando un fattore primo che compare in $n$ con esponente dispari).` };
      } },
    { id: 's01.irrazionali.p.gen-biiez', type: 'gen', level: 1,
      gen: (R) => {
        const n = R.int(3, 40);
        const v = n % 2 === 0 ? n / 2 : -(n + 1) / 2;
        if (R.chance(0.5))
          return { type: 'num',
            prompt: String.raw`Sia $f:\N\to\Z$, $f(n)=\frac n2$ se $n$ è pari, $f(n)=-\frac{n+1}2$ se $n$ è dispari. Calcola $f(${n})$.`,
            answer: String(v),
            explain: n % 2 === 0 ? String.raw`$${n}$ è pari: $f(${n})=\frac{${n}}2=${v}$.` : String.raw`$${n}$ è dispari: $f(${n})=-\frac{${n}+1}2=${v}$.` };
        return { type: 'num',
          prompt: String.raw`Sia $f:\N\to\Z$, $f(n)=\frac n2$ se $n$ è pari, $f(n)=-\frac{n+1}2$ se $n$ è dispari. Quale $n$ ha immagine $${v}$?`,
          answer: String(n),
          explain: v > 0 ? String.raw`$${v}>0$ viene dal ramo pari: $n=2\cdot${v}=${n}$.` : String.raw`$${v}<0$ viene dal ramo dispari: $-\frac{n+1}2=${v}\Rightarrow n=${n}$.` };
      } },
    { id: 's01.irrazionali.p.gen-razirr', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(1, 5), b = R.int(2, 4);
        const items = [
          [String.raw`(${a}+\sqrt2)(${a}-\sqrt2)`, true, String.raw`È $${a}^2-2=${a * a - 2}$: prodotto notevole, razionale.`],
          [String.raw`${a}+\sqrt2`, false, String.raw`Razionale + irrazionale è irrazionale.`],
          [String.raw`(\sqrt2)^{${2 * b}}`, true, String.raw`$(\sqrt2)^{${2 * b}}=2^{${b}}=${2 ** b}$.`],
          [String.raw`${a}\sqrt2`, false, String.raw`Se $${a}\sqrt2=q\in\Q$ allora $\sqrt2=q/${a}\in\Q$: assurdo.`],
          [String.raw`\sqrt{${a * a * 2}}\cdot\sqrt2`, true, String.raw`$\sqrt{${2 * a * a}}\cdot\sqrt2=\sqrt{${4 * a * a}}=${2 * a}$.`],
          [String.raw`(${a}+\sqrt2)^2`, false, String.raw`$(${a}+\sqrt2)^2=${a * a + 2}+${2 * a}\sqrt2$: razionale + irrazionale.`],
        ];
        const [t, rat, why] = R.pick(items);
        return { type: 'tf',
          prompt: String.raw`Il numero $${t}$ è razionale.`,
          answer: rat,
          explain: why };
      } },
    { id: 's01.irrazionali.p.1', type: 'open', level: 3,
      prompt: String.raw`Enunciare e dimostrare il teorema di irrazionalità di $\sqrt2$.`,
      answer: String.raw`**Enunciato**: non esiste $x\in\Q$ con $x^2=2$.

**Dimostrazione** (per assurdo): sia $\sqrt2=\frac pq$, $p,q$ interi positivi primi tra loro. Allora $p^2=2q^2$ è pari, quindi $p$ è pari (il quadrato di un dispari è dispari): $p=2m$. Ne segue $q^2=2m^2$, quindi anche $q$ è pari. $p$ e $q$ hanno il fattore comune $2$: assurdo.`,
      rubric: ['Enunciato corretto', 'Ipotesi per assurdo con frazione ridotta', 'Passaggi $p$ pari e $q$ pari giustificati', 'Contraddizione esplicita'] },
    { id: 's01.irrazionali.p.2', type: 'order', level: 2,
      prompt: String.raw`Riordina la dimostrazione del lemma: "se $n^2$ è pari, allora $n$ è pari".`,
      steps: [
        String.raw`Dimostro la contronominale: se $n$ è dispari, $n^2$ è dispari.`,
        String.raw`Sia $n$ dispari: $n=2k+1$ con $k\in\Z$.`,
        String.raw`Allora $n^2=4k^2+4k+1=2(2k^2+2k)+1$.`,
        String.raw`Quindi $n^2$ è dispari, e il lemma è dimostrato.`,
      ],
      distractors: [String.raw`Sia $n$ pari: $n=2k$, quindi $n^2=4k^2$ è pari.`],
      explain: String.raw`Il distrattore dimostra l'implicazione inversa ($n$ pari $\Rightarrow n^2$ pari), che è vera ma non è quella richiesta.` },
    { id: 's01.irrazionali.p.3', type: 'tf', level: 1,
      prompt: String.raw`Ogni numero con scrittura decimale periodica è razionale.`,
      answer: true,
      explain: String.raw`Con il metodo "moltiplico per $10^k$ e sottraggo" si ottiene sempre una frazione. Sono i decimali **non** periodici e infiniti a essere irrazionali.` },
    { id: 's01.irrazionali.p.4', type: 'mcq', level: 2,
      prompt: String.raw`Nella dimostrazione di $\sqrt2\notin\Q$, quale passaggio usa il lemma "$n^2$ pari $\Rightarrow n$ pari"?`,
      options: [
        String.raw`Sia il passaggio da $p^2=2q^2$ a "$p$ pari", sia quello da $q^2=2m^2$ a "$q$ pari".`,
        String.raw`Solo il passaggio da $\sqrt2=\frac pq$ a $p^2=2q^2$.`,
        String.raw`Solo la riduzione ai minimi termini.`,
        'Nessuno: il lemma non serve.',
      ],
      answer: 0,
      explain: String.raw`Il lemma serve due volte: prima per $p$, poi per $q$. Elevare al quadrato e ridurre la frazione non c'entrano con la parità.` },
    { id: 's01.irrazionali.p.5', type: 'cloze', level: 1,
      prompt: 'Completa le definizioni.',
      text: String.raw`Due insiemi sono equipotenti se esiste una funzione [[0]] tra di essi. Un insieme è numerabile se è equipotente a [[1]].`,
      blanks: [
        { options: ['biiettiva', 'iniettiva', 'crescente'], answer: 0 },
        { options: [String.raw`$\N$`, String.raw`$\R$`, String.raw`$\Q\setminus\Z$`], answer: 0 },
      ],
      explain: String.raw`Serve una corrispondenza biunivoca; il modello di riferimento per "numerabile" è $\N$.` },
    { id: 's01.irrazionali.p.6', type: 'num', level: 2,
      prompt: String.raw`Scrivi $2{,}\overline{45}$ come frazione ridotta.`,
      answer: '27/11',
      explain: String.raw`$0{,}\overline{45}=\frac{45}{99}=\frac5{11}$, quindi $2{,}\overline{45}=2+\frac5{11}=\frac{27}{11}$.` },
  ],
  flashcards: [
    { id: 's01.irrazionali.fc1', kind: 'thm', front: String.raw`Irrazionalità di $\sqrt2$ (enunciato)`, back: String.raw`Non esiste $x\in\Q$ tale che $x^2=2$.` },
    { id: 's01.irrazionali.fc2', kind: 'dim', front: String.raw`Dimostrazione di $\sqrt2\notin\Q$`, back: String.raw`Per assurdo $\sqrt2=p/q$ ridotta. $p^2=2q^2\Rightarrow p$ pari, $p=2m$. Allora $q^2=2m^2\Rightarrow q$ pari. $p,q$ entrambi pari: contro la riduzione ai minimi termini.` },
    { id: 's01.irrazionali.fc3', kind: 'thm', front: 'Lemma di parità', back: String.raw`$n^2$ pari $\Rightarrow n$ pari. Per contronominale: $n=2k+1\Rightarrow n^2=2(2k^2+2k)+1$ dispari.` },
    { id: 's01.irrazionali.fc4', kind: 'def', front: 'Numero irrazionale', back: String.raw`Numero reale non razionale; ha scrittura decimale infinita non periodica (es. $\sqrt2,\pi,e$).` },
    { id: 's01.irrazionali.fc5', kind: 'metodo', front: 'Da decimale periodico a frazione', back: String.raw`Moltiplico per $10^k$ in modo da allineare le code periodiche e sottraggo. Es. $0{,}\overline{36}$: $99x=36$, $x=\frac4{11}$.` },
    { id: 's01.irrazionali.fc6', kind: 'def', front: 'Insiemi equipotenti; insieme numerabile', back: String.raw`Equipotenti: esiste una biiezione tra di essi. Numerabile: equipotente a $\N$ (si può elencare come successione).` },
    { id: 's01.irrazionali.fc7', kind: 'thm', front: String.raw`Numerabilità di $\Z$ e $\Q$; non numerabilità di $\R$`, back: String.raw`$\Z$: elenco $0,-1,1,-2,2,\dots$. $\Q$: zig-zag sulla tabella delle frazioni (Cantor). $\R$ non è numerabile (diagonale di Cantor); quindi neanche $\R\setminus\Q$.` },
    { id: 's01.irrazionali.fc8', kind: 'errore', front: 'Errori tipici con gli irrazionali', back: String.raw`Prodotto o somma di irrazionali può essere razionale ($\sqrt2\cdot\sqrt2=2$, $\sqrt2+(-\sqrt2)=0$). Un'approssimazione decimale non prova l'irrazionalità.` },
  ],
});

// ---------------------------------------------------------------------------
// s01.relazioni
// ---------------------------------------------------------------------------
const relPropsNames = ['riflessiva', 'simmetrica', 'antisimmetrica', 'transitiva'];

S.push({
  id: 's01.relazioni',
  title: "Relazioni di equivalenza e d'ordine",
  summary: String.raw`Saprai riconoscere le proprietà di una relazione, le relazioni di equivalenza (con le loro classi) e quelle d'ordine.`,
  prereq: ['s00.insiemi', 's00.logica'],
  examRefs: [],
  lessons: [
    {
      id: 's01.relazioni.L1',
      title: 'Relazioni e loro proprietà',
      cards: [
        { type: 'learn', title: 'Che cos\'è una relazione',
          body: String.raw`Il **prodotto cartesiano** $A\times B$ è l'insieme delle coppie ordinate $(a,b)$ con $a\in A$, $b\in B$. Se $A$ ha $m$ elementi e $B$ ne ha $n$, $A\times B$ ne ha $mn$.

>* Una **relazione** su $A$ è un sottoinsieme $\mathcal R\subseteq A\times A$. Si scrive $a\,\mathcal R\,b$ se $(a,b)\in\mathcal R$.

Proprietà possibili (per ogni $a,b,c\in A$):
- **riflessiva**: $a\,\mathcal R\,a$;
- **simmetrica**: $a\,\mathcal R\,b\Rightarrow b\,\mathcal R\,a$;
- **antisimmetrica**: $a\,\mathcal R\,b$ e $b\,\mathcal R\,a\Rightarrow a=b$;
- **transitiva**: $a\,\mathcal R\,b$ e $b\,\mathcal R\,c\Rightarrow a\,\mathcal R\,c$.

>! Simmetrica e antisimmetrica **non** sono una la negazione dell'altra: l'uguaglianza le ha entrambe.` },
        { id: 's01.relazioni.L1.e1', type: 'num', level: 1,
          prompt: String.raw`Se $A$ ha $3$ elementi e $B$ ne ha $4$, quanti elementi ha $A\times B$?`,
          answer: '12',
          explain: String.raw`Per ogni scelta del primo elemento ($3$ modi) ci sono $4$ scelte del secondo: $3\cdot4=12$. Non $3+4$: si contano coppie, non elementi.` },
        { id: 's01.relazioni.L1.e2', type: 'mcq', level: 1,
          prompt: String.raw`Siano $A=\{1,2\}$ e $B=\{a,b,c\}$. Quale coppia appartiene ad $A\times B$?`,
          options: [String.raw`$(2,c)$`, String.raw`$(c,2)$`, String.raw`$(1,2)$`, String.raw`$(a,b)$`],
          answer: 0,
          explain: String.raw`In $A\times B$ il primo elemento sta in $A$, il secondo in $B$. $(c,2)$ ha l'ordine scambiato: sta in $B\times A$. Le coppie sono **ordinate**.` },
        { id: 's01.relazioni.L1.e3', type: 'mcq', level: 2,
          prompt: String.raw`Quali proprietà ha la relazione $x<y$ su $\R$? (più risposte)`,
          options: relPropsNames.map((p) => p[0].toUpperCase() + p.slice(1)),
          answer: [2, 3],
          explain: String.raw`Non è riflessiva ($1<1$ è falso), non è simmetrica ($1<2$ ma non $2<1$). È transitiva. È **antisimmetrica** perché l'ipotesi "$x<y$ e $y<x$" non è mai vera, quindi l'implicazione è vera "a vuoto". Trappola frequente.` },
        { type: 'example', title: 'Verificare le proprietà su un insieme finito',
          problem: String.raw`Su $A=\{1,2,3\}$ sia $\mathcal R=\{(1,1),(2,2),(3,3),(1,2),(2,1)\}$. Che proprietà ha?`,
          steps: [
            String.raw`Riflessiva: ci sono $(1,1),(2,2),(3,3)$. Sì.`,
            String.raw`Simmetrica: l'unica coppia "fuori diagonale" $(1,2)$ ha anche la sua inversa $(2,1)$. Sì.`,
            String.raw`Transitiva: da $(1,2)$ e $(2,1)$ serve $(1,1)$, presente; da $(2,1)$ e $(1,2)$ serve $(2,2)$, presente. Le altre combinazioni coinvolgono la diagonale. Sì.`,
            { text: String.raw`Antisimmetrica: no, perché $1\,\mathcal R\,2$ e $2\,\mathcal R\,1$ ma $1\neq2$.`,
              ask: { type: 'mcq', prompt: String.raw`$\mathcal R$ è antisimmetrica?`, options: ['No: $(1,2)$ e $(2,1)$ con $1\\neq2$', 'Sì, perché è riflessiva', 'Sì, perché è simmetrica'], answer: 0,
                explain: String.raw`Per l'antisimmetria, $a\,\mathcal R\,b$ e $b\,\mathcal R\,a$ deve forzare $a=b$: qui non succede.` } },
          ],
          result: String.raw`$\mathcal R$ è riflessiva, simmetrica e transitiva: è una **relazione di equivalenza** (classi $\{1,2\}$ e $\{3\}$).` },
        { id: 's01.relazioni.L1.e4', type: 'tf', level: 1,
          prompt: String.raw`La relazione "$a$ divide $b$" su $\N\setminus\{0\}$ è simmetrica.`,
          answer: false,
          explain: String.raw`$2$ divide $4$ ma $4$ non divide $2$. È invece riflessiva, antisimmetrica e transitiva.` },
        { id: 's01.relazioni.L1.e5', type: 'mcq', level: 2,
          prompt: String.raw`Su $\R$ sia $x\,\mathcal R\,y\iff|x-y|\le1$. Quali proprietà ha? (più risposte)`,
          options: relPropsNames.map((p) => p[0].toUpperCase() + p.slice(1)),
          answer: [0, 1],
          explain: String.raw`Riflessiva ($|x-x|=0\le1$) e simmetrica ($|x-y|=|y-x|$). Non transitiva: $0\,\mathcal R\,1$ e $1\,\mathcal R\,2$ ma $|0-2|=2>1$. Non antisimmetrica: $0\,\mathcal R\,\frac12$ e $\frac12\,\mathcal R\,0$ con $0\neq\frac12$.` },
        { id: 's01.relazioni.L1.e6', type: 'tf', level: 2,
          prompt: String.raw`Una relazione può essere contemporaneamente simmetrica e antisimmetrica.`,
          answer: true,
          explain: String.raw`L'uguaglianza $x=y$ è simmetrica e antisimmetrica (anche riflessiva e transitiva). In generale una relazione è simmetrica e antisimmetrica se e solo se contiene solo coppie $(a,a)$.` },
        { id: 's01.relazioni.L1.e7', type: 'mcq', level: 1,
          prompt: String.raw`Per dimostrare che una relazione **non** è transitiva, che cosa basta?`,
          options: [
            String.raw`Trovare $a,b,c$ con $a\,\mathcal R\,b$, $b\,\mathcal R\,c$ ma non $a\,\mathcal R\,c$.`,
            String.raw`Trovare $a,b$ con $a\,\mathcal R\,b$ ma non $b\,\mathcal R\,a$.`,
            String.raw`Trovare $a$ con $a$ non in relazione con sé stesso.`,
            'Verificare che non è riflessiva.',
          ],
          answer: 0,
          explain: String.raw`La negazione di "$\forall a,b,c\ (a\mathcal Rb\wedge b\mathcal Rc\Rightarrow a\mathcal Rc)$" è "$\exists a,b,c$: $a\mathcal Rb$, $b\mathcal Rc$, non $a\mathcal Rc$": un controesempio. Le altre risposte negano simmetria e riflessività.` },
      ],
    },
    {
      id: 's01.relazioni.L2',
      title: 'Relazioni di equivalenza e classi',
      cards: [
        { type: 'learn', title: 'Equivalenza = "stessa caratteristica"',
          body: String.raw`>* Una relazione **riflessiva, simmetrica e transitiva** si dice **relazione di equivalenza** (simbolo tipico $\sim$).

La **classe di equivalenza** di $a$ è $[a]=\{b\in A: b\sim a\}$.

Fatti chiave:
- due classi sono **uguali o disgiunte**;
- le classi ricoprono $A$: formano una **partizione** di $A$;
- l'insieme delle classi si chiama **insieme quoziente** $A/\!\sim$.

Esempio: su $\Z$, $a\sim b\iff a-b$ è pari. Le classi sono due: i pari e i dispari.` },
        { type: 'example', title: 'Congruenza modulo 3',
          problem: String.raw`Su $\Z$ sia $a\equiv b\pmod3\iff3\mid(a-b)$. Descrivi le classi.`,
          steps: [
            String.raw`È un'equivalenza: $3\mid0$ (riflessiva); se $3\mid a-b$ allora $3\mid b-a$ (simmetrica); se $3\mid a-b$ e $3\mid b-c$ allora $3\mid(a-b)+(b-c)=a-c$ (transitiva).`,
            String.raw`Due interi sono equivalenti se e solo se hanno lo **stesso resto** nella divisione per $3$.`,
            { text: String.raw`Le classi sono $[0]=\{\dots,-3,0,3,6,\dots\}$, $[1]=\{\dots,-2,1,4,\dots\}$, $[2]=\{\dots,-1,2,5,\dots\}$. Il numero $14=3\cdot4+2$ sta in $[2]$.`,
              ask: { type: 'num', prompt: String.raw`$14$ sta nella classe $[r]$ con $r\in\{0,1,2\}$. Quanto vale $r$?`, answer: '2', explain: String.raw`$14=3\cdot4+2$: resto $2$.` } },
          ],
          result: String.raw`$\Z/\!\equiv_3=\{[0],[1],[2]\}$: tre classi.` },
        { id: 's01.relazioni.L2.e1', type: 'num', level: 1,
          prompt: String.raw`Quante classi di equivalenza ha la congruenza modulo $5$ su $\Z$?`,
          answer: '5',
          explain: String.raw`Una per ogni resto possibile: $[0],[1],[2],[3],[4]$.` },
        { id: 's01.relazioni.L2.e2', type: 'num', level: 2,
          prompt: String.raw`Qual è il rappresentante $r\in\{0,1,2,3\}$ della classe di $-7$ modulo $4$?`,
          answer: '1',
          explain: String.raw`$-7=4\cdot(-2)+1$, quindi $-7\equiv1\pmod 4$. Controllo: $-7-1=-8$ è multiplo di $4$. Errore tipico: rispondere $3$ (resto di $7$) cambiando solo il segno.` },
        { id: 's01.relazioni.L2.e3', type: 'tf', level: 1,
          prompt: String.raw`Due classi di equivalenza distinte possono avere elementi in comune.`,
          answer: false,
          explain: String.raw`Se $c\in[a]\cap[b]$ allora $c\sim a$ e $c\sim b$; per simmetria e transitività $a\sim b$, quindi $[a]=[b]$. Classi diverse sono disgiunte.` },
        { id: 's01.relazioni.L2.e4', type: 'mcq', level: 2,
          prompt: String.raw`Su $\R^2$ sia $(x_1,y_1)\sim(x_2,y_2)\iff x_1^2+y_1^2=x_2^2+y_2^2$. Come sono fatte le classi?`,
          options: [
            String.raw`Circonferenze di centro l'origine, più l'origine da sola.`,
            String.raw`Rette passanti per l'origine.`,
            String.raw`Rette parallele all'asse $x$.`,
            String.raw`Un'unica classe: tutto $\R^2$.`,
          ],
          answer: 0,
          explain: String.raw`Due punti sono equivalenti se hanno la **stessa distanza dall'origine** ($\sqrt{x^2+y^2}$). Quindi la classe di un punto a distanza $r>0$ è la circonferenza di raggio $r$; la classe dell'origine è $\{(0,0)\}$.` },
        { id: 's01.relazioni.L2.e5', type: 'mcq', level: 3,
          prompt: String.raw`Su $\Z\times(\Z\setminus\{0\})$ sia $(p,q)\sim(r,s)\iff ps=qr$. Che cosa rappresentano le classi?`,
          options: [
            String.raw`I numeri razionali: la classe di $(p,q)$ è la frazione $\frac pq$.`,
            String.raw`I numeri interi.`,
            String.raw`I punti di una retta.`,
            String.raw`Non è una relazione di equivalenza.`,
          ],
          answer: 0,
          explain: String.raw`$ps=qr\iff\frac pq=\frac rs$: coppie equivalenti sono frazioni equivalenti, come $(1,2)\sim(2,4)$. È proprio così che si costruisce $\Q$ a partire da $\Z$. (La transitività usa $q,s\neq0$.)` },
        { id: 's01.relazioni.L2.e6', type: 'tf', level: 2,
          prompt: String.raw`Su $\R$ la relazione $x\sim y\iff x-y\in\Z$ è di equivalenza.`,
          answer: true,
          explain: String.raw`$x-x=0\in\Z$; se $x-y\in\Z$ anche $y-x\in\Z$; se $x-y$, $y-z\in\Z$ la somma $x-z\in\Z$. Le classi sono gli insiemi $\{t+k: k\in\Z\}$, uno per ogni $t\in[0,1)$ (la "parte decimale").` },
        { id: 's01.relazioni.L2.e7', type: 'cloze', level: 1,
          prompt: 'Completa la definizione.',
          text: String.raw`Una relazione di equivalenza è una relazione [[0]], [[1]] e [[2]].`,
          blanks: [
            { options: ['riflessiva', 'antisimmetrica', 'totale'], answer: 0 },
            { options: ['simmetrica', 'antisimmetrica', 'iniettiva'], answer: 0 },
            { options: ['transitiva', 'suriettiva', 'limitata'], answer: 0 },
          ],
          explain: String.raw`R-S-T. Con "antisimmetrica" al posto di "simmetrica" si ottiene invece una relazione d'ordine.` },
        { id: 's01.relazioni.L2.e8', type: 'open', level: 2,
          prompt: String.raw`Dai la definizione di relazione di equivalenza e di classe di equivalenza, con un esempio.`,
          answer: String.raw`Una relazione $\sim$ su $A$ è di equivalenza se è riflessiva ($a\sim a$), simmetrica ($a\sim b\Rightarrow b\sim a$) e transitiva ($a\sim b,\ b\sim c\Rightarrow a\sim c$). La classe di $a$ è $[a]=\{b\in A: b\sim a\}$; le classi formano una partizione di $A$.

Esempio: su $\Z$, $a\sim b\iff a-b$ pari; le classi sono i pari e i dispari.`,
          rubric: ['Le tre proprietà scritte correttamente', 'Definizione di classe $[a]$', 'Osserva che le classi sono disgiunte e ricoprono $A$', 'Esempio corretto con le sue classi'] },
      ],
    },
    {
      id: 's01.relazioni.L3',
      title: "Relazioni d'ordine",
      cards: [
        { type: 'learn', title: 'Ordinare',
          body: String.raw`>* Una relazione **riflessiva, antisimmetrica e transitiva** si dice **relazione d'ordine** (simbolo tipico $\preceq$).

È **totale** se due elementi qualsiasi sono confrontabili ($a\preceq b$ oppure $b\preceq a$), altrimenti **parziale**.

Esempi:
- $\le$ su $\R$: ordine totale;
- $\subseteq$ sui sottoinsiemi di un insieme: ordine parziale ($\{1\}$ e $\{2\}$ non sono confrontabili);
- "$a$ divide $b$" su $\N\setminus\{0\}$: ordine parziale ($2$ e $3$ non sono confrontabili).

Le relazioni come $<$ (non riflessive) si dicono ordini **stretti**.` },
        { id: 's01.relazioni.L3.e1', type: 'mcq', level: 1,
          prompt: String.raw`La relazione "$a$ divide $b$" su $\N\setminus\{0\}$ è un ordine totale?`,
          options: [
            String.raw`No: per esempio $2$ e $3$ non sono confrontabili.`,
            'Sì, perché è riflessiva, antisimmetrica e transitiva.',
            'No, perché non è transitiva.',
            'Non è nemmeno una relazione d\'ordine.',
          ],
          answer: 0,
          explain: String.raw`È un ordine (R, A, T) ma **parziale**: $2\nmid3$ e $3\nmid2$. Essere un ordine non basta per essere totale.` },
        { id: 's01.relazioni.L3.e2', type: 'tf', level: 1,
          prompt: String.raw`L'inclusione $\subseteq$ sui sottoinsiemi di $\{1,2\}$ è un ordine totale.`,
          answer: false,
          explain: String.raw`$\{1\}\not\subseteq\{2\}$ e $\{2\}\not\subseteq\{1\}$: sono due elementi non confrontabili. È un ordine parziale.` },
        { id: 's01.relazioni.L3.e3', type: 'match', level: 2,
          prompt: 'Abbina ogni relazione al suo tipo.',
          pairs: [
            [String.raw`$x\le y$ su $\R$`, "ordine totale"],
            [String.raw`$A\subseteq B$ sui sottoinsiemi di $X$`, "ordine parziale"],
            [String.raw`$a\equiv b\pmod 3$ su $\Z$`, 'equivalenza'],
            [String.raw`$x<y$ su $\R$`, 'ordine stretto (non riflessiva)'],
          ],
          explain: String.raw`$\le$ e $\subseteq$ sono R-A-T; solo $\le$ rende confrontabili tutte le coppie. La congruenza è R-S-T. $<$ è antisimmetrica e transitiva ma non riflessiva.` },
        { id: 's01.relazioni.L3.e4', type: 'mcq', level: 2,
          prompt: String.raw`Su $\R$ sia $x\,\mathcal R\,y\iff x^2\le y^2$. È una relazione d'ordine?`,
          options: [
            String.raw`No: non è antisimmetrica ($1\,\mathcal R\,{-1}$ e $-1\,\mathcal R\,1$ ma $1\neq-1$).`,
            String.raw`Sì, è un ordine totale.`,
            String.raw`No: non è riflessiva.`,
            String.raw`No: non è transitiva.`,
          ],
          answer: 0,
          explain: String.raw`È riflessiva e transitiva (eredita le proprietà di $\le$ su $x^2$), ma due numeri opposti sono in relazione in entrambi i versi senza essere uguali.` },
        { type: 'example', title: "La divisibilità è un ordine su $\\N\\setminus\\{0\\}$",
          problem: String.raw`Verifica che "$a\mid b$" è una relazione d'ordine su $\N\setminus\{0\}$.`,
          steps: [
            String.raw`Riflessiva: $a=1\cdot a$, quindi $a\mid a$.`,
            String.raw`Antisimmetrica: se $b=ha$ e $a=kb$ con $h,k\in\N$, allora $a=(kh)a$. Poiché $a\neq0$, $kh=1$, quindi $h=k=1$ e $a=b$.`,
            { text: String.raw`Transitiva: se $b=ha$ e $c=kb$ allora $c=(kh)a$, quindi $a\mid c$.`,
              ask: { type: 'mcq', prompt: String.raw`Su $\Z\setminus\{0\}$ la divisibilità è ancora antisimmetrica?`,
                options: [String.raw`No: $2\mid-2$ e $-2\mid2$ ma $2\neq-2$.`, 'Sì, come su $\\N$.', 'Sì, perché è transitiva.'], answer: 0,
                explain: String.raw`Con i negativi $kh=1$ ammette anche $h=k=-1$: si perde l'antisimmetria.` } },
          ],
          result: String.raw`Su $\N\setminus\{0\}$ la divisibilità è un ordine parziale.` },
        { id: 's01.relazioni.L3.e5', type: 'num', level: 2,
          prompt: String.raw`Quanti sottoinsiemi $B$ soddisfano $\{1\}\subseteq B\subseteq\{1,2,3\}$?`,
          answer: '4',
          explain: String.raw`$B$ deve contenere $1$; per $2$ e $3$ scelgo liberamente se metterli: $2\cdot2=4$ ($\{1\},\{1,2\},\{1,3\},\{1,2,3\}$).` },
        { id: 's01.relazioni.L3.e6', type: 'tf', level: 2,
          prompt: String.raw`In un ordine totale, se $a\not\preceq b$ allora $b\preceq a$.`,
          answer: true,
          explain: String.raw`Totale significa che per ogni coppia vale $a\preceq b$ oppure $b\preceq a$: se la prima è falsa, vale la seconda. In un ordine parziale invece potrebbero essere false entrambe.` },
        { id: 's01.relazioni.L3.e7', type: 'open', level: 2,
          prompt: String.raw`Dai la definizione di relazione d'ordine e spiega la differenza tra ordine totale e parziale, con un esempio per ciascuno.`,
          answer: String.raw`Una relazione $\preceq$ su $A$ è d'ordine se è riflessiva, antisimmetrica ($a\preceq b$ e $b\preceq a\Rightarrow a=b$) e transitiva. È totale se per ogni $a,b$ vale $a\preceq b$ oppure $b\preceq a$; altrimenti è parziale.

Esempi: $\le$ su $\R$ è totale; $\subseteq$ sui sottoinsiemi di $\{1,2\}$ è parziale perché $\{1\}$ e $\{2\}$ non sono confrontabili.`,
          rubric: ['Tre proprietà corrette (con antisimmetria scritta bene)', 'Definizione di ordine totale', 'Esempio di ordine totale', 'Esempio di ordine parziale con coppia non confrontabile'] },
        { id: 's01.relazioni.L3.e8', type: 'mcq', level: 3,
          prompt: String.raw`Su $\R$ sia $x\sim y\iff x-y\in\Q$. Quale affermazione è vera?`,
          options: [
            String.raw`Non è di equivalenza: non è transitiva.`,
            String.raw`È di equivalenza con una sola classe, $\R$, perché $\Q$ è denso.`,
            String.raw`È di equivalenza con classi finite.`,
            String.raw`È di equivalenza; ogni classe è numerabile, ma le classi sono in numero non numerabile.`,
          ],
          answer: 3,
          explain: String.raw`Riflessiva e simmetrica sono immediate; la transitività vale perché $\Q$ è chiuso per somma e differenza. Ogni classe $x+\Q$ è numerabile, ma $\R$ non è numerabile (vedi la skill sull'irrazionalità), quindi le classi sono non numerabili in numero. Densità di $\Q$ non significa una sola classe: $\sqrt2\not\sim0$.` },
      ],
    },
  ],
  practice: [
    { id: 's01.relazioni.p.gen-mod', type: 'gen', level: 1,
      gen: (R) => {
        const n = R.int(3, 9), a = R.nz(-60, 60);
        const r = ((a % n) + n) % n, q = (a - r) / n;
        return { type: 'num',
          prompt: String.raw`Qual è il rappresentante $r\in\{0,\dots,${n - 1}\}$ della classe di $${a}$ modulo $${n}$?`,
          answer: String(r),
          explain: String.raw`$${a}=${n}\cdot${q < 0 ? `(${q})` : q}+${r}$ con $0\le${r}<${n}$, quindi $${a}\equiv${r}\pmod{${n}}$.` };
      } },
    { id: 's01.relazioni.p.gen-cong', type: 'gen', level: 1,
      gen: (R) => {
        const n = R.int(3, 9), a = R.int(-40, 40);
        const same = R.chance(0.5);
        const b = same ? a + n * R.nz(-5, 5) : a + n * R.int(-4, 4) + R.int(1, n - 1);
        const d = a - b;
        return { type: 'tf',
          prompt: String.raw`Vale $${a}\equiv${b}\pmod{${n}}$?`,
          answer: d % n === 0,
          explain: d % n === 0
            ? String.raw`$${a}-(${b})=${d}=${n}\cdot${d / n < 0 ? `(${d / n})` : d / n}$ è multiplo di $${n}$: sono congrui.`
            : String.raw`$${a}-(${b})=${d}$ non è multiplo di $${n}$: non sono congrui.` };
      } },
    { id: 's01.relazioni.p.gen-props', type: 'gen', level: 2,
      gen: (R) => {
        const A = [1, 2, 3];
        const all = [];
        for (const a of A) for (const b of A) all.push([a, b]);
        let rel = all.filter(() => R.chance(0.35));
        if (R.chance(0.5)) for (const a of A) if (!rel.some((p) => p[0] === a && p[1] === a)) rel.push([a, a]);
        if (!rel.length) rel.push([1, 2]);
        rel.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
        const has = (a, b) => rel.some((p) => p[0] === a && p[1] === b);
        const why = [];
        const missD = A.find((a) => !has(a, a));
        const refl = missD === undefined;
        why.push(refl ? 'riflessiva: ci sono tutte le coppie $(a,a)$' : `non riflessiva: manca $(${missD},${missD})$`);
        const ns = rel.find(([a, b]) => !has(b, a));
        why.push(ns ? `non simmetrica: c'è $(${ns[0]},${ns[1]})$ ma non $(${ns[1]},${ns[0]})$` : 'simmetrica: ogni coppia ha la sua inversa');
        const na = rel.find(([a, b]) => a !== b && has(b, a));
        why.push(na ? `non antisimmetrica: ci sono $(${na[0]},${na[1]})$ e $(${na[1]},${na[0]})$` : 'antisimmetrica: nessuna coppia $(a,b)$ con $a\\neq b$ ha la sua inversa');
        let nt = null;
        for (const [a, b] of rel) for (const [c, d] of rel) if (!nt && b === c && !has(a, d)) nt = [a, b, d];
        why.push(nt ? `non transitiva: $(${nt[0]},${nt[1]})$ e $(${nt[1]},${nt[2]})$ ci sono, $(${nt[0]},${nt[2]})$ no` : 'transitiva: ogni "catena" $(a,b),(b,c)$ ha anche $(a,c)$');
        const flags = [refl, !ns, !na, !nt];
        const ans = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
        const options = relPropsNames.map((p) => p[0].toUpperCase() + p.slice(1)).concat(['Nessuna delle quattro']);
        return { type: 'mcq', noShuffle: true,
          prompt: String.raw`Su $A=\{1,2,3\}$ sia $\mathcal R=\{${rel.map((p) => `(${p[0]},${p[1]})`).join(',')}\}$. Quali proprietà ha $\mathcal R$? (più risposte)`,
          options,
          answer: ans.length ? ans : [4],
          explain: why.map((w) => '- ' + w[0].toUpperCase() + w.slice(1) + '.').join('\n') };
      } },
    { id: 's01.relazioni.p.gen-card', type: 'gen', level: 1,
      gen: (R) => {
        const m = R.int(2, 6), n = R.int(2, 6), s = R.int(2, 3);
        if (R.chance(0.5))
          return { type: 'num', prompt: String.raw`$|A|=${m}$ e $|B|=${n}$. Quanti elementi ha $A\times B$?`, answer: String(m * n),
            explain: String.raw`$|A\times B|=|A|\cdot|B|=${m}\cdot${n}=${m * n}$.` };
        return { type: 'num', prompt: String.raw`$|A|=${s}$. Quante relazioni su $A$ esistono (cioè quanti sottoinsiemi di $A\times A$)?`, answer: `2^${s * s}`,
          explain: String.raw`$A\times A$ ha $${s}^2=${s * s}$ elementi, e un insieme con $k$ elementi ha $2^k$ sottoinsiemi: $2^{${s * s}}$.` };
      } },
    { id: 's01.relazioni.p.1', type: 'mcq', level: 2,
      prompt: String.raw`Su $\Z$ sia $a\,\mathcal R\,b\iff a+b$ è pari. Che tipo di relazione è?`,
      options: ['Di equivalenza, con due classi (pari e dispari)', "D'ordine totale", 'Né riflessiva né simmetrica', 'Di equivalenza, con infinite classi'],
      answer: 0,
      explain: String.raw`$a+a=2a$ è pari (R); $a+b=b+a$ (S); se $a+b$ e $b+c$ sono pari, $a+c=(a+b)+(b+c)-2b$ è pari (T). $a+b$ pari significa $a,b$ con la stessa parità: due classi.` },
    { id: 's01.relazioni.p.2', type: 'tf', level: 1,
      prompt: String.raw`Ogni relazione d'ordine è anche simmetrica.`,
      answer: false,
      explain: String.raw`Un ordine è antisimmetrico; è anche simmetrico solo nel caso banale dell'uguaglianza. Esempio: $1\le2$ ma non $2\le1$.` },
    { id: 's01.relazioni.p.3', type: 'cloze', level: 1,
      prompt: "Completa la definizione di relazione d'ordine.",
      text: String.raw`Una relazione d'ordine è riflessiva, [[0]] e transitiva. È totale se [[1]].`,
      blanks: [
        { options: ['antisimmetrica', 'simmetrica', 'iniettiva'], answer: 0 },
        { options: ['due elementi qualsiasi sono confrontabili', 'è anche simmetrica', 'ha un elemento massimo'], answer: 0 },
      ],
      explain: String.raw`R-A-T; "totale" = ogni coppia è confrontabile.` },
    { id: 's01.relazioni.p.4', type: 'mcq', level: 2,
      prompt: String.raw`Sui sottoinsiemi di $\{1,2,3\}$ con l'ordine $\subseteq$, quale coppia NON è confrontabile?`,
      options: [String.raw`$\{1,2\}$ e $\{2,3\}$`, String.raw`$\{1\}$ e $\{1,3\}$`, String.raw`$\emptyset$ e $\{2\}$`, String.raw`$\{1,2,3\}$ e $\{3\}$`],
      answer: 0,
      explain: String.raw`Nessuno dei due contiene l'altro. Negli altri casi c'è inclusione ($\emptyset$ è contenuto in ogni insieme).` },
    { id: 's01.relazioni.p.5', type: 'open', level: 2,
      prompt: String.raw`Dimostra che la congruenza modulo $n$ su $\Z$ ($a\equiv b\iff n\mid a-b$) è una relazione di equivalenza.`,
      answer: String.raw`Riflessiva: $a-a=0=n\cdot0$. Simmetrica: se $a-b=nk$ allora $b-a=n(-k)$. Transitiva: se $a-b=nk$ e $b-c=nh$ allora $a-c=(a-b)+(b-c)=n(k+h)$.`,
      rubric: ['Riflessività', 'Simmetria', 'Transitività sommando le due differenze'] },
    { id: 's01.relazioni.p.6', type: 'num', level: 2,
      prompt: String.raw`Su $A=\{1,2,3,4,5,6\}$ sia $a\sim b\iff a\equiv b\pmod3$. Quanti elementi ha la classe $[2]$?`,
      answer: '2',
      explain: String.raw`$[2]\cap A=\{2,5\}$: i numeri di $A$ con resto $2$ nella divisione per $3$.` },
  ],
  flashcards: [
    { id: 's01.relazioni.fc1', kind: 'def', front: 'Relazione su un insieme $A$', back: String.raw`Un sottoinsieme $\mathcal R\subseteq A\times A$; si scrive $a\,\mathcal R\,b$ se $(a,b)\in\mathcal R$.` },
    { id: 's01.relazioni.fc2', kind: 'def', front: 'Proprietà riflessiva, simmetrica, antisimmetrica, transitiva', back: String.raw`R: $a\mathcal Ra$. S: $a\mathcal Rb\Rightarrow b\mathcal Ra$. A: $a\mathcal Rb\wedge b\mathcal Ra\Rightarrow a=b$. T: $a\mathcal Rb\wedge b\mathcal Rc\Rightarrow a\mathcal Rc$.` },
    { id: 's01.relazioni.fc3', kind: 'def', front: 'Relazione di equivalenza; classe; quoziente', back: String.raw`R + S + T. Classe $[a]=\{b: b\sim a\}$. Le classi sono disgiunte e ricoprono $A$ (partizione); il loro insieme è $A/\!\sim$.` },
    { id: 's01.relazioni.fc4', kind: 'def', front: "Relazione d'ordine; totale e parziale", back: String.raw`R + A + T. Totale se ogni coppia è confrontabile ($\le$ su $\R$), altrimenti parziale ($\subseteq$, divisibilità).` },
    { id: 's01.relazioni.fc5', kind: 'formula', front: 'Congruenza modulo $n$', back: String.raw`$a\equiv b\pmod n\iff n\mid a-b\iff$ stesso resto nella divisione per $n$. $n$ classi: $[0],\dots,[n-1]$.` },
    { id: 's01.relazioni.fc6', kind: 'errore', front: 'Trappole sulle proprietà', back: String.raw`Simmetrica e antisimmetrica non sono opposte (l'uguaglianza è entrambe). $<$ è antisimmetrica "a vuoto". Una proprietà "per ogni" si nega con **un** controesempio.` },
  ],
});

// ---------------------------------------------------------------------------
// s01.reali
// ---------------------------------------------------------------------------
// Helper per i generatori: MCD, frazioni ridotte, LaTeX pulito.
const gcdN = (x, y) => (y === 0 ? Math.abs(x) : gcdN(y, x % y));
const fracS = (p, q) => {
  if (q < 0) { p = -p; q = -q; }
  const g = gcdN(p, q) || 1;
  p /= g; q /= g;
  return q === 1 ? String(p) : `${p}/${q}`;
};
const fracTex = (p, q) => {
  if (q < 0) { p = -p; q = -q; }
  const g = gcdN(p, q) || 1;
  p /= g; q /= g;
  if (q === 1) return String(p);
  return p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
};
const linTex = (a, k) => {
  const c = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
  return k === 0 ? c : k > 0 ? `${c}+${k}` : `${c}-${-k}`;
};

S.push({
  id: 's01.reali',
  title: 'ℝ: ordine, intervalli, intorni, valore assoluto',
  summary: String.raw`Saprai manipolare le disuguaglianze in $\R$, scrivere insiemi come intervalli, usare intorni e valore assoluto, e risolvere disequazioni con $|\cdot|$.`,
  prereq: ['s00.disequazioni', 's00.logica', 's01.naturali'],
  examRefs: [],
  lessons: [
    {
      id: 's01.reali.L1',
      title: 'Il campo ordinato: regole sulle disuguaglianze',
      cards: [
        { type: 'learn', title: 'Ordinare i reali',
          body: String.raw`I reali $\R$ si sommano, si moltiplicano e si confrontano con $<$ e $\le$, come i razionali. Il confronto rispetta due regole:

- **somma**: se $a<b$, allora $a+c<b+c$ per ogni $c$;
- **prodotto per un positivo**: se $a<b$ e $c>0$, allora $ac<bc$;
- **prodotto per un negativo**: se $a<b$ e $c<0$, allora $ac>bc$.

>! Il verso di una disuguaglianza **cambia** solo quando si moltiplica o si divide per un numero **negativo**. Dimenticarlo è l'errore più frequente.` },
        { id: 's01.reali.L1.e1', type: 'mcq', level: 1,
          prompt: String.raw`Sia $a<b$. Quale affermazione è vera per ogni $c<0$?`,
          options: [String.raw`$ac<bc$`, String.raw`$ac>bc$`, String.raw`$ac=bc$`, String.raw`$a+c>b+c$`],
          answer: 1,
          explain: String.raw`Moltiplicare per un negativo inverte il verso: $a<b\Rightarrow ac>bc$. La prima risposta dimentica l'inversione. La quarta inverte anche la somma, che invece conserva il verso: $a+c<b+c$.` },
        { type: 'example', title: 'Disequazione lineare',
          problem: String.raw`Risolvi $3-2x\ge 7$.`,
          steps: [
            String.raw`Sottraggo $3$ a entrambi i membri: $-2x\ge 4$.`,
            { text: String.raw`Divido per $-2<0$: il verso cambia, quindi $x\le-2$.`,
              ask: { type: 'interval', prompt: String.raw`Quale insieme è la soluzione di $-2x\ge4$?`, answer: '(-inf,-2]',
                explain: String.raw`Dividere per $-2$ inverte il verso: $x\le-2$, cioè $(-\infty,-2]$.` } },
          ],
          result: String.raw`$S=(-\infty,-2]$: tutti i reali minori o uguali a $-2$.` },
        { id: 's01.reali.L1.e2', type: 'tf', level: 1,
          prompt: String.raw`Se $a<b$ e $c<d$, allora $a+c<b+d$.`,
          answer: true,
          explain: String.raw`Sommo le due disuguaglianze: $a+c<b+c$ e $b+c<b+d$, quindi $a+c<b+d$ per transitività. Le disuguaglianze si sommano sempre (con lo stesso verso).` },
        { id: 's01.reali.L1.e3', type: 'tf', level: 2,
          prompt: String.raw`Se $a<b$ e $c<d$, allora $ac<bd$.`,
          answer: false,
          explain: String.raw`Controesempio: $a=-2$, $b=-1$, $c=-2$, $d=-1$. Si ha $a<b$ e $c<d$, ma $ac=4$ e $bd=1$, quindi $ac\not<bd$. Con i negativi il prodotto non conserva il verso.` },
        { id: 's01.reali.L1.e4', type: 'mcq', level: 2,
          prompt: String.raw`Quali $x\in\R$ soddisfano $x^2>4$?`,
          options: [String.raw`$x>2$`, String.raw`$x<-2$ oppure $x>2$`, String.raw`$-2<x<2$`, 'Tutti i reali'],
          answer: 1,
          explain: String.raw`$x^2>4\iff|x|>2\iff x<-2$ oppure $x>2$. La risposta $x>2$ dimentica i negativi; $-2<x<2$ è l'insieme in cui $x^2<4$; "tutti" è falso perché $0^2=0$.` },
        { id: 's01.reali.L1.e5', type: 'num', level: 1,
          prompt: String.raw`Qual è il più piccolo intero $n$ tale che $n>\frac73$?`,
          answer: '3',
          explain: String.raw`$\frac73\approx2{,}33$. Il primo intero maggiore di $2{,}33$ è $3$. Non $2$: $2$ non supera $\frac73$.` },
        { type: 'example', title: 'Una media sta tra due numeri',
          problem: String.raw`Siano $a<b$. Dimostra che $a<\frac{a+b}{2}<b$.`,
          steps: [
            String.raw`Sommo $a$ a entrambi i membri di $a<b$: $2a<a+b$.`,
            { text: String.raw`Divido per $2>0$, il verso non cambia: $a<\frac{a+b}{2}$.`,
              ask: { type: 'expr', prompt: String.raw`Quanto vale $\frac{a+b}{2}-a$? Scrivi in funzione di $a$ e $b$.`, answer: '(b-a)/2', vars: ['a', 'b'],
                explain: String.raw`$\frac{a+b-2a}{2}=\frac{b-a}{2}$, che è positivo perché $a<b$.` } },
            String.raw`Con lo stesso ragionamento $\frac{a+b}{2}<b$. Quindi la media sta **strettamente** tra $a$ e $b$.`,
          ],
          result: String.raw`Tra due reali distinti c'è sempre un terzo reale: è il primo passo verso la densità di $\Q$ in $\R$.` },
        { id: 's01.reali.L1.e6', type: 'mcq', level: 1,
          prompt: String.raw`Sia $a<0<b$. Che segno ha $ab$?`,
          options: ['Positivo', 'Negativo', 'Zero', 'Non si può dire'],
          answer: 1,
          explain: String.raw`Il prodotto di un negativo per un positivo è negativo. Il segno dipende solo dai segni dei fattori, non dal loro valore: $(-1)\cdot 5=-5$ e $(-100)\cdot2=-200$.` },
      ],
    },
    {
      id: 's01.reali.L2',
      title: 'Intervalli, intorni e valore assoluto',
      cards: [
        { type: 'learn', title: 'Intervalli e intorni',
          body: String.raw`Un **intervallo** è un insieme di reali "senza buchi". Con $a<b$:
- $[a,b]=\{x: a\le x\le b\}$ (chiuso), $(a,b)=\{x: a<x<b\}$ (aperto), $[a,b)$ e $(a,b]$ (semiaperti);
- $(a,+\infty)=\{x: x>a\}$: $+\infty$ **non** è un numero, quindi si scrive sempre con la parentesi tonda.

Un **intorno** di $x_0$ di raggio $\varepsilon>0$ è l'intervallo aperto
$$I_\varepsilon(x_0)=(x_0-\varepsilon,\;x_0+\varepsilon)=\{x: |x-x_0|<\varepsilon\}.$$
>* Un intorno di $x_0$ è un intervallo aperto che contiene $x_0$.` },
        { id: 's01.reali.L2.e1', type: 'num', level: 1,
          prompt: String.raw`Quanto misura l'intervallo $[-3,7]$, cioè $7-(-3)$?`,
          answer: '10',
          explain: String.raw`La lunghezza è $7-(-3)=10$. Il meno davanti a $-3$ diventa più: è la distanza tra i due estremi.` },
        { id: 's01.reali.L2.e2', type: 'interval', level: 1,
          prompt: String.raw`Scrivi l'insieme $\{x\in\R: 1<x\le4\}$ come intervallo.`,
          answer: '(1,4]',
          explain: String.raw`$1$ è escluso (disuguaglianza stretta, parentesi tonda), $4$ è incluso ($\le$, parentesi quadra). Il risultato è $(1,4]$.` },
        { type: 'example', title: 'Da valore assoluto a intervallo',
          problem: String.raw`Descrivi $\{x\in\R: |x-2|<3\}$ come intervallo.`,
          steps: [
            String.raw`Per definizione, per $c>0$: $|t|<c\iff -c<t<c$.`,
            { text: String.raw`Con $t=x-2$ e $c=3$: $-3<x-2<3$.`,
              ask: { type: 'interval', prompt: String.raw`Aggiungo $2$ a tutte e tre le parti di $-3<x-2<3$: quale intervallo risulta per $x$?`, answer: '(-1,5)',
                explain: String.raw`$-3+2=-1$ e $3+2=5$, quindi $-1<x<5$.` } },
            String.raw`Quindi l'insieme è $(-1,5)$: è l'intorno di $2$ di raggio $3$.`,
          ],
          result: String.raw`$|x-x_0|<r\iff x\in(x_0-r,\,x_0+r)$.` },
        { id: 's01.reali.L2.e3', type: 'mcq', level: 1,
          prompt: String.raw`Qual è la definizione di $|x|$?`,
          options: [
            String.raw`$|x|=x$ per ogni $x\in\R$`,
            String.raw`$|x|=x$ se $x\ge0$ e $|x|=-x$ se $x<0$`,
            String.raw`$|x|=-x$ per ogni $x\in\R$`,
            String.raw`$|x|=\sqrt{x}$ per ogni $x\in\R$`,
          ],
          answer: 1,
          explain: String.raw`Il valore assoluto è la distanza da $0$, quindi non è negativo. La prima risposta fallisce per $x<0$; la terza è sempre $\le0$; la quarta non è definita per $x<0$.` },
        { id: 's01.reali.L2.e4', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $a,b\in\R$ vale $|a-b|=|b-a|$.`,
          answer: true,
          explain: String.raw`$a-b=-(b-a)$, e $|-t|=|t|$ per ogni $t$. La distanza tra $a$ e $b$ non dipende dall'ordine.` },
        { id: 's01.reali.L2.e5', type: 'mcq', level: 2,
          prompt: String.raw`Quale disuguaglianza vale per ogni $a,b\in\R$?`,
          options: [
            String.raw`$|a+b|=|a|+|b|$`,
            String.raw`$|a+b|\le|a|+|b|$`,
            String.raw`$|a+b|\ge|a|+|b|$`,
            String.raw`$|a-b|=|a|-|b|$`,
          ],
          answer: 1,
          explain: String.raw`È la disuguaglianza triangolare. Vale l'uguaglianza solo se $a$ e $b$ hanno lo stesso segno. Con $a=1$, $b=-1$: $|0|=0$, che non è $\ge2$, e $|1-(-1)|=2\ne 0$.` },
        { id: 's01.reali.L2.e6', type: 'tf', level: 2,
          prompt: String.raw`Per ogni $a,b\in\R$ vale $\big||a|-|b|\big|\le|a-b|$.`,
          answer: true,
          explain: String.raw`Da $|a|=|(a-b)+b|\le|a-b|+|b|$ segue $|a|-|b|\le|a-b|$. Scambiando $a$ e $b$ si ottiene $|b|-|a|\le|a-b|$. Insieme, le due danno la tesi.` },
        { id: 's01.reali.L2.e7', type: 'num', level: 1,
          prompt: String.raw`Calcola $|3-7|-|-2|$.`,
          answer: '2',
          explain: String.raw`$|3-7|=|-4|=4$ e $|-2|=2$, quindi $4-2=2$. Attenzione: prima si calcola il valore assoluto, poi si sottrae.` },
        { id: 's01.reali.L2.e8', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $|2x-1|<3$ e scrivi le soluzioni come intervallo.`,
          answer: '(-1,2)',
          explain: String.raw`$|2x-1|<3\iff-3<2x-1<3\iff-2<2x<4\iff-1<x<2$. Si divide tutto per $2>0$: il verso non cambia.` },
      ],
    },
    {
      id: 's01.reali.L3',
      title: 'Disequazioni con valore assoluto (livello d\'esame)',
      cards: [
        { type: 'learn', title: 'Le due regole da ricordare',
          body: String.raw`Con $c>0$ vale:
- $|t|<c\iff -c<t<c$ (una doppia disuguaglianza, un solo intervallo);
- $|t|>c\iff t<-c$ **oppure** $t>c$ (due semirette, cioè un'unione).

Con $c<0$: $|t|<c$ non ha soluzioni, mentre $|t|>c$ è vera per ogni $t$.

>! Errore tipico: scrivere $|t|<c\iff t<c$ dimenticando la parte $t>-c$.` },
        { type: 'example', title: 'Il valore assoluto maggiore di un numero',
          problem: String.raw`Risolvi $|x+1|>2$.`,
          steps: [
            String.raw`Con $c=2>0$: $|t|>2\iff t<-2$ oppure $t>2$. Qui $t=x+1$.`,
            { text: String.raw`Quindi $x+1<-2$ oppure $x+1>2$.`,
              ask: { type: 'interval', prompt: String.raw`Risolvendo entrambe e unendo le soluzioni, quale insieme si ottiene?`, answer: '(-inf,-3)U(1,inf)',
                explain: String.raw`$x<-3$ oppure $x>1$: l'unione è $(-\infty,-3)\cup(1,+\infty)$.` } },
            String.raw`Non c'è un solo intervallo: la soluzione è un'unione di due semirette.`,
          ],
          result: String.raw`$S=(-\infty,-3)\cup(1,+\infty)$.` },
        { id: 's01.reali.L3.e1', type: 'mcq', level: 2,
          prompt: String.raw`L'insieme $\{x\in\R: |x-2|\le0\}$ è:`,
          options: [String.raw`$\{2\}$`, String.raw`$(2,+\infty)$`, 'Vuoto', String.raw`$[0,2]$`],
          answer: 0,
          explain: String.raw`Un valore assoluto è sempre $\ge0$, quindi $|x-2|\le0$ richiede $|x-2|=0$, cioè $x=2$. "Vuoto" pensa che il valore assoluto non possa mai essere $0$; $[0,2]$ confonde $x$ con $|x-2|$.` },
        { id: 's01.reali.L3.e2', type: 'mcq', level: 2,
          prompt: String.raw`Un errore nel passaggio $|x-2|<5\Rightarrow x-2<5$. Quale?`,
          options: [
            String.raw`Manca la parte $x-2>-5$: il valore assoluto obbliga a considerare anche i valori negativi.`,
            'Nessun errore: il passaggio è corretto.',
            String.raw`Il verso dovrebbe cambiare.`,
            String.raw`Bisognava elevare al cubo.`,
          ],
          answer: 0,
          explain: String.raw`Da $|t|<5$ segue $-5<t<5$. Il passaggio scritto dà solo $t<5$: per $x=-100$ la disequazione iniziale è falsa, eppure $x-2<5$ sarebbe vera.` },
        { id: 's01.reali.L3.e3', type: 'interval', level: 2,
          prompt: String.raw`Risolvi $|2x-1|\ge3$ e scrivi le soluzioni come unione di intervalli.`,
          answer: '(-inf,-1]U[2,inf)',
          explain: String.raw`$|2x-1|\ge3\iff 2x-1\ge3$ oppure $2x-1\le-3\iff x\ge2$ oppure $x\le-1$. Le parentesi sono quadre perché la disuguaglianza non è stretta.` },
        { id: 's01.reali.L3.e4', type: 'mcq', level: 3,
          prompt: String.raw`Sia $A=\{x\in\R:\ |x-1|<|x+1|\}$. Quale affermazione è vera?`,
          options: [String.raw`$A=(0,+\infty)$`, String.raw`$A=(-\infty,0)$`, String.raw`$A=(1,+\infty)$`, String.raw`$A=\R$`],
          answer: 0,
          explain: String.raw`Entrambi i membri sono $\ge0$: elevo al quadrato. Si ottiene $x^2-2x+1<x^2+2x+1$, cioè $-4x<0$, cioè $x>0$. Controllo: con $x=0.5$, $|-0.5|=0.5<1.5$ (vero); con $x=-1$, $2<0$ (falso).` },
        { id: 's01.reali.L3.e5', type: 'interval', level: 3,
          prompt: String.raw`Risolvi $\left|\dfrac{x-1}{x+2}\right|\le1$ e scrivi l'insieme delle soluzioni come intervallo.`,
          answer: '[-1/2,inf)',
          explain: String.raw`Il dominio esclude $x=-2$. Per $x\ne-2$ la condizione è $|x-1|\le|x+2|$; elevando al quadrato, $x^2-2x+1\le x^2+4x+4$, cioè $-6x\le3$, cioè $x\ge-\frac12$. Il punto $-2$ non è nel dominio e non appartiene comunque a $[-\frac12,+\infty)$.` },
        { id: 's01.reali.L3.e6', type: 'problem', level: 3,
          prompt: String.raw`Sia $A=\{x\in\R:\ |2x-1|\le|x+3|\}$.`,
          parts: [
            { type: 'interval', prompt: String.raw`Scrivi $A$ come intervallo.`, answer: '[-2/3,4]',
              explain: String.raw`Elevo al quadrato: $(2x-1)^2\le(x+3)^2\iff 3x^2-10x-8\le0\iff(3x+2)(x-4)\le0$. Il prodotto è $\le0$ tra le radici: $-\frac23\le x\le4$.` },
            { type: 'tf', prompt: String.raw`$A$ è limitato superiormente.`, answer: true,
              explain: String.raw`$A\subseteq(-\infty,4]$, quindi $4$ è un maggiorante.` },
          ],
          solution: String.raw`$|2x-1|\le|x+3|\iff(2x-1)^2\le(x+3)^2\iff 3x^2-10x-8\le0\iff(3x+2)(x-4)\le0$. Quindi $A=\left[-\frac23,4\right]$. È limitato, con maggiorante $4$.` },
      ],
    },
  ],
  practice: [
    { id: 's01.reali.p.gen-lin', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.nz(-5, 5), b = R.int(-9, 9), c = R.int(-9, 9);
        const d = c - b;
        const v = fracS(d, a);
        const pos = a > 0;
        return { type: 'interval',
          prompt: String.raw`Risolvi $${linTex(a, b)}<${c}$. Scrivi le soluzioni come intervallo.`,
          answer: pos ? `(-inf,${v})` : `(${v},inf)`,
          explain: String.raw`Sposto il termine noto: $${linTex(a, 0)}<${d}$. ${pos ? `Divido per $${a}>0$: il verso resta.` : `Divido per $${a}<0$: il verso cambia.`} Quindi $x${pos ? '<' : '>'}${fracTex(d, a)}$.` };
      } },
    { id: 's01.reali.p.gen-abs', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.pick([1, 2, 3, -1, -2, -3]), b = R.int(-7, 7), c = R.int(1, 8);
        const n1 = (-c - b) / a, n2 = (c - b) / a;
        const e1 = fracS(-c - b, a), e2 = fracS(c - b, a);
        const t1 = fracTex(-c - b, a), t2 = fracTex(c - b, a);
        const [L, H] = n1 < n2 ? [e1, e2] : [e2, e1];
        const [tL, tH] = n1 < n2 ? [t1, t2] : [t2, t1];
        const absT = `|${linTex(a, b)}|`;
        if (R.chance(0.6))
          return { type: 'interval',
            prompt: String.raw`Risolvi $${absT}<${c}$. Scrivi le soluzioni come intervallo.`,
            answer: `(${L},${H})`,
            explain: String.raw`$${absT}<${c}\iff -${c}<${linTex(a, b)}<${c}$: le soluzioni stanno tra i due valori che annullano la parte di sinistra, cioè $x\in(${tL},\,${tH})$.` };
        return { type: 'interval',
          prompt: String.raw`Risolvi $${absT}>${c}$. Scrivi le soluzioni come unione di intervalli.`,
          answer: `(-inf,${L})U(${H},inf)`,
          explain: String.raw`$${absT}>${c}$ equivale a $${linTex(a, b)}<-${c}$ oppure $${linTex(a, b)}>${c}$. Le soluzioni sono $x<${tL}$ oppure $x>${tH}$.` };
      } },
    { id: 's01.reali.p.gen-sq', type: 'gen', level: 3,
      gen: (R) => {
        const a = R.int(-6, 6), b = a + 2 * R.nz(-3, 3);
        const m = (a + b) / 2;
        const sh = (k) => (k === 0 ? '' : k > 0 ? `-${k}` : `+${-k}`);
        return { type: 'interval',
          prompt: String.raw`Risolvi $|x${sh(a)}|<|x${sh(b)}|$. Scrivi le soluzioni come intervallo.`,
          answer: b > a ? `(-inf,${m})` : `(${m},inf)`,
          explain: String.raw`Entrambi i membri sono $\ge0$: elevo al quadrato. Si ottiene $-2ax+a^2<-2bx+b^2$, cioè $2(b-a)x<b^2-a^2$. Dividendo per $2(b-a)$ ${b > a ? 'positivo, il verso resta' : 'negativo, il verso cambia'}: $x${b > a ? '<' : '>'}${m}$, perché $\frac{a+b}{2}=${m}$.` };
      } },
    { id: 's01.reali.p.gen-num', type: 'gen', level: 1,
      gen: (R) => {
        const p = R.nz(-9, 9), q = R.nz(-9, 9);
        return { type: 'num',
          prompt: String.raw`Calcola $|${p}|-|${q}|$.`,
          answer: String(Math.abs(p) - Math.abs(q)),
          explain: String.raw`$|${p}|=${Math.abs(p)}$ e $|${q}|=${Math.abs(q)}$, quindi il risultato è $${Math.abs(p) - Math.abs(q)}$.` };
      } },
    { id: 's01.reali.p.1', type: 'tf', level: 1,
      prompt: String.raw`Per ogni $x\in\R$ vale $\sqrt{x^2}=x$.`,
      answer: false,
      explain: String.raw`$\sqrt{x^2}=|x|$: per $x=-3$ il risultato è $3$, non $-3$.` },
    { id: 's01.reali.p.2', type: 'num', level: 1,
      prompt: String.raw`Quanti interi $n$ soddisfano $|n|\le2$?`,
      answer: '5',
      explain: String.raw`Sono $-2,-1,0,1,2$: cinque interi.` },
    { id: 's01.reali.p.3', type: 'cloze', level: 1,
      prompt: 'Completa la definizione di intorno.',
      text: String.raw`Un intorno di $x_0$ è un [[0]] aperto che contiene $x_0$. In particolare $|x-x_0|<\varepsilon$ equivale a $x\in$ [[1]].`,
      blanks: [
        { options: ['intervallo', 'numero', 'insieme finito'], answer: 0 },
        { options: [String.raw`$(x_0-\varepsilon,\,x_0+\varepsilon)$`, String.raw`$[x_0-\varepsilon,\,x_0+\varepsilon]$`, String.raw`$(x_0,\,x_0+\varepsilon)$`], answer: 0 },
      ],
      explain: String.raw`Il raggio $\varepsilon$ è strettamente positivo e la disuguaglianza è stretta: estremi esclusi. $(x_0,x_0+\varepsilon)$ dimentica la parte sinistra.` },
    { id: 's01.reali.p.4', type: 'match', level: 2,
      prompt: 'Abbina ogni insieme alla sua descrizione come intervallo.',
      pairs: [
        [String.raw`$\{x: |x-1|\le1\}$`, String.raw`$[0,2]$`],
        [String.raw`$\{x: |x|<2\}$`, String.raw`$(-2,2)$`],
        [String.raw`$\{x: 0\le x<1\}$`, String.raw`$[0,1)$`],
        [String.raw`$\{x: x\le3\}$`, String.raw`$(-\infty,3]$`],
      ],
      explain: String.raw`$|x-1|\le1\iff0\le x\le2$; $|x|<2\iff-2<x<2$. Gli altri due si leggono direttamente: $[0,1)$ include lo zero ed esclude $1$; $x\le3$ include $3$ e non ha estremo inferiore.` },
    { id: 's01.reali.p.5', type: 'open', level: 2,
      prompt: String.raw`Dimostra che, per $\varepsilon>0$, $|x|<\varepsilon$ se e solo se $-\varepsilon<x<\varepsilon$.`,
      answer: String.raw`Caso $x\ge0$: $|x|=x$, quindi $|x|<\varepsilon$ equivale a $x<\varepsilon$, e $-\varepsilon<x$ è automatica perché $x\ge0>-\varepsilon$. Caso $x<0$: $|x|=-x$, quindi $-x<\varepsilon$ equivale a $x>-\varepsilon$, e $x<\varepsilon$ è automatica perché $x<0<\varepsilon$. In entrambi i casi le due condizioni coincidono.`,
      rubric: ['Distinzione dei casi $x\ge0$ e $x<0$', 'Uso corretto di $|x|=\pm x$ in ciascun caso', 'Conclusione per doppia implicazione'] },
    { id: 's01.reali.p.6', type: 'order', level: 2,
      prompt: 'Riordina i passi della dimostrazione di $|a+b|\le|a|+|b|$.',
      steps: [
        String.raw`Per ogni $t\in\R$ vale $-|t|\le t\le|t|$.`,
        String.raw`Applico questo a $t=a$ e a $t=b$ e sommo: $-(|a|+|b|)\le a+b\le|a|+|b|$.`,
        String.raw`Per la caratterizzazione $|s|\le c\iff -c\le s\le c$, con $s=a+b$ e $c=|a|+|b|$, segue $|a+b|\le|a|+|b|$.`,
      ],
      distractors: [
        String.raw`Elevo al quadrato: $|a+b|^2=a^2+b^2$, quindi la tesi è vera.`,
        String.raw`Scelgo $a=b=0$: la disuguaglianza è dimostrata.`,
      ],
      explain: String.raw`Il primo passo è la definizione di valore assoluto; il secondo somma le due disuguaglianze; il terzo chiude. Le due distrattori sono errori tipici: $|a+b|^2=a^2+2ab+b^2$ (non $a^2+b^2$), e un esempio particolare non dimostra nulla.` },
  ],
  flashcards: [
    { id: 's01.reali.fc1', kind: 'def', front: 'Campo ordinato', back: String.raw`$\R$ è un campo (somma, prodotto, opposti, inversi dei non nulli) con un ordine totale compatibile: $a<b\Rightarrow a+c<b+c$, e $c>0$ conserva il verso mentre $c<0$ lo inverte.` },
    { id: 's01.reali.fc2', kind: 'def', front: 'Intervallo', back: String.raw`Insieme $I\subseteq\R$ tale che $a,b\in I$ e $a<c<b$ implicano $c\in I$ (nessun "buco"). Forme: $(a,b)$, $[a,b]$, $[a,b)$, $(a,b]$, con $\pm\infty$ sempre tra tonde.` },
    { id: 's01.reali.fc3', kind: 'def', front: String.raw`Intorno di $x_0$ di raggio $\varepsilon$`, back: String.raw`$I_\varepsilon(x_0)=(x_0-\varepsilon,x_0+\varepsilon)=\{x: |x-x_0|<\varepsilon\}$ con $\varepsilon>0$.` },
    { id: 's01.reali.fc4', kind: 'def', front: 'Valore assoluto', back: String.raw`$|x|=x$ se $x\ge0$, $|x|=-x$ se $x<0$. È la distanza da $0$: $|x|\ge0$ e $|x|=0\iff x=0$.` },
    { id: 's01.reali.fc5', kind: 'thm', front: 'Disuguaglianza triangolare (enunciato)', back: String.raw`Per ogni $a,b\in\R$: $|a+b|\le|a|+|b|$.` },
    { id: 's01.reali.fc6', kind: 'dim', front: 'Dimostrazione della disuguaglianza triangolare', back: String.raw`Per ogni $t$ vale $-|t|\le t\le|t|$. Sommo le due disuguaglianze per $t=a$ e $t=b$: $-(|a|+|b|)\le a+b\le|a|+|b|$, cioè $|a+b|\le|a|+|b|$.` },
    { id: 's01.reali.fc7', kind: 'thm', front: 'Proprietà archimedea', back: String.raw`Per ogni $x\in\R$ esiste $n\in\N$ con $n>x$. Non esistono numeri "infinitamente grandi" in $\R$.` },
    { id: 's01.reali.fc8', kind: 'thm', front: 'Densità di $\Q$ in $\R$ (enunciato)', back: String.raw`Tra due reali distinti $a<b$ esiste sempre un razionale $q$ con $a<q<b$ (e quindi anche un irrazionale).` },
    { id: 's01.reali.fc9', kind: 'metodo', front: 'Disequazioni con valore assoluto', back: String.raw`Con $c>0$: $|t|<c\iff -c<t<c$ (un intervallo); $|t|>c\iff t<-c$ oppure $t>c$ (un'unione). Con $c<0$: $|t|<c$ è impossibile, $|t|>c$ è sempre vera.` },
    { id: 's01.reali.fc10', kind: 'errore', front: 'Errori tipici con le disuguaglianze', back: String.raw`Il verso cambia solo per moltiplicazione o divisione per un negativo, non per somme. Il valore assoluto non è mai negativo: $|x|\le 0$ dà solo $x=0$. Per $|t|<c$ non basta $t<c$: serve anche $t>-c$.` },
  ],
});
