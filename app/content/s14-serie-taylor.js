import { H } from '../engine/tex.js';

// ---------- helper per i generatori ----------
const fact = (m) => {
  let r = 1;
  for (let i = 2; i <= m; i++) r *= i;
  return r;
};

/** coseno e seno dei valori notevoli di θ: [θ tex, θ math, cos math, cos tex, sin math, sin tex] */
const TH = [
  ['\\frac{\\pi}{6}', 'pi/6', 'sqrt(3)/2', '\\frac{\\sqrt{3}}{2}', '1/2', '\\frac{1}{2}'],
  ['\\frac{\\pi}{4}', 'pi/4', 'sqrt(2)/2', '\\frac{\\sqrt{2}}{2}', 'sqrt(2)/2', '\\frac{\\sqrt{2}}{2}'],
  ['\\frac{\\pi}{3}', 'pi/3', '1/2', '\\frac{1}{2}', 'sqrt(3)/2', '\\frac{\\sqrt{3}}{2}'],
  ['\\frac{\\pi}{2}', 'pi/2', '0', '0', '1', '1'],
  ['\\frac{2\\pi}{3}', '2*pi/3', '-1/2', '-\\frac{1}{2}', 'sqrt(3)/2', '\\frac{\\sqrt{3}}{2}'],
  ['\\frac{3\\pi}{4}', '3*pi/4', '-sqrt(2)/2', '-\\frac{\\sqrt{2}}{2}', 'sqrt(2)/2', '\\frac{\\sqrt{2}}{2}'],
  ['\\frac{5\\pi}{6}', '5*pi/6', '-sqrt(3)/2', '-\\frac{\\sqrt{3}}{2}', '1/2', '\\frac{1}{2}'],
  ['\\pi', 'pi', '-1', '-1', '0', '0'],
];

