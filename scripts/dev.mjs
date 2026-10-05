import { watch } from 'node:fs';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { build, root } from './build.mjs';
import { startServer } from './serve.mjs';

await build();
startServer();
let timer;
let building = false;
let pending = false;
function rebuild() {
  if (building) { pending = true; return; }
  building = true;
  execFile(process.execPath, [path.join(root, 'scripts/build.mjs')], (error, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    if (error) console.error('Build failed. Fix the source and save again.');
    building = false;
    if (pending) { pending = false; rebuild(); }
  });
}
for (const directory of ['src', 'public']) {
  watch(path.join(root, directory), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}
console.log('Watching src/ and public/. Refresh the browser after a rebuild.');
