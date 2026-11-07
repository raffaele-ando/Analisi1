import { H } from '../engine/tex.js';

// ---------------------------------------------------------------------------
// s05 · Limiti di funzioni
// Le skill sono aggiunte in fondo con SKILLS.push(...): l'oggetto esportato
// contiene lo stesso array, quindi le aggiunte successive vi compaiono.
// ---------------------------------------------------------------------------

const SKILLS = [];

export default {
  id: 's05',
  title: 'Limiti di funzioni',
  subtitle: 'Definizione, calcolo, limiti notevoli, asintoti',
  intro: String.raw`Il limite è il cuore dell'Analisi: servono per la continuità, le derivate, gli integrali impropri e le serie. All'esame compaiono in quasi ogni esercizio della Parte B (studio di funzione, ordini di infinitesimo, asintoti) e nelle domande di teoria della Parte A. Qui impari a capirli, a calcolarli senza calcolatrice e a riconoscere quando **non** esistono.`,
  skills: SKILLS,
};

// ---------- helper per i generatori ----------

/** Termine c·body con segno: first=true per il primo termine (niente "+" iniziale). */
function sg(c, body = '', first = false) {
  if (c === 0) return '';
  const abs = Math.abs(c);
  const k = body && abs === 1 ? '' : String(abs);
  if (first) return (c < 0 ? '-' : '') + k + body;
  return (c < 0 ? ' - ' : ' + ') + k + body;
}
/** Decimale in notazione italiana (virgola). */
const dec = (v) => String(v).replace('.', '{,}');
/** "+\infty" / "-\infty" / "0" … in LaTeX per un risultato numerico. */
const infTex = (s) => (s > 0 ? String.raw`+\infty` : String.raw`-\infty`);
/** x - c in LaTeX (c intero) */
const xm = (c) => (c === 0 ? 'x' : `x ${c > 0 ? '-' : '+'} ${Math.abs(c)}`);
/** a·x in LaTeX: 1->x, -1->-x, 3->3x */
const ax = (a, v = 'x') => `${H.coef(a)}${v}`;
/** Sostituisce x con (c) in un polinomio LaTeX, mettendo \cdot dopo i coefficienti. */
const subst = (tex, c) => tex.replace(/(\d)x/g, '$1\\cdot x').replace(/x/g, `(${c})`);

