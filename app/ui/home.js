// Percorso (schermata principale), scheda di abilità e onboarding.
// Una sola azione principale per schermata: "Continua" sulla lezione corrente.
import { html, useState } from '../vendor/preact-htm.js';
import { store } from '../store.js';
import { I } from './icons.js';
import { Md } from './widgets.js';
import { tex } from './md.js';
import { dayXp, getSkill } from '../engine/state.js';
import { isUnlocked, skillComplete, currentSkill, nextLesson, effectiveMastery, crowns, dueCount, flashDueCount } from '../engine/course.js';

/** Simbolo matematico della sezione, composto con KaTeX (più chiaro di un'icona disegnata a mano). */
export const SECTION_SYMBOL = {
  s00: '\\tfrac{a}{b}', s01: '\\mathbb{R}', s02: 'z=a+ib', s03: 'f(x)', s04: '\\{a_n\\}', s05: '\\lim',
  s06: 'o(x)', s07: 'C^0', s08: "f'", s09: '\\nearrow', s10: 'T_n', s11: '\\int', s12: '\\int^{\\infty}',
  s13: '\\sum', s14: '\\sum x^n', s15: '\\vec{v}',
};

export function Sym({ tex: src, class: cls = 'sym' }) {
  return html`<span class=${cls} aria-hidden="true" dangerouslySetInnerHTML=${{ __html: tex(src) }}></span>`;
}

export function Ring({ value, max, label, sub, color = 'var(--success)', size = 72 }) {
  const r = 31;
  const c = 2 * Math.PI * r;
  const f = Math.min(1, max ? value / max : 0);
  return html`<div class="ring" style=${`width:${size}px;height:${size}px`} role="img" aria-label=${`${label} ${sub}`}>
    <svg viewBox="0 0 72 72"><circle cx="36" cy="36" r=${r} fill="none" stroke="var(--surface-2)" stroke-width="7" />
      <circle cx="36" cy="36" r=${r} fill="none" stroke=${color} stroke-width="7" stroke-linecap="round" stroke-dasharray=${c} stroke-dashoffset=${c * (1 - f)} /></svg>
    <div class="lbl"><div>${label}<small>${sub}</small></div></div>
  </div>`;
}

