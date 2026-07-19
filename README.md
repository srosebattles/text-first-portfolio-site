# text-first-portfolio-site

My personal portfolio: plain HTML, one stylesheet, and one small JavaScript
file. No framework, no build step, nothing to install. The
[colophon](colophon/index.html) tells the story of how it's put together;
`CLAUDE.md` holds the working constraints for AI-assisted coding sessions.

Live at `https://srosebattles.github.io/text-first-portfolio-site/` until
`srosebattles.com` cuts over from the old repo. (No CNAME file until then —
see the cutover notes below.)

## Structure

```
index.html                     home: positioning, about, case-study index
404.html                       custom not-found page (all URLs absolute)
work/
  project-1/                   case study placeholder (name + prose TODO)
  project-2/                   case study placeholder (name + prose TODO)
  project-3/                   case study placeholder (name + prose TODO)
colophon/                      how the site is made (drafted, needs edit pass)
assets/
  site.css                     the one stylesheet: tokens → base → components
  quoting-clock.js             the one script: <quoting-clock> custom element
  quotes.json                  literary-clock data (96 quarter-hour slots)
  favicon.svg                  SRB monogram, follows the color scheme
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

Then open <http://localhost:8000>. That's the whole toolchain.

## Adding a page

1. Copy the nearest existing page (same directory depth — the relative paths
   to `assets/` differ by depth).
2. Update `<title>`, the meta description, the canonical URL, and the
   `og:`/`twitter:` tags.
3. The header, footer, and GoatCounter snippet are duplicated by hand on
   every page — a change to a shared block means touching every page.
4. Add the page to `sitemap.xml`.

## The quoting clock

`assets/quotes.json` holds one entry per quarter-hour slot, keyed `"HH:MM"`
(24-hour): `{ "quote": "...", "title": "...", "author": "..." }`. Quotes are
stored without surrounding quotation marks — the component adds them. Slots
can be sparse; a missing slot borrows from the nearest populated one.

TODO: curate the full 96 slots. Eight public-domain samples are in place;
their wording should be double-checked against the source texts along the
way. The no-JS fallback (the C.S. Lewis quote) lives in each page's footer
markup, not in the JSON.

## Maintenance notes

- **sitemap.xml** — update `lastmod` whenever a page's content changes.
- **GoatCounter** — TODO: register at
  [goatcounter.com](https://www.goatcounter.com) and swap the
  `SROSEBATTLES_TODO` site code in the snippet on every page. Its script is
  deliberately the site's only third-party request.
- **robots.txt** — deny-by-default whitelist, grouped by category (search,
  AI, link previews, SEO tools, read-later, archives). New crawlers go in
  the matching group; anything unlisted stays blocked.
- **resume.pdf** — placeholder; swap in the real file at the same path.
- **Domain cutover** — the canonicals, OG URLs, sitemap, robots sitemap
  line, and every URL in `404.html` point at the github.io address. When
  `srosebattles.com` moves over: update them all, then add the CNAME file.
  (The full checklist is in `CLAUDE.md`.)
- **Placeholder copy** — anything flagged “to do · placeholder copy” on the
  page, or `TODO` in a comment, still needs real writing before it counts
  as done.
