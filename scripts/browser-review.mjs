import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build, root, output } from './build.mjs';
import { escapeHtml } from '../src/components.mjs';

await build();
const previews = await Promise.all(['en', 'fr'].map((locale) => readFile(path.join(output, `preview-${locale}.html`), 'utf8')));
const checks = await readFile(path.join(root, 'tests/browser-checks.js'), 'utf8');
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sorcova browser checks</title><style>
body{margin:24px;font:14px/1.5 system-ui,sans-serif;background:#f2f5ff;color:#212a57}h1{font-size:20px}button,select{padding:12px;border:1px solid #c4cbea;border-radius:12px;background:white;color:#212a57;font:inherit}#results{background:white;padding:20px;border-radius:16px;max-width:1080px}#results p{margin:4px 0}#previews{display:flex;align-items:start;gap:24px;margin-top:24px}iframe{width:390px;height:844px;border:1px solid #c4cbea;flex:none;background:white}header{display:flex;align-items:center;gap:24px;flex-wrap:wrap}summary{cursor:pointer}
</style></head><body><header><h1>Sorcova browser checks</h1><label>Preview width <select id="width"><option>320</option><option selected>390</option><option>768</option><option>1024</option><option>1440</option></select></label><button id="run-checks">Run browser checks</button></header><div id="results" role="status">Ready. Checks run locally and never send enquiries.</div><div id="previews">${previews.map((html, i) => `<iframe title="${i ? 'French' : 'English'} preview" data-locale="${i ? 'fr' : 'en'}" srcdoc="${escapeHtml(html)}"></iframe>`).join('')}</div><script>${checks}</script></body></html>`;
await mkdir(path.join(root, 'test-results'), { recursive: true });
await writeFile(path.join(root, 'test-results/browser-review.html'), page);
console.log('Open test-results/browser-review.html to run real-browser viewport and interaction checks. No server required.');
