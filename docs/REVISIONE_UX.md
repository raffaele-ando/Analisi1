# Revisione UX/UI: piano di interventi

Generato dal workflow di verifica (`verify-batch`) sulle segnalazioni dei due audit. Le segnalazioni sono state controllate sul codice del commit corrente, ma con un criterio indulgente: il numero di confermate è una stima, non una certezza. Ogni voce indica i file da toccare; la correzione va verificata nel browser.

Totale segnalazioni verificate in questo giro: 557; confermate: 519.

## Interventi

### 1. Dati e sincronizzazione: nessuna perdita di progressi o prove

**Impatto:** Lo studente può perdere progressi o prove senza accorgersene: ripristini e importazioni sovrascrivono tutti i dispositivi senza conferma, e le prove generate possono far superare il limite di documento del cloud.

**File:** app/sync/cloud.js, app/engine/state.js, app/store.js, app/main.js, app/ui/app.js

**Cambiamento:** Separare le prove generate dal documento core (un documento per prova) con controllo di dimensione prima della scrittura; applicare il ripristino remoto solo dopo un'istantanea locale; mostrare anteprima e conferma per importa, ripristina e azzera che dica l'effetto su tutti i dispositivi (incluso nome, obiettivo, data, suoni); trattare quota_exceeded, invalid_argument e resource_exhausted come errori con messaggio e pulsante Riprova; controllare il valore di ritorno di saveLocal e mettere da parte il JSON corrotto prima di sovrascriverlo; usare timestamp del server o vettori di versione per le fusioni; mostrare lo stato di salvataggio fuori dal Profilo e una cronologia con motivo, origine e conteggi.

**Segnalazioni:**

- Documento core oltre il limite del cloud: le prove generate (circa 13,8 KB ciascuna, con tutto lo stato nelle istantanee) portano il documento oltre 256 KiB; scritture non transazionali; riprove che non distinguono gli errori permanenti (U540 blocker, U532, U554, U382, U384, U545, U547, U548, U556)
- Ripristino o importazione con epoch più alto sostituiscono lo stato locale senza istantanea; due ripristini con stesso epoch si fondono invece di sostituirsi (U371, U541, U546)
- Importa da testo sostituisce i progressi di tutti i dispositivi senza conferma né anteprima; la validazione controlla solo items, skills e xp; l'errore di validazione resta solo come toast che sparisce (U24, U139, U375, U437, U553, U119, U130, U387)
- Azzera e ripristino: la conferma non dice che si perdono nome, obiettivo, data e suoni né che si torna all'onboarding; Azzera non ha stato di attesa e No resta attivo durante il ripristino (U131, U142, U147, U152, U376, U552, S123, S187)
- Copia di sicurezza pre-ripristino che può fallire senza avviso; la conferma del ripristino non spiega il riporto su tutti i dispositivi; cronologia che mostra solo data e dispositivo, con motivo, duplicati locale/cloud, elenco troncato e lettura cloud fallita senza messaggio (U377, U378, S230, U372, U401, U479, S125, U304, U386, S124, S166, S270, S278, U198, U389, U524, U373, U525, U383)
- Fusione: vince il record con t più alto e perde risposte o stima p dell'altro dispositivo; il confronto usa l'orologio del dispositivo (U544, U551, U555)
- Modalità locale permanente: errori trattati come transitori o terminali senza ritorno al cloud; avvio fallito senza nuovo tentativo; stato di sincronizzazione visibile solo nel Profilo (U379, U550, U160, U323, U398, U430, U468, U380, U549, S299)
- Salvataggi silenziosi: saveLocal ignora il valore false, quota piena o modalità privata senza avviso; un JSON locale corrotto riparte da zero e alla prima scrittura sovrascrive il dato (U469, U314)

### 2. Esame: tempo, consegna e risposte salvate

**Impatto:** Durante una prova di due ore lo studente può perdere risposte (salvataggio con 1,2 s di ritardo, nessun salvataggio alla chiusura), consegnare senza sapere quali domande sono vuote, o trovarsi con un timer scaduto che non fa nulla.

**File:** app/ui/exams.js, app/main.js, app/sync/cloud.js, app/app.css

**Cambiamento:** Salvare la bozza senza debounce (o con flush su pagehide e visibilitychange) e tenerla nel tentativo; alla scadenza consegnare automaticamente o passare a sola lettura con messaggio; mostrare il conteggio risposte per parte e nell'intestazione; la conferma di consegna elenca le domande vuote e le parti incomplete; rendere bloccate anche le risposte aperte dopo la consegna; aggiungere una pagina di presentazione con struttura, durata e regole prima di Inizia; aggiungere la revisione per domanda dopo il voto; eliminare o chiudere i tentativi scaduti; ridisegnare il cronometro solo ogni secondo nel suo elemento.

