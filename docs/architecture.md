# Architecture notes

The decisions that are not obvious from reading the code, the traps that have
already cost time, and how the content model actually works.

For stack, routes, folder layout and commands, see the
[README](../README.md). For the domain, the zone and the hosting cutover, see
[`dns.md`](dns.md).

---

## Content model

### Content is Keystatic, not Astro content collections

Every entry under `src/content/` is YAML read through Keystatic's
`createReader` (`src/lib/keystatic.ts`). **Nothing imports `astro:content`.**

`src/content.config.ts` exists only to stop Astro auto-generating a
markdown-globbing collection per folder, which produced five "No files found
matching `**/*.md`" warnings on every dev start and build. An empty
`collections = {}` is *not* enough — Astro auto-generates any folder that is not
explicitly defined, so each one is declared against the real YAML.

### Keystatic Cloud commits straight to `main`

Saving in the CMS pushes a commit. Two consequences:

- **Local work and CMS edits diverge easily. Pull before starting.**
- **A stale CMS session can delete files.** This has happened: a save wrote back
  an older state of the tree and removed four home-page images while leaving the
  YAML still pointing at them, so the home page carried broken images until it
  was spotted. Anything lost this way is recoverable from git history.

### Two ordering mechanisms, deliberately different

A Keystatic *collection* list is always sorted by slug and cannot be dragged,
because each entry is a separate file with no inherent order.

- **Sectors** therefore take their order from a drag-reorderable **array** in
  Site Settings. A sector missing from that list still renders, alphabetically,
  at the end — it can never silently vanish.
- **Services** stay a collection, because they are referenced by relationship
  fields elsewhere, and order by their `index` field.

### What is editable without a deploy

| What | Where in the CMS |
|---|---|
| Page sections | Pages → *page* → Page sections (drag to reorder) |
| Sector order | Site Settings → **Sector order** (drag) |
| Service order | Services → *service* → **Index number** (also printed on the card) |
| Icons | Any icon field — a dropdown, not free text |
| Form delivery keys | Site Settings → Form delivery |
| Testimonial photos | Testimonials → *entry* → Photo |
| Featured testimonial photo | Pages → *page* → the featured section → Author photo |

**The icon list lives in two places** — the drawings in
`src/components/Icon.astro` and the selectable options in `keystatic.config.ts`.
Adding an icon means touching both. This is kept explicit so the CMS can offer a
curated subset; UI glyphs like `arrow` and `chevron` are deliberately not
offered.

---

## The global reach map

`src/lib/world-map-data.ts` is **generated — do not hand-edit.** Regenerate with:

```bash
curl -sLo /tmp/countries-110m.json \
  https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json
node scripts/generate-global-reach-map.mjs /tmp/countries-110m.json
```

The original design prototype loaded d3 + topojson from a CDN and re-projected
in the browser on every resize. This projects at build time instead, so **no
mapping library ships to the browser** — `d3-geo` and `topojson-client` are
devDependencies used only by that script. Source data is Natural Earth
(public domain).

Two things here caused real bugs and are worth remembering:

- **Pins are HTML, not SVG.** The SVG has a fixed viewBox and scales with CSS,
  so anything *inside* it scales too. When the pins were SVG elements, the 11px
  labels rendered at ~3px on a phone. Geometry can scale; pixel-sized things
  cannot.
- **Pins live inside `.gmap__frame`.** They are positioned in percentages, so
  their containing block must be exactly the map. When it was `.gmap` — which
  also wraps the tooltip, detail card and chips — every pin sat too low, by
  ~15–45px on desktop, and enough on mobile to throw the Australia pin clear off
  the map.

The arcs are a fixed Canada → US → UK → Australia chain baked into the generated
data. Removing a country in the CMS leaves a dangling arc; adding one requires
regenerating. **The CMS supplies the copy, not the geometry** — adding a country
means editing `scripts/generate-global-reach-map.mjs`.

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
That is why the icon fields are a dropdown, and why `Icon.astro` warns at build
time for unrecognised names.

**The global `* { box-sizing: border-box }` catches padded fixed-size boxes.**
The footer logo declared `height: 36px` with `10px/14px` plate padding, so the
logo itself rendered at 16px.

**CSS beats SVG presentation attributes.** The icon library bakes
`stroke="#306A42"` into its path strings, so a `stroke` prop cannot recolour
them — but a CSS rule can.

