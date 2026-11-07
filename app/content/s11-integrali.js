import { H } from '../engine/tex.js';

// Nota: i campi `_f` (integranda di cui `answer` è una primitiva) e `_int` ([f, a, b] con
// ∫_a^b f = answer) servono solo alla verifica numerica automatica dei contenuti.

/** Somma di termini con coefficienti razionali: [[p, q, 'x^{2}'], ...] -> LaTeX pulito */
function sumTex(terms) {
  let s = '';
  for (const [p, q, v] of terms) {
    if (p === 0) continue;
    const [a, b] = H.reduce(p, q);
    const abs = b === 1 ? (Math.abs(a) === 1 && v ? '' : String(Math.abs(a))) : `\\frac{${Math.abs(a)}}{${b}}`;
    s += (a < 0 ? (s ? ' - ' : '-') : s ? ' + ' : '') + abs + v;
  }
  return s || '0';
}

// ---------------------------------------------------------------------------
// s11.riemann · Integrale di Riemann, media, funzione integrale, teorema fondamentale
// ---------------------------------------------------------------------------
const riemann = {
  id: 's11.riemann',
  title: 'Integrale di Riemann e teorema fondamentale',
  summary: String.raw`Capire l'integrale come area con segno, usarne le proprietà, il teorema della media e il teorema fondamentale del calcolo.`,
  prereq: ['s07.teoremi', 's08.regole', 's08.hopital'],
  examRefs: ['Itinere 15/01/2026 · Parte B', 'Appello 11/06/2026 · Es. 4'],
  lessons: [
    {
      id: 's11.riemann.L1',
      title: "L'area sotto un grafico",
      cards: [
        {
          type: 'learn',
          title: 'Il problema',
          body: String.raw`Sia $f\ge 0$ su un intervallo $[a,b]$. Vogliamo l'**area** della regione compresa tra il grafico di $f$, l'asse $x$ e le rette $x=a$, $x=b$ (il *trapezoide*).

Se $f$ è costante è l'area di un rettangolo. Se no, **approssimiamo con rettangoli**: divido $[a,b]$ in pezzi e su ogni pezzo uso un rettangolo.

- rettangoli "dentro" il grafico → area per **difetto**;
- rettangoli che "contengono" il grafico → area per **eccesso**.

Più i pezzi sono fini, più le due stime si avvicinano. Se si avvicinano allo **stesso numero**, quel numero è l'integrale.`,
          plot: { fns: [{ f: 'x^2', label: 'f(x)=x^2' }, { f: 'x<0.25 ? 0 : x<0.5 ? 0.0625 : x<0.75 ? 0.25 : 0.5625', label: 'rettangoli per difetto' }], x: [0, 1], y: [0, 1] },
        },
        {
          type: 'learn',
          title: 'Somme inferiori e superiori',
          body: String.raw`Una **partizione** di $[a,b]$ è $P=\{x_0=a<x_1<\dots<x_n=b\}$. Su ogni $[x_{k-1},x_k]$ (di ampiezza $\Delta x_k = x_k-x_{k-1}$) siano
$m_k=\inf f$ e $M_k=\sup f$. Allora

$$s(P)=\sum_{k=1}^n m_k\,\Delta x_k \qquad S(P)=\sum_{k=1}^n M_k\,\Delta x_k$$

sono la **somma inferiore** e la **somma superiore**: $s(P)\le S(P)$.

>* $f$ limitata su $[a,b]$ è **integrabile secondo Riemann** se $\sup_P s(P)=\inf_P S(P)$. Questo valore comune si indica con $\displaystyle\int_a^b f(x)\,dx$.

Equivalentemente: prendendo in ogni intervallino un punto qualsiasi $\xi_k$, le **somme di Riemann** $\sum f(\xi_k)\Delta x_k$ tendono all'integrale quando l'ampiezza massima tende a $0$.

La $x$ in $dx$ è una variabile **muta**: $\int_a^b f(x)\,dx=\int_a^b f(t)\,dt$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $f(x)=x$ su $[0,1]$',
          problem: String.raw`Calcola $s$ e $S$ per $f(x)=x$ su $[0,1]$ con 4 parti uguali.`,
          steps: [
            String.raw`Punti: $0,\frac14,\frac12,\frac34,1$; ogni intervallino ha ampiezza $\frac14$.`,
            String.raw`$f$ è crescente: il minimo è nell'estremo **sinistro**, il massimo nel **destro**.`,
            String.raw`$s=\frac14\left(0+\frac14+\frac12+\frac34\right)=\frac14\cdot\frac32=\frac38$.`,
            {
              text: String.raw`$S=\frac14\left(\frac14+\frac12+\frac34+1\right)=\frac14\cdot\frac52=\frac58$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale la somma superiore $S$?`, answer: '5/8', explain: String.raw`Uso gli estremi destri: $\frac14\left(\frac14+\frac12+\frac34+1\right)=\frac58$.` },
            },
            String.raw`Con $n$ parti: $s_n=\frac{n-1}{2n}$, $S_n=\frac{n+1}{2n}$. Entrambe tendono a $\frac12$: è l'area del triangolo.`,
          ],
          result: String.raw`$\int_0^1 x\,dx=\frac12$`,
        },
        {
          id: 's11.riemann.L1.e1', type: 'num', level: 1,
          prompt: String.raw`Somma **inferiore** di $f(x)=x^2$ su $[0,1]$ con la partizione $\{0,\frac12,1\}$.`,
          answer: '1/8',
          explain: String.raw`$x^2$ è crescente su $[0,1]$: i minimi sono negli estremi sinistri, $f(0)=0$ e $f(\frac12)=\frac14$. Quindi $s=\frac12\left(0+\frac14\right)=\frac18$.`,
        },
        {
          id: 's11.riemann.L1.e2', type: 'num', level: 1,
          prompt: String.raw`Somma **superiore** di $f(x)=x^2$ su $[0,1]$ con la partizione $\{0,\frac12,1\}$.`,
          answer: '5/8',
          explain: String.raw`Massimi negli estremi destri: $f(\frac12)=\frac14$, $f(1)=1$. $S=\frac12\left(\frac14+1\right)=\frac58$. Il valore vero ($\frac13$) sta tra $\frac18$ e $\frac58$.`,
        },
        {
          id: 's11.riemann.L1.e3', type: 'mcq', level: 1,
          prompt: String.raw`$f$ è **decrescente** su $[a,b]$. Nella somma inferiore, su ogni intervallino $[x_{k-1},x_k]$ uso il valore...`,
          options: [String.raw`$f(x_k)$ (estremo destro)`, String.raw`$f(x_{k-1})$ (estremo sinistro)`, String.raw`$f\left(\frac{x_{k-1}+x_k}2\right)$ (punto medio)`, String.raw`$f(a)$ per tutti gli intervallini`],
          answer: 0,
          explain: String.raw`Se $f$ decresce, il valore più piccolo su $[x_{k-1},x_k]$ è quello a destra, $f(x_k)$. L'estremo sinistro dà il **massimo** (somma superiore). Il punto medio dà una somma di Riemann qualunque, non la somma inferiore.`,
        },
        {
          id: 's11.riemann.L1.e4', type: 'tf', level: 1,
          prompt: String.raw`Ogni funzione **continua** su un intervallo chiuso e limitato $[a,b]$ è integrabile secondo Riemann.`,
          answer: true,
          explain: String.raw`Vero: è uno dei teoremi base. Sono integrabili anche le funzioni **monotone** su $[a,b]$ e quelle limitate con un numero finito di discontinuità.`,
        },
        {
          id: 's11.riemann.L1.e5', type: 'tf', level: 2,
          prompt: String.raw`Ogni funzione **limitata** su $[a,b]$ è integrabile secondo Riemann.`,
          answer: false,
          explain: String.raw`Falso. La funzione di Dirichlet ($1$ sui razionali, $0$ sugli irrazionali) è limitata, ma in ogni intervallino ci sono sia razionali sia irrazionali: $m_k=0$, $M_k=1$, quindi $s(P)=0$ e $S(P)=b-a$ per ogni $P$. Sup e inf non coincidono.`,
        },
        {
          id: 's11.riemann.L1.e6', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\int_{-1}^{3} 5\,dx$ (pensa all'area).`,
          answer: '20',
          explain: String.raw`È un rettangolo di base $3-(-1)=4$ e altezza $5$: area $20$. Errore tipico: usare come base $3$ invece di $b-a$.`,
        },
        {
          id: 's11.riemann.L1.e7', type: 'mcq', level: 2,
          prompt: String.raw`Quanto vale $\displaystyle\int_0^2 (x-1)\,dx$? (Ragiona sul grafico: è una retta.)`,
          options: ['$0$', '$1$', '$2$', '$-1$'],
          answer: 0,
          explain: String.raw`Su $[0,1]$ la retta sta **sotto** l'asse: triangolo di area $\frac12$ contato con segno $-$. Su $[1,2]$ sta sopra: $+\frac12$. Totale $0$. L'integrale è un'**area con segno**; $1$ è l'area geometrica totale, non l'integrale.`,
          plot: { fns: ['x-1'], x: [-0.5, 2.5], y: [-1.5, 1.5] },
        },
        {
          id: 's11.riemann.L1.e8', type: 'num', level: 2,
          prompt: String.raw`Usa la geometria: $\displaystyle\int_0^2 \sqrt{4-x^2}\,dx = \;?$`,
          answer: 'pi', _int: ['sqrt(4-x^2)', 0, 2],
          explain: String.raw`$y=\sqrt{4-x^2}$ è la semicirconferenza superiore di raggio $2$. Su $[0,2]$ è un quarto di cerchio: area $\frac14\pi\cdot 2^2=\pi$.`,
          plot: { fns: ['sqrt(4-x^2)'], x: [-2.5, 2.5], y: [-0.5, 2.5] },
        },
      ],
    },
    {
      id: 's11.riemann.L2',
      title: 'Proprietà e teorema della media',
      cards: [
        {
          type: 'learn',
          title: "Proprietà dell'integrale",
          body: String.raw`Per $f,g$ integrabili su $[a,b]$ e $\lambda,\mu\in\R$:

1. **Linearità**: $\int_a^b(\lambda f+\mu g)=\lambda\int_a^b f+\mu\int_a^b g$.
2. **Additività**: $\int_a^b f=\int_a^c f+\int_c^b f$ per $a<c<b$.
3. **Convenzioni**: $\int_a^a f=0$, $\int_b^a f=-\int_a^b f$ (così l'additività vale per ogni $a,b,c$).
4. **Monotonia**: se $f\le g$ allora $\int_a^b f\le\int_a^b g$. In particolare $f\ge0\Rightarrow\int_a^b f\ge 0$.
5. **Valore assoluto**: $\left|\int_a^b f\right|\le\int_a^b|f|$.

>! L'integrale **non** è moltiplicativo: $\int fg\neq\int f\cdot\int g$ in generale.`,
        },
        {
          id: 's11.riemann.L2.e1', type: 'num', level: 1,
          prompt: String.raw`Sai che $\int_0^2 f=3$ e $\int_0^2 g=-1$. Calcola $\displaystyle\int_0^2 (2f-3g)$.`,
          answer: '9',
          explain: String.raw`Linearità: $2\cdot 3-3\cdot(-1)=6+3=9$. Attenzione al segno: $-3\cdot(-1)=+3$.`,
        },
        {
          id: 's11.riemann.L2.e2', type: 'num', level: 1,
          prompt: String.raw`$\int_0^5 f=7$ e $\int_0^2 f=3$. Quanto vale $\int_2^5 f$?`,
          answer: '4',
          explain: String.raw`Additività: $\int_0^5 f=\int_0^2 f+\int_2^5 f$, quindi $\int_2^5 f=7-3=4$.`,
        },
        {
          id: 's11.riemann.L2.e3', type: 'num', level: 1,
          prompt: String.raw`Se $\int_1^3 f=4$, quanto vale $\int_3^1 f$?`,
          answer: '-4',
          explain: String.raw`Scambiare gli estremi cambia il segno: $\int_3^1 f=-\int_1^3 f=-4$.`,
        },
        {
          id: 's11.riemann.L2.e4', type: 'mcq', level: 2,
          prompt: String.raw`Quale stima di $I=\displaystyle\int_0^1 e^{-x^2}dx$ è giusta (senza calcolarlo)?`,
          options: [String.raw`$\frac1e\le I\le 1$`, String.raw`$0\le I\le\frac1e$`, String.raw`$1\le I\le e$`, String.raw`$I<0$`],
          answer: 0,
          explain: String.raw`Su $[0,1]$: $0\le x^2\le1$, quindi $e^{-1}\le e^{-x^2}\le 1$. Per la monotonia integro su un intervallo di lunghezza $1$: $\frac1e\le I\le1$. $I<0$ è impossibile perché l'integranda è positiva.`,
        },
        {
          type: 'learn',
          title: 'Teorema della media integrale',
          body: String.raw`>* **Teorema della media.** Se $f$ è continua su $[a,b]$, esiste $c\in[a,b]$ tale che
$$\frac1{b-a}\int_a^b f(x)\,dx=f(c).$$

Il numero $\frac1{b-a}\int_a^b f$ è la **media integrale** di $f$. Geometricamente: c'è un rettangolo di base $b-a$ e altezza $f(c)$ con la stessa area del trapezoide.

**Idea della dimostrazione.** Per Weierstrass $f$ ha minimo $m$ e massimo $M$. Per la monotonia $m(b-a)\le\int_a^b f\le M(b-a)$, quindi la media sta in $[m,M]$. Per il teorema dei valori intermedi $f$ assume ogni valore tra $m$ e $M$: in particolare la media.`,
        },
        {
          type: 'example',
          title: 'Esempio: media di $f(x)=x$ su $[0,4]$',
          problem: String.raw`Trova la media integrale di $f(x)=x$ su $[0,4]$ e il punto $c$ del teorema.`,
          steps: [
            String.raw`$\int_0^4 x\,dx$ è l'area del triangolo di base $4$ e altezza $4$: $8$.`,
            {
              text: String.raw`Media: $\frac{8}{4-0}=2$.`,
              ask: { type: 'num', prompt: 'Quanto vale la media integrale?', answer: '2', explain: String.raw`Divido l'integrale per la lunghezza dell'intervallo: $8/4=2$.` },
            },
            String.raw`Cerco $c$ con $f(c)=2$: $c=2\in[0,4]$.`,
          ],
          result: String.raw`media $=2$, $c=2$`,
        },
        {
          id: 's11.riemann.L2.e5', type: 'num', level: 2,
          prompt: String.raw`Media integrale di $f(x)=3x+1$ su $[0,2]$ (l'area è un trapezio).`,
          answer: '4', _int: ['(3x+1)/2', 0, 2],
          explain: String.raw`Trapezio con basi $f(0)=1$, $f(2)=7$ e altezza $2$: area $\frac{(1+7)\cdot2}{2}=8$. Media $\frac82=4$, raggiunta in $c=1$.`,
        },
        {
          id: 's11.riemann.L2.e6', type: 'tf', level: 2,
          prompt: String.raw`Il teorema della media vale anche per $f$ discontinua: per $f=-1$ su $[-1,0)$ e $f=1$ su $[0,1]$ esiste $c$ con $f(c)=\frac12\int_{-1}^1 f$.`,
          answer: false,
          explain: String.raw`Falso: $\int_{-1}^1 f=-1+1=0$, quindi la media è $0$, ma $f$ vale solo $\pm1$. Senza continuità il teorema dei valori intermedi non si applica.`,
        },
        {
          id: 's11.riemann.L2.e7', type: 'cloze', level: 2,
          prompt: 'Completa l\'enunciato.',
          text: String.raw`Se $f$ è [[0]] su $[a,b]$, allora esiste $c\in$ [[1]] tale che $\int_a^b f(x)\,dx=$ [[2]].`,
          blanks: [
            { options: ['continua', 'limitata', 'derivabile in $(a,b)$'], answer: 0 },
            { options: ['$[a,b]$', '$\\R$', '$(a,b)$ soltanto se $f$ è derivabile'], answer: 0 },
            { options: ['$f(c)(b-a)$', '$f(c)$', '$f\'(c)(b-a)$'], answer: 0 },
          ],
          explain: String.raw`Serve la **continuità** (non basta la limitatezza: vedi il controesempio a gradino). La tesi è $\int_a^b f=f(c)(b-a)$, cioè media $=f(c)$. Con $f'(c)$ si confonde con Lagrange.`,
        },
        {
          id: 's11.riemann.L2.e8', type: 'mcq', level: 2,
          prompt: String.raw`Per $f(x)=\sin x$ su $[0,2\pi]$ quale relazione è corretta?`,
          options: [String.raw`$\left|\int_0^{2\pi}\sin x\,dx\right|=0<\int_0^{2\pi}|\sin x|\,dx=4$`, String.raw`$\left|\int_0^{2\pi}\sin x\,dx\right|=\int_0^{2\pi}|\sin x|\,dx=4$`, String.raw`$\int_0^{2\pi}\sin x\,dx=4$`, String.raw`$\int_0^{2\pi}|\sin x|\,dx=0$`],
          answer: 0,
          explain: String.raw`Le due gobbe hanno area $2$ ciascuna, con segni opposti: l'integrale vale $0$, l'integrale del modulo $4$. Vale $|\int f|\le\int|f|$, e qui la disuguaglianza è stretta.`,
          plot: { fns: ['sin(x)'], x: [0, 6.3], y: [-1.3, 1.3] },
        },
      ],
    },
    {
      id: 's11.riemann.L3',
      title: 'Funzione integrale e teorema fondamentale',
      cards: [
        {
          type: 'learn',
          title: 'La funzione integrale',
          body: String.raw`Sia $f$ integrabile su $[a,b]$. La **funzione integrale** di punto iniziale $a$ è
$$F(x)=\int_a^x f(t)\,dt,\qquad x\in[a,b].$$
Uso $t$ dentro l'integrale perché $x$ è già l'estremo. $F(x)$ è l'area con segno da $a$ fino a $x$.

Esempio: $f(t)=1$ ⇒ $F(x)=x-a$. Esempio: $f(t)=t$ su $[0,b]$ ⇒ $F(x)=\frac{x^2}2$ (triangolo). In entrambi i casi $F'=f$: non è un caso.`,
        },
        {
          type: 'learn',
          title: 'Teorema fondamentale del calcolo',
          body: String.raw`>* **Teorema fondamentale.** Se $f$ è continua su $[a,b]$, allora $F(x)=\int_a^x f(t)\,dt$ è derivabile e $F'(x)=f(x)$ per ogni $x\in[a,b]$.

**Idea della dimostrazione.** $\frac{F(x+h)-F(x)}h=\frac1h\int_x^{x+h}f(t)\,dt=f(c_h)$ con $c_h$ tra $x$ e $x+h$ (teorema della media). Se $h\to0$, $c_h\to x$ e per continuità $f(c_h)\to f(x)$.

Una **primitiva** di $f$ è una $G$ con $G'=f$. Due primitive differiscono per una costante (Lagrange). Quindi $G=F+k$ e:

>* **Formula fondamentale.** Se $f$ è continua e $G$ è una primitiva di $f$: $\displaystyle\int_a^b f(x)\,dx=G(b)-G(a)=\big[G(x)\big]_a^b$.

Calcolare integrali diventa: **trovare una primitiva**.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\int_0^3 x^2\,dx$.`,
          steps: [
            String.raw`Una primitiva di $x^2$ è $G(x)=\frac{x^3}3$: infatti $G'(x)=x^2$.`,
            {
              text: String.raw`$\int_0^3x^2dx=G(3)-G(0)=9-0=9$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $G(3)-G(0)$?`, answer: '9', explain: String.raw`$\frac{27}{3}-0=9$.` },
            },
            String.raw`Controllo con le somme: $\frac18\le\int_0^1x^2\le\frac58$ e infatti $\int_0^1 x^2=\frac13$.`,
          ],
          result: String.raw`$\int_0^3x^2\,dx=9$`,
        },
        {
          id: 's11.riemann.L3.e1', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\int_1^2 3x^2\,dx$.`,
          answer: '7', _int: ['3x^2', 1, 2],
          explain: String.raw`Primitiva $x^3$: $2^3-1^3=8-1=7$. Errore tipico: dimenticare di sottrarre $G(1)$.`,
        },
        {
          id: 's11.riemann.L3.e2', type: 'expr', level: 1,
          prompt: String.raw`$F(x)=\displaystyle\int_0^x \cos(t^2)\,dt$. Scrivi $F'(x)$.`,
          answer: 'cos(x^2)',
          explain: String.raw`Teorema fondamentale: $F'(x)=f(x)$, cioè sostituisco $t$ con $x$: $\cos(x^2)$. Non serve (e non si sa) calcolare l'integrale.`,
        },
        {
          id: 's11.riemann.L3.e3', type: 'expr', level: 2, domain: [0.5, 3],
          prompt: String.raw`$G(x)=\displaystyle\int_1^{x^3}\log t\,dt$. Scrivi $G'(x)$ per $x>0$.`,
          answer: '9*x^2*log(x)', alt: ['3*x^2*log(x^3)'],
          explain: String.raw`$G=F(x^3)$ con $F(y)=\int_1^y\log t\,dt$, $F'(y)=\log y$. Regola della catena: $G'(x)=\log(x^3)\cdot 3x^2=9x^2\log x$. Errore tipico: dimenticare il fattore $3x^2$.`,
        },
        {
          id: 's11.riemann.L3.e4', type: 'expr', level: 2, domain: [0.5, 3],
          prompt: String.raw`$H(x)=\displaystyle\int_x^{2x}\frac{\sin t}{t}\,dt$ per $x>0$. Scrivi $H'(x)$.`,
          answer: '(sin(2x)-sin(x))/x',
          explain: String.raw`Spezzo: $H(x)=\int_1^{2x}-\int_1^{x}$. Derivo: $\frac{\sin 2x}{2x}\cdot 2-\frac{\sin x}{x}=\frac{\sin 2x-\sin x}{x}$. Il primo termine ha il fattore $2$ della catena, il secondo il segno $-$ perché $x$ è l'estremo **inferiore**.`,
        },
        {
          id: 's11.riemann.L3.e5', type: 'mcq', level: 2,
          prompt: String.raw`$F(x)=\displaystyle\int_0^x (t-1)e^t\,dt$. Che cosa ha $F$ in $x=1$?`,
          options: ['un minimo relativo', 'un massimo relativo', 'un flesso a tangente orizzontale', 'non è derivabile in $1$'],
          answer: 0,
          explain: String.raw`$F'(x)=(x-1)e^x$: negativa per $x<1$, positiva per $x>1$. $F$ decresce e poi cresce: **minimo** relativo. $F$ è derivabile ovunque perché l'integranda è continua.`,
        },
        {
          id: 's11.riemann.L3.e6', type: 'num', level: 3,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{1}{x^3}\int_0^x\sin(t^2)\,dt$.`,
          answer: '1/3',
          explain: String.raw`Forma $\frac00$. De l'Hôpital con il teorema fondamentale: $\lim\frac{\sin(x^2)}{3x^2}=\frac13$ (limite notevole $\frac{\sin y}y\to1$).`,
        },
        {
          id: 's11.riemann.L3.e7', type: 'order', level: 3,
          prompt: String.raw`Ordina i passi della dimostrazione del teorema fondamentale ($f$ continua, $F(x)=\int_a^xf$). Scarta i passi sbagliati.`,
          steps: [
            String.raw`Fisso $x\in[a,b]$ e $h\neq0$ con $x+h\in[a,b]$.`,
            String.raw`Per l'additività $F(x+h)-F(x)=\int_x^{x+h}f(t)\,dt$.`,
            String.raw`Per il teorema della media esiste $c_h$ tra $x$ e $x+h$ con $\int_x^{x+h}f=h\,f(c_h)$.`,
            String.raw`Quindi $\frac{F(x+h)-F(x)}{h}=f(c_h)$.`,
            String.raw`Se $h\to0$ allora $c_h\to x$ e, per la continuità di $f$, $f(c_h)\to f(x)$: dunque $F'(x)=f(x)$.`,
          ],
          distractors: [String.raw`Per il teorema di Lagrange applicato a $f$ esiste $c_h$ con $f(x+h)-f(x)=hf'(c_h)$.`, String.raw`Poiché $f$ è derivabile, $f(c_h)\to f'(x)$.`],
          explain: String.raw`Gli ingredienti sono additività, teorema della media (che usa la continuità) e continuità di $f$ nel limite. Lagrange e la derivabilità di $f$ non servono: $f$ è solo continua.`,
        },
        {
          id: 's11.riemann.L3.e8', type: 'open', level: 3, points: 3,
          prompt: String.raw`Si enunci il teorema fondamentale del calcolo integrale e se ne dia un'idea della dimostrazione. Si deduca la formula $\int_a^bf=G(b)-G(a)$.`,
          answer: String.raw`**Enunciato.** Se $f:[a,b]\to\R$ è continua, la funzione integrale $F(x)=\int_a^x f(t)\,dt$ è derivabile in $[a,b]$ e $F'(x)=f(x)$.

**Dimostrazione.** Per $h\neq0$: $\frac{F(x+h)-F(x)}h=\frac1h\int_x^{x+h}f(t)\,dt$ (additività). Per il teorema della media esiste $c_h$ tra $x$ e $x+h$ con $\frac1h\int_x^{x+h}f=f(c_h)$. Per $h\to0$, $c_h\to x$ e per continuità $f(c_h)\to f(x)$. Quindi $F'(x)=f(x)$.

**Formula fondamentale.** Se $G$ è una primitiva di $f$, $(G-F)'=0$ su un intervallo, quindi (Lagrange) $G=F+k$. Allora $G(b)-G(a)=F(b)-F(a)=\int_a^bf-0$.`,
          rubric: ['Ipotesi: $f$ continua su $[a,b]$', 'Tesi: $F$ derivabile e $F\'=f$', 'Rapporto incrementale scritto come $\\frac1h\\int_x^{x+h}f$', 'Uso del teorema della media e della continuità nel limite $h\\to0$', 'Primitive differiscono per una costante ⇒ $G(b)-G(a)$'],
        },
      ],
    },
  ],
  practice: [
    {
      id: 's11.riemann.gen-somme', type: 'gen', level: 1,
      gen: (R) => {
        const k = R.int(1, 4), b = R.int(1, 3), n = R.pick([2, 3, 4]);
        const sup = R.chance();
        const val = sup ? [k * b * b * (n + 1), 2 * n] : [k * b * b * (n - 1), 2 * n];
        return {
          type: 'num',
          prompt: String.raw`Somma **${sup ? 'superiore' : 'inferiore'}** di $f(x)=${H.coef(k)}x$ su $[0,${b}]$ dividendo in $${n}$ parti uguali.`,
          answer: H.fracStr(...val),
          explain: String.raw`Ampiezza $${H.frac(b, n)}$. $f$ è crescente: ${sup ? 'massimi negli estremi destri' : 'minimi negli estremi sinistri'}. Somma $=${H.frac(b, n)}\sum ${H.coef(k)}x_i = ${H.frac(...val)}$. In generale per $kx$ su $[0,b]$: $s_n=kb^2\frac{n-1}{2n}$, $S_n=kb^2\frac{n+1}{2n}$, entrambe $\to\frac{kb^2}2$.`,
        };
      },
    },
    {
      id: 's11.riemann.gen-tfc', type: 'gen', level: 2,
      gen: (R) => {
        const fs = [
          { tex: (u) => String.raw`\sin(${u})`, js: (u) => `sin(${u})` },
          { tex: (u) => String.raw`e^{${u}}`, js: (u) => `e^(${u})` },
          { tex: (u) => String.raw`\cos(${u})`, js: (u) => `cos(${u})` },
          { tex: (u) => String.raw`\sqrt{1+${u}}`, js: (u) => `sqrt(1+${u})` },
          { tex: (u) => String.raw`\log(1+${u})`, js: (u) => `log(1+${u})` },
        ];
        const g = R.pick(fs), m = R.int(2, 4), c = R.int(0, 2);
        const up = `x^{${m}}`;
        const inner = R.pick(['t', 't^2']);
        const sub = (u) => (inner === 't' ? u : `(${u})^2`);
        const subTex = (u) => (inner === 't' ? u : `x^{${2 * m}}`);
        return {
          type: 'expr', domain: [0.3, 1.5],
          prompt: String.raw`$F(x)=\displaystyle\int_{${c}}^{${up}} ${g.tex(inner)}\,dt$. Calcola $F'(x)$.`,
          answer: `${g.js(sub(`x^${m}`))}*${m}*x^${m - 1}`,
          explain: String.raw`$F(x)=\Phi(x^{${m}})$ con $\Phi(y)=\int_{${c}}^y ${g.tex(inner)}\,dt$, $\Phi'(y)=${g.tex(inner === 't' ? 'y' : 'y^2')}$. Catena: $F'(x)=${g.tex(subTex(up))}\cdot ${m}x${m - 1 === 1 ? '' : `^{${m - 1}}`}$. L'estremo inferiore costante non conta.`,
        };
      },
    },
    {
      id: 's11.riemann.gen-media', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3), b = R.int(-4, 4), c = R.pick([1, 2, 3, 6]);
        // media di a x^2 + b su [0,c] = a c^2/3 + b
        return {
          type: 'num',
          prompt: String.raw`Media integrale di $f(x)=${H.poly([a, 0, b])}$ su $[0,${c}]$.`,
          answer: H.fracStr(a * c * c + 3 * b, 3), _int: [`((${a})*x^2+(${b}))/${c}`, 0, c],
          explain: String.raw`$\int_0^{${c}}(${H.poly([a, 0, b])})dx=\left[${sumTex([[a, 3, 'x^{3}'], [b, 1, 'x']])}\right]_0^{${c}}=${H.frac(a * c * c * c + 3 * b * c, 3)}$. Divido per la lunghezza $${c}$: media $=${H.frac(a * c * c + 3 * b, 3)}$.`,
        };
      },
    },
    {
      id: 's11.riemann.gen-limite', type: 'gen', level: 3,
      gen: (R) => {
        const a = R.int(1, 5), m = R.int(1, 3);
        const arg = (v) => `${a === 1 ? '' : a}${v}${m === 1 ? '' : `^{${m}}`}`;
        const g = R.pick([
          (v) => String.raw`\sin(${arg(v)})`,
          (v) => String.raw`\log(1+${arg(v)})`,
          (v) => String.raw`\left(e^{${arg(v)}}-1\right)`,
        ]);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0^+}\frac{1}{x^{${m + 1}}}\int_0^x ${g('t')}\,dt$.`,
          answer: H.fracStr(a, m + 1),
          explain: String.raw`Forma $\frac00$. De l'Hôpital + teorema fondamentale: il limite diventa $\displaystyle\lim_{x\to0^+}\frac{${g('x')}}{${m + 1}x${m === 1 ? '' : `^{${m}}`}}$. L'integranda è $\sim ${arg('x')}$ (limiti notevoli), quindi il risultato è $${H.frac(a, m + 1)}$.`,
        };
      },
    },
    {
      id: 's11.riemann.gen-poly', type: 'gen', level: 1,
      gen: (R) => {
        const p = R.int(-2, 2), q = R.nz(-3, 3), r = R.int(-3, 3);
        const lo = R.int(-1, 1), hi = lo + R.int(1, 2);
        const G = (x) => (p * x ** 3) / 3 + (q * x ** 2) / 2 + r * x;
        const num6 = Math.round(6 * (G(hi) - G(lo)));
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\int_{${lo}}^{${hi}}\left(${H.poly([p, q, r])}\right)dx$.`,
          answer: H.fracStr(num6, 6), _int: [`(${p})*x^2+(${q})*x+(${r})`, lo, hi],
          explain: String.raw`Primitiva termine a termine: $G(x)=${sumTex([[p, 3, 'x^{3}'], [q, 2, 'x^{2}'], [r, 1, 'x']])}$. $G(${hi})-G(${lo})=${H.frac(num6, 6)}$.`,
        };
      },
    },
    {
      id: 's11.riemann.p1', type: 'tf', level: 2,
      prompt: String.raw`Se $f$ è continua su $\R$, la funzione $F(x)=\int_0^x f(t)\,dt$ è derivabile su $\R$ e $F(0)=0$.`,
      answer: true,
      explain: String.raw`Teorema fondamentale: $F'=f$ ovunque. E $F(0)=\int_0^0 f=0$.`,
    },
    {
      id: 's11.riemann.p2', type: 'mcq', level: 2,
      prompt: String.raw`Quale funzione è una primitiva di $f$ continua che vale $5$ in $x=2$?`,
      options: [String.raw`$5+\int_2^x f(t)\,dt$`, String.raw`$\int_5^x f(t)\,dt$`, String.raw`$5\int_2^x f(t)\,dt$`, String.raw`$f(x)+3$`],
      answer: 0,
      explain: String.raw`$G(x)=5+\int_2^xf$ ha $G'=f$ e $G(2)=5+0=5$. $\int_5^x f$ vale $0$ in $x=5$, non $5$ in $2$. Moltiplicare per $5$ cambia la derivata in $5f$.`,
    },
    {
      id: 's11.riemann.p3', type: 'num', level: 3,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{1}{x^2}\int_0^x\log(1+t)\,dt$.`,
      answer: '1/2',
      explain: String.raw`De l'Hôpital: $\lim\frac{\log(1+x)}{2x}=\frac12$.`,
    },
    {
      id: 's11.riemann.p4', type: 'open', level: 2, points: 2,
      prompt: String.raw`Enunciare e dimostrare il teorema della media integrale.`,
      answer: String.raw`Se $f$ è continua su $[a,b]$ esiste $c\in[a,b]$ con $\int_a^bf=f(c)(b-a)$. Dim.: per Weierstrass esistono $m=\min f$, $M=\max f$. Da $m\le f\le M$ e dalla monotonia: $m(b-a)\le\int_a^bf\le M(b-a)$, cioè $\mu=\frac1{b-a}\int_a^bf\in[m,M]$. Per il teorema dei valori intermedi esiste $c$ con $f(c)=\mu$.`,
      rubric: ['Ipotesi di continuità e tesi corretta', 'Weierstrass: esistono min e max', 'Monotonia dell\'integrale: $m\\le\\mu\\le M$', 'Valori intermedi per concludere'],
    },
    {
      id: 's11.riemann.p5', type: 'match', level: 1,
      prompt: 'Abbina ogni proprietà alla sua formula.',
      pairs: [
        ['Additività', String.raw`$\int_a^bf=\int_a^cf+\int_c^bf$`],
        ['Linearità', String.raw`$\int(\lambda f+\mu g)=\lambda\int f+\mu\int g$`],
        ['Monotonia', String.raw`$f\le g\Rightarrow\int_a^bf\le\int_a^bg$`],
        ['Valore assoluto', String.raw`$\left|\int_a^bf\right|\le\int_a^b|f|$`],
      ],
      explain: 'Sono le quattro proprietà da usare per stimare e spezzare gli integrali.',
    },
    {
      id: 's11.riemann.p6', type: 'expr', level: 2,
      prompt: String.raw`$F(x)=\displaystyle\int_{x^2}^{0}e^{t^2}\,dt$. Scrivi $F'(x)$.`,
      answer: '-2*x*e^(x^4)',
      explain: String.raw`$F(x)=-\int_0^{x^2}e^{t^2}dt$, quindi $F'(x)=-e^{(x^2)^2}\cdot 2x=-2xe^{x^4}$. Attenzione: $x^2$ è l'estremo inferiore.`,
    },
  ],
  flashcards: [
    { id: 's11.riemann.fc1', kind: 'def', front: 'Somma inferiore e superiore', back: String.raw`Data $P=\{x_0<\dots<x_n\}$: $s(P)=\sum m_k\Delta x_k$, $S(P)=\sum M_k\Delta x_k$ con $m_k=\inf$, $M_k=\sup$ di $f$ su $[x_{k-1},x_k]$.` },
    { id: 's11.riemann.fc2', kind: 'def', front: 'Funzione integrabile secondo Riemann', back: String.raw`$f$ limitata su $[a,b]$ è integrabile se $\sup_P s(P)=\inf_P S(P)$; il valore comune è $\int_a^bf$.` },
    { id: 's11.riemann.fc3', kind: 'thm', front: 'Classi di funzioni integrabili', back: String.raw`Continue su $[a,b]$; monotone su $[a,b]$; limitate con un numero finito di discontinuità.` },
    { id: 's11.riemann.fc4', kind: 'errore', front: 'Una funzione limitata non integrabile', back: String.raw`Dirichlet: $1$ su $\Q$, $0$ altrove. $s(P)=0$, $S(P)=b-a$ per ogni $P$.` },
    { id: 's11.riemann.fc5', kind: 'formula', front: "Proprietà dell'integrale", back: String.raw`Linearità, additività, $\int_b^a=-\int_a^b$, monotonia, $|\int f|\le\int|f|$.` },
    { id: 's11.riemann.fc6', kind: 'thm', front: 'Teorema della media integrale', back: String.raw`$f$ continua su $[a,b]$ ⇒ $\exists c\in[a,b]$: $\frac1{b-a}\int_a^bf=f(c)$.` },
    { id: 's11.riemann.fc7', kind: 'def', front: 'Funzione integrale', back: String.raw`$F(x)=\int_a^xf(t)\,dt$: area con segno da $a$ a $x$.` },
    { id: 's11.riemann.fc8', kind: 'thm', front: 'Teorema fondamentale del calcolo', back: String.raw`$f$ continua su $[a,b]$ ⇒ $F(x)=\int_a^xf$ è derivabile e $F'=f$.` },
    { id: 's11.riemann.fc9', kind: 'dim', front: 'Idea della dimostrazione del teorema fondamentale', back: String.raw`$\frac{F(x+h)-F(x)}h=\frac1h\int_x^{x+h}f=f(c_h)$ (media), $c_h\to x$, continuità ⇒ $f(c_h)\to f(x)$.` },
    { id: 's11.riemann.fc10', kind: 'formula', front: 'Formula fondamentale del calcolo', back: String.raw`$G'=f$ continua ⇒ $\int_a^bf=G(b)-G(a)$.` },
    { id: 's11.riemann.fc11', kind: 'formula', front: 'Derivata di $\\int_{a(x)}^{b(x)}f(t)\\,dt$', back: String.raw`$f(b(x))\,b'(x)-f(a(x))\,a'(x)$.` },
  ],
};

