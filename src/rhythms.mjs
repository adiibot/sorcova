// Conceptual motion artwork, not measured physiology or a clinical simulation.
// All movement is applied with CSS transforms/opacity, never path morphing.
export function rhythmArtwork(kind) {
  const artwork = {
    sleep: `<defs><clipPath id="rhythm-sleep-window"><circle cx="160" cy="140" r="106"/></clipPath></defs>
      <circle class="rhythm-sleep-disc" cx="160" cy="140" r="106"/>
      <circle class="rhythm-soft-field rhythm-sleep-bloom" cx="160" cy="140" r="76"/>
      <g clip-path="url(#rhythm-sleep-window)">
        <g class="rhythm-sleep-wave"><path class="rhythm-water water-back" d="M-160 204 Q-120 190 -80 204 T0 204 T80 204 T160 204 T240 204 T320 204 T400 204 T480 204 V280 H-160 Z"/></g>
        <g class="rhythm-sleep-wave wave-front"><path class="rhythm-water water-front" d="M-160 222 Q-120 211 -80 222 T0 222 T80 222 T160 222 T240 222 T320 222 T400 222 T480 222 V280 H-160 Z"/></g>
      </g>
      <circle class="rhythm-line sleep-boundary" cx="160" cy="140" r="106"/>`,
    energy: `<circle class="rhythm-soft-field rhythm-energy-bloom" cx="160" cy="140" r="76"/>
      <g class="rhythm-energy-rays">${Array.from({ length: 12 }, (_, index) => `<g transform="rotate(${index * 30} 160 140)"><path class="rhythm-ray rhythm-energy-ray" d="M160 38 V64"/></g>`).join('')}</g>`,
    recovery: `<circle class="rhythm-soft-field rhythm-recovery-bloom" cx="160" cy="140" r="66"/>
      <circle class="rhythm-line rhythm-recovery-ripple ripple-one" cx="160" cy="140" r="64"/>
      <circle class="rhythm-line rhythm-recovery-ripple ripple-two" cx="160" cy="140" r="88"/>
      <circle class="rhythm-line rhythm-recovery-ripple ripple-three" cx="160" cy="140" r="112"/>`,
    mind: `<circle class="rhythm-soft-field" cx="160" cy="140" r="92"/>
      <g class="rhythm-mind-flow flow-one"><ellipse class="rhythm-line" cx="160" cy="140" rx="116" ry="60" transform="rotate(-30 160 140)"/><circle class="rhythm-node" cx="62" cy="194" r="6"/></g>
      <g class="rhythm-mind-flow flow-two"><ellipse class="rhythm-line secondary" cx="160" cy="140" rx="116" ry="60" transform="rotate(30 160 140)"/><circle class="rhythm-node" cx="259" cy="194" r="5"/></g>
      <g class="rhythm-mind-flow flow-three"><ellipse class="rhythm-line" cx="160" cy="140" rx="64" ry="115"/><circle class="rhythm-node" cx="160" cy="25" r="5"/></g>`,
  };
  if (!artwork[kind]) throw new Error(`Unknown rhythm: ${kind}`);
  return `<svg class="rhythm-canvas" viewBox="0 0 320 280" fill="none" aria-hidden="true" focusable="false">
    <defs><linearGradient id="rhythm-${kind}-gradient" x1="32" y1="32" x2="288" y2="248" gradientUnits="userSpaceOnUse"><stop stop-color="#927BCE"/><stop offset=".5" stop-color="#6588DD"/><stop offset="1" stop-color="#2CA0EA"/></linearGradient></defs>
    <g class="rhythm-geometry" stroke="url(#rhythm-${kind}-gradient)">${artwork[kind]}</g>
  </svg>`;
}
