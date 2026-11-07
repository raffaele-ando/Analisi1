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

// =====================================================================
// s13.necessaria — condizione necessaria, armonica, armonica generalizzata
// =====================================================================
const NEC = {
  id: 's13.necessaria',
  title: 'Condizione necessaria e serie armonica',
  summary: String.raw`Dimostri che se una serie converge allora $a_n\to0$, sai che il viceversa è falso (serie armonica) e usi la serie armonica generalizzata $\sum\frac1{n^\alpha}$.`,
  prereq: ['s13.def', 's04.limiti'],
  examRefs: ['Itinere 15/01/2026 · A', 'Appello 15/01/2026 · A', 'Appello 03/09/2026 · B'],
  lessons: [
    {
      id: 's13.necessaria.L1',
      title: 'Il termine generale deve tendere a zero',
      cards: [
        {
          type: 'learn',
          title: "Un'idea semplice",
          body: String.raw`Se sommi infiniti numeri e la somma resta finita, prima o poi i numeri che aggiungi devono diventare piccolissimi. Se continuassi ad aggiungere quantità "grandi" (per esempio vicine a $\frac23$), la somma scapperebbe all'infinito.

>* **Condizione necessaria di convergenza.** Se $\sum a_n$ converge, allora $\displaystyle\lim_{n\to\infty}a_n=0$.

La forma più utile negli esercizi è la **contronominale**: se $a_n\not\to0$ (tende a un altro valore, o non ha limite), allora la serie **non** converge.

>! Il viceversa è **falso**: $a_n\to0$ non basta. La serie armonica $\sum\frac1n$ ha $a_n\to0$ ma diverge.`,
        },
        {
          type: 'example',
          title: 'Dimostrazione',
          problem: String.raw`Dimostra: se $\sum a_n$ converge, allora $a_n\to0$.`,
          steps: [
            String.raw`Sia $s_n=a_1+\cdots+a_n$. Per ipotesi $s_n\to S\in\R$.`,
            {
              text: String.raw`Il termine generale è la differenza di due somme parziali consecutive: $a_n=s_n-s_{n-1}$.`,
              ask: { type: 'mcq', prompt: String.raw`Come si scrive $a_n$ con le somme parziali?`, options: [String.raw`$a_n=s_n-s_{n-1}$`, String.raw`$a_n=s_{n+1}+s_n$`, String.raw`$a_n=\frac{s_n}{n}$`], answer: 0, explain: String.raw`$s_n=s_{n-1}+a_n$: l'ultima somma parziale si ottiene dalla precedente aggiungendo $a_n$.` },
            },
            String.raw`Anche $s_{n-1}\to S$ (è la stessa successione, spostata di un indice).`,
            String.raw`Per l'algebra dei limiti: $a_n=s_n-s_{n-1}\to S-S=0$.`,
          ],
          result: String.raw`Il punto chiave è che $S$ è **finito**: $S-S=0$ non avrebbe senso con $S=+\infty$.`,
        },
        {
          id: 's13.necessaria.L1.c1', type: 'tf', level: 3, source: 'Itinere 15/01/2026 · A',
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n=0}^{+\infty}\frac{2n+3}{3n+1}=\frac23$.`,
          answer: false,
          explain: String.raw`Falso. Il termine generale tende a $\frac23\neq0$: la condizione necessaria non è soddisfatta e la serie **non** converge (a termini positivi, diverge a $+\infty$). L'errore è confondere il limite di $a_n$ con la somma della serie.`,
        },
        {
          id: 's13.necessaria.L1.c2', type: 'mcq', level: 1,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac{n}{n+1}$.`,
          options: [String.raw`Diverge a $+\infty$`, String.raw`Converge a $1$`, 'È indeterminata', String.raw`Non si può dire: $a_n\to1$ non dà informazioni`],
          answer: 0,
          explain: String.raw`$a_n\to1\neq0$: la serie non converge. Avendo termini positivi non è indeterminata, quindi diverge a $+\infty$. "Converge a 1" confonde $\lim a_n$ con la somma; l'ultima opzione è sbagliata perché $a_n\not\to0$ è proprio un'informazione decisiva.`,
        },
        {
          id: 's13.necessaria.L1.c3', type: 'tf', level: 1,
          prompt: String.raw`Se $\lim a_n=0$ allora $\sum a_n$ converge.`,
          answer: false,
          explain: String.raw`Falso: è il viceversa della condizione necessaria. Controesempio: $\sum\frac1n$ diverge pur avendo $\frac1n\to0$.`,
        },
        {
          id: 's13.necessaria.L1.c4', type: 'num', level: 2,
          prompt: String.raw`Per $\displaystyle\sum_{n=1}^{+\infty}\left(1+\frac1n\right)^n$ calcola $\lim a_n$.`,
          answer: 'e',
          explain: String.raw`$\left(1+\frac1n\right)^n\to e\neq0$ (limite notevole). Quindi la serie non soddisfa la condizione necessaria: diverge a $+\infty$ (termini positivi).`,
        },
        {
          id: 's13.necessaria.L1.c5', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}(-1)^n\frac{n}{n+1}$.`,
          options: ['Non converge: è indeterminata', String.raw`Converge, perché i segni si alternano`, String.raw`Diverge a $+\infty$`, String.raw`Converge a $0$`],
          answer: 0,
          explain: String.raw`$|a_n|=\frac n{n+1}\to1$, quindi $a_n\not\to0$: la serie non converge. I segni alternati non aiutano se i termini non diventano piccoli. Si può vedere che $s_n$ oscilla (somma di $\sum(-1)^n$, limitata e oscillante, e di una serie convergente): è indeterminata.`,
        },
        {
          id: 's13.necessaria.L1.c6', type: 'mcq', level: 2,
          prompt: String.raw`Quale affermazione è equivalente alla condizione necessaria?`,
          options: [
            String.raw`Se $a_n\not\to0$, allora $\sum a_n$ non converge`,
            String.raw`Se $\sum a_n$ non converge, allora $a_n\not\to0$`,
            String.raw`Se $a_n\to0$, allora $\sum a_n$ converge`,
            String.raw`$\sum a_n$ converge se e solo se $a_n\to0$`,
          ],
          answer: 0,
          explain: String.raw`"$P\Rightarrow Q$" equivale a "non $Q\Rightarrow$ non $P$" (contronominale). Le altre sono l'inversa, il viceversa e il "se e solo se": tutte false (controesempio: $\sum\frac1n$).`,
        },
        {
          id: 's13.necessaria.L1.c7', type: 'order', level: 3, source: 'Appello 15/01/2026 · A',
          prompt: String.raw`Riordina la dimostrazione: "se $\sum a_n$ converge allora $a_n\to0$".`,
          steps: [
            String.raw`Sia $s_n=\sum_{k=1}^n a_k$; per ipotesi $s_n\to S$ con $S\in\R$.`,
            String.raw`Per ogni $n\ge2$ vale $a_n=s_n-s_{n-1}$.`,
            String.raw`Anche $s_{n-1}\to S$, perché è la stessa successione con l'indice spostato.`,
            String.raw`Per l'algebra dei limiti, $a_n\to S-S=0$, ed è lecito perché $S$ è finito.`,
          ],
          distractors: [String.raw`Poiché $a_n\to0$, le somme parziali sono limitate e quindi convergono.`, String.raw`Per ogni $n$ vale $a_n=s_{n+1}-s_{n-1}$.`],
          explain: String.raw`Il primo distrattore usa la tesi come ipotesi (ed è pure falso: armonica). Il secondo sbaglia la relazione: $s_{n+1}-s_{n-1}=a_n+a_{n+1}$.`,
        },
        {
          id: 's13.necessaria.L1.c8', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\cos\frac1n$.`,
          options: [String.raw`Diverge a $+\infty$`, 'Converge', 'È indeterminata'],
          answer: 0,
          explain: String.raw`$\cos\frac1n\to\cos0=1\neq0$: non converge. I termini sono positivi (definitivamente), quindi diverge a $+\infty$. Errore tipico: pensare che $\frac1n\to0$ renda piccolo il termine — conta il limite di $a_n$, non quello dell'argomento.`,
        },
        {
          id: 's13.necessaria.L1.c9', type: 'open', level: 3, source: 'Itinere 15/01/2026 · A',
          prompt: String.raw`Enunciare e dimostrare la condizione necessaria di convergenza per una serie numerica. Il viceversa vale?`,
          answer: String.raw`**Enunciato.** Se la serie $\sum_{n\ge1}a_n$ converge, allora $\lim_{n\to\infty}a_n=0$.

**Dimostrazione.** Sia $s_n=\sum_{k=1}^na_k$. Per ipotesi $s_n\to S\in\R$. Per $n\ge2$, $a_n=s_n-s_{n-1}$. Poiché anche $s_{n-1}\to S$, per l'algebra dei limiti $a_n\to S-S=0$ (operazione lecita perché $S$ è finito).

**Viceversa.** Falso: $\frac1n\to0$ ma $\sum\frac1n$ diverge (per esempio perché $\frac1k\ge\log\left(1+\frac1k\right)$ e $\sum_{k=1}^n\log\frac{k+1}k=\log(n+1)\to+\infty$).`,
          rubric: [
            'Enunciato corretto (ipotesi: la serie converge; tesi: il termine generale tende a 0)',
            String.raw`Scrive $a_n=s_n-s_{n-1}$`,
            String.raw`Usa $s_n\to S$ e $s_{n-1}\to S$ con $S$ finito`,
            String.raw`Conclude $a_n\to0$`,
            String.raw`Osserva che il viceversa è falso con un controesempio (armonica)`,
          ],
        },
      ],
    },
    {
      id: 's13.necessaria.L2',
      title: 'Serie armonica e armonica generalizzata',
      cards: [
        {
          type: 'learn',
          title: 'La serie armonica diverge',
          body: String.raw`La **serie armonica** è $\displaystyle\sum_{n=1}^{+\infty}\frac1n=1+\frac12+\frac13+\cdots$

Il termine generale tende a $0$, eppure la serie **diverge**: le somme parziali crescono come $\log n$, lentamente ma senza limite (servono più di $10^{43}$ termini per superare $100$).

Idea della prova: da $\log(1+x)\le x$ segue $\frac1k\ge\log\left(1+\frac1k\right)=\log(k+1)-\log k$, e sommando (telescopica):
$$s_n\ge\log(n+1)\to+\infty .$$`,
          plot: { fns: [{ f: 'log(x+1)', label: 'log(n+1)' }], x: [0, 10], y: [0, 3.2], points: [[1, 1], [2, 1.5], [3, 1.8333], [4, 2.0833], [5, 2.2833], [6, 2.45], [7, 2.5929], [8, 2.7179], [9, 2.829]] },
        },
        {
          type: 'example',
          title: "Divergenza dell'armonica",
          problem: String.raw`Dimostra che $\sum_{n\ge1}\frac1n=+\infty$.`,
          steps: [
            String.raw`Per $x>-1$ vale $\log(1+x)\le x$; con $x=\frac1k$: $\frac1k\ge\log\left(1+\frac1k\right)=\log\frac{k+1}k$.`,
            {
              text: String.raw`Sommo da $k=1$ a $n$: $s_n\ge\sum_{k=1}^n\left(\log(k+1)-\log k\right)=\log(n+1)$.`,
              ask: { type: 'expr', prompt: String.raw`Quanto vale la somma telescopica $\sum_{k=1}^n\left(\log(k+1)-\log k\right)$?`, answer: 'log(n+1)', vars: ['n'], domain: [1, 9], explain: String.raw`Si cancellano tutti i termini intermedi: resta $\log(n+1)-\log1=\log(n+1)$.` },
            },
            String.raw`$\log(n+1)\to+\infty$ e, per confronto, $s_n\to+\infty$.`,
          ],
          result: String.raw`La serie armonica diverge, pur avendo $a_n=\frac1n\to0$.`,
        },
        {
          type: 'learn',
          title: 'Armonica generalizzata',
          body: String.raw`>* $$\sum_{n=1}^{+\infty}\frac1{n^\alpha}\ \text{converge}\iff\alpha>1 .$$

- $\alpha\le0$: $\frac1{n^\alpha}=n^{-\alpha}\not\to0$, manca la condizione necessaria: diverge.
- $0<\alpha\le1$: $a_n\to0$ ma la serie diverge (per $\alpha=1$ è l'armonica; per $\alpha<1$ i termini sono ancora più grandi).
- $\alpha>1$: converge (si dimostra con il criterio integrale, nella prossima skill).

È la **serie campione**: quasi tutti gli esercizi si risolvono riconducendo $a_n$ a $\frac{c}{n^\alpha}$.`,
        },
        {
          id: 's13.necessaria.L2.c1', type: 'mcq', level: 1,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac1{\sqrt n}$.`,
          options: [String.raw`Diverge a $+\infty$`, 'Converge', 'È indeterminata'],
          answer: 0,
          explain: String.raw`$\frac1{\sqrt n}=\frac1{n^{1/2}}$: armonica generalizzata con $\alpha=\frac12\le1$, diverge. Che $\frac1{\sqrt n}\to0$ non basta.`,
        },
        {
          id: 's13.necessaria.L2.c2', type: 'match', level: 1,
          prompt: 'Abbina ogni serie al suo carattere.',
          pairs: [
            [String.raw`$\sum\frac1{n^2}$`, 'converge'],
            [String.raw`$\sum\frac1{n}$`, String.raw`diverge, ma $a_n\to0$`],
            [String.raw`$\sum\frac1{n^{-1}}=\sum n$`, String.raw`diverge, e $a_n\not\to0$`],
            [String.raw`$\sum\frac{(-1)^n n}{n+1}$`, 'indeterminata'],
          ],
          explain: String.raw`$\alpha=2>1$ converge; $\alpha=1$ armonica; $\alpha=-1$: $a_n=n\to+\infty$; l'ultima ha $|a_n|\to1$ e segni alterni: le somme parziali oscillano.`,
        },
        {
          id: 's13.necessaria.L2.c3', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac{1}{n\sqrt[3]{n}}$.`,
          options: ['Converge', String.raw`Diverge a $+\infty$`, 'Non soddisfa la condizione necessaria'],
          answer: 0,
          explain: String.raw`$n\sqrt[3]n=n^{1+\frac13}=n^{4/3}$: armonica generalizzata con $\alpha=\frac43>1$, converge.`,
        },
        {
          id: 's13.necessaria.L2.c4', type: 'interval', level: 2,
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n=1}^{+\infty}\frac1{n^{2\alpha-1}}$?`,
          answer: '(1,inf)',
          explain: String.raw`Serve esponente $>1$: $2\alpha-1>1\iff\alpha>1$.`,
        },
        {
          id: 's13.necessaria.L2.c5', type: 'interval', level: 2,
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n=1}^{+\infty}\frac{n^\alpha}{n^3}$?`,
          answer: '(-inf,2)',
          explain: String.raw`$\frac{n^\alpha}{n^3}=\frac1{n^{3-\alpha}}$: converge sse $3-\alpha>1\iff\alpha<2$.`,
        },
        {
          id: 's13.necessaria.L2.c6', type: 'interval', level: 2,
          prompt: String.raw`Per quali $\alpha$ la serie $\displaystyle\sum_{n=1}^{+\infty}\frac{n^\alpha}{n^3}$ soddisfa la condizione necessaria ($a_n\to0$)?`,
          answer: '(-inf,3)',
          explain: String.raw`$a_n=n^{\alpha-3}\to0\iff\alpha-3<0\iff\alpha<3$. Per $2\le\alpha<3$ la condizione necessaria vale ma la serie diverge: è la differenza tra "necessaria" e "sufficiente".`,
        },
        {
          id: 's13.necessaria.L2.c7', type: 'interval', level: 3,
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n=1}^{+\infty}\frac1{n^{\alpha^2}}$?`,
          answer: '(-inf,-1)U(1,inf)',
          explain: String.raw`Serve $\alpha^2>1\iff|\alpha|>1$, cioè $\alpha<-1$ oppure $\alpha>1$. Errore tipico: dimenticare le soluzioni negative.`,
        },
        {
          id: 's13.necessaria.L2.c8', type: 'tf', level: 2,
          prompt: String.raw`$\displaystyle\sum_{n=1}^{+\infty}\frac1{n^{1{,}001}}$ converge.`,
          answer: true,
          explain: String.raw`Vero: $\alpha=1{,}001>1$. Non importa quanto $\alpha$ sia vicino a $1$: conta solo che sia strettamente maggiore. (La somma è enorme, circa $1000$, ma finita.)`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's13.necessaria.gen-vf', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(1, 5), b = R.int(1, 6), c = R.int(2, 5), d = R.int(1, 6);
        const L = qtex(H.reduce(a, c));
        const n0 = R.pick([0, 1]);
        const kind = R.int(0, 2);
        const stmt = [
          String.raw`$\displaystyle\sum_{n=${n0}}^{+\infty}\frac{${H.lin(a, b, 'n')}}{${H.lin(c, d, 'n')}}=${L}$.`,
          String.raw`la serie $\displaystyle\sum_{n=${n0}}^{+\infty}\frac{${H.lin(a, b, 'n')}}{${H.lin(c, d, 'n')}}$ diverge a $+\infty$.`,
          String.raw`la serie $\displaystyle\sum_{n=${n0}}^{+\infty}\frac{${H.lin(a, b, 'n')}}{${H.lin(c, d, 'n')}}$ converge, perché il termine generale ha limite finito.`,
        ][kind];
        return {
          type: 'tf',
          prompt: String.raw`Vero o falso: ${stmt}`,
          answer: kind === 1,
          explain: String.raw`Il termine generale tende a $${L}\neq0$: la condizione necessaria non vale, quindi la serie **non** converge; ha termini positivi, perciò diverge a $+\infty$. ${kind === 0 ? String.raw`Scrivere che la somma è $${L}$ confonde il limite di $a_n$ con la somma.` : kind === 2 ? 'Per convergere non basta che $a_n$ abbia limite finito: deve tendere a $0$.' : ''}`,
        };
      },
    },
    {
      id: 's13.necessaria.gen-pot', type: 'gen', level: 2,
      gen: (R) => {
        // a_n = n^(m/2) / (n^b + c)  ~ n^(m/2 - b)
        const m = R.int(0, 6);
        const b = R.int(1, 4);
        const c = R.int(1, 5);
        const num = m === 0 ? '1' : m === 1 ? String.raw`\sqrt n` : m % 2 === 0 ? (m === 2 ? 'n' : `n^{${m / 2}}`) : String.raw`\sqrt{n^{${m}}}`;
        const den = `${b === 1 ? 'n' : `n^{${b}}`} + ${c}`;
        const p2 = 2 * b - m; // 2*(b - m/2)
        const pT = H.frac(p2, 2);
        const ans = p2 <= 0 ? 0 : p2 <= 2 ? 1 : 2;
        const why = [
          String.raw`Quindi $a_n\not\to0$ (tende a ${p2 === 0 ? '$1$' : '$+\\infty$'}): manca la condizione necessaria e la serie diverge a $+\infty$.`,
          String.raw`Qui $0<${pT}\le1$: $a_n\to0$ (condizione necessaria vera), ma la serie si comporta come l'armonica generalizzata con esponente $\le1$: diverge.`,
          String.raw`L'esponente è $${pT}>1$: converge, come $\sum\frac1{n^{${pT}}}$.`,
        ][ans];
        return {
          type: 'mcq',
          prompt: String.raw`Studia $\displaystyle\sum_{n=1}^{+\infty}\frac{${num}}{${den}}$.`,
          options: ['Non soddisfa la condizione necessaria: diverge', 'Soddisfa la condizione necessaria ma diverge', 'Converge'],
          noShuffle: true,
          answer: ans,
          explain: String.raw`Al denominatore domina la potenza più alta: $a_n\sim\frac{${num}}{${b === 1 ? 'n' : `n^{${b}}`}}=${p2 > 0 ? String.raw`\frac1{n^{${pT}}}` : p2 === 0 ? '1' : `n^{${H.frac(-p2, 2)}}`}$. ${why}`,
        };
      },
    },
    {
      id: 's13.necessaria.gen-alpha', type: 'gen', level: 2,
      gen: (R) => {
        // sum n^(p*alpha) / n^q  -> exponent e = q - p*alpha ; condizione necessaria: e>0 ; convergenza: e>1
        const p = R.pick([1, 2, 3, -1, -2]);
        const q = R.int(0, 4);
        const thr = (k) => H.reduce(q - k, p); // p*alpha < q - k
        const iv = (k) => (p > 0 ? `(-inf,${qstr(thr(k))})` : `(${qstr(thr(k))},inf)`);
        const ineq = (k) => (p > 0 ? String.raw`\alpha<${qtex(thr(k))}` : String.raw`\alpha>${qtex(thr(k))}`);
        const pa = p === 1 ? String.raw`\alpha` : p === -1 ? String.raw`-\alpha` : `${p}\\alpha`;
        const term = q === 0 ? `n^{${pa}}` : String.raw`\frac{n^{${pa}}}{${q === 1 ? 'n' : `n^{${q}}`}}`;
        const e = (q === 0 ? '' : String(q)) + (p > 0 ? `-${H.coef(p)}\\alpha` : `${q === 0 ? '' : '+'}${H.coef(-p)}\\alpha`);
        return {
          type: 'problem',
          prompt: String.raw`Si consideri $\displaystyle\sum_{n=1}^{+\infty}${term}$, con $\alpha\in\R$.`,
          parts: [
            { type: 'interval', prompt: String.raw`Per quali $\alpha$ vale la condizione necessaria $a_n\to0$?`, answer: iv(0), explain: String.raw`$a_n=\frac1{n^{${e}}}\to0$ sse l'esponente è positivo: $${e}>0\iff${ineq(0)}$.` },
            { type: 'interval', prompt: String.raw`Per quali $\alpha$ la serie converge?`, answer: iv(1), explain: String.raw`Armonica generalizzata: converge sse $${e}>1\iff${ineq(1)}$.` },
          ],
          solution: String.raw`$a_n=\frac1{n^{${e}}}$. Condizione necessaria: $${ineq(0)}$. Convergenza (armonica generalizzata, esponente $>1$): $${ineq(1)}$. Nella fascia intermedia $a_n\to0$ ma la serie diverge.`,
        };
      },
    },
    {
      id: 's13.necessaria.p1', type: 'mcq', level: 3,
      prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac1{n^{1+\frac1n}}$.`,
      options: [String.raw`Diverge a $+\infty$`, String.raw`Converge, perché l'esponente $1+\frac1n$ è maggiore di $1$`, 'Non soddisfa la condizione necessaria'],
      answer: 0,
      explain: String.raw`L'esponente non è una costante $\alpha>1$: tende a $1$. Infatti $n^{1+\frac1n}=n\cdot n^{1/n}$ e $n^{1/n}=e^{\frac{\log n}n}\to1$, quindi $a_n\sim\frac1n$ e la serie diverge come l'armonica. La condizione necessaria invece vale ($a_n\to0$).`,
    },
    {
      id: 's13.necessaria.p2', type: 'tf', level: 2,
      prompt: String.raw`La serie $\displaystyle\sum_{n=1}^{+\infty}\sin n$ converge.`,
      answer: false,
      explain: String.raw`Falso: $\sin n\not\to0$. Se fosse $\sin n\to0$, da $\sin(n+1)=\sin n\cos1+\cos n\sin1$ seguirebbe $\cos n\to0$, assurdo perché $\sin^2n+\cos^2n=1$. Manca la condizione necessaria.`,
    },
    {
      id: 's13.necessaria.p3', type: 'mcq', level: 2,
      prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}n\sin\frac1n$.`,
      options: [String.raw`Diverge a $+\infty$`, 'Converge', 'È indeterminata'],
      answer: 0,
      explain: String.raw`Limite notevole: $n\sin\frac1n=\frac{\sin(1/n)}{1/n}\to1\neq0$. Termini positivi e condizione necessaria violata: diverge a $+\infty$.`,
    },
    {
      id: 's13.necessaria.p4', type: 'num', level: 2,
      prompt: String.raw`Per $\displaystyle\sum_{n=1}^{+\infty}\left(1-\frac2n\right)^n$ calcola $\lim a_n$ (e deduci il carattere).`,
      answer: 'e^(-2)',
      explain: String.raw`$\left(1+\frac{x}n\right)^n\to e^x$, qui $x=-2$: $a_n\to e^{-2}\neq0$. La serie diverge a $+\infty$ (termini positivi per $n\ge3$).`,
    },
    {
      id: 's13.necessaria.p5', type: 'cloze', level: 1,
      text: String.raw`Se la serie $\sum a_n$ [[0]], allora $a_n\to0$. La condizione $a_n\to0$ è [[1]] ma non [[2]]: per esempio la serie $\sum\frac1n$ [[3]].`,
      blanks: [
        { options: ['converge', 'diverge', 'è a termini positivi'], answer: 0 },
        { options: ['necessaria', 'sufficiente'], answer: 0 },
        { options: ['sufficiente', 'necessaria'], answer: 0 },
        { options: ['diverge', 'converge a 0', 'è indeterminata'], answer: 0 },
      ],
      explain: String.raw`Necessaria: deve valere se la serie converge. Non sufficiente: può valere anche per serie divergenti, come l'armonica.`,
    },
    {
      id: 's13.necessaria.p6', type: 'order', level: 2,
      prompt: String.raw`Riordina la dimostrazione che $\sum_{n\ge1}\frac1n$ diverge.`,
      steps: [
        String.raw`Per $x>-1$ vale $\log(1+x)\le x$.`,
        String.raw`Con $x=\frac1k$: $\frac1k\ge\log(k+1)-\log k$.`,
        String.raw`Sommando da $1$ a $n$ (telescopica): $s_n\ge\log(n+1)$.`,
        String.raw`Poiché $\log(n+1)\to+\infty$, per confronto $s_n\to+\infty$.`,
      ],
      distractors: [String.raw`Poiché $\frac1n\to0$, la serie converge.`],
      explain: String.raw`Il distrattore usa il viceversa (falso) della condizione necessaria.`,
    },
    {
      id: 's13.necessaria.p7', type: 'interval', level: 2,
      prompt: String.raw`Per quali $\alpha$ converge $\displaystyle\sum_{n=1}^{+\infty}\frac{\sqrt n}{n^{\alpha}}$?`,
      answer: '(3/2,inf)',
      explain: String.raw`$\frac{\sqrt n}{n^\alpha}=\frac1{n^{\alpha-\frac12}}$: converge sse $\alpha-\frac12>1\iff\alpha>\frac32$.`,
    },
    {
      id: 's13.necessaria.p8', type: 'tf', level: 2,
      prompt: String.raw`Se $\sum a_n$ converge, allora anche $\sum_{n\ge100}a_n$ converge.`,
      answer: true,
      explain: String.raw`Vero: togliere un numero finito di termini sposta tutte le somme parziali della stessa costante ($a_1+\cdots+a_{99}$). Il carattere non cambia; la somma sì.`,
    },
  ],
  flashcards: [
    { id: 's13.necessaria.fc1', kind: 'thm', front: 'Condizione necessaria di convergenza', back: String.raw`Se $\sum a_n$ converge, allora $a_n\to0$. Equivalente: se $a_n\not\to0$ la serie non converge.` },
    { id: 's13.necessaria.fc2', kind: 'dim', front: 'Dimostrazione della condizione necessaria', back: String.raw`$s_n\to S\in\R$. Per $n\ge2$: $a_n=s_n-s_{n-1}$. Anche $s_{n-1}\to S$, quindi $a_n\to S-S=0$ (lecito perché $S$ è finito).` },
    { id: 's13.necessaria.fc3', kind: 'errore', front: String.raw`"$a_n\to0$, quindi la serie converge"`, back: String.raw`Falso: la condizione è solo necessaria. Controesempio: $\sum\frac1n$ diverge.` },
    { id: 's13.necessaria.fc4', kind: 'thm', front: 'Serie armonica', back: String.raw`$\sum_{n\ge1}\frac1n=+\infty$. Prova: $\frac1k\ge\log\frac{k+1}k$, quindi $s_n\ge\log(n+1)\to+\infty$.` },
    { id: 's13.necessaria.fc5', kind: 'thm', front: 'Serie armonica generalizzata', back: String.raw`$\sum_{n\ge1}\frac1{n^\alpha}$ converge $\iff\alpha>1$. Per $\alpha\le0$ manca anche la condizione necessaria.` },
    { id: 's13.necessaria.fc6', kind: 'errore', front: String.raw`"$\sum a_n=\lim a_n$"`, back: String.raw`Errore tipico (V/F d'esame $\sum\frac{2n+3}{3n+1}=\frac23$): $\frac23$ è il limite di $a_n$; essendo $\neq0$ la serie diverge.` },
    { id: 's13.necessaria.fc7', kind: 'metodo', front: 'Primo controllo su ogni serie', back: String.raw`Calcola $\lim a_n$. Se non è $0$ (o non esiste) hai finito: la serie non converge. Se è $0$ servono i criteri.` },
  ],
};