// ===========================================================================
// s05.def · Definizione topologica e successionale; destro/sinistro; non esistenza
// ===========================================================================
SKILLS.push({
  id: 's05.def',
  title: 'Che cos\'è un limite',
  summary: String.raw`Capire e scrivere la definizione di limite (con gli intorni, con $\varepsilon$-$\delta$, con le successioni), calcolare limiti destro e sinistro e dimostrare che un limite non esiste.`,
  prereq: ['s04.limiti', 's03.base', 's03.elementari'],
  examRefs: ['Appello 11/06/2026 · Es. 1', 'Appello 15/01/2026 · Es. 1'],
  lessons: [
    {
      id: 's05.def.L1',
      title: 'L\'idea: avvicinarsi senza arrivare',
      cards: [
        {
          type: 'learn',
          title: 'Che cosa succede vicino a un punto',
          body: String.raw`Considera $f(x) = \dfrac{x^2-1}{x-1}$. In $x = 1$ non è definita (verrebbe $\frac00$). Ma possiamo chiederci: **che valori assume $f$ quando $x$ è vicinissimo a 1?**

Proviamo qualche valore: per $x = 0{,}9;\ 0{,}99;\ 0{,}999$ si ottiene $f(x) = 1{,}9;\ 1{,}99;\ 1{,}999$, e per $x = 1{,}001;\ 1{,}01$ si ottiene $2{,}001;\ 2{,}01$.

I valori si avvicinano a 2. Infatti per $x \neq 1$ si ha $f(x) = \frac{(x-1)(x+1)}{x-1} = x+1$.

Si scrive $\displaystyle\lim_{x\to 1} f(x) = 2$ e si legge «il limite di $f(x)$ per $x$ che tende a 1 è 2».

>* Il limite descrive il comportamento di $f$ **vicino** a $x_0$, non **in** $x_0$. Il valore $f(x_0)$ (se esiste) non conta.`,
          plot: { fns: [{ f: '(x^2-1)/(x-1)', label: 'f' }], x: [-1, 3], y: [-1, 4], open: [[1, 2]] },
        },
        {
          id: 's05.def.L1.e1', type: 'mcq', level: 1,
          prompt: String.raw`Guardando i valori e il grafico, quanto vale $\displaystyle\lim_{x\to1}\frac{x^2-1}{x-1}$?`,
          options: ['$2$', '$1$', '$0$', String.raw`Non esiste, perché in $x=1$ viene $\frac00$`],
          answer: 0,
          explain: String.raw`Per $x\neq1$ la funzione coincide con $x+1$, che vicino a 1 vale circa 2. Il fatto che in $x=1$ la formula dia $\frac00$ dice solo che **non possiamo sostituire**: non dice che il limite non esiste. $1$ è il valore di $x$, non di $f$; $0$ è il numeratore.`,
        },
        {
          id: 's05.def.L1.e2', type: 'tf', level: 1,
          prompt: String.raw`Per poter parlare di $\displaystyle\lim_{x\to x_0} f(x)$ è necessario che $f$ sia definita in $x_0$.`,
          answer: false,
          explain: String.raw`Falso. Serve solo che $x_0$ sia **punto di accumulazione** del dominio: ci devono essere punti del dominio vicini quanto si vuole a $x_0$. L'esempio $\frac{x^2-1}{x-1}$ in $x_0=1$ lo mostra.`,
        },
        {
          type: 'learn',
          title: 'Il valore in $x_0$ non conta',
          body: String.raw`Sia $g(x) = x^2$ per $x\neq 1$ e $g(1) = 5$. Il grafico è la parabola con un «buco» in $(1,1)$ e un punto isolato in $(1,5)$.

Vicino a 1 (ma diversi da 1) i valori sono vicini a $1^2 = 1$, quindi $\displaystyle\lim_{x\to1} g(x) = 1$, anche se $g(1) = 5$.

> Quando $f$ è «una formula elementare» definita intorno a $x_0$ (polinomi, esponenziali, seni…), il limite si ottiene semplicemente **sostituendo**: è la continuità, che vedremo in s07.`,
          plot: { fns: [{ f: 'x^2', label: 'g' }], x: [-1, 2.5], y: [-0.5, 6], points: [[1, 5]], open: [[1, 1]] },
        },
        {
          id: 's05.def.L1.e3', type: 'num', level: 1,
          prompt: String.raw`Con la $g$ del riquadro ($g(x)=x^2$ per $x\ne1$, $g(1)=5$), quanto vale $\displaystyle\lim_{x\to1} g(x)$?`,
          answer: '1',
          explain: String.raw`Conta solo cosa fa $g$ **vicino** a 1: lì $g(x)=x^2\to 1$. Il valore $g(1)=5$ è irrilevante per il limite (rispondere 5 è l'errore tipico).`,
        },
        {
          id: 's05.def.L1.e4', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to 3}\,(x^2 - 2x + 4)$.`,
          answer: '7',
          explain: String.raw`I polinomi si comportano bene ovunque: basta sostituire. $9 - 6 + 4 = 7$.`,
        },
        {
          id: 's05.def.L1.e5', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to 2}\frac{x^2-4}{x-2}$ (semplifica prima la frazione).`,
          answer: '4',
          explain: String.raw`$x^2-4=(x-2)(x+2)$. Per $x\neq2$: $\frac{x^2-4}{x-2} = x+2 \to 4$.`,
          plot: { fns: ['(x^2-4)/(x-2)'], x: [-1, 4], y: [-1, 7], open: [[2, 4]] },
        },
        {
          type: 'learn',
          title: 'Anche verso l\'infinito',
          body: String.raw`Il punto $x_0$ e il limite $L$ possono essere anche $+\infty$ o $-\infty$:

- $\displaystyle\lim_{x\to0}\frac1{x^2} = +\infty$: vicino a 0 la funzione diventa grande quanto vogliamo (asintoto verticale);
- $\displaystyle\lim_{x\to+\infty}\frac1x = 0$: per $x$ grandissimo i valori sono vicinissimi a 0;
- $\displaystyle\lim_{x\to-\infty}e^x = 0$, $\displaystyle\lim_{x\to+\infty}e^x = +\infty$.

>! $+\infty$ non è un numero: «$\lim = +\infty$» significa che $f$ **supera qualunque soglia**, non che «vale infinito».`,
          plot: { fns: [{ f: '1/x^2', label: '1/x^2' }], x: [-3, 3], y: [-1, 8], vlines: [0] },
        },
        {
          id: 's05.def.L1.e6', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to0}\frac{1}{x^2}$?`,
          options: [String.raw`$+\infty$`, '$0$', String.raw`$-\infty$`, String.raw`Non esiste perché $\frac10$ non ha senso`],
          answer: 0,
          explain: String.raw`$x^2$ è positivo e tende a 0, quindi $\frac1{x^2}$ è positivo e diventa grandissimo: $+\infty$. «$\frac10$» non è un calcolo ma la segnalazione che il denominatore tende a 0: bisogna guardare il **segno** ($0^+$), e qui è positivo da entrambi i lati.`,
        },
        {
          id: 's05.def.L1.e7', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\left(3 + \frac{1}{x}\right)$.`,
          answer: '3',
          explain: String.raw`$\frac1x\to0$ per $x\to+\infty$, quindi la somma tende a $3+0=3$.`,
        },
        {
          id: 's05.def.L1.e8', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to-\infty} e^{x}$. (Scrivi inf per $+\infty$ se serve.)`,
          answer: '0',
          explain: String.raw`Il grafico di $e^x$ si appiattisce sull'asse $x$ verso sinistra: $e^{x}\to 0^+$ per $x\to-\infty$. Verso destra invece $e^x\to+\infty$.`,
        },
        {
          id: 's05.def.L1.e9', type: 'mcq', level: 2,
          prompt: String.raw`Quale frase descrive correttamente $\displaystyle\lim_{x\to+\infty} f(x) = 2$?`,
          options: [
            String.raw`$f(x)$ è vicina a 2 quanto vogliamo, pur di prendere $x$ abbastanza grande`,
            String.raw`Per $x$ abbastanza grande vale esattamente $f(x)=2$`,
            String.raw`$f(x)$ non supera mai il valore 2`,
            String.raw`$f(2) = +\infty$`,
          ],
          answer: 0,
          explain: String.raw`Il limite non richiede che $f$ **raggiunga** 2 (es. $2+\frac1x$ non lo raggiunge mai) né che resti sotto 2 ($2+\frac1x$ sta sopra). L'ultima opzione scambia il ruolo di $x$ e del limite.`,
        },
      ],
    },
    {
      id: 's05.def.L2',
      title: 'La definizione precisa: intorni ed ε-δ',
      cards: [
        {
          type: 'learn',
          title: 'Intorni e definizione topologica',
          body: String.raw`Un **intorno** di $x_0\in\R$ è un intervallo $(x_0-\delta,\,x_0+\delta)$ con $\delta>0$. Un intorno di $+\infty$ è una semiretta $(M,+\infty)$, uno di $-\infty$ è $(-\infty,M)$.

$x_0$ è **punto di accumulazione** di $A$ se ogni intorno di $x_0$ contiene punti di $A$ diversi da $x_0$.

>* **Definizione (topologica).** Sia $x_0$ di accumulazione per il dominio $A$ di $f$, e $L\in\R\cup\{\pm\infty\}$. Si dice $\displaystyle\lim_{x\to x_0}f(x)=L$ se **per ogni** intorno $V$ di $L$ **esiste** un intorno $U$ di $x_0$ tale che $f(x)\in V$ per ogni $x\in U\cap A$, $x\ne x_0$.

Con $x_0, L\in\R$ diventa la versione **$\varepsilon$-$\delta$**:
$$\forall\varepsilon>0\;\exists\delta>0:\quad x\in A,\ 0<|x-x_0|<\delta\ \Rightarrow\ |f(x)-L|<\varepsilon.$$
La sfida: tu scegli quanto vicino a $L$ ($\varepsilon$), io trovo quanto vicino a $x_0$ ($\delta$).`,
        },
        {
          id: 's05.def.L2.e1', type: 'cloze', level: 2,
          prompt: 'Completa la definizione.',
          text: String.raw`$\displaystyle\lim_{x\to x_0} f(x) = L\in\R$ se [[0]] tale che, per $x\in A$, [[1]] $\Rightarrow$ [[2]].`,
          blanks: [
            { options: [String.raw`$\forall\varepsilon>0\ \exists\delta>0$`, String.raw`$\exists\varepsilon>0\ \forall\delta>0$`, String.raw`$\exists\delta>0\ \forall\varepsilon>0$`], answer: 0 },
            { options: [String.raw`$0<|x-x_0|<\delta$`, String.raw`$|x-x_0|<\varepsilon$`, String.raw`$|f(x)-L|<\delta$`], answer: 0 },
            { options: [String.raw`$|f(x)-L|<\varepsilon$`, String.raw`$|f(x)-L|>\varepsilon$`, String.raw`$|x-x_0|<\varepsilon$`], answer: 0 },
          ],
          explain: String.raw`L'ordine dei quantificatori conta: **prima** si fissa $\varepsilon$ (arbitrario), **poi** si trova $\delta$, che può dipendere da $\varepsilon$. La condizione $0<|x-x_0|$ esclude il punto $x_0$ stesso: il valore $f(x_0)$ non conta.`,
        },
        {
          type: 'learn',
          title: 'Gli altri casi',
          body: String.raw`Traducendo «intorno» nei vari casi:

- $x_0\in\R$, $L=+\infty$: $\forall M\ \exists\delta>0:\ 0<|x-x_0|<\delta\Rightarrow f(x)>M$;
- $x_0\in\R$, $L=-\infty$: $\forall M\ \exists\delta>0:\ 0<|x-x_0|<\delta\Rightarrow f(x)<M$;
- $x_0=+\infty$, $L\in\R$: $\forall\varepsilon>0\ \exists N:\ x>N\Rightarrow|f(x)-L|<\varepsilon$;
- $x_0=+\infty$, $L=+\infty$: $\forall M\ \exists N:\ x>N\Rightarrow f(x)>M$.

> È la stessa idea vista per le successioni (s04), dove però $n\to+\infty$ è l'unico caso.`,
        },
        {
          id: 's05.def.L2.e2', type: 'match', level: 2,
          prompt: 'Abbina ogni limite alla sua definizione.',
          pairs: [
            [String.raw`$\displaystyle\lim_{x\to x_0}f=L$`, String.raw`$\forall\varepsilon\,\exists\delta:\ 0<|x-x_0|<\delta\Rightarrow|f(x)-L|<\varepsilon$`],
            [String.raw`$\displaystyle\lim_{x\to x_0}f=+\infty$`, String.raw`$\forall M\,\exists\delta:\ 0<|x-x_0|<\delta\Rightarrow f(x)>M$`],
            [String.raw`$\displaystyle\lim_{x\to+\infty}f=L$`, String.raw`$\forall\varepsilon\,\exists N:\ x>N\Rightarrow|f(x)-L|<\varepsilon$`],
            [String.raw`$\displaystyle\lim_{x\to-\infty}f=+\infty$`, String.raw`$\forall M\,\exists N:\ x<N\Rightarrow f(x)>M$`],
          ],
          explain: String.raw`Regola pratica: se il limite $L$ è finito si usa $\varepsilon$ (vicinanza a $L$), se è infinito si usa una soglia $M$. Se $x_0$ è finito si usa $\delta$, se è infinito una soglia $N$.`,
        },
        {
          type: 'example',
          title: 'Verificare un limite con ε-δ',
          problem: String.raw`Verifica con la definizione che $\displaystyle\lim_{x\to2}(3x-1)=5$.`,
          steps: [
            String.raw`Fisso $\varepsilon>0$ e scrivo la condizione da ottenere: $|f(x)-L| = |3x-1-5| = |3x-6| = 3|x-2|<\varepsilon$.`,
            String.raw`Questa equivale a $|x-2|<\frac{\varepsilon}{3}$. Quindi $\delta=\frac\varepsilon3$ funziona: se $0<|x-2|<\frac\varepsilon3$ allora $|f(x)-5|<\varepsilon$.`,
            { text: String.raw`Per esempio, con $\varepsilon = 0{,}3$ si ottiene $\delta = 0{,}1$.`,
              ask: { type: 'num', prompt: String.raw`Con $\varepsilon=0{,}3$, quale $\delta$ fornisce la formula $\delta=\frac\varepsilon3$?`, answer: '0.1', explain: String.raw`$0{,}3/3=0{,}1$.` } },
          ],
          result: String.raw`Per ogni $\varepsilon>0$ basta $\delta=\varepsilon/3$: il limite è verificato.`,
        },
        {
          id: 's05.def.L2.e3', type: 'num', level: 2,
          prompt: String.raw`Per verificare $\displaystyle\lim_{x\to1}(5x+2)=7$ con $\varepsilon = 0{,}01$, qual è il più grande $\delta$ che funziona?`,
          answer: '0.002',
          explain: String.raw`$|5x+2-7| = 5|x-1|<0{,}01 \iff |x-1|<0{,}002$. Il più grande $\delta$ è $\frac{\varepsilon}{5}=0{,}002$. (Errore tipico: dimenticare di dividere per 5 e rispondere $0{,}01$.)`,
        },
        {
          type: 'example',
          title: 'Un limite all\'infinito',
          problem: String.raw`Verifica che $\displaystyle\lim_{x\to+\infty}\frac1x=0$.`,
          steps: [
            String.raw`Fisso $\varepsilon>0$. Per $x>0$ la condizione è $\left|\frac1x-0\right| = \frac1x<\varepsilon$.`,
            String.raw`Equivale a $x>\frac1\varepsilon$: basta prendere $N=\frac1\varepsilon$.`,
            { text: String.raw`Con $\varepsilon=0{,}001$ si ottiene $N = 1000$.`,
              ask: { type: 'num', prompt: String.raw`Con $\varepsilon = 0{,}001$, quale soglia $N$ si ottiene?`, answer: '1000', explain: String.raw`$N = 1/\varepsilon = 1000$: per $x>1000$ si ha $0<\frac1x<0{,}001$.` } },
          ],
          result: String.raw`Per ogni $\varepsilon>0$ esiste $N=1/\varepsilon$: il limite è $0$.`,
        },
        {
          id: 's05.def.L2.e4', type: 'num', level: 2,
          prompt: String.raw`Per $\displaystyle\lim_{x\to0}\frac1{x^2}=+\infty$, data la soglia $M = 100$, qual è il più grande $\delta$ tale che $0<|x|<\delta\Rightarrow \frac1{x^2}>100$?`,
          answer: '0.1',
          explain: String.raw`$\frac1{x^2}>100\iff x^2<\frac1{100}\iff |x|<\frac1{10}$. In generale $\delta = \frac1{\sqrt M}$.`,
        },
        {
          id: 's05.def.L2.e5', type: 'tf', level: 1,
          prompt: String.raw`Nella definizione $\varepsilon$-$\delta$, il numero $\delta$ può dipendere da $\varepsilon$.`,
          answer: true,
          explain: String.raw`Vero: $\delta$ si sceglie **dopo** $\varepsilon$, quindi di solito dipende da esso (come $\delta=\varepsilon/3$ nell'esempio).`,
        },
        {
          id: 's05.def.L2.e6', type: 'mcq', level: 3,
          prompt: String.raw`Qual è la **negazione** di $\displaystyle\lim_{x\to x_0} f(x)=L$ (con $L$ finito)?`,
          options: [
            String.raw`$\exists\varepsilon>0\ \forall\delta>0\ \exists x:\ 0<|x-x_0|<\delta$ e $|f(x)-L|\ge\varepsilon$`,
            String.raw`$\forall\varepsilon>0\ \exists\delta>0:\ 0<|x-x_0|<\delta\Rightarrow|f(x)-L|\ge\varepsilon$`,
            String.raw`$\exists\varepsilon>0\ \exists\delta>0:\ 0<|x-x_0|<\delta\Rightarrow|f(x)-L|\ge\varepsilon$`,
            String.raw`$\forall\varepsilon>0\ \forall\delta>0:\ |f(x)-L|>\varepsilon$`,
          ],
          answer: 0,
          explain: String.raw`Negando si scambiano i quantificatori ($\forall\leftrightarrow\exists$) e si nega l'implicazione: «non ($P\Rightarrow Q$)» è «$P$ e non $Q$». Quindi: esiste un $\varepsilon$ «cattivo» tale che, comunque piccolo sia $\delta$, c'è un $x$ vicino a $x_0$ con $f(x)$ lontano da $L$. Le altre opzioni lasciano un quantificatore non negato o mantengono l'implicazione.`,
        },
        {
          type: 'learn',
          title: 'Definizione successionale (Heine)',
          body: String.raw`>* **Teorema (caratterizzazione successionale).** $\displaystyle\lim_{x\to x_0}f(x)=L$ se e solo se, **per ogni** successione $(x_n)$ con $x_n\in A$, $x_n\neq x_0$, $x_n\to x_0$, si ha $f(x_n)\to L$.

È il ponte tra limiti di funzioni e di successioni (s04). Uso pratico:

- per **calcolare** limiti di successioni: $\sin\frac1n\to0$ perché $\sin x\to0$ per $x\to0$;
- per dimostrare che un limite **non esiste**: basta trovare due successioni $x_n\to x_0$, $y_n\to x_0$ con $f(x_n)$ e $f(y_n)$ che tendono a valori diversi (oppure una con $f(x_n)$ senza limite).`,
        },
        {
          id: 's05.def.L2.e7', type: 'mcq', level: 2,
          prompt: 'Quale ragionamento è corretto?',
          options: [
            String.raw`Se esistono $x_n\to x_0$ e $y_n\to x_0$ con $f(x_n)\to L_1$, $f(y_n)\to L_2$ e $L_1\neq L_2$, allora $\lim_{x\to x_0}f$ non esiste`,
            String.raw`Se esiste una successione $x_n\to x_0$ con $f(x_n)\to L$, allora $\lim_{x\to x_0}f=L$`,
            String.raw`Se $f(x_n)\to L$ per $x_n = x_0+\frac1n$, allora $\lim_{x\to x_0}f=L$`,
            String.raw`Il limite di una funzione non ha nulla a che fare con i limiti di successioni`,
          ],
          answer: 0,
          explain: String.raw`Il teorema richiede $f(x_n)\to L$ per **tutte** le successioni: una sola (anche $x_0+\frac1n$, che arriva solo da destra) non basta. Al contrario, per mostrare la non esistenza bastano due successioni con limiti diversi delle immagini.`,
        },
      ],
    },
    {
      id: 's05.def.L3',
      title: 'Destro, sinistro e limiti che non esistono',
      cards: [
        {
          type: 'learn',
          title: 'Limite destro e sinistro',
          body: String.raw`Se ci avviciniamo a $x_0$ **solo da destra** ($x>x_0$) si parla di **limite destro** $\displaystyle\lim_{x\to x_0^+}f(x)$; solo da sinistra ($x<x_0$), di **limite sinistro** $\displaystyle\lim_{x\to x_0^-}f(x)$. Nella definizione si usa $x_0<x<x_0+\delta$ (oppure $x_0-\delta<x<x_0$).

>* **Teorema.** $\displaystyle\lim_{x\to x_0}f(x)=L$ se e solo se esistono entrambi i limiti destro e sinistro e valgono entrambi $L$.

Servono per le funzioni **a tratti** e quando un denominatore si annulla: il segno di $0^+$ o $0^-$ decide tra $+\infty$ e $-\infty$.`,
          plot: { fns: [{ f: 'x<2 ? 2x+1 : x^2-3', label: 'f' }], x: [-1, 4], y: [-2, 8], points: [[2, 1]], open: [[2, 5]] },
        },
        {
          id: 's05.def.L3.e1', type: 'num', level: 1,
          prompt: String.raw`Sia $f(x)=\begin{cases}2x+1 & x<2\\ x^2-3 & x\ge 2\end{cases}$ (grafico sopra). Calcola $\displaystyle\lim_{x\to2^-}f(x)$.`,
          answer: '5',
          explain: String.raw`Da sinistra ($x<2$) vale la prima formula: $2\cdot2+1=5$. La seconda formula non c'entra.`,
        },
        {
          id: 's05.def.L3.e2', type: 'num', level: 1,
          prompt: String.raw`Con la stessa $f$, calcola $\displaystyle\lim_{x\to2^+}f(x)$.`,
          answer: '1',
          explain: String.raw`Da destra vale $x^2-3$: $4-3=1$.`,
        },
        {
          id: 's05.def.L3.e3', type: 'mcq', level: 1,
          prompt: String.raw`Con la stessa $f$, esiste $\displaystyle\lim_{x\to2}f(x)$?`,
          options: [String.raw`No: destro e sinistro sono diversi`, String.raw`Sì, vale $1 = f(2)$`, String.raw`Sì, vale $5$`, String.raw`Sì, vale la media $3$`],
          answer: 0,
          explain: String.raw`Il limite (bilaterale) esiste solo se destro e sinistro coincidono: $5\neq1$, quindi non esiste. $f(2)=1$ è il valore nel punto e non decide nulla.`,
        },
        {
          type: 'example',
          title: String.raw`Il segno di $\frac1x$ in $0$`,
          problem: String.raw`Studia $\displaystyle\lim_{x\to0}\frac1x$.`,
          steps: [
            String.raw`Da destra: $x\to0^+$, cioè $x$ piccolo e **positivo**. Allora $\frac1x$ è positivo e grande: $\displaystyle\lim_{x\to0^+}\frac1x=+\infty$.`,
            { text: String.raw`Da sinistra: $x\to0^-$, $x$ piccolo e **negativo**, quindi $\frac1x\to-\infty$.`,
              ask: { type: 'mcq', prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to0^-}\frac1x$?`, options: [String.raw`$-\infty$`, String.raw`$+\infty$`, '$0$'], answer: 0, explain: String.raw`Numeratore positivo, denominatore $0^-$: il quoziente è negativo e in modulo enorme.` } },
            String.raw`I due limiti laterali sono diversi: $\displaystyle\lim_{x\to0}\frac1x$ **non esiste**.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to0^\pm}\frac1x=\pm\infty$; il limite bilaterale non esiste.`,
          plot: { fns: ['1/x'], x: [-3, 3], y: [-6, 6], vlines: [0] },
        },
        {
          id: 's05.def.L3.e4', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to2^+}\frac{x+1}{x-2}$. (Scrivi inf o -inf per $\pm\infty$.)`,
          answer: 'inf',
          explain: String.raw`Numeratore $\to3>0$; denominatore $\to0^+$ perché $x>2$. Positivo diviso $0^+$: $+\infty$. Da sinistra invece verrebbe $-\infty$.`,
        },
        {
          id: 's05.def.L3.e5', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0^-}e^{1/x}$.`,
          answer: '0',
          explain: String.raw`Per $x\to0^-$ l'esponente $\frac1x\to-\infty$ e $e^{t}\to0$ per $t\to-\infty$. Da destra invece $e^{1/x}\to+\infty$: il limite bilaterale non esiste.`,
        },
        {
          type: 'learn',
          title: String.raw`Un limite che oscilla: $\sin\frac1x$`,
          body: String.raw`Vicino a 0, $\frac1x$ diventa enorme e $\sin\frac1x$ oscilla tra $-1$ e $1$ sempre più velocemente: il limite per $x\to0$ **non esiste** (e non è infinito!).

Dimostrazione con Heine:
- $x_n=\frac1{n\pi}\to0$ e $\sin\frac1{x_n}=\sin(n\pi)=0\to0$;
- $y_n=\frac1{\frac\pi2+2n\pi}\to0$ e $\sin\frac1{y_n}=\sin\left(\frac\pi2+2n\pi\right)=1\to1$.

Due successioni che tendono a 0 con immagini che tendono a limiti diversi ($0\neq1$): il limite non esiste.

> Invece $x\sin\frac1x\to0$: è (limitata)·(infinitesima), per il teorema del confronto.`,
          plot: { fns: ['sin(1/x)', { f: 'x*sin(1/x)', label: 'x sin(1/x)' }], x: [-0.6, 0.6], y: [-1.3, 1.3] },
        },
        {
          id: 's05.def.L3.e6', type: 'order', level: 3,
          prompt: String.raw`Riordina la dimostrazione che $\displaystyle\lim_{x\to0}\sin\frac1x$ non esiste.`,
          steps: [
            String.raw`Supponiamo per assurdo che $\lim_{x\to0}\sin\frac1x = L$.`,
            String.raw`Per il teorema di Heine, $\sin\frac1{x_n}\to L$ per **ogni** successione $x_n\to0$ con $x_n\neq0$.`,
            String.raw`Con $x_n=\frac1{n\pi}$ si ha $\sin\frac1{x_n}=\sin(n\pi)=0$, quindi $L=0$.`,
            String.raw`Con $y_n=\frac{1}{\pi/2+2n\pi}$ si ha $\sin\frac1{y_n}=1$, quindi $L=1$.`,
            String.raw`$0\neq1$ contraddice l'unicità del limite: il limite non esiste.`,
          ],
          distractors: [
            String.raw`Poiché $\sin\frac1x$ è limitata, il limite esiste ed è compreso tra $-1$ e $1$.`,
            String.raw`Poiché $\frac1x\to\infty$, il limite vale $\sin(\infty)$.`,
          ],
          explain: String.raw`Struttura: assurdo → Heine → due successioni → due valori diversi → contraddizione. Limitata **non** implica che il limite esista; «$\sin(\infty)$» non ha senso.`,
        },
        {
          id: 's05.def.L3.e7', type: 'num', level: 2,
          prompt: String.raw`Con $z_n=\dfrac{2}{(4n+3)\pi}$ (che tende a 0), quanto vale $\sin\dfrac{1}{z_n}$?`,
          answer: '-1',
          explain: String.raw`$\frac1{z_n}=\frac{(4n+3)\pi}{2}=2n\pi+\frac{3\pi}2$, e $\sin\frac{3\pi}2=-1$. Un'altra successione con un altro valore: conferma che il limite non esiste.`,
        },
        {
          id: 's05.def.L3.e8', type: 'mcq', level: 2,
          prompt: String.raw`Quali di questi limiti per $x\to0$ **esistono** (finiti o infiniti)?`,
          options: [String.raw`$\displaystyle\lim_{x\to0}x\sin\frac1x$`, String.raw`$\displaystyle\lim_{x\to0}\sin\frac1x$`, String.raw`$\displaystyle\lim_{x\to0}e^{1/x}$`, String.raw`$\displaystyle\lim_{x\to0}\frac{|x|}{x}$`, String.raw`$\displaystyle\lim_{x\to0}\frac{1}{x^2}$`],
          answer: [0, 4],
          explain: String.raw`$x\sin\frac1x\to0$ (limitata per infinitesima); $\frac1{x^2}\to+\infty$ da entrambi i lati. $\sin\frac1x$ oscilla. $e^{1/x}$: destro $+\infty$, sinistro $0$. $\frac{|x|}x$ vale $1$ per $x>0$ e $-1$ per $x<0$.`,
        },
        {
          id: 's05.def.L3.e9', type: 'problem', level: 3, source: 'Appello 11/06/2026 · Es. 1',
          prompt: String.raw`Sia $f(x)=e^{\frac{1}{4-x^2}}$. Studia il comportamento di $f$ vicino a $x=2$.`,
          parts: [
            { type: 'num', prompt: String.raw`$\displaystyle\lim_{x\to2^-}f(x)$ (scrivi inf per $+\infty$)`, answer: 'inf', explain: String.raw`Per $x\to2^-$ (es. $x=1{,}9$): $4-x^2\to0^+$, quindi l'esponente $\to+\infty$ e $f\to+\infty$.` },
            { type: 'num', prompt: String.raw`$\displaystyle\lim_{x\to2^+}f(x)$`, answer: '0', explain: String.raw`Per $x\to2^+$: $4-x^2\to0^-$, l'esponente $\to-\infty$, $e^{-\infty}=0$.` },
            { type: 'mcq', prompt: String.raw`Allora $\displaystyle\lim_{x\to2}f(x)$…`, options: ['non esiste', String.raw`vale $+\infty$`, 'vale 0'], answer: 0, explain: 'I limiti laterali sono diversi.' },
          ],
          solution: String.raw`Dominio: $x\neq\pm2$. Vicino a $2$ il segno di $4-x^2=(2-x)(2+x)$ dipende da $2-x$ (perché $2+x\to4>0$).

- $x\to2^-$: $2-x\to0^+$, $\frac1{4-x^2}\to+\infty$, $f\to+\infty$;
- $x\to2^+$: $2-x\to0^-$, $\frac1{4-x^2}\to-\infty$, $f\to0^+$.

Quindi $x=2$ è asintoto verticale (da sinistra) e il limite bilaterale non esiste.`,
        },
        {
          id: 's05.def.L3.e10', type: 'open', level: 3,
          prompt: String.raw`Spiega, usando i limiti laterali, perché $\displaystyle\lim_{x\to0}\frac{|x|}{x}$ non esiste.`,
          answer: String.raw`Per $x>0$ si ha $|x|=x$, quindi $\frac{|x|}x=1$ e $\displaystyle\lim_{x\to0^+}\frac{|x|}x=1$. Per $x<0$ si ha $|x|=-x$, quindi $\frac{|x|}x=-1$ e $\displaystyle\lim_{x\to0^-}\frac{|x|}x=-1$. Il limite esiste se e solo se i limiti destro e sinistro esistono e sono uguali: poiché $1\neq-1$, il limite non esiste.`,
          rubric: [
            String.raw`Calcola correttamente il limite destro ($|x|=x$, vale 1)`,
            String.raw`Calcola correttamente il limite sinistro ($|x|=-x$, vale $-1$)`,
            'Cita il teorema: il limite esiste sse destro e sinistro esistono e coincidono',
            'Conclude che il limite non esiste',
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: 's05.def.gen-tratti', type: 'gen', level: 2,
      gen: (R) => {
        const c = R.int(-2, 3);
        const a1 = R.nz(-3, 3), b1 = R.int(-4, 4);
        const a2 = R.nz(-2, 2);
        const L1 = a1 * c + b1;
        const same = R.chance(0.4);
        const b2 = same ? L1 - a2 * c * c : R.int(-4, 4);
        const L2 = a2 * c * c + b2;
        const exists = L1 === L2;
        return {
          type: 'problem',
          prompt: String.raw`Sia $f(x)=\begin{cases}${H.poly([a1, b1])} & x<${c}\\ ${H.poly([a2, 0, b2])} & x\ge ${c}\end{cases}$. Studia il limite per $x\to${c}$.`,
          parts: [
            { type: 'num', prompt: String.raw`$\displaystyle\lim_{x\to ${c}^-}f(x)$`, answer: String(L1), explain: String.raw`Da sinistra vale la prima riga: $${subst(H.poly([a1, b1]), c)} = ${L1}$.` },
            { type: 'num', prompt: String.raw`$\displaystyle\lim_{x\to ${c}^+}f(x)$`, answer: String(L2), explain: String.raw`Da destra vale la seconda riga: $${subst(H.poly([a2, 0, b2]), c)} = ${L2}$.` },
            { type: 'mcq', prompt: String.raw`Esiste $\displaystyle\lim_{x\to ${c}}f(x)$?`, options: ['Sì', 'No'], answer: exists ? 0 : 1, noShuffle: true, explain: exists ? String.raw`Destro e sinistro coincidono ($${L1}$): il limite esiste e vale $${L1}$.` : String.raw`Destro e sinistro sono diversi ($${L1}\neq${L2}$): il limite non esiste.` },
          ],
          solution: String.raw`Limite sinistro $${L1}$, limite destro $${L2}$. ${exists ? 'Coincidono: il limite esiste.' : 'Sono diversi: il limite non esiste.'}`,
        };
      },
    },
    {
      id: 's05.def.gen-delta', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.pick([2, 3, 4, 5, 6, 7]) * R.sign(), x0 = R.int(-3, 4), b = R.int(-5, 5);
        const k = R.pick([1, 2, 5]);
        const A = Math.abs(a);
        const eps = (A * k) / 100;
        const L = a * x0 + b;
        return {
          type: 'num',
          prompt: String.raw`Per verificare $\displaystyle\lim_{x\to ${x0}}\left(${H.poly([a, b])}\right)=${L}$ con $\varepsilon=${dec(eps)}$, qual è il più grande $\delta$ che funziona?`,
          answer: String(k / 100),
          explain: String.raw`$|f(x)-L| = |${H.poly([a, b])} - (${L})| = ${A}\,|${xm(x0)}| < ${dec(eps)} \iff |${xm(x0)}| < \frac{${dec(eps)}}{${A}} = ${dec(k / 100)}$. In generale $\delta=\varepsilon/${A}$.`,
        };
      },
    },
    {
      id: 's05.def.gen-segno', type: 'gen', level: 2,
      gen: (R) => {
        const c = R.int(-4, 4);
        let p = R.int(-5, 5);
        if (c + p === 0) p += 1;
        const N = c + p;
        const side = R.pick(['+', '-']);
        const s = Math.sign(N) * (side === '+' ? 1 : -1);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to ${c}^{${side}}}\frac{${H.lin(1, p)}}{${xm(c)}}$. (Scrivi inf o -inf per $\pm\infty$.)`,
          answer: s > 0 ? 'inf' : '-inf',
          explain: String.raw`Il numeratore tende a $${N}$ (${N > 0 ? 'positivo' : 'negativo'}); il denominatore $${xm(c)}\to0^{${side}}$ perché $x${side === '+' ? '>' : '<'}${c}$. Segno del quoziente: ${N > 0 ? '+' : '−'} diviso ${side === '+' ? '+' : '−'}, quindi il limite è $${infTex(s)}$.`,
        };
      },
    },
    {
      id: 's05.def.gen-exp', type: 'gen', level: 2,
      gen: (R) => {
        const c = R.int(-3, 3), k = R.nz(-3, 3);
        const side = R.pick(['+', '-']);
        const expSign = Math.sign(k) * (side === '+' ? 1 : -1);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to ${c}^{${side}}} e^{${k < 0 ? '-' : ''}\frac{${Math.abs(k)}}{${xm(c)}}}$. (Scrivi inf per $+\infty$.)`,
          answer: expSign > 0 ? 'inf' : '0',
          explain: String.raw`L'esponente $${k < 0 ? '-' : ''}\frac{${Math.abs(k)}}{${xm(c)}}$ tende a $${infTex(expSign)}$ (segno di ${k} diviso $0^{${side}}$). Poiché $e^t\to+\infty$ per $t\to+\infty$ ed $e^t\to0$ per $t\to-\infty$, il limite è $${expSign > 0 ? String.raw`+\infty` : '0'}$.`,
        };
      },
    },
    {
      id: 's05.def.p1', type: 'tf', level: 1,
      prompt: String.raw`Se $\displaystyle\lim_{x\to x_0^+}f(x)=\lim_{x\to x_0^-}f(x)=3$ allora $\displaystyle\lim_{x\to x_0}f(x)=3$, anche se $f(x_0)=7$.`,
      answer: true,
      explain: String.raw`Il limite dipende solo dai valori vicino a $x_0$ (esclusi $x_0$): destro e sinistro uguali a 3 bastano.`,
    },
    {
      id: 's05.def.p2', type: 'tf', level: 2,
      prompt: String.raw`Una funzione limitata vicino a $x_0$ ha sempre limite finito per $x\to x_0$.`,
      answer: false,
      explain: String.raw`Controesempio: $\sin\frac1x$ è limitata tra $-1$ e $1$ ma non ha limite per $x\to0$.`,
    },
    {
      id: 's05.def.p3', type: 'cloze', level: 2,
      prompt: 'Completa la definizione.',
      text: String.raw`$\displaystyle\lim_{x\to+\infty}f(x)=L\in\R$ se $\forall\varepsilon>0$ [[0]] tale che [[1]] $\Rightarrow |f(x)-L|<\varepsilon$.`,
      blanks: [
        { options: [String.raw`$\exists N\in\R$`, String.raw`$\exists\delta>0$`, String.raw`$\forall N\in\R$`], answer: 0 },
        { options: [String.raw`$x>N$`, String.raw`$|x|<N$`, String.raw`$0<|x-N|<\delta$`], answer: 0 },
      ],
      explain: String.raw`Un intorno di $+\infty$ è una semiretta $(N,+\infty)$: «$x$ vicino a $+\infty$» significa $x>N$.`,
    },
    {
      id: 's05.def.p4', type: 'mcq', level: 2,
      prompt: String.raw`Per mostrare che $\displaystyle\lim_{x\to0}\cos\frac1x$ non esiste, quale coppia di successioni funziona?`,
      options: [
        String.raw`$x_n=\frac1{2n\pi}$ e $y_n=\frac1{(2n+1)\pi}$`,
        String.raw`$x_n=\frac1n$ e $y_n=\frac2n$`,
        String.raw`$x_n=\frac1{2n\pi}$ e $y_n=\frac1{4n\pi}$`,
        String.raw`$x_n=n\pi$ e $y_n=2n\pi$`,
      ],
      answer: 0,
      explain: String.raw`$\cos(2n\pi)=1$ e $\cos((2n+1)\pi)=-1$: due limiti diversi. Con $\frac1n,\frac2n$ le immagini $\cos n$, $\cos\frac n2$ non hanno un limite noto; con $\frac1{2n\pi}$ e $\frac1{4n\pi}$ si ottiene sempre 1; $n\pi$ non tende a 0.`,
    },
    {
      id: 's05.def.p5', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to1^-}\frac{3}{x^2-1}$. (Scrivi inf o -inf.)`,
      answer: '-inf',
      explain: String.raw`Per $x\to1^-$ (es. $x=0{,}9$): $x^2-1\to0^-$. Positivo diviso $0^-$ dà $-\infty$.`,
    },
    {
      id: 's05.def.p6', type: 'open', level: 3,
      prompt: String.raw`Scrivi la definizione di $\displaystyle\lim_{x\to x_0}f(x)=+\infty$ (con $x_0\in\R$) e verifica con essa che $\displaystyle\lim_{x\to3}\frac{1}{(x-3)^2}=+\infty$.`,
      answer: String.raw`Definizione: $x_0$ di accumulazione per il dominio; $\forall M>0\ \exists\delta>0$ tale che $0<|x-x_0|<\delta$, $x$ nel dominio, implica $f(x)>M$.

