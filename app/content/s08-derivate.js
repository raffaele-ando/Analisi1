// Sezione s08 · Derivate
// Le skill sono aggiunte in fondo con SKILLS.push(...): l'oggetto esportato
// contiene lo stesso array, quindi le aggiunte successive vi compaiono.
import { H } from '../engine/tex.js';

const SKILLS = [];

export default {
  id: 's08',
  title: 'Derivate',
  subtitle: 'Rapporto incrementale, regole, teoremi, convessità',
  intro: String.raw`La derivata misura quanto una funzione cambia da un punto al successivo: è la pendenza della tangente al grafico. All'esame compare in tutte le parti: la definizione e i teoremi (Fermat, Rolle, Lagrange, De l'Hôpital) sono domande di teoria, mentre le derivate servono per lo studio di funzione (punti critici, monotonia, convessità, flessi), che occupa gran parte della Parte B.`,
  skills: SKILLS,
};

// ---------- helper locali per i generatori ----------
/** termine "+ 3x" / "- x" / "" (c = 0) */
const term = (c, v) => (c === 0 ? '' : ` ${c < 0 ? '-' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${v}`);

// ===========================================================================
// s08.def · Definizione di derivata
// ===========================================================================
SKILLS.push({
  id: 's08.def',
  title: 'Definizione di derivata',
  summary: String.raw`Calcoli il rapporto incrementale, lo fai tendere a zero e riconosci la derivata come pendenza della tangente.`,
  prereq: ['s05.notevoli', 's07.def'],
  examRefs: ['Itinere 11/11/2025 · Parte A', 'Appello 15/01/2026 · Parte A', 'Appello 06/07/2026 · Parte A'],
  lessons: [
    {
      id: 's08.def.L1',
      title: 'Il rapporto incrementale',
      cards: [
        {
          type: 'learn',
          title: 'Idea: quanto cresce, in media?',
          body: String.raw`Prendi una funzione $f$ e due punti del grafico, $x_0$ e $x_0+h$ (con $h\neq0$). La **secante** che li unisce ha pendenza
$$\frac{f(x_0+h)-f(x_0)}{h}.$$
Questo numero si chiama **rapporto incrementale**: è la variazione di $f$ divisa per la variazione di $x$, cioè la crescita media di $f$ nell'intervallo di lunghezza $h$.

Se $h$ diventa sempre più piccolo, la secante si "stringe" e diventa la **tangente** in $x_0$. La derivata è il valore a cui tende il rapporto incrementale.`,
          plot: { fns: [{ f: 'x^2', label: 'f' }, { f: '3x-2', label: 'secante' }], x: [-0.5, 3], y: [-1, 8], points: [[1, 1, 'P'], [2, 4, 'Q']] },
        },
        {
          id: 's08.def.L1.q1',
          type: 'mcq',
          prompt: String.raw`Il rapporto $\frac{f(x_0+h)-f(x_0)}{h}$ rappresenta la pendenza di:`,
          options: [
            String.raw`la retta **secante** per i punti $(x_0,f(x_0))$ e $(x_0+h,f(x_0+h))$`,
            String.raw`la retta tangente al grafico in $x_0$, sempre`,
            String.raw`l'asintoto obliquo di $f$`,
            String.raw`il rapporto $f(x_0)/x_0$`,
          ],
          answer: 0,
          explain: String.raw`Il rapporto incrementale è la pendenza della secante che unisce due punti del grafico. Diventa la pendenza della **tangente** solo nel limite $h\to0$: prima del limite è una secante. Gli altri distrattori non hanno senso: la tangente compare solo al limite, l'asintoto non dipende da $h$, e $f(x_0)/x_0$ non contiene $h$.`,
        },
        {
          id: 's08.def.L1.q2',
          type: 'num',
          prompt: String.raw`Calcola il rapporto incrementale di $f(x)=x^2$ tra $x_0=1$ e $x_0+h=3$.`,
          answer: '4',
          explain: String.raw`Qui $h=2$, $f(3)=9$ e $f(1)=1$: $\frac{9-1}{2}=4$. È la pendenza della retta che passa per $(1,1)$ e $(3,9)$.`,
        },
        {
          id: 's08.def.L1.q3',
          type: 'expr',
          prompt: String.raw`Scrivi il rapporto incrementale di $f(x)=x^2$ in $x_0=1$ come funzione di $h$, semplificato.`,
          answer: '2+h',
          vars: ['h'],
          explain: String.raw`$f(1+h)-f(1)=(1+2h+h^2)-1=2h+h^2$. Dividi per $h$: $\frac{2h+h^2}{h}=2+h$. La forma $\frac{(1+h)^2-1}{h}$ è corretta, ma la forma semplificata $2+h$ mostra subito che per $h\to0$ il rapporto tende a $2$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: rapporto incrementale di $x^2$',
          problem: String.raw`Calcola il rapporto incrementale di $f(x)=x^2$ in un punto generico $x$, con incremento $h$.`,
          steps: [
            String.raw`Scrivo il rapporto: $\frac{f(x+h)-f(x)}{h}=\frac{(x+h)^2-x^2}{h}$.`,
            String.raw`Sviluppo il quadrato: $(x+h)^2-x^2=x^2+2xh+h^2-x^2=2xh+h^2$.`,
            String.raw`Divido per $h$ (possibile perché $h\neq0$): $\frac{2xh+h^2}{h}=2x+h$.`,
          ],
          result: String.raw`Il rapporto incrementale è $2x+h$. Per $h\to0$ tende a $2x$, che è la pendenza della tangente in $x$.`,
        },
        {
          type: 'learn',
          title: 'Dalla secante alla tangente',
          body: String.raw`Fissa $x_0$ e fai tendere $h$ a zero: il punto $Q$ scivola verso $P$ e la secante ruota fino a diventare la **tangente** al grafico in $P$.

Se il limite del rapporto incrementale esiste **finito** e vale $m$, allora $m$ è la **derivata** di $f$ in $x_0$ e la tangente ha equazione
$$y=f(x_0)+m\,(x-x_0).$$
Nel grafico: $f=x^2$ e la sua tangente in $x_0=1$, cioè $y=2x-1$.`,
          plot: { fns: [{ f: 'x^2', label: 'f' }, { f: '2x-1', label: 'tangente' }], x: [-0.5, 3], y: [-1, 8], points: [[1, 1, 'P']] },
        },
        {
          type: 'example',
          title: 'Esempio a completamento: derivata di $x^3$',
          problem: String.raw`Usa la definizione per trovare $f'(x)$ se $f(x)=x^3$.`,
          steps: [
            String.raw`Rapporto incrementale: $\frac{(x+h)^3-x^3}{h}$. Sviluppo il cubo: $(x+h)^3=x^3+3x^2h+3xh^2+h^3$.`,
            {
              text: String.raw`Il numeratore diventa $3x^2h+3xh^2+h^3$, quindi il rapporto è $\frac{3x^2h+3xh^2+h^3}{h}$. Semplifica.`,
              ask: {
                type: 'expr',
                prompt: String.raw`Quanto fa $\frac{3x^2h+3xh^2+h^3}{h}$?`,
                answer: '3*x^2+3*x*h+h^2',
                vars: ['x', 'h'],
                explain: String.raw`Raccogli $h$ al numeratore: $h(3x^2+3xh+h^2)$. Dividi per $h$ e ottieni $3x^2+3xh+h^2$.`,
              },
            },
            {
              text: String.raw`Ora passa al limite per $h\to0$: i termini che contengono $h$ spariscono.`,
              ask: {
                type: 'mcq',
                prompt: String.raw`Quanto vale $\lim_{h\to0}(3x^2+3xh+h^2)$?`,
                options: [String.raw`$3x^2$`, String.raw`$0$`, String.raw`$3x^2+h^2$`, String.raw`$+\infty$`],
                answer: 0,
                explain: String.raw`Con $h\to0$ restano solo i termini senza $h$, cioè $3x^2$. Lo $0$ è sbagliato: il termine $3x^2$ non contiene $h$, quindi non si annulla.`,
              },
            },
          ],
          result: String.raw`$D(x^3)=3x^2$, cioè $f'(x)=3x^2$.`,
        },
        {
          id: 's08.def.L1.q4',
          type: 'mcq',
          prompt: String.raw`Se $\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}=m$ con $m\in\R$, quale affermazione è vera?`,
          options: [
            String.raw`$f$ è derivabile in $x_0$, con $f'(x_0)=m$, e la tangente è $y=f(x_0)+m(x-x_0)$`,
            String.raw`$f(x_0)=m$`,
            String.raw`La tangente in $x_0$ passa sempre per l'origine`,
            String.raw`$f$ è continua in $x_0$ ma non derivabile`,
          ],
          answer: 0,
          explain: String.raw`Un limite finito del rapporto incrementale è la definizione di derivabilità: $f'(x_0)=m$ e la tangente ha quell'equazione. $f(x_0)$ è un valore della funzione, non una pendenza. La tangente non passa per l'origine in generale. L'ultima opzione si contraddice: se la derivata è finita, la funzione è continua.`,
        },
        {
          id: 's08.def.L1.q5',
          type: 'tf',
          prompt: String.raw`Vero o falso? Per $f(x)=\sqrt[3]{x}$ in $x_0=0$ il rapporto incrementale $\frac{\sqrt[3]{h}}{h}=\frac{1}{\sqrt[3]{h^2}}$ tende a $+\infty$ per $h\to0$, quindi $f$ non ha derivata finita in $0$.`,
          answer: true,
          explain: String.raw`Vero. Il rapporto vale $h^{-2/3}$, che è positivo da entrambi i lati e cresce senza limite. Il grafico ha **tangente verticale** in $0$: la derivata non è un numero finito.`,
        },
        {
          id: 's08.def.L1.q6',
          type: 'num',
          prompt: String.raw`Calcola il rapporto incrementale di $f(x)=x^2$ in $x_0=-1$ con incremento $h=\frac12$.`,
          answer: '-3/2',
          explain: String.raw`$f(-1+\frac12)=f(-\frac12)=\frac14$ e $f(-1)=1$. Quindi $\frac{\frac14-1}{\frac12}=-\frac32$. Il segno è negativo: la funzione scende tra $-1$ e $-\frac12$.`,
        },
      ],
    },
    {
      id: 's08.def.L2',
      title: 'La derivata come limite',
      cards: [
        {
          type: 'learn',
          title: 'Definizione di derivata',
          body: String.raw`La **derivata** di $f$ in $x_0$ è il limite del rapporto incrementale, quando esiste finito.

>* **Definizione.** $f$ è **derivabile** in $x_0$ se esiste finito il limite
$$f'(x_0)=\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}.$$

Scritto con $x$ al posto di $x_0+h$ (cioè $h=x-x_0$) la definizione diventa $\lim_{x\to x_0}\frac{f(x)-f(x_0)}{x-x_0}$: è la stessa cosa. Altre notazioni: $\frac{df}{dx}(x_0)$, $Df(x_0)$.`,
        },
        {
          id: 's08.def.L2.q1',
          type: 'mcq',
          prompt: String.raw`Quale espressione definisce la derivata di $f$ in $x_0$?`,
          options: [
            String.raw`$\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}$`,
            String.raw`$\lim_{h\to0}\big(f(x_0+h)-f(x_0)\big)$`,
            String.raw`$\lim_{h\to0}\frac{f(h)}{h}$`,
            String.raw`$\frac{f(x_0)}{x_0}$`,
          ],
          answer: 0,
          explain: String.raw`La prima è la definizione. La seconda dimentica la divisione per $h$: il limite vale $0$ per ogni funzione continua e non dice nulla sulla pendenza. La terza usa $h$ al posto di $x_0+h$. La quarta è un numero, non un limite.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: derivata di $\\sqrt{x}$',
          problem: String.raw`Calcola $f'(x)$ per $f(x)=\sqrt{x}$, con $x>0$.`,
          steps: [
            String.raw`Rapporto incrementale: $\frac{\sqrt{x+h}-\sqrt{x}}{h}$. Il numeratore non si semplifica: moltiplico sopra e sotto per il coniugato $\sqrt{x+h}+\sqrt{x}$.`,
            String.raw`Al numeratore resta $(x+h)-x=h$, quindi il rapporto diventa $\frac{h}{h\,(\sqrt{x+h}+\sqrt{x})}$.`,
            String.raw`Divido per $h\neq0$: $\frac{1}{\sqrt{x+h}+\sqrt{x}}$. Per $h\to0$ il denominatore tende a $2\sqrt{x}$.`,
          ],
          result: String.raw`$D\sqrt{x}=\frac{1}{2\sqrt{x}}$ per $x>0$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: derivata di $e^x$',
          problem: String.raw`Usa la definizione per calcolare $D(e^x)$.`,
          steps: [
            String.raw`Rapporto: $\frac{e^{x+h}-e^x}{h}$. Per le proprietà delle potenze $e^{x+h}=e^x e^h$, quindi raccolgo $e^x$: $\frac{e^{x+h}-e^x}{h}=e^x\cdot\frac{e^h-1}{h}$.`,
            {
              text: String.raw`Il fattore $e^x$ non dipende da $h$, quindi esce dal limite. Resta da calcolare il limite del secondo fattore.`,
              ask: {
                type: 'mcq',
                prompt: String.raw`Quanto vale $\lim_{h\to0}\frac{e^h-1}{h}$?`,
                options: [String.raw`$0$`, String.raw`$1$`, String.raw`$e$`, String.raw`$+\infty$`],
                answer: 1,
                explain: String.raw`È il limite notevole $\lim_{h\to0}\frac{e^h-1}{h}=1$ (lo trovi in s05.notevoli). Il valore $e$ è il limite di $e^h$, non del rapporto.`,
              },
            },
          ],
          result: String.raw`$D(e^x)=e^x\cdot1=e^x$. La funzione esponenziale è uguale alla propria derivata.`,
        },
        {
          id: 's08.def.L2.q2',
          type: 'expr',
          prompt: String.raw`Con la definizione, calcola $f'(x)$ se $f(x)=\sin x$. Usa $\sin(x+h)=\sin x\cos h+\cos x\sin h$ e i limiti notevoli.`,
          answer: 'cos(x)',
          vars: ['x'],
          hint: String.raw`Raccogli separatamente $\sin x$ e $\cos x$ nel numeratore.`,
          explain: String.raw`$\frac{\sin(x+h)-\sin x}{h}=\sin x\cdot\frac{\cos h-1}{h}+\cos x\cdot\frac{\sin h}{h}$. Per $h\to0$: $\frac{\cos h-1}{h}\to0$ e $\frac{\sin h}{h}\to1$. Il risultato è $\cos x$.`,
        },
        {
          id: 's08.def.L2.q3',
          type: 'tf',
          prompt: String.raw`Vero o falso? Se $f$ è **continua** in $x_0$, allora $f$ è **derivabile** in $x_0$.`,
          answer: false,
          explain: String.raw`Falso. Controesempio: $f(x)=|x|$ è continua in $0$, ma il rapporto incrementale è $\frac{|h|}{h}$, che vale $+1$ per $h>0$ e $-1$ per $h<0$: il limite non esiste. Il viceversa, **derivabile ⇒ continua**, è invece vero (lo vedrai in s08.punti).`,
        },
        {
          id: 's08.def.L2.q4',
          type: 'open',
          points: 2,
          prompt: String.raw`Scrivi la definizione di derivata di $f$ in $x_0$ e spiega il suo significato geometrico.`,
          answer: String.raw`$f$ è derivabile in $x_0$ se esiste finito $\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}$, e il valore del limite è $f'(x_0)$. Il rapporto incrementale è la pendenza della secante per $(x_0,f(x_0))$ e $(x_0+h,f(x_0+h))$. Al limite la secante diventa la tangente al grafico in $x_0$, di equazione $y=f(x_0)+f'(x_0)(x-x_0)$.`,
          rubric: [
            String.raw`Rapporto incrementale con la divisione per $h$ (o per $x-x_0$)`,
            String.raw`Limite per $h\to0$ che deve risultare finito`,
            String.raw`Significato: pendenza della secante, che al limite diventa la pendenza della tangente`,
            String.raw`Equazione della tangente, oppure notazione $f'(x_0)$`,
          ],
        },
        {
          id: 's08.def.L2.q5',
          type: 'num',
          prompt: String.raw`Qual è $f'(2)$ se $f(x)=x^3$?`,
          answer: '12',
          explain: String.raw`Dalla formula $D(x^3)=3x^2$ ricavata con la definizione, $f'(2)=3\cdot2^2=12$.`,
        },
      ],
    },
    {
      id: 's08.def.L3',
      title: 'Derivate con la definizione: livello d\'esame',
      cards: [
        {
          type: 'learn',
          title: 'Limiti notevoli che servono nelle derivate',
          body: String.raw`Quando calcoli un rapporto incrementale ottieni quasi sempre uno di questi limiti. Ricordali: sono il cuore del calcolo.
$$\lim_{h\to0}\frac{e^h-1}{h}=1,\qquad \lim_{h\to0}\frac{\sin h}{h}=1,\qquad \lim_{h\to0}\frac{1-\cos h}{h}=0,\qquad \lim_{h\to0}\frac{\log(1+h)}{h}=1.$$
Se $h$ compare anche dentro l'esponenziale o il seno, porta il coefficiente fuori dal limite notevole: per esempio $\frac{e^{3h}-1}{h}=3\cdot\frac{e^{3h}-1}{3h}\to3$.`,
        },
        {
          type: 'example',
          title: "Esempio svolto d'esame: derivata di $e^x+\\sin x$",
          problem: String.raw`Calcola con la definizione la derivata di $f(x)=e^x+\sin x$ in un punto generico $x$.`,
          steps: [
            String.raw`Il rapporto incrementale è la somma dei rapporti dei due addendi: $\frac{e^{x+h}-e^x}{h}+\frac{\sin(x+h)-\sin x}{h}$.`,
            String.raw`Il primo addendo, come nell'esempio precedente, tende a $e^x$.`,
            String.raw`Il secondo tende a $\cos x$: si ottiene da $\sin(x+h)=\sin x\cos h+\cos x\sin h$ e dai limiti notevoli.`,
            String.raw`>! Nota: nella soluzione ufficiale del tema del 06/07/2026 il termine di $\sin x$ compare con il segno sbagliato. Il risultato corretto è $\cos x$, con segno $+$.`,
          ],
          result: String.raw`$D(e^x+\sin x)=e^x+\cos x$.`,
        },
        {
          id: 's08.def.L3.q1',
          type: 'expr',
          prompt: String.raw`Con la definizione, calcola $D(e^{2x})$.`,
          answer: '2*e^(2*x)',
          vars: ['x'],
          explain: String.raw`$\frac{e^{2x+2h}-e^{2x}}{h}=e^{2x}\cdot\frac{e^{2h}-1}{h}=2e^{2x}\cdot\frac{e^{2h}-1}{2h}\to2e^{2x}$. Il fattore $2$ esce dal limite notevole perché $2h\to0$ insieme con $h$.`,
        },
        {
          id: 's08.def.L3.q2',
          type: 'num',
          prompt: String.raw`Calcola $\lim_{h\to0}\frac{e^{3h}-1}{h}$.`,
          answer: '3',
          explain: String.raw`Porta $3$ dentro: $\frac{e^{3h}-1}{h}=3\cdot\frac{e^{3h}-1}{3h}\to3\cdot1=3$. Questo limite è anche la derivata di $e^{3x}$ in $x=0$.`,
        },
        {
          id: 's08.def.L3.q3',
          type: 'expr',
          prompt: String.raw`Con la definizione, calcola $D(\cos x)$.`,
          answer: '-sin(x)',
          vars: ['x'],
          explain: String.raw`$\cos(x+h)=\cos x\cos h-\sin x\sin h$, quindi $\frac{\cos(x+h)-\cos x}{h}=\cos x\cdot\frac{\cos h-1}{h}-\sin x\cdot\frac{\sin h}{h}\to-\sin x$. Il segno meno è la differenza con $\sin x$.`,
        },
        {
          id: 's08.def.L3.q4',
          type: 'mcq',
          prompt: String.raw`Per $f(x)=\sqrt{x}$ con $f(0)=0$, qual è la derivata in $x_0=0$ calcolata con la definizione?`,
          options: [
            String.raw`Non esiste: il rapporto $\frac{\sqrt{h}}{h}=\frac{1}{\sqrt{h}}$ tende a $+\infty$`,
            String.raw`$0$, perché $f(0)=0$`,
            String.raw`$\frac12$, dalla formula $D\sqrt{x}=\frac{1}{2\sqrt{x}}$`,
            String.raw`$1$`,
          ],
          answer: 0,
          explain: String.raw`Il rapporto incrementale è $\frac{\sqrt{h}}{h}=\frac{1}{\sqrt h}\to+\infty$: non esiste derivata finita. Il distrattore $0$ confonde il valore $f(0)$ con la derivata; il distrattore $\frac12$ applica una formula valida solo per $x>0$, dove $\sqrt{x}$ è derivabile.`,
        },
        {
          id: 's08.def.L3.q5',
          type: 'problem',
          level: 3,
          points: 4,
          prompt: String.raw`Sia $f(x)=e^x+\sin x$. (a) Calcola $f'(x)$ con la definizione. (b) Calcola $f'(0)$. (c) Scrivi l'equazione della tangente al grafico nel punto di ascissa $0$.`,
          parts: [
            {
              type: 'expr',
              prompt: String.raw`(a) $f'(x)$`,
              answer: 'e^x+cos(x)',
              vars: ['x'],
              explain: String.raw`Somma dei due rapporti: $e^x$ dal primo addendo, $\cos x$ dal secondo (vedi l'esempio svolto).`,
            },
            {
              type: 'num',
              prompt: String.raw`(b) $f'(0)$`,
              answer: '2',
              explain: String.raw`$f'(0)=e^0+\cos0=1+1=2$.`,
            },
            {
              type: 'expr',
              prompt: String.raw`(c) Equazione della tangente in $x=0$, come $y$ in funzione di $x$.`,
              answer: '2*x+1',
              vars: ['x'],
              explain: String.raw`$f(0)=e^0+\sin0=1$ e $f'(0)=2$. Tangente: $y=1+2(x-0)=2x+1$.`,
            },
          ],
          solution: String.raw`(a) $\frac{e^{x+h}-e^x}{h}+\frac{\sin(x+h)-\sin x}{h}\to e^x+\cos x$, quindi $f'(x)=e^x+\cos x$. (b) $f'(0)=2$. (c) $f(0)=1$, quindi $y=1+2x$.`,
        },
        {
          type: 'learn',
          title: 'Procedura in quattro passi',
          body: String.raw`Ogni derivata con la definizione segue lo stesso schema:
1. scrivi $\frac{f(x_0+h)-f(x_0)}{h}$, con i valori corretti al numeratore;
2. sviluppa, raccogli $h$ e semplifica la divisione per $h$;
3. calcola il limite per $h\to0$, usando i limiti notevoli;
4. se il limite è **finito** hai trovato $f'(x_0)$; se è $\pm\infty$ la tangente è verticale e $f$ non è derivabile in $x_0$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's08.def.p1',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const a = R.nz(-3, 3), b = R.int(-5, 5), k = R.int(-3, 3);
        const m = 2 * a * k + b;
        return {
          type: 'num',
          prompt: String.raw`Con la definizione di derivata, calcola $f'(${k})$ se $f(x)=${H.poly([a, b, 0])}$.`,
          answer: String(m),
          explain: String.raw`Il rapporto incrementale è $2\cdot(${a})\cdot(${k})+(${b})+(${a})h$, che per $h\to0$ tende a $${m}$.`,
        };
      },
    },
    {
      id: 's08.def.p2',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const a = R.nz(-3, 3), b = R.int(-4, 4), x0 = R.int(-3, 2), d = R.pick([1, 2, 3]);
        const x1 = x0 + d;
        const f0 = a * x0 * x0 + b * x0, f1 = a * x1 * x1 + b * x1;
        const s = (f1 - f0) / d;
        return {
          type: 'num',
          prompt: String.raw`Calcola la pendenza della secante del grafico di $f(x)=${H.poly([a, b, 0])}$ tra $x=${x0}$ e $x=${x1}$.`,
          answer: String(s),
          explain: String.raw`$f(${x1})=${f1}$ e $f(${x0})=${f0}$: la pendenza è $\frac{${f1}-(${f0})}{${x1}-(${x0})}=${s}$.`,
        };
      },
    },
    {
      id: 's08.def.p3',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.nz(-2, 2), b = R.int(-4, 4), c = R.int(-4, 4), x0 = R.int(-2, 2);
        const f0 = a * x0 * x0 + b * x0 + c;
        const m = 2 * a * x0 + b;
        const q = f0 - m * x0;
        return {
          type: 'expr',
          prompt: String.raw`Scrivi la retta tangente al grafico di $f(x)=${H.poly([a, b, c])}$ nel punto di ascissa $x=${x0}$, come $y$ in funzione di $x$.`,
          answer: `${m}*x+(${q})`,
          vars: ['x'],
          explain: String.raw`$f(${x0})=${f0}$ e $f'(${x0})=2\cdot(${a})\cdot(${x0})+(${b})=${m}$. Tangente: $y=${f0}+(${m})(x-(${x0}))=${H.lin(m, q)}$.`,
        };
      },
    },
    {
      id: 's08.def.p4',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const k = R.pick([-3, -2, 2, 3, 4]);
        return {
          type: 'expr',
          prompt: String.raw`Con la definizione, calcola $f'(x)$ se $f(x)=e^{${k}x}$.`,
          answer: `${k}*e^(${k}*x)`,
          vars: ['x'],
          explain: String.raw`$\frac{e^{${k}(x+h)}-e^{${k}x}}{h}=e^{${k}x}\cdot\frac{e^{${k}h}-1}{h}=${k}\,e^{${k}x}\cdot\frac{e^{${k}h}-1}{${k}h}\to${k}\,e^{${k}x}$.`,
        };
      },
    },
    {
      id: 's08.def.p5',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const n = R.pick([2, 3, 4]), x0 = R.pick([-2, -1, 1, 2, 3]);
        const ans = n * x0 ** (n - 1);
        return {
          type: 'num',
          prompt: String.raw`Calcola $f'(${x0})$ se $f(x)=x^{${n}}$.`,
          answer: String(ans),
          explain: String.raw`Dalla formula $D(x^{${n}})=${n}x^{${n - 1}}$, che si ricava con la definizione: $f'(${x0})=${n}\cdot(${x0})^{${n - 1}}=${ans}$.`,
        };
      },
    },
    {
      id: 's08.def.p6',
      type: 'mcq',
      prompt: String.raw`Se $f(x)=7$ per ogni $x$, quanto vale $f'(x_0)$?`,
      options: [String.raw`$0$`, String.raw`$7$`, String.raw`$1$`, String.raw`Non esiste`],
      answer: 0,
      explain: String.raw`Il rapporto incrementale è $\frac{7-7}{h}=0$ per ogni $h\neq0$, quindi il limite è $0$. Il grafico è una retta orizzontale, con pendenza $0$.`,
    },
    {
      id: 's08.def.p7',
      type: 'tf',
      prompt: String.raw`Vero o falso? Per $f(x)=x$ il rapporto incrementale vale $1$ per ogni $h\neq0$, quindi $f'(x)=1$.`,
      answer: true,
      explain: String.raw`Vero: $\frac{(x+h)-x}{h}=\frac{h}{h}=1$ per ogni $h\neq0$, e il limite è $1$.`,
    },
    {
      id: 's08.def.p8',
      type: 'num',
      prompt: String.raw`Calcola $\lim_{h\to0}\frac{(2+h)^2-4}{h}$.`,
      answer: '4',
      explain: String.raw`$(2+h)^2-4=4h+h^2$; dividendo per $h$ resta $4+h\to4$. È la derivata di $x^2$ in $x=2$.`,
    },
    {
      id: 's08.def.p9',
      type: 'expr',
      prompt: String.raw`Con la definizione, calcola $f'(x)$ se $f(x)=x^4$.`,
      answer: '4*x^3',
      vars: ['x'],
      explain: String.raw`$(x+h)^4-x^4=4x^3h+6x^2h^2+4xh^3+h^4$. Dividendo per $h$ e facendo $h\to0$ resta $4x^3$.`,
    },
    {
      id: 's08.def.p10',
      type: 'tf',
      prompt: String.raw`Vero o falso? Se $f$ è derivabile in $x_0$, la retta $y=f(x_0)+f'(x_0)(x-x_0)$ è la tangente al grafico in $x_0$.`,
      answer: true,
      explain: String.raw`Vero: la pendenza della tangente è la derivata e la retta passa per il punto $(x_0,f(x_0))$.`,
    },
    {
      id: 's08.def.p11',
      type: 'mcq',
      prompt: String.raw`Il limite per $h\to0$ del rapporto incrementale di $f$ in $x_0$ si chiama:`,
      options: [String.raw`derivata prima di $f$ in $x_0$`, String.raw`integrale di $f$ su $[x_0,x_0+h]$`, String.raw`primitiva di $f$`, String.raw`valore medio di $f$`],
      answer: 0,
      explain: String.raw`Per definizione il limite del rapporto incrementale è la derivata. L'integrale e la primitiva sono altri concetti (sezione s11); il valore medio è un altro numero, che non dipende dal limite per $h\to0$.`,
    },
  ],
  flashcards: [
    {
      id: 's08.def.fc1',
      kind: 'def',
      front: String.raw`Rapporto incrementale di $f$ in $x_0$ (con $h\neq0$)`,
      back: String.raw`$\frac{f(x_0+h)-f(x_0)}{h}$: la pendenza della **secante** per $(x_0,f(x_0))$ e $(x_0+h,f(x_0+h))$.`,
    },
    {
      id: 's08.def.fc2',
      kind: 'def',
      front: String.raw`Derivabilità di $f$ in $x_0$`,
      back: String.raw`Esiste **finito** $f'(x_0)=\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}$.`,
    },
    {
      id: 's08.def.fc3',
      kind: 'def',
      front: String.raw`Significato geometrico della derivata`,
      back: String.raw`Pendenza della **tangente** al grafico in $(x_0,f(x_0))$: $y=f(x_0)+f'(x_0)(x-x_0)$.`,
    },
    {
      id: 's08.def.fc4',
      kind: 'formula',
      front: String.raw`Derivate elementari (da ricavare con la definizione)`,
      back: String.raw`$D(c)=0$, $D(x)=1$, $D(x^n)=nx^{n-1}$, $D(e^x)=e^x$, $D(\sin x)=\cos x$, $D(\cos x)=-\sin x$.`,
    },
    {
      id: 's08.def.fc5',
      kind: 'metodo',
      front: String.raw`Calcolo di una derivata con la definizione`,
      back: String.raw`1) Scrivi $\frac{f(x_0+h)-f(x_0)}{h}$; 2) sviluppa e raccogli $h$; 3) semplifica la divisione per $h$; 4) fai $h\to0$ con i limiti notevoli.`,
    },
    {
      id: 's08.def.fc6',
      kind: 'errore',
      front: String.raw`Errore tipico: "la derivata è $\lim_{h\to0}\big(f(x_0+h)-f(x_0)\big)$"`,
      back: String.raw`Manca la divisione per $h$. Senza di essa il limite vale $0$ per ogni funzione continua e non dice nulla sulla pendenza.`,
    },
    {
      id: 's08.def.fc7',
      kind: 'errore',
      front: String.raw`Il rapporto incrementale tende a $+\infty$: la funzione è derivabile?`,
      back: String.raw`No. Un limite infinito significa tangente verticale: la derivata non è finita, quindi $f$ non è derivabile in senso stretto in quel punto.`,
    },
  ],
});
