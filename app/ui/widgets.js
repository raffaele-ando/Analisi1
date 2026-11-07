// Widget degli esercizi. Ogni widget riceve { ex, value, onChange, locked, result }
// e produce la risposta nel formato atteso da engine/check.js.
import { html, useState, useMemo, useRef, useEffect } from '../vendor/preact-htm.js';
import { md, tex } from './md.js';
import { plotSVG } from './plot.js';
import { toTex, parses, normalize } from '../engine/check.js';
import { I } from './icons.js';

export function Md({ text, class: cls = '' }) {
  if (!text) return null;
  return html`<div class=${'md ' + cls} dangerouslySetInnerHTML=${{ __html: md(text) }}></div>`;
}

export function Plot({ spec }) {
  const svg = useMemo(() => {
    try {
      return plotSVG(spec);
    } catch (e) {
      return '';
    }
  }, [spec]);
  if (!spec || !svg) return null;
  return html`<div dangerouslySetInnerHTML=${{ __html: svg }}></div>`;
}

function shuffled(n, seedKey) {
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

const LETTERS = 'ABCDEFGH';

export function McqInput({ ex, value, onChange, locked, result }) {
  const perm = useMemo(() => (ex.noShuffle ? [...ex.options.keys()] : shuffled(ex.options.length)), [ex]);
  const multi = Array.isArray(ex.answer);
  const sel = multi ? value || [] : value;
  const isSel = (i) => (multi ? sel.includes(i) : sel === i);
  const toggle = (i) => {
    if (locked) return;
    if (multi) onChange(isSel(i) ? sel.filter((x) => x !== i) : [...sel, i]);
    else onChange(i);
  };
  const correct = (i) => (multi ? ex.answer.includes(i) : ex.answer === i);
  return html`<div class="options" role=${multi ? 'group' : 'radiogroup'}>
    ${multi && html`<p class="small faint">Più risposte corrette: selezionale tutte.</p>`}
    ${perm.map((i, k) => {
      let cls = 'opt';
      if (locked) {
        if (correct(i)) cls += ' right';
        else if (isSel(i)) cls += ' wrong';
      } else if (isSel(i)) cls += ' sel';
      return html`<button class=${cls} disabled=${locked} onClick=${() => toggle(i)} aria-pressed=${isSel(i)}>
        <span class="k">${LETTERS[k]}</span><${Md} text=${ex.options[i]} />
      </button>`;
    })}
  </div>`;
}

export function TfInput({ ex, value, onChange, locked }) {
  const b = (v, label) => {
    let cls = 'opt';
    if (locked) {
      if (ex.answer === v) cls += ' right';
      else if (value === v) cls += ' wrong';
    } else if (value === v) cls += ' sel';
    return html`<button class=${cls} disabled=${locked} onClick=${() => onChange(v)}>${label}</button>`;
  };
  return html`<div class="tf">${b(true, 'Vero')}${b(false, 'Falso')}</div>`;
}

const KEYS_EXPR = ['x', '^', '(', ')', '/', '√', 'π', 'e', 'sin', 'cos', 'log', 'arctan', '|'];
const KEYS_NUM = ['/', '√', 'π', 'e', '^', '(', ')', 'log', '∞', '-'];
const KEYS_SET = ['i', ';', '√', '/', '^', '(', ')', 'π', '-'];
const KEYS_INT = ['(', ')', '[', ']', ',', 'U', '-inf', '+inf', '/', '√', 'R'];

/** Campo per espressioni con tastierino e anteprima LaTeX di ciò che è stato capito. */
export function MathInput({ value = '', onChange, locked, keys = KEYS_EXPR, placeholder = 'Scrivi qui…', id, preview = true, onEnter }) {
  const ref = useRef();
  const insert = (k) => {
    const el = ref.current;
    const ins = k === '√' ? '√(' : ['sin', 'cos', 'log', 'arctan'].includes(k) ? k + '(' : k === '|' ? '|' : k;
    const s = el ? el.selectionStart : value.length;
    const e = el ? el.selectionEnd : value.length;
    const next = value.slice(0, s) + ins + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.selectionStart = el.selectionEnd = s + ins.length;
    });
  };
  let prev = null;
  if (preview && value.trim()) {
    const parts = value.split(';').map((p) => p.trim()).filter(Boolean);
    const ok = parts.every((p) => parses(p));
    prev = ok ? parts.map((p) => toTex(p) || p).join(';\\quad ') : null;
  }
  return html`<div class="math-in">
    <input id=${id} ref=${ref} class="input" value=${value} disabled=${locked} placeholder=${placeholder} autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text"
      onInput=${(e) => onChange(e.currentTarget.value)} onKeyDown=${(e) => e.key === 'Enter' && onEnter?.()} />
    ${preview && value.trim() &&
    html`<div class=${'preview' + (prev ? '' : ' bad')} aria-live="polite">${prev ? html`<span dangerouslySetInnerHTML=${{ __html: tex(prev) }}></span>` : 'Espressione incompleta o non valida'}</div>`}
    ${!locked && html`<div class="keys">${keys.map((k) => html`<button type="button" onClick=${() => insert(k)}>${k}</button>`)}</div>`}
  </div>`;
}

