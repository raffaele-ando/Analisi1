#!/usr/bin/env node
// Costruisce dist/: copia app/ e genera
//  - dist/artifact.html  pagina (senza doctype/head) da pubblicare come Artifact, con CSS inline
//  - dist/index.html     stessa pagina in un documento completo, per provare in locale
//  - dist/files.json     elenco dei file da pubblicare (percorso pubblicato -> sorgente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const files = {};
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (!f.name.endsWith('.md')) files[path.relative(root, p)] = path.relative(root, p);
  }
}
walk(path.join(root, 'app'));
for (const rel of Object.keys(files)) {
  const out = path.join(dist, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(path.join(root, rel), out);
}

const css = [fs.readFileSync(path.join(root, 'app/vendor/katex.css'), 'utf8'), fs.readFileSync(path.join(root, 'app/app.css'), 'utf8')].join('\n');
if (/\burl\(\s*['"]?(?!data:)(?!#)/.test(css.replace(/url\(\s*['"]?data:[^)]*\)/g, ''))) throw new Error('CSS con URL esterni: va inline solo con data:');

const fragment = `<title>Analisi 1 · Percorso</title>
<link rel="icon" href="data:,">
<style>
${css}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.2.0/math.min.js"></script>
<div id="app"></div>
<noscript>Per usare l'app serve JavaScript.</noscript>
<script type="module" src="app/main.js"></script>
`;

fs.writeFileSync(path.join(dist, 'artifact.html'), fragment);
fs.writeFileSync(
  path.join(dist, 'index.html'),
  `<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n</head>\n<body>\n${fragment}</body>\n</html>\n`,
);
const list = { 'app/main.js': 'dist/app/main.js' };
for (const rel of Object.keys(files)) list[rel] = 'dist/' + rel;
fs.writeFileSync(path.join(dist, 'files.json'), JSON.stringify(list, null, 1));
const bytes = fs.statSync(path.join(dist, 'artifact.html')).size + Object.keys(files).reduce((n, f) => n + fs.statSync(path.join(root, f)).size, 0);
console.log(`dist/: ${Object.keys(files).length} file, ${(bytes / 1024).toFixed(0)} KB, pagina ${(fs.statSync(path.join(dist, 'artifact.html')).size / 1024).toFixed(0)} KB`);
