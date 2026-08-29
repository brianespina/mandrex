# Mandrex VA Services — marketing website

A marketing site for Mandrex VA Services built with [Astro](https://astro.build/)
and [Keystatic](https://keystatic.com/). All page content is editable through
Keystatic's visual CMS, with reusable sections that can be assembled on any page
like a page builder.

Live at **<https://www.mandrexvaservices.com>**.

## Documentation

| Document | For | Contents |
|---|---|---|
| [`docs/site-guide.md`](docs/site-guide.md) | Site owner | Editing content, where enquiries go, which accounts the site depends on |
| [`docs/architecture.md`](docs/architecture.md) | Developers | Design decisions, the CMS data model, and the traps that have already cost time |
| [`docs/dns.md`](docs/dns.md) | Developers | The zone, the Namecheap → Cloudflare cutover, and the rules that follow from it |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, services, why choose us, sectors, global reach map, testimonial, CTA |
| `/services` | Services overview + engagement process |
| `/services/bookkeeping` | Bookkeeping service detail |
| `/services/administrative-support` | Administrative Support service detail |
| `/services/customer-support` | Customer Support service detail |
| `/services/executive-assistance` | Executive Assistance service detail |
| `/about` | About us, founder note, vision/mission, team |
| `/testimonials` | Client testimonials |
| `/contact` | Contact form + contact details |
| `/privacy` | Privacy policy |
| `/404` | Not found |

## Tech stack

- **Astro 5** — `output: 'server'`, but every marketing page is prerendered
- **Keystatic** — visual CMS / page builder, storage kind `cloud`
- **React** — required by Keystatic's admin UI only; no React ships to visitors
- **TypeScript** — typed data/config
- **Self-hosted fonts** — Archivo (headings) + Karla (body), variable woff2 in `public/fonts/`
- **Vanilla JS** — mobile nav, services dropdown, forms, booking modal, world map

## Project structure

```
src/
  components/            # Header, Footer, CTABand, Icon, SectionRenderer, etc.
  components/sections/   # Page-builder section components (Hero, CTA, etc.)
  content/               # Keystatic content collections (YAML)
    pages/               # Page entries with section arrays
    reusable-sections/   # Reusable section blocks
    services/            # Service detail data
    testimonials/        # Testimonial entries
    industries/          # Sector entries
    site.yaml            # Site settings (nav, footer, contact, socials, form keys)
  integrations/
    optimize-images.mjs  # Build-time image cap + WebP conversion (dist/ only)
  layouts/Layout.astro
  lib/
    keystatic.ts         # Keystatic reader helpers
    inquiry.ts           # Shared form submission logic
    world-map-data.ts    # GENERATED — see docs/architecture.md
  pages/                 # One .astro file per route
  styles/global.css      # Design tokens + shared utilities
public/
  assets/                # Logos + photography
  fonts/                 # Self-hosted variable woff2
scripts/
  generate-global-reach-map.mjs   # Regenerates src/lib/world-map-data.ts
keystatic.config.ts      # Keystatic schema & collections
wrangler.jsonc           # Cloudflare Worker config
```

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (Keystatic UI at /keystatic)
npm run build     # build to dist/
npm run preview   # preview the built site
```

## The CMS

Run `npm run dev` and open <http://localhost:4321/keystatic>. In production it is
at <https://www.mandrexvaservices.com/keystatic>.

The admin UI edits **Pages** (add, remove, reorder and edit page sections),
**Reusable Sections**, **Services**, **Testimonials**, **Industries** (sectors)
and **Site Settings** (navigation, footer, contact info, social links, form
delivery keys).

Storage is **Keystatic Cloud** (`storage: { kind: 'cloud' }` in
`keystatic.config.ts`), which commits directly to `main` on save. Read
[`docs/architecture.md`](docs/architecture.md) before working locally — that
behaviour has consequences.

To work without the cloud, switch to `storage: { kind: 'local' }`.

## Deployment

The site deploys to **Cloudflare Workers** (not Pages) as the Worker named
`mandrex`, configured in `wrangler.jsonc`. The `@astrojs/cloudflare` adapter is
required because Keystatic's Astro integration adds server routes for the admin
UI (`/keystatic` and `/api/keystatic`); everything else is prerendered static
HTML served from the `ASSETS` binding.

Custom domains are attached for both the apex and `www`. **`www` is the
canonical hostname** — the apex issues a path-preserving `301` to it, and
anything scoped to a hostname must name `www`. See
[`docs/dns.md`](docs/dns.md#canonical-hostname-www).

```bash
npx wrangler deploy      # after npm run build
```
