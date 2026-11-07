// Galleria di prova: mostra ogni tipo di esercizio e di card in isolamento, per controllarne il layout.
// Non fa parte dell'app pubblicata: tools/screenshots.mjs la copia in dist/ e la fotografa.
import { html, render, useState } from './app/vendor/preact-htm.js';
import { initMath } from './app/engine/check.js';
import { Player } from './app/ui/player.js';

initMath(window.math);

const CASES = {
  'mcq': { type: 'mcq', prompt: 'Quale frazione è equivalente a $\\frac{6}{8}$?', options: ['$\\frac{7}{9}$', '$\\frac{3}{4}$', '$\\frac{12}{14}$', '$\\frac{6}{4}$'], answer: 1, explain: 'Dividi numeratore e denominatore per 2.', level: 1 },
  'mcq-multi': { type: 'mcq', prompt: 'Quali affermazioni sono vere?', options: ['$1+1=2$', '$2\\cdot3=5$', '$\\sqrt{4}=2$'], answer: [0, 2], explain: 'Due sono vere.' },
  'tf': { type: 'tf', prompt: 'La successione $a_n=(-1)^n$ converge.', answer: false, explain: 'Oscilla tra $1$ e $-1$.' },
  'num': { type: 'num', prompt: 'Calcola $\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}$.', answer: '1', explain: 'Limite notevole.' },
  'expr': { type: 'expr', prompt: 'Deriva $f(x)=x^2e^x$.', answer: '2*x*e^x+x^2*e^x', vars: ['x'], explain: 'Regola del prodotto.' },
  'interval': { type: 'interval', prompt: 'Dominio di $\\sqrt{x-1}/\\sqrt{5-x}$.', answer: '[1,5)', explain: 'Serve $x\\ge1$ e $x<5$.' },
  'set': { type: 'set', prompt: 'Risolvi in $\\mathbb C$: $z^2=-1$.', answer: ['i', '-i'], explain: 'Le radici sono $\\pm i$.' },
  'tuple': { type: 'tuple', prompt: 'Punto di intersezione.', labels: ['x', 'y', 'z'], answer: ['9/11', '24/11', '-6/11'], explain: 'Sostituisci nella retta.' },
  'order': { type: 'order', prompt: 'Riordina i passi della dimostrazione del teorema di Fermat.', steps: ['Ipotesi: $x_0$ è estremo locale.', 'Rapporti incrementali laterali di segno opposto.', 'Limiti uguali, quindi $f\'(x_0)=0$.'], distractors: ['Si applica il teorema di Rolle a caso.'], explain: 'Ordine logico.' },
  'cloze': { type: 'cloze', prompt: 'Completa.', text: 'Una serie converge se le somme parziali hanno [[0]] finito. La condizione [[1]] è necessaria.', blanks: [{ options: ['limite', 'massimo'], answer: 0 }, { options: ['necessaria', 'sufficiente'], answer: 0 }], explain: 'Definizione e condizione.' },
  'match': { type: 'match', prompt: 'Abbina.', pairs: [['$\\sin x$', '$\\cos x$'], ['$e^x$', '$e^x$'], ['$\\log x$', '$1/x$']], explain: 'Derivate.' },
  'open': { type: 'open', prompt: 'Enuncia e dimostra il teorema di Fermat.', answer: 'Se $x_0$ è estremo interno e $f$ derivabile, $f\'(x_0)=0$.', rubric: ['Ipotesi corrette', 'Segno dei rapporti', 'Conclusione'] },
  'problem': { type: 'problem', prompt: 'Studia $f(x)=\\dfrac{x^2-3}{x-1}$.', solution: 'Dominio $\\mathbb R\\setminus\\{1\\}$; asintoto verticale $x=1$.', parts: [
    { type: 'interval', prompt: 'Dominio.', answer: '(-inf,1)U(1,+inf)', explain: 'Il denominatore si annulla in $1$.' },
    { type: 'num', prompt: 'Limite per $x\\to1^+$ (da scrivere come inf).', answer: 'inf', explain: 'Numeratore negativo, denominatore positivo.' },
  ] },
  'learn': { type: 'learn', title: 'Che cos\'è una frazione', body: 'La frazione $\\frac ab$ è il numero che moltiplicato per $b$ dà $a$.\n\n> Nota: il denominatore non può essere zero.', plot: { fns: ['x^2'], x: [-2, 2], y: [-1, 4] } },
  'example': { type: 'example', title: 'Esempio svolto', problem: 'Calcola $\\frac23+\\frac54$.', steps: ['Il mcm tra $3$ e $4$ è $12$.', { text: 'Il numeratore è $15$.', ask: { type: 'num', prompt: 'Quale numeratore serve per $\\frac54=\\frac{?}{12}$?', answer: '15', explain: 'Moltiplica per $3$.' } }, 'Somma: $\\frac{8+15}{12}=\\frac{23}{12}$.'], result: '$\\frac{23}{12}$' },
  'summary': null,
};

function Gallery() {
  const q = new URLSearchParams(location.search);
  const name = q.get('case') || 'mcq';
  const c = CASES[name];
  if (!c) return html`<p>caso sconosciuto: ${name}</p>`;
  const card = c.type === 'learn' || c.type === 'example' ? c : { id: 'gallery-' + name, level: c.level || 2, ...c };
  return html`<div style="max-width:640px;margin:0 auto"><${Player} key=${name} title=${name} cards=${[card]} mode="practice" onExit=${() => {}} onDone=${() => {}} /></div>`;
}

render(html`<${Gallery} />`, document.getElementById('app'));
window.__GALLERY_CASES = Object.keys(CASES).filter((k) => CASES[k]);
