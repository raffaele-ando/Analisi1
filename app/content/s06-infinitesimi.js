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

// ===========================================================================
// s06.ordine · Ordine e parte principale (anche con parametro)
// ===========================================================================
SKILLS.push({
  id: 's06.ordine',
  title: 'Ordine e parte principale',
  summary: String.raw`Trovare l'ordine di infinitesimo e la parte principale di una funzione, anche quando compare un parametro $\alpha$ da studiare caso per caso.`,
  prereq: ['s06.o', 's05.notevoli'],
  examRefs: ['Itinere 15/01/2026 · Es. B2', 'Appello 15/01/2026 · Es. B4'],
  lessons: [
    {
      id: 's06.ordine.L1',
      title: 'Ordine di infinitesimo e parte principale',
      cards: [
        {
          type: 'learn',
          title: 'Quanto è piccolo un infinitesimo',
          body: String.raw`Una funzione $f$ infinitesima per $x\to0$ ha **ordine** $\alpha>0$ se esiste $c\neq0$ con
$$f(x)\sim c\,x^{\alpha}, \qquad\text{cioè}\qquad f(x)=c\,x^{\alpha}+o(x^{\alpha}).$$

Il termine $c\,x^{\alpha}$ è la **parte principale** di $f$: è ciò che resta quando si trascurano gli infinitesimi di ordine superiore.

Esempio: $f(x)=3x^2-x^3$ ha ordine $2$ e parte principale $3x^2$, perché $x^3=o(x^2)$.`,
        },
        {
          type: 'learn',
          title: 'Vince l\'esponente più piccolo',
          body: String.raw`Vicino a $0$ la potenza con esponente più piccolo è la più grande: $x$ è più grande di $x^2$, che è più grande di $x^3$. Quindi, se $f$ è una somma di potenze di $x$, domina il termine di grado minore:
$$x^{a}=o(x^{b})\qquad\text{se } a>b.$$

Per trovare ordine e parte principale si scrive l'equivalente di ogni addendo e si guarda quello di grado più basso.`,
        },
        {
          type: 'learn',
          title: 'Prima di concludere: controlla le cancellazioni',
          body: String.raw`>! Attenzione: se il termine di grado minore si **annulla**, conta il primo termine che non si annulla.

Esempio: $\sin 2x$ e $2x$ sono entrambi $\sim 2x$, ma la differenza $\sin 2x-2x$ ha ordine $3$ (vale $-\dfrac{4}{3}x^3+o(x^3)$, con lo sviluppo di Taylor di s10). Due addendi dello stesso ordine possono quindi cancellarsi.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Determina ordine e parte principale per $x\to0$ di $f(x)=\log(1+2x)+x^2$.`,
          steps: [
            String.raw`Il primo addendo è $\log(1+2x)\sim 2x$. Il secondo è $x^2=o(x)$, quindi è trascurabile.`,
            {
              text: String.raw`Quindi $f(x)\sim 2x$: il termine dominante ha grado $1$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Qual è l'ordine di infinitesimo di $f$?`,
                answer: '1',
                explain: String.raw`L'ordine è l'esponente del termine dominante: $2x$ ha esponente $1$.`,
              },
            },
            String.raw`La parte principale è il termine dominante, cioè $2x$.`,
          ],
          result: String.raw`$f(x)=\log(1+2x)+x^2$ ha ordine $1$ e parte principale $2x$.`,
        },
        {
          type: 'num',
          id: 's06.ordine.L1.e1',
          level: 1,
          prompt: String.raw`Qual è l'ordine di infinitesimo per $x\to0$ di $f(x)=x^3+4x$?`,
          answer: '1',
          explain: String.raw`Il termine $4x$ domina $x^3$, perché $x^3=o(x)$. L'ordine è $1$.`,
        },
        {
          type: 'mcq',
          id: 's06.ordine.L1.e2',
          level: 1,
          prompt: String.raw`Qual è la parte principale per $x\to0$ di $f(x)=\sin(5x)-x$?`,
          options: [String.raw`$4x$`, String.raw`$5x$`, String.raw`$-x$`],
          answer: 0,
          explain: String.raw`$\sin 5x-x\sim 5x-x=4x$. Sbagliata $5x$: dimentica il secondo addendo. Sbagliata $-x$: considera un solo addendo.`,
        },
        {
          type: 'tf',
          id: 's06.ordine.L1.e3',
          level: 1,
          prompt: String.raw`La funzione $\log(1+x^2)+x$ ha ordine $1$ e parte principale $x$.`,
          answer: true,
          explain: String.raw`$\log(1+x^2)\sim x^2=o(x)$, quindi $f(x)=x+o(x)$: parte principale $x$.`,
        },
        {
          type: 'num',
          id: 's06.ordine.L1.e4',
          level: 2,
          prompt: String.raw`Qual è l'ordine per $x\to0$ di $f(x)=1-\cos(3x)+x$?`,
          answer: '1',
          explain: String.raw`$1-\cos 3x\sim\dfrac{9x^2}{2}=o(x)$. Quindi $f\sim x$ e l'ordine è $1$.`,
        },
        {
          type: 'expr',
          id: 's06.ordine.L1.e5',
          level: 2,
          prompt: String.raw`Scrivi la parte principale per $x\to0$ di $f(x)=1-\cos(2x)+x^3$.`,
          answer: '2*x^2',
          vars: ['x'],
          explain: String.raw`$1-\cos 2x\sim\dfrac{(2x)^2}{2}=2x^2$, mentre $x^3=o(x^2)$. Parte principale: $2x^2$.`,
        },
        {
          type: 'order',
          id: 's06.ordine.L1.e6',
          level: 2,
          prompt: String.raw`Metti in ordine i passi per determinare ordine e parte principale di una somma di infinitesimi.`,
          steps: [
            String.raw`Scrivo l'equivalente $c\,x^{\alpha}$ di ogni addendo.`,
            String.raw`Confronto gli esponenti e tengo quello più piccolo.`,
            String.raw`Se due esponenti coincidono, sommo i coefficienti (se non si annullano).`,
            String.raw`Scrivo l'ordine $\alpha$ e la parte principale $c\,x^{\alpha}$.`,
          ],
          distractors: [String.raw`Scelgo il termine di grado più alto come parte principale.`],
          explain: String.raw`Vicino a $0$ domina il grado più basso, non quello più alto.`,
        },
        {
          type: 'problem',
          id: 's06.ordine.L1.e7',
          level: 2,
          points: 3,
          prompt: String.raw`Sia $f(x)=\sin(3x)-\log(1+x)$. Per $x\to0$ determina ordine e parte principale.`,
          parts: [
            {
              type: 'num',
              prompt: String.raw`Ordine di $f$.`,
              answer: '1',
              explain: String.raw`$\sin 3x\sim3x$ e $\log(1+x)\sim x$: non ci sono cancellazioni, il termine dominante è di grado $1$.`,
            },
            {
              type: 'expr',
              prompt: String.raw`Parte principale di $f$.`,
              answer: '2*x',
              vars: ['x'],
              explain: String.raw`$f(x)\sim 3x-x=2x$.`,
            },
          ],
          solution: String.raw`$f(x)=3x-x+o(x)=2x+o(x)$: l'ordine è $1$ e la parte principale è $2x$.`,
        },
        {
          type: 'tf',
          id: 's06.ordine.L1.e8',
          level: 1,
          prompt: String.raw`Se $f(x)\sim 2x^3$ per $x\to0$, allora $f$ ha ordine $3$.`,
          answer: true,
          explain: String.raw`La definizione di ordine chiede $f\sim c\,x^{\alpha}$ con $c\neq0$: qui $c=2$ e $\alpha=3$.`,
        },
      ],
    },
    {
      id: 's06.ordine.L2',
      title: 'Ordine con un parametro α',
      cards: [
        {
          type: 'learn',
          title: 'Quando l\'esponente dipende da α',
          body: String.raw`Se un addendo è $x^{\alpha}$ con $\alpha$ incognito, il suo ordine dipende da $\alpha$. Il metodo è sempre lo stesso:

1. scrivi ogni addendo come $c\,x^{\text{esponente}(\alpha)}$;
2. confronta gli esponenti **in funzione di $\alpha$**;
3. studia i casi: un esponente più piccolo domina; due esponenti uguali si sommano nei coefficienti;
4. verifica che la funzione sia infinitesima: il termine dominante deve avere esponente $>0$.`,
        },
        {
          type: 'learn',
          title: 'Esponenti uguali: si sommano i coefficienti',
          body: String.raw`>* Se due addendi hanno lo stesso esponente $\beta$, con coefficienti $c_1$ e $c_2$, la parte principale è $(c_1+c_2)\,x^{\beta}$.

Se $c_1+c_2=0$, il termine si annulla: bisogna guardare il termine successivo, cioè andare a un ordine più alto.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto (con un passo da completare)',
          problem: String.raw`Sia $f(x)=1+x^{\alpha}\sin(2x)-\cos x$. Per $x\to0$ determina ordine e parte principale, per $-1<\alpha<1$.`,
          steps: [
            String.raw`Separo la funzione in due parti: $f(x)=x^{\alpha}\sin(2x)+(1-\cos x)$. Con $\sin 2x\sim 2x$ si ha $x^{\alpha}\sin(2x)\sim 2x^{\alpha+1}$, e $1-\cos x\sim\dfrac{x^2}{2}$.`,
            {
              text: String.raw`Quindi $f(x)\sim 2x^{\alpha+1}+\dfrac{x^2}{2}$. Per $\alpha=0$ la funzione diventa $1+\sin 2x-\cos x$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Se $\alpha=0$, qual è l'ordine di $f$?`,
                answer: '1',
                explain: String.raw`Con $\alpha=0$ si ha $f\sim 2x+\dfrac{x^2}{2}\sim 2x$: ordine $1=\alpha+1$.`,
              },
            },
            String.raw`Per $-1<\alpha<1$ si ha $\alpha+1<2$: il termine $2x^{\alpha+1}$ domina $\dfrac{x^2}{2}$.`,
          ],
          result: String.raw`Per $-1<\alpha<1$: ordine $\alpha+1$ e parte principale $2x^{\alpha+1}$.`,
        },
        {
          type: 'interval',
          id: 's06.ordine.L2.e1',
          level: 2,
          prompt: String.raw`Per quali $\alpha$ la funzione $f(x)=1+x^{\alpha}\sin(2x)-\cos x$ è infinitesima per $x\to0$?`,
          answer: '(-1,+inf)',
          explain: String.raw`Serve $\alpha+1>0$, cioè che il termine $2x^{\alpha+1}$ vada a $0$. Per $\alpha=-1$ si ha $f\to2$; per $\alpha<-1$ la $f$ non tende a $0$.`,
        },
        {
          type: 'mcq',
          id: 's06.ordine.L2.e2',
          level: 2,
          prompt: String.raw`Per $\alpha=1$, qual è l'ordine di $f(x)=1+x\sin(2x)-\cos x$?`,
          options: ['$1$', '$2$', '$3$'],
          answer: 1,
          explain: String.raw`$x\sin 2x\sim 2x^2$ e $1-\cos x\sim\dfrac{x^2}{2}$: entrambi hanno esponente $2=\alpha+1$, quindi l'ordine è $2$. Sbagliata $1$: confonde $\alpha$ con $\alpha+1$. Sbagliata $3$: scambia $x\sin 2x$ per $x^3$.`,
        },
        {
          type: 'num',
          id: 's06.ordine.L2.e3',
          level: 2,
          prompt: String.raw`Per $\alpha=1$ la parte principale di $f(x)=1+x\sin(2x)-\cos x$ è $c\,x^2$. Quanto vale $c$?`,
          answer: '5/2',
          explain: String.raw`$2x^2+\dfrac{x^2}{2}=\dfrac52x^2$: i coefficienti si sommano perché gli esponenti coincidono.`,
        },
        {
          type: 'num',
          id: 's06.ordine.L2.e4',
          level: 2,
          prompt: String.raw`Per $\alpha>1$ la parte principale di $f(x)=1+x^{\alpha}\sin(2x)-\cos x$ è $c\,x^2$. Quanto vale $c$?`,
          answer: '1/2',
          explain: String.raw`Ora $\alpha+1>2$: il termine $2x^{\alpha+1}$ è $o(x^2)$, quindi resta solo $\dfrac{x^2}{2}$.`,
        },
        {
          type: 'expr',
          id: 's06.ordine.L2.e5',
          level: 2,
          prompt: String.raw`Scrivi la parte principale per $x\to0$ di $f(x)=1+x^{3}\sin(2x)-\cos x$.`,
          answer: 'x^2/2',
          vars: ['x'],
          explain: String.raw`Con $\alpha=3$ il termine $x^3\sin 2x\sim 2x^4=o(x^2)$. Resta $\dfrac{x^2}{2}$.`,
        },
        {
          type: 'tf',
          id: 's06.ordine.L2.e6',
          level: 2,
          prompt: String.raw`Per $\alpha=\tfrac12$ la funzione $1+x^{\alpha}\sin(2x)-\cos x$ ha parte principale $2x^{3/2}$.`,
          answer: true,
          explain: String.raw`Con $\alpha=\tfrac12$ si ha $\alpha+1=\tfrac32<2$: il termine $2x^{3/2}$ domina $\dfrac{x^2}{2}$.`,
        },
        {
          type: 'problem',
          id: 's06.ordine.L2.e7',
          level: 3,
          source: 'Itinere 15/01/2026 · Es. B2',
          points: 4,
          prompt: String.raw`Sia $f(x)=1+x^{\alpha}\sin(2x)-\cos x$. Determinare per quali $\alpha$ è infinitesima per $x\to0$, l'ordine e la parte principale.`,
          parts: [
            {
              type: 'interval',
              prompt: String.raw`Valori di $\alpha$ per cui $f$ è infinitesima.`,
              answer: '(-1,+inf)',
              explain: String.raw`$f\sim 2x^{\alpha+1}+\dfrac{x^2}{2}$: serve $\alpha+1>0$.`,
            },
            {
              type: 'mcq',
              prompt: String.raw`Se $-1<\alpha<1$, l'ordine di infinitesimo è:`,
              options: [String.raw`$\alpha+1$`, String.raw`$2$`, String.raw`$\alpha$`],
              answer: 0,
              explain: String.raw`Il termine $2x^{\alpha+1}$ domina $\dfrac{x^2}{2}$ quando $\alpha+1<2$, cioè $\alpha<1$.`,
            },
          ],
          solution: String.raw`$f$ è infinitesima per $\alpha>-1$. Per $-1<\alpha<1$: ordine $\alpha+1$, parte principale $2x^{\alpha+1}$. Per $\alpha=1$: ordine $2$, parte principale $\dfrac52x^2$. Per $\alpha>1$: ordine $2$, parte principale $\dfrac12x^2$.`,
        },
        {
          type: 'mcq',
          id: 's06.ordine.L2.e8',
          level: 3,
          prompt: String.raw`Per $\alpha=1$ l'ordine e la parte principale di $1+x^{\alpha}\sin(2x)-\cos x$ sono quelli di:`,
          options: [String.raw`ordine $1$, parte principale $2x$`, String.raw`ordine $2$, parte principale $\dfrac52x^2$`, String.raw`ordine $2$, parte principale $2x^2$`],
          answer: 1,
          explain: String.raw`Con $\alpha=1$ i due addendi hanno esponente $2$ e coefficienti $2$ e $\dfrac12$: la somma è $\dfrac52$. Sbagliata $2x^2$: dimentica il coefficiente $\dfrac12$ di $1-\cos x$.`,
        },
      ],
    },
    {
      id: 's06.ordine.L3',
      title: 'Cancellazioni e parametri: il secondo ordine',
      cards: [
        {
          type: 'learn',
          title: 'Gli sviluppi al secondo ordine',
          body: String.raw`Quando il primo ordine si cancella serve il secondo. Per $x\to0$ valgono:

- $\log(1+x)=x-\dfrac{x^2}{2}+o(x^2)$
- $e^x-1=x+\dfrac{x^2}{2}+o(x^2)$
- $\sin x=x+o(x^2)$
- $1-\cos x=\dfrac{x^2}{2}+o(x^2)$

Questi bastano per la maggior parte degli esercizi d'esame di questa sezione. Gli sviluppi completi sono in s10.`,
        },
        {
          type: 'learn',
          title: 'Parametro che cancella il primo ordine',
          body: String.raw`Se $f(x)=(1-a)x-\dfrac{x^2}{2}+o(x^2)$, la parte principale dipende da $a$:

- se $a\neq1$, il termine in $x$ non si annulla: ordine $1$ e parte principale $(1-a)x$;
- se $a=1$, il termine in $x$ sparisce: ordine $2$ e parte principale $-\dfrac{x^2}{2}$.

>! Errore tipico: fermarsi al primo ordine e scrivere "parte principale $0$" per $a=1$, dimenticando che il termine successivo non è nullo.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Sia $f(x)=\log(1+x)-ax$, con $a\in\mathbb R$. Determina ordine e parte principale per $x\to0$.`,
          steps: [
            String.raw`Uso $\log(1+x)=x-\dfrac{x^2}{2}+o(x^2)$: quindi $f(x)=(1-a)x-\dfrac{x^2}{2}+o(x^2)$.`,
            {
              text: String.raw`Il comportamento dipende da $a$. Prendo come esempio $a=3$: il termine in $x$ diventa $(1-3)x=-2x$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Per $a=3$, qual è l'ordine di $f$?`,
                answer: '1',
                explain: String.raw`Con $a=3$ si ha $f=-2x-\dfrac{x^2}{2}+o(x^2)$: il termine $-2x$ domina, quindi l'ordine è $1$.`,
              },
            },
            String.raw`Per $a=1$ il termine in $x$ si annulla: $f(x)=-\dfrac{x^2}{2}+o(x^2)$, ordine $2$ e parte principale $-\dfrac{x^2}{2}$.`,
          ],
          result: String.raw`Ordine $1$ e parte principale $(1-a)x$ se $a\neq1$; ordine $2$ e parte principale $-\dfrac{x^2}{2}$ se $a=1$.`,
        },
        {
          type: 'mcq',
          id: 's06.ordine.L3.e1',
          level: 2,
          prompt: String.raw`Per $a=2$, qual è la parte principale per $x\to0$ di $f(x)=\log(1+x)-2x$?`,
          options: [String.raw`$-x$`, String.raw`$-\dfrac{x^2}{2}$`, String.raw`$x$`],
          answer: 0,
          explain: String.raw`$f=x-\dfrac{x^2}{2}-2x+o(x^2)=-x-\dfrac{x^2}{2}+o(x^2)$: parte principale $-x$. Sbagliata $-\dfrac{x^2}{2}$: vale solo per $a=1$. Sbagliata $x$: dimentica il $-2$.`,
        },
        {
          type: 'interval',
          id: 's06.ordine.L3.e2',
          level: 2,
          prompt: String.raw`Per quali $a\in\mathbb R$ la funzione $f(x)=\log(1+x)-ax$ ha ordine $1$?`,
          answer: '(-inf,1)U(1,inf)',
          explain: String.raw`Ordine $1$ significa termine in $x$ non nullo: $1-a\neq0$, cioè $a\neq1$.`,
        },
        {
          type: 'num',
          id: 's06.ordine.L3.e3',
          level: 2,
          prompt: String.raw`Per $a=1$ la parte principale di $\log(1+x)-x$ è $c\,x^2$. Quanto vale $c$?`,
          answer: '-1/2',
          explain: String.raw`$\log(1+x)-x=-\dfrac{x^2}{2}+o(x^2)$, quindi $c=-\dfrac12$.`,
        },
        {
          type: 'mcq',
          id: 's06.ordine.L3.e4',
          level: 2,
          prompt: String.raw`Per $x\to0$, la funzione $\sin x-\log(1+x)$ ha ordine:`,
          options: ['$1$', '$2$', '$3$'],
          answer: 1,
          explain: String.raw`Il primo ordine si cancella ($x-x=0$). Con $\log(1+x)=x-\dfrac{x^2}{2}+o(x^2)$ e $\sin x=x+o(x^2)$ si ha $\sin x-\log(1+x)=\dfrac{x^2}{2}+o(x^2)$: ordine $2$.`,
        },
        {
          type: 'num',
          id: 's06.ordine.L3.e5',
          level: 2,
          prompt: String.raw`Per $x\to0$, $\sin x-\log(1+x)=c\,x^2+o(x^2)$. Quanto vale $c$?`,
          answer: '1/2',
          explain: String.raw`Dalla differenza dei due sviluppi, $c=\dfrac12$.`,
        },
        {
          type: 'tf',
          id: 's06.ordine.L3.e6',
          level: 1,
          prompt: String.raw`Per $x\to0$ vale $e^x-1=x+\dfrac{x^2}{2}+o(x^2)$.`,
          answer: true,
          explain: String.raw`È lo sviluppo al secondo ordine dell'esponenziale: il termine $\dfrac{x^2}{2}$ è il secondo addendo.`,
        },
        {
          type: 'order',
          id: 's06.ordine.L3.e7',
          level: 3,
          prompt: String.raw`Metti in ordine i passi per trovare l'ordine di $f(x)=\log(1+x)-ax$ al variare di $a$.`,
          steps: [
            String.raw`Sviluppo ogni addendo fino all'ordine necessario.`,
            String.raw`Scrivo $f$ come $(1-a)x+c\,x^2+o(x^2)$.`,
            String.raw`Studio il caso $1-a\neq0$: ordine $1$.`,
            String.raw`Studio il caso $a=1$: il primo termine si annulla e l'ordine è $2$.`,
          ],
          distractors: [String.raw`Scelgo subito $a=1$ senza studiare i casi.`],
          explain: String.raw`Il caso $a=1$ va studiato dopo quello generale, non al posto suo.`,
        },
        {
          type: 'open',
          id: 's06.ordine.L3.e8',
          level: 3,
          points: 2,
          prompt: String.raw`Perché due addendi dello stesso ordine possono dare una somma di ordine più alto? Fai un esempio.`,
          answer: String.raw`Se $f=c_1x^{\beta}+c_2x^{\beta}+\dots$, la parte principale è $(c_1+c_2)x^{\beta}$. Se $c_1+c_2=0$ il termine si annulla e l'ordine sale. Esempio: $\log(1+x)-\sin x=\left(x-\dfrac{x^2}{2}\right)-x+o(x^2)=-\dfrac{x^2}{2}+o(x^2)$: il primo ordine si cancella e l'ordine è $2$.`,
          rubric: [
            'Se i coefficienti dello stesso esponente sommano a zero il termine sparisce',
            'In quel caso l\'ordine di infinitesimo cresce',
            'Esempio corretto (per esempio log(1+x) - sin x)',
            'Risultato corretto: ordine 2 con parte principale -x^2/2',
          ],
        },
        {
          type: 'problem',
          id: 's06.ordine.L3.e9',
          level: 3,
          points: 4,
          prompt: String.raw`Sia $f(x)=\log(1+x)-ax$, con $a\in\mathbb R$. (a) Per quali $a$ l'ordine di infinitesimo è $1$? (b) Per $a=1$ determina ordine e parte principale.`,
          parts: [
            {
              type: 'interval',
              prompt: String.raw`(a) Valori di $a$ con ordine $1$.`,
              answer: '(-inf,1)U(1,inf)',
              explain: String.raw`Serve $1-a\neq0$.`,
            },
            {
              type: 'mcq',
              prompt: String.raw`(b) Ordine di $f$ per $a=1$.`,
              options: ['$1$', '$2$', '$3$'],
              answer: 1,
              explain: String.raw`Con $a=1$ il primo ordine si annulla e $f=-\dfrac{x^2}{2}+o(x^2)$.`,
            },
            {
              type: 'num',
              prompt: String.raw`(b) Coefficiente $c$ della parte principale $c\,x^2$.`,
              answer: '-1/2',
              explain: String.raw`$c=-\dfrac12$.`,
            },
          ],
          solution: String.raw`(a) $1-a\neq0$, cioè $a\neq1$. (b) Per $a=1$: $f(x)=-\dfrac{x^2}{2}+o(x^2)$: ordine $2$, parte principale $-\dfrac{x^2}{2}$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's06.ordine.gen-parametro', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.pick([-3, -2, -1, 2, 3]);
        const sgn = a < 0 ? '+' : '-';
        const mag = Math.abs(a) === 1 ? '' : String(Math.abs(a));
        return {
          type: 'expr',
          prompt: String.raw`Per $x\to0$ determina la parte principale di $f(x)=\log(1+x)${sgn}${mag}x$.`,
          answer: `${1 - a}*x`,
          vars: ['x'],
          explain: String.raw`Con $\log(1+x)=x-\dfrac{x^2}{2}+o(x^2)$ si ha $f(x)=${lx(1 - a)}+o(x)$: l'ordine è $1$ e la parte principale è $${lx(1 - a)}$.`,
        };
      },
    },
    {
      id: 's06.ordine.gen-potenze', type: 'gen', level: 2,
      gen: (R) => {
        const q = R.int(0, 3);
        let p = R.int(1, 4);
        if (p === q + 1) p += 1;
        const k = R.nz(-3, 3);
        const ord = Math.min(p, q + 1);
        return {
          type: 'num',
          prompt: String.raw`Determina l'ordine di infinitesimo per $x\to0$ di $f(x)=${xk(p)}${sg(k)}${H.coef(k)}${xk(q)}\sin x$.`,
          answer: String(ord),
          explain: String.raw`Il secondo addendo è $\sim ${H.coef(k)}${xk(q + 1)}$, perché $\sin x\sim x$. Vince l'esponente più piccolo: $\min(${p},${q + 1})=${ord}$, quindi l'ordine è $${ord}$.`,
        };
      },
    },
    {
      id: 's06.ordine.gen-coseno', type: 'gen', level: 2,
      gen: (R) => {
        const k = R.int(0, 3);
        const b = R.nz(-3, 3);
        const c = H.frac(b * b, 2);
        return {
          type: 'num',
          prompt: String.raw`Determina l'ordine di infinitesimo per $x\to0$ di $f(x)=${xk(k)}\left(1-\cos(${lx(b)})\right)$.`,
          answer: String(k + 2),
          explain: String.raw`$1-\cos(${lx(b)})\sim\dfrac{(${lx(b)})^2}{2}=${c}x^2$, quindi $f\sim ${c}${xk(k + 2)}$: ordine $${k + 2}$.`,
        };
      },
    },
    {
      id: 's06.ordine.gen-somma', type: 'gen', level: 2,
      gen: (R) => {
        const A = R.nz(-3, 3), a = R.nz(-3, 3), B = R.nz(-3, 3);
        let b = R.nz(-3, 3);
        const Bc = A * a + B * b === 0 ? 2 * B : B;
        const L = A * a + Bc * b;
        return {
          type: 'expr',
          prompt: String.raw`Per $x\to0$ determina la parte principale di $f(x)=${H.coef(A)}\sin(${lx(a)})${sg(Bc)}${H.coef(Bc)}\log(1${sg(b)}${lx(b)})$.`,
          answer: `${L}*x`,
          vars: ['x'],
          explain: String.raw`$\sin(${lx(a)})\sim ${lx(a)}$ e $\log(1${sg(b)}${lx(b)})\sim ${lx(b)}$: $f(x)\sim ${L}x$. L'ordine è $1$ e la parte principale è $${lx(L)}$.`,
        };
      },
    },
    {
      id: 's06.ordine.p1', type: 'mcq', level: 1,
      prompt: String.raw`Qual è l'ordine di infinitesimo di $f(x)=x^3+4x$ per $x\to0$?`,
      options: [String.raw`$1$`, String.raw`$3$`, String.raw`$\dfrac12$`],
      answer: 0,
      explain: String.raw`Il termine $4x$ domina $x^3$: l'ordine è $1$ e la parte principale è $4x$.`,
    },
    {
      id: 's06.ordine.p2', type: 'num', level: 1,
      prompt: String.raw`Qual è l'ordine per $x\to0$ di $\sin(5x)-x$?`,
      answer: '1',
      explain: String.raw`$\sin 5x-x\sim 4x$: ordine $1$.`,
    },
    {
      id: 's06.ordine.p3', type: 'tf', level: 1,
      prompt: String.raw`La funzione $\log(1+x^2)+x$ ha ordine $1$ e parte principale $x$.`,
      answer: true,
      explain: String.raw`$\log(1+x^2)\sim x^2=o(x)$, quindi $f=x+o(x)$.`,
    },
    {
      id: 's06.ordine.p4', type: 'expr', level: 2,
      prompt: String.raw`Scrivi la parte principale per $x\to0$ di $1-\cos(2x)+x^3$.`,
      answer: '2*x^2',
      vars: ['x'],
      explain: String.raw`$1-\cos 2x\sim\dfrac{(2x)^2}{2}=2x^2$, mentre $x^3=o(x^2)$.`,
    },
    {
      id: 's06.ordine.p5', type: 'match', level: 2,
      prompt: String.raw`Abbina ogni funzione alla sua parte principale per $x\to0$.`,
      pairs: [
        [String.raw`$x^3+2x$`, String.raw`$2x$`],
        [String.raw`$\sin^2x+x^4$`, String.raw`$x^2$`],
        [String.raw`$\log(1+x)+x^2$`, String.raw`$x$`],
        [String.raw`$e^{x^3}-1+3x^2$`, String.raw`$3x^2$`],
      ],
      explain: String.raw`Ogni termine di grado più alto è $o$ del termine dominante: $\sin^2x\sim x^2$, $\log(1+x)\sim x$, $e^{x^3}-1\sim x^3=o(x^2)$.`,
    },
    {
      id: 's06.ordine.p6', type: 'mcq', level: 2,
      prompt: String.raw`Per $\alpha=2$, qual è l'ordine di $f(x)=1+x^{\alpha}\sin(2x)-\cos x$?`,
      options: ['$1$', '$2$', '$3$'],
      answer: 1,
      explain: String.raw`$x^2\sin 2x\sim 2x^3=o(x^2)$ e $1-\cos x\sim\dfrac{x^2}{2}$: l'ordine è $2$, con parte principale $\dfrac{x^2}{2}$.`,
    },
    {
      id: 's06.ordine.p7', type: 'num', level: 2,
      prompt: String.raw`Per $\alpha=1$ la parte principale di $1+x\sin(2x)-\cos x$ è $c\,x^2$. Quanto vale $c$?`,
      answer: '5/2',
      explain: String.raw`$2x^2+\dfrac{x^2}{2}=\dfrac52x^2$.`,
    },
    {
      id: 's06.ordine.p8', type: 'interval', level: 2,
      prompt: String.raw`Per quali $\alpha$ la funzione $1+x^{\alpha}\sin(2x)-\cos x$ è infinitesima per $x\to0$?`,
      answer: '(-1,+inf)',
      explain: String.raw`Serve $\alpha+1>0$: per $\alpha=-1$ la funzione tende a $2$.`,
    },
    {
      id: 's06.ordine.p9', type: 'cloze', level: 1,
      text: String.raw`Per $x\to0^+$, la funzione $f(x)=\sqrt{x}+x^3$ ha ordine [[0]].`,
      blanks: [
        { options: [String.raw`$\dfrac12$`, String.raw`$1$`, String.raw`$3$`], answer: 0 },
      ],
      explain: String.raw`$\sqrt x=x^{1/2}$ domina $x^3$: l'ordine è $\dfrac12$.`,
    },
    {
      id: 's06.ordine.p10', type: 'tf', level: 2,
      prompt: String.raw`Se $f=o(x^2)$ per $x\to0$, allora $f+3x^2$ ha parte principale $3x^2$.`,
      answer: true,
      explain: String.raw`$f+3x^2=3x^2+o(x^2)$: la parte principale è $3x^2$.`,
    },
    {
      id: 's06.ordine.p11', type: 'mcq', level: 3,
      prompt: String.raw`Per $a=1$, la funzione $\log(1+x)-x$ ha:`,
      options: [
        String.raw`ordine $1$, parte principale $-x$`,
        String.raw`ordine $2$, parte principale $-\dfrac{x^2}{2}$`,
        String.raw`ordine $2$, parte principale $\dfrac{x^2}{2}$`,
      ],
      answer: 1,
      explain: String.raw`Il termine in $x$ si cancella: $\log(1+x)-x=-\dfrac{x^2}{2}+o(x^2)$.`,
    },
  ],
  flashcards: [
    {
      id: 's06.ordine.fc1', kind: 'def',
      front: String.raw`Che cosa significa che $f$ ha ordine $\alpha$ per $x\to0$?`,
      back: String.raw`Che esiste $c\neq0$ con $f(x)\sim c\,x^{\alpha}$ (con $\alpha>0$). Il termine $c\,x^{\alpha}$ è la parte principale.`,
    },
    {
      id: 's06.ordine.fc2', kind: 'metodo',
      front: String.raw`Come si trova l'ordine di una somma di infinitesimi?`,
      back: String.raw`Si scrive l'equivalente di ogni addendo. Vince l'esponente più piccolo. Se due esponenti coincidono si sommano i coefficienti (se la somma è zero, si va all'ordine successivo).`,
    },
    {
      id: 's06.ordine.fc3', kind: 'formula',
      front: String.raw`Sviluppi al secondo ordine per $x\to0$`,
      back: String.raw`$\log(1+x)=x-\dfrac{x^2}{2}+o(x^2)$; $e^x-1=x+\dfrac{x^2}{2}+o(x^2)$; $\sin x=x+o(x^2)$; $1-\cos x=\dfrac{x^2}{2}+o(x^2)$.`,
    },
    {
      id: 's06.ordine.fc4', kind: 'metodo',
      front: String.raw`Procedura per l'ordine con un parametro $\alpha$`,
      back: String.raw`1) Scrivi ogni addendo come $c\,x^{\text{esponente}(\alpha)}$. 2) Confronta gli esponenti in funzione di $\alpha$. 3) Studia i casi di uguaglianza. 4) Verifica che il termine dominante abbia esponente positivo.`,
    },
    {
      id: 's06.ordine.fc5', kind: 'errore',
      front: String.raw`Errore tipico: parte principale nulla quando due termini si annullano`,
      back: String.raw`Se $\log(1+x)-x$ ha il primo ordine nullo, la parte principale non è $0$: l'ordine sale a $2$ e la parte principale è $-\dfrac{x^2}{2}$.`,
    },
    {
      id: 's06.ordine.fc6', kind: 'formula',
      front: String.raw`Ordine di $1-\cos(bx)$ per $x\to0$ ($b\neq0$)`,
      back: String.raw`Ordine $2$, parte principale $\dfrac{b^2}{2}x^2$.`,
    },
  ],
});

