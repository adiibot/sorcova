# Sorcova website

A single bilingual website with an in-place EN / FR switch, equally prominent member and employer routes, and responsive layouts. The redesign lives in `src/`; the existing root HTML/CSS/JS belong to the previous website and are preserved.

## Run locally

Requires Node.js 22 or newer. No dependencies or installation step are needed.

```sh
npm run dev      # Build, watch source files, serve locally; refresh after edits
npm run check    # Check syntax, run tests, and build
npm run build    # Generate the website in dist/
npm run preview  # Serve dist/ at http://127.0.0.1:4173
npm run review   # Generate test-results/browser-review.html
```

Open `/en/` or `/fr/` on the preview server. For an offline review, open `dist/preview.html` directly; it embeds both languages and assets. Google Fonts requires a connection, with system-font fallbacks. The browser harness checks five viewport widths and interactions without sending enquiries.

## Source layout

- `src/content.mjs`: matching English and French copy.
- `src/components.mjs`: semantic HTML and escaping.
- `src/styles.css`: design tokens, responsive styling and reduced motion.
- `src/client.js`: language switching, navigation, tabs and enquiry dialogs.
- `src/rhythms.mjs`: illustrative sleep, energy, recovery and mind/mood artwork.
- `src/config.mjs`: public enquiry destinations, canonical URL and indexing.
- `public/assets/`: selected website assets and the Phosphor MIT license.
- `scripts/` and `tests/`: build, preview and dependency-free validation.

Edit source, not generated `dist/`. Use two-space indentation, semantic elements, descriptive kebab-case CSS classes and shared tokens. Keep EN/FR content aligned. Check keyboard access, mobile layouts and reduced motion. Use concise imperative commit messages; include scope, test results and screenshots in visual-change reviews.

`AGENTS.md` is preserved verbatim from the original reference-only workspace. Its historical inventory and command notes predate implementation; the current runnable project and commands are documented above. Private briefs, PDFs, ZIP exports and the original prototype are intentionally not included.

## Enquiries and imagery

Both enquiry routes prepare an email to `lavinia@sorcovahealth.com` in the visitor's mail app. Visitors review and send it themselves; there is no submission backend or stored form data. Do not send test enquiries.

The hero is user-requested generated brand imagery depicting a fictional person, not a testimonial. Provenance and the prompt are in `docs/hero-image.md`. The wellbeing diagrams are conceptual illustrations, not live readings. They animate briefly, then settle, and respect reduced motion.

## Deployment status

Pushes to `main` run the test suite, build the website, and publish only `dist/` through GitHub Pages. Pages must already be configured to use GitHub Actions. The build receives `SITE_BASE_PATH` and `SITE_URL` from Pages, so project paths and custom domains use the correct asset links, language routes and canonical URL. The legacy root website is retained but is no longer the deployment artifact.

For a project-path build, run `SITE_BASE_PATH=/sorcova SITE_URL=https://adiibot.github.io/sorcova npm run build`. Normal local previews use the default domain-root build. Indexing remains disabled in `src/config.mjs`. Legal destinations, clinical copy and imagery still require the appropriate owner approval; deployment does not constitute compliance certification.

Never publish the repository root, internal briefs, secrets or unapproved clinical claims. Existing legacy files and Git history are preserved by this handoff.
