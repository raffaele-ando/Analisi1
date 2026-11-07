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

// ---------------------------------------------------------------------------
// s11.sostituzione · Integrazione per sostituzione
// ---------------------------------------------------------------------------
const sost = {
  id: 's11.sostituzione',
  title: 'Integrazione per sostituzione',
  summary: String.raw`Riconoscere una funzione composta con la sua derivata, scegliere il cambio di variabile e, negli integrali definiti, cambiare anche gli estremi.`,
  prereq: ['s11.immediati', 's11.riemann', 's08.regole', 's00.esplog'],
  examRefs: [],
  lessons: [
    {
      id: 's11.sostituzione.L1',
      title: 'La derivata dentro l\'integrale',
      cards: [
        {
          type: 'learn',
          title: 'Derivata "dentro" e "fuori"',
          body: String.raw`Molte integrande hanno la forma di una **funzione composta** $f(g(x))$ moltiplicata per la **derivata** $g'(x)$ della parte interna. Esempi che si riconoscono subito: in $2x\,e^{x^2}$ la parte interna è $x^2$ e la sua derivata $2x$ compare già; in $\cos x\,\sin^3x$ la parte interna è $\sin x$ e la sua derivata $\cos x$ compare già.

>* **Regola.** Se $F'=f$, allora $\displaystyle\int f(g(x))\,g'(x)\,dx=F(g(x))+c$.

Perché è vera: derivando $F(g(x))$ con la regola della catena ottengo $f(g(x))\,g'(x)$. La formula è la regola della catena letta al contrario.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\displaystyle\int 2x\,e^{x^2}\,dx$.`,
          steps: [
            String.raw`La parte interna è $x^2$; la sua derivata $2x$ compare già nell'integranda.`,
            String.raw`Pongo $t=x^2$. Allora $dt=2x\,dx$: il pezzo $2x\,dx$ diventa $dt$.`,
            {
              text: String.raw`L'integrale diventa $\int e^t\,dt$, la cui primitiva è $e^t$.`,
              ask: { type: 'expr', prompt: String.raw`Una primitiva di $e^t$ rispetto a $t$?`, answer: 'e^t', vars: ['t'], upToConstant: true, _f: 'e^t', explain: String.raw`$(e^t)'=e^t$, quindi la primitiva è $e^t$.` },
            },
            String.raw`Torno a $x$ con $t=x^2$: $e^{x^2}+c$.`,
          ],
          result: String.raw`$\displaystyle\int 2x\,e^{x^2}\,dx=e^{x^2}+c$`,
        },
        {
          type: 'learn',
          title: 'Riconoscere il pattern',
          body: String.raw`Prima di sostituire, cerca nell'integranda:
- una funzione $g(x)$ con dentro un'altra espressione: $\sqrt{x+1}$, $\sin(x^2)$, $e^{x^3}$, $\log x$;
- la derivata di $g$, anche a meno di un fattore costante.

Esempi: in $\int x\sqrt{x^2+1}\,dx$ si ha $t=x^2+1$ e $dt=2x\,dx$; in $\int\frac{\log x}{x}\,dx$ si ha $t=\log x$ e $dt=\frac{dx}{x}$; in $\int\frac{e^x}{1+e^x}\,dx$ si ha $t=1+e^x$ e $dt=e^x\,dx$.

Se manca un fattore costante, lo porto fuori: $\int x\sqrt{x^2+1}\,dx=\frac12\int 2x\sqrt{x^2+1}\,dx$.`,
        },
        {
          id: 's11.sostituzione.L1.e1', type: 'expr', level: 1, upToConstant: true, domain: [0.3, 2.7],
          prompt: String.raw`$\displaystyle\int 3x^2\,(x^3+1)^4\,dx$`,
          answer: '(x^3+1)^5/5', _f: '3*x^2*(x^3+1)^4',
          explain: String.raw`La parte interna è $x^3+1$ e la sua derivata $3x^2$ c'è già. Con $t=x^3+1$ l'integrale diventa $\int t^4\,dt=\frac{t^5}{5}$. Risultato: $\frac{(x^3+1)^5}{5}+c$.`,
        },
        {
          id: 's11.sostituzione.L1.e2', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`$\displaystyle\int x\cos(x^2)\,dx$`,
          answer: 'sin(x^2)/2', _f: 'x*cos(x^2)',
          explain: String.raw`Con $t=x^2$ si ha $dt=2x\,dx$, quindi $x\,dx=\frac12dt$ e l'integrale è $\frac12\int\cos t\,dt=\frac12\sin t$. Verifica: $\frac{d}{dx}\frac12\sin(x^2)=x\cos(x^2)$.`,
        },
        {
          id: 's11.sostituzione.L1.e3', type: 'mcq', level: 1,
          prompt: String.raw`Per $\displaystyle\int x\,\sin(x^2)\,dx$ quale cambio di variabile funziona?`,
          options: [String.raw`$t=x^2$`, String.raw`$t=\sin x$`, String.raw`$t=x$`, String.raw`$t=x^3$`],
          answer: 0,
          explain: String.raw`Con $t=x^2$ si ha $dt=2x\,dx$, e $x\,dx$ compare nell'integranda. Con $t=\sin x$ serve $\cos x\,dx$, che non c'è. Con $t=x^3$ serve $x^2\,dx$, che non c'è. Con $t=x$ non cambia nulla.`,
        },
        {
          id: 's11.sostituzione.L1.e4', type: 'num', level: 1,
          prompt: String.raw`$\displaystyle\int_0^1 2x\,e^{x^2}\,dx$`,
          answer: 'e-1', _int: ['2*x*exp(x^2)', 0, 1],
          explain: String.raw`Con $t=x^2$ gli estremi diventano $t=0$ e $t=1$ e l'integrale è $\int_0^1 e^t\,dt=e-1$. Stesso risultato valutando la primitiva $e^{x^2}$ tra $0$ e $1$.`,
        },
        {
          id: 's11.sostituzione.L1.e5', type: 'tf', level: 1,
          prompt: String.raw`$\displaystyle\int x\,e^{x^2}\,dx=\frac{e^{x^2}}{2}+c$`,
          answer: true,
          explain: String.raw`Vero. Derivando $\frac{e^{x^2}}2$ si ottiene $\frac{2x\,e^{x^2}}2=x\,e^{x^2}$.`,
        },
        {
          id: 's11.sostituzione.L1.e6', type: 'mcq', level: 2,
          prompt: String.raw`Quale è una primitiva di $\dfrac{\cos x}{\sin x}$ (per $\sin x>0$)?`,
          options: [String.raw`$\log|\sin x|+c$`, String.raw`$-\log|\sin x|+c$`, String.raw`$\dfrac{1}{\sin^2x}+c$`, String.raw`$\sin x\cos x+c$`],
          answer: 0,
          explain: String.raw`Con $t=\sin x$ si ha $dt=\cos x\,dx$ e l'integrale è $\int\frac{dt}{t}=\log|t|$. Il segno meno è sbagliato: appartiene a $\int\tan x\,dx=-\log|\cos x|$, un altro integrale. $\frac1{\sin^2x}$ è la derivata di $-\cot x$, non una primitiva di questa funzione.`,
        },
        {
          id: 's11.sostituzione.L1.e7', type: 'expr', level: 2, upToConstant: true, domain: [0.2, 1.2],
          prompt: String.raw`$\displaystyle\int\tan x\,dx$ (per $0<x<\frac\pi2$)`,
          answer: '-log(cos(x))', _f: 'tan(x)',
          explain: String.raw`$\tan x=\frac{\sin x}{\cos x}=-\frac{(\cos x)'}{\cos x}$. Con $t=\cos x$ si ottiene $-\int\frac{dt}t=-\log t$. Per $0<x<\frac\pi2$ il coseno è positivo, quindi la primitiva è $-\log(\cos x)$.`,
        },
        {
          id: 's11.sostituzione.L1.e8', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^{\pi/2}\sin x\,\cos^3x\,dx$`,
          answer: '1/4', _int: ['sin(x)*cos(x)^3', 0, 'pi/2'],
          explain: String.raw`Parte interna $\cos x$, derivata $-\sin x$. Con $t=\cos x$: $\sin x\,dx=-dt$. Estremi: $x=0\Rightarrow t=1$, $x=\frac\pi2\Rightarrow t=0$. Quindi $\int_1^0(-t^3)\,dt=\int_0^1t^3\,dt=\frac14$.`,
        },
        {
          id: 's11.sostituzione.L1.e9', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\displaystyle\int\frac{e^x}{\sqrt{1+e^x}}\,dx$`,
          answer: '2*sqrt(1+e^x)', _f: 'e^x/sqrt(1+e^x)',
          explain: String.raw`Con $t=1+e^x$ si ha $dt=e^x\,dx$ e l'integrale è $\int t^{-1/2}\,dt=2\sqrt t$. Risultato: $2\sqrt{1+e^x}+c$.`,
        },
        {
          id: 's11.sostituzione.L1.e10', type: 'tf', level: 2,
          prompt: String.raw`Per ogni $f$ continua su $[0,1]$ vale $\displaystyle\int_0^1 f(x^2)\,2x\,dx=\int_0^1 f(t)\,dt$.`,
          answer: true,
          explain: String.raw`Vero. Con $t=x^2$ si ha $dt=2x\,dx$; gli estremi restano $0$ e $1$ perché $0^2=0$ e $1^2=1$.`,
        },
      ],
    },
    {
      id: 's11.sostituzione.L2',
      title: 'Sostituire esplicitamente',
      cards: [
        {
          type: 'learn',
          title: 'Il metodo in quattro passi',
          body: String.raw`Quando la derivata non compare, **la sostituzione la costruisco io**. Quattro passi:

1. scelgo $t=g(x)$: di solito è la parte "difficile" dentro una funzione (una radice, un'esponenziale, un logaritmo);
2. calcolo $dt=g'(x)\,dx$, cioè $dx=\dfrac{dt}{g'(x)}$, e riscrivo **tutto** in $t$, anche $dx$;
3. integro in $t$ (spesso diventa un'integrale immediato o razionale);
4. torno a $x$ sostituendo $t=g(x)$.

>! Errore tipico: sostituire la $x$ e lasciare $dx$. Ogni $x$ e ogni $dx$ devono diventare $t$ e $dt$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\int x\\sqrt{x+1}\\,dx$',
          problem: String.raw`Calcola $\displaystyle\int x\sqrt{x+1}\,dx$.`,
          steps: [
            String.raw`Pongo $t=x+1$. Allora $x=t-1$ e $dt=dx$ (la derivata di $x+1$ è $1$).`,
            String.raw`L'integrale diventa $\displaystyle\int (t-1)\sqrt t\,dt=\int\left(t^{3/2}-t^{1/2}\right)dt$.`,
            {
              text: String.raw`Primitive termine a termine: $\frac25t^{5/2}-\frac23t^{3/2}$.`,
              ask: { type: 'expr', prompt: String.raw`Una primitiva di $t^{3/2}-t^{1/2}$ rispetto a $t$ (per $t>0$)?`, answer: '2/5*t^(5/2)-2/3*t^(3/2)', vars: ['t'], domain: [0.3, 2.7], upToConstant: true, _f: 't^(3/2)-t^(1/2)', explain: String.raw`$\int t^{3/2}\,dt=\frac{t^{5/2}}{5/2}=\frac25t^{5/2}$ e $\int t^{1/2}\,dt=\frac23t^{3/2}$.` },
            },
            String.raw`Torno a $x$: $\frac25(x+1)^{5/2}-\frac23(x+1)^{3/2}+c$.`,
          ],
          result: String.raw`$\displaystyle\int x\sqrt{x+1}\,dx=\frac25(x+1)^{5/2}-\frac23(x+1)^{3/2}+c$`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\int\\frac{dx}{1+\\sqrt x}$',
          problem: String.raw`Calcola $\displaystyle\int\frac{dx}{1+\sqrt x}$ per $x>0$.`,
          steps: [
            String.raw`La radice è la parte "difficile": pongo $t=\sqrt x$, cioè $x=t^2$.`,
            String.raw`Allora $dx=2t\,dt$. Sostituisco: $\displaystyle\int\frac{2t}{1+t}\,dt$.`,
            {
              text: String.raw`Divido: $\frac{2t}{1+t}=2-\frac{2}{1+t}$, quindi l'integrale vale $2t-2\log(1+t)$.`,
              ask: { type: 'expr', prompt: String.raw`Una primitiva di $\frac{2t}{1+t}$ rispetto a $t$ (per $t>0$)?`, answer: '2*t-2*log(1+t)', vars: ['t'], domain: [0.3, 2.7], upToConstant: true, _f: '2*t/(1+t)', explain: String.raw`$\frac{2t}{1+t}=\frac{2(1+t)-2}{1+t}=2-\frac{2}{1+t}$. Primitiva: $2t-2\log(1+t)$.` },
            },
            String.raw`Torno a $x$ con $t=\sqrt x$: $2\sqrt x-2\log(1+\sqrt x)+c$.`,
          ],
          result: String.raw`$\displaystyle\int\frac{dx}{1+\sqrt x}=2\sqrt x-2\log(1+\sqrt x)+c$`,
        },
        {
          type: 'learn',
          title: 'Quale $t$ scegliere',
          body: String.raw`La sostituzione è utile quando l'integranda diventa **più semplice**: un polinomio, una razionale, un'esponenziale o un'immediata. Casi frequenti:

- **radici**: con $\sqrt[n]{\cdot}$ dentro, pongo $t=\sqrt[n]{\cdot}$ e la radice sparisce;
- **esponenziali**: con $e^x$ dentro, pongo $t=e^x$ e $dt=e^x\,dx$;
- **logaritmi**: con $\log x$ dentro, pongo $t=\log x$ e $dt=\dfrac{dx}{x}$;
- **funzioni trigonometriche**: se compare $\cos x$ insieme a $\sin x$ (o viceversa), pongo $t$ uguale alla funzione la cui derivata compare.

Se dopo il cambio l'integranda non si semplifica, prova un'altra scelta o un altro metodo (per parti, vedi s11.parti).`,
        },
        {
          id: 's11.sostituzione.L2.e1', type: 'expr', level: 2, upToConstant: true, domain: [1.5, 4],
          prompt: String.raw`$\displaystyle\int\frac{dx}{x\log x}$ (per $x>1$)`,
          answer: 'log(log(x))', _f: '1/(x*log(x))',
          explain: String.raw`Con $t=\log x$ si ha $dt=\frac{dx}{x}$. L'integrale diventa $\int\frac{dt}{t}=\log t$. Quindi $\log(\log x)+c$ per $x>1$.`,
        },
        {
          id: 's11.sostituzione.L2.e2', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^{1}e^{\sqrt x}\,dx$`,
          answer: '2', _int: ['exp(sqrt(x))', 0, 1],
          explain: String.raw`Con $t=\sqrt x$: $x=t^2$, $dx=2t\,dt$, estremi $0$ e $1$. Quindi $\int_0^1 2t\,e^t\,dt$. Per parti: $\left[2(t-1)e^t\right]_0^1=0-(-2)=2$.`,
        },
        {
          id: 's11.sostituzione.L2.e3', type: 'expr', level: 2, upToConstant: true, domain: [0.3, 2],
          prompt: String.raw`$\displaystyle\int x^3e^{x^2}\,dx$`,
          answer: '(x^2-1)*e^(x^2)/2', _f: 'x^3*e^(x^2)',
          explain: String.raw`Con $t=x^2$: $dt=2x\,dx$ e $x^3\,dx=x^2\cdot x\,dx=\frac12t\,dt$. L'integrale è $\frac12\int te^t\,dt=\frac12(t-1)e^t$ (per parti). Risultato: $\frac{(x^2-1)e^{x^2}}2+c$.`,
        },
        {
          id: 's11.sostituzione.L2.e4', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\displaystyle\int\frac{e^{2x}}{e^x+1}\,dx$`,
          answer: 'e^x-log(1+e^x)', _f: 'e^(2x)/(e^x+1)',
          explain: String.raw`Scrivo $e^{2x}\,dx=e^x\cdot e^x\,dx$ e pongo $t=e^x$, $dt=e^x\,dx$: l'integrale è $\int\frac{t}{t+1}\,dt=\int\left(1-\frac1{t+1}\right)dt=t-\log(1+t)$.`,
        },
        {
          id: 's11.sostituzione.L2.e5', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_1^4\frac{dx}{x+\sqrt x}$`,
          answer: '2*log(3/2)', _int: ['1/(x+sqrt(x))', 1, 4],
          explain: String.raw`Con $t=\sqrt x$: $x+\sqrt x=t^2+t=t(t+1)$ e $dx=2t\,dt$. Estremi: $x=1\Rightarrow t=1$, $x=4\Rightarrow t=2$. Quindi $\int_1^2\frac{2t}{t(t+1)}\,dt=\int_1^2\frac{2}{t+1}\,dt=2\log\frac32$.`,
        },
        {
          id: 's11.sostituzione.L2.e6', type: 'cloze', level: 2,
          prompt: 'Completa il cambio di variabile.',
          text: String.raw`Nell'integrale $\displaystyle\int\frac{x}{1+x^4}\,dx$ pongo $t=x^2$: allora [[0]] e l'integrale diventa [[1]].`,
          blanks: [
            { options: [String.raw`$dt=2x\,dx$`, String.raw`$dt=x\,dx$`, String.raw`$dt=4x^3\,dx$`], answer: 0 },
            { options: [String.raw`$\displaystyle\int\frac{dt}{1+t}$`, String.raw`$\displaystyle\frac12\int\frac{dt}{1+t^2}$`, String.raw`$\displaystyle\int\frac{dt}{1+t^2}$`], answer: 1 },
          ],
          explain: String.raw`Con $t=x^2$: $dt=2x\,dx$, quindi $x\,dx=\frac12dt$; inoltre $x^4=t^2$. Il fattore $\frac12$ resta fuori dall'integrale.`,
        },
        {
          id: 's11.sostituzione.L2.e7', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^{1}x\sqrt{1-x^2}\,dx$`,
          answer: '1/3', _int: ['x*sqrt(1-x^2)', 0, 1],
          explain: String.raw`Con $t=1-x^2$: $dt=-2x\,dx$. Estremi: $x=0\Rightarrow t=1$, $x=1\Rightarrow t=0$. L'integrale è $\int_1^0\left(-\tfrac12\sqrt t\right)dt=\frac12\int_0^1\sqrt t\,dt=\frac12\cdot\frac23=\frac13$.`,
        },
        {
          id: 's11.sostituzione.L2.e8', type: 'order', level: 2,
          prompt: String.raw`Ordina i passi per calcolare $\displaystyle\int_0^{\pi/2}\sin x\,\cos^2x\,dx$. Scarta i passi sbagliati.`,
          steps: [
            String.raw`Pongo $t=\cos x$: allora $dt=-\sin x\,dx$.`,
            String.raw`Estremi: $x=0\Rightarrow t=1$, $x=\frac\pi2\Rightarrow t=0$.`,
            String.raw`L'integrale diventa $\displaystyle\int_1^0(-t^2)\,dt=\int_0^1t^2\,dt$.`,
            String.raw`Risultato: $\frac13$.`,
          ],
          distractors: [String.raw`Lascio gli estremi $0$ e $\frac\pi2$ e integro $\displaystyle\int_0^{\pi/2}t^2\,dt$.`, String.raw`Pongo $t=\sin x$, quindi $dt=\cos x\,dx$, che è presente nell'integranda.`],
          explain: String.raw`Il segno meno di $dt$ si assorbe scambiando gli estremi. I due passi sbagliati: gli estremi di $x$ non valgono per $t$; e $t=\sin x$ non funziona perché serve $\cos x\,dx$, mentre l'integranda ha $\sin x\,dx$.`,
        },
        {
          id: 's11.sostituzione.L2.e9', type: 'open', level: 2, points: 2,
          prompt: String.raw`Si spieghi come si usa il cambio di variabile $t=g(x)$ per calcolare $\int f(g(x))\,g'(x)\,dx$, e perché in $\int f(g(x))\,dx$ senza il fattore $g'(x)$ la sostituzione non funziona.`,
          answer: String.raw`Si pone $t=g(x)$, da cui $dt=g'(x)\,dx$. L'integrale diventa $\int f(t)\,dt=F(t)+c$, dove $F'=f$; si torna a $x$ con $t=g(x)$. Senza il fattore $g'(x)$ resta $dx=\frac{dt}{g'(x)}$, e $g'(x)$ dipende ancora da $x$: l'integrale non si scrive più solo in $t$.`,
          rubric: ['Scrive $t=g(x)$ e $dt=g\'(x)\\,dx$', 'Ottiene $\\int f(t)\\,dt$ e torna alla variabile $x$', 'Spiega che il fattore $g\'(x)$ serve a eliminare $dx$', 'Chiude con la formula $F(g(x))+c$'],
        },
      ],
    },
    {
      id: 's11.sostituzione.L3',
      title: 'Integrali definiti e radici trigonometriche',
      cards: [
        {
          type: 'learn',
          title: 'Cambiare anche gli estremi',
          body: String.raw`Nell'integrale **definito** puoi cambiare variabile e cambiare anche gli estremi. Se $t=g(x)$:

>* $$\int_a^b f(g(x))\,g'(x)\,dx=\int_{g(a)}^{g(b)} f(t)\,dt.$$

Poi calcoli in $t$, con i nuovi estremi, senza tornare a $x$. Se preferisci tornare a $x$, trovi la primitiva in $t$, sostituisci $t=g(x)$ e valuti agli estremi originali $a$ e $b$.

>! Errore tipico: cambiare variabile e tenere gli estremi $a$ e $b$. Sono estremi di $x$: in $t$ diventano $g(a)$ e $g(b)$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\displaystyle\int_0^1\frac{2x}{(1+x^2)^2}\,dx$ con un cambio di variabile.`,
          steps: [
            String.raw`Pongo $t=1+x^2$, quindi $dt=2x\,dx$. Estremi: $x=0\Rightarrow t=1$, $x=1\Rightarrow t=2$.`,
            String.raw`L'integrale diventa $\displaystyle\int_1^2 t^{-2}\,dt$.`,
            {
              text: String.raw`Una primitiva di $t^{-2}$ è $-\frac1t$. Valuto: $-\frac12-(-1)$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $\displaystyle\int_1^2 \frac{dt}{t^2}$?`, answer: '1/2', _int: ['1/x^2', 1, 2], explain: String.raw`Primitiva $-\frac1t$: $-\frac12+1=\frac12$.` },
            },
            String.raw`Risultato: $\displaystyle\int_0^1\frac{2x}{(1+x^2)^2}\,dx=\frac12$.`,
          ],
          result: String.raw`$\displaystyle\int_0^1\frac{2x}{(1+x^2)^2}\,dx=\frac12$`,
        },
        {
          id: 's11.sostituzione.L3.e1', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\displaystyle\int\frac{x}{\sqrt{1+x^2}}\,dx$`,
          answer: 'sqrt(1+x^2)', _f: 'x/sqrt(1+x^2)',
          explain: String.raw`Parte interna $1+x^2$, derivata $2x$: con $t=1+x^2$ l'integrale è $\frac12\int t^{-1/2}\,dt=\sqrt t$. Risultato: $\sqrt{1+x^2}+c$.`,
        },
        {
          id: 's11.sostituzione.L3.e2', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^{\log 3}e^x\,(1+e^x)\,dx$`,
          answer: '6', _int: ['exp(x)*(1+exp(x))', 0, 'log(3)'],
          explain: String.raw`Con $t=1+e^x$: $dt=e^x\,dx$. Estremi: $x=0\Rightarrow t=2$, $x=\log3\Rightarrow t=4$. L'integrale è $\int_2^4 t\,dt=\frac{16-4}2=6$.`,
        },
        {
          id: 's11.sostituzione.L3.e3', type: 'mcq', level: 2,
          prompt: String.raw`Nell'integrale $\displaystyle\int_1^{e}\frac{(\log x)^2}{x}\,dx$ con $t=\log x$, quali sono gli estremi in $t$?`,
          options: [String.raw`$0$ e $1$`, String.raw`$1$ e $e$`, String.raw`$1$ e $0$`, String.raw`$0$ e $e$`],
          answer: 0,
          explain: String.raw`$t=\log x$: per $x=1$ si ha $t=0$; per $x=e$ si ha $t=1$. Errore tipico: lasciare $1$ ed $e$, che sono estremi di $x$. L'integrale in $t$ è $\int_0^1t^2\,dt=\frac13$.`,
        },
        {
          id: 's11.sostituzione.L3.e4', type: 'open', level: 3, points: 3,
          prompt: String.raw`Si enunci la formula di integrazione per sostituzione per gli integrali definiti, con $g$ di classe $C^1$, e si spieghi perché cambiano gli estremi.`,
          answer: String.raw`Se $g:[a,b]\to\R$ è derivabile con $g'$ continua e $f$ è continua sull'immagine di $g$, allora $\displaystyle\int_a^b f(g(x))\,g'(x)\,dx=\int_{g(a)}^{g(b)}f(t)\,dt$. Gli estremi cambiano perché $t=g(x)$: il punto $x=a$ corrisponde a $t=g(a)$ e $x=b$ a $t=g(b)$. Se $G$ è una primitiva di $f$, entrambi i membri valgono $G(g(b))-G(g(a))$, perché $\frac{d}{dx}G(g(x))=f(g(x))g'(x)$.`,
          rubric: ['Ipotesi: $g$ derivabile con $g\'$ continua, $f$ continua', 'Formula con estremi $g(a)$ e $g(b)$', 'Spiega il cambio degli estremi come corrispondenza $x\\mapsto t=g(x)$', 'Verifica con la primitiva $G(g(x))$ o con la regola della catena'],
        },
        {
          id: 's11.sostituzione.L3.e5', type: 'problem', level: 3, points: 4,
          prompt: String.raw`Calcola $\displaystyle\int_0^1\sqrt{1-x^2}\,dx$ con la sostituzione $x=\sin t$, $t\in\left[0,\frac\pi2\right]$.`,
          parts: [
            { type: 'expr', prompt: String.raw`Scrivi l'integranda $\sqrt{1-x^2}\,dx$ in $t$ (usa $dx=\cos t\,dt$ e $\sqrt{1-\sin^2t}=\cos t$ su $\left[0,\frac\pi2\right]$).`, answer: 'cos(t)^2', vars: ['t'], domain: [0.2, 1.3], explain: String.raw`$\sqrt{1-\sin^2t}=\cos t$ (positivo su $\left[0,\frac\pi2\right]$) e $dx=\cos t\,dt$: l'integranda è $\cos^2t$.` },
            { type: 'expr', prompt: String.raw`Una primitiva di $\cos^2t$ (usa $\cos^2t=\frac{1+\cos2t}2$).`, answer: 't/2+sin(2*t)/4', vars: ['t'], domain: [0.2, 1.3], upToConstant: true, explain: String.raw`$\int\cos^2t\,dt=\int\frac{1+\cos2t}2\,dt=\frac t2+\frac{\sin2t}4$. Derivando: $\frac12+\frac{\cos2t}2=\cos^2t$.` },
            { type: 'num', prompt: String.raw`Estremi: $x=0\Rightarrow t=0$ e $x=1\Rightarrow t=\frac\pi2$. Quanto vale l'integrale finale?`, answer: 'pi/4', explain: String.raw`Tra $0$ e $\frac\pi2$: $\left(\frac\pi4+\frac{\sin\pi}4\right)-0=\frac\pi4$.` },
          ],
          solution: String.raw`$\displaystyle\int_0^1\sqrt{1-x^2}\,dx=\int_0^{\pi/2}\cos^2t\,dt=\left[\frac t2+\frac{\sin2t}4\right]_0^{\pi/2}=\frac\pi4$.

Controllo geometrico: l'integrale è l'area di un quarto di cerchio di raggio $1$, cioè $\frac{\pi}{4}$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's11.sostituzione.p1', type: 'mcq', level: 1,
      prompt: String.raw`Quale integrale si risolve con $t=\sin x$?`,
      options: [String.raw`$\displaystyle\int\cos x\,\sin^2x\,dx$`, String.raw`$\displaystyle\int\sin^3x\,dx$`, String.raw`$\displaystyle\int\frac{x}{\sin x}\,dx$`, String.raw`$\displaystyle\int\sin(x^2)\,dx$`],
      answer: 0,
      explain: String.raw`Con $t=\sin x$ serve $dt=\cos x\,dx$ nell'integranda: c'è solo nel primo caso. Negli altri la derivata di $\sin x$ non compare.`,
    },
    {
      id: 's11.sostituzione.p2', type: 'tf', level: 1,
      prompt: String.raw`Se $t=g(x)$ allora $\displaystyle\int f(g(x))\,dx=\int f(t)\,dt$.`,
      answer: false,
      explain: String.raw`Falso: manca il fattore $g'(x)$. La formula corretta è $\int f(g(x))\,g'(x)\,dx=\int f(t)\,dt$, perché $dx$ diventa $\frac{dt}{g'(x)}$.`,
    },
    {
      id: 's11.sostituzione.p3', type: 'cloze', level: 1,
      prompt: 'Completa il cambio di variabile.',
      text: String.raw`Per $\displaystyle\int\frac{\log x}{x}\,dx$ pongo $t=$ [[0]]: allora [[1]] e l'integrale diventa $\displaystyle\int$ [[2]].`,
      blanks: [
        { options: [String.raw`$\log x$`, String.raw`$\frac1x$`, String.raw`$x$`], answer: 0 },
        { options: [String.raw`$dx$`, String.raw`$\frac{dx}{x}$`, String.raw`$\log x\,dx$`], answer: 1 },
        { options: [String.raw`$\frac1t\,dt$`, String.raw`$t\,dt$`, String.raw`$t^2\,dt$`], answer: 1 },
      ],
      explain: String.raw`Con $t=\log x$: $dt=\frac{dx}{x}$, e l'integrale è $\int t\,dt$.`,
    },
    {
      id: 's11.sostituzione.p4', type: 'order', level: 2,
      prompt: String.raw`Ordina i passi per calcolare $\displaystyle\int_0^1 2x\sqrt{1+x^2}\,dx$. Scarta i passi sbagliati.`,
      steps: [
        String.raw`Pongo $t=1+x^2$, quindi $dt=2x\,dx$.`,
        String.raw`Estremi: $x=0\Rightarrow t=1$, $x=1\Rightarrow t=2$.`,
        String.raw`L'integrale diventa $\displaystyle\int_1^2\sqrt t\,dt$.`,
        String.raw`Primitiva $\frac23t^{3/2}$; valuto tra $1$ e $2$: $\frac23\left(2\sqrt2-1\right)$.`,
      ],
      distractors: [String.raw`Lascio gli estremi $0$ e $1$ e integro $\displaystyle\int_0^1\sqrt t\,dt$.`, String.raw`Scrivo $dt=2\,dx$ e dimentico la $x$ davanti all'integrale.`],
      explain: String.raw`Il cambio di variabile trasforma $dx$ in $\frac{dt}{2x}$ e il $2x$ si elimina; gli estremi sono quelli di $t$. Con gli estremi di $x$ (passo scartato) il risultato sarebbe sbagliato.`,
    },
    {
      id: 's11.sostituzione.p5', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\int_0^{\log 3}e^x\,(1+e^x)\,dx$`,
      answer: '6', _int: ['exp(x)*(1+exp(x))', 0, 'log(3)'],
      explain: String.raw`Con $t=1+e^x$: estremi $2$ e $4$. $\int_2^4t\,dt=6$.`,
    },
    {
      id: 's11.sostituzione.p6', type: 'expr', level: 2, upToConstant: true,
      prompt: String.raw`$\displaystyle\int\frac{\sin x}{\cos^3x}\,dx$ (per $0<x<\frac\pi2$)`,
      answer: '1/(2*cos(x)^2)', _f: 'sin(x)/cos(x)^3', domain: [0.2, 1.2],
      explain: String.raw`Con $t=\cos x$: $\sin x\,dx=-dt$, l'integrale è $-\int t^{-3}\,dt=\frac{t^{-2}}{2}$. Risultato: $\frac1{2\cos^2x}$.`,
    },
    {
      id: 's11.sostituzione.gen-potenza', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.int(1, 4), n = R.int(1, 4);
        return {
          type: 'expr', upToConstant: true,
          prompt: String.raw`$\displaystyle\int x\,(x^2+${a})^{${n}}\,dx$`,
          answer: `(x^2+${a})^${n + 1}/${2 * (n + 1)}`, _f: `x*(x^2+${a})^${n}`,
          explain: String.raw`Con $t=x^2+${a}$ si ha $dt=2x\,dx$: l'integrale è $\frac12\int t^{${n}}\,dt=\frac{t^{${n + 1}}}{${2 * (n + 1)}}$. Risultato: $\frac{(x^2+${a})^{${n + 1}}}{${2 * (n + 1)}}+c$.`,
        };
      },
    },
    {
      id: 's11.sostituzione.gen-esp', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(1, 3), b = R.int(1, 2);
        const ca = H.coef(a);
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\int_0^{${b}} x\,e^{${ca}x^2}\,dx$`,
          answer: `(e^(${a * b * b})-1)/${2 * a}`, _int: [`x*exp(${a}*x^2)`, 0, b],
          explain: String.raw`Con $t=${a}x^2$ si ha $dt=${2 * a}x\,dx$, quindi l'integrale è $\frac{1}{${2 * a}}\int e^t\,dt$. Primitiva $\frac{e^{${a}x^2}}{${2 * a}}$; tra $0$ e $${b}$: $\frac{e^{${a * b * b}}-1}{${2 * a}}$.`,
        };
      },
    },
    {
      id: 's11.sostituzione.gen-trig', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(1, 3), n = R.int(1, 4);
        const ax = a === 1 ? 'x' : `${a}x`;
        const cf = H.coef(a);
        const sp = n === 1 ? String.raw`\sin(${ax})` : String.raw`\sin^{${n}}(${ax})`;
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\int_0^{\pi/${2 * a}} ${cf}\cos(${ax})\,${sp}\,dx$`,
          answer: `1/${n + 1}`, _int: [`${a}*cos(${a}*x)*sin(${a}*x)^${n}`, 0, `pi/${2 * a}`],
          explain: String.raw`$${cf}\cos(${ax})$ è la derivata di $\sin(${ax})$: con $t=\sin(${ax})$ l'integrale è $\int_0^1 t^{${n}}\,dt=\frac1{${n + 1}}$ (estremi $0$ e $\sin\frac\pi2=1$).`,
        };
      },
    },
    {
      id: 's11.sostituzione.gen-cerchio', type: 'gen', level: 3,
      gen: (R) => {
        const c = R.int(1, 3);
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\int_0^{${c}}\sqrt{${c * c}-x^2}\,dx$ (usa la geometria)`,
          answer: `pi*${c * c}/4`, _int: [`sqrt(${c * c}-x^2)`, 0, c],
          explain: String.raw`$y=\sqrt{${c * c}-x^2}$ è la semicirconferenza di raggio $${c}$; su $[0,${c}]$ è un quarto di cerchio di area $\frac{\pi\,${c * c}}{4}$. (Con $x=${c}\sin t$ si ottiene lo stesso risultato.)`,
        };
      },
    },
    {
      id: 's11.sostituzione.gen-radice', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(1, 4);
        return {
          type: 'expr', upToConstant: true, domain: [0.3, 2.7],
          prompt: String.raw`$\displaystyle\int x\,\sqrt{x^2+${a}}\,dx$`,
          answer: `(x^2+${a})^(3/2)/3`, _f: `x*sqrt(x^2+${a})`,
          explain: String.raw`Con $t=x^2+${a}$: $dt=2x\,dx$ e l'integrale è $\frac12\int\sqrt t\,dt=\frac13t^{3/2}$. Risultato: $\frac13(x^2+${a})^{3/2}+c$.`,
        };
      },
    },
  ],
  flashcards: [
    { id: 's11.sostituzione.fc1', kind: 'formula', front: 'Sostituzione per primitive', back: String.raw`$\int f(g(x))\,g'(x)\,dx=F(g(x))+c$, dove $F'=f$.` },
    { id: 's11.sostituzione.fc2', kind: 'metodo', front: 'Metodo in quattro passi', back: String.raw`1) $t=g(x)$; 2) $dx=\frac{dt}{g'(x)}$ e tutto in $t$; 3) integro in $t$; 4) torno a $x$.` },
    { id: 's11.sostituzione.fc3', kind: 'formula', front: 'Sostituzione per integrali definiti', back: String.raw`$\displaystyle\int_a^b f(g(x))\,g'(x)\,dx=\int_{g(a)}^{g(b)}f(t)\,dt$: cambiano gli estremi.` },
    { id: 's11.sostituzione.fc4', kind: 'metodo', front: 'Quale $t$ scegliere', back: String.raw`La funzione "dentro" $g$ la cui derivata compare nell'integranda, a meno di una costante. Radici: $t=\sqrt[n]{\cdot}$; esponenziali: $t=e^x$; logaritmi: $t=\log x$.` },
    { id: 's11.sostituzione.fc5', kind: 'errore', front: 'Errori tipici con il cambio di variabile', back: String.raw`Lasciare $dx$ invece di $\frac{dt}{g'(x)}$; dimenticare il fattore $g'(x)$; tenere gli estremi di $x$ negli integrali in $t$.` },
    { id: 's11.sostituzione.fc6', kind: 'formula', front: 'Due primitive da riconoscere', back: String.raw`$\int\frac{f'}{f}=\log|f|+c$; $\int f'f^\alpha=\frac{f^{\alpha+1}}{\alpha+1}+c$ ($\alpha\neq-1$).` },
    { id: 's11.sostituzione.fc7', kind: 'def', front: 'Cambio di variabile', back: String.raw`Scrivere l'integrale in una nuova variabile $t=g(x)$ (o $x=\varphi(t)$) perché la nuova integranda sia più semplice.` },
  ],
};

