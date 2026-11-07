# Schema dei contenuti

Ogni sezione del corso è un modulo ES in `app/content/sNN-nome.js` con `export default { ... }`.
I contenuti sono **dati + piccole funzioni generatrici**: niente DOM, niente import esterni tranne
`../engine/tex.js` (helper LaTeX). Tutto il testo è in **italiano**.

Verifica sempre con:

```bash
node tools/validate.mjs app/content/sNN-nome.js
```

Il validatore controlla: schema, id univoci, LaTeX (con KaTeX), che la risposta attesa superi la
correzione automatica, e che ogni generatore produca 40 esercizi validi.

---

## Testo (markdown ridotto)

Tutti i campi di testo (`prompt`, `explain`, `body`, `options`, …) accettano:

- paragrafi separati da una riga vuota; `**grassetto**`, `*corsivo*`;
- elenchi con `- ` o `1. ` a inizio riga; titoletti con `### `;
- riquadri: una riga che inizia con `> ` (nota), `>! ` (attenzione / errore tipico), `>* ` (teorema/definizione da sapere);
- matematica inline `$...$` e in display `$$...$$` (KaTeX). Macro disponibili: `\R \N \Z \Q \C`.

**Scrivi le stringhe con `String.raw` + backtick** così i backslash LaTeX non vanno raddoppiati:

```js
prompt: String.raw`Calcola $\displaystyle\lim_{x\to 0}\frac{\sin x}{x}$.`
```

Attenzione: in un template literal `${` apre un'interpolazione. Non scrivere mai `$` seguito
subito da `{` (es. `${}^n$` → scrivi `$ {}^n$`). Dentro i generatori invece l'interpolazione è
proprio ciò che vuoi: `` String.raw`$f(x) = ${H.poly([a, b, c])}$` ``.

Notazione del corso: `\log` = logaritmo naturale; prodotto scalare `\langle v, w\rangle`;
prodotto vettoriale `v \wedge w`; coniugato `\bar z`; `\sim` per asintotico; `o(\cdot)` per o-piccolo.

---

## Struttura

```js
import { H } from '../engine/tex.js';

export default {
  id: 's08',                        // id sezione (fisso, vedi docs/CURRICULUM.md)
  title: 'Derivate',
  subtitle: 'Rapporto incrementale, regole, teoremi',
  intro: String.raw`Testo introduttivo breve (perché conta all'esame).`,
  skills: [
    {
      id: 's08.def',                // id skill (fisso, vedi mappa)
      title: 'Definizione di derivata',
      summary: String.raw`Una frase: cosa saprai fare.`,
      prereq: ['s05.notevoli'],     // id di skill prerequisite (anche di altre sezioni)
      examRefs: ['Itinere 11/11/2025 · A-I', 'Appello 15/01/2026 · A-II'],
      lessons: [ { id: 's08.def.L1', title: 'Il rapporto incrementale', cards: [ /* card */ ] } ],
      practice: [ /* esercizi o generatori per il ripasso dilazionato */ ],
      flashcards: [ /* schede di teoria */ ],
    },
  ],
};
```

### Lezioni e card

Una lezione è breve (stile Duolingo): **8–14 card**, almeno il 60 % sono esercizi.
Ordine consigliato: intuizione → definizione → esempio svolto → esempio "a completamento"
(con `ask`) → esercizi dal facile al livello d'esame.

Card di teoria:

```js
{ type: 'learn', title: 'Idea', body: String.raw`...markdown...`, plot: { /* opzionale */ } }

{ type: 'example', title: 'Esempio svolto',
  problem: String.raw`Calcola la derivata di $x^2$ con la definizione.`,
  steps: [
    String.raw`Scrivo il rapporto incrementale: $\frac{(x+h)^2-x^2}{h}$.`,
    // passo "a completamento" (fading): lo studente deve rispondere prima di vederlo
    { text: String.raw`Semplifico: $\frac{2xh+h^2}{h} = 2x+h$.`,
      ask: { type: 'expr', prompt: String.raw`A cosa si riduce $\frac{2xh+h^2}{h}$?`, answer: '2x+h', vars: ['x','h'], explain: 'Raccogli h.' } },
    String.raw`Passo al limite per $h\to 0$: $2x$.`,
  ],
  result: String.raw`$D(x^2) = 2x$` }
