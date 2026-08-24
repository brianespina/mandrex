# Mandrex VA Services — Marketing Website

A marketing site for Mandrex VA Services built with [Astro](https://astro.build/) and [Keystatic](https://keystatic.com/). All page content is editable through Keystatic's visual CMS, with reusable sections that can be assembled on any page like a page builder.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, services grid, industries, testimonials feature, CTA |
| `/services` | Services overview + engagement process |
| `/services/bookkeeping` | Bookkeeping service detail |
| `/services/administrative-support` | Administrative Support service detail |
| `/services/customer-support` | Customer Support service detail |
| `/services/executive-assistance` | Executive Assistance service detail |
| `/about` | About us, founder note, vision/mission, team |
| `/testimonials` | Client testimonials |
| `/contact` | Contact form + contact details |
| `/404` | 404 page |

## Tech stack

- **Astro** — static site generator
- **Keystatic** — visual CMS / page builder
- **React** — required by Keystatic's admin UI
- **TypeScript** — typed data/config
- **Self-hosted fonts** — Archivo (headings) + Karla (body), variable woff2 in `public/fonts/`
- **Vanilla JS** — mobile nav, services dropdown, forms, booking modal, world map interactions

## Project structure

```
src/
  components/            # Header, Footer, CTABand, Icon, SectionRenderer, etc.
  components/sections/   # Page-builder section components (Hero, CTA, etc.)
  content/               # Keystatic content collections
    pages/               # Page entries with section arrays
    reusable-sections/   # Reusable section blocks
    services/            # Service detail data
    testimonials/        # Testimonial entries
    industries/          # Industry entries
    site.yaml            # Site settings (nav, footer, contact, socials)
  layouts/Layout.astro
  lib/keystatic.ts       # Keystatic reader helpers
  pages/                 # One .astro file per route
  styles/global.css      # Design tokens + shared utilities
public/assets/           # Logos + photography
keystatic.config.ts      # Keystatic schema & collections
```

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (Keystatic UI at /keystatic)
npm run build     # build to dist/
npm run preview   # preview the built site
```

## Accessing Keystatic (local)

```bash
npm run dev
```

Open:

```
http://localhost:4321/keystatic
```

The admin UI lets you edit:

- **Pages** — add, remove, reorder and edit page sections
- **Reusable Sections** — build sections once and reuse them across pages
- **Services** — edit service detail pages
- **Testimonials** — client quotes
- **Industries** — industry grid items
- **Site Settings** — navigation, footer, contact info, social links

## Keystatic Cloud setup

This project is configured to use **Keystatic Cloud**:

```ts
// keystatic.config.ts
storage: { kind: 'cloud' }
```

To connect it:

1. Go to [https://keystatic.cloud](https://keystatic.cloud) and create a project.
2. Connect the GitHub repo that holds this site.
3. Keystatic Cloud will provide environment variables (usually `KEYSTATIC_URL` and `KEYSTATIC_SECRET`). Add them to your deployment environment.
4. For local development, Keystatic will prompt you to authenticate with Keystatic Cloud when you open `/keystatic`.

If you prefer to store content locally (no cloud), change `keystatic.config.ts` to:

```ts
storage: { kind: 'local' }
```

## Deployment notes

Keystatic's Astro integration adds server routes for the admin UI (`/keystatic` and `/api/keystatic`), so the project uses the `@astrojs/cloudflare` adapter and deploys to **Cloudflare Pages**.

The public marketing pages are prerendered to static HTML. Only the Keystatic admin routes run on Cloudflare Workers.

### Cloudflare Pages settings

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18 or higher

## Notes before launch

See **[HANDOFF.md](./HANDOFF.md)** for the current state, the non-obvious
decisions, and the outstanding checklist.

Resolved since this list was written: the contact form now actually sends (it
previously discarded every submission), testimonials are real client reviews,
and images are optimised and converted at build time.

Still open:

- **Web3Forms**: restrict both forms to `mandrexvaservices.com` in the dashboard.
  The access keys are public by design, so this is what prevents abuse.
- **Analytics**: nothing is installed.
- **Service details**: turnaround times and tool lists are inferences — confirm
  with the client. They currently read as published commitments.
- **Images**: photography is still stock apart from the testimonials closing band.