**Segnalazioni:**

- Risposte perse alla chiusura o al cambio app: il salvataggio attende 1,2 s e non viene svuotato su pagehide o visibilitychange; l'ultima risposta non entra nello store (U362, U381, U397, U439, U458, U516, U543, U253, S253)
- Tempo: a zero compare 'Tempo scaduto' ma nessuna consegna automatica e le risposte restano modificabili; il cronometro corre con l'app chiusa; il chip non ha etichetta e cambia colore senza testo (U114, U138, U355, U385, U396, U477, U497, U223)
- Consegna senza riepilogo: nessun conteggio di risposte vuote nell'intestazione, nel selettore di parte o nella conferma; Calcola il voto è senza conferma e irreversibile (U82, U176, U194, U215, U357, U358, U471, S106, S220, S313, U148)
- Dopo la consegna le risposte aperte restano modificabili; il voto si attiva solo dopo aver valutato ogni domanda di teoria (U352, S221, U183, S265)
- Tentativi che restano In corso per sempre o confondono consegnate e da svolgere: sempre Riprendi, titolo identico per i temi generati, nessuna eliminazione (U162, U363, U395, U531, S189)
- Dopo il voto non si rivedono risposte, punteggi per domanda o soluzioni: ExamResult mostra solo tessere e skill (U81, U353, U472)
- Prova senza briefing: Inizia avvia il cronometro senza struttura né regole; la prova si ridisegna ogni secondo anche in correzione (U356, U369)

### 3. Invio e Verifica: risposte contate due volte e Verifica bloccata

**Impatto:** Premere Invio su un campo può registrare la stessa risposta due volte (XP, ripasso e statistiche gonfiati), e Verifica resta grigio senza dire cosa manca.

**File:** app/ui/player.js, app/ui/widgets.js, app/ui/exams.js, app/engine/check.js, app/content/s00-fondamenta.js

**Cambiamento:** Gestire Invio in un solo punto: il campo chiama onEnter e il listener globale ignora INPUT, TEXTAREA, SELECT e checkbox, con una guardia su result già impostato; rendere Verifica con testo di stato (Scegli una risposta, Completa i campi); allineare placeholder, tastiera e messaggi (log, inf, infinito); accettare ':' come divisione e la virgola nei set; anteprima anche per intervalli e tuple; azzerare lo stato dei widget con key per esercizio; riordino con slot numerati; Confronta non abilita Verifica senza criteri; aggiungere Indietro o un'azione di correzione della scheda precedente.

**Segnalazioni:**

- Invio su campo numerico, tupla, select o checkbox esegue check() due volte: onEnter del campo e listener su window che non esclude INPUT, con closure a result null (U14, U96, U103, U265, U310, U392, U427, U443, U465, U484, U503, S50, S62, S143, S179, S215, S318)
- Verifica disabilitato senza motivo in ogni tipo di esercizio; nell'ultimo passo di un esempio Ho capito è disabilitato senza spiegazione; Confronta abilita Verifica con zero criteri e registra un errore (U5, U122, U264, U295, U317, S145, S168, U101, U404, S229)
- Notazione incoerente: il placeholder dice ln ma la tastiera inserisce log; inf, infinito e -inf non coincidono; ':' per la divisione e la virgola nei set non sono accettati; sintassi non spiegata (U2, U315, U538, S160, S246, S282, S172)
- Campi senza anteprima né tastierino per intervalli e tuple; tuple con tessere senza lettere (U104, S146, U105, S69, S171, S290)
- Tastiera a 13 tasti per campo che fa perdere il focus al campo; anteprima aria-live a ogni tasto (U107, U108, U452)
- Stato residuo tra esercizi: selezione di riordino e risposta del tutor non si azzerano o sovrascrivono il testo digitato (U115, U515)
- Riordino senza slot numerati e scelta multipla identica alla singola; match bloccato che mostra solo il lato sinistro (U280, S73, U276, S74, U209)
- Nessun Indietro nel ciclo della lezione (U199)

### 4. Ripasso: pulsante Ripassa spento quando ci sono solo schede

**Impatto:** Chi ha solo schede di teoria da ripassare vede 'N elementi' ma non può avviare il ripasso: banner e hero contano schede che la sessione Ripassa non carica.

**File:** app/ui/app.js, app/ui/home.js, app/engine/session.js, app/ui/theory.js

**Cambiamento:** Usare una sola funzione di conteggio che include le schede e far partire un'unica sessione con esercizi e schede in coda etichettate; in alternativa il pulsante diventa Ripassa le schede (N) e porta a Teoria; il pulsante non è mai disabilitato se il conteggio è maggiore di zero; l'anello mostra il totale reale e il badge si aggiorna quando una scheda torna in scadenza; la sessione mostra quanti elementi restano.

