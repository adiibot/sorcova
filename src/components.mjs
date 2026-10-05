import { content } from './content.mjs';
import { config } from './config.mjs';
import { icon } from './icons.mjs';
import { rhythmArtwork } from './rhythms.mjs';

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const e = escapeHtml;
const lines = (value) => e(value).replaceAll('\n', '<br>');
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';

export function brand(c) {
  return `<a class="brand" href="/${c.locale}/" aria-label="${e(c.home)}">
    <span class="brand-orb" aria-hidden="true"></span>
    <span class="brand-lockup"><img src="/assets/sorcova-wordmark.svg" alt="" width="142" height="20"><span>HEALTH</span></span>
  </a>`;
}

function languageLinks(c) {
  return `<nav class="language-links" aria-label="${e(c.footer.language)}">${['en', 'fr'].map((locale) => `<a href="/${locale}/" hreflang="${locale}" lang="${locale}" aria-label="${locale === 'en' ? 'English' : 'Français'}" ${locale === c.locale ? 'aria-current="page"' : ''} data-language="${locale}">${locale.toUpperCase()}</a>`).join('<span class="language-divider" aria-hidden="true">/</span>')}</nav>`;
}

function header(c) {
  const navigation = Object.entries(c.nav).map(([id, label]) => `<a href="#${id}">${e(label)}</a>`).join('');
  return `<a class="skip-link" href="#main">${e(c.skip)}</a>
  <header class="site-header"><div class="nav-shell">
    ${brand(c)}
    <nav class="desktop-nav" aria-label="${e(c.menu)}">${navigation}</nav>
    <div class="nav-actions">${languageLinks(c)}
      <details class="mobile-menu"><summary aria-label="${e(c.menu)}"><span class="menu-label">${e(c.menu)}</span><span aria-hidden="true">＋</span></summary>
        <nav aria-label="${e(c.menu)}">${navigation}</nav>
      </details>
    </div>
  </div></header>`;
}

function contactLink(c, audience, label, className = 'text-link') {
  const email = audience === 'member' ? config.memberEmail : config.employerEmail;
  const subject = audience === 'member' ? c.contact.subjectMember : c.contact.subjectEmployer;
  const href = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : '#contact';
  return `<a class="${className}" href="${e(href)}" data-contact="${audience}">${e(label)}${arrow}</a>`;
}

function hero(c) {
  return `<section class="hero wrap" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow"><span class="label-line" aria-hidden="true"></span>${e(c.hero.label)}</p>
      <h1 id="hero-title">${c.hero.title.map((text, i) => `<span${i === 2 ? ' class="hero-accent"' : ''}>${e(text)}</span>`).join('')}</h1>
      <p class="hero-description">${e(c.hero.text)}</p>
      <div class="hero-actions">
        <a class="button button-secondary" href="#members">${e(c.hero.memberCta)}${arrow}</a>
        <a class="button button-secondary" href="#employers">${e(c.hero.employerCta)}${arrow}</a>
      </div>
      <a class="quiet-link hero-discover" href="#approach"><span aria-hidden="true">↓</span>${e(c.hero.scroll)}</a>
    </div>
    <figure class="hero-visual">
      <div class="hero-photo"><img src="/assets/wellbeing-morning.jpg" alt="${e(c.hero.alt)}" width="1122" height="1402" fetchpriority="high"></div>
      <div class="photo-note">${icon('plant')}<p>${e(c.hero.noteTitle)}<br><span>${e(c.hero.noteText)}</span></p></div>
      <div class="photo-signature" aria-hidden="true">SORCOVA<span>HEALTH</span></div>
      <figcaption>${e(c.hero.caption)}</figcaption>
    </figure>
  </section>
  <div class="trust-strip wrap"><ul>${c.trust.map((text, i) => `<li>${icon(['heart', 'plant', 'shield-check'][i])}<span>${e(text)}</span></li>`).join('')}</ul></div>`;
}