Verifica: fissato $M>0$, $\frac1{(x-3)^2}>M\iff(x-3)^2<\frac1M\iff|x-3|<\frac1{\sqrt M}$. Basta prendere $\delta=\frac1{\sqrt M}$.`,
      rubric: [
        String.raw`Quantificatori corretti: per ogni $M$ esiste $\delta$`,
        String.raw`Condizione $0<|x-x_0|<\delta$ (escluso $x_0$) e tesi $f(x)>M$`,
        String.raw`Risolve $\frac1{(x-3)^2}>M$ ottenendo $|x-3|<1/\sqrt M$`,
        String.raw`Indica esplicitamente $\delta = 1/\sqrt M$`,
      ],
    },
    {
      id: 's05.def.p7', type: 'order', level: 3,
      prompt: String.raw`Riordina la verifica di $\displaystyle\lim_{x\to2}(4x-3)=5$ con la definizione.`,
      steps: [
        String.raw`Fisso $\varepsilon>0$ arbitrario.`,
        String.raw`Calcolo $|f(x)-5|=|4x-8|=4|x-2|$.`,
        String.raw`$4|x-2|<\varepsilon\iff|x-2|<\frac\varepsilon4$.`,
        String.raw`Scelgo $\delta=\frac\varepsilon4$: se $0<|x-2|<\delta$ allora $|f(x)-5|<\varepsilon$.`,
      ],
      distractors: [String.raw`Scelgo $\delta=4\varepsilon$.`, String.raw`Fisso $\delta>0$ e cerco $\varepsilon$.`],
      explain: String.raw`Si parte da $\varepsilon$ (non da $\delta$) e si ricava $\delta=\varepsilon/4$; con $\delta=4\varepsilon$ si otterrebbe solo $|f(x)-5|<16\varepsilon$.`,
    },
  ],
  flashcards: [
    { id: 's05.def.fc1', kind: 'def', front: 'Punto di accumulazione di un insieme $A$', back: String.raw`$x_0$ è di accumulazione per $A$ se ogni intorno di $x_0$ contiene almeno un punto di $A$ **diverso** da $x_0$. Solo nei punti di accumulazione del dominio ha senso il limite.` },
    { id: 's05.def.fc2', kind: 'def', front: 'Definizione topologica di limite', back: String.raw`$\displaystyle\lim_{x\to x_0}f(x)=L$ se per ogni intorno $V$ di $L$ esiste un intorno $U$ di $x_0$ tale che $f(x)\in V$ per ogni $x\in U\cap\mathrm{dom}f$, $x\neq x_0$. Vale per $x_0, L$ finiti o infiniti.` },
    { id: 's05.def.fc3', kind: 'def', front: String.raw`Definizione $\varepsilon$-$\delta$ di $\displaystyle\lim_{x\to x_0}f(x)=L$`, back: String.raw`$\forall\varepsilon>0\ \exists\delta>0$: $x\in A$, $0<|x-x_0|<\delta\Rightarrow|f(x)-L|<\varepsilon$.` },
    { id: 's05.def.fc4', kind: 'def', front: String.raw`Definizione di $\displaystyle\lim_{x\to x_0}f(x)=+\infty$`, back: String.raw`$\forall M\ \exists\delta>0$: $0<|x-x_0|<\delta\Rightarrow f(x)>M$.` },
    { id: 's05.def.fc5', kind: 'def', front: String.raw`Definizione di $\displaystyle\lim_{x\to+\infty}f(x)=L$`, back: String.raw`$\forall\varepsilon>0\ \exists N$: $x>N\Rightarrow|f(x)-L|<\varepsilon$.` },
    { id: 's05.def.fc6', kind: 'def', front: 'Limite destro e sinistro', back: String.raw`$\displaystyle\lim_{x\to x_0^+}f=L$: come la definizione di limite ma solo per $x_0<x<x_0+\delta$. Sinistro: $x_0-\delta<x<x_0$.` },
    { id: 's05.def.fc7', kind: 'thm', front: 'Limite e limiti laterali', back: String.raw`$\displaystyle\lim_{x\to x_0}f=L\iff$ esistono $\displaystyle\lim_{x\to x_0^+}f$ e $\displaystyle\lim_{x\to x_0^-}f$ e sono entrambi uguali a $L$.` },
    { id: 's05.def.fc8', kind: 'thm', front: 'Caratterizzazione successionale (Heine)', back: String.raw`$\displaystyle\lim_{x\to x_0}f=L\iff$ per ogni successione $x_n\in A\setminus\{x_0\}$ con $x_n\to x_0$ si ha $f(x_n)\to L$.` },
    { id: 's05.def.fc9', kind: 'metodo', front: 'Come si dimostra che un limite non esiste', back: String.raw`(1) Limiti destro e sinistro diversi (es. $\frac1x$, $\frac{|x|}x$, $e^{1/x}$ in 0), oppure (2) due successioni $x_n,y_n\to x_0$ con $f(x_n)$, $f(y_n)$ convergenti a limiti diversi (es. $\sin\frac1x$: $x_n=\frac1{n\pi}$, $y_n=\frac1{\pi/2+2n\pi}$).` },
    { id: 's05.def.fc10', kind: 'thm', front: 'Unicità del limite (funzioni)', back: String.raw`Se $\displaystyle\lim_{x\to x_0}f(x)$ esiste, è unico. (Stessa dimostrazione delle successioni: due limiti diversi hanno intorni disgiunti.)` },
    { id: 's05.def.fc11', kind: 'errore', front: 'Errore tipico: il valore nel punto', back: String.raw`Il limite per $x\to x_0$ **non** dipende da $f(x_0)$ (che può anche non esistere). Coincide con $f(x_0)$ solo se $f$ è continua in $x_0$.` },
  ],
});

// ===========================================================================
// s05.calcolo · Algebra dei limiti, forme indeterminate, raccoglimento, razionalizzazione, composte
// ===========================================================================

/** Polinomio casuale di grado n con coefficiente direttivo lead (coefficienti interi piccoli). */
function randPoly(R, n, lead) {
  const c = [lead];
  for (let i = 0; i < n; i++) c.push(R.int(-6, 6));
  return c;
}
/** (x - r)(x - s) espanso: coefficienti [1, -(r+s), rs] */
const quadRoots = (r, s) => [1, -(r + s), r * s];

SKILLS.push({
  id: 's05.calcolo',
  title: 'Calcolo dei limiti',
  summary: String.raw`Usare l'algebra dei limiti, riconoscere le 7 forme indeterminate e scioglierle con raccoglimento, scomposizione, razionalizzazione, cambio di variabile e confronto.`,
  prereq: ['s05.def', 's00.algebra', 's04.limiti'],
  examRefs: ['Itinere 11/11/2025 · Es. 3', 'Appello 15/01/2026 · Es. 1'],
  lessons: [
    {
      id: 's05.calcolo.L1',
      title: 'Algebra dei limiti e forme indeterminate',
      cards: [
        {
          type: 'learn',
          title: 'Le regole di calcolo',
          body: String.raw`>* **Algebra dei limiti.** Se $f\to L$ e $g\to M$ (finiti) allora $f\pm g\to L\pm M$, $\ f\cdot g\to LM$, $\ \frac fg\to\frac LM$ (se $M\neq0$).

Le stesse regole valgono con $\pm\infty$ usando l'**aritmetica estesa** ($L$ numero reale):

- $L+(+\infty)=+\infty$, $\quad(+\infty)+(+\infty)=+\infty$;
- $L\cdot(+\infty)=+\infty$ se $L>0$, $=-\infty$ se $L<0$; $\quad(+\infty)\cdot(-\infty)=-\infty$;
- $\frac{L}{\pm\infty}=0$; $\quad\frac{L}{0^+}=\pm\infty$ secondo il segno di $L\neq0$;
- $a^{+\infty}=+\infty$ se $a>1$, $a^{+\infty}=0$ se $0\le a<1$.

>! **Forme indeterminate** (il risultato dipende dalle funzioni, non si può decidere a priori):
$$+\infty-\infty,\quad 0\cdot\infty,\quad \frac{\infty}{\infty},\quad \frac00,\quad 1^\infty,\quad 0^0,\quad \infty^0.$$`,
        },
        {
          id: 's05.calcolo.L1.e1', type: 'mcq', level: 1,
          prompt: 'Quali sono forme **indeterminate**?',
          options: [String.raw`$+\infty-\infty$`, String.raw`$(+\infty)+(+\infty)$`, String.raw`$0\cdot\infty$`, String.raw`$\frac{5}{0^+}$`, String.raw`$1^{\infty}$`, String.raw`$\frac{0}{\infty}$`, String.raw`$2^{+\infty}$`],
          answer: [0, 2, 4],
          explain: String.raw`$+\infty+\infty=+\infty$; $\frac5{0^+}=+\infty$; $\frac0\infty=0$ (numeratore piccolo, denominatore enorme); $2^{+\infty}=+\infty$. Invece $\infty-\infty$, $0\cdot\infty$ e $1^\infty$ sono indeterminate: per esempio $1^\infty$ **non** vale 1 (si veda $(1+\frac1x)^x\to e$).`,
        },
        {
          id: 's05.calcolo.L1.e2', type: 'match', level: 1,
          prompt: 'Abbina ogni espressione al suo risultato.',
          pairs: [
            [String.raw`$3+(+\infty)$`, String.raw`$+\infty$`],
            [String.raw`$(-2)\cdot(+\infty)$`, String.raw`$-\infty$`],
            [String.raw`$\dfrac{7}{+\infty}$`, '$0$'],
            [String.raw`$(+\infty)-(+\infty)$`, 'forma indeterminata'],
          ],
          explain: String.raw`Un numero negativo per $+\infty$ cambia segno: $-\infty$. Un numero fisso diviso per una quantità enorme tende a 0.`,
        },
        {
          id: 's05.calcolo.L1.e3', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}(x^2+3x)$. (Scrivi inf per $+\infty$.)`,
          answer: 'inf',
          explain: String.raw`Entrambi gli addendi tendono a $+\infty$: $+\infty+\infty=+\infty$. Nessuna indeterminazione.`,
        },
        {
          id: 's05.calcolo.L1.e4', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\left(5-e^{x}\right)$. (Scrivi -inf per $-\infty$.)`,
          answer: '-inf',
          explain: String.raw`$e^x\to+\infty$, quindi $5-e^x\to5-\infty=-\infty$.`,
        },
        {
          id: 's05.calcolo.L1.e5', type: 'tf', level: 1,
          prompt: String.raw`Se $f\to0$ e $g\to+\infty$, allora $f\cdot g\to0$.`,
          answer: false,
          explain: String.raw`Falso: $0\cdot\infty$ è indeterminata. Con $f=\frac1x$, $g=x^2$ ($x\to+\infty$) il prodotto è $x\to+\infty$; con $g=x$ vale 1; con $g=\sqrt x$ tende a 0.`,
        },
        {
          type: 'learn',
          title: 'Perché «indeterminata»',
          body: String.raw`Tutte e tre le funzioni qui sotto, per $x\to+\infty$, sono del tipo $+\infty-\infty$:

- $(x+1)-x = 1\to1$;
- $x^2-x = x(x-1)\to+\infty$;
- $x-x^2\to-\infty$.

Lo stesso «schema» dà risultati diversi: per questo bisogna **trasformare** l'espressione (raccogliere, semplificare, razionalizzare…) finché la forma non è più indeterminata.

> Regola d'oro: prima di qualunque trucco, **sostituisci** e guarda che forma ottieni. Se non è indeterminata, hai finito.`,
        },
        {
          id: 's05.calcolo.L1.e6', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0^+}\left(\frac1x-\log x\right)$. (Scrivi inf per $+\infty$.)`,
          answer: 'inf',
          explain: String.raw`Attenzione ai segni: $\log x\to-\infty$, quindi $-\log x\to+\infty$. La somma è $(+\infty)+(+\infty)=+\infty$: **non** è una forma indeterminata.`,
        },
        {
          id: 's05.calcolo.L1.e7', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{2+\frac3x}{1-\frac1x}$.`,
          answer: '2',
          explain: String.raw`$\frac3x\to0$ e $\frac1x\to0$: il quoziente tende a $\frac{2+0}{1-0}=2$.`,
        },
        {
          id: 's05.calcolo.L1.e8', type: 'mcq', level: 2,
          prompt: String.raw`Che forma ha $\displaystyle\lim_{x\to0^+}x\cdot\frac{1}{x^2}$ e quanto vale?`,
          options: [String.raw`Forma $0\cdot\infty$; vale $+\infty$`, String.raw`Forma $0\cdot\infty$; vale $0$`, String.raw`Forma $0\cdot\infty$; vale $1$`, String.raw`Non è indeterminata; vale $0$`],
          answer: 0,
          explain: String.raw`È $0\cdot\infty$, ma semplificando $x\cdot\frac1{x^2}=\frac1x\to+\infty$ (per $x\to0^+$). «Zero per qualcosa fa zero» vale solo se l'altro fattore è limitato.`,
        },
        {
          id: 's05.calcolo.L1.e9', type: 'tf', level: 1,
          prompt: String.raw`Se $f\to+\infty$ e $g\to+\infty$ allora $f-g\to0$.`,
          answer: false,
          explain: String.raw`$+\infty-\infty$ è indeterminata: con $f=x^2$, $g=x$ si ha $f-g\to+\infty$.`,
        },
        {
          id: 's05.calcolo.L1.e10', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to-\infty}\frac{3}{e^{x}}$. (Scrivi inf per $+\infty$.)`,
          answer: 'inf',
          explain: String.raw`$e^x\to0^+$ per $x\to-\infty$: $\frac{3}{0^+}=+\infty$.`,
        },
      ],
    },
    {
      id: 's05.calcolo.L2',
      title: 'Polinomi e funzioni razionali',
      cards: [
        {
          type: 'learn',
          title: 'Raccogliere il termine dominante',
          body: String.raw`Per $x\to\pm\infty$ in un polinomio comanda il termine di **grado massimo**: raccogliendolo,
$$3x^2-5x+1 = x^2\left(3-\frac5x+\frac1{x^2}\right)\quad\text{e la parentesi}\to3.$$

Per una funzione razionale $\dfrac{a_px^p+\dots}{b_qx^q+\dots}$ con $x\to\pm\infty$:

- $p<q$: il limite è $0$;
- $p=q$: il limite è $\dfrac{a_p}{b_q}$ (rapporto dei coefficienti direttivi);
- $p>q$: il limite è $\pm\infty$, con il segno di $\dfrac{a_p}{b_q}x^{p-q}$.

>! Vale solo per $x\to\pm\infty$! Per $x\to x_0$ finito si sostituisce.`,
        },
        {
          type: 'example',
          title: 'Stesso grado',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{3x^2-5x+1}{2x^2+7}$.`,
          steps: [
            String.raw`Sostituendo: $\frac{+\infty}{+\infty}$, indeterminata.`,
            String.raw`Raccolgo $x^2$ sopra e sotto: $\dfrac{x^2\left(3-\frac5x+\frac1{x^2}\right)}{x^2\left(2+\frac7{x^2}\right)}=\dfrac{3-\frac5x+\frac1{x^2}}{2+\frac7{x^2}}$.`,
            { text: String.raw`Le frazioni con $x$ al denominatore tendono a 0: il limite è $\frac32$.`,
              ask: { type: 'num', prompt: 'Quanto vale il limite?', answer: '3/2', explain: String.raw`Rapporto dei coefficienti di $x^2$: $\frac32$.` } },
          ],
          result: String.raw`$\displaystyle\lim_{x\to+\infty}\frac{3x^2-5x+1}{2x^2+7}=\frac32$`,
        },
        {
          id: 's05.calcolo.L2.e1', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{4x^3-x}{2x^3+5x^2}$.`,
          answer: '2',
          explain: String.raw`Stesso grado (3): rapporto dei coefficienti direttivi $\frac42=2$.`,
        },
        {
          id: 's05.calcolo.L2.e2', type: 'mcq', level: 1,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to+\infty}\frac{2x+1}{x^2+3}$?`,
          options: ['$0$', '$2$', String.raw`$+\infty$`, String.raw`$\frac13$`],
          answer: 0,
          explain: String.raw`Il denominatore ha grado maggiore: $\frac{2x+1}{x^2+3}\sim\frac{2x}{x^2}=\frac2x\to0$. $2$ sarebbe il rapporto dei coefficienti direttivi, che conta solo a parità di grado; $\frac13$ è il valore in $x=0$.`,
        },
        {
          id: 's05.calcolo.L2.e3', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to-\infty}\frac{x^2+1}{x-3}$. (Scrivi inf o -inf.)`,
          answer: '-inf',
          explain: String.raw`Grado 2 sopra, 1 sotto: $\frac{x^2+1}{x-3}\sim\frac{x^2}{x}=x\to-\infty$. Errore tipico: rispondere $+\infty$ dimenticando che $x$ è negativo.`,
        },
        {
          id: 's05.calcolo.L2.e4', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to-\infty}(x^3-4x^2+7)$. (Scrivi inf o -inf.)`,
          answer: '-inf',
          explain: String.raw`$x^3-4x^2+7=x^3\left(1-\frac4x+\frac7{x^3}\right)$: la parentesi tende a 1 e $x^3\to-\infty$.`,
        },
        {
          type: 'learn',
          title: 'La forma 0/0 in un punto: scomporre',
          body: String.raw`Se numeratore e denominatore sono polinomi che si annullano entrambi in $x_0$, per il **teorema di Ruffini** contengono entrambi il fattore $(x-x_0)$. Lo si scompone e lo si semplifica (lecito: nel limite $x\neq x_0$).

Esempio: $\displaystyle\lim_{x\to2}\frac{x^2-5x+6}{x^2-4}=\lim_{x\to2}\frac{(x-2)(x-3)}{(x-2)(x+2)}=\lim_{x\to2}\frac{x-3}{x+2}=-\frac14.$

>! Se solo il denominatore si annulla (es. $\frac{x^2+1}{x-1}$ in 1) non è $\frac00$: è $\frac{L}{0}$ e il limite è $\pm\infty$ (guarda i segni da destra e da sinistra).`,
        },
        {
          type: 'example',
          title: 'Scomposizione con Ruffini',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to1}\frac{x^3-1}{x-1}$.`,
          steps: [
            String.raw`In $x=1$: $\frac{0}{0}$. Il numeratore è divisibile per $x-1$.`,
            { text: String.raw`Differenza di cubi: $x^3-1=(x-1)(x^2+x+1)$.`,
              ask: { type: 'expr', prompt: String.raw`Quanto vale il quoziente $\dfrac{x^3-1}{x-1}$ (per $x\neq1$)?`, answer: 'x^2+x+1', explain: String.raw`Ruffini con radice 1 sui coefficienti $1,0,0,-1$ dà $1,1,1$: cioè $x^2+x+1$.` } },
            String.raw`Sostituisco $x=1$ nel quoziente: $1+1+1=3$.`,
          ],
          result: String.raw`$\displaystyle\lim_{x\to1}\frac{x^3-1}{x-1}=3$`,
        },
        {
          id: 's05.calcolo.L2.e5', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to3}\frac{x^2-9}{x^2-x-6}$.`,
          answer: '6/5',
          explain: String.raw`$x^2-9=(x-3)(x+3)$, $x^2-x-6=(x-3)(x+2)$. Semplificando: $\frac{x+3}{x+2}\to\frac65$.`,
        },
        {
          id: 's05.calcolo.L2.e6', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to-1}\frac{x^2+3x+2}{x^2-1}$.`,
          answer: '-1/2',
          explain: String.raw`$\frac{(x+1)(x+2)}{(x+1)(x-1)}=\frac{x+2}{x-1}\to\frac{1}{-2}=-\frac12$.`,
        },
        {
          id: 's05.calcolo.L2.e7', type: 'mcq', level: 2,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to1}\frac{x^2+1}{x-1}$?`,
          options: [String.raw`Non esiste: $+\infty$ da destra, $-\infty$ da sinistra`, String.raw`$2$ (scompongo e semplifico)`, String.raw`$+\infty$`, '$0$'],
          answer: 0,
          explain: String.raw`Il numeratore tende a $2\neq0$: la forma è $\frac{2}{0}$, non $\frac00$, e non c'è nulla da semplificare ($x^2+1$ non ha il fattore $x-1$). Da destra $\frac2{0^+}=+\infty$, da sinistra $\frac2{0^-}=-\infty$.`,
        },
        {
          id: 's05.calcolo.L2.e8', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to2}\frac{x^3-8}{x^2-4}$.`,
          answer: '3',
          explain: String.raw`$x^3-8=(x-2)(x^2+2x+4)$ e $x^2-4=(x-2)(x+2)$. Resta $\frac{x^2+2x+4}{x+2}\to\frac{12}{4}=3$.`,
        },
      ],
    },
    {
      id: 's05.calcolo.L3',
      title: 'Radici: razionalizzare',
      cards: [
        {
          type: 'learn',
          title: 'Il trucco del coniugato',
          body: String.raw`Con le radici la forma $+\infty-\infty$ si scioglie moltiplicando e dividendo per il **coniugato**, usando $(a-b)(a+b)=a^2-b^2$:
