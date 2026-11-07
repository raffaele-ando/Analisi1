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

// ===========================================================================
// s08.regole · Algebra delle derivate, funzione composta
// ===========================================================================
SKILLS.push({
  id: 's08.regole',
  title: 'Regole di derivazione',
  summary: String.raw`Derivi somme, prodotti, quozienti e funzioni composte senza ricorrere alla definizione, e riconosci gli errori tipici.`,
  prereq: ['s08.def'],
  examRefs: ['Itinere 11/11/2025 · Parte B', 'Appello 15/01/2026 · Parte B', 'Appello 10/02/2026 · Parte B', 'Appello 03/09/2026 · Parte B'],
  lessons: [
    {
      id: 's08.regole.L1',
      title: 'Somme, costanti e potenze',
      cards: [
        {
          type: 'learn',
          title: 'Le regole di base',
          body: String.raw`Con la definizione si ottengono subito alcune regole. Se $f$ e $g$ sono derivabili in $x$ e $c\in\R$:
>* **Linearità.** $D(f+g)=f'+g'$ e $D(cf)=c\,f'$. La derivata si distribuisce su somme e costanti.
>* **Potenze.** $D(x^n)=n\,x^{n-1}$ per ogni $n$ intero; $D(\sqrt{x})=\frac{1}{2\sqrt{x}}$ per $x>0$.
>* **Costanti.** $D(c)=0$: una costante non cambia mai.

Esempio: $D(3x^2-5x+7)=3\cdot2x-5\cdot1+0=6x-5$. Il termine $7$ sparisce, il termine $-5x$ diventa $-5$.`,
        },
        {
          id: 's08.regole.L1.q1',
          type: 'mcq',
          prompt: String.raw`Quanto vale $D(x^2\cdot x^3)$?`,
          options: [
            String.raw`$5x^4$`,
            String.raw`$6x^3$`,
            String.raw`$x^5$`,
            String.raw`$4x^4$`,
          ],
          answer: 0,
          explain: String.raw`Prima semplifica: $x^2\cdot x^3=x^5$, quindi $D(x^5)=5x^4$. Il distrattore $6x^3$ moltiplica le derivate, $(2x)(3x^2)$: è l'errore più comune, e non è una regola (la derivata del prodotto ha una forma diversa, vedi la lezione successiva). $x^5$ è la funzione, non la sua derivata. $4x^4$ sbaglia l'esponente.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: polinomio',
          problem: String.raw`Calcola $f'(x)$ per $f(x)=x^5-3x^2+4x$.`,
          steps: [
            String.raw`Applica la linearità: $D(x^5-3x^2+4x)=D(x^5)-3D(x^2)+4D(x)$.`,
            String.raw`Usa $D(x^n)=nx^{n-1}$ per ogni termine: $D(x^5)=5x^4$, $D(x^2)=2x$, $D(x)=1$.`,
            String.raw`Metti insieme: $5x^4-3\cdot2x+4\cdot1=5x^4-6x+4$.`,
          ],
          result: String.raw`$f'(x)=5x^4-6x+4$.`,
        },
        {
          id: 's08.regole.L1.q2',
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=x^4-3x^2+5x-1$.`,
          answer: '4*x^3-6*x+5',
          vars: ['x'],
          explain: String.raw`Ogni termine si deriva separatamente: $x^4\to4x^3$, $-3x^2\to-6x$, $5x\to5$, la costante $-1$ sparisce. Il risultato è $4x^3-6x+5$.`,
        },
        {
          id: 's08.regole.L1.q3',
          type: 'num',
          prompt: String.raw`Qual è $f'(2)$ se $f(x)=2x^3-x^2+4$?`,
          answer: '20',
          explain: String.raw`$f'(x)=6x^2-2x$, quindi $f'(2)=6\cdot4-2\cdot2=24-4=20$. Calcola prima la derivata e solo dopo sostituisci $x=2$.`,
        },
        {
          type: 'learn',
          title: 'Radici ed esponenti negativi',
          body: String.raw`La regola delle potenze vale anche per esponenti negativi e frazionari, con il dominio giusto:
$$D\left(\frac{1}{x}\right)=D(x^{-1})=-x^{-2}=-\frac{1}{x^2}\quad (x\neq0),\qquad D\left(\sqrt{x}\right)=D\left(x^{1/2}\right)=\frac{1}{2\sqrt{x}}\quad (x>0).$$
Attenzione: $\sqrt{x}$ non è derivabile in $0$ (la derivata diverge, come hai visto in s08.def). Il dominio della derivata può essere più piccolo di quello della funzione.`,
        },
        {
          id: 's08.regole.L1.q4',
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\sqrt{x}$, per $x>0$.`,
          answer: '1/(2*sqrt(x))',
          vars: ['x'],
          domain: [0.3, 2.7],
          explain: String.raw`Regola delle potenze con esponente $\frac12$: $D(x^{1/2})=\frac12x^{-1/2}=\frac{1}{2\sqrt x}$.`,
        },
        {
          id: 's08.regole.L1.q5',
          type: 'tf',
          prompt: String.raw`Vero o falso? $D\big(3\sqrt{x}\big)=\dfrac{3}{2\sqrt{x}}$ per $x>0$.`,
          answer: true,
          explain: String.raw`Vero. La costante $3$ esce dalla derivata: $3\cdot\frac{1}{2\sqrt x}=\frac{3}{2\sqrt x}$.`,
        },
      ],
    },
    {
      id: 's08.regole.L2',
      title: 'Prodotto e quoziente',
      cards: [
        {
          type: 'learn',
          title: 'Derivata del prodotto e del quoziente',
          body: String.raw`>* **Prodotto.** $D(fg)=f'g+fg'$.
>* **Quoziente.** Se $g(x)\neq0$: $D\left(\frac{f}{g}\right)=\frac{f'g-fg'}{g^2}$.

Nota che **la derivata del prodotto non è il prodotto delle derivate**: $D(fg)\neq f'g'$. Lo stesso vale per il quoziente. Per ricordare l'ordine nel quoziente: "derivata del numeratore per il denominatore, meno il numeratore per la derivata del denominatore, tutto su denominatore al quadrato".`,
        },
        {
          id: 's08.regole.L2.q1',
          type: 'mcq',
          prompt: String.raw`Quale è $D(x\,e^x)$?`,
          options: [
            String.raw`$(x+1)e^x$`,
            String.raw`$e^x$`,
            String.raw`$xe^x$`,
            String.raw`$x^2e^x$`,
          ],
          answer: 0,
          explain: String.raw`Regola del prodotto: $D(x)\,e^x+x\,D(e^x)=e^x+xe^x=(x+1)e^x$. Il distrattore $e^x$ dimentica il secondo addendo; $xe^x$ è la funzione di partenza; $x^2e^x$ sbaglia la regola del prodotto.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: prodotto',
          problem: String.raw`Calcola $f'(x)$ per $f(x)=x^2\sin x$.`,
          steps: [
            String.raw`Scrivo $f=g\cdot h$ con $g(x)=x^2$ e $h(x)=\sin x$. Quindi $g'=2x$ e $h'=\cos x$.`,
            String.raw`Regola del prodotto: $f'=g'h+gh'=2x\sin x+x^2\cos x$.`,
            String.raw`Non c'è semplificazione: il risultato è una somma di due termini.`,
          ],
          result: String.raw`$f'(x)=2x\sin x+x^2\cos x$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: quoziente',
          problem: String.raw`Calcola $f'(x)$ per $f(x)=\frac{2x+1}{x-1}$, con $x\neq1$.`,
          steps: [
            String.raw`Numeratore $n=2x+1$ con $n'=2$; denominatore $d=x-1$ con $d'=1$. Applico la regola: $f'=\frac{n'd-nd'}{d^2}$.`,
            {
              text: String.raw`Calcola il numeratore $n'd-nd'$ prima di tutto il resto.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $n'd-nd'=2(x-1)-(2x+1)\cdot1$? (Inserisci il valore costante.)`,
                answer: '-3',
                explain: String.raw`$2x-2-2x-1=-3$. Le $x$ si cancellano: il numeratore della derivata è una costante.`,
              },
            },
          ],
          result: String.raw`$f'(x)=\frac{-3}{(x-1)^2}=-\frac{3}{(x-1)^2}$, per $x\neq1$.`,
        },
        {
          id: 's08.regole.L2.q2',
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=x\,e^{-x}$.`,
          answer: '(1-x)*e^(-x)',
          vars: ['x'],
          explain: String.raw`$f'=1\cdot e^{-x}+x\cdot(-e^{-x})=(1-x)e^{-x}$. Il segno meno viene dalla derivata di $e^{-x}$, che è $-e^{-x}$. Questa derivata sarà utile per la convessità.`,
        },
        {
          id: 's08.regole.L2.q3',
          type: 'tf',
          prompt: String.raw`Vero o falso? $D(x\cdot x)=1\cdot1=1$.`,
          answer: false,
          explain: String.raw`Falso. $x\cdot x=x^2$ e $D(x^2)=2x$, non $1$. La derivata del prodotto è $D(x)\cdot x+x\cdot D(x)=2x$.`,
        },
        {
          id: 's08.regole.L2.q4',
          type: 'num',
          prompt: String.raw`Calcola $f'(2)$ se $f(x)=\dfrac{x^2+1}{x-1}$.`,
          answer: '-1',
          explain: String.raw`$f'=\frac{2x(x-1)-(x^2+1)}{(x-1)^2}=\frac{x^2-2x-1}{(x-1)^2}$. In $x=2$: $\frac{4-4-1}{1}=-1$.`,
        },
        {
          id: 's08.regole.L2.q5',
          type: 'expr',
          level: 3,
          source: 'Appello 15/01/2026 · Parte B',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\dfrac{x-1}{2x-3}$, per $x\neq\frac32$.`,
          answer: '-1/(2*x-3)^2',
          vars: ['x'],
          domain: [-1.2, 0.8],
          explain: String.raw`Regola del quoziente: $\frac{1\cdot(2x-3)-(x-1)\cdot2}{(2x-3)^2}=\frac{2x-3-2x+2}{(2x-3)^2}=\frac{-1}{(2x-3)^2}$. Il numeratore si riduce a $-1$.`,
        },
        {
          id: 's08.regole.L2.q6',
          type: 'expr',
          level: 3,
          source: 'Appello 15/01/2026 · Parte B',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=x\log x$, per $0<x<1$.`,
          answer: 'log(x)+1',
          vars: ['x'],
          domain: [0.2, 0.8],
          explain: String.raw`Prodotto: $1\cdot\log x+x\cdot\frac{1}{x}=\log x+1$. Nel tema d'esame questa derivata serve per trovare i punti critici e il punto angoloso in $1$. Qui $\log$ è il logaritmo naturale.`,
        },
      ],
    },
    {
      id: 's08.regole.L3',
      title: 'Funzione composta',
      cards: [
        {
          type: 'learn',
          title: 'La regola della catena',
          body: String.raw`Se $f(x)=F(g(x))$ con $F$ e $g$ derivabili, allora
>* **Derivata della composta.** $D\big(F(g(x))\big)=F'(g(x))\cdot g'(x)$.

In parole: **derivata esterna** (calcolata nel punto interno) per **derivata interna**. Schema utile:
$$D(e^{g})=e^{g}\,g',\qquad D(\sin g)=\cos g\cdot g',\qquad D(g^n)=n\,g^{n-1}g',\qquad D(\log g)=\frac{g'}{g}.$$
Ogni volta che c'è una funzione dentro un'altra, non dimenticare il fattore $g'$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: esponenziale composta',
          problem: String.raw`Calcola $f'(x)$ se $f(x)=e^{x^2+1}$.`,
          steps: [
            String.raw`Esterna: $F(u)=e^u$, quindi $F'(u)=e^u$. Interna: $g(x)=x^2+1$, quindi $g'(x)=2x$.`,
            String.raw`Chain rule: $f'(x)=F'(g(x))\,g'(x)=e^{x^2+1}\cdot2x$.`,
          ],
          result: String.raw`$f'(x)=2x\,e^{x^2+1}$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: seno di $3x^2$',
          problem: String.raw`Calcola $f'(x)$ se $f(x)=\sin(3x^2)$.`,
          steps: [
            String.raw`Esterna: $\sin u$, con derivata $\cos u$. Interna: $g(x)=3x^2$.`,
            {
              text: String.raw`Calcola la derivata interna $g'(x)$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`Quanto vale $g'(x)$ se $g(x)=3x^2$?`,
                answer: '6*x',
                vars: ['x'],
                explain: String.raw`$D(3x^2)=3\cdot2x=6x$.`,
              },
            },
            {
              text: String.raw`Ricompongo: la derivata esterna $\cos u$ va calcolata nel punto interno $u=3x^2$.`,
              ask: {
                type: 'mcq',
                prompt: String.raw`Quale è la derivata di $\sin(3x^2)$?`,
                options: [
                  String.raw`$\cos(3x^2)$`,
                  String.raw`$6x\cos(3x^2)$`,
                  String.raw`$-6x\sin(3x^2)$`,
                  String.raw`$3\cos(3x^2)$`,
                ],
                answer: 1,
                explain: String.raw`Derivata esterna $\cos(3x^2)$ per derivata interna $6x$. Il primo distrattore dimentica la derivata interna; il terzo sbaglia il segno e scambia $\sin$ con $\cos$; il quarto usa il coefficiente $3$ al posto di $6x$.`,
              },
            },
          ],
          result: String.raw`$f'(x)=6x\cos(3x^2)$.`,
        },
        {
          id: 's08.regole.L3.q1',
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=(x^2-1)^3$.`,
          answer: '6*x*(x^2-1)^2',
          vars: ['x'],
          explain: String.raw`$D(u^3)=3u^2\cdot u'$ con $u=x^2-1$ e $u'=2x$: $3(x^2-1)^2\cdot2x=6x(x^2-1)^2$.`,
        },
        {
          id: 's08.regole.L3.q2',
          type: 'mcq',
          prompt: String.raw`Quale è la derivata di $\sin(x^2)$?`,
          options: [
            String.raw`$2x\cos(x^2)$`,
            String.raw`$\cos(x^2)$`,
            String.raw`$2x\sin(x^2)$`,
            String.raw`$\cos(2x)$`,
          ],
          answer: 0,
          explain: String.raw`Derivata esterna $\cos(x^2)$, per derivata interna $2x$. Il distrattore $\cos(x^2)$ dimentica la derivata interna; il terzo lascia $\sin$ invece di $\cos$; il quarto confonde l'argomento $x^2$ con la sua derivata $2x$ e la mette dentro il coseno.`,
        },
        {
          id: 's08.regole.L3.q3',
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\log(x^2+1)$.`,
          answer: '2*x/(x^2+1)',
          vars: ['x'],
          explain: String.raw`$D(\log g)=\frac{g'}{g}$ con $g=x^2+1$ e $g'=2x$: $\frac{2x}{x^2+1}$.`,
        },
        {
          id: 's08.regole.L3.q4',
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\sqrt{3x+1}$, per $x>-\frac13$.`,
          answer: '3/(2*sqrt(3*x+1))',
          vars: ['x'],
          domain: [0, 2],
          explain: String.raw`$D(\sqrt g)=\frac{g'}{2\sqrt g}$ con $g=3x+1$ e $g'=3$: $\frac{3}{2\sqrt{3x+1}}$.`,
        },
        {
          id: 's08.regole.L3.q5',
          type: 'expr',
          level: 3,
          source: 'Appello 03/09/2026 · Parte B',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=e^{\frac{x+1}{x-1}}$, per $x\neq1$.`,
          answer: '-2/(x-1)^2*e^((x+1)/(x-1))',
          vars: ['x'],
          domain: [-2, 0.5],
          explain: String.raw`Interna $g=\frac{x+1}{x-1}$: $g'=\frac{(x-1)-(x+1)}{(x-1)^2}=\frac{-2}{(x-1)^2}$. Quindi $f'=e^{g}\,g'=-\frac{2}{(x-1)^2}e^{\frac{x+1}{x-1}}$.`,
        },
        {
          id: 's08.regole.L3.q6',
          type: 'expr',
          level: 3,
          source: 'Appello 11/06/2026 · Parte B',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=e^{\frac{1}{4-x^2}}$, per $x\neq\pm2$.`,
          answer: '2*x/(4-x^2)^2*e^(1/(4-x^2))',
          vars: ['x'],
          domain: [-1.5, 0.5],
          explain: String.raw`Interna $g=\frac{1}{4-x^2}$: $g'=-\frac{-2x}{(4-x^2)^2}=\frac{2x}{(4-x^2)^2}$. Quindi $f'=e^{g}g'$. Il segno segue quello di $x$: $g'$ è negativa per $x<0$ e positiva per $x>0$ (nel dominio $x\neq\pm2$), perché il denominatore $(4-x^2)^2$ è sempre positivo.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's08.regole.p1',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const a = R.nz(-3, 3), b = R.int(-4, 4), c = R.int(-5, 5), d = R.int(-5, 5);
        return {
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=${H.poly([a, b, c, d])}$.`,
          answer: H.polyStr(H.polyDeriv([a, b, c, d])),
          vars: ['x'],
          explain: String.raw`Ogni termine $kx^n$ diventa $nk\,x^{n-1}$, la costante scompare: $f'(x)=${H.poly(H.polyDeriv([a, b, c, d]))}$.`,
        };
      },
    },
    {
      id: 's08.regole.p2',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3), b = R.int(-4, 4), c = R.int(-5, 5), d = R.int(-5, 5), x0 = R.int(-2, 3);
        const ans = 3 * a * x0 * x0 + 2 * b * x0 + c;
        return {
          type: 'num',
          prompt: String.raw`Qual è $f'(${x0})$ se $f(x)=${H.poly([a, b, c, d])}$?`,
          answer: String(ans),
          explain: String.raw`$f'(x)=${H.poly(H.polyDeriv([a, b, c, d]))}$, quindi $f'(${x0})=${ans}$. Calcola prima la derivata e poi sostituisci.`,
        };
      },
    },
    {
      id: 's08.regole.p3',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.nz(-2, 2), b = R.int(-3, 3);
        return {
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=e^{${H.poly([a, b, 0])}}$.`,
          answer: `(${2 * a}*x+(${b}))*e^(${a}*x^2+(${b})*x)`,
          vars: ['x'],
          explain: String.raw`Chain rule: $e^{g}\cdot g'$ con $g=${H.poly([a, b, 0])}$, $g'=${H.poly([2 * a, b])}$. Quindi $f'=(${H.poly([2 * a, b])})\,e^{${H.poly([a, b, 0])}}$.`,
        };
      },
    },
    {
      id: 's08.regole.p4',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3), b = R.int(-4, 4), n = R.pick([2, 3, 4]);
        return {
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\left(${H.lin(a, b)}\right)^{${n}}$.`,
          answer: `${n * a}*(${a}*x+(${b}))^${n - 1}`,
          vars: ['x'],
          explain: String.raw`$D(u^{${n}})=${n}u^{${n - 1}}u'$ con $u=${H.lin(a, b)}$ e $u'=${a}$. Il risultato è $${n * a}\,(${H.lin(a, b)})^{${n - 1}}$.`,
        };
      },
    },
    {
      id: 's08.regole.p5',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const m = R.pick([2, 3]), k = R.pick([-3, -2, 2, 3]);
        return {
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=x^{${m}}\,e^{${k}x}$.`,
          answer: `(${m}*x^${m - 1}+(${k})*x^${m})*e^(${k}*x)`,
          vars: ['x'],
          explain: String.raw`Prodotto: $D(x^{${m}})\,e^{${k}x}+x^{${m}}\,D(e^{${k}x})=(${m}x^{${m - 1}}+${k}x^{${m}})\,e^{${k}x}$.`,
        };
      },
    },
    {
      id: 's08.regole.p6',
      type: 'tf',
      prompt: String.raw`Vero o falso? $D\big(\sin(x^2)\big)=\cos(x^2)$.`,
      answer: false,
      explain: String.raw`Falso: manca la derivata interna $2x$. La derivata corretta è $2x\cos(x^2)$.`,
    },
    {
      id: 's08.regole.p7',
      type: 'num',
      prompt: String.raw`Calcola $f'(0)$ se $f(x)=\dfrac{3x+1}{x+2}$.`,
      answer: '5/4',
      explain: String.raw`$f'=\frac{3(x+2)-(3x+1)}{(x+2)^2}=\frac{5}{(x+2)^2}$. In $x=0$: $\frac{5}{4}$.`,
    },
    {
      id: 's08.regole.p8',
      type: 'expr',
      prompt: String.raw`Calcola $f'(x)$ se $f(x)=x^2\log x$, per $x>0$.`,
      answer: '2*x*log(x)+x',
      vars: ['x'],
      domain: [0.3, 2.7],
      explain: String.raw`Prodotto: $2x\log x+x^2\cdot\frac{1}{x}=2x\log x+x$.`,
    },
    {
      id: 's08.regole.p9',
      type: 'mcq',
      prompt: String.raw`Quale è la derivata di $f(x)=\dfrac{1}{x}$, per $x\neq0$?`,
      options: [
        String.raw`$-\dfrac{1}{x^2}$`,
        String.raw`$\dfrac{1}{x^2}$`,
        String.raw`$-\dfrac{1}{x}$`,
        String.raw`$\log x$`,
      ],
      answer: 0,
      explain: String.raw`$D(x^{-1})=-x^{-2}=-\frac{1}{x^2}$. Il secondo distrattore dimentica il segno meno. Il terzo confonde la derivata con la funzione; il quarto non ha senso.`,
    },
    {
      id: 's08.regole.p10',
      type: 'num',
      prompt: String.raw`Calcola $f'(0)$ se $f(x)=x\,e^{x}$.`,
      answer: '1',
      explain: String.raw`$f'=(1+x)e^x$, quindi $f'(0)=1\cdot e^0=1$.`,
    },
    {
      id: 's08.regole.p11',
      type: 'expr',
      prompt: String.raw`Calcola $f'(x)$ se $f(x)=\sqrt{x^2+1}$.`,
      answer: 'x/sqrt(x^2+1)',
      vars: ['x'],
      explain: String.raw`$D(\sqrt g)=\frac{g'}{2\sqrt g}$ con $g=x^2+1$, $g'=2x$: $\frac{2x}{2\sqrt{x^2+1}}=\frac{x}{\sqrt{x^2+1}}$.`,
    },
    {
      id: 's08.regole.p12',
      type: 'tf',
      prompt: String.raw`Vero o falso? Se $f$ e $g$ sono derivabili, allora $D(f+g)=f'+g'$.`,
      answer: true,
      explain: String.raw`Vero: la derivata è lineare, quindi si distribuisce sulla somma.`,
    },
  ],
  flashcards: [
    {
      id: 's08.regole.fc1',
      kind: 'formula',
      front: String.raw`Regole di base: somma, costante, potenza`,
      back: String.raw`$D(f+g)=f'+g'$, $D(cf)=cf'$, $D(x^n)=nx^{n-1}$, $D(c)=0$.`,
    },
    {
      id: 's08.regole.fc2',
      kind: 'thm',
      front: String.raw`Derivata del prodotto`,
      back: String.raw`Se $f,g$ sono derivabili in $x$: $D(fg)=f'g+fg'$.`,
    },
    {
      id: 's08.regole.fc3',
      kind: 'thm',
      front: String.raw`Derivata del quoziente`,
      back: String.raw`Se $f,g$ sono derivabili in $x$ e $g(x)\neq0$: $D\left(\frac{f}{g}\right)=\frac{f'g-fg'}{g^2}$.`,
    },
    {
      id: 's08.regole.fc4',
      kind: 'thm',
      front: String.raw`Derivata della funzione composta (regola della catena)`,
      back: String.raw`Se $g$ è derivabile in $x$ e $F$ è derivabile in $g(x)$: $D\big(F(g(x))\big)=F'(g(x))\,g'(x)$.`,
    },
    {
      id: 's08.regole.fc5',
      kind: 'formula',
      front: String.raw`Composte più usate`,
      back: String.raw`$D(e^g)=e^g g'$, $D(\sin g)=\cos g\cdot g'$, $D(\cos g)=-\sin g\cdot g'$, $D(g^n)=ng^{n-1}g'$, $D(\log g)=\frac{g'}{g}$, $D(\sqrt g)=\frac{g'}{2\sqrt g}$.`,
    },
    {
      id: 's08.regole.fc6',
      kind: 'errore',
      front: String.raw`Errore tipico: "$D(fg)=f'g'$"`,
      back: String.raw`Sbagliato. La derivata del prodotto è $f'g+fg'$. Esempio: $D(x\cdot x)=2x$, non $1$.`,
    },
    {
      id: 's08.regole.fc7',
      kind: 'errore',
      front: String.raw`Errore tipico nella composta: $D(\sin(x^2))=\cos(x^2)$?`,
      back: String.raw`Manca la derivata interna: $D(\sin(x^2))=2x\cos(x^2)$. Ogni volta che c'è una funzione dentro un'altra, moltiplica per $g'$.`,
    },
    {
      id: 's08.regole.fc8',
      kind: 'metodo',
      front: String.raw`Quale regola scegliere?`,
      back: String.raw`Somma o costante: deriva termine per termine. Prodotto di due funzioni: regola del prodotto. Rapporto: regola del quoziente. Funzione dentro un'altra: regola della catena.`,
    },
  ],
});

