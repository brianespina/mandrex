# Mandrex site — working notes

Raw material for a handoff document. Written 24 August 2026, covering the state
of the site and the things that are non-obvious from reading the code.

For stack, routes and folder layout, see `README.md`. This file is the *why*,
the traps, and the outstanding work.

---

## Architecture decisions worth knowing

### Content is Keystatic, not Astro content collections

Every entry under `src/content/` is YAML read through Keystatic's `createReader`
(`src/lib/keystatic.ts`). **Nothing imports `astro:content`.**

`src/content.config.ts` exists only to stop Astro auto-generating a
markdown-globbing collection per folder, which produced five "No files found
matching `**/*.md`" warnings on every dev start and build. An empty
`collections = {}` is *not* enough — Astro auto-generates any folder that is not
explicitly defined, so each one is declared against the real YAML.

### Keystatic Cloud commits straight to `main`

Saving in the CMS pushes a commit. Two consequences:

- Local work and CMS edits diverge easily. Pull before starting.
- A stale CMS save can delete files. This has happened: a save in August wiped
  four home-page images while leaving the YAML pointing at them, so the home
  page had broken images for days before anyone noticed. If images vanish, they
  are recoverable from git history.

### The world map is projected at build time

`src/lib/world-map-data.ts` is **generated** — do not hand-edit. Regenerate with:

```bash
curl -sLo /tmp/countries-110m.json \
  https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json
node scripts/generate-global-reach-map.mjs /tmp/countries-110m.json
```

The design handoff's prototype loaded d3 + topojson from a CDN and re-projected
in the browser on every resize. We project at build time instead, so **no
mapping library ships to the browser** — `d3-geo` and `topojson-client` are
devDependencies used only by that script. Source data is Natural Earth
(public domain).

Two things that caused real bugs here, both worth remembering:

- **Pins are HTML, not SVG.** The SVG has a fixed viewBox and scales with CSS,
  so anything *inside* it scales too. When the pins were SVG elements, the 11px
  labels rendered at ~3px on a phone. Geometry can scale; pixel-sized things
  cannot.
- **Pins live inside `.gmap__frame`.** They are positioned in percentages, so
  their containing block must be exactly the map. When it was `.gmap` — which
  also wraps the tooltip, detail card and chips — every pin sat too low, by
  ~15–45px on desktop and enough on mobile to throw the Australia pin clear off
  the map.

The arcs are a fixed Canada → US → UK → Australia chain baked into the generated
data. Removing a country in the CMS leaves a dangling arc; adding one requires
regenerating.

---

## Traps that have already bitten

**Astro scoped styles do not reach a child component's markup.** A rule like
`.site-nav__link svg { … }` in `Header.astro` compiles to
`svg[data-astro-cid-X]`, but an `<svg>` rendered by `Icon.astro` carries no such
attribute, so the rule silently never matches. Use `:global()`. This is why the
mobile chevron-hiding rule had never worked, and why the world map's yellow
overlay icons need `:global(svg *)`.

**Keystatic returns `null` for a field used as `slugField`.** The `services`
collection uses `slugField: "key"`, so `entry.key` is always `null` — the value
lives on `s.slug`. Icons were looked up by `entry.key` and rendered empty SVGs
sitewide until this was found.

**An unknown icon name renders an invisible empty `<svg>`, not a visible error.**
That is why the icon fields are now a dropdown, and why `Icon.astro` warns at
build time for unrecognised names.

**The global `* { box-sizing: border-box }` catches padded fixed-size boxes.**
The footer logo declared `height: 36px` with `10px/14px` plate padding, so the
logo itself rendered at 16px.

**CSS beats SVG presentation attributes.** The icon library bakes
`stroke="#306A42"` into its path strings, so a `stroke` prop cannot recolour
them — but a CSS rule can.

---

## CMS structure

Anything listed here is editable in Keystatic without a deploy.

| What | Where |
|---|---|
| Page sections | Pages → *page* → Page sections (drag to reorder) |
| Sector order | Site Settings → **Sector order** (drag) |
| Service order | Services → *service* → **Index number** (also printed on the card) |
| Icons | Any icon field — a dropdown, not free text |
| Form delivery keys | Site Settings → Form delivery |
| Testimonial photos | Testimonials → *entry* → Photo |
| Featured testimonial photo | Pages → *page* → the featured section → Author photo |

**Two ordering mechanisms, deliberately different.** A Keystatic *collection*
list is always sorted by slug and cannot be dragged, because each entry is a
separate file with no inherent order. Sectors therefore get their order from a
drag-reorderable **array** in Site Settings; a sector missing from that list
still renders, alphabetically, at the end — it can never silently vanish.
Services stay a collection (they are referenced by relationship fields
elsewhere) and order by their `index` field.

**The icon list lives in two places** — the drawings in `src/components/Icon.astro`
and the selectable options in `keystatic.config.ts`. Adding an icon means
touching both. Kept explicit so the CMS can offer a curated subset (UI glyphs
like `arrow` and `chevron` are deliberately not offered).

