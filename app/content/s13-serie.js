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

// =====================================================================
// s13.alterni — serie a segni alterni: Leibniz, convergenza semplice e assoluta
// =====================================================================
const ALT = {
  id: 's13.alterni',
  title: 'Serie a segni alterni',
  summary: String.raw`Applichi il criterio di Leibniz, distingui convergenza semplice e assoluta e riconosci le trappole d'esame.`,
  prereq: ['s13.positivi', 's13.necessaria'],
  examRefs: ['Itinere 15/01/2026 · Parte B', 'Appello 15/01/2026 · Parte B', 'Appello 10/02/2026 · Parte B', 'Appello 06/07/2026 · Parte B'],
  lessons: [
    {
      id: 's13.alterni.L1',
      title: 'Segni che si alternano',
      cards: [
        {
          type: 'learn',
          title: 'Più, meno, più, meno…',
          body: String.raw`Sommiamo $\displaystyle 1-\frac12+\frac13-\frac14+\cdots=\sum_{n\ge1}\frac{(-1)^{n+1}}{n}$, un termine alla volta.

Le somme parziali vanno su e giù:

- $s_1=1$
- $s_2=\frac12$
- $s_3=\frac56$
- $s_4=\frac7{12}$

Ogni salto va alternativamente in su e in giù, e ogni salto è più corto del precedente. Le somme si stringono attorno a un numero, qui $\log 2\approx0{,}693$. Questa è una serie **a segni alterni**.`,
        },
        {
          type: 'learn',
          title: 'Serie a segni alterni',
          body: String.raw`Una serie è **a segni alterni** se i suoi termini cambiano segno a ogni passo. Si scrive così, con $a_n\ge0$ detto **modulo** del termine:

$$\sum_{n=1}^{+\infty}(-1)^n a_n\qquad\text{oppure}\qquad\sum_{n=1}^{+\infty}(-1)^{n+1} a_n.$$

Le due scritture differiscono solo per il segno di tutta la serie. Se una converge, converge anche l'altra.`,
        },
        {
          id: 's13.alterni.L1.c3', type: 'mcq', level: 1,
          prompt: String.raw`Quale di queste serie **non** è a segni alterni?`,
          options: [
            String.raw`$\displaystyle\sum_{n\ge1}\frac{(-1)^n}{n^2}$`,
            String.raw`$\displaystyle\sum_{n\ge1}(-1)^{n+1}\frac{1}{2^n}$`,
            String.raw`$\displaystyle\sum_{n\ge1}\frac{1+(-1)^n}{n}$`,
          ],
          answer: 2,
          explain: String.raw`$\frac{1+(-1)^n}{n}$ vale $\frac2n$ per $n$ pari e $0$ per $n$ dispari: tutti i termini sono $\ge0$, nessun cambio di segno. Le altre due alternano segno a ogni passo.`,
        },
        {
          type: 'example',
          title: 'Le somme parziali, passo passo',
          problem: String.raw`Calcola le prime somme parziali di $\displaystyle\sum_{n\ge1}\frac{(-1)^{n+1}}{n^2}$ e osserva come si comportano.`,
          steps: [
            String.raw`Il primo termine è $\frac{(-1)^2}{1^2}=1$: quindi $s_1=1$.`,
            String.raw`Il secondo termine è $-\frac14$: quindi $s_2=1-\frac14=\frac34$.`,
            String.raw`Il terzo termine è $+\frac19$: quindi $s_3=\frac34+\frac19=\frac{31}{36}$.`,
            {
              text: String.raw`Il quarto termine è $-\frac1{16}$: quindi $s_4=\frac{31}{36}-\frac1{16}$.`,
              ask: {
                type: 'num', prompt: String.raw`Quanto vale $s_4$? Scrivi la frazione ridotta.`,
                answer: '115/144',
                explain: String.raw`$\frac{31}{36}=\frac{124}{144}$ e $\frac1{16}=\frac9{144}$: $s_4=\frac{115}{144}\approx0{,}80$.`,
              },
            },
          ],
          result: String.raw`Le somme salgono e scendono, ma le oscillazioni si accorciano: convergono a $\frac{\pi^2}{12}\approx0{,}82$ (lo calcolerai con le serie di Taylor).`,
        },
        {
          type: 'learn',
          title: 'Il criterio di Leibniz',
          body: String.raw`>* **Teorema di Leibniz.** Se $a_n\ge0$ è **decrescente** e $a_n\to0$, allora $\displaystyle\sum_{n\ge1}(-1)^{n+1}a_n$ converge.

Le due ipotesi vanno verificate entrambe. Non serve che la decrescenza valga già da $n=1$: basta che valga da un certo punto in poi. Se una delle due ipotesi manca, il teorema non dice nulla.`,
        },
        {
          id: 's13.alterni.L1.c6', type: 'tf', level: 1,
          prompt: String.raw`Se $a_n\to0$, allora $\displaystyle\sum_{n\ge1}(-1)^{n}a_n$ converge.`,
          answer: false,
          explain: String.raw`Falso: $a_n\to0$ è solo la condizione necessaria. Controesempio: $a_n=\frac1n$ per $n$ dispari e $a_n=\frac1{n^2}$ per $n$ pari. I termini dispari valgono $-\frac1n$ e la loro somma va a $-\infty$; i termini pari danno un contributo finito. La serie diverge.`,
        },
        {
          id: 's13.alterni.L1.c7', type: 'order', level: 2,
          prompt: String.raw`Riordina l'idea della dimostrazione di Leibniz (con $a_n$ decrescente e infinitesima).`,
          steps: [
            String.raw`Le somme di indice pari crescono: $s_{2k+2}-s_{2k}=a_{2k+1}-a_{2k+2}\ge0$.`,
            String.raw`Le somme di indice dispari decrescono: $s_{2k+3}-s_{2k+1}=a_{2k+3}-a_{2k+2}\le0$.`,
            String.raw`Ogni somma pari è minore o uguale ad ogni somma dispari: $s_{2k}\le s_{2h+1}$ per ogni $k,h$.`,
            String.raw`Quindi la successione pari è crescente e limitata, e converge a un limite $S$.`,
            String.raw`Anche le somme dispari convergono, allo stesso $S$, perché $s_{2k+1}-s_{2k}=a_{2k+1}\to0$. Dunque $\sum(-1)^{n+1}a_n$ converge.`,
          ],
          distractors: [
            String.raw`Poiché $a_n\to0$, ogni somma parziale converge, quindi la serie converge.`,
            String.raw`Le somme dispari crescono perché $a_n$ è decrescente.`,
          ],
          explain: String.raw`Il trucco è confrontare le somme pari con le somme dispari, che "racchiudono" $S$. Il primo distrattore è la trappola classica: $a_n\to0$ non basta. Il secondo inverte il verso della monotonia.`,
        },
        {
          id: 's13.alterni.L1.c8', type: 'num', level: 1,
          prompt: String.raw`Per $\displaystyle\sum_{n\ge1}\frac{(-1)^{n+1}}{n}$, quanto vale la somma parziale $s_4$? Scrivi la frazione.`,
          answer: '7/12',
          explain: String.raw`$s_4=1-\frac12+\frac13-\frac14=\frac{12-6+4-3}{12}=\frac7{12}$.`,
        },
        {
          id: 's13.alterni.L1.c9', type: 'tf', level: 1,
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\frac{(-1)^n}{n+1}$ converge.`,
          answer: true,
          explain: String.raw`Vero: $a_n=\frac1{n+1}$ è positiva, decrescente e tende a $0$. Leibniz si applica.`,
        },
        {
          id: 's13.alterni.L1.c10', type: 'mcq', level: 2,
          prompt: String.raw`Per quale di queste serie **non** si può applicare il criterio di Leibniz?`,
          options: [
            String.raw`$\displaystyle\sum_{n\ge1}(-1)^n\frac1n$`,
            String.raw`$\displaystyle\sum_{n\ge1}(-1)^n\frac{n}{n+1}$`,
            String.raw`$\displaystyle\sum_{n\ge1}(-1)^n\sin\frac1n$`,
          ],
          answer: 1,
          explain: String.raw`In $\frac{n}{n+1}$ il modulo tende a $1$, non a $0$: la serie non converge (condizione necessaria). Le altre due hanno moduli decrescenti e infinitesimi: $\frac1n$ e $\sin\frac1n$ decrescono verso $0$.`,
        },
        {
          id: 's13.alterni.L1.c11', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}(-1)^n\frac{n}{2^n}$ converge.`,
          answer: true,
          explain: String.raw`Il modulo $\frac n{2^n}$ tende a $0$ e non cresce mai: $\frac{a_{n+1}}{a_n}=\frac{n+1}{2n}\le1$ per $n\ge1$. Leibniz vale e la serie converge.`,
        },
      ],
    },
    {
      id: 's13.alterni.L2',
      title: 'Leibniz alla prova',
      cards: [
        {
          type: 'learn',
          title: 'Le due ipotesi, una per una',
          body: String.raw`Per applicare Leibniz a $\sum(-1)^na_n$ controlla due cose:

1. **$a_n\to0$.** Calcola il limite. Se non è $0$, la serie non converge.
2. **$a_n$ decrescente.** Confronta $a_{n+1}$ con $a_n$, oppure studia $f(x)$ con $a_n=f(n)$: se $f'(x)\le0$ da un certo punto in poi, la successione decresce da lì in avanti.

> Basta che la decrescenza valga **definitivamente**: i primi termini si possono ignorare.`,
        },
        {
          type: 'example',
          title: 'Verifica di Leibniz',
          problem: String.raw`Studia $\displaystyle\sum_{n\ge1}(-1)^{n}\frac{n}{n^2+1}$.`,
          steps: [
            String.raw`Il modulo è $a_n=\frac{n}{n^2+1}$, e $a_n\to0$: il numeratore cresce come $n$, il denominatore come $n^2$.`,
            {
              text: String.raw`Studio $f(x)=\frac{x}{x^2+1}$: si ha $f'(x)=\frac{1-x^2}{(x^2+1)^2}$.`,
              ask: {
                type: 'mcq', prompt: String.raw`Per quali $x\ge1$ vale $f'(x)\le0$?`,
                options: [
                  String.raw`Per ogni $x\ge1$: $f'(1)=0$ e $f'(x)<0$ per $x>1$`,
                  String.raw`Per nessun $x\ge1$`,
                  String.raw`Solo per $x\ge2$, non per $x\in[1,2)$`,
                ],
                answer: 0,
                explain: String.raw`Il numeratore $1-x^2$ è $\le0$ se e solo se $x\ge1$.`,
              },
            },
            String.raw`Quindi $a_n$ decresce per $n\ge1$ e Leibniz dà la convergenza.`,
          ],
          result: String.raw`La serie converge semplicemente. Il modulo però è $\sim\frac1n$: la serie dei moduli diverge, quindi non converge assolutamente.`,
        },
        {
          id: 's13.alterni.L2.c3', type: 'mcq', level: 2,
          prompt: String.raw`Leibniz si applica a $\displaystyle\sum_{n\ge1}(-1)^n\frac{\log n}{\sqrt n}$?`,
          options: [
            String.raw`Sì: $a_n$ è decrescente da un certo punto in poi e $a_n\to0$`,
            String.raw`No: $a_n$ non è decrescente per nessun $n$`,
            String.raw`No: $a_n$ non tende a $0$`,
          ],
          answer: 0,
          explain: String.raw`$f(x)=\frac{\log x}{\sqrt x}$ ha $f'(x)=\frac{2-\log x}{2x^{3/2}}$, negativa per $x>e^2\approx7{,}39$: quindi $a_{n+1}\le a_n$ da $n=8$ in poi. Il limite è $0$. I primi termini crescono, ma non importa.`,
        },
        {
          id: 's13.alterni.L2.c4', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: per applicare Leibniz serve che $a_n$ sia decrescente per ogni $n\ge1$.`,
          answer: false,
          explain: String.raw`Falso: basta la decrescenza definitiva. Per $\frac{\log n}{\sqrt n}$ la successione cresce fino a $n=7$ e decresce dopo.`,
        },
        {
          type: 'learn',
          title: 'Un errore frequente',
          body: String.raw`>! **Errore tipico:** "la successione $a_n$ non è decrescente, quindi la serie diverge". No. Il criterio di Leibniz è solo **sufficiente**: se non si applica, la serie può convergere lo stesso.

Esempio: $\displaystyle\sum_{n\ge1}(-1)^n\frac{2+(-1)^n}{n^2}=\sum_{n\ge1}\frac{1+2(-1)^n}{n^2}$. Il modulo alterna $\frac3{n^2}$ e $\frac1{n^2}$, quindi non è decrescente. Però $\left|\frac{2+(-1)^n}{n^2}\right|\le\frac3{n^2}$ e la serie converge (anche assolutamente).`,
        },
        {
          type: 'learn',
          title: 'Quanto sbaglio fermandomi prima',
          body: String.raw`Per una serie di Leibniz vale una stima dell'errore: se $S$ è la somma e $s_N$ la somma parziale di ordine $N$,

$$|S-s_N|\le a_{N+1}.$$

L'errore è più piccolo del primo termine trascurato. Per esempio $\sum\frac{(-1)^{n+1}}{n^2}$ ha $s_3=\frac{31}{36}\approx0{,}861$ e $a_4=\frac1{16}$: la somma $S\approx0{,}822$ differisce da $s_3$ per meno di $\frac1{16}$.`,
        },
        {
          id: 's13.alterni.L2.c7', type: 'num', level: 2,
          prompt: String.raw`Per $\displaystyle S=\sum_{n\ge1}\frac{(-1)^{n+1}}{n^2}$, quanto vale la somma parziale $s_3$? Scrivi la frazione.`,
          answer: '31/36',
          explain: String.raw`$s_3=1-\frac14+\frac19=\frac{36-9+4}{36}=\frac{31}{36}$. Per la stima dell'errore, $|S-s_3|\le a_4=\frac1{16}$.`,
        },
        {
          id: 's13.alterni.L2.c8', type: 'match', level: 2,
          prompt: String.raw`Abbina ogni serie alla sua conclusione tipica con Leibniz e con i moduli.`,
          pairs: [
            [String.raw`$\displaystyle\sum\frac{(-1)^n}{n^2}$`, 'converge assolutamente'],
            [String.raw`$\displaystyle\sum\frac{(-1)^n}{n}$`, 'converge solo semplicemente'],
            [String.raw`$\displaystyle\sum(-1)^n\,n$`, 'diverge'],
          ],
          explain: String.raw`Il modulo $\frac1{n^2}$ è sommabile: convergenza assoluta. Il modulo $\frac1n$ non è sommabile, ma Leibniz vale: convergenza semplice. In $(-1)^n n$ il termine non tende a $0$.`,
        },
        {
          id: 's13.alterni.L2.c9', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}(-1)^n\frac1{\sqrt n}$ converge semplicemente.`,
          answer: true,
          explain: String.raw`Vero: $\frac1{\sqrt n}$ è decrescente e tende a $0$. Leibniz vale. Il modulo $\frac1{\sqrt n}$ invece dà una serie divergente, quindi non c'è convergenza assoluta.`,
        },
        {
          id: 's13.alterni.L2.c10', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}(-1)^n\frac{n}{n+1}$ converge.`,
          answer: false,
          explain: String.raw`Falso: $\frac{n}{n+1}\to1\neq0$. Il termine generale non tende a $0$, quindi la serie non converge.`,
        },
        {
          id: 's13.alterni.L2.c11', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n\ge2}\frac{(-1)^n}{\log n}$?`,
          options: [
            String.raw`Converge, per Leibniz`,
            String.raw`Diverge`,
            String.raw`Non si può decidere con Leibniz`,
          ],
          answer: 0,
          explain: String.raw`Per $n\ge2$, $\frac1{\log n}$ è positivo, decrescente e tende a $0$: Leibniz vale. (Il modulo $\frac1{\log n}\ge\frac1n$ dà serie divergente: la convergenza è solo semplice.)`,
        },
      ],
    },
    {
      id: 's13.alterni.L3',
      title: 'Convergenza semplice e assoluta',
      cards: [
        {
          type: 'learn',
          title: 'Guardare i moduli',
          body: String.raw`Data una serie $\sum a_n$ a segni qualunque, consideri la serie dei **moduli** $\sum|a_n|$, che ha termini $\ge0$.

>* **Definizioni.** $\sum a_n$ converge **assolutamente** se $\sum|a_n|$ converge. Converge **semplicemente** se $\sum a_n$ converge ma $\sum|a_n|$ no.

Per la serie dei moduli valgono i criteri per termini positivi della lezione precedente: confronto, confronto asintotico, rapporto, radice, integrale.`,
        },
        {
          type: 'learn',
          title: 'Assoluta implica semplice',
          body: String.raw`>* **Teorema.** Se $\sum|a_n|$ converge, allora $\sum a_n$ converge.

Il viceversa è falso: la serie $\sum\frac{(-1)^{n+1}}{n}$ converge ma i moduli danno la serie armonica, che diverge. Quindi converge solo semplicemente.`,
        },
        {
          type: 'example',
          title: 'Assoluta o semplice?',
          problem: String.raw`Studia $\displaystyle\sum_{n\ge1}(-1)^n\frac{1}{n^2}$.`,
          steps: [
            String.raw`La serie dei moduli è $\displaystyle\sum_{n\ge1}\frac1{n^2}$.`,
            {
              text: String.raw`È una armonica generalizzata con esponente $2$.`,
              ask: {
                type: 'mcq', prompt: String.raw`La serie $\displaystyle\sum_{n\ge1}\frac1{n^2}$ converge?`,
                options: ['Sì', 'No'], answer: 0,
                explain: String.raw`Esponente $2>1$: converge.`,
              },
            },
            String.raw`Quindi la serie di partenza converge **assolutamente**, e perciò anche semplicemente.`,
          ],
          result: String.raw`$\sum(-1)^n\frac1{n^2}$ converge assolutamente.`,
        },
        {
          type: 'example',
          title: 'Solo semplicemente',
          problem: String.raw`Studia $\displaystyle\sum_{n\ge1}(-1)^n\frac{\log n}{\sqrt n}$ (convergenza semplice e assoluta).`,
          steps: [
            String.raw`Il modulo è $|a_n|=\frac{\log n}{\sqrt n}$.`,
            {
              text: String.raw`Per $n\ge3$ vale $\log n\ge1$ (perché $e\approx2{,}72<3$), quindi $|a_n|\ge\frac1{\sqrt n}$.`,
              ask: {
                type: 'num', prompt: String.raw`Qual è il più piccolo intero $n$ con $\log n\ge1$?`,
                answer: '3',
                explain: String.raw`$\log2\approx0{,}69<1$ e $\log3\approx1{,}10\ge1$: il primo intero è $n=3$.`,
              },
            },
            String.raw`$\sum\frac1{\sqrt n}$ diverge (esponente $\frac12\le1$): per confronto $\sum|a_n|$ diverge.`,
            String.raw`Però Leibniz vale: $a_n$ è decrescente da $n=8$ in poi e tende a $0$. Quindi la serie converge semplicemente.`,
          ],
          result: String.raw`La serie converge **semplicemente** ma **non** assolutamente.`,
        },
        {
          id: 's13.alterni.L3.c5', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n\ge1}(-1)^n\frac1{n+1}$?`,
          options: [
            'Converge assolutamente',
            'Converge solo semplicemente',
            'Diverge',
          ],
          answer: 1,
          explain: String.raw`Il modulo $\frac1{n+1}\ge\frac1{2n}$ dà serie divergente. Leibniz vale: convergenza solo semplice.`,
        },
        {
          id: 's13.alterni.L3.c6', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: se $\sum|a_n|$ diverge, allora $\sum a_n$ diverge.`,
          answer: false,
          explain: String.raw`Falso: per $\sum\frac{(-1)^{n+1}}{n}$ i moduli divergono, ma la serie converge (Leibniz). Divergenza dei moduli non implica divergenza della serie.`,
        },
        {
          id: 's13.alterni.L3.c7', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\frac{\sin n}{n^2}$ converge.`,
          answer: true,
          explain: String.raw`Vero: $\left|\frac{\sin n}{n^2}\right|\le\frac1{n^2}$, e $\sum\frac1{n^2}$ converge. Quindi la serie converge assolutamente, e perciò semplicemente. La serie è a segni qualunque: non serve Leibniz.`,
        },
        {
          id: 's13.alterni.L3.c8', type: 'match', level: 2,
          prompt: String.raw`Abbina ogni serie alla sua conclusione.`,
          pairs: [
            [String.raw`$\displaystyle\sum\frac{(-1)^n}{n^{3/2}}$`, 'converge assolutamente'],
            [String.raw`$\displaystyle\sum\frac{(-1)^n}{\sqrt n}$`, 'converge solo semplicemente'],
            [String.raw`$\displaystyle\sum(-1)^n\sqrt n$`, 'diverge'],
          ],
          explain: String.raw`$n^{-3/2}$ ha modulo sommabile. $n^{-1/2}$ è decrescente e infinitesima ma il modulo non è sommabile. $\sqrt n$ non tende a $0$.`,
        },
        {
          id: 's13.alterni.L3.c9', type: 'order', level: 3,
          prompt: String.raw`Riordina la dimostrazione: "se $\sum|a_n|$ converge, allora $\sum a_n$ converge".`,
          steps: [
            String.raw`Poni $b_n=a_n+|a_n|$: si ha $b_n\ge0$ per ogni $n$.`,
            String.raw`Poiché $-|a_n|\le a_n\le|a_n|$, si ha $0\le b_n\le2|a_n|$.`,
            String.raw`Per confronto, $\sum b_n$ converge, perché $\sum 2|a_n|$ converge.`,
            String.raw`Ma $a_n=b_n-|a_n|$: $\sum a_n$ è differenza di due serie convergenti, quindi converge.`,
          ],
          distractors: [
            String.raw`Poiché $a_n\le|a_n|$, per confronto $\sum a_n$ converge.`,
            String.raw`Poiché $a_n\to0$, ogni somma parziale converge, quindi $\sum a_n$ converge.`,
          ],
          explain: String.raw`Il trucco è passare a termini non negativi $b_n$. Il primo distrattore applica il confronto senza avere $a_n\ge0$. Il secondo confonde $a_n\to0$ con la convergenza.`,
        },
        {
          id: 's13.alterni.L3.c10', type: 'open', level: 3, points: 3,
          prompt: String.raw`Enuncia e dimostra: la convergenza assoluta implica la convergenza semplice.`,
          answer: String.raw`**Enunciato.** Se $\sum|a_n|$ converge, allora $\sum a_n$ converge.

**Dimostrazione.** Poni $b_n=a_n+|a_n|\ge0$. Da $-|a_n|\le a_n\le|a_n|$ segue $0\le b_n\le 2|a_n|$. Poiché $\sum2|a_n|$ converge, per il criterio del confronto converge $\sum b_n$. Infine $a_n=b_n-|a_n|$, quindi $\sum a_n=\sum b_n-\sum|a_n|$ converge come differenza di due serie convergenti.`,
          rubric: [
            String.raw`Definisce $b_n=a_n+|a_n|\ge0$ e dimostra $b_n\le2|a_n|$`,
            String.raw`Applica il criterio del confronto alla serie dei $b_n$`,
            String.raw`Scrive $a_n=b_n-|a_n|$ e conclude per differenza di serie convergenti`,
            String.raw`Enuncia correttamente ipotesi (convergenza dei moduli) e tesi`,
          ],
        },
        {
          id: 's13.alterni.L3.c11', type: 'mcq', level: 2,
          prompt: String.raw`Carattere di $\displaystyle\sum_{n\ge1}(-1)^n\frac{n+1}{n^3+2}$?`,
          options: [
            'Converge assolutamente',
            'Converge solo semplicemente',
            'Diverge',
          ],
          answer: 0,
          explain: String.raw`Il modulo $\frac{n+1}{n^3+2}\sim\frac1{n^2}$, sommabile (confronto asintotico). Quindi la convergenza è assoluta.`,
        },
      ],
    },
    {
      id: 's13.alterni.L4',
      title: 'Livello d\'esame',
      cards: [
        {
          type: 'learn',
          title: 'Ordine delle mosse',
          body: String.raw`All'esame ti servono quattro mosse, in quest'ordine:

1. **Limite del termine.** Se $a_n\not\to0$, la serie diverge: finito.
2. **Moduli.** Studia $\sum|a_n|$ con confronto o confronto asintotico. Se converge, la serie converge assolutamente: finito.
3. **Leibniz.** Se i moduli non sommano, verifica se $|a_n|$ è decrescente e infinitesimo.
4. **Altra via.** Se Leibniz non si applica, scomponi la serie in somme di serie note.`,
        },
        {
          type: 'example',
          title: 'Una serie che sembra alternata',
          problem: String.raw`Studia $\displaystyle\sum_{n\ge1}\frac{(-1)^n\,(2+(-1)^n)}{n}$.`,
          steps: [
            String.raw`Sviluppo il numeratore: $(-1)^n(2+(-1)^n)=2(-1)^n+(-1)^{2n}=2(-1)^n+1$.`,
            {
              text: String.raw`Quindi $a_n=\frac1n+\frac{2(-1)^n}{n}$: la serie è somma di due serie.`,
              ask: {
                type: 'mcq', prompt: String.raw`La serie $\displaystyle\sum_{n\ge1}\frac1n$ converge?`,
                options: ['Sì', 'No'], answer: 1,
                explain: String.raw`È l'armonica: diverge.`,
              },
            },
            String.raw`$\sum\frac{2(-1)^n}{n}$ converge per Leibniz. Somma di una serie divergente e di una convergente: diverge.`,
          ],
          result: String.raw`La serie diverge (a $+\infty$). Il termine $a_n$ non è monotono, quindi Leibniz non c'entra: bisogna scomporre.`,
        },
        {
          id: 's13.alterni.L4.c3', type: 'problem', level: 3, source: 'Appello 06/07/2026 · Parte B', points: 4,
          prompt: String.raw`Studia $\displaystyle\sum_{n\ge1}(-1)^n\frac{\log(n^2+2)}{n^3}$ (carattere della serie).`,
          parts: [
            {
              type: 'tf', prompt: String.raw`La serie dei moduli $\sum|a_n|$ converge.`,
              answer: true,
              explain: String.raw`$\frac{\log(n^2+2)}{n^3}\cdot n^2=\frac{\log(n^2+2)}{n}\to0$: quindi $|a_n|\le\frac1{n^2}$ definitivamente, e $\sum\frac1{n^2}$ converge.`,
            },
            {
              type: 'mcq', prompt: 'Carattere della serie',
              options: ['Converge assolutamente', 'Converge solo semplicemente', 'Diverge'],
              answer: 0,
              explain: String.raw`Se la serie dei moduli converge, la serie converge assolutamente. Leibniz non serve.`,
            },
          ],
          solution: String.raw`$|a_n|=\frac{\log(n^2+2)}{n^3}$ e $\frac{\log(n^2+2)}{n^3}\cdot n^2=\frac{\log(n^2+2)}{n}\to0$. Per confronto asintotico con $\sum\frac1{n^2}$ la serie dei moduli converge: la serie converge assolutamente.`,
        },
        {
          id: 's13.alterni.L4.c4', type: 'problem', level: 3, source: 'Appello 10/02/2026 · Parte B', points: 4,
          prompt: String.raw`Studia $\displaystyle\sum_{n\ge1}(-1)^n\frac{\log n}{\sqrt n}$: converge semplicemente? assolutamente?`,
          parts: [
            {
              type: 'tf', prompt: String.raw`Definitivamente $a_n=\frac{\log n}{\sqrt n}$ è decrescente e $a_n\to0$.`,
              answer: true,
              explain: String.raw`Con $f(x)=\frac{\log x}{\sqrt x}$: $f'(x)=\frac{2-\log x}{2x^{3/2}}\le0$ per $x\ge e^2\approx7{,}39$.`,
            },
            {
              type: 'tf', prompt: String.raw`La serie converge semplicemente.`,
              answer: true,
              explain: String.raw`Conseguenza di Leibniz, con le ipotesi verificate da $n=8$ in poi.`,
            },
            {
              type: 'tf', prompt: String.raw`La serie converge assolutamente.`,
              answer: false,
              explain: String.raw`Per $n\ge3$, $|a_n|\ge\frac1{\sqrt n}$ e $\sum\frac1{\sqrt n}$ diverge: per confronto $\sum|a_n|$ diverge.`,
            },
          ],
          solution: String.raw`Leibniz (ipotesi verificate definitivamente) dà la convergenza semplice. Il modulo $\frac{\log n}{\sqrt n}\ge\frac1{\sqrt n}$ da $n=3$ in poi non è sommabile: la convergenza non è assoluta.`,
        },
        {
          id: 's13.alterni.L4.c5', type: 'problem', level: 3, source: 'Itinere 15/01/2026 · Parte B', points: 4,
          prompt: String.raw`Si consideri $\displaystyle\sum_{n\ge1}\frac{(-1)^n}{\left(\sqrt n\,\log(1+n)\right)^{\gamma}}$, con $\gamma\in\R$.`,
          parts: [
            {
              type: 'interval', prompt: String.raw`Per quali $\gamma$ la serie converge semplicemente?`,
              answer: '(0,inf)',
              explain: String.raw`Per $\gamma\le0$ il termine non tende a $0$ (per $\gamma=0$ vale $\pm1$, per $\gamma<0$ diverge). Per $\gamma>0$ il denominatore cresce, quindi $|a_n|\to0$ in modo decrescente: vale Leibniz.`,
            },
            {
              type: 'interval', prompt: String.raw`Per quali $\gamma$ la serie converge assolutamente?`,
              answer: '[2,inf)',
              explain: String.raw`Il modulo è $\sim\frac1{n^{\gamma/2}(\log n)^\gamma}$. Per $\gamma>2$ l'esponente $\frac\gamma2>1$ dà convergenza. Per $\gamma=2$ si confronta con $\sum\frac1{n\log^2n}$, convergente. Per $\gamma<2$ con $\gamma>0$ diverge, e per $\gamma\le0$ il termine non tende a $0$.`,
            },
          ],
          solution: String.raw`Semplice per $\gamma>0$ (Leibniz); assoluta per $\gamma\ge2$. Nella fascia $0<\gamma<2$ la serie converge solo semplicemente.`,
        },
        {
          id: 's13.alterni.L4.c6', type: 'problem', level: 3, source: 'Itinere 15/01/2026 · Parte B', points: 4,
          prompt: String.raw`Si consideri $\displaystyle\sum_{n\ge1}(-1)^n\frac{n^{\alpha}}{n+1}$, con $\alpha\in\R$.`,
          parts: [
            {
              type: 'interval', prompt: String.raw`Per quali $\alpha$ la serie converge semplicemente?`,
              answer: '(-inf,1)',
              explain: String.raw`$a_n\sim n^{\alpha-1}$: per $\alpha\ge1$ il termine non tende a $0$. Per $\alpha<1$ il modulo tende a $0$ ed è decrescente da un certo punto in poi: vale Leibniz.`,
            },
            {
              type: 'interval', prompt: String.raw`Per quali $\alpha$ la serie converge assolutamente?`,
              answer: '(-inf,0)',
              explain: String.raw`Il modulo è $\sim n^{\alpha-1}$, sommabile sse $\alpha-1<-1$, cioè $\alpha<0$.`,
            },
          ],
          solution: String.raw`Il termine generale è $\sim(-1)^n n^{\alpha-1}$. Semplice per $\alpha<1$, assoluta per $\alpha<0$.`,
        },
        {
          id: 's13.alterni.L4.c7', type: 'open', level: 3, source: 'Itinere 15/01/2026 · Parte A', points: 3,
          prompt: String.raw`Enuncia il criterio di Leibniz e spiega perché le somme parziali di indice pari e dispari convergono allo stesso limite.`,
          answer: String.raw`**Enunciato.** Se $a_n\ge0$ è decrescente e $a_n\to0$, allora $\sum(-1)^{n+1}a_n$ converge.

**Spiegazione.** Le somme pari $s_{2k}$ sono crescenti, perché $s_{2k+2}-s_{2k}=a_{2k+1}-a_{2k+2}\ge0$. Le somme dispari $s_{2k+1}$ sono decrescenti, perché $s_{2k+3}-s_{2k+1}=-(a_{2k+2}-a_{2k+3})\le0$. Ogni somma pari è $\le$ ogni somma dispari. Quindi la successione pari converge a un limite $S$. Le somme dispari convergono a un limite $S'$, e $s_{2k+1}-s_{2k}=a_{2k+1}\to0$ implica $S=S'$. Dunque anche la successione delle somme parziali converge a $S$.`,
          rubric: [
            String.raw`Enuncia le ipotesi (decrescenza, infinitesimo) e la tesi`,
            String.raw`Mostra la monotonia delle somme pari e dispari`,
            String.raw`Mostra che la differenza $s_{2k+1}-s_{2k}=a_{2k+1}$ tende a $0$`,
            String.raw`Conclude che i due limiti coincidono`,
          ],
        },
        {
          id: 's13.alterni.L4.c8', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: se $\sum(-1)^nb_n$ con $b_n\ge0$ converge, allora converge anche assolutamente.`,
          answer: false,
          explain: String.raw`Falso. Controesempio: $b_n=\frac1n$, la serie $\sum\frac{(-1)^n}{n}$ converge ma non assolutamente. Assoluta implica semplice, non il viceversa.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's13.alterni.p1', type: 'tf', level: 1,
      prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\frac{(-1)^n}{n^2}$ converge assolutamente.`,
      answer: true,
      explain: String.raw`Il modulo è $\frac1{n^2}$, sommabile (armonica generalizzata con esponente $2>1$).`,
    },
    {
      id: 's13.alterni.p2', type: 'mcq', level: 1,
      prompt: String.raw`Carattere di $\displaystyle\sum_{n\ge1}(-1)^n\,n$?`,
      options: ['Converge assolutamente', 'Converge solo semplicemente', 'Diverge'],
      answer: 2,
      explain: String.raw`Il termine $(-1)^n n$ non tende a $0$ (il modulo cresce): la serie diverge.`,
    },
    {
      id: 's13.alterni.p3', type: 'num', level: 1,
      prompt: String.raw`Per $\displaystyle\sum_{n\ge1}\frac{(-1)^{n+1}}{n}$, quanto vale $s_2$? Scrivi la frazione.`,
      answer: '1/2',
      explain: String.raw`$s_2=1-\frac12=\frac12$.`,
    },
    {
      id: 's13.alterni.p4', type: 'tf', level: 2,
      prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge2}\frac{(-1)^n}{n\log n}$ converge assolutamente.`,
      answer: false,
      explain: String.raw`Il modulo $\frac1{n\log n}$ dà una serie divergente: per il criterio integrale, $\int\frac{dx}{x\log x}=\log\log x\to+\infty$. La serie converge solo semplicemente, per Leibniz.`,
    },
    {
      id: 's13.alterni.p5', type: 'mcq', level: 2,
      prompt: String.raw`Carattere di $\displaystyle\sum_{n\ge1}(-1)^n\frac{n^2}{n^3+1}$?`,
      options: ['Converge assolutamente', 'Converge solo semplicemente', 'Diverge'],
      answer: 1,
      explain: String.raw`Il modulo $\frac{n^2}{n^3+1}\sim\frac1n$ non è sommabile. La successione $f(x)=\frac{x^2}{x^3+1}$ ha $f'(x)=\frac{x(2-x^3)}{(x^3+1)^2}<0$ per $x>2^{1/3}$: è decrescente da $n=2$ e tende a $0$. Leibniz: convergenza solo semplice.`,
    },
    {
      id: 's13.alterni.p6', type: 'cloze', level: 2,
      text: String.raw`Per $\sum(-1)^na_n$ con $a_n\ge0$ decrescente e infinitesima vale il criterio di [[0]]. Se $\sum|a_n|$ converge, la serie è [[1]] convergente.`,
      blanks: [
        { options: ['Leibniz', 'Cauchy-Hadamard', 'Taylor'], answer: 0 },
        { options: ['assolutamente', 'semplicemente', 'puntualmente'], answer: 0 },
      ],
      explain: String.raw`Leibniz è il criterio per le serie alterne. Se converge la serie dei moduli, la serie converge assolutamente (e quindi semplicemente).`,
    },
    {
      id: 's13.alterni.p7', type: 'interval', level: 2,
      prompt: String.raw`Per quali $\alpha\in\R$ converge semplicemente $\displaystyle\sum_{n\ge1}\frac{(-1)^n}{n^{\alpha}}$?`,
      answer: '(0,inf)',
      explain: String.raw`Per $\alpha\le0$ il termine non tende a $0$. Per $\alpha>0$ il modulo $\frac1{n^\alpha}$ è decrescente e tende a $0$: vale Leibniz.`,
    },
    {
      id: 's13.alterni.p8', type: 'tf', level: 2,
      prompt: String.raw`Vero o falso: se $\sum a_n$ converge assolutamente, allora $\sum a_n^2$ converge.`,
      answer: true,
      explain: String.raw`Se $\sum|a_n|$ converge, $a_n\to0$: definitivamente $|a_n|\le1$, quindi $a_n^2\le|a_n|$. Per confronto $\sum a_n^2$ converge.`,
    },
    {
      id: 's13.alterni.p9', type: 'open', level: 2, points: 2,
      prompt: String.raw`Definisci la convergenza assoluta e la convergenza semplice di $\sum a_n$.`,
      answer: String.raw`La serie $\sum a_n$ **converge assolutamente** se converge la serie dei moduli $\sum|a_n|$. Converge **semplicemente** se $\sum a_n$ converge ma $\sum|a_n|$ non converge.`,
      rubric: [
        String.raw`Definisce la convergenza assoluta con la serie dei moduli`,
        String.raw`Definisce la convergenza semplice come convergenza di $\sum a_n$ senza quella assoluta`,
      ],
    },
    {
      id: 's13.alterni.p10', type: 'tf', level: 2,
      prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\frac{(-1)^{n+1}}{n}=\log 2$.`,
      answer: true,
      explain: String.raw`Vero: è la serie di Taylor di $\log(1+x)$ calcolata in $x=1$. La somma si ottiene in s14, ma il carattere lo decidi già con Leibniz.`,
    },
    {
      id: 's13.alterni.gen-leibniz', type: 'gen', level: 2,
      gen: (R) => {
        // a_n = n^(-k/2): k=0 costante, k=1,2 convergenza solo semplice, k>=3 assoluta
        const k = R.int(0, 5);
        const shape = k === 1 ? String.raw`\sqrt n` : k === 2 ? 'n' : k % 2 === 0 ? `n^{${k / 2}}` : String.raw`\sqrt{n^{${k}}}`;
        const term = k === 0 ? String.raw`(-1)^n` : String.raw`\frac{(-1)^n}{${shape}}`;
        const ans = k === 0 ? 2 : k <= 2 ? 1 : 0;
        const explain = k === 0
          ? String.raw`Il termine vale $\pm1$ e non tende a $0$: la serie diverge, perché manca la condizione necessaria.`
          : k <= 2
            ? String.raw`Il modulo $\frac1{${shape}}$ è decrescente e tende a $0$: Leibniz dà la convergenza. Ma il modulo ha esponente $\frac{${k}}2\le1$, quindi non è sommabile: convergenza solo semplice.`
            : String.raw`Il modulo ha esponente $\frac{${k}}2>1$: la serie dei moduli converge, quindi la serie converge assolutamente.`;
        return {
          type: 'mcq',
          prompt: String.raw`Carattere della serie $\displaystyle\sum_{n\ge1}${term}$?`,
          options: ['Converge assolutamente', 'Converge solo semplicemente', 'Diverge'],
          noShuffle: true,
          answer: ans,
          explain,
        };
      },
    },
    {
      id: 's13.alterni.gen-denominatore', type: 'gen', level: 2,
      gen: (R) => {
        // denominatore sqrt(n^e) + c: e=0 costante (diverge), e<=2 solo semplice, e>=3 assoluta
        const e = R.int(0, 5);
        const c = R.int(1, 4);
        const pow = e === 1 ? String.raw`\sqrt n` : e === 2 ? 'n' : e % 2 === 0 ? `n^{${e / 2}}` : String.raw`\sqrt{n^{${e}}}`;
        const den = e === 0 ? String(1 + c) : `${pow}+${c}`;
        const ans = e === 0 ? 2 : e <= 2 ? 1 : 0;
        const explain = e === 0
          ? String.raw`Il termine tende a $\pm\frac1{${1 + c}}\neq0$: la serie diverge.`
          : e <= 2
            ? String.raw`Il modulo $\frac1{${den}}$ è decrescente e tende a $0$: Leibniz dà la convergenza. Il modulo si comporta come $\frac1{n^{${H.frac(e, 2)}}}$ con esponente $\le1$: non è sommabile, quindi solo semplicemente.`
            : String.raw`Il modulo si comporta come $\frac1{n^{${H.frac(e, 2)}}}$ con esponente $>1$: converge, quindi la serie converge assolutamente.`;
        return {
          type: 'mcq',
          prompt: String.raw`Carattere della serie $\displaystyle\sum_{n\ge1}\frac{(-1)^n}{${den}}$?`,
          options: ['Converge assolutamente', 'Converge solo semplicemente', 'Diverge'],
          noShuffle: true,
          answer: ans,
          explain,
        };
      },
    },
    {
      id: 's13.alterni.gen-alpha', type: 'gen', level: 3,
      gen: (R) => {
        // a_n = (-1)^n / n^(p*alpha): semplice sse alpha>0, assoluta sse p*alpha>1
        const p = R.pick([1, 2, 3]);
        const pa = p === 1 ? String.raw`\alpha` : String.raw`${p}\alpha`;
        const term = String.raw`\frac{(-1)^n}{n^{${pa}}}`;
        return {
          type: 'problem',
          prompt: String.raw`Si consideri $\displaystyle\sum_{n\ge1}${term}$, con $\alpha\in\R$.`,
          parts: [
            {
              type: 'interval', prompt: String.raw`Per quali $\alpha$ la serie converge semplicemente?`,
              answer: '(0,inf)',
              explain: String.raw`Per $\alpha\le0$ il termine non tende a $0$. Per $\alpha>0$ il modulo $n^{-${pa}}$ è decrescente e tende a $0$: vale Leibniz.`,
            },
            {
              type: 'interval', prompt: String.raw`Per quali $\alpha$ la serie converge assolutamente?`,
              answer: `(${qstr([1, p])},inf)`,
              explain: String.raw`Il modulo è $n^{-${pa}}$: è sommabile sse $${p}\alpha>1$, cioè $\alpha>${qtex([1, p])}$.`,
            },
          ],
          solution: String.raw`Il termine è $\frac{(-1)^n}{n^{${pa}}}$. Convergenza semplice per $\alpha>0$ (Leibniz); convergenza assoluta per $\alpha>${qtex([1, p])}$.`,
        };
      },
    },
  ],
  flashcards: [
    { id: 's13.alterni.fc1', kind: 'def', front: 'Serie a segni alterni', back: String.raw`$\sum(-1)^na_n$ con $a_n\ge0$: i termini cambiano segno a ogni passo. $a_n$ è il **modulo** del termine.` },
    { id: 's13.alterni.fc2', kind: 'thm', front: 'Criterio di Leibniz', back: String.raw`Se $a_n\ge0$ è decrescente (anche solo definitivamente) e $a_n\to0$, allora $\sum(-1)^na_n$ converge.` },
    { id: 's13.alterni.fc3', kind: 'dim', front: 'Idea della dimostrazione di Leibniz', back: String.raw`Le somme pari $s_{2k}$ crescono, le dispari $s_{2k+1}$ decrescono e ogni pari è $\le$ ogni dispari. Quindi convergono; la differenza $s_{2k+1}-s_{2k}=a_{2k+1}\to0$ dà lo stesso limite.` },
    { id: 's13.alterni.fc4', kind: 'def', front: 'Convergenza assoluta e semplice', back: String.raw`Assoluta: $\sum|a_n|$ converge. Semplice: $\sum a_n$ converge ma $\sum|a_n|$ no.` },
    { id: 's13.alterni.fc5', kind: 'thm', front: 'Assoluta implica semplice', back: String.raw`Se $\sum|a_n|$ converge, allora $\sum a_n$ converge. Il viceversa è falso: $\sum\frac{(-1)^{n+1}}{n}$ converge ma non assolutamente.` },
    { id: 's13.alterni.fc6', kind: 'dim', front: 'Dimostrazione: assoluta implica semplice', back: String.raw`Poni $b_n=a_n+|a_n|$: si ha $0\le b_n\le2|a_n|$, quindi $\sum b_n$ converge per confronto. Poi $a_n=b_n-|a_n|$ è differenza di due serie convergenti.` },
    { id: 's13.alterni.fc7', kind: 'formula', front: String.raw`Stima dell'errore di Leibniz`, back: String.raw`$|S-s_N|\le a_{N+1}$: l'errore commesso fermandosi alla somma parziale $s_N$ è minore del primo termine trascurato.` },
    { id: 's13.alterni.fc8', kind: 'errore', front: String.raw`$a_n\to0$ non basta`, back: String.raw`È solo condizione necessaria. Esempio: $a_n=\frac1n$ per $n$ dispari e $a_n=\frac1{n^2}$ per $n$ pari dà $\sum(-1)^na_n$ divergente.` },
    { id: 's13.alterni.fc9', kind: 'errore', front: 'Moduli divergenti non implicano serie divergente', back: String.raw`Con $\sum\frac{(-1)^{n+1}}{n}$ i moduli divergono, ma la serie converge per Leibniz: il solo fatto che $\sum|a_n|$ diverga non dice nulla su $\sum a_n$.` },
    { id: 's13.alterni.fc10', kind: 'metodo', front: String.raw`Come classificare $\sum a_n$ a segni alterni`, back: String.raw`1) Limite del termine. 2) Moduli con i criteri per termini positivi. 3) Se i moduli non convergono, Leibniz (decrescenza definitiva e infinitesimo). 4) Altrimenti scomporre la serie.` },
  ],
};

// =====================================================================
// s13.parametri — serie con parametri: stime asintotiche, esponenti, Taylor
// =====================================================================
const PAR = {
  id: 's13.parametri',
  title: 'Serie con parametri',
  summary: String.raw`Trovi per quali valori del parametro $\alpha$ una serie converge, usando equivalenze asintotiche e sviluppi di Taylor.`,
  prereq: ['s13.positivi', 's13.alterni', 's06.ordine', 's10.sviluppi'],
  examRefs: ['Appello 10/02/2026 · Parte B', 'Appello 11/06/2026 · Parte B', 'Appello 03/09/2026 · Parte B'],
  lessons: [
    {
      id: 's13.parametri.L1',
      title: 'Il parametro e la velocità',
      cards: [
        {
          type: 'learn',
          title: 'Un parametro, un esponente',
          body: String.raw`Con un parametro $\alpha$ il termine generale cambia con $\alpha$. Il trucco è trovare un termine **equivalente**

