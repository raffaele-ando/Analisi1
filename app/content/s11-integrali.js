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

export default {
  id: 's11',
  title: 'Integrali',
  subtitle: 'Riemann, primitive, tecniche di integrazione, aree',
  intro: String.raw`All'esame c'è quasi sempre un integrale: una primitiva per parti o di una razionale, un'area, o un integrale improprio. Qui costruisci tutto: dal significato di area fino alle tecniche di calcolo.`,
  skills: [riemann],
};
