# Brief per gli autori dei contenuti

Stai scrivendo i contenuti di un'app in stile Duolingo (in italiano) che porta uno studente **da zero**
a prendere **30 e lode** all'esame di *Analisi Matematica 1 e Geometria* (Ing. Gestionale, Politecnico
di Milano, prof. Paolo Dulio). Repository: /home/user/Analisi1 (branch già attivo, non cambiarlo).

LEGGI PRIMA, per intero:
- docs/CONTENT_SCHEMA.md   formato esatto dei file, tipi di esercizio, generatori, regole
- docs/CURRICULUM.md       id FISSI di sezioni e skill: usa esattamente questi id
- docs/ESERCIZI_ESAME.md   tutte le domande dei temi d'esame recenti con i risultati verificati: è il livello da raggiungere
- app/engine/tex.js, app/engine/rng.js   helper disponibili nei generatori
- app/engine/check.js      come vengono corrette le risposte (cosa lo studente può digitare)

## Cosa produrre
Solo i file indicati nel tuo incarico, in app/content/. Non modificare altri file del repo.
Ogni file deve passare: `node tools/validate.mjs app/content/<file>.js` con 0 errori e pochi avvisi.

## SALVATAGGIO OBBLIGATORIO (il container può essere azzerato in qualsiasi momento)
Scrivi il file **una skill alla volta**. Dopo ogni skill che passa il validatore, fai commit e push
SOLO del tuo file, con retry (altri autori lavorano in parallelo sullo stesso repo):

```bash
cd /home/user/Analisi1 && F=app/content/<file>.js && for i in 1 2 3 4 5 6; do git add "$F" && git commit -q -m "Contenuti: <skill>" -- "$F"; git push -q origin HEAD && break; sleep $((RANDOM % 6 + 2)); done; git log --oneline -1 -- "$F"
```
Se il push fallisce dopo 6 tentativi va bene lo stesso: il commit locale resta. Il primo commit va fatto appena la prima skill è valida.

## Quantità e qualità, per ogni skill
- 2–4 lezioni (`lessons`) di 8–14 card, almeno il 60% esercizi. La prima lezione parte dall'intuizione
  (chi legge non ha mai visto l'argomento); l'ultima arriva al livello d'esame (`level: 3`, `source`
  con il tema d'origine, es. 'Appello 10/02/2026 · Es. 3').
- Esempi svolti con dissolvenza: `example` completo → `example` con passi `ask` → esercizi autonomi.
- Varia i tipi: mcq con distrattori basati su errori tipici, num, expr, interval, tuple, set, order
  (dimostrazioni tipo Parsons con 1–2 distrattori), cloze (enunciati), match, tf, open (teoria stile
  Parte A con rubrica di 3–5 criteri), problem (esercizi d'esame a più parti).
- `practice`: almeno 10 elementi per skill, di cui ALMENO 3 generatori (`type: 'gen'`) per le abilità
  procedurali, con parametri scelti per avere numeri "da compito". Per skill teoriche: open/cloze/order/tf.
- `flashcards`: tutte le definizioni, gli enunciati, le formule e i metodi; per ogni dimostrazione
  richiesta dal programma (in grassetto nella mappa) anche `dim` + un `order` + un `open`.
- Ogni `explain` spiega il ragionamento e, per i distrattori, perché sono sbagliati. Tono chiaro e
  diretto, frasi brevi, italiano corretto, notazione del corso.
- `plot` dove un grafico aiuta (limiti, asintoti, continuità, derivate, aree, grafici elementari).
- CORRETTEZZA MATEMATICA ASSOLUTA: verifica ogni risultato (node + mathjs sono installati). Un errore nei
  contenuti è il bug peggiore possibile. Se trovi un errore in docs/ESERCIZI_ESAME.md dillo nel riepilogo.
- Stringhe con LaTeX: sempre String.raw`...`. Nei generatori LaTeX pulito (niente "+ -3", "1x", "x^{1}", "0x").
- Sii efficiente: scrivi contenuti densi e corretti senza rileggere più volte gli stessi file.

Alla fine rispondi con un riepilogo breve: file, statistiche del validatore, esercizi d'esame coperti.
