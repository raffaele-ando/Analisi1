// Teoria per la Parte A: schede a ripetizione dilazionata (recupero attivo + autovalutazione)
// e formulario consultabile per sezione.
import { html, useState, useMemo } from '../vendor/preact-htm.js';
import { store } from '../store.js';
import { Md } from './widgets.js';
import { I } from './icons.js';
import { flashQueue } from '../engine/session.js';
import { flashDueCount } from '../engine/course.js';
import { getItem } from '../engine/state.js';
import { review, GRADE, intervalFor } from '../engine/srs.js';

const KINDS = [
  [null, 'Tutto'],
  [['def'], 'Definizioni'],
  [['thm'], 'Teoremi'],
  [['dim'], 'Dimostrazioni'],
  [['formula'], 'Formule'],
  [['metodo', 'errore'], 'Metodi ed errori'],
];
const KIND_LABEL = { def: 'Definizione', thm: 'Teorema', dim: 'Dimostrazione', formula: 'Formula', metodo: 'Metodo', errore: 'Errore tipico' };

function fmtInterval(days) {
  if (days < 1 / 24) return '<10 min';
  if (days < 1) return `${Math.round(days * 24)} h`;
  if (days < 30) return `${Math.round(days)} g`;
  return `${Math.round(days / 30)} mesi`;
}

/** Teoria: un elenco di sezioni. Tocchi una sezione e ripassi le sue schede. */
export function TheoryList({ go }) {
  const { course, st } = store;
  const rows = course.sections.map((sec) => {
    const cards = sec.skills.flatMap((sk) => (sk.flashcards || []).map((f) => f.id));
    const seen = cards.filter((id) => getItem(st, id)).length;
    const due = cards.filter((id) => (getItem(st, id)?.due || Infinity) <= Date.now()).length;
    return { sec, n: cards.length, seen, due };
  }).filter((r) => r.n > 0);
  return html`<div class="stack-sm">
    ${rows.map((r) => html`<button class="section-row" onClick=${() => go({ name: 'flash', sectionId: r.sec.id })}>
      <span class="grow" style="flex:1;min-width:0"><b>${r.sec.title}</b><span class="caption faint" style="display:block">${r.n} schede${r.due ? ` · ${r.due} da ripassare` : ''}</span></span>
      <span aria-hidden="true" style="color:var(--ink-3);display:grid"><${I.arrow} /></span>
    </button>`)}
  </div>`;
}

export function FlashSession({ kinds, sectionId, skillId, onExit }) {
  const { course, st } = store;
  const cards = useMemo(() => {
    if (skillId) {
      const sk = course.skills.get(skillId);
      return (sk.flashcards || []).map((f) => ({ ...f, _skill: skillId }));
    }
    return flashQueue(course, st, { kinds, sectionId });
  }, []);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [doneN, setDoneN] = useState(0);
  const card = cards[i];
  if (!cards.length)
    return html`<div class="wrap stack pad-top"><h2>Nessuna scheda da ripassare</h2><p class="muted">Le schede compaiono quando sblocchi gli argomenti. Torna più tardi o scegli un'altra sezione.</p><button class="btn" onClick=${onExit}>Indietro</button></div>`;
  if (!card)
    return html`<div class="wrap stack pad-top center"><h1>Fatto!</h1><p class="muted">${doneN} schede ripassate. Torneranno quando staranno per sfuggirti.</p><button class="btn" onClick=${onExit}>Continua</button></div>`;
  const prev = getItem(st, card.id);
  const now = Date.now();
  const preview = (g) => fmtInterval((review(prev, g, now).due - now) / 86400000);
  const grade = (g) => {
    store.flash(card, card._skill, g);
    setDoneN(doneN + 1);
    setFlip(false);
    setI(i + 1);
  };
  return html`<div class="player">
    <div class="player-top"><div class="wrap">
      <button class="x-btn" aria-label="Esci" onClick=${onExit}><${I.x} /></button>
      <div class="bar blue" style="flex:1"><i style=${`width:${(i / cards.length) * 100}%`}></i></div>
      <span class="small faint tnum">${i + 1}/${cards.length}</span>
    </div></div>
    <div class="wrap stack" style="padding-bottom:200px">
      <div class="flash-card">
        <span class="kind">${KIND_LABEL[card.kind] || 'Teoria'}</span>
        <${Md} text=${card.front} />
        ${flip && html`<hr class="sep" /><${Md} text=${card.back} />`}
      </div>
      ${!flip && html`<p class="small faint center">Prova a dirla o a scriverla a parole tue, poi gira la scheda.</p>`}
    </div>
    <div class="footer-check"><div class="wrap">
      ${!flip
        ? html`<button class="btn block" onClick=${() => setFlip(true)} autofocus>Mostra la risposta</button>`
        : html`<div class="grade-row">
            <button class="btn red" onClick=${() => grade(GRADE.AGAIN)}>Non la sapevo<small>${preview(1)}</small></button>
            <button class="btn ghost" onClick=${() => grade(GRADE.HARD)}>A fatica<small>${preview(2)}</small></button>
            <button class="btn" onClick=${() => grade(GRADE.GOOD)}>Bene<small>${preview(3)}</small></button>
            <button class="btn green" onClick=${() => grade(GRADE.EASY)}>Facile<small>${preview(4)}</small></button>
          </div>`}
    </div></div>
  </div>`;
}

export function Formulary({ sectionId, onExit }) {
  const sec = store.course.sections.find((s) => s.id === sectionId);
  if (!sec) return null;
  return html`<div class="wrap stack pad-top" style="padding-bottom:60px">
    <button class="btn quiet" style="align-self:flex-start" onClick=${onExit}><${I.back} /> Teoria</button>
    <h1>${sec.title}</h1>
    ${sec.skills.map(
      (sk) => html`<section class="stack-sm">
        <h2>${sk.title}</h2>
        ${(sk.flashcards || []).map(
          (f) => html`<div class="card flat stack-sm"><span class="eyebrow">${KIND_LABEL[f.kind] || ''}</span><${Md} text=${f.front} /><hr class="sep" /><${Md} text=${f.back} /></div>`,
        )}
      </section>`,
    )}
  </div>`;
}
