// Salvataggio automatico nel cloud (database dell'Artifact claude.ai), in tempo reale tra dispositivi,
// con cronologia di istantanee ripristinabili. Fuori da claude.ai funziona in modalità locale.
//
// Struttura nel database (privata per utente: data/users/<id>/ è leggibile solo dal proprietario):
//   data/users/<id>/core                 profilo, impostazioni, xp, giorni, skill, esami  (+ epoch, rev, device)
//   data/users/<id>/items-<sezione>      stato FSRS degli item, diviso per sezione (documenti piccoli)
//   data/users/<id>/core/snapshots/<id>  istantanee complete (compresse) per il ripristino
import { merge, sameContent, clone, deviceId, deviceLabel, summary, pushLocalSnapshot, localSnapshots, saveLocal, today } from '../engine/state.js';

const WRITE_DEBOUNCE = 1500;
const AUTO_SNAPSHOT_MS = 20 * 60 * 1000;
const KEEP_RECENT = 30;
const KEEP_DAILY_DAYS = 90;

function shardOf(itemId) {
  const p = itemId.split('.')[0];
  return /^s\d\d$/.test(p) ? p : p.startsWith('ex') ? 'ex' : 'misc';
}

/** Divide lo stato nei documenti del database */
function toDocs(st) {
  const { items, ...core } = st;
  const docs = { core: { ...core } };
  for (const [id, v] of Object.entries(items || {})) {
    const k = 'items-' + shardOf(id);
    (docs[k] ||= { epoch: st.epoch || 0, items: {} }).items[id] = v;
  }
  return docs;
}

/** Ricompone lo stato dai documenti (ignora i frammenti di un epoch diverso dal core) */
function fromDocs(map) {
  const core = map.core;
  if (!core) return null;
  const st = { ...clone(core), items: {} };
  for (const [k, d] of Object.entries(map)) {
    if (!k.startsWith('items-') || (d.epoch || 0) !== (core.epoch || 0)) continue;
    Object.assign(st.items, d.items || {});
  }
  return st;
}

async function gzip(obj) {
  const json = JSON.stringify(obj);
  if (typeof CompressionStream === 'undefined') return { raw: json };
  const cs = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
  const buf = new Uint8Array(await new Response(cs).arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return { z: btoa(bin) };
}

async function gunzip(doc) {
  if (doc.raw) return JSON.parse(doc.raw);
  if (doc.state) return doc.state;
  const bin = atob(doc.z);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const ds = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(ds).text());
}

export class CloudSync {
  /**
   * @param {object} o
   * @param {() => object} o.getState    stato corrente
   * @param {(st, mode) => void} o.apply  applica uno stato arrivato da un altro dispositivo ('merge' | 'replace')
   * @param {(status) => void} o.onStatus aggiorna l'indicatore di salvataggio
   */
  constructor({ getState, apply, onStatus }) {
    this.getState = getState;
    this.apply = apply;
    this.onStatus = onStatus;
    this.mode = 'starting'; // starting | cloud | local
    this.db = null;
    this.base = null;
    this.lastWritten = {};
    this.remoteDocs = {};
    this.timer = null;
    this.writing = false;
    this.dirty = false;
    this.lastSnapAt = 0;
    this.lastSaved = 0;
    this.pruned = false;
    this.status = { kind: 'busy', text: 'Connessione…' };
  }

  setStatus(kind, text) {
    this.status = { kind, text, at: Date.now() };
    this.onStatus?.(this.status);
  }

  async init() {
    const c = globalThis.window && window.claude;
    if (!c || typeof c.use !== 'function') return this.goLocal('Salvato su questo dispositivo');
    let db, user;
    try {
      [db, user] = await Promise.all([c.use('db'), c.use('user')]);
    } catch (e) {
      return this.goLocal('Cloud non disponibile');
    }
    if (!db || !user) return this.goLocal('Cloud non disponibile');
    let id = null;
    try {
      id = await user.id();
    } catch (e) {
      /* nessuna identità */
    }
    if (!id) return this.goLocal('Accedi a claude.ai per il cloud');
    this.db = db;
    this.base = `data/users/${id}`;
    this.mode = 'cloud';
    this.setStatus('busy', 'Sincronizzazione…');
    // ultima istantanea, per la cadenza automatica
    try {
      const q = await this.snapCol().orderBy('at', 'desc').limit(1).get();
      this.lastSnapAt = q.docs[0]?.data()?.at || 0;
    } catch (e) {
      /* non bloccante */
    }
    this.subscribe();
    return true;
  }