function wholePerson(c) {
  return `<section class="section whole-person wrap" id="whole-person" aria-labelledby="whole-title">
    <div class="whole-intro"><p class="section-kicker">${e(c.whole.label)}</p><h2 id="whole-title">${lines(c.whole.title)}</h2><p>${e(c.whole.text)}</p><span class="whole-signature">${icon('plant')}${e(c.whole.closing)}</span></div>
    <div class="pillar-grid">${c.whole.pillars.map((pillar) => `<article class="pillar"><span class="pillar-icon">${icon(pillar.icon)}</span><h3>${e(pillar.title)}</h3><p>${e(pillar.text)}</p></article>`).join('')}</div>
  </section>`;
}

function audiences(c) {
  return `<section class="section audiences wrap" aria-labelledby="audience-title">
    <div class="section-heading split-heading"><div><p class="section-kicker">${e(c.audiences.label)}</p><h2 id="audience-title">${lines(c.audiences.title)}</h2></div><p>${e(c.audiences.text)}</p></div>
    <div class="audience-grid">${['members', 'employers'].map((key, i) => {
      const card = c.audiences[key];
      return `<article class="audience-card gradient-outline" id="${key}">
        <div class="card-top"><span class="category">${e(card.label)}</span>${icon(i ? 'users' : 'heart')}</div>
        <h3>${lines(card.title)}</h3><p>${e(card.text)}</p>
        <ul class="feature-list">${card.items.map((item) => `<li>${e(item)}</li>`).join('')}</ul>
        ${contactLink(c, i ? 'employer' : 'member', card.cta)}
      </article>`;
    }).join('')}</div>
  </section>`;
}

function approach(c) {
  return `<section class="section approach" id="approach" aria-labelledby="approach-title"><div class="wrap">
    <div class="section-heading split-heading"><div><p class="section-kicker">${e(c.approach.label)}</p><h2 id="approach-title">${lines(c.approach.title)}</h2></div><p>${e(c.approach.text)}</p></div>
    <div class="signal-grid">${c.approach.signals.map((signal, i) => `<article class="signal-card">
      <div class="signal-art signal-art-${signal.shape}" aria-hidden="true"><span class="signal-halo"></span>${icon(['chat-circle', 'watch', 'flask'][i])}<span class="signal-dot"></span></div>
      <p class="signal-tag"><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${e(signal.tag)}</p><h3>${e(signal.title)}</h3><p>${e(signal.text)}</p>
    </article>`).join('')}</div>
    <div class="baseline-note">${icon('plant')}<div><h3>${e(c.approach.footTitle)}</h3><p>${e(c.approach.footText)}</p></div></div>
  </div></section>`;
}