// =====================================================================
// s14.serie — serie di potenze, raggio, serie di Taylor, sviluppabilità, Eulero
// =====================================================================
const SERIE = {
  id: 's14.serie',
  title: 'Serie di Taylor',
  summary: String.raw`Calcoli raggio e intervallo di convergenza di una serie di potenze, scrivi la serie di Taylor di una funzione e stabilisci quando la serie è uguale alla funzione.`,
  prereq: ['s10.formula', 's10.sviluppi', 's13.def', 's13.positivi'],
  examRefs: ['Itinere 15/01/2026 · A', 'Itinere 15/01/2026 · B'],
  lessons: [
    {
      id: 's14.serie.L1',
      title: 'Serie di potenze: per quali x converge?',
      cards: [
        {
          type: 'learn',
          title: 'Un polinomio che non finisce mai',
          body: String.raw`Un polinomio di grado $n$ approssima una funzione vicino a un punto. Se aggiungiamo sempre nuovi termini otteniamo una **serie**. Per esempio, per $|x|<1$:
$$1+x+x^2+x^3+\cdots=\frac{1}{1-x}.$$
Con $x=0{,}5$ la somma dei primi termini si avvicina a $\frac{1}{1-0{,}5}=2$. Con $x=2$ invece i termini crescono e la somma non si avvicina a niente. La stessa serie **vale** per alcuni $x$ e **non vale** per altri: il primo problema è capire per quali $x$ una serie converge.`,
          plot: {
            fns: [{ f: '1/(1-x)', label: '1/(1-x)' }, { f: '1+x+x^2+x^3+x^4+x^5', label: 'somma dei primi 6 termini' }],
            x: [-2, 0.9],
            y: [-1, 4],
          },
        },
        {
          type: 'learn',
          title: 'Serie di potenze e raggio di convergenza',
          body: String.raw`Una **serie di potenze** centrata in $x_0$ è
$$\sum_{n=0}^{+\infty}c_n\,(x-x_0)^n .$$
I numeri $c_n$ sono i **coefficienti**. Esiste sempre un numero $R\in[0,+\infty]$, detto **raggio di convergenza**.

>* Per $|x-x_0|<R$ la serie converge assolutamente; per $|x-x_0|>R$ la serie non converge. Sul bordo, cioè per $|x-x_0|=R$, non si può concludere in generale: gli **estremi** si studiano uno per uno.

L'insieme dei $x$ in cui la serie converge si chiama **intervallo di convergenza**: è un intervallo centrato in $x_0$, con eventualmente uno o entrambi gli estremi inclusi.`,
        },
        {
          type: 'learn',
          title: 'Come si calcola R',
          body: String.raw`Quando il limite esiste, si usa il rapporto dei coefficienti:
$$R=\lim_{n\to+\infty}\left|\frac{c_n}{c_{n+1}}\right| \qquad\text{oppure}\qquad R=\frac{1}{\lim_{n\to+\infty}\sqrt[n]{|c_n|}} .$$
Se il limite del rapporto vale $0$ si ha $R=0$ (la serie converge solo in $x_0$); se vale $+\infty$ si ha $R=+\infty$ (converge per ogni $x$).

>! Il raggio dice **dove** la serie converge, non dice nulla sugli estremi: quelli vanno sempre controllati a parte, sostituendo $x=x_0\pm R$ nella serie numerica.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: raggio e intervallo',
          problem: String.raw`Trova il raggio e l'intervallo di convergenza di $\displaystyle\sum_{n\ge1}\frac{(x+1)^n}{n\,2^n}$.`,
          steps: [
            String.raw`Il centro è $x_0=-1$ e il coefficiente è $c_n=\dfrac{1}{n\,2^n}$. Calcolo il rapporto: $\left|\dfrac{c_n}{c_{n+1}}\right|=\dfrac{(n+1)\,2^{n+1}}{n\,2^n}=\dfrac{2(n+1)}{n}$.`,
            {
              text: String.raw`Il rapporto tende a $2$, quindi $R=2$. La serie converge se $|x+1|<2$, cioè per $-3<x<1$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $\displaystyle\lim_{n\to+\infty}\frac{2(n+1)}{n}$?`,
                answer: '2',
                explain: String.raw`Divido per $n$: $\dfrac{2(n+1)}{n}=2+\dfrac{2}{n}\to 2$.`,
              },
            },
            String.raw`Restano gli estremi. Per $x=1$ la serie diventa $\displaystyle\sum_{n\ge1}\frac{2^n}{n\,2^n}=\sum_{n\ge1}\frac1n$, che diverge.`,
            {
              text: String.raw`Per $x=-3$ la serie diventa $\displaystyle\sum_{n\ge1}\frac{(-2)^n}{n\,2^n}=\sum_{n\ge1}\frac{(-1)^n}{n}$, che converge per Leibniz. Quindi l'intervallo include $-3$ ma non $1$.`,
              ask: {
                type: 'interval',
                prompt: String.raw`Qual è l'intervallo di convergenza?`,
                answer: '[-3,1)',
                explain: String.raw`Il bordo sinistro è incluso (Leibniz), quello destro no (serie armonica).`,
              },
            },
          ],
          result: String.raw`Raggio $R=2$, intervallo di convergenza $[-3,1)$.`,
        },
        {
          id: 's14.serie.L1.c1', type: 'num', level: 1,
          prompt: String.raw`Qual è il raggio di convergenza di $\displaystyle\sum_{n\ge1}\frac{x^n}{n^2\,3^n}$?`,
          answer: '3',
          explain: String.raw`$\left|\dfrac{c_n}{c_{n+1}}\right|=3\left(\dfrac{n+1}{n}\right)^2\to 3$. Quindi $R=3$.`,
        },
        {
          id: 's14.serie.L1.c2', type: 'num', level: 1,
          prompt: String.raw`Qual è il raggio di convergenza di $\displaystyle\sum_{n\ge0}n!\,x^n$?`,
          answer: '0',
          explain: String.raw`$\dfrac{c_n}{c_{n+1}}=\dfrac{n!}{(n+1)!}=\dfrac{1}{n+1}\to 0$. Quindi $R=0$: la serie converge solo per $x=0$.`,
        },
        {
          id: 's14.serie.L1.c3', type: 'num', level: 2,
          prompt: String.raw`Qual è il raggio di convergenza di $\displaystyle\sum_{n\ge0}\frac{x^n}{n!}$? Scrivi $\inf$ se è infinito.`,
          answer: 'inf',
          explain: String.raw`$\dfrac{c_n}{c_{n+1}}=\dfrac{(n+1)!}{n!}=n+1\to+\infty$. Quindi $R=+\infty$: la serie converge per ogni $x$ reale.`,
        },
        {
          id: 's14.serie.L1.c4', type: 'interval', level: 2,
          prompt: String.raw`Qual è l'intervallo di convergenza di $\displaystyle\sum_{n\ge1}\frac{x^n}{n}$?`,
          answer: '[-1,1)',
          explain: String.raw`$R=1$. Per $x=1$ la serie è $\sum\frac1n$ (diverge). Per $x=-1$ è $\sum\frac{(-1)^n}{n}$ (converge per Leibniz). Quindi $[-1,1)$.`,
        },
        {
          id: 's14.serie.L1.c5', type: 'interval', level: 2,
          prompt: String.raw`Qual è l'intervallo di convergenza di $\displaystyle\sum_{n\ge1}\frac{x^n}{n^2}$?`,
          answer: '[-1,1]',
          explain: String.raw`$R=1$. Agli estremi si ottiene $\sum\frac{1}{n^2}$ (per $x=1$) e $\sum\frac{(-1)^n}{n^2}$ (per $x=-1$): convergono entrambe, anzi assolutamente. Quindi $[-1,1]$.`,
        },
        {
          id: 's14.serie.L1.c6', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: se $\sum c_n x^n$ converge per $x=3$, allora converge anche per $x=2$.`,
          answer: true,
          explain: String.raw`Vero (lemma di Abel). Se converge in $x=3$, il raggio è almeno $3$: la serie converge assolutamente per $|x|<3$, quindi anche per $x=2$.`,
        },
        {
          id: 's14.serie.L1.c7', type: 'cloze', level: 1,
          text: String.raw`Per una serie di potenze di raggio $R$: se $|x-x_0|<R$ la serie [[0]]; se $|x-x_0|>R$ la serie [[1]].`,
          blanks: [
            {
              options: [String.raw`converge assolutamente`, String.raw`diverge`, String.raw`è indeterminata`, String.raw`converge solo in $x_0$`],
              answer: 0,
            },
            {
              options: [String.raw`converge assolutamente`, String.raw`diverge`, String.raw`è indeterminata`, String.raw`converge solo in $x_0$`],
              answer: 1,
            },
          ],
          explain: String.raw`Dentro il raggio la convergenza è assoluta; fuori la serie diverge (il termine generale non tende a zero).`,
        },
        {
          id: 's14.serie.L1.c8', type: 'match', level: 1,
          prompt: String.raw`Abbina ogni serie al suo raggio di convergenza.`,
          pairs: [
            [String.raw`$\displaystyle\sum_{n\ge0}x^n$`, String.raw`$R=1$`],
            [String.raw`$\displaystyle\sum_{n\ge0}n!\,x^n$`, String.raw`$R=0$`],
            [String.raw`$\displaystyle\sum_{n\ge0}\frac{x^n}{n!}$`, String.raw`$R=+\infty$`],
            [String.raw`$\displaystyle\sum_{n\ge0}2^n x^n$`, String.raw`$R=\dfrac12$`],
          ],
          explain: String.raw`Per $\sum 2^nx^n$ il rapporto dei coefficienti è $\frac{2^n}{2^{n+1}}=\frac12$. Attenzione: moltiplicare i coefficienti per $2^n$ **dimezza** il raggio.`,
        },
        {
          id: 's14.serie.L1.c9', type: 'num', level: 2,
          prompt: String.raw`La serie $\displaystyle\sum_{n\ge0}4^n\,x^{2n}$ converge per $|x|<\rho$ e diverge per $|x|>\rho$. Quanto vale $\rho$?`,
          answer: '1/2',
          explain: String.raw`Con $y=x^2$ la serie è $\sum(4y)^n$: converge per $|4y|<1$, cioè $x^2<\frac14$, quindi $|x|<\frac12$. La variabile del raggio è $x$, ma la serie contiene solo le potenze pari.`,
        },
        {
          id: 's14.serie.L1.c10', type: 'open', level: 2, points: 2,
          prompt: String.raw`Definisci il raggio di convergenza di una serie di potenze $\sum c_n(x-x_0)^n$ e spiega che cosa succede dentro e fuori l'intervallo $(x_0-R,x_0+R)$.`,
          answer: String.raw`Il raggio $R\in[0,+\infty]$ è l'unico numero tale che la serie converge assolutamente per $|x-x_0|<R$ e non converge per $|x-x_0|>R$. Sul bordo $|x-x_0|=R$ bisogna studiare gli estremi a parte.`,
          rubric: [
            String.raw`Definisce $R$ come numero che separa convergenza e non convergenza`,
            String.raw`Dentro l'intervallo: convergenza assoluta; fuori: non convergenza`,
            String.raw`Ricorda che sugli estremi non si conclude in generale`,
          ],
        },
      ],
    },
    {
      id: 's14.serie.L2',
      title: 'Serie di Taylor e sviluppabilità',
      cards: [
        {
          type: 'learn',
          title: 'Dalle derivate ai coefficienti',
          body: String.raw`Se $f$ è derivabile infinite volte in $x_0$, possiamo cercare un polinomio che abbia in $x_0$ le stesse derivate di $f$. Il termine $(x-x_0)^n$ deve avere coefficiente $\dfrac{f^{(n)}(x_0)}{n!}$: così, derivando $n$ volte, il polinomio dà proprio $f^{(n)}(x_0)$ (il fattore $n!$ compensa le derivate del monomio).

Il **polinomio di Taylor** di ordine $n$ è la somma dei primi $n+1$ termini. Facendo crescere $n$ otteniamo una serie. Nel grafico: $\cos x$ e il suo polinomio di ordine $4$ in $x=0$.`,
          plot: {
            fns: [{ f: 'cos(x)', label: 'cos x' }, { f: '1-x^2/2+x^4/24', label: 'polinomio di ordine 4' }],
            x: [-3, 3],
            y: [-2, 2],
          },
        },
        {
          type: 'learn',
          title: 'Serie di Taylor e di McLaurin',
          body: String.raw`>* La **serie di Taylor** di $f$ in $x_0$ è
$$\sum_{n=0}^{+\infty}\frac{f^{(n)}(x_0)}{n!}\,(x-x_0)^n .$$
Se $x_0=0$ si parla di **serie di McLaurin**. Per costruirla basta conoscere le derivate di $f$ in $x_0$; se $f$ è $C^\infty$ la serie si può sempre scrivere.

Scrivere la serie **non** dice che essa somigli a $f$: una serie costruita con le derivate può convergere a un'altra funzione, o non convergere affatto. Per questo serve un criterio, che vedremo tra poco.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: McLaurin di $e^{2x}$',
          problem: String.raw`Scrivi la serie di McLaurin di $f(x)=e^{2x}$.`,
          steps: [
            String.raw`Derivando si ottiene $f'(x)=2e^{2x}$, $f''(x)=4e^{2x}$ e in generale $f^{(n)}(x)=2^n e^{2x}$.`,
            {
              text: String.raw`Con $x=0$ si ha $e^0=1$, quindi $f^{(n)}(0)=2^n$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $f'''(0)$ per $f(x)=e^{2x}$?`,
                answer: '8',
                explain: String.raw`$f'''(x)=2^3e^{2x}$, quindi $f'''(0)=8$.`,
              },
            },
            String.raw`Il coefficiente di $x^n$ è $\dfrac{f^{(n)}(0)}{n!}=\dfrac{2^n}{n!}$.`,
            {
              text: String.raw`Quindi la serie di McLaurin è $\displaystyle\sum_{n\ge0}\frac{2^n}{n!}\,x^n=\sum_{n\ge0}\frac{(2x)^n}{n!}$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Qual è il coefficiente di $x^3$ nello sviluppo di $e^{2x}$?`,
                answer: '4/3',
                explain: String.raw`$\dfrac{2^3}{3!}=\dfrac{8}{6}=\dfrac43$.`,
              },
            },
          ],
          result: String.raw`$e^{2x}=\displaystyle\sum_{n\ge0}\frac{2^n x^n}{n!}$ (la serie converge per ogni $x$ reale).`,
        },
        {
          id: 's14.serie.L2.c1', type: 'num', level: 1,
          prompt: String.raw`Qual è il coefficiente di $x^4$ nello sviluppo di McLaurin di $e^{-x}$?`,
          answer: '1/24',
          explain: String.raw`$f^{(4)}(0)=(-1)^4=1$, quindi il coefficiente è $\dfrac{1}{4!}=\dfrac{1}{24}$.`,
        },
        {
          id: 's14.serie.L2.c2', type: 'num', level: 1,
          prompt: String.raw`Qual è il coefficiente di $x^5$ nello sviluppo di McLaurin di $\sin x$?`,
          answer: '1/120',
          explain: String.raw`Lo sviluppo è $\sin x=x-\dfrac{x^3}{3!}+\dfrac{x^5}{5!}-\cdots$: il coefficiente di $x^5$ è $\dfrac{1}{5!}=\dfrac{1}{120}$.`,
        },
        {
          id: 's14.serie.L2.c3', type: 'mcq', level: 2,
          prompt: String.raw`Qual è il termine generale dello sviluppo di McLaurin di $\cos x$?`,
          options: [
            String.raw`$\dfrac{(-1)^n}{(2n)!}\,x^{2n}$`,
            String.raw`$\dfrac{(-1)^n}{n!}\,x^{n}$`,
            String.raw`$\dfrac{x^{2n}}{(2n)!}$`,
            String.raw`$\dfrac{(-1)^n}{(2n+1)!}\,x^{2n+1}$`,
          ],
          answer: 0,
          explain: String.raw`Corretta: le derivate di $\cos x$ in $0$ sono $0$ per ordine dispari e $(-1)^k$ per ordine $2k$. Il primo distrattore è lo sviluppo di $e^{-x}$; il secondo dimentica il segno alterno; il terzo è lo sviluppo di $\sin x$ (potenze dispari).`,
        },
        {
          type: 'learn',
          title: 'Quando la serie è uguale alla funzione',
          body: String.raw`Una serie di Taylor può convergere a una funzione diversa, o non convergere affatto. Il criterio che serve (e che compare all'esame):

>* **Sviluppabilità.** Sia $f$ di classe $C^\infty$ su $(x_0-\delta,x_0+\delta)$ e supponiamo che esista $M>0$ tale che
$$|f^{(n)}(x)|\le M\,\frac{n!}{\delta^n}\qquad\text{per ogni } n\in\N \text{ e ogni } x\in(x_0-\delta,x_0+\delta).$$
Allora $f(x)=\displaystyle\sum_{n\ge0}\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n$ per ogni $x$ di quell'intervallo. In tal caso si dice che $f$ è **sviluppabile in serie di Taylor** in $x_0$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $e^x$ è sviluppabile su tutto $\R$',
          problem: String.raw`Verifica la condizione di sviluppabilità per $f(x)=e^x$ in $x_0=0$, su un intervallo $(-\delta,\delta)$ con $\delta>0$ fissato.`,
          steps: [
            String.raw`Tutte le derivate sono $f^{(n)}(x)=e^x$. Su $(-\delta,\delta)$ si ha $|f^{(n)}(x)|=e^x\le e^{\delta}$.`,
            {
              text: String.raw`Basta quindi trovare $M$ con $e^{\delta}\le M\,\dfrac{n!}{\delta^n}$ per ogni $n$, cioè $M\ge e^{\delta}\,\dfrac{\delta^n}{n!}$ per ogni $n$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Per $\delta>0$ fissato, quanto vale $\displaystyle\lim_{n\to+\infty}\frac{\delta^n}{n!}$?`,
                answer: '0',
                explain: String.raw`Il fattoriale cresce più di qualunque potenza fissata: il rapporto tende a zero.`,
              },
            },
            String.raw`La successione $\delta^n/n!$ tende a zero, quindi è limitata: sia $C$ il suo massimo. Basta scegliere $M=e^{\delta}\,C$.`,
            String.raw`La condizione vale per ogni $\delta>0$: quindi $e^x$ è sviluppabile in $0$ su tutto $\R$.`,
          ],
          result: String.raw`$e^x=\displaystyle\sum_{n\ge0}\frac{x^n}{n!}$ per ogni $x\in\R$.`,
        },
        {
          id: 's14.serie.L2.c4', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: se $f$ è di classe $C^\infty$ in $x_0$, allora $f$ coincide con la sua serie di Taylor in un intorno di $x_0$.`,
          answer: false,
          explain: String.raw`Falso. $C^\infty$ garantisce che i coefficienti esistano, non che la serie converga a $f$. Controesempio: $f(x)=e^{-1/x^2}$ con $f(0)=0$ (lezione 3).`,
        },
        {
          id: 's14.serie.L2.c5', type: 'mcq', level: 2,
          prompt: String.raw`Quale condizione garantisce che $f$ sia uguale alla propria serie di Taylor in $(x_0-\delta,x_0+\delta)$?`,
          options: [
            String.raw`$f$ è continua in $x_0$`,
            String.raw`$|f^{(n)}(x)|\le M\,\dfrac{n!}{\delta^n}$ su quell'intervallo, per ogni $n$`,
            String.raw`$f^{(n)}(x_0)\neq 0$ per ogni $n$`,
            String.raw`La serie di Taylor converge in qualche punto`,
          ],
          answer: 1,
          explain: String.raw`Corretta: è la condizione di sviluppabilità. La continuità non dice nulla sulle derivate. Se $f^{(n)}(x_0)\neq0$ la serie esiste, ma non dice se converge a $f$. Una serie può convergere senza avere per somma $f$.`,
        },
        {
          id: 's14.serie.L2.c6', type: 'order', level: 2,
          prompt: String.raw`Riordina i passi della dimostrazione della condizione di sviluppabilità.`,
          steps: [
            String.raw`Per la formula di Taylor con resto di Lagrange: $f(x)=T_n(x)+R_n(x)$, dove $R_n(x)=\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-x_0)^{n+1}$ per un $\xi$ tra $x_0$ e $x$.`,
            String.raw`Usando la stima sulle derivate: $|R_n(x)|\le \dfrac{M\,(n+1)!}{\delta^{n+1}}\cdot\dfrac{|x-x_0|^{n+1}}{(n+1)!}=M\dfrac{|x-x_0|^{n+1}}{\delta^{n+1}}$.`,
            String.raw`Per $|x-x_0|<\delta$ il rapporto $q=\dfrac{|x-x_0|}{\delta}$ è minore di $1$, quindi $q^{n+1}\to0$ e $R_n(x)\to0$.`,
            String.raw`Poiché $f(x)=T_n(x)+R_n(x)$ e $R_n(x)\to0$, il polinomio $T_n(x)$ tende a $f(x)$: la serie converge a $f$.`,
          ],
          distractors: [
            String.raw`Il resto è sempre uguale a zero perché le derivate sono limitate.`,
            String.raw`La serie converge per definizione alla funzione $f$, quindi non serve alcuna stima.`,
          ],
          explain: String.raw`Il resto di Lagrange misura l'errore del polinomio. La stima sulle derivate lo fa tendere a zero. Le due frasi scartate sono false: il resto non è nullo in generale, e la convergenza di una serie non implica che la somma sia $f$.`,
        },
        {
          id: 's14.serie.L2.c7', type: 'match', level: 1,
          prompt: String.raw`Abbina ogni funzione alla sua serie di McLaurin.`,
          pairs: [
            [String.raw`$\dfrac{1}{1-x}$`, String.raw`$\displaystyle\sum_{n\ge0}x^n$`],
            [String.raw`$\sin x$`, String.raw`$\displaystyle\sum_{n\ge0}\frac{(-1)^n x^{2n+1}}{(2n+1)!}$`],
            [String.raw`$e^{-x}$`, String.raw`$\displaystyle\sum_{n\ge0}\frac{(-x)^n}{n!}$`],
            [String.raw`$\cos x$`, String.raw`$\displaystyle\sum_{n\ge0}\frac{(-1)^n x^{2n}}{(2n)!}$`],
          ],
          explain: String.raw`Controlla sempre il segno alterno e se compaiono solo potenze pari o dispari.`,
        },
        {
          id: 's14.serie.L2.c8', type: 'cloze', level: 2,
          text: String.raw`Se $|f^{(n)}(x)|\le M\,\dfrac{n!}{\delta^n}$ su $(x_0-\delta,x_0+\delta)$, il resto di Lagrange soddisfa $|R_n(x)|\le$ [[0]], che tende a zero se $|x-x_0|$ è [[1]] $\delta$.`,
          blanks: [
            {
              options: [
                String.raw`$M\dfrac{|x-x_0|^{n+1}}{\delta^{n+1}}$`,
                String.raw`$M\dfrac{(n+1)!}{\delta^{n+1}}$`,
                String.raw`$M\dfrac{|x-x_0|}{n!}$`,
              ],
              answer: 0,
            },
            {
              options: [String.raw`minore di`, String.raw`maggiore di`, String.raw`uguale a`],
              answer: 0,
            },
          ],
          explain: String.raw`Il bound contiene $(n+1)!$ che si semplifica con il fattoriale del resto. Il rapporto $|x-x_0|/\delta$ deve essere minore di $1$ perché la potenza tenda a zero.`,
        },
      ],
    },
    {
      id: 's14.serie.L3',
      title: 'Funzioni lisce non analitiche, esponenziale complessa ed Eulero',
      cards: [
        {
          type: 'learn',
          title: 'Una funzione liscia che non è uguale alla sua serie',
          body: String.raw`Consideriamo
$$f(x)=\begin{cases}e^{-1/x^2} & x\neq0\\ 0 & x=0.\end{cases}$$
Si può dimostrare che $f$ è di classe $C^\infty$ su $\R$ e che **tutte** le sue derivate in $0$ sono nulle: $f^{(n)}(0)=0$ per ogni $n$.

Quindi la sua serie di McLaurin è identicamente zero, ma $f(x)>0$ per $x\neq0$. La serie **non** coincide con $f$ in nessun intorno di $0$: $f$ è $C^\infty$ ma non è sviluppabile in $0$.`,
          plot: {
            fns: [{ f: 'exp(-1/x^2)', label: 'f' }],
            x: [-2, 2],
            y: [-0.2, 1.1],
          },
        },
        {
          type: 'example',
          title: String.raw`Esempio svolto: $f'(0)=0$ per $e^{-1/x^2}$`,
          problem: String.raw`Verifica che $f'(0)=0$ per $f(x)=e^{-1/x^2}$, con $f(0)=0$.`,
          steps: [
            String.raw`Per definizione $f'(0)=\displaystyle\lim_{h\to0}\frac{f(h)-f(0)}{h}=\lim_{h\to0}\frac{e^{-1/h^2}}{h}$.`,
            {
              text: String.raw`Poni $t=\dfrac{1}{h^2}$. Per $h\to0$ si ha $t\to+\infty$ e, per $h>0$, $\dfrac{e^{-1/h^2}}{h}=\sqrt t\,e^{-t}$. Per $h<0$ il quoziente è l'opposto e il limite non cambia.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $\displaystyle\lim_{t\to+\infty}\sqrt t\,e^{-t}$?`,
                answer: '0',
                explain: String.raw`L'esponenziale $e^{-t}$ tende a zero più velocemente di qualunque potenza di $t$.`,
              },
            },
            String.raw`Il limite vale $0$: quindi $f'(0)=0$. Lo stesso ragionamento con potenze $1/h^k$ dà $f^{(n)}(0)=0$ per ogni $n$.`,
          ],
          result: String.raw`$f'(0)=0$, e in modo analogo tutte le derivate in $0$ sono nulle.`,
        },
        {
          id: 's14.serie.L3.c1', type: 'mcq', level: 2,
          prompt: String.raw`Per $f(x)=e^{-1/x^2}$ con $f(0)=0$, qual è la serie di McLaurin?`,
          options: [
            String.raw`$\displaystyle\sum_{n\ge0}\frac{(-1)^n}{n!}x^{2n}$, cioè lo sviluppo di $e^{-x^2}$`,
            String.raw`È la serie nulla: tutti i coefficienti sono $0$, ma $f\neq0$ per $x\neq0$`,
            String.raw`Non esiste, perché $f$ non è derivabile infinite volte in $0$`,
            String.raw`Coincide con $f$ su tutto $\R$`,
          ],
          answer: 1,
          explain: String.raw`Corretta: ogni derivata di $f$ in $0$ vale $0$, quindi la serie è nulla, mentre $f(x)>0$ per $x\neq0$. Il primo distrattore è un'altra funzione. Il terzo è falso: $f$ è derivabile infinite volte in $0$. Il quarto richiederebbe che $f$ fosse analitica, cosa che qui non vale.`,
        },
        {
          id: 's14.serie.L3.c2', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: esiste $f$ di classe $C^\infty$ su $\R$ che non coincide con la sua serie di McLaurin in nessun intorno di $0$.`,
          answer: true,
          explain: String.raw`Vero: $e^{-1/x^2}$ (con $f(0)=0$) è un esempio. In ogni $x\neq0$ la serie di McLaurin vale $0$, mentre $f(x)>0$.`,
        },
        {
          type: 'learn',
          title: String.raw`L'esponenziale con numeri complessi`,
          body: String.raw`La serie $\displaystyle\sum_{n\ge0}\frac{z^n}{n!}$ ha senso anche per $z\in\C$. Il suo raggio è $+\infty$ (il rapporto dei coefficienti è $n+1\to+\infty$): converge per ogni $z\in\C$. La somma si indica con $e^z$:
$$e^z=\sum_{n=0}^{+\infty}\frac{z^n}{n!}\qquad(z\in\C).$$
Per $z=x$ reale si ritrova $e^x$. Ci servirà solo questa definizione, applicata a $z=i\theta$.`,
        },
        {
          type: 'learn',
          title: 'Formula di Eulero',
          body: String.raw`Mettiamo $z=i\theta$ con $\theta\in\R$ e usiamo le potenze di $i$: $i^0=1$, $i^1=i$, $i^2=-1$, $i^3=-i$, $i^4=1$. In generale $i^{2k}=(-1)^k$ e $i^{2k+1}=i(-1)^k$.

$$e^{i\theta}=\sum_{k\ge0}\frac{(-1)^k\theta^{2k}}{(2k)!}+i\sum_{k\ge0}\frac{(-1)^k\theta^{2k+1}}{(2k+1)!}.$$

Le due somme sono gli sviluppi di $\cos\theta$ e di $\sin\theta$:

>* **Formula di Eulero:** $e^{i\theta}=\cos\theta+i\sin\theta$ per ogni $\theta\in\R$.`,
        },
        {
          type: 'example',
          title: String.raw`Esempio svolto: l'identità di Eulero`,
          problem: String.raw`Calcola $e^{i\pi}$ e ricava il valore di $e^{i\pi}+1$.`,
          steps: [
            String.raw`Per la formula di Eulero con $\theta=\pi$: $e^{i\pi}=\cos\pi+i\sin\pi$.`,
            {
              text: String.raw`Ricordo che $\sin\pi=0$ e $\cos\pi=-1$ (il punto di angolo $\pi$ sulla circonferenza unitaria è $(-1,0)$). Quindi $e^{i\pi}=-1$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $\cos\pi$?`,
                answer: '-1',
                explain: String.raw`Sulla circonferenza unitaria, l'angolo $\pi$ corrisponde al punto $(-1,0)$.`,
              },
            },
            String.raw`Sommando $1$ a entrambi i membri: $e^{i\pi}+1=0$.`,
            String.raw`L'identità di Eulero collega in un'unica formula $e$, $i$, $\pi$, $1$ e $0$.`,
          ],
          result: String.raw`$e^{i\pi}+1=0$.`,
        },
        {
          id: 's14.serie.L3.c3', type: 'num', level: 2,
          prompt: String.raw`Calcola la parte immaginaria di $e^{i\pi/2}$.`,
          answer: '1',
          explain: String.raw`$e^{i\pi/2}=\cos\dfrac{\pi}{2}+i\sin\dfrac{\pi}{2}=i$: la parte immaginaria è $1$.`,
        },
        {
          id: 's14.serie.L3.c4', type: 'set', level: 2,
          prompt: String.raw`Quale numero complesso è $e^{i\pi/2}$? Scrivilo in forma $a+bi$.`,
          answer: ['i'],
          explain: String.raw`$\cos\dfrac{\pi}{2}=0$ e $\sin\dfrac{\pi}{2}=1$, quindi $e^{i\pi/2}=i$.`,
        },
        {
          id: 's14.serie.L3.c5', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $\left|e^{i\theta}\right|=1$ per ogni $\theta\in\R$.`,
          answer: true,
          explain: String.raw`$|\cos\theta+i\sin\theta|=\sqrt{\cos^2\theta+\sin^2\theta}=1$.`,
        },
        {
          id: 's14.serie.L3.c6', type: 'cloze', level: 2,
          text: String.raw`Nello sviluppo $e^{i\theta}=\sum_n\frac{(i\theta)^n}{n!}$, le potenze pari di $i$ valgono alternativamente [[0]], mentre le potenze dispari valgono [[1]]. Così la parte reale è la serie di [[2]] e la parte immaginaria è la serie di [[3]].`,
          blanks: [
            { options: [String.raw`$1$ e $-1$`, String.raw`$1$ sempre`, String.raw`$i$`], answer: 0 },
            { options: [String.raw`$\pm i$ alternati`, String.raw`$1$ sempre`, String.raw`$-i$ sempre`], answer: 0 },
            { options: [String.raw`$\cos\theta$`, String.raw`$\sin\theta$`, String.raw`$e^{\theta}$`], answer: 0 },
            { options: [String.raw`$\cos\theta$`, String.raw`$\sin\theta$`, String.raw`$e^{\theta}$`], answer: 1 },
          ],
          explain: String.raw`$i^{2k}=(-1)^k$ alterna $1$ e $-1$; $i^{2k+1}=i(-1)^k$ alterna $\pm i$. Separando le potenze pari da quelle dispari si ottengono $\cos\theta$ e $\sin\theta$.`,
        },
        {
          id: 's14.serie.L3.c7', type: 'problem', level: 3,
          prompt: String.raw`Sia $\displaystyle f(x)=\sum_{n\ge1}\frac{(x-1)^n}{n\,4^n}$. Determina (a) il raggio di convergenza, (b) l'intervallo di convergenza, (c) il valore di $f(0)$.`,
          parts: [
            {
              type: 'num', prompt: '(a) Raggio di convergenza.', answer: '4',
              explain: String.raw`Con $c_n=\dfrac{1}{n\,4^n}$: $\left|\dfrac{c_n}{c_{n+1}}\right|=\dfrac{4(n+1)}{n}\to4$.`,
            },
            {
              type: 'interval', prompt: '(b) Intervallo di convergenza.', answer: '[-3,5)',
              explain: String.raw`Centro $1$, raggio $4$: $(-3,5)$. In $x=5$ si ottiene $\sum\frac1n$ (diverge); in $x=-3$ si ottiene $\sum\frac{(-1)^n}{n}$ (converge per Leibniz).`,
            },
            {
              type: 'num', prompt: '(c) Valore di $f(0)$.', answer: 'log(4/5)',
              explain: String.raw`Per $x=0$ si ha $y=\dfrac{x-1}{4}=-\dfrac14$ e $f(0)=\sum\dfrac{y^n}{n}=-\log(1-y)=-\log\dfrac54=\log\dfrac45$.`,
            },
          ],
          solution: String.raw`(a) $R=4$. (b) Dentro $(-3,5)$ la serie converge; in $x=-3$ converge (Leibniz), in $x=5$ diverge: intervallo $[-3,5)$. (c) Con $y=\frac{x-1}{4}$ la serie è $\sum\frac{y^n}{n}=-\log(1-y)$ per $|y|<1$. Per $x=0$: $f(0)=-\log\frac54=\log\frac45$.`,
        },
        {
          id: 's14.serie.L3.c8', type: 'open', level: 3, points: 2, source: 'Itinere 15/01/2026 · A',
          prompt: String.raw`Spiega quando una funzione è sviluppabile in serie di Taylor in $x_0$ ed enuncia la condizione di convergenza.`,
          answer: String.raw`Una funzione è sviluppabile in $x_0$ se è di classe $C^\infty$ in $x_0$ e la sua serie di Taylor converge a $f$. Condizione: se esistono $M>0$ e $\delta>0$ con $|f^{(n)}(x)|\le M\,\dfrac{n!}{\delta^n}$ per ogni $n$ e ogni $x\in(x_0-\delta,x_0+\delta)$, allora $f(x)=\displaystyle\sum_{n\ge0}\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n$ su quell'intervallo.`,
          rubric: [
            String.raw`Richiede $f$ di classe $C^\infty$ in $x_0$ (condizione necessaria)`,
            String.raw`Enuncia la condizione con $M$, $n!$ e $\delta^n$ su un intervallo $(x_0-\delta,x_0+\delta)$`,
          ],
          explain: String.raw`>! Nota: nella soluzione ufficiale la $C^\infty$ è presentata come condizione sufficiente; è solo necessaria. Controesempio: $e^{-1/x^2}$ con $f(0)=0$ è $C^\infty$ in $0$ ma non è sviluppabile in $0$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's14.serie.gen-intervallo', type: 'gen', level: 2,
      gen: (R) => {
        const c = R.int(-4, 4);
        const k = R.int(2, 4);
        const xc = c === 0 ? 'x' : c > 0 ? `(x-${c})` : `(x+${-c})`;
        const a = c - k;
        const b = c + k;
        return {
          type: 'interval',
          prompt: String.raw`Determina l'intervallo di convergenza di $\displaystyle\sum_{n\ge1}\frac{${xc}^n}{${k}^n\,n}$.`,
          answer: `[${a},${b})`,
          explain: String.raw`Il raggio è $R=${k}$ e il centro è $${c}$, quindi l'intervallo aperto è $(${a},${b})$. In $x=${b}$ la serie diventa $\sum\frac1n$ (diverge); in $x=${a}$ diventa $\sum\frac{(-1)^n}{n}$ (converge per Leibniz).`,
        };
      },
    },
    {
      id: 's14.serie.gen-raggio', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(2, 5);
        const j = R.pick([1, 2]);
        return {
          type: 'num',
          prompt: String.raw`Qual è il raggio di convergenza di $\displaystyle\sum_{n\ge1} n^{${j}}\,\frac{x^n}{${a}^n}$?`,
          answer: String(a),
          explain: String.raw`$\left|\dfrac{c_n}{c_{n+1}}\right|=${a}\left(\dfrac{n}{n+1}\right)^{${j}}\to ${a}$, quindi $R=${a}$.`,
        };
      },
    },
    {
      id: 's14.serie.gen-radice', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.pick([2, 3, 5, 6, 7, 8]);
        return {
          type: 'num',
          prompt: String.raw`La serie $\displaystyle\sum_{n\ge0}${a}^n\,x^{2n}$ converge per $|x|<\rho$ e diverge per $|x|>\rho$. Quanto vale $\rho$?`,
          answer: `1/sqrt(${a})`,
          explain: String.raw`Con $y=x^2$ la serie è $\sum(${a}y)^n$: converge per $|${a}y|<1$, cioè $x^2<\dfrac{1}{${a}}$, quindi $\rho=\dfrac{1}{\sqrt{${a}}}$.`,
        };
      },
    },
    {
      id: 's14.serie.gen-coef', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        const k = R.int(2, 5);
        return {
          type: 'num',
          prompt: String.raw`Qual è il coefficiente di $x^{${k}}$ nello sviluppo di McLaurin di $e^{${a}x}$?`,
          answer: H.fracStr(a ** k, fact(k)),
          explain: String.raw`Il coefficiente è $\dfrac{f^{(${k})}(0)}{${k}!}=\dfrac{(${a})^{${k}}}{${k}!}=${H.frac(a ** k, fact(k))}$.`,
        };
      },
    },
    {
      id: 's14.serie.gen-eulero-re', type: 'gen', level: 2,
      gen: (R) => {
        const t = R.pick(TH);
        return {
          type: 'num',
          prompt: String.raw`Calcola la parte reale di $e^{i${t[0]}}$.`,
          answer: t[2],
          explain: String.raw`Per Eulero $e^{i\theta}=\cos\theta+i\sin\theta$: la parte reale è $\cos\theta=${t[3]}$.`,
        };
      },
    },
    {
      id: 's14.serie.gen-eulero-im', type: 'gen', level: 2,
      gen: (R) => {
        const t = R.pick(TH);
        return {
          type: 'num',
          prompt: String.raw`Calcola la parte immaginaria di $e^{i${t[0]}}$.`,
          answer: t[4],
          explain: String.raw`Per Eulero $e^{i\theta}=\cos\theta+i\sin\theta$: la parte immaginaria è $\sin\theta=${t[5]}$.`,
        };
      },
    },
    {
      id: 's14.serie.p1', type: 'num', level: 1,
      prompt: String.raw`Qual è il raggio di convergenza di $\displaystyle\sum_{n\ge1}\frac{(x-2)^n}{5^n}$?`,
      answer: '5',
      explain: String.raw`$\dfrac{c_n}{c_{n+1}}=5$: il centro $2$ non cambia il raggio.`,
    },
    {
      id: 's14.serie.p2', type: 'interval', level: 2,
      prompt: String.raw`Qual è l'intervallo di convergenza di $\displaystyle\sum_{n\ge1}\frac{(x+2)^n}{3^n\sqrt n}$?`,
      answer: '[-5,1)',
      explain: String.raw`$R=3$, centro $-2$: l'intervallo aperto è $(-5,1)$. Per $x=1$ si ha $\sum\frac{1}{\sqrt n}$ (diverge); per $x=-5$ si ha $\sum\frac{(-1)^n}{\sqrt n}$ (converge per Leibniz).`,
    },
    {
      id: 's14.serie.p3', type: 'num', level: 1,
      prompt: String.raw`Qual è il coefficiente di $x^2$ nello sviluppo di McLaurin di $e^{-x}$?`,
      answer: '1/2',
      explain: String.raw`$\dfrac{(-1)^2}{2!}=\dfrac12$.`,
    },
    {
      id: 's14.serie.p4', type: 'tf', level: 1,
      prompt: String.raw`Vero o falso: il coefficiente di $x^n$ nello sviluppo di McLaurin di $e^x$ è $\dfrac{1}{n!}$.`,
      answer: true,
      explain: String.raw`Vero: $f^{(n)}(0)=1$, quindi il coefficiente è $\dfrac{f^{(n)}(0)}{n!}=\dfrac{1}{n!}$.`,
    },
    {
      id: 's14.serie.p5', type: 'mcq', level: 2,
      prompt: String.raw`Quale serie ha raggio di convergenza $+\infty$?`,
      options: [
        String.raw`$\displaystyle\sum_{n\ge0}n!\,x^n$`,
        String.raw`$\displaystyle\sum_{n\ge0}x^n$`,
        String.raw`$\displaystyle\sum_{n\ge0}\frac{x^n}{n!}$`,
        String.raw`$\displaystyle\sum_{n\ge1}\frac{x^n}{n}$`,
      ],
      answer: 2,
      explain: String.raw`Solo $\sum x^n/n!$ ha il rapporto dei coefficienti che tende a $+\infty$. Gli altri hanno raggio $0$, $1$ e $1$.`,
    },
    {
      id: 's14.serie.p6', type: 'num', level: 2,
      prompt: String.raw`Quanto vale $\displaystyle\sum_{n\ge0}\frac{(-1)^n}{(2n+1)!}$?`,
      answer: 'sin(1)',
      explain: String.raw`È lo sviluppo di $\sin x$ calcolato in $x=1$: $\sum\dfrac{(-1)^n x^{2n+1}}{(2n+1)!}$ con $x=1$.`,
    },
    {
      id: 's14.serie.p7', type: 'cloze', level: 2,
      text: String.raw`Se $\sum c_n x^n$ converge in $x=-4$, allora converge assolutamente per [[0]] e il raggio vale almeno [[1]].`,
      blanks: [
        { options: [String.raw`$|x|<4$`, String.raw`$|x|>4$`, String.raw`$x\ge0$`], answer: 0 },
        { options: [String.raw`$4$`, String.raw`$1$`, String.raw`$8$`], answer: 0 },
      ],
      explain: String.raw`Converge in $x=-4$ implica $R\ge4$ (lemma di Abel); dentro il raggio la convergenza è assoluta.`,
    },
    {
      id: 's14.serie.p8', type: 'match', level: 1,
      prompt: String.raw`Abbina ogni serie al suo raggio di convergenza.`,
      pairs: [
        [String.raw`$\displaystyle\sum_{n\ge1}n^2x^n$`, String.raw`$R=1$`],
        [String.raw`$\displaystyle\sum_{n\ge0}\frac{x^n}{2^n}$`, String.raw`$R=2$`],
        [String.raw`$\displaystyle\sum_{n\ge0}n!\,x^n$`, String.raw`$R=0$`],
        [String.raw`$\displaystyle\sum_{n\ge0}\frac{x^n}{n!}$`, String.raw`$R=+\infty$`],
      ],
      explain: String.raw`Il raggio dipende solo dal comportamento dei coefficienti, non dal fatto che i termini siano più o meno numerosi.`,
    },
    {
      id: 's14.serie.p9', type: 'order', level: 2,
      prompt: String.raw`Riordina la derivazione della formula di Eulero $e^{i\theta}=\cos\theta+i\sin\theta$.`,
      steps: [
        String.raw`Scrivo lo sviluppo di $e^z$ e lo calcolo in $z=i\theta$: $e^{i\theta}=\sum_{n\ge0}\dfrac{(i\theta)^n}{n!}$.`,
        String.raw`Uso $i^{2k}=(-1)^k$ e $i^{2k+1}=i(-1)^k$ per separare le potenze pari da quelle dispari.`,
        String.raw`Le potenze pari danno $\sum_k\dfrac{(-1)^k\theta^{2k}}{(2k)!}=\cos\theta$ e quelle dispari danno $i\sum_k\dfrac{(-1)^k\theta^{2k+1}}{(2k+1)!}=i\sin\theta$.`,
        String.raw`Quindi $e^{i\theta}=\cos\theta+i\sin\theta$.`,
      ],
      distractors: [
        String.raw`Poiché $i^n=1$ per ogni $n$, la serie diventa $\sum\dfrac{\theta^n}{n!}=e^{\theta}$, che è reale.`,
        String.raw`Si ottiene $e^{i\theta}=\sin\theta+i\cos\theta$ scambiando le due somme.`,
      ],
      explain: String.raw`Le potenze di $i$ si ripetono con periodo $4$: è la chiave della separazione tra parte reale e immaginaria.`,
    },
    {
      id: 's14.serie.p10', type: 'problem', level: 2,
      prompt: String.raw`Si consideri la serie $\displaystyle\sum_{n\ge0}(-1)^n x^{2n}$.`,
      parts: [
        {
          type: 'num', prompt: '(a) Raggio di convergenza.', answer: '1',
          explain: String.raw`Con $y=x^2$ la serie è $\sum(-y)^n$, che converge per $|y|<1$: $x^2<1$, quindi $R=1$.`,
        },
        {
          type: 'expr', prompt: '(b) Scrivi la somma come funzione di $x$ per $|x|<1$.', answer: '1/(1+x^2)', vars: ['x'],
          explain: String.raw`È una serie geometrica di ragione $-x^2$: $\dfrac{1}{1-(-x^2)}=\dfrac{1}{1+x^2}$.`,
        },
      ],
      solution: String.raw`(a) $R=1$. (b) La serie è geometrica di ragione $-x^2$, quindi la somma è $\dfrac{1}{1+x^2}$ per $|x|<1$.`,
    },
  ],
  flashcards: [
    { id: 's14.serie.fc1', kind: 'def', front: String.raw`Serie di potenze centrata in $x_0$`, back: String.raw`$\displaystyle\sum_{n\ge0}c_n(x-x_0)^n$, con coefficienti $c_n$ e variabile $x$.` },
    { id: 's14.serie.fc2', kind: 'def', front: String.raw`Raggio di convergenza $R$`, back: String.raw`$R\in[0,+\infty]$: la serie converge assolutamente per $|x-x_0|<R$ e non converge per $|x-x_0|>R$. Sul bordo si studia a parte.` },
    { id: 's14.serie.fc3', kind: 'formula', front: String.raw`Come calcolare $R$`, back: String.raw`$R=\lim\left|\dfrac{c_n}{c_{n+1}}\right|$ oppure $R=\dfrac{1}{\lim\sqrt[n]{|c_n|}}$. Se il limite del rapporto vale $0$ allora $R=0$; se vale $+\infty$ allora $R=+\infty$.` },
    { id: 's14.serie.fc4', kind: 'metodo', front: String.raw`Come trovare l'intervallo di convergenza`, back: String.raw`1) Calcola $R$. 2) Scrivi l'intervallo aperto $(x_0-R,x_0+R)$. 3) Sostituisci $x=x_0\pm R$ e studia le serie numeriche. 4) Aggiungi i bordi che convergono.` },
    { id: 's14.serie.fc5', kind: 'errore', front: String.raw`Il raggio non decide i bordi`, back: String.raw`Con $R=1$ entrambe le serie $\sum\frac1n$ (per $x=1$) e $\sum\frac{(-1)^n}{n}$ (per $x=-1$) hanno $R=1$, ma la prima diverge e la seconda converge.` },
    { id: 's14.serie.fc6', kind: 'thm', front: String.raw`Lemma di Abel`, back: String.raw`Se la serie converge in $x_1$, allora converge assolutamente per $|x-x_0|<|x_1-x_0|$.` },
    { id: 's14.serie.fc7', kind: 'def', front: String.raw`Serie di Taylor di $f$ in $x_0$`, back: String.raw`$\displaystyle\sum_{n\ge0}\dfrac{f^{(n)}(x_0)}{n!}(x-x_0)^n$. Con $x_0=0$ è la serie di McLaurin.` },
    { id: 's14.serie.fc8', kind: 'thm', front: String.raw`Criterio di sviluppabilità`, back: String.raw`Se $f\in C^\infty$ e $|f^{(n)}(x)|\le M\,n!/\delta^n$ per ogni $n$ e ogni $x\in(x_0-\delta,x_0+\delta)$, allora $f$ è uguale alla sua serie di Taylor su quell'intervallo.` },
    { id: 's14.serie.fc9', kind: 'dim', front: String.raw`Idea della dimostrazione di sviluppabilità`, back: String.raw`Il resto di Lagrange dà $|R_n(x)|\le M\,|x-x_0|^{n+1}/\delta^{n+1}$. Per $|x-x_0|<\delta$ questo tende a zero, quindi le somme di Taylor tendono a $f$.` },
    { id: 's14.serie.fc10', kind: 'errore', front: String.raw`$C^\infty$ non basta`, back: String.raw`$f\in C^\infty$ è condizione necessaria, non sufficiente. Controesempio: $e^{-1/x^2}$ con $f(0)=0$.` },
    { id: 's14.serie.fc11', kind: 'def', front: String.raw`Esponenziale complessa`, back: String.raw`$e^z=\displaystyle\sum_{n\ge0}\dfrac{z^n}{n!}$ per $z\in\C$. Il raggio è $+\infty$.` },
    { id: 's14.serie.fc12', kind: 'thm', front: String.raw`Formula di Eulero`, back: String.raw`$e^{i\theta}=\cos\theta+i\sin\theta$ per ogni $\theta\in\R$. Caso notevole: $e^{i\pi}+1=0$.` },
    { id: 's14.serie.fc13', kind: 'metodo', front: String.raw`Potenze di $i$ nello sviluppo`, back: String.raw`$i^{2k}=(-1)^k$ e $i^{2k+1}=i(-1)^k$: le potenze pari danno la parte reale, quelle dispari la parte immaginaria.` },
    { id: 's14.serie.fc14', kind: 'formula', front: String.raw`Serie geometrica`, back: String.raw`$\displaystyle\sum_{n\ge0}x^n=\dfrac{1}{1-x}$ per $|x|<1$ (raggio $1$).` },
  ],
};

export default {
  id: 's14',
  title: 'Serie di Taylor',
  subtitle: 'Serie di potenze, sviluppabilità, somme notevoli',
  intro: String.raw`Una serie di Taylor è un polinomio "di grado infinito" costruito con le derivate di una funzione. Qui impari quando una serie di potenze converge, quando la sua somma è davvero la funzione e come usare gli sviluppi noti per calcolare somme di serie, anche all'esame.`,
  skills: [SERIE],
};
