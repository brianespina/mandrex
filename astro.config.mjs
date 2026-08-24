import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mandrexvaservices.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    react(),
    keystatic(),
    sitemap({
      // only the public marketing pages belong in the sitemap: the CMS and its
      // API are server routes, and a 404 should never be submitted for indexing
      filter: (page) =>
        !page.includes('/keystatic') && !page.includes('/api/') && !page.endsWith('/404'),
    }),
  ],
  build: {
    // The whole site's CSS is ~12KB, small enough that inlining it removes two
    // render-blocking requests from the critical path for less than it costs in
    // per-page duplication.
    inlineStylesheets: 'always',
  },
  vite: {
    ssr: {
      external: ['node:path', 'node:fs/promises'],
    },
    optimizeDeps: {
      exclude: ['@keystatic/astro', '@keystatic/core'],
    },
  },
});
