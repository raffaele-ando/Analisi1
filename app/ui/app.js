// Shell dell'app: quattro sezioni in barra (Percorso, Ripasso, Esami, Profilo), una sola barra superiore,
// sessioni a tutto schermo e una pagina di secondo livello per la cronologia.
// Regole: meno voci in barra (HIG tab-bars), un'azione principale per schermata, testi brevi.
import { html, useState, useEffect } from '../vendor/preact-htm.js';
import { store } from '../store.js';
import { I } from './icons.js';
import { Home, Onboarding, Ring } from './home.js';
import { Player } from './player.js';
import { FlashSession, TheoryList } from './theory.js';
import { ExamsHub, ExamRunner } from './exams.js';
import { lessonCards, skillPracticeQueue, reviewQueue, testOutQueue } from '../engine/session.js';
import { dueCount, flashDueCount, readiness, gradeLabel } from '../engine/course.js';
import { streak, validateImported, emptyState, deviceLabel, totalXp } from '../engine/state.js';
import { sound } from './sound.js';
import { ai } from './ai.js';

// Tre sezioni in barra (indicazione di HIG tab-bars: poche voci). Il Profilo sta in alto a destra.
const TABS = [
  { id: 'home', label: 'Percorso', icon: 'path' },
  { id: 'review', label: 'Ripasso', icon: 'review' },
  { id: 'exams', label: 'Esami', icon: 'exam' },
];

export function App() {
  const [, force] = useState(0);
  const [route, setRoute] = useState({ name: 'tab', tab: store.st.profile.onboarded ? 'home' : 'onboarding' });
  const [toast, setToast] = useState(null);
  useEffect(() => store.subscribe(() => force((n) => n + 1)), []);
  useEffect(() => {
    store.toast = (msg) => {
      setToast(msg);
      setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
    };
  }, []);

  const go = (r) => {
    const from = route.name === 'tab' ? route.tab : route.from;
    const sid = Math.random().toString(36).slice(2);
    let extra = {};
    if (r.name === 'lesson') {
      const le = (store.course.skills.get(r.skillId).lessons || []).find((l) => l.id === r.lessonId);
      extra = { cards: lessonCards(le) };
    }
    if (r.name === 'practice') extra = { cards: skillPracticeQueue(store.course, store.st, r.skillId, 10) };
    if (r.name === 'review') extra = { cards: reviewQueue(store.course, store.st, 12) };
    if (r.name === 'testout') extra = { cards: testOutQueue(store.course, r.sectionId, 12) };
    setRoute({ ...r, ...extra, from, sid });
  };
  const exit = () => setRoute({ name: 'tab', tab: route.from || 'home' });
  const { st, course } = store;
  const sk = streak(st);
  const onboarding = route.name === 'tab' && route.tab === 'onboarding';
  const activeTab = route.name === 'tab' ? route.tab : route.name === 'history' ? 'profile' : null;
  const tabLabel = TABS.find((t) => t.id === activeTab)?.label || (activeTab === 'profile' ? 'Profilo' : undefined);
  const title = route.name === 'history' ? 'Cronologia' : tabLabel;
  const due = dueCount(course, st) + flashDueCount(course, st);

  let screen;
  if (route.name === 'lesson') {
    const sec = course.skills.get(route.skillId);
    const le = (sec.lessons || []).find((l) => l.id === route.lessonId);
    screen = html`<${Player} key=${route.sid} title=${le.title} cards=${route.cards} mode="lesson" skillId=${route.skillId} lessonId=${route.lessonId} onExit=${exit} onDone=${exit} />`;
  } else if (route.name === 'practice') {
    screen = html`<${Player} key=${route.sid} title=${course.skills.get(route.skillId).title} cards=${route.cards} mode="practice" skillId=${route.skillId} onExit=${exit} onDone=${exit} />`;
  } else if (route.name === 'review') {
    screen = route.cards?.length
      ? html`<${Player} key=${route.sid} title="Ripasso" cards=${route.cards} mode="review" onExit=${exit} onDone=${exit} />`
      : html`<${Empty} icon="review" title="Niente da ripassare" text="Gli esercizi tornano qui quando stanno per essere dimenticati." action="Torna al percorso" onAction=${exit} />`;
  } else if (route.name === 'testout') {
    const sec = course.sections.find((s) => s.id === route.sectionId);
    screen = html`<${Player} key=${route.sid} title=${'Test · ' + sec.title} cards=${route.cards} mode="testout" onExit=${exit}
      onDone=${(res) => {
        const acc = res.total ? res.correct / res.total : 0;
        if (acc >= 0.8) {
          store.passTestOut(route.sectionId);
          store.toast?.('Sezione sbloccata');
        } else store.toast?.('Serve l\'80% di risposte giuste');
        exit();
      }} />`;
  } else if (route.name === 'flash') {
    screen = html`<${FlashSession} kinds=${null} sectionId=${route.sectionId || null} skillId=${route.skillId || null} onExit=${() => setRoute({ name: 'tab', tab: 'review' })} />`;
  } else if (route.name === 'exam') {
    screen = html`<${ExamRunner} key=${route.resume || (route.exam && route.exam.id) || 'e'} exam=${route.exam} resume=${route.resume} onExit=${() => setRoute({ name: 'tab', tab: 'exams' })} go=${go} />`;
  } else if (route.name === 'history') {
    screen = html`<${History} />`;
  } else {
    screen = html`<${TabScreen} tab=${route.tab} go=${go} onPath=${() => setRoute({ name: 'tab', tab: 'home' })} onHistory=${() => setRoute({ name: 'history', from: 'profile' })} />`;
  }

  const fullScreen = !activeTab; // sessioni: nessuna barra inferiore (sono compiti temporanei, HIG modality)
  const back = route.name === 'history' ? () => setRoute({ name: 'tab', tab: 'profile' }) : null;

  return html`<div class="shell">
    ${!onboarding && !fullScreen && html`<header class="topbar"><div class="wrap">
      ${back && html`<button class="x-btn" aria-label="Indietro" onClick=${back}><${I.back} /></button>`}
      <h1 class="topbar-title">${title}</h1>
      <span class="spacer"></span>
      <button class=${'x-btn' + (activeTab === 'profile' ? ' on' : '')} aria-label="Profilo" aria-current=${activeTab === 'profile' ? 'page' : null} onClick=${() => setRoute({ name: 'tab', tab: 'profile' })}><${I.user} /></button>
    </div></header>`}
    <main class="main" id="main">
      ${onboarding ? html`<${Onboarding} onDone=${(start) => setRoute(start === 'test' ? { name: 'testout', sectionId: 's00', cards: testOutQueue(store.course, 's00', 12) } : { name: 'tab', tab: 'home' })} />` : screen}
    </main>
    ${!onboarding && !fullScreen && html`<nav class="tabbar" aria-label="Sezioni"><div class="tabs" style=${`--tabs:${TABS.length}`}>
      ${TABS.map((t) => {
        const Ico = I[t.icon];
        const badge = t.id === 'review' && due > 0 ? due : 0;
        const on = activeTab === t.id;
        return html`<button class=${'tab' + (on ? ' on' : '')} aria-current=${on ? 'page' : null} onClick=${() => setRoute({ name: 'tab', tab: t.id })}>
          <span class="ico-wrap"><${Ico} /></span>${t.label}${badge > 0 && html`<span class="badge" aria-label=${badge + ' da ripassare'}>${badge > 99 ? '99+' : badge}</span>`}</button>`;
      })}
    </div></nav>`}
    ${toast && html`<div class="toast" role="status">${toast}</div>`}
  </div>`;
}

