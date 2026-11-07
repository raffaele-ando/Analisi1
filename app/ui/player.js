// Player delle sessioni: lezioni, ripasso, pratica, test di salto.
// Ciclo per ogni esercizio: rispondi → Verifica → feedback elaborato → Continua.
// Gli errori di una lezione tornano in coda alla fine (una volta) per un secondo tentativo.
import { html, useState, useEffect, useRef, useMemo } from '../vendor/preact-htm.js';
import { checkAnswer, answerTex } from '../engine/check.js';
import { tex } from './md.js';
import { Md, Plot, ExerciseInput, canCheck } from './widgets.js';
import { I } from './icons.js';
import { store } from '../store.js';
import { sound } from './sound.js';
import { ai } from './ai.js';

const PRAISE = ['Esatto!', 'Perfetto!', 'Giusto!', 'Ottimo lavoro!', 'Proprio così!', 'Bravo, avanti così!'];
const TYPE_LABEL = {
  mcq: 'Scelta multipla', tf: 'Vero o falso', num: 'Calcola', expr: 'Scrivi l\'espressione', interval: 'Insieme / intervallo', tuple: 'Componenti',
  set: 'Soluzioni', order: 'Ricostruisci il ragionamento', cloze: 'Completa', match: 'Abbina', open: 'Teoria · risposta aperta', problem: 'Esercizio d\'esame',
  learn: 'Teoria', example: 'Esempio svolto',
};

function gradeEx(ex, value) {
  if (ex.type === 'problem') {
    const results = ex.parts.map((p, i) => checkAnswer(p, (value || [])[i]));
    const score = results.reduce((a, r) => a + (r.score ?? (r.ok ? 1 : 0)), 0) / results.length;
    return { ok: results.every((r) => r.ok), score, parts: results };
  }
  return checkAnswer(ex, value);
}

function problemReady(ex, value) {
  return ex.parts.every((p, i) => canCheck(p, (value || [])[i]));
}

