// Shell dell'app: barra superiore, navigazione a schede, schermate di sessione a tutto schermo,
// ripasso e profilo (liste raggruppate, come le impostazioni di iOS e Android).
import { html, useState, useEffect } from '../vendor/preact-htm.js';
import { store } from '../store.js';
import { I } from './icons.js';
import { Home, Onboarding, Ring } from './home.js';
import { Player } from './player.js';
import { TheoryHub, FlashSession, Formulary } from './theory.js';
import { ExamsHub, ExamRunner } from './exams.js';
import { lessonCards, skillPracticeQueue, reviewQueue, testOutQueue } from '../engine/session.js';
import { dueCount, flashDueCount, readiness, gradeLabel } from '../engine/course.js';
import { streak, dayXp, totalXp, validateImported, emptyState, deviceLabel } from '../engine/state.js';
import { sound } from './sound.js';
import { ai } from './ai.js';

const TABS = [
  { id: 'home', label: 'Percorso', icon: 'path' },
  { id: 'review', label: 'Ripasso', icon: 'review' },
  { id: 'exams', label: 'Esami', icon: 'exam' },
  { id: 'theory', label: 'Teoria', icon: 'book' },
  { id: 'profile', label: 'Profilo', icon: 'user' },
];

/** Stato di sincronizzazione: solo un punto con etichetta accessibile; il testo completo è nel Profilo. */
function SyncDot({ s }) {
  const kind = s?.kind || 'busy';
  const text = s?.text || '';
  const cls = kind === 'ok' ? 'ok' : kind === 'local' ? 'local' : kind === 'err' ? 'err' : 'busy';
  return html`<span class=${'sync-chip ' + cls} role="img" aria-label=${text} title=${text}><span class="dot"></span></span>`;
}

export function App() {
  const [, force] = useState(0);
  const [route, setRoute] = useState({ name: 'tab', tab: store.st.profile.onboarded ? 'home' : 'onboarding' });
  const [toast, setToast] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  // Titolo grande a riposo, titolo compatto nella barra solo quando si scorre (convenzione iOS per i titoli grandi)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
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
  const due = dueCount(course, st) + flashDueCount(course, st);
  const sk = streak(st);
  const isTabs = route.name === 'tab';
  const showChrome = isTabs && route.tab !== 'onboarding';

  let screen;
  if (route.name === 'lesson') {
    const sec = course.skills.get(route.skillId);
    const le = (sec.lessons || []).find((l) => l.id === route.lessonId);
    screen = html`<${Player} key=${route.sid} title=${le.title} cards=${route.cards} mode="lesson" skillId=${route.skillId} lessonId=${route.lessonId} onExit=${exit} onDone=${exit} />`;
  } else if (route.name === 'practice') {
    screen = html`<${Player} key=${route.sid} title=${'Allenamento · ' + course.skills.get(route.skillId).title} cards=${route.cards} mode="practice" skillId=${route.skillId} onExit=${exit} onDone=${exit} />`;
  } else if (route.name === 'review') {
    screen = route.cards?.length
      ? html`<${Player} key=${route.sid} title="Ripasso" cards=${route.cards} mode="review" onExit=${exit} onDone=${exit} />`
      : html`<${Empty} icon="review" title="Niente da ripassare adesso" text="Gli esercizi tornano qui quando stanno per essere dimenticati." action="Torna al percorso" onAction=${exit} />`;
  } else if (route.name === 'testout') {
    const sec = course.sections.find((s) => s.id === route.sectionId);
    screen = html`<${Player} key=${route.sid} title=${'Test · ' + sec.title} cards=${route.cards} mode="testout" onExit=${exit}
      onDone=${(res) => {
        const acc = res.total ? res.correct / res.total : 0;
        if (acc >= 0.8) {
          store.passTestOut(route.sectionId);
          store.toast?.('Sezione sbloccata: hai dimostrato di conoscerla.');
        } else store.toast?.('Test non superato: serve l\'80% di risposte giuste.');
        exit();
      }} />`;
  } else if (route.name === 'flash') {
    screen = html`<${FlashSession} kinds=${route.kinds || null} sectionId=${route.sectionId || null} skillId=${route.skillId || null} onExit=${exit} />`;
  } else if (route.name === 'formulary') {
    screen = html`<${Formulary} sectionId=${route.sectionId} onExit=${() => setRoute({ name: 'tab', tab: 'theory' })} />`;
  } else if (route.name === 'exam') {
    screen = html`<${ExamRunner} key=${route.resume || (route.exam && route.exam.id) || 'e'} exam=${route.exam} resume=${route.resume} onExit=${() => setRoute({ name: 'tab', tab: 'exams' })} go=${go} />`;
  } else {
    screen = html`<${TabScreen} tab=${route.tab} go=${go} />`;
  }

  return html`<div class="shell">
    ${showChrome && html`<header class="topbar"><div class="wrap">
      <h1 class=${"topbar-title" + (scrolled ? " on" : "")}>${TABS.find((t) => t.id === route.tab)?.label || ''}</h1>
      <span class="spacer"></span>
      <span class=${'stat flame' + (sk ? '' : ' off')} title="Giorni consecutivi di studio" aria-label=${`${sk} giorni di fila`}><${I.flame} />${sk}</span>
      <span class="stat bolt" title="Esperienza totale" aria-label=${`${totalXp(st)} XP`}><${I.bolt} />${totalXp(st)}</span>
      <span class="sync-chip-wrap"><${SyncDot} s=${store.syncStatus} /></span>
    </div></header>`}
    <main class="main" id="main">
      ${route.tab === 'onboarding' && isTabs
        ? html`<${Onboarding} onDone=${(start) => setRoute(start === 'test' ? { name: 'testout', sectionId: 's00', cards: testOutQueue(store.course, 's00', 12) } : { name: 'tab', tab: 'home' })} />`
        : screen}
    </main>
    ${showChrome && html`<nav class="tabbar" aria-label="Sezioni"><nav>
      ${TABS.map((t) => {
        const Ico = I[t.icon];
        const badge = t.id === 'review' && due > 0 ? due : 0;
        const on = route.tab === t.id;
        return html`<button class=${'tab' + (on ? ' on' : '')} aria-current=${on ? 'page' : null} onClick=${() => setRoute({ name: 'tab', tab: t.id })}>
          <span class="ico-wrap"><${Ico} /></span>${t.label}${badge > 0 && html`<span class="badge" aria-label=${badge + ' da ripassare'}>${badge > 99 ? '99+' : badge}</span>`}</button>`;
      })}
    </nav></nav>`}
    ${toast && html`<div class="toast" role="status">${toast}</div>`}
  </div>`;
}