**Segnalazioni:**

- Hero di Ripasso: somma esercizi e schede ma Ripassa è disabled quando due è zero; con solo schede lo studente non ha alcuna azione (U21, U57, U76, U121, U156, U184, U207, U231, U288, U330, U393, U428, U429, U466, U483, U508, S82, S138, S157, S185, S216, S240, S256, S296, S317)
- Banner e Percorso: conta le schede, ma reviewQueue le esclude e riempie con esercizi non in scadenza, oppure mostra Niente da ripassare (U289, U331, S217, S295, U343)
- Ripassa avvia una sessione di 12 carte senza contatore di quelle rimaste; l'anello è limitato a 30 mentre il backlog può essere più grande (U342, U530)

### 5. Percorso: sblocco coerente e primo passo

**Impatto:** Il Percorso sblocca abilità in ordine sbagliato e dopo il test di ingresso non cambia in modo leggibile, quindi lo studente non sa dove ricominciare.

**File:** app/engine/course.js, app/ui/home.js, app/ui/app.js, app/store.js, app/app.css, app/content/s00-fondamenta.js

**Cambiamento:** Correggere isUnlocked con 'if (maxTested >= 0 && secIdx <= maxTested + 1) return true;' così la sezione 0 segue la sequenza per abilità; far passare il test sul Percorso con stato Superato o Da rifare e con Continua sulla prima abilità non sbloccata; l'onboarding Inizia apre direttamente la prima lezione; Inizia o Continua con un solo verbo per stato; simbolo per abilità dal contenuto (campo sym) e connettori SVG fra i nodi; testo del pulsante test con 12 domande e soglia 80%.

**Segnalazioni:**

- Fondamenta: senza test maxTested vale -1 e la condizione secIdx <= maxTested + 1 diventa 0 <= 0, quindi tutte le 8 abilità della sezione 0 sono sbloccate senza sequenza (S1, S17, U294)
- Test di ingresso superato: Continua resta su Frazioni, la sezione successiva si sblocca ma il Percorso non la mostra come nuovo passo (U311, U173)
- Inizia la prima lezione porta al Percorso e richiede un secondo Continua (U306, S16, U399)
- Verbi e stati non uniformi: Inizia fisso sul nodo corrente anche con lezioni iniziate; Continua apre una lezione non iniziata; il testo di sblocco è inesatto (U172, U440, U327, S26, U326, S10)
- Simbolo a/b uguale per tutti gli 8 nodi di una sezione; nodi senza connettori; anello del nodo corrente che si sovrappone all'alone (U29, U88, U193, U279, U328, U190, S242, S262, S286, U89, S8, S30, S243)
- Contatori: 0/8 dopo la prima lezione e Completato che conta tre unità diverse (U313, U191)
- Ho già studiato la matematica: etichetta senza dire che è un test di 12 domande con soglia 80%; esito solo come toast (U170, S24, U290)
- Corso vuoto: la scheda mostra 'Tutte le lezioni completate' sotto l'eyebrow 'Prossima lezione' (S19)
- Lezioni sbloccate fuori ordine: ogni lezione di una skill sbloccata è attiva (U294)

### 6. Esiti del test, riepilogo e progresso

**Impatto:** Lo studente non sa se ha superato il test o una lezione: l'esito compare solo in un toast di 2,6 s, il riepilogo non dice soglia né prossimo passo, e barra e XP non riflettono quello che ha fatto.

**File:** app/ui/player.js, app/store.js, app/ui/app.js, app/ui/widgets.js, app/ui/ai.js, app/engine/state.js, app/ui/theory.js

**Cambiamento:** Riepilogo di fine test con esito (superato o non superato, soglia 80%, risposte corrette) e azioni Continua o Riprova; contatore n di N con denominatore fisso e riprove contate a parte; bonus mostrato nel riepilogo e nel Profilo; XP di lezione assegnato una sola volta, ripetizione a XP ridotto; streak da attività significativa; tutor con score zero gestito e answerTex per tutti i tipi; messaggi di errore con causa, Riprova e durata adeguata; riepilogo con il prossimo passo reale.

**Segnalazioni:**

