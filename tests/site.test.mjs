import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { content } from '../src/content.mjs';
import { config } from '../src/config.mjs';
import { renderPage, escapeHtml } from '../src/components.mjs';
import { resolvePublicPath } from '../scripts/serve.mjs';
import { build, output } from '../scripts/build.mjs';
import { rhythmArtwork } from '../src/rhythms.mjs';

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  return typeof value;
}

test('English and French have the same complete content structure', () => {
  assert.deepEqual(shape(content.en), shape(content.fr));
});

test('Both audience enquiry routes use the confirmed address', () => {
  assert.equal(config.memberEmail, 'lavinia@sorcovahealth.com');
  assert.equal(config.employerEmail, 'lavinia@sorcovahealth.com');
});

test('Both languages are embedded for an offline, in-place language switch', () => {
  const html = renderPage('en');
  const data = JSON.parse(html.match(/<script type="application\/json" id="site-languages">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(Object.keys(data), ['en', 'fr']);
  for (const locale of ['en', 'fr']) {
    assert.ok(data[locale].body.includes(content[locale].hero.title[0]));
    assert.ok(data[locale].body.includes(`data-language="${locale}"`));
    assert.equal(data[locale].title, content[locale].title);
    assert.ok(data[locale].body.includes('id="enquiry-dialog"'));
  }
});

test('Whole-person positioning covers stress, mental wellbeing, physical health and longevity', () => {
  for (const locale of ['en', 'fr']) assert.equal(content[locale].whole.pillars.length, 4);
  assert.match(content.en.hero.text, /mental wellbeing/);
  assert.match(content.en.description, /longevity/i);
  assert.equal(content.en.hero.label, 'A healthier you. A fuller life.');
  assert.doesNotMatch(content.en.hero.label, /precision stress medicine/i);
});

test('Every wellbeing tab has distinct illustrative motion artwork', () => {
  const kinds = ['sleep', 'energy', 'recovery', 'mind'];
  const drawings = kinds.map(rhythmArtwork);
  assert.equal(new Set(drawings).size, 4);
  for (const [i, drawing] of drawings.entries()) {
    assert.match(drawing, /viewBox="0 0 320 280"/);
    assert.ok(drawing.includes(`id="rhythm-${kinds[i]}-gradient"`));
    assert.doesNotMatch(drawing, /<animate|<script/);
  }
  assert.throws(() => rhythmArtwork('unknown'), /Unknown rhythm/);
  assert.match(drawings[0], /clip-path="url\(#rhythm-sleep-window\)"/);
  assert.doesNotMatch(drawings[0], /<ellipse/);
  assert.equal((drawings[1].match(/class="rhythm-ray rhythm-energy-ray"/g) || []).length, 12);
  assert.doesNotMatch(drawings[1], /<rect/);
  assert.equal((drawings[2].match(/rhythm-recovery-ripple/g) || []).length, 3);
  assert.doesNotMatch(drawings[2], /<path/);
  for (const locale of ['en', 'fr']) {
    const html = renderPage(locale);
    assert.ok(html.includes(escapeHtml(content[locale].everyday.motion.disclaimer)));
    assert.doesNotMatch(html, /data-motion-toggle/);
    assert.match(html, /id="everyday"/);
    assert.equal(content[locale].everyday.motion.descriptions.length, 4);
  }
});

test('Rhythm animations use only transform and opacity and have motion safeguards', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const animations = [...css.matchAll(/@keyframes rhythm-[^\n]+/g)];
  assert.equal(animations.length, 7);
  for (const [animation] of animations) {
    const properties = [...animation.matchAll(/\b([a-z-]+)\s*:/g)].map((match) => match[1]);
    assert.ok(properties.every((property) => ['transform', 'opacity'].includes(property)));
  }
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /animation-iteration-count: 1/);
  assert.match(css, /animation-duration: 4\.8s/);
  assert.match(css, /data-motion-visible='true'/);
  assert.match(css, /\.everyday-panel:not\(\[hidden\]\)/);
});