function TabScreen({ tab, go, onHistory, onPath }) {
  if (tab === 'home') return html`<${Home} go=${go} />`;
  if (tab === 'review') return html`<${RipassoTab} go=${go} onPath=${onPath} />`;
  if (tab === 'exams') return html`<${ExamsHub} go=${go} />`;
  return html`<${ProfileTab} onHistory=${onHistory} />`;
}

/** Schermata vuota: icona, perché è vuota, una sola azione. Mai una pagina bianca. */
function Empty({ icon, title, text, action, onAction }) {
  const Ico = I[icon] || I.star;
  return html`<div class="wrap empty" style="padding-top:64px">
    <div class="ico-big"><${Ico} /></div>
    <h2>${title}</h2>
    <p class="muted" style="max-width:32ch">${text}</p>
    ${action && html`<button class="btn ghost" onClick=${onAction}>${action}</button>`}
  </div>`;
}

/** Ripasso: due viste con un controllo segmentato. "Teoria" è qui perché si ripassa anche così. */
function RipassoTab({ go, onPath }) {
  const { course, st } = store;
  const [view, setView] = useState('review');
  const due = dueCount(course, st);
  const fdue = flashDueCount(course, st);
  const total = due + fdue;
  return html`<div class="wrap stack">
    <div class="seg" role="tablist" aria-label="Ripasso">
      <button role="tab" aria-selected=${view === 'review'} class=${view === 'review' ? 'on' : ''} onClick=${() => setView('review')}>Da ripassare${total ? ` · ${total}` : ''}</button>
      <button role="tab" aria-selected=${view === 'theory'} class=${view === 'theory' ? 'on' : ''} onClick=${() => setView('theory')}>Teoria</button>
    </div>
    ${view === 'theory'
      ? html`<${TheoryList} go=${go} />`
      : total === 0
        ? html`<${Empty} icon="review" title="Tutto in ordine" text="Non c'è niente da ripassare adesso." action="Vai al percorso" onAction=${onPath} />`
        : html`<section class="card hero-today">
            <${Ring} value=${Math.min(total, 30)} max=${30} label=${String(total)} sub="da fare" color="var(--danger)" />
            <div class="stack-sm" style="min-width:0"><p style="font-weight:600">${total} ${total === 1 ? 'elemento' : 'elementi'}</p>
              <p class="small muted">${due} esercizi · ${fdue} schede</p></div>
            <button class="btn block" style="grid-column:1 / -1" disabled=${due === 0} onClick=${() => go({ name: 'review' })}><${I.review} /> Ripassa</button>
          </section>`}
  </div>`;
}

