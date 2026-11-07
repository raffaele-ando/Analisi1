// Stato dell'app e azioni che lo modificano. Ogni modifica passa da update(),
// che salva subito in locale e programma il salvataggio nel cloud.
import { emptyState, loadLocal, saveLocal, addXp, getItem, setItem, touchSkill, getSkill, clone, migrate } from './engine/state.js';
import { review, autoGrade } from './engine/srs.js';
import { updateMastery, initialMastery } from './engine/mastery.js';

export const XP = { correct: 10, wrong: 2, lessonDone: 15, perfect: 10, flash: 3, examDone: 60 };

class Store {
  constructor() {
    this.st = loadLocal() || emptyState();
    this.course = null;
    this.sync = null;
    this.listeners = new Set();
    this.syncStatus = { kind: 'busy', text: 'Avvio…' };
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    for (const fn of this.listeners) fn();
  }

  update(fn) {
    fn(this.st);
    this.st.meta = { ...this.st.meta, updatedAt: Date.now() };
    saveLocal(this.st);
    this.sync?.schedule();
    this.emit();
  }

  /** Stato arrivato da un altro dispositivo o da un ripristino */
  apply(next, mode) {
    this.st = migrate(clone(next));
    saveLocal(this.st);
    this.emit();
    if (mode === 'replace') this.toast?.('Progressi aggiornati da un altro dispositivo');
  }

  setSyncStatus(s) {
    this.syncStatus = s;
    this.emit();
  }

  // ---------- azioni didattiche ----------

  /** Registra una risposta: FSRS sull'item, BKT sulla skill, XP. Ritorna gli XP guadagnati. */
  answer({ ex, skillId, ok, score, ms, hinted, retry = false, srs = true }) {
    let gained = 0;
    this.update((st) => {
      if (srs && ex.id && !retry) {
        const g = autoGrade({ ok, score, ms, hinted, expectedMs: ex.type === 'open' || ex.type === 'problem' ? 120000 : 30000 });
        setItem(st, ex.id, review(getItem(st, ex.id), g));
      }
      if (skillId) {
        const cur = getSkill(st, skillId);
        const p = updateMastery(cur?.p ?? initialMastery(), ok, ex.type, ex.level || 2);
        touchSkill(st, skillId, { p });
      }
      gained = ok ? (retry ? 5 : XP.correct) : XP.wrong;
      addXp(st, gained);
    });
    return gained;
  }

  flash(card, skillId, grade) {
    this.update((st) => {
      setItem(st, card.id, review(getItem(st, card.id), grade));
      if (skillId) {
        const cur = getSkill(st, skillId);
        touchSkill(st, skillId, { p: updateMastery(cur?.p ?? initialMastery(), grade >= 3, 'flash', 2) });
      }
      addXp(st, XP.flash);
    });
  }

  completeLesson(skillId, lessonId, { perfect }) {
    let bonus = XP.lessonDone + (perfect ? XP.perfect : 0);
    this.update((st) => {
      const cur = getSkill(st, skillId) || { p: initialMastery(), done: [] };
      const done = [...new Set([...(cur.done || []), lessonId])];
      touchSkill(st, skillId, { done });
      addXp(st, bonus);
    });
    return bonus;
  }

  passTestOut(sectionId) {
    this.update((st) => {
      st.tested = { ...st.tested, [sectionId]: Date.now() };
      addXp(st, 40);
    });
  }

  saveExam(attempt) {
    this.update((st) => {
      st.exams = { ...st.exams, [attempt.id]: attempt };
      if (attempt.done) addXp(st, XP.examDone);
    });
  }

  setProfile(patch) {
    this.update((st) => {
      st.profile = { ...st.profile, ...patch, t: Date.now() };
    });
  }

  setSettings(patch) {
    this.update((st) => {
      st.settings = { ...st.settings, ...patch, t: Date.now() };
    });
  }
}

export const store = new Store();