// =====================================================================
// s13.positivi — termini positivi, confronto, asintotico, radice, rapporto, integrale
// =====================================================================
/** 1/n^p in LaTeX (p = 1, 2, 3 o 1/2) */
const invPow = (p) => (p === 1 ? String.raw`\frac1n` : p === 0.5 ? String.raw`\frac{1}{\sqrt n}` : String.raw`\frac{1}{n^{${p}}}`);
/** n^q come prefattore (q = 0, 1/2, 1, 3/2, 2) */
const preTex = (q) => ({ 0: '', 0.5: String.raw`\sqrt n\,`, 1: 'n', 1.5: String.raw`n\sqrt n\,`, 2: 'n^{2}' })[q];
const decTex = (x) => (Number.isInteger(x) ? String(x) : H.frac(Math.round(x * 2), 2));
const decStr = (x) => (Number.isInteger(x) ? String(x) : H.fracStr(Math.round(x * 2), 2));
/** funzioni elementari che per x -> 0 valgono ~ k x^m */
const SMALL = [
  { t: (a) => String.raw`\sin${a}`, m: 1, k: [1, 1], eq: (a) => a, name: String.raw`\sin x\sim x` },
  { t: (a) => String.raw`\tan${a}`, m: 1, k: [1, 1], eq: (a) => a, name: String.raw`\tan x\sim x` },
  { t: (a) => String.raw`\arctan${a}`, m: 1, k: [1, 1], eq: (a) => a, name: String.raw`\arctan x\sim x` },
  { t: (a) => String.raw`\log\left(1+${a}\right)`, m: 1, k: [1, 1], eq: (a) => a, name: String.raw`\log(1+x)\sim x` },
  { t: (a) => String.raw`\left(e^{${a}}-1\right)`, m: 1, k: [1, 1], eq: (a) => a, name: String.raw`e^x-1\sim x` },
  { t: (a) => String.raw`\left(1-\cos${a}\right)`, m: 2, k: [1, 2], name: String.raw`1-\cos x\sim\frac{x^2}2` },
  { t: (a) => String.raw`\left(\sqrt{1+${a}}-1\right)`, m: 1, k: [1, 2], name: String.raw`\sqrt{1+x}-1\sim\frac x2` },
];

