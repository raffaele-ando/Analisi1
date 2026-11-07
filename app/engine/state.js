// Modello dei progressi, fusione tra dispositivi (CRDT leggero) e persistenza locale.
//
// Regole di fusione (commutative e idempotenti, così due dispositivi convergono sempre):
// - xp e xp giornalieri: G-counter per dispositivo (si tiene il massimo per dispositivo e si somma)
// - skill e item SRS: vince il record con timestamp più recente (last-writer-wins per record)
// - lezioni completate, esami svolti, test superati: unione
// - impostazioni e profilo: last-writer-wins per blocco
// - epoch: un ripristino incrementa l'epoch; un epoch più alto sostituisce tutto (niente fusione)

export const STATE_VERSION = 1;
const LS_KEY = 'a1duo.state.v1';
const LS_SNAPS = 'a1duo.localSnaps.v1';
const LS_DEVICE = 'a1duo.device';

export function uid(n = 10) {
  const a = 'abcdefghijkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

export function deviceId() {
  try {
    let d = localStorage.getItem(LS_DEVICE);
    if (!d) {
      d = 'd' + uid(8);
      localStorage.setItem(LS_DEVICE, d);
    }
    return d;
  } catch (e) {
    if (!globalThis.__a1dev) globalThis.__a1dev = 'd' + uid(8);
    return globalThis.__a1dev;
  }
}

export function deviceLabel() {
  const ua = (globalThis.navigator && navigator.userAgent) || '';
  const os = /iPhone|iPad/.test(ua) ? 'iPhone/iPad' : /Android/.test(ua) ? 'Android' : /Mac/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Dispositivo';
  const br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : /Firefox\//.test(ua) ? 'Firefox' : '';
  return br ? `${os} · ${br}` : os;
}

export function today(d = new Date()) {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
}

export function emptyState() {
  const now = Date.now();
  return {
    v: STATE_VERSION,
    epoch: 0,
    createdAt: now,
    profile: { t: 0, name: '', goal: 50, examDate: '', onboarded: false, freeMode: false },
    settings: { t: 0, sound: true, theme: 'system' },
    xp: {},
    days: {},
    skills: {},
    items: {},
    exams: {},
    tested: {},
    meta: { rev: 0, updatedAt: now, device: deviceId() },
  };
}

// ---------- accessori ----------

export function totalXp(st) {
  return Object.values(st.xp || {}).reduce((a, b) => a + b, 0);
}

export function dayXp(st, day = today()) {
  const d = st.days?.[day];
  return d ? Object.values(d).reduce((a, b) => a + b, 0) : 0;
}

export function streak(st, now = new Date()) {
  let n = 0;
  const d = new Date(now);
  // se oggi non si è ancora studiato, la serie resta viva fino a mezzanotte
  if (dayXp(st, today(d)) === 0) d.setDate(d.getDate() - 1);
  for (let i = 0; i < 3650; i++) {
    if (dayXp(st, today(d)) > 0) {
      n++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return n;
}

export function addXp(st, amount) {
  const dev = deviceId();
  st.xp[dev] = (st.xp[dev] || 0) + amount;
  const day = today();
  st.days[day] = st.days[day] || {};
  st.days[day][dev] = (st.days[day][dev] || 0) + amount;
}

// item SRS compatti: [d, s, dueMin, lastMin, n, l]
const MIN = 60000;
export function getItem(st, id) {
  const a = st.items[id];
  if (!a) return null;
  return { d: a[0], s: a[1], due: a[2] * MIN, last: a[3] * MIN, n: a[4], l: a[5] };
}
export function setItem(st, id, c) {
  st.items[id] = [c.d, c.s, Math.round(c.due / MIN), Math.round(c.last / MIN), c.n, c.l];
}

export function getSkill(st, id) {
  return st.skills[id] || null;
}
export function touchSkill(st, id, patch) {
  const cur = st.skills[id] || { p: 0.1, t: 0, done: [] };
  st.skills[id] = { ...cur, ...patch, t: Date.now() };
  return st.skills[id];
}

// ---------- fusione ----------

function mergeCounter(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] || 0, v);
  return out;
}

function lww(a, b) {
  if (!a) return b;
  if (!b) return a;
  return (b.t || 0) > (a.t || 0) ? b : a;
}

export function merge(a, b) {
  if (!a) return b;
  if (!b) return a;
  if ((b.epoch || 0) !== (a.epoch || 0)) return (b.epoch || 0) > (a.epoch || 0) ? clone(b) : a;
  const out = {
    v: Math.max(a.v || 1, b.v || 1),
    epoch: a.epoch || 0,
    createdAt: Math.min(a.createdAt || Infinity, b.createdAt || Infinity),
    profile: lww(a.profile, b.profile),
    settings: lww(a.settings, b.settings),
    xp: mergeCounter(a.xp, b.xp),
    days: {},
    skills: { ...a.skills },
    items: { ...a.items },
    exams: { ...b.exams, ...a.exams },
    tested: { ...b.tested, ...a.tested },
    meta: { ...a.meta },
  };
  for (const day of new Set([...Object.keys(a.days || {}), ...Object.keys(b.days || {})])) {
    out.days[day] = mergeCounter(a.days?.[day], b.days?.[day]);
  }
  for (const [id, sb] of Object.entries(b.skills || {})) {
    const sa = out.skills[id];
    if (!sa) out.skills[id] = sb;
    else {
      const win = (sb.t || 0) > (sa.t || 0) ? sb : sa;
      out.skills[id] = { ...win, done: [...new Set([...(sa.done || []), ...(sb.done || [])])] };
    }
  }
  for (const [id, ib] of Object.entries(b.items || {})) {
    const ia = out.items[id];
    if (!ia || ib[3] > ia[3] || (ib[3] === ia[3] && ib[4] > ia[4])) out.items[id] = ib;
  }
  for (const [id, eb] of Object.entries(b.exams || {})) {
    const ea = out.exams[id];
    if (ea && (eb.t || 0) > (ea.t || 0)) out.exams[id] = eb;
  }
  out.meta.updatedAt = Math.max(a.meta?.updatedAt || 0, b.meta?.updatedAt || 0);
  out.meta.rev = Math.max(a.meta?.rev || 0, b.meta?.rev || 0);
  return out;
}

export function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

/** Uguaglianza sostanziale (ignora meta) per capire se c'è qualcosa da salvare */
export function sameContent(a, b) {
  const strip = (s) => stableStringify({ ...s, meta: undefined });
  return strip(a) === strip(b);
}

/** JSON con chiavi ordinate: due oggetti uguali danno sempre la stessa stringa */
export function stableStringify(v) {
  if (Array.isArray(v)) return '[' + v.map((x) => (x === undefined ? 'null' : stableStringify(x))).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => JSON.stringify(k) + ':' + stableStringify(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

export function summary(st) {
  return {
    xp: totalXp(st),
    items: Object.keys(st.items || {}).length,
    skills: Object.values(st.skills || {}).filter((s) => (s.done || []).length).length,
    lessons: Object.values(st.skills || {}).reduce((n, s) => n + (s.done || []).length, 0),
    exams: Object.keys(st.exams || {}).length,
    streak: streak(st),
  };
}

// ---------- persistenza locale ----------

export function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return migrate(JSON.parse(raw));
  } catch (e) {
    return null;
  }
}

export function saveLocal(st) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(st));
    return true;
  } catch (e) {
    return false;
  }
}