---

## Forms

Both forms post to **Web3Forms**, sharing `src/lib/inquiry.ts`.

- The contact key and the booking key are **separate** (Site Settings → Form
  delivery), so they have independent quotas and can route to different inboxes.
- The keys are **public by design** — they ship in the client bundle. They are
  not secrets. What prevents abuse is the **Restrict to Domain** setting in the
  Web3Forms dashboard, which must be set to `www.mandrexvaservices.com`.
  **It fails closed and it fails silently:** an apex-only value rejects every
  submission while the visitor still sees "Message received."
- With no key set, both forms fall back to opening the visitor's mail client
  with the fields pre-filled, so a submission is never silently lost.
- `replyto` is sent explicitly, so replying to a notification writes to the
  visitor rather than to Web3Forms.
- Both have honeypot fields.

The "Book a 30-minute call" button opens a modal. **Any CMS link set to `#book`
opens it**, so buttons can be pointed at it without code changes. It is a
*request* form, not a scheduler — it collects a preferred window and says so on
screen. Real scheduling would mean Calendly or Cal.com.

---

## Images and fonts

`src/integrations/optimize-images.mjs` runs at build, caps images at 1920px,
converts to WebP, and repoints the built HTML/CSS. **It only touches `dist/`** —
sources in `public/` and the paths stored in the CMS are untouched, so Keystatic
keeps working and originals stay recoverable.

Excluded on purpose:

- `mandrex-og.jpg` — social scrapers handle WebP poorly
- `mandrex-logo*.png` — they double as the favicon

This exists because images had been uploaded at camera resolution (up to
6415×4277) when the largest any renders is ~1920px. Assets went 11MB → 2.1MB
across two passes.

Fonts are **self-hosted** (`public/fonts/`). Both families are variable fonts,
so the whole weight range is two woff2 files (64KB). This removed a
render-blocking third-party request *and* the transfer of every visitor's IP to
Google.

CSS is inlined (`build.inlineStylesheets: 'always'` — the whole site's CSS is
~12KB). **The head makes no third-party requests at all**, which is a property
worth preserving; adding one back would also make the privacy policy wrong.

---

## Accessibility

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

## Copy decisions

Deliberate, so they don't get "fixed" later:

- Testimonial quotes are **verbatim**, trimmed only at sentence boundaries. Two
  typos were normalised (a misspelling of the founder's name, and a stray space
  before a comma). One reviewer spells the founder's name differently from
  everyone else throughout — left as written, because it is their review.
- **Upwork reviewers are not named publicly**, so those testimonials are
  attributed to the project rather than to invented people.
- The sectors intro reads **"Hover any sector for detail"**, which is inaccurate
  on touch, where the descriptions render inline. "Tap or hover" would be
  correct.

---

## Verified structurally, not in a browser

These were confirmed against the built HTML and compiled CSS but never
exercised by clicking. Test them by hand if you touch the surrounding code:

- the booking modal's open/close, focus trap and submit path
- the world map's hover, tooltip clamping, and the switch to a static detail
  card below 430px of map width
- the sectors hover-reveal overlay

---

## Open items

Verified against the repository and live DNS on **29 August 2026**.

**Code**

- [ ] `src/pages/privacy.astro` still lists **Google Fonts** as a third party
      receiving visitor IP addresses. The fonts are self-hosted, so that
      transfer no longer happens and the statement is inaccurate. Remove that
      list item.
- [ ] Two orphaned images, ~253KB, left behind when the world map replaced the
      photos: `public/assets/home/sections/4/value/{main,inset}Image.webp`.

**Content**

- [ ] Photography is stock apart from the testimonials closing band.
- [ ] The service-detail figures — turnaround times, onboarding windows and
      tool lists across all four services — were inferred during the build and
      have not been confirmed by the business. They currently read as published
      commitments to clients.

**Configuration, outside this repository**

- [ ] Confirm the Web3Forms **Restrict to Domain** value is
      `www.mandrexvaservices.com` on **both** forms. It fails closed and
      silently, so this cannot be verified by looking at the site.
- [ ] Submit `sitemap-index.xml` in Google Search Console, as a **Domain**
      property (see [`dns.md`](dns.md#canonical-hostname-www)).

DNS and mail items are tracked in [`dns.md`](dns.md#outstanding).
