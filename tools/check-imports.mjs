// Verifica che ogni import relativo nei moduli dell'app si risolva a un file esistente.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'app');
let bad = 0;
const visit = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) { visit(p); continue; }
    if (!f.name.endsWith('.js')) continue;
    const src = fs.readFileSync(p, 'utf8');
    for (const m of src.matchAll(/(?:import|export)[^'"]*?from\s+['"](\.[^'"]+)['"]|import\s+['"](\.[^'"]+)['"]/g)) {
      const spec = m[1] || m[2];
      const target = path.resolve(path.dirname(p), spec);
      if (!fs.existsSync(target)) {
        bad++;
        console.log(`✗ ${path.relative(root, p)} → ${spec}`);
      }
    }
  }
};
visit(root);
console.log(bad ? `${bad} import non risolti` : '✓ import risolti');
process.exit(bad ? 1 : 0);