export function migrate(st) {
  if (!st || typeof st !== 'object') return emptyState();
  const base = emptyState();
  for (const k of Object.keys(base)) if (st[k] == null) st[k] = base[k];
  st.profile = { ...base.profile, ...st.profile };
  st.settings = { ...base.settings, ...st.settings };
  return st;
}

/** Istantanee locali (anello di 8) come rete di sicurezza anche offline */
export function localSnapshots() {
  try {
    return JSON.parse(localStorage.getItem(LS_SNAPS) || '[]');
  } catch (e) {
    return [];
  }
}

export function pushLocalSnapshot(st, reason) {
  try {
    const list = localSnapshots();
    list.unshift({ id: 'local-' + Date.now(), at: Date.now(), reason, device: deviceLabel(), summary: summary(st), state: st });
    while (list.length > 8) list.pop();
    localStorage.setItem(LS_SNAPS, JSON.stringify(list));
  } catch (e) {
    /* spazio esaurito: si tiene solo lo stato corrente */
  }
}

export function validateImported(obj) {
  if (!obj || typeof obj !== 'object') return 'Il file non contiene dati validi.';
  const st = obj.state && obj.app === 'analisi1-duo' ? obj.state : obj;
  if (!st.items || !st.skills || !st.xp) return 'Il file non sembra un salvataggio di questa app.';
  return null;
}

export function exportPayload(st) {
  return { app: 'analisi1-duo', exportedAt: new Date().toISOString(), device: deviceLabel(), state: st };
}
