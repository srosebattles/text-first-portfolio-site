# CLAUDE.md

Personal portfolio site for srosebattles. The site is itself a work sample:
craft matters more than speed. Every constraint below is deliberate — do not
"upgrade" the stack, add tooling, or DRY things out without being asked.

## Architecture constraints

- **Zero tooling.** No frameworks, no build step, no npm, no bundler, no
  preprocessors, no CI transforms. What is in the repo is what ships. Plain
  HTML files, **one stylesheet** (`assets/site.css`), **one small JS file**
  (`assets/quoting-clock.js`), static assets.
- **Local preview:** `python3 -m http.server` from the repo root.
- **Each page is standalone HTML.** The shared header and footer are
  duplicated by hand across pages *by design* (simplicity over DRY at this
  scale). ⚠️ **Any edit to a shared block (header, nav, footer, meta
  boilerplate, GoatCounter snippet) must be applied to every page:**
  `index.html`, `404.html`, `colophon/index.html`, and the three pages under
  `work/*/index.html`.
- **JavaScript is plain JS, typed but never compiled:** `// @ts-check` plus
  JSDoc type annotations on every JS file. Keep total JS minimal — JS exists
  only to upgrade the page.
- **Progressive enhancement is non-negotiable.** Every page must be fully
  readable and usable with JavaScript disabled. Interactive components ship a
  static no-JS fallback in the HTML (see the quoting-clock footer component).

## URL policy (GitHub Pages subpath — read before touching links)

The site deploys to GitHub Pages at the **default project URL**
`https://srosebattles.github.io/text-first-portfolio-site/` until the custom
domain (`srosebattles.com`) is cut over from the old repo. Therefore:

- **Do NOT create a `CNAME` file** until cutover.
- **All internal links and asset references are relative** (`assets/…`,
  `../../assets/…`), never root-absolute (`/assets/…`), so the site works both
  at the subpath now and at the domain root after cutover.
- Absolute URLs are unavoidable in a few places. **Cutover checklist** — these
  must be updated when the domain moves:
  - `<link rel="canonical">`, `og:url`, and `og:image` on every page
  - the JSON-LD `Person` block on the home page
  - `sitemap.xml` (all `<loc>` values) and the `Sitemap:` line in `robots.txt`
  - `404.html` — served at arbitrary paths, so *everything* in it (stylesheet,
    fonts, favicon, script, links) is absolute
  - then add the `CNAME` file

## Design system constraints

- **All-text design.** No photographs, no illustrations, no icon fonts. The
  only image assets are the favicon (`assets/favicon.svg`) and the Open Graph
  card (`assets/og.png`).
- **Typography-led. Single typeface: Literata** (variable font, `opsz`+`wght`
  axes), self-hosted in `assets/fonts/`. Sourced from the google/fonts GitHub
  repo (OFL-licensed; `assets/fonts/OFL.txt` must stay in the repo). Serve
  latin-subset woff2, preload the roman face, `font-display: swap`, serif
  system-stack fallback (Georgia, 'Times New Roman', serif).
- **Fluid type scale** via `clamp()` (`--step-*` tokens). Body measure
  65–75ch. Real typographic hierarchy; generous whitespace.
- **Colors are CSS custom properties (design tokens)** defined at the top of
  `assets/site.css`. Never hard-code a color anywhere else. Palette: warm
  off-white paper, near-black ink, khaki/olive-green accent family.
  - Any olive used **as text** (links etc.) must be a dark variant meeting
    **WCAG AA contrast (≥ 4.5:1)** against its background.
  - Brighter khaki is reserved for **non-text** accents: rules, markers, hover
    states, background tints.
- **Dark mode** via `prefers-color-scheme`, implemented purely through the
  token layer (one `@media` block re-assigning tokens — no per-component dark
  styles). In dark mode the accent shifts toward desaturated sage/gold-green,
  not muddy olive.
- **Reduced motion:** every transition/animation is wrapped in
  `@media (prefers-reduced-motion: no-preference)`. No motion outside that
  gate.
- **Accessibility bar:** semantic landmarks (`header`/`nav`/`main`/`footer`),
  exactly one `h1` per page with a correct heading outline (no skipped
  levels), visible `:focus-visible` styles, a skip link as the first focusable
  element, every link has an accessible name, WCAG AA contrast throughout.
- **Performance bar:** Lighthouse 100s across the board is the target. **No
  third-party requests except the GoatCounter script** (`gc.zgo.at`).

## Content rules

- Case-study prose is written by the site owner, in their own voice. Never
  ghostwrite it. Placeholder prose is lorem ipsum wrapped in an element with
  `data-todo` (visibly flagged by the stylesheet) plus an HTML
  `<!-- TODO(srosebattles): … -->` comment.
- Footer links: GitHub, LinkedIn, email, PDF resume (`resume.pdf`), colophon,
  and the `<quoting-clock>` component. **No Twitter/X links anywhere.**
- Quote data lives in `assets/quotes.json`, keyed by 96 quarter-hour slots
  (`"HH:MM"` 24-hour). Schema per entry: `{ quote, title, author }`. Missing
  slots fall back to the nearest populated slot.

## Commit discipline

- **Small, single-purpose commits, made as you work** — never one giant batch
  commit at the end. Each commit is one logical change with a clear
  present-tense message, e.g. "Add design tokens and base typography",
  "Add quoting-clock component", "Add robots.txt with crawler whitelist".
- If a change touches all pages (shared block edit), that's still one logical
  change — one commit, message saying so.