// ---------------------------------------------------------------------------
// s11.razionali · Funzioni razionali fratte
// ---------------------------------------------------------------------------
const razionali = {
  id: 's11.razionali',
  title: 'Funzioni razionali fratte',
  summary: String.raw`Integrare $\frac{N(x)}{D(x)}$: dividere quando serve, scomporre in fratti semplici, usare logaritmi e arcotangente.`,
  prereq: ['s11.immediati', 's11.sostituzione', 's00.algebra', 's00.equazioni'],
  examRefs: ['Appello 03/09/2026 · Parte B'],
  lessons: [
    {
      id: 's11.razionali.L1',
      title: 'Il metodo in tre mosse',
      cards: [
        {
          type: 'learn',
          title: 'Che cos\'è una razionale',
          body: String.raw`Una funzione **razionale fratta** è $\dfrac{N(x)}{D(x)}$ con $N$ e $D$ polinomi e $D\neq0$. Per integrarla si seguono tre mosse:

1. se il **grado** di $N$ è maggiore o uguale a quello di $D$, **divido** (come fra numeri): $\dfrac{N}{D}=Q+\dfrac{R}{D}$ con grado di $R$ minore di quello di $D$;
2. **fattorizzo** $D$ (radici reali, potenze, polinomi di secondo grado senza radici reali);
3. scrivo $\dfrac{R}{D}$ come somma di **fratti semplici** e integro ciascuno con la tabella della card successiva.`,
        },
        {
          type: 'learn',
          title: 'I fratti semplici da sapere',
          body: String.raw`- $\dfrac{A}{x-a}$ → $A\log|x-a|+c$
- $\dfrac{A}{(x-a)^k}$, con $k\geq2$ → $\dfrac{A}{(1-k)(x-a)^{k-1}}+c$
- $\dfrac{Ax+B}{x^2+px+q}$ con $p^2-4q<0$ → logaritmo e arcotangente (vedi terza lezione)

Attenzione all'esponente: $\int\frac{dx}{(x-a)^2}=-\dfrac{1}{x-a}$, **non** un logaritmo.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\int\\frac{x^2+1}{x-1}\\,dx$',
          problem: String.raw`Calcola $\displaystyle\int\frac{x^2+1}{x-1}\,dx$ per $x>1$.`,
          steps: [
            String.raw`Il grado del numeratore ($2$) è maggiore di quello del denominatore ($1$): divido.`,
            String.raw`Divisione: $x^2+1=(x-1)(x+1)+2$, quindi $\dfrac{x^2+1}{x-1}=x+1+\dfrac{2}{x-1}$.`,
            {
              text: String.raw`Integro i tre pezzi: $\displaystyle\int(x+1)\,dx+\int\frac{2}{x-1}\,dx$. Il secondo dà un logaritmo.`,
              ask: { type: 'expr', prompt: String.raw`Una primitiva di $\dfrac{2}{x-1}$ per $x>1$?`, answer: '2*log(x-1)', domain: [1.5, 3], upToConstant: true, _f: '2/(x-1)', explain: String.raw`$\int\frac{dx}{x-1}=\log|x-1|$; per $x>1$ è $\log(x-1)$. Moltiplico per $2$.` },
            },
            String.raw`Risultato: $\dfrac{x^2}{2}+x+2\log(x-1)+c$ per $x>1$.`,
          ],
          result: String.raw`$\displaystyle\int\frac{x^2+1}{x-1}\,dx=\frac{x^2}2+x+2\log(x-1)+c$`,
        },
        {
          id: 's11.razionali.L1.e1', type: 'expr', level: 1, upToConstant: true, domain: [2.3, 4],
          prompt: String.raw`$\displaystyle\int\frac{5}{x-2}\,dx$ (per $x>2$)`,
          answer: '5*log(x-2)', _f: '5/(x-2)',
          explain: String.raw`Fratto semplice con $A=5$ e $a=2$: $5\log|x-2|$. Per $x>2$ il valore assoluto si toglie.`,
        },
        {
          id: 's11.razionali.L1.e2', type: 'expr', level: 1, upToConstant: true, domain: [-0.7, 1.5],
          prompt: String.raw`$\displaystyle\int\frac{dx}{(x+1)^2}$ (per $x>-1$)`,
          answer: '-1/(x+1)', _f: '1/(x+1)^2',
          explain: String.raw`È il caso $k=2$: $\int(x+1)^{-2}\,dx=\frac{(x+1)^{-1}}{-1}=-\frac1{x+1}$. Errore tipico: scrivere $\log$.`,
        },
        {
          id: 's11.razionali.L1.e3', type: 'mcq', level: 1,
          prompt: String.raw`Quale è la decomposizione in fratti semplici di $\dfrac{1}{x(x-1)}$?`,
          options: [String.raw`$\dfrac{1}{x-1}-\dfrac1x$`, String.raw`$\dfrac1x+\dfrac1{x-1}$`, String.raw`$\dfrac2x-\dfrac1{x-1}$`, String.raw`$\dfrac1{x^2}-\dfrac1{x-1}$`],
          answer: 0,
          explain: String.raw`Verifica: $\dfrac1{x-1}-\dfrac1x=\dfrac{x-(x-1)}{x(x-1)}=\dfrac1{x(x-1)}$. Errore tipico: sbagliare il segno di uno dei due fratti. Con $\frac1x+\frac1{x-1}$ il numeratore non torna.`,
        },
        {
          id: 's11.razionali.L1.e4', type: 'num', level: 1,
          prompt: String.raw`$\displaystyle\int_2^3\frac{dx}{x-1}$`,
          answer: 'log(2)', _int: ['1/(x-1)', 2, 3],
          explain: String.raw`$\left[\log(x-1)\right]_2^3=\log2-\log1=\log2$.`,
        },
        {
          id: 's11.razionali.L1.e5', type: 'tf', level: 1,
          prompt: String.raw`$\displaystyle\int\frac{dx}{x^2+1}=\log(x^2+1)+c$.`,
          answer: false,
          explain: String.raw`Falso. $\log(x^2+1)$ è la primitiva di $\frac{2x}{x^2+1}$, non di $\frac1{x^2+1}$. La primitiva di $\frac1{x^2+1}$ è $\arctan x$.`,
        },
        {
          id: 's11.razionali.L1.e6', type: 'cloze', level: 2,
          prompt: 'Completa la decomposizione.',
          text: String.raw`$\dfrac{5x-1}{x(x-1)}=\dfrac{A}{x}+\dfrac{B}{x-1}$ con $A=$ [[0]] e $B=$ [[1]].`,
          blanks: [
            { options: [String.raw`$-1$`, String.raw`$1$`, String.raw`$-\frac15$`], answer: 1 },
            { options: [String.raw`$4$`, String.raw`$-4$`, String.raw`$5$`], answer: 0 },
          ],
          explain: String.raw`Con $x=0$: $-1=-A$, quindi $A=1$. Con $x=1$: $4=B$. Verifica: $\frac1x+\frac4{x-1}=\frac{x-1+4x}{x(x-1)}=\frac{5x-1}{x(x-1)}$.`,
        },
        {
          id: 's11.razionali.L1.e7', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^1\frac{x}{x^2+1}\,dx$`,
          answer: '(1/2)*log(2)', _int: ['x/(x^2+1)', 0, 1],
          explain: String.raw`Numeratore uguale alla metà della derivata del denominatore: $\frac12\left[\log(x^2+1)\right]_0^1=\frac12\log2$.`,
        },
        {
          id: 's11.razionali.L1.e8', type: 'expr', level: 2, upToConstant: true, domain: [1.5, 3],
          prompt: String.raw`$\displaystyle\int\frac{x^3}{x^2-1}\,dx$ (per $x>1$)`,
          answer: 'x^2/2+(1/2)*log(x^2-1)', _f: 'x^3/(x^2-1)',
          explain: String.raw`Divido: $x^3=x(x^2-1)+x$, quindi $\frac{x^3}{x^2-1}=x+\frac{x}{x^2-1}$. Il secondo pezzo ha numeratore uguale alla metà della derivata del denominatore: $\frac12\log(x^2-1)$.`,
        },
      ],
    },
    {
      id: 's11.razionali.L2',
      title: 'Decomposizione in fratti semplici',
      cards: [
        {
          type: 'learn',
          title: 'Radici distinte: trovare A e B',
          body: String.raw`Se $D=(x-a)(x-b)$ con $a\neq b$, scrivo
$$\frac{N(x)}{(x-a)(x-b)}=\frac{A}{x-a}+\frac{B}{x-b}\qquad\Longrightarrow\qquad N(x)=A(x-b)+B(x-a).$$

Per trovare $A$ pongo $x=a$: il termine con $B$ si annulla e resta $A=\dfrac{N(a)}{a-b}$. Analogamente $B=\dfrac{N(b)}{b-a}$.

Idea: sostituendo una radice alla volta, un solo coefficiente sopravvive. Non serve risolvere un sistema.`,
        },
        {
          type: 'example',
          title: 'Esempio con dissolvenza: $\\int\\frac{3x+5}{(x-1)(x+2)}\\,dx$',
          problem: String.raw`Calcola $\displaystyle\int\frac{3x+5}{(x-1)(x+2)}\,dx$ per $x>1$.`,
          steps: [
            String.raw`Grado del numeratore $1$, del denominatore $2$: niente divisione. Radici del denominatore: $1$ e $-2$.`,
            String.raw`Scrivo $\dfrac{3x+5}{(x-1)(x+2)}=\dfrac{A}{x-1}+\dfrac{B}{x+2}$, cioè $3x+5=A(x+2)+B(x-1)$.`,
            String.raw`Pongo $x=1$: $8=3A$, quindi $A=\dfrac83$. Pongo $x=-2$: $-1=-3B$, quindi $B=\dfrac13$.`,
            {
              text: String.raw`Integro: $\dfrac83\displaystyle\int\frac{dx}{x-1}+\dfrac13\displaystyle\int\frac{dx}{x+2}$.`,
              ask: { type: 'expr', prompt: String.raw`Una primitiva di $\dfrac{1}{x+2}$ per $x>1$?`, answer: 'log(x+2)', domain: [1.5, 3], upToConstant: true, _f: '1/(x+2)', explain: String.raw`$\int\frac{dx}{x+2}=\log|x+2|$, e per $x>1$ è $\log(x+2)$.` },
            },
            String.raw`Risultato: $\dfrac83\log(x-1)+\dfrac13\log(x+2)+c$.`,
          ],
          result: String.raw`$\displaystyle\int\frac{3x+5}{(x-1)(x+2)}\,dx=\frac83\log(x-1)+\frac13\log(x+2)+c$ per $x>1$`,
        },
        {
          id: 's11.razionali.L2.e1', type: 'expr', level: 2, upToConstant: true, domain: [1.5, 4],
          prompt: String.raw`$\displaystyle\int\frac{dx}{x^2-1}$ (per $x>1$)`,
          answer: '(1/2)*log((x-1)/(x+1))', _f: '1/(x^2-1)',
          explain: String.raw`$\frac1{x^2-1}=\frac12\left(\frac1{x-1}-\frac1{x+1}\right)$. Primitiva $\frac12\log\frac{x-1}{x+1}$ per $x>1$.`,
        },
        {
          id: 's11.razionali.L2.e2', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_2^3\frac{dx}{x^2-1}$`,
          answer: '(1/2)*log(3/2)', _int: ['1/(x^2-1)', 2, 3],
          explain: String.raw`$\frac12\left[\log\frac{x-1}{x+1}\right]_2^3=\frac12\left(\log\frac12-\log\frac13\right)=\frac12\log\frac32$.`,
        },
        {
          id: 's11.razionali.L2.e3', type: 'expr', level: 2, upToConstant: true, domain: [2.3, 4],
          prompt: String.raw`$\displaystyle\int\frac{x-1}{x^2-4}\,dx$ (per $x>2$)`,
          answer: '(1/4)*log(x-2)+(3/4)*log(x+2)', _f: '(x-1)/(x^2-4)',
          explain: String.raw`$A=\dfrac{N(2)}{2+2}=\dfrac14$ e $B=\dfrac{N(-2)}{-2-2}=\dfrac{-3}{-4}=\dfrac34$. Primitiva $\frac14\log(x-2)+\frac34\log(x+2)$.`,
        },
        {
          id: 's11.razionali.L2.e4', type: 'expr', level: 2, upToConstant: true, domain: [1.5, 4],
          prompt: String.raw`$\displaystyle\int\frac{x^2}{x^2-1}\,dx$ (per $x>1$)`,
          answer: 'x+(1/2)*log((x-1)/(x+1))', _f: 'x^2/(x^2-1)',
          explain: String.raw`Grado uguale: divido. $\frac{x^2}{x^2-1}=1+\frac1{x^2-1}$. Primitiva $x+\frac12\log\frac{x-1}{x+1}$. Errore tipico: integrare $\frac{x^2}{x^2-1}$ senza dividere.`,
        },
        {
          id: 's11.razionali.L2.e5', type: 'mcq', level: 2,
          prompt: String.raw`Per $\dfrac{N(x)}{(x-1)(x+1)}$ con $N(1)=4$ e $N(-1)=-2$, quali sono $A$ e $B$ in $\dfrac{A}{x-1}+\dfrac{B}{x+1}$?`,
          options: [String.raw`$A=2$, $B=1$`, String.raw`$A=4$, $B=-2$`, String.raw`$A=-2$, $B=1$`, String.raw`$A=2$, $B=-1$`],
          answer: 0,
          explain: String.raw`$A=\dfrac{N(1)}{1-(-1)}=\dfrac42=2$ e $B=\dfrac{N(-1)}{-1-1}=\dfrac{-2}{-2}=1$. Errore tipico: dimenticare di dividere per la differenza delle radici ($a-b$).`,
        },
        {
          id: 's11.razionali.L2.e6', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^1\frac{x}{(x+1)(x+2)}\,dx$`,
          answer: 'log(9/8)', _int: ['x/((x+1)*(x+2))', 0, 1],
          explain: String.raw`Fratti semplici: $\dfrac{x}{(x+1)(x+2)}=-\dfrac1{x+1}+\dfrac2{x+2}$. Primitiva $-\log(x+1)+2\log(x+2)$. Tra $0$ e $1$: $(2\log3-\log2)-2\log2=\log\frac98$.`,
        },
        {
          id: 's11.razionali.L2.e7', type: 'order', level: 2,
          prompt: String.raw`Ordina i passi per calcolare $\displaystyle\int\frac{dx}{x^2-4}$. Scarta i passi sbagliati.`,
          steps: [
            String.raw`Fattorizzo il denominatore: $x^2-4=(x-2)(x+2)$.`,
            String.raw`Scrivo $\dfrac1{(x-2)(x+2)}=\dfrac A{x-2}+\dfrac B{x+2}$.`,
            String.raw`Pongo $x=2$: $1=4A$, quindi $A=\dfrac14$; pongo $x=-2$: $1=-4B$, quindi $B=-\dfrac14$.`,
            String.raw`Integro: $\dfrac14\log|x-2|-\dfrac14\log|x+2|+c$.`,
          ],
          distractors: [String.raw`Integro direttamente $\dfrac1{x^2}-\dfrac14$ senza fattorizzare.`, String.raw`Scrivo $\dfrac1{(x-2)(x+2)}=\dfrac A{x-2}+\dfrac B{x-2}$ con lo stesso denominatore due volte.`],
          explain: String.raw`Prima si fattorizza il denominatore, poi si trovano $A$ e $B$ con le radici, infine si integra. Il metodo richiede radici distinte: due fratti con lo stesso denominatore non danno una decomposizione corretta.`,
        },
        {
          id: 's11.razionali.L2.e8', type: 'expr', level: 2, upToConstant: true, domain: [0.3, 2.5],
          prompt: String.raw`$\displaystyle\int\frac{dx}{x(x+3)}$ (per $x>0$)`,
          answer: '(1/3)*log(x/(x+3))', _f: '1/(x*(x+3))',
          explain: String.raw`$\frac1{x(x+3)}=\frac13\left(\frac1x-\frac1{x+3}\right)$. Primitiva $\frac13\log\frac{x}{x+3}$.`,
        },
      ],
    },
    {
      id: 's11.razionali.L3',
      title: 'Denominatori senza radici reali',
      cards: [
        {
          type: 'learn',
          title: 'Completare il quadrato',
          body: String.raw`Se $\Delta=p^2-4q<0$, il polinomio $x^2+px+q$ non ha radici reali e non si fattorizza in $\mathbb{R}$. Lo scrivo come quadrato più costante:
$$x^2+px+q=\left(x+\frac p2\right)^2+\frac{4q-p^2}{4}.$$

>* **Arcotangente.** Per $\beta>0$: $\displaystyle\int\frac{dx}{(x+\alpha)^2+\beta^2}=\frac1\beta\arctan\frac{x+\alpha}{\beta}+c$.

Se il numeratore è la derivata del denominatore ($2x+p$), il risultato è un logaritmo. Altrimenti lo spezzo in "derivata + costante".`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\int\\frac{2x+3}{x^2+2x+5}\\,dx$',
          problem: String.raw`Calcola $\displaystyle\int\frac{2x+3}{x^2+2x+5}\,dx$.`,
          steps: [
            String.raw`Il denominatore non ha radici reali ($\Delta=4-20<0$). Scrivo il numeratore come derivata del denominatore più una costante: $2x+3=(2x+2)+1$.`,
            String.raw`Quindi $\displaystyle\int\frac{2x+2}{x^2+2x+5}\,dx+\int\frac{dx}{x^2+2x+5}$.`,
            {
              text: String.raw`Il primo integrale dà $\log(x^2+2x+5)$. Il secondo: completo il quadrato, $x^2+2x+5=(x+1)^2+4$.`,
              ask: { type: 'expr', prompt: String.raw`Una primitiva di $\dfrac{1}{(x+1)^2+4}$ rispetto a $x$?`, answer: 'atan((x+1)/2)/2', upToConstant: true, _f: '1/((x+1)^2+4)', explain: String.raw`$\frac1{(x+1)^2+4}=\frac14\cdot\frac1{1+\left(\frac{x+1}2\right)^2}$: primitiva $\frac14\cdot2\arctan\frac{x+1}2=\frac12\arctan\frac{x+1}2$.` },
            },
            String.raw`Risultato: $\log(x^2+2x+5)+\dfrac12\arctan\dfrac{x+1}2+c$.`,
          ],
          result: String.raw`$\displaystyle\int\frac{2x+3}{x^2+2x+5}\,dx=\log(x^2+2x+5)+\frac12\arctan\frac{x+1}2+c$`,
        },
        {
          id: 's11.razionali.L3.e1', type: 'expr', level: 1, upToConstant: true,
          prompt: String.raw`$\displaystyle\int\frac{dx}{x^2+4}$`,
          answer: '(1/2)*atan(x/2)', _f: '1/(x^2+4)',
          explain: String.raw`Con $\alpha=0$ e $\beta=2$: $\frac12\arctan\frac x2$.`,
        },
        {
          id: 's11.razionali.L3.e2', type: 'expr', level: 2, upToConstant: true,
          prompt: String.raw`$\displaystyle\int\frac{x}{x^2+2x+2}\,dx$`,
          answer: '(1/2)*log(x^2+2*x+2)-atan(x+1)', _f: 'x/(x^2+2*x+2)',
          explain: String.raw`Scrivo $x=(x+1)-1$: il primo pezzo, con numeratore $x+1$ metà della derivata $2x+2$, dà $\frac12\log(x^2+2x+2)$; il secondo, $-\int\frac{dx}{(x+1)^2+1}$, dà $-\arctan(x+1)$.`,
        },
        {
          id: 's11.razionali.L3.e3', type: 'num', level: 2,
          prompt: String.raw`$\displaystyle\int_0^1\frac{dx}{x^2+2x+2}$`,
          answer: 'atan(2)-pi/4', _int: ['1/(x^2+2*x+2)', 0, 1],
          explain: String.raw`$x^2+2x+2=(x+1)^2+1$, quindi la primitiva è $\arctan(x+1)$. Tra $0$ e $1$: $\arctan2-\arctan1=\arctan2-\frac\pi4$.`,
        },
        {
          id: 's11.razionali.L3.e4', type: 'mcq', level: 2,
          prompt: String.raw`Quale è una primitiva di $\dfrac{1}{x^2+9}$?`,
          options: [String.raw`$\frac13\arctan\frac x3$`, String.raw`$\arctan\frac x9$`, String.raw`$\frac19\arctan\frac x3$`, String.raw`$\log(x^2+9)$`],
          answer: 0,
          explain: String.raw`Con $\beta=3$: $\frac1\beta\arctan\frac x\beta=\frac13\arctan\frac x3$. Errore tipico: dimenticare il fattore $\frac1\beta$ o usare $\beta^2$ al posto di $\beta$.`,
        },
        {
          id: 's11.razionali.L3.e5', type: 'expr', level: 3, upToConstant: true,
          prompt: String.raw`$\displaystyle\int\frac{dx}{x^2-x+1}$`,
          answer: '(2/sqrt(3))*atan((2*x-1)/sqrt(3))', _f: '1/(x^2-x+1)',
          explain: String.raw`$x^2-x+1=\left(x-\frac12\right)^2+\frac34$. Con $\beta=\frac{\sqrt3}2$: primitiva $\frac{2}{\sqrt3}\arctan\frac{2x-1}{\sqrt3}$.`,
          source: 'Variante di Appello 03/09/2026 · Parte B',
        },
        {
          id: 's11.razionali.L3.e6', type: 'num', level: 3,
          prompt: String.raw`$\displaystyle\int_0^1\frac{dx}{x^2-x+1}$`,
          answer: '2*pi/(3*sqrt(3))', _int: ['1/(x^2-x+1)', 0, 1],
          explain: String.raw`Primitiva $\frac2{\sqrt3}\arctan\frac{2x-1}{\sqrt3}$. Tra $0$ e $1$: $\frac2{\sqrt3}\left(\frac\pi6+\frac\pi6\right)=\frac{2\pi}{3\sqrt3}$.`,
          source: 'Variante di Appello 03/09/2026 · Parte B',
        },
        {
          id: 's11.razionali.L3.e7', type: 'problem', level: 3, points: 4,
          prompt: String.raw`Calcola $\displaystyle\int_0^1\frac{2x+1}{x^2+2x+5}\,dx$, scomponendo il numeratore.`,
          parts: [
            { type: 'num', prompt: String.raw`Quanto vale $\displaystyle\int_0^1\frac{2x+2}{x^2+2x+5}\,dx$?`, answer: 'log(8/5)', _int: ['(2*x+2)/(x^2+2*x+5)', 0, 1], explain: String.raw`Numeratore derivata del denominatore: $\left[\log(x^2+2x+5)\right]_0^1=\log8-\log5=\log\frac85$.` },
            { type: 'num', prompt: String.raw`Quanto vale $\displaystyle\int_0^1\frac{dx}{(x+1)^2+4}$?`, answer: '(1/2)*(pi/4-atan(1/2))', _int: ['1/((x+1)^2+4)', 0, 1], explain: String.raw`Primitiva $\frac12\arctan\frac{x+1}2$. Tra $0$ e $1$: $\frac12\left(\arctan1-\arctan\frac12\right)=\frac12\left(\frac\pi4-\arctan\frac12\right)$.` },
            { type: 'num', prompt: String.raw`Quanto vale l'integrale finale $\displaystyle\int_0^1\frac{2x+1}{x^2+2x+5}\,dx$?`, answer: 'log(8/5)-(1/2)*(pi/4-atan(1/2))', _int: ['(2*x+1)/(x^2+2*x+5)', 0, 1], explain: String.raw`$2x+1=(2x+2)-1$: il risultato è il primo integrale meno il secondo.` },
          ],
          solution: String.raw`$2x+1=(2x+2)-1$, quindi l'integrale è $\displaystyle\int_0^1\frac{2x+2}{x^2+2x+5}\,dx-\int_0^1\frac{dx}{(x+1)^2+4}=\log\frac85-\frac12\left(\frac\pi4-\arctan\frac12\right)$.

>! Attenzione: il secondo termine si sottrae. Il valore numerico è circa $0{,}309$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's11.razionali.p1', type: 'mcq', level: 1,
      prompt: String.raw`Quale tipo di termine nella decomposizione dà un arcotangente?`,
      options: [String.raw`$\dfrac{A}{x-a}$`, String.raw`$\dfrac{A}{(x-a)^2}$`, String.raw`$\dfrac{Ax+B}{x^2+px+q}$ con $p^2-4q<0$`, String.raw`$\dfrac{A}{x-a}+\dfrac{B}{x-b}$ con $a\neq b$`],
      answer: 2,
      explain: String.raw`Il denominatore irriducibile di secondo grado, con numeratore di primo grado, dà un logaritmo e un arcotangente. Gli altri tre danno solo logaritmi o potenze.`,
    },
    {
      id: 's11.razionali.p2', type: 'tf', level: 1,
      prompt: String.raw`Se il grado del numeratore è minore di quello del denominatore, non serve dividere.`,
      answer: true,
      explain: String.raw`Vero: la divisione è necessaria solo se il grado di $N$ è maggiore o uguale a quello di $D$.`,
    },
    {
      id: 's11.razionali.p3', type: 'cloze', level: 1,
      prompt: 'Completa la decomposizione.',
      text: String.raw`$\dfrac1{x^2-1}=\dfrac{A}{x-1}+\dfrac{B}{x+1}$ con $A=$ [[0]] e $B=$ [[1]].`,
      blanks: [
        { options: [String.raw`$\frac12$`, String.raw`$-\frac12$`, String.raw`$1$`], answer: 0 },
        { options: [String.raw`$\frac12$`, String.raw`$-\frac12$`, String.raw`$-1$`], answer: 1 },
      ],
      explain: String.raw`Con $x=1$: $1=2A$, quindi $A=\frac12$. Con $x=-1$: $1=-2B$, quindi $B=-\frac12$.`,
    },
    {
      id: 's11.razionali.p4', type: 'order', level: 2,
      prompt: String.raw`Ordina i passi per calcolare $\displaystyle\int\frac{x+3}{x^2+2x+3}\,dx$. Scarta i passi sbagliati.`,
      steps: [
        String.raw`Completo il quadrato: $x^2+2x+3=(x+1)^2+2$.`,
        String.raw`Scrivo il numeratore come derivata del denominatore più una costante: $x+3=\frac12(2x+2)+2$.`,
        String.raw`Il primo pezzo dà $\frac12\log(x^2+2x+3)$.`,
        String.raw`Il secondo dà $2\cdot\frac1{\sqrt2}\arctan\frac{x+1}{\sqrt2}=\sqrt2\arctan\frac{x+1}{\sqrt2}$.`,
      ],
      distractors: [String.raw`Integro direttamente $\frac{x}{x^2+2x+3}+\frac{3}{x^2+2x+3}$ e ottengo due logaritmi.`, String.raw`Scrivo $\dfrac{x+3}{x^2+2x+3}=\dfrac A{x+1}+\dfrac B{x+3}$.`],
      explain: String.raw`Il denominatore non ha radici reali: non si può fare la decomposizione in fratti semplici con radici. Il percorso giusto è completare il quadrato e spezzare il numeratore.`,
    },
    {
      id: 's11.razionali.p5', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\int_0^1\frac{x}{x^2+1}\,dx$`,
      answer: '(1/2)*log(2)', _int: ['x/(x^2+1)', 0, 1],
      explain: String.raw`Metà della derivata del denominatore: $\frac12\log2$.`,
    },
    {
      id: 's11.razionali.p6', type: 'expr', level: 2, upToConstant: true, domain: [2.3, 4],
      prompt: String.raw`$\displaystyle\int\frac{x-1}{x^2-4}\,dx$ (per $x>2$)`,
      answer: '(1/4)*log(x-2)+(3/4)*log(x+2)', _f: '(x-1)/(x^2-4)',
      explain: String.raw`Come nell'esercizio della seconda lezione: $\frac14$ per $\frac1{x-2}$ e $\frac34$ per $\frac1{x+2}$.`,
    },
    {
      id: 's11.razionali.p7', type: 'expr', level: 2, upToConstant: true,
      prompt: String.raw`$\displaystyle\int\frac{dx}{x^2+6x+10}$`,
      answer: 'atan(x+3)', _f: '1/(x^2+6*x+10)',
      explain: String.raw`$x^2+6x+10=(x+3)^2+1$: la primitiva è $\arctan(x+3)$.`,
    },
    {
      id: 's11.razionali.p8', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\int_0^1\frac{dx}{(x+2)(x+3)}$`,
      answer: 'log(9/8)', _int: ['1/((x+2)*(x+3))', 0, 1],
      explain: String.raw`$\frac1{(x+2)(x+3)}=\frac1{x+2}-\frac1{x+3}$. Primitiva $\log\frac{x+2}{x+3}$; tra $0$ e $1$: $\log\frac34-\log\frac23=\log\frac98$.`,
    },
    {
      id: 's11.razionali.p9', type: 'expr', level: 2, upToConstant: true, domain: [2.3, 4],
      prompt: String.raw`$\displaystyle\int\frac{5x+1}{x^2-x-2}\,dx$ (per $x>2$)`,
      answer: '(11/3)*log(x-2)+(4/3)*log(x+1)', _f: '(5*x+1)/(x^2-x-2)',
      explain: String.raw`$x^2-x-2=(x-2)(x+1)$. Con $A=\dfrac{11}{3}$ (in $x=2$) e $B=\dfrac43$ (in $x=-1$): primitiva $\frac{11}3\log(x-2)+\frac43\log(x+1)$.`,
    },
    {
      id: 's11.razionali.gen-fratti', type: 'gen', level: 1,
      gen: (R) => {
        const a = R.int(0, 3), b = a + R.int(1, 3);
        const L = (c) => (c === 0 ? 'x' : `(x-${c})`);
        const Ls = (c) => (c === 0 ? 'x' : `x-${c}`);
        return {
          type: 'expr', upToConstant: true, domain: [b + 0.3, b + 2.5],
          prompt: String.raw`$\displaystyle\int\frac{dx}{${L(a)}${L(b)}}$ (per $x>${b}$)`,
          answer: `log((x-${a})/(x-${b}))/(${a - b})`, _f: `1/((x-${a})*(x-${b}))`,
          explain: String.raw`Decomposizione: $\frac{1}{${L(a)}${L(b)}}=\frac{1}{${a - b}}\left(\frac{1}{${Ls(a)}}-\frac{1}{${Ls(b)}}\right)$. Primitiva $\frac{1}{${a - b}}\log\frac{${Ls(a)}}{${Ls(b)}}$ per $x>${b}$.`,
        };
      },
    },
    {
      id: 's11.razionali.gen-quadratico', type: 'gen', level: 2,
      gen: (R) => {
        const k = R.nz(-3, 3), m = R.int(-4, 4), c = R.int(1, 3);
        return {
          type: 'expr', upToConstant: true,
          prompt: String.raw`$\displaystyle\int\frac{${H.lin(k, m)}}{x^2+${c * c}}\,dx$`,
          answer: `(${k}/2)*log(x^2+${c * c})+(${m}/${c})*atan(x/${c})`, _f: `(${k}*x+(${m}))/(x^2+${c * c})`,
          explain: String.raw`$${H.lin(k, m)}=\frac{${k}}2(2x)${m === 0 ? '' : m < 0 ? ` - ${-m}` : ` + ${m}`}$. Il primo pezzo dà $\frac{${k}}2\log(x^2+${c * c})$; il secondo, $${m}\int\frac{dx}{x^2+${c * c}}$, dà $\frac{${m}}{${c}}\arctan\frac x${c}$.`,
        };
      },
    },
    {
      id: 's11.razionali.gen-definito', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(-2, 1), p = a + R.int(1, 3), q = p + R.int(1, 3);
        const sh = a === 0 ? 'x' : (a > 0 ? `(x-${a})` : `(x+${-a})`);
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\int_{${p}}^{${q}}\frac{dx}{${sh}^2}$`,
          answer: H.fracStr(q - p, (p - a) * (q - a)), _int: [`1/(x-(${a}))^2`, p, q],
          explain: String.raw`Primitiva $-\frac{1}{${sh}}$. Tra $${p}$ e $${q}$: $\frac{1}{${p - a}}-\frac{1}{${q - a}}=${H.frac(q - p, (p - a) * (q - a))}$.`,
        };
      },
    },
    {
      id: 's11.razionali.gen-divisione', type: 'gen', level: 2,
      gen: (R) => {
        const b = R.int(0, 2), c = R.int(1, 4);
        const den = b === 0 ? 'x' : `x-${b}`;
        const Lb = b === 0 ? 'x' : `x-${b}`;
        const Ls = b === 0 ? 'x' : `x-${b}`;
        const qT = b === 0 ? 'x' : `x+${b}`;
        return {
          type: 'expr', upToConstant: true, domain: [b + 0.3, b + 2.5],
          prompt: String.raw`$\displaystyle\int\frac{x^2+${c}}{${den}}\,dx$ (per $x>${b}$)`,
          answer: `x^2/2+(${b})*x+(${b * b + c})*log(${Lb})`, _f: `(x^2+${c})/(${Lb})`,
          explain: String.raw`$x^2+${c}=(${Ls})(${qT})+${b * b + c}$, quindi $\frac{x^2+${c}}{${den}}=${qT}+\frac{${b * b + c}}{${den}}$. Integrando: $\frac{x^2}2${b === 0 ? '' : ` + ${b}x`}+${b * b + c}\log(${Lb})$.`,
        };
      },
    },
  ],
  flashcards: [
    { id: 's11.razionali.fc1', kind: 'def', front: 'Funzione razionale fratta', back: String.raw`$\frac{N(x)}{D(x)}$ con $N$ e $D$ polinomi e $D\neq0$.` },
    { id: 's11.razionali.fc2', kind: 'metodo', front: 'Metodo per integrare una razionale', back: String.raw`1) Se grado $N\geq$ grado $D$, divido; 2) fattorizzo $D$; 3) scrivo i fratti semplici; 4) integro ogni pezzo.` },
    { id: 's11.razionali.fc3', kind: 'formula', front: 'Primitive dei fratti semplici', back: String.raw`$\int\frac{A}{x-a}=A\log|x-a|+c$; $\int\frac{A}{(x-a)^k}=\frac{A}{(1-k)(x-a)^{k-1}}+c$ per $k\geq2$.` },
    { id: 's11.razionali.fc4', kind: 'formula', front: 'Arcotangente per denominatore irriducibile', back: String.raw`$\displaystyle\int\frac{dx}{(x+\alpha)^2+\beta^2}=\frac1\beta\arctan\frac{x+\alpha}\beta+c$, $\beta>0$.` },
    { id: 's11.razionali.fc5', kind: 'metodo', front: 'Trovare $A$ e $B$ con radici distinte', back: String.raw`Se $D=(x-a)(x-b)$: $A=\frac{N(a)}{a-b}$ e $B=\frac{N(b)}{b-a}$ (sostituisco una radice alla volta).` },
    { id: 's11.razionali.fc6', kind: 'formula', front: 'Numeratore derivata del denominatore', back: String.raw`$\displaystyle\int\frac{f'}{f}=\log|f|+c$; per esempio $\int\frac{2x+p}{x^2+px+q}=\log|x^2+px+q|+c$.` },
    { id: 's11.razionali.fc7', kind: 'errore', front: 'Errori tipici con le razionali', back: String.raw`Dimenticare la divisione quando il grado di $N$ è maggiore o uguale a quello di $D$; sbagliare il segno dei fratti semplici; usare $\arctan$ quando $\Delta\geq0$.` },
  ],
};

export default {
  id: 's11',
  title: 'Integrali',
  subtitle: 'Riemann, primitive, tecniche di integrazione, aree',
  intro: String.raw`All'esame c'è quasi sempre un integrale: una primitiva per parti o di una razionale, un'area, o un integrale improprio. Qui costruisci tutto: dal significato di area fino alle tecniche di calcolo.`,
  skills: [riemann, immediati, parti, sost, razionali],
};
