// Avvio: carica i contenuti, prepara il corso e il salvataggio, poi monta l'app.
import { html, render } from './vendor/preact-htm.js';
import { store } from './store.js';
import { loadAll } from './content/index.js';
import { buildCourse } from './engine/course.js';
import { CloudSync } from './sync/cloud.js';
import { ai } from './ui/ai.js';
import { initMath } from './engine/check.js';
import { App } from './ui/app.js';

async function boot() {
  const root = document.getElementById('app');
  // La correzione delle risposte usa math.js (caricato da cdnjs nella pagina). Senza, ogni risposta
  // numerica o simbolica risulterebbe sbagliata: meglio fermarsi con un messaggio chiaro.
  if (!window.math) throw new Error('math.js non caricato: la correzione non è disponibile');
  initMath(window.math);
  const content = await loadAll();
  store.course = buildCourse(content);
  const sync = new CloudSync({
    getState: () => store.st,
    apply: (st, mode) => store.apply(st, mode),
    onStatus: (s) => store.setSyncStatus(s),
  });
  store.sync = sync;
  render(html`<${App} />`, root);
  // Il salvataggio parte in locale subito; il cloud si aggancia appena disponibile.
  sync.init().catch((e) => {
    console.warn('[sync] avvio cloud non riuscito', e);
    sync.goLocal('Salvato su questo dispositivo');
  });
  ai.init();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sync.saveNow();
  });
  window.addEventListener('pagehide', () => sync.saveNow());
}

boot().catch((e) => {
  console.error(e);
  document.getElementById('app').innerHTML = '<div class="wrap pad-top"><h2>Qualcosa non ha funzionato</h2><p class="muted">Ricarica la pagina. Se il problema continua, i tuoi progressi sono salvati su questo dispositivo.</p></div>';
});
