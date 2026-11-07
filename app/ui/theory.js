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

export function TheoryHub({ go }) {
  const { course, st } = store;
  const [kind, setKind] = useState(0);
  const [sec, setSec] = useState('');
  const due = flashDueCount(course, st);
  const total = [...course.items.values()].filter((i) => i.kind === 'flash').length;
  const seen = [...course.items.entries()].filter(([id, i]) => i.kind === 'flash' && getItem(st, id)).length;
  return html`<div class="wrap stack pad-top">
    <div class="stack-sm"><h1>Teoria</h1><p class="muted">Definizioni, enunciati e dimostrazioni della Parte A. Prova a ricordare la risposta prima di girare la scheda: è il recupero attivo che fissa la memoria.</p></div>
    <div class="tiles">
      <div class="tile"><span class="v">${due}</span><span class="k">schede da ripassare</span></div>
      <div class="tile"><span class="v">${seen}<span class="faint" style="font-size:1rem"> / ${total}</span></span><span class="k">schede viste</span></div>
    </div>
    <div class="stack-sm"><span class="eyebrow">Tipo</span><div class="seg">${KINDS.map(([k, l], i) => html`<button class=${kind === i ? 'on' : ''} onClick=${() => setKind(i)}>${l}</button>`)}</div></div>
    <div class="field"><label for="th-sec">Sezione</label>
      <select id="th-sec" class="input" style="font-family:var(--f-ui)" value=${sec} onChange=${(e) => setSec(e.currentTarget.value)}>
        <option value="">Tutte le sezioni sbloccate</option>
        ${course.sections.map((s) => html`<option value=${s.id}>${s.title}</option>`)}
      </select></div>
    <div class="row-wrap">
      <button class="btn" style="flex:1" onClick=${() => go({ name: 'flash', kinds: KINDS[kind][0], sectionId: sec || null })}><${I.play} /> Ripassa le schede</button>
      <button class="btn ghost" style="flex:1" disabled=${!sec} onClick=${() => go({ name: 'formulary', sectionId: sec })}><${I.book} /> Formulario</button>
    </div>
    ${!sec && html`<p class="small faint">Scegli una sezione per consultare il formulario completo.</p>`}
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