**Adding a map country** needs `scripts/generate-global-reach-map.mjs` updated —
the CMS only supplies the copy, not the geometry.

---

## Forms

Both forms post to **Web3Forms**, sharing `src/lib/inquiry.ts`.

- Contact form key and booking key are separate (Site Settings → Form delivery),
  so they have independent quotas and can route to different inboxes.
- The keys are **public by design** — they ship in the client bundle. They are
  not secrets. **Restrict each form to `mandrexvaservices.com` in the Web3Forms
  dashboard** — that is what stops abuse.
- With no key set, both forms fall back to opening the visitor's mail client
  with the fields pre-filled, so a submission is never silently lost.
- `replyto` is sent explicitly, so replying to a notification writes to the
  visitor rather than to Web3Forms.
- Both have honeypot fields.

The "Book a 30-minute call" button opens a modal. **Any CMS link set to `#book`
opens it**, so buttons can be pointed at it without code changes. It is a
*request* form, not a scheduler — it collects a preferred window and says so on
screen. Real scheduling would mean Calendly/Cal.com.

> Historical note worth keeping: the contact form never sent anything before
> this session. Its handler called `preventDefault()` and showed the success
> panel, with no action, no fetch and no API route. Every enquiry since launch
> was discarded while telling the visitor "Message received."

---

## Images

`src/integrations/optimize-images.mjs` runs at build, caps images at 1920px,
converts to WebP, and repoints the built HTML/CSS. **It only touches `dist/`** —
sources in `public/` and the paths stored in the CMS are untouched, so Keystatic
keeps working and originals stay recoverable.

Excluded on purpose:

- `mandrex-og.jpg` — social scrapers handle WebP poorly
- `mandrex-logo*.png` — they double as the favicon

This exists because five images had been uploaded at camera resolution (up to
6415×4277) when the largest any renders is ~1920px. Assets went 11MB → 2.1MB
across two passes.

Fonts are **self-hosted** (`public/fonts/`). Both families are variable fonts,
so the whole weight range is two woff2 files (64KB). This removed a
render-blocking third-party request *and* the transfer of every visitor's IP to
Google.

CSS is inlined (`build.inlineStylesheets: 'always'`) — the head now makes no
third-party requests at all.

---

## Before launch

**Only you can do these:**

- [ ] Restrict both Web3Forms forms to `mandrexvaservices.com`
- [ ] Submit `sitemap-index.xml` in Google Search Console
- [ ] Decide on analytics — nothing is installed, so launch-week data is not
      recoverable after the fact
- [ ] Confirm the service-detail figures with Nikka. Bookkeeping publishes
      "Monthly close: 5 business days" and "Onboarding: 1–2 weeks", plus tool
      lists across all four services. The README flagged these as inferred; they
      currently read as commitments.

**Small code items left:**

- [ ] The privacy policy's Google Fonts paragraph is now **inaccurate** — the
      fonts are self-hosted, so that transfer no longer happens. Remove it.
- [ ] Two dead files, ~412KB: `public/assets/home/sections/4/value/{main,inset}Image.webp`,
      orphaned when the world map replaced the photos.
- [ ] Photography is still stock apart from the testimonials closing band.
- [ ] `wrangler.jsonc` says `mandrex-site`, the dashboard says `mandrex`.
      Cosmetic; Cloudflare will keep offering to PR it.

**Not verified in a browser.** There is no browser in the environment this was
built in, so these were confirmed structurally (built HTML, compiled CSS) but
never clicked:

- the booking modal's open/close, focus trap and submit path
- the world map's hover, tooltip clamping, and the switch to a static detail
  card below 430px of map width
- the sectors hover-reveal overlay

---

## Accessibility notes

- **Sector cards** are non-interactive `<div>`s, so their hover-revealed
  descriptions are unreachable by keyboard. `:focus-within` is wired but inert
  until something focusable is inside. Making all 15 focusable would add 15 tab
  stops to non-interactive content — judged worse. The descriptions stay in the
  DOM at `opacity: 0`, so screen readers do announce them; the gap is
  specifically sighted keyboard users.
- The booking modal has a focus trap, Escape and backdrop close, and focus
  restore.
- Map pins are real `<button>`s with `aria-label`s.
- Decorative images use `alt=""` deliberately.

---

## Copy that may need a second look

- The sectors intro says **"Hover any sector for detail"** — inaccurate on touch,
  where descriptions render inline. Suggest "Tap or hover".
- Testimonial quotes are verbatim, trimmed only at sentence boundaries. Two
  typos were normalised (`NIkka` → `Nikka`, a stray space before a comma).
  Christina writes "Nikki" where others write "Nikka" — left as she wrote it.
- Upwork reviewers are not named publicly, so those are attributed to the
  project, not to invented people.