$$a_n\sim\frac{c}{n^{\beta(\alpha)}},\qquad c\neq0,$$

e poi leggere soltanto l'esponente $\beta(\alpha)$.

>* **Regola.** Se $a_n\ge0$ definitivamente e $a_n\sim\frac{c}{n^{\beta}}$ con $c>0$, la serie $\sum a_n$ ha lo stesso carattere di $\sum\frac1{n^\beta}$: converge sse $\beta>1$.`,
        },
        {
          type: 'learn',
          title: 'Le stime da ricordare',
          body: String.raw`Le stime seguenti valgono per $x\to0$. Si usano quando l'argomento è un infinitesimo, per esempio $x=\frac1{n^\alpha}$ con $\alpha>0$:

- $\sin x\sim x$, $\tan x\sim x$, $\log(1+x)\sim x$, $e^x-1\sim x$
- $1-\cos x\sim\frac{x^2}{2}$
- $(1+x)^a-1\sim a\,x$

Per esempio $\log\left(1+\frac1{n^2}\right)\sim\frac1{n^2}$: l'esponente si legge direttamente dall'argomento.`,
        },
        {
          id: 's13.parametri.L1.c3', type: 'example', title: 'Il seno di una potenza',
          problem: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}\sin\frac1{n^{\alpha}}$?`,
          steps: [
            String.raw`Se $\alpha\le0$ il termine non tende a $0$: per $\alpha=0$ vale $\sin1\neq0$, per $\alpha<0$ l'argomento $n^{|\alpha|}$ cresce e il seno non tende a $0$. Quindi la serie diverge.`,
            {
              text: String.raw`Per $\alpha>0$ l'argomento $x=\frac1{n^\alpha}$ tende a $0$ e $\sin x\sim x$: quindi $a_n\sim\frac1{n^{\alpha}}$.`,
              ask: {
                type: 'mcq', prompt: String.raw`Quale stima è giusta per $\sin x$ quando $x\to0$?`,
                options: [String.raw`$\sin x\sim x$`, String.raw`$\sin x\sim x^2$`, String.raw`$\sin x\sim1$`],
                answer: 0,
                explain: String.raw`Lo sviluppo è $\sin x=x-\frac{x^3}6+o(x^3)$: il primo termine è $x$.`,
              },
            },
            String.raw`Per il criterio dell'armonica generalizzata la serie converge sse $\alpha>1$.`,
          ],
          result: String.raw`Converge sse $\alpha>1$: l'intervallo è $(1,+\infty)$.`,
        },
        {
          id: 's13.parametri.L1.c4', type: 'example', title: 'Coseno vicino a uno',
          problem: String.raw`Per quali $\alpha>0$ converge $\displaystyle\sum_{n\ge1}\left(1-\cos\frac1{n^{\alpha}}\right)$?`,
          steps: [
            String.raw`L'argomento $x=\frac1{n^\alpha}$ tende a $0$ per $\alpha>0$: la differenza $1-\cos x$ è piccola.`,
            {
              text: String.raw`Usando la stima $1-\cos x\sim\frac{x^2}{2}$, si ha $1-\cos\frac1{n^\alpha}\sim\frac1{2n^{2\alpha}}$.`,
              ask: {
                type: 'expr', prompt: String.raw`Scrivi l'equivalente di $1-\cos x$ per $x\to0$ come espressione in $x$.`,
                answer: 'x^2/2', vars: ['x'],
                explain: String.raw`È la stima fondamentale del coseno: $1-\cos x\sim\frac{x^2}2$.`,
              },
            },
            String.raw`L'esponente è $2\alpha$: la serie converge sse $2\alpha>1$, cioè $\alpha>\frac12$.`,
          ],
          result: String.raw`Converge sse $\alpha>\frac12$.`,
        },
        {
          id: 's13.parametri.L1.c5', type: 'mcq', level: 1,
          prompt: String.raw`Per $\alpha>0$, quale stima vale per $a_n=\log\left(1+\frac1{n^{\alpha}}\right)$?`,
          options: [String.raw`$a_n\sim\frac1{n^{\alpha}}$`, String.raw`$a_n\sim\frac1{n^{2\alpha}}$`, String.raw`$a_n\sim\log n$`],
          answer: 0,
          explain: String.raw`Con $x=\frac1{n^\alpha}\to0$, $\log(1+x)\sim x$. L'esponente $2\alpha$ è sbagliato: il logaritmo non eleva al quadrato. $\log n$ è una stima di $\log n$ stesso, non di $a_n$.`,
        },
        {
          id: 's13.parametri.L1.c6', type: 'tf', level: 1,
          prompt: String.raw`Vero o falso: se $a_n\ge0$ e $a_n\sim\frac{3}{n^2}$, la serie $\sum a_n$ converge.`,
          answer: true,
          explain: String.raw`Vero: $\beta=2>1$, e la costante $3>0$ non cambia il carattere. Per confronto asintotico con $\sum\frac1{n^2}$, converge.`,
        },
        {
          id: 's13.parametri.L1.c7', type: 'mcq', level: 2,
          prompt: String.raw`Per $\alpha>0$, per quali $\alpha$ converge $\displaystyle\sum_{n\ge1}\left(1-\cos\frac1{n^{\alpha}}\right)$?`,
          options: [String.raw`$\alpha>\frac12$`, String.raw`$\alpha>1$`, String.raw`$\alpha>0$`],
          answer: 0,
          explain: String.raw`$1-\cos\frac1{n^\alpha}\sim\frac1{2n^{2\alpha}}$: converge sse $2\alpha>1$. Con $\alpha>1$ si sbaglia l'esponente (si dimentica il $2$); con $\alpha>0$ si confonde la condizione necessaria con la convergenza.`,
        },
        {
          id: 's13.parametri.L1.c8', type: 'num', level: 2,
          prompt: String.raw`Quale esponente $\beta$ compare in $\displaystyle\log\left(1+\frac1{n^2}\right)\sim\frac{1}{n^{\beta}}$?`,
          answer: '2',
          explain: String.raw`$\log(1+x)\sim x$ con $x=\frac1{n^2}$: quindi $\beta=2$.`,
        },
        {
          id: 's13.parametri.L1.c9', type: 'learn',
          title: 'Prima la condizione necessaria',
          body: String.raw`>! **Errore tipico:** applicare subito le stime con $\alpha\le0$. Se $\alpha\le0$ l'argomento $\frac1{n^\alpha}$ non tende a $0$, e le stime $\sim x$ non valgono.

Ordine di lavoro: prima controlla che il termine vada a $0$ (cioè la condizione necessaria), poi usa le stime con $\alpha$ dove servono.`,
        },
        {
          id: 's13.parametri.L1.c10', type: 'expr', level: 2,
          prompt: String.raw`Scrivi l'esponente $\beta$ tale che $\displaystyle n^{\alpha}\sin\frac1{n^2}\sim\frac{c}{n^{\beta}}$, in funzione di $\alpha$.`,
          answer: '2-alpha', vars: ['alpha'],
          explain: String.raw`$\sin\frac1{n^2}\sim\frac1{n^2}$, quindi il termine è $\sim n^{\alpha-2}=\frac1{n^{2-\alpha}}$: $\beta=2-\alpha$.`,
        },
        {
          id: 's13.parametri.L1.c11', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: per $\alpha=\frac12$, la serie $\displaystyle\sum_{n\ge1}\left(1-\cos\frac1{\sqrt n}\right)$ converge.`,
          answer: false,
          explain: String.raw`Falso: $1-\cos\frac1{\sqrt n}\sim\frac1{2n}$, e l'esponente $1$ non è $>1$. La serie diverge (armonica).`,
        },
        {
          id: 's13.parametri.L1.c12', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: per $\alpha\le0$ la serie $\displaystyle\sum_{n\ge1}\sin\frac1{n^{\alpha}}$ converge.`,
          answer: false,
          explain: String.raw`Falso: per $\alpha\le0$ il termine non tende a $0$ e la serie diverge (condizione necessaria non soddisfatta).`,
        },
        {
          id: 's13.parametri.L1.c13', type: 'mcq', level: 2,
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}}{n^2+1}$?`,
          options: [String.raw`$\alpha<1$`, String.raw`$\alpha<-1$`, String.raw`$\alpha>1$`],
          answer: 0,
          explain: String.raw`Il termine è $\sim n^{\alpha-2}$: converge sse $\alpha-2<-1$, cioè $\alpha<1$. Con $\alpha>1$ l'esponente è ancora positivo o nullo quando diverge.`,
        },
      ],
    },
    {
      id: 's13.parametri.L2',
      title: 'Esponenti che si sommano',
      cards: [
        {
          type: 'learn',
          title: 'Prodotti e quozienti',
          body: String.raw`Se $a_n\sim c\,n^{\beta}$ e $b_n\sim d\,n^{\gamma}$, con $c,d\neq0$, allora

$$a_nb_n\sim cd\,n^{\beta+\gamma},\qquad \frac{a_n}{b_n}\sim\frac cd\,n^{\beta-\gamma}.$$

Gli esponenti si **sommano** nel prodotto e si **sottraggono** nel quoziente. Attenzione: queste regole valgono per prodotti e quozienti, non per somme e differenze (lo vedrai nella lezione 3).`,
        },
        {
          id: 's13.parametri.L2.c2', type: 'example', title: 'Potenza per seno',
          problem: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}n^{\alpha}\sin\frac1{n^2}$?`,
          steps: [
            String.raw`Il termine è positivo per ogni $n$: $n^\alpha>0$ e $\sin\frac1{n^2}>0$. Posso usare i criteri per termini positivi.`,
            {
              text: String.raw`Per $n\to\infty$, $\sin\frac1{n^2}\sim\frac1{n^2}$.`,
              ask: {
                type: 'expr', prompt: String.raw`Scrivi l'esponente della potenza di $n$ in $n^{\alpha}\cdot\frac1{n^2}$ come espressione in $\alpha$.`,
                answer: 'alpha-2', vars: ['alpha'],
                explain: String.raw`Gli esponenti si sommano: $\alpha+(-2)=\alpha-2$.`,
              },
            },
            String.raw`Quindi $a_n\sim\frac1{n^{2-\alpha}}$: converge sse $2-\alpha>1$, cioè $\alpha<1$.`,
          ],
          result: String.raw`Converge sse $\alpha<1$: intervallo $(-\infty,1)$.`,
        },
        {
          id: 's13.parametri.L2.c3', type: 'example', title: 'Potenza per differenza',
          problem: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}n^{\alpha}\left(1-\cos\frac1{\sqrt n}\right)$?`,
          steps: [
            String.raw`Il termine è positivo, perché $1-\cos x\ge0$.`,
            {
              text: String.raw`Usando $1-\cos x\sim\frac{x^2}2$ con $x=\frac1{\sqrt n}$: $1-\cos\frac1{\sqrt n}\sim\frac1{2n}$.`,
              ask: {
                type: 'mcq', prompt: String.raw`Perché $x^2=\frac1{n}$ con $x=\frac1{\sqrt n}$?`,
                options: [String.raw`Perché $\left(\frac1{\sqrt n}\right)^2=\frac1n$`, String.raw`Perché $\left(\frac1{\sqrt n}\right)^2=\frac1{\sqrt n}$`, String.raw`Perché $\left(\frac1{\sqrt n}\right)^2=\frac1{n^2}$`],
                answer: 0,
                explain: String.raw`Il quadrato di $\frac1{\sqrt n}$ è $\frac1{n}$: gli esponenti si moltiplicano per $2$, $-\frac12\cdot2=-1$.`,
              },
            },
            String.raw`Quindi $a_n\sim\frac{n^{\alpha}}{2n}=\frac12n^{\alpha-1}$: converge sse $\alpha-1<-1$, cioè $\alpha<0$.`,
          ],
          result: String.raw`Converge sse $\alpha<0$: intervallo $(-\infty,0)$.`,
        },
        {
          type: 'learn',
          title: 'Radici e potenze di polinomi',
          body: String.raw`Il grado dominante dà l'esponente. Per esempio $\sqrt{n^2+1}\sim n$ e $(n^2+1)^{\alpha}\sim n^{2\alpha}$. In generale, per un polinomio $p(n)$ di grado $k$ con coefficiente $c\ne0$, $\,p(n)^{\alpha}\sim c^{\alpha}\,n^{k\alpha}$.

