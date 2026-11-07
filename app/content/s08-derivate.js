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
