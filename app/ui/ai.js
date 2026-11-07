// Tutor opzionale: chiede a Claude (capability "sample" dell'Artifact) di correggere le risposte
// aperte con la rubrica o di spiegare un errore in un altro modo. Se non disponibile, si nasconde.
import { answerTex } from '../engine/check.js';

export const ai = {
  available: false,
  sample: null,
  async init() {
    try {
      const c = globalThis.window && window.claude;
      if (!c || typeof c.use !== 'function') return;
      const s = await c.use('sample');
      if (s) {
        this.sample = s;
        this.available = true;
      }
    } catch (e) {
      this.available = false;
    }
  },

  async ask(prompt, json = false) {
    if (!this.sample) throw new Error('Tutor non disponibile.');
    try {
      if (json) return await this.sample.json(prompt, { modelTier: 'default' });
      const r = await this.sample(prompt, { modelTier: 'default' });
      return r.text;
    } catch (e) {
      if (e?.code === 'not_granted') {
        this.available = false;
        throw new Error('Permesso negato: il tutor resta disattivato per questa visita.');
      }
      if (e?.code === 'rate_limited') throw new Error('Troppe richieste ravvicinate: riprova tra poco.');
      throw new Error(e?.message || 'Il tutor non ha risposto.');
    }
  },

  /** Correzione di una risposta aperta di teoria con la rubrica. */
  async grade(ex, text) {
    const prompt = `Sei il docente di Analisi Matematica 1 e Geometria (Ingegneria Gestionale, Politecnico di Milano). Correggi la risposta di uno studente a una domanda di teoria della Parte A dell'esame, con il rigore dell'esame.

DOMANDA:
${ex.prompt}

RISPOSTA MODELLO:
${ex.answer}

CRITERI DELLA RUBRICA (numerati da 0):
${ex.rubric.map((r, i) => `${i}. ${r}`).join('\n')}

RISPOSTA DELLO STUDENTE:
${text}

Rispondi SOLO con un oggetto JSON: {"criteria": [true/false per ogni criterio, nell'ordine], "score": numero tra 0 e 1 (frazione dei criteri soddisfatti, togli qualcosa per errori matematici gravi), "feedback": "2-5 frasi in italiano: cosa manca o è sbagliato e come scriverlo correttamente. Usa $...$ per le formule."}`;
    const r = await this.ask(prompt, true);
    if (!r || !Array.isArray(r.criteria)) throw new Error('Risposta del tutor non valida.');
    r.criteria = ex.rubric.map((_, i) => !!r.criteria[i]);
    r.score = Math.max(0, Math.min(1, Number(r.score) || r.criteria.filter(Boolean).length / ex.rubric.length));
    return r;
  },

  /** Spiegazione alternativa di un esercizio sbagliato. */
  async explain(ex, value) {
    const given = value == null ? '(nessuna)' : typeof value === 'object' ? JSON.stringify(value) : String(value);
    const prompt = `Sei un tutor paziente di Analisi Matematica 1 (Politecnico di Milano). Uno studente ha sbagliato questo esercizio.

ESERCIZIO: ${ex.prompt || ex.text || ''}
${ex.options ? 'OPZIONI: ' + ex.options.map((o, i) => `[${i}] ${o}`).join(' | ') : ''}
RISPOSTA CORRETTA: ${answerTex(ex) || JSON.stringify(ex.answer)}
SPIEGAZIONE GIÀ MOSTRATA: ${ex.explain || '(nessuna)'}
RISPOSTA DELLO STUDENTE: ${given}

Spiega in modo diverso dalla spiegazione già mostrata, in italiano, in massimo 8 frasi: individua l'errore probabile dello studente, poi mostra il ragionamento corretto passo per passo con un'analogia o un caso più semplice. Usa $...$ per le formule (LaTeX). Niente premesse.`;
    return this.ask(prompt, false);
  },
};
