# Analisi 1 · Percorso

App in stile Duolingo per preparare da zero l'esame di **Analisi Matematica 1 e Geometria**
(Ingegneria Gestionale, Politecnico di Milano) fino al 30 e lode, costruita sui temi d'esame reali.

## Cosa contiene

- **Percorso** a tappe per 15 sezioni (dalle fondamenta a serie di Taylor e geometria analitica), con lezioni,
  allenamento per abilità, sblocchi e test per saltare le parti già note.
- **Ripasso** adattivo (FSRS) di esercizi e schede di teoria, nel momento in cui stanno per essere dimenticati.
- **Teoria** per la Parte A: definizioni, enunciati e dimostrazioni, con risposte aperte e rubrica.
- **Simulazioni d'esame** cronometrate: temi reali e temi generati con la stessa struttura; correzione automatica
  della Parte B, autovalutazione della Parte A (o correzione con Claude), stima del voto.
- **Salvataggio** automatico nel cloud (sincronizzato tra dispositivi) con cronologia di istantanee
  ripristinabili, esportazione e importazione.

## Struttura

```
app/
  main.js            avvio
  store.js           stato e azioni (ogni modifica passa da qui)
  content/           contenuti: sezioni sNN-*.js, temi d'esame exams-*.js
  engine/            motore: correzione (check.js), FSRS (srs.js), BKT (mastery.js),
                     sessioni (session.js), corso e sblocchi (course.js), stato e fusione (state.js)
  sync/cloud.js      salvataggio cloud e istantanee
  ui/                schermate, widget degli esercizi, grafici, tutor
docs/
  AUTHORING_BRIEF.md  come scrivere i contenuti
  CONTENT_SCHEMA.md   formato dei contenuti (tipi di esercizio, generatori, flashcard)
  CURRICULUM.md       mappa delle sezioni e delle skill (id fissi)
  ESERCIZI_ESAME.md   domande dei temi d'esame con risultati verificati
  PEDAGOGIA.md        basi scientifiche di ogni tecnica usata
  DESIGN.md           principi di design, regole e ragioni delle scelte
tools/
  validate.mjs        valida tutti i contenuti (schema, LaTeX, risposte corrette)
  build.mjs           genera dist/ (pagina per l'Artifact e copia locale)
  check-imports.mjs   verifica gli import dei moduli
  check-contrast.mjs  verifica il contrasto WCAG dei token colore
  check-contrast.mjs  verifica il contrasto WCAG dei colori
  test-sync.mjs       test della sincronizzazione con database in memoria
```

## Comandi

```bash
npm install                      # katex e mathjs, per validare i contenuti
node tools/validate.mjs          # valida tutti i contenuti
node tools/check-imports.mjs     # verifica gli import
node tools/check-contrast.mjs    # verifica il contrasto WCAG dei colori (chiaro e scuro)
node tools/test-sync.mjs         # test della sincronizzazione
node tools/build.mjs             # genera dist/
cd dist && python3 -m http.server 8000   # poi apri http://localhost:8000/index.html
```

L'app funziona anche senza account: senza cloud i progressi restano sul dispositivo, con istantanee locali.

## Pubblicazione

`dist/artifact.html` è la pagina da pubblicare come Artifact; `dist/files.json` elenca i moduli
da pubblicare accanto alla pagina. Richiede le capability `db`, `user` (cloud) e `sample` (tutor).

## Fonti

Vedi `docs/PEDAGOGIA.md` (letteratura) e le note sui temi d'esame in `docs/ESERCIZI_ESAME.md`.
