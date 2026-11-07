# Design: principi e regole

Questo documento fissa le regole di design dell'app e le ragioni di ogni scelta.
Le fonti sono le linee guida delle piattaforme (Apple Human Interface Guidelines, Material Design 3),
gli standard di accessibilità (WCAG 2.2) e il comportamento delle app di apprendimento più usate
(Duolingo, Anki, Khan Academy, Brilliant). Dove riporto un numero di una linea guida lo indico;
i valori di Apple e Material sono quelli noti delle linee guida, non ricontrollati sulla pagina ufficiale.

## 1. Principi (condivisi da HIG, Material e dalle app di studio)

1. **Chiarezza.** Un'azione principale per schermata. Testo leggibile, icone precise, contrasto adeguato.
   Le app di studio migliori (Anki, Khan Academy) mostrano una domanda alla volta e una sola azione in evidenza.
2. **Deferenza.** L'interfaccia sta indietro, il contenuto (la formula, la domanda) è il protagonista.
   Niente sfondi decorativi dietro al testo: lo sfondo a quadretti è stato tolto per questo.
3. **Profondità con misura.** I livelli (sfondo, superfici, foglio di feedback) si distinguono con il colore
   e con poche ombre. Il movimento spiega un cambiamento, non lo decora.
4. **Coerenza.** Stessi raggi, spaziature e stati ovunque. Pochi elementi ripetuti in modo identico
   valgono più di molti stili diversi.
5. **Semplicità prima della funzione.** Quello che non serve in una schermata va in un'altra.
   Il voto stimato, la sincronizzazione e le statistiche stanno nel Profilo, non nel percorso.

## 2. Navigazione

- **Barra inferiore con 5 destinazioni al massimo** con etichetta sempre visibile (HIG: tab bar;
  Material 3: navigation bar con 3–5 destinazioni). Le etichette sono in 12 px, semibold.
- **Titolo di schermata** in alto, a sinistra; sulle pagine secondarie un pulsante "indietro" (chevron),
  e sulle sessioni a tutto schermo una "X" per uscire, come in Duolingo.
- **Sessioni a tutto schermo** (lezione, ripasso, esame) senza barra inferiore: sono compiti, non navigazione.
- **Profilo in liste raggruppate** (stile impostazioni di iOS): righe con etichetta, valore e azione.

## 3. Bersagli tattili e interazione

- Minimo **44 × 44 pt** per Apple HIG; **48 × 48 dp** per Material 3. Usiamo **44 px come minimo assoluto**
  e 56 px per le risposte degli esercizi.
- WCAG 2.2 criterio 2.5.8 (livello AA): minimo **24 × 24 CSS px** (verificato); il livello AAA (2.5.5) chiede 44 px.
  Seguiamo il valore più alto.
- Gli stati (selezionato, corretto, sbagliato, bloccato) si distinguono con **colore + forma/icona + testo**.
  Mai solo colore (WCAG 1.4.1).

## 4. Tipografia

- **Caratteri di sistema** per l'interfaccia (SF su Apple, Roboto su Android, Segoe su Windows): è ciò
  che Apple e Material raccomandano per sentirsi nativi, e riduce il peso della pagina.
  La matematica resta in KaTeX.
- **Scala a 6 livelli**, non di più: titolo grande 28/34 (semibold), titolo 22/28, sottotitolo 17/24 (semibold),
  corpo 17/24 (HIG usa 17 pt come corpo), didascalia 14/20, etichetta 12/16.
- Lunghezza di riga non oltre ~65 caratteri nel testo di teoria.
- Numeri che si allineano: `font-variant-numeric: tabular-nums`.

## 5. Colore

- **Un solo colore di marca** (blu) per le azioni e lo stato attivo. Il verde indica solo successo,
  il rosso solo errore, l'arancio solo la serie di giorni. Niente colore per sezione.
- **Ruoli semantici** (come i color role di Material 3): `surface`, `surface-raised`, `ink`, `ink-2`, `accent`,
  `success`, `danger`, `warning`. Ogni ruolo ha un valore per tema chiaro e uno per tema scuro.
- **Contrasto**: testo normale almeno 4,5:1, testo grande e componenti grafici almeno 3:1 (WCAG 1.4.3 e 1.4.11).
  Il tema va verificato con uno script (`tools/check-contrast.mjs`), non a occhio.
- Il tema scuro non è un'inversione: le superfici usano toni più chiari del fondo (elevazione tonale).

## 6. Forma, spaziatura, elevazione

- **Raggi a tre livelli**: 10 px (controlli piccoli), 14 px (pulsanti e campi), 20 px (schede).
  Nient'altro.
