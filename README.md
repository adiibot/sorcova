# Sorcova website

A responsive, dependency-free website for Sorcova Health SAS.

## Preview locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deployment

Pushes to `main` deploy automatically through GitHub Pages. The source brief is
intentionally excluded from Git and the deployment artifact.

## Files

- `index.html` — content and page structure
- `styles.css` — complete visual system and responsive layout
- `script.js` — mobile navigation, header state and reveal effects
- `sorcova-website-brief.md` — source brief and regulatory copy constraints
