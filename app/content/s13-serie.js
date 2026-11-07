import { H } from '../engine/tex.js';

// ---------- piccoli helper per frazioni esatte nei generatori ----------
const qadd = ([a, b], [c, d]) => H.reduce(a * d + c * b, b * d);
const qmul = ([a, b], [c, d]) => H.reduce(a * c, b * d);
const qtex = ([a, b]) => H.frac(a, b);
const qstr = ([a, b]) => H.fracStr(a, b);
/** potenza di una frazione in LaTeX con parentesi: \left(-\frac{1}{2}\right) */
const par = (t) => String.raw`\left(${t}\right)`;
/** n + k in LaTeX (k può essere 0 o negativo) */
const nk = (k, v = 'n') => (k === 0 ? v : `${v} ${k > 0 ? '+' : '-'} ${Math.abs(k)}`);
/** fattore (n + k) con parentesi solo se serve */
const fac = (k, v = 'n') => (k === 0 ? v : `(${nk(k, v)})`);

// =====================================================================
// s13.def — somme parziali, carattere, geometrica, Mengoli, telescopiche
// =====================================================================
const DEF = {
  id: 's13.def',
  title: 'Serie: definizione e serie notevoli',
  summary: String.raw`Calcoli le somme parziali, riconosci se una serie converge, diverge o è indeterminata e sommi geometriche, Mengoli e telescopiche.`,
  prereq: ['s04.limiti', 's04.monotone'],
  examRefs: ['Appello 10/02/2026 · A', 'Appello 06/07/2026 · A', 'Appello 03/09/2026 · A', 'Itinere 15/01/2026 · A'],
  lessons: [
    {
      id: 's13.def.L1',
      title: 'Sommare infiniti numeri',
      cards: [
        {
          type: 'learn',
          title: 'Una torta divisa a metà, poi ancora a metà…',
          body: String.raw`Mangi metà torta, poi metà di ciò che resta, poi ancora metà… Quanto mangi in totale?

$$\frac12+\frac14+\frac18+\frac1{16}+\cdots$$

Non si possono fare "infinite addizioni". Si fa così: si somma **un pezzo alla volta** e si guarda dove si va.

- dopo 1 pezzo: $\frac12$
- dopo 2 pezzi: $\frac34$
- dopo 3 pezzi: $\frac78$
- dopo $n$ pezzi: $1-\frac1{2^n}$

Questi numeri si avvicinano a $1$: diremo che la **somma della serie** è $1$.`,
          plot: { fns: [{ f: '1', label: 'S = 1' }], x: [0, 8], y: [0, 1.2], points: [[1, 0.5], [2, 0.75], [3, 0.875], [4, 0.9375], [5, 0.96875], [6, 0.984375], [7, 0.9921875]] },
        },
        {
          type: 'learn',
          title: 'Serie e somme parziali',
          body: String.raw`Data una successione $(a_n)$, la **serie** $\displaystyle\sum_{n=1}^{+\infty}a_n$ è la successione delle **somme parziali**
$$s_n=a_1+a_2+\cdots+a_n=\sum_{k=1}^{n}a_k .$$
$a_n$ si chiama **termine generale**. L'indice può partire da $0$, da $1$ o da un altro intero: la somma parziale parte sempre dal primo indice.

>* La serie è **convergente** se $s_n\to S\in\R$ (finito): $S$ è la **somma** della serie. È **divergente** se $s_n\to+\infty$ o $s_n\to-\infty$. È **indeterminata** (o irregolare) se $\lim s_n$ non esiste.

Stabilire quale delle tre cose succede significa studiare il **carattere** della serie.`,
        },
        {
          id: 's13.def.L1.c1', type: 'num', level: 1,
          prompt: String.raw`Per $\displaystyle\sum_{n=1}^{+\infty}\frac1{2^n}$ calcola la somma parziale $s_3=a_1+a_2+a_3$.`,
          answer: '7/8',
          explain: String.raw`$s_3=\frac12+\frac14+\frac18=\frac{4+2+1}{8}=\frac78$. Attenzione: $s_3$ somma i primi **tre** termini a partire dal primo indice ($n=1$).`,
        },
        {
          id: 's13.def.L1.c2', type: 'mcq', level: 1,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}1=1+1+1+\cdots$`,
          options: [String.raw`Diverge a $+\infty$`, String.raw`Converge a $1$`, 'È indeterminata', String.raw`Converge a $0$`],
          answer: 0,
          explain: String.raw`$s_n=\underbrace{1+\cdots+1}_{n}=n\to+\infty$: la serie diverge. "Converge a 1" confonde il **termine generale** ($a_n=1$) con la **somma** (il limite di $s_n$).`,
        },
        {
          type: 'example',
          title: 'Una serie indeterminata',
          problem: String.raw`Studia $\displaystyle\sum_{n=0}^{+\infty}(-1)^n=1-1+1-1+\cdots$`,
          steps: [
            String.raw`Somme parziali: $s_0=1$, $s_1=1-1=0$, $s_2=1$, $s_3=0$, …`,
            {
              text: String.raw`In generale $s_n=1$ se $n$ è pari e $s_n=0$ se $n$ è dispari.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $s_{10}$?`, answer: '1', explain: String.raw`$10$ è pari: i termini sono $11$ (da $n=0$ a $n=10$), si cancellano a coppie e resta il primo, $1$.` },
            },
            String.raw`La successione $1,0,1,0,\dots$ non ha limite: due sottosuccessioni tendono a valori diversi.`,
          ],
          result: String.raw`$\sum(-1)^n$ è **indeterminata**: non converge e non diverge.`,
        },
        {
          id: 's13.def.L1.c3', type: 'num', level: 1,
          prompt: String.raw`Per $\displaystyle\sum_{n=0}^{+\infty}(-1)^n$ quanto vale $s_7$?`,
          answer: '0',
          explain: String.raw`Da $n=0$ a $n=7$ ci sono $8$ termini: $(1-1)+(1-1)+(1-1)+(1-1)=0$. Gli indici dispari danno $s_n=0$.`,
        },
        {
          id: 's13.def.L1.c4', type: 'match', level: 1,
          prompt: 'Abbina ogni serie al suo carattere (guarda le somme parziali).',
          pairs: [
            [String.raw`$\sum_{n\ge1}\frac1{2^n}$`, String.raw`converge a $1$`],
            [String.raw`$\sum_{n\ge1} n$`, String.raw`diverge a $+\infty$`],
            [String.raw`$\sum_{n\ge0}(-1)^n$`, 'indeterminata'],
            [String.raw`$\sum_{n\ge1}(-2)$`, String.raw`diverge a $-\infty$`],
          ],
          explain: String.raw`$s_n=1-\frac1{2^n}\to1$; $s_n=\frac{n(n+1)}2\to+\infty$; $s_n$ oscilla tra $1$ e $0$; $s_n=-2n\to-\infty$.`,
        },
        {
          id: 's13.def.L1.c5', type: 'num', level: 2,
          prompt: String.raw`Il numero periodico $0{,}\overline{3}=0{,}333\ldots$ è la serie $\displaystyle\sum_{n=1}^{+\infty}\frac{3}{10^n}$. Sapendo che $s_n=\frac13\left(1-\frac1{10^n}\right)$, quanto vale la somma?`,
          answer: '1/3',
          explain: String.raw`$\frac1{10^n}\to0$, quindi $s_n\to\frac13$. Un numero decimale illimitato **è** una serie: la sua somma è il limite delle troncature.`,
        },
        {
          id: 's13.def.L1.c6', type: 'tf', level: 2,
          prompt: String.raw`Se $a_n\ge0$ per ogni $n$, la serie $\sum a_n$ non può essere indeterminata.`,
          answer: true,
          explain: String.raw`Se $a_n\ge0$ allora $s_{n+1}=s_n+a_{n+1}\ge s_n$: le somme parziali sono **crescenti**, e una successione monotona ha sempre limite (finito o $+\infty$). Quindi converge o diverge a $+\infty$.`,
        },
        {
          id: 's13.def.L1.c7', type: 'cloze', level: 1,
          text: String.raw`La serie $\sum a_n$ converge se la successione [[0]] ha limite [[1]]. Il numero $\lim s_n$ si chiama [[2]] della serie.`,
          blanks: [
            { options: [String.raw`delle somme parziali $s_n$`, String.raw`dei termini $a_n$`], answer: 0 },
            { options: ['finito', String.raw`uguale a $0$`, 'infinito'], answer: 0 },
            { options: ['somma', 'termine generale', 'ragione'], answer: 0 },
          ],
          explain: String.raw`La convergenza riguarda $s_n$, non $a_n$. Che $a_n\to0$ è solo una condizione **necessaria** (la vedrai nella prossima skill).`,
        },
      ],
    },
    {
      id: 's13.def.L2',
      title: 'La serie geometrica',
      cards: [
        {
          type: 'learn',
          title: 'Serie geometrica di ragione q',
          body: String.raw`È la serie in cui ogni termine si ottiene dal precedente moltiplicando per lo stesso numero $q$ (la **ragione**):
$$\sum_{n=0}^{+\infty}q^n=1+q+q^2+q^3+\cdots$$
Per $q\neq1$ la somma parziale si calcola in modo esatto:
$$s_n=1+q+\cdots+q^n=\frac{1-q^{n+1}}{1-q}.$$
>* **Carattere della geometrica.** Se $|q|<1$ converge e $\displaystyle\sum_{n=0}^{+\infty}q^n=\frac1{1-q}$. Se $q\ge1$ diverge a $+\infty$. Se $q\le-1$ è indeterminata.

Il motivo: tutto dipende da $q^{n+1}$, che tende a $0$ se $|q|<1$, a $+\infty$ se $q>1$, e oscilla se $q\le-1$.`,
        },
        {
          type: 'example',
          title: 'Da dove viene la formula di s_n',
          problem: String.raw`Mostra che $s_n=1+q+\cdots+q^n=\frac{1-q^{n+1}}{1-q}$ per $q\neq1$.`,
          steps: [
            String.raw`Scrivo $s_n=1+q+q^2+\cdots+q^n$ e moltiplico per $q$: $qs_n=q+q^2+\cdots+q^{n+1}$.`,
            {
              text: String.raw`Sottraggo: quasi tutto si cancella e resta $s_n-qs_n=1-q^{n+1}$.`,
              ask: { type: 'expr', prompt: String.raw`Quanto vale $s_n-q\,s_n$? (scrivi in funzione di $q$ e $n$)`, answer: '1-q^(n+1)', vars: ['q', 'n'], domains: { q: [0.2, 0.9], n: [1, 6] }, explain: String.raw`Restano solo il primo termine di $s_n$ ($1$) e l'ultimo di $qs_n$ ($q^{n+1}$), col segno meno.` },
            },
            String.raw`Raccolgo: $(1-q)s_n=1-q^{n+1}$ e divido per $1-q\neq0$.`,
          ],
          result: String.raw`$s_n=\dfrac{1-q^{n+1}}{1-q}$; per $|q|<1$, $q^{n+1}\to0$ e $s_n\to\dfrac1{1-q}$.`,
        },
        {
          id: 's13.def.L2.c1', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\sum_{n=0}^{+\infty}\left(\frac13\right)^n$.`,
          answer: '3/2',
          explain: String.raw`Ragione $q=\frac13$, $|q|<1$: la somma è $\frac1{1-\frac13}=\frac1{\frac23}=\frac32$.`,
        },
        {
          id: 's13.def.L2.c2', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\sum_{n=0}^{+\infty}\left(-\frac12\right)^n$.`,
          answer: '2/3',
          explain: String.raw`$q=-\frac12$, $|q|<1$: $\frac1{1-(-\frac12)}=\frac1{\frac32}=\frac23$. Errore tipico: scrivere $\frac1{1-\frac12}=2$ perdendo il segno della ragione.`,
        },
        {
          id: 's13.def.L2.c3', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=0}^{+\infty}\left(\frac32\right)^n$.`,
          options: [String.raw`Diverge a $+\infty$`, String.raw`Converge a $-2$`, 'È indeterminata', String.raw`Converge a $2$`],
          answer: 0,
          explain: String.raw`$q=\frac32\ge1$: i termini crescono e $s_n\to+\infty$. "Converge a $-2$" viene dall'applicare $\frac1{1-q}$ **senza** controllare $|q|<1$: una somma di numeri positivi non può dare un numero negativo!`,
        },
        {
          id: 's13.def.L2.c4', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=0}^{+\infty}(-2)^n=1-2+4-8+\cdots$`,
          options: ['È indeterminata', String.raw`Converge a $\frac13$`, String.raw`Diverge a $-\infty$`, String.raw`Diverge a $+\infty$`],
          answer: 0,
          explain: String.raw`$q=-2\le-1$: $s_n=\frac{1-(-2)^{n+1}}{3}$ vale $1,-1,3,-5,11,\dots$ e oscilla con ampiezza crescente, senza limite. $\frac13=\frac1{1-(-2)}$ è la formula usata fuori dal suo campo di validità.`,
        },
        {
          type: 'learn',
          title: 'Se la serie non parte da 0',
          body: String.raw`Due modi equivalenti.