// ===========================================================================
// s06.gerarchia · Confronto, gerarchia degli infiniti, stime asintotiche
// ===========================================================================
SKILLS.push({
  id: 's06.gerarchia',
  title: 'Gerarchia e stime asintotiche',
  summary: String.raw`Confrontare la velocità di crescita di potenze, logaritmi ed esponenziali, stimare somme e radici per $x\to+\infty$ e $n\to\infty$ e usare le stime nelle serie.`,
  prereq: ['s06.o', 's04.monotone', 's05.notevoli'],
  examRefs: ['Itinere 11/11/2025 · Es. B4', 'Appello 10/02/2026 · Es. B3'],
  lessons: [
    {
      id: 's06.gerarchia.L1',
      title: 'Gerarchia degli infiniti',
      cards: [
        {
          type: 'learn',
          title: 'Chi cresce più in fretta',
          body: String.raw`Per $x\to+\infty$ alcune funzioni crescono molto più in fretta di altre. Si scrive $f\ll g$ se $\dfrac{f}{g}\to0$: $g$ cresce molto più in fretta di $f$. La gerarchia è

$$\log x\ \ll\ x^{\alpha}\ \ll\ b^{x}\ \ll\ x^{x}\qquad(\alpha>0,\ b>1).$$

Il logaritmo è lentissimo: ogni potenza positiva di $x$ lo batte. L'esponenziale batte ogni potenza, qualunque sia l'esponente.`,
        },
        {
          type: 'learn',
          title: 'Nella somma vince il dominante',
          body: String.raw`Se $f\ll g$ per $x\to+\infty$, allora $f+g\sim g$: nella somma vince il termine dominante. Esempi:

- $x^3+\log x\sim x^3$;
- $x^2+x^2\log x\sim x^2\log x$, perché $x^2=o(x^2\log x)$.

Quindi nei limiti a $\infty$ si può trascurare il termine più piccolo, ma non i termini dello stesso ordine di grandezza.`,
        },
        {
          type: 'learn',
          title: 'Vicino a 0: il logaritmo perde contro le potenze',
          body: String.raw`Per $x\to0^+$ il logaritmo tende a $-\infty$, ma le potenze positive di $x$ lo battono: $x^{\alpha}\log x\to0$ per ogni $\alpha>0$. In particolare $x\log x\to0$ e $\sqrt{x}\,\log x\to0$.

Questo è lo stesso fatto della gerarchia, letto con $x\to0^+$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{x^3+2^x}{x^5+\log x}$.`,
          steps: [
            String.raw`Al numeratore domina $2^x$: un esponenziale batte ogni potenza. Il numeratore è $\sim 2^x$.`,
            {
              text: String.raw`Al denominatore domina $x^5$, perché $\log x=o(x^5)$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`A cosa è equivalente il denominatore $x^5+\log x$ per $x\to+\infty$?`,
                answer: 'x^5',
                vars: ['x'],
                explain: String.raw`Nella somma vince il termine dominante: $x^5+\log x\sim x^5$.`,
              },
            },
            String.raw`Il rapporto è $\sim\dfrac{2^x}{x^5}\to+\infty$, perché l'esponenziale batte la potenza.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to+\infty}\frac{x^3+2^x}{x^5+\log x}=+\infty$`,
        },
        {
          type: 'num',
          id: 's06.gerarchia.L1.e1',
          level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{\log x}{\sqrt{x}}$.`,
          answer: '0',
          explain: String.raw`Il logaritmo è $o$ di ogni potenza positiva di $x$: qui $\sqrt x=x^{1/2}$. Il limite è $0$.`,
        },
        {
          type: 'mcq',
          id: 's06.gerarchia.L1.e2',
          level: 1,
          prompt: String.raw`Per $x\to+\infty$, quale funzione cresce più in fretta?`,
          options: [String.raw`$x^{100}$`, String.raw`$2^{x}$`, String.raw`$x^{100}\log x$`],
          answer: 1,
          explain: String.raw`$2^x$ batte qualunque potenza, anche $x^{100}$. Sbagliate le altre due: sono potenze (con un logaritmo) e crescono più lentamente.`,
        },
        {
          type: 'mcq',
          id: 's06.gerarchia.L1.e3',
          level: 2,
          prompt: String.raw`Per $x\to+\infty$, quale affermazione è vera?`,
          options: [String.raw`$x^{3}\ll\log x$`, String.raw`$\log x\ll x^{3}$`, String.raw`$x^{3}\sim\log x$`],
          answer: 1,
          explain: String.raw`$\dfrac{\log x}{x^3}\to0$: il logaritmo è trascurabile. Sbagliata la prima: il rapporto $\dfrac{x^3}{\log x}\to+\infty$. Sbagliata la terza: il rapporto $\dfrac{x^3}{\log x}$ non tende a $1$.`,
        },
        {
          type: 'tf',
          id: 's06.gerarchia.L1.e4',
          level: 2,
          prompt: String.raw`Per $x\to0^+$ vale $x\log x\to0$.`,
          answer: true,
          explain: String.raw`Una potenza positiva di $x$ batte il logaritmo: $x^{\alpha}\log x\to0$ con $\alpha=1$.`,
        },
        {
          type: 'num',
          id: 's06.gerarchia.L1.e5',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0^+}x^{2}\log x$.`,
          answer: '0',
          explain: String.raw`$x^2\log x\to0$, perché la potenza $x^2$ batte il logaritmo.`,
        },
        {
          type: 'num',
          id: 's06.gerarchia.L1.e6',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{x^{4}-3^{x}}{x^{4}+2^{x}}$.`,
          answer: '-inf',
          explain: String.raw`Il numeratore è $\sim-3^x$ e il denominatore è $\sim 2^x$: il rapporto è $\sim-\left(\tfrac32\right)^x\to-\infty$.`,
        },
        {
          type: 'order',
          id: 's06.gerarchia.L1.e7',
          level: 2,
          prompt: String.raw`Ordina per $x\to+\infty$ le funzioni dalla più lenta alla più veloce.`,
          steps: [
            String.raw`$\log x$`,
            String.raw`$\sqrt{x}$`,
            String.raw`$x^{2}$`,
            String.raw`$2^{x}$`,
          ],
          explain: String.raw`Prima il logaritmo, poi le potenze in ordine di esponente, infine l'esponenziale: $\log x\ll\sqrt x\ll x^2\ll 2^x$.`,
        },
      ],
    },
    {
      id: 's06.gerarchia.L2',
      title: 'Stime asintotiche con radici e frazioni',
      cards: [
        {
          type: 'learn',
          title: 'Equivalenza a infinito',
          body: String.raw`Per $x\to+\infty$ (o per $n\to\infty$) si scrive $f\sim g$ se $\dfrac{f}{g}\to1$. Esempi:

- $x^2+3x\sim x^2$, perché $\dfrac{x^2+3x}{x^2}=1+\dfrac3x\to1$;
- $\sqrt{x^2+x}\sim x$, perché $\dfrac{\sqrt{x^2+x}}{x}=\sqrt{1+\dfrac1x}\to1$.`,
          plot: { fns: ['sqrt(x^2+x)', 'x'], x: [0, 5], y: [0, 6] },
        },
        {
          type: 'learn',
          title: 'Raccogli il termine dominante',
          body: String.raw`Per stimare un quoziente di somme a $\infty$, raccogli la potenza dominante sia al numeratore sia al denominatore:

$$\frac{3x^2+x}{5x^2-\sqrt{x}}=\frac{x^2\left(3+\frac1x\right)}{x^2\left(5-x^{-3/2}\right)}\longrightarrow\frac35.$$

I termini raccolti tendono a zero: il limite è il rapporto dei coefficienti dominanti.`,
        },
        {
          type: 'learn',
          title: 'Attenzione: le differenze di radici',
          body: String.raw`>! Attenzione: in una differenza, due termini dominanti uguali possono annullarsi. Da $\sqrt{n^2+n}\sim n$ **non** segue $\sqrt{n^2+n}-n\sim0$: i termini principali si cancellano.

Bisogna razionalizzare:
$$\sqrt{n^2+n}-n=\frac{n}{\sqrt{n^2+n}+n}=\frac{1}{\sqrt{1+\frac1n}+1}\longrightarrow\frac12.$$`,
        },
        {
          type: 'example',
          title: 'Esempio svolto (con un passo da completare)',
          problem: String.raw`Calcola $\displaystyle\lim_{n\to\infty}n\left(\sqrt{1+\frac1n}-1\right)$.`,
          steps: [
            String.raw`La differenza di radici si razionalizza: $\sqrt{1+\frac1n}-1=\dfrac{1/n}{\sqrt{1+\frac1n}+1}$.`,
            {
              text: String.raw`Quindi $n\left(\sqrt{1+\frac1n}-1\right)=\dfrac{1}{\sqrt{1+\frac1n}+1}$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale il limite per $n\to\infty$ di $\dfrac{1}{\sqrt{1+\frac1n}+1}$?`,
                answer: '1/2',
                explain: String.raw`Per $n\to\infty$ si ha $\dfrac1n\to0$, quindi il denominatore tende a $2$.`,
              },
            },
          ],
          result: String.raw`$\displaystyle\lim_{n\to\infty}n\left(\sqrt{1+\frac1n}-1\right)=\frac12$`,
        },
        {
          type: 'num',
          id: 's06.gerarchia.L2.e1',
          level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to\infty}\frac{3n^2-n}{2n^2+5}$.`,
          answer: '3/2',
          explain: String.raw`Raccolgo $n^2$: $\dfrac{n^2(3-\frac1n)}{n^2(2+\frac5{n^2})}\to\dfrac32$.`,
        },
        {
          type: 'mcq',
          id: 's06.gerarchia.L2.e2',
          level: 2,
          prompt: String.raw`Quale affermazione è vera per $n\to\infty$?`,
          options: [String.raw`$\sqrt{n^2+n}\sim n$`, String.raw`$\sqrt{n^2+1}\sim n^2$`, String.raw`$\sqrt{n^2+n}-n\sim n$`],
          answer: 0,
          explain: String.raw`Vera: $\dfrac{\sqrt{n^2+n}}{n}=\sqrt{1+\frac1n}\to1$. Sbagliata $\sqrt{n^2+1}\sim n^2$: la radice è $\sim n$, non $n^2$. Sbagliata la terza: $\sqrt{n^2+n}-n\to\frac12$, quindi non è $\sim n$.`,
        },
        {
          type: 'tf',
          id: 's06.gerarchia.L2.e3',
          level: 2,
          prompt: String.raw`Per $n\to\infty$ si ha $\sqrt{n^2+n}-n\to0$.`,
          answer: false,
          explain: String.raw`Il limite vale $\dfrac12$: i termini principali si cancellano, quindi bisogna razionalizzare.`,
        },
        {
          type: 'num',
          id: 's06.gerarchia.L2.e4',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{x^2+\sin x}{x^2+1}$.`,
          answer: '1',
          explain: String.raw`$\sin x$ è limitato, quindi $\dfrac{\sin x}{x^2}\to0$: il limite è $1$.`,
        },
        {
          type: 'expr',
          id: 's06.gerarchia.L2.e5',
          level: 2,
          prompt: String.raw`Scrivi l'equivalente di $\sqrt{x^2+3}$ per $x\to+\infty$.`,
          answer: 'x',
          vars: ['x'],
          explain: String.raw`$\dfrac{\sqrt{x^2+3}}{x}=\sqrt{1+\frac{3}{x^2}}\to1$: quindi $\sqrt{x^2+3}\sim x$.`,
        },
        {
          type: 'num',
          id: 's06.gerarchia.L2.e6',
          level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{\sqrt{x^2+3}}{x+1}$.`,
          answer: '1',
          explain: String.raw`Al numeratore $\sqrt{x^2+3}\sim x$ e al denominatore $x+1\sim x$: il rapporto va a $1$.`,
        },
        {
          type: 'problem',
          id: 's06.gerarchia.L2.e7',
          level: 2,
          source: 'Itinere 11/11/2025 · Es. B4',
          points: 4,
          prompt: String.raw`Calcola i limiti delle successioni $a_n=\dfrac{\log(n+1)}{n^{1/3}}$, $b_n=\left(1+\dfrac2n\right)^{n/2}$, $c_n=n\left(\sqrt{1+\dfrac1n}-1\right)$.`,
          parts: [
            {
              type: 'num',
              prompt: String.raw`Limite di $a_n$.`,
              answer: '0',
              explain: String.raw`Il logaritmo è $o$ di ogni potenza positiva di $n$: il limite è $0$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Limite di $b_n$.`,
              answer: 'e',
              explain: String.raw`Con $m=\dfrac n2\to\infty$ si ha $\left(1+\dfrac1m\right)^{m}\to e$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Limite di $c_n$.`,
              answer: '1/2',
              explain: String.raw`Razionalizzando: $c_n=\dfrac{1}{\sqrt{1+\frac1n}+1}\to\dfrac12$.`,
            },
          ],
          solution: String.raw`$a_n\to0$; $b_n\to e$; $c_n=\dfrac{1}{\sqrt{1+\frac1n}+1}\to\dfrac12$.`,
        },
      ],
    },
    {
      id: 's06.gerarchia.L3',
      title: 'Stime per le serie e parametri',
      cards: [
        {
          type: 'learn',
          title: 'Il metodo: stimare il termine e leggere l\'esponente',
          body: String.raw`Per una serie a termini positivi, se $a_n\sim c\,n^{\gamma}$ con $c>0$, la serie $\sum a_n$ ha lo stesso carattere di $\sum n^{\gamma}$. Per la serie armonica generalizzata:
$$\sum_{n\ge1}n^{\gamma}\ \text{converge}\iff \gamma<-1.$$

Quindi basta stimare il termine generale con un'espressione $c\,n^{\gamma}$ e leggere l'esponente $\gamma$. Il valore di $c$ non conta, purché sia diverso da $0$.`,
        },
        {
          type: 'learn',
          title: 'Stimare una differenza di radici',
          body: String.raw`Per $n\to\infty$ si ha, usando $(1+t)^{\alpha}-1\sim\alpha t$ con $t=\frac1n$:
$$(n^3+n^2)^{1/5}-n^{3/5}=n^{3/5}\left[\left(1+\tfrac1n\right)^{1/5}-1\right]\sim\frac15\,n^{3/5}\cdot\frac1n=\frac15\,n^{-2/5}.$$

Il numeratore è dunque $\sim\dfrac15 n^{-2/5}$: l'esponente $-\frac25$ è quello che conta per la serie.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto',
          problem: String.raw`Stima il termine $a_n=\dfrac{(n^3+n^2)^{1/5}-n^{3/5}}{\log\left(1+\dfrac{2}{n^2}\right)}$ per $n\to\infty$.`,
          steps: [
            String.raw`Il numeratore è $\sim\dfrac15 n^{-2/5}$ (vedi la card precedente).`,
            {
              text: String.raw`Per il denominatore si usa $\log(1+t)\sim t$ con $t=\dfrac{2}{n^2}\to0$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`A cosa è equivalente $\log\left(1+\dfrac{2}{n^2}\right)$ per $n\to\infty$?`,
                answer: '2/n^2',
                vars: ['n'],
                explain: String.raw`Con $t=\dfrac2{n^2}\to0$ si ha $\log(1+t)\sim t$, cioè $\dfrac{2}{n^2}$.`,
              },
            },
            String.raw`Il rapporto è $\sim\dfrac{\frac15 n^{-2/5}}{2n^{-2}}=\dfrac1{10}\,n^{8/5}$.`,
          ],
          result: String.raw`$a_n\sim\dfrac1{10}\,n^{8/5}$ per $n\to\infty$.`,
        },
        {
          type: 'num',
          id: 's06.gerarchia.L3.e1',
          level: 2,
          prompt: String.raw`Nell'esempio, $a_n\sim c\,n^{\gamma}$ con $c\neq0$. Quanto vale $\gamma$?`,
          answer: '8/5',
          explain: String.raw`Dall'esempio, $a_n\sim\dfrac1{10}n^{8/5}$: l'esponente è $\dfrac85$.`,
        },
        {
          type: 'interval',
          id: 's06.gerarchia.L3.e2',
          level: 2,
          prompt: String.raw`Per quali $\alpha\in\mathbb R$ converge $\displaystyle\sum_{n\ge1}n^{\alpha}a_n$, con $a_n$ dell'esempio?`,
          answer: '(-inf,-13/5)',
          explain: String.raw`Il termine è $\sim\dfrac1{10}n^{\alpha+8/5}$: la serie converge sse $\alpha+\dfrac85<-1$, cioè $\alpha<-\dfrac{13}{5}$.`,
        },
        {
          type: 'num',
          id: 's06.gerarchia.L3.e3',
          level: 2,
          prompt: String.raw`Determina l'esponente $\gamma$ tale che $\dfrac{\sqrt[3]{n^2+1}}{n}\sim c\,n^{\gamma}$ per $n\to\infty$.`,
          answer: '-1/3',
          explain: String.raw`$\sqrt[3]{n^2+1}\sim n^{2/3}$, quindi il quoziente è $\sim n^{2/3-1}=n^{-1/3}$.`,
        },
        {
          type: 'tf',
          id: 's06.gerarchia.L3.e4',
          level: 2,
          prompt: String.raw`Se $a_n\sim b_n$ con $a_n,b_n>0$ e $\sum b_n$ diverge, allora $\sum a_n$ diverge.`,
          answer: true,
          explain: String.raw`È il confronto asintotico per termini positivi: le due serie hanno lo stesso carattere.`,
        },
        {
          type: 'order',
          id: 's06.gerarchia.L3.e5',
          level: 3,
          prompt: String.raw`Metti in ordine i passi per studiare la convergenza di una serie con un parametro.`,
          steps: [
            String.raw`Stimo ogni fattore del termine generale con un equivalente $c\,n^{\beta}$.`,
            String.raw`Sommo gli esponenti per ottenere l'esponente $\gamma$ del termine.`,
            String.raw`Applico la serie armonica generalizzata: converge se $\gamma<-1$.`,
          ],
          distractors: [String.raw`Concludo la convergenza guardando la sola forma del termine, senza stimarlo.`],
          explain: String.raw`Il passo sbagliato è concludere senza stimare il termine generale.`,
        },
        {
          type: 'open',
          id: 's06.gerarchia.L3.e6',
          level: 3,
          points: 2,
          prompt: String.raw`Perché, per una serie a termini positivi, basta conoscere l'esponente $\gamma$ del termine $a_n\sim c\,n^{\gamma}$ per decidere la convergenza?`,
          answer: String.raw`Per il confronto asintotico: se $a_n\sim c\,n^{\gamma}$ con $c>0$, le serie $\sum a_n$ e $\sum n^{\gamma}$ hanno lo stesso carattere. La serie armonica generalizzata $\sum n^{\gamma}$ converge se e solo se $\gamma<-1$, quindi si conclude da $\gamma$.`,
          rubric: [
            'Enuncia il confronto asintotico per termini positivi',
            'Ricorda la serie armonica generalizzata: converge sse esponente minore di -1',
            'Conclude correttamente dal solo esponente',
          ],
        },
        {
          type: 'problem',
          id: 's06.gerarchia.L3.e7',
          level: 3,
          source: 'Appello 10/02/2026 · Es. B3',
          points: 4,
          prompt: String.raw`Per $\alpha\in\mathbb R$ studia la convergenza di $\displaystyle\sum_{n\ge1}\frac{n^{\alpha}\left[(2n^3+n^2)^{1/5}-(2n^3)^{1/5}\right]}{\log\left(1+\tan\dfrac{2}{n^2}\right)}$ (termini positivi).`,
          parts: [
            {
              type: 'num',
              prompt: String.raw`Esponente $\beta$ tale che il numeratore (senza $n^{\alpha}$) è $\sim c\,n^{\beta}$.`,
              answer: '-2/5',
              explain: String.raw`$(2n^3+n^2)^{1/5}-(2n^3)^{1/5}\sim\dfrac{2^{1/5}}{10}\,n^{-2/5}$.`,
            },
            {
              type: 'num',
              prompt: String.raw`Esponente $\gamma$ tale che il denominatore è $\sim c'\,n^{\gamma}$.`,
              answer: '-2',
              explain: String.raw`$\log\left(1+\tan\dfrac2{n^2}\right)\sim\tan\dfrac2{n^2}\sim\dfrac2{n^2}$: esponente $-2$.`,
            },
            {
              type: 'interval',
              prompt: String.raw`Valori di $\alpha$ per cui la serie converge.`,
              answer: '(-inf,-13/5)',
              explain: String.raw`Il termine è $\sim c\,n^{\alpha-\frac25+2}=c\,n^{\alpha+\frac85}$ con $c>0$: converge sse $\alpha+\dfrac85<-1$.`,
            },
          ],
          solution: String.raw`Il numeratore è $\sim\dfrac{2^{1/5}}{10}n^{-2/5}$ e il denominatore è $\sim\dfrac{2}{n^2}$: il termine è $\sim c\,n^{\alpha+8/5}$ con $c=\dfrac{2^{1/5}}{20}>0$. La serie converge sse $\alpha<-\dfrac{13}{5}$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's06.gerarchia.gen-rapporto-potenze', type: 'gen', level: 2,
      gen: (R) => {
        const p = R.int(1, 3), q = R.int(1, 3);
        const a = R.nz(-3, 3), c = R.nz(-3, 3);
        const L = p === q ? H.fracStr(a, c) : p > q ? (a / c > 0 ? 'inf' : '-inf') : '0';
        const concl = p === q
          ? String.raw`Stesso grado: il limite è il rapporto dei coefficienti, $${H.frac(a, c)}$.`
          : p > q
            ? String.raw`Grado $${p}>${q}$ al numeratore: il limite è $${a / c > 0 ? '+\\infty' : '-\\infty'}$.`
            : String.raw`Grado $${p}<${q}$ al numeratore: il limite è $0$.`;
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\lim_{x\to+\infty}\frac{${H.coef(a)}${xk(p)}}{${H.coef(c)}${xk(q)}}$`,
          answer: L,
          explain: String.raw`Il rapporto è $\dfrac{${a}}{${c}}\,x^{${p - q}}$. ${concl}`,
        };
      },
    },
    {
      id: 's06.gerarchia.gen-esponenziale', type: 'gen', level: 2,
      gen: (R) => {
        const c = R.pick([2, 3]);
        const p = R.int(1, 2), q = R.int(1, 2);
        const A = R.nz(-3, 3), B = R.nz(-3, 3), D = R.nz(-3, 3);
        const L = B / D > 0 ? 'inf' : '-inf';
        const bt = (Math.abs(B) === 1 ? '' : `${Math.abs(B)}\\cdot `) + `${c}^{x}`;
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\lim_{x\to+\infty}\frac{${H.coef(A)}${xk(p)}${B < 0 ? '-' : '+'}${bt}}{${H.coef(D)}${xk(q)}}$`,
          answer: L,
          explain: String.raw`Al numeratore domina $${c}^{x}$, perché un esponenziale batte le potenze; al denominatore domina $${H.coef(D)}${xk(q)}$. Il rapporto è $\sim\dfrac{${B}}{${D}}\cdot\dfrac{${c}^{x}}{x^{${q}}}\to${L === 'inf' ? '+\\infty' : '-\\infty'}$.`,
        };
      },
    },
    {
      id: 's06.gerarchia.gen-radice-differenza', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-6, 6);
        return {
          type: 'num',
          prompt: String.raw`$\displaystyle\lim_{n\to\infty}\left(\sqrt{n^{2}${sg(a)}${H.coef(a)}n}-n\right)$`,
          answer: H.fracStr(a, 2),
          explain: String.raw`$\sqrt{n^2${sg(a)}${H.coef(a)}n}-n=\dfrac{${H.coef(a)}n}{\sqrt{n^2${sg(a)}${H.coef(a)}n}+n}=\dfrac{${a}}{\sqrt{1+\frac{${a}}{n}}+1}\to${H.frac(a, 2)}$.`,
        };
      },
    },
    {
      id: 's06.gerarchia.gen-esponente-radice', type: 'gen', level: 2,
      gen: (R) => {
        const r = R.pick([2, 3]);
        const p = R.int(1, 5);
        let s = R.int(0, 5);
        if (s === p) s = p + 1;
        const t = R.int(0, 3);
        const M = Math.max(p, s);
        const L = H.fracStr(M - t * r, r);
        return {
          type: 'num',
          prompt: String.raw`Per $n\to\infty$ determina l'esponente $\gamma$ tale che $a_n\sim c\,n^{\gamma}$, con $a_n=\dfrac{\sqrt[${r}]{n^{${p}}+n^{${s}}}}{${t === 0 ? '1' : `n^{${t}}`}}$.`,
          answer: L,
          explain: String.raw`Nella radice domina $n^{${M}}$, quindi $\sqrt[${r}]{\cdot}\sim n^{${M}/${r}}$ e $a_n\sim n^{${M}/${r}-${t}}$: $\gamma=${L}$.`,
        };
      },
    },
    {
      id: 's06.gerarchia.p1', type: 'num', level: 1,
      prompt: String.raw`$\displaystyle\lim_{x\to+\infty}\frac{\log x}{x}$`,
      answer: '0',
      explain: String.raw`Il logaritmo è $o$ di ogni potenza positiva: il limite è $0$.`,
    },
    {
      id: 's06.gerarchia.p2', type: 'mcq', level: 1,
      prompt: String.raw`Per $x\to+\infty$, quale affermazione è vera?`,
      options: [String.raw`$x^{2}\log x\ll x^{3}$`, String.raw`$x^{3}\ll x^{2}\log x$`, String.raw`$x^{2}\log x\sim x^{3}$`],
      answer: 0,
      explain: String.raw`$\dfrac{x^2\log x}{x^3}=\dfrac{\log x}{x}\to0$: vera. Le altre due sono false: $x^3/(x^2\log x)\to+\infty$, e il rapporto non tende a $1$.`,
    },
    {
      id: 's06.gerarchia.p3', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\lim_{x\to0^+}\sqrt{x}\,\log x$`,
      answer: '0',
      explain: String.raw`Una potenza positiva di $x$ batte il logaritmo: $x^{1/2}\log x\to0$.`,
    },
    {
      id: 's06.gerarchia.p4', type: 'expr', level: 2,
      prompt: String.raw`Scrivi l'equivalente per $x\to+\infty$ di $x^3-5x^2+\sqrt{x}$.`,
      answer: 'x^3',
      vars: ['x'],
      explain: String.raw`Nella somma vince il termine di grado massimo: $x^3-5x^2+\sqrt{x}\sim x^3$.`,
    },
    {
      id: 's06.gerarchia.p5', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\lim_{n\to\infty}\frac{3^{n}+n^{2}}{3^{n}-2^{n}}$`,
      answer: '1',
      explain: String.raw`Al numeratore e al denominatore domina $3^n$: il rapporto va a $1$.`,
    },
    {
      id: 's06.gerarchia.p6', type: 'tf', level: 1,
      prompt: String.raw`Per $n\to\infty$ vale $\sqrt{n^2+1}-n\to0$.`,
      answer: true,
      explain: String.raw`$\sqrt{n^2+1}-n=\dfrac{1}{\sqrt{n^2+1}+n}\to0$.`,
    },
    {
      id: 's06.gerarchia.p7', type: 'match', level: 2,
      prompt: String.raw`Abbina ogni successione al suo limite per $n\to\infty$.`,
      pairs: [
        [String.raw`$\dfrac{n^2+1}{3n^2}$`, String.raw`$\dfrac13$`],
        [String.raw`$\dfrac{\log n}{n}$`, String.raw`$0$`],
        [String.raw`$\dfrac{5^n}{4^n}$`, String.raw`$+\infty$`],
        [String.raw`$\left(1+\dfrac1n\right)^{2n}$`, String.raw`$e^2$`],
      ],
      explain: String.raw`Il primo è il rapporto dei coefficienti; il secondo ha il logaritmo sotto una potenza; il terzo ha l'esponenziale in base maggiore al numeratore; il quarto è il limite notevole $(1+\tfrac1m)^{m}\to e$ con $m=2n$, cioè $e^2$.`,
    },
    {
      id: 's06.gerarchia.p8', type: 'cloze', level: 2,
      text: String.raw`Per $x\to+\infty$ vale $x^{\alpha}\ll$ [[0]] per ogni $\alpha>0$.`,
      blanks: [
        { options: [String.raw`$2^{x}$`, String.raw`$\log x$`, String.raw`$\dfrac1x$`], answer: 0 },
      ],
      explain: String.raw`$2^x$ batte ogni potenza. Il logaritmo cresce più lentamente di $x^{\alpha}$, e $\dfrac1x$ tende a $0$.`,
    },
    {
      id: 's06.gerarchia.p9', type: 'interval', level: 2,
      prompt: String.raw`Per quali $\alpha$ si ha $\dfrac{x^{\alpha}}{\log x}\to+\infty$ per $x\to+\infty$?`,
      answer: '(0,+inf)',
      explain: String.raw`Per $\alpha>0$ la potenza batte il logaritmo. Per $\alpha=0$ il rapporto è $\dfrac1{\log x}\to0$; per $\alpha<0$ tende a $0$.`,
    },
    {
      id: 's06.gerarchia.p10', type: 'num', level: 2,
      prompt: String.raw`$\displaystyle\lim_{n\to\infty}\frac{n^{2}+n\log n}{n^{2}+1}$`,
      answer: '1',
      explain: String.raw`$n\log n=o(n^2)$: il numeratore è $\sim n^2$ e il limite è $1$.`,
    },
    {
      id: 's06.gerarchia.p11', type: 'tf', level: 2,
      prompt: String.raw`Se $a_n\sim b_n$ con $a_n,b_n>0$ e $\sum b_n$ converge, allora $\sum a_n$ converge.`,
      answer: true,
      explain: String.raw`Per il confronto asintotico, per termini positivi le due serie hanno lo stesso carattere.`,
    },
  ],
  flashcards: [
    {
      id: 's06.gerarchia.fc1', kind: 'def',
      front: String.raw`Che cosa significa $f\ll g$ per $x\to+\infty$?`,
      back: String.raw`$\displaystyle\lim_{x\to+\infty}\frac{f(x)}{g(x)}=0$: $g$ cresce molto più in fretta di $f$.`,
    },
    {
      id: 's06.gerarchia.fc2', kind: 'formula',
      front: String.raw`Gerarchia degli infiniti per $x\to+\infty$`,
      back: String.raw`$\log x\ll x^{\alpha}\ll b^{x}\ll x^{x}$, con $\alpha>0$ e $b>1$.`,
    },
    {
      id: 's06.gerarchia.fc3', kind: 'metodo',
      front: String.raw`Come si sceglie il termine da tenere in una somma a $\infty$?`,
      back: String.raw`Si tiene il termine dominante: l'esponenziale batte le potenze, una potenza batte il logaritmo. Le somme con termini dello stesso ordine si sommano.`,
    },
    {
      id: 's06.gerarchia.fc4', kind: 'thm',
      front: String.raw`Enunciato del confronto asintotico per serie a termini positivi`,
      back: String.raw`Se $a_n,b_n>0$ e $a_n\sim b_n$, allora $\sum a_n$ e $\sum b_n$ hanno lo stesso carattere.`,
    },
    {
      id: 's06.gerarchia.fc5', kind: 'thm',
      front: String.raw`Per quali $\gamma$ converge $\displaystyle\sum_{n\ge1} n^{\gamma}$?`,
      back: String.raw`Se e solo se $\gamma<-1$ (serie armonica generalizzata).`,
    },
    {
      id: 's06.gerarchia.fc6', kind: 'errore',
      front: String.raw`Errore tipico: $\sqrt{n^2+n}-n\sim 0$ perché $\sqrt{n^2+n}\sim n$`,
      back: String.raw`I termini principali si cancellano: $\sqrt{n^2+n}-n\to\dfrac12$. Bisogna razionalizzare.`,
    },
    {
      id: 's06.gerarchia.fc7', kind: 'formula',
      front: String.raw`Ordine di $\sqrt[r]{n^p+n^s}$ per $n\to\infty$`,
      back: String.raw`$\sim n^{\max(p,s)/r}$: domina l'esponente massimo dentro la radice.`,
    },
  ],
});