export function NumInput(p) {
  return html`<${MathInput} ...${p} keys=${KEYS_NUM} placeholder="es. 3/4, √2/2, 2ln2, inf" />`;
}
export function ExprInput(p) {
  const vars = p.ex.vars || ['x'];
  const keys = [...vars.filter((v) => v !== 'x'), ...KEYS_EXPR];
  return html`<${MathInput} ...${p} keys=${keys} placeholder=${'es. e^x(x^2+1), ln(1+x)/x'} />`;
}
export function SetInput(p) {
  return html`<div class="stack-sm"><p class="small faint">Separa le soluzioni con <b>;</b> — es. <code>1+2i; -i; √3/2</code></p><${MathInput} ...${p} keys=${KEYS_SET} placeholder="es. 1; -i" /></div>`;
}
export function IntervalInput(p) {
  return html`<div class="stack-sm"><p class="small faint">Intervalli come <code>(a,b]</code>, unione con <b>U</b>, <code>R</code> per tutto ℝ, <code>vuoto</code> per ∅.</p><${MathInput} ...${p} keys=${KEYS_INT} preview=${false} placeholder="es. (-inf,1)U[2,+inf)" /></div>`;
}

export function TupleInput({ ex, value, onChange, locked, onEnter }) {
  const n = ex.answer.length;
  const labels = ex.labels || (n === 3 ? ['x', 'y', 'z'] : n === 4 ? ['a', 'b', 'c', 'd'] : [...Array(n)].map((_, i) => `#${i + 1}`));
  const vals = value || Array(n).fill('');
  return html`<div class="stack-sm">
    ${ex.proportional && html`<p class="small faint">Va bene qualunque multiplo non nullo (es. i coefficienti di un piano).</p>`}
    <div class="tuple-in">
      ${labels.map(
        (l, i) => html`<div class="field"><label for=${'t' + i}>${l}</label>
          <input id=${'t' + i} class="input" value=${vals[i]} disabled=${locked} autocomplete="off" autocapitalize="off" spellcheck="false"
            onInput=${(e) => {
              const v = vals.slice();
              v[i] = e.currentTarget.value;
              onChange(v);
            }} onKeyDown=${(e) => e.key === 'Enter' && onEnter?.()} /></div>`,
      )}
    </div>
  </div>`;
}

