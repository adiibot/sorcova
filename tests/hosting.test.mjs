import test from 'node:test';
import assert from 'node:assert/strict';
import { hostingHtml } from '../scripts/hosting.mjs';
import { renderPage } from '../src/components.mjs';

for (const base of ['', '/sorcova']) {
  for (const locale of ['en', 'fr']) {
    test(`Hosting ${base || '/'}: ${locale} assets and translated links stay within site`, () => {
      const html = hostingHtml(renderPage(locale), base, `https://adiibot.github.io${base}`);
      assert.ok(html.includes(`src="${base}/client.js"`));
      assert.ok(html.includes(`href="${base}/styles.css"`));
      assert.ok(html.includes(`src="${base}/assets/wellbeing-morning.jpg"`));
      assert.ok(html.includes(`name="site-base" content="${base}"`));
      assert.ok(html.includes(`rel="canonical" href="https://adiibot.github.io${base}/${locale}/"`));
      const languages = JSON.parse(html.match(/id="site-languages">([\s\S]*?)<\/script>/)[1]);
      for (const page of Object.values(languages)) {
        assert.ok(page.body.includes(`href="${base}/en/"`));
        assert.ok(page.body.includes(`href="${base}/fr/"`));
        assert.ok(page.body.includes(`src="${base}/assets/wellbeing-morning.jpg"`));
        assert.match(page.body, /href="mailto:lavinia@sorcovahealth.com/);
      }
    });
  }
}
test('Unsafe hosting paths and conflicting canonical URLs are rejected', () => {
  for (const base of ['/../oops', '//evil.test', '/x?y', '/x"']) assert.throws(() => hostingHtml(renderPage('en'), base));
  assert.throws(() => hostingHtml(renderPage('en'), '/sorcova', 'https://example.com/other'));
  assert.throws(() => hostingHtml(renderPage('en'), '', 'javascript:alert(1)'));
});
