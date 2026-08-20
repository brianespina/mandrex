# Mandrex VA Services — Marketing Website

A static, high-fidelity marketing site for Mandrex VA Services built with [Astro](https://astro.build/).

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
- **TypeScript** — typed data/config
- **Google Fonts** — Archivo (headings) + Karla (body)
- **Vanilla JS** — mobile nav, services dropdown, contact form chips/success state

## Project structure

```
src/
  components/       # Header, Footer, CTABand, ServiceDetail, Icon, etc.
  data/site.ts      # Services, industries, testimonials, stats, nav data
  layouts/Layout.astro
  pages/            # One .astro file per route
  styles/global.css # Design tokens + shared utilities
public/assets/      # Logos + photography
```

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server
npm run build     # static build to dist/
npm run preview   # preview the built site
```

## Deployment

The site builds to `dist/` as static HTML. Any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages) will serve `dist/404.html` automatically for unmatched routes.

## Notes before launch

- **Contact form**: the success state is client-side only. Wire the form to a real endpoint (email service, Worker, or CRM) before launch.
- **Images**: all photography is stock. Replace with real team/office/client photos.
- **Testimonials**: quotes are samples/placeholders awaiting approved client feedback.
- **Service details**: turnaround times and tool lists are inferences — confirm with the client.
