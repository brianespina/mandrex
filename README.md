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
- **Google Fonts** — Archivo (headings) + Karla (body)
- **Vanilla JS** — mobile nav, services dropdown, contact form chips/success state

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

Keystatic's Astro integration adds server routes for the admin UI (`/keystatic` and `/api/keystatic`), so the project uses the `@astrojs/node` adapter. The public marketing pages are still prerendered to static HTML.

To deploy:

- **Node server**: run `node dist/server/entry.mjs`
- **Cloudflare Pages / other static hosts**: swap `@astrojs/node` for the appropriate adapter (e.g. `@astrojs/cloudflare`) and configure it in `astro.config.mjs`.

## Notes before launch

- **Contact form**: the success state is client-side only. Wire the form to a real endpoint (email service, Worker, or CRM) before launch.
- **Images**: all photography is stock. Replace with real team/office/client photos.
- **Testimonials**: quotes are samples/placeholders awaiting approved client feedback.
- **Service details**: turnaround times and tool lists are inferences — confirm with the client.