/** Riordino dei passi (dimostrazioni tipo Parsons), con eventuali passi-distrattori da scartare. */
export function OrderInput({ ex, value, onChange, locked }) {
  const pool = useMemo(() => {
    const all = ex.steps.map((s, i) => ({ k: i, s })).concat((ex.distractors || []).map((s, j) => ({ k: -1 - j, s })));
    return shuffled(all.length).map((i) => all[i]);
  }, [ex]);
  const chosen = value || [];
  const remaining = pool.filter((p) => !chosen.includes(p.k));
  const text = (k) => (k >= 0 ? ex.steps[k] : ex.distractors[-1 - k]);
  const move = (i, d) => {
    const c = chosen.slice();
    const j = i + d;
    if (j < 0 || j >= c.length) return;
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  };
  return html`<div class="stack">
    <div class="order-list" aria-label="La tua sequenza">
      ${chosen.length === 0 && html`<p class="small faint">Tocca i passi qui sotto nell'ordine giusto.${ex.distractors?.length ? ' Attenzione: alcuni passi sono sbagliati e vanno lasciati fuori.' : ''}</p>`}
      ${chosen.map((k, i) => {
        const bad = locked && k !== i;
        return html`<div class="order-item" style=${bad ? 'border-color:var(--red)' : locked ? 'border-color:var(--green)' : ''}>
          <span class="num">${i + 1}</span><${Md} text=${text(k)} />
          ${!locked &&
          html`<div class="ctl">
            <button aria-label="Su" onClick=${() => move(i, -1)}><${I.up} /></button>
            <button aria-label="Giù" onClick=${() => move(i, 1)}><${I.down} /></button>
            <button aria-label="Togli" onClick=${() => onChange(chosen.filter((x) => x !== k))}><${I.x} /></button>
          </div>`}
        </div>`;
      })}
    </div>
    ${!locked && remaining.length > 0 &&
    html`<div class="bank">${remaining.map((p) => html`<button class="opt" onClick=${() => onChange([...chosen, p.k])}><${Md} text=${p.s} /></button>`)}</div>`}
    ${locked &&
    html`<div class="stack-sm"><p class="eyebrow">Ordine corretto</p>${ex.steps.map(
      (s, i) => html`<div class="order-item" style="border-color:var(--green)"><span class="num" style="background:var(--green)">${i + 1}</span><${Md} text=${s} /></div>`,
    )}</div>`}
  </div>`;
}

export function ClozeInput({ ex, value, onChange, locked }) {
  const vals = value || ex.blanks.map(() => -1);
  const perms = useMemo(() => ex.blanks.map((b) => shuffled(b.options.length)), [ex]);
  const parts = ex.text.split(/\[\[(\d+)\]\]/);
  // il testo è markdown: renderizzo i pezzi e inserisco i menu a tendina
  return html`<div class="cloze-text md">
    ${parts.map((p, i) => {
      if (i % 2 === 0) return html`<span dangerouslySetInnerHTML=${{ __html: md(p).replace(/^<p>|<\/p>$/g, '') }}></span>`;
      const bi = +p;
      const b = ex.blanks[bi];
      const ok = locked && vals[bi] === b.answer;
      const plain = (o) => o.replace(/\$/g, '');
      return html`<select aria-label=${'Spazio ' + (bi + 1)} disabled=${locked} value=${vals[bi]} style=${locked ? `border-color:${ok ? 'var(--green)' : 'var(--red)'}` : ''}
        onChange=${(e) => {
          const v = vals.slice();
          v[bi] = +e.currentTarget.value;
          onChange(v);
        }}>
        <option value="-1">…</option>
        ${perms[bi].map((oi) => html`<option value=${oi}>${plain(b.options[oi])}</option>`)}
      </select>${locked && !ok ? html` <span class="chip green">${plain(b.options[b.answer])}</span>` : ''}`;
    })}
  </div>`;
}

export function MatchInput({ ex, value, onChange, locked }) {
  const right = useMemo(() => shuffled(ex.pairs.length), [ex]);
  const [pick, setPick] = useState(null);
  const pairs = value || ex.pairs.map(() => -1);
  const usedRight = new Set(pairs.filter((x) => x >= 0));
  const tapLeft = (i) => !locked && setPick(i);
  const tapRight = (j) => {
    if (locked || pick === null) return;
    const v = pairs.map((x) => (x === j ? -1 : x));
    v[pick] = j;
    onChange(v);
    setPick(null);
  };
  return html`<div class="stack-sm">
    <p class="small faint">Tocca un elemento a sinistra, poi quello corrispondente a destra.</p>
    <div class="match-grid">
      <div class="stack-sm">
        ${ex.pairs.map((p, i) => {
          let cls = 'opt';
          if (locked) cls += pairs[i] === i ? ' right' : ' wrong';
          else if (pick === i) cls += ' sel';
          else if (pairs[i] >= 0) cls += ' paired';
          return html`<button class=${cls} disabled=${locked} onClick=${() => tapLeft(i)}>
            ${pairs[i] >= 0 && html`<span class="k">${right.indexOf(pairs[i]) + 1}</span>`}<${Md} text=${p[0]} /></button>`;
        })}
      </div>
      <div class="stack-sm">
        ${right.map(
          (j, k) => html`<button class=${'opt' + (usedRight.has(j) && !locked ? ' paired' : '')} disabled=${locked} onClick=${() => tapRight(j)}>
            <span class="k">${k + 1}</span><${Md} text=${ex.pairs[j][1]} /></button>`,
        )}
      </div>
    </div>
  </div>`;
}

/**
 * Risposta aperta (Parte A): lo studente scrive, poi confronta con la risposta modello e
 * spunta i criteri della rubrica soddisfatti (autovalutazione), oppure chiede la correzione a Claude.
 */
export function OpenInput({ ex, value, onChange, locked, ai }) {
  const v = value || { text: '', revealed: false, checks: [], score: undefined };
  const set = (patch) => onChange({ ...v, ...patch });
  const [aiState, setAi] = useState(null);
  const askClaude = async () => {
    setAi({ busy: true });
    try {
      const r = await ai.grade(ex, v.text);
      setAi({ result: r });
      if (r && typeof r.score === 'number') set({ revealed: true, checks: (r.criteria || []).map(Boolean), score: r.score, ai: r });
    } catch (e) {
      setAi({ error: e?.message || 'Correzione non disponibile ora.' });
    }
  };
  const toggle = (i) => {
    const checks = ex.rubric.map((_, k) => (k === i ? !v.checks[k] : !!v.checks[k]));
    set({ checks, score: checks.filter(Boolean).length / ex.rubric.length });
  };
  return html`<div class="stack">
    <textarea id="open-answer" class="input" disabled=${locked || v.revealed} placeholder="Scrivi la tua risposta come all'esame: definizione, enunciato, passaggi della dimostrazione…" value=${v.text}
      onInput=${(e) => set({ text: e.currentTarget.value })}></textarea>
    ${!v.revealed &&
    html`<div class="row-wrap">
      <button class="btn ghost sm" onClick=${() => set({ revealed: true, checks: ex.rubric.map(() => false), score: 0 })}><${I.eye} /> Confronta con la risposta modello</button>
      ${ai?.available && v.text.trim().length > 20 && html`<button class="btn ghost sm" disabled=${aiState?.busy} onClick=${askClaude}><${I.ai} /> ${aiState?.busy ? 'Correzione…' : 'Correggi con Claude'}</button>`}
    </div>`}
    ${aiState?.error && html`<p class="small" style="color:var(--red)">${aiState.error}</p>`}
    ${v.revealed &&
    html`<div class="stack">
      <div class="card flat tint stack-sm"><p class="eyebrow">Risposta modello</p><${Md} text=${ex.answer} /></div>
      ${v.ai?.feedback && html`<div class="card flat stack-sm"><p class="eyebrow">Commento di Claude</p><${Md} text=${v.ai.feedback} /></div>`}
      <div class="stack-sm">
        <p class="eyebrow">Cosa c'era nella tua risposta? Sii severo come il prof.</p>
        <div class="rubric">${ex.rubric.map(
          (r, i) => html`<label><input type="checkbox" checked=${!!v.checks[i]} disabled=${locked} onChange=${() => toggle(i)} /><${Md} text=${r} /></label>`,
        )}</div>
      </div>
    </div>`}
  </div>`;
}

/** Sceglie il widget giusto per il tipo di esercizio */
export function ExerciseInput(props) {
  const t = props.ex.type;
  const W = { mcq: McqInput, tf: TfInput, num: NumInput, expr: ExprInput, set: SetInput, interval: IntervalInput, tuple: TupleInput, order: OrderInput, cloze: ClozeInput, match: MatchInput, open: OpenInput }[t];
  if (!W) return html`<p class="faint">Tipo di esercizio non supportato: ${t}</p>`;
  return html`<${W} ...${props} />`;
}

/** La risposta è abbastanza completa da poter premere "Verifica"? */
export function canCheck(ex, value) {
  switch (ex.type) {
    case 'mcq':
      return Array.isArray(ex.answer) ? (value || []).length > 0 : Number.isInteger(value);
    case 'tf':
      return typeof value === 'boolean';
    case 'num':
    case 'expr':
    case 'interval':
    case 'set':
      return typeof value === 'string' && value.trim().length > 0;
    case 'tuple':
      return Array.isArray(value) && value.length === ex.answer.length && value.every((v) => String(v).trim());
    case 'order':
      return Array.isArray(value) && value.length >= ex.steps.length;
    case 'cloze':
      return Array.isArray(value) && value.every((v) => v >= 0);
    case 'match':
      return Array.isArray(value) && value.every((v) => v >= 0);
    case 'open':
      return !!value?.revealed;
    default:
      return false;
  }
}

export function normalizedPreview(s) {
  return normalize(s);
}
