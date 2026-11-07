// Registro dei contenuti. I moduli si caricano in parallelo; se uno manca o ha un errore
// l'app parte lo stesso con gli altri (e lo segnala in console).

export const SECTION_FILES = [
  's00-fondamenta.js',
  's01-reali.js',
  's02-complessi.js',
  's03-funzioni.js',
  's04-successioni.js',
  's05-limiti.js',
  's06-infinitesimi.js',
  's07-continuita.js',
  's08-derivate.js',
  's09-studio.js',
  's10-taylor.js',
  's11-integrali.js',
  's12-impropri.js',
  's13-serie.js',
  's14-serie-taylor.js',
  's15-geometria.js',
];

export const EXAM_FILES = ['exams-2026.js', 'exams-2025.js', 'exams-old.js'];

export async function loadAll(base = new URL('./', import.meta.url).href) {
  const load = (f) => import(base + f).then((m) => m.default);
  const [secs, exams] = await Promise.all([Promise.allSettled(SECTION_FILES.map(load)), Promise.allSettled(EXAM_FILES.map(load))]);
  const sections = [];
  secs.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value) sections.push(r.value);
    else console.warn('[contenuti] sezione non caricata:', SECTION_FILES[i], r.reason?.message || '');
  });
  const examList = [];
  exams.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value) examList.push(...(r.value.exams || []));
    else console.info('[contenuti] file esami assente:', EXAM_FILES[i]);
  });
  sections.sort((a, b) => a.id.localeCompare(b.id));
  examList.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return { sections, exams: examList };
}
