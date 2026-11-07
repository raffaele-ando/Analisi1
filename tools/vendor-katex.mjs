// Genera app/vendor/katex.css con i font woff2 incorporati come data URI
// (la CSP degli Artifact ammette font solo da fonts.gstatic.com o inline).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'node_modules/katex/dist');
let css = fs.readFileSync(path.join(dist, 'katex.min.css'), 'utf8');
css = css.replace(/src:url\(fonts\/([^)]+?\.woff2)\) format\("woff2"\),url\([^)]+\) format\("woff"\),url\([^)]+\) format\("truetype"\)/g, (m, f) => {
  const b64 = fs.readFileSync(path.join(dist, 'fonts', f)).toString('base64');
  return `src:url(data:font/woff2;base64,${b64}) format("woff2")`;
});
if (/url\(fonts\//.test(css)) throw new Error('font non incorporati: formato del CSS cambiato');
fs.writeFileSync(path.join(root, 'app/vendor/katex.css'), css);
console.log('katex.css', (css.length / 1024).toFixed(0), 'KB');