function everyday(c) {
  return `<section class="section everyday wrap" id="everyday" aria-labelledby="everyday-title">
    <div class="section-heading split-heading"><div><p class="section-kicker">${e(c.everyday.label)}</p><h2 id="everyday-title">${lines(c.everyday.title)}</h2></div><p>${e(c.everyday.text)}</p></div>
    <div class="everyday-explorer" data-tabs data-motion-visible="false">
      <div class="tabs" role="tablist" aria-label="${e(c.everyday.tabsLabel)}">${c.everyday.tabs.map((tab, i) => `<button type="button" role="tab" id="tab-${tab.id}" aria-controls="panel-${tab.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${icon(['moon-stars', 'sun', 'waves', 'brain'][i])}${e(tab.label)}</button>`).join('')}</div>
      ${c.everyday.tabs.map((tab, i) => `<div class="everyday-panel" role="tabpanel" id="panel-${tab.id}" aria-labelledby="tab-${tab.id}" tabindex="0" ${i ? 'hidden' : ''}>
        <figure class="rhythm-figure"><div class="rhythm-art rhythm-${tab.id}" aria-hidden="true">${rhythmArtwork(tab.id)}<span class="rhythm-centre">${icon(['moon-stars', 'sun', 'waves', 'brain'][i])}</span></div><div class="rhythm-words" aria-hidden="true">${tab.words.map((word) => `<span>${e(word)}</span>`).join('')}</div><figcaption>${e(c.everyday.motion.descriptions[i])}</figcaption></figure>
        <div class="everyday-copy"><h3>${e(tab.title)}</h3><p>${e(tab.text)}</p><p class="everyday-detail">${e(tab.detail)}</p></div>
      </div>`).join('')}
      <div class="rhythm-caption"><p>${e(c.everyday.motion.disclaimer)}</p></div>
    </div>
    <div class="ava-note"><img src="/assets/ava-avatar.svg" width="44" height="44" alt=""><div><h3>${e(c.everyday.avaTitle)}</h3><p>${e(c.everyday.avaText)}</p></div></div>
  </section>`;
}

function care(c) {
  return `<section class="section care" id="science" aria-labelledby="science-title"><div class="wrap care-grid">
    <div class="section-heading"><p class="section-kicker">${e(c.care.label)}</p><h2 id="science-title">${lines(c.care.title)}</h2><p>${e(c.care.text)}</p><div class="founder-line"><span class="founder-mark" aria-hidden="true">${icon('heart')}</span><div><p>${e(c.care.founder)}</p><span>${e(c.care.founderRole)}</span></div></div></div>
    <div class="care-principles">${c.care.cards.map((card) => `<article><h3>${e(card.title)}</h3><p>${e(card.text)}</p></article>`).join('')}</div>
  </div></section>`;
}

function privacy(c) {
  return `<section class="section privacy wrap" id="privacy" aria-labelledby="privacy-title">
    <div class="section-heading centered"><span class="privacy-symbol">${icon('shield-check')}</span><p class="section-kicker">${e(c.privacy.label)}</p><h2 id="privacy-title">${lines(c.privacy.title)}</h2><p>${e(c.privacy.text)}</p></div>
    <div class="privacy-grid">${c.privacy.items.map((item) => `<article><h3>${e(item.title)}</h3><p>${e(item.text)}</p></article>`).join('')}</div>
  </section>`;
}

function faq(c) {
  return `<section class="section faq wrap" id="questions" aria-labelledby="faq-title"><div class="section-heading"><h2 id="faq-title">${lines(c.faq.title)}</h2><p>${e(c.faq.intro)}</p></div>
    <div class="faq-list">${c.faq.items.map((item) => `<details><summary>${e(item.q)}<span class="faq-toggle" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${e(item.a)}</p></div></details>`).join('')}</div>
  </section>`;
}

function closing(c) {
  return `<section class="closing-section wrap" id="contact" aria-labelledby="contact-heading"><div class="closing-panel"><div><p class="section-kicker">${e(c.closing.label)}</p><h2 id="contact-heading">${lines(c.closing.title)}</h2><p>${e(c.closing.text)}</p></div>
    <div class="closing-actions">${contactLink(c, 'member', c.closing.member, 'button button-primary')}${contactLink(c, 'employer', c.closing.employer, 'button button-primary')}</div>
  </div></section>`;
}

function footer(c) {
  return `<footer class="site-footer wrap"><div class="footer-top"><div>${brand(c)}<p>${e(c.footer.tagline)}</p></div><nav aria-label="${e(c.footer.copyright)}"><a href="#approach">${e(c.nav.approach)}</a><a href="#privacy">${e(c.footer.privacy)}</a><a href="#questions">${e(c.footer.faq)}</a></nav></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${e(c.footer.copyright)}</span>${languageLinks(c)}<a href="#top">${e(c.footer.top)}<span aria-hidden="true">↑</span></a></div></footer>`;
}

function contactDialog(c) {
  const t = c.contact;
  const attributes = Object.entries(t).map(([key, value]) => `data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${e(value)}"`).join(' ');
  return `<dialog class="contact-dialog" id="enquiry-dialog" aria-labelledby="enquiry-title" aria-describedby="enquiry-description" ${attributes} data-member-email="${e(config.memberEmail)}" data-employer-email="${e(config.employerEmail)}">
    <button class="dialog-close" type="button" data-close aria-label="${e(c.close)}">×</button>
    <span class="dialog-symbol" aria-hidden="true">${icon('chat-circle')}</span>
    <h2 id="enquiry-title">${e(t.title)}</h2><p id="enquiry-description"></p>
    <form id="enquiry-form">
      <label for="enquiry-name">${e(t.name)}</label><input id="enquiry-name" name="name" autocomplete="name" required maxlength="120">
      <label for="enquiry-email">${e(t.email)}</label><input id="enquiry-email" name="email" type="email" autocomplete="email" required maxlength="254">
      <div data-organisation hidden><label for="enquiry-organisation">${e(t.organisation)} <span>(${e(t.optional)})</span></label><input id="enquiry-organisation" name="organisation" autocomplete="organization" maxlength="160"></div>
      <label for="enquiry-message">${e(t.message)} <span>(${e(t.optional)})</span></label><textarea id="enquiry-message" name="message" rows="3" maxlength="1200"></textarea>
      <p class="form-note" id="enquiry-note"></p>
      <button type="submit" class="button button-primary" data-submit>${e(t.submit)}${arrow}</button>
      <p class="form-status" role="status" aria-live="polite" data-status></p>
      <div data-download-fallback hidden><p class="form-note">${e(t.fallback)}</p><button type="button" class="text-link" data-save>${e(t.save)}<span aria-hidden="true">↓</span></button></div>
    </form>
  </dialog>`;
}

