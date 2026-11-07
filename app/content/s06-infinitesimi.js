import { H } from '../engine/tex.js';

// ---------------------------------------------------------------------------
// s06 · Infinitesimi e infiniti
// Le skill sono aggiunte in fondo con SKILLS.push(...): l'oggetto esportato
// contiene lo stesso array, quindi le aggiunte successive vi compaiono.
// ---------------------------------------------------------------------------

const SKILLS = [];

export default {
  id: 's06',
  title: 'Infinitesimi e infiniti',
  subtitle: 'o-piccolo, equivalenti, ordine e parte principale, gerarchia',
  intro: String.raw`Un infinitesimo è una quantità che tende a zero, un infinito una che diverge. All'esame servono per calcolare i limiti in forma indeterminata senza calcolatrice: al posto di un pezzo complicato si mette un pezzo più semplice che si comporta allo stesso modo. Qui impari il linguaggio di $o$ e $\sim$, le regole di calcolo e a riconoscere quando la sostituzione è lecita.`,
  skills: SKILLS,
};

// ---------- helper per i generatori ----------

/** Coefficiente con segno davanti alla variabile: 1 -> 'x', -1 -> '-x', -3 -> '-3x' */
const lx = (a, v = 'x') => `${H.coef(a)}${v}`;
/** Segno per scrivere 1+... : '+' se c>0, '' se c<0 (il segno negativo sta già in H.coef) */
const sg = (c) => (c < 0 ? '' : '+');
/** Potenza x^k in LaTeX: 0 -> '', 1 -> 'x', 2 -> 'x^{2}' */
const xk = (k) => (k === 0 ? '' : k === 1 ? 'x' : `x^{${k}}`);

