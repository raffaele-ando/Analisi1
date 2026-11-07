# Basi pedagogiche dell'app

Ogni tecnica usata nell'app è collegata alla ricerca che la sostiene e alla funzione che la implementa.
Dove la ricerca è più debole o il contesto è diverso (es. studio di matematica all'università)
lo scrivo esplicitamente.

## 1. Recupero attivo prima della rilettura (testing effect)

**Idea.** Ricordare attivamente un contenuto fissa la memoria più che rileggerlo.
**Evidenza.** Roediger & Karpicke (2006), *Psychological Science* 17(3): chi fa test a ricordo dopo la lettura
ricorda più a una settimana rispetto a chi rilegge più volte. Karpicke & Roediger (2008), *Science* 319(5865),
mostra che il recupero è più importante dello studio ripetuto per l'apprendimento a lungo termine.
**Nell'app.** Teoria in forma di scheda: prima ricordi, poi giri la scheda. Ogni lezione finisce con esercizi,
non con altra teoria. Nessuna lezione è solo lettura.

## 2. Ripetizione dilazionata (spacing) e ripasso adattivo

**Idea.** Ripassare a intervalli crescenti, appena prima di dimenticare, è più efficace che concentrare lo studio.
**Evidenza.** Ebbinghaus (1885) è il primo riferimento sulla curva dell'oblio. Cepeda et al. (2006),
*Psychological Bulletin* 132(3), fa una sintesi quantitativa di centinaia di esperimenti: la distribuzione
nel tempo migliora la ritenzione. Il modello FSRS (Ye et al., KDD 2022; implementazione open source
*fsrs4anki*) stima la stabilità della memoria e programma il ripasso per una probabilità di ricordo target (90%).
**Nell'app.** Modulo `app/engine/srs.js`. Ogni esercizio e ogni scheda ha stabilità e difficoltà; il voto
(sbagliato, a fatica, bene, facile) sposta la prossima data. Il valore di partenza dei parametri è quello di
default di FSRS-4.5: **non sono stati ristimati sui dati degli studenti**, quindi l'intervallo è un'approssimazione.

## 3. Interfogliatura (interleaving)

**Idea.** Alternare problemi di tipo diverso costringe a riconoscere *quale* metodo usare, abilità che negli
esami conta quanto l'esecuzione.
**Evidenza.** Rohrer & Taylor (2007), *Instructional Science* 35: gli studenti che fanno esercizi di
matematica mescolati hanno risultati migliori in verifica differita, pur sentendosi meno sicuri durante lo
studio. Rohrer (2012), *Educational Psychology Review* 24(3), conferma il vantaggio per distinguere concetti simili.
**Nell'app.** `interleave()` in `app/engine/session.js`: il ripasso alterna le skill (round-robin) invece di
blocchi dello stesso argomento. La pratica di una singola skill è volutamente un blocco solo quando è
una lezione appena iniziata.

## 4. Esempi svolti con dissolvenza (worked examples and fading)

**Idea.** Ai principianti conviene studiare esempi completi; poi si chiede di completare passi mancanti;
infine si risolve da soli. Risolvere molti problemi "a freddo" sovraccarica la memoria di lavoro.
**Evidenza.** Sweller & Cooper (1985), *Cognition and Instruction* 2(1); Sweller (1988), *Cognitive Science* 12(2),
sull'effetto degli esempi svolti. Renkl & Atkinson (2003), *Educational Psychologist* 38(1), descrive la
transizione graduale esempio → problema.
**Nell'app.** Tipo di card `example` con passi `ask` (passo a completamento) prima degli esercizi autonomi.
Ogni lezione segue la sequenza intuizione → definizione → esempio → esempio a completamento → esercizi.

## 5. Spiegazione ed autospiegazione

**Idea.** Chi si spiega i passaggi (“perché questo teorema si può usare qui?”) capisce meglio.
**Evidenza.** Chi, Bassok, Lewis, Reimann & Glaser (1989), *Cognitive Science* 13(2): gli studenti che
generano autospiegazioni mentre studiano gli esempi risolvono meglio problemi nuovi.
**Nell'app.** Ogni esercizio ha un `explain` che giustifica il passaggio, non solo il risultato. Le domande di
teoria sono risposte aperte con rubrica: lo studente deve scrivere la dimostrazione e confrontarla con
i criteri, che è autospiegazione strutturata. Il tutor (quando disponibile) spiega l'errore in un altro modo.

## 6. Feedback elaborato

**Idea.** Un feedback che dice *perché* la risposta è sbagliata e che cosa fare dopo aiuta più di “sbagliato”.
**Evidenza.** Shute (2008), *Review of Educational Research* 78(1), rassegna sul feedback formativo:
il feedback è efficace quando è specifico, orientato al compito e collegato all'errore.
**Nell'app.** Le mcq hanno distrattori che rappresentano errori tipici (segno, regola sbagliata, dominio
dimenticato), e l'`explain` spiega perché ciascun errore è sbagliato. Il messaggio dice cosa è mancato.

