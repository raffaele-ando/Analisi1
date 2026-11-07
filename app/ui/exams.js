// Simulazioni d'esame: temi reali e temi generati con la stessa struttura (Parte A teoria, Parte B esercizi),
// cronometro, consegna, autovalutazione della teoria con rubrica (o Claude), voto e argomenti da ripassare.
import { html, useState, useEffect, useMemo, useRef } from '../vendor/preact-htm.js';
import { store } from '../store.js';
import { Md, Plot, ExerciseInput, OpenInput } from './widgets.js';
import { I } from './icons.js';
import { checkAnswer, answerTex } from '../engine/check.js';
import { tex } from './md.js';
import { instantiate, shuffle } from '../engine/session.js';
import { EXAM_WEIGHT } from '../engine/course.js';
import { uid } from '../engine/state.js';
import { ai } from './ai.js';

const KIND = { appello: 'Appello', itinere1: '1ª prova in itinere', itinere2: '2ª prova in itinere' };
const sumPts = (qs) => qs.reduce((a, q) => a + (q.points || 0), 0);

/** Tema generato con lo schema dei temi reali: 5 domande di teoria + 6 esercizi. */
export function generateExam(course) {
  const opens = [];
  const problems = {};
  const level3 = {};
  for (const sec of course.sections) {
    for (const sk of sec.skills) {
      const pool = [...(sk.practice || []), ...(sk.lessons || []).flatMap((l) => l.cards || [])];
      for (const ex of pool) {
        if (ex.type === 'open') opens.push({ ex, sec: sec.id, sk: sk.id });
        if (ex.type === 'problem' || (ex.type === 'gen' && ex.level === 3)) (problems[sec.id] ||= []).push({ ex, sk: sk.id });
        else if ((ex.level || 0) >= 3 && !['open', 'learn', 'example'].includes(ex.type)) (level3[sec.id] ||= []).push({ ex, sk: sk.id });
      }
    }
  }
  // teoria: privilegia le sezioni con più peso all'esame, senza ripetere la stessa skill
  const usedSk = new Set();
  const A = [];
  for (const o of shuffle(opens).sort((a, b) => (EXAM_WEIGHT[b.sec] || 1) * Math.random() - (EXAM_WEIGHT[a.sec] || 1) * Math.random())) {
    if (usedSk.has(o.sk)) continue;
    usedSk.add(o.sk);
    A.push({ ...o.ex, id: o.ex.id, points: 2, skills: [o.sk] });
    if (A.length === 5) break;
  }
  const slots = [
    [['s09'], 6, 'Studio di funzione'],
    [['s02'], 3, 'Numeri complessi'],
    [['s10', 's06'], 4, 'Limiti e Taylor'],
    [['s12', 's11'], 3, 'Integrali'],
    [['s13', 's14'], 3, 'Serie'],
    [['s15'], 3, 'Geometria'],
  ];
  const B = [];
  for (const [secs, pts, label] of slots) {
    let pick = null;
    for (const s of secs) {
      const pp = problems[s] || [];
      if (pp.length) {
        pick = pp[Math.floor(Math.random() * pp.length)];
        break;
      }
    }
    if (!pick) for (const s of secs) if ((level3[s] || []).length) { pick = level3[s][Math.floor(Math.random() * level3[s].length)]; break; }
    if (!pick) continue;
    let q = instantiate(pick.ex);
    if (!q) continue;
    if (q.type !== 'problem') q = { type: 'problem', id: q.id, prompt: '', parts: [q], solution: q.explain || '' };
    B.push({ ...q, id: pick.ex.id, points: pts, skills: [pick.sk], _label: label });
  }
  return { id: 'gen-' + uid(6), title: 'Tema generato', kind: 'appello', date: new Date().toISOString().slice(0, 10), durationMin: 120, A, B, generated: true };
}