// ===========================================================================
// s08.inversa · Derivata dell'inversa, inverse trigonometriche, iperboliche
// ===========================================================================
SKILLS.push({
  id: 's08.inversa',
  title: "Derivata dell'inversa",
  summary: String.raw`Calcoli la derivata di una funzione inversa senza conoscerne la formula, e ricordi le derivate di arcsin, arccos, arctan e delle funzioni iperboliche.`,
  prereq: ['s08.regole', 's07.inversa'],
  examRefs: ['Itinere 11/11/2025 · Parte A', 'Appello 15/01/2026 · Parte A'],
  lessons: [
    {
      id: 's08.inversa.L1',
      title: "Il teorema della derivata dell'inversa",
      cards: [
        {
          type: 'learn',
          title: 'Idea: scambiare gli assi',
          body: String.raw`Il grafico di $f^{-1}$ è quello di $f$ riflesso rispetto alla bisettrice $y=x$. Una retta che sale con pendenza $2$ diventa una retta che sale con pendenza $\frac12$: le pendenze si invertono.

>* **Teorema della derivata dell'inversa.** Sia $f$ continua e strettamente monotona su un intervallo, derivabile in $x_0$ con $f'(x_0)\neq0$. Allora $f^{-1}$ è derivabile in $y_0=f(x_0)$ e
$$(f^{-1})'(y_0)=\frac{1}{f'(x_0)}.$$
Il calcolo si fa senza conoscere la formula di $f^{-1}$, che di solito non si riesce a scrivere.`,
          plot: { fns: [{ f: 'e^x', label: 'f' }, { f: 'log(x)', label: 'f^{-1}' }, { f: 'x', label: 'y=x' }], x: [-2, 2.5], y: [-2, 3] },
        },
        {
          id: 's08.inversa.L1.q1',
          type: 'mcq',
          prompt: String.raw`Sia $f$ invertibile e derivabile con $f'(1)=2$, $f(1)=3$. Quanto vale $(f^{-1})'(3)$?`,
          options: [
            String.raw`$\frac12$`,
            String.raw`$2$`,
            String.raw`$-2$`,
            String.raw`$-\frac12$`,
          ],
          answer: 0,
          explain: String.raw`$(f^{-1})'(3)=\frac{1}{f'(1)}=\frac12$, perché $f(1)=3$. Il distrattore $2$ dà la derivata di $f$ invece dell'inversa; i segni negativi non compaiono: la pendenza resta positiva.`,
        },
        {
          id: 's08.inversa.L1.q2',
          type: 'num',
          prompt: String.raw`Sia $f(x)=x^3+x$. Calcola $(f^{-1})'(2)$, sapendo che $f(1)=2$.`,
          answer: '1/4',
          explain: String.raw`$f'(x)=3x^2+1$, quindi $f'(1)=4$. Per il teorema $(f^{-1})'(2)=\frac{1}{f'(1)}=\frac14$. Non serve scrivere $f^{-1}$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: derivata del logaritmo',
          problem: String.raw`Usa il teorema dell'inversa per calcolare la derivata di $\log x$, sapendo che è l'inversa di $e^y$.`,
          steps: [
            String.raw`Sia $f(y)=e^y$, la cui inversa è $f^{-1}(x)=\log x$. Vale $f'(y)=e^y$.`,
            String.raw`Per il teorema: $(\log)'(x)=\dfrac{1}{f'(\log x)}$, cioè $\dfrac{1}{e^{\log x}}$.`,
            String.raw`Poiché $e^{\log x}=x$ per $x>0$, il denominatore è $x$.`,
          ],
          result: String.raw`$D(\log x)=\frac{1}{x}$ per $x>0$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: derivata di $\\log(x+1)$',
          problem: String.raw`Calcola la derivata di $y=\log(x+1)$ con il teorema dell'inversa: scrivi $x$ in funzione di $y$, poi inverti.`,
          steps: [
            String.raw`Dalla relazione $y=\log(x+1)$ ricavo $x$: $x=e^y-1$. Questa è la funzione "inversa" da derivare rispetto a $y$.`,
            {
              text: String.raw`Calcola $\frac{dx}{dy}$ dalla relazione $x=e^y-1$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`Quanto vale $\frac{dx}{dy}$ per $x=e^y-1$?`,
                answer: 'e^y',
                vars: ['y'],
                explain: String.raw`La derivata di $e^y-1$ rispetto a $y$ è $e^y$ (la costante $-1$ sparisce).`,
              },
            },
            {
              text: String.raw`Per il teorema $\frac{dy}{dx}=\frac{1}{\frac{dx}{dy}}=\frac{1}{e^y}$. Ora esprimi $e^y$ in funzione di $x$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`Quanto vale $e^y$ in funzione di $x$, sapendo che $x=e^y-1$?`,
                answer: 'x+1',
                vars: ['x'],
                explain: String.raw`Da $x=e^y-1$ segue $e^y=x+1$.`,
              },
            },
          ],
          result: String.raw`$D\log(x+1)=\frac{1}{x+1}$, per $x>-1$.`,
        },
        {
          type: 'learn',
          title: 'La formula da ricordare',
          body: String.raw`Quando $f^{-1}$ è composta con una funzione, la regola è la stessa:
$$(f^{-1})'(y)=\frac{1}{f'\big(f^{-1}(y)\big)}.$$
Il trucco pratico: scrivi $y=f(x)$, ricava $x$ in funzione di $y$ quando serve, e calcola $\frac{dx}{dy}$. Poi $\frac{dy}{dx}=\frac{1}{dx/dy}$. Se $f'(x)=0$ la formula non si applica, e la derivata dell'inversa, se esiste, è infinita.`,
        },
        {
          type: 'expr',
          id: 's08.inversa.L1.q3',
          prompt: String.raw`Sia $f(x)=e^{2x}$, invertibile, con inversa $g(y)=\frac12\log y$. Calcola $g'(y)$ in funzione di $y$.`,
          answer: '1/(2*y)',
          vars: ['y'],
          domain: [0.3, 2.7],
          explain: String.raw`$f'(x)=2e^{2x}$. Per il teorema $g'(y)=\frac{1}{f'(g(y))}=\frac{1}{2e^{2\cdot\frac12\log y}}=\frac{1}{2y}$.`,
        },
        {
          id: 's08.inversa.L1.q4',
          type: 'mcq',
          prompt: String.raw`Quanto vale $(\log)'(e)$, cioè la derivata del logaritmo nel punto $y=e$?`,
          options: [
            String.raw`$\frac{1}{e}$`,
            String.raw`$e$`,
            String.raw`$1$`,
            String.raw`$e^2$`,
          ],
          answer: 0,
          explain: String.raw`$D(\log x)=\frac{1}{x}$, quindi in $x=e$ il valore è $\frac1e$. Il distrattore $e$ inverte la derivata; $1$ confonde il punto con la derivata; $e^2$ non ha motivo di comparire.`,
        },
        {
          id: 's08.inversa.L1.q5',
          type: 'tf',
          prompt: String.raw`Vero o falso? Se $f'(x_0)=0$, allora $f^{-1}$ è derivabile in $f(x_0)$ e $(f^{-1})'(f(x_0))=0$.`,
          answer: false,
          explain: String.raw`Falso. La formula $\frac{1}{f'(x_0)}$ richiede $f'(x_0)\neq0$: qui non si applica. Per $f(x)=x^3$ in $x_0=0$ l'inversa, la radice cubica, ha derivata infinita in $0$ (tangente verticale), non $0$.`,
        },
        {
          id: 's08.inversa.L1.q6',
          type: 'num',
          prompt: String.raw`Sia $f(x)=x^3+3x$, con $f(1)=4$. Calcola $(f^{-1})'(4)$.`,
          answer: '1/6',
          explain: String.raw`$f'(x)=3x^2+3$, quindi $f'(1)=6$. Per il teorema $(f^{-1})'(4)=\frac{1}{6}$.`,
        },
        {
          id: 's08.inversa.L1.q7',
          type: 'expr',
          level: 2,
          source: 'Itinere 11/11/2025 · Parte A',
          prompt: String.raw`Usa il teorema della funzione inversa per calcolare la derivata di $y=\log(x+1)$, per $x>-1$.`,
          answer: '1/(x+1)',
          vars: ['x'],
          domain: [0.3, 2.7],
          explain: String.raw`Con $x=e^y-1$ si ha $\frac{dx}{dy}=e^y=x+1$, quindi $\frac{dy}{dx}=\frac{1}{x+1}$. Il risultato coincide con la regola della composta $\frac{g'}{g}$, ma il metodo dell'inversa è quello richiesto in Parte A.`,
        },
      ],
    },
    {
      id: 's08.inversa.L2',
      title: 'Derivate di arcsin, arccos e arctan',
      cards: [
        {
          type: 'learn',
          title: 'Le inverse trigonometriche',
          body: String.raw`Le inverse trigonometriche si derivano con il teorema dell'inversa. Sia $y=\arcsin x$, cioè $x=\sin y$ con $y\in[-\frac\pi2,\frac\pi2]$: allora $\frac{dx}{dy}=\cos y=\sqrt{1-\sin^2y}=\sqrt{1-x^2}$, perché $\cos y\geq0$ su quell'intervallo.

>* **Formule.** Per $|x|<1$:
$$D(\arcsin x)=\frac{1}{\sqrt{1-x^2}},\qquad D(\arccos x)=-\frac{1}{\sqrt{1-x^2}}.$$
Per ogni $x\in\R$: $D(\arctan x)=\frac{1}{1+x^2}$.

Attenzione: $\arcsin$ e $\arccos$ non sono derivabili in $\pm1$, dove la derivata diventa infinita (tangente verticale).`,
          plot: { fns: [{ f: 'asin(x)', label: 'arcsin' }, { f: 'atan(x)', label: 'arctan' }], x: [-1.5, 1.5], y: [-2, 2] },
        },
        {
          type: 'example',
          title: 'Esempio svolto: arctan di $3x$',
          problem: String.raw`Calcola la derivata di $f(x)=\arctan(3x)$.`,
          steps: [
            String.raw`Derivata esterna: $D(\arctan u)=\frac{1}{1+u^2}$. Derivata interna: $u=3x$, con $u'=3$.`,
            String.raw`Regola della catena: $f'(x)=\frac{1}{1+(3x)^2}\cdot3=\frac{3}{1+9x^2}$.`,
          ],
          result: String.raw`$f'(x)=\frac{3}{1+9x^2}$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: arcsin di $x/2$',
          problem: String.raw`Calcola la derivata di $f(x)=\arcsin\left(\frac x2\right)$ per $|x|<2$.`,
          steps: [
            String.raw`Esterna: $\frac{1}{\sqrt{1-u^2}}$ con $u=\frac{x}{2}$. Interna: $u=\frac x2$.`,
            {
              text: String.raw`Calcola la derivata interna $u'(x)$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`Quanto vale $u'(x)$ per $u(x)=\frac{x}{2}$?`,
                answer: '1/2',
                vars: ['x'],
                explain: String.raw`$D\left(\frac{x}{2}\right)=\frac12$, costante.`,
              },
            },
            {
              text: String.raw`Sostituisci $u=\frac x2$ nella radice: $1-u^2=1-\frac{x^2}{4}$.`,
              ask: {
                type: 'expr',
                prompt: String.raw`Scrivi $1-u^2$ con $u=\frac x2$, in funzione di $x$.`,
                answer: '1-x^2/4',
                vars: ['x'],
                explain: String.raw`$1-\left(\frac x2\right)^2=1-\frac{x^2}{4}$.`,
              },
            },
          ],
          result: String.raw`$f'(x)=\frac{1}{2\sqrt{1-x^2/4}}=\frac{1}{\sqrt{4-x^2}}$.`,
        },
        {
          id: 's08.inversa.L2.q1',
          type: 'mcq',
          prompt: String.raw`Qual è il dominio di $D(\arcsin x)=\dfrac{1}{\sqrt{1-x^2}}$?`,
          options: [
            String.raw`$(-1,1)$`,
            String.raw`$\R$`,
            String.raw`$[-1,1]$`,
            String.raw`$\left(-\frac\pi2,\frac\pi2\right)$`,
          ],
          answer: 0,
          explain: String.raw`La radice richiede $1-x^2>0$, quindi $|x|<1$: agli estremi la derivata diverge. $\R$ è falso: $\arcsin$ è definita solo su $[-1,1]$. $[-1,1]$ include gli estremi, dove non si deriva. L'ultimo è l'intervallo dei valori di $\arcsin$, non il dominio della derivata.`,
        },
        {
          id: 's08.inversa.L2.q2',
          type: 'expr',
          prompt: String.raw`Calcola $D\big(\arctan(x^2)\big)$.`,
          answer: '2*x/(1+x^4)',
          vars: ['x'],
          explain: String.raw`Esterna $\frac{1}{1+u^2}$ con $u=x^2$, interna $u'=2x$: $\frac{2x}{1+(x^2)^2}=\frac{2x}{1+x^4}$.`,
        },
        {
          id: 's08.inversa.L2.q3',
          type: 'num',
          prompt: String.raw`Calcola la derivata di $\arctan x$ nel punto $x=1$.`,
          answer: '1/2',
          explain: String.raw`$D(\arctan x)=\frac{1}{1+x^2}$, e in $x=1$ vale $\frac{1}{2}$.`,
        },
        {
          id: 's08.inversa.L2.q4',
          type: 'expr',
          level: 2,
          prompt: String.raw`Calcola $D(\arccos x)$ per $|x|<1$.`,
          answer: '-1/sqrt(1-x^2)',
          vars: ['x'],
          domain: [-0.7, 0.7],
          explain: String.raw`Il segno meno distingue $\arccos$ da $\arcsin$: $\arccos$ è decrescente, quindi la derivata è negativa, con lo stesso modulo $\frac{1}{\sqrt{1-x^2}}$.`,
        },
        {
          id: 's08.inversa.L2.q5',
          type: 'tf',
          prompt: String.raw`Vero o falso? $D(\arctan x)=\dfrac{1}{1+x^2}$ per ogni $x\in\R$.`,
          answer: true,
          explain: String.raw`Vero. $\arctan$ è definita su tutto $\R$ e la sua derivata non ha problemi di dominio: il denominatore $1+x^2$ non si annulla mai.`,
        },
        {
          id: 's08.inversa.L2.q6',
          type: 'expr',
          level: 3,
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\arcsin\!\big(x^2\big)$, per $|x|<1$.`,
          answer: '2*x/sqrt(1-x^4)',
          vars: ['x'],
          domain: [-0.7, 0.7],
          explain: String.raw`Esterna $\frac{1}{\sqrt{1-u^2}}$ con $u=x^2$, interna $2x$: $\frac{2x}{\sqrt{1-x^4}}$. Il dominio della derivata è $|x|<1$ perché $\arcsin$ richiede $|x^2|\le1$ e la derivata richiede $|x^2|<1$.`,
        },
      ],
    },
    {
      id: 's08.inversa.L3',
      title: 'Funzioni iperboliche',
      cards: [
        {
          type: 'learn',
          title: 'Seno e coseno iperbolici',
          body: String.raw`Le funzioni iperboliche sono combinazioni di esponenziali:
$$\sinh x=\frac{e^x-e^{-x}}{2},\qquad \cosh x=\frac{e^x+e^{-x}}{2},\qquad \tanh x=\frac{\sinh x}{\cosh x}.$$
Derivate: $D(\sinh x)=\cosh x$, $D(\cosh x)=\sinh x$, $D(\tanh x)=\dfrac{1}{\cosh^2x}$. Identità fondamentale: $\cosh^2x-\sinh^2x=1$.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $\\sinh(2x)$',
          problem: String.raw`Calcola la derivata di $f(x)=\sinh(2x)$.`,
          steps: [
            String.raw`Derivata esterna: $D(\sinh u)=\cosh u$. Derivata interna: $u=2x$, con $u'=2$.`,
            String.raw`Regola della catena: $f'(x)=\cosh(2x)\cdot2=2\cosh(2x)$.`,
          ],
          result: String.raw`$f'(x)=2\cosh(2x)$.`,
        },
        {
          id: 's08.inversa.L3.q1',
          type: 'mcq',
          prompt: String.raw`Quale identità vale per ogni $x\in\R$?`,
          options: [
            String.raw`$\cosh^2x-\sinh^2x=1$`,
            String.raw`$\cosh^2x+\sinh^2x=1$`,
            String.raw`$\cosh x+\sinh x=0$`,
            String.raw`$\sinh x\cosh x=1$`,
          ],
          answer: 0,
          explain: String.raw`$\cosh^2x-\sinh^2x=\frac{(e^x+e^{-x})^2-(e^x-e^{-x})^2}{4}=\frac{4}{4}=1$. La somma $\cosh^2x+\sinh^2x$ non è costante. Il terzo distrattore è falso: $\cosh x+\sinh x=e^x$. Il quarto: il prodotto non è costante.`,
        },
        {
          id: 's08.inversa.L3.q2',
          type: 'expr',
          prompt: String.raw`Calcola $D\big(\cosh(x^2)\big)$.`,
          answer: '2*x*sinh(x^2)',
          vars: ['x'],
          explain: String.raw`$D(\cosh u)=\sinh u\cdot u'$ con $u=x^2$, $u'=2x$: $2x\sinh(x^2)$.`,
        },
        {
          id: 's08.inversa.L3.q3',
          type: 'expr',
          prompt: String.raw`Calcola $D(\log(\cosh x))$.`,
          answer: 'tanh(x)',
          vars: ['x'],
          explain: String.raw`$D(\log g)=\frac{g'}{g}$ con $g=\cosh x$, $g'=\sinh x$: $\frac{\sinh x}{\cosh x}=\tanh x$.`,
        },
        {
          id: 's08.inversa.L3.q4',
          type: 'tf',
          prompt: String.raw`Vero o falso? $D(\tanh x)=\dfrac{1}{\cosh^2x}$ per ogni $x\in\R$.`,
          answer: true,
          explain: String.raw`Vero: $D\frac{\sinh x}{\cosh x}=\frac{\cosh^2x-\sinh^2x}{\cosh^2x}=\frac{1}{\cosh^2x}$, per l'identità fondamentale.`,
        },
        {
          id: 's08.inversa.L3.q5',
          type: 'num',
          prompt: String.raw`Calcola la derivata di $\sinh x$ nel punto $x=0$.`,
          answer: '1',
          explain: String.raw`$D(\sinh x)=\cosh x$, e $\cosh0=\frac{e^0+e^0}{2}=1$.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's08.inversa.p1',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.nz(-3, 3);
        return {
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\arctan\!\big(${H.coef(a)}x\big)$.`,
          answer: `${a}/(1+${a * a}*x^2)`,
          vars: ['x'],
          explain: String.raw`Regola della catena: $\frac{1}{1+u^2}\cdot u'$ con $u=${H.coef(a)}x$ e $u'=${a}$. Quindi $f'(x)=\frac{${a}}{1+${a * a}x^2}$.`,
        };
      },
    },
    {
      id: 's08.inversa.p2',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.pick([2, 3, -2, -3]);
        return {
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\arcsin(${a}x)$, per $|x|<\frac{1}{${Math.abs(a)}}$.`,
          answer: `${a}/sqrt(1-${a * a}*x^2)`,
          vars: ['x'],
          domain: [-0.2, 0.2],
          explain: String.raw`$D(\arcsin u)=\frac{u'}{\sqrt{1-u^2}}$ con $u=${a}x$, $u'=${a}$: $f'(x)=\frac{${a}}{\sqrt{1-${a * a}x^2}}$.`,
        };
      },
    },
    {
      id: 's08.inversa.p3',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const a = R.nz(-4, 4);
        return {
          type: 'num',
          prompt: String.raw`Calcola la derivata di $\arctan(${H.coef(a)}x)$ nel punto $x=0$.`,
          answer: String(a),
          explain: String.raw`$f'(x)=\frac{${a}}{1+${a * a}x^2}$, quindi $f'(0)=${a}$.`,
        };
      },
    },
    {
      id: 's08.inversa.p4',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.pick([2, 3, -2, -3]);
        return {
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=\sinh(${a}x)$.`,
          answer: `${a}*cosh(${a}*x)`,
          vars: ['x'],
          explain: String.raw`$D(\sinh u)=\cosh u\cdot u'$ con $u=${a}x$: $f'(x)=${a}\cosh(${a}x)$.`,
        };
      },
    },
    {
      id: 's08.inversa.p5',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const b = R.pick([2, 3, 4]);
        return {
          type: 'expr',
          prompt: String.raw`Usa il teorema dell'inversa: se $f(y)=e^{${b}y}$ ha inversa $g(x)$, calcola $g'(x)$ in funzione di $x$.`,
          answer: `1/(${b}*x)`,
          vars: ['x'],
          domain: [0.3, 2.7],
          explain: String.raw`$f'(y)=${b}e^{${b}y}$. Poiché $e^{${b}g(x)}=x$, la formula dà $g'(x)=\frac{1}{${b}x}$.`,
        };
      },
    },
    {
      id: 's08.inversa.p6',
      type: 'tf',
      prompt: String.raw`Vero o falso? Per $f(x)=x^3$ l'inversa $\sqrt[3]{x}$ ha derivata finita in $0$.`,
      answer: false,
      explain: String.raw`Falso. Qui $f'(0)=0$, e la formula dell'inversa non si applica: la radice cubica ha derivata infinita in $0$.`,
    },
    {
      id: 's08.inversa.p7',
      type: 'mcq',
      prompt: String.raw`Per $f(x)=2x+e^x$, con $f(0)=1$, quanto vale $(f^{-1})'(1)$?`,
      options: [
        String.raw`$\frac13$`,
        String.raw`$3$`,
        String.raw`$\frac12$`,
        String.raw`$1$`,
      ],
      answer: 0,
      explain: String.raw`$f'(x)=2+e^x$, quindi $f'(0)=3$. Per il teorema $(f^{-1})'(1)=\frac{1}{3}$. Il distrattore $3$ dà la derivata di $f$ e non dell'inversa.`,
    },
    {
      id: 's08.inversa.p8',
      type: 'num',
      prompt: String.raw`Calcola $\arctan'(1)$, cioè $D(\arctan x)$ in $x=1$, scrivendo il risultato come frazione.`,
      answer: '1/2',
      explain: String.raw`$D(\arctan x)=\frac{1}{1+x^2}$, in $x=1$ vale $\frac12$.`,
    },
    {
      id: 's08.inversa.p9',
      type: 'order',
      prompt: String.raw`Riordina i passi della dimostrazione del teorema della derivata dell'inversa.`,
      steps: [
        String.raw`Per $y\neq y_0$ poni $x=f^{-1}(y)$ e $x_0=f^{-1}(y_0)$, così che $y=f(x)$ e $y_0=f(x_0)$.`,
        String.raw`Poiché $f$ è iniettiva, $x\neq x_0$; poiché $f^{-1}$ è continua, $x\to x_0$ quando $y\to y_0$.`,
        String.raw`Scrivo il rapporto incrementale di $f^{-1}$: $\frac{f^{-1}(y)-f^{-1}(y_0)}{y-y_0}=\frac{x-x_0}{f(x)-f(x_0)}$.`,
        String.raw`Per $y\to y_0$ il rapporto a destra è il reciproco di $\frac{f(x)-f(x_0)}{x-x_0}\to f'(x_0)\neq0$: il limite vale $\frac{1}{f'(x_0)}$.`,
      ],
      distractors: [
        String.raw`Calcolo $(f^{-1})'(y_0)=f'(y_0)$, derivando $f$ direttamente nel punto $y_0$.`,
        String.raw`Scambio numeratore e denominatore: $\frac{f^{-1}(y)-f^{-1}(y_0)}{y-y_0}=\frac{y-y_0}{f(x)-f(x_0)}$.`,
      ],
      explain: String.raw`La dimostrazione passa per la sostituzione $x=f^{-1}(y)$: il rapporto incrementale dell'inversa è il reciproco di quello di $f$, e la continuità di $f^{-1}$ garantisce $x\to x_0$.`,
    },
    {
      id: 's08.inversa.p10',
      type: 'expr',
      prompt: String.raw`Calcola $f'(x)$ se $f(x)=\dfrac{1}{\sqrt{1-x^2}}$, per $|x|<1$, scrivendola come potenza.`,
      answer: 'x*(1-x^2)^(-3/2)',
      vars: ['x'],
      domain: [-0.7, 0.7],
      explain: String.raw`$f(x)=(1-x^2)^{-1/2}$. Chain rule: $-\frac12(1-x^2)^{-3/2}\cdot(-2x)=x(1-x^2)^{-3/2}$.`,
    },
  ],
  flashcards: [
    {
      id: 's08.inversa.fc1',
      kind: 'thm',
      front: String.raw`Teorema della derivata dell'inversa`,
      back: String.raw`Se $f$ è continua e strettamente monotona su un intervallo, derivabile in $x_0$ con $f'(x_0)\neq0$, allora $f^{-1}$ è derivabile in $y_0=f(x_0)$ e $(f^{-1})'(y_0)=\dfrac{1}{f'(x_0)}$.`,
    },
    {
      id: 's08.inversa.fc2',
      kind: 'dim',
      front: String.raw`Idea della dimostrazione: derivata dell'inversa`,
      back: String.raw`Poni $x=f^{-1}(y)$, $x_0=f^{-1}(y_0)$. Il rapporto incrementale di $f^{-1}$ è $\frac{x-x_0}{f(x)-f(x_0)}$, cioè il reciproco di quello di $f$. Per continuità di $f^{-1}$, $x\to x_0$ quando $y\to y_0$; poiché $f'(x_0)\neq0$ il limite è $\frac{1}{f'(x_0)}$.`,
    },
    {
      id: 's08.inversa.fc3',
      kind: 'formula',
      front: String.raw`Derivate delle inverse trigonometriche`,
      back: String.raw`$D(\arcsin x)=\frac{1}{\sqrt{1-x^2}}$, $D(\arccos x)=-\frac{1}{\sqrt{1-x^2}}$ (per $|x|<1$); $D(\arctan x)=\frac{1}{1+x^2}$ (per ogni $x$).`,
    },
    {
      id: 's08.inversa.fc4',
      kind: 'formula',
      front: String.raw`Derivate delle funzioni iperboliche`,
      back: String.raw`$D(\sinh x)=\cosh x$, $D(\cosh x)=\sinh x$, $D(\tanh x)=\dfrac{1}{\cosh^2x}$. Identità: $\cosh^2x-\sinh^2x=1$.`,
    },
    {
      id: 's08.inversa.fc5',
      kind: 'metodo',
      front: String.raw`Calcolare la derivata di una funzione inversa senza formula`,
      back: String.raw`Calcola $f'$ nel punto corrispondente, poi usa $(f^{-1})'(y)=\frac{1}{f'(f^{-1}(y))}$. Serve che $f'\neq0$ in quel punto. Per trovare $f^{-1}(y)$ risolvi $y=f(x)$ rispetto a $x$.`,
    },
    {
      id: 's08.inversa.fc6',
      kind: 'errore',
      front: String.raw`Errore tipico: "$(f^{-1})'(y_0)=f'(y_0)$"`,
      back: String.raw`Sbagliato. La derivata dell'inversa è il reciproco della derivata di $f$ nel punto $x_0=f^{-1}(y_0)$, non in $y_0$.`,
    },
    {
      id: 's08.inversa.fc7',
      kind: 'errore',
      front: String.raw`Dove non vale la formula della derivata dell'inversa?`,
      back: String.raw`Dove $f'(x_0)=0$ (o non esiste). Per esempio $f(x)=x^3$ in $0$: la radice cubica ha tangente verticale in $0$, derivata infinita.`,
    },
  ],
});