function TabScreen({ tab, go }) {
  if (tab === 'home') return html`<${Home} go=${go} />`;
  if (tab === 'review') return html`<${ReviewHub} go=${go} />`;
  if (tab === 'exams') return html`<${ExamsHub} go=${go} />`;
  if (tab === 'theory') return html`<${TheoryHub} go=${go} />`;
  return html`<${Profile} />`;
}

/** Schermata vuota: icona, perché è vuota, cosa fare. Mai una pagina bianca. */
function Empty({ icon, title, text, action, onAction }) {
  const Ico = I[icon] || I.star;
  return html`<div class="wrap empty" style="padding-top:64px">
    <div class="ico-big"><${Ico} /></div>
    <h2>${title}</h2>
    <p class="muted" style="max-width:32ch">${text}</p>
    ${action && html`<button class="btn ghost" onClick=${onAction}>${action}</button>`}
  </div>`;
}

function ReviewHub({ go }) {
  const { course, st } = store;
  const due = dueCount(course, st);
  const fdue = flashDueCount(course, st);
  const total = due + fdue;
  if (total === 0) {
    return html`<div class="wrap stack"><header class="screen-title"><h1>Ripasso</h1></header>
      <${Empty} icon="review" title="Tutto in ordine" text="Non c'è niente da ripassare adesso. Gli esercizi tornano qui quando stanno per essere dimenticati." action="Vai al percorso" onAction=${() => go({ name: 'lesson' })} /></div>`;
  }
  return html`<div class="wrap stack">
    <header class="screen-title"><h1>Ripasso</h1><p class="muted">Ripassare poco prima di dimenticare è più efficace che ripassare tanto tutto insieme.</p></header>
    <section class="card hero-today">
      <${Ring} value=${Math.min(total, 30)} max=${30} label=${String(total)} sub="da fare" color="var(--danger)" />
      <div class="stack-sm" style="min-width:0"><p style="font-weight:600">${total} ${total === 1 ? 'elemento' : 'elementi'} in sospeso</p>
        <p class="small muted">${due} esercizi · ${fdue} schede di teoria</p></div>
    </section>
    <div class="stack-sm">
      <button class="btn block" disabled=${due === 0} onClick=${() => go({ name: 'review' })}><${I.review} /> Ripassa esercizi (${due})</button>
      <button class="btn ghost block" disabled=${fdue === 0} onClick=${() => go({ name: 'flash', kinds: null })}><${I.book} /> Schede di teoria (${fdue})</button>
    </div>
  </div>`;
}

