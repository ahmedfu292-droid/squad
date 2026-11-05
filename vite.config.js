import { defineConfig } from 'vite';
import { cp, readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

/*
 * The Squad is a classic multi-page application: the entry HTML loads many
 * non-module scripts (auth.js, app.js, world.js, ...) that Vite cannot bundle.
 * Vite used to emit an index.html whose script/stylesheet/icon URLs did not
 * exist in dist, so the deployed page 404'd every asset. This plugin copies the
 * referenced static files verbatim after the bundle is written.
 */

// Files that belong to tooling/harnesses, never to the served bundle.
const EXCLUDE = new Set([
  'vite.config.js',
  'node_modules',
  '.git',
  'dist',
  'package.json',
  'package-lock.json',
  'firebase.json',
  '.firebaserc',
]);

// Root files that are consumed by tests/audits only, not by the browser.
const EXCLUDE_PATTERNS = [
  /^tests-v\d+.*\.js$/,
  /^test-.*\.js$/,
  /check-.*\.mjs$/,
  /-check\.mjs$/,
  /\.mjs$/,
  /^verify-test\.js$/,
];

const STATIC_EXT = /\.(?:js|css|json|png|jpe?g|webp|svg|gif|ico|woff2?|rules|txt)$/i;

async function collect(dir, base = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (EXCLUDE.has(rel) || EXCLUDE.has(entry.name)) continue;
    if (EDITOR_ONLY.has(rel)) continue;
    if (entry.isDirectory()) {
      out.push(...await collect(path.join(dir, entry.name), rel));
      continue;
    }
    if (!STATIC_EXT.test(entry.name)) continue;
    if (EXCLUDE_PATTERNS.some((re) => re.test(rel))) continue;
    out.push(rel);
  }
  return out;
}

const EDITOR_ONLY = new Set(['THE_SQUAD_v188_FIXED_DOWNLOAD.html', 'THE_SQUAD_v188_FIXED_DOWNLOAD.html']);

function copyStaticRuntime() {
  let root;
  return {
    name: 'squad:copy-static-runtime',
    apply: 'build',
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outDir = path.join(root, 'dist');
      const files = await collect(root);
      await mkdir(outDir, { recursive: true });
      let copied = 0;
      for (const rel of files) {
        const dest = path.join(outDir, rel);
        await mkdir(path.dirname(dest), { recursive: true });
        await cp(path.join(root, rel), dest, { force: true });
        copied += 1;
      }
      console.log(`\n[squad] copied ${copied} static runtime files into dist/`);
    },
  };
}

export default defineConfig({
  base: './',
  server: { host: '0.0.0.0', port: 5173 },
  preview: { host: '0.0.0.0', port: 4173 },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2019',
  },
  plugins: [copyStaticRuntime()],
});
