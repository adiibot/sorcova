# Repository Guidelines

## Project Structure & Source Materials

This workspace currently contains website references and a standalone prototype, not a scaffolded application. There is no package manifest, test directory, or Git history.

- `sorcova-workplace-longevity.html`: self-contained prototype with four embedded iframe variants; the visible switcher exposes App V3 and Spacious V3.
- `DESIGN-SYSTEM.md`: website visual and interaction requirements. Its referenced mobile-app source is not included here.
- `additional_info.md`: product context and publication rules. Part B governs claims; Part C is internal and must never enter public content.
- `Accueil — FR (2).pdf` and `Home — EN (2).pdf`: professional bilingual narrative references, including unresolved placeholders.
- `Accueil — FR-html (2).zip`: French reference mockup, six images, and export runtime; not production components.

Preserve source references. Give employers and members equal prominence, as explicitly agreed. Reconcile draft copy with the current product restrictions before reuse.

## Development Commands

- `python3 -m http.server 8000 --bind 127.0.0.1`: serve this folder locally; open `http://127.0.0.1:8000/sorcova-workplace-longevity.html`.
- `unzip -l 'Accueil — FR-html (2).zip'`: inspect the export without extracting it.

No build, lint, or automated test commands are configured. The platform stack described in the brief is background, not an installed application. Document actual commands when implementation begins.

## Coding Style & Design

For new HTML/CSS/JavaScript, use two-space indentation, semantic elements, descriptive kebab-case CSS classes, and shared design tokens. No formatter or linter is configured.

Follow the design system: Plus Jakarta Sans, light backgrounds, white surfaces, navy text, restrained gradients, and Phosphor duotone icons. Respect reduced motion. Check gradient contrast rather than assuming palette compliance ensures accessibility. Use real, licensed photography and approved product screens. Keep English and French content aligned.

## Testing Guidelines

No testing framework or coverage threshold exists. Manually check desktop and mobile layouts, keyboard navigation, focus visibility, contrast, reduced motion, and both languages. Verify actual destinations for demo booking, activation, and language controls; prototype anchors are not completed flows.

Remove placeholders before launch. Exclude numerical member readings, internal engine names, unapproved medical claims, and unsupported certification or hosting statements. Label synthetic demonstrations.

## Commits & Pull Requests

No existing commit convention can be inferred. Use concise imperative messages, such as `Add bilingual audience navigation`. PRs should describe scope, link relevant issues, include desktop/mobile screenshots for visual changes, record validation, and flag unresolved copy or assets.
