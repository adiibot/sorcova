const rhythmButtons = document.querySelectorAll('[data-rhythm-button]');
const rhythmCurves = document.querySelectorAll('[data-rhythm-curve]');
const rhythmCopies = document.querySelectorAll('[data-rhythm-copy]');

rhythmButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.rhythmButton;
    rhythmButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    rhythmCurves.forEach((curve) => curve.classList.toggle('active', curve.dataset.rhythmCurve === selected));
    rhythmCopies.forEach((copy) => {
      const active = copy.dataset.rhythmCopy === selected;
      copy.classList.toggle('active', active);
      copy.hidden = !active;
    });
  });
});

const systemNodes = document.querySelectorAll('[data-system-node]');
const systemTitle = document.querySelector('[data-system-title]');
const systemStatus = document.querySelector('[data-system-status]');
const systemDescription = document.querySelector('[data-system-description]');
const systemCode = document.querySelector('[data-system-code]');

systemNodes.forEach((node) => {
  node.addEventListener('click', () => {
    systemNodes.forEach((item) => {
      const active = item === node;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    systemTitle.textContent = node.dataset.title;
    systemStatus.textContent = node.dataset.status;
    systemDescription.textContent = node.dataset.description;
    systemCode.textContent = node.dataset.code;
  });
});
