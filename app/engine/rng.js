// Generatore pseudo-casuale con seme (mulberry32) e helper per i generatori di esercizi.
// Deterministico: lo stesso seme produce lo stesso esercizio (utile per rivedere un errore).

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed = Date.now()) {
  const rnd = mulberry32(seed);
  const R = {
    seed,
    random: rnd,
    /** intero in [a, b] estremi inclusi */
    int(a, b) {
      return a + Math.floor(rnd() * (b - a + 1));
    },
    /** intero non nullo in [a, b] */
    nz(a, b) {
      let v = 0;
      for (let i = 0; i < 100 && v === 0; i++) v = R.int(a, b);
      return v === 0 ? 1 : v;
    },
    /** elemento a caso di un array */
    pick(arr) {
      return arr[Math.floor(rnd() * arr.length)];
    },
    /** k elementi distinti */
    sample(arr, k) {
      return R.shuffle(arr).slice(0, k);
    },
    /** copia mescolata (Fisher-Yates) */
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    /** true con probabilità p */
    chance(p = 0.5) {
      return rnd() < p;
    },
    /** +1 o -1 */
    sign() {
      return rnd() < 0.5 ? -1 : 1;
    },
  };
  return R;
}