Per le radici $\sqrt[m]{p(n)}\sim n^{k/m}$: basta dividere il grado per l'indice.`,
        },
        {
          id: 's13.parametri.L2.c5', type: 'mcq', level: 2,
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}}{\sqrt{n^3+1}}$?`,
          options: [String.raw`$\alpha<\frac12$`, String.raw`$\alpha<\frac32$`, String.raw`$\alpha<-\frac12$`],
          answer: 0,
          explain: String.raw`$\sqrt{n^3+1}\sim n^{3/2}$: il termine è $\sim n^{\alpha-3/2}$, converge sse $\alpha-\frac32<-1$, cioè $\alpha<\frac12$.`,
        },
        {
          id: 's13.parametri.L2.c6', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\frac{\sqrt[3]{n}}{n^2}$ converge.`,
          answer: true,
          explain: String.raw`Il termine è $\sim n^{1/3-2}=n^{-5/3}$, con esponente $\frac53>1$: converge.`,
        },
        {
          id: 's13.parametri.L2.c7', type: 'interval', level: 2,
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}}{n^3+1}$?`,
          answer: '(-inf,2)',
          explain: String.raw`$a_n\sim n^{\alpha-3}$: converge sse $3-\alpha>1$, cioè $\alpha<2$.`,
        },
        {
          id: 's13.parametri.L2.c8', type: 'num', level: 2,
          prompt: String.raw`Esponente $\beta$ tale che $(2n^3+n^2)^{1/5}\sim c\,n^{\beta}$. Scrivi la frazione.`,
          answer: '3/5',
          explain: String.raw`Il grado dominante è $3$, e la radice quinta dà $\frac35$: $(2n^3+n^2)^{1/5}\sim2^{1/5}n^{3/5}$.`,
        },
        {
          id: 's13.parametri.L2.c9', type: 'expr', level: 2,
          prompt: String.raw`Scrivi l'esponente $\beta$ tale che $\displaystyle\frac{n^{\alpha}}{n^2+n}\sim\frac{c}{n^{\beta}}$, in funzione di $\alpha$.`,
          answer: '2-alpha', vars: ['alpha'],
          explain: String.raw`Il denominatore è $\sim n^2$: il termine è $\sim n^{\alpha-2}=\frac1{n^{2-\alpha}}$.`,
        },
        {
          id: 's13.parametri.L2.c10', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}n^{\alpha}\cdot\frac{1}{n^{3}}$ converge per ogni $\alpha<2$.`,
          answer: true,
          explain: String.raw`Il termine è $\frac{1}{n^{3-\alpha}}$: converge sse $3-\alpha>1$, cioè $\alpha<2$. Quindi la frase è vera.`,
        },
        {
          id: 's13.parametri.L2.c11', type: 'mcq', level: 2,
          prompt: String.raw`Per $\alpha\in\R$, quale condizione dà la convergenza di $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}}{n+1}$?`,
          options: [String.raw`$\alpha<0$`, String.raw`$\alpha<1$`, String.raw`$\alpha<2$`],
          answer: 0,
          explain: String.raw`$a_n\sim n^{\alpha-1}$: converge sse $1-\alpha>1$, cioè $\alpha<0$. Con $\alpha<1$ si ha solo la condizione necessaria $a_n\to0$.`,
        },
      ],
    },
    {
      id: 's13.parametri.L3',
      title: 'Differenze e sviluppi di Taylor',
      cards: [
        {
          type: 'learn',
          title: 'Quando i termini si annullano',
          body: String.raw`A volte il termine generale è una **differenza** di due quantità quasi uguali, come $\frac1{n^\alpha}-\sin\frac1{n^\alpha}$. Al primo ordine le due parti si cancellano e la stima $\sim x$ non basta: ciò che resta è di ordine superiore.

