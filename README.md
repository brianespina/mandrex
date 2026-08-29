# Mandrex VA Services — marketing website

A marketing site for Mandrex VA Services built with [Astro](https://astro.build/)
and [Keystatic](https://keystatic.com/). All page content is editable through
Keystatic's visual CMS, with reusable sections that can be assembled on any page
like a page builder.

Live at **<https://www.mandrexvaservices.com>**, deployed as a **Cloudflare
Worker** named `mandrex`.

## Documentation

| Document | For | Contents |
|---|---|---|
| [`docs/CONTENT-EDITING.md`](docs/CONTENT-EDITING.md) | Anyone editing content | Step-by-step CMS guide: every collection, every field group, how edits publish |
| [`docs/site-guide.md`](docs/site-guide.md) | Site owner | The site at a glance, where enquiries go, which accounts it depends on |
| [`docs/architecture.md`](docs/architecture.md) | Developers | Design decisions, the CMS data model, and the traps that have already cost time |
| [`docs/dns.md`](docs/dns.md) | Developers | The zone, the Namecheap → Cloudflare cutover, and the rules that follow from it |

Read [`docs/architecture.md`](docs/architecture.md) before making any change.
It documents behaviour that is not visible in the code and has already caused
real bugs.

## Prerequisites

| | Version | Why |
|---|---|---|
| **Node.js** | **22 or newer** | `wrangler@4` declares `engines.node >= 22`. Astro 5 accepts `18.20.8 \|\| ^20.3.0 \|\| >=22`, and `sharp` needs `>= 20.9`, so 22 is the intersection. |
| **npm** | 9.6.5 or newer | Astro's declared minimum. |

> **Nothing in this repository pins the Node version.** There is no `.nvmrc`, no
> `engines` field in `package.json`, and no CI configuration. The version above
> was derived from the dependencies' own `engines` fields, not from a project
> declaration. If you are setting this project up again, adding an `.nvmrc`
> containing `22` is worth doing first.

A Cloudflare account with access to the `mandrex` Worker is required to deploy.
A Keystatic Cloud account is required to use the CMS. See
[Accounts this site depends on](#accounts-this-site-depends-on).

## Install, develop, build, deploy

```bash
npm install            # install dependencies

npm run dev            # dev server on http://localhost:4321 (CMS at /keystatic)
npm run build          # build to dist/
npm run preview        # serve the built output locally

npm run build && npx wrangler deploy    # deploy to Cloudflare
```

There is no `deploy` npm script — `wrangler deploy` is invoked directly, and it
uploads whatever is already in `dist/`. **It does not build first.** Always run
`npm run build` immediately before deploying, or you will ship the previous
build.

The underlying commands, for reference:

| Script | Runs |
|---|---|
| `dev` | `astro dev` |
| `build` | `astro build` |
| `preview` | `astro preview` |
| `astro` | `astro` (passthrough, e.g. `npm run astro -- check`) |

## Environment variables

**This project requires no environment variables and no Worker secrets.**
`npx wrangler secret list --name mandrex` returns `[]`, and that is correct — a
deploy with an empty environment is fully functional.

Nothing in `src/` reads `import.meta.env`, `process.env`, or a Worker `env`
binding. There is no `.env` file, and none has ever been committed.

Three variable names do appear in the built Worker bundle:

```
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
```

**They are not needed here, and setting them would have no effect.** They belong
to Keystatic's `storage: { kind: 'github' }` mode. This site uses
`storage: { kind: 'cloud' }`, and Keystatic's API handler returns `404` for
every `/api/keystatic/*` request before it ever looks at them
(`@keystatic/core/dist/keystatic-core-api-generic.js` checks `storage.kind`
first). The reads are wrapped so an absent variable yields `undefined` rather
than throwing.

If the site is ever switched to GitHub storage, all three become required
secrets. While it stays on Keystatic Cloud, treat them as dead names.

## Configuration

**`astro.config.mjs`**

- `site: 'https://www.mandrexvaservices.com'` — drives canonical tags,
  `og:url` and both sitemap files. `www` is canonical; the apex `301`s to it.
- `output: 'server'` with the `@astrojs/cloudflare` adapter. Every marketing
  page nonetheless sets `export const prerender = true`, so only Keystatic's
  admin routes are server-rendered.
- Integrations: `react` (Keystatic's admin UI only — no React reaches
  visitors), `keystatic`, `sitemap` (filters out `/keystatic`, `/api/` and
  `/404`), and the local `optimize-images` integration.
- `build.inlineStylesheets: 'always'` — the site's CSS is ~12KB, so it is
  inlined rather than fetched.

**`wrangler.jsonc`**

- Worker name `mandrex`, entry `./dist/_worker.js/index.js`
- `compatibility_date: 2025-04-01`, `compatibility_flags: ["nodejs_compat"]`
- `observability.enabled: true`
- One binding: `ASSETS`, the static-asset binding serving `./dist`
- **No KV, D1, R2, Durable Object, Queue, Hyperdrive, service or cron bindings,
  and no `vars` block.** The file is complete as written.

Custom domains for the apex and `www` are attached to the Worker in the
Cloudflare dashboard, not in `wrangler.jsonc`.

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
| `/keystatic` | CMS admin UI (server-rendered, `Disallow`ed in `robots.txt`) |

Service page routes do not match their CMS keys. The mapping lives in
`getServiceUrl()` in `src/lib/keystatic.ts`.

## Tech stack

- **Astro 5** — `output: 'server'`, but every marketing page is prerendered
- **Keystatic** — visual CMS / page builder, storage kind `cloud`
- **React 18** — required by Keystatic's admin UI only; no React ships to visitors
- **TypeScript** — typed data/config
- **Self-hosted fonts** — Archivo (headings) + Karla (body), variable woff2 in `public/fonts/`
- **Vanilla JS** — mobile nav, services dropdown, forms, booking modal, world map

The site loads **no third-party resources at runtime** — no analytics, no
pixels, no embedded scripts, no CDN fonts. The only outbound call is the form
submission described below, and it happens only when a visitor submits a form.
`src/pages/privacy.astro` states this, so preserve it.

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
  layouts/Layout.astro   # <head>, meta, Open Graph, font preloads
  lib/
    keystatic.ts         # Keystatic reader helpers + ordering rules
    inquiry.ts           # Shared form submission logic
    world-map-data.ts    # GENERATED — see docs/architecture.md
  pages/                 # One .astro file per route
  styles/global.css      # Design tokens, @font-face, shared utilities
public/
  assets/                # Logos + photography (CMS upload target)
  fonts/                 # Self-hosted variable woff2
  robots.txt
  .assetsignore          # Keeps _worker.js and _routes.json out of the asset bundle
scripts/
  generate-global-reach-map.mjs   # Regenerates src/lib/world-map-data.ts
docs/                    # See the documentation table above
keystatic.config.ts      # Keystatic schema & collections
astro.config.mjs
wrangler.jsonc           # Cloudflare Worker config
```

## Where content lives

All editable content is **YAML under `src/content/`**, committed to this
repository. There is no database.

| Path | What it holds |
|---|---|
| `src/content/pages/*.yaml` | One file per page, each an ordered array of sections |
| `src/content/reusable-sections/*.yaml` | Section blocks referenced from multiple pages |
| `src/content/services/*.yaml` | The four service lines |
| `src/content/testimonials/*.yaml` | Client testimonials |
| `src/content/industries/*.yaml` | The 15 sectors |
| `src/content/site.yaml` | Navigation, footer, contact details, socials, form keys, sector order |

These files are read through Keystatic's `createReader`, **not** through
`astro:content`. `src/content.config.ts` exists only to suppress Astro's
auto-generated markdown collections; nothing imports from it.

## Where images live

`public/assets/`, which is the directory Keystatic uploads into
(`imageField` in `keystatic.config.ts` sets `directory: "public/assets/"`,
`publicPath: "/assets/"`).

Paths under `public/assets/<page>/sections/<n>/value/<field>.<ext>` are
generated by Keystatic per entry and per field — **do not rename or reorganise
them by hand**, as the YAML references them by exact path.

`src/integrations/optimize-images.mjs` runs on `astro:build:done`, caps images
at 1920px, converts JPEG/PNG to WebP and repoints the built HTML/CSS. **It only
touches `dist/`.** Sources in `public/` and the paths stored in the CMS are
never modified, so oversized uploads are handled automatically and originals
stay recoverable. `mandrex-og.jpg` and `mandrex-logo*.png` are excluded on
purpose.

## The CMS

Run `npm run dev` and open <http://localhost:4321/keystatic>. In production it
is at <https://www.mandrexvaservices.com/keystatic>.

Storage is **Keystatic Cloud** — `storage: { kind: 'cloud' }` with
`cloud.project: 'mandrex/mandrex'` in `keystatic.config.ts`. Saving in the CMS
**commits directly to `main`** in this repository via the `keystatic-cloud[bot]`
GitHub App, which triggers a rebuild and deploy. There is no separate publish
step and no draft state.

Two consequences that have already caused problems:

- **Pull before starting local work.** CMS edits and local commits diverge fast.
- **A stale CMS browser session can write back an older tree and delete files.**
  This has happened. Anything lost this way is recoverable from git history.

To work entirely offline, change `storage` to `{ kind: 'local' }` — but see the
constraint in [`docs/architecture.md`](docs/architecture.md) first.

For a field-by-field editing guide, see
[`docs/CONTENT-EDITING.md`](docs/CONTENT-EDITING.md).

## Deployment

The site deploys to **Cloudflare Workers** (not Pages) as the Worker named
`mandrex`. The `@astrojs/cloudflare` adapter is required because Keystatic's
Astro integration adds server routes for the admin UI (`/keystatic` and
`/api/keystatic`); everything else is prerendered static HTML served from the
`ASSETS` binding.

```bash
npm run build
npx wrangler deploy
```

Custom domains are attached for both the apex and `www`. **`www` is the
canonical hostname** — the apex issues a path-preserving `301` to it, and
anything scoped to a hostname must name `www`. See
[`docs/dns.md`](docs/dns.md#canonical-hostname-www).

## Forms

Both the contact form and the "Book a 30-minute call" modal post to
**Web3Forms** (`https://api.web3forms.com/submit`) through the shared helper in
`src/lib/inquiry.ts`.

- The two access keys live in the CMS under **Site Settings → Form delivery**,
  and are committed in `src/content/site.yaml`.
- **Web3Forms access keys are public by design.** They ship in the client
  bundle and grant nothing but the ability to submit that one form. They are not
  secrets and do not belong in a secret store.
- What prevents abuse is the **Restrict to Domain** setting in the Web3Forms
  dashboard, which must be `www.mandrexvaservices.com`. **It fails closed and
  silently** — a wrong value rejects every submission while the visitor still
  sees "Message received."
- With no key set, both forms fall back to opening the visitor's mail client
  with the fields pre-filled, so a submission is never silently lost.

The booking modal is opened by any CMS link set to `#book`. It sends a call
*request*; it is not connected to a calendar.

## Accounts this site depends on

| Service | Role |
|---|---|
| **Squarespace Domains** | Registrar for `mandrexvaservices.com`. Expires **2027-07-05**. |
| **Cloudflare** | DNS and hosting. Serves the site and holds every DNS record, including mail. |
| **Keystatic Cloud** | CMS authentication and the `mandrex/mandrex` project. |
| **GitHub** | Stores code and content. Keystatic Cloud commits here on every save. |
| **Web3Forms** | Delivers form submissions. Two forms, two keys. |
| **Google Workspace** | Email. Predates the site and is unaffected by it. |

Two settings on that list fail silently if wrong, and both must use the `www`
hostname: the **Web3Forms domain restriction** and the **Keystatic Cloud project
URL**. See [`docs/dns.md`](docs/dns.md#canonical-hostname-www).

## Licensing and attribution

- **Fonts** — Archivo and Karla, self-hosted as latin-subset variable woff2 in
  `public/fonts/`. Both are open-source families published under the SIL Open
  Font License 1.1. **No copy of the OFL is included in this repository**; the
  licence requires it to travel with the font files. Add
  `public/fonts/OFL.txt` from the upstream font projects.
- **Icons** — hand-authored SVG path data in `src/components/Icon.astro`. No
  icon library is used and no icon package is a dependency.
- **Photography** — stock, apart from the testimonials closing band. No licence
  records, receipts or attribution files are stored in this repository, and all
  EXIF/IPTC metadata was stripped during optimisation, so provenance cannot be
  recovered from the files. See
  [`docs/architecture.md`](docs/architecture.md#open-items).
- **Map data** — Natural Earth, public domain, baked into
  `src/lib/world-map-data.ts` at build time.
- `src/components/Footer.astro` carries a **"Website by Brian Espina"**
  credit link. Removing it is a one-line edit.