/** Riga di lista con etichetta, valore opzionale e freccia se apre qualcosa. */
function Row({ label, value, onClick, danger }) {
  const inner = html`<span class="grow" style=${'flex:1;min-width:0;' + (danger ? 'color:var(--danger-ink)' : '')}>${label}</span>
    ${value != null && html`<span class="faint small">${value}</span>`}
    ${onClick && !danger && html`<span aria-hidden="true" style="color:var(--ink-3);display:grid"><${I.arrow} /></span>`}`;
  return onClick
    ? html`<button class="list-item" style="width:100%;text-align:left;background:none;border-left:0;border-right:0;border-top:0" onClick=${onClick}>${inner}</button>`
    : html`<div class="list-item">${inner}</div>`;
}

/** Profilo: tre gruppi brevi. Il resto (cronologia, esportazione) sta in una pagina a parte. */
function ProfileTab({ onHistory }) {
  const { st, course } = store;
  const sync = store.sync;
  const [confirmReset, setConfirmReset] = useState(false);
  const rd = readiness(course, st);
  const lessonsDone = Object.values(st.skills || {}).reduce((n, s) => n + (s.done || []).length, 0);
  const estimateReady = lessonsDone >= 3;
  const cloudOn = sync?.mode === 'cloud';
  return html`<div class="wrap stack" style="padding-bottom:40px">
    <section class="stack-sm" aria-labelledby="g-prog"><p class="group-title" id="g-prog">Progressi</p>
      <div class="group">
        <${Row} label="Giorni di fila" value=${streak(st)} />
        <${Row} label="Lezioni completate" value=${lessonsDone} />
        <${Row} label="Voto stimato" value=${estimateReady ? gradeLabel(rd.grade) : 'Dopo 3 lezioni'} />
      </div>
    </section>

    <section class="stack-sm" aria-labelledby="g-sync"><p class="group-title" id="g-sync">Salvataggio</p>
      <div class="group">
        <${Row} label="Dove" value=${cloudOn ? 'Cloud' : 'Questo dispositivo'} />
        <${Row} label="Stato" value=${store.syncStatus?.text || ''} />
        <${Row} label="Cronologia e ripristino" onClick=${onHistory} />
      </div>
    </section>

    <section class="stack-sm" aria-labelledby="g-pref"><p class="group-title" id="g-pref">Preferenze</p>
      <div class="group">
        <div class="list-item"><label for="p-name" class="grow" style="flex:1">Nome</label>
          <input id="p-name" class="input" placeholder="Facoltativo" autocomplete="given-name" style="width:50%;min-height:44px;padding:8px 10px" value=${st.profile.name} onChange=${(e) => store.setProfile({ name: e.currentTarget.value.trim() })} /></div>
        <div class="list-item"><label for="p-goal" class="grow" style="flex:1">Obiettivo al giorno</label>
          <select id="p-goal" class="input" style="width:50%;min-height:44px;padding:8px 10px" value=${st.profile.goal} onChange=${(e) => store.setProfile({ goal: +e.currentTarget.value })}>
            ${[20, 50, 100, 150].map((g) => html`<option value=${g}>${g} XP</option>`)}
          </select></div>
        <div class="list-item"><label for="p-sound" class="grow" style="flex:1">Suoni</label>
          <input id="p-sound" type="checkbox" style="width:24px;height:24px;accent-color:var(--accent)" checked=${st.settings.sound} onChange=${(e) => { store.setSettings({ sound: e.currentTarget.checked }); sound.enabled = e.currentTarget.checked; }} /></div>
      </div>
      ${ai.available && html`<p class="caption faint">Tutor con Claude attivo.</p>`}
    </section>

    <section class="stack-sm">
      ${confirmReset
        ? html`<div class="confirm-box"><b>Azzerare i progressi?</b><span class="small">Lo stato attuale resta nella cronologia.</span>
            <div class="row-wrap"><button class="btn red sm" onClick=${async () => {
              await sync?.restore(emptyState(), 'Prima dell\'azzeramento');
              setConfirmReset(false);
              store.toast?.('Progressi azzerati');
            }}>Azzera</button><button class="btn ghost sm" onClick=${() => setConfirmReset(false)}>Annulla</button></div></div>`
        : html`<div class="group"><${Row} label="Azzera i progressi" danger=${true} onClick=${() => setConfirmReset(true)} /></div>`}
    </section>
  </div>`;
}