export function Home({ go }) {
  const { course, st } = store;
  const [sheet, setSheet] = useState(null);
  const cur = currentSkill(course, st);
  const curSk = course.skills.get(cur);
  const curLesson = curSk && nextLesson(course, st, cur);
  const today = dayXp(st);
  const goal = st.profile.goal || 50;
  const due = dueCount(course, st) + flashDueCount(course, st);
  const name = st.profile.name ? `Ciao ${st.profile.name}` : 'Percorso';
  let nodeIndex = 0;

  return html`<div class="wrap stack pad-top">
    <header class="screen-title">
      <h1>${name}</h1>
      <p class="muted">Dalle basi al 30 e lode, una lezione alla volta.</p>
    </header>

    <section class="card hero-today" aria-labelledby="today-h">
      <${Ring} value=${today} max=${goal} label=${String(today)} sub=${'/' + goal} color=${today >= goal ? 'var(--success)' : 'var(--accent)'} />
      <div class="stack-sm" style="min-width:0">
        <p class="eyebrow" id="today-h">${today >= goal ? 'Obiettivo di oggi raggiunto' : 'Obiettivo di oggi'}</p>
        ${curSk && curLesson
          ? html`<p style="font-weight:600">${curSk.title}</p><p class="small muted">${curLesson.title}</p>`
          : html`<p style="font-weight:600">Tutte le lezioni completate</p>`}
      </div>
      ${curSk && curLesson && html`<button class="btn block" style="grid-column: 1 / -1" onClick=${() => go({ name: 'lesson', skillId: cur, lessonId: curLesson.id })}>
        <${I.play} /> Continua</button>`}
    </section>

    ${due > 0 && html`<section class="card flat row" aria-label="Ripasso">
      <div class="grow" style="flex:1;min-width:0"><p style="font-weight:600">Ripasso pronto</p><p class="small muted">${due} ${due === 1 ? 'elemento' : 'elementi'} da ripassare</p></div>
      <button class="btn ghost sm" onClick=${() => go({ name: 'review' })}>Ripassa</button>
    </section>`}

    ${course.sections.length === 0 && html`<div class="card"><p>I contenuti non sono stati caricati. Ricarica la pagina.</p></div>`}

    ${course.sections.map((sec) => {
      const first = sec.skills[0];
      const firstLocked = !isUnlocked(course, st, first.id);
      const done = sec.skills.filter((s) => skillComplete(course, st, s.id)).length;
      const pct = sec.skills.length ? done / sec.skills.length : 0;
      return html`<section class="stack-sm" aria-label=${sec.title}>
        <div class="section-head">
          <div class="top">
            <h2>${sec.title}</h2>
          </div>
          <div class="row"><span class="count">${done} di ${sec.skills.length} completate</span><span class="spacer"></span>
            ${firstLocked && html`<button class="btn quiet sm" onClick=${() => go({ name: 'testout', sectionId: sec.id })}>Salta con un test</button>`}</div>
          <div class="bar blue" role="progressbar" aria-label=${'Progresso ' + sec.title} aria-valuemin="0" aria-valuemax="100" aria-valuenow=${Math.round(pct * 100)}><i style=${`width:${pct * 100}%`}></i></div>
        </div>
        <div class="path">
          ${sec.skills.map((sk) => {
            const i = nodeIndex++;
            const unlocked = isUnlocked(course, st, sk.id);
            const complete = skillComplete(course, st, sk.id);
            const ldone = (getSkill(st, sk.id)?.done || []).length;
            const total = (sk.lessons || []).length || 1;
            const cr = crowns(course, st, sk.id);
            const dx = Math.round(Math.sin(i * 0.95) * 44);
            const isCurrent = sk.id === cur && unlocked;
            const cls = 'node' + (!unlocked ? ' locked' : complete ? ' done' : '') + (isCurrent ? ' current' : '');
            const frac = ldone / total;
            const label = !unlocked ? sk.title + ', bloccata' : complete ? sk.title + ', completata' : sk.title + (frac > 0 ? `, ${ldone} di ${total} lezioni` : '');
            return html`<div class=${cls} style=${`--dx:${dx}px`}>
              <button class="disc" aria-label=${label} onClick=${() => setSheet(sk.id)}>
                ${!unlocked ? html`<${I.lock} />` : complete ? html`<${I.check} />` : html`<${Sym} tex=${SECTION_SYMBOL[sec.id] || 'x'} />`}
                ${unlocked && frac > 0 && frac < 1 &&
                html`<svg class="prog" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="40" fill="none" stroke="var(--surface-2)" stroke-width="3"/>
                  <circle cx="42" cy="42" r="40" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset=${100 - frac * 100} transform="rotate(-90 42 42)"/></svg>`}
              </button>
              <span class="lbl">${sk.title}</span>
              ${cr > 0 && html`<span class="crowns"><${I.crown} />${cr}/5</span>`}
            </div>`;
          })}
        </div>
      </section>`;
    })}
    ${sheet && html`<${SkillSheet} skillId=${sheet} go=${go} onClose=${() => setSheet(null)} />`}
  </div>`;
}

