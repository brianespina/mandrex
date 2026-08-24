import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// This site does not read content through astro:content — every entry is YAML
// loaded via Keystatic's reader (see src/lib/keystatic.ts). These definitions
// exist only so Astro stops auto-generating a markdown-globbing collection per
// folder under src/content/, which warned "No files found matching **/*.md".
const yaml = (dir: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: `./src/content/${dir}` }),
  });

export const collections = {
  industries: yaml('industries'),
  pages: yaml('pages'),
  'reusable-sections': yaml('reusable-sections'),
  services: yaml('services'),
  testimonials: yaml('testimonials'),
};