const POS = {
  id: 's13.positivi',
  title: 'Serie a termini positivi: i criteri',
  summary: String.raw`Usi confronto (con dimostrazione), confronto asintotico, radice, rapporto e criterio integrale per decidere il carattere di una serie a termini positivi.`,
  prereq: ['s13.necessaria', 's06.gerarchia', 's10.sviluppi', 's12.criteri'],
  examRefs: ['Appello 11/06/2026 · A', 'Appello 10/02/2026 · B', 'Appello 03/09/2026 · B'],
  lessons: [
    {
      id: 's13.positivi.L1',
      title: 'Termini positivi e criterio del confronto',
      cards: [
        {
          type: 'learn',
          title: 'Niente oscillazioni',
          body: String.raw`Se $a_n\ge0$ (almeno definitivamente), ogni nuovo termine fa **crescere** la somma parziale: $s_{n+1}=s_n+a_{n+1}\ge s_n$.

>* Una serie a termini non negativi **non è mai indeterminata**: converge se $(s_n)$ è limitata, altrimenti diverge a $+\infty$.

È il teorema delle successioni monotone applicato a $(s_n)$. Quindi per una serie a termini positivi basta capire se le somme parziali restano limitate. Lo si fa **confrontando** con serie note.`,
        },
        {
          type: 'learn',
          title: 'Il criterio del confronto',
          body: String.raw`>* **Criterio del confronto.** Siano $0\le a_n\le b_n$ (definitivamente). Allora:
>* - se $\sum b_n$ converge, anche $\sum a_n$ converge;
>* - se $\sum a_n$ diverge, anche $\sum b_n$ diverge.

Intuizione: la serie più piccola non può superare quella più grande.

>! Le altre due direzioni non dicono niente: se la più grande diverge, la più piccola può fare di tutto; se la più piccola converge, la più grande pure.`,
        },
        {
          type: 'example',
          title: 'Dimostrazione del confronto',
          problem: String.raw`Siano $0\le a_n\le b_n$ per ogni $n$, $s_n=\sum_{k=1}^na_k$, $t_n=\sum_{k=1}^nb_k$. Dimostra che se $\sum b_n$ converge allora $\sum a_n$ converge.`,
          steps: [
            String.raw`Sommando le disuguaglianze $a_k\le b_k$ per $k=1,\dots,n$: $s_n\le t_n$.`,
            String.raw`$(t_n)$ è crescente (termini $\ge0$) e converge a $T$: quindi $t_n\le T$ per ogni $n$.`,
            {
              text: String.raw`Allora $s_n\le t_n\le T$: $(s_n)$ è crescente e limitata superiormente.`,
              ask: { type: 'mcq', prompt: String.raw`Perché $(s_n)$ è crescente?`, options: [String.raw`Perché $a_n\ge0$`, String.raw`Perché $a_n\le b_n$`, String.raw`Perché $t_n$ converge`], answer: 0, explain: String.raw`$s_{n+1}-s_n=a_{n+1}\ge0$. La disuguaglianza $a_n\le b_n$ serve invece per la limitatezza.` },
            },
            String.raw`Per il teorema sulle successioni monotone $s_n$ converge (a un valore $\le T$).`,
            String.raw`Per la seconda parte: se $s_n\to+\infty$, da $t_n\ge s_n$ segue $t_n\to+\infty$ (confronto tra successioni).`,
          ],
          result: String.raw`Se $a_n\le b_n$ vale solo definitivamente, si tolgono i primi termini: il carattere non cambia.`,
        },
        {
          id: 's13.positivi.L1.c1', type: 'mcq', level: 1,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac1{n^2+n+1}$.`,
          options: [String.raw`Converge: $\frac1{n^2+n+1}\le\frac1{n^2}$`, String.raw`Diverge: $\frac1{n^2+n+1}\le\frac1n$`, 'Non si può dire'],
          answer: 0,
          explain: String.raw`$n^2+n+1\ge n^2$, quindi $0<a_n\le\frac1{n^2}$, che converge: per confronto anche $\sum a_n$ converge. La seconda opzione sbaglia direzione: essere **minore** di una serie divergente non dice nulla.`,
        },
        {
          id: 's13.positivi.L1.c2', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac{2+\sin n}{n}$.`,
          options: [String.raw`Diverge a $+\infty$`, 'Converge', String.raw`È indeterminata, perché $\sin n$ oscilla`],
          answer: 0,
          explain: String.raw`$2+\sin n\ge1$, quindi $a_n\ge\frac1n>0$: per confronto con l'armonica diverge. Non può essere indeterminata: i termini sono positivi.`,
        },
        {
          id: 's13.positivi.L1.c3', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac{|\sin n|}{n^2}$.`,
          options: ['Converge', String.raw`Diverge a $+\infty$`, 'Non si può dire: il seno non ha limite'],
          answer: 0,
          explain: String.raw`$0\le\frac{|\sin n|}{n^2}\le\frac1{n^2}$, e $\sum\frac1{n^2}$ converge. Il confronto non richiede che $a_n$ abbia una forma "pulita": basta una maggiorazione.`,
        },
        {
          id: 's13.positivi.L1.c4', type: 'tf', level: 2,
          prompt: String.raw`Se $0\le a_n\le\frac1n$ per ogni $n$, allora $\sum a_n$ diverge.`,
          answer: false,
          explain: String.raw`Falso: essere più piccoli di una serie divergente non dà informazioni. Per esempio $a_n=\frac1{n^2}\le\frac1n$ e converge; $a_n=\frac1{2n}\le\frac1n$ e diverge.`,
        },
        {
          id: 's13.positivi.L1.c5', type: 'mcq', level: 2,
          prompt: String.raw`Per $\displaystyle\sum_{n=1}^{+\infty}\frac1{n+\sqrt n}$, quale confronto funziona?`,
          options: [String.raw`$\frac1{n+\sqrt n}\ge\frac1{2n}$: diverge`, String.raw`$\frac1{n+\sqrt n}\le\frac1n$: diverge`, String.raw`$\frac1{n+\sqrt n}\le\frac1{\sqrt n}$: converge`],
          answer: 0,
          explain: String.raw`$\sqrt n\le n$ dà $n+\sqrt n\le2n$, quindi $a_n\ge\frac1{2n}$ e $\sum\frac1{2n}$ diverge. Le altre due maggiorano con serie divergenti: non concludono nulla (e la terza conclude pure il falso).`,
        },
        {
          id: 's13.positivi.L1.c6', type: 'order', level: 3, source: 'Appello 11/06/2026 · A',
          prompt: String.raw`Riordina la dimostrazione: "se $0\le a_n\le b_n$ e $\sum b_n$ converge, allora $\sum a_n$ converge".`,
          steps: [
            String.raw`Siano $s_n=\sum_{k=1}^na_k$ e $t_n=\sum_{k=1}^nb_k$; da $a_k\le b_k$ segue $s_n\le t_n$.`,
            String.raw`$(t_n)$ è crescente e converge a $T\in\R$, quindi $t_n\le T$ per ogni $n$.`,
            String.raw`Dunque $s_n\le T$: $(s_n)$ è limitata superiormente.`,
            String.raw`$(s_n)$ è crescente perché $a_n\ge0$.`,
            String.raw`Una successione crescente e limitata converge: $\sum a_n$ converge.`,
          ],
          distractors: [String.raw`Poiché $a_n\le b_n$ e $b_n\to0$, anche $a_n\to0$, quindi $\sum a_n$ converge.`, String.raw`$(s_n)$ è crescente perché $a_n\le b_n$.`],
          explain: String.raw`Il primo distrattore usa il viceversa (falso) della condizione necessaria. Il secondo sbaglia il motivo della monotonia: serve $a_n\ge0$.`,
        },
        {
          id: 's13.positivi.L1.c7', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac1{n\,2^n}$.`,
          options: [String.raw`Converge: $\frac1{n2^n}\le\frac1{2^n}$`, String.raw`Diverge: $\frac1{n2^n}\le\frac1n$`, String.raw`Diverge: non soddisfa la condizione necessaria`],
          answer: 0,
          explain: String.raw`$n\ge1$ dà $\frac1{n2^n}\le\frac1{2^n}$, geometrica di ragione $\frac12$: converge. (La somma vale $\log2$: lo vedrai con le serie di Taylor.)`,
        },
        {
          id: 's13.positivi.L1.c8', type: 'open', level: 3, source: 'Appello 11/06/2026 · A',
          prompt: String.raw`Enunciare e dimostrare il criterio del confronto per le serie a termini non negativi.`,
          answer: String.raw`**Enunciato.** Siano $0\le a_n\le b_n$ per ogni $n$ (basta definitivamente). Se $\sum b_n$ converge, allora $\sum a_n$ converge; se $\sum a_n$ diverge, allora $\sum b_n$ diverge.

**Dimostrazione.** Siano $s_n=\sum_{k=1}^na_k$, $t_n=\sum_{k=1}^nb_k$. Da $a_k\le b_k$ si ha $s_n\le t_n$. Entrambe sono crescenti (termini $\ge0$).

Se $\sum b_n$ converge a $T$, allora $t_n\le T$ per ogni $n$ (successione crescente), quindi $s_n\le T$: $(s_n)$ è crescente e limitata, perciò converge. Se $\sum a_n$ diverge, $s_n\to+\infty$ e da $t_n\ge s_n$ segue $t_n\to+\infty$.

Se la disuguaglianza vale solo per $n\ge n_0$, si applica la prova alle serie da $n_0$: togliere un numero finito di termini non cambia il carattere.`,
          rubric: [
            String.raw`Enunciato completo con l'ipotesi $0\le a_n\le b_n$ e le due conclusioni`,
            String.raw`Confronto delle somme parziali $s_n\le t_n$`,
            String.raw`Monotonia di $s_n$ dovuta ad $a_n\ge0$`,
            String.raw`Limitatezza $s_n\le T$ e teorema delle successioni monotone`,
            'Parte sulla divergenza (o osservazione sul "definitivamente")',
          ],
        },
      ],
    },
    {
      id: 's13.positivi.L2',
      title: 'Confronto asintotico',
      cards: [
        {
          type: 'learn',
          title: 'Conta solo come si comporta per n grande',
          body: String.raw`>* **Confronto asintotico.** Siano $a_n,b_n>0$ e $\displaystyle\frac{a_n}{b_n}\to\ell$.
>* - $0<\ell<+\infty$ (in particolare $a_n\sim b_n$): le due serie hanno **lo stesso carattere**;
>* - $\ell=0$: se $\sum b_n$ converge, converge anche $\sum a_n$;
>* - $\ell=+\infty$: se $\sum b_n$ diverge, diverge anche $\sum a_n$.

**Ricetta.** Trova la parte principale: $a_n\sim\frac{c}{n^p}$ (con $c>0$). Allora $\sum a_n$ converge $\iff p>1$.

Strumenti: potenza dominante nei polinomi, limiti notevoli ($\sin x\sim x$, $\log(1+x)\sim x$, $e^x-1\sim x$, $1-\cos x\sim\frac{x^2}2$) e sviluppi di Taylor con $x=\frac1n\to0$.`,
        },
        {
          type: 'example',
          title: 'Una razionale',
          problem: String.raw`Studia $\displaystyle\sum_{n=1}^{+\infty}\frac{n+1}{n^3+2}$.`,
          steps: [
            String.raw`Termini positivi. Tengo le potenze dominanti: $n+1\sim n$, $n^3+2\sim n^3$.`,
            String.raw`$a_n\sim\frac{n}{n^3}=\frac1{n^2}$.`,
            String.raw`$\sum\frac1{n^2}$ converge ($p=2>1$): per confronto asintotico converge anche $\sum a_n$.`,
          ],
          result: 'Converge.',
        },
        {
          type: 'example',
          title: 'Con un limite notevole',
          problem: String.raw`Studia $\displaystyle\sum_{n=1}^{+\infty}\left(1-\cos\frac1n\right)$.`,
          steps: [
            String.raw`$\frac1n\in(0,1]$, quindi $\cos\frac1n<1$: termini positivi.`,
            {
              text: String.raw`Con $x=\frac1n\to0$: $1-\cos x\sim\frac{x^2}2$, quindi $a_n\sim\frac1{2n^2}$.`,
              ask: { type: 'num', prompt: String.raw`$a_n\sim\frac{c}{n^p}$: quanto vale $p$?`, answer: '2', explain: String.raw`$1-\cos\frac1n\sim\frac12\cdot\frac1{n^2}$: $p=2$ (e $c=\frac12$).` },
            },
            String.raw`$p=2>1$: converge.`,
          ],
          result: String.raw`Converge. Confronta: $\sum\sin\frac1n$ invece diverge, perché $\sin\frac1n\sim\frac1n$.`,
        },
        {
          id: 's13.positivi.L2.c1', type: 'num', level: 1,
          prompt: String.raw`$a_n=\dfrac{\sqrt n}{n^2+1}\sim\dfrac1{n^p}$. Quanto vale $p$?`,
          answer: '3/2',
          explain: String.raw`$a_n\sim\frac{n^{1/2}}{n^2}=\frac1{n^{3/2}}$: $p=\frac32>1$, la serie converge.`,
        },
        {
          id: 's13.positivi.L2.c2', type: 'mcq', level: 1,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\log\left(1+\frac1{n^2}\right)$.`,
          options: ['Converge', String.raw`Diverge a $+\infty$`, 'Indeterminata'],
          answer: 0,
          explain: String.raw`$\log(1+x)\sim x$ con $x=\frac1{n^2}$: $a_n\sim\frac1{n^2}$, converge.`,
        },
        {
          id: 's13.positivi.L2.c3', type: 'mcq', level: 1,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\left(e^{1/n}-1\right)$.`,
          options: [String.raw`Diverge a $+\infty$`, 'Converge', String.raw`Converge, perché $e^{1/n}-1\to0$`],
          answer: 0,
          explain: String.raw`$e^x-1\sim x$: $a_n\sim\frac1n$, come l'armonica: diverge. Che $a_n\to0$ è solo la condizione necessaria.`,
        },
        {
          id: 's13.positivi.L2.c4', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\left(\sqrt{n+1}-\sqrt n\right)$.`,
          options: [String.raw`Diverge a $+\infty$`, 'Converge', 'Non soddisfa la condizione necessaria'],
          answer: 0,
          explain: String.raw`Razionalizzo: $\sqrt{n+1}-\sqrt n=\frac1{\sqrt{n+1}+\sqrt n}\sim\frac1{2\sqrt n}$, $p=\frac12\le1$: diverge. (È anche telescopica: $s_n=\sqrt{n+1}-1\to+\infty$.) La condizione necessaria invece vale.`,
        },
        {
          id: 's13.positivi.L2.c5', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac{\log n}{n^2}$.`,
          options: ['Converge', String.raw`Diverge: $\log n\to+\infty$`, String.raw`Non si può dire: non è $\sim\frac c{n^p}$`],
          answer: 0,
          explain: String.raw`Confronto con $b_n=\frac1{n^{3/2}}$: $\frac{a_n}{b_n}=\frac{\log n}{\sqrt n}\to0$ (gerarchia degli infiniti). Caso $\ell=0$ con $\sum b_n$ convergente: converge. Il logaritmo "pesa" meno di qualunque potenza $n^\varepsilon$.`,
        },
        {
          id: 's13.positivi.L2.c6', type: 'tf', level: 2,
          prompt: String.raw`$\displaystyle\sum_{n=2}^{+\infty}\frac{\log n}{n}$ diverge.`,
          answer: true,
          explain: String.raw`Vero: per $n\ge3$ $\log n>1$, quindi $\frac{\log n}n>\frac1n$ e per confronto con l'armonica diverge.`,
        },
        {
          id: 's13.positivi.L2.c7', type: 'interval', level: 2,
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n=1}^{+\infty}n^\alpha\sin\frac1{n^2}$?`,
          answer: '(-inf,1)',
          explain: String.raw`$\sin\frac1{n^2}\sim\frac1{n^2}$ (positivo), quindi $a_n\sim\frac{n^\alpha}{n^2}=\frac1{n^{2-\alpha}}$. Converge sse $2-\alpha>1\iff\alpha<1$.`,
        },
        {
          id: 's13.positivi.L2.c8', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac{\arctan n}{n^2}$.`,
          options: ['Converge', String.raw`Diverge, perché $\arctan n\to\frac\pi2\neq0$`, 'Indeterminata'],
          answer: 0,
          explain: String.raw`$a_n\sim\frac{\pi/2}{n^2}$: stesso carattere di $\sum\frac1{n^2}$, converge. La condizione necessaria riguarda $a_n$, non un suo fattore: qui $a_n\to0$.`,
        },
        {
          id: 's13.positivi.L2.c9', type: 'tf', level: 3,
          prompt: String.raw`Se $a_n\sim b_n$ e $\sum b_n$ converge, allora $\sum a_n$ converge, anche quando $b_n$ cambia segno.`,
          answer: false,
          explain: String.raw`Falso: il confronto asintotico richiede termini **positivi**. Controesempio: $b_n=\frac{(-1)^n}{\sqrt n}$ (converge per Leibniz), $a_n=b_n+\frac1n$: $\frac{a_n}{b_n}=1+\frac{(-1)^n}{\sqrt n}\to1$, ma $\sum a_n$ diverge (somma di una convergente e dell'armonica).`,
        },
      ],
    },
    {
      id: 's13.positivi.L3',
      title: 'Rapporto, radice e criterio integrale',
      cards: [
        {
          type: 'learn',
          title: 'Quando ci sono fattoriali o potenze n-esime',
          body: String.raw`Per $a_n>0$:

>* **Criterio del rapporto.** Se $\dfrac{a_{n+1}}{a_n}\to\ell$: per $\ell<1$ la serie converge, per $\ell>1$ diverge.
>* **Criterio della radice.** Se $\sqrt[n]{a_n}\to\ell$: per $\ell<1$ converge, per $\ell>1$ diverge.

>! Se $\ell=1$ il criterio **non dice nulla**: $\sum\frac1n$ e $\sum\frac1{n^2}$ danno entrambe $\ell=1$. Allora si usa il confronto (asintotico).

Il rapporto è comodo con $n!$ e $c^n$; la radice con espressioni elevate alla $n$.`,
        },
        {
          type: 'example',
          title: 'Criterio del rapporto',
          problem: String.raw`Studia $\displaystyle\sum_{n=1}^{+\infty}\frac{n}{2^n}$.`,
          steps: [
            String.raw`$\frac{a_{n+1}}{a_n}=\frac{n+1}{2^{n+1}}\cdot\frac{2^n}{n}=\frac{n+1}{2n}$.`,
            {
              text: String.raw`$\frac{n+1}{2n}\to\frac12$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $\ell=\lim\frac{a_{n+1}}{a_n}$?`, answer: '1/2', explain: String.raw`$\frac{n+1}{2n}=\frac12\left(1+\frac1n\right)\to\frac12$.` },
            },
            String.raw`$\ell=\frac12<1$: la serie converge.`,
          ],
          result: String.raw`Converge (la somma vale $2$).`,
        },
        {
          id: 's13.positivi.L3.c1', type: 'num', level: 1,
          prompt: String.raw`Per $\displaystyle\sum\frac{3^n}{n^2}$ calcola $\ell=\lim\frac{a_{n+1}}{a_n}$.`,
          answer: '3',
          explain: String.raw`$\frac{3^{n+1}}{(n+1)^2}\cdot\frac{n^2}{3^n}=3\left(\frac n{n+1}\right)^2\to3>1$: diverge (del resto $a_n\to+\infty$).`,
        },
        {
          id: 's13.positivi.L3.c2', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\frac{n!}{n^n}$.`,
          options: [String.raw`Converge: $\ell=\frac1e$`, String.raw`Diverge: $\ell=e$`, String.raw`Non si può dire: $\ell=1$`],
          answer: 0,
          explain: String.raw`$\frac{a_{n+1}}{a_n}=\frac{(n+1)!}{(n+1)^{n+1}}\cdot\frac{n^n}{n!}=\frac{n^n}{(n+1)^n}=\frac1{\left(1+\frac1n\right)^n}\to\frac1e<1$: converge.`,
        },
        {
          id: 's13.positivi.L3.c3', type: 'num', level: 2,
          prompt: String.raw`Per $\displaystyle\sum\left(\frac{n}{2n+1}\right)^n$ calcola $\ell=\lim\sqrt[n]{a_n}$.`,
          answer: '1/2',
          explain: String.raw`$\sqrt[n]{a_n}=\frac n{2n+1}\to\frac12<1$: converge per il criterio della radice.`,
        },
        {
          id: 's13.positivi.L3.c4', type: 'mcq', level: 2,
          prompt: String.raw`Per $\displaystyle\sum\frac1{n^2}$ il criterio del rapporto dà $\ell=1$. Che cosa si conclude?`,
          options: ['Niente dal rapporto: si usa la serie armonica generalizzata, e converge', String.raw`Diverge, perché $\ell\ge1$`, String.raw`Converge, perché $\ell\le1$`],
          answer: 0,
          explain: String.raw`Con $\ell=1$ il criterio è inconcludente. $\sum\frac1{n^2}$ converge ($p=2$), $\sum\frac1n$ diverge, ed entrambe hanno $\ell=1$.`,
        },
        {
          id: 's13.positivi.L3.c5', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=0}^{+\infty}\frac{2^n}{n!}$.`,
          options: [String.raw`Converge: $\ell=0$`, String.raw`Diverge: $2^n\to+\infty$`, String.raw`Diverge: $\ell=2$`],
          answer: 0,
          explain: String.raw`$\frac{a_{n+1}}{a_n}=\frac{2}{n+1}\to0<1$: converge. Il fattoriale cresce più di ogni esponenziale ($\frac{b^n}{n!}\to0$). La somma è $e^2$.`,
        },
        {
          type: 'learn',
          title: 'Criterio integrale',
          body: String.raw`>* **Criterio integrale.** Sia $f:[1,+\infty)\to\R$ continua, positiva e **decrescente**. Allora $\sum_{n\ge1}f(n)$ e $\int_1^{+\infty}f(x)\,dx$ hanno lo stesso carattere.

Perché: su $[k,k+1]$ vale $f(k+1)\le f(x)\le f(k)$; integrando e sommando,
$$\sum_{k=2}^{n+1}f(k)\le\int_1^{n+1}f(x)\,dx\le\sum_{k=1}^{n}f(k).$$
Dai campioni $\int_1^{+\infty}\frac{dx}{x^\alpha}$ (converge sse $\alpha>1$) e $\int_2^{+\infty}\frac{dx}{x\log^\beta x}$ (converge sse $\beta>1$):

>* $\displaystyle\sum_{n\ge2}\frac1{n^\alpha\log^\beta n}$ converge $\iff\alpha>1$, oppure $\alpha=1$ e $\beta>1$.`,
          plot: { fns: [{ f: '1/x^2', label: '1/x²' }], x: [0.5, 6], y: [0, 1.2], points: [[1, 1], [2, 0.25], [3, 0.1111], [4, 0.0625], [5, 0.04]] },
        },
        {
          type: 'example',
          title: 'Una serie con il logaritmo',
          problem: String.raw`Studia $\displaystyle\sum_{n=2}^{+\infty}\frac1{n\log n}$.`,
          steps: [
            String.raw`$f(x)=\frac1{x\log x}$ è continua, positiva e decrescente su $[2,+\infty)$ (il denominatore cresce).`,
            {
              text: String.raw`Con $t=\log x$: $\int_2^{M}\frac{dx}{x\log x}=\log(\log M)-\log(\log2)$.`,
              ask: { type: 'mcq', prompt: String.raw`Quanto vale $\lim_{M\to+\infty}\log(\log M)$?`, options: [String.raw`$+\infty$`, '0', '1'], answer: 0, explain: String.raw`$\log M\to+\infty$ e quindi anche $\log(\log M)\to+\infty$, molto lentamente.` },
            },
            String.raw`L'integrale diverge, quindi diverge anche la serie.`,
          ],
          result: String.raw`$\sum\frac1{n\log n}$ diverge, mentre $\sum\frac1{n\log^2n}$ converge.`,
        },
        {
          id: 's13.positivi.L3.c6', type: 'interval', level: 2,
          prompt: String.raw`Per quali $\beta\in\R$ converge $\displaystyle\sum_{n=2}^{+\infty}\frac{1}{n\,(\log n)^\beta}$?`,
          answer: '(1,inf)',
          explain: String.raw`Con il criterio integrale e $t=\log x$: $\int_2^{+\infty}\frac{dx}{x\log^\beta x}=\int_{\log2}^{+\infty}\frac{dt}{t^\beta}$, che converge sse $\beta>1$.`,
        },
        {
          id: 's13.positivi.L3.c7', type: 'mcq', level: 3,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}n^2e^{-n}$.`,
          options: [String.raw`Converge: $\sqrt[n]{a_n}\to\frac1e$`, String.raw`Diverge: $n^2\to+\infty$`, String.raw`Non si può dire: $\ell=1$`],
          answer: 0,
          explain: String.raw`$\sqrt[n]{n^2e^{-n}}=\frac{(\sqrt[n]n)^2}{e}\to\frac1e<1$, perché $\sqrt[n]n\to1$. Converge. (Anche il rapporto: $\left(\frac{n+1}n\right)^2e^{-1}\to\frac1e$.)`,
        },
        {
          id: 's13.positivi.L3.c8', type: 'match', level: 2,
          prompt: 'Abbina ogni serie al criterio più rapido.',
          pairs: [
            [String.raw`$\sum\frac{5^n}{n!}$`, 'rapporto'],
            [String.raw`$\sum\left(\frac{n+1}{3n}\right)^n$`, 'radice'],
            [String.raw`$\sum\frac{n+3}{n^3+1}$`, 'confronto asintotico'],
            [String.raw`$\sum\frac1{n\log^3n}$`, 'criterio integrale'],
          ],
          explain: String.raw`Fattoriali → rapporto. Potenza $n$-esima → radice. Razionali → parte principale $\frac1{n^2}$. Logaritmi al denominatore con $\frac1n$ → integrale (o la tabella dei campioni).`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's13.positivi.gen-rapporto', type: 'gen', level: 2,
      gen: (R) => {
        const f = R.int(0, 5);
        const c = R.int(2, 5);
        const k = R.int(1, 3);
        const nk2 = k === 1 ? 'n' : `n^{${k}}`;
        let term, ell, ellS, calc;
        if (f === 0) {
          term = String.raw`\frac{${nk2}}{${c}^n}`;
          ell = 1 / c; ellS = `1/${c}`;
          calc = String.raw`\frac{a_{n+1}}{a_n}=\left(\frac{n+1}{n}\right)^{${k}}\cdot\frac1{${c}}\to\frac1{${c}}`;
        } else if (f === 1) {
          term = String.raw`\frac{${c}^n}{${nk2}}`;
          ell = c; ellS = String(c);
          calc = String.raw`\frac{a_{n+1}}{a_n}=${c}\left(\frac{n}{n+1}\right)^{${k}}\to${c}`;
        } else if (f === 2) {
          term = String.raw`\frac{${c}^n}{n!}`;
          ell = 0; ellS = '0';
          calc = String.raw`\frac{a_{n+1}}{a_n}=\frac{${c}^{n+1}}{(n+1)!}\cdot\frac{n!}{${c}^n}=\frac{${c}}{n+1}\to0`;
        } else if (f === 3) {
          term = String.raw`\frac{n!}{${c}^n}`;
          ell = Infinity; ellS = 'inf';
          calc = String.raw`\frac{a_{n+1}}{a_n}=\frac{n+1}{${c}}\to+\infty`;
        } else if (f === 4) {
          let d = R.int(2, 6);
          if (d === c) d = c + 1;
          term = String.raw`\frac{${c}^n}{${d}^n\,${nk2}}`;
          ell = c / d; ellS = H.fracStr(c, d);
          calc = String.raw`\frac{a_{n+1}}{a_n}=\frac{${c}}{${d}}\left(\frac{n}{n+1}\right)^{${k}}\to${H.frac(c, d)}`;
        } else {
          const cc = R.pick([1, 2, 3, 5, 6]);
          term = String.raw`\frac{${cc === 1 ? '' : `${cc}^n`}(n!)^2}{(2n)!}`;
          ell = cc / 4; ellS = H.fracStr(cc, 4);
          calc = String.raw`\frac{a_{n+1}}{a_n}=${cc === 1 ? '' : cc}\frac{(n+1)^2}{(2n+2)(2n+1)}=${cc === 1 ? '' : cc}\frac{n+1}{2(2n+1)}\to${H.frac(cc, 4)}`;
        }
        const conv = ell < 1;
        return {
          type: 'problem',
          prompt: String.raw`Si studi con il criterio del rapporto $\displaystyle\sum_{n=1}^{+\infty}${term}$.`,
          parts: [
            { type: 'num', prompt: String.raw`$\ell=\displaystyle\lim_{n\to\infty}\frac{a_{n+1}}{a_n}$ (scrivi inf se è $+\infty$)`, answer: ellS, explain: String.raw`$${calc}$.` },
            { type: 'mcq', prompt: 'Carattere della serie', options: ['Converge', String.raw`Diverge a $+\infty$`, 'Il criterio non decide'], answer: conv ? 0 : 1, explain: conv ? String.raw`$\ell<1$: converge.` : String.raw`$\ell>1$: diverge (i termini non tendono nemmeno a $0$).` },
          ],
          solution: String.raw`Termini positivi. $${calc}$, quindi per il criterio del rapporto la serie ${conv ? 'converge' : 'diverge'}.`,
        };
      },
    },
    {
      id: 's13.positivi.gen-radice', type: 'gen', level: 2,
      gen: (R) => {
        const f = R.int(0, 2);
        if (f === 2) {
          const c = R.int(2, 4);
          return {
            type: 'problem',
            prompt: String.raw`Si studi $\displaystyle\sum_{n=1}^{+\infty}\frac{\left(1+\frac1n\right)^{n^2}}{${c}^n}$.`,
            parts: [
              { type: 'num', prompt: String.raw`$\ell=\displaystyle\lim\sqrt[n]{a_n}$`, answer: `e/${c}`, explain: String.raw`$\sqrt[n]{a_n}=\frac{\left(1+\frac1n\right)^n}{${c}}\to\frac e{${c}}$.` },
              { type: 'mcq', prompt: 'Carattere', options: ['Converge', String.raw`Diverge a $+\infty$`, 'Il criterio non decide'], answer: c > Math.E ? 0 : 1, explain: c > Math.E ? String.raw`$e\approx2{,}718<${c}$: $\ell<1$, converge.` : String.raw`$e\approx2{,}718>2$: $\ell>1$, diverge.` },
            ],
            solution: String.raw`Criterio della radice: $\sqrt[n]{a_n}=\frac{(1+1/n)^n}{${c}}\to\frac e{${c}}$, ${c > Math.E ? 'minore di 1: converge' : 'maggiore di 1: diverge'}.`,
          };
        }
        let a, c;
        do {
          a = R.int(1, 5);
          c = R.int(1, 5);
        } while (a === c || H.gcd(a, c) !== 1);
        const b = R.int(1, 4), d = R.int(1, 4);
        const base = String.raw`\left(\frac{${H.lin(a, b, 'n')}}{${H.lin(c, d, 'n')}}\right)`;
        const conv = a < c;
        if (f === 0) {
          return {
            type: 'problem',
            prompt: String.raw`Si studi con il criterio della radice $\displaystyle\sum_{n=1}^{+\infty}${base}^{n}$.`,
            parts: [
              { type: 'num', prompt: String.raw`$\ell=\displaystyle\lim\sqrt[n]{a_n}$`, answer: H.fracStr(a, c), explain: String.raw`$\sqrt[n]{a_n}=\frac{${H.lin(a, b, 'n')}}{${H.lin(c, d, 'n')}}\to${H.frac(a, c)}$.` },
              { type: 'mcq', prompt: 'Carattere', options: ['Converge', String.raw`Diverge a $+\infty$`, 'Il criterio non decide'], answer: conv ? 0 : 1, explain: conv ? String.raw`$\ell<1$: converge.` : String.raw`$\ell>1$: diverge.` },
            ],
            solution: String.raw`Termini positivi; $\sqrt[n]{a_n}\to${H.frac(a, c)}$, ${conv ? 'minore di 1: converge' : 'maggiore di 1: diverge'}.`,
          };
        }
        return {
          type: 'problem',
          prompt: String.raw`Si studi $\displaystyle\sum_{n=1}^{+\infty}${base}^{n^2}$.`,
          parts: [
            { type: 'num', prompt: String.raw`$\ell=\displaystyle\lim\sqrt[n]{a_n}$ (scrivi inf se è $+\infty$)`, answer: conv ? '0' : 'inf', explain: String.raw`$\sqrt[n]{a_n}=${base}^{n}$: la base tende a $${H.frac(a, c)}$, ${conv ? 'minore di 1, quindi la potenza $n$-esima tende a $0$' : 'maggiore di 1, quindi la potenza $n$-esima tende a $+\\infty$'}.` },
            { type: 'mcq', prompt: 'Carattere', options: ['Converge', String.raw`Diverge a $+\infty$`, 'Il criterio non decide'], answer: conv ? 0 : 1, explain: conv ? String.raw`$\ell=0<1$: converge.` : String.raw`$\ell=+\infty$: diverge.` },
          ],
          solution: String.raw`Criterio della radice: $\sqrt[n]{a_n}=${base}^n\to${conv ? '0' : '+\\infty'}$, quindi la serie ${conv ? 'converge' : 'diverge'}.`,
        };
      },
    },
    {
      id: 's13.positivi.gen-asint', type: 'gen', level: 2,
      gen: (R) => {
        let F, p, q, s;
        do {
          F = R.pick(SMALL);
          p = R.pick([1, 2, 3, 0.5]);
          q = R.pick([0, 0, 1, 2, 0.5, 1.5]);
          s = F.m * p - q;
        } while (s <= 0 || s > 5);
        const arg = invPow(p);
        const [kn, kd] = F.k;
        const cT = H.frac(kn, kd);
        const conv = s > 1;
        const sT = decTex(s);
        const pre = preTex(q);
        return {
          type: 'problem',
          prompt: String.raw`Si studi $\displaystyle\sum_{n=1}^{+\infty}${pre}${F.t(arg)}$.`,
          parts: [
            { type: 'num', prompt: String.raw`Scrivi $a_n\sim\dfrac{c}{n^p}$: quanto vale $p$?`, answer: decStr(s), explain: String.raw`Da $${F.name}$ con $x=${arg}\to0$: $${F.t(arg)}\sim${cT === '1' ? '' : cT}\left(${arg}\right)^{${F.m}}$, quindi $a_n\sim\frac{${cT === '1' ? '1' : cT}\,n^{${decTex(q)}}}{n^{${decTex(F.m * p)}}}$ e $p=${sT}$.` },
            { type: 'mcq', prompt: 'Carattere della serie', options: ['Converge', String.raw`Diverge a $+\infty$`], answer: conv ? 0 : 1, explain: conv ? String.raw`$p=${sT}>1$: converge per confronto asintotico con $\sum\frac1{n^{${sT}}}$.` : String.raw`$p=${sT}\le1$: diverge per confronto asintotico con $\sum\frac1{n^{${sT}}}$.` },
          ],
          solution: String.raw`Termini positivi. $${F.name}$ per $x\to0$; con $x=${arg}$: $a_n\sim\frac{${cT}}{n^{${sT}}}$. Per confronto asintotico con l'armonica generalizzata la serie ${conv ? 'converge' : 'diverge'} ($p=${sT}$).`,
        };
      },
    },
    {
      id: 's13.positivi.gen-razionale', type: 'gen', level: 1,
      gen: (R) => {
        const d1 = R.int(0, 2);
        const d2 = d1 + R.int(1, 3);
        const a = R.int(1, 4), b = R.int(1, 4);
        const P = [a];
        for (let i = 0; i < d1; i++) P.push(R.int(0, 5));
        const Q = [b];
        for (let i = 0; i < d2; i++) Q.push(R.chance(0.6) ? 0 : R.int(1, 5));
        if (Q[Q.length - 1] === 0) Q[Q.length - 1] = R.int(1, 5);
        const p = d2 - d1;
        const conv = p > 1;
        return {
          type: 'tuple',
          prompt: String.raw`$a_n=\dfrac{${H.poly(P, 'n')}}{${H.poly(Q, 'n')}}\sim\dfrac{c}{n^p}$. Trova $c$ e $p$; poi deduci il carattere di $\sum a_n$.`,
          labels: ['c', 'p'],
          answer: [H.fracStr(a, b), String(p)],
          explain: String.raw`Restano le potenze dominanti: $a_n\sim\frac{${H.coef(a) || '1'}${d1 === 0 ? '' : d1 === 1 ? 'n' : `n^{${d1}}`}}{${H.coef(b)}n^{${d2}}}=\frac{${H.frac(a, b)}}{n^{${p}}}$. Quindi $c=${H.frac(a, b)}$, $p=${p}$: la serie ${conv ? 'converge ($p>1$)' : 'diverge ($p=1$, come l\'armonica)'}.`,
        };
      },
    },
    {
      id: 's13.positivi.p1', type: 'cloze', level: 1,
      text: String.raw`Siano $a_n,b_n>0$ con $\frac{a_n}{b_n}\to\ell$. Se $0<\ell<+\infty$ le serie [[0]]. Se $\ell=0$ e $\sum b_n$ [[1]], allora $\sum a_n$ converge. Se $\ell=+\infty$ e $\sum b_n$ [[2]], allora $\sum a_n$ diverge.`,
      blanks: [
        { options: ['hanno lo stesso carattere', 'hanno la stessa somma', 'convergono entrambe'], answer: 0 },
        { options: ['converge', 'diverge'], answer: 0 },
        { options: ['diverge', 'converge'], answer: 0 },
      ],
      explain: String.raw`$\ell=0$ significa $a_n$ "molto più piccolo" di $b_n$: eredita la convergenza. $\ell=+\infty$: $a_n$ molto più grande, eredita la divergenza. Il carattere è lo stesso, la somma no.`,
    },
    {
      id: 's13.positivi.p2', type: 'tf', level: 1,
      prompt: String.raw`Se il criterio del rapporto dà $\ell=1$, la serie diverge.`,
      answer: false,
      explain: String.raw`Falso: con $\ell=1$ il criterio non decide. $\sum\frac1{n^2}$ (converge) e $\sum\frac1n$ (diverge) hanno entrambe $\ell=1$.`,
    },
    {
      id: 's13.positivi.p3', type: 'interval', level: 3,
      prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n=2}^{+\infty}\frac1{n^\alpha\log n}$?`,
      answer: '(1,inf)',
      explain: String.raw`Campione $\frac1{n^\alpha\log^\beta n}$ con $\beta=1$: converge sse $\alpha>1$, oppure $\alpha=1$ e $\beta>1$. Qui $\beta=1$, quindi $\alpha=1$ dà $\sum\frac1{n\log n}$, divergente. Risposta: $\alpha>1$.`,
    },
    {
      id: 's13.positivi.p4', type: 'mcq', level: 2,
      prompt: String.raw`Carattere di $\displaystyle\sum_{n=2}^{+\infty}\frac1{(\log n)^n}$.`,
      options: [String.raw`Converge: $\sqrt[n]{a_n}=\frac1{\log n}\to0$`, String.raw`Diverge: $\log n$ cresce lentamente`, String.raw`Non si può dire: $\ell=1$`],
      answer: 0,
      explain: String.raw`Criterio della radice: $\sqrt[n]{a_n}=\frac1{\log n}\to0<1$, converge.`,
    },
    {
      id: 's13.positivi.p5', type: 'mcq', level: 2,
      prompt: String.raw`Carattere di $\displaystyle\sum_{n=2}^{+\infty}\frac1{\log n}$.`,
      options: [String.raw`Diverge a $+\infty$`, 'Converge', String.raw`Converge, perché $\frac1{\log n}\to0$`],
      answer: 0,
      explain: String.raw`$\log n<n$, quindi $\frac1{\log n}>\frac1n$: per confronto con l'armonica diverge.`,
    },
    {
      id: 's13.positivi.p6', type: 'mcq', level: 3,
      prompt: String.raw`Carattere di $\displaystyle\sum_{n=1}^{+\infty}\left(\frac1n-\sin\frac1n\right)$.`,
      options: ['Converge', String.raw`Diverge a $+\infty$`, String.raw`Non si sa: $\frac1n$ e $\sin\frac1n$ divergono entrambe`],
      answer: 0,
      explain: String.raw`Taylor: $\sin x=x-\frac{x^3}6+o(x^3)$, quindi $x-\sin x\sim\frac{x^3}6$ e $a_n\sim\frac1{6n^3}$ (positivo): converge. Non si può spezzare in $\sum\frac1n-\sum\sin\frac1n$: sarebbe $\infty-\infty$.`,
    },
    {
      id: 's13.positivi.p7', type: 'tf', level: 2,
      prompt: String.raw`Se $a_n\ge0$ e $\sum a_n$ converge, allora $\sum a_n^2$ converge.`,
      answer: true,
      explain: String.raw`Vero: $a_n\to0$, quindi definitivamente $0\le a_n\le1$ e $a_n^2\le a_n$; per confronto $\sum a_n^2$ converge.`,
    },
  ],
  flashcards: [
    { id: 's13.positivi.fc1', kind: 'thm', front: 'Serie a termini non negativi', back: String.raw`$a_n\ge0\Rightarrow s_n$ crescente: la serie converge (se $s_n$ è limitata) o diverge a $+\infty$. Mai indeterminata.` },
    { id: 's13.positivi.fc2', kind: 'thm', front: 'Criterio del confronto', back: String.raw`$0\le a_n\le b_n$ definitivamente. $\sum b_n$ converge $\Rightarrow\sum a_n$ converge; $\sum a_n$ diverge $\Rightarrow\sum b_n$ diverge.` },
    { id: 's13.positivi.fc3', kind: 'dim', front: 'Dimostrazione del criterio del confronto', back: String.raw`$s_n\le t_n$ sommando $a_k\le b_k$. $t_n\uparrow T$ quindi $t_n\le T$; allora $s_n\le T$. $s_n$ crescente ($a_n\ge0$) e limitata ⇒ converge. Se $s_n\to+\infty$, $t_n\ge s_n\to+\infty$.` },
    { id: 's13.positivi.fc4', kind: 'thm', front: 'Confronto asintotico', back: String.raw`$a_n,b_n>0$, $\frac{a_n}{b_n}\to\ell$. $0<\ell<\infty$: stesso carattere. $\ell=0$: $\sum b$ conv ⇒ $\sum a$ conv. $\ell=\infty$: $\sum b$ div ⇒ $\sum a$ div.` },
    { id: 's13.positivi.fc5', kind: 'thm', front: 'Criterio del rapporto', back: String.raw`$a_n>0$, $\frac{a_{n+1}}{a_n}\to\ell$: $\ell<1$ converge, $\ell>1$ diverge, $\ell=1$ nessuna informazione.` },
    { id: 's13.positivi.fc6', kind: 'thm', front: 'Criterio della radice', back: String.raw`$a_n\ge0$, $\sqrt[n]{a_n}\to\ell$: $\ell<1$ converge, $\ell>1$ diverge, $\ell=1$ nessuna informazione.` },
    { id: 's13.positivi.fc7', kind: 'thm', front: 'Criterio integrale', back: String.raw`$f$ continua, positiva, decrescente su $[1,+\infty)$: $\sum f(n)$ e $\int_1^{+\infty}f$ hanno lo stesso carattere.` },
    { id: 's13.positivi.fc8', kind: 'formula', front: String.raw`Serie campione $\sum\frac1{n^\alpha\log^\beta n}$`, back: String.raw`Converge $\iff\alpha>1$, oppure $\alpha=1$ e $\beta>1$.` },
    { id: 's13.positivi.fc9', kind: 'metodo', front: 'Scegliere il criterio', back: String.raw`1) $a_n\to0$? 2) Razionali, radici, funzioni di $\frac1n$: parte principale $\frac c{n^p}$. 3) $n!$, $c^n$: rapporto. 4) Potenze alla $n$: radice. 5) $\log$ con $\frac1n$: integrale.` },
    { id: 's13.positivi.fc10', kind: 'errore', front: 'Confronto nella direzione sbagliata', back: String.raw`$a_n\le\frac1n$ non dice nulla; $a_n\ge\frac1{n^2}$ non dice nulla. Si maggiora con una convergente o si minora con una divergente.` },
  ],
};

export default {
  id: 's13',
  title: 'Serie numeriche',
  subtitle: 'Somme parziali, criteri di convergenza, serie con parametri',
  intro: String.raw`Le serie compaiono in ogni tema: in Parte A (condizione necessaria, criterio del confronto, vero/falso sulle somme) e in Parte B (carattere di una serie con parametro, 2–4 punti). Qui impari a sommare infiniti termini e a decidere se la somma esiste.`,
  skills: [DEF, NEC, POS],
};