export function ExamsHub({ go }) {
  const { course, st } = store;
  const attempts = Object.values(st.exams || {});
  const inProgress = attempts.filter((a) => !a.done).sort((a, b) => b.t - a.t);
  const best = (examId) => attempts.filter((a) => a.done && a.examId === examId).reduce((m, a) => Math.max(m, a.score), -1);
  return html`<div class="wrap stack pad-top">
    <div class="stack-sm"><h1>Simulazione d'esame</h1>
      <p class="muted">Due ore, come in aula.</p></div>
    <div class="card stack-sm">
      <h3>Tema generato</h3>
      <p class="small muted">Teoria e esercizi dagli argomenti più frequenti. Ogni volta diverso.</p>
      <button class="btn" onClick=${() => go({ name: 'exam', exam: generateExam(course) })}><${I.play} /> Inizia (2 ore)</button>
    </div>
    ${inProgress.length > 0 &&
    html`<div class="stack-sm"><span class="eyebrow">In corso</span>${inProgress.map(
      (a) => html`<div class="card flat row"><div class="grow stack-sm" style="flex:1"><b>${a.title}</b><span class="small faint">Iniziato ${new Date(a.startedAt).toLocaleString('it-IT')}</span></div>
        <button class="btn sm" onClick=${() => go({ name: 'exam', resume: a.id })}>Riprendi</button></div>`,
    )}</div>`}
    <div class="stack-sm"><span class="eyebrow">Temi reali (${course.exams.length})</span>
      ${course.exams.length === 0 && html`<p class="small faint">I temi reali non sono ancora disponibili in questa versione.</p>`}
      <div class="list">${course.exams.map((ex) => {
        const b = best(ex.id);
        const tot = sumPts(ex.A || []) + sumPts(ex.B || []);
        return html`<div class="list-item">
          <div class="grow"><b>${ex.title}</b><div class="small faint">${KIND[ex.kind] || 'Prova'} · ${ex.durationMin || 120} min · ${tot} punti</div></div>
          ${b >= 0 && html`<span class=${'chip ' + (b >= 18 ? 'green' : 'red')}>${Math.round(b * 10) / 10}</span>`}
          <button class="btn sm ghost" onClick=${() => go({ name: 'exam', exam: ex })}>Svolgi</button>
        </div>`;
      })}</div>
    </div>
  </div>`;
}

function fmtTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function ExamRunner({ exam: examProp, resume, onExit, go }) {
  const saved = resume ? store.st.exams[resume] : null;
  const exam = useMemo(() => saved?.exam || examProp, []);
  const [att, setAtt] = useState(() => saved || { id: 'att-' + uid(8), examId: exam.id, title: exam.title, exam: exam.generated ? exam : undefined, startedAt: Date.now(), durationMin: exam.durationMin || 120, answers: {}, phase: 'write', done: false, t: Date.now() });
  const [tab, setTab] = useState('A');
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const saveT = useRef(null);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const persist = (a) => {
    setAtt(a);
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => store.saveExam({ ...a, t: Date.now() }), 1200);
  };
  const remaining = att.startedAt + att.durationMin * 60000 - now;
  const setAns = (qid, v) => persist({ ...att, answers: { ...att.answers, [qid]: v } });
  const qs = { A: exam.A || [], B: exam.B || [] };

  const submit = () => {
    const graded = {};
    for (const part of ['A', 'B']) {
      for (const q of qs[part]) {
        if (q.type === 'open') continue;
        const v = att.answers[q.id];
        let r;
        if (q.type === 'problem') {
          const rs = q.parts.map((p, i) => checkAnswer(p, (v || [])[i]));
          r = { score: rs.reduce((a, x) => a + (x.score ?? (x.ok ? 1 : 0)), 0) / rs.length };
        } else r = checkAnswer(q, v);
        graded[q.id] = r.score ?? (r.ok ? 1 : 0);
      }
    }
    persist({ ...att, graded, phase: 'review', submittedAt: Date.now() });
    setConfirm(false);
    setTab('A');
    window.scrollTo?.(0, 0);
  };

  const finalize = () => {
    const graded = { ...att.graded };
    for (const part of ['A', 'B']) for (const q of qs[part]) if (q.type === 'open') graded[q.id] = att.answers[q.id]?.score ?? 0;
    const pts = (part) => qs[part].reduce((a, q) => a + (q.points || 0) * (graded[q.id] || 0), 0);
    const sA = pts('A');
    const sB = pts('B');
    const maxA = sumPts(qs.A);
    const maxB = sumPts(qs.B);
    const scale = 32 / Math.max(1, maxA + maxB);
    for (const part of ['A', 'B']) {
      for (const q of qs[part]) {
        const s = graded[q.id] || 0;
        store.answer({ ex: q, skillId: (q.skills || [])[0], ok: s >= 0.7, score: s, srs: !exam.generated });
      }
    }
    const res = { ...att, graded, phase: 'result', done: true, scoreA: sA, scoreB: sB, maxA, maxB, score: Math.round((sA + sB) * scale * 10) / 10, max: 32, t: Date.now() };
    clearTimeout(saveT.current);
    setAtt(res);
    store.saveExam(res);
    window.scrollTo?.(0, 0);
  };

  if (att.phase === 'result') return html`<${ExamResult} att=${att} exam=${exam} onExit=${onExit} go=${go} />`;

  const review = att.phase === 'review';
  const openPending = review && [...qs.A, ...qs.B].some((q) => q.type === 'open' && !att.answers[q.id]?.revealed);
  return html`<div class="player">
    <div class="player-top"><div class="wrap">
      <button class="x-btn" aria-label="Esci" onClick=${() => (!review && Object.keys(att.answers || {}).length ? setLeaving(true) : onExit())}><${I.x} /></button>
      <b style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${exam.title}</b>
      ${!review && html`<span class=${'chip ' + (remaining < 10 * 60000 ? 'red' : 'blue')}><${I.clock} /> ${remaining > 0 ? fmtTime(remaining) : 'Tempo scaduto'}</span>`}
      ${review && html`<span class="chip hl">Correzione</span>`}
    </div></div>
    ${leaving && html`<div class="wrap"><div class="confirm-box" role="alertdialog" aria-label="Uscire dalla prova">
      <b>Uscire dalla prova?</b><span class="small">Le risposte sono salvate: potrai riprendere la prova dalla sezione Esami.</span>
      <div class="row-wrap"><button class="btn ghost sm" onClick=${onExit}>Esci</button><button class="btn sm" onClick=${() => setLeaving(false)}>Continua la prova</button></div>
    </div></div>`}
    <div class="wrap stack" style="padding-bottom:160px">
      ${review && html`<div class="callout">Consegnato. Gli esercizi sono corretti in automatico. Per ogni domanda di teoria apri la risposta modello e spunta i criteri che hai soddisfatto${ai.available ? ', oppure chiedi la correzione a Claude' : ''}.</div>`}
      ${!review && remaining <= 0 && html`<div class="callout warn">Tempo scaduto: all'esame dovresti consegnare ora.</div>`}
      <div class="seg">${['A', 'B'].map((p) => html`<button class=${tab === p ? 'on' : ''} onClick=${() => setTab(p)}>Parte ${p} · ${sumPts(qs[p])} pt</button>`)}</div>
      ${qs[tab].map((q, n) => html`<${ExamQuestion} q=${q} n=${n + 1} value=${att.answers[q.id]} onChange=${(v) => setAns(q.id, v)} review=${review} score=${att.graded?.[q.id]} />`)}
    </div>
    <div class="footer-check"><div class="wrap">
      ${!review && !confirm && html`<button class="btn block" onClick=${() => setConfirm(true)}>Consegna</button>`}
      ${!review && confirm && html`<div class="stack-sm"><b>Consegnare il compito?</b><span class="small muted">Dopo la consegna non potrai più modificare le risposte.</span>
        <div class="row-wrap"><button class="btn" style="flex:1" onClick=${submit}>Consegna</button><button class="btn ghost" style="flex:1" onClick=${() => setConfirm(false)}>Continua a scrivere</button></div></div>`}
      ${review && html`<button class="btn block" disabled=${openPending} onClick=${finalize}>${openPending ? 'Correggi tutte le domande di teoria' : 'Calcola il voto'}</button>`}
    </div></div>
  </div>`;
}

function ExamQuestion({ q, n, value, onChange, review, score }) {
  const head = html`<div class="row"><span class="eyebrow">${q._label || (q.type === 'problem' ? 'Esercizio' : 'Domanda')} ${n}</span><span class="spacer"></span>
    ${review && q.type !== 'open' && score != null && html`<span class=${'chip ' + (score >= 0.99 ? 'green' : score > 0 ? 'hl' : 'red')}>${Math.round(score * (q.points || 0) * 10) / 10}/${q.points}</span>`}
    ${!review || q.type === 'open' ? html`<span class="chip">${q.points} pt</span>` : ''}</div>`;
  if (q.type === 'open') {
    if (!review)
      return html`<div class="card stack-sm">${head}<${Md} text=${q.prompt} />
        <textarea class="input" placeholder="Scrivi la risposta come sul foglio protocollo…" value=${value?.text || ''} onInput=${(e) => onChange({ ...(value || {}), text: e.currentTarget.value })}></textarea></div>`;
    return html`<div class="card stack-sm">${head}<${Md} text=${q.prompt} /><${OpenInput} ex=${q} value=${value || { text: '' }} onChange=${onChange} locked=${false} ai=${ai} /></div>`;
  }
  if (q.type === 'problem') {
    const vals = value || q.parts.map(() => undefined);
    return html`<div class="card stack">${head}${q.prompt && html`<${Md} text=${q.prompt} />`}<${Plot} spec=${q.plot} />
      ${q.parts.map((p, i) => {
        const r = review ? checkAnswer(p, vals[i]) : null;
        return html`<div class="stack-sm" style=${r ? `border-left:4px solid ${r.ok ? 'var(--success)' : 'var(--danger)'};padding-left:12px` : ''}>
          <${Md} text=${p.prompt} />
          <${ExerciseInput} ex=${p} value=${vals[i]} locked=${review} onChange=${(v) => {
            const nv = vals.slice();
            nv[i] = v;
            onChange(nv);
          }} />
          ${r && !r.ok && answerTex(p) && html`<p class="small">Risposta attesa: <span dangerouslySetInnerHTML=${{ __html: tex(answerTex(p)) }}></span></p>`}
        </div>`;
      })}
      ${review && q.solution && html`<details class="card flat"><summary><b>Soluzione completa</b></summary><div class="mt"><${Md} text=${q.solution} /></div></details>`}
    </div>`;
  }
  return html`<div class="card stack-sm">${head}<${Md} text=${q.prompt} /><${Plot} spec=${q.plot} />
    <${ExerciseInput} ex=${q} value=${value} onChange=${onChange} locked=${review} />
    ${review && q.explain && html`<${Md} class="small" text=${q.explain} />`}</div>`;
}

function ExamResult({ att, exam, onExit, go }) {
  const passA = att.scoreA >= att.maxA / 2;
  const total = att.score;
  const pass = passA && total >= 18;
  const label = !pass ? 'Non superato' : total >= 31 ? '30 e lode' : String(Math.min(30, Math.round(total)));
  const weak = [];
  for (const q of [...(exam.A || []), ...(exam.B || [])]) if ((att.graded[q.id] || 0) < 0.7) for (const s of q.skills || []) if (!weak.includes(s) && store.course.skills.has(s)) weak.push(s);
  return html`<div class="wrap stack pad-top" style="padding-bottom:60px">
    <p class="eyebrow">${exam.title}</p>
    <h1>${label}</h1>
    <div class="tiles">
      <div class="tile"><span class="v">${Math.round(att.scoreA * 10) / 10}<span class="faint" style="font-size:1rem">/${att.maxA}</span></span><span class="k">Parte A · teoria ${passA ? '' : '(sotto soglia)'}</span></div>
      <div class="tile"><span class="v">${Math.round(att.scoreB * 10) / 10}<span class="faint" style="font-size:1rem">/${att.maxB}</span></span><span class="k">Parte B · esercizi</span></div>
      <div class="tile"><span class="v" style=${`color:${pass ? 'var(--success)' : 'var(--danger)'}`}>${total}<span class="faint" style="font-size:1rem">/32</span></span><span class="k">Totale in trentaduesimi</span></div>
    </div>
    <p class="muted small">Soglie usate: almeno metà dei punti di teoria e almeno 18 in totale; sopra 30 è lode. Sono le regole della presentazione del corso; il docente può chiedere un orale.</p>
    ${weak.length > 0 &&
    html`<div class="stack-sm"><h3>Da ripassare</h3><div class="list">${weak.map((s) => {
      const sk = store.course.skills.get(s);
      return html`<div class="list-item"><div class="grow"><b>${sk.title}</b><div class="small faint">${store.course.sectionOf.get(s).title}</div></div>
        <button class="btn sm" onClick=${() => go({ name: 'practice', skillId: s })}>Allenati</button></div>`;
    })}</div></div>`}
    <button class="btn block" onClick=${onExit}>Torna alle simulazioni</button>
  </div>`;
}