```

`plot` (grafici SVG, sintassi math.js; `?:` per funzioni a tratti):

```js
plot: { fns: [{ f: 'x<1 ? x*log(x) : (x-1)/(2x-3)', label: 'f' }, 'x^2'],
        x: [-1, 4], y: [-3, 3],
        points: [[1, 0, 'punto angoloso']], open: [[0, 0]],   // pieni / vuoti
        vlines: [1.5], hlines: [0.5] }                           // asintoti tratteggiati
```

### Esercizi (anche usati come card)

Campi comuni: `id` (obbligatorio, univoco), `type`, `prompt`, `explain` (spiegazione mostrata
dopo la risposta: **sempre**, con il ragionamento, non solo il risultato), `hint` (opzionale),
`level` (1 base, 2 medio, 3 livello esame), `source` (es. `'Appello 10/02/2026 · Es. 4'`),
`plot` (opzionale).

| type | campi specifici | risposta dello studente |
|---|---|---|
| `mcq` | `options: [md]`, `answer: indice` o `[indici]` (scelta multipla), `noShuffle?` | click |
| `tf` | `answer: true/false` | Vero/Falso |
| `num` | `answer: 'sqrt(2)/2'` (espressione math.js numerica; `'inf'`, `'-inf'` ammessi), `alt?: [...]`, `tol?` | digita un numero/espressione |
| `expr` | `answer: 'e^x*(x^2+5x+6)'`, `vars?: ['x']`, `domain?: [a,b]` (punti di test, default [0.3,2.7]), `domains?: {a:[..]}`, `upToConstant?: true` (primitive), `alt?` | digita un'espressione |
| `interval` | `answer: '(0,3/2)U(3/2,inf)'` (anche `'R'`, `'vuoto'`, `'{2}'`) | digita intervalli |
| `tuple` | `answer: ['1','-1','2']`, `labels?: ['a','b','c']`, `proportional?: true` (piani, direzioni: uguali a meno di un multiplo) | una casella per componente |
| `set` | `answer: ['1', '-i']` (numeri reali o complessi, ordine irrilevante) | valori separati da `;` |
| `order` | `steps: [md]` nell'ordine **giusto** (il gioco li mescola), `distractors?: [md]` (passi sbagliati da scartare) | riordina (dimostrazioni tipo Parsons) |
| `cloze` | `text: 'md con [[0]] e [[1]]'`, `blanks: [{ options: [md], answer: indice }]` | sceglie per ogni buco |
| `match` | `pairs: [[sinistra, destra], ...]` (3–5 coppie) | abbina |
| `open` | `answer: md` (risposta modello), `rubric: [criteri]`, `points?` | scrive, poi si autovaluta con la rubrica (o chiede a Claude) |
| `problem` | `parts: [esercizi senza id]`, `solution: md`, `points?` | esercizio d'esame a più domande |

Note:
- `expr`: scegli `domain` dove sia la risposta sia le forme equivalenti sono definite
  (es. per `log(x)` usa `[0.5, 3]`). Le variabili-parametro (α) vanno in `vars` e `domains`.
- In `num`/`expr` lo studente può scrivere `ln`, `sen`, `tg`, `arctan`, `√`, `π`, `e^x`, `|x|`, `2x`, `1,5`.
- Usa `mcq` per risposte non numeriche (es. "converge/diverge/indeterminata", "punto angoloso/cuspide").
- I **distrattori** delle `mcq` devono essere errori tipici reali (segno, regola sbagliata, dimenticare il dominio…), e l'`explain` spiega perché sono sbagliati.
- Negli esercizi `problem` le `parts` sono sotto-domande auto-correggibili (dominio, limiti, derivata, estremi…) e `solution` contiene la soluzione completa scritta come all'esame.

### Generatori (esercizi infiniti con numeri casuali)

```js
{ id: 's08.regole.gen-prodotto', type: 'gen', level: 2,
  gen: (R) => {
    const a = R.nz(-5, 5), b = R.int(1, 4);
    return {
      type: 'expr',
      prompt: String.raw`Deriva $f(x) = ${H.coef(a)}x e^{${b}x}$.`,
      answer: `${a}*e^(${b}*x)*(1+${b}*x)`,
      explain: String.raw`Regola del prodotto: $f'(x) = ${a}e^{${b}x} + ${a * b}xe^{${b}x}$.`,
    };
  } }
