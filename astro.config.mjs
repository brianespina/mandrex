import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mandrexvaservices.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [react(), keystatic()],
  vite: {
    optimizeDeps: {
      exclude: ['astro:env/server'],
    },
    ssr: {
      external: ['astro:env/server', 'node:path', 'node:fs/promises'],
    },
    build: {
      rollupOptions: {
        external: ['astro:env/server'],
      },
    },
  },
});
