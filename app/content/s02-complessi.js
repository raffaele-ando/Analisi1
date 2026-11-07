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

// ---------------------------------------------------------------------------
// s02.trigonometrica
// ---------------------------------------------------------------------------
// Punti con argomento noto: [parte reale, parte immaginaria, argomento in math.js, argomento in LaTeX].
const PUNTI_NOTI = [
  [1, 1, 'pi/4', String.raw`\frac{\pi}{4}`],
  [1, -1, '7*pi/4', String.raw`\frac{7\pi}{4}`],
  [-1, 1, '3*pi/4', String.raw`\frac{3\pi}{4}`],
  [-1, -1, '5*pi/4', String.raw`\frac{5\pi}{4}`],
  [0, 3, 'pi/2', String.raw`\frac{\pi}{2}`],
  [-2, 0, 'pi', String.raw`\pi`],
  [0, -2, '3*pi/2', String.raw`\frac{3\pi}{2}`],
  [5, 0, '0', '0'],
];

S.push({
  id: 's02.trigonometrica',
  title: 'Forma trigonometrica ed esponenziale, Eulero, De Moivre',
  summary: String.raw`Saprai passare da $a+ib$ a $\rho e^{i\theta}$, moltiplicare e dividere in forma esponenziale e calcolare potenze con la formula di De Moivre.`,
  prereq: ['s02.algebrica', 's00.trig'],
  examRefs: ['Appello 10/02/2026 · B2', 'Appello 11/06/2026 · B2'],
  lessons: [
    {
      id: 's02.trigonometrica.L1',
      title: 'Modulo e argomento',
      cards: [
        { type: 'learn', title: 'Il complesso come vettore',
          body: String.raw`Un complesso $z\neq0$ è un vettore nel piano di Gauss. Lo descrivono due numeri:

- il **modulo** $\rho=|z|$, cioè la lunghezza del vettore;
- l'**argomento** $\theta$, cioè l'angolo che il vettore forma con l'asse reale positivo, misurato in senso antiorario.

Vale $a=\rho\cos\theta$ e $b=\rho\sin\theta$, quindi la **forma trigonometrica** è
$$z=\rho(\cos\theta+i\sin\theta).$$

L'argomento è definito a meno di multipli di $2\pi$. In questa sezione, se non è detto altro, scegliamo $\theta\in[0,2\pi)$.` },
        { type: 'learn', title: 'Trovare l\'argomento',
          body: String.raw`Dalle relazioni $a=\rho\cos\theta$, $b=\rho\sin\theta$ si ricava
$$\cos\theta=\frac{a}{\rho},\qquad \sin\theta=\frac{b}{\rho}.$$

Il **segno** di $a$ e $b$ dice in quale quadrante sta $z$, e quindi quale angolo scegliere.

>! Errore tipico: calcolare $\theta=\arctan\dfrac ba$ senza guardare i segni. La funzione $\arctan$ dà solo angoli in $(-\frac\pi2,\frac\pi2)$: nel secondo e nel terzo quadrante l'angolo va corretto aggiungendo $\pi$.` },
        { type: 'example', title: 'Esempio svolto',
          problem: String.raw`Scrivi $z=1-i$ in forma trigonometrica, con $\theta\in[0,2\pi)$.`,
          steps: [
            String.raw`Modulo: $\rho=\sqrt{1^2+(-1)^2}=\sqrt2$.`,
            { text: String.raw`Allora $\cos\theta=\dfrac{1}{\sqrt2}=\dfrac{\sqrt2}{2}$ e $\sin\theta=-\dfrac{\sqrt2}{2}$: il punto sta nel quarto quadrante, quindi $\theta$ è vicino a $2\pi$.`,
              ask: { type: 'num', prompt: String.raw`Quale angolo in $[0,2\pi)$ ha $\cos\theta=\frac{\sqrt2}{2}$ e $\sin\theta=-\frac{\sqrt2}{2}$? Scrivilo con pi.`,
                answer: '7*pi/4', explain: String.raw`Nel quarto quadrante $\theta=2\pi-\dfrac\pi4=\dfrac{7\pi}4$.` } },
          ],
          result: String.raw`$1-i=\sqrt2\left(\cos\dfrac{7\pi}{4}+i\sin\dfrac{7\pi}{4}\right)$.` },
        { id: 's02.trigonometrica.L1.e1', type: 'mcq', level: 1,
          prompt: String.raw`Qual è l'argomento di $z=-2$ con $\theta\in[0,2\pi)$?`,
          options: [String.raw`$0$`, String.raw`$\pi$`, String.raw`$\dfrac\pi2$`, String.raw`$\dfrac{3\pi}2$`],
          answer: 1,
          explain: String.raw`Il punto $-2$ sta sull'asse reale negativo: $\theta=\pi$. Gli angoli $\frac\pi2$ e $\frac{3\pi}2$ corrispondono ai punti sull'asse immaginario, errore tipico.` },
        { id: 's02.trigonometrica.L1.e2', type: 'num', level: 1,
          prompt: String.raw`Calcola il modulo di $z=\sqrt3+i$.`,
          answer: '2',
          explain: String.raw`$|z|=\sqrt{(\sqrt3)^2+1^2}=\sqrt{4}=2$.` },
        { id: 's02.trigonometrica.L1.e3', type: 'num', level: 1,
          prompt: String.raw`Calcola l'argomento $\theta\in[0,2\pi)$ di $z=i$, scritto con $\pi$.`,
          answer: 'pi/2',
          explain: String.raw`Il punto $i$ ha $\cos\theta=0$ e $\sin\theta=1$: quindi $\theta=\dfrac\pi2$.` },
        { id: 's02.trigonometrica.L1.g1', type: 'gen', level: 2,
          gen: (R) => {
            const [pa, pb, th, thTex] = R.pick(PUNTI_NOTI);
            const k = R.int(1, 3);
            const a = pa * k;
            const b = pb * k;
            return {
              type: 'num',
              answer: th,
              prompt: String.raw`Calcola l'argomento $\theta\in[0,2\pi)$ di $z=${H.cplx(a, b)}$, scritto con $\pi$.`,
              explain: String.raw`Il punto ha $\cos\theta=\dfrac{${a}}{|z|}$ e $\sin\theta=\dfrac{${b}}{|z|}$: l'angolo è $\theta=${thTex}$.`,
            };
          } },
        { id: 's02.trigonometrica.L1.g2', type: 'gen', level: 2,
          gen: (R) => {
            const [pa, pb, th, thTex] = R.pick(PUNTI_NOTI);
            const k = R.int(1, 3);
            const a = pa * k;
            const b = pb * k;
            const n = pa * pa + pb * pb;
            return {
              type: 'tuple',
              labels: ['Modulo', 'Argomento'],
              answer: [`${k}*sqrt(${n})`, th],
              prompt: String.raw`Scrivi $z=${H.cplx(a, b)}$ nella forma $\rho e^{i\theta}$: indica modulo $\rho$ e argomento $\theta\in[0,2\pi)$.`,
              explain: String.raw`$\rho=|z|=${k}\sqrt{${n}}$ e l'argomento è $\theta=${thTex}$.`,
            };
          } },
      ],
    },
    {
      id: 's02.trigonometrica.L2',
      title: 'Eulero, prodotto e potenze',
      cards: [
        { type: 'learn', title: 'La formula di Eulero',
          body: String.raw`Per ogni $\theta\in\R$ si definisce
$$e^{i\theta}=\cos\theta+i\sin\theta.$$

Il punto $e^{i\theta}$ sta sulla **circonferenza unitaria** (modulo $1$) e la sua parte reale e immaginaria sono $\cos\theta$ e $\sin\theta$. Quindi $z=\rho\,e^{i\theta}$ è la **forma esponenziale** di $z$.

Caso particolare: $e^{i\pi}=-1$, cioè $e^{i\pi}+1=0$.`,
          plot: { fns: [{ f: 'cos(x)', label: 'cos' }, { f: 'sin(x)', label: 'sin' }], x: [-6.3, 6.3], y: [-1.5, 1.5] } },
        { type: 'learn', title: 'Prodotto, quoziente e potenze',
          body: String.raw`Con la forma esponenziale le operazioni diventano semplici:
$$\rho_1e^{i\theta_1}\cdot\rho_2e^{i\theta_2}=\rho_1\rho_2\,e^{i(\theta_1+\theta_2)},\qquad \frac{\rho_1e^{i\theta_1}}{\rho_2e^{i\theta_2}}=\frac{\rho_1}{\rho_2}e^{i(\theta_1-\theta_2)}.$$

**Moduli** si moltiplicano (o si dividono), **argomenti** si sommano (o si sottraggono). La potenza si ottiene con De Moivre, nella prossima card.` },
        { type: 'example', title: 'Esempio svolto: potenza di $1+i$',
          problem: String.raw`Calcola $(1+i)^8$ in forma algebrica.`,
          steps: [
            String.raw`Scrivo $1+i=\sqrt2\,e^{i\frac\pi4}$: modulo $\sqrt2$, argomento $\frac\pi4$.`,
            { text: String.raw`Elevo alla ottava: il modulo diventa $(\sqrt2)^8$ e l'argomento $8\cdot\frac\pi4=2\pi$.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $(\sqrt2)^8$?`, answer: '16',
                explain: String.raw`$(\sqrt2)^8=\big((\sqrt2)^2\big)^4=2^4=16$.` } },
          ],
          result: String.raw`$(1+i)^8=16\,e^{2\pi i}=16$, perché $e^{2\pi i}=1$.` },
        { type: 'learn', title: 'Formula di De Moivre',
          body: String.raw`>* **De Moivre.** Per ogni $\theta\in\R$ e $n\in\N$:
$$(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta).$$

Equivalentemente $(\rho e^{i\theta})^n=\rho^n e^{in\theta}$: il modulo viene elevato a $n$ e l'argomento moltiplicato per $n$.

Per le potenze di un complesso con $\rho\neq1$ o con argomento non notevole, questa è la strada più rapida rispetto allo sviluppo del binomio.` },
        { id: 's02.trigonometrica.L2.e1', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $e^{i\pi}$?`,
          options: [String.raw`$-1$`, String.raw`$1$`, String.raw`$i$`, String.raw`$-i$`],
          answer: 0,
          explain: String.raw`$e^{i\pi}=\cos\pi+i\sin\pi=-1$ (identità di Eulero). Errore tipico: scrivere $1$ dimenticando il segno del coseno.` },
        { id: 's02.trigonometrica.L2.e2', type: 'num', level: 2,
          prompt: String.raw`Calcola $\left|2e^{i\frac\pi3}\cdot3e^{i\frac\pi6}\right|$.`,
          answer: '6',
          explain: String.raw`I moduli si moltiplicano: $2\cdot3=6$. Gli argomenti non influiscono sul modulo del prodotto.` },
        { id: 's02.trigonometrica.L2.e3', type: 'tuple', level: 2, labels: ['Modulo', 'Argomento'],
          prompt: String.raw`Scrivi $2e^{i\frac\pi3}\cdot3e^{i\frac\pi6}$ come $\rho e^{i\theta}$, con $\theta\in[0,2\pi)$: indica modulo e argomento.`,
          answer: ['6', 'pi/2'],
          explain: String.raw`Moduli: $2\cdot3=6$. Argomenti: $\frac\pi3+\frac\pi6=\frac\pi2$, già in $[0,2\pi)$.` },
        { id: 's02.trigonometrica.L2.g1', type: 'gen', level: 2,
          gen: (R) => {
            const p = R.int(1, 3), q = R.int(1, 3), a = R.int(1, 11), b = R.int(1, 11);
            const r = a + b;
            return {
              type: 'tuple',
              labels: ['Modulo', 'Argomento'],
              answer: [String(p * q), `${r}*pi/12`],
              prompt: String.raw`Scrivi il prodotto $${p}e^{i\frac{${a}\pi}{12}}\cdot${q}e^{i\frac{${b}\pi}{12}}$ nella forma $\rho e^{i\theta}$, con $\theta\in[0,2\pi)$: indica modulo e argomento.`,
              explain: String.raw`Moduli: $${p}\cdot${q}=${p * q}$. Argomenti: $\frac{${a}\pi}{12}+\frac{${b}\pi}{12}=\frac{${r}\pi}{12}$, già in $[0,2\pi)$ perché $${r}<24$.`,
            };
          } },
        { id: 's02.trigonometrica.L2.g2', type: 'gen', level: 2,
          gen: (R) => {
            const rho = R.int(1, 3), n = R.int(2, 6), k = R.int(1, 11);
            const m = (k * n) % 12;
            return {
              type: 'tuple',
              labels: ['Modulo', 'Argomento'],
              answer: [String(rho ** n), `${m}*pi/6`],
              prompt: String.raw`Calcola $\left(${rho}e^{i\frac{${k}\pi}{6}}\right)^{${n}}$: indica modulo e argomento in $[0,2\pi)$.`,
              explain: String.raw`De Moivre: $(\rho e^{i\theta})^n=\rho^n e^{in\theta}$. Qui $\rho^{${n}}=${rho ** n}$ e $${n}\cdot\frac{${k}\pi}{6}=\frac{${k * n}\pi}{6}$, che modulo $2\pi$ diventa $\frac{${m}\pi}{6}$.`,
            };
          } },
        { id: 's02.trigonometrica.L2.e4', type: 'tf', level: 1,
          prompt: String.raw`Per ogni $\theta\in\R$ vale $|e^{i\theta}|=1$.`,
          answer: true,
          explain: String.raw`$|\cos\theta+i\sin\theta|^2=\cos^2\theta+\sin^2\theta=1$.` },
        { id: 's02.trigonometrica.L2.e5', type: 'tf', level: 2,
          prompt: String.raw`Per ogni $\theta\in\R$ vale $\overline{e^{i\theta}}=e^{-i\theta}$.`,
          answer: true,
          explain: String.raw`$\overline{\cos\theta+i\sin\theta}=\cos\theta-i\sin\theta=\cos(-\theta)+i\sin(-\theta)$.` },
      ],
    },
    {
      id: 's02.trigonometrica.L3',
      title: 'Scegliere la forma giusta: esempi d\'esame',
      cards: [
        { type: 'learn', title: 'Quale forma usare',
          body: String.raw`Ogni forma serve a qualcosa:

- **somma e differenza**: forma algebrica $a+ib$;
- **prodotto, quoziente, potenze e radici**: forma esponenziale $\rho e^{i\theta}$;
- **confronto del modulo** e lettura sul piano: $\rho=|z|$.

Il passaggio tipico è: forma algebrica → modulo e argomento → operazione con moduli e argomenti → forma algebrica del risultato. Svilupparne a mano la potenza del binomio è inutile oltre il quadrato.` },
        { id: 's02.trigonometrica.L3.e0', type: 'mcq', level: 2,
          prompt: String.raw`Quale è la forma esponenziale di $z=-2$?`,
          options: [String.raw`$2e^{i\pi}$`, String.raw`$2e^{i0}$`, String.raw`$-2e^{i\frac\pi2}$`, String.raw`$2e^{i\frac\pi2}$`],
          answer: 0,
          explain: String.raw`$2e^{i\pi}=2(\cos\pi+i\sin\pi)=-2$. Errore tipico: $2e^{i\frac\pi2}=2i$, che sta sull'asse immaginario.` },
        { type: 'example', title: 'Esempio svolto d\'esame',
          problem: String.raw`Calcola $\left(\dfrac{1+i\sqrt3}{1-i}\right)^6$ in forma algebrica.`,
          steps: [
            String.raw`Numeratore: $1+i\sqrt3=2e^{i\frac\pi3}$ (modulo $2$, argomento $\frac\pi3$). Denominatore: $1-i=\sqrt2\,e^{-i\frac\pi4}$.`,
            { text: String.raw`Il quoziente ha modulo $\dfrac{2}{\sqrt2}=\sqrt2$ e argomento $\dfrac\pi3-\left(-\dfrac\pi4\right)$, cioè una somma di angoli.`,
              ask: { type: 'num', prompt: String.raw`Quanto vale $\dfrac\pi3+\dfrac\pi4$? Scrivi la frazione con pi.`, answer: '7*pi/12',
                explain: String.raw`$\dfrac\pi3+\dfrac\pi4=\dfrac{4\pi+3\pi}{12}=\dfrac{7\pi}{12}$.` } },
            String.raw`Quindi $z=\sqrt2\,e^{i\frac{7\pi}{12}}$ e $z^6=(\sqrt2)^6e^{i\frac{42\pi}{12}}=8\,e^{i\frac{7\pi}{2}}$.`,
            String.raw`Riduco l'argomento modulo $2\pi$: $\frac{7\pi}2-2\pi=\frac{3\pi}2$, quindi $z^6=8e^{i\frac{3\pi}2}=-8i$.`,
          ],
          result: String.raw`$\left(\dfrac{1+i\sqrt3}{1-i}\right)^6=-8i$.` },
        { type: 'learn', title: 'Attenzione al quadrante',
          body: String.raw`Quando si passa da $a+ib$ a $\rho e^{i\theta}$, si disegni sempre il punto nel piano. Il segno di $\cos\theta$ e $\sin\theta$ va controllato dopo ogni calcolo.

>! Un argomento ottenuto con $\arctan$ va corretto di $\pi$ se $a<0$. Dopo ogni riduzione modulo $2\pi$ si verifichi che $\theta\in[0,2\pi)$.` },
        { id: 's02.trigonometrica.L3.e1', type: 'tf', level: 2,
          prompt: String.raw`Vale $\left(\sqrt3+i\right)^6=-64$.`,
          answer: true,
          explain: String.raw`$\sqrt3+i=2e^{i\frac\pi6}$, quindi $(\sqrt3+i)^6=2^6e^{i\pi}=-64$.` },
        { id: 's02.trigonometrica.L3.e2', type: 'num', level: 2,
          prompt: String.raw`Calcola l'argomento $\theta\in[0,2\pi)$ di $(-1+i)^4$, scritto con $\pi$.`,
          answer: 'pi',
          explain: String.raw`$-1+i=\sqrt2\,e^{i\frac{3\pi}4}$, quindi $(-1+i)^4=4e^{i3\pi}=4e^{i\pi}=-4$: argomento $\pi$.` },
        { id: 's02.trigonometrica.L3.e3', type: 'order', level: 2,
          prompt: String.raw`Ordina i passi per calcolare $(1+i)^{10}$ in forma algebrica.`,
          steps: [
            String.raw`Scrivo $1+i=\sqrt2\,e^{i\frac\pi4}$.`,
            String.raw`Elevo a $10$: $(1+i)^{10}=(\sqrt2)^{10}e^{i\frac{10\pi}4}=32\,e^{i\frac{5\pi}2}$.`,
            String.raw`Riduco $\frac{5\pi}2$ modulo $2\pi$: $\frac{5\pi}2-2\pi=\frac\pi2$, quindi $32e^{i\frac\pi2}=32i$.`,
          ],
          distractors: [String.raw`Elevo separatamente parte reale e parte immaginaria: $1^{10}+i^{10}=1-1=0$.`],
          explain: String.raw`Errore tipico: elevare a potenza parte reale e parte immaginaria separatamente. Il binomio non si comporta così.` },
        { id: 's02.trigonometrica.L3.e4', type: 'mcq', level: 3,
          prompt: String.raw`Quale è il valore di $w=\dfrac{(1+i\sqrt3)^3}{(1-i)^2}$?`,
          options: [String.raw`$-4i$`, String.raw`$4i$`, String.raw`$-4$`, String.raw`$4$`],
          answer: 0,
          explain: String.raw`$(1+i\sqrt3)^3=8e^{i\pi}=-8$ e $(1-i)^2=-2i$, quindi $w=\dfrac{-8}{-2i}=\dfrac4i=-4i$.` },
        { id: 's02.trigonometrica.L3.P1', type: 'problem', level: 3,
          prompt: String.raw`Sia $w=\dfrac{(1+i\sqrt3)^3}{(1-i)^2}$.`,
          parts: [
            { type: 'num', prompt: 'Calcola $|w|$.', answer: '4',
              explain: String.raw`$|w|=\dfrac{|1+i\sqrt3|^3}{|1-i|^2}=\dfrac{8}{2}=4$.` },
            { type: 'num', prompt: 'Calcola $\\theta\\in[0,2\\pi)$ con $w=|w|e^{i\\theta}$, scritto con $\\pi$.', answer: '3*pi/2',
              explain: String.raw`$w=-4i=4e^{i\frac{3\pi}2}$.` },
            { type: 'mcq', prompt: 'Quale affermazione è vera?',
              options: [String.raw`$w$ è immaginario puro: $w=-4i$`, String.raw`$w$ è reale: $w=4$`],
              answer: 0,
              explain: String.raw`Il risultato è $-4i$: parte reale nulla, quindi immaginario puro.` },
          ],
          solution: String.raw`$1+i\sqrt3=2e^{i\frac\pi3}$, quindi $(1+i\sqrt3)^3=8e^{i\pi}=-8$. Poi $(1-i)^2=-2i$, e $w=\dfrac{-8}{-2i}=-4i$. Modulo $4$, argomento $\frac{3\pi}2$.` },
      ],
    },
  ],
  practice: [
    { id: 's02.trigonometrica.p1', type: 'num', level: 1, prompt: String.raw`Calcola il modulo di $z=-3+4i$.`, answer: '5',
      explain: String.raw`$|z|=\sqrt{9+16}=5$.` },
    { id: 's02.trigonometrica.p2', type: 'num', level: 2, prompt: String.raw`Calcola l'argomento $\theta\in[0,2\pi)$ di $z=-\sqrt3-i$, scritto con $\pi$.`, answer: '7*pi/6',
      explain: String.raw`$|z|=2$, $\cos\theta=-\dfrac{\sqrt3}2$ e $\sin\theta=-\dfrac12$: terzo quadrante, $\theta=\dfrac{7\pi}6$.` },
    { id: 's02.trigonometrica.p3', type: 'tf', level: 1, prompt: String.raw`Vale $e^{i\frac\pi2}=i$.`, answer: true,
      explain: String.raw`$e^{i\frac\pi2}=\cos\frac\pi2+i\sin\frac\pi2=i$.` },
    { id: 's02.trigonometrica.p4', type: 'num', level: 2, prompt: String.raw`Calcola $\left(\sqrt3+i\right)^6$.`, answer: '-64',
      explain: String.raw`$\sqrt3+i=2e^{i\frac\pi6}$, quindi $2^6e^{i\pi}=-64$.` },
    { id: 's02.trigonometrica.p5', type: 'num', level: 1, prompt: String.raw`Calcola $\operatorname{Re}\left(e^{i\frac\pi3}\right)$.`, answer: '1/2',
      explain: String.raw`$\operatorname{Re}\,e^{i\theta}=\cos\theta$, e $\cos\frac\pi3=\frac12$.` },
    { id: 's02.trigonometrica.p6', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-4, 4), n = R.pick([2, 4]);
        const s = a * a + b * b;
        return {
          type: 'num',
          answer: `${s}^(${n}/2)`,
          prompt: String.raw`Calcola $\left|\left(${H.cplx(a, b)}\right)^{${n}}\right|$.`,
          explain: String.raw`$|z^n|=|z|^n$ e $|z|^2=${s}$, quindi $|z|^{${n}}=${s}^{${n / 2}}=${s ** (n / 2)}$.`,
        };
      } },
    { id: 's02.trigonometrica.p7', type: 'gen', level: 2,
      gen: (R) => {
        const n = R.pick([2, 3, 4, 5, 6, 8]);
        let re = 1, im = 0;
        for (let k = 0; k < n; k++) [re, im] = [re - im, re + im];
        return {
          type: 'num',
          answer: `(${re})+(${im})*i`,
          prompt: String.raw`Calcola $(1+i)^{${n}}$ in forma algebrica.`,
          explain: String.raw`Con $1+i=\sqrt2\,e^{i\frac\pi4}$: $(1+i)^{${n}}=(\sqrt2)^{${n}}e^{i\frac{${n}\pi}4}=${H.cplx(re, im)}$.`,
        };
      } },
    { id: 's02.trigonometrica.p8', type: 'set', level: 2, prompt: String.raw`Risolvi in $\C$ l'equazione $z^2=i$. Separa le soluzioni con punto e virgola.`,
      answer: ['sqrt(2)/2+sqrt(2)/2*i', '-sqrt(2)/2-sqrt(2)/2*i'],
      explain: String.raw`$i=e^{i\frac\pi2}$: le radici quadrate hanno modulo $1$ e argomenti $\frac\pi4$ e $\frac{5\pi}4$, cioè $\pm\frac{\sqrt2}2(1+i)$.` },
    { id: 's02.trigonometrica.p9', type: 'mcq', level: 1, prompt: String.raw`Quale è il coniugato di $e^{i\theta}$?`,
      options: [String.raw`$e^{i\theta}$`, String.raw`$e^{-i\theta}$`, String.raw`$-e^{i\theta}$`, String.raw`$e^{i(\pi-\theta)}$`],
      answer: 1,
      explain: String.raw`Il coniugato cambia il segno della parte immaginaria: $\overline{\cos\theta+i\sin\theta}=\cos\theta-i\sin\theta=e^{-i\theta}$.` },
    { id: 's02.trigonometrica.p10', type: 'match', level: 1, prompt: String.raw`Abbina ogni numero alla sua forma esponenziale.`,
      pairs: [
        [String.raw`$1$`, String.raw`$e^{i0}$`],
        [String.raw`$i$`, String.raw`$e^{i\frac\pi2}$`],
        [String.raw`$-1$`, String.raw`$e^{i\pi}$`],
        [String.raw`$-i$`, String.raw`$e^{i\frac{3\pi}2}$`],
      ],
      explain: String.raw`I quattro punti cardinali del cerchio unitario hanno argomenti $0,\frac\pi2,\pi,\frac{3\pi}2$.` },
    { id: 's02.trigonometrica.p11', type: 'open', level: 2,
      prompt: String.raw`Dimostra la formula $(\rho e^{i\theta})^2=\rho^2e^{i\,2\theta}$ usando la regola del prodotto in forma esponenziale.`,
      answer: String.raw`$(\rho e^{i\theta})(\rho e^{i\theta})=\rho\cdot\rho\,e^{i(\theta+\theta)}=\rho^2e^{i2\theta}$: i moduli si moltiplicano e gli argomenti si sommano.`,
      rubric: ['Scrivere il prodotto dei due fattori uguali', 'Moduli: $\\rho\\cdot\\rho=\\rho^2$', 'Argomenti: $\\theta+\\theta=2\\theta$'],
      explain: String.raw`È il caso $n=2$ di De Moivre: lo stesso ragionamento vale per ogni $n$ per induzione.` },
    { id: 's02.trigonometrica.p12', type: 'gen', level: 2,
      gen: (R) => {
        const [k, mth, tex] = R.pick([[0, '1', '1'], [1, 'sqrt(3)/2', String.raw`\frac{\sqrt3}{2}`], [2, '1/2', String.raw`\frac12`], [3, '0', '0'], [4, '-1/2', String.raw`-\frac12`], [6, '-1', '-1']]);
        return {
          type: 'num',
          answer: mth,
          prompt: String.raw`Calcola $\operatorname{Re}\left(e^{i\frac{${k}\pi}{6}}\right)$.`,
          explain: String.raw`$\operatorname{Re}\,e^{i\theta}=\cos\theta$, e $\cos\frac{${k}\pi}{6}=${tex}$.`,
        };
      } },
  ],
  flashcards: [
    { id: 's02.trigonometrica.fc1', kind: 'def', front: String.raw`Forma trigonometrica di $z\neq0$`,
      back: String.raw`$z=\rho(\cos\theta+i\sin\theta)$, con $\rho=|z|$ modulo e $\theta$ argomento (angolo da $\R^+$ in senso antiorario, a meno di $2k\pi$).` },
    { id: 's02.trigonometrica.fc2', kind: 'formula', front: String.raw`Passaggio da $a+ib$ a $\rho e^{i\theta}$`,
      back: String.raw`$\rho=\sqrt{a^2+b^2}$, $\cos\theta=\dfrac a\rho$, $\sin\theta=\dfrac b\rho$. Il quadrante si sceglie dal segno di $a$ e $b$.` },
    { id: 's02.trigonometrica.fc3', kind: 'def', front: String.raw`Forma esponenziale`,
      back: String.raw`$z=\rho e^{i\theta}$, dove $e^{i\theta}=\cos\theta+i\sin\theta$ (formula di Eulero).` },
    { id: 's02.trigonometrica.fc4', kind: 'thm', front: String.raw`Formula di De Moivre`,
      back: String.raw`Per ogni $\theta\in\R$ e $n\in\N$: $(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta)$, cioè $(\rho e^{i\theta})^n=\rho^n e^{in\theta}$.` },
    { id: 's02.trigonometrica.fc5', kind: 'formula', front: String.raw`Prodotto e quoziente in forma esponenziale`,
      back: String.raw`$\rho_1e^{i\theta_1}\cdot\rho_2e^{i\theta_2}=\rho_1\rho_2e^{i(\theta_1+\theta_2)}$; $\dfrac{\rho_1e^{i\theta_1}}{\rho_2e^{i\theta_2}}=\dfrac{\rho_1}{\rho_2}e^{i(\theta_1-\theta_2)}$.` },
    { id: 's02.trigonometrica.fc6', kind: 'errore', front: String.raw`Errore tipico: $\theta=\arctan\dfrac ba$ sempre?`,
      back: String.raw`No. $\arctan$ dà angoli in $(-\frac\pi2,\frac\pi2)$. Se $a<0$ bisogna correggere il quadrante aggiungendo $\pi$.` },
    { id: 's02.trigonometrica.fc7', kind: 'metodo', front: String.raw`Quale forma usare?`,
      back: String.raw`Somme: algebrica. Prodotti, quozienti, potenze e radici: esponenziale. Dopo ogni calcolo si riporta il risultato in $[0,2\pi)$ se serve.` },
    { id: 's02.trigonometrica.fc8', kind: 'def', front: String.raw`Coniugato di $e^{i\theta}$`,
      back: String.raw`$\overline{e^{i\theta}}=e^{-i\theta}$, e $\left|e^{i\theta}\right|=1$ per ogni $\theta\in\R$.` },
  ],
});
