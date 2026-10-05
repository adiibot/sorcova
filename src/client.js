document.documentElement.classList.replace('no-js', 'js');

const languages = JSON.parse(document.querySelector('#site-languages').textContent);
const initialDocumentLocale = document.documentElement.lang;
const siteBase = document.querySelector('meta[name="site-base"]')?.content || '';
let pageEvents;
let revealObserver;
let rhythmObservers = [];

function initialisePage() {
  pageEvents?.abort();
  revealObserver?.disconnect();
  rhythmObservers.forEach((observer) => observer.disconnect());
  rhythmObservers = [];
  pageEvents = new AbortController();
  const listen = (target, event, handler) => target.addEventListener(event, handler, { signal: pageEvents.signal });

  const menu = document.querySelector('.mobile-menu');
  menu?.querySelectorAll('a').forEach((link) => {
    listen(link, 'click', () => { menu.open = false; });
  });
  listen(document, 'keydown', (event) => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  listen(document, 'click', (event) => {
    if (menu?.open && !menu.contains(event.target)) menu.open = false;
  });

  // Roving tab focus: arrows wrap; Home/End select the first/last tab.
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const panels = [...group.querySelectorAll('[role="tabpanel"]')];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = !('IntersectionObserver' in window);
    const updateMotion = () => {
      group.dataset.motionVisible = String(inView && !document.hidden);
      group.dataset.motionReduced = String(reducedMotion.matches);
    };
    listen(reducedMotion, 'change', updateMotion);
    listen(document, 'visibilitychange', updateMotion);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        updateMotion();
      }, { threshold: 0 });
      observer.observe(group);
      rhythmObservers.push(observer);
    }
    updateMotion();
    const select = (tab, moveFocus = false) => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
      if (moveFocus) {
        tab.focus({ preventScroll: true });
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
      }
    };
    tabs.forEach((tab, index) => {
      listen(tab, 'click', () => select(tab));
      listen(tab, 'keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(tabs[next], true);
      });
    });
  });

  const dialog = document.querySelector('#enquiry-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const form = dialog.querySelector('form');
    const strings = dialog.dataset;
    const organisation = dialog.querySelector('[data-organisation]');
    const status = dialog.querySelector('[data-status]');
    const fallback = dialog.querySelector('[data-download-fallback]');
    const submit = dialog.querySelector('[data-submit]');
    let audience = 'member';
    let opener;

    const email = () => audience === 'employer' ? strings.employerEmail : strings.memberEmail;
    const subject = () => audience === 'employer' ? strings.subjectEmployer : strings.subjectMember;
    const draft = () => {
      const data = new FormData(form);
      return [subject(), '', `${strings.name}: ${data.get('name').trim()}`, `${strings.email}: ${data.get('email').trim()}`,
        ...(audience === 'employer' ? [`${strings.organisation}: ${data.get('organisation').trim()}`] : []),
        '', `${strings.message}:`, data.get('message').trim(),
      ].join('\n');
    };
    const save = () => {
      if (!form.reportValidity()) return;
      const url = URL.createObjectURL(new Blob([draft()], { type: 'text/plain;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `sorcova-${audience}-enquiry.txt`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = strings.saved;
    };

    document.querySelectorAll('[data-contact]').forEach((link) => {
      listen(link, 'click', (event) => {
        // Preserve native mailto behaviour for modified clicks and older browsers.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        audience = link.dataset.contact;
        form.reset();
        status.textContent = '';
        fallback.hidden = true;
        organisation.hidden = audience !== 'employer';
        dialog.querySelector('#enquiry-title').textContent = audience === 'employer' ? strings.employerTitle : strings.memberTitle;
        dialog.querySelector('#enquiry-description').textContent = audience === 'employer' ? strings.employerText : strings.memberText;
        dialog.querySelector('#enquiry-note').textContent = email() ? strings.emailNote : strings.draftNote;
        submit.firstChild.textContent = email() ? strings.submit : strings.save;
        document.body.classList.add('dialog-open');
        dialog.showModal();
        form.elements.name.focus();
      });
    });
    const clearDialog = () => {
      if (dialog.open) return;
      document.body.classList.remove('dialog-open');
      form.reset();
      status.textContent = '';
      opener?.focus({ preventScroll: true });
    };
    const closeDialog = () => {
      dialog.close();
      // Clear private draft fields immediately, even in a throttled browser tab.
      clearDialog();
    };
    listen(dialog.querySelector('[data-close]'), 'click', closeDialog);
    listen(dialog, 'click', (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeDialog();
    });
    listen(dialog, 'close', clearDialog);
    listen(form, 'submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (!email()) return save();
      const href = `mailto:${email()}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(draft())}`;
      // A mailto link prepares a draft; it never confirms that a message was sent.
      window.location.href = href;
      status.textContent = strings.prepared;
      fallback.hidden = false;
    });
    listen(dialog.querySelector('[data-save]'), 'click', save);
  }

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.whole-intro, .pillar, .audience-card, .signal-card, .care-principles article').forEach((element) => revealObserver.observe(element));
  }
}

function switchLanguage(locale, { updateHistory = false, focus = false } = {}) {
  if (!languages[locale] || locale === document.documentElement.lang) return;
  const section = [...document.querySelectorAll('main section[id], .audience-card[id]')]
    .filter((element) => element.getBoundingClientRect().top <= 150).at(-1);
  const sectionId = section?.id;
  const offset = section?.getBoundingClientRect().top;
  const previousY = window.scrollY;
  const page = languages[locale];
  document.body.classList.remove('dialog-open');
  document.body.innerHTML = page.body;
  document.documentElement.lang = locale;
  document.title = page.title;
  document.querySelector('meta[name="description"]').content = page.description;
  document.querySelector('meta[property="og:title"]').content = page.title;
  document.querySelector('meta[property="og:description"]').content = page.description;
  document.querySelector('meta[property="og:locale"]').content = locale === 'fr' ? 'fr_FR' : 'en_GB';
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = canonical.href.replace(/\/(en|fr)\/$/, `/${locale}/`);
  initialisePage();
  if (updateHistory && location.protocol !== 'about:') {
    const url = new URL(location.href);
    if (location.protocol === 'file:') url.searchParams.set('lang', locale);
    else { url.pathname = `${siteBase}/${locale}/`; url.searchParams.delete('lang'); }
    // Some file-preview browsers restrict History API changes. Translation still works.
    try { history.pushState({ locale }, '', url); } catch { /* Keep the existing URL. */ }
  }
  const target = sectionId && document.getElementById(sectionId);
  window.scrollTo({ top: target ? target.getBoundingClientRect().top + window.scrollY - offset : previousY, behavior: 'instant' });
  if (focus) document.querySelector(`[data-language="${locale}"]`).focus({ preventScroll: true });
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-language]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  switchLanguage(link.dataset.language, { updateHistory: true, focus: true });
});
window.addEventListener('popstate', () => {
  const locale = new URLSearchParams(location.search).get('lang') || location.pathname.slice(siteBase.length).match(/^\/(en|fr)\//)?.[1] || initialDocumentLocale;
  switchLanguage(locale);
});
initialisePage();
const initialLocale = new URLSearchParams(location.search).get('lang');
if (initialLocale) switchLanguage(initialLocale);
