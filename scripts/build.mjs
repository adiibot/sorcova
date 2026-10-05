import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from '../src/components.mjs';
import { config } from '../src/config.mjs';
import { hostingHtml } from './hosting.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const output = path.join(root, 'dist');
// Deliberate allowlist. Never copy the repository root or internal briefs.
export const assets = ['sorcova-wordmark.svg', 'wellbeing-morning.jpg', 'ava-avatar.svg', 'favicon.svg', 'PHOSPHOR-LICENSE.txt'];

export async function build() {
  const hosted = (locale, options) => hostingHtml(renderPage(locale, options), process.env.SITE_BASE_PATH || '', process.env.SITE_URL || '');
  await mkdir(path.join(output, 'assets'), { recursive: true });
  const [css, js] = await Promise.all([
    readFile(path.join(root, 'src/styles.css'), 'utf8'),
    readFile(path.join(root, 'src/client.js'), 'utf8'),
  ]);
  const embeddedAssets = await Promise.all(assets.filter((name) => !name.endsWith('.txt')).map(async (name) => {
    const data = await readFile(path.join(root, 'public/assets', name));
    return [name, `data:${name.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg'};base64,${data.toString('base64')}`];
  }));
  await Promise.all(['en', 'fr'].map(async (locale) => {
    await mkdir(path.join(output, locale), { recursive: true });
    await writeFile(path.join(output, locale, 'index.html'), hosted(locale));
    // Self-contained review copies also work over file:// in restricted environments.
    let standalone = renderPage(locale)
      .replace('<link rel="stylesheet" href="/styles.css">', `<style>${css}</style>`)
      .replace('<script src="/client.js" type="module"></script>', '')
      .replace('</body>', `<script>${js.replaceAll('</script', '<\\/script')}</script></body>`)
      .replaceAll('href="/en/"', 'href="preview-en.html"')
      .replaceAll('href="/fr/"', 'href="preview-fr.html"');
    standalone = standalone
      .replaceAll('href=\\"/en/\\"', 'href=\\"preview.html?lang=en\\"')
      .replaceAll('href=\\"/fr/\\"', 'href=\\"preview.html?lang=fr\\"');
    for (const [name, uri] of embeddedAssets) standalone = standalone.replaceAll(`/assets/${name}`, uri);
    await writeFile(path.join(output, `preview-${locale}.html`), standalone);
    if (locale === 'en') await writeFile(path.join(output, 'preview.html'), standalone);
  }));
  await Promise.all([
    writeFile(path.join(output, 'index.html'), hosted('en')),
    writeFile(path.join(output, '404.html'), hosted('en', { notFound: true })),
    writeFile(path.join(output, 'robots.txt'), `User-agent: *\n${config.allowIndexing ? 'Allow: /' : 'Disallow: /'}\n`),
    copyFile(path.join(root, 'src/styles.css'), path.join(output, 'styles.css')),
    copyFile(path.join(root, 'src/client.js'), path.join(output, 'client.js')),
    ...assets.map((name) => copyFile(path.join(root, 'public/assets', name), path.join(output, 'assets', name))),
  ]);
  console.log('Built English and French pages in dist/. Source references are excluded.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
