// Markdown ridotto + KaTeX → HTML (stringa). Tutto il testo viene prima "escapato":
// l'unico HTML prodotto è quello generato qui e da KaTeX.

const MACROS = { '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\Z': '\\mathbb{Z}', '\\Q': '\\mathbb{Q}', '\\C': '\\mathbb{C}' };
const cache = new Map();

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function tex(src, display = false) {
  const key = (display ? 'D' : 'I') + src;
  if (cache.has(key)) return cache.get(key);
  let out;
  try {
    out = window.katex
      ? window.katex.renderToString(src, { displayMode: display, throwOnError: false, macros: { ...MACROS }, strict: false, output: 'html' })
      : `<code>${esc(src)}</code>`;
  } catch (e) {
    out = `<code>${esc(src)}</code>`;
  }
  if (cache.size > 4000) cache.clear();
  cache.set(key, out);
  return out;
}

function inline(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** Markdown ridotto → HTML. Supporta paragrafi, elenchi, ###, riquadri (> >! >*), $..$ e $$..$$. */
export function md(text) {
  if (text == null || text === '') return '';
  const maths = [];
  let s = String(text).replace(/\$\$([\s\S]+?)\$\$/g, (m, t) => {
    maths.push(tex(t.trim(), true));
    return `\u0000${maths.length - 1}\u0000`;
  });
  s = s.replace(/\$([^$\n]+?)\$/g, (m, t) => {
    maths.push(tex(t, false));
    return `\u0000${maths.length - 1}\u0000`;
  });
  s = esc(s);
  const blocks = s.split(/\n\s*\n/);
  const html = blocks
    .map((b) => {
      const lines = b.split('\n').filter((l) => l.trim() !== '');
      if (!lines.length) return '';
      if (lines.every((l) => /^\s*[-•]\s+/.test(l))) return '<ul>' + lines.map((l) => `<li>${inline(l.replace(/^\s*[-•]\s+/, ''))}</li>`).join('') + '</ul>';
      if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) return '<ol>' + lines.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('') + '</ol>';
      if (/^###\s+/.test(lines[0])) {
        const head = `<h4>${inline(lines[0].replace(/^###\s+/, ''))}</h4>`;
        return head + (lines.length > 1 ? `<p>${inline(lines.slice(1).join('<br>'))}</p>` : '');
      }
      const m = lines[0].match(/^&gt;([!*]?)\s?/);
      if (m) {
        const cls = m[1] === '!' ? 'callout warn' : m[1] === '*' ? 'callout thm' : 'callout';
        const body = lines.map((l) => l.replace(/^&gt;[!*]?\s?/, '')).join('<br>');
        return `<div class="${cls}">${inline(body)}</div>`;
      }
      return `<p>${inline(lines.join('<br>'))}</p>`;
    })
    .join('');
  return html.replace(/\u0000(\d+)\u0000/g, (m, i) => maths[+i]);
}
