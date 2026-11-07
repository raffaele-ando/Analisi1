import { H } from '../engine/tex.js';

// ---------------------------------------------------------------------------
// Helper locali per i generatori
// ---------------------------------------------------------------------------
const NAT = ['massimo relativo', 'minimo relativo', 'né massimo né minimo'];
const NAT_TEX = [String.raw`massimo relativo`, String.raw`minimo relativo`, String.raw`né massimo né minimo`];
/** natura di un punto stazionario dal segno di f' a sinistra (sl) e a destra (sr) */
const nature = (sl, sr) => (sl > 0 && sr < 0 ? 0 : sl < 0 && sr > 0 ? 1 : 2);
/** "x - 3", "x + 2", "x" */
const xm = (p) => H.lin(1, -p);
/** fattore (x - p) tra parentesi, oppure x */
const fac = (p) => (p === 0 ? 'x' : `(${xm(p)})`);
/** potenza di x in LaTeX: 0 -> "", 1 -> "x", n -> "x^{n}" */
const xpow = (n) => (n === 0 ? '' : n === 1 ? 'x' : `x^{${n}}`);
/** valore di un polinomio (coefficienti decrescenti) */
const pval = (c, x) => c.reduce((s, k) => s * x + k, 0);
/** e^{ax} in LaTeX */
const eax = (a) => `e^{${H.coef(a)}x}`;
/** cubica a x^3 + b x^2 + c x + d con f' = 3a(x-p)(x-q), coefficienti interi */
function cubic(R, lo = -3, hi = 3) {
  let a, p, q, b;
  for (;;) {
    a = R.pick([1, -1, 1, -1, 2, -2]);
    p = R.int(lo, hi);
    q = R.int(lo, hi);
    if (p === q) continue;
    if (p > q) [p, q] = [q, p];
    if ((3 * a * (p + q)) % 2 !== 0) continue;
    b = (-3 * a * (p + q)) / 2;
    break;
  }
  const c = 3 * a * p * q;
  const d = R.int(-4, 4);
  return { a, b, c, d, p, q, co: [a, b, c, d] };
}

