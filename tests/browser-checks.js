// Runs only in the local test harness, never in the public website.
// No form is submitted and no email client or download is opened.
const frames = [...document.querySelectorAll('iframe')];
const results = [];
function check(label, condition, detail = '') {
  results.push({ label, passed: Boolean(condition), detail: condition ? '' : detail });
  document.querySelector('#results').textContent = `Running: ${label}. ${results.length} checks completed.`;
}
const nextFrame = (view) => Promise.race([
  new Promise((resolve) => view.requestAnimationFrame(resolve)),
  new Promise((resolve) => setTimeout(resolve, 100)),
]);

async function inspect(frame) {
  if (frame.contentDocument?.readyState !== 'complete') await new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }));
  const doc = frame.contentDocument;
  const view = frame.contentWindow;
  await doc.fonts.ready;
  const locale = frame.dataset.locale;
  const label = (text) => `${locale}: ${text}`;
  // In srcdoc, fragment URLs resolve against the harness URL. Keep test clicks
  // in this document while still exercising the website's menu handlers.
  doc.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#"]')) event.preventDefault();
  });
  check(label('JavaScript enhancement loaded'), doc.documentElement.classList.contains('js'));
  const originalTitle = doc.title;
  const otherLocale = locale === 'en' ? 'fr' : 'en';
  const marker = doc.documentElement;
  doc.querySelector(`[data-language="${otherLocale}"]`).click();
  check(label('language switches in place'), doc.documentElement === marker && doc.documentElement.lang === otherLocale);
  check(label('language updates page title'), doc.title !== originalTitle);
  check(label('language updates visible heading'), doc.querySelector('h1').textContent.startsWith(otherLocale === 'fr' ? 'Plus de vie' : 'More life'));
  check(label('language updates selected control'), doc.querySelector(`[data-language="${otherLocale}"]`).getAttribute('aria-current') === 'page');
  doc.querySelectorAll('[role="tab"]')[1].click();
  check(label('tabs work after changing language'), !doc.querySelector('#panel-energy').hidden);
  doc.querySelector(`[data-language="${locale}"]`).click();
  check(label('language switches back without reloading'), doc.documentElement.lang === locale && doc.title === originalTitle);
  check(label('translated embedded images remain available'), [...doc.images].every((image) => image.src.startsWith('data:')));
  for (const width of [320, 390, 768, 1024, 1440]) {
    frame.style.width = `${width + 2}px`;
    await nextFrame(view);
    await nextFrame(view);
    const actual = doc.documentElement.clientWidth;
    const scroll = doc.documentElement.scrollWidth;
    const overflow = [...doc.body.querySelectorAll('*')].filter((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.width > 0 && bounds.right > actual + 1 && !element.closest('.tabs') && !element.closest('dialog:not([open])');
    }).map((element) => `${element.tagName}.${element.className}`).slice(0, 6).join(', ');
    check(label(`${width}px: no page overflow`), scroll <= actual + 1, `${scroll}px page at ${actual}px viewport; ${overflow}`);
    if (width < 768) {
      const cards = [...doc.querySelectorAll('.audience-card')].map((el) => el.getBoundingClientRect());
      check(label(`${width}px: audience cards stack`), cards[1].top >= cards[0].bottom);
    }
    check(label(`${width}px: navigation fits`), doc.querySelector('.nav-actions').getBoundingClientRect().right <= actual + 1);
  }
  frame.style.width = '392px';
  await nextFrame(view);
  const menu = doc.querySelector('.mobile-menu');
  menu.querySelector('summary').click();
  check(label('mobile menu opens'), menu.open);
  menu.querySelector('a').click();
  check(label('mobile menu closes after navigation'), !menu.open);
  const tabs = [...doc.querySelectorAll('[role="tab"]')];
  const explorer = doc.querySelector('[data-tabs]');
  const reduced = view.matchMedia('(prefers-reduced-motion: reduce)').matches;
  check(label('motion preference is respected'), explorer.dataset.motionReduced === String(reduced));
  check(label('no visible motion control remains'), !explorer.querySelector('[data-motion-toggle]'));
  if (reduced) check(label('reduced motion disables automatic animation'), view.getComputedStyle(doc.querySelector('.rhythm-sleep-bloom')).animationName === 'none');
  // Language changes replace the page, so refresh tab references.
  tabs.splice(0, tabs.length, ...doc.querySelectorAll('[role="tab"]'));
  const motionNames = new Set();
  for (const tab of tabs) {
    tab.click();
    const panel = doc.getElementById(tab.getAttribute('aria-controls'));
    const art = panel.querySelector('.rhythm-art');
    check(label(`${tab.id}: dedicated artwork exists`), Boolean(art.querySelector('.rhythm-canvas')));
    if (!reduced) {
      const names = [...art.querySelectorAll('*')].map((node) => view.getComputedStyle(node).animationName).filter((name) => name !== 'none');
      check(label(`${tab.id}: has animated geometry`), names.length > 0);
      motionNames.add(names.sort().join(','));
      const timings = art.getAnimations({ subtree: true }).map((item) => item.effect.getComputedTiming());
      check(label(`${tab.id}: motion finishes within five seconds`), timings.length > 0 && timings.every((timing) => timing.iterations === 1 && timing.endTime <= 5000));
      const animation = art.getAnimations({ subtree: true }).find((item) => item.animationName?.startsWith('rhythm-'));
      if (animation) {
        const time = animation.currentTime;
        const state = animation.playState;
        const target = animation.effect.target;
        const duration = animation.effect.getTiming().duration;
        animation.pause();
        animation.currentTime = duration * .1;
        const before = `${view.getComputedStyle(target).transform}/${view.getComputedStyle(target).opacity}`;
        animation.currentTime = duration * .55;
        const after = `${view.getComputedStyle(target).transform}/${view.getComputedStyle(target).opacity}`;
        check(label(`${tab.id}: rhythm changes shape or intensity over time`), before !== after);
        animation.currentTime = time;
        if (state === 'running') animation.play();
      } else {
        check(label(`${tab.id}: rhythm animation is instantiated`), false);
      }
    }
  }
  if (!reduced) check(label('all four motion patterns are distinct'), motionNames.size === 4);
  tabs[1].click();
  check(label('tab click changes visible content'), !doc.querySelector('#panel-energy').hidden && doc.querySelector('#panel-sleep').hidden);
  tabs[1].dispatchEvent(new view.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  check(label('Right arrow selects next tab'), tabs[2].getAttribute('aria-selected') === 'true' && doc.activeElement === tabs[2]);
  tabs[2].dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  check(label('Home selects first tab'), tabs[0].getAttribute('aria-selected') === 'true');
  tabs[0].dispatchEvent(new view.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  check(label('End selects last tab'), tabs[3].getAttribute('aria-selected') === 'true');
  tabs[0].click();
  const faq = doc.querySelector('.faq-list details');
  faq.querySelector('summary').click();
  check(label('FAQ expands'), faq.open);
  faq.querySelector('summary').click();
  const dialog = doc.querySelector('dialog');
  const form = dialog.querySelector('form');
  for (const audience of ['member', 'employer']) {
    const link = doc.querySelector(`[data-contact="${audience}"]`);
    link.click();
    check(label(`${audience} enquiry opens`), dialog.open);
    check(label(`${audience} enquiry autofocus`), doc.activeElement === form.elements.name);
    check(label(`${audience} enquiry rejects empty fields`), !form.checkValidity());
    check(label(`${audience} organisation field visibility`), dialog.querySelector('[data-organisation]').hidden === (audience === 'member'));
    form.elements.name.value = 'Website test';
    form.elements.email.value = 'not-an-email';
    check(label(`${audience} enquiry rejects invalid email`), !form.checkValidity());
    form.elements.email.value = 'website-test@example.invalid';
    check(label(`${audience} enquiry accepts valid format`), form.checkValidity());
    dialog.querySelector('[data-close]').click();
    check(label(`${audience} enquiry close restores focus`), !dialog.open && doc.activeElement === link);
    check(label(`${audience} enquiry clears entered values`), form.elements.name.value === '' && form.elements.email.value === '');
  }
  check(label('all embedded images loaded'), [...doc.images].every((image) => image.complete && image.naturalWidth > 0));
  check(label('Plus Jakarta Sans loaded'), [...doc.fonts].some((font) => font.family.includes('Plus Jakarta Sans') && font.status === 'loaded'));
  doc.querySelector(`[data-language="${otherLocale}"]`).click();
  doc.querySelector('[data-contact="member"]').click();
  const translatedDialog = doc.querySelector('dialog');
  check(label('enquiry works after changing language'), translatedDialog.open);
  translatedDialog.querySelector('[data-close]').click();
  doc.querySelector(`[data-language="${locale}"]`).click();
  view.scrollTo({ top: 0, behavior: 'instant' });
}

document.querySelector('#run-checks').addEventListener('click', async (event) => {
  event.target.disabled = true;
  results.length = 0;
  try {
    for (const frame of frames) await inspect(frame);
    const failed = results.filter((result) => !result.passed);
    const output = document.querySelector('#results');
    output.textContent = '';
    const heading = document.createElement('h2');
    heading.textContent = `${results.length - failed.length}/${results.length} browser checks passed`;
    output.append(heading);
    for (const result of failed) {
      const line = document.createElement('p');
      line.textContent = `FAIL: ${result.label}. ${result.detail}`;
      output.append(line);
    }
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'All check results';
    details.append(summary);
    for (const result of results) {
      const line = document.createElement('p');
      line.textContent = `${result.passed ? 'PASS' : 'FAIL'}: ${result.label}`;
      details.append(line);
    }
    output.append(details);
  } catch (error) {
    document.querySelector('#results').textContent = `Browser checks could not complete: ${error.message}`;
  } finally {
    event.target.disabled = false;
  }
});

document.querySelector('#width').addEventListener('change', (event) => {
  frames.forEach((frame) => { frame.style.width = `${Number(event.target.value) + 2}px`; });
});