1. **Raccogli** il primo termine: $\displaystyle\sum_{n=n_0}^{+\infty}q^n=q^{n_0}\sum_{m=0}^{+\infty}q^m=\frac{q^{n_0}}{1-q}$ (primo termine diviso $1-q$).
2. **Togli** i termini mancanti dalla serie completa: $\displaystyle\sum_{n=2}^{+\infty}\frac1{2^n}=\underbrace{\sum_{n=0}^{+\infty}\frac1{2^n}}_{2}-1-\frac12=\frac12$.

>! Errore tipico: usare $\frac1{1-q}$ anche quando l'indice parte da $1$ o da $2$. Togliere o aggiungere un numero **finito** di termini non cambia il carattere, ma cambia la somma.`,
        },
        {
          id: 's13.def.L2.c5', type: 'tf', level: 3, source: 'Appello 06/07/2026 · A',
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n=2}^{+\infty}\frac1{2^n}=\frac12$.`,
          answer: true,
          explain: String.raw`Vero. $\sum_{n\ge0}\frac1{2^n}=\frac1{1-\frac12}=2$; togliendo i termini con $n=0$ e $n=1$ resta $2-1-\frac12=\frac12$. Con l'altra formula: primo termine $\frac14$, diviso $1-\frac12$, fa $\frac12$.`,
        },
        {
          id: 's13.def.L2.c6', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\frac{3^n}{5^{n+1}}$.`,
          answer: '3/10',
          explain: String.raw`$\frac{3^n}{5^{n+1}}=\frac15\left(\frac35\right)^n$. Primo termine ($n=1$): $\frac15\cdot\frac35=\frac3{25}$. Somma: $\frac{3/25}{1-3/5}=\frac3{25}\cdot\frac52=\frac3{10}$.`,
        },
        {
          id: 's13.def.L2.c7', type: 'interval', level: 2, source: 'Itinere 15/01/2026 · A',
          prompt: String.raw`Per quali $x\in\R$ converge la serie geometrica $\displaystyle\sum_{n=0}^{+\infty}x^n$?`,
          answer: '(-1,1)',
          explain: String.raw`Converge se e solo se la ragione soddisfa $|x|<1$, cioè $-1<x<1$. Agli estremi no: per $x=1$ diverge ($s_n=n+1$), per $x=-1$ è indeterminata.`,
        },
        {
          id: 's13.def.L2.c8', type: 'interval', level: 3,
          prompt: String.raw`Per quali $x$ converge $\displaystyle\sum_{n=0}^{+\infty}\frac{(x-1)^n}{2^n}$? Scrivi l'insieme.`,
          answer: '(-1,3)',
          explain: String.raw`È geometrica di ragione $q=\frac{x-1}2$. Converge sse $\left|\frac{x-1}2\right|<1\iff|x-1|<2\iff-1<x<3$.`,
        },
        {
          id: 's13.def.L2.c9', type: 'order', level: 2,
          prompt: String.raw`Riordina i passi per calcolare $\displaystyle\sum_{n=1}^{+\infty}\frac{2}{3^n}$.`,
          steps: [
            String.raw`Riconosco una geometrica: $\frac2{3^n}=2\left(\frac13\right)^n$, ragione $q=\frac13$.`,
            String.raw`Controllo che $|q|<1$: la serie converge.`,
            String.raw`Il primo termine (per $n=1$) è $\frac23$.`,
            String.raw`Somma $=\dfrac{\text{primo termine}}{1-q}=\dfrac{2/3}{2/3}=1$.`,
          ],
          distractors: [String.raw`Somma $=\dfrac{2}{1-1/3}=3$.`],
          explain: String.raw`La somma vale $1$. Il distrattore usa $\frac{c}{1-q}$, valido solo se la serie parte da $n=0$: qui manca il termine $n=0$ (che vale $2$), e infatti $3-2=1$.`,
        },
      ],
    },
    {
      id: 's13.def.L3',
      title: 'Serie telescopiche e di Mengoli',
      cards: [
        {
          type: 'learn',
          title: 'Quando i termini si cancellano',
          body: String.raw`Una serie è **telescopica** se il termine generale è una differenza $a_n=b_n-b_{n+1}$. Allora nella somma parziale quasi tutto si elide:
$$s_n=(b_1-b_2)+(b_2-b_3)+\cdots+(b_n-b_{n+1})=b_1-b_{n+1}.$$
>* Se $b_n\to L$ finito, la serie converge e $\displaystyle\sum_{n=1}^{+\infty}(b_n-b_{n+1})=b_1-L$. Se $b_n\to\pm\infty$ la serie diverge.

L'esempio più famoso è la **serie di Mengoli**:
$$\sum_{n=1}^{+\infty}\frac1{n(n+1)}=\sum_{n=1}^{+\infty}\left(\frac1n-\frac1{n+1}\right)=1.$$`,
        },
        {
          type: 'example',
          title: 'Serie di Mengoli',
          problem: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\frac1{n(n+1)}$.`,
          steps: [
            String.raw`Fratti semplici: $\frac1{n(n+1)}=\frac An+\frac B{n+1}$ con $A(n+1)+Bn=1$: per $n=0$ $A=1$, per $n=-1$ $B=-1$.`,
            String.raw`Quindi $a_n=\frac1n-\frac1{n+1}$: è telescopica con $b_n=\frac1n$.`,
            {
              text: String.raw`$s_n=\left(1-\frac12\right)+\left(\frac12-\frac13\right)+\cdots+\left(\frac1n-\frac1{n+1}\right)=1-\frac1{n+1}$.`,
              ask: { type: 'expr', prompt: String.raw`Scrivi $s_n$ in funzione di $n$.`, answer: '1-1/(n+1)', vars: ['n'], domain: [1, 9], explain: String.raw`Resta il primo termine $b_1=1$ meno l'ultimo $b_{n+1}=\frac1{n+1}$.` },
            },
            String.raw`$s_n\to1$.`,
          ],
          result: String.raw`$\displaystyle\sum_{n=1}^{+\infty}\frac1{n(n+1)}=1$.`,
        },
        {
          id: 's13.def.L3.c1', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\sum_{n=2}^{+\infty}\frac1{n(n+1)}$.`,
          answer: '1/2',
          explain: String.raw`Partendo da $n=2$: $s_n=\frac12-\frac1{n+1}\to\frac12$. Oppure: serie di Mengoli completa ($1$) meno il termine $n=1$, che vale $\frac12$.`,
        },
        {
          id: 's13.def.L3.c2', type: 'num', level: 3, source: 'Appello 03/09/2026 · A',
          prompt: String.raw`Per quale valore intero $\alpha\ge1$ si ha $\displaystyle\sum_{n=\alpha}^{+\infty}\frac1{n(n+1)}=\frac12$?`,
          answer: '2',
          explain: String.raw`Partendo da $n=\alpha$ la telescopica dà $\sum_{n\ge\alpha}\left(\frac1n-\frac1{n+1}\right)=\frac1\alpha$. Quindi $\frac1\alpha=\frac12\iff\alpha=2$: è la serie di Mengoli **privata del primo termine**.`,
        },
        {
          id: 's13.def.L3.c3', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\frac1{n(n+2)}$.`,
          answer: '3/4',
          explain: String.raw`$\frac1{n(n+2)}=\frac12\left(\frac1n-\frac1{n+2}\right)$. Qui si cancellano i termini "a distanza 2": restano i primi due positivi, $1+\frac12$. Somma $=\frac12\left(1+\frac12\right)=\frac34$. Errore tipico: tenere solo $1$ e ottenere $\frac12$.`,
        },
        {
          id: 's13.def.L3.c4', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\left(\frac1{\sqrt n}-\frac1{\sqrt{n+1}}\right)$.`,
          answer: '1',
          explain: String.raw`Telescopica con $b_n=\frac1{\sqrt n}$: $s_n=1-\frac1{\sqrt{n+1}}\to1$.`,
        },
        {
          id: 's13.def.L3.c5', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\log\frac{n+1}{n}$ (scrivi inf se diverge a $+\infty$).`,
          answer: 'inf',
          explain: String.raw`$\log\frac{n+1}n=\log(n+1)-\log n$: telescopica con $b_n=\log n$ (segni scambiati). $s_n=\log(n+1)-\log1=\log(n+1)\to+\infty$. Anche se $a_n\to0$, la serie diverge: le telescopiche convergono solo se $b_n$ ha limite **finito**.`,
        },
        {
          type: 'example',
          title: 'Prima i fratti semplici',
          problem: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\frac{2}{n^2+4n+3}$.`,
          steps: [
            String.raw`Scompongo il denominatore: $n^2+4n+3=(n+1)(n+3)$.`,
            {
              text: String.raw`$\frac2{(n+1)(n+3)}=\frac1{n+1}-\frac1{n+3}$.`,
              ask: { type: 'num', prompt: String.raw`In $\frac2{(n+1)(n+3)}=\frac A{n+1}-\frac A{n+3}$, quanto vale $A$?`, answer: '1', explain: String.raw`$\frac A{n+1}-\frac A{n+3}=\frac{2A}{(n+1)(n+3)}$, quindi $2A=2$, $A=1$.` },
            },
            String.raw`Termini che si cancellano a distanza 2: restano $\frac12+\frac13$ (i primi due positivi), mentre $-\frac1{n+2}-\frac1{n+3}\to0$.`,
          ],
          result: String.raw`Somma $=\frac12+\frac13=\frac56$.`,
        },
        {
          id: 's13.def.L3.c6', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\frac{3}{n^2+3n}$.`,
          answer: '11/6',
          explain: String.raw`$\frac3{n(n+3)}=\frac1n-\frac1{n+3}$. Distanza 3: restano $1+\frac12+\frac13=\frac{11}6$.`,
        },
        {
          id: 's13.def.L3.c7', type: 'open', level: 3, source: 'Appello 10/02/2026 · A',
          prompt: String.raw`Dare la definizione di serie convergente e fornire un esempio di serie convergente, uno di serie divergente e uno di serie indeterminata.`,
          answer: String.raw`Data $(a_n)$, si pone $s_n=\sum_{k=1}^n a_k$ (somme parziali). La serie $\sum a_n$ **converge** se esiste finito $\lim_{n\to\infty}s_n=S$; $S$ è la somma.

- Convergente: $\sum_{n\ge1}\frac1{n(n+1)}=1$ (Mengoli, $s_n=1-\frac1{n+1}$), oppure $\sum_{n\ge0}\frac1{2^n}=2$.
- Divergente: $\sum_{n\ge1}1$ ($s_n=n\to+\infty$), oppure la geometrica di ragione $2$.
- Indeterminata: $\sum_{n\ge0}(-1)^n$ ($s_n$ vale alternativamente $1$ e $0$, non ha limite).`,
          rubric: [
            String.raw`Definisce le somme parziali $s_n$`,
            String.raw`Convergenza = limite **finito** di $s_n$ (non di $a_n$)`,
            'Esempio convergente corretto, con giustificazione',
            'Esempio divergente corretto, con giustificazione',
            String.raw`Esempio indeterminato corretto (es. $\sum(-1)^n$), con le somme parziali`,
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: 's13.def.gen-geom', type: 'gen', level: 2,
      gen: (R) => {
        const qd = R.int(2, 5);
        let p = R.nz(-(qd - 1), qd - 1);
        if (H.gcd(p, qd) !== 1) p = p > 0 ? 1 : -1;
        const n0 = R.pick([0, 1, 1, 2]);
        const c = R.pick([1, 1, 2, 3, 4]);
        const r = [p, qd];
        let first = [c, 1];
        for (let i = 0; i < n0; i++) first = qmul(first, r);
        const S = qmul(first, H.reduce(qd, qd - p));
        const rT = H.frac(p, qd);
        let term;
        if (p > 0 && R.chance(0.5)) {
          const num = p === 1 ? String(c) : c === 1 ? `${p}^n` : `${c}\\cdot ${p}^n`;
          term = String.raw`\frac{${num}}{${qd}^n}`;
        } else term = `${c === 1 ? '' : c}${par(rT)}^n`;
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\sum_{n=${n0}}^{+\infty}${term}$.`,
          answer: qstr(S),
          explain: String.raw`Geometrica di ragione $q=${rT}$, con $|q|<1$: converge. Primo termine (per $n=${n0}$): $${qtex(first)}$. Somma $=\dfrac{\text{primo termine}}{1-q}=\dfrac{${qtex(first)}}{${qtex(H.reduce(qd - p, qd))}}=${qtex(S)}$.`,
        };
      },
    },
    {
      id: 's13.def.gen-geom-car', type: 'gen', level: 2,
      gen: (R) => {
        let p, qd;
        do {
          qd = R.int(1, 4);
          p = R.nz(-7, 7);
        } while (H.gcd(p, qd) !== 1 || p === qd);
        const rT = H.frac(p, qd);
        const absLess = Math.abs(p) < qd;
        const formula = H.reduce(qd, qd - p);
        const opts = [String.raw`Converge a $${qtex(formula)}$`, String.raw`Diverge a $+\infty$`, 'È indeterminata', String.raw`Diverge a $-\infty$`];
        const ans = absLess ? 0 : p > qd ? 1 : 2;
        const why = absLess
          ? String.raw`$|q|<1$: converge a $\frac1{1-q}=${qtex(formula)}$.`
          : p > qd
            ? String.raw`$q>1$: $q^n\to+\infty$ e $s_n\to+\infty$. Il valore $\frac1{1-q}=${qtex(formula)}$ è la formula usata dove non vale (serve $|q|<1$).`
            : String.raw`$q\le-1$: $s_n=\frac{1-q^{n+1}}{1-q}$ oscilla senza limite. Il valore $\frac1{1-q}=${qtex(formula)}$ è la formula usata dove non vale (serve $|q|<1$). Non diverge a $-\infty$: le somme parziali cambiano segno o restano tra due valori.`;
        return {
          type: 'mcq',
          prompt: String.raw`Carattere della serie $\displaystyle\sum_{n=0}^{+\infty}${qd === 1 ? (p < 0 ? par(p) : p) : par(rT)}^n$.`,
          options: opts,
          answer: ans,
          explain: String.raw`È geometrica di ragione $q=${rT}$. ${why}`,
        };
      },
    },
    {
      id: 's13.def.gen-geom-x', type: 'gen', level: 2,
      gen: (R) => {
        if (R.chance(0.5)) {
          const a = R.int(-4, 4);
          const b = R.int(2, 5);
          const xa = a === 0 ? 'x' : `(x ${a > 0 ? '-' : '+'} ${Math.abs(a)})`;
          return {
            type: 'interval',
            prompt: String.raw`Per quali $x\in\R$ converge $\displaystyle\sum_{n=0}^{+\infty}\frac{${xa}^n}{${b}^n}$?`,
            answer: `(${a - b},${a + b})`,
            explain: String.raw`Geometrica di ragione $q=\frac{${a === 0 ? 'x' : xa.slice(1, -1)}}{${b}}$: converge sse $|q|<1$, cioè $|${a === 0 ? 'x' : xa.slice(1, -1)}|<${b}$, ossia $${a - b}<x<${a + b}$. Agli estremi $q=\pm1$ e la serie non converge.`,
          };
        }
        const k = R.int(2, 5);
        const h = R.int(-3, 3);
        const lo = H.reduce(-1 - h, k);
        const hi = H.reduce(1 - h, k);
        return {
          type: 'interval',
          prompt: String.raw`Per quali $x\in\R$ converge $\displaystyle\sum_{n=1}^{+\infty}(${H.lin(k, h)})^n$?`,
          answer: `(${qstr(lo)},${qstr(hi)})`,
          explain: String.raw`Geometrica di ragione $q=${H.lin(k, h)}$: converge sse $-1<${H.lin(k, h)}<1$, cioè $${qtex(lo)}<x<${qtex(hi)}$. L'indice di partenza non cambia il carattere.`,
        };
      },
    },
    {
      id: 's13.def.gen-mengoli', type: 'gen', level: 2,
      gen: (R) => {
        const d = R.int(1, 3);
        const a = R.int(0, 2);
        const n0 = R.int(1, 3);
        const k = d * R.int(1, 3);
        const m = n0 + a; // primo b_n = 1/(n0+a)
        let tail = [0, 1];
        const kept = [];
        for (let j = 0; j < d; j++) {
          tail = qadd(tail, [1, m + j]);
          kept.push(`\\frac{1}{${m + j}}`);
        }
        const S = qmul(tail, H.reduce(k, d));
        const den = H.poly([1, 2 * a + d, a * (a + d)], 'n');
        const kd = H.frac(k, d);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\sum_{n=${n0}}^{+\infty}\frac{${k}}{${den}}$.`,
          answer: qstr(S),
          explain: String.raw`Il denominatore è $${fac(a)}${fac(a + d)}$, quindi $\frac{${k}}{${fac(a)}${fac(a + d)}}=${kd === '1' ? '' : kd}\left(\frac1{${nk(a)}}-\frac1{${nk(a + d)}}\right)$ (fratti semplici). È telescopica: i termini si cancellano a distanza ${d}, e da $n=${n0}$ restano i primi ${d} positivi: $${kept.join('+')}$. Somma $=${kd === '1' ? '' : kd + '\\cdot' + qtex(tail) + '='}${qtex(S)}$.`,
        };
      },
    },
    {
      id: 's13.def.gen-parziale', type: 'gen', level: 1,
      gen: (R) => {
        const p = R.int(1, 4);
        const q = R.int(-3, 3);
        const N = R.int(3, 6);
        let s = 0;
        const terms = [];
        for (let n = 1; n <= N; n++) {
          s += p * n + q;
          terms.push(String(p * n + q));
        }
        return {
          type: 'num',
          prompt: String.raw`Per la serie $\displaystyle\sum_{n=1}^{+\infty}(${H.lin(p, q, 'n')})$ calcola la somma parziale $s_${N}$.`,
          answer: String(s),
          explain: String.raw`$s_${N}=a_1+\cdots+a_${N}=${terms.join('+').replace(/\+-/g, '-')}=${s}$. (La serie diverge a $+\infty$: $a_n\to+\infty$.)`,
        };
      },
    },
    {
      id: 's13.def.p1', type: 'tf', level: 2,
      prompt: String.raw`$\displaystyle\sum_{n=1}^{+\infty}\left(\frac12\right)^n=2$.`,
      answer: false,
      explain: String.raw`Falso: vale $2$ la serie da $n=0$. Da $n=1$ manca il termine $1$: la somma è $\frac{1/2}{1-1/2}=1$.`,
    },
    {
      id: 's13.def.p2', type: 'num', level: 3, source: 'Appello 03/09/2026 · A',
      prompt: String.raw`Determinare $\alpha\in\N$ tale che $\displaystyle\sum_{n=\alpha}^{+\infty}\frac1{n(n+1)}=\frac12$.`,
      answer: '2',
      explain: String.raw`$\sum_{n\ge\alpha}\left(\frac1n-\frac1{n+1}\right)=\frac1\alpha$ (resta solo il primo termine). $\frac1\alpha=\frac12\Rightarrow\alpha=2$.`,
    },
    {
      id: 's13.def.p3', type: 'mcq', level: 2,
      prompt: String.raw`Carattere di $\displaystyle\sum_{n=0}^{+\infty}(-1)^n$.`,
      options: ['Indeterminata', String.raw`Converge a $\frac12$`, String.raw`Converge a $0$`, String.raw`Diverge a $+\infty$`],
      answer: 0,
      explain: String.raw`Le somme parziali valgono $1,0,1,0,\dots$: nessun limite. $\frac12$ è la "media" delle somme parziali, o $\frac1{1-q}$ con $q=-1$ fuori dal campo di validità ($|q|<1$).`,
    },
    {
      id: 's13.def.p4', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\frac{9}{10^n}$ (cioè $0{,}999\ldots$).`,
      answer: '1',
      explain: String.raw`Geometrica di ragione $\frac1{10}$, primo termine $\frac9{10}$: $\frac{9/10}{9/10}=1$. Quindi $0{,}\overline9=1$.`,
    },
    {
      id: 's13.def.p5', type: 'open', level: 3, source: 'Itinere 15/01/2026 · A',
      prompt: String.raw`Si dimostri che la serie geometrica $\sum_{n\ge0}x^n$ converge se e solo se $-1<x<1$, e se ne calcoli la somma.`,
      answer: String.raw`Per $x\ne1$: $s_n=\sum_{k=0}^n x^k$, $s_n-xs_n=1-x^{n+1}$, quindi $s_n=\frac{1-x^{n+1}}{1-x}$.

- Se $|x|<1$: $x^{n+1}\to0$, $s_n\to\frac1{1-x}$: converge.
- Se $x=1$: $s_n=n+1\to+\infty$.
- Se $x>1$: $x^{n+1}\to+\infty$, $s_n\to+\infty$.
- Se $x\le-1$: $x^{n+1}$ non ha limite (oscilla, in modulo $\ge1$), quindi $s_n$ non ha limite: indeterminata.

Dunque converge sse $|x|<1$, con somma $\frac1{1-x}$.`,
      rubric: [
        String.raw`Formula $s_n=\frac{1-x^{n+1}}{1-x}$ ricavata (moltiplicando per $x$ e sottraendo)`,
        String.raw`Caso $|x|<1$: $x^{n+1}\to0$, somma $\frac1{1-x}$`,
        String.raw`Caso $x\ge1$: divergenza (con $x=1$ trattato a parte)`,
        String.raw`Caso $x\le-1$: indeterminata`,
      ],
    },
    {
      id: 's13.def.p6', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\sum_{n=1}^{+\infty}\frac{1}{(2n-1)(2n+1)}$.`,
      answer: '1/2',
      explain: String.raw`$\frac1{(2n-1)(2n+1)}=\frac12\left(\frac1{2n-1}-\frac1{2n+1}\right)$: telescopica con $b_n=\frac1{2n-1}$, $b_1=1$, $b_n\to0$. Somma $=\frac12\cdot1=\frac12$.`,
    },
  ],
  flashcards: [
    { id: 's13.def.fc1', kind: 'def', front: 'Somma parziale di una serie', back: String.raw`$s_n=\sum_{k=n_0}^{n}a_k$: somma dei termini dal primo indice fino a $n$. La serie $\sum a_n$ è la successione $(s_n)$.` },
    { id: 's13.def.fc2', kind: 'def', front: 'Serie convergente, divergente, indeterminata', back: String.raw`Converge se $s_n\to S\in\R$ ($S$ = somma); diverge se $s_n\to\pm\infty$; indeterminata se $\lim s_n$ non esiste.` },
    { id: 's13.def.fc3', kind: 'formula', front: 'Somma parziale della geometrica', back: String.raw`$1+q+\cdots+q^n=\dfrac{1-q^{n+1}}{1-q}$ per $q\neq1$.` },
    { id: 's13.def.fc4', kind: 'thm', front: String.raw`Carattere della serie geometrica $\sum_{n\ge0}q^n$`, back: String.raw`$|q|<1$: converge a $\frac1{1-q}$. $q\ge1$: diverge a $+\infty$. $q\le-1$: indeterminata.` },
    { id: 's13.def.fc5', kind: 'formula', front: String.raw`Geometrica che parte da $n_0$`, back: String.raw`$\sum_{n\ge n_0}q^n=\dfrac{q^{n_0}}{1-q}$ ($|q|<1$): primo termine diviso $1-q$.` },
    { id: 's13.def.fc6', kind: 'formula', front: 'Serie di Mengoli', back: String.raw`$\sum_{n\ge1}\frac1{n(n+1)}=\sum\left(\frac1n-\frac1{n+1}\right)=1$; da $n=m$ vale $\frac1m$.` },
    { id: 's13.def.fc7', kind: 'thm', front: 'Serie telescopica', back: String.raw`$a_n=b_n-b_{n+1}\Rightarrow s_n=b_1-b_{n+1}$. Converge sse $b_n$ ha limite finito $L$, e la somma è $b_1-L$.` },
    { id: 's13.def.fc8', kind: 'metodo', front: 'Calcolare una somma telescopica razionale', back: String.raw`Fratti semplici $\frac{k}{(n+a)(n+a+d)}=\frac kd\left(\frac1{n+a}-\frac1{n+a+d}\right)$; si cancellano a distanza $d$: restano i primi $d$ termini positivi.` },
    { id: 's13.def.fc9', kind: 'errore', front: 'Errore tipico con la geometrica', back: String.raw`Usare $\frac1{1-q}$ quando $|q|\ge1$ (es. $\sum2^n=-1$ è assurdo) o quando la serie non parte da $n=0$.` },
  ],
};

export default {
  id: 's13',
  title: 'Serie numeriche',
  subtitle: 'Somme parziali, criteri di convergenza, serie con parametri',
  intro: String.raw`Le serie compaiono in ogni tema: in Parte A (condizione necessaria, criterio del confronto, vero/falso sulle somme) e in Parte B (carattere di una serie con parametro, 2–4 punti). Qui impari a sommare infiniti termini e a decidere se la somma esiste.`,
  skills: [DEF],
};