export function SkillSheet({ skillId, go, onClose }) {
  const { course, st } = store;
  const sk = course.skills.get(skillId);
  const sec = course.sectionOf.get(skillId);
  const unlocked = isUnlocked(course, st, skillId);
  const done = new Set(getSkill(st, skillId)?.done || []);
  const m = effectiveMastery(course, st, skillId);
  const nFlash = (sk.flashcards || []).length;
  const anyDone = done.size > 0;
  return html`<div class="overlay" onClick=${(e) => e.target === e.currentTarget && onClose()}>
    <div class="sheet stack" role="dialog" aria-modal="true" aria-label=${sk.title}>
      <div class="row"><span class="eyebrow">${sec.title}</span><span class="spacer"></span><button class="x-btn" aria-label="Chiudi" onClick=${onClose}><${I.x} /></button></div>
      <h2>${sk.title}</h2>
      ${sk.summary && html`<${Md} class="muted" text=${sk.summary} />`}
      <div class="stack-sm">
        <div class="row small"><span>Padronanza</span><span class="spacer"></span><b class="tnum">${Math.round(m * 100)}%</b></div>
        <div class="bar"><i style=${`width:${m * 100}%`}></i></div>
      </div>
      ${(sk.examRefs || []).length > 0 && html`<div class="row-wrap">${sk.examRefs.slice(0, 6).map((r) => html`<span class="chip">${r}</span>`)}</div>`}
      ${!unlocked && html`<div class="callout">Si sblocca completando la sezione precedente, oppure con un test.
        <div class="row-wrap mt"><button class="btn sm" onClick=${() => go({ name: 'testout', sectionId: sec.id })}>Fai il test</button></div></div>`}
      <div class="list">
        ${(sk.lessons || []).map((le, i) => {
          const ok = done.has(le.id);
          return html`<div class=${'lesson-row' + (ok ? ' ok' : '')}>
            <span class="n">${ok ? html`<${I.check} />` : i + 1}</span>
            <div class="grow" style="flex:1;min-width:0"><b>${le.title}</b><div class="caption faint">${(le.cards || []).length} schede</div></div>
            <button class=${'btn sm' + (ok ? ' ghost' : '')} disabled=${!unlocked} onClick=${() => go({ name: 'lesson', skillId, lessonId: le.id })}>${ok ? 'Ripeti' : 'Inizia'}</button>
          </div>`;
        })}
      </div>
      <div class="row-wrap">
        <button class="btn green" style="flex:1" disabled=${!anyDone} onClick=${() => go({ name: 'practice', skillId })}><${I.target} /> Allenati</button>
        <button class="btn ghost" style="flex:1" disabled=${!nFlash} onClick=${() => go({ name: 'flash', skillId })}><${I.book} /> Teoria (${nFlash})</button>
      </div>
      ${!anyDone && unlocked && html`<p class="caption faint">L'allenamento si sblocca dopo la prima lezione.</p>`}
    </div>
  </div>`;
}

export function Onboarding({ onDone }) {
  // Una sola schermata: la promessa, una formula reale, e si parte. Le impostazioni (nome, obiettivo,
  // data d'esame) restano nel Profilo, con valori predefiniti: HIG, Onboarding, "postpone nonessential setup".
  const finish = (start) => {
    store.setProfile({ onboarded: true });
    onDone(start);
  };
  return html`<div class="wrap stack" style="padding-top:48px;min-height:80vh;justify-content:space-between">
    <div class="stack">
      <div class="brand"><span class="mark" aria-hidden="true">∫</span>Analisi 1</div>
      <h1>Dalle basi al 30 e lode, una lezione alla volta.</h1>
      <p class="muted">Lezioni brevi, correzione immediata e ripasso nel momento giusto. Gli esercizi sono quelli dei temi d'esame.</p>
    </div>
    <div class="card flat center" style="padding:32px 16px" aria-hidden="true">
      <span style="font-size:1.875rem" dangerouslySetInnerHTML=${{ __html: tex('\\int_0^1 x^2\\,dx=\\tfrac{1}{3}') }}></span>
    </div>
    <div class="stack">
      <button class="btn block" onClick=${() => finish('zero')}>Inizia la prima lezione</button>
      <button class="btn quiet block" onClick=${() => finish('test')}>Ho già studiato la matematica</button>
    </div>
  </div>`;
}