- **Spaziatura su scala di 4**: 4, 8, 12, 16, 20, 24, 32, 40. Margine laterale 16 px su telefono, 24 px su schermo largo.
- **Un'ombra** per le schede che stanno sopra allo sfondo; niente ombre sui testi o sulle liste.

## 7. Icone

- Un solo set di icone: griglia 24 px, tratto 2 px, angoli arrotondati, nessuna forma piena mescolata al tratto.
- Dove esiste un simbolo matematico, si usa il simbolo stesso (es. $\int$, $\lim$, $\sum$), composto con KaTeX.
  È più chiaro di un'icona disegnata a mano e richiama il contenuto del corso.
- Le icone decorative hanno `aria-hidden`; quelle che fanno da unico testo hanno un'etichetta.

## 8. Stati e feedback

- **Vuoto**: un'icona, una frase che spiega perché è vuoto, un'azione per uscirne. Mai una schermata bianca.
- **Caricamento**: scheletro della forma finale (o nessuno se la risposta è immediata).
- **Errore**: spiega che cosa è successo e che cosa fare, senza scusarsi a vuoto.
- **Feedback di un esercizio**: un foglio in basso con icona, esito in parole ("Corretto" / "Non ancora"),
  spiegazione, poi un solo pulsante. Come Duolingo, ma con il testo che dice l'esito.
- **Progressione**: barra di avanzamento sempre visibile durante una sessione; niente numeri che cambiano
  senza un motivo.

## 9. Onboarding

- Due schermate al massimo: la promessa in una frase, poi l'obiettivo giornaliero. Niente elenchi di funzioni.
- Si può saltare. Si arriva al primo esercizio entro un minuto (principio "prova prima", come Duolingo).
- Il voto stimato non compare finché non ci sono dati sufficienti: un numero che sembra un verdetto il primo giorno
  scoraggia e non è affidabile.

## 10. Movimento

- Transizioni brevi (150–250 ms), curve standard. Il movimento decorativo (rimbalzi) è al massimo in un punto.
- Rispetta `prefers-reduced-motion`: senza animazioni non cambia il significato di nulla.

## 11. Testo e microcopy

- Verbi sui pulsanti: "Verifica", "Continua", "Ripassa", "Inizia". Mai "OK" generico.
- Frasi brevi, italiano semplice, nessuna frase di riempimento. Il tono è quello di un buon ripetitore.
- Non dare giudizi sulla persona: "Non ancora" è meglio di "Sbagliato".

## 11b. Decisioni prese nel redesign (e perché)

- **Sfondo piatto**, senza quadretti: il contenuto è il protagonista (principio 2).
- **Caratteri di sistema** per l'interfaccia: nessun download da Google Fonts, aspetto nativo su ogni piattaforma.
- **Un colore di marca**, niente colore per sezione: le sezioni si distinguono per numero, simbolo e posizione.
- **Simboli di sezione in KaTeX** ($\int$, $\lim$, $\sum$…) sui nodi del percorso: sono l'icona più chiara
  per un corso di matematica, e non richiedono un set di icone disegnate a mano.
- **Un'azione principale** nella schermata Percorso ("Continua"), che è la lezione corrente.
- **Voto stimato nascosto** fino a tre lezioni completate: prima non significa nulla.
- **Profilo in liste raggruppate** con freccia sulle righe che eseguono un'azione (indicatore di azione).
- **Stati delle risposte** con colore + icona + testo.
- **Onboarding in due schermate**, con una formula reale come elemento visivo al posto di un elenco di funzioni.

## 12. Accessibilità: checklist

- Contrasto verificato con `node tools/check-contrast.mjs` (legge i token da `app/app.css`); focus visibile su ogni controllo; ordine di tabulazione logico.
- Titoli con gerarchia (un `h1` per schermata); tab con `aria-current`; progressi con `role="progressbar"`.
- Nessuna informazione solo nel colore; nessuna solo nel movimento.
- Testo che scala con la dimensione scelta dall'utente (unità `rem`, non pixel fissi per il testo).
- Testi alternativi per i grafici (`aria-label`) e per le formule (il testo LaTeX resta leggibile da lettore di schermo tramite KaTeX).

## Riferimenti

- Apple, *Human Interface Guidelines*: navigazione, barre, layout, tipografia, colore, icone.
- Google, *Material Design 3*: navigation bar, color roles, type scale, touch targets.
- W3C, *WCAG 2.2*: 1.4.1, 1.4.3, 1.4.11, 2.5.5, 2.5.8.
- Duolingo, Anki, Khan Academy, Brilliant: pattern di apprendimento su mobile (osservati, non copiati).