export default {
  id: 's09',
  title: 'Studio di funzione',
  subtitle: 'Estremi relativi e assoluti, studio completo del grafico',
  intro: String.raw`È l'esercizio **più pesante di ogni appello** (5–6 punti su 22 della Parte B). Si vince con un **metodo fisso**: dominio, segno, limiti e asintoti, continuità e derivabilità (attenzione ai raccordi e al modulo), derivata prima, monotonia ed estremi. Qui impari a non saltare nessun passo e a non confondere estremi relativi e assoluti.`,
  skills: [
    // =====================================================================
    {
      id: 's09.estremi',
      title: 'Estremi relativi e assoluti',
      summary: String.raw`Saprai trovare i punti stazionari, stabilirne la natura con il segno di $f'$, e trovare massimi e minimi assoluti (anche su intervalli chiusi) e l'estremo superiore e inferiore di una funzione.`,
      prereq: ['s03.base', 's05.asintoti', 's08.regole', 's08.teoremi', 's08.punti'],
      examRefs: ['Itinere 11/11/2025 · Parte B', 'Appello 06/07/2026 · Parte B'],
      lessons: [
        // ---------------------------------------------------------------
        {
          id: 's09.estremi.L1',
          title: 'Colline e valli: estremi relativi e assoluti',
          cards: [
            {
              type: 'learn',
              title: "L'idea",
              body: String.raw`Immagina il grafico come il profilo di una strada di montagna.

- Una **cima** è un punto in cui, **nei dintorni**, non c'è niente di più alto: è un **massimo relativo** (o locale).
- Il punto **più alto di tutta la strada** è il **massimo assoluto** (o globale).

Lo stesso per le valli: **minimo relativo** e **minimo assoluto**.

Nel grafico di $f(x)=x^3-3x$: in $x=-1$ c'è una cima ($f(-1)=2$), in $x=1$ una valle ($f(1)=-2$). Ma per $x\to+\infty$ la funzione sale oltre ogni valore: la cima in $-1$ è **solo relativa**.`,
              plot: { fns: [{ f: 'x^3-3x', label: 'f(x)=x^3-3x' }], x: [-2.6, 2.6], y: [-5, 5], points: [[-1, 2, 'max rel'], [1, -2, 'min rel']] },
            },
            {
              type: 'learn',
              title: 'Definizioni',
              body: String.raw`Sia $f: A \to \R$ e $x_0 \in A$.

>* $x_0$ è **punto di massimo relativo** se esiste un intorno $I$ di $x_0$ tale che $f(x) \le f(x_0)$ per ogni $x \in I \cap A$.

>* $x_0$ è **punto di massimo assoluto** se $f(x) \le f(x_0)$ per **ogni** $x \in A$. Il numero $f(x_0)$ è il **(valore) massimo** di $f$.

Per i minimi si invertono le disuguaglianze. Attenzione al lessico:
- il **punto** di massimo è una $x$ (sta sull'asse orizzontale);
- il **massimo** è il valore $f(x_0)$ (sta sull'asse verticale).

Ogni estremo assoluto è anche relativo; **non** vale il viceversa.`,
            },
            {
              id: 's09.estremi.L1.e1', type: 'mcq', level: 1,
              prompt: String.raw`Per $f(x)=x^3-3x$ definita su tutto $\R$, il punto $x=-1$ è…`,
              options: [
                String.raw`un punto di massimo relativo, ma non assoluto`,
                String.raw`un punto di massimo assoluto`,
                String.raw`un punto di minimo relativo`,
                String.raw`un punto in cui $f'$ non si annulla`,
              ],
              answer: 0,
              explain: String.raw`Vicino a $-1$ i valori sono tutti $\le f(-1)=2$: massimo relativo. Non è assoluto perché $\lim_{x\to+\infty}f(x)=+\infty$ (ad esempio $f(3)=18>2$). Infatti $f'(x)=3x^2-3$ si annulla proprio in $\pm1$.`,
              plot: { fns: ['x^3-3x'], x: [-2.6, 3.2], y: [-5, 20], points: [[-1, 2], [3, 18, 'f(3)=18']] },
            },
            {
              id: 's09.estremi.L1.e2', type: 'tf', level: 1,
              prompt: String.raw`Ogni punto di massimo assoluto è anche un punto di massimo relativo.`,
              answer: true,
              explain: String.raw`Se $f(x)\le f(x_0)$ per **tutti** gli $x$ del dominio, la disuguaglianza vale in particolare per quelli di un qualunque intorno di $x_0$.`,
            },
            {
              id: 's09.estremi.L1.e3', type: 'tf', level: 1,
              prompt: String.raw`Se $x_0$ è un punto di massimo relativo, allora $f(x_0)\ge f(x)$ per ogni $x$ del dominio.`,
              answer: false,
              explain: String.raw`Questa è la definizione di massimo **assoluto**. Un massimo relativo confronta $f(x_0)$ solo con i valori **vicini**: $x^3-3x$ ha massimo relativo in $-1$ ma $f(3)=18>f(-1)=2$.`,
            },
            {
              id: 's09.estremi.L1.e4', type: 'mcq', level: 1,
              prompt: String.raw`Quale frase è corretta per $f(x)=1-x^2$ su $\R$?`,
              options: [
                String.raw`Il massimo è $1$ e il punto di massimo è $x=0$`,
                String.raw`Il massimo è $0$ e il punto di massimo è $x=1$`,
                String.raw`Non ha massimo perché $\R$ non è limitato`,
                String.raw`Ha anche un minimo assoluto, che vale $-\infty$`,
              ],
              answer: 0,
              explain: String.raw`$f(x)=1-x^2\le 1=f(0)$ per ogni $x$: il **valore** massimo è $1$, il **punto** di massimo è $0$. Un dominio illimitato non impedisce di avere massimo. $-\infty$ non è un numero: $f$ non ha minimo, si dice $\inf f=-\infty$.`,
            },
            {
              type: 'learn',
              title: 'Dove cercare gli estremi',
              body: String.raw`Dal **teorema di Fermat**: se $x_0$ è un punto di estremo relativo **interno** al dominio e $f$ è **derivabile** in $x_0$, allora $f'(x_0)=0$. I punti con $f'(x_0)=0$ si chiamano **punti stazionari** (o critici).

Quindi gli estremi si cercano **solo** tra:
1. i punti stazionari interni;
2. i punti in cui $f$ **non è derivabile** (modulo, raccordi, radici…);
3. gli **estremi del dominio** che appartengono al dominio (es. $a$ e $b$ in $[a,b]$).

>! Fermat dà una condizione **necessaria**, non sufficiente: $f(x)=x^3$ ha $f'(0)=0$ ma $0$ non è un estremo.`,
              plot: { fns: [{ f: 'x^3', label: 'x^3' }, { f: 'abs(x)', label: '|x|' }], x: [-1.5, 1.5], y: [-1.5, 1.5], points: [[0, 0]] },
            },
            {
              id: 's09.estremi.L1.e5', type: 'tf', level: 1,
              prompt: String.raw`Se $f'(x_0)=0$, allora $x_0$ è un punto di massimo o di minimo relativo.`,
              answer: false,
              explain: String.raw`Controesempio: $f(x)=x^3$, $f'(0)=0$, ma $f$ è strettamente crescente: a sinistra di $0$ è negativa, a destra positiva. $f'(x_0)=0$ è solo il **candidato**: la natura si decide con il segno di $f'$.`,
            },
            {
              id: 's09.estremi.L1.e6', type: 'mcq', level: 2,
              prompt: String.raw`Sia $f$ continua su $[a,b]$. Tra quali punti vanno cercati i suoi estremi? (più risposte)`,
              options: [
                String.raw`i punti interni in cui $f'(x)=0$`,
                String.raw`i punti interni in cui $f$ non è derivabile`,
                String.raw`gli estremi $a$ e $b$`,
                String.raw`i punti in cui $f''(x)=0$`,
              ],
              answer: [0, 1, 2],
              explain: String.raw`Fermat vale solo nei punti **interni** e **di derivabilità**: negli altri punti (bordo, angoli, cuspidi) un estremo può esserci anche se $f'$ non si annulla o non esiste. I punti con $f''=0$ sono candidati **flessi**, non estremi.`,
            },
            {
              id: 's09.estremi.L1.e7', type: 'tf', level: 1,
              prompt: String.raw`$f(x)=|x|$ ha un minimo assoluto in $x=0$, anche se $f'(0)$ non esiste.`,
              answer: true,
              explain: String.raw`$|x|\ge 0=f(0)$ per ogni $x$. In $0$ c'è un punto angoloso ($f'_-(0)=-1$, $f'_+(0)=1$): è proprio uno dei candidati "non derivabili" da controllare sempre.`,
            },
            {
              id: 's09.estremi.L1.e8', type: 'num', level: 2,
              prompt: String.raw`Quanto vale il **massimo assoluto** di $f(x)=x^3-3x$ sull'intervallo $[-3,2]$?`,
              answer: '2',
              explain: String.raw`Candidati: stazionari $\pm1$ ed estremi $-3$, $2$. Valori: $f(-3)=-18$, $f(-1)=2$, $f(1)=-2$, $f(2)=2$. Il massimo è $2$, assunto **due volte** (in $-1$ e in $2$); il minimo è $-18$, in $x=-3$. Se ti dimentichi dell'estremo $-3$ sbagli il minimo.`,
              plot: { fns: ['x^3-3x'], x: [-3.2, 2.2], y: [-19, 4], points: [[-3, -18], [-1, 2], [1, -2], [2, 2]] },
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          id: 's09.estremi.L2',
          title: 'Il test della derivata prima',
          cards: [
            {
              type: 'learn',
              title: 'Segno di $f\'$ e monotonia',
              body: String.raw`Dal teorema di Lagrange: su un **intervallo**
- se $f'(x)>0$ allora $f$ è strettamente crescente;
- se $f'(x)<0$ allora $f$ è strettamente decrescente.

>* **Test della derivata prima.** Sia $f$ continua in $x_0$ e derivabile vicino a $x_0$. Se $f'$ passa da $+$ a $-$ in $x_0$, allora $x_0$ è di **massimo relativo**; se passa da $-$ a $+$, è di **minimo relativo**; se **non cambia segno**, $x_0$ non è un estremo.

Si riassume tutto in una **tabella dei segni** di $f'$: frecce ↗ e ↘, e si leggono massimi (↗↘) e minimi (↘↗).

>! Il test vale su un intervallo: se tra due tratti c'è un buco nel dominio (asintoto verticale) non si può concludere nulla "attraversandolo".`,
            },
            {
              type: 'example',
              title: 'Esempio svolto',
              problem: String.raw`Trova e classifica i punti stazionari di $f(x)=x^3-6x^2+9x+1$.`,
              steps: [
                String.raw`Dominio $\R$. Derivata: $f'(x)=3x^2-12x+9=3(x^2-4x+3)=3(x-1)(x-3)$.`,
                String.raw`Punti stazionari: $f'(x)=0 \iff x=1$ oppure $x=3$.`,
                String.raw`Segno: $f'>0$ per $x<1$ e per $x>3$ (parabola con concavità verso l'alto), $f'<0$ in $(1,3)$.`,
                String.raw`Tabella: ↗ su $(-\infty,1)$, ↘ su $(1,3)$, ↗ su $(3,+\infty)$. Quindi $x=1$ è di massimo relativo, $x=3$ di minimo relativo.`,
                String.raw`Valori: $f(1)=1-6+9+1=5$, $f(3)=27-54+27+1=1$. Poiché $\lim_{x\to\pm\infty}f=\pm\infty$, nessuno dei due è assoluto.`,
              ],
              result: String.raw`max relativo $(1,5)$, min relativo $(3,1)$, nessun estremo assoluto.`,
              plot: { fns: ['x^3-6x^2+9x+1'], x: [-0.8, 4.5], y: [-3, 8], points: [[1, 5, 'max rel'], [3, 1, 'min rel']] },
            },
            {
              type: 'example',
              title: 'Ora completa tu',
              problem: String.raw`Studia i punti stazionari di $f(x)=x e^{-x}$.`,
              steps: [
                {
                  text: String.raw`Regola del prodotto: $f'(x)=e^{-x}-xe^{-x}=(1-x)e^{-x}$.`,
                  ask: { type: 'expr', prompt: String.raw`Calcola $f'(x)$.`, answer: '(1-x)*e^(-x)', explain: String.raw`$D(x)\cdot e^{-x}+x\cdot D(e^{-x})=e^{-x}-xe^{-x}$. Attenzione al segno: $D(e^{-x})=-e^{-x}$.` },
                },
                {
                  text: String.raw`Poiché $e^{-x}>0$ sempre, $f'(x)=0\iff x=1$.`,
                  ask: { type: 'num', prompt: String.raw`Qual è l'unico punto stazionario?`, answer: '1', explain: String.raw`L'esponenziale non si annulla mai: conta solo il fattore $1-x$.` },
                },
                {
                  text: String.raw`$f'>0$ per $x<1$, $f'<0$ per $x>1$: massimo relativo in $x=1$, con $f(1)=e^{-1}$.`,
                  ask: { type: 'mcq', prompt: String.raw`Che punto è $x=1$?`, options: NAT_TEX, answer: 0, noShuffle: true, explain: String.raw`Il segno di $f'$ coincide con quello di $1-x$: passa da $+$ a $-$, quindi ↗↘: massimo.` },
                },
                String.raw`Limiti: $\lim_{x\to-\infty}xe^{-x}=-\infty$, $\lim_{x\to+\infty}xe^{-x}=0$. Il massimo relativo è anche **assoluto**: la funzione cresce fino a $1$ e poi decresce verso $0$.`,
              ],
              result: String.raw`massimo assoluto $f(1)=\frac1e$, nessun minimo.`,
              plot: { fns: ['x*e^(-x)'], x: [-1, 6], y: [-2, 0.6], points: [[1, 0.3679, 'max']], hlines: [0] },
            },
            {
              id: 's09.estremi.L2.e1', type: 'set', level: 1,
              prompt: String.raw`Trova i punti stazionari di $f(x)=x^4-2x^2$ (separali con ;).`,
              answer: ['-1', '0', '1'],
              explain: String.raw`$f'(x)=4x^3-4x=4x(x-1)(x+1)$, che si annulla in $-1$, $0$, $1$.`,
            },
            {
              id: 's09.estremi.L2.e2', type: 'mcq', level: 2,
              prompt: String.raw`Per $f(x)=x^4-2x^2$, il punto $x=0$ è…`,
              options: NAT_TEX, answer: 0, noShuffle: true,
              explain: String.raw`Segno di $f'(x)=4x(x-1)(x+1)$: $-$ su $(-\infty,-1)$, $+$ su $(-1,0)$, $-$ su $(0,1)$, $+$ su $(1,+\infty)$. In $0$ passa da $+$ a $-$: massimo relativo ($f(0)=0$). In $\pm1$ ci sono minimi assoluti ($f(\pm1)=-1$).`,
              plot: { fns: ['x^4-2x^2'], x: [-1.8, 1.8], y: [-1.5, 2], points: [[0, 0, 'max rel'], [-1, -1], [1, -1]] },
            },
            {
              id: 's09.estremi.L2.e3', type: 'mcq', level: 2,
              prompt: String.raw`Sia $f(x)=x^3-3x^2+3x$. Allora $f'(x)=3(x-1)^2$ e il punto $x=1$ è…`,
              options: NAT_TEX, answer: 2, noShuffle: true,
              explain: String.raw`$f'(x)=3(x-1)^2\ge0$ e si annulla solo in $1$: $f$ è crescente prima e dopo. Il segno **non cambia**, quindi $1$ non è un estremo: è un **flesso a tangente orizzontale**. Errore tipico: dichiarare "massimo o minimo" ogni punto stazionario.`,
            },
            {
              id: 's09.estremi.L2.e4', type: 'set', level: 2,
              prompt: String.raw`Trova i punti stazionari di $f(x)=x^2-2\log x$.`,
              answer: ['1'],
              explain: String.raw`**Prima il dominio**: $x>0$. Poi $f'(x)=2x-\frac2x=\frac{2(x^2-1)}{x}$, nulla per $x=\pm1$; ma $-1$ **non sta nel dominio**. Resta solo $x=1$. Dimenticare il dominio è l'errore più frequente.`,
            },
            {
              id: 's09.estremi.L2.e5', type: 'num', level: 2,
              prompt: String.raw`Per $f(x)=x^2-2\log x$ il punto $x=1$ è di minimo assoluto. Quanto vale il minimo?`,
              answer: '1',
              explain: String.raw`$f(1)=1-2\log1=1$. È assoluto: $f'<0$ su $(0,1)$ e $f'>0$ su $(1,+\infty)$, quindi $f$ scende fino a $1$ e poi sale (e $f\to+\infty$ sia per $x\to0^+$ sia per $x\to+\infty$).`,
            },
            {
              type: 'learn',
              title: 'Il test della derivata seconda',
              body: String.raw`Se $f'(x_0)=0$ e $f''(x_0)$ esiste:
- $f''(x_0)>0$ ⇒ **minimo** relativo (concavità verso l'alto, "sorriso");
- $f''(x_0)<0$ ⇒ **massimo** relativo;
- $f''(x_0)=0$ ⇒ **non si può concludere**: $x^4$ (minimo), $-x^4$ (massimo), $x^3$ (nessun estremo) hanno tutte $f'(0)=f''(0)=0$.

Agli esami del corso si usa quasi sempre il **segno di $f'$**, che risolve tutti i casi e dà anche la monotonia.`,
            },
            {
              id: 's09.estremi.L2.e6', type: 'mcq', level: 2,
              prompt: String.raw`Sai che $f'(x_0)=0$ e $f''(x_0)=0$. Che cosa puoi dire di $x_0$?`,
              options: [
                String.raw`Nulla: bisogna studiare il segno di $f'$ vicino a $x_0$`,
                String.raw`È sicuramente un punto di flesso`,
                String.raw`È sicuramente un estremo relativo`,
                String.raw`$f$ è costante in un intorno di $x_0$`,
              ],
              answer: 0,
              explain: String.raw`$x^3$ (flesso), $x^4$ (minimo) e $-x^4$ (massimo) soddisfano tutte $f'(0)=f''(0)=0$: il test della derivata seconda in questo caso tace.`,
            },
            {
              id: 's09.estremi.L2.e7', type: 'mcq', level: 3,
              prompt: String.raw`Sia $f(x)=x^3e^{-x}$, con $f'(x)=x^2(3-x)e^{-x}$. Il punto $x=0$ è…`,
              options: NAT_TEX, answer: 2, noShuffle: true,
              explain: String.raw`Vicino a $0$ i fattori $3-x$ ed $e^{-x}$ sono positivi e $x^2\ge0$: $f'\ge0$ sia a sinistra sia a destra. Nessun cambio di segno ⇒ flesso a tangente orizzontale. Invece $x=3$ è di massimo ($f'$ passa da $+$ a $-$).`,
              plot: { fns: ['x^3*e^(-x)'], x: [-1, 8], y: [-1, 1.6], points: [[0, 0, 'flesso'], [3, 1.344, 'max']] },
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          id: 's09.estremi.L3',
          title: 'Massimi e minimi assoluti su un intervallo chiuso',
          cards: [
            {
              type: 'learn',
              title: 'Il metodo di Weierstrass',
              body: String.raw`>* **Teorema di Weierstrass.** Se $f$ è continua su un intervallo **chiuso e limitato** $[a,b]$, allora $f$ ammette massimo e minimo assoluti su $[a,b]$.

Il teorema garantisce che esistono; per trovarli:
1. elenca i **candidati**: punti stazionari interni, punti interni di non derivabilità, gli estremi $a$ e $b$;
2. calcola $f$ in ciascun candidato;
3. il valore più grande è il massimo, il più piccolo il minimo.

Non serve la tabella dei segni! Basta confrontare un numero finito di valori.

>! Errore tipico: dimenticare $f(a)$ e $f(b)$. Molto spesso il massimo o il minimo sta proprio su un estremo.`,
            },
            {
              type: 'example',
              title: 'Esempio svolto',
              problem: String.raw`Trova massimo e minimo assoluti di $f(x)=x^3-3x^2$ su $[-1,4]$.`,
              steps: [
                String.raw`$f$ è un polinomio, quindi continua: Weierstrass garantisce max e min.`,
                String.raw`$f'(x)=3x^2-6x=3x(x-2)$: stazionari $x=0$ e $x=2$, entrambi interni.`,
                String.raw`Valori: $f(-1)=-4$, $f(0)=0$, $f(2)=8-12=-4$, $f(4)=64-48=16$.`,
                String.raw`Massimo $16$ (in $x=4$, un estremo dell'intervallo!), minimo $-4$ (assunto in $x=-1$ e in $x=2$).`,
              ],
              result: String.raw`$\max f = 16$, $\min f=-4$.`,
              plot: { fns: ['x^3-3x^2'], x: [-1.2, 4.2], y: [-6, 18], points: [[-1, -4], [0, 0], [2, -4], [4, 16, 'max']] },
            },
            {
              type: 'example',
              title: 'Con un modulo',
              problem: String.raw`Trova massimo e minimo assoluti di $f(x)=|x^2-4|$ su $[-1,3]$.`,
              steps: [
                String.raw`$f$ è continua. Non è derivabile dove $x^2-4=0$ cambia segno, cioè in $x=\pm2$: nell'intervallo c'è solo $x=2$.`,
                {
                  text: String.raw`Per $|x|<2$ si ha $f(x)=4-x^2$, $f'(x)=-2x$: stazionario $x=0$. Per $x>2$, $f(x)=x^2-4$, $f'(x)=2x>0$: nessuno stazionario.`,
                  ask: { type: 'num', prompt: String.raw`Qual è il punto stazionario interno?`, answer: '0', explain: String.raw`Su $(-1,2)$ vale $f=4-x^2$, con derivata $-2x$, nulla in $0$.` },
                },
                {
                  text: String.raw`Candidati: $-1$, $0$, $2$, $3$. Valori: $f(-1)=3$, $f(0)=4$, $f(2)=0$, $f(3)=5$.`,
                  ask: { type: 'num', prompt: String.raw`Quanto vale il massimo assoluto?`, answer: '5', explain: String.raw`Il valore più grande tra $3,4,0,5$ è $5=f(3)$, sull'estremo destro. $x=0$ è solo un massimo relativo.` },
                },
                String.raw`Il minimo è $0=f(2)$: un minimo in un **punto angoloso**, dove $f'$ non esiste.`,
              ],
              result: String.raw`$\max f = 5$ in $x=3$, $\min f = 0$ in $x=2$.`,
              plot: { fns: ['abs(x^2-4)'], x: [-1.2, 3.2], y: [-0.5, 6], points: [[-1, 3], [0, 4], [2, 0, 'angoloso'], [3, 5]] },
            },
            {
              id: 's09.estremi.L3.e1', type: 'num', level: 2,
              prompt: String.raw`Massimo assoluto di $f(x)=2x^3-3x^2-12x$ su $[-2,3]$.`,
              answer: '7',
              explain: String.raw`$f'(x)=6x^2-6x-12=6(x-2)(x+1)$: stazionari $-1$ e $2$. Valori: $f(-2)=-4$, $f(-1)=7$, $f(2)=-20$, $f(3)=-9$. Massimo $7$ in $x=-1$.`,
            },
            {
              id: 's09.estremi.L3.e2', type: 'num', level: 2,
              prompt: String.raw`Minimo assoluto di $f(x)=2x^3-3x^2-12x$ su $[-2,3]$.`,
              answer: '-20',
              explain: String.raw`Con gli stessi candidati ($f(-2)=-4$, $f(-1)=7$, $f(2)=-20$, $f(3)=-9$) il minimo è $-20$, in $x=2$.`,
            },
            {
              id: 's09.estremi.L3.e3', type: 'mcq', level: 2,
              prompt: String.raw`Quale di queste funzioni **non** ha massimo assoluto?`,
              options: [
                String.raw`$f(x)=x$ su $(0,1)$`,
                String.raw`$f(x)=x^2$ su $[0,1]$`,
                String.raw`$f(x)=\sin x$ su $\R$`,
                String.raw`$f(x)=e^{-x^2}$ su $\R$`,
              ],
              answer: 0,
              explain: String.raw`Su $(0,1)$ i valori di $x$ si avvicinano a $1$ senza raggiungerlo: $\sup=1$ ma non c'è massimo. Weierstrass non si applica perché l'intervallo è **aperto**. Le altre hanno massimo: $1$ in $x=1$; $1$ in $\frac\pi2$; $1$ in $0$ (Weierstrass è sufficiente, non necessario).`,
            },
            {
              id: 's09.estremi.L3.e4', type: 'num', level: 2,
              prompt: String.raw`Massimo assoluto di $f(x)=xe^{-x}$ su $[0,2]$.`,
              answer: '1/e',
              explain: String.raw`$f'(x)=(1-x)e^{-x}$: stazionario $x=1$. Valori: $f(0)=0$, $f(1)=e^{-1}$, $f(2)=2e^{-2}$. Poiché $2e^{-2}=\frac{2}{e}\cdot\frac1e<\frac1e$ (perché $2<e$), il massimo è $\frac1e$.`,
            },
            {
              id: 's09.estremi.L3.e5', type: 'problem', level: 3, points: 6,
              source: 'Appello 06/07/2026 · Parte B',
              prompt: String.raw`Sia $f(x)=2\sin x+\cos 2x$ per $x\in[0,2\pi]$. Determinare i punti stazionari, la loro natura, e massimo e minimo assoluti di $f$.`,
              parts: [
                { type: 'expr', prompt: String.raw`$f'(x)=$`, answer: '2*cos(x)*(1-2*sin(x))', alt: ['2*cos(x)-2*sin(2*x)'], explain: String.raw`$f'(x)=2\cos x-2\sin 2x=2\cos x-4\sin x\cos x=2\cos x(1-2\sin x)$.` },
                { type: 'set', prompt: String.raw`Punti stazionari in $(0,2\pi)$ (es. pi/6; …)`, answer: ['pi/6', 'pi/2', '5*pi/6', '3*pi/2'], explain: String.raw`$\cos x=0$ per $x=\frac\pi2,\frac{3\pi}2$; $\sin x=\frac12$ per $x=\frac\pi6,\frac{5\pi}6$.` },
                { type: 'mcq', prompt: String.raw`Natura del punto $x=\frac\pi2$`, options: [String.raw`minimo relativo`, String.raw`massimo relativo`, String.raw`né massimo né minimo`, String.raw`minimo assoluto`], answer: 0, explain: String.raw`Su $(\frac\pi6,\frac\pi2)$: $\cos x>0$ e $1-2\sin x<0$ ⇒ $f'<0$. Su $(\frac\pi2,\frac{5\pi}6)$: $\cos x<0$ e $1-2\sin x<0$ ⇒ $f'>0$. Passa da $-$ a $+$: **minimo relativo**, $f(\frac\pi2)=1$. Non assoluto: $f(\frac{3\pi}2)=-3$.` },
                { type: 'num', prompt: String.raw`Massimo assoluto di $f$`, answer: '3/2', explain: String.raw`$f(\frac\pi6)=2\cdot\frac12+\cos\frac\pi3=\frac32$ e $f(\frac{5\pi}6)=1+\cos\frac{5\pi}3=\frac32$; gli altri candidati valgono $1$, $-3$, $1$, $1$.` },
                { type: 'set', prompt: String.raw`Punti di massimo assoluto`, answer: ['pi/6', '5*pi/6'], explain: String.raw`Il valore $\frac32$ è assunto in entrambi i punti.` },
                { type: 'num', prompt: String.raw`Minimo assoluto di $f$`, answer: '-3', explain: String.raw`$f(\frac{3\pi}2)=2(-1)+\cos3\pi=-2-1=-3$.` },
                { type: 'mcq', prompt: String.raw`Gli estremi dell'intervallo $x=0$ e $x=2\pi$ (dove $f=1$) sono…`, options: [String.raw`$0$ minimo relativo, $2\pi$ massimo relativo`, String.raw`entrambi minimi relativi`, String.raw`nessuno dei due è un estremo, perché $f'$ non vi si annulla`, String.raw`entrambi massimi assoluti`], answer: 0, explain: String.raw`Su $[0,\frac\pi6)$ $f'>0$: partendo da $0$ la funzione sale, quindi $f(0)=1$ è un minimo relativo. Su $(\frac{3\pi}2,2\pi]$ $f'>0$: arrivando a $2\pi$ la funzione sale, quindi $f(2\pi)=1$ è un massimo relativo. Negli estremi dell'intervallo Fermat non si applica: $f'$ può non annullarsi.` },
              ],
              solution: String.raw`$f$ è continua e derivabile su $[0,2\pi]$. Usando $\sin2x=2\sin x\cos x$:
$$f'(x)=2\cos x-2\sin2x=2\cos x\,(1-2\sin x).$$
**Segno.** $\cos x>0$ su $[0,\frac\pi2)\cup(\frac{3\pi}2,2\pi]$; $1-2\sin x>0 \iff \sin x<\frac12 \iff x\in[0,\frac\pi6)\cup(\frac{5\pi}6,2\pi]$.

- su $(0,\frac\pi6)$: $f'>0$ (↗);
- su $(\frac\pi6,\frac\pi2)$: $f'<0$ (↘);
- su $(\frac\pi2,\frac{5\pi}6)$: $f'>0$ (↗);
- su $(\frac{5\pi}6,\frac{3\pi}2)$: $f'<0$ (↘);
- su $(\frac{3\pi}2,2\pi)$: $f'>0$ (↗).

Quindi: $\frac\pi6$ e $\frac{5\pi}6$ massimi relativi con $f=\frac32$; $\frac\pi2$ **minimo relativo** con $f=1$; $\frac{3\pi}2$ minimo relativo con $f=-3$. Negli estremi: $f(0)=f(2\pi)=1$ ($0$ minimo relativo, $2\pi$ massimo relativo).

Confrontando i valori: **massimo assoluto** $\frac32$ in $x=\frac\pi6$ e $x=\frac{5\pi}6$; **minimo assoluto** $-3$ in $x=\frac{3\pi}2$.

>! Nota: la soluzione ufficiale classifica $\frac\pi2$ come punto "né di massimo né di minimo". È sbagliato: $f'$ passa da $-$ a $+$, dunque è un minimo relativo (vicino a $\frac\pi2$ i valori sono tutti $\ge1$).`,
              plot: { fns: ['2*sin(x)+cos(2x)'], x: [0, 6.2832], y: [-3.3, 2], points: [[0.5236, 1.5, 'max'], [1.5708, 1, 'min rel'], [2.618, 1.5, 'max'], [4.7124, -3, 'min ass'], [0, 1], [6.2832, 1]] },
            },
            {
              id: 's09.estremi.L3.e6', type: 'tf', level: 2,
              prompt: String.raw`Per $f(x)=2\sin x+\cos2x$ su $[0,2\pi]$, il punto $x=\frac\pi2$ non è né di massimo né di minimo perché $f(\frac\pi2)=1=f(0)$.`,
              answer: false,
              explain: String.raw`Avere lo stesso valore in un punto lontano non dice nulla sulla natura **locale**. Vicino a $\frac\pi2$ la funzione scende e poi risale ($f'$: $-$ poi $+$), quindi $\frac\pi2$ è di **minimo relativo**.`,
            },
            {
              id: 's09.estremi.L3.e7', type: 'open', level: 2,
              prompt: String.raw`Descrivi il procedimento per trovare massimo e minimo assoluti di una funzione continua $f$ su $[a,b]$ e spiega perché funziona.`,
              answer: String.raw`Per il teorema di Weierstrass, $f$ continua su $[a,b]$ chiuso e limitato ammette massimo e minimo assoluti. Se un punto di estremo $x_0$ è interno e $f$ è derivabile in $x_0$, per il teorema di Fermat $f'(x_0)=0$. Quindi ogni punto di estremo è: un punto stazionario interno, oppure un punto interno di non derivabilità, oppure $a$ o $b$. Si calcolano i valori di $f$ in questi (finiti) candidati: il più grande è il massimo assoluto, il più piccolo il minimo assoluto.`,
              rubric: [
                'Cita Weierstrass (continuità su intervallo chiuso e limitato) per l\'esistenza',
                'Usa Fermat per restringere i punti interni derivabili a quelli stazionari',
                'Include i punti di non derivabilità e gli estremi a, b tra i candidati',
                'Conclude confrontando i valori di f nei candidati',
              ],
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          id: 's09.estremi.L4',
          title: "Livello d'esame: estremi e limitatezza",
          cards: [
            {
              type: 'learn',
              title: 'Estremo superiore e inferiore',
              body: String.raw`Su un dominio non chiuso o non limitato il massimo può non esistere. Allora si cercano $\sup f$ e $\inf f$:
1. trova gli estremi relativi con il segno di $f'$;
2. calcola i **limiti agli estremi del dominio** (anche $\pm\infty$ e i punti esclusi);
3. confronta: il più grande tra i massimi relativi e i limiti è $\sup f$; è un **massimo** solo se è assunto.

>! Un estremo relativo **non** è assoluto se un limite lo supera. Esempio: $e^x(x^2+3x+3)$ ha un minimo relativo $e^{-2}$, ma per $x\to-\infty$ tende a $0<e^{-2}$: $\inf f=0$, non assunto.

$f$ è **limitata** se $\inf f$ e $\sup f$ sono entrambi finiti.`,
              plot: { fns: [{ f: 'e^x*(x^2+3x+3)', label: 'e^x(x^2+3x+3)' }], x: [-7, -0.8], y: [0, 0.4], points: [[-3, 0.1494, 'max rel'], [-2, 0.1353, 'min rel']], hlines: [0] },
            },
            {
              id: 's09.estremi.L4.e1', type: 'problem', level: 3, points: 5,
              source: 'Itinere 11/11/2025 · Parte B',
              prompt: String.raw`Si determinino i punti stazionari di $f(x)=e^x(x^2+3x+3)$ e se ne stabilisca la natura. Sono estremi assoluti?`,
              parts: [
                { type: 'expr', prompt: String.raw`$f'(x)=$`, answer: 'e^x*(x^2+5x+6)', explain: String.raw`$f'(x)=e^x(x^2+3x+3)+e^x(2x+3)=e^x(x^2+5x+6)$.` },
                { type: 'set', prompt: 'Punti stazionari', answer: ['-3', '-2'], explain: String.raw`$x^2+5x+6=(x+2)(x+3)=0$ per $x=-3$, $x=-2$; $e^x$ non si annulla.` },
                { type: 'mcq', prompt: String.raw`Natura di $x=-3$`, options: NAT_TEX, answer: 0, noShuffle: true, explain: String.raw`Il segno di $f'$ è quello di $(x+2)(x+3)$: $+$ per $x<-3$, $-$ in $(-3,-2)$. Da $+$ a $-$: massimo relativo, $f(-3)=3e^{-3}$.` },
                { type: 'mcq', prompt: String.raw`Natura di $x=-2$`, options: NAT_TEX, answer: 1, noShuffle: true, explain: String.raw`Da $-$ (in $(-3,-2)$) a $+$ (per $x>-2$): minimo relativo, $f(-2)=e^{-2}$.` },
                { type: 'num', prompt: String.raw`$\inf_{\R} f=$`, answer: '0', explain: String.raw`$x^2+3x+3>0$ sempre ($\Delta=-3<0$), quindi $f>0$; e $\lim_{x\to-\infty}e^x(x^2+3x+3)=0$ (l'esponenziale vince sul polinomio). Dunque $\inf f=0$, non assunto.` },
                { type: 'mcq', prompt: 'I due punti trovati sono estremi assoluti?', options: [String.raw`No: $\sup f=+\infty$ e $\inf f=0<e^{-2}$`, String.raw`Sì, entrambi`, String.raw`Solo $-2$ è minimo assoluto`, String.raw`Solo $-3$ è massimo assoluto`], answer: 0, explain: String.raw`$\lim_{x\to+\infty}f=+\infty$, quindi nessun massimo assoluto; e i valori vicino a $-\infty$ scendono sotto $f(-2)=e^{-2}$, quindi $-2$ non è minimo assoluto.` },
              ],
              solution: String.raw`Dominio $\R$. $f'(x)=e^x(x^2+3x+3)+e^x(2x+3)=e^x(x^2+5x+6)=e^x(x+2)(x+3)$.

Segno di $f'$: positivo per $x<-3$ e $x>-2$, negativo in $(-3,-2)$. Quindi $f$ cresce su $(-\infty,-3]$, decresce su $[-3,-2]$, cresce su $[-2,+\infty)$.

- $x=-3$: **massimo relativo**, $f(-3)=e^{-3}(9-9+3)=3e^{-3}$;
- $x=-2$: **minimo relativo**, $f(-2)=e^{-2}(4-6+3)=e^{-2}$.

Limiti: $\lim_{x\to+\infty}f=+\infty$; $\lim_{x\to-\infty}f=0^+$ (gerarchia degli infiniti). Poiché $x^2+3x+3>0$, $f>0$ e $\inf f=0$ non è assunto. **Nessuno dei due punti è un estremo assoluto**: $f$ non ha né massimo né minimo.`,
              plot: { fns: ['e^x*(x^2+3x+3)'], x: [-7, -0.8], y: [0, 0.4], points: [[-3, 0.1494, 'max rel'], [-2, 0.1353, 'min rel']] },
            },
            {
              id: 's09.estremi.L4.e2', type: 'problem', level: 3, points: 5,
              source: 'Itinere 11/11/2025 · Parte B',
              prompt: String.raw`Sia $f(x)=\dfrac{\sqrt{x-1}}{\sqrt{5-x}}$. Determinare il dominio, gli eventuali estremi assoluti e dire se $f$ è limitata.`,
              parts: [
                { type: 'interval', prompt: 'Dominio', answer: '[1,5)', explain: String.raw`Serve $x-1\ge0$ (radice al numeratore) e $5-x>0$ (radice al denominatore, che non può essere nulla): $1\le x<5$.` },
                { type: 'num', prompt: String.raw`$\lim_{x\to5^-}f(x)=$`, answer: 'inf', explain: String.raw`Numeratore $\to2$, denominatore $\to0^+$: il limite è $+\infty$.` },
                { type: 'mcq', prompt: 'Monotonia', options: [String.raw`strettamente crescente su $[1,5)$`, String.raw`strettamente decrescente su $[1,5)$`, String.raw`crescente e poi decrescente`, String.raw`costante`], answer: 0, explain: String.raw`$f'(x)=\frac{2}{\sqrt{x-1}\,(5-x)^{3/2}}>0$ per $1<x<5$. Si vede anche senza derivate: il numeratore cresce e il denominatore (positivo) decresce.` },
                { type: 'num', prompt: 'Minimo assoluto di f', answer: '0', explain: String.raw`$f\ge0$ e $f(1)=0$: minimo assoluto $0$ in $x=1$, un estremo del dominio (lì $f'$ non si annulla: $f'_+(1)=+\infty$).` },
                { type: 'mcq', prompt: String.raw`$f$ è limitata?`, options: [String.raw`No: è limitata inferiormente ma non superiormente`, String.raw`Sì, perché il dominio è limitato`, String.raw`Sì, con massimo in $x=5$`, String.raw`No: non è limitata inferiormente`], answer: 0, explain: String.raw`$\sup f=+\infty$ per il limite in $5^-$. Un dominio limitato non basta: $5$ non appartiene al dominio, quindi Weierstrass non si applica.` },
              ],
              solution: String.raw`**Dominio:** $x-1\ge0$ e $5-x>0$, cioè $D=[1,5)$. $f\ge0$ e $f(1)=0$.

**Derivata** (per $1<x<5$), scrivendo $f=(x-1)^{1/2}(5-x)^{-1/2}$:
$$f'(x)=\tfrac12(x-1)^{-1/2}(5-x)^{-3/2}\big[(5-x)+(x-1)\big]=\frac{2}{\sqrt{x-1}\,(5-x)^{3/2}}>0.$$
$f$ è strettamente crescente; $f'_+(1)=+\infty$ (tangente verticale in $1$).

**Limiti:** $\lim_{x\to5^-}f=+\infty$: asintoto verticale $x=5$.

**Conclusione:** minimo assoluto $0$ in $x=1$; nessun massimo, $\sup f=+\infty$; $f$ è limitata inferiormente ma non superiormente.`,
              plot: { fns: ['sqrt(x-1)/sqrt(5-x)'], x: [0.5, 5], y: [-0.5, 6], points: [[1, 0, 'min']], vlines: [5] },
            },
            {
              id: 's09.estremi.L4.e3', type: 'num', level: 2,
              prompt: String.raw`Calcola $\sup_{\R} \dfrac{x}{1+x^2}$.`,
              answer: '1/2',
              explain: String.raw`$f'(x)=\frac{1-x^2}{(1+x^2)^2}$: massimo in $x=1$ con $f(1)=\frac12$, minimo in $x=-1$ con $f(-1)=-\frac12$. I limiti a $\pm\infty$ valgono $0$, che non supera $\frac12$: il sup è un massimo, $\frac12$.`,
              plot: { fns: ['x/(1+x^2)'], x: [-6, 6], y: [-0.7, 0.7], points: [[1, 0.5], [-1, -0.5]], hlines: [0] },
            },
            {
              id: 's09.estremi.L4.e4', type: 'mcq', level: 2,
              prompt: String.raw`Sia $f(x)=x^2e^{-x}$ su $\R$ ($f'(x)=x(2-x)e^{-x}$). Quale affermazione è corretta?`,
              options: [
                String.raw`$0$ è minimo assoluto, $2$ è massimo relativo ma non assoluto`,
                String.raw`$2$ è massimo assoluto perché è l'unico massimo`,
                String.raw`$f$ è limitata`,
                String.raw`$0$ non è un estremo perché $f(0)=0$`,
              ],
              answer: 0,
              explain: String.raw`$f\ge0=f(0)$: minimo assoluto in $0$. In $2$ c'è un massimo relativo, $f(2)=4e^{-2}$, ma $\lim_{x\to-\infty}x^2e^{-x}=+\infty$: non è assoluto e $f$ non è limitata superiormente. "Unico massimo relativo" **non** implica "assoluto".`,
              plot: { fns: ['x^2*e^(-x)'], x: [-1.5, 8], y: [-0.2, 3], points: [[0, 0, 'min ass'], [2, 0.5413, 'max rel']] },
            },
            {
              id: 's09.estremi.L4.e5', type: 'tf', level: 2,
              prompt: String.raw`Una funzione continua e limitata su $(a,b)$ ha sempre massimo e minimo.`,
              answer: false,
              explain: String.raw`$f(x)=x$ su $(0,1)$ è continua e limitata, ma $\sup=1$ e $\inf=0$ non sono assunti. Weierstrass richiede l'intervallo **chiuso**.`,
            },
            {
              id: 's09.estremi.L4.e6', type: 'problem', level: 3, points: 5,
              prompt: String.raw`Sia $f(x)=x\,|x-2|$ su $[-1,3]$. Studiare la derivabilità in $x=2$, trovare gli estremi relativi interni e il massimo e minimo assoluti.`,
              parts: [
                { type: 'num', prompt: String.raw`$f'_-(2)=$`, answer: '-2', explain: String.raw`Per $x<2$: $f=x(2-x)=2x-x^2$, $f'=2-2x$; in $2$ vale $-2$.` },
                { type: 'num', prompt: String.raw`$f'_+(2)=$`, answer: '2', explain: String.raw`Per $x>2$: $f=x^2-2x$, $f'=2x-2$; in $2$ vale $2$. Derivate laterali finite e diverse: **punto angoloso**.` },
                { type: 'mcq', prompt: String.raw`Il punto $x=1$ è…`, options: NAT_TEX, answer: 0, noShuffle: true, explain: String.raw`Su $(-1,2)$ $f'=2-2x$: positiva per $x<1$, negativa per $x>1$: massimo relativo, $f(1)=1$.` },
                { type: 'mcq', prompt: String.raw`Il punto $x=2$ è…`, options: NAT_TEX, answer: 1, noShuffle: true, explain: String.raw`$f$ decresce su $(1,2)$ e cresce su $(2,3)$: minimo relativo $f(2)=0$, in un punto dove $f$ non è derivabile.` },
                { type: 'num', prompt: 'Massimo assoluto', answer: '3', explain: String.raw`Candidati: $f(-1)=-3$, $f(1)=1$, $f(2)=0$, $f(3)=3$. Massimo $3$ in $x=3$.` },
                { type: 'num', prompt: 'Minimo assoluto', answer: '-3', explain: String.raw`Il minimo è $-3$, nell'estremo $x=-1$.` },
              ],
              solution: String.raw`Scrivo $f$ senza modulo: $f(x)=2x-x^2$ per $x<2$, $f(x)=x^2-2x$ per $x\ge2$. $f$ è continua (in $2$ entrambe valgono $0$).

Derivate: $f'(x)=2-2x$ per $x<2$, $f'(x)=2x-2$ per $x>2$. Poiché $f$ è continua in $2$ e le derivate hanno limite: $f'_-(2)=-2$, $f'_+(2)=2$: **punto angoloso**.

Segno: $f'>0$ su $(-1,1)$, $f'<0$ su $(1,2)$, $f'>0$ su $(2,3)$. Massimo relativo $f(1)=1$, minimo relativo $f(2)=0$.

Candidati per gli assoluti: $f(-1)=-3$, $f(1)=1$, $f(2)=0$, $f(3)=3$. **Massimo assoluto $3$** in $x=3$, **minimo assoluto $-3$** in $x=-1$.`,
              plot: { fns: ['x*abs(x-2)'], x: [-1.2, 3.2], y: [-3.5, 3.5], points: [[-1, -3, 'min'], [1, 1], [2, 0, 'angoloso'], [3, 3, 'max']] },
            },
            {
              id: 's09.estremi.L4.e7', type: 'tf', level: 2,
              prompt: String.raw`Se $x_0$ è un punto angoloso di $f$, allora $x_0$ è un punto di estremo relativo.`,
              answer: false,
              explain: String.raw`Un angolo può stare su un tratto sempre crescente: $f(x)=x$ per $x<0$, $f(x)=2x$ per $x\ge0$ ha un punto angoloso in $0$ ($f'_-=1$, $f'_+=2$) ma è strettamente crescente. Bisogna sempre guardare la monotonia a sinistra e a destra.`,
            },
            {
              id: 's09.estremi.L4.e8', type: 'mcq', level: 3,
              prompt: String.raw`Sia $f(x)=x-2\arctan x$. Quali sono massimo relativo e minimo relativo?`,
              options: [
                String.raw`max rel in $x=-1$ ($f=\frac\pi2-1$), min rel in $x=1$ ($f=1-\frac\pi2$), nessun estremo assoluto`,
                String.raw`max assoluto in $x=-1$, min assoluto in $x=1$`,
                String.raw`max rel in $x=1$, min rel in $x=-1$`,
                String.raw`nessun punto stazionario`,
              ],
              answer: 0,
              explain: String.raw`$f'(x)=1-\frac{2}{1+x^2}=\frac{x^2-1}{1+x^2}$: positiva per $|x|>1$, negativa per $|x|<1$. Quindi max in $-1$: $f(-1)=-1+2\cdot\frac\pi4=\frac\pi2-1$; min in $1$: $1-\frac\pi2$. Poiché $f\to\pm\infty$ per $x\to\pm\infty$, non sono assoluti.`,
              plot: { fns: ['x-2*atan(x)'], x: [-5, 5], y: [-3, 3], points: [[-1, 0.5708], [1, -0.5708]] },
            },
          ],
        },
      ],
      practice: [
        // ---------- generatori ----------
        {
          id: 's09.estremi.gen-cubica', type: 'gen', level: 2,
          gen: (R) => {
            const { a, p, q, co } = cubic(R);
            const d1 = H.polyDeriv(co);
            const natP = a > 0 ? 0 : 1;
            const natQ = a > 0 ? 1 : 0;
            const fP = pval(co, p), fQ = pval(co, q);
            return {
              type: 'problem',
              prompt: String.raw`Sia $f(x)=${H.poly(co)}$. Trova i punti stazionari e stabiliscine la natura.`,
              parts: [
                { type: 'expr', prompt: String.raw`$f'(x)=$`, answer: H.polyStr(d1), answerTex: H.poly(d1), explain: String.raw`$f'(x)=${H.poly(d1)}=${3 * a}${fac(p)}${fac(q)}$.` },
                { type: 'set', prompt: 'Punti stazionari', answer: [String(p), String(q)], explain: String.raw`$f'(x)=0$ per $x=${p}$ e $x=${q}$.` },
                { type: 'mcq', prompt: String.raw`Natura di $x=${p}$`, options: NAT_TEX, answer: natP, noShuffle: true, explain: String.raw`$f'$ è una parabola con coefficiente direttore $${3 * a}$ ${a > 0 ? 'positivo: è positiva fuori dalle radici e negativa tra le radici' : 'negativo: è negativa fuori dalle radici e positiva tra le radici'}. In $x=${p}$ passa da $${a > 0 ? '+' : '-'}$ a $${a > 0 ? '-' : '+'}$: ${NAT[natP]}, $f(${p})=${fP}$.` },
                { type: 'mcq', prompt: String.raw`Natura di $x=${q}$`, options: NAT_TEX, answer: natQ, noShuffle: true, explain: String.raw`In $x=${q}$ il segno di $f'$ passa da $${a > 0 ? '-' : '+'}$ a $${a > 0 ? '+' : '-'}$: ${NAT[natQ]}, $f(${q})=${fQ}$. Nessuno dei due è assoluto: un polinomio di grado dispari tende a $\pm\infty$.` },
              ],
              solution: String.raw`$f'(x)=${H.poly(d1)}$, che si annulla in $${p}$ e $${q}$. ${a > 0 ? 'Crescente' : 'Decrescente'} su $(-\infty,${p})$, ${a > 0 ? 'decrescente' : 'crescente'} su $(${p},${q})$, ${a > 0 ? 'crescente' : 'decrescente'} su $(${q},+\infty)$. ${a > 0 ? 'Massimo' : 'Minimo'} relativo $f(${p})=${fP}$, ${a > 0 ? 'minimo' : 'massimo'} relativo $f(${q})=${fQ}$. Nessun estremo assoluto (grado dispari).`,
            };
          },
        },
        {
          id: 's09.estremi.gen-xn-eax', type: 'gen', level: 2,
          gen: (R) => {
            const n = R.int(1, 4);
            const a = R.pick([-3, -2, -1, 1, 2, 3]);
            const x1 = -n / a;
            const x1Tex = H.frac(-n, a);
            const fp = (x) => Math.pow(x, n - 1) * (n + a * x);
            const eps = 1e-3;
            const nat1 = nature(fp(x1 - eps), fp(x1 + eps));
            const nat0 = nature(fp(-eps), fp(eps));
            const fTex = `${xpow(n)}${eax(a)}`;
            const dTex = `${xpow(n - 1)}${eax(a)}\\left(${n} ${H.signed(a, 'x')}\\right)`;
            const parts = [
              { type: 'expr', prompt: String.raw`$f'(x)=$`, answer: `x^(${n - 1})*e^(${a}*x)*(${n}+(${a})*x)`, answerTex: dTex, domain: [0.3, 1.5], explain: String.raw`Regola del prodotto: $f'(x)=${n === 1 ? eax(a) : `${n}${xpow(n - 1)}${eax(a)}`} ${H.signed(a, `${xpow(n)}${eax(a)}`)}=${dTex}$.` },
              { type: 'set', prompt: 'Punti stazionari', answer: n >= 2 ? ['0', H.fracStr(-n, a)] : [H.fracStr(-n, a)], explain: String.raw`$e^{${H.coef(a)}x}>0$: ${n >= 2 ? `$f'=0$ per $x=0$ (fattore $${xpow(n - 1)}$) e` : '$f\'=0$ solo'} per $${n} ${H.signed(a, 'x')}=0$, cioè $x=${x1Tex}$.` },
              { type: 'mcq', prompt: String.raw`Natura di $x=${x1Tex}$`, options: NAT_TEX, answer: nat1, noShuffle: true, explain: String.raw`Il fattore $${n} ${H.signed(a, 'x')}$ cambia segno in $${x1Tex}$${n >= 2 ? `, mentre $${xpow(n - 1)}$ lì ha segno costante` : ''}: $f'$ passa da $${fp(x1 - eps) > 0 ? '+' : '-'}$ a $${fp(x1 + eps) > 0 ? '+' : '-'}$, quindi è un ${NAT[nat1]}.` },
            ];
            if (n >= 2) {
              parts.push({ type: 'mcq', prompt: String.raw`Natura di $x=0$`, options: NAT_TEX, answer: nat0, noShuffle: true, explain: String.raw`Vicino a $0$ il fattore $${n} ${H.signed(a, 'x')}$ è positivo; $${xpow(n - 1)}$ ${(n - 1) % 2 === 0 ? 'ha esponente pari: non cambia segno, quindi $0$ non è un estremo (flesso a tangente orizzontale)' : `ha esponente dispari: passa da $-$ a $+$, quindi $0$ è un ${NAT[nat0]}`}.` });
            }
            const fr = H.frac(Math.pow(-n, n), Math.pow(a, n));
            const valTex = `${fr === '1' ? '' : fr === '-1' ? '-' : fr}e^{${-n}}`;
            parts.push({ type: 'num', prompt: String.raw`$f(${x1Tex})=$`, answer: `(${-n}/(${a}))^${n}*e^(${-n})`, answerTex: valTex, explain: String.raw`$f(${x1Tex})=${n === 1 ? x1Tex : String.raw`\left(${x1Tex}\right)^{${n}}`}e^{${-n}}=${valTex}$ (l'esponente è $${H.coef(a)}x=${-n}$).` });
            return {
              type: 'problem',
              prompt: String.raw`Sia $f(x)=${fTex}$. Trova i punti stazionari e la loro natura.`,
              parts,
              solution: String.raw`$f'(x)=${dTex}$. Poiché l'esponenziale è positivo, il segno dipende solo ${n >= 2 ? `da $${xpow(n - 1)}$ e ` : ''}da $${n} ${H.signed(a, 'x')}$. Punto $x=${x1Tex}$: ${NAT[nat1]}${n >= 2 ? `; punto $x=0$: ${NAT[nat0]}` : ''}.`,
            };
          },
        },
        {
          id: 's09.estremi.gen-chiuso', type: 'gen', level: 2,
          gen: (R) => {
            const { p, q, co } = cubic(R, -2, 2);
            const L = p - R.int(1, 2);
            const Rr = R.chance(0.3) && q - p >= 2 ? p + 1 : q + R.int(0, 2);
            const cand = [L, Rr, ...[p, q].filter((x) => x > L && x < Rr)];
            const vals = cand.map((x) => [x, pval(co, x)]);
            const M = Math.max(...vals.map((v) => v[1]));
            const m = Math.min(...vals.map((v) => v[1]));
            const tab = vals.map(([x, v]) => `f(${x})=${v}`).join(',\\ ');
            const d1 = H.polyDeriv(co);
            return {
              type: 'problem',
              prompt: String.raw`Trova massimo e minimo assoluti di $f(x)=${H.poly(co)}$ sull'intervallo $[${L},${Rr}]$.`,
              parts: [
                { type: 'num', prompt: 'Massimo assoluto', answer: String(M), explain: String.raw`$f'(x)=${H.poly(d1)}$ si annulla in $${p}$ e $${q}$; si tengono solo quelli interni a $[${L},${Rr}]$, più gli estremi. Valori: $${tab}$. Il più grande è $${M}$.` },
                { type: 'num', prompt: 'Minimo assoluto', answer: String(m), explain: String.raw`Tra i valori $${tab}$ il più piccolo è $${m}$. Non dimenticare gli estremi dell'intervallo!` },
              ],
              solution: String.raw`$f$ è continua su $[${L},${Rr}]$ (Weierstrass). Stazionari: $${p}$, $${q}$; candidati: $${cand.join(',\\ ')}$. Valori: $${tab}$. Massimo $${M}$, minimo $${m}$.`,
            };
          },
        },
        {
          id: 's09.estremi.gen-angoloso', type: 'gen', level: 3,
          gen: (R) => {
            const p = R.int(-3, 3);
            let q = R.int(-3, 3);
            while (q === p || (p + q) % 2 !== 0) q = R.int(-3, 3);
            const m = (p + q) / 2;
            const natP = q > p ? 0 : 1; // q>p: f<=0 vicino a p -> massimo
            const natM = q > p ? 1 : 0;
            return {
              type: 'problem',
              prompt: String.raw`Sia $f(x)=|${xm(p)}|\,${fac(q)}$. Studia la derivabilità in $x=${p}$ e trova gli estremi relativi.`,
              parts: [
                { type: 'num', prompt: String.raw`$f'_-(${p})=$`, answer: String(q - p), explain: String.raw`Per $x<${p}$: $f(x)=-${fac(p)}${fac(q)}$, $f'(x)=${H.lin(-2, p + q)}$; in $${p}$ vale $${q - p}$.` },
                { type: 'num', prompt: String.raw`$f'_+(${p})=$`, answer: String(p - q), explain: String.raw`Per $x>${p}$: $f(x)=${fac(p)}${fac(q)}$, $f'(x)=${H.lin(2, -(p + q))}$; in $${p}$ vale $${p - q}$. Derivate laterali finite e diverse: punto angoloso.` },
                { type: 'mcq', prompt: String.raw`Il punto $x=${p}$ è…`, options: NAT_TEX, answer: natP, noShuffle: true, explain: String.raw`$f(${p})=0$ e vicino a $${p}$ (da entrambi i lati) $f$ ha il segno di $${xm(q)}$, cioè ${q > p ? 'negativo' : 'positivo'}: ${NAT[natP]}.` },
                { type: 'num', prompt: 'Punto stazionario', answer: String(m), explain: String.raw`$${H.lin(2, -(p + q))}=0$ per $x=${m}$, che sta ${q > p ? 'a destra' : 'a sinistra'} di $${p}$, quindi nel tratto giusto: è un ${NAT[natM]}.` },
              ],
              solution: String.raw`Senza modulo: $f=${fac(p)}${fac(q)}$ per $x\ge${p}$, $f=-${fac(p)}${fac(q)}$ per $x<${p}$. Continua in $${p}$, con $f'_-(${p})=${q - p}$ e $f'_+(${p})=${p - q}$: punto angoloso, ${NAT[natP]}. Stazionario $x=${m}$: ${NAT[natM]}.`,
            };
          },
        },
        // ---------- esercizi fissi ----------
        {
          id: 's09.estremi.p1', type: 'set', level: 2,
          prompt: String.raw`Punti stazionari di $f(x)=x^4-4x^3$.`,
          answer: ['0', '3'],
          explain: String.raw`$f'(x)=4x^3-12x^2=4x^2(x-3)$: si annulla in $0$ e $3$.`,
        },
        {
          id: 's09.estremi.p2', type: 'mcq', level: 2,
          prompt: String.raw`Per $f(x)=x^4-4x^3$, con $f'(x)=4x^2(x-3)$, la natura di $x=0$ e $x=3$ è…`,
          options: [
            String.raw`$0$: né max né min; $3$: minimo assoluto`,
            String.raw`$0$: massimo relativo; $3$: minimo relativo`,
            String.raw`$0$: minimo; $3$: massimo`,
            String.raw`entrambi flessi`,
          ],
          answer: 0,
          explain: String.raw`$x^2\ge0$ non cambia segno: in $0$ $f'$ resta negativa ⇒ flesso a tangente orizzontale. In $3$ passa da $-$ a $+$ ⇒ minimo, $f(3)=-27$; è assoluto perché $f\to+\infty$ a $\pm\infty$.`,
        },
        {
          id: 's09.estremi.p3', type: 'num', level: 2,
          prompt: String.raw`Minimo di $f(x)=x+\frac4x$ su $(0,+\infty)$.`,
          answer: '4',
          explain: String.raw`$f'(x)=1-\frac4{x^2}=\frac{x^2-4}{x^2}$: su $(0,+\infty)$ si annulla solo in $x=2$ ($-2$ è fuori dall'intervallo), con $f'<0$ prima e $>0$ dopo. $f(2)=4$; e $f\to+\infty$ in $0^+$ e a $+\infty$: minimo assoluto $4$.`,
        },
        {
          id: 's09.estremi.p4', type: 'num', level: 2,
          prompt: String.raw`Massimo assoluto di $f(x)=\sin x+\cos x$ su $[0,\pi]$.`,
          answer: 'sqrt(2)',
          explain: String.raw`$f'(x)=\cos x-\sin x=0$ per $x=\frac\pi4$ in $[0,\pi]$. Valori: $f(0)=1$, $f(\frac\pi4)=\sqrt2$, $f(\pi)=-1$. Massimo $\sqrt2$ (il minimo è $-1$, in $\pi$).`,
        },
        {
          id: 's09.estremi.p5', type: 'num', level: 2,
          prompt: String.raw`Valore del massimo assoluto di $f(x)=\dfrac{\log x}{x}$.`,
          answer: '1/e',
          explain: String.raw`Dominio $x>0$. $f'(x)=\frac{1-\log x}{x^2}$: positiva per $x<e$, negativa per $x>e$. Massimo in $x=e$, $f(e)=\frac1e$; è assoluto perché $f$ cresce fino a $e$ e poi decresce (verso $0$).`,
        },
        {
          id: 's09.estremi.p6', type: 'mcq', level: 2,
          prompt: String.raw`$f(x)=(x^2-3)e^x$ ha $f'(x)=(x+3)(x-1)e^x$. Quale affermazione è corretta?`,
          options: [
            String.raw`min assoluto $-2e$ in $x=1$; max relativo (non assoluto) $6e^{-3}$ in $x=-3$`,
            String.raw`max assoluto in $x=-3$ e min assoluto in $x=1$`,
            String.raw`max relativo in $x=1$, min relativo in $x=-3$`,
            String.raw`nessun estremo assoluto`,
          ],
          answer: 0,
          explain: String.raw`Segno di $f'$: $+$, $-$, $+$ attorno a $-3$ e $1$ ⇒ max in $-3$, min in $1$. $\lim_{x\to+\infty}f=+\infty$ (nessun max assoluto); $\lim_{x\to-\infty}f=0$ e $f(1)=-2e<0$: il minimo relativo è anche assoluto.`,
        },
        {
          id: 's09.estremi.p7', type: 'num', level: 3,
          prompt: String.raw`Minimo assoluto di $f(x)=x^2\log x$.`,
          answer: '-1/(2*e)',
          explain: String.raw`Dominio $x>0$. $f'(x)=2x\log x+x=x(2\log x+1)$, nulla per $x=e^{-1/2}$; negativa prima, positiva dopo. $f(e^{-1/2})=e^{-1}\cdot(-\frac12)=-\frac1{2e}$. Assoluto: $\lim_{0^+}f=0$ e $\lim_{+\infty}f=+\infty$.`,
        },
        {
          id: 's09.estremi.p8', type: 'tf', level: 2,
          prompt: String.raw`Se $f$ è derivabile su $\R$ e ha un solo punto stazionario, che è un minimo relativo, allora è un minimo assoluto.`,
          answer: true,
          explain: String.raw`Se $x_0$ è l'unico zero di $f'$ e $f'$ passa da $-$ a $+$, per il teorema dei valori intermedi applicato a $f'$ (Darboux) $f'<0$ su tutto $(-\infty,x_0)$ e $f'>0$ su tutto $(x_0,+\infty)$: $f$ decresce fino a $x_0$ e poi cresce. Attenzione: vale su un **intervallo**; su un dominio "spezzato" (es. $x\neq0$) può essere falso.`,
        },
        {
          id: 's09.estremi.p9', type: 'open', level: 2,
          prompt: String.raw`Spiega perché un punto stazionario non è necessariamente un punto di estremo, e come si decide la sua natura. Dai un esempio.`,
          answer: String.raw`Il teorema di Fermat dice che in un estremo interno di derivabilità $f'(x_0)=0$: è una condizione necessaria, non sufficiente. Ad esempio $f(x)=x^3$ ha $f'(0)=0$ ma è strettamente crescente, quindi $0$ non è estremo (flesso a tangente orizzontale). La natura si decide con il segno di $f'$ in un intorno: da $+$ a $-$ massimo relativo, da $-$ a $+$ minimo relativo, nessun cambio di segno nessun estremo. In alternativa, se $f''(x_0)\ne0$, il suo segno decide (positivo minimo, negativo massimo).`,
          rubric: ['Fermat: condizione necessaria e non sufficiente', 'Controesempio corretto (es. x^3)', 'Criterio del segno di f\' a sinistra e a destra', 'Eventuale test della derivata seconda con il caso f\'\'=0 inconcludente'],
        },
        {
          id: 's09.estremi.p10', type: 'cloze', level: 1,
          prompt: 'Completa il teorema di Weierstrass.',
          text: String.raw`Se $f$ è [[0]] su un intervallo [[1]], allora $f$ ammette [[2]] su quell'intervallo.`,
          blanks: [
            { options: ['continua', 'derivabile', 'monotona'], answer: 0 },
            { options: ['chiuso e limitato', 'aperto', 'qualunque'], answer: 0 },
            { options: ['massimo e minimo assoluti', 'almeno un punto stazionario', 'un unico zero'], answer: 0 },
          ],
          explain: String.raw`Servono **continuità** e intervallo **chiuso e limitato** $[a,b]$. Se manca una delle due ipotesi il massimo può non esistere: $x$ su $(0,1)$, oppure $\frac1x$ su $(0,1]$.`,
        },
      ],
      flashcards: [
        { id: 's09.estremi.fc1', kind: 'def', front: String.raw`Punto di massimo (minimo) relativo`, back: String.raw`$x_0\in A$ tale che esiste un intorno $I$ di $x_0$ con $f(x)\le f(x_0)$ (risp. $\ge$) per ogni $x\in I\cap A$.` },
        { id: 's09.estremi.fc2', kind: 'def', front: String.raw`Punto di massimo (minimo) assoluto; valore massimo`, back: String.raw`$x_0$ con $f(x)\le f(x_0)$ (risp. $\ge$) per **ogni** $x\in A$. Il numero $f(x_0)$ è il **massimo** di $f$; $x_0$ è il **punto** di massimo.` },
        { id: 's09.estremi.fc3', kind: 'def', front: String.raw`Punto stazionario (critico)`, back: String.raw`Punto $x_0$ interno al dominio in cui $f$ è derivabile e $f'(x_0)=0$ (tangente orizzontale).` },
        { id: 's09.estremi.fc4', kind: 'thm', front: String.raw`Teorema di Fermat`, back: String.raw`Se $x_0$ è punto di estremo relativo **interno** ad $A$ e $f$ è **derivabile** in $x_0$, allora $f'(x_0)=0$. Condizione necessaria, non sufficiente ($x^3$ in $0$).` },
        { id: 's09.estremi.fc5', kind: 'thm', front: String.raw`Test di monotonia`, back: String.raw`Su un **intervallo** $I$: $f'>0$ ⇒ $f$ strettamente crescente; $f'<0$ ⇒ strettamente decrescente; $f'=0$ ⇒ costante (conseguenze di Lagrange).` },
        { id: 's09.estremi.fc6', kind: 'metodo', front: String.raw`Natura di un punto stazionario (test della derivata prima)`, back: String.raw`$f'$ da $+$ a $-$: massimo relativo. Da $-$ a $+$: minimo relativo. Nessun cambio di segno: non è un estremo (flesso a tangente orizzontale).` },
        { id: 's09.estremi.fc7', kind: 'metodo', front: String.raw`Test della derivata seconda`, back: String.raw`$f'(x_0)=0$: se $f''(x_0)>0$ minimo, se $f''(x_0)<0$ massimo, se $f''(x_0)=0$ **non si conclude** ($x^4$, $-x^4$, $x^3$).` },
        { id: 's09.estremi.fc8', kind: 'thm', front: String.raw`Teorema di Weierstrass`, back: String.raw`$f$ continua su $[a,b]$ chiuso e limitato ⇒ $f$ ha massimo e minimo assoluti su $[a,b]$.` },
        { id: 's09.estremi.fc9', kind: 'metodo', front: String.raw`Max e min assoluti su $[a,b]$`, back: String.raw`1) Candidati: stazionari interni, punti di non derivabilità, $a$ e $b$. 2) Calcola $f$ nei candidati. 3) Il valore più grande è il massimo, il più piccolo il minimo.` },
        { id: 's09.estremi.fc10', kind: 'metodo', front: String.raw`sup e inf su un dominio non compatto`, back: String.raw`Confronta gli estremi relativi con i **limiti agli estremi del dominio** (anche $\pm\infty$ e punti esclusi). Il sup è un massimo solo se è assunto.` },
        { id: 's09.estremi.fc11', kind: 'errore', front: String.raw`"Stazionario quindi estremo"`, back: String.raw`Falso: $f'(x_0)=0$ è solo un candidato. Serve il **segno** di $f'$ a sinistra e a destra (es. $x^3$, $x^4-4x^3$ in $0$).` },
        { id: 's09.estremi.fc12', kind: 'errore', front: String.raw`Confondere estremo relativo e assoluto`, back: String.raw`Un max relativo è assoluto solo se nessun altro valore (né alcun **limite** agli estremi del dominio) lo supera. "Unico massimo relativo" non basta se $f\to+\infty$ da qualche parte.` },
        { id: 's09.estremi.fc13', kind: 'errore', front: String.raw`Candidati dimenticati`, back: String.raw`Gli estremi dell'intervallo e i punti di non derivabilità (modulo, raccordi, radici) sono candidati anche se $f'$ non si annulla. E i punti stazionari **fuori dal dominio** vanno scartati.` },
        { id: 's09.estremi.fc14', kind: 'def', front: String.raw`Funzione limitata`, back: String.raw`$f$ è limitata se esiste $M$ con $|f(x)|\le M$ per ogni $x$ del dominio, cioè $\inf f$ e $\sup f$ sono finiti.` },
      ],
    },
    // =====================================================================
    {
      id: 's09.studio',
      title: 'Studio completo del grafico',
      summary: String.raw`Saprai studiare una funzione in ordine fisso: dominio, asintoti, derivata prima (monotonia ed estremi), derivata seconda (concavità e flessi) e grafico finale. Anche con modulo, funzioni a tratti ed esponenziali.`,
      prereq: ['s09.estremi', 's05.asintoti', 's08.punti', 's08.convessita', 's03.simmetrie'],
      examRefs: ['Itinere 11/11/2025 · Parte B', 'Appello 15/01/2026 · Parte B', 'Appello 10/02/2026 · Parte B'],
      lessons: [
        // ---------------------------------------------------------------
        {
          id: 's09.studio.L1',
          title: 'Dominio, segno e asintoti',
          cards: [
            {
              type: 'learn',
              title: "L'idea di asintoto",
              body: String.raw`Un **asintoto** è una retta a cui il grafico si avvicina sempre di più, senza mai (o quasi mai) toccarla.

Il grafico di $f(x)=\dfrac1x$ si stringe verso l'asse $y$ quando $x$ si avvicina a $0$, e verso l'asse $x$ quando $x$ va a $\pm\infty$. Quelle due rette sono i suoi asintoti.

Per trovarli non si disegna: si **calcolano limiti**. Per questo lo studio di una funzione inizia sempre dal dominio.`,
              plot: { fns: ['1/x'], x: [-4, 4], y: [-4, 4], vlines: [0], hlines: [0] },
            },
            {
              type: 'learn',
              title: 'La lista di controllo',
              body: String.raw`Studiare una funzione significa raccogliere, **uno alla volta**, le informazioni che servono per disegnarne il grafico. All'esame il grafico non si indovina: si costruisce con una lista fissa.

1. **Dominio** e simmetrie (pari, dispari, periodica)
2. **Segno** di $f$ e intersezioni con gli assi
3. **Limiti** agli estremi del dominio e **asintoti**
4. **Derivata prima**: monotonia, punti stazionari, punti angolosi, estremi
5. **Derivata seconda**: concavità, convessità, flessi
6. **Grafico**: si riportano insieme tutte le informazioni

Ogni passo prepara il successivo. Se salti il dominio, cerchi asintoti in punti che non appartengono alla funzione.`,
            },
            {
              type: 'example',
              title: 'Esempio svolto: dominio e asintoti',
              problem: String.raw`Studia dominio e asintoti di $f(x)=\dfrac{x^2}{x-1}$.`,
              steps: [
                String.raw`**Dominio.** Il denominatore non deve annullarsi: $x\neq1$. Quindi $D=\R\setminus\{1\}$.`,
                String.raw`**Asintoto verticale.** Il punto escluso $x=1$ va controllato con i limiti. Il numeratore tende a $1>0$ e il denominatore tende a $0$ da destra o da sinistra: $\lim_{x\to1^+}f(x)=+\infty$ e $\lim_{x\to1^-}f(x)=-\infty$. Quindi $x=1$ è asintoto verticale.`,
                String.raw`**Asintoto obliquo.** Il grado del numeratore è $2$, quello del denominatore $1$: ci aspettiamo un asintoto obliquo $y=mx+q$. Per prima cosa calcolo $m=\lim_{x\to\pm\infty}\dfrac{f(x)}{x}=\lim_{x\to\pm\infty}\dfrac{x}{x-1}$.`,
                String.raw`Ora $q=\lim_{x\to\pm\infty}\big(f(x)-x\big)=\lim_{x\to\pm\infty}\dfrac{x}{x-1}=1$. Quindi l'asintoto obliquo è $y=x+1$.`,
              ],
              result: String.raw`Asintoto verticale $x=1$; asintoto obliquo $y=x+1$ per $x\to\pm\infty$.`,
            },
            {
              type: 'example',
              title: 'Esempio a completamento',
              problem: String.raw`Studia gli asintoti di $f(x)=\dfrac{x^2+1}{x}$.`,
              steps: [
                String.raw`**Dominio:** $x\neq0$. Riscrivo la funzione come $f(x)=x+\dfrac1x$: così i limiti si leggono subito.`,
                {
                  text: String.raw`**Asintoto verticale.** Il punto escluso è $x=0$. Il termine $\frac1x$ domina vicino a $0$. Prova a decidere il segno del limite da sinistra.`,
                  ask: {
                    type: 'mcq',
                    prompt: String.raw`Quanto vale $\lim_{x\to0^-}f(x)$?`,
                    options: [String.raw`$+\infty$`, String.raw`$-\infty$`, String.raw`$0$`, String.raw`$1$`],
                    answer: 1,
                    explain: String.raw`Da sinistra $\frac1x\to-\infty$ e $x\to0$, quindi $f\to-\infty$. Il limite da destra è $+\infty$: basta un solo lato per avere un asintoto verticale.`,
                  },
                },
                String.raw`**Asintoto obliquo.** $m=\lim_{x\to\pm\infty}\dfrac{f(x)}{x}=\lim_{x\to\pm\infty}\Big(1+\dfrac1{x^2}\Big)=1$.`,
                {
                  text: String.raw`Ora $q=\lim_{x\to\pm\infty}\big(f(x)-x\big)=\lim_{x\to\pm\infty}\dfrac1x$. Quanto vale?`,
                  ask: {
                    type: 'num',
                    prompt: String.raw`Quanto vale $\lim_{x\to\pm\infty}\dfrac1x$?`,
                    answer: '0',
                    explain: String.raw`Il reciproco di un numero che diverge tende a $0$: $q=0$. L'asintoto obliquo è $y=x$.`,
                  },
                },
              ],
              result: String.raw`Asintoto verticale $x=0$; asintoto obliquo $y=x$ per $x\to\pm\infty$.`,
            },
            {
              type: 'learn',
              title: 'Tre tipi di asintoto',
              body: String.raw`>* **Verticale** $x=c$: $\lim_{x\to c^{\pm}}f(x)=\pm\infty$ (basta un lato). I candidati sono i punti esclusi dal dominio e gli estremi finiti del dominio.

>* **Orizzontale** $y=\ell$: $\lim_{x\to\pm\infty}f(x)=\ell$ con $\ell\in\R$.

>* **Obliquo** $y=mx+q$: prima $m=\lim_{x\to\pm\infty}\frac{f(x)}{x}$ finito e non nullo, poi $q=\lim_{x\to\pm\infty}\big(f(x)-mx\big)$ finito.

Se $m=0$ e $q$ è finito, l'asintoto è **orizzontale**, non obliquo.`,
              plot: { fns: ['x^2/(x-1)', 'x+1'], x: [-3, 4], y: [-6, 6], vlines: [1] },
            },
            {
              id: 's09.studio.L1.e1', type: 'interval', level: 1,
              prompt: String.raw`Dominio di $f(x)=\dfrac{\sqrt{x^2-3x}}{x-4}$.`,
              answer: '(-inf,0]U[3,4)U(4,inf)',
              explain: String.raw`Serve $x^2-3x\ge0$, cioè $x(x-3)\ge0$: quindi $x\le0$ oppure $x\ge3$. Serve anche $x\neq4$. Dunque $D=(-\infty,0]\cup[3,4)\cup(4,+\infty)$.`,
            },
            {
              id: 's09.studio.L1.e2', type: 'mcq', level: 1,
              prompt: String.raw`Per $f(x)=\dfrac{1}{(x-2)^2}$, quanto vale $\lim_{x\to2}f(x)$?`,
              options: [String.raw`$+\infty$`, String.raw`$-\infty$`, String.raw`$0$`, String.raw`$2$`],
              answer: 0,
              explain: String.raw`Il denominatore $(x-2)^2$ è sempre positivo, quindi il limite è $+\infty$ da entrambi i lati. Il segno $-\infty$ è l'errore tipico di chi pensa che il segno dipenda sempre da $x-2$: qui il quadrato lo rende positivo.`,
            },
            {
              id: 's09.studio.L1.e3', type: 'set', level: 1,
              prompt: String.raw`Asintoti verticali di $f(x)=\dfrac{x+2}{(x-2)(x+1)}$: quali ascisse?`,
              answer: ['-1', '2'],
              explain: String.raw`Il denominatore si annulla in $x=2$ e $x=-1$. Il numeratore vale $4$ in $2$ e $1$ in $-1$, quindi non si semplifica: entrambi sono asintoti verticali. In $x=-2$ il numeratore si annulla, ma lì il denominatore no: è uno zero di $f$, non un asintoto.`,
            },
            {
              id: 's09.studio.L1.e4', type: 'tf', level: 1,
              prompt: String.raw`Se in una funzione razionale il grado del numeratore supera di $1$ quello del denominatore, la funzione ha un asintoto obliquo.`,
              answer: true,
              explain: String.raw`Vero. La divisione polinomiale dà $f(x)=mx+q+\dfrac{R(x)}{D(x)}$, e il resto $\dfrac{R}{D}$ tende a $0$ all'infinito. Esempio: $\dfrac{x^2}{x-1}=x+1+\dfrac{1}{x-1}$.`,
            },
            {
              id: 's09.studio.L1.e5', type: 'num', level: 2,
              prompt: String.raw`Per $f(x)=\dfrac{x^2+3x+5}{x+1}$ l'asintoto obliquo è $y=x+q$. Quanto vale $q$?`,
              answer: '2',
              explain: String.raw`Divido: $x^2+3x+5=(x+1)(x+2)+3$, quindi $f(x)=x+2+\dfrac{3}{x+1}$. Il termine $\frac3{x+1}$ tende a $0$: $q=2$.`,
            },
            {
              id: 's09.studio.L1.e6', type: 'tuple', level: 2,
              prompt: String.raw`Asintoto obliquo $y=mx+q$ di $f(x)=\dfrac{2x^2-x+1}{x-1}$: quali $m$ e $q$?`,
              labels: ['m', 'q'],
              answer: ['2', '1'],
              explain: String.raw`Divisione: $2x^2-x+1=(x-1)(2x+1)+2$. Quindi $f(x)=2x+1+\dfrac{2}{x-1}$: $m=2$ e $q=1$.`,
            },
            {
              id: 's09.studio.L1.e7', type: 'order', level: 2,
              prompt: String.raw`Metti in ordine i passi per trovare l'asintoto obliquo $y=mx+q$ per $x\to+\infty$.`,
              steps: [
                String.raw`Calcolo $m=\lim_{x\to+\infty}\dfrac{f(x)}{x}$. Se è finito e non nullo, continuo.`,
                String.raw`Calcolo $q=\lim_{x\to+\infty}\big(f(x)-mx\big)$. Se è finito, l'asintoto esiste.`,
                String.raw`Scrivo la retta $y=mx+q$ e verifico che sia l'asintoto per $x\to+\infty$.`,
              ],
              distractors: [
                String.raw`Calcolo $q=\lim_{x\to+\infty}\dfrac{f(x)}{x}$: questo è il valore di $m$, non di $q$.`,
                String.raw`Calcolo $m=\lim_{x\to+\infty}f(x)$: se è finito, l'asintoto obliquo è $y=m$.`,
              ],
              explain: String.raw`Prima la pendenza $m$ (dal rapporto $f(x)/x$), poi il termine noto $q$ (dalla differenza $f(x)-mx$). Il limite $\lim f(x)$, se finito, dà un asintoto **orizzontale**, non obliquo.`,
            },
            {
              id: 's09.studio.L1.e8', type: 'mcq', level: 2,
              prompt: String.raw`Per $f(x)=\dfrac{x^2}{x-1}$, quale asintoto obliquo ha il grafico per $x\to\pm\infty$?`,
              options: [String.raw`$y=x+1$`, String.raw`$y=x$`, String.raw`$y=x-1$`, String.raw`$y=1$`],
              answer: 0,
              explain: String.raw`$f(x)=x+1+\dfrac{1}{x-1}$, quindi $q=1$. $y=x$ dimentica il termine $\dfrac{x}{x-1}\to1$ nel calcolo di $q$. $y=x-1$ cambia il segno di $q$. $y=1$ è una retta orizzontale: confonde $q$ con la pendenza $m$, che qui vale $1$ e non $0$.`,
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          id: 's09.studio.L2',
          title: 'Derivata prima: monotonia, estremi, punti angolosi',
          cards: [
            {
              type: 'learn',
              title: 'Come legge il grafico la derivata prima',
              body: String.raw`La derivata è la **pendenza** della tangente. Dove $f'>0$ il grafico sale, dove $f'<0$ scende.

>* **Monotonia.** Su un intervallo $I$: $f'>0$ ⇒ $f$ strettamente crescente; $f'<0$ ⇒ strettamente decrescente.

>* **Candidati ad estremo:** i punti in cui $f'=0$ (stazionari), i punti in cui $f$ non è derivabile (angolosi, cuspidi) e gli estremi del dominio.

Un estremo sta dove la pendenza **cambia segno**. Un punto stazionario senza cambio di segno non è un estremo.`,
              plot: { fns: ['x^2*e^(-x)'], x: [-1.5, 4.5], y: [-0.2, 1.2], points: [[0, 0, 'min'], [2, 0.54, 'max']] },
            },
            {
              type: 'example',
              title: 'Esempio svolto: monotonia ed estremi',
              problem: String.raw`Studia la monotonia e gli estremi relativi di $f(x)=x^2e^{-x}$.`,
              steps: [
                String.raw`**Derivata.** Prodotto di $x^2$ ed $e^{-x}$: $f'(x)=2xe^{-x}-x^2e^{-x}=(2x-x^2)e^{-x}$.`,
                String.raw`**Fattorizzo.** $f'(x)=x(2-x)\,e^{-x}$. Il fattore $e^{-x}$ è sempre positivo: il segno di $f'$ è quello di $x(2-x)$.`,
                {
                  text: String.raw`**Segno.** Ora decido dove $f'>0$, cioè dove $x(2-x)>0$.`,
                  ask: {
                    type: 'interval',
                    prompt: String.raw`Per quali $x$ è $f'(x)>0$?`,
                    answer: '(0,2)',
                    explain: String.raw`$x(2-x)>0$ quando $x$ sta tra le radici $0$ e $2$. Fuori dalle radici il prodotto è negativo.`,
                  },
                },
                String.raw`**Tabella.** $f'$ passa da $-$ a $+$ in $x=0$: minimo relativo, $f(0)=0$. Passa da $+$ a $-$ in $x=2$: massimo relativo, $f(2)=4e^{-2}$.`,
              ],
              result: String.raw`$f$ decresce su $(-\infty,0)$, cresce su $(0,2)$, decresce su $(2,+\infty)$.`,
            },
            {
              id: 's09.studio.L2.e1', type: 'mcq', level: 1,
              prompt: String.raw`Per $f(x)=x^2e^{-x}$, il punto $x=2$ è…`,
              options: [
                String.raw`un massimo relativo, ma non assoluto`,
                String.raw`un massimo assoluto`,
                String.raw`un minimo relativo`,
                String.raw`un punto in cui $f'$ non esiste`,
              ],
              answer: 0,
              explain: String.raw`$f'$ passa da $+$ a $-$ in $2$: è un massimo relativo. Non è assoluto: per $x\to-\infty$ la funzione tende a $+\infty$ (per esempio $f(-1)=e\approx2.7>4e^{-2}\approx0.54$). Qui $f'$ esiste ovunque.`,
            },
            {
              id: 's09.studio.L2.e2', type: 'set', level: 2,
              prompt: String.raw`Punti stazionari di $f(x)=x^2e^{-x}$ (dove $f'=0$): quali ascisse?`,
              answer: ['0', '2'],
              explain: String.raw`$f'(x)=x(2-x)e^{-x}$ si annulla per $x=0$ e $x=2$, perché $e^{-x}$ non è mai zero.`,
            },
            {
              id: 's09.studio.L2.e3', type: 'num', level: 2,
              prompt: String.raw`Valore del massimo relativo di $f(x)=x^2e^{-x}$, cioè $f(2)$.`,
              answer: '4*e^(-2)',
              explain: String.raw`$f(2)=2^2e^{-2}=4e^{-2}\approx0.54$.`,
            },
            {
              type: 'learn',
              title: 'Punti angolosi: il caso che sfugge',
              body: String.raw`Un punto **angoloso** è un punto in cui il grafico fa uno spigolo: le derivate laterali esistono ma sono diverse. In quel punto $f'$ non esiste, quindi **non compare** tra i punti stazionari. Va però controllato tra i candidati.

Esempio: $f(x)=|x^2-1|$. Per $|x|<1$ si ha $f=1-x^2$; per $|x|>1$ si ha $f=x^2-1$.

- In $x=\pm1$ c'è una **valle a punta**: minimo relativo, con $f=0$.
- In $x=0$ c'è una **cima liscia**: $f'=-2x$ passa da $+$ a $-$, massimo relativo con $f(0)=1$.`,
              plot: { fns: ['abs(x^2-1)'], x: [-2, 2], y: [-0.5, 3], points: [[-1, 0, 'min'], [0, 1, 'max'], [1, 0, 'min']] },
            },
            {
              id: 's09.studio.L2.e4', type: 'num', level: 2,
              prompt: String.raw`Derivata sinistra di $f(x)=|x^2-1|$ in $x=1$.`,
              answer: '-2',
              explain: String.raw`Per $x$ vicino a $1$ da sinistra, $x^2<1$, quindi $|x^2-1|=1-x^2$. La derivata è $-2x$, che in $x=1$ vale $-2$.`,
            },
            {
              id: 's09.studio.L2.e5', type: 'mcq', level: 2,
              prompt: String.raw`Per $f(x)=|x^2-1|$, il punto $x=0$ è…`,
              options: [
                String.raw`un massimo relativo`,
                String.raw`un minimo relativo`,
                String.raw`un punto angoloso di minimo`,
                String.raw`né massimo né minimo`,
              ],
              answer: 0,
              explain: String.raw`Vicino a $0$ si ha $f=1-x^2\le1$: è un massimo relativo. È liscio, perché $f$ è derivabile in $0$: non è un punto angoloso. Il punto $x=0$ non è un minimo: $f(0)=1$ è più alto dei valori vicini.`,
            },
            {
              id: 's09.studio.L2.e6', type: 'tf', level: 2,
              prompt: String.raw`Se $f'(x_0)=0$, allora $x_0$ è un punto di massimo o di minimo relativo.`,
              answer: false,
              explain: String.raw`Falso. Per $f(x)=x^3$ si ha $f'(0)=0$, ma $f'=3x^2\ge0$ non cambia segno: $0$ non è un estremo. Serve il cambio di segno di $f'$.`,
            },
            {
              id: 's09.studio.L2.e7', type: 'order', level: 2,
              prompt: String.raw`Metti in ordine il procedimento per trovare gli estremi relativi di $f$.`,
              steps: [
                String.raw`Calcolo $f'$ e trovo i punti in cui $f'=0$ oppure $f'$ non esiste.`,
                String.raw`Studio il segno di $f'$ su ciascun intervallo tra i candidati.`,
                String.raw`Classifico ogni candidato: da $+$ a $-$ massimo; da $-$ a $+$ minimo; senza cambio di segno nessun estremo.`,
                String.raw`Se mi servono gli estremi assoluti, confronto i valori di $f$ nei candidati e i limiti agli estremi del dominio.`,
              ],
              distractors: [
                String.raw`Concludo che ogni punto con $f'=0$ è un massimo o un minimo, senza guardare il segno.`,
                String.raw`Calcolo $f''$ e concludo che è un flesso dove $f''=0$.`,
              ],
              explain: String.raw`L'ordine è: candidati, segno, classificazione, confronto globale. L'errore più frequente è saltare il segno di $f'$.`,
            },
            {
              id: 's09.studio.L2.e8', type: 'cloze', level: 2,
              prompt: String.raw`Completa il ragionamento sul segno di $f'$.`,
              text: String.raw`Se $f'>0$ a sinistra di $x_0$ e $f'<0$ a destra, allora $x_0$ è un punto di [[0]] relativo. Su un intervallo a sinistra di $x_0$ la funzione è [[1]].`,
              blanks: [
                { options: [String.raw`massimo`, String.raw`minimo`, String.raw`flesso`], answer: 0 },
                { options: [String.raw`crescente`, String.raw`decrescente`, String.raw`costante`], answer: 0 },
              ],
              explain: String.raw`Il segno di $f'$ passa da $+$ a $-$: la funzione sale e poi scende, quindi c'è una cima. A sinistra di $x_0$ la funzione sale, cioè è crescente.`,
            },
            {
              id: 's09.studio.L2.e9', type: 'num', level: 2,
              prompt: String.raw`Per $f(x)=|x^2-1|$, calcola la derivata destra in $x=1$, cioè $f'_+(1)$.`,
              answer: '2',
              explain: String.raw`Per $x>1$ si ha $f=x^2-1$, quindi $f'=2x$. In $x=1$ vale $2$. Con $f'_-(1)=-2\neq2$ il punto è angoloso.`,
            },
            {
              id: 's09.studio.L2.e10', type: 'open', level: 2,
              prompt: String.raw`Spiega in 3–4 frasi perché un punto in cui $f$ non è derivabile può essere un estremo relativo. Usa l'esempio di $f(x)=|x|$.`,
              answer: String.raw`Se $f$ non è derivabile in $x_0$, in $x_0$ non c'è una tangente e quindi $x_0$ non è un punto stazionario. Però può essere comunque un estremo: per $f(x)=|x|$, a sinistra di $0$ la funzione scende e a destra sale. Quindi $0$ è un minimo relativo (e assoluto), anche se $f'(0)$ non esiste. Si decide controllando il **segno** di $f$ a sinistra e a destra del punto.`,
              rubric: [
                'Dice che se $f$ non è derivabile non c\'è una tangente, e il punto non è stazionario',
                'Spiega che l\'estremo si decide con il cambio di monotonia (segno a sinistra e a destra), non con $f\'=0$',
                'Esempio corretto: $|x|$ ha minimo in $0$, con derivate laterali $-1$ e $+1$',
              ],
              points: 2,
              explain: String.raw`Un punto angoloso non è stazionario, ma può essere un estremo. Va controllato con la monotonia, come un qualunque candidato.`,
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          id: 's09.studio.L3',
          title: 'Concavità, flessi ed esame',
          cards: [
            {
              type: 'learn',
              title: 'Concavità e flessi',
              body: String.raw`La **concavità** dice come il grafico "curva".

>* $f$ è **convessa** su $I$ se il grafico sta **sopra** ogni sua tangente (forma di coppa ∪).
>* $f$ è **concava** su $I$ se il grafico sta **sotto** ogni sua tangente (forma di cupola ∩).

>* **Criterio.** Se $f''>0$ su $I$, $f$ è convessa; se $f''<0$ su $I$, $f$ è concava.

Un **flesso** è un punto in cui il grafico **cambia concavità**. Per $f(x)=x^3-3x$ si ha $f''=6x$, che cambia segno in $0$: flesso in $x=0$.`,
              plot: { fns: ['x^3-3x'], x: [-2.6, 2.6], y: [-4, 4], points: [[0, 0, 'flesso']] },
            },
            {
              type: 'learn',
              title: 'Flessi con tangente obliqua o orizzontale',
              body: String.raw`Un flesso può avere tangente **obliqua** (per $x^3-3x$ in $0$ la pendenza è $f'(0)=-3$) oppure **orizzontale** (per $f(x)=x^3$ in $0$ si ha $f'(0)=0$).

Nel secondo caso il punto è un flesso ma **non** è un estremo: $f'=3x^2$ resta positiva da entrambi i lati e non cambia segno. Non confondere $f'$ con $f''$: la $f'$ dice dove si sale o si scende, la $f''$ dove si curva in su o in giù.`,
            },
            {
              type: 'example',
              title: 'Esempio svolto: concavità e flessi',
              problem: String.raw`Studia concavità e flessi di $f(x)=x^2e^{-x}$.`,
              steps: [
                String.raw`**Derivata seconda.** Parto da $f'(x)=(2x-x^2)e^{-x}$ e derivo ancora: $f''(x)=(2-2x)e^{-x}-(2x-x^2)e^{-x}=(x^2-4x+2)\,e^{-x}$.`,
                {
                  text: String.raw`**Zeri di $f''$.** Il fattore $e^{-x}$ non si annulla mai: restano le radici di $x^2-4x+2$.`,
                  ask: {
                    type: 'set',
                    prompt: String.raw`Risolvi $x^2-4x+2=0$ (valori esatti, separati da ;).`,
                    answer: ['2-sqrt(2)', '2+sqrt(2)'],
                    explain: String.raw`$\dfrac{\Delta}{4}=4-2=2$, quindi $x=2\pm\sqrt2$.`,
                  },
                },
                String.raw`**Segno.** La parabola $x^2-4x+2$ ha concavità verso l'alto: è positiva fuori dalle radici e negativa tra $2-\sqrt2\approx0.59$ e $2+\sqrt2\approx3.41$.`,
                String.raw`**Concavità.** $f$ è convessa su $(-\infty,2-\sqrt2)$ e su $(2+\sqrt2,+\infty)$, concava su $(2-\sqrt2,2+\sqrt2)$.`,
                String.raw`**Flessi.** $f''$ cambia segno in $x=2\pm\sqrt2$: sono due flessi, con ordinate $f(2-\sqrt2)=(6-4\sqrt2)\,e^{\sqrt2-2}$ e $f(2+\sqrt2)=(6+4\sqrt2)\,e^{-2-\sqrt2}$.`,
              ],
              result: String.raw`Convessa su $(-\infty,2-\sqrt2)\cup(2+\sqrt2,+\infty)$, concava su $(2-\sqrt2,2+\sqrt2)$; flessi in $x=2\pm\sqrt2$.`,
            },
            {
              type: 'example',
              title: 'Esempio a completamento: $f$ con asintoto',
              problem: String.raw`Studia la concavità di $f(x)=\dfrac{x^2}{x-1}$ (la stessa funzione della prima lezione).`,
              steps: [
                String.raw`Riscrivo la derivata prima: $f'(x)=\dfrac{x^2-2x}{(x-1)^2}=1-\dfrac{1}{(x-1)^2}$.`,
                {
                  text: String.raw`Derivo di nuovo: $f''(x)=\dfrac{d}{dx}\big(-(x-1)^{-2}\big)=2(x-1)^{-3}$. Scrivila come frazione.`,
                  ask: {
                    type: 'expr',
                    prompt: String.raw`Quanto vale $f''(x)$ per $x\neq1$?`,
                    answer: '2/(x-1)^3',
                    vars: ['x'],
                    domain: [1.5, 3],
                    explain: String.raw`$2(x-1)^{-3}=\dfrac{2}{(x-1)^3}$.`,
                  },
                },
                String.raw`**Segno.** Il numeratore $2$ è positivo; il denominatore ha il segno di $x-1$. Quindi $f''<0$ per $x<1$ e $f''>0$ per $x>1$.`,
                String.raw`**Conclusione.** $f$ è concava su $(-\infty,1)$ e convessa su $(1,+\infty)$. Il cambio di concavità avviene in $x=1$, che non appartiene al dominio: **nessun flesso**.`,
              ],
              result: String.raw`Concava su $(-\infty,1)$, convessa su $(1,+\infty)$, nessun flesso.`,
            },
            {
              id: 's09.studio.L3.e1', type: 'mcq', level: 1,
              prompt: String.raw`Per $f(x)=x^3-3x$, su quale intervallo la funzione è concava?`,
              options: [String.raw`$(-\infty,0)$`, String.raw`$(0,+\infty)$`, String.raw`$\R$`, String.raw`in nessun intervallo`],
              answer: 0,
              explain: String.raw`$f''=6x$ è negativa per $x<0$: concava su $(-\infty,0)$. Per $x>0$ la funzione è convessa.`,
            },
            {
              id: 's09.studio.L3.e2', type: 'set', level: 2,
              prompt: String.raw`Ascisse dei flessi di $f(x)=x^4-6x^2$.`,
              answer: ['-1', '1'],
              explain: String.raw`$f''=12x^2-12=12(x-1)(x+1)$ cambia segno in $\pm1$: entrambi sono flessi. In $0$ la $f''$ è negativa e non cambia segno: lì nessun flesso.`,
            },
            {
              id: 's09.studio.L3.e3', type: 'tf', level: 2,
              prompt: String.raw`Se $f''(x_0)=0$, allora $x_0$ è un punto di flesso.`,
              answer: false,
              explain: String.raw`Falso. Per $f(x)=x^4$ si ha $f''(0)=0$, ma $f''=12x^2\ge0$ non cambia segno: $f$ è convessa ovunque e $0$ è un minimo, non un flesso.`,
            },
            {
              id: 's09.studio.L3.e4', type: 'num', level: 2,
              prompt: String.raw`Pendenza della tangente nel flesso $x=0$ di $f(x)=x^3-3x$, cioè $f'(0)$.`,
              answer: '-3',
              explain: String.raw`$f'(x)=3x^2-3$, quindi $f'(0)=-3$: la tangente è obliqua, non orizzontale.`,
            },
            {
              id: 's09.studio.L3.e5', type: 'mcq', level: 2,
              prompt: String.raw`Per $f(x)=x^3$, il punto $x=0$ è…`,
              options: [
                String.raw`un flesso a tangente orizzontale`,
                String.raw`un massimo relativo`,
                String.raw`un flesso a tangente obliqua`,
                String.raw`né flesso né estremo`,
              ],
              answer: 0,
              explain: String.raw`$f'(0)=0$ (tangente orizzontale) e $f''=6x$ cambia segno in $0$: è un flesso. Non è un massimo né un minimo, perché $f'=3x^2$ non cambia segno.`,
            },
            {
              id: 's09.studio.L3.e6', type: 'problem', level: 3, points: 8,
              source: 'Appello 15/01/2026 · Parte B',
              prompt: String.raw`Sia
$$f(x)=\begin{cases} x\log x & \text{se } 0<x<1\\ \dfrac{x-1}{2x-3} & \text{se } x\ge1\end{cases}$$
Studiare $f$: dominio, limiti e asintoti, derivabilità in $x=1$, estremi relativi, e l'area della regione tra il grafico di $f$ e l'asse $x$ per $0\le x\le1$.`,
              plot: { fns: [{ f: 'x<1 ? x*log(x) : (x-1)/(2*x-3)', label: 'f' }], x: [0.02, 3.2], y: [-2, 2.5], vlines: [1.5], points: [[1, 0, 'max'], [0.3679, -0.3679, 'min']] },
              parts: [
                { type: 'interval', prompt: 'Dominio di $f$', answer: '(0,3/2)U(3/2,inf)', explain: String.raw`Il primo ramo è definito per $0<x<1$, il secondo per $x\ge1$ con $x\neq\frac32$ (il denominatore). Unendo: $(0,\frac32)\cup(\frac32,+\infty)$.` },
                { type: 'num', prompt: String.raw`$\lim_{x\to0^+}f(x)$`, answer: '0', explain: String.raw`$\lim_{x\to0^+}x\log x=0$: il logaritmo è infinitesimo di ordine inferiore a $\frac1x$.` },
                { type: 'set', prompt: 'Asintoti verticali (ascisse)', answer: ['3/2'], explain: String.raw`Il denominatore $2x-3$ si annulla in $\frac32$, mentre il numeratore vale $\frac12$. Da sinistra $f\to-\infty$, da destra $f\to+\infty$: $x=\frac32$ è asintoto verticale.` },
                { type: 'num', prompt: String.raw`Asintoto orizzontale per $x\to+\infty$: $y=$?`, answer: '1/2', explain: String.raw`$\lim_{x\to+\infty}\dfrac{x-1}{2x-3}=\dfrac12$: il grafico tende alla retta $y=\frac12$.` },
                { type: 'num', prompt: String.raw`Derivata sinistra in $x=1$: $f'_-(1)$`, answer: '1', explain: String.raw`Per $0<x<1$: $f'(x)=\log x+1$, quindi $f'_-(1)=0+1=1$.` },
                { type: 'num', prompt: String.raw`Derivata destra in $x=1$: $f'_+(1)$`, answer: '-1', explain: String.raw`Per $x>1$: $f'(x)=\dfrac{2x-3-2(x-1)}{(2x-3)^2}=-\dfrac{1}{(2x-3)^2}$, quindi $f'_+(1)=-1$. Poiché $f'_-(1)\neq f'_+(1)$, $x=1$ è punto angoloso.` },
                { type: 'num', prompt: 'Ascissa del minimo relativo', answer: '1/e', explain: String.raw`Su $(0,1)$ la derivata $\log x+1$ è negativa per $x<\frac1e$ e positiva per $x>\frac1e$: minimo relativo in $x=\frac1e$, con $f(\frac1e)=-\frac1e$.` },
                { type: 'num', prompt: String.raw`Area della regione tra il grafico di $f$ e l'asse $x$ per $0\le x\le1$`, answer: '1/4', explain: String.raw`Su $(0,1)$ si ha $f\le0$, quindi l'area è $-\int_0^1 x\log x\,dx$. Per parti: $\int_0^1 x\log x\,dx=\big[\tfrac{x^2}{2}\log x-\tfrac{x^2}{4}\big]_0^1=-\tfrac14$. Area $=\tfrac14$.` },
              ],
              solution: String.raw`**Dominio.** $D=(0,\frac32)\cup(\frac32,+\infty)$.

**Limiti e asintoti.** $\lim_{x\to0^+}f=0$. In $\frac32$ il limite è $-\infty$ da sinistra e $+\infty$ da destra: asintoto verticale $x=\frac32$. Per $x\to+\infty$, $f\to\frac12$: asintoto orizzontale $y=\frac12$.

**Derivate.** Per $0<x<1$: $f'=\log x+1$. Per $x>1$: $f'=-\dfrac{1}{(2x-3)^2}$. Quindi $f'_-(1)=1\neq-1=f'_+(1)$: punto angoloso in $x=1$.

**Monotonia.** Su $(0,1)$: $f'<0$ per $x<\frac1e$ e $f'>0$ per $x>\frac1e$, quindi decresce su $(0,\frac1e)$ e cresce su $(\frac1e,1)$. Su $(1,\frac32)$ e su $(\frac32,+\infty)$ la derivata è negativa: decresce.

**Estremi.** In $x=\frac1e$ minimo relativo, $f=-\frac1e$. In $x=1$ si ha $f(1)=0$ e $f<0$ a sinistra e a destra: massimo relativo $0$. Non ci sono estremi assoluti: $f\to+\infty$ per $x\to\frac32^+$ e $f\to-\infty$ per $x\to\frac32^-$.

**Area.** Su $[0,1]$ si ha $f\le0$: area $=-\int_0^1x\log x\,dx=\dfrac14$.

`,
            },
            {
              id: 's09.studio.L3.e7', type: 'problem', level: 3, points: 6,
              source: 'Appello 10/02/2026 · Parte B',
              prompt: String.raw`Sia $f(x)=(x^2-3)\,e^{-|2-x|}$. Studiare $f$: limiti agli estremi del dominio, punti non derivabili, punti stazionari, massimo e minimo assoluti.`,
              plot: { fns: ['(x^2-3)*e^(-abs(2-x))'], x: [-3, 4.5], y: [-1, 2.5], points: [[1, -0.74, 'min'], [3, 2.21, 'max'], [2, 1]] },
              parts: [
                { type: 'num', prompt: String.raw`$\lim_{x\to-\infty}f(x)$`, answer: '0', explain: String.raw`Per $x<2$ si ha $f=(x^2-3)e^{x-2}$: l'esponenziale che tende a $0$ domina il polinomio, quindi il limite è $0$.` },
                { type: 'num', prompt: String.raw`Derivata sinistra in $x=2$: $f'_-(2)$`, answer: '5', explain: String.raw`Per $x<2$: $f'=(x^2+2x-3)e^{x-2}=(x+3)(x-1)e^{x-2}$. In $x=2$: $5\cdot1\cdot e^0=5$.` },
                { type: 'num', prompt: String.raw`Derivata destra in $x=2$: $f'_+(2)$`, answer: '3', explain: String.raw`Per $x>2$: $f=(x^2-3)e^{2-x}$, quindi $f'=-(x-3)(x+1)e^{2-x}$. In $x=2$: $-(-1)\cdot3\cdot1=3$. Poiché $5\neq3$, $x=2$ è punto angoloso.` },
                { type: 'set', prompt: String.raw`Punti stazionari ($f'=0$, con $x\neq2$)`, answer: ['-3', '1', '3'], explain: String.raw`Per $x<2$: $(x+3)(x-1)=0$ per $x=-3$ e $x=1$. Per $x>2$: $(x-3)(x+1)=0$ per $x=3$ (la radice $-1$ non è in questo ramo).` },
                { type: 'num', prompt: 'Massimo assoluto di $f$', answer: '6/e', explain: String.raw`Il massimo è $f(3)=(9-3)e^{-1}=\frac6e\approx2.21$. Gli altri massimi relativi valgono $f(-3)=6e^{-5}$ e sono molto più piccoli; agli estremi del dominio $f\to0$.` },
                { type: 'num', prompt: 'Minimo assoluto di $f$', answer: '-2/e', explain: String.raw`Il minimo relativo in $x=1$ vale $f(1)=(1-3)e^{-1}=-\frac2e\approx-0.74$. È il valore più basso: agli infiniti $f\to0$ e $f$ è negativa solo tra $-\sqrt3$ e $\sqrt3$.` },
              ],
              solution: String.raw`**Limiti.** Per $x\to\pm\infty$ l'esponenziale tende a $0$ più in fretta del polinomio: $f\to0$ da entrambi i lati.

**Derivate.** Per $x<2$: $f'=(x+3)(x-1)e^{x-2}$. Per $x>2$: $f'=-(x-3)(x+1)e^{2-x}$. In $x=2$ le derivate laterali sono $5$ e $3$: punto angoloso.

**Segno.** Su $(-\infty,2)$: $f'>0$ per $x<-3$ e per $1<x<2$; $f'<0$ per $-3<x<1$. Su $(2,+\infty)$: $f'>0$ per $2<x<3$, $f'<0$ per $x>3$.

**Estremi.** $x=-3$: massimo relativo $6e^{-5}$. $x=1$: minimo relativo $-\frac2e$. $x=3$: massimo relativo $\frac6e$. $x=2$ non è estremo: $f$ cresce attraverso lo spigolo.

**Assoluti.** Massimo assoluto $\frac6e$ in $x=3$; minimo assoluto $-\frac2e$ in $x=1$.`,
            },
            {
              id: 's09.studio.L3.e8', type: 'open', level: 2,
              prompt: String.raw`Scrivi in ordine i passi per lo studio completo di una funzione, dal dominio al grafico.`,
              answer: String.raw`1) Dominio e simmetrie. 2) Segno e intersezioni con gli assi. 3) Limiti agli estremi del dominio e asintoti (verticali, orizzontali, obliqui). 4) Derivata prima: punti stazionari e punti angolosi, monotonia, estremi. 5) Derivata seconda: concavità, flessi. 6) Grafico con tutte le informazioni insieme, controllando che rispetti ogni risultato.`,
              rubric: [
                'Parte dal dominio e dalle simmetrie',
                'Calcola limiti agli estremi del dominio e individua gli asintoti',
                'Usa la derivata prima per monotonia ed estremi, con i punti angolosi',
                'Usa la derivata seconda per concavità e flessi, poi disegna il grafico',
              ],
              points: 2,
              explain: String.raw`L'ordine non è arbitrario: ogni passo usa i risultati dei precedenti.`,
            },
          ],
        },
      ],
      practice: [
        {
          id: 's09.studio.p1', type: 'interval', level: 1,
          prompt: String.raw`Dominio di $f(x)=\dfrac{\log(x-1)}{x-3}$.`,
          answer: '(1,3)U(3,inf)',
          explain: String.raw`Serve $x-1>0$, cioè $x>1$ (argomento del logaritmo), e $x\neq3$. Dunque $D=(1,3)\cup(3,+\infty)$.`,
        },
        {
          id: 's09.studio.p2', type: 'mcq', level: 2,
          prompt: String.raw`Per $f(x)=\dfrac{e^x}{x+1}$, quale affermazione sugli asintoti orizzontali è vera?`,
          options: [
            String.raw`$y=0$ è asintoto solo per $x\to-\infty$`,
            String.raw`$y=0$ è asintoto solo per $x\to+\infty$`,
            String.raw`$y=0$ è asintoto per entrambi i lati`,
            String.raw`non ci sono asintoti orizzontali`,
          ],
          answer: 0,
          explain: String.raw`Per $x\to-\infty$ l'esponenziale $e^x\to0$ domina e $f\to0$. Per $x\to+\infty$ il numeratore cresce molto più in fretta del denominatore: $f\to+\infty$.`,
        },
        {
          id: 's09.studio.p3', type: 'match', level: 1,
          prompt: 'Abbina ogni funzione al suo asintoto.',
          pairs: [
            [String.raw`$\dfrac{1}{x-2}$`, String.raw`asintoto verticale $x=2$`],
            [String.raw`$\dfrac{2x+1}{x}$`, String.raw`asintoto orizzontale $y=2$`],
            [String.raw`$\dfrac{x^2-1}{x}$`, String.raw`asintoto obliquo $y=x$`],
          ],
          explain: String.raw`$\frac{2x+1}{x}=2+\frac1x$ tende a $2$; $\frac{x^2-1}{x}=x-\frac1x$ tende alla retta $y=x$; $\frac{1}{x-2}$ diverge in $x=2$.`,
        },
        {
          id: 's09.studio.p4', type: 'cloze', level: 1,
          prompt: String.raw`Completa la regola sugli asintoti.`,
          text: String.raw`Se $\lim_{x\to a}f(x)=\pm\infty$, allora la retta [[0]] è un asintoto [[1]] del grafico.`,
          blanks: [
            { options: [String.raw`$x=a$`, String.raw`$y=a$`, String.raw`$x=0$`], answer: 0 },
            { options: [String.raw`verticale`, String.raw`orizzontale`, String.raw`obliquo`], answer: 0 },
          ],
          explain: String.raw`Un limite infinito in un punto $a$ dà un asintoto verticale. Un limite finito a $\pm\infty$ dà un asintoto orizzontale.`,
        },
        {
          id: 's09.studio.p5', type: 'num', level: 1,
          prompt: String.raw`Asintoto orizzontale di $f(x)=\dfrac{3x^2+1}{x^2-4}$ per $x\to+\infty$: $y=$?`,
          answer: '3',
          explain: String.raw`Numeratore e denominatore hanno lo stesso grado: il rapporto tende al rapporto dei coefficienti direttori, $\dfrac{3}{1}=3$.`,
        },
        {
          id: 's09.studio.p6', type: 'set', level: 2,
          prompt: String.raw`Punti stazionari di $f(x)=x^3-12x$: quali ascisse?`,
          answer: ['-2', '2'],
          explain: String.raw`$f'(x)=3x^2-12=0$ per $x^2=4$, cioè $x=\pm2$.`,
        },
        {
          id: 's09.studio.p7', type: 'tf', level: 2,
          prompt: String.raw`Un flesso a tangente orizzontale è un estremo relativo.`,
          answer: false,
          explain: String.raw`Falso. In un flesso $f'$ ha lo stesso segno a sinistra e a destra (per esempio $x^3$ in $0$): non è né massimo né minimo.`,
        },
        {
          id: 's09.studio.p8', type: 'open', level: 2,
          prompt: String.raw`Spiega con un esempio perché $f''(x_0)=0$ non basta per avere un flesso.`,
          answer: String.raw`Per $f(x)=x^4$ si ha $f''(x)=12x^2$, quindi $f''(0)=0$. Però $f''\ge0$ ovunque e non cambia segno in $0$: $f$ è convessa su tutto $\R$ e $0$ non è un flesso ma un minimo. Serve il cambio di segno di $f''$.`,
          rubric: [
            'Esempio corretto: $f(x)=x^4$ in $x=0$',
            'Osserva che $f\'\'=12x^2$ non cambia segno',
            'Conclude che serve il cambio di segno di $f\'\'$, non solo lo zero',
          ],
          points: 2,
          explain: String.raw`$f''(x_0)=0$ è un candidato. Il flesso richiede che la concavità cambi davvero.`,
        },
        {
          id: 's09.studio.gen-asintoto', type: 'gen', level: 2,
          gen: (R) => {
            const a = R.pick([1, 2, 3, -1, -2]);
            const d = R.nz(-3, 3);
            const b = R.int(-4, 4);
            const q = b - a * d;
            let c = R.int(-5, 5);
            if (c === d * q) c += 1; // resto non nullo
            const rem = c - d * q;
            const num = H.poly([a, b, c]);
            const den = H.lin(1, d);
            const lin = H.lin(a, q);
            return {
              type: 'tuple',
              labels: ['m', 'q'],
              prompt: String.raw`Trova $m$ e $q$ dell'asintoto obliquo $y=mx+q$ di $f(x)=\dfrac{${num}}{${den}}$.`,
              answer: [String(a), String(q)],
              explain: String.raw`Divisione polinomiale: $${num}=(${den})(${lin})${rem === 0 ? '' : ` ${rem > 0 ? '+' : '-'} ${Math.abs(rem)}`}$. Quindi $f(x)=${lin}+\dfrac{${rem}}{${den}}$ e il resto tende a $0$: $m=${a}$, $q=${q}$.`,
            };
          },
        },
        {
          id: 's09.studio.gen-razionale', type: 'gen', level: 3,
          gen: (R) => {
            const p = R.int(-3, 3);
            let q = R.int(-3, 3);
            while (q === p) q = R.int(-3, 3);
            const kq = q - 2 * p; // asintoto obliquo y = x + kq
            const x2 = 2 * q - p; // secondo stazionario
            const f2 = 4 * (q - p); // f(x2)
            const minP = p > q; // in p: minimo se p > q
            const numTex = `(${H.lin(1, -p)})^{2}`;
            const denTex = H.lin(1, -q);
            return {
              type: 'problem',
              prompt: String.raw`Sia $f(x)=\dfrac{${numTex}}{${denTex}}$. Trova l'asintoto verticale, l'asintoto obliquo, i punti stazionari, la natura di $x=${p}$ e il valore di $f$ nel secondo stazionario.`,
              parts: [
                { type: 'set', prompt: 'Asintoto verticale (ascissa)', answer: [String(q)], explain: String.raw`Il denominatore si annulla in $x=${q}$, mentre il numeratore vale $${(q - p) ** 2}\neq0$: asintoto verticale $x=${q}$.` },
                { type: 'expr', prompt: String.raw`Asintoto obliquo: $y=$`, answer: `x+(${kq})`, vars: ['x'], domain: [-4, 4], explain: String.raw`Divido: $(x-${p})^2=(x-${q})(${H.lin(1, kq)})+${(p - q) ** 2}$, quindi $f(x)=${H.lin(1, kq)}+\dfrac{${(p - q) ** 2}}{${denTex}}$: asintoto obliquo $y=${H.lin(1, kq)}$.` },
                { type: 'set', prompt: String.raw`Punti stazionari (ascisse, dove $f'=0$)`, answer: [String(p), String(x2)], explain: String.raw`$f'(x)=\dfrac{(${H.lin(1, -p)})(${H.lin(1, -x2)})}{(${denTex})^2}$: si annulla per $x=${p}$ e $x=${x2}$.` },
                {
                  type: 'mcq', prompt: String.raw`Natura di $x=${p}$`, options: NAT_TEX, answer: minP ? 1 : 0, noShuffle: true,
                  explain: String.raw`Il numeratore è sempre $\ge0$, quindi il segno di $f$ vicino a $${p}$ è quello di $x-${q}$. ${minP ? String.raw`Poiché $${p}>${q}$, $f\ge0$ vicino a $${p}$ e $f(${p})=0$: minimo relativo.` : String.raw`Poiché $${p}<${q}$, $f\le0$ vicino a $${p}$ e $f(${p})=0$: massimo relativo.`}`,
                },
                { type: 'num', prompt: String.raw`Valore di $f$ nel secondo stazionario $x=${x2}$`, answer: String(f2), explain: String.raw`$f(${x2})=\dfrac{(${x2 - p})^2}{${x2 - q}}=\dfrac{${(x2 - p) ** 2}}{${x2 - q}}=${f2}$.` },
              ],
              solution: String.raw`Asintoto verticale $x=${q}$. Divisione: $(x-${p})^2=(x-${q})(${H.lin(1, kq)})+${(p - q) ** 2}$, quindi l'asintoto obliquo è $y=${H.lin(1, kq)}$. Derivata: $f'(x)=\dfrac{(${H.lin(1, -p)})(${H.lin(1, -x2)})}{(${denTex})^2}$, con stazionari $x=${p}$ e $x=${x2}$. In $x=${p}$ il segno di $f$ è quello di $x-${q}$: ${minP ? 'minimo' : 'massimo'} relativo con valore $0$. In $x=${x2}$ la natura è opposta, e $f(${x2})=${f2}$.`,
            };
          },
        },
        {
          id: 's09.studio.gen-flesso', type: 'gen', level: 2,
          gen: (R) => {
            const a = R.pick([1, -1, 2, -2]);
            const r = R.int(-2, 2);
            const m = R.nz(-3, 3);
            const d = R.int(-3, 3);
            // f(x) = a(x-r)^3 + m(x-r) + d, espansa
            const co = [a, -3 * a * r, 3 * a * r * r + m, -a * r ** 3 - m * r + d];
            const f2 = H.polyDeriv(H.polyDeriv(co));
            return {
              type: 'problem',
              prompt: String.raw`Sia $f(x)=${H.poly(co)}$. Trova il flesso, la sua ordinata, la pendenza della tangente nel flesso e la concavità a sinistra del flesso.`,
              parts: [
                { type: 'num', prompt: 'Ascissa del flesso', answer: String(r), explain: String.raw`$f''(x)=${H.poly(f2)}$ si annulla in $x=${r}$ e cambia segno: flesso in $x=${r}$.` },
                { type: 'num', prompt: 'Ordinata del flesso $f(x_0)$', answer: String(d), explain: String.raw`Scrivo $f(x)=a(x-x_0)^3+m(x-x_0)+d$ con $x_0=${r}$: in $x_0$ restano solo $d$. Quindi $f(${r})=${d}$.` },
                { type: 'num', prompt: String.raw`Pendenza della tangente nel flesso, cioè $f'(x_0)$`, answer: String(m), explain: String.raw`$f'(x)=3a(x-x_0)^2+m$, quindi $f'(x_0)=m=${m}$.` },
                {
                  type: 'mcq', prompt: String.raw`Per $x<${r}$ il grafico è…`, options: [String.raw`concavo ($f''<0$)`, String.raw`convesso ($f''>0$)`], answer: a > 0 ? 0 : 1, noShuffle: true,
                  explain: String.raw`$f''(x)=6a(x-${r})$: per $x<${r}$ ha il segno opposto a $a$. Con $a=${a}$ è ${a > 0 ? 'negativa: concavo' : 'positiva: convesso'}.`,
                },
              ],
              solution: String.raw`$f''(x)=6a(x-${r})$ si annulla in $x_0=${r}$ e cambia segno: è il flesso. Riscrivendo $f(x)=${a}(x-${r})^3+${m}(x-${r})+${d}$ si leggono $f(${r})=${d}$ e $f'(${r})=${m}$. Con $a=${a}$ il grafico è ${a > 0 ? 'concavo' : 'convesso'} a sinistra di $x_0$.`,
            };
          },
        },
        {
          id: 's09.studio.gen-angoloso', type: 'gen', level: 2,
          gen: (R) => {
            const k = R.pick([1, 2, 3]);
            const K = k * k;
            return {
              type: 'problem',
              prompt: String.raw`Sia $f(x)=\left|x^2-${K}\right|$. Trova i punti in cui $f$ non è derivabile, la natura di $x=${k}$, i punti stazionari e il valore del massimo relativo in $x=0$.`,
              parts: [
                { type: 'set', prompt: 'Punti in cui $f$ non è derivabile', answer: [String(-k), String(k)], explain: String.raw`Il modulo cambia segno in $x=\pm${k}$, dove $x^2-${K}=0$: lì il grafico fa uno spigolo. Le derivate laterali in $x=${k}$ sono $-${2 * k}$ e $+${2 * k}$.` },
                { type: 'mcq', prompt: String.raw`Natura di $x=${k}$`, options: NAT_TEX, answer: 1, noShuffle: true, explain: String.raw`$f(${k})=0$ e $f\ge0$ ovunque: $x=${k}$ è una valle a punta, quindi minimo relativo.` },
                { type: 'set', prompt: String.raw`Punti stazionari ($f'=0$) in $(-${k},${k})$`, answer: ['0'], explain: String.raw`Per $|x|<${k}$ si ha $f=${K}-x^2$, con $f'=-2x$: si annulla solo in $x=0$.` },
                { type: 'num', prompt: String.raw`Valore del massimo relativo in $x=0$`, answer: String(K), explain: String.raw`$f(0)=|-${K}|=${K}$. In $0$ la derivata passa da $+$ a $-$: massimo relativo.` },
              ],
              solution: String.raw`Per $|x|<${k}$ si ha $f=${K}-x^2$; per $|x|>${k}$ si ha $f=x^2-${K}$. Il grafico ha spigoli in $\pm${k}$, dove $f$ vale $0$ (minimi relativi). In $x=0$ c'è una cima liscia con valore $${K}$.`,
            };
          },
        },
      ],
      flashcards: [
        { id: 's09.studio.fc1', kind: 'def', front: String.raw`Asintoto verticale`, back: String.raw`$x=c$ è asintoto verticale se $\lim_{x\to c^+}f(x)=\pm\infty$ oppure $\lim_{x\to c^-}f(x)=\pm\infty$. Basta un solo lato.` },
        { id: 's09.studio.fc2', kind: 'def', front: String.raw`Asintoto orizzontale`, back: String.raw`$y=\ell$ con $\ell\in\R$ se $\lim_{x\to+\infty}f(x)=\ell$ oppure $\lim_{x\to-\infty}f(x)=\ell$.` },
        { id: 's09.studio.fc3', kind: 'def', front: String.raw`Asintoto obliquo $y=mx+q$`, back: String.raw`$m=\lim_{x\to\pm\infty}\dfrac{f(x)}{x}\in\R\setminus\{0\}$ e $q=\lim_{x\to\pm\infty}\big(f(x)-mx\big)\in\R$.` },
        { id: 's09.studio.fc4', kind: 'metodo', front: String.raw`Lista di studio completo`, back: String.raw`1) Dominio e simmetrie. 2) Segno e intersezioni. 3) Limiti agli estremi del dominio e asintoti. 4) $f'$: monotonia, stazionari, angolosi, estremi. 5) $f''$: concavità, flessi. 6) Grafico con tutte le informazioni.` },
        { id: 's09.studio.fc5', kind: 'def', front: String.raw`Funzione convessa e concava`, back: String.raw`$f$ è **convessa** su $I$ se il grafico sta sopra ogni sua tangente; **concava** se sta sotto.` },
        { id: 's09.studio.fc6', kind: 'thm', front: String.raw`Criterio di concavità con $f''$`, back: String.raw`Se $f''>0$ su un intervallo $I$, $f$ è convessa su $I$. Se $f''<0$ su $I$, $f$ è concava su $I$.` },
        { id: 's09.studio.fc7', kind: 'def', front: String.raw`Punto di flesso`, back: String.raw`$x_0$ è un flesso se in $x_0$ la funzione è derivabile e il grafico **cambia concavità**: $f''$ cambia segno in $x_0$.` },
        { id: 's09.studio.fc8', kind: 'metodo', front: String.raw`Procedimento per i flessi`, back: String.raw`1) Calcola $f''$. 2) Trova i punti con $f''=0$ o dove $f''$ non esiste. 3) Studia il segno di $f''$ a sinistra e a destra. 4) Cambio di segno: flesso; altrimenti no. L'ordinata è $f(x_0)$.` },
        { id: 's09.studio.fc9', kind: 'errore', front: String.raw`"$f''(x_0)=0$ quindi flesso"`, back: String.raw`Falso: $f''(x_0)=0$ è solo un candidato. Con $f=x^4$ si ha $f''(0)=0$ ma non c'è flesso, perché $f''\ge0$ non cambia segno.` },
        { id: 's09.studio.fc10', kind: 'errore', front: String.raw`Flesso e estremo`, back: String.raw`Un flesso a tangente orizzontale ($x^3$ in $0$) non è un estremo: $f'$ non cambia segno. Non confondere $f'$ (monotonia) con $f''$ (concavità).` },
        { id: 's09.studio.fc11', kind: 'errore', front: String.raw`Asintoto obliquo con $m=0$`, back: String.raw`Se $m=0$ e $q$ è finito, l'asintoto è **orizzontale**, non obliquo.` },
        { id: 's09.studio.fc12', kind: 'errore', front: String.raw`Punto escluso dal dominio = asintoto?`, back: String.raw`No, non sempre. Un punto escluso è solo candidato: se il limite è finito non c'è asintoto. Esempio: $\dfrac{x^2-1}{x-1}=x+1$ per $x\neq1$, limite finito in $1$.` },
        { id: 's09.studio.fc13', kind: 'def', front: String.raw`Punto angoloso`, back: String.raw`$x_0$ è angoloso se le derivate laterali $f'_-(x_0)$ e $f'_+(x_0)$ esistono finite ma sono diverse. Non è un punto stazionario, ma va controllato tra i candidati.` },
        { id: 's09.studio.fc14', kind: 'metodo', front: String.raw`Come disegnare il grafico finale`, back: String.raw`Prima gli asintoti, poi i punti notevoli (zeri, estremi, flessi), poi concavità e direzione. Il grafico deve rispettare **tutte** le informazioni raccolte.` },
      ],
    },
  ],
};
