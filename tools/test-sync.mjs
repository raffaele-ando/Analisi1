// Test della sincronizzazione con un database in memoria che rispetta le regole dei percorsi
// (documenti a numero pari di segmenti, collezioni a numero dispari). Due dispositivi, fusione,
// istantanee e ripristino con cambio di epoch.
import assert from 'node:assert/strict';
import { CloudSync } from '../app/sync/cloud.js';
import { emptyState, addXp, merge } from '../app/engine/state.js';

// ---- localStorage e device id per ogni "dispositivo" ----
const ls = new Map();
globalThis.localStorage = { getItem: (k) => (ls.has(k) ? ls.get(k) : null), setItem: (k, v) => ls.set(k, String(v)), removeItem: (k) => ls.delete(k) };
const setDevice = (id) => ls.set('a1duo.device', id);

// ---- database finto ----
const segs = (p) => p.split('/');
class FakeDb {
  constructor() { this.docs = new Map(); this.listeners = []; this.n = 0; }
  doc(path) { if (segs(path).length % 2) throw new TypeError('path di documento non valido: ' + path); return new FDoc(this, path); }
  collection(path) { if (!(segs(path).length % 2)) throw new TypeError('path di collezione non valido: ' + path); return new FCol(this, path); }
  children(col) {
    const n = segs(col).length + 1;
    return [...this.docs.keys()].filter((p) => p.startsWith(col + '/') && segs(p).length === n).map((p) => ({ id: segs(p).at(-1), path: p, data: this.docs.get(p) }));
  }
  notify(path) {
    setTimeout(() => {
      for (const l of this.listeners) {
        const parent = segs(path).slice(0, -1).join('/');
        if (parent === l.col) l.cb(this.snap(l.col));
      }
    }, 0);
  }
  snap(col) {
    return { docs: this.children(col).map((c) => ({ id: c.id, exists: true, data: () => JSON.parse(JSON.stringify(c.data)), metadata: {} })), metadata: { hasPendingWrites: false } };
  }
}
class FDoc {
  constructor(db, path) { this.db = db; this.path = path; this.id = segs(path).at(-1); }
  set(data) { this.db.docs.set(this.path, JSON.parse(JSON.stringify(data))); this.db.notify(this.path); return Promise.resolve(); }
  get() { const has = this.db.docs.has(this.path); const v = this.db.docs.get(this.path); return Promise.resolve({ exists: has, id: this.id, data: () => (has ? JSON.parse(JSON.stringify(v)) : undefined) }); }
  delete() { this.db.docs.delete(this.path); this.db.notify(this.path); return Promise.resolve(); }
  collection(sub) { return new FCol(this.db, this.path + '/' + sub); }
}
class FCol {
  constructor(db, path, order = null, lim = Infinity) { this.db = db; this.path = path; this.order = order; this.lim = lim; }
  doc(id) { return new FDoc(this.db, this.path + '/' + id); }
  orderBy(f, dir = 'asc') { return new FCol(this.db, this.path, { f, dir }, this.lim); }
  limit(n) { return new FCol(this.db, this.path, this.order, n); }
  async get() {
    let list = this.db.children(this.path).map((c) => ({ id: c.id, exists: true, d: c.data }));
    if (this.order) list.sort((a, b) => (this.order.dir === 'desc' ? b.d[this.order.f] - a.d[this.order.f] : a.d[this.order.f] - b.d[this.order.f]));
    list = list.slice(0, this.lim);
    return { docs: list.map((x) => ({ id: x.id, exists: true, data: () => JSON.parse(JSON.stringify(x.d)) })) };
  }
  add(data) { const id = 'snap' + String(++this.db.n).padStart(4, '0'); return this.doc(id).set(data).then(() => this.doc(id)); }
  onSnapshot(cb) {
    const l = { col: this.path, cb };
    this.db.listeners.push(l);
    setTimeout(() => cb(this.db.snap(this.path)), 0);
    return () => { this.db.listeners = this.db.listeners.filter((x) => x !== l); };
  }
}

const db = new FakeDb();
const sleep = (ms = 30) => new Promise((r) => setTimeout(r, ms));
const UID = 'u_test_1';

function device(id) {
  const dev = { id, st: null };
  dev.sync = new CloudSync({
    getState: () => dev.st,
    apply: (st) => { dev.st = st; },
    onStatus: () => {},
  });
  setDevice(id);
  dev.st = emptyState();
  dev.sync.db = db;
  dev.sync.base = 'data/users/' + UID;
  dev.sync.mode = 'cloud';
  dev.sync.subscribe();
  dev.run = (fn) => { setDevice(id); fn(dev.st); };
  return dev;
}

// ---- scenario ----
const A = device('dA');
const B = device('dB');
await sleep();
A.run((st) => addXp(st, 10));
await A.sync.flush();
await sleep();
assert.ok(db.docs.has('data/users/' + UID + '/core'), 'core scritto');
assert.ok([...db.docs.keys()].some((p) => p.includes('/items-')) || Object.keys(A.st.items).length === 0, 'shard degli item');
console.log('✓ primo salvataggio su cloud');

await sleep();
const bTotal = Object.values(B.st.xp).reduce((a, b) => a + b, 0);
assert.equal(bTotal, 10, 'B riceve i progressi di A');
console.log('✓ secondo dispositivo riceve lo stato');

B.run((st) => addXp(st, 5));
await B.sync.flush();
await sleep();
const aTotal = Object.values(A.st.xp).reduce((a, b) => a + b, 0);
assert.equal(aTotal, 15, 'A fonde i progressi di B');
console.log('✓ fusione tra dispositivi (XP per dispositivo)');

// istantanea di A con 15 XP
await A.sync.snapshot('Test');
const snaps = await A.sync.listSnapshots();
const cloudSnap = snaps.find((s) => s.where === 'cloud');
assert.ok(cloudSnap, 'istantanea cloud presente');
const saved = await A.sync.loadSnapshot(cloudSnap);
assert.equal(Object.values(saved.xp).reduce((a, b) => a + b, 0), 15, 'istantanea con 15 XP');
console.log('✓ istantanea cloud creata e leggibile');

// A continua a studiare (100 XP), poi ripristina l'istantanea
A.run((st) => addXp(st, 100));
await A.sync.flush();
await sleep();
const epochBefore = A.st.epoch;
await A.sync.restore(saved, 'Test ripristino');
await sleep();
const aAfter = Object.values(A.st.xp).reduce((a, b) => a + b, 0);
assert.equal(aAfter, 15, 'ripristino riporta a 15 XP');
assert.ok(A.st.epoch > epochBefore, 'epoch aumentato dopo il ripristino');
console.log('✓ ripristino di una istantanea precedente (con nuovo epoch)');

await sleep(60);
const bAfter = Object.values(B.st.xp).reduce((a, b) => a + b, 0);
assert.equal(bAfter, 15, 'B adotta lo stato ripristinato (senza fondere i 100 XP)');
assert.equal(B.st.epoch, A.st.epoch, 'stesso epoch su B');
console.log('✓ il ripristino si propaga agli altri dispositivi senza fondere');

// fusione pura: commutativa e idempotente
const x = emptyState(); const y = emptyState();
setDevice('x1'); addXp(x, 3); setDevice('y1'); addXp(y, 4);
assert.deepEqual(merge(x, y).xp, merge(y, x).xp, 'fusione commutativa');
assert.deepEqual(merge(merge(x, y), y).xp, merge(x, y).xp, 'fusione idempotente');
console.log('✓ fusione commutativa e idempotente');

console.log('\nTutti i test di sincronizzazione sono passati.');
process.exit(0);