$$\sqrt A-\sqrt B=\frac{(\sqrt A-\sqrt B)(\sqrt A+\sqrt B)}{\sqrt A+\sqrt B}=\frac{A-B}{\sqrt A+\sqrt B}.$$

Esempio, per $x\to+\infty$:
$$\sqrt{x^2+4x}-x=\frac{x^2+4x-x^2}{\sqrt{x^2+4x}+x}=\frac{4x}{x\left(\sqrt{1+\frac4x}+1\right)}\to\frac{4}{2}=2.$$

> Lo stesso trucco serve per $\frac00$ con radici in un punto finito, e (con $a^3-b^3=(a-b)(a^2+ab+b^2)$) per le radici cubiche.`,
        },
        {
          type: 'example',
          title: 'Razionalizzare passo per passo',
          problem: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\left(\sqrt{x^2+6x+1}-x\right)$.`,
          steps: [
            String.raw`Forma $+\infty-\infty$. Moltiplico e divido per $\sqrt{x^2+6x+1}+x$.`,
            { text: String.raw`Il numeratore diventa $(x^2+6x+1)-x^2=6x+1$.`,
              ask: { type: 'expr', prompt: String.raw`Quanto vale $(x^2+6x+1)-x^2$?`, answer: '6x+1', explain: 'I termini $x^2$ si cancellano.' } },
            String.raw`Raccolgo $x$: $\dfrac{x\left(6+\frac1x\right)}{x\left(\sqrt{1+\frac6x+\frac1{x^2}}+1\right)}\to\dfrac{6}{1+1}=3$.`,
          ],
          result: String.raw`Il limite vale $3$. In generale $\sqrt{x^2+bx+c}-x\to\frac b2$ per $x\to+\infty$.`,
        },
        {
          id: 's05.calcolo.L3.e1', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\left(\sqrt{x+3}-\sqrt{x}\right)$.`,
          answer: '0',
          explain: String.raw`$\sqrt{x+3}-\sqrt x=\frac{3}{\sqrt{x+3}+\sqrt x}=\frac{3}{+\infty}\to0$.`,
        },
        {
          id: 's05.calcolo.L3.e2', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\left(\sqrt{x^2+1}-\sqrt{x^2-2x}\right)$.`,
          answer: '1',
          explain: String.raw`Coniugato: $\frac{(x^2+1)-(x^2-2x)}{\sqrt{x^2+1}+\sqrt{x^2-2x}}=\frac{2x+1}{\sqrt{x^2+1}+\sqrt{x^2-2x}}$. Il denominatore è $\sim x+x=2x$, quindi il limite è $\frac{2x}{2x}=1$.`,
        },
        {
          type: 'learn',
          title: 'Attenzione a $-\infty$: $\sqrt{x^2}=|x|$',
          body: String.raw`Raccogliendo $x^2$ sotto radice: $\sqrt{x^2(\dots)}=|x|\sqrt{\dots}$. Per $x\to-\infty$ è $|x|=-x$!

- $\displaystyle\lim_{x\to-\infty}\frac{\sqrt{x^2+1}}{x}=\lim\frac{-x\sqrt{1+\frac1{x^2}}}{x}=-1$ (non $+1$).
- $\displaystyle\lim_{x\to-\infty}\left(\sqrt{x^2+4x}-x\right)$: qui $-x\to+\infty$, quindi è $+\infty+\infty=+\infty$. **Non** è indeterminata.
- $\displaystyle\lim_{x\to-\infty}\left(\sqrt{x^2+4x}+x\right)$ invece è $+\infty-\infty$: razionalizzando $\frac{4x}{\sqrt{x^2+4x}-x}=\frac{4x}{-x\sqrt{1+\frac4x}-x}\to\frac{4}{-2}=-2$.`,
        },
        {
          id: 's05.calcolo.L3.e3', type: 'mcq', level: 2,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to-\infty}\left(\sqrt{x^2+4x}-x\right)$?`,
          options: [String.raw`$+\infty$`, '$2$', '$-2$', '$0$'],
          answer: 0,
          explain: String.raw`Per $x\to-\infty$ sia $\sqrt{x^2+4x}$ sia $-x$ tendono a $+\infty$: la somma è $+\infty$, nessuna forma indeterminata. $2$ è il limite a $+\infty$ (dove invece c'è $\infty-\infty$); razionalizzare «a occhi chiusi» porta all'errore.`,
        },
        {
          id: 's05.calcolo.L3.e4', type: 'num', level: 3,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to-\infty}\left(\sqrt{x^2+4x}+x\right)$.`,
          answer: '-2',
          explain: String.raw`Coniugato: $\frac{4x}{\sqrt{x^2+4x}-x}$. Per $x<0$: $\sqrt{x^2+4x}=|x|\sqrt{1+\frac4x}=-x\sqrt{1+\frac4x}$. Il denominatore è $-x\left(\sqrt{1+\frac4x}+1\right)$ e il limite è $\frac{4}{-2}=-2$.`,
        },
        {
          id: 's05.calcolo.L3.e5', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\sqrt{x+4}-2}{x}$.`,
          answer: '1/4',
          explain: String.raw`Forma $\frac00$. Moltiplico per $\sqrt{x+4}+2$: $\frac{x+4-4}{x(\sqrt{x+4}+2)}=\frac{1}{\sqrt{x+4}+2}\to\frac14$.`,
        },
        {
          id: 's05.calcolo.L3.e6', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to9}\frac{x-9}{\sqrt x-3}$.`,
          answer: '6',
          explain: String.raw`$x-9=(\sqrt x-3)(\sqrt x+3)$, quindi la frazione è $\sqrt x+3\to6$.`,
        },
        {
          id: 's05.calcolo.L3.e7', type: 'num', level: 3, source: 'Itinere 11/11/2025 · Es. 3',
          prompt: String.raw`Calcola $\displaystyle\lim_{n\to\infty}n\left(\sqrt{1+\frac1n}-1\right)$.`,
          answer: '1/2',
          explain: String.raw`Forma $\infty\cdot0$. Razionalizzo: $n\cdot\dfrac{1+\frac1n-1}{\sqrt{1+\frac1n}+1}=\dfrac{1}{\sqrt{1+\frac1n}+1}\to\frac12$. (Con i limiti notevoli: $\sqrt{1+t}-1\sim\frac t2$.)`,
        },
        {
          id: 's05.calcolo.L3.e8', type: 'num', level: 3,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\left(\sqrt[3]{x^3+3x^2}-x\right)$.`,
          answer: '1',
          explain: String.raw`Con $A=\sqrt[3]{x^3+3x^2}$ e $a^3-b^3=(a-b)(a^2+ab+b^2)$: $A-x=\frac{A^3-x^3}{A^2+Ax+x^2}=\frac{3x^2}{A^2+Ax+x^2}$. Poiché $A\sim x$, il denominatore è $\sim3x^2$: il limite è $1$.`,
        },
      ],
    },
    {
      id: 's05.calcolo.L4',
      title: 'Composte, confronto e forme esponenziali',
      cards: [
        {
          type: 'learn',
          title: 'Limite di una funzione composta',
          body: String.raw`>* **Teorema (cambio di variabile).** Se $\displaystyle\lim_{x\to x_0}g(x)=y_0$ e $\displaystyle\lim_{y\to y_0}f(y)=L$, e $g(x)\neq y_0$ vicino a $x_0$ (oppure $f$ è continua in $y_0$), allora $\displaystyle\lim_{x\to x_0}f(g(x))=L$.

In pratica si calcola prima il limite «interno» e poi quello «esterno»:

- $\displaystyle\lim_{x\to+\infty}e^{-x^2}$: $t=-x^2\to-\infty$, $e^t\to0$: il limite è $0$;
- $\displaystyle\lim_{x\to+\infty}\arctan(x^2-x)$: $t=x^2-x\to+\infty$, $\arctan t\to\frac\pi2$.`,
        },
        {
          id: 's05.calcolo.L4.e1', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to-\infty}\arctan\left(x^3-x\right)$.`,
          answer: '-pi/2',
          explain: String.raw`$t=x^3-x\sim x^3\to-\infty$ e $\arctan t\to-\frac\pi2$ per $t\to-\infty$.`,
        },
        {
          id: 's05.calcolo.L4.e2', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}e^{\frac{2x+1}{x-3}}$.`,
          answer: 'e^2',
          explain: String.raw`L'esponente è razionale di pari grado: $\frac{2x+1}{x-3}\to2$. Poiché $e^t$ è continua, il limite è $e^2$.`,
        },
        {
          type: 'learn',
          title: 'Teorema del confronto',
          body: String.raw`>* **Teorema del confronto (dei carabinieri).** Se $g(x)\le f(x)\le h(x)$ vicino a $x_0$ e $g,h\to L$, allora anche $f\to L$.

**Corollario:** (funzione limitata)·(funzione infinitesima) $\to0$.

- $\displaystyle\lim_{x\to0}x\sin\frac1x=0$, perché $\left|x\sin\frac1x\right|\le|x|\to0$;
- $\displaystyle\lim_{x\to+\infty}\frac{\sin x}{x}=0$, perché $|\sin x|\le1$ e $\frac1x\to0$.

>! $\frac{\sin x}{x}\to1$ vale per $x\to0$, non per $x\to+\infty$!`,
        },
        {
          id: 's05.calcolo.L4.e3', type: 'num', level: 1,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{\sin x}{x}$.`,
          answer: '0',
          explain: String.raw`$-\frac1x\le\frac{\sin x}x\le\frac1x$ per $x>0$, ed entrambi i «carabinieri» tendono a 0. (Rispondere 1 confonde con il limite notevole per $x\to0$.)`,
        },
        {
          id: 's05.calcolo.L4.e4', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{3x+2\sin x}{x+1}$.`,
          answer: '3',
          explain: String.raw`Divido per $x$: $\frac{3+2\frac{\sin x}{x}}{1+\frac1x}$. Poiché $\frac{\sin x}{x}\to0$ (confronto), il limite è $\frac{3}{1}=3$.`,
        },
        {
          type: 'learn',
          title: 'Forme esponenziali: $f^g=e^{g\log f}$',
          body: String.raw`Per $f(x)^{g(x)}$ (con $f>0$) si scrive sempre
$$f(x)^{g(x)}=e^{g(x)\log f(x)}$$
e si calcola il limite dell'esponente $g\log f$. Le forme $1^\infty$, $0^0$, $\infty^0$ diventano tutte $0\cdot\infty$ nell'esponente.

- Se base $\to a>1$ ed esponente $\to+\infty$: $a^{+\infty}=+\infty$ (non indeterminata).
- Se base $\to a\in[0,1)$ ed esponente $\to+\infty$: $a^{+\infty}=0$.
- $\displaystyle\lim_{x\to0^+}x^x=\lim e^{x\log x}=e^0=1$, perché $x\log x\to0$ (gerarchia, s06).`,
        },
        {
          id: 's05.calcolo.L4.e5', type: 'mcq', level: 2,
          prompt: String.raw`Quanto vale $\displaystyle\lim_{x\to+\infty}\left(\frac{2x+1}{x+3}\right)^{x}$?`,
          options: [String.raw`$+\infty$`, String.raw`$e^{2}$`, '$1$', String.raw`$e^{-5}$`],
          answer: 0,
          explain: String.raw`La base tende a $2$, non a $1$: la forma è $2^{+\infty}=+\infty$, **non** $1^\infty$. Gli altri valori nascono dall'applicare per errore il limite notevole $(1+\frac ax)^x\to e^a$, che vale solo quando la base tende a 1.`,
        },
        {
          id: 's05.calcolo.L4.e6', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\left(\frac{x+1}{3x}\right)^{x}$.`,
          answer: '0',
          explain: String.raw`La base tende a $\frac13<1$ e l'esponente a $+\infty$: $\left(\frac13\right)^{+\infty}=0$.`,
        },
        {
          id: 's05.calcolo.L4.e7', type: 'mcq', level: 1,
          prompt: String.raw`Che forma ha $\displaystyle\lim_{x\to0^+}x^{x}$?`,
          options: [String.raw`$0^0$`, String.raw`$1^\infty$`, String.raw`$\infty^0$`, 'nessuna: vale 0'],
          answer: 0,
          explain: String.raw`Base $\to0^+$ ed esponente $\to0$: è $0^0$, indeterminata. Si risolve con $x^x=e^{x\log x}$.`,
        },
        {
          id: 's05.calcolo.L4.e8', type: 'num', level: 2,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0^+}x^{x}$ (sapendo che $x\log x\to0$ per $x\to0^+$).`,
          answer: '1',
          explain: String.raw`$x^x=e^{x\log x}\to e^0=1$.`,
        },
        {
          id: 's05.calcolo.L4.e9', type: 'num', level: 3,
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}x^{1/x}$ (sapendo che $\frac{\log x}{x}\to0$ per $x\to+\infty$).`,
          answer: '1',
          explain: String.raw`Forma $\infty^0$. $x^{1/x}=e^{\frac{\log x}{x}}\to e^0=1$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's05.calcolo.gen-razionale', type: 'gen', level: 2,
      gen: (R) => {
        const p = R.int(1, 3), q = R.int(1, 3);
        const a = R.nz(-5, 5), d = R.nz(-4, 4);
        const num = randPoly(R, p, a), den = randPoly(R, q, d);
        const to = R.pick(['+', '-']);
        const sx = to === '+' ? 1 : -1;
        let answer, res;
        if (p < q) { answer = '0'; res = String.raw`il denominatore ha grado maggiore e il limite è $0$`; }
        else if (p === q) { answer = H.fracStr(a, d); res = String.raw`stesso grado: rapporto dei coefficienti direttivi $${H.frac(a, d)}$`; }
        else {
          const s = Math.sign(a * d) * (sx ** (p - q));
          answer = s > 0 ? 'inf' : '-inf';
          res = String.raw`grado maggiore al numeratore: la funzione si comporta come $${H.frac(a, d)}${p - q === 1 ? 'x' : `x^{${p - q}}`}$, che tende a $${infTex(s)}$`;
        }
        const lead = (c, k) => String.raw`${H.coef(c)}x${k > 1 ? `^{${k}}` : ''}`;
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to${to}\infty}\frac{${H.poly(num)}}{${H.poly(den)}}$. (Scrivi inf o -inf se serve.)`,
          answer,
          explain: String.raw`Raccolgo i termini di grado massimo: $\dfrac{${lead(a, p)}\,(1+\dots)}{${lead(d, q)}\,(1+\dots)}$, con le parentesi che tendono a 1. Quindi ${res}.`,
        };
      },
    },
    {
      id: 's05.calcolo.gen-ruffini', type: 'gen', level: 2,
      gen: (R) => {
        const r = R.int(-4, 4);
        let s = R.int(-5, 5), t = R.int(-5, 5);
        while (s === r) s = R.int(-5, 5);
        while (t === r || t === s) t = R.int(-5, 5);
        const k = R.pick([1, 1, 2, 3]);
        const num = quadRoots(r, s).map((c) => c * k);
        const den = quadRoots(r, t);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to ${r}}\frac{${H.poly(num)}}{${H.poly(den)}}$.`,
          answer: H.fracStr(k * (r - s), r - t),
          explain: String.raw`In $x=${r}$ numeratore e denominatore si annullano: forma $\frac00$. Scompongo: $\dfrac{${k === 1 ? '' : k}(${xm(r)})(${xm(s)})}{(${xm(r)})(${xm(t)})}$ e semplifico il fattore $(${xm(r)})$. Resta $\dfrac{${k === 1 ? '' : k}(${xm(s)})}{${xm(t)}}\to\dfrac{${k * (r - s)}}{${r - t}} = ${H.frac(k * (r - s), r - t)}$.`,
        };
      },
    },
    {
      id: 's05.calcolo.gen-coniugato', type: 'gen', level: 2,
      gen: (R) => {
        const b = R.nz(-8, 8), c = R.int(-5, 5);
        const atPlus = R.chance(0.6);
        const inside = H.poly([1, b, c]);
        if (atPlus) {
          return {
            type: 'num',
            prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\left(\sqrt{${inside}}-x\right)$.`,
            answer: H.fracStr(b, 2),
            explain: String.raw`Forma $+\infty-\infty$. Moltiplico e divido per $\sqrt{${inside}}+x$: $\dfrac{${H.poly([b, c])}}{\sqrt{${inside}}+x}$. Raccogliendo $x$ (positivo) il denominatore è $x\left(\sqrt{1+\dots}+1\right)\sim2x$: il limite è $\frac{${b}}{2}=${H.frac(b, 2)}$.`,
          };
        }
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to-\infty}\left(\sqrt{${inside}}+x\right)$.`,
          answer: H.fracStr(-b, 2),
          explain: String.raw`Forma $+\infty-\infty$. Coniugato: $\dfrac{${H.poly([b, c])}}{\sqrt{${inside}}-x}$. Per $x<0$, $\sqrt{x^2(\dots)}=|x|\sqrt{\dots}=-x\sqrt{\dots}$, quindi il denominatore è $\sim-2x$ e il limite è $\frac{${b}}{-2}=${H.frac(-b, 2)}$. (Errore tipico: usare $\sqrt{x^2}=x$ e ottenere $${H.frac(b, 2)}$.)`,
        };
      },
    },
    {
      id: 's05.calcolo.gen-radice0', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.int(1, 5), k = R.nz(-4, 4);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to0}\frac{\sqrt{x+${a * a}}-${a}}{${ax(k)}}$.`,
          answer: H.fracStr(1, 2 * a * k),
          explain: String.raw`Forma $\frac00$. Moltiplico per $\sqrt{x+${a * a}}+${a}$: $\dfrac{x+${a * a}-${a * a}}{${k === 1 ? '' : k === -1 ? '-' : k}x\left(\sqrt{x+${a * a}}+${a}\right)}=\dfrac{1}{${k === 1 ? '' : k === -1 ? '-' : k}\left(\sqrt{x+${a * a}}+${a}\right)}\to\dfrac{1}{${k}\cdot${2 * a}}=${H.frac(1, 2 * a * k)}$.`,
        };
      },
    },
    {
      id: 's05.calcolo.gen-esponenziale', type: 'gen', level: 2,
      gen: (R) => {
        const p = R.nz(-6, 6), r = R.pick([1, 2, 3]), q = R.int(-5, 5), s = R.int(-5, 5);
        const to = R.pick(['+', '-']);
        const [pp, rr] = H.reduce(p, r);
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to${to}\infty}e^{\frac{${H.poly([p, q])}}{${H.poly([r, s])}}}$.`,
          answer: `e^(${pp}/${rr})`,
          explain: String.raw`L'esponente è un rapporto di polinomi di grado 1: tende a $${H.frac(p, r)}$. Per la continuità dell'esponenziale (limite di funzione composta) il limite è $e^{${H.frac(p, r)}}$.`,
        };
      },
    },
    {
      id: 's05.calcolo.gen-confronto', type: 'gen', level: 2,
      gen: (R) => {
        const a = R.nz(-5, 5), b = R.nz(-4, 4), c = R.pick([1, 2, 3, 4]), d = R.int(1, 6);
        const f = R.pick(['sin', 'cos']);
        const F = '\\' + f;
        return {
          type: 'num',
          prompt: String.raw`Calcola $\displaystyle\lim_{x\to+\infty}\frac{${ax(a)}${sg(b, `\\${f} x`)}}{${H.poly([c, d])}}$.`,
          answer: H.fracStr(a, c),
          explain: String.raw`Divido numeratore e denominatore per $x$: $\dfrac{${a}${sg(b, `\\frac{\\${f} x}{x}`)}}{${c}+\frac{${d}}{x}}$. Per il confronto $\frac{${F} x}{x}\to0$ (limitata per infinitesima), quindi il limite è $${H.frac(a, c)}$.`,
        };
      },
    },
    {
      id: 's05.calcolo.p1', type: 'mcq', level: 2,
      prompt: String.raw`Quale procedimento è **sbagliato** per $\displaystyle\lim_{x\to+\infty}\left(\sqrt{x^2+x}-x\right)$?`,
      options: [
        String.raw`$\sqrt{x^2+x}\to+\infty$ e $x\to+\infty$, quindi la differenza tende a $0$`,
        String.raw`Moltiplico e divido per $\sqrt{x^2+x}+x$ e ottengo $\frac{x}{\sqrt{x^2+x}+x}\to\frac12$`,
        String.raw`Scrivo $\sqrt{x^2+x}=x\sqrt{1+\frac1x}$ e uso $\sqrt{1+t}-1\sim\frac t2$`,
      ],
      answer: 0,
      explain: String.raw`$\infty-\infty$ non vale 0: è indeterminata. Gli altri due metodi sono corretti e danno $\frac12$.`,
    },
    {
      id: 's05.calcolo.p2', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to4}\frac{\sqrt x-2}{x^2-16}$.`,
      answer: '1/32',
      explain: String.raw`$x^2-16=(x-4)(x+4)$ e $\sqrt x-2=\frac{x-4}{\sqrt x+2}$. Quindi la frazione è $\frac{1}{(\sqrt x+2)(x+4)}\to\frac{1}{4\cdot8}=\frac1{32}$.`,
    },
    {
      id: 's05.calcolo.p3', type: 'num', level: 2,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to-\infty}\frac{\sqrt{4x^2+1}}{x+5}$.`,
      answer: '-2',
      explain: String.raw`$\sqrt{4x^2+1}=|x|\sqrt{4+\frac1{x^2}}=-x\sqrt{4+\frac1{x^2}}$ per $x<0$. Il rapporto tende a $\frac{-2x}{x}=-2$ (errore tipico: $+2$).`,
    },
    {
      id: 's05.calcolo.p4', type: 'tf', level: 1,
      prompt: String.raw`$\displaystyle\lim_{x\to+\infty}\left(1+\frac1x\right)^{x}=1$, perché la base tende a 1 e $1$ elevato a qualunque cosa fa $1$.`,
      answer: false,
      explain: String.raw`$1^\infty$ è indeterminata: questo limite vale $e$ (limite notevole). «$1$ elevato a qualunque cosa» vale solo se la base è **esattamente** 1.`,
    },
    {
      id: 's05.calcolo.p5', type: 'num', level: 3,
      prompt: String.raw`Calcola $\displaystyle\lim_{x\to1}\frac{x^3-3x+2}{x^2-2x+1}$.`,
      answer: '3',
      explain: String.raw`Ruffini: $x^3-3x+2=(x-1)(x^2+x-2)=(x-1)^2(x+2)$, e $x^2-2x+1=(x-1)^2$. Resta $x+2\to3$.`,
    },
    {
      id: 's05.calcolo.p6', type: 'order', level: 2,
      prompt: String.raw`Riordina il calcolo di $\displaystyle\lim_{x\to0}\frac{\sqrt{1+x}-\sqrt{1-x}}{x}$.`,
      steps: [
        String.raw`Sostituendo si ottiene $\frac00$: forma indeterminata.`,
        String.raw`Moltiplico e divido per $\sqrt{1+x}+\sqrt{1-x}$.`,
        String.raw`Il numeratore diventa $(1+x)-(1-x)=2x$.`,
        String.raw`Semplifico $x$: $\dfrac{2}{\sqrt{1+x}+\sqrt{1-x}}$.`,
        String.raw`Sostituisco $x=0$: il limite è $\frac22=1$.`,
      ],
      distractors: [String.raw`Il numeratore diventa $(1+x)+(1-x)=2$.`],
      explain: String.raw`Il prodotto per il coniugato dà la **differenza** dei radicandi, $2x$, che si semplifica con il denominatore.`,
    },
  ],
  flashcards: [
    { id: 's05.calcolo.fc1', kind: 'thm', front: 'Algebra dei limiti', back: String.raw`Se $f\to L$, $g\to M$ finiti: $f\pm g\to L\pm M$, $fg\to LM$, $f/g\to L/M$ se $M\neq0$. Con $\pm\infty$ si usa l'aritmetica estesa, salvo le forme indeterminate.` },
    { id: 's05.calcolo.fc2', kind: 'formula', front: 'Le 7 forme indeterminate', back: String.raw`$+\infty-\infty,\ 0\cdot\infty,\ \frac\infty\infty,\ \frac00,\ 1^\infty,\ 0^0,\ \infty^0$.` },
    { id: 's05.calcolo.fc3', kind: 'formula', front: 'Aritmetica estesa (casi non indeterminati)', back: String.raw`$L\pm\infty=\pm\infty$; $L\cdot\infty=\pm\infty$ ($L\ne0$); $\frac{L}{\infty}=0$; $\frac{L}{0^\pm}=\pm\infty$ ($L\ne0$); $a^{+\infty}=+\infty$ se $a>1$, $=0$ se $0\le a<1$.` },
    { id: 's05.calcolo.fc4', kind: 'metodo', front: String.raw`Limite di una razionale per $x\to\pm\infty$`, back: String.raw`Raccogli il termine di grado massimo. Grado num < den: $0$. Uguali: rapporto dei coefficienti direttivi. Num > den: $\pm\infty$ con il segno di $\frac{a_p}{b_q}x^{p-q}$.` },
    { id: 's05.calcolo.fc5', kind: 'metodo', front: String.raw`Forma $\frac00$ con polinomi in $x_0$`, back: String.raw`Entrambi hanno il fattore $(x-x_0)$ (Ruffini): scomponi, semplifica, sostituisci.` },
    { id: 's05.calcolo.fc6', kind: 'metodo', front: 'Razionalizzazione', back: String.raw`$\sqrt A-\sqrt B=\frac{A-B}{\sqrt A+\sqrt B}$; per le cubiche $a-b=\frac{a^3-b^3}{a^2+ab+b^2}$. Utile per $\infty-\infty$ e $\frac00$ con radici. Risultato utile: $\sqrt{x^2+bx+c}-x\to\frac b2$ ($x\to+\infty$).` },
    { id: 's05.calcolo.fc7', kind: 'errore', front: String.raw`$\sqrt{x^2}$ per $x\to-\infty$`, back: String.raw`$\sqrt{x^2}=|x|=-x$ se $x<0$. Raccogliendo sotto radice a $-\infty$ compare un segno meno.` },
    { id: 's05.calcolo.fc8', kind: 'thm', front: 'Limite di funzione composta', back: String.raw`Se $g(x)\to y_0$ per $x\to x_0$, $f(y)\to L$ per $y\to y_0$, e $g(x)\ne y_0$ vicino a $x_0$ (o $f$ continua in $y_0$), allora $f(g(x))\to L$.` },
    { id: 's05.calcolo.fc9', kind: 'thm', front: 'Teorema del confronto (carabinieri)', back: String.raw`Se $g\le f\le h$ vicino a $x_0$ e $g,h\to L$, allora $f\to L$. Corollario: limitata × infinitesima $\to0$.` },
    { id: 's05.calcolo.fc10', kind: 'metodo', front: String.raw`Forme $1^\infty$, $0^0$, $\infty^0$`, back: String.raw`Scrivi $f^g=e^{g\log f}$ e calcola il limite dell'esponente (diventa $0\cdot\infty$). Prima controlla la base: se tende a $a\ne1$ con esponente $\to\infty$ non è indeterminata.` },
  ],
});
