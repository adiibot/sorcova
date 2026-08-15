const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const rhythmButtons = document.querySelectorAll('[data-rhythm-button]');
const rhythmCurves = document.querySelectorAll('[data-rhythm-curve]');
const rhythmCopies = document.querySelectorAll('[data-rhythm-copy]');
const rhythmTime = document.querySelector('[data-rhythm-time]');
const rhythmPhase = document.querySelector('[data-rhythm-phase]');

const activateRhythm = (selectedButton) => {
  const selected = selectedButton.dataset.rhythmButton;
  rhythmButtons.forEach((item) => {
    const active = item === selectedButton;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  rhythmCurves.forEach((curve) => curve.classList.toggle('active', curve.dataset.rhythmCurve === selected));
  rhythmCopies.forEach((copy) => {
    const active = copy.dataset.rhythmCopy === selected;
    copy.classList.toggle('active', active);
    copy.hidden = !active;
  });
};

rhythmButtons.forEach((button) => button.addEventListener('click', () => activateRhythm(button)));

const dayWindows = [
  ['06:30', 'Awakening response'],
  ['07:00', 'Morning peak'],
  ['10:00', 'Morning decline'],
  ['12:30', 'Midday window'],
  ['16:00', 'Afternoon window'],
  ['20:00', 'Evening transition'],
  ['23:00', 'Night-time level']
];
let dayWindowIndex = 0;
let rhythmClockTimer;

const updateRhythmClock = () => {
  if (!rhythmTime || !rhythmPhase) return;
  const [time, phase] = dayWindows[dayWindowIndex];
  rhythmTime.textContent = time;
  rhythmPhase.textContent = phase;
  dayWindowIndex = (dayWindowIndex + 1) % dayWindows.length;
};

const biologicalTime = document.querySelector('[data-biological-time]');
const biologicalPhase = document.querySelector('[data-biological-phase]');
const heroWindows = [dayWindows[0], dayWindows[2], dayWindows[3], dayWindows[4], dayWindows[5], dayWindows[6]];
let heroWindowIndex = 0;
let heroClockTimer;

const updateHeroClock = () => {
  if (!biologicalTime || !biologicalPhase) return;
  const [time, phase] = heroWindows[heroWindowIndex];
  biologicalTime.textContent = time;
  biologicalPhase.textContent = phase;
  heroWindowIndex = (heroWindowIndex + 1) % heroWindows.length;
};

const startClocks = () => {
  if (prefersReducedMotion.matches) return;
  clearInterval(rhythmClockTimer);
  clearInterval(heroClockTimer);
  rhythmClockTimer = window.setInterval(updateRhythmClock, 1570);
  heroClockTimer = window.setInterval(updateHeroClock, 2000);
};

const stopClocks = () => {
  clearInterval(rhythmClockTimer);
  clearInterval(heroClockTimer);
};

const systemNodes = [...document.querySelectorAll('[data-system-node]')];
const systemExplorer = document.querySelector('.system-explorer');
const systemFocus = document.querySelector('.system-focus');
const systemTitle = document.querySelector('[data-system-title]');
const systemStatus = document.querySelector('[data-system-status]');
const systemDescription = document.querySelector('[data-system-description]');
const systemCode = document.querySelector('[data-system-code]');
const systemAutoplay = document.querySelector('[data-system-autoplay]');
const systemAutoplayLabel = systemAutoplay?.querySelector('span');
let activeSystemIndex = 0;
let systemTourTimer;
let systemTourInView = false;
let systemTourPaused = false;

const activateSystem = (node) => {
  activeSystemIndex = systemNodes.indexOf(node);
  systemNodes.forEach((item) => {
    const active = item === node;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  systemFocus?.classList.add('is-updating');
  window.setTimeout(() => systemFocus?.classList.remove('is-updating'), 280);
  if (systemTitle) systemTitle.textContent = node.dataset.title;
  if (systemStatus) systemStatus.textContent = node.dataset.status;
  if (systemDescription) systemDescription.textContent = node.dataset.description;
  if (systemCode) systemCode.textContent = node.dataset.code;
};

const stopSystemTour = () => clearInterval(systemTourTimer);

const startSystemTour = () => {
  stopSystemTour();
  if (!systemTourInView || systemTourPaused || prefersReducedMotion.matches || document.hidden) return;
  systemTourTimer = window.setInterval(() => {
    const nextIndex = (activeSystemIndex + 1) % systemNodes.length;
    activateSystem(systemNodes[nextIndex]);
  }, 6000);
};

systemNodes.forEach((node) => {
  node.addEventListener('click', () => {
    activateSystem(node);
    startSystemTour();
  });
});

systemAutoplay?.addEventListener('click', () => {
  systemTourPaused = !systemTourPaused;
  systemAutoplay.setAttribute('aria-pressed', String(systemTourPaused));
  if (systemAutoplayLabel) systemAutoplayLabel.textContent = systemTourPaused ? 'Resume guided tour' : 'Pause guided tour';
  if (systemTourPaused) stopSystemTour(); else startSystemTour();
});

systemExplorer?.addEventListener('mouseenter', stopSystemTour);
systemExplorer?.addEventListener('mouseleave', startSystemTour);
systemExplorer?.addEventListener('focusin', stopSystemTour);
systemExplorer?.addEventListener('focusout', (event) => {
  if (!systemExplorer.contains(event.relatedTarget)) startSystemTour();
});

const storyLinks = [...document.querySelectorAll('[data-story-link]')];
const chapterIds = storyLinks.map((link) => link.dataset.storyLink);
const baselineTimeline = document.querySelector('[data-baseline-timeline]');
const baselineSteps = [...(baselineTimeline?.querySelectorAll('article') || [])];
let scrollFrame;

const updateBaselineProgress = () => {
  scrollFrame = null;
  if (!baselineTimeline) return;
  const rect = baselineTimeline.getBoundingClientRect();
  const travel = rect.height + window.innerHeight * .45;
  const progress = Math.max(0, Math.min(1, (window.innerHeight * .78 - rect.top) / travel));
  baselineTimeline.style.setProperty('--baseline-progress', progress.toFixed(3));
  baselineSteps.forEach((step, index) => {
    const threshold = index / Math.max(1, baselineSteps.length - 1);
    step.classList.toggle('is-active', progress >= Math.max(0, threshold - .08));
  });
};

const requestBaselineUpdate = () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateBaselineProgress);
};

if ('IntersectionObserver' in window) {
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      storyLinks.forEach((link) => link.classList.toggle('active', link.dataset.storyLink === entry.target.id));
    });
  }, { rootMargin: '-35% 0px -50% 0px' });

  chapterIds.forEach((id) => {
    const chapter = document.getElementById(id);
    if (chapter) chapterObserver.observe(chapter);
  });

  if (systemExplorer) {
    const systemObserver = new IntersectionObserver(([entry]) => {
      systemTourInView = entry.isIntersecting;
      if (systemTourInView) startSystemTour(); else stopSystemTour();
    }, { threshold: .35 });
    systemObserver.observe(systemExplorer);
  }
}

window.addEventListener('scroll', requestBaselineUpdate, { passive: true });
window.addEventListener('resize', requestBaselineUpdate);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopClocks();
    stopSystemTour();
  } else {
    startClocks();
    startSystemTour();
  }
});
prefersReducedMotion.addEventListener('change', () => {
  if (prefersReducedMotion.matches) {
    stopClocks();
    stopSystemTour();
  } else {
    startClocks();
    startSystemTour();
  }
});

updateBaselineProgress();
startClocks();