function renderBody(c, options = {}) {
  const body = options.notFound
    ? `<main id="main" class="not-found wrap"><p class="section-kicker">Sorcova Health</p><h1>${e(c.notFound.title)}</h1><p>${e(c.notFound.text)}</p><a href="/${c.locale}/" class="button button-secondary">${e(c.notFound.link)}${arrow}</a></main>`
    : `<main id="main">${hero(c)}${wholePerson(c)}${audiences(c)}${everyday(c)}${approach(c)}${care(c)}${privacy(c)}${faq(c)}${closing(c)}</main>`;
  return `${header(c)}${body}${footer(c)}${options.notFound ? '' : contactDialog(c)}`;
}

export function renderPage(locale = 'en', options = {}) {
  const c = content[locale];
  if (!c) throw new Error(`Unsupported locale: ${locale}`);
  const base = config.siteUrl.replace(/\/$/, '');
  const canonical = base ? `<link rel="canonical" href="${e(base)}/${locale}/">` : '';
  // Inert, escaped data lets both languages work in one page, even offline.
  const languages = JSON.stringify(Object.fromEntries(Object.entries(content).map(([key, value]) => [key, {
    title: options.notFound ? `${value.notFound.title} | Sorcova Health` : value.title,
    description: value.description, body: renderBody(value, options),
  }]))).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
  return `<!doctype html>
<html lang="${locale}" class="no-js">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(options.notFound ? `${c.notFound.title} | Sorcova Health` : c.title)}</title>
  <meta name="description" content="${e(c.description)}">
  <meta name="theme-color" content="#FDFAF8">
  <meta name="color-scheme" content="light">
  <meta name="robots" content="${config.allowIndexing && !options.notFound ? 'index, follow' : 'noindex, nofollow'}">
  <meta property="og:title" content="${e(c.title)}"><meta property="og:description" content="${e(c.description)}"><meta property="og:type" content="website"><meta property="og:locale" content="${locale === 'fr' ? 'fr_FR' : 'en_GB'}">
  ${canonical}
  <link rel="alternate" hreflang="en" href="${e(base)}/en/"><link rel="alternate" hreflang="fr" href="${e(base)}/fr/"><link rel="alternate" hreflang="x-default" href="${e(base)}/en/">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css"><script src="/client.js" type="module"></script>
  <script type="application/json" id="site-languages">${languages}</script>
</head>
<body id="top">${renderBody(c, options)}</body>
</html>`;
}
