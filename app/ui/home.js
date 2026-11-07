import { html, useState } from '../vendor/preact-htm.js';
import { store } from '../store.js';
import { I, SECTION_ICON, SECTION_COLOR } from './icons.js';
import { Md } from './widgets.js';
import { dayXp, streak, getSkill } from '../engine/state.js';
import { isUnlocked, skillComplete, currentSkill, nextLesson, effectiveMastery, crowns, readiness, gradeLabel, dueCount } from '../engine/course.js';

export function Ring({ value, max, label, sub, color = 'var(--green)', size = 76 }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const f = Math.min(1, max ? value / max : 0);
  return html`<div class="ring" style=${`width:${size}px;height:${size}px`}>
    <svg viewBox="0 0 76 76"><circle cx="38" cy="38" r=${r} fill="none" stroke="var(--surface-2)" stroke-width="8" />
      <circle cx="38" cy="38" r=${r} fill="none" stroke=${color} stroke-width="8" stroke-linecap="round" stroke-dasharray=${c} stroke-dashoffset=${c * (1 - f)} /></svg>
    <div class="lbl"><div>${label}<small>${sub}</small></div></div>
  </div>`;
}

function daysTo(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T09:00:00');
  return Math.ceil((d - new Date()) / 86400000);
}

export function Home({ go }) {
  const { course, st } = store;
  const [sheet, setSheet] = useState(null);
  const cur = currentSkill(course, st);
  const curSk = course.skills.get(cur);
  const curLesson = curSk && nextLesson(course, st, cur);
  const today = dayXp(st);
  const goal = st.profile.goal || 50;
  const due = dueCount(course, st);
  const rd = readiness(course, st);
  const dte = daysTo(st.profile.examDate);
  let globalIdx = 0;

  return html`<div class="wrap stack pad-top">
    <div class="card hero-today">
      <${Ring} value=${today} max=${goal} label=${today} sub=${'/ ' + goal + ' XP'} color=${today >= goal ? 'var(--green)' : 'var(--blue)'} />
      <div class="stack-sm">
        <h2>${st.profile.name ? `Ciao ${st.profile.name}` : 'Il tuo percorso'}</h2>
        <p class="small muted">${today >= goal ? 'Obiettivo di oggi raggiunto. Un ripasso in più consolida la memoria.' : `Ancora ${goal - today} XP per l'obiettivo di oggi.`}
          ${dte != null && dte >= 0 ? html` Esame tra <b>${dte}</b> ${dte === 1 ? 'giorno' : 'giorni'}.` : ''}</p>
        <div class="row-wrap">
          <span class="chip blue" title="Stima basata su padronanza, memoria e simulazioni">Voto stimato: ${gradeLabel(rd.grade)}</span>
          ${due > 0 && html`<span class="chip red">${due} da ripassare</span>`}
        </div>
      </div>
    </div>
    <div class="row-wrap">
      ${curSk && curLesson && html`<button class="btn" style="flex:1" onClick=${() => go({ name: 'lesson', skillId: cur, lessonId: curLesson.id })}><${I.play} /> Continua: ${curSk.title}</button>`}
      ${due > 0 && html`<button class="btn ghost" style="flex:1" onClick=${() => go({ name: 'review' })}><${I.review} /> Ripassa (${due})</button>`}
    </div>

    ${course.sections.length === 0 && html`<div class="card"><p>I contenuti non sono stati caricati. Ricarica la pagina.</p></div>`}

    ${course.sections.map((sec) => {
      const color = SECTION_COLOR[sec.id] || 'var(--blue)';
      const firstLocked = !isUnlocked(course, st, sec.skills[0].id);
      const done = sec.skills.filter((s) => skillComplete(course, st, s.id)).length;
      return html`<section class="stack-sm" style=${`--sec:${color}`} aria-label=${sec.title}>
        <div class="section-band">
          <div style="flex:1;min-width:0" class="stack-sm">
            <span class="num">§ ${sec.id.slice(1)} · ${done}/${sec.skills.length}</span>
            <h2>${sec.title}</h2>
            ${sec.subtitle && html`<p>${sec.subtitle}</p>`}
          </div>
          ${firstLocked && html`<button class="btn" onClick=${() => go({ name: 'testout', sectionId: sec.id })}>Salta qui</button>`}
        </div>
        <div class="path">
          ${sec.skills.map((sk) => {
            const i = globalIdx++;
            const unlocked = isUnlocked(course, st, sk.id);
            const complete = skillComplete(course, st, sk.id);
            const ldone = (getSkill(st, sk.id)?.done || []).length;
            const total = (sk.lessons || []).length || 1;
            const cr = crowns(course, st, sk.id);
            const dx = Math.round(Math.sin(i * 0.95) * 64);
            const cls = 'node' + (!unlocked ? ' locked' : complete && cr >= 5 ? ' done' : '') + (sk.id === cur && unlocked ? ' current' : '');
            const frac = ldone / total;
            const Ico = I[SECTION_ICON[sec.id]] || I.star;
            return html`<div class=${cls} style=${`--dx:${dx}px`}>
              <button class="disc" aria-label=${sk.title + (unlocked ? '' : ' (bloccata)')} onClick=${() => setSheet(sk.id)}>
                ${unlocked ? html`<${Ico} />` : html`<${I.lock} />`}
                ${unlocked && frac > 0 && frac < 1 &&
                html`<svg class="prog" viewBox="0 0 92 86"><ellipse cx="46" cy="43" rx="44" ry="41" fill="none" stroke="var(--surface-2)" stroke-width="5"/>
                  <ellipse cx="46" cy="43" rx="44" ry="41" fill="none" stroke="var(--hl)" stroke-width="5" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset=${100 - frac * 100} transform="rotate(-90 46 43)"/></svg>`}
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
    <div class="sheet stack" role="dialog" aria-label=${sk.title} style=${`--sec:${SECTION_COLOR[sec.id]}`}>
      <div class="row"><span class="eyebrow">${sec.title}</span><span class="spacer"></span><button class="x-btn" aria-label="Chiudi" onClick=${onClose}><${I.x} /></button></div>
      <h2>${sk.title}</h2>
      ${sk.summary && html`<${Md} class="muted" text=${sk.summary} />`}
      <div class="stack-sm">
        <div class="row small"><span>Padronanza</span><span class="spacer"></span><b class="tnum">${Math.round(m * 100)}%</b></div>
        <div class="bar"><i style=${`width:${m * 100}%`}></i></div>
      </div>
      ${(sk.examRefs || []).length > 0 && html`<div class="row-wrap">${sk.examRefs.slice(0, 6).map((r) => html`<span class="chip hl">${r}</span>`)}</div>`}
      ${!unlocked && html`<div class="callout"><b>Abilità bloccata.</b> Completa quella precedente, oppure fai il test per saltare alla sezione “${sec.title}”.
        <div class="row-wrap mt"><button class="btn sm" onClick=${() => go({ name: 'testout', sectionId: sec.id })}>Test per saltare</button></div></div>`}
      <div class="list">
        ${(sk.lessons || []).map((le, i) => {
          const ok = done.has(le.id);
          return html`<div class=${'lesson-row' + (ok ? ' ok' : '')}>
            <span class="n">${ok ? html`<${I.check} style="width:18px;height:18px" />` : i + 1}</span>
            <div class="grow"><b>${le.title}</b><div class="small faint">${(le.cards || []).length} schede</div></div>
            <button class=${'btn sm' + (ok ? ' ghost' : '')} disabled=${!unlocked} onClick=${() => go({ name: 'lesson', skillId, lessonId: le.id })}>${ok ? 'Ripeti' : 'Inizia'}</button>
          </div>`;
        })}
      </div>
      <div class="row-wrap">
        <button class="btn green" style="flex:1" disabled=${!anyDone} onClick=${() => go({ name: 'practice', skillId })}><${I.target} /> Allenati</button>
        <button class="btn ghost" style="flex:1" disabled=${!nFlash} onClick=${() => go({ name: 'flash', skillId })}><${I.book} /> Teoria (${nFlash})</button>
      </div>
      ${!anyDone && unlocked && html`<p class="small faint">L'allenamento si sblocca dopo la prima lezione.</p>`}
    </div>
  </div>`;
}

export function Onboarding({ onDone }) {
  const p = store.st.profile;
  const [name, setName] = useState(p.name || '');
  const [goal, setGoal] = useState(p.goal || 50);
  const [examDate, setExamDate] = useState(p.examDate || '');
  const [step, setStep] = useState(0);
  const goals = [
    [20, 'Leggero', '≈ 10 min'],
    [50, 'Regolare', '≈ 20 min'],
    [100, 'Intenso', '≈ 40 min'],
    [150, 'Sessione d\'esame', '≈ 1 ora'],
  ];
  const finish = (start) => {
    store.setProfile({ name: name.trim(), goal, examDate, onboarded: true });
    onDone(start);
  };
  return html`<div class="wrap stack pad-top" style="padding-bottom:40px">
    <div class="brand" style="font-size:1.3rem"><span class="mark">∫</span> Analisi 1 · Percorso</div>
    ${step === 0 &&
    html`<div class="stack">
      <h1>Dallo zero al 30 e lode, un passo al giorno.</h1>
      <p class="muted">Un percorso costruito su 30 temi d'esame di Analisi Matematica 1 e Geometria (Ing. Gestionale, PoliMi): ogni argomento, ogni tipo di esercizio, ogni domanda di teoria che esce davvero.</p>
      <div class="card flat stack-sm">
        <p><b>Come funziona.</b></p>
        <ul class="md" style="padding-left:1.2em;margin:0">
          <li>Lezioni brevi: un'idea, un esempio svolto, poi esercizi da risolvere tu.</li>
          <li>Ogni errore riceve una spiegazione e torna nel ripasso quando stai per dimenticarlo.</li>
          <li>Teoria per la Parte A con schede, dimostrazioni da ricostruire e risposte aperte.</li>
          <li>Simulazioni d'esame cronometrate con i temi veri.</li>
          <li>Progressi salvati in automatico nel cloud, su tutti i tuoi dispositivi, con cronologia ripristinabile.</li>
        </ul>
      </div>
      <button class="btn block" onClick=${() => setStep(1)}>Inizia</button>
    </div>`}
    ${step === 1 &&
    html`<div class="stack">
      <h2>Come ti chiami?</h2>
      <div class="field"><label for="ob-name">Nome (facoltativo)</label><input id="ob-name" class="input" style="font-family:var(--f-body)" value=${name} onInput=${(e) => setName(e.currentTarget.value)} /></div>
      <h2>Quanto vuoi studiare al giorno?</h2>
      <div class="options">${goals.map(([g, l, t]) => html`<button class=${'opt' + (goal === g ? ' sel' : '')} onClick=${() => setGoal(g)}><b style="flex:1">${l}</b><span class="faint small">${g} XP · ${t}</span></button>`)}</div>
      <div class="field"><label for="ob-date">Data dell'esame (facoltativa)</label><input id="ob-date" type="date" class="input" value=${examDate} onInput=${(e) => setExamDate(e.currentTarget.value)} /></div>
      <button class="btn block" onClick=${() => setStep(2)}>Avanti</button>
    </div>`}
    ${step === 2 &&
    html`<div class="stack">
      <h2>Da dove parti?</h2>
      <button class="opt" onClick=${() => finish('zero')}><div class="stack-sm" style="flex:1"><b>Parto da zero</b><span class="small muted">Ripartiamo dalle basi: frazioni, equazioni, logaritmi, trigonometria. Consigliato se la matematica delle superiori è un ricordo lontano.</span></div></button>
      <button class="opt" onClick=${() => finish('test')}><div class="stack-sm" style="flex:1"><b>Conosco già le basi</b><span class="small muted">Un test di 12 domande sulle fondamenta: se lo superi, inizi direttamente dagli insiemi numerici.</span></div></button>
    </div>`}
  </div>`;
}
