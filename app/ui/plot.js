// Grafici SVG di funzioni (sintassi math.js) — doppia codifica verbale + visiva.
import { compile } from '../engine/check.js';
import { esc } from './md.js';

const COLORS = ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--flame)'];

function niceStep(range) {
  const raw = range / 8;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
}

function fmt(v) {
  const r = Math.round(v * 1000) / 1000;
  return String(r).replace('-', '−').replace('.', ',');
}

export function plotSVG(spec) {
  const W = 560;
  const H = 340;
  const P = 30;
  const [x0, x1] = spec.x || [-5, 5];
  const fns = (spec.fns || []).map((f, i) => (typeof f === 'string' ? { f } : f)).map((f, i) => ({ ...f, color: COLORS[(f.color ?? i) % COLORS.length], fn: safeCompile(f.f) }));
  const N = 700;
  const samples = fns.map((f) => {
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const x = x0 + ((x1 - x0) * k) / N;
      pts.push([x, f.fn ? f.fn({ x }) : NaN]);
    }
    return pts;
  });
  let [y0, y1] = spec.y || autoY(samples);
  if (!(y1 > y0)) [y0, y1] = [-5, 5];
  const sx = (x) => P + ((x - x0) / (x1 - x0)) * (W - 2 * P);
  const sy = (y) => H - P - ((y - y0) / (y1 - y0)) * (H - 2 * P);
  const out = [];
  out.push(`<svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(spec.alt || 'Grafico')}" xmlns="http://www.w3.org/2000/svg">`);
  // griglia
  const stx = niceStep(x1 - x0);
  const sty = niceStep(y1 - y0);
  out.push('<g stroke="var(--grid)" stroke-width="1">');
  for (let x = Math.ceil(x0 / stx) * stx; x <= x1 + 1e-9; x += stx) out.push(`<line x1="${sx(x)}" y1="${P}" x2="${sx(x)}" y2="${H - P}"/>`);
  for (let y = Math.ceil(y0 / sty) * sty; y <= y1 + 1e-9; y += sty) out.push(`<line x1="${P}" y1="${sy(y)}" x2="${W - P}" y2="${sy(y)}"/>`);
  out.push('</g>');
  // assi
  const ax = y0 <= 0 && y1 >= 0 ? sy(0) : H - P;
  const ay = x0 <= 0 && x1 >= 0 ? sx(0) : P;
  out.push(`<g stroke="var(--ink-3)" stroke-width="1.4"><line x1="${P}" y1="${ax}" x2="${W - P}" y2="${ax}"/><line x1="${ay}" y1="${P}" x2="${ay}" y2="${H - P}"/></g>`);
  out.push('<g fill="var(--ink-3)" font-size="11" font-family="var(--f-mono)">');
  for (let x = Math.ceil(x0 / stx) * stx; x <= x1 + 1e-9; x += stx) if (Math.abs(x) > 1e-9) out.push(`<text x="${sx(x)}" y="${Math.min(H - 6, ax + 14)}" text-anchor="middle">${fmt(x)}</text>`);
  for (let y = Math.ceil(y0 / sty) * sty; y <= y1 + 1e-9; y += sty) if (Math.abs(y) > 1e-9) out.push(`<text x="${Math.max(4, ay - 5)}" y="${sy(y) + 4}" text-anchor="end">${fmt(y)}</text>`);
  out.push(`<text x="${W - P + 4}" y="${ax - 6}" font-style="italic">x</text><text x="${ay + 6}" y="${P - 8}" font-style="italic">y</text></g>`);
  // asintoti / rette notevoli
  out.push('<g stroke="var(--ink-2)" stroke-width="1.4" stroke-dasharray="6 5" fill="none">');
  for (const v of spec.vlines || []) out.push(`<line x1="${sx(v)}" y1="${P}" x2="${sx(v)}" y2="${H - P}"/>`);
  for (const h of spec.hlines || []) out.push(`<line x1="${P}" y1="${sy(h)}" x2="${W - P}" y2="${sy(h)}"/>`);
  for (const l of spec.lines || []) {
    const [m, q] = l;
    out.push(`<line x1="${sx(x0)}" y1="${sy(m * x0 + q)}" x2="${sx(x1)}" y2="${sy(m * x1 + q)}"/>`);
  }
  out.push('</g>');
  // aree
  for (const a of spec.areas || []) {
    const f = safeCompile(a.f);
    if (!f) continue;
    const pts = [];
    for (let k = 0; k <= 200; k++) {
      const x = a.from + ((a.to - a.from) * k) / 200;
      const y = f({ x });
      if (Number.isFinite(y)) pts.push(`${sx(x).toFixed(1)},${sy(Math.max(y0, Math.min(y1, y))).toFixed(1)}`);
    }
    if (pts.length) out.push(`<polygon points="${sx(a.from)},${sy(0)} ${pts.join(' ')} ${sx(a.to)},${sy(0)}" fill="var(--hl)" fill-opacity="0.45" stroke="none"/>`);
  }
  // curve
  const span = y1 - y0;
  samples.forEach((pts, i) => {
    const f = fns[i];
    let d = '';
    let pen = false;
    let prev = null;
    for (const [x, y] of pts) {
      const ok = Number.isFinite(y) && y > y0 - span * 2 && y < y1 + span * 2;
      if (!ok || (prev !== null && Math.abs(y - prev) > span * 0.9)) {
        pen = false;
        prev = ok ? y : null;
        if (!ok) continue;
      }
      const X = sx(x).toFixed(1);
      const Y = sy(Math.max(y0 - span * 0.05, Math.min(y1 + span * 0.05, y))).toFixed(1);
      d += (pen ? 'L' : 'M') + X + ',' + Y;
      pen = true;
      prev = y;
    }
    out.push(`<path d="${d}" fill="none" stroke="${f.color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#clip)"/>`);
    if (f.label) {
      const last = [...pts].reverse().find(([x, y]) => Number.isFinite(y) && y >= y0 && y <= y1);
      if (last) out.push(`<text x="${sx(last[0]) - 6}" y="${sy(last[1]) - 8}" text-anchor="end" fill="${f.color}" font-weight="700" font-size="13" font-style="italic">${esc(f.label)}</text>`);
    }
  });
  out.push(`<defs><clipPath id="clip"><rect x="${P}" y="${P - 6}" width="${W - 2 * P}" height="${H - 2 * P + 12}"/></clipPath></defs>`);
  for (const [x, y, label] of spec.points || []) {
    out.push(`<circle cx="${sx(x)}" cy="${sy(y)}" r="5" fill="var(--ink)"/>`);
    if (label) out.push(`<text x="${sx(x) + 8}" y="${sy(y) - 8}" fill="var(--ink)" font-size="12">${esc(label)}</text>`);
  }
  for (const [x, y] of spec.open || []) out.push(`<circle cx="${sx(x)}" cy="${sy(y)}" r="5" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>`);
  out.push('</svg>');
  return `<div class="plot-wrap">${out.join('')}</div>`;
}

function safeCompile(src) {
  try {
    return compile(src);
  } catch (e) {
    return null;
  }
}

function autoY(samples) {
  const ys = samples.flat().map((p) => p[1]).filter(Number.isFinite).sort((a, b) => a - b);
  if (!ys.length) return [-5, 5];
  const lo = ys[Math.floor(ys.length * 0.03)];
  const hi = ys[Math.floor(ys.length * 0.97)];
  const pad = (hi - lo) * 0.15 || 1;
  return [Math.min(lo - pad, 0 - pad * 0.2), Math.max(hi + pad, pad * 0.2)];
}
