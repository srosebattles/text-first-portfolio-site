# text-first-portfolio-site

A text-first personal portfolio. No framework, no build step, no npm — plain
HTML, one stylesheet, one small typed-but-never-compiled JS file. The site is
itself a work sample; the constraints that shape it are recorded in
[CLAUDE.md](CLAUDE.md) and explained on the [colophon](colophon/index.html).

Deployed on GitHub Pages at
`https://srosebattles.github.io/text-first-portfolio-site/` (custom domain
cutover comes later — **no CNAME yet**; see the cutover checklist in
CLAUDE.md).

## Structure

```
index.html                     home: positioning, about, case-study index
404.html                       custom not-found page (all URLs absolute)
work/
  jira-refinement-tool/        case study (prose TODO)
  llm-game-scaffolds/          case study (prose TODO)
  quoting-clock/               case study (prose TODO)
colophon/                      how the site is made (drafted, needs edit pass)
assets/
  site.css                     the one stylesheet: tokens → base → components
  quoting-clock.js             the one script: <quoting-clock> custom element
  quotes.json                  literary-clock data (96 quarter-hour slots)
  favicon.svg                  text-only mark, follows color scheme
  og.png                       Open Graph card, 1200x630
  fonts/                       Literata variable woff2 (latin) + OFL license
resume.pdf                     placeholder — replace with the real file
robots.txt                     crawler whitelist + sitemap pointer
sitemap.xml                    hand-maintained
.nojekyll                      tells GitHub Pages to skip Jekyll
```

## Preview locally

```sh
python3 -m http.server
```

Then open <http://localhost:8000>. No dependencies, nothing to install.

## Adding a page

1. Copy the nearest existing page (same directory depth — relative paths to
   `assets/` differ by depth).
2. Update `<title>`, meta description, canonical URL, and the `og:`/`twitter:`
   tags.
3. The header, footer, and GoatCounter snippet are duplicated by hand on
   every page — if you change a shared block, change it **everywhere**.
4. Add the page to `sitemap.xml`.

## The quoting clock

`assets/quotes.json` holds one entry per quarter-hour slot, keyed `"HH:MM"`
(24-hour): `{ "quote": "...", "title": "...", "author": "..." }`. Store quotes
without surrounding quotation marks — the component adds them. Slots may be
sparse; missing slots fall back to the nearest populated one.

**TODO(srosebattles): curate the full 96 slots.** Eight public-domain samples
are in place; verify their wording against the source texts as you go. The
no-JS fallback (C.S. Lewis) lives in each page's footer markup.

## Maintenance notes

- **sitemap.xml** — update `lastmod` whenever a page's content changes.
- **GoatCounter** — the site code is `SROSEBATTLES_TODO`.
  **TODO(srosebattles): register at [goatcounter.com](https://www.goatcounter.com)
  and replace the code in the script tag on every page.** It must remain the
  site's only third-party request.
- **robots.txt** — deny-by-default whitelist, grouped by category (search,
  AI, link previews, SEO tools, read-later, archives). Add new crawlers to
  the matching group; anything unlisted is denied by the catch-all.
- **resume.pdf** — placeholder; drop in the real file (same name, same path).
- **Domain cutover** — when `srosebattles.com` moves off the old repo, work
  through the cutover checklist in CLAUDE.md (canonicals, OG URLs, sitemap,
  robots, the 404 page's absolute URLs, then add CNAME).
- **Placeholder copy** — anything visibly flagged "to do · placeholder copy"
  (`data-todo`) or marked `TODO(srosebattles)` in comments is waiting on
  prose written by a human, in their own voice.