Per $x\to0$ si ha $\sin x=x-\frac{x^3}{6}+o(x^3)$, quindi $x-\sin x\sim\frac{x^3}{6}$. Con $x=\frac1{n^{\alpha}}$ il termine diventa $\sim\frac1{6n^{3\alpha}}$.`,
        },
        {
          type: 'learn',
          title: 'Sviluppi da ricordare',
          body: String.raw`Gli sviluppi di McLaurin al secondo e terzo ordine che servono qui, per $x\to0$:

- $e^x=1+x+\frac{x^2}{2}+o(x^2)$
- $\cos x=1-\frac{x^2}2+o(x^2)$, quindi $1-\cos x\sim\frac{x^2}2$
- $\sin x=x-\frac{x^3}6+o(x^3)$, quindi $x-\sin x\sim\frac{x^3}6$
- $\log(1+x)=x-\frac{x^2}2+o(x^2)$

Regola: scegli l'ordine in cui la differenza smette di annullarsi.`,
        },
        {
          id: 's13.parametri.L3.c3', type: 'example', title: 'Seno meno argomento',
          problem: String.raw`Per quali $\alpha>0$ converge $\displaystyle\sum_{n\ge1}\left(\frac1{n^{\alpha}}-\sin\frac1{n^{\alpha}}\right)$?`,
          steps: [
            String.raw`Il termine è positivo: $x-\sin x>0$ per $x>0$. Con $x=\frac1{n^\alpha}\to0$.`,
            {
              text: String.raw`Al primo ordine $x-\sin x\sim x-x=0$ non dà informazione: serve il termine successivo.`,
              ask: {
                type: 'mcq', prompt: String.raw`Quale stima vale per $x-\sin x$ con $x\to0$?`,
                options: [String.raw`$x-\sin x\sim\frac{x^3}{6}$`, String.raw`$x-\sin x\sim x$`, String.raw`$x-\sin x\sim\frac{x^2}{2}$`],
                answer: 0,
                explain: String.raw`Dallo sviluppo $\sin x=x-\frac{x^3}6+o(x^3)$ segue $x-\sin x=\frac{x^3}{6}+o(x^3)$.`,
              },
            },
            String.raw`Quindi $a_n\sim\frac1{6n^{3\alpha}}$: converge sse $3\alpha>1$, cioè $\alpha>\frac13$.`,
          ],
          result: String.raw`Converge sse $\alpha>\frac13$. Per $\alpha\le0$ diverge perché il termine non tende a $0$.`,
        },
        {
          id: 's13.parametri.L3.c4', type: 'example', title: 'Esponenziale meno Taylor',
          problem: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}n^{\alpha}\left(e^{1/n}-1-\frac1n\right)$?`,
          steps: [
            String.raw`Il termine è positivo, perché $e^x-1-x>0$ per $x\neq0$.`,
            {
              text: String.raw`Con $x=\frac1n$ lo sviluppo $e^x-1-x=\frac{x^2}{2}+o(x^2)$ dà $e^{1/n}-1-\frac1n\sim\frac1{2n^2}$.`,
              ask: {
                type: 'mcq', prompt: String.raw`Quale stima vale per $e^x-1-x$ con $x\to0$?`,
                options: [String.raw`$\frac{x^2}{2}$`, String.raw`$x$`, String.raw`$0$`],
                answer: 0,
                explain: String.raw`Il primo termine dello sviluppo di $e^x$ che sopravvive dopo aver tolto $1+x$ è $\frac{x^2}{2}$.`,
              },
            },
            String.raw`Quindi $a_n\sim\frac12n^{\alpha-2}$: converge sse $2-\alpha>1$, cioè $\alpha<1$.`,
          ],
          result: String.raw`Converge sse $\alpha<1$: intervallo $(-\infty,1)$.`,
        },
        {
          id: 's13.parametri.L3.c6', type: 'mcq', level: 2,
          prompt: String.raw`Perché per $\alpha\le0$ la serie $\displaystyle\sum_{n\ge1}\left(\frac1{n^{\alpha}}-\sin\frac1{n^{\alpha}}\right)$ diverge?`,
          options: [
            String.raw`Perché il termine non tende a $0$`,
            String.raw`Perché il termine è negativo`,
            String.raw`Perché il criterio del confronto non si applica`,
          ],
          answer: 0,
          explain: String.raw`Per $\alpha=0$ il termine vale $1-\sin1\neq0$; per $\alpha<0$ l'argomento $x=n^{|\alpha|}\to+\infty$ e $x-\sin x\to+\infty$. Il termine è positivo, e il confronto si applica benissimo.`,
        },
        {
          id: 's13.parametri.L3.c7', type: 'num', level: 2,
          prompt: String.raw`Per $a_n=\frac1{\sqrt n}-\sin\frac1{\sqrt n}$, quale esponente $\beta$ vale in $a_n\sim\frac c{n^{\beta}}$? Scrivi la frazione.`,
          answer: '3/2',
          explain: String.raw`Con $x=\frac1{\sqrt n}$: $x-\sin x\sim\frac{x^3}6=\frac1{6n^{3/2}}$, quindi $\beta=\frac32$.`,
        },
        {
          id: 's13.parametri.L3.c8', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\left(\frac1{\sqrt n}-\sin\frac1{\sqrt n}\right)$ converge.`,
          answer: true,
          explain: String.raw`Vero: il termine è $\sim\frac1{6n^{3/2}}$, con esponente $\frac32>1$. Converge.`,
        },
        {
          id: 's13.parametri.L3.c9', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: se $a_n\sim b_n$ allora $a_n-b_n\to0$.`,
          answer: false,
          explain: String.raw`Falso: $a_n=n+1$ e $b_n=n$ danno $\frac{a_n}{b_n}\to1$, quindi $a_n\sim b_n$, ma $a_n-b_n=1\not\to0$. Le stime non si sottraggono.`,
        },
        {
          id: 's13.parametri.L3.c10', type: 'mcq', level: 3,
          prompt: String.raw`Sia $a_n=\sqrt{1+\frac2n}-1-\frac1n$. Quale stima è corretta?`,
          options: [String.raw`$a_n\sim-\frac{1}{2n^2}$`, String.raw`$a_n\sim\frac1n$`, String.raw`$a_n\sim0$`],
          answer: 0,
          explain: String.raw`Con $u=\frac2n$: $\sqrt{1+u}=1+\frac u2-\frac{u^2}8+o(u^2)$, quindi $\sqrt{1+\frac2n}=1+\frac1n-\frac1{2n^2}+o\left(\frac1{n^2}\right)$ e $a_n\sim-\frac1{2n^2}$. Il termine $\frac1n$ si cancella.`,
        },
        {
          id: 's13.parametri.L3.c11', type: 'open', level: 3, points: 2,
          prompt: String.raw`Spiega perché la stima al primo ordine non basta per studiare $\displaystyle\sum\left(\frac1{n^{\alpha}}-\sin\frac1{n^{\alpha}}\right)$.`,
          answer: String.raw`Al primo ordine $\sin x\sim x$ e il termine $x-\sin x$ diventa $x-x=0$: la stima non dà il comportamento del termine. Serve lo sviluppo $\sin x=x-\frac{x^3}6+o(x^3)$, da cui $x-\sin x\sim\frac{x^3}6$. Con $x=\frac1{n^\alpha}$ si ottiene $\frac1{6n^{3\alpha}}$, e la serie converge sse $3\alpha>1$.`,
          rubric: [
            String.raw`Osserva che al primo ordine la differenza si annulla`,
            String.raw`Usa lo sviluppo di Taylor di ordine successivo`,
            String.raw`Ottiene $x-\sin x\sim\frac{x^3}{6}$ e l'esponente $3\alpha$`,
          ],
        },
        {
          id: 's13.parametri.L3.c12', type: 'mcq', level: 2,
          prompt: String.raw`Per $\alpha>0$, per quali $\alpha$ converge $\displaystyle\sum_{n\ge1}\left(e^{1/n^{\alpha}}-1-\frac1{n^{\alpha}}\right)$?`,
          options: [String.raw`$\alpha>\frac12$`, String.raw`$\alpha>\frac13$`, String.raw`$\alpha>1$`],
          answer: 0,
          explain: String.raw`$e^x-1-x\sim\frac{x^2}2$ con $x=\frac1{n^\alpha}$: il termine è $\sim\frac1{2n^{2\alpha}}$, converge sse $2\alpha>1$. Il $\frac13$ viene dal seno cubico, non dall'esponenziale.`,
        },
        {
          id: 's13.parametri.L3.c13', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: per $\alpha=1$ la serie $\displaystyle\sum_{n\ge1}\left(1-\cos\frac1{n}\right)$ converge.`,
          answer: true,
          explain: String.raw`Vero: $1-\cos\frac1n\sim\frac1{2n^2}$, con esponente $2>1$.`,
        },
      ],
    },
    {
      id: 's13.parametri.L4',
      title: 'Livello d\'esame',
      cards: [
        {
          type: 'learn',
          title: 'Schema per i parametri',
          body: String.raw`Per una serie con parametro, all'esame procedi così:

1. **Dominio del parametro.** Dove il termine è definito e positivo? Separa i casi dove serve (per esempio $\alpha\le0$).
2. **Condizione necessaria.** Per quali $\alpha$ il termine tende a $0$?
3. **Equivalente.** Trova $a_n\sim\frac{c}{n^{\beta(\alpha)}}$ con gli sviluppi giusti. Se la differenza si annulla, sali di ordine.
4. **Soglia.** Risolvi $\beta(\alpha)>1$ (o il criterio adatto) e scrivi l'intervallo.`,
        },
        {
          id: 's13.parametri.L4.c2', type: 'example', title: 'Radice e potenza',
          problem: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}}{\sqrt{n^3+1}}$?`,
          steps: [
            String.raw`Il termine è positivo per ogni $\alpha$. Il numeratore è $n^\alpha$.`,
            {
              text: String.raw`Il denominatore ha grado $3$ sotto radice: $\sqrt{n^3+1}\sim n^{3/2}$.`,
              ask: {
                type: 'expr', prompt: String.raw`Scrivi l'esponente della potenza di $n$ nel termine $\frac{n^{\alpha}}{n^{3/2}}$, in funzione di $\alpha$.`,
                answer: 'alpha-3/2', vars: ['alpha'],
                explain: String.raw`$n^{\alpha}/n^{3/2}=n^{\alpha-3/2}$.`,
              },
            },
            String.raw`Converge sse $\frac32-\alpha>1$, cioè $\alpha<\frac12$.`,
          ],
          result: String.raw`Converge sse $\alpha<\frac12$: intervallo $(-\infty,\frac12)$.`,
        },
        {
          id: 's13.parametri.L4.c3', type: 'problem', level: 3, source: 'Appello 03/09/2026 · Parte B', points: 5,
          prompt: String.raw`Si consideri $\displaystyle\sum_{n\ge1}\frac{\sqrt[3]{n}\,\sin\left(n^{-\alpha}\right)}{\log\frac{n^3+1}{n^3}}$, con $\alpha>0$.`,
          parts: [
            {
              type: 'expr', prompt: String.raw`Scrivi l'esponente $\beta$ di un equivalente $a_n\sim c\,n^{\beta}$, in funzione di $\alpha$.`,
              answer: '10/3-alpha', vars: ['alpha'],
              explain: String.raw`$\sin(n^{-\alpha})\sim n^{-\alpha}$ e $\log\frac{n^3+1}{n^3}=\log\left(1+\frac1{n^3}\right)\sim\frac1{n^3}$. Quindi $a_n\sim\frac{n^{1/3}n^{-\alpha}}{n^{-3}}=n^{10/3-\alpha}$.`,
            },
            {
              type: 'interval', prompt: String.raw`Per quali $\alpha>0$ la serie converge?`,
              answer: '(13/3,inf)',
              explain: String.raw`Converge sse $\alpha-\frac{10}3>1$, cioè $\alpha>\frac{13}3$. Il termine tende a $0$ sse $\alpha>\frac{10}3$, che è solo condizione necessaria.`,
            },
          ],
          solution: String.raw`Per $\alpha>0$: $\sin(n^{-\alpha})\sim n^{-\alpha}$ e $\log\left(1+\frac1{n^3}\right)\sim\frac1{n^3}$, quindi $a_n\sim n^{10/3-\alpha}$. Converge sse $\alpha>\frac{13}3$; la condizione necessaria $\alpha>\frac{10}3$ non basta.`,
        },
        {
          id: 's13.parametri.L4.c4', type: 'problem', level: 3, source: 'Appello 10/02/2026 · Parte B', points: 5,
          prompt: String.raw`Si consideri $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}\left[(2n^3+n^2)^{1/5}-(2n^3)^{1/5}\right]}{\log\left(1+\tan\frac2{n^2}\right)}$, con $\alpha\in\R$.`,
          parts: [
            {
              type: 'expr', prompt: String.raw`Scrivi l'esponente $\beta$ di un equivalente $a_n\sim c\,n^{\beta}$, in funzione di $\alpha$.`,
              answer: 'alpha+8/5', vars: ['alpha'],
              explain: String.raw`$(2n^3+n^2)^{1/5}-(2n^3)^{1/5}=(2n^3)^{1/5}\left[(1+\frac1{2n})^{1/5}-1\right]\sim(2n^3)^{1/5}\frac1{10n}\sim\frac{2^{1/5}}{10}n^{-2/5}$. Il denominatore è $\sim\frac2{n^2}$. Il rapporto è $\sim\frac{2^{1/5}}{20}n^{8/5}$ e l'esponente totale è $\alpha+\frac85$.`,
            },
            {
              type: 'interval', prompt: String.raw`Per quali $\alpha$ converge la serie?`,
              answer: '(-inf,-13/5)',
              explain: String.raw`Converge sse $\alpha+\frac85<-1$, cioè $\alpha<-\frac{13}5$.`,
            },
          ],
          solution: String.raw`La differenza tra radici si stima con $(1+x)^{1/5}-1\sim\frac x5$ con $x=\frac1{2n}$. Il denominatore si stima con $\tan\frac2{n^2}\sim\frac2{n^2}$. Termine $\sim\frac{2^{1/5}}{20}n^{\alpha+8/5}$: converge sse $\alpha<-\frac{13}5$.`,
        },
        {
          id: 's13.parametri.L4.c5', type: 'problem', level: 3, source: 'Appello 11/06/2026 · Parte B', points: 5,
          prompt: String.raw`Si consideri $\displaystyle\sum_{n\ge1}\left(1-\cos\log\left(1+\frac1{\sqrt n}\right)\right)\sin\frac1{n^{\alpha}}$, con $\alpha>0$.`,
          parts: [
            {
              type: 'expr', prompt: String.raw`Scrivi l'esponente $\beta$ di un equivalente $a_n\sim\frac c{n^{\beta}}$, in funzione di $\alpha$.`,
              answer: 'alpha+1', vars: ['alpha'],
              explain: String.raw`$\log(1+\frac1{\sqrt n})\sim\frac1{\sqrt n}$, quindi $1-\cos(\cdot)\sim\frac1{2n}$. E $\sin\frac1{n^\alpha}\sim\frac1{n^\alpha}$. Il prodotto è $\sim\frac1{2n^{1+\alpha}}$.`,
            },
            {
              type: 'interval', prompt: String.raw`Per quali $\alpha>0$ converge la serie?`,
              answer: '(0,inf)',
              explain: String.raw`Converge sse $1+\alpha>1$, cioè $\alpha>0$: per ogni $\alpha>0$.`,
            },
          ],
          solution: String.raw`Con $\alpha>0$: $a_n\sim\frac1{2n^{1+\alpha}}$, serie convergente per ogni $\alpha>0$.`,
        },
        {
          id: 's13.parametri.L4.c6', type: 'problem', level: 2, source: 'Appello 03/09/2026 · Parte B', points: 3,
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}\left(\sqrt{n^2+1}-n\right)^{\alpha}$?`,
          parts: [
            {
              type: 'interval', prompt: String.raw`Per quali $\alpha\in\R$ converge?`,
              answer: '(1,inf)',
              explain: String.raw`$\sqrt{n^2+1}-n=\frac1{\sqrt{n^2+1}+n}\sim\frac1{2n}$, quindi il termine è $\sim\frac{1}{(2n)^{\alpha}}$. Per $\alpha\le0$ il termine non tende a $0$; per $\alpha>0$ converge sse $\alpha>1$.`,
            },
          ],
          solution: String.raw`$\sqrt{n^2+1}-n\sim\frac1{2n}$. Per $\alpha\le0$ il termine non tende a $0$; per $\alpha>0$ il termine è $\sim\frac1{2^\alpha n^\alpha}$, convergente sse $\alpha>1$.`,
        },
        {
          id: 's13.parametri.L4.c7', type: 'open', level: 3, source: 'Appello 11/06/2026 · Parte A', points: 3,
          prompt: String.raw`Scrivi il procedimento completo per stabilire per quali $\alpha$ converge una serie con termine $a_n$ che dipende da un parametro, e dove può fallire.`,
          answer: String.raw`Si verifica prima la condizione necessaria $a_n\to0$, che restringe i valori di $\alpha$. Poi si trova un equivalente $a_n\sim\frac{c}{n^{\beta(\alpha)}}$ con $c\neq0$, usando gli sviluppi di Taylor se il primo ordine si annulla. Infine si studia $\beta(\alpha)>1$ (per termini di segno fisso) e si scrive l'intervallo. Il procedimento fallisce se si sostituiscono stime dentro una differenza che si annulla, o se si applicano le stime a valori di $\alpha$ per cui l'argomento non tende a $0$.`,
          rubric: [
            String.raw`Applica prima la condizione necessaria $a_n\to0$`,
            String.raw`Trova un equivalente $c/n^{\beta(\alpha)}$ con $c\neq0$`,
            String.raw`Ricava la soglia $\beta(\alpha)>1$ e scrive l'intervallo`,
            String.raw`Segnala il rischio di stime dentro differenze o per $\alpha$ fuori dal dominio delle stime`,
          ],
        },
        {
          id: 's13.parametri.L4.c8', type: 'tf', level: 2,
          prompt: String.raw`Vero o falso: se $a_n\ge0$ e $a_n\sim\frac{c}{n^{\beta}}$ con $c>0$, allora $\sum a_n$ converge sse $\beta>1$.`,
          answer: true,
          explain: String.raw`Vero: è la regola del confronto asintotico con la serie armonica generalizzata.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's13.parametri.p1', type: 'tf', level: 1,
      prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\frac1{n^{\alpha}}$ converge per $\alpha>1$.`,
      answer: true,
      explain: String.raw`Armonica generalizzata: converge sse l'esponente è $>1$.`,
    },
    {
      id: 's13.parametri.p2', type: 'num', level: 1,
      prompt: String.raw`Esponente $\beta$ tale che $\displaystyle\log\left(1+\frac1{n^{2}}\right)\sim\frac{c}{n^{\beta}}$?`,
      answer: '2',
      explain: String.raw`$\log(1+x)\sim x$ con $x=\frac1{n^2}$: $\beta=2$.`,
    },
    {
      id: 's13.parametri.p3', type: 'interval', level: 2,
      prompt: String.raw`Per quali $\alpha>0$ converge $\displaystyle\sum_{n\ge1}\log\left(1+\frac{1}{n^{\alpha}}\right)$?`,
      answer: '(1,inf)',
      explain: String.raw`Per $\alpha>0$ l'argomento $\frac1{n^\alpha}$ tende a $0$ e $\log(1+x)\sim x$: $a_n\sim\frac1{n^{\alpha}}$. Converge sse $\alpha>1$.`,
    },
    {
      id: 's13.parametri.p4', type: 'tf', level: 2,
      prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\left(1-\cos\frac1n\right)$ converge.`,
      answer: true,
      explain: String.raw`$1-\cos\frac1n\sim\frac1{2n^2}$: converge.`,
    },
    {
      id: 's13.parametri.p5', type: 'mcq', level: 2,
      prompt: String.raw`Per $\alpha>0$, per quali $\alpha$ converge $\displaystyle\sum_{n\ge1}\left(e^{1/n^{\alpha}}-1\right)$?`,
      options: [String.raw`$\alpha>1$`, String.raw`$\alpha>\frac12$`, String.raw`$\alpha>0$`],
      answer: 0,
      explain: String.raw`$e^x-1\sim x$ con $x=\frac1{n^\alpha}$: il termine è $\sim\frac1{n^\alpha}$, converge sse $\alpha>1$.`,
    },
    {
      id: 's13.parametri.p6', type: 'cloze', level: 2,
      text: String.raw`Se $a_n\ge0$ e $a_n\sim\frac{c}{n^{\beta}}$ con $c>0$, la serie converge sse [[0]]. Un termine con $\beta=1$ dà una serie [[1]].`,
      blanks: [
        { options: [String.raw`$\beta>1$`, String.raw`$\beta>0$`, String.raw`$\beta<1$`], answer: 0 },
        { options: ['convergente', 'divergente', 'indeterminata'], answer: 1 },
      ],
      explain: String.raw`La regola dell'armonica generalizzata: converge sse $\beta>1$. Con $\beta=1$ si ottiene la serie armonica, che diverge.`,
    },
    {
      id: 's13.parametri.p7', type: 'expr', level: 2,
      prompt: String.raw`Scrivi l'esponente $\beta$ tale che $\displaystyle\frac{n^{\alpha}}{n^2+n}\sim\frac{c}{n^{\beta}}$, in funzione di $\alpha$.`,
      answer: '2-alpha', vars: ['alpha'],
      explain: String.raw`Il denominatore è $\sim n^2$: il termine è $\sim n^{\alpha-2}=\frac1{n^{2-\alpha}}$.`,
    },
    {
      id: 's13.parametri.p8', type: 'tf', level: 2,
      prompt: String.raw`Vero o falso: $\displaystyle\sum_{n\ge1}\left(\frac1{\sqrt n}-\sin\frac1{\sqrt n}\right)$ converge.`,
      answer: true,
      explain: String.raw`Il termine è $\sim\frac1{6n^{3/2}}$: converge.`,
    },
    {
      id: 's13.parametri.p9', type: 'open', level: 2, points: 2,
      prompt: String.raw`Scrivi le stime per $x\to0$ di $\sin x$, $1-\cos x$ e $\log(1+x)$, e indica quale ordine serve per $x-\sin x$.`,
      answer: String.raw`$\sin x\sim x$, $1-\cos x\sim\frac{x^2}2$, $\log(1+x)\sim x$. Per $x-\sin x$ il primo ordine si annulla: serve $x-\sin x\sim\frac{x^3}6$.`,
      rubric: [
        String.raw`Scrive le tre stime corrette al primo ordine`,
        String.raw`Indica che $x-\sin x$ richiede l'ordine 3, con $\frac{x^3}{6}$`,
      ],
    },
    {
      id: 's13.parametri.p10', type: 'mcq', level: 2,
      prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}}{n^2+n}$?`,
      options: [String.raw`$\alpha<1$`, String.raw`$\alpha<-1$`, String.raw`$\alpha>1$`],
      answer: 0,
      explain: String.raw`Il termine è $\sim n^{\alpha-2}$: converge sse $\alpha<1$.`,
    },
    {
      id: 's13.parametri.gen-potenze', type: 'gen', level: 2,
      gen: (R) => {
        // a_n ~ n^(alpha - e/2): converge sse alpha < (e-2)/2
        const e = R.int(2, 8);
        const c = R.int(1, 5);
        const pow = e === 2 ? 'n' : e % 2 === 0 ? `n^{${e / 2}}` : String.raw`\sqrt{n^{${e}}}`;
        const den = `${pow}+${c}`;
        const thr = H.reduce(e - 2, 2);
        return {
          type: 'interval',
          prompt: String.raw`Per quali $\alpha\in\R$ converge $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}}{${den}}$?`,
          answer: `(-inf,${qstr(thr)})`,
          explain: String.raw`Il denominatore è $\sim n^{${qstr(H.reduce(e, 2))}}$, quindi $a_n\sim n^{\alpha-${qstr(H.reduce(e, 2))}}$. Armonica generalizzata: converge sse $${qstr(H.reduce(e, 2))}-\alpha>1$, cioè $\alpha<${qstr(thr)}$.`,
        };
      },
    },
    {
      id: 's13.parametri.gen-cancel', type: 'gen', level: 3,
      gen: (R) => {
        // (x - sin x) con x = n^(-k alpha): ~ x^3/6, converge sse 3k alpha > 1
        const k = R.pick([1, 2, 3]);
        const ka = k === 1 ? String.raw`\alpha` : String.raw`${k}\alpha`;
        return {
          type: 'interval',
          prompt: String.raw`Per quali $\alpha>0$ converge $\displaystyle\sum_{n\ge1}\left(\frac{1}{n^{${ka}}}-\sin\frac{1}{n^{${ka}}}\right)$?`,
          answer: `(${qstr([1, 3 * k])},inf)`,
          explain: String.raw`Con $x=\frac1{n^{${ka}}}\to0$: $x-\sin x\sim\frac{x^3}6=\frac1{6n^{${3 * k}\alpha}}$. Converge sse $${3 * k}\alpha>1$, cioè $\alpha>${qstr([1, 3 * k])}$.`,
        };
      },
    },
    {
      id: 's13.parametri.gen-bsin', type: 'gen', level: 3,
      gen: (R) => {
        // a_n = n^b sin(1/n^alpha) ~ n^(b - alpha): converge sse alpha > b + 1
        const b = R.int(0, 3);
        const nb = b === 0 ? '' : b === 1 ? 'n' : `n^{${b}}`;
        return {
          type: 'interval',
          prompt: String.raw`Per quali $\alpha>0$ converge $\displaystyle\sum_{n\ge1}${nb}\sin\frac{1}{n^{\alpha}}$?`,
          answer: `(${b + 1},inf)`,
          explain: String.raw`Per $\alpha>0$, $\sin\frac1{n^{\alpha}}\sim\frac1{n^{\alpha}}$, quindi $a_n\sim\frac{${nb || '1'}}{n^{\alpha}}$. Converge sse ${b === 0 ? String.raw`$\alpha>1$` : String.raw`$\alpha-${b}>1$, cioè $\alpha>${b + 1}$`}.`,
        };
      },
    },
  ],
  flashcards: [
    { id: 's13.parametri.fc1', kind: 'metodo', front: String.raw`Come trovare la soglia di un parametro`, back: String.raw`1) Condizione necessaria $a_n\to0$. 2) Equivalente $a_n\sim\frac{c}{n^{\beta(\alpha)}}$. 3) Soglia $\beta(\alpha)>1$.` },
    { id: 's13.parametri.fc2', kind: 'formula', front: String.raw`Equivalenti per $x\to0$`, back: String.raw`$\sin x\sim x$, $\tan x\sim x$, $\log(1+x)\sim x$, $e^x-1\sim x$, $1-\cos x\sim\frac{x^2}2$, $(1+x)^a-1\sim ax$.` },
    { id: 's13.parametri.fc3', kind: 'formula', front: String.raw`Sviluppo di $x-\sin x$`, back: String.raw`$\sin x=x-\frac{x^3}6+o(x^3)$, quindi $x-\sin x\sim\frac{x^3}6$: il primo ordine si annulla.` },
    { id: 's13.parametri.fc4', kind: 'formula', front: String.raw`Sviluppo di $e^x-1-x$`, back: String.raw`$e^x=1+x+\frac{x^2}2+o(x^2)$, quindi $e^x-1-x\sim\frac{x^2}2$.` },
    { id: 's13.parametri.fc5', kind: 'errore', front: String.raw`Le stime non si sottraggono`, back: String.raw`$a_n\sim b_n$ non implica $a_n-b_n\to0$: esempio $n+1$ e $n$. Per una differenza serve uno sviluppo di ordine maggiore.` },
    { id: 's13.parametri.fc6', kind: 'errore', front: String.raw`Stime per $\alpha\le0$`, back: String.raw`Le stime $\sim x$ valgono solo se $x\to0$. Per $\alpha\le0$ l'argomento $\frac1{n^\alpha}$ non tende a $0$: controlla prima la condizione necessaria.` },
    { id: 's13.parametri.fc7', kind: 'metodo', front: String.raw`Esponenti: prodotto e quoziente`, back: String.raw`Nel prodotto gli esponenti si sommano; nel quoziente si sottraggono. Per una somma conta solo il termine dominante.` },
  ],
};

export default {
  id: 's13',
  title: 'Serie numeriche',
  subtitle: 'Somme parziali, criteri di convergenza, serie con parametri',
  intro: String.raw`Le serie compaiono in ogni tema: in Parte A (condizione necessaria, criterio del confronto, vero/falso sulle somme) e in Parte B (carattere di una serie con parametro, 2–4 punti). Qui impari a sommare infiniti termini e a decidere se la somma esiste.`,
  skills: [DEF, NEC, POS, ALT, PAR],
};
