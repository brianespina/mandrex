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
    ssr: {
      external: ['node:path', 'node:fs/promises'],
    },
  },
});