  goLocal(text) {
    this.mode = 'local';
    this.setStatus('local', text);
    return false;
  }

  snapCol() {
    return this.db.doc(this.base + '/core').collection('snapshots');
  }

  subscribe() {
    this.unsub?.();
    this.unsub = this.db.collection(this.base).onSnapshot(
      (snap) => this.onRemote(snap),
      (err) => {
        console.warn('[sync] ascolto interrotto', err);
        if (err?.code === 'revoked') return this.goLocal('Accesso al cloud revocato');
        this.setStatus('err', 'Riconnessione…');
        setTimeout(() => this.subscribe(), 4000);
      },
    );
  }

  onRemote(snap) {
    const map = {};
    for (const d of snap.docs) if (d.exists) map[d.id] = d.data();
    this.remoteDocs = map;
    if (snap.metadata?.hasPendingWrites) return;
    const local = this.getState();
    const remote = fromDocs(map);
    if (!remote) {
      // primo avvio nel cloud: carico tutto
      this.schedule(0);
      return;
    }
    for (const [k, d] of Object.entries(map)) this.lastWritten[k] = JSON.stringify(d);
    if ((remote.epoch || 0) > (local.epoch || 0)) {
      this.apply(remote, 'replace');
      this.setStatus('ok', 'Ripristino ricevuto');
      return;
    }
    const merged = merge(local, remote);
    if (!sameContent(merged, local)) this.apply(merged, 'merge');
    if (!sameContent(merged, remote)) this.schedule();
    else this.setStatus('ok', 'Salvato nel cloud');
  }

