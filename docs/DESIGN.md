# Design: regole, fonti e decisioni

Ogni regola dice da dove viene e con quale grado di verifica:

- **[verificata]**: letta nel testo della fonte primaria o nella copia verbatim indicata.
- **[conoscenza]**: dalla mia conoscenza dei principi di design, non verificata sul testo ufficiale.

Le linee guida di Apple e di Material sono in larga parte dinamiche (pagine generate via JavaScript), quindi
non tutte sono leggibili con gli strumenti disponibili. Per questo distinguo le fonti.

## 1. Fonti

| Fonte | Stato | Dove |
|---|---|---|
| Apple, *Human Interface Guidelines* (edizione attuale) | verificata via copia verbatim di 172 pagine, generata dai dati DocC di Apple | <https://developer.apple.com/design/human-interface-guidelines/> · copia: <https://github.com/valentinllpz/apple-human-interface-guidelines> (agent skill, verbatim, dal sito Apple) |
| Google Support, *Touch target size* (Android) | verificata sul testo | <https://support.google.com/accessibility/android/answer/7101858> |
| W3C, *WCAG 2.2*, 2.5.8 Target Size (Minimum) | verificata sul testo | <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html> |
| Material Design 3 (m3.material.io) | **non verificata**: le pagine sono generate via JavaScript e non si leggono con gli strumenti disponibili | <https://m3.material.io/> |
| Material Web (libreria, documentazione d'implementazione) | letta: `docs/components/fab.md` ha un'opzione di area di tocco predefinita a 48 dp | <https://github.com/material-components/material-web> |

Non copio il testo di Apple nel repository: lo cito e ne applico i principi.

## 2. Accessibilità e bersagli

- **Bersaglio tattile minimo 44 × 44 pt** [verificata, HIG `buttons`: «a button needs a hit region of at least 44x44 pt»].
- **Dimensione minima dei controlli 28 × 28 pt** per i controlli meno importanti [verificata, HIG `accessibility`, tabella].
- **Spaziatura: circa 12 pt attorno agli elementi con cornice, 24 pt per quelli senza** [verificata, HIG `accessibility`].
- **48 × 48 dp, spaziatura di 8 dp tra i target** [verificata, Google Support].
- **24 × 24 px minimo (AA), 44 × 44 px (AAA)** [verificata, WCAG 2.2 2.5.8 e 2.5.5].
- **Applicato**: `--touch: 48px` (soddisfa Apple e Material); pulsanti principali alti 52 px; spaziatura dei controlli 12 px.
- **Contrasto del testo**: 4,5:1 fino a 17 pt, 3:1 da 18 pt in su e per il grassetto [verificata, HIG `accessibility`]. L'app applica 4,5:1 a tutto il testo, più restrittivo. Verificato con `tools/check-contrast.mjs` (WCAG 1.4.3 e 1.4.11).
- **Il colore non è mai l'unico segnale** [verificata, HIG `color`: «Avoid relying solely on color...»]. Ogni stato ha colore, forma/icona e testo.
- **Testo che scala**: unità `rem` su tutto il testo, così lo zoom del browser e le preferenze dell'utente funzionano [verificata, HIG `accessibility`: «Support larger text sizes», ingrandimento fino al 200%].

## 3. Navigazione

- **Barra inferiore con 5 destinazioni al massimo**, con etichette di una sola parola [verificata, HIG `tab-bars`: «fewer tabs» e «Use single words»].
- **Non nascondere né disattivare le voci della barra**: una sezione vuota spiega perché è vuota [verificata, HIG `tab-bars`: «Don't disable or hide tab bar buttons»]. Applicato: la scheda Ripasso vuota mostra uno stato vuoto.
- **La barra resta visibile durante la navigazione** tranne che nei modali a schermo intero, che sono compiti temporanei [verificata, HIG `tab-bars`].
- **Titolo della schermata, mai il nome dell'app** [verificata, HIG `toolbars`: «Don't title windows with your app name»]. Applicato: la barra mostra il nome della sezione.
- **Titolo grande a riposo, titolo compatto nella barra solo quando si scorre** [conoscenza, è la convenzione iOS per i titoli grandi].
- **Sessioni a tutto schermo con una X per uscire** [verificata, HIG `modality`: «Always give people an obvious way to dismiss a modal view»].
- **Conferma prima di chiudere un modale se si perde lavoro dell'utente** [verificata, HIG `modality`]. Applicato: uscita da una lezione con risposte date e da una prova d'esame in corso.

## 4. Onboarding e impostazioni

- **Insegnare con l'interazione** [verificata, HIG `onboarding`: «Teach through interactivity»]. Applicato: l'onboarding dà subito la prima lezione.
- **Posticipare le impostazioni non essenziali e usare valori predefiniti** [verificata, HIG `onboarding`: «Postpone nonessential setup flows»]. Applicato: il nome, l'obiettivo e la data d'esame stanno nel Profilo.
- **Una sola schermata di benvenuto**, breve [verificata, HIG `onboarding`: «brief, enjoyable experience»].
- **Niente impostazioni di aspetto proprie dell'app: l'app segue il sistema** [verificata, HIG `dark-mode`: «Avoid offering an app-specific appearance setting»]. Applicato: il selettore del tema è stato tolto.
- **Profilo in liste raggruppate, con la freccia sulle righe che eseguono un'azione** [conoscenza, come le impostazioni di sistema; coerente con HIG `lists-and-tables`].

## 5. Tipografia

- **Testo di corpo a 17 pt** [verificata, HIG `typography`: 17 pt di default per il corpo su iOS]. Applicato: 1,0625 rem (17 px con la radice standard).
- **Evitare pesi leggeri** [verificata, HIG `typography`: «avoid light font weights»]. Applicato: pesi da 400 in su.
- **Pochi caratteri** [verificata, HIG `typography`]. Applicato: caratteri di sistema più KaTeX per le formule.
- **Caratteri di sistema per l'interfaccia** [verificata nella sostanza: HIG `typography`, «Consider using the built-in text styles»; Material usa il sistema come base].

## 6. Icone, colore, stati

- **Icone con dimensione, peso e stile coerenti, e testo alternativo** [verificata, HIG `icons`]. Applicato: un solo set con tratto di 2 px; icone decorative con `aria-hidden`.
- **Peso dell'icona in linea con il testo accanto** [verificata, HIG `icons`].
- **Un solo significato per ogni colore** [verificata, HIG `color`: «Avoid using the same color to mean different things»]. Applicato: blu per le azioni e lo stato attivo, verde solo per il successo, rosso solo per l'errore, arancio per la serie.
- **Dimensione e forma dei simboli matematici** [conoscenza]: i simboli di sezione sono formule KaTeX, più chiare di icone disegnate a mano per un corso di matematica.

## 7. Feedback, caricamento, movimento

- **Mostrare subito qualcosa** [verificata, HIG `loading`: «Show something as soon as possible»]. Applicato: i contenuti sono locali e appaiono subito.
- **Indicatori di avanzamento determinati quando possibile, nella stessa posizione** [verificata, HIG `progress-indicators`]. Applicato: anelli e barre con valore, barra di avanzamento sempre in cima alla sessione.
- **Feedback breve e preciso; niente animazioni sulle interazioni frequenti** [verificata, HIG `motion`: «generally avoid adding motion to UI interactions that occur frequently»]. Applicato: rimosso il rimbalzo sul nodo "Inizia".
- **Il movimento è opzionale** [verificata, HIG `motion`: «Make motion optional»]. Applicato: `prefers-reduced-motion` azzera le animazioni.
- **Conferma di un'azione significativa completata** [verificata, HIG `feedback`]. Applicato: riepilogo a fine lezione.

## 8. Materiali e sistema

- **Liquid Glass** [verificata come presente nell'HIG 2026]: è un materiale nativo di iOS. La web app usa solo una sfocatura leggera della barra superiore e non imita il materiale del sistema.
- **Material 3: navigazione inferiore, ruoli colore, scala tipografica, forme** [conoscenza, non verificata sul testo]. Applicato come riferimento per la struttura, non come copia.

## 9. Testo e microcopy

- **Verbi sui pulsanti**: "Verifica", "Continua", "Ripassa", "Inizia" [conoscenza].
- **Frasi brevi, niente giudizi sulla persona**: "Non ancora" invece di "Sbagliato" [conoscenza].

## 10. Verifiche automatiche

- `node tools/check-contrast.mjs`: contrasto WCAG di tutte le coppie testo/sfondo, tema chiaro e scuro, letto dai token reali.
- `node tools/audit-targets.mjs <url>`: controllo nel browser che segnala ogni elemento interattivo sotto 48 px (richiede Playwright).

## 11. Cosa non so ancora

- Le pagine di Material 3 (navigazione, colore, forme) non le ho lette sul testo ufficiale. Per confermarle serve una copia offline della documentazione.
- Il comportamento su iPhone e Android reali non è stato provato.