- Esito del test (superato o no, soglia 80%) solo come toast dopo il ritorno al Percorso; il riepilogo mostra x/12 e una percentuale senza esito (U80, U157, S223, U312, U476, U290)
- Riepilogo che suggerisce 'ripeti la lezione o fai un ripasso' ma offre solo Continua; con accuratezza bassa non c'è Riprova (U292, S259)
- Bonus XP calcolato e salvato ma mai mostrato; lezione senza esercizi risulta perfetta; ripetere una lezione assegna di nuovo XP e bonus senza limite (U133, U291, U320, U394, S48)
- Riprove contate come risposte: 8 esercizi con un errore recuperato diventano 8/9 e precisione su 9; il riepilogo mostra 11 risposte per 10 esercizi (U298, U474)
- Barra di progresso che arretra quando si sbaglia: 5/10 diventa 5/11, 4 su 5 diventa 4 su 6 (U185, U329, U403, U475, S36, S76, S142, S306)
- Lezione senza contatore di schede e senza passo nell'esempio (U206, S174, S75)
- Stima del voto quasi zero dopo tre lezioni; streak che conta un giorno con 1 XP come giorno di studio (U319, U180)
- Tutor: score 0 sostituito dalla frazione dei criteri; risposta corretta 'undefined' per i tipi senza answerTex; errore silenzioso se manca il punteggio; scelta multipla senza indicazione della risposta giusta (U509, U510, U134, S51)
- Errori con quattro forme diverse, toast generico senza causa e durata fissa; testo 'Non è corretto' contrario al principio di DESIGN.md (U128, U150, S309, S60)

### 7. Esame: contenuti, soglie e punteggi coerenti

**Impatto:** Lo studente legge regole e punteggi che non coincidono con quelli applicati: soglia della teoria, 31 o 32 punti, lode e colori dell'elenco contro l'esito del risultato, e l'ordine dei temi è casuale.

**File:** app/ui/exams.js, app/content/exams-2026.js, app/engine/course.js, docs/ESERCIZI_ESAME.md

**Cambiamento:** Una sola funzione di esito (soglie di parte A e totale) usata da elenco e risultato, con la regola visibile prima di iniziare; scala 31/32 dichiarata oppure tema corretto a 32; titoli e sottotitoli senza ripetizioni; selezione dei temi deterministica e pesata; log degli slot vuoti; allineamento della documentazione al codice.

**Segnalazioni:**

- Soglia di teoria: la documentazione dice 8 per l'appello, il codice usa la metà dei punti (5 su 10); le regole compaiono solo dopo la consegna (U351, S241)
- Chip dell'elenco verde da 18/32 senza considerare la parte A, mentre il risultato dice Non superato (U175, U478, S104)
- Tema 06/07 somma 31 punti riscalati a 32 senza dirlo; la tessera mostra 27/32 mentre il titolo mostra 27; la lode scatta a 31 (U364, U535, U354)
- Titoli ripetuti: Appello con data e Appello con durata; 'Tema generato' identico; numeri nei titoli dei temi generati; testo 'Parte B · esercizi' fisso (U31, U171, U200, U367, S114, S154, S170, S283, S250, S113)
- Ordinamento dei temi con comparatore casuale e pesi EXAM_WEIGHT non applicati; slot vuoto scartato in silenzio (U365, S107, U536)

### 8. Uscite e conferme: box fuori vista, gerarchia e perdita di posizione

**Impatto:** Il box di uscita può comparire sotto la barra con lo scroll già fatto, con gerarchia dei pulsanti opposta tra lezione ed esame; uscire da un test o da una lezione a metà non avvisa e non conserva la posizione.

**File:** app/ui/player.js, app/ui/exams.js, app/ui/app.js, app/app.css, app/ui/theory.js