  /** Chiamato dall'app a ogni modifica dello stato */
  schedule(delay = WRITE_DEBOUNCE) {
    saveLocal(this.getState());
    if (this.mode !== 'cloud') {
      this.maybeLocalSnapshot();
      return;
    }
    this.dirty = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), delay);
  }

  async flush() {
    if (this.mode !== 'cloud') return;
    if (this.writing) {
      this.dirty = true;
      return;
    }
    this.writing = true;
    this.dirty = false;
    this.setStatus('busy', 'Salvataggio…');
    const st = this.getState();
    st.meta = { ...st.meta, rev: (st.meta?.rev || 0) + 1, updatedAt: Date.now(), device: deviceId() };
    const docs = toDocs(st);
    // i frammenti che esistono nel cloud ma non localmente vanno svuotati (servono dopo un ripristino)
    for (const k of Object.keys(this.remoteDocs)) if (k.startsWith('items-') && !docs[k]) docs[k] = { epoch: st.epoch || 0, items: {} };
    try {
      for (const [k, body] of Object.entries(docs)) {
        const json = JSON.stringify(body);
        if (this.lastWritten[k] === json) continue;
        await this.withRetry(() => this.db.collection(this.base).doc(k).set(body));
        this.lastWritten[k] = json;
      }
      this.lastSaved = Date.now();
      this.setStatus('ok', 'Salvato nel cloud');
      await this.maybeAutoSnapshot(st);
    } catch (e) {
      console.warn('[sync] scrittura fallita', e);
      if (e?.code === 'revoked' || e?.code === 'not_granted') this.goLocal('Salvato su questo dispositivo');
      else {
        this.setStatus('err', 'Offline: salvato sul dispositivo, riprovo…');
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.flush(), 8000);
      }
    } finally {
      this.writing = false;
      if (this.dirty) this.schedule();
    }
  }

  async withRetry(fn) {
    try {
      return await fn();
    } catch (e) {
      if (e?.code === 'unavailable' || e?.code === 'resource_exhausted') {
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
        return fn();
      }
      throw e;
    }
  }

  // ---------- istantanee ----------

  async maybeAutoSnapshot(st) {
    const now = Date.now();
    const firstToday = today(new Date(this.lastSnapAt || 0)) !== today();
    if (now - this.lastSnapAt < AUTO_SNAPSHOT_MS && !firstToday) return;
    await this.snapshot(firstToday ? 'Primo salvataggio del giorno' : 'Automatico', st);
  }

  maybeLocalSnapshot() {
    const list = localSnapshots();
    const last = list[0]?.at || 0;
    if (Date.now() - last > AUTO_SNAPSHOT_MS) pushLocalSnapshot(this.getState(), 'Automatico');
  }

  /** Crea un'istantanea completa (cloud se disponibile, sempre anche locale). */
  async snapshot(reason, st = this.getState()) {
    pushLocalSnapshot(st, reason);
    if (this.mode !== 'cloud') return;
    try {
      const body = { at: Date.now(), reason, device: deviceId(), deviceLabel: deviceLabel(), epoch: st.epoch || 0, summary: summary(st), ...(await gzip(st)) };
      await this.withRetry(() => this.snapCol().add(body));
      this.lastSnapAt = body.at;
      if (!this.pruned) {
        this.pruned = true;
        this.prune().catch(() => {});
      }
    } catch (e) {
      console.warn('[sync] istantanea non salvata', e);
    }
  }

  /** Tiene le ultime 30 istantanee + una al giorno per 90 giorni. */
  async prune() {
    const q = await this.snapCol().orderBy('at', 'desc').limit(400).get();
    const seenDays = new Set();
    const cutoff = Date.now() - KEEP_DAILY_DAYS * 86400000;
    let i = 0;
    for (const d of q.docs) {
      const at = d.data()?.at || 0;
      const day = today(new Date(at));
      const keep = i < KEEP_RECENT || (at > cutoff && !seenDays.has(day));
      seenDays.add(day);
      i++;
      if (!keep) await this.snapCol().doc(d.id).delete();
    }
  }

  /** Elenco istantanee (cloud + locali), dalla più recente */
  async listSnapshots() {
    const out = localSnapshots().map((s) => ({ id: s.id, at: s.at, reason: s.reason, deviceLabel: s.device + ' (locale)', summary: s.summary, where: 'local' }));
    if (this.mode === 'cloud') {
      try {
        const q = await this.snapCol().orderBy('at', 'desc').limit(120).get();
        for (const d of q.docs) {
          const v = d.data();
          out.push({ id: d.id, at: v.at, reason: v.reason, deviceLabel: v.deviceLabel, summary: v.summary, where: 'cloud' });
        }
      } catch (e) {
        console.warn('[sync] elenco istantanee non disponibile', e);
      }
    }
    out.sort((a, b) => b.at - a.at);
    return out;
  }

  async loadSnapshot(entry) {
    if (entry.where === 'local') return localSnapshots().find((s) => s.id === entry.id)?.state || null;
    const d = await this.snapCol().doc(entry.id).get();
    return d.exists ? gunzip(d.data()) : null;
  }

  /**
   * Ripristina uno stato passato: salva prima un'istantanea dello stato attuale, poi alza l'epoch
   * così gli altri dispositivi sostituiscono (non fondono) i loro progressi con quelli ripristinati.
   */
  async restore(target, reason = 'Prima del ripristino') {
    const current = this.getState();
    await this.snapshot(reason, current);
    const remoteEpoch = this.remoteDocs.core?.epoch || 0;
    const next = clone(target);
    next.epoch = Math.max(current.epoch || 0, remoteEpoch, target.epoch || 0) + 1;
    next.meta = { ...(next.meta || {}), updatedAt: Date.now(), device: deviceId() };
    this.apply(next, 'replace');
    this.lastWritten = {};
    this.schedule(0);
    return next;
  }

  async saveNow() {
    clearTimeout(this.timer);
    saveLocal(this.getState());
    if (this.mode === 'cloud') await this.flush();
  }
}