/** Riga di lista con etichetta, valore opzionale e azione. */
function Row({ label, value, children, onClick, danger }) {
  const inner = html`<span class="grow" style=${'flex:1;min-width:0;' + (danger ? 'color:var(--danger-ink)' : '')}>${label}</span>
    ${value != null && html`<span class="faint tnum small">${value}</span>`}${children}
    ${onClick && !danger && html`<span aria-hidden="true" style="color:var(--ink-3);display:grid"><${I.arrow} /></span>`}`;
  return onClick
    ? html`<button class="list-item" style="width:100%;text-align:left;background:none;border-left:0;border-right:0;border-top:0" onClick=${onClick}>${inner}</button>`
    : html`<div class="list-item">${inner}</div>`;
}

function Profile() {
  const { st, course } = store;
  const sync = store.sync;
  const [snaps, setSnaps] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [text, setText] = useState('');
  const [showText, setShowText] = useState(false);
  const rd = readiness(course, st);
  const lessonsDone = Object.values(st.skills || {}).reduce((n, s) => n + (s.done || []).length, 0);
  const estimateReady = lessonsDone >= 3;
  const refresh = async () => {
    if (!sync) return setSnaps([]);
    setSnaps(await sync.listSnapshots());
  };
  useEffect(() => { refresh(); }, []);
  const restore = async (entry) => {
    setBusy(true);
    try {
      const target = await sync.loadSnapshot(entry);
      if (!target) throw new Error('Istantanea non disponibile');
      await sync.restore(target, 'Prima del ripristino del ' + new Date().toLocaleString('it-IT'));
      store.toast?.('Ripristinato lo stato del ' + new Date(entry.at).toLocaleString('it-IT'));
      setConfirmRestore(null);
      refresh();
    } catch (e) {
      store.toast?.('Ripristino non riuscito: ' + (e.message || 'errore'));
    }
    setBusy(false);
  };
  const exportNow = async () => {
    const payload = { app: 'analisi1-duo', exportedAt: new Date().toISOString(), device: deviceLabel(), state: st };
    const json = JSON.stringify(payload, null, 2);
    setText(json);
    setShowText(true);
    try {
      const c = window.claude && (await window.claude.use('downloads'));
      if (c) await c.save({ filename: 'analisi1-salvataggio.json', data: json });
    } catch (e) {
      /* senza download, il testo resta da copiare */
    }
  };
  const importText = async () => {
    try {
      const obj = JSON.parse(text);
      const err = validateImported(obj);
      if (err) return store.toast?.(err);
      const target = obj.state && obj.app === 'analisi1-duo' ? obj.state : obj;
      await sync.restore(target, 'Prima dell\'importazione');
      store.toast?.('Salvataggio importato');
      setText('');
      setShowText(false);
      refresh();
    } catch (e) {
      store.toast?.('Il testo non è un salvataggio valido');
    }
  };
  const setP = (patch) => store.setProfile(patch);
  const setS = (patch) => store.setSettings(patch);
  const cloudOn = sync?.mode === 'cloud';
  const syncLabel = store.syncStatus?.text || '';

  return html`<div class="wrap stack" style="padding-bottom:40px">
    <header class="screen-title"><h1>Profilo</h1></header>

    <section class="stack-sm" aria-labelledby="g-prog"><p class="group-title" id="g-prog">I tuoi progressi</p>
      <div class="group">
        <${Row} label="Esperienza totale" value=${totalXp(st) + ' XP'} />
        <${Row} label="Giorni di fila" value=${streak(st)} />
        <${Row} label="Lezioni completate" value=${lessonsDone} />
        <${Row} label="Voto stimato" value=${estimateReady ? gradeLabel(rd.grade) : 'Dopo 3 lezioni'} />
      </div>
      ${estimateReady && html`<p class="caption faint">Stima interna basata su padronanza, memoria e simulazioni. Non è un voto ufficiale.</p>`}
    </section>

    <section class="stack-sm" aria-labelledby="g-sync"><p class="group-title" id="g-sync">Salvataggio</p>
      <div class="group">
        <${Row} label="Stato" value=${syncLabel} />
        <${Row} label="Cloud" value=${cloudOn ? 'Attivo' : 'Solo su questo dispositivo'} />
        <${Row} label="Crea un'istantanea ora" onClick=${async () => { setBusy(true); await sync?.snapshot('Manuale'); setBusy(false); refresh(); store.toast?.('Istantanea creata'); }} />
        <${Row} label="Esporta il salvataggio" onClick=${exportNow} />
      </div>
      <p class="caption faint">${cloudOn
        ? 'I progressi si salvano nel cloud in tempo reale e si aggiornano su tutti i tuoi dispositivi.'
        : 'Per il salvataggio nel cloud apri l\'app da claude.ai con il tuo account. Fino ad allora i progressi restano su questo dispositivo.'}</p>
    </section>

    <section class="stack-sm" aria-labelledby="g-hist"><p class="group-title" id="g-hist">Cronologia</p>
      <div class="group">
        ${snaps === null && html`<div class="list-item"><span class="faint">Caricamento…</span></div>`}
        ${snaps && snaps.length === 0 && html`<div class="list-item"><span class="muted">Nessuna istantanea. Ne vengono create automaticamente ogni 20 minuti di studio.</span></div>`}
        ${(snaps || []).slice(0, 40).map((s) => html`<div class="list-item">
          <div class="grow" style="flex:1;min-width:0"><div style="font-weight:600">${new Date(s.at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })} · ${s.reason}</div>
            <div class="caption faint">${s.deviceLabel || 'Dispositivo'}${s.where === 'local' ? ' · locale' : ''} · ${s.summary?.xp ?? 0} XP</div></div>
          ${confirmRestore === s.id
            ? html`<div class="row-wrap"><button class="btn red sm" disabled=${busy} onClick=${() => restore(s)}>Ripristina</button><button class="btn ghost sm" onClick=${() => setConfirmRestore(null)}>Annulla</button></div>`
            : html`<button class="btn quiet sm" onClick=${() => setConfirmRestore(s.id)}>Ripristina</button>`}
        </div>`)}
      </div>
      <p class="caption faint">Il ripristino salva prima lo stato attuale: non si perde nulla.</p>
    </section>

    <section class="stack-sm" aria-labelledby="g-pref"><p class="group-title" id="g-pref">Preferenze</p>
      <div class="group">
        <div class="list-item"><label for="p-name" class="grow" style="flex:1">Nome</label>
          <input id="p-name" class="input" style="width:50%;min-height:44px;padding:8px 10px" value=${st.profile.name} onChange=${(e) => setP({ name: e.currentTarget.value.trim() })} /></div>
        <div class="list-item"><label for="p-goal" class="grow" style="flex:1">Obiettivo al giorno</label>
          <select id="p-goal" class="input" style="width:50%;min-height:44px;padding:8px 10px" value=${st.profile.goal} onChange=${(e) => setP({ goal: +e.currentTarget.value })}>
            ${[20, 50, 100, 150].map((g) => html`<option value=${g}>${g} XP</option>`)}
          </select></div>
        <div class="list-item"><label for="p-date" class="grow" style="flex:1">Data dell'esame</label>
          <input id="p-date" type="date" class="input" style="width:50%;min-height:44px;padding:8px 10px" value=${st.profile.examDate} onChange=${(e) => setP({ examDate: e.currentTarget.value })} /></div>
        <div class="list-item"><label for="p-sound" class="grow" style="flex:1">Suoni di feedback</label>
          <input id="p-sound" type="checkbox" style="width:24px;height:24px;accent-color:var(--accent)" checked=${st.settings.sound} onChange=${(e) => { setS({ sound: e.currentTarget.checked }); sound.enabled = e.currentTarget.checked; }} /></div>
      </div>
      <p class="caption faint">Dispositivo: ${deviceLabel()}${ai.available ? ' · Tutor con Claude attivo' : ''}</p>
    </section>

    ${showText && html`<section class="stack-sm" aria-labelledby="g-text"><p class="group-title" id="g-text">Importa o esporta come testo</p>
      <div class="group" style="padding:12px 16px"><textarea class="input" aria-label="Salvataggio in formato JSON" placeholder="Incolla qui un salvataggio esportato" value=${text} onInput=${(e) => setText(e.currentTarget.value)}></textarea>
        <div class="row-wrap" style="margin-top:8px"><button class="btn ghost sm" disabled=${!text.trim()} onClick=${importText}><${I.upload} /> Importa questo testo</button></div></div>
    </section>`}
    ${!showText && html`<button class="btn quiet" style="align-self:flex-start" onClick=${() => setShowText(true)}>Importa un salvataggio da testo</button>`}

    <section class="stack-sm" aria-labelledby="g-danger"><p class="group-title" id="g-danger">Dati</p>
      ${confirmReset
        ? html`<div class="confirm-box"><b>Azzerare tutti i progressi?</b><span class="small">Lo stato attuale resta nella cronologia e può essere ripristinato.</span>
            <div class="row-wrap"><button class="btn red sm" onClick=${async () => {
              await sync?.restore(emptyState(), 'Prima dell\'azzeramento');
              setConfirmReset(false);
              store.toast?.('Progressi azzerati: lo stato precedente è in cronologia');
              refresh();
            }}>Sì, azzera</button><button class="btn ghost sm" onClick=${() => setConfirmReset(false)}>Annulla</button></div></div>`
        : html`<div class="group"><${Row} label="Azzera i progressi" danger=${true} onClick=${() => setConfirmReset(true)} /></div>`}
    </section>
  </div>`;
}