**Cambiamento:** Un solo componente di conferma (foglio sopra la pagina, focus iniziale sull'azione sicura, Esc, role alertdialog) con la stessa gerarchia: Esci secondario, Continua primario, testo che dice cosa si perde; conferma sempre se ci sono risposte date; posizione della lezione salvata; esporta come download o con pulsante Copia in un'area separata dall'import, con Importa disattivato dopo l'export.

**Segnalazioni:**

- Box di uscita in flusso dopo la barra sticky: se la pagina è scrollata non è visibile e non sposta il focus (U136, U137, U473, S182)
- Esci rosso e primario nella lezione, contorno nell'esame e Continua la prova primario: stesse azioni con gerarchie opposte; quattro modi diversi di chiedere conferma (U20, U59, U92, U112, U145, U285, U495, S46, S231, U144, U153)
- Uscita senza conferma da test di salto e allenamento con risposte date: l'esito va perso (U149, U161, S66, S188, S222)
- Uscire da una lezione a metà azzera la posizione e riparte dalla prima scheda, senza dirlo (U388, U391)
- Esporta e importa condividono la stessa textarea 'Incolla qui un salvataggio' con Importa attivo; il download funziona solo in claude.ai e il catch è vuoto; nessun pulsante Copia; nessun messaggio di esito (U9, U93, U135, U141, U143, U374, U400, U421, U438, U498, S120, S141, S226, S258, S300)

### 9. Accessibilità: ruoli, nomi di campo e focus

**Impatto:** Con lettore di schermo o tastiera molte schermate non si capiscono: campi senza nome, scelte annunciate con ruoli incoerenti, dialoghi che non ricevono il focus e focus perso dopo ogni Verifica.

**File:** app/ui/widgets.js, app/ui/player.js, app/ui/exams.js, app/ui/home.js, app/ui/app.js, app/ui/theory.js, app/app.css, dist/artifact.html

**Cambiamento:** Campi con etichetta visivamente nascosta o aria-label con il prompt, più aria-describedby; scelte singole come radiogroup con role radio o pulsanti toggle con aria-pressed, senza miscele; segmenti come tablist con tabpanel oppure solo pulsanti aria-pressed; un unico componente dialog con focus iniziale, focus trap, Esc e ritorno del focus; live region presenti nel DOM dal caricamento; pulsanti con nome completo (titolo della lezione); gruppi come h2 o h3; lang='it' sulla pagina; focus visibile con outline di 2 px.

**Segnalazioni:**

- Campi di risposta senza etichetta (solo placeholder), textarea e tuple con id duplicati: U7, U17, U68, U79, U97, U98, U158, U210, U229, U252, U361, U405, U444, U487, U507, S108, S233, S308
- Scelta singola: radiogroup con figli button aria-pressed; Vero/Falso senza gruppo né stato; segmenti senza aria-selected; tab senza tabpanel (U6, U18, U28, U67, U69, U83, U99, U102, U163, U164, U205, U233, U250, U251, U316, U435, U453, U454, U488, U499, U519, S94, S151, S252)
- Dialoghi (scheda abilità, conferme, esame) senza focus iniziale, senza Esc, senza ritorno del focus e con Tab che esce nello sfondo (U27, U140, U167, U217, U230, U235, U237, U249, U263, U325, U349, U436, U449, U489, U517, S235)
- Focus perso dopo Verifica, Continua, Mostra la risposta o Confronta, perché l'autofocus agisce solo al primo montaggio (U109, U125, U155, U248, U340, U445, U490, U518)
- Live region create insieme al contenuto: toast, footer di esito e anteprima aria-live a ogni tasto (U124, U256, U452, S52, S144, U456)
- Pulsanti con nome ripetuto e senza contesto (Inizia, Svolgi, Ripristina, Su, Giù, Togli); badge con aria-label su span senza ruolo (U232, U253, U254, U455, U501, U226, U241, U255, U441, U496)
- Barre di progresso senza nome e titoli di gruppo come paragrafi; schermate senza h1 in sessione (U186, U461, S37, U242, U262)
- Tastiera formule: fino a 13 tasti senza nome leggibile prima di Verifica (U462)
- Interruttore Suoni come checkbox da 24 px senza switch (U196, U500)
- Pagina senza lang nell'artefatto (U448); focus del campo con alone 1,2:1 e outline rimosso (U91, U244)

### 10. Layout telefono: target, spazi e pannelli

**Impatto:** Su un telefono da 390 px i controlli di riordino e i campi del profilo sono piccoli, il pannello di feedback copre il contenuto e il toast copre il pulsante Continua.

**File:** app/app.css, app/ui/widgets.js, app/ui/app.js, app/ui/player.js, app/ui/home.js

**Cambiamento:** Pulsanti di riordino da 48 x 48 in riga o colonna con gap 8; rimozione dei min-height inline in favore di var(--touch); .wrap con padding-top; toast posizionato sopra la barra solo se presente, tramite classe sul body; pannello di feedback con max-height e scroll interno e padding del corpo misurato con ResizeObserver; nessun padding laterale in sessione; overscroll-behavior: contain su foglio e overlay; tessere minmax(160px,1fr).

**Segnalazioni:**

- Riordino Su, Giù e Togli a 48 x 36 px impilati con 4 px di spazio, sotto i 48 px dichiarati (U26, U47, U110, U166, U216, U236, U260, U406, U410, U434, U502, S232)
- Profilo: min-height 44 px inline sui campi, checkbox Suoni da 24 px, controllo della rubrica da 22 px (U65, U87, U111, U305, U414, U415)
- Spazio superiore mancante in Ripasso, Profilo e Cronologia: il controllo a 1 px dalla barra (U22, U63, U84, U214, U278, U407, S207)
- Toast fisso a 80 px anche nelle sessioni dove la barra non c'è, sopra il footer (U123, U151, U222, U240, U297)
- Pannello di feedback fisso fino a 38 vh con padding del corpo di 180 px: può coprire il contenuto e Continua (U118, U221, U261, U281, U296, U457, U529)
- Tastierino per formule che esce dallo schermo con 13 tasti per campo e per parte (U106, S116, S247)
- Colonna vuota a sinistra nelle sessioni per il margine di 96 px, e overlay che fa scorrere il documento sotto (U73, U366, U482, U154)
- Tessere in due colonne con la terza sola a 390 px; topbar traslucida con contenuto sotto il titolo; X spostata nella sua area (U188, U277, S43)

### 11. Grafici leggibili e descritti

**Impatto:** I grafici sono illeggibili su telefono, con etichette a circa 7 px, e per il lettore di schermo sono solo 'Grafico'; le due curve si distinguono solo per colore, e una è rossa come l'errore.

**File:** app/ui/plot.js, app/ui/widgets.js, app/content/s03-funzioni.js, app/content/s09-studio.js, app/app.css

**Cambiamento:** Render alla larghezza reale del contenitore, con etichette in px via CSS e controllo di collisione; alone sulle etichette (paint-order stroke); alt generato dai dati (funzione, intervallo, punti notevoli) e desc nell'SVG; colori dall'elenco accent e ink, con tratteggi per la seconda curva; riempimento più visibile; segnaposto di errore esplicito.

**Segnalazioni:**

- Scala circa 0,54-0,64 su 390 px: assi a 11 unità diventano circa 7 px, etichette dei punti a 12-13 unità (U78, U103, U192, U259, U268, U451, U485, U514, U527, S103, S279, S248)
- Etichette sopra la curva o fuori bordo, abbreviazioni 'min rel' e 'min ass' non spiegate, 'angoloso' sul tracciato (U10, U102, U175, U528, S102, S175)
- Nessun testo alternativo: 108 grafici senza alt, aria-label generico 'Grafico' (U247, U450, U486, U505, U526)
- Area sotto la curva quasi invisibile (riempimento a opacità 0,45) (U269)
- Seconda curva in rosso di errore e terza in verde; nessun tratteggio (U286, U491, U513)
- Grafico che scompare senza segnaposto quando il rendering fallisce (U129)

### 12. Matematica: LaTeX nelle opzioni, liste e lettura

**Impatto:** Le formule compaiono in modo sbagliato: opzioni a tendina con comandi LaTeX grezzi, frasi spezzate, elenchi scritti come paragrafi, e per lo screen reader KaTeX non produce MathML.

**File:** app/ui/widgets.js, app/ui/md.js, app/app.css, app/content/s00-fondamenta.js, app/content/s01-reali.js, app/main.js, tools/build.mjs

**Cambiamento:** Opzioni cloze in testo leggibile con conversione dei comandi o KaTeX inline; layout cloze in flusso con font e interlinea uguali al testo; md che riconosce l'elenco anche senza riga vuota; katex con output htmlAndMathml; fallback con messaggio, causa e Ricarica; apostrofo tipografico nel contenuto; tasti in font sans per il testo.

**Segnalazioni:**

- Opzioni dei menu cloze e risposte corrette con comandi LaTeX grezzi (wedge, binom, Rightarrow, forall): U100, U467, U506, S72, U201
- Cloze: menu a tendina a tutta larghezza, classe md a blocco e interlinea 2,2 che spezzano le frasi (U270, S149, S79, S291)
- Liste dopo una riga di testo senza riga vuota diventano un paragrafo con trattini: 42 casi nel contenuto (U511, U534)
- KaTeX con output html: nessun MathML per i lettori di schermo (U228, U504)
- Errore di caricamento di math.js o KaTeX: testo generico senza causa e senza Riprova; formule come LaTeX grezzo (U132, U322, U460, S312)
- Apostrofi dritti invece che tipografici; formula spezzata a capo con '18/24 ='; tasti in monospace diversi dalle formule (U539, S38, U202)

### 13. Teoria e schede: valutazione, limiti e ritorno

**Impatto:** Le schede sono difficili da governare: il formulario è irraggiungibile, il voto è irreversibile e a volte riporta alla schermata sbagliata, il limite di 20 schede è silenzioso e gli intervalli sono illeggibili.

**File:** app/ui/theory.js, app/ui/home.js, app/ui/app.js, app/engine/session.js, app/store.js, app/engine/srs.js, app/app.css

**Cambiamento:** Montare il formulario dalla testata di Teoria (o rimuovere KINDS e il codice morto); uniformare i quattro pulsanti con lo stesso stile e intervalli a 14 px con la data di ritorno; annullo dell'ultima valutazione per 5 secondi; A fatica non conta come errore; limite con Continua (restano N); ritorno alla vista di origine; viste su totale per sezione.

**Segnalazioni:**

- Formulario per sezione (Formulary, KINDS, filtri per tipo) definito ma non montato: nessun punto d'accesso (U1, U30, U49, U213, U246, U307, U337, U418, U521, S193)
- Quattro valutazioni con quattro stili e pesi diversi; A fatica conta come errore nella padronanza; intervalli a 12 px; <10 min scritto anche per valori diversi (U42, U70, U85, U169, U195, U225, U243, U266, U271, U289, U338, U344, U347, S289, S95)
- Voto irreversibile senza annullamento; una scheda sbagliata torna dopo circa 10 minuti senza che il dato sia spiegato; 1 g senza spiegazione (U333, U334, U339, S184)
- Limite di 20 schede senza dirlo: contatore 1/20 e Fatto! con 62 schede disponibili (U8, U332, S85)
- Ritorno dalla teoria sempre a Ripasso, vista locale che si azzera; apertura da Percorso che perde la posizione (U293, U335, U433, U522, S83, S84, S183, S203, S261)
- Scheda di abilità bloccata che apre comunque le sue schede; ripasso di tutte le schede della skill anche non scadute (U336, U480)
- Messaggi di vuoto ambigui e viste calcolate ma non mostrate (S89, S307, U187, U346, S251, S267)

### 14. Colore e significato coerenti

**Impatto:** Rosso e verde significano cose diverse da una schermata all'altra: un elemento da ripassare o un avviso sembra un errore, e un'azione sembra un successo.

**File:** app/app.css, app/ui/app.js, app/ui/theory.js, app/ui/player.js, app/ui/exams.js, app/ui/widgets.js, tools/check-contrast.mjs

**Cambiamento:** Applicare la tabella dei ruoli di DESIGN.md: rosso solo per l'errore, arancio solo per la serie, verde solo per il successo, blu per le azioni; 'da fare' in accent; esito con icona e parola; tracce con --line-strong o simile; coppie aggiunte a tools/check-contrast.mjs.

**Segnalazioni:**

- Rosso per il 'da fare' e per i conteggi (anelli, badge, Ripasso); anello di Ripasso in direzione opposta a quello del Percorso (U41, U58, U86, U152, U159, U211, U273, U341, U181, U239, S98, S152, S204)
- Verde per azioni come Continua e Ho capito, blu per azioni altrove; avviso di regola in rosso come errore; spiegazione del tipo in verde (U212, U274, U299, U494, S65, U300, U324, S34)
- Arancio usato sia per la serie di giorni sia per la precisione intermedia (U60, U275, S49)
- Esito solo per colore in abbinamenti, riordini, parti di esame e problemi (U36, U77, U165, U208, U234, U258, U272, U360, U446, U470, U520, S302)
- Tracce di barre e binari quasi invisibili (1,06-1,27:1); elementi accoppiati con opacità che scende sotto 4,5:1 (U177, U204, U284, U481, U220, U257, S59, S87)
- Errore parziale rosso in un pannello e giallo nell'altro; uscita non distruttiva in rosso (U126, U368)

### 15. Profilo, XP e linguaggio

**Impatto:** Termini come XP, padronanza, corone, voto stimato e Livello esame restano senza spiegazione, e alcune impostazioni non si applicano davvero.

**File:** app/ui/app.js, app/ui/home.js, app/ui/player.js, app/ui/theory.js, app/ui/sound.js, app/main.js, app/engine/state.js, docs/DESIGN.md

**Cambiamento:** Pagina Come funziona dal Profilo con XP, padronanza, corone, voto stimato, regole d'esame e salvataggio; unità XP nel ring e in Percorso; un solo nome per ogni concetto (Esercizio, Scheda di teoria); stati vuoti con motivo e azione; impostazioni applicate all'avvio da store; data d'esame o rimozione della promessa; nome usato nel saluto o rimosso.

**Segnalazioni:**

- Nessuna guida né glossario; XP senza unità nel ring; corone e padronanza senza spiegazione (U0, U179, U189, U238, U267, U302, U318, U197, S4, S277, U303)
- Padronanza in percentuale con due misure diverse: scheda 58% e corone 5/5 con gli stessi dati (U174)
- XP totale mai mostrato; 'Completato' con tre unità diverse (U178, U191)
- Suoni riattivato a ogni caricamento; nome non usato nel saluto; data d'esame assente anche se documentata; Azzera che cancella nome e obiettivo (U459, U512, U113, U537)
- Stati vuoti: 'Tutto in ordine' al primo avvio; cinque forme diverse; motivo non spiegato (U48, U321, S93)
- Parole ambigue: 'N schede' per esercizi e per flashcard; SCELTA MULTIPLA per due varianti; 'Tutor con Claude attivo' senza spiegazione (U408, S165, S159, S135)

### 16. Navigazione e gerarchia visiva

**Impatto:** Le schermate non hanno una gerarchia chiara: troppi pulsanti pieni con lo stesso peso, titoli in stili diversi, Profilo raggiungibile solo da un'icona senza nome.

**File:** app/ui/app.js, app/ui/home.js, app/ui/exams.js, app/ui/theory.js, app/ui/player.js, app/app.css, app/ui/icons.js

**Cambiamento:** Una sola azione primaria per schermata e le altre secondarie; un solo stile di titolo di sezione e una sola riga di lista; titolo della sessione in topbar; Profilo con etichetta visibile e voce attiva; scala di spaziature e raggi in token usata ovunque; un solo set di icone.

**Segnalazioni:**

- Più pulsanti pieni con lo stesso peso: Inizia ripetuto nella scheda abilità e nel Percorso, Svolgi ripetuto, Allenati pieno accanto a Inizia; verbi diversi per la stessa azione (U19, U43, U224, U282, U493, S2, S12, S199, S249, S285)
- Titoli di sezione in stili diversi; h1 doppio in Esami; titolo di pagina piccolo rispetto alle sezioni (U50, U62, U64, U168, U219, U492, S130, U287)
- Profilo solo come icona senza etichetta; nessuna voce attiva su Profilo e Cronologia (U283, U301, U432, U218, U431)
- Titoli assenti durante lezione, teoria e ripasso (U45, S45, S86, S239)
- Riga con freccia che esegue un'azione sul posto; icone piene e a tratto mischiate; icona di ricarica per Ripasso (U66, U95, S28)
- Token di layout non uniformi: spaziature, raggi e bordi (U37, U38, U39, U40, U51, U182, U425)

### 17. Documentazione, strumenti e test allineati

**Impatto:** Chi legge il progetto o usa i controlli ottiene un quadro sbagliato: la documentazione descrive una barra a quattro voci e uno stato di sincronizzazione che non esistono, e gli strumenti non coprono le parti critiche.

**File:** docs/DESIGN.md, tools/check-contrast.mjs, tools/audit-targets.mjs, package.json, tools/test-sync.mjs, tools/screenshots.mjs, app/content/index.js

**Cambiamento:** Aggiornare DESIGN.md a tre voci e allo stato attuale; estendere PAIRS e audit-targets a tutte le schermate; aggiungere test di init e della scelta cloud o locale; registrare solo i file esistenti; collegare validate e check-contrast a package.json; fotografare le conferme di uscita.

**Segnalazioni:**

- DESIGN.md dice quattro voci, cinque destinazioni e serie e stato nella topbar (U245, U308, U422, U442)
- Controlli incompleti: check-contrast non copre ink-2 su surface-2, ink su highlight, accent-soft e --line; audit-targets guarda una sola schermata; package.json non esegue i controlli; nessun controllo sul numero di voci (U416, U411, U412, U413, U425)
- Test di sincronizzazione che bypassano init e la scelta cloud o locale; screenshot che scrivono in dist e non fotografano le uscite (U420, U423, U424, U409)
- Due richieste 404 a ogni caricamento per exams-2025.js ed exams-old.js registrati (U419)

## Non ora, o già risolto

- Legenda: U = id in unverified.json; S = indice (da 0) in sweep-findings.json. Totale confermate 685, di cui 5 escluse (S27, S61, S99, S214, S294) e 680 inserite negli interventi con deduplica per cluster.
- Già risolte nel codice attuale, non inserite: S61 (il ritentativo che cancellava il feedback, corretto in 3fef186) e S99, S214, S294 (ripresa di una prova reale che andava in errore, corretta in 307bb83). S27 non è confermata: il nav non è annidato (c'è un solo nav con un div interno); resta solo l'aria-label sul badge, già in Accessibilità.
- Non ora: la correzione della fusione di sincronizzazione (U555 orologio del dispositivo, U546 stesso epoch, U545 assenza di transazioni) richiede un cambio di schema con migrazione e test su più dispositivi. Prima fare i punti 1 e 8 (perdita dati e conferme), poi valutare lo schema.
- Non ora: connettori SVG tra i nodi del Percorso (U89, S8, S30, S243) sono una scelta di design che richiede una pagina di percorso ridisegnata; rinviare dopo il punto 5.
- Non ora: normalizzazione delle risposte (virgola nei set, apostrofi) modificata senza una suite di casi rischia di rifiutare risposte corrette; prima costruire i casi di test, poi cambiare check.js (parte del punto 3).
- Rinviare: rifinitura minore (S43 posizione della X, U190 sovrapposizione sub-pixel dell'arco, U425 bordo decorativo, U287 scala tipografica, S130 titolo compatto): non bloccano lo studente e vanno fatte dopo i blocchi.
- Rinviare: fallback offline per math.js e KaTeX (U132, U322, U460, S312) richiede gestione della cache o del CDN; per ora il messaggio va solo reso più chiaro nel punto 12.