/** Cronologia: istantanee ripristinabili, esportazione e importazione. Pagina di secondo livello. */
function History() {
  const sync = store.sync;
  const [snaps, setSnaps] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(null);
  const [text, setText] = useState('');
  const [showText, setShowText] = useState(false);
  const refresh = async () => setSnaps(sync ? await sync.listSnapshots() : []);
  useEffect(() => { refresh(); }, []);
  const restore = async (entry) => {
    setBusy(true);
    try {
      const target = await sync.loadSnapshot(entry);
      if (!target) throw new Error('non disponibile');
      await sync.restore(target, 'Prima del ripristino');
      store.toast?.('Ripristinato');
      setConfirmRestore(null);
      refresh();
    } catch (e) {
      store.toast?.('Ripristino non riuscito');
    }
    setBusy(false);
  };
  const exportNow = async () => {
    const json = JSON.stringify({ app: 'analisi1-duo', exportedAt: new Date().toISOString(), device: deviceLabel(), state: store.st }, null, 2);
    setText(json);
    setShowText(true);
    try {
      const c = window.claude && (await window.claude.use('downloads'));
      if (c) await c.save({ filename: 'analisi1-salvataggio.json', data: json });
    } catch (e) { /* il testo resta da copiare */ }
  };
  const importText = async () => {
    try {
      const obj = JSON.parse(text);
      const err = validateImported(obj);
      if (err) return store.toast?.(err);
      await sync.restore(obj.state && obj.app === 'analisi1-duo' ? obj.state : obj, 'Prima dell\'importazione');
      store.toast?.('Importato');
      setText('');
      setShowText(false);
      refresh();
    } catch (e) {
      store.toast?.('Testo non valido');
    }
  };
  return html`<div class="wrap stack" style="padding-bottom:40px">
    <section class="stack-sm"><p class="group-title">Salvataggi</p>
      <div class="group">
        ${snaps === null && html`<div class="list-item"><span class="faint">Caricamento…</span></div>`}
        ${snaps && snaps.length === 0 && html`<div class="list-item"><span class="muted">Nessun salvataggio ancora.</span></div>`}
        ${(snaps || []).slice(0, 40).map((s) => html`<div class="list-item">
          <div class="grow" style="flex:1;min-width:0"><div style="font-weight:600">${new Date(s.at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</div>
            <div class="caption faint">${s.deviceLabel || 'Dispositivo'}${s.where === 'local' ? ' · locale' : ''} · ${s.summary?.lessons ?? 0} lezioni</div></div>
          ${confirmRestore === s.id
            ? html`<div class="row-wrap"><button class="btn red sm" disabled=${busy} onClick=${() => restore(s)}>Ripristina</button><button class="btn ghost sm" onClick=${() => setConfirmRestore(null)}>No</button></div>`
            : html`<button class="btn quiet sm" onClick=${() => setConfirmRestore(s.id)}>Ripristina</button>`}
        </div>`)}
      </div>
      <p class="caption faint">Prima di ogni ripristino viene salvato lo stato attuale.</p>
    </section>

    <section class="stack-sm"><p class="group-title">Copia di sicurezza</p>
      <div class="group">
        <${Row} label="Esporta il salvataggio" onClick=${exportNow} />
        <${Row} label="Importa da testo" onClick=${() => setShowText(true)} />
      </div>
      ${showText && html`<div class="card flat stack-sm">
        <textarea class="input" aria-label="Salvataggio in formato JSON" placeholder="Incolla qui un salvataggio" value=${text} onInput=${(e) => setText(e.currentTarget.value)}></textarea>
        <div class="row-wrap"><button class="btn ghost sm" disabled=${!text.trim()} onClick=${importText}>Importa</button></div>
      </div>`}
    </section>
  </div>`;
}