// ===========================================================================
// s06.o · o-piccolo e asintotico; regole di calcolo; sostituzione nei limiti
// ===========================================================================
SKILLS.push({
  id: 's06.o',
  title: 'o-piccolo ed equivalenti',
  summary: String.raw`Confrontare due infinitesimi con $o(\cdot)$ e $\sim$, usare gli equivalenti per $x\to0$ e sostituirli nei limiti solo dove è lecito.`,
  prereq: ['s05.notevoli', 's05.calcolo'],
  examRefs: ['Itinere 11/11/2025 · Es. B3', 'Appello 11/06/2026 · Es. B3'],
  lessons: [
    {
      id: 's06.o.L1',
      title: 'Confrontare due infinitesimi',
      cards: [
        {
          type: 'learn',
          title: 'Quantità che vanno a zero a velocità diverse',
          body: String.raw`Per $x\to0$ le funzioni $x$, $x^2$ e $x^3$ tendono **tutte** a $0$. Non sono però equivalenti: vanno a zero a velocità diverse.

Guarda i valori per $x=0{,}1$ e per $x=0{,}01$:

- $x$: $0{,}1$ e $0{,}01$
- $x^2$: $0{,}01$ e $0{,}0001$
- $x^3$: $0{,}001$ e $0{,}000001$

Più l'esponente è grande, più il valore è piccolo. Per confrontare due infinitesimi non si guardano i valori: si guarda il **rapporto**.`,
        },
        {
          type: 'learn',
          title: 'La definizione di o-piccolo',
          body: String.raw`>* Siano $f$ e $g$ infinitesimi per $x\to x_0$. Si scrive $f=o(g)$ (si legge "$f$ è o-piccolo di $g$") se
$$\lim_{x\to x_0}\frac{f(x)}{g(x)}=0.$$

Significa che $f$ è **trascurabile rispetto a $g$**. Esempio: per $x\to0$ si ha $x^2=o(x)$, perché $\dfrac{x^2}{x}=x\to0$.

>! Attenzione: $f=o(g)$ non dice che $f$ è piccola in assoluto. Dice che è piccola **rispetto a $g$**: lo stesso $f$ può essere $o(g)$ e non essere $o(h)$.`,
          plot: { fns: ['x', 'x^2'], x: [0, 1.2], y: [-0.2, 1.2] },
        },
        {
          type: 'learn',
          title: 'Che cosa mostra il grafico',
          body: String.raw`Su $[0,1]$ il grafico di $x^2$ sta sotto quello di $x$. Il rapporto $\dfrac{x^2}{x}=x$ va a $0$ quando $x\to0$: questo è esattamente ciò che dice $x^2=o(x)$. Il rapporto va a $0$ anche se le due curve sono entrambe vicine a $0$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Dimostra che $3x^2-x^3=o(x)$ per $x\to0$.`,
          steps: [
            String.raw`Scrivo il rapporto con la definizione: $\dfrac{3x^2-x^3}{x}$.`,
            {
              text: String.raw`Divido ogni termine per $x$ (ha senso per $x\neq0$): $\dfrac{3x^2-x^3}{x}=3x-x^2$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`Scrivi come espressione in $x$ il rapporto semplificato $\dfrac{3x^2-x^3}{x}$.`,
                answer: '3*x-x^2',
                vars: ['x'],
                explain: String.raw`Divido ciascun termine per $x$: $\dfrac{3x^2}{x}=3x$ e $\dfrac{x^3}{x}=x^2$.`,
              },
            },
            String.raw`Calcolo il limite: $3x-x^2\to0$ per $x\to0$. Quindi $\dfrac{3x^2-x^3}{x}\to0$, cioè $3x^2-x^3=o(x)$.`,
          ],
          result: String.raw`$3x^2-x^3=o(x)$ per $x\to0$.`,
        },
        {
          type: 'num',
          id: 's06.o.L1.e1',
          level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{x^3+5x^2}{x}$.`,
          answer: '0',
          explain: String.raw`Divido ogni termine per $x$: $\dfrac{x^3+5x^2}{x}=x^2+5x\to0$.`,
        },
        {
          type: 'tf',
          id: 's06.o.L1.e2',
          level: 1,
          prompt: String.raw`Per $x\to0$ vale $x^4=o(x^3)$.`,
          answer: true,
          explain: String.raw`Il rapporto è $\dfrac{x^4}{x^3}=x\to0$. Vero: un esponente più alto dà un infinitesimo più piccolo.`,
        },
        {
          type: 'mcq',
          id: 's06.o.L1.e3',
          level: 1,
          prompt: String.raw`Per $x\to0$, quale funzione è **trascurabile rispetto a $x$**, cioè $=o(x)$?`,
          options: [String.raw`$x^2$`, String.raw`$\sqrt{x}$`, String.raw`$3x$`],
          answer: 0,
          explain: String.raw`Vera: $\dfrac{x^2}{x}=x\to0$. Sbagliata $\sqrt x$: $\dfrac{\sqrt x}{x}=\dfrac1{\sqrt x}\to+\infty$, cioè $\sqrt x$ è molto più grande di $x$. Sbagliata $3x$: $\dfrac{3x}{x}=3\not\to0$, sono dello stesso ordine.`,
        },
        {
          type: 'mcq',
          id: 's06.o.L1.e4',
          level: 2,
          prompt: String.raw`Quale affermazione è vera per $x\to0$?`,
          options: [String.raw`$x^3=o(x^2)$`, String.raw`$x^2=o(x^3)$`, String.raw`$x=o(x)$`],
          answer: 0,
          explain: String.raw`Vera: $\dfrac{x^3}{x^2}=x\to0$. Falsa $x^2=o(x^3)$: $\dfrac{x^2}{x^3}=\dfrac1x\to\infty$, perché vicino a $0$ la $x^2$ è **più grande** di $x^3$. Falsa $x=o(x)$: ogni funzione ha rapporto $1$ con sé stessa, non $0$.`,
        },
        {
          type: 'num',
          id: 's06.o.L1.e5',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\sin^2 x}{x}$.`,
          answer: '0',
          explain: String.raw`$\sin^2x=\sin x\cdot\sin x$ e $\dfrac{\sin^2x}{x}=\sin x\cdot\dfrac{\sin x}{x}\to0\cdot1=0$.`,
        },
        {
          type: 'order',
          id: 's06.o.L1.e6',
          level: 2,
          prompt: String.raw`Metti in ordine i passi per dimostrare che $f=o(g)$ con la definizione.`,
          steps: [
            String.raw`Calcolo il rapporto $\dfrac{f(x)}{g(x)}$.`,
            String.raw`Calcolo il limite del rapporto per $x\to x_0$.`,
            String.raw`Se il limite è $0$, concludo $f=o(g)$.`,
          ],
          distractors: [String.raw`Se il limite è $1$, concludo $f=o(g)$.`],
          explain: String.raw`Il limite $1$ significa $f\sim g$ (stessa velocità), non $f=o(g)$: per l'o-piccolo serve il limite $0$.`,
        },
        {
          type: 'expr',
          id: 's06.o.L1.e7',
          level: 1,
          prompt: String.raw`Semplifica il rapporto $\dfrac{x^2+x^3}{x}$.`,
          answer: 'x+x^2',
          vars: ['x'],
          explain: String.raw`Divido ogni termine per $x$: $\dfrac{x^2}{x}=x$ e $\dfrac{x^3}{x}=x^2$.`,
        },
      ],
    },
    {
      id: 's06.o.L2',
      title: 'Equivalenti per $x\\to0$',
      cards: [
        {
          type: 'learn',
          title: 'Funzioni con la stessa velocità',
          body: String.raw`>* Due infinitesimi $f$ e $g$ sono **equivalenti** per $x\to x_0$, e si scrive $f\sim g$, se
$$\lim_{x\to x_0}\frac{f(x)}{g(x)}=1.$$

Hanno la stessa velocità di avvicinamento a $0$. Il legame con $o$ è questo: $f\sim g$ se e solo se $f=g+o(g)$, cioè la differenza $f-g$ è trascurabile rispetto a $g$.`,
        },
        {
          type: 'learn',
          title: 'Gli equivalenti da ricordare',
          body: String.raw`Per $x\to0$ valgono queste equivalenze. Sono i limiti notevoli di s05 letti come equivalenze:

- $\sin x\sim x$, $\tan x\sim x$, $\arcsin x\sim x$, $\arctan x\sim x$
- $\log(1+x)\sim x$, $e^x-1\sim x$
- $(1+x)^\alpha-1\sim \alpha x$
- $1-\cos x\sim \dfrac{x^2}{2}$

Se l'argomento $t(x)$ tende a $0$, si sostituisce $x$ con $t(x)$: ad esempio $\sin(3x)\sim 3x$ e $\log(1+x^2)\sim x^2$.`,
          plot: { fns: ['sin(x)', 'x'], x: [-2, 2], y: [-2, 2] },
        },
        {
          type: 'learn',
          title: 'Equivalente non vuol dire uguale',
          body: String.raw`>! Attenzione: $\sin x\sim x$ **non** significa $\sin x=x$. La differenza è $\sin x-x=-\dfrac{x^3}{6}+o(x^3)$, molto più piccola di $x$.

È proprio questo che rende utili gli equivalenti: si sostituisce il pezzo complicato con quello semplice, perdendo solo termini trascurabili. Ma bisogna sapere quando questa perdita è innocua (lo vedremo in L3).`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\tan 3x}{\log(1+2x)}$.`,
          steps: [
            String.raw`Il limite si presenta come $\dfrac00$. Sostituisco gli equivalenti: con $t=3x\to0$ si ha $\tan 3x\sim 3x$.`,
            {
              text: String.raw`Per il denominatore uso $\log(1+t)\sim t$ con $t=2x\to0$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`A cosa è equivalente $\log(1+2x)$ per $x\to0$?`,
                answer: '2*x',
                vars: ['x'],
                explain: String.raw`Con $t=2x\to0$ si ha $\log(1+t)\sim t$, cioè $\log(1+2x)\sim 2x$.`,
              },
            },
            String.raw`Il rapporto diventa $\dfrac{3x}{2x}=\dfrac32$: la $x$ si semplifica.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to0}\frac{\tan 3x}{\log(1+2x)}=\frac32$`,
        },
        {
          type: 'num',
          id: 's06.o.L2.e1',
          level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\sin 5x}{x}$.`,
          answer: '5',
          explain: String.raw`$\sin 5x\sim 5x$, quindi il rapporto va a $\dfrac{5x}{x}=5$.`,
        },
        {
          type: 'mcq',
          id: 's06.o.L2.e2',
          level: 2,
          prompt: String.raw`Quale equivalenza è corretta per $x\to0$?`,
          options: [String.raw`$1-\cos x\sim x$`, String.raw`$1-\cos x\sim \dfrac{x^2}{2}$`, String.raw`$1-\cos x\sim -x^2$`],
          answer: 1,
          explain: String.raw`Giusta: $\dfrac{1-\cos x}{x^2/2}\to1$. Sbagliata $\sim x$: $\dfrac{1-\cos x}{x}\to0$, quindi il rapporto non tende a $1$. Sbagliata $\sim -x^2$: il rapporto va a $-\dfrac12$, e $1-\cos x\ge0$ non può essere equivalente a un'espressione negativa.`,
        },
        {
          type: 'tf',
          id: 's06.o.L2.e3',
          level: 2,
          prompt: String.raw`Per $x\to0$ vale $\sqrt{1+x}-1\sim x$.`,
          answer: false,
          explain: String.raw`Con $\alpha=\tfrac12$ si ha $(1+x)^{1/2}-1\sim\tfrac12x$. Il rapporto con $x$ va a $\tfrac12$, non a $1$.`,
        },
        {
          type: 'num',
          id: 's06.o.L2.e4',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{(1+x)^{1/3}-1}{x}$.`,
          answer: '1/3',
          explain: String.raw`È il limite notevole $(1+x)^\alpha-1\sim\alpha x$ con $\alpha=\tfrac13$: il valore è $\tfrac13$.`,
        },
        {
          type: 'match',
          id: 's06.o.L2.e5',
          level: 2,
          prompt: String.raw`Abbina ogni funzione al suo equivalente per $x\to0$.`,
          pairs: [
            [String.raw`$\sin 2x$`, String.raw`$2x$`],
            [String.raw`$\log(1+x^2)$`, String.raw`$x^2$`],
            [String.raw`$e^{3x}-1$`, String.raw`$3x$`],
            [String.raw`$1-\cos 4x$`, String.raw`$8x^2$`],
          ],
          explain: String.raw`Ogni coppia è un'equivalenza notevole con $t$ al posto di $x$: $1-\cos t\sim\dfrac{t^2}{2}$ con $t=4x$ dà $8x^2$.`,
        },
        {
          type: 'expr',
          id: 's06.o.L2.e6',
          level: 2,
          prompt: String.raw`Scrivi l'equivalente per $x\to0$ di $\arctan(3x^2)$.`,
          answer: '3*x^2',
          vars: ['x'],
          explain: String.raw`Con $t=3x^2\to0$ si ha $\arctan t\sim t$, quindi $\arctan(3x^2)\sim 3x^2$.`,
        },
        {
          type: 'tf',
          id: 's06.o.L2.e7',
          level: 2,
          prompt: String.raw`Se $f\sim g$ per $x\to0$, allora $f-g=o(g)$.`,
          answer: true,
          explain: String.raw`$f\sim g$ significa $f=g+o(g)$: la differenza è trascurabile rispetto a $g$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto (con un passo da completare)',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{1-\cos x}{x\sin x}$.`,
          steps: [
            String.raw`Forma $\dfrac00$. Sostituisco $1-\cos x\sim\dfrac{x^2}{2}$ al numeratore e $\sin x\sim x$ al denominatore.`,
            {
              text: String.raw`Il denominatore diventa $x\cdot x=x^2$, quindi il rapporto è $\dfrac{x^2/2}{x^2}$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale il limite per $x\to0$ di $\dfrac{x^2/2}{x^2}$?`,
                answer: '1/2',
                explain: String.raw`La $x^2$ si semplifica e resta $\dfrac12$.`,
              },
            },
          ],
          result: String.raw`$\displaystyle\lim_{x\to0}\frac{1-\cos x}{x\sin x}=\frac12$`,
        },
        {
          type: 'num',
          id: 's06.o.L2.e8',
          level: 3,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\log(1+x)\,\sin 2x}{x^2}$.`,
          answer: '2',
          explain: String.raw`$\log(1+x)\sim x$ e $\sin 2x\sim 2x$: il numeratore è $\sim 2x^2$, il rapporto va a $2$.`,
        },
      ],
    },
    {
      id: 's06.o.L3',
      title: 'Regole di calcolo e sostituzione nei limiti',
      cards: [
        {
          type: 'learn',
          title: 'Prodotti e quozienti: sostituzione lecita',
          body: String.raw`Se un limite è un **prodotto** o un **quoziente** di fattori, ogni fattore si può sostituire con un suo equivalente:

- se $f_1\sim g_1$ e $f_2\sim g_2$, allora $f_1f_2\sim g_1g_2$;
- se $f\sim g$ e $h\neq0$ vicino a $x_0$, allora $\dfrac{f}{h}\sim\dfrac{g}{h}$ e $\dfrac{h}{f}\sim\dfrac{h}{g}$.

Quindi nel prodotto $\tan 3x\cdot\log(1+x^2)$ si può scrivere $3x\cdot x^2=3x^3$.`,
        },
        {
          type: 'learn',
          title: 'Somme: attenzione alle cancellazioni',
          body: String.raw`>* Nelle **somme** la sostituzione non è sempre lecita. Se i termini principali **si annullano**, il risultato dipende dai termini successivi.

Esempio: $\log(1+x)\sim x$ e $\sin x\sim x$. Sostituendo al numeratore di $\dfrac{\log(1+x)-\sin x}{x^2}$ si otterrebbe $\dfrac{x-x}{x^2}=0$, ma il risultato è sbagliato. Il numeratore vale davvero $-\dfrac{x^2}{2}+o(x^2)$, perché il primo ordine si cancella, e il limite è $-\dfrac12$.

>! Regola pratica: sostituisci negli **addendi** solo se non ci sono cancellazioni dei termini principali.`,
        },
        {
          type: 'learn',
          title: 'Calcolo con gli o-piccoli',
          body: String.raw`Con gli o-piccoli si calcola come con i polinomi, per $x\to0$:

- $o(x^n)+o(x^n)=o(x^n)$;
- $x^m\cdot o(x^n)=o(x^{m+n})$;
- $o(x^n)\cdot o(x^m)=o(x^{n+m})$;
- se $m>n$, allora $x^m=o(x^n)$ (per esempio $x^3=o(x^2)$).

Il punto chiave è la seconda regola: un fattore $x^m$ fuori da un $o$ alza l'esponente. Per questo i termini di ordine più alto spariscono nel limite.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\tan(3x)\,\log(1+x^2)}{x^3}$.`,
          steps: [
            String.raw`È un prodotto: posso sostituire ogni fattore. Con $t=3x\to0$ si ha $\tan(3x)\sim3x$.`,
            {
              text: String.raw`Il secondo fattore è $\log(1+x^2)$, con argomento $t=x^2\to0$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`A cosa è equivalente $\log(1+x^2)$ per $x\to0$?`,
                answer: 'x^2',
                vars: ['x'],
                explain: String.raw`Con $t=x^2\to0$ si ha $\log(1+t)\sim t$, cioè $\log(1+x^2)\sim x^2$.`,
              },
            },
            String.raw`Il numeratore diventa $3x\cdot x^2=3x^3$, quindi il rapporto è $\dfrac{3x^3}{x^3}=3$.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to0}\frac{\tan(3x)\log(1+x^2)}{x^3}=3$`,
        },
        {
          type: 'mcq',
          id: 's06.o.L3.e1',
          level: 2,
          prompt: String.raw`Per calcolare $\displaystyle\lim_{x\to0}\frac{\sin x-x}{x^3}$, posso sostituire $\sin x$ con $x$ al numeratore?`,
          options: [
            String.raw`Sì: il limite diventa $0$.`,
            String.raw`No: la differenza si annulla al primo ordine, serve un ordine più alto.`,
            String.raw`Sì, perché $\sin x\sim x$ vale sempre.`,
          ],
          answer: 1,
          explain: String.raw`Sostituendo otterrei $\dfrac{x-x}{x^3}=0$, che è sbagliato. Il numeratore è $-\dfrac{x^3}{6}+o(x^3)$, quindi il limite vale $-\dfrac16$ (servono gli sviluppi di Taylor, s10). L'equivalenza non si usa quando il termine principale si cancella.`,
        },
        {
          type: 'num',
          id: 's06.o.L3.e2',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{x\sin 2x}{\tan^2 x}$.`,
          answer: '2',
          explain: String.raw`$x\sin 2x\sim x\cdot 2x=2x^2$ e $\tan^2x\sim x^2$: il rapporto va a $\dfrac{2x^2}{x^2}=2$.`,
        },
        {
          type: 'num',
          id: 's06.o.L3.e3',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\log(1+3x)\,(e^{x}-1)}{x^2}$.`,
          answer: '3',
          explain: String.raw`$\log(1+3x)\sim3x$ e $e^x-1\sim x$: il numeratore è $\sim3x^2$, quindi il limite vale $3$.`,
        },
        {
          type: 'tf',
          id: 's06.o.L3.e4',
          level: 2,
          prompt: String.raw`Nel limite $\displaystyle\lim_{x\to0}\frac{\sin x+\sin 2x}{x}$ la sostituzione $\sin x\to x$ e $\sin 2x\to 2x$ dà il risultato corretto.`,
          answer: true,
          explain: String.raw`Al numeratore non ci sono cancellazioni: $x+2x=3x$. Il limite è $3$ e la sostituzione è lecita.`,
        },
        {
          type: 'order',
          id: 's06.o.L3.e5',
          level: 2,
          prompt: String.raw`Metti in ordine i passi per calcolare un limite con gli equivalenti.`,
          steps: [
            String.raw`Verifico la forma indeterminata (di solito $\dfrac00$).`,
            String.raw`Sostituisco gli equivalenti nei **fattori** di prodotti e quozienti.`,
            String.raw`Semplifico le potenze di $x$ e calcolo il limite del risultato.`,
          ],
          distractors: [String.raw`Sostituisco gli equivalenti anche dentro le somme, senza controllare le cancellazioni.`],
          explain: String.raw`Il passo sbagliato è sostituire dentro le somme senza controllare le cancellazioni.`,
        },
        {
          type: 'open',
          id: 's06.o.L3.e6',
          level: 2,
          points: 2,
          prompt: String.raw`Spiega perché, in un limite, gli equivalenti si possono sostituire nei fattori di un prodotto ma non sempre negli addendi di una somma. Fai un esempio.`,
          answer: String.raw`Se $f\sim f_1$ e $g\sim g_1$, il rapporto $\dfrac{fg}{f_1g_1}=\dfrac{f}{f_1}\cdot\dfrac{g}{g_1}$ tende a $1$: nei prodotti e nei quozienti il limite non cambia. Nella somma $f+g$ la sostituzione è lecita solo se i termini principali non si annullano. Esempio: $\log(1+x)-\sin x$ ha equivalenti $x-x=0$, ma $\dfrac{\log(1+x)-\sin x}{x^2}\to-\dfrac12$, non $0$.`,
          rubric: [
            'Nei prodotti e nei quozienti il rapporto dei fattori tende a 1, quindi la sostituzione è lecita',
            'Nelle somme la sostituzione è lecita solo se i termini principali non si annullano',
            'Esempio corretto (log(1+x) - sin x, oppure simile)',
            'Il risultato corretto (-1/2) richiede un ordine di infinitesimo più alto',
          ],
        },
        {
          type: 'problem',
          id: 's06.o.L3.e7',
          level: 3,
          source: 'Appello 11/06/2026 · Es. B3',
          points: 4,
          prompt: String.raw`Per $x\to0$: (a) sviluppa al primo ordine $1-\cos[\log(1+\sqrt x)]$; (b) calcola $\displaystyle\lim_{x\to0}\frac{(1-\cos[\log(1+\sqrt x)])\,x}{x-\sin(x+x^2)}$.`,
          parts: [
            {
              type: 'mcq',
              prompt: String.raw`(a) Primo ordine di $1-\cos[\log(1+\sqrt x)]$.`,
              options: [String.raw`$\dfrac x2$`, String.raw`$\sqrt x$`, String.raw`$\dfrac{x^2}2$`],
              answer: 0,
              explain: String.raw`Con $u=\log(1+\sqrt x)\sim\sqrt x$ si ha $1-\cos u\sim\dfrac{u^2}{2}\sim\dfrac{(\sqrt x)^2}{2}=\dfrac x2$.`,
            },
            {
              type: 'num',
              prompt: String.raw`(b) Valore del limite.`,
              answer: '-1/2',
              explain: String.raw`Numeratore: $\left(\dfrac x2+o(x)\right)x=\dfrac{x^2}{2}+o(x^2)$. Denominatore: $\sin(x+x^2)=x+x^2+o(x^2)$, quindi $x-\sin(x+x^2)=-x^2+o(x^2)$. Il rapporto va a $-\dfrac12$.`,
            },
          ],
          solution: String.raw`(a) $1-\cos[\log(1+\sqrt x)]=\dfrac x2+o(x)$. (b) Il numeratore è $\dfrac{x^2}{2}+o(x^2)$ e il denominatore è $-x^2+o(x^2)$: il limite vale $-\dfrac12$.`,
        },
        {
          type: 'problem',
          id: 's06.o.L3.e8',
          level: 2,
          source: 'Itinere 11/11/2025 · Es. B3',
          points: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\tan x+\log(1+x^2)}{2x}$.`,
          parts: [
            {
              type: 'num',
              prompt: String.raw`Valore del limite.`,
              answer: '1/2',
              explain: String.raw`$\tan x\sim x$ e $\log(1+x^2)\sim x^2=o(x)$: il numeratore è $x+o(x)$, quindi il rapporto va a $\dfrac12$.`,
            },
          ],
          solution: String.raw`Usando $\tan x=x+o(x)$ e $\log(1+x^2)=x^2+o(x^2)=o(x)$ si ha $\dfrac{x+o(x)}{2x}\to\dfrac12$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's06.o.gen-tan-log', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-3, 3), c = R.nz(-3, 3);
        const num = String.raw`\tan(${lx(a)})+\log(1${sg(b)}${H.coef(b)}x^{2})`;
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{${num}}{${lx(c)}}$`,
          answer: H.fracStr(a, c),
          explain: String.raw`$\tan(${lx(a)})\sim ${lx(a)}$, mentre $\log(1${sg(b)}${H.coef(b)}x^{2})\sim ${H.coef(b)}x^{2}=o(x)$. Il numeratore è $${lx(a)}+o(x)$, quindi il rapporto va a $${H.frac(a, c)}$.`,
        };
      },
    },
    {
      id: 's06.o.gen-rapporto', type: 'gen', level: 2,
      gen: (R) => {
        const p = R.int(0, 3), q = R.chance(0.5) ? p : R.int(0, 3);
        const a = R.nz(-3, 3), b = R.nz(-3, 3);
        const d = p - q;
        const ratio = H.frac(a, b);
        const L = d === 0 ? H.fracStr(a, b) : d > 0 ? '0' : a / b > 0 ? 'inf' : '-inf';
        const concl = d === 0
          ? String.raw`L'esponente è $0$: il limite vale $${ratio}$.`
          : d > 0
            ? String.raw`L'esponente $${d}>0$ dà $x^{${d}}\to0$: il limite vale $0$.`
            : String.raw`L'esponente $${d}<0$ dà $x^{${d}}\to+\infty$ per $x\to0^+$: il limite vale $${a / b > 0 ? '+\\infty' : '-\\infty'}$.`;
        const numer = String.raw`${xk(p)}\sin(${lx(a)})`;
        const denom = String.raw`${xk(q)}\log(1${sg(b)}${H.coef(b)}x)`;
        const numTex = `${xk(p)}${p ? '\\,' : ''}${lx(a)}`;
        const denTex = `${xk(q)}${q ? '\\,' : ''}${lx(b)}`;
        const pot = d === 0 ? '' : d === 1 ? 'x' : `x^{${d}}`;
        const simpl = ratio === '1' ? (pot || '1') : ratio === '-1' ? `-${pot || '1'}` : `${ratio}${pot}`;
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\lim_{x\to0^+}\frac{${numer}}{${denom}}$`,
          answer: L,
          explain: String.raw`Sostituisco $\sin(${lx(a)})\sim ${lx(a)}$ e $\log(1${sg(b)}${H.coef(b)}x)\sim ${lx(b)}$. Il rapporto diventa $\dfrac{${numTex}}{${denTex}}=${simpl}$. ${concl}`,
        };
      },
    },
    {
      id: 's06.o.gen-differenza', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-4, 4);
        const b = R.chance(0.2) ? a : R.nz(-4, 4);
        const L = a - b;
        const note = L === 0 ? String.raw` Qui il primo ordine si annulla: il numeratore è $o(x)$, quindi il limite è $0$.` : '';
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\log(1${sg(a)}${H.coef(a)}x)-\sin(${lx(b)})}{x}$`,
          answer: String(L),
          explain: String.raw`$\log(1${sg(a)}${H.coef(a)}x)=${lx(a)}+o(x)$ e $\sin(${lx(b)})=${lx(b)}+o(x)$. Sottraendo, il numeratore è $${lx(L)}+o(x)$, quindi il limite vale $${L}$.${note}`,
        };
      },
    },
    {
      id: 's06.o.gen-trappola', type: 'gen', level: 3,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\log(1${sg(a)}${H.coef(a)}x)-\sin(${lx(a)})}{x^{2}}$`,
          answer: H.fracStr(-a * a, 2),
          explain: String.raw`Il primo ordine si cancella: con $t=${lx(a)}$, $\log(1+t)\sim t$ e $\sin t\sim t$ danno $t-t=0$, ma questo non basta. Serve il secondo ordine: $\log(1+t)=t-\dfrac{t^2}{2}+o(t^2)$ e $\sin t=t+o(t^2)$. La differenza è $-\dfrac{t^2}{2}+o(t^2)=-\dfrac{${a * a}}{2}x^2+o(x^2)$, quindi il limite vale $${H.frac(-a * a, 2)}$.`,
        };
      },
    },
    {
      id: 's06.o.p1', type: 'mcq', level: 1,
      prompt: String.raw`Per $x\to0$, quale funzione è $o(x^2)$?`,
      options: [String.raw`$x^3$`, String.raw`$x^2$`, String.raw`$\sqrt{x}$`],
      answer: 0,
      explain: String.raw`$\dfrac{x^3}{x^2}=x\to0$: sì. $\dfrac{x^2}{x^2}=1$, quindi $x^2$ non è $o(x^2)$. $\dfrac{\sqrt x}{x^2}\to+\infty$: no.`,
    },
    {
      id: 's06.o.p2', type: 'num', level: 1,
      prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{e^{4x}-1}{\sin 2x}$`,
      answer: '2',
      explain: String.raw`$e^{4x}-1\sim4x$ e $\sin 2x\sim2x$: il rapporto è $\dfrac{4x}{2x}=2$.`,
    },
    {
      id: 's06.o.p3', type: 'tf', level: 1,
      prompt: String.raw`Per $x\to0$ vale $1-\cos 2x\sim 2x^2$.`,
      answer: true,
      explain: String.raw`$1-\cos u\sim\dfrac{u^2}{2}$ con $u=2x$: $\dfrac{4x^2}{2}=2x^2$.`,
    },
    {
      id: 's06.o.p4', type: 'expr', level: 2,
      prompt: String.raw`Scrivi l'equivalente per $x\to0$ di $\sqrt{1+3x}-1$.`,
      answer: '3*x/2',
      vars: ['x'],
      explain: String.raw`$(1+t)^{1/2}-1\sim\dfrac12 t$ con $t=3x$: l'equivalente è $\dfrac{3x}{2}$.`,
    },
    {
      id: 's06.o.p5', type: 'cloze', level: 1,
      text: String.raw`Per $x\to0$: $\sin(5x)\sim$ [[0]] e $e^{x^2}-1\sim$ [[1]].`,
      blanks: [
        { options: [String.raw`$5x$`, String.raw`$x$`, String.raw`$x^2$`], answer: 0 },
        { options: [String.raw`$x$`, String.raw`$x^2$`, String.raw`$\dfrac{x^2}{2}$`], answer: 1 },
      ],
      explain: String.raw`$\sin t\sim t$ con $t=5x$. $e^t-1\sim t$ con $t=x^2$.`,
    },
    {
      id: 's06.o.p6', type: 'match', level: 2,
      prompt: String.raw`Abbina ogni funzione al suo equivalente per $x\to0$.`,
      pairs: [
        [String.raw`$\arcsin 3x$`, String.raw`$3x$`],
        [String.raw`$\cos x-1$`, String.raw`$-\dfrac{x^2}{2}$`],
        [String.raw`$(1+2x)^3-1$`, String.raw`$6x$`],
      ],
      explain: String.raw`$\arcsin t\sim t$ con $t=3x$. $\cos x-1\sim-\dfrac{x^2}{2}$. $(1+t)^3-1\sim3t$ con $t=2x$, cioè $6x$.`,
    },
    {
      id: 's06.o.p7', type: 'mcq', level: 2,
      prompt: String.raw`Quale affermazione è vera per $x\to0$?`,
      options: [String.raw`$\sin^2 x=o(x)$`, String.raw`$x=o(\sin^2x)$`, String.raw`$\sin x=o(x)$`],
      answer: 0,
      explain: String.raw`$\dfrac{\sin^2x}{x}=\sin x\cdot\dfrac{\sin x}{x}\to0$: vera. $\dfrac{x}{\sin^2x}\to+\infty$: falsa. $\dfrac{\sin x}{x}\to1$: falsa, perché $\sin x\sim x$.`,
    },
    {
      id: 's06.o.p8', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\log(1+x)}{\sqrt{1+x}-1}$`,
      answer: '2',
      explain: String.raw`$\log(1+x)\sim x$ e $\sqrt{1+x}-1\sim\dfrac x2$: il rapporto va a $2$.`,
    },
    {
      id: 's06.o.p9', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{x^2+3x^3}{2x^2-x}$`,
      answer: '0',
      explain: String.raw`Il numeratore è $\sim x^2$ e il denominatore è $\sim -x$: il rapporto è $\sim -x\to0$.`,
    },
    {
      id: 's06.o.p10', type: 'tf', level: 2,
      prompt: String.raw`Se $\sin x\sim x$ per $x\to0$, allora $\sin x-x=o(x)$.`,
      answer: true,
      explain: String.raw`$f\sim g$ significa $f=g+o(g)$: con $f=\sin x$ e $g=x$ si ha $\sin x-x=o(x)$.`,
    },
  ],
  flashcards: [
    {
      id: 's06.o.fc1', kind: 'def',
      front: String.raw`Quando si scrive $f=o(g)$ per $x\to x_0$?`,
      back: String.raw`Quando $\displaystyle\lim_{x\to x_0}\frac{f(x)}{g(x)}=0$: $f$ è trascurabile rispetto a $g$.`,
    },
    {
      id: 's06.o.fc2', kind: 'def',
      front: String.raw`Quando due infinitesimi sono equivalenti ($f\sim g$)?`,
      back: String.raw`Quando $\displaystyle\lim_{x\to x_0}\frac{f(x)}{g(x)}=1$. Equivale a $f=g+o(g)$.`,
    },
    {
      id: 's06.o.fc3', kind: 'formula',
      front: String.raw`Equivalenti per $x\to0$: $\sin x$, $\tan x$, $\log(1+x)$, $e^x-1$`,
      back: String.raw`$\sin x\sim x$, $\tan x\sim x$, $\log(1+x)\sim x$, $e^x-1\sim x$.`,
    },
    {
      id: 's06.o.fc4', kind: 'formula',
      front: String.raw`Equivalenti per $x\to0$: $1-\cos x$ e $(1+x)^\alpha-1$`,
      back: String.raw`$1-\cos x\sim\dfrac{x^2}{2}$, $(1+x)^\alpha-1\sim\alpha x$.`,
    },
    {
      id: 's06.o.fc5', kind: 'metodo',
      front: String.raw`Quando posso sostituire un equivalente in un limite?`,
      back: String.raw`Sempre nei **fattori** di prodotti e quozienti. Nelle **somme** solo se i termini principali non si annullano.`,
    },
    {
      id: 's06.o.fc6', kind: 'errore',
      front: String.raw`Errore tipico: sostituire negli addendi di una somma con cancellazioni`,
      back: String.raw`Con $\sin x-x$ la sostituzione dà $0$, ma il primo ordine si annulla: serve un ordine più alto. Per $\log(1+x)-\sin x$ il limite di $\dfrac{\cdot}{x^2}$ è $-\tfrac12$.`,
    },
    {
      id: 's06.o.fc7', kind: 'formula',
      front: String.raw`Regole di calcolo con gli o-piccoli (per $x\to0$)`,
      back: String.raw`$o(x^n)+o(x^n)=o(x^n)$; $x^m\,o(x^n)=o(x^{m+n})$; $o(x^n)\,o(x^m)=o(x^{n+m})$; se $m>n$ allora $x^m=o(x^n)$.`,
    },
    {
      id: 's06.o.fc8', kind: 'metodo',
      front: String.raw`Procedura per un limite con gli equivalenti`,
      back: String.raw`1) Verifica la forma indeterminata. 2) Sostituisci gli equivalenti nei fattori. 3) Semplifica le potenze di $x$. 4) Calcola il limite del risultato.`,
    },
  ],
});