// ===========================================================================
// s08.punti · Derivabile ⇒ continua, derivate laterali, punti singolari
// ===========================================================================
SKILLS.push({
  id: 's08.punti',
  title: 'Derivabilità: punti angolosi, cuspidi, funzioni a tratti',
  summary: String.raw`Dimostri che derivabile implica continua, distingui punti angolosi, cuspidi e flessi a tangente verticale, e controlli la derivabilità di una funzione a tratti.`,
  prereq: ['s08.def', 's08.regole', 's07.def'],
  examRefs: ['Itinere 11/11/2025 · Parte A', 'Appello 15/01/2026 · Parte B', 'Appello 10/02/2026 · Parte B', 'Appello 06/07/2026 · Parte A'],
  lessons: [
    {
      id: 's08.punti.L1',
      title: 'Derivabile implica continua',
      cards: [
        {
          type: 'learn',
          title: 'Il teorema',
          body: String.raw`Se una funzione è derivabile in un punto, è anche continua in quel punto. Il viceversa è falso.

>* **Teorema.** Se $f$ è derivabile in $x_0$, allora $f$ è continua in $x_0$.

Intuizione: derivare vuol dire avere una tangente. Una funzione con tangente in un punto non può avere un salto o un buco lì. Il grafico non può "staccarsi" dal punto $\big(x_0,f(x_0)\big)$ senza che la pendenza esploda.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: dimostrazione',
          problem: String.raw`Dimostra che se $f$ è derivabile in $x_0$, allora $\lim_{x\to x_0}f(x)=f(x_0)$.`,
          steps: [
            String.raw`Per $x\neq x_0$ scrivo $f(x)-f(x_0)=\dfrac{f(x)-f(x_0)}{x-x_0}\cdot(x-x_0)$: ho solo moltiplicato e diviso per $x-x_0\neq0$.`,
            String.raw`Per ipotesi il fattore $\dfrac{f(x)-f(x_0)}{x-x_0}$ tende a $f'(x_0)$, che è finito.`,
            String.raw`Il fattore $x-x_0$ tende a $0$. Il limite del prodotto è il prodotto dei limiti: $\lim_{x\to x_0}\big(f(x)-f(x_0)\big)=f'(x_0)\cdot0=0$.`,
            String.raw`Quindi $\lim_{x\to x_0}f(x)=f(x_0)$: la funzione è continua in $x_0$.`,
          ],
          result: String.raw`Derivabile in $x_0$ $\Rightarrow$ continua in $x_0$.`,
        },
        {
          id: 's08.punti.L1.q1',
          type: 'mcq',
          prompt: String.raw`Se $f$ è derivabile in $x_0$, quale affermazione è sempre vera?`,
          options: [
            String.raw`$f$ è continua in $x_0$`,
            String.raw`$f$ è continua in ogni punto del dominio`,
            String.raw`$f'(x_0)=f(x_0)$`,
            String.raw`$f$ è crescente in $x_0$`,
          ],
          answer: 0,
          explain: String.raw`È il teorema: derivabile ⇒ continua. Il secondo non segue: derivabilità in un punto non dice nulla sugli altri. Il terzo confonde la derivata con il valore. Il quarto è falso: derivabile non vuol dire crescente. Per esempio $f(x)=-x^2$ in $0$ ha derivata $0$, ma è un massimo e non è crescente.`,
        },
        {
          id: 's08.punti.L1.q2',
          type: 'num',
          prompt: String.raw`Sia $f$ derivabile in $x_0=2$, con $f(2)=5$ e $f'(2)=3$. Quanto vale $\lim_{x\to2}f(x)$?`,
          answer: '5',
          explain: String.raw`Per il teorema $f$ è continua in $2$, quindi il limite è $f(2)=5$. La derivata $3$ non entra nel valore del limite: serve per la pendenza.`,
        },
        {
          id: 's08.punti.L1.q3',
          type: 'tf',
          prompt: String.raw`Vero o falso? Se $\lim_{x\to x_0}f(x)=f(x_0)$, allora $f$ è derivabile in $x_0$.`,
          answer: false,
          explain: String.raw`Falso. Continuità non implica derivabilità: $f(x)=|x|$ è continua in $0$, ma il rapporto incrementale $\frac{|h|}{h}$ non ha limite. Il viceversa, derivabile ⇒ continua, è il teorema.`,
        },
        {
          id: 's08.punti.L1.q4',
          type: 'order',
          prompt: String.raw`Riordina i passi della dimostrazione: se $f$ è derivabile in $x_0$, allora $f$ è continua in $x_0$.`,
          steps: [
            String.raw`Per $x\neq x_0$ scrivo $f(x)-f(x_0)=\dfrac{f(x)-f(x_0)}{x-x_0}\cdot(x-x_0)$.`,
            String.raw`Per ipotesi $\dfrac{f(x)-f(x_0)}{x-x_0}\to f'(x_0)$, che è finito.`,
            String.raw`Il limite del prodotto è il prodotto dei limiti: $\lim_{x\to x_0}\big(f(x)-f(x_0)\big)=f'(x_0)\cdot0=0$.`,
            String.raw`Quindi $\lim_{x\to x_0}f(x)=f(x_0)$: $f$ è continua in $x_0$.`,
          ],
          distractors: [
            String.raw`Dividendo per $x-x_0$ ottengo $f(x)=f(x_0)+f'(x_0)(x-x_0)$ per ogni $x$: quindi $f$ è una retta.`,
            String.raw`Quindi $f$ è derivabile anche in ogni punto vicino a $x_0$.`,
          ],
          explain: String.raw`La chiave è scrivere la differenza $f(x)-f(x_0)$ come rapporto incrementale per $(x-x_0)$. Quel rapporto è limitato (converge), e $x-x_0\to0$: il prodotto va a zero. I distrattori sono errori tipici: il primo confonde la tangente con la funzione stessa, il secondo prende una conclusione non dimostrata.`,
        },
        {
          id: 's08.punti.L1.q5',
          type: 'open',
          points: 2,
          prompt: String.raw`Enuncia e dimostra: se $f$ è derivabile in $x_0$, allora $f$ è continua in $x_0$.`,
          answer: String.raw`Enunciato: se $f$ è derivabile in $x_0$, allora $\lim_{x\to x_0}f(x)=f(x_0)$. Dimostrazione: per $x\neq x_0$, $f(x)-f(x_0)=\frac{f(x)-f(x_0)}{x-x_0}(x-x_0)$. Per ipotesi il primo fattore tende a $f'(x_0)\in\R$, mentre $x-x_0\to0$. Il prodotto tende a $f'(x_0)\cdot0=0$, cioè $f(x)\to f(x_0)$: $f$ è continua in $x_0$.`,
          rubric: [
            String.raw`Ipotesi: esiste finito il limite del rapporto incrementale`,
            String.raw`Scrittura $f(x)-f(x_0)=\frac{f(x)-f(x_0)}{x-x_0}(x-x_0)$ per $x\neq x_0$`,
            String.raw`Limite del prodotto: $f'(x_0)\cdot0=0$`,
            String.raw`Conclusione: $\lim f(x)=f(x_0)$, quindi continuità in $x_0$`,
          ],
        },
        {
          type: 'learn',
          title: 'Il controesempio: il valore assoluto',
          body: String.raw`La funzione $f(x)=|x|$ è continua in $0$ ma non derivabile. Le due semirette hanno pendenze diverse: a destra la pendenza è $+1$, a sinistra $-1$. Il grafico "fa un angolo" nell'origine.`,
          plot: { fns: [{ f: 'abs(x)', label: '|x|' }], x: [-2, 2], y: [-0.5, 2.5], points: [[0, 0, 'O']] },
        },
        {
          id: 's08.punti.L1.q6',
          type: 'mcq',
          prompt: String.raw`Per $f(x)=|x|$ in $x_0=0$: quale affermazione è corretta?`,
          options: [
            String.raw`È continua, ma non derivabile: ha un punto angoloso`,
            String.raw`È discontinua`,
            String.raw`È derivabile con $f'(0)=0$`,
            String.raw`È derivabile con $f'(0)=1$`,
          ],
          answer: 0,
          explain: String.raw`$|x|\to0$ quando $x\to0$, quindi è continua. Il rapporto incrementale $\frac{|h|}{h}$ vale $+1$ a destra e $-1$ a sinistra: non ha limite, quindi non è derivabile. Gli altri distrattori sbagliano continuità o derivata.`,
        },
      ],
    },
    {
      id: 's08.punti.L2',
      title: 'Derivate laterali e tipi di punto singolare',
      cards: [
        {
          type: 'learn',
          title: 'Derivate destra e sinistra',
          body: String.raw`Le **derivate laterali** sono i limiti del rapporto incrementale da un solo lato:
$$f'_+(x_0)=\lim_{h\to0^+}\frac{f(x_0+h)-f(x_0)}{h},\qquad f'_-(x_0)=\lim_{h\to0^-}\frac{f(x_0+h)-f(x_0)}{h}.$$
$f$ è derivabile in $x_0$ **se e solo se** le due derivate laterali sono finite e uguali. Il valore comune è $f'(x_0)$.

I punti singolari si classificano così:
- **punto angolo** (o angoloso): $f'_+$ e $f'_-$ finite e diverse;
- **cuspide**: $f'_+=\pm\infty$ e $f'_-=\mp\infty$, con segni opposti;
- **flesso a tangente verticale**: derivate infinite con lo stesso segno (per esempio $+\infty$ e $+\infty$).`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: $x\\,|x|$ in $0$',
          problem: String.raw`Calcola le derivate laterali di $f(x)=x\,|x|$ in $x_0=0$.`,
          steps: [
            String.raw`Per $h>0$: $f(h)=h\cdot h=h^2$, quindi $f(h)-f(0)=h^2$ e il rapporto è $\dfrac{h^2}{h}=h$.`,
            String.raw`Per $h<0$: $|h|=-h$, quindi $f(h)=h\cdot(-h)=-h^2$ e il rapporto è $\dfrac{-h^2}{h}=-h$.`,
            String.raw`Per $h\to0$ entrambi i rapporti tendono a $0$.`,
          ],
          result: String.raw`$f'_+(0)=f'_-(0)=0$, quindi $f$ è derivabile in $0$ con $f'(0)=0$, anche se $f(x)=x|x|$ ha un "fattore" $|x|$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: $|x^2-1|$ in $x=1$',
          problem: String.raw`Calcola le derivate laterali di $f(x)=|x^2-1|$ in $x_0=1$.`,
          steps: [
            String.raw`Vicino a $1$ da destra ($x>1$) si ha $x^2-1>0$, quindi $f(x)=x^2-1$.`,
            {
              text: String.raw`Calcola $f'_+(1)$ derivando $x^2-1$ e valutando in $x=1$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $f'_+(1)$ per $f(x)=x^2-1$?`,
                answer: '2',
                explain: String.raw`$D(x^2-1)=2x$, in $x=1$ vale $2$.`,
              },
            },
            {
              text: String.raw`Vicino a $1$ da sinistra ($x<1$) si ha $x^2-1<0$, quindi $f(x)=1-x^2$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $f'_-(1)$ per $f(x)=1-x^2$?`,
                answer: '-2',
                explain: String.raw`$D(1-x^2)=-2x$, in $x=1$ vale $-2$. Le derivate sono finite e diverse: $1$ è un punto angoloso.`,
              },
            },
          ],
          result: String.raw`$f'_+(1)=2\neq-2=f'_-(1)$: il punto $x=1$ è angoloso.`,
        },
        {
          id: 's08.punti.L2.q1',
          type: 'mcq',
          prompt: String.raw`Quale è il tipo di punto di $f(x)=\sqrt[3]{x^2}$ in $x_0=0$?`,
          options: [
            String.raw`cuspide`,
            String.raw`punto angoloso con derivate finite`,
            String.raw`flesso a tangente verticale`,
            String.raw`punto regolare (derivabile)`,
          ],
          answer: 0,
          explain: String.raw`Il rapporto incrementale è $\frac{\sqrt[3]{h^2}}{h}=\frac{1}{\sqrt[3]{h}}$ (per $h\neq0$): per $h\to0^+$ tende a $+\infty$, per $h\to0^-$ a $-\infty$. Derivate infinite di segno opposto: cuspide.`,
        },
        {
          id: 's08.punti.L2.q2',
          type: 'mcq',
          prompt: String.raw`Quale è il tipo di punto di $f(x)=\sqrt[3]{x}$ in $x_0=0$?`,
          options: [
            String.raw`flesso a tangente verticale`,
            String.raw`cuspide`,
            String.raw`punto angoloso`,
            String.raw`punto regolare con $f'(0)=0$`,
          ],
          answer: 0,
          explain: String.raw`Il rapporto incrementale è $\frac{\sqrt[3]h}{h}=h^{-2/3}\to+\infty$ da entrambe le parti. Derivate infinite con lo stesso segno: la funzione è crescente e la tangente è verticale. Non è una cuspide, perché il segno non cambia.`,
        },
        {
          id: 's08.punti.L2.q3',
          type: 'tf',
          prompt: String.raw`Vero o falso? Ogni punto angoloso è una cuspide.`,
          answer: false,
          explain: String.raw`Falso. Nel punto angoloso le derivate laterali sono **finite** e diverse (come per $|x|$). Nella cuspide almeno una è infinita, con segni opposti.`,
        },
        {
          id: 's08.punti.L2.q4',
          type: 'mcq',
          prompt: String.raw`Quale affermazione definisce un punto angoloso di $f$ in $x_0$?`,
          options: [
            String.raw`le derivate laterali $f'_+(x_0)$ e $f'_-(x_0)$ sono finite e diverse`,
            String.raw`$f$ non è continua in $x_0$`,
            String.raw`$f'(x_0)=0$ e la derivata cambia segno`,
            String.raw`le derivate laterali sono infinite con lo stesso segno`,
          ],
          answer: 0,
          explain: String.raw`È la definizione: derivate laterali finite e diverse. Il secondo caso è una discontinuità. Il terzo è un punto critico (possibile massimo o minimo). Il quarto è un flesso a tangente verticale.`,
        },
        {
          id: 's08.punti.L2.q5',
          type: 'mcq',
          prompt: String.raw`Sia $f(x)=\sqrt[3]{x^2}$. In $x_0=0$ le derivate laterali sono:`,
          options: [
            String.raw`$f'_+(0)=+\infty$ e $f'_-(0)=-\infty$`,
            String.raw`$f'_+(0)=f'_-(0)=+\infty$`,
            String.raw`$f'_+(0)=1$ e $f'_-(0)=-1$`,
            String.raw`$f'_+(0)=f'_-(0)=0$`,
          ],
          answer: 0,
          explain: String.raw`Per $h>0$ il rapporto è $h^{-1/3}\to+\infty$; per $h<0$, $h^{-1/3}$ è negativo e tende a $-\infty$. Il distrattore $+\infty$ da entrambi i lati descrive il flesso verticale, non la cuspide. Gli altri non corrispondono a questa funzione.`,
        },
        {
          id: 's08.punti.L2.q6',
          type: 'num',
          prompt: String.raw`Calcola $f'_+(2)$ per $f(x)=|x^2-4|$.`,
          answer: '4',
          explain: String.raw`Per $x>2$: $x^2-4>0$, quindi $f=x^2-4$ con $f'=2x$. In $x=2$: $f'_+(2)=4$.`,
        },
        {
          id: 's08.punti.L2.q7',
          type: 'num',
          level: 3,
          source: 'Appello 10/02/2026 · Parte B',
          prompt: String.raw`Sia $f(x)=(x^2-3)e^{-|2-x|}$. Calcola la derivata destra $f'_+(2)$.`,
          answer: '3',
          explain: String.raw`Per $x>2$: $|2-x|=x-2$, quindi $f(x)=(x^2-3)e^{2-x}$. Derivata: $(2x)e^{2-x}-(x^2-3)e^{2-x}$, in $x=2$: $4-1=3$. Nell'esame compare anche $f'_-(2)=5$: il punto è angoloso.`,
        },
      ],
    },
    {
      id: 's08.punti.L3',
      title: 'Funzioni a tratti e parametri',
      cards: [
        {
          type: 'learn',
          title: 'Come si controlla una funzione a tratti',
          body: String.raw`In un punto di raccordo $x_0$ di una funzione a tratti servono due controlli, in quest'ordine:
1. **continuità**: $f(x_0^-)=f(x_0^+)=f(x_0)$;
2. **derivabilità**: $f'_-(x_0)=f'_+(x_0)$, derivate laterali **finite e uguali**.

Se la continuità fallisce, non ha senso controllare la derivabilità. Per trovare i parametri, scrivi le due condizioni come equazioni.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: parametri per la derivabilità',
          problem: String.raw`Per quali $a,b$ la funzione $f(x)=\begin{cases}x^2 & x\le1\\ ax+b & x>1\end{cases}$ è derivabile in $x_0=1$?`,
          steps: [
            String.raw`Continuità: $f(1)=1^2=1$ e il limite destro è $a+b$. Quindi $a+b=1$.`,
            String.raw`Derivata sinistra: $D(x^2)=2x$, in $x=1$ vale $2$. Derivata destra: $D(ax+b)=a$.`,
            String.raw`Uguaglianza delle derivate: $a=2$. Sostituisco nella prima equazione: $2+b=1$, quindi $b=-1$.`,
          ],
          result: String.raw`$a=2$, $b=-1$: solo così $f$ è continua e derivabile in $1$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: parametri con l\'esponenziale',
          problem: String.raw`Per quali $a,b$ la funzione $f(x)=\begin{cases}e^x & x\le0\\ ax+b & x>0\end{cases}$ è derivabile in $0$?`,
          steps: [
            String.raw`Continuità in $0$: $f(0)=e^0=1$, quindi il limite destro $b$ deve valere $1$.`,
            {
              text: String.raw`Con $b=1$ ora imponi l'uguaglianza delle derivate. Calcola la derivata sinistra $f'_-(0)$ da $e^x$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $f'_-(0)$ per $f(x)=e^x$?`,
                answer: '1',
                explain: String.raw`$D(e^x)=e^x$, in $x=0$ vale $1$.`,
              },
            },
            {
              text: String.raw`La derivata destra è $a$. Uguaglianza: $a=f'_-(0)=1$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $a$?`,
                answer: '1',
                explain: String.raw`Dall'uguaglianza delle derivate laterali, $a=1$.`,
              },
            },
          ],
          result: String.raw`$a=1$, $b=1$. Con questi valori $f$ è derivabile in $0$, con $f'(0)=1$.`,
        },
        {
          id: 's08.punti.L3.q1',
          type: 'problem',
          level: 3,
          source: 'Appello 15/01/2026 · Parte B',
          points: 4,
          prompt: String.raw`Sia $f(x)=\begin{cases} x\log x & 0<x<1\\ \dfrac{x-1}{2x-3} & x\ge1\end{cases}$. (a) Calcola $f'_-(1)$. (b) Calcola $f'_+(1)$. (c) Di che tipo di punto si tratta in $x=1$?`,
          parts: [
            {
              type: 'num',
              prompt: String.raw`(a) $f'_-(1)$`,
              answer: '1',
              explain: String.raw`$D(x\log x)=\log x+1$; in $x=1$ vale $\log 1+1=1$.`,
            },
            {
              type: 'num',
              prompt: String.raw`(b) $f'_+(1)$`,
              answer: '-1',
              explain: String.raw`$D\frac{x-1}{2x-3}=\frac{-1}{(2x-3)^2}$; in $x=1$ vale $\frac{-1}{1}=-1$.`,
            },
            {
              type: 'mcq',
              prompt: String.raw`(c) Tipo di punto in $x=1$:`,
              options: [
                String.raw`punto angoloso (derivate laterali finite e diverse)`,
                String.raw`punto regolare (derivabile)`,
                String.raw`cuspide`,
                String.raw`flesso a tangente verticale`,
              ],
              answer: 0,
              explain: String.raw`Le derivate $1$ e $-1$ sono finite e diverse: punto angoloso. Anche la funzione è continua in $1$ (entrambi i rami valgono $0$).`,
            },
          ],
          solution: String.raw`La funzione è continua in $1$: $\lim_{x\to1^-}x\log x=0=f(1)=\frac{0}{-1}$. Derivata sinistra: $f'_-(1)=1$. Derivata destra: $f'_+(1)=-1$. Le derivate laterali sono finite e diverse: $x=1$ è un punto angoloso.`,
        },
        {
          id: 's08.punti.L3.q2',
          type: 'num',
          prompt: String.raw`Per $f(x)=\begin{cases}x^2 & x\le1\\ ax+b & x>1\end{cases}$ con derivabilità in $1$: quanto vale $a$?`,
          answer: '2',
          explain: String.raw`La derivata sinistra in $1$ è $D(x^2)=2$. Per la derivabilità la derivata destra $a$ deve essere uguale: $a=2$.`,
        },
        {
          id: 's08.punti.L3.q3',
          type: 'num',
          prompt: String.raw`Nel caso precedente ($a=2$, derivabile in $1$), quanto vale $b$?`,
          answer: '-1',
          explain: String.raw`Continuità: $f(1)=1$ e il limite destro è $a+b$. Quindi $2+b=1$, cioè $b=-1$.`,
        },
        {
          id: 's08.punti.L3.q4',
          type: 'mcq',
          prompt: String.raw`Quale condizione garantisce che una funzione a tratti sia derivabile in un punto di raccordo $x_0$?`,
          options: [
            String.raw`derivate laterali finite e uguali`,
            String.raw`limiti laterali uguali`,
            String.raw`$f(x_0)=0$`,
            String.raw`$f$ è continua in $x_0$`,
          ],
          answer: 0,
          explain: String.raw`Per la derivabilità servono derivate laterali finite e uguali. La continuità è necessaria, ma non sufficiente. $f(x_0)=0$ non è una condizione richiesta.`,
        },
        {
          id: 's08.punti.L3.q5',
          type: 'tf',
          prompt: String.raw`Vero o falso? Se $f$ è continua in $x_0$ e le derivate laterali sono **finite** e diverse, allora $x_0$ è un punto angoloso.`,
          answer: true,
          explain: String.raw`Vero: è la definizione di punto angoloso. Se le derivate fossero infinite con segni opposti, si tratterebbe di una cuspide.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's08.punti.p1',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const c = R.pick([-2, -1, 1, 2, 3]);
        const b = -c * c;
        return {
          type: 'num',
          prompt: String.raw`Sia $f(x)=\begin{cases} x^2 & x\le${c}\\ ax+(${b}) & x>${c}\end{cases}$. Per quale $a$ la funzione è derivabile in $x=${c}$?`,
          answer: String(2 * c),
          explain: String.raw`Derivata sinistra in $${c}$: $2\cdot(${c})=${2 * c}$. Deve coincidere con la derivata destra $a$: $a=${2 * c}$. Controlla la continuità: $(${c})^2=${c * c}$ e $a\cdot(${c})+(${b})=${2 * c * c - c * c}=${c * c}$.`,
        };
      },
    },
    {
      id: 's08.punti.p2',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const k = R.pick([-3, -2, 2, 3]);
        return {
          type: 'num',
          prompt: String.raw`Sia $f(x)=\begin{cases} e^{${k}x} & x\le0\\ ax+1 & x>0\end{cases}$. Per quale $a$ la funzione è derivabile in $0$?`,
          answer: String(k),
          explain: String.raw`Continuità: $f(0)=1$ e il limite destro è $1$, già soddisfatto. Derivata sinistra: $D(e^{${k}x})=${k}e^{${k}x}$, in $0$ vale $${k}$. Quindi $a=${k}$.`,
        };
      },
    },
    {
      id: 's08.punti.p3',
      type: 'gen',
      level: 1,
      gen: (R) => {
        const c = R.int(-3, 3), d = R.int(-2, 2);
        return {
          type: 'mcq',
          prompt: String.raw`Il grafico di $f(x)=|x-(${c})|+(${d})$ nel punto di ascissa $x=${c}$ presenta:`,
          options: [
            String.raw`un punto angoloso`,
            String.raw`una cuspide`,
            String.raw`un flesso a tangente verticale`,
            String.raw`un punto regolare con tangente orizzontale`,
          ],
          answer: 0,
          explain: String.raw`È un valore assoluto traslato: le derivate laterali sono $+1$ e $-1$, finite e diverse. Quindi è un punto angoloso, non derivabile, anche se continuo.`,
        };
      },
    },
    {
      id: 's08.punti.p4',
      type: 'num',
      prompt: String.raw`Calcola $f'_-(2)$ per $f(x)=|x^2-4|$.`,
      answer: '-4',
      explain: String.raw`Per $x<2$ (vicino a $2$): $x^2-4<0$, quindi $f=4-x^2$ con $f'=-2x$. In $x=2$: $-4$.`,
    },
    {
      id: 's08.punti.p5',
      type: 'tf',
      prompt: String.raw`Vero o falso? Se $f'(x_0)=0$, allora $x_0$ è un punto di massimo o di minimo.`,
      answer: false,
      explain: String.raw`Falso. Per $f(x)=x^3$ in $x_0=0$, $f'(0)=0$, ma $0$ non è né massimo né minimo: la funzione è crescente.`,
    },
    {
      id: 's08.punti.p6',
      type: 'mcq',
      prompt: String.raw`Quale è il tipo di punto di $f(x)=\sqrt[3]{x}$ in $x_0=0$?`,
      options: [
        String.raw`flesso a tangente verticale`,
        String.raw`cuspide`,
        String.raw`punto angoloso`,
        String.raw`punto regolare`,
      ],
      answer: 0,
      explain: String.raw`Derivate infinite con lo stesso segno ($+\infty$ da entrambi i lati): flesso a tangente verticale.`,
    },
    {
      id: 's08.punti.p7',
      type: 'tf',
      prompt: String.raw`Vero o falso? Una funzione con un punto angoloso in $x_0$ è derivabile in $x_0$.`,
      answer: false,
      explain: String.raw`Falso: nel punto angoloso le derivate laterali sono diverse, quindi non esiste la derivata.`,
    },
    {
      id: 's08.punti.p8',
      type: 'num',
      prompt: String.raw`Calcola $f'(0)$ se $f(x)=x\,|x|$.`,
      answer: '0',
      explain: String.raw`I rapporti incrementali sono $h$ (per $h>0$) e $-h$ (per $h<0$): tendono entrambi a $0$. Quindi $f'(0)=0$.`,
    },
    {
      id: 's08.punti.p9',
      type: 'expr',
      prompt: String.raw`Per $x>0$ calcola $f'(x)$ se $f(x)=x\,|x|$.`,
      answer: '2*x',
      vars: ['x'],
      domain: [0.3, 2.7],
      explain: String.raw`Per $x>0$ si ha $|x|=x$, quindi $f(x)=x^2$ e $f'(x)=2x$.`,
    },
    {
      id: 's08.punti.p10',
      type: 'mcq',
      prompt: String.raw`Sia $f(x)=\begin{cases}x^2 & x\le1\\ 2x-1 & x>1\end{cases}$. In $x=1$ la funzione è:`,
      options: [
        String.raw`derivabile, con $f'(1)=2$`,
        String.raw`derivabile, con $f'(1)=1$`,
        String.raw`non derivabile: la derivata destra è diversa dalla sinistra`,
        String.raw`non continua in $1$`,
      ],
      answer: 0,
      explain: String.raw`Continua: $f(1)=1$ e $2\cdot1-1=1$. Derivate: sinistra $2x=2$, destra $2$. Uguali: derivabile con $f'(1)=2$. Il secondo distrattore sbaglia il valore della derivata; il terzo è falso.`,
    },
    {
      id: 's08.punti.p11',
      type: 'tf',
      prompt: String.raw`Vero o falso? Se $f$ non è continua in $x_0$, allora $f$ non è derivabile in $x_0$.`,
      answer: true,
      explain: String.raw`Vero, per il teorema derivabile ⇒ continua (contronominale): se non c'è continuità, non può esserci derivabilità.`,
    },
    {
      id: 's08.punti.p12',
      type: 'mcq',
      prompt: String.raw`Quale funzione ha in $x_0=0$ una cuspide?`,
      options: [
        String.raw`$\sqrt[3]{x^2}$`,
        String.raw`$\sqrt[3]{x}$`,
        String.raw`$|x|$`,
        String.raw`$x^2$`,
      ],
      answer: 0,
      explain: String.raw`$\sqrt[3]{x^2}$ ha derivate infinite di segno opposto in $0$: cuspide. $\sqrt[3]x$ è un flesso verticale; $|x|$ ha un punto angoloso; $x^2$ è derivabile.`,
    },
  ],
  flashcards: [
    {
      id: 's08.punti.fc1',
      kind: 'thm',
      front: String.raw`Derivabile ⇒ continua`,
      back: String.raw`Se $f$ è derivabile in $x_0$, allora $f$ è continua in $x_0$. Il viceversa è falso: $|x|$ è continua in $0$ ma non derivabile.`,
    },
    {
      id: 's08.punti.fc2',
      kind: 'dim',
      front: String.raw`Idea della dimostrazione: derivabile ⇒ continua`,
      back: String.raw`Scrivi $f(x)-f(x_0)=\frac{f(x)-f(x_0)}{x-x_0}\cdot(x-x_0)$. Il primo fattore tende a $f'(x_0)$ (finito), il secondo a $0$. Il prodotto tende a $0$, quindi $f(x)\to f(x_0)$.`,
    },
    {
      id: 's08.punti.fc3',
      kind: 'def',
      front: String.raw`Derivate laterali`,
      back: String.raw`$f'_+(x_0)=\lim_{h\to0^+}\frac{f(x_0+h)-f(x_0)}{h}$ e $f'_-(x_0)=\lim_{h\to0^-}\frac{f(x_0+h)-f(x_0)}{h}$. $f$ è derivabile in $x_0$ sse sono finite e uguali.`,
    },
    {
      id: 's08.punti.fc4',
      kind: 'def',
      front: String.raw`Punto angoloso`,
      back: String.raw`Derivate laterali **finite e diverse**, per esempio $f'_+=1$ e $f'_-=-1$ per $|x|$ in $0$.`,
    },
    {
      id: 's08.punti.fc5',
      kind: 'def',
      front: String.raw`Cuspide`,
      back: String.raw`Derivate laterali **infinite di segno opposto**: $f'_+=+\infty$ e $f'_-=-\infty$, per esempio $\sqrt[3]{x^2}$ in $0$.`,
    },
    {
      id: 's08.punti.fc6',
      kind: 'def',
      front: String.raw`Flesso a tangente verticale`,
      back: String.raw`Derivata infinita **con lo stesso segno** da entrambi i lati, per esempio $+\infty$ da entrambe le parti: $\sqrt[3]{x}$ in $0$. La funzione continua a crescere.`,
    },
    {
      id: 's08.punti.fc7',
      kind: 'errore',
      front: String.raw`Errore tipico: "continua ⇒ derivabile"`,
      back: String.raw`Falso. $|x|$ è continua in $0$ ma non derivabile. Per la derivabilità servono le derivate laterali finite e uguali.`,
    },
    {
      id: 's08.punti.fc8',
      kind: 'metodo',
      front: String.raw`Funzione a tratti: controllo in un punto di raccordo`,
      back: String.raw`1) Continuità: limiti laterali uguali al valore in $x_0$. 2) Derivabilità: derivate laterali finite e uguali. Ogni condizione è un'equazione per i parametri.`,
    },
  ],
});

