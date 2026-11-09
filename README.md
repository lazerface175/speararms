# SpearArms

Website for **SpearArms** — a federally licensed firearms business (FFL 07 Manufacturer,
Dealer, and SOT). Pure static site: no build step, no backend, no dependencies.
Host the folder contents on any static host (Netlify, GitHub Pages, cPanel, S3, etc.).

## Site features

- Services showcase (manufacturing, dealer sales, transfers, NFA/SOT, gunsmithing, Cerakote)
- Step-by-step FFL transfer guide
- **Transfer request form** — copy summary, email draft, or print/PDF (works with zero backend)
- **Cost & timeline estimator** — transfer fees, state waiting periods, NFA timelines
- FAQ accordion, contact form (mailto), mobile-responsive, accessible

## Project structure

```
index.html        All page markup
css/styles.css    Design system + layout + print styles
js/config.js      ★ EDIT THIS — business details, fees, state wait data
js/main.js        Interactivity (nav, estimator, forms, scroll reveal)
.gitignore        Protects secrets and private FFL data
```

## Customizing for SpearArms

1. **`js/config.js`** — set the real business name, FFL/SOT numbers, address,
   phone, email, hours, transfer fees, and state waiting periods.
2. **`index.html`** — search for `[Street Address]`, `[City, State ZIP]`,
   `555` placeholders and update copy as needed. Sections can be removed
   by deleting the `<section>` blocks if a service isn't offered.
3. Contact info in the footer/contact section auto-updates from `config.js`.

> ⚠️ The state waiting-period table in `config.js` is a starting point.
> Verify every value against current state law before publishing — laws change.

## Local preview

```bash
# any static server works, e.g.:
python -m http.server 8000
# then open http://localhost:8000
```

## Deploying

Upload `index.html`, `css/`, and `js/` to your host's web root. Everything is
relative-path, so it works in a subdirectory too (e.g. `example.com/speararms/`).