for (const locale of ['en', 'fr']) {
  const html = renderPage(locale);
  test(`${locale}: unique IDs and valid fragment/ARIA destinations`, () => {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, 'IDs must be unique');
    for (const match of html.matchAll(/(?:href="#|aria-controls="|aria-labelledby="|aria-describedby=")([^"]+)"/g)) {
      for (const id of match[1].split(' ')) assert.ok(ids.includes(id), `Missing destination ${id}`);
    }
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(`<html lang="${locale}"`));
  });

  test(`${locale}: equal audience calls to action and working email fallbacks`, () => {
    const member = [...html.matchAll(/data-contact="member"/g)];
    const employer = [...html.matchAll(/data-contact="employer"/g)];
    assert.equal(member.length, employer.length);
    assert.equal(member.length, 2);
    assert.equal((html.match(/href="mailto:lavinia@sorcovahealth.com\?subject=/g) || []).length, 4);
    assert.ok(html.includes(`href="/${content[locale].otherLocale}/"`));
    assert.ok(html.includes('data-language'));
  });

  test(`${locale}: no draft placeholders, prohibited member codes or unsupported badges`, () => {
    const publicCopy = JSON.stringify(content[locale]);
    assert.doesNotMatch(publicCopy, /[—–]/u, 'Visible copy must not use long dashes');
    assert.doesNotMatch(publicCopy, /\[(?:Name|Nom|XX|Copy to write)|\b(?:DAVI|VRES|CSBI|PATESS|GUARDIA|HDS|OVH|Clerk|NestJS|Prisma)\b/i);
    assert.doesNotMatch(publicCopy, /clinically proven|CE marked|marquage CE|GDPR compliant|conforme au RGPD/i);
    assert.doesNotMatch(publicCopy, /\d+\s*%|€|\b\d+\s*\/\s*\d+\b/);
  });
}

test('HTML escaping protects copied and translated content', () => {
  assert.equal(escapeHtml('<img src=x onerror="bad()"> & \'test\''), '&lt;img src=x onerror=&quot;bad()&quot;&gt; &amp; &#39;test&#39;');
});

test('Preview path resolution rejects traversal and hidden files', () => {
  for (const url of ['/../additional_info.md', '/%2e%2e/additional_info.md', '/.env', '/assets/../additional_info.md', '/assets%5c..%5c.env', '/%00', '/%ZZ']) {
    assert.equal(resolvePublicPath(url), null, url);
  }
  assert.equal(resolvePublicPath('/fr/'), path.join(output, 'fr/index.html'));
  assert.equal(resolvePublicPath('/styles.css?v=1'), path.join(output, 'styles.css'));
});

test('The primary button scrim preserves sufficient contrast across the gradient', () => {
  const luminance = (rgb) => rgb.map((v) => v / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  for (let position = 0; position <= 100; position++) {
    const color = [124, 58, 237].map((v, i) => {
      const gradient = v + ([45, 212, 191][i] - v) * position / 100;
      return gradient * .44 + [33, 42, 87][i] * .56;
    });
    assert.ok(1.05 / (luminance(color) + .05) >= 4.5, `Gradient position ${position}`);
  }
});

test('Build produces standalone reviews and excludes internal reference material', async () => {
  await build();
  const files = await readdir(output, { recursive: true });
  assert.ok(files.includes('en/index.html'));
  assert.ok(files.includes('fr/index.html'));
  assert.ok(files.includes('preview.html'));
  for (const file of files) assert.doesNotMatch(file, /\.pdf$|\.zip$|\.md$|sorcova-workplace|content\.mjs|config\.mjs/);
  const standalone = await readFile(path.join(output, 'preview-fr.html'), 'utf8');
  assert.ok(standalone.includes('data:image/jpeg;base64,'));
  assert.ok(standalone.includes('href="preview-en.html"'));
  assert.doesNotMatch(standalone, /(?:src|href)="\/(?:assets|client|styles)/);
  const robots = await readFile(path.join(output, 'robots.txt'), 'utf8');
  assert.ok(robots.includes('Disallow: /'));
});

test('Unknown locales are rejected instead of generating partial pages', () => {
  assert.throws(() => renderPage('de'), /Unsupported locale/);
});
