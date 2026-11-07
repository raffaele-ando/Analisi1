import { H } from '../engine/tex.js';

// Sezione s02 · Numeri complessi.
// Le skill sono aggiunte in fondo con S.push(...): l'array viene riempito durante il caricamento del modulo.
const S = [];

export default {
  id: 's02',
  title: 'Numeri complessi',
  subtitle: 'Forma algebrica, forma trigonometrica, radici, equazioni in ℂ',
  intro: String.raw`I numeri complessi risolvono equazioni che in $\R$ non hanno soluzione, come $z^2=-9$. Compaiono in quasi tutti i temi recenti, in **Parte A** (definizioni, formule) e in **Parte B** (equazioni in $\C$ con $\bar z$, radici n-esime, potenze). Gli argomenti chiave sono la forma algebrica, il coniugato, il modulo, la forma esponenziale e le radici.`,
  skills: S,
};

// ---------------------------------------------------------------------------
// s02.algebrica
// ---------------------------------------------------------------------------
S.push({
  id: 's02.algebrica',
  title: 'Forma algebrica, coniugato, modulo, divisione',
  summary: String.raw`Saprai scrivere $z=a+ib$, sommare, moltiplicare e dividere complessi, calcolare coniugato e modulo e leggere $z$ sul piano di Gauss.`,
  prereq: ['s00.numeri', 's00.equazioni'],
  examRefs: ['Itinere 11/11/2025 · B5', 'Appello 15/01/2026 · B2'],
  lessons: [
    {
      id: 's02.algebrica.L1',
      title: 'Il numero i e la forma algebrica',
      cards: [
        { type: 'learn', title: 'Perché servono i complessi',
          body: String.raw`In $\R$ l'equazione $x^2=-1$ non ha soluzioni: il quadrato di un numero reale non è mai negativo. Per risolverla si introduce un nuovo simbolo $i$ con

$$i^2=-1.$$

Con $i$ si costruisce l'insieme dei **numeri complessi** $\C$. Ogni complesso si scrive nella **forma algebrica**

$$z=a+ib,\qquad a,b\in\R,$$

dove $a=\operatorname{Re}z$ è la **parte reale** e $b=\operatorname{Im}z$ è la **parte immaginaria**. Attenzione: $\operatorname{Im}z$ è il numero reale $b$, non $ib$.

Un reale $a$ è il complesso $a+0\,i$. Quindi $\R\subset\C$.` },
        { type: 'learn', title: 'Uguaglianza tra complessi',
          body: String.raw`>* **Uguaglianza.** $a+ib=c+id$ se e solo se $a=c$ e $b=d$.

Questo principio è lo strumento base per risolvere le equazioni in $\C$: si separano parte reale e parte immaginaria e si ottiene un sistema di due equazioni reali.` },
        { type: 'example', title: 'Esempio svolto',
          problem: String.raw`Trova $a,b\in\R$ tali che $(a+1)+i(b-2)=3+4i$.`,
          steps: [
            String.raw`Per l'uguaglianza confronto le parti reali: $a+1=3$, quindi $a=2$.`,
            String.raw`Confronto le parti immaginarie: $b-2=4$, quindi $b=6$.`,
          ],
          result: String.raw`$a=2$ e $b=6$.` },
        { id: 's02.algebrica.L1.e1', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $i^3$?`,
          options: [String.raw`$-i$`, String.raw`$i$`, String.raw`$-1$`, String.raw`$1$`],
          answer: 0,
          explain: String.raw`$i^3=i^2\cdot i=-i$. Errore tipico: scrivere $i$ (sbagliando il segno) oppure $-1$ (confondendo $i^3$ con $i^2$).` },
        { id: 's02.algebrica.L1.e2', type: 'num', level: 1,
          prompt: String.raw`Calcola $i^{27}$.`,
          answer: '-i',
          explain: String.raw`Le potenze di $i$ si ripetono ogni 4: $27=4\cdot6+3$, quindi $i^{27}=(i^4)^6\,i^3=i^3=-i$.` },
        { id: 's02.algebrica.L1.e3', type: 'set', level: 1,
          prompt: String.raw`Scrivi le due soluzioni di $z^2=-9$ separate da punto e virgola. Usa i per l'unità immaginaria.`,
          answer: ['3i', '-3i'],
          explain: String.raw`$z^2=-9$ dà $z=\pm\sqrt{-9}=\pm 3i$, perché $(3i)^2=9i^2=-9$.` },
        { id: 's02.algebrica.L1.e4', type: 'tf', level: 1,
          prompt: String.raw`Il numero complesso $3+0\,i$ è un numero reale.`,
          answer: true,
          explain: String.raw`Un complesso con parte immaginaria nulla è un reale: $3+0\,i=3$.` },
        { id: 's02.algebrica.L1.e5', type: 'mcq', level: 1,
          prompt: String.raw`Quale numero complesso ha parte reale $2$ e parte immaginaria $-3$?`,
          options: [String.raw`$2-3i$`, String.raw`$-3+2i$`, String.raw`$2+3i$`, String.raw`$3-2i$`],
          answer: 0,
          explain: String.raw`Parte reale $2$, parte immaginaria $-3$ (con il suo segno): $z=2+(-3)i=2-3i$. Errore tipico: scambiare parte reale e immaginaria, cioè scrivere $-3+2i$.` },
        { id: 's02.algebrica.L1.e6', type: 'match', level: 1,
          prompt: String.raw`Abbina ogni numero complesso alla sua parte reale o immaginaria.`,
          pairs: [
            [String.raw`$z=3+4i$`, String.raw`$\operatorname{Re}z=3$`],
            [String.raw`$z=-i$`, String.raw`$\operatorname{Im}z=-1$`],
            [String.raw`$z=5$`, String.raw`$\operatorname{Im}z=0$`],
            [String.raw`$z=2i$`, String.raw`$\operatorname{Re}z=0$`],
          ],
          explain: String.raw`Il reale $5$ ha parte immaginaria nulla. Il numero $-i$ ha parte immaginaria $-1$ e parte reale $0$: non va confuso con $i$.` },
        { id: 's02.algebrica.L1.e7', type: 'cloze', level: 1,
          prompt: String.raw`Completa: se $z=a+ib$ con $a,b\in\R$.`,
          text: String.raw`Se $z=a+ib$ allora $\operatorname{Re}z=$ [[0]] e $\operatorname{Im}z=$ [[1]].`,
          blanks: [
            { options: [String.raw`$a$`, String.raw`$b$`, String.raw`$ib$`], answer: 0 },
            { options: [String.raw`$a$`, String.raw`$b$`, String.raw`$ib$`], answer: 1 },
          ],
          explain: String.raw`La parte immaginaria è il reale $b$, senza la $i$ che lo accompagna.` },
      ],
    },
    {
      id: 's02.algebrica.L2',
      title: 'Somma, prodotto, coniugato e modulo',
      cards: [
        { type: 'learn', title: 'Somma e prodotto',
          body: String.raw`La **somma** si fa sommando separatamente parti reali e parti immaginarie:
$$(a+ib)+(c+id)=(a+c)+i(b+d).$$

Il **prodotto** si fa con la proprietà distributiva, ricordando $i^2=-1$:
$$(a+ib)(c+id)=(ac-bd)+i(ad+bc).$$

Non si confrontano i numeri complessi con $<$ o $>$: il complesso non ha un ordine naturale.` },
        { type: 'example', title: 'Esempio svolto',
          problem: String.raw`Calcola $(2+3i)(1-i)$ in forma algebrica.`,
          steps: [
            String.raw`Distributiva: $2\cdot1+2\cdot(-i)+3i\cdot1+3i\cdot(-i)=2-2i+3i-3i^2$.`,
            { text: String.raw`Riduco le potenze di $i$ e raccolgo: $-3i^2$ vale $3$, quindi il risultato è $2+3+(-2+3)i$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $-3i^2$?`, answer: '3', explain: String.raw`$i^2=-1$, quindi $-3i^2=-3\cdot(-1)=3$.` } },
          ],
          result: String.raw`$(2+3i)(1-i)=5+i$.` },
        { type: 'learn', title: 'Coniugato e modulo',
          body: String.raw`Il **coniugato** di $z=a+ib$ è $\bar z=a-ib$: cambia solo il segno della parte immaginaria.

Il **modulo** è la lunghezza del vettore associato, cioè la distanza di $z$ dall'origine:
$$|z|=\sqrt{a^2+b^2}\ \ge 0.$$

Le due identità che servono sempre:
- $z\,\bar z=a^2+b^2=|z|^2$ (è sempre reale e non negativo);
- $\operatorname{Re}z=\dfrac{z+\bar z}{2}$ e $\operatorname{Im}z=\dfrac{z-\bar z}{2i}$.

>! Errore tipico: $|z+w|$ non è in generale $|z|+|w|$.` },
        { id: 's02.algebrica.L2.e1', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $\overline{3-4i}$?`,
          options: [String.raw`$3+4i$`, String.raw`$-3+4i$`, String.raw`$-3-4i$`, String.raw`$3-4i$`],
          answer: 0,
          explain: String.raw`Il coniugato cambia solo il segno della parte immaginaria: $\overline{3-4i}=3+4i$. Errore tipico: cambiare anche la parte reale ($-3+4i$).` },
        { id: 's02.algebrica.L2.e2', type: 'num', level: 1,
          prompt: String.raw`Calcola $|3+4i|$.`,
          answer: '5',
          explain: String.raw`$|3+4i|=\sqrt{3^2+4^2}=\sqrt{25}=5$. Il modulo è sempre un reale non negativo.` },
        { id: 's02.algebrica.L2.e3', type: 'tuple', level: 2, labels: ['Re', 'Im'],
          prompt: String.raw`Scrivi $(2+3i)(1-i)$ in forma algebrica: indica parte reale e parte immaginaria.`,
          answer: ['5', '1'],
          explain: String.raw`Il risultato è $5+i$: parte reale $5$, parte immaginaria $1$ (il coefficiente di $i$, senza la $i$).` },
        { id: 's02.algebrica.L2.g1', type: 'gen', level: 2,
          gen: (R) => {
            const a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-4, 4), d = R.nz(-4, 4);
            const re = a * c - b * d;
            const im = a * d + b * c;
            return {
              type: 'tuple',
              labels: ['Re', 'Im'],
              answer: [String(re), String(im)],
              prompt: String.raw`Calcola $(${H.cplx(a, b)})(${H.cplx(c, d)})$ e scrivi parte reale e parte immaginaria.`,
              explain: String.raw`Distributiva e $i^2=-1$: $(ac-bd)+i(ad+bc)$. Qui $\operatorname{Re}=${re}$ e $\operatorname{Im}=${im}$.`,
            };
          } },
        { id: 's02.algebrica.L2.g2', type: 'gen', level: 2,
          gen: (R) => {
            const a = R.nz(-6, 6), b = R.nz(-6, 6), n = a * a + b * b;
            return {
              type: 'num',
              answer: `sqrt(${n})`,
              prompt: String.raw`Calcola $|${H.cplx(a, b)}|$.`,
              explain: String.raw`$|z|=\sqrt{(${a})^2+(${b})^2}=\sqrt{${n}}=${H.sqrtTex(n)}$.`,
            };
          } },
        { id: 's02.algebrica.L2.e4', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $z\in\C$ vale $z\,\bar z=|z|^2$.`,
          answer: true,
          explain: String.raw`Se $z=a+ib$: $z\bar z=(a+ib)(a-ib)=a^2+b^2=|z|^2$.` },
        { id: 's02.algebrica.L2.e5', type: 'tf', level: 2,
          prompt: String.raw`Per ogni $z,w\in\C$ vale $|z+w|=|z|+|w|$.`,
          answer: false,
          explain: String.raw`È falso. Controesempio: $z=1$, $w=i$: $|1+i|=\sqrt2\neq 2=|1|+|i|$. Vale solo la disuguaglianza $|z+w|\le|z|+|w|$.` },
      ],
    },
    {
      id: 's02.algebrica.L3',
      title: 'Divisione e piano di Gauss',
      cards: [
        { type: 'learn', title: 'Divisione: si usa il coniugato',
          body: String.raw`Per dividere per un complesso $w\neq0$ si moltiplicano numeratore e denominatore per il **coniugato** $\bar w$. Il denominatore diventa reale:
$$\frac{z}{w}=\frac{z\,\bar w}{w\,\bar w}=\frac{z\,\bar w}{|w|^2}.$$

In particolare $\dfrac1z=\dfrac{\bar z}{|z|^2}$.` },
        { type: 'example', title: 'Esempio svolto',
          problem: String.raw`Scrivi $\dfrac{1+2i}{3-4i}$ in forma algebrica.`,
          steps: [
            String.raw`Moltiplico sopra e sotto per il coniugato del denominatore, $3+4i$: $\dfrac{(1+2i)(3+4i)}{(3-4i)(3+4i)}$.`,
            { text: String.raw`Il denominatore è $(3-4i)(3+4i)=9+16$, quindi è reale.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $(3-4i)(3+4i)$?`, answer: '25', explain: String.raw`È $|3-4i|^2=3^2+4^2=25$.` } },
            String.raw`Numeratore: $(1+2i)(3+4i)=3+4i+6i+8i^2=-5+10i$.`,
          ],
          result: String.raw`$\dfrac{1+2i}{3-4i}=\dfrac{-5+10i}{25}=-\dfrac15+\dfrac25\,i$.` },
        { type: 'learn', title: 'Il piano di Gauss',
          body: String.raw`Ogni complesso $z=a+ib$ si rappresenta come il punto $(a,b)$ del piano, con l'asse orizzontale reale e l'asse verticale immaginario (**piano di Gauss**).

- $|z|$ è la distanza di $z$ dall'origine.
- $\bar z$ è il simmetrico di $z$ rispetto all'asse reale.
- $|z-w|$ è la distanza tra $z$ e $w$. Quindi $|z-w|=r$ descrive la circonferenza di centro $w$ e raggio $r$.` },
        { id: 's02.algebrica.L3.e1', type: 'mcq', level: 2,
          prompt: String.raw`Il punto di Gauss di $\bar z$, con $z=2+5i$, è:`,
          options: [String.raw`$(2,-5)$`, String.raw`$(-2,5)$`, String.raw`$(-2,-5)$`, String.raw`$(5,2)$`],
          answer: 0,
          explain: String.raw`Il coniugato è il simmetrico rispetto all'asse reale: $(2,5)\to(2,-5)$. $(-2,5)$ è il simmetrico rispetto all'asse immaginario, mentre $(5,2)$ scambia le coordinate.` },
        { id: 's02.algebrica.L3.e2', type: 'mcq', level: 2,
          prompt: String.raw`Il luogo dei punti $z\in\C$ con $|z|=2$ è:`,
          options: [String.raw`una circonferenza di centro $0$ e raggio $2$`, String.raw`una retta`, String.raw`una circonferenza di centro $2$ e raggio $0$`, String.raw`un solo punto`],
          answer: 0,
          explain: String.raw`$|z|=|z-0|=2$ significa distanza $2$ dall'origine: circonferenza di centro $0$ e raggio $2$.` },
        { id: 's02.algebrica.L3.e3', type: 'num', level: 2,
          prompt: String.raw`Calcola la distanza tra $z=1+i$ e $w=4+5i$, cioè $|z-w|$.`,
          answer: '5',
          explain: String.raw`$z-w=-3-4i$ e $|-3-4i|=\sqrt{9+16}=5$.` },
        { id: 's02.algebrica.L3.g1', type: 'gen', level: 2,
          gen: (R) => {
            const a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-4, 4), d = R.nz(-4, 4);
            const den = c * c + d * d;
            const re = a * c + b * d;
            const im = b * c - a * d;
            return {
              type: 'tuple',
              labels: ['Re', 'Im'],
              answer: [H.fracStr(re, den), H.fracStr(im, den)],
              prompt: String.raw`Scrivi in forma algebrica $\dfrac{${H.cplx(a, b)}}{${H.cplx(c, d)}}$: parte reale e parte immaginaria.`,
              explain: String.raw`Moltiplico per il coniugato del denominatore. Il numeratore diventa $${H.cplx(re, im)}$ e il denominatore $|w|^2=${den}$, quindi il risultato è $\dfrac{${H.cplx(re, im)}}{${den}}$.`,
            };
          } },
        { id: 's02.algebrica.L3.e4', type: 'tf', level: 2,
          prompt: String.raw`Un complesso $z$ è reale se e solo se $\bar z=z$.`,
          answer: true,
          explain: String.raw`Se $z=a+ib$ e $\bar z=a-ib$, l'uguaglianza $\bar z=z$ dà $b=0$, cioè $z=a\in\R$.` },
        { id: 's02.algebrica.L3.e5', type: 'tf', level: 2,
          prompt: String.raw`Se $|z|=0$ allora $z=0$.`,
          answer: true,
          explain: String.raw`$|z|=\sqrt{a^2+b^2}=0$ implica $a=b=0$.` },
        { id: 's02.algebrica.L3.g2', type: 'gen', level: 2,
          gen: (R) => {
            const a = R.nz(-5, 5), b = R.nz(-5, 5), n = a * a + b * b;
            return {
              type: 'num',
              answer: H.fracStr(a, n),
              prompt: String.raw`Calcola $\operatorname{Re}\left(\dfrac{1}{${H.cplx(a, b)}}\right)$.`,
              explain: String.raw`$\dfrac1z=\dfrac{\bar z}{|z|^2}=\dfrac{${H.cplx(a, -b)}}{${n}}$, quindi la parte reale è $${H.frac(a, n)}$.`,
            };
          } },
        { id: 's02.algebrica.L3.P1', type: 'problem', level: 3,
          prompt: String.raw`Sia $z=\dfrac{1+i\sqrt3}{1-i}$.`,
          parts: [
            { type: 'tuple', labels: ['Re', 'Im'], prompt: 'Scrivi $z$ in forma algebrica: parte reale e parte immaginaria.',
              answer: ['(1-sqrt(3))/2', '(1+sqrt(3))/2'],
              explain: String.raw`Moltiplico per $1+i$: $z=\dfrac{(1+i\sqrt3)(1+i)}{2}=\dfrac{1-\sqrt3}{2}+i\,\dfrac{1+\sqrt3}{2}$.` },
            { type: 'num', prompt: 'Calcola $|z|$.', answer: 'sqrt(2)',
              explain: String.raw`$|z|=\dfrac{|1+i\sqrt3|}{|1-i|}=\dfrac{2}{\sqrt2}=\sqrt2$.` },
            { type: 'mcq', prompt: 'In quale quadrante del piano di Gauss sta $z$?',
              options: [String.raw`Primo: $\operatorname{Re}z>0$ e $\operatorname{Im}z>0$`, String.raw`Secondo: $\operatorname{Re}z<0$ e $\operatorname{Im}z>0$`],
              answer: 1,
              explain: String.raw`$\operatorname{Re}z=\dfrac{1-\sqrt3}{2}<0$ e $\operatorname{Im}z>0$: il punto sta nel secondo quadrante.` },
          ],
          solution: String.raw`Moltiplico sopra e sotto per $1+i$: $z=\dfrac{1-\sqrt3}{2}+i\,\dfrac{1+\sqrt3}{2}$. Il modulo è $|z|=\sqrt{\dfrac{(1-\sqrt3)^2+(1+\sqrt3)^2}{4}}=\sqrt2$. Poiché $\operatorname{Re}z<0<\operatorname{Im}z$, il punto sta nel secondo quadrante.` },
      ],
    },
  ],
  practice: [
    { id: 's02.algebrica.p1', type: 'num', level: 1, prompt: String.raw`Calcola $i^{10}$.`, answer: '-1', explain: String.raw`$10=4\cdot2+2$, quindi $i^{10}=i^2=-1$.` },
    { id: 's02.algebrica.p2', type: 'num', level: 2, prompt: String.raw`Calcola $\operatorname{Im}\big((2+3i)^2\big)$.`, answer: '12',
      explain: String.raw`$(2+3i)^2=4+12i+9i^2=-5+12i$, quindi la parte immaginaria è $12$.` },
    { id: 's02.algebrica.p3', type: 'tf', level: 1, prompt: String.raw`Per ogni coppia di complessi $z,w$ vale $\overline{z\,w}=\bar z\,\bar w$.`, answer: true,
      explain: String.raw`Il coniugato rispetta prodotti e somme: $\overline{zw}=\bar z\,\bar w$ e $\overline{z+w}=\bar z+\bar w$.` },
    { id: 's02.algebrica.p4', type: 'set', level: 2, prompt: String.raw`Risolvi in $\C$ il sistema $z+\bar z=6$ e $z\bar z=10$. Separa le soluzioni con punto e virgola.`,
      answer: ['3+i', '3-i'],
      explain: String.raw`Con $z=a+ib$: $z+\bar z=2a=6$ dà $a=3$; $z\bar z=a^2+b^2=10$ dà $b^2=1$, cioè $b=\pm1$.` },
    { id: 's02.algebrica.p5', type: 'mcq', level: 2, prompt: String.raw`Quale tra queste affermazioni è vera per ogni $z\in\C$?`,
      options: [String.raw`$\operatorname{Re}z=\dfrac{z-\bar z}{2}$`, String.raw`$\operatorname{Re}z=\dfrac{z+\bar z}{2}$`, String.raw`$|z|=\operatorname{Re}z$`, String.raw`$z^2=|z|^2$`],
      answer: 1,
      explain: String.raw`$z+\bar z=2a$, quindi $\dfrac{z+\bar z}{2}=a=\operatorname{Re}z$. Il termine $z-\bar z$ è immaginario puro, non reale.` },
    { id: 's02.algebrica.p6', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-4, 4);
        return {
          type: 'tuple', labels: ['Re', 'Im'],
          answer: [String(a * a - b * b), String(2 * a * b)],
          prompt: String.raw`Calcola $\left(${H.cplx(a, b)}\right)^2$ in forma algebrica.`,
          explain: String.raw`$(a+ib)^2=a^2-b^2+2abi$, con $a=${a}$ e $b=${b}$.`,
        };
      } },
    { id: 's02.algebrica.p7', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-4, 4), d = R.nz(-4, 4);
        return {
          type: 'num',
          answer: H.fracStr(a * a + b * b, c * c + d * d),
          prompt: String.raw`Calcola $\left|\dfrac{${H.cplx(a, b)}}{${H.cplx(c, d)}}\right|^2$.`,
          explain: String.raw`$\left|\dfrac zw\right|^2=\dfrac{|z|^2}{|w|^2}=\dfrac{${a * a + b * b}}{${c * c + d * d}}$.`,
        };
      } },
    { id: 's02.algebrica.p8', type: 'gen', level: 3,
      gen: (R) => {
        const a = R.nz(-5, 5), b = R.nz(-5, 5), n = a * a + b * b;
        return {
          type: 'num',
          answer: H.fracStr(a, n),
          prompt: String.raw`Calcola $\operatorname{Re}\left(\dfrac{1}{${H.cplx(a, b)}}\right)$.`,
          explain: String.raw`$\dfrac1z=\dfrac{\bar z}{|z|^2}$ con $|z|^2=${n}$: la parte reale è $${H.frac(a, n)}$.`,
        };
      } },
    { id: 's02.algebrica.p9', type: 'cloze', level: 2,
      text: String.raw`Per $z\neq0$ vale $\dfrac1z=\dfrac{[[0]]}{[[1]]}$.`,
      blanks: [
        { options: [String.raw`$\bar z$`, String.raw`$z$`, String.raw`$|z|$`], answer: 0 },
        { options: [String.raw`$|z|^2$`, String.raw`$|z|$`, String.raw`$z^2$`], answer: 0 },
      ],
      explain: String.raw`Moltiplicando sopra e sotto per $\bar z$: $\dfrac{\bar z}{z\bar z}=\dfrac{\bar z}{|z|^2}$.` },
    { id: 's02.algebrica.p10', type: 'order', level: 2,
      prompt: String.raw`Ordina i passi per calcolare $\dfrac{2+i}{1-i}$.`,
      steps: [
        String.raw`Moltiplico sopra e sotto per il coniugato del denominatore, $1+i$.`,
        String.raw`Sviluppo il numeratore: $(2+i)(1+i)=2+2i+i+i^2=1+3i$.`,
        String.raw`Divido per $|1-i|^2=2$: il risultato è $\dfrac{1+3i}{2}=\dfrac12+\dfrac32i$.`,
      ],
      distractors: [String.raw`Divido separatamente parte reale e parte immaginaria: $\dfrac{2}{1}+\dfrac{i}{-1}$.`],
      explain: String.raw`Il coniugato va prima, poi lo sviluppo, poi la divisione per il modulo quadrato del denominatore. Il passo errato spezza la frazione termine per termine, ed è sbagliato.` },
    { id: 's02.algebrica.p11', type: 'open', level: 2,
      prompt: String.raw`Per $z=a+ib$ con $a,b\in\R$, dimostra che $\operatorname{Re}z=\dfrac{z+\bar z}{2}$ e $\operatorname{Im}z=\dfrac{z-\bar z}{2i}$.`,
      answer: String.raw`Con $\bar z=a-ib$: $z+\bar z=2a$ e $z-\bar z=2ib$. Dividendo per $2$ e per $2i$ si ottengono $a=\operatorname{Re}z$ e $b=\operatorname{Im}z$.`,
      rubric: ['Calcolo corretto di $\\bar z=a-ib$', 'Somma $z+\\bar z=2a$', 'Differenza $z-\\bar z=2ib$ e divisione per $2i$'],
      explain: String.raw`Due identità da ricordare sempre: sommando $z$ e $\bar z$ si annulla la parte immaginaria, sottraendoli si annulla quella reale.` },
  ],
  flashcards: [
    { id: 's02.algebrica.fc1', kind: 'def', front: String.raw`Numero complesso: definizione`,
      back: String.raw`$z=a+ib$ con $a,b\in\R$ e $i^2=-1$. $a=\operatorname{Re}z$ è la parte reale, $b=\operatorname{Im}z$ (reale) è la parte immaginaria.` },
    { id: 's02.algebrica.fc2', kind: 'def', front: String.raw`Uguaglianza tra complessi`,
      back: String.raw`$a+ib=c+id$ se e solo se $a=c$ e $b=d$.` },
    { id: 's02.algebrica.fc3', kind: 'def', front: String.raw`Coniugato di $z=a+ib$`,
      back: String.raw`$\bar z=a-ib$: si cambia solo il segno della parte immaginaria.` },
    { id: 's02.algebrica.fc4', kind: 'def', front: String.raw`Modulo di $z=a+ib$`,
      back: String.raw`$|z|=\sqrt{a^2+b^2}$, distanza di $z$ dall'origine nel piano di Gauss. È reale e non negativo.` },
    { id: 's02.algebrica.fc5', kind: 'formula', front: String.raw`Prodotto di complessi`,
      back: String.raw`$(a+ib)(c+id)=(ac-bd)+i(ad+bc)$.` },
    { id: 's02.algebrica.fc6', kind: 'formula', front: String.raw`Quoziente e reciproco di complessi`,
      back: String.raw`$\dfrac{z}{w}=\dfrac{z\bar w}{|w|^2}$ e $\dfrac1z=\dfrac{\bar z}{|z|^2}$, con $z,w\neq0$.` },
    { id: 's02.algebrica.fc7', kind: 'formula', front: String.raw`Identità del coniugato`,
      back: String.raw`$z\bar z=|z|^2$, $\overline{z+w}=\bar z+\bar w$, $\overline{zw}=\bar z\,\bar w$, $\bar{\bar z}=z$, $\operatorname{Re}z=\dfrac{z+\bar z}2$, $\operatorname{Im}z=\dfrac{z-\bar z}{2i}$.` },
    { id: 's02.algebrica.fc8', kind: 'thm', front: String.raw`Disuguaglianza triangolare per il modulo`,
      back: String.raw`$|z+w|\le|z|+|w|$ per ogni $z,w\in\C$. L'uguaglianza vale solo quando $z$ e $w$ hanno la stessa direzione (uno è multiplo reale non negativo dell'altro).` },
    { id: 's02.algebrica.fc9', kind: 'errore', front: String.raw`Errore tipico: $|z+w|=|z|+|w|$?`,
      back: String.raw`Falso in generale: $|1+i|=\sqrt2$, mentre $|1|+|i|=2$. Il modulo non è additivo.` },
  ],
});