// ===========================================================================
// s08.teoremi · Punti critici, Fermat, Rolle, Lagrange, monotonia, invertibilità
// ===========================================================================
SKILLS.push({
  id: 's08.teoremi',
  title: 'Teoremi di Fermat, Rolle e Lagrange',
  summary: String.raw`Trovi i punti critici, enunci e applichi Fermat, Rolle e Lagrange, e studi monotonia e invertibilità con la derivata.`,
  prereq: ['s08.punti', 's08.regole', 's07.teoremi'],
  examRefs: ['Appello 10/02/2026 · Parte A', 'Appello 11/06/2026 · Parte A', 'Appello 03/09/2026 · Parte A', 'Appello 03/09/2026 · Parte B'],
  lessons: [
    {
      id: 's08.teoremi.L1',
      title: 'Punti critici e teorema di Fermat',
      cards: [
        {
          type: 'learn',
          title: 'Punti stazionari e punti critici',
          body: String.raw`Un punto $x_0$ è **stazionario** se $f$ è derivabile in $x_0$ e $f'(x_0)=0$: la tangente è orizzontale.

Un punto $x_0$ è **critico** se è stazionario, **oppure** se $f$ non è derivabile in $x_0$. I punti critici sono i candidati naturali per massimi e minimi: li cerchi per primi, prima di confrontare i valori.

>* **Teorema di Fermat.** Sia $x_0$ un punto interno all'intervallo di definizione di $f$, con $f$ derivabile in $x_0$. Se $x_0$ è di massimo o di minimo relativo, allora $f'(x_0)=0$.

Attenzione: il teorema dà una condizione **necessaria**, non sufficiente. Una derivata nulla non garantisce un estremo.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: candidati estremi di $x^2-4x+1$',
          problem: String.raw`Usa Fermat per trovare i candidati a massimo e minimo di $f(x)=x^2-4x+1$ su tutto $\R$.`,
          steps: [
            String.raw`La funzione è derivabile ovunque, quindi i candidati sono solo i punti con $f'(x)=0$.`,
            String.raw`$f'(x)=2x-4$, che si annulla solo per $x=2$.`,
            String.raw`L'unico candidato è $x=2$, con $f(2)=4-8+1=-3$. La parabola ha concavità verso l'alto, quindi $-3$ è il minimo assoluto.`,
          ],
          result: String.raw`Minimo assoluto $-3$ in $x=2$. Non ci sono massimi: $f\to+\infty$ per $x\to\pm\infty$.`,
        },
        {
          id: 's08.teoremi.L1.q1',
          type: 'mcq',
          prompt: String.raw`Sia $x_0$ un punto di massimo relativo interno, con $f$ derivabile in $x_0$. Quale affermazione è vera?`,
          options: [
            String.raw`$f'(x_0)=0$`,
            String.raw`$f'(x_0)>0$`,
            String.raw`$f''(x_0)<0$`,
            String.raw`$f(x_0)=0$`,
          ],
          answer: 0,
          explain: String.raw`È Fermat: la derivata in un estremo interno è nulla. $f'(x_0)>0$ è impossibile: significherebbe che $f$ cresce in $x_0$ e quindi valori più grandi a destra. $f''(x_0)<0$ è una condizione diversa, sufficiente per un massimo ma non richiesta dal teorema. $f(x_0)=0$ è un valore qualunque.`,
        },
        {
          id: 's08.teoremi.L1.q2',
          type: 'tf',
          prompt: String.raw`Vero o falso? Se $f'(x_0)=0$, allora $x_0$ è un punto di massimo o di minimo di $f$.`,
          answer: false,
          explain: String.raw`Falso. Il teorema di Fermat va in una sola direzione. Controesempio: $f(x)=x^3$ in $x_0=0$: $f'(0)=0$, ma $0$ non è né massimo né minimo, perché $f$ è strettamente crescente.`,
        },
        {
          id: 's08.teoremi.L1.q3',
          type: 'num',
          prompt: String.raw`Quanti punti stazionari ha $f(x)=x^3-12x$ in $\R$?`,
          answer: '2',
          explain: String.raw`$f'(x)=3x^2-12=0$ se $x^2=4$, cioè $x=\pm2$. Sono due punti stazionari.`,
        },
        {
          id: 's08.teoremi.L1.q4',
          type: 'mcq',
          prompt: String.raw`Per $f(x)=|x|$ quale punto è critico ma non stazionario?`,
          options: [
            String.raw`$x=0$`,
            String.raw`$x=1$`,
            String.raw`nessuno: $|x|$ non ha punti critici`,
            String.raw`$x=-1$`,
          ],
          answer: 0,
          explain: String.raw`In $x=0$ la funzione non è derivabile: il punto è critico per definizione, ma non stazionario, perché la derivata non esiste (e non è zero). In $x=\pm1$ la derivata vale $\pm1$, non è critico.`,
        },
        {
          type: 'learn',
          title: 'Dimostrazione di Fermat',
          body: String.raw`Idea: se $x_0$ è un massimo relativo, il valore $f(x_0+h)$ è al più $f(x_0)$ per $h$ piccolo. Il rapporto incrementale è quindi $\le0$ per $h>0$ e $\ge0$ per $h<0$. Per derivabilità i due limiti coincidono: l'unico numero compatibile è $0$.`,
        },
        {
          id: 's08.teoremi.L1.q5',
          type: 'order',
          prompt: String.raw`Riordina i passi della dimostrazione di Fermat per un massimo relativo $x_0$, derivabile in $x_0$.`,
          steps: [
            String.raw`Suppongo che $x_0$ sia un punto di massimo relativo interno, e $f$ derivabile in $x_0$.`,
            String.raw`Per $h$ piccolo vale $f(x_0+h)\le f(x_0)$, cioè $f(x_0+h)-f(x_0)\le0$.`,
            String.raw`Per $h>0$ il rapporto incrementale è $\le0$, quindi $f'_+(x_0)\le0$; per $h<0$ è $\ge0$, quindi $f'_-(x_0)\ge0$.`,
            String.raw`Poiché $f$ è derivabile, $f'_+(x_0)=f'_-(x_0)=f'(x_0)$: l'unico valore compatibile è $f'(x_0)=0$.`,
          ],
          distractors: [
            String.raw`Per $h>0$ il rapporto è $\ge0$, quindi $f'(x_0)\ge0$, e il massimo ha derivata positiva.`,
            String.raw`Dalla continuità di $f$ segue $f'(x_0)=0$ senza bisogno di considerare $h>0$ e $h<0$.`,
          ],
          explain: String.raw`Il cuore della dimostrazione è confrontare i due limiti laterali del rapporto incrementale. Il primo distrattore ha il segno sbagliato per $h>0$; il secondo salta la parte essenziale: la continuità non basta per la derivata.`,
        },
        {
          id: 's08.teoremi.L1.q6',
          type: 'open',
          points: 3,
          prompt: String.raw`Enuncia il teorema di Fermat e dimostra che, se $x_0$ è un punto di minimo relativo interno con $f$ derivabile in $x_0$, allora $f'(x_0)=0$.`,
          answer: String.raw`Enunciato: sia $x_0$ interno a un intervallo, $f$ derivabile in $x_0$ e $x_0$ di massimo o minimo relativo. Allora $f'(x_0)=0$. Dimostrazione (minimo): per $h$ piccolo $f(x_0+h)\ge f(x_0)$. Per $h>0$ il rapporto è $\ge0$, quindi $f'(x_0)\ge0$. Per $h<0$ il rapporto è $\le0$, quindi $f'(x_0)\le0$. Dunque $f'(x_0)=0$.`,
          rubric: [
            String.raw`Enunciato: punto interno, derivabilità, estremo relativo, tesi $f'(x_0)=0$`,
            String.raw`Confronto del segno del rapporto incrementale per $h>0$ e per $h<0$`,
            String.raw`Uso della derivabilità: i due limiti laterali coincidono`,
            String.raw`Conclusione corretta $f'(x_0)=0$`,
          ],
        },
      ],
    },
    {
      id: 's08.teoremi.L2',
      title: 'Rolle e Lagrange',
      cards: [
        {
          type: 'learn',
          title: 'Rolle e Lagrange',
          body: String.raw`>* **Teorema di Rolle.** Sia $f$ continua su $[a,b]$, derivabile in $(a,b)$, con $f(a)=f(b)$. Allora esiste $c\in(a,b)$ con $f'(c)=0$.

>* **Teorema di Lagrange.** Sia $f$ continua su $[a,b]$ e derivabile in $(a,b)$. Allora esiste $c\in(a,b)$ con
$$f'(c)=\frac{f(b)-f(a)}{b-a}.$$

Geometria: Lagrange dice che esiste un punto in cui la tangente è **parallela alla secante** tra $(a,f(a))$ e $(b,f(b))$. Rolle è il caso particolare in cui la secante è orizzontale.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: Rolle per $x^2-4$',
          problem: String.raw`Verifica le ipotesi di Rolle per $f(x)=x^2-4$ su $[-2,2]$ e trova $c$.`,
          steps: [
            String.raw`$f$ è un polinomio: continua su $[-2,2]$ e derivabile ovunque. Inoltre $f(-2)=0=f(2)$.`,
            String.raw`$f'(x)=2x$, che si annulla in $x=0$, interno a $(-2,2)$.`,
          ],
          result: String.raw`Le ipotesi valgono e $c=0$: la tangente nel vertice è orizzontale.`,
        },
        {
          id: 's08.teoremi.L2.q1',
          type: 'mcq',
          prompt: String.raw`Per $f(x)=|x|$ su $[-1,1]$, con $f(-1)=f(1)=1$, quale ipotesi di Rolle non vale?`,
          options: [
            String.raw`$f$ non è derivabile in $0$, che è interno a $(-1,1)$`,
            String.raw`$f(-1)\neq f(1)$`,
            String.raw`$f$ non è continua su $[-1,1]$`,
            String.raw`Non manca nessuna ipotesi: $c$ esiste sempre`,
          ],
          answer: 0,
          explain: String.raw`$|x|$ è continua su $[-1,1]$ e $f(-1)=f(1)$, ma non è derivabile in $0$, dove non si può trovare $f'(c)=0$. Le altre opzioni sono false: i valori agli estremi sono uguali, e la funzione è continua. La quarta è una conclusione sbagliata: la conclusione di Rolle vale solo con tutte le ipotesi.`,
        },
        {
          id: 's08.teoremi.L2.q2',
          type: 'num',
          prompt: String.raw`Per $f(x)=x^2$ su $[1,5]$, qual è il valore $c$ del teorema di Lagrange?`,
          answer: '3',
          explain: String.raw`La pendenza della secante è $\frac{f(5)-f(1)}{5-1}=\frac{25-1}{4}=6$. Poiché $f'(c)=2c$, si ha $2c=6$, cioè $c=3$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: Lagrange per $x^3$ su $[0,1]$',
          problem: String.raw`Trova $c$ del teorema di Lagrange per $f(x)=x^3$ su $[0,1]$.`,
          steps: [
            String.raw`La pendenza della secante è $\frac{f(1)-f(0)}{1-0}$.`,
            {
              text: String.raw`Calcola la pendenza della secante.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $\frac{f(1)-f(0)}{1-0}$ per $f(x)=x^3$?`,
                answer: '1',
                explain: String.raw`$f(1)=1$ e $f(0)=0$: la pendenza è $1$.`,
              },
            },
            {
              text: String.raw`Imponi $f'(c)=1$ con $f'(x)=3x^2$ e risolvi per $c\in(0,1)$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $c>0$ con $3c^2=1$?`,
                answer: '1/sqrt(3)',
                explain: String.raw`$3c^2=1$ dà $c=\frac{1}{\sqrt3}$, che è in $(0,1)$.`,
              },
            },
          ],
          result: String.raw`$c=\frac{1}{\sqrt3}$: la tangente in $c$ è parallela alla secante tra $0$ e $1$.`,
        },
        {
          id: 's08.teoremi.L2.q3',
          type: 'tf',
          prompt: String.raw`Vero o falso? Il teorema di Lagrange vale anche se $f$ non è continua in $a$.`,
          answer: false,
          explain: String.raw`Falso. Serve la continuità su tutto $[a,b]$, incluso $a$ e $b$. Senza continuità agli estremi, il teorema non garantisce il punto $c$.`,
        },
        {
          id: 's08.teoremi.L2.q4',
          type: 'num',
          prompt: String.raw`Per $f(x)=x^3$ su $[0,2]$, quanto vale $c$ del teorema di Lagrange, se $c>0$? Scrivi il valore esatto.`,
          answer: '2/sqrt(3)',
          explain: String.raw`La pendenza è $\frac{8-0}{2}=4$. Da $3c^2=4$ si ottiene $c=\frac{2}{\sqrt3}\approx1{,}15$, in $(0,2)$.`,
        },
        {
          type: 'learn',
          title: 'Dimostrazione di Lagrange',
          body: String.raw`Idea: togli alla funzione la retta secante. Con $m=\frac{f(b)-f(a)}{b-a}$ la funzione $g(x)=f(x)-mx$ ha gli stessi valori agli estremi. Applicando Rolle a $g$ si trova $c$ con $g'(c)=0$, cioè $f'(c)=m$.`,
        },
        {
          id: 's08.teoremi.L2.q5',
          type: 'order',
          prompt: String.raw`Riordina i passi della dimostrazione del teorema di Lagrange.`,
          steps: [
            String.raw`Sia $m=\frac{f(b)-f(a)}{b-a}$ e $g(x)=f(x)-mx$.`,
            String.raw`Calcolo $g(b)-g(a)=f(b)-f(a)-m(b-a)=0$: quindi $g(a)=g(b)$.`,
            String.raw`Applico Rolle a $g$, continua su $[a,b]$ e derivabile in $(a,b)$: esiste $c\in(a,b)$ con $g'(c)=0$.`,
            String.raw`Poiché $g'(x)=f'(x)-m$, si ha $f'(c)=m=\frac{f(b)-f(a)}{b-a}$.`,
          ],
          distractors: [
            String.raw`Applico Fermat direttamente a $f$, senza ausiliaria: quindi $f'(c)=0$ per ogni $c$.`,
            String.raw`Scelgo $g(x)=f(x)+mx$ e ottengo $g'(c)=0$, quindi $f'(c)=-m$.`,
          ],
          explain: String.raw`La chiave è la funzione ausiliaria $g$: toglie la secante e rende gli estremi uguali, così Rolle si applica. Il primo distrattore dimentica che Fermat e Rolle richiedono $f(a)=f(b)$; il secondo cambia segno alla secante e sbaglia la derivata.`,
        },
        {
          id: 's08.teoremi.L2.q6',
          type: 'open',
          points: 3,
          prompt: String.raw`Enuncia il teorema di Lagrange e spiegane il significato geometrico. Dimostralo usando il teorema di Rolle.`,
          answer: String.raw`Enunciato: se $f$ è continua su $[a,b]$ e derivabile in $(a,b)$, esiste $c\in(a,b)$ con $f'(c)=\frac{f(b)-f(a)}{b-a}$. Geometria: esiste un punto in cui la tangente è parallela alla secante per $(a,f(a))$ e $(b,f(b))$. Dimostrazione: $g(x)=f(x)-mx$ con $m$ la pendenza della secante verifica $g(a)=g(b)$; per Rolle esiste $c$ con $g'(c)=0$, cioè $f'(c)=m$.`,
          rubric: [
            String.raw`Enunciato con ipotesi (continuità su $[a,b]$, derivabilità in $(a,b)$) e tesi`,
            String.raw`Significato geometrico: tangente parallela alla secante`,
            String.raw`Funzione ausiliaria $g(x)=f(x)-mx$ con $g(a)=g(b)$`,
            String.raw`Applicazione di Rolle e conclusione $f'(c)=m$`,
          ],
        },
      ],
    },
    {
      id: 's08.teoremi.L3',
      title: 'Monotonia e invertibilità',
      cards: [
        {
          type: 'learn',
          title: 'Il test di monotonia',
          body: String.raw`Sia $f$ derivabile su un intervallo $I$.
- Se $f'(x)\ge0$ per ogni $x\in I$, allora $f$ è **non decrescente** su $I$.
- Se $f'(x)>0$ per ogni $x$ interno a $I$ (salvo al più punti isolati), allora $f$ è **strettamente crescente**.
- Se $f'=0$ su un intervallo, allora $f$ è costante lì. In particolare se $f'=g'$, allora $f-g$ è costante.

Il segno della derivata dice dove la funzione sale o scende. Lo studio si fa come tabella: punti critici, segno di $f'$, conclusione.`,
        },
        {
          type: 'example',
          title: 'Esempio svolto: monotonia di $x^3-3x$',
          problem: String.raw`Studia la monotonia di $f(x)=x^3-3x$ su $\R$.`,
          steps: [
            String.raw`$f'(x)=3x^2-3=3(x-1)(x+1)$. Si annulla in $x=-1$ e $x=1$.`,
            String.raw`Segno: per $x<-1$ è $+$ (prodotto di due negativi per $3$); tra $-1$ e $1$ è $-$; per $x>1$ è $+$.`,
            String.raw`Quindi $f$ cresce su $(-\infty,-1]$ e su $[1,+\infty)$, decresce su $[-1,1]$.`,
          ],
          result: String.raw`Massimo relativo in $x=-1$ con $f(-1)=2$; minimo relativo in $x=1$ con $f(1)=-2$.`,
        },
        {
          type: 'example',
          title: 'Esempio a completamento: invertibilità di $x+\\tfrac12\\sin x$',
          problem: String.raw`Dimostra che $f(x)=x+\frac12\sin x$ è invertibile su $\R$.`,
          steps: [
            String.raw`Calcolo la derivata: $f'(x)=1+\frac12\cos x$.`,
            {
              text: String.raw`Per trovare il minimo di $f'$ serve il minimo di $\cos x$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Qual è il minimo di $\cos x$?`,
                answer: '-1',
                explain: String.raw`Il coseno varia tra $-1$ e $1$.`,
              },
            },
            {
              text: String.raw`Quindi $f'(x)\ge1+\frac12(-1)=\frac12>0$ per ogni $x$.`,
              ask: {
                type: 'num',
                prompt: String.raw`Quanto vale $1+\frac12\cdot(-1)$?`,
                answer: '1/2',
                explain: String.raw`$1-\frac12=\frac12$.`,
              },
            },
          ],
          result: String.raw`$f'>0$ ovunque: $f$ è strettamente crescente su $\R$, quindi iniettiva, quindi invertibile su $\R$ (sull'immagine).`,
        },
        {
          id: 's08.teoremi.L3.q1',
          type: 'mcq',
          prompt: String.raw`Quale è la definizione di funzione strettamente crescente su $I$?`,
          options: [
            String.raw`per ogni $x_1<x_2$ in $I$ si ha $f(x_1)<f(x_2)$`,
            String.raw`per ogni $x_1<x_2$ in $I$ si ha $f(x_1)\le f(x_2)$`,
            String.raw`$f'(x)>0$ per ogni $x\in I$`,
            String.raw`$f(x)>0$ per ogni $x\in I$`,
          ],
          answer: 0,
          explain: String.raw`La definizione è sui valori: per ogni coppia $x_1<x_2$, $f(x_1)<f(x_2)$. Il secondo descrive una funzione non decrescente. Il terzo è una condizione sufficiente, non la definizione. Il quarto riguarda il segno dei valori.`,
        },
        {
          id: 's08.teoremi.L3.q2',
          type: 'tf',
          prompt: String.raw`Vero o falso? Se $f'(x)>0$ su un intervallo, allora $f$ è strettamente crescente su quell'intervallo.`,
          answer: true,
          explain: String.raw`Vero: è il test di monotonia (salvo al più punti isolati di derivata nulla, che non cambiano la conclusione).`,
        },
        {
          id: 's08.teoremi.L3.q3',
          type: 'expr',
          prompt: String.raw`Calcola $f'(x)$ se $f(x)=x^3-3x$.`,
          answer: '3*x^2-3',
          vars: ['x'],
          explain: String.raw`$D(x^3)=3x^2$, $D(-3x)=-3$: $f'(x)=3x^2-3$.`,
        },
        {
          id: 's08.teoremi.L3.q4',
          type: 'interval',
          prompt: String.raw`Dove è decrescente $f(x)=x^3-12x$? Scrivi l'intervallo.`,
          answer: '(-2,2)',
          explain: String.raw`$f'(x)=3x^2-12=3(x-2)(x+2)$ è negativa tra $-2$ e $2$, quindi $f$ decresce su $(-2,2)$.`,
        },
        {
          id: 's08.teoremi.L3.q5',
          type: 'problem',
          level: 3,
          source: 'Appello 03/09/2026 · Parte B',
          points: 4,
          prompt: String.raw`Sia $f(x)=x+\frac12\sin x$. (a) Calcola $f'(x)$. (b) Trova il minimo di $f'$ su $\R$. (c) La funzione è invertibile su $\R$?`,
          parts: [
            {
              type: 'expr',
              prompt: String.raw`(a) $f'(x)$`,
              answer: '1+cos(x)/2',
              vars: ['x'],
              explain: String.raw`$D(x)=1$, $D(\frac12\sin x)=\frac12\cos x$.`,
            },
            {
              type: 'num',
              prompt: String.raw`(b) Minimo di $f'$ su $\R$`,
              answer: '1/2',
              explain: String.raw`$\cos x\ge-1$, quindi $f'\ge1-\frac12=\frac12$ con uguaglianza in $x=\pi+2k\pi$.`,
            },
            {
              type: 'mcq',
              prompt: String.raw`(c) La funzione è invertibile su $\R$?`,
              options: [
                String.raw`Sì: $f'\ge\frac12>0$, quindi $f$ è strettamente crescente e iniettiva`,
                String.raw`No: $f$ ha un punto critico`,
                String.raw`Sì, perché $f$ è dispari`,
                String.raw`No: $f$ non è continua`,
              ],
              answer: 0,
              explain: String.raw`Con $f'\ge\frac12>0$, $f$ è strettamente crescente, quindi iniettiva su $\R$ e invertibile sull'immagine. Un punto critico non impedisce l'invertibilità, se $f'$ non cambia segno. La parità non c'entra; la continuità è vera perché $f$ è derivabile.`,
            },
          ],
          solution: String.raw`(a) $f'(x)=1+\frac12\cos x$. (b) Minimo $\frac12$, perché $\cos x\ge-1$. (c) Poiché $f'\ge\frac12>0$, $f$ è strettamente crescente su $\R$ e quindi invertibile sulla sua immagine.`,
        },
        {
          id: 's08.teoremi.L3.q6',
          type: 'num',
          prompt: String.raw`Quanti punti stazionari ha $f(x)=x^4-8x^2$ in $\R$?`,
          answer: '3',
          explain: String.raw`$f'(x)=4x^3-16x=4x(x^2-4)$, che si annulla in $x=0$ e $x=\pm2$. Sono tre punti.`,
        },
      ],
    },
  ],
  practice: [
    {
      id: 's08.teoremi.p1',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const a = R.int(-3, 2), b = a + R.pick([2, 4, 6]), p = R.nz(-3, 3);
        return {
          type: 'num',
          prompt: String.raw`Per $f(x)=x^2${p === 0 ? '' : (p > 0 ? '+' : '-') + ' ' + (Math.abs(p) === 1 ? '' : Math.abs(p)) + 'x'}$ su $[${a},${b}]$, qual è il valore $c$ del teorema di Lagrange?`,
          answer: H.fracStr(a + b, 2),
          explain: String.raw`La pendenza della secante è $a+b+(${p})=${a + b + p}$ (la somma $a+b$ più $p$), e $f'(c)=2c+(${p})$. Quindi $c=\frac{a+b}{2}=${H.fracStr(a + b, 2)}$, in $(${a},${b})$.`,
        };
      },
    },
    {
      id: 's08.teoremi.p2',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const p = R.int(-3, 0), q = R.int(p + 2, p + 6);
        return {
          type: 'num',
          prompt: String.raw`Per $f(x)=(x-(${p}))(x-(${q}))$ su $[${p},${q}]$, il teorema di Rolle dà $c$ con $f'(c)=0$. Quanto vale $c$?`,
          answer: H.fracStr(p + q, 2),
          explain: String.raw`$f(x)=x^2-(${p + q})x+(${p * q})$, quindi $f'(x)=2x-(${p + q})$. Si annulla in $x=\frac{${p + q}}{2}=${H.fracStr(p + q, 2)}$, interno a $(${p},${q})$.`,
        };
      },
    },
    {
      id: 's08.teoremi.p3',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const k = R.pick([1, 2, 3]);
        return {
          type: 'set',
          prompt: String.raw`Trova tutti i punti stazionari di $f(x)=x^3-${3 * k * k}x$, separati da punto e virgola.`,
          answer: [String(k), String(-k)],
          explain: String.raw`$f'(x)=3x^2-${3 * k * k}=0$ dà $x^2=${k * k}$, quindi $x=\pm${k}$.`,
        };
      },
    },
    {
      id: 's08.teoremi.p4',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const r = R.pick([1, 2, 3]);
        return {
          type: 'interval',
          prompt: String.raw`Dove è decrescente $f(x)=x^3-${3 * r * r}x$? Scrivi l'intervallo.`,
          answer: `(${-r},${r})`,
          explain: String.raw`$f'(x)=3x^2-${3 * r * r}=3(x-${r})(x+${r})$ è negativa per $|x|<${r}$: decresce su $(${-r},${r})$.`,
        };
      },
    },
    {
      id: 's08.teoremi.p5',
      type: 'gen',
      level: 2,
      gen: (R) => {
        const b = R.pick([1, 2, 3, 4]);
        return {
          type: 'num',
          prompt: String.raw`Per $f(x)=x^3$ su $[0,${b}]$, quanto vale $c>0$ del teorema di Lagrange? Scrivi il valore esatto.`,
          answer: `${b}/sqrt(3)`,
          explain: String.raw`La pendenza della secante è $\frac{${b}^3}{${b}}=${b * b}$. Da $3c^2=${b * b}$ si ottiene $c=\frac{${b}}{\sqrt3}$, in $(0,${b})$.`,
        };
      },
    },
    {
      id: 's08.teoremi.p6',
      type: 'tf',
      prompt: String.raw`Vero o falso? Se $f$ è derivabile in $x_0$ e $f'(x_0)=0$, allora $x_0$ è un estremo relativo.`,
      answer: false,
      explain: String.raw`Falso: $f(x)=x^3$ in $0$ ha derivata nulla ma non è un estremo. Fermat dà solo una condizione necessaria.`,
    },
    {
      id: 's08.teoremi.p7',
      type: 'mcq',
      prompt: String.raw`Quale ipotesi di Rolle manca per $f(x)=|x-1|$ su $[0,2]$?`,
      options: [
        String.raw`$f$ non è derivabile in $1$, che è interno a $(0,2)$`,
        String.raw`$f(0)\neq f(2)$`,
        String.raw`$f$ non è continua su $[0,2]$`,
        String.raw`nessuna: $f(0)=f(2)$ e $f$ è derivabile in ogni punto di $(0,2)$`,
      ],
      answer: 0,
      explain: String.raw`$f(0)=f(2)=1$ e $f$ è continua. Ma in $x=1$ c'è un punto angoloso: $f$ non è derivabile lì, quindi Rolle non si applica (e infatti $f'=\pm1$ non si annulla mai).`,
    },
    {
      id: 's08.teoremi.p8',
      type: 'num',
      prompt: String.raw`Quanti punti stazionari ha $f(x)=x^3-3x^2$ in $\R$? Attenzione: calcola $f'(x)=3x^2-6x$.`,
      answer: '2',
      explain: String.raw`$f'(x)=3x(x-2)$: si annulla in $x=0$ e $x=2$. Sono due punti.`,
    },
    {
      id: 's08.teoremi.p9',
      type: 'tf',
      prompt: String.raw`Vero o falso? Se $f'(x)\ge0$ su $\R$, allora $f$ è non decrescente su $\R$.`,
      answer: true,
      explain: String.raw`Vero: è il test di monotonia (versione non stretta).`,
    },
    {
      id: 's08.teoremi.p10',
      type: 'mcq',
      prompt: String.raw`Per $f(x)=x^3$, $f$ è strettamente crescente su $\R$?`,
      options: [
        String.raw`Sì: $f'(x)=3x^2\ge0$, con $f'(0)=0$ solo in un punto isolato`,
        String.raw`No: $f'(0)=0$ quindi $f$ non è crescente`,
        String.raw`No: $f$ è decrescente per $x<0$`,
        String.raw`Sì, perché $f$ è pari`,
      ],
      answer: 0,
      explain: String.raw`$f'(x)=3x^2$ è positiva ovunque tranne in $0$. Un punto isolato in cui $f'=0$ non blocca la crescita stretta. Il secondo distrattore confonde il punto stazionario con il non essere crescente. Il terzo è falso perché $f'\ge0$. Il quarto: $x^3$ è dispari, non pari.`,
    },
    {
      id: 's08.teoremi.p11',
      type: 'num',
      prompt: String.raw`Quanto vale $f'(0)$ per $f(x)=\sin x+x$?`,
      answer: '2',
      explain: String.raw`$f'(x)=\cos x+1$, quindi $f'(0)=1+1=2$.`,
    },
    {
      id: 's08.teoremi.p12',
      type: 'mcq',
      prompt: String.raw`Quale teorema garantisce un punto $c$ con $f'(c)$ uguale alla pendenza della secante per $a$ e $b$?`,
      options: [
        String.raw`Lagrange`,
        String.raw`Fermat`,
        String.raw`Weierstrass`,
        String.raw`dei valori intermedi`,
      ],
      answer: 0,
      explain: String.raw`È Lagrange: tangente parallela alla secante. Fermat riguarda un punto di estremo con tangente orizzontale. Weierstrass garantisce massimo e minimo. Il teorema dei valori intermedi riguarda i valori della funzione, non la derivata.`,
    },
  ],
  flashcards: [
    {
      id: 's08.teoremi.fc1',
      kind: 'thm',
      front: String.raw`Teorema di Fermat`,
      back: String.raw`Se $x_0$ è interno all'intervallo, $f$ è derivabile in $x_0$ e $x_0$ è di massimo o minimo relativo, allora $f'(x_0)=0$. La condizione è solo necessaria.`,
    },
    {
      id: 's08.teoremi.fc2',
      kind: 'dim',
      front: String.raw`Idea della dimostrazione di Fermat`,
      back: String.raw`Per un massimo $f(x_0+h)-f(x_0)\le0$: il rapporto incrementale è $\le0$ per $h>0$ e $\ge0$ per $h<0$. Per derivabilità i due limiti coincidono, quindi $f'(x_0)=0$.`,
    },
    {
      id: 's08.teoremi.fc3',
      kind: 'thm',
      front: String.raw`Teorema di Rolle`,
      back: String.raw`$f$ continua su $[a,b]$, derivabile in $(a,b)$, con $f(a)=f(b)$. Allora esiste $c\in(a,b)$ con $f'(c)=0$.`,
    },
    {
      id: 's08.teoremi.fc4',
      kind: 'thm',
      front: String.raw`Teorema di Lagrange`,
      back: String.raw`$f$ continua su $[a,b]$, derivabile in $(a,b)$. Allora esiste $c\in(a,b)$ con $f'(c)=\dfrac{f(b)-f(a)}{b-a}$: la tangente in $c$ è parallela alla secante.`,
    },
    {
      id: 's08.teoremi.fc5',
      kind: 'dim',
      front: String.raw`Idea della dimostrazione di Lagrange`,
      back: String.raw`Con $m=\frac{f(b)-f(a)}{b-a}$, la funzione $g(x)=f(x)-mx$ ha $g(a)=g(b)$. Rolle su $g$ dà $c$ con $g'(c)=0$, cioè $f'(c)=m$.`,
    },
    {
      id: 's08.teoremi.fc6',
      kind: 'def',
      front: String.raw`Punto stazionario e punto critico`,
      back: String.raw`Stazionario: $f$ derivabile con $f'(x_0)=0$. Critico: stazionario, oppure $f$ non derivabile in $x_0$.`,
    },
    {
      id: 's08.teoremi.fc7',
      kind: 'thm',
      front: String.raw`Test di monotonia`,
      back: String.raw`$f'\ge0$ su $I$ $\Rightarrow$ $f$ non decrescente; $f'>0$ su $I$ (salvo punti isolati) $\Rightarrow$ $f$ strettamente crescente; $f'=0$ su $I$ $\Rightarrow$ $f$ costante.`,
    },
    {
      id: 's08.teoremi.fc8',
      kind: 'errore',
      front: String.raw`Errore tipico: "$f'(x_0)=0$ quindi $x_0$ è un estremo"`,
      back: String.raw`Falso: Fermat è una condizione necessaria. $x^3$ in $0$ ha derivata nulla ma non è un estremo.`,
    },
    {
      id: 's08.teoremi.fc9',
      kind: 'def',
      front: String.raw`Funzione strettamente crescente`,
      back: String.raw`Per ogni $x_1<x_2$ in $I$ si ha $f(x_1)<f(x_2)$. Una funzione strettamente crescente è iniettiva.`,
    },
    {
      id: 's08.teoremi.fc10',
      kind: 'metodo',
      front: String.raw`Studio di monotonia: come si fa`,
      back: String.raw`1) Calcola $f'$. 2) Trova i punti in cui $f'=0$ o non esiste. 3) Studia il segno di $f'$ sugli intervalli tra questi punti. 4) Concludi: $+$ crescente, $-$ decrescente.`,
    },
  ],
});