export function Player({ title, cards, mode = 'lesson', skillId, lessonId, onExit, onDone }) {
  const [queue, setQueue] = useState(() => cards.slice());
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState(undefined);
  const [result, setResult] = useState(null);
  const [hinted, setHinted] = useState(false);
  const [step, setStep] = useState(1);
  const [askOk, setAskOk] = useState({});
  const [stats, setStats] = useState({ correct: 0, total: 0, xp: 0, firstTry: 0 });
  const [finished, setFinished] = useState(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [explain, setExplain] = useState(null);
  const t0 = useRef(Date.now());
  const started = useRef(Date.now());
  const card = queue[idx];
  const isTheory = card && (card.type === 'learn' || card.type === 'example');
  const exerciseTotal = useMemo(() => cards.filter((c) => c.type !== 'learn' && c.type !== 'example').length, [cards]);

  useEffect(() => {
    t0.current = Date.now();
    setValue(undefined);
    setResult(null);
    setHinted(false);
    setStep(1);
    setAskOk({});
    setExplain(null);
    window.scrollTo?.(0, 0);
  }, [idx, queue]);

  const skill = card?._skill || skillId;

  const check = () => {
    if (!card || result) return;
    const r = gradeEx(card, value);
    const ms = Date.now() - t0.current;
    const xp = store.answer({ ex: card, skillId: skill, ok: r.ok, score: r.score, ms, hinted, retry: !!card._retry });
    setResult({ ...r, xp, praise: PRAISE[Math.floor(Math.random() * PRAISE.length)] });
    setStats((s) => ({ correct: s.correct + (r.ok ? 1 : 0), total: s.total + 1, xp: s.xp + xp, firstTry: s.firstTry + (r.ok && !card._retry ? 1 : 0) }));
    if (r.ok) sound.ok();
    else sound.ko();
    if (!r.ok && mode === 'lesson' && !card._retry) setQueue((q) => [...q, { ...card, _retry: true }]);
  };

  const next = () => {
    if (idx + 1 < queue.length) setIdx(idx + 1);
    else finish();
  };

  const finish = () => {
    let bonus = 0;
    const perfect = stats.firstTry === exerciseTotal;
    if (mode === 'lesson' && skillId && lessonId) bonus = store.completeLesson(skillId, lessonId, { perfect });
    sound.done();
    setFinished({ bonus, perfect, secs: Math.round((Date.now() - started.current) / 1000) });
  };

  // Invio = Verifica / Continua
  useEffect(() => {
    const h = (e) => {
      if (e.key !== 'Enter' || e.shiftKey || finished || confirmExit) return;
      if (e.target?.tagName === 'TEXTAREA') return;
      if (e.target?.tagName === 'BUTTON') return;
      if (isTheory) return;
      if (result) next();
      else if (card && (card.type === 'problem' ? problemReady(card, value) : canCheck(card, value))) check();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  if (finished) return html`<${Summary} title=${title} stats=${stats} finished=${finished} mode=${mode} onClose=${() => onDone?.({ ...stats, ...finished })} />`;
  if (!card) return html`<div class="wrap pad-top stack"><p>Nessun esercizio disponibile qui per ora.</p><button class="btn" onClick=${onExit}>Torna indietro</button></div>`;

  const progress = Math.min(1, idx / Math.max(1, queue.length));
  const ready = card.type === 'problem' ? problemReady(card, value) : canCheck(card, value);
  const locked = !!result;

  return html`<div class="player">
    <div class="player-top"><div class="wrap">
      <button class="x-btn" aria-label="Esci" onClick=${() => (stats.total > 0 && mode === 'lesson' ? setConfirmExit(true) : onExit())}><${I.x} /></button>
      <div class="bar blue" style="flex:1" role="progressbar" aria-valuenow=${Math.round(progress * 100)}><i style=${`width:${progress * 100}%`}></i></div>
      <span class="stat bolt small"><${I.bolt} />${stats.xp}</span>
    </div></div>
    ${confirmExit &&
    html`<div class="wrap"><div class="confirm-box">
      <b>Vuoi uscire dalla lezione?</b><span class="small">Le risposte date restano salvate, ma la lezione non risulterà completata.</span>
      <div class="row-wrap"><button class="btn red sm" onClick=${onExit}>Esci</button><button class="btn ghost sm" onClick=${() => setConfirmExit(false)}>Continua la lezione</button></div>
    </div></div>`}
    <div class="player-body"><div class="wrap stack">
      <div class="row-wrap" style="align-items:center">
        <span class="kind">${card._retry ? 'Riprova · ' : ''}${TYPE_LABEL[card.type] || ''}</span>
        ${card.level === 3 && html`<span class="chip hl">Livello esame</span>`}
        ${card.source && html`<span class="src">${card.source}</span>`}
      </div>
      ${card.type === 'learn' && html`<${LearnCard} card=${card} />`}
      ${card.type === 'example' && html`<${ExampleCard} card=${card} step=${step} askOk=${askOk} setAskOk=${setAskOk} skillId=${skill} />`}
      ${!isTheory && card.type !== 'problem' &&
      html`<div class="stack">
        ${card.prompt && html`<${Md} class="qtitle-md" text=${card.prompt} />`}
        <${Plot} spec=${card.plot} />
        <${ExerciseInput} ex=${card} value=${value} onChange=${setValue} locked=${locked} result=${result} ai=${ai} onEnter=${() => (result ? next() : ready && check())} />
        ${card.hint && !locked && (hinted ? html`<div class="callout"><${Md} text=${card.hint} /></div>` : html`<button class="btn quiet" onClick=${() => setHinted(true)}>Mostra un suggerimento</button>`)}
      </div>`}
      ${card.type === 'problem' && html`<${ProblemCard} card=${card} value=${value} setValue=${setValue} result=${result} />`}
    </div></div>
    ${isTheory
      ? html`<${TheoryFooter} card=${card} step=${step} setStep=${setStep} askOk=${askOk} onNext=${next} />`
      : html`<${CheckFooter} card=${card} ready=${ready} result=${result} onCheck=${check} onNext=${next} explain=${explain} setExplain=${setExplain} value=${value} />`}
  </div>`;
}

function LearnCard({ card }) {
  return html`<div class="stack">
    ${card.title && html`<h2>${card.title}</h2>`}
    <${Md} text=${card.body} />
    <${Plot} spec=${card.plot} />
  </div>`;
}

function ExampleCard({ card, step, askOk, setAskOk, skillId }) {
  const steps = card.steps || [];
  const shown = steps.slice(0, step);
  return html`<div class="stack">
    <h2>${card.title || 'Esempio svolto'}</h2>
    <div class="card flat tint"><${Md} text=${card.problem} /></div>
    <${Plot} spec=${card.plot} />
    <div class="steps">
      ${shown.map((s, i) => {
        const text = typeof s === 'string' ? s : s.text;
        const ask = typeof s === 'object' && s.ask;
        if (ask && !askOk[i]) return html`<${AskBlock} key=${i} ex=${ask} skillId=${skillId} onDone=${() => setAskOk({ ...askOk, [i]: true })} />`;
        return html`<div class="step"><span class="dot">${i + 1}</span><${Md} text=${text} /></div>`;
      })}
    </div>
    ${step >= steps.length && card.result && (steps.every((s, i) => typeof s === 'string' || !s.ask || askOk[i])) && html`<div class="callout thm"><${Md} text=${card.result} /></div>`}
  </div>`;
}

/** Passo "a completamento" dentro un esempio svolto (worked-example fading). */
function AskBlock({ ex, onDone, skillId }) {
  const [value, setValue] = useState(undefined);
  const [res, setRes] = useState(null);
  const ok = res?.ok;
  return html`<div class="card flat stack-sm" style="border-color:var(--blue)">
    <span class="kind">Completa tu questo passo</span>
    <${Md} text=${ex.prompt} />
    <${ExerciseInput} ex=${ex} value=${value} onChange=${setValue} locked=${!!res} />
    ${!res && html`<button class="btn sm" disabled=${!canCheck(ex, value)} onClick=${() => {
      const r = checkAnswer(ex, value);
      setRes(r);
      store.answer({ ex, skillId, ok: r.ok, score: r.score, srs: false });
      r.ok ? sound.ok() : sound.ko();
    }}>Verifica</button>`}
    ${res && html`<div class=${'callout' + (ok ? '' : ' warn')}>
      <b>${ok ? 'Giusto.' : 'Non proprio.'}</b> ${!ok && answerTex(ex) ? html`Risposta: <span dangerouslySetInnerHTML=${{ __html: tex(answerTex(ex)) }}></span>` : ''}
      ${ex.explain && html`<${Md} text=${ex.explain} />`}
    </div>
    <button class="btn sm green" onClick=${onDone}>Mostra il passo</button>`}
  </div>`;
}

function ProblemCard({ card, value, setValue, result }) {
  const vals = value || card.parts.map(() => undefined);
  return html`<div class="stack">
    <div class="card flat"><${Md} text=${card.prompt} /></div>
    <${Plot} spec=${card.plot} />
    ${card.parts.map((p, i) => {
      const r = result?.parts?.[i];
      return html`<div class="stack-sm" style=${r ? `border-left:4px solid ${r.ok ? 'var(--green)' : 'var(--red)'};padding-left:12px` : ''}>
        <span class="eyebrow">Domanda ${i + 1} di ${card.parts.length}</span>
        <${Md} text=${p.prompt} />
        <${ExerciseInput} ex=${p} value=${vals[i]} locked=${!!result} onChange=${(v) => {
          const nv = vals.slice();
          nv[i] = v;
          setValue(nv);
        }} />
        ${r && !r.ok && answerTex(p) && html`<p class="small">Risposta attesa: <span dangerouslySetInnerHTML=${{ __html: tex(answerTex(p)) }}></span></p>`}
        ${r && p.explain && html`<${Md} class="small" text=${p.explain} />`}
      </div>`;
    })}
    ${result && card.solution && html`<details class="card flat" open><summary><b>Soluzione completa</b></summary><div class="mt"><${Md} text=${card.solution} /></div></details>`}
  </div>`;
}

function TheoryFooter({ card, step, setStep, askOk, onNext }) {
  if (card.type === 'example') {
    const steps = card.steps || [];
    const pendingAsk = steps.slice(0, step).some((s, i) => typeof s === 'object' && s.ask && !askOk[i]);
    const more = step < steps.length;
    return html`<div class="footer-check"><div class="wrap">
      ${more
        ? html`<button class="btn block" disabled=${pendingAsk} onClick=${() => setStep(step + 1)}>${pendingAsk ? 'Completa il passo per continuare' : 'Passo successivo'}</button>`
        : html`<button class="btn block green" disabled=${pendingAsk} onClick=${onNext}>Ho capito, continua</button>`}
    </div></div>`;
  }
  return html`<div class="footer-check"><div class="wrap"><button class="btn block" onClick=${onNext} autofocus>Continua</button></div></div>`;
}

function CheckFooter({ card, ready, result, onCheck, onNext, explain, setExplain, value }) {
  if (!result)
    return html`<div class="footer-check"><div class="wrap">
      <button class="btn block green" disabled=${!ready} onClick=${onCheck}>Verifica</button>
    </div></div>`;
  const ok = result.ok;
  const ans = !ok && card.type !== 'problem' ? answerTex(card) : '';
  const askAi = async () => {
    setExplain({ busy: true });
    try {
      setExplain({ text: await ai.explain(card, value) });
    } catch (e) {
      setExplain({ error: e?.message || 'Spiegazione non disponibile ora.' });
    }
  };
  return html`<div class=${'footer-check ' + (ok ? 'ok' : 'ko')} role="status"><div class="wrap">
    <div class="fb-head">${ok ? html`<${I.check} />` : html`<${I.x} />`}<span>${ok ? result.praise : card.type === 'open' ? 'Da ripassare' : result.score > 0 ? 'Quasi: rivedi i passaggi' : 'Non è corretto'}</span>
      <span class="spacer"></span><span class="stat bolt small"><${I.bolt} />+${result.xp}</span></div>
    <div class="fb-body stack-sm">
      ${result.feedback && html`<p class="small">${result.feedback}</p>`}
      ${ans && html`<p>Risposta corretta: <span dangerouslySetInnerHTML=${{ __html: tex(ans) }}></span></p>`}
      ${card.explain && html`<${Md} text=${card.explain} />`}
      ${explain?.text && html`<div class="card flat stack-sm"><p class="eyebrow">Claude spiega</p><${Md} text=${explain.text} /></div>`}
      ${explain?.error && html`<p class="small">${explain.error}</p>`}
      ${!ok && ai.available && !explain?.text && html`<button class="btn quiet" disabled=${explain?.busy} onClick=${askAi}><${I.ai} /> ${explain?.busy ? 'Sto scrivendo…' : 'Spiegamelo in un altro modo'}</button>`}
    </div>
    <button class=${'btn block ' + (ok ? 'green' : 'red')} onClick=${onNext} autofocus>Continua</button>
  </div></div>`;
}

function Summary({ title, stats, finished, mode, onClose }) {
  const acc = stats.total ? Math.round((stats.correct / stats.total) * 100) : 100;
  return html`<div class="wrap pad-top stack" style="padding-bottom:120px">
    <div class="center stack-sm" style="padding-top:24px">
      <p class="eyebrow">${mode === 'lesson' ? 'Lezione completata' : mode === 'testout' ? 'Test terminato' : 'Sessione completata'}</p>
      <h1>${title}</h1>
      ${finished.perfect && mode === 'lesson' && html`<p><span class="chip hl"><${I.star} /> Lezione perfetta</span></p>`}
    </div>
    <div class="tiles">
      <div class="tile"><span class="v" style="color:var(--blue)">+${stats.xp + finished.bonus}</span><span class="k">XP guadagnati</span></div>
      <div class="tile"><span class="v" style=${`color:${acc >= 80 ? 'var(--green)' : acc >= 50 ? 'var(--flame)' : 'var(--red)'}`}>${acc}%</span><span class="k">Precisione</span></div>
      <div class="tile"><span class="v">${Math.floor(finished.secs / 60)}:${String(finished.secs % 60).padStart(2, '0')}</span><span class="k">Tempo</span></div>
    </div>
    <p class="muted small">${acc >= 90 ? 'Ottimo: gli esercizi torneranno tra qualche giorno, quando starai per dimenticarli.' : acc >= 60 ? 'Bene. Gli errori torneranno presto nel ripasso: è lì che si consolida la memoria.' : 'Sbagliare adesso aiuta a ricordare dopo. Rileggi le spiegazioni e ripeti la lezione o fai un ripasso.'}</p>
    <div class="footer-check"><div class="wrap"><button class="btn block" onClick=${onClose} autofocus>Continua</button></div></div>
  </div>`;
}
