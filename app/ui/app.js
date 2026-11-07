// Shell dell'app: navigazione a schede, schermate di sessione a tutto schermo, profilo e cronologia.
import { html, useState, useEffect } from '../vendor/preact-htm.js';
import { store } from '../store.js';
import { I } from './icons.js';
import { Home, Onboarding } from './home.js';
import { Player } from './player.js';
import { TheoryHub, FlashSession, Formulary } from './theory.js';
import { ExamsHub, ExamRunner } from './exams.js';
import { Ring } from './home.js';
import { lessonCards, skillPracticeQueue, reviewQueue, testOutQueue } from '../engine/session.js';
import { dueCount, flashDueCount, readiness, gradeLabel } from '../engine/course.js';
import { streak, dayXp, totalXp, validateImported, emptyState, exportPayload, deviceLabel } from '../engine/state.js';
import { sound } from './sound.js';
import { ai } from './ai.js';

const TABS = [
  { id: 'home', label: 'Percorso', icon: 'path' },
  { id: 'review', label: 'Ripasso', icon: 'review' },
  { id: 'exams', label: 'Esami', icon: 'exam' },
  { id: 'theory', label: 'Teoria', icon: 'book' },
  { id: 'profile', label: 'Profilo', icon: 'user' },
];

function syncChip(s) {
  const kind = s?.kind || 'busy';
  return html`<span class=${'sync-chip ' + (kind === 'ok' ? 'ok' : kind === 'local' ? 'local' : kind === 'err' ? 'err' : 'busy')} role="status" aria-live="polite"><span class="dot"></span>${s?.text || ''}</span>`;
}

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
    applyTheme(store.st.settings.theme);
  }, []);
  useEffect(() => applyTheme(store.st.settings.theme), [store.st.settings.theme]);

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
  const dx = dayXp(st);
  const goal = st.profile.goal || 50;
  const sk = streak(st);

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
      : html`<${Empty} title="Niente da ripassare adesso" text="Gli esercizi tornano nel ripasso quando stanno per essere dimenticati. Torna più tardi o studia una nuova lezione." onBack=${exit} />`;
  } else if (route.name === 'testout') {
    const sec = course.sections.find((s) => s.id === route.sectionId);
    screen = html`<${Player} key=${route.sid} title=${'Test · ' + sec.title} cards=${route.cards} mode="testout" onExit=${exit}
      onDone=${(res) => {
        const acc = res.total ? res.correct / res.total : 0;
        if (acc >= 0.8) {
          store.passTestOut(route.sectionId);
          store.toast?.('Sezione sbloccata. Hai dimostrato di conoscerla.');
        } else store.toast?.('Il test non è superato (serve l\'80%). Studia le lezioni della sezione.');
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

  const isTabs = route.name === 'tab';
  return html`<div class="shell">
    ${isTabs && route.tab !== 'onboarding' && html`<header class="topbar"><div class="wrap">
      <div class="brand"><span class="mark" aria-hidden="true">∫</span>Analisi 1</div>
      <span class="spacer"></span>
      <span class=${'stat flame' + (sk ? '' : ' off')} title="Giorni consecutivi di studio"><${I.flame} />${sk}</span>
      <span class="stat bolt" title="Esperienza totale"><${I.bolt} />${totalXp(st)}</span>
      <span class="sync-chip-wrap">${syncChip(store.syncStatus)}</span>
    </div></header>`}
    <main class="main" id="main">
      ${isTabs && route.tab === 'onboarding'
        ? html`<${Onboarding} onDone=${(start) => setRoute(start === 'test' ? { name: 'testout', sectionId: 's00' } : { name: 'tab', tab: 'home' })} />`
        : screen}
    </main>
    ${isTabs && route.tab !== 'onboarding' && html`<nav class="tabbar" aria-label="Sezioni"><nav>
      ${TABS.map((t) => {
        const Ico = I[t.icon];
        const badge = t.id === 'review' && due > 0 ? due : 0;
        return html`<button class=${'tab' + (route.tab === t.id ? ' on' : '')} aria-current=${route.tab === t.id ? 'page' : null} onClick=${() => setRoute({ name: 'tab', tab: t.id })}>
          <${Ico} />${t.label}${badge > 0 && html`<span class="badge">${badge > 99 ? '99+' : badge}</span>`}</button>`;
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

function applyTheme(t) {
  const root = document.documentElement;
  if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
  else root.removeAttribute('data-theme');
}

function Empty({ title, text, onBack }) {
  return html`<div class="wrap stack pad-top center" style="padding-top:48px">
    <h2>${title}</h2><p class="muted">${text}</p><button class="btn ghost" onClick=${onBack}>Indietro</button></div>`;
}

function ReviewHub({ go }) {
  const { course, st } = store;
  const due = dueCount(course, st);
  const fdue = flashDueCount(course, st);
  const total = due + fdue;
  return html`<div class="wrap stack pad-top">
    <div class="stack-sm"><h1>Ripasso</h1><p class="muted">Il ripasso riprende gli argomenti poco prima di dimenticarli: ogni risposta regola quando ricomparirà.</p></div>
    <div class="card hero-today">
      <${Ring} value=${Math.min(total, 30)} max=${30} label=${total} sub="da fare" color=${total ? 'var(--red)' : 'var(--green)'} />
      <div class="stack-sm"><h2>${total ? 'Hai ripassi in sospeso' : 'Tutto in pari'}</h2>
        <p class="small muted">${due} esercizi · ${fdue} schede di teoria</p></div>
    </div>
    <div class="row-wrap">
      <button class="btn" style="flex:1" disabled=${due === 0} onClick=${() => go({ name: 'review' })}><${I.review} /> Ripassa esercizi (${due})</button>
      <button class="btn ghost" style="flex:1" disabled=${fdue === 0} onClick=${() => go({ name: 'flash', kinds: null })}><${I.book} /> Schede (${fdue})</button>
    </div>
    <p class="small faint">Suggerimento: 10 minuti al giorno valgono più di due ore una volta a settimana.</p>
  </div>`;
}

function Profile() {
  const { st, course } = store;
  const sync = store.sync;
  const [snaps, setSnaps] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(null);
  const [text, setText] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const rd = readiness(course, st);
  const refresh = async () => {
    if (!sync) return setSnaps([]);
    setSnaps(await sync.listSnapshots());
  };
  useEffect(() => {
    refresh();
  }, []);
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
    const json = JSON.stringify(exportPayload(st), null, 2);
    setText(json);
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
      refresh();
    } catch (e) {
      store.toast?.('Il testo non è un salvataggio valido');
    }
  };
  const setP = (patch) => store.setProfile(patch);
  const setS = (patch) => store.setSettings(patch);
  const cloudOn = sync?.mode === 'cloud';

  return html`<div class="wrap stack pad-top" style="padding-bottom:40px">
    <h1>Profilo</h1>
    <div class="tiles">
      <div class="tile"><span class="v">${totalXp(st)}</span><span class="k">XP totali</span></div>
      <div class="tile"><span class="v">${streak(st)}</span><span class="k">giorni di fila</span></div>
      <div class="tile"><span class="v">${gradeLabel(rd.grade)}</span><span class="k">voto stimato</span></div>
      <div class="tile"><span class="v">${Math.round(rd.r * 100)}%</span><span class="k">preparazione</span></div>
    </div>

    <section class="card stack" aria-labelledby="sync-h">
      <div class="row"><h2 id="sync-h">Salvataggio</h2><span class="spacer"></span>${syncChip(store.syncStatus)}</div>
      <p class="small muted">${cloudOn
        ? 'I progressi sono salvati nel cloud in tempo reale e si sincronizzano con gli altri tuoi dispositivi. Ogni modifica importante crea un\'istantanea ripristinabile.'
        : 'Il salvataggio su cloud richiede di aprire l\'app da claude.ai con l\'account. Fino ad allora i progressi restano su questo dispositivo, con istantanee locali.'}</p>
      <div class="row-wrap">
        <button class="btn ghost sm" disabled=${busy || !sync} onClick=${async () => { setBusy(true); await sync?.snapshot('Manuale'); setBusy(false); refresh(); store.toast?.('Istantanea creata'); }}><${I.cloud} /> Crea istantanea ora</button>
        <button class="btn ghost sm" onClick=${async () => { await exportNow(); store.toast?.('Salvataggio esportato'); }}><${I.download} /> Esporta</button>
      </div>
    </section>

    <section class="card stack" aria-labelledby="hist-h">
      <h2 id="hist-h"><span class="row" style="gap:8px"><${I.history} /> Cronologia salvataggi</span></h2>
      <p class="small muted">Puoi tornare a qualsiasi stato precedente. Il ripristino salva prima lo stato attuale, quindi non si perde nulla.</p>
      ${snaps === null && html`<p class="small faint">Caricamento…</p>`}
      ${snaps && snaps.length === 0 && html`<p class="small faint">Nessuna istantanea ancora. Ne vengono create automaticamente ogni 20 minuti di studio.</p>`}
      <div class="list">
        ${(snaps || []).slice(0, 40).map((s) => html`<div class="list-item">
          <div class="grow stack-sm" style="gap:2px">
            <b class="small">${new Date(s.at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })} · ${s.reason}</b>
            <span class="small faint">${s.deviceLabel || 'Dispositivo'}${s.where === 'local' ? ' · locale' : ''} · ${s.summary?.xp ?? 0} XP · ${s.summary?.lessons ?? 0} lezioni</span>
          </div>
          ${confirmRestore === s.id
            ? html`<div class="row-wrap"><button class="btn red sm" disabled=${busy} onClick=${() => restore(s)}>Ripristina</button><button class="btn ghost sm" onClick=${() => setConfirmRestore(null)}>No</button></div>`
            : html`<button class="btn ghost sm" onClick=${() => setConfirmRestore(s.id)}>Ripristina</button>`}
        </div>`)}
      </div>
      <details><summary class="small"><b>Importa o esporta come testo</b></summary>
        <div class="stack-sm mt"><textarea class="input" aria-label="Salvataggio in formato JSON" placeholder="Incolla qui un salvataggio esportato" value=${text} onInput=${(e) => setText(e.currentTarget.value)}></textarea>
        <div class="row-wrap"><button class="btn ghost sm" disabled=${!text.trim()} onClick=${importText}><${I.upload} /> Importa questo testo</button></div></div>
      </details>
    </section>

    <section class="card stack">
      <h2>Preferenze</h2>
      <div class="field"><label for="p-name">Nome</label><input id="p-name" class="input" style="font-family:var(--f-body)" value=${st.profile.name} onChange=${(e) => setP({ name: e.currentTarget.value.trim() })} /></div>
      <div class="field"><label for="p-goal">Obiettivo giornaliero</label>
        <select id="p-goal" class="input" style="font-family:var(--f-body)" value=${st.profile.goal} onChange=${(e) => setP({ goal: +e.currentTarget.value })}>
          ${[20, 50, 100, 150].map((g) => html`<option value=${g}>${g} XP al giorno</option>`)}
        </select></div>
      <div class="field"><label for="p-date">Data dell'esame</label><input id="p-date" type="date" class="input" value=${st.profile.examDate} onChange=${(e) => setP({ examDate: e.currentTarget.value })} /></div>
      <div class="field"><label for="p-theme">Tema</label>
        <select id="p-theme" class="input" style="font-family:var(--f-body)" value=${st.settings.theme} onChange=${(e) => setS({ theme: e.currentTarget.value })}>
          <option value="system">Come il sistema</option><option value="light">Chiaro</option><option value="dark">Scuro</option>
        </select></div>
      <label class="row small"><input type="checkbox" checked=${st.settings.sound} onChange=${(e) => { setS({ sound: e.currentTarget.checked }); sound.enabled = e.currentTarget.checked; }} /> Suoni di feedback</label>
      <p class="small faint">Dispositivo: ${deviceLabel()}</p>
    </section>

    ${ai.available ? html`<p class="small faint"><${I.ai} /> Tutor attivo: Claude può correggere le risposte aperte e spiegare gli errori.</p>` : html`<p class="small faint">Il tutor (correzione con Claude) è disponibile quando l'app è aperta da claude.ai.</p>`}

    <section class="card stack">
      <h2>Ricomincia</h2>
      <p class="small muted">Azzera i progressi. L'istantanea precedente resta nella cronologia.</p>
      ${confirmReset
        ? html`<div class="confirm-box"><b>Azzerare tutti i progressi?</b><span class="small">Il contenuto attuale resta nella cronologia e può essere ripristinato.</span>
            <div class="row-wrap"><button class="btn red sm" onClick=${async () => {
              await sync?.restore(emptyState(), 'Prima dell\'azzeramento');
              setConfirmReset(false);
              store.toast?.('Progressi azzerati: lo stato precedente è in cronologia');
              refresh();
            }}>Sì, azzera</button><button class="btn ghost sm" onClick=${() => setConfirmReset(false)}>Annulla</button></div></div>`
        : html`<button class="btn red sm" style="align-self:flex-start" onClick=${() => setConfirmReset(true)}>Azzera i progressi</button>`}
    </section>
  </div>`;
}
