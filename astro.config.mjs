import { defineConfig } from "astro/config";
import keystatic from "@keystatic/astro";
import node from "@astrojs/cloudflare";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://mandrexvaservices.com",
  output: "static",
  adapter: node({ mode: "standalone" }),
  integrations: [react(), keystatic()],
  vite: {
    optimizeDeps: {
      exclude: ["astro:env/server"],
    },
    ssr: {
      external: ["astro:env/server"],
    },
    build: {
      rollupOptions: {
        external: ["astro:env/server"],
      },
    },
  },
});