// ---------------------------------------------------------------------------
// s11.immediati · Primitive, integrali immediati, decomposizione lineare
// ---------------------------------------------------------------------------
const immediati = {
  id: 's11.immediati',
  title: 'Primitive e integrali immediati',
  summary: String.raw`Riconoscere le primitive della tabella (anche composte) e spezzare l'integranda in pezzi immediati.`,
  prereq: ['s11.riemann', 's08.regole', 's00.algebra', 's00.trig'],
  examRefs: ['Itinere 15/01/2026 · Parte B', 'Appello 03/09/2026 · Es. 4'],
  lessons: [
    {
      id: 's11.immediati.L1',
      title: 'La tabella delle primitive',
      cards: [
        {
          type: 'learn',
          title: 'Primitive e integrale indefinito',
          body: String.raw`$G$ è una **primitiva** di $f$ su un intervallo $I$ se $G'(x)=f(x)$ per ogni $x\in I$.

Se $G$ è una primitiva, **tutte** le primitive sono $G+c$, $c\in\R$ (due funzioni con la stessa derivata su un intervallo differiscono per una costante: Lagrange). L'insieme si scrive
$$\int f(x)\,dx=G(x)+c\qquad\text{(integrale indefinito)}.$$

>* Controllo sempre possibile: **derivo il risultato** e devo ritrovare l'integranda.

Integrare è "derivare al contrario": ogni regola di derivazione dà una regola di integrazione.`,
        },
        {
          type: 'learn',
          title: 'Tabella (da sapere a memoria)',
          body: String.raw`- $x^\alpha$ ($\alpha\neq-1$) → $\dfrac{x^{\alpha+1}}{\alpha+1}$
- $\dfrac1x$ → $\log|x|$
- $e^x$ → $e^x$;  $a^x$ → $\dfrac{a^x}{\log a}$
- $\sin x$ → $-\cos x$;  $\cos x$ → $\sin x$
- $\dfrac1{\cos^2x}=1+\tan^2x$ → $\tan x$
- $\dfrac1{1+x^2}$ → $\arctan x$
- $\dfrac1{\sqrt{1-x^2}}$ → $\arcsin x$

**Linearità**: $\int(\lambda f+\mu g)=\lambda\int f+\mu\int g$: integro termine a termine e porto fuori le costanti.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\int\left(3x^2-\frac4x+e^x\right)dx$.`,
          steps: [
            String.raw`Linearità: $3\int x^2\,dx-4\int\frac{dx}{x}+\int e^x\,dx$.`,
            String.raw`$\int x^2=\frac{x^3}3$, quindi $3\int x^2=x^3$.`,
            {
              text: String.raw`$-4\int\frac{dx}x=-4\log|x|$.`,
              ask: { type: 'expr', prompt: String.raw`Una primitiva di $-\frac4x$ (per $x>0$)?`, answer: '-4*log(x)', upToConstant: true, domain: [0.5, 3], _f: '-4/x', explain: String.raw`$\int\frac1x=\log|x|$, per $x>0$ è $\log x$; moltiplico per $-4$.` },
            },
            String.raw`Totale: $x^3-4\log|x|+e^x+c$. Verifica: derivando ottengo $3x^2-\frac4x+e^x$. ✓`,
          ],
          result: String.raw`$x^3-4\log|x|+e^x+c$`,
        },
        {
          id: 's11.immediati.L1.e1', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`Calcola $\int(4x^3-2x+5)\,dx$ (la costante non serve).`,
          answer: 'x^4-x^2+5x', _f: '4x^3-2x+5',
          explain: String.raw`Termine a termine: $4\cdot\frac{x^4}4-2\cdot\frac{x^2}2+5x=x^4-x^2+5x$. Errore tipico: derivare invece di integrare ($12x^2-2$).`,
        },
        {
          id: 's11.immediati.L1.e2', type: 'expr', level: 1, upToConstant: true, domain: [0.5, 3],
          prompt: String.raw`Calcola $\int\sqrt x\,dx$.`,
          answer: '2/3*x^(3/2)', _f: 'sqrt(x)',
          explain: String.raw`$\sqrt x=x^{1/2}$: $\frac{x^{3/2}}{3/2}=\frac23x\sqrt x$. Scrivi sempre le radici come potenze prima di integrare.`,
        },
        {
          id: 's11.immediati.L1.e3', type: 'expr', level: 1, upToConstant: true, domain: [0.5, 3],
          prompt: String.raw`Calcola $\int\frac{dx}{x^3}$.`,
          answer: '-1/(2x^2)', _f: '1/x^3',
          explain: String.raw`$x^{-3}$ → $\frac{x^{-2}}{-2}=-\frac1{2x^2}$. Errore tipico: scrivere $\log|x^3|$ (vale solo per $\frac1x$).`,
        },
        {
          id: 's11.immediati.L1.e4', type: 'mcq', level: 1,
          prompt: String.raw`$\int\frac{dx}{x}=\;?$`,
          options: [String.raw`$\log|x|+c$`, String.raw`$\frac{x^0}{0}+c$`, String.raw`$-\frac1{x^2}+c$`, String.raw`$\frac{x^2}{2}+c$`],
          answer: 0,
          explain: String.raw`È il caso $\alpha=-1$ escluso dalla formula delle potenze (darebbe $\frac{x^0}0$, senza senso). $-\frac1{x^2}$ è la **derivata** di $\frac1x$, non una primitiva. Il modulo serve per $x<0$: $(\log(-x))'=\frac{-1}{-x}=\frac1x$.`,
        },
        {
          id: 's11.immediati.L1.e5', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`Calcola $\int(2\sin x+3\cos x)\,dx$.`,
          answer: '-2cos(x)+3sin(x)', _f: '2sin(x)+3cos(x)',
          explain: String.raw`$\int\sin=-\cos$, $\int\cos=\sin$: $-2\cos x+3\sin x$. Errore tipico di segno: $(\cos x)'=-\sin x$, quindi la primitiva di $\sin x$ è $-\cos x$.`,
        },
        {
          id: 's11.immediati.L1.e6', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`Calcola $\int 2^x\,dx$.`,
          answer: '2^x/log(2)', _f: '2^x',
          explain: String.raw`$(a^x)'=a^x\log a$, quindi $\int a^x=\frac{a^x}{\log a}$. Non è $\frac{2^{x+1}}{x+1}$: la formula delle potenze vale per $x^\alpha$ (base variabile), non per $a^x$ (esponente variabile).`,
        },
        {
          id: 's11.immediati.L1.e7', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`Calcola $\int\frac{5}{1+x^2}\,dx$.`,
          answer: '5*atan(x)', _f: '5/(1+x^2)',
          explain: String.raw`Tabella: $\int\frac{dx}{1+x^2}=\arctan x$. Per linearità: $5\arctan x$ (si digita arctan(x)).`,
        },
        {
          id: 's11.immediati.L1.e8', type: 'tf', level: 1,
          prompt: String.raw`$\int f(x)g(x)\,dx=\int f(x)\,dx\cdot\int g(x)\,dx$.`,
          answer: false,
          explain: String.raw`Falso. Esempio: $\int x\cdot x\,dx=\frac{x^3}3$, mentre $\int x\cdot\int x=\frac{x^4}{4}$. Per i prodotti servono tecniche apposite (per parti, sostituzione).`,
        },
        {
          id: 's11.immediati.L1.e9', type: 'match', level: 1,
          prompt: 'Abbina ogni funzione a una sua primitiva.',
          pairs: [
            [String.raw`$\frac1{\cos^2x}$`, String.raw`$\tan x$`],
            [String.raw`$\frac1{\sqrt{1-x^2}}$`, String.raw`$\arcsin x$`],
            [String.raw`$\frac1{1+x^2}$`, String.raw`$\arctan x$`],
            [String.raw`$\sin x$`, String.raw`$-\cos x$`],
          ],
          explain: 'Ogni riga si verifica derivando la colonna di destra.',
        },
      ],
    },
    {
      id: 's11.immediati.L2',
      title: 'Integrali quasi immediati',
      cards: [
        {
          type: 'learn',
          title: 'La regola della catena al contrario',
          body: String.raw`Se nell'integranda vedo una funzione $f(x)$ **e la sua derivata** $f'(x)$:

- $\int f'(x)\,f(x)^\alpha\,dx=\dfrac{f(x)^{\alpha+1}}{\alpha+1}$ ($\alpha\neq-1$)
- $\int \dfrac{f'(x)}{f(x)}\,dx=\log|f(x)|$
- $\int f'(x)\,e^{f(x)}\,dx=e^{f(x)}$
- $\int f'(x)\cos f(x)\,dx=\sin f(x)$, $\int f'(x)\sin f(x)\,dx=-\cos f(x)$
- $\int \dfrac{f'(x)}{1+f(x)^2}\,dx=\arctan f(x)$

**Caso lineare** $f(x)=ax+b$: $\int g(ax+b)\,dx=\dfrac1a\,G(ax+b)$. Esempi: $\int e^{3x}=\frac{e^{3x}}3$, $\int\cos 2x=\frac{\sin2x}2$.

>! Se manca una **costante** la aggiusto ($\int x e^{x^2}=\frac12\int 2xe^{x^2}$). Se manca una **funzione di $x$** non posso farlo.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\int\frac{x}{1+x^2}\,dx$.`,
          steps: [
            String.raw`La derivata del denominatore è $2x$; al numeratore c'è $x=\frac12\cdot 2x$.`,
            String.raw`$\int\frac{x}{1+x^2}dx=\frac12\int\frac{2x}{1+x^2}dx$: è del tipo $\frac{f'}{f}$.`,
            {
              text: String.raw`$=\frac12\log(1+x^2)+c$ (il modulo non serve: $1+x^2>0$).`,
              ask: { type: 'expr', prompt: 'Scrivi una primitiva.', answer: '1/2*log(1+x^2)', upToConstant: true, _f: 'x/(1+x^2)', explain: String.raw`$\frac12\log(1+x^2)$. Non è $\arctan x$: quella ha numeratore $1$, non $x$.` },
            },
          ],
          result: String.raw`$\frac12\log(1+x^2)+c$`,
        },
        {
          id: 's11.immediati.L2.e1', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`$\int e^{3x}\,dx$`,
          answer: 'e^(3x)/3', _f: 'e^(3x)',
          explain: String.raw`Caso lineare: $\frac13e^{3x}$. Verifica: $(\frac13e^{3x})'=e^{3x}$. Errore tipico: $3e^{3x}$ (quella è la derivata).`,
        },
        {
          id: 's11.immediati.L2.e2', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`$\int\cos(2x)\,dx$`,
          answer: 'sin(2x)/2', _f: 'cos(2x)',
          explain: String.raw`$\frac12\sin(2x)$: divido per il coefficiente di $x$.`,
        },
        {
          id: 's11.immediati.L2.e3', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`$\int\frac{dx}{2x+1}$ (per $x>-\frac12$)`,
          answer: 'log(2x+1)/2', _f: '1/(2x+1)',
          explain: String.raw`$\frac12\log|2x+1|$. Errore tipico: dimenticare il fattore $\frac12$.`,
        },
        {
          id: 's11.immediati.L2.e4', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\int(3x-1)^4\,dx$`,
          answer: '(3x-1)^5/15', _f: '(3x-1)^4',
          explain: String.raw`$\frac13\cdot\frac{(3x-1)^5}{5}=\frac{(3x-1)^5}{15}$. Sviluppare la potenza funziona ma è lento.`,
        },
        {
          id: 's11.immediati.L2.e5', type: 'expr', level: 2, upToConstant: true, domain: [0.1, 1.4],
          prompt: String.raw`$\int\tan x\,dx$ (per $0<x<\frac\pi2$)`,
          answer: '-log(cos(x))', _f: 'tan(x)',
          explain: String.raw`$\tan x=\frac{\sin x}{\cos x}=-\frac{(\cos x)'}{\cos x}$: primitiva $-\log|\cos x|$. Errore tipico: $\frac1{\cos^2x}$, che è la **derivata** di $\tan x$.`,
        },
        {
          id: 's11.immediati.L2.e6', type: 'expr', level: 1, upToConstant: true, domain: [-1.5, 1.5],
          prompt: String.raw`$\int 2x\,e^{x^2}\,dx$`,
          answer: 'e^(x^2)', _f: '2x*e^(x^2)',
          explain: String.raw`$2x$ è la derivata di $x^2$: tipo $f'e^f$, primitiva $e^{x^2}$.`,
        },
        {
          id: 's11.immediati.L2.e7', type: 'expr', level: 2, upToConstant: true, domain: [-1.5, 1.5],
          prompt: String.raw`$\int\frac{\cos x}{1+\sin^2x}\,dx$`,
          answer: 'atan(sin(x))', _f: 'cos(x)/(1+sin(x)^2)',
          explain: String.raw`Con $f=\sin x$, $f'=\cos x$: tipo $\frac{f'}{1+f^2}$, primitiva $\arctan(\sin x)$.`,
        },
        {
          id: 's11.immediati.L2.e8', type: 'expr', level: 2, upToConstant: true, domain: [0.5, 3],
          prompt: String.raw`$\int\frac{\log x}{x}\,dx$`,
          answer: 'log(x)^2/2', _f: 'log(x)/x',
          explain: String.raw`$\frac1x$ è la derivata di $\log x$: tipo $f'f$, primitiva $\frac{\log^2x}2$.`,
        },
        {
          id: 's11.immediati.L2.e9', type: 'mcq', level: 2,
          prompt: String.raw`$\int\frac{dx}{4+x^2}=\;?$`,
          options: [String.raw`$\frac12\arctan\frac x2+c$`, String.raw`$\arctan\frac x2+c$`, String.raw`$\frac14\arctan\frac x2+c$`, String.raw`$\frac{\log(4+x^2)}{2x}+c$`],
          answer: 0,
          explain: String.raw`$\frac1{4+x^2}=\frac14\cdot\frac1{1+(x/2)^2}$. Con $f=\frac x2$, $f'=\frac12$: $\frac14\cdot 2\arctan\frac x2=\frac12\arctan\frac x2$. In generale $\int\frac{dx}{a^2+x^2}=\frac1a\arctan\frac xa$. L'ultima opzione "divide per la derivata dell'interno", che non è lecito.`,
        },
        {
          id: 's11.immediati.L2.e10', type: 'mcq', level: 2,
          prompt: String.raw`$\int\frac{dx}{x\log x}$ (per $x>1$) $=\;?$`,
          options: [String.raw`$\log(\log x)+c$`, String.raw`$\frac{\log^2x}2+c$`, String.raw`$\log x\cdot\log|x|+c$`, String.raw`$-\frac1{\log x}+c$`],
          answer: 0,
          explain: String.raw`$\frac{1/x}{\log x}=\frac{f'}{f}$ con $f=\log x$: primitiva $\log|\log x|$. $\frac{\log^2x}2$ è la primitiva di $\frac{\log x}x$; $-\frac1{\log x}$ quella di $\frac1{x\log^2x}$.`,
        },
      ],
    },
    {
      id: 's11.immediati.L3',
      title: 'Decomposizione e integrali definiti',
      cards: [
        {
          type: 'learn',
          title: 'Decomposizione lineare',
          body: String.raw`Molti integrali diventano immediati dopo un passaggio algebrico che li **spezza in somma**:

- dividere termine a termine: $\frac{(x+1)^2}{x}=x+2+\frac1x$;
- aggiungere e togliere: $\frac{x^2}{1+x^2}=\frac{1+x^2-1}{1+x^2}=1-\frac1{1+x^2}$;
- formule trigonometriche: $\sin^2x=\frac{1-\cos2x}2$, $\cos^2x=\frac{1+\cos2x}2$, $\sin x\cos x=\frac{\sin 2x}2$;
- separare un numeratore: $\frac{x+1}{x^2+1}=\frac{x}{x^2+1}+\frac1{x^2+1}$.

Poi si usa la **formula fondamentale** $\int_a^bf=G(b)-G(a)$ per gli integrali definiti.

>! La formula fondamentale richiede $f$ **continua su tutto** $[a,b]$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\int_1^2\frac{(x+1)^2}{x}\,dx$.`,
          steps: [
            String.raw`Sviluppo: $\frac{x^2+2x+1}{x}=x+2+\frac1x$.`,
            String.raw`Primitiva: $\frac{x^2}2+2x+\log x$ (su $[1,2]$ è $x>0$).`,
            {
              text: String.raw`$\left(2+4+\log2\right)-\left(\frac12+2+0\right)=\frac72+\log2$.`,
              ask: { type: 'num', prompt: 'Valore dell\'integrale?', answer: '7/2+log(2)', _int: ['(x+1)^2/x', 1, 2], explain: String.raw`$G(2)-G(1)=(6+\log 2)-\frac52=\frac72+\log2$.` },
            },
          ],
          result: String.raw`$\frac72+\log 2$`,
        },
        {
          id: 's11.immediati.L3.e1', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\int\frac{x^2}{1+x^2}\,dx$`,
          answer: 'x-atan(x)', _f: 'x^2/(1+x^2)',
          explain: String.raw`Aggiungo e tolgo $1$: $\frac{x^2}{1+x^2}=1-\frac1{1+x^2}$. Primitiva $x-\arctan x$.`,
        },
        {
          id: 's11.immediati.L3.e2', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\int\sin^2x\,dx$`,
          answer: 'x/2-sin(2x)/4', _f: 'sin(x)^2',
          explain: String.raw`$\sin^2x=\frac{1-\cos 2x}{2}$: primitiva $\frac x2-\frac{\sin2x}4$. Errore tipico: $\frac{\sin^3x}{3}$ (manca il fattore $\cos x$ per usare $f'f^2$).`,
        },
        {
          id: 's11.immediati.L3.e3', type: 'num', level: 1,
          prompt: String.raw`$\displaystyle\int_0^1\frac{x}{1+x^2}\,dx$`,
          answer: 'log(2)/2', _int: ['x/(1+x^2)', 0, 1],
          explain: String.raw`$\left[\frac12\log(1+x^2)\right]_0^1=\frac12\log2-0$.`,
        },
        {
          id: 's11.immediati.L3.e4', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^{\pi/2}\cos^2x\,dx$`,
          answer: 'pi/4', _int: ['cos(x)^2', 0, 'pi/2'],
          explain: String.raw`$\cos^2x=\frac{1+\cos2x}2$: $\left[\frac x2+\frac{\sin2x}4\right]_0^{\pi/2}=\frac\pi4$.`,
        },
        {
          id: 's11.immediati.L3.e5', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^{\pi/4}\tan x\,dx$`,
          answer: 'log(2)/2', _int: ['tan(x)', 0, 'pi/4'],
          explain: String.raw`$\left[-\log\cos x\right]_0^{\pi/4}=-\log\frac{\sqrt2}2=\log\sqrt2=\frac12\log2$.`,
        },
        {
          id: 's11.immediati.L3.e6', type: 'num', level: 3,
          prompt: String.raw`$\displaystyle\int_0^1\frac{x+1}{x^2+1}\,dx$`,
          answer: 'log(2)/2+pi/4', _int: ['(x+1)/(x^2+1)', 0, 1],
          explain: String.raw`Separo: $\frac{x}{x^2+1}+\frac1{x^2+1}$. Primitiva $\frac12\log(x^2+1)+\arctan x$. Tra $0$ e $1$: $\frac12\log2+\frac\pi4$.`,
        },
        {
          id: 's11.immediati.L3.e7', type: 'tf', level: 3,
          prompt: String.raw`$\displaystyle\int_{-1}^{1}\frac{dx}{x^2}=\left[-\frac1x\right]_{-1}^{1}=-2$.`,
          answer: false,
          explain: String.raw`Falso, e il risultato negativo per un'integranda positiva lo tradisce. $\frac1{x^2}$ non è continua (né limitata) in $0\in[-1,1]$: la formula fondamentale non si applica. È un integrale improprio, e diverge a $+\infty$.`,
        },
        {
          id: 's11.immediati.L3.e8', type: 'mcq', level: 2,
          prompt: String.raw`$\displaystyle\int_{-2}^{2}x^3\cos x\,dx=\;?$`,
          options: ['$0$', String.raw`$2\int_0^2x^3\cos x\,dx$`, '$16$', 'non si può calcolare senza primitiva'],
          answer: 0,
          explain: String.raw`$x^3\cos x$ è **dispari** e l'intervallo è simmetrico: le aree con segno si annullano, l'integrale è $0$. Il doppio di metà intervallo vale per le funzioni **pari**.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's11.immediati.gen-poly', type: 'gen', level: 1,
      gen: (R) => {
        const n = R.int(2, 5), m = R.int(1, n - 1);
        const a = R.nz(-4, 4) * (n + 1), b = R.nz(-3, 3) * (m + 1), c = R.int(-6, 6);
        const coeffs = new Array(n + 1).fill(0);
        coeffs[0] = a; coeffs[n - m] = b; coeffs[n] += c;
        return {
          type: 'expr', upToConstant: true,
          prompt: String.raw`Calcola $\int\left(${H.poly(coeffs)}\right)dx$.`,
          answer: `${a / (n + 1)}*x^${n + 1}+(${b / (m + 1)})*x^${m + 1}+(${c})*x`, _f: H.polyStr(coeffs),
          explain: String.raw`Termine a termine con $\int x^k=\frac{x^{k+1}}{k+1}$: $${sumTex([[a, n + 1, `x^{${n + 1}}`], [b, m + 1, m + 1 === 1 ? 'x' : `x^{${m + 1}}`], [c, 1, 'x']])}+c$.`,
        };
      },
    },
    {
      id: 's11.immediati.gen-lin', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.pick([2, 3, 4, 5, -2, -3]), b = R.int(-3, 3);
        const u = H.lin(a, b), us = `(${a}*x+(${b}))`;
        const kinds = [
          { f: String.raw`e^{${u}}`, fs: `e^${us}`, F: `e^${us}/(${a})`, Ft: String.raw`${H.frac(1, a)}e^{${u}}` },
          { f: String.raw`\sin(${u})`, fs: `sin${us}`, F: `-cos${us}/(${a})`, Ft: String.raw`${H.frac(-1, a)}\cos(${u})` },
          { f: String.raw`\cos(${u})`, fs: `cos${us}`, F: `sin${us}/(${a})`, Ft: String.raw`${H.frac(1, a)}\sin(${u})` },
          { f: String.raw`(${u})^{3}`, fs: `${us}^3`, F: `${us}^4/(${4 * a})`, Ft: String.raw`${a < 0 ? '-' : ''}\frac{(${u})^{4}}{${4 * Math.abs(a)}}` },
        ];
        const k = R.pick(kinds);
        return {
          type: 'expr', upToConstant: true, domain: [0.1, 1.2],
          prompt: String.raw`Calcola $\int ${k.f}\,dx$.`,
          answer: k.F, _f: k.fs,
          explain: String.raw`Argomento lineare $${u}$: integro come se fosse $x$ e divido per il coefficiente $${a}$. Risultato: $${k.Ft}+c$.`,
        };
      },
    },
    {
      id: 's11.immediati.gen-flog', type: 'gen', level: 2,
      gen: (R) => {
        // k*(2x+p)/(x^2+p x+q) con discriminante negativo -> k log(x^2+px+q)
        const p = R.int(-3, 3), q = R.int(Math.floor((p * p) / 4) + 1, 6), k = R.nz(-3, 3);
        const den = H.poly([1, p, q]);
        const num = H.poly([2 * k, k * p]);
        return {
          type: 'expr', upToConstant: true, domain: [-1.5, 1.5],
          prompt: String.raw`Calcola $\displaystyle\int\frac{${num}}{${den}}\,dx$.`,
          answer: `${k}*log(x^2+(${p})*x+(${q}))`, _f: `(${2 * k}*x+(${k * p}))/(x^2+(${p})*x+(${q}))`,
          explain: String.raw`La derivata del denominatore è $${H.poly([2, p])}$ e il numeratore è $${k === 1 ? '' : k === -1 ? '-' : `${k}\\cdot`}(${H.poly([2, p])})$: tipo $\frac{f'}{f}$. Primitiva $${H.coef(k)}\log(${den})+c$ (il denominatore è sempre positivo, $\Delta<0$).`,
        };
      },
    },
    {
      id: 's11.immediati.gen-arctan', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(2, 5), k = R.nz(-3, 4);
        return {
          type: 'expr', upToConstant: true,
          prompt: String.raw`Calcola $\displaystyle\int\frac{${k}}{${a * a}+x^2}\,dx$.`,
          answer: `${k}/${a}*atan(x/${a})`, _f: `${k}/(${a * a}+x^2)`,
          explain: String.raw`$\frac{1}{${a * a}+x^2}=\frac1{${a * a}}\cdot\frac{1}{1+(x/${a})^2}$; con $f=\frac x{${a}}$, $f'=\frac1{${a}}$. Formula $\int\frac{dx}{a^2+x^2}=\frac1a\arctan\frac xa$: risultato $${H.frac(k, a)}\arctan\frac x{${a}}+c$.`,
        };
      },
    },
    {
      id: 's11.immediati.gen-def', type: 'gen', level: 2,
      gen: (R) => {
        const t = R.int(0, 2);
        if (t === 0) {
          const n = R.int(1, 4), k = R.int(1, 5);
          return { type: 'num', prompt: String.raw`$\displaystyle\int_1^{e^{${n}}}\frac{${k}}{x}\,dx$`, answer: String(k * n), _int: [`${k}/x`, 1, `e^${n}`], explain: String.raw`$\left[${H.coef(k)}\log x\right]_1^{e^{${n}}}=${k}\cdot${n}-0=${k * n}$.` };
        }
        if (t === 1) {
          const k = R.int(2, 4), kx = `${k}x`;
          return { type: 'num', prompt: String.raw`$\displaystyle\int_0^{\pi/${2 * k}}\sin(${kx})\,dx$`, answer: `1/${k}`, _int: [`sin(${k}x)`, 0, `pi/${2 * k}`], explain: String.raw`$\left[-\frac{\cos(${kx})}{${k}}\right]_0^{\pi/${2 * k}}=-\frac{\cos(\pi/2)}{${k}}+\frac{\cos 0}{${k}}=\frac{1}{${k}}$.` };
        }
        const a = R.int(2, 4), b = R.int(1, 4);
        // ∫_0^a b/(a^2+x^2) = b·π/(4a)
        const [pn, pd] = H.reduce(b, 4 * a);
        return { type: 'num', prompt: String.raw`$\displaystyle\int_0^{${a}}\frac{${b}}{${a * a}+x^2}\,dx$`, answer: `${b}*pi/(4*${a})`, _int: [`${b}/(${a * a}+x^2)`, 0, a], explain: String.raw`Primitiva $${H.frac(b, a)}\arctan\frac x{${a}}$. Tra $0$ e $${a}$: $${H.frac(b, a)}\left(\arctan 1-\arctan 0\right)=${H.frac(b, a)}\cdot\frac\pi4=${pn === 1 ? '' : pn}${pd === 1 ? '\\pi' : `\\frac{\\pi}{${pd}}`}$.` };
      },
    },
    {
      id: 's11.immediati.p1', type: 'expr', level: 2, upToConstant: true,
      prompt: String.raw`$\int\sin x\cos^3x\,dx$`,
      answer: '-cos(x)^4/4', _f: 'sin(x)*cos(x)^3',
      explain: String.raw`$\sin x=-(\cos x)'$: tipo $-f'f^3$, primitiva $-\frac{\cos^4x}4$.`,
    },
    {
      id: 's11.immediati.p2', type: 'expr', level: 2, upToConstant: true, domain: [0.5, 3],
      prompt: String.raw`$\int\frac{(\sqrt x+1)^2}{x}\,dx$`,
      answer: 'x+4*sqrt(x)+log(x)', _f: '(sqrt(x)+1)^2/x',
      explain: String.raw`$\frac{x+2\sqrt x+1}{x}=1+2x^{-1/2}+\frac1x$. Primitiva $x+4\sqrt x+\log x$.`,
    },
    {
      id: 's11.immediati.p3', type: 'expr', level: 2, upToConstant: true,
      prompt: String.raw`$\int\frac{e^x}{1+e^{2x}}\,dx$`,
      answer: 'atan(e^x)', _f: 'e^x/(1+e^(2x))',
      explain: String.raw`$e^{2x}=(e^x)^2$ e $(e^x)'=e^x$: tipo $\frac{f'}{1+f^2}$, primitiva $\arctan e^x$.`,
    },
    {
      id: 's11.immediati.p4', type: 'cloze', level: 1,
      prompt: 'Completa la tabella.',
      text: String.raw`$\int x^\alpha dx=$ [[0]] per $\alpha\neq-1$; $\int\frac{f'(x)}{f(x)}dx=$ [[1]]; $\int\frac{dx}{a^2+x^2}=$ [[2]].`,
      blanks: [
        { options: [String.raw`$\frac{x^{\alpha+1}}{\alpha+1}$`, String.raw`$\alpha x^{\alpha-1}$`, String.raw`$\frac{x^{\alpha}}{\alpha}$`], answer: 0 },
        { options: [String.raw`$\log|f(x)|$`, String.raw`$\frac{\log f(x)}{f'(x)}$`, String.raw`$f(x)\log f'(x)$`], answer: 0 },
        { options: [String.raw`$\frac1a\arctan\frac xa$`, String.raw`$\arctan\frac xa$`, String.raw`$a\arctan(ax)$`], answer: 0 },
      ],
      explain: String.raw`Verifica ciascuna derivando. $\alpha x^{\alpha-1}$ è la derivata di $x^\alpha$, non la primitiva.`,
    },
    {
      id: 's11.immediati.p5', type: 'mcq', level: 2,
      prompt: String.raw`Quale **non** è una primitiva di $\sin x\cos x$?`,
      options: [String.raw`$\sin x\cos x+c$`, String.raw`$\frac{\sin^2x}2$`, String.raw`$-\frac{\cos^2x}{2}$`, String.raw`$-\frac{\cos 2x}{4}$`],
      answer: 0,
      explain: String.raw`Le altre tre differiscono per costanti ($\sin^2x=1-\cos^2x$, $\cos2x=1-2\sin^2x$) e derivando danno $\sin x\cos x$. Primitive "diverse a vista" possono essere giuste: si controlla derivando.`,
    },
    {
      id: 's11.immediati.p6', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\int_0^1\frac{e^x}{1+e^x}\,dx$`,
      answer: 'log((1+e)/2)', _int: ['e^x/(1+e^x)', 0, 1],
      explain: String.raw`Tipo $\frac{f'}{f}$: $\left[\log(1+e^x)\right]_0^1=\log(1+e)-\log2=\log\frac{1+e}2$.`,
    },
  ],
  flashcards: [
    { id: 's11.immediati.fc1', kind: 'def', front: 'Primitiva di $f$ su un intervallo', back: String.raw`$G$ con $G'=f$ su $I$. Tutte le primitive sono $G+c$ (su un intervallo).` },
    { id: 's11.immediati.fc2', kind: 'formula', front: 'Primitive di $x^\\alpha$ e $\\frac1x$', back: String.raw`$\frac{x^{\alpha+1}}{\alpha+1}$ ($\alpha\neq-1$); $\log|x|$.` },
    { id: 's11.immediati.fc3', kind: 'formula', front: 'Primitive di $e^x$, $a^x$, $\\sin x$, $\\cos x$', back: String.raw`$e^x$; $\frac{a^x}{\log a}$; $-\cos x$; $\sin x$.` },
    { id: 's11.immediati.fc4', kind: 'formula', front: 'Primitive di $\\frac1{1+x^2}$, $\\frac1{\\sqrt{1-x^2}}$, $\\frac1{\\cos^2x}$', back: String.raw`$\arctan x$; $\arcsin x$; $\tan x$.` },
    { id: 's11.immediati.fc5', kind: 'formula', front: 'Integrali "quasi immediati"', back: String.raw`$\int f'f^\alpha=\frac{f^{\alpha+1}}{\alpha+1}$, $\int\frac{f'}f=\log|f|$, $\int f'e^f=e^f$, $\int\frac{f'}{1+f^2}=\arctan f$.` },
    { id: 's11.immediati.fc6', kind: 'formula', front: 'Argomento lineare', back: String.raw`$\int g(ax+b)\,dx=\frac1aG(ax+b)+c$.` },
    { id: 's11.immediati.fc7', kind: 'formula', front: '$\\int\\frac{dx}{a^2+x^2}$', back: String.raw`$\frac1a\arctan\frac xa+c$.` },
    { id: 's11.immediati.fc8', kind: 'formula', front: 'Primitive di $\\sin^2x$, $\\cos^2x$, $\\tan x$', back: String.raw`$\frac x2-\frac{\sin2x}4$; $\frac x2+\frac{\sin2x}4$; $-\log|\cos x|$.` },
    { id: 's11.immediati.fc9', kind: 'metodo', front: 'Funzioni pari e dispari su $[-a,a]$', back: String.raw`$f$ dispari ⇒ $\int_{-a}^af=0$; $f$ pari ⇒ $\int_{-a}^af=2\int_0^af$.` },
    { id: 's11.immediati.fc10', kind: 'errore', front: 'Errori tipici con le primitive', back: String.raw`$\int fg\ne\int f\int g$; $\int\sin=-\cos$ (segno); $\int e^{3x}=\frac{e^{3x}}3$, non $3e^{3x}$; formula fondamentale solo con $f$ continua su $[a,b]$.` },
  ],
};

// ---------------------------------------------------------------------------
// s11.parti · Integrazione per parti
// ---------------------------------------------------------------------------
const parti = {
  id: 's11.parti',
  title: 'Integrazione per parti',
  summary: String.raw`Usare $\int fg'=fg-\int f'g$: scegliere bene i ruoli, ripetere, e risolvere gli integrali "per ricorsione".`,
  prereq: ['s11.immediati', 's08.regole'],
  examRefs: ['Appello 15/01/2026 · Es. 1', 'Itinere 15/01/2026 · Es. 3', 'Appello 11/06/2026 · Es. 4', 'Appello 06/07/2026 · Es. 4'],
  lessons: [
    {
      id: 's11.parti.L1',
      title: 'La formula per parti',
      cards: [
        {
          type: 'learn',
          title: 'Da dove viene',
          body: String.raw`Dalla derivata del prodotto $(fg)'=f'g+fg'$, integrando:

>* **Integrazione per parti.** $\displaystyle\int f(x)\,g'(x)\,dx=f(x)\,g(x)-\int f'(x)\,g(x)\,dx$
>* e per gli integrali definiti: $\displaystyle\int_a^b fg'=\big[fg\big]_a^b-\int_a^b f'g$.

Si usa per i **prodotti**. Scelgo:
- $f$ = **fattore finito**, da derivare: polinomi, $\log x$, $\arctan x$ (derivandoli si semplificano);
- $g'$ = **fattore differenziale**, da integrare: $e^x$, $\sin x$, $\cos x$, potenze $x^\alpha$ quando c'è un $\log$.

L'obiettivo: il nuovo integrale $\int f'g$ deve essere **più facile** di quello di partenza.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\int xe^x\\,dx$',
          problem: String.raw`Calcola $\int xe^x\,dx$.`,
          steps: [
            String.raw`$f=x$ (derivata $1$), $g'=e^x$ (primitiva $g=e^x$).`,
            String.raw`$\int xe^x\,dx=xe^x-\int1\cdot e^x\,dx$.`,
            {
              text: String.raw`$=xe^x-e^x+c=(x-1)e^x+c$.`,
              ask: { type: 'expr', prompt: 'Scrivi una primitiva.', answer: '(x-1)*e^x', upToConstant: true, _f: 'x*e^x', explain: String.raw`$xe^x-e^x$. Verifica: $((x-1)e^x)'=e^x+(x-1)e^x=xe^x$.` },
            },
          ],
          result: String.raw`$\int xe^x\,dx=(x-1)e^x+c$`,
        },
        {
          id: 's11.parti.L1.e1', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`$\int x\cos x\,dx$`,
          answer: 'x*sin(x)+cos(x)', _f: 'x*cos(x)',
          explain: String.raw`$f=x$, $g'=\cos x$, $g=\sin x$: $x\sin x-\int\sin x=x\sin x+\cos x$. Attenzione al segno: $-\int\sin x=+\cos x$.`,
        },
        {
          id: 's11.parti.L1.e2', type: 'mcq', level: 1,
          prompt: String.raw`Per $\int x\,e^{2x}\,dx$ qual è la scelta giusta?`,
          options: [String.raw`$f=x$ da derivare, $g'=e^{2x}$ da integrare`, String.raw`$f=e^{2x}$ da derivare, $g'=x$ da integrare`, 'Non serve: è immediato', String.raw`Sostituzione $t=x^2$`],
          answer: 0,
          explain: String.raw`Derivando $x$ diventa $1$ e resta $\int\frac12e^{2x}$, immediato. Con la scelta opposta comparirebbe $\int\frac{x^2}{2}\cdot2e^{2x}$: peggio di prima. Non è immediato perché $x$ non è la derivata di $2x$ a meno di costanti... e moltiplica, non compone.`,
        },
        {
          type: 'example',
          title: "Esempio d'esame: $\\int x\\log x\\,dx$",
          problem: String.raw`Calcola $\int x\log x\,dx$ (serve per l'area dell'Appello 15/01/2026).`,
          steps: [
            String.raw`Il $\log$ va **derivato**: $f=\log x$, $f'=\frac1x$; $g'=x$, $g=\frac{x^2}2$.`,
            String.raw`$\int x\log x\,dx=\frac{x^2}2\log x-\int\frac{x^2}2\cdot\frac1x\,dx=\frac{x^2}2\log x-\int\frac x2\,dx$.`,
            {
              text: String.raw`$=\frac{x^2}2\log x-\frac{x^2}4+c$.`,
              ask: { type: 'expr', prompt: 'Scrivi una primitiva.', answer: 'x^2/2*log(x)-x^2/4', upToConstant: true, domain: [0.5, 3], _f: 'x*log(x)', explain: String.raw`$\int\frac x2=\frac{x^2}4$.` },
            },
          ],
          result: String.raw`$\int x\log x\,dx=\frac{x^2}2\log x-\frac{x^2}4+c$`,
        },
        {
          id: 's11.parti.L1.e3', type: 'expr', level: 2, upToConstant: true, domain: [0.5, 3],
          prompt: String.raw`$\int\log x\,dx$ (suggerimento: $\log x=1\cdot\log x$)`,
          answer: 'x*log(x)-x', _f: 'log(x)',
          explain: String.raw`$f=\log x$, $g'=1$, $g=x$: $x\log x-\int x\cdot\frac1x\,dx=x\log x-x$. Il trucco del fattore $1$ funziona anche per $\arctan x$.`,
        },
        {
          id: 's11.parti.L1.e4', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\int x\sin(2x)\,dx$`,
          answer: '-x*cos(2x)/2+sin(2x)/4', _f: 'x*sin(2x)',
          explain: String.raw`$g'=\sin2x$, $g=-\frac{\cos2x}2$: $-\frac{x\cos2x}{2}+\frac12\int\cos2x=-\frac{x\cos2x}2+\frac{\sin2x}4$.`,
        },
        {
          id: 's11.parti.L1.e5', type: 'expr', level: 2, upToConstant: true, domain: [0.5, 3],
          prompt: String.raw`$\int x^2\log x\,dx$`,
          answer: 'x^3/3*log(x)-x^3/9', _f: 'x^2*log(x)',
          explain: String.raw`$f=\log x$, $g=\frac{x^3}3$: $\frac{x^3}3\log x-\int\frac{x^2}3=\frac{x^3}3\log x-\frac{x^3}9$.`,
        },
        {
          id: 's11.parti.L1.e6', type: 'num', level: 1,
          prompt: String.raw`$\displaystyle\int_0^1xe^x\,dx$`,
          answer: '1', _int: ['x*e^x', 0, 1],
          explain: String.raw`$\left[(x-1)e^x\right]_0^1=0-(-1)=1$.`,
        },
        {
          id: 's11.parti.L1.e7', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_1^e\log x\,dx$`,
          answer: '1', _int: ['log(x)', 1, 'e'],
          explain: String.raw`$\left[x\log x-x\right]_1^e=(e-e)-(0-1)=1$.`,
        },
        {
          id: 's11.parti.L1.e8', type: 'tf', level: 1,
          prompt: String.raw`In $\int x^3\log x\,dx$ conviene derivare $x^3$ e integrare $\log x$.`,
          answer: false,
          explain: String.raw`Falso: il $\log$ si **deriva** (diventa $\frac1x$) e $x^3$ si integra. Integrare $\log x$ produrrebbe $x\log x-x$, più complicato.`,
        },
      ],
    },
    {
      id: 's11.parti.L2',
      title: 'Due volte e "per ricorsione"',
      cards: [
        {
          type: 'learn',
          title: 'Ripetere e tornare al punto di partenza',
          body: String.raw`- Con un polinomio di grado $n$ per $e^x$, $\sin x$, $\cos x$ applico la formula $n$ volte: ogni volta il grado scende di $1$.
- Con $e^{ax}\sin bx$ o $e^{ax}\cos bx$ nessun fattore si semplifica. Applico la formula **due volte** (stessa scelta dei ruoli!) e ritrovo l'integrale di partenza $I$: ottengo un'**equazione** del tipo $I=A-I$, da cui $I=\frac A2$. È l'integrazione **per ricorsione**.

>! Al secondo passaggio non invertire i ruoli: torneresti indietro e otterresti $I=I$.`,
        },
        {
          type: 'example',
          title: 'Esempio d\'esame: $\\int e^{-x}\\sin x\\,dx$',
          problem: String.raw`Calcola $I=\int e^{-x}\sin x\,dx$ (Appello 06/07/2026).`,
          steps: [
            String.raw`$f=\sin x$, $g'=e^{-x}$, $g=-e^{-x}$: $I=-e^{-x}\sin x+\int e^{-x}\cos x\,dx$.`,
            String.raw`Di nuovo con $f=\cos x$, $g'=e^{-x}$: $\int e^{-x}\cos x\,dx=-e^{-x}\cos x-\int e^{-x}\sin x\,dx=-e^{-x}\cos x-I$.`,
            {
              text: String.raw`Quindi $I=-e^{-x}\sin x-e^{-x}\cos x-I$, cioè $2I=-e^{-x}(\sin x+\cos x)$.`,
              ask: { type: 'mcq', prompt: 'Che equazione ottieni per $I$?', options: [String.raw`$2I=-e^{-x}(\sin x+\cos x)$`, String.raw`$0=-e^{-x}(\sin x+\cos x)$`, String.raw`$I=I$`], answer: 0, explain: String.raw`$I$ compare a destra con segno $-$: porto a sinistra e ottengo $2I$.` },
            },
            {
              text: String.raw`$I=-\frac12e^{-x}(\sin x+\cos x)+c$.`,
              ask: { type: 'expr', prompt: 'Scrivi $I$ (senza costante).', answer: '-e^(-x)*(sin(x)+cos(x))/2', upToConstant: true, _f: 'e^(-x)*sin(x)', explain: String.raw`Divido per $2$. Verifica derivando: $\frac12e^{-x}(\sin x+\cos x)-\frac12e^{-x}(\cos x-\sin x)=e^{-x}\sin x$.` },
            },
          ],
          result: String.raw`$\int e^{-x}\sin x\,dx=-\frac12e^{-x}(\sin x+\cos x)+c$`,
        },
        {
          id: 's11.parti.L2.e1', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\int x^2e^x\,dx$`,
          answer: '(x^2-2x+2)*e^x', _f: 'x^2*e^x',
          explain: String.raw`Due volte: $x^2e^x-2\int xe^x=x^2e^x-2(x-1)e^x=(x^2-2x+2)e^x$.`,
        },
        {
          id: 's11.parti.L2.e2', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\int e^x\cos x\,dx$`,
          answer: 'e^x*(sin(x)+cos(x))/2', _f: 'e^x*cos(x)',
          explain: String.raw`$I=e^x\cos x+\int e^x\sin x=e^x\cos x+e^x\sin x-I$ (entrambe le volte $g'=e^x$). Quindi $I=\frac{e^x(\sin x+\cos x)}{2}$.`,
        },
        {
          id: 's11.parti.L2.e3', type: 'mcq', level: 2,
          prompt: String.raw`Calcolando $\int e^{x}\sin x\,dx$, al primo passo scelgo $g'=e^x$; al secondo scelgo invece $f=e^x$ e $g'=\cos x$. Che cosa succede?`,
          options: [String.raw`Ottengo $I=I$: un'identità inutile`, String.raw`Ottengo $2I=e^x(\sin x-\cos x)$`, 'Ottengo un integrale immediato', String.raw`Ottengo $I=0$`],
          answer: 0,
          explain: String.raw`Invertire i ruoli "disfa" il primo passaggio: si torna esattamente al punto di partenza. Per la ricorsione la scelta deve restare la stessa ($g'=e^x$ entrambe le volte).`,
        },
        {
          type: 'example',
          title: 'Esempio: $\\int\\arctan x\\,dx$',
          problem: String.raw`Calcola $\int\arctan x\,dx$.`,
          steps: [
            String.raw`$f=\arctan x$, $f'=\frac1{1+x^2}$; $g'=1$, $g=x$.`,
            String.raw`$\int\arctan x\,dx=x\arctan x-\int\frac{x}{1+x^2}dx$.`,
            {
              text: String.raw`$=x\arctan x-\frac12\log(1+x^2)+c$.`,
              ask: { type: 'expr', prompt: String.raw`Quanto vale $\int\frac{x}{1+x^2}dx$?`, answer: 'log(1+x^2)/2', upToConstant: true, _f: 'x/(1+x^2)', explain: String.raw`Tipo $\frac{f'}f$ a meno del fattore $\frac12$.` },
            },
          ],
          result: String.raw`$x\arctan x-\frac12\log(1+x^2)+c$`,
        },
        {
          id: 's11.parti.L2.e4', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\int x\arctan x\,dx$`,
          answer: '((x^2+1)*atan(x)-x)/2', _f: 'x*atan(x)',
          explain: String.raw`$g=\frac{x^2}2$: $\frac{x^2}2\arctan x-\frac12\int\frac{x^2}{1+x^2}=\frac{x^2}2\arctan x-\frac12(x-\arctan x)$.`,
        },
        {
          id: 's11.parti.L2.e5', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^\pi e^{-x}\sin x\,dx$`,
          answer: '(1+e^(-pi))/2', _int: ['e^(-x)*sin(x)', 0, 'pi'],
          explain: String.raw`$\left[-\frac12e^{-x}(\sin x+\cos x)\right]_0^\pi=-\frac12e^{-\pi}(0-1)+\frac12(0+1)=\frac{1+e^{-\pi}}2$.`,
        },
        {
          id: 's11.parti.L2.e6', type: 'expr', level: 3, upToConstant: true, domain: [0.5, 3],
          prompt: String.raw`$\int\log^2x\,dx$`,
          answer: 'x*log(x)^2-2x*log(x)+2x', _f: 'log(x)^2',
          explain: String.raw`$g'=1$: $x\log^2x-\int x\cdot\frac{2\log x}{x}=x\log^2x-2(x\log x-x)$.`,
        },
        {
          id: 's11.parti.L2.e7', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\int x^2\cos x\,dx$`,
          answer: 'x^2*sin(x)+2x*cos(x)-2sin(x)', _f: 'x^2*cos(x)',
          explain: String.raw`$x^2\sin x-2\int x\sin x$ e $\int x\sin x=-x\cos x+\sin x$. Totale $x^2\sin x+2x\cos x-2\sin x$.`,
        },
      ],
    },
    {
      id: 's11.parti.L3',
      title: "Per parti all'esame",
      cards: [
        {
          type: 'learn',
          title: 'Lo schema dei temi',
          body: String.raw`Nei temi recenti compaiono integrande come
$$\frac{\log(1+t)}{t^2},\qquad\frac{\arctan x}{x^2},\qquad x\log x,\qquad e^{-x}\sin x.$$
Strategia per le prime due: **integro la potenza** ($\int\frac{dx}{x^2}=-\frac1x$) e **derivo** $\log$ o $\arctan$. Il nuovo integrale è una **funzione razionale**, che si spezza in fratti semplici:
$$\frac{1}{t(1+t)}=\frac1t-\frac1{1+t},\qquad \frac1{x(1+x^2)}=\frac1x-\frac{x}{1+x^2}.$$`,
        },
        {
          type: 'example',
          title: 'Esempio: $\\int\\frac{\\arctan x}{x^2}dx$ (Appello 11/06/2026)',
          problem: String.raw`Calcola una primitiva di $\frac{\arctan x}{x^2}$ per $x>0$.`,
          steps: [
            String.raw`$f=\arctan x$, $g'=\frac1{x^2}$, $g=-\frac1x$: $-\frac{\arctan x}x+\int\frac{dx}{x(1+x^2)}$.`,
            {
              text: String.raw`Fratti semplici: $\frac1{x(1+x^2)}=\frac Ax+\frac{Bx+C}{1+x^2}$ con $A=1$, $B=-1$, $C=0$.`,
              ask: { type: 'tuple', prompt: String.raw`Trova $A,B,C$ in $\frac1{x(1+x^2)}=\frac Ax+\frac{Bx+C}{1+x^2}$.`, labels: ['A', 'B', 'C'], answer: ['1', '-1', '0'], explain: String.raw`$1=A(1+x^2)+(Bx+C)x$: per $x=0$, $A=1$; coefficiente di $x^2$: $A+B=0$; di $x$: $C=0$.` },
            },
            String.raw`$\int\left(\frac1x-\frac x{1+x^2}\right)dx=\log x-\frac12\log(1+x^2)$.`,
            String.raw`Totale: $-\frac{\arctan x}x+\log x-\frac12\log(1+x^2)+c$.`,
          ],
          result: String.raw`$\int\frac{\arctan x}{x^2}dx=-\frac{\arctan x}x+\log x-\frac12\log(1+x^2)+c$`,
        },
        {
          id: 's11.parti.L3.e1', type: 'expr', level: 3, upToConstant: true, domain: [0.5, 3],
          prompt: String.raw`Scrivi una primitiva di $\frac{\arctan x}{x^2}$ per $x>0$.`,
          answer: '-atan(x)/x+log(x)-log(1+x^2)/2', _f: 'atan(x)/x^2', source: 'Appello 11/06/2026 · Es. 4',
          explain: String.raw`Per parti con $g=-\frac1x$, poi $\frac1{x(1+x^2)}=\frac1x-\frac{x}{1+x^2}$: $-\frac{\arctan x}x+\log x-\frac12\log(1+x^2)$.`,
        },
        {
          id: 's11.parti.L3.e2', type: 'problem', level: 3, points: 4, source: 'Itinere 15/01/2026 · Es. 3',
          prompt: String.raw`Sia $f(t)=\dfrac{\log(1+t)}{t^2}$, $t>0$. (a) Si calcoli una primitiva di $f$. (b) Si calcoli $\displaystyle\int_1^{+\infty}f(t)\,dt$.`,
          parts: [
            { type: 'expr', prompt: String.raw`(a) Una primitiva di $f$ (variabile $t$).`, answer: '-log(1+t)/t+log(t)-log(1+t)', vars: ['t'], domain: [0.5, 3], upToConstant: true, _f: 'log(1+t)/t^2', explain: String.raw`Per parti ($g=-\frac1t$): $-\frac{\log(1+t)}t+\int\frac{dt}{t(1+t)}$ e $\frac1{t(1+t)}=\frac1t-\frac1{1+t}$.` },
            { type: 'num', prompt: String.raw`(b) $\int_1^{+\infty}f(t)\,dt$`, answer: '2*log(2)', _int: ['log(1+x)/x^2', 1, 'inf'], explain: String.raw`$F(t)=-\frac{\log(1+t)}t+\log\frac{t}{1+t}\to0$ per $t\to+\infty$; $F(1)=-\log2-\log2=-2\log2$. Valore $0-(-2\log2)=2\log2$.` },
          ],
          solution: String.raw`**(a)** Per parti con $f=\log(1+t)$, $g'=\frac1{t^2}$, $g=-\frac1t$:
$$\int\frac{\log(1+t)}{t^2}dt=-\frac{\log(1+t)}{t}+\int\frac{dt}{t(1+t)}.$$
Poiché $\frac1{t(1+t)}=\frac1t-\frac1{1+t}$:
$$F(t)=-\frac{\log(1+t)}t+\log t-\log(1+t)+c.$$
**(b)** $F(t)=-\frac{\log(1+t)}t+\log\frac t{1+t}$. Per $t\to+\infty$: $\frac{\log(1+t)}t\to0$ e $\log\frac t{1+t}\to\log1=0$. $F(1)=-\log2+0-\log2=-2\log2$. Quindi $\int_1^{+\infty}f=\lim_{M\to+\infty}F(M)-F(1)=2\log2$.`,
        },
        {
          id: 's11.parti.L3.e3', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_1^e x\log x\,dx$`,
          answer: '(e^2+1)/4', _int: ['x*log(x)', 1, 'e'],
          explain: String.raw`$\left[\frac{x^2}2\log x-\frac{x^2}4\right]_1^e=\left(\frac{e^2}2-\frac{e^2}4\right)-\left(0-\frac14\right)=\frac{e^2+1}4$.`,
        },
        {
          id: 's11.parti.L3.e4', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^{\pi/2}x\cos x\,dx$`,
          answer: 'pi/2-1', _int: ['x*cos(x)', 0, 'pi/2'],
          explain: String.raw`$\left[x\sin x+\cos x\right]_0^{\pi/2}=\frac\pi2+0-(0+1)=\frac\pi2-1$.`,
        },
        {
          id: 's11.parti.L3.e5', type: 'order', level: 2,
          prompt: String.raw`Ordina i passi per calcolare $I=\int e^x\sin x\,dx$ per ricorsione. Scarta il passo sbagliato.`,
          steps: [
            String.raw`Scelgo $g'=e^x$, $f=\sin x$: $I=e^x\sin x-\int e^x\cos x\,dx$.`,
            String.raw`Di nuovo con $g'=e^x$, $f=\cos x$: $\int e^x\cos x\,dx=e^x\cos x+\int e^x\sin x\,dx=e^x\cos x+I$.`,
            String.raw`Sostituisco: $I=e^x\sin x-e^x\cos x-I$.`,
            String.raw`Risolvo: $I=\frac{e^x(\sin x-\cos x)}2+c$.`,
          ],
          distractors: [String.raw`Al secondo passo scelgo $f=e^x$ e $g'=\cos x$.`],
          explain: String.raw`La scelta dei ruoli resta la stessa nei due passaggi; poi si risolve l'equazione in $I$. Verifica: $\left(\frac{e^x(\sin x-\cos x)}2\right)'=\frac{e^x(\sin x-\cos x)+e^x(\cos x+\sin x)}2=e^x\sin x$.`,
        },
        {
          id: 's11.parti.L3.e6', type: 'expr', level: 3, upToConstant: true,
          prompt: String.raw`$\int\log(1+x^2)\,dx$`,
          answer: 'x*log(1+x^2)-2x+2*atan(x)', _f: 'log(1+x^2)',
          explain: String.raw`$g'=1$: $x\log(1+x^2)-\int\frac{2x^2}{1+x^2}dx$ e $\frac{2x^2}{1+x^2}=2-\frac2{1+x^2}$. Risultato $x\log(1+x^2)-2x+2\arctan x$.`,
        },
        {
          id: 's11.parti.L3.e7', type: 'mcq', level: 2,
          prompt: String.raw`Quale integrale **non** richiede l'integrazione per parti?`,
          options: [String.raw`$\int xe^{x^2}dx$`, String.raw`$\int xe^{x}dx$`, String.raw`$\int x\log x\,dx$`, String.raw`$\int e^x\sin x\,dx$`],
          answer: 0,
          explain: String.raw`In $\int xe^{x^2}$ il fattore $x$ è (metà) la derivata dell'esponente: è quasi immediato, $\frac12e^{x^2}$. Gli altri sono prodotti "veri" e servono le parti.`,
        },
        {
          id: 's11.parti.L3.e8', type: 'num', level: 3,
          prompt: String.raw`$\displaystyle\int_0^1\arctan x\,dx$`,
          answer: 'pi/4-log(2)/2', _int: ['atan(x)', 0, 1],
          explain: String.raw`$\left[x\arctan x-\frac12\log(1+x^2)\right]_0^1=\frac\pi4-\frac12\log2$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's11.parti.gen-exp', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3), b = R.int(-3, 3), k = R.pick([1, 2, 3, -1, -2]);
        // ∫(ax+b)e^{kx} = e^{kx}((ax+b)/k - a/k^2) = e^{kx}(a k x + b k - a)/k^2
        const ek = k === 1 ? 'e^{x}' : k === -1 ? 'e^{-x}' : `e^{${k}x}`;
        const p1 = a * k, p0 = b * k - a, d = k * k;
        const inner = H.poly([p1, p0]);
        return {
          type: 'expr', upToConstant: true, domain: [-1, 1.5],
          prompt: String.raw`Calcola $\int(${H.lin(a, b)})\,${ek}\,dx$.`,
          answer: `e^(${k}*x)*((${p1})*x+(${p0}))/${d}`, _f: `((${a})*x+(${b}))*e^(${k}*x)`,
          explain: String.raw`Per parti con $f=${H.lin(a, b)}$, $g=${H.frac(1, k)}${ek}$: $${H.frac(1, k)}(${H.lin(a, b)})${ek}-${H.frac(a, k)}\int ${ek}\,dx$. Risultato: $${d === 1 ? '' : `\\frac{1}{${d}}`}(${inner})${ek}+c$.`,
        };
      },
    },
    {
      id: 's11.parti.gen-trig', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3), b = R.int(-2, 2), k = R.int(1, 3), isSin = R.chance();
        const kx = k === 1 ? 'x' : `${k}x`, L = H.lin(a, b), Ls = `((${a})*x+(${b}))`;
        // sin: -(ax+b)cos(kx)/k + a sin(kx)/k^2 ; cos: (ax+b) sin(kx)/k + a cos(kx)/k^2
        const ans = isSin ? `-${Ls}*cos(${k}x)/${k}+(${a})*sin(${k}x)/${k * k}` : `${Ls}*sin(${k}x)/${k}+(${a})*cos(${k}x)/${k * k}`;
        const t1 = isSin ? String.raw`-${H.frac(1, k) === '1' ? '' : H.frac(1, k)}(${L})\cos(${kx})` : String.raw`${H.frac(1, k) === '1' ? '' : H.frac(1, k)}(${L})\sin(${kx})`;
        const t2c = H.frac(a, k * k);
        const t2 = `${a > 0 ? '+' : ''}${t2c === '1' ? '' : t2c === '-1' ? '-' : t2c}\\${isSin ? 'sin' : 'cos'}(${kx})`;
        return {
          type: 'expr', upToConstant: true,
          prompt: String.raw`Calcola $\int(${L})${'\\'}${isSin ? 'sin' : 'cos'}(${kx})\,dx$.`,
          answer: ans, _f: `${Ls}*${isSin ? 'sin' : 'cos'}(${k}x)`,
          explain: String.raw`Per parti: derivo $${L}$ (derivata $${a}$) e integro $${'\\'}${isSin ? 'sin' : 'cos'}(${kx})$. Risultato: $${t1}${t2}+c$.`,
        };
      },
    },
    {
      id: 's11.parti.gen-log', type: 'gen', level: 2,
      gen: (R) => {
        const n = R.int(1, 4), c = R.nz(-3, 3) * (n + 1);
        // ∫ c x^n log x = c x^{n+1}/(n+1) log x - c x^{n+1}/(n+1)^2
        const xn = n === 1 ? 'x' : `x^{${n}}`, xn1 = `x^{${n + 1}}`;
        return {
          type: 'expr', upToConstant: true, domain: [0.5, 3],
          prompt: String.raw`Calcola $\int ${H.coef(c)}${xn}\log x\,dx$.`,
          answer: `${c / (n + 1)}*x^${n + 1}*log(x)-(${c})*x^${n + 1}/${(n + 1) ** 2}`, _f: `${c}*x^${n}*log(x)`,
          explain: String.raw`Il $\log$ si deriva: $f=\log x$, $g=${sumTex([[c, n + 1, xn1]])}$. Poi $\int g\cdot\frac1x=\int ${sumTex([[c, n + 1, n === 1 ? 'x' : `x^{${n}}`]])}\,dx$. Risultato: $${sumTex([[c, n + 1, xn1 + '\\log x'], [-c, (n + 1) ** 2, xn1]])}+c$.`,
        };
      },
    },
    {
      id: 's11.parti.gen-ricorsione', type: 'gen', level: 3,
      gen: (R) => {
        const a = R.pick([1, -1, 2, -2]), b = R.pick([1, 2, 3]), isSin = R.chance();
        const ea = a === 1 ? 'e^{x}' : a === -1 ? 'e^{-x}' : `e^{${a}x}`, bx = b === 1 ? 'x' : `${b}x`;
        const D = a * a + b * b;
        // sin: e^{ax}(a sin bx - b cos bx)/D ; cos: e^{ax}(a cos bx + b sin bx)/D
        const ans = isSin ? `e^(${a}*x)*((${a})*sin(${b}x)-(${b})*cos(${b}x))/${D}` : `e^(${a}*x)*((${a})*cos(${b}x)+(${b})*sin(${b}x))/${D}`;
        const inner = isSin ? `${H.coef(a)}\\sin(${bx})-${H.coef(b)}\\cos(${bx})` : `${H.coef(a)}\\cos(${bx})+${H.coef(b)}\\sin(${bx})`;
        return {
          type: 'expr', upToConstant: true, domain: [-1, 1.5],
          prompt: String.raw`Calcola $\int ${ea}${'\\'}${isSin ? 'sin' : 'cos'}(${bx})\,dx$.`,
          answer: ans, _f: `e^(${a}*x)*${isSin ? 'sin' : 'cos'}(${b}x)`,
          explain: String.raw`Per ricorsione: due volte per parti integrando sempre $${ea}$. Si ottiene $I\left(1+\frac{${b * b}}{${a * a}}\right)=\dots$, cioè $I=\frac{${ea}\left(${inner}\right)}{${D}}+c$. Verifica derivando.`.replace('+-', '-'),
        };
      },
    },
    {
      id: 's11.parti.gen-def', type: 'gen', level: 2,
      gen: (R) => {
        const n = R.int(1, 3);
        // ∫_1^e x^n log x = (n e^{n+1} + 1)/(n+1)^2
        const xn = n === 1 ? 'x' : `x^{${n}}`, d = (n + 1) ** 2;
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\int_1^e ${xn}\log x\,dx$`,
          answer: `(${n}*e^${n + 1}+1)/${d}`, _int: [`x^${n}*log(x)`, 1, 'e'],
          explain: String.raw`Primitiva $\frac{x^{${n + 1}}}{${n + 1}}\log x-\frac{x^{${n + 1}}}{${d}}$. In $e$: $\frac{e^{${n + 1}}}{${n + 1}}-\frac{e^{${n + 1}}}{${d}}=\frac{${n === 1 ? '' : n}e^{${n + 1}}}{${d}}$; in $1$: $-\frac1{${d}}$. Valore $\frac{${n === 1 ? '' : n}e^{${n + 1}}+1}{${d}}$.`,
        };
      },
    },
    {
      id: 's11.parti.p1', type: 'cloze', level: 1,
      prompt: 'Completa la formula.',
      text: String.raw`$\int f(x)g'(x)\,dx=$ [[0]] $-\int$ [[1]] $dx$. Conviene scegliere come $f$ (da derivare) [[2]].`,
      blanks: [
        { options: ['$f(x)g(x)$', "$f'(x)g'(x)$", "$f(x)g'(x)$"], answer: 0 },
        { options: ["$f'(x)g(x)$", "$f(x)g'(x)$", "$f'(x)g'(x)$"], answer: 0 },
        { options: ['$\\log x$ o $\\arctan x$ o un polinomio', '$e^x$', '$\\sin x$'], answer: 0 },
      ],
      explain: String.raw`Viene da $(fg)'=f'g+fg'$. Si derivano i fattori che derivando si semplificano.`,
    },
    {
      id: 's11.parti.p2', type: 'open', level: 2, points: 2,
      prompt: String.raw`Ricavare la formula di integrazione per parti e spiegare come si scelgono i fattori, con un esempio.`,
      answer: String.raw`Da $(fg)'=f'g+fg'$, integrando (teorema fondamentale): $fg=\int f'g+\int fg'$, cioè $\int fg'=fg-\int f'g$. Si sceglie come $f$ il fattore che derivando si semplifica (polinomi, $\log$, $\arctan$) e come $g'$ quello di cui si sa la primitiva ($e^x$, $\sin$, $\cos$). Esempio: $\int x\log x=\frac{x^2}2\log x-\int\frac x2=\frac{x^2}2\log x-\frac{x^2}4+c$.`,
      rubric: ['Parte dalla derivata del prodotto', 'Scrive correttamente la formula', 'Criterio di scelta dei fattori', 'Esempio svolto correttamente'],
    },
    {
      id: 's11.parti.p3', type: 'expr', level: 3, upToConstant: true, domain: [0.5, 3],
      prompt: String.raw`$\int\frac{\log x}{x^2}\,dx$`,
      answer: '-(log(x)+1)/x', _f: 'log(x)/x^2',
      explain: String.raw`$g=-\frac1x$: $-\frac{\log x}x+\int\frac1{x^2}=-\frac{\log x}x-\frac1x$.`,
    },
    {
      id: 's11.parti.p4', type: 'tf', level: 2,
      prompt: String.raw`$\int e^{-x}\sin x\,dx=-\frac12e^{-x}(\sin x+\cos x)+c$.`,
      answer: true,
      explain: String.raw`Vero: derivando $-\frac12e^{-x}(\sin x+\cos x)$ si ottiene $\frac12e^{-x}(\sin x+\cos x)-\frac12e^{-x}(\cos x-\sin x)=e^{-x}\sin x$.`,
    },
    {
      id: 's11.parti.p5', type: 'num', level: 3,
      prompt: String.raw`$\displaystyle\int_0^1x^2e^x\,dx$`,
      answer: 'e-2', _int: ['x^2*e^x', 0, 1],
      explain: String.raw`$\left[(x^2-2x+2)e^x\right]_0^1=e-2$.`,
    },
  ],
  flashcards: [
    { id: 's11.parti.fc1', kind: 'formula', front: 'Integrazione per parti', back: String.raw`$\int fg'=fg-\int f'g$; $\int_a^bfg'=[fg]_a^b-\int_a^bf'g$.` },
    { id: 's11.parti.fc2', kind: 'metodo', front: 'Come scegliere $f$ e $g\'$', back: String.raw`Derivo polinomi, $\log$, $\arctan$; integro $e^x$, $\sin$, $\cos$, potenze. Il nuovo integrale deve essere più semplice.` },
    { id: 's11.parti.fc3', kind: 'metodo', front: 'Metodo "per ricorsione"', back: String.raw`Per $e^{ax}\sin bx$, $e^{ax}\cos bx$: due volte per parti con gli **stessi ruoli**, ritrovo $I$ e risolvo l'equazione.` },
    { id: 's11.parti.fc4', kind: 'formula', front: '$\\int\\log x$, $\\int x\\log x$, $\\int\\arctan x$', back: String.raw`$x\log x-x$; $\frac{x^2}2\log x-\frac{x^2}4$; $x\arctan x-\frac12\log(1+x^2)$.` },
    { id: 's11.parti.fc5', kind: 'formula', front: '$\\int e^{-x}\\sin x\\,dx$', back: String.raw`$-\frac12e^{-x}(\sin x+\cos x)+c$.` },
    { id: 's11.parti.fc6', kind: 'formula', front: '$\\int\\frac{\\arctan x}{x^2}dx$', back: String.raw`$-\frac{\arctan x}x+\log|x|-\frac12\log(1+x^2)+c$.` },
    { id: 's11.parti.fc7', kind: 'formula', front: '$\\int\\frac{\\log(1+t)}{t^2}dt$', back: String.raw`$-\frac{\log(1+t)}t+\log|t|-\log(1+t)+c$.` },
    { id: 's11.parti.fc8', kind: 'formula', front: '$\\int e^{ax}\\sin bx\\,dx$ e $\\int e^{ax}\\cos bx\\,dx$', back: String.raw`$\frac{e^{ax}(a\sin bx-b\cos bx)}{a^2+b^2}$; $\frac{e^{ax}(a\cos bx+b\sin bx)}{a^2+b^2}$.` },
  ],
};

export default {
  id: 's11',
  title: 'Integrali',
  subtitle: 'Riemann, primitive, tecniche di integrazione, aree',
  intro: String.raw`All'esame c'è quasi sempre un integrale: una primitiva per parti o di una razionale, un'area, o un integrale improprio. Qui costruisci tutto: dal significato di area fino alle tecniche di calcolo.`,
  skills: [riemann, immediati, parti],
};