## 7. Difficoltà desiderabili

**Idea.** Alcune difficoltà (variare gli esempi, ritardare il feedback, ricordare senza aiuti) rallentano
l'apprendimento immediato ma lo migliorano nel tempo.
**Evidenza.** Bjork & Bjork (2011), in *Psychology and the Real World*.
**Nell'app.** Niente suggerimenti automatici: il suggerimento è un pulsante e il voto ne tiene conto
(una risposta con suggerimento vale “a fatica”). Gli esercizi di livello esame hanno numeri e forme
diversi a ogni generazione, così la pratica non diventa memoria delle risposte.

## 8. Padronanza (mastery) e stima della conoscenza

**Idea.** Avanzare solo quando si padroneggia la parte precedente (Bloom, 1968, *Evaluation Comment* 1(2)).
La probabilità di conoscere una skill si aggiorna a ogni risposta.
**Evidenza.** Corbett & Anderson (1995), *User Modeling and User-Adapted Interaction* 4(4): knowledge
tracing bayesiano.
**Nell'app.** `app/engine/mastery.js` aggiorna la padronanza per ogni skill. Il percorso sblocca la skill
successiva solo con la precedente completata o con un test superato (`testOutQueue`). I parametri
(probabilità di apprendere, di sbagliare per distrazione, di indovinare per tipo di esercizio) sono scelti
per default e non sono stati calibrati su dati reali.

## 9. Gamification: usata con moderazione

**Idea.** XP, serie di giorni e corone aumentano il ritorno all'app, ma non sempre l'apprendimento.
**Evidenza.** Hanus & Fox (2015), *Computers & Education* 80: in un corso universitario di un semestre,
gli elementi di gamification hanno ridotto motivazione e risultati nel tempo rispetto alla versione normale.
Questo risultato è il motivo per cui l'app non fa dipendere il voto dagli XP e non penalizza chi salta un giorno.
**Nell'app.** Gli XP misurano la pratica, non il sapere. La stima del voto usa padronanza, memoria e simulazioni,
non gli XP. Niente classifiche.

## 10. Modelli mentali ed elementi visivi

**Idea.** Un grafico accompagnato dalla formula aiuta a capire le proprietà di una funzione (codifica duale).
**Evidenza.** Paivio (1971), codifica duale; Mayer (2009), *Multimedia Learning*, 2ª ed., principio di contiguità
spaziale e temporale.
**Nell'app.** Grafici SVG generati dalla stessa formula che lo studente studia. Le didascalie sono vicine ai punti.

## 11. Strategie di risoluzione dei problemi

**Idea.** Chiedersi che cosa si conosce, che cosa si cerca, quale teorema collega le due cose (Pólya, 1945,
*How to Solve It*). Gli studi di funzione e le verifiche hanno una checklist esplicita.
**Nell'app.** Flashcard di tipo `metodo` e esercizi `order` (riordinare i passi di una dimostrazione con
distrattori) per allenare la sequenza, non solo il risultato.

## Limiti dichiarati

- L'app non è stata testata su studenti reali: l'efficacia è quella attesa dalla letteratura, non misurata qui.
- La stima del voto è una stima interna basata sulle risposte, non una previsione validata.
- Il contenuto è costruito sui temi d'esame dal 2021 al 2026 e sul programma del corso; l'esame reale
  può proporre domande nuove. Il docente può chiedere un orale.
- Le soluzioni ufficiali di alcuni temi contengono errori: sono segnalati con `>!` nel contenuto.