```

`R` (in `app/engine/rng.js`): `R.int(a,b)`, `R.nz(a,b)` (≠0), `R.pick(arr)`, `R.sample(arr,k)`,
`R.shuffle(arr)`, `R.chance(p)`, `R.sign()`. `H` (in `app/engine/tex.js`): `H.frac(p,q)`,
`H.fracStr(p,q)`, `H.poly([coeff...])`, `H.polyStr`, `H.polyDeriv`, `H.coef(c)`, `H.signed(c,'x')`,
`H.lin(a,b)`, `H.sqrtTex(n)`, `H.sqrtParts(n)`, `H.cplx(a,b)`, `H.cplxStr(a,b)`, `H.vec([..])`,
`H.cross(u,v)`, `H.dot(u,v)`, `H.planeTex(a,b,c,d)`, `H.gcd`, `H.reduce`.
Il generatore ritorna un esercizio **senza id** di qualunque tipo (anche `mcq`, `problem`).
Scegli i parametri in modo che i numeri restino "da compito" (niente calcolatrice all'esame).

### Flashcard (teoria per la Parte A)

```js
{ id: 's08.def.fc1', kind: 'def',  // def | thm | dim | formula | metodo | errore
  front: String.raw`Definizione di funzione derivabile in $x_0$`,
  back: String.raw`$f$ è derivabile in $x_0$ se esiste **finito** $\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}$.` }
```

Per ogni teorema con dimostrazione richiesta (in grassetto nel programma) servono:
una flashcard `thm` (enunciato), una `dim` (idea della dimostrazione in 3–6 righe), un esercizio
`order` con i passi della dimostrazione (+ 1–2 distrattori) e un esercizio `open` con rubrica.

---

## Principi didattici da rispettare (vedi docs/PEDAGOGIA.md)

1. **Da zero**: nessun prerequisito implicito; ogni simbolo nuovo è spiegato la prima volta.
2. **Pratica di recupero** (testing effect): più esercizi che spiegazioni.
3. **Esempi svolti con dissolvenza** (worked-example fading): esempio completo → esempio con passi da completare (`ask`) → esercizio autonomo.
4. **Feedback elaborato**: ogni `explain` dice *perché*, e smonta l'errore tipico.
5. **Difficoltà graduale** fino al **livello d'esame** (`level: 3`, con `source` quando deriva da un tema reale).
6. **Varietà**: generatori per ogni abilità procedurale → il ripasso dilazionato propone sempre numeri nuovi.
7. Linguaggio chiaro e diretto, frasi brevi, niente riempitivi.

---

## Temi d'esame (`app/content/exams-*.js`)

```js
export default {
  exams: [
    {
      id: 'ex-2026-02-10',
      title: 'Appello del 10/02/2026',
      kind: 'appello',          // 'appello' | 'itinere1' | 'itinere2'
      date: '2026-02-10',
      durationMin: 120,         // 120 appello, 90 itinere (se il testo non dice altro)
      A: [                      // PARTE A – teoria
        { id: 'ex-2026-02-10.A1', type: 'open', points: 2, skills: ['s08.teoremi'],
          prompt: String.raw`Si enunci e si dimostri il Teorema di Fermat.`,
          answer: String.raw`...risposta modello completa...`,
          rubric: ['Ipotesi corrette', 'Tesi', 'Segno dei rapporti incrementali', 'Conclusione'] },
      ],
      B: [                      // PARTE B – esercizi
        { id: 'ex-2026-02-10.B4', type: 'problem', points: 4, skills: ['s10.limiti'],
          prompt: String.raw`Calcolare $\lim_{x\to0^+} \dots$`,
          parts: [ { type: 'num', prompt: 'Valore del limite', answer: '4', explain: '...' } ],
          solution: String.raw`...soluzione completa passo per passo...` },
      ],
    },
  ],
};
```

- `skills`: id della mappa del curriculum: l'app li usa per "Ripassa questo argomento".
- Le `parts` di un `problem` sono le risposte auto-correggibili, nell'ordine in cui le si incontra risolvendo.
- Se la soluzione ufficiale contiene un errore, correggilo e segnalalo con una riga `>! Nota: ...`.
